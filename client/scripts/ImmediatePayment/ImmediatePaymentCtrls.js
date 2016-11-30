(function() {
  'use strict';
  angular.module("app.immediate-payment.ctrls", ["app.report.services"]).controller('paymentRecordCtrl',['$scope','commissionImmediate','tmsPagination','topAlert','breadcrumb','hallName','pinCodeModal','$location','$filter','goBackData',
        function($scope,commissionImmediate,tmsPagination,topAlert,breadcrumb,hallName,pinCodeModal,$location,$filter,goBackData){
            breadcrumb.items = [
              {"name":"即出記錄","active":true}
            ];

            $scope.halls = hallName.query();
            var original_condition;
            var init_condition ={
              hall_id:"",
              shiftMark:{year_month: [""]},
              create_time: [""],
              fromAgent:{agent_code:""},
              toAgent:{agent_code:""},
              status:"0"
            }
            original_condition = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.condition = goBackData.get('condition',$scope.condition);
            //列表初始化数据
            $scope.pagination =tmsPagination.create();
            $scope.pagination.resource = commissionImmediate;
            $scope.select = function(page){
                goBackData.set('condition',$scope.condition);
                var conditions = angular.copy($scope.condition);
                conditions.shiftMark.year_month[0] = $filter('date')($scope.condition.shiftMark.year_month[0], 'yyyy-MM');
                conditions.create_time[0] = $filter('date')($scope.condition.create_time[0], 'yyyy-MM-dd');
                if($scope.condition.fromAgent.agent_code){
                    conditions.fromAgent.agent_code = $scope.condition.fromAgent.agent_code+"!";
                }
                if($scope.condition.toAgent.agent_code){
                    conditions.toAgent.agent_code = $scope.condition.toAgent.agent_code+"!";
                }
                $scope.paymentRecords = $scope.pagination.select(page,conditions);
            }
            $scope.select();
            //重置
            $scope.reset = function(){
                $scope.condition = angular.copy(original_condition);
                $scope.select();
            }
            //詳細
            $scope.detail = function(id){
                $location.path('/immediate-payment/payment-detail/'+id);
            }
            //刪除
            $scope.delete = function(id){
                pinCodeModal(commissionImmediate, 'delete', {id: id}, '刪除成功！').then(function () {
                    $scope.select();
                });
            }
            //生成出佣单
            $scope.immediateCommission = function(id){
                if(id){
                    pinCodeModal(commissionImmediate, 'immediateCommission', {id: id}, '已成功生成出佣單！').then(function () {
                        $scope.select();
                    });
                }
            }

    }]).controller('paymentCreateCtrl',['$scope','windowItems','commissionImmediate','agentsLists','commissionCard','depositCard','shiftMark','currentShift','globalFunction','tmsPagination','topAlert','breadcrumb','$filter','hallName','$location','$modal','$log','$stateParams','qzPrinter','printerType', 'shiftMarks', 'getAppointDay', 'dateComp',
        function($scope,windowItems,commissionImmediate,agentsLists,commissionCard,depositCard,shiftMark,currentShift,globalFunction,tmsPagination,topAlert,breadcrumb,$filter,hallName,$location,$modal,$log,$stateParams,qzPrinter,printerType, shiftMarks, getAppointDay, dateComp){

            breadcrumb.items = [
                {"name":"新增即出","active":true}
            ];

            $scope.shiftMarks = shiftMarks;
            $scope.showPayment = false;
            $scope.payment_create_url = globalFunction.getApiUrl('commission/commissionrecordimmediate/immediate-calc');
            $scope.payment_add_url = globalFunction.getApiUrl('commission/commissionrecordimmediate/immediate-add');
            shiftMark.get().$promise.then(function(shift_mark){
                $scope.shift_mark = shift_mark;
            });
            $scope.nowDate = $filter('date')(new Date(), 'yyyy-MM-dd');
            //计佣model
            $scope.immediate_calc = {
                "from_agent_id":"",
//                "pin_code":"",
                "date":$scope.nowDate,
                "year_month":currentShift.data.year_month
            }
            //计佣返回model
            $scope.immediate ={};
            //计佣新增
            $scope.immediate_add ={
                deposit_amount:0,
                shift_date: currentShift.data.shift_date,
                shift: shiftMarks.morning
            };

            $scope.$watch("immediate_calc.year_month",function(newVal,oldVal){
                if(newVal != oldVal){
                    $scope.immediate_calc = {
                        "from_agent_id":$scope.immediate_calc.from_agent_id ? $scope.immediate_calc.from_agent_id :"",
                        "date":$scope.nowDate,
                        "year_month":currentShift.data.year_month
                    };
                    $scope.immediate_add ={
                        deposit_amount:0,
                        shift_date: currentShift.data.shift_date,
                        shift: shiftMarks.morning
                    };
                    $scope.immediate_calc.year_month = newVal;
                }
            });


            //$scope.shift_date = $filter('date')(currentShift.data.shift_date, 'yyyy-MM-dd');

            $scope.setShiftDate = function() {
                //截月/即出
                if(typeof ($scope.immediate_calc.year_month)=='string'){
                    $scope.year_month = $scope.immediate_calc.year_month ? $filter('date')(new Date($scope.immediate_calc.year_month), 'yyyy-MM-01') : "";
                }else{
                    $scope.year_month = $scope.immediate_calc.year_month ? $filter('date')($scope.immediate_calc.year_month, 'yyyy-MM-01') : "";
                }

                var shift_date = angular.copy($scope.shift_date);
                var year_month =  angular.copy($scope.year_month);

                shift_date = shift_date ? shift_date : $filter('date')(currentShift.data.shift_date, 'yyyy-MM-dd');


                if(parseInt($filter('date')(year_month, 'MM')) == parseInt($filter('date')(shift_date, 'MM'))){
                    $scope.immediate_add.shift_date = currentShift.data.shift_date;
                    $scope.immediate_add.shift = currentShift.data.shift;
                }else if(parseInt($filter('date')(year_month, 'MM')) < parseInt($filter('date')(shift_date, 'MM')) || parseInt($filter('date')(year_month, 'MM')) > parseInt($filter('date')(shift_date, 'MM'))){
                    var date = year_month.split('-');
                    $scope.immediate_add.shift_date = getAppointDay(date[0], date[1], 1); //当前截月最后一天的前一天
                }


            };



            if($stateParams.agent_code){
                $scope.agent_code = $stateParams.agent_code;
            }
            //户口編號監控
            $scope.$watch('agent_code',globalFunction.debounce(function(new_value,old_value){
                $scope.agent_loan_id = "";
                $scope.agent_name = "";
                $scope.immediate_calc.from_agent_id ="";
                if(new_value){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code:new_value}, {unRepayment:{}})).$promise.then(function (agents) {
                        if(agents.length > 0){
                            $scope.agent_loan_id= agents[0].unRepayment;
                            $scope.agent_name = agents[0].agent_name;
                            $scope.immediate_calc.from_agent_id = agents[0].id;
                        }
                    });
                }
            }));
            $scope.detail =function(id){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/immediate-payment/payment-loan.html",
                    controller: 'paymentLoanCtrl',
                    windowClass:'lg-modal',
                    resolve: {
                        id: function() {
                            return  id;
                        }
                    }
                });
            }
            //計佣
            $scope.disabled_submit = false
            //$scope.addRollingCardFlag = false;
            $scope.calculate = function(){
                //$scope.addRollingCardFlag = $scope.user.hall.id == '1AE7283167B57D1DE050A8C098155859' ? true : false;
                //$scope.setShiftDate();
                if($scope.disabled_submit){
                    return $scope.disabled_submit;
                }
                $scope.resetPayment();
                if(!$scope.immediate_calc.from_agent_id){
                   topAlert.warning("請輸入戶口編號!");
                    return;
                }
                if(!$scope.immediate_calc.year_month){
                    topAlert.warning("請選擇即出月份!");
                    return;
                }
                $scope.immediate_calc.year_month = $filter('date')($scope.immediate_calc.year_month, 'yyyy-MM');
                $scope.form_payment_create.checkValidity().then(function(){

                    $scope.disabled_submit = true;
                    $scope.showPayment = false;
                    commissionImmediate.immediateCalc($scope.immediate_calc,function(data){
                        topAlert.success("計佣成功！");
                        $scope.immediate =angular.copy(data);
                        for(var immediates in $scope.immediate){
                            $scope.immediate_add[immediates] = $scope.immediate[immediates];
                        }
                        $scope.immediate_add.from_agent_id = $scope.immediate_calc.from_agent_id;
                        $scope.immediate_add.date =  $scope.immediate_calc.date;
//                        $scope.immediate_add.deposit_amount = "";
                        $scope.disabled_submit = false;//
                        $scope.showPayment = true;
                    },function(){
                        $scope.disabled_submit = false;
                        $scope.showPayment = false;
                    })
                });
            }
            $scope.$watch("immediate_add.discount + immediate_add.tax_rate",function(new_value,old_value){
                if($scope.immediate_add.discount && $scope.immediate_add.tax_rate){
                    $scope.immediate_add.should_commission = ($scope.immediate_add.rolling * ($scope.immediate_add.discount*10 - $scope.immediate_add.tax_rate)/10) - ($scope.immediate_add.negative_consumption*10000);
                    //$scope.immediate_add.actual_commission = parseInt($scope.immediate_add.should_commission/100)*100 ;
                    // $scope.immediate_add.omit_commission = ($scope.immediate_add.should_commission - $scope.immediate_add.actual_commission)%100;
                    $scope.immediate_add.actual_commission = parseInt($scope.immediate_add.should_commission) ;
                    $scope.immediate_add.omit_commission = parseFloat($scope.immediate_add.should_commission-$scope.immediate_add.actual_commission).toFixed(4);
                }

            })
            //重置
            $scope.reset = function(){
                $scope.agent_code= "";
                $scope.immediate ={};
                $scope.immediate_calc.pin_code ="";
                $scope.showPayment = false;
                $scope.immediate_add.discount ="";
                $scope.immediate_add.tax_rate = "";
                $scope.resetPayment();
            }
            //即出户口編號監控
            $scope.$watch('to_agent_code',globalFunction.debounce(function(new_value,old_value){
                if(new_value){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code:new_value}, {})).$promise.then(function (agents) {
                        if(agents.length > 0){
                            $scope.to_agent_name = agents[0].agent_name;
                            $scope.immediate_add.to_agent_id = agents[0].id;
                           depositCard.query(globalFunction.generateUrlParams({agent_info_id: agents[0].id})).$promise.then(function(cards){
                               $scope.cards = cards;
                               _.each($scope.cards,function(card){
                                    if(card.card_name == 'A'){
                                        $scope.immediate_add.depositcard_id = card.id;
                                        $scope.cardBalance();
                                    }
                                });
                            });
                            commissionCard.query(globalFunction.generateUrlParams({agent_info_id: agents[0].id})).$promise.then(function (commissionCards) {
                                $scope.commissionCards = commissionCards;
                                _.each($scope.commissionCards,function(card){
                                    if(card.card_name == 'A'){
                                        $scope.immediate_add.commission_card_id = card.id;
                                    }
                                });
                             });
                        }else{
                            $scope.to_agent_name = "";
                            $scope.immediate_add.to_agent_id ="";
                            $scope.cards=[];
                            $scope.commissionCards = [];
                        }
                    });
                }else{
                    $scope.to_agent_name = "";
                    $scope.immediate_add.to_agent_id ="";
                    $scope.cards =[];
                    $scope.commissionCards = [];
                }
            }));
            //根据不同的卡选择余额
            $scope.depositcard = {};
            $scope.cardBalance = function(){
                $scope.immediate_add.deposit_amount ="";
                $scope.immediate_add.allow_negative = "";
                if($scope.immediate_add.depositcard_id){
                    depositCard.get(globalFunction.generateUrlParams({id:$scope.immediate_add.depositcard_id},{})).$promise.then(function(card){
                        $scope.depositcard = card;
                        if($scope.depositcard){
                            $scope.immediate_add.deposit_amount = $scope.depositcard.usable_amount;
                            $scope.immediate_add.allow_negative = $scope.depositcard.allow_negative;
                        }
                    });
                }
            }
            //本月消費明細
            $scope.showLoan = function(){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/immediate-payment/payment-consumption-record.html",
                    controller: 'paymentConsumptionRecordCtrl',
                    windowClass:'lg-modal',
                    resolve: {
                        agent_code: function() {
                            return  $scope.agent_code;
                        },
                        year_month: function() {
                            return $scope.immediate_calc.year_month;
                        }
                    }
                });
            }

            //新增转移转码卡
            $scope.addRollingCard = function(){
                if($scope.immediate_add.to_agent_id){
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/immediate-payment/payment-record-card.html",
                        controller: 'paymentRecordCardCtrl',
                        resolve: {
                            agent_info_id: function() {
                                return  $scope.immediate_add.to_agent_id;
                            }
                        }
                    });
                    modalInstance.result.then((function(status) {
                        if(status){
                            commissionCard.query(globalFunction.generateUrlParams({agent_info_id:$scope.immediate_add.to_agent_id})).$promise.then(function (commissionCards) {
                                $scope.commissionCards = commissionCards;
                            });
                        }
                    }), function() {
                        $log.info("Modal dismissed at: " + new Date());
                    });
                }else{
                    topAlert.warning("請選擇即出戶口編號!");
                }

            };

            //是否勾选外馆列印
            $scope.hasOut = false;
            //不進行新增 直接列印顯示的內容
            $scope.display_print = function(){
                var agent = {
                    hall_name:$scope.user.hall.hall_name,
                    agent_code:$scope.agent_code,
                    agent_name:$scope.agent_name,
                    year_month:$scope.immediate_calc.year_month,
                    date:$scope.nowDate,
                    shift:$scope.shift_mark.shift,
                    agnet_code_consumption:$scope.agent_code,
                    year_month_consumption:$scope.immediate_calc.year_month,
                    hall_id:$scope.user.hall.id
                };

                var entity = get_immediate_add();

                //剩餘津貼 = 上月餘津-積分消費
                var _allowance_balance = entity.settlement_consumption - entity.integral_consumption;

                //处理API要求传送的参数名与实际参数不符的情况
                var _immediate_add = {
                    total_rolling:entity.rolling * 10000,
                    number : entity.discount,
                    tax:entity.tax_rate,
                    this_month_comsumption:entity.consumption,
                    last_month_allowance:entity.settlement_consumption,
                    practical_commission:entity.actual_commission,
                    allowance_balance:_allowance_balance,
                    integer_consumption:entity.integral_consumption,
                    commsiiion_consumption:entity.commission_consumption,
                    commission_record_id:""
                };

                entity = _.extend(entity,_immediate_add);
                var result =  _.extend(entity,agent);


                //即出与列印外馆消费都是promise异步的接口 使用then控制流程 确保即出与列印外馆消费正常使用
                var promisePaymentCreate = qzPrinter.print('PDFPaymentCreate', "", result).then(function () {
                    topAlert.success('列印即出成功');
                    $scope.disabled_add = false;
                    $scope.disabled_submit = false;
                }, function (msg) {
                    $scope.disabled_add = false;
                    $scope.disabled_submit = false;
                });

                promisePaymentCreate.then(function(){

                    if($scope.hasOut){
                        var is_true_record = {is_true:false};
                        result =  _.extend(result,is_true_record);




                        qzPrinter.print('PDFOutsideConsumption', "", result).then(function () {
                            topAlert.success('列印外馆消费成功');
                            $scope.disabled_add = false;
                            $scope.disabled_submit = false;
                        }, function (msg) {
                            $scope.disabled_add = false;
                            $scope.disabled_submit = false;
                        })
                    }

                });
            };

            //處理 $scope.immediate_add 并返回angular.copy后的對象
            var get_immediate_add = function(){
                var obj;
                $scope.immediate_add.year_month =$scope.immediate_calc.year_month;

                obj = angular.copy($scope.immediate_add);
                obj.should_commission = obj.should_commission/10000;
                obj.actual_commission = obj.actual_commission/10000;
                obj.omit_commission = obj.omit_commission/10000;

                obj.shift_date = obj.shift_date ? $filter("date")(obj.shift_date,'yyyy-MM-dd') : "";

                if(parseInt($filter('date')(new Date(obj.year_month), 'MM')) == parseInt($filter('date')(obj.shift_date, 'MM'))){
                    obj.shift_date = currentShift.data.shift_date;
                    obj.shift = currentShift.data.shift;
                }else if(parseInt($filter('date')(obj.year_month, 'MM')) < parseInt($filter('date')(obj.shift_date, 'MM')) || parseInt($filter('date')(obj.year_month, 'MM')) > parseInt($filter('date')(obj.shift_date, 'MM'))){
                    var date = obj.year_month.split('-');
                    obj.shift_date = getAppointDay(date[0], date[1], 1); //当前截月最后一天的前一天
                }



                /*if(typeof (obj.shift_date)=='string'){
                    obj.shift_date = obj.shift_date ? $filter('date')(new Date(obj.shift_date.replace(/\-/g, "\/")), 'yyyy-MM-dd') : "";
                }else{
                    obj.shift_date = obj.shift_date ? $filter("date")(obj.shift_date,'yyyy-MM-dd') : "";
                }*/
                return obj;
            };


            //新增計佣
            $scope.disabled_submit = false;
            $scope.addPayment = function(print){

                $scope.saveAgentCode = angular.copy($scope.agent_code);

                if($scope.disabled_submit){
                    return $scope.disabled_submit;
                }
                /*if(parseFloat($scope.immediate_add.negative_consumption*10000) > parseFloat($scope.immediate_add.should_commission)){
                    topAlert.warning("負消費不能大於應出佣金!");
                    return ;
                }*/
                if($scope.immediate_add.should_commission < 0){
                    topAlert.warning("負消費不能大於應出佣金!");
                    return ;
                }
                if(!$scope.depositcard.allow_negative && parseFloat($scope.immediate_add.deposit_amount*10000) < parseFloat($scope.immediate_add.should_commission)){
                    topAlert.warning("存卡餘額不能小於應出佣金!");
                    return ;
                }

                $scope.immediate_add_copy = get_immediate_add();
                $scope.form_payment_add.checkValidity().then(function(){
                    $scope.disabled_add = true;
                    $scope.disabled_submit = true;
                    commissionImmediate.immediateAdd($scope.immediate_add_copy,function(data){
                        topAlert.success("新增計佣成功！");

                        if(print === true) {

                            //即出与列印外馆消费都是promise异步的接口 使用then控制流程 确保即出与列印外馆消费正常使用
                            var promiseCommissionRecord = qzPrinter.print('PDFCommissionRecord',"", {'commission_record_id': data.id}).then(function () {
                                topAlert.success('列印即出成功');
                                $scope.disabled_add = false;
                                $scope.disabled_submit = false;
                            }, function () {
                                $scope.disabled_add = false;
                                $scope.disabled_submit = false;
                            });

                            promiseCommissionRecord.then(function(){

                                if($scope.hasOut){
                                    var paras = {
                                        agent_code: $scope.saveAgentCode,
                                        year_month: $scope.immediate_calc.year_month,
                                        commission_record_id:data.id,
                                        hall_id:$scope.user.hall.id,
                                        is_true:true
                                    };

                                    /*===========================================;
                                    paras;
                                    ===========================================;*/

                                    qzPrinter.print('PDFOutsideConsumption', "", paras).then(function () {
                                        topAlert.success('列印外馆成功');
                                        $scope.disabled_add = false;
                                        $scope.disabled_submit = false;
                                        //$location.path('/immediate-payment/commission-record');
                                    }, function (msg) {
                                        $scope.disabled_add = false;
                                        $scope.disabled_submit = false;
                                    });
                                }

                            });
                        }

                        $scope.disabled_add = false;
                        $scope.disabled_submit = false;
                        $scope.reset();

                        //2015-6-9 增加打印存卡

                        $scope.to_agent = _.findWhere($scope.cards,{id:$scope.immediate_add_copy.depositcard_id});
                        var print_record = {
                            id: data.card_record_id,
                            depositcard_id: $scope.immediate_add_copy.depositcard_id,
                            agent_code: $scope.to_agent.agent_code,
                            agent_name: $scope.to_agent.agent_name,
                            card_name: $scope.to_agent.card_name
                        };
//                        $scope.print_card("出佣存卡列印", print_record);

                    },function(){
                        $scope.disabled_add = false;
                        $scope.disabled_submit = false;
                    })
                });
            };

            //打印方法
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
                                });
                            });
                        }
                        //$location.path('/commission-calculate/commission-record');
                    });
                }else{
                    topAlert.warning('請選擇存卡');
                }
            };

            $scope.resetPayment = function(){
                $scope.immediate_add.pin_code = "";
                $scope.to_agent_code = "";
                $scope.immediate_add.discount = "";
                $scope.immediate_add.tax_rate = "";
                $scope.immediate_add.should_commission = "0";
                $scope.immediate_add.actual_commission = "0"
                $scope.immediate_add.omit_commission = "0";
                $scope.immediate_add.deposit_amount = "";
                $scope.immediate_add.remark = "";
            }

    }]).controller('paymentLoanCtrl',['$scope','tmsPagination','marker','id','$modalInstance',
        function($scope,tmsPagination,marker,id,$modalInstance){
            $scope.pagination_loan = tmsPagination.create();
            $scope.pagination_loan.resource = marker;
            $scope.pagination_loan.items_per_page =10;
            $scope.pagination_loan.query_method = "query";
            $scope.select_loan = function(page){
                    $scope.unRepayments = $scope.pagination_loan.select(page,{agent_info_id:id,status:"|3",only_current_hall:"0"});
            }
            $scope.select_loan();

            $scope.remove = function(){
                $modalInstance.close();
            }

    }]).controller('paymentConsumptionRecordCtrl',['$scope','consumption','tmsPagination','agent_code','year_month','$filter',
        function($scope,consumption,tmsPagination,agent_code,year_month,$filter){

            $scope.nowDate = $filter('date')(new Date(), 'yyyy-MM-dd');
            //初始化列表
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = consumption;
            $scope.condition = {
                agentInfo:{agent_code:""},
                year_month:[year_month]
            }
            if(agent_code){
                $scope.condition.agentInfo.agent_code = agent_code;
                $scope.consumptions = $scope.pagination.select(1, $scope.condition);
            }

     }]).controller('paymentRecordCardCtrl',['$scope','commissionCard','globalFunction','agent_info_id','$modalInstance','topAlert',
          function($scope,commissionCard,globalFunction,agent_info_id,$modalInstance,topAlert){
              $scope.form_create_card_url = globalFunction.getApiUrl('commissionsetting/commissioncard');
              $scope.card_record = {
                  "agent_info_id":agent_info_id,
                  "card_name": "",
                  "pin_code": ""
              }
              /**
               * 新增卡類型
               */
              $scope.disabled_submit = false;
              $scope.add = function () {
                  if($scope.disabled_submit){
                      return $scope.disabled_submit;
                  }
                  $scope.form_record_card_create.checkValidity().then(function() {
                      $scope.disabled_submit = true;
                      commissionCard.save($scope.card_record,function(){
                          topAlert.success("新增轉碼卡成功！");
                          $modalInstance.close(true);
                          $scope.disabled_submit = false;
                      },function(){
                          $scope.disabled_submit = false;
                      })
                  });
              }
              $scope.cancel = function(){
                  $modalInstance.close("");
              }

      }]).controller('commissionRecordCtrl',['$scope','commissionImmediate','agentsLists','globalFunction','tmsPagination','topAlert','pinCodeModal','breadcrumb','hallName','commissionRecordStatus','$location','$filter','goBackData',
          function($scope,commissionImmediate,agentsLists,globalFunction,tmsPagination,topAlert,pinCodeModal,breadcrumb,hallName,commissionRecordStatus,$location,$filter,goBackData){
              breadcrumb.items = [
                  {"name":"即出出佣記錄","active":true}
              ];
              $scope.halls = hallName.query({hall_type:"|1",sort:"hall_type asc"});

              $scope.commission_record_status = commissionRecordStatus;
              var init_condition ={
                  out_hall_id:"",
                  toAgent:{agent_code:""},
                  immediate_date: [""],
                  status:"",
                  shiftMark:{year_month: [""]}
              }
              $scope.condition = angular.copy(init_condition);
              $scope.condition = goBackData.get('condition',$scope.condition);
              //列表初始化数据
              $scope.pagination =tmsPagination.create();
              $scope.pagination.resource = commissionImmediate;
              $scope.select = function(page){
                  goBackData.set('condition',$scope.condition);
                  var conditions = angular.copy($scope.condition);
                  conditions.immediate_date[0] = $filter('date')($scope.condition.immediate_date[0], 'yyyy-MM-dd');
                  conditions.shiftMark.year_month[0] = $filter('date')($scope.condition.shiftMark.year_month[0], 'yyyy-MM');
                  if($scope.condition.toAgent.agent_code){
                      conditions.toAgent.agent_code = $scope.condition.toAgent.agent_code+"!";
                  }
                  $scope.commissionRecords = $scope.pagination.select(page,conditions);
              }
              $scope.select();
              $scope.reset = function(){
                  $scope.condition = angular.copy(init_condition);
                  $scope.select();
              }
              //删除
              $scope.delete = function(id){
                  pinCodeModal(commissionImmediate, 'delete', {id: id}, '刪除成功！').then(function () {
                      $scope.select();
                  })
              }
              //详细
              $scope.detail = function(id){
                  $location.path('/immediate-payment/payment-detail/'+id);
              }
              //生成出佣单
              $scope.immediateCommission = function(id){
                  if(id){
                      pinCodeModal(commissionImmediate, 'immediateCommission', {id: id}, '已成功生成出佣單！').then(function () {
                          $scope.select();
                      });
                  }
              }
    }]).controller('paymentDetailCtrl',['$scope','commissionImmediate','$stateParams','breadcrumb','$modal','$location','qzPrinter','printerType','topAlert',
        function($scope,commissionImmediate,$stateParams,breadcrumb,$modal,$location,qzPrinter,printerType,topAlert){
            breadcrumb.items = [
                {"name":"即出詳細","active":true}
            ];
            if($stateParams.id){
                $scope.payment = commissionImmediate.get({id:$stateParams.id});
            }
            $scope.showLoan = function(){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/immediate-payment/payment-consumption-record.html",
                    controller: 'paymentConsumptionRecordCtrl',
                    windowClass:'lg-modal',
                    resolve: {
                        agent_code: function() {
                            return  $scope.agent_code;
                        }
                    }
                });
            }
            $scope.return = function(){
                $location.path('/immediate-payment/commission-record');
            }

            //列印
            $scope.disable_print = false;
            $scope.print = function(){
                if($stateParams.id){
                    $scope.disable_print = true;
                    qzPrinter.print('PDFCommissionRecord',/*printerType.stylusPrinter*/"",{'commission_record_id':$stateParams.id}).then(function(){
                        topAlert.success('列印成功');
                        $scope.disable_print = false;
                    },function(msg){
                        $scope.disable_print = false;
                    })
                }
            }
      }]);

}).call(this);
