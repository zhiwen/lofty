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
