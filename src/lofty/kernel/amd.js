/**
 * @module lofty/kernel/amd
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130208
 * */


lofty( 'amd', ['lang','module','deferred','asyncrequire'],
    function( lang, module, deferred, asyncrequire ){
    'use strict';

    var configCache = this.cache.config;
    
    configCache.amd = true;
    
    
    var getIdsFetch = function( ids ){
        
        var idsFetch = [];
        
        lang.forEach( ids, function( id ){
            if ( !module.has( id ) ){
                idsFetch.push( id );
            }
        } );
        
        return idsFetch;
    };
    
    var amd = {
        loader: function( ids, callback ){
        
            var scope = this,
                idsFetch = getIdsFetch( ids );
            
            if ( idsFetch.length ){
                amd.fetch( idsFetch, callback );
            } else {
                callback();
            }
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
