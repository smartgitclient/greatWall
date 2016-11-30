/**
 * Created by Allen.zhang on 2014/8/21.
 */
(function() {
    'use strict';
    angular.module('app.consumption-set.json', ['ngResource']).service('roomsSet', function($resource){
        return [
            {"id":0, "hotel_name":"永利", "room_type":"D", "ordinary_cost_price":"1500", "ordinary_selling_price":"1800", "weekend_cost_price":"1600", "weekend_selling_price":"2000", "especially_cost_price":"1800", "especially_selling_price":"2300", "remark":"機場班車服務"},
            {"id":1,"hotel_name":"永利", "room_type":"E", "ordinary_cost_price":"2500", "ordinary_selling_price":"2800",	"weekend_cost_price":"2600", "weekend_selling_price":"3200", "especially_cost_price":"2800", "especially_selling_price":"3500", "remark":""},
            {"id":2,"hotel_name":"永利", "room_type":"G", "ordinary_cost_price":"3000", "ordinary_selling_price":"3200", "weekend_cost_price":"3200", "weekend_selling_price":"3500", "especially_cost_price":"3500", "especially_selling_price":"3800", "remark":"外幣兌換"},
            {"id":3,"hotel_name":"永利", "room_type":"SK", "ordinary_cost_price":"4000", "ordinary_selling_price":"4300", "weekend_cost_price":"4200", "weekend_selling_price":"4500", "especially_cost_price":"4500", "especially_selling_price":"5000", "remark":""},
            {"id":4,"hotel_name":"MGM", "room_type":"D",	"ordinary_cost_price":"1800", "ordinary_selling_price":"2000",	"weekend_cost_price":"2000", "weekend_selling_price":"2300",	"especially_cost_price":"2200",	"especially_selling_price":"2500", "remark":""},
            {"id":5,"hotel_name":"MGM", "room_type":"E",	"ordinary_cost_price":"2000", "ordinary_selling_price":"2300",	"weekend_cost_price":"2200", "weekend_selling_price":"2500",	"especially_cost_price":"2500",	"especially_selling_price":"3000", "remark":""},
            {"id":6, "hotel_name":"新葡京", "room_type":"D", "ordinary_cost_price":"1600", "ordinary_selling_price":"1800", "weekend_cost_price":"1600", "weekend_selling_price":"2000", "especially_cost_price":"1800", "especially_selling_price":"2300", "remark":"機場班車服務"},
            {"id":7,"hotel_name":"新葡京", "room_type":"E", "ordinary_cost_price":"2400", "ordinary_selling_price":"2700",	"weekend_cost_price":"2600", "weekend_selling_price":"3200", "especially_cost_price":"2800", "especially_selling_price":"3500", "remark":""},
            {"id":8, "hotel_name":"銀河", "room_type":"D", "ordinary_cost_price":"1500", "ordinary_selling_price":"1800", "weekend_cost_price":"1600", "weekend_selling_price":"2000", "especially_cost_price":"1800", "especially_selling_price":"2300", "remark":"機場班車服務"},
            {"id":9,"hotel_name":"銀河", "room_type":"E", "ordinary_cost_price":"2500", "ordinary_selling_price":"2800",	"weekend_cost_price":"2600", "weekend_selling_price":"3200", "especially_cost_price":"2800", "especially_selling_price":"3500", "remark":""},
            {"id":10,"hotel_name":"銀河", "room_type":"G", "ordinary_cost_price":"3000", "ordinary_selling_price":"3200", "weekend_cost_price":"3200", "weekend_selling_price":"3500", "especially_cost_price":"3500", "especially_selling_price":"3800", "remark":"外幣兌換"},
            {"id":11,"hotel_name":"銀河", "room_type":"SK", "ordinary_cost_price":"4000", "ordinary_selling_price":"4300", "weekend_cost_price":"4200", "weekend_selling_price":"4500", "especially_cost_price":"4500", "especially_selling_price":"5000", "remark":""},
        ]
    }).service('consumptionTypes', function($resource){ //消費類型
        return [
            {"id":0, "num":"01", "consumption_type":"酒店", "consumption_name":"永利"},
            {"id":1, "num":"02", "consumption_type":"旅行社", "consumption_name":"鉅星旅行社"},
            {"id":2, "num":"03", "consumption_type":"旅行社", "consumption_name": "UO"},
            {"id":3, "num":"04", "consumption_type":"酒店", "consumption_name":	"新葡京"},
            {"id":4, "num":"05", "consumption_type":"酒店", "consumption_name":	"舊葡京"},
            {"id":5, "num":"06", "consumption_type":"酒店", "consumption_name":	"MGM"},
            {"id":6, "num":"07", "consumption_type":"酒店", "consumption_name":	"銀河"},
            {"id":7, "num":"08", "consumption_type":"酒店", "consumption_name":	"太陽城"}

        ]
    }).service('shipCity', function($resource){//船票城市地區
        return [
            {"id":0, "city":"澳門"},
            {"id":1, "city":"香港"},
            {"id":2, "city":"香港機場"},
            {"id":3, "city":"深圳機場[福永]"},
            {"id":4, "city":"蛇口"}

        ]

    }).service('positions', function($resource){ //倉位
        return [
            {"id":0, "position":"4人位"},
            {"id":1, "position":"6人位"},
            {"id":2, "position":"經濟位"},
            {"id":3, "position":"豪華位"},
            {"id":4, "position":"貴賓位"}
        ]

    }).service('shipTrips', function($resource){ //行程設定
        return [
            {"id":0, "num":"澳門", "consumption_type":"香港", "position": "經濟位"},
            {"id":1, "num":"澳門", "consumption_type":"香港", "position": "貴賓位"},
            {"id":2, "num":"澳門", "consumption_type":"香港", "position": "豪華位"},
            {"id":3, "num":"澳門", "consumption_type":"蛇口", "position": "經濟位"},
            {"id":4, "num":"澳門", "consumption_type":"蛇口", "position": "豪華位"},
            {"id":5, "num":"澳門", "consumption_type":"蛇口", "position": "貴賓位"},
            {"id":6, "num":"澳門", "consumption_type":"蛇口", "position": "4人位"},
            {"id":7, "num":"澳門", "consumption_type":"蛇口", "position": "6人位"}

        ]

    }).service('restaurants', function($resource) { //食飛;
        return [
            {"id":"0","hotel_name":"MGM","restaurant":"天幕咖啡GPC"},
            {"id":"1","hotel_name":"MGM","restaurant":"江戶日本料理"},
            {"id":"2","hotel_name":"MGM","restaurant":"金殿堂"},
            {"id":"3","hotel_name":"MGM","restaurant":"食八方"},
            {"id":"4","hotel_name":"MGM","restaurant":"寶雅座"},
            {"id":"5","hotel_name":"MGM","restaurant":"Cafe Esplanada"},
            {"id":"6","hotel_name":"MGM","restaurant":"永利軒"},
            {"id":"7","hotel_name":"Red 8","restaurant":"天幕咖啡GPC"}
    ]
    });
}).call(this);
