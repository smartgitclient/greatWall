(function() {
    'use strict';
    angular.module('app.transfer.ctrls', ["app.transfer.services"]).controller('transferManagerCtrl',
    ['$scope','transfer','agentsLists','depositCard','hallName','tmsPagination','globalFunction','breadcrumb','$filter','topAlert','$modal',
        function($scope,transfer,agentsLists,depositCard,hallName,tmsPagination,globalFunction,breadcrumb,$filter,topAlert,$modal){

            //麵包屑導航
            breadcrumb.items = [
              {"name":"存卡轉賬","active":true}
            ];

            //自定義變量
            $scope.halls = hallName.query();
            $scope.transfer_url =globalFunction.getApiUrl('deposit/transfer');

            //查詢變量
            var original;
            var init_condition = {
                hall_id:'',
                send_agent_code:'',
                receive_agent_code:'',
                transfer_time:[''],
                update_time:['','']
            };
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);

            var conditions ;
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = transfer;

            $scope.select = function(page){
                $scope.condition.update_time[0] = $filter('date')($scope.condition.update_time[0], 'yyyy-MM-dd');
                $scope.condition.update_time[1] = $filter('date')($scope.condition.update_time[1], 'yyyy-MM-dd');
                $scope.condition.transfer_time[0] = $filter('date')($scope.condition.transfer_time[0], 'yyyy-MM');
                conditions = angular.copy($scope.condition);
                if(conditions.send_agent_code != ''){
                    conditions.send_agent_code = "!"+conditions.send_agent_code+"!";
                }
                if(conditions.receive_agent_code != ''){
                    conditions.receive_agent_code = "!"+conditions.receive_agent_code+"!";
                }
                $scope.transfers = $scope.pagination.select(page,conditions);
            }
            $scope.select();
            //搜索方法
            $scope.search = function(){
                $scope.select(1);
            }
            //重置查詢條件
            $scope.reset = function(){
                $scope.condition = angular.copy(original);
                $scope.select();
            }
            //定義變量
            var original_transfer;
            $scope.transfer = {
                send_agent_id:"",//轉出戶口ID
                send_agent_name:"",//轉出戶口名稱
                send_agent_code:"",//轉出戶口編號
                receive_agent_id:"",//轉入戶口ID
                receive_agent_name:"",//轉入戶口名稱
                receive_agent_code:"",//轉入戶口編號
                amount:""//轉賬金額
            }
            original_transfer = angular.copy($scope.transfer);

            //監控轉出戶口編號 獲取agent_info_id
            $scope.$watch('transfer.send_agent_code',function(new_value,old_value) {
                $scope.send_agent = [];
                if (new_value != '') {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function(agent) {
                        $scope.send_agent = agent;
                        if($scope.send_agent.length > 0) {
                            $scope.transfer.send_agent_id =$scope.send_agent[0].id;
                            $scope.transfer.send_agent_name = $scope.send_agent[0].agent_name;
                            depositCard.query(globalFunction.generateUrlParams({agent_info_id:$scope.send_agent[0].id},{})).$promise.then(function(depositCards) {
                                if (depositCards.length == 0) {
                                    $scope.send_depositCards.usable_amount = 0;
                                } else {
                                    $scope.send_depositCards = depositCards[0];
                                }
                            })
                        }else{
                            $scope.transfer.send_agent_id ="";
                            $scope.transfer.send_agent_name = "";
                            $scope.send_depositCards = [];
                        }
                    })
                }else{
                    $scope.transfer.send_agent_id ="";
                    $scope.transfer.send_agent_name = "";
                    $scope.send_depositCards = [];
                }
            });
            //監控轉入戶口編號 獲取agent_info_id
            $scope.$watch('transfer.receive_agent_code',function(new_value,old_value) {
                $scope.receive_agent = [];
                if (new_value != '') {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function(agent) {
                        $scope.receive_agent = agent;
                        if($scope.receive_agent.length > 0) {
                            $scope.transfer.receive_agent_id =$scope.receive_agent[0].id;
                            $scope.transfer.receive_agent_name = $scope.receive_agent[0].agent_name;
                            depositCard.query(globalFunction.generateUrlParams({agent_info_id:$scope.receive_agent[0].id},{})).$promise.then(function(depositCards) {
                                if (depositCards.length == 0) {
                                    $scope.receive_depositCards.usable_amount = 0;
                                } else {
                                    $scope.receive_depositCards = depositCards[0];
                                }
                            })
                        }else{
                            $scope.transfer.receive_agent_id ="";
                            $scope.transfer.receive_agent_name = "";
                            $scope.receive_depositCards = [];
                        }
                    })
                }else{
                    $scope.transfer.receive_agent_id ="";
                    $scope.transfer.receive_agent_name = "";
                    $scope.receive_depositCards = [];
                }
            });


            //新增轉賬方法
            $scope.add = function(){
                if($scope.transfer.send_agent_code != '' && $scope.transfer.send_agent_code == $scope.transfer.receive_agent_code){
                    topAlert.warning("轉出戶口編號不能等於轉入戶口編號!");
                    return;
                }
                if($scope.transfer.send_agent_code != '' && $scope.transfer.amount > $scope.send_depositCards.usable_amount){
                    topAlert.warning("轉賬金額不能大於轉出戶口客戶餘額!");
                    return;
                }
//                return;
                $scope.form_transfer_create.checkValidity().then(function(){
                    $scope.disabled_submit = true;
                    transfer.save($scope.transfer,function(){
                        topAlert.success("添加成功！");
                        $scope.select();
                        $scope.reset_transfer();
                        $scope.disabled_submit = false;
                    },function(){
                        $scope.disabled_submit = false;
                    })
                })

            }
            //重置方法
            $scope.reset_transfer = function(){
                $scope.transfer = angular.copy(original_transfer);
                $scope.form_transfer_create.$setPristine();
            }

            //轉賬記錄詳細
            $scope.transferDetail = function(id){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/transfer/transfer-manager-detail.html",
                    controller: 'transferManagerDetailCtrl',
                    resolve: {
                        id:function(){
                            return id;
                        }
                    }
                });
            }
    }]).controller('transferManagerDetailCtrl',['$scope','transfer','$modalInstance','id',
        function($scope,transfer, $modalInstance,id){
            if(id != ''){
                $scope.transfer_detail = transfer.get({id:id});
            }
            //關閉彈出框
            $scope.closed = function(){
                $modalInstance.close();
            }
        }]);
}).call(this);
