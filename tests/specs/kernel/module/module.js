/**
 * @fileoverview unit testing for lofty/kernel/module
 * @author Edgar
 * @build 130129
 * */

describe( 'lofty/kernel/module', function(){
    
    
    describe( 'define关键字', function(){
        it( '存在关键字define', function(){
            expect(define).toBeTruthy();
        } );
        
        it( 'define是函数', function(){
            expect(typeof define).toEqual('function');
        } );
    } );
    
    
    describe( 'define语法', function(){
        it( 'define(id, factory)', function(){
            var a;
            
            define('specs/kernel/module/a', function(){
                return 'specs-kernel-module-a';
            });
            
            define(['specs/kernel/module/a'],function(A){
                a = A;
            });
            
            expect(a).toEqual('specs-kernel-module-a');
        } );
        
        it( 'define(id, deps, factory)', function(){
            var a;
            
            define('specs/kernel/module/b', ['specs/kernel/module/a'], function(A){
                return A.replace(/a/,'b');
            });
            
            define(['specs/kernel/module/b'], function(A){
                a = A;
            });
            
            expect(a).toEqual('specs-kernel-module-b');
        } );
        
        it( 'define(deps, factory)', function(){
            var a;
            
            define(['specs/kernel/module/a','specs/kernel/module/b'], function( A, B ){
                a = A +'&'+ B;
            });
            
            expect(a).toEqual('specs-kernel-module-a&specs-kernel-module-b');
        } );
        
        it( 'define(factory)', function(){
            var a;
            
            define(function(){
                a = 'specs-kernel-module-d';
            });
            
            expect(a).toEqual('specs-kernel-module-d');
        } );
        
        it( 'define(id, factory<object>)', function(){
            var a;
            
            define('specs/kernel/module/e', {
                specs: 'specs',
                kernel: 'kernel',
                module: 'module',
                a: 'e'
            });
            
            define(['specs/kernel/module/e'], function(A){
                var temp = [];
                for ( var i in A ){
                    temp.push(A[i]);
                }
                a = temp.join('-');
            });
            
            expect(a).toEqual('specs-kernel-module-e');
        } );
        
        it( 'define(id, factory<array>)', function(){
            var a;
            
            define('specs/kernel/module/f', ['specs','kernel','module','f']);
            
            define(['specs/kernel/module/f'], function(A){
                a = A.join('-');
            });
            
            expect(a).toEqual('specs-kernel-module-f');
        } );
        
    } );
    
    
    describe( 'require关键模块', function(){
        it( 'require', function(){
            var a;
            
            define('specs/kernel/module/g', function(){
                return 'specs-kernel-module-g';
            } );
            
            define(['require'], function(require){
                a = require('specs/kernel/module/g');
            });
            
            expect(a).toEqual('specs-kernel-module-g');
        } );
        
        it( 'require只读', function(){
            var a;
            
            define(['require'], function(require){
                require.temp = 'specs-kernel-module-h';
            });
            
            define(['require'], function(require){
                a = require.temp;
            });
            expect(a).toEqual(null);
        } );
    } );
    
    
    describe( 'exports关键模块', function(){
        it( 'exports', function(){
            var a;
            
            define('specs/kernel/module/i', ['exports'], function(exports){
                exports.specs = 'specs';
                exports.kernel = 'kernel';
                exports.module = 'module';
                exports.a = 'i';
            } );
            
            define(['require'], function(require){
                var A = require('specs/kernel/module/i');
                var temp = [];
                for ( var i in A ){
                    temp.push(A[i]);
                }
                a = temp.join('-');
            } );
            
            expect(a).toEqual('specs-kernel-module-i');
        } );
        
        it( 'exports不能被重写', function(){
            var a;
            
            define('specs/kernel/module/j', ['exports'], function(exports){
                exports = 'specs-kernel-module-j';
            } );
            
            define(['require'], function(require){
                a = require('specs/kernel/module/j');
            });
            
            expect(a).not.toBe('specs-kernel-module-j');
        } );
        
        it( 'return将覆盖exports', function(){
            var a;
            
            define('specs/kernel/module/k', ['exports'], function(exports){
                exports.temp = 'specs-kernel-module-k-temp';
                return { temp: 'specs-kernel-module-k' };
            } );
            
            define(['require'], function(require){
                var A = require('specs/kernel/module/k');
                a = A.temp;
            });
            
            expect(a).toEqual('specs-kernel-module-k');
        } );
    } );
    
    
    describe( 'module关键模块', function(){
        it( 'module.id', function(){
            var a;
            
            define('specs/kernel/module/l', ['module'], function(module){
                return module.id;
            });
            
            define(['require'], function(require){
                var A = require('specs/kernel/module/l');
                a = A.replace(/\//g,'-');
            });
            
            expect(a).toEqual('specs-kernel-module-l');
        } );
        
        it( 'module.exports', function(){
            var a;
            
            define('specs/kernel/module/m', ['module'], function(module){
                module.exports = 'specs-kernel-module-m';
            });
            
            define(['require'], function(require){
                a = require('specs/kernel/module/m');
            });
            
            expect(a).toEqual('specs-kernel-module-m');
        } );
    } );
    
    
    xdescribe( 'config关键模块', function(){
        it( 'alias', function(){
            var a;
            
            define('specs/kernel/module/n', function(){
                return 'specs-kernel-module-n';
            });
            
            define(['config'], function(config){
                config({
                    alias: {
                        'utconfiga': 'specs/kernel/module/n'
                    }
                });
            });
            
            define(['utconfiga'], function(utconfiga){
                a = utconfiga;
            });
            
            expect(a).toEqual('specs-kernel-module-n');
        } );
    } );
    
} );
