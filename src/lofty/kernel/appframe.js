/**
 * @module lofty/kernel/appframe
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130221
 * */


lofty( 'appframe', ['module','cache','global','event','config'],
    function( module, cache, global, event, config ){
    'use strict';
    
    var configCache = cache.config;
    
    config.addRuleKey( 'rAppframeExcept', 'array' );
    
    
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
        }
    };
    
    
    event.on( 'initialized', function( mod ){
        
        if ( configCache.appframe ){
            mod.appframe = configCache.appframe;
            
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
    
    
    this.appframe = function( name ){
        
        var app = global[name];
        
        if ( app ){
            app.define === this.define && ( configCache.appframe = name );
        } else {
            global[name] = {
                log: this.log,
                define: this.define
            };
            
            configCache.appframe = name;
        }
    };
    
    
    return appframe;
    
} );
