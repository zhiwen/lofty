---
title: lofty/kernel/alicn
layout: api
---

# Intro

本模块为阿里巴巴中文站提供对Lofty Kernel JS的配置和扩展

# Change Log

1. 2013.03.09，v0.1，by Edgar

# Import

    ImportJavscript.url('http://style.china.alibaba.com/fdevlib/js/lofty/port/classic.js');
    ImportJavscript.url('http://style.china.alibaba.com/fdevlib/js/lofty/port/aio.js');

**不允许单独引用本模块使用，只允许通过上述模块择一来使用之**

# Unit Testing

[Unit Testing](/tests/specs/kernel/alicn/runner.html)

# API

## 配置

### hasStamp

加载文件时增加默认时间戳

### resolve

由模块id转换成url时，增加默认的resolve规则来处理`lofty/*`、`avid/*`、`sys/*`的模块

### debug

增加通过页面url中加入`lofty.debug=true`来触发debug状态

## appframe生成应用框架

详情请见[Lofty基本语法之高级用法](/docs/grammar.html#advanced-usage)
