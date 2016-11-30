/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.commission-calculate.services',['ngResource']).factory('commissionRecordDifference',['globalFunction',function(globalFunction){
        return globalFunction.createResource('commission/commissionrecorddifference');
    }]).factory('commissionMonth',['globalFunction',function(globalFunction){
        return globalFunction.createResource('commission/commissionmonth');
    }]).factory('commissionRecordDivide',['globalFunction',function(globalFunction){
            return globalFunction.createResource('commission/commissionrecorddivide');
     }])
}).call(this);