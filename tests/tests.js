/**
 * @fileoverview for lofty unit testing
 * @author Edgar
 * @date 130217
 * */


define(function(){
    
    var rRoot = /^specs\//;
    
    lofty.config({
        hasStamp: true,
        resolve: function( id ){
            
            if ( rRoot.test(id) ){
                id = '/tests/' + id;
            }
            
            return id;
        }
    });
    
});
