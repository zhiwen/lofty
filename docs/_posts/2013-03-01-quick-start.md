---
title: Lofty Quick Start
layout: default
---

## Table of Contents

* [引入Lofty](#import-lofty)
* [模块书写](#module-write)
* [调试](#debug)
* [示例](#example)

# 引入Lofty {#import-lofty}

直接在页面中用script引用：

    <script src="http://style.china.alibaba.com/fdevlib/js/lofty/port/classic.js"></script>
    
或者，加入到merge文件中：

    ImportJavscript.url('http://style.china.alibaba.com/fdevlib/js/lofty/port/classic.js');

# 模块书写 {#module-write}

假如存在`output`、`hello`、`world`三个模块如下：

{% highlight js %}
define( 'output', ['exports'], function( exports ){
    
    exports.page = function( message ){
        document.write( message );
    };
} );

define( 'hello', function(){
    
    return 'hello';
} );

define( 'world', ['module'], function( module ){
    
    module.exports = 'world';
});
{% endhighlight %}

现在想要在页面上输出`hello world`，可以这么做：

{% highlight js %}
define(['require','output','world'], function( require, output, world ){
    
    var hello = require('hello');
    
    output.page( hello + ' ' + world );
} );
{% endhighlight %}

# 调试 {#debug}

若要打印调试信息出来，可以使用`lofty.log`函数，将上一个匿名模块改写之：

{% highlight js %}
define(['require','output','world'], function( require, output, world ){
    
    var hello = require('hello');
    
    lofty.log(hello);
    lofty.log(world);
    
    output.page( hello + ' ' + world );
} );
{% endhighlight %}

`lofty.log`只有在debug状态才会输出内容

触发debug状态有两种方式：

一： 在页面url加上`lofty.debug=true`访问即可

二： 在代码中加入：

    lofty.config({
        debug: true
    });
    
# 示例 {#example}

[hello world debug](/examples/hello-world/runner.html?lofty.debug=true)
