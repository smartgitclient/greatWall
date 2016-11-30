/**
 * Created by dell on 2015/6/30.
 */
(function(){

    "use strict";
    angular.module('app.oldData.ctrls', ['app.oldData.services'])
/*場面截數*/.controller('oldSceneShiftRecordCtrl',['$scope','breadcrumb','$filter','oldSceneShiftRecord','globalFunction','tmsPagination',function($scope,breadcrumb,$filter,oldSceneShiftRecord,globalFunction,tmsPagination){
            breadcrumb.items = [
                {"name":"場面截數","active":true}
            ];

            var condition_init = {
                hall_name:"",
                o_date:["",""],
                year_month:"2015-02",
                year:"",
                month:"",
                sort:"o_date desc"
            };

            $scope.condition = angular.copy(condition_init);

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = oldSceneShiftRecord;

            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });

            $scope.excel_condition = "";

            $scope.select = function(page){

                var conditions = angular.copy($scope.condition);

                if(_.isString(conditions.year_month)){
                    conditions.year_month = new Date(conditions.year_month);
                }

                conditions.o_date[0] = conditions.o_date[0] ? $filter('date')(conditions.o_date[0], 'yyyy-MM-dd') : "";
                conditions.o_date[1] = conditions.o_date[1] ? $filter('date')(conditions.o_date[1], 'yyyy-MM-dd') : "";

                conditions.year = conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy') : "";
                conditions.month = conditions.year_month ? $filter('date')(conditions.year_month, 'MM') : "";

                var excel = {
                    hall_name:conditions.hall_name,
                    year_month:conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy-MM') : "",
                    o_date:conditions.o_date
                };

                $scope.excel_condition = angular.copy(excel);

                $scope.records = $scope.pagination.select(page,conditions);
            };

            $scope.search = function(){
                $scope.select(1);
            };

            $scope.search();

            $scope.reset = function(){
                $scope.condition = angular.copy(condition_init);
                $scope.search();
            };

/*場面數記錄*/}]).controller('oldScreeningListCtrl',['$scope','breadcrumb','globalFunction','agentsLists','$filter','oldSceneRecord','tmsPagination',function($scope,breadcrumb,globalFunction,agentsLists,$filter,oldSceneRecord,tmsPagination){
            breadcrumb.items = [
                {"name":"場面數記錄","active":true}
            ];

            var condition_init = {
                hall_name:"",
                agent_code:"",
                scene_date:["",""],
                status:"",
                sort:"o_date desc"
            };

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = oldSceneRecord;

            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });

            $scope.condition = angular.copy(condition_init);

            //监控户口
            $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value,old_value){
                $scope.agent_name = "";
                if(new_value) {
                    agentsLists.query({agent_code: new_value}).$promise.then(function(agents){
                        if(agents[0]){
                            $scope.agent_name = agents[0].agent_name;
                        }
                    });
                }
            }));

            $scope.excel_condition = "";

            $scope.select = function(page){

                var conditions = angular.copy($scope.condition);

                conditions.scene_date[0] = conditions.scene_date[0] ? $filter('date')(conditions.scene_date[0], 'yyyy-MM-dd') : "";
                conditions.scene_date[1] = conditions.scene_date[1] ? $filter('date')(conditions.scene_date[1], 'yyyy-MM-dd') : "";

                var excel = {
                    hall_name:conditions.hall_name,
                    status:conditions.status,
                    agent_code:conditions.agent_code,
                    scene_date:conditions.scene_date
                };

                $scope.excel_condition = angular.copy(excel);

                $scope.sceneRecords = $scope.pagination.select(page,conditions);

            };

            $scope.search = function(){
                $scope.select(1);
            };

            $scope.search();

            $scope.reset = function(){
                $scope.condition = angular.copy(condition_init);
                $scope.search();
            };


