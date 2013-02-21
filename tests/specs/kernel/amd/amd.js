/**
 * @fileoverview unit testing for lofty/kernel/amd
 * @author Edgar
 * @build 130129
 * */

describe( 'lofty/kernel/amd', function(){
    
    describe( 'lofty.sdk.fn.amd', function(){
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
            var d, f;
            //   > d
            // e > f
            runs(function(){
                define(['specs/kernel/amd/d','specs/kernel/amd/f'], function( D, F ){
                    d = D;
                    f = F;
                });
            });
            
            waitsFor(function(){
                return !!d && !!f;
            });
            
            runs(function(){
                expect(d).toEqual('d');
                expect(f).toEqual('ef');
            });
        } );
        
        it( '多级依赖', function(){
            var j, l, m;
            // f > g > j
            // h > i > 
            // g > k > l
            //     h > m
            runs(function(){
                define(['specs/kernel/amd/j','specs/kernel/amd/l','specs/kernel/amd/m'], function( J, L, M ){
                    j = J;
                    l = L;
                    m = M;
                });
            });
            
            waitsFor(function(){
                return !!j && !!l && !!m;
            });
            
            runs(function(){
                expect(j).toEqual('efghij');
                expect(l).toEqual('efgkl');
                expect(m).toEqual('hm');
            });
        } );
        
        it( '别名依赖', function(){
            var n;
            
            define(['config'],function(config){
                config({
                    alias: {
                        'utamdalias': 'specs/kernel/amd/n'
                    }
                });
            });
            
            runs(function(){
                define(['utamdalias'],function(N){
                    n = N;
                });
            });
            
            waitsFor(function(){
                return !!n;
            });
            
            runs(function(){
                expect(n).toEqual('n');
            });
        } );
    } );
    
} );
