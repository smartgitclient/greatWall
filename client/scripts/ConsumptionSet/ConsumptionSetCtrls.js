/**
 * Created by Allen.zhang on 2014/8/25.
 */


(function() {
    'use strict';
    angular.module('app.consumption-set.ctrls',['app.consumption-set.services','app.consumption-manager.json']).controller('consumptionSetManagerCtrls',['$scope','breadcrumb','$stateParams', 'tmsPagination', 'globalFunction', 'carType',
'consumptionHoteltravel', 'ticketType', function($scope,breadcrumb,$stateParams, tmsPagination, globalFunction, carType, consumptionHoteltravel, ticketType){
        breadcrumb.items = [
            {"name":"消費設定","active":true}
        ];

        // common params
        if(angular.isUndefined($scope.bookingState_items)){
            //$scope.car_types = carType.query();
            //$scope.ticket_types = ticketType.query();
        }
        $scope.halls = _.where(JSON.parse(sessionStorage.getItem("halls")), { hall_type : "2"});

        //根据 url 参数 改变 views
        $scope.type = $stateParams.type;
        $scope.tabs = {
            hotel : false,
            room : false,
            food: false,
            helicopter: false,
            ship: false,
            air: false,
            car: false,
            ticket: false,
            other: false,
            travel: false
        }
        $scope.tabs[$scope.type] = true;

        //Get_booking_data($scope.type);

        //点击 tab  切换界面 搜索出相关信息
        $scope.tabClick = function(name) {
            //Get_booking_data(name);
            $scope.type = name;
        }

        function Get_booking_data(name)
        {
            var tab_content_list = $scope[name + 'Bookings'];
            var search_method = $scope[name + '_search'];
            if (!!tab_content_list && !tab_content_list.length)
            {
                search_method();
            }
        }

    }]).controller('consumptionSetRoomCtrls',['$scope','tmsPagination', 'globalFunction', 'pinCodeModal', 'topAlert', 'hotelLists', 'consumptionRoomtype', '$filter','specialDay','dateFilter',
        function($scope, tmsPagination, globalFunction, pinCodeModal, topAlert, hotelLists ,consumptionRoomtype, $filter,specialDay,dateFilter) {

            $scope.hotel_lists = hotelLists.query(globalFunction.generateUrlParams({}, {}));
            $scope.sub_post_put = 'POST';
            $scope.form_url = globalFunction.getApiUrl('consumption/roomtype');
            $scope.isDisabled = false;

            var room_init = {
                hotel_id : "",
                room_type: "",
                weekday_cost: "",
                weekday_sell: "",
                weekend_cost: "",
                weekend_sell: "",
                special_cost: "",
                special_sell: "",
                remark : "",
                pin_code : ""
            }
            var room_original = angular.copy(room_init);
            $scope.room = angular.copy(room_init);

            $scope.condition = {
                hotel_id : "",
                room_type : ""
            }

            $scope.page = tmsPagination.create();
            $scope.page.resource = consumptionRoomtype;

            $scope.search = function(page)
            {
                var tmp_condition = angular.copy($scope.condition);
                if(tmp_condition.room_type)
                {
                    tmp_condition.room_type = '!'+tmp_condition.room_type+'!';
                }
                $scope.rooms = $scope.page.select(page, tmp_condition, {});
            }
            $scope.search();


            $scope.submit = function()
            {

                var room_copy = angular.copy($scope.room);
                room_copy.weekday_cost = $filter('parseYuanToTenThousand')(room_copy.weekday_cost);
                room_copy.weekday_sell = $filter('parseYuanToTenThousand')(room_copy.weekday_sell);
                room_copy.weekend_cost = $filter('parseYuanToTenThousand')(room_copy.weekend_cost);
                room_copy.weekend_sell = $filter('parseYuanToTenThousand')(room_copy.weekend_sell);
                room_copy.special_cost = $filter('parseYuanToTenThousand')(room_copy.special_cost);
                room_copy.special_sell = $filter('parseYuanToTenThousand')(room_copy.special_sell);

                room_copy.weekday_cost = $filter('parseYuan')(room_copy.weekday_cost);
                room_copy.weekday_sell = $filter('parseYuan')(room_copy.weekday_sell);
                room_copy.weekend_cost = $filter('parseYuan')(room_copy.weekend_cost);
                room_copy.weekend_sell = $filter('parseYuan')(room_copy.weekend_sell);
                room_copy.special_cost = $filter('parseYuan')(room_copy.special_cost);
                room_copy.special_sell = $filter('parseYuan')(room_copy.special_sell);

                var sub_method = consumptionRoomtype.save;
                var tis = "添加成功";
                if('PUT' == $scope.sub_post_put)
                {
                    sub_method = consumptionRoomtype.update;
                    tis = "修改成功";
                }
                if($scope.isDisabled){ return; }
                $scope.isDisabled = true;

                $scope.form_room.checkValidity().then(function()
                {
                    sub_method(room_copy, function() {
                        topAlert.success(tis);
                        $scope.isDisabled = false;
                        $scope.search();
                        $scope.form_room.clearErrors();
                        $scope.cancle_update();
                    }, function()
                    {
                        $scope.isDisabled = false;
                    });
                });
            }

            $scope.search_reset = function()
            {
                $scope.condition = {
                    hotel_id : "",
                    room_type : "",
                    price  : ["",""]
                }
                $scope.search();
            }

            $scope.cancle_update  = function()
            {
                $scope.sub_post_put = 'POST';
                room_original = angular.copy(room_init);
                $scope.room = angular.copy(room_init);
                $scope.form_room.clearErrors();
            }
            $scope.reset = function()
            {
                $scope.form_room.clearErrors();
                $scope.room = angular.copy(room_original);
            }

            $scope.update = function(id)
            {
                var room = _.findWhere($scope.rooms, {id: id});
                if(room)
                {
                    $scope.sub_post_put = 'PUT';
                    room_original.id = id;
                    room_original.hotel_id =  room.hotel_id;
                    room_original.room_type = room.room_type;
                    room_original.weekday_cost = $filter('parseTenThousandToYuan')(room.weekday_cost, false);
                    room_original.weekday_sell = $filter('parseTenThousandToYuan')(room.weekday_sell, false);
                    room_original.weekend_cost = $filter('parseTenThousandToYuan')(room.weekend_cost, false);
                    room_original.weekend_sell = $filter('parseTenThousandToYuan')(room.weekend_sell, false);
                    room_original.special_cost = $filter('parseTenThousandToYuan')(room.special_cost, false);
                    room_original.special_sell = $filter('parseTenThousandToYuan')(room.special_sell, false);
                    room_original.remark = room.remark;

                    $scope.room = angular.copy(room_original);
                }
            }
            $scope.delete = function(id)
            {
                pinCodeModal(consumptionRoomtype, 'delete', {id: id}, '刪除成功！').then(function () {
                    $scope.search();
                    if(id == room_original.id){
                        $scope.cancle_update()
                    }
                })
            }
            //Special Day
            $scope.is_special_day_submit = true;
            $scope.updateSpecialDayData = function(){
                specialDay.query().$promise.then(function(data){
                    $scope.special_day_datas = data;
                    $scope.special_days = _.pluck(data, 'special_day')
                });
            }

            $scope.isSpecialDay = function(day){
                return _.contains($scope.special_days,dateFilter(day,'yyyy-MM-dd'));
            }
            $scope.specialDaySubmit = function(){
                if($scope.special_day){
                    $scope.is_special_day_submit = false;
                    specialDay.save({"special_day":dateFilter($scope.special_day,'yyyy-MM-dd'),"pin_code":$scope.pin_code}).$promise.then(function(){
                        topAlert.success("新增特別日期成功");
                        $scope.updateSpecialDayData();
                        $scope.is_special_day_submit = true;
                        $scope.special_day = "";
                        $scope.pin_code = "";
                    },function(){
                        $scope.is_special_day_submit = true;
                    })
                }else{
                    specialDaySubmit
                }
            }
            $scope.specialDayCancel = function(){
                if($scope.special_day){
                    $scope.is_special_day_submit = false;
                    var temp = _.findWhere($scope.special_day_datas,{"special_day":dateFilter($scope.special_day,'yyyy-MM-dd')});
                    specialDay.delete({"id":temp.id,"pin_code":$scope.pin_code}).$promise.then(function(){
                        topAlert.success("撤銷特別日期成功");
                        $scope.updateSpecialDayData();
                        $scope.is_special_day_submit = true;
                        $scope.special_day = "";
                        $scope.pin_code = "";
                    },function(){
                        $scope.is_special_day_submit = true;
                    })
                }else{
                    specialDaySubmit
                }
            }

            $scope.updateSpecialDayData();


    }]).controller('consumptionSetFoodFlyCtrls',['$scope', 'tmsPagination', 'globalFunction', 'restaurant', 'pinCodeModal', 'topAlert', 'hotelLists',
        function($scope, tmsPagination, globalFunction, restaurant, pinCodeModal, topAlert, hotelLists){

            $scope.hotel_lists = hotelLists.query(globalFunction.generateUrlParams({}, {restaurants : {} }));

            $scope.sub_post_put = 'POST';
            $scope.form_url = globalFunction.getApiUrl('consumption/restaurant');
            $scope.isDisabled = false;

            var food_init = {
                hotel_id : "",
                restaurant_name : "",
                pin_code : ""
            }
            var food_original = angular.copy(food_init);
            $scope.food = angular.copy(food_init);

            $scope.condition = {
                hotel_id : "",
                restaurant_name : ""
            }

            $scope.page = tmsPagination.create();
            $scope.page.resource = restaurant;

            $scope.search = function(page)
            {
                var tmp_condition = angular.copy($scope.condition);
                if(tmp_condition.restaurant_name)
                {
                    tmp_condition.restaurant_name = '!'+tmp_condition.restaurant_name+'!';
                }
                $scope.restaurants = $scope.page.select(page, tmp_condition, {});
            }
            $scope.search();


            $scope.submit = function()
            {
                var sub_method = restaurant.save;
                var tis = "添加成功";
                if('PUT' == $scope.sub_post_put)
                {
                    sub_method = restaurant.update;
                    tis = "修改成功";
                }
                if($scope.isDisabled){ return; }
                $scope.isDisabled = true;

                $scope.form_food.checkValidity().then(function()
                {
                    sub_method($scope.food, function() {
                        topAlert.success(tis);
                        $scope.isDisabled = false;
                        $scope.search();
                        $scope.form_food.clearErrors();
                        $scope.cancle_update();
                    }, function()
                    {
                        $scope.isDisabled = false;
                    });
                });
            }

            $scope.cancle_update  = function()
            {
                $scope.sub_post_put = 'POST';
                food_original = angular.copy(food_init);
                $scope.food = angular.copy(food_init);
                $scope.form_food.clearErrors();
            }
            $scope.reset = function()
            {
                $scope.form_food.clearErrors();
                $scope.food = angular.copy(food_original);
            }

            $scope.update = function(id)
            {
                var food = _.findWhere($scope.restaurants, {id: id});
                if(food)
                {
                    $scope.sub_post_put = 'PUT';
                    food_original.id = id;
                    food_original.hotel_id = food.hotel_id;
                    food_original.restaurant_name = food.restaurant_name;
                    $scope.food = angular.copy(food_original);
                }
            }
            $scope.delete = function(id)
            {
                pinCodeModal(restaurant, 'delete', {id: id}, '刪除成功！').then(function () {
                    $scope.search();
                    if(id == food_original.id){
                        $scope.cancle_update()
                    }
                })
            }

        }]).controller('ConsumptionSetHelicopterRouteCtrls',['$scope','tmsPagination','helicopterCity', 'globalFunction', 'pinCodeModal', 'topAlert', 'helicopterTrip', '$filter',
    function($scope,tmsPagination,helicopterCity, globalFunction, pinCodeModal, topAlert, helicopterTrip, $filter){

        $scope.helicopter_citys = helicopterCity.query();

        $scope.sub_post_put = 'POST';
        $scope.form_url = globalFunction.getApiUrl('consumption/helicoptertrip');
        $scope.isDisabled = false;

        var helicopter_init = {
            from_place_id : "",
            to_place_id : "",
            setout_time : "",
            pin_code : ""
        }
        var helicopter_original = angular.copy(helicopter_init);
        $scope.helicopter = angular.copy(helicopter_init);

        $scope.condition = {
            from_place_id : "",
            to_place_id : ""
        }

        $scope.page = tmsPagination.create();
        $scope.page.resource = helicopterTrip;

        $scope.search = function(page)
        {
            $scope.helicopter_trips = $scope.page.select(page, $scope.condition, {});
        }

        $scope.search();

        $scope.submit = function()
        {
            var tmp_helicopter = angular.copy($scope.helicopter);
            if('string'  == typeof(tmp_helicopter.setout_time) ){
                tmp_helicopter.setout_time =tmp_helicopter.setout_time.substring(11);
            }else{
                tmp_helicopter.setout_time = $filter('date')(tmp_helicopter.setout_time, 'HH:mm');
            }

            var sub_method = helicopterTrip.save;
            var tis = "添加成功";
            if('PUT' == $scope.sub_post_put)
            {
                sub_method = helicopterTrip.update;
                tis = "修改成功";
            }
            if($scope.isDisabled){ return; }
            $scope.isDisabled = true;

            $scope.form_helicopter.checkValidity().then(function()
            {
                sub_method(tmp_helicopter, function() {
                    topAlert.success(tis);
                    $scope.isDisabled = false;
                    $scope.search();
                    $scope.form_helicopter.clearErrors();
                    $scope.cancle_update();
                }, function()
                {
                    $scope.isDisabled = false;
                });
            });
        }

        $scope.cancle_update  = function()
        {
            $scope.sub_post_put = 'POST';
            helicopter_original = angular.copy(helicopter_init);
            $scope.helicopter = angular.copy(helicopter_init);
            $scope.form_helicopter.clearErrors();
        }
        $scope.reset = function()
        {
            $scope.form_helicopter.clearErrors();
            $scope.helicopter = angular.copy(helicopter_original);
        }

        $scope.reset_search = function()
        {
            $scope.condition = {
                from_place_id : "",
                to_place_id : ""
            }
            $scope.search();
        }

        $scope.update = function(id)
        {
            var helicopter = _.findWhere($scope.helicopter_trips, {id: id});
            if(helicopter)
            {
                $scope.sub_post_put = 'PUT';
                helicopter_original.id = id;
                helicopter_original.from_place_id = helicopter.from_place_id;
                helicopter_original.to_place_id = helicopter.to_place_id;
                //helicopter_original.setout_time = $filter('date')(helicopter.setout_time, 'yyyy-MM-dd HH-mm-ss');
                var date = $filter('date')(new Date(), 'yyyy-MM-dd');
                helicopter_original.setout_time = date + ' ' +helicopter.setout_time;
                $scope.helicopter = angular.copy(helicopter_original);
            }
        }
        $scope.delete = function(id)
        {
            pinCodeModal(helicopterTrip, 'delete', {id: id}, '刪除成功！').then(function () {
                $scope.search();
                if(id == helicopter_original.id){
                    $scope.cancle_update()
                }
            })
        }


    }]).controller('ConsumptionSetHelicopterCtrls',['$scope','tmsPagination','helicopterCity', 'globalFunction', 'pinCodeModal', 'topAlert', '$location',
        function($scope,tmsPagination, helicopterCity, globalFunction, pinCodeModal, topAlert, $location){

            $scope.helicopter_citys = helicopterCity.query();

            $scope.sub_post_put = 'POST';
            $scope.form_url = globalFunction.getApiUrl('consumption/helicoptercity');
            $scope.isDisabled = false;

            $scope.helicopter = {
                helicopter_city : ""
            }

            $scope.page = tmsPagination.create();
            $scope.page.resource = helicopterCity;

            $scope.submit = function()
            {
                if($scope.isDisabled){ return; }
                $scope.isDisabled = true;

                $scope.form_helicopter.checkValidity().then(function()
                {
                    pinCodeModal(helicopterCity, 'save', $scope.helicopter, '添加成功！').then(function () {
                        $scope.isDisabled = false;
                        $scope.helicopter_citys = helicopterCity.query();
                        $scope.form_helicopter.clearErrors();
                        $scope.cancle_update();
                    }, function()
                    {
                        $scope.isDisabled = false;
                    })
                });
            }

            $scope.delete = function(id)
            {
                pinCodeModal(helicopterCity, 'delete', {id: id}, '刪除成功！').then(function () {
                    $scope.helicopter_citys = helicopterCity.query();
                })
            }

            $scope.goback = function()
            {
                $location.path('/consumption-set/consumption-set-manager/helicopter');
            }


    }]).controller('ConsumptionSetShipTicketCtrls',['$scope', '$stateParams', 'tmsPagination', 'globalFunction', 'topAlert', 'pinCodeModal', 'boatTrip', 'boatCity', 'boatSeatType', '$filter', function($scope, $stateParams, tmsPagination, globalFunction, topAlert, pinCodeModal, boatTrip, boatCity, boatSeatType, $filter){

        $scope.boat_citys = boatCity.query();
        $scope.boat_seat_types= boatSeatType.query();
        //$scope.boat_trips = boatTrip.query();
        $scope.sub_post_put = 'POST';
        $scope.form_url = globalFunction.getApiUrl('consumption/boattrip');
        $scope.isDisabled = false;

        var ship_init = {
            from_place_id : "",
            to_place_id : "",
            seat_type_id : "",
            cost_price : "",
            sell_price : "",
            pin_code : ""
        }
        var ship_original = angular.copy(ship_init);
        $scope.ship = angular.copy(ship_init);

        $scope.condition = {
            from_place_id : "",
            to_place_id : "",
            seat_type_id : ""
        }

        $scope.page = tmsPagination.create();
        $scope.page.resource = boatTrip;

        $scope.search = function(page)
        {
            $scope.boat_trips = $scope.page.select(page, $scope.condition, {});
        }
        $scope.search();


        $scope.submit = function()
        {
            var ship_copy = angular.copy($scope.ship);

            ship_copy.cost_price = $filter('parseYuanToTenThousand')(ship_copy.cost_price);
            ship_copy.sell_price = $filter('parseYuanToTenThousand')(ship_copy.sell_price);

            ship_copy.cost_price = $filter('parseYuan')(ship_copy.cost_price);
            ship_copy.sell_price = $filter('parseYuan')(ship_copy.sell_price);

            var sub_method = boatTrip.save;
            var tis = "添加成功";
            if('PUT' == $scope.sub_post_put)
            {
                sub_method = boatTrip.update;
                tis = "修改成功";
            }
            if($scope.isDisabled){ return; }
            $scope.isDisabled = true;

            $scope.form_ship.checkValidity().then(function()
            {
                sub_method(ship_copy, function() {
                    topAlert.success(tis);
                    $scope.isDisabled = false;
                    $scope.search();
                    $scope.form_ship.clearErrors();
                    $scope.cancle_update();
                }, function()
                {
                    $scope.isDisabled = false;
                });
            });
        }

        $scope.cancle_update  = function()
        {
            $scope.sub_post_put = 'POST';
            ship_original = angular.copy(ship_init);
            $scope.ship = angular.copy(ship_init);
            $scope.form_ship.clearErrors();
        }
        $scope.reset = function()
        {
            $scope.form_ship.clearErrors();
            $scope.ship = angular.copy(ship_original);
        }

        $scope.search_reset = function()
        {
            $scope.condition = {
                from_place_id : "",
                to_place_id : "",
                seat_type_id : ""
            }
            $scope.search();
        }

        $scope.update = function(id)
        {
            var ship = _.findWhere($scope.boat_trips, {id: id});
            if(ship)
            {
                $scope.sub_post_put = 'PUT';
                ship_original.id = id;
                ship_original.from_place_id = ship.from_place_id;
                ship_original.to_place_id = ship.to_place_id;
                ship_original.seat_type_id = ship.seat_type_id;
                ship_original.cost_price = $filter('parseTenThousandToYuan')(ship.cost_price, false);
                ship_original.sell_price = $filter('parseTenThousandToYuan')(ship.sell_price, false);

                $scope.ship = angular.copy(ship_original);
            }
        }
        $scope.delete = function(id)
        {
            pinCodeModal(boatTrip, 'delete', {id: id}, '刪除成功！').then(function () {
                $scope.search();
                if(id == ship_original.id){
                    $scope.cancle_update()
                }
            })
        }


    }]).controller('ConsumptionSetShipBascCtrls',['$scope','tmsPagination','boatCity', 'globalFunction', 'pinCodeModal', 'topAlert', '$location', 'boatSeatType',
        function($scope,tmsPagination, boatCity, globalFunction, pinCodeModal, topAlert, $location, boatSeatType){

            $scope.sub_post_put = 'POST';
            $scope.form_url = globalFunction.getApiUrl('consumption/boatseattype');
            $scope.isDisabled = false;
            $scope.isDisabled_seat = false

            $scope.ship = {
                boat_city : ""
            }

            $scope.seat = {
                boat_seat_type : ""
            }

            $scope.page = tmsPagination.create();
            $scope.page.resource = boatCity;

            $scope.page_seat = tmsPagination.create();
            $scope.page_seat.resource = boatSeatType;

            $scope.search = function()
            {
                $scope.boat_citys = boatCity.query();
            }
            $scope.search_seat = function()
            {
                $scope.boat_seat_types = boatSeatType.query();
            }
            $scope.search();
            $scope.search_seat();

            $scope.submit = function()
            {
                if($scope.isDisabled){ return; }
                $scope.isDisabled = true;

                if("" == $scope.ship.boat_city)
                {
                    topAlert.warning('請填寫城市。');
                    $scope.isDisabled = false;
                    return false;
                }

                $scope.form_ship.checkValidity().then(function()
                {
                    pinCodeModal(boatCity, 'save', $scope.ship, '添加成功！').then(function () {
                        $scope.isDisabled = false;
                        $scope.search();
                        $scope.form_ship.clearErrors();
                        $scope.cancle_update();
                    }, function()
                    {
                        $scope.isDisabled = false;
                    })
                });
            }

            $scope.cancle_update = function()
            {
                $scope.ship = {
                    boat_city : ""
                }
            }

            $scope.delete = function(id)
            {
                pinCodeModal(boatCity, 'delete', {id: id}, '刪除成功！').then(function () {
                    $scope.search();
                })
            }

            $scope.submit_seat = function()
            {
                if($scope.isDisabled_seat){ return; }
                $scope.isDisabled_seat = true;

                if("" == $scope.seat.boat_seat_type)
                {
                    topAlert.warning('請填寫城市。');
                    $scope.isDisabled_seat = false;
                    return false;
                }
                $scope.form_seat.checkValidity().then(function()
                {
                    pinCodeModal(boatSeatType, 'save', $scope.seat, '添加成功！').then(function () {
                        $scope.isDisabled_seat = false;
                        $scope.search_seat();
                        $scope.form_seat.clearErrors();
                        $scope.cancle_update_seat();
                    }, function()
                    {
                        $scope.isDisabled_seat = false;
                    })
                    /*boatSeatType.save($scope.seat, function() {
                        topAlert.success("添加成功");
                        $scope.isDisabled_seat = false;
                        $scope.search_seat();
                        $scope.form_seat.clearErrors();
                        $scope.cancle_update_seat();
                    }, function()
                    {
                        $scope.isDisabled = false;
                    });*/
                });
            }

            $scope.cancle_update_seat = function()
            {
                $scope.seat = {
                    boat_seat_type : ""
                }
            }

            $scope.delete_seat = function(id)
            {
                pinCodeModal(boatSeatType, 'delete', {id: id}, '刪除成功！').then(function () {
                    $scope.search_seat();
                })
            }

            $scope.goback = function()
            {
                $location.path('/consumption-set/consumption-set-manager/ship');
            }


    }]).controller('consumptionSetAirCtrls',['$scope', '$stateParams', 'tmsPagination', 'globalFunction', 'topAlert', 'pinCodeModal', 'flightSeatType',
        function($scope, $stateParams, tmsPagination, globalFunction, topAlert, pinCodeModal, flightSeatType){

            $scope.sub_post_put = 'POST';
            $scope.form_url = globalFunction.getApiUrl('consumption/flightseattype');
            $scope.isDisabled = false;

            var air_init = {
                flight_seat_type : "",
                pin_code : ""
            }
            var air_original = angular.copy(air_init);
            $scope.air = angular.copy(air_init);

            $scope.condition = {
                flight_seat_type : ""
            }

            $scope.page = tmsPagination.create();
            $scope.page.resource = flightSeatType;

            $scope.search = function(page)
            {
                var tmp_type = angular.copy($scope.condition);
                if(tmp_type.flight_seat_type)
                {
                    tmp_type.flight_seat_type = '!'+tmp_type.flight_seat_type+'!';
                }
                $scope.flight_seat_types = $scope.page.select(page, tmp_type, {});
            }
            $scope.search();

            $scope.submit = function()
            {
                var sub_method = flightSeatType.save;
                var tis = "添加成功";
                if('PUT' == $scope.sub_post_put)
                {
                    sub_method = flightSeatType.update;
                    tis = "修改成功";
                }
                if($scope.isDisabled) { return ; }
                $scope.isDisabled = true;
                $scope.form_air.checkValidity().then(function()
                {
                    sub_method($scope.air, function() {
                        topAlert.success(tis);
                        $scope.isDisabled = false;
                        $scope.search();
                        $scope.form_air.clearErrors();
                        $scope.cancle_update();
                    }, function()
                    {
                        $scope.isDisabled = false;
                    });
                });
            }

            $scope.cancle_update  = function()
            {
                $scope.sub_post_put = 'POST';
                air_original = angular.copy(air_init);
                $scope.air = angular.copy(air_init);
                $scope.form_air.clearErrors();
            }
            $scope.reset = function()
            {
                $scope.form_air.clearErrors();
                $scope.air = angular.copy(air_original);
            }

            $scope.update = function(id)
            {
                var air = _.findWhere($scope.flight_seat_types, {id: id});
                if(air)
                {
                    $scope.sub_post_put = 'PUT';
                    air_original.id = id;
                    air_original.flight_seat_type = air.flight_seat_type;
                    $scope.air = angular.copy(air_original);
                }
            }
            $scope.delete = function(id)
            {
                pinCodeModal(flightSeatType, 'delete', {id: id}, '刪除成功！').then(function () {
                    $scope.search();
                    if(id == air_original.id){
                        $scope.cancle_update()
                    }
                })
            }

    }]).controller('consumptionSetCarCtrls',['$scope', '$stateParams', 'tmsPagination', 'globalFunction', 'carType', 'topAlert', 'pinCodeModal',
        function($scope, $stateParams, tmsPagination, globalFunction, carType, topAlert, pinCodeModal){

            $scope.sub_post_put = 'POST';
            $scope.form_url = globalFunction.getApiUrl('consumption/cartype');
            $scope.isDisabled = false;

            var car_init = {
                car_type : "",
                pin_code : ""
            }
            var car_original = angular.copy(car_init);
            $scope.car = angular.copy(car_init);

            $scope.condition = {
                car_type : ""
            }

            $scope.page = tmsPagination.create();
            $scope.page.resource = carType;

            $scope.search = function(page)
            {
                var tmp_condition = angular.copy($scope.condition);
                if(tmp_condition.car_type)
                {
                    tmp_condition.car_type = '!'+tmp_condition.car_type+'!';
                }
                $scope.car_types = $scope.page.select(page, tmp_condition, {});
            }
            $scope.search();


            $scope.submit = function()
            {
                var sub_method = carType.save;
                var tis = "添加成功";
                if('PUT' == $scope.sub_post_put)
                {
                    sub_method = carType.update;
                    tis = "修改成功";
                }
                if($scope.isDisabled) { return ; }
                $scope.isDisabled = true;

                $scope.form_car.checkValidity().then(function()
                {
                    sub_method($scope.car, function() {
                        topAlert.success(tis);
                        $scope.isDisabled = false;
                        $scope.search();
                        $scope.form_car.clearErrors();
                        $scope.cancle_update();
                    }, function()
                    {
                        $scope.isDisabled = false;
                    });
                });
            }

            $scope.cancle_update  = function()
            {
                $scope.sub_post_put = 'POST';
                car_original = angular.copy(car_init);
                $scope.car = angular.copy(car_init);
                $scope.form_car.clearErrors();
            }
            $scope.reset = function()
            {
                $scope.form_car.clearErrors();
                $scope.car = angular.copy(car_original);
            }

            $scope.update = function(id)
            {
                var car = _.findWhere($scope.car_types, {id: id});
                if(car)
                {
                    $scope.sub_post_put = 'PUT';
                    car_original.id = id;
                    car_original.car_type = car.car_type;
                    $scope.car = angular.copy(car_original);
                }
            }
            $scope.delete = function(id)
            {
                pinCodeModal(carType, 'delete', {id: id}, '刪除成功！').then(function () {
                    $scope.search();
                    if(id == car_original.id){
                        $scope.cancle_update()
                    }
                })
            }

    }]).controller('consumptionSetTicketCtrls', ['$scope', '$stateParams', 'tmsPagination', 'globalFunction', 'ticketType', 'topAlert', 'pinCodeModal', function($scope, $stateParams, tmsPagination, globalFunction, ticketType, topAlert, pinCodeModal){

        $scope.sub_post_put = 'POST';
        $scope.form_url = globalFunction.getApiUrl('consumption/tickettype');
        $scope.isDisabled = false;

        var ticket_init = {
            ticket_type : "",
            pin_code : ""
        }
        var ticket_original = angular.copy(ticket_init);
        $scope.ticket = angular.copy(ticket_init);

        $scope.condition = {
            ticket_type : ""
        }

        $scope.page = tmsPagination.create();
        $scope.page.resource = ticketType;

        $scope.search = function(page)
        {
            var tmp_condition = angular.copy($scope.condition);
            if(tmp_condition.ticket_type)
            {
                tmp_condition.ticket_type = '!'+tmp_condition.ticket_type+'!';
            }
            $scope.ticket_types = $scope.page.select(page, tmp_condition, {});
        }
        $scope.search();


        $scope.submit = function()
        {
            var sub_method = ticketType.save;
            var tis = "添加成功";
            if('PUT' == $scope.sub_post_put)
            {
                sub_method = ticketType.update;
                tis = "修改成功";
            }
            if($scope.isDisabled) { return ; }
            $scope.isDisabled = true;

            $scope.form_ticket.checkValidity().then(function()
            {
                sub_method($scope.ticket, function() {
                    topAlert.success(tis);
                    $scope.isDisabled = false;
                    $scope.search();
                    $scope.form_ticket.clearErrors();
                    $scope.cancle_update();
                }, function()
                {
                    $scope.isDisabled = false;
                });
            });
        }

        $scope.cancle_update  = function()
        {
            $scope.sub_post_put = 'POST';
            ticket_original = angular.copy(ticket_init);
            $scope.ticket = angular.copy(ticket_init);
            $scope.form_ticket.clearErrors();
        }
        $scope.reset = function()
        {
            $scope.form_ticket.clearErrors();
            $scope.ticket = angular.copy(ticket_original);
        }

        $scope.update = function(id)
        {
            var ticket = _.findWhere($scope.ticket_types, {id: id});
            if(ticket)
            {
                $scope.sub_post_put = 'PUT';
                ticket_original.id = id;
                ticket_original.ticket_type = ticket.ticket_type;
                $scope.ticket = angular.copy(ticket_original);
            }
        }
        $scope.delete = function(id)
        {
            pinCodeModal(ticketType, 'delete', {id: id}, '刪除成功！').then(function () {
                $scope.search();
                if(id == ticket_original.id){
                    $scope.cancle_update()
                }
            })
        }


    }]).controller('consumptionSetOtherCtrls', ['$scope', '$stateParams', 'tmsPagination', 'globalFunction', 'miscellaneousType', 'topAlert', 'pinCodeModal', function($scope, $stateParams, tmsPagination, globalFunction, miscellaneousType, topAlert, pinCodeModal){

        $scope.sub_post_put = 'POST';
        $scope.form_url = globalFunction.getApiUrl('consumption/miscellaneoustype');
        $scope.isDisabled = false;

        var other_init = {
            miscellaneous_type : "",
            pin_code : ""
        }
        var other_original = angular.copy(other_init);
        $scope.other = angular.copy(other_init);

        $scope.condition = {
            miscellaneous_type : ""
        }

        $scope.page = tmsPagination.create();
        $scope.page.resource = miscellaneousType;

        $scope.search = function(page)
        {
            var tmp_condition = angular.copy($scope.condition);
            if(tmp_condition.miscellaneous_type)
            {
                tmp_condition.miscellaneous_type = '!'+tmp_condition.miscellaneous_type+'!';
            }
            $scope.miscellaneous_types = $scope.page.select(page, tmp_condition, {});
        }
        $scope.search();


        $scope.submit = function()
        {
            var sub_method = miscellaneousType.save;
            var tis = "添加成功";
            if('PUT' == $scope.sub_post_put)
            {
                sub_method = miscellaneousType.update;
                tis = "修改成功";
            }
            if($scope.isDisabled) { return ; }
            $scope.isDisabled = true;

            $scope.form_other.checkValidity().then(function()
            {
                sub_method($scope.other, function() {
                    topAlert.success(tis);
                    $scope.isDisabled = false;
                    $scope.search();
                    $scope.form_other.clearErrors();
                    $scope.cancle_update();
                }, function()
                {
                    $scope.isDisabled = false;
                });
            });
        }

        $scope.cancle_update  = function()
        {
            $scope.sub_post_put = 'POST';
            other_original = angular.copy(other_init);
            $scope.other = angular.copy(other_init);
            $scope.form_other.clearErrors();
        }
        $scope.reset = function()
        {
            $scope.form_other.clearErrors();
            $scope.other = angular.copy(other_original);
        }

        $scope.update = function(id)
        {
            var other = _.findWhere($scope.miscellaneous_types, {id: id});
            if(other)
            {
                $scope.sub_post_put = 'PUT';
                other_original.id = id;
                other_original.miscellaneous_type = other.miscellaneous_type;
                $scope.other = angular.copy(other_original);
            }
        }
        $scope.delete = function(id)
        {
            pinCodeModal(miscellaneousType, 'delete', {id: id}, '刪除成功！').then(function () {
                $scope.search();
                if(id == other_original.id){
                    $scope.cancle_update()
                }
            })
        }


    }]).controller('consumptionSetHotelCtrls', ['$scope', '$stateParams', 'tmsPagination', 'globalFunction', 'hotelLists', 'topAlert', 'pinCodeModal', function($scope, $stateParams, tmsPagination, globalFunction, hotelLists, topAlert, pinCodeModal){

        $scope.sub_post_put = 'POST';
        $scope.form_url = globalFunction.getApiUrl('consumption/hotel');
        $scope.isDisabled = false;

        var hotel_init = {
            hotel_name : "",
            pin_code : ""
        }
        var hotel_original = angular.copy(hotel_init);
        $scope.hotel = angular.copy(hotel_init);

        $scope.condition = {
            hotel_name : ""
        }

        $scope.page = tmsPagination.create();
        $scope.page.resource = hotelLists;

        $scope.search = function(page)
        {
            var tmp_condition = angular.copy($scope.condition);
            if(tmp_condition.hotel_name)
            {
                tmp_condition.hotel_name = '!'+tmp_condition.hotel_name+'!';
            }
            $scope.hotels = $scope.page.select(page, tmp_condition, {});
        }
        $scope.search();


        $scope.submit = function()
        {
            var sub_method = hotelLists.save;
            var tis = "添加成功";
            if('PUT' == $scope.sub_post_put)
            {
                sub_method = hotelLists.update;
                tis = "修改成功";
            }
            if($scope.isDisabled) { return ; }
            $scope.isDisabled = true;

            $scope.form_hotel.checkValidity().then(function()
            {
                sub_method($scope.hotel, function() {
                    topAlert.success(tis);
                    $scope.isDisabled = false;
                    $scope.search();
                    $scope.form_hotel.clearErrors();
                    $scope.cancle_update();
                }, function()
                {
                    $scope.isDisabled = false;
                });
            });
        }

        $scope.cancle_update  = function()
        {
            $scope.sub_post_put = 'POST';
            hotel_original = angular.copy(hotel_init);
            $scope.hotel = angular.copy(hotel_init);
            $scope.form_hotel.clearErrors();
        }
        $scope.reset = function()
        {
            $scope.form_hotel.clearErrors();
            $scope.hotel = angular.copy(hotel_original);
        }

        $scope.update = function(id)
        {
            var hotel = _.findWhere($scope.hotels, {id: id});
            if(hotel)
            {
                $scope.sub_post_put = 'PUT';
                hotel_original.id = id;
                hotel_original.hotel_name = hotel.hotel_name;
                $scope.hotel = angular.copy(hotel_original);
            }
        }
        $scope.delete = function(id)
        {
            pinCodeModal(hotelLists, 'delete', {id: id}, '刪除成功！').then(function () {
                $scope.search();
                if(id == hotel_original.id){
                    $scope.cancle_update()
                }
            })
        }


    }]).controller('ConsumptionSetTravalCtrls',['$scope', '$stateParams', 'tmsPagination', 'globalFunction', 'consumptionHoteltravel', 'topAlert', 'pinCodeModal', 'hotelTravelType', 'hotelLists', function($scope, $stateParams, tmsPagination, globalFunction, consumptionHoteltravel, topAlert, pinCodeModal, hotelTravelType, hotelLists){  //新增旅行社酒店
        $scope.hotels = hotelLists.query();
        $scope.hotelTravelType_items = hotelTravelType.items;
        $scope.sub_post_put = 'POST';
        $scope.form_url = globalFunction.getApiUrl('consumption/hoteltravel');
        $scope.isDisabled = false;
        $scope.halls = _.where(JSON.parse(sessionStorage.getItem("halls")), { hall_type : "2"});
        var travel_init = {
            hall_id : "",
            name : "",
            hotel_travel_type : "",
            refHotelTravelHotels : [],
            pin_code : ""
        }
        var travel_original = angular.copy(travel_init);
        $scope.travel = angular.copy(travel_init);

        $scope.update_temp_refHotelTravelHotels = [];

        $scope.condition = {
            name : ""
        }

        $scope.page = tmsPagination.create();
        $scope.page.resource = consumptionHoteltravel;

        $scope.search = function(page)
        {
            var condition_copy =  angular.copy($scope.condition);
            if(condition_copy.name)
            {
                condition_copy.name =  '!'+condition_copy.name+'!';
            }
            $scope.travel_types = $scope.page.select(page, condition_copy, {});
        }
        $scope.search();

        $scope.changeType = function()
        {
            $scope.travel.name = travel_original.name;
            if(1 == $scope.travel.hotel_travel_type){
                $scope.travel.name = $scope.user.hall.hall_name;
            }
        }

        $scope.changeHall = function()
        {
            var hall_id = $scope.travel.hall_id;
            var hall = _.findWhere($scope.halls, {id : hall_id});
            $scope.travel.name = hall.hall_name;
        }

        $scope.submit = function()
        {
            if($scope.isDisabled) { return ; }
            $scope.isDisabled = true;
            /*if(!$scope.user.isAllHall()){
                $scope.travel.hall_id = $scope.user.hall.id;
            }*/
            var travel = angular.copy($scope.travel);
            var res = [];
            _.each(travel.refHotelTravelHotels, function($that)
            {
                var temp_obj = {'hotel_id' : $that};
                if('PUT' == $scope.sub_post_put)
                {
                    var travel = _.findWhere($scope.update_temp_refHotelTravelHotels, {hotel_id: $that});
                    if(travel)
                    {
                        temp_obj.id = travel.id;
                    }
                }
                res.push(temp_obj);
            })
            travel.refHotelTravelHotels = res;
            var sub_method = consumptionHoteltravel.save;
            var tis = "添加成功";
            if('PUT' == $scope.sub_post_put)
            {
                sub_method = consumptionHoteltravel.update;
                tis = "修改成功";
            }


            $scope.form_travel.checkValidity().then(function()
            {
                sub_method(travel, function() {
                    topAlert.success(tis);
                    $scope.isDisabled = false;
                    $scope.search();
                    $scope.form_travel.clearErrors();
                    $scope.cancle_update();
                }, function()
                {
                    $scope.isDisabled = false;
                });
            });
        }

        $scope.cancle_update  = function()
        {
            $scope.sub_post_put = 'POST';
            $scope.update_temp_refHotelTravelHotels = [];
            travel_original = angular.copy(travel_init);
            $scope.travel = angular.copy(travel_init);
            $scope.form_travel.clearErrors();
        }
        $scope.reset = function()
        {
            $scope.form_travel.clearErrors();
            $scope.travel = angular.copy(travel_original);
        }

        $scope.update = function(id)
        {
            var travel = _.findWhere($scope.travel_types, {id: id});
            if(travel)
            {
                $scope.sub_post_put = 'PUT';
                travel_original.id = id;
                travel_original.name = travel.name;
                travel_original.hall_id = travel.hall_id;
                travel_original.hotel_travel_type = travel.hotel_travel_type;
                //
                if(1 == travel.hotel_travel_type)
                {
                    $scope.update_temp_refHotelTravelHotels = travel.refHotelTravelHotels;
                    var hotels = _.pluck(travel.refHotelTravelHotels, 'hotel_id');
                    travel_original.refHotelTravelHotels = hotels;
                }
                $scope.travel = angular.copy(travel_original);

            }
        }
        $scope.delete = function(id)
        {
            pinCodeModal(consumptionHoteltravel, 'delete', {id: id}, '刪除成功！').then(function () {
                $scope.search();
                if(id == travel_original.id){
                    $scope.cancle_update()
                }
            })
        }
    }]);
}).call(this);