/*存卡流水*/}]).controller('oldDepositCardRecord',['$scope','breadcrumb','globalFunction','agentsLists','currentShift','$filter','tmsPagination','olddepositcardrecord',function($scope,breadcrumb,globalFunction,agentsLists,currentShift,$filter,tmsPagination,olddepositcardrecord){
            breadcrumb.items = [
                {"name":"存卡流水","active":true}
            ];

            var condition_init = {
                hall_name:"",
                agent_code:"",
                agent_name:"",
                year_month:"2015-02",
                year:"",
                o_date:["",""],
                month:"",
                transaction_type:"",
                sort:"create_time desc"
            };

            $scope.condition = angular.copy(condition_init);

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = olddepositcardrecord;

            $scope.excel_condition = "";

            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });

            //监控户口
            $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value,old_value){
                $scope.condition.agent_name = "";
                if(new_value) {
                    agentsLists.query({agent_code: new_value}).$promise.then(function(agents){
                        if(agents[0]){
                            $scope.condition.agent_name = agents[0].agent_name;
                        }
                    });
                }
            }));

            $scope.select = function(page){
                var conditions = angular.copy($scope.condition);
                if(_.isString(conditions.year_month)){
                    conditions.year_month = new Date(conditions.year_month);
                }
                conditions.year = conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy') : "";
                conditions.month = conditions.year_month ? $filter('date')(conditions.year_month, 'MM') : "";
                conditions.o_date[0] = conditions.o_date[0] ? $filter('date')(conditions.o_date[0], 'yyyy-MM-dd') : "";
                conditions.o_date[1] = conditions.o_date[1] ? $filter('date')(conditions.o_date[1], 'yyyy-MM-dd') : "";

                var excel = {
                    hall_name:conditions.hall_name,
                    year_month:conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy-MM') : "",
                    agent_code:conditions.agent_code,
                    o_date:conditions.o_date,
                    transaction_type:conditions.transaction_type
                };

                $scope.excel_condition = angular.copy(excel);

                $scope.depositCards = $scope.pagination.select(page,conditions);


            };

            $scope.search = function(){
                $scope.select(1);
            };

            $scope.search();

            $scope.reset = function(){
                $scope.condition = angular.copy(condition_init);
                $scope.select();
            };

/*轉碼流水*/ }]).controller('oldRollingRecordListCtrl',['$scope','breadcrumb','globalFunction','agentsLists','tmsPagination','oldRollingRecord','$filter',function($scope,breadcrumb,globalFunction,agentsLists,tmsPagination,oldRollingRecord,$filter){

            breadcrumb.items = [
                {"name":"轉碼流水","active":true}
            ];

            var condition_init = {
                hall_name:"",
                agent_code: '',
                agent_name:"",
                rolling_time:["",""],
                sort:"rolling_time desc",
                year_month:"2015-02",
                year:"",
                month:""
            };

            $scope.condition = angular.copy(condition_init);

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = oldRollingRecord;

            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });

            //监控户口
            $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value,old_value){
                $scope.condition.agent_name = "";
                if(new_value) {
                    agentsLists.query({agent_code: new_value}).$promise.then(function(agents){
                        if(agents[0]){
                            $scope.condition.agent_name = agents[0].agent_name;
                        }
                    });
                }
            }));

            $scope.excel_condition = "";

            $scope.select = function(page){
                var conditions = angular.copy($scope.condition);
                if(_.isString(conditions.year_month)){
                    conditions.year_month = new Date(conditions.year_month);
                }
                conditions.rolling_time[0] = conditions.rolling_time[0] ? $filter('date')(conditions.rolling_time[0], 'yyyy-MM-dd') : "";
                conditions.rolling_time[1] = conditions.rolling_time[1] ? $filter('date')(conditions.rolling_time[1], 'yyyy-MM-dd') : "";
                conditions.year = conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy') : "";
                conditions.month = conditions.year_month ? $filter('date')(conditions.year_month, 'MM') : "";

                var excel = {
                    agent_code:conditions.agent_code,
                    hall_name:conditions.hall_name,
                    year_month:conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy-MM') : "",
                    rolling_time:conditions.rolling_time
                };

                $scope.excel_condition = excel;

                $scope.rollingCardAmounts = $scope.pagination.select(page,conditions);
            };

            $scope.search = function(){
                $scope.select(1);
            };

            $scope.search();

            $scope.reset = function(){
                $scope.condition = angular.copy(condition_init);
                $scope.select();
            };

