/**
 * @module lofty/kernel/id2url
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130324
 * */


lofty( 'id2url', ['global','event','config','alias'], function( global, event, config, alias ){
    'use strict';
    
    var configCache = this.cache.config;
    
    var rFileSuffix = /\?|\.(?:css|js)$|\/$/,
        rAbsolute = /^https?:\/\//,
        timeStamp = ( new Date() ).getTime();
    
    configCache.baseUrl = (function(){
        var rUrl = /([\w]+)\:\/\/([\w|\.|\:]+)\//i,
            scripts = global.document.getElementsByTagName('script'),
            selfScript = scripts[scripts.length-1],
            selfUrl = ( selfScript.hasAttribute ? selfScript.src : selfScript.getAttribute("src", 4) ).match( rUrl );
        
        return selfUrl[0];
    })();
    
    config.addRuleKey( 'resolve', 'array' )
        .addRuleKey( 'stamp', 'object' );
    
    
    var parseResolve = function( asset ){
            
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
        
        asset.url = url ? url : asset.id;
    },
    
    addBaseUrl = function( asset ){
        rAbsolute.test( asset.url ) || ( asset.url = configCache.baseUrl + asset.url );
    },
    
    addSuffix = function( asset ){
        
        !rFileSuffix.test(asset.url) && ( asset.url += '.js' );
    },
    
    addStamp = function( asset ){
            
        var t = configCache.hasStamp ? timeStamp : null,
            stamp = configCache.stamp;
            
        if ( stamp && stamp[asset.id] ){
            t = stamp[asset.id];
        }
        
        t && ( asset.url += '?lofty.stamp=' + t );
    },
    
    id2url = function( asset ){
        
        alias( asset );
        parseResolve( asset );
        addBaseUrl( asset );
        addSuffix( asset );
        addStamp( asset );
        
        event.emit( 'id2url', asset );
    };
    
    
    return id2url;
    
} );
