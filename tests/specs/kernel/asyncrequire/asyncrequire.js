/**
 * @fileoverview unit testing for lofty/kernel/asyncrequire
 * @author Edgar
 * @build 130129
 * */

describe( 'lofty/kernel/asyncrequire', function(){
    
    describe( 'require.async', function(){
        it( '异步引用模块', function(){
            var a;
            
            runs(function(){
                define(['require'],function(require){
                    require.async( 'specs/kernel/asyncrequire/a', function(A){
                        a = A;
                    } );
               } );
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('specs-kernel-asyncrequire-a');
            });
        } );
        
        it( '重复异步引用模块', function(){
            var a, b, c;
            
            window.specsKernelAsyncrequireB = 0;
            
            runs(function(){
                define(['require'],function(require){
                    require.async( 'specs/kernel/asyncrequire/b', function(A){
                        a = A;
                    } );
                    require.async( ['specs/kernel/asyncrequire/b','specs/kernel/asyncrequire/c'], function(A,B){
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
                expect(c).toEqual('specs-kernel-asyncrequire-c');
            });
        } );
        
        it( '引用已存在的模块', function(){
            var a;
            
            define(['require'], function(require){
                require.async( 'specs/kernel/module/a', function(A){
                    a = A;
                } );
            });
            
            expect(a).toEqual('specs-kernel-module-a');
        } );
        
        it( '不能引用关键模块', function(){
            var a = false, b;
            
            runs(function(){
                define(['require'],function(require){
                    require.async( ['module','specs/kernel/asyncrequire/d'], function(A,B){
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
                expect(b).toEqual('specs-kernel-asyncrequire-d');
            });
        } );
        
        it( '引用别名模块', function(){
            var a, b;
            
            lofty.config({
                alias: {
                    'utrequirealiashas': 'specs/kernel/module/b',
                    'utrequirealiasnth': 'specs/kernel/asyncrequire/e'
                }
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
                expect(a).toEqual('specs-kernel-module-b');
                expect(b).toEqual('specs-kernel-asyncrequire-e');
            });
        } );
    } );
    
} );
