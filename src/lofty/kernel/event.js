/**
 * @module lofty/kernel/event
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130308
 * */


lofty( 'event', ['lang','cache'], function( lang, cache ){
    'use strict';
    
    var eventsCache = cache.events = {};
    
    var event = {
        on: function( name, callback ){
            var list = eventsCache[name] || ( eventsCache[name] = [] );
            list.push( callback );
        },
        emit: function( name ){
            var args = lang.slice.call( arguments, 1 ),
                list = eventsCache[name];
            
            if ( list ){
                lang.forEach( list, function( item ){
                    item.apply( null, args );
                } );
            }
        }
    };
    
    return event;
    
} );
