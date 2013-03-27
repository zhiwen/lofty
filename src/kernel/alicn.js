/**
 * @module lofty/kernel/alicn
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130324
 * */


lofty( 'alicn', ['global','event'],
    function( global, event ){
    'use strict';
    
    var rStyle = /\.css(?:\?|$)/;
    
    var resolve = function( id ){
        
        var parts = id.split('/'),
            root = parts[0],
            type = rStyle.test( id ) ? 'css/' : 'js/';
        
        switch ( root ){
            case 'lofty':
            case 'avid':
                id = '/fdevlib/' + type + id;
                break;
            case 'sys':
                id = '/sys/' + type + parts.slice( 1 ).join('/');
                break;
        }
        
        return id;
    };
    
    this.config({
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
        global[name] = {
            log: this.log,
            define: this.define,
            on: event.on
        };
    };
    
} );
