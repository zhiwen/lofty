/**
 * @fileoverview for lofty unit testing
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130217
 * */


define(['config'], function(config){
    
    var rRoot = /^specs\//;
    
    config({
        resolve: function( id ){
            
            if ( rRoot.test(id) ){
                id = '/tests/' + id;
            }
            
            return id;
        }
    });
    
    
});