/*消費記錄*/}]).controller('oldConsumptionRecordListCtrl',['$scope','breadcrumb','consumptionType','$filter','oldconsumption','tmsPagination','globalFunction',function($scope,breadcrumb,consumptionType,$filter,oldconsumption,tmsPagination,globalFunction){
            breadcrumb.items = [
                {"name":"消費記錄","active":true}
            ];

            $scope.excel_condition = "";

            var condition_init = {
                hall_name:"",
                seqnumber:"",
                o_date:"",
                consumption_type:"",
                agent_code:"",
                room_no:"",
                sort:"o_date desc",
                year_month:"2015-02",
                year:"",
                month:""
            };

            // 消費類型
            $scope.consumptionTypes = consumptionType.query();

            $scope.condition = angular.copy(condition_init);

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = oldconsumption;

            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });

            $scope.select = function(page){
                var conditions = angular.copy($scope.condition);
                if(conditions.consumption_type=="船票"){
                    conditions.consumption_type="船飛";
                }else if(conditions.consumption_type=="租車"){
                    conditions.consumption_type="車輛";
                }

                if(_.isString(conditions.year_month)){
                    conditions.year_month = new Date(conditions.year_month);
                }
                conditions.o_date = conditions.o_date ? $filter('date')(conditions.o_date, 'yyyy-MM-dd') : "";

                conditions.year = conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy') : "";
                conditions.month = conditions.year_month ? $filter('date')(conditions.year_month, 'MM') : "";

                //conditions.year_month = conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy-MM') : "";

                var excel = {
                    hall_name:conditions.hall_name,
                    year_month:conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy-MM') : "",
                    agent_code:conditions.agent_code,
                    o_date:conditions.o_date,
                    consumption_type:conditions.consumption_type,
                    room_no:conditions.room_no,
                    seqnumber:conditions.seqnumber
                };
                $scope.excel_condition = angular.copy(excel);

                $scope.records = $scope.pagination.select(page,conditions);
            };

            $scope.search = function(){
                $scope.select(1);
            };

            $scope.search();

            $scope.reset = function(){
                $scope.condition = angular.copy(condition_init);
                $scope.search();
            };

/*存單流水*/}]).controller('oldDepositTicketRecord',['$scope','breadcrumb','globalFunction','agentsLists','$filter','oldDeposiTticketRecord','tmsPagination',function($scope,breadcrumb,globalFunction,agentsLists,$filter,oldDeposiTticketRecord,tmsPagination){
            breadcrumb.items = [
                {"name":"存單流水","active":true}
            ];

            $scope.excel_condition = "";


            var condition_init = {
                hall_name:"",
                agent_code:"",
                seqnumber:"",
                transaction_date:"",
                transaction_time:["",""],
                transaction_type:"",
                sort:"transaction_time desc"
            };

            $scope.condition = angular.copy(condition_init);

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = oldDeposiTticketRecord;

            $scope.agent_name = "";

            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });

            //监控户口
            $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value,old_value){
                $scope.agent_name = "";
                if(new_value) {
                    agentsLists.query({agent_code: new_value}).$promise.then(function(agents){
                        if(agents[0]){
                            $scope.agent_name = agents[0].agent_name;
                        }
                    });
                }
            }));

            $scope.select = function(page){
                var conditions = angular.copy($scope.condition);
                conditions.transaction_date = conditions.transaction_date ? $filter('date')(conditions.transaction_date, 'yyyy-MM') : "";
                conditions.transaction_time[0] = conditions.transaction_time[0] ? $filter('date')(conditions.transaction_time[0], 'yyyy-MM-dd') : "";
                conditions.transaction_time[1] = conditions.transaction_time[1] ? $filter('date')(conditions.transaction_time[1], 'yyyy-MM-dd') : "";

                var excel = {
                    hall_name:conditions.hall_name,
                    agent_code:conditions.agent_code,
                    transaction_type:conditions.transaction_type,
                    seqnumber:conditions.seqnumber,
                    transaction_time:conditions.transaction_time
                };

                $scope.excel_condition = angular.copy(excel);

                $scope.records = $scope.pagination.select(page,conditions);
            };

            $scope.search = function(){
                $scope.select(1);
            };

            $scope.search();

            $scope.reset = function(){
                $scope.condition = angular.copy(condition_init);
                $scope.search();
            };
