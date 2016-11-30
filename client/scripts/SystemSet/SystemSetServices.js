/**
 * Created by Allen.zhang on 2014/8/21.
 */
(function() {
    'use strict';
    angular.module('app.system-set.services', ['ngResource']).factory('commissionLimit',['globalFunction',function(globalFunction){
            return globalFunction.createResource('systemsetting/commissionlimit');//佣金限制

    }]).factory('commonCurrency',['globalFunction',function(globalFunction){
        return globalFunction.createResource('common/commoncurrency');//币种

    }]).factory('smsContent', [
        '$resource', function ($resource) {
            return null;
        }
    ]).factory('smsContent', [
        '$resource', function ($resource) {
            return null;
        }
    ]).factory('usersInfo',['globalFunction',function(globalFunction){
            return globalFunction.createResource('systemsetting/userinfo',{},{
                'updatePassword':{method:'PUT', url:globalFunction.getApiUrl("systemsetting/userinfo/update-password")}
            });

    }]).factory('compContact',['globalFunction',function(globalFunction){
            return globalFunction.createResource('systemsetting/compcontact');

    }]).factory('workstation',['globalFunction',function(globalFunction){
            return globalFunction.createResource('systemsetting/workstation',{},{
                'updatePrinter':{method:'PUT', url:globalFunction.getApiUrl("systemsetting/workstation/update-printer/:id")}
            });

    }]).factory('commissionDivide',['globalFunction',function(globalFunction){//佣金份數
        return globalFunction.createResource('systemsetting/commissiondivide',{},{
            'createValidate':{method:'POST',url:globalFunction.getApiUrl('systemsetting/commissiondivide/create-validate')}
        });

    }]).factory('authitem',['globalFunction',function(globalFunction){//佣金份數
        return globalFunction.createResource('systemsetting/authitem');

    }]).factory('specialAgent',['globalFunction',function(globalFunction){//公司戶口列表
        return globalFunction.createResource('systemsetting/specialagent');

    }]).factory('businessType',['globalFunction',function(globalFunction){//公司戶口列表
        return globalFunction.createResource('systemsetting/businesstype');

    }]).factory('integralType',['globalFunction',function(globalFunction){//積分類型
        return globalFunction.createResource('consumption/integraltype');

    }]).factory('departmentShortcuts',['globalFunction',function(globalFunction){//快捷鍵管理
        return globalFunction.createResource('systemsetting/departmentshortcuts');

    }])

}).call(this);
