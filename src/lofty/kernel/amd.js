/**
 * @module lofty/kernel/amd
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130325
 * */


lofty( 'amd', ['module','use'],
    function( module, use ){
    'use strict';

    var configCache = this.cache.config;
    
    configCache.amd = true;
    
    module.autocompile = function( mod ){
        
        if ( module.isAnon( mod ) ){
            if ( configCache.amd ){
                use.load( mod.deps, function(){
                    module.compile( mod );
                } );
            } else {
                module.compile( mod );
            }
        }
    };
    
} );
