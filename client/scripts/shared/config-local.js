(function() {
    'use strict';
    angular.module('app.config-local',['app.config']).config(function(globalConfig){
//        globalConfig.frontendUrl = 'http://192.168.21.123/tms_frontend_develop/';
//        globalConfig.apiUrl = 'http://192.168.21.123/tms_api_develop/frontend/web/';
        globalConfig.frontendUrl = 'http://localhost:9000/';
//        globalConfig.apiUrl = 'http://192.168.21.123/tms_api_develop/frontend/web/';
//        globalConfig.apiUrl = 'http://219.131.198.138:21333/api/frontend/web/';
//        globalConfig.apiUrl = 'http://192.168.21.123/tms_api_demo/frontend/web/';
        globalConfig.apiUrl = 'http://localhost/gt_php/frontend/web/';
        globalConfig.javaApi = 'http://10.0.9.4:80/';
        globalConfig.socketServer='http://192.168.21.123:3000'
        //globalConfig.socketServer='http://192.168.21.123:3001'
    })
}).call(this);
