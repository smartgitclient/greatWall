/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.rolling-transfer.services',['ngResource']).factory('rollingCardRecord',['globalFunction',function(globalFunction){
        return globalFunction.createResource('rolling/rollingcardrecord');
    }]).factory('rollingCardTransfer',['globalFunction',function(globalFunction){ //hotel records
        return globalFunction.createResource('rolling/rollingcardtransfer');
    }]).factory('rollingCardTransfer',['globalFunction',function(globalFunction){ //轉碼記錄流量轉移
            return globalFunction.createResource('rolling/rollingcardtransfer');
    }]).factory('rollingCardRecordRecordTotal',['globalFunction',function(globalFunction){ //hotel records
        return globalFunction.createResource('rolling/rollingcardrecord/record-total');
    }])

}).call(this);