/**
 * @fileoverview unit testing for lofty/kernel/loader
 * @author Edgar
 * @build 130129
 * */


describe( 'lofty/kernel/loader', function(){
    
    var getStyle = function( node, name ){
        var ret;
        
        if ( window.getComputedStyle ){
            ret = getComputedStyle( node );
        } else {
            ret = node.currentStyle;
        }
        
        return ret[name];
    };

    define('specs/kernel/loader/b',function(){ return 'specs-kernel-loader-b'; });
    
    var loader = lofty.cache.kernel.loader;
    
    it( 'load js', function(){
        var a;
        
        runs(function(){
            define(['require'],function(require){
                loader( '/tests/specs/kernel/loader/a.js', function(){
                    a = require('specs/kernel/loader/a');
                } );
           } );
        });
        
        waitsFor(function(){
            return !!a;
        });
        
        runs(function(){
            expect(a).toEqual('specs-kernel-loader-a');
        });
    } );
    
    var el;
        
    beforeEach(function(){
        el = document.createElement('div');
        el.id = 'lofty';
        document.body.appendChild( el );
    });
    
    it( 'load css', function(){
        var a;
        
        runs(function(){
            loader( '/tests/specs/kernel/loader/a.css?130220', function(){
                a = getStyle( el, 'width');
            } );
        });
        
        waitsFor(function(){
            return !!a;
        });
        
        runs(function(){
            expect(a).toEqual('100px');
        });
    } );
    
    afterEach(function(){
        document.body.removeChild( el );
    });
    
} );
