/**
 * Created by Allen.zhang on 2014/8/21.
 */


(function () {
    'use strict';
    angular.module('app.scene.ctrls', ['app.scene.services', 'app.scene.json']).controller('sceneShiftRecordCtrl', [
        '$scope', '$filter', '$modal', '$log', 'getDate', '$location', 'breadcrumb', 'globalFunction', 'tmsPagination', 'hallName', 'sceneShiftRecord', 'pinCodeModal',
        function ($scope, $filter, $modal, $log, getDate, $location, breadcrumb, globalFunction, tmsPagination, hallName, sceneShiftRecord, pinCodeModal) {

            breadcrumb.items = [
                {"name": "場面截數", "active": true}
            ];

            var init_condition = {
                hall_id: "",
                shift_date: ["", ""]
            }
            $scope.condition = angular.copy(init_condition);

            //所有廳
            $scope.halls = hallName.query();
            //當前廳
            hallName.getHall().$promise.then(function (hall) {
                $scope.condition.hall_id = hall.id;
            });

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = sceneShiftRecord;
            $scope.select = function (page) {
                $scope.condition_copy = angular.copy($scope.condition);
                if ($scope.condition.shift_date[0]) {
                    $scope.condition_copy.shift_date[0] = $filter('date')($scope.condition.shift_date[0], 'yyyy-MM-dd');
                }
                if ($scope.condition.shift_date[1]) {
                    $scope.condition_copy.shift_date[1] = $filter('date')($scope.condition.shift_date[1], 'yyyy-MM-dd');
                }
                if ($scope.condition.hall_id == "0493728BB89506C6E0539715A8C0267D") {
                    $scope.condition_copy.hall_id = "";
                }
                $scope.sceneShiftRecords = $scope.pagination.select(page, $scope.condition_copy);
            }
            $scope.select();

            //截數
            /*$scope.shift = function(){
             var modalInstance;
             modalInstance = $modal.open({
             templateUrl: "views/scene/scene-confirm.html",
             controller: 'sceneConfirmCtrl',
             windowClass:'sm-modal',
             resolve: {
             shift_data:function() {
             return  $scope.shift_data
             }
             }
             });
             modalInstance.result.then(function(shift_data) {
             $scope.select();
             });
             }*/

            $scope.reset = function () {
                $scope.condition = angular.copy(init_condition);
                hallName.getHall().$promise.then(function (hall) {
                    $scope.condition.hall_id = hall.id;
                });
                //$scope.form_searchSceneRecord.$setPristine();
                $scope.select();
            }

            //截數或者重新截數
            $scope.cutOff = function (scene_shift_record_id) {
                if (scene_shift_record_id && scene_shift_record_id != "") {
                    pinCodeModal(sceneShiftRecord, 'save', {scene_shift_record_id: scene_shift_record_id}, '重新截數成功！').then(function () {
                        $scope.select();
                    });
                } else {
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/scene/scene-shift-window.html",
                        controller: 'sceneShiftCtrl',
                        windowClass: 'sm-modal'
                    });
                    modalInstance.result.then(function () {
                        $scope.select();
                    });
                }
            }

        }]).controller('sceneShiftCtrl', ['$scope', 'topAlert', '$modalInstance', 'sceneShiftRecord', 'currentShift',
        function ($scope, topAlert, $modalInstance, sceneShiftRecord, currentShift) {

            $scope.sceneShiftAmount = sceneShiftRecord.sceneShiftAmount();
            $scope.record = {
                pin_code: ""
            }

            $scope.isDesabled = false;
            $scope.submit = function () {
                if ($scope.isDesabled) {
                    return;
                }
                $scope.isDesabled = true;
                sceneShiftRecord.save($scope.record).$promise.then(function (shift) {
                    $scope.isDesabled = false;
                    topAlert.success("截更成功");
                    $modalInstance.close();
                    currentShift.set(shift)
                }, function () {
                    $scope.isDesabled = false;
                });
            }

            $scope.close = function () {
                $modalInstance.dismiss();
            }

        }]).controller('sceneConfirmCtrl', ['$scope', '$modalInstance', 'shift_data', function ($scope, $modalInstance, shift_data) {
        $scope.shift_data = shift_data;
        $scope.confirm = function () {
            $modalInstance.close(shift_data);
        }

        $scope.close = function () {
            $modalInstance.close();
        }


    }]).controller('sceneCollectCtrl', ['$scope', '$stateParams', 'breadcrumb', 'tmsPagination', 'sceneSummary', 'agentSceneDetail', 'hallName', 'sceneRecord', 'globalFunction', 'matchesStatus', '$filter', 'fundSourceTypes', 'currentShift', 'formatNumber',
        function ($scope, $stateParams, breadcrumb, tmsPagination, sceneSummary, agentSceneDetail, hallName, sceneRecord, globalFunction, matchesStatus, $filter, fundSourceTypes, currentShift, formatNumber) {
            breadcrumb.items = [
                {"name": "場面數匯總", "active": true}
            ];

            $scope.fundSourceTypes = fundSourceTypes;
            $scope.matchesStatus = matchesStatus.items;
            //廳
            $scope.halls = hallName.query({hall_type: '|1'});

            //搜索filter
            var init_condition = {
                hall_id: "",
                agent_code: $stateParams.agent_code ? $stateParams.agent_code : "",
                agent_group: "",
                year_month: currentShift.data ? $filter('date')(currentShift.data.shift_date, "yyyy-MM") : "",
                date: ["", ""],
                status: "",
                sort: "agent_code NUMASC"
            }
            var condition_base = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);

            //當前廳
            hallName.getHall().$promise.then(function (_hall) {
                $scope.select_hall_id = _hall.id;
//                $scope.condition.hall_id = _hall.id;
                condition_base.hall_id = _hall.id;
                $scope.search();
            });

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = sceneRecord;
            $scope.pagination.max_size = 3;
            $scope.pagination.query_method = "sceneTotalList";

            $scope.search = function (page) {
                var tmp_condition = angular.copy($scope.condition);
                if (tmp_condition.agent_group) {
                    tmp_condition.agent_group = tmp_condition.agent_group;
                }
                if (tmp_condition.year_month) {
                    tmp_condition.year_month = $filter('date')(new Date(tmp_condition.year_month), 'yyyy-MM-01');
                }
                if (tmp_condition.date[0]) {
                    tmp_condition.date[0] = $filter('date')(tmp_condition.date[0], 'yyyy-MM-dd');
                }
                if (tmp_condition.date[1]) {
                    tmp_condition.date[1] = $filter('date')(tmp_condition.date[1], 'yyyy-MM-dd');
                }

                $scope.scene_total_lists = $scope.pagination.select(page, globalFunction.generateUrlParams(tmp_condition, {}));
                $scope.scene_details = [];
            }
            //$scope.search();

            $scope.reset = function () {
                $scope.condition = angular.copy(init_condition);
                $scope.condition.hall_id = $scope.select_hall_id;
                $scope.search();
            }

            $scope.pagination_details = tmsPagination.create();
            $scope.pagination_details.resource = sceneRecord;
            $scope.scene_detail_id = "";
            $scope.search_details = function (page) {
                var tmp_condition = angular.copy($scope.condition);
                var condition = {
                    hall_id: $scope.condition.hall_id,
                    agent_info_id: $scope.scene_detail_id,
                    agentGroup: {
                        agent_group_name: $scope.condition.agent_group + "!"
                    },
                    status: 2,
                    shiftMark: {
                        shift_date: [],
                        year_month: ""
                    }
                };

                if (tmp_condition.year_month) {
                    condition.shiftMark.year_month = $filter('date')(new Date(tmp_condition.year_month), 'yyyy-MM-01');
                }
                if (tmp_condition.date[0]) {
                    condition.shiftMark.shift_date[0] = $filter('date')(tmp_condition.date[0], 'yyyy-MM-dd');
                }
                if (tmp_condition.date[1]) {
                    condition.shiftMark.shift_date[1] = $filter('date')(tmp_condition.date[1], 'yyyy-MM-dd');
                }
                $scope.pagination_details.select(page, globalFunction.generateUrlParams(condition, {
                    inCapitals: {},
                    outCapitals: {}
                }))
                    .$promise.then(function (scene_details) {
                        //入場本金
                        $scope.scene_details = scene_details;
                    });
            }

            $scope.in_capital_show = function (inCapitals) {
                if (inCapitals && inCapitals.length > 0) {
                    var inCapitals_content = [];
                    _.each(inCapitals, function (record) {
                        inCapitals_content.push(formatNumber(record.amount) + "" + (record.funds_type ? record.funds_type : ""));
                    });
                    return inCapitals_content.join("+");
                } else {
                    return 0;
                }
            }

            $scope.out_capital_show = function (outCapitals) {
                if (outCapitals.length > 0) {
                    var outCapitals_content = [];
                    _.each(outCapitals, function (record) {
                        outCapitals_content.push((record.o_word ? record.o_word : "") + "" + formatNumber(record.amount) + "" + (record.funds_type ? record.funds_type : ""));
                    });
                    return outCapitals_content.join("+");
                } else {
                    return 0;
                }
            }

            $scope.select = function (id) {
                $scope.scene_detail_id = id;
                $scope.search_details();
            }

        }])/*.controller('sceneRecordCtrl',['$scope','$modal','$location','breadcrumb','search','page','sceneRecordst',
     function($scope, $modal, $location, breadcrumb, search, page, sceneRecordst){
     breadcrumb.items = [
     {"name":"場面數記錄","active":true}
     ];

     //年份
     $scope.years = ['2014','2013'];
     //月份
     $scope.months = [];
     for(var i = 1; i<=12; i++){
     $scope.months.push(i.toString());
     }


     $scope.all_sceneRecords = sceneRecordst;
     $scope.sceneRecords = page.select(1,$scope.all_sceneRecords);
     //pagination
     $scope.select = function(current_page){
     $scope.sceneRecords = page.select(current_page,  $scope.all_sceneRecords);
     }


     //計算
     $scope.total_number = function(){
     return $scope.sceneRecords.length;
     }

     $scope.leaves  =function(){
     var leaves = _.where( $scope.sceneRecords,{'status':'已離場'});
     return leaves.length;
     }
     $scope.not_leaves  = function(){
     return $scope.total_number() - $scope.leaves();
     }

     $scope.few_math = function(){
     $scope.few_maths = 0;
     for(var i=0;i< $scope.sceneRecords.length;i++){
     if(parseInt( $scope.sceneRecords[i].loss_win_amount) > 0){
     $scope.few_maths += parseInt( $scope.sceneRecords[i].loss_win_amount)
     }
     }
     return parseInt($scope.few_maths);
     }

     $scope.num_math = function(){
     $scope.num_maths = 0;
     for(var i=0;i< $scope.sceneRecords.length;i++){
     if(parseInt( $scope.sceneRecords[i].loss_win_amount) < 0){
     $scope.num_maths += parseInt( $scope.sceneRecords[i].loss_win_amount)
     }
     }
     return Math.abs(parseInt($scope.num_maths));
     }


     //戶口場面數明細
     /* $scope.agentSceneDetails = [];
     $scope.detail = function(agent_code){
     $scope.agent_code = agent_code;
     $scope.all_agentSceneDetails = _.where(agentSceneDetail,{'agent_code':agent_code});
     $scope.agentSceneDetails = page.select(1,$scope.all_agentSceneDetails);
     $scope.as_select = function(current_page){
     $scope.agentSceneDetails = page.select(current_page,  $scope.all_agentSceneDetails);
     }
     }

     $scope.status_all = ["離場","已開場"]

     //搜索filter
     var init_condition = {
     //                hall:"永利鉅星",
     agent_code:"",
     full_name:"",
     thrum:"",
     status:"",
     time :"",
     schedule_time : ""
     }

     $scope.condition = angular.copy(init_condition);
     var search_config = [
     //                {field_name:'hall'},
     {field_name:'agent_code'},
     {field_name:'full_name'},
     {field_name:'time',condition_name:'year_month',data_type:'date'},
     {field_name:'status'},
     {field_name:'thrum'},
     {field_name:'time',condition_name:'schedule_time',data_type:'date'}
     ];

     $scope.search = function(){
     //詳細
     $scope.all_sceneRecords = search(sceneRecordst,search_config,$scope.condition);
     $scope.sceneRecords = page.select(1, $scope.all_sceneRecords);

     }

     $scope.reset = function(){
     $scope.condition = angular.copy(init_condition);
     $scope.form_search.$setPristine();
     $scope.search();
     }

     //即时匯總
     $scope.summary = function(){

     var summary_data = {
     self_rolling_amount: "175,540 萬",
     out_rolling_amount: "51,240 萬",
     day_loss_win_amount_: "250 萬",
     month_loss_win_amount: "1,240 萬"
     }

     $modal.open({
     templateUrl: "views/scene/scene-summary.html",
     controller: 'sceneSummaryCtrl',
     // windowClass:'lg-modal',
     resolve: {
     summary_data:function() {
     return  summary_data;
     }
     }
     });
     }
     //詳細
     $scope.detail = function(agent_code){
     $location.path("/scene/screening-list-detail/"+agent_code);
     }


     }])*/
        .controller('sceneSummaryCtrl', ['$scope', '$modalInstance', 'summary_data', function ($scope, $modalInstance, summary_data) {
            $scope.summary_data = summary_data;
            $scope.close = function () {
                $modalInstance.close();
            }
        }])/*.controller('screeningListCtrl',['$scope','$modal','$location','breadcrumb','goBackData','globalFunction','$filter','getDate','tmsPagination','sceneRecord','sceneRecordShift','matchesStatus','fundSourceTypes','agentsLists','currentShift',
     function($scope,$modal,$location,breadcrumb,goBackData,globalFunction,$filter,getDate,tmsPagination,sceneRecord,sceneRecordShift,matchesStatus,fundSourceTypes,agentsLists,currentShift){
     breadcrumb.items = [
     {"name":"場面數記錄","active":true}
     ];

     $scope.fundSourceTypes = fundSourceTypes;
     var now_date = new Date();
     //當前日期
     $scope.now_date = getDate(new Date());
     $scope.matchesStatus = matchesStatus.items;

     $scope.search_title ="場次查詢";
     var init_new_condition = {
     hall_id:"",
     agent_code:"",
     agentGroup:{
     agent_group_name:""
     },
     shiftMark: {
     year_month: currentShift.data.year_month ? currentShift.data.year_month : ""
     },
     out_time: ["",""],
     status:""
     }
     //显示参数
     $scope.condition = angular.copy(init_new_condition);
     $scope.condition.out_time[0] = now_date;
     $scope.condition.out_time[1] = now_date;
     $scope.condition = goBackData.get('condition',$scope.condition);

     $scope.sceneRecords = [];
     $scope.search = function(){
     $scope.scene_search();
     }

     $scope.pagination = tmsPagination.create();
     $scope.pagination.resource = sceneRecord;
     $scope.scene_search = function(page) {
     goBackData.set('condition',$scope.condition);
     $scope.condition_copy = angular.copy($scope.condition);

     if ($scope.condition_copy.agent_code){
     $scope.condition_copy.agent_code = $scope.condition_copy.agent_code + "!";
     }
     if ($scope.condition_copy.shiftMark.year_month){
     $scope.condition_copy.shiftMark.year_month =  $filter('date')(new Date($scope.condition_copy.shiftMark.year_month),'yyyy-MM-01');
     }
     if($scope.condition_copy.agent_group_name) {
     $scope.condition_copy.agentGroup.agent_group_name = $scope.condition_copy.agentGroup.agent_group_name + "!";
     }
     if($scope.condition_copy.status){
     $scope.condition_copy.status = $scope.condition_copy.status;
     }
     if($scope.condition_copy.out_time[0]){
     $scope.condition_copy.out_time[0] = getDate($scope.condition_copy.out_time[0]);
     }
     if($scope.condition_copy.out_time[1]){
     $scope.condition_copy.out_time[1] = getDate($scope.condition_copy.out_time[1]);
     }

     $scope.sceneRecords = $scope.pagination.select(page, globalFunction.generateUrlParams($scope.condition_copy,{outCapitals:{}, sceneRecordSubs:{}, countSecondOutCapitals:{}}));//,mainScene:{}
     sceneRecord.sceneTotal({
     "hall_id": $scope.condition_copy.hall_id,
     "agent_code": $scope.condition_copy.agent_code,
     "agentGroup.agent_group_name": $scope.condition_copy.agentGroup.agent_group_name,
     "shiftMark.year_month": $scope.condition_copy.shiftMark.year_month ? $filter('date')(new Date($scope.condition_copy.shiftMark.year_month),'yyyy-MM-01') : "", // $filter('date')(new Date($scope.condition_copy.shiftMark.year_month),'yyyy-MM-01'),
     "out_time-min": $scope.condition_copy.out_time[0] ? getDate($scope.condition_copy.out_time[0]) : "",
     "out_time-max": $scope.condition_copy.out_time[1] ? getDate($scope.condition_copy.out_time[1]) : "",
     //"shiftMark.shift_date": $scope.condition_copy.shiftMark.shift_date ? getDate($scope.condition_copy.shiftMark.shift_date) : "",
     "status": $scope.condition_copy.status
     }).$promise.then(function(_sceneRecordsTotal){
     $scope.sceneRecordsTotal = _sceneRecordsTotal
     $scope.sceneRecordsTotal.scene_total =  Number(_sceneRecordsTotal.in_scene) + Number(_sceneRecordsTotal.out_scene);
     $scope.sceneRecordsTotal.up_amount = Number(_sceneRecordsTotal.up_amount);
     $scope.sceneRecordsTotal.down_amount = Number(_sceneRecordsTotal.down_amount);
     $scope.sceneRecordsTotal.loss_win_amount = 0-(Number($scope.sceneRecordsTotal.up_amount) + Number($scope.sceneRecordsTotal.down_amount));
     });
     }
     $scope.scene_search();

     $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value,old_value){
     if(new_value){
     agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value})).$promise.then(function (agents) {
     if(agents.length>0) {
     $scope.agent_name = agents[0].agent_name;
     }
     });
     }
     }));

     $scope.reset = function(){
     $scope.condition = angular.copy(init_new_condition);
     $scope.form_search.$setPristine();
     $scope.agent_name = '';
     $scope.search();
     }

     $scope.detail =function(sceneRecord,type){
     $location.path('/scene/screening-list-detail/'+sceneRecord.id+'/'+sceneRecord.main_scene_id);
     }

     $scope.sendSMS = function(){
     $location.path('/scene/screening-sms');
     }

     //離場理算
     $scope.outScene = function(outCapitals){
     var _sceneRecord = [];
     if(outCapitals && outCapitals.length>0){
     _.each(outCapitals,function(_outCapital){
     _sceneRecord.push(_outCapital.amount+""+_outCapital.o_word)
     });
     }
     return  _sceneRecord.join(" + ");
     }

     //截數本金拼接記錄
     $scope.shift_amount_sum = function(last_shift_amount){
     var shift_amount_content = [];
     if(last_shift_amount && last_shift_amount.length>0)
     _.each(last_shift_amount,function(record){
     shift_amount_content.push(record.amount+""+record.source_type);
     });
     return shift_amount_content.join("+");
     }

     //選擇加載場次詳細
     $scope.scene_selected = function(_sceneRecordSubs){
     var in_capital_total = [];// 入場本金
     _.each(_sceneRecordSubs, function (sceneRecordSub) {
     in_capital_total.push(sceneRecordSub.amount+ "" +$scope.fundSourceTypes[sceneRecordSub.source_type]);
     });
     return  in_capital_total.join(" + ");

     }


     }])*/
        .controller('screeningShiftListCtrl', ['$scope', '$stateParams', '$q', '$modal', '$location', 'breadcrumb', 'goBackData', 'globalFunction', '$filter', 'getDate', 'tmsPagination', 'hallName', 'sceneStatus', 'mainScene', 'sceneRecord', 'sceneRecordShift', 'SceneRecordShiftStatus', 'fundSourceTypes', 'agentsLists', 'currentShift', 'pinCodeModal',
            function ($scope, $stateParams, $q, $modal, $location, breadcrumb, goBackData, globalFunction, $filter, getDate, tmsPagination, hallName, sceneStatus, mainScene, sceneRecord, sceneRecordShift, SceneRecordShiftStatus, fundSourceTypes, agentsLists, currentShift, pinCodeModal) {
                breadcrumb.items = [
                    {"name": "場面數記錄", "active": true}
                ];
                $scope.sceneStatus = sceneStatus;
                $scope.fundSourceTypes = fundSourceTypes;
                $scope.SceneRecordShiftStatus = SceneRecordShiftStatus.items;
                $scope.halls = hallName.query({hall_type: '|1'});//廳館只顯示內管
                var init_new_condition = {
                    "sceneRecord": {
                        "hall_id": "",
                        "agent_code": $stateParams.agent_code ? $stateParams.agent_code : "",
                        "agentGroup": {
                            "agent_group_name": ""
                        }
                    },
                    shiftMark: {
                        year_month: currentShift.data.year_month ? currentShift.data.year_month : "",
                        shift_date: currentShift.data.shift_date ? currentShift.data.shift_date : "",
                        only_shift_date: ["", ""]
                    },
                    status: ""
                }
                //显示参数
                $scope.condition = angular.copy(init_new_condition);
                $scope.condition = goBackData.get('condition', $scope.condition);

                //場次查詢條件
                var init_condition = {
                    "sceneRecord": {
                        "hall_id": $scope.user.hall ? $scope.user.hall.id : "",
                        "agent_code": "",
                        "status": "",
                        "agentGroup": {
                            "agent_group_name": ""
                        }
                    },

                    "shiftMark": {
                        "year_month": currentShift.data.year_month,
                        "shift_date": currentShift.data.shift_date ? currentShift.data.shift_date : "",
                        "shift_date-min": "",
                        "shift_date-max": ""
                    },
                    status: ""
                }
                //查询参数
                $scope.new_condition = angular.copy(init_condition);
                $scope.excel_condition = angular.copy(init_condition);

                $scope.sceneRecords = [];
                $scope.search = function () {
                    $scope.scene_search();
                    //$scope.accountScene();
                }

                $scope.pagination = tmsPagination.create();
                $scope.pagination.items_per_page = 100;
                $scope.pagination.resource = sceneRecordShift;
                $scope.scene_search = function (page) {
                    goBackData.set('condition', $scope.condition);
                    $scope.condition_copy = angular.copy($scope.condition);
                    $scope.new_condition = {
                        "sceneRecord": {
                            "hall_id": $scope.user.hall.hall_type == 1 ? $scope.condition_copy.sceneRecord.hall_id : $scope.user.hall.id,
                            "status": $scope.condition_copy.sceneRecord.status,
                            "agent_code": $scope.condition_copy.sceneRecord.agent_code ? $scope.condition_copy.sceneRecord.agent_code : "",
                            "mainScene": {"is_scene_show": "|1"},
                            "agentGroup": {
                                "agent_group_name": $scope.condition_copy.sceneRecord.agentGroup.agent_group_name ? $scope.condition_copy.sceneRecord.agentGroup.agent_group_name + "!" : ""
                            }
                        },
                        "shiftMark": {
                            "year_month": $scope.condition_copy.shiftMark.year_month ? $filter('date')(new Date($scope.condition_copy.shiftMark.year_month), 'yyyy-MM-01') : "",
                            "shift_date": $scope.condition_copy.shiftMark.shift_date ? getDate($scope.condition_copy.shiftMark.shift_date) : "",
                            "shift_date-min": $scope.condition_copy.shiftMark.only_shift_date[0] ? getDate($scope.condition_copy.shiftMark.only_shift_date[0]) : "",
                            "shift_date-max": $scope.condition_copy.shiftMark.only_shift_date[1] ? getDate($scope.condition_copy.shiftMark.only_shift_date[1]) : ""
                        },
                        "status": $scope.condition_copy.status,
                        "sort": "status DESC,sceneRecord.agent_code NUMASC"
                    }
                    $scope.excel_condition = angular.copy($scope.new_condition);
                    delete  $scope.excel_condition.sceneRecord.hall_id;
                    $scope.excel_condition.hall_id = $scope.new_condition.sceneRecord.hall_id;
                    if ($scope.excel_condition.shiftMark.year_month) {
                        $scope.excel_condition.shiftMark.year_month = $scope.excel_condition.shiftMark.year_month.substring(0, 7);
                    }


                    $scope.pagination.select(page, globalFunction.generateUrlParams($scope.new_condition, {
                        inCapitals: {},
                        outCapitals: {},
                        inOutCapitals: {},
                        sceneRecordShifts: {}
                    })).$promise.then(function (sceneRecordShifts) {
                            $scope.sceneRecordShifts = sceneRecordShifts;
                            _.each($scope.sceneRecordShifts, function (_sceneRecordShift) {
                                if (_sceneRecordShift.sceneRecordShifts.length > 1) {
                                    $scope._sceneRecordShiftIDs = _.pluck(_sceneRecordShift.sceneRecordShifts, 'id');
                                    var num = _.indexOf($scope._sceneRecordShiftIDs, _sceneRecordShift.id);
                                    if (num > 0) {
                                        _sceneRecordShift.up_in_capital_scene = _sceneRecordShift.sceneRecordShifts[num - 1].in_capital_scene;
                                    }
                                }
                            })
                        });//,mainScene:{}
                    sceneRecord.sceneShiftTotal({
                        "sceneRecord.hall_id": $scope.new_condition.sceneRecord.hall_id,
                        "sceneRecord.agent_code": $scope.new_condition.sceneRecord.agent_code ? $scope.new_condition.sceneRecord.agent_code : "",
                        "sceneRecord.agentGroup.agent_group_name": $scope.new_condition.sceneRecord.agentGroup.agent_group_name ? $scope.new_condition.sceneRecord.agentGroup.agent_group_name + "!" : "",
                        "shiftMark.year_month": $scope.new_condition.shiftMark.year_month ? $filter('date')(new Date($scope.new_condition.shiftMark.year_month), 'yyyy-MM-01') : "", // $filter('date')(new Date($scope.condition_copy.shiftMark.year_month),'yyyy-MM-01'),
                        "shiftMark.shift_date-min": $scope.condition_copy.shiftMark.only_shift_date[0] ? getDate($scope.condition_copy.shiftMark.only_shift_date[0]) : "",
                        "shiftMark.shift_date-max": $scope.condition_copy.shiftMark.only_shift_date[1] ? getDate($scope.condition_copy.shiftMark.only_shift_date[1]) : "",
                        "shiftMark.shift_date": $scope.new_condition.shiftMark.shift_date ? getDate($scope.new_condition.shiftMark.shift_date) : "",
                        "status": $scope.new_condition.status
                    }).$promise.then(function (_sceneRecordsTotal) {
                            $scope.sceneRecordsTotal = angular.copy(_sceneRecordsTotal);
//                    $scope.sceneRecordsTotal.scene_total =  Number(_sceneRecordsTotal.in_scene) + Number(_sceneRecordsTotal.out_scene);
                            $scope.sceneRecordsTotal.up_amount = $filter('parseTenThousand')($scope.sceneRecordsTotal.up_amount);
                            $scope.sceneRecordsTotal.down_amount = $filter('parseTenThousand')($scope.sceneRecordsTotal.down_amount);
                            $scope.sceneRecordsTotal.loss_win_amount = 0 - (Number(_sceneRecordsTotal.up_amount) + Number(_sceneRecordsTotal.down_amount));
                            $scope.sceneRecordsTotal.scene_amount = (Number(_sceneRecordsTotal.in_scene) + Number(_sceneRecordsTotal.out_scene));
                        });
                }
                $scope.scene_search();

                //賬房開場待入場場次
                $scope.account_pagination = tmsPagination.create();
                $scope.account_pagination.items_per_page = 3;
                $scope.account_pagination.resource = mainScene;
                $scope.account_pagination.query_method = "findWaitScene";
                $scope.accountScene = function (page) {
                    $scope.account_condition = {
                        "hall_id": $scope.user.hall.hall_type == 1 ? $scope.condition_copy.sceneRecord.hall_id : $scope.user.hall.id,
                        "is_scene_open": 0,
                        "scene_status": 2,
                        "is_scene_show": "|1",
                        "agent_code": $scope.condition_copy.sceneRecord.agent_code ? $scope.condition_copy.sceneRecord.agent_code : "",
                        "agentGroup": {
                            "agent_group_name": $scope.condition_copy.sceneRecord.agentGroup.agent_group_name ? $scope.condition_copy.sceneRecord.agentGroup.agent_group_name + "!" : ""
                        }
                        /*"shiftMark": {
                         "year_month": $scope.condition_copy.shiftMark.year_month ? $filter('date')(new Date($scope.condition_copy.shiftMark.year_month),'yyyy-MM-01') : "",
                         "shift_date": $scope.condition_copy.shiftMark.shift_date ? getDate($scope.condition_copy.shiftMark.shift_date) : ""
                         "shift_date-min": $scope.condition_copy.shiftMark.only_shift_date[0] ? getDate($scope.condition_copy.shiftMark.only_shift_date[0]) : "",
                         "shift_date-max": $scope.condition_copy.shiftMark.only_shift_date[1] ? getDate($scope.condition_copy.shiftMark.only_shift_date[1]) : ""
                         }*/
                    };
                    $scope.accountScenes = $scope.account_pagination.select(page, globalFunction.generateUrlParams($scope.account_condition));
                }
                $scope.accountScene();

                $scope.$watch('condition.sceneRecord.agent_code', globalFunction.debounce(function (new_value, old_value) {
                    if (new_value) {
                        agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value})).$promise.then(function (agents) {
                            if (agents.length > 0) {
                                $scope.agent_name = agents[0].agent_name;
                            }
                        });
                    }
                }));

                //賬房場次加入場面
                $scope.addScene = function (id) {
                    pinCodeModal(sceneRecordShift, 'addScene', {id: id}, '入場成功！').then(function () {
                        $scope.search();
                    });
                }
                //場次刪除
                $scope.removeAscene = function (main_scene_id) {
                    pinCodeModal(mainScene, 'delete', {id: main_scene_id, type: "1"}, '刪除成功！').then(function () {
                        $scope.accountScene();
                    });
                }

                //格式化金額
                $scope.parseSceneFormat = function (loss_win_amount) {
                    return loss_win_amount == "" || loss_win_amount == null || loss_win_amount == undefined ? loss_win_amount : $filter('parseTenThousand2')(loss_win_amount);
                }

                //場次刪除
                $scope.removeScene = function (scene_record_id) {
                    pinCodeModal(sceneRecord, 'delete', {id: scene_record_id}, '刪除成功！').then(function () {
                        $scope.scene_search();
                    });
                }

                /**
                 * 場面開場
                 */
                $scope.sceneOpen = function () {
                    var sceneModal;
                    sceneModal = $modal.open({
                        templateUrl: "views/scene/screening-open-window.html",
                        controller: 'screeningOpenWindowCtrl',
                        windowClass: 'md-modal',
                        resolve: {
                            user_data: function () {
                                return $scope.user;
                            }
                        }
                    });

                    sceneModal.result.then(function () {
                        $scope.scene_search();
                    });
                }


                //var listener_obj = {change: 0};
                /**
                 * 场面详细
                 * @param scene_record_id 子場次ID
                 * @param main_scene_id 主場次ID
                 */
                $scope.sceneDetail = function (scene_record_id, main_scene_id, shift_mark_id) {
                    var deferred = $q.defer();
                    var sceneModal;
                    sceneModal = $modal.open({
                        templateUrl: "views/scene/screening-detail-window.html",
                        controller: 'screeningDetailWindowCtrl',
                        windowClass: 'slg-modal',
                        resolve: {
                            scene_record_id: function () {
                                return scene_record_id;
                            },
                            main_scene_id: function () {
                                return main_scene_id;
                            },
                            deferred: function () {
                                return deferred;
                            },
                            shift_date: function () {
                                return $scope.condition.shiftMark.shift_date;
                            },
                            shift_mark_id: function () {
                                return shift_mark_id;
                            }
                        }
                    });

                    deferred.promise.then(function () {
                    }, function () {
                    }, function () {
                        $scope.scene_search();
                    });
                    sceneModal.result.then(function () {
                        $scope.scene_search();
                    });
                }

                //监听是否场面详细是否有修改(不关闭页面的情况下)
                //$scope.$watch('listener_obj.change',function(){})

                $scope.reset = function () {
                    $scope.condition = angular.copy(init_new_condition);
                    $scope.form_search.$setPristine();
                    $scope.agent_name = '';
                    $scope.search();
                }

                $scope.detail = function (scene_record_id, main_scene_id) {
                    $location.path('/scene/screening-list-detail/' + scene_record_id + '/' + main_scene_id);
                }

                $scope.sendSMS = function () {
                    $location.path('/scene/screening-sms');
                }

                //離場理算
                /* $scope.outScene = function(outCapitals){
                 var _sceneRecord = [];
                 if(outCapitals && outCapitals.length>0){
                 _.each(outCapitals,function(_outCapital){
                 _sceneRecord.push((_outCapital.o_word ? _outCapital.o_word : "") + "" + _outCapital.amount+""+(_outCapital.funds_type ? _outCapital.funds_type : ""))
                 });
                 }
                 return  _sceneRecord.join(" + ");
                 }

                 //選擇加載場次詳細
                 $scope.inScene = function(_sceneRecordSubs){
                 var in_capital_total = [];// 入場本金
                 _.each(_sceneRecordSubs, function (sceneRecordSub) {
                 in_capital_total.push(sceneRecordSub.amount+ "" +(sceneRecordSub.funds_type ? sceneRecordSub.funds_type : ""));
                 });
                 return  in_capital_total.join(" + ");

                 }*/

            }]).controller('screeningListDetailCtrl', ['$scope', '$filter', '$state', '$stateParams', '$modal', '$location', 'getDate', 'windowItems', 'globalFunction', 'tmsPagination', 'topAlert', 'sceneRecord', 'sceneStatus', 'hallName', 'fundSourceTypes', 'rollingTypes', 'desk', 'pinCodeModal', 'sceneRecordShift', 'mainScene', 'rollingRecord', 'recentlyPrincipal', 'matchesStatus', 'outSceneWord',
            function ($scope, $filter, $state, $stateParams, $modal, $location, getDate, windowItems, globalFunction, tmsPagination, topAlert, sceneRecord, sceneStatus, hallName, fundSourceTypes, rollingTypes, desk, pinCodeModal, sceneRecordShift, mainScene, rollingRecord, recentlyPrincipal, matchesStatus, outSceneWord) {

                $scope.matchesStatus = matchesStatus.items;
                $scope.sceneStatus = sceneStatus.items;
                $scope.fundSourceTypes = fundSourceTypes;
                $scope.rollingTypes = rollingTypes.items;
                //$scope.op_type = $stateParams.type==undefined ? 'detail' : $stateParams.type;
                $scope.tab_id = $stateParams.id; //子場次ID

                //查詢轉碼信息
                $scope.pagination = tmsPagination.create();
                $scope.pagination.resource = rollingRecord;
                $scope.select = function (page) {
                    if ($scope.agent_record.is_scene_open == 0) {
                        $scope.rollings = $scope.pagination.select(page, {rolling_id: $scope.agent_record.rolling_id/*, status:'1'*/});
                    } else {
                        $scope.rollings = [];
                    }
                }

                //主场次
                $scope.main_scene_select = function () {
                    //globalFunction.generateUrlParams({sceneRecords:{/*sceneRecordSubs:""*/}}
                    mainScene.get({id: $stateParams.main_scene_id}).$promise.then(function (agent) {
                        if (agent) {
                            $scope.is_scene_open = agent.is_scene_open;
                            $scope.child_scene_select(agent.is_scene_open)
                            $scope.agent_record = agent;

                        }
                    });
                }

                //子場次 status 1 開場 2 離場
                $scope.child_scene_select = function (is_scene_open) {
                    sceneRecord.query(globalFunction.generateUrlParams({
                        main_scene_id: $stateParams.main_scene_id,
                        sort: 'create_time asc'
                    }, {sceneShiftRecord: {}}))
                        .$promise.then(function (_sceneRecord) {
                            //加載第一個場次
                            if (_sceneRecord.length > 0) {
                                $scope.scene_selected(_sceneRecord[0].id);
                            }
                            //is_scene_open 0 賬房開的場次 1場面開的場次
                            if (is_scene_open == "0") {
                                _sceneRecord.push({id: "", scene_no: "轉碼詳細"});
                            }
                            $scope.sceneRecords = _sceneRecord;

                        });
                }

                if ($stateParams.main_scene_id) {
                    $scope.main_scene_select();
                    //$scope.child_scene_select();
                }

                //檯號 #TODO 閒置的檯
                //$scope.desks = desk.query(/*{status:'0'}*/);

                //可用本金
                $scope.pagination_capital = tmsPagination.create();
                $scope.pagination_capital.resource = recentlyPrincipal;
                $scope.recentlyRolling_select = function (page) {
                    $scope.recentlyRollings = $scope.pagination_capital.select(page, {
                        main_scene_id: $stateParams.main_scene_id,
                        status: 2
                    });
                }
                $scope.recentlyRolling_select();

                $scope.outCapitals_content = [];
                //選擇加載場次詳細
                $scope.scene_selected = function (id) {
                    if (id) {
                        //場面數
                        $scope.isTabShow = true;
                        $scope.sceneRecord = [];
                        sceneRecord.get(globalFunction.generateUrlParams({'id': id}, {
                            sceneRecordSubs: {},
                            sceneShiftRecord: {},
                            outCapitals: {}
                        }))
                            .$promise.then(function (sceneRecord) {

                                if (sceneRecord.desk_id) {
                                    desk.get({id: sceneRecord.desk_id}).$promise.then(function (_desk) {
                                        if (_desk) {
//                                        sceneRecord.desk_no = _desk.layer+"區"+_desk.desk_no;
                                            sceneRecord.desk_no = "包" + _desk.desk_no;
                                        }
                                    });
                                }

                                //離場本金處理
                                $scope.outCapitals_content = sceneRecord.outCapitals.length == 0
                                    ? [{
                                    "id": "",
                                    "out_scene_word_id": "",
                                    "o_word": "",
                                    "amount": ""
                                }] : sceneRecord.outCapitals;

                                $scope.sceneRecord = sceneRecord;
                                $scope.outScene(sceneRecord);
                                var init_sceneTotal = {
                                    in_capital_total: [], // 入場本金
                                    loss_win_total: "",   //本場上下數
                                    out_capital_total: "",//離場本金
                                    rolling_total: ""     //本場轉碼數
                                }
                                sceneRecord.out_capital = sceneRecord.out_capital == null || sceneRecord.out_capital == "" ? 0 : sceneRecord.out_capital;
                                sceneRecord.loss_win_total = Number(sceneRecord.out_capital) - Number(sceneRecord.in_capital);
                                _.each(sceneRecord.sceneRecordSubs, function (sceneRecordSub) {
                                    sceneRecordSub.capital_revoke_type = false;
                                    init_sceneTotal.in_capital_total.push(sceneRecordSub.amount + "" + $scope.fundSourceTypes[sceneRecordSub.source_type]);
                                });
                                sceneRecord.in_capital_total = init_sceneTotal.in_capital_total.join('+');
                                //$scope.sceneRecord.xx = 'b838cc2505644be096bf84601234a1aa';
                            });

                        $scope.shift_select(id);
                    } else {
                        $scope.select();
                        $scope.isTabShow = false;
                    }
                }

                //查询场次截更
                $scope.shift_select = function (scene_record_id) {
                    sceneRecordShift.query(globalFunction.generateUrlParams({
                        scene_record_id: scene_record_id,
                        is_sys: '0'
                    }, {inCapitals: {}, outCapitals: {}, shiftMark: {}}))
                        .$promise.then(function (_sceneRecordShift) {
                            $scope.sceneRecordShifts = _sceneRecordShift;
                        });
                }

                //離場理算
                $scope.outScene = function (sceneRecord) {
                    var _sceneRecord = [];
                    var out_capital_total = 0;
                    if ($scope.outCapitals_content.length > 0) {
                        _.each($scope.outCapitals_content, function (_outCapitals) {
                            if (_outCapitals.amount && _outCapitals.amount > 0) {
                                _sceneRecord.push(_outCapitals.amount + "" + _outCapitals.o_word);
                                out_capital_total += Number(_outCapitals.amount);
                            }
                        });
                        //計算本場上下屬
                        sceneRecord.loss_win_amount = "";
                        if (out_capital_total) {
                            sceneRecord.loss_win_amount = $filter('parseTenThousand2')(out_capital_total - sceneRecord.in_capital);
                        }
                        sceneRecord.out_capital_total = _sceneRecord.join(" + ");
                    }
                }

                //場次狀態監聽
                $scope.status_change = function () {
                    if ($scope.sceneRecord.status == 2) { //离场
                        if (!$scope.sceneRecord.desk_id) {
                            topAlert.warning("請選擇枱號");
                            $scope.sceneRecord.status = 1;
                            return;
                        }
                    }
                }

                //分客
                $scope.mainScene = mainScene;
                $scope.branchGuest = function (_recentlyRolling, type) {
                    var branchGuestModal;
                    var template_url = type == "branch" ? 'scene-branch-guest' : 'scene-add-color';
                    branchGuestModal = $modal.open({
                        templateUrl: "views/scene/" + template_url + ".html",
                        controller: 'sceneBranchGuestCtrl',
                        resolve: {
                            agent_record: function () {
                                return $scope.agent_record;
                            },
                            recentlyRolling_data: function () {
                                return _recentlyRolling;
                            },
                            sceneRecord_data: function () {
                                return $scope.sceneRecord;
                            },
                            type: function () {
                                return type;
                            }
                        }
                    });

                    branchGuestModal.result.then(function (result) {
                        if (result == 'branch') {//分客
                            sceneRecord.query({
                                main_scene_id: $stateParams.main_scene_id,
                                status: '1',
                                sort: 'create_time asc'
                            }).$promise.then(function (_sceneRecord) {
                                    if ($scope.is_scene_open == 0) {
                                        _sceneRecord.push({id: "", scene_no: "轉碼詳細"})
                                    }
                                    $scope.sceneRecords = _sceneRecord;
                                });
                        } else {
                            $scope.sceneRecord = $scope.scene_selected($scope.sceneRecord.id);
                        }
                        $scope.recentlyRolling_select();
                    });
                }

                //新增截更
                $scope.sceneRecordSource = sceneRecord;
                $scope.addShift = function (op_type, shift) {
                    shift = shift == undefined ? "" : shift;
                    var shiftModal;
                    shiftModal = $modal.open({
                        templateUrl: "views/scene/scene-shift-create.html",
                        controller: 'sceneShiftCreateCtrl',
                        resolve: {
                            shift_data: function () {
                                return shift;
                            },
                            scene_record_data: function () {
                                return $scope.sceneRecord;
                            },
                            main_scene_data: function () {
                                return $scope.agent_record;
                            },
                            op_type: function () {
                                return op_type
                            }
                        }
                    });

                    shiftModal.result.then(function () {
                        $scope.sceneRecordSource.get(globalFunction.generateUrlParams({id: $scope.sceneRecord.id}, {
                            sceneRecordSubs: {},
                            sceneShiftRecord: {}
                        }))
                            .$promise.then(function (sceneRecord) {
                                $scope.sceneRecord.sceneRecordSubs = sceneRecord.sceneRecordSubs;
                                // $scope.sceneRecord.sceneShiftRecord = sceneRecord.sceneShiftRecord;
                                $scope.shift_select(sceneRecord.id);
                            });
                    });
                }

                $scope.removeShift = function (id) {
                    pinCodeModal(sceneRecordShift, 'delete', {id: id}, '刪除成功！').then(function () {
                        sceneRecord.get(globalFunction.generateUrlParams({id: $scope.sceneRecord.id}, {
                            sceneRecordSubs: {},
                            sceneShiftRecord: {}
                        }))
                            .$promise.then(function (sceneRecord) {
                                $scope.sceneRecord.sceneRecordSubs = sceneRecord.sceneRecordSubs;
                                //$scope.sceneRecord.sceneShiftRecord = sceneRecord.sceneShiftRecord;
                                $scope.shift_select(sceneRecord.id);
                            });
                    })
                }

                //選擇枱號
                $scope.showDesk = function () {
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/scene/show-desk-table.html",
                        controller: 'showDeskTableCtrl',
                        windowClass: 'tlg-modal',
                        resolve: {
                            id: function () {
                                return "";
                            }
                        }
                    });
                    modalInstance.result.then((function (desk) {
                        if (desk) {
                            $scope.sceneRecord.desk_id = desk.id;
//                        $scope.sceneRecord.desk_no =  desk.layer+"區"+desk.desk_no;
                            $scope.sceneRecord.desk_no = "包" + desk.desk_no;
                        }
                    }));
                }

                //修改或撤銷本金詳細
                $scope.edit_capital = function (capital) {
                    //開場本金可以修改
                    if (capital.type == 1) {
                        $scope.capital_amount = angular.copy(capital.amount);
                        capital.capital_edit_type == undefined ? false : true;
                        capital.capital_edit_type = !capital.capital_edit_type;
                        //log(capital.capital_edit_type);
                    } else if (capital.type == 2) { //中場加彩只能撤銷
                        capital.capital_revoke_type = !capital.capital_revoke_type;
                    }
                }

                //修改本金只能改少
                $scope.editCapitalKeyup = function (capital) {
                    if (Number(capital.amount) > Number($scope.capital_amount)) {
                        capital.amount = $scope.capital_amount;
                    }
                }

                //離場發送SMS
                $scope.estimateSendSMS = function () {

                    //windowItems.confirm("系統提醒","確定發送SMS",function(){
                    if ($scope.sceneRecord) {
                        $location.path('/scene/screening-sms/' + $scope.agent_record.agent_info_id + '/' + $stateParams.main_scene_id);
                    } else {
                        $location.path('/scene/screening-sms/' + $stateParams.id);
                    }
                    //});
                }

                $scope.outSceneWords = outSceneWord.query();
                $scope.add_outCapitals = function () {
                    $scope.outCapitals_content.push({
                        "id": "",
                        "out_scene_word_id": "",
                        "o_word": "",
                        "amount": ""
                    })
                }

                $scope.remove_outCapitals = function ($index) {
                    $scope.outCapitals_content.splice($index, 1);
                    $scope.outScene($scope.sceneRecord);
                }

                $scope.outCapitals_change = function (record) {
                    if (record.out_scene_word_id) {
                        var outCapitals_data = _.findWhere($scope.outSceneWords, {id: record.out_scene_word_id});
                        record.o_word = outCapitals_data.o_word;

                    } else {
                        record.out_scene_word_id = "";
                        record.o_word = "";
                    }
                    $scope.outScene();
                }

                //保存場面記錄
                $scope.scene_edit_url = globalFunction.getApiUrl("scene/scenerecord");
                $scope.submit = function () {
                    //入場本金
                    var sceneRecordSubs_content = [];
                    _.each($scope.sceneRecord.sceneRecordSubs, function (sceneRecordSubs) {
                        var _sceneRecordSubs = {
                            "id": sceneRecordSubs.id,
                            "amount": sceneRecordSubs.amount,
                            "type": sceneRecordSubs.type
                        }
                        if (sceneRecordSubs.capital_revoke_type) {
                            _sceneRecordSubs.disable = 1;
                        }
                        sceneRecordSubs_content.push(_sceneRecordSubs);
                    });

                    if ($scope.sceneRecord.status == 1 &&
                        $scope.outCapitals_content.length == 1 &&
                        $scope.outCapitals_content[0].out_scene_word_id == "" &&
                        $scope.outCapitals_content[0].amount == "") {
                        $scope.outCapitals_content_value = [];
                    } else {
                        $scope.outCapitals_content_value = $scope.outCapitals_content;
                    }

                    //離場本金
                    //var outCapitals_records = [];
                    var scene_record_update = {
                        "id": $scope.sceneRecord.id,
                        "status": $scope.sceneRecord.status,
                        "desk_id": $scope.sceneRecord.desk_id,
                        "guest_name": $scope.sceneRecord.guest_name,
                        "remark": $scope.sceneRecord.remark == null ? "" : $scope.sceneRecord.remark,
                        "sceneRecordSubs": sceneRecordSubs_content,
                        "outCapitals": $scope.outCapitals_content_value,
                        "pin_code": $scope.sceneRecord.pin_code
                    }
                    //return false;
                    $scope.form_scene_edit.checkValidity().then(function () {
                        sceneRecord.update(scene_record_update).$promise.then(function (result) {
                            topAlert.success("修改場面記錄成功");
                            //如果全部
                            if ($scope.sceneRecord.status == 2) {
                                //$state.go($state.current, {}, {reload: true})
                                $scope.estimateSendSMS();
                            }
                            //刷新場次詳細 #TODO
                            $scope.scene_selected($scope.sceneRecord.id);
                            //可用本金刷新
                            $scope.recentlyRolling_select();
                            $scope.form_scene_edit.clearErrors();
                        });
                    });
                }

                $scope.reset = function () {
                    $scope.scene_selected($scope.sceneRecord.id);
                    $scope.form_scene_edit.clearErrors();
                }


            }]).controller('screeningOpenWindowCtrl', ['$scope', '$filter', '$modal', 'user', '$modalInstance', '$location', 'getDate', 'windowItems', 'globalFunction', 'tmsPagination', 'topAlert', 'outSceneWord', 'fundSourceTypes', 'matchesStatus', 'sceneRecord', 'sceneStatus', 'hallName', 'agentsLists', 'user_data', 'currentShift', 'sceneSmsTypes', 'pinCodeModal',
            function ($scope, $filter, $modal, user, $modalInstance, $location, getDate, windowItems, globalFunction, tmsPagination, topAlert, outSceneWord, fundSourceTypes, matchesStatus, sceneRecord, sceneStatus, hallName, agentsLists, user_data, currentShift, sceneSmsTypes, pinCodeModal) {

                $scope.fundSourceTypes = fundSourceTypes;
                $scope.matchesStatus = matchesStatus.items;
                $scope.isDesabled = false;
                $scope.shift_date = currentShift.data ? currentShift.data.shift_date : "";
                $scope.sceneSmsTypes = sceneSmsTypes.items;
                $scope.come_guest_names = [{selected: "", name: "私營"}, {selected: "", name: "電投"}, {
                    selected: "",
                    name: "現場"
                }, {selected: "", name: "其它"}];
                //當前廳
                $scope.user = user_data;
                //$scope.selectedHall = hallName.getHall();
                $scope.outCapitals_content = [];
                $scope.inCapitals_content = [];
                outSceneWord.query().$promise.then(function (_outSceneWord) {
                    $scope.inSceneWords = _.where(_outSceneWord, {type: "1"});//類型
                    $scope.inSceneWords_data = _.findWhere($scope.inSceneWords, {o_word: ""});
                    $scope.inSceneWords_empty = $scope.inSceneWords_data ? $scope.inSceneWords_data.id : "";

                    $scope.outSceneWords = _.where(_outSceneWord, {type: "0"});//操作
                    $scope.outSceneWords_data = _.findWhere($scope.outSceneWords, {o_word: ""});
                    $scope.outSceneWords_empty = $scope.outSceneWords_data ? $scope.outSceneWords_data.id : "";

                    //離場理算
                    $scope.outCapitals_content = [{
                        out_scene_word_id: $scope.outSceneWords_empty,
                        o_word: "",
                        funds_type_id: $scope.inSceneWords_empty,
                        funds_type: "",
                        amount: "0",
                        amount_seq: 0
                    }];
                    //入場理算
                    $scope.inCapitals_content = [{
                        funds_type_id: "",
                        funds_type: "",
                        amount: "",
                        type: 1,
                        shift_date: $scope.shift_date,
                        amount_seq: 0
                    }];
                });

                $scope.setOutDate = function () {
                    $scope.record_create.out_time = angular.copy($scope.record_create.in_time);
                }

                $scope.getNowDate = function (type) {
                    var now_date = new Date();
                    var now_date_format = now_date;
                    if (type == 'in') {
                        if ($scope.record_create.in_time) {
                            var date = $filter("date")($scope.record_create.in_time, 'yyyy-MM-dd');
                            var time = $filter("date")(now_date, 'HH:mm')
                            now_date_format = date + " " + time;
                            //return false;
                            now_date_format = new Date(Date.parse(now_date_format.replace(/-/g, "/")))
                        } else {
                            var time = $filter("date")(now_date, 'HH:mm')
                            var date_time = $scope.shift_date + " " + time;
                            now_date_format = $scope.shift_date ? new Date(Date.parse(date_time.replace(/-/g, "/"))) : "";
                        }
                        $scope.record_create.in_time = now_date_format;
//                        $scope.record_create.out_time = angular.copy($scope.record_create.in_time);
                    } else {

                        if ($scope.record_create.out_time) {
                            var date = $filter('date')($scope.record_create.out_time, 'yyyy-MM-dd');
                            var time = $filter('date')(now_date, 'HH:mm');
                            now_date_format = date + " " + time;
                            now_date_format = new Date(Date.parse(now_date_format.replace(/-/g, "/")));
                        } else {
                            var date_time = $scope.shift_date + " " + $filter('date')(now_date, 'HH:mm');
                            now_date_format = $scope.shift_date ? new Date(Date.parse(date_time.replace(/-/g, "/"))) : "";
                        }
                        $scope.record_create.out_time = now_date_format;
                    }
                }

                $scope.record_create = {
                    "desk_id": "",
                    "agent_info_id": "",
                    "come_guest_type": "",
                    "come_guest_name": "",
                    "common_currency_name": "",
                    "manila_percent": "",
                    "gap": "",
                    "in_time": "",
                    "out_time": "",
                    "guest_name": "",
                    "status": 1,
                    "main_scene_id": "",
                    "inCapitals": [],
                    "outCapitals": [],
                    "remark": "",
                    "pin_code": ""
                }

                $scope.new_record = {
                    desk_no: "",
                    agent_code: "",
                    agent_name: ""
                }
                $scope.$watch('new_record.agent_code', globalFunction.debounce(function (new_value, old_value) {
                    if (new_value) {
                        agentsLists.query({agent_code: new_value}).$promise.then(function (agents) {
                            if (agents[0]) {
                                $scope.record_create.agent_info_id = agents[0].id;
                                $scope.new_record.agent_name = agents[0].agent_name;
                            }
                        });
                    }
                }));

                //選擇枱號
                $scope.showDesk = function () {
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/scene/show-desk-table.html",
                        controller: 'showDeskTableCtrl',
                        windowClass: 'tlg-modal',
                        resolve: {
                            id: function () {
                                return "";
                            }
                        }
                    });
                    modalInstance.result.then((function (desk) {
                        if (desk) {
                            $scope.record_create.desk_id = desk.id;
//                            $scope.new_record.desk_no =  desk.layer+"區"+desk.desk_no;
                            $scope.new_record.desk_no = "包" + desk.desk_no;
                        }
                    }));
                }
                //監控客源
                $scope.come_guest_name = "";
                $scope.comeGuestName = function (val) {
                    if (val == $scope.come_guest_name) {
                        $scope.record_create.come_guest_name = "";
                    }
                    $scope.come_guest_name = val;
                }

                //
                $scope.emptyStr = function (type) {
                    if (type == 1) {
                        $scope.record_create.common_currency_name = "";
                    } else if (type == 2) {
                        $scope.new_record.desk_no = "";
                        $scope.sceneRecord.desk_id = "";
                    } else {
                        $scope.record_create.gap = "";
                    }
                }

                //本金場面數
                $scope.scene_record_data = {
                    in_capital_total: "",
                    in_capital_join: "",
                    loss_win_amount: "",
                    out_capital_total: "",
                    out_capital_total_copy: "",
                    out_capital_join: ""
                }
                $scope.outScene = function (type) {
                    if (type == 'in') {
                        //record.amount = Number(record.amount) >=0 ? record.amount : "";
                        var in_capital_total = 0;
                        var in_capital_join = [];
                        if ($scope.inCapitals_content.length > 0) {
                            _.each($scope.inCapitals_content, function (_Capitals) {
                                if (_Capitals.amount.toString() != "" || _Capitals.amount != null || _Capitals.amount != undefined) {
                                    in_capital_join.push(_Capitals.amount + "" + (_Capitals.funds_type ? _Capitals.funds_type : ""));
                                    in_capital_total += Number(_Capitals.amount);
                                }
                            });
                            if ($scope.scene_record_data.out_capital_total_copy.toString() == "" || $scope.scene_record_data.out_capital_total_copy == null || $scope.scene_record_data.out_capital_total_copy == undefined) {
                                $scope.scene_record_data.loss_win_amount = "";
                            } else {
                                $scope.scene_record_data.loss_win_amount = $filter('parseTenThousand2')($scope.scene_record_data.out_capital_total - in_capital_total);
                            }
                            $scope.scene_record_data.in_capital_total = in_capital_total;
                            $scope.scene_record_data.in_capital_join = in_capital_join.join('+');

                        }
                    } else if (type == 'out') {
                        var out_capital_total = 0;
                        var out_capital_total_copy = "";
                        var out_capital_join = [];
                        if ($scope.outCapitals_content.length > 0) {
                            _.each($scope.outCapitals_content, function (_outCapitals) {
                                if (_outCapitals.amount.toString() != "" || _outCapitals.amount != null || _outCapitals.amount != undefined) {
                                    out_capital_join.push(_outCapitals.o_word + "" + _outCapitals.amount + "" + (_outCapitals.funds_type ? _outCapitals.funds_type : ""));
                                    out_capital_total += Number(_outCapitals.amount);
                                    out_capital_total_copy += _outCapitals.amount;
                                }
                            });
                            //計算本場上下屬
                            if (out_capital_total_copy.toString() == "" || out_capital_total_copy == null || out_capital_total_copy == undefined) {
                                $scope.scene_record_data.loss_win_amount = "";
                            } else {
                                $scope.scene_record_data.loss_win_amount = $filter('parseTenThousand2')(out_capital_total - $scope.scene_record_data.in_capital_total);
                            }
                            $scope.scene_record_data.out_capital_total_copy = out_capital_total_copy;
                            $scope.scene_record_data.out_capital_total = out_capital_total;
                            $scope.scene_record_data.out_capital_join = out_capital_join.join(" + ");
                        }
                    }
                }

                $scope.add_capital = function (type) {
                    if (type == 'in')
                        $scope.inCapitals_content.push({
                            "funds_type_id": "",
                            funds_type: "",
                            "amount": "",
                            "type": 1,
                            "shift_date": $scope.shift_date,
                            amount_seq: $scope.inCapitals_content.length
                        });
                    else if (type == 'out')

                        $scope.outCapitals_content.push({
                            "out_scene_word_id": $scope.outSceneWords_empty,
                            "o_word": "",
                            funds_type_id: $scope.inSceneWords_empty,
                            funds_type: "",
                            "amount": "0",
                            amount_seq: $scope.outCapitals_content.length
                        })
                }

                $scope.remove_capital = function (index, type) {
                    if (type == "in") {
                        $scope.inCapitals_content.splice(index, 1);
                    } else if (type == 'out') {
                        $scope.outCapitals_content.splice(index, 1);
                    }
                    $scope.outScene(type);
                }

                /**
                 * 類型和操作
                 * @param record
                 * @param type == ty(類型) ？ op（操作）
                 */
                $scope.capitals_change = function (record, type, op_type) {

                    if (type == "ty") {
                        if (record.funds_type_id) {
                            var inCapitals_data = _.findWhere($scope.inSceneWords, {id: record.funds_type_id});
                            record.funds_type_id = record.funds_type_id;
                            record.funds_type = inCapitals_data.o_word;
                        } else {
                            record.funds_type_id = "";
                            record.funds_type = "";
                        }
                    } else if (type == "op") {
                        if (record.out_scene_word_id) {
                            var outCapitals_data = _.findWhere($scope.outSceneWords, {id: record.out_scene_word_id});
                            record.out_scene_word_id = record.out_scene_word_id;
                            record.o_word = outCapitals_data.o_word;
                        } else {
                            record.out_scene_word_id = "";
                            record.o_word = "";
                        }
                    }
                    $scope.outScene(op_type);
                }

                $scope.scene_edit_url = globalFunction.getApiUrl("scene/scenerecord");
                $scope.submit = function () {
                    if ($scope.isDesabled) {
                        return false;
                    }
                    $scope.isDesabled = true;
                    $scope.record_create_copy = angular.copy($scope.record_create);
                    $scope.record_create_copy.in_time = $scope.record_create_copy.in_time ? $filter('date')($scope.record_create_copy.in_time, 'yyyy-MM-dd HH:mm') : "";
                    $scope.record_create_copy.out_time = $scope.record_create_copy.out_time ? $filter('date')($scope.record_create_copy.out_time, 'yyyy-MM-dd HH:mm') : "";
                    $scope.record_create_copy.come_guest_type = $scope.record_create_copy.come_guest_name == '4' ? $scope.record_create_copy.come_guest_type : $scope.sceneSmsTypes[$scope.record_create_copy.come_guest_name];
                    if ($scope.record_create_copy.status == 1 &&
                        $scope.outCapitals_content.length == 1 &&
                        $scope.outCapitals_content[0].out_scene_word_id == "" &&
                        $scope.outCapitals_content[0].amount == "") {
                        $scope.outCapitals_content_value = [];
                    } else {
                        $scope.outCapitals_content_value = $scope.outCapitals_content;
                    }
                    _.each($scope.inCapitals_content, function (_inCaptals) {
                        _inCaptals.shift_date = getDate(_inCaptals.shift_date);
                    });
                    $scope.record_create_copy.inCapitals = $scope.inCapitals_content;
                    $scope.record_create_copy.outCapitals = $scope.outCapitals_content_value;

                    //客源
                    var come_guest_type = "";
                    var type_num = "";
                    _.each($scope.come_guest_names, function (come_guest_name, index) {
                        if (come_guest_name.selected && index == 0) {
                            come_guest_type += "私營";
                            type_num = 1;
                        } else if (come_guest_name.selected && index == 1) {
                            come_guest_type += type_num == 1 ? "，" : "";
                            come_guest_type += "電投";
                            type_num = 1;
                        } else if (come_guest_name.selected && index == 2) {
                            come_guest_type += type_num == 1 ? "，" : "";
                            come_guest_type += "現場";
                            type_num = 1;
                        } else if (come_guest_name.selected && index == 3 && $scope.record_create_copy.come_guest_name) {
                            come_guest_type += type_num == 1 ? "，" : "";
                            come_guest_type += $scope.record_create_copy.come_guest_name;
                        }
                    })
                    $scope.record_create_copy.come_guest_type = come_guest_type;
                    $scope.form_scene_edit.checkValidity().then(function () {
                        pinCodeModal(sceneRecord, 'save', $scope.record_create_copy, $scope.record_create_copy.status == 1 ? "新增開場成功" : "新增離場成功").then(function () {
//                        sceneRecord.save($scope.record_create_copy).$promise.then(function(){
//                            var txt_tip = $scope.record_create_copy.status = 1 ? "新增開場" : "新增離場";
                            $scope.isDesabled = false;
//                            topAlert.success(txt_tip+"成功");
                            $modalInstance.close();
                        }, function () {
                            $scope.isDesabled = false;
                        })
                    });
                }

                $scope.cancel = function () {
                    $modalInstance.dismiss();
                }


            }]).controller('screeningDetailWindowCtrl', ['$scope', '$filter', '$state', '$stateParams', '$modal', '$modalInstance', '$location', 'user', 'getDate', 'windowItems', 'globalFunction', 'tmsPagination', 'topAlert', 'sceneRecord', 'sceneStatus', 'hallName', 'fundSourceTypes', 'rollingTypes', 'desk', 'pinCodeModal', 'sceneRecordShift', 'mainScene', 'rollingRecord', 'matchesStatus', 'outSceneWord', 'scene_record_id', 'main_scene_id', 'currentShift', 'deferred', 'sceneSmsTypes', 'shift_date', 'shift_mark_id', 'formatNumber',
            function ($scope, $filter, $state, $stateParams, $modal, $modalInstance, $location, user, getDate, windowItems, globalFunction, tmsPagination, topAlert, sceneRecord, sceneStatus, hallName, fundSourceTypes, rollingTypes, desk, pinCodeModal, sceneRecordShift, mainScene, rollingRecord, matchesStatus, outSceneWord, scene_record_id, main_scene_id, currentShift, deferred, sceneSmsTypes, shift_date, shift_mark_id, formatNumber) {
                //場面數記錄點擊詳細進入的頁面
                $scope.hall_id = user.hall.id;
                $scope.matchesStatus = matchesStatus.items;
                $scope.sceneStatus = sceneStatus.items;
                $scope.fundSourceTypes = fundSourceTypes;
                $scope.rollingTypes = rollingTypes.items;
                $scope.sceneSmsTypes = sceneSmsTypes.items;
                $scope.shift_date = currentShift.data ? currentShift.data.shift_date : "";
                $scope.shiftDate = shift_date;
                $scope.shift_mark_id = shift_mark_id;
                $scope.now_shift_mark_id = currentShift.data ? currentShift.data.id : "";
                $scope.isDesabled = false;
                $scope.isShowFlag = false;
                $scope.isWaitingFalg = true;
                $scope.common_currency_name = '';
                $scope.come_guest_type = "";
                $scope.come_guest_names = [{selected: "", name: "私營"}, {selected: "", name: "電投"}, {
                    selected: "",
                    name: "現場"
                }, {selected: "", name: "其它"}];
                $scope.type_sms = [];

                //$scope.tab_id = scene_record_id; //子場次ID
                $scope.up_in_capital_scene = $scope.up_loss_win_amount = "0";
                outSceneWord.query().$promise.then(function (_outSceneWord) {
                    $scope.inSceneWords = _.where(_outSceneWord, {type: "1"});//類型
                    $scope.inSceneWords_data = _.findWhere($scope.inSceneWords, {o_word: ""});
                    $scope.inSceneWords_empty = $scope.inSceneWords_data ? $scope.inSceneWords_data.id : "";

                    $scope.outSceneWords = _.where(_outSceneWord, {type: "0"});//操作
                    $scope.outSceneWords_data = _.findWhere($scope.outSceneWords, {o_word: ""});
                    $scope.outSceneWords_empty = $scope.outSceneWords_data ? $scope.outSceneWords_data.id : "";
                });

                //查詢轉碼信息
                $scope.pagination = tmsPagination.create();
                $scope.pagination.resource = rollingRecord;
                $scope.select = function (page) {
                    if ($scope.agent_record.is_scene_open == 0) {
                        $scope.rollings = $scope.pagination.select(page, {rolling_id: $scope.agent_record.rolling_id/*, status:'1'*/});
                    } else {
                        $scope.rollings = [];
                    }
                }
                $scope.agent_recordinit;
                //主场次信息
                $scope.main_scene_select = function () {
                    //globalFunction.generateUrlParams({sceneRecords:{/*sceneRecordSubs:""*/}}
                    mainScene.get({id: main_scene_id}).$promise.then(function (agent) {
                        if (agent) {
                            $scope.is_scene_open = agent.is_scene_open;
                            $scope.child_scene_select(agent.is_scene_open)
                            $scope.agent_record = agent;
                            $scope.agent_recordinit = angular.copy($scope.agent_record)

                            $scope.agent_record_copy = angular.copy(agent);
                            if ($scope.agent_record.come_guest_type) {
                                $scope.come_guest_types = $scope.agent_record.come_guest_type.split("，");
                                _.each($scope.come_guest_types, function (come_guest_type) {
                                    if (come_guest_type == '私營') {
                                        $scope.come_guest_names[0].selected = true;
                                    } else if (come_guest_type == '電投') {
                                        $scope.come_guest_names[1].selected = true;
                                    } else if (come_guest_type == '現場') {
                                        $scope.come_guest_names[2].selected = true;
                                    } else {
                                        $scope.come_guest_names[3].selected = true;
                                        $scope.agent_record.come_guest_name = come_guest_type;
                                    }
                                })
                            }
                        }
                    });
                }

                //子場次status 1開場2 離場
                $scope.child_scene_select = function (is_scene_open) {
                    sceneRecord.query(globalFunction.generateUrlParams({
                        main_scene_id: main_scene_id,
                        sort: 'create_time asc'
                    }/*,{sceneShiftRecord:{}}*/))
                        .$promise.then(function (_sceneRecord) {

                            $scope.tabs = [];
                            $scope.index = 0;
                            var active = false;
                            _.each(_sceneRecord, function (tab, index) {
                                if (tab.id == scene_record_id) {
                                    $scope.index = index;
                                    active = true;
                                } else {
                                    active = false;
                                }
                                $scope.tabs.push(active);

                            });

                            //加載第一個場次
                            if (scene_record_id) {
                                $scope.scene_selected(scene_record_id, $scope.index);
                            } else {
                                $scope.scene_selected(_sceneRecord[0].id, $scope.index);
                            }
                            if (is_scene_open == "0") {
                                _sceneRecord.push({id: "", scene_no: "轉碼詳細"});
                            }
                            $scope.sceneRecords = _sceneRecord;
//                            _.each($scope.sceneRecords,function(sceneRecord){
//                                sceneRecordShift.query(globalFunction.generateUrlParams({scene_record_id: sceneRecord.id,sort:"create_time ASC"}, {})).$promise.then(function(sceneRecordShifts){
//                                    if(sceneRecordShifts.length>1){
//                                        _.each(sceneRecordShifts,function(_sceneRecordShift){
//                                            if(sceneRecordShifts.length >1){
//                                                $scope._sceneRecordShiftIDs = _.pluck(sceneRecordShifts, 'id');
//                                                var num = _.indexOf($scope._sceneRecordShiftIDs, _sceneRecordShift.id);
//                                                if(num>0){
//                                                    $scope.up_in_capital_scene = sceneRecordShifts[num-1].in_capital_scene;
//                                                    $scope.up_loss_win_amount = sceneRecordShifts[num-1].loss_win_amount;
//                                                }
//                                            }
//                                        });
//                                    }
//                                });
//                            });

                        });
                }

                if (main_scene_id) {
                    $scope.main_scene_select();
                    //$scope.child_scene_select();
                }

                //离场开场时间
                $scope.new_record = {
                    in_time: "",
                    out_time: ""
                }
                $scope.new_recordinit
                $scope.outCaptals_content = [];
                $scope.inCaptals_content = [];
                $scope.inCaptals_contentinit;
                $scope.outCaptals_contentinit;

                //選擇加載場次詳細
                $scope.scene_selected = function (id, index, common_currency_name) {
                    $scope.fenke_id = id;
                    if ($scope.sceneRecord && id) {
                        //新數據
                        $scope.new_content = {
                            guest_name: $scope.sceneRecord.guest_name ? $scope.sceneRecord.guest_name : "",
                            desk_id: $scope.sceneRecord.desk_id ? $scope.sceneRecord.desk_id : "",
                            in_time: $scope.sceneRecord.in_time ? getDate($scope.sceneRecord.in_time, true) : "",
                            out_time: $scope.sceneRecord ? getDate($scope.sceneRecord.out_time, true) : "",
                            remark: $scope.sceneRecord.remark ? $scope.sceneRecord.remark : "",
                            status: $scope.sceneRecord.status
                        }
                        //老數據
                        $scope.old_content = {
                            guest_name: $scope.old_sceneRecord.guest_name ? $scope.old_sceneRecord.guest_name : "",
                            desk_id: $scope.old_sceneRecord.desk_id ? $scope.old_sceneRecord.desk_id : "",
                            in_time: $scope.old_sceneRecord.in_time ? getDate($scope.old_sceneRecord.in_time, true) : "",
                            out_time: $scope.old_sceneRecord ? getDate($scope.old_sceneRecord.out_time, true) : "",
                            remark: $scope.old_sceneRecord.remark ? $scope.old_sceneRecord.remark : "",
                            status: $scope.old_sceneRecord.status
                        }
                        //如果点击同一个模块
                        if (!($scope.sceneRecord.id == id)) {
                            //判斷是否修改過
                            if (angular.equals($scope.new_content, $scope.old_content) &&
                                angular.equals($scope.inCaptals_content, $scope.old_inCaptals_content) &&
                                angular.equals($scope.outCaptals_content, $scope.old_outCaptals_content)) {
                                $scope.loanChildScene(id, index, common_currency_name);
                                $scope.tabs[index] = true;
                            } else {
                                $scope.tabs[$scope.sceneRecord.index] = true;
                                windowItems.confirm('系統提醒', '請先保存要修改的信息，切換其他場次將重載數據', function () {
                                    //$scope.tabs[index] = true;
                                    $scope.loanChildScene(id, index);
                                    $scope.tabs[index] = true;
                                }, function () {
                                    $scope.tabs[$scope.sceneRecord.index] = true;
                                });
                            }
                        }
                    } else {
                        $scope.loanChildScene(id, index, common_currency_name);
                    }
                }
                //監控幣值
                $scope.$watch('sceneRecord.common_currency_name', function (new_value, old_value) {
                    $scope.common_currency_name = $scope.sceneRecord ? $scope.sceneRecord.common_currency_name : "";
                })
                //監控客源
                $scope.come_guest_name = "";
                $scope.comeGuestName = function (val) {
                    if (val == $scope.come_guest_name) {
                        $scope.sceneRecord.come_guest_name = "";
                    }
                    $scope.come_guest_name = val;
                }

                //清空方法
                $scope.emptyStr = function (type) {
                    if (type == 1) {
                        $scope.agent_record.common_currency_name = "";
                    } else if (type == 2) {
                        $scope.sceneRecord.desk_no = "";
                        $scope.sceneRecord.desk_id = "";
                    } else {
                        $scope.sceneRecord.gap = "";
                    }
                }
                $scope.sceneRecordinit
                //切換記載子場次
                $scope.loanChildScene = function (id, index, common_currency_name) {
                    $scope.isWaitingFalg = true;
                    if (id) {
                        //場面數
                        $scope.isTabShow = true;
                        $scope.sceneRecord = [];
                        sceneRecord.get(globalFunction.generateUrlParams({"id": id}, {
                            /*sceneRecordSubs: {},sceneShiftRecords: {},*/
                            inCapitals: {},
                            outCapitals: {}
                        }))
                            .$promise.then(function (sceneRecord) {
                                $scope.fenke_id = sceneRecord.id;
                                if (sceneRecord.desk_id) {
                                    desk.get({id: sceneRecord.desk_id}).$promise.then(function (_desk) {
                                        if (_desk) {
//                                            sceneRecord.desk_no = _desk.layer+"區"+_desk.desk_no;
                                            sceneRecord.desk_no = "包" + _desk.desk_no;
                                        }
                                    });
                                }
                                $scope.is_add=sceneRecord.is_add;
                                $scope.inCapitalsLength=sceneRecord.inCapitals.length;
                                //入場本金
                                $scope.inCaptals_content = sceneRecord.inCapitals.length == 0 ?
                                    [{
                                        id: "",
                                        agent_info_id: sceneRecord.agent_info_id,
                                        amount: "",
                                        funds_type_id: "",
                                        funds_type: "",
                                        scene_record_shift_id: "",
                                        type: 1,
                                        shift_date: $scope.shift_date,
                                        is_delete: "0",
                                        amount_seq: 0
                                    }] : sceneRecord.inCapitals;

                                if ($scope.inCaptals_content.length != 0) {//主要用於格式本金詳細的入場本金
                                    _.each($scope.inCaptals_content, function (inCaptal) {
                                        inCaptal.amount = formatNumber(inCaptal.amount);
                                    })
                                }

                                $scope.inCaptals_contentinit = angular.copy($scope.inCaptals_content);
                                //離場本金處理
                                $scope.old_inCaptals_content = angular.copy($scope.inCaptals_content);
                                if (sceneRecord.outCapitals.length != 0) {//主要用於格式離場本金
                                    _.each(sceneRecord.outCapitals, function (outCaptal) {
                                        outCaptal.amount = formatNumber(outCaptal.amount);
                                    })
                                }
                                $scope.outCaptals_content = sceneRecord.outCapitals.length == 0 ? [{
                                    id: "",
                                    agent_info_id: "",
                                    out_scene_word_id: $scope.outSceneWords_empty,
                                    "o_word": "",
                                    funds_type_id: $scope.inSceneWords_empty,
                                    funds_type: "",
                                    amount: 0,
                                    amount_seq: 0
                                }] : sceneRecord.outCapitals;
                                _.each($scope.outCaptals_content, function (outCaptals_content_sub) {
                                    if (!outCaptals_content_sub.amount) {
                                        outCaptals_content_sub.amount = 0;
                                    }
                                })

                                $scope.old_outCaptals_content = angular.copy($scope.outCaptals_content);

                                sceneRecord.in_time = sceneRecord.in_time ? new Date(Date.parse(sceneRecord.in_time.replace(/-/g, "/"))) : "";
                                $scope.new_record.in_time = sceneRecord.in_time;

                                sceneRecord.out_time = sceneRecord.out_time ? new Date(Date.parse(sceneRecord.out_time.replace(/-/g, "/"))) : "";
                                $scope.new_record.out_time = sceneRecord.out_time;

                                $scope.isShowFlag = sceneRecord.status == 2 ? true : false;
                                sceneRecord.index = index;
                                $scope.sceneRecord = sceneRecord;

                                if (!angular.isUndefined(common_currency_name)) {
                                    $scope.sceneRecord.common_currency_name = common_currency_name;
                                }
                                //abc
                                $scope.sceneRecordinit = angular.copy($scope.sceneRecord)
                                $scope.outCaptals_contentinit = angular.copy($scope.outCaptals_content)
                                $scope.new_recordinit = angular.copy($scope.new_record)

                                $scope.outScene('all');
                                $scope.shift_select(id);
                                $scope.isWaitingFalg = false;

                            });

                    } else {
                        $scope.sceneRecord.id = id;
                        $scope.select();
                        $scope.isTabShow = false;
                    }
                }

                //查询场次截更
                $scope.shift_select = function (scene_record_id) {
                    sceneRecordShift.query(globalFunction.generateUrlParams({
                        scene_record_id: scene_record_id,
                        sort: "create_time ASC"/*, is_sys:'0'*/
                    }, {inCapitals: {}, outCapitals: {}, shiftMark: {}}))
                        .$promise.then(function (_sceneRecordShift) {
                            //隐藏更
                            $scope.sceneHidRecordShifts = _.findWhere(_sceneRecordShift, {is_sys: "1"});
                            $scope.sceneRecordShifts = _.where(_sceneRecordShift, {is_sys: "0"});
                            $scope.scene_shift_date = $scope.sceneHidRecordShifts ? $scope.sceneHidRecordShifts.shift_date : $scope.scene_shift_date;
//                            $scope.scene_shift_date = $scope.sceneHidRecordShifts ? $scope.sceneHidRecordShifts.shift_date : shift_date
                            if ($scope.sceneRecord.status == "1") {
                                $scope.sceneRecord.out_time = $scope.scene_shift_date ? new Date(Date.parse($scope.scene_shift_date.replace(/-/g, "/"))) : "";
                            }
                            $scope.old_sceneRecord = angular.copy($scope.sceneRecord);
                            $scope.up_in_capital_scene = $scope.up_loss_win_amount = 0;
                            if (_sceneRecordShift.length > 1) {
                                $scope._sceneRecordShiftDates = _.pluck(_sceneRecordShift, 'shift_date');
                                $scope.shiftDate = $filter('date')($scope.shiftDate, 'yyyy-MM-dd');
//                                _.each(_sceneRecordShift,function(_scene_record_shift){
                                var num = _.indexOf($scope._sceneRecordShiftDates, $scope.shiftDate);
                                if (num > 0) {
                                    $scope.up_in_capital_scene = _sceneRecordShift[num - 1].in_capital_scene;
                                    $scope.up_loss_win_amount = _sceneRecordShift[num - 1].loss_win_amount;
                                }
//                                });
                            }
                        });
                }

                $scope.add_capital = function (type) {
                    if (type == 'in') {
                        //init_inCapitals.agent_info_id = $scope.sceneRecord.agent_info_id;
                        $scope.inCaptals_content.push({
                            id: "",
                            agent_info_id: $scope.sceneRecord.agent_info_id,
                            amount: "",
                            funds_type_id: "",
                            funds_type: "",
                            scene_record_shift_id: "",
                            type: 1,
                            shift_date: $scope.shift_date,
                            is_delete: "0",
                            amount_seq: $scope.inCaptals_content.length
                        });
                    } else if (type == 'out') {
                        $scope.outCaptals_content.push({
                            id: "",
                            agent_info_id: "",
                            out_scene_word_id: $scope.outSceneWords_empty,
                            "o_word": "",
                            funds_type_id: $scope.inSceneWords_empty,
                            funds_type: "",
                            amount: 0,
                            amount_seq: $scope.outCaptals_content.length
                        });
                    }
                }

                $scope.remove_capital = function (record, index, type) {
                    if (type == "in") {
                        //都不為空
                        /* && record.amount && record.shift_date*/
                        if (record.id) {
                            record.is_delete = "1";
                        } else {
                            $scope.inCaptals_content.splice(index, 1);
                        }

                    } else if (type == 'out') {
                        $scope.outCaptals_content.splice(index, 1);
                    }
                    $scope.outScene(type);
                }

                //入場和離場理算
                $scope.scene_record_data = {
                    in_capital_total: "",
                    in_capital_join: "",
                    loss_win_amount: "",
                    out_capital_total: "",
                    out_capital_total_copy: "",
                    out_capital_join: ""
                }
                $scope.outScene = function (type) {
                    //sceneRecord
                    var in_capital_total = 0;
                    var in_capital_join = [];
                    var out_capital_join = [];
                    var out_capital_total = 0;
                    var out_capital_total_copy = "";
                    if (type == 'in' || type == 'all') {
                        $scope.inCaptals_content_data = _.where($scope.inCaptals_content, {is_delete: "0"});
                        if ($scope.inCaptals_content_data.length > 0) {
                            _.each($scope.inCaptals_content_data, function (_inCapitals) {
                                _inCapitals.shift_date = getDate(_inCapitals.shift_date);
                                if (_inCapitals.amount.toString() != "" || _inCapitals.amount != null || _inCapitals.amount != undefined) {
                                    in_capital_join.push(_inCapitals.amount + "" + (_inCapitals.funds_type ? _inCapitals.funds_type : ""));
                                    in_capital_total += Number(_inCapitals.amount.toString().replace(/,/g, ''));
                                }
                            });
                            //計算屬
                            if ($scope.scene_record_data.out_capital_total_copy.toString() == "" || $scope.scene_record_data.out_capital_total_copy == null || $scope.scene_record_data.out_capital_total_copy == undefined) {
                                $scope.sceneRecord.loss_win_amount = "";
                            } else {
                                $scope.sceneRecord.loss_win_amount =$scope.scene_record_data.out_capital_total.toString().replace(/,/g, '') - in_capital_total;
                            }
                            //abc
                            $scope.scene_record_data.in_capital_total = $scope.sceneRecord.in_capital_total = in_capital_total;
                            $scope.scene_record_data.in_capital_join = $scope.sceneRecord.in_capital_join = in_capital_join.join(" + ");
                            $scope.sceneRecordinit = angular.copy($scope.sceneRecord)
                        }
                    }
                    if (type == 'out' || type == 'all') {
                        if ($scope.outCaptals_content.length > 0) {
                            _.each($scope.outCaptals_content, function (_outCapitals) {
                                if (_outCapitals.amount.toString() != "" || _outCapitals.amount != null || _outCapitals.amount != undefined) {
                                    out_capital_join.push(_outCapitals.o_word + "" + _outCapitals.amount + "" + (_outCapitals.funds_type ? _outCapitals.funds_type : ""));
                                    out_capital_total += Number(_outCapitals.amount.toString().replace(/,/g, ''));
                                    out_capital_total_copy += Number(_outCapitals.amount.toString().replace(/,/g, ''));
                                }
                            });
                            //計算本場上下屬
                            if (out_capital_total_copy.toString() == "" || out_capital_total_copy == null || out_capital_total_copy == undefined) {
                                $scope.sceneRecord.loss_win_amount = "";
                            } else {
                                $scope.sceneRecord.loss_win_amount = out_capital_total - $scope.scene_record_data.in_capital_total;
                            }
                            //abc
                            $scope.scene_record_data.out_capital_total_copy = out_capital_total;
                            $scope.scene_record_data.out_capital_total = $scope.sceneRecord.out_capital_total = out_capital_total;

                            $scope.scene_record_data.out_capital_join = $scope.sceneRecord.out_capital_join = out_capital_join.join(" + ");
                            $scope.sceneRecordinit = angular.copy($scope.sceneRecord)
                        }
                    }
                }

                /**
                 * 類型和操作
                 * @param record
                 * @param type == ty(類型) ？ op（操作）
                 */

                $scope.capitals_change = function (record, type, op_type) {
                    var i = 0;
                    var j = 0;
                    if (record.o_word !== undefined) {
                        if ($scope.type_sms == "") {
                            $scope.type_sms.push(record);
                        } else {
                            _.each($scope.type_sms, function (e) {

                                if (record.$$hashKey !== e.$$hashKey) {
                                    i++;
                                } else {
                                    j++
                                }

                            })
                            if (i >= 1 && j == 0) {
                                $scope.type_sms.push(record);
                            }

                        }
                    }

                    if (type == "ty") {
                        if (record.funds_type_id) {
                            var inCapitals_data = _.findWhere($scope.inSceneWords, {id: record.funds_type_id});
                            record.funds_type_id = record.funds_type_id;
                            record.funds_type = inCapitals_data.o_word;
                        } else {
                            record.funds_type_id = "";
                            record.funds_type = "";
                        }


                    } else if (type == "op") {
                        if (record.out_scene_word_id) {
                            var outCapitals_data = _.findWhere($scope.outSceneWords, {id: record.out_scene_word_id});
                            record.out_scene_word_id = record.out_scene_word_id;
                            record.o_word = outCapitals_data.o_word;
                        } else {
                            record.out_scene_word_id = "";
                            record.o_word = "";
                        }
                    }
                    $scope.outScene(op_type);
                }

                //場次狀態監聽
                /*$scope.status_change = function(){
                 if($scope.sceneRecord.status==2){ //离场
                 if(!$scope.sceneRecord.desk_id){
                 topAlert.warning("請選擇枱號");
                 $scope.sceneRecord.status = 1;
                 return;
                 }
                 }
                 }*/

                $scope.getNowDate = function (type) {
                    var now_date = new Date();
                    var now_date_format = now_date;
                    if (type == 'in') {
                        if ($scope.sceneRecord.in_time) {
                            var date = $filter("date")($scope.sceneRecord.in_time, 'yyyy-MM-dd');
                            var time = $filter("date")(now_date, 'HH:mm')
                            /*if($scope.new_record.in_time){
                             var time = $filter("date")($scope.new_record.in_time, 'HH:mm')
                             }else{*/
                            //var time = $filter("date")(now_date, 'HH:mm')
                            //}
                            now_date_format = date + " " + time;
                            //return false;
                            now_date_format = new Date(Date.parse(now_date_format.replace(/-/g, "/")))
                        } else {
                            now_date_format = now_date;
                        }
                        $scope.new_record.in_time = $scope.sceneRecord.in_time = now_date_format;
                    } else {

                        if ($scope.sceneRecord.out_time) {
                            var date = $filter('date')($scope.sceneRecord.out_time, 'yyyy-MM-dd');
                            var time = $filter('date')(now_date, 'HH:mm');
                            /*if($scope.new_record.out_time){
                             var time = $filter("date")($scope.new_record.out_time, 'HH:mm')
                             }else{
                             var time = $filter("date")(now_date, 'HH:mm')
                             }*/
                            now_date_format = date + " " + time;
                            now_date_format = new Date(Date.parse(now_date_format.replace(/-/g, "/")));
                        } else {
                            date = $scope.shift_date + " " + $filter('date')(now_date, 'HH:mm');
                            now_date_format = $scope.shift_date ? new Date(Date.parse(date.replace(/-/g, "/"))) : "";
                        }
                        $scope.new_record.out_time = $scope.sceneRecord.out_time = now_date_format;
                    }

                    $scope.new_recordinit = angular.copy($scope.new_record)

                }

                //分客
                $scope.branchGuest = function () {
                    var branch_record = {
                        main_scene_id: main_scene_id,
                        agent_info_id: $scope.sceneRecord.agent_info_id,
                        status: 1
                    }
                    pinCodeModal(sceneRecord, 'save', branch_record, '分客成功，請完善信息！').then(function () {
                        deferred.notify();//监听是否成功刷新父级列表
                        sceneRecord.query({
                            main_scene_id: main_scene_id,
                            status: '1',
                            sort: 'create_time asc'
                        }).$promise.then(function (_sceneRecord) {
                                if ($scope.is_scene_open == 0) {
                                    _sceneRecord.push({id: "", scene_no: "轉碼詳細"})
                                }
                                $scope.sceneRecords = _sceneRecord;

                            });
                    })
                }

                //新增截更
                $scope.sceneRecordSource = sceneRecord;
                $scope.addShift = function (op_type, shift) {
                    shift = shift == undefined ? "" : shift;
                    var shiftModal;
                    shiftModal = $modal.open({
                        templateUrl: "views/scene/scene-shift-create.html",
                        controller: 'sceneShiftCreateCtrl',
                        resolve: {
                            shift_data: function () {
                                return shift;
                            },
                            scene_record_data: function () {
                                return $scope.sceneRecord;
                            },
                            main_scene_data: function () {
                                return $scope.agent_record;
                            },
                            op_type: function () {
                                return op_type;
                            },
                            scene_shift_date: function () {
                                return $scope.scene_shift_date;
                            }
                        }
                    });

                    shiftModal.result.then(function () {
                        deferred.notify();//监听是否成功刷新父级列表
                        $scope.sceneRecordSource.get(globalFunction.generateUrlParams({id: $scope.sceneRecord.id}, {
                            sceneRecordSubs: {},
                            sceneShiftRecord: {}
                        }))
                            .$promise.then(function (sceneRecord) {
                                //abc
                                $scope.sceneRecord.inCapitals = sceneRecord.inCapitals;
                                // $scope.sceneRecord.sceneShiftRecord = sceneRecord.sceneShiftRecord;
                                $scope.shift_select(sceneRecord.id);
                                $scope.sceneRecordinit = angular.copy($scope.sceneRecord)
                            });
                    });
                }

                $scope.removeShift = function (id) {
                    pinCodeModal(sceneRecordShift, 'delete', {id: id}, '刪除成功！').then(function () {
                        deferred.notify();//监听是否成功刷新父级列表
                        sceneRecord.get(globalFunction.generateUrlParams({id: $scope.sceneRecord.id}, {
                            sceneRecordSubs: {},
                            sceneShiftRecord: {}
                        }))
                            .$promise.then(function (sceneRecord) {
                                //abc
                                $scope.sceneRecord.sceneRecordSubs = sceneRecord.sceneRecordSubs;
                                //$scope.sceneRecord.sceneShiftRecord = sceneRecord.sceneShiftRecord;
                                $scope.shift_select(sceneRecord.id);
                                $scope.sceneRecordinit = angular.copy($scope.sceneRecord)
                            });
                    })
                }

                //選擇枱號
                $scope.showDesk = function () {
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/scene/show-desk-table.html",
                        controller: 'showDeskTableCtrl',
                        windowClass: 'tlg-modal',
                        resolve: {
                            id: function () {
                                return "";
                            }
                        }
                    });
                    modalInstance.result.then((function (desk) {
                        if (desk) {
                            //abc
                            $scope.sceneRecord.desk_id = desk.id;
//                            $scope.sceneRecord.desk_no =  desk.layer+"區"+desk.desk_no;
                            $scope.sceneRecord.desk_no = "包" + desk.desk_no;
                            $scope.sceneRecordinit = angular.copy($scope.sceneRecord)
                        }
                    }));
                }

                //修改或撤銷本金詳細
                /*$scope.edit_capital = function(capital){
                 //開場本金可以修改
                 if(capital.type==1){
                 $scope.capital_amount = angular.copy(capital.amount);
                 capital.capital_edit_type ==undefined ? false : true;
                 capital.capital_edit_type = !capital.capital_edit_type;
                 //log(capital.capital_edit_type);
                 }else if(capital.type==2){ //中場加彩只能撤銷
                 capital.capital_revoke_type = !capital.capital_revoke_type;
                 }
                 }*/

                //修改本金只能改少
                $scope.editCapitalKeyup = function (capital) {
                    if (Number(capital.amount) > Number($scope.capital_amount)) {
                        capital.amount = $scope.capital_amount;
                    }
                }

                //ff離場發送SMS
                $scope.estimateSendSMS = function () {
                    $scope.json_type_sms = angular.toJson($scope.outCaptals_content);

//                    var  sceneModify=false
//                    if($scope.agent_record.common_currency_name!=$scope.agent_recordinit.common_currency_name)
//                    {
//
//                        sceneModify=true
//                    }
//                    if($scope.sceneRecord.guest_name!=$scope.sceneRecordinit.guest_name)
//                    {
//
//                        sceneModify=true
//                    }
//                   if($scope.sceneRecord.desk_no!=$scope.sceneRecordinit.desk_no)
//                    {
//
//                        sceneModify=true
//                    }
//                    if($scope.sceneRecord.gap!=$scope.sceneRecordinit.gap)
//                    {
//
//                        sceneModify=true
//                    }
//                    if($scope.sceneRecord.remark!=$scope.sceneRecordinit.remark)
//                    {
//
//                        sceneModify=true
//                    }
//
//                    if($filter("date")($scope.new_record.in_time,'hh:mm')!=$filter("date")($scope.new_recordinit.in_time,'hh:mm'))
//                    {
//
//                        sceneModify=true
//                    }
//
//                    if($filter("date")($scope.new_record.out_time,'hh:mm')!=$filter("date")($scope.new_recordinit.out_time,'hh:mm'))
//                    {
//                        sceneModify=true
//                    }
//
//                    //本金詳細
//                    if($scope.inCaptals_content.length!=$scope.inCaptals_contentinit.length)
//                    {
//
//                        sceneModify=true
//                    }
//                    else
//                    {
//                        $.each($scope.inCaptals_content,function(index,val)
//                        {
//                            if(val.amount!=$scope.inCaptals_contentinit[index].amount)
//                            {
//
//                                sceneModify=true
//                            }
//                            if(val.funds_type_id!=$scope.inCaptals_contentinit[index].funds_type_id)
//                            {
//
//                                sceneModify=true
//                            }
//
//                            if(val.shift_date!=$scope.inCaptals_contentinit[index].shift_date)
//                            {
//
//                                sceneModify=true
//                            }
//                        })
//                    }
//                    if($scope.outCaptals_content.length!=$scope.outCaptals_contentinit.length)
//                    {
//
//                        sceneModify=true
//                    }
//                    else
//                    {
//                        $.each($scope.outCaptals_content,function(index,val)
//                        {
//                            if(val.out_scene_word_id!=$scope.outCaptals_contentinit[index].out_scene_word_id)
//                            {
//
//                                sceneModify=true
//                            }
//                            if(val.amount!=$scope.outCaptals_contentinit[index].amount)
//                            {
//
//                                sceneModify=true
//                            }
//                            if(val.funds_type_id!=$scope.outCaptals_contentinit[index].funds_type_id)
//                            {
//
//                                sceneModify=true
//                            }
//
//                        })
//                    }
//                    if(sceneModify)
//                    {
////修改過
//                        $scope.submit(function()
//                        {
//                            if($scope.sceneRecord) {
//                                $location.path('/scene/screening-sms/'+$scope.agent_record.agent_info_id+'/'+ main_scene_id);
//                            }else{
//                                $location.path('/scene/screening-sms/'+scene_record_id);
//                            }
//                            $modalInstance.close();
//                        })
//                    }
//                    else
//                    {
//                        if($scope.sceneRecord) {
//                            $location.path('/scene/screening-sms/'+$scope.agent_record.agent_info_id+'/'+ main_scene_id);
//                        }else{
//                            $location.path('/scene/screening-sms/'+scene_record_id);
//                        }
//                        $modalInstance.close();
//                    }
                    //windowItems.confirm("系統提醒","確定發送SMS",function(){

                    //});
                    if ($scope.sceneRecord) {
                        $location.path('/scene/screening-sms/' + $scope.agent_record.agent_info_id + '/' + main_scene_id + '/' + $scope.agent_record.common_currency_name + '/' + $scope.json_type_sms + '/' + $scope.fenke_id);
                    } else {
                        $location.path('/scene/screening-sms/' + scene_record_id + '/' + $scope.agent_record.common_currency_name + '/' + $scope.json_type_sms + '/' + $scope.fenke_id);
                    }
                    $modalInstance.close();
                }


                //保存場面記錄
                $scope.scene_edit_url = globalFunction.getApiUrl("scene/scenerecord");
                $scope.submit = function () {
                    if ($scope.isDesabled) {
                        return false;
                    }
                    $scope.isDesabled = true;
                    $scope.sceneRecord_copy = angular.copy($scope.sceneRecord);
                    $scope.sceneRecord_copy.in_time = $scope.sceneRecord_copy.in_time ? getDate($scope.sceneRecord_copy.in_time, true) : "";

                    $scope.sceneRecord_copy.out_time = $scope.sceneRecord_copy.out_time ? getDate($scope.sceneRecord_copy.out_time) : "";
                    var new_out_time = angular.copy($scope.new_record.out_time);
                    var new_out_time = new_out_time ? $filter('date')(new_out_time, 'HH:mm') : '';
                    $scope.sceneRecord_copy.out_time = $scope.sceneRecord_copy.out_time + " " + new_out_time;
                    //$scope.new_record.out_time = sceneRecord.out_time;
                    _.each($scope.inCaptals_content, function (_inCapital, $index) {
                        _inCapital.shift_date = getDate(_inCapital.shift_date);
                        _inCapital.amount_seq = $index;
                    });

                    //給入場本金對應賦值截更ID
                    _.each($scope.inCaptals_content, function (_inCapital) {
                        //查找當前更的本金
                        var shift_data = _.findWhere($scope.sceneRecordShifts, {shift_date: _inCapital.shift_date});
                        if (shift_data) {
                            _inCapital.scene_record_shift_id = shift_data.id;
                        } else {
                            _inCapital.scene_record_shift_id = "";
                        }
                    });

                    if ($scope.sceneRecord.status == 1 &&
                        $scope.outCaptals_content.length == 1 &&
                        $scope.outCaptals_content[0].out_scene_word_id == "" &&
                        $scope.outCaptals_content[0].amount == "") {
                        $scope.outCaptals_content_value = [];
                    } else {
                        $scope.outCaptals_content_value = $scope.outCaptals_content;
                        $scope.outCaptals_content_value[0].amount_seq = 0;
                    }
                    //客源
                    var come_guest_type = "";
                    var type_num = "";
                    _.each($scope.come_guest_names, function (come_guest_name, index) {
                        if (come_guest_name.selected && index == 0) {
                            come_guest_type += "私營";
                            type_num = 1;
                        } else if (come_guest_name.selected && index == 1) {
                            come_guest_type += type_num == 1 ? "，" : "";
                            come_guest_type += "電投";
                            type_num = 1;
                        } else if (come_guest_name.selected && index == 2) {
                            come_guest_type += type_num == 1 ? "，" : "";
                            come_guest_type += "現場";
                            type_num = 1;
                        } else if (come_guest_name.selected && index == 3 && $scope.agent_record.come_guest_name) {
                            come_guest_type += type_num == 1 ? "，" : "";
                            come_guest_type += $scope.agent_record.come_guest_name;
                        }
                    })
                    //離場本金
                    //var outCapitals_records = []；
                    var scene_record_update = {
                        id: $scope.sceneRecord.id,
                        status: $scope.sceneRecord.status,
                        come_guest_type: come_guest_type,
                        common_currency_name: $scope.agent_record.common_currency_name,
                        gap: $scope.sceneRecord.gap,
                        in_time: $scope.sceneRecord.in_time ? $filter('date')(new Date($scope.sceneRecord.in_time), 'yyyy-MM-dd HH:mm') : "",
                        out_time: $scope.sceneRecord_copy.out_time ? $scope.sceneRecord_copy.out_time : "",
                        desk_id: $scope.sceneRecord.desk_id ? $scope.sceneRecord.desk_id : "",
                        guest_name: $scope.sceneRecord.guest_name ? $scope.sceneRecord.guest_name : "",
                        remark: $scope.sceneRecord.remark == null ? "" : $scope.sceneRecord.remark,
                        inCapitals: angular.copy($scope.inCaptals_content),
                        outCapitals: angular.copy($scope.outCaptals_content_value),
                        //"sceneShiftRecords": shift_content,
                        shift_date: $filter('date')($scope.shiftDate, 'yyyy-MM-dd'),
                        shift_mark_id: $scope.now_shift_mark_id,
                        manila_percent: $scope.agent_record.manila_percent,
                        pin_code: $scope.sceneRecord.pin_code,
                        is_add: $scope.inCapitalsLength == 0 ? $scope.is_add : $scope.inCapitalsLength < $scope.inCaptals_content.length ? 1 : $scope.is_add

                    }
                    //return false;
                    $scope.form_scene_edit.checkValidity().then(function () {
                        _.each(scene_record_update.inCapitals,function(d){//清除千分位
                            if(d.amount != 0){
                                d.amount = d.amount.replace(/,/g, '');
                            }
                        })
                        _.each(scene_record_update.outCapitals,function(d){//清除千分位
                            if(d.amount != 0) {
                                d.amount = d.amount.replace(/,/g, '');
                            }
                        })
                        pinCodeModal(sceneRecord, 'update', scene_record_update, '修改場面記錄成功！').then(function () {
                            $scope.isDesabled = false;
//                            topAlert.success("修改場面記錄成功");
                            deferred.notify();//监听是否成功刷新父级列表
                            //如果全部
                            if ($scope.sceneRecord.status == 2) {
                                //$state.go($state.current, {}, {reload: true})
                                $scope.estimateSendSMS();
                            } else {
                                $modalInstance.close();
                            }
                            //刷新場次詳細 #TODO
                            $scope.loanChildScene($scope.sceneRecord.id);
                            $scope.form_scene_edit.clearErrors();

                        }, function () {
                            $scope.isDesabled = false;
                        });
//                        sceneRecord.update(scene_record_update).$promise.then(function(){
//                            $scope.isDesabled = false;
//                            topAlert.success("修改場面記錄成功");
//                            deferred.notify();//监听是否成功刷新父级列表
//                            //如果全部
//                            if($scope.sceneRecord.status==2){
//                                //$state.go($state.current, {}, {reload: true})
//                                $scope.estimateSendSMS();
//                            }else{
//                                $modalInstance.close();
//                            }
//                            //刷新場次詳細 #TODO
//                            $scope.loanChildScene($scope.sceneRecord.id);
//                            $scope.form_scene_edit.clearErrors();
//
//                        },function(){
//                            $scope.isDesabled = false;
//                        });
                    });
                }

                $scope.reset = function () {
                    $scope.loanChildScene($scope.sceneRecord.id);
                    $scope.form_scene_edit.clearErrors();
                }

                $scope.close = function () {
                    $modalInstance.close();
                }


            }]).controller('screeningCreateCtrl', ['$scope', '$interval', '$modal', '$stateParams', '$location', 'breadcrumb', 'globalFunction', 'tmsPagination', 'topAlert', 'sceneRecord', 'recentlyPrincipal', 'sceneStatus', 'fundSourceTypes', 'rollingTypes', 'desk', 'mainScene', 'pinCodeModal', 'departmentTrans', '$log', 'goBackData',
            function ($scope, $interval, $modal, $stateParams, $location, breadcrumb, globalFunction, tmsPagination, topAlert, sceneRecord, recentlyPrincipal, sceneStatus, fundSourceTypes, rollingTypes, desk, mainScene, pinCodeModal, departmentTrans, $log, goBackData) {

                breadcrumb.items = [
                    {"name": "新增場面", "active": true}
                ];

                $scope.sceneStatus = sceneStatus.items;
                $scope.rollingTypes = rollingTypes.items;
                $scope.fundSourceTypes = fundSourceTypes.items;
                $scope.departmentTrans = departmentTrans.items;

                //在場客戶
                $scope.pagination = tmsPagination.create();
                $scope.pagination.resource = mainScene;
                $scope.pagination.max_size = 3;
                //$scope.pagination.query_method = "sceneAgent";
                $scope.agent_keyword = "";
                $scope.agent_keyword = goBackData.get('agent_keyword', $scope.agent_keyword);
                $scope.search = function (page) {
                    $scope.agent_keyword_copy = angular.copy($scope.agent_keyword);
                    goBackData.set('agent_keyword', $scope.agent_keyword_copy);
                    if ($scope.agent_keyword_copy) {
                        $scope.agent_keyword_copy = $scope.agent_keyword_copy + "!";
                    }
                    $scope.pagination.select(page, {
                        "agent_code": $scope.agent_keyword_copy,
                        scene_status: '1',
                        sort: 'agent_code asc'
                    })
                        .$promise.then(function (_mainScene) {
                            $scope.sceneAgents = _mainScene;
                        });
                }
                $scope.search(1);

                //十秒執行一次
                /*var stop = $interval(function(){
                 $scope.search($scope.pagination.page)
                 },10000);
                 $scope.$on('$stateChangeStart',
                 function(event, toState, toParams, fromState, fromParams){
                 if (angular.isDefined(stop)) {
                 $interval.cancel(stop);
                 stop = undefined;
                 }
                 });*/

                $scope.search_keyword = function () {
                    $scope.search(1);
                }

                //新增项目
                var init_record_create = {
                    "pin_code": "",
                    "agent_info_id": "",
                    "desk_id": "",    //檯號ID
                    "amount": "",
                    "guest_name": "",
                    "recently_principal_id": "",
                    "type": ""
                }

                $scope.record_create = angular.copy(init_record_create);

                //不用提交單需要
                var init_new_record_create = {
                    agent_code: "",
                    agent_name: "",
                    scene_no: "", //場次ID
                    desk_no: ""
                }
                $scope.new_record_create = angular.copy(init_new_record_create);

                //賭臺
                $scope.desks = desk.query(/*{status:'0'}*/{'sort': 'desk_no asc'});
                //場次
                /*$scope.scene_select = function(){
                 $scope.scenes = sceneRecord.query({agent_info_id:$scope.record_create.agent_info_id,status:'|2'});
                 }*/
                //$scope.scene_select();

                //判斷是否開場或加彩
                /*$scope.existAddScene = function(new_value){
                 var scene_data = _.findWhere($scope.scenes,{id:new_value});
                 $scope.record_create.guest_name = scene_data.guest_name;
                 if(new_value && new_value==""){
                 $scope.record_create.type = 1; //本金
                 }else{
                 $scope.record_create.type = 2; //加彩
                 }
                 }*/

                //可用本金
                $scope.recentlyRollings = [];
                $scope.pagination_capital = tmsPagination.create();
                $scope.pagination_capital.resource = recentlyPrincipal;
                $scope.recentlyRolling_select = function (page) {
                    $scope.pagination_capital.select(page, {
                        status: 3,
                        type: 1
                    }).$promise.then(function (_recentlyRollings) {
                            $scope.recentlyRollings = _recentlyRollings;
                        });
                }
                $scope.recentlyRolling_select();

                //選擇在場客戶
                /*$scope.agent_selected = function(agent){
                 //var agent_data = _.findWhere($scope.sceneAgents,{id:id})
                 $scope.new_record_create.agent_code = agent.agent_code;
                 $scope.new_record_create.agent_name = agent.agent_name;
                 $scope.record_create.agent_info_id = agent.agent_info_id;
                 //$scope.recentlyRolling_select(1);
                 }*/

                //使用本金
                $scope.setAvailable = function (available) {
                    //有場次加載客戶姓名
                    if (available.scene_record_id && available.scene_record_id != "") {
                        sceneRecord.get({id: available.scene_record_id}).$promise.then(function (scene) {
                            $scope.record_create.guest_name = scene.guest_name;
                            $scope.record_create.desk_id = scene.desk_id;
                        });
                    } else {
                        $scope.record_create.guest_name = "";
                        $scope.record_create.desk_id = "";
                    }

                    $scope.record_create.recently_principal_id = available.id;
                    $scope.record_create.type = available.type;//available.scene_record_id==null || available.scene_record_id=="" ? 1 : 2;

                    $scope.record_create.amount = available.amount;
                    $scope.record_create.guest_name = available.guest_name;

                    $scope.new_record_create.agent_code = available.agent_code;
                    $scope.new_record_create.agent_name = available.agent_name;
                    $scope.record_create.agent_info_id = available.agent_info_id;
                    //場次
                    $scope.new_record_create.source_type = available.source_type;
                    $scope.new_record_create.scene_no = available.scene_no;
                }

                //刪除現金和現金碼和泥碼
                $scope.removeAvailable = function (recentlyRolling) {
                    if (recentlyRolling.is_scene_add == 1) {
                        pinCodeModal(recentlyPrincipal, 'delete', {id: recentlyRolling.id}, '刪除成功！').then(function () {
                            $scope.recentlyRolling_select();
                        });
                    } else {
                        topAlert.warning("場面只能場面新增的本金");
                    }
                }

                //删除在场客户
                $scope.delete_scene = function (scene) {
                    if (scene.is_scene_open == 1) { //场面的场次
                        pinCodeModal(mainScene, 'delete', {id: scene.id}, '刪除成功！').then(function () {
                            $scope.search(1);
                        });
                    } else {
                        topAlert.warning("只能刪除場面創建的場次");
                    }
                }

                //新增場次驗證
                $scope.screening_create_url = globalFunction.getApiUrl('scene/scenerecord');

                $scope.submit = function () {
                    $scope.form_screening_create.checkValidity().then(function () {
                        if (!$scope.record_create.recently_principal_id) {
                            topAlert.warning("請選擇可用本金");
                            //return;
                        }
                        sceneRecord.save($scope.record_create).$promise.then(function () {
                            topAlert.success("新增" + $scope.rollingTypes[$scope.record_create.type] + "成功");
                            /*$scope.pagination.select($scope.pagination.page,{agent_code:$scope.agent_keyword_copy, scene_status:'1', sort:'agent_code desc'})
                             .$promise.then(function(scene){
                             $scope.sceneAgents = scene;
                             });*/
                            $scope.search($scope.pagination.page);
                            $scope.recentlyRolling_select();
                            $scope.reset();
                        });
                    });
                }

                $scope.reset = function () {
                    $scope.record_create = angular.copy(init_record_create);
                    $scope.new_record_create = angular.copy(init_new_record_create);
                    $scope.form_screening_create.clearErrors();
                    //$scope.search();
                }

                //新增本金
                $scope.add_cash = function () {
                    var modal_instance;
                    modal_instance = $modal.open({
                        templateUrl: "views/scene/cash-create.html",
                        controller: 'cashCreateCtrl'
                        //windowClass:"sm-modal"
                    });

                    modal_instance.result.then(function (result) {
                        if (result != 'cancel') {
                            $scope.recentlyRolling_select();
                            /* $scope.pagination.select($scope.pagination.page,{agent_code:$scope.agent_keyword_copy, scene_status:'1', sort:'agent_code desc'})
                             .$promise.then(function(sceneinfo){
                             $scope.sceneAgents = sceneinfo;
                             });*/
                            $scope.search($scope.pagination.page);
                        }
                    });
                }

                $scope.detail = function (id) {
                    $location.path('/scene/screening-detail/' + id);
                }

                //選擇枱號
                $scope.showDesk = function () {
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/scene/show-desk-table.html",
                        controller: 'showDeskTableCtrl',
                        windowClass: 'tlg-modal',
                        resolve: {
                            id: function () {
                                return "";
                            }
                        }
                    });
                    modalInstance.result.then((function (desk) {
                        if (desk) {
                            $scope.record_create.desk_id = desk.id;
//                        $scope.new_record_create.desk_no = desk.layer+"區"+desk.desk_no;
                            $scope.new_record_create.desk_no = "包" + desk.desk_no;
                            //topAlert.warning("返回成功！");
                        }
                    }), function () {
                        $log.info("Modal dismissed at: " + new Date());
                    });
                }


            }]).controller('showDeskTableCtrl', ['$scope', 'desk', 'globalFunction', '$modalInstance',
            function ($scope, desk, globalFunction, $modalInstance) {
                $scope.items = [
                    {
                        "label": "001",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "002",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "003",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "004",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "005",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "006",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "007",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "008",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "009",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "010",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "011",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "012",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "013",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "014",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "015",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "016",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "017",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "018",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "019",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "020",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "021",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "022",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "023",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "024",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "025",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "026",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "027",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "028",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "029",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "030",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "031",
                        "status": "2",
                        "is_used": false
                    },
                    {
                        "label": "032",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "033",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "034",
                        "status": "2",
                        "is_used": false
                    },
                    {
                        "label": "035",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "036",
                        "status": "2",
                        "is_used": true
                    }
                ];

                //初始化列表數據
                var len;
                $scope.select_desk = function (layer) {
                    $scope.desks = angular.copy($scope.items);
                    desk.query(globalFunction.generateUrlParams({
                        layer: layer,
                        sort: 'position ASC'
                    }, {sceneRecord: {}}))
                        .$promise.then(function (_desk) {
                            $scope.layer = layer;
                            $scope.desks = _desk;
                            len = $scope.desks.length;
                            $scope.positions = _.pluck($scope.desks, 'position');
                            angular.forEach($scope.items, function (item, index) {
                                if ($scope.positions.indexOf(((index + 1) + "")) < 0) {
                                    $scope.desks.splice(index, 0, {
                                        "layer": "",
                                        "desk_no": "",
                                        "position": "",
                                        "status": "2"
                                    });
                                }
                            });
                        });
                }
                $scope.select_desk(1);

                $scope.desk_click = function (desk) {
                    if (desk.id) {
                        $modalInstance.close(desk);
                    }
                }
                $scope.cancel = function () {
                    $modalInstance.close('');
                }

            }]).controller('cashCreateCtrl', ['$scope', 'globalFunction', 'topAlert', '$modalInstance', 'recentlyPrincipal', 'fundSourceTypes', 'rollingTypes', 'agentsLists', 'mainScene', 'sceneRecord',
            function ($scope, globalFunction, topAlert, $modalInstance, recentlyPrincipal, fundSourceTypes, rollingTypes, agentsLists, mainScene, sceneRecord) {

                $scope.fundSourceTypes = fundSourceTypes;
                $scope.rollingTypes = rollingTypes.items;
                $scope.isDesabled = false;

                var init_record_create = {
                    agent_info_id: "",
                    amount: "",
                    source_type: "",
                    main_scene_id: "",
                    scene_record_id: ""
                }
                $scope.record_create = angular.copy(init_record_create);

                var init_new_record_create = {
                    agent_code: "",
                    agent_name: ""
                }
                $scope.new_record_create = angular.copy(init_new_record_create);

                $scope.$watch('new_record_create.agent_code', globalFunction.debounce(function (new_value, old_value) {
                    $scope.record_create.agent_info_id = "";
                    $scope.new_record_create.agent_name = "";
                    $scope.main_scenes = [];
                    $scope.record_create.main_scene_id = "";
                    if (new_value) {
                        agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value})).$promise.then(function (agents) {
                            if (agents.length > 0) {
                                //主場次
                                $scope.main_scenes = mainScene.query({
                                    agent_info_id: agents[0].id,
                                    scene_status: '1',
                                    sort: 'agent_code asc'/*, is_scene_open:"1"*/
                                });
                                $scope.record_create.agent_info_id = agents[0].id;
                                $scope.new_record_create.agent_name = agents[0].agent_name;

                            }
                        });
                    }
                }));

                //查詢子場次
                $scope.child_scene_select = function () {
                    if ($scope.record_create.main_scene_id) {
                        $scope.child_scenes = sceneRecord.query({
                            main_scene_id: $scope.record_create.main_scene_id,
                            status: '1'
                        });
                    } else {
                        $scope.child_scenes = [];
                    }
                }

                $scope.op_type = 1; //本金
                $scope.$watch('record_create.scene_record_id', function (new_value, old_value) {
                    if (new_value) {
                        $scope.op_type = 2; //加彩
                    } else {
                        $scope.op_type = 1; //本金
                    }
                });

                $scope.deposit_url = globalFunction.getApiUrl('scene/recentlyprincipal');
                $scope.add = function () {
                    $scope.isDesabled = true;
                    $scope.form_deposit.checkValidity().then(function () {
                        recentlyPrincipal.save($scope.record_create).$promise.then(function () {
                            $scope.isDesabled = false;
                            topAlert.success("您已成功新增" + $scope.fundSourceTypes.items[$scope.record_create.source_type]);
                            //刷新最近貸款
                            $modalInstance.close();
                        }, function () {
                            $scope.isDesabled = false;
                        });
                    });
                }

                $scope.close = function () {
                    $scope.rolling_record = angular.copy($scope.rolling_record);
                    $modalInstance.close("cancel");
                }

            }]).controller('screeningDetailCtrl', ['$scope', '$filter', '$state', '$stateParams', '$modal', '$location', 'getDate', 'globalFunction', 'tmsPagination', 'topAlert', 'windowItems', 'sceneRecord', 'sceneStatus', 'matchesStatus', 'hallName', 'fundSourceTypes', 'rollingTypes', 'desk', 'pinCodeModal', 'sceneRecordShift', 'mainScene', 'rollingRecord', 'recentlyPrincipal', 'outSceneWord', '$window',
            function ($scope, $filter, $state, $stateParams, $modal, $location, getDate, globalFunction, tmsPagination, topAlert, windowItems, sceneRecord, sceneStatus, matchesStatus, hallName, fundSourceTypes, rollingTypes, desk, pinCodeModal, sceneRecordShift, mainScene, rollingRecord, recentlyPrincipal, outSceneWord, $window) {

                //$scope.agentSceneStatus = agentSceneStatus.items;
                $scope.matchesStatus = matchesStatus.items;
                $scope.sceneStatus = sceneStatus.items;
                $scope.fundSourceTypes = fundSourceTypes;
                $scope.rollingTypes = rollingTypes.items;
                $scope.isDesabled = false;

                //查詢轉碼信息
                $scope.pagination = tmsPagination.create();
                $scope.pagination.resource = rollingRecord;
                $scope.select = function (page) {
                    if ($scope.agent_record.is_scene_open == 0) {
                        $scope.rollings = $scope.pagination.select(page, {rolling_id: $scope.agent_record.rolling_id/*, status:'1'*/});
                    } else {
                        $scope.rollings = [];
                    }
                }

                //主场次
                $scope.main_scene_select = function () {
                    //globalFunction.generateUrlParams({sceneRecords:{/*sceneRecordSubs:""*/}}
                    mainScene.get({id: $stateParams.id}).$promise.then(function (agent) {
                        if (agent) {
                            $scope.is_scene_open = agent.is_scene_open;
                            $scope.child_scene_select(agent.is_scene_open)
                            $scope.agent_record = agent;

                        }
                    });
                }

                //子場次 status 1 開場 2 離場
                $scope.child_scene_select = function (is_scene_open) {
                    sceneRecord.query(globalFunction.generateUrlParams({
                        main_scene_id: $stateParams.id/*, status:'1'*/,
                        sort: 'create_time asc'
                    }/*,{sceneShiftRecord:{}}*/))
                        .$promise.then(function (_sceneRecord) {
                            //加載第一個場次
                            if (_sceneRecord.length > 0) {
                                $scope.scene_selected(_sceneRecord[0].id);
                            }
                            if (is_scene_open == "0") {
                                _sceneRecord.push({id: "", scene_no: "轉碼詳細"});
                            }
                            $scope.sceneRecords = _sceneRecord;

                        });
                }

                if ($stateParams.id) {
                    $scope.main_scene_select();
                    //$scope.child_scene_select();
                }

                //檯號 #TODO 閒置的檯
                //$scope.desks = desk.query(/*{status:'0'}*/{'sort':'desk_no asc'});

                //可用本金
                $scope.pagination_capital = tmsPagination.create();
                $scope.pagination_capital.resource = recentlyPrincipal;
                $scope.recentlyRolling_select = function (page) {
                    $scope.recentlyRollings = $scope.pagination_capital.select(page, {
                        main_scene_id: $stateParams.id,
                        status: '|1'
                    });
                }
                $scope.recentlyRolling_select();

                $scope.outCapitals_content = [];
                //選擇加載場次詳細
                $scope.scene_selected = function (id) {
                    if (id) {
                        //場面數
                        $scope.isTabShow = true;
                        $scope.sceneRecord = [];
                        sceneRecord.get(globalFunction.generateUrlParams({'id': id}, {
                            sceneRecordSubs: {}/*, sceneShiftRecord: {outCapitals:""}*/,
                            outCapitals: {}
                        }))
                            .$promise.then(function (sceneRecord) {

                                $scope.sceneRecord = sceneRecord;//_.findWhere($scope.sceneRecords,{id:id});

                                if (sceneRecord.desk_id) {
                                    desk.get({id: sceneRecord.desk_id}).$promise.then(function (_desk) {
//                                    $scope.sceneRecord.desk_no = _desk.layer + "區" + _desk.desk_no;
                                        $scope.sceneRecord.desk_no = "包" + _desk.desk_no;
                                    });
                                }
                                //離場本金處理
                                $scope.outCapitals_content = sceneRecord.outCapitals.length == 0
                                    ? [{
                                    "id": "",
                                    "out_scene_word_id": "",
                                    "o_word": "",
                                    "amount": ""
                                }] : sceneRecord.outCapitals;
                                //離場理算
                                $scope.outScene(sceneRecord);
                                var init_sceneTotal = {
                                    in_capital_total: [], // 入場本金
                                    loss_win_total: "",   //本場上下數
                                    out_capital_total: "",//離場本金
                                    rolling_total: ""     //本場轉碼數
                                }
                                sceneRecord.out_capital = sceneRecord.out_capital == null || sceneRecord.out_capital == "" ? 0 : sceneRecord.out_capital;
                                sceneRecord.loss_win_total = Number(sceneRecord.out_capital) - Number(sceneRecord.in_capital);
                                _.each(sceneRecord.sceneRecordSubs, function (sceneRecordSub) {
                                    sceneRecordSub.capital_revoke_type = false;
                                    init_sceneTotal.in_capital_total.push(sceneRecordSub.amount + "" + $scope.fundSourceTypes[sceneRecordSub.source_type]);
                                });
                                sceneRecord.in_capital_total = init_sceneTotal.in_capital_total.join('+');
                            });

                        $scope.shift_select(id);
                    } else {
                        $scope.select();
                        $scope.isTabShow = false;
                    }
                }

                //查询场次截更
                $scope.shift_select = function (scene_record_id) {
                    sceneRecordShift.query(globalFunction.generateUrlParams({
                        scene_record_id: scene_record_id,
                        is_sys: '0'
                    }, {inCapitals: {}, outCapitals: {}, shiftMark: {}}))
                        .$promise.then(function (_sceneRecordShift) {
                            $scope.sceneRecordShifts = _sceneRecordShift;
                        });
                }

                $scope.outScene = function (sceneRecord) {
                    var _sceneRecord = [];
                    var out_capital_total = 0;
                    if ($scope.outCapitals_content.length > 0) {
                        _.each($scope.outCapitals_content, function (_outCapitals) {
                            if (_outCapitals.amount && _outCapitals.amount > 0) {
                                _sceneRecord.push(_outCapitals.amount + "" + _outCapitals.o_word);
                                out_capital_total += Number(_outCapitals.amount);
                            }
                        });
                        //計算本場上下屬
                        sceneRecord.loss_win_amount = "";
                        if (out_capital_total) {
                            sceneRecord.loss_win_amount = $filter('parseTenThousand2')(out_capital_total - sceneRecord.in_capital);
                        }
                        sceneRecord.out_capital_total = _sceneRecord.join(" + ");
                    }
                }

                //場次狀態監聽
                $scope.$watch('sceneRecord.status', function (new_value, old_value) {
                    if (new_value == 2) { //离场
                        if (!$scope.sceneRecord.desk_id) {
                            topAlert.warning("請選擇枱號");
                            $scope.sceneRecord.status = 1;
                            return;
                        }
                    }
                });

                //分客
                $scope.mainScene = mainScene;
                $scope.branchGuest = function (_recentlyRolling, type) {
                    var branchGuestModal;
                    var template_url = type == "branch" ? 'scene-branch-guest' : 'scene-add-color';
                    branchGuestModal = $modal.open({
                        templateUrl: "views/scene/" + template_url + ".html",
                        controller: 'sceneBranchGuestCtrl',
                        resolve: {
                            agent_record: function () {
                                return $scope.agent_record;
                            },
                            recentlyRolling_data: function () {
                                return _recentlyRolling;
                            },
                            sceneRecord_data: function () {
                                return $scope.sceneRecord;
                            },
                            type: function () {
                                return type;
                            }
                        }
                    });

                    branchGuestModal.result.then(function (result) {
                        if (result == 'branch') {//分客
                            sceneRecord.query({
                                main_scene_id: $stateParams.id,
                                status: '1',
                                sort: 'create_time asc'
                            }).$promise.then(function (_sceneRecord) {
                                    if ($scope.is_scene_open == 0) {
                                        _sceneRecord.push({id: "", scene_no: "轉碼詳細"})
                                    }
                                    $scope.sceneRecords = _sceneRecord;
                                });
                        } else {
                            $scope.sceneRecord = $scope.scene_selected($scope.sceneRecord.id);
                        }
                        $scope.recentlyRolling_select();
                    });

                }

                //新增截更
                $scope.sceneRecordSource = sceneRecord;
                $scope.addShift = function (op_type, shift) {
                    if (shift == undefined) {
                        var shift = [];//$scope.sceneRecordShifts.length > 0 ? $scope.sceneRecordShifts[$scope.sceneRecordShifts.length - 1] : [];
                    } else {
                        var shift = shift;
                    }
                    var shiftModal;
                    shiftModal = $modal.open({
                        templateUrl: "views/scene/scene-shift-create.html",
                        controller: 'sceneShiftCreateCtrl',
                        resolve: {
                            shift_data: function () {
                                return shift;
                            },
                            scene_record_data: function () {
                                return $scope.sceneRecord;
                            },
                            main_scene_data: function () {
                                return $scope.agent_record;
                            },
                            op_type: function () {
                                return op_type
                            }
                        }
                    });

                    shiftModal.result.then(function () {
                        $scope.sceneRecordSource.get(globalFunction.generateUrlParams({id: $scope.sceneRecord.id}, {
                            sceneRecordSubs: {},
                            sceneShiftRecord: {}
                        }))
                            .$promise.then(function (sceneRecord) {
                                $scope.sceneRecord.sceneRecordSubs = sceneRecord.sceneRecordSubs;
                                $scope.shift_select(sceneRecord.id);
                            });
                    });
                }

                $scope.removeShift = function (id) {
                    pinCodeModal(sceneRecordShift, 'delete', {id: id}, '刪除成功！').then(function () {
                        sceneRecord.get(globalFunction.generateUrlParams({id: $scope.sceneRecord.id}, {
                            sceneRecordSubs: {},
                            sceneShiftRecord: {}
                        }))
                            .$promise.then(function (sceneRecord) {
                                $scope.sceneRecord.sceneRecordSubs = sceneRecord.sceneRecordSubs;
                                $scope.shift_select(sceneRecord.id);
                            });
                    })
                }

                //選擇枱號
                $scope.new_record = {
                    desk_no: ""
                }
                $scope.showDesk = function () {
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/scene/show-desk-table.html",
                        controller: 'showDeskTableCtrl',
                        windowClass: 'tlg-modal',
                        resolve: {
                            id: function () {
                                return "";
                            }
                        }
                    });
                    modalInstance.result.then((function (desk) {
                        if (desk) {
                            $scope.sceneRecord.desk_id = desk.id;
//                        $scope.sceneRecord.desk_no =  desk.layer+"區"+desk.desk_no;
                            $scope.sceneRecord.desk_no = "包" + desk.desk_no;
                        }
                    })/*, function() {
                     $log.info("Modal dismissed at: " + new Date());
                     }*/);
                }

                //修改或撤銷本金詳細
                $scope.edit_capital = function (capital) {
                    //開場本金可以修改
                    if (capital.type == 1) {
                        $scope.capital_amount = angular.copy(capital.amount);
                        capital.capital_edit_type == undefined ? false : true;
                        capital.capital_edit_type = !capital.capital_edit_type;
                        //log(capital.capital_edit_type);
                    } else if (capital.type == 2) { //中場加彩只能撤銷
                        capital.capital_revoke_type = !capital.capital_revoke_type;
                    }
                }

                //修改本金只能改少
                $scope.editCapitalKeyup = function (capital) {
                    if (Number(capital.amount) > Number($scope.capital_amount)) {
                        capital.amount = $scope.capital_amount;
                    }
                }

                //離場發送SMS
                $scope.estimateSendSMS = function () {


                    //if($scope.sceneRecord.status==2){
                    //windowItems.confirm("系統提醒","確定發送SMS",function(){
                    if ($scope.sceneRecord) {
                        $location.path('/scene/screening-sms/' + $scope.agent_record.agent_code + '/' + $stateParams.id);
                    } else {
                        $location.path('/scene/screening-sms/' + $stateParams.id);
                    }
                    //});
                    // }
                }

                $scope.outSceneWords = outSceneWord.query();
                $scope.add_outCapitals = function () {
                    $scope.outCapitals_content.push({
                        "id": "",
                        "out_scene_word_id": "",
                        "o_word": "",
                        "amount": ""
                    })
                }

                $scope.remove_outCapitals = function ($index) {
                    $scope.outCapitals_content.splice($index, 1);
                    $scope.outScene($scope.sceneRecord);
                }

                $scope.outCapitals_change = function (record) {
                    if (record.out_scene_word_id) {
                        var outCapitals_data = _.findWhere($scope.outSceneWords, {id: record.out_scene_word_id});
                        record.o_word = outCapitals_data.o_word;

                    } else {
                        record.out_scene_word_id = "";
                        record.o_word = "";
                    }
                    $scope.outScene($scope.sceneRecord);
                }

                //保存場面記錄
                $scope.scene_edit_url = globalFunction.getApiUrl("scene/scenerecord");
                $scope.submit = function () {
                    //入場本金
                    $scope.isDesabled = true;
                    var sceneRecordSubs_content = [];
                    _.each($scope.sceneRecord.sceneRecordSubs, function (sceneRecordSubs) {
                        var _sceneRecordSubs = {
                            "id": sceneRecordSubs.id,
                            "amount": sceneRecordSubs.amount,
                            "type": sceneRecordSubs.type
                        }
                        if (sceneRecordSubs.capital_revoke_type) {
                            _sceneRecordSubs.disable = 1;
                        }
                        sceneRecordSubs_content.push(_sceneRecordSubs);
                    });

                    //離場本金
                    //var outCapitals_records = [];
                    if ($scope.sceneRecord.status == 1 &&
                        $scope.outCapitals_content.length == 1 &&
                        $scope.outCapitals_content[0].out_scene_word_id == "" &&
                        $scope.outCapitals_content[0].amount == "") {
                        $scope.outCapitals_content_value = [];
                    } else {
                        $scope.outCapitals_content_value = $scope.outCapitals_content;
                    }

                    var scene_record_update = {
                        "id": $scope.sceneRecord.id,
                        "status": $scope.sceneRecord.status,
                        "desk_id": $scope.sceneRecord.desk_id,
                        "guest_name": $scope.sceneRecord.guest_name,
                        "remark": $scope.sceneRecord.remark == null ? "" : $scope.sceneRecord.remark,
                        "sceneRecordSubs": sceneRecordSubs_content,
                        "outCapitals": $scope.outCapitals_content_value,
                        "pin_code": $scope.sceneRecord.pin_code
                    }
                    //return false;
                    $scope.form_scene_edit.checkValidity().then(function () {
                        sceneRecord.update(scene_record_update).$promise.then(function () {
                            $scope.isDesabled = false;
                            topAlert.success("修改場面記錄成功");
                            //如果全部
                            if ($scope.sceneRecord.status == 2) {
                                //$state.go($state.current, {}, {reload: true})
                                $scope.main_scene_select();
                                $scope.estimateSendSMS();
                            }
                            //刷新場次詳細 #TODO
                            $scope.scene_selected($scope.sceneRecord.id);
                            //可用本金刷新
                            $scope.recentlyRolling_select();
                            $scope.form_scene_edit.clearErrors();

                        }, function () {
                            $scope.isDesabled = false;
                        });
                    });
                }

                $scope.reset = function () {
                    $scope.scene_selected($scope.sceneRecord.id);
                    $scope.form_scene_edit.clearErrors();
                }

                //删除在场客户
                $scope.delete_scene = function (scene) {
                    if (scene.is_scene_open == 1) { //场面的场次
                        pinCodeModal(mainScene, 'delete', {id: scene.id}, '刪除成功！').then(function () {
                            $window.history.back();
                        });
                    } else {
                        topAlert.warning("只能刪除場面創建的場次");
                    }
                }

            }]).controller('sceneBranchGuestCtrl', ['$scope', '$modalInstance', 'globalFunction', 'getDate', 'topAlert', 'tmsPagination', 'sceneRecord', 'agent_record', 'recentlyRolling_data', 'desk', 'sceneRecord_data', 'type', 'sceneStatus',
            function ($scope, $modalInstance, globalFunction, getDate, topAlert, tmsPagination, sceneRecord, agent_record, recentlyRolling_data, desk, sceneRecord_data, type, sceneStatus) {

                //閒置的檯
                $scope.desks = desk.query({sort: "layer,desk_no"});
                $scope.agent_record = agent_record;
                $scope.sceneRecord = sceneRecord_data;
                $scope.sceneStatus = sceneStatus.items;
                $scope.isDesabled = false;

                //新增場次驗證
                $scope.record_create = {
                    //"desk_id": type=='branch' ? "" : sceneRecord_data.desk_id,
                    "amount": recentlyRolling_data.amount,
                    "guest_name": type == 'branch' ? "" : sceneRecord_data.guest_name,
                    "scene_record_id": type == 'branch' ? "" : sceneRecord_data.id,
                    "recently_principal_id": recentlyRolling_data.id,
                    "type": type == 'branch' ? 1 : 2, //開場
                    "pin_code": ""
                }
                $scope.screening_create_url = globalFunction.getApiUrl('scene/scenerecord');
                $scope.submit = function () {
                    $scope.isDesabled = true;
                    $scope.form_screening_create.checkValidity().then(function () {
                        if (!$scope.record_create.recently_principal_id) {
                            topAlert.success("請選擇可用本金");
                            return;
                        }
                        sceneRecord.save($scope.record_create).$promise.then(function () {
                            $scope.isDesabled = false;
                            var tip_txt = type == 'branch' ? "分客" : "加彩";
                            topAlert.success(tip_txt + "成功");
                            $modalInstance.close(type);
                        }, function () {
                            $scope.isDesabled = false;
                        });
                    });
                }

                $scope.cancel = function () {
                    $modalInstance.dismiss();
                }

            }]).controller('sceneShiftCreateCtrl', ['$scope', '$filter', '$modalInstance', 'globalFunction', 'getDate', 'topAlert', 'shift_data', 'sceneRecordShift', 'op_type', 'main_scene_data', 'scene_record_data', 'outSceneWord', 'fundSourceTypes', 'scene_shift_date', 'formatNumber',
            function ($scope, $filter, $modalInstance, globalFunction, getDate, topAlert, shift_data, sceneRecordShift, op_type, main_scene_data, scene_record_data, outSceneWord, fundSourceTypes, scene_shift_date, formatNumber) {

                $scope.isDesabled = false;
                $scope.fundSourceTypes = fundSourceTypes;
                $scope.type_sms = [];
                //$scope.shift_date = currentShift.data.shift_date ? currentShift.data.shift_date : "";
                $scope.shift_date = scene_shift_date ? scene_shift_date : "";
                $scope.outCapitals_content = op_type == "add" ? $scope.outCapitals_content = [{
                    "id": "",
                    "out_scene_word_id": "",
                    "o_word": "",
                    "funds_type_id": "",
                    "funds_type": "",
                    "amount": ""
                }] : shift_data.outCapitals;

                //保存
                $scope.shifts = {
                    scene_record_id: scene_record_data.id,
                    shift_date: $scope.shift_date,
                    out_capital: op_type == "add" ? "" : shift_data.out_capital,
                    outCapitals: $scope.outCapitals_content,
                    pin_code: ""
                }

                //显示
                $scope.new_shift = {
                    shift: scene_record_data.shift,
                    //shift_date: $scope.shift_date,
                    main_scene_no: main_scene_data.main_scene_no,
                    agent_code: main_scene_data.agent_code,
                    agent_name: main_scene_data.agent_name,
                    scene_no: scene_record_data.scene_no,
                    guest_name: scene_record_data.guest_name,
                    in_capital: "",
                    //out_capital: "",
                    in_capital_text: "",
                    out_capital_text: "",
                    out_capital_total_copy: "",
                    loss_win_amount: ""

                }
                $scope.number = 0;
                $scope.outScene = function () {
                    var out_capital_total = 0;
                    var out_capital_total_copy = "";
                    var out_capital_join = [];
                    if ($scope.outCapitals_content.length > 0) {
                        _.each($scope.outCapitals_content, function (_outCapitals) {
                            if (_outCapitals.amount.toString() != "" || _outCapitals.amount != null || _outCapitals.amount != undefined) {
                                out_capital_join.push(_outCapitals.o_word + "" + formatNumber(_outCapitals.amount) + "" + (_outCapitals.funds_type ? _outCapitals.funds_type : ""));
                                out_capital_total += Number(_outCapitals.amount);
                                out_capital_total_copy += _outCapitals.amount;
                            }
                            if ($scope.number == 0) _outCapitals.amount = Number(_outCapitals.amount);

                        });
                        //計算本場上下屬
                        if (out_capital_total_copy.toString() == "" || out_capital_total_copy == null || out_capital_total_copy == undefined) {
                            $scope.new_shift.loss_win_amount = "";
                        } else {
                            $scope.new_shift.loss_win_amount = $filter('parseTenThousand2')(out_capital_total - $scope.new_shift.in_capital);
                        }
                        /*$scope.scene_record_data.out_capital_total_copy = out_capital_total_copy;
                         $scope.scene_record_data.out_capital_total = out_capital_total;
                         $scope.scene_record_data.out_capital_join = out_capital_join.join(" + ");*/
                        $scope.shifts.out_capital = out_capital_total;
                        $scope.new_shift.out_capital_total_copy = out_capital_total_copy;
                        $scope.new_shift.out_capital_text = out_capital_join.join(" + ");

                    }
                    $scope.number = 1;
                }

                outSceneWord.query().$promise.then(function (_outSceneWord) {
                    $scope.inSceneWords = _.where(_outSceneWord, {type: "1"});//類型
                    $scope.inSceneWords_data = _.findWhere($scope.inSceneWords, {o_word: ""});
                    $scope.inSceneWords_empty = $scope.inSceneWords_data ? $scope.inSceneWords_data.id : "";
                    $scope.outSceneWords = _.where(_outSceneWord, {type: "0"});//操作
                    $scope.outSceneWords_data = _.findWhere($scope.outSceneWords, {o_word: ""});
                    $scope.outSceneWords_empty = $scope.outSceneWords_data ? $scope.outSceneWords_data.id : "";
                    if (op_type == "add") {
                        $scope.outCapitals_content[0].funds_type_id = $scope.inSceneWords_empty;
                    }
                });
                /**
                 * 類型和操作
                 * @param record
                 * @param type == ty(類型) ？ op（操作）
                 */
                $scope.capitals_change = function (record, type) {

                    if (type == "ty") {
                        if (record.funds_type_id) {
                            var inCapitals_data = _.findWhere($scope.inSceneWords, {id: record.funds_type_id});
                            record.funds_type_id = record.funds_type_id;
                            record.funds_type = inCapitals_data.o_word;
                        } else {
                            record.funds_type_id = "";
                            record.funds_type = "";
                        }
                    } else if (type == "op") {
                        if (record.out_scene_word_id) {
                            var outCapitals_data = _.findWhere($scope.outSceneWords, {id: record.out_scene_word_id});
                            record.out_scene_word_id = record.out_scene_word_id;
                            record.o_word = outCapitals_data.o_word;
                        } else {
                            record.out_scene_word_id = "";
                            record.o_word = "";
                        }
                    }
                    $scope.outScene('out');
                    //$scope.loss_win_amount_sum();
                }

                $scope.add_outCapitals = function () {
                    $scope.outCapitals_content.push({
                        "id": "",
                        "out_scene_word_id": "",
                        "o_word": "",
                        "funds_type_id": $scope.inSceneWords_empty,
                        "funds_type": "",
                        "amount": ""
                    })
                }

                $scope.remove_outCapitals = function ($index) {
                    $scope.outCapitals_content.splice($index, 1);
                    $scope.outScene('out');
                }

                $scope.in_capital_change = function () {
                    var inCapitals_text = [];
                    var inCapitals_sum = 0;
                    $scope.new_shift.in_capital = 0;
                    $scope.new_shift.in_capital_text = "";
                    var shift_date = $scope.shifts.shift_date ? $filter('date')(new Date($scope.shifts.shift_date), 'yyyy-MM-dd') : "";
                    sceneRecordShift.sceneInCapitals({
                        scene_record_id: scene_record_data.id,
                        shift_date: shift_date
                    }).$promise.then(function (_inCapitals) {
                            _.each(_inCapitals, function (_inCapital) {
                                inCapitals_text.push(formatNumber(_inCapital.amount) + "" + (_inCapital.funds_type ? _inCapital.funds_type : ""));
                                inCapitals_sum += Number(_inCapital.amount);
                            });
                            $scope.new_shift.in_capital = inCapitals_sum;
                            $scope.new_shift.in_capital_text = inCapitals_text.length > 0 ? inCapitals_text.join(" + ") : 0;
                        });
                }

                if (op_type == "add") {
                    $scope.methodType = "POST";
                    $scope.title = "新增截更";

                    //入場本金
                    $scope.in_capital_change();

                    //判斷截更入場金額(上一更離場)
                    /*var outCapitals_text = [];
                     if(shift_data.length>0) {
                     //var shift_data_last = scene_record_data.sceneShiftRecord[scene_record_data.sceneShiftRecord.length-1];
                     _.each(shift_data.outCapitals, function (_outCapitals) {
                     outCapitals_text.push(_outCapitals.amount + "" + _outCapitals.o_word);
                     });
                     }*/

                    //未截更的當前本金
                    /* var outCapitals_text = [];
                     if(scene_record_data.sceneRecordSubs && scene_record_data.sceneRecordSubs.length>0) {
                     _.each(scene_record_data.sceneRecordSubs, function (capital) {
                     if (capital.create_time <= scene_record_data.create_time) {
                     outCapitals_text.push(capital.amount + "" + $scope.fundSourceTypes[capital.source_type]);
                     }
                     });
                     }*/

                } else if (op_type == "edit") {

                    $scope.title = "修改截更"
                    $scope.methodType = "PUT";
                    $scope.new_shift.shift = shift_data.shift;

                    //入場本金
                    var inCapitals_text = [];
                    var inCapitals_sum = 0;
                    _.each(shift_data.inCapitals, function (_inCapital) {
                        inCapitals_text.push(formatNumber(_inCapital.amount) + "" + (_inCapital.funds_type ? _inCapital.funds_type : ''));
                        inCapitals_sum += Number(_inCapital.amount);
                    });
                    $scope.new_shift.in_capital = inCapitals_sum;
                    $scope.new_shift.in_capital_text = inCapitals_text.join(" + ");
                    $scope.outScene();
                }

                $scope.form_shift_create_url = globalFunction.getApiUrl("scene/scenerecordshift");
                $scope.add = function () {
                    if ($scope.isDesabled) {
                        return false;
                    }
                    $scope.isDesabled = true;
                    $scope.form_shift_create.checkValidity().then(function () {
                        if (op_type == "add") {
                            //$scope.shifts.loss_win_amount = $scope.loss_win_amount();
                            $scope.shifts.shift_date = $filter('date')($scope.shifts.shift_date, 'yyyy-MM-dd');
                            sceneRecordShift.save($scope.shifts).$promise.then(function () {
                                $scope.isDesabled = false;
                                topAlert.success("新增截更成功");
                                $modalInstance.close();
                            }, function () {
                                $scope.isDesabled = false;
                            });
                        } else {
                            //修改
                            /*$scope.shifts_copy = {
                             scene_record_id: scene_record_data.id,
                             loan:  $scope.shifts.loan ,
                             cash: $scope.shifts.cash,
                             deposit_code: $scope.shifts.deposit_code,
                             deposit_cash: $scope.shifts.deposit_cash,
                             other: $scope.shifts.other,
                             pin_code: $scope.shifts.pin_code
                             }*/
                            $scope.shifts.id = shift_data.id;
                            //$scope.shifts.id = shift_data.id;
                            sceneRecordShift.update($scope.shifts).$promise.then(function () {
                                $scope.isDesabled = false;
                                topAlert.success("修改截更成功");
                                $modalInstance.close();
                            }, function () {
                                $scope.isDesabled = false;
                            });
                        }
                    });
                }

                $scope.close = function () {
                    $modalInstance.dismiss();
                }


                /*$scope.$watch('shifts.out_capital',function(new_value,old_value){
                 if(new_value){
                 $scope.shifts.loss_win_amount = Number(new_value) - Number($scope.shifts.in_capital);
                 }else{
                 $scope.shifts.loss_win_amount = "";
                 }
                 });*/

            }]).controller('screeningSmsCtrl', ['$scope', '$modal', '$location', '$filter', 'breadcrumb', 'globalFunction', 'topAlert', '$stateParams', 'hallName', 'mainScene', 'sceneRecord', 'agentsLists', 'areaCode', 'smsGroup', 'smsRecord', 'agentQuota',
            function ($scope, $modal, $location, $filter, breadcrumb, globalFunction, topAlert, $stateParams, hallName, mainScene, sceneRecord, agentsLists, areaCode, smsGroup, smsRecord, agentQuota) {
                breadcrumb.items = [
                    {"name": "發送SMS", "active": true}
                ];

                $scope.areaCodes = areaCode.query();//地區
                //當前廳
                $scope.selectedHall = hallName.getHall();
                $scope.show = true;
                $scope.isDisabled = true;

                //發送短信
                var init_record = {
                    "pin_code": "",
                    "sms_type": "1",
                    //"department_id":"",
                    "priority": "1",
                    "is_sys": "0",
                    "content": "",
                    "phoneNumbers": [
                        {
                            "agent_code": "",
                            "area_code": "",
                            "telephone_number": ""
                        }
                    ]
                }
                $scope.record_create = angular.copy(init_record);


                //提交的值
                var init_record = {
                    agent_info_id: $stateParams.agent_info_id,
                    main_scene_id: $stateParams.main_scene_id, //主場次
                    scene_status: 1 //默認開場
                }
                $scope.record = angular.copy(init_record);

                //顯示的值
                $scope.show_record = {
                    agent_code: "",
                    agent_name: "",
                    scene_status: ""
                }

                //戶口編號查詢戶口信息
                /* $scope.$watch('show_record.agent_code',globalFunction.debounce(function(new_value, old_value){
                 $scope.isDesabled = true;
                 $scope.record.agent_info_id = "";
                 $scope.show_record.agent_name = "";
                 $scope.main_scenes = [];
                 $scope.record_create.content = "";
                 if (new_value) {
                 agentsLists.get({agent_code: new_value}).$promise.then(function (agent) {
                 if (agent[0]) {
                 var agent = agent[0];
                 $scope.record.agent_info_id = agent.id;
                 $scope.show_record.agent_name = agent.agent_name;
                 $scope.selectScene();
                 }
                 });
                 }
                 }));*/

                //查询批額(查找户口)
                /*marker.agentMarkerAmount({agent_info_id: $stateParams.agent_info_id})
                 .$promise.then(function(agentMarkerAmount){
                 $scope.selfMarkerAmount = _.findWhere(agentMarkerAmount,{'agent_info_id':$stateParams.agent_info_id});
                 //$scope.agentMarkerAmount = agentMarkerAmount;
                 });*/

                $scope.selfMarkerAmount = {type: 0, agent_group_name: "", agent_used_quota: "", group_used_quota: ""};
                agentQuota.get({agent_info_id: $stateParams.agent_info_id}, {agent_quota: {}}).$promise.then(function (_agentQuota) {
                    $scope.selfMarkerAmount = _.findWhere(_agentQuota.agent_quota, {'agent_info_id': $stateParams.agent_info_id});
                    $scope.selfMarkerAmount = $scope.selfMarkerAmount ? $scope.selfMarkerAmount : {
                        type: 0,
                        agent_group_name: "",
                        agent_used_quota: "",
                        group_used_quota: ""
                    };
                });

                /*agentsLists.get({id: $stateParams.agent_info_id}).$promise.then(function (agent) {
                 if (agent) {
                 $scope.show_record.agent_code = agent.agent_code;
                 $scope.show_record.agent_name = agent.agent_name;
                 //$scope.selectScene();
                 $scope.scene_change();
                 }
                 });*/

                //通過場次拼接發送數據
                $scope.scene_change = function () {
                    if ($scope.record.main_scene_id) {
                        mainScene.get({id: $scope.record.main_scene_id}).$promise.then(function (_mainScene) {
                            if (_mainScene) {
                                $scope.mainScene_record = _mainScene;
                                $scope.show_record.scene_status = _mainScene.scene_status;
                                $scope.record.scene_status = _mainScene.scene_status == 1 || _mainScene.scene_status == 3 ? 1 : 0;

                                $scope.show_record.agent_code = _mainScene.agent_code;
                                $scope.show_record.agent_name = _mainScene.agent_name;
                                $scope.selectScene();
                                //$scope.sms_content_join(_mainScene);
                            } else {
                                $scope.record_create.content = "";
                            }
                        });
                    }
                }
                $scope.scene_change();
                $scope.from_json_type_sms = angular.fromJson($stateParams.type_sms);
                //强制发送户口
                agentsLists.agentSmsNotice({
                    agent_info_id: $stateParams.agent_info_id,
                    type_code: 'SCENEOVER'
                }).$promise.then(function (agentSmsNotice) {
                        $scope.agentSmsNotice = agentSmsNotice;
                    });
              //把單位相同的數累加（合計）
              var totalAdd = function (data) {
                var total = '';
                var jon_more = {};
                if (data != '') {
                  var arr = data.split('+');
                  for (var h = 0; h < arr.length; h++) {
                    if (jon_more.hasOwnProperty(arr[h].substr(arr[h].indexOf('萬'), arr[h].length - 1))) {
                      jon_more[arr[h].substr(arr[h].indexOf('萬'), arr[h].length - 1)] +=(+arr[h].substr(0, arr[h].indexOf('萬')));

                    } else {
                      jon_more[arr[h].substr(arr[h].indexOf('萬'), arr[h].length - 1)] =(+arr[h].substr(0, arr[h].indexOf('萬')));
                    }
                  }
                  angular.forEach(jon_more, function (val, index) {
                    if(/^-?\d+$/.test(val)){
                      total += '+' + val + index;
                    }else{
                      val=parseFloat(parseFloat(val).toFixed(4));
                      total += '+' + val + index;
                    }
                  });
                  if (total.substr(0, 1) == '+') {
                    total = total.substr(1);
                  }
                }
                return total;
              };
                //拼接場面SMS數據
                $scope.sms_content_join = function (mainScene_record) {
                    //查詢子場
                    $scope.record.scene_status = mainScene_record.scene_status;
                    //$scope.show_record.scene_status = mainScene_record.scene_status==1 || mainScene_record.scene_status==3 ? 1 : 0;
                    var status_type = mainScene_record.scene_status == 1 || mainScene_record.scene_status == 3 ? 1 : 2;
                    if ($scope.show_record.scene_status == 1) { //開場
                        sceneRecord.query(globalFunction.generateUrlParams({
                            main_scene_id: $scope.record.main_scene_id,
                            status: status_type,
                            sort: 'create_time ASC'
                        }, {inCapitals: {}, mainScene: {}/*, outCapitals:{}*/}))
                            .$promise.then(function (_sceneRecords) {
                                var scene_len = _sceneRecords.length;
                                $scope.record_create.content = mainScene_record.hall_name + "長城會" + "\n";
                                if ($scope.user.hall.id == '1AE7283167B57D1DE050A8C098155859') {
                                    $scope.record_create.content += "開始時間：" + $filter("date")(new Date(Date.parse(_sceneRecords[0].in_time.replace(/-/g, "/"))), "yyyy-MM-dd HH:mm") + "\n";
                                    $scope.record_create.content += "戶口：" + mainScene_record.agent_code  + "\n" + "姓名：" + mainScene_record.agent_name + (_sceneRecords.length > 0 && _sceneRecords[0].mainScene.come_guest_type ? "(" + _sceneRecords[0].mainScene.come_guest_type + ")" : "") + "\n" + "場次：" + "\n";
                                    //$scope.record_create.content += "幣值："+(_sceneRecords.length > 0 && _sceneRecords[0].mainScene.common_currency_name ? _sceneRecords[0].mainScene.common_currency_name :"")+"\n";

                                } else {
                                    $scope.record_create.content += "開始時間：" + $filter("date")(new Date(Date.parse(_sceneRecords[0].in_time.replace(/-/g, "/"))), "yyyy-MM-dd HH:mm") + "\n";
                                    $scope.record_create.content += "戶口：" + mainScene_record.agent_code  + "\n"+ "姓名：" + mainScene_record.agent_name + (_sceneRecords.length > 0 && _sceneRecords[0].mainScene.come_guest_type ? "(" + _sceneRecords[0].mainScene.come_guest_type + ")" : "") + "\n"+ "場次：" + "\n";
                                }
                                //$scope.record_create.content +="戶口："+ mainScene_record.agent_code+" 姓名："+mainScene_record.agent_name+(_sceneRecords.length > 0 && _sceneRecords[0].mainScene.come_guest_type ? "("+_sceneRecords[0].mainScene.come_guest_type+")":"")+"\n";
                                $scope.record_create.content += "幣種：" + $stateParams.common_currency_name + "\n";
                                if (_sceneRecords.length > 1) {


                                    _.each(_sceneRecords, function (e, index) {
                                        $scope.record_create.content += index + 1 + "客人：" + (e.guest_name ? e.guest_name : "") + "\n";
                                        $scope.record_create.content += "本金：" + (e.in_capital_scene ? e.in_capital_scene : "") + "\n";
                                    })
                                } else {
                                    $scope.record_create.content += "本金：" + (_sceneRecords[0].in_capital_scene ? _sceneRecords[0].in_capital_scene : "") + "\n";
                                }

                                if ($scope.user.hall.id == '1AE7283167B57D1DE050A8C098155859') {//馬尼拉加彩短信模板
                                    if (_sceneRecords.length > 0 && _sceneRecords[0].mainScene.manila_percent) {
                                        $scope.record_create.content += "凱旋門佔成：" + (_sceneRecords[0].mainScene.manila_percent) + "%" + "\n";
                                        //$scope.record_create.content += "經手人：" + (mainScene_record.user_name ? mainScene_record.user_name : "") + "\n";
                                    }
                                } else {
                                }
                                $scope.record_create.content += "經手人：" + (mainScene_record.user_name ? mainScene_record.user_name : "") + "\n";
                                $scope.descriptions = "";
                                _.each(mainScene_record.allRoles, function (allRole, $index) {
                                    if (allRole.description) {
                                        $scope.descriptions += allRole.description;
                                    }
                                    if (($index + 1) != mainScene_record.allRoles.length) {
                                        $scope.descriptions = +'、 '
                                    }
                                })
                                add_contact_phone(mainScene_record);
                            });
                    } else if ($scope.show_record.scene_status == 0) { //離場
                        sceneRecord.query(globalFunction.generateUrlParams({
                            main_scene_id: $scope.record.main_scene_id,
                            status: status_type,
                            sort: "create_time ASC"
                        }, {/*inCapitals:{}, */mainScene: {}, outCapitals: {}}))
                            .$promise.then(function (_sceneRecords) {
                                var scene_len = _sceneRecords.length;
                                $scope.record_create.content = mainScene_record.hall_name + "長城會" + "\n";
                                $scope.record_create.content += "結束時間：" + $filter("date")(new Date(Date.parse(_sceneRecords[0].out_time.replace(/-/g, "/"))), "yyyy-MM-dd HH:mm") + "\n";
                                $scope.record_create.content += "戶口：" + mainScene_record.agent_code + "\n" + "姓名：" + mainScene_record.agent_name + (_sceneRecords.length > 0 && _sceneRecords[0].mainScene.come_guest_type ? "(" + _sceneRecords[0].mainScene.come_guest_type + ")" : "") + " " + "\n" + "場次：" + "\n";
                                $scope.record_create.content += "幣種：" + $stateParams.common_currency_name + "\n";
                                if ($scope.user.hall.id == '1AE7283167B57D1DE050A8C098155859') {//馬尼拉離場短信模板
                                    if (scene_len > 1) {
                                        _.each(_sceneRecords, function (_sceneRecord, index) {
                                            index++
                                            $scope.record_create.content += "(" + index + "客人，" + (_sceneRecord.guest_name ? _sceneRecord.guest_name : "沒有提供") + "）：" + "\n";
                                            $scope.record_create.content += "本金：" + (_sceneRecord.in_capital_scene ? _sceneRecord.in_capital_scene : "") + "\n";
                                          if (_sceneRecord.is_add == 1) {
                                            $scope.record_create.content += "合計：" + totalAdd((_sceneRecord.in_capital_scene ? _sceneRecord.in_capital_scene : "")) + "\n";
                                          }
                                            var loss_win_amount = Number(_sceneRecord.loss_win_amount) ? Number(_sceneRecord.loss_win_amount) : 0;
                                            if (loss_win_amount < 0) {
                                                $scope.record_create.content += "客下：" + (-Number(_sceneRecord.loss_win_amount)) + "萬\n";
                                            } else {
                                                $scope.record_create.content += "客上：" + Number(_sceneRecord.loss_win_amount) + "萬\n";
                                            }
                                            $scope.record_create.content += "轉碼：" + (mainScene_record.rolling_total ? Number(mainScene_record.rolling_total) : 0) + "萬\n";
                                            _.each(_sceneRecord.outCapitals, function (e) {
                                                //$scope.record_create.content += e.o_word + ":" + " " + Number(e.amount) + " " +  "萬\n";
                                                $scope.record_create.content += e.o_word? e.o_word + ":" + " " + Number(e.amount) + " " +  "萬\n":"";
                                            })
                                        });
                                        $scope._sceneRecordTims = _.sortBy(_sceneRecords, 'out_time');

                                    } else {
                                        $scope.record_create.content += "本金：" + (_sceneRecords.length > 0 && _sceneRecords[0].in_capital_scene ? _sceneRecords[0].in_capital_scene : "") + "\n";
                                      if (_sceneRecords[0].is_add == 1) {
                                        $scope.record_create.content += "合計：" + totalAdd((_sceneRecords.length > 0 && _sceneRecords[0].in_capital_scene ? _sceneRecords[0].in_capital_scene : "")) + "\n";
                                      }
                                      var loss_win_amount = Number(_sceneRecords[0].loss_win_amount) ? Number(_sceneRecords[0].loss_win_amount) : 0;
                                        if (loss_win_amount < 0) {
                                            $scope.record_create.content += "客下：" + (-loss_win_amount) + "萬\n";
                                        } else {
                                            $scope.record_create.content += "客上：" + loss_win_amount + "萬\n";
                                        }
                                        $scope.record_create.content += "轉碼：" + (mainScene_record.rolling_total ? Number(mainScene_record.rolling_total) : 0) + "萬\n";
                                        _.each(_sceneRecords[0].outCapitals, function (e) {
                                           //$scope.record_create.content += e.o_word + ":" + " " + Number(e.amount) + " " +  "萬\n";
                                           $scope.record_create.content += e.o_word? e.o_word + ":" + " " + Number(e.amount) + " " +  "萬\n":"";
                                        })
                                    }

                                    $scope.record_create.content += "經手人：" + (mainScene_record.user_name ? mainScene_record.user_name : "" ) + "\n";
                                    add_contact_phone(mainScene_record);
                                } else {
                                    $scope.record_create.content = mainScene_record.hall_name + "長城會" + "\n";
                                    $scope.record_create.content += "結束時間：" + $filter("date")(new Date(Date.parse(_sceneRecords[0].out_time.replace(/-/g, "/"))), "yyyy-MM-dd HH:mm") + "\n";
                                    $scope.record_create.content += "戶口：" + mainScene_record.agent_code + "\n" + "姓名：" + mainScene_record.agent_name + (_sceneRecords.length > 0 && _sceneRecords[0].mainScene.come_guest_type ? "(" + _sceneRecords[0].mainScene.come_guest_type + ")" : "") + " " + "\n" + "場次：" + "\n";
                                    $scope.record_create.content += "幣種：" + $stateParams.common_currency_name + "\n";
                                    if (scene_len > 1) {
                                        _.each(_sceneRecords, function (_sceneRecord, index) {
                                            index++;
                                            $scope.record_create.content += "(" + index + "客人，" + (_sceneRecord.guest_name ? _sceneRecord.guest_name : "沒有提供") + "）：" + "\n";
                                            $scope.record_create.content += "本金：" + (_sceneRecord.in_capital_scene ? _sceneRecord.in_capital_scene : "") + "\n";
                                          if (_sceneRecord.is_add == 1) {
                                            $scope.record_create.content += "合計：" + totalAdd((_sceneRecord.in_capital_scene ? _sceneRecord.in_capital_scene : "")) + "\n";
                                          }
                                            var loss_win_amount = Number(_sceneRecord.loss_win_amount) ? Number(_sceneRecord.loss_win_amount) : 0;
                                            if (loss_win_amount < 0) {
                                                $scope.record_create.content += "客下：" + (-Number(_sceneRecord.loss_win_amount)) + "萬\n";
                                            } else {
                                                $scope.record_create.content += "客上：" + Number(_sceneRecord.loss_win_amount) + "萬\n";
                                            }
                                            $scope.record_create.content += "轉碼：" + (mainScene_record.rolling_total ? Number(mainScene_record.rolling_total) : 0) + "萬\n";
                                            _.each(_sceneRecord.outCapitals, function (e) {
                                                //$scope.record_create.content += e.o_word + ":" + " " + Number(e.amount) + " " + e.funds_type + "\n";
                                                $scope.record_create.content += e.o_word? e.o_word + ":" + " " + Number(e.amount) + " " +  "萬\n":"";
                                            })
                                        });
                                        $scope._sceneRecordTims = _.sortBy(_sceneRecords, 'out_time');

                                    } else {
                                        $scope.record_create.content += "本金：" + (_sceneRecords.length > 0 && _sceneRecords[0].in_capital_scene ? _sceneRecords[0].in_capital_scene : "") + "\n";
                                      if (_sceneRecords[0].is_add == 1) {
                                        $scope.record_create.content += "合計：" + totalAdd((_sceneRecords.length > 0 && _sceneRecords[0].in_capital_scene ? _sceneRecords[0].in_capital_scene : "")) + "\n";
                                      }
                                        var loss_win_amount = Number(_sceneRecords[0].loss_win_amount) ? Number(_sceneRecords[0].loss_win_amount) : 0;
                                        if (loss_win_amount < 0) {
                                            $scope.record_create.content += "客下：" + (-loss_win_amount) + "萬\n";
                                        } else {
                                            $scope.record_create.content += "客上：" + loss_win_amount + "萬\n";
                                        }
                                        $scope.record_create.content += "轉碼：" + (mainScene_record.rolling_total ? Number(mainScene_record.rolling_total) : 0) + "萬\n";
                                        _.each(_sceneRecords[0].outCapitals, function (e) {
                                            //$scope.record_create.content += e.o_word + ":" + " " + Number(e.amount) + " " + e.funds_type + "\n";
                                            $scope.record_create.content += e.o_word? e.o_word + ":" + " " + Number(e.amount) + " " +  "萬\n":"";
                                        })
                                    }

                                    $scope.record_create.content += "經手人：" + (mainScene_record.user_name ? mainScene_record.user_name : "" ) + "\n";
                                    add_contact_phone(mainScene_record);
                                }
                            });
                    } else if ($scope.show_record.scene_status == 3) { //加彩
                        sceneRecord.query(globalFunction.generateUrlParams({
                            main_scene_id: $scope.record.main_scene_id,
                            status: status_type,
                            sort: 'in_time ASC'
                        }, {mainScene: {}/*inCapitals:{}, outCapitals:{}*/}))
                            .$promise.then(function (_sceneRecords) {
                                if ($scope.user.hall.id == '1AE7283167B57D1DE050A8C098155859') {//馬尼拉加彩短信模板
                                    $scope.record_create.content = mainScene_record.hall_name + "長城會\n";
                                    $scope.record_create.content += "加彩時間：" + $filter("date")(new Date(), "yyyy-MM-dd HH:mm") + "\n";
                                    _.each(_sceneRecords, function (data) {
                                        if (data.id == $stateParams.fenke_id) {
                                            $scope.record_create.content += "戶口：" + mainScene_record.agent_code + "\n" + "姓名：" + mainScene_record.agent_name + (_sceneRecords.length > 0 && _sceneRecords[0].mainScene.come_guest_type ? "(" + _sceneRecords[0].mainScene.come_guest_type + ")" : "") + " " + "\n" + "場次：" + "\n";
                                        }
                                    })
                                    $scope.record_create.content += "幣種：" + $stateParams.common_currency_name + "\n";
                                    if (_sceneRecords.length > 1) {
                                        _.each(_sceneRecords, function (_sceneRecord, index) {
                                            $scope.record_create.content += index + 1 + "客人：" + (_sceneRecord.guest_name ? _sceneRecord.guest_name : "") + "\n";
                                            $scope.record_create.content += "本金："+_sceneRecord.in_capital_scene +"\n";
                                            $scope.record_create.content += "合計：" +totalAdd(_sceneRecord.in_capital_scene)  + "\n";
                                        });
                                    } else {
                                        $scope.record_create.content += "本金：" +_sceneRecords[0].in_capital_scene+ "\n";
                                        $scope.record_create.content += "合計：" + totalAdd(_sceneRecords[0].in_capital_scene) + "\n";
                                    }
                                    $scope.record_create.content += "經手人：" + (mainScene_record.user_name ? mainScene_record.user_name : "") + "\n";
                                    add_contact_phone(mainScene_record);
                                } else {
                                    $scope.record_create.content = mainScene_record.hall_name + "長城會\n";
                                    $scope.record_create.content += "加彩時間：" + $filter("date")(new Date(), "yyyy-MM-dd HH:mm") + "\n";
                                    _.each(_sceneRecords, function (data) {
                                        if (data.id == $stateParams.fenke_id) {
                                            $scope.record_create.content += "戶口：" + mainScene_record.agent_code + "\n" + "姓名：" + mainScene_record.agent_name + (_sceneRecords.length > 0 && _sceneRecords[0].mainScene.come_guest_type ? "(" + _sceneRecords[0].mainScene.come_guest_type + ")" : "") + " " + "\n" + "場次：" + "\n";
                                        }
                                    })
                                    $scope.record_create.content += "幣種：" + $stateParams.common_currency_name + "\n";
                                    if (_sceneRecords.length > 1) {
                                        _.each(_sceneRecords, function (_sceneRecord, index) {
                                            $scope.record_create.content += index + 1 + "客人：" + (_sceneRecord.guest_name ? _sceneRecord.guest_name : "") + "\n";
                                            $scope.record_create.content += "本金：" +_sceneRecord.in_capital_scene+ "\n";
                                            $scope.record_create.content += "合計：" + totalAdd(_sceneRecord.in_capital_scene) + "\n";
                                        });
                                    } else {

                                        $scope.record_create.content += "本金：" +_sceneRecords[0].in_capital_scene+ "\n";
                                        $scope.record_create.content += "合計：" + totalAdd(_sceneRecords[0].in_capital_scene) + "\n";
                                    }
                                    $scope.record_create.content += "經手人：" + (mainScene_record.user_name ? mainScene_record.user_name : "") + "\n";
                                    add_contact_phone(mainScene_record);
                                }
                            });
                    }
                };

                //在短信末尾添加联系电话
                var add_contact_phone = function (mainScene_record) {

                    //var hall_id = angular.copy(mainScene_record).hall_id;
                    ////查詢電話
                    //var phones = {
                    //    //銀河
                    //    "03A667A3393B6225E0539715A8C018ED":"+853 28823681",
                    //    //永利
                    //    "03A665B512C5621BE0539715A8C03C44":"+853 28722952 ",
                    //    //凱旋門
                    //    "1AE7283167B57D1DE050A8C098155859":"+853 2872 2952",
                    //    //新葡京鉅星
                    //    "03A665B512BF621BE0539715A8C03C44":"+853 6202 1177",
                    //    //新葡京鉅星2
                    //    "27115D48C5F726D6E050A8C098150716":"+853 6202 1177"
                    //};
                    //if(phones[hall_id]){
                    //"查詢電話 : " + phones[hall_id] + "\n"+
                    $scope.record_create.content += "(如有錯漏，以賬房數據為準)" + "\n";
                    //}

                };


                //該戶口下主場次
                $scope.main_scenes = [];
                $scope.selectScene = function () {
                    $scope.record.scene_status = $scope.show_record.scene_status == 1 || $scope.show_record.scene_status == 3 ? 1 : 0;
                    //開場或加彩
                    mainScene.query({
                        agent_info_id: $stateParams.agent_info_id,
                        scene_status: $scope.record.scene_status,
                        sort: 'agent_code desc'
                    }).$promise.then(function (_mainScenes) {
                            //默認主場次信息
                            var _mainScenes_data = _.findWhere(_mainScenes, {id: $scope.record.main_scene_id});
                            $scope.mainScene_record = _mainScenes_data;
                            if (_mainScenes_data) {
                                //$scope.scene_change();
                                $scope.sms_content_join(_mainScenes_data);
                            } else {
                                $scope.record_create.content = "";
                            }
                            $scope.isDisabled = false;
                            $scope.main_scenes = _mainScenes;
                        });
                }

                //切換場次類型
                $scope.shiftSceneType = function () {
                    $scope.isDisabled = true;
                    $scope.record_create.content = "";
                    $scope.selectScene();
                }

                $scope.sendOut = function () {
                    topAlert.success("發送成功");
                    $scope.show = true;
                }

                $scope.edit = function () {
                    $scope.show = false;
                }

                /**
                 * 场面详细
                 * @param scene_record_id 子場次ID
                 * @param main_scene_id 主場次ID
                 */
                $scope.sceneDetail = function (scene_record_id, main_scene_id) {
                    var sceneModal;
                    sceneModal = $modal.open({
                        templateUrl: "views/scene/screening-detail-window.html",
                        controller: 'isShowFlag',
                        windowClass: 'md-modal',
                        resolve: {
                            scene_record_id: function () {
                                return scene_record_id;
                            },
                            main_scene_id: function () {
                                return main_scene_id;
                            }
                        }
                    });

                    /*sceneModal.result.then(function(){
                     $scope.scene_search();
                     });*/
                }

                $scope.return = function () {
                    if ($stateParams.agent_code) {
                        $scope.sceneDetail("", $stateParams.main_scene_id);
                        $location.path('/scene/screening-shift-list/');
                        //$location.path('/scene/screening-detail/'+$stateParams.main_scene_id);
                    } else {
                        $location.path('/scene/screening-shift-list');
                    }
                }


                //=========發送SMS==========

                //初始化列表數據
                var init_new_record = {
                    search_type: "agent",
                    keyword: ""
                }
                $scope.new_record = angular.copy(init_new_record);
                /*$scope.pagination = tmsPagination.create();
                 $scope.pagination.resource = smsGroup;*/
                $scope.group_select = function () {
                    $scope.condition_copy = angular.copy($scope.new_record);
                    if ($scope.condition_copy.keyword) {
                        $scope.condition_copy.keyword = $scope.condition_copy.keyword + "!";
                    }
                    smsGroup.query({sms_group_name: $scope.condition_copy.keyword}).$promise.then(function (_smsGroup) {
                        //不顯示選取的群組
                        _.each($scope.selected_group_content, function (selected_group) {
                            var selected_data = _.findWhere(_smsGroup, {id: selected_group.id});
                            if (selected_data) {
                                selected_data.is_selected = true;
                            }
                        });
                        $scope.sms_groups = _smsGroup;
                    });
                }

                //輸入號碼
                $scope.isWriteFlag = false;
                $scope.write_num = function () {
                    $scope.isWriteFlag = true;
                    $scope.tel_record = angular.copy(init_tel_record);
                }

                //選擇搜索項
                $scope.placeholder = "戶口查詢";
                $scope.change_search_type = function () {
                    $scope.new_record.keyword = "";
                    if ($scope.new_record.search_type == "agent") {  //戶口查詢
                        $scope.placeholder = "戶口查詢";
                    } else if ($scope.new_record.search_type == "group") { //群組查詢
                        $scope.placeholder = "群組查詢";
                    }
                }

                $scope.search_list = function () {
                    if ($scope.new_record.search_type == "agent") {  //戶口查詢
                        $scope.agent_watch();

                    } else if ($scope.new_record.search_type == "group") { //群組查詢
                        $scope.group_select();
                    }
                    $scope.isWriteFlag = false;
                }
                //新增號碼
                $scope.tel_content = [];
                var init_tel_record = {
                    agent_name: "",
                    agent_code: "",
                    area_code_id: "",
                    telephone_number: ""
                }
                $scope.tel_record = angular.copy(init_tel_record);

                //選擇群組
                $scope.selected_group_content = [];
                //$scope.tel_content_copy = [];
                $scope.group_selected = function (record, type) {
                    $scope.isSelectDisabled = true;
                    smsGroup.get(globalFunction.generateUrlParams({id: record.id}, {smsGroupSubs: {}})).$promise.then(function (_smsGroup) {
                        //$scope.record_create.department_id = _smsGroup.department_id;
                        //$scope.tel_content[record.id] = _smsGroup.smsGroupSubs;
                        $scope.tel_content.push(_smsGroup.smsGroupSubs);
                        $scope.tel_content = _.flatten($scope.tel_content);
                        $scope.isSelectDisabled = false;
                    });
                    //隱藏選中的群組
                    record.is_selected = true;
                    $scope.selected_group_content.push(record);
                }

                //取消選中戶組
                $scope.cancel_selected = function (record, index) {
                    var groups_data = _.findWhere($scope.sms_groups, {id: record.id});
                    var cancel_group = _.where($scope.tel_content, {sms_group_id: record.id});
                    if (groups_data) {
                        groups_data.is_selected = false;
                    }
                    $scope.selected_group_content.splice(index, 1);
                    $scope.tel_content = _.difference($scope.tel_content, cancel_group);
                }

                //通過戶口查詢
                /*$scope.isHiddenCode = false;
                 $scope.$watch('tel_record.agent_code',globalFunction.debounce(function(new_value, old_value){
                 $scope.tel_record.agent_name = "";
                 $scope.tel_record.telephone_number = "";
                 if(new_value){
                 agentsLists.query(globalFunction.generateUrlParams({agent_code:new_value},{refTelAgentMasterNoticeType:{agentContactTel:''}}))
                 .$promise.then(function(agents){
                 if(agents[0]) {
                 $scope.tel_record.agent_name = agents[0].agent_name;
                 if(agents[0].refTelAgentMasterNoticeType.length>0){
                 $scope.isHiddenCode = true;
                 $scope.tel_record.isSystemFlag = agents[0].refTelAgentMasterNoticeType.length > 0 ? true : false;
                 $scope.agentTels = agents[0].refTelAgentMasterNoticeType;
                 $scope.telephone_number_content = [];
                 _.each(agents[0].refTelAgentMasterNoticeType,function(_tel){
                 $scope.telephone_number_content.push(_tel.agentContactTel.area_code+"-"+_tel.agentContactTel.telephone_number);
                 });
                 $scope.tel_record.telephone_number = $scope.telephone_number_content.join(',');
                 }else{
                 $scope.isHiddenCode = false;
                 $scope.tel_record.isSystemFlag = false;
                 }
                 }else{
                 $scope.isHiddenCode = false;
                 }
                 });
                 }else{
                 $scope.isHiddenCode = false;
                 }
                 }));*/

                //通過戶口查詢
                $scope.isHiddenCode = false;
                $scope.agent_watch = function () {
                    $scope.tel_record.agent_name = "";
                    $scope.tel_record.telephone_number = "";
                    if ($scope.new_record.keyword) {
                        agentsLists.query(globalFunction.generateUrlParams({agent_code: $scope.new_record.keyword}, {refTelAgentMasterNoticeType: {agentContactTel: ''}}))
                            .$promise.then(function (agents) {
                                if (agents[0]) {
                                    $scope.tel_record.agent_code = agents[0].agent_code;
                                    $scope.tel_record.agent_name = agents[0].agent_name;
                                    if (agents[0].refTelAgentMasterNoticeType.length > 0) {
                                        $scope.isHiddenCode = true;
                                        $scope.tel_record.isSystemFlag = agents[0].refTelAgentMasterNoticeType.length > 0 ? true : false;
                                        $scope.agentTels = agents[0].refTelAgentMasterNoticeType;
                                        $scope.telephone_number_content = [];
                                        _.each(agents[0].refTelAgentMasterNoticeType, function (_tel) {
                                            $scope.telephone_number_content.push(_tel.agentContactTel.area_code + "-" + _tel.agentContactTel.telephone_number);
                                        });
                                        $scope.tel_record.telephone_number = $scope.telephone_number_content.join(',');
                                    } else {
                                        $scope.isHiddenCode = false;
                                        $scope.tel_record.isSystemFlag = false;
                                    }
                                } else {
                                    $scope.isHiddenCode = false;
                                }
                            });
                    } else {
                        $scope.isHiddenCode = false;
                    }
                }

                //手動新增的號碼
                //$scope.tel_content_new = [];
                $scope.addTel = function () {
                    $scope.tel_record_copy = angular.copy($scope.tel_record);
                    //手動談些才驗證
                    if (!$scope.isHiddenCode && !$scope.tel_record_copy.area_code_id) {
                        topAlert.warning("區域不能為空");
                        return;
                    }
                    if (!$scope.tel_record_copy.telephone_number) {
                        topAlert.warning("號碼不能為空");
                        return;
                    }

                    //系統數據
                    var i = 0;
                    if ($scope.tel_record_copy.isSystemFlag) {
                        _.each($scope.agentTels, function (_sys_tel) {
                            //判斷加入的列表是否存在要加入的號碼
                            var tel_data = _.where($scope.tel_content, {
                                area_code_id: _sys_tel.agentContactTel.area_code_id,
                                telephone_number: _sys_tel.agentContactTel.telephone_number
                            });
                            if (tel_data && tel_data.length == 0) {
                                $scope.tel_content.push(
                                    {
                                        agent_name: $scope.tel_record_copy.agent_name,
                                        agent_code: $scope.tel_record_copy.agent_code,
                                        area_code_id: _sys_tel.agentContactTel.area_code_id ? _sys_tel.agentContactTel.area_code_id : "",
                                        area_code: _sys_tel.agentContactTel.area_code ? _sys_tel.agentContactTel.area_code : "",
                                        telephone_number: _sys_tel.agentContactTel.telephone_number ? _sys_tel.agentContactTel.telephone_number : ""
                                    }
                                );
                            } else {
                                i++;
                                if (i == 1) {
                                    topAlert.success("存在相同的號碼，系統將自動替換相同號碼！");
                                }
                            }
                        });
                    } else {
                        var tel_data = _.where($scope.tel_content, {
                            area_code_id: $scope.tel_record_copy.area_code_id,
                            telephone_number: $scope.tel_record_copy.telephone_number
                        });
                        if (tel_data && tel_data.length == 0) {
                            $scope.tel_content.push($scope.tel_record_copy);
                        } else {
                            topAlert.success("存在相同的號碼，系統將自動替換相同號碼！");
                        }
                    }
                    $scope.tel_record = angular.copy(init_tel_record);
                    $scope.isHiddenCode = false;
                }

                $scope.delete_contatc_tels = [];
                $scope.removeTel = function (record, index) {
                    //戶組里的電話號碼
                    if (record.sms_group_id) {
                        $scope.tel_content.splice(index, 1);
                        //如果該組全部刪完刪掉選中的該組
                        var data = _.where($scope.tel_content, {sms_group_id: record.sms_group_id});
                        if (data.length == 0) {
                            var record_new = _.findWhere($scope.selected_group_content, {id: record.sms_group_id});
                            $scope.cancel_selected(record_new);
                        }
                    } else {
                        $scope.tel_content.splice(index, 1);
                    }
                }

                $scope.areaCode_change = function () {
                    var areaCode_record = _.findWhere($scope.areaCodes, {id: $scope.tel_record.area_code_id});
                    $scope.tel_record.area_code = areaCode_record.area_code;
                }
              //监听短信内容是否发生变化 storm start
              $scope.$watch("record_create.content", function (new_value) {
                if (new_value) {
                  window['textAreaValue'] = '';
                }
              });

                //群組和號碼綁定
                $scope.send_sms_url = globalFunction.getApiUrl('sms/smsrecord');
                $scope.submit = function () {
                    if ($scope.isDisabled) {
                        return $scope.isDisabled;
                    }
                    $scope.isDisabled = true;
                    $scope.sendSmsFunc();
                    //如果發送離場短信確認賬房是否離場
                    /*if($scope.record.scene_status==0){
                     mainScene.get({id:$scope.record.main_scene_id}).$promise.then(function(_mainScene){
                     if(_mainScene.status==0){ //賬房離場
                     $scope.sendSmsFunc();
                     }else{
                     topAlert.warning("賬房部還沒有全部離場，場面暫不能離場。");
                     $scope.isDisabled = false;
                     }
                     });
                     }else{//加彩或開場
                     $scope.sendSmsFunc();
                     }*/
                };

                //發送SMS方法
                $scope.sendSmsFunc = function () {
                    //if(($scope.record.scene_status==0 && $scope.mainScene_record.status==0) || $scope.mainScene_record.is_scene_open==1) {
                    $scope.phoneNumbers = [];
                    //強制發送聯絡人
                    if ($scope.agentSmsNotice && $scope.agentSmsNotice.length > 0) {
                        _.each($scope.agentSmsNotice, function (tel) {
                            $scope.phoneNumbers.push({
                                agent_code: tel.agent_code ? tel.agent_code : "",
                                agent_name: tel.agent_name,
                                area_code: tel.area_code,
                                telephone_number: tel.telephone_number
                            });
                        });
                    }


                    if ($scope.tel_content.length > 0) {
                        _.each($scope.tel_content, function (tel) {
                            $scope.phoneNumbers.push({
                                agent_code: tel.agent_code,
                                agent_name: tel.agent_name,
                                area_code: tel.area_code,
                                telephone_number: tel.telephone_number
                            });
                        });
                    }

                    if ($scope.show_record.scene_status == 0) {
                        $scope.record_create.type = "53";
                    } else if ($scope.show_record.scene_status == 1) {
                        $scope.record_create.type = "51";
                    } else if ($scope.show_record.scene_status == 3) {
                        $scope.record_create.type = "52"
                    }

                    //普通發送
                    $scope.record_create.phoneNumbers = $scope.phoneNumbers;
                  if(window['textAreaValue']){   //storm.xu
                    $scope.record_create.content = window['textAreaValue'];  //storm.xu
                  }

                    $scope.form_send_sms.checkValidity().then(function () {
                        smsRecord.save($scope.record_create).$promise.then(function () {
                            topAlert.success('普通短信發送成功');
                            //調整場面數記錄列表
                            $location.path("/scene/screening-shift-list");
                            window['textAreaValue'] = '';
                            //$scope.cancel();
                            $scope.isDisabled = false;
                        }, function () {
                            $scope.isDisabled = false;
                        });
                    });
                }

                //常用短信模板
                $scope.smsTemplateOpen = function () {
                    var smsModal;
                    smsModal = $modal.open({
                        templateUrl: "views/sms-manager/sms-template-window.html",
                        controller: 'smsTemplateWindowCtrl',
                        windowClass: 'md-modal'
                        /*resolve: {
                         user_data : function(){
                         return $scope.user;
                         }
                         }*/
                    });

                    smsModal.result.then(function (result) {
                        $scope.record_create.department_id = result.department_id;
                        $scope.record_create.content = result.content;
                    });
                }

                $scope.cancel = function () {
                    /*if($scope.record_create.sms_type==1){

                     }else if($scope.record_create.sms_type==2){

                     }*/
                    //清空選取的電話
                    $scope.tel_content = [];
                    //取消選中群/戶組
                    _.each($scope.selected_group_content, function (_selected_group) {
                        _selected_group.is_selected = false;
                    });
                    $scope.selected_group_content = [];
                    //清空其他信息
                    $scope.sms_type = $scope.record_create.sms_type;
                    $scope.record_create = angular.copy(init_record);
                    $scope.record_create.sms_type = $scope.sms_type;
                }

            }]).controller('gamblingTableManagerCtrls', ['$scope', 'sceneRecord', 'DeskLayers', 'breadcrumb', 'globalFunction', 'tmsPagination', 'pinCodeModal', 'topAlert', 'tableStatus', 'tableLayerStatus', 'sceneStatus', 'desk', 'tableLayerXY', '$modal', '$log',
            function ($scope, sceneRecord, DeskLayers, breadcrumb, globalFunction, tmsPagination, pinCodeModal, topAlert, tableStatus, tableLayerStatus, sceneStatus, desk, tableLayerXY, $modal, $log) {
                breadcrumb.items = [
                    {"name": "賭枱管理", "active": true}
                ];
                $scope.DeskLayers = DeskLayers;
                $scope.layer;
                $scope.detail_desk = {};//單個賭枱詳細
                $scope.items = [
                    {
                        "label": "001",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "002",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "003",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "004",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "005",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "006",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "007",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "008",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "009",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "010",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "011",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "012",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "013",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "014",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "015",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "016",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "017",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "018",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "019",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "020",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "021",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "022",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "023",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "024",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "025",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "026",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "027",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "028",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "029",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "030",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "031",
                        "status": "2",
                        "is_used": false
                    },
                    {
                        "label": "032",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "033",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "034",
                        "status": "2",
                        "is_used": false
                    },
                    {
                        "label": "035",
                        "status": "2",
                        "is_used": true
                    },
                    {
                        "label": "036",
                        "status": "2",
                        "is_used": true
                    }
                ]

                //$scope.ui = ui;
                //初始化列表數據
                var len;
                $scope.pagination = tmsPagination.create();
                $scope.pagination.resource = sceneRecord;
                $scope.pagination.max_size = 2;
                $scope.select = function (page) {
                    $scope.pagination.select(page, globalFunction.generateUrlParams({"status": "1"})).$promise.then(function (scene_records) {
                        $scope.scene_records = scene_records;
                    });
                }
                $scope.select();
                $scope.select_desk = function (layer) {
                    $scope.desks = angular.copy($scope.items);
//                $scope.pagination.select(page,globalFunction.generateUrlParams($scope.condition, {sceneRecord: {}}))
                    desk.query(globalFunction.generateUrlParams({
                        layer: layer,
                        sort: 'position ASC'
                    }, {sceneRecord: {}}))
                        .$promise.then(function (_desk) {
                            $scope.layer = layer;
                            $scope.desks = _desk;
                            len = $scope.desks.length;
                            $scope.positions = _.pluck($scope.desks, 'position');
                            angular.forEach($scope.items, function (item, index) {
                                if ($scope.positions.indexOf(((index + 1) + ".00")) < 0) {
                                    $scope.desks.splice(index, 0, {
                                        "layer": "",
                                        "desk_no": "",
                                        "position": "",
                                        "status": "2"
                                    });
                                }
                            });
                            //赌台X和Y轴
//                        $scope.desk_content = [];
//                        $scope.tableLayerXY = tableLayerXY.items;
//                        for (var x = 0; x < tableLayerXY.X; x++) {
//                            //$scope.desk_content[x].push([]);
//                            for (var y = 0; y < tableLayerXY.Y; y++) {
//                                //$scope.desk_content[x][y].push([]);
//                                var desk_data = _.findWhere(_desk, {x_position: x.toString(), y_position: y.toString()});
//                                $scope.desk_content.push({
//                                    x_position: x,
//                                    y_position: y,
//                                    desk_id: desk_data == undefined ? "" : desk_data.id,
//                                    desk_no: desk_data == undefined ? "" : desk_data.desk_no
//                                });
//                            }
//                        }
                        });
                }
                $scope.select_desk(1);
                //移動賭枱
//            $scope.move = true;
//            $scope.moveDesk = function(){
//                $scope.move = false;
//            }
                //保存移動賭枱后的位置
                $scope.desks_place = {
                    "desks": []
                };
                $scope.saveDesk = function () {
                    $scope.desks_place.desks = [];
                    angular.forEach($scope.desks, function (desk, num) {
                        desk.position = (num + 1);
                        if (desk.id) {
                            $scope.desks_place.desks.push({
                                "id": desk.id,
                                "desk_no": desk.desk_no,
                                "position": desk.position
                            });
                        }
                    });

                    pinCodeModal(desk, 'updateDesk', $scope.desks_place, '批量修改賭臺位置！').then(function () {
                        $scope.select_desk($scope.layer);
                        $scope.desks_place = {};
                    }, function () {
                        $scope.desks_place.desks = [];
                    })

                }


                //新增賭枱方法
                $scope.addDesk = function () {
                    if (len != $scope.items.length) {
                        var modalInstance;
                        modalInstance = $modal.open({
                            templateUrl: "views/scene/gambling-table-create.html",
                            controller: 'gamblingTableCreateCtrl',
                            resolve: {
                                id: function () {
                                    return "";
                                },
                                layer: function () {
                                    return $scope.layer;
                                },
                                desks: function () {
                                    return $scope.desks;
                                },
                                len: function () {
                                    return len;
                                }
                            }
                        });
                        modalInstance.result.then((function (status) {
                            if (status) {
                                $scope.select_desk($scope.layer);
                            }
                        }), function () {
                            $log.info("Modal dismissed at: " + new Date());
                        });
                    }
                }

                //賭枱 詳細

                $scope.detailDesk = function (desk_one) {
                    if (desk_one.id) {

                        $scope.detail_desk = desk_one;
                    }
                }
                //刪除賭枱
                $scope.deleteDesk = function (detail_desk) {
                    var detail_layer = detail_desk.layer;
                    if (detail_desk.id) {
                        if (detail_desk.status == '0') {
                            pinCodeModal(desk, 'delete', {id: detail_desk.id}, '刪除成功！').then(function () {
                                $scope.select_desk(detail_layer);
                                $scope.detail_desk = {};

                            })
                        } else {
                            topAlert.warning("賭枱已開場不能刪除!");
                        }

                    } else {
                        topAlert.warning("請選擇賭枱!");
                    }
                }

                //修改賭枱
                $scope.updateDesk = function (id) {
                    if (id) {
                        var modalInstance;
                        modalInstance = $modal.open({
                            templateUrl: "views/scene/gambling-table-create.html",
                            controller: 'gamblingTableCreateCtrl',
                            resolve: {
                                id: function () {
                                    return id;
                                },
                                layer: function () {
                                    return $scope.layer;
                                },
                                desks: function () {
                                    return $scope.desks;
                                },
                                len: function () {
                                    return len;
                                }
                            }
                        });
                        modalInstance.result.then((function (status) {
                            if (status) {
                                $scope.select_desk($scope.layer);
                                $scope.detail_desk = {};
                            }
                        }), function () {
                            $log.info("Modal dismissed at: " + new Date());
                        });
                    } else {
                        topAlert.warning("請選擇賭枱!");
                    }
                }

                /*$scope.title = "新增賭枱";
                 $scope.sceneStatus = sceneStatus.items;
                 $scope.tableStatus = tableStatus.items;
                 $scope.tableLayerStatus = tableLayerStatus.items;
                 $scope.layerX = ['A','B','C','D','E','F'];
                 $scope.layerY = [1,2,3,4,5,6]

                 //賭枱位置
                 $scope.layers = [];
                 for(var i=0; i<$scope.layerX.length; i++){
                 for(var j=0; j<$scope.layerY.length; j++){
                 $scope.layers.push($scope.layerX[i]+""+$scope.layerY[j]);
                 }
                 }

                 var init_record_create = {
                 desk_no: "",
                 layer: "",
                 x_position: "",
                 y_position: "",
                 pin_code:""
                 }
                 $scope.record_create = angular.copy(init_record_create);

                 //新增賭枱
                 $scope.desk_url = globalFunction.getApiUrl("scene/desk");
                 $scope.submit = function(){
                 return false;
                 $scope.form_desk_create.checkValidity().then(function() {
                 desk.save($scope.record_create).$promise.then(function(){
                 topAlert.success("新增賭枱成功");
                 $scope.select();
                 $scope.reset();
                 });
                 });
                 }

                 //詳細
                 $scope.is_show = false;
                 $scope.detail = function(record){
                 $scope.title = "賭枱詳細";
                 $scope.is_show = true;
                 $scope.desk_record = record;
                 }

                 $scope.add_desk = function(){
                 $scope.title = "新增賭枱";
                 $scope.is_show = false;
                 }

                 var init_condition = {
                 "layer":"",
                 "desk_no":"",
                 "sceneRecord.scene_no":"",
                 "status":""
                 }
                 $scope.condition = angular.copy(init_condition);

                 $scope.pagination = tmsPagination.create();
                 $scope.pagination.resource = desk;
                 $scope.select = function(page){
                 $scope.condition_copy = angular.copy($scope.condition);
                 if($scope.condition_copy.desk_no){
                 $scope.condition_copy = "!"+$scope.condition_copy.desk_no+"!";
                 }
                 if($scope.condition_copy.sceneRecord){
                 $scope.condition_copy = "!"+$scope.condition_copy.sceneRecord.scene_no+"!";
                 }
                 $scope.desks = $scope.pagination.select(page,globalFunction.generateUrlParams($scope.condition,{sceneRecord:{}}));
                 }
                 $scope.select();

                 $scope.search_reset = function(){
                 $scope.condition = angular.copy(init_condition);
                 $scope.select();
                 }*/

            }]).controller('gamblingTableCreateCtrl', ['$scope', 'desk', 'layer', 'id', 'desks', 'len', 'globalFunction', 'topAlert', '$modalInstance',
            function ($scope, desk, layer, id, desks, len, globalFunction, topAlert, $modalInstance) {
                $scope.title = "新增賭枱";
                $scope.sub_post = id ? 'PUT' : 'POST';
                $scope.desk_url = globalFunction.getApiUrl("scene/desk");
                $scope.init_desk_create_reset = {};
                var init_desk_create = {
                    desk_no: "",
                    layer: "",
                    position: "",
                    pin_code: "",
                    status: "0"
                }
                $scope.desk_create = angular.copy(init_desk_create);
                if (id) {
                    $scope.title = "修改賭枱";
                    desk.get({id: id}).$promise.then(function (desk) {
                        $scope.desk_create = desk;
                        $scope.init_desk_create_reset = angular.copy($scope.desk_create);
                    })
                }

                $scope.add = function () {
                    $scope.positions = _.pluck(desks, 'position');

                    if (id) {
                        $scope.form_desk_create.checkValidity().then(function () {
                            desk.update($scope.desk_create).$promise.then(function () {
                                topAlert.success("修改賭枱成功");
                                $modalInstance.close(true);
                            });
                        });
                    } else {
                        for (var i = 1; i <= 36; i++) {
                            if ($scope.positions.indexOf(i + ".00") < 0) {
                                $scope.desk_create.position = i + "";
                                break;
                            }
                        }
                        $scope.form_desk_create.checkValidity().then(function () {
                            desk.save($scope.desk_create).$promise.then(function () {
                                topAlert.success("新增賭枱成功");
                                $modalInstance.close(true);
                            });
                        });
                    }
                }

                $scope.reset = function () {
                    if (id) {
                        $scope.desk_create = angular.copy($scope.init_desk_create_reset);
                    } else {
                        $scope.desk_create = angular.copy(init_desk_create);
                    }

                }

            }]).controller('sceneTermManagerCtrl', ['$scope', 'breadcrumb', 'globalFunction', 'tmsPagination', 'topAlert', 'outSceneWord', 'pinCodeModal', 'SceneRecordShiftStatus',
            function ($scope, breadcrumb, globalFunction, tmsPagination, topAlert, outSceneWord, pinCodeModal, SceneRecordShiftStatus) {
                breadcrumb.items = [
                    {"name": "場面數用語管理", "active": true}
                ];

//            $scope.fundSourceTypes = fundSourceTypes;
                $scope.sub_method1 = $scope.sub_method2 = "POST";
                $scope.SceneRecordShiftStatus = SceneRecordShiftStatus;
                $scope.outSceneWords1 = $scope.outSceneWords2 = [];
                //搜索條件
                $scope.condition1 = {type: "1"}
                $scope.condition2 = {type: "0"}

                $scope.pagination1 = tmsPagination.create();
                $scope.pagination1.resource = outSceneWord;
                $scope.select1 = function (page) {
                    $scope.pagination1.select(page, $scope.condition1).$promise.then(function (_outSceneWords) {
                        $scope.outSceneWords1 = _outSceneWords;
                    });
                }
                $scope.select1();
                $scope.pagination2 = tmsPagination.create();
                $scope.pagination2.resource = outSceneWord;
                $scope.select2 = function (page) {
                    $scope.pagination2.select(page, $scope.condition2).$promise.then(function (_outSceneWords) {
                        $scope.outSceneWords2 = _outSceneWords;
                    });
                }
                $scope.select2();

//            $scope.search = function(){
//                $scope.select();
//            }

                var init_record1 = {
                    o_word: "",
                    type: "1",
                    pin_code: ""
                }
                var init_record2 = {
                    o_word: "",
                    type: "0",
                    pin_code: ""
                }
                $scope.record1 = angular.copy(init_record1);
                $scope.record2 = angular.copy(init_record2);

                /**
                 * 新增場面書常用語
                 */
                $scope.disabled_submit1 = $scope.disabled_submit2 = false;
                $scope.scene_term_url = globalFunction.getApiUrl("scene/outsceneword");
                $scope.submit1 = function () {
                    if ($scope.disabled_submit1) {
                        return $scope.disabled_submit1;
                    }
                    $scope.disabled_submit1 = true;
                    if ($scope.record1.id) {
                        $scope.form_scene_term1.checkValidity().then(function () {
                            outSceneWord.update($scope.record1).$promise.then(function () {
                                $scope.select1();
                                $scope.reset1();
                                topAlert.success("場面數常用語修改成功");
                                $scope.disabled_submit1 = false;
                            }, function () {
                                $scope.disabled_submit1 = false;
                            });
                        });
                    } else {
                        $scope.form_scene_term1.checkValidity().then(function () {
                            outSceneWord.save($scope.record1).$promise.then(function () {
                                $scope.select1();
                                $scope.reset1();
                                topAlert.success("場面數常用語新增成功");
                                $scope.disabled_submit1 = false;
                            }, function () {
                                $scope.disabled_submit1 = false;
                            });
                        });
                    }
                }
                $scope.submit2 = function () {
                    if ($scope.disabled_submit2) {
                        return $scope.disabled_submit2;
                    }
                    $scope.disabled_submit2 = true;
                    if ($scope.record2.id) {
                        $scope.form_scene_term2.checkValidity().then(function () {
                            outSceneWord.update($scope.record2).$promise.then(function () {
                                $scope.select2();
                                $scope.reset2();
                                topAlert.success("場面數常用語修改成功");
                                $scope.disabled_submit2 = false;
                            }, function () {
                                $scope.disabled_submit2 = false;
                            });
                        });
                    } else {
                        $scope.form_scene_term2.checkValidity().then(function () {
                            outSceneWord.save($scope.record2).$promise.then(function () {
                                $scope.select2();
                                $scope.reset2();
                                topAlert.success("場面數常用語新增成功");
                                $scope.disabled_submit2 = false;
                            }, function () {
                                $scope.disabled_submit2 = false;
                            });
                        });
                    }
                }

                $scope.remove1 = function (id) {
                    pinCodeModal(outSceneWord, 'delete', {id: id}, '刪除成功！').then(function () {
                        $scope.select1();
                    })
                }
                $scope.remove2 = function (id) {
                    pinCodeModal(outSceneWord, 'delete', {id: id}, '刪除成功！').then(function () {
                        $scope.select2();
                    })
                }

                $scope.reset1 = function () {
                    $scope.record1 = angular.copy(init_record1);
                    $scope.sub_method1 = "POST";
                    $scope.form_scene_term1.clearErrors();
                }
                $scope.reset2 = function () {
                    $scope.record2 = angular.copy(init_record2);
                    $scope.sub_method2 = "POST";
                    $scope.form_scene_term2.clearErrors();
                }

                $scope.update1 = function (record) {
                    $scope.sub_method1 = "PUT";
                    $scope.record1.id = record.id;
                    $scope.record1.o_word = record.o_word;
                }
                $scope.update2 = function (record) {
                    $scope.sub_method2 = "PUT";
                    $scope.record2.id = record.id;
                    $scope.record2.o_word = record.o_word;
                }


            }]);
}).call(this);

