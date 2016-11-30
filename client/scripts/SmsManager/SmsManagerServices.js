/**
 * Created by Allen.zhang on 2014/8/21.
 */
(function() {
    'use strict';
    angular.module('app.sms-manager.services', ['ngResource']).factory('smsGroup',[
        'globalFunction',function(globalFunction){ //短信群組
            return globalFunction.createResource('sms/smsgroup');
        }
    ]).factory('smsTepartments',[
            'globalFunction',function(globalFunction){ //短信模板
                return globalFunction.createResource('sms/smstemplate');
            }
    ]).factory('smsRecord',[
            'globalFunction',function(globalFunction){ //短信模板,发送普通短信
                return globalFunction.createResource('sms/smsrecord',{},{
                    'smsGroup': {method:'POST', url:globalFunction.getApiUrl('sms/smsrecord/sms-group')}, //發送戶組短信
                    'groupTel': {method:'GET', url:globalFunction.getApiUrl('sms/smsrecord/group-tel'),isArray:true}, //戶組下成員號碼
                    'smsTotal':{method:'GET',url:globalFunction.getApiUrl('sms/smsrecord/sms-total'),isArray:true},
                    'smsDraft': {method:'POST', url:globalFunction.getApiUrl('sms/smsrecord/sms-draft')}, //保存草稿箱
                    'multiSms': {method:'POST', url:globalFunction.getApiUrl('sms/smsrecord/multi-sms')},  //批量發送
                    'reSend': {method:'POST', url:globalFunction.getApiUrl('sms/smsrecord/re-send')}  //批量發送


                });
        }
    ])
}).call(this);
