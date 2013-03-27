/**
 * @module lofty/kernel/alias
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130322
 * */


lofty( 'alias', ['config','event'] ,function( config, event ){
    
    var configCache = this.cache.config;
    
    config.addRuleKey( 'alias', 'object' );
    
    var alias = function( meta ){
        
        var aliases = configCache.alias,
            alias;
        
        if ( aliases && ( alias = aliases[meta.id] ) ){
            meta.id = alias;
        }
        
        event.emit( 'alias', meta );
    };
    
    return alias;
    
} );
