(function() {
    'use strict';
    angular.module('app.config-local',['app.config']).config(function(globalConfig){
        globalConfig.frontendUrl = 'http://192.168.21.123/tms_frontend_demo/';
        globalConfig.apiUrl = 'http://192.168.21.123/tms_api_demo/frontend/web/';
    })
}).call(this);
