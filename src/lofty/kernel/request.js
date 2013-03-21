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
