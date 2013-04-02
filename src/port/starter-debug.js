/*! Lofty v0.1 beta Starter http://lofty.fangdeng.org/ MIT*/
/**
 * @module lofty/kernel/boot
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130307
 * */


(function( global ){
    'use strict';
    
    if ( global.lofty ){
        return;
    }
    
    var cache = {};
    
    var lofty = function( id, deps, factory ){
        
        if ( cache[id] ){
            return;
        }
        
        if ( !factory ){
            factory = deps;
            deps = [];
        }
        
        var module = cache[id] = {
            id: id,
            deps: deps,
            factory: factory
        };
        
        compile( module );
    },
    
    compile = function( module ){
        
        if ( typeof module.factory === 'function' ){
            var deps = getDeps( module );
            
            module.exports = module.factory.apply( lofty, deps );
        } else {
            module.exports = module.factory;
        }
        
        delete module.factory;
    },
    
    getDeps = function( module ){
        
        var list = [],
            deps = module.deps;
        
        for ( var i = 0, l = deps.length; i < l; i++ ){
            list.push( require( deps[i] ) );
        }
        
        return list;
    },
    
    require = function( id ){
        
        var module = cache[id];
        
        return module ? module.exports : null;
    };
    
    lofty.version = '0.1';
    
    lofty.cache = {
        kernel: cache
    };
    
    
    lofty( 'global', global );
    lofty( 'require', function(){
        return require;
    } );
    
    global.lofty = lofty;
    
})( this );
/**
 * @module lofty/kernel/lang
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130322
 * */


lofty( 'lang', function(){
    'use strict';
    
    var toString = {}.toString,
        AP = Array.prototype;
    
    var lang = {
        isFunction: function( it ){
            return toString.call( it ) === '[object Function]';
        },
        
        isArray: Array.isArray || function( it ){
            return toString.call( it ) === '[object Array]';
        },
        
        isString: function( it ){
            return typeof it === 'string';
        },
        
        forEach: AP.forEach ?
            function( arr, fn, context ){
                arr.forEach( fn, context );
            } :
            function( arr, fn, context ){
                for ( var i = 0, l = arr.length; i < l; i++ ){
                    fn.call( context, arr[i], i, arr );
                }
            },
            
        map: AP.map ? function( arr, fn, context ){
                return arr.map( fn, context );
            } : 
            function( arr, fn, context ){
                var ret = [];
                
                lang.forEach( arr, function( item, i, arr ){
                    ret.push( fn.call( context, item, i, arr ) );
                } );
                
                return ret;
            },
        indexOf: AP.indexOf ? 
            function( arr, item ){
                return arr.indexOf( item );
            } :
            function( arr, item ){
                for ( var i = 0, l = arr.length; i < l; i++ ){
                    if ( arr[i] === item ){
                        return i;
                    }
                }
                
                return -1;
            }
    };
    
    
    return lang;
    
} );
/**
 * @module lofty/kernel/event
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130322
 * */


lofty( 'event', function(){
    'use strict';
    
    /**
     * Thanks to:
     * SeaJS, http://seajs.org/
     * */
    
    var eventsCache = this.cache.events = {},
        slice = [].slice;
    
    var exports = {
        on: function( name, callback ){
            var list = eventsCache[name] || ( eventsCache[name] = [] );
            list.push( callback );
        },
        emit: function( name ){
            var args = slice.call( arguments, 1 ),
                list = eventsCache[name],
                fn, i = 0;
            
            if ( list ){
                while ( ( fn = list[i++] ) ){
                    fn.apply( null, args );
                }
            }
        }
    };
    
    return exports;
    
} );
/**
 * @module lofty/kernel/config
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130403
 * */


lofty( 'config', ['lang'], function( lang ){
    'use strict';
    
    var cache = this.cache,
        configCache = cache.config = {},
        rulesCache = cache.configRules = {};
    
    
    var realize = function( options ){
        
        for ( var key in options ){
            var target = configCache[key],
                val = options[key];
            
            if ( !applyRules( target, key, val ) ){
                configCache[key] = val;
            };
        }
    },
    
    applyRules = function( target, key, val ){
        
        var hasApply = false,
            item;

        for ( var ruleName in rulesCache ){
            if ( !hasApply ){
                item = rulesCache[ruleName];
                hasApply = lang.indexOf( item.keys, key ) > -1 && item.rule.call( configCache, target, key, val );
            } else {
                break;
            }
        }
        
        return hasApply;
    };
    
    
    var config = {
        addRule: function( ruleName, rule ){
            
            rulesCache[ruleName] = {
                rule: rule,
                keys: []
            };
            
            return this;
        },
        addItem: function( item, ruleName ){
            
            rulesCache[ruleName] && rulesCache[ruleName].keys.push( item );
            
            return this;
        }
    };
    
    
    config.addRule( 'object', function( target, key, val ){
        if ( target ){
            for ( var i in val ){
                target[i] = val[i];
            }
            return true;
        }
        
        return false;
    })
    .addRule( 'array', function( target, key, val ){
        target ? target.push( val ) : ( this[key] = [val] );
        
        return true;
    } );
    
    
    this.config = realize;
    
    
    return config;
    
} );
/**
 * @module lofty/kernel/alias
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130403
 * */


