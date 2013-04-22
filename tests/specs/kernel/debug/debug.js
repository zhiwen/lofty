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
        
        a('debug,这行打印不出来','info');
        a('debug,这行也打印不出来','warn')
        b('debug,这是打印日志','info');
        b('debug,这是出错日志','warn');
    } );
    
    it( '各状态日志', function(){
        var a, b, c;
        
        define( 'specs/kernel/debug/a', function(){ return 'a'; } );
        define( 'specs/kernel/debug/a', function(){ return 'aa'; } );
        define( 'specs/kernel/debug/b', function(){ return 'b'; } );
        define( 'specs/kernel/debug/c', function(a){ a(); return 'c'; } );
        define(['specs/kernel/debug/a','specs/kernel/debug/b'], function(A,B){
            a = A + B;
        } );
        define(['specs/kernel/debug/c','specs/kernel/debug/d'], function(A,B){} );
        define(['specs/kernel/debug/a'], function(A){
            b = A;
        } );
        
        runs(function(){
            define(['require'], function(require){
                require.use('specs/kernel/debug/e', function(A){
                    c = A;
                });
            } );
        });
        
        waitsFor(function(){
            return !!c;
        });
        
            
        runs(function(){
            expect(a).toEqual('ab');    
            expect(b).toEqual('a');    
            expect(c).toEqual('e');    
            lofty.config({
                debug: originDebug
            });
        });
        
    } );
    
} );
