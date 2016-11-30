(function() {
    'use strict';
    angular.module('app.rolling-transfer.ctrls', ['app.rolling-transfer.services']).controller('rollingTransferListCtrl',['$scope','tmsPagination','breadcrumb', '$filter', '$location', 'globalFunction', 'rollingCardTransfer', 'hallName',
        function($scope,tmsPagination,breadcrumb,$filter,$location,globalFunction,rollingCardTransfer, hallName){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"轉碼流量轉移記錄","active":true}
            ];
            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });
            //存卡記錄查詢
            var original;
            var init_condition = {
                hall_id : "",
                out_agent_code : "",
                in_agent_code : "",
                oper_time : ["", ""]
            };
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            var conditions ;
            //初始化化存卡記錄客戶信息
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = rollingCardTransfer;
            $scope.select = function(page){
                $scope.condition.oper_time[0] = $filter('date')($scope.condition.oper_time[0], 'yyyy-MM-dd');
                $scope.condition.oper_time[1] = $filter('date')($scope.condition.oper_time[1], 'yyyy-MM-dd');
                conditions = angular.copy($scope.condition);
                $scope.rollingCardTransfers = $scope.pagination.select(page,globalFunction.generateUrlParams(conditions,{refRollCardRecdTransfers : {}}));
            }
            $scope.select();

            //查詢方法
            $scope.search = function(){
              $scope.select();
            }

            $scope.detail = function(id){
                $location.path('rolling-transfer/transfer-detail/'+id);
            }
            //查詢方法重置
            $scope.reset = function(){
                $scope.condition = angular.copy(original);
                $scope.select();
            }
    }]).controller('rollingTransferDetailCtrl',['$scope','breadcrumb', '$stateParams', 'globalFunction', 'rollingCardTransfer','fundSourceTypes',
        function($scope, breadcrumb, $stateParams, globalFunction, rollingCardTransfer, fundSourceTypes){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"轉碼流量轉移詳細","active":true}
            ];

            $scope.fundSourceTypes_items = fundSourceTypes.items;
            $scope.transfer = {};
            var param_id = $stateParams.id;

            if(!angular.isUndefined(param_id))
            {
                rollingCardTransfer.get(globalFunction.generateUrlParams({ id : param_id }, {refRollCardRecdTransfers : { }})).$promise.then(function(data)
                {
                    $scope.transfer = data;
                })
            }


    }]).controller('rollingTransferRecordCtrl',['$scope','agentsLists','rollingCardRecord','commissionCard','rollingCardAmount','hallName','fundSourceTypes','globalFunction','tmsPagination','breadcrumb','$modal','$filter','$log','topAlert', 'rollingCardRecordRecordTotal',
        function($scope,agentsLists,rollingCardRecord,commissionCard,rollingCardAmount,hallName,fundSourceTypes,globalFunction,tmsPagination,breadcrumb,$modal,$filter,$log,topAlert, rollingCardRecordRecordTotal){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"轉碼流量查詢","active":true}
            ];
            //自定義變量
            $scope.halls = hallName.query({hall_type:2});
            //轉碼卡
            //$scope.commissionCards =commissionCard.query();
            $scope.cardAmountTotal = 0; //rollingCardAmount.cardAmountTotal();
            $scope.fundSourceTypes  = fundSourceTypes;
            $scope.commissionCards = [];
            $scope.rollingCardRecords =[];

            $scope.rolling_check_alls = "";
            $scope.rolling_check_true = [];
            $scope.rolling_check_false = [];
            $scope.check_true_IDS =[];//保存選中的轉碼id
            $scope.check_card_amount_totals = 0;
            $scope.check_card_amount_totals_false = 0;
            $scope.agent_code = "";
            // 轉碼流量查詢
            var original;
            var init_condition = {
                hall_id:"",
                rollingRecord:{
                    rolling_record_no:""

                },
                roll_time:['',''],
                receive_agent_id: "",
                receive_card_id:""
            };
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.$watch('agent_code',globalFunction.debounce(function(new_value,old_value){
                if(new_value){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value},{})).$promise.then(function (agent) {
                        if (agent.length > 0) {
                            $scope.agent = agent[0];
                            $scope.agent_name = $scope.agent.agent_name;
                            $scope.condition.receive_agent_id = $scope.agent.id;
                            commissionCard.query({agent_info_id:$scope.agent.id}).$promise.then(function(commissionCards){
                                $scope.commissionCards = commissionCards;
                            });
                        }else{
                            $scope.agent_name = "";
                            $scope.condition.receive_agent_id = "";
                            $scope.commissionCards = [];
                        }
                    })
                }else{
                    $scope.agent_name = "";
                    $scope.condition.receive_agent_id = "";
                    $scope.commissionCards = [];
                }
            }))
            var conditions ;
            //初始化化存卡記錄客戶信息
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = rollingCardRecord;
            //$scope.pagination.items_per_page = 1;
            $scope.select = function(page){
                $scope.condition.roll_time[0] = $filter('date')($scope.condition.roll_time[0], 'yyyy-MM-dd');
                $scope.condition.roll_time[1] = $filter('date')($scope.condition.roll_time[1], 'yyyy-MM-dd');
                conditions = angular.copy($scope.condition);
//
//                if(conditions.agent_code != ''){
//                    conditions.agent_code = conditions.agent_code+"!";
//                }
//                if(conditions.agent_name != ''){
//                    conditions.agent_name = conditions.agent_name+"!";
//                }
//                $scope.tickets = $scope.pagination.select(page,globalFunction.generateUrlParams(conditions,{}));
                 $scope.pagination.select(page,conditions).$promise.then(function(data)
                 {
                     $scope.rollingCardRecords = data;
                     _.each($scope.rollingCardRecords, function(rollingcardRecord)
                     {
                         var r_id = rollingcardRecord.id;
                         if($scope.rolling_check_alls && -1 === _.indexOf($scope.rolling_check_false, r_id))
                         {
                             rollingcardRecord.selected = true;
                             if(-1 === _.indexOf($scope.rolling_check_true, r_id))
                             {
                                 $scope.rolling_check_true.push(r_id);
                                 $scope.check_card_amount_totals += parseFloat(rollingcardRecord.amount);
                             }
                         }
                         else
                         {
                             if(-1 !== _.indexOf($scope.rolling_check_true, r_id))
                             {
                                 rollingcardRecord.selected = true;
                             }
                         }
                     })

                 })
            }
            //$scope.select();

            $scope.change_agent_code = function()
            {
                //$scope.agent_code = "";
                $scope.agent_name = "";
                $scope.cardAmountTotal = "";
                $scope.commissionCards = [];
                $scope.rollingCardRecords =[];
                $scope.rolling_check_alls = false;
                $scope.rolling_check_true = [];
                $scope.rolling_check_false = [];
                $scope.check_card_amount_totals = 0;
                $scope.check_card_amount_totals_false = 0;
                $scope.condition.receive_agent_id = "";
                $scope.condition.receive_card_id = ""
            }

            //查詢方法
            $scope.search = function(){
                if($scope.condition.receive_card_id && !($scope.user.isAllHall() ^ !!$scope.condition.hall_id)){ // ^ 异或符号
                    $scope.rolling_check_true = [];
                    $scope.rolling_check_false = [];
                    $scope.card = _.findWhere($scope.commissionCards, {id: $scope.condition.receive_card_id});
                    $scope.select();
                    rollingCardRecordRecordTotal.get(globalFunction.generateUrlParams(conditions, {})).$promise.then(function(data)
                    {
                        $scope.cardAmountTotal = data;
                    });
                }else{
                    topAlert.warning("請選擇轉碼卡与廳館之後查詢！");
                }
            }
            //查詢方法重置
            $scope.reset = function(){
                $scope.condition = angular.copy(original);
                $scope.rollingCardRecords =[];
                $scope.agent_code = "";
                $scope.agent_name = "";
                $scope.cardAmountTotal = "";
                $scope.rolling_check_alls = false;
                $scope.rolling_check_true = [];
                $scope.rolling_check_false = [];
                $scope.check_card_amount_totals = 0;
                $scope.check_card_amount_totals_false = 0;
            }

            //全選
            /*$scope.rolling_check_all =function(){

                _.each($scope.rollingCardRecords,function(rollingCardRecord){
                    rollingCardRecord.selected = $scope.rolling_check_alls;
                })
                if($scope.rolling_check_alls){
                    _.each($scope.rollingCardRecords,function(rollingCardRecord){
                        $scope.check_true_IDS.push({id:rollingCardRecord.id});
                        $scope.check_card_amount_totals += parseFloat(rollingCardRecord.amount);
                    })
                }else{
                    $scope.check_true_IDS = [];
                    $scope.check_card_amount_totals = 0;
                }

            }*/

            $scope.rolling_check_all_fun = function()
            {
                $scope.rolling_check_true = [];
                $scope.rolling_check_false = [];
                $scope.check_card_amount_totals = 0;
                $scope.check_card_amount_totals_false = 0;
                _.each($scope.rollingCardRecords, function(rollingcardRecord)
                {
                    rollingcardRecord.selected = $scope.rolling_check_alls;
                    if($scope.rolling_check_alls)
                    {
                        $scope.rolling_check_true.push(rollingcardRecord.id);
                        $scope.check_card_amount_totals += parseFloat(rollingcardRecord.amount);
                    }
                })
            }

            $scope.check_rolling = function(rollingcardRecord)
            {
                var id = rollingcardRecord.id;
                var amount = parseFloat(rollingcardRecord.amount);
                if($scope.rolling_check_alls) //全选
                {
                    if(rollingcardRecord.selected) // 选中
                    {
                        $scope.rolling_check_false = _.without($scope.rolling_check_false, id);
                        if(-1 === _.indexOf($scope.rolling_check_true, id))
                        {
                            $scope.rolling_check_true.push(id);
                            $scope.check_card_amount_totals += amount;
                            $scope.check_card_amount_totals_false -= amount;
                        }
                    }
                    else
                    {
                        $scope.rolling_check_false.push(id);
                        $scope.rolling_check_true = _.without($scope.rolling_check_true, id);
                        $scope.check_card_amount_totals -= amount;
                        $scope.check_card_amount_totals_false += amount;
                    }
                }
                else
                {
                    if(rollingcardRecord.selected)
                    {
                        $scope.rolling_check_true.push(id);
                        $scope.rolling_check_false = _.without($scope.rolling_check_false, id);
                        $scope.check_card_amount_totals += amount;
                    }
                    else
                    {
                        $scope.rolling_check_true = _.without($scope.rolling_check_true, id);
                        $scope.check_card_amount_totals -= amount;
                    }
                }
            }


            //計算已勾選的流量
            $scope.cardAmountTotals =function(){

            }

            $scope.rollingRecord =function(){

                //已选择全选时 总数减去没选的，
                var amount_total = $scope.rolling_check_alls ? $scope.cardAmountTotal.total - $scope.check_card_amount_totals_false
                    : $scope.check_card_amount_totals;

                if(amount_total > 0){
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/rolling-transfer/rolling-record-detail.html",
                        controller: 'rollingRecordDetailCtrl',
                        resolve: {
                            condition: function () {
                                return $scope.condition;
                            },
                            check_card_amount_totals: function () {
                                return amount_total;
                            },
                            check_all: function () {
                                return $scope.rolling_check_alls;
                            },
                            agent_code: function () {
                                return $scope.agent_code;
                            },
                            agent_name: function () {
                                return $scope.agent_name;
                            },
                            card: function () {
                                return $scope.card;
                            },
                            user_list : function(){
                                return $scope.rolling_check_alls ? $scope.rolling_check_false : $scope.rolling_check_true;
                            }
                        }
                    });
                    modalInstance.result.then((function(status) {
                        if(status){
                            $scope.select();
                            $scope.rolling_check_alls = false;
                        }
                    }), function() {
                        $log.info("Modal dismissed at: " + new Date());
                    });
                }else{
                    topAlert.warning("請選擇轉碼流水!");
                }

            }

    }]).controller('rollingRecordDetailCtrl',['$scope','agentsLists','commissionCard','globalFunction','user','condition','check_card_amount_totals','agent_name','card', '$modalInstance', 'user_list', 'check_all', 'rollingCardTransfer', 'topAlert', 'agent_code',
        function($scope,agentsLists,commissionCard,globalFunction,user,condition,check_card_amount_totals,agent_name,card, $modalInstance, user_list,  check_all, rollingCardTransfer ,topAlert, agent_code){
            //轉移流量
            $scope.hall_name = user.hall.hall_name;
            $scope.check_card_amount_totals = check_card_amount_totals;
            $scope.condition = condition;
            $scope.agent_name = agent_name;
            $scope.agent_code = agent_code;
            $scope.card = card;
            $scope.user_list = user_list;

            $scope.sub_post_put = 'POST';
            $scope.rollingTransfer_url = globalFunction.getApiUrl('rolling/rollingCardTransfer');

            $scope.isDisabled = false;

            var new_condition = globalFunction.generateUrlParams($scope.condition,{});
            /*var url_params = "?";
            for(var i in new_condition)
            {
                if(!new_condition[i]){ continue; }
                url_params += i +'='+new_condition[i] + '&';
            }
            url_params = url_params ? url_params.slice(0, -1) : "";

            $scope.submit_url = $scope.rollingTransfer_url + url_params;*/

            $scope.model_con = {receive_agent_code : ""};

            $scope.rollingRecord = {
                rollingCardRecords : user_list,
                in_agent_id : '',
                in_comm_card_id : '',
                out_agent_id : $scope.condition.receive_agent_id,
                out_comm_card_id : $scope.condition.receive_card_id,
                is_selected : check_all ? 1 : 0,
                amount : $scope.check_card_amount_totals,
                remark:"",
                pin_code:""

            }


            $scope.$watch('model_con.receive_agent_code',globalFunction.debounce(function(new_value,old_value){
                if(new_value){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value},{})).$promise.then(function (agent) {
                        if (agent.length > 0) {
                            $scope.agent = agent[0];
                            $scope.rollingRecord.in_agent_id = $scope.agent.id;
                            //$scope.agent_name = $scope.agent.agent_name;
                            commissionCard.query({agent_info_id:$scope.agent.id}).$promise.then(function(commissionCards){
                                $scope.commissionCards = commissionCards;
                            });
                        }else{
                            //$scope.agent_name = "";
                            $scope.rollingRecord.in_agent_id = "";
                            $scope.commissionCards = [];
                        }
                    })
                }else{
                    //$scope.agent_name = "";
                    $scope.rollingRecord.in_agent_id = "";
                    $scope.commissionCards = [];
                }
            }))

            $scope.submit = function()
            {
                var tis = "轉碼卡流量轉移成功。";
                $scope.isDisabled = true;
                $scope.form_add_transfer.checkValidity().then(function()
                {
                    rollingCardTransfer.save(new_condition,$scope.rollingRecord, function()
                    {
                        $scope.isDisabled = false;
                        topAlert.success(tis);
                        //$scope.search();
                        $modalInstance.close(true);
                    },function()
                    {
                        $scope.isDisabled = false;
                    })
                });
            }

            $scope.reset = function()
            {
                $modalInstance.close(false);
            }

     }])

}).call(this);