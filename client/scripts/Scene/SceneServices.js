/**
 * Created by Allen.zhang on 2014/8/21.
 */
(function() {
    'use strict';
    angular.module('app.scene.services', ['ngResource']).factory('sceneRecord', [
        'globalFunction', function (globalFunction) {
            return globalFunction.createResource('scene/scenerecord',{},{
                'sceneAgent': {method:'GET', url:globalFunction.getApiUrl('scene/scenerecord/scene-agent'), isArray:true},
                'sceneRolling': {method:'GET', url:globalFunction.getApiUrl('scene/scenerecord/scene-rolling'), isArray:true},
                'sceneTotal': {method:'GET', url:globalFunction.getApiUrl('scene/scenerecord/scene-total')},
                'sceneTotalList': {method:'GET', url:globalFunction.getApiUrl('scene/scenerecord/total-list'), isArray:true},
                'sceneShiftTotal': {method:'GET', url:globalFunction.getApiUrl('scene/scenerecord/scene-shift-total')}
            });
        }
    ]).factory('recentlyPrincipal', [
        'globalFunction', function (globalFunction) {
            return globalFunction.createResource('scene/recentlyprincipal');
        }
    ]).factory('searchSceneRecord', [
        'globalFunction', function (globalFunction) {
            return globalFunction.createResource('scene/search_scene_record');
        }
    ]).factory('desk', [
        'globalFunction', function (globalFunction) {
            return globalFunction.createResource('scene/desk',{},{
                'updateDesk':{method:'POST', url:globalFunction.getApiUrl('scene/desk/update-desk'), isArray:true}
            });
        }
    ]).factory('sceneRecordShift', [ //新增截更
        'globalFunction', function (globalFunction) {
            return globalFunction.createResource('scene/scenerecordshift',{},{
                'sceneInCapitals':{method:'GET', url:globalFunction.getApiUrl('scene/scenerecordshift/scene-in-capitals'), isArray:true},
                'addScene':{method:'POST', url:globalFunction.getApiUrl('scene/scenerecordshift/add-scene')}
            });
        }
    ]).factory('sceneShiftRecord', [ //新增截數
        'globalFunction', function (globalFunction) {
            return globalFunction.createResource('scene/sceneshiftrecord',{},{
                'sceneShift':{method:'POST', url:globalFunction.getApiUrl('scene/sceneshiftrecord/scene-shift')},
                'sceneShiftAmount':{method:'GET', url:globalFunction.getApiUrl('scene/sceneshiftrecord/scene-shift-amount')}

            });
        }
    ]).factory('mainScene', [ //主場次
        'globalFunction', function (globalFunction) {
            return globalFunction.createResource('scene/mainscene',{},{
                'findWaitScene':{method:'GET', url:globalFunction.getApiUrl('scene/mainscene/find-wait-scene'), isArray:true}
            });
        }
    ]).factory('outSceneWord', [ //離場本金詞語庫列表
        'globalFunction', function (globalFunction) {
            return globalFunction.createResource('scene/outsceneword');
        }
    ]);


}).call(this);
