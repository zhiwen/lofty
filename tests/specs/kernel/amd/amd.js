/**
 * @fileoverview unit testing for lofty/kernel/amd
 * @author Edgar
 * @build 130129
 * */

describe( 'lofty/kernel/amd', function(){
    
    describe( 'define支持循环依赖解析', function(){
        it( '一级依赖', function(){
            var a, b, c;
            
            runs(function(){
                define(['specs/kernel/amd/a','specs/kernel/amd/b','specs/kernel/amd/c'], function( A, B, C ){
                    a = A;
                    b = B;
                    c = C;
                });
            });
            
            waitsFor(function(){
                return !!a && !!b && !!c;
            });
            
            runs(function(){
                expect(a).toEqual('a');
                expect(b).toEqual('b');
                expect(c).toEqual('c');
            });
        } );
        
        it( '一、二级依赖', function(){
            var a, b;
            //   > d
            // e1 > e
            runs(function(){
                define(['specs/kernel/amd/d','specs/kernel/amd/e'], function( A, B ){
                    a = A;
                    b = B;
                });
            });
            
            waitsFor(function(){
                return !!a && !!b;
            });
            
            runs(function(){
                expect(a).toEqual('d');
                expect(b).toEqual('e1e');
            });
        } );
        
        it( '多级依赖', function(){
            var a, b, c;
            // e > f1 > f
            // f21 > f2 > 
            // f1 > g1 > g
            //     f21 > h
            runs(function(){
                define(['specs/kernel/amd/f','specs/kernel/amd/g','specs/kernel/amd/h'], function( A, B, C ){
                    a = A;
                    b = B;
                    c = C;
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
        
        it( '别名依赖', function(){
            var a;
            
            lofty.config({
                alias: {
                    'utamdalias': 'specs/kernel/amd/i'
                }
            });
            
            runs(function(){
                define(['utamdalias'],function(A){
                    a = A;
                });
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('i');
            });
        } );
        
        it( '已存在的依赖', function(){
            var a;
            
            runs(function(){
                define(['specs/kernel/module/a'], function(A){
                    a = A;
                });
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('specs-kernel-module-a');
            });
        } );
        
        it( '关键模块依赖', function(){
            var a;
            
            runs(function(){
                define(['specs/kernel/amd/j'], function(A){
                    a = A.a;
                });
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('j1j2j');
            });
        } );
    } );
    
} );
