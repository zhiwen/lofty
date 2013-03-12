/**
 * @fileoverview for lofty unit testing
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130217
 * */


define(['config'], function(config){
    
    var doc = window.document,
        rRoot = /^specs\//;
        
    
    config({
        hasStamp: true,
        resolve: function( id ){
            
            if ( rRoot.test(id) ){
                id = '/tests/' + id;
            }
            
            return id;
        }
    });
    
});

define('specs/kernel/module/a',function(){ return 'specs-kernel-module-a'; });
define('specs/kernel/module/b',function(){ return 'specs-kernel-module-b'; });
