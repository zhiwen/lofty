/**
 * @module lofty/kernel/deferred
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130308
 * */


lofty( 'deferred', ['lang'], function( lang ){
    'use strict';
    
    /**
     * Thanks to:
     * cujo.js, https://github.com/cujojs/curl/blob/master/src/curl.js
     * jQuery, https://github.com/jquery/jquery/blob/1.7.2/src/deferred.js
     * */
     
    var noop = function(){};
    
    var Promise = function( len ){
        
        var _this = this,
            thens = [],
            len = len || 1,
            resolved = 0,
            rejected = 0;
        
        var probe = function(){
            if ( resolved + rejected === len ){
                complete();
            }
        },
        
        complete = function(){
            _this.then = !rejected ?
                function( resolved, rejected ){ resolved && resolved() } :
                function( resolved, rejected ){ rejected && rejected() };
                
            complete = noop;
            
            notify( !rejected ? 0 : 1 );
            
            notify = noop;
            thens = [];
        },
        
        notify = function( which ){
            var then, callback, i = 0;
            
            while ( ( then = thens[i++] ) ){
                callback = then[which];
                callback && callback();
            }
        };
        
        this.then = function( resolved, rejected ){
            thens.push( [resolved, rejected] );
        };
        
        this.resolve = function(){
            resolved++;
            probe();
        };
        
        this.reject = function(){
            rejected++;
            probe();
        };
        
    };
    
    var when = function(){
        
        var args = lang.slice.call( arguments, 0 ),
            l = args.length,
            promise = new Promise(l);
        
        lang.forEach( args, function( arg ){
            arg( promise );
        } );
        
        return promise;
        
    };
    
    
    return when;
    
} );
