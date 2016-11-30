/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.transfer.services',['ngResource']).factory('transfer',['globalFunction',function(globalFunction){
        return globalFunction.createResource('deposit/transfer');
    }])
}).call(this);