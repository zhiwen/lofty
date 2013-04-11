define( 'specs/kernel/amd/j1', ['module'], function( module ){
    module.exports = 'j1';
} );

define( 'specs/kernel/amd/j', ['exports','require','specs/kernel/amd/j2'], function( exports, require, J2 ){
    exports.a = require('specs/kernel/amd/j1')+J2+'j';
} );
