/**
 * @fileoverview unit testing for lofty/kernel/id2url
 * @author Edgar
 * @build 130324
 * */

describe( 'lofty/kernel/id2url', function(){
    
    var id2url = lofty.cache.kernel.id2url.exports;
    
    var baseUrl = lofty.cache.config.baseUrl;
    
    lofty.config({
        hasStamp: false
    });
    
    it( 'id2url', function(){
        var a = { id: 'erd4e' };
        var b = { id: 'wegf.css' };
        
        id2url(a);
        id2url(b);
        
        expect(a.url).toEqual(baseUrl+'erd4e.js');
        expect(b.url).toEqual(baseUrl+'wegf.css');
    } );
    
    it( 'id2url´æÔÚalias', function(){
        var a = { id: 'dj' };
        var b = { id: 'uj' };
        lofty.config({
            alias: {
                'dj': 'gbnjoe',
                'uj': 'hd0efjj'
            }
        });
        
        id2url(a);
        id2url(b);
        
        expect(a.url).toEqual(baseUrl+'gbnjoe.js');
        expect(b.url).toEqual(baseUrl+'hd0efjj.js');
    } );
    
    it( 'id2url´æÔÚresolve', function(){
        var a = { id: 'ed/ge'};
        var b = { id: 'ws/ged' };
        lofty.config({
            resolve: function( id ){
                var parts = id.split('/'),
                    root = parts[0];
                switch(root){
                    case 'ed':
                        id = 'sw/'+id;
                        break;
                    case 'ws':
                        id = 'wsfd/'+parts.slice(1).join('/');
                        break;
                }
                return id;
            }
        });
        
        id2url(a);
        id2url(b);
        
        expect(a.url).toEqual(baseUrl+'sw/ed/ge.js');
        expect(b.url).toEqual(baseUrl+'wsfd/ged.js');
    });
    
    it( 'id2url´æÔÚstamp', function(){
        var a = { id: 'yhm/ghi' };
        var b = { id: 'ij/bjop' };
        lofty.config({
            stamp: {
                '^yhm': '130324',
                '.*bjop': '0.122'
            }
        });
        
        id2url(a);
        id2url(b);
        
        var c = { id: 'dfg/po' };
        lofty.config({
            hasStamp: true
        });
        
        id2url(c);
        
        expect(a.url).toEqual(baseUrl+'yhm/ghi.js?lofty.stamp=130324');
        expect(b.url).toEqual(baseUrl+'ij/bjop.js?lofty.stamp=0.122');
        expect(c.url.split('=')[0]).toEqual(baseUrl+'dfg/po.js?lofty.stamp');
    } );
    
} );
