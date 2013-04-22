/**
 * @module lofty/kernel/alicn
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130422
 * */


lofty( 'alicn', ['global','event','config'],
    function( global, event, config ){
    'use strict';
    
    var rStyle = /\.css(?:\?|$)/,
        rId = /([a-z])([A-Z])/g;
    
    var resolve = function( id ){
        
        var parts = id.split('/'),
            root = parts[0],
            type = rStyle.test( id ) ? 'css/' : 'js/';
        
        switch ( root ){
            case 'lofty':
            case 'gallery':
                id = 'fdevlib/' + type + id;
                break;
            case 'sys':
                id = 'sys/' + type + parts.slice( 1 ).join('/');
                break;
        }
        
        return id;
    };
    
    event.on( 'resolve', function( asset ){
        
        asset.url = asset.url.replace( rId, function( s, s1, s2 ){
            return s1 + '-' + s2;
        } ).toLowerCase();
    } );
    
    this.config({
        amd: false,
        hasStamp: true,
        resolve: resolve,
        debug: function(){
            var isDebug = false,
                href = global.location.href;
            
            href.indexOf('lofty.debug=true') > 0 && ( isDebug = true );
            
            return isDebug;
        }()
    });
    
    
    this.appframe = function( name ){
        
        var frame = global[name] = {
            define: this.define,
            log: this.log,
            config: this.config,
            on: event.on
        },
        
        cfg = frame.config;
        
        cfg.addRule = config.addRule;
        cfg.addItem = config.addItem;
    };
    
} );
