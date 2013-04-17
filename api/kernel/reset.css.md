---
title: lofty/kernel/reset.css
layout: api
---

# Intro

本模块用来重置一些浏览器的默认样式，使得后续代码能够在较一致的环境下书写，即解决一部分兼容问题

Thanks to: YUI yuilibrary.com

# Change Log

1. 2008.12.26，created, by yaosl
1. 2009.10.14，fdev2继承并修改，by yaosl
1. 2010.05.10，fdev3继承并修改，by yaosl
1. 2011.02.22，fdev4继承，by Edgar
1. 2013.03.28，Lofty继承并修改，by Edgar

# Import

    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/classic.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/wide.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/op.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/flying.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/float.css);

**不允许单独引用本模块使用，只允许通过上述模块择一来使用之**

# Unit Testing

[Unit Testing](/tests/specs/kernel/reset/render.html)

# Contents

{% highlight css %}
/**
 * @module lofty/kernel/reset.css
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130328
 * */


/**
 * Thanks to:
 * yaosl, happyyaosl@gmail.com
 * YUI, http://yuilibrary.com/
 * */

/**** 设置页面默认的白底黑字以及默认纵向滚动条位置 ****/
html{
	color: #000;
	overflow-y: scroll;
	background: #fff;
}

body, h1, h2, h3, h4, h5, h6, hr, p, blockquote,  /* structural elements 结构元素 */
dl, dt, dd, ul, ol, li, /* list elements 列表元素 */
pre, /* text formatting elements 文本格式元素 */
fieldset, lengend, button, input, textarea, form, /* form elements 表单元素 */
th, td{ /* table elements 表格元素 */
    margin: 0;
    padding: 0;
}


/* fonts */
/**** 设置默认字体及大小 ****/
body, button, input, select, textarea{
    font: 12px/1.5 Tahoma, Arial, "\5b8b\4f53", sans-serif; /* 中文用 ascii 字符表示，使得在任何编码下都无问题 */
}

h1, h2,	h3,	h4, h5, h6{ 
	font-size: 100%; 
	font-weight: normal; 
}

address, cite, dfn, em, var{
    font-style: normal; /* 将斜体扶正 */
}

code, kbd, pre, samp, tt{
    font-family: "Courier New", Courier, monospace; /* 统一等宽字体 */
}

small{
    font-size: 12px; /* 小于 12px 的中文很难阅读，让 small 正常化 */
}


/* style */
/**** 重置列表元素 ****/
ul, ol{
    list-style: none;

}
/**** 重置文本格式元素 ****/
a {
    text-decoration: none;
}

a:hover{
	text-decoration: underline;
}

abbr[title], acronym[title]{ /* 注：1.ie6 不支持 abbr; 2.这里用了属性选择符，ie6 下无效果 */
	border-bottom: 1px dotted;
	cursor: help;
}

q:before, q:after{
    content: '';
}

:focus{
    outline: 0; /* firefox下面链接在被点击状态不出现超长的边框线*/
}


/* form */
legend{
    color: #000; /* for ie6 */
}

fieldset, img{
    border: none; /* img 搭车：让链接里的 img 无边框 */
}

/* 注：optgroup 无法扶正 */
button, input, select, textarea{
    font-size: 100%; /* 使得表单元素在 ie 下能继承字体大小 */
}


table{
	border-collapse: collapse;
	border-spacing: 0;
}

/**** 统一hr为1像素的横线 ****/
hr{
    border: none;
    height: 1px;
    *color: #fff;
}


img{
    -ms-interpolation-mode: bicubic; /*解决ie7下图片缩放的失真问题*/
}
{% endhighlight %}

# Future

以下是期望做的，但没做

1. 去掉`:foucs`，以支持键盘操作
1. 去掉对`address`、`cite`、`dfn`、`var`的斜体扶正
1. 去掉对`kbd`、`tt`的等宽字体
1. 去掉对`abbr[title]`、`acronym[title]`的设定
