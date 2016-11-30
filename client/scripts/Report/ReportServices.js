/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.report.services',['ngResource'])
        .factory('reportList', ['globalFunction', function(globalFunction){
            return globalFunction.createResource('report/report/get-report-list');
        }])
}).call(this);