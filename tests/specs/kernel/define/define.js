/**
 * @fileoverview unit testing for lofty/kernel/define
 * @author Edgar
 * @build 130129
 * */

describe( 'lofty/kernel/define', function(){
    
    xdescribe( 'lofty关键字', function(){
        it( '存在关键字lofty', function(){
            expect(lofty).toBeTruthy();
        } );
    } );
    
    
    xdescribe( 'define关键字', function(){
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
            
            define('specs/kernel/define/a', function(){
                return 'specs-kernel-define-a';
            });
            
            define(['specs/kernel/define/a'],function(A){
                a = A;
            });
            
            expect(a).toEqual('specs-kernel-define-a');
        } );
        
        it( 'define(id, deps, factory)', function(){
            var a;
            
            define('specs/kernel/define/b', ['specs/kernel/define/a'], function(A){
                return A.replace(/a/,'b');
            });
            
            define(['specs/kernel/define/b'], function(A){
                a = A;
            });
            
            expect(a).toEqual('specs-kernel-define-b');
        } );
        
        it( 'define(deps, factory)', function(){
            var a;
            
            define(['specs/kernel/define/a','specs/kernel/define/b'], function( A, B ){
                a = A +'&'+ B;
            });
            
            expect(a).toEqual('specs-kernel-define-a&specs-kernel-define-b');
        } );
        
        it( 'define(factory)', function(){
            var a;
            
            define(function(){
                a = 'specs-kernel-define-d';
            });
            
            expect(a).toEqual('specs-kernel-define-d');
        } );
        
        it( 'define(id, factory<object>)', function(){
            var a;
            
            define('specs/kernel/define/e', {
                specs: 'specs',
                kernel: 'kernel',
                define: 'define',
                a: 'e'
            });
            
            define(['specs/kernel/define/e'], function(A){
                var temp = [];
                for ( var i in A ){
                    temp.push(A[i]);
                }
                a = temp.join('-');
            });
            
            expect(a).toEqual('specs-kernel-define-e');
        } );
        
        it( 'define(id, factory<array>)', function(){
            var a;
            
            define('specs/kernel/define/f', ['specs','kernel','define','f']);
            
            define(['specs/kernel/define/f'], function(A){
                a = A.join('-');
            });
            
            expect(a).toEqual('specs-kernel-define-f');
        } );
        
    } );
    
    
    describe( 'require关键模块', function(){
        it( 'require', function(){
            var a;
            
            define('specs/kernel/define/g', function(){
                return 'specs-kernel-define-g';
            } );
            
            define(['require'], function(require){
                a = require('specs/kernel/define/g');
            });
            
            expect(a).toEqual('specs-kernel-define-g');
        } );
        
        it( 'require只读', function(){
            var a;
            
            define(['require'], function(require){
                require.temp = 'specs-kernel-define-h';
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
            
            define('specs/kernel/define/i', ['exports'], function(exports){
                exports.specs = 'specs';
                exports.kernel = 'kernel';
                exports.define = 'define';
                exports.a = 'i';
            } );
            
            define(['require'], function(require){
                var A = require('specs/kernel/define/i');
                a = A.specs +'-'+ A.kernel +'-'+ A.define +'-'+ A.a;
            } );
            
            expect(a).toEqual('specs-kernel-define-i');
        } );
        
        it( 'exports不能被重写', function(){
            var a;
            
            define('specs/kernel/define/j', ['exports'], function(exports){
                exports = 'specs-kernel-define-j';
            } );
            
            define(['require'], function(require){
                a = require('specs/kernel/define/j');
            });
            
            expect(a).not.toBe('specs-kernel-define-j');
        } );
        
        it( 'return将覆盖exports', function(){
            var a;
            
            define('specs/kernel/define/k', ['exports'], function(exports){
                exports.temp = 'specs-kernel-define-k-temp';
                return { temp: 'specs-kernel-define-k' };
            } );
            
            define(['require'], function(require){
                var A = require('specs/kernel/define/k');
                a = A.temp;
            });
            
            expect(a).toEqual('specs-kernel-define-k');
        } );
    } );
    
    
    describe( 'module关键模块', function(){
        it( 'module.id', function(){
            var a;
            
            define('specs/kernel/define/l', ['module'], function(module){
                return module.id;
            });
            
            define(['require'], function(require){
                var A = require('specs/kernel/define/l');
                a = A.replace(/\//g,'-');
            });
            
            expect(a).toEqual('specs-kernel-define-l');
        } );
        
        it( 'module.exports', function(){
            var a;
            
            define('specs/kernel/define/m', ['module'], function(module){
                module.exports = 'specs-kernel-define-m';
            });
            
            define(['require'], function(require){
                a = require('specs/kernel/define/m');
            });
            
            expect(a).toEqual('specs-kernel-define-m');
        } );
    } );
    
    
    describe( 'config关键模块', function(){
        it( 'alias', function(){
            var a;
            
            define('specs/kernel/define/n', function(){
                return 'specs-kernel-define-n';
            });
            
            define(['config'], function(config){
                config({
                    alias: {
                        'utconfiga': 'specs/kernel/define/n'
                    }
                });
            });
            
            define(['utconfiga'], function(utconfiga){
                a = utconfiga;
            });
            
            expect(a).toEqual('specs-kernel-define-n');
        } );
    } );
    
} );
