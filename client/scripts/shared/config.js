(function() {
    'use strict';
    angular.module('app.config',[]).constant('globalConfig', {
        enableClientValidation:false,
        signinUrl:'common/signin',
        reportUrl : 'report/report/get-report',
        frontendUrl:'',
        apiUrl: '',
        version: 'V1.1.1'
    })
}).call(this);
