/**
 * @module lofty/kernel/asyncrequire
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130204
 * */


lofty( 'asyncrequire', ['lang','event','module','request','deferred'],
    function( lang, event, module, request, deferred ){
    'use strict';
    
    var asyncrequire = {};
    
    asyncrequire.fetch = function( ids, callback, errorback ){
        var scope = this;
        
        deferred.apply( null, lang.map( ids, function( id ){
            return function( promise ) {
                if ( module.has( id, scope ) ){
                    promise.resolve();
                } else {
                    request( id, function(){
                        promise.resolve();
                    }, function(){
                        promise.reject();
                    } );
                }
            }
        } ) ).then( callback, errorback );
    };
        
    asyncrequire.loader = asyncrequire.fetch;
        
    asyncrequire.realize = function( ids, callback, errorback, scope ){
        if ( !lang.isArray(ids) ){
            ids = [ids];
        }
        
        asyncrequire.loader.call( scope, ids, function(){
            var args = lang.map( ids, function( id ){
                return module.require( id, scope );
            } );
            
            callback && callback.apply( null, args );
        } /* call errorback */ );
        
    };
    
    
    event.on( 'makeRequire', function( require, scope ){
        
        require.async = function( ids, callback, errorback ){
            asyncrequire.realize( ids, callback, errorback, scope );
        };
        
    } );
    
    
    return asyncrequire;
    
} );
