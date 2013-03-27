/** @preserve Lofty v@VERSION @EDITION http://lofty.fangdeng.org/ MIT */
/**
 * @module lofty/kernel/boot
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130307
 * */


(function( global ){
    'use strict';
    
    if ( global.lofty ){
        return;
    }
    
    var cache = {};
    
    var lofty = function( id, deps, factory ){
        
        if ( cache[id] ){
            return;
        }
        
        if ( !factory ){
            factory = deps;
            deps = [];
        }
        
        var module = cache[id] = {
            id: id,
            deps: deps,
            factory: factory
        };
        
        compile( module );
    },
    
    compile = function( module ){
        
        if ( typeof module.factory === 'function' ){
            var deps = getDeps( module );
            
            module.exports = module.factory.apply( lofty, deps );
        } else {
            module.exports = module.factory;
        }
        
        delete module.factory;
    },
    
    getDeps = function( module ){
        
        var list = [],
            deps = module.deps;
        
        for ( var i = 0, l = deps.length; i < l; i++ ){
            list.push( require( deps[i] ) );
        }
        
        return list;
    },
    
    require = function( id ){
        
        var module = cache[id];
        
        return module ? module.exports : null;
    };
    
    lofty.version = '0.1';
    
    lofty.cache = {
        kernel: cache
    };
    
    
    lofty( 'global', global );
    lofty( 'require', function(){
        return require;
    } );
    
    global.lofty = lofty;
    
})( this );
