---
title: lofty/kernel/type.css
layout: api
---

# Intro

本模块提供一些常用的class，命名均用“fd-”为前缀

**任何人任何业务不得对此类class进行重写或者重载**

# Change Log

1. 2010.07.08，created, by Edgar
1. 2011.02.22，fdev4继承，by Edgar
1. 2013.03.29，Lofty继承，并删去`.fd-inline`、`.fd-lump`、`.fd-visible`、`.fd-hidden`，by Edgar

# Import

    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/classic.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/wide.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/op.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/flying.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/float.css);

**不允许单独引用本模块使用，只允许通过上述模块择一来使用之**

# Unit Testing

[Unit Testing](/tests/specs/kernel/type/render.html)

# Contents

{% highlight css %}
/**
 * @module lofty/kernel/type.css
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130329
 * */


/* float */
.fd-left{
    float: left;
}

.fd-right{
    float: right;
}

.fd-clear{
    clear: both;
}

.fd-clr{
    *zoom: 1;
}

.fd-clr:after{
    display: block;
    clear: both;
    height: 0;
    content: "\0020";
}


/* display */
.fd-hide{
    display: none;
}
.fd-show{
    display: block;
}


/* position */
.fd-locate{
    position: relative;
}


/**
 * CNY symbol
 * usage: <span class="fd-cny">&yen;</span>
 * */
.fd-cny{
    font-family: Helvetica, Arial;
}

/* text */
.fd-gray{
    color:#666;
}

.fd-bold{
    font-weight:700;
}
{% endhighlight %}
