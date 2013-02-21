/**
 * @module lofty/kernel/require
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130204
 * */


(function( sdk ){
    'use strict';
    
    if ( sdk.cache.assets ){
        return;
    }
    
    
    /**
     * Thanks to:
     * cujo.js, https://github.com/cujojs/curl/blob/master/src/curl.js
     * jQuery, https://github.com/jquery/jquery/blob/1.7.2/src/deferred.js
     * */
    
    var cache = sdk.cache,
        //modulesCache = cache.modules,
        configCache = cache.config,
        fn = sdk.fn,
        util = sdk.util;
    
    
    util.now = Date.now || function(){
        return new Date().getTime();
    };
        
    util.map = function( target, callback ){
        
        var ret = [];
        
        util.forEach( target, function( item ){
            ret.push( callback( item ) );
        } );
        
        return ret;
        
    };
    
    var noop = function(){};
    
    var Promise = function( len ){
        
        var _this = this,
            thens = [],
            len = len || 1,
            resolved = 0,
            rejected = 0;
        
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
    
    util.when = function(){
        
        var args = util.slice.call( arguments, 0 ),
            l = args.length,
            promise = new Promise(l);
        
        util.forEach( args, function( arg ){
            arg( promise );
        } );
        
        return promise;
        
    };
    
    
    var assetsCache = {},
        STATUS = {
            'ERROR': -1,
            'LOADING': 1,
            'LOADED': 2
        },
        rFileExten = /\?|\.(?:css|js)$|\/$/;
    
    
    configCache.protocol = 'http';
    configCache.loadTimeout = 10000;
    
    
    var parseResolve = function( id ){
        var resolves = configCache.resolve,
            url;
        
        if ( resolves ){
            for ( var i = 0, l = resolves.length; i < l; i++ ){
                url = resolves[i]( id );
                
                if ( url !== id ){
                    break;
                }
            }
        }
        
        return configCache.protocol +'://' + configCache.domain + url;
    },
    
    addFileExten = function( url ){
        
        if ( !rFileExten.test(url) ){
            url += '.js';
        }
        
        return url;
    },
    
    addStamp = function( url ){
        var stamp,
            t = configCache.hasStamp ? util.now() : null;
            
        if ( configCache.stamp && ( stamp = configCache.stamp[id] ) ){
            t = stamp;
        }
        
        t && ( url += '?t=' + t );
        
        return url;
    },
    
    idToUrl = function( id ){
        
        var url = '';
        
        id = fn.parseAlias( id );
        url = parseResolve( id );
        url = addFileExten( url );
        url = addStamp( url );
        //console.info(url);
        return url;
        
    },
    
    createAsset = function( id ){
        
        return {
            id: id,
            url: idToUrl(id),
            callbackQueue: [],
            errorbackQueue: [],
            status: 0,
            timeout: false,
            timeoutTimer: null
        };
        
    },
    
    completeLoad = function( asset, type ){
        
        if ( asset.timeout ){
            return;
        }
        
        clearTimeout( asset.timeoutTimer );
        
        var call, queue;
        
        if ( type === 'callback' ){
            asset.status = STATUS.LOADED;
            queue = asset.callbackQueue;
        } else {
            asset.status = STATUS.ERROR;
            queue = asset.errorbackQueue;
        }
        
        while ( call = queue.shift() ){
            call();
        };
        
    },
    
    request = function( id, callback, errorback ){
        
        var asset = assetsCache[id] || createAsset( id ),
            fallback;
        
        if ( asset.status === STATUS.LOADED ){
            callback && callback();
            return;
        }
        
        asset.callbackQueue.push( callback );
        asset.errorbackQueue.push( errorback );
        
        if ( asset.status === STATUS.LOADING ){
            return;
        }
        
        assetsCache[id] = asset;
        asset.status = STATUS.LOADING;
        
        asset.timeoutTimer = setTimeout( function(){
            asset.timeout = true;
            errorback && errorback();
        }, configCache.loadTimeout );

        util.load( asset.url, function(){
            completeLoad( asset, 'callback' );
        }, function(){
            completeLoad( asset, 'errorback' );
            fn.emit( 'requestFail', asset );
        } );
        
    };
    
    
    fn.fetch = function( ids, callback, errorback ){
        
        util.when.apply( null, util.map( ids, function( id ){
            return function( promise ) {
                if ( fn.isExisting( id ) ){
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
    
    
    fn.asyncRequireLoader = fn.fetch;
    
    var asyncRequire = function( ids, callback, errorback ){
        if ( !util.isArray(ids) ){
            ids = [ids];
        }
        
        fn.asyncRequireLoader( ids, function(){
            var args = util.map( ids, function( id ){
                return fn.require( id );
            } );
            
            callback && callback.apply( null, args );
        } /* call errorback */ );
        
    };
    
    fn.on( 'makeRequire', function( require ){
        
        require.async = asyncRequire;
        
    } );
    
    
    cache.assets = assetsCache;
    
})( lofty.sdk );
