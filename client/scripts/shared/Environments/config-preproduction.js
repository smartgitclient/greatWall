(function() {
    'use strict';
    angular.module('app.config-local',['app.config']).config(function(globalConfig){
        globalConfig.version += '測試版';
        globalConfig.frontendUrl = 'http://10.0.9.6/';
        globalConfig.apiUrl = 'http://10.0.9.6/api/frontend/web/';
    })
}).call(this);
