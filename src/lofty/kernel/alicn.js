/**
 * @module lofty/kernel/alicn
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130216
 * */


(function( sdk, global ){
    'use strict';
    
    if ( sdk.fn.alicn ){
        return;
    }
    
    
    var fn = sdk.fn,
        configCache = sdk.cache.config,
        doc = global.document;
    
    
    var substitute = function( str, data ){
        return str.replace(/\{(\w+)\}/g, function( r, m ){
            return data[m] !== undefined ? data[m] : '{' + m + '}';
        });
    };
    
    
    var domain = (function(){
        var rUrl = /([\w]+)[\:\/\/]+([\w|\.]+)\//i,
            scripts = doc.getElementsByTagName('script'),
            selfScript = scripts[scripts.length-1],
            selfUrl = ( selfScript.hasAttribute ? selfScript.src : selfScript.getAttribute( 'src', 4 ) ).match( rUrl );
        
        return selfUrl[2];
    })();
    
    
    var rStyle = /\.css(?:\?|$)/,
        urlFormat = {
            'lofty': '/fdevlib/{type}/lofty/{id}',
            'makeup': '/fdevlib/{type}/makeup/{id}',
            'sys': '/sys/{type}{id}'
        };
    
    
    var resolve = function( id ){
        
        var parts = id.split('/'),
            root = parts[0],
            type = rStyle.test( id ) ? 'css' : 'js',
            format;
        
        if ( format = urlFormat[root] ){
            id = substitute( format, { type: type, id: id } );
        }
        
        return id;
        
    };
    
    
    fn.config({
        loadTimeout: 10000,
        hasStamp: true,
        protocol: 'http',
        domain: domain,
        resolve: resolve
    });
    
    
    fn.alicn = true;
    
    
})( lofty.sdk, this );
