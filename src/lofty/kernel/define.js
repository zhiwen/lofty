/**
 * @module lofty/kernel/define
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130129
 * */


(function( global ){
    'use strict';
    
    if ( global.lofty ){
        return;
    }
    
    
    /**
     * Thanks to:
     * HexJS, https://github.com/edgarhoo/hexjs/blob/master/src/hex.js
     * */
    
    /**
     * util
     * */
    var EMPTY_OBJ = {},
        HAS_OWN = EMPTY_OBJ.hasOwnProperty,
        toString = EMPTY_OBJ.toString;
    
    var util = {
        slice: [].slice,
        hasOwn: function( obj, prop ){
            return HAS_OWN.call( obj, prop );
        },
        isFunction: function( it ){
            return this.toString.call( it ) === '[object Function]';
        },
        isArray: Array.isArray || function( it ){
            return this.toString.call( it ) === '[object Array]';
        },
        isString: function( it ){
            return typeof it === 'string';
        },
        forEach: Array.prototype.forEach ?
            function( arr, fn ){
                arr.forEach( fn );
            } :
            function( arr, fn ){
                for ( var i = 0, l = arr.length; i < l; i++ ){
                    fn( arr[i], i, arr );
                }
            }
    };



    /**
     * simple observer
     * */
    var eventsCache = {};
    
    var event = {
        on: function( name, callback ){
            var list = eventsCache[name] || ( eventsCache[name] = [] );
            list.push( callback );
        },
        emit: function( name ){
            var args = util.slice.call( arguments, 1 ),
                list = eventsCache[name];
            
            if ( list ){
                util.forEach( list, function( item ){
                    item.apply( null, args );
                } );
            }
        }
    };
    
    
    
    /**
     * config
     * */
    var configCache = {};
    
    var config = function( options ){
        
        for ( var key in options ){
            if ( util.hasOwn( options, key ) ){
                var cache = configCache[key],
                    opts = options[key];
                    
                if ( cache && ( key === 'alias' || key === 'stamp' ) ){
                    for ( var i in opts ){
                        if ( util.hasOwn( opts, i ) ){
                            cache[i] = opts[i];
                        }
                    }
                } else if ( key === 'resolve' ){
                    cache ? cache.push( opts ) : ( configCache[key] = [opts] );
                } else {
                    configCache[key] = opts;
                }
            }
        }
    };
    
    
    
    /**
     * modules cache
     * */
    var modulesCache = {};
    
    var modules = {
        //parts: {},
        get: function( id ){
            return ( this ? this.parts : modulesCache )[id];
        },
        save: function( id, module ){
            ( this ? this.parts : modulesCache )[id] = module;
        }
    };
    
    
    
    /**
     * path
     * */
    var path = {
        parseAlias: function( id ){
            
            var alias;
            
            if ( configCache.alias && ( alias = configCache.alias[id] ) ){
                id = alias;
            }
            
            return id;
        }
    };
    
    
    
    var EMPTY_ID = '',
        EMPTY_DEPS = [],
        ANONYMOUS_PREFIX = '__!_lofty_anonymous_',
        anonymousIndex = 0;
    
    
    /**
     * fn, module core opation
     * */
    var fn = {
        get: function( id ){
            return modules.get.call( this ? this : null, id );
        },
        has: function( id ){
            id = path.parseAlias( id );
            
            if ( modules.get.call( null, id ) || keyModulesCache[id] ){
                return true;
            }
            
            return false;
        },
        isAnon: function( module ){
            return module.id === EMPTY_ID;
        },
        save: function( module ){
            var id = module._id || module.id;
            
            modules.save.call( this, id, module );
        },
        autocompile: function( module ){
            fn.isAnon( module ) && fn.compile.call( this, module );
        },
        compile: function( module ){
            compile.call( this, module );
        },
        require: function( id, module ){
            return require.call( this, id, module );
        },
        config: function( options ){
            config( options );
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
        this.status = null;
        this.visits = 0;
        
        event.emit( 'initialized', this );
    };
    
    
    /**
     * define a module
     * @param {string} module's id
     * @param {array} module's dependencies
     * @param {object|function} module's factory
     * */
    var define = function( id, deps, factory ){
        
        var module,
            anonymousLength,
            argsLength = arguments.length;
        
        if ( argsLength === 1 ){
            factory = id;
            id = EMPTY_ID;
        } else if ( argsLength === 2 ){
            factory = deps;
            deps = EMPTY_DEPS;
            if ( !util.isString(id) ){
                deps = id;
                id = EMPTY_ID;
            }
        }
        
        if ( modules.get.call( this, id ) ){
            event.emit( 'existing', id );
            return null;
        }
        
        module = new Module( id, deps, factory );
        
        if ( id === EMPTY_ID ){
            id = ANONYMOUS_PREFIX + anonymousIndex;
            anonymousIndex++;
            module._id = id;
        }
        
        fn.save.call( this, module );
        fn.autocompile.call( this, module );
    };
    
    
    /**
     * compile a module
     * @param {object} module entity
     * */
    var compile = function( module ){
        
        try {
            if ( util.isFunction( module.factory ) ){
                
                var deps = getDeps.call( this, module ),
                    exports = module.factory.apply( null, deps );
                    
                if ( exports !== undefined ){
                    module.exports = exports;
                } else {
                    module.entity && ( module.exports = module.entity.exports );
                }
                
                module.entity && ( delete module.entity );
                
            } else if ( module.factory !== undefined ) {
                module.exports = module.factory;
            }
            
            event.emit( 'compiled', module );
        } catch ( ex ){
            event.emit( 'compileFail', module, ex );
        }
    };
    
    
    /**
     * require a module
     * @param {string} module's id
     * */
    var require = function( id, host ){
        
        id = path.parseAlias( id );
        
        var module = fn.get.call( this, id, host );
        
        if ( !module ){
            event.emit( 'requireFail', id );
            return null;
        }
        
        if ( !module.status ){
            module.status = true;
            fn.compile.call( this, module );
        }
        
        module.visits++;
        event.emit( 'required', module );
        
        return module.exports;
    };
    
    
    
    /**
     * key-modules
     * */
    var keyModulesCache = {
        'require': function( module ){
            var _this = this;
            
            function require(id){
                return fn.require.call( _this, id, module );
            }
            
            event.emit( 'makeRequire', module, this, require );
            
            return require;
        },
        'exports': function( module ){
            return module.exports;
        },
        'module': function( module ){
            module.entity = {
                id: module.id,
                exports: module.exports
            };
            
            return module.entity;
        },
        'config': function( module ){
            return fn.config;
        }
    };
    
    
    /**
     * get dependencies list
     * @param {object} module
     * */
    var getDeps = function( module ){
        
        var list = [],
            deps = module.deps,
            _this = this;
        
        if ( util.isArray( deps ) ){
            util.forEach( deps, function( id ){
                var mid, hook;
                mid = ( hook = keyModulesCache[id] ) ? hook.call( _this, module) : fn.require.call( _this, id, module );
                
                list.push( mid );
            } );
        }
        
        return list;
    };
    
    
    
    /**
     * Lofty, another front-end framework
     * */
    var loftyKernel = {
        parts: {}
    };
    
    var lofty = function(){
        var args = util.slice.call( arguments, 0 );
        
        define.apply( loftyKernel, args );
    };
    
    
    
    configCache.debug = function(){
        
        var isDebug = false,
            search = global.location.search;
        
        if ( search.indexOf('lofty.debug=') > -1 ){
            isDebug = true;
        }
        
        return isDebug;
    }();
    
    
    
    var originalDefine = global.define;
    
    lofty.noConflict = function(){
        global.define = originalDefine;
    };
    
    lofty.log = global.console ? function( message, level ){
        level = level || 'log';
        console[level]( message );
    } : function(){};
    
    lofty.define = define;
    lofty.version = '0.1';
    
    lofty.cache = {
        modules: modulesCache,
        config: configCache,
        events: eventsCache,
        kernel: loftyKernel
    };
    
    
    
    lofty( 'util', util );
    lofty( 'modules', modules );
    lofty( 'event', event );
    lofty( 'path', path );
    lofty( 'fn', fn );
    lofty( 'global', global );
    lofty( 'cache', lofty.cache );
    //lofty( 'lofty', lofty );
    
    
    /**
     * publick API
     * */
    global.lofty = lofty;
    global.define = lofty.define;
    
})( this );
