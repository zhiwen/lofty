/**
 * @fileoverview unit testing for lofty/kernel/debug
 * @author Edgar
 * @build 130325
 * */

describe( 'lofty/kernel/debug', function(){
    
    var originDebug = lofty.cache.config.debug;
    
    it( 'lofty.log', function(){
        lofty.config({
            debug: false
        });
        var a = lofty.log;
        
        lofty.config({
            debug: true
        });
        var b = lofty.log;
        
        a('这行打印不出来','info');
        a('这行也打印不出来','warn')
        b('这是打印日志','info');
        b('这是出错日志','warn');
        
        lofty.config({
            debug: originDebug
        });
    } );
    
} );
