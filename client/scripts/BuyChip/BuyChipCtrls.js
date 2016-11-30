(function() {
    'use strict';
    angular.module('app.buy-chip.ctrls', ["app.buy-chip.services"]).controller('buyChipManagerCtrl', [
    '$scope','buyChips','hallName','tmsPagination','globalFunction','shiftMark','getDate','breadcrumb','$modal','$filter','topAlert','windowItems','pinCodeModal','currentShift','chipsType','user',
        function($scope,buyChips,hallName,tmsPagination,globalFunction,shiftMark,getDate,breadcrumb,$modal,$filter,topAlert,windowItems,pinCodeModal,currentShift,chipsType,user){
            //麵包屑導航
            breadcrumb.items = [
              {"name":"買碼管理","active":true}
            ];
            //自定義變量
            $scope.nowDate = getDate(new Date());

            $scope.chips_types = chipsType;

           shiftMark.get().$promise.then(function(shift_mark){
               $scope.shift_mark =shift_mark;
           });
            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                return hall.hall_type != 1;
            });
            $scope.buychips_url = globalFunction.getApiUrl('buychips/buychips');
            $scope.show_detele = true;
            //查詢變量
            var original;
            var init_condition = {
                buy_chips_no: '',
                shift:"",
                shiftMark:{shift_date:['',''],year_month:[currentShift.data.year_month]},
                chips_type:""
            };
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.excel_condition = angular.copy(init_condition);
            var conditions ;
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = buyChips;
            $scope.select = function(page){
                if(page == 1){
                    $scope.show_detele = true;
                }else{
                    $scope.show_detele = false;
                }
                $scope.condition.shiftMark.year_month[0] = $scope.condition.shiftMark.year_month[0]?$filter('date')($scope.condition.shiftMark.year_month[0], 'yyyy-MM'):'';
                $scope.condition.shiftMark.shift_date[0] = $scope.condition.shiftMark.shift_date[0]?$filter('date')($scope.condition.shiftMark.shift_date[0], 'yyyy-MM-dd'):'';
                $scope.condition.shiftMark.shift_date[1] = $scope.condition.shiftMark.shift_date[1]?$filter('date')($scope.condition.shiftMark.shift_date[1], 'yyyy-MM-dd'):'';
                conditions = angular.copy($scope.condition);
                $scope.excel_condition = angular.copy(conditions);
                if(conditions.buy_chips_no != ''){
                    conditions.buy_chips_no = conditions.buy_chips_no+"!";
                }
                $scope.buyChips =  $scope.pagination.select(page,conditions,{'shiftMark':{}});
                var conditions_total = {
                    buy_chips_no:$scope.condition.buy_chips_no,
                    shift:$scope.condition.shift,
                    hall_id:$scope.condition.hall_id,
                    shift_date:[$scope.condition.shiftMark.shift_date[0],$scope.condition.shiftMark.shift_date[1]],
                    year_month:[$scope.condition.shiftMark.year_month[0]],
                    chips_type: $scope.condition.chips_type
                };
                $scope.chipsTotal = buyChips.getBuyChipsTotal(globalFunction.generateUrlParams(conditions_total,{}));
            }
            $scope.select(1);
            //搜索方法
            $scope.search = function(){
                $scope.select(1);
            }
            //重置查詢條件
            $scope.reset = function() {
                $scope.condition = angular.copy(original);
                $scope.select();
            }

            //定義變量
            var original_buychips;
            $scope.buychip = {
                "buy_chips_no":"",
                "amount":"",
                "hall_id":"",
//                "outside_chips":"",
                "pin_code":"",
                "chips_type":user.hall.id == '27115D48C5F726D6E050A8C098150716'?"2":"1"
            };
            original_buychips = angular.copy($scope.buychip);

            //新增买码
            $scope.disabled_submit = false;
            $scope.add = function(){
                if($scope.disabled_submit){
                    return $scope.disabled_submit;
                }
                if(!$scope.buychip.outside_chips){
                    $scope.buychip.outside_chips = '0';
                }
                $scope.form_buychips_create.checkValidity().then(function() {
                    $scope.disabled_submit = true;

                    var buychip = angular.copy($scope.buychip);

                    if(user.hall.id != '1AE7283167B57D1DE050A8C098155859' && user.hall.id != '27115D48C5F726D6E050A8C098150716'){
                        delete buychip.chips_type;
                    }

                    buyChips.save(buychip, function () {
                        topAlert.success("添加成功！");
                        $scope.select(1);
                        $scope.reset_buychips();
                        $scope.disabled_submit = false;
                    },function(){
                        $scope.disabled_submit = false;
                    });
                })
            }
            $scope.reset_buychips = function(){
                $scope.buychip = angular.copy(original_buychips);
                $scope.form_buychips_create.clearErrors();
            }

            //删除
           $scope.detele = function(id){
               windowItems.confirm('系統提示','確定刪除此買碼記錄嗎？',function() {
                   pinCodeModal(buyChips,'delete',{id:id},'刪除成功！').then(function(){
                       $scope.select(1);
                   })
               })
           }

      }]);
}).call(this);
