/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.commission.services',[,'app.services']).factory('commissionRuleNameCommon',['globalFunction',function(globalFunction){
        return globalFunction.createResource('commissionsetting/commissionrulenamecommon',{},{
            'createValidate':{method:'POST',url:globalFunction.getApiUrl('commissionsetting/commissionrulenamecommon/create-validate')}
        });
    }]).factory('commissionCardCommon',['globalFunction',function(globalFunction){
        return globalFunction.createResource('commissionsetting/commissioncardcommon',{},{
            'bindCommissionCard': {method:'POST',url:globalFunction.getApiUrl('commissionsetting/commissioncardcommon/bind-commission-card')}
        });
    }]).factory('commissionCard',['globalFunction',function(globalFunction){
        return globalFunction.createResource('commissionsetting/commissioncard',{},{
            'bindCard':{method:'POST',url:globalFunction.getApiUrl('commissionsetting/commissioncard/bind-card')},
            'batchBindCard':{method:'POST',url:globalFunction.getApiUrl('commissionsetting/commissioncard/batch-bind-card')},
            'cardLists':{method:'GET',url:globalFunction.getApiUrl('commissionsetting/commissioncard/card-list'),isArray:true}
        });
    }]).factory('commissionRecord',['globalFunction',function(globalFunction){
        return globalFunction.createResource('commission/commissionrecord',{},{
            'calculateCommission':{method:'POST',url:globalFunction.getApiUrl('commission/commissionrecord/calculate-commission')},
             'monthlyStatement':{method:'POST',url:globalFunction.getApiUrl('commission/commissionrecord/monthly-statement')},
            'confirmMonthly':{method:'POST',url:globalFunction.getApiUrl('commission/commissionrecord/confirm-monthly')},
            'deleteCommission':{method:'POST',url:globalFunction.getApiUrl('commission/commissionrecord/delete-commission')},
            'updateCommission':{method:'POST',url:globalFunction.getApiUrl('commission/commissionrecord/update-commission')},
            'commissionTotal':{method:'GET',url:globalFunction.getApiUrl('commission/commissionrecord/commission-total')},
            'updateRemark':{method:'PUT',url:globalFunction.getApiUrl('commission/commissionrecord/update-remark')}, //修改出佣備註
            'batchUpdateCommission':{method:'PUT',url:globalFunction.getApiUrl('commission/commissionrecord/batch-update-commission')},
            'allowanceRetrieveRecord':{method:'GET',url:globalFunction.getApiUrl('commission/commissionrecord/allowance-retrieve-record'), isArray:true},
            'resetCalculate':{method:'POST',url:globalFunction.getApiUrl('commission/commissionrecord/reset-calculate')} //重新計佣

        });
    }]).factory('commissionRecordSub',['globalFunction',function(globalFunction){
            return globalFunction.createResource('commission/commissionrecordsub');
    }]).factory('rollingCardCommission',['globalFunction',function(globalFunction){
        return globalFunction.createResource('commissionsetting/rollingcardcommission',{},{
            'rollingCommissionTotal':{method:'GET',url:globalFunction.getApiUrl('commissionsetting/rollingcardcommission/rolling-commission-total')}
        });
    }]).factory('rollingCardRecord',['globalFunction',function(globalFunction){
        return globalFunction.createResource('rolling/rollingcardrecord');
    }]).factory('commissionRecordImmediate',['globalFunction',function(globalFunction){
            return globalFunction.createResource('commission/commissionrecordimmediate',{},{
                'immediateCalc':{method:'POST',url:globalFunction.getApiUrl('commission/commissionrecordimmediate/immediate-calc')},
                'immediateAdd':{method:'POST',url:globalFunction.getApiUrl('commission/commissionrecordimmediate/immediate-add')}
            });
        }]).factory('commissionImmediate',['globalFunction',function(globalFunction){
            return globalFunction.createResource('commission/commissionimmediate',{},{
                'immediateCalc':{method:'POST',url:globalFunction.getApiUrl('commission/commissionimmediate/immediate-calc')},
                'immediateAdd':{method:'POST',url:globalFunction.getApiUrl('commission/commissionimmediate/immediate-add')},
                'immediateCommission':{method:'POST',url:globalFunction.getApiUrl('commission/commissionimmediate/immediate-commission')}
            });
        }]);
//    .factory('bindCard',['globalFunction',function(globalFunction){
//        return globalFunction.createResource('commissionsetting/commissioncard/bind-card');
//    }]);
}).call(this);