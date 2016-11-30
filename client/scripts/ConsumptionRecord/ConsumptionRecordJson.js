/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.consumption-record.json',['ngResource']).service('commissionCalculates',function($resource){

        return [
            {"id":"0","year_month":"2014-08-15","agent_code":"F5","agent_name":"于成","should_pay":"0","should_income":"5000","remark":""},
            {"id":"1","year_month":"2014-08-15","agent_code":"D56","agent_name":"陳德","should_pay":"0","should_income":"75000","remark":""},
            {"id":"2","year_month":"2014-08-15","agent_code":"FA22","agent_name":"張高","should_pay":"-3500","should_income":"5000","remark":""},
            {"id":"3","year_month":"2014-08-15","agent_code":"DA88","agent_name":"陳來","should_pay":"0","should_income":"2350","remark":""},
            {"id":"4","year_month":"2014-08-15","agent_code":"D299","agent_name":"張鑫","should_pay":"-1500","should_income":"5000","remark":""},
            {"id":"5","year_month":"2014-08-15","agent_code":"H292","agent_name":"李于成","should_pay":"0","should_income":"0","remark":""},
            {"id":"6","year_month":"2014-08-15","agent_code":"FA233","agent_name":"林進","should_pay":"0","should_income":"5000","remark":""},
            {"id":"7","year_month":"2014-08-15","agent_code":"DA401","agent_name":"張閣","should_pay":"-1250","should_income":"0","remark":""}

        ]
    });
}).call(this);