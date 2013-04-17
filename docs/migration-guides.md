---
title: 迁移指南
layout: docs
---

## Table of Contents

* [Lofty CSS与fdev4 CSS的差异](#difference-lofty-fdev4-css)
* [使用Lofty CSS](#use-lofty-css)
* [使用Lofty JS](#use-lofty-js)

不论何种情况，在中文站环境下，使用Lofty时，请先创建自己业务线的应用框架，当然也可以数个业务线共用一个

本文档所称的Lofty、fdev4均指核心部分，不含其他模块、组件

# Lofty CSS与fdev4 CSS的差异 {#difference-lofty-fdev4-css}

Lofty CSS基本上继承了fdev4 CSS，把四个基本不用的class删掉了，罗列如下：

`.fd-inline`、`.fd-lump`、`.fd-visible`、`.fd-hidden`

## 使用Lofty CSS {#use-lofty-css}

若没有用到`.fd-inline`、`.fd-lump`、`.fd-visible`、`.fd-hidden`这个class，可以用相应Lofty CSS版本直接替换

    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/float.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/wide.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/flying.css);
    @import url(http://style.china.alibaba.com/fdevlib/css/lofty/port/op.css);

# 使用Lofty JS {#use-lofty-js}

将Lofty JS文件加入原有的merge文件顶部，旧代码均不改动

在应用框架中，可以加入如下的模块：

    define( 'jquery', function(){
        return jQuery;
    } );
    
那么，在新代码中，即可通过`require('jquery')`来使用jQuery相关功能。若要使用fdev4的组件，仍然照旧方式使用即可。如：

    define( ['jquery'], function( $ ){
        var $el = $('.class');
        //todo sth
    });
