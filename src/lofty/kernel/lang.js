/**
 * @module lofty/kernel/lang
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130308
 * */


lofty( 'lang', function(){
    'use strict';
    
    var EMPTY_OBJ = {},
        HAS_OWN = EMPTY_OBJ.hasOwnProperty,
        toString = EMPTY_OBJ.toString,
        AP = Array.prototype;
    
    var lang = {
        slice: [].slice,
        now: Date.now || function(){
            return new Date().getTime();
        },
        
        hasOwn: function( obj, prop ){
            return HAS_OWN.call( obj, prop );
        },
        
        isFunction: function( it ){
            return this.toString.call( it ) === '[object Function]';
        },
        
        isArray: Array.isArray || function( it ){
            return this.toString.call( it ) === '[object Array]';
        },
        
        isString: function( it ){
            return typeof it === 'string';
        },
        
        forEach: AP.forEach ?
            function( arr, fn, context ){
                arr.forEach( fn, context );
            } :
            function( arr, fn, context ){
                for ( var i = 0, l = arr.length; i < l; i++ ){
                    fn.call( context, arr[i], i, arr );
                }
            },
            
        map: AP.map ? function( arr, fn, context ){
                return arr.map( fn, context );
            } : 
            function( arr, fn, context ){
                var ret = [];
                
                lang.forEach( arr, function( item, i, arr ){
                    ret.push( fn.call( context, item, i, arr ) );
                } );
                
                return ret;
            },
        
        indexOf: AP.indexOf ? 
            function( arr, item ){
                return arr.indexOf( item );
            } :
            function( arr, item ){
                for ( var i = 0, l = arr.length; i < l; i++ ){
                    if ( arr[i] === item ){
                        return i;
                    }
                }
                
                return -1;
            }
    };
    
    
    return lang;
    
} );
