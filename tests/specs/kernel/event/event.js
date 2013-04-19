/**
 * @fileoverview unit testing for lofty/kernel/event
 * @author Edgar
 * @build 130322
 * */

describe( 'lofty/kernel/event', function(){
    
    var event = lofty.cache.kernel.event,
        eventsCache = lofty.cache.events;
    
    it( 'event.on', function(){
        var a = eventsCache.a;
        event.on( 'a', function( meta ){
            meta.a = meta.a ? ++meta.a : 1;
        } );
        var b = eventsCache.a.slice();
        event.on( 'a', function( meta ){
            meta.a = meta.a ? ++meta.a : 1;
            meta.b = meta.b ? ++meta.b : 1;
        } );
        var c = eventsCache.a.slice();
        event.on( 'b', function( meta ){
            meta.a = meta.a ? ++meta.a : 1;
            meta.b = meta.b ? ++meta.b : 1;
            meta.c = meta.c ? ++meta.c : 1;
        } );
        var d = eventsCache.b.slice();
        
        expect(a).toEqual(undefined);
        expect(b.length).toEqual(1);
        expect(c.length).toEqual(2);
        expect(d.length).toEqual(1);
    } );
    
    it( 'event.emit', function(){
        var meta = {};
        event.emit( 'a', meta );
        var a = meta.a;
        var b = meta.b;
        event.emit( 'a', meta );
        var c = meta.a;
        var d = meta.b;
        event.on( 'a', function( meta, val ){
            meta.a = meta.a ? ++meta.a : 1;
            meta.b = meta.b ? ++meta.b : 1;
            meta.c = meta.c ? ++meta.c : val;
        } );
        event.emit( 'a', meta, 5 );
        var e = meta.a;
        var f = meta.b;
        var g = meta.c;
        event.emit( 'b', meta );
        var h = meta.a;
        var i = meta.b;
        var j = meta.c;
        
        expect(a).toEqual(2);
        expect(b).toEqual(1);
        expect(c).toEqual(4);
        expect(d).toEqual(2);
        expect(e).toEqual(7);
        expect(f).toEqual(4);
        expect(g).toEqual(5);
        expect(h).toEqual(8);
        expect(i).toEqual(5);
        expect(j).toEqual(6);
    } );
    
} );
