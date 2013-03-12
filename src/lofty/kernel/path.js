/**
 * @module lofty/kernel/path
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130208
 * */


lofty( 'path', ['global','cache','module','lang','config'], function( global, cache, module, lang, config ){
    'use strict';
    
    var configCache = cache.config,
        doc = global.document;
    
    var rFileSuffix = /\?|\.(?:css|js)$|\/$/;
    
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
        parseResolve: function( id ){
            
            var resolve = configCache.resolve,
                url;
            
            if ( resolve ){
                for ( var i = 0, l = resolve.length; i < l; i++ ){
                    url = resolve[i]( id );
                    
                    if ( url !== id ){
                        break;
                    }
                }
            }
            
            return configCache.protocol +'://' + configCache.domain + url;
        },
        
        addFileSuffix: function( url ){
            
            if ( !rFileSuffix.test(url) ){
                url += '.js';
            }
            
            return url;
        },
        
        addStamp: function( url, id ){
            
            var stamp,
                t = configCache.hasStamp ? lang.now() : null;
                
            if ( configCache.stamp && ( stamp = configCache.stamp[id] ) ){
                t = stamp;
            }
            
            t && ( url += '?lofty.stamp=' + t );
            
            return url;
        },
        
        idToUrl: function( id ){
            
            var url = '';
            
            id = module.parseAlias( id );
            url = path.parseResolve( id );
            url = path.addFileSuffix( url );
            url = path.addStamp( url, id );
            
            return url;
        }
    };
    
    
    return path;
    
} );
