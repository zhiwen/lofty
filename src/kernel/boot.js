/**
 * @module lofty/kernel/boot
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130419
 * */


(function( global ){
    'use strict';
    
    if ( global.lofty ){
        return;
    }
    
    var cache = {};
    
    var lofty = function( id, deps, factory ){
        
        if ( cache[id] ){
            return;
        }
        
        if ( !factory ){
            factory = deps;
            deps = [];
        }
        
        if ( 'function' === typeof factory ){
            var args = [];
            
            for ( var i = 0, l = deps.length; i < l; i++ ){
                args.push( require( deps[i] ) );
            }
            
            factory = factory.apply( lofty, args );
        }
        
        cache[id] = factory;
    },
    
    require = function( id ){
        
        return cache[id];
    };
    
    lofty.version = '0.1';
    
    lofty.cache = {
        kernel: cache
    };
    
    
    lofty( 'global', global );
    lofty( 'require', function(){
        return require;
    } );
    
    global.lofty = lofty;
    
})( this );