/*截大數管理*/}]).controller('oldShiftRecordMonthlyCtrl',['$scope','breadcrumb','globalFunction','agentsLists','$filter','oldshiftRecordMonthly','tmsPagination',function($scope,breadcrumb,globalFunction,agentsLists,$filter,oldshiftRecordMonthly,tmsPagination){
            breadcrumb.items = [
                {"name":"截大數管理","active":true}
            ];

            var condition_init = {
                hall_name:"",
                year_month:"2015-02",
                year:"",
                month:"",
                sort:"shift_month_time desc"
            };

            $scope.excel_condition = "";

            $scope.condition = angular.copy(condition_init);

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = oldshiftRecordMonthly;

            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });


            $scope.select = function(page){
                var conditions = angular.copy($scope.condition);

                if(_.isString(conditions.year_month)){
                    conditions.year_month = new Date(conditions.year_month);
                }
                conditions.year = conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy') : "";
                conditions.month = conditions.year_month ? $filter('date')(conditions.year_month, 'MM') : "";

                var excel = {
                    hall_name:conditions.hall_name,
                    year_month:conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy-MM') : ""
                };

                $scope.excel_condition = angular.copy(excel);

                $scope.records = $scope.pagination.select(page,conditions);
            };

            $scope.search = function(){
                $scope.select(1);
            };

            $scope.search();

            $scope.reset = function(){
                $scope.condition = angular.copy(condition_init);
                $scope.search();
            };
/*買碼管理*/}]).controller('oldBuyChipsCtrl',['$scope','breadcrumb','globalFunction','agentsLists','$filter','oldBuyChips','tmsPagination',function($scope,breadcrumb,globalFunction,agentsLists,$filter,oldBuyChips,tmsPagination){
            breadcrumb.items = [
                {"name":"買碼管理","active":true}
            ];

            $scope.excel_condition = "";

            var condition_init = {
                hall_name:"",
                seqnumber:"",
                buy_time:"",
                sort:"buy_time desc"
            };

            $scope.condition = angular.copy(condition_init);

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = oldBuyChips;

            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });


            $scope.select = function(page){
                var conditions = angular.copy($scope.condition);

                conditions.buy_time= conditions.buy_time ? $filter('date')(conditions.buy_time, 'yyyy-MM-dd') : "";

                var excel = {
                    hall_name:conditions.hall_name,
                    seqnumber:conditions.seqnumber,
                    buy_time:conditions.buy_time
                };

                $scope.excel_condition = angular.copy(excel);

                $scope.chips = $scope.pagination.select(page,conditions);
            };

            $scope.search = function(){
                $scope.select(1);
            };

            $scope.search();

            $scope.reset = function(){
                $scope.condition = angular.copy(condition_init);
                $scope.search();
            };
/*截更管理*/}]).controller('oldShiftRecordDayCtrl',['$scope','breadcrumb','globalFunction','agentsLists','$filter','oldShiftRecorDay','tmsPagination',function($scope,breadcrumb,globalFunction,agentsLists,$filter,oldShiftRecorDay,tmsPagination){
            breadcrumb.items = [
                {"name":"截更管理","active":true}
            ];

            var condition_init = {
                hall_name:"",
                o_date:"",
                shift:"",
                year_month:"2015-02",
                year:"",
                month:"",
                sort:"shift_date desc"
            };

            $scope.excel_condition = "";

            $scope.condition = angular.copy(condition_init);

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = oldShiftRecorDay;

            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });


            $scope.select = function(page){
                var conditions = angular.copy($scope.condition);

                if(_.isString(conditions.year_month)){
                    conditions.year_month = new Date(conditions.year_month);
                }
                conditions.year = conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy') : "";
                conditions.month = conditions.year_month ? $filter('date')(conditions.year_month, 'MM') : "";

                conditions.o_date= conditions.o_date ? $filter('date')(conditions.o_date, 'yyyy-MM-dd') : "";

                var excel = {
                    hall_name:conditions.hall_name,
                    year_month:conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy-MM') : "",
                    shift:conditions.shift,
                    o_date:conditions.o_date
                };

                $scope.excel_condition = angular.copy(excel);

                $scope.records = $scope.pagination.select(page,conditions);
            };

            $scope.search = function(){
                $scope.select(1);
            };

            $scope.search();

            $scope.reset = function(){
                $scope.condition = angular.copy(condition_init);
                $scope.search();
            };

/*即出记录*/}]).controller('oldCommissionImmediateCtrl',['$scope','breadcrumb','globalFunction','agentsLists','$filter','oldCommissionImmediate','tmsPagination',function($scope,breadcrumb,globalFunction,agentsLists,$filter,oldCommissionImmediate,tmsPagination){
            breadcrumb.items = [
                {"name":"即出記錄","active":true}
            ];

            $scope.excel_condition = "";

            var condition_init = {
                hall_name:"",
                operation_date:["",""],
                agent_code:"",
                year_month:"2015-02",
                year:"",
                month:"",
                sort:"operation_date desc"
            };

            $scope.condition = angular.copy(condition_init);

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = oldCommissionImmediate;

            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });

            //监控户口
            $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value,old_value){
                $scope.agent_name = "";
                if(new_value) {
                    agentsLists.query({agent_code: new_value}).$promise.then(function(agents){
                        if(agents[0]){
                            $scope.agent_name = agents[0].agent_name;
                        }
                    });
                }
            }));


            $scope.select = function(page){
                var conditions = angular.copy($scope.condition);

                if(_.isString(conditions.year_month)){
                    conditions.year_month = new Date(conditions.year_month);
                }
                conditions.year = conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy') : "";
                conditions.month = conditions.year_month ? $filter('date')(conditions.year_month, 'MM') : "";

                conditions.operation_date[0] = conditions.operation_date[0] ? $filter('date')(conditions.operation_date[0], 'yyyy-MM-dd') : "";
                conditions.operation_date[1] = conditions.operation_date[1] ? $filter('date')(conditions.operation_date[1], 'yyyy-MM-dd') : "";

                var excel = {
                    hall_name:conditions.hall_name,
                    agent_code:conditions.agent_code,
                    operation_date:conditions.operation_date,
                    year_month:conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy-MM') : ""
                };

                $scope.excel_condition = angular.copy(excel);

                $scope.commissions = $scope.pagination.select(page,conditions);
            };

            $scope.search = function(){
                $scope.select(1);
            };

            $scope.search();

            $scope.reset = function(){
                $scope.condition = angular.copy(condition_init);
                $scope.search();
            };
