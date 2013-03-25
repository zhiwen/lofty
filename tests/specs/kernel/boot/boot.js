/**
 * @fileoverview unit testing for lofty/kernel/boot
 * @author Edgar
 * @build 130308
 * */

describe( 'lofty/kernel/boot', function(){

    describe( 'lofty关键字', function(){
        it( '存在关键字lofty', function(){
            expect(lofty).toBeTruthy();
        } );
    } );
    
    describe( 'lofty定义模块', function(){
        it( '一经定义，即刻执行', function(){
            var a, c;
            
            lofty( 'specs/kernel/boot/a', function(){
                a = 'a';
            } );
            
            lofty( 'specs/kernel/boot/b', function(){
                return 'b'
            } );
            
            lofty( 'specs/kernel/boot/c', ['specs/kernel/boot/b'], function(B){
                c = B + 'c';
            } );
            
            expect(a).toEqual('a');
            expect(c).toEqual('bc');
        } );
        
        it( '重复定义，只取前者', function(){
            var a;
            
            lofty( 'specs/kernel/boot/d', function(){
                return 'a';
            } );
            
            lofty( 'specs/kernel/boot/d', function(){
                return 'b';
            } );
            
            lofty( 'specs/kernel/boot/e', ['specs/kernel/boot/d'], function(D){
                a = D;
            } );
            
            expect(a).toEqual('a');
        } );
    } );
    
    describe( '默认模块', function(){
        it( 'module global', function(){
            var a;
            lofty( 'specs/kernel/boot/f', ['global'], function( global ){
                a = global;
            } );
            
            expect(a).toEqual(window);
        } );
        
        it( 'module require', function(){
            var a;
            lofty( 'specs/kernel/boot/g', function(){
                return 'specs-kernel-boot-g';
            } );
            lofty( 'specs/kernel/boot/h', ['require'], function( require ){
                a = require('specs/kernel/boot/g');
            } );
            
            expect(a).toEqual('specs-kernel-boot-g');
        } );
    } );
    
} );
