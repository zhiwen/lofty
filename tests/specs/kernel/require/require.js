/**
 * @fileoverview unit testing for lofty/kernel/require
 * @author Edgar
 * @build 130129
 * */

describe( 'lofty/kernel/require', function(){
    
    describe( 'require.async', function(){
        it( '异步引用模块', function(){
            var a;
            
            runs(function(){
                define(['require'],function(require){
                    require.async( 'specs/kernel/require/a', function(A){
                        a = A;
                    } );
               } );
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('specs-kernel-require-a');
            });
        } );
        
        it( '重复异步引用模块', function(){
            var a, b, c;
            
            window.specsKernelRequireB = 0;
            
            runs(function(){
                define(['require'],function(require){
                    require.async( 'specs/kernel/require/b', function(A){
                        a = A;
                    } );
                    require.async( ['specs/kernel/require/b','specs/kernel/require/c'], function(A,B){
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
                expect(c).toEqual('specs-kernel-require-c');
            });
        } );
        
        it( '引用已存在的模块', function(){
            var a;
            
            define(['require'], function(require){
                require.async( 'specs/kernel/define/a', function(A){
                    a = A;
                } );
            });
            
            expect(a).toEqual('specs-kernel-define-a');
        } );
        
        it( '不能引用关键模块', function(){
            var a = false, b;
            
            runs(function(){
                define(['require'],function(require){
                    require.async( ['config','specs/kernel/require/d'], function(A,B){
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
                expect(b).toEqual('specs-kernel-require-d');
            });
        } );
        
        it( '引用别名模块', function(){
            var a, b;
            
            define(['config'],function(config){
                config({
                    alias: {
                        'utrequirealiashas': 'specs/kernel/define/b',
                        'utrequirealiasnth': 'specs/kernel/require/e'
                    }
                });
            });
            
            runs(function(){
                define(['require'],function(require){
                    require.async(['utrequirealiashas','utrequirealiasnth'],function(A,B){
                        a = A;
                        b = B;
                    });
                });
            });
            
            waitsFor(function(){
                return !!a && !!b;
            });
            
            runs(function(){
                expect(a).toEqual('specs-kernel-define-b');
                expect(b).toEqual('specs-kernel-require-e');
            });
        } );
    } );
    
} );
