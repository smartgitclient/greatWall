(function() {
    'use strict';
    angular.module('app.commission-calculate.ctrls', ['app.commission-calculate.services']).controller('differenceRecordCtrl',['$scope','commissionRecordDifference','agentsLists','tmsPagination','globalFunction','pinCodeModal','$filter','$modal','$log','breadcrumb','topAlert',
        function($scope,commissionRecordDifference,agentsLists,tmsPagination,globalFunction,pinCodeModal,$filter,$modal,$log,breadcrumb,topAlert){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"差額單","active":true}
            ];
            //自定義變量
            $scope.defference_url =  globalFunction.getApiUrl('commission/commissionrecorddifference');
            $scope.disabled_update = false;
            var original;
            var init_commission={
                "agent_info_id":"",
                "year_month":"",
                "should_income":0,
                "should_pay":0,
                "remark":"",
                "status":"1",
                "pin_code":""
            }
            original = angular.copy(init_commission);
            $scope.commission_calculate = angular.copy(init_commission);
            //差額單記錄
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = commissionRecordDifference;
            $scope.select = function(page){
                $scope.commissionCalculates = $scope.pagination.select(page);
            }
            $scope.select();
            //新增差額單
            $scope.addDifferenceRecord = function(){
                $scope.form_differenceRecord.clearErrors();
                $scope.disabled_update = false;
                $scope.commission_calculate = angular.copy(original);
                $scope.agent_code ="";
                $scope.agent_name ="";
            }
            //重置
            $scope.reset= function(){
                $scope.form_differenceRecord.$setPristine();
                $scope.form_differenceRecord.clearErrors();
                $scope.commission_calculate = angular.copy(original);
                $scope.agent_code ="";
                $scope.agent_name ="";
            }
            $scope.$watch('agent_code',globalFunction.debounce(function(new_value,old_value){
                if(new_value){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value})).$promise.then(function (agents) {
                        if (new_value != null && agents.length > 0) {
                            $scope.agents = agents;
                            $scope.commission_calculate.agent_info_id = $scope.agents[0].id;
                            $scope.agent_name =  $scope.agents[0].agent_name;
                        }else{
                            $scope.agents =[];
                        }
                    });
                }else{
                    $scope.agents =[];
                }
            }));
            //新增與修改差額單
            $scope.disabled_submit = false;
            $scope.add = function() {
                if($scope.disabled_submit){
                    return $scope.disabled_submit;
                }
                var commission_calculate = angular.copy($scope.commission_calculate);
                commission_calculate.year_month = $filter('date')($scope.commission_calculate.year_month, 'yyyy-MM');
                if ($scope.commission_calculate.id == null) {
                    if ($scope.form_differenceRecord.checkValidity()) {
                        $scope.disabled_submit = true;
                        commissionRecordDifference.save(commission_calculate, function(){
                            topAlert.success("添加成功");
                            $scope.select();
                            $scope.addDifferenceRecord();
                            $scope.disabled_submit = false;
                            $scope.disabled_update = false;
                        },function(){
                            $scope.disabled_submit = false;
                            $scope.disabled_update = false;
                        });
                    }
                }else{
                        if ($scope.form_differenceRecord.checkValidity()) {
                            $scope.disabled_submit = true;
                            commissionRecordDifference.update(commission_calculate, function () {
                                topAlert.success("修改成功");
                                $scope.select();
                                $scope.addDifferenceRecord();
                                $scope.disabled_submit = false;
                                $scope.disabled_update = false;
                            },function(){
                                $scope.disabled_submit = false;
                                $scope.disabled_update = true;
                            });
                        }
                    }
            }
            //查修
            $scope.update = function(id){
                commissionRecordDifference.query({id:id}).$promise.then(function(commissionRecordDifference){
                    $scope.commission_calculate = commissionRecordDifference[0];
                    agentsLists.query(globalFunction.generateUrlParams({id:  $scope.commission_calculate.agent_info_id}, {id: '',agent_code:'',agent_name: ''})).$promise.then(function (agents) {
                           $scope.agents = agents;
                            $scope.agent_code = $scope.agents[0].agent_code;
                            $scope.agent_name =  $scope.agents[0].agent_name;
                    })
                    $scope.disabled_update = true;
                });
            }
            //刪除
            $scope.delete = function(id){
                pinCodeModal(commissionRecordDifference,'delete',{id:id},'刪除成功！').then(function(){
                    $scope.select();
                })

            }
            var init_conditions;
            $scope.condition = {
                agentInfo:{agent_code:''},
                agentMaster:{agent_contact_name: ''},
                year_month: ['']
            };
            init_conditions = angular.copy($scope.condition);
            $scope.search = function(){
                var conditions = angular.copy($scope.condition);
                conditions.agentInfo.agent_code = $scope.condition.agentInfo.agent_code+"!";
                conditions.agentMaster.agent_contact_name = $scope.condition.agentMaster.agent_contact_name+"!";
                conditions.year_month[0] = $filter('date')($scope.condition.year_month[0], 'yyyy-MM');
                $scope.commissionCalculates = $scope.pagination.select(1,conditions);

            }
            $scope.reset_condition = function(){
                $scope.condition = angular.copy(init_conditions);
                $scope.select();
            }

            //詳細 支付頁面
            $scope.detail = function(commissionCalculate){
                var modalInstances;
                modalInstances = $modal.open({
                    templateUrl: "views/commission-calculate/difference-record-detail.html",
                    controller: 'differenceRecordDetailCtrl',
                    resolve: {
                        commissionCalculate: function() {
                            return commissionCalculate;
                        }
                    }
                });

                modalInstances.result.then((function(status) {
                    if(status){
                        $scope.select();
                    }
                }), function() {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }

    }]).controller('differenceRecordDetailCtrl',['$scope','commissionRecordDifference','globalFunction','commissionCalculate','topAlert','$modalInstance',
        function($scope,commissionRecordDifference,globalFunction,commissionCalculate,topAlert,$modalInstance){
            //自定義變量
            $scope.defference_update_url =  globalFunction.getApiUrl('commission/commissionrecorddifference');
            $scope.commission_calculates = angular.copy(commissionCalculate);
            $scope.commission_calculates.pin_code = "";
            $scope.payment = function(){
                if ($scope.form_differenceRecordUpdate.checkValidity()) {
                    $scope.disabled_submit = true;
                    $scope.commission_calculates_copy = angular.copy($scope.commission_calculates);
                    $scope.commission_calculates_copy.should_income = Number($scope.commission_calculates_copy.should_income );
                    $scope.commission_calculates_copy.should_pay = Number($scope.commission_calculates_copy.should_pay );
                    $scope.commission_calculates_copy.status = 0;
                    commissionRecordDifference.update($scope.commission_calculates_copy, function () {
                        $scope.commission_calculates.pin_code = "";
                        topAlert.success("支付成功");
                        $modalInstance.close(true);
                        $scope.disabled_submit = false;
                    },function(){
                        $scope.disabled_submit = false;
                    });
                }
            }

    }]).controller('commissionPreReleaseManagerCtrls',['$scope','commissionRecord','commissionMonth','tmsPagination','$location','$modal','$filter','breadcrumb','CommissionMonthStatus','pinCodeModal','goBackData',
        function($scope,commissionRecord,commissionMonth,tmsPagination,$location,$modal,$filter,breadcrumb,CommissionMonthStatus,pinCodeModal,goBackData){
        $scope.commission_month_status = CommissionMonthStatus;
        //麵包屑導航
        breadcrumb.items = [
            {"name":"預出佣管理","active":true}
        ];

        //查詢
        var original;
        var init_condition = {
            year_month:['',''],
            sort:'year_month desc'
        }
        original = angular.copy(init_condition);
        $scope.condition = angular.copy(init_condition);

        //初始化數據
        $scope.pagination = tmsPagination.create();
        $scope.pagination.resource = commissionMonth;
        $scope.select = function(page){
            $scope.condition.year_month[0] = $scope.condition.year_month[0] ? $filter('date')($scope.condition.year_month[0], 'yyyy-MM') : "";
            $scope.condition.year_month[1] = $scope.condition.year_month[0] ? $filter('date')($scope.condition.year_month[1], 'yyyy-MM') : "";
            $scope.preReleaseManagers = $scope.pagination.select(page, $scope.condition);
        }
        $scope.select();

//       $scope.condition = goBackData.get('condition',$scope.condition);
        /*$scope.search = function(page){
//            goBackData.set('condition',$scope.condition);
            $scope.condition.year_month[0] = $filter('date')($scope.condition.year_month[0], 'yyyy-MM');
            $scope.condition.year_month[1] = $filter('date')($scope.condition.year_month[1], 'yyyy-MM');
            $scope.preReleaseManagers = $scope.pagination.select(1, $scope.condition/*,{Commission_Record_Sub:{}});
        }*/
        //重置
        $scope.reset = function(){
           $scope.condition = angular.copy(original);
            $scope.select();
        }
        $scope.detail = function(id){
            $location.path('/commission-calculate/commission-pre-release-record/'+id);
        }

        $scope.is_calculate = false;
        //計佣
        $scope.calculate = function(){
            var modal_instance;
            modal_instance = $modal.open({
                "templateUrl":"views/commission-calculate/monthly-statement-setting.html",
                "controller":"monthlyStatementSettingCtrl"
            })
            modal_instance.result.then(function(result){
                $scope.select();
            })
        }
        //月結
        $scope.confirmMonthly = function(id){
            pinCodeModal(commissionRecord, 'confirmMonthly', {commission_month_id: id}, '月結成功！',true).then(function () {
                $scope.select();
            });
        }

        //重新計算
        $scope.resetCalculate = function(id,year_month){
            pinCodeModal(commissionRecord, 'resetCalculate',{commission_month_id: id, year_month: year_month}, '後台重新計算中，請稍等...').then(function () {
                $scope.select();
            });
        }

        //刪除預出佣記錄
        $scope.delete=function(id){
            pinCodeModal(commissionRecord, 'deleteCommission', {commission_month_id: id}, '刪除成功！').then(function () {
                $scope.select();
            });
        }

    }]).controller('monthlyStatementSettingCtrl',['$scope','globalFunction','$modalInstance','hallName','commissionRecord','getDate','validateForms','currentShift',
        function($scope,globalFunction,$modalInstance,hallName,commissionRecord,getDate,validateForms,currentShift){

            var currentDate = currentShift.data.year_month.split('-');

            $scope.months = ['01','02','03','04','05','06','07','08','09','10','11','12'];

            $scope.calculate_data = {
                pin_code:'',
                year:parseInt(currentDate[0]),
                month:currentDate[1]
            };

            $scope.monthlyStatements = [];
            $scope.years = [];
            $scope.now_data = new Date().getFullYear();
            for(var i= 0;i< 5;i++){
                $scope.years[i] =parseInt($scope.now_data)-i;
            }
            hallName.query().$promise.then(function(halls){
                $scope.halls = halls;
                for(var i=0;i<  halls.length;i++) {
                    $scope.monthlyStatements.push({hall_id: halls[i].id, date: ""});
                }
            });
            $scope.form_monthly_url = globalFunction.getApiUrl('commission/commissionrecord/calculate-commission');

            $scope.disabled_submit = false;
            $scope.add = function(){
                if($scope.disabled_submit){
                    return $scope.disabled_submit;
                }
                $scope.form_monthly.checkValidity().then(function(){
                    $scope.disabled_submit = true;
                    commissionRecord.calculateCommission($scope.calculate_data,function(){
                        $modalInstance.close($scope.monthlyStatements);
                        $scope.disabled_submit = false;
                    },function(){
                        $scope.disabled_submit = false;
                    });
                })
            };
            $scope.cancel = function(){
                $modalInstance.close();
            }
    }]).controller('commissionPreReleaseRecordCtrls',['$scope','commissionRecord','commissionRecordSub','hallName','tmsPagination','globalFunction','$stateParams','$location','$filter','$log','breadcrumb','commissionRecordStatus','currentShift','$modal','goBackData','getDay','getMonths','qzPrinter','topAlert','user','commissionMonth',
        function($scope,commissionRecord,commissionRecordSub,hallName,tmsPagination,globalFunction,$stateParams,$location,$filter,$log,breadcrumb,commissionRecordStatus,currentShift,$modal,goBackData,getDay,getMonths,qzPrinter,topAlert,user,commissionMonth){
            $scope.commission_record_status = commissionRecordStatus;
            breadcrumb.items = [
                {"name":"預出佣管理","url":'commission-calculate/commission-pre-release-manager'},
                {"name":"預出佣單記錄","active":true}
            ];
            $scope.year_month='';
            $scope.status = [{status:'',name:'全部'},{status:'1',name:'已出'},{status:'2',name:'未出'}];
            $scope.commissionPreReleaseRecords = [];
            //搜索
            $scope.hall_types = true;
            var original;
            var init_condition= {
                agentInfo:{agent_code:""},
                agentMaster:{agent_contact_name:""},
                year_month:[""],
                commissionRecord:{year_month:[""]},
                status:"",
                hall_id:"",
                sort:"agentInfo.agent_code NUMASC"

            }
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.excel_condition = angular.copy(init_condition);
            $scope.condition = goBackData.get('condition',$scope.condition);
            $scope.halls = JSON.parse(sessionStorage.getItem("halls"));

            /*0493728BB89506C6E0539715A8C0267D*/

            $scope.isChuYong = true;
            $scope.newHall = [];
            //集团隐藏状态搜索
            $scope.chkIsTing = function(){
                if($scope.condition.hall_id != "0493728BB89506C6E0539715A8C0267D"){
                    $scope.isChuYong = false;
                    $scope.condition.status = "";
                }else{
                    $scope.isChuYong = true;
                    $scope.condition.status = "";
                }
            };

            $scope.$watch('user.hall.id',function(value){
                $scope.newHall = [];
                    _.each($scope.halls, function (hall) {
                        if (hall.hall_name == "集團"){
                            $scope.newHall.unshift(hall)
                        }else{
                            $scope.newHall.push(hall);
                            $scope.condition.hall_id = "0493728BB89506C6E0539715A8C0267D";
                        }
                    });


                init();
            });


            _.each($scope.halls,function(hall){
                if(hall.hall_type == '1'){
                    $scope.condition.hall_id = hall.id;
                }
            });
            //初始化列表數據
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = commissionRecord;

            $scope.select = function(page){
                goBackData.set('condition',$scope.condition);
                var conditions = angular.copy($scope.condition);

                if($scope.year_month[0] != ''){
                    conditions.year_month[0] =getDay($scope.year_month);
                }else{
                    conditions.year_month[0] = $filter('date')(conditions.year_month[0], 'yyyy-MM');
                }
                $scope.excel_condition = angular.copy(conditions);
                $scope.excel_condition.year_month[0] =getMonths($filter('date')($scope.year_month, 'yyyy-MM'));
                if($scope.hall_types){
                    if($scope.year_month[0] != ''){
                        conditions.year_month[0] = getDay($scope.year_month);
                    }else{
                        conditions.year_month[0] = $filter('date')(conditions.year_month[0], 'yyyy-MM');
                    }
                    conditions.hall_id = '';
                    $scope.pagination.resource = commissionRecord;
                    $scope.commissionPreReleaseRecords =  $scope.pagination.select(page,conditions);
                }else{
                    if($scope.year_month[0] != ''){
                        conditions.commissionRecord.year_month[0] = getDay($scope.year_month);
                    }else{
                        conditions.commissionRecord.year_month[0] = $filter('date')(conditions.year_month[0], 'yyyy-MM');
                    }
                    conditions.year_month[0] = "";
                    $scope.pagination.resource = commissionRecordSub;
                    $scope.commissionPreReleaseRecords =  $scope.pagination.select(page,conditions,{commissionRecord:{}});
                }
            }
            $scope.search = function(){
                $scope.hall_types = false;
                goBackData.set('condition',$scope.condition);
                var conditions = angular.copy($scope.condition);
                if($scope.condition.agent_code){
                    conditions.agentInfo.agent_code =$scope.condition.agentInfo.agent_code+"!";
                }
                if($scope.condition.agentMaster.agent_contact_name){
                    conditions.agentMaster.agent_contact_name = $scope.condition.agentMaster.agent_contact_name+"!";
                }
                _.each($scope.halls,function(hall){
                    if( $scope.condition.hall_id == hall.id && hall.hall_type == '1'){
                        $scope.hall_types = true;
                    }
                });

                $scope.excel_condition = angular.copy(conditions);
                $scope.excel_condition.year_month[0] =getMonths($filter('date')($scope.year_month, 'yyyy-MM'));
                if($scope.hall_types){
                    if($scope.year_month[0] != ''){
                        conditions.year_month[0] = getDay($scope.year_month);
                    }else{
                        conditions.year_month[0] = $filter('date')(conditions.year_month[0], 'yyyy-MM');
                    }
                    conditions.hall_id = '';
                    $scope.pagination.resource = commissionRecord;
                    $scope.commissionPreReleaseRecords =  $scope.pagination.select(1,conditions);
                }else{
                    if($scope.year_month[0] != ''){
                        conditions.commissionRecord.year_month[0] = getDay($scope.year_month);
                    }else{
                        conditions.commissionRecord.year_month[0] = $filter('date')(conditions.year_month[0], 'yyyy-MM');
                    }
                    conditions.year_month[0] = "";
//                $scope.excel_condition.year_month[0] ="";
//                $scope.excel_condition.commissionRecord.year_month[0] =getMonths($filter('date')($scope.year_month, 'yyyy-MM'));
                    $scope.pagination.resource = commissionRecordSub;
                    $scope.pagination.select(1,conditions,{commissionRecord:{}}).$promise.then(function (commissionPreReleaseRecords) {
                        $scope.commissionPreReleaseRecords = commissionPreReleaseRecords;
                        if ($scope.year_month == '' && $scope.commissionPreReleaseRecords.length > 0) {
                            $scope.year_month = commissionPreReleaseRecords[0].year_month;
                        }
                    });
                }
            }

            var init = function(){
                if($stateParams.id){

                    /*var pagination = tmsPagination.create();
                     pagination.resource = commissionMonth;*/

                    /*$scope.pagination..select(1, {id:$stateParams.id},{Commission_Record_Sub:{}}).$promise.then(function(data){
                     $scope.year_month = data[0].year_month;*/

                    //if(user.hall.id != "1AE7283167B57D1DE050A8C098155859"){
                        $scope.pagination.select(1, {
                            commission_month_id: $stateParams.id,
                            sort: "agentInfo.agent_code NUMASC"
                        }).$promise.then(function (commissionPreReleaseRecords) {
                                $scope.commissionPreReleaseRecords = commissionPreReleaseRecords;
                                if ($scope.year_month == '' && $scope.commissionPreReleaseRecords.length > 0) {
                                    $scope.year_month = commissionPreReleaseRecords[0].year_month;
                                }
                                var conditions = angular.copy($scope.condition);
                                if ($scope.year_month[0] != '') {
                                    conditions.year_month[0] = getDay($scope.year_month);
                                } else {
                                    conditions.year_month[0] = $filter('date')(new Date(conditions.year_month[0]), 'yyyy-MM');
                                }

                                $scope.excel_condition = angular.copy(conditions);
                                $scope.excel_condition.year_month[0] = getMonths($scope.year_month);
                                $scope.excel_condition.year_month[0] = $filter('date')(new Date(conditions.year_month[0]), 'yyyy-MM');
                            });
                    }else{
                        $scope.search();
                        $scope.isChuYong = false;
                    }
                    //});
                //}else{
                //    $scope.year_month ='';
                //    $scope.select();
                //}
            }


            $scope.reset = function(){
                $scope.condition = angular.copy(original);
                _.each($scope.halls,function(hall){
                    if(hall.hall_type == '1'){
                        $scope.condition.hall_id = hall.id;
                    }
                })
                $scope.pagination.resource = commissionRecord;
                $scope.select();
            }
            //佣金詳細
            $scope.commissionShowDeatail = function(id,index){
                var modal_instance;
                modal_instance = $modal.open({
                    templateUrl: "views/commission-calculate/commission-show.html",
                    controller: "commissionShowCtrl",
                    resolve: {
                        id:function(){
                            return id;
                        },
                        index:function(){
                            return index;
                        },
                        hall_types:function(){
                            return $scope.hall_types;
                        }
                    }
                });
            }

            //下線津貼詳細
            $scope.underling_commissionDeatail = function(status,underling,agent_info_id,year_month,hall_id){
                $modal.open({
                    templateUrl: "views/commission-calculate/underling-commission-detail.html",
                    controller: "underlingCommissionDetailCtrl",
                    resolve: {
                        show_type:function(){
                            return "pre";
                        },
                        status:function(){
                            return status;
                        },
                        underling:function(){
                            return underling;
                        },
                        agent_info_id:function(){
                            return agent_info_id;
                        },
                        year_month:function(){
                            return year_month;
                        },
                        hall_id:function(){
                            return hall_id;
                        },
                        condition:function(){
                            return $scope.condition;
                        }
                    }
                });
            }

            //出佣單詳細
            $scope.detail = function(id){
                $location.path('/commission-calculate/commission-pre-release-record-detail/'+id);
            }
            //預出佣詳細扣費修改
            $scope.update = function(id){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/commission-calculate/commission-pre-release-record-update.html",
                    controller: 'commissionPreReleaseRecordUpdateCtrl',
                    resolve: {
                        id: function() {
                            return id;
                        }
                    }
                });
                modalInstance.result.then((function(status) {
                    if(status){
                        $scope.search();
                    }
                }), function() {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }
            //本月津貼總額
            $scope.thismonth_allowance_total = function(allowance){
                return parseFloat(allowance.thismonth_allowance)+parseFloat(allowance.underling_allowance);
            };
            //尾数计算
            $scope.actual_commission = function(commissionRecord){
                return parseFloat(commissionRecord.should_commission)-(parseFloat(commissionRecord.expired_fee)+parseFloat(commissionRecord.negative_consumption)+parseFloat(commissionRecord.miscellaneous_cash));
            };

            //出佣列印
            $scope.isDesabled = false;

            $scope.print_r = function(commission_record_id){
                if($scope.isDesabled){return false;}
                $scope.isDesabled = true;
                qzPrinter.print('PDFPreOutCommissionRecord',"", {commission_record_id:commission_record_id},true).then(function(){
                    topAlert.success('预出佣列印成功');
                    $scope.isDesabled = false;
                },function(){
                    $scope.isDesabled = false;
                });
            };

            //逾期回收详情
            $scope.allowance_retrieve = function(commissionRecord){

                var modal_instance;
                modal_instance = $modal.open({
                    templateUrl: "views/commission-calculate/allowance_retrieveDetail.html",
                    controller:"allowanceRetrieveDetailCtrl",
                    resolve: {
                        hall_id:function(){
//                            return commissionRecord.hall_id;
                            return $scope.hall_types ? "":commissionRecord.hall_id;
                        },
                        agent_info_id:function(){
                            return commissionRecord.agent_info_id;
                        },
                        commission_month_id:function(){
                            return $scope.hall_types ? commissionRecord.commission_month_id:commissionRecord.commissionRecord.commission_month_id;
                        }
                    }
                })
            };


        }]).controller('allowanceRetrieveDetailCtrl',['$scope','globalFunction','topAlert','$modalInstance','commissionRecord','qzPrinter','agent_info_id','commission_month_id','hall_id','user',
        function($scope,globalFunction,topAlert,$modalInstance,commissionRecord,qzPrinter,agent_info_id,commission_month_id,hall_id,user){

            $scope.user = user;

            $scope.isDesabled = false;

            //過期津貼回收
            var condition = {
                hall_id:hall_id ? hall_id : "",
                recycle_agent_id:agent_info_id,
                commission_month_id:commission_month_id ? commission_month_id: "",
                sort:'outAgentInfo.agent_code NUMASC'
            };

            $scope.allowanceRetrieveRecords = commissionRecord.allowanceRetrieveRecord(condition);


            var paras = {
                hall_id:hall_id ? hall_id : "",
                agent_info_id:agent_info_id,
                commission_month_id:commission_month_id ? commission_month_id: ""
            };

            $scope.excel_paras = paras;

            $scope.print_r = function(){
                if($scope.isDesabled){return false;}
                $scope.isDesabled = true;
                qzPrinter.print('PDFOverdueAllowanceRecovery',"", paras).then(function(){
                    topAlert.success('逾期回收列印成功');
                    $scope.isDesabled = false;
                },function(){
                    $scope.isDesabled = false;
                });
            };

            $scope.closed = function(){
                $modalInstance.dismiss();
            }

    }]).controller('commissionPreReleaseRecordUpdateCtrl',['$scope','commissionRecord','id','globalFunction','$modalInstance','topAlert',
        function($scope,commissionRecord,id,globalFunction,$modalInstance,topAlert){

            $scope.pre_release_record_url = globalFunction.getApiUrl('commission/commissionrecord');
            $scope.commission_record = {
                id:id,
                over_comsumption:"",
                miscellaneous_cash:"",
                pin_code:""
            }
            if(id){
                commissionRecord.get({id:id}).$promise.then(function(commission_record){
                    $scope.commission_record.over_comsumption =  parseFloat(commission_record.over_comsumption)*10000;
                    $scope.commission_record.miscellaneous_cash =  parseFloat(commission_record.miscellaneous_cash)*10000;
                })
            }
            $scope.add = function(){
                $scope.commission_record_copy = angular.copy($scope.commission_record);
                $scope.commission_record_copy.over_comsumption = $scope.commission_record_copy.over_comsumption/10000;
                $scope.commission_record_copy.miscellaneous_cash = $scope.commission_record_copy.miscellaneous_cash/10000;
                if($scope.form_pre_release_record.checkValidity()) {
                    $scope.disabled_submit=true;
                    commissionRecord.update($scope.commission_record_copy,function(){
                        topAlert.success("设定其他消費成功!");
                        $modalInstance.close(true);
                        $scope.disabled_submit = false;
                    },function(){
                        $scope.disabled_submit = false;
                    });
                }
            }

            $scope.cancel = function(){
                $modalInstance.close('');
            }
    }]).controller('commissionPreReleaseRecordDetailCtrls',['$scope','commissionRecord','commissionRecordDifference','globalFunction','$stateParams','$location','breadcrumb','preCommissionRecordStatus','$modal','topAlert',
        function($scope,commissionRecord,commissionRecordDifference,globalFunction,$stateParams,$location,breadcrumb,preCommissionRecordStatus,$modal,topAlert){

        $scope.sub_post = "PUT";
        $scope.pre_release_record_url = globalFunction.getApiUrl('commission/commissionrecord');
        $scope.commission_pre_release_record ={
                "id": "",
                "year_month": "",
                "expired_fee": "",
                "isdeduction_expired_fee": "",
                "over_comsumption": "",
                "isdeduction_over_comsumption": "",
                "miscellaneous_cash": "",
                "isdeduction_miscellaneous_cash": "",
                "commission": "",
                "actual_commission": "",
                "remark": null,
                "cash_rolling": "",
                "cash_rolling_commission": "",
                "loan_rolling": "",
                "loan_rolling_commission": "",
                "iou_rolling": "",
                "iou_rolling_commission": "",
                "underling_rolling": "",
                "underling_commission": "",
                "commission_total": "",
                "rolling_total": "",
                "thismonth_allowance": "",
                "underling_allowance": "",
                "lastmonth_allowance": "",
                "allowance_retrieve": "",
                "thismonth_consumption": "",
                "allowance_balance": "",
                "should_pay_total": "",
                "other_profit": null,
                "underling_fee": null,
                "mortgage_divided": null,
                "pin_code":"",
                "commissionRecordSubs": [
                {
                    "id": "",
                    "commission_record_id": "",
                    "cash_rolling": "",
                    "cash_rolling_commission": "",
                    "loan_rolling": "",
                    "loan_rolling_commission": "",
                    "iou_rolling": "",
                    "iou_rolling_commission": "7",
                    "underling_rolling": "",
                    "underling_commission": "",
                    "roll_commission": "",
                    "rolling_total": "",
                    "tax_rate": null
                }
            ],
                "allowances": [
                {
                    "id": "",
                    "thismonth_allowance": "",
                    "underling_allowance": "",
                    "lastmonth_allowance": "",
                    "allowance_retrieve": "",
                    "thismonth_consumption": "",
                    "allowance_balance": "",
                    "validity_month": null,
                    "recycle_rate": null,
                    "thismonth_balance": null
                }
            ]
            }
            $scope.commission_pre_release_record_copy = angular.copy($scope.commission_pre_release_record);
            //model
            $scope.commission_record = {
                id:"",
                expired_fee:"",
                over_comsumption:"",
                miscellaneous_cash:"",
                remark:"",
                pin_code:""
            }
        //初始化列表數據
        $scope.query = function(){
            $scope.disable1 = true;
            if($stateParams.id){
                commissionRecord.get(globalFunction.generateUrlParams({id:$stateParams.id},{commissionRecordSubs:{cashDivides:"",markerDivides:"",iouDivides:"",stockDivides:""},allowances:{}}),function(commission_record){
                    $scope.commission_pre_release_record = commission_record;
                    $scope.commission_record.id = $scope.commission_pre_release_record.id;
                    $scope.commission_record.expired_fee = $scope.commission_pre_release_record.expired_fee;
                    $scope.commission_record.over_comsumption = $scope.commission_pre_release_record.over_comsumption;
                    $scope.commission_record.miscellaneous_cash = $scope.commission_pre_release_record.miscellaneous_cash;
                    $scope.commission_record.remark = $scope.commission_pre_release_record.remark;
//                    for(var commissionRecordSub in $scope.commission_pre_release_record.commissionRecordSubs){
//                        $scope.commissionRecordSub[immediates] = $scope.commission_pre_release_record.commissionRecordSubs[commissionRecordSub];
//                    }
                    if(commission_record.status != preCommissionRecordStatus.settlement)
                        $scope.disable1 = false;
                    $scope.show();
                    //麵包屑導航
                    breadcrumb.items = [
                        {"name":"預出佣管理","url":'commission-calculate/commission-pre-release-manager'},
                        {"name":"預出佣單記錄","url":'commission-calculate/commission-pre-release-record/'+$scope.commission_pre_release_record.commission_month_id},
                        {"name":"預出佣單詳細","active":true}
                    ];
                    //$scope.commissionCalculates = commissionRecordDifference.query(globalFunction.generateUrlParams({agent_info_id: $scope.commission_pre_release_record.agent_info_id},{year_month:'',should_income:'',should_pay:'',remark:''}));
                });
            }
        }
        $scope.show=function(){
//            angular.forEach($scope.commission_pre_release_record.commissionRecordSubs,function(commissionRecordSubs){
//                commissionRecordSubs.cash_rolling_commission = parseInt((commissionRecordSubs.cash_rolling_commission*10000).toFixed(2));
//                commissionRecordSubs.loan_rolling_commission = parseInt((commissionRecordSubs.loan_rolling_commission*10000).toFixed(2));
//                commissionRecordSubs.iou_rolling_commission = parseInt((commissionRecordSubs.iou_rolling_commission*10000).toFixed(2));
//                commissionRecordSubs.underling_commission = parseInt((commissionRecordSubs.underling_commission*10000).toFixed(2));
//                commissionRecordSubs.rolling_total = parseInt((commissionRecordSubs.rolling_total*10000).toFixed(2));
//            });
//            angular.forEach($scope.commission_pre_release_record.allowances,function(allowances){
//                allowances.thismonth_allowance = parseInt((allowances.thismonth_allowance*10000).toFixed(2));
//                allowances.underling_allowance = parseInt((allowances.underling_allowance*10000).toFixed(2));
//                allowances.lastmonth_allowance = parseInt((allowances.lastmonth_allowance*10000).toFixed(2));
//                allowances.allowance_retrieve = parseInt((allowances.allowance_retrieve*10000).toFixed(2));
//                allowances.thismonth_consumption = parseInt((allowances.thismonth_consumption*10000).toFixed(2));
//            });
//            $scope.commission_pre_release_record.expired_fee = parseInt(($scope.commission_pre_release_record.expired_fee*10000).toFixed(2));
//            $scope.commission_pre_release_record.over_comsumption =  parseInt(($scope.commission_pre_release_record.over_comsumption *10000).toFixed(2));
//            $scope.commission_pre_release_record.miscellaneous_cash = parseInt(($scope.commission_pre_release_record.miscellaneous_cash*10000).toFixed(2));
//            $scope.commission_pre_release_record.underling_fee =parseInt(($scope.commission_pre_release_record.underling_fee *10000).toFixed(2));
//            $scope.commission_pre_release_record.mortgage_divided =  parseInt(($scope.commission_pre_release_record.mortgage_divided *10000).toFixed(2));
//
//            $scope.commission_pre_release_record.cash_rolling_commission =  parseInt(($scope.cash_rolling_commission()*10000).toFixed(2));
//            $scope.commission_pre_release_record.loan_rolling_commission =  parseInt(($scope.loan_rolling_commission()*10000).toFixed(2));
//            $scope.commission_pre_release_record.iou_rolling_commission =  parseInt(($scope.iou_rolling_commission()*10000).toFixed(2));
//            $scope.commission_pre_release_record.underling_commission =  parseInt(($scope.underling_commission()*10000).toFixed(2));
//            $scope.commission_pre_release_record.rolling_total =  parseInt(($scope.commission_total_all()*10000).toFixed(2));
        }

        $scope.query();
        $scope.add = function(){
            $scope.commission_record_copy = angular.copy($scope.commission_record);
            if($scope.form_pre_release_record.checkValidity()) {
                $scope.disabled_submit=true;
//                angular.forEach($scope.commission_pre_release_record_copy.commissionRecordSubs,function(commissionRecordSubs){
//                    commissionRecordSubs.cash_rolling_commission = commissionRecordSubs.cash_rolling_commission/10000;
//                    commissionRecordSubs.loan_rolling_commission = commissionRecordSubs.loan_rolling_commission/10000;
//                    commissionRecordSubs.iou_rolling_commission = commissionRecordSubs.iou_rolling_commission/10000;
//                    commissionRecordSubs.underling_commission = commissionRecordSubs.underling_commission/10000;
//                    commissionRecordSubs.rolling_total = commissionRecordSubs.rolling_total/10000;
//                    commissionRecordSubs.roll_commission = commissionRecordSubs.roll_commission/10000;
//
//                });
//                angular.forEach($scope.commission_pre_release_record_copy.allowances,function(allowances){
//                    allowances.thismonth_allowance = allowances.thismonth_allowance/10000;
//                    allowances.underling_allowance = allowances.underling_allowance/10000;
//                    allowances.lastmonth_allowance = allowances.lastmonth_allowance/10000;
//                    allowances.allowance_retrieve = allowances.allowance_retrieve/10000;
//                    allowances.thismonth_consumption = allowances.thismonth_consumption/10000;
//                });
//                $scope.commission_pre_release_record_copy.expired_fee = $scope.commission_pre_release_record_copy.expired_fee/10000;
//                $scope.commission_pre_release_record_copy.over_comsumption =  $scope.commission_pre_release_record_copy.over_comsumption /10000;
//                $scope.commission_pre_release_record_copy.miscellaneous_cash = $scope.commission_pre_release_record_copy.miscellaneous_cash/10000;
//                $scope.commission_pre_release_record_copy.underling_fee =$scope.commission_pre_release_record_copy.underling_fee /10000;
//                $scope.commission_pre_release_record_copy.mortgage_divided =  $scope.commission_pre_release_record_copy.mortgage_divided /10000;
//                $scope.commission_pre_release_record_copy.should_pay_total=$scope.commission_pre_release_record_copy.commission_record = $scope.should_commission()/10000;
//                $scope.commission_pre_release_record_copy.commission_total = $scope.commission_pre_release_record_copy.commission_total/10000;
//
//                $scope.commission_pre_release_record_copy.cash_rolling_commission =  $scope.cash_rolling_commission()/10000;
//                $scope.commission_pre_release_record_copy.loan_rolling_commission =  $scope.loan_rolling_commission()/10000;
//                $scope.commission_pre_release_record_copy.iou_rolling_commission =  $scope.iou_rolling_commission()/10000;
//                $scope.commission_pre_release_record_copy.underling_commission =  $scope.underling_commission()/10000;
//                $scope.commission_pre_release_record_copy.rolling_total =  $scope.commission_total_all()/10000;
//                $scope.commission_pre_release_record_copy.actual_commission =  $scope.commission_pre_release_record_copy.actual_commission/10000;


                commissionRecord.update($scope.commission_record_copy,function(){
                    topAlert.success("修改成功");
                    $location.path('/commission-calculate/commission-pre-release-record/'+$scope.commission_pre_release_record.commission_month_id);
                    $scope.disabled_submit = false;
                },function(){
                    $scope.disabled_submit = false;
                });
            }
        }

        $scope.return = function(){
            $location.path('/commission-calculate/commission-pre-release-record/'+$scope.commission_pre_release_record.commission_month_id);
        }
        //佣金詳細
        $scope.commissionDeatail = function(commissions){
            var modal_instance;
            modal_instance = $modal.open({
                "templateUrl":"views/commission-calculate/commission-detail.html",
                "controller":"commissionDetailCtrl",
                resolve: {
                    commissions:function(){
                        return commissions;
                    }
                }
            });
        }

        //下線津貼詳細
        $scope.underling_commissionDeatail = function(status,agent_info_id,year_month,hall_id){
            $modal.open({
                templateUrl: "views/commission-calculate/underling-commission-detail.html",
                controller: "underlingCommissionDetailCtrl",
                resolve: {
                    show_type:function(){
                        return 'pre';
                    },
                    status:function(){
                        return status;
                    },
                    agent_info_id:function(){
                        return agent_info_id;
                    },
                    year_month:function(){
                        return year_month;
                    },
                    hall_id:function(){
                        return hall_id;
                    }
                }
            });
        }

        $scope.cash_rolling = function(){
            $scope.cash_rolling_total = 0;
            for(var i= 0;i <$scope.commission_pre_release_record.commissionRecordSubs.length;i++){
                $scope.cash_rolling_total += parseInt($scope.commission_pre_release_record.commissionRecordSubs[i].cash_rolling);
            }
            $scope.commission_pre_release_record.cash_rolling = parseInt($scope.cash_rolling_total);
            return parseInt($scope.cash_rolling_total);
        }

        $scope.cash_rolling_commission = function(){
            $scope.cash_rolling_commission1_total = 0;
            for(var i= 0;i <$scope.commission_pre_release_record.commissionRecordSubs.length;i++){
                $scope.cash_rolling_commission1_total += parseInt($scope.commission_pre_release_record.commissionRecordSubs[i].cash_rolling_commission);
            }
            $scope.commission_pre_release_record.cash_rolling_commission = parseInt($scope.cash_rolling_commission1_total);
            return parseInt($scope.cash_rolling_commission1_total);
        }
        $scope.loan_rolling = function(){
            $scope.loan_rolling_total = 0;
            for(var i= 0;i <$scope.commission_pre_release_record.commissionRecordSubs.length;i++){
                $scope.loan_rolling_total += parseInt($scope.commission_pre_release_record.commissionRecordSubs[i].loan_rolling);
            }
            $scope.commission_pre_release_record.loan_rolling = parseInt($scope.loan_rolling_total);
            return parseInt($scope.loan_rolling_total);
        }

        $scope.loan_rolling_commission = function(){
            $scope.loan_rolling_commission_total = 0;
            for(var i= 0;i <$scope.commission_pre_release_record.commissionRecordSubs.length;i++){
                $scope.loan_rolling_commission_total += parseInt($scope.commission_pre_release_record.commissionRecordSubs[i].loan_rolling_commission);
            }
            $scope.commission_pre_release_record.loan_rolling_commission = parseInt($scope.loan_rolling_commission_total);
            return parseInt($scope.loan_rolling_commission_total);
        }
        $scope.iou_rolling = function(){
            $scope.iou_rolling_total = 0;
            for(var i= 0;i <$scope.commission_pre_release_record.commissionRecordSubs.length;i++){
                $scope.iou_rolling_total += parseInt($scope.commission_pre_release_record.commissionRecordSubs[i].iou_rolling);
            }
            $scope.commission_pre_release_record.iou_rolling = parseInt($scope.iou_rolling_total)
            return parseInt($scope.iou_rolling_total);
        }

        $scope.iou_rolling_commission = function(){
            $scope.iou_rolling_commission_total = 0;
            for(var i= 0;i <$scope.commission_pre_release_record.commissionRecordSubs.length;i++){
                $scope.iou_rolling_commission_total += parseInt($scope.commission_pre_release_record.commissionRecordSubs[i].iou_rolling_commission);
            }
            $scope.commission_pre_release_record.iou_rolling_commission = parseInt($scope.iou_rolling_commission_total);
            return parseInt($scope.iou_rolling_commission_total);
        }
        $scope.underling_rolling = function(){
            $scope.underling_rolling_total = 0;
            for(var i= 0;i <$scope.commission_pre_release_record.commissionRecordSubs.length;i++){
                $scope.underling_rolling_total += parseInt($scope.commission_pre_release_record.commissionRecordSubs[i].underling_rolling);
            }
            $scope.commission_pre_release_record.underling_rolling = parseInt($scope.underling_rolling_total);
            return parseInt($scope.underling_rolling_total);
        }

        $scope.underling_commission = function(){
            $scope.underling_commission_total = 0;
            for(var i= 0;i <$scope.commission_pre_release_record.commissionRecordSubs.length;i++){
                $scope.underling_commission_total += parseInt($scope.commission_pre_release_record.commissionRecordSubs[i].underling_commission);
            }
            $scope.commission_pre_release_record.underling_commission = parseInt($scope.underling_commission_total);
            return parseInt($scope.underling_commission_total);
        }

        //總轉碼
        $scope.rolling_total = function(rolling_pre){
            rolling_pre.rolling_total = parseInt(rolling_pre.cash_rolling)+parseInt(rolling_pre.loan_rolling)+parseInt(rolling_pre.iou_rolling)+parseInt(rolling_pre.underling_rolling);
            return parseInt(rolling_pre.cash_rolling)+parseInt(rolling_pre.loan_rolling)+parseInt(rolling_pre.iou_rolling)+parseInt(rolling_pre.underling_rolling);
        }
        $scope.commission_total = function(commission_pre){
            commission_pre.roll_commission = parseInt(commission_pre.cash_rolling_commission)+parseInt(commission_pre.iou_rolling_commission)+parseInt(commission_pre.loan_rolling_commission)+parseInt(commission_pre.underling_commission);
            return parseInt(commission_pre.cash_rolling_commission)+parseInt(commission_pre.iou_rolling_commission)+parseInt(commission_pre.loan_rolling_commission)+parseInt(commission_pre.underling_commission);
        }

        //總佣金
        $scope.rolling_total_all = function(){
            $scope.commission_pre_release_record.rolling_total = $scope.cash_rolling()+$scope.loan_rolling()+$scope.iou_rolling()+$scope.underling_rolling();
            return $scope.cash_rolling()+$scope.loan_rolling()+$scope.iou_rolling()+$scope.underling_rolling();
        }
        $scope.commission_total_all = function(){
            $scope.commission_pre_release_record.roll_commission = $scope.cash_rolling_commission()+$scope.loan_rolling_commission()+$scope.iou_rolling_commission()+$scope.underling_commission();
            return $scope.cash_rolling_commission()+$scope.loan_rolling_commission()+$scope.iou_rolling_commission()+$scope.underling_commission();
        }
        //津貼餘額
        $scope.thismonth_allowance = function(){
            $scope.thismonth_allowance_total = 0;
            for(var i= 0;i <$scope.commission_pre_release_record.allowances.length;i++){
                $scope.thismonth_allowance_total += parseInt($scope.commission_pre_release_record.allowances[i].thismonth_allowance);
            }
            $scope.commission_pre_release_record.thismonth_allowance = parseInt($scope.thismonth_allowance_total);
            return parseInt($scope.thismonth_allowance_total);
        };
        $scope.underling_allowance = function(){
            $scope.underling_allowance_total = 0;
            for(var i= 0;i <$scope.commission_pre_release_record.allowances.length;i++){
                $scope.underling_allowance_total += parseInt($scope.commission_pre_release_record.allowances[i].underling_allowance);
            }
            $scope.commission_pre_release_record.underling_allowance = parseInt($scope.underling_allowance_total);
            return parseInt($scope.underling_allowance_total);
        };
        $scope.lastmonth_allowance = function(){
            $scope.lastmonth_allowance_total = 0;
            for(var i= 0;i <$scope.commission_pre_release_record.allowances.length;i++){
                $scope.lastmonth_allowance_total += parseInt($scope.commission_pre_release_record.allowances[i].lastmonth_allowance);
            }
            $scope.commission_pre_release_record.lastmonth_allowance = parseInt($scope.lastmonth_allowance_total);
            return parseInt($scope.lastmonth_allowance_total);
        };
        $scope.allowance_retrieve = function(){
            $scope.allowance_retrieve_total = 0;
            for(var i= 0;i <$scope.commission_pre_release_record.allowances.length;i++){
                $scope.allowance_retrieve_total += parseInt($scope.commission_pre_release_record.allowances[i].allowance_retrieve);
            }
            $scope.commission_pre_release_record.allowance_retrieve = parseInt($scope.allowance_retrieve_total);
            return parseInt($scope.allowance_retrieve_total);
        };
        $scope.thismonth_consumption = function(){
            $scope.thismonth_consumption_total = 0;
            for(var i= 0;i <$scope.commission_pre_release_record.allowances.length;i++){
                $scope.thismonth_consumption_total += parseInt($scope.commission_pre_release_record.allowances[i].thismonth_consumption);
            }
            $scope.commission_pre_release_record.thismonth_consumption = parseInt($scope.thismonth_consumption_total);
            return parseInt($scope.thismonth_consumption_total);
        };

        $scope.allowance_balance_total_all = function(){
            $scope.commission_pre_release_record.allowance_balance = $scope.thismonth_allowance()+$scope.underling_allowance()+$scope.lastmonth_allowance()+$scope.allowance_retrieve()-$scope.thismonth_consumption();
            return $scope.thismonth_allowance()+$scope.underling_allowance()+$scope.lastmonth_allowance()+$scope.allowance_retrieve()-$scope.thismonth_consumption();
        };

        $scope.allowance_balance_total = function(allowance){
            allowance.allowance_balance = parseInt(allowance.thismonth_allowance)+parseInt(allowance.underling_allowance)+parseInt(allowance.lastmonth_allowance)+parseInt(allowance.allowance_retrieve)-parseInt(allowance.thismonth_consumption);
            return parseInt(allowance.thismonth_allowance)+parseInt(allowance.underling_allowance)+parseInt(allowance.lastmonth_allowance)+parseInt(allowance.allowance_retrieve)-parseInt(allowance.thismonth_consumption);
        };

        //本月津貼總額
        $scope.thismonth_allowance_total = function(allowance){
//            allowance.allowance_balance = parseInt(allowance.thismonth_allowance)+parseInt(allowance.underling_allowance)+parseInt(allowance.lastmonth_allowance)+parseInt(allowance.allowance_retrieve)-parseInt(allowance.thismonth_consumption);
            return parseFloat(allowance.thismonth_allowance)+parseFloat(allowance.underling_allowance);
        };

        //應出佣金
        $scope.should_commission = function(){
            //$scope.allowance_balance_total_all()+
            $scope.commission_pre_release_record.should_pay_total = $scope.commission_pre_release_record.actual_commission = $scope.commission_total_all()+parseInt($scope.commission_pre_release_record.underling_fee)+parseInt($scope.commission_pre_release_record.mortgage_divided);
            return  $scope.commission_pre_release_record.should_pay_total;
        }

    }]).controller('commissionDetailCtrl',['$scope','commissions','$modalInstance',
        function($scope,commissions,$modalInstance){
            $scope.commissions =commissions;

            $scope.closed = function(){
                $modalInstance.close();
            }

    }]).controller('commissionShowCtrl',['$scope','commissionRecordDivide','id','index','hall_types','globalFunction','$modalInstance',
            function($scope,commissionRecordDivide,id,index,hall_types,globalFunction,$modalInstance){
                $scope.capital_type=['0186ADA8916BB660E055000000000001','0186ADA8916CB660E055000000000001','0186ADA8916DB660E055000000000001','08C12C2F7F7B4800E0539715A8C0C2DA'];
                if(hall_types){
                    //集團
                    $scope.condition={
                        commissionRecordSub:{commission_record_id:id},
                        capital_type_id:$scope.capital_type[index]
                    }
                }else{
                    //廳館
                    $scope.condition={
                        commission_record_sub_id:id,
                        capital_type_id:$scope.capital_type[index]
                    }
                }
                $scope.showCommissions =[];
                commissionRecordDivide.query(globalFunction.generateUrlParams($scope.condition,{})).$promise.then(function(showCommissions){
                    $scope.showCommissions = showCommissions;
                })

                $scope.closed = function(){
                    $modalInstance.close();
                }

    }]).controller('underlingCommissionDetailCtrl',['$scope','topAlert','rollingCardCommission','globalFunction','condition','status','underling','agent_info_id','year_month','hall_id','$modalInstance','$filter','getMonths','getDay','user','qzPrinter','show_type',
            function($scope,topAlert,rollingCardCommission,globalFunction,condition,status,underling,agent_info_id,year_month,hall_id,$modalInstance,$filter,getMonths,getDay,user,qzPrinter,show_type){

                if(status ==  '1'){
                    $scope.channel_type = "ReferralCommissionsProfit";
                    $scope.title="下線佣金收益";
                }else{
                    $scope.channel_type = "DownlineAllowancesProfit";
                    $scope.title="下線津貼";
                }
                $scope.year_month = year_month ? $filter('date')(Date.parse(year_month.replace(/-/g,"/")), 'yyyy-MM-01') : "";
                $scope.condition={
                    agent_info_id:agent_info_id,
                    year_month:[$scope.year_month],
                    type:'2',
                    sort:"child.agent_code NUMASC"
                };

                if(hall_id){
                    $scope.excel_condition={
                        hall_id:hall_id,
                        agent_info_id:agent_info_id,
                        year_month:[getMonths(year_month)],
                        type:'2',
                        sort:"child.agent_code NUMASC"
                    };
                }else if(condition.hall_id){
                    $scope.excel_condition={
                        hall_id:condition.hall_id,
                        agent_info_id:agent_info_id,
                        year_month:[getMonths(year_month)],
                        type:'2',
                        sort:"child.agent_code NUMASC"
                    }
                }else{
                    $scope.excel_condition={
                        hall_id:user.hall.id,
                        agent_info_id:agent_info_id,
                        year_month:[getMonths(year_month)],
                        type:'2',
                        sort:"child.agent_code NUMASC"
                    }
                }

                if(condition.hall_id != "0493728BB89506C6E0539715A8C0267D"){
                    $scope.condition.hall_id = show_type =='pre'? hall_id : "";
                }else{
                    $scope.excel_condition.hall_id = "0493728BB89506C6E0539715A8C0267D";
                }

                /*if(hall_id != "03A665B512BF621BE0539715A8C03C44"){
                    $scope.excel_condition.hall_id = user.hall.id;
                }*/
//                var conditions = angular.copy($scope.condition);
//                conditions.year_month[0] =$filter('date')(conditions.year_month[0], 'yyyy-MM');
//                $scope.excel_condition = angular.copy(conditions);

                $scope.underlingCommissions =[];
//                if(underling == 0){
                    rollingCardCommission.query($scope.condition).$promise.then(function(underlingCommissions){
                        $scope.underlingCommissions = _.filter(underlingCommissions, function(uCommissions){ return uCommissions.commission_amount > 0;});
                    })
//                }else{
//                    rollingCardCommission.query(globalFunction.generateUrlParams($scope.condition,{})).$promise.then(function(underlingCommissions){
//                        $scope.underlingCommissions = underlingCommissions;
//                    })
//                }

                $scope.isDesabled = false;
                $scope.print_r = function(){
                    if($scope.isDesabled){return;}
                    $scope.isDesabled = true;
                    if(status ==  '1') {
                        qzPrinter.print('PDFWindingAllowanceIncome',"", globalFunction.generateUrlParams($scope.excel_condition)).then(function(){
                            topAlert.success('下線佣金收益列印成功');
                            $scope.isDesabled = false;
                        });
                    }else{
                        qzPrinter.print('PDFOfflineAllowanceProceeds',"", globalFunction.generateUrlParams($scope.excel_condition)).then(function(){
                            topAlert.success('下線津貼列印成功');
                            $scope.isDesabled = false;
                        });
                    }

                }

                $scope.closed = function(){
                    $modalInstance.close();
                }

    }]).controller('commissionRecordCtrls',['$scope','commissionRecord','globalFunction','$location','breadcrumb','tmsPagination','$filter','commissionRecordStatus','preCommissionRecordStatus','commissionMonth','$stateParams','pinCodeModal','topAlert','$modal','hallName','repaymentType','goBackData','user','getMonths','getYestermonth','qzPrinter','printerType',
        function($scope,commissionRecord,globalFunction,$location,breadcrumb,tmsPagination,$filter,commissionRecordStatus,preCommissionRecordStatus,commissionMonth,$stateParams,pinCodeModal,topAlert,$modal,hallName,repaymentType,goBackData,user,getMonths,getYestermonth,qzPrinter,printerType){
            $scope.commission_record_status = commissionRecordStatus;
            hallName.query({sort:"hall_type ASC",hall_type:"2"}).$promise.then(function(halls){
                $scope.halls =_.filter(halls,function(hall){return hall.hall_name != '海外';});
                $scope.halls =_.filter($scope.halls,function(hall){return hall.hall_name != '馬尼拉';});
            });
            //麵包屑導航
            breadcrumb.items = [
                {"name":"出佣單管理","active":true}
            ];

            $scope.$watch('user.hall.id',function(value){
               $scope.select();
            });
            $scope.show_commission = false;
            $scope.repaymentType = repaymentType.items;
            //搜索
            var original;
            var init_condition= {
                "agentInfo":{agent_code:$stateParams.id ? $stateParams.id : ""},
                "agentGroup.agent_group_name":"",
                "agentMaster":{agent_contact_name:""},
                "year_month":['',''],
                "status":preCommissionRecordStatus.settlement,
                "status_wages":$stateParams.id ? "" : $scope.commission_record_status.commissionUnpay,
                "hall_id":'',
                "sort":"agentInfo.agent_code NUMASC, year_month DESC"
            }

            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.excel_condition  = angular.copy($scope.condition);
            $scope.condition = goBackData.get('condition',$scope.condition);

            $scope.hall_types = true;
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = commissionRecord;
            $scope.status_wages = $scope.condition.status_wages;
            $scope.select = function(page){

//                $scope.hall_types = false;
//                goBackData.set('condition',$scope.condition);
//                _.each($scope.halls,function(hall){
//                    if($scope.condition.hall_id == hall.id && hall.hall_type == '1'){
//                        $scope.hall_types = true;
//                    }
//                });
//                if(user.hall.hall_type == '1'){
//                    $scope.hall_types = true;
//                }
//                $scope.condition.hall_id = user.hall.id;
                var conditions  =angular.copy($scope.condition);
                //if(!user.isAllHall()){
                //    conditions.hall_id = user.hall.id;
                //}
                $scope.status_wages = conditions.status_wages
                conditions.year_month[0] = conditions.year_month[0] ? $filter('date')($scope.condition.year_month[0], 'yyyy-MM') : "";
                conditions.year_month[1] = conditions.year_month[1] ?$filter('date')($scope.condition.year_month[1], 'yyyy-MM') : "";
                $scope.excel_condition  = angular.copy(conditions);
                conditions.agentMaster.agent_contact_name = conditions.agentMaster.agent_contact_name ? $scope.condition.agentMaster.agent_contact_name+"!" : "";

                //批量出佣的查詢參數
                $scope.batch_commission_condition = angular.copy(conditions);

                $scope.commissionRecords = $scope.pagination.select(page,globalFunction.generateUrlParams(conditions,{}));
                $scope.commissionTotal = commissionRecord.commissionTotal(globalFunction.generateUrlParams(conditions,{}));

                $scope.check_false_ids = _.pluck($scope.check_agent_false,'id');
                $scope.check_true_ids = _.pluck($scope.check_agent_true,'id');

                $scope.commissionRecords.$promise.then(function (commissionRecords) {
                    _.each(commissionRecords, function (ld) {
                        if ($scope.check.selected_all) {
                            if ($scope.check_false_ids.length > 0) {
                                if ($scope.check_false_ids.indexOf(ld.id) == -1 && ld.round_commission==0 && ld.status_wages==1) {
                                    ld.selected = true;
                                } else {
                                    ld.selected = false;
                                }
                            } else {
                                if(ld.round_commission==0 && ld.status_wages==1)
                                    ld.selected = true;
                            }
                        } else {
                            if ($scope.check_true_ids.length > 0) {
                                if ($scope.check_true_ids.indexOf(ld.id) >= 0 && ld.round_commission==0 && ld.status_wages==1) {
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

            $scope.search = function(type){

                $scope.check_agent_true = [];
                $scope.check_agent_false = [];
                /*if($stateParams.id){
                    $scope.condition.agentInfo.agent_code = $stateParams.id;
                   $scope.condition.status_wages = "";
                }*/
                if(type===true) {
                    commissionMonth.query({sort: "year_month DESC"}).$promise.then(function (commission_months) {
                        $scope.commission_months = commission_months[0];
                        if (!$stateParams.id) {
                            if (commission_months.length) {
                                if (commission_months[0].status == 3) {
                                    $scope.condition.year_month[0] = getMonths(commission_months[0].year_month);
                                    $scope.condition.year_month[1] = getMonths(commission_months[0].year_month);
                                } else if (commission_months[0].status == 2) {
                                    $scope.condition.year_month[0] = getYestermonth(commission_months[0].year_month);
                                    $scope.condition.year_month[1] = getYestermonth(commission_months[0].year_month);
                                }
                            }
                        }
                        $scope.select(1);
                    });
                }else{
                    $scope.select(1);
                }
            }
            $scope.search(true);

            $scope.select_check_false = function() {
                var condition_copy = angular.copy($scope.condition);
                condition_copy.year_month = condition_copy.year_month ? $filter('date')(condition_copy.year_month, 'yyyy-MM') : "";
                $scope.consumptions = $scope.pagination.select(1, condition_copy, {});
            }

            //選中轉移的消費記錄
            //$scope.select_status = 0;//0：取消 1：全選
            //$scope.selected_all = false;
            $scope.check  = {selected_all: false };
            //选中值数组
            $scope.check_agent_true = [{id:""}];
            //未选中值数组
            $scope.check_agent_false =[{id:""}];
            $scope.check_agent_true.splice(0,1);
            $scope.check_agent_false.splice(0,1);
            //全选取消按钮事件
            $scope.selectedAll = function(){
                if($scope.check.selected_all){
                    //$scope.select_status = 1;
                    _.each($scope.commissionRecords, function (ld){
                        if(ld.round_commission==0 && ld.status_wages==1){
                            ld.selected = true;
                        }
                    });
                    $scope.check_agent_false = [];
                    $scope.check_agent_true = [];
                }else{
                    //$scope.select_status = 0;
                    _.each($scope.commissionRecords, function (ld) {
                        ld.selected = false;
                    });
                    $scope.check_agent_true = [];
                    $scope.check_agent_false = [];

                }
            }
            //单个复选框选中取消
            $scope.check_one = function(ld){
                if($scope.check.selected_all){
                    if(ld.selected){
                        $scope.check_agent_false.splice(_.pluck($scope.check_agent_false,'id').indexOf(ld.id),1);
                    }else{
                        $scope.check_agent_false.push({id:ld.id});
                    }
                }else{
                    if(ld.selected){
                        $scope.check_agent_true.push({id:ld.id});
                    }else{
                        $scope.check_agent_true.splice(_.pluck($scope.check_agent_true,'id').indexOf(ld.id),1);
                    }
                }
            }


            //批量出佣
            var init_batch_consumption = {
                commission_record_ids: [],
                is_all_select: 0
            };
            $scope.batch_consumption_record = angular.copy(init_batch_consumption);
            $scope.batchCommission = function(){
                /*if($scope.status_wages==2){
                    topAlert.warning("當前記錄是已出佣記錄");
                    return;
                }*/
                $scope.batch_consumption_record.is_all_select = $scope.check.selected_all ? 1 : 0;
                if($scope.check.selected_all) {
                    $scope.check_agent_true_ids = _.pluck($scope.check_agent_false,'id');
                }else{
                    $scope.check_agent_true_ids = _.pluck($scope.check_agent_true,'id');
                }
                $scope.batch_consumption_record.commission_record_ids = $scope.check_agent_true_ids;

                //賦值批量出佣的數據
                $scope.batch_commission_condition_copy = globalFunction.generateUrlParams($scope.batch_commission_condition);
                /*$scope.batch_commission_condition_copy.commission_record_ids = $scope.batch_consumption_record.commission_record_ids;
                $scope.batch_commission_condition_copy.is_all_select = $scope.batch_consumption_record.is_all_select;*/
                //return false;
                if($scope.batch_consumption_record.is_all_select == 0 && $scope.batch_consumption_record.commission_record_ids.length == 0){
                    topAlert.warning("請選擇要批量出佣的記錄!");
                    return;
                }
                pinCodeModal(commissionRecord, 'batchUpdateCommission', $scope.batch_consumption_record, '批量出佣成功！',"",$scope.batch_commission_condition_copy).then(function () {
                    $scope.batch_consumption_record = angular.copy(init_batch_consumption);
                    $scope.check_agent_true = [];
                    $scope.check_agent_false = [];
                    $scope.check.selected_all = false;
                    $scope.select(1);
                });
            }

            $scope.reset = function(){
                $scope.condition = angular.copy(original);
                $scope.condition.status_wages= "";
                $scope.condition.year_month[0]= "";
                $scope.condition.year_month[1]= "";
                /*if($stateParams.id){
                    $scope.condition.agentInfo.agent_code = $stateParams.id;
                    $scope.condition.status_wages = "";
                }
                commissionMonth.query({sort:"year_month DESC"}).$promise.then(function(commission_months){
                    $scope.commission_months = commission_months[0];
                    if(!$stateParams.id){
                        if(commission_months.length){
                            if(commission_months[0].status == 3){
                                $scope.condition.year_month[0] = getMonths(commission_months[0].year_month);
                                $scope.condition.year_month[1] = getMonths(commission_months[0].year_month);
                            }else if(commission_months[0].status == 2){
                                $scope.condition.year_month[0] = getYestermonth(commission_months[0].year_month);
                                $scope.condition.year_month[1] = getYestermonth(commission_months[0].year_month);
                            }
                        }
                    }
                    $scope.select();
                });*/
            }
            //$scope.reset();

            //尾数计算
            $scope.actual_commission = function(commission_record){
                return (parseFloat(commission_record.should_commission*10000)-(parseFloat(commission_record.expired_fee*10000)+parseFloat(commission_record.negative_consumption*10000)+parseFloat(commission_record.miscellaneous_cash*10000)))/10000;
            }
            //出佣单model
            $scope.commission_records ={
                "is_all":"",
                "commission_id":"",
                "isdeduction_expired_fee":"0",
                "isdeduction_over_comsumption":"0",
                "isdeduction_miscellaneous_cash":"0",
                "isdeduction_negative_consp":"0",
                "remark":""
            }
            //
            $scope.$watch('commission_records.is_all',function(new_value,old_value){
                if(new_value == 1) {//全部還款
                    //全部還款 = 貸款金額 - 未還金額
                    $scope.commission_records.amount =$scope.commission_record.expired_fee;
                }else {
                    $scope.commission_records.amount = "";
                }
            });
            $scope.expired_fee_show = false;
            //出佣单详细
            //自定義變量
//            $scope.commission_record_status = commissionRecordStatus;
            //初始化列表數據
            $scope.query = function(id){
                $scope.show_commission = false;
                commissionRecord.get(globalFunction.generateUrlParams({id:id},{commissionRecordSubs:{cashDivides:"",markerDivides:"",iouDivides:"",stockDivides:""},allowances :{}}),function(commission_record){
                    $scope.commission_record = commission_record;
                    $scope.commission_records.commission_id = id;
                    $scope.commission_records.remak = $scope.commission_record.remak;
                    $scope.show_commission = true;
                    $scope.total = $scope.commission_record.should_pay_total;
                    $scope.shoulds = [
                        {should: $scope.commission_record.expired_fee,title:"逾期手續費"},
                        {should: $scope.commission_record.over_comsumption,title:"扣超額消費"},
                        {should: $scope.commission_record.miscellaneous_cash,title:"雜項現金消費"}
                    ]
                    if($scope.commission_record.isdeduction_expired_fee ==1){
                        $scope.shoulds[0].selected = true;
                    }
                    if($scope.commission_record.isdeduction_over_comsumption == 1){
                        $scope.shoulds[1].selected = true;
                    }
                    if($scope.commission_record.isdeduction_miscellaneous_cash  == 1){
                        $scope.shoulds[2].selected = true;
                    }
                });
            }

            //佣金計算
            $scope.should_pay = function(ck,index){
                if(ck.selected){
                    if(index == 0){
                        $scope.commission_records.isdeduction_expired_fee = 0;
                        $scope.expired_fee_show = true;
                    }
                    if(index == 1){
                        $scope.commission_records.isdeduction_over_comsumption = 0;
                    }
                    if(index == 2){
                        $scope.commission_records.isdeduction_miscellaneous_cash = 0;
                    }
                    $scope.commission_record.actual_commission = parseFloat($scope.commission_record.should_commission) + parseFloat(ck.should);
                }else{
                    if(index == 0){
                        $scope.commission_records.isdeduction_expired_fee = 1;
                        $scope.expired_fee_show = false;
                    }
                    if(index == 1){
                        $scope.commission_records.isdeduction_over_comsumption = 1;
                    }
                    if(index == 2){
                        $scope.commission_records.isdeduction_miscellaneous_cash = 1;
                    }
                    $scope.commission_record.actual_commission = parseFloat($scope.commission_record.should_commission) - parseFloat(ck.should);
                }
            }

            //修改出佣
            $scope.add =function(){
                $scope.disabled_submit = true;
                pinCodeModal(commissionRecord, 'updateCommission', $scope.commission_records, '出佣成功！').then(function () {
                    $scope.commission_record.status_wages =  $scope.commission_record_status.commissionPaid;
                    $location.path('/commission-calculate/commission-record');
                    $scope.select();
                    $scope.show_commission = false;
                    $scope.disabled_submit = false;
                },function(){
                    $scope.show_commission = true;
                    $scope.disabled_submit = false;
                });
            }
            //出佣單詳細
            $scope.detail = function(id){
//                $scope.query(id);
                $location.path('/commission-calculate/commission-record-detail/'+id);
            }

            //佣金詳細
            $scope.commissionShowDeatail = function(id,index){
                $modal.open({
                    "templateUrl":"views/commission-calculate/commission-show.html",
                    "controller":"commissionShowCtrl",
                    resolve: {
                        id:function(){
                            return id;
                        },
                        index:function(){
                            return index;
                        },
                        hall_types:function(){
                            return $scope.hall_types;
                        }
                    }
                });
            };

            //下線津貼詳細
            $scope.underling_commissionDeatail = function(status,underling,agent_info_id,year_month,hall_id){
                var modal_instance;
                modal_instance = $modal.open({
                    templateUrl: "views/commission-calculate/underling-commission-detail.html",
                    controller: "underlingCommissionDetailCtrl",
                    resolve: {
                        show_type:function(){
                           return  "";
                        },
                        status:function(){
                            return status;
                        },
                        underling:function(){
                            return underling;
                        },
                        agent_info_id:function(){
                            return agent_info_id;
                        },
                        year_month:function(){
                            return year_month;
                        },
                        hall_id:function(){
                            return hall_id;
                        },
                        condition:function(){
                            return $scope.condition;
                        }
                    }
                });
            };

            //出傭列印
            $scope.outCommission = function(commission_record_id){

                $scope.print_hall_name = user.hall.hall_name
                if($scope.print_hall_name == "集團")
                    $scope.print_hall_name = "";

                $scope.disable_print = true;
                /*printerType.stylusPrinter*/
                qzPrinter.print('PDFOutCommissionRecord',"",{'commission_record_id':commission_record_id,'hall_name':$scope.print_hall_name},true).then(function(){
                    topAlert.success('列印成功');
                    $scope.disable_print = false;
                    $scope.cancel();
                },function(msg){
                    $scope.disable_print = false;
                })
            }

            //佣金詳細
            $scope.commissionDeatail = function(commissions){
                var modal_instance;
                modal_instance = $modal.open({
                    "templateUrl":"views/commission-calculate/commission-detail.html",
                    "controller":"commissionDetailCtrl",
                    resolve: {
                        commissions:function(){
                            return commissions;
                        }
                    }
                });
            }

            //本月津貼總額
            $scope.thismonth_allowance_total = function(allowance){
                return parseFloat(allowance.thismonth_allowance)+parseFloat(allowance.underling_allowance);
            };
//
//            $scope.return = function(){
//                $location.path('/commission-calculate/commission-record');
//            }


            //修改備註
            $scope.editRemark = function(record){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/share/edit-remark.html",
                    controller: "commissionEditRemarkCtrl",
                    resolve: {
                        record: function () {
                            return record;
                        }
                    }
                });

                //$scope.record = record;
                modalInstance.result.then(function() {
                    $scope.select();
                    //$scope.record.remark = result.remark;
                });
            }

        }]).controller('commissionEditRemarkCtrl',['$scope','globalFunction','topAlert','$modalInstance','commissionRecord','record',
            function($scope,globalFunction,topAlert,$modalInstance,commissionRecord,record){
                $scope.title = "修改佣金去向備註";
                $scope.record_copy = angular.copy(record);
                $scope.record_create = {
                    commission_record_id: $scope.record_copy.id,
                    remark: $scope.record_copy.remark,
                    pin_code: ""
                };
                $scope.disabled_submit = false;
                $scope.commission_url =  globalFunction.getApiUrl('commission/commissionrecord/update-remark');
                $scope.edit = function(){
                    if($scope.disabled_submit){return;}
                    $scope.disabled_submit = true;
                    $scope.form_commission.checkValidity().then(function() {
                        commissionRecord.updateRemark($scope.record_create, function () {
                            topAlert.success("修改備註成功！");
                            $scope.disabled_submit = false;
                            $modalInstance.close();
                        },function(){
                            $scope.disabled_submit = false;
                        });
                    })
                };

                $scope.close = function(){
                    $modalInstance.dismiss();
                }

    }]).controller('commissionRecordDetailCtrls',['$scope','$filter','depositCard','windowItems','commissionRecord','specialAgent','commissionRecordDifference','depositCardRecord','pinCodeModal','globalFunction','commissionRecordStatus','$stateParams','$location','breadcrumb','$modal','topAlert','repaymentType','qzPrinter','printerType',
        function($scope,$filter,depositCard,windowItems,commissionRecord,specialAgent,commissionRecordDifference,depositCardRecord,pinCodeModal,globalFunction,commissionRecordStatus,$stateParams,$location,breadcrumb,$modal,topAlert,repaymentType,qzPrinter,printerType){
        //麵包屑導航
        breadcrumb.items = [
            {"name":"出佣單管理","url":'commission-calculate/commission-record'},
            {"name":"出佣單記錄","active":true}
        ];
        //自定義變量
        $scope.commission_url = globalFunction.getApiUrl('commission/commissionrecord/update-commission');
        $scope.commission_record_status = commissionRecordStatus;
        $scope.repaymentType = repaymentType.items;
        $scope.expired_fee_show = false;
        $scope.com_agent_code= "";//成就屏幕狗戶口


        //出佣model
        $scope.commission_records ={
            "commission_id": "",
            "expired_fee_type": "",
            "expired_fee_amount":"",
            "isdeduction_fee": "",
            "com_agent_id":"",
            "com_card_name":"",
            "selected":"false",
            "remark":"",
            "pin_code":""
        }
        //初始化列表數據
        $scope.commission_record = {}

        var init_new_record = {
            com_agent_name: "",
            com_card_id: "",
            com_card_name: ""
        }
        $scope.new_record = angular.copy(init_new_record);

        $scope.query = function(){
            if($stateParams.id){
                commissionRecord.get(globalFunction.generateUrlParams({id:$stateParams.id},{commissionRecordSubs:{cashDivides:"",markerDivides:"",iouDivides:"",stockDivides:""},allowances :{}}),function(commission_record){
                    $scope.commission_record = commission_record;
                    //$scope.commission_record.actual_commission = '-0.5231.3';
                    //$scope.commission_record.negative_consumption = '-0.0022';
                    //$scope.commission_record.expired_fee = '0.01';
                    //$scope.commission_record.actual_commission = parseFloat($scope.commission_record.should_commission)-parseFloat($scope.commission_record.negative_consumption) - parseFloat($scope.commission_record.miscellaneous_cash);
                    //$scope.commission_record.actual_commission = $scope.commission_record.should_commission
                    $scope.commission_records.selected = false;
                    $scope.commission_records.commission_id = $stateParams.id;
                });
            }
        }
        $scope.query();
        //
        $scope.agents = [];


        //監控戶口編號 當戶口編號 存在時 提示
        $scope.$watch('com_agent_code',globalFunction.debounce(function(new_value,old_value){
            $scope.commission_records.com_agent_id ="";
            $scope.commission_records.com_card_name = '';
            if(new_value){
                depositCard.query(globalFunction.generateUrlParams({agent_code:new_value},{agentMaster:{},depositicketContacts:{}})).$promise.then(function(agent){
                    if(agent.length>0){
                        $scope.commission_records_sreach = agent
                        //$scope.agents = agents;
                        $scope.commission_records.com_agent_id  = agent[0].agent_info_id;
                        //$scope.select_card();
                    }
                });
            }
//            if( !$scope.agent.id && new_value){
//                agentsLists.query(globalFunction.generateUrlParams({agent_code:new_value}, {})).$promise.then(function (agents) {
//                    if(agents.length > 0){
//                        topAlert.warning(new_value+"戶口編號已存在!");
//                    }
//                });
//            }
        },350));
        $scope.cards = [];
        //$scope.select_card = function(){
        //    $scope.cards = [];
        //    if($scope.commission_records.com_agent_id){
        //        $scope.agent_data = _.findWhere($scope.agents,{agent_info_id:$scope.commission_records.com_agent_id});
        //        //$scope.cards.push({card_id:$scope.agent_data.card_name,card_name:$scope.agent_data.card_name});
        //        _.each($scope.agents,function(agent){
        //            if(agent.agent_info_id  == $scope.commission_records.com_agent_id){
        //                $scope.cards.push({card_id:agent.card_name,card_name:agent.card_name});
        //            }
        //        });
        //        if($scope.cards.length){
        //            _.each($scope.cards,function(card){
        //                if(card.card_name == 'HKD'){
        //                    $scope.commission_records.com_card_name = 'HKD';
        //                }
        //            });
        //        }
        //
        //    }else{
        //        $scope.commission_records.com_card_name = '';
        //        $scope.cards = [];
        //    }
        //}
        //
        $scope.$watch('commission_records.expired_fee_type',function(new_value,old_value){
            if(new_value == 1) {
                $scope.commission_records.expired_fee_amount = $scope.commission_record.expired_fee*10000;
            }else {
                $scope.commission_records.expired_fee_amount = "";
                $scope.commission_record.actual_commission = parseFloat($scope.commission_record.should_commission)-parseFloat($scope.commission_record.negative_consumption) - parseFloat($scope.commission_record.miscellaneous_cash);
            }
        });

        $scope.$watch('commission_records.expired_fee_amount',function(new_value,old_value){
            var value = new_value ? new_value : 0;
            //if(new_value) {
               $scope.commission_record.actual_commission =(parseFloat($scope.commission_record.should_commission*10000) - parseFloat(value))/10000;
            //}
        });
        //佣金計算
//        $scope.should_pay = function(ck,index){
          $scope.should_pay = function(){
            if($scope.commission_records.selected){
                if($scope.commission_record.expired_fee > 0){
                    $scope.expired_fee_show = false;
                }

            }else{
                if($scope.commission_record.expired_fee > 0){
                    $scope.expired_fee_show = true;
                    $scope.commission_records.expired_fee_amount = "";
                    $scope.commission_records.expired_fee_type ="";
                }
            }
        }

        //修改出佣
        $scope.disabled_submit = false;
        $scope.add =function(){
            if($scope.disabled_submit){
                return $scope.disabled_submit;
            }
            if($scope.commission_records.selected){
                $scope.commission_records.isdeduction_fee = '1';
                if($scope.commission_record.expired_fee == '0'){
                    $scope.commission_records.expired_fee_amount = "0";
                    $scope.commission_records.expired_fee_type ="1";
                }
            }else{
                $scope.commission_records.isdeduction_fee = '0';
            }
            $scope.disabled_submit = true;
            $scope.commission_records_copy = angular.copy($scope.commission_records);
            $scope.commission_records_copy.expired_fee_amount = $scope.commission_records_copy.expired_fee_amount/10000;

            //如果實出佣金為零
            if(Number($scope.commission_record.round_commission)==0){
                $scope.commission_records_copy.com_agent_id = $scope.agents ? $scope.agents[0].agent_info_id : "";
                $scope.commission_records_copy.com_card_name = $scope.agents ? $scope.agents[0].card_name : "";
            }
            //return false;
            $scope.form_commission.checkValidity().then(function() {
                $scope.disabled_submit = true;
                commissionRecord.updateCommission($scope.commission_records_copy, function (data) {
                    topAlert.success("出佣成功！");
                    $scope.commission_record.status_wages =  $scope.commission_record_status.commissionPaid;
                    $scope.disabled_submit = false;
                    $scope.expired_fee_show = false;

                    //打印存卡
                    if(Number($scope.commission_record.round_commission)!==0) {
                        depositCardRecord.get({"id":data.card_record_id}).$promise.then(function(deposit_card_record){
                        var print_record = {
                                id: data.card_record_id,
                                depositcard_id: deposit_card_record.depositcard_id,
                                agent_code: $scope.agent_data.agent_code,
                                agent_name: $scope.agent_data.agent_name,
                                card_name: $scope.agent_data.card_name
                        }
//                        $scope.print_card("出佣存卡列印", print_record);
                        });
                        $location.path('/commission-calculate/commission-record');
                    }else{
                        $location.path('/commission-calculate/commission-record');
                    }

                },function(){
                    $scope.disabled_submit = false;
                });
            })

            $scope.print_card = function(title,record){
                if(record){
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/deposit/print-card.html",
                        controller: 'printCardCtrl',
                        resolve: {
                            selected_deposit_card:function(){
                                return record;
                            },
                            title:function(){
                                return title;
                            },
                            login_user:function(){
                                return $scope.user;
                            }
                        }
                    });
                    modalInstance.result.then(function(_depositCard) {
                        //存卡15行之後提示打印表頭
                        if(_depositCard.print_row == 15){
                            windowItems.confirm("提示","請先列印"+_depositCard.agent_code+"，存卡"+_depositCard.card_name+"的表頭",function(){
                                qzPrinter.print('PDFDepositCardTableHead',printerType.stylusPrinter,{'deposit_card_title_id':_depositCard.id, 'hall_id': $scope.user.hall.id}).then(function(){
                                    topAlert.success('列印成功');
                                    //$scope.reset_print_header();
                                }/*,function(){
                                    $scope.reset_print_header();
                                }*/);
                            });
                        }
                        $location.path('/commission-calculate/commission-record');
                    }/*, function() {
                        $log.info("Modal dismissed at: " + new Date());
                    }*/);
                }else{
                    topAlert.warning('請選擇存卡');
                }
            }

//            pinCodeModal(commissionRecord, 'updateCommission', $scope.commission_records_copy, '出佣成功！').then(function () {
//                $scope.disabled_submit = false;
//                $scope.expired_fee_show = false;
//                $scope.commission_record.status_wages =  $scope.commission_record_status.commissionPaid;
//                $location.path('/commission-calculate/commission-record');
//            },function(){
//                $scope.disabled_submit = false;
//            });
        }

        $scope.return = function(){
            $location.path('/commission-calculate/commission-record');
        }

        //佣金詳細
        $scope.commissionDeatail = function(commissions){
            var modal_instance;
            modal_instance = $modal.open({
                "templateUrl":"views/commission-calculate/commission-detail.html",
                "controller":"commissionDetailCtrl",
                resolve: {
                    commissions:function(){
                        return commissions;
                    }
                }
            });
        }
        //


    }]).controller('cutMonthSettingCtrl',['$scope','globalFunction','$stateParams','$location','topAlert','breadcrumb','hallName',
        function($scope,globalFunction,$stateParams,$location,topAlert,breadcrumb,hallName){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"截月時間設定","active":true}
            ];

             $scope.halls_select = function(){
                 hallName.query({hall_type:"|1"}).$promise.then(function(_hall){
                     $scope.halls = split(_hall,2)
                 });
             }
            $scope.halls_select();

            function split(arr, size) {
                var arrays = [];
                while(arr.length > 0) {
                    arrays.push(arr.splice(0, size));
                }
                return arrays;
            }

            $scope.record = {
                halls: "",
                pin_code: ""
            }
            $scope.cut_month_setting_url = globalFunction.getApiUrl("common/hall/set-hall-settlement-date");
            $scope.submit = function(){
                var hall_flatten = _.flatten($scope.halls,true);
                var hall_content = [];
                _.each(hall_flatten,function(_hall){
                    hall_content.push({"id":_hall.id, "settlement_date":_hall.settlement_date});
                });
                $scope.record.halls = hall_content;
                $scope.form_cut_month_setting.checkValidity().then(function() {
                    hallName.setHallSettlementDate($scope.record).$promise.then(function(){
                         topAlert.success("截月時間設定成功");
                    });
                });
            }

            $scope.reset = function(){
                $scope.halls_select();
            }

        }]);

}).call(this);
