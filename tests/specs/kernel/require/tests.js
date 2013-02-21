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
        domain: (function(){
            var rUrl = /([\w]+)[\:\/\/]+([\w|\.]+)\//i,
                scripts = doc.getElementsByTagName('script'),
                selfScript = scripts[scripts.length-1],
                selfUrl = selfScript.src.match( rUrl );
            
            return selfUrl[2];
        })(),
        resolve: function( id ){
            
            if ( rRoot.test(id) ){
                id = '/tests/' + id;
            }
            
            return id;
        }
    });
    
});

define('specs/kernel/define/a',function(){ return 'specs-kernel-define-a'; });
define('specs/kernel/define/b',function(){ return 'specs-kernel-define-b'; });
