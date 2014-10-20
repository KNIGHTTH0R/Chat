angular.module('starter.services', [])
/**
 * A simple example service that returns some data AND set some.
 */
.service('sharedProperties', function () {

    var hashtable = []; //{0: 'val0', 1: 'val#1', 2: 'vaçl2'};

    return {
        setValue: function (key, value, file) {
            hashtable.push( {id:key, title: value, url: file} ) ;
        },
        getValue: function (key) {
            return hashtable[key];
        },
        getAll: function (key) {
            return hashtable;
        },
        setAll: function (allRooms) {
             hashtable = allRooms;
        }
    }
})

;