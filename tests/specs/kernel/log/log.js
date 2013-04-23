/**
 * @fileoverview unit testing for lofty/kernel/log
 * @author Edgar
 * @build 130423
 * */

describe( 'lofty/kernel/log', function(){
    
    var originLog = lofty.log,
        log = lofty.cache.parts.log;
    
    var noop = lofty.log = function(){};
    
    it( 'log.create', function(){
        log.create( true );
        
        expect(lofty.log.toString()!==noop.toString()).toEqual(true);
    } );
    
    it( 'log.log', function(){
        log.log('log.log打印的');
    } );
    
    it( 'log.warn', function(){
        log.warn('log.warn打印的');
    } );
    
    it( 'lofty.log', function(){
        lofty.log('log中的lofty.log打印的info日志','info');
        lofty.log('log中的lofty.log打印的warn日志','warn');
        
        log.create(false);
        
        lofty.log('这行log中的lofty.log打印不出来','info');
        lofty.log('这行log中的lofty.log也打印不出来','warn');
    } );
    
    lofty.log = originLog;
    
} );
