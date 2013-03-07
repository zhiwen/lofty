/**
 * @fileoverview unit testing for lofty/kernel/loader
 * @author Edgar
 * @build 130129
 * */

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

describe( 'lofty/kernel/loader', function(){
    
    describe( 'lofty.sdk.util.load', function(){
        it( 'util.loadº”‘ÿjs', function(){
            var a;
            
            runs(function(){
                define(['require'],function(require){
                    lofty(['loader'],function(loader){
                        loader( '/tests/specs/kernel/loader/a.js', function(){
                            a = require('specs/kernel/loader/a');
                        } );
                    });
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
        
        it( 'util.loadº”‘ÿcss', function(){
            var a;
            
            runs(function(){
                define(['require'],function(require){
                    lofty(['loader'],function(loader){
                        loader( '/tests/specs/kernel/loader/a.css?130220', function(){
                            a = getStyle( el, 'width');
                        } );
                    });
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
    
} );
