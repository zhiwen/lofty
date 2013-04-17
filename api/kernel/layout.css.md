---
title: lofty/kernel/layout.css
layout: api
---

# Intro

本模块提供页面基本结构所需

# Change Log

1. 2013.03.28，Lofty继承自各grid，by Edgar

# Import

    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/classic.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/wide.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/op.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/flying.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/float.css);

**不允许单独引用本模块使用，只允许通过上述模块择一来使用之**

# Unit Testing

[Unit Testing](/tests/specs/kernel/layout/render.html)

# Contents

{% highlight css %}
/**
 * @module lofty/kernel/layout.css
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130328
 * */


.screen{
	width: 990px;
	margin: 0 auto;
	padding: 0 5px;
}


#header,
#content,
#footer,
.layout{
	*zoom: 1;
}

#header:after,
#content:after,
#footer:after,
.layout:after{
	display: block;
	clear: both;
	height: 0;
	content: "\0020";
}


.layout .grid{
    float: left;
}

.layout .grid-fixed{
    margin-right:0 !important;
}
{% endhighlight %}
