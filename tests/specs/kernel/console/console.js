/**
 * @fileoverview unit testing for lofty/kernel/console
 * @author Edgar
 * @build 130325
 * */

describe( 'lofty/kernel/console', function(){
    
    var console = lofty.cache.parts.console;
    
    it( 'console', function(){
        console('这行是打印日志','info');
        console('这行是出错日志','warn');
    } );
    
} );
