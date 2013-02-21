#pre

1. src、doc、ut同步进行
1. 文档可以外网访问，http://lib.fangdeng.org/ http://5.lib.fangdeng.org/ http://fdev5.fangdeng.org/
1. alicn

#模块分级

lang -> unit -> zone -> mod -> region -> grid -> layout -> district -> layer

#fine.css

1. lang/reset
1. lang/common
1. lang/grid 只有最简单的grid公共样式

1. lang/editor?

#fine.js

1. define.js
    1. 一切都是模块
    1. 一切都要简单，看到什么就是什么
    1. 统一的书写格式，define( id?, dependencies?, factory )
    1. id，字符串，跟路径相关
    1. dependencies，数组
    1. factory，所有依赖必须以模块方式引入，不支持require/exports/module的自由变量
    1. define是同步的，不支持AMD
    1. 模块不支持domready
    1. require，参数等同id
    1. exports，等于module.exports
    1. module，返回自己
    1. config以模块方式
    1. 支持id别名
    1. fv.noConflict挂靠在框架名
    1. fv.log，代替console.info
    1. fv.debug，在url加，即进入debug状态
1. domready.js
1. amd.js
1. async.js
1. config.js

#lang

1. 常用函数：extendIf、substitute etc.
1. exposure.js 曝光
1. observer.js 观察者
1. class.js 类
1. mvc.js MVC
1. log.js 日志打印

1. module.js
1. cookie.js


#action:

1. fdev5的名字:lofty


#remark
1. 对id的解析，自行处理，由async.config来定义
1. 




#Roadmap

