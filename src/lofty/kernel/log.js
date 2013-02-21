/**
 * @module lofty/kernel/log
 * @author Edgar Hoo <edgarhoo@gmail.com>
 * @version v0.1
 * @date 130216
 * */


    /**
     * Thanks to:
     * http://jquery.glyphix.com/jquery.debug/jquery.debug.js
     * */
    _messageList = [],
    
    _messageBox = null,
    
    _prepared = false,
    
    _createMessage = function( item ){
        var li = doc.createElement('li');
        'warn' === item.type ? li.style.color = 'red' : li.style.color = '#000';
        li.innerHTML = item.message;
        _messageBox.appendChild( li );
    },
    
    _messagePrepare = function(){
        
        ready(function(){
            var box = doc.createElement('div');
            box.id = 'hexjs-debug';
            box.style.margin = '10px 0';
            box.style.border = '1px dashed red';
            box.style.padding = '4px 8px';
            box.style.fontSize = '14px';
            box.style.lineHeight = '1.5';
            box.style.textAlign = 'left';
            doc.body.appendChild( box );
            _messageBox = doc.createElement('ol');
            _messageBox.style.listStyleType = 'decimal';
            box.appendChild( _messageBox );
            forEach( _messageList, function( item ){
                _createMessage( item );
            } );
        });
        
        _prepared = true;
    },
    
    _console = function( message, type ){
        
        var item = {
            'message': message,
            'type': type
        };
        
        !_prepared && _messagePrepare();
        _messageBox ?
            _createMessage( item ) :
            _messageList.push( item );
        
    };
