/**
 * @fileoverview for lofty unit testing
 * @author Edgar
 * @date 130217
 * */


define(function(){
    
    var rRoot = /^specs\//;
    
    lofty.cache.kernel.event.on( 'alias', function( meta ){
        meta.id === 'lofty/kernel/console' && ( meta.id = meta.id.replace( /lofty/, 'src' ) );
    } );
    
    lofty.config({
        hasStamp: true,
        resolve: function( id ){
            rRoot.test( id ) && ( id = 'tests/' + id );
            return id;
        }
    });
    
});
