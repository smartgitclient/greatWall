/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.loan.services',['ngResource']).factory('loanBusiness',['globalFunction',function(globalFunction){
            return globalFunction.createResource('loan/loanbusiness',{},{
                'borrowers':{method:'GET', url:globalFunction.getApiUrl('loan/loanbusiness/borrowers'),isArray:true},
                'loanSupervisors':{method:'GET', url: globalFunction.getApiUrl('loan/loanbusiness/loan-supervisors'),isArray:true},
                'createMarker':{method:'POST', url: globalFunction.getApiUrl('loan/loanbusiness/create-marker')},
                'confirmLoan':{method:'POST', url: globalFunction.getApiUrl('loan/loanbusiness/confirm-loan')},
                'updateRemark':{method:'PUT', url: globalFunction.getApiUrl('loan/loanbusiness/update-remark')},
                //'agentFundType':{method:'GET', url: globalFunction.getApiUrl('loan/loanbusiness/agent-fund-type'),isArray:true}
                'loanMarkerRepayment':{method:'GET', url:globalFunction.getApiUrl('loan/loanbusiness/loan-marker-repayment'),isArray:true},//還款記錄列表
                'agentQuotaSetting':{method:'GET', url:globalFunction.getApiUrl('loan/loanbusiness/agent-quota-setting'),isArray:true}, //戶口查詢批額
                'loanSendSms':{method:'POST', url: globalFunction.getApiUrl('loan/loanbusiness/loan-send-sms')}

            });
    }]).factory('marker',[
        'globalFunction',function(globalFunction){
            return globalFunction.createResource('loan/marker',{},{
                'unRepayment':{method:'GET', url:globalFunction.getApiUrl('loan/marker/un-repayment'),isArray:true},
                'followerUnRepayment':{method:'GET', url:globalFunction.getApiUrl('loan/marker/follower-un-repayment'),isArray:true},
                'expiredMarkerTotal':{method:'GET', url:globalFunction.getApiUrl('loan/marker/expired-marker-total'),isArray:true}, //过期贷款汇总
                'markerTotal':{method:'GET', url:globalFunction.getApiUrl('loan/marker/marker-total')}, //贷款汇总
                'markerDate':{method:'GET', url:globalFunction.getApiUrl('loan/marker/marker-date'),isArray:true}, //过期贷款汇总时间
                'expiredMarker':{method:'GET', url:globalFunction.getApiUrl('loan/marker/expired-marker')}, //查詢戶口过期贷款
                'markerList':{method:'GET', url:globalFunction.getApiUrl('loan/marker/marker-list'),isArray:true}, //查詢過期貸款列表(按日期查詢)
                'agentMarker':{method:'GET', url:globalFunction.getApiUrl('loan/marker/other-agent-marker'),isArray:true}, //查詢過期貸款列表(按日期查詢)
                'agentMarkerAmount':{method:'GET', url:globalFunction.getApiUrl('loan/marker/agent-marker-amount'),isArray:true} //查詢過期貸款列表(按日期查詢)

            });
        }
    ]).factory('markerRepayment',[ //還款記錄列表
        'globalFunction',function(globalFunction){
            return globalFunction.createResource('loan/markerrepayment',{},{
                'repaymentRollback':{method:'POST', url: globalFunction.getApiUrl('loan/markerrepayment/repayment-rollback')}
            });
        }
    ]).factory('markerfeeoutagentremark',[
        'globalFunction',function(globalFunction){ //手續費記錄總表備註列表
            return globalFunction.createResource('loan/markerfeeoutagentremark');
        }
    ]).factory('agentFundType',[
        'globalFunction',function(globalFunction){ //贷款类型
            return globalFunction.createResource('loan/loanbusiness/agent-fund-type');
        }
    ]).factory('markerFee',[ //過期手續費列表（賬房）
        'globalFunction',function(globalFunction){
            return globalFunction.createResource('loan/markerfee',{},{
                'repaymentExpiredFee':{method:'POST', url: globalFunction.getApiUrl('loan/markerfee/repayment-expired-fee')},
                'addExpiredFee':{method:'POST', url: globalFunction.getApiUrl('loan/markerfee/add-expired-fee')},
                'feeTotal':{method:'GET', url: globalFunction.getApiUrl('loan/markerfee/fee-total')},
               // 'calculateFee':{method:'POST', url: globalFunction.getApiUrl('loan/markerexpiredfee/calculate-fee')}
               'repaymentfeeSms':{method:'POST', url: globalFunction.getApiUrl('loan/markerfee/send-marker-fee-sms')}
            });
        }
    ]).factory('markerFeeRepayment',[
        'globalFunction',function(globalFunction){ //手續費收付記錄(過期手續費還款記錄)
            return globalFunction.createResource('loan/markerfeerepayment');
        }
    ]).factory('markerFeeRepayRefund',[
        'globalFunction',function(globalFunction){ //手續費收付記錄 的還款記錄
            return globalFunction.createResource('loan/markerfeerepayrefund');
        }
    ]).factory('markerFeeRepayAssign',[
        'globalFunction',function(globalFunction){ //手續費分派流水
            return globalFunction.createResource('loan/markerfeerepayassign');
        }
    ]).factory('markerExpiredFee',[  //過期手續費列表（會計）
        'globalFunction',function(globalFunction){
            return globalFunction.createResource('loan/markerexpiredfee',{},{
                //'repaymentExpiredFee':{method:'POST', url: globalFunction.getApiUrl('loan/markerexpiredfee/repayment-expired-fee')},
                'mitigateExpiredFee':{method:'POST', url: globalFunction.getApiUrl('loan/markerexpiredfee/mitigate-expired-fee')},
                'confirmExpiredFee':{method:'POST', url: globalFunction.getApiUrl('loan/markerexpiredfee/confirm-expired-fee')},
                'markerExpiredFeeConfirm':{method:'POST', url: globalFunction.getApiUrl('loan/markerexpiredfee/marker-expired-fee-confirm')},
                'markerFeeRollback':{method:'POST', url: globalFunction.getApiUrl('loan/markerexpiredfee/marker-fee-rollback')},
                'markerRollback':{method:'POST', url: globalFunction.getApiUrl('loan/markerexpiredfee/marker-rollback')},
                'markerFeeRefund':{method:'POST', url: globalFunction.getApiUrl('loan/markerexpiredfee/marker-fee-refund')},
                'expiredFeeConfirm':{method:'POST', url: globalFunction.getApiUrl('loan/markerexpiredfee/expired-fee-confirm')},
                'expiredFeeCalcaulate':{method:'POST', url: globalFunction.getApiUrl('loan/markerexpiredfee/expired-fee-calcaulate')},//手續費重新計算
                'retryExpiredFeeConfirm':{method:'POST', url: globalFunction.getApiUrl('loan/markerexpiredfee/retry-expired-fee-confirm')},//手續費重新計算之後調整
                'payForAnother':{method:'POST', url: globalFunction.getApiUrl('loan/markerexpiredfee/pay-for-another')},
                'calculateFee':{method:'POST', url: globalFunction.getApiUrl('loan/markerexpiredfee/calculate-fee')},
                'trial':{method:'POST', url: globalFunction.getApiUrl('loan/markerexpiredfee/trial'),isArray:true},
                'expiredFeeTotal':{method:'GET', url: globalFunction.getApiUrl('loan/markerexpiredfee/expired-fee-total')},
                'markerExpiredFeeTotal':{method:'GET', url: globalFunction.getApiUrl('loan/markerexpiredfee/marker-expired-fee-total'),isArray:true}
            });
        }
    ]).factory('markerExpiredFeeRepayment',[  //貸款過期手續費流水
        'globalFunction',function(globalFunction){
            return globalFunction.createResource('loan/markerexpiredfeerepayment');
        }
    ]).factory('markerExpiredFeeAdjustRecord',[  //手續費調整記錄
        'globalFunction',function(globalFunction){
            return globalFunction.createResource('loan/markerexpiredfeeadjustrecord');
        }
    ]).factory('agentQuota',[
        'globalFunction',function(globalFunction){
            return globalFunction.createResource('loan/loanbusiness/agent-quota');
        }
    ]).factory('loanBusinessOperation',[  //還款
        'globalFunction',function(globalFunction){
            return globalFunction.createResource('loan/loanbusinessoperation');
        }
    ])/*.factory('loanMarkerRepayment',[ //查詢貸款業務單還款列表
        'globalFunction',function(globalFunction){
            return globalFunction.createResource('loan/loanbusiness/loan-marker-repayment');
        }
    ])*/.factory('markerTerm',[
        'globalFunction',function(globalFunction){ //查詢貸款單期限信息
            return globalFunction.createResource('loan/markerterm',{},{
                'markerTermFee':{method:'GET',url: globalFunction.getApiUrl('loan/markerterm/marker-term-fee'),isArray:true}
            });
        }
    ]).factory('markerTermFee',[
            'globalFunction',function(globalFunction){
                return globalFunction.createResource('loan/markertermfee');
            }
    ]).factory('quotaSettingsCommon',[
        'globalFunction',function(globalFunction){ //查詢公共批額設定列表
            return globalFunction.createResource('loan/quotasettingcommon');
        }
    ]).factory('quotaSetting',[
        'globalFunction',function(globalFunction){ //查詢戶口批額設定列表
            return globalFunction.createResource('loan/quotasetting');
        }
    ]).factory('quotaShare',[
        'globalFunction',function(globalFunction){ //新增共用批額
            return globalFunction.createResource('loan/quotasetting/quota-share');
        }
    ]).factory('quotaOperation',[
        'globalFunction',function(globalFunction){ //查詢戶口批額設定列表
            return globalFunction.createResource('loan/quotaoperation');
        }
    ])
}).call(this);
