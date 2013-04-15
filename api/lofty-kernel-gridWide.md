---
title: lofty/kernel/gridWide
layout: api
---

# Intro

本模块提供一种栅格系统，利用容器左浮实现，页面总宽1000px，实际承载内容的宽度为990px，每格宽度30px，间距10px

# Change Log

1. 2012.07.09，created，by Edgar
1. 2013.03.29，Lofty继承并修改，by Edgar

# Require

`lofty/kernel/reset.css`、`lofty/kernel/layout.css`

# Import

    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/wide.css);

**不允许单独引用本模块使用，只允许通过`lofty/port/wide.css`来使用之，且`lofty/port/wide.css`已含需require的模块**

# Unit Testing

[Unit Testing](/tests/specs/kernel/grid-wide/render.html)

# API

|class|.grid-1|.grid-2|.grid-3|.grid-4|.grid-5|
|width(px)|30|70|110|150|190|
|class|.grid-6|.grid-7|.grid-8|.grid-9|.grid-10|
|width(px)|230|270|310|350|390|
|class|.grid-11|.grid-12|.grid-13|.grid-14|.grid-15|
|width(px)|430|470|510|550|590|
|class|.grid-16|.grid-17|.grid-18|.grid-19|.grid-20|
|width(px)|630|670|710|750|790|
|class|.grid-21|.grid-22|.grid-23|.grid-24|.grid-25|
|width(px)|830|870|910|950|990|

# Example

<script type="text/resource">
    <link href="/src/port/wide.css" rel="stylesheet"/>
    <style>
    .layout div{ text-align: center; }
    .grid-6{ background: pink; }
    .grid-13,
    .grid-19{ background: gold; }
    </style>
</script>

## 两栏

{% highlight html %}
<div class="layout">
    <div class="grid-6">230px(.grid-6)</div>
    <div class="grid-19 grid-fixed">750px(.grid-19)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="screen">
            <div class="layout">
                <div class="grid-6">230px(.grid-6)</div>
                <div class="grid-19 grid-fixed">750px(.grid-19)</div>
            </div>
        </div>
    </script>
</div>

## 三栏

{% highlight html %}
<div class="layout">
    <div class="grid-6">230px(.grid-6)</div>
    <div class="grid-13">510px(.grid-13)</div>
    <div class="grid-6 grid-fixed">230px(.grid-6)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="screen">
            <div class="layout">
                <div class="grid-6">230px(.grid-6)</div>
                <div class="grid-13">510px(.grid-13)</div>
                <div class="grid-6 grid-fixed">230px(.grid-6)</div>
            </div>
        </div>
    </script>
</div>
