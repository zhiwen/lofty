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
                idsFetch = amd.getIdsFetch( ids, scope );
            
            if ( idsFetch.length ){
                amd.fetch.call( scope, idsFetch, callback );
            } else {
                callback();
            }
        },
        
        getIdsFetch: function( ids, scope ){
        
            var idsFetch = [];
            
            lang.forEach( ids, function( id ){
                if ( !module.has( id, scope ) ){
                    idsFetch.push( id );
                }
            } );
            
            return idsFetch;
        },
        
        fetch: function( idsFetch, callback ){
            var scope = this;
            
            asyncrequire.fetch.call( scope, idsFetch, function(){
                deferred.apply( null, lang.map( idsFetch, function( id ){
                    return function( promise ){
                        var mod = module.get( id, scope );
                        
                        amd.loader.call( mod, mod.deps, function(){
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
                amd.loader.call( mod, mod.deps, function(){
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
