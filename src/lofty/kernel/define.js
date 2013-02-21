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
    
    var lofty = {},
        fn = {},
        modulesCache = {},
        configCache = {},
        eventsCache = {};
    
    var EMPTY_ID = '',
        EMPTY_DEPS = [],
        UNDER,
        EMPTY_OBJ = {},
        HAS_OWN = EMPTY_OBJ.hasOwnProperty,
        ANONYMOUS_PREFIX = '__!_lofty_anonymous_';
    
    var anonymousIndex = 0;
    
    var util = {
        toString: EMPTY_OBJ.toString,
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
    fn.on = function( name, callback ){
        
        var list = eventsCache[name] || ( eventsCache[name] = [] );
        list.push( callback );
        
    };
    
    fn.emit = function( name ){
        
        var args = util.slice.call( arguments, 1 ),
            list = eventsCache[name];
        
        if ( list ){
            util.forEach( list, function( item ){
                item.apply( null, args );
            } );
        }
        
    };
    
    
    fn.parseAlias = function( id ){
        
        var alias;
        
        if ( configCache.alias && ( alias = configCache.alias[id] ) ){
            id = alias;
        }
        
        return id;
        
    };
    
    fn.isExisting = function( id ){
        
        id = fn.parseAlias( id );
        
        if ( modulesCache[id] || keyModuleHooks[id] ){
            return true;
        }
        
        return false;
        
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
        
        if ( modulesCache[id] ){
            fn.emit( 'existing', id );
            return null;
        }
        
        module = new Module( id, deps, factory );
        
        if ( id !== EMPTY_ID ){
            modulesCache[id] = module;
        } else {
            id = ANONYMOUS_PREFIX + anonymousIndex;
            anonymousIndex++;
            module._id = id;
            modulesCache[id] = module;
            
            fn.autocompile( module );
        }
        
    };
    
    
    /**
     * auto compile an anonymous module
     * @param {object} module entity
     * */
    fn.autocompile = function( module ){
        
        fn.compile.call( null, module );
        
    };
    
    
    /**
     * require a module
     * @param {string} module's id
     * */
    fn.require = function( id ){
        
        id = fn.parseAlias(id);
        
        var module = modulesCache[id];
        
        if ( !module ){
            fn.emit( 'requireFail', id );
            return null;
        }
        
        if ( !module.status ){
            module.status = true;
            fn.compile.call( null, module );
        }
        
        module.visits++;
        fn.emit( 'required', module );
        
        return module.exports;
        
    };
    
    
    /**
     * compile a module
     * @param {object} module entity
     * */
    fn.compile = function( module ){
        
        try {
            if ( util.isFunction( module.factory ) ){
                var deps = getDeps( module ),
                    exports = module.factory.apply( null, deps );
                    
                if ( exports !== undefined ){
                    module.exports = exports;
                } else {
                    module.entity && ( module.exports = module.entity.exports );
                }
            } else if ( module.factory !== undefined ) {
                module.exports = module.factory;
            }
            
            fn.emit( 'compiled', module );
        } catch ( ex ){
            fn.emit( 'compileFail', module, ex );
        }
        
    };
    
    
    /**
     * config
     * */
    fn.config = function( options ){
        
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
     * key-module hooks
     * */
    var keyModuleHooks = {
        'require': function(){
            function require(id){
                return fn.require.call( null, id );
            }
            
            fn.emit( 'makeRequire', require );
            
            return require;
        },
        'exports': function(module){
            return module.exports;
        },
        'module': function(module){
            var entity;
            
            if ( !(entity = module.entity) ){
                entity = module.entity = {
                    id: module.id,
                    exports: module.exports
                };
            }
            
            return entity;
        },
        'config': function(){
            return fn.config;
        }
    };
    
    
    /**
     * get dependencies list
     * @param {object} module
     * */
    var getDeps = function( module ){
        
        var list = [],
            deps = module.deps;
        
        if ( util.isArray( deps ) ){
            util.forEach( deps, function( id ){
                var mid, hook;
                mid = ( hook = keyModuleHooks[id] ) ? hook(module) : fn.require.call( null, id );
                
                list.push( mid );
            } );
        }
        
        return list;
        
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
    
    lofty.sdk = {
        cache: {
            modules: modulesCache,
            config: configCache,
            events: eventsCache
        },
        util: util,
        fn: fn
    };
    
    
    /**
     * publick API
     * */
    global.lofty = lofty;
    global.define = lofty.define;
    
})( this );
