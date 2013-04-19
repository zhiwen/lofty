/**
 * @fileoverview unit testing for lofty/kernel/alicn
 * @author Edgar
 * @build 130419
 * */

describe( 'lofty/kernel/alicn', function(){
    
    var configCache = lofty.cache.config,
        id2url = lofty.cache.kernel.id2url;
    
    id2url && describe( 'config配置', function(){
        
        it( '时间戳hasStamp为true', function(){
            var a = { id: 'jioje/wwfdfe' };
            id2url(a);
            
            expect(configCache.hasStamp).toEqual(true);
            expect(a.url.indexOf('lofty.stamp=')>0).toEqual(true);
        } );
        
        it( '启用href debug标记', function(){
            expect(configCache.debug).toEqual(location.href.indexOf('lofty.debug=true')>0);
        } );
        
        it( 'resolve处理lofty/gallery/sys', function(){
            var a = { id: 'lofty/tests/a' };
            var b = { id: 'lofty/tests/a.css' };
            var c = { id: 'gallery/tests/a' };
            var d = { id: 'gallery/tests/a.css' };
            var e = { id: 'sys/tests/a' };
            var f = { id: 'sys/tests/a.css' };
            
            id2url(a);
            id2url(b);
            id2url(c);
            id2url(d);
            id2url(e);
            id2url(f);
            
            expect(a.url.indexOf('fdevlib/js/lofty/tests/a.js')>0).toEqual(true);
            expect(b.url.split('?')[0]).toEqual(configCache.baseUrl+'fdevlib/css/lofty/tests/a.css');
            expect(c.url.indexOf('fdevlib/js/gallery/tests/a.js')>0).toEqual(true);
            expect(d.url.split('?')[0]).toEqual(configCache.baseUrl+'fdevlib/css/gallery/tests/a.css');
            expect(e.url.split('?')[0]).toEqual(configCache.baseUrl+'sys/js/tests/a.js');
            expect(f.url.indexOf('sys/css/tests/a.css')>0).toEqual(true);
        } );
        
        it( 'resolve时，将url中的小驼峰改成中横线', function(){
            var a = { id: 'lofty/tests/aaF' };
            var b = { id: 'blofty/tests/bbCdEf' };
            var c = { id: 'ghjio/yuioWgh/iuh' };
            
            id2url(a);
            id2url(b);
            id2url(c);
            
            expect(a.url.indexOf('lofty/tests/aa-f.js')>0).toEqual(true);
            expect(b.url.split('?')[0]).toEqual(configCache.baseUrl+'blofty/tests/bb-cd-ef.js');
            expect(c.url.indexOf('ghjio/yuio-wgh/iuh')>0).toEqual(true);
        } );
    } );
    
    describe( '生成应用框架名', function(){
        it( 'lofty.appframe', function(){
            lofty.appframe('alpha');
            
            expect(alpha.log).toEqual(lofty.log);
            expect(alpha.define).toEqual(lofty.define);
            expect(alpha.on).toEqual(lofty.cache.kernel.event.on);
        } );
    } );
} );