lofty( 'alias', ['config','event'] ,function( config, event ){
    
    var configCache = this.cache.config;
    
    config.addItem( 'alias', 'object' );
    
    var alias = function( meta ){
        
        var aliases = configCache.alias,
            alias;
        
        if ( aliases && ( alias = aliases[meta.id] ) ){
            meta.id = alias;
        }
        
        event.emit( 'alias', meta );
    };
    
    return alias;
    
} );
/**
 * @module lofty/kernel/module
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130403
 * */


lofty( 'module', ['global','lang','event','alias'],
    function( global, lang, event, alias ){
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
    
    var modulesCache = this.cache.modules = {};
    
    
    var module = {
        get: function( id ){
            var meta = { id: id };
            alias( meta );
            
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
                    mod.entity && mod.entity.exports && ( mod.exports = mod.entity.exports );
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
/**
 * @module lofty/kernel/console
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130324
 * */


lofty( 'console', ['global','lang'], function( global, lang ){
    'use strict';
    
    /**
     * Thanks to:
     * http://jquery.glyphix.com/jquery.debug/jquery.debug.js
     * */
    
    var doc = global.document;
    
    var messageList = [],
        messageBox = null,
        prepared = false;
    
    var createMessage = function( item ){
        
        var li = doc.createElement('li');
        li.style.color = 'warn' === item.type ? 'red' : '#000';
        li.innerHTML = item.message;
        messageBox.appendChild( li );
    },
    
    messagePrepare = function(){
        
        var box = doc.createElement('div');
        
        box.id = 'lofty-debug-console';
        box.style.margin = '10px 0';
        box.style.border = '1px dashed red';
        box.style.padding = '4px 8px';
        box.style.fontSize = '14px';
        box.style.lineHeight = '1.5';
        box.style.textAlign = 'left';
        
        appendTo( box );
        prepared = true;
    },
    
    appendTo = function( box ){
        
        if ( doc.body ){
            doc.body.appendChild( box );
            messageBox = doc.createElement('ol');
            messageBox.style.listStyleType = 'decimal';
            box.appendChild( messageBox );
            
            lang.forEach( messageList, function( item ){
                createMessage( item );
            } );
        } else {
            global.setTimeout( function(){
                appendTo( box );
            }, 200 );
        }
    },
    
    console = function( message, type ){
        
        var item = {
            'message': message,
            'type': type || 'log'
        };
        
        !prepared && messagePrepare();
        messageBox ?
            createMessage( item ) :
            messageList.push( item );
        
    };
    
    
    return console;
    
} );
/**
 * @module lofty/kernel/debug
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130403
 * */


lofty( 'debug', ['global','config','console','request','require'],
    function( global, config, console, request, require ){
    'use strict';
    
    var _this = this;
    
    var noop = this.log = function(){};
    
    var createLog = function( isDebug ){
        _this.log = isDebug ? ( global.console ? function( message, level ){
            level = level || 'log';
            global.console[level]( message );
        } : function( message, level ){
            if ( console ){
                console( message, level );
            } else if ( request ) {
                request( 'lofty/kernel/console', function(){
                    console || ( console = require('console') );
                    console( message, level );
                } );
            }
        } ) : noop;
    };
    
    config.addRule( 'debug', function( target, key, val ){
        createLog( val );
        this[key] = val;
        return true;
    } )
    .addItem( 'debug', 'debug' );
    
} );
/**
 * @module lofty/kernel/alicn
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130403
 * */


lofty( 'alicn', ['global','event','config'],
    function( global, event, config ){
    'use strict';
    
    var rStyle = /\.css(?:\?|$)/,
        rId = /([a-z])([A-Z])/g;
    
    var resolve = function( id ){
        
        id = id.replace( rId, function( s, s1, s2 ){
            return s1 + '-' + s2;
        } ).toLowerCase();
        
        var parts = id.split('/'),
            root = parts[0],
            type = rStyle.test( id ) ? 'css/' : 'js/';
        
        switch ( root ){
            case 'lofty':
            case 'avid':
                id = '/fdevlib/' + type + id;
                break;
            case 'sys':
                id = '/sys/' + type + parts.slice( 1 ).join('/');
                break;
        }
        
        return id;
    };
    
    this.config({
        hasStamp: true,
        resolve: resolve,
        debug: function(){
            var isDebug = false,
                href = global.location.href;
            
            href.indexOf('lofty.debug=true') > 0 && ( isDebug = true );
            
            return isDebug;
        }()
    });
    
    
    this.appframe = function( name ){
        var frame = global[name] = {
            define: this.define,
            log: this.log,
            config: this.config,
            on: event.on
        };
        
        frame.config.addRule = config.addRule;
        frame.config.addItem = config.addItem;
    };
    
} );
