/**
 * Created by Allen.zhang on 2014/8/21.
 */
(function() {
    'use strict';
    angular.module('app.consumption-manager.services', ['ngResource']).factory('scene', [
        '$resource', function ($resource) {
            return null;
        }
    ]).factory('consumptionHotelSub',['globalFunction',function(globalFunction){ //hotel records
        return globalFunction.createResource('consumption/consumptionhotelsub');
    }]).factory('consumptionHotel',['globalFunction',function(globalFunction){ //hotel records
        return globalFunction.createResource('consumption/consumptionhotel', {},{
            'createValidate':{method:'POST', url: globalFunction.getApiUrl('consumption/consumptionhotel/create-validate')}, //已弃用
            'validateHotelSub':{method:'POST', url: globalFunction.getApiUrl('consumption/consumptionhotelsub/validate-hotel-sub')}
        });
    }]).factory('consumptionRoomtype',['globalFunction',function(globalFunction){ // 房间类型
        return globalFunction.createResource('consumption/roomtype');
    }]).factory('consumptionHoteltravel',['globalFunction',function(globalFunction){ // 酒店列表
        return globalFunction.createResource('consumption/hoteltravel', {},{
            'getHotelTravel':{method:'GET', url: globalFunction.getApiUrl('consumption/hoteltravel/get-hotel-travel'), isArray: true}
        });
    }]).factory('consumptionFoodcoupon',['globalFunction',function(globalFunction){ // 食飞
        return globalFunction.createResource('consumption/consumptionfoodcoupon');
    }]).factory('hotelLists',['globalFunction',function(globalFunction){    //酒店， 餐厅联动
        return globalFunction.createResource('consumption/hotel');
    }]).factory('consumptionHelicopter',['globalFunction',function(globalFunction){ // 直升机
        return globalFunction.createResource('consumption/consumptionhelicopter');
    }]).factory('consumptionBoat',['globalFunction',function(globalFunction){ // 船票
        return globalFunction.createResource('consumption/consumptionboat');
    }]).factory('consumptionFlight',['globalFunction',function(globalFunction){ // 机票
        return globalFunction.createResource('consumption/consumptionflight', {}, {
            'flightAddSingle':{method:'POST', url: globalFunction.getApiUrl('consumption/consumptionflight/create-single')},
            'flightUpdateSingle':{method:'PUT', url: globalFunction.getApiUrl('consumption/consumptionflight/update-single')},
            'flightAddDouble':{method:'POST', url: globalFunction.getApiUrl('consumption/consumptionflight/create-double')},
            'flightUpdateDouble':{method:'PUT', url: globalFunction.getApiUrl('consumption/consumptionflight/update-double')}
        });
    }]).factory('consumptionCar',['globalFunction',function(globalFunction){ // 租车
        return globalFunction.createResource('consumption/consumptioncar');
    }]).factory('carType',['globalFunction',function(globalFunction){ // 车辆类型
        return globalFunction.createResource('consumption/cartype');
    }]).factory('consumptionTicket',['globalFunction',function(globalFunction){ // 门票
        return globalFunction.createResource('consumption/consumptionticket');
    }]).factory('ticketType',['globalFunction',function(globalFunction){ // 门票类型
        return globalFunction.createResource('consumption/tickettype');
    }]).factory('consumptionMiscellaneous',['globalFunction',function(globalFunction){ // 其他
        return globalFunction.createResource('consumption/consumptionmiscellaneous');
    }]).factory('consumptionPaytype',['globalFunction',function(globalFunction){ // 付款方式
        return globalFunction.createResource('consumption/paytype');
    }]).factory('consumptionHotelValidateDate',['globalFunction',function(globalFunction){ // 订房日期
        return globalFunction.createResource('consumption/consumptionhotel/validate-date');
    }]).factory('helicopterTrip',['globalFunction',function(globalFunction){ // 获取直升机行程列表
        return globalFunction.createResource('consumption/helicoptertrip',{}, {
            'getHelicopterTrip':{method:'GET', url: globalFunction.getApiUrl('consumption/helicoptertrip/get-helicopter-trip'), isArray:true}
        });
    }]).factory('helicopterCity',['globalFunction',function(globalFunction){ // 获取直升机飞行城市
        return globalFunction.createResource('consumption/helicoptercity');
    }]).factory('boatTrip',['globalFunction',function(globalFunction){ // 获取船行程列表
        return globalFunction.createResource('consumption/boattrip', {}, {
            'getBoattrip':{method:'GET', url: globalFunction.getApiUrl('consumption/boattrip/get-boat-trip'), isArray:true}
        });
    }]).factory('boatCity',['globalFunction',function(globalFunction){ // 获取船航行城市
        return globalFunction.createResource('consumption/boatcity');
    }]).factory('miscellaneousType',['globalFunction',function(globalFunction){ // 获取杂项类型
        return globalFunction.createResource('consumption/miscellaneoustype');
    }]).factory('flightSeatType',['globalFunction',function(globalFunction){ // 获取飞机票舱位类型
        return globalFunction.createResource('consumption/flightseattype');
    }]).factory('getConsumption',['globalFunction',function(globalFunction){ // 机票
            return globalFunction.createResource('consumption/consumption', {}, {
                'getConsumptionList':{method:'GET', url: globalFunction.getApiUrl('consumption/consumption/get-consumption-list'), isArray:true},
                'consumptionTransfer':{method:'POST', url: globalFunction.getApiUrl('consumption/consumption/consumption-transfer')} //消費轉移
            });
    }]).factory('getShiftList',['globalFunction',function(globalFunction){ // 获取飞机票舱位类型
        return globalFunction.createResource('shift/refshiftdepthall/get-shift-list');
    }]).factory('consumptionType',['globalFunction',function(globalFunction){ // 获取飞机票舱位类型
            return globalFunction.createResource('consumption/consumptiontype');
        }])

        .factory('hotelSmsType',['globalFunction',function(globalFunction){ // 获取酒店信息类型
            return globalFunction.createResource('consumption/suppliersmstype');
        }])


}).call(this);
