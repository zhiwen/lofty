/**
 * @fileoverview unit testing for lofty/kernel/alicn
 * @author Edgar
 * @build 130325
 * */

describe( 'lofty/kernel/alicn', function(){
    
    var configCache = lofty.cache.config,
        id2url = lofty.cache.kernel.id2url;
    
    id2url && describe( 'config配置', function(){
        
        id2url = id2url.exports;
        
        it( '时间戳hasStamp为true', function(){
            var a = { id: 'jioje/wwfdfe' };
            id2url(a);
            
            expect(configCache.hasStamp).toEqual(true);
            expect(a.url.indexOf('lofty.stamp=')>0).toEqual(true);
        } );
        
        it( '启用href debug标记', function(){
            expect(configCache.debug).toEqual(location.href.indexOf('lofty.debug=true')>0);
        } );
        
        it( 'resolve处理lofty/avid/sys', function(){
            var a = { id: 'lofty/tests/a' };
            var b = { id: 'lofty/tests/a.css' };
            var c = { id: 'avid/tests/a' };
            var d = { id: 'avid/tests/a.css' };
            var e = { id: 'sys/tests/a' };
            var f = { id: 'sys/tests/a.css' };
            
            id2url(a);
            id2url(b);
            id2url(c);
            id2url(d);
            id2url(e);
            id2url(f);
            
            expect(a.url.indexOf('fdevlib/js/lofty/tests/a.js')>0).toEqual(true);
            expect(b.url.indexOf('fdevlib/css/lofty/tests/a.css')>0).toEqual(true);
            expect(c.url.indexOf('fdevlib/js/avid/tests/a.js')>0).toEqual(true);
            expect(d.url.indexOf('fdevlib/css/avid/tests/a.css')>0).toEqual(true);
            expect(e.url.indexOf('sys/js/tests/a.js')>0).toEqual(true);
            expect(f.url.indexOf('sys/css/tests/a.css')>0).toEqual(true);
        } );
    } );
    
    describe( '生成应用框架名', function(){
        it( 'lofty.appframe', function(){
            lofty.appframe('alpha');
            
            expect(alpha.log).toEqual(lofty.log);
            expect(alpha.define).toEqual(lofty.define);
            expect(alpha.on).toEqual(lofty.cache.kernel.event.exports.on);
        } );
    } );
} );
