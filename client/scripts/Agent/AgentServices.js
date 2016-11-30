/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.agent.services',['ngResource']).factory('agentsLists',['globalFunction',function(globalFunction){
        return globalFunction.createResource('agent/agent',{},{
            'agentInfoList':{method:'GET',url:globalFunction.getApiUrl('agent/agent/agent-info-list'),isArray:true},
            'localValidate':{method:'GET',url:globalFunction.getApiUrl('agent/agent/local-validate')},
            'agentAssistantList':{method:'GET',url:globalFunction.getApiUrl('agent/agent/agent-assistant-list'),isArray:true},
            'agentGuestList':{method:'GET',url:globalFunction.getApiUrl('agent/agent/agent-guest-list'),isArray:true},
            'createValidate':{method:'POST',url:globalFunction.getApiUrl('agent/agent/create-validate')},
            'agentSmsNotice':{method:'GET',url:globalFunction.getApiUrl('agent/agent/agent-sms-notice'),isArray:true},
            'usedAgent':{method:'GET',url:globalFunction.getApiUrl('agent/agent/used-agent'),isArray:true},
            'updateSettlementType':{method:'POST',url:globalFunction.getApiUrl('agent/agent/update-settlement-type')},
            'agentLevelTel':{method:'GET',url:globalFunction.getApiUrl('agent/agent/agent-level-tel'),isArray:true},
            'setPassword':{method:'PUT',url:globalFunction.getApiUrl('agent/agent/set-password')},
            'requestPassword':{method:'GET',url:globalFunction.getApiUrl('agent/agent/request-password')},
            'unlock':{method:'POST',url:globalFunction.getApiUrl('agent/agent/unlock')},
            'makeCall':{method:'GET',url:globalFunction.getApiUrl('agent/agent/make-call')},
            'getAgentByTelephoneNumber':{method:'GET',url:globalFunction.getApiUrl('agent/agent/get-agent-by-telephone-number'),isArray:true},
            'agentBirthDay':{method:'GET',url:globalFunction.getApiUrl('agent/agent/agent-birth-day'),isArray:true},
            'agentBirthdayList':{method:'GET',url:globalFunction.getApiUrl('agent/agent/agent-birthday-list'),isArray:true},
            'birthdaySms':{method:'POST',url:globalFunction.getApiUrl('agent/agent/birthday-sms')},
            'getSmsPhoneNumbers':{method:'GET',url:globalFunction.getApiUrl('agent/agent/get-sms-phone-numbers'),isArray:true}
        });
    }]).factory('agentsValidate',['globalFunction',function(globalFunction){
        return globalFunction.createResource('agent/agent/validate-agent-code');
    }]).factory('xcverify',['globalFunction',function(globalFunction){
        return globalFunction.createResource('agent/local-validate');
    }]).factory('agentHobby',['globalFunction',function(globalFunction){
        return globalFunction.createResource('agent/agenthobby');
    }]).factory('agentValidateRecord',['globalFunction',function(globalFunction){
        return globalFunction.createResource('agent/agentvalidaterecord',{},{
            'getRecord':{method:'GET',url:globalFunction.getApiUrl('agent/agentvalidaterecord/get-record'),isArray:true}
        });
    }]).factory('agentGuestTel',['globalFunction',function(globalFunction){
        return globalFunction.createResource('agent/agentguesttel');
    }]).factory('agentCompcontact',['globalFunction',function(globalFunction){
        return globalFunction.createResource('agent/compcontact');
    }]).factory('refagentcontacttypes',['globalFunction',function(globalFunction){
        return globalFunction.createResource('agent/refagentcontacttype',{},{
            'setPassword':{method:'PUT',url:globalFunction.getApiUrl('agent/refagentcontacttype/set-password')}
        });
    }]).factory('agentRemark',['globalFunction',function(globalFunction){
        return globalFunction.createResource('agent/agentremark',{},{
            'agentRemarkUpdate':{method:'PUT',url:globalFunction.getApiUrl('agent/agentremark/update-quota-remark'),isArray:true},
            'agentRemarkCreate':{method:'POST',url:globalFunction.getApiUrl('agent/agentremark/create-quota-remark'),isArray:true}
        });
    }]).factory('agentTotal',['globalFunction',function(globalFunction){
        return globalFunction.createResource('agent/agenttotal',{},{
            'agentTotalList':{method:'GET',url:globalFunction.getApiUrl('agent/agenttotal/agent-total-list'),isArray:true},
            'agentCommissionDetail':{method:'GET',url:globalFunction.getApiUrl('agent/agenttotal/agent-commission-detail')}
        });
    }]).factory('agentGroup',['globalFunction',function(globalFunction){
        return globalFunction.createResource('agent/agentgroup');
    }]).factory('refAgentGroupType',['globalFunction',function(globalFunction){
        return globalFunction.createResource('agent/refagentgrouptype',{},{
            'getAgentGroupMembers':{method:'GET',url:globalFunction.getApiUrl('agent/refagentgrouptype/get-agent-group-members'),isArray:true}
        });
    }]).factory('agentContact',['globalFunction',function(globalFunction){
        return globalFunction.createResource('agent/agentcontact');
    }]).factory('agentOrders',['globalFunction',function(globalFunction){
        return globalFunction.createResource('agent/agentorder',{},{
            'agentOrderLists':{method:'GET',url:globalFunction.getApiUrl('agent/agentorder/agent-order-list'),isArray:true}
        });
    }]).factory('agentOrderType',['globalFunction',function(globalFunction){
        return globalFunction.createResource('common/agentordertype');
    }]).factory('agentModule',['globalFunction',function(globalFunction){
        return globalFunction.createResource('agent/module');
    }]).factory('contactPrivilege',['globalFunction',function(globalFunction){
        return globalFunction.createResource('common/contactprivilege');
    }]).factory('refTelAgent',['globalFunction',function(globalFunction){ //綁定短信通知人列表
        return globalFunction.createResource('agent/reftelagent',{},{
            'CreateSmsBindGroup':{method:'POST',url:globalFunction.getApiUrl('agent/reftelagent/create-sms-bind-group')},
            'UpdateSmsBindGroup':{method:'PUT',url:globalFunction.getApiUrl('agent/reftelagent/update-sms-bind-group')},
            'AgentNotices':{method:'GET',url:globalFunction.getApiUrl('agent/reftelagent/agent-notices'),isArray:true},
            'RefTelAgents':{method:'GET',url:globalFunction.getApiUrl('agent/reftelagent/ref-tel-agents'),isArray:true}
        });
    }]).factory('smsnoticeType',['globalFunction',function(globalFunction){ //通知信息綁定 通知類型
         return globalFunction.createResource('agent/smsnoticetype');
    }]).factory('agentGuest',['globalFunction',function(globalFunction){ //通知信息綁定 通知類型
            return globalFunction.createResource('agent/agentguest');
    }]).factory('hallTotal',['globalFunction',function(globalFunction){ //頭部，即時匯總
        return globalFunction.createResource('common/halltotal');
    }]).factory('hallTotalMonthly',['globalFunction',function(globalFunction){ //頭部，即時匯總
        return globalFunction.createResource('common/halltotalmonthly');
    }]).factory('agentreMarkOperation',['globalFunction',function(globalFunction){
        return globalFunction.createResource('agent/agentremarkoperation');
    }]).factory('smsBirthDay',['globalFunction',function(globalFunction){
        return globalFunction.createResource('sms/smsbirthday',{},{
            'sendBirthDaySms':{method:'POST',url:globalFunction.getApiUrl('sms/smsbirthday/send-birth-day-sms')}
        });
    }]);

}).call(this);