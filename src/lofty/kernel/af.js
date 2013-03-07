/**
 * @module lofty/kernel/af
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130221
 * */


lofty( ['fn','event','cache','modules','global'], function( fn, event, cache, modules, global ){
    'use strict';
    
    
    var modulesCache = cache.modules,
        configCache = cache.config;
    
    //var afs = {};
    
    
    
    fn.af = function( name ){
        
        if ( global[name] ){
            return;
        }
        
        global[name] = {
            log: lofty.log,
            define: fn.define
        };
        
        configCache.af = name;
        
    };
    
    event.on( 'initialized', function( module ){
        
        if ( configCache.af ){
            module.af = configCache.af;
            
            if ( !fn.isAnon( module ) ){
                var rNonAf = configCache.rNonAf;
                
                module._id = !!rNonAf && rNonAf.test( module.id ) ? module.id : ( configCache.af + ':' + module.id );
            }
        }
        
    } );
    
    fn.get = function( id, host ){
        
        if ( host.af ){
            var rNonAf = configCache.rNonAf;
            
            if ( !!rNonAf && !rNonAf.test( id ) ){
                id = host.af + ':' + id;
            }
        }
        
        return modules.get.call( this ? this : null, id );
    };

    
} );
