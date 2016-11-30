(function() {
    'use strict';
    angular.module('app.config-local',['app.config']).config(function(globalConfig){
        globalConfig.frontendUrl = 'http://10.0.6.130/';
        globalConfig.apiUrl = 'http://10.0.6.130/api/frontend/web/';
    })
}).call(this);
