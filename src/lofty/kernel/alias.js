/**
 * @module lofty/kernel/alias
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130208
 * */


lofty( 'alias', ['cache','config','event'] ,function( cache, config, event ){
    
    var configCache = cache.config;
    
    config.addRuleKey( 'alias', 'object' );
    
    event.on( 'alias', function( meta ){
        
        var aliases = configCache.alias,
            alias;
        
        if ( aliases && ( alias = aliases[meta.id] ) ){
            meta.id = alias;
        }
    } );
    
} );
