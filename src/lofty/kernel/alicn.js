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
