(function() {
  'use strict';
  angular.module('app.mortgage.ctrls', ["app.mortgage.services"])
     .controller('mortgageCreateCtrl',['$scope','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','marker','agentsLists','depositCard','hallName','mortgageRecords','mortgageTypes',
          function($scope,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,marker,agentsLists,depositCard,hallName,mortgageRecords,mortgageTypes){

          breadcrumb.items = [
              {"name":"新增抵押","active":true}
          ];
          //當前廳
          $scope.selectd_hall = hallName.getHall();
          //當前時間
          $scope.now_date = getDate();
          $scope.isDesabled = false;

          var init_record_create = {
              "pin_code":"",
              "mortgagor_id": "", //抵押方
              "mortgage_amount": 0,
              "mortgage_type":"", //1本線抵押/0外線抵押
              "is_release": 1,   //1為釋放，0為不釋放
              "remark": "",
              "card_id": ""
              //"mortgages": ""
          }
          $scope.record_create = angular.copy(init_record_create);

          var init_condition = {
              "only_current_hall": "0",
              "agentGroup.agent_group_name": "",
              "agent_info_id": "",
              "status": "|3", //沒有已還款
              "not_mortgage": "|0",
              "sort": "loanBusiness.agent_code NUMASC,loanBusiness.loan_time DESC"
          }
          $scope.condition = angular.copy(init_condition);
          $scope.pagination = tmsPagination.create();
          $scope.pagination.resource = marker;
          $scope.select = function(page){
              $scope.pagination.select(page,globalFunction.generateUrlParams($scope.condition,{loanBusiness:{}})).$promise.then(function(markers){
                  $scope.markers = markers;

                  var marker_ids =  _.uniq(_.pluck($scope.mortgage_ids,'id'));
                  _.each(markers,function(marker){
                      if(_.indexOf(marker_ids,marker.id)!=-1){
                          //如果金额为空
                          //if($scope.mortgage_ids['key_'+marker.id].amount) {
                              marker.disabled = $scope.mortgage_ids['key_'+marker.id].type == 1 ? true : false;
                              marker.all_mortgage = marker.disabled;
                              marker.sect_mortgage = !marker.all_mortgage;
                              marker.mortgage_money = $scope.mortgage_ids['key_'+marker.id].amount;

                          //}
                      }else{
                          marker.disabled = true;
                      }
                  });
                  $scope.isCheckedAll = false;
              });
          }

          $scope.markers = [];
          $scope.search = function(){
              $scope.record_create.mortgage_amount = 0;
              $scope.mortgage_ids = {};
              if($scope.condition.agentGroup && $scope.condition.agentGroup.agent_group_name){
                  $scope.select(1);
              }
          }

          //通過Agent_code查詢戶口名稱Public
           /*function findAgentNameFunc(val){
              agentsLists.query({agent_code : val}).$promise.then(function(agents){
                  if(agents){
                      return agents[0];
                  }
                  return false;

              });
          }*/

          //查詢抵押方信息
          $scope.$watch('agent_code',globalFunction.debounce(function(new_value,old_value){
              $scope.record_create.mortgagor_id ="";
              $scope.record_create.card_id = "";
              $scope.mortgagor_name = "";
              $scope.transaction_amount =0;
              $scope.depositCards = [];
              $scope.agent_type="";

              if(new_value){
                  agentsLists.query({agent_code : new_value}).$promise.then(function(agents){
                      if(agents[0]){
                          $scope.agent_type = agents[0].type;
                          $scope.record_create.mortgagor_id = agents[0].id;
                          $scope.mortgagor_name = agents[0].agent_name;
                          depositCard.query({agent_code:new_value}).$promise.then(function(depositCards){
                              $scope.depositCards = depositCards;
                              _.each($scope.depositCards,function(card){
                                  if(card.card_name == 'A'){
                                      $scope.record_create.card_id = card.id;
                                      $scope.findAmount($scope.record_create.card_id);
                                  }
                              });
                          });
                      }
                  });
              }

          }));

          //查詢存卡金額
          $scope.transaction_amount = 0;
          $scope.findAmount = function(card_id) {
              if (card_id) {
                  $scope.record_create.card_id = card_id;
                  var mortgage_data = _.findWhere($scope.depositCards, {id: card_id});
                  $scope.transaction_amount = mortgage_data.usable_amount;
              }else{
                  $scope.transaction_amount = 0;
              }
          }

          //通過戶組查詢下級戶口
          $scope.$watch('condition.agentGroup.agent_group_name',globalFunction.debounce(function(new_value,old_value){
              if(new_value) {
                  $scope.condition.agent_info_id = "";
                  //if (checkUppercase(new_value)) {
                      var agent_groups = mortgageRecords.loanAgent({'agent_group': new_value, sort:'agent_code asc'});
                      if (agent_groups) {
                          $scope.agent_groups = agent_groups;
                      }else{
                          $scope.agent_groups = agent_groups;
                          $scope.condition.agent_info_id = "";
                      }
                 // }
              }
          }));

          //查詢本線路還是內線
          $scope.mortgageTypesStatus = mortgageTypes.items;
          $scope.$watch('record_create.mortgagor_id + condition.agentGroup.agent_group_name',globalFunction.debounce(function(new_value,old_value){
              if($scope.record_create.mortgagor_id && $scope.condition.agentGroup && $scope.condition.agentGroup.agent_group_name)
                 mortgageRecords.mortgageType({mortgagor_id:$scope.record_create.mortgagor_id, agent_group:$scope.condition.agentGroup.agent_group_name})
                     .$promise.then(function(mortgage_type){
                         $scope.record_create.mortgage_type = mortgage_type.mortgage_type;
                         if(mortgage_type.mortgage_type==0){  //外线抵押不能释放签额
                             $scope.record_create.is_release = 0; //否
                         }else{
                             $scope.record_create.is_release = 1; //是
                         }
                     });
          }));

          //搜索 - 查詢Agent_name
          $scope.findSearchAgentName = function(agent_info_id){
              if (agent_info_id) {
                  var searchAgent_data = _.findWhere($scope.agent_groups, {id: agent_info_id});
                  $scope.search_agent_name = searchAgent_data.agent_name;
              }else{
                  $scope.search_agent_name = "";
              }
          }

          //部分抵押金額加入计算
          $scope.settingMortgageAmount = function(marker){
              marker.mortgage_amount_monney = Number(marker.mortgage_amount_monney)>Number(marker.not_mortgage)
                  ? marker.not_mortgage : marker.mortgage_amount_monney;

              marker.mortgage_amount_monney = Number(marker.mortgage_amount_monney)>=0
                  ? marker.mortgage_amount_monney : "";

              if($scope.mortgage_ids["key_"+marker.id]){
                  $scope.mortgage_ids["key_"+marker.id].amount = marker.mortgage_amount_monney;
              }
              $scope.record_create.mortgage_amount =  _.reduce($scope.mortgage_ids, function(memo, num){
                  return memo + Number(num.amount);
              }, 0);
          }

          //全部抵押
          $scope.isCheckedAll = false;
          $scope.checkedAll = function(){
              if($scope.isCheckedAll) {
                  var amount_sum = 0;
                  _.each($scope.markers, function (marker) {
                      if(marker.marker_amount == marker.not_mortgage)
                      {
                          marker.all_mortgage = true;
                      }
                      else
                      {
                          marker.sect_mortgage = true;
                      }
                      marker.mortgage_amount_monney = marker.not_mortgage;
                      $scope.mortgage_ids['key_'+marker.id] = {marker_id:marker.id, is_all:1, amount:marker.mortgage_amount_monney}
                      amount_sum += Number(marker.not_mortgage);
                  });

                  $scope.record_create.mortgage_amount = amount_sum;
              }else{
                  _.each($scope.markers, function (marker) {
                      if(marker.marker_amount == marker.not_mortgage)
                      {
                          marker.all_mortgage = false;
                      }
                      else
                      {
                          marker.sect_mortgage = false;
                      }
                      delete $scope.mortgage_ids['key_'+marker.id];
                      marker.mortgage_amount_monney = "";
                  });
                  $scope.record_create.mortgage_amount = 0;
              }
          }


          $scope.mortgage_ids = {}; //選中需要抵押的貸款
          $scope.checked = function(marker,type){
              marker.mortgage_amount_monney = marker.not_mortgage==undefined || marker.not_mortgage=="" ? marker.not_mortgage : 0;
              if(type=='all'){
                  if(marker.all_mortgage){ //選擇全部抵押
                      if(marker.sect_mortgage){
                          $scope.record_create.mortgage_amount = $scope.record_create.mortgage_amount - Number($scope.mortgage_ids['key_'+marker.id].amount);
                      }
                      marker.sect_mortgage = false;
                      marker.disabled = true;
                      marker.mortgage_amount_monney =  marker.not_mortgage;

                      $scope.record_create.mortgage_amount += Number(marker.not_mortgage);

                      //記住選中抵押信息
                      $scope.mortgage_ids['key_'+marker.id] = {marker_id:marker.id, is_all:1, amount:marker.mortgage_amount_monney}

                  }else{ //取消全部抵押
                      $scope.record_create.mortgage_amount = $scope.record_create.mortgage_amount - Number(marker.not_mortgage);
                      marker.disabled = true;
                      marker.mortgage_amount_monney = "";

                      //刪除選中的信息
                      delete $scope.mortgage_ids['key_'+marker.id];
                  }

              }else{
                  if(marker.sect_mortgage){//選擇部分抵押
                      if(marker.all_mortgage) {
                          $scope.record_create.mortgage_amount = $scope.record_create.mortgage_amount - Number(marker.not_mortgage);
                      }
                      $scope.record_create.mortgage_amount += Number(marker.mortgage_amount_monney);
                      marker.all_mortgage = false;
                      marker.disabled = false;
                      marker.mortgage_amount_monney = "";

                      //記住選中抵押信息
                      $scope.mortgage_ids['key_'+marker.id] = {marker_id:marker.id, is_all:0, amount:marker.mortgage_amount_monney}

                  }else{
                      marker.disabled = true;
                      //刪除選中的信息
                      delete $scope.mortgage_ids['key_'+marker.id];
                      marker.mortgage_amount_monney =  "";

                      //$scope.record_create.mortgage_amount =  $scope.record_create.mortgage_amount-Number(marker.mortgage_amount_monney);
                      $scope.record_create.mortgage_amount =  _.reduce($scope.mortgage_ids, function(memo, num){
                          return memo + Number(num.amount);
                      }, 0)
                  }
              }
              //$scope.mortgage_ids = angular.copy($scope.mortgage_ids);
          }

          $scope.mortgage_url =  globalFunction.getApiUrl('mortgage/mortgage');
          $scope.authorization = function(){
              if($scope.isDesabled){return ;}
              $scope.isDesabled = true;
              $scope.form_mortgage.checkValidity().then(function() {
                  /*if($scope.agent_type==3){
                      topAlert.warning("下線不能抵押貸款");
                      return;
                  }*/
                  var mortgages_content = [];
                  var amount_sum = 0;
                  _.each($scope.mortgage_ids,function(mortgage,index){
                      /*if(mortgage.amount=="" || mortgage.amount==0 || mortgage.amount==undefined){
                          topAlert.warning("存在沒有輸入金額的抵押貸款單");
                          return;
                      }else if(mortgage.amount<0){
                          topAlert.warning("貸款單抵押金額存在金額小於0");
                          return;
                      }*/
                      amount_sum+= Number(mortgage.amount);
                      mortgages_content.push(mortgage)
                  });
                  $scope.record_create.mortgage_amount = amount_sum+"";
                  $scope.record_create.agent_code = $scope.agent_code;
                  $scope.record_create.mortgages = mortgages_content;
                  if($scope.record_create.mortgage_amount==0 || $scope.record_create.mortgage_amount==""){
                      topAlert.warning("請選擇抵押貸款單");
                      //return;
                  }
                  mortgageRecords.save($scope.record_create).$promise.then(function () {
                      $scope.isDesabled = false;
                      topAlert.success("新增抵押成功");
                      //清空操作密碼
                      $scope.mortgagor_name = "";
                      $scope.transaction_amount =0;
                      $scope.depositCards = [];
                      $scope.agent_type = "";
                      $scope.agent_code = "";
                      $scope.condition.agentGroup.agent_group_name = "";
                      $scope.agent_groups = [];
                      $scope.record_create = angular.copy(init_record_create);
                      $scope.markers = [];

                      $scope.form_mortgage.clearErrors();
                  },function(result){
                      $scope.isDesabled = false;
                      if(result.data.mortgage_amount) {
                         // _.each(result.data, function (msg) {
                              topAlert.warning(result.data.mortgage_amount);
                          //});
                      }
                      if(result.message){
                          topAlert.warning(result.message);
                      }
                  });
              });

              //return false;
              /* var modal_instance;
              modal_instance = $modal.open({
               templateUrl: "views/mortgage/mortgage-authorization.html",
               controller: 'mortgageAuthorizationCtrl',
               resolve: {
               mortgagor_name:function(){
               return $scope.mortgagor_name;
               }/*,
               mortgage_record: function () {
               return $scope.record_create;
               }
               }
               });*/
              /*modal_instance.result.then(function(){
               //新增抵押

               mortgageRecords.save($scope.record_create).$promise.then(function () {
               $scope.search();
               topAlert.success("新增抵押成功");
               });
               });*/
          }

          $scope.reset = function(){
              $scope.record_create = angular.copy(init_record_create);
              $scope.mortgagor_name = "";
              $scope.transaction_amount = 0;
              $scope.agent_code = "";

              $scope.condition = angular.copy(init_condition);
              $scope.mortgage_ids = {};
              $scope.markers = [];
          }

  }]).controller('mortgageDetailCtrl',['$scope','breadcrumb', 'tmsPagination', 'globalFunction', '$stateParams', 'mortgageRecords', 'mortgageTypes' ,function($scope, breadcrumb, tmsPagination, globalFunction, $stateParams, mortgageRecords, mortgageTypes){
          breadcrumb.items = [
              {"name":"抵押記錄","url":'mortgage/mortgage-list'},
              {"name":"抵押詳細","active":true}
          ];

          $scope.mortgage_types = mortgageTypes.items;


          mortgageRecords.get(globalFunction.generateUrlParams({ id : $stateParams.id}, {mortgageMarker : { marker : "" }})).$promise.then(function(data)
          {
              $scope.mortgage_record = data
          });


  }]).controller('mortgageDetail_M_Ctrl',['$scope','breadcrumb', 'tmsPagination', 'globalFunction', '$stateParams', 'mortgageRecords', 'mortgageTypes','pinCodeModal', 'topAlert',   function($scope, breadcrumb, tmsPagination, globalFunction, $stateParams, mortgageRecords, mortgageTypes, pinCodeModal, topAlert){
          breadcrumb.items = [
              {"name":"抵押記錄","url":'mortgage/mortgage-list'},
              {"name":"抵押回M","active":true}
          ];

          $scope.mortgage_types = mortgageTypes.items;

          function Get_mortgage_record()
          {
              mortgageRecords.get(globalFunction.generateUrlParams({ id : $stateParams.id}, {mortgageMarker : { marker : "" }})).$promise.then(function(data)
              {
                  $scope.mortgage_record = data
              });
          }
          Get_mortgage_record();

          $scope.select_all = false;
          $scope.check_true = [];
          $scope.check_false = [];

          $scope.check_all = function()
          {
              $scope.check_true = [];
              $scope.check_false = [];

              _.each($scope.mortgage_record.mortgageMarker,  function(mortgage_record)
              {
                  mortgage_record.selected = $scope.select_all;
                  if($scope.select_all && 0 === Number(mortgage_record.is_return_m))
                  {
                      $scope.check_true.push(mortgage_record.id);
                  }
              })
          }


          $scope.check_mortgage = function(item)
          {
              var id = item.id;
              if($scope.select_all) //全选
              {
                  if(item.selected) // 选中
                  {
                      $scope.check_false = _.without($scope.check_false, id);
                      if(-1 === _.indexOf($scope.check_true, id))
                      {
                          $scope.check_true.push(id);
                      }
                  }
                  else
                  {
                      $scope.check_false.push(id);
                      $scope.check_true = _.without($scope.check_true, id);
                  }
              }
              else
              {
                  if(item.selected)
                  {
                      $scope.check_true.push(id);
                      $scope.check_false = _.without($scope.check_false, id);
                  }
                  else
                  {
                      $scope.check_true = _.without($scope.check_true, id);
                  }
              }
          }

          //凍結回M 按鈕
          $scope.freeze = function()
          {
              pinCodeModal(mortgageRecords, 'mortgageReturnM', {refs: $scope.check_true}, '凍結回M成功！').then(function(){
                  Get_mortgage_record();
              });
          }



      }]).controller('mortgageListCtrl',['$scope','$location','breadcrumb', 'goBackData', 'tmsPagination', 'globalFunction', 'refMortgageMarker','marker', 'mortgageMethods', '$filter', '$modal','pinCodeModal','hallName','getDate',
          function($scope, $location, breadcrumb, goBackData, tmsPagination, globalFunction, refMortgageMarker,marker, mortgageMethods, $filter,$modal, pinCodeModal,hallName,getDate){
          breadcrumb.items = [
              {"name":"抵押記錄","active":true}
          ];

          //當前廳
          $scope.selectd_hall = hallName.getHall();
          $scope.halls = hallName.query({hall_type:"|1",sort:"hall_type asc"});

          var original;
          var condition_base = {
              is_all_mortgage: "",
              agentGroup:{agent_group_name:""},
              mortgage: {
                  hall_id: "",
                  //mortgage_no : "",
                  mortgage_time:["",""],
                  agent_code : "",
                  shiftMark: {
                      year_month: "",
                      shift_date: ["",""]
                  }
              },
              marker:{
                  hall_id: "",
                  marker_seqnumber: "",
                  loanBusiness : {
                      agent_code : ""
                  }
              },
              sort: "marker.loanBusiness.agent_code NUMASC,mortgage.mortgage_time DESC"
          };
          original = angular.copy(condition_base);
          $scope.condition = angular.copy(condition_base);
          $scope.condition = goBackData.get('condition',$scope.condition);
          $scope.total = "";
          //给search 查询字段 加上 !{id}!
          // @obj 需要修改值的对象
          // @key_arr 1.数组 需要改变的值的数组， 2. true 所有值都需要改
          /*function addSearchCode(obj, key_arr)
          {
              _.each(obj, function(value, key, list)
              {
                  var new_value = '';
                  if('object' == typeof(value))
                  {
                      var new_obj = addSearchCode(value, key_arr);
                  }
                  else
                  {
                      if("" !== value && (true === key_arr ||-1 !== _.indexOf(key_arr, key)))
                      {
                          new_value = '!' + value + '!';
                          obj[key] = new_value;
                      }
                  }
              })
              return obj;
          }*/

          $scope.mortgageMethods = mortgageMethods.items;
          $scope.pagination = tmsPagination.create();
          $scope.pagination.resource = refMortgageMarker;//mortgageRecords;
          //搜索按钮
          $scope.search = function(page)
          {
              goBackData.set('condition',$scope.condition);
              $scope.condition_copy = angular.copy($scope.condition);
              //$scope.condition_copy = addSearchCode(condition_copy, ['marker_seqnumber', 'agent_code']);
              if( $scope.condition_copy.agentGroup.agent_group_name){
                  $scope.condition_copy.agentGroup.agent_group_name =  $scope.condition_copy.agentGroup.agent_group_name;
              }
              if( $scope.condition_copy.marker.hall_id){
                  $scope.condition_copy.marker.hall_id =  $scope.condition_copy.marker.hall_id;
              }
              if( $scope.condition_copy.marker.marker_seqnumber){
                  $scope.condition_copy.marker.marker_seqnumber =  $scope.condition_copy.marker.marker_seqnumber+"!";
              }
              if( $scope.condition_copy.mortgage.agent_code){
                  $scope.condition_copy.mortgage.agent_code =  $scope.condition_copy.mortgage.agent_code+"!";
              }
              if( $scope.condition_copy.marker.loanBusiness.agent_code){
                  $scope.condition_copy.marker.loanBusiness.agent_code =  $scope.condition_copy.marker.loanBusiness.agent_code+"!";
              }
              if($scope.condition_copy.mortgage.mortgage_time[0]){
                  $scope.condition_copy.mortgage.mortgage_time[0] = getDate($scope.condition_copy.mortgage.mortgage_time[0]);
              }
              if($scope.condition_copy.mortgage.mortgage_time[1]){
                  $scope.condition_copy.mortgage.mortgage_time[1] = getDate($scope.condition_copy.mortgage.mortgage_time[1]);
              }
              if($scope.condition_copy.is_all_mortgage==-1){ //已回
                  $scope.condition_copy.is_return_m = 1;
                  $scope.condition_copy.is_all_mortgage = "";
              }else if($scope.condition_copy.is_all_mortgage==""){
                  $scope.condition_copy.is_return_m = "";
              }else if($scope.condition_copy.is_all_mortgage==0 || $scope.condition_copy.is_all_mortgage==1){
                  $scope.condition_copy.is_return_m = "0";
              }

              $scope.condition_copy.mortgage.shiftMark.shift_date[0] = $filter('date')($scope.condition.mortgage.shiftMark.shift_date[0], 'yyyy-MM-dd');
              $scope.condition_copy.mortgage.shiftMark.shift_date[1] = $filter('date')($scope.condition.mortgage.shiftMark.shift_date[1], 'yyyy-MM-dd');
              $scope.condition_copy.mortgage.shiftMark.year_month = $filter('date')($scope.condition.mortgage.shiftMark.year_month, 'yyyy-MM-01');
              $scope.excel_condition  = angular.copy($scope.condition_copy);
              $scope.excel_condition.mortgage.shiftMark.year_month = $filter('date')($scope.condition.mortgage.shiftMark.year_month, 'yyyy-MM');
              $scope.mortgage_records = $scope.pagination.select(page, globalFunction.generateUrlParams($scope.condition_copy, {mortgage : {}, marker : {}}));
              refMortgageMarker.mortgageTotal(globalFunction.generateUrlParams($scope.condition_copy)).$promise.then(function(data)
              {
                  $scope.total = data.total
              });
          }
          $scope.search();

          //格式化抵押方式：is_return_m 等於1 顯示已回；反之按抵押方式顯示
          $scope.mortgageTypeFormat = function(is_return_m, is_mortgage_all){
              if(is_return_m==1){
                  return '已回';
              }else if(is_return_m==0){
                  return $scope.mortgageMethods[is_mortgage_all];
              }
          }

          //搜索重置按钮
          $scope.reset = function()
          {
              $scope.condition = angular.copy(original);
              $scope.form_search.$setPristine();
              $scope.search();
          }

          //详细按钮
          $scope.detail = function(id)
          {
              $location.path('mortgage/mortgage-detail/'+ id);
          }

          //删除按钮
          /*$scope.delete = function(id)
          {
              pinCodeModal(mortgageRecords,'delete',{id:id},'刪除成功！').then(function(){
                  $scope.search();
              });
          }*/

          //回M
          $scope.mortgageM = function(marker_id,mortgage_record){
                  var modal_instance;
                  modal_instance = $modal.open({
                      templateUrl: "views/mortgage/mortgage-create-m.html",
                      controller: 'mortgageCreateMCtrl',
                      backdrop: 'static',
                      keyboard: false,
                      resolve: {
                          mortgage_record: function() {
                              return mortgage_record;
                          }
                      }
                  });
                  //還款
                  modal_instance.result.then(function(){
                      //還款成功刷新列表
                      $scope.search();
                  })
          }

    }]).controller('mortgageCreateMCtrl',['$scope','globalFunction','mortgageRecords','agentsLists','depositCard','crossTransfer','mortgage_record','mortgageMethods','repaymentType','repaymentMethod','$modalInstance','topAlert',
        function($scope,globalFunction,mortgageRecords,agentsLists,depositCard,crossTransfer,mortgage_record,mortgageMethods,repaymentType,repaymentMethod,$modalInstance,topAlert){
            //貸款單
//            $scope.marker = marker_data;
            $scope.mortgage_record = mortgage_record;
            $scope.mortgageMethods = mortgageMethods.items;
            $scope.repaymentMethod = repaymentMethod.items;
            $scope.repaymentType = repaymentType.items;
            //格式化抵押方式：is_return_m 等於1 顯示已回；反之按抵押方式顯示
            $scope.mortgageTypeFormat = function(is_return_m, is_mortgage_all){
                if(is_return_m==1){
                    return '已回';
                }else if(is_return_m==0){
                    return $scope.mortgageMethods[is_mortgage_all];
                }
            }
            //當廳館一致時這裡做正常的回M
            var init_mortgage = {
                "pin_code":"",
                "agent_info_id":$scope.mortgage_record.marker.agent_info_id,
                "is_all":"",
                "remark":$scope.mortgage_record.mortgage.remark,
                "refs": [{
                    "ref_mortgage_marker_id": $scope.mortgage_record.id,
                    "amount":""
                }]
            }
            $scope.mortgage = angular.copy(init_mortgage);


            $scope.mortgage_url = globalFunction.getApiUrl('mortgage/mortgage/return-m');
            //還款
            $scope.isDisabled = false;
            $scope.submit = function() {
                var mortgage_amount = $scope.mortgage.refs[0].amount ? $scope.mortgage.refs[0].amount : 0;
//                if(Number($scope.mortgage_record.mortgage_amount)<Number(mortgage_amount)){
//                if(Number($scope.mortgage_record.marker.settlement_amount)<Number(mortgage_amount)){
//                    topAlert.warning("還款金額不能大於未還金額");//抵押金額
//                    return;
//                }//mortgage_record.mortgage_amoun
                if(Number($scope.mortgage_record.settlement_amount)<Number(mortgage_amount)){
                    topAlert.warning("還款金額不能大於未回抵押金額");//抵押金額
                    return;
                }
                if($scope.isDisabled) { return; }
                $scope.isDisabled = true
                if($scope.mortgage_record.marker.hall_id == $scope.mortgage_record.mortgage.hall_id){
                    $scope.isDisabled = true;
                    $scope.form_mortgage.checkValidity().then(function() {
                        //抵押回M
                        mortgageRecords.mortgageReturnM($scope.mortgage).$promise.then(function(data){
                            if(data && data.message=='1016'){
                                topAlert.warning("無法查詢外館簽額（網絡或rollex服務問題）");
                            }
                            $scope.mortgage = angular.copy(init_mortgage);
                            topAlert.success('抵押回M成功');
                            $modalInstance.close(true);
                            $scope.isDisabled = false;
                        },function(){
                            $scope.isDisabled = false;
                        });
                    });
                }else{
                    //當跨廳館時這裡需要先進行飛數管理 確認OK之後再做回M
                    $scope.cross_transfer = {
                        "send_agent_code":$scope.mortgage_record.mortgage.agent_code,
                        "send_agent_name":$scope.mortgage_record.mortgage.agent_name,
                        "send_hall_id":$scope.mortgage_record.mortgage.hall_id,
                        "send_card_id":$scope.mortgage_record.mortgage.deposit_card_id,
                        "receive_agent_name":$scope.mortgage_record.mortgage.agent_name,
                        "receive_agent_code":$scope.mortgage_record.mortgage.agent_code,
                        "receive_hall_id":$scope.mortgage_record.marker.hall_id,
                        "receive_card_id":"",
                        "amount":$scope.mortgage.refs[0].amount,
                        "remark":$scope.mortgage.remark,
                        "type":"2",
                        "ref_mortgage_marker_id": $scope.mortgage_record.id,
                        "pin_code":$scope.mortgage.pin_code
                    };
                    $scope.mortgage_url = globalFunction.getApiUrl('deposit/crosstransfer');
                    agentsLists.query(globalFunction.generateUrlParams({agent_code:$scope.mortgage_record.mortgage.agent_code},{})).$promise.then(function(agents) {
                        $scope.agent = agents[0];
                        depositCard.query({agent_info_id:$scope.agent.id,hall_id:$scope.mortgage_record.marker.hall_id,only_current_hall:0}).$promise.then(function(cards){
                            $scope.cross_transfer.receive_card_id = _.findWhere(cards,{card_name:$scope.mortgage_record.mortgage.card_name}).id;
                            $scope.isDisabled = true;
                            $scope.form_mortgage.checkValidity().then(function(){
                                $scope.isDisabled = true;
                                crossTransfer.save($scope.cross_transfer,function(){
                                    topAlert.success("抵押回M產生飛數成功！");
                                    $modalInstance.close();
                                    $scope.isDisabled = false;
                                },function(){
                                    $scope.isDisabled = false;
                                })
                            })
                        });
                    })

                }
            };

            $scope.$watch('mortgage.is_all',function(new_value,old_value){
                if(new_value == 1) {//全部還款
                    $scope.mortgage.refs[0].amount = $scope.mortgage_record.settlement_amount;
                }else {
                    $scope.mortgage.refs[0].amount = "";
                }
            });
            $scope.cancel = function() {
                $modalInstance.dismiss();
            };


    }]).controller('mortgageSharingCtrl',['$scope','breadcrumb', 'tmsPagination', 'globalFunction', 'mortgageTypes','hallName', 'mortgageRecords', '$filter', '$location','goBackData',
        function($scope, breadcrumb, tmsPagination, globalFunction, mortgageTypes, hallName,mortgageRecords, $filter, $location,goBackData){

            //麵包屑導航
            breadcrumb.items = [
              {"name":"抵押分成","active":true}
            ];
            $scope.halls = hallName.query({hall_type:"|1"});

          var original;
          var condition_base = {
              //mortgage_no : "",
              agent_code : "",
              agent_name : "",
              year_month : "",
              shiftMark:{
                  year_month : ""
              },
              mortgageMarker:{is_all_mortgage : ""},
              mortgage_time : ["", ""],
              mortgage_profit: '|0'
          };
          original = angular.copy(condition_base);
          $scope.condition = angular.copy(condition_base);
          $scope.condition = goBackData.get('condition',$scope.condition);

          $scope.mortgage_types = mortgageTypes.items;
          $scope.pagination = tmsPagination.create();
          $scope.pagination.resource = mortgageRecords;

          $scope.search = function(page)
          {
              $scope.condition.shiftMark.year_month = $filter('date')($scope.condition.shiftMark.year_month, 'yyyy-MM');
              $scope.condition_copy = angular.copy($scope.condition);
              goBackData.set('condition',$scope.condition);
              if($scope.condition_copy.agent_code){
                  $scope.condition_copy.agent_code = $scope.condition_copy.agent_code+"!";
              }
              if($scope.condition_copy.agent_name){
                  $scope.condition_copy.agent_name = $scope.condition_copy.agent_name+"!";
              }
              if($scope.condition_copy.shiftMark.year_month){
                  $scope.condition_copy.shiftMark.year_month = $scope.condition.shiftMark.year_month+"-01";
              }

              $scope.condition_copy.mortgage_time[0] = $filter('date')($scope.condition_copy.mortgage_time[0], 'yyyy-MM-dd');
              $scope.condition_copy.mortgage_time[1] = $filter('date')($scope.condition_copy.mortgage_time[1], 'yyyy-MM-dd');
              $scope.excel_condition  = angular.copy($scope.condition_copy);
              if($scope.excel_condition.shiftMark.year_month){
                  $scope.excel_condition.shiftMark.year_month = $filter('date')($scope.condition.shiftMark.year_month, 'yyyy-MM');
              }
              $scope.mortgage_profits = $scope.pagination.select(page, $scope.condition_copy);
          }
          $scope.search();
          //搜索重置按钮
          $scope.reset = function()
          {
              $scope.condition = angular.copy(original);
              $scope.form_search.$setPristine();
              $scope.search();
          }

          //详细按钮
          $scope.detail = function(id)
          {
              $location.path('mortgage/mortgage-sharing-detail/'+ id);
          }

    }]).controller('mortgageSharingDetailCtrl',['$scope','breadcrumb', 'tmsPagination', 'globalFunction', 'mortgageTypes', 'mortgageRecords', '$filter', '$stateParams',
        function($scope, breadcrumb, tmsPagination, globalFunction, mortgageTypes, mortgageRecords, $filter, $stateParams){
            //麵包屑導航
            breadcrumb.items = [
              {"name":"抵押分成","url":'mortgage/mortgage-sharing'},
              {"name":"抵押分成詳細","active":true}
            ];
            $scope.mortgage_types = mortgageTypes.items;
            //根據id查出抵押分成數據
            if($stateParams.id){
                mortgageRecords.get(globalFunction.generateUrlParams({ id : $stateParams.id}, {mortgageProfits : {} })).$promise.then(function(data)
                {
                    $scope.mortgage_record = data;
                    $scope.mortgageProfits = data['mortgageProfits'];
                });
            }



      }]).controller('mortgageAuthorizationCtrl',['$scope','$location','$modalInstance','breadcrumb','mortgagor_name',
          function($scope,$location,$modalInstance,breadcrumb,mortgagor_name){
          $scope.showMortgage= true;
          $scope.closeMortgage = $scope.show= false;


          $scope.agent_name = mortgagor_name;
          $scope.authorization = function(){
              //授权成功过
              $scope.show = true;
              if($scope.show){
                  $scope.showMortgage = false;
                  $scope.closeMortgage = true;
              }

          };

          $scope.cancel= function(){
              $modalInstance.close();
          }

          $scope.close= function(){
              //$location.path('mortgage/mortgage-list');
              $modalInstance.close();
          }



      }])
}).call(this);