/*貸款流水*/}]).controller('oldMarkerRecordCtrl',['$scope','breadcrumb','globalFunction','agentsLists','$filter','oldMarkerRecord','tmsPagination',function($scope,breadcrumb,globalFunction,agentsLists,$filter,oldMarkerRecord,tmsPagination){
            breadcrumb.items = [
                {"name":"貸款流水","active":true}
            ];

            $scope.excel_condition = "";

            var condition_init = {
                hall_name:"",
                seqnumber:"",
                loan_time:["",""],
                agent_code:"",
                /*year_month:"2015-02",
                year:"",
                month:"",*/
                sort:"loan_time desc"
            };

            $scope.condition = angular.copy(condition_init);

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = oldMarkerRecord;

            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });

            //监控户口
            $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value,old_value){
                $scope.agent_name = "";
                if(new_value) {
                    agentsLists.query({agent_code: new_value}).$promise.then(function(agents){
                        if(agents[0]){
                            $scope.agent_name = agents[0].agent_name;
                        }
                    });
                }
            }));


            $scope.select = function(page){
                var conditions = angular.copy($scope.condition);

                /*if(_.isString(conditions.year_month)){
                    conditions.year_month = new Date(conditions.year_month);
                }
                conditions.year = conditions.year_month ? $filter('date')(conditions.year_month, 'yyyy') : "";
                conditions.month = conditions.year_month ? $filter('date')(conditions.year_month, 'MM') : "";*/

                conditions.loan_time[0] = conditions.loan_time[0] ? $filter('date')(conditions.loan_time[0], 'yyyy-MM-dd') : "";
                conditions.loan_time[1] = conditions.loan_time[1] ? $filter('date')(conditions.loan_time[1], 'yyyy-MM-dd') : "";

                var excel = {
                    hall_name:conditions.hall_name,
                    agent_code:conditions.agent_code,
                    loan_time:conditions.loan_time,
                    seqnumber:conditions.seqnumber
                };

                $scope.excel_condition = angular.copy(excel);

                $scope.markers = $scope.pagination.select(page,conditions);
            };

            $scope.search = function(){
                $scope.select(1);
            };

            $scope.search();

            $scope.reset = function(){
                $scope.condition = angular.copy(condition_init);
                $scope.search();
            };
        }])

}).call(this);
