/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.commission-calculate.json',['ngResource']).service('commissionCalculates',function($resource){

        return [
            {"id":"0","year_month":"2014-06","agent_code":"F5","agent_name":"于成","should_pay":"0","should_income":"50000","remark":"下線罰息"},
            {"id":"1","year_month":"2014-06","agent_code":"D56","agent_name":"陳德","should_pay":"0","should_income":"75000","remark":"下線罰息"},
            {"id":"2","year_month":"2014-06","agent_code":"FA22","agent_name":"張高","should_pay":"-35000","should_income":"0","remark":"過期罰息"},
            {"id":"3","year_month":"2014-06","agent_code":"FA233","agent_name":"李達文","should_pay":"-200","should_income":"1170","remark":"轉碼差額"},
            {"id":"4","year_month":"2014-06","agent_code":"DA88","agent_name":"陳來","should_pay":"0","should_income":"23525","remark":"轉碼差額"},
            {"id":"5","year_month":"2014-06","agent_code":"D299","agent_name":"張鑫","should_pay":"-11320","should_income":"0","remark":"過期罰息"},
            {"id":"6","year_month":"2014-06","agent_code":"H292","agent_name":"李于成","should_pay":"-1500","should_income":"0","remark":"過期罰息"},
            {"id":"7","year_month":"2014-06","agent_code":"FA233","agent_name":"吳楚","should_pay":"0","should_income":"12250","remark":"轉碼差額"},
            {"id":"8","year_month":"2014-06","agent_code":"DA304","agent_name":"林進","should_pay":"0","should_income":"2500","remark":"轉碼差額"},
            {"id":"9","year_month":"2014-06","agent_code":"DA388","agent_name":"林子凡","should_pay":"-1800","should_income":"0","remark":"過期罰息"},
            {"id":"10","year_month":"2014-06","agent_code":"DA401","agent_name":"張閣","should_pay":"-12350","should_income":"0","remark":"過期罰息"}

        ]
    });
}).call(this);