/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.cross-trans.services',['ngResource']).service('newAgent',function($resource){
        this.data = null;
    }).factory('crossTransfer',['globalFunction',function(globalFunction){ //通知信息綁定 通知類型
        return globalFunction.createResource('deposit/crosstransfer',{},{
                'handle':{method:'POST',url:globalFunction.getApiUrl('deposit/crosstransfer/handle')},
                'sendDepositCardSms': {method: 'POST', url: globalFunction.getApiUrl('deposit/crosstransfer/send-cross-transfer-sms')}
            });
    }]);
}).call(this);
