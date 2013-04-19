/**
 * @fileoverview unit testing for lofty/kernel/request
 * @author Edgar
 * @build 130324
 * */

describe( 'lofty/kernel/request', function(){
    
    var request = lofty.cache.kernel.request;
    
    it( 'request', function(){
        var a;
        
        runs(function(){
            define(['require'],function(require){
                request( 'specs/kernel/request/a', function(){
                    a = require('specs/kernel/request/a');
                } );
           } );
        });
        
        waitsFor(function(){
            return !!a;
        });
        
        runs(function(){
            expect(a).toEqual('specs-kernel-request-a');
        });
    } );
    
    it( 'request repeat', function(){
        var a, b;
        
        window.specsKernelRequestB = 0;
        
        runs(function(){
            define(['require'],function(require){
                request('specs/kernel/request/b',function(){
                    a = require('specs/kernel/request/b');
                });
                request('specs/kernel/request/b',function(){
                    b = require('specs/kernel/request/b');
                });
           } );
        });
        
        waitsFor(function(){
            return !!a && !!b;
        });
        
        runs(function(){
            expect(a).toEqual(1);
            expect(b).toEqual(1);
        });
    } );
    
} );
