/**
 * @fileoverview unit testing for lofty/kernel/alias
 * @author Edgar
 * @build 130321
 * */

describe( 'lofty/kernel/alias', function(){
    
    xdescribe( 'config¹Ø¼üÄ£¿é', function(){
        it( 'alias', function(){
            var a;
            
            define('specs/kernel/module/n', function(){
                return 'specs-kernel-module-n';
            });
            
            define(['config'], function(config){
                config({
                    alias: {
                        'utconfiga': 'specs/kernel/module/n'
                    }
                });
            });
            
            define(['utconfiga'], function(utconfiga){
                a = utconfiga;
            });
            
            expect(a).toEqual('specs-kernel-module-n');
        } );
    } );
    
} );
