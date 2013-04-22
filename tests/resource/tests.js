/**
 * @fileoverview for lofty unit testing
 * @author Edgar
 * @date 130217
 * */


define(function(){
    
    var rRoot = /^specs\//;
    
    lofty.cache.parts.event.on( 'alias', function( meta ){
        meta.id === 'lofty/kernel/console' && ( meta.id = meta.id.replace( /lofty/, 'src' ) );
    } );
    
    if ( location.pathname.indexOf('aio') > 0 || location.pathname.indexOf('tests/runner') > 0 ){
        lofty.config({
            amd: true
        });
    }
    
    if ( location.pathname.indexOf('online') > 0 ){
        lofty.config({
            baseUrl: location.protocol + '//' + location.host + '/'
        });
    }
    
    lofty.config({
        hasStamp: true,
        resolve: function( id ){
            rRoot.test( id ) && ( id = 'tests/' + id );
            return id;
        }
    });
    
});
