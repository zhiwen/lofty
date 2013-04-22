/**
 * @module lofty/kernel/appframe
 * @author Edgar <mail@edgarhoo.net>
 * @version v0.1
 * @date 130421
 * */


lofty( 'appframe', ['global','event','config'],
    function( global, event, config ){
    'use strict';
    
    this.appframe = function( name ){
        
        var frame = global[name] = {
            define: this.define,
            log: this.log,
            config: this.config,
            on: event.on,
            off: event.off
        },
        
        cfg = frame.config;
        
        cfg.addRule = config.addRule;
        cfg.addItem = config.addItem;
    };
    
} );
