---
title: lofty/port/classic
layout: api
---

# Intro

本模块是lofty/kernel中的数个JS模块的集合，作为使用Lofty Kernel JS的基础版本

# Change Log

1. 2013.04.09，v0.1 beta，by Edgar

# Merge

1. `lofty/kernel/boot`
1. `lofty/kernel/lang`
1. `lofty/kernel/event`
1. `lofty/kernel/config`
1. `lofty/kernel/alias`
1. `lofty/kernel/module`
1. `lofty/kernel/loader`
1. `lofty/kernel/id2url`
1. `lofty/kernel/request`
1. `lofty/kernel/deferred`
1. `lofty/kernel/use`
1. `lofty/kernel/amd`
1. `lofty/kernel/debug`
1. `lofty/kernel/alicn`

# Import

    ImportJavscript.url('http://style.china.alibaba.com/fdevlib/js/lofty/port/classic.js');

# Unit Testing

[Unit Testing](/tests/specs/port/classic/runner.html)、
[线上Unit Testing](/tests/specs/port/classic/runner-online.html)、
[开启amd的Unit Testing](/tests/specs/port/classic/runner-aio.html)、
[开启amd的线上Unit Testing](/tests/specs/port/classic/runner-aio-online.html)

# API

详情请见[Lofty基本语法](/docs/grammar.html)

若要dependencies也如同`require.use`一样支持异步依赖模块，可在应用框架中加入如下配置开启

    alpha.config({
        amd: true
    });
    
