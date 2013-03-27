/**
 * @module lofty/kernel/event
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130322
 * */


lofty( 'event', function(){
    'use strict';
    
    /**
     * Thanks to:
     * SeaJS, http://seajs.org/
     * */
    
    var eventsCache = this.cache.events = {},
        slice = [].slice;
    
    var exports = {
        on: function( name, callback ){
            var list = eventsCache[name] || ( eventsCache[name] = [] );
            list.push( callback );
        },
        emit: function( name ){
            var args = slice.call( arguments, 1 ),
                list = eventsCache[name],
                fn, i = 0;
            
            if ( list ){
                while ( ( fn = list[i++] ) ){
                    fn.apply( null, args );
                }
            }
        }
    };
    
    return exports;
    
} );
