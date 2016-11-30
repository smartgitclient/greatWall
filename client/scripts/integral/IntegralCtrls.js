(function() {
    'use strict';
    angular.module('app.integral.ctrls', ["app.integral.services"]).controller('integralManagerCtrl', [
    '$scope','$filter','currentShift','agentIntegral','integralType','agentsLists','hallName','user','tmsPagination','globalFunction','getDate','breadcrumb','$modal','$log','$location','$stateParams',
        function($scope,$filter,currentShift,agentIntegral,integralType,agentsLists,hallName,user,tmsPagination,globalFunction,getDate,breadcrumb,$modal,$log,$location,$stateParams){
            //麵包屑導航
            breadcrumb.items = [
              {"name":"積分管理","active":true},
            ];
            //自定義變量
            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });
            integralType.query({status:'1'}).$promise.then(function(integralTypes){
                $scope.integralTypes = integralTypes;
            })
            //查詢變量
            var original;
            var init_condition = {
                agentInfo:{agent_code: ""},
                hall_id:"",
                integral_type_id:"",
                expired_month:[""],
                commissionCard:{card_name:""},
                settlement_month:[currentShift.data.year_month],
//                shiftMark:{year_month :[currentShift.data.year_month]},
                sort:"agentInfo.agent_code NUMASC,commissionCard.card_name NUMASC,hall_id ASC"
            };
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = agentIntegral;
            var conditions;
            $scope.select = function(page){
                conditions = angular.copy($scope.condition);
                if(conditions.agentInfo.agent_code){
                    conditions.agentInfo.agent_code = conditions.agentInfo.agent_code+"!";
                }
                conditions.expired_month[0] = conditions.expired_month[0] ? $filter('date')(conditions.expired_month[0], 'yyyy-MM') : "";
                conditions.settlement_month[0] = conditions.settlement_month[0] ? $filter('date')(conditions.settlement_month[0], 'yyyy-MM') : "";
                $scope.integrals =  $scope.pagination.select(page,conditions,{agentIntegralRecycles:{},commissionCard:{}});

            }
            $scope.select();
            //搜索方法
            $scope.search = function(){
                $scope.select();
            }

            if($stateParams.agent_code){
                $scope.condition.agentInfo.agent_code = $stateParams.agent_code;
            }
            //重置查詢條件
            $scope.reset = function() {
                $scope.condition = angular.copy(original);
                $scope.select();
            }
            //發送sms
            $scope.sendSMS = function(){
                $location.path("/integral/integral-sms");
            }

            //監控戶口編號
            //監控戶口編號
            $scope.$watch("condition.agentInfo.agent_code",globalFunction.debounce(function(new_value,old_value){
                if(new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function (agent) {
                        if (agent.length > 0) {
                            $scope.agent_name = agent[0].agent_name;
                            $scope.condition.agent_info_id = agent[0].id;
                        }else{
                            $scope.agent_name ="";
                            $scope.condition.agent_info_id="";
                        }
                    });
                }else{
                    $scope.agent_name ="";
                    $scope.condition.agent_info_id="";
                }
            }));

            //積分設定
            $scope.integral_setting = function(integral){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/integral/integral-manager-setting.html",
                    controller: 'integralManagerSettingCtrl',
                    resolve: {
                        integral:function(){
                            return integral;
                        }
                    }
                });
                modalInstance.result.then((function(status) {
                    if(status){
                        $scope.select();
                    }
                }), function() {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }

            //積分轉移
            $scope.integral_transfer = function(integral){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/integral/integral-transfer.html",
                    controller: 'integralTransferCtrl',
                    resolve: {
                        integral:function(){
                            return integral;
                        }
                    }
                });
                modalInstance.result.then((function(status) {
                    if(status)
                        $scope.select();

                }), function() {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }
//
//            //定義變量
//            var original_buychips;
//            $scope.buychip = {
//                "buy_chips_no":"",
//                "amount":"",
//                "outside_chips":"",
//                "pin_code":""
//            }
//            original_buychips = angular.copy($scope.buychip);
//
//            //新增买码
//            $scope.add = function(){
//                if(!$scope.buychip.outside_chips){
//                    $scope.buychip.outside_chips = '0';
//                }
//                $scope.form_buychips_create.checkValidity().then(function() {
//                    $scope.disabled_submit = true;
//                    buyChips.save($scope.buychip, function () {
//                        topAlert.success("添加成功！");
//                        $scope.select();
//                        $scope.reset_buychips();
//                        $scope.disabled_submit = false;
//                    },function(){
//                        $scope.disabled_submit = false;
//                    });
//                })
//            }
//            $scope.reset_buychips = function(){
//                $scope.buychip = angular.copy(original_buychips);
//                $scope.form_buychips_create.clearErrors();
//            }
//
//            //删除
//           $scope.detele = function(id){
//               windowItems.confirm('系統提示','確定刪除此買碼記錄嗎？',function() {
//                   pinCodeModal(buyChips,'delete',{id:id},'刪除成功！').then(function(){
//                       $scope.select();
//                   })
//               })
//           }

    }]).controller('integralTransferCtrl',['$scope','agentIntegral','agentIntegralTransfer','integral','agentsLists','commissionCard','globalFunction','$modalInstance','topAlert',
        function($scope,agentIntegral,agentIntegralTransfer,integral,agentsLists,commissionCard,globalFunction,$modalInstance,topAlert){
            //積分對象
            $scope.integral = integral;
            $scope.integral_transfer_url = globalFunction.getApiUrl('consumption/agentintegraltransfer');
            //積分model
            var original;
            var int_integral_transfer = {
                "pin_code": "",
                "agent_integral_id":"",
                "in_agent_id":"",
                "in_comm_card_id":"",
                "in_agent_code":"",
                "amount":""
            }
            original = angular.copy(int_integral_transfer);
            $scope.integral_transfer = angular.copy(int_integral_transfer);
            //積分轉移方法
            $scope.disabled_submit = false;
            $scope.add = function(){
                if($scope.disabled_submit){
                    return $scope.disabled_submit;
                }
                if( parseFloat($scope.integral_transfer.amount) > parseFloat($scope.integral_transfer.usable_integral)){
                    topAlert.warning("轉入積分不能大於可用積分!");
                    return;
                }
                $scope.integral_transfer.agent_integral_id =  $scope.integral.id;
                $scope.integral_transfer_copy =angular.copy($scope.integral_transfer);
                $scope.integral_transfer_copy.amount = $scope.integral_transfer.amount/10000;
                $scope.disabled_submit = true;
                $scope.form_integral_transfer.checkValidity().then(function() {
                    agentIntegralTransfer.save($scope.integral_transfer_copy, function () {
                        $scope.reset();
                        topAlert.success('積分轉移成功。');
                        $modalInstance.close(true);
                        $scope.disabled_submit = false;
                    },function(){
                        $scope.disabled_submit = false;
                    })
                })
            }
            //轉入戶口
            $scope.$watch('integral_transfer.in_agent_code',globalFunction.debounce(function(new_value,old_value){
                if(new_value){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code:new_value}, {})).$promise.then(function (agents) {
                        if(agents.length > 0){
                            $scope.to_agent_name = agents[0].agent_name;
                            $scope.integral_transfer.in_agent_id = agents[0].id;
                            //$scope.cards = depositCard.query(globalFunction.generateUrlParams({agent_info_id: agents[0].id}));
                            commissionCard.query(globalFunction.generateUrlParams({agent_info_id: agents[0].id})).$promise.then(function (commissionCards) {
                                $scope.commissionCards = commissionCards;
                            });
                        }else{
                            $scope.to_agent_name = "";
                            $scope.integral_transfer.in_agent_id ="";
                            $scope.commissionCards = [];
                        }
                    });
                }else{
                    $scope.to_agent_name = "";
                    $scope.integral_transfer.in_agent_id ="";
                    $scope.commissionCards = [];
                }
            }));

            //關閉彈出框
            $scope.closed = function(){
                $modalInstance.close("");
            }

            //重置方法
            $scope.reset = function(){
                $scope.form_integral_transfer.clearErrors();
                $scope.integral_transfer = angular.copy(original);
            }


    }]).controller('integralManagerSettingCtrl',['$scope','agentIntegral','integral','globalFunction','agentsLists','$modalInstance','$filter','topAlert',
        function($scope,agentIntegral,integral,globalFunction,agentsLists,$modalInstance,$filter,topAlert){
            $scope.months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
            $scope.setting_integral_url = globalFunction.getApiUrl('consumption/agentintegral');

            var original_integral =angular.copy($scope.integral_setting);
//            $scope.original = function(){
                if(integral.id){
                       $scope.integral = angular.copy(integral);
                       $scope.integral.pin_code = "";
                       if($scope.integral.agentIntegralRecycles && _.where($scope.integral.agentIntegralRecycles,{is_comp_agent:"0"}).length == 0){
                           $scope.integral.agentIntegralRecycles.push({"recycle_rate":"",
                            "recycle_agent_id":"",
                            "agent_code":"",
                            "integral_recycle_agent_code":"",
                            "integral_recycle_agent_id":"",
                            "is_comp_agent":"0"
                           });
                       }
                        if($scope.integral.agentIntegralRecycles && _.where($scope.integral.agentIntegralRecycles,{is_comp_agent:"1"}).length == 0){
                           $scope.integral.agentIntegralRecycles.push({"recycle_rate":"",
                               "recycle_agent_id":"",
                               "agent_code":"",
                               "integral_recycle_agent_code":"",
                               "integral_recycle_agent_id":"",
                               "is_comp_agent":"1"
                           });
                       }
                       $scope.integral_reset = angular.copy( $scope.integral);
                       $scope.integral.expired_month =  $filter("parseDate")($scope.integral.expired_month,'yyyy-MM-dd');
                }
//            $scope.original();
            $scope.addIntegral = function(){
                $scope.integral.agentIntegralRecycles.push({
                    "recycle_rate":"",
                    "recycle_agent_id":"",
                    "agent_code":"",
                    "integral_recycle_agent_code":"",
                    "integral_recycle_agent_id":"",
                    "is_comp_agent":"0"
                });
            }
            $scope.removeIntegral = function(index){
                $scope.integral.agentIntegralRecycles.splice(index,1)
            }

            $scope.addIntegralSpecial = function(){
                $scope.integral.agentIntegralRecycles.push({
                    "recycle_rate":"",
                    "recycle_agent_id":"",
                    "agent_code":"",
                    "integral_recycle_agent_code":"",
                    "integral_recycle_agent_id":"",
                    "is_comp_agent":"1"
                });
            }
            $scope.removeIntegralSpecial = function(index){
                $scope.integral.agentIntegralRecycles.splice(index,1);
            }

            //監控
            $scope.$watch('integral.agentIntegralRecycles',globalFunction.debounce(function(agents,old_agents){
                if(!angular.isUndefined(old_agents)){
                    angular.forEach(agents, function (agent, index) {
                        if (agent.recycle_agent_code) {
                            if (old_agents[index] && old_agents[index].recycle_agent_code != agent.recycle_agent_code) {
                                agentsLists.query(globalFunction.generateUrlParams({agent_code: agent.recycle_agent_code}, {})).$promise.then(function (agent_setting) {
                                    if (agent_setting.length > 0) {
                                        $scope.agent = agent_setting[0];
                                        agent.recycle_agent_id = $scope.agent.id;
                                    } else {
                                        agent.recycle_agent_id = "";
                                    }
                                });
                            }
                        } else {
                            agent.recycle_agent_id = "";
                        }
                        if (agent.integral_recycle_agent_code) {
                            if (old_agents[index] && old_agents[index].integral_recycle_agent_code != agent.integral_recycle_agent_code) {
                                agentsLists.query(globalFunction.generateUrlParams({agent_code: agent.integral_recycle_agent_code}, {})).$promise.then(function (agent_setting) {
                                    if (agent_setting.length > 0) {
                                        $scope.agent = agent_setting[0];
                                        agent.integral_recycle_agent_id = $scope.agent.id;
                                    } else {
                                        agent.integral_recycle_agent_id = "";
                                    }
                                });
                            }
                        } else {
                            agent.integral_recycle_agent_id = "";
                        }
                    });
                }
            },500),true);
            $scope.disabled_submit = false;
            $scope.add = function(){
                if($scope.disabled_submit){
                    return $scope.disabled_submit;
                }
                $scope.integral_copy = angular.copy($scope.integral);
                for(var i = 0; i < $scope.integral_copy.agentIntegralRecycles.length;i++){
                    if(($scope.integral_copy.agentIntegralRecycles[i].recycle_agent_id == '' || $scope.integral_copy.agentIntegralRecycles[i].recycle_rate == null) && ($scope.integral_copy.agentIntegralRecycles[i].recycle_agent_id == '' || $scope.integral_copy.agentIntegralRecycles[i].recycle_rate == null)){
                        $scope.integral_copy.agentIntegralRecycles.splice(i, 1);
                        i = 0;
                    }
                }
                if(!angular.isUndefined($scope.integral_copy.agentIntegralRecycles[0])){
                    if(($scope.integral_copy.agentIntegralRecycles[0].recycle_agent_id == '' || $scope.integral_copy.agentIntegralRecycles[0].recycle_rate == null) && ($scope.integral_copy.agentIntegralRecycles[0].recycle_agent_id == '' || $scope.integral_copy.agentIntegralRecycles[0].recycle_rate == null)){
                        $scope.integral_copy.agentIntegralRecycles = [];
                    }
                }
                $scope.disabled_submit = true;
                $scope.form_setting_integral.checkValidity().then(function() {
                    agentIntegral.update($scope.integral_copy, function () {
                        $scope.reset();
                        topAlert.success("積分設定成功。");
                        $modalInstance.close(true);
                        $scope.disabled_submit = false;
                    },function(){
                        $scope.disabled_submit = false;
                    })
                })
            }

            $scope.change_month = function(){
                if($scope.integral.validity_month){
                    var times = $scope.integral.settlement_month.split("-");
                    if((parseInt(times[1])+parseInt($scope.integral.validity_month)-1) > 12){
                        times[0] = parseInt(times[0]) + 1;
                        times[1] = (parseInt(times[1])+parseInt($scope.integral.validity_month)) - 12;
                    }else{
                        times[1] = parseInt(times[1])+parseInt($scope.integral.validity_month)-1;
                    }

                    if(parseInt(times[1]) >= 10){
                        var date = times[0]+"-"+times[1]+"-01 00:00:00";
                    }else{
                        var date = times[0]+"-0"+times[1]+"-01 00:00:00";
                    }
                    $scope.integral.expired_month =date;
                }
            }

            $scope.reset = function(){
                $scope.form_setting_integral.clearErrors();
                $scope.integral = angular.copy($scope.integral_reset);
            }

            $scope.recycleRate = function(){
                var recycle_rate = 0;
                _.each($scope.integral.agentIntegralRecycles,function(agentIntegralRecycle){
                    if(agentIntegralRecycle.recycle_rate){
                        recycle_rate += parseFloat(agentIntegralRecycle.recycle_rate);
                    }
                });
                if(recycle_rate && recycle_rate != 0){
                    return parseFloat(recycle_rate);
                }else{
                    return parseFloat(0);
                }
            }

    }]).controller('integralTransferRecordCtrl', ['$scope','agentIntegralTransfer','integralType','agentsLists','hallName','user','tmsPagination','globalFunction','getDate','breadcrumb','$modal','$log','$filter','topAlert','windowItems','pinCodeModal',
        function($scope,agentIntegralTransfer,integralType,agentsLists,hallName,user,tmsPagination,globalFunction,getDate,breadcrumb,$modal,$log,$filter,topAlert,windowItems,pinCodeModal){
                //麵包屑導航
                breadcrumb.items = [
                    {"name":"積分轉移記錄","active":true},
                ];
                integralType.query().$promise.then(function(integralTypes){
                    $scope.integralTypes = integralTypes;
                })
//                $scope.halls = hallName.query({'hall_type':"|1"});
                $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                    return hall.hall_type != 1;
                });
                //查詢變量
                var original;
                var init_condition = {
                    in_agent_code:"",
                    out_agent_code:"",
                    hall_id:"",
                    transfer_date:[''],
                    integral_type_id:""
                };
                original = angular.copy(init_condition);
                $scope.condition = angular.copy(init_condition);
                $scope.pagination = tmsPagination.create();
                $scope.pagination.resource = agentIntegralTransfer;
                var conditions;
                $scope.select = function(page){
                    conditions = angular.copy($scope.condition);
                    conditions.transfer_date[0] = $filter('date')(conditions.transfer_date[0] , 'yyyy-MM-dd');
                    if(conditions.in_agent_code){
                        conditions.in_agent_code = conditions.in_agent_code+"!";
                    }
                    if(conditions.out_agent_code){
                        conditions.out_agent_code = conditions.out_agent_code+"!";
                    }
                    $scope.integral_records =  $scope.pagination.select(page,conditions);
                }
                $scope.select();

                //重置查詢條件
                $scope.reset = function() {
                    $scope.condition = angular.copy(original);
                    $scope.select();
                }

    }]).controller('allowanceRetrieveCtrl',['$scope','agentsLists','integralType','breadcrumb','globalFunction','tmsPagination','agentIntegral','marker','$filter','user',
        function($scope,agentsLists,integralType,breadcrumb,globalFunction,tmsPagination,agentIntegral,marker,$filter,user){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"下月過期津貼","active":true},
            ];
            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });

            integralType.query({status:'1'}).$promise.then(function(integralTypes){
                $scope.integralTypes = integralTypes;
            })
            $scope.expired_integrals =[];

            //過期日期
            marker.markerDate().$promise.then(function(markerDate){
                $scope.markerDates = markerDate;
                $scope.markerDateLabels = [];
                _.each(markerDate,function(dates){
                    $scope.markerDateLabels.push({'text':'DAY'+$filter('date')(dates.date, 'yyyyMM')+"01"})
                });
            });

    //查詢變量
            var original;
            var init_condition = {
                agent_info_id:"",
                card_name:"",
                integral_type_id:"",
                agent_group_name:"",
                sort:"agent_code NUMASC"
            };
            $scope.excel_condition={
                agent_info_id:"",
                card_name:"",
                hall_id:"",
                hall_name:"",
                integral_type_id:"",
                agent_group_name:""

            }
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
//            $scope.excel_condition  = angular.copy(init_condition);

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = agentIntegral;
            $scope.pagination.items_per_page = 15;
            $scope.pagination.query_method = "expiredIntegral";
            var conditions;
            $scope.select = function(page){
                conditions = angular.copy($scope.condition);
//                $scope.excel_condition  = angular.copy($scope.condition);
                $scope.excel_condition.agent_info_id = $scope.condition.agent_info_id;
                $scope.excel_condition.card_name= $scope.condition.card_name;
                $scope.excel_condition.hall_id =  user.hall.id;
                $scope.excel_condition.hall_name = user.hall.hall_name;
                $scope.excel_condition.agent_group_name = $scope.condition.agent_group_name;
                $scope.excel_condition.integral_type_id = $scope.condition.integral_type_id;
//                if(user.hall.hall_type == 1){
//                    $scope.expired_integrals =  $scope.pagination.select(page,{agent_info_id:"no"});
//                }else{
                    $scope.pagination.select(page,conditions).$promise.then(function(expired_integrals){
                        $scope.expired_integrals =expired_integrals;
                        $scope.expiredIntegralLabels =[];
                        $scope.expiredIntegralDates =[];
                        for(var integral_key in expired_integrals[0]){
                            if(!integral_key.indexOf('DAY')){
                                $scope.expiredIntegralLabels.push({'text':integral_key})
                            }
                        }
                        _.each($scope.expiredIntegralLabels,function(expiredIntegralLabel){
                            if(expiredIntegralLabel.text.substr(7,2) >= 10){
                                $scope.expiredIntegralDates.push({date:expiredIntegralLabel.text.substr(3,4)+"年"+expiredIntegralLabel.text.substr(7,2)+"月"});
                            }else{
                                $scope.expiredIntegralDates.push({date:expiredIntegralLabel.text.substr(3,4)+"年"+expiredIntegralLabel.text.substr(8,1)+"月"});
                            }
                        })

                    });

            }
            $scope.select();
            //戶口姓名
            $scope.$watch('agent_code',globalFunction.debounce(function(new_value,old_value){
                $scope.condition.agent_info_id ="";
                $scope.agent_name ="";
                if(new_value){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code:new_value}, {})).$promise.then(function (agents) {
                        if(agents.length > 0){
                            $scope.agent_name = agents[0].agent_name;
                            $scope.condition.agent_info_id = agents[0].id;
                        }
                    });
                }
            }));

            $scope.search = function(){
                $scope.select();
            }

            //重置查詢條件
            $scope.reset = function() {
                $scope.agent_name = "";
                $scope.agent_code="";
                $scope.condition = angular.copy(original);
                $scope.select();
            }
        }]);
}).call(this);
