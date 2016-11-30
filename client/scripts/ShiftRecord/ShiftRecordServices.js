/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.shift-record.services',['ngResource']).factory('shiftRecord',['globalFunction',function(globalFunction){
        return globalFunction.createResource('shift/shiftrecord',{},{
            'createShiftRecord':{method:'GET',url:globalFunction.getApiUrl('shift/shiftrecord/shift-record')},
            'hallShiftRecords':{method:'GET',url:globalFunction.getApiUrl('shift/shiftrecord/hall-shift-records')},//沒有集團的日結詳細查詢
            'insideHallsShiftRecords':{method:'GET',url:globalFunction.getApiUrl('shift/shiftrecord/inside-halls-shift-records')},
            'setShiftRecord':{method:'POST',url:globalFunction.getApiUrl('shift/shiftrecord/set-shift-record')}//截更API
        });
    }]).factory('shiftRecordAgent',['globalFunction',function(globalFunction){
        return globalFunction.createResource('shift/shiftrecordagent',{},{
            'hallAgentShiftRecords':{method:'GET',url:globalFunction.getApiUrl('shift/shiftrecordagent/hall-agent-shift-records'),isArray:true},
            'insideHallsAgentShiftRecords':{method:'GET',url:globalFunction.getApiUrl('shift/shiftrecordagent/inside-halls-agent-shift-records'),isArray:true}
        });
    }]).factory('settlementMonth',['globalFunction',function(globalFunction){
            return globalFunction.createResource('shift/settlementmonth',{},{
                    'shiftRecordMonthlys':{method:'GET',url:globalFunction.getApiUrl('shift/settlementmonth/shift-record-monthly')}
             });
     }]).factory('shiftRecordMonthly',['globalFunction',function(globalFunction){
            return globalFunction.createResource('shift/shiftrecordmonthly');
        }]);
}).call(this);