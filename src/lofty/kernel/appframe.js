/**
 * @module lofty/kernel/appframe
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130315
 * */


lofty( 'appframe', ['module','cache','global','event','config'],
    function( module, cache, global, event, config ){
    'use strict';
    
    var configCache = cache.config,
        appframeCache = cache.appframe = {};
    
    
    var appframe = {
        isExcept: function( id ){
            
            var isExcept = false,
                rAppframeExcept = configCache.rAppframeExcept;
            
            if ( !!rAppframeExcept ){
                for ( var i = 0, l = rAppframeExcept.length; i < l; i++ ){
                    if ( rAppframeExcept[i].test( id ) ){
                        isExcept = true;
                        break;
                    }
                };
            }
            
            return isExcept;
        },
        
        getRealId: function( id, scope ){
            
            var isExcept = appframe.isExcept( id );
            
            return isExcept ? id : ( scope.appframe + ':' + id );
        },
        
        create: function( name ){
            
            if ( appframeCache[name] ){
                configCache.appframe = name;
            } else {
                global[name] = {
                    log: this.log,
                    define: this.define,
                    appframe: name
                };
                
                configCache.appframe = name;
                appframeCache[name] = true;
            }
        }
    };
    
    
    config.addRuleKey( 'rAppframeExcept', 'array' );
    
    event.on( 'define', function( mod, scope ){
        
        if ( configCache.appframe ){
            mod.appframe = scope && appframeCache[scope.appframe] ? scope.appframe : configCache.appframe;
            
            if ( !module.isAnon( mod ) ){
                mod._id = appframe.getRealId( mod.id, mod );
            }
        }
    } );
    
    event.on( 'get', function( meta, scope ){
        
        if ( scope && scope.appframe ){
            meta.id = appframe.getRealId( meta.id, scope );
        }
    } );
    
    this.appframe = appframe.create;
    
    
    return appframe;
    
} );
