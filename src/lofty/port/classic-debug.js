/**
 * @preserve Lofty, v%VERSION% http://lofty.fangdeng.org/ MIT
 * */
/**
 * @module lofty/kernel/boot
 * @author Edgar Hoo <edgarhoo@gmail.com>
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
    
    lofty.log = global.console ? function( message, level ){
        level = level || 'log';
        console[level]( message );
    } : function(){};
    
    lofty.cache = {
        kernel: cache
    };
    
    
    lofty( 'global', global );
    lofty( 'cache', lofty.cache );
    
    global.lofty = lofty;
    
})( this );
/**
 * @module lofty/kernel/lang
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130308
 * */


lofty( 'lang', function(){
    'use strict';
    
    var EMPTY_OBJ = {},
        HAS_OWN = EMPTY_OBJ.hasOwnProperty,
        toString = EMPTY_OBJ.toString,
        AP = Array.prototype;
    
    var lang = {
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
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130308
 * */


lofty( 'event', ['lang','cache'], function( lang, cache ){
    'use strict';
    
    var eventsCache = cache.events = {};
    
    var event = {
        on: function( name, callback ){
            var list = eventsCache[name] || ( eventsCache[name] = [] );
            list.push( callback );
        },
        emit: function( name ){
            var args = lang.slice.call( arguments, 1 ),
                list = eventsCache[name];
            
            if ( list ){
                lang.forEach( list, function( item ){
                    item.apply( null, args );
                } );
            }
        }
    };
    
    return event;
    
} );
/**
 * @module lofty/kernel/config
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130310
 * */


lofty( 'config', ['global','cache','lang'], function( global, cache, lang ){
    'use strict';
    
    var configCache = cache.config = {},
        rulesCache = cache.configRules = {};
    
    
    var config = {
        realize: function( options ){
            
            for ( var key in options ){
                if ( lang.hasOwn( options, key ) ){
                    var target = configCache[key],
                        opts = options[key];
                    
                    if ( !config.applyRules( target, key, opts ) ){
                        configCache[key] = opts;
                    };
                }
            }
        },
        
        addRule: function( ruleName, rule ){
            
            rulesCache[ruleName] = {
                rule: rule,
                keys: []
            };
            
            return this;
        },
        
        addRuleKey: function( key, ruleName ){
            
            rulesCache[ruleName] && rulesCache[ruleName].keys.push( key );
            
            return this;
        },
        
        applyRules: function( target, key, opts ){
            
            var hasApply = false,
                item;

            for ( var ruleName in rulesCache ){
                if ( !hasApply ){
                    item = rulesCache[ruleName];
                    hasApply = lang.indexOf( item.keys, key ) > -1 && item.rule( target, key, opts );
                } else {
                    break;
                }
            }
            
            return hasApply;
        }
    };
    
    
    config.addRule( 'object', function( target, key, opts ){
        if ( target ){
            for ( var i in opts ){
                target[i] = opts[i];
            }
            return true;
        }
        
        return false;
    })
    .addRule( 'array', function( target, key, opts ){
        target ? target.push( opts ) : ( configCache[key] = [opts] );
        
        return true;
    } );
    
    
    this.config = config.realize;
    
    
    return config;
    
} );
/**
 * @module lofty/kernel/alias
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130208
 * */


lofty( 'alias', ['cache','config','event'] ,function( cache, config, event ){
    
    var configCache = cache.config;
    
    config.addRuleKey( 'alias', 'object' );
    
    event.on( 'alias', function( meta ){
        
        var aliases = configCache.alias,
            alias;
        
        if ( aliases && ( alias = aliases[meta.id] ) ){
            meta.id = alias;
        }
    } );
    
} );
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
/**
 * @module lofty/kernel/loader
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130131
 * */


lofty( 'loader', ['cache','global'], function( cache, global ){
    'use strict';
    
    /**
     * Thanks to:
     * SeaJS, https://github.com/seajs/seajs/blob/master/src/util-request.js
     *        https://github.com/seajs/seajs/blob/master/tests/research/load-js-css/test.html
     *        https://github.com/seajs/seajs/blob/master/tests/research/load-js-css/load-css.html
     * HeadJS, https://github.com/headjs/headjs/blob/master/src/load.js
     * Do, https://github.com/kejun/Do/blob/master/do.js
     * cujo.js, https://github.com/cujojs/curl/blob/master/src/curl.js
     * */
    
    var configCache = cache.config,
        doc = global.document,
        nav = global.navigator;
    
    var rStyle = /\.css(?:\?|$)/,
        rReadyStates = /loaded|complete|undefined/;
        
    var isOldWebKit = ( nav.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/, "$1") ) * 1 < 536;
    
    var head = doc && ( doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement ),
        //getBaseElement = function(){
        //    return doc.getElementsByTagName('base')[0];
        //},
        baseElement = doc.getElementsByTagName('base')[0];
        //todo, testing in ie6 when lofty put before base element
    
    
    var loadAsset = function( url, callback ){
        
        var node;
        
        if ( rStyle.test( url ) ){
            node = doc.createElement('link');
            onLoadStyle( node, url, callback );
            
            node.rel = 'stylesheet';
            node.href = url;
        } else {
            node = doc.createElement('script');
            onLoadScript( node, callback );
            
            node.async = true;
            node.src = url;
        }
        
        if ( configCache.charset ){
            node.charset = configCache.charset;
        }
        
        baseElement ?
            head.insertBefore( node, baseElement ) :
            head.appendChild( node );
        
    },
    
    onLoadStyle = function( node, url, callback ){
        
        if ( isOldWebKit || !( 'onload' in node ) ){
            var img = doc.createElement('img');
            
            img.onerror = function(){
                callback();
                img.onerror = null;
                img = undefined;
            };
            
            img.src = url;
        } else {
            node.onload = node.onreadystatechange = function(){
                if ( rReadyStates.test( node.readyState ) ){
                    node.onload = node.onreadystatechange = node.onerror =  null;
                    node = undefined;
                    callback && callback();
                }
            };
            
            onLoadError( node, callback );
        }
        
    },
    
    onLoadScript = function( node, callback ){
        
        node.onload = node.onreadystatechange = function( event ){
            
            event = event || global.event;
            
            if ( event.type === 'load' || rReadyStates.test( node.readyState ) ){
                
                node.onload = node.onreadystatechange = node.onerror = null;
                
                if ( !configCache.debug ){
                    head.removeChild( node );
                }
                
                node = undefined;
                callback && callback();
            }
        };
        
        onLoadError( node, callback );
        
    },
    
    onLoadError = function( node, callback ){
        
        node.onerror = function(){
            node.onload = node.onreadystatechange = node.onerror = null;
            node = undefined;
            callback && callback();
        };
        
    };
    
    
    return loadAsset;
    
} );
/**
 * @module lofty/kernel/path
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130208
 * */


lofty( 'path', ['global','cache','config','event'], function( global, cache, config, event ){
    'use strict';
    
    var configCache = cache.config,
        doc = global.document;
    
    var rFileSuffix = /\?|\.(?:css|js)$|\/$/,
        rAbsolute = /^https?:\/\//,
        timeStamp = (new Date()).getTime();
    
    configCache.protocol = 'http';
    configCache.domain = (function(){
        var rUrl = /([\w]+)[\:\/\/]+([\w|\.]+)\//i,
            scripts = doc.getElementsByTagName('script'),
            selfScript = scripts[scripts.length-1],
            selfUrl = ( selfScript.hasAttribute ? selfScript.src : selfScript.getAttribute("src", 4) ).match( rUrl );
        
        return selfUrl[2];
    })();
    
    config.addRuleKey( 'resolve', 'array' )
        .addRuleKey( 'stamp', 'object' );
    
    
    var path = {
        parseResolve: function( asset ){
            
            var resolve = configCache.resolve,
                url;
            
            if ( resolve ){
                for ( var i = 0, l = resolve.length; i < l; i++ ){
                    url = resolve[i]( asset.id );
                    
                    if ( url !== asset.id ){
                        break;
                    }
                }
            }
            
            asset.url = rAbsolute.test( url ) ? url : configCache.protocol +'://' + configCache.domain + url;
        },
        
        addFileSuffix: function( asset ){
            
            if ( !rFileSuffix.test(asset.url) ){
                asset.url += '.js';
            }
        },
        
        addStamp: function( asset ){
            
            var t = configCache.hasStamp ? timeStamp : null,
                stamp = configCache.stamp;
                
            if ( stamp && stamp[asset.id] ){
                t = stamp[asset.id];
            }
            
            t && ( asset.url += '?lofty.stamp=' + t );
        },
        
        idToUrl: function( asset ){
            
            if ( asset.id ){
                return;
            }
            
            asset.id = asset.url;
            
            event.emit( 'alias', asset );
            path.parseResolve( asset );
            path.addFileSuffix( asset );
            path.addStamp( asset );
        }
    };
    
    event.on( 'request', path.idToUrl );
    
    return path;
    
} );
/**
 * @module lofty/kernel/request
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130321
 * */


lofty( 'request', ['cache','event','loader','global'],
    function( cache, event, loader, global ){
    'use strict';
    
    var configCache = cache.config,
        assetsCache = cache.assets = {};
        
    var STATUS_TIMEOUT = -1,
        STATUS_LOADING = 1,
        STATUS_LOADED = 2;
    
    configCache.loadTimeout = 10000;
    
    
    var getAsset = function( url ){
        
        var asset = {
            url: url
        };
        
        event.emit( 'request', asset );
        
        return assetsCache[asset.url] || ( assetsCache[asset.url] = asset );
    },
    
    completeLoad = function( asset, isCallback ){
        
        if ( asset.timeout ){
            return;
        }
        
        global.clearTimeout( asset.timer );
        
        var call, queue;
        
        if ( isCallback ){
            asset.status = STATUS_LOADED;
            queue = asset.callQueue;
        } else {
            asset.status = STATUS_TIMEOUT;
            queue = asset.errorQueue;
        }
        
        while ( call = queue.shift() ){
            call();
        };
        
    },
    
    request = function( url, callback, errorback ){
        
        var asset = getAsset( url );
        
        if ( asset.status === STATUS_LOADED ){
            callback && callback();
            return;
        }
        
        asset.callQueue ? asset.callQueue.push( callback ) : ( asset.callQueue = [callback] );
        asset.errorQueue ? asset.errorQueue.push( errorback ) : ( asset.errorQueue = [errorback] );
        
        if ( asset.status === STATUS_LOADING ){
            return;
        }
        
        asset.status = STATUS_LOADING;
        
        asset.timer = setTimeout( function(){
            asset.timeout = true;
            completeLoad( asset, false );
            event.emit( 'requestTimeout', asset );
        }, configCache.loadTimeout );

        loader( asset.url, function(){
            completeLoad( asset, true );
        } );
        
    };
    
    
    return request;
    
} );
/**
 * @module lofty/kernel/deferred
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130308
 * */


lofty( 'deferred', ['lang'], function( lang ){
    'use strict';
    
    /**
     * Thanks to:
     * cujo.js, https://github.com/cujojs/curl/blob/master/src/curl.js
     * jQuery, https://github.com/jquery/jquery/blob/1.7.2/src/deferred.js
     * */
     
    var noop = function(){};
    
    var Promise = function( len ){
        
        var _this = this,
            thens = [],
            resolved = 0,
            rejected = 0;
        
        len = len || 1;

        var probe = function(){
            if ( resolved + rejected === len ){
                complete();
            }
        },
        
        complete = function(){
            _this.then = !rejected ?
                function( resolved, rejected ){ resolved && resolved() } :
                function( resolved, rejected ){ rejected && rejected() };
                
            complete = noop;
            
            notify( !rejected ? 0 : 1 );
            
            notify = noop;
            thens = [];
        },
        
        notify = function( which ){
            var then, callback, i = 0;
            
            while ( ( then = thens[i++] ) ){
                callback = then[which];
                callback && callback();
            }
        };
        
        this.then = function( resolved, rejected ){
            thens.push( [resolved, rejected] );
        };
        
        this.resolve = function(){
            resolved++;
            probe();
        };
        
        this.reject = function(){
            rejected++;
            probe();
        };
        
    };
    
    var when = function(){
        
        var args = lang.slice.call( arguments, 0 ),
            l = args.length,
            promise = new Promise(l);
        
        lang.forEach( args, function( arg ){
            arg( promise );
        } );
        
        return promise;
        
    };
    
    
    return when;
    
} );
/**
 * @module lofty/kernel/asyncrequire
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130204
 * */


lofty( 'asyncrequire', ['lang','event','module','request','deferred'],
    function( lang, event, module, request, deferred ){
    'use strict';
    
    var asyncrequire = {};
    
    asyncrequire.fetch = function( ids, callback, errorback ){
        
        deferred.apply( null, lang.map( ids, function( id ){
            return function( promise ) {
                if ( module.has( id ) ){
                    promise.resolve();
                } else {
                    request( id, function(){
                        promise.resolve();
                    }, function(){
                        promise.reject();
                    } );
                }
            }
        } ) ).then( callback, errorback );
    };
        
    asyncrequire.loader = asyncrequire.fetch;
        
    asyncrequire.realize = function( ids, callback, errorback ){
        lang.isArray( ids ) || ( ids = [ids] );
        
        asyncrequire.loader( ids, function(){
            var args = lang.map( ids, function( id ){
                return module.require( id );
            } );
            
            callback && callback.apply( null, args );
        } /* call errorback */ );
        
    };
    
    
    event.on( 'makeRequire', function( require ){
        
        require.async = function( ids, callback, errorback ){
            asyncrequire.realize( ids, callback, errorback );
        };
        
    } );
    
    
    return asyncrequire;
    
} );
/**
 * @module lofty/kernel/alicn
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130216
 * */


lofty( 'alicn', ['cache','global','event'], function( cache, global, event ){
    'use strict';
    
    var configCache = cache.config;
    
    
    var rStyle = /\.css(?:\?|$)/;
    
    var resolve = function( id ){
        
        var parts = id.split('/'),
            root = parts[0],
            type = rStyle.test( id ) ? 'css' : 'js',
            format;
        
        switch ( root ){
            case 'lofty':
            case 'makeup':
                id = '/fdevlib/' + type + id;
                break;
            case 'sys':
                id = '/sys/' + type + parts.slice( 1 );
                break;
        }
        
        return id;
    };
    
    configCache.hasStamp = true;
    configCache.resolve = [resolve];
    
    
    configCache.debug = function(){
            var isDebug = false,
                search = global.location.search;
            
            if ( search.indexOf('lofty.debug=') > -1 ){
                isDebug = true;
            }
            
            return isDebug;
    }();
    
    
    this.appframe = function( name ){
        global[name] = {
            log: this.log,
            define: this.define,
            on: event.on
        };
    };
    
} );
