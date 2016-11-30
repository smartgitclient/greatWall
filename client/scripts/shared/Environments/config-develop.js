(function() {
    'use strict';
    angular.module('app.config-local',['app.config']).config(function(globalConfig){
        globalConfig.frontendUrl = 'http://192.168.21.123/tms_frontend_develop';
        globalConfig.apiUrl = 'http://192.168.21.123/tms_api_develop/frontend/web/';
    })
}).call(this);
