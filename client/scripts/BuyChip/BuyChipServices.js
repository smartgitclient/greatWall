/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.buy-chip.services',['ngResource']).factory('buyChips',['globalFunction',function(globalFunction){ //通知信息綁定 通知類型
        return globalFunction.createResource('buychips/buychips',{},{
            'getBuyChipsTotal':{method:'GET',url:globalFunction.getApiUrl('buychips/buychips/get-buy-chips-total')}
        });
    }]);
}).call(this);