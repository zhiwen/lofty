/**
 * @fileoverview for lofty unit testing
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130325
 * */

lofty.config({
    resolve: function( id ){
        id === 'lofty/kernel/console' && ( id = id.replace( /lofty/, 'src' ) );
        return id;
    }
});
