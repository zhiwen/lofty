/**
 * @fileoverview unit testing for lofty/kernel/af
 * @author Edgar
 * @build 130129
 * */


//var fn = lofty.sdk.fn;

describe( 'lofty/kernel/af', function(){
    
    describe( 'fn.af', function(){
        it( '生成af', function(){
            window.afalpha = null;
            
            lofty(['fn','cache'],function(fn,cache){
                cache.config.rNonAf = /module/;
                fn.af('afalpha');
            });
            
            expect(!!window.afalpha).toEqual(true);
        } );
        
        it( '仅存储时模块id增加af前缀', function(){
            var a;
            
            define( 'specs/kernel/af/a', ['module'], function( module ){
                return module.id;
            } );
            define(['specs/kernel/af/a'],function(A){
                a = A;
            });
            
            expect(a).toEqual('specs/kernel/af/a');
            expect(lofty.cache.modules['afalpha:specs/kernel/af/a'].exports).toEqual('specs/kernel/af/a');
        } );
        
    } );
    
} );
