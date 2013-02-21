/**
 * @module lofty/kernel/amd
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130208
 * */


(function( sdk ){
    'use strict';
    
    if ( sdk.fn.amd ){
        return;
    }
    
    
    var fn = sdk.fn,
        util = sdk.util,
        cache = sdk.cache,
        modulesCache = cache.modules,
        configCache = cache.config;
    
    
    fn.autocompile = function( module ){
        
        if ( configCache.amd ){
            amd( module.deps, function(){
                fn.compile.call( null, module );
            } );
        } else {
            fn.compile.call( null, module );
        }
        
    };
    
    
    var amd = function( ids, callback ){
        
        var idsFetch = getIdsFetch( ids );
        
        if ( idsFetch.length ){
            fetch( idsFetch, callback );
        } else {
            callback();
        }
        
    };
    
    var getIdsFetch = function( ids ){
        
        var idsFetch = [];
        
        util.forEach( ids, function( id, idx ){
            if ( !fn.isExisting( id ) ){
                idsFetch.push( id );
            }
        } );
        
        return idsFetch;
        
    };
    
    var fetch = function( idsFetch, callback ){
        
        fn.fetch( idsFetch, function(){
            util.when.apply( null, util.map( idsFetch, function( id ){
                return function( promise ){
                    var module = modulesCache[fn.parseAlias( id )];
                    
                    amd( module.deps, function(){
                        promise.resolve();
                    } );
                }
            } ) ).then( callback );
        } );
        
    };
    
    
    fn.asyncRequireLoader = amd;
    
    
    fn.amd = true;
    configCache.amd = true;
    
})( lofty.sdk );
