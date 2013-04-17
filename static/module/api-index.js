/**
 * for api index
 * */

define(['apiData'], function( apiData ){
    
    var joinHtml = function( name ){
        
        var kind = apiData[name],
            sort = kind.sort,
            path = kind.path,
            html = '<ul>';
            
        sort.forEach(function( item ){
            html += '<li><a href="'+ path[item] +'">'+ item +'</a></li>';
        });
        
        return html + '</ul>';
    },
    
    insert = function( name ){
        
        var bearer = document.getElementById('index-'+name);
        
        bearer.innerHTML = joinHtml(name);
    };
    
    insert('kernel');
    insert('port');
});
