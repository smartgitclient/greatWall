/**
 * Created by Allen.zhang on 2014/8/4.
 */
(function() {
    'use strict';
    angular.module('app.shift-record.ctrls', ["app.shift-record.services"]).controller('shiftRecordManagerCtrl', ['$scope','shiftRecord','settlementMonth','hallName','tmsPagination','$stateParams','breadcrumb','getDate','$modal','$filter','$location','windowItems','topAlert','pinCodeModal','goBackData',
        function($scope,shiftRecord,settlementMonth,hallName,tmsPagination,$stateParams,breadcrumb,getDate,$modal,$filter,$location,windowItems,topAlert,pinCodeModal,goBackData) {
            //麵包屑導航
            breadcrumb.items = [
                {"name": "截更管理", "active": true}
            ];
            //自定義變量
            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });
            //查詢變量
            var original;
            var init_condition = {
                shiftMark:{shift_date: ['', '']},
                hall_id:""
            };
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.condition = goBackData.get('condition',$scope.condition);
            $scope.excel_condition = angular.copy(init_condition);

            //初始化列表數據
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = shiftRecord;
            $scope.select = function (page) {
                $scope.excel_condition = angular.copy($scope.condition);
                $scope.excel_condition.shiftMark.shift_date[0] = $filter('date')($scope.excel_condition.shiftMark.shift_date[0], 'yyyy-MM-dd');
                $scope.excel_condition.shiftMark.shift_date[1] = $filter('date')($scope.excel_condition.shiftMark.shift_date[1], 'yyyy-MM-dd');
//                $scope.excel_condition.hall_id = $scope.user.hall.id ? $scope.user.hall.id :"";
                $scope.shift_records = $scope.pagination.select(page,$scope.excel_condition);
            }
            $scope.select();

            //搜索方法
            $scope.search = function () {
                goBackData.set('condition',$scope.condition);
                $scope.select(1);
            }
            //重置查詢條件
            $scope.reset = function () {
                $scope.condition = angular.copy(original);
                $scope.select();
            }
            //shift-record detail
            $scope.detail = function (id) {
                $location.path('/shift-record/shift-record-detail/' + id);
            }
            $scope.delete = function(id){
                windowItems.confirm('系統提示','確定刪除此圍數嗎？',function() {
                    pinCodeModal(shiftRecord,'delete',{id:id},'刪除成功！').then(function(){
                        $scope.select();
                    })
                })
            }
            //新增围数
            $scope.addWeiShu = function () {
                $location.path('/shift-record/shift-record-create');
            }
            //截更
            $scope.jieGen = function (){
                pinCodeModal(shiftRecord,'setShiftRecord',{}).then(function(){
                    topAlert.success("截更成功！");
                    $scope.select();
                    $scope.$emit('afterChangeHall',function(event){
                        $scope.updateShiftMark();
                    });
                })
            }
            //月結
            $scope.monthly = function(){
                pinCodeModal(settlementMonth,'save',{}).then(function(){
                    topAlert.success("月結成功！");
                    $scope.select();
                })
            }

    }]).controller('shiftRecordDetailCtrl',['$scope','$filter','shiftRecord','hallName','shiftMark','$stateParams','breadcrumb','$location','qzPrinter','printerType','getDay','topAlert','user',
        function($scope,$filter,shiftRecord,hallName,shiftMark,$stateParams,breadcrumb,$location,qzPrinter,printerType,getDay,topAlert,user){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"截更管理","url":'/shift-record/shift-record-manager'},
                {"name":"截更詳細","active":true}
            ];
            //自定義變量
            $scope.excel_condition = {
                "shift_record_id":""
            }
            //根據id獲取圍數數據
            if($stateParams.id){
                $scope.shift_record = shiftRecord.get({id:$stateParams.id});
                $scope.excel_condition.shift_record_id = $stateParams.id;
            }
            $scope.depositboxTotal =function(){
                if( $scope.shift_record.depositbox_depositcash &&  $scope.shift_record.depositbox_cashcode){
                    $scope.shift_record.depositbox_total = parseFloat($scope.shift_record.shift_depositcashcode)+ parseFloat($scope.shift_record.depositbox_cashcode);
                }
            }

            $scope.rolling_compare_b = function(){
                var  rolling_compare;
                var rolling_compare1 = parseFloat($scope.shift_record.shift_depositspecialcode_b);
                var rolling_compare2 =(parseFloat($scope.shift_record.lastshift_depositspecialcode_b)+parseFloat($scope.shift_record.shift_buycode_b))-parseFloat($scope.shift_record.shift_rolling_b) ;
                if(rolling_compare1 == rolling_compare2){
                    rolling_compare = "0";
                }else{
                    rolling_compare =parseFloat((rolling_compare1 - rolling_compare2).toFixed(4));
                }
                $scope.shift_record.rolling_compare_b = rolling_compare;
                return rolling_compare;
            };

            $scope.rolling_compare_a = function(){
                var  rolling_compare;
                var rolling_compare1 = parseFloat($scope.shift_record.shift_depositspecialcode_a);
                var rolling_compare2 =(parseFloat($scope.shift_record.lastshift_depositspecialcode_a)+parseFloat($scope.shift_record.shift_buycode_a))-parseFloat($scope.shift_record.shift_rolling_a) ;
                if(rolling_compare1 == rolling_compare2){
                    rolling_compare = "0";
                }else{
                    rolling_compare =parseFloat((rolling_compare1 - rolling_compare2).toFixed(4));
                }
                $scope.shift_record.rolling_compare_a = rolling_compare;
                return rolling_compare;
            };

            $scope.rolling_compare = function(){
                var  rolling_compare;
                var rolling_compare1 = parseFloat($scope.shift_record.shift_depositspecialcode);
                var rolling_compare2 =(parseFloat($scope.shift_record.lastshift_depositspecialcode)+parseFloat($scope.shift_record.shift_buycode))-parseFloat($scope.shift_record.shift_rolling) ;
                if(rolling_compare1 == rolling_compare2){
                    rolling_compare = "0";
                }else{
                    rolling_compare =parseFloat((rolling_compare1 - rolling_compare2).toFixed(4));
                }
                $scope.shift_record.rolling_compare = rolling_compare;
                return rolling_compare;
            }

            $scope.amount_compare = function(){
                var amount_compare;
                var rolling_compare1 =(parseFloat($scope.shift_record.incase_amount)+parseFloat($scope.shift_record.borrow_amount))-parseFloat($scope.shift_record.loan_total);
                var rolling_compare2 =parseFloat($scope.shift_record.shift_depositspecialcode)+parseFloat($scope.shift_record.shift_depositcashcode)+parseFloat($scope.shift_record.depositbox_total) ;
                if(rolling_compare1 == rolling_compare2){
                    amount_compare = "0";
                }else{
                    amount_compare =parseFloat(( rolling_compare2 - rolling_compare1).toFixed(4));
                }
                $scope.shift_record.amount_compare = amount_compare;
                return amount_compare;
            }

            //return  List
            $scope.return = function(){
                $location.path('shift-record/shift-record-manager');
            }
            //列印
            $scope.disable_print = false;
            $scope.print = function(){
                $scope.data_time = $scope.shift_record.shift_date.split("-");
                $scope.shift_record_copy = angular.copy($scope.shift_record);
                $scope.shift_record_copy.amount_compared = "0";
                $scope.shift_record_copy.rolling_compared = "0";
                $scope.shift_record_copy.rolling_compare = "0";
                $scope.shift_record_copy.lastmonthMepositspecialcode = $scope.shift_record.lastmonth_depositspecialcode;
                $scope.shift_record_copy.lastshiftDepositspecialcode = $scope.shift_record.lastshift_depositspecialcode;
                $scope.shift_record_copy.hallName = user.hall.hall_name;
                $scope.shift_record_copy.shift = $scope.shift_record.shift;
                $scope.shift_record_copy.year_Month = $scope.data_time[0]+"年"+$scope.data_time[1]+"月";
                $scope.shift_record_copy.shift_date = getDay($scope.shift_record.shift_date);
                $scope.disable_print = true;
                $scope.shift_record_copy.borrow_amount =  $filter('parseTenThousand2')($scope.shift_record_copy.borrow_amount).replace(/,/g, '');
                $scope.shift_record_copy.depositbox_cashcode =  $filter('parseTenThousand2')($scope.shift_record_copy.depositbox_cashcode).replace(/,/g, '');
                $scope.shift_record_copy.depositbox_cashcode_a =  $filter('parseTenThousand2')($scope.shift_record_copy.depositbox_cashcode_a).replace(/,/g, '');
                $scope.shift_record_copy.depositbox_cashcode_b =  $filter('parseTenThousand2')($scope.shift_record_copy.depositbox_cashcode_b);
                $scope.shift_record_copy.depositbox_depositcash =  $filter('parseTenThousand2')($scope.shift_record_copy.depositbox_depositcash).replace(/,/g, '');
                $scope.shift_record_copy.depositbox_total =  $filter('parseTenThousand2')($scope.shift_record_copy.depositbox_total).replace(/,/g, '');
                $scope.shift_record_copy.depositcard_total =  $filter('parseTenThousand2')($scope.shift_record_copy.depositcard_total).replace(/,/g, '');
                $scope.shift_record_copy.depositticket_total =  $filter('parseTenThousand2')($scope.shift_record_copy.depositticket_total).replace(/,/g, '');
                $scope.shift_record_copy.incase_amount =  $filter('parseTenThousand2')($scope.shift_record_copy.incase_amount).replace(/,/g, '');
                $scope.shift_record_copy.lastday_depositspecialcode =  $filter('parseTenThousand2')($scope.shift_record_copy.lastday_depositspecialcode).replace(/,/g, '');
                $scope.shift_record_copy.lastmonthMepositspecialcode =  $filter('parseTenThousand2')($scope.shift_record_copy.lastmonthMepositspecialcode).replace(/,/g, '');
                $scope.shift_record_copy.lastmonth_depositspecialcode =  $filter('parseTenThousand2')($scope.shift_record_copy.lastmonth_depositspecialcode).replace(/,/g, '');
                $scope.shift_record_copy.lastmonth_depositspecialcode_a =  $filter('parseTenThousand2')($scope.shift_record_copy.lastmonth_depositspecialcode_a).replace(/,/g, '');
                $scope.shift_record_copy.lastmonth_depositspecialcode_b =  $filter('parseTenThousand2')($scope.shift_record_copy.lastmonth_depositspecialcode_b).replace(/,/g, '');
                $scope.shift_record_copy.lastshiftDepositspecialcode =  $filter('parseTenThousand2')($scope.shift_record_copy.lastshiftDepositspecialcode).replace(/,/g, '');
                $scope.shift_record_copy.lastshift_depositspecialcode =  $filter('parseTenThousand2')($scope.shift_record_copy.lastshift_depositspecialcode).replace(/,/g, '');
                $scope.shift_record_copy.lastshift_depositspecialcode_a =  $filter('parseTenThousand2')($scope.shift_record_copy.lastshift_depositspecialcode_a).replace(/,/g, '');
                $scope.shift_record_copy.lastshift_depositspecialcode_b =  $filter('parseTenThousand2')($scope.shift_record_copy.lastshift_depositspecialcode_b).replace(/,/g, '');
                $scope.shift_record_copy.loan_total =  $filter('parseTenThousand2')($scope.shift_record_copy.loan_total).replace(/,/g, '');
                $scope.shift_record_copy.shift_buycode =  $filter('parseTenThousand2')($scope.shift_record_copy.shift_buycode).replace(/,/g, '');
                $scope.shift_record_copy.shift_depositcashcode =  $filter('parseTenThousand2')($scope.shift_record_copy.shift_depositcashcode).replace(/,/g, '');
                $scope.shift_record_copy.shift_depositcashcode_a =  $filter('parseTenThousand2')($scope.shift_record_copy.shift_depositcashcode_a).replace(/,/g, '');
                $scope.shift_record_copy.shift_depositcashcode_b =  $filter('parseTenThousand2')($scope.shift_record_copy.shift_depositcashcode_b).replace(/,/g, '');
                $scope.shift_record_copy.shift_depositspecialcode =  $filter('parseTenThousand2')($scope.shift_record_copy.shift_depositspecialcode).replace(/,/g, '');
                $scope.shift_record_copy.shift_depositspecialcode_a =  $filter('parseTenThousand2')($scope.shift_record_copy.shift_depositspecialcode_a).replace(/,/g, '');
                $scope.shift_record_copy.shift_depositspecialcode_b =  $filter('parseTenThousand2')($scope.shift_record_copy.shift_depositspecialcode_b).replace(/,/g, '');
                $scope.shift_record_copy.shift_rolling =  $filter('parseTenThousand2')($scope.shift_record_copy.shift_rolling).replace(/,/g, '');
                $scope.shift_record_copy.thismonth_buycode =  $filter('parseTenThousand2')($scope.shift_record_copy.thismonth_buycode).replace(/,/g, '');
                $scope.shift_record_copy.thismonth_rolling =  $filter('parseTenThousand2')($scope.shift_record_copy.thismonth_rolling).replace(/,/g, '');
                $scope.shift_record_copy.transfer_total =  $filter('parseTenThousand2')($scope.shift_record_copy.transfer_total).replace(/,/g, '');
                $scope.shift_record_copy.shift_buycode_a =  $filter('parseTenThousand2')($scope.shift_record_copy.shift_buycode_a).replace(/,/g, '');
                $scope.shift_record_copy.shift_buycode_b =  $filter('parseTenThousand2')($scope.shift_record_copy.shift_buycode_b).replace(/,/g, '');
                $scope.shift_record_copy.thismonth_buycode_a =  $filter('parseTenThousand2')($scope.shift_record_copy.thismonth_buycode_a).replace(/,/g, '');
                $scope.shift_record_copy.thismonth_buycode_b =  $filter('parseTenThousand2')($scope.shift_record_copy.thismonth_buycode_b).replace(/,/g, '');
                $scope.shift_record_copy.thismonth_rolling_a =  $filter('parseTenThousand2')($scope.shift_record_copy.thismonth_rolling_a).replace(/,/g, '');
                $scope.shift_record_copy.thismonth_rolling_b =  $filter('parseTenThousand2')($scope.shift_record_copy.thismonth_rolling_b).replace(/,/g, '');
                $scope.shift_record_copy.shift_rolling_a =  $filter('parseTenThousand2')($scope.shift_record_copy.shift_rolling_a).replace(/,/g, '');
                $scope.shift_record_copy.shift_rolling_b =  $filter('parseTenThousand2')($scope.shift_record_copy.shift_rolling_b).replace(/,/g, '');
                qzPrinter.print('PDFShift',"",$scope.shift_record_copy).then(function(){
                    topAlert.success('列印成功');
                    $scope.disable_print = false;
                },function(){
                    $scope.disable_print = false;
                });
            }


    }]).controller('shiftRecordCreateCtrl',['$scope','breadcrumb','getDate','hallName','shiftMark','$location','shiftRecord','globalFunction','qzPrinter','printerType','getDay','topAlert','pinCodeModal','currentShift','user',
        function($scope,breadcrumb,getDate,hallName,shiftMark,$location,shiftRecord,globalFunction,qzPrinter,printerType,getDay,topAlert,pinCodeModal,currentShift,user){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"新增截更","active":true}
            ];
            hallName.query({"hall_type":2}).$promise.then(function(halls){
                $scope.halls = halls;
            });
            shiftMark.get().$promise.then(function(shift_mark){
                $scope.shift_mark =shift_mark;
            });

            $scope.isPhilippine = false;

            //定義變量
            $scope.shift_record_url = globalFunction.getApiUrl('shift/shiftrecord');
            $scope.shift_record={
                shift_depositspecialcode:"0",
                shift_depositspecialcode_a:"0",
                shift_depositspecialcode_b:"0",

                depositbox_depositcash:"0",

                shift_depositcashcode:"0",
                shift_depositcashcode_a:"0",
                shift_depositcashcode_b:"0",

                depositbox_cashcode:"0",
                depositbox_cashcode_a:"0",
                depositbox_cashcode_b:"0",

                depositbox_total:"0",
                pin_code:""
            };
            shiftRecord.createShiftRecord().$promise.then(function(shift_record){
                if(shift_record){
                    $scope.shift_record= shift_record;
                    $scope.shift_record.shift_depositspecialcode = "0";//本更餘特碼
                    $scope.shift_record.shift_depositcashcode ="0";//本更餘現碼
                    $scope.shift_record.depositbox_depositcash ="0";//存碼櫃餘現金
                    $scope.shift_record.depositbox_cashcode= "0";//存碼櫃餘現碼
                    $scope.shift_record.depositbox_total="0";//存碼櫃總數
                }

                $scope.isPhilippine = user.hall.id == "1AE7283167B57D1DE050A8C098155859";

            });

            var shift_depositspecialcode_calc = function(){
                var a = $scope.shift_record.shift_depositspecialcode_a ? $scope.shift_record.shift_depositspecialcode_a : 0;
                var b = $scope.shift_record.shift_depositspecialcode_b ? $scope.shift_record.shift_depositspecialcode_b : 0;
                $scope.shift_record.shift_depositspecialcode = a + b;
            };

            var shift_depositcashcode_calc = function(){
                var a = $scope.shift_record.shift_depositcashcode_a ? $scope.shift_record.shift_depositcashcode_a : 0;
                var b = $scope.shift_record.shift_depositcashcode_b ? $scope.shift_record.shift_depositcashcode_b : 0;
                $scope.shift_record.shift_depositcashcode = a + b;
            };

            var depositbox_cashcode_calc = function(){
                var a = $scope.shift_record.depositbox_cashcode_a ? $scope.shift_record.depositbox_cashcode_a : 0;
                var b = $scope.shift_record.depositbox_cashcode_b ? $scope.shift_record.depositbox_cashcode_b : 0;
                $scope.shift_record.depositbox_cashcode = parseFloat(a) + parseFloat(b);
            };

            $scope.$watch("shift_record.shift_depositspecialcode_a",globalFunction.debounce(function(value){
                if($scope.isPhilippine){
                    $scope.shift_record.shift_depositspecialcode_a = value  ? parseFloat(value) : 0;
                    shift_depositspecialcode_calc();
                }
            }));
            $scope.$watch("shift_record.shift_depositspecialcode_b",globalFunction.debounce(function(value){
                if($scope.isPhilippine) {
                    $scope.shift_record.shift_depositspecialcode_b = value ? parseFloat(value) : 0;
                    shift_depositspecialcode_calc();
                }
            }));

            $scope.$watch("shift_record.shift_depositcashcode_a",globalFunction.debounce(function(value){
                if($scope.isPhilippine) {
                    $scope.shift_record.shift_depositcashcode_a = value ? parseFloat(value) : 0;
                    shift_depositcashcode_calc()
                }
            }));

            $scope.$watch("shift_record.shift_depositcashcode_b",globalFunction.debounce(function(value){
                if($scope.isPhilippine) {
                    $scope.shift_record.shift_depositcashcode_b = value ? parseFloat(value) : 0;
                    shift_depositcashcode_calc();
                }
            }));

            $scope.$watch("shift_record.depositbox_cashcode_a",globalFunction.debounce(function(value){
                if($scope.isPhilippine) {
                    $scope.shift_record.depositbox_cashcode_a = parseFloat(value ? parseFloat(value) : 0);
                    depositbox_cashcode_calc();
                }
            }));

            $scope.$watch("shift_record.depositbox_cashcode_b",globalFunction.debounce(function(value){
                if($scope.isPhilippine) {
                    $scope.shift_record.depositbox_cashcode_b = parseFloat(value ? parseFloat(value) : 0);
                    depositbox_cashcode_calc();
                }
            }));

            $scope.$watch("shift_record.depositbox_depositcash",globalFunction.debounce(function(value){
                if($scope.isPhilippine) {
                    $scope.shift_record.depositbox_total = parseFloat(value) + ($scope.shift_record.depositbox_cashcode ? parseFloat($scope.shift_record.depositbox_cashcode) : 0);
                }
            }));

            $scope.$watch("shift_record.depositbox_cashcode",globalFunction.debounce(function(value){
                if($scope.isPhilippine) {
                    $scope.shift_record.depositbox_total = parseFloat(value) + ($scope.shift_record.depositbox_depositcash ? parseFloat($scope.shift_record.depositbox_depositcash) : 0) ;
                }
            }));


            $scope.depositboxTotal =function(){
                if( $scope.shift_record.depositbox_depositcash &&  $scope.shift_record.depositbox_cashcode){
                    $scope.shift_record.depositbox_total = (parseFloat($scope.shift_record.depositbox_depositcash)+ parseFloat($scope.shift_record.depositbox_cashcode)).toFixed(4);
                }
            };

            $scope.rolling_compare_a = function(){
                var rolling_compare1 = parseFloat($scope.shift_record.shift_depositspecialcode_a);
                var rolling_compare2 = (parseFloat($scope.shift_record.lastshift_depositspecialcode_a)+parseFloat($scope.shift_record.shift_buycode_a))-parseFloat($scope.shift_record.shift_rolling_a) ;
                if(rolling_compare1 == rolling_compare2){
                    $scope.shift_record.rolling_compare_a = "0";
                }else{
                    $scope.shift_record.rolling_compare_a =parseFloat(( rolling_compare1 - rolling_compare2).toFixed(4));
                    if(isNaN($scope.shift_record.rolling_compare_a)) {
                        $scope.shift_record.rolling_compare_a = "";
                    }
                }
            };

            $scope.rolling_compare_b = function(){
                var rolling_compare1 = parseFloat($scope.shift_record.shift_depositspecialcode_b);
                var rolling_compare2 = (parseFloat($scope.shift_record.lastshift_depositspecialcode_b)+parseFloat($scope.shift_record.shift_buycode_b))-parseFloat($scope.shift_record.shift_rolling_b) ;
                if(rolling_compare1 == rolling_compare2){
                    $scope.shift_record.rolling_compare_b = "0";
                }else{
                    $scope.shift_record.rolling_compare_b =parseFloat(( rolling_compare1 - rolling_compare2).toFixed(4));
                    if(isNaN($scope.shift_record.rolling_compare_b)) {
                        $scope.shift_record.rolling_compare_b = "";
                    }
                }
            };

            //轉碼對比
            $scope.rolling_compare = function(){
                var rolling_compare1 = parseFloat($scope.shift_record.shift_depositspecialcode);
                var rolling_compare2 =(parseFloat($scope.shift_record.lastshift_depositspecialcode)+parseFloat($scope.shift_record.shift_buycode))-parseFloat($scope.shift_record.shift_rolling) ;
                if(rolling_compare1 == rolling_compare2){
                    $scope.shift_record.rolling_compare = "0";
                }else{
                        $scope.shift_record.rolling_compare =parseFloat(( rolling_compare1 - rolling_compare2).toFixed(4));
                        if(isNaN($scope.shift_record.rolling_compare)) {
                            $scope.shift_record.rolling_compare = "";
                        }
                }
            };

            //銀頭對比
            $scope.amount_compare = function(){
                var rolling_compare1 =(parseFloat($scope.shift_record.incase_amount)+parseFloat($scope.shift_record.borrow_amount))-parseFloat($scope.shift_record.loan_total);
                var rolling_compare2 =parseFloat($scope.shift_record.shift_depositspecialcode)+parseFloat($scope.shift_record.shift_depositcashcode)+parseFloat($scope.shift_record.depositbox_total) ;
                if(rolling_compare1 == rolling_compare2){
                    $scope.shift_record.amount_compare = "0";
                }else{
                    $scope.shift_record.amount_compare = parseFloat((rolling_compare2 - rolling_compare1).toFixed(4))+"";
                    if(isNaN($scope.shift_record.amount_compare)) {
                        $scope.shift_record.amount_compare = "";
                    }

                }
            };

            //及時圍數截更
            $scope.jiegen = false;
            $scope.disabled_submit = false;
            $scope.saveJieGen = function(){
                if($scope.disabled_submit){
                    return $scope.disabled_submit;
                }

                var shift_record = angular.copy($scope.shift_record);

                shift_record.shift_depositspecialcode_a = shift_record.shift_depositspecialcode_a ? shift_record.shift_depositspecialcode_a : 0;
                shift_record.shift_depositspecialcode_b = shift_record.shift_depositspecialcode_b ? shift_record.shift_depositspecialcode_b : 0;
                shift_record.shift_depositcashcode_a = shift_record.shift_depositcashcode_a ? shift_record.shift_depositcashcode_a : 0;
                shift_record.shift_depositcashcode_b = shift_record.shift_depositcashcode_b ? shift_record.shift_depositcashcode_b : 0;
                shift_record.depositbox_cashcode_a = shift_record.depositbox_cashcode_a ? shift_record.depositbox_cashcode_a : 0;
                shift_record.depositbox_cashcode_b = shift_record.depositbox_cashcode_b ? shift_record.depositbox_cashcode_b : 0;

                $scope.disabled_submit = true;
                $scope.form_shift_record.checkValidity().then(function(){
                    shiftRecord.save(shift_record,function(){
                        topAlert.success("圍數成功！");
                        $scope.jiegen = true;
                        if($scope.isPhilippine){
                            $scope.rolling_compare_a();
                            $scope.rolling_compare_b();
                        }else{
                            $scope.rolling_compare();
                        }
                        $scope.amount_compare();
                        $scope.disabled_submit = false;
                    },function(){
                        if($scope.isPhilippine){
                            $scope.rolling_compare_a();
                            $scope.rolling_compare_b();
                        }else{
                            $scope.rolling_compare();
                        }
                        $scope.amount_compare();
                        $scope.jiegen = false;
                        $scope.disabled_submit = false;
                    });
                });
            }

            //
            $scope.disabled_submits = false;
            $scope.jieGen = function (){
                if($scope.disabled_submits){
                    return $scope.disabled_submits;
                }
                var obj = {shift : $scope.shift_mark.shift};
                $scope.disabled_submits = true;

                $scope.shift_record.shift_depositspecialcode_a = $scope.shift_record.shift_depositspecialcode_a ? $scope.shift_record.shift_depositspecialcode_a : 0;
                $scope.shift_record.shift_depositspecialcode_b = $scope.shift_record.shift_depositspecialcode_b ? $scope.shift_record.shift_depositspecialcode_b : 0;
                $scope.shift_record.shift_depositcashcode_a = $scope.shift_record.shift_depositcashcode_a ? $scope.shift_record.shift_depositcashcode_a : 0;
                $scope.shift_record.shift_depositcashcode_b = $scope.shift_record.shift_depositcashcode_b ? $scope.shift_record.shift_depositcashcode_b : 0;
                $scope.shift_record.depositbox_cashcode_a = $scope.shift_record.depositbox_cashcode_a ? $scope.shift_record.depositbox_cashcode_a : 0;
                $scope.shift_record.depositbox_cashcode_b = $scope.shift_record.depositbox_cashcode_b ? $scope.shift_record.depositbox_cashcode_b : 0;

                pinCodeModal(shiftRecord,'setShiftRecord', _.extend($scope.shift_record,obj),'截更成功').then(function(response){
//                    $scope.$emit('afterChangeHall');
                    currentShift.set(response);
                    $scope.jiegen = false;
                    $scope.disabled_submits = false;
                    $location.path('/shift-record/shift-record-manager');
                },function(){
                    $scope.disabled_submits = false;
                });
            }

            //列印
            $scope.disable_print = false;
            $scope.print = function(){
                $scope.data_time = $scope.shift_mark.year_month.split("-");
                $scope.shift_record_copy = angular.copy($scope.shift_record);
                $scope.shift_record_copy.amount_compared = "0";
                $scope.shift_record_copy.rolling_compared = "0";
                $scope.shift_record_copy.lastmonthMepositspecialcode = $scope.shift_record.lastmonth_depositspecialcode;
                $scope.shift_record_copy.lastshiftDepositspecialcode = $scope.shift_record.lastshift_depositspecialcode;
                $scope.shift_record_copy.hallName = user.hall.hall_name;
                $scope.shift_record_copy.shift = $scope.shift_mark.shift;
                $scope.shift_record_copy.year_Month = $scope.data_time[0]+"年"+$scope.data_time[1]+"月";
                $scope.shift_record_copy.shif_data = getDay($scope.shift_record.shift_data);
                $scope.disable_print = true;

                _.each($scope.shift_record_copy,function(value, key, list){
                    $scope.shift_record_copy[key] = value.toString();
                });
                /*printerType.stylusPrinter*/
                qzPrinter.print('PDFShift',"",$scope.shift_record_copy).then(function(){
                    topAlert.success('列印成功');
                    $scope.disable_print = false;
                },function(msg){
                    $scope.disable_print = false;
                });
            }

    }]).controller('shiftRecordMonthCtrl', ['$scope','shiftRecord','settlementMonth','shiftRecordMonthly','hallName','tmsPagination','$stateParams','breadcrumb','getDate','$modal','$filter','$location','windowItems','topAlert','pinCodeModal','$log',
            function($scope,shiftRecord,settlementMonth,shiftRecordMonthly,hallName,tmsPagination,$stateParams,breadcrumb,getDate,$modal,$filter,$location,windowItems,topAlert,pinCodeModal,$log) {
                //麵包屑導航
                breadcrumb.items = [
                    {"name": "截大數", "active": true}
                ];
                //自定義變量
                $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                    return hall.hall_type == 2;
                });
                //查詢變量
                var original;
                var init_condition = {
                    settlement_date:['', ''],
                    settlementMonth:{year_month:[""]}
                };
                original = angular.copy(init_condition);
                $scope.condition = angular.copy(init_condition);

                //初始化列表數據
                $scope.pagination = tmsPagination.create();
                $scope.pagination.resource = shiftRecordMonthly;
                $scope.select = function (page) {
                    $scope.condition.settlement_date[0] = $filter('date')($scope.condition.settlement_date[0], 'yyyy-MM-dd');
                    $scope.condition.settlement_date[1] = $filter('date')($scope.condition.settlement_date[1], 'yyyy-MM-dd');
                    $scope.condition.settlementMonth.year_month[0] = $filter('date')($scope.condition.settlementMonth.year_month[0], 'yyyy-MM');
                    $scope.shift_records = $scope.pagination.select(page,$scope.condition);
                }
                $scope.select();
                //搜索方法
                $scope.search = function () {
                    $scope.select();
                }
                //重置查詢條件
                $scope.reset = function () {
                    $scope.condition = angular.copy(original);
                    $scope.select();
                }
                //shift-record detail
                $scope.detail = function (id) {
                    $location.path('/shift-record/shift-record-detail/' + id);
                }
                $scope.delete = function(id){
                    windowItems.confirm('系統提示','確定刪除此圍數嗎？',function() {
                        pinCodeModal(shiftRecord,'delete',{id:id},'刪除成功！').then(function(){
                            $scope.select();
                        })
                    })
                }
                //新增围数
                $scope.addDaShu = function () {
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/shift-record/shift-record-monthly.html",
                        controller: 'shiftRecordMonthlyCtrl',
                        resolve: {
                            login_user : function(){
                                return $scope.user;
                            }
                        }

                    });
                    modalInstance.result.then((function(result){
                        if(result){
                            $scope.select();
                        }
                    }), function(){
                        $log.info("Modal dismissed at: " + new Date());
                    });
                }
                //截更
                $scope.jieGen = function (){
                    pinCodeModal(shiftRecord,'setShiftRecord',{}).then(function(){
                        topAlert.success("截更成功！");
                        $scope.$emit('afterChangeHall');
                    })
                }
                //月結
                $scope.monthly = function(){
                    pinCodeModal(settlementMonth,'save',{}).then(function(){
                        topAlert.success("月結成功！");
                        $scope.select();
                    })
                }
    }]).controller('shiftRecordMonthlyCtrl',['$scope','settlementMonth','$modalInstance','pinCodeModal','topAlert','currentShift','login_user',
        function($scope,settlementMonth,$modalInstance,pinCodeModal,topAlert,currentShift,login_user){
            $scope.user = login_user;
            $scope.shift_records ={pin_code:""};
            settlementMonth.shiftRecordMonthlys().$promise.then(function(shift_record){
                $scope.shift_record = shift_record;
            });
            $scope.disabled_submit = false;
            $scope.jieDaShu = function(){
                if($scope.disabled_submit){
                    return $scope.disabled_submit;
                }
                $scope.disabled_submit = true;
                settlementMonth.save($scope.shift_records,function(data){
                    $scope.shift_records.pin_code = "";
                    topAlert.success("截大數成功！");
                    $modalInstance.close(true);
                    $scope.$emit('afterChangeHall');
                    var shift_data = angular.copy(currentShift.data);
                    shift_data.year_month = data.year_month;
                    currentShift.set(shift_data);
                    $scope.disabled_submit = false;
                },function(){
                    $scope.disabled_submit = false;
                });
            }
            $scope.cancel = function(){
                $modalInstance.close(false);
            }
    }]).controller('shiftRecordDailyCtrl',['$scope','topAlert','shiftRecord','shiftRecordAgent','hallName','globalFunction','tmsPagination','breadcrumb','getDate','$filter','user','currentShift','qzPrinter','printerType',
        function($scope,topAlert,shiftRecord,shiftRecordAgent,hallName,globalFunction,tmsPagination,breadcrumb,getDate,$filter,user,currentShift,qzPrinter,printerType){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"日結詳情","active":true}
            ];
            $scope.hall_show = true;
            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });
            //判斷廳館為集團時
            if(user.isAllHall()){

                $scope.hall_show = !$scope.hall_show;
            }
            //查詢變量
            var original;
            var init_condition = {
                shift_date: [''],
                ring:user.isAllHall(),
                hall_id: $scope.user.hall.id,
                year_month_time:currentShift.data.year_month

            };
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.excel_condition = angular.copy(init_condition);
            $scope.condition.shift_date[0] = currentShift.data.shift_date;

            //數據初始化
            $scope.set_tlement_date = {
                settlement_date: [''],
                hall_id:'',
                ring:''
            };
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = shiftRecordAgent;
            $scope.select =function(page){
                if($scope.condition.ring){
                    $scope.pagination.query_method = "insideHallsAgentShiftRecords";
                }else{
                    $scope.pagination.query_method = "hallAgentShiftRecords";
                }
                $scope.set_tlement_dates =  $scope.pagination.select(page,$scope.set_tlement_date);
            }
            $scope.search = function(){
                $scope.condition.shift_date[0] = $filter('date')($scope.condition.shift_date[0], 'yyyy-MM-dd');
                $scope.set_tlement_date.settlement_date[0] =  $filter('date')($scope.condition.shift_date[0], 'yyyy-MM-dd');
                $scope.set_tlement_date.hall_id =  $scope.condition.hall_id;
                $scope.set_tlement_date.ring =  $scope.condition.ring;
                $scope.excel_condition = angular.copy($scope.condition);

                if($scope.condition.hall_id || !user.isAllHall() || $scope.condition.ring === true)
                    $scope.hall_show = true
                else
                    $scope.hall_show = false

                if($scope.condition.ring){
                    shiftRecord.insideHallsShiftRecords(globalFunction.generateUrlParams($scope.condition,{})).$promise.then(function(shift_record){
                        if(shift_record){
                            $scope.shift_record = shift_record;
                        }else{
                            $scope.shift_record ={};
                        }
                    });
                }else{
                    shiftRecord.hallShiftRecords(globalFunction.generateUrlParams($scope.condition,{})).$promise.then(function(shift_record){
                        if(shift_record){
                            $scope.shift_record = shift_record;
                        }else{
                            $scope.shift_record ={};
                        }
                    });

                }
                if(!$scope.condition.hall_id){
                    $scope.condition.hall_id = $scope.user.hall.id;
                }
                $scope.select();
            }
            $scope.search();

            //列印日結詳細
            $scope.isDisabled = false;
            $scope.PDFShiftMarkDayRecord = function(){
                $scope.excel_condition.hall_id = $scope.condition.hall_id;
                var hall_data = _.findWhere($scope.halls,{id:$scope.condition.hall_id});
                $scope.excel_condition.hall_name = hall_data ?  hall_data.hall_name : "";
                if($scope.isDisabled){return;}
                $scope.isDisabled = true;
                //打印還款單
                qzPrinter.print('PDFShiftMarkDayRecord',"",globalFunction.generateUrlParams($scope.excel_condition,{})).then(function(){
                    topAlert.success('日結詳細列印成功');
                    $scope.isDisabled = false;
                },function(){
                    $scope.isDisabled = false;
                })
            }

            $scope.reset =function(){
                $scope.condition = angular.copy(original);
                $scope.condition.shift_date[0] = currentShift.data.shift_date;
                $scope.search();
            }
            }]);
}).call(this);
