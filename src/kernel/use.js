/**
 * @module lofty/kernel/use
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130419
 * */


lofty( 'use', ['lang','event','module','request','deferred'],
    function( lang, event, module, request, deferred ){
    'use strict';

    var use = {
        load: function( ids, callback, errorback ){
            
            lang.isArray( ids ) || ( ids = [ids] );
            
            use.fetch( ids, function(){
                var args = lang.map( ids, function( id ){
                    return module.require( id );
                } );
                
                callback && callback.apply( null, args );
            } /* call errorback */ );
        },
        
        fetch: function( idsFetch, callback ){
            
            use.get( idsFetch, function(){
                deferred.apply( null, lang.map( idsFetch, function( id ){
                    return function( promise ){
                        var mod = module.get( id );
                        
                        mod ? use.fetch( mod.deps, function(){
                            promise.resolve();
                        } ) : promise.resolve();
                    }
                } ) ).then( callback );
            } );
        },
        
        get: function( idsFetch, callback, errorback ){
            
            deferred.apply( null, lang.map( idsFetch, function( id ){
                return function( promise ) {
                    
                    if ( module.has( id ) ){
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
        }
    };
    
    
    event.on( 'makeRequire', function( require ){
        
        require.use = function( ids, callback, errorback ){
            use.load( ids, callback, errorback );
        };
    } );
    
    
    return use;
    
} );
