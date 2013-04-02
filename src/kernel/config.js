/**
 * @module lofty/kernel/config
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130403
 * */


lofty( 'config', ['lang'], function( lang ){
    'use strict';
    
    var cache = this.cache,
        configCache = cache.config = {},
        rulesCache = cache.configRules = {};
    
    
    var realize = function( options ){
        
        for ( var key in options ){
            var target = configCache[key],
                val = options[key];
            
            if ( !applyRules( target, key, val ) ){
                configCache[key] = val;
            };
        }
    },
    
    applyRules = function( target, key, val ){
        
        var hasApply = false,
            item;

        for ( var ruleName in rulesCache ){
            if ( !hasApply ){
                item = rulesCache[ruleName];
                hasApply = lang.indexOf( item.keys, key ) > -1 && item.rule.call( configCache, target, key, val );
            } else {
                break;
            }
        }
        
        return hasApply;
    };
    
    
    var config = {
        addRule: function( ruleName, rule ){
            
            rulesCache[ruleName] = {
                rule: rule,
                keys: []
            };
            
            return this;
        },
        addItem: function( item, ruleName ){
            
            rulesCache[ruleName] && rulesCache[ruleName].keys.push( item );
            
            return this;
        }
    };
    
    
    config.addRule( 'object', function( target, key, val ){
        if ( target ){
            for ( var i in val ){
                target[i] = val[i];
            }
            return true;
        }
        
        return false;
    })
    .addRule( 'array', function( target, key, val ){
        target ? target.push( val ) : ( this[key] = [val] );
        
        return true;
    } );
    
    
    this.config = realize;
    
    
    return config;
    
} );
