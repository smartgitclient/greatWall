/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.mortgage.services',['ngResource'])
        .factory('mortgageRecords', ['globalFunction', function(globalFunction){
            return globalFunction.createResource('mortgage/mortgage',{},{
                'mortgageType' : {method:'GET', url:globalFunction.getApiUrl('mortgage/mortgage/mortgage-type')},
                'mortgageReturnM' : {method:'POST', url:globalFunction.getApiUrl('mortgage/mortgage/return-m')},
                'crossTransferReturnM' : {method:'POST', url:globalFunction.getApiUrl('mortgage/mortgage/cross-transfer-return-m')},
                'loanAgent' : {method:'GET', url:globalFunction.getApiUrl('mortgage/mortgage/loan-agent'), isArray: true}

            });
        }])
        .factory('refMortgageMarker', ['globalFunction', function(globalFunction)
        {
            return globalFunction.createResource('mortgage/refmortgagemarker',{},{
                'mortgageTotal' : {method:'GET', url:globalFunction.getApiUrl('mortgage/refmortgagemarker/mortgage-total')}
            });
        }])
        .factory('mortgageProfit', ['globalFunction', function(globalFunction)
        {
            return globalFunction.createResource('mortgage/mortgageprofit');
        }]);
}).call(this);