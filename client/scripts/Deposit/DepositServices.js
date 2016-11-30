/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.deposit.services',['ngResource']).factory('depositCard',['globalFunction',function(globalFunction){ //通知信息綁定 通知類型
        return globalFunction.createResource('deposit/depositcard',{}, {
            'transaction': {method: 'POST', url: globalFunction.getApiUrl('deposit/depositcard/transaction')},
            'statisticSum': {method: 'GET', url: globalFunction.getApiUrl('deposit/depositcard/statistic-sum')},
            'UpdatePrintPosition':{method:'PUT',url:globalFunction.getApiUrl('deposit/depositcard/update-print-position/:id')},
            'cardList': {method: 'GET', url: globalFunction.getApiUrl('deposit/depositcard/card-list'),isArray:true},
            'sendDepositCardSms': {method: 'POST', url: globalFunction.getApiUrl('deposit/depositcard/send-deposit-card-sms')}

        });
    }]).factory('depositCardRecord',['globalFunction',function(globalFunction){ //通知信息綁定 通知類型
        return globalFunction.createResource('deposit/depositcardrecord');
    }]).factory('depositTicket',['globalFunction',function(globalFunction){
        return globalFunction.createResource('deposit/depositticket',{},{
            'depositticketSum': {method: 'GET', url: globalFunction.getApiUrl('deposit/depositticket/depositticket-sum')},
            'sendDepositTicketSms': {method: 'POST', url: globalFunction.getApiUrl('deposit/depositticket/send-deposit-ticket-sms')}
        });
    }]).factory('depositTicketRecord',['globalFunction',function(globalFunction){ //通知信息綁定 通知類型
            return globalFunction.createResource('deposit/depositticketrecord');
        }]);
}).call(this);