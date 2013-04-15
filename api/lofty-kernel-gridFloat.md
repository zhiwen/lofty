---
title: lofty/kernel/gridFloat
layout: api
---

# Intro

本模块提供一种栅格系统，利用容器左浮实现，页面总宽960px，实际承载内容的宽度为952px，每格宽度32px，间距8px

# Change Log

1. 2009.10.14，created，by yaosl
1. 2010.07.30，fdev3继承并修改，by Edgar
1. 2011.02.22，fdev4继承并修改，by Edgar
1. 2013.03.29，Lofty继承并修改，by Edgar

# Require

`lofty/kernel/reset.css`、`lofty/kernel/layout.css`

# Import

    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/float.css);

**不允许单独引用本模块使用，只允许通过`lofty/port/float.css`来使用之，且`lofty/port/float.css`已含需require的模块**

# Unit Testing

[Unit Testing](/tests/specs/kernel/grid-float/render.html)

# API

|class|.grid-1|.grid-2|.grid-3|.grid-4|.grid-5|.grid-6|.grid-7|.grid-8|.grid-9|.grid-10|.grid-11|.grid-12|
|width(px)|32|72|112|152|192|232|272|312|352|392|432|472|
|class|.grid-13|.grid-14|.grid-15|.grid-16|.grid-17|.grid-18|.grid-19|.grid-20|.grid-21|.grid-22|.grid-23|.grid-24|
|width(px)|512|552|592|632|672|712|752|792|832|872|912|952|

# Example

<script type="text/resource">
    <link href="/src/port/float.css" rel="stylesheet"/>
    <style>
    .layout div{ text-align: center; }
    .grid-6{ background: pink; }
    .grid-12,
    .grid-18{ background: gold; }
    </style>
</script>

## 两栏

{% highlight html %}
<div class="layout">
    <div class="grid-6">232px(.grid-6)</div>
    <div class="grid-18 grid-fixed">712px(.grid-18)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="w942">
            <div class="layout">
                <div class="grid-6">232px(.grid-6)</div>
                <div class="grid-18 grid-fixed">712px(.grid-18)</div>
            </div>
        </div>
    </script>
</div>

## 三栏

{% highlight html %}
<div class="layout">
    <div class="grid-6">232px(.grid-6)</div>
    <div class="grid-12">472px(.grid-12)</div>
    <div class="grid-6 grid-fixed">232px(.grid-6)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="screen">
            <div class="layout">
                <div class="grid-6">232px(.grid-6)</div>
                <div class="grid-12">472px(.grid-12)</div>
                <div class="grid-6 grid-fixed">232px(.grid-6)</div>
            </div>
        </div>
    </script>
</div>

## 四栏

{% highlight html %}
<div class="layout">
    <div class="grid-6">232px(.grid-6)</div>
    <div class="grid-6">232px(.grid-6)</div>
    <div class="grid-6">232px(.grid-6)</div>
    <div class="grid-6 grid-fixed">232px(.grid-6)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="screen">
            <div class="layout">
                <div class="grid-6">232px(.grid-6)</div>
                <div class="grid-6">232px(.grid-6)</div>
                <div class="grid-6">232px(.grid-6)</div>
                <div class="grid-6 grid-fixed">232px(.grid-6)</div>
            </div>
        </div>
    </script>
</div>
