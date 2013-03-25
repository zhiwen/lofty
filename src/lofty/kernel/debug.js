/**
 * @module lofty/kernel/debug
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130325
 * */


lofty( 'debug', ['global','config','console','request','require'],
    function( global, config, console, request, require ){
    'use strict';
    
    var _this = this;
    
    var noop = this.log = function(){};
    
    var createLog = function( isDebug ){
        _this.log = isDebug ? ( global.console ? function( message, level ){
            level = level || 'log';
            global.console[level]( message );
        } : function( message, level ){
            if ( console ){
                console( message, level );
            } else if ( request ) {
                request( 'lofty/kernel/console', function(){
                    console || ( console = require('console') );
                    console( message, level );
                } );
            }
        } ) : noop;
    };
    
    config.addRule( 'debug', function( target, key, val ){
        createLog( val );
        this[key] = val;
        return true;
    } )
    .addRuleKey( 'debug', 'debug' );
    
} );
