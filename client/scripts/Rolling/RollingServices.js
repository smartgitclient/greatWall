/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.rolling.services',['ngResource']).factory('rolling',['globalFunction',function(globalFunction){
            return globalFunction.createResource('rolling/rolling',{},{
                'generateRollingCard':{method:'POST', url:globalFunction.getApiUrl("rolling/rolling/generate-rolling-card"), isArray:true},
                'preDeposit':{method:'POST', url:globalFunction.getApiUrl('rolling/rolling/pre-deposit')},
                'rollingSum':{method:'GET', url:globalFunction.getApiUrl('rolling/rolling/rolling-sum'), isArray:true},
                'rollingTotal':{method:'GET', url:globalFunction.getApiUrl('rolling/rolling/rolling-total')},
                'rollingConfirm':{method:'POST', url:globalFunction.getApiUrl('rolling/rolling/rolling-confirm')}, //離場確認
                'rollingQuit':{method:'GET', url:globalFunction.getApiUrl('rolling/rolling/rolling-quit')} , //轉碼卡分卡
                'rollingUpdate':{method:'POST', url:globalFunction.getApiUrl('rolling/rolling/rolling-modify'), isArray:true},  // 转码数修改
                'getRollingCardRecords':{method:'GET', url:globalFunction.getApiUrl('rolling/rolling/get-rolling-card-records'), isArray:true}

            });
        }
    ]).factory('recentlyLoanDeposit',['globalFunction',function(globalFunction){ //最近借貸存取款信息
            return globalFunction.createResource('rolling/recentlyloandeposit');
        }
    ]).factory('rollingRecord',['globalFunction',function(globalFunction){
            return globalFunction.createResource('rolling/rollingrecord',{},{
                'rollingRecordTotal':{method:'GET', url:globalFunction.getApiUrl('rolling/rollingcardamountrecord'),isArray:true},
                'rollingRecordTotal_y':{method:'GET', url:globalFunction.getApiUrl('rolling/rollingrecord/rolling-record-total')},
                'rollingRecordDetailTotal':{method:'GET', url:globalFunction.getApiUrl('rolling/rolling/rolling-sum'),isArray:true},
                'agentRollingTotalInGroup':{method:'GET', url:globalFunction.getApiUrl('rolling/rollingrecord/agent-rolling-total-in-group'), isArray:true}

            });
        }
    ])
    .factory('rollingCardAmount',[
        'globalFunction',function(globalFunction){
         return globalFunction.createResource('rolling/rollingcardamount',{},{
             'cardAmountTotal':{method:'GET',url:globalFunction.getApiUrl('rolling/rollingcardamount/card-amount-total')}
         });
    }
    ]).factory('cardAmountTotal',[
        'globalFunction',function(globalFunction){
            return globalFunction.createResource('rolling/rollingcardamount/card-amount-total');
        }
    ]).factory('getRollingRecord',[
        'globalFunction',function(globalFunction){
            return globalFunction.createResource('rolling/rollingremind/get-rolling-record');
        }
    ]).factory('refrecentlyRolling',[ //入場本金
        'globalFunction',function(globalFunction){
            return globalFunction.createResource('rolling/refrecentlyrolling');
        }
    ]).factory('rollingCardRecord',[ //入場本金
        'globalFunction',function(globalFunction){
            return globalFunction.createResource('rolling/rollingcardrecord');
        }
    ]).factory('rollingCardAmountRecord',[ //戶口匯總詳細
            'globalFunction',function(globalFunction){
                return globalFunction.createResource('rolling/rollingcardamountrecord');
            }
        ]);
}).call(this);
