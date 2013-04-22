/**
 * @fileoverview unit testing for lofty/kernel/alias
 * @author Edgar
 * @build 130321
 * */

describe( 'lofty/kernel/alias', function(){
    
    var alias = lofty.cache.parts.alias;
    
    it( 'alias', function(){
        lofty.config({
            alias: {
                'a': 'ayj6yuyj',
                'b': 'yuj0ijedqr'
            }
        });
        
        var a = { id: 'a' };
        var b = { id: 'b' };
        var c = { id: 'c' };
        
        alias(a);
        alias(b);
        alias(c);
        
        expect(a.id).toEqual('ayj6yuyj');
        expect(b.id).toEqual('yuj0ijedqr');
        expect(c.id).toEqual('c');
    } );
    
} );
