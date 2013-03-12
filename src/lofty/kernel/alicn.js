/**
 * @module lofty/kernel/alicn
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130216
 * */

lofty( 'alicn', ['cache','global'], function( cache, global ){
    'use strict';
    
    var configCache = cache.config;
    
    var substitute = function( str, data ){
        return str.replace(/\{(\w+)\}/g, function( r, m ){
            return data[m] !== undefined ? data[m] : '{' + m + '}';
        });
    };
    
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
    
    
    configCache.hasStamp = true;
    configCache.resolve = [resolve];
    configCache.rAppframeExcept = [/^(lofty|makeup|sys)\//];
    
} );
