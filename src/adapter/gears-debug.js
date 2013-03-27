/**
 * Baseed on jQuery JavaScript Library v1.7.1
 * @Author: Denis 2011.01.21
 * @update Denis 2011.05.30 对add和use进行升级，支持数据模块化
 * @update Denis & Allenm 2011.05.31 优化 escapeHTML方法，支持对属性值的转义
 * @update Denis 调整use的第三个参数可以传递的值，通过传递true即可实现数据刷新且无需变更配置
 * @update Denis 2011.08.11 移出styleDomain配置至config.js
 * @update zhangfan 2011.09.23 添加methodize,extendNative两个方法
 * @update Denis 2011.12.27 修复数据模块的BUG，当请求未完成时进行数据的刷新操作时，新的配置将无法生效。
 * @update Denis 2012.04.09 将use改造成deferred对象
 * @update Denis 2012.05.07 use支持css文件的onload
 * @update Denis 2012.05.30 支持use的时候修改configs
 * @update Denis 2012.06.07 修复FF13的兼容问题，CSS动态载入监听
 */
(function($, undefined){
  if ($.util) {
    return;
  }
  var $isFunction = $.isFunction, $isArray = $.isArray, $each = $.each, ALICNWEB = 'alicnweb';
  
  $.noConflict();
  
  //setup global ajax configs
  $.ajaxSetup({
    scriptCharset: 'gbk',
    cache: true,
    timeout: 10000
  });
  //setup golobal ajax options
  $.ajaxPrefilter('script jsonp', function(options){
    options.crossDomain = true;
  });
  
  $.extend({
    /**
     * Returns the namespace specified and creates it if it doesn't exist
     * <pre>
     * jQuery.namespace('Platform.winport');
     * * jQuery.namespace('Platform.winport', 'Platform.winport.diy');
     * </pre>
     *
     * Be careful when naming packages. Reserved words may work in some browsers
     * and not others. For instance, the following will fail in Safari:
     * <pre>
     * jQuery.namespace('really.long.nested.namespace');
     * </pre>
     * jQuery fails because "long" is a future reserved word in ECMAScript
     *
     * @method namespace
     * @static
     * @param  {collection} arguments 1-n namespaces to create.
     * @return {object}  A reference to the last namespace object created.
     */
    namespace: function(){
      var a = arguments, o, i = 0, j, d, arg;
      for (; i < a.length; i++) {
        o = window;
        arg = a[i];
        if (arg.indexOf('.')) {
          d = arg.split('.');
          for (j = (d[0] == 'window') ? 1 : 0; j < d.length; j++) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
          }
        } else {
          o[arg] = o[arg] || {};
        }
      }
    },
    /**
     * Executes the supplied function in the context of the supplied
     * object 'when' milliseconds later.  Executes the function a
     * single time unless periodic is set to true.
     * @method later
     * @for jQuery
     * @param when {int} the number of milliseconds to wait until the fn
     * is executed.
     * @param o the context object.
     * @param fn {Function|String} the function to execute or the name of
     * the method in the 'o' object to execute.
     * @param data [Array] data that is provided to the function.  This
     * accepts either a single item or an array.  If an array is provided,
     * the function is executed with one parameter for each array item.
     * If you need to pass a single array parameter, it needs to be wrapped
     * in an array [myarray].
     * @param periodic {boolean} if true, executes continuously at supplied
     * interval until canceled.
     * @return {object} a timer object. Call the cancel() method on this
     * object to stop the timer.
     */
    later: function(when, o, fn, data, periodic){
      when = when || 0;
      
      var m = fn, f, id;
      
      if (o && $.type(fn) === 'string') {
        m = o[fn];
      }
      
      f = (data === undefined) ? function(){
        m.call(o);
      }
 : function(){
        m.apply(o, $.makeArray(data));
      };
      
      id = (periodic) ? setInterval(f, when) : setTimeout(f, when);
      
      return {
        id: id,
        interval: periodic,
        cancel: function(){
          if (this.interval) {
            clearInterval(this.id);
          } else {
            clearTimeout(this.id);
          }
        }
      };
    },
    /**
     * @method extendIf
     * @param {Object} target
     * @param {Object} o
     */
    extendIf: function(target, o){
      if (o === undefined) {
        o = target;
        target = this;
      }
      for (var p in o) {
        if (typeof target[p] === 'undefined') {
          target[p] = o[p];
        }
      }
      return target;
    },
    /**
     * 将字符串转换成hash
     * @param {Object} s
     * @param {Object} separator
     */
    unparam: function(s, separator){
      if (typeof s !== 'string') {
        return;
      }
      var match = s.trim().match(/([^?#]*)(#.*)?$/), hash = {};
      if (!match) {
        return {};
      }
      $.each(match[1].split(separator || '&'), function(i, pair){
        if ((pair = pair.split('='))[0]) {
          var key = decodeURIComponent(pair.shift()), value = pair.length > 1 ? pair.join('=') : pair[0];
          
          if (value != undefined) {
            value = decodeURIComponent(value);
          }
          
          if (key in hash) {
            if (!$.isArray(hash[key])) {
              hash[key] = [hash[key]];
            }
            hash[key].push(value);
          } else {
            hash[key] = value;
          }
        }
      });
      return hash;
    },
    /**
     * alibaba feature, use as param but not param
     * @param {Object} a
     * @param {Bolean} traditional deep recursion?
     */
    paramSpecial: function(a, traditional){
      var s = [], add = function(key, value){
        // If value is a function, invoke it and return its value
        value = $isFunction(value) ? value() : value;
        s[s.length] = encodeSpecial(key) + '=' + encodeSpecial(value + '');
      };
      
      // Set traditional to true for jQuery <= 1.3.2 behavior.
      if (traditional === undefined) {
        traditional = $.ajaxSettings.traditional;
      }
      
      // If an array was passed in, assume that it is an array of form elements.
      if ($isArray(a) || a.jquery) {
        // Serialize the form elements
        $each(a, function(){
          add(this.name, this.value);
        });
        
      } else {
        // If traditional, encode the "old" way (the way 1.3.2 or older
        // did it), otherwise encode params recursively.
        for (var prefix in a) {
          buildParams(prefix, a[prefix], traditional, add);
        }
      }
      
      // Return the resulting serialization
      return s.join('&').replace(/\//g, '%2F').replace(/#/g, '%23').replace(/\+/g, '%2B').replace(/\s/g, '+');
    },
    /*
     * 将静态方法methodize化，即让其第一个参数或指定属性为this.
     * @method methodize
     * @param  {Object}        obj     Helper对象
     * @param  {String}可选    attr    this[attr]作为对象的this
     * @param  {Array}可选     others  不methodize化的方法
     * @return {Object}        methodize化后的对象
     */
    methodize: function(obj, attr, others){
      var ret = {};
      for (var m in obj) {
        if (others) {
          for (var i = others.length; i--;) {
            if (others[i] == m) 
              break;
          }
        }
        if (!others || others[i] != m) {
          (function(m){
            ret[m] = function(){
              var args = [].slice.call(arguments), self = attr ? this[attr] : this;
              return obj[m].apply(obj, [self].concat(args));
            };
          })(m);
        }
      }
      return ret;
    },
    /*
     * 用于继承native，如Array,String,Date 等等
     * @method extendNative
     * @param  {Function(Class)} newType    需要继承native的类
     * @param  {Native}          nativeType 需要继承的native类型
     * @param  {Array}           dontEnums  不可枚举的方法名列表
     * @param  {String}可选      attr       若存在attr则将this[attr]作为该类型的方法的this
     * @param  {Funtcion}可选    toString   新的类型的toString方法
     */
    extendNative: function(newType, nativeType, dontEnums, attr, toString){
      var slice = [].slice, wrap = function(fn, attr){
        if (attr) {
          return function(){
            var args = slice.call(arguments);
            return fn.apply(this[attr], args);
          }
        }
        return fn;
      };
      // 可枚举的自定义原型方法
      for (var m in nativeType) {
        if (nativeType.prototype[m]) {
          newType.prototype[m] = wrap(nativeType.prototype[m], attr);
        }
      }
      if (dontEnums) {
        // 不可枚举的原生方法
        for (var i = dontEnums.length; i--;) {
          if (nativeType.prototype[dontEnums[i]]) {
            newType.prototype[dontEnums[i]] = wrap(nativeType.prototype[dontEnums[i]], attr);
          }
        }
      }
      // 重写toString
      if (toString) 
        newType.prototype.toString = toString;
    },
    /**
     * jQuery.debug.js will rewrite this,
     */
    log: $.noop
  });
  
  $.namespace('jQuery.util.ua', 'jQuery.ui');
  
  $.extendIf($.util, {
    /**
     * 这里只提供cookie的读操作，需要完整的cookie操作需要use util-cookie
     * @param {String} key
     * @param {Object} value
     * @param {Object} options
     */
    cookie: function(key, value, options){
      // key and possibly options given, get cookie...
      if (value !== null && typeof value === "object") {
        options = value;
      }
      options = options || {};
      //noformat
	        var result, code = options.raw ? function(s){
                return s;
            } : escape, decode = options.raw ? function(s){
	            return s;
	        } : unescape;
			//format      
      return (result = new RegExp('(?:^|; )' + code(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
    },
    /**
     * 处理alicnweb键值（只读），需要完整的subCookie操作需要use util-cookie
     * @param {Object} key
     * @param {Object} value
     * @param {Object} options
     */
    subCookie: function(key, value, options){
      //序列化
      var hash = $.unparam($.util.cookie(ALICNWEB) || '', '|') || {}, options = options ||
      {
        path: '/',
        domain: 'alibaba.com',
        expires: new Date('January 1, 2050')
      };
      if (arguments.length > 1) {
        hash[key] = value;
        return $.util.cookie(ALICNWEB, $.param(hash).replace(/&/g, '|'), options);
      } else {
        return hash[key] === undefined ? null : hash[key];
      }
    },
    /**
     * Same as YUI's
     * @method substitute
     * @static
     * @param {string} str string template to replace.
     * @param {string} data string to deal.
     * @return {string} the substituted string.
     */
    substitute: function(str, data){
      return str.replace(/\{(\w+)\}/g, function(r, m){
        return data[m] !== undefined ? data[m] : '{' + m + '}';
      });
    },
    /**
     * escape HTML
     * @param {Object} str
     * @param {Bolean} attr	 是否对属性进行额外处理
     * @return {string}
     */
    escapeHTML: function(str, attr){
      if (attr) {
        return str.replace(/[<"']/g, function(s){
          switch (s) {
            case '"':
              return '&quot;';
            case "'":
              return '&#39;';
            case '<':
              return '&lt;';
            case '&':
              return '&amp;';
            default:
              return s;
          }
        });
      } else {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
      }
    },
    /**
     * unescape HTML
     * @param {Object} str
     * @return
     */
    unescapeHTML: function(str){
      var div = document.createElement('div');
      div.innerHTML = str.replace(/<\/?[^>]+>/gi, '');
      return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
    }
  });
  //ua detect
  $.extendIf($.util.ua, {
    ie: !!$.browser.msie,
    ie6: !!($.browser.msie && $.browser.version == 6),
    ie67: !!($.browser.msie && $.browser.version < 8)
  });
  //feature detect
  $.extendIf($.support, {
    placeholder: 'placeholder' in document.createElement('input'),
    JSON: 'JSON' in window,
    localStorage: 'localStorage' in window,
    WebSocket: 'WebSocket' in window
    //positionFixed: !$.util.ua.ie6
  });
  
  $.fn.extend({
    /**
     * alibaba feature, use as serialize but not serialize
     */
    serializeSpecial: function(){
      return $.paramSpecial(this.serializeArray());
    }
  });
  /**
   * alibaba's feature use as encodeURIComponent
   * @method encodeSpecial
   * @private
   * @param {Object} str
   */
  function encodeSpecial(str){
    return str.replace(/%/g, '%25').replace(/&/g, '%26');
  }
  /**
   * copy form jQuery
   * @param {Object} prefix
   * @param {Object} obj
   * @param {Bolean} traditional
   * @param {Object} add
   */
  function buildParams(prefix, obj, traditional, add){
    if ($isArray(obj) && obj.length) {
      // Serialize array item.
      $each(obj, function(i, v){
        if (traditional || rbracket.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, v);
          
        } else {
          // If array item is non-scalar (array or object), encode its
          // numeric index to resolve deserialization ambiguity issues.
          // Note that rack (as of 1.0.0) can't currently deserialize
          // nested arrays properly, and attempting to do so may cause
          // a server error. Possible fixes are to modify rack's
          // deserialization algorithm or to provide an option or flag
          // to force array serialization to be shallow.
          buildParams(prefix + '[' + (typeof v === 'object' || $isArray(v) ? i : '') + ']', v, traditional, add);
        }
      });
      
    } else if (!traditional && obj !== null && typeof obj === 'object') {
      // If we see an array here, it is empty and should be treated as an empty
      // object
      if ($isArray(obj) || $.isEmptyObject(obj)) {
        add(prefix, '');
        
        // Serialize object item.
      } else {
        $each(obj, function(k, v){
          buildParams(prefix + '[' + k + ']', v, traditional, add);
        });
      }
      
    } else {
      // Serialize scalar item.
      add(prefix, obj);
    }
  }
  
  $.extendIf(Array.prototype, {
    /**
     * @method every
     * @param {Object} callback
     * @param {Object} context
     */
    every: function(callback, context){
      for (var i = 0, len = this.length; i < len; i++) {
        if (!callback.call(context, this[i], i, this)) {
          return false;
        }
      }
      return true;
    },
    /**
     * @method filter
     * @param {Object} callback
     * @param {Object} context
     */
    filter: function(callback, context){
      var res = [];
      for (var i = 0, len = this.length; i < len; i++) {
        if (callback.call(context, this[i], i, this)) {
          res[res.length] = this[i];
        }
      }
      return res;
      
    },
    /**
     * @param indexOf
     * @param {Object} elem
     * @param {Object} fromIndex
     */
    indexOf: function(elem, fromIndex){
      fromIndex = fromIndex || 0;
      for (var i = fromIndex, len = this.length; i < len; i++) {
        if (this[i] === elem) {
          return i;
        }
      }
      return -1;
    },
    /**
     * @param lastIndexOf
     * @param {Object} elem
     * @param {Object} fromIndex
     */
    lastIndexOf: function(elem, fromIndex){
      fromIndex = fromIndex === undefined ? this.length : fromIndex;
      for (var i = fromIndex; -1 < i; i--) {
        if (this[i] === elem) {
          return i;
        }
      }
      return -1;
    },
    /**
     * Remove item from array
     * @param {Object} elem
     * @return {Bolean}
     */
    remove: function(elem){
      var i = this.indexOf(elem);
      if (i !== -1) {
        this.splice(i, 1);
        return true;
      } else {
        return false;
      }
    },
    /**
     * @method some
     * @param {Object} callback
     * @param {Object} context
     */
    some: function(callback, context){
      for (var i = 0, len = this.length; i < len; i++) {
        if (callback.call(context, this[i], i, this)) {
          return true;
        }
      }
      return false;
    }
  });
  
  $.extendIf(String.prototype, {
    trim: function(){
      return $.trim(this);
    },
    lenB: function(){
      return this.replace(/[^\x00-\xff]/g, '**').length;
    },
    cut: function(len, ext){
      var val = this, cl = 0;
      if (val.lenB() <= len) {
        return val;
      }
      for (var i = 0, j = val.length; i < j; i++) {
        var code = val.charCodeAt(i);
        if (code < 0 || code > 255) {
          cl += 2
        } else {
          cl++
        }
        if (cl > len) {
          return val.substr(0, i == 0 ? i = 1 : i) + (ext || '');
        }
      }
      return '';
    }
  });
  
  /**
   * Fix Number.toFixed Function for MONEY calculate
   */
  if (!((0.009).toFixed(2) === '0.01' && (0.495).toFixed(2) === '0.50')) {
    var toFixed = Number.prototype.toFixed;
    Number.prototype.toFixed = function(fractionDigits){
      var tmp = this, pre = Math.pow(10, fractionDigits || 0);
      tmp *= pre;
      tmp = Math.round(tmp);
      tmp /= pre;
      return toFixed.call(tmp, fractionDigits);
    };
  }
  /**
   * Class extend it have event feature
   * @author qijun.weiqj 2011.01.21
   */
  $.EventTarget = {};
  $each(['bind', 'trigger', 'triggerHandler'], function(){
    var name = this;
    $.EventTarget[name] = function(){
      var proxy;
      proxy = this.__eventTargetProxy = this.__eventTargetProxy || $('<div>');
      return proxy[name].apply(proxy, arguments);
    };
  });
  
  /**
   * Seed!!
   */
  var doc = document, $util = $.util, cssLinks = {}, modules = {};
  $.extend({
    /**
     * Generates a link node
     * @method loadCSS
     * @version Denis 2012.05.07 参考seajs实现css文件动态载入回调
     * @static
     * @param {string} href the href for the css file.
     * @param {object} attributes optional attributes collection to apply to the new node.
     * @param {function} Callback Function for onloaded
     * @return {HTMLElement} the generated node.
     */
    loadCSS: function(href, attr, callback){
      // Inspired by code by Andrea Giammarchi
      // http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
      var head = doc.getElementsByTagName('head')[0] || doc.documentElement, base = head.getElementsByTagName('base'), link = cssLinks[href], isLoaded;
      if ($.isFunction(attr)) {
        callback = attr;
        attr = undefined;
      }
      //if Exist
      if (link) {
        callback && callback();
      } else {
        link = doc.createElement('link');
        var o = {
          type: 'text/css',
          rel: 'stylesheet',
          media: 'screen',
          href: href
        };
        if ($.isPlainObject(attr)) {
          $.extend(o, attr);
        }
        
        for (var p in o) {
          link.setAttribute(p, o[p]);
        }
        cssLinks[href] = link;
        
        callback && styleOnload(link, callback);
      }
      
      // Use insertBefore instead of appendChild to circumvent an IE6 bug.
      // This arises when a base node is used (#2709).
      // return link self
      return base.length ? head.insertBefore(link, base[0]) : head.appendChild(link);
      
      /**
       *
       * @param {Object} node
       * @param {Object} callback
       */
      function styleOnload(node, callback){
      
        // for IE6-9 and Opera
        if (node.attachEvent) {
          node.attachEvent('onload', callback);
          // NOTICE:
          // 1. "onload" will be fired in IE6-9 when the file is 404, but in
          // this situation, Opera does nothing, so fallback to timeout.
          // 2. "onerror" doesn't fire in any browsers!
        } else { // Polling for Firefox, Chrome, Safari
          setTimeout(function(){
            poll(node, callback);
          }, 0); // Begin after node insertion
        }
        
      }
      
      /**
       *
       * @param {Object} node
       * @param {Object} callback
       */
      function poll(node, callback){
        if ($.browser.webkit) {
          if (node['sheet']) {
            isLoaded = true;
          }
        } else if (node['sheet']) { // for Firefox
          try {
            if (node['sheet'].cssRules) {
              isLoaded = true;
            }
          } catch (ex) {
            // NS_ERROR_DOM_SECURITY_ERR
            if (ex.name === 'SecurityError' || // firefox >= 13.0
                ex.name === 'NS_ERROR_DOM_SECURITY_ERR') { // old firefox
              isLoaded = true;
            }
          }
        }
        
        setTimeout(function(){
          if (isLoaded) {
            // Place callback in here due to giving time for style rendering.
            callback();
          } else {
            poll(node, callback);
          }
        }, 0);
      }
    },
    /**
     * Remove a link node
     * @method unloadCSS
     * @static
     * @param {string} href the href for the css file.
     * @return {Bolean} remove success.
     */
    unloadCSS: function(href){
      var link = cssLinks[href];
      if (link) {
        link.parentNode.removeChild(link);
        delete cssLinks[href];
        return true;
      } else {
        return false;
      }
    },
    /**
     * Add Module
     * @method add
     * @static
     * @param  {string|array} names new module(s) name.
     * @param  {function} callback call when added this module.
     * @param  {object} configs module configs.
     */
    add: function(names, callback, configs){
      names = ($isArray(names) ? names : names.replace(/\s+/g, '').split(','));
      if ($.isPlainObject(callback)) {
        configs = callback;
        callback = undefined;
      }
      for (var i = 0, len = names.length; i < len; i++) {
        var name = names[i], o = modules[name];
        if (o) {
          if (!configs) {
            //$.log('Exist Module ' + name);
            o.status = 'ready';
          }
        } else {
          modules[name] = $.extendIf(configs ||
          {
            status: 'ready'
          }, {
            ver: '1.0'
          });
          //$.log('Module ' + name + ' added!');
        }
      }
      //callback 
      if ($isFunction(callback)) {
        callback();
      }
    },
    /**
     * Use Modules
     * @method use
     * @static
     * @param  {string|array} names module(s) name(s).
     * @param  {function} callback call when use this module succesfully.
     * @param	{bolean|object} extend default configs
     */
    use: function(names, callback, options){
      var deferred = jQuery.Deferred();
      names = ($isArray(names) ? names : $.unique(names.replace(/\s+/g, '').split(',')));
      var count = 0;
      
      if ($.type(callback) === 'boolean' || $.type(callback) === 'object') {
        options = callback;
        callback = undefined;
      }
      $each(names, function(i, name){
        var configs = modules[name];
        if (configs) {
          //只有是数据模块，且当用户更改配置，且队列中没有回调函数时。更新配置、刷新数据
          if (options && configs.url) {
            if (typeof options === 'boolean') {
              options = {};
            }
            $.extend(configs, options, {
              status: configs.callbackQueue ? 'refresh' : 'reset'
            });
          }
          if (configs.status === 'ready') {
            //TODO:
            through(configs._data);
          } else {
            if (options) {
              $.extend(configs, options);
            }
            if (configs.requires) {
              $.use(configs.requires, function(){
                init(name, through, deferred);
              });
            } else {
              init(name, through, deferred);
            }
          }
        } else {
          $.error('Invalid Module ' + name);
        }
      });
      function through(data){
        count++;
        if (names.length === count) {
          if ($isFunction(callback)) {
            callback(data);
          }
          deferred.resolve(data);
        }
      }
      return deferred.promise();
    }
    /**
     * 判断模块是否已经存在
     * @param {Object} name
     */
    //        has: function(name){
    //            return !!modules[name];
    //        }
    /**
     * Remove Module
     * @method remove
     * @static
     * @param  {string} name module name.
     * @param  {function} callback call when module is removed.
     */
    //暂时用不到此方法，需要时再加上		
    //        remove: function(name, callback){
    //            if (modules[name]) {
    //                var css = modules[name].configs.css;
    //                if ($isArray(css)) {
    //                    $each(css, function(i, href){
    //                        $.unloadCSS(href);
    //                    });
    //                }
    //                return true;
    //            }
    //            return false;
    //        }
  });
  /**
   * init single module
   * @method init
   * @private
   * @param  {name} module name.
   * @param  {function} callback callback.
   * @param  {object} jQuery Deferred对象
   */
  function init(name, callback, deferred){
    var configs = modules[name], url = configs.url, css = configs.css, js = configs.js;
    //load module's JS
    //2011.05.27 增加了Data Module类型的数据模块加载
    if (url || $isArray(js) || $isArray(css)) {
      configs.callbackQueue = configs.callbackQueue || [];
      configs.callbackQueue[configs.callbackQueue.length] = callback;
      if (configs.callbackQueue.length === 1 || configs.status === 'refresh') {
        //$.log('Module ' + name + ' is loading');
        var len = 1, q = 0, onSuccess = function(data){
          q++;
          if (data) {
            configs._data = data;
          }
          if (q === len) {
            configs.status = 'ready';
            $each(configs.callbackQueue, function(i, callback){
              callback(data);
            });
            delete configs.callbackQueue;
          }
        }, onError = function(jqXHR, textStatus){
          deferred.reject();
          //                    $.log(textStatus);
          //                    switch(textStatus){
          //                        case 'abort':
          //                            break;
          //                        default:
          //                            $.error('load Module ' + name + ' Fail;');
          //                            break;
          //                    }
        }, onComplete = function(){
          delete configs.jqxhr;
        };
        //终止原有的ajax
        if (url) {
          configs.jqxhr && configs.jqxhr.abort();
          configs.jqxhr = $.ajax($.extendIf({
            global: false,
            success: onSuccess,
            error: configs.error || onError,
            complete: onComplete
          }, configs));
        } else {
          js = js || [];
          css = css || [];
          len = js.length + css.length;
          //load module's CSS
          $each(css, function(i, href){
            href = $util.substitute(href, [$.styleDomain, configs.ver]);
            $.loadCSS(href, onSuccess);
          });
          //load module's JS
          $each(js, function(i, src){
            src = $util.substitute(src, [$.styleDomain, configs.ver]);
            if ($.DEBUG) {
              src = src.replace('-min', '');
            }
            $.ajax(src, {
              global: false,
              dataType: 'script',
              scriptCharset: 'gbk',
              cache: true,
              success: onSuccess,
              error: onError
            });
          });
        }
      }
    } else {
      callback(configs._data);
    }
  }
})(jQuery);
/**
 * Baseed on gears
 * @Author: Denis 2011.01.31
 * @update: Denis 2011.07.22	优化对JSON模块的利用
 * @update: Denis 2011.11.18    优化用户状态获取方式
 * @update: Denis 2011.12.14    提供figo配置的占位
 * @update: Denis 2012.02.06    对不支持console的浏览器，提供console.info和console.log的定义
 * @update: Denis 2012.04.17    提供对jasmine的支持
 * @update: Denis 2012.06.08    用户loginId和lastLoginId都采用UTF8解码
 * @update: qijun.weiqj 2012.07.12 添加FU.getLastMemberId方法，用于从cookie取得lastMemberId, cookie字段last_mid
 * @update: hua.qiuh 2012.08.14 云归项目添加跨站登录信息同步的方法
 */
(function($){
  if (window.FE && FE.sys) {
    return;
  }

  function getTestConfig(key) {
      return FE.test && FE.test[key];
  }

  $.namespace('FE.sys', 'FE.util.jasmine', 'FE.ui');
  
  var FU = FE.util, cookie = $.util.cookie, $support = $.support;
  //当前登录的ID
  FU.LoginId = function(){
    var loginId = cookie('__cn_logon_id__', {
      raw: true
    });
    return loginId && decodeURIComponent(loginId);
  };
  FU.loginId = FU.LoginId();
  //当前是否有登录用户
  FU.IsLogin = function(){
    return (FU.LoginId() ? true : false);
  };
  FU.isLogin = FU.IsLogin();
  //上一次登录的ID
  FU.LastLoginId = function(){
    var lastLoginId = cookie('__last_loginid__', {
      raw: true
    });
    return lastLoginId && decodeURIComponent(lastLoginId);
  };
  FU.lastLoginId = FU.LastLoginId();

  // 取得上一次登录的memberId
  FU.getLastMemberId = function() {
    var lastMemberId = cookie('last_mid', {
      raw: true
    });
    return lastMemberId && decodeURIComponent(lastMemberId);
  };

  /**
   * 从阿里集团的各个网站同步登录信息
   * 打通帐号登录
   * @example FE.util.updateLoginInfo({ source: ['b2b', 'taobao'] })
   */
  FU.updateLoginInfo = function(config) {
      config = $.extend({ source: ['b2b', 'taobao']}, config);

      var dfd = new $.Deferred,
          sources = config.source,
          current = 0;

      tryFromSrc( sources[current] );

      function tryFromSrc( src ) {
          var handler = FU['updateLoginInfoFrom' + src.substr(0,1).toUpperCase() + src.substr(1)];

          if($.type(handler) === 'function') {
              $.when( handler(dfd) ).always(function(){
                  if( FU.IsLogin() ) {
                      dfd.resolve();
                  } else {
                      tryNextSource();
                  }
              });
          } else {
              $.log(src + ' is not a function');
              tryNextSource();
          }
      }

      function tryNextSource() {
          if(++current < sources.length) {
              tryFromSrc( sources[current] );
          } else {
              dfd.resolve();
          }
      }

      return dfd;
  };

  /**
   * 这个方法目前没有做任何判断操作，将来
   * 可能会发起一个jsonp请求，这样在每个不
   * 同域名下面都可以获取在B2B登录的帐号。
   */
  FU.updateLoginInfoFromB2b = function() {
      var dfd = new $.Deferred;
      dfd.resolve();
      return dfd.promise();
  };

  /**
   * 从淘宝同步登录信息
   */
  FU.updateLoginInfoFromTaobao = function() {

      var dfd = new $.Deferred;

      FU.getLoginInfoFromTaobao().always(function(data){

          var name = data['__cn_logon_id__'];
          if(name){
              name = encodeURIComponent(name);

              /**
               * TODO: 框架核心不应该依赖于某一个widget
               *       将util-cookie迁移到框架核心中，代替原来只读的$.util.cookie
               */
              $.use('util-cookie', function(){
                  var cfg = { raw: true };

                  if(/\balibaba\.com$/.test(location.hostname)) {
                      cfg.domain = 'alibaba.com';
                      cfg.path = '/';
                  }

                  $.util.cookie('__cn_logon_id__', name, cfg );
                  $.util.cookie('__last_loginid__', name, $.extend({expires:30}, cfg) );
                  $.util.cookie('__cn_logon__', true, cfg );

                  FU.loginId = name;
                  FU.isLogin = true;

                  dfd.resolve( data );
              });

          } else {
              dfd.resolve( data );
          }

      });

      return dfd.promise();
  }

  FU.getLoginInfoFromTaobao = function() {
      var url = getTestConfig('style.logintaobao.sync.url') || 'http://b2bsync.taobao.com/tbc';
      return $.ajax({
          url: url,
          dataType: 'jsonp'
      }).promise();
  };

  /**
   * 云归项目添加
   * 有些id是系统自动生成的
   */
  FU.isLoginIdAutoGen = function() {
      return /^b2b-.+/.test(FU.LoginId());
  };

  //跳转函数
  /**
   * 新开窗口或者当前窗口打开(默认新开窗口),解决IE下referrer丢失的问题
   * @param {String} url
   * @argument {String} 新开窗口or当前窗口 _self|_blank
   */
  FU.goTo = function(url, target){
    var SELF = '_self';
    target = target || SELF;
    if (!$.util.ua.ie) {
      return window.open(url, target);
    }
    var link = document.createElement('a'), body = document.body;
    link.setAttribute('href', url);
    link.setAttribute('target', target);
    link.style.display = 'none';
    body.appendChild(link);
    link.click();
    if (target !== SELF) {
      setTimeout(function(){
        try {
          body.removeChild(link);
        } catch (e) {
        }
      }, 200);
    }
    return;
  };
  
  var FUJ = FU.jasmine, jasmineReady;
  $.extend(FUJ, {
    stack: [],
    add: function(specUrl){
      if (jasmineReady) {
        $.getScript(specUrl);
      } else {
        FUJ.stack.push(specUrl);
      }
    }
  });
  //判断浏览器是否支持JSON，从而注册模块
  if ($support.JSON) {
    $.add('util-json');
  }
  //兼容console
  if (!window.console) {
    window.console = {};
    console.log = console.info = $.log;
  }
  
  $(function(){
    $.DEBUG = /debug=true/i.test(location.search);
    if ($.DEBUG) {
      $.use('util-debug');
    }
    //启用Jasmine测试脚本
    $.JASMINE = /jasmine=true/i.test(location.search);
    if ($.JASMINE) {
      $.add('ext-jasmine-specs', {
        requires: ['ext-jasmine'],
        js: FUJ.stack
      });
      $.use('ext-jasmine-specs', function(){
        $.use('ext-jasmine-html, ext-jasmine-jquery', function(){
          FUJ.Env = jasmine.getEnv();
          var trivialReporter = new jasmine.TrivialReporter();
          
          FUJ.Env.addReporter(trivialReporter);
          FUJ.Env.specFilter = function(spec){
            return trivialReporter.specFilter(spec);
          };
          //$.jasmineEnv.execute();
          jasmineReady = true;
        });
      });
    }
  });
  //figo动态配置项
  FE.test = {};
})(jQuery);
/**
 * Baseed on jQuery Gears
 * @Author: Denis 2011.01.21
 * @update Denis 2011.08.11 移入styleDomain配置
 */
(function($){
    if ($.styleDomain) {
        return;
    }
    var $util = $.util, mudules = {
        'util-achievement': {
            js: ['util/achievement'],
            css: ['util/achievement'],
            ver: '1.0'
        },
        'util-json': {
            js: ['util/json2'],
            ver: '1.0'
        },
        'util-cookie': {
            js: ['util/cookie'],
            ver: '1.1'
        },
        'util-date': {
            js: ['util/date'],
            ver: '1.2'
        },
        'util-debug': {
            js: ['util/debug'],
            ver: '1.0'
        },
        'util-history': {
            js: ['util/history'],
            ver: '1.5.0'
        },
        'util-storage': {
            js: ['util/storage'],
            ver: '1.0'
        },
        'fx-core': {
            js: ['fx/core'],
            ver: '1.8.13'
        },
        'ui-core': {
            js: ['ui/core'],
            ver: '1.1'
        },
        'ui-combobox': {
            requires: ['ui-core'],
            js: ['ui/combobox'],
            css: ['ui/combobox'],
            ver: '1.0'
        },
        'ui-position': {
            js: ['ui/position'],
            ver: '1.8.11'
        },
        'ui-menu': {
            requires: ['ui-core'],
            js: ['ui/menu'],
            ver: '1.8.15'
        },
        'ui-mouse': {
            requires: ['ui-core'],
            js: ['ui/mouse'],
            ver: '1.8.15'
        },
        'ui-autocomplete': {
            requires: ['ui-position', 'ui-menu'],
            js: ['ui/autocomplete'],
            ver: '1.8.15'
        },
        'ui-colorbox': {
            requires: ['ui-core'],
            css: ['ui/colorbox'],
            js: ['ui/colorbox'],
            ver: '1.0'
        },
        'ui-colorpicker': {
            requires: ['ui-mouse'],
            css: ['ui/colorpicker'],
            js: ['ui/colorpicker'],
            ver: '1.0'
        },
        'ui-draggable': {
            requires: ['ui-mouse'],
            js: ['ui/draggable'],
            ver: '1.8.11'
        },
        'ui-droppable': {
            requires: ['ui-draggable'],
            js: ['ui/droppable'],
            ver: '1.8.11'
        },
        'ui-datepicker': {
            requires: ['ui-core'],
            css: ['ui/datepicker'],
            js: ['ui/datepicker'],
            ver: '1.1'
        },
        'ui-datepicker-time': {
            requires: ['ui-datepicker'],
            js: ['ui/datepicker-time'],
            ver: '1.0'
        },
        'ui-dialog': {
            requires: ['ui-core'],
            js: ['ui/dialog'],
            ver: '1.0'
        },
        'ui-flash': {
            requires: ['ui-core'],
            js: ['ui/flash'],
            ver: '1.1'
        },
        'ui-flash-clipboard': {
            requires: ['ui-flash'],
            js: ['ui/flash-clipboard'],
            ver: '1.1'
        },
        'ui-flash-uploader': {
            requires: ['ui-flash'],
            js: ['ui/flash-uploader'],
            css: ['ui/flash-uploader'],
            ver: '1.3'
        },
        'ui-flash-uploader2': {
            requires: ['ui-flash'],
            js: ['ui/flash-uploader2'],
            css: ['ui/flash-uploader'],
            ver: '2.0'
        },
        'ui-flash-chart': {
            requires: ['ui-flash'],
            js: ['ui/flash-chart'],
            ver: '1.2'
        },
        'ui-flash-storage': {
            requires: ['ui-flash'],
            js: ['ui/flash-storage'],
            ver: '1.0'
        },
        'ui-portlets': {
            requires: ['ui-mouse'],
            js: ['ui/portlets'],
            ver: '1.1'
        },
        'ui-progressbar': {
            requires: ['ui-core'],
            js: ['ui/progressbar'],
            ver: '1.8.11'
        },
        'ui-scrollto': {
            js: ['ui/scrollto'],
            ver: '1.4.2'
        },
        'ui-sortable': {
            requires: ['ui-mouse'],
            js: ['ui/sortable'],
            ver: '1.8.12'
        },
        'ui-tabs': {
            requires: ['ui-core'],
            js: ['ui/tabs'],
            ver: '1.3'
        },
        'ui-tabs-effect': {
            requires: ['ui-tabs'],
            js: ['ui/tabs-effect'],
            ver: '1.1'
        },
        'ui-tabs-lazyload': {
            requires: ['ui-tabs'],
            js: ['ui/tabs-lazyload'],
            ver: '1.0'
        },
        'ui-timer': {
            requires: ['ui-core'],
            js: ['ui/timer'],
            ver: '1.2'
        },
        'ui-maglev': {
            requires: ['ui-core'],
            js: ['ui/maglev'],
            ver: '1.0'
        },
        'web-alitalk': {
            css: ['web/alitalk'],
            js: ['web/alitalk'],
            ver: '3.2'
        },
        'web-alitalk-shunt': {
            requires: ['web-alitalk'],
            js: ['web/alitalk-shunt'],
            ver: '1.0'
        },
        'web-pca': {
            js: ['web/pca'],
            ver: '1.0'
        },
        'web-datalazyload': {
            js: ['web/datalazyload'],
            ver: '1.2'
        },
        'web-sweet': {
            js: ['web/sweet'],
            ver: '1.0'
        },
        'web-stylesheet': {
            js: ['web/stylesheet'],
            ver: '1.0'
        },
        'web-suggestion': {
            requires: ['ui-autocomplete'],
            js: ['web/suggestion'],
            css: ['web/suggestion'],
            ver: '1.0'
        },
        'web-valid': {
            js: ['web/valid'],
            ver: '1.0'
        },
        'ext-jasmine': {
            css: ['external/jasmine'],
            js: ['external/jasmine'],
            ver: '1.1'
        },
        'ext-jasmine-html': {
            requires: ['ext-jasmine'],
            js: ['external/jasmine-html'],
            ver: '1.1'
        },
        'ext-jasmine-jquery': {
            requires: ['ext-jasmine'],
            js: ['external/jasmine-jquery'],
            ver: '1.1'
        }
    }, url = 'http://{0}/fdevlib/{t}/fdev-v4/widget/{p}-min.{t}?v={1}';
    //init default mudules
    for (var name in mudules) {
        var configs = mudules[name], js = configs.js, css = configs.css, j, len;
        if (js) {
            for (j = 0, len = js.length; j < len; j++) {
                js[j] = $util.substitute(url, {
                    t: 'js',
                    p: js[j]
                });
            }
        }
        if (css) {
            for (j = 0, len = css.length; j < len; j++) {
                css[j] = $util.substitute(url, {
                    t: 'css',
                    p: css[j]
                });
            }
        }
        $.add(name, configs);
    }
    //2011.8.11 Denis style域名配置
    $.styleDomain = 'style.china.alibaba.com';
})(jQuery);
