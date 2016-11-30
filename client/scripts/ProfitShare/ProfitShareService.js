/**
 * Created by admin on 2016/8/9.
 */
(function() {
    'use strict';
    angular.module('app.profit.services',['ngResource'])
        .factory('sceneRecordProfit', ['globalFunction', function(globalFunction){
            return globalFunction.createResource('scene/mainsceneprofit',{},{
                'send_sceneRecordProfit' : {method:'POST', url:globalFunction.getApiUrl('scene/mainsceneprofit')},
                'put_sceneRecordProfit' : {method:'PUT', url:globalFunction.getApiUrl('scene/mainsceneprofit')},
                'delete_sceneRecordProfit' : {method:'POST', url:globalFunction.getApiUrl('scene/mainscene/deleteprint')},
                'printrollback' : {method:'POST', url:globalFunction.getApiUrl('scene/mainscene/printrollback')},
                'updateagent' : {method:'POST', url:globalFunction.getApiUrl('scene/mainsceneprofit/updateagent')},
                'sure' : {method:'POST', url:globalFunction.getApiUrl('scene/mainsceneprofit/sure')},
                'printdelete' : {method:'POST', url:globalFunction.getApiUrl('scene/mainscene/outscene')},
                'printNo' : {method:'GET', url:globalFunction.getApiUrl('scene/mainscene/unique-printno')},
                'sendSms' : {method:'GET', url:globalFunction.getApiUrl('scene/mainsceneprofit/profit-sms')},
                'sendPostSms' : {method:'POST', url:globalFunction.getApiUrl('scene/mainsceneprofit/profit-send-sms')}
            });
        }])
        .factory('sceneRecordRight', ['globalFunction', function(globalFunction){
            return globalFunction.createResource('scene/scenerecord',{},{});
        }])
        .factory('mainSceneProfit', ['globalFunction', function(globalFunction){
            return globalFunction.createResource('scene/mainsceneprofit',{},{});
        }])
        .factory('consumptionProfit', ['globalFunction', function(globalFunction){
            return globalFunction.createResource('consumption/consumption/get-consumption-record',{},{});
        }])

}).call(this);
