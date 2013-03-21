/**
 * @module lofty/kernel/amd
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130208
 * */


lofty( 'amd', ['cache','module','lang','deferred','asyncrequire'],
    function( cache, module, lang, deferred, asyncrequire ){
    'use strict';

    var configCache = cache.config;
    
    configCache.amd = true;
    
    
    var amd = {
        loader: function( ids, callback ){
        
            var scope = this,
                idsFetch = amd.getIdsFetch( ids );
            
            if ( idsFetch.length ){
                amd.fetch( idsFetch, callback );
            } else {
                callback();
            }
        },
        
        getIdsFetch: function( ids ){
        
            var idsFetch = [];
            
            lang.forEach( ids, function( id ){
                if ( !module.has( id ) ){
                    idsFetch.push( id );
                }
            } );
            
            return idsFetch;
        },
        
        fetch: function( idsFetch, callback ){
            
            asyncrequire.fetch( idsFetch, function(){
                deferred.apply( null, lang.map( idsFetch, function( id ){
                    return function( promise ){
                        var mod = module.get( id );
                        
                        amd.loader( mod.deps, function(){
                            promise.resolve();
                        } );
                    }
                } ) ).then( callback );
            } );
        }
    };
    
    
    module.autocompile = function( mod ){
        
        if ( module.isAnon( mod ) ){
            if ( configCache.amd ){
                amd.loader( mod.deps, function(){
                    module.compile( mod );
                } );
            } else {
                module.compile( mod );
            }
        }
    };
    
    asyncrequire.loader = amd.loader;
    
    
    return amd;
    
} );
