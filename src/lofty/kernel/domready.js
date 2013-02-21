/**
 * @module lofty/kernel/domready
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130216
 * */


define( 'lofty/kernel/domready', function(){
    
    /**
     * Thanks to:
     * 
     * https://github.com/jquery/jquery/blob/master/src/core.js
     * https://github.com/ded/domready/blob/master/ready.js
     * https://github.com/Cu7l4ss/DomReady-script/blob/master/DomReady.js
     * https://github.com/jakobmattsson/onDomReady/blob/master/ondomready.js
     * https://github.com/blank/domready/blob/master/domready.js
     * https://github.com/jrburke/requirejs/blob/master/domReady.js
     * */
     
    var global = window,
        doc = document,
    
    _isReady = 0,
    
    _isBind = 0,
    
    _readyList = [],
    
    _testEl = doc.documentElement,
    
    _readyInit = function(){
        
        _isReady = 1;

        if ( !doc.body ){
            setTimeout( arguments.callee, 10 );
            return;
        }
        
        for ( var i = 0, l = _readyList.length; i < l; i++ ){
            _readyList[i]();
        }
        
        _readyList = [];
    },
    
    _bindReady = function(){
        
        if ( 'complete' === doc.readyState ){
            _readyInit();
        } else if ( doc.addEventListener ){
            
            var remove = function(){
                doc.removeEventListener( 'DOMContentLoaded', remove, false );
                _readyInit();
            };
            
            doc.addEventListener( 'DOMContentLoaded', remove, false );
            
            global.addEventListener( 'load', _readyInit, false );
        } else if( doc.attachEvent ){
            
            var detach = function(){
                if ( 'complete' === doc.readyState ) {
                    doc.detachEvent( 'onreadystatechange', detach );
                    _readyInit();
                }
            };
            
            // In IE, ensure firing before onload, maybe late but safe also for iframes.
            doc.attachEvent( 'onreadystatechange', detach );
            
            global.attachEvent( 'onload', _readyInit );

            // If IE and not a frame, continually check to see if the doc is ready.
			if ( _testEl.doScroll && global == global.top ) {
				_doScrollCheck();
			}
        }
    },
    
    _doScrollCheck = function(){
        
        if ( _isReady ){
            return;
        }
        
        try {
            // If IE is used, use the trick by Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            _testEl.doScroll( 'left' );
        } catch(e) {
            setTimeout( _doScrollCheck, 1 );
            return;
        }
        
        _readyInit();
        
    },
    
    ready = function( fn ){
        
        _readyList.push( fn );
        
        if ( _isReady ){
            fn();
        } else if ( !_isBind ){
            _isBind = 1;
            _bindReady();
        }
        
    };
    
    return ready;
    
} );
