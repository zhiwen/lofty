/*
 Lofty v0.1 AIO http://lofty.fangdeng.org/ MIT */
(function(c){if(!c.lofty){var f={},b=function(e,h,g){if(!f[e]){g||(g=h,h=[]);e=f[e]={id:e,deps:h,factory:g};if("function"===typeof e.factory){h=[];g=e.deps;for(var c=0,l=g.length;c<l;c++)h.push(a(g[c]));e.exports=e.factory.apply(b,h)}else e.exports=e.factory;delete e.factory}},a=function(e){return(e=f[e])?e.exports:null};b.version="0.1";b.cache={kernel:f};b("global",c);b("require",function(){return a});c.lofty=b}})(this);
lofty("lang",function(){var c={}.toString,f=Array.prototype,b={isFunction:function(a){return"[object Function]"===c.call(a)},isArray:Array.isArray||function(a){return"[object Array]"===c.call(a)},isString:function(a){return"string"===typeof a},forEach:f.forEach?function(a,e,b){a.forEach(e,b)}:function(a,e,b){for(var g=0,c=a.length;g<c;g++)e.call(b,a[g],g,a)},map:f.map?function(a,e,b){return a.map(e,b)}:function(a,e,c){var g=[];b.forEach(a,function(a,b,m){g.push(e.call(c,a,b,m))});return g},indexOf:f.indexOf?
function(a,e){return a.indexOf(e)}:function(a,e){for(var b=0,g=a.length;b<g;b++)if(a[b]===e)return b;return-1}};return b});lofty("event",function(){var c=this.cache.events={},f=[].slice;return{on:function(b,a){(c[b]||(c[b]=[])).push(a)},emit:function(b){var a=f.call(arguments,1),e=c[b],h,g=0;if(e)for(;h=e[g++];)h.apply(null,a)}}});
lofty("config",["lang"],function(c){var f=this.cache,b=f.config={},a=f.configRules={},f={addRule:function(b,c){a[b]={rule:c,keys:[]};return this},addRuleKey:function(b,c){a[c]&&a[c].keys.push(b);return this}};f.addRule("object",function(b,a,c){if(b){for(var f in c)b[f]=c[f];return!0}return!1}).addRule("array",function(b,a,c){b?b.push(c):this[a]=[c];return!0});this.config=function(e){for(var f in e){var g=e[f],j=b[f],l=f,m=g,k=!1,d=void 0,n=void 0;for(n in a)if(k)break;else d=a[n],k=-1<c.indexOf(d.keys,
l)&&d.rule.call(b,j,l,m);k||(b[f]=g)}};return f});lofty("alias",["config","event"],function(c,f){var b=this.cache.config;c.addRuleKey("alias","object");return function(a){var c=b.alias,h;if(c&&(h=c[a.id]))a.id=h;f.emit("alias",a)}});
lofty("module",["global","lang","event","alias"],function(c,f,b,a){var e=[],h=0,g=this.cache.modules={},j={get:function(d){d={id:d};a(d);return g[d.id]},has:function(d){return j.get(d)||m[d]?!0:!1},hasDefine:function(d){return g[d]?!0:!1},isAnon:function(d){return""===d.id},save:function(d){g[d._id||d.id]=d},autocompile:function(d){j.isAnon(d)&&j.compile(d)},compile:function(d){try{if(f.isFunction(d.factory)){var c=[],a=d.deps;f.isArray(a)&&f.forEach(a,function(b){var a;b=(a=m[b])?a(d):j.require(b,
d);c.push(b)});var e=d.factory.apply(null,c);void 0!==e?d.exports=e:d.entity&&(d.exports=d.entity.exports);d.entity&&delete d.entity}else void 0!==d.factory&&(d.exports=d.factory);b.emit("compiled",d)}catch(g){b.emit("compileFail",g,d)}},require:function(d){var a=j.get(d);a?(a.visits||(a.visits++,j.compile(a)),b.emit("required",a),d=a.exports):(b.emit("requireFail",{id:d}),d=null);return d}},l=function(d,b,a){this.id=d;this.deps=b||[];this.factory=a;this.exports={};this.visits=0;""===d&&(d="__!_lofty_anonymous_"+
h,h++,this._id=d)},m={require:function(){function d(d){return j.require(d)}b.emit("makeRequire",d);return d},exports:function(d){return d.exports},module:function(d){d.entity={id:d.id,exports:d.exports};return d.entity}},k=c.define;this.noConflict=function(){c.define=k};this.define=function(d,a,c){var g;g=arguments.length;1===g?(c=d,d=""):2===g&&(c=a,a=e,f.isString(d)||(a=d,d=""));if(j.hasDefine(d))return b.emit("existed",{id:d}),null;g=new l(d,a,c);b.emit("define",g);j.save(g);j.autocompile(g)};
c.define=this.define;return j});
lofty("loader",["global"],function(c){var f=this.cache.config,b=c.document,a=/\.css(?:\?|$)/,e=/loaded|complete|undefined/,h=536>1*c.navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/,"$1"),g=b&&(b.head||b.getElementsByTagName("head")[0]||b.documentElement),j=b.getElementsByTagName("base")[0],l=function(a,b){a.onerror=function(){a.onload=a.onreadystatechange=a.onerror=null;a=void 0;b&&b()}};return function(m,k){var d;if(a.test(m)){var n=d=b.createElement("link");if(h||!("onload"in n)){var q=b.createElement("img");
q.onerror=function(){k();q.onerror=null;q=void 0};q.src=m}else n.onload=n.onreadystatechange=function(){e.test(n.readyState)&&(n.onload=n.onreadystatechange=n.onerror=null,n=void 0,k&&k())},l(n,k);d.rel="stylesheet";d.href=m}else{var p=d=b.createElement("script");p.onload=p.onreadystatechange=function(d){d=d||c.event;if("load"===d.type||e.test(p.readyState))p.onload=p.onreadystatechange=p.onerror=null,f.debug||g.removeChild(p),p=void 0,k&&k()};l(p,k);d.async=!0;d.src=m}f.charset&&(d.charset=f.charset);
j?g.insertBefore(d,j):g.appendChild(d)}});
lofty("id2url",["global","event","config","alias"],function(c,f,b,a){var e=this.cache.config,h=/\?|\.(?:css|js)$|\/$/,g=/^https?:\/\//,j=(new Date).getTime();c=c.document.getElementsByTagName("script");c=c[c.length-1];c=(c.hasAttribute?c.src:c.getAttribute("src",4)).match(/([\w]+)\:\/\/([\w|\.|\:]+)\//i);e.baseUrl=c[0];b.addRuleKey("resolve","array").addRuleKey("stamp","object");return function(b){a(b);var c=e.resolve,k;if(c)for(var d=0,n=c.length;d<n&&!(k=c[d](b.id),k!==b.id);d++);b.url=k?k:b.id;
g.test(b.url)||(b.url=e.baseUrl+b.url);!h.test(b.url)&&(b.url+=".js");c=e.hasStamp?j:null;(k=e.stamp)&&k[b.id]&&(c=k[b.id]);c&&(b.url+="?lofty.stamp="+c);f.emit("id2url",b)}});
lofty("request",["global","event","loader","id2url"],function(c,f,b,a){var e=this.cache,h=e.config,g=e.assets={};h.loadTimeout=1E4;var j=function(b,a){if(!b.timeout){c.clearTimeout(b.timer);var g,d;a?(b.status=2,d=b.callQueue):(b.status=-1,d=b.errorQueue);for(;g=d.shift();)g()}};return function(c,e,k){var d;c={id:c};a(c);d=g[c.url]||(g[c.url]=c);2===d.status?e&&e():(d.callQueue?d.callQueue.push(e):d.callQueue=[e],d.errorQueue?d.errorQueue.push(k):d.errorQueue=[k],1!==d.status&&(d.status=1,d.timer=
setTimeout(function(){d.timeout=!0;j(d,!1);f.emit("requestTimeout",d)},h.loadTimeout),b(d.url,function(){j(d,!0)})))}});
lofty("deferred",function(){var c=function(){},f=function(b){var a=this,e=[],f=0,g=0;b=b||1;var j=function(){a.then=!g?function(b){b&&b()}:function(b,a){a&&a()};j=c;l(!g?0:1);l=c;e=[]},l=function(b){for(var a,d=0;a=e[d++];)(a=a[b])&&a()};this.then=function(b,a){e.push([b,a])};this.resolve=function(){f++;f+g===b&&j()};this.reject=function(){g++;f+g===b&&j()}};return function(){for(var b=new f(arguments.length),a,c=0;a=arguments[c++];)a(b);return b}});
lofty("use",["lang","event","module","request","deferred"],function(c,f,b,a,e){var h={realize:function(a,e){c.isArray(a)||(a=[a]);h.load(a,function(){var f=c.map(a,function(a){return b.require(a)});e&&e.apply(null,f)})},load:function(a,e){var f=[];c.forEach(a,function(a){b.has(a)||f.push(a)});f.length?h.fetch(f,e):e()},fetch:function(a,f){h.get(a,function(){e.apply(null,c.map(a,function(a){return function(c){var e=b.get(a);e?h.load(e.deps,function(){c.resolve()}):c.resolve()}})).then(f)})},get:function(g,
f,h){e.apply(null,c.map(g,function(c){return function(e){b.has(c)?e.resolve():a(c,function(){e.resolve()},function(){e.reject()})}})).then(f,h)}};f.on("makeRequire",function(a){a.use=function(a,b,c){h.realize(a,b,c)}});return h});lofty("amd",["module","use"],function(c,f){var b=this.cache.config;b.amd=!0;c.autocompile=function(a){c.isAnon(a)&&(b.amd?f.load(a.deps,function(){c.compile(a)}):c.compile(a))}});
lofty("debug",["global","config","console","request","require"],function(c,f,b,a,e){var h=this,g=this.log=function(){};f.addRule("debug",function(f,l,m){h.log=m?c.console?function(a,b){c.console[b||"log"](a)}:function(c,d){b?b(c,d):a&&a("lofty/kernel/console",function(){b||(b=e("console"));b(c,d)})}:g;this[l]=m;return!0}).addRuleKey("debug","debug")});
lofty("alicn",["global","event"],function(c,f){var b=/\.css(?:\?|$)/;this.config({hasStamp:!0,resolve:function(a){var c=a.split("/"),f=c[0],g=b.test(a)?"css/":"js/";switch(f){case "lofty":case "makeup":a="/fdevlib/"+g+a;break;case "sys":a="/sys/"+g+c.slice(1).join("/")}return a},debug:function(){var a=!1;0<c.location.href.indexOf("lofty.debug=true")&&(a=!0);return a}()});this.appframe=function(a){c[a]={log:this.log,define:this.define,on:f.on}}});
