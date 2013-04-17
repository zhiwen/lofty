---
title: Lofty基本语法
layout: docs
---

## Table of Contents

* [Usage](#usage)
    * [定义模块](#define-module)
    * [关键字define](#keyword-define)
    * [关键模块require](#keymodule-require)
    * [关键模块exports](#keymodule-exports)
    * [关键模块module](#keymodule-module)
    * [关键字lofty](#keyword-lofty)
        * [lofty.define](#lofty-define)
        * [lofty.config](#lofty-config)
        * [lofty.debug](#lofty-debug)
        * [lofty.log](#lofty-log)
        * [lofty.noConflict](#lofty-noConflict)
        * [lofty.version](#lofty-version)
    
* [Advanced Usage](#advanced-usage)
    * [lofty.appframe定义应用框架](#lofty-appframe)
    * [侦听Lofty事件](#lofty-on)


# Usage {#usage}

Lofty所提供的模块管理是针对语言层而言的，是一种语法机制，而非文件层的

## 定义模块 define a module {#define-module}

Lofty采用类似AMD和CommonJS的方式来定义模块，`define`是全局函数，基本语法如下：

    define( id?, dependencies?, factory );
    
id，模块标识符，用来唯一标识所定义模块，只能是字符串

dependencies，模块依赖，只能是数组，且其每一项均是所依赖模块的id

factory，模块构造方法，可以是函数、对象、数组


## 关键字define {#keyword-define}

### define( id, dependencies, factory )

这是最常规的用法。当模块存在id时，则此模块为具名模块

    define( 'case/a', ['case/b','case/c'], function( b, c ){
        //todo sth
    } );

此场景下，称模块`case/a`依赖/引用模块`case/b`、模块`case/c`，模块`case/b`被模块`case/a`依赖/引用。此时，`factory`为函数，执行后，将得到该模块输出的接口，执行时，将会依次传入`dependencies`中各个id所标识的模块所输出的接口。即，`b`代表模块`case/b`输出的接口，`c`代表模块`case/c`输出的接口

具名模块只有在第一次其他模块依赖时才会执行`factory`并且输出接口，之后再被依赖，将直接输出接口

### define( id, factory )

当模块没有任何依赖的模块，可将dependencies参数省去

    define( 'case/b', function(){
        //todo sth
    } );

### define( id, factory<object/array> )

当factory为对象或数组时，factory对象或数据即为该模块输出的接口
    
    define( 'case/car', {
        color: 'white',
        size: 'large'
    } );
    
    define( 'case/size', ['large','normal','small'] );

### define( dependencies, factory )

当不写id时，此模块则匿名模块

    define( ['case/b','case/c'], function( b, c ){
        //todo sth
    } );

匿名模块一经定义立即执行，因为没有其他任何模块可以通过id来依赖于它

### define( factory )

匿名模块也可以省去dependencies

    define(function(){
        //todo sth
    });

## 关键模块require {#keymodule-require}

`require`是个函数，用来取得需要被依赖的模块的接口

### require( id )

关键模块如同关键字一样，是内建的，不能被修改的。可以这样使用关键模块require：
    
    define( 'case/d', ['require'], function( require ){
        var a = require('case/a'),
            b = require('case/b');
        //todo sth
    } );

`require`只有一个入参，即需要引用的模块的id。require之后返回引用模块的接口

`require`是同步的，require时，被引用的模块必须已定义

### require.use( ids, callback? )

如果明确需要异步去取模块的话，可以使用`require.use`

    define( 'case/e', ['require'], function( require ){
        //todo sth
        
        require.use( ['case/a','case/b'], function( a, b ){
            //todo sth
        } );
        
        require.use( 'case/c', function( c ){
            //todo sth
        } );
        
        require.use( 'case/c.css', function(){
            //todo sth
        } );
    } );

`require.use`类似`define`定义匿名模块，ids类似dependencies，是需要异步去取的模块的id数组，若只有一个模块时可以只写一个id。当然，引用的JS模块的id无须包含文件后缀名，而引用CSS模块时id必须带上文件后缀名（.css）

当ids中的模块都加载完成，即执行callback，callback执行时也会依次传入ids各模块的接口

对于需要被`require.use`的模块的id书写，在阿里巴巴中文站需要遵循以下规则：

1. 模块路径即id，id可由（/）分隔
1. 当id中存在中横线（-）时，请去掉中横线并将中横线后第一个字母改成大写，如`abc-edf`改写成小驼峰`abcEdf`
1. 推荐从一个style应用js/css目录的第一级开始写id

需要注意的是，`require.use`会循环取得所有依赖的模块，即当取到一个模块时，会检测其依赖的模块是否都已定义，未定义的仍会去异步加载，直至全部加载完成，才会执行callback

## 关键模块exports {#keymodule-exports}

`exports`是个对象，用来承载模块对外输出的接口

    define( 'case/f', ['exports'], function( exports ){
        exports.foo = function(){
            //todo sth
        };
    } );
    
当其他模块引用模块`case/f`时，将得到含有`foo`方法的对象

    define( 'case/g', ['exports'], function( exports ){
        exports = function(){};
    } );
    
关键模块exports是不能被覆盖的，不允许这么做

### 用return返回接口

除了使用关键模块exports来对外输出接口外，也可以使用`return`

    define( 'case/h', function(){
        var foo = function(){};
        return foo;
    } );
    
这样模块也能返回非对象的接口类型，当然也可以返回对象

## 关键模块module {#keymodule-module}

`module`是个对象，用来代表当前模块

### module.id

    define( 'case/i', ['module'], function( module ){
        module.id === 'case/i'; // true
    } );

`module.id`就是当前正在被定义的模块的id，`module.id`只读，若是匿名模块，其值为空字符串

### module.exports

    define( 'case/j', 'module', function( module ){
        module.exports = function(){};
    } );

`module.exports`能够取得同`return`一样的结果

当关键模块exports、`return`、`module.exports`都有被使用到时，它们的生效顺序如下：

    return > module.exports > exports

## 关键字lofty {#keyword-lofty}

`lofty`是Lofty所提供的一个全局对象，如同`jQuery`之于jQuery

### lofty.define {#lofty-define}

全局函数`define`即是对`lofty.define`的引用

### lofty.config( options ) {#lofty-config}

`lofty.config`是个函数，用来定义或更新相关配置项，其只有一个对象入参

    lofty.config({
        'configItem1': 'value1',
        '...': '...'
    });

#### alias\<object\>

`alias`是个对象，用来配置模块id的别名，以简化常用模块的书写

    lofty.config({
        alias: {
            'a': 'case/a'
        }
    });

那么在其他模块中被使用（dependencies/require/require.use）到时均可用`a`来代替`case/a`，当然在模块`case/a`定义时其id必须是`case/a`

重复定义同名alias的，后来者将覆盖前者

#### resolve\<function\>

`resolve`是个函数，当需要根据id取得url时执行，其入参只有一个，即将要被转换的id，然后必须`return`经过resolve后的id

    lofty.config({
        resolve: function( id ){
            //todo sth;
            return id;
        }
    });
    
`resolve`函数可以定义多个，不覆盖，按先进先出依次执行，一旦resolve成功，就退出整个resolve环节

#### baseUrl\<string\>

`baseUrl`是字符串，作为异步取文件时文件url的基础部分，默认值为当前Lofty文件所在src的`protocol+'//'+host+'/'`，例如`http://lofty.fangdeng.org/`

    lofty.config({
        baseUrl: 'http://lofty.fangdeng.org/'
    });
    
加`baseUrl`在`resolve`之后，加时会先判断当前url是否为绝对路径，否才加

#### hasStamp\<boolean\>

`hasStamp`是个布尔值，为`true`时给每个需要异步取的url加上默认时间戳，为`false`时不加

    lofty.config({
        hasStamp: true
    });

**在阿里巴巴中文站，`hasStamp`默认为`true`**

#### stamp\<object\>

`stamp`是个对象，用来设定某id被resolve成url之后所加的时间辍，其每个子对象必须是符合正则的字符串

    lofty.config({
        stamp: {
            'case/a': '20130407',
            '^case': '20130408'
        }
    });
    
重复定义同名的stamp时，后来者将覆盖前者。解析时间戳时，一旦匹配到，即退出整个匹配环节

不论`hasStamp`是否为`true`，只要被`stamp`匹配到，即以`stamp`匹配的为最后时间戳

**注意：对于规则的匹配采用for-in，先后顺序不定，请尽量保持各规则的互斥**

#### loadTimeout\<number\>

`loadTimeout`是个以毫秒为单位的数字，作为加载资源时的超时时间，默认为10000

    lofty.config({
        loadTimeout: 100000
    });

#### charset\<string\>

`charset`为字符串，即指定加载资源的字符集

    lofty.config({
        charset: 'utf-8'
    });

### lofty.debug {#lofty-debug}

默认可以通过在页面url中添加字符串`lofty.debug=true`与否来决定当前是否为debug状态

也可以通过

    lofty.config({
        debug: true
    });

来强制进入debug状态

### lofty.log( message, type\<string\> ) {#lofty-log}

`lofty.log`是个函数，用来打印消息，只有在debug状态下才有效，在支持console的环境，lofty.log内部调用console，不支持时通过生成节点也输出消息

`lofty.log`有两个入参，一为需要打印的消息，二为打印类型，当打印类型为`warn`时，打印成错误信息

**推荐使用`lofty.log`来代替代码调试时的`alert`、`console`**

### lofty.noConflict {#lofty-noConflict}

`lofty.noConflict`是个函数，用来取消Lofty对`define`全局变量的占用，还原成先定义者

### lofty.version {#lofty-version}

`lofty.version`是字符串，表示当前Lofty的版本，是`major.minor`形式，不带beta等文本

# Advanced Usage {#advanced-usage}

此处的高级用法均是阿里巴巴中文站环境下的，且只允许应用框架作者使用

## lofty.appframe定义应用框架 {#lofty-appframe}

`lofty.appframe`是个函数，用来定义应用线的应用框架，其有一个字符串入参

    lofty.appframe('alpha');
    
这样就定义了一个全局对象`alpha`作为一个应用框架的承载者。若定义前已存在全局变量`alpha`，则被覆盖

`alpha`拥有四个子对象`define`、`log`、`config`、`on`，其中`alpha.define`等同于`lofty.define`，`alpha.log`等同于`lofty.log`、`alpha.config`等同于`lofty.config`

## 侦听Lofty事件 {#lofty-on}

Lofty在模块定义、文件加载等各地添加了事件发送，应用框架可以侦听各个事件并添加逻辑即可实现个性化需求，基本语法为：

    alpha.on( eventName, callback );

### 'existed'事件

    alpha.on( 'existed', function( meta ){
        //todo sth
    } );
    
此事件在定义模块之初，表明将要定义的模块已存在，`callback`的入参`meta`只有一个子对象id

### 'define'事件

    alpha.on( 'define', function( mod ){
        //todo sth
    } );

此事件在模块刚定义完，还未保存，`callback`的入参`mod`即是刚定义好的mod对象

### 'compiled'事件

    alpha.on( 'compiled', function( mod ){
        //todo sth
    } );
    
此事件在模块编译完毕生成exports，`callback`的入参`mod`是编译之后的mod对象

### 'compileFail'事件

    alpha.on( 'compileFail', function( ex, mod ){
        //todo sth
    } );
    
此事件在模块编译失败，`callback`的入参`ex`即是浏览器抛出的error，`mod`是编译失败的mod对象

### 'required'事件

    alpha.on( 'required', function( mod ){
        //todo sth
    } );

此事件在引用模块成功，`callback`的入参`mod`是被引用的模块对象

### 'requireFail'事件

    alpha.on( 'requireFail', function( meta ){
        //todo sth
    } );

此事件在引用模块失败，`callback`的入参`meta`只有一个子对象id，是被引用的模块的id

### 'makeRequire'事件

    alpha.on( 'makeRequire', function( require ){
        //todo sth
    } );
    
此事件在某模块依赖关键模块require而生成关键模块require时，`callback`的入参`require`就是关键模块require对象

### 'alias'事件

    alpha.on( 'alias', function( meta ){
        //todo sth
    });

此事件在解析别名后，`callback`的入参`meta`只有一个子对象id

### 'id2url'事件

    alpha.on( 'id2url', function( meta ){
        //todo sth
    } );

此事件在id解析成url后，`callback`的入参`meta`有两个子对象，一为id，二为url

### 'requestTimeout'事件

    alpha.on( 'requestTimeout', function( asset ){
        //todo sth
    } );

此事件在请求资源超时，`callback`的入参`asset`为资源对象
