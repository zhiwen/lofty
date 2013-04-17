---
layout: nil
---

define( 'apiData', function(){
    var kernelPath = {},
        kernelSort = [],
        portPath = {},
        portSort = [];
    
    {% for post in site.pages %}
        {% if post.url contains "api/kernel" %}
    kernelSort.push( "{{ post.title }}" );
    kernelPath["{{ post.title }}"] = "{{ post.url }}";
        {% elsif post.url contains "api/port" %}
    portSort.push( "{{ post.title }}" );
    portPath["{{ post.title }}"] = "{{ post.url }}";
        {% endif %}
    {% endfor %}
    
    return {
        kernel: {
            sort: kernelSort.sort(),
            path: kernelPath
        },
        port: {
            sort: portSort.sort(),
            path: portPath
        }
    };
} );
