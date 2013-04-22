/**
 * @module lofty/kernel/amd
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130422
 * */


lofty( 'amd', ['module','use'],
    function( module, use ){
    'use strict';

    var configCache = this.cache.config;
    
    configCache.amd = true;
    
    module.autocompile = function( mod ){
        
        if ( module.isAnon( mod ) ){
            if ( configCache.amd ){
                use.fetch( mod.deps, function(){
                    module.compile( mod );
                } );
            } else {
                module.compile( mod );
            }
        }
    };
    
} );
