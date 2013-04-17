/**
 * for lofty.fangdeng.org/api/index
 * @author Edgar
 * @date 130415
 * */
 
/*merge start*/
(function(){
    ImportJavscript = {
        url:function(url){
            document.write('<script type="text/javascript" src="'+url+'"></scr'+'ipt>');
        }
    };
})();
/*merge end*/

ImportJavscript.url('/src/port/classic.js');
ImportJavscript.url('/static/module/api-data.js');
ImportJavscript.url('/static/module/api-index.js');
