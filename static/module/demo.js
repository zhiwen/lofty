
define(function(){
    
    var doc = document,
        public = doc.querySelectorAll('article > script[type="text/resource"]')[0],
        demos = doc.querySelectorAll('div.demo script');
        
    public = public ? public.innerHTML : '';
    
    var render = function( demo ){
        var parent = demo.parentNode,
            iframe = doc.createElement('iframe');
            
        iframe.src = '/blank.html';
        
        parent.removeChild(parent.lastElementChild);
        parent.appendChild(iframe);
        
        var iframeDoc = iframe.contentWindow.document;
        
        iframeDoc.open();
        iframeDoc.write( '<!DOCTYPE html>' + public + '<div id="lofy-demo" style="overflow:hidden;">' + demo.innerHTML + '</div>' );
        iframeDoc.close();
        
        var iframeHtml = iframeDoc.documentElement;
        iframeHtml.style.overflowY = 'hidden';
        
        iframe.style.height = demo.getAttribute('data-height');
        
    };
    
    for ( var i = 0, l = demos.length; i < l; i++ ){
        render( demos[i] );
    }
    
});
