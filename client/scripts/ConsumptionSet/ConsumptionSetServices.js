/**
 * Created by Allen.zhang on 2014/8/21.
 */
(function() {
    'use strict';
    angular.module('app.consumption-set.services', ['ngResource']).factory('scene', [
        '$resource', function ($resource) {
            return null;
        }
    ]).factory('restaurant',['globalFunction',function(globalFunction){ //
        return globalFunction.createResource('consumption/restaurant');
    }]).factory('boatSeatType',['globalFunction',function(globalFunction){ //
        return globalFunction.createResource('consumption/boatseattype');
    }]).factory('specialDay',['globalFunction',function(globalFunction){ //
        return globalFunction.createResource('consumption/specialday');
    }])
}).call(this);
