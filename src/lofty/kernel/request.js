/**
 * @module lofty/kernel/request
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130311
 * */


lofty( 'request', ['cache','path','event','loader','global'], function( cache, path, event, loader, global ){
    'use strict';
    
    var configCache = cache.config,
        assetsCache = cache.assets = {};
        
    var STATUS_TIMEOUT = -1,
        STATUS_LOADING = 1,
        STATUS_LOADED = 2;
    
    configCache.loadTimeout = 10000;
    
    
    var createAsset = function( id ){
        
        return {
            id: id,
            url: path.idToUrl( id ),
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
        
        global.clearTimeout( asset.timeoutTimer );
        
        var call, queue;
        
        if ( type === 'callback' ){
            asset.status = STATUS_LOADED;
            queue = asset.callbackQueue;
        } else {
            asset.status = STATUS_TIMEOUT;
            queue = asset.errorbackQueue;
        }
        
        while ( call = queue.shift() ){
            call();
        };
        
    },
    
    request = function( id, callback, errorback ){
        var asset = assetsCache[id] || createAsset( id ),
            fallback;
        
        if ( asset.status === STATUS_LOADED ){
            callback && callback();
            return;
        }
        
        asset.callbackQueue.push( callback );
        asset.errorbackQueue.push( errorback );
        
        if ( asset.status === STATUS_LOADING ){
            return;
        }
        
        assetsCache[id] = asset;
        asset.status = STATUS_LOADING;
        
        asset.timeoutTimer = setTimeout( function(){
            asset.timeout = true;
            completeLoad( asset, 'errorback' );
            event.emit( 'requestTimeout', asset );
        }, configCache.loadTimeout );

        loader( asset.url, function(){
            completeLoad( asset, 'callback' );
        } );
        
    };
    
    
    return request;
    
} );
