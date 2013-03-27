/**
 * @module lofty/kernel/use
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130325
 * */


lofty( 'use', ['lang','event','module','request','deferred'],
    function( lang, event, module, request, deferred ){
    'use strict';
    
    var getIdsFetch = function( ids ){
        
        var idsFetch = [];
        
        lang.forEach( ids, function( id ){
            if ( !module.has( id ) ){
                idsFetch.push( id );
            }
        } );
        
        return idsFetch;
    };
    
    var use = {
        realize: function( ids, callback, errorback ){
            
            lang.isArray( ids ) || ( ids = [ids] );
            
            use.load( ids, function(){
                var args = lang.map( ids, function( id ){
                    return module.require( id );
                } );
                
                callback && callback.apply( null, args );
            } /* call errorback */ );
        },
        
        load: function( ids, callback ){
            
            var idsFetch = getIdsFetch( ids );
            
            if ( idsFetch.length ){
                use.fetch( idsFetch, callback );
            } else {
                callback();
            }
        },
        
        fetch: function( idsFetch, callback ){
            
            use.get( idsFetch, function(){
                deferred.apply( null, lang.map( idsFetch, function( id ){
                    return function( promise ){
                        var mod = module.get( id );
                        
                        mod ? use.load( mod.deps, function(){
                            promise.resolve();
                        } ) : promise.resolve();
                    }
                } ) ).then( callback );
            } );
        },
        
        get: function( idsFetch, callback, errorback ){
            
            deferred.apply( null, lang.map( idsFetch, function( id ){
                return function( promise ) {
                    /* leave a question: need to delete this if? */
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
            use.realize( ids, callback, errorback );
        };
    } );
    
    
    return use;
    
} );
