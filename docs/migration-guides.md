---
title: 迁移指南
layout: default
---

## Table of Contents

* [Lofty CSS与fdev4 CSS的差异](#difference-lofty-fdev4-css)
* [保留fdev4](#keep-fdev4)
* [逐步移除fdev4](#remove-fdev4)
    * [移除fdev4 JS](#remove-fdev4-js)
    * [移除fdev4 CSS](#remove-fdev4-css)

不论何种情况，在中文站环境下，使用Lofty时，请先创建自己业务线的应用框架，当然也可以数个业务线共用一个

本文档所称的Lofty、fdev4均指核心部分，不含其他模块、组件

# Lofty CSS与fdev4 CSS的差异 {#difference-lofty-fdev4-css}

Lofty CSS基本上继承了fdev4 CSS，把四个基本不用的class删掉了，罗列如下：

`.fd-inline`、`.fd-lump`、`.fd-visible`、`.fd-hidden`

# 保留fdev4 {#keep-fdev4}

此种情况下，只将Lofty JS文件加入原有的merge文件顶部，旧代码均不改动

在应用框架中，可以加入如下的模块：

    define( 'jquery', function(){
        return jQuery;
    } );
    
那么，在新代码中，即可通过`require('jquery')`来使用jQuery相关功能。若要使用fdev4的组件，仍然照旧方式使用即可。如：

    define( ['jquery'], function( $ ){
        var $el = $('.class');
        //todo sth
    });

# 逐步移除fdev4 {#remove-fdev4}

fdev4可以作为一个三方库存在于Lofty架构之下，像使用jQuery一样使用，但从长久看，终究是要慢慢退出历史的

## 移除fdev4 JS {#remove-fdev4-js}

直接使用以下两个文件代替fdev4的`fdev-min.js`

    ImportJavscript.url('http://style.china.alibaba.com/fdevlib/js/avid/jquery/jquery-latest.js');
    ImportJavscript.url('http://style.china.alibaba.com/fdevlib/js/lofty/adapter/gears.js');
    
**但要注意，`avid/jquery/jqueryLatest`的jQuery版本是1.8.3，使用时仍然可使用`require('jquery')`**

**若要这么做，请回归功能**

## 移除fdev4 CSS {#remove-fdev4-css}

若没有用到`.fd-inline`、`.fd-lump`、`.fd-visible`、`.fd-hidden`这个class，可以用相应Lofty CSS版本替换

    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/float.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/wide.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/flying.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/op.css);
