---
title: lofty/kernel/gridFlying.css
layout: api
---

# Intro

本模块提供一种栅格系统（双飞翼布局）的基础部分，利用浮动和负边距实现，布局的细节部分需要应用框架自行定义。

Thanks to: lifesigner lifesigner.github.com

# Change Log

1. 2010.12.16，created，by Edgar
1. 2012.07.09，修改，by Edgar
1. 2013.03.29，Lofty继承并修改，by Edgar

# Require

`lofty/kernel/reset.css`、`lofty/kernel/layout.css`

# Import

    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/flying.css);

**不允许单独引用本模块使用，只允许通过`lofty/port/flying.css`来使用之，且`lofty/port/flying.css`已含需require的模块**

# Unit Testing

[Unit Testing](/tests/specs/kernel/grid-flying/render.html)

# Usage & Standard

layout命名规则： .layout-sXm0eY

约定：

1. Grid ＝ 栅格单元的颗粒大小，中文站支持两种： 40px、30px
1. W ＝ 页面宽度，中文站支持两种： 952px、990px。当Grid=32px\|\|24px，W为952px，Gap为8px；当Grid＝30px，W为990px，Gap为10px
1. Gap ＝ 栅格之间的间距。当W＝952px，Gap＝8px；当W＝990px，Gap＝10px
1. sX 表示 gird-sub 的宽度 ＝ X * Grid - Gap
1. eY  表示 grid-extra 的宽度 ＝ Y * Grid - Gap
1. m0 表示 grid-main 的宽度 ＝ W - ( X + Y ) * Grid，始终为m0
1. s-m-e 的顺序，表示各栏的排列顺序

# Example

<script type="text/resource">
    <link href="/src/port/flying.css" rel="stylesheet"/>
    <style>
    .layout-e5m0s6 .main-wrap{ margin:0 240px 0 200px; }
    .layout-e5m0s6 .grid-sub{ width:232px; margin-left:-232px; }
    .layout-e5m0s6 .grid-extra{ width:192px; margin-left:-100%; }

    .layout-s6m0e5 .main-wrap{ margin: 0 200px 0 240px; }
    .layout-s6m0e5 .grid-sub{ width: 232px; margin-left: -100%; }
    .layout-s6m0e5 .grid-extra{ width: 192px; margin-left: -192px; }

    .layout-m0s6e5 .main-wrap{ margin-right: 440px; }
    .layout-m0s6e5 .grid-sub{ width: 232px; margin-left: -432px; }
    .layout-m0s6e5 .grid-extra{ width: 192px; margin-left: -192px; }

    .layout-m0e5s6 .main-wrap{ margin-right: 440px; }
    .layout-m0e5s6 .grid-sub{ width: 232px; margin-left: -232px; }
    .layout-m0e5s6 .grid-extra{ width: 192px; margin-left: -432px; }
    
    .layout div{ text-align: center; }
    .main-wrap{ background: pink; }
    .grid-sub{ background: gold; }
    .grid-extra{ background: aqua; }
    </style>
</script>

若在应用框架作如下定义：
{% highlight css%}
.layout-e5m0s6 .main-wrap{ margin:0 240px 0 200px; }
.layout-e5m0s6 .grid-sub{ width:232px; margin-left:-232px; }
.layout-e5m0s6 .grid-extra{ width:192px; margin-left:-100%; }

.layout-s6m0e5 .main-wrap{ margin: 0 200px 0 240px; }
.layout-s6m0e5 .grid-sub{ width: 232px; margin-left: -100%; }
.layout-s6m0e5 .grid-extra{ width: 192px; margin-left: -192px; }

.layout-m0s6e5 .main-wrap{ margin-right: 440px; }
.layout-m0s6e5 .grid-sub{ width: 232px; margin-left: -432px; }
.layout-m0s6e5 .grid-extra{ width: 192px; margin-left: -192px; }

.layout-m0e5s6 .main-wrap{ margin-right: 440px; }
.layout-m0e5s6 .grid-sub{ width: 232px; margin-left: -232px; }
.layout-m0e5s6 .grid-extra{ width: 192px; margin-left: -432px; }
{% endhighlight %}

那么，将有以下几种布局

## .layout-e5m0s6

{% highlight html %}
<div class="layout layout-e5m0s6">
    <div class="grid-main"><div class="main-wrap">512px(.grid-main > .main-wrap)</div></div>
    <div class="grid-sub">232px(.grid-sub)</div>
    <div class="grid-extra">192px(.grid-extra)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="w952">
            <div class="layout layout-e5m0s6">
                <div class="grid-main"><div class="main-wrap">512px(.grid-main > .main-wrap)</div></div>
                <div class="grid-sub">232px(.grid-sub)</div>
                <div class="grid-extra">192px(.grid-extra)</div>
            </div>
        </div>
    </script>
</div>

## .layout-s6m0e5

{% highlight html %}
<div class="layout layout-s6m0e5">
    <div class="grid-main"><div class="main-wrap">512px(.grid-main > .main-wrap)</div></div>
    <div class="grid-sub">232px(.grid-sub)</div>
    <div class="grid-extra">192px(.grid-extra)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="w952">
            <div class="layout layout-s6m0e5">
                <div class="grid-main"><div class="main-wrap">512px(.grid-main > .main-wrap)</div></div>
                <div class="grid-sub">232px(.grid-sub)</div>
                <div class="grid-extra">192px(.grid-extra)</div>
            </div>
        </div>
    </script>
</div>

## .layout-m0s6e5

{% highlight html %}
<div class="layout layout-m0s6e5">
    <div class="grid-main"><div class="main-wrap">512px(.grid-main > .main-wrap)</div></div>
    <div class="grid-sub">232px(.grid-sub)</div>
    <div class="grid-extra">192px(.grid-extra)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="w952">
            <div class="layout layout-m0s6e5">
                <div class="grid-main"><div class="main-wrap">512px(.grid-main > .main-wrap)</div></div>
                <div class="grid-sub">232px(.grid-sub)</div>
                <div class="grid-extra">192px(.grid-extra)</div>
            </div>
        </div>
    </script>
</div>

## .layout-m0e5s6

{% highlight html %}
<div class="layout layout-m0e5s6">
    <div class="grid-main"><div class="main-wrap">512px(.grid-main > .main-wrap)</div></div>
    <div class="grid-sub">232px(.grid-sub)</div>
    <div class="grid-extra">192px(.grid-extra)</div>
</div>
{% endhighlight %}

<div class="demo">
    <script type="text/template" data-height="18px">
        <div class="w952">
            <div class="layout layout-m0e5s6">
                <div class="grid-main"><div class="main-wrap">512px(.grid-main > .main-wrap)</div></div>
                <div class="grid-sub">232px(.grid-sub)</div>
                <div class="grid-extra">192px(.grid-extra)</div>
            </div>
        </div>
    </script>
</div>
