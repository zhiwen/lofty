/**
 * @module lofty/kernel/module
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130315
 * */


lofty( 'module', ['global','cache','lang','event'],
    function( global, cache, lang, event ){
    'use strict';
    
    /**
     * Thanks to:
     * RequireJS, http://requirejs.org/
     * SeaJS, http://seajs.org/
     * cujo.js, http://cujojs.com/
     * HexJS, http://hexjs.edgarhoo.org/
     * */
     
    var EMPTY_ID = '',
        EMPTY_DEPS = [],
        ANONYMOUS_PREFIX = '__!_lofty_anonymous_';
        
    var anonymousIndex = 0;
    
    var modulesCache = cache.modules = {};
    
    
    var module = {
        get: function( id ){
            var meta = { id: id };
            event.emit( 'alias', meta );
            
            return modulesCache[meta.id];
        },
        has: function( id ){
            return ( module.get( id ) || keyModules[id] ) ? true : false;
        },
        hasDefine: function( id ){
            return modulesCache[id] ? true : false;
        },
        isAnon: function( mod ){
            return mod.id === EMPTY_ID;
        },
        save: function( mod ){
            modulesCache[mod._id || mod.id] = mod;
        },
        autocompile: function( mod ){
            module.isAnon( mod ) && module.compile( mod );
        },
        compile: function( mod ){
            compile( mod );
        },
        require: function( id ){
            return require( id );
        }
    };
    
    
    /**
     * module constructor
     * @param {string} module id
     * @param {array} module's dependencies
     * @param {object} module factory
     * */
    var Module = function( id, deps, factory ){
        
        this.id = id;
        this.deps = deps || [];
        this.factory = factory;
        this.exports = {};
        this.visits = 0;
        
        if ( id === EMPTY_ID ){
            id = ANONYMOUS_PREFIX + anonymousIndex;
            anonymousIndex++;
            this._id = id;
        }
    };
    
    
    /**
     * define a module
     * @param {string} module's id
     * @param {array} module's dependencies
     * @param {object|function} module's factory
     * */
    var define = function( id, deps, factory ){
        
        var mod,
            argsLength = arguments.length;
        
        if ( argsLength === 1 ){
            factory = id;
            id = EMPTY_ID;
        } else if ( argsLength === 2 ){
            factory = deps;
            deps = EMPTY_DEPS;
            if ( !lang.isString(id) ){
                deps = id;
                id = EMPTY_ID;
            }
        }
        
        if ( module.hasDefine( id ) ){
            event.emit( 'existed', { id: id } );
            return null;
        }
        
        mod = new Module( id, deps, factory );
        event.emit( 'define', mod );
        
        module.save( mod );
        module.autocompile( mod );
    };
    
    
    /**
     * compile a module
     * @param {object} module entity
     * */
    var compile = function( mod ){
        
        try {
            if ( lang.isFunction( mod.factory ) ){
                
                var deps = getDeps( mod ),
                    exports = mod.factory.apply( null, deps );
                    
                if ( exports !== undefined ){
                    mod.exports = exports;
                } else {
                    mod.entity && ( mod.exports = mod.entity.exports );
                }
                
                mod.entity && ( delete mod.entity );
                
            } else if ( mod.factory !== undefined ) {
                mod.exports = mod.factory;
            }
            
            event.emit( 'compiled', mod );
        } catch ( ex ){
            event.emit( 'compileFail', ex, mod );
        }
    };
    
    
    /**
     * get dependencies list
     * @param {object} module
     * */
    var getDeps = function( mod ){
        
        var list = [],
            deps = mod.deps;
        
        if ( lang.isArray( deps ) ){
            lang.forEach( deps, function( id ){
                var mid, hook;
                mid = ( hook = keyModules[id] ) ? hook( mod ) : module.require( id, mod );
                
                list.push( mid );
            } );
        }
        
        return list;
    };
    
    
    /**
     * require a module
     * @param {string} module's id
     * @param {object} module's execute scope
     * */
    var require = function( id ){
        
        var mod = module.get( id );
        
        if ( !mod ){
            event.emit( 'requireFail', { id: id } );
            return null;
        }
        
        if ( !mod.visits ){
            mod.visits++;
            module.compile( mod );
        }
        
        event.emit( 'required', mod );
        
        return mod.exports;
    };
    
    
    /**
     * key-modules
     * */
    var keyModules = {
        'require': function( mod ){
            
            function require( id ){
                return module.require( id );
            }
            
            event.emit( 'makeRequire', require );
            
            return require;
        },
        'exports': function( mod ){
            return mod.exports;
        },
        'module': function( mod ){
            mod.entity = {
                id: mod.id,
                exports: mod.exports
            };
            
            return mod.entity;
        }
    };
    
    
    var originalDefine = global.define;
    
    this.noConflict = function(){
        global.define = originalDefine;
    };
    
    this.define = define;
    
    global.define = this.define;
    
    
    return module;
    
} );
