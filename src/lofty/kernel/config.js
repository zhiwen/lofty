/**
 * @module lofty/kernel/config
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130310
 * */


lofty( 'config', ['global','cache','lang'], function( global, cache, lang ){
    'use strict';
    
    var configCache = cache.config = {
        debug: function(){
            var isDebug = false,
                search = global.location.search;
            
            if ( search.indexOf('lofty.debug=') > -1 ){
                isDebug = true;
            }
            
            return isDebug;
        }()
    };
    
    
    var rules = {};
    
    var config = {
        config: function( options ){
            
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
        
        addRule: function( ruleName, rule, key ){
            
            rules[ruleName] = {
                rule: rule,
                keys: []
            };
            
            key && config.addRuleKey( key, ruleName );
            
            return this;
        },
        
        addRuleKey: function( key, ruleName ){
            
            rules[ruleName] && rules[ruleName].keys.push( key );
            
            return this;
        },
        
        applyRules: function( target, key, opts ){
            
            var hasApply = false,
                item;

            for ( var ruleName in rules ){
                if ( !hasApply ){
                    item = rules[ruleName];
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
    
    
    return config;
    
} );
