/**
 * for lofty.fangdeng.org
 * */

lofty.appframe('fd');

fd.config({
    resolve: function( id ){
        if ( id === 'fangdeng/lofty/apiData' ){
            id = 'static/api-data';
        }
        
        return id;
    }
});


define( 'renderDemo', function(){
    
    var doc = document,
        public = doc.querySelector('article > script[type="text/resource"]'),
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


define( 'renderApi', function(){
    
    var RenderApi = function( config ){
        this.config = config;
    };
    
    RenderApi.prototype = {
        insert: function( config ){
            for ( var key in config ){
                this.config[key] = config[key];
            }
            
            this.render();
        },
        render: function(){
            this.config.parent.innerHTML = this.joinHtml();
        },
        joinHtml: function(){
            
            var kind = this.config.data[this.config.name],
                sort = kind.sort,
                path = kind.path,
                html = '<ul>';
                
            sort.forEach(function( item ){
                html += '<li><a href="'+ path[item] +'">'+ item +'</a></li>';
            });
            
            return html + '</ul>';
        }
    };
    
    return RenderApi;
});


define( 'renderIndex', ['fangdeng/lofty/apiData','renderApi','exports'], function(  apiData, RenderApi, exports ){
    
    var renderApi = new RenderApi( { data: apiData } );
    
    exports.kind = function( name ){
        
        renderApi.insert({
            parent: document.querySelector( '#index-' + name ),
            name: name
        });
    };
} );


define( 'renderApiInIndex', ['renderIndex'], function( renderIndex ){
    
    renderIndex.kind('kernel');
    renderIndex.kind('port');
} );


define( 'renderApiInHome', ['renderIndex'], function( renderIndex ){
    
    renderIndex.kind('port');
} );


define(['require'], function( require ){
    
    var scripts = document.querySelectorAll('script'),
        targetScript = scripts[scripts.length-1],
        tasks = targetScript.getAttribute('data-tasks').split(',');
    
    tasks.forEach(function( task ){
        require.use(task);
    });
});
