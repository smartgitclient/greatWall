/**
 * Created by Allen.zhang on 2014/8/25.
 */
(function () {
    'use strict';
    angular.module('app.consumption-manager.ctrls', ['app.consumption-manager.services', 'app.consumption-manager.json']).controller('consumptionManagerCtrls', [
        '$scope', '$state', 'getDate', '$filter', '$location', '$stateParams', 'breadcrumb', 'hallName', 'tmsPagination', 'globalFunction', 'agentsLists', 'consumptionHotel', 'consumptionRoomtype', 'consumptionHoteltravel', 'consumptionFoodcoupon', 'bookingState', 'consumptionHelicopter', 'consumptionBoat', 'flightType', 'consumptionFlight', 'consumptionCar', 'carType', 'consumptionTicket', 'ticketType', 'consumptionMiscellaneous', 'consumptionPaytype', 'windowItems', 'pinCodeModal', 'idcardType', 'miscellaneousType', 'flightSeatType', 'hotelLists', 'helicopterCity', 'helicopterTrip', 'boatTrip', 'shiftMark', 'getShiftList', 'areaCode', 'consumptionHotelSub', '$timeout', 'pinCodeUserName', 'topAlert', 'shiftMarks', 'strToTime',
        function ($scope, $state, getDate, $filter, $location, $stateParams, breadcrumb, hallName, tmsPagination, globalFunction, agentsLists, consumptionHotel, consumptionRoomtype, consumptionHoteltravel, consumptionFoodcoupon, bookingState, consumptionHelicopter, consumptionBoat, flightType, consumptionFlight, consumptionCar, carType, consumptionTicket, ticketType, consumptionMiscellaneous, consumptionPaytype, windowItems, pinCodeModal, idcardType, miscellaneousType, flightSeatType, hotelLists, helicopterCity, helicopterTrip, boatTrip, shiftMark, getShiftList, areaCode, consumptionHotelSub, $timeout, pinCodeUserName, topAlert, shiftMarks, strToTime) {

            breadcrumb.items = [{
                "name": "新增預訂",
                "active": true
            }];

            //            $scope.default_pay_type_id = '0493728BB8AC06C6E0539715A8C0267D'; //扣消費
            $scope.default_pay_type_id = '0493728BB8AE06C6E0539715A8C0267D'; //扣佣金
            $scope.default_hotel_travel_id = '';
            $scope.default_hotel_travel_type = '';
            $scope.default_hotel_id = "";

            var global_params_init = {
                pin_code: "",
                shift: "",
                shift_date: "",
                year_month: "",
                username: ""
            }
            $scope.global_params = angular.copy(global_params_init);
            $scope.halls = _.where(JSON.parse(sessionStorage.getItem("halls")), {
                hall_type: "2"
            });
            // common params
            if (angular.isUndefined($scope.bookingState_items)) {
                $scope.TODAY_DATE = "";
                $scope.bookingState_items = bookingState.items;
                $scope.flightType_items = flightType.items;
                //$scope.halls = hallName.query({hall_type : 2}); // 厅馆
                $scope.idCardtypes = idcardType.query(); //证件类型
                $scope.pay_types = [];
                consumptionPaytype.query().$promise.then(function (data) // 支付方式
                {
                    _.each(data, function ($that, $key) {
                        if ('COMMISSION' == $that.pay_type_code || 'COMSUMPTION' == $that.pay_type_code) {
                            $scope.pay_types.push($that);
                        }
                    })
                });

                $scope.shiftLists = shiftMarks; // getShiftList.query();
                $scope.areaCodes = areaCode.query();

                consumptionHoteltravel.getHotelTravel().$promise.then(function (data) {
                    $scope.consumptionHoteltravels = data;
                    _.each(data, function ($that, $key) { //设置 供应商默认是当前厅
                        if ($that.name == $scope.user.hall.hall_name) {
                            $scope.default_hotel_travel_id = $that.id;
                            $scope.default_hotel_travel_type = $that.hotel_travel_type;
                            $scope.$broadcast('consumptionHoteltravelQuery');
                        }
                    })
                });

                shiftMark.get(globalFunction.generateUrlParams({}, {
                    shiftObj: {}
                })).$promise.then(function (data) {
                        $scope.global_params.shift_date = data.shift_date ? new Date(data.shift_date) : "";

                        $scope.global_params.year_month = $filter('date')(data.year_month ? new Date(data.year_month) : "", 'yyyy-MM')
                        $scope.global_params.shift = data.shift || "";
                        $scope.$broadcast('consumptionShiftDataChange');
                    });

                $scope.hotelLists = "";
                $scope.helicopterCitys = "";
                $scope.helicopterTrips = "";
                $scope.boatCitys = "";
                //$scope.miscellaneousTypes = miscellaneousType.query();
                $scope.car_types = "";
                $scope.ticket_types = "";
                $scope.flight_seattypes = "";
            }

            $scope.hotels = []; //consumptionHoteltravel.query({ hotel_travel_type: 1 });


            //给search 查询字段 加上 !{id}!
            // @obj 需要修改值的对象
            // @key_arr 1.数组 需要改变的值的数组， 2. true 所有值都需要改
            function addSearchCode(obj, key_arr) {
                _.each(obj, function (value, key, list) {
                    var new_value = '';
                    if ('object' == typeof(value)) {
                        var new_obj = addSearchCode(value, key_arr);
                    } else {
                        if ("" !== value && (true === key_arr || -1 !== _.indexOf(key_arr, key))) {
                            new_value = '!' + value + '!';
                            obj[key] = new_value;
                        }
                    }
                })
                return obj;
            }

            //根据 url 参数 改变 views
            $scope.type = $stateParams.types;
            $scope.tabs = {
                hotel: false,
                food: false,
                helicopter: false,
                ship: false,
                air: false,
                car: false,
                ticket: false,
                other: false
            }
            $scope.tabs[$scope.type] = true;


            //点击 tab  切换界面 搜索出相关信息
            $scope.tabClick = function (name) {
                Get_booking_data(name);
                $scope.type = name;
            }

            function Get_booking_data(name) {
                var tab_content_list = $scope[name + 'Bookings'];
                var search_method = $scope[name + '_search'];
                if (!!tab_content_list && !tab_content_list.length) {
                    search_method();
                }
                switch (name) {
                    case "hotel":
                    {
                        /*if(!$scope.consumptionHoteltravels)
                         {
                         $scope.consumptionHoteltravels = consumptionHoteltravel.query(globalFunction.generateUrlParams({}, {refHotelTravelHotels : { hotel : { roomTypes : "" } }}));
                         }*/
                    }
                        break;
                    case "food":
                    {
                        if (!$scope.hotelLists) {
                            hotelLists.query(globalFunction.generateUrlParams({}, {
                                restaurants: {}
                            })).$promise.then(function (data) {
                                    $scope.hotelLists = data;
                                    _.each(data, function ($that, $key) { //设置 餐厅默认是当前厅
                                        if ($that.hotel_name == $scope.user.hall.hall_name) {
                                            $scope.default_hotel_id = $that.id;
                                            $scope.$broadcast('consumptionFoodHotelQuery');
                                        }
                                    })
                                })
                        }
                    }
                        break;
                    case "helicopter":
                    {
                        if (!$scope.helicopterTrips) {
                            $scope.helicopterTrips = helicopterTrip.getHelicopterTrip();
                        }
                        if (!$scope.helicopterCitys) {
                            $scope.helicopterCitys = helicopterCity.query();
                        }
                    }
                        break;
                    case "ship":
                    {
                        if (!$scope.boatCitys) {
                            $scope.boatCitys = boatTrip.getBoattrip();
                        }
                    }
                        break;
                    case "air":
                    {
                        if (!$scope.flight_seattypes) {
                            $scope.flight_seattypes = flightSeatType.query();
                        }
                    }
                        break;
                    case "car":
                    {
                        if (!$scope.car_types) {
                            $scope.car_types = carType.query();
                        }
                    }
                        break;
                    case "ticket":
                    {
                        if (!$scope.ticket_types) {
                            $scope.ticket_types = ticketType.query();
                        }
                    }
                        break;
                    case "other":
                    {

                    }
                        break;
                    default:
                        break;
                }
            }

            function Search_agent(code, type) {
                if (code) {
                    agentsLists.query(globalFunction.generateUrlParams({
                        agent_code: code
                    }, {})).$promise.then(function (agent) {
                            if (agent.length > 0) {
                                $scope['condition_' + type].agentMaster.agent_contact_name = agent[0].agent_name;
                            } else {
                                $scope['condition_' + type].agentMaster.agent_contact_name = "";
                            }
                        });
                } else {
                    $scope['condition_' + type].agentMaster.agent_contact_name = "";
                }
            }

            $scope.change_shift_data = function () {
                $scope.global_params.year_month = $filter('date')($scope.global_params.year_month, 'yyyy-MM');
                $scope.$broadcast('consumptionShiftDataChange');

            }


            /**
             * 操作密码锁定
             * @type {boolean}
             */
            $scope.is_locked = false;
            $scope.agent_locked = function (lock) {
                if (lock) {
                    if ($scope.global_params.pin_code) {
                        //pin_code 查詢用戶
                        pinCodeUserName.save({
                            pin_code: $scope.global_params.pin_code
                        }).$promise.then(function (username) {
                                if (username.name == "" || username.name == null) {
                                    topAlert.warning("操作密碼不正確！");
                                    return;
                                } else {
                                    sessionStorage.setItem('consumption_pincode', $scope.global_params.pin_code);
                                    global_params_init.pin_code = $scope.global_params.pin_code;
                                    global_params_init.username = username.name;
                                    $scope.global_params.username = username.name;
                                    $scope.is_locked = lock;
                                }
                            });
                    } else {
                        topAlert.warning("請輸入操作密碼！");
                        return;
                    }
                } else {
                    global_params_init.pin_code = "";
                    global_params_init.username = "";
                    sessionStorage.removeItem('consumption_pincode');
                    $scope.is_locked = lock;
                }

            }

            function getSessionPincode() {
                var pin_code = sessionStorage.getItem('consumption_pincode');
                if (pin_code) {
                    global_params_init.pin_code = pin_code;
                    $scope.global_params.pin_code = pin_code;
                    $scope.agent_locked(true);
                }
            }

            getSessionPincode();

            /*
             *  TAB hotel 酒店  ---------------------------------------------
             */
            $scope.hotel_search_type = {
                type: "2",
                room_no: "",
                checkin_datetime: ["", ""]
            }
            $scope.hotel_search_type_submit = "1";
            var condition_hotel_base = {
                consumption: {
                    book_no: "",
                    pay_type_id: "",
                    shift_date: ["", ""],
                    year_month: [""],
                    remark:"",
                    book_time: [""]
                },
                hall_id: "",
                agentInfo: {
                    agent_code: ""
                },
                agentMaster: {
                    agent_contact_name: ""
                },
                hotel_travel_id: "",
                hotel_name: "",
                trader: "",
                checkin_datetime: ["", ""],

                hotel_travel_type: "",
                sort: 'consumption.book_time DESC'
            }

            $scope.condition_hotel = angular.copy(condition_hotel_base);

            $scope.hotel_page = tmsPagination.create();
            $scope.hotel_page.resource = consumptionHotel; //consumptionHotelSub

            $scope.hotel_page2 = tmsPagination.create();
            $scope.hotel_page2.resource = consumptionHotelSub; //consumptionHotelSub

            $scope.hotelBookings = [];
            //酒店查询按钮
            $scope.hotel_search = function (page) {
                $scope.hotel_search_type_submit = $scope.hotel_search_type.type;


                var condition_copy = angular.copy($scope.condition_hotel);
                $scope.condition_copy = addSearchCode(condition_copy, ['agent_code', 'agent_contact_name', 'book_no', 'hotel_name', 'room_type', 'trader','remark']);

                if ($scope.condition_copy.agentInfo.agent_code) {
                    $scope.condition_copy.agentInfo.agent_code = $scope.condition_copy.agentInfo.agent_code.substring(1);
                }

                if ($scope.condition_copy.checkin_datetime[0]) {
                    $scope.condition_copy.checkin_datetime[0] = $filter('date')($scope.condition_copy.checkin_datetime[0], 'yyyy-MM-dd');
                }

                if ($scope.condition_copy.checkin_datetime[1]) {
                    $scope.condition_copy.checkin_datetime[1] = $filter('date')($scope.condition_copy.checkin_datetime[1], 'yyyy-MM-dd');
                }

                if ($scope.condition_copy.consumption.book_time[0]) {
                    $scope.condition_copy.consumption.book_time[0] = $filter('date')($scope.condition_copy.consumption.book_time[0], 'yyyy-MM-dd');
                }
                if ($scope.condition_copy.consumption.shift_date[0]) {
                    $scope.condition_copy.consumption.shift_date[0] = $filter('date')($scope.condition_copy.consumption.shift_date[0], 'yyyy-MM-dd');
                }
                if ($scope.condition_copy.consumption.shift_date[1]) {
                    $scope.condition_copy.consumption.shift_date[1] = $filter('date')($scope.condition_copy.consumption.shift_date[1], 'yyyy-MM-dd');
                }


                delete $scope.condition_copy.hotel_travel_type;

                if (1 == $scope.hotel_search_type_submit) {
                    //$scope.hotel_page.resource = consumptionHotel;

                    $scope.hotelBookings = $scope.hotel_page.select(page, $scope.condition_copy, {
                        consumption: {}
                    });


                } else if (2 == $scope.hotel_search_type_submit) {

                    if ($scope.hotel_search_type.checkin_datetime[0]) {
                        $scope.hotel_search_type.checkin_datetime[0] = $filter('date')($scope.hotel_search_type.checkin_datetime[0], 'yyyy-MM-dd');
                    }
                    if ($scope.hotel_search_type.checkin_datetime[1]) {
                        $scope.hotel_search_type.checkin_datetime[1] = $filter('date')($scope.hotel_search_type.checkin_datetime[1], 'yyyy-MM-dd');
                    }
                    //$scope.hotel_page2.resource = consumptionHotelSub;
                    if ($scope.user.hall.hall_type != 1)
                        $scope.condition_copy.hall_id = $scope.user.hall.id;

                    delete $scope.condition_copy.sort;

                    var checkin_datetime_copy = []
                    checkin_datetime_copy[0] = $scope.hotel_search_type.checkin_datetime[0]

                    if ($scope.hotel_search_type.checkin_datetime[1]) {
                        var time = strToTime($scope.hotel_search_type.checkin_datetime[1]).setDate(strToTime($scope.hotel_search_type.checkin_datetime[1]).getDate() - 1)
                        checkin_datetime_copy[1] = $filter('date')(time, 'yyyy-MM-dd')
                    }


                    var cond = {
                        consumptionHotel: $scope.condition_copy,
                        checkin_datetime: checkin_datetime_copy,
                        room_no: $scope.hotel_search_type.room_no
                        //sort : 'consumptionHotel.consumption.book_time DESC'
                    }
                    cond.shift_date_sub = angular.copy($scope.condition_copy.consumption.shift_date);
                    delete $scope.condition_copy.consumption.shift_date;

                    $scope.hotelBookings = $scope.hotel_page2.select(page, cond, {
                        consumptionHotel: {
                            consumptionHotelRegisters: "",
                            consumption: ""
                        }
                    });


                }


            }
            $scope.hotel_search();

            $scope.$watch('condition_hotel.agentInfo.agent_code', globalFunction.debounce(function (new_value, old_value) {
                Search_agent(new_value, 'hotel');
            }));

            //酒店查询 重置按钮
            $scope.hotel_search_reset = function () {
                $scope.condition_hotel = angular.copy(condition_hotel_base);
                $scope.hotel_search_type = {
                    type: "2",
                    room_no: "",
                    checkin_datetime: ["", ""]
                }
                $scope.hotel_search();
            }

            /*$scope.$watch('condition_hotel.hotel_travel_id', function(new_value, old_value)
             {
             $scope.condition_hotel.hotel_travel_type = "";

             if(new_value)
             {
             var travel_obj = (_.where($scope.consumptionHoteltravels, {id : new_value}))[0];
             $scope.condition_hotel.hotel_travel_type = travel_obj.hotel_travel_type;
             if(1 == $scope.condition_hotel.hotel_travel_type)
             {
             $scope.condition_hotel.hotel_name = travel_obj.refHotelTravelHotel.hotel.hotel_name;
             //
             }
             else
             {
             $scope.condition_hotel.hotel_name = "";
             }
             }

             });*/


            $scope.hotel_booking_delete = function (id) {
                windowItems.confirm('系統提示', '確定刪除該條消費單嗎？', function () {
                    pinCodeModal(consumptionHotel, 'delete', {
                        id: id
                    }, '刪除成功！').then(function () {
                        $scope.hotel_search();
                    })
                });
            }

            /*
             *  TAB food 食飞 ---------------------------------------------
             */
            var condition_food_base = {
                consumption: {
                    book_no: "",
                    trader: "",
                    remark:"",
                    shift_date: ["", ""],
                    pay_type_id: ""
                },

                hall_id: "",
                hotel_id: "",
                restaurant_id: "",
                agentInfo: {
                    agent_code: ""
                },
                agentMaster: {
                    agent_contact_name: ""
                },
                sort: 'consumption.book_time DESC'

            }
            $scope.condition_food = angular.copy(condition_food_base);

            $scope.food_page = tmsPagination.create();
            $scope.food_page.resource = consumptionFoodcoupon;
            $scope.foodBookings = [];
            //食飛查询按钮
            $scope.food_search = function (page) {
                var condition_copy = angular.copy($scope.condition_food);
                $scope.condition_copy = addSearchCode(condition_copy, ['agent_code', 'agent_contact_name', 'book_no', 'hotel_name', 'room_type', 'trader','remark']);

                if ($scope.condition_copy.agentInfo.agent_code) {
                    $scope.condition_copy.agentInfo.agent_code = $scope.condition_copy.agentInfo.agent_code.substring(1);
                }
                if ($scope.condition_copy.consumption.shift_date[0]) {
                    $scope.condition_copy.consumption.shift_date[0] = $filter('date')($scope.condition_copy.consumption.shift_date[0], 'yyyy-MM-dd');
                }
                if ($scope.condition_copy.consumption.shift_date[1]) {
                    $scope.condition_copy.consumption.shift_date[1] = $filter('date')($scope.condition_copy.consumption.shift_date[1], 'yyyy-MM-dd');
                }
                $scope.foodBookings = $scope.food_page.select(page, $scope.condition_copy, {
                    consumption: {}
                });
            }
            //$scope.food_search();

            $scope.$watch('condition_food.agentInfo.agent_code', globalFunction.debounce(function (new_value, old_value) {
                Search_agent(new_value, 'food');
            }));

            $scope.$watch('condition_food.hotel_id', function (new_value, old_value) {
                if (new_value) {
                    var hotel_obj = (_.where($scope.hotelLists, {
                        id: new_value
                    }))[0];
                    if (!!hotel_obj.restaurants.length) {
                        $scope.food_restaurants = hotel_obj.restaurants;
                    } else {
                        $scope.condition_food.restaurant_id = "";
                        $scope.food_restaurants = [];
                    }
                } else {
                    $scope.food_restaurants = [];
                    $scope.condition_food.restaurant_id = "";
                }
            });


            //食飛查询 重置按钮
            $scope.food_search_reset = function () {
                $scope.condition_food = angular.copy(condition_food_base);
                $scope.food_search();
            }

            $scope.food_booking_delete = function (id) {
                windowItems.confirm('系統提示', '確定刪除該條消費單嗎？', function () {
                    pinCodeModal(consumptionFoodcoupon, 'delete', {
                        id: id
                    }, '刪除成功！').then(function () {
                        $scope.food_search();
                    })
                });
            }

            /*
             *  TAB helicopter 直升機 ---------------------------------------------
             */
            var condition_helicopter_base = {
                consumption: {
                    book_no: "",
                    trader: "",
                    remark:"",
                    shift_date: ["", ""],
                    pay_type_id: ""
                },

                hall_id: "",
                helicopterTrip: {
                    from_place_id: "",
                    to_place_id: ""
                },
                agentInfo: {
                    agent_code: ""
                },
                agentMaster: {
                    agent_contact_name: ""
                },
                sort: 'consumption.book_time DESC'
            }
            $scope.condition_helicopter = angular.copy(condition_helicopter_base);

            $scope.helicopter_page = tmsPagination.create();
            $scope.helicopter_page.resource = consumptionHelicopter;
            $scope.helicopterBookings = [];
            //直升機查询按钮
            $scope.helicopter_search = function (page) {
                var condition_copy = angular.copy($scope.condition_helicopter);
                delete condition_copy.trip_index;

                $scope.condition_copy = addSearchCode(condition_copy, ['book_no', 'trader', 'agent_code', 'agent_contact_name','remark']);

                if ($scope.condition_copy.agentInfo.agent_code) {
                    $scope.condition_copy.agentInfo.agent_code = $scope.condition_copy.agentInfo.agent_code.substring(1);
                }

                if ($scope.condition_copy.consumption.shift_date[0]) {
                    $scope.condition_copy.consumption.shift_date[0] = $filter('date')($scope.condition_copy.consumption.shift_date[0], 'yyyy-MM-dd');
                }
                if ($scope.condition_copy.consumption.shift_date[1]) {
                    $scope.condition_copy.consumption.shift_date[1] = $filter('date')($scope.condition_copy.consumption.shift_date[1], 'yyyy-MM-dd');
                }

                if ($scope.condition_copy.setout_time) {
                    $scope.condition_copy.setout_time = $filter('date')($scope.condition_copy.setout_time, 'HH:mm');
                }


                $scope.helicopterBookings = $scope.helicopter_page.select(page, $scope.condition_copy, {
                    consumption: {},
                    helicoptertrip: {}
                });
            }

            $scope.$watch('condition_helicopter.agentInfo.agent_code', globalFunction.debounce(function (new_value, old_value) {
                Search_agent(new_value, 'helicopter');
            }));

            //直升機查询 重置按钮
            $scope.helicopter_search_reset = function () {
                $scope.condition_helicopter = angular.copy(condition_helicopter_base);
                $scope.helicopter_search();
            }
            $scope.helicopter_booking_delete = function (id) {
                windowItems.confirm('系統提示', '確定刪除該條消費單嗎？', function () {
                    pinCodeModal(consumptionHelicopter, 'delete', {
                        id: id
                    }, '刪除成功！').then(function () {
                        $scope.helicopter_search();
                    })
                });
            }
            /*
             *  TAB ship 船票 ---------------------------------------------
             */
            var condition_ship_base = {
                consumption: {
                    book_no: "",
                    trader: "",
                    shift_date: ["", ""],
                    remark:"",
                    pay_type_id: ""
                },

                hall_id: "",
                agentInfo: {
                    agent_code: ""
                },
                agentMaster: {
                    agent_contact_name: ""
                },
                sort: 'consumption.book_time DESC'

            }
            $scope.condition_ship = angular.copy(condition_ship_base);

            $scope.ship_page = tmsPagination.create();
            $scope.ship_page.resource = consumptionBoat;
            $scope.shipBookings = [];
            //船票查询按钮
            $scope.ship_search = function (page) {

                var condition_copy = angular.copy($scope.condition_ship);
                $scope.condition_copy = addSearchCode(condition_copy, ['agent_code', 'agent_contact_name', 'book_no', 'trader','remark']);
                if ($scope.condition_copy.agentInfo.agent_code) {
                    $scope.condition_copy.agentInfo.agent_code = $scope.condition_copy.agentInfo.agent_code.substring(1);
                }
                if ($scope.condition_copy.consumption.shift_date[0]) {
                    $scope.condition_copy.consumption.shift_date[0] = $filter('date')($scope.condition_copy.consumption.shift_date[0], 'yyyy-MM-dd');
                }
                if ($scope.condition_copy.consumption.shift_date[1]) {
                    $scope.condition_copy.consumption.shift_date[1] = $filter('date')($scope.condition_copy.consumption.shift_date[1], 'yyyy-MM-dd');
                }

                $scope.shipBookings = $scope.ship_page.select(page, $scope.condition_copy, {
                    consumption: {}
                });
            }
            //$scope.ship_search();

            $scope.$watch('condition_ship.agentInfo.agent_code', globalFunction.debounce(function (new_value, old_value) {
                Search_agent(new_value, 'ship');
            }));


            //船票查询 重置按钮
            $scope.ship_search_reset = function () {
                $scope.condition_ship = angular.copy(condition_ship_base);
                $scope.ship_search();
            }
            $scope.ship_booking_delete = function (id) {
                windowItems.confirm('系統提示', '確定刪除該條消費單嗎？', function () {
                    pinCodeModal(consumptionBoat, 'delete', {
                        id: id
                    }, '刪除成功！').then(function () {
                        $scope.ship_search();
                    })
                });
            }
            /*
             *  TAB air 機票 ---------------------------------------------
             */
            var condition_air_base = {
                consumption: {
                    book_no: "",
                    trader: "",
                    shift_date: ["", ""],
                    remark:"",
                    pay_type_id: ""
                },

                hall_id: "",
                agentInfo: {
                    agent_code: ""
                },
                agentMaster: {
                    agent_contact_name: ""
                },
                flight_type: "",
                sort: 'consumption.book_time DESC'

            }
            $scope.condition_air = angular.copy(condition_air_base);

            $scope.air_page = tmsPagination.create();
            $scope.air_page.resource = consumptionFlight;
            $scope.airBookings = [];
            //機票查询按钮
            $scope.air_search = function (page) {
                var condition_copy = angular.copy($scope.condition_air);
                $scope.condition_copy = addSearchCode(condition_copy, ['book_no', 'agent_code', 'agent_contact_name', 'trader','remark']);
                if ($scope.condition_copy.agentInfo.agent_code) {
                    $scope.condition_copy.agentInfo.agent_code = $scope.condition_copy.agentInfo.agent_code.substring(1);
                }
                if ($scope.condition_copy.consumption.shift_date[0]) {
                    $scope.condition_copy.consumption.shift_date[0] = $filter('date')($scope.condition_copy.consumption.shift_date[0], 'yyyy-MM-dd');
                }
                if ($scope.condition_copy.consumption.shift_date[1]) {
                    $scope.condition_copy.consumption.shift_date[1] = $filter('date')($scope.condition_copy.consumption.shift_date[1], 'yyyy-MM-dd');
                }

                $scope.airBookings = $scope.air_page.select(page, $scope.condition_copy, {
                    consumption: {}
                });
            }
            //$scope.air_search();

            $scope.$watch('condition_air.agentInfo.agent_code', globalFunction.debounce(function (new_value, old_value) {
                Search_agent(new_value, 'air');
            }));

            //機票查询 重置按钮
            $scope.air_search_reset = function () {
                $scope.condition_air = angular.copy(condition_air_base);
                $scope.air_search();
            }
            $scope.air_booking_delete = function (id) {
                windowItems.confirm('系統提示', '確定刪除該條消費單嗎？', function () {
                    pinCodeModal(consumptionFlight, 'delete', {
                        id: id
                    }, '刪除成功！').then(function () {
                        $scope.air_search();
                    })
                });
            }
            /*
             *  TAB car 租车 ---------------------------------------------
             */
            var condition_car_base = {
                consumption: {
                    book_no: "",
                    trader: "",
                    shift_date: ["", ""],
                    pay_type_id: "",
                    remark:""
                },

                hall_id: "",
                agentInfo: {
                    agent_code: ""
                },
                agentMaster: {
                    agent_contact_name: ""
                },
                //hotel_travel_id : "",
                car_type_id: "",
                departure_date: [""],
                sort: 'consumption.book_time DESC'

            }
            $scope.condition_car = angular.copy(condition_car_base);

            $scope.car_page = tmsPagination.create();
            $scope.car_page.resource = consumptionCar;
            $scope.carBookings = [];
            //租车查询按钮
            $scope.car_search = function (page) {

                var condition_copy = angular.copy($scope.condition_car);
                $scope.condition_copy = addSearchCode(condition_copy, ['book_no', 'agent_code', 'agent_contact_name', 'trader','remark']);
                if ($scope.condition_copy.agentInfo.agent_code) {
                    $scope.condition_copy.agentInfo.agent_code = $scope.condition_copy.agentInfo.agent_code.substring(1);
                }
                if ($scope.condition_copy.departure_date[0]) {
                    $scope.condition_copy.departure_date[0] = $filter('date')($scope.condition_copy.departure_date[0], 'yyyy-MM-dd');
                }

                if ($scope.condition_copy.consumption.shift_date[0]) {
                    $scope.condition_copy.consumption.shift_date[0] = $filter('date')($scope.condition_copy.consumption.shift_date[0], 'yyyy-MM-dd');
                }
                if ($scope.condition_copy.consumption.shift_date[1]) {
                    $scope.condition_copy.consumption.shift_date[1] = $filter('date')($scope.condition_copy.consumption.shift_date[1], 'yyyy-MM-dd');
                }

                $scope.carBookings = $scope.car_page.select(page, $scope.condition_copy, {
                    consumption: {}
                });
            }
            //$scope.car_search();

            $scope.$watch('condition_car.agentInfo.agent_code', globalFunction.debounce(function (new_value, old_value) {
                Search_agent(new_value, 'car');
            }));
            //租车查询 重置按钮
            $scope.car_search_reset = function () {
                $scope.condition_car = angular.copy(condition_car_base);
                $scope.car_search();
            }
            $scope.car_booking_delete = function (id) {
                windowItems.confirm('系統提示', '確定刪除該條消費單嗎？', function () {
                    pinCodeModal(consumptionCar, 'delete', {
                        id: id
                    }, '刪除成功！').then(function () {
                        $scope.car_search();
                    })
                });
            }
            /*
             *  TAB ticket 門票 ---------------------------------------------
             */
            var condition_ticket_base = {
                consumption: {
                    book_no: "",
                    trader: "",
                    shift_date: ["", ""],
                    pay_type_id: "",
                    remark:""
                },

                hall_id: "",
                agentInfo: {
                    agent_code: ""
                },
                agentMaster: {
                    agent_contact_name: ""
                },
                ticket_type_id: "",
                sort: 'consumption.book_time DESC'

            }
            $scope.condition_ticket = angular.copy(condition_ticket_base);

            $scope.ticket_page = tmsPagination.create();
            $scope.ticket_page.resource = consumptionTicket;
            $scope.ticketBookings = [];
            //門票查询按钮
            $scope.ticket_search = function (page) {
                var condition_copy = angular.copy($scope.condition_ticket);

                $scope.condition_copy = addSearchCode(condition_copy, ['book_no', 'agent_code', 'agent_contact_name', 'trader', 'ticket_type_id','remark']);
                if ($scope.condition_copy.agentInfo.agent_code) {
                    $scope.condition_copy.agentInfo.agent_code = $scope.condition_copy.agentInfo.agent_code.substring(1);
                }
                if ($scope.condition_copy.consumption.shift_date[0]) {
                    $scope.condition_copy.consumption.shift_date[0] = $filter('date')($scope.condition_copy.consumption.shift_date[0], 'yyyy-MM-dd');
                }
                if ($scope.condition_copy.consumption.shift_date[1]) {
                    $scope.condition_copy.consumption.shift_date[1] = $filter('date')($scope.condition_copy.consumption.shift_date[1], 'yyyy-MM-dd');
                }

                $scope.ticketBookings = $scope.ticket_page.select(page, $scope.condition_copy, {
                    consumption: {}
                });
            }
            $scope.$watch('condition_ticket.agentInfo.agent_code', globalFunction.debounce(function (new_value, old_value) {
                Search_agent(new_value, 'ticket');
            }));
            $scope.ticket_booking_delete = function (id) {
                windowItems.confirm('系統提示', '確定刪除該條消費單嗎？', function () {
                    pinCodeModal(consumptionTicket, 'delete', {
                        id: id
                    }, '刪除成功！').then(function () {
                        $scope.ticket_search();
                    })
                });
            }
            //$scope.ticket_search();

            //門票查询 重置按钮
            $scope.ticket_search_reset = function () {
                $scope.condition_ticket = angular.copy(condition_ticket_base);
                $scope.ticket_search();
            }

            /*
             *  TAB other 其他 ---------------------------------------------
             */
            var condition_other_base = {
                consumption: {
                    book_no: "",
                    trader: "",
                    pay_type_id: "",
                    consumption_content: "",
                    shift_date: ["", ""],
                    remark:""
                },
                hall_id: "",
                agentInfo: {
                    agent_code: ""
                },
                agentMaster: {
                    agent_contact_name: ""
                },
                sort: 'consumption.book_time DESC'

            }
            $scope.condition_other = angular.copy(condition_other_base);

            $scope.other_page = tmsPagination.create();
            $scope.other_page.resource = consumptionMiscellaneous;
            $scope.otherBookings = [];
            //其他查询按钮
            $scope.other_search = function (page) {

                var condition_copy = angular.copy($scope.condition_other);
                $scope.condition_copy = addSearchCode(condition_copy, ['book_no', 'agent_code', 'agent_contact_name', 'trader', 'consumption_content','remark']);
                if ($scope.condition_copy.agentInfo.agent_code) {
                    $scope.condition_copy.agentInfo.agent_code = $scope.condition_copy.agentInfo.agent_code.substring(1);
                }
                if ($scope.condition_copy.consumption.shift_date[0]) {
                    $scope.condition_copy.consumption.shift_date[0] = $filter('date')($scope.condition_copy.consumption.shift_date[0], 'yyyy-MM-dd');
                }
                if ($scope.condition_copy.consumption.shift_date[1]) {
                    $scope.condition_copy.consumption.shift_date[1] = $filter('date')($scope.condition_copy.consumption.shift_date[1], 'yyyy-MM-dd');
                }

                $scope.otherBookings = $scope.other_page.select(page, $scope.condition_copy, {
                    consumption: {}
                });
            }
            //$scope.other_search();
            $scope.$watch('condition_other.agentInfo.agent_code', globalFunction.debounce(function (new_value, old_value) {
                Search_agent(new_value, 'other');
            }));
            //其他查询 重置按钮
            $scope.other_search_reset = function () {
                $scope.condition_other = angular.copy(condition_other_base);
                $scope.other_search();
            }
            $scope.other_booking_delete = function (id) {
                windowItems.confirm('系統提示', '確定刪除該條消費單嗎？', function () {
                    pinCodeModal(consumptionMiscellaneous, 'delete', {
                        id: id
                    }, '刪除成功！').then(function () {
                        $scope.other_search();
                    })
                });
            }


            //渲染完整个页面
            Get_booking_data($scope.type);


        }
    ]).controller('consumptionManagerUpdateCtrls', ['$scope', '$stateParams', '$filter', '$location', 'getDate', 'globalFunction', 'consumptionHotel', 'agentsLists', 'consumptionHotelValidateDate', 'consumptionHoteltravel', 'dayType', 'topAlert', 'agentGuest', 'shiftMark', '$modal', 'pinCodeUserName', '$timeout', 'isSendSmsModal', 'shiftMarks', 'idcardType', 'areaCode', 'consumptionPaytype', '$modalInstance', 'hotelSmsType', 'ConsumptionSmsTemp', 'user',
        function ($scope, $stateParams, $filter, $location, getDate, globalFunction, consumptionHotel, agentsLists, consumptionHotelValidateDate, consumptionHoteltravel, dayType, topAlert, agentGuest, shiftMark, $modal, pinCodeUserName, $timeout, isSendSmsModal, shiftMarks, idcardType, areaCode, consumptionPaytype, $modalInstance, hotelSmsType, ConsumptionSmsTemp, user) {

            $scope.popupWindow = false
            if (!$scope.global_params) {
                $scope.popupWindow = true
                $scope.global_params = {};
                $scope.shiftLists = shiftMarks
                $scope.idCardtypes = idcardType.query();
                $scope.areaCodes = areaCode.query();
                $scope.pay_types = [];
                consumptionPaytype.query().$promise.then(function (data) // 支付方式
                {
                    _.each(data, function ($that, $key) {
                        if ('COMMISSION' == $that.pay_type_code || 'COMSUMPTION' == $that.pay_type_code) {
                            $scope.pay_types.push($that);
                        }
                    })
                });
            }
            var param_id = $stateParams.id;
            $scope.hotel_tel_list = [];
            $scope.COPY_BOOKING_hotel = -1 != ($location.$$url).indexOf('hotel-booking-copy');
            $scope.day_types = dayType.items;
            consumptionHoteltravel.getHotelTravel().$promise.then(function (data) {
                $scope.consumptionHoteltravels = data;
                setDefaultHotelTravelId();
                getHotelBookingDetail();
            });

            if (!angular.isUndefined(param_id)) {
                $scope.sub_post_put = 'PUT';
            } else {
                $scope.sub_post_put = 'POST';
            }

            $scope.consumptionhotel_url = globalFunction.getApiUrl('consumption/consumptionhotel');
            $scope.isDisabled = false;

            var isModifing = false;

            var agent_about_init = {
                agent_code: "",
                agent_name: "",
                hall_name: "",
                hotel_id: "",
                hotel_name: "",
                hotel_travel_name: "",
                room_type_id: "",
                room_no: "",
                should_pay: "",
                username: ""
            };
            $scope.agent_about = angular.copy(agent_about_init);

            var hotelBooking_init = {

                agent_info_id: "",
                hotel_travel_id: "",
                hotel: "",
                hotel_travel_type: "",
                //room_type : '',
                room: "",
                days: 1,
                checkin_datetime: "",
                checkout_datetime: "",

                consumption: {
                    book_no: "",
                    pay_type_id: $scope.default_pay_type_id,
                    remark: "",
                    trader: "",
                    trader_tel: "",
                    should_pay: "",
                    shift_date: $scope.global_params.shift_date,
                    year_month: $scope.global_params.year_month,
                    shift: $scope.global_params.shift,
                    area_code_id: null
                },
                consumptionHotelSubs: [
                    /*{
                     checkin_datetime : "",
                     day_type : "",
                     count : ""
                     }*/
                ],
                consumptionHotelRegisters: [{
                    register: "",
                    idcard_type_id: "",
                    idcard_no: ""
                }],

                settlement_by_checkin: 0,
                pin_code: ''

            }

            var registers = {
                register: "",
                idcard_type_id: "",
                idcard_no: ""
            }


            var hotelBooking_original = angular.copy(hotelBooking_init);
            $scope.hotelBooking = angular.copy(hotelBooking_init);

            $scope.hotels = [];
            $scope.hotel_roomTypes = [];
            $scope.hotel_total = {
                cost: 0,
                sell: 0,
                profit: 0,
                should_pay: 0
            }

            //$scope.hotelBooking.rooms.splice(0,1);

            var select_sms_init = {
                value: ""
            };

            $scope.isSendSms = false;

            $scope.sms_type = angular.copy(select_sms_init);

            $scope.sms_types = [];


            //alert($stateParams.id);

            if (angular.isUndefined(param_id)) {
                $scope.isSendSms = true;
                hotelSmsType.query({
                    hall_id: user.hall.id,
                    consumption_code: "HOTEL"
                }).$promise.then(function (data) {
                        $scope.sms_types = data;
                    });
            }


            function getHotelBookingDetail() {
                if (!angular.isUndefined(param_id)) {

                    consumptionHotel.query(globalFunction.generateUrlParams({
                        consumption_id: param_id
                    }, {
                        consumption: {},
                        consumptionHotelSubs: {},
                        consumptionHotelRegisters: {}
                    })).$promise.then(function (data) {
                            var data = data[0];
                            if (!data) {
                                return;
                            }
                            $scope.sub_post_put = 'PUT';
                            hotelBooking_original = _.extend_exist(hotelBooking_original, data);
                            //$scope.hotelBooking = angular.copy(hotelBooking_original);

                            hotelBooking_original.id = data.id;

                            //hotelBooking_original.hotel = hotelBooking_original.hotel_name;


                            hotelBooking_original.consumption.id = data.consumption.id;
                            hotelBooking_original.consumption.status = data.consumption.status;
                            hotelBooking_original.checkin_datetime = $filter('parseDate')(data.checkin_datetime, 'yyyy-MM-dd');
                            hotelBooking_original.checkout_datetime = $filter('parseDate')(data.checkout_datetime, 'yyyy-MM-dd');
                            hotelBooking_original.consumption.shift_date = $filter('parseDate')(data.consumption.shift_date, 'yyyy-MM-dd');

                            hotelBooking_original.consumption.year_month = $filter('parseDate')(data.consumption.year_month, 'yyyy-MM');


                            _.each(hotelBooking_original.consumptionHotelSubs, function ($hotel_sub, key) {

                                hotelBooking_original.consumptionHotelSubs[key].day = $filter('parseDate')($hotel_sub.checkin_datetime, 'yyyy-MM-dd');
                                hotelBooking_original.consumptionHotelSubs[key].shift_date = $filter('parseDate')($hotel_sub.shift_date, 'yyyy-MM-dd');
                                hotelBooking_original.consumptionHotelSubs[key].shift_date_sub = $filter('parseDate')($hotel_sub.shift_date_sub, 'yyyy-MM-dd');


                                hotelBooking_original.consumptionHotelSubs[key].year_month = $filter('parseDate')($hotel_sub.year_month, 'yyyy-MM');
                                hotelBooking_original.consumptionHotelSubs[key].cost = $filter('parseTenThousandToYuan')($hotel_sub.cost, false);
                                hotelBooking_original.consumptionHotelSubs[key].sell = $filter('parseTenThousandToYuan')($hotel_sub.sell, false);
                                hotelBooking_original.consumptionHotelSubs[key].cost_total = $filter('parseTenThousandToYuan')($hotel_sub.cost_total, false);
                                hotelBooking_original.consumptionHotelSubs[key].sell_total = $filter('parseTenThousandToYuan')($hotel_sub.sell_total, false);
                                hotelBooking_original.consumptionHotelSubs[key].should_pay = $filter('parseTenThousandToYuan')($hotel_sub.should_pay, false);
                                hotelBooking_original.consumptionHotelSubs[key].actual_should_pay = $hotel_sub.actual_should_pay || $hotel_sub.actual_should_pay == 0 ? $filter('parseTenThousandToYuan')($hotel_sub.actual_should_pay, false) : "";
                                //hotelBooking_original.consumptionHotelSubs[key].date_type = $hotel_sub.day_type;
                            });

                            $scope.agent_about.agent_code = data.agent_code;
                            $scope.agent_about.hall_name = data.hall_name;
                            $scope.agent_about.hotel_name = data.hotel_name;
                            $scope.agent_about.hotel_travel_name = data.hotel_travel_name;


                            $scope.hotelBooking = angular.copy(hotelBooking_original);


                            $timeout(function () {

                                var travel_obj = _.findWhere($scope.consumptionHoteltravels, {
                                    id: data.hotel_travel_id
                                });
                                if (travel_obj) {
                                    $scope.changeHotelTravel(true);
                                    isModifing = true;

                                    hotelBooking_original.hotel_travel_id = travel_obj.id;
                                    hotelBooking_original.hotel_travel_type = travel_obj.hotel_travel_type;
                                    $timeout(function () {
                                        hotelBooking_original.hotel = data.hotel_name;
                                        $scope.hotelBooking.hotel = data.hotel_name;

                                        $scope.agent_about.hotel_id = data.hotel_id;
                                        if (1 == travel_obj.hotel_travel_type) {
                                            var hotels = travel_obj.refHotelTravelHotels;
                                            $scope.hotels = hotels;
                                            //return;

                                            var rooms = null;
                                            var hotel_roomTypes = null;
                                            _.each(hotels, function ($that, $key) {
                                                if (!rooms) {
                                                    rooms = _.findWhere($that.hotel.roomTypes, {
                                                        id: data.room_type_id
                                                    });
                                                    hotel_roomTypes = $that.hotel.roomTypes;
                                                }
                                            });
                                            if (rooms) {
                                                $timeout(function () {

                                                    $scope.agent_about.room_type_id = data.room_type_id;
                                                    hotelBooking_original.room = data.room_type_id;
                                                    $scope.hotelBooking.room = data.room_type_id;
                                                    $scope.hotel_roomTypes = hotel_roomTypes;
                                                    $timeout(function () {
                                                        $scope.hotelBooking.days = data.days;
                                                        $scope.hotelBooking.consumptionHotelSubs = hotelBooking_original.consumptionHotelSubs;
                                                        cal_hotel_total();
                                                        $scope.hotelBooking.consumption.should_pay = $filter('parseTenThousandToYuan')(data.consumption.should_pay);
                                                    }, 100)
                                                }, 100);
                                            }
                                        } else {
                                            $timeout(function () {
                                                hotelBooking_original.room = data.room_type;
                                                $scope.hotelBooking.room = data.room_type;
                                                $timeout(function () {
                                                    $scope.hotelBooking.days = data.days;
                                                    $scope.hotelBooking.consumptionHotelSubs = hotelBooking_original.consumptionHotelSubs;
                                                    $scope.hotelBooking.hotel = data.hotel_name;
                                                    $scope.hotelBooking.hotel_travel_type = 2;
                                                    cal_hotel_total();
                                                    $scope.hotelBooking.consumption.should_pay = $filter('parseTenThousandToYuan')(data.consumption.should_pay);
                                                }, 100)
                                            }, 100);

                                        }

                                    }, 100);
                                }
                            }, 100);
                        })
                } else {
                    setDefaultSettlementType();
                }
            }

            //监听 消费类型 获取 type， 与hotels，并根据type 设置 需要 input or select
            $scope.changeHotelTravel = function (isReset) {
                var new_value = $scope.hotelBooking.hotel_travel_id;

                $scope.hotelBooking.hotel_travel_type = "";
                $scope.hotels = [];
                $scope.hotel_roomTypes = [];
                $scope.hotelBooking.room = "";
                $scope.agent_about.hotel_id = "";

                if (isReset) {
                    $scope.agent_about.hotel_travel_name = "";
                    $scope.agent_about.hotel_name = "";
                    //$scope.agent_about.hotel_id = "";
                    $scope.agent_about.room_type_id = "";

                } else {
                    $scope.hotelBooking.consumptionHotelSubs = [];
                    $scope.hotelBooking.days = 1;
                }


                if (new_value) {
                    var travel_obj = (_.where($scope.consumptionHoteltravels, {
                        id: new_value
                    }))[0];
                    $scope.hotelBooking.hotel_travel_type = travel_obj.hotel_travel_type;
                    $scope.agent_about.hotel_travel_name = travel_obj.name;
                    if (1 == $scope.hotelBooking.hotel_travel_type) {
                        $scope.hotels = travel_obj.refHotelTravelHotels;
                        //$scope.agent_about.hotel_id = travel_obj.refHotelTravelHotel.hotel.id;
                        //$scope.hotelBooking.hotel = travel_obj.refHotelTravelHotel.hotel.hotel_name;
                        //$scope.hotel_roomTypes = travel_obj.refHotelTravelHotel.hotel.roomTypes;
                        //
                    } else {
                        $scope.hotelBooking.room = "";
                        $scope.hotelBooking.hotel = "";
                    }
                }
            }

            var setDefaultSettlementType = function () {
                var default_hall = $scope.user.hall.hall_name;
                if (-1 == default_hall.indexOf('MGM鉅星')) {
                    $scope.hotelBooking.settlement_by_checkin = 0;
                }

                //當是凱旋門廳管默認不勾選
                if (user.hall.hall_name === "凱旋門") {
                    $scope.hotelBooking.settlement_by_checkin = 0;
                }
            }

            $scope.$on('consumptionHoteltravelQuery', function (event) {
                setDefaultHotelTravelId();
                //getHotelBookingDetail();
            });

            var setDefaultHotelTravelId = function () {
                if ($scope.default_hotel_travel_id) {
                    hotelBooking_init.hotel_travel_id = $scope.default_hotel_travel_id;
                    hotelBooking_original.hotel_travel_id = $scope.default_hotel_travel_id;
                    $scope.hotelBooking.hotel_travel_id = $scope.default_hotel_travel_id;

                }
                $scope.changeHotelTravel();
            };
            setDefaultHotelTravelId();

            $scope.$on('consumptionShiftDataChange', function (event) {
                var year_month = angular.isDate()
                hotelBooking_init.consumption.shift_date = $scope.$parent.global_params.shift_date;
                hotelBooking_init.consumption.year_month = $scope.$parent.global_params.year_month;
                hotelBooking_init.consumption.shift = $scope.$parent.global_params.shift;
                hotelBooking_original.consumption.shift_date = $scope.$parent.global_params.shift_date;
                hotelBooking_original.consumption.year_month = $scope.$parent.global_params.year_month;
                hotelBooking_original.consumption.shift = $scope.$parent.global_params.shift;
                $scope.hotelBooking.consumption.shift_date = $scope.$parent.global_params.shift_date;
                $scope.hotelBooking.consumption.year_month = $scope.$parent.global_params.year_month;
                $scope.hotelBooking.consumption.shift = $scope.$parent.global_params.shift;
            });

            //监听 酒店select 获取 对应酒店房型
            $scope.$watch('agent_about.hotel_id', function (new_value, old_value) {

                $scope.hotelBooking.consumptionHotelSubs = [];
                $scope.hotelBooking.days = 1;
                if (new_value) {
                    var hotel = _.findWhere($scope.hotels, {
                        hotel_id: new_value
                    });

                    if (hotel) {
                        $scope.agent_about.hotel_name = hotel.hotel.hotel_name;
                        $scope.hotel_roomTypes = hotel.hotel.roomTypes;
                        $scope.hotelBooking.hotel = new_value;
                    }

                    /*_.each($scope.hotels, function(index)
                     {
                     var travel_obj = (_.where(index, {id : new_value}));
                     if(new_value == index.hotel_id)
                     {
                     $scope.agent_about.hotel_name = index.hotel.hotel_name;
                     $scope.hotel_roomTypes = index.hotel.roomTypes;
                     $scope.hotelBooking.hotel = new_value;
                     return false;
                     }
                     else
                     {
                     $scope.hotelBooking.hotel = "";
                     $scope.agent_about.hotel_name = "";
                     $scope.hotel_roomTypes = [];
                     }
                     });*/
                } else {
                    $scope.hotelBooking.hotel = "";
                    $scope.agent_about.hotel_name = "";
                    $scope.hotel_roomTypes = [];
                }
            });

            $scope.$watch('agent_about.room_type_id', function (new_value, old_value) {
                $scope.hotelBooking.consumptionHotelSubs = [];
                $scope.hotelBooking.days = 1;
                if (new_value) {
                    //var roomobj = (_.where($scope.hotel_roomTypes, {id : new_value}));
                    $scope.hotelBooking.room = new_value;
                } else {
                    $scope.hotelBooking.room = "";
                }
            })

            //获取日期， 价格列表
            function getValidate(date, is_change_select) {
                if ($scope.hotelBooking.hotel_travel_id && $scope.hotelBooking.room && $scope.hotelBooking.hotel && Number($scope.hotelBooking.days) != $scope.hotelBooking.consumptionHotelSubs.length) {
                    var format_data = $filter('date')(date, 'yyyy-MM-dd')
                    if (2 == $scope.hotelBooking.hotel_travel_type) {
                        var tmp_condition = {
                            hotel_travel_type: $scope.hotelBooking.hotel_travel_type,
                            day: format_data,
                            hotel_travel_id: $scope.hotelBooking.hotel_travel_id,
                            hotel: $scope.hotelBooking.hotel,
                            room_type: $scope.hotelBooking.room
                        };
                    } else if (1 == $scope.hotelBooking.hotel_travel_type) {
                        var tmp_condition = {
                            hotel_travel_type: $scope.hotelBooking.hotel_travel_type,
                            day: format_data,
                            hotel_travel_id: $scope.hotelBooking.hotel_travel_id,
                            hotel: $scope.agent_about.hotel_id,
                            room_type: $scope.agent_about.room_type_id
                        };
                    }
                    consumptionHotelValidateDate.get(tmp_condition).$promise.then(function (data) {
                        if (is_change_select) {
                            //$scope.hotelBooking.consumptionHotelSubs = hotelBooking_original.consumptionHotelSubs;
                        }
                        var tmp_data = data;
                        tmp_data.cost = $filter('parseTenThousandToYuan')(data.cost, false);
                        tmp_data.sell = $filter('parseTenThousandToYuan')(data.sell, false);
                        tmp_data.actual_should_pay = tmp_data.sell;
                        tmp_data.should_pay = 0;
                        tmp_data.room_no = $scope.agent_about.room_no;

                        if ($scope.hotelBooking.settlement_by_checkin) {
                            tmp_data.shift_date_sub = data.day;
                            tmp_data.year_month = $scope.global_params.year_month;
                            tmp_data.shift_sub = $scope.hotelBooking.consumption.shift
                        }

                        if (!_.findWhere($scope.hotelBooking.consumptionHotelSubs, {
                                day: format_data
                            })) {
                            $scope.hotelBooking.consumptionHotelSubs.push(tmp_data);
                            //$scope.hotelBooking.consumptionHotelSubs = _.indexBy($scope.hotelBooking.consumptionHotelSubs, 'day');
                        } else {
                            _.each($scope.hotelBooking.consumptionHotelSubs, function (value, key) {
                                if (value.day == format_data) {
                                    $scope.hotelBooking.consumptionHotelSubs[key] = tmp_data;
                                    return false;
                                }
                            })
                        }
                        cal_hotel_total();
                    })
                }
            }

            $scope.$watch('hotelBooking.hotel_travel_id + hotelBooking.room + agent_about.hotel_name ', globalFunction.debounce(function (new_value, old_value) {
                //$scope.hotelBooking.consumptionHotelSubs = [];
                //var add_length = new_value - old_value;
                if (isModifing) {
                    isModifing = false;
                    return false;
                }

                var days = parseInt($scope.hotelBooking.days);
                var in_date = $filter('date')($scope.hotelBooking.checkin_datetime, 'yyyy-MM-dd');
                for (var i = days; i; i--) {
                    var out_date = getDate(new Date(in_date).setDate(new Date(in_date).getDate() + days - i));
                    getValidate(out_date, true);
                }
                //getValidate($scope.hotelBooking.checkin_datetime, true);
            }));

            $scope.change_settlement = function () {
                if ($scope.hotelBooking.settlement_by_checkin) {
                    _.each($scope.hotelBooking.consumptionHotelSubs, function ($that, $key) {
                        $that.shift_date_sub = $that.shift_date_sub ? $that.shift_date_sub : $that.day;
                        $that.year_month = $that.year_month ? $that.year_month : $scope.global_params.year_month;
                        $that.shift_sub = $that.shift_sub ? $that.shift_sub : $scope.hotelBooking.consumption.shift;
                    })
                }
            }

            // 监听预订酒店 户口编号
            $scope.$watch('agent_about.agent_code', globalFunction.debounce(function (new_value, old_value) {
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({
                        agent_code: new_value
                    }, {
                        parentSupervisor: {}
                    })).$promise.then(function (agent) {
                            if (agent.length > 0) {
                                $scope.agent_about.agent_name = agent[0].agent_name;
                                //$scope.hotelBooking.consumption.agent_info_id = agent[0].id;
                                $scope.hotelBooking.agent_info_id = agent[0].id;
                                //$scope.order.agent_info_id = $scope.agent.id;
                            } else {
                                $scope.hotelBooking.agent_info_id = "";
                                //$scope.hotelBooking.consumption.agent_info_id = "";
                                $scope.agent_about.agent_name = "";
                            }
                        });
                } else {
                    $scope.hotelBooking.agent_info_id = "";
                    //$scope.hotelBooking.consumption.agent_info_id = "";
                    $scope.agent_about.agent_name = "";
                }
            }));

            function cal_in_date(value) {
                var in_date = getDate(new Date(in_date).setDate(new Date(in_date).getDate()));
                hotelBooking_original.checkin_datetime = in_date;
                $scope.hotelBooking.checkin_datetime = in_date;

            }

            cal_in_date();

            function cal_out_date(new_value, old_value) {
                var days = parseInt($scope.hotelBooking.days);
                var in_date = $filter('date')($scope.hotelBooking.checkin_datetime, 'yyyy-MM-dd');
                var out_date = getDate(new Date(in_date).setDate(new Date(in_date).getDate() + days));
                $scope.hotelBooking.checkout_datetime = out_date;
            }

            //更新 入住日期
            $scope.setTime = function () {
                $scope.hotelBooking.days = 1;
                $scope.hotelBooking.consumptionHotelSubs = [];
                var days = parseInt($scope.hotelBooking.days);
                if ($scope.hotelBooking.checkin_datetime) {
                    cal_out_date();
                    var in_date = $filter('date')($scope.hotelBooking.checkin_datetime, 'yyyy-MM-dd');
                    var out_date = getDate(new Date(in_date).setDate(new Date(in_date).getDate()));
                    getValidate(out_date);
                }
            }

            //监听 入住天数
            $scope.$watch('hotelBooking.days', globalFunction.debounce(function (new_value, old_value) {
                if (new_value > 0) {
                    cal_out_date(new_value, old_value);
                    if (new_value > old_value) {
                        var add_length = new_value - old_value;
                        var days = parseInt($scope.hotelBooking.days);
                        var in_date = $filter('date')($scope.hotelBooking.checkin_datetime, 'yyyy-MM-dd');

                        if (1 == days) {
                            $scope.hotelBooking.consumptionHotelSubs = [];
                        }

                        for (var i = add_length; i; i--) {
                            var out_date = getDate(new Date(in_date).setDate(new Date(in_date).getDate() + days - i));
                            getValidate(out_date);
                        }
                    } else if (old_value > new_value) {
                        var delete_length = old_value - new_value;
                        $scope.hotelBooking.consumptionHotelSubs.splice($scope.hotelBooking.consumptionHotelSubs.length - delete_length, delete_length);
                        cal_hotel_total();
                    }
                    //$scope.setPrice(new_value);
                } else {
                    $scope.hotelBooking.days = 1;
                }
            }, 300));

            $scope.hotel_tel_list = [];
            $scope.$watch('hotelBooking.consumption.trader', globalFunction.debounce(function (new_value) {

                if (new_value) {
                    auto_complete(new_value);
                } else {
                    $scope.hotel_tel_list = [];
                }
            }));

            $scope.hotel_agent_list = [];
            $scope.hotel_tel_list = [];
            $scope.hotel_idcard_list = [];

            function auto_complete(new_value) {
                if (new_value && $scope.hotelBooking.agent_info_id) {
                    var list = _.findWhere($scope.hotel_agent_list, {
                        agent_guest_name: new_value
                    });
                    if (list) {
                        $scope.hotel_tel_list = list.guestTels;
                        $scope.hotel_idcard_list = list.idCards;
                        if (list.idCards.length) {
                            //$scope.hotelBooking.idcard_type_id = list.idCards[0].idcard_type_id;
                            //$scope.hotelBooking.idcardtype_number = list.idCards[0].idcard_number;
                        }
                    } else {
                        agentGuest.query(globalFunction.generateUrlParams({
                            agent_guest_name: new_value + '!',
                            agent_info_id: $scope.hotelBooking.agent_info_id
                        }, {
                            guestTels: {},
                            idCards: {},
                            guestImages: {}
                        })).$promise.then(function (data) {
                                $scope.hotel_agent_list = data;
                            })
                    }
                } else {
                    $scope.hotel_agent_list = [];
                    $scope.hotel_tel_list = [];
                    $scope.hotel_idcard_list = [];
                }

            }


            $scope.ChangeRegister = function ($index, register) {
                auto_complete($scope.hotelBooking.registered);
                if (0 == $index) {
                    $scope.hotelBooking.consumption.trader = register.register;
                }
            }

            //统计
            function cal_hotel_total() {
                $scope.hotel_total = {
                    cost: 0,
                    sell: 0,
                    profit: 0,
                    should_pay: 0
                }
                var pay = 0; //合計
                _.each($scope.hotelBooking.consumptionHotelSubs, function ($this) {
                    $scope.hotel_total.cost += Number($this.cost);
                    $scope.hotel_total.sell += Number($this.sell);

                    $this.profit = Number($this.sell) - Number($this.cost);
                    $scope.hotel_total.profit += $this.profit;
                    pay += Number($this.sell) + Number($this.should_pay);
                })

                $scope.hotel_total.should_pay = pay;
                $scope.hotelBooking.consumption.should_pay = $filter('parseYuan')(pay);
            }

            $scope.changePrice = function () {
                cal_hotel_total()
            }
            $scope.changePrice2 = function (price_list, type, $index) {
                if (type == 1) {
                    _.each($scope.hotelBooking.consumptionHotelSubs, function (d) {
                        d.actual_should_pay = d.sell
                    })
                } else if (type == 2) {
                    _.each($scope.hotelBooking.consumptionHotelSubs, function (d) {
                        d.sell = d.actual_should_pay
                    })
                }
                cal_hotel_total()
            }

            /*$scope.$watch('hotelBooking.consumptionHotelSubs', function()
             {
             cal_hotel_total()
             }, true);*/

            $scope.remove_consumptionHotelSub = function ($index) {
                //$scope.hotelBooking.consumptionHotelSubs.splice($index, 1);
                if (1 == $scope.hotelBooking.days) {
                    $scope.hotelBooking.checkin_datetime = "";
                    $scope.setTime();
                } else {
                    $scope.hotelBooking.days = $scope.hotelBooking.days - 1;
                }
            }

            //房间号码
            $scope.getRoomNumber = function () {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/consumption-manager/modal_hotel_number.html",
                    controller: 'GetHotelRoomNumerCtrl',
                    resolve: {
                        Room_no: function () {
                            return $scope.agent_about.room_no;
                        }
                    }
                });
                modalInstance.result.then((function (result) {
                    if (result) {
                        $scope.agent_about.room_no = result.number;
                        _.each($scope.hotelBooking.consumptionHotelSubs, function ($that, key) {
                            $that['room_no'] = result.number;
                        })
                    }
                }), function () {
                });
            }
            //房間消费
            $scope.getRoomConsumption = function () {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/consumption-manager/modal_hotel_consumption.html",
                    controller: 'GetRoomConsumptionCtrl',
                    windowClass: 'lg-modal',
                    resolve: {
                        consumptionHotelSubs: function () {
                            return $scope.hotelBooking.consumptionHotelSubs;
                        },
                        pay_types: function () {
                            return $scope.pay_types;
                        },
                        shiftLists: function () {
                            return $scope.shiftLists;
                        },
                        Room_no: function () {
                            return $scope.agent_about.room_no;
                        },
                        shiftDefaultDate: function () {
                            return {
                                shift_date: $scope.hotelBooking.consumption.shift_date,
                                shift: $scope.hotelBooking.consumption.shift
                            }
                        }
                    }
                });
                modalInstance.result.then((function (result) {
                    if (result) {
                        $scope.hotelBooking.consumptionHotelSubs = result;
                        var should_pay = 0;
                        for (var i = 0, j = result.length; i < j; i++) {
                            should_pay += Number(result[i]['should_pay']);
                        }
                        $scope.agent_about.should_pay = should_pay;
                        cal_hotel_total();
                    }
                }), function () {
                    //$log.info("Modal dismissed at: " + new Date());
                });
            }

            //按入住模式 结算
            $scope.getCheckModeConsumption = function () {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/consumption-manager/modal_check_mode_consumption.html",
                    controller: 'GetCheckModeConsumptionCtrl',
                    windowClass: 'lg-modal',
                    resolve: {
                        consumptionHotelSubs: function () {
                            return $scope.hotelBooking.consumptionHotelSubs;
                        },
                        pay_types: function () {
                            return $scope.pay_types;
                        },
                        shiftLists: function () {
                            return $scope.shiftLists;
                        },
                        Room_no: function () {
                            return $scope.agent_about.room_no;
                        },
                        shiftDefaultDate: function () {
                            return {
                                shift_date: $scope.hotelBooking.consumption.shift_date,
                                shift: $scope.hotelBooking.consumption.shift,
                                year_month: $scope.hotelBooking.consumption.year_month
                            }
                        }
                    }
                });
                modalInstance.result.then((function (result) {
                    if (result) {
                        $scope.hotelBooking.consumptionHotelSubs = result;
                    }
                }), function () {
                    //$log.info("Modal dismissed at: " + new Date());
                });
            }

            $scope.AddRegister = function () {
                var register = angular.copy(registers);
                $scope.hotelBooking.consumptionHotelRegisters.push(register);
            }

            $scope.RemoveRegister = function ($index) {
                $scope.hotelBooking.consumptionHotelRegisters.splice($index, 1);
            }
            //生成备注 酒店
            $scope.creatremark = function () {

                var text = ""
                for (var i = 0; i < $scope.hotelBooking.consumptionHotelRegisters.length; i++) {
                    text +=
                        "，房間登記人：" + $scope.hotelBooking.consumptionHotelRegisters[i].register + "，證件號碼：" + $scope.hotelBooking.consumptionHotelRegisters[i].idcard_no
                }
                var areaCodes = ""
                if ($scope.hotelBooking.consumption.area_code_id) {
                    areaCodes = $filter("filter")($scope.areaCodes, {
                            "id": $scope.hotelBooking.consumption.area_code_id
                        })[0].area_code + "-"
                }

                $scope.hotelBooking.consumption.remark =
                    $filter('date')($scope.hotelBooking.checkin_datetime, 'yyyy-MM-dd') + "IN~" + $filter('date')($scope.hotelBooking.checkout_datetime, 'yyyy-MM-dd') + "OUT" + text + "，訂房人：" + ($scope.hotelBooking.consumption.trader ? $scope.hotelBooking.consumption.trader : "") + "，電話：" + areaCodes + ($scope.hotelBooking.consumption.trader_tel ? $scope.hotelBooking.consumption.trader_tel : "")
            }
            $scope.add = function (hasSms) {


                var sms_type = angular.copy($scope.sms_type);

                var tmp_booking = angular.copy($scope.hotelBooking);

                /*_.each(tmp_booking.consumptionHotelRegisters,function(ele,index){

                 if(ele.register != "" && ele.idcard_no == ""){
                 topAlert.warning("如填寫房間登記人，則登記人證件號碼不得為空");
                 return;
                 }
                 });*/

                if (tmp_booking.consumption.trader_tel != null && tmp_booking.consumption.trader_tel != "") {
                    if (tmp_booking.consumption.area_code_id == "" || tmp_booking.consumption.area_code_id == null) {
                        topAlert.warning("如填寫訂房人電話則電話區域不能為空");
                        return;
                    }
                }


                tmp_booking.consumption.should_pay = $filter('parseYuanToTenThousand')(tmp_booking.consumption.should_pay);
                tmp_booking.consumption.should_pay = $filter('parseYuan')(tmp_booking.consumption.should_pay);
                tmp_booking.consumption.shift_date = $filter('date')(tmp_booking.consumption.shift_date, 'yyyy-MM-dd');

                tmp_booking.consumption.year_month = $filter('date')(tmp_booking.consumption.year_month, 'yyyy-MM');

                tmp_booking.pin_code = $scope.global_params.pin_code ? $scope.global_params.pin_code : tmp_booking.pin_code;
                tmp_booking.settlement_by_checkin = Number(tmp_booking.settlement_by_checkin);

                var hotelsubs = [];


                var room_no = new Array();
                var registers = new Array();

                _.each(tmp_booking.consumptionHotelSubs, function (ele) {

                    if (ele.room_no != "") {
                        room_no.push(("#" + ele.room_no));
                    }
                });

                room_no = _.union(room_no);

                room_no = room_no.join(",");


                _.each(tmp_booking.consumptionHotelRegisters, function (ele) {

                    if (ele.register != "" && ele.register != null) {
                        registers.push(ele.register);
                    }

                });

                registers = _.union(registers);

                registers = registers.join(",");


                for (var i = 0, j = tmp_booking.consumptionHotelSubs.length; i < j; i++) {
                    var that_subs = tmp_booking.consumptionHotelSubs[i];

                    var should_pay = that_subs['should_pay'] == "" || that_subs['should_pay'] == undefined || that_subs['should_pay'] == null ? 0 : $filter('parseYuanToTenThousand')(that_subs['should_pay'], false);
                    should_pay = should_pay.toString() == "" || should_pay == undefined || should_pay == null ? 0 : $filter('parseYuan')(should_pay);

                    var actual_should_pay = that_subs['actual_should_pay'] == "" || that_subs['actual_should_pay'] == undefined || that_subs['actual_should_pay'] == null ? "" : $filter('parseYuanToTenThousand')(that_subs['actual_should_pay']);
                    actual_should_pay = actual_should_pay.toString() == "" || actual_should_pay == undefined || actual_should_pay == null ? "0" : $filter('parseYuan')(actual_should_pay);


                    /*var pay_type_id = that_subs['pay_type_id'] ?  that_subs['pay_type_id'] : "";
                     var shift_date =that_subs['shift_date'] ? $filter('date')(that_subs['shift_date'], 'yyyy-MM-dd') : "";
                     var shift = that_subs['shift'] ?  that_subs['shift'] : "";*/

                    var shift_date_sub = "";
                    var year_month = "";
                    var shift_sub = "";
                    if (1 == tmp_booking.settlement_by_checkin) {
                        shift_date_sub = that_subs['shift_date_sub'] ? $filter('date')(that_subs['shift_date_sub'], 'yyyy-MM-dd') : "";
                        year_month = that_subs['year_month'] ? $filter('date')(that_subs['year_month'], 'yyyy-MM') : "";
                        shift_sub = that_subs['shift_sub'] ? that_subs['shift_sub'] : "";
                        //shift_date = shift_date_sub;
                        //shift = shift_sub;
                    }
                    //pay_type_id = tmp_booking.consumption.pay_type_id;

                    var tmp_subs = {
                        checkin_datetime: that_subs['day'],
                        room_no: that_subs['room_no'],
                        should_pay: should_pay,
                        actual_should_pay: actual_should_pay,
                        //pay_type_id : pay_type_id,
                        //shift_date : shift_date,
                        //shift : shift,
                        shift_date_sub: shift_date_sub,
                        year_month: year_month,
                        shift_sub: shift_sub,
                        cost: $filter('parseYuanToTenThousand')(that_subs['cost']),
                        sell: $filter('parseYuanToTenThousand')(that_subs['sell'])
                    };
                    tmp_subs.cost = $filter('parseYuan')(tmp_subs.cost);
                    tmp_subs.sell = $filter('parseYuan')(tmp_subs.sell);
                    if (that_subs['id']) {
                        tmp_subs['id'] = that_subs['id'];
                    }
                    hotelsubs.push(tmp_subs);
                }
                if (1 == tmp_booking.hotel_travel_type) {
                    tmp_booking.hotel = $scope.agent_about.hotel_id;
                }
                tmp_booking.consumptionHotelSubs = hotelsubs;
                tmp_booking.checkin_datetime = $filter('date')(tmp_booking.checkin_datetime, 'yyyy-MM-dd');

                var tmp_register = [];
                _.each(tmp_booking.consumptionHotelRegisters, function ($that, $key) {
                    if ($that.register || $that.idcard_type_id || $that.idcard_no) {
                        tmp_register.push($that);
                    } else {
                        $scope.hotelBooking.consumptionHotelRegisters.splice($key, 1);
                    }
                });
                tmp_booking.consumptionHotelRegisters = tmp_register;
                if (!$scope.hotelBooking.consumptionHotelRegisters.length) {
                    $scope.hotelBooking.consumptionHotelRegisters = [{
                        register: "",
                        idcard_type_id: "",
                        idcard_no: ""
                    }]
                }


                var sub_method = consumptionHotel.save;

                var count = 1;


                var hotel = "";
                var room = _.findWhere($scope.hotel_roomTypes, {
                    id: $scope.agent_about.room_type_id
                });

                if (tmp_booking.hotel_travel_type == 2) {
                    hotel = tmp_booking.hotel
                } else {
                    hotel = _.findWhere($scope.hotels, {
                        hotel_id: $scope.agent_about.hotel_id
                    });
                    hotel = hotel ? hotel.hotel.hotel_name : ""
                }

                var model = {
                    isHasSms: true,
                    send_time: "hotel",
                    // 服务器查询回来的数据
                    sms: _.findWhere($scope.sms_types, {
                        id: sms_type.value
                    }),
                    // 户口名称
                    agent_name: $scope.agent_about.agent_name,
                    // 戶口編號
                    agent_code: $scope.agent_about.agent_code,
                    // 当前厅馆信息
                    hall: user.hall,
                    // 酒店
                    hotel: hotel,
                    // 房间类型
                    room_type: room ? room.room_type : "",
                    // 房间号
                    room_number: room_no,
                    // 数量
                    count: count,
                    // 天数
                    days: tmp_booking.days,
                    // 入住时间 or 续租时间
                    in_date: tmp_booking.checkin_datetime,
                    // 退房时间
                    out_date: tmp_booking.checkout_datetime,
                    // 订单编号
                    book_no: tmp_booking.consumption.book_no,
                    // 房间登记人
                    booker: registers,
                    // 通知人(订票人)
                    notify: {
                        trader: tmp_booking.consumption.trader,
                        area_code_id: tmp_booking.consumption.area_code_id,
                        trader_tel: tmp_booking.consumption.trader_tel
                    },
                    // 押金
                    deposit: count * 1000
                };

                /*return;*/

                /* if(hasSms){
                 ConsumptionSmsTemp.init(angular.copy(model));
                 }*/

                var tis = "添加成功";
                if ('PUT' == $scope.sub_post_put) {
                    sub_method = consumptionHotel.update;
                    tis = "修改成功";
                    ConsumptionSmsTemp.destroy();
                }
                if ($scope.COPY_BOOKING_hotel) {
                    sub_method = consumptionHotel.save;
                    tis = "複製成功";
                    ConsumptionSmsTemp.destroy();
                }
                if ($scope.isDisabled) {
                    return;
                }
                $scope.isDisabled = true;

                $scope.form_hotel.checkValidity().then(function () {
                    sub_method(tmp_booking, function () {
                        topAlert.success(tis);
                        if ($scope.popupWindow) {
                            $modalInstance.close(" ");
                        }

                        var id = angular.copy($scope.hotelBooking.agent_info_id);

                        $scope.isDisabled = false;
                        $scope.cancel(true);

                        //是否發送短信
                        if (!$scope.hotelBooking.id && hasSms) {
                            if (sms_type.value == "" || sms_type.value == null) {
                                model.isHasSms = false;
                            }
                            ConsumptionSmsTemp.init(angular.copy(model));
                            $location.path("share/share-send-sms/" + id);
                        } else {
                            $scope.hotel_search();
                        }

                    }, function () {
                        $scope.isDisabled = false;
                    });
                });


            }
            // 预订酒店 取消按钮
            $scope.cancel = function (isUpdate) {

                $scope.hotelBooking = angular.copy(hotelBooking_init);
                hotelBooking_original = angular.copy(hotelBooking_init);
                if (!isUpdate) {
                    $scope.hotels = [];
                    $scope.hotel_roomTypes = [];
                }
                $scope.hotel_total = {
                    cost: 0,
                    sell: 0,
                    profit: 0
                }
                $scope.agent_about = angular.copy(agent_about_init);
                if (!$scope.popupWindow) {
                    $location.path('/consumption-manager/consumption-manager/hotel');
                } else {
                    $modalInstance.dismiss();
                }
                cal_in_date();
                cal_out_date();
                setDefaultHotelTravelId();
                setDefaultSettlementType();


                $scope.form_hotel.clearErrors();


            }

        }
    ]).controller('consumptionManagerDetailCtrls', ['$scope', '$stateParams', '$location', 'globalFunction', 'consumptionHotel', '$filter', 'dayType', '$modal', '$window',
        function ($scope, $stateParams, $location, globalFunction, consumptionHotel, $filter, dayType, $modal, $window) {
            $scope.hotelBooking = {};
            $scope.day_types = dayType.items;
            $scope.record_consumption_id = null;
            var param_id = $stateParams.id || $scope.record_consumption_id;

            $scope.hotel_total = {
                cost: 0,
                sell: 0,
                profit: 0,
                actual_should_pay: 0
            }

            if (!angular.isUndefined(param_id)) {
                consumptionHotel.query(globalFunction.generateUrlParams({
                    consumption_id: param_id
                }, {
                    consumption: {},
                    consumptionHotelSubs: {},
                    consumptionHotelRegisters: {}
                })).$promise.then(function (data) {
                        var data = data[0];
                        if (!data) {
                            return;
                        }
                        $scope.hotelBooking = data;
                        var pay_obj = _.findWhere($scope.pay_types, {
                            id: data.consumption.pay_type_id
                        });
                        $scope.hotelBooking.pay_type = pay_obj.pay_type_name;

                        $scope.hotelBooking.checkin_datetime = $filter('parseDate')(data.checkin_datetime, 'yyyy-MM-dd');


                        var consumptionHotelSubs = data.consumptionHotelSubs;
                        _.each(consumptionHotelSubs, function ($this) {
                            $scope.hotel_total.cost += Number($this.cost);
                            $scope.hotel_total.sell += Number($this.sell);
                            $scope.hotel_total.profit += Number($this.profit);
                            $scope.hotel_total.actual_should_pay += Number($this.actual_should_pay) + Number($this.should_pay);
                        })
                    });
            }


            //房間消费
            $scope.getRoomConsumption = function () {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/consumption-manager/modal_hotel_consumption.html",
                    controller: 'RoomConsumptionDetailCtrl',
                    windowClass: 'lg-modal',
                    resolve: {
                        consumptionHotelSubs: function () {
                            return $scope.hotelBooking.consumptionHotelSubs;
                        }
                    }
                });
                modalInstance.result.then((function (result) {
                }), function () {
                    //$log.info("Modal dismissed at: " + new Date());
                });
            }


            $scope.update = function () {
                $location.path('/consumption-manager/consumption-manager/hotel/consumption-hotel-booking-update/' + param_id);
            }

            $scope.cancel = function () {
                //$location.path('/consumption-manager/consumption-manager/hotel');
                $window.history.back();
            }

        }
    ]).controller('consumptionFoodFlyBookingUpdateCtrls', ['$scope', '$location', '$stateParams', 'agentsLists', 'globalFunction', 'consumptionFoodcoupon', 'hotelLists', 'topAlert', '$filter', 'agentGuest', 'shiftMark', 'pinCodeUserName', 'isSendSmsModal', 'shiftMarks', 'idcardType', 'areaCode', 'consumptionPaytype', '$timeout', '$modalInstance', 'ConsumptionSmsTemp',
        function ($scope, $location, $stateParams, agentsLists, globalFunction, consumptionFoodcoupon, hotelLists, topAlert, $filter, agentGuest, shiftMark, pinCodeUserName, isSendSmsModal, shiftMarks, idcardType, areaCode, consumptionPaytype, $timeout, $modalInstance, ConsumptionSmsTemp) {
            //新增消費--食飛
            $scope.popupWindow = false
            if (!$scope.global_params) {
                $scope.popupWindow = true
                $scope.global_params = {};
                $scope.shiftLists = shiftMarks
                $scope.idCardtypes = idcardType.query();
                $scope.areaCodes = areaCode.query();
                $scope.pay_types = [];
                consumptionPaytype.query().$promise.then(function (data) // 支付方式
                {
                    _.each(data, function ($that, $key) {
                        if ('COMMISSION' == $that.pay_type_code || 'COMSUMPTION' == $that.pay_type_code) {
                            $scope.pay_types.push($that);
                        }
                    })
                });
                $timeout(function () {
                    getUpdatedFoodbooking()
                }, 100)
            }
            var param_id = $stateParams.id;
            if (!angular.isUndefined(param_id)) {
                $scope.sub_post_put = 'PUT';
            } else {
                $scope.sub_post_put = 'POST';
            }
            $scope.COPY_BOOKING_food = -1 != ($location.$$url).indexOf('food-fly-booking-copy');

            $scope.sub_post_put = 'POST';
            $scope.foodcoupon_url = globalFunction.getApiUrl('consumption/consumptionfoodcoupon');

            $scope.isDisabled = false;

            if ($scope.hotelLists) {
                getUpdatedFoodbooking();
            } else {
                hotelLists.query(globalFunction.generateUrlParams({}, {
                    restaurants: {}
                })).$promise.then(function (data) {
                        $scope.hotelLists = data;
                        getUpdatedFoodbooking();
                    });
            }
            $scope.restaurants = [];

            var agent_about_init = {
                agent_code: "",
                agent_name: "",
                book_time: "",
                username: ""
            }
            $scope.agent_about = angular.copy(agent_about_init);

            var foodBookingInit = {
                agent_info_id: "",
                restaurant_id: "",
                hotel_id: "",

                consumption: {
                    //agent_info_id: "",
                    book_no: "",
                    pay_type_id: $scope.default_pay_type_id,
                    cost_total: "",//成本
                    sell_total: "",//實收
                    remark: "",
                    status: "",
                    trader: "",
                    trader_tel: "",
                    should_pay: "",
                    shift_date: $scope.global_params.shift_date,
                    year_month: $scope.global_params.year_month,
                    shift: $scope.global_params.shift,
                    area_code_id: null
                },
                pin_code: ''
            };
            var foodBookingOrignal = angular.copy(foodBookingInit);
            $scope.foodBooking = angular.copy(foodBookingOrignal);


            function getUpdatedFoodbooking() {

                if (!angular.isUndefined(param_id)) {
                    consumptionFoodcoupon.query(globalFunction.generateUrlParams({
                        consumption_id: param_id
                    }, {
                        consumption: {}
                    })).$promise.then(function (data) {
                            var data = data[0];
                            if (!data) {
                                return;
                            }
                            $scope.sub_post_put = 'PUT';
                            $scope.agent_about.agent_code = data.agent_code;
                            $scope.agent_about.agent_name = data.agent_name;
                            $scope.agent_about.book_time = data.book_time;
                            $scope.agent_about.hall_name = data.hall_name;

                            $scope.foodBooking.id = data.id;
                            $scope.foodBooking.consumption.trader = data.consumption.trader;
                            $scope.foodBooking.consumption.trader_tel = data.consumption.trader_tel;
                            $scope.foodBooking.agent_info_id = data.agent_info_id;

                            $scope.foodBooking.consumption.id = data.consumption.id;
                            //$scope.foodBooking.consumption.agent_info_id = data.consumption.agent_info_id;
                            $scope.foodBooking.consumption.book_no = data.consumption.book_no;
                            $scope.foodBooking.consumption.pay_type_id = data.consumption.pay_type_id;
                            $scope.foodBooking.consumption.cost_total = Number($filter('parseTenThousandToYuan')(data.consumption.cost_total, false));//成本
                            $scope.foodBooking.consumption.sell_total = Number($filter('parseTenThousandToYuan')(data.consumption.sell_total, false));//實收
                            $scope.foodBooking.consumption.shift_date = $filter('parseDate')(data.consumption.shift_date, 'yyyy-MM-dd');

                            $scope.foodBooking.consumption.year_month = $filter('parseDate')(data.consumption.year_month, 'yyyy-MM');

                            $scope.foodBooking.consumption.shift = data.consumption.shift;


                            $scope.foodBooking.consumption.area_code_id = data.consumption.area_code_id;


                            $scope.foodBooking.consumption.remark = data.consumption.remark;
                            $scope.foodBooking.consumption.status = data.consumption.status;
                            setTimeout(function () {
                                $scope.foodBooking.consumption.should_pay = Number($filter('parseTenThousandToYuan')(data.consumption.should_pay, false))//應付消費
                            }, 100);

                            var tmp_hotel = data.hotel_name ? (_.where($scope.hotelLists, {
                                hotel_name: data.hotel_name
                            }))[0] : "";
                            $scope.foodBooking.hotel_id = tmp_hotel['id'];

                            setTimeout(function () {
                                var tmp_restaurant = data.restaurant ? (_.where(tmp_hotel['restaurants'], {
                                    restaurant_name: data.restaurant
                                }))[0] : '';
                                $scope.foodBooking.restaurant_id = tmp_restaurant ? tmp_restaurant.id : "";

                            }, 200);
                        })
                }
            }

            $scope.$on('consumptionFoodHotelQuery', function (event) {
                setDefaultHotelId();
            })
            var setDefaultHotelId = function () {
                if ($scope.default_hotel_id) {
                    foodBookingInit.hotel_id = $scope.default_hotel_id;
                    foodBookingOrignal.hotel_id = $scope.default_hotel_id;
                    $scope.foodBooking.hotel_id = $scope.default_hotel_id;
                }
            };
            setDefaultHotelId();

            /*storm.xu   监听收益 start*/
            $scope.$watch("foodBooking.consumption.sell_total+foodBooking.consumption.cost_total", function () {
                if (!$scope.foodBooking.consumption.sell_total) {
                    $scope.foodBooking.consumption.profit = -$scope.foodBooking.consumption.cost_total;
                } else {
                    $scope.foodBooking.consumption.profit = (+$scope.foodBooking.consumption.sell_total) - (+$scope.foodBooking.consumption.cost_total);
                }
                //應付消費=實收
                $scope.foodBooking.consumption.should_pay = $scope.foodBooking.consumption.sell_total;
            })
            /*storm.xu  监听收益 end*/
            $scope.$on('consumptionShiftDataChange', function (event) {
                foodBookingInit.consumption.shift_date = $scope.$parent.global_params.shift_date;
                foodBookingInit.consumption.year_month = $scope.$parent.global_params.year_month;
                foodBookingInit.consumption.shift = $scope.$parent.global_params.shift;
                foodBookingOrignal.consumption.shift_date = $scope.$parent.global_params.shift_date;
                foodBookingOrignal.consumption.year_month = $scope.$parent.global_params.year_month;
                foodBookingOrignal.consumption.shift = $scope.$parent.global_params.shift;
                $scope.foodBooking.consumption.shift_date = $scope.$parent.global_params.shift_date;
                $scope.foodBooking.consumption.year_month = $scope.$parent.global_params.year_month
                $scope.foodBooking.consumption.shift = $scope.$parent.global_params.shift;
            });

            $scope.food_agent_list = [];
            $scope.food_tel_list = [];
            $scope.$watch('foodBooking.consumption.trader', globalFunction.debounce(function (new_value) {
                if (new_value && $scope.foodBooking.agent_info_id) {
                    var list = _.findWhere($scope.food_agent_list, {
                        agent_guest_name: new_value
                    });
                    if (list) {
                        $scope.food_tel_list = list.guestTels;
                    } else {
                        agentGuest.query(globalFunction.generateUrlParams({
                            agent_guest_name: new_value + '!',
                            agent_info_id: $scope.foodBooking.agent_info_id
                        }, {
                            guestTels: {},
                            idCards: {},
                            guestImages: {}
                        })).$promise.then(function (data) {
                                $scope.food_agent_list = data;
                            })
                    }
                } else {
                    $scope.food_agent_list = [];
                    $scope.food_tel_list = [];
                }
            }));

            $scope.$watch('foodBooking.hotel_id', function (new_value, old_value) {
                if (new_value) {
                    var hotel_obj = (_.where($scope.hotelLists, {
                        id: new_value
                    }))[0];
                    if (!!hotel_obj.restaurants.length) {
                        $scope.restaurants = hotel_obj.restaurants;
                    } else {
                        $scope.foodBooking.restaurant_id = "";
                        $scope.restaurants = [];
                    }
                } else {
                    $scope.restaurants = [];
                    $scope.foodBooking.restaurant_id = "";
                }
            });

            // 监听食飞 户口编号
            $scope.$watch('agent_about.agent_code', globalFunction.debounce(function (new_value, old_value) {
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({
                        agent_code: new_value
                    }, {
                        parentSupervisor: {}
                    })).$promise.then(function (agent) {
                            if (agent.length > 0) {
                                $scope.agent_about.agent_name = agent[0].agent_name;
                                //$scope.foodBooking.consumption.agent_info_id = agent[0].id;
                                $scope.foodBooking.agent_info_id = agent[0].id;
                                //$scope.order.agent_info_id = $scope.agent.id;
                            } else {
                                $scope.foodBooking.agent_info_id = "";
                                //$scope.foodBooking.consumption.agent_info_id = "";
                                $scope.agent_about.agent_name = "";
                            }
                        });
                } else {
                    $scope.foodBooking.agent_info_id = "";
                    //$scope.foodBooking.consumption.agent_info_id = "";
                    $scope.agent_about.agent_name = "";
                }
            }));
            //生成备注 食飞
            $scope.creatremark = function () {
                var areaCodes = "",
                    hotel_name = "",
                    restaurant = "";

                if ($scope.foodBooking.consumption.area_code_id) {
                    areaCodes = $filter("filter")($scope.areaCodes, {
                            "id": $scope.foodBooking.consumption.area_code_id
                        })[0].area_code + "-"
                }
                if ($scope.foodBooking.hotel_id) {
                    hotel_name = $filter("filter")($scope.hotelLists, {
                        "id": $scope.foodBooking.hotel_id
                    })[0].hotel_name;
                }
                if ($scope.foodBooking.restaurant_id) {
                    restaurant = $filter("filter")($scope.restaurants, {
                        "id": $scope.foodBooking.restaurant_id
                    })[0].restaurant_name;
                }
                $scope.foodBooking.consumption.remark =
                    "酒店: " + hotel_name +
                    ", 餐廳: " + restaurant + "\n" +
                    "簽單人：" + ($scope.foodBooking.consumption.trader ? $scope.foodBooking.consumption.trader : "") + "，電話：" + areaCodes + ($scope.foodBooking.consumption.trader_tel ? $scope.foodBooking.consumption.trader_tel : "")
            }
            $scope.add = function (hasSms) {
                var tmp_booking = angular.copy($scope.foodBooking);

                if (tmp_booking.consumption.trader_tel != null && tmp_booking.consumption.trader_tel != "") {
                    if (tmp_booking.consumption.area_code_id == "" || tmp_booking.consumption.area_code_id == null) {
                        topAlert.warning("如填寫簽單人電話則電話區域不能為空");
                        return;
                    }
                }


                tmp_booking.consumption.cost_total = $filter('parseYuanToTenThousand')(tmp_booking.consumption.cost_total, 6, true);
                tmp_booking.consumption.sell_total = $filter('parseYuanToTenThousand')(tmp_booking.consumption.sell_total, 6, true);
                tmp_booking.consumption.should_pay = $filter('parseYuanToTenThousand')(tmp_booking.consumption.should_pay, 6, true);
                tmp_booking.consumption.cost_total = $filter('parseYuan')(tmp_booking.consumption.cost_total, 2, true);
                tmp_booking.consumption.sell_total = $filter('parseYuan')(tmp_booking.consumption.sell_total, 2, true);
                tmp_booking.consumption.should_pay = $filter('parseYuan')(tmp_booking.consumption.should_pay, 2, true);
                tmp_booking.consumption.shift_date = $filter('date')(tmp_booking.consumption.shift_date, 'yyyy-MM-dd');
                tmp_booking.consumption.year_month = $filter('date')(tmp_booking.consumption.year_month, 'yyyy-MM');
                tmp_booking.pin_code = $scope.global_params.pin_code ? $scope.global_params.pin_code : tmp_booking.pin_code;

                var res = _.where($scope.restaurants, {
                    id: $scope.foodBooking.restaurant_id
                });


                var area_code = _.findWhere($scope.areaCodes, {
                    id: tmp_booking.consumption.area_code_id
                });

                //tmp_booking.consumption.shift_date
                var sms = {
                    send_time: "food",
                    agent_code: $scope.agent_about.agent_code,
                    restaurant: res[0] ? res[0].restaurant_name : "",
                    shift_date: "",
                    time: "",
                    count: "",
                    name: tmp_booking.consumption.trader,
                    tel: area_code ? area_code.area_code + " " + tmp_booking.consumption.trader_tel : tmp_booking.consumption.trader_tel
                };

                var sub_method = consumptionFoodcoupon.save;
                var tis = "添加成功";
                if ('POST' == $scope.sub_post_put) {
                    //ConsumptionSmsTemp.init(angular.copy(sms));
                    delete tmp_booking.id;
                    delete tmp_booking.consumption.status;
                    delete tmp_booking.consumption.id;
                } else if ('PUT' == $scope.sub_post_put) {
                    sub_method = consumptionFoodcoupon.update;
                    tis = "修改成功";
                }
                if ($scope.COPY_BOOKING_food) {
                    sub_method = consumptionFoodcoupon.save;
                    tis = "複製成功";
                }
                if ($scope.isDisabled) {
                    return;
                }
                $scope.isDisabled = true;

                $scope.form_food.checkValidity().then(function () {
                    sub_method(tmp_booking, function () {
                        topAlert.success(tis);
                        if ($scope.popupWindow) {
                            $modalInstance.close(" ");
                        }

                        var id = angular.copy($scope.foodBooking.agent_info_id);

                        $scope.isDisabled = false;
                        $scope.cancel();

                        if (!$scope.foodBooking.id && hasSms) {
                            var sms = {
                                send_time: "food",
                                agent_code: $scope.agent_about.agent_code,
                                notify: {
                                    trader: tmp_booking.consumption.trader,
                                    area_code_id: tmp_booking.consumption.area_code_id,
                                    trader_tel: tmp_booking.consumption.trader_tel
                                }
                            };
                            ConsumptionSmsTemp.init(angular.copy(sms));
                            $location.path("share/share-send-sms/" + id);

                        } else {
                            $scope.food_search();
                        }
                    }, function () {
                        $scope.isDisabled = false;
                    });
                });
            }

            $scope.cancel = function () {
                $scope.form_food.clearErrors();
                $scope.agent_about = angular.copy(agent_about_init);
                if ('PUT' != $scope.sub_post_put) {
                    $scope.foodBooking = angular.copy(foodBookingInit);
                } else {
                    if (!$scope.popupWindow) {
                        $location.path('/consumption-manager/consumption-manager/food');
                    } else {
                        $modalInstance.dismiss();
                    }

                }

            }


        }
    ]).controller('consumptionFoodFlyBookingDetailCtrls', ['$scope', '$location', '$stateParams', 'globalFunction', 'consumptionFoodcoupon', '$window',
        function ($scope, $location, $stateParams, globalFunction, consumptionFoodcoupon, $window) {
            $scope.foodBooking = {};

            var param_id = $stateParams.id;

            if (!angular.isUndefined(param_id)) {
                consumptionFoodcoupon.query(globalFunction.generateUrlParams({
                    consumption_id: param_id
                }, {
                    consumption: {}
                })).$promise.then(function (data) {
                        var data = data[0];
                        if (!data) {
                            return;
                        }
                        $scope.foodBooking = data;
                        var pay_type_obj = (_.where($scope.pay_types, {
                            id: data.consumption.pay_type_id
                        }))[0];
                        $scope.pay_type_name = pay_type_obj ? pay_type_obj.pay_type_name : "";
                    })
            }

            $scope.update = function () {
                $location.path('/consumption-manager/consumption-manager/food/consumption-food-fly-booking-update/' + param_id);
            }

            $scope.cancel = function () {
                //$location.path('/consumption-manager/consumption-manager/food');
                $window.history.back();
            }

        }
    ]).controller('consumptionHelicopterBookingUpdateCtrls', ['$scope', '$location', '$stateParams', 'consumptionHelicopter', 'globalFunction', 'helicopterTrip', 'helicopterCity', 'agentsLists', '$filter', 'topAlert', 'agentGuest', 'shiftMark', 'pinCodeUserName', 'isSendSmsModal', 'shiftMarks', 'idcardType', 'areaCode', 'consumptionPaytype', '$modalInstance', 'ConsumptionSmsTemp',
        function ($scope, $location, $stateParams, consumptionHelicopter, globalFunction, helicopterTrip, helicopterCity, agentsLists, $filter, topAlert, agentGuest, shiftMark, pinCodeUserName, isSendSmsModal, shiftMarks, idcardType, areaCode, consumptionPaytype, $modalInstance, ConsumptionSmsTemp) {

            $scope.popupWindow = false
            if (!$scope.global_params) {
                $scope.popupWindow = true
                $scope.global_params = {};
                $scope.shiftLists = shiftMarks
                $scope.idCardtypes = idcardType.query();
                $scope.areaCodes = areaCode.query();
                $scope.pay_types = [];
                $scope.helicopterTrips = helicopterTrip.getHelicopterTrip();
                consumptionPaytype.query().$promise.then(function (data) // 支付方式
                {
                    _.each(data, function ($that, $key) {
                        if ('COMMISSION' == $that.pay_type_code || 'COMSUMPTION' == $that.pay_type_code) {
                            $scope.pay_types.push($that);
                        }
                    })
                });
            }
            $scope.COPY_BOOKING_helicopter = -1 != ($location.$$url).indexOf('helicopter-booking-copy');
            $scope.sub_post_put = 'POST';
            $scope.helicopter_url = globalFunction.getApiUrl('consumption/consumptionhelicopter');
            $scope.isDisabled = false;
            $scope.trip_times = [];
            //$scope.trips = helicopterTrip.query();

            var agent_about_init = {
                agent_code: "",
                agent_name: "",
                hall_name: "",
                trip_index: "",
                username: ""
            }
            $scope.helicopter_total = {
                cost: 0,
                sell: 0,
                profit: 0
            }
            $scope.agent_about = angular.copy(agent_about_init);
            var helicopterBookingInit = {
                agent_info_id: "",
                setout_date: "",
                helicopter_trip_id: "",
                count: "1",
                cost: "",
                sell: "",

                consumption: {
                    //agent_info_id: "",
                    book_no: "",
                    pay_type_id: $scope.default_pay_type_id,
                    trader: "",
                    trader_tel: "",
                    remark: "",
                    should_pay: "",
                    shift_date: $scope.global_params.shift_date,
                    year_month: $scope.global_params.year_month,
                    shift: $scope.global_params.shift,
                    area_code_id: null
                },
                consumptionHelicopterSubs: [{
                    idcard_type_id: "",
                    passenger: "",
                    idcard_no: "",
                    telephone_number: "",
                    area_code_id: null
                }],

                pin_code: ''
            };
            var HelicopterSub = {
                idcard_type_id: "",
                passenger: "",
                idcard_no: "",
                telephone_number: "",
                area_code_id: null
            }
            var helicopterBookingOrignal = angular.copy(helicopterBookingInit);
            $scope.helicopterBooking = angular.copy(helicopterBookingOrignal);

            var param_id = $stateParams.id;

            if (!angular.isUndefined(param_id)) {
                consumptionHelicopter.query(globalFunction.generateUrlParams({
                    consumption_id: param_id
                }, {
                    consumption: {},
                    consumptionHelicopterSubs: {}
                })).$promise.then(function (data) {
                        //$scope.helicopterBooking = data;
                        var data = data[0];
                        if (!data) {
                            return;
                        }
                        $scope.sub_post_put = 'PUT';
                        helicopterBookingOrignal = _.extend_exist(helicopterBookingOrignal, data);

                        helicopterBookingOrignal.id = data.id;
                        helicopterBookingOrignal.consumption.id = data.consumption.id;
                        helicopterBookingOrignal.consumption.status = data.consumption.status;
                        helicopterBookingOrignal.setout_date = $filter('parseDate')(data.setout_date, 'yyyy-MM-dd');

                        helicopterBookingOrignal.cost = $filter('parseTenThousandToYuan')(data.cost, false);
                        helicopterBookingOrignal.sell = $filter('parseTenThousandToYuan')(data.sell, false);
                        helicopterBookingOrignal.consumption.shift_date = $filter('parseDate')(data.consumption.shift_date, 'yyyy-MM-dd');

                        helicopterBookingOrignal.consumption.year_month = $filter('parseDate')(data.consumption.year_month, 'yyyy-MM');

                        var trip_id = data.helicopter_trip_id;

                        helicopterTrip.query({
                            id: trip_id
                        }).$promise.then(function (data) {
                                $scope.trip_times = data;

                                _.each($scope.helicopterTrips, function ($that, key) {

                                    if (data[0].from_place_id == $that.from_place_id && data[0].to_place_id == $that.to_place_id) {
                                        $scope.agent_about.trip_index = key;
                                    }
                                });
                            });

                        $scope.agent_about.book_time = data.book_time;
                        $scope.agent_about.agent_code = data.agent_code;
                        $scope.agent_about.hall_name = data.hall_name;

                        $scope.helicopterBooking = angular.copy(helicopterBookingOrignal);
                        setTimeout(function () {
                            $scope.helicopterBooking.consumption.should_pay = $filter('parseTenThousandToYuan')(data.consumption.should_pay, false)
                        }, 100);
                    })
            }

            $scope.$on('consumptionShiftDataChange', function (event) {
                helicopterBookingInit.consumption.shift_date = $scope.$parent.global_params.shift_date;
                helicopterBookingInit.consumption.year_month = $scope.$parent.global_params.year_month;
                helicopterBookingInit.consumption.shift = $scope.$parent.global_params.shift;
                helicopterBookingOrignal.consumption.shift_date = $scope.$parent.global_params.shift_date;
                helicopterBookingOrignal.consumption.year_month = $scope.$parent.global_params.year_month;
                helicopterBookingOrignal.consumption.shift = $scope.$parent.global_params.shift;
                $scope.helicopterBooking.consumption.shift_date = $scope.$parent.global_params.shift_date;
                $scope.helicopterBooking.consumption.year_month = $scope.$parent.global_params.year_month
                $scope.helicopterBooking.consumption.shift = $scope.$parent.global_params.shift;
            });

            $scope.$watch('agent_about.trip_index', function (new_value) {
                if ("" === new_value) {
                    return false;
                }
                var trip_obj = $scope.helicopterTrips[new_value];
                $scope.trip_times = helicopterTrip.query({
                    from_place_id: trip_obj.from_place_id,
                    to_place_id: trip_obj.to_place_id
                });
            })

            // 户口编号
            $scope.$watch('agent_about.agent_code', globalFunction.debounce(function (new_value, old_value) {
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({
                        agent_code: new_value
                    }, {})).$promise.then(function (agent) {
                            if (agent.length > 0) {
                                $scope.agent_about.agent_name = agent[0].agent_name;
                                //$scope.helicopterBooking.consumption.agent_info_id = agent[0].id;
                                $scope.helicopterBooking.agent_info_id = agent[0].id;
                            } else {
                                $scope.helicopterBooking.agent_info_id = "";
                                //$scope.helicopterBooking.consumption.agent_info_id = "";
                                $scope.agent_about.agent_name = "";
                            }
                        });
                } else {
                    $scope.helicopterBooking.agent_info_id = "";
                    //$scope.helicopterBooking.consumption.agent_info_id = "";
                    $scope.agent_about.agent_name = "";
                }
            }));

            $scope.helicopter_agent_list = [];
            $scope.helicopter_tel_list = [];
            $scope.helicopter_idcard_list = [];

            function auto_complete($index, new_value) {
                if (new_value && $scope.helicopterBooking.agent_info_id) {
                    var list = _.findWhere($scope.helicopter_agent_list, {
                        agent_guest_name: new_value
                    });
                    if (list) {
                        $scope.helicopter_tel_list = list.guestTels;
                        $scope.helicopter_idcard_list = list.idCards;
                        if (undefined !== $index && list.idCards.length) {
                            $scope.helicopterBooking.consumptionHelicopterSubs[$index].idcard_type_id = list.idCards[0].idcard_type_id;
                            $scope.helicopterBooking.consumptionHelicopterSubs[$index].idcard_no = list.idCards[0].idcard_number;
                        }
                    } else {
                        agentGuest.query(globalFunction.generateUrlParams({
                            agent_guest_name: new_value + '!',
                            agent_info_id: $scope.helicopterBooking.agent_info_id
                        }, {
                            guestTels: {},
                            idCards: {},
                            guestImages: {}
                        })).$promise.then(function (data) {
                                $scope.helicopter_agent_list = data;
                            })
                    }
                } else {
                    $scope.helicopter_agent_list = [];
                    $scope.helicopter_tel_list = [];
                    $scope.helicopter_idcard_list = [];
                }

                if (0 === $index) {
                    $scope.helicopterBooking.consumption.trader = $scope.helicopterBooking.consumptionHelicopterSubs[0].passenger;
                }

            }

            $scope.$watch('helicopterBooking.consumption.trader', globalFunction.debounce(function (new_value) {
                auto_complete(undefined, new_value);
            }));

            $scope.ChangeRegister = function ($index, consumptionHelicopterSub) {
                auto_complete($index, consumptionHelicopterSub.passenger);
            }

            $scope.$watch('helicopterBooking.count', function (new_value, old_value) {
                if (new_value > old_value) {
                    var add_length = new_value - old_value;
                    var count = parseInt($scope.helicopterBooking.count);

                    if ($scope.helicopterBooking.consumptionHelicopterSubs.length < count) {
                        for (var i = 0; i < add_length; i++) {
                            var copy_helicopter = angular.copy(HelicopterSub);
                            $scope.helicopterBooking.consumptionHelicopterSubs.push(copy_helicopter);
                        }
                    }
                } else if (old_value > new_value) {
                    var delete_length = old_value - new_value;
                    $scope.helicopterBooking.consumptionHelicopterSubs.splice($scope.helicopterBooking.consumptionHelicopterSubs.length - delete_length, delete_length);
                }
                cal_totel();
            });

            $scope.$watch('helicopterBooking.cost+helicopterBooking.sell', function (new_value, old_value) {
                cal_totel();
            });


            function cal_totel() {
                $scope.helicopter_total.cost = $scope.helicopterBooking.cost * $scope.helicopterBooking.count;
                $scope.helicopter_total.sell = $scope.helicopterBooking.sell * $scope.helicopterBooking.count;
                $scope.helicopter_total.profit = $scope.helicopter_total.sell - $scope.helicopter_total.cost;

                if (!$scope.COPY_BOOKING_helicopter) {
                    if ($scope.helicopterBooking.sell != '' && $scope.helicopterBooking.count != '') {
                        $scope.helicopterBooking.consumption.should_pay = parseFloat(parseFloat($scope.helicopter_total.sell).toFixed(4));
                    } else {
                        $scope.helicopterBooking.consumption.should_pay = '';
                    }
                }
            }

            //生成备注 直升机
            $scope.creatremark = function () {
                var areaCodes = ""
                if ($scope.helicopterBooking.consumption.area_code_id) {
                    areaCodes = $filter("filter")($scope.areaCodes, {
                            "id": $scope.helicopterBooking.consumption.area_code_id
                        })[0].area_code + "-"
                }
                var text = "";
                var trip_display = "";
                var trip = "";
                if (parseInt($scope.agent_about.trip_index) == 0 || parseInt($scope.agent_about.trip_index)) {
                    trip = $scope.helicopterTrips[$scope.agent_about.trip_index];
                    trip_display = trip ? trip.from_place + "-" + trip.to_place : "";
                } else {
                    trip = "";
                }
                var trip_time = "";
                if ($scope.helicopterBooking.helicopter_trip_id) {
                    trip_time = $filter("filter")($scope.trip_times, {
                        id: $scope.helicopterBooking.helicopter_trip_id
                    })[0].setout_time;
                }
                var setout_date = "";
                if ($scope.helicopterBooking.setout_date) {
                    setout_date = $filter('date')($scope.helicopterBooking.setout_date, 'yyyy-MM-dd');
                }
                text += "行程：" + trip_display + "，時間：" + trip_time + "，出發日期：" + setout_date + "，";
                for (var i = 0; i < $scope.helicopterBooking.consumptionHelicopterSubs.length; i++) {

                    text +=
                        "乘客姓名：" + $scope.helicopterBooking.consumptionHelicopterSubs[i].passenger + "，證件類型：" + $filter("filter")($scope.idCardtypes, {
                            "id": $scope.helicopterBooking.consumptionHelicopterSubs[i].idcard_type_id
                        })[0].idcard_type_name + "，證件號碼：" + $scope.helicopterBooking.consumptionHelicopterSubs[i].idcard_no
                }

                $scope.helicopterBooking.consumption.remark = text + "，訂票人：" + $scope.helicopterBooking.consumption.trader + "，聯絡電話：" + areaCodes + $scope.helicopterBooking.consumption.trader_tel
            }

            $scope.add = function (hasSms) {

                var tmp_booking = angular.copy($scope.helicopterBooking);

                if (!tmp_booking.consumption.trader_tel) {
                    topAlert.warning("訂票人電話不能為空");
                    return;
                }

                if (tmp_booking.consumption.trader_tel != null && tmp_booking.consumption.trader_tel != "") {
                    if (tmp_booking.consumption.area_code_id == "" || tmp_booking.consumption.area_code_id == null) {
                        topAlert.warning("如填寫訂票人電話則電話區號不能為空");
                        return;
                    }
                }

                tmp_booking.cost = $filter('parseYuanToTenThousand')(tmp_booking.cost, 6, true);
                tmp_booking.sell = $filter('parseYuanToTenThousand')(tmp_booking.sell, 6, true);
                tmp_booking.consumption.should_pay = $filter('parseYuanToTenThousand')(tmp_booking.consumption.should_pay, 6, true);
                tmp_booking.cost = $filter('parseYuan')(tmp_booking.cost, 2, true);
                tmp_booking.sell = $filter('parseYuan')(tmp_booking.sell, 2, true);
                tmp_booking.consumption.should_pay = $filter('parseYuan')(tmp_booking.consumption.should_pay, 2, true);
                tmp_booking.setout_date = $filter('date')(tmp_booking.setout_date, 'yyyy-MM-dd');
                tmp_booking.consumption.shift_date = $filter('date')(tmp_booking.consumption.shift_date, 'yyyy-MM-dd');
                tmp_booking.consumption.year_month = $filter('date')(tmp_booking.consumption.year_month, 'yyyy-MM');
                tmp_booking.pin_code = $scope.global_params.pin_code ? $scope.global_params.pin_code : tmp_booking.pin_code;

                _.each(tmp_booking.consumptionHelicopterSubs, function ($that, $key) {
                    if (!$that.telephone_number && !$that.area_code_id) {
                        delete tmp_booking.consumptionHelicopterSubs[$key].telephone_number
                        delete tmp_booking.consumptionHelicopterSubs[$key].area_code_id
                    }
                });

                var peoples = [];

                _.each($scope.helicopterBooking.consumptionHelicopterSubs, function (ele) {
                    if (ele.passenger != "") {
                        peoples.push({
                            passenger: ele.passenger,
                            idcard_no: ele.idcard_no
                        });
                    }
                });

                var helicopterTrip = $scope.helicopterTrips[$scope.agent_about.trip_index];
                var trip_time = _.where($scope.trip_times, {
                    id: $scope.helicopterBooking.helicopter_trip_id
                });
                var sms = {
                    send_time: "helicopter",
                    agent_name: $scope.agent_about.agent_name,
                    agent_code: $scope.agent_about.agent_code,
                    trip: helicopterTrip ? helicopterTrip.from_place + "-" + helicopterTrip.to_place : "",
                    setout_date: tmp_booking.setout_date,
                    trip_time: trip_time[0] ? trip_time[0].setout_time : "",
                    peoples: peoples,
                    notify: {
                        trader: tmp_booking.consumption.trader,
                        area_code_id: tmp_booking.consumption.area_code_id,
                        trader_tel: tmp_booking.consumption.trader_tel
                    }
                };

                var sub_method = consumptionHelicopter.save;
                //ConsumptionSmsTemp.init(angular.copy(sms));
                var tis = "添加成功";
                if ('PUT' == $scope.sub_post_put) {
                    sub_method = consumptionHelicopter.update;
                    tis = "修改成功";
                    ConsumptionSmsTemp.destroy();
                }
                if ($scope.COPY_BOOKING_helicopter) {
                    sub_method = consumptionHelicopter.save;
                    tis = "複製成功";
                    ConsumptionSmsTemp.destroy();
                }
                if ($scope.isDisabled) {
                    return;
                }
                $scope.isDisabled = true;

                $scope.form_helicopter.checkValidity().then(function () {
                    sub_method(tmp_booking, function () {
                        topAlert.success(tis);
                        if ($scope.popupWindow) {
                            $modalInstance.close(" ");
                        }

                        var id = angular.copy($scope.helicopterBooking.agent_info_id);

                        $scope.isDisabled = false;
                        $scope.form_helicopter.clearErrors();
                        $scope.cancel();

                        //是否發送短信
                        if (!$scope.helicopterBooking.id && hasSms) {
                            ConsumptionSmsTemp.init(angular.copy(sms));
                            $location.path("share/share-send-sms/" + id);
                        } else {
                            $scope.helicopter_search();
                        }
                    }, function () {
                        $scope.isDisabled = false;
                    });
                });
            }

            $scope.cancel = function () {
                $scope.sub_post_put = 'POST';
                $scope.helicopter_total = {
                    cost: 0,
                    sell: 0,
                    profit: 0
                }
                $scope.agent_about = angular.copy(agent_about_init);
                $scope.helicopterBooking = angular.copy(helicopterBookingOrignal);
                if (!$scope.popupWindow) {
                    $location.path('/consumption-manager/consumption-manager/helicopter');
                } else {
                    $modalInstance.dismiss();
                }


            }

        }
    ]).controller('consumptionHelicopterBookingDetailCtrls', ['$scope', '$location', '$stateParams', 'consumptionHelicopter', 'globalFunction', '$filter', '$window',
        function ($scope, $location, $stateParams, consumptionHelicopter, globalFunction, $filter, $window) {

            $scope.helicopterBooking = {};

            var param_id = $stateParams.id;

            if (!angular.isUndefined(param_id)) {
                consumptionHelicopter.query(globalFunction.generateUrlParams({
                    consumption_id: param_id
                }, {
                    consumption: {},
                    consumptionHelicopterSubs: {}
                })).$promise.then(function (data) {
                        var data = data[0];
                        if (!data) {
                            return;
                        }
                        $scope.helicopterBooking = data;
                        var pay_obj = _.findWhere($scope.pay_types, {
                            id: data.consumption.pay_type_id
                        });
                        $scope.helicopterBooking.pay_type = pay_obj.pay_type_name;

                        for (var i = 0, j = data.consumptionHelicopterSubs.length; i < j; i++) {
                            var id_card_obj = _.findWhere($scope.idCardtypes, {
                                id: data.consumptionHelicopterSubs[i].idcard_type_id
                            });
                            data.consumptionHelicopterSubs[i].id_card = id_card_obj.idcard_type_name;
                        }
                        $scope.helicopterBooking.consumptionHelicopterSubs = data.consumptionHelicopterSubs;
                        $scope.helicopterBooking.setout_date = $filter('parseDate')($scope.helicopterBooking.setout_date, 'yyyy-MM-dd');
                    })
            }


            $scope.detail_update = function () {
                $location.path('/consumption-manager/consumption-manager/helicopter/consumption-helicopter-booking-update/' + param_id);
            }

            $scope.detail_cancel = function () {
                //                $location.path('/consumption-manager/consumption-manager/helicopter');
                $window.history.back();
            }


        }
    ]).controller('consumptionShipTicketBookingUpdateCtrls', ['$scope', '$stateParams', '$location', 'agentsLists', 'globalFunction', 'consumptionBoat', '$filter', 'topAlert', 'boatTrip', 'boatCity', 'agentGuest', 'shiftMark', 'pinCodeUserName', 'isSendSmsModal', 'shiftMarks', 'idcardType', 'areaCode', 'consumptionPaytype', '$modalInstance', 'ConsumptionSmsTemp',
        function ($scope, $stateParams, $location, agentsLists, globalFunction, consumptionBoat, $filter, topAlert, boatTrip, boatCity, agentGuest, shiftMark, pinCodeUserName, isSendSmsModal, shiftMarks, idcardType, areaCode, consumptionPaytype, $modalInstance, ConsumptionSmsTemp) {

            $scope.popupWindow = false
            if (!$scope.global_params) {
                $scope.popupWindow = true
                $scope.global_params = {};
                $scope.shiftLists = shiftMarks
                $scope.idCardtypes = idcardType.query();
                $scope.areaCodes = areaCode.query();
                $scope.pay_types = [];
                $scope.boatCitys = boatTrip.getBoattrip();
                consumptionPaytype.query().$promise.then(function (data) // 支付方式
                {
                    _.each(data, function ($that, $key) {
                        if ('COMMISSION' == $that.pay_type_code || 'COMSUMPTION' == $that.pay_type_code) {
                            $scope.pay_types.push($that);
                        }
                    })
                });
            }
            $scope.COPY_BOOKING_ship = -1 != ($location.$$url).indexOf('ship-ticket-booking-copy');
            $scope.sub_post_put = 'POST';
            $scope.ship_url = globalFunction.getApiUrl('consumption/consumptionboat');
            $scope.isDisabled = false;
            var agent_about_init = {
                agent_code: "",
                agent_name: "",
                hall_name: "",
                book_time: "",
                username: ""
            }
            $scope.ship_total = {
                cost: 0,
                sell: 0,
                profit: 0
            }
            $scope.agent_about = angular.copy(agent_about_init);
            var shipBookingInit = {
                agent_info_id: "",

                consumption: {
                    //agent_info_id: "",
                    book_no: "",
                    pay_type_id: $scope.default_pay_type_id,
                    trader: "",
                    trader_tel: "",
                    remark: "",
                    should_pay: "",
                    shift_date: $scope.global_params.shift_date,
                    year_month: $scope.global_params.year_month,
                    shift: $scope.global_params.shift,
                    area_code_id: null
                },
                consumptionBoatSubs: [{
                    "count": "1",
                    "boat_trip_id": "",
                    "index": "",
                    "cost": "",
                    "sell": "",
                    "cost_total": "",
                    "sell_total": "",
                    "departure_date": "",
                    "departure_time": ""

                }],
                pin_code: ''
            };
            $scope.boatSubs = {
                "count": "1",
                "boat_trip_id": "",
                "index": "",
                "cost": "",
                "sell": "",
                "cost_total": "",
                "sell_total": ""
            };
            var shipBookingOrignal = angular.copy(shipBookingInit);
            $scope.shipBooking = angular.copy(shipBookingOrignal);


            var param_id = $stateParams.id;

            var select_sms_type_init = {
                value: ""
            };

            $scope.sms_type = angular.copy(select_sms_type_init);

            $scope.show_sms_place = true;

            if (!angular.isUndefined(param_id)) {
                $scope.$index = 0;
                $scope.show_sms_place = false;
                boatTrip.query().$promise.then(function (boatTripList) {

                    consumptionBoat.query(globalFunction.generateUrlParams({
                        consumption_id: param_id
                    }, {
                        consumption: {},
                        consumptionBoatSubs: {}
                    })).$promise.then(function (data) {

                            var data = data[0];
                            if (!data) {
                                return;
                            }
                            $scope.sub_post_put = 'PUT';
                            shipBookingOrignal = _.extend_exist(shipBookingOrignal, data);

                            shipBookingOrignal.id = data.id;
                            shipBookingOrignal.consumption.id = data.consumption.id;
                            shipBookingOrignal.consumption.status = data.consumption.status;
                            shipBookingOrignal.consumption.shift_date = $filter('parseDate')(data.consumption.shift_date, 'yyyy-MM-dd');

                            shipBookingOrignal.consumption.year_month = $filter('parseDate')(data.consumption.year_month, 'yyyy-MM');
                            $scope.agent_about.book_time = data.book_time;
                            $scope.agent_about.agent_code = data.agent_code;
                            $scope.agent_about.hall_name = data.hall_name;

                            var boatSubs = data.consumptionBoatSubs;

                            //var trip_obj = _.findWhere(boatTripList, {id : data.});

                            var new_consumptionBoatSubs = [];
                            _.each(boatSubs, function ($this, key) {
                                var trip = $this.trip.split('-');
                                var from_place_city = trip[0];
                                var to_place_city = trip[1];
                                var boat_seat_type = $this.seat_type;
                                var arr = [];
                                _.each(boatTripList, function ($trip, $key) {
                                    if (from_place_city == $trip.from_place_city && to_place_city == $trip.to_place_city) {
                                        if ($this.boat_trip_id == $trip.id) {
                                            _.each($scope.boatCitys, function (data, index_num) {
                                                if (data.from_place == from_place_city && data.to_place == to_place_city) {
                                                    new_consumptionBoatSubs.push({
                                                        "id": $this.id,
                                                        "count": $this.count,
                                                        "from_place": from_place_city,
                                                        "to_place": to_place_city,
                                                        "index": index_num,
                                                        "boat_trip_id": $trip.id,
                                                        "cost": $filter('parseTenThousandToYuan')($trip.cost_price),
                                                        "sell": $filter('parseTenThousandToYuan')($trip.sell_price),
                                                        "cost_total": $filter('parseTenThousandToYuan')($this.cost_total),
                                                        "sell_total": $filter('parseTenThousandToYuan')($this.sell_total),
                                                        "departure_date": $filter('parseDate')($this.departure_date, 'yyyy-MM-dd'),
                                                        "departure_time": $filter('parseDate')($this.departure_time, 'HH:mm')
                                                    });
                                                }
                                            });
                                        }
                                        arr.push(angular.copy($trip));
                                        //return false;
                                    }
                                })
                                $scope.trip_seat.push(arr);
                            });
                            shipBookingOrignal.consumptionBoatSubs = new_consumptionBoatSubs;

                            $scope.shipBooking = angular.copy(shipBookingOrignal);

                            setTimeout(function () {
                                $scope.shipBooking.consumption.should_pay = $filter('parseTenThousandToYuan')(data.consumption.should_pay, false);
                                cal_totel();
                            }, 100);
                        })
                })

            }

            $scope.$on('consumptionShiftDataChange', function (event) {
                shipBookingInit.consumption.shift_date = $scope.$parent.global_params.shift_date;
                shipBookingInit.consumption.year_month = $scope.$parent.global_params.year_month;
                shipBookingInit.consumption.shift = $scope.$parent.global_params.shift;
                shipBookingOrignal.consumption.shift_date = $scope.$parent.global_params.shift_date;
                shipBookingOrignal.consumption.year_month = $scope.$parent.global_params.year_month;
                shipBookingOrignal.consumption.shift = $scope.$parent.global_params.shift;
                $scope.shipBooking.consumption.shift_date = $scope.$parent.global_params.shift_date;
                $scope.shipBooking.consumption.year_month = $scope.$parent.global_params.year_month
                $scope.shipBooking.consumption.shift = $scope.$parent.global_params.shift;
            });

            // 户口编号
            $scope.$watch('agent_about.agent_code', globalFunction.debounce(function (new_value, old_value) {
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({
                        agent_code: new_value
                    }, {})).$promise.then(function (agent) {
                            if (agent.length > 0) {
                                $scope.agent_about.agent_name = agent[0].agent_name;
                                //$scope.shipBooking.consumption.agent_info_id = agent[0].id;
                                $scope.shipBooking.agent_info_id = agent[0].id;
                            } else {
                                $scope.shipBooking.agent_info_id = "";
                                //$scope.shipBooking.consumption.agent_info_id = "";
                                $scope.agent_about.agent_name = "";
                            }
                        });
                } else {
                    $scope.shipBooking.agent_info_id = "";
                    //$scope.shipBooking.consumption.agent_info_id = "";
                    $scope.agent_about.agent_name = "";
                }
            }));

            $scope.trip_seat = [];

            $scope.changeTrip = function ($index, that) {
                var trip_obj = $scope.boatCitys[that.index];
                if (trip_obj) {
                    $scope.shipBooking.consumptionBoatSubs[$index].cost = "";
                    $scope.shipBooking.consumptionBoatSubs[$index].sell = "";
                    $scope.shipBooking.consumptionBoatSubs[$index].cost_total = "";
                    $scope.shipBooking.consumptionBoatSubs[$index].sell_total = "";
                    $scope.shipBooking.consumptionBoatSubs[$index].count = 1;
                    that.boat_trip_id = "";
                    $scope.trip_seat[$index] = [];
                    $scope.changeCount(10, $index);
                    $scope.trip_seat[$index] = boatTrip.query({
                        from_place_id: trip_obj.from_place_id,
                        to_place_id: trip_obj.to_place_id
                    });
                } else {
                    that.boat_trip_id = "";
                    $scope.trip_seat[$index] = [];
                }

            }

            $scope.changeSeat = function ($index, that) {
                var trip = $scope.trip_seat[$index];
                var obj = _.findWhere(trip, {
                    id: that.boat_trip_id
                });

                if (obj) {
                    that.cost = $filter('parseTenThousandToYuan')(obj.cost_price, false);
                    that.sell = $filter('parseTenThousandToYuan')(obj.sell_price, false);
                    cal_totel();
                }
            }

            $scope.changeCount = function (timeout, $index) {
                if (timeout) {
                    setTimeout(function () {
                        cal_totel(timeout, $index);
                    }, timeout);
                } else {
                    cal_totel(timeout, $index);
                }
            }

            function cal_totel(timeout, $index) {
                $scope.ship_total = {
                    cost: 0,
                    sell: 0,
                    profit: 0
                }
                _.each($scope.shipBooking.consumptionBoatSubs, function (value, key) {
                    if (key === $index) {
                        if (!timeout) {

                            $scope.ship_total.cost += Number(value.cost_total);
                            $scope.ship_total.sell += Number(value.sell_total);
                        } else {
                            $scope.ship_total.cost += Number(value.cost) * value.count;
                            $scope.ship_total.sell += Number(value.sell) * value.count;
                            value.cost_total = Number(value.cost) * value.count;
                            value.sell_total = Number(value.sell) * value.count;
                        }

                    } else {
                        if (value.cost_total) {
                            $scope.ship_total.cost += Number(value.cost_total);
                            $scope.ship_total.sell += Number(value.sell_total);
                        } else {
                            $scope.ship_total.cost += Number(value.cost) * value.count;
                            $scope.ship_total.sell += Number(value.sell) * value.count;
                            value.cost_total = Number(value.cost) * value.count;
                            value.sell_total = Number(value.sell) * value.count;
                        }

                    }
                })

                $scope.ship_total.profit = $scope.ship_total.sell - $scope.ship_total.cost;
                if (!$scope.COPY_BOOKING_ship) {

                    if ($scope.shipBooking.consumptionBoatSubs[0].sell_total != '' && $scope.shipBooking.consumptionBoatSubs[0].count != '') {
                        $scope.shipBooking.consumption.should_pay = parseFloat(parseFloat($scope.ship_total.sell).toFixed(4));
                    } else {
                        $scope.shipBooking.consumption.should_pay = '';
                    }

                }
            }

            $scope.ship_agent_list = [];
            $scope.ship_tel_list = [];
            $scope.$watch('shipBooking.consumption.trader', globalFunction.debounce(function (new_value) {
                if (new_value && $scope.shipBooking.agent_info_id) {
                    var list = _.findWhere($scope.ship_agent_list, {
                        agent_guest_name: new_value
                    });
                    if (list) {
                        $scope.ship_tel_list = list.guestTels;
                    } else {
                        agentGuest.query(globalFunction.generateUrlParams({
                            agent_guest_name: new_value + '!',
                            agent_info_id: $scope.shipBooking.agent_info_id
                        }, {
                            guestTels: {},
                            idCards: {},
                            guestImages: {}
                        })).$promise.then(function (data) {
                                $scope.ship_agent_list = data;
                            })
                    }
                } else {
                    $scope.ship_agent_list = [];
                    $scope.ship_tel_list = [];
                }
            }));

            $scope.addTrip = function () {
                var subs = angular.copy($scope.boatSubs);
                $scope.shipBooking.consumptionBoatSubs.push(subs);
            }

            $scope.removeTrip = function (index) {
                $scope.shipBooking.consumptionBoatSubs.splice(index, 1);
                cal_totel();
            }
            //生成备注 船票
            $scope.creatremark = function () {
                var text = ""
                for (var i = 0; i < $scope.shipBooking.consumptionBoatSubs.length; i++) {
                    var place = $scope.boatCitys[$scope.shipBooking.consumptionBoatSubs[i].index];
                    var date = $scope.shipBooking.consumptionBoatSubs[i];
                    var seat_type = _.findWhere($scope.trip_seat[i], {
                        id: $scope.shipBooking.consumptionBoatSubs[i].boat_trip_id
                    });
                    text += "行程：";
                    if (place) {
                        text += place.from_place + "-" + place.to_place;
                    }
                    text += "，日期：";
                    if (date) {
                        text += $filter('date')(date.departure_date, 'yyyy/MM/dd');
                    }
                    text += "，時間：";
                    text += date.departure_time;
                    text += "，艙位：";
                    if (seat_type) {
                        text += seat_type.boat_seat_type;
                    }
                    text += "，數量：" + $scope.shipBooking.consumptionBoatSubs[i].count + "\n";
                    /*"行程："+$scope.boatCitys[$scope.shipBooking.consumptionBoatSubs[i].index].from_place ? $scope.boatCitys[$scope.shipBooking.consumptionBoatSubs[i].index].from_place : "" +" - "+$scope.boatCitys[$scope.shipBooking.consumptionBoatSubs[i].index].to_place ? $scope.boatCitys[$scope.shipBooking.consumptionBoatSubs[i].index].to_place : ""
                     +"，日期："+$filter('date')($scope.shipBooking.consumption.shift_date,'yyyy/MM/dd')
                     +"，艙位："+_.findWhere($scope.trip_seat[i], {id : $scope.shipBooking.consumptionBoatSubs[i].boat_trip_id}).boat_seat_type ? _.findWhere($scope.trip_seat[i], {id : $scope.shipBooking.consumptionBoatSubs[i].boat_trip_id}).boat_seat_type : ""
                     +"，數量："+$scope.shipBooking.consumptionBoatSubs[i].count+"\n"*/
                }
                var areaCodes = ""
                if ($scope.shipBooking.consumption.area_code_id) {
                    areaCodes = $filter("filter")($scope.areaCodes, {
                            "id": $scope.shipBooking.consumption.area_code_id
                        })[0].area_code + "-"
                }
                $scope.shipBooking.consumption.remark = text + "訂票人：" + ($scope.shipBooking.consumption.trader ? $scope.shipBooking.consumption.trader : "") + "，電話：" + areaCodes + ($scope.shipBooking.consumption.trader_tel ? $scope.shipBooking.consumption.trader_tel : "")
            }
            $scope.add = function (hasSms) {
                var sms_type = angular.copy($scope.sms_type);
                var tmp_booking = angular.copy($scope.shipBooking);


                if (tmp_booking.consumption.trader_tel != null && tmp_booking.consumption.trader_tel != "") {
                    if (tmp_booking.consumption.area_code_id == "" || tmp_booking.consumption.area_code_id == null) {
                        topAlert.warning("如填寫訂票人電話則電話區號不能為空");
                        return;
                    }
                }


                var trips = [];

                _.each(tmp_booking.consumptionBoatSubs, function (ele, index) {
                    if (ele.index != "") {
                        var boatCity = $scope.boatCitys[ele.index];
                        var trip_seat = _.where($scope.trip_seat[index], {
                            id: ele.boat_trip_id
                        });
                        trips.push({
                            boatCity: boatCity ? boatCity.from_place + "-" + boatCity.to_place : "",
                            ticket_count: ele.count,
                            trip_seat: trip_seat[0] ? trip_seat[0].boat_seat_type : "",
                            departure_date: $filter('date')(ele.departure_date, 'yyyy-MM-dd'),
                            departure_time: ele.departure_time
                        });
                    }
                });

                _.each(tmp_booking.consumptionBoatSubs, function (value, key) {
                    delete value.to_place;
                    delete value.from_place;
                    delete value.index;
                    delete value.cost;
                    delete value.sell;

                    value.cost_total = $filter('parseYuanToTenThousand')(value.cost_total);
                    value.sell_total = $filter('parseYuanToTenThousand')(value.sell_total);
                })

                _.each(tmp_booking.consumptionBoatSubs, function (ele, index) {
                    if (ele.index != "") {
                        tmp_booking.consumptionBoatSubs[index].departure_date = $filter('date')(ele.departure_date, 'yyyy-MM-dd');
                    }
                });

                tmp_booking.consumption.should_pay = $filter('parseYuanToTenThousand')(tmp_booking.consumption.should_pay, 6, true);
                tmp_booking.consumption.should_pay = $filter('parseYuan')(tmp_booking.consumption.should_pay, 2, true)
                tmp_booking.consumption.shift_date = $filter('date')(tmp_booking.consumption.shift_date, 'yyyy-MM-dd');

                tmp_booking.consumption.year_month = $filter('date')(tmp_booking.consumption.year_month, 'yyyy-MM');
                tmp_booking.pin_code = $scope.global_params.pin_code ? $scope.global_params.pin_code : tmp_booking.pin_code;


                //tmp_booking.consumption.shift_date
                var sms = {
                    isHasSms: true,
                    send_time: "ship",
                    select_sms_type: sms_type.value,
                    agent_code: $scope.agent_about.agent_code,
                    agent_name: $scope.agent_about.agent_name,
                    shift_date: "",
                    trip_time: "",
                    trips: trips,
                    people: tmp_booking.consumption.trader,
                    notify: {
                        trader: tmp_booking.consumption.trader,
                        area_code_id: tmp_booking.consumption.area_code_id,
                        trader_tel: tmp_booking.consumption.trader_tel
                    }
                };

                //return;

                var sub_method = consumptionBoat.save;


                var tis = "添加成功";
                if ('PUT' == $scope.sub_post_put) {
                    sub_method = consumptionBoat.update;
                    tis = "修改成功";
                    ConsumptionSmsTemp.destroy();
                }
                if ($scope.COPY_BOOKING_ship) {
                    sub_method = consumptionBoat.save;
                    tis = "複製成功";
                    ConsumptionSmsTemp.destroy();
                }
                if ($scope.isDisabled) {
                    return;
                }
                $scope.isDisabled = true;

                $scope.form_ship.checkValidity().then(function () {
                    sub_method(tmp_booking, function () {
                        topAlert.success(tis);
                        if ($scope.popupWindow) {
                            $modalInstance.close(" ");
                        }

                        var id = angular.copy($scope.shipBooking.agent_info_id);

                        $scope.isDisabled = false;
                        $scope.form_ship.clearErrors();
                        $scope.cancel();

                        //發送SMS
                        if (!$scope.shipBooking.id && hasSms) {
                            if (sms_type.value == "" || sms_type.value == null) {
                                sms.isHasSms = false;
                            }
                            ConsumptionSmsTemp.init(angular.copy(sms));
                            $location.path("share/share-send-sms/" + id);
                        } else {
                            $scope.ship_search();
                        }
                    }, function () {
                        $scope.isDisabled = false;
                    });
                });
            }

            $scope.cancel = function () {
                $scope.ship_total = {
                    cost: 0,
                    sell: 0,
                    profit: 0
                }
                $scope.sub_post_put = 'POST';
                $scope.agent_about = angular.copy(agent_about_init);
                $scope.shipBooking = angular.copy(shipBookingOrignal);
                if (!$scope.popupWindow) {
                    $location.path('/consumption-manager/consumption-manager/ship');
                } else {
                    $modalInstance.dismiss();
                }


            }


        }
    ]).controller('consumptionShipTicketBookingDateilCtrls', ['$scope', '$stateParams', '$location', 'globalFunction', 'consumptionBoat', '$window',
        function ($scope, $stateParams, $location, globalFunction, consumptionBoat, $window) {
            $scope.shipBooking = {};
            var param_id = $stateParams.id;

            if (!angular.isUndefined(param_id)) {
                consumptionBoat.query(globalFunction.generateUrlParams({
                    consumption_id: param_id
                }, {
                    consumption: {},
                    consumptionBoatSubs: {}
                })).$promise.then(function (data) {
                        var data = data[0];
                        if (!data) {
                            return;
                        }
                        $scope.shipBooking = data;
                    })
            }

            $scope.detail_update = function () {
                $location.path('/consumption-manager/consumption-manager/ship/consumption-ship-ticket-booking-update/' + param_id);
            }

            $scope.detail_cancel = function () {
                //$location.path('/consumption-manager/consumption-manager/ship');
                $window.history.back();
            }


        }
    ]).controller('consumptionAirBookingUpdateCtrls', ['$scope', '$stateParams', '$location', 'globalFunction', 'consumptionFlight', '$filter', 'topAlert', 'consumptionHoteltravel', 'agentsLists', 'agentGuest', 'shiftMark', 'pinCodeUserName', 'isSendSmsModal', 'shiftMarks', 'idcardType', 'areaCode', 'consumptionPaytype', 'flightSeatType', '$modalInstance', 'ConsumptionSmsTemp',
        function ($scope, $stateParams, $location, globalFunction, consumptionFlight, $filter, topAlert, consumptionHoteltravel, agentsLists, agentGuest, shiftMark, pinCodeUserName, isSendSmsModal, shiftMarks, idcardType, areaCode, consumptionPaytype, flightSeatType, $modalInstance, ConsumptionSmsTemp) {

            $scope.popupWindow = false
            if (!$scope.global_params) {
                $scope.popupWindow = true
                $scope.global_params = {};
                $scope.shiftLists = shiftMarks
                $scope.idCardtypes = idcardType.query();
                $scope.areaCodes = areaCode.query();
                $scope.flight_seattypes = flightSeatType.query();
                $scope.pay_types = [];
                consumptionPaytype.query().$promise.then(function (data) // 支付方式
                {
                    _.each(data, function ($that, $key) {
                        if ('COMMISSION' == $that.pay_type_code || 'COMSUMPTION' == $that.pay_type_code) {
                            $scope.pay_types.push($that);
                        }
                    })
                });
            }
            $scope.COPY_BOOKING_air = -1 != ($location.$$url).indexOf('air-booking-copy');
            $scope.sub_post_put = 'POST';
            $scope.air_url = globalFunction.getApiUrl('consumption/consumptionflight');
            $scope.air_single_url_put = globalFunction.getApiUrl('consumption/consumptionflight/update-single');
            $scope.air_single_url_post = globalFunction.getApiUrl('consumption/consumptionflight/create-single');
            $scope.air_double_url_post = globalFunction.getApiUrl('consumption/consumptionflight/create-double');
            $scope.air_double_url_put = globalFunction.getApiUrl('consumption/consumptionflight/update-double');
            $scope.isDisabled = false;

            var agent_about_init = {
                agent_code: "",
                agent_name: "",
                hall_name: "",
                isReturn: false,
                username: ""
            }
            $scope.air_total = {
                cost: 0,
                sell: 0,
                profit: 0
            }
            $scope.agent_about = angular.copy(agent_about_init);
            var airBookingInit = {
                agent_info_id: "",
                count: "1",
                cost: "",
                sell: "",
                from_place: "",
                to_place: "",
                departure_date: "",
                departure_time: "",
                //hotel_travel_id : "",
                seat_type_id: "",
                flight_no: "",

                consumption: {
                    //agent_info_id: "",
                    book_no: "",
                    pay_type_id: $scope.default_pay_type_id,
                    trader: "",
                    trader_tel: "",
                    remark: "",
                    should_pay: "",
                    shift_date: $scope.global_params.shift_date,
                    year_month: $scope.global_params.year_month,
                    shift: $scope.global_params.shift,
                    area_code_id: null
                },
                consumptionFlightSubs: [{
                    "idcard_type_id": "",
                    "passenger": "",
                    "idcard_no": "",
                    telephone_number: "",
                    area_code_id: null
                }],
                pin_code: ''
            };
            var FlightSub = {
                idcard_type_id: "",
                passenger: "",
                idcard_no: "",
                telephone_number: "",
                area_code_id: null
            }

            var air_return = {
                return_from_place: "",
                return_to_place: "",
                return_departure_date: "",
                return_departure_time: "",
                return_flight_no: "",
                return_seat_type_id: null
            }

            var airBookingOrignal = angular.copy(airBookingInit);
            $scope.airBooking = angular.copy(airBookingOrignal);

            var param_id = $stateParams.id;

            if (!angular.isUndefined(param_id)) {
                consumptionFlight.query(globalFunction.generateUrlParams({
                    consumption_id: param_id
                }, {
                    consumption: {},
                    consumptionFlightSubs: {}
                })).$promise.then(function (data) {
                        var data = data[0];
                        if (!data) {
                            return;
                        }
                        $scope.sub_post_put = 'PUT';
                        airBookingOrignal = _.extend_exist(airBookingOrignal, data);
                        airBookingOrignal.id = data.id;
                        airBookingOrignal.consumption.id = data.consumption.id;
                        airBookingOrignal.consumption.status = data.consumption.status;
                        airBookingOrignal.departure_date = $filter('parseDate')(data.departure_date, 'yyyy-MM-dd');

                        airBookingOrignal.departure_time = data.departure_time.substring(11, data.departure_time.length - 3);

                        airBookingOrignal.cost = $filter('parseTenThousandToYuan')(data.cost, false);
                        airBookingOrignal.sell = $filter('parseTenThousandToYuan')(data.sell, false);

                        //airBookingOrignal.consumption.should_pay = $filter('parseTenThousandToYuan')(data.consumption.should_pay, false)
                        airBookingOrignal.consumption.shift_date = $filter('parseDate')(data.consumption.shift_date, 'yyyy-MM-dd');
                        airBookingOrignal.consumption.year_month = $filter('parseDate')(data.consumption.year_month, 'yyyy-MM');


                        if (data.return_departure_date) {

                            $scope.agent_about.isReturn = true;
                            airBookingOrignal.return_departure_date = $filter('parseDate')(data.return_departure_date, 'yyyy-MM-dd');
                            //airBookingOrignal.return_departure_time = data.return_departure_time.substring(11);
                            //airBookingOrignal.return_departure_time = $filter('date')(data.return_departure_time, 'yyyy-MM-dd HH-mm-ss');
                            //airBookingOrignal.return_departure_time = $filter('date')(data.return_departure_time, 'HH:mm');
                            airBookingOrignal.return_departure_time = data.return_departure_time.substring(11, data.return_departure_time.length - 3);
                            airBookingOrignal.return_from_place = data.return_from_place;
                            airBookingOrignal.return_to_place = data.return_to_place;
                            airBookingOrignal.return_flight_no = data.return_flight_no;
                            airBookingOrignal.return_seat_type_id = data.return_seat_type_id;
                        }

                        $scope.agent_about.book_time = data.book_time;
                        $scope.agent_about.agent_code = data.agent_code;
                        $scope.agent_about.hall_name = data.hall_name;

                        $scope.airBooking = angular.copy(airBookingOrignal);
                        setTimeout(function () {
                            $scope.airBooking.consumption.should_pay = $filter('parseTenThousandToYuan')(data.consumption.should_pay, false)
                        }, 100);
                    })
            }

            $scope.$on('consumptionShiftDataChange', function (event) {
                airBookingInit.consumption.shift_date = $scope.$parent.global_params.shift_date;
                airBookingInit.consumption.year_month = $scope.$parent.global_params.year_month;
                airBookingInit.consumption.shift = $scope.$parent.global_params.shift;
                airBookingOrignal.consumption.shift_date = $scope.$parent.global_params.shift_date;
                airBookingOrignal.consumption.year_month = $scope.$parent.global_params.year_month;
                airBookingOrignal.consumption.shift = $scope.$parent.global_params.shift;
                $scope.airBooking.consumption.shift_date = $scope.$parent.global_params.shift_date;
                $scope.airBooking.consumption.year_month = $scope.$parent.global_params.year_month;
                $scope.airBooking.consumption.shift = $scope.$parent.global_params.shift;
            });

            // 户口编号
            $scope.$watch('agent_about.agent_code', globalFunction.debounce(function (new_value, old_value) {
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({
                        agent_code: new_value
                    }, {})).$promise.then(function (agent) {
                            if (agent.length > 0) {
                                $scope.agent_about.agent_name = agent[0].agent_name;
                                //$scope.airBooking.consumption.agent_info_id = agent[0].id;
                                $scope.airBooking.agent_info_id = agent[0].id;
                            } else {
                                $scope.airBooking.agent_info_id = "";
                                //$scope.airBooking.consumption.agent_info_id = "";
                                $scope.agent_about.agent_name = "";
                            }
                        });
                } else {
                    $scope.airBooking.agent_info_id = "";
                    //$scope.airBooking.consumption.agent_info_id = "";
                    $scope.agent_about.agent_name = "";
                }
            }));

            /*$scope.$on('consumptionHoteltravelQuery',function(event){
             setDefaultHotelTravelId();
             })
             var setDefaultHotelTravelId = function()
             {
             if($scope.default_hotel_travel_id && '2' == $scope.default_hotel_travel_type){
             airBookingInit.hotel_travel_id = $scope.default_hotel_travel_id;
             airBookingOrignal.hotel_travel_id = $scope.default_hotel_travel_id;
             $scope.airBooking.hotel_travel_id = $scope.default_hotel_travel_id;
             }
             };
             setDefaultHotelTravelId();*/

            $scope.$watch('airBooking.cost+airBooking.sell', function (new_value, old_value) {
                cal_totel();
            });

            $scope.ChangeAirType = function () {
                if ($scope.agent_about.isReturn) //单程
                {
                    for (var i in air_return) {
                        delete $scope.airBooking[i];
                    }
                } else // 双程
                {
                    _.extend($scope.airBooking, air_return);
                }
            }

            $scope.$watch('airBooking.count', function (new_value, old_value) {
                if (new_value > old_value) {
                    var add_length = new_value - old_value;
                    var count = parseInt($scope.airBooking.count);

                    if ($scope.airBooking.consumptionFlightSubs.length < count) {
                        for (var i = 0; i < add_length; i++) {
                            var copy_flightsub = angular.copy(FlightSub);
                            $scope.airBooking.consumptionFlightSubs.push(copy_flightsub);
                        }
                    }
                } else if (old_value > new_value) {
                    var delete_length = old_value - new_value;
                    $scope.airBooking.consumptionFlightSubs.splice($scope.airBooking.consumptionFlightSubs.length - delete_length, delete_length);
                }
                cal_totel();
            });


            $scope.air_agent_list = [];
            $scope.air_tel_list = [];
            $scope.air_idcard_list = [];

            function auto_complete($index, new_value) {
                if (new_value && $scope.airBooking.agent_info_id) {
                    var list = _.findWhere($scope.air_agent_list, {
                        agent_guest_name: new_value
                    });
                    if (list) {
                        $scope.air_tel_list = list.guestTels;
                        $scope.air_idcard_list = list.idCards;
                        if (undefined !== $index && list.idCards.length) {
                            $scope.airBooking.consumptionFlightSubs[$index].idcard_type_id = list.idCards[0].idcard_type_id;
                            $scope.airBooking.consumptionFlightSubs[$index].idcard_no = list.idCards[0].idcard_number;
                        }
                    } else {
                        agentGuest.query(globalFunction.generateUrlParams({
                            agent_guest_name: new_value + '!',
                            agent_info_id: $scope.airBooking.agent_info_id
                        }, {
                            guestTels: {},
                            idCards: {},
                            guestImages: {}
                        })).$promise.then(function (data) {
                                $scope.air_agent_list = data;
                            })
                    }
                } else {
                    $scope.air_agent_list = [];
                    $scope.air_tel_list = [];
                    $scope.air_idcard_list = [];
                }

                if (0 === $index) {
                    $scope.airBooking.consumption.trader = $scope.airBooking.consumptionFlightSubs[0].passenger;
                }

            }

            $scope.$watch('airBooking.consumption.trader', globalFunction.debounce(function (new_value) {
                auto_complete(undefined, new_value);
            }));

            $scope.ChangeRegister = function ($index, consumptionFlightSub) {
                auto_complete($index, consumptionFlightSub.passenger);
            }

            function cal_totel() {
                $scope.air_total.cost = $scope.airBooking.cost * $scope.airBooking.count;
                $scope.air_total.sell = $scope.airBooking.sell * $scope.airBooking.count;
                $scope.air_total.profit = $scope.air_total.sell - $scope.air_total.cost;
                if (!$scope.COPY_BOOKING_air) {
                    if ($scope.airBooking.sell != '' && $scope.airBooking.count != '')
                        $scope.airBooking.consumption.should_pay = parseFloat(parseFloat($scope.air_total.sell).toFixed(4));
                    else
                        $scope.airBooking.consumption.should_pay = '';
                }
            }

            //生成备注 机票
            $scope.creatremark = function () {

                var OneWay = ""
                var RoundTrip = ""
                var text = ""
                var areaCodes = ""
                for (var i = 0; i < $scope.airBooking.consumptionFlightSubs.length; i++) {
                    text +=
                        "客人姓名：" + $scope.airBooking.consumptionFlightSubs[i].passenger + "，證件號碼：" + $scope.airBooking.consumptionFlightSubs[i].idcard_no
                }

                if ($scope.airBooking.consumption.area_code_id) {
                    areaCodes = $filter("filter")($scope.areaCodes, {
                            "id": $scope.airBooking.consumption.area_code_id
                        })[0].area_code + "-"
                }

                OneWay = "機票出發地：" + $scope.airBooking.from_place + "，目的地：" + $scope.airBooking.to_place + "，日期：" + $filter('date')($scope.airBooking.departure_date, 'yyyy年MM月dd日') + "，航班編號：" + $scope.airBooking.flight_no + "，時間：" + $filter('date')($scope.airBooking.departure_time, 'HH:mm') + "，艙位：" + ($scope.flight_seattypes ? _.findWhere($scope.flight_seattypes, {
                        "id": $scope.airBooking.seat_type_id
                    }) : "")
                        .flight_seat_type + "，張數：" + $scope.airBooking.count + "張"
                /*+text
                 +"，訂票人："+$scope.airBooking.consumption.trader
                 +"，電話："+areaCodes+$scope.airBooking.consumption.trader_tel*/
                //alert($scope.airBooking.departure_time);
                if (!$scope.agent_about.isReturn) {
                    $scope.airBooking.consumption.remark = OneWay + text + "，訂票人：" + $scope.airBooking.consumption.trader + "，電話：" + areaCodes + $scope.airBooking.consumption.trader_tel;
                } else {

                    RoundTrip = "回程出發地：" + $scope.airBooking.return_from_place + "，回程目的地：" + $scope.airBooking.return_to_place + "，日期：" + $filter('date')($scope.airBooking.return_departure_date, 'yyyy年MM月dd日') + "，航班編號：" + $scope.airBooking.return_flight_no + "，時間：" + $filter('date')($scope.airBooking.return_departure_time, 'HH:mm') + "，艙位：" + _.findWhere($scope.flight_seattypes, {
                            "id": $scope.airBooking.return_seat_type_id
                        })
                            .flight_seat_type + "，張數：" + $scope.airBooking.count + "張"
                    /*+text
                     +"，訂票人："+$scope.airBooking.consumption.trader
                     +"，電話："+areaCodes+$scope.airBooking.consumption.trader_tel*/
                    $scope.airBooking.consumption.remark = OneWay + "\n" + RoundTrip + "\n" + text + "，訂票人：" + $scope.airBooking.consumption.trader + "，電話：" + areaCodes + $scope.airBooking.consumption.trader_tel;
                }

            }

            $scope.add = function (hasSms) {
                //if($scope.agent_about.isReturn)//单程
                //{
                //    if($scope.airBooking.departure_date !== null || $scope.airBooking.departure_time !== null){
                //        topAlert.warning('出發日期和時間都不能為空');
                //            $scope.alert_date_time = '出發日期和時間都不能為空';
                //    }
                //   if($scope.airBooking.departure_time == null){
                //        topAlert.warning('出發時間不能為空');
                //    }
                //}
                //else // 双程
                //{

                //}
                //if( $scope.sub_post_put == 'PUT'){
                //    $scope.airBooking.return_departure_time =tmp_booking.return_departure_time.substring(11);
                //        $scope.airBooking.departure_time =tmp_booking.return_departure_time.substring(11);
                //}


                var tmp_booking = angular.copy($scope.airBooking);

                /*if(tmp_booking.consumption.trader_tel != null && tmp_booking.consumption.trader_tel !="")
                 {
                 if(tmp_booking.consumption.area_code_id == "" || tmp_booking.consumption.area_code_id == null){
                 topAlert.warning("如填寫訂票人電話則電話區域不能為空");
                 return;
                 }
                 }*/


                tmp_booking.cost = $filter('parseYuanToTenThousand')(tmp_booking.cost, 6, true);
                tmp_booking.sell = $filter('parseYuanToTenThousand')(tmp_booking.sell, 6, true);
                tmp_booking.consumption.should_pay = $filter('parseYuanToTenThousand')(tmp_booking.consumption.should_pay, 6, true);
                tmp_booking.cost = $filter('parseYuan')(tmp_booking.cost, 2, true);
                tmp_booking.sell = $filter('parseYuan')(tmp_booking.sell, 2, true);
                tmp_booking.consumption.should_pay = $filter('parseYuan')(tmp_booking.consumption.should_pay, 2, true);
                tmp_booking.consumption.shift_date = $filter('date')(tmp_booking.consumption.shift_date, 'yyyy-MM-dd');
                tmp_booking.consumption.year_month = $filter('date')(tmp_booking.consumption.year_month, 'yyyy-MM');
                tmp_booking.pin_code = $scope.global_params.pin_code ? $scope.global_params.pin_code : tmp_booking.pin_code;

                //時間截取問題

                tmp_booking.departure_date = $filter('date')(tmp_booking.departure_date, 'yyyy-MM-dd');

                if ('string' !== typeof(tmp_booking.departure_time)) {
                    tmp_booking.departure_time = tmp_booking.departure_time.substring(11);
                } else {
                    tmp_booking.departure_time = $filter('date')(tmp_booking.departure_time, 'HH:mm:ss');
                }

                if (tmp_booking.return_departure_date) {

                    tmp_booking.return_departure_date = $filter('date')(tmp_booking.return_departure_date, 'yyyy-MM-dd');

                    if ('string' !== typeof(tmp_booking.return_departure_time)) {
                        tmp_booking.return_departure_time = tmp_booking.return_departure_time.substring(11);
                    } else {
                        tmp_booking.return_departure_time = $filter('date')(tmp_booking.return_departure_time, 'HH:mm:ss');
                    }
                }
                //alert($scope.agent_about.isReturn)


                var sub_method = $scope.agent_about.isReturn ? consumptionFlight.flightAddDouble : consumptionFlight.flightAddSingle;
                $scope.air_url = $scope.agent_about.isReturn ? $scope.air_double_url_post : $scope.air_single_url_post;


                var peoples = [];

                _.each($scope.airBooking.consumptionFlightSubs, function (ele) {
                    if (ele.passenger != "") {
                        peoples.push({
                            passenger: ele.passenger,
                            idcard_no: ele.idcard_no
                        });
                    }
                });

                var seat_type = _.where($scope.flight_seattypes, {
                    id: tmp_booking.seat_type_id
                });
                var sms = {
                    send_time: "air",
                    agent_code: $scope.agent_about.agent_code,
                    agent_name: $scope.agent_about.agent_name,
                    departure_date: tmp_booking.departure_date,
                    //departure_time: tmp_booking.departure_time.substring(0, tmp_booking.departure_time.length - 3),//這樣只是截取到小時
                    departure_time: tmp_booking.departure_time.substring(0, tmp_booking.departure_time.length),
                    from_place: tmp_booking.from_place,
                    to_place: tmp_booking.to_place,
                    flight_no: tmp_booking.flight_no,
                    seat_type: seat_type[0] ? seat_type[0].flight_seat_type : "",
                    peoples: peoples,
                    ticket_no: "",
                    is_return: $scope.agent_about.isReturn,
                    notify: {
                        trader: tmp_booking.consumption.trader,
                        area_code_id: tmp_booking.consumption.area_code_id,
                        trader_tel: tmp_booking.consumption.trader_tel
                    }
                };

                if (sms.is_return) {
                    var return_seat_type = _.where($scope.flight_seattypes, {
                        id: tmp_booking.return_seat_type_id
                    });


                    $scope.flight_seat_type_instead = return_seat_type.length !== 0 ? return_seat_type[0].flight_seat_type : "";
                    var returns = {
                        returns: {
                            departure_date: tmp_booking.return_departure_date,
                            departure_time: tmp_booking.return_departure_time.substring(0, tmp_booking.return_departure_time.length - 3),
                            from_place: tmp_booking.return_from_place,
                            to_place: tmp_booking.return_to_place,
                            flight_no: tmp_booking.return_flight_no,
                            seat_type: $scope.flight_seat_type_instead,
                            ticket_no: ""
                        }
                    };


                    sms = _.extend(sms, returns);
                }

                //if(sms.is_return){
                //    var return_seat_type = _.where($scope.flight_seattypes , {id:tmp_booking.return_seat_type_id});
                //    var returns = {
                //        returns:{
                //            departure_date:tmp_booking.return_departure_date,
                //            departure_time:tmp_booking.return_departure_time.substring(0,tmp_booking.return_departure_time.length - 3),
                //            from_place:tmp_booking.return_from_place,
                //            to_place:tmp_booking.return_to_place,
                //            flight_no:tmp_booking.return_flight_no,
                //            seat_type:return_seat_type[0].flight_seat_type,
                //            ticket_no:""
                //        }
                //    };
                //    sms = _.extend(sms,returns);
                //}

                //ConsumptionSmsTemp.init(angular.copy(sms));

                var tis = "添加成功";
                if ('PUT' == $scope.sub_post_put) {
                    sub_method = $scope.agent_about.isReturn ? consumptionFlight.flightUpdateDouble : consumptionFlight.flightUpdateSingle;
                    $scope.air_url = $scope.agent_about.isReturn ? $scope.air_double_url_put : $scope.air_single_url_put;
                    tis = "修改成功";
                    ConsumptionSmsTemp.destroy();
                }

                if ($scope.COPY_BOOKING_air) {
                    sub_method = $scope.agent_about.isReturn ? consumptionFlight.flightAddDouble : consumptionFlight.flightAddSingle;
                    $scope.air_url = $scope.agent_about.isReturn ? $scope.air_double_url_post : $scope.air_single_url_post;
                    tis = "複製成功";
                    ConsumptionSmsTemp.destroy();
                }
                if ($scope.isDisabled) {
                    return;
                }
                $scope.isDisabled = true;

                $scope.form_air.checkValidity().then(function () {
                    sub_method(tmp_booking, function () {
                        topAlert.success(tis);
                        if ($scope.popupWindow) {
                            $modalInstance.close(" ");
                        }

                        var id = angular.copy($scope.airBooking.agent_info_id);

                        $scope.isDisabled = false;
                        $scope.form_air.clearErrors();
                        $scope.cancel();

                        //發送SMS
                        if (!$scope.airBooking.id && hasSms) {

                            ConsumptionSmsTemp.init(angular.copy(sms));
                            $location.path("share/share-send-sms/" + id);

                        } else {
                            $scope.air_search();
                        }
                    }, function () {
                        $scope.isDisabled = false;
                    });
                });

            }

            $scope.cancel = function () {
                $scope.sub_post_put = 'POST';
                $scope.agent_about = angular.copy(agent_about_init);
                $scope.airBooking = angular.copy(airBookingOrignal);
                if (!$scope.popupWindow) {
                    $location.path('/consumption-manager/consumption-manager/air');
                } else {
                    $modalInstance.dismiss();
                }


            }


        }
    ]).controller('consumptionAirBookingDetailCtrls', ['$scope', '$stateParams', '$location', 'globalFunction', 'consumptionFlight', '$filter', '$window',
        function ($scope, $stateParams, $location, globalFunction, consumptionFlight, $filter, $window) {

            $scope.airBooking = {};
            var param_id = $stateParams.id;

            if (!angular.isUndefined(param_id)) {
                consumptionFlight.query(globalFunction.generateUrlParams({
                    consumption_id: param_id
                }, {
                    consumption: {},
                    consumptionFlightSubs: {}
                })).$promise.then(function (data) {
                        var data = data[0];
                        if (!data) {
                            return;
                        }
                        $scope.airBooking = data;
                        for (var i = 0, j = data.consumptionFlightSubs.length; i < j; i++) {
                            var id_card_obj = _.findWhere($scope.idCardtypes, {
                                id: data.consumptionFlightSubs[i].idcard_type_id
                            });
                            data.consumptionFlightSubs[i].id_card = id_card_obj.idcard_type_name;
                        }
                        $scope.airBooking.consumptionFlightSubs = data.consumptionFlightSubs;
                        $scope.airBooking.departure_date = $filter('parseDate')($scope.airBooking.departure_date, 'yyyy-MM-dd');
                        $scope.airBooking.departrune_time = $scope.airBooking.departrune_time.substring(0, $scope.airBooking.departrune_time.length - 3);
                        if ($scope.airBooking.return_departrune_time) {
                            $scope.airBooking.return_departrune_time = $scope.airBooking.return_departrune_time.substring(0, $scope.airBooking.departrune_time.length - 3);
                        }

                    })
            }

            $scope.update = function () {
                $location.path('/consumption-manager/consumption-manager/air/consumption-air-booking-update/' + param_id);
            }

            $scope.cancel = function () {
                //$location.path('/consumption-manager/consumption-manager/air');
                $window.history.back();
            }

        }
    ]).controller('consumptionCarBookingUpdateCtrls', ['$scope', '$location', '$stateParams', 'consumptionCar', 'globalFunction', '$filter', 'topAlert', 'agentsLists', 'agentGuest', 'shiftMark', 'pinCodeUserName', 'isSendSmsModal', 'shiftMarks', 'idcardType', 'areaCode', 'consumptionPaytype', '$modalInstance', 'carType', 'ConsumptionSmsTemp', 'user',
        function ($scope, $location, $stateParams, consumptionCar, globalFunction, $filter, topAlert, agentsLists, agentGuest, shiftMark, pinCodeUserName, isSendSmsModal, shiftMarks, idcardType, areaCode, consumptionPaytype, $modalInstance, carType, ConsumptionSmsTemp, user) {

            $scope.popupWindow = false
            if (!$scope.global_params) {
                $scope.popupWindow = true
                $scope.global_params = {};
                $scope.shiftLists = shiftMarks
                $scope.idCardtypes = idcardType.query();
                $scope.areaCodes = areaCode.query();
                $scope.pay_types = [];
                $scope.car_types = carType.query();
                consumptionPaytype.query().$promise.then(function (data) // 支付方式
                {
                    _.each(data, function ($that, $key) {
                        if ('COMMISSION' == $that.pay_type_code || 'COMSUMPTION' == $that.pay_type_code) {
                            $scope.pay_types.push($that);
                        }
                    })
                });
            }
            $scope.COPY_BOOKING_car = -1 != ($location.$$url).indexOf('car-booking-copy');
            $scope.sub_post_put = 'POST';
            $scope.car_url = globalFunction.getApiUrl('consumption/consumptioncar');
            $scope.isDisabled = false;

            var agent_about_init = {
                agent_code: "",
                agent_name: "",
                hall_name: "",
                from_place: "",
                to_place: "",
                username: ""
            }
            $scope.car_total = {
                cost: 0,
                sell: 0,
                profit: 0
            }
            $scope.agent_about = angular.copy(agent_about_init);
            var carBookingInit = {
                agent_info_id: "",
                count: "1",

                //hotel_travel_id : "",
                car_type_id: "",
                departure_date: new Date(),
                departure_time: '',
                trip: "",
                cost: "",
                sell: "",
                consumption: {
                    //agent_info_id: "",
                    book_no: "",
                    pay_type_id: $scope.default_pay_type_id,
                    trader: "",
                    trader_tel: "",
                    remark: "",
                    should_pay: "",
                    shift_date: $scope.global_params.shift_date,
                    year_month: $scope.global_params.year_month,
                    shift: $scope.global_params.shift,
                    area_code_id: null
                },
                pin_code: ''
            };
            var carBookingOrignal = angular.copy(carBookingInit);
            $scope.carBooking = angular.copy(carBookingOrignal);


            var param_id = $stateParams.id;

            if (!angular.isUndefined(param_id)) {
                consumptionCar.query(globalFunction.generateUrlParams({
                    consumption_id: param_id
                }, {
                    consumption: {}
                })).$promise.then(function (data) {
                        var data = data[0];
                        if (!data) {
                            return;
                        }
                        $scope.sub_post_put = 'PUT';
                        carBookingOrignal = _.extend_exist(carBookingOrignal, data);

                        carBookingOrignal.id = data.id;
                        carBookingOrignal.consumption.id = data.consumption.id;
                        carBookingOrignal.consumption.status = data.consumption.status;
                        carBookingOrignal.departure_date = $filter('parseDate')(data.departure_date, 'yyyy-MM-dd');
                        carBookingOrignal.departure_time = $filter('parseDate')(data.departure_time, 'HH:mm');

                        carBookingOrignal.cost = $filter('parseTenThousandToYuan')(data.cost, false);
                        carBookingOrignal.sell = $filter('parseTenThousandToYuan')(data.sell, false);
                        //carBookingOrignal.consumption.should_pay = $filter('parseTenThousandToYuan')(data.consumption.should_pay, false)
                        carBookingOrignal.consumption.shift_date = $filter('parseDate')(data.consumption.shift_date, 'yyyy-MM-dd');
                        carBookingOrignal.consumption.year_month = $filter('parseDate')(data.consumption.year_month, 'yyyy-MM');

                        $scope.agent_about.book_time = data.book_time;

                        $scope.agent_about.agent_code = data.agent_code;
                        $scope.agent_about.hall_name = data.hall_name;

                        $scope.carBooking = angular.copy(carBookingOrignal);
                        setTimeout(function () {
                            $scope.carBooking.consumption.should_pay = $filter('parseTenThousandToYuan')(data.consumption.should_pay, false)
                        }, 100);

                    })
            }

            $scope.$on('consumptionShiftDataChange', function (event) {
                carBookingInit.consumption.shift_date = $scope.$parent.global_params.shift_date;
                carBookingInit.consumption.year_month = $scope.$parent.global_params.year_month;
                carBookingInit.consumption.shift = $scope.$parent.global_params.shift;
                carBookingOrignal.consumption.shift_date = $scope.$parent.global_params.shift_date;
                carBookingOrignal.consumption.year_month = $scope.$parent.global_params.year_month;
                carBookingOrignal.consumption.shift = $scope.$parent.global_params.shift;
                $scope.carBooking.consumption.shift_date = $scope.$parent.global_params.shift_date;
                $scope.carBooking.consumption.year_month = $scope.$parent.global_params.year_month;
                $scope.carBooking.consumption.shift = $scope.$parent.global_params.shift;
            });

            // 户口编号
            $scope.$watch('agent_about.agent_code', globalFunction.debounce(function (new_value, old_value) {
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({
                        agent_code: new_value
                    }, {})).$promise.then(function (agent) {
                            if (agent.length > 0) {
                                $scope.agent_about.agent_name = agent[0].agent_name;
                                //$scope.carBooking.consumption.agent_info_id = agent[0].id;
                                $scope.carBooking.agent_info_id = agent[0].id;
                            } else {
                                $scope.carBooking.agent_info_id = "";
                                //$scope.carBooking.consumption.agent_info_id = "";
                                $scope.agent_about.agent_name = "";
                            }
                        });
                } else {
                    $scope.carBooking.agent_info_id = "";
                    //$scope.carBooking.consumption.agent_info_id = "";
                    $scope.agent_about.agent_name = "";
                }
            }));

            /*$scope.$on('consumptionHoteltravelQuery',function(event){
             setDefaultHotelTravelId();
             })
             var setDefaultHotelTravelId = function()
             {
             if($scope.default_hotel_travel_id && '2' == $scope.default_hotel_travel_type){
             carBookingInit.hotel_travel_id = $scope.default_hotel_travel_id;
             carBookingOrignal.hotel_travel_id = $scope.default_hotel_travel_id;
             $scope.carBooking.hotel_travel_id = $scope.default_hotel_travel_id;
             }
             };
             setDefaultHotelTravelId();*/

            $scope.car_agent_list = [];
            $scope.car_tel_list = [];
            $scope.$watch('carBooking.consumption.trader', globalFunction.debounce(function (new_value) {
                if (new_value && $scope.carBooking.agent_info_id) {
                    var list = _.findWhere($scope.car_agent_list, {
                        agent_guest_name: new_value
                    });
                    if (list) {
                        $scope.car_tel_list = list.guestTels;
                    } else {
                        agentGuest.query(globalFunction.generateUrlParams({
                            agent_guest_name: new_value + '!',
                            agent_info_id: $scope.carBooking.agent_info_id
                        }, {
                            guestTels: {},
                            idCards: {},
                            guestImages: {}
                        })).$promise.then(function (data) {
                                $scope.car_agent_list = data;
                            })
                    }
                } else {
                    $scope.car_agent_list = [];
                    $scope.car_tel_list = [];
                }
            }));

            $scope.$watch('carBooking.cost+carBooking.sell', function (new_value, old_value) {
                cal_totel();
            });

            $scope.$watch('carBooking.count', function (new_value, old_value) {
                cal_totel();
            });

            function cal_totel() {
                $scope.car_total.cost = $scope.carBooking.cost * $scope.carBooking.count;
                $scope.car_total.sell = $scope.carBooking.sell * $scope.carBooking.count;
                $scope.car_total.profit = $scope.car_total.sell - $scope.car_total.cost;
                if (!$scope.COPY_BOOKING_car) {
                    if ($scope.carBooking.sell != '' && $scope.carBooking.count != '')
                        $scope.carBooking.consumption.should_pay = parseFloat(parseFloat($scope.car_total.sell).toFixed(4));
                    else
                        $scope.carBooking.consumption.should_pay = '';
                }
            }

            //生成备注 租车
            $scope.creatremark = function () {
                var areaCodes = ""
                if ($scope.carBooking.consumption.area_code_id) {
                    areaCodes = $filter("filter")($scope.areaCodes, {
                            "id": $scope.carBooking.consumption.area_code_id
                        })[0].area_code + "-"
                }
                $scope.carBooking.consumption.remark =
                    "租車日期：" + $filter('date')($scope.carBooking.departure_date, 'yyyy/MM/dd') + "，租車時間：" + $scope.carBooking.departure_time + "，行程：" + $scope.carBooking.trip + "，訂票人：" + $scope.carBooking.consumption.trader + "，電話：" + areaCodes + $scope.carBooking.consumption.trader_tel
            }

            $scope.add = function (hasSms) {
                var tmp_booking = angular.copy($scope.carBooking);

                if (tmp_booking.consumption.trader_tel != null && tmp_booking.consumption.trader_tel != "") {
                    if (tmp_booking.consumption.area_code_id == "" || tmp_booking.consumption.area_code_id == null) {
                        topAlert.warning("如填寫預定人電話則電話區域不能為空");
                        return;
                    }
                }


                tmp_booking.pin_code = $scope.global_params.pin_code ? $scope.global_params.pin_code : tmp_booking.pin_code;

                tmp_booking.cost = $filter('parseYuanToTenThousand')(tmp_booking.cost, 6, true);
                tmp_booking.sell = $filter('parseYuanToTenThousand')(tmp_booking.sell, 6, true);
                tmp_booking.consumption.should_pay = $filter('parseYuanToTenThousand')(tmp_booking.consumption.should_pay, 6, true);
                tmp_booking.cost = $filter('parseYuan')(tmp_booking.cost, 2, true);
                tmp_booking.sell = $filter('parseYuan')(tmp_booking.sell, 2, true);
                tmp_booking.consumption.should_pay = $filter('parseYuan')(tmp_booking.consumption.should_pay, 2, true);
                tmp_booking.consumption.shift_date = $filter('date')(tmp_booking.consumption.shift_date, 'yyyy-MM-dd');
                tmp_booking.consumption.year_month = $filter('date')(tmp_booking.consumption.year_month, 'yyyy-MM');
                tmp_booking.departure_date = $filter('date')(tmp_booking.departure_date, 'yyyy-MM-dd');
                /*if('string'  == typeof(tmp_booking.departure_time) ){
                 tmp_booking.departure_time =tmp_booking.departure_time.substring(11);
                 }else{
                 tmp_booking.departure_time = $filter('date')(tmp_booking.departure_time, 'HH:mm:ss');
                 }*/

                var sub_method = consumptionCar.save;

                var car_type = _.where($scope.car_types, {
                    id: tmp_booking.car_type_id
                });
                var sms = {
                    send_time: "car",
                    agent_code: $scope.agent_about.agent_code,
                    agent_name: $scope.agent_about.agent_name,
                    guest_name: tmp_booking.consumption.trader,
                    guest_tel: tmp_booking.consumption.trader_tel,
                    departure_date: tmp_booking.departure_date,
                    departure_time: $filter('date')(tmp_booking.departure_time, 'HH:mm:ss'),
                    trip: tmp_booking.trip,
                    book_no: tmp_booking.consumption.book_no,
                    car_number: "",
                    car_type: car_type[0] ? car_type[0].car_type : "",
                    remark: tmp_booking.consumption.remark,
                    coordinator: user.name,
                    notify: {
                        trader: tmp_booking.consumption.trader,
                        area_code_id: tmp_booking.consumption.area_code_id,
                        trader_tel: tmp_booking.consumption.trader_tel
                    }
                };

                //ConsumptionSmsTemp.init(sms);

                var tis = "添加成功";
                if ('PUT' == $scope.sub_post_put) {
                    sub_method = consumptionCar.update;
                    tis = "修改成功";
                    ConsumptionSmsTemp.destroy();
                }
                if ($scope.COPY_BOOKING_car) {
                    sub_method = consumptionCar.save;
                    tis = "複製成功";
                    ConsumptionSmsTemp.destroy();
                }
                if ($scope.isDisabled) {
                    return;
                }
                $scope.isDisabled = true;

                $scope.form_car.checkValidity().then(function () {
                    sub_method(tmp_booking, function () {
                        topAlert.success(tis);
                        if ($scope.popupWindow) {
                            $modalInstance.close(" ");
                        }


                        var id = angular.copy($scope.carBooking.agent_info_id);


                        $scope.isDisabled = false;
                        $scope.cancel();
                        $scope.form_car.clearErrors();

                        //發送SMS
                        if (!$scope.carBooking.id && hasSms) {
                            ConsumptionSmsTemp.init(sms);
                            $location.path("share/share-send-sms/" + id);
                        } else {
                            $scope.car_search();
                        }
                    }, function () {
                        $scope.isDisabled = false;
                    });
                });
            }
            $scope.cancel = function () {
                $scope.sub_post_put = 'POST';
                $scope.agent_about = angular.copy(agent_about_init);
                $scope.carBooking = angular.copy(carBookingOrignal);
                if (!$scope.popupWindow) {
                    $location.path('/consumption-manager/consumption-manager/car');
                } else {
                    $modalInstance.dismiss();
                }

            }


        }
    ]).controller('consumptionCarBookingDetailCtrls', ['$scope', '$location', '$stateParams', 'consumptionCar', 'globalFunction', '$filter', '$window',
        function ($scope, $location, $stateParams, consumptionCar, globalFunction, $filter, $window) {

            $scope.carBooking = {};
            var param_id = $stateParams.id;
            if (!angular.isUndefined(param_id)) {
                consumptionCar.query(globalFunction.generateUrlParams({
                    consumption_id: param_id
                }, {
                    consumption: {}
                })).$promise.then(function (data) {
                        var data = data[0];
                        if (!data) {
                            return;
                        }
                        $scope.carBooking = data;
                    })
            }

            $scope.detail_update = function () {
                $location.path('/consumption-manager/consumption-manager/car/consumption-car-booking-update/' + param_id);
            }

            $scope.detail_cancel = function () {
                //$location.path('/consumption-manager/consumption-manager/car');
                $window.history.back();
            }


        }
    ]).controller('consumptionTicketBookingUpdateCtrls', ['$scope', '$location', '$stateParams', '$filter', 'globalFunction', 'topAlert', 'agentsLists', 'consumptionTicket', 'agentGuest', 'shiftMark', 'pinCodeUserName', 'isSendSmsModal', 'shiftMarks', 'idcardType', 'areaCode', 'consumptionPaytype', '$modalInstance', 'ticketType', 'ConsumptionSmsTemp',
        function ($scope, $location, $stateParams, $filter, globalFunction, topAlert, agentsLists, consumptionTicket, agentGuest, shiftMark, pinCodeUserName, isSendSmsModal, shiftMarks, idcardType, areaCode, consumptionPaytype, $modalInstance, ticketType, ConsumptionSmsTemp) {

            $scope.popupWindow = false
            if (!$scope.global_params) {
                $scope.popupWindow = true
                $scope.global_params = {};
                $scope.shiftLists = shiftMarks
                $scope.idCardtypes = idcardType.query();
                $scope.areaCodes = areaCode.query();
                $scope.pay_types = [];
                $scope.ticket_types = ticketType.query();
                consumptionPaytype.query().$promise.then(function (data) // 支付方式
                {
                    _.each(data, function ($that, $key) {
                        if ('COMMISSION' == $that.pay_type_code || 'COMSUMPTION' == $that.pay_type_code) {
                            $scope.pay_types.push($that);
                        }
                    })
                });
            }
            $scope.COPY_BOOKING_ticket = -1 != ($location.$$url).indexOf('ticket-booking-copy');
            $scope.sub_post_put = 'POST';
            $scope.ticket_url = globalFunction.getApiUrl('consumption/consumptionticket');
            $scope.isDisabled = false;

            var agent_about_init = {
                agent_code: "",
                agent_name: "",
                hall_name: "",
                username: ""
            }
            $scope.ticket_total = {
                cost: 0,
                sell: 0,
                profit: 0
            }
            $scope.agent_about = angular.copy(agent_about_init);
            var ticketBookingInit = {
                agent_info_id: "",
                count: "1",
                cost: "",
                sell: "",
                //hotel_travel_id : "",
                ticket_type_id: "",
                show_date: "",
                show_time: "",
                consumption: {
                    //agent_info_id: "",
                    book_no: "",
                    pay_type_id: $scope.default_pay_type_id,
                    trader: "",
                    trader_tel: "",
                    remark: "",
                    should_pay: "",
                    shift_date: $scope.global_params.shift_date,
                    year_month: $scope.global_params.year_month,
                    shift: $scope.global_params.shift,
                    area_code_id: null
                },
                pin_code: ''
            };
            var ticketBookingOrignal = angular.copy(ticketBookingInit);
            $scope.ticketBooking = angular.copy(ticketBookingOrignal);

            var param_id = $stateParams.id;

            if (!angular.isUndefined(param_id)) {
                consumptionTicket.query(globalFunction.generateUrlParams({
                    consumption_id: param_id
                }, {
                    consumption: {}
                })).$promise.then(function (data) {
                        var data = data[0];
                        if (!data) {
                            return;
                        }
                        $scope.sub_post_put = 'PUT';
                        ticketBookingOrignal = _.extend_exist(ticketBookingOrignal, data);

                        ticketBookingOrignal.id = data.id;
                        ticketBookingOrignal.consumption.id = data.consumption.id;
                        ticketBookingOrignal.consumption.status = data.consumption.status;
                        ticketBookingOrignal.show_date = $filter('parseDate')(data.show_date, 'yyyy-MM-dd');
                        ticketBookingOrignal.show_time = $filter('parseDate')(data.show_time, 'HH:mm');
                        ticketBookingOrignal.cost = $filter('parseTenThousandToYuan')(data.cost, false);
                        ticketBookingOrignal.sell = $filter('parseTenThousandToYuan')(data.sell, false);
                        ticketBookingOrignal.consumption.should_pay = $filter('parseTenThousandToYuan')(data.consumption.should_pay, false)
                        ticketBookingOrignal.consumption.shift_date = $filter('parseDate')(data.consumption.shift_date, 'yyyy-MM-dd');

                        ticketBookingOrignal.consumption.year_month = $filter('parseDate')(data.consumption.year_month, 'yyyy-MM');


                        $scope.agent_about.book_time = data.book_time;

                        $scope.agent_about.agent_code = data.agent_code;
                        $scope.agent_about.hall_name = data.hall_name;

                        $scope.ticketBooking = angular.copy(ticketBookingOrignal);
                        setTimeout(function () {
                            $scope.ticketBooking.consumption.should_pay = $filter('parseTenThousandToYuan')(data.consumption.should_pay, false)
                        }, 100);
                    })
            }

            $scope.$on('consumptionShiftDataChange', function (event) {
                ticketBookingInit.consumption.shift_date = $scope.$parent.global_params.shift_date;
                ticketBookingInit.consumption.year_month = $scope.$parent.global_params.year_month;
                ticketBookingInit.consumption.shift = $scope.$parent.global_params.shift;
                ticketBookingOrignal.consumption.shift_date = $scope.$parent.global_params.shift_date;
                ticketBookingOrignal.consumption.year_month = $scope.$parent.global_params.year_month;
                ticketBookingOrignal.consumption.shift = $scope.$parent.global_params.shift;
                $scope.ticketBooking.consumption.shift_date = $scope.$parent.global_params.shift_date;
                $scope.ticketBooking.consumption.year_month = $scope.$parent.global_params.year_month;
                $scope.ticketBooking.consumption.shift = $scope.$parent.global_params.shift;
            });

            // 户口编号
            $scope.$watch('agent_about.agent_code', globalFunction.debounce(function (new_value, old_value) {
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({
                        agent_code: new_value
                    }, {})).$promise.then(function (agent) {
                            if (agent.length > 0) {
                                $scope.agent_about.agent_name = agent[0].agent_name;
                                //$scope.ticketBooking.consumption.agent_info_id = agent[0].id;
                                $scope.ticketBooking.agent_info_id = agent[0].id;
                            } else {
                                $scope.ticketBooking.agent_info_id = "";
                                //$scope.ticketBooking.consumption.agent_info_id = "";
                                $scope.agent_about.agent_name = "";
                            }
                        });
                } else {
                    $scope.ticketBooking.agent_info_id = "";
                    //$scope.ticketBooking.consumption.agent_info_id = "";
                    $scope.agent_about.agent_name = "";
                }
            }));

            /*$scope.$on('consumptionHoteltravelQuery',function(event){
             setDefaultHotelTravelId();
             })
             var setDefaultHotelTravelId = function()
             {
             if($scope.default_hotel_travel_id && '2' == $scope.default_hotel_travel_type){
             ticketBookingInit.hotel_travel_id = $scope.default_hotel_travel_id;
             ticketBookingOrignal.hotel_travel_id = $scope.default_hotel_travel_id;
             $scope.ticketBooking.hotel_travel_id = $scope.default_hotel_travel_id;
             }
             };
             setDefaultHotelTravelId();*/

            $scope.ticket_agent_list = [];
            $scope.ticket_tel_list = [];
            $scope.$watch('ticketBooking.consumption.trader', globalFunction.debounce(function (new_value) {
                if (new_value && $scope.ticketBooking.agent_info_id) {
                    var list = _.findWhere($scope.ticket_agent_list, {
                        agent_guest_name: new_value
                    });
                    if (list) {
                        $scope.ticket_tel_list = list.guestTels;
                    } else {
                        agentGuest.query(globalFunction.generateUrlParams({
                            agent_guest_name: new_value + '!',
                            agent_info_id: $scope.ticketBooking.agent_info_id
                        }, {
                            guestTels: {},
                            idCards: {},
                            guestImages: {}
                        })).$promise.then(function (data) {
                                $scope.ticket_agent_list = data;
                            })
                    }
                } else {
                    $scope.ticket_agent_list = [];
                    $scope.ticket_tel_list = [];
                }
            }));

            $scope.$watch('ticketBooking.cost+ticketBooking.sell', function (new_value, old_value) {
                cal_totel();
            });

            $scope.$watch('ticketBooking.count', function (new_value, old_value) {
                cal_totel();
            });

            function cal_totel() {
                $scope.ticket_total.cost = $scope.ticketBooking.cost * $scope.ticketBooking.count;
                $scope.ticket_total.sell = $scope.ticketBooking.sell * $scope.ticketBooking.count;
                $scope.ticket_total.profit = $scope.ticket_total.sell - $scope.ticket_total.cost;
                if (!$scope.COPY_BOOKING_ticket) {
                    if ($scope.ticketBooking.sell != '' && $scope.ticketBooking.count != '') {
                        $scope.ticketBooking.consumption.should_pay = parseFloat(parseFloat($scope.ticket_total.sell).toFixed(4));
                    } else {
                        $scope.ticketBooking.consumption.should_pay = '';
                    }


                }
            }

            //生成备注 门票
            $scope.creatremark = function () {
                var areaCodes = ""
                if ($scope.ticketBooking.consumption.area_code_id) {
                    areaCodes = $filter("filter")($scope.areaCodes, {
                            "id": $scope.ticketBooking.consumption.area_code_id
                        })[0].area_code + "-"
                }
                if (!$scope.ticketBooking.ticket_type_id) {
                    topAlert.warning("門票類型不能為空！");
                    return;
                }
                $scope.ticketBooking.consumption.remark =
                    "門票類型：" + _.findWhere($scope.ticket_types, {
                        id: $scope.ticketBooking.ticket_type_id
                    }).ticket_type + "，數量：" + $scope.ticketBooking.count + "，訂票人：" + $scope.ticketBooking.consumption.trader + "，電話：" + areaCodes + ($scope.ticketBooking.consumption.trader_tel?$scope.ticketBooking.consumption.trader_tel:"")
            }
            $scope.add = function (hasSms) {
                var tmp_booking = angular.copy($scope.ticketBooking);

                if (tmp_booking.consumption.trader_tel != null && tmp_booking.consumption.trader_tel != "") {
                    if (tmp_booking.consumption.area_code_id == "" || tmp_booking.consumption.area_code_id == null) {
                        topAlert.warning("如填寫訂票人電話則電話區號不能為空");
                        return;
                    }
                }


                tmp_booking.pin_code = $scope.global_params.pin_code ? $scope.global_params.pin_code : tmp_booking.pin_code;

                tmp_booking.cost = $filter('parseYuanToTenThousand')(tmp_booking.cost, 6, true);
                tmp_booking.sell = $filter('parseYuanToTenThousand')(tmp_booking.sell, 6, true);
                tmp_booking.consumption.should_pay = $filter('parseYuanToTenThousand')(tmp_booking.consumption.should_pay, 6, true);
                tmp_booking.cost = $filter('parseYuan')(tmp_booking.cost, 2, true);
                tmp_booking.sell = $filter('parseYuan')(tmp_booking.sell, 2, true);
                tmp_booking.consumption.should_pay = $filter('parseYuan')(tmp_booking.consumption.should_pay, 2, true);
                tmp_booking.consumption.shift_date = $filter('date')(tmp_booking.consumption.shift_date, 'yyyy-MM-dd');
                tmp_booking.consumption.year_month = $filter('date')(tmp_booking.consumption.year_month, 'yyyy-MM');
                tmp_booking.show_date = $filter('date')(tmp_booking.show_date, 'yyyy-MM-dd');
                /*if('string'  == typeof(tmp_booking.show_time) ){
                 tmp_booking.show_time =tmp_booking.show_time.substring(11);
                 }else{
                 tmp_booking.show_time = $filter('date')(tmp_booking.show_time, 'HH:mm:ss');
                 }*/

                var sub_method = consumptionTicket.save;

                var ticket_type = _.where($scope.ticket_types, {
                    id: tmp_booking.ticket_type_id
                });
                var sms = {
                    send_time: "ticket",
                    agent_code: $scope.agent_about.agent_code,
                    agent_name: $scope.agent_about.agent_name,
                    ticket_type: ticket_type[0] ? ticket_type[0].ticket_type : "",
                    show_date: tmp_booking.show_date,
                    show_time: $filter('date')(tmp_booking.show_time, 'HH:mm:ss'),
                    site: "",
                    count: tmp_booking.count,
                    notify: {
                        trader: tmp_booking.consumption.trader,
                        area_code_id: tmp_booking.consumption.area_code_id,
                        trader_tel: tmp_booking.consumption.trader_tel
                    }
                };

                //ConsumptionSmsTemp.init(sms);

                var tis = "添加成功";
                if ('PUT' == $scope.sub_post_put) {
                    sub_method = consumptionTicket.update;
                    tis = "修改成功";
                    ConsumptionSmsTemp.destroy();
                }
                if ($scope.COPY_BOOKING_ticket) {
                    sub_method = consumptionTicket.save;
                    tis = "複製成功";
                    ConsumptionSmsTemp.destroy();
                }
                if ($scope.isDisabled) {
                    return;
                }
                $scope.isDisabled = true;

                $scope.form_ticket.checkValidity().then(function () {
                    sub_method(tmp_booking, function () {
                        topAlert.success(tis);
                        if ($scope.popupWindow) {
                            $modalInstance.close(" ");
                        }

                        var id = angular.copy($scope.ticketBooking.agent_info_id);

                        $scope.isDisabled = false;
                        $scope.form_ticket.clearErrors();
                        $scope.cancel();

                        //發送SMS
                        if (!$scope.ticketBooking.id && hasSms) {

                            ConsumptionSmsTemp.init(sms);
                            $location.path("share/share-send-sms/" + id);

                        } else {
                            $scope.ticket_search();
                        }
                    }, function () {
                        $scope.isDisabled = false;
                    });
                });
            }

            $scope.cancel = function () {
                $scope.sub_post_put = 'POST';
                $scope.agent_about = angular.copy(agent_about_init);
                $scope.ticketBooking = angular.copy(ticketBookingOrignal);
                if (!$scope.popupWindow) {
                    $location.path('/consumption-manager/consumption-manager/ticket');
                } else {
                    $modalInstance.dismiss();
                }


            }


        }
    ]).controller('consumptionTicketBookingDetailCtrls', ['$scope', '$location', '$stateParams', 'consumptionTicket', 'globalFunction', '$filter', '$window',
        function ($scope, $location, $stateParams, consumptionTicket, globalFunction, $filter, $window) {
            $scope.ticketBooking = {};
            var param_id = $stateParams.id;
            if (!angular.isUndefined(param_id)) {
                consumptionTicket.query(globalFunction.generateUrlParams({
                    consumption_id: param_id
                }, {
                    consumption: {}
                })).$promise.then(function (data) {
                        var data = data[0];
                        if (!data) {
                            return;
                        }
                        $scope.ticketBooking = data;
                    })
            }

            $scope.update = function () {
                $location.path('/consumption-manager/consumption-manager/ticket/consumption-admission-ticket-booking-update/' + param_id);
            }

            $scope.cancel = function () {
                //$location.path('/consumption-manager/consumption-manager/ticket');
                $window.history.back();
            }


        }
    ]).controller('consumptionOtherBookingUpdateCtrls', ['$scope', '$location', '$stateParams', 'consumptionMiscellaneous', 'globalFunction', 'agentsLists', 'topAlert', 'miscellaneousType', '$filter', 'agentGuest', 'shiftMark', 'pinCodeUserName', 'isSendSmsModal', 'shiftMarks', 'idcardType', 'areaCode', 'consumptionPaytype', '$modalInstance', 'ConsumptionSmsTemp',
        function ($scope, $location, $stateParams, consumptionMiscellaneous, globalFunction, agentsLists, topAlert, miscellaneousType, $filter, agentGuest, shiftMark, pinCodeUserName, isSendSmsModal, shiftMarks, idcardType, areaCode, consumptionPaytype, $modalInstance, ConsumptionSmsTemp) {
            //雜項
            $scope.popupWindow = false;
            if (!$scope.global_params) {
                $scope.popupWindow = true
                $scope.global_params = {};
                $scope.shiftLists = shiftMarks
                $scope.idCardtypes = idcardType.query();
                $scope.areaCodes = areaCode.query();
                $scope.pay_types = [];
                consumptionPaytype.query().$promise.then(function (data) // 支付方式
                {
                    _.each(data, function ($that, $key) {
                        if ('COMMISSION' == $that.pay_type_code || 'COMSUMPTION' == $that.pay_type_code) {
                            $scope.pay_types.push($that);
                        }
                    })
                });
            }
            $scope.COPY_BOOKING_other = -1 != ($location.$$url).indexOf('other-booking-copy');
            $scope.sub_post_put = 'POST';
            $scope.other_url = globalFunction.getApiUrl('consumption/consumptionmiscellaneous');
            $scope.isDisabled = false;

            var agent_about_init = {
                agent_code: "",
                agent_name: "",
                hall_name: "",
                username: ""
            }
            $scope.other_total = {
                cost: 0,
                sell: 0,
                profit: 0
            }
            $scope.agent_about = angular.copy(agent_about_init);
            var otherBookingInit = {
                agent_info_id: "",
                count: "1",
                cost: "",
                sell: "",
                consumption_content: "",
                consumption: {
                    //agent_info_id: "",
                    book_no: "",
                    pay_type_id: $scope.default_pay_type_id,
                    trader: "",
                    trader_tel: "",
                    remark: "",
                    should_pay: "",
                    shift_date: $scope.global_params.shift_date,
                    year_month: $scope.global_params.year_month,
                    shift: $scope.global_params.shift,
                    area_code_id: null
                },
                pin_code: ''
            };
            var otherBookingOrignal = angular.copy(otherBookingInit);
            $scope.otherBooking = angular.copy(otherBookingOrignal);

            var param_id = $stateParams.id;

            if (!angular.isUndefined(param_id)) {
                consumptionMiscellaneous.query(globalFunction.generateUrlParams({
                    consumption_id: param_id
                }, {
                    consumption: {},
                    consumptionHelicopterSubs: {}
                })).$promise.then(function (data) {
                        var data = data[0];
                        if (!data) {
                            return;
                        }
                        $scope.sub_post_put = 'PUT';
                        otherBookingOrignal = _.extend_exist(otherBookingOrignal, data);

                        otherBookingOrignal.id = data.id;
                        otherBookingOrignal.consumption.id = data.consumption.id;
                        otherBookingOrignal.consumption.status = data.consumption.status;

                        otherBookingOrignal.cost = $filter('parseTenThousandToYuan')(data.cost, false);
                        otherBookingOrignal.sell = $filter('parseTenThousandToYuan')(data.sell, false);
                        otherBookingOrignal.consumption.should_pay = $filter('parseTenThousandToYuan')(data.consumption.should_pay, false)
                        otherBookingOrignal.consumption.shift_date = $filter('parseDate')(data.consumption.shift_date, 'yyyy-MM-dd');
                        otherBookingOrignal.consumption.year_month = $filter('parseDate')(data.consumption.year_month, 'yyyy-MM');


                        $scope.agent_about.book_time = data.book_time;

                        $scope.agent_about.agent_code = data.agent_code;
                        $scope.agent_about.hall_name = data.hall_name;

                        $scope.otherBooking = angular.copy(otherBookingOrignal);
                        setTimeout(function () {
                            $scope.otherBooking.consumption.should_pay = $filter('parseTenThousandToYuan')(data.consumption.should_pay, false)
                        }, 100);
                    })
            }

            $scope.$on('consumptionShiftDataChange', function (event) {
                otherBookingInit.consumption.shift_date = $scope.$parent.global_params.shift_date;
                otherBookingInit.consumption.year_month = $scope.$parent.global_params.year_month;
                otherBookingInit.consumption.shift = $scope.$parent.global_params.shift;
                otherBookingOrignal.consumption.shift_date = $scope.$parent.global_params.shift_date;
                otherBookingOrignal.consumption.year_month = $scope.$parent.global_params.year_month;
                otherBookingOrignal.consumption.shift = $scope.$parent.global_params.shift;
                $scope.otherBooking.consumption.shift_date = $scope.$parent.global_params.shift_date;
                $scope.otherBooking.consumption.year_month = $scope.$parent.global_params.year_month;
                $scope.otherBooking.consumption.shift = $scope.$parent.global_params.shift;
            });

            // 户口编号
            $scope.$watch('agent_about.agent_code', globalFunction.debounce(function (new_value, old_value) {
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({
                        agent_code: new_value
                    }, {})).$promise.then(function (agent) {
                            if (agent.length > 0) {
                                $scope.agent_about.agent_name = agent[0].agent_name;
                                //$scope.otherBooking.consumption.agent_info_id = agent[0].id;
                                $scope.otherBooking.agent_info_id = agent[0].id;
                            } else {
                                $scope.otherBooking.agent_info_id = "";
                                //$scope.otherBooking.consumption.agent_info_id = "";
                                $scope.agent_about.agent_name = "";
                            }
                        });
                } else {
                    $scope.otherBooking.agent_info_id = "";
                    //$scope.otherBooking.consumption.agent_info_id = "";
                    $scope.agent_about.agent_name = "";
                }
            }));

            $scope.$watch('otherBooking.cost+otherBooking.sell', function (new_value, old_value) {
                cal_totel();
            });

            $scope.$watch('otherBooking.count', function (new_value, old_value) {
                cal_totel();
            });


            $scope.other_agent_list = [];
            $scope.other_tel_list = [];
            $scope.$watch('otherBooking.consumption.trader', globalFunction.debounce(function (new_value) {
                if (new_value && $scope.otherBooking.agent_info_id) {
                    var list = _.findWhere($scope.other_agent_list, {
                        agent_guest_name: new_value
                    });
                    if (list) {
                        $scope.other_tel_list = list.guestTels;
                    } else {
                        agentGuest.query(globalFunction.generateUrlParams({
                            agent_guest_name: new_value + '!',
                            agent_info_id: $scope.otherBooking.agent_info_id
                        }, {
                            guestTels: {},
                            idCards: {},
                            guestImages: {}
                        })).$promise.then(function (data) {
                                $scope.other_agent_list = data;
                            })
                    }
                } else {
                    $scope.other_agent_list = [];
                    $scope.other_tel_list = [];
                }
            }));

            function cal_totel() {
                $scope.other_total.cost = $scope.otherBooking.cost * $scope.otherBooking.count;
                $scope.other_total.sell = $scope.otherBooking.sell * $scope.otherBooking.count;
                $scope.other_total.profit = $scope.other_total.sell - $scope.other_total.cost;
                if (!$scope.COPY_BOOKING_othert) {
                    if ($scope.otherBooking.sell != '' && $scope.otherBooking.count != '') {
                        $scope.otherBooking.consumption.should_pay =parseFloat(parseFloat($scope.other_total.sell).toFixed(4));
                    } else {
                        $scope.otherBooking.consumption.should_pay = '';
                    }
                }
            }

            $scope.add = function (hasSms) {
                var tmp_booking = angular.copy($scope.otherBooking);

                if (tmp_booking.consumption.trader_tel != null && tmp_booking.consumption.trader_tel != "") {
                    if (tmp_booking.consumption.area_code_id == "" || tmp_booking.consumption.area_code_id == null) {
                        topAlert.warning("如填寫訂購人電話則電話區域不能為空");
                        return;
                    }
                }


                tmp_booking.pin_code = $scope.global_params.pin_code ? $scope.global_params.pin_code : tmp_booking.pin_code;

                tmp_booking.cost = $filter('parseYuanToTenThousand')(tmp_booking.cost, 6, true);
                tmp_booking.sell = $filter('parseYuanToTenThousand')(tmp_booking.sell, 6, true);
                tmp_booking.consumption.should_pay = $filter('parseYuanToTenThousand')(tmp_booking.consumption.should_pay, 6, true);
                tmp_booking.cost = $filter('parseYuan')(tmp_booking.cost, 2, true);
                tmp_booking.sell = $filter('parseYuan')(tmp_booking.sell, 2, true);
                tmp_booking.consumption.should_pay = $filter('parseYuan')(tmp_booking.consumption.should_pay, 2, true);
                tmp_booking.consumption.shift_date = $filter('date')(tmp_booking.consumption.shift_date, 'yyyy-MM-dd');
                tmp_booking.consumption.year_month = $filter('date')(tmp_booking.consumption.year_month, 'yyyy-MM');
                var sub_method = consumptionMiscellaneous.save;
                var tis = "添加成功";
                if ('PUT' == $scope.sub_post_put) {
                    sub_method = consumptionMiscellaneous.update;
                    tis = "修改成功";
                }
                if ($scope.COPY_BOOKING_other) {
                    sub_method = consumptionMiscellaneous.save;
                    tis = "複製成功";
                }
                if ($scope.isDisabled) {
                    return;
                }
                $scope.isDisabled = true;

                $scope.form_other.checkValidity().then(function () {
                    sub_method(tmp_booking, function () {
                        topAlert.success(tis);
                        if ($scope.popupWindow) {
                            $modalInstance.close(" ");
                        }


                        var id = angular.copy($scope.otherBooking.agent_info_id);

                        $scope.isDisabled = false;

                        $scope.form_other.clearErrors();
                        $scope.cancel();

                        //發送SMS
                        if (!$scope.otherBooking.id && hasSms) {
                            var sms = {
                                send_time: "other",
                                agent_code: $scope.agent_about.agent_code,
                                agent_name: $scope.agent_about.agent_name,
                                notify: {
                                    trader: tmp_booking.consumption.trader,
                                    area_code_id: tmp_booking.consumption.area_code_id,
                                    trader_tel: tmp_booking.consumption.trader_tel
                                }
                            };
                            ConsumptionSmsTemp.init(angular.copy(sms));
                            $location.path("share/share-send-sms/" + id);

                        } else {
                            $scope.other_search();
                        }


                    }, function () {
                        $scope.isDisabled = false;
                    });
                });
            }

            $scope.cancel = function () {
                $scope.sub_post_put = 'POST';
                $scope.agent_about = angular.copy(agent_about_init);
                $scope.otherBooking = angular.copy(otherBookingOrignal);
                if (!$scope.popupWindow) {
                    $location.path('/consumption-manager/consumption-manager/other');
                } else {
                    $modalInstance.dismiss();
                }

            }
        }
    ]).controller('consumptionOtherBookingDetailCtrls', ['$scope', '$location', '$stateParams', 'globalFunction', 'consumptionMiscellaneous', '$window',
        function ($scope, $location, $stateParams, globalFunction, consumptionMiscellaneous, $window) {
            $scope.otherBooking = {};
            var param_id = $stateParams.id;
            if (!angular.isUndefined(param_id)) {
                consumptionMiscellaneous.query(globalFunction.generateUrlParams({
                    consumption_id: param_id
                }, {
                    consumption: {}
                })).$promise.then(function (data) {
                        $scope.otherBooking = data[0];
                        var miscellaneous = _.findWhere($scope.miscellaneousTypes, {
                            id: $scope.otherBooking.miscellaneous_type_id
                        })
                        if (miscellaneous) {
                            $scope.otherBooking.miscellaneous_type = miscellaneous.miscellaneous_type;
                        }

                    })
            }

            $scope.update = function () {
                $location.path('/consumption-manager/consumption-manager/other/consumption-other-booking-update/' + param_id);
            }

            $scope.cancel = function () {
                //$location.path('/consumption-manager/consumption-manager/other');
                $window.history.back();
            }

        }
    ]).controller('consumptionSummaryCtrl', ['$scope', 'getConsumption', 'consumptionType', 'tmsPagination', 'breadcrumb', '$filter', '$modal', '$log', 'currentShift', 'user',
        function ($scope, getConsumption, consumptionType, tmsPagination, breadcrumb, $filter, $modal, $log, currentShift, user) {
            breadcrumb.items = [{
                "name": "消費匯總",
                "active": true
            }];

            //$scope.halls = hallName.query({hall_type : 2}); // 厅馆
            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function (hall) {
                return hall.hall_type != 1;
            });

            //$scope.halls = hallName.query();
            $scope.consumptionSummarys = [];

            var init_condition = {
                hall_id: "",
                agent_code: "",
                shift_date: [currentShift.data.shift_date, currentShift.data.shift_date],
                year_month: currentShift.data.year_month
            }

            $scope.excel_condition = {
                halls: [{
                    id: user.hall.id,
                    name: user.hall.hall_name
                }],
                agent_group_name: "",
                agent_code: "",
                book_time: [currentShift.data.shift_date, currentShift.data.shift_date],
                year_month: currentShift.data.year_month //currentShift.data.year_month ? currentShift.data.year_month :"",
            };
            $scope.condition = angular.copy(init_condition);

            //列表初始化数据
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = getConsumption;
            $scope.pagination.query_method = "getConsumptionList";
            $scope.select = function (page) {
                var kindSum = 0;
                $scope.consumptionKindSum = {
                    type0: 0,
                    type1: 0,
                    type2: 0,
                    type3: 0,
                    type4: 0,
                    type5: 0,
                    type6: 0,
                    type7: 0,
                    allshould_pay: 0
                };
                $scope.condition.shift_date[0] = $filter('date')($scope.condition.shift_date[0], 'yyyy-MM-dd');
                $scope.condition.shift_date[1] = $filter('date')($scope.condition.shift_date[1], 'yyyy-MM-dd');
                $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : '';
                $scope.excel_condition.book_time[0] = $scope.condition.shift_date[0];
                $scope.excel_condition.book_time[1] = $scope.condition.shift_date[1];
                $scope.excel_condition.year_month = $scope.condition.year_month;
                $scope.excel_condition.agent_group_name = $scope.condition.agent_code;
                $scope.condition_copy = angular.copy($scope.condition);
                $scope.condition_copy.year_month = $scope.condition_copy.year_month ? $scope.condition_copy.year_month + "-01" : "";
                if ($scope.condition.hall_id) {
                    $scope.excel_condition.halls[0].id = $scope.condition.hall_id;
                    $scope.hall = _.findWhere(JSON.parse(sessionStorage.getItem("halls")), {
                        id: $scope.condition.hall_id
                    });
                    $scope.excel_condition.halls[0].name = $scope.hall.hall_name;
                }
                $scope.pagination.select(page, $scope.condition_copy).$promise.then(function (data) {
                    $scope.consumptionSummarys = data;
                    /*xubangwei 消费合计 start*/
                    angular.forEach($scope.consumptionSummarys, function (datas) {
                        $scope.consumptionKindSum.type0 += (+datas.type0);
                        $scope.consumptionKindSum.type1 += (+datas.type1);
                        $scope.consumptionKindSum.type2 += (+datas.type2);
                        $scope.consumptionKindSum.type3 += (+datas.type3);
                        $scope.consumptionKindSum.type4 += (+datas.type4);
                        $scope.consumptionKindSum.type5 += (+datas.type5);
                        $scope.consumptionKindSum.type6 += (+datas.type6);
                        $scope.consumptionKindSum.type7 += (+datas.type7);
                        $scope.consumptionKindSum.allshould_pay += (+datas.should_pay);
                    });
                    /*xubangwei 消费合计 end*/
                })

            }
            $scope.select();
            $scope.reset = function () {
                $scope.condition = angular.copy(init_condition);
                $scope.select();
            }

            //消費類型
            $scope.consumptionTypes = consumptionType.query({
                sort: "consumption_type ASC"
            });


            //根據不同參數顯示不同的消費記錄
            $scope.consumptionRecord = function (agent_info_id, type) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/consumption-manager/consumption-summary-detail.html",
                    controller: 'consumptionSummaryDetailCtrl',
                    windowClass: 'lg-modal',
                    resolve: {
                        agent_info_id: function () {
                            return agent_info_id;
                        },
                        type: function () {
                            return type;
                        },
                        condition: function () {
                            return $scope.condition;
                        }
                    }
                });
                modalInstance.result.then((function (message) {

                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });

            }


        }
    ]).controller('consumptionSummaryDetailCtrl', ['$scope', 'getConsumption', 'tmsPagination', 'agent_info_id', 'type', '$modalInstance', 'bookingState', 'condition', '$filter',
        function ($scope, getConsumption, tmsPagination, agent_info_id, type, $modalInstance, bookingState, condition, $filter) {

            $scope.bookingState_items = bookingState.items;
            $scope.titles = {
                "HOTEL": "酒店",
                "HELICOPTER": "直升機",
                "BOAT": "船飛",
                "FOODCOUPON": "食飛",
                "CAR": "車輛",
                "FLIGHT": "機票",
                "TICKET": "門票",
                "MISCELLANEOUS": "雜項"
            }
            $scope.title = $scope.titles[type];

            $scope.condition = {
                consumptionType: {
                    consumption_code: type
                },
                agent_info_id: agent_info_id,
                hall_id: condition.hall_id,
                shift_date: [$filter('date')(condition.shift_date[0], 'yyyy-MM-dd'), $filter('date')(condition.shift_date[1], 'yyyy-MM-dd')],
                year_month: angular.isString(condition.year_month) && condition.year_month != '' ? condition.year_month + '-01' : $filter('date')(condition.year_month, 'yyyy-MM-dd')
            }

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = getConsumption;
            $scope.select = function (page) {
                $scope.consumptions = $scope.pagination.select(page, $scope.condition);
            }
            $scope.select();


            $scope.close = function () {
                $modalInstance.close();
            }


        }
    ]).controller('GetHotelRoomNumerCtrl', ['$scope', 'globalFunction', 'topAlert', '$modalInstance', 'Room_no',
        function ($scope, globalFunction, topAlert, $modalInstance, Room_no) {

            $scope.hotel = {
                number: Room_no
            }

            $scope.add = function () {
                $modalInstance.close($scope.hotel);
            };

            $scope.cancel = function () {
                $modalInstance.close(false);
            };
        }
    ]).controller('GetRoomConsumptionCtrl', ['$scope', 'globalFunction', 'topAlert', '$modalInstance', 'dayType', 'consumptionHotelSubs', 'pay_types', 'shiftLists', 'Room_no', '$filter', 'consumptionHotel', 'shiftDefaultDate',
        function ($scope, globalFunction, topAlert, $modalInstance, dayType, consumptionHotelSubs, pay_types, shiftLists, Room_no, $filter, consumptionHotel, shiftDefaultDate) {

            $scope.day_types = dayType.items;
            $scope.consumptionHotelSubs = consumptionHotelSubs;
            $scope.pay_types = pay_types;
            $scope.shiftLists = shiftLists;
            $scope.Room_no = Room_no;

            $scope.sub_post_put = 'POST';
            $scope.consumptionhotelSubs_url = globalFunction.getApiUrl('consumption/consumptionhotelsub/validate-hotel-sub');


            _.each($scope.consumptionHotelSubs, function ($that, $key) {
                $scope.consumptionHotelSubs[$key]['shift_date'] = $that.shift_date ? $that.shift_date : $that.day;
                $scope.consumptionHotelSubs[$key]['shift'] = $that.shift ? $that.shift : shiftDefaultDate.shift;
                $scope.consumptionHotelSubs[$key]['pay_type_id'] = $that.pay_type_id ? $that.pay_type_id : '0493728BB8AC06C6E0539715A8C0267D';
            });

            $scope.isDisabled = false;
            $scope.add = function () {
                var tmp_subs = [];
                var subs = angular.copy($scope.consumptionHotelSubs);
                _.each(subs, function ($that, $key) {
                    if (!!$that["should_pay"] && 0 != $that["should_pay"]) {
                        tmp_subs[$key] = {
                            shift_date: $that["shift_date"] ? $filter('date')($that["shift_date"], 'yyyy-MM-dd') : "",
                            year_month: $that["year_month"] ? $filter('date')($that["year_month"], 'yyyy-MM') : "",
                            pay_type_id: $that["pay_type_id"] ? $that["pay_type_id"] : "",
                            shift: $that["shift"] ? $that["shift"] : "",
                            should_pay: $that["should_pay"] ? $filter('parseYuanToTenThousand')($that["should_pay"], false) : ""
                        }

                        subs[$key]["shift_date"] = $that["shift_date"] ? $filter('date')($that["shift_date"], 'yyyy-MM-dd') : "";
                        subs[$key]["year_month"] = $that["year_month"] ? $filter('date')($that["year_month"], 'yyyy-MM') : "";
                        subs[$key]["pay_type_id"] = $that["pay_type_id"] ? $that["pay_type_id"] : "";
                        subs[$key]["shift"] = $that["shift"] ? $that["shift"] : "";
                    } else {
                        tmp_subs[$key] = {
                            shift_date: "",
                            pay_type_id: "",
                            shift: "",
                            should_pay: 0
                        }

                        subs[$key]["shift_date"] = "";
                        subs[$key]["pay_type_id"] = "";
                        subs[$key]["shift"] = "";
                    }


                });
                if ($scope.isDisabled) {
                    return;
                }
                $scope.isDisabled = true;

                $scope.form_hotel_sub.checkValidity().then(function () {
                    consumptionHotel.validateHotelSub({
                        consumptionHotelSubs: tmp_subs
                    }, function () {
                        //topAlert.success("添加房間消費成功");
                        $scope.isDisabled = false;
                        $scope.form_hotel_sub.clearErrors();
                        $modalInstance.close(subs);
                    }, function () {
                        $scope.isDisabled = false;
                    });
                });


                //$modalInstance.close($scope.consumptionHotelSubs);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss(false);
            };
        }
    ]).controller('GetCheckModeConsumptionCtrl', ['$scope', 'globalFunction', 'topAlert', '$modalInstance', 'dayType', 'consumptionHotelSubs', 'pay_types', 'shiftLists', 'Room_no', '$filter', 'consumptionHotel', 'shiftDefaultDate',
        function ($scope, globalFunction, topAlert, $modalInstance, dayType, consumptionHotelSubs, pay_types, shiftLists, Room_no, $filter, consumptionHotel, shiftDefaultDate) {

            $scope.day_types = dayType.items;
            $scope.consumptionHotelSubs = consumptionHotelSubs;
            $scope.shiftLists = shiftLists;

            $scope.sub_post_put = 'POST';
            $scope.consumptionhotelSubs_url = globalFunction.getApiUrl('consumption/consumptionhotelsub/validate-hotel-sub');


            _.each($scope.consumptionHotelSubs, function ($that, $key) {
                $scope.consumptionHotelSubs[$key]['shift_date_sub'] = $that.shift_date_sub ? $that.shift_date_sub : $that.day;
                $scope.consumptionHotelSubs[$key]['shift_sub'] = $that.shift_sub ? $that.shift_sub : shiftDefaultDate.shift;
                $scope.consumptionHotelSubs[$key]['year_month'] = $that.year_month ? $filter('date')($that.year_month, 'yyyy-MM') : shiftDefaultDate.year_month;
            });

            $scope.isDisabled = false;
            $scope.add = function () {
                var tmp_subs = [];
                var subs = angular.copy($scope.consumptionHotelSubs);
                $modalInstance.close(subs);
                /*$scope.isDisabled = true;

                 $scope.form_hotel_check_mode_sub.checkValidity().then(function()
                 {
                 consumptionHotel.validateHotelSub({consumptionHotelSubs : tmp_subs}, function() {
                 //topAlert.success("添加房間消費成功");
                 $scope.isDisabled = false;
                 $scope.form_hotel_sub.clearErrors();
                 $modalInstance.close(subs);
                 }, function()
                 {
                 $scope.isDisabled = false;
                 });
                 });*/
                //$modalInstance.close($scope.consumptionHotelSubs);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss(false);
            };
        }
    ]).controller('RoomConsumptionDetailCtrl', ['$scope', 'globalFunction', 'topAlert', '$modalInstance', 'dayType', 'consumptionHotelSubs', '$filter', 'consumptionHotel',
        function ($scope, globalFunction, topAlert, $modalInstance, dayType, consumptionHotelSubs, $filter) {

            $scope.day_types = dayType.items;
            $scope.consumptionHotelSubs = consumptionHotelSubs;
            $scope.view_type = "detail";

            $scope.sub_post_put = 'POST';
            $scope.consumptionhotelSubs_url = globalFunction.getApiUrl('consumption/consumptionhotelsub/validate-hotel-sub');

            $scope.cancel_detail = function () {
                $modalInstance.close(false);
            };
        }
    ]).controller('consumptionTransferCtrl', ['$scope', 'topAlert', 'agentsLists', 'globalFunction', 'tmsPagination', 'consumption', 'breadcrumb', 'consumptionType', '$filter', 'getConsumption', 'bookingState',
        function ($scope, topAlert, agentsLists, globalFunction, tmsPagination, consumption, breadcrumb, consumptionType, $filter, getConsumption, bookingState) {
            breadcrumb.items = [{
                "name": "消費過賬",
                "active": true
            }];

            $scope.bookingState_items = bookingState.items;
            ;
            $scope.consumptionTypes = consumptionType.query();
            $scope.consumptions = [];
            var original;
            var init_condition = {
                consumption_type_id: "",
                agent_code: "",
                // search_type: 1,
                status: '0',
                year_month: $filter('date')(new Date(), 'yyyy-MM'),
                sort: 'book_time DESC,book_no DESC'
            }
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = consumption;
            $scope.pagination.query_method = 'get-consumption-record';
            $scope.select = function (page) {

                var condition_copy = angular.copy($scope.condition);
                condition_copy.year_month = condition_copy.year_month ? $filter('date')(condition_copy.year_month, 'yyyy-MM') + "-01" : "";
                $scope.consumptions = $scope.pagination.select(page, condition_copy, {});
                $scope.check_false_IDS = _.pluck($scope.check_agent_false, 'id');
                $scope.check_true_IDS = _.pluck($scope.check_agent_true, 'id');

                $scope.consumptions.$promise.then(function (consumptions) {
                    _.each(consumptions, function (ld) {
                        if ($scope.select_status == 1) {
                            if ($scope.check_false_IDS.length > 0) {
                                if ($scope.check_false_IDS.indexOf(ld.id) == -1) {
                                    ld.selected = true;
                                } else {
                                    ld.selected = false;
                                }
                            } else {
                                ld.selected = true;
                            }
                        } else {
                            if ($scope.check_true_IDS.length > 0) {
                                if ($scope.check_true_IDS.indexOf(ld.id) >= 0) {
                                    ld.selected = true;
                                } else {
                                    ld.selected = false;
                                }
                            } else {
                                ld.selected = false;
                            }
                        }
                    });
                });
            }
            $scope.search = function () {
                if (!$scope.condition.agent_code) {
                    topAlert.warning("請填寫正確的戶口編號！");
                    return;
                }
                $scope.check_agent_true = [];
                $scope.check_agent_false = [];
                $scope.select();
            }
            $scope.reset = function () {
                $scope.condition = angular.copy(original);
                $scope.select();
            }

            $scope.select_check_false = function () {
                var condition_copy = angular.copy($scope.condition);
                condition_copy.year_month = condition_copy.year_month ? $filter('date')(condition_copy.year_month, 'yyyy-MM') : "";
                $scope.consumptions = $scope.pagination.select(1, condition_copy, {});
            }

            //選中轉移的消費記錄
            $scope.select_status = 0; //0：取消 1：全選
            $scope.check1 = {
                all2: ""
            };
            //选中值数组
            $scope.check_agent_true = [{
                id: ""
            }];
            //未选中值数组
            $scope.check_agent_false = [{
                id: ""
            }];
            $scope.check_agent_true.splice(0, 1);
            $scope.check_agent_false.splice(0, 1);
            //全选取消按钮事件
            $scope.check_all2 = function () {
                if ($scope.check1.all2) {
                    $scope.select_status = 0;
                    _.each($scope.consumptions, function (ld) {
                        ld.selected = false;
                    });
                    $scope.check_agent_true = [];
                    $scope.check_agent_false = [];
                } else {
                    $scope.select_status = 1;
                    _.each($scope.consumptions, function (ld) {
                        ld.selected = true;
                        $scope.check_one(ld);
                    });

                }


            }
            //单个复选框选中取消
            $scope.check_one = function (ld) {

                if ($scope.select_status == 1) {
                    if (ld.selected) {
                        $scope.check_agent_false.push({
                            id: ld.id
                        });
                    } else {
                        $scope.check_agent_false.splice(_.pluck($scope.check_agent_false, 'id').indexOf(ld.id), 1);
                    }
                } else {
                    if (ld.selected) {
                        $scope.check_agent_true.splice(_.pluck($scope.check_agent_true, 'id').indexOf(ld.id), 1);
                    } else {
                        $scope.check_agent_true.push({
                            id: ld.id
                        });
                    }
                }
            }
            //轉入戶口
            var init_consumption_transfer = {
                "in_agent_id": "",
                "out_agent_id": "",
                "consumptionIds": [],
                "is_all_select": "",
                "remark": "",
                "pin_code": ""
            }
            $scope.consumption_transfer = angular.copy(init_consumption_transfer);

            //轉入戶口
            var int_new_consumption_transfer = {
                in_agent_code: ""
            }
            $scope.new_consumption_transfer = angular.copy(int_new_consumption_transfer);

            //提交
            $scope.transfer_url = globalFunction.getApiUrl('consumption/consumption/consumption-transfer');
            $scope.add = function () {
                var conditions = angular.copy($scope.condition);
                conditions.year_month = conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy-MM') : "";
                conditions.agent_info_id = $scope.consumption_transfer.out_agent_id;
                $scope.consumption_transfer.is_all_select = $scope.select_status;
                if ($scope.consumption_transfer.is_all_select == 0) {
                    $scope.check_agent_true_ids = _.pluck($scope.check_agent_true, 'id');
                } else {
                    $scope.check_agent_true_ids = _.pluck($scope.check_agent_false, 'id');
                }
                $scope.consumption_transfer.consumptionIds = $scope.check_agent_true_ids;
                if ($scope.consumption_transfer.is_all_select == 0 && $scope.consumption_transfer.consumptionIds.length == 0) {
                    topAlert.warning("請選擇要轉移的戶口!");
                    return;
                }
                if ($scope.isDesabled) {
                    return;
                }
                $scope.isDesabled = true;
                $scope.consumption_transfer.is_all_select = 0;
                $scope.form_transfer.checkValidity().then(function () {
                    getConsumption.consumptionTransfer(globalFunction.generateUrlParams(conditions), $scope.consumption_transfer).$promise.then(function () {
                        topAlert.success('消費過賬成功');
                        $scope.check1.all2 = false;
                        $scope.check_agent_false = [];
                        $scope.check_agent_true = [];
                        $scope.select_status = 0;
                        $scope.cancel();
                        $scope.select_check_false();
                        $scope.isDesabled = false;
                    }, function () {
                        $scope.isDesabled = false;
                    });
                });
            }

            $scope.cancel = function () {
                $scope.consumption_transfer.consumptionIds = [];
                $scope.consumption_transfer.is_all_select = "";
                $scope.consumption_transfer.remark = "";
                $scope.consumption_transfer.pin_code = "";
                $scope.new_consumption_transfer.in_agent_code = "";
            }
            //監控轉出agent_code
            $scope.$watch('condition.agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.out_agent_name = "";
                $scope.consumption_transfer.out_agent_id = "";
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({
                        agent_code: new_value
                    }, {})).$promise.then(function (agent) {
                            if (agent.length > 0) {
                                $scope.out_agent_name = agent[0].agent_name;
                                $scope.consumption_transfer.out_agent_id = agent[0].id
                            }
                        });
                }
            }));
            //監控轉入agent_code
            $scope.$watch('new_consumption_transfer.in_agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.consumption_transfer_agent_name = "";
                $scope.consumption_transfer.in_agent_id = "";
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({
                        agent_code: new_value
                    }, {})).$promise.then(function (agent) {
                            if (agent.length > 0) {
                                $scope.consumption_transfer_agent_name = agent[0].agent_name;
                                $scope.consumption_transfer.in_agent_id = agent[0].id;
                            }
                        });
                }
            }));


        }
    ]);

}).call(this);
