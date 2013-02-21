/**
 * @fileoverview unit testing for lofty/kernel/loader
 * @author Edgar
 * @build 130129
 * */

var getStyle = function( node, name ){
    var ret;
    
    if ( getComputedStyle ){
        ret = getComputedStyle( node );
    } else {
        ret = node.currentStyle;
    }
    
    return ret[name];
};

describe( 'lofty/kernel/loader', function(){
    
    describe( 'lofty.sdk.util.load', function(){
        it( 'util.load加载js', function(){
            var a;
            
            runs(function(){
                define(['require'],function(require){
                    lofty.sdk.util.load( 'http://la/projects/lofty/tests/specs/kernel/loader/a.js', function(){
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
        
        it( 'util.load加载js error', function(){
            var a;
            
            runs(function(){
                define(['require'],function(require){
                    lofty.sdk.util.load( 'http://la/projects/lofty/tests/specs/kernel/loader/404.js', function(){
                        a = require('specs/kernel/loader/a');
                    }, function(){
                        a = 'specs-kernel-loader-404';
                    } );
               } );
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('specs-kernel-loader-404');
            });
        } );
        
        var el;
            
        beforeEach(function(){
            el = document.createElement('div');
            el.id = 'lofty';
            document.body.appendChild( el );
        });
        
        it( 'util.load加载css', function(){
            var a;
            
            runs(function(){
                define(['require'],function(require){
                    lofty.sdk.util.load( 'http://la/projects/lofty/tests/specs/kernel/loader/a.css?130220', function(){
                        a = getStyle( el, 'width');
                    } );
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
        
        it( 'util.load加载css error', function(){
            var a;
            
            runs(function(){
                define(['require'],function(require){
                    lofty.sdk.util.load( 'http://la/projects/lofty/tests/specs/kernel/loader/404.css', function(){
                        a = '100px';
                    }, function(){
                        a = '404';
                    } );
               } );
            });
            
            waitsFor(function(){
                return !!a;
            });
            
            runs(function(){
                expect(a).toEqual('404');
            });
        } );
        
    } );
    
} );
