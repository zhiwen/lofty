/**
 * @fileoverview unit testing for lofty/kernel/config
 * @author Edgar
 * @build 130322
 * */

describe( 'lofty/kernel/config', function(){
    
    var config = lofty.cache.parts.config,
        configCache = lofty.cache.config,
        configRules = lofty.cache.configRules;
    
    it( 'config.addRule', function(){
        var ruleA = function( target, key, val ){
            this['debug1'] = val === 'debug' ? true : false;
            this[key] = val;
            return true;
        };
        
        config.addRule( 'ruleA', ruleA );
        
        expect(configRules.ruleA.rule.toString()).toEqual(ruleA.toString());
    } );
    
    it( 'config.addItem', function(){
        config.addItem( 'logLevel1', 'ruleA' );
        var a = configRules.ruleA.keys.slice();
        config.addItem( 'log1', 'ruleA' );
        var b = configRules.ruleA.keys.slice();
        
        var c = configCache.debug1;
        lofty.config({
            'logLevel1': 'log'
        });
        var d = configCache.debug1;
        var e = configCache.logLevel1;
        var f = configCache.log1;
        lofty.config({
            'log1': 'debug'
        });
        var g = configCache.debug1;
        var h = configCache.log1;
        var i = configCache.logLevel1;
        
        expect(a).toEqual(['logLevel1']);
        expect(b).toEqual(['logLevel1','log1']);
        expect(c).toEqual(undefined);
        expect(d).toEqual(false);
        expect(e).toEqual('log');
        expect(f).toEqual(undefined);
        expect(g).toEqual(true);
        expect(h).toEqual('debug');
        expect(i).toEqual('log');
    } );
    
    it( 'config rule "object"', function(){
        config.addItem( 'alias1', 'object' );
        lofty.config({
            alias1: {
                'aa': '123456aa',
                'bb': '123445bb'
            }
        });
        
        config.addItem( 'alias2', 'object' );
        lofty.config({
            alias2: {
                'aa': 'dfghjk',
                'bb': '5yujkth'
            }
        });
        
        expect(configCache.alias1.aa).toEqual('123456aa');
        expect(configCache.alias1.bb).toEqual('123445bb');
        expect(configCache.alias2.aa).toEqual('dfghjk');
        expect(configCache.alias2.bb).toEqual('5yujkth');
    } );
    
    it( 'config rule "array"', function(){
        config.addItem( 'resolve1', 'array' );
        var a = configCache.resolve1;
        lofty.config({
            resolve1: '1thj6y'
        });
        var b = configCache.resolve1.slice();
        lofty.config({
            resolve1: '5tyhgyu'
        });
        var c = configCache.resolve1.slice();
        
        expect(a).toEqual(undefined);
        expect(b).toEqual(['1thj6y']);
        expect(c).toEqual(['1thj6y','5tyhgyu']);
    } );
} );
