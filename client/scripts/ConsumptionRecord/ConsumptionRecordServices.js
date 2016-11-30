/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.consumption-record.services',['ngResource']).service('newAgent',function($resource){
        this.data = null;
    }).factory('hall',[
        '$resource',function($resource){
            return $resource('data/loan/halls.json', {}, {
                query: {method:'GET',isArray:true}
            });
        }
    ]).factory('consumption',['globalFunction',function(globalFunction){ // 消费记录列表
        return globalFunction.createResource('consumption/consumption',{},{
            'get-consumption-record':{method:'GET', url: globalFunction.getApiUrl('consumption/consumption/get-consumption-record'), isArray:true},
            'getConsumptionTotal':{method:'GET', url: globalFunction.getApiUrl('consumption/consumption/get-consumption-total')},
            'getConsumptionSummary':{method:'GET', url: globalFunction.getApiUrl('consumption/consumption/get-consumption-summary')}
        });
    }]).factory('consumptionType',['globalFunction',function(globalFunction){ // 消费类型
        return globalFunction.createResource('consumption/consumptiontype');
    }])
}).call(this);