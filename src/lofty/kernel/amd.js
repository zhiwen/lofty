/**
 * @module lofty/kernel/amd
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130208
 * */


lofty( ['util','fn','path','cache'], function( util, fn, path, cache ){
    'use strict';

    var configCache = cache.config;
    
    
    fn.autocompile = function( module ){
        
        var _this = this;
        if ( fn.isAnon( module ) ){
            if ( configCache.amd ){
                amd( module.deps, function(){
                    fn.compile.call( _this, module );
                } );
            } else {
                fn.compile.call( this, module );
            }
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
            if ( !fn.has( id ) ){
                idsFetch.push( id );
            }
        } );
        
        return idsFetch;
        
    };
    
    var fetch = function( idsFetch, callback ){
        
        fn.fetch( idsFetch, function(){
            util.when.apply( null, util.map( idsFetch, function( id ){
                return function( promise ){
                    var module = fn.get.call( null, path.parseAlias( id ) );
                    
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
    
} );
