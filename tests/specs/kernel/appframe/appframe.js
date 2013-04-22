/**
 * @fileoverview unit testing for lofty/kernel/appframe
 * @author Edgar
 * @build 130422
 * */

describe( 'lofty/kernel/appframe', function(){
    
    describe( '生成应用框架', function(){
        it( 'lofty.appframe', function(){
            lofty.appframe('alpha');
            
            expect(alpha.define).toEqual(lofty.define);
            expect(alpha.log).toEqual(lofty.log);
            expect(alpha.config).toEqual(lofty.config);
            expect(alpha.on).toEqual(lofty.cache.parts.event.on);
            expect(alpha.off).toEqual(lofty.cache.parts.event.off);
        } );
    } );
} );
