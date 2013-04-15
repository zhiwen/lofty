---
title: lofty/kernel/gridOp
layout: api
---

# Intro

本模块提供一种栅格系统，供行业使用，页面总宽1000px，实际承载内容的宽度为990px，每格间距10px

# Change Log

1. 2012.06.26，created，by Edgar
1. 2013.03.29，Lofty继承并修改，by Edgar

# Require

`lofty/kernel/reset.css`、`lofty/kernel/layout.css`

# Import

    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/op.css);

**不允许单独引用本模块使用，只允许通过`lofty/port/op.css`来使用之，且`lofty/port/op.css`已含需require的模块**

# Unit Testing

[Unit Testing](/tests/specs/kernel/grid-op/render.html)

# API & Example

<script type="text/resource">
    <link href="/src/port/op.css" rel="stylesheet"/>
    <style>
    .layout div{ text-align: center; }
    .grid,
    .grid-main{ background: pink; }
    .grid-sub,
    .grid-extra,
    .grid-main .main-warp{ background: gold; }
    </style>
</script>

非均分的layout名中的除0之外的数字得来： x * 40 = w，w为一栏宽度，x即此数字

## .layout-col

{% highlight html %}
<div class="layout layout-col">
    <div class="grid">990px(.grid)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="screen">
            <div class="layout layout-col">
                <div class="grid">990px(.grid)</div>
            </div>
        </div>
    </script>
</div>

## .layout-2col

{% highlight html %}
<div class="layout layout-2col">
    <div class="grid">490px(.grid)</div>
    <div class="grid grid-fixed">490px(.grid)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="screen">
            <div class="layout layout-2col">
                <div class="grid">490px(.grid)</div>
                <div class="grid grid-fixed">490px(.grid)</div>
            </div>
        </div>
    </script>
</div>

## .layout-4col

{% highlight html %}
<div class="layout layout-4col">
    <div class="grid">240px(.grid)</div>
    <div class="grid">240px(.grid)</div>
    <div class="grid">240px(.grid)</div>
    <div class="grid grid-fixed">240px(.grid)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="screen">
            <div class="layout layout-4col">
                <div class="grid">240px(.grid)</div>
                <div class="grid">240px(.grid)</div>
                <div class="grid">240px(.grid)</div>
                <div class="grid grid-fixed">240px(.grid)</div>
            </div>
        </div>
    </script>
</div>

## .layout-e5m0s6

{% highlight html %}
<div class="layout layout-e5m0s6">
    <div class="grid-extra">200px(.grid-extra)</div>
    <div class="grid-main">530px(.grid-main)</div>
    <div class="grid-sub">240px(.grid-sub)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="screen">
            <div class="layout layout-e5m0s6">
                <div class="grid-extra">200px(.grid-extra)</div>
                <div class="grid-main">530px(.grid-main)</div>
                <div class="grid-sub">240px(.grid-sub)</div>
            </div>
        </div>
    </script>
</div>

## .layout-flying-e5m0s6

**此布局为双飞翼**

**好吧，main-warp是笔误，该是main-wrap**

{% highlight html %}
<div class="layout layout-flying-e5m0s6">
    <div class="grid-main"><div class="main-warp">530px(.grid-main>.main-warp)</div></div>
    <div class="grid-sub">240px(.grid-sub)</div>
    <div class="grid-extra">200px(.grid-extra)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="screen">
            <div class="layout layout-flying-e5m0s6">
                <div class="grid-main"><div class="main-warp">530px(.grid-main>.main-warp)</div></div>
                <div class="grid-sub">240px(.grid-sub)</div>
                <div class="grid-extra">200px(.grid-extra)</div>
            </div>
        </div>
    </script>
</div>

## .layout-s8m0e8

{% highlight html %}
<div class="layout layout-s8m0e8">
    <div class="grid-sub">320px(.grid-sub)</div>
    <div class="grid-main">330px(.grid-main)</div>
    <div class="grid-extra">320px(.grid-extra)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="screen">
            <div class="layout layout-s8m0e8">
                <div class="grid-sub">320px(.grid-sub)</div>
                <div class="grid-main">330px(.grid-main)</div>
                <div class="grid-extra">320px(.grid-extra)</div>
            </div>
        </div>
    </script>
</div>

## .layout-s5m0

{% highlight html %}
<div class="layout layout-s5m0">
    <div class="grid-sub">200px(.grid-sub)</div>
    <div class="grid-main">780px(.grid-main)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="screen">
            <div class="layout layout-s5m0">
                <div class="grid-sub">200px(.grid-sub)</div>
                <div class="grid-main">780px(.grid-main)</div>
            </div>
        </div>
    </script>
</div>

## .layout-s8m0

{% highlight html %}
<div class="layout layout-s8m0">
    <div class="grid-sub">320px(.grid-sub)</div>
    <div class="grid-main">660px(.grid-main)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="screen">
            <div class="layout layout-s8m0">
                <div class="grid-sub">320px(.grid-sub)</div>
                <div class="grid-main">660px(.grid-main)</div>
            </div>
        </div>
    </script>
</div>

## .layout-m0s8

{% highlight html %}
<div class="layout layout-m0s8">
    <div class="grid-main">660px(.grid-main)</div>
    <div class="grid-sub">320px(.grid-sub)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="screen">
            <div class="layout layout-m0s8">
                <div class="grid-main">660px(.grid-main)</div>
                <div class="grid-sub">320px(.grid-sub)</div>
            </div>
        </div>
    </script>
</div>

## .layout-m0s6

{% highlight html %}
<div class="layout layout-m0s6">
    <div class="grid-main">740px(.grid-main)</div>
    <div class="grid-sub">240px(.grid-sub)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="screen">
            <div class="layout layout-m0s6">
                <div class="grid-main">740px(.grid-main)</div>
                <div class="grid-sub">240px(.grid-sub)</div>
            </div>
        </div>
    </script>
</div>
