/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.integral.services',['ngResource']).factory('agentIntegral',['globalFunction',function(globalFunction){ //通知信息綁定 通知類型
        return globalFunction.createResource('consumption/agentintegral',{},{
            'setIntegral':{method:'POST',url:globalFunction.getApiUrl('consumption/agentintegral/set-integral')},
            'integralAllowance':{method:'GET',url:globalFunction.getApiUrl('consumption/agentintegral/integral-allowance')},
            'getIntegralAgent':{method:'GET',url:globalFunction.getApiUrl('consumption/agentintegral/get-integral-agent') , isArray:true},
            'getIntegralDetail':{method:'GET',url:globalFunction.getApiUrl('consumption/agentintegral/get-integral-detail') , isArray:true},
            'expiredIntegral':{method:'GET',url:globalFunction.getApiUrl('consumption/agentintegral/expired-integral') , isArray:true}
        });
    }]).factory('integralType',['globalFunction',function(globalFunction){ //通知信息綁定 通知類型
        return globalFunction.createResource('consumption/integraltype');
    }]).factory('agentIntegralTransfer',['globalFunction',function(globalFunction){ //通知信息綁定 通知類型
            return globalFunction.createResource('consumption/agentintegraltransfer');
    }])
}).call(this);