/**
 * Created by Allen.zhang on 2014/8/21.
 */
(function() {
    'use strict';
    angular.module('app.consumption-manager.json', ['ngResource']).service('hotelBookings', function ($resource) {
            return [
                {"consumption_number":"100011","booking_number":"35100258","hall":"永利鉅星","agent_code":"FA233","agent_name":"李達文","agent_type":"普通","consumption_type":"MGM","hotel_name":"永利","room_type":"D","days":"2","in_date":"2014-08-22","out_date":"2014-08-23","registered":"李四","certificate_type":"身份證","certificate_number":"","booker":"李四","booker_phone":"13685225875","payment":"扣消費積分","status":"未核對","remark":"FA23 授權人李四 訂房 已通知",
                    "rooms":[
                        {data:"2014-08-22 週末",cost_price:"1500",selling_price:"2000",number:"2"},
                        {data:"2014-08-23 週末",cost_price:"1600",selling_price:"2000",number:"2"}
                    ]
                },
                {"consumption_number":"100012","booking_number":"35100260","hall":"永利鉅星","agent_code":"FA233","agent_name":"李達文","agent_type":"普通","consumption_type":"MGM","hotel_name":"永利","room_type":"E","days":"2","in_date":"2014-08-22","out_date":"2014-08-23","registered":"李四","certificate_type":"身份證","certificate_number":"","booker":"李四","booker_phone":"13685225875","payment":"扣消費積分","status":"未核對","remark":"FA23 授權人李四 訂房 已通知",
                    "rooms":[
                        {data:"2014-08-22 週末",cost_price:"1500",selling_price:"2000",number:"2"},
                        {data:"2014-08-23 週末",cost_price:"1600",selling_price:"2000",number:"2"}
                    ]
                },
                {"consumption_number":"100013","booking_number":"35100261","hall":"永利鉅星","agent_code":"FA8","agent_name":"王毅","agent_type":"月結","consumption_type":"永利","hotel_name":"MGM","room_type":"D","days":"2","in_date":"2014-08-22","out_date":"2014-08-23","registered":"李四","certificate_type":"身份證","certificate_number":"","booker":"李四","booker_phone":"13685225875","payment":"扣消費積分","status":"未核對","remark":"FA23 授權人李四 訂房 已通知",
                    "rooms":[
                        {data:"2014-08-22 週末",cost_price:"1600",selling_price:"2000",number:"2"},
                        {data:"2014-08-23 週末",cost_price:"1600",selling_price:"2000",number:"2"}
                    ]
                },
                {"consumption_number":"100014","booking_number":"35100262","hall":"永利鉅星","agent_code":"FA8","agent_name":"王毅","agent_type":"月結","consumption_type":"永利","hotel_name":"MGM","room_type":"E","days":"2","in_date":"2014-08-20","out_date":"2014-08-21","registered":"李四","certificate_type":"身份證","certificate_number":"","booker":"李四","booker_phone":"13685225875","payment":"扣消費積分","status":"未核對","remark":"FA23 授權人李四 訂房 已通知",
                    "rooms":[
                        {data:"2014-08-20 平日",cost_price:"1600",selling_price:"1800",number:"2"},
                        {data:"2014-08-21 平日",cost_price:"1600",selling_price:"1800",number:"2"}
                    ]
                }
        ]

    }).service('foodBookings', function ($resource) {
        return [
            {"id":"100011","foodcoupon_consumption_no":"35100258","hall":"永利鉅星","agent_code":"FA233","agent_name":"李三","hotel_name":"LISBOA", "restaurant":"不夜天", "pay_type_id":"現金","cost":"12000","sell":"20000","profit":"8000","trader_tel":"13895252654","trader":"王文", "remark":""},
            {"id":"100012","foodcoupon_consumption_no":"75100259","hall":"永利鉅星","agent_code":"F8","agent_name":"王大文","hotel_name":"MGM", "restaurant":"SPA","pay_type_id":"現金", "cost":"12000","sell":"20000","profit":"8000","trader_tel":"13895252654","trader":"張麗莉", "remark":""},
            {"id":"100013","foodcoupon_consumption_no":"66100777","hall":"永利鉅星","agent_code":"Q66","agent_name":"鐘達","hotel_name":"MGM", "restaurant":"食八方","pay_type_id":"存卡", "cost":"12000","sell":"20000","profit":"8000","trader_tel":"13895252654","trader":"李奉天", "remark":""},
            {"id":"100014","foodcoupon_consumption_no":"551002540","hall":"永利鉅星","agent_code":"XU122","agent_name":"鄭嘉盛","hotel_name":"LISBOA", "restaurant":"葡國餐廳","pay_type_id":"存卡", "cost":"12000","sell":"20000","profit":"8000","trader_tel":"13895252654","trader":"王額", "remark":""},
            {"id":"100015","foodcoupon_consumption_no":"q1003692","hall":"永利鉅星","agent_code":"F257","agent_name":"黃蜂","hotel_name":"WYNN", "restaurant":"CLUB WYNN", "pay_type_id":"積分","cost":"12000","sell":"20000","profit":"8000","trader_tel":"13895252654","trader":"周任", "remark":""},
            {"id":"100016","foodcoupon_consumption_no":"c1000789","hall":"永利鉅星","agent_code":"F8","agent_name":"張品","hotel_name":"WYNN", "restaurant":"CLUB WYNN", "pay_type_id":"佣金","cost":"12000","sell":"20000","profit":"8000","trader_tel":"13895252654","trader":"李小娜", "remark":""}
        ]
    }).service('shipBookings', function ($resource) {
        return [
            {"consumption_number":"100011","booking_number":"35100258","hall":"永利鉅星","agent_code":"FA233","agent_name":"李達文","agent_type":"普通","booking_name":"王文","phone":"13895252654","payment":"扣消費積分","remark":"",
                "ships":[
                    {departure:"澳門",destination:"香港九龍 ",position:"經濟位",cost_price:"300","selling_price":"600",number:"3"},
                    {departure:"澳門",destination:"深圳機場[福永] ",position:"貴賓廂",cost_price:"300","selling_price":"600",number:"3"},
                    {departure:"澳門",destination:"深圳機場[福永] ",position:"貴賓廂",cost_price:"300","selling_price":"600",number:"3"}
                ]
            },
            {"consumption_number":"100012","booking_number":"35100259","hall":"永利鉅星","agent_code":"FA233","agent_name":"李達文","agent_type":"普通","booking_name":"王文","phone":"13895252654","payment":"扣消費積分","remark":"",
                "ships":[
                    {departure:"澳門",destination:"香港九龍 ",position:"經濟位",cost_price:"300","selling_price":"600",number:"3"},
                    {departure:"澳門",destination:"香港",position:"貴賓廂",cost_price:"300","selling_price":"600",number:"3"},
                    {departure:"澳門",destination:"深圳機場[福永] ",position:"貴賓廂",cost_price:"300","selling_price":"600",number:"3"}
                ]
            },
            {"consumption_number":"100013","booking_number":"35100260","hall":"永利鉅星","agent_code":"FA8","agent_name":"王毅","agent_type":"月結","booking_name":"王志文","phone":"13895252654","payment":"扣消費積分","remark":"",
                "ships":[
                    {departure:"澳門",destination:"香港九龍 ",position:"經濟位",cost_price:"300","selling_price":"600",number:"3"},
                    {departure:"澳門",destination:"深圳機場[福永] ",position:"貴賓廂",cost_price:"300","selling_price":"600",number:"3"},
                    {departure:"澳門",destination:"蛇口",position:"貴賓廂",cost_price:"300","selling_price":"600",number:"3"}
                ]
            },
            {"consumption_number":"100014","booking_number":"35100261","hall":"永利鉅星","agent_code":"FA8","agent_name":"王毅","agent_type":"月結","booking_name":"王志文","phone":"13895252654","payment":"扣消費積分","remark":"",
                "ships":[
                    {departure:"澳門",destination:"香港九龍 ",position:"經濟位",cost_price:"300","selling_price":"600",number:"3"},
                    {departure:"澳門",destination:"深圳機場[福永] ",position:"貴賓廂",cost_price:"300","selling_price":"600",number:"3"},
                    {departure:"澳門",destination:"深圳機場[福永] ",position:"貴賓廂",cost_price:"300","selling_price":"600",number:"3"}
                ]
            }
        ]

    }).service('helicopterBookings', function ($resource) {
        return [
                {  "id":"100011","agent_info_id":"1","agent_code":"FA233","agent_name":"李達文","hall_id":"","hall":"永利鉅星","helicopter_conaumption_no":"351000258","from_place_id":"0","from_place":"澳門","to_place_id":"1","to_place":"香港","setout_date":"2014-09-05","setout_time":"14:00","cost_price":"1000","sell_price":"1250","count":"2","cost_total":"2000","sell_total":"2500","profit":"500","pay_type_id":"現金","status":"已核對","trader":"李四","trader_tel":"156598754582"," remark":"",
                    "passengers":[
                        {"passenger":"王文","idcard_type_id":"1","idcard_no":"1234565484845"}
                    ]
                }
        ]
    }).service('airBookings', function ($resource) {
        return [
            {  "id":"100011","agent_info_id":"1","agent_code":"FA233","agent_name":"李達文","hall_id":"","hall":"永利鉅星","flight_consumption_no":"351000258",   "flight_type":"單程","consumption_type_id":"UO","from_place":"澳門","to_place":"香港","departure_date":"2014-09-05","departure_time":"14:00","flight_no":"T003", "seat_type":"經濟艙","count":"2","cost_total":"2000","sell_total":"2500","profit":"500","pay_type_id":"現金","trader":"李四","trader_tel":"156598754582","status":"已核對",
                "passengers":[
                    {"passenger":"","idcard_type_id":"","idcard_no":""}
                ]
            }
        ]
    }).service('carBookings', function ($resource) {
        return [
            {"id":"100011","agent_info_id":"1","agent_code":"FA233","agent_name":"李達文","hall_id":"","hall":"永利鉅星","consumption_type_id":"UO","car_consumption_no":"351000258","car_type":"鉅旅-兩地牌","from_place":"澳門","to_place":"香港","departure_date":"2014-09-05","departure_time":"14:00","count":"2","cost_price":"300","sell_price":"350","cost_total":"600","sell_total":"700","profit":"100","pay_type_id":"現金","trader":"李四","trader_tel":"156598754582","status":"已核對"}
        ]
    }).service('ticketBookings', function ($resource) {
        return [
            {  "id":"100011","agent_info_id":"1","agent_code":"FA233","agent_name":"李達文","hall_id":"","hall":"永利鉅星","consumption_type_id":"UO","ticket_consumption_no":"351000258","ticket_type":"演唱會","show_date":"2014-09-05","show_time":"14:00","cost_price":"1000","sell_price":"1500","count":"2","cost_total":"2000","sell_total":"3500","profit":"1500","pay_type_id":"現金","trader":"李四","trader_tel":"156598754582","status":"已核對"}
        ]
    }).service('otherBookings', function ($resource) {
        return [
            {  "id":"100011","agent_info_id":"1","agent_code":"FA233","agent_name":"李達文","hall_id":"","hall":"永利鉅星","consumption_type_id":"UO","other_consumption_no":"351000258","count":"2","cost_price":"1000","sell_price":"1500","cost_total":"2000","sell_total":"3000","profit":"1000","pay_type_id":"現金","trader":"李四","trader_tel":"156598754582","status":"已核對","remark":""}
        ]
    }).factory('agentsList',[
        '$resource',function($resource){
            return $resource('data/agent/agents.json', {}, {
                query: {method:'GET',isArray:true}
            });
        }
    ]).service("hotels",function($resource){
        return[
            { "hotel_name":"永利"},
            { "hotel_name":"MGM"},
            { "hotel_name":"新葡京"},
            { "hotel_name":"銀河"},
            { "hotel_name":"舊葡京"}
        ]
    }).service('roomsSets', function($resource){
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
              {"id":12, "hotel_name":"舊葡京", "room_type":"D", "ordinary_cost_price":"1500", "ordinary_selling_price":"1800", "weekend_cost_price":"1600", "weekend_selling_price":"2000", "especially_cost_price":"1800", "especially_selling_price":"2300", "remark":"機場班車服務"},
              {"id":13,"hotel_name":"舊葡京", "room_type":"E", "ordinary_cost_price":"2500", "ordinary_selling_price":"2800",	"weekend_cost_price":"2600", "weekend_selling_price":"3200", "especially_cost_price":"2800", "especially_selling_price":"3500", "remark":""},
              {"id":14,"hotel_name":"舊葡京", "room_type":"G", "ordinary_cost_price":"3000", "ordinary_selling_price":"3200", "weekend_cost_price":"3200", "weekend_selling_price":"3500", "especially_cost_price":"3500", "especially_selling_price":"3800", "remark":"外幣兌換"},
              {"id":15,"hotel_name":"舊葡京", "room_type":"SK", "ordinary_cost_price":"4000", "ordinary_selling_price":"4300", "weekend_cost_price":"4200", "weekend_selling_price":"4500", "especially_cost_price":"4500", "especially_selling_price":"5000", "remark":""}
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

    }).service('shipBookingTrips', function($resource){ //行程設定
        return [

            {"id":1, "departure":"澳門", "destination":"香港", "position": "豪華位",cost_price:"500","selling_price":"600"},
            {"id":2, "departure":"澳門", "destination":"香港", "position": "貴賓位",cost_price:"550","selling_price":"650"},
            {"id":3, "departure":"澳門", "destination":"香港", "position": "4人位",cost_price:"300","selling_price":"500"},
            {"id":4, "departure":"澳門", "destination":"香港", "position": "6人位",cost_price:"600","selling_price":"700"},
            {"id":5, "departure":"澳門", "destination":"蛇口", "position": "經濟位",cost_price:"300","selling_price":"600"},
            {"id":6, "departure":"澳門", "destination":"蛇口", "position": "豪華位",cost_price:"400","selling_price":"600"},
            {"id":7, "departure":"澳門", "destination":"蛇口", "position": "貴賓位",cost_price:"600","selling_price":"700"},
            {"id":8, "departure":"澳門", "destination":"蛇口", "position": "4人位",cost_price:"400","selling_price":"550"},
            {"id":9, "departure":"澳門", "destination":"蛇口", "position": "6人位",cost_price:"550","selling_price":"600"},
            {"id":10, "departure":"澳門", "destination":"香港", "position": "經濟位",cost_price:"300","selling_price":"600"}

        ]

    }).service('agents', function($resource){ //行程設定
        return [
            {"agent_code":"FA233","agent_name":"李達文","agent_type":"普通"},
            {"agent_code":"FA8","agent_name":"王毅","agent_type":"月結"}
        ]

    });
}).call(this);
