/**
 * @fileoverview unit testing for lofty/kernel/use
 * @author Edgar
 * @build 130129
 * */

describe( 'lofty/kernel/use', function(){
    
    describe( 'require.use', function(){
        it( '异步使用模块', function(){
            var a;
            
            runs(function(){
                define(['require'],function(require){
                    require.use( 'specs/kernel/use/a', function(A){
                        a = A;
                    } );
               } );
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('specs-kernel-use-a');
            });
        } );
        
        it( '重复异步使用模块', function(){
            var a, b, c;
            
            window.specsKernelUseB = 0;
            
            runs(function(){
                define(['require'],function(require){
                    require.use( 'specs/kernel/use/b', function(A){
                        a = A;
                    } );
                    require.use( ['specs/kernel/use/b','specs/kernel/use/c'], function(A,B){
                        b = A;
                        c = B;
                    } );
               } );
            });
            
            waitsFor(function(){
                return !!a && !!b && !!c;
            });
            
            runs(function(){
                expect(a).toEqual(1);
                expect(b).toEqual(1);
                expect(c).toEqual('specs-kernel-use-c');
            });
        } );
        
        it( '使用已存在的模块', function(){
            var a;
            
            define(['require'], function(require){
                require.use( 'specs/kernel/module/a', function(A){
                    a = A;
                } );
            });
            
            expect(a).toEqual('specs-kernel-module-a');
        } );
        
        it( '不能使用关键模块', function(){
            var a = false, b;
            
            runs(function(){
                define(['require'],function(require){
                    require.use( ['module','specs/kernel/use/d'], function(A,B){
                        a = A === null;
                        b = B;
                    } );
                });
            });
            
            waitsFor(function(){
                return typeof a === 'boolean' && !!b;
            });
            
            runs(function(){
                expect(a).toBe(true);
                expect(b).toEqual('specs-kernel-use-d');
            });
        } );
        
        it( '使用别名模块', function(){
            var a, b;
            
            lofty.config({
                alias: {
                    'utrequirealiashas': 'specs/kernel/module/b',
                    'utrequirealiasnth': 'specs/kernel/use/l'
                }
            });
            
            runs(function(){
                define(['require'],function(require){
                    require.use(['utrequirealiashas','utrequirealiasnth'],function(A,B){
                        a = A;
                        b = B;
                    });
                });
            });
            
            waitsFor(function(){
                return !!a && !!b;
            });
            
            runs(function(){
                expect(a).toEqual('specs-kernel-module-b');
                expect(b).toEqual('specs-kernel-use-l');
            });
        } );
    } );
    
    describe( 'require.use支持循环依赖', function(){
        it( '二级依赖', function(){
            var a;
            
            runs(function(){
                define(['require'],function(require){
                    require.use( 'specs/kernel/use/k', function(A){
                        a = A;
                    } );
               } );
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('k1k');
            });
        } );
        
        it( '多级依赖', function(){
            var a, b, c;
            // e > f1 > f
            // f21 > f2 > 
            // f1 > g1 > g
            //     f21 > h
            runs(function(){
                define( ['require'], function( require ){
                    require.use( ['specs/kernel/use/f','specs/kernel/use/g','specs/kernel/use/h'], function( A, B, C ){
                        a = A;
                        b = B;
                        c = C;
                    } );
                });
            });
            
            waitsFor(function(){
                return !!a && !!b && !!c;
            });
            
            runs(function(){
                expect(a).toEqual('e1ef1f21f2f');
                expect(b).toEqual('e1ef1g1g');
                expect(c).toEqual('f21h');
            });
        } );
    } );
} );
