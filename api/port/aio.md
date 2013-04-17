---
title: lofty/port/aio
layout: api
---

# Intro

本模块是lofty/kernel中的全部JS模块的集合，作为使用Lofty Kernel JS的全版本

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

    ImportJavscript.url('http://style.china.alibaba.com/fdevlib/js/lofty/port/aio.js');

# Unit Testing

[Unit Testing](/tests/specs/port/aio/runner.html)

# API

详情请见[Lofty基本语法](/docs/grammar.html)

`lofty/port/aio`同`lofty/port/classic`相比，增加了dependencies中的模块也会跟`require.use`一样自动加载所需依赖，且循环加载
