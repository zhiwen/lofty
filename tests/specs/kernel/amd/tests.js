/**
 * @fileoverview for lofty unit testing
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130422
 * */


lofty.config({
    hasStamp: true,
    resolve: function( id ){
        
        if ( /^specs\//.test(id) ){
            id = '/tests/' + id;
        }
        
        return id;
    }
});

define('specs/kernel/module/a',function(){ return 'specs-kernel-module-a'; });
