/**
 * @module lofty/kernel/config
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130310
 * */


lofty( 'config', ['global','cache','lang'], function( global, cache, lang ){
    'use strict';
    
    var configCache = cache.config = {},
        rulesCache = cache.configRules = {};
    
    
    var config = {
        realize: function( options ){
            
            for ( var key in options ){
                if ( lang.hasOwn( options, key ) ){
                    var target = configCache[key],
                        opts = options[key];
                    
                    if ( !config.applyRules( target, key, opts ) ){
                        configCache[key] = opts;
                    };
                }
            }
        },
        
        addRule: function( ruleName, rule ){
            
            rulesCache[ruleName] = {
                rule: rule,
                keys: []
            };
            
            return this;
        },
        
        addRuleKey: function( key, ruleName ){
            
            rulesCache[ruleName] && rulesCache[ruleName].keys.push( key );
            
            return this;
        },
        
        applyRules: function( target, key, opts ){
            
            var hasApply = false,
                item;

            for ( var ruleName in rulesCache ){
                if ( !hasApply ){
                    item = rulesCache[ruleName];
                    hasApply = lang.indexOf( item.keys, key ) > -1 && item.rule( target, key, opts );
                } else {
                    break;
                }
            }
            
            return hasApply;
        }
    };
    
    
    config.addRule( 'object', function( target, key, opts ){
        if ( target ){
            for ( var i in opts ){
                target[i] = opts[i];
            }
            return true;
        }
        
        return false;
    })
    .addRule( 'array', function( target, key, opts ){
        target ? target.push( opts ) : ( configCache[key] = [opts] );
        
        return true;
    } );
    
    
    this.config = config.realize;
    
    
    return config;
    
} );