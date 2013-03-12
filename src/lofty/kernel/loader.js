/**
 * @module lofty/kernel/loader
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130131
 * */


lofty( 'loader', ['cache','global'], function( cache, global ){
    'use strict';
    
    /**
     * Thanks to:
     * SeaJS, https://github.com/seajs/seajs/blob/master/src/util-request.js
     *        https://github.com/seajs/seajs/blob/master/tests/research/load-js-css/test.html
     *        https://github.com/seajs/seajs/blob/master/tests/research/load-js-css/load-css.html
     * HeadJS, https://github.com/headjs/headjs/blob/master/src/load.js
     * Do, https://github.com/kejun/Do/blob/master/do.js
     * cujo.js, https://github.com/cujojs/curl/blob/master/src/curl.js
     * */
    
    var configCache = cache.config,
        doc = global.document,
        nav = global.navigator;
    
    var rStyle = /\.css(?:\?|$)/,
        rReadyStates = /loaded|complete|undefined/;
        
    var isOldWebKit = ( nav.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/, "$1") ) * 1 < 536;
    
    var head = doc && ( doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement ),
        //getBaseElement = function(){
        //    return doc.getElementsByTagName('base')[0];
        //},
        baseElement = doc.getElementsByTagName('base')[0];
        //todo, testing in ie6 when lofty put before base element
    
    
    var loadAsset = function( url, callback ){
        
        var node;
        
        if ( rStyle.test( url ) ){
            node = doc.createElement('link');
            onLoadStyle( node, url, callback );
            
            node.rel = 'stylesheet';
            node.href = url;
        } else {
            node = doc.createElement('script');
            onLoadScript( node, callback );
            
            node.async = true;
            node.src = url;
        }
        
        if ( configCache.charset ){
            node.charset = configCache.charset;
        }
        
        baseElement ?
            head.insertBefore( node, baseElement ) :
            head.appendChild( node );
        
    },
    
    onLoadStyle = function( node, url, callback ){
        
        if ( isOldWebKit || !( 'onload' in node ) ){
            var img = doc.createElement('img');
            
            img.onerror = function(){
                callback();
                img.onerror = null;
                img = undefined;
            };
            
            img.src = url;
        } else {
            node.onload = node.onreadystatechange = function(){
                if ( rReadyStates.test( node.readyState ) ){
                    node.onload = node.onreadystatechange = node.onerror =  null;
                    node = undefined;
                    callback && callback();
                }
            };
            
            onLoadError( node, callback );
        }
        
    },
    
    onLoadScript = function( node, callback ){
        
        node.onload = node.onreadystatechange = function( event ){
            
            event = event || global.event;
            
            if ( event.type === 'load' || rReadyStates.test( node.readyState ) ){
                
                node.onload = node.onreadystatechange = node.onerror = null;
                
                if ( !configCache.debug ){
                    head.removeChild( node );
                }
                
                node = undefined;
                callback && callback();
            }
        };
        
        onLoadError( node, callback );
        
    },
    
    onLoadError = function( node, callback ){
        
        node.onerror = function(){
            node.onload = node.onreadystatechange = node.onerror = null;
            node = undefined;
            callback && callback();
        };
        
    };
    
    
    return loadAsset;
    
} );
