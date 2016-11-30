/**
 * Created by dell on 2015/7/1.
 */
(function(){

    "use strict";

    angular.module('app.oldData.services',['ngResource']).factory('oldRollingRecord',['globalFunction',function(globalFunction){
        return globalFunction.createResource('source/oldrollingrecord',{},{});
    }]).factory('olddepositcardrecord',['globalFunction',function(globalFunction){
        return globalFunction.createResource('source/olddepositcardrecord',{},{});
    }]).factory('oldconsumption',['globalFunction',function(globalFunction){
        return globalFunction.createResource('source/oldconsumption',{},{});
    }]).factory('oldDeposiTticketRecord',['globalFunction',function(globalFunction){
        return globalFunction.createResource('source/olddepositticketrecord',{},{});
    }]).factory('oldSceneShiftRecord',['globalFunction',function(globalFunction){
        return globalFunction.createResource('source/oldsceneshiftrecord',{},{});
    }]).factory('oldSceneRecord',['globalFunction',function(globalFunction){
        return globalFunction.createResource('source/oldscenerecord',{},{});
    }]).factory('oldshiftRecordMonthly',['globalFunction',function(globalFunction){
        return globalFunction.createResource('source/oldshiftrecordmonthly',{},{});
    }]).factory('oldBuyChips',['globalFunction',function(globalFunction){
        return globalFunction.createResource('source/oldbuychips',{},{});
    }]).factory('oldShiftRecorDay',['globalFunction',function(globalFunction){
        return globalFunction.createResource('source/oldshiftrecordday',{},{});
    }]).factory('oldCommissionImmediate',['globalFunction',function(globalFunction){
        return globalFunction.createResource('source/oldcommissionimmediate',{},{});
    }]).factory('oldMarkerRecord',['globalFunction',function(globalFunction){
        return globalFunction.createResource('source/oldmarkerrecord',{},{});
    }])

}).call(this);