(function() {
  'use strict';
  angular.module('app.rolling.ctrls', ['app.rolling.services']).controller('rollingManagerCtrl', ['$scope','$interval','$stateParams','qzPrinter','printerType','windowItems','breadcrumb','getDate','$modal','globalFunction','$location','$q','checkUppercase','topAlert','tmsPagination','recentlyLoanDeposit','rollingRecord','rollingTypes','mainScene','fundSourceTypes','rolling','agentsLists','sceneInfo','agentSceneStatus','pinCodeModal','refrecentlyRolling','pinCodeUserName','chipsType','user','inputFloat','formatNumber',
      function($scope,$interval,$stateParams,qzPrinter,printerType,windowItems,breadcrumb,getDate,$modal,globalFunction,$location,$q,checkUppercase, topAlert, tmsPagination, recentlyLoanDeposit,rollingRecord,rollingTypes,mainScene,fundSourceTypes,rolling,agentsLists,sceneInfo,agentSceneStatus,pinCodeModal,refrecentlyRolling,pinCodeUserName,chipsType,user,inputFloat,formatNumber) {
          breadcrumb.items = [
              {"name":"即時轉碼","active":true}
          ];
          $scope.isDesabled = false;
          $scope.agentSceneStatus = agentSceneStatus.items; //場次狀態
          $scope.rollingTypes = rollingTypes.items;
          $scope.loanTypes = fundSourceTypes.items;
          $scope.chipsTypes = chipsType;

          var init_rolling_record = {
              //"source_funds_id": "",
              //"scene_id": "",
              //"cards": [],
              "agent_id": "",   //戶口id，開場時必需
              "guest_name": "",
              "rolling_id": "", //轉碼單id非開場時必需
              "type": "",
              "chips_type":user.hall.id == '1AE7283167B57D1DE050A8C098155859' || user.hall.id == '27115D48C5F726D6E050A8C098150716'?"2":"1", //default B
              "remark": "",
              "amount": "",
              "special_scene": 0,
              "open_scene": "1", //是否開場次標識，1為是，其它為否
              "source_funds": []
          };
          $scope.rolling_record = angular.copy(init_rolling_record);

          //根據鎖定情況密碼框
          $scope.reset_pin_code = function(){
              if($scope.is_locked) {
                  var pin_code = $scope.rolling_record.pin_code;
                  var username = $scope.new_rolling.username;
              }
              $scope.rolling_record = angular.copy(init_rolling_record);
              $scope.new_rolling = angular.copy(init_new_rolling);
              if($scope.is_locked) {

                  $scope.rolling_record.pin_code = pin_code;
                  $scope.new_rolling.username = username;
              }
          }

          $scope.is_print =  1;  //是否打印
          var init_new_rolling = {
              agent_info_id:"",
              agent_code:"",
              agent_name:"",
              scene_id: "",
              scene_no: "",
              rolling_type: "", // 中場轉碼
              loanType:1,  //貸款
              remark:"",
              username: ""
          };
          $scope.new_rolling = angular.copy(init_new_rolling);

          //贷款、存款
          $scope.pagination = tmsPagination.create();
          $scope.pagination.resource = recentlyLoanDeposit;
          $scope.recentlyLoanDeposits = [];
          $scope.select = function(page){
              //$scope.recentlyLoanDeposits = $scope.pagination.select(page, {/*agent_info_id:$scope.new_rolling.agent_info_id,*/ settlement_amount:'|0'});
              $scope.pagination.select(page,{settlement_amount:'|0'}).$promise.then(function(_recentlyLoanDeposit){
                  $scope.recentlyLoanDeposits = _recentlyLoanDeposit;
                  _.each($scope.addRollings,function(item){
                      var recentlyLoanDeposit = _.findWhere($scope.recentlyLoanDeposits,{id:item.source_funds_id});
                      if(recentlyLoanDeposit){
                          recentlyLoanDeposit.checked = true;
                      }
                  })
              });
          }
          $scope.select();

          //转码流水
          $scope.pagination_record = tmsPagination.create();
          $scope.pagination_record.resource = rollingRecord;
          $scope.rollingRecords = [];
          $scope.select_record = function(page){
              if($scope.rolling_record.rolling_id) {
                 $scope.pagination_record.select(page, {rolling_id: $scope.rolling_record.rolling_id, is_offset:0}).$promise.then(function(_rollingRecords){
                     $scope.selected_rolling_record = null;
                     $scope.rollingRecords = _rollingRecords;

                 });
              }
          }
          $scope.select_record();

          $scope.selectRolling = function(record){
              $scope.selected_rolling_record = record;
          }
          $scope.disable_print_rolling = false;
          $scope.printRolling = function(){
              if($scope.selected_rolling_record){
                  $scope.disable_print_rolling = true;
                  qzPrinter.print('PDFRollingRecord',printerType.thermalPrinter,{'rolling_record_id':$scope.selected_rolling_record.id}).then(function(){
                      topAlert.success('列印成功');
                      $scope.disable_print_rolling = false;
                  },function(msg){
                      $scope.disable_print_rolling = false;
                  })
              }else{
                  topAlert.warning('請選中一條轉碼記錄');
              }
          }

          $scope.disable_print_scene = false;
          $scope.printScene = function(){
              if($scope.rolling_record.rolling_id){
                  $scope.disable_print_scene = true;
                  qzPrinter.print('PDFSceneRollingRecord',printerType.thermalPrinter,{'rolling_id':$scope.rolling_record.rolling_id}).then(function(){
                      topAlert.success('列印成功');
                      $scope.disable_print_scene = false;
                  },function(msg){
                      $scope.disable_print_scene = false;
                  })
              }else{
                  topAlert.warning('請選中一個場次');
              }
          }

          //加載在場客戶
          $scope.pagination_scene = tmsPagination.create();
          $scope.pagination_scene.resource = mainScene;
          $scope.pagination_scene.max_size = 3;
          $scope.agent_keyword = "";
          $scope.select_scene = function(page){
              $scope.pagination_scene.select(page,{'agent_code':$scope.agent_keyword+"!", status:'1',is_scene_open:"0",sort:'agent_code asc'})
                  .$promise.then(function(_mainScenes){
                      $scope.mainScenes = _mainScenes;
                  });
          }
          $scope.select_scene();

           //十秒執行一次
          /*var stop = $interval($scope.select_scene($scope.pagination_scene.page)},10000);
          $scope.$on('$stateChangeStart',
              function(event, toState, toParams, fromState, fromParams){
                  if (angular.isDefined(stop)) {
                      $interval.cancel(stop);
                      stop = undefined;
                  }
              });*/

          //查詢歷史本金
          $scope.addRollings_history = [];
          $scope.capital_history = function(){
              $scope.addRollings_history = [];
              refrecentlyRolling.query({rolling_id: $scope.rolling_record.rolling_id}).$promise.then(function(_refrecentlyRolling){

                  _.each(_refrecentlyRolling,function(ref_rolling){
                      $scope.addRollings_history.push({"used_amount":ref_rolling.amount, "fund_type": ref_rolling.ld_type, card_type:ref_rolling.card_type, as_capital:false, show_type:false});
                  });
                  console.log($scope.addRollings_history)
              });
          }

          //在場客戶快捷加入
          $scope.isAddColorFlag = false;
          $scope.settingCode = function(agent){
              //用語判斷是否選擇場次在加彩
              $scope.isAddColorFlag = true;
              if(agent.is_scene_open==1){
                  topAlert.warning("不能操作場面所開的場次！");
                  return;
              }
              //加入轉碼數組
              //if($scope.new_rolling.rolling_type==3 || $scope.new_rolling.rolling_type=="" || $scope.new_rolling.rolling_type==undefined){
//              $scope.rolling_record = angular.copy(init_rolling_record);
//              $scope.new_rolling = angular.copy(init_new_rolling);
              $scope.reset_pin_code();
              $scope.rollingRecords = []; //流水
              $scope.addRollings = []; //流水
              $scope.addRollings_history = [];
              $scope.form_rolling.clearErrors();

              //中場轉碼賦值
              $scope.new_rolling.agent_info_id = agent.agent_info_id;
              $scope.new_rolling.rolling_type = 3;
              $scope.new_rolling.scene_no = agent.main_scene_no;
              $scope.new_rolling.scene_id = agent.id;

              $scope.rolling_record.guest_name = agent.guest_name;
              $scope.rolling_record.rolling_id = agent.rolling_id;
              $scope.rolling_record.chips_type = agent.chips_type;
              $scope.scenes = agent;
              $scope.select();
              $scope.select_record();
              $scope.select_scene();  //場次列表
              $scope.settingSysRolling(agent.agent_info_id);
              $scope.capital_history();
                  //如果中場轉碼查詢以前的入場本金


              /*}else{
                  topAlert.warning("您在"+$scope.rollingTypes[$scope.new_rolling.rolling_type]+"不能操作別的轉碼類型");
                  return;
              }*/
          }

          //場次ID場次場次信息
          $scope.scene_change = function(){
              $scope.new_rolling.scene_no = "";
              $scope.rolling_record.rolling_id = "";
              $scope.rolling_record.guest_name = "";
              var scene_data =  _.findWhere($scope.scenes,{id:$scope.new_rolling.scene_id});
              if(scene_data) {
                  $scope.new_rolling.scene_no = scene_data.main_scene_no;
                  $scope.rolling_record.chips_type = scene_data.chips_type;
                  $scope.rolling_record.rolling_id = scene_data.rolling_id;
                  $scope.rolling_record.guest_name = scene_data.guest_name;
                  $scope.select_record();
                  $scope.capital_history();
              }
          }

          /*$scope.$watch('new_rolling.scene_id',function(new_value, old_value){
              if(new_value){
                  $scope.new_rolling.scene_id = new_value;
                  $scope.scene_change();
              }
          });*/

          //查看該戶口所開的場次
          $scope.scene_select = function(agent_code){
              mainScene.query({"agent_code":agent_code, status:'1', is_scene_open:"0"}).$promise.then(function(_sceneRecord){
                  //如果只有一次加彩的时候直接显示
                  $scope.scenes = _sceneRecord;
                  if(_sceneRecord.length==1){
                      $scope.rolling_record.rolling_id = _sceneRecord[0].rolling_id;
                      $scope.new_rolling.scene_id = _sceneRecord[0].id;
                      $scope.new_rolling.scene_no = _sceneRecord[0].main_scene_no;
                      $scope.scene_change();
                      $scope.select_record();
                  }else{
                      $scope.rollingRecords = [];
                  }
              });
          }

          /**
           * 更改户口
           */
          $scope.agent_edit = function(){
              if($scope.new_rolling.rolling_type!=1){
                    topAlert.warning("非開場不能更改戶口")
                    return;
              }
              /*if($scope.rolling_record.scene_id=="" || $scope.rolling_record.scene_id==undefined || $scope.rolling_record.scene_id==null){
                  topAlert.warning("請選擇場次");
                  return;
              }*/
              var modal_rolling_agent;
              modal_rolling_agent = $modal.open({
                  templateUrl: "views/rolling/rolling-agent-edit.html",
                  controller: 'rollingAgentEditCtrl',
                  windowClass:'sm-modal',
                  backdrop: 'static',
                  keyboard: false,
                  resolve: {
                      agent_data : function(){
                          return {
                              agent_code: $scope.new_rolling.agent_code
                              //scene_no: $scope.new_rolling.scene_no
                          };
                      }
                  }
              });

              modal_rolling_agent.result.then(function(result){
                  $scope.new_rolling.agent_info_id = result.transfer_agent_info_id;
                  $scope.new_rolling.agent_code = result.transfer_agent_code;
                  $scope.new_rolling.agent_name = result.transfer_agent_name;
                  $scope.new_rolling.remark = result.remark;
                  //查詢轉移戶口流水
                  $scope.select_record();
              });
          }

          /**
           * 特別開場
           */
          $scope.specialScene = function(){
              var modal_rolling_special;
              modal_rolling_special = $modal.open({
                  templateUrl: "views/rolling/rolling-special-scene.html",
                  controller: 'rollingSpecialSceneCtrl',
                  windowClass:'sm-modal',
                  resolve: {
                      login_user: function(){
                          return $scope.user;
                      }
                  }
              });

              modal_rolling_special.result.then(function(result){
                  $scope.select();
                  //$scope.select_record();
                  $scope.select_scene();  //場次列表
                  //$scope.settingSysRolling(agent.agent_info_id);
                  //$scope.capital_history();
              });
          }

          $scope.$watch('rolling_record.pin_code',function(new_value, old_value){
              $scope.new_rolling.username = "";
          });

          /**
           * 操作密码锁定
           * @type {boolean}
           */
          $scope.is_locked = false;
          $scope.isLockedFlag = false;
          $scope.agent_locked = function(lock){
              if($scope.isLockedFlag){return ;}
              $scope.isLockedFlag = true;
              if(lock) {
                  if ($scope.rolling_record.pin_code) {
                      //pin_code 查詢用戶
                      pinCodeUserName.save({pin_code: $scope.rolling_record.pin_code}).$promise.then(function (username) {
                         if(username.name=="" || username.name==null){
                             $scope.isLockedFlag = false;
                             topAlert.warning("操作密碼不正確！");
                             return;
                         }else{
                             $scope.isLockedFlag = false;
                             $scope.new_rolling.username = username.name;
                             $scope.is_locked = lock;
                         }
                      });
                  }else{
                      $scope.isLockedFlag = false;
                      topAlert.warning("請輸入操作密碼！");
                      return;
                  }
              }else{
                  $scope.isLockedFlag = false;
                  $scope.is_locked = lock;
              }

          }

          /**
           * 離場
           */
          $scope.departure = function(){
              if(!$scope.rolling_record.rolling_id){
                  topAlert.warning("請選擇離場的場次");
              }else if(!$scope.new_rolling.agent_code){
                  topAlert.warning("請選擇離場的用戶");
              }else{
                  /*if($scope.new_rolling.rolling_type==2) {
                      var get_scene = _.where($scope.scenes, {id: $scope.rolling_record.scene_id});
                  }else if($scope.new_rolling.rolling_type==3){
                      var get_scene = $scope.scenes;
                  }*/

                  var scene_data = {
                      scene_id: $scope.new_rolling.scene_id,
                      agent_info_id: $scope.new_rolling.agent_info_id,
                      rolling_id: $scope.rolling_record.rolling_id,//get_scene.rolling_id,
                      scene_no: $scope.new_rolling.scene_no,//get_scene.main_scene_no,
                      agent_code: $scope.new_rolling.agent_code,
                      agent_name: $scope.new_rolling.agent_name,
                      quota_remark : $scope.new_rolling.remark
                  };

                  //return;
                  var modal_departure;
                  modal_departure = $modal.open({
                      templateUrl: "views/rolling/rolling-departure.html",
                      controller: 'rollingDepartureCtrl',
                      windowClass:'lg-modal',
                      backdrop: 'static',
                      keyboard: false,
                      resolve: {
                         scene_data : function(){
                             return scene_data;
                         },
                         login_hall : function(){
                             return $scope.user.hall.id;
                         }
                      }
                  });

                  modal_departure.result.then(function(){
                      $scope.reset_pin_code();
                      /*$scope.rolling_record = angular.copy(init_rolling_record);
                      $scope.new_rolling = angular.copy(init_new_rolling);*/
                      $scope.select();
                      $scope.select_scene();  //場次列表
                      $scope.rollingRecords = []; //流水
                      $scope.addRollings = [];
                      $scope.addRollings_history = [];
                      $scope.form_rolling.clearErrors();

                  });
              }
          }

          function rolling_card_params(){
              if($scope.new_rolling.rolling_type==3) {//中場轉碼
                  topAlert.warning("中場轉碼沒有轉碼卡選擇");
              }else{
                  var source_funds_content = [];
                  _.each($scope.addRollings, function (_addRolling) {
                      source_funds_content.push({
                          "source_funds_id": _addRolling.source_funds_id,
                          "used_amount": _addRolling.used_amount.replace(/,/g, '')
                      });
                  });
              }
              //新增開場還是其他
              var is_create_scene = $scope.new_rolling.rolling_type==1 ? "1" : "0";
              var rolling_card_post = {
                  "rolling_id": $scope.rolling_record.rolling_id,
                  "is_create_scene": is_create_scene,
                  "agent_info_id":$scope.new_rolling.agent_info_id,
                  "chips_type":$scope.rolling_record.chips_type,
                  "source_funds": source_funds_content
              }
              return rolling_card_post;
          }

          //轉碼卡
          $scope.rollingCard = [];
          $scope.findRollingCard = function(){
              var rolling_card_post = rolling_card_params();
              var deferred = $q.defer();

              rolling.generateRollingCard(rolling_card_post).$promise.then(function(cards){
                  /*if(cards[0] && cards[0].cards.length==0){
                      topAlert.warning("請先設置默認轉碼卡");
                      return false;
                  }*/
                  $scope.card_content = [];
                  _.each(cards,function(_card){
                      _.each(_card.cards,function(c){
                          $scope.card_content.push({source_funds_id: _card.source_funds_id ,amount: c.amount, capital_type: c.capital_type, card_type: c.card_type});
                      })
                  });
                  $scope.rollingCard = $scope.card_content;
                  deferred.resolve('');
              },function(){
                  deferred.reject('');
              });
              return deferred.promise;
          }

          /**
           * 轉碼卡分卡
           */
          $scope.rolling_card = function(){
              if($scope.new_rolling.rolling_type==2) {
                  if (($scope.new_rolling.scene_id == "" || $scope.new_rolling.scene_id == undefined)) {
                      topAlert.warning("請選擇場次");
                      return;
                  }
              }/*else if($scope.new_rolling.rolling_type==3){

              }*/
              var addRolling_arr = _.where($scope.addRollings,{as_capital:true});
              if($scope.new_rolling.rolling_type==1 && addRolling_arr.length==0){
                  topAlert.warning("至少勾選一條本金");
                  return;
              }

              if ($scope.rolling_record.amount == 0 || $scope.rolling_record.amount == "" || $scope.rolling_record.amount == undefined) {
                  var tip_txt = $scope.new_rolling.rolling_type == 3 ? "請填寫轉碼數" : "請選擇可用本金或貸款"
                  topAlert.warning(tip_txt);
                  return;
              }
              //$scope.findRollingCard();//2016 11 02 新增的
              var rolling_card_modal;
              rolling_card_modal = $modal.open({
                  templateUrl: "views/rolling/rolling-card.html",
                  controller: 'rollingCardCtrl',
                  windowClass:'lg-modal',
                  backdrop: 'static',
                  keyboard: false,
                  resolve: {
                      card_types: function(){
                          return $scope.rollingCard;
                      },
                      rolling_card_params: function(){
                          return rolling_card_params();
                      },
                      rolling_data: function(){
                          return {
                              agent_info_id: $scope.new_rolling.agent_info_id
                          }
                      },
                      login_hall: function(){
                          return $scope.user.hall.id                      }
                  }
              });

              $scope.rollingCard_copy = angular.copy($scope.rollingCard);
              rolling_card_modal.result.then(function(result){
                  $scope.rollingCard = result;
                  _.each($scope.rollingCard,function(d,i){
                      $scope.addRollings[i].card_type = $scope.rollingCard[i].card_type
                  })
              },function(result){
                  if(result.length>0){
                      $scope.rollingCard = result;
                      _.each($scope.rollingCard,function(d,i){
                          $scope.addRollings[i].card_type = $scope.rollingCard[i].card_type
                      })
                  }else{
                      $scope.rollingCard = $scope.rollingCard_copy;
                  }

              });
          }

          /**
           * 查詢最近貸款和流水
           */
          /*$scope.recentlyLoanDeposit = function(){
              //存款、貸款信息
              $scope.select();
              //轉碼流水
              $scope.select_record();
          }*/

          /**
           * 通过AgentCode查询信息
           */
          //$scope.isDisabled = true;
          $scope.settingSysRolling = function(agent_info_id){
              //is_type = is_type==undefined ? false : is_type;
              //$scope.isPhilippine = false;
              if(agent_info_id){
                  agentsLists.get(globalFunction.generateUrlParams({id:agent_info_id},{/*refAgentMaster:{},*/quotaRemarks:{}}))
                      .$promise.then(function(agent){
                          if(agent){
                              $scope.new_rolling.agent_info_id = agent.id;
                              $scope.new_rolling.agent_name = agent.agent_name;
                              $scope.new_rolling.agent_code = agent.agent_code;
                              $scope.new_rolling.remark = agent.quotaRemarks.length>0 ? agent.quotaRemarks[0].content : "";
                              //$scope.isDisabled = false;

                          }else{
                              $scope.recentlyLoanDeposits = [];
                              $scope.rollingRecords = [];
                              $scope.rolling_record = angular.copy(init_rolling_record);
                              $scope.new_rolling.agent_name = "";
                              $scope.new_rolling.agent_info_id = "";
                          }
                  });
              }else{
                  //存款、貸款信息
                  $scope.new_rolling.agent_info_id = "";
                  $scope.rolling_record = angular.copy(init_rolling_record);
                  $scope.new_rolling.agent_name = "";
                  //$scope.isDisabled = true;
                  $scope.select();

              }
          }

          //計算轉碼本金的總額
          $scope.rolling_amount_sum = function(){
              if($scope.rollingCard.length>0 && Number($scope.rolling_record.amount)>0){
                  topAlert.warning('轉碼卡已重置，請從新設置轉碼卡');
              }
              $scope.rollingCard = [];
              /*var rolling_amount_sum = _.reduce($scope.addRollings, function(memo, num){
                  return memo + Number(num.used_amount);
              }, 0);*/
//              $scope.rolling_record.amount = inputFloat(rolling_amount_sum);

              var rolling_amount_sum = 0;
              _.each($scope.addRollings,function(d){
                  rolling_amount_sum += +d.used_amount.replace(/,/g, '')
              })

              $scope.rolling_record.amount = (formatNumber(rolling_amount_sum)).replace(/,/g, '');
          }

              //$scope.isPhilippine = false;
              $scope.openScene = function(loan){
              //$scope.isPhilippine = false;

              if($scope.new_rolling.rolling_type==3){
//                  $scope.rolling_record = angular.copy(init_rolling_record);
//                  $scope.new_rolling = angular.copy(init_new_rolling);
                  //$scope.select();
                  //$scope.select_scene();  //場次列表
                  $scope.reset_pin_code();
                  $scope.rolling_record.chips_type = '';
                  $scope.rollingRecords = []; //流水
                  $scope.addRollings = [];
                  $scope.addRollings_history = [];
                  $scope.form_rolling.clearErrors();
              }
              if(!$scope.new_rolling.rolling_type) {
                  mainScene.query({"agent_info_id": loan.agent_info_id, status: '1', is_scene_open:"0"}).$promise.then(function (sceneRecord) {
                      if (sceneRecord.length > 0) {
                          windowItems.confirm('系統提示', '該戶口已開場，是否再開一場？', function () {
                              $scope.rollingRecords = [];
                              $scope.setLoan(loan, 1);
                          })
                      } else {
                          $scope.rollingRecords = [];
                          $scope.setLoan(loan, 1);
                      }
                  });

              }else{
                  $scope.rollingRecords = [];
                  $scope.setLoan(loan,1);
              }
          }

          //判斷加彩是否存在場次
          $scope.openSceneColor = function(loan){
              //如果先選擇了場次和戶口名稱
              //if($scope.new_rolling.scene_id && $scope.new_rolling.rolling_type==3) {
                  /*$scope.reset_pin_code();
                   $scope.addRollings = [];
                   $scope.rollingRecords = []; //流水
                   $scope.addRollings_history = [];
                   $scope.form_rolling.clearErrors();
                   }*/
              //馬尼拉加彩不能選擇轉碼卡
              //$scope.isPhilippine = $scope.user.hall.id=='1AE7283167B57D1DE050A8C098155859' ? true : false;
              if (!$scope.new_rolling.rolling_type) {
                  mainScene.query({"agent_info_id": loan.agent_info_id, status: '1', is_scene_open: "0"}).$promise.then(function (sceneRecord) {
                      //$scope.scenes = sceneRecord;
                      if (sceneRecord.length > 0) {
                          $scope.setLoan(loan, 2);
                      } else {
                          windowItems.alert('系統提示', '該戶口還沒有開場不能加彩！');
                      }
                  });
              } else {
                  $scope.setLoan(loan, 2);
              }
              //}
          }

          /**
           * 選擇貸款
           * @type {Array}
           */
          $scope.addRollings = [];
          $scope.addRollings_copy = [];
          $scope.setLoan = function(loan, rolling_type){
              //$scope.isDisabled = false;
              //$scope.rolling_record.rolling_id= "";
              if(loan.ld_type==3 || loan.ld_type==4 || loan.ld_type==9) { //存卡、存M和存现
                  $scope.rolling_record.remark = loan.remark ? " " + loan.remark : "";
              }else{
                  $scope.rolling_record.remark = loan.seqnumber ? " " + loan.seqnumber : "";
              }
              if(!$scope.rolling_record.remark && loan.ld_type==2){
                  $scope.rolling_record.remark = "C";
              }
              if(!$scope.rolling_record.remark && loan.ld_type==7){
                  $scope.rolling_record.remark = "C碼";
              }
              //只能加入同一戶口貸款記錄
              if(!$scope.new_rolling.agent_info_id){
                  /*topAlert.warning("當前轉碼戶口是："+$scope.new_rolling.agent_code+",請加入相同戶口下面資金源");
                  return;*/
                  agentsLists.get(globalFunction.generateUrlParams({id:loan.agent_info_id},{quotaRemarks:{}}))
                      .$promise.then(function(agent) {
                          if (agent) {
                          /* $scope.new_rolling.agent_info_id = agent.id;
                           $scope.new_rolling.agent_name = agent.agent_name;
                           $scope.new_rolling.agent_code = agent.agent_code;*/
                           $scope.new_rolling.remark = agent.quotaRemarks.length > 0 ? agent.quotaRemarks[0].content : "";
                           }
                       });
              }

              //加入轉碼數組
              if($scope.new_rolling.rolling_type==3 || ($scope.new_rolling.rolling_type==rolling_type || $scope.new_rolling.rolling_type=="" || $scope.new_rolling.rolling_type==undefined)){
                  //判斷是否加載過
                  if(rolling_type==1){
                      if($scope.user.hall.id=='1AE7283167B57D1DE050A8C098155859') {
                          $scope.rolling_record.chips_type = '2'; //deault B
                      }
                      if(loan.checked){
                          return;
                      }
                      loan.checked = true;
                  }else if(rolling_type==2){//加彩
                      if(!$scope.new_rolling.rolling_type){
                          $scope.isAddColorFlag = false;
                          //查詢場次
                          $scope.scene_select(loan.agent_code);
                      }
                      if(loan.add_checked){
                          $scope.isAddColorFlag = false;
                          return;
                      }
                      loan.add_checked = true;
                  }
                  $scope.addRollings.push({"source_funds_id": loan.id, "used_amount":(formatNumber(loan.settlement_amount)).replace(/,/g, ''), "fund_type": loan.ld_type, as_capital:true, show_type:true,card_type:""});
                  $scope.addRollings_copy.push({"source_funds_id": loan.id, "used_amount":loan.settlement_amount, "fund_type": loan.ld_type, as_capital:true, show_type:true,card_type:""});
                  //$scope.addRollingsIds.push(loan.id);

              }else{
                  topAlert.warning("您在"+$scope.rollingTypes[$scope.new_rolling.rolling_type]+"不能操作別的轉碼類型");
                  return;
              }
              $scope.rolling_amount_sum();
              //$scope.rolling_record.scene_id = "";
              //$scope.new_rolling = angular.copy(init_new_rolling);
              $scope.new_rolling = {
                  "rolling_type": rolling_type,
                  "agent_info_id": $scope.new_rolling.agent_info_id ? $scope.new_rolling.agent_info_id : loan.agent_info_id,
                  "agent_code": $scope.new_rolling.agent_code ? $scope.new_rolling.agent_code : loan.agent_code,
                  "agent_name": $scope.new_rolling.agent_name ? $scope.new_rolling.agent_name : loan.agent_name,
                  "loanType": loan.ld_type,  //貸款
                  "settlement_amount": loan.settlement_amount,
                  "scene_id" : $scope.new_rolling.scene_id,
                  "scene_no": $scope.new_rolling.scene_no,
                  "remark": $scope.new_rolling.remark,
                  //"is_print": $scope.new_rolling.is_print,
                  "username": $scope.new_rolling.username ? $scope.new_rolling.username : ""
              }
//              $scope.addRollings_copy = angular.copy($scope.addRollings);
              //判斷資金類型
              //$scope.existRollingType(loan.id,$scope.rolling_record.scene_id);
           }

          /**
           * 刪除開場和加彩的資金集合
           * @param id
           * @param $index
           */
          $scope.removeAddRollings = function(id, $index){
              var data = _.findWhere($scope.recentlyLoanDeposits,{id:id});
              if($scope.new_rolling.rolling_type==1){
                  data.checked = false;
              }else{
                  data.add_checked = false;
              }
              $scope.addRollings.splice($index,1);
              $scope.rolling_amount_sum();
              if($scope.addRollings.length==0){
                  $scope.new_rolling = angular.copy(init_new_rolling);
                  $scope.rolling_record = angular.copy(init_rolling_record);
              }
          }

          /**
           * 刪除現金,現金嗎  可以删除所有
           * @param loan
           */
          $scope.removeLoan = function(loan){
              //if(loan.ld_type==2 || loan.ld_type==7){
              //    pinCodeModal(recentlyLoanDeposit, 'delete', {id: loan.id}, '刪除成功！').then(function () {
              //        $scope.select();
              //    });
              //}else{
              //    topAlert.warning("現金和現金碼才能被刪除");
              //}
              pinCodeModal(recentlyLoanDeposit, 'delete', {id: loan.id}, '刪除成功！').then(function () {
                  $scope.select();
              });
          }

          /**
           * 新增現金和現金碼
           * @returns {boolean}
           */
          $scope.amountRolling = function(){
              //var agent_code = $scope.new_rolling.agent_code;
              var amount_rolling_record = angular.copy($scope.rolling_record);
              amount_rolling_record.agent_info_id = $scope.new_rolling.agent_info_id;
              amount_rolling_record.agent_code = $scope.new_rolling.agent_code;
              var modal_instance;
              modal_instance = $modal.open({
                  templateUrl: "views/rolling/amount-rolling.html",
                  controller: 'amountRollingCtrl',
                  windowClass:"sm-modal",
                  backdrop: 'static',
                  keyboard: false,
                  resolve: {
                      amount_rolling_record: function() {
                          return amount_rolling_record;
                      }
                  }
              });

              modal_instance.result.then(function(){
                  $scope.select();
              });
          }

          /**
           * 新增卡類型
           * @param type
           * @param index
           */
          /*$scope.addCardType = function(type,index){
              var modal_card;
              modal_card = $modal.open({
                  templateUrl: "views/rolling/add-card-type.html",
                  controller: 'addCardTypeCtrl',
                  windowClass:'sm-modal',
                  resolve: {
                      cardType: function () {
                          return type;
                      },
                      card_index : function(){
                          return index;
                      },
                      agent_info_id : function(){
                          return  $scope.new_rolling.agent_info_id;
                      }
                  }
              });
          }*/

          //退碼
          /*$scope.is_refund = false;
          $scope.isRefundFunc = function(){
              if($scope.rolling_type == 2 || $scope.rolling_type == 3){ //中場加彩才能退碼
                  if($scope.is_refund){
                      $scope.rolling_record.amount = -($scope.rolling_record.amount);
                  }
              }
          }*/

          /**
           * 撤銷流水
           * @constructor
           */
          $scope.Revoke = function(){
              //TODO 撤銷代碼
              $location.path("/rolling/revoke-capital");
          }

          //本金和轉碼卡對於數據的拼接
          $scope.rolling_card_join = function(){

              //非轉碼計算轉碼卡信息
              var source_funds_content = [];
              _.each($scope.addRollings,function(_addRolling){
                  var source_funds_obj = {
                      source_funds_id : _addRolling.source_funds_id,
                      used_amount :_addRolling.used_amount.replace(/,/g, ''),
                      as_capital : _addRolling.as_capital==false ? 0 : 1
                  }
                  var card_data = [];
                  var rolling_card_data = _.where($scope.rollingCard,{source_funds_id:_addRolling.source_funds_id});

                  _.each(rolling_card_data,function(_card){
                      card_data.push({
                          "amount": _card.amount,
                          "capital_type": _card.capital_type,
                          "card_type": _card.card_type
                      });
                  });
                  source_funds_obj.cards = card_data;
                  source_funds_content.push(source_funds_obj);
              });

              $scope.rolling_record.source_funds = source_funds_content;
          }

          /**
           * 立即轉碼
           */
          $scope.rolling_url = globalFunction.getApiUrl('rolling/rolling');
          $scope.submit = function() {
              //$scope.isDisabled = true
              if($scope.rolling_record.amount.trim()!=''&&isNaN(+($scope.rolling_record.amount.trim()))){
                  topAlert.warning("轉碼數必须为数字");
                  return;
              }

              $scope.rolling_url = globalFunction.getApiUrl('rolling/rolling/generate-rolling-card');
              $scope.rolling_record.agent_id = $scope.new_rolling.agent_info_id;
              $scope.rolling_record.type = $scope.new_rolling.rolling_type;

              if($scope.rolling_record.rolling_id=="" && $scope.new_rolling.rolling_type==2){
                  topAlert.warning("請選擇場次編號");
                  return;
              }


              //判斷是否存在轉碼
              if($scope.new_rolling.rolling_type==3){
                  $scope.rolling_record.source_funds = [];
                  $scope.submit_operation();
              }else{
                  if($scope.addRollings.length==0){
                      topAlert.info('請選擇最近貸款、存款信息');
                      return;
                  }
                  //轉碼卡
                  var addRolling_arr = _.where($scope.addRollings,{as_capital:true})
                  if($scope.new_rolling.rolling_type==1 && addRolling_arr.length==0){
                      topAlert.warning("至少勾選一條本金");
                      return;
                  }

                  if($scope.rollingCard && $scope.rollingCard.length==0){
                      $scope.scuess_ok = false;
                      var rolling_card_post = rolling_card_params();
                      _.each($scope.addRollings_copy,function(addRolling){
                          _.each(rolling_card_post.source_funds,function(source_fund){
                              if(source_fund.source_funds_id ==addRolling.source_funds_id && Number(source_fund.used_amount)> Number(addRolling.used_amount)){
                                  $scope.scuess_ok = true;
                              }
                          })
                      });
                      if($scope.scuess_ok){
                          topAlert.warning("轉碼數不能大於入場金額。");
                          return;
                      }
                      $scope.form_rolling.checkValidity().then(function() {
                          $scope.findRollingCard().then(function () {
                              $scope.rolling_card_join();
                              $scope.submit_operation();
                          });
                      });
                  }else{
                      $scope.rolling_card_join();
                      $scope.submit_operation();
                  }
              }
          }

          $scope.submit_operation = function(){
              if($scope.isDesabled){return false;}
              $scope.isDesabled = true;
              $scope.rolling_url = globalFunction.getApiUrl('rolling/rolling');
              $scope.form_rolling.checkValidity().then(function() {
                  rolling.save($scope.rolling_record).$promise.then(function (result) {
                      //如果開啟列印
                      if($scope.is_print==1){
                          qzPrinter.print('PDFRollingRecord',printerType.thermalPrinter,{'rolling_record_id':result.id}).then(function(){
                              topAlert.success('列印成功');
                          });
                      }
                      $scope.isDesabled = false;
                      if($scope.new_rolling.rolling_type==1){
                          $scope.rolling_record.rolling_id = result.rolling_id;
                          var tip_txt = "開場";
                      }else if($scope.new_rolling.rolling_type==2){
                          var tip_txt = "加彩";
                      }else if($scope.new_rolling.rolling_type==3){
                          var tip_txt = "中場轉碼";
                      }
                      topAlert.success($scope.new_rolling.agent_code+" "+tip_txt+"成功");
                      $scope.reset(true);
                      $scope.select_scene();
                      $scope.form_rolling.clearErrors();
                  }, function () {

                      $scope.isDesabled = false;
                  });
              });
          }

          //是否開啟打印
          $scope.isPrint = function(val){
              $scope.is_print = val;
          }

          $scope.reset = function(flag){
              //$scope.isPhilippine = false;
              var flag = flag==undefined ? false : true;
              if(flag){
                  var rolling_id =  $scope.rolling_record.rolling_id;
              }
              if($scope.is_locked) {
                  var pin_code = $scope.rolling_record.pin_code;
                  var username = $scope.new_rolling.username;
              }
              $scope.rolling_record = angular.copy(init_rolling_record);
              $scope.new_rolling = angular.copy(init_new_rolling);
              if($scope.is_locked) {
                  $scope.rolling_record.pin_code = pin_code;
                  $scope.new_rolling.username = username;
              }
              if(flag){
                  $scope.rolling_record.rolling_id = rolling_id;
                  $scope.select_record();
              }else{
                  $scope.is_print = 1;
                  $scope.rollingRecords = []; //轉碼流水
              }

              $scope.scenes = [];         //場次
              $scope.rollingCard = [];    //轉碼卡
              $scope.addRollings = [];    //轉碼本金
              //$scope.rollingRecords = []; //轉碼流水
              $scope.addRollings_history = [];  //加彩/轉碼歷史加入的歷史本金

              $scope.select();            //最近貸款記錄
              //$scope.isDisabled = true;
              $scope.form_rolling.$setPristine();
              $scope.form_rolling.clearErrors();
          }

          //即時轉碼
          if($stateParams.agent_code && $stateParams.seqnumber){
              $scope.new_rolling.agent_code = $stateParams.agent_code;
              /*globalFunction.generateUrlParams*/
                recentlyLoanDeposit.query({seqnumber:$stateParams.seqnumber/*, ld_type:1*/}).$promise.then(function(loan) {
                   if (loan[0]) {
                        $scope.setLoan(loan[0],1);
                        _.each($scope.addRollings,function(item){
                            var recentlyLoanDeposit = _.findWhere($scope.recentlyLoanDeposits,{id:item.source_funds_id});
                            if(recentlyLoanDeposit){
                                recentlyLoanDeposit.checked = true;
                            }
                        })
                    }else
                      topAlert.warning("沒有找到最近貸款、存取款記錄");
              });
          }

          if($stateParams.agent_code){
              $scope.new_rolling.agent_code = $stateParams.agent_code;
              //$scope.new_rolling.set_loan = true;
          }


      }]).controller('rollingSpecialSceneCtrl',['$scope','globalFunction', '$modalInstance', 'topAlert', 'agentsLists','rolling', 'windowItems', 'mainScene','chipsType','login_user','commissionCard',
      function($scope, globalFunction, $modalInstance, topAlert, agentsLists, rolling, windowItems, mainScene,chipsType,login_user,commissionCard){
          $scope.chipsTypes = chipsType;
          $scope.cards = [];//獲取的轉碼卡
          $scope.user = login_user;
          $scope.special_record = {
              agent_id: "",
              type: 1,
              special_scene: 1,
              open_scene : 1,
              chips_type:login_user.hall.id == '1AE7283167B57D1DE050A8C098155859'?"2":"1",
              card_type:"",
              pin_code: ""
          }



          $scope.new_special_record = {
              agent_code: "",
              agent_name: ""
          }
          $scope.isDesabled = true;
          $scope.$watch('new_special_record.agent_code',globalFunction.debounce(function(new_value, old_value){
              $scope.special_record.agent_id = "";
              $scope.new_special_record.agent_name = "";
              if(new_value){
                  agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                      if(agents[0]){
                              $scope.special_record.agent_id = agents[0].id;
                              $scope.new_special_record.agent_code = agents[0].agent_code;
                              $scope.new_special_record.agent_name = agents[0].agent_name;
                              $scope.isDesabled = false;
                          //轉碼卡
                          commissionCard.query(globalFunction.generateUrlParams({agent_info_id: $scope.special_record.agent_id}))
                              .$promise.then(function (cards) {
                                  $scope.cards = angular.copy(cards);
                              });
                      }
                  });
              }
          }));

          $scope.crate_scene_url = globalFunction.getApiUrl('rolling/rolling');
          $scope.submit = function(){
              $scope.isDesabled = true;
              mainScene.query({"agent_info_id": $scope.special_record.agent_id, status: '1', is_scene_open:"0"}).$promise.then(function (sceneRecord) {
                  if (sceneRecord.length > 0) {
                      windowItems.confirm('系統提示', '該戶口已開場，是否再開一場？', function () {
                          $scope.specialScene();
                      },function(){
                          $scope.isDesabled = false;
                      })
                  }else{
                      $scope.specialScene();
                  }
              });

          }

          $scope.specialScene = function(){
              $scope.form_crate_scene.checkValidity().then(function() {
                  rolling.save($scope.special_record).$promise.then(function(){
                      topAlert.success("特別開場成功");
                      $modalInstance.close();
                      $scope.isDesabled = false;
                  },function(){
                      $scope.isDesabled = false;
                  });
              });
          }

          $scope.cancel = function(){
              $modalInstance.close();
          }



      }]).controller('rollingAgentEditCtrl',['$scope','globalFunction', '$modalInstance', 'topAlert', 'agentsLists', 'agent_data',
          function($scope, globalFunction, $modalInstance, topAlert, agentsLists, agent_data){
              //轉碼信息
              $scope.agent_record = agent_data;

              $scope.agent_record = {
                  scene_no: agent_data.scene_no,
                  agent_code: agent_data.agent_code,
                  transfer_agent_info_id : "",
                  transfer_agent_name : "",
                  transfer_agent_code : "",
                  remark : ""
              }
              $scope.isDesabled = false;
              $scope.$watch('agent_record.transfer_agent_code',globalFunction.debounce(function(new_value, old_value){
                  if(new_value) {
                      $scope.isDesabled = true;
                      agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {quotaRemarks: {}})).$promise.then(function (agent) {
                          if (agent[0]) {
                              $scope.agent_record.transfer_agent_info_id = agent[0].id;
                              $scope.agent_record.transfer_agent_name = agent[0].agent_name;
                              $scope.agent_record.transfer_agent_code = new_value;
                              $scope.agent_record.remark = agent[0].quotaRemarks.length > 0 ? agent[0].quotaRemarks[0].content : "";
                              $scope.isDesabled = false;
                          }
                      });
                  }
              }));

              //轉移戶口
              $scope.submit = function(){
                  if($scope.agent_record.transfer_agent_info_id=="" || $scope.agent_record.transfer_agent_info_id==undefined || $scope.agent_record.transfer_agent_info_id==null){
                      topAlert.warning("您要轉移的戶口不存在");
                      return;
                  }
                  $modalInstance.close($scope.agent_record);
              }

              $scope.cancel = function(){
                  $modalInstance.dismiss();
              }

      }]).controller('rollingDepartureCtrl',['$scope','rollingRecord','globalFunction', '$modalInstance','topAlert','scene_data','rollingCardRecord','refrecentlyRolling','rolling','commissionCard','pinCodeModal','mainScene','fundSourceTypes','login_hall',
           function($scope,rollingRecord, globalFunction, $modalInstance,topAlert,scene_data,rollingCardRecord,refrecentlyRolling,rolling,commissionCard,pinCodeModal,mainScene,fundSourceTypes,login_hall){

               //$scope.addRollingCard = login_hall == '1AE7283167B57D1DE050A8C098155859' ? true : false;

               //場次信息
               $scope.scene_record = scene_data;
               $scope.loanTypes = fundSourceTypes.items;
               $scope.form_create_card_url = globalFunction.getApiUrl('commissionsetting/commissioncard');

               if(scene_data.agent_info_id) {
                   //主場次
                   mainScene.get({id:scene_data.scene_id}).$promise.then(function(_mainScene){
                       //總轉碼數
                       $scope.rolling_total = _mainScene.rolling_total;
                   });
                   //入場本金
                   $scope.refrecentlyRollings = refrecentlyRolling.query({rolling_id: scene_data.rolling_id});

                   //轉碼記錄
                   rollingRecord.query({rolling_id:scene_data.rolling_id, is_offset:0}).$promise.then(function(_rollingRecords){
                       $scope.rollingRecords = _rollingRecords;
                   });
//                   $scope.rollingRecords = _rollingRecords;
                   //分卡記錄
                   if($scope.scene_record.is_edit === true){
                       rollingCardRecord.query({rolling_id: scene_data.rolling_id}).$promise.then(function(card_records){
                           $scope.card_types = {"cards":[]};
                           _.each(card_records,function(card_record){
                               $scope.card_types.cards.push({
                                   'record_id':card_record.id,
                                   'capital_amount':card_record.capital_amount,
                                   'capital_type':card_record.capital_name,
                                   'rolling_amount':card_record.amount,
                                   'card_type':card_record.commission_card
                               })
                           })
                           if($scope.card_types.cards){
                               $scope.card_selected($scope.card_types.cards[0]);
                           }
                       })
                   }else{
                       rolling.rollingQuit({rolling_id: scene_data.rolling_id})
                           .$promise.then(function(_card_types){
                               $scope.card_types = _card_types;
                               if($scope.card_types.remainder_rolling_amount > 0){
                                   var remainder_card_type = _.findWhere($scope.card_types.cards,{"card_type":$scope.card_types.remainder_card_type})
                                   if(remainder_card_type){
                                       remainder_card_type.rolling_amount = Number(remainder_card_type.rolling_amount) + Number($scope.card_types.remainder_rolling_amount);

                                       remainder_card_type.rolling_amount =  (remainder_card_type.rolling_amount).toFixed(2);
                                   }else{
                                       $scope.card_types.cards.push({
                                           "capital_amount": $scope.card_types.remainder_capital_amount,
                                           "capital_type": $scope.card_types.remainder_capital_type,
                                           "rolling_amount": $scope.card_types.remainder_rolling_amount,
                                           "card_type": $scope.card_types.remainder_card_type
                                       });
                                   }
                               }
                               if($scope.card_types.cards){
                                   $scope.card_selected($scope.card_types.cards[0]);
                               }
                               //$scope.card_types_copy = angular.copy(_card_types);
                           });
                   }

                   //轉碼卡
                   commissionCard.query(globalFunction.generateUrlParams({agent_info_id: scene_data.agent_info_id}))
                       .$promise.then(function (cards) {
                           $scope.cards = angular.copy(cards);
                           $scope.card_rows = split(cards, 10);
                       });

                   /**
                    * 新增卡類型
                    */
                   $scope.add_scene = function (card_name,pin_code) {
                       $scope.form_create_card.checkValidity().then(function() {
                           var card_data = _.where($scope.cards, {'card_name': card_name});
                           if (card_data.length > 0) {
                               topAlert.info("不能添加相同的卡類型");
                               return false;
                           }
                           var card_record = {
                               "agent_info_id": scene_data.agent_info_id,
                               "card_name": card_name,
                               "pin_code": pin_code
                           }
                           commissionCard.save(card_record).$promise.then(function () {
                               topAlert.success("新增轉碼卡成功！");
                               commissionCard.query(globalFunction.generateUrlParams({agent_info_id: scene_data.agent_info_id}))
                                   .$promise.then(function (cards) {
                                       card_name = "";
                                       $scope.cards = angular.copy(cards);
                                       $scope.card_rows = split(cards, 10);
                                   });
                           });
                       });
                   }

                   $scope.type_record_create = {
                       card_name: ""
                   };
                   $scope.card_selected = function(card_type){
                       $scope.type_record = card_type;
                       $scope.type_record.card_name = card_type.card_type;
                   }

                   $scope.card_change = function(card_name){
                       if($scope.type_record) {
//                           $scope.type_record.card_type =  $scope.type_record_create.card_name;
                           $scope.type_record.card_type =  card_name;
                           //$scope.card_types[$scope.type_record.card_id].card_type = $scope.type_record.card_name;
                       }else{
                           //topAlert.warning("請選擇要修改的轉碼卡");
                           $scope.type_record_create.card_name = "";
                           return;
                       }
                   }

                   /*{
                       "capital_amount": "100",
                       "capital_type": "M",
                       "rolling_amount": "2000",
                       "card_type": "M18"
                   }*/

                   //離場數據
                   $scope.record_create = {
                       "rolling_id": scene_data.rolling_id,
                       "rolling_cards": [],
                       "pin_code": ""
                   };
                   $scope.form_departure_url = globalFunction.getApiUrl('rolling/rolling');
                   $scope.submit = function () {
                       var card_type_total = 0;
                       _.each($scope.card_types.cards, function(card_type){
                           card_type_total += Number(card_type.rolling_amount)
                       });

//                       card_type_total = card_type_total.toFixed(1);
                       if(Number($scope.rolling_total) != Number(card_type_total)){
                           topAlert.warning("轉碼數設置錯誤");
                           return;
                       }
                       $scope.form_departure.checkValidity().then(function() {
                           var card_types_content = [];
                           _.each($scope.card_types.cards,function(card_type){
                               card_types_content.push({
                                   "record_id":card_type.record_id,
                                   "capital_amount": card_type.capital_amount,
                                   "capital_type": card_type.capital_type,
                                   "rolling_amount": card_type.rolling_amount,
                                   "card_type": card_type.card_type
                               });
                           });
                           /*//餘數
                           card_types_content.push({
                               "capital_amount": $scope.card_types.remainder_capital_amount,
                               "capital_type": $scope.card_types.remainder_capital_type,
                               "rolling_amount": $scope.card_types.remainder_rolling_amount,
                               "card_type": $scope.card_types.remainder_card_type
                           });*/

                           $scope.record_create.rolling_cards = card_types_content;
                           if($scope.scene_record.is_edit === true) {
                               $scope.disabled_submit = true;
                               rolling.rollingUpdate($scope.record_create).$promise.then(function () {
                                   topAlert.success("修改成功");
                                   $modalInstance.close();
                                   $scope.disabled_submit = false;
                               },function(){
                                   $scope.disabled_submit = false;
                               });
                           }else{
                               $scope.disabled_submit = true;
                               rolling.rollingConfirm($scope.record_create).$promise.then(function () {
                                   topAlert.success("場次：" + scene_data.scene_no + "成功離場");
                                   $modalInstance.close();
                                   $scope.disabled_submit = false;
                               },function(){
                                   $scope.disabled_submit = false;
                               });
                           }
                       });
                   }

                   $scope.cancel = function () {
                       $modalInstance.dismiss();
                   }
               }

               function split(arr, size) {
                   var arrays = [];
                   while (arr.length > 0) {
                       arrays.push(arr.splice(0, size));
                   }
                   return arrays;
               }

      }]).controller('rollingDepartureDetailCtrl',['$scope','rollingRecord','globalFunction', '$modalInstance','rollingCardRecord','topAlert','scene_data','refrecentlyRolling','rolling','commissionCard','pinCodeModal','mainScene','fundSourceTypes','qzPrinter','printerType',
      function($scope, rollingRecord,globalFunction, $modalInstance,rollingCardRecord,topAlert,scene_data,refrecentlyRolling,rolling,commissionCard,pinCodeModal,mainScene,fundSourceTypes,qzPrinter,printerType){
          $scope.scene_record = scene_data;
          $scope.rolling =  rolling.get(globalFunction.generateUrlParams({id:scene_data.rolling_id},{refRecentlyRollings:{},refRollingCardRecords:{}}));
          //轉碼數分卡
          $scope.rollingCardRecord = rolling.getRollingCardRecords({rolling_id:scene_data.rolling_id});
          //轉碼記錄
          rollingRecord.query({rolling_id:scene_data.rolling_id, is_offset: 0}).$promise.then(function(_rollingRecords){
              $scope.rollingRecords = _rollingRecords;
          });
          $scope.fundSourceTypes = fundSourceTypes;
          $scope.cancel = function () {
              $modalInstance.dismiss();
          }

          $scope.selectRolling = function(record){
              $scope.selected_rolling_record = record;
          }
          $scope.disable_print_rolling = false;
          $scope.printRolling = function(){
              if($scope.selected_rolling_record){
                  $scope.disable_print_rolling = true;
                  qzPrinter.print('PDFRollingRecord',printerType.thermalPrinter,{'rolling_record_id':$scope.selected_rolling_record.id}).then(function(){
                      topAlert.success('列印成功');
                      $scope.disable_print_rolling = false;
                  },function(msg){
                      $scope.disable_print_rolling = false;
                  })
              }else{
                  topAlert.warning('請選中一條轉碼記錄');
              }
          }

          //列印本场
          $scope.disable_print_scene = false;
          $scope.printScene = function(){
              if(scene_data.rolling_id){
                  $scope.disable_print_scene = true;
                  qzPrinter.print('PDFSceneRollingRecord',printerType.thermalPrinter,{'rolling_id':scene_data.rolling_id}).then(function(){
                      topAlert.success('列印成功');
                      $scope.disable_print_scene = false;
                  },function(msg){
                      $scope.disable_print_scene = false;
                  })
              }else{
                  topAlert.warning('請選中一個場次');
              }
          }
      }]).controller('rollingCardCtrl',['$scope','globalFunction', '$modalInstance','topAlert','pinCodeModal','commissionCard','card_types','rolling_data','rolling','rolling_card_params','login_hall',
           function($scope, globalFunction, $modalInstance,topAlert,pinCodeModal,commissionCard,card_types,rolling_data,rolling,rolling_card_params,login_hall){
               $scope.form_create_card_url = globalFunction.getApiUrl('commissionsetting/commissioncard');

               //$scope.addRollingCard = login_hall == '1AE7283167B57D1DE050A8C098155859' ? true : false;
               $scope.findRollingCard = function(){
                   rolling.generateRollingCard(rolling_card_params).$promise.then(function(card){
                       $scope.card_content = [];
                       _.each(card,function(_card){
                           _.each(_card.cards,function(c){
                               $scope.card_content.push({
                                   source_funds_id: _card.source_funds_id ,
                                   amount: c.amount,
                                   capital_type: c.capital_type,
                                   card_type: c.card_type
                               });
                           })
                       });
                       //顯示數據
                       $scope.card_types = $scope.card_content;
                       $scope.card_types_copy = angular.copy($scope.card_content);
                       if($scope.card_types){
                           $scope.card_selected($scope.card_types[0],0);
                       }
                   });
               }

               //生成的轉碼卡
               if(card_types && card_types.length>0){
                   $scope.card_types = angular.copy(card_types);
                   $scope.card_types_copy = angular.copy(card_types);
               }else{
                   $scope.findRollingCard();
               }

               $scope.type_record_create = {
                   card_name: ""
               };
               $scope.type_record ="";
               $scope.card_selected = function(card_type,index){
                   $scope.type_record = card_type;
                   $scope.type_record.card_name = card_type.card_type;
               }

               $scope.card_change = function(card_name){
                   if($scope.type_record.card_name) {
//                       $scope.type_record.card_type = $scope.type_record_create.card_name;
                       $scope.type_record.card_type = card_name;
                   }else{
                       //topAlert.warning("請選擇要修改的轉碼卡");
                       $scope.type_record_create.card_name = "";
                       return;
                   }
               }

               //轉碼卡
               commissionCard.query(globalFunction.generateUrlParams({agent_info_id: rolling_data.agent_info_id}))
                   .$promise.then(function (cards) {
                       $scope.cards = angular.copy(cards);
                       $scope.card_rows = split(cards, 10);
                       //$scope.iszm = _.filter($scope.cards,function(z){ return z.card_name == 'ZM'});
                       //$scope.isz = _.filter($scope.cards,function(z){ return z.card_name == 'Z'});
                       //console.log($scope.iszm)
                       //console.log($scope.isz)
                       if($scope.card_types){
                           /*_.each($scope.card_types,function(d){
                                if(d.capital_type == "M"){
                                    if($scope.iszm.length>0){
                                        d.card_type = "ZM"
                                    }
                                }
                               if(d.capital_type == "C"){
                                   if($scope.isz.length>0){
                                       d.card_type = "Z"
                                   }
                               }
                           })*/
                           $scope.card_selected($scope.card_types[0],0);
                       }
                   });

               /**
                * 新增卡類型
                */
               $scope.add_scene = function (card_name,pin_code) {


                   $scope.form_create_card.checkValidity().then(function() {
                       var card_data = _.where($scope.cards, {'card_name': card_name});
                       if (card_data.length > 0) {
                           topAlert.info("不能添加相同的卡類型");
                           return false;
                       }
                       var card_record = {
                           "agent_info_id": rolling_data.agent_info_id,
                           "card_name": card_name,
                           "pin_code": pin_code
                       }
                       commissionCard.save(card_record).$promise.then(function () {
                           topAlert.success("新增轉碼卡成功！");
                           commissionCard.query(globalFunction.generateUrlParams({agent_info_id: rolling_data.agent_info_id}))
                               .$promise.then(function (cards) {
                                   card_name = "";
                                   $scope.cards = angular.copy(cards);
                                   $scope.card_rows = split(cards, 10);
                               });
                       });
                   });
               }

               function split(arr, size) {
                   var arrays = [];
                   while (arr.length > 0) {
                       arrays.push(arr.splice(0, size));
                   }
                   return arrays;
               }

               $scope.submit = function () {
                   //if($scope.addRollingCard){
//                       if(_.uniq(_.pluck($scope.card_types,'card_type')).length != 1){
//                            topAlert.warning('请选择相同的卡类型。');
//                            return;
//                       }
                   //}
                   $modalInstance.close($scope.card_types);
               }

               $scope.cancel = function () {
                   $modalInstance.dismiss($scope.card_types_copy);
               }

      }]).controller('amountRollingCtrl',['$scope','globalFunction', '$modalInstance','amount_rolling_record','fundSourceTypes', 'rolling','topAlert','agentsLists',
                function($scope,globalFunction, $modalInstance, amount_rolling_record, fundSourceTypes,rolling,topAlert,agentsLists){

          $scope.title = "新增現金/現金碼";
          $scope.loanTypes = fundSourceTypes.items;
          $scope.isDesabled = false;

          $scope.deposit_url =  globalFunction.getApiUrl('rolling/rolling/pre-deposit');

          $scope.agent_code = amount_rolling_record.agent_code;
            $scope.$watch('agent_code',globalFunction.debounce(function(new_value,old_value){
                if(new_value && new_value!=""){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value})).$promise.then(function (agents) {
                        if(agents[0]) {
                            $scope.amount_rolling_record.agent_info_id = agents[0].id;
                            $scope.agent_name = agents[0].agent_name;
                        }
                    });
                }else{
                    $scope.amount_rolling_record.agent_info_id = "";
                    $scope.agent_name = "";
                }
            }));
           //新增現金/現金碼
          var init_amount_rolling_record = {
               "agent_info_id":"",
               "type":"",
               "amount":"",
               "common_currency_id":""//幣種
           }
           $scope.amount_rolling_record = angular.copy(init_amount_rolling_record);
           $scope.initData=false;
           $scope.add = function(){
               if(isNaN(+($scope.amount_rolling_record.amount))){
                   $scope.initData=true;
                   topAlert.warning("金額必须为数字");
                   return;
               }
               if($scope.isDesabled){ return ;}
               $scope.isDesabled = true;

               $scope.form_deposit.checkValidity().then(function() {
                   rolling.preDeposit($scope.amount_rolling_record).$promise.then(function(){
                       $scope.amount_rolling_record = angular.copy(init_amount_rolling_record);
                       topAlert.success("您已成功預存現金");
                       //刷新最近貸款
                       $modalInstance.close();
                       $scope.isDesabled = false;
                   },function(){
                       $scope.isDesabled = false;
                   });
               });
           }

           $scope.cancel = function(){
               //$modalInstance.close($scope.amount_rolling_record);
               $scope.amount_rolling_record = angular.copy(init_amount_rolling_record);
               $scope.agent_code = '';
               $scope.agent_name = '';
           }

           $scope.close = function(){
                $modalInstance.dismiss();
           }

      }]).controller('rollingListCtrl',[ '$scope','$modal','getDate','breadcrumb','$location','$stateParams','$filter','tmsPagination','globalFunction','rolling','rollingRecord','hallName','shiftMarks','currentShift','agentsLists',
      function($scope,$modal,getDate,breadcrumb,$location,$stateParams,$filter,tmsPagination,globalFunction,rolling,rollingRecord,hallName,shiftMarks,currentShift,agentsLists){
          breadcrumb.items = [
              {"name":"轉碼明細","active":true}
          ];

          $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
              return hall.hall_type != 1;
          });
          $scope.shiftMarks = shiftMarks;
          var init_condition = {
              hall_id:"",
              agent_code: '',
              is_offset: 0,
              card_name: "",
              agentGroup:{
                  agent_group_name: ""
              },
              shiftMark:{
                  settlementMonth:{year_month:[currentShift.data.year_month?currentShift.data.year_month:""]},
                  shift_date:['',''],
                  shift : ""
              },
              agent_name: '',
              sort:"roll_time DESC,rolling DESC",
              common_currency_id:""//幣種
          };
          if($stateParams.agent_code){
              init_condition.agent_code = $stateParams.agent_code;
          }
          $scope.condition = angular.copy(init_condition);
          $scope.excel_condition  = angular.copy($scope.condition);
          //初始化列表數據
          $scope.pagination = tmsPagination.create();
          $scope.pagination.resource = rollingRecord;
          $scope.select = function(page) {

              if ($scope.condition.shiftMark.settlementMonth.year_month[0]) {
                  $scope.condition.shiftMark.settlementMonth.year_month[0] = $filter('date')($scope.condition.shiftMark.settlementMonth.year_month[0], 'yyyy-MM');
              }
              if ($scope.condition.shiftMark.shift_date[0]) {
                  $scope.condition.shiftMark.shift_date[0] = $scope.condition.shiftMark.shift_date[0] ? getDate($scope.condition.shiftMark.shift_date[0]) : "";
              }
              if ($scope.condition.shiftMark.shift_date[1]) {
                  $scope.condition.shiftMark.shift_date[1] = $scope.condition.shiftMark.shift_date[1] ? getDate($scope.condition.shiftMark.shift_date[1]) : "";
              }
              var conditions = angular.copy($scope.condition);
              /*if(conditions.agent_code){
               conditions.agent_code = conditions.agent_code+"!";
               }*/
              $scope.excel_condition = angular.copy($scope.condition);
              $scope.rollingRecords = $scope.pagination.select(page, conditions);

              $scope.rolling_record_total =  rollingRecord.rollingRecordTotal_y(globalFunction.generateUrlParams(conditions));



              //匯總
//              $scope.condition_copy = {
//                  'hall_id': $scope.condition.hall_id,
//                  'agent_code': $scope.condition.agent_code,
//                  'agent_name': $scope.condition.agent_name,
//                  'roll_time-min':  $scope.condition.roll_time[0],
//                  'roll_time-max':  $scope.condition.roll_time[1]
//              }
//              $scope.rollingTotal = rolling.rollingTotal($scope.condition_copy);
          }


          $scope.select();

          //根據條件查詢方法
          $scope.search = function(){
              $scope.select();
          }

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


          $scope.reset = function(){
              $scope.condition = angular.copy(init_condition);
              $scope.form_search.$setPristine();
              $scope.search();
          }
//          $scope.rollingRecords = [];
//          $scope.pagination_record = tmsPagination.create();
//          $scope.pagination_record.resource = rollingRecord;
//          $scope.searchRollRecord = function(id){
//              $scope.rollingRecords = $scope.pagination_record.select(1,{rolling_id:id});
//          }

          //流水詳細
          $scope.rollingRecordDetail = function(rid,agent_info_id,type){
              $modal.open({
                  templateUrl: "views/rolling/rolling-detail.html",
                  controller: 'rollingDetailCtrl',
                  backdrop: 'static',
                  keyboard: false,
//                  windowClass:'lg-modal',
                  resolve: {
                      agent_info_id:function(){
                          return agent_info_id;
                      },rid: function () {
                          return rid;
                      },
                      type: function(){
                          return type;
                      }
                  }
              });
          }

//          $scope.rollingRecordUpdate = function (){
//               $modal.open({
//                  templateUrl: "views/rolling/rolling-list-update.html",
//                  windowClass:'lg-modal',
//                  resolve: {
//                  }
//              });
//          }*/
           //修改備註
          $scope.editRemark = function(record){
              var modalInstance;
              modalInstance = $modal.open({
                  templateUrl: "views/share/edit-remark.html",
                  controller: "rollingEditRemarkCtrl",
                  resolve: {
                      record: function () {
                          return record;
                      }
                  }
              });
              modalInstance.result.then(function() {
                  $scope.select();
              });
          }

     }]).controller('rollingEditRemarkCtrl',['$scope','globalFunction','topAlert','$modalInstance','rollingRecord','record',
      function($scope,globalFunction,topAlert,$modalInstance,rollingRecord,record){
          $scope.title = "修改轉碼明細備註";
          $scope.record_copy = angular.copy(record);
          $scope.record_create = {
              id: $scope.record_copy.id,
              remark: "",
              pin_code: ""
          };

          rollingRecord.get({id:$scope.record_copy.id}).$promise.then(function(rolling_record){
              $scope.record_create = rolling_record;
          });

          $scope.disabled_submit = false;
          $scope.commission_url =  globalFunction.getApiUrl('rolling/rollingRecord');
          $scope.edit = function(){
              if($scope.disabled_submit){return;}
              $scope.disabled_submit = true;
              $scope.form_commission.checkValidity().then(function() {
                  rollingRecord.update($scope.record_create, function () {
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

  }]).controller('rollingDetailCtrl',['$scope','globalFunction','$modalInstance','topAlert','rollingRecord','agent_info_id','rid','type','commissionCard',
      function($scope,globalFunction,$modalInstance,topAlert,rollingRecord,agent_info_id,rid,type,commissionCard){


              $scope.rolling_record = rollingRecord.get(globalFunction.generateUrlParams({id:rid},{rollingCardRecords:{}}));
              $scope._type = type;
              if(type=='edit'){
                  $scope.submit = function(){
                      var record = {};
                      $modalInstance.close(record);
                  }
                  //轉碼碼卡
                  $scope.commissionCards = commissionCard.query({agent_info_id:agent_info_id});
              }

              $scope.submit = function(){
                  rollingRecord.update($scope.rolling_record).$promise.then(function(){
                      topAlert.success('轉碼流水卡類型修改成功！');
                      $scope.reset();
                  });
              }

              $scope.reset = function(){
                  $modalInstance.close('cancel');
              }

              $scope.cancel = function(){
                  $modalInstance.close();
              }


  }])/*.controller('addCardTypeCtrl',['$scope','$modal','$modalInstance','globalFunction','topAlert','cardType','commissionCard','agent_info_id',
      function($scope,$modal,$modalInstance,globalFunction,topAlert,cardType,commissionCard,agent_info_id){
           $scope.type_record = {
               card_id:'',
               card_name:cardType.card_type
           };

          $scope.commissionCards = commissionCard.query(globalFunction.generateUrlParams({agent_info_id:agent_info_id}));
          if(cardType.hasOwnProperty('cards')) {
              $scope.cards = angular.copy(cardType.cards);
              $scope.card_rows  = split(angular.copy(cardType.cards),10);
          }else{
              $scope.commissionCards.$promise.then(function(cards){
                       $scope.cards = angular.copy(cards);
                       $scope.card_rows  = split(cards,10);
                });
          }

          function split(arr, size) {
              var arrays = [];
              while(arr.length > 0) {
                  arrays.push(arr.splice(0, size));
              }
              return arrays;
          }

          $scope.submit = function(){
              cardType.card_type = $scope.type_record.card_name;
              $modalInstance.close();
          }
          $scope.cancel = function(){
              $modalInstance.close();
          }

          //新增卡類型
          $scope.add = function(card_name){
              var card_data = _.where($scope.cards,{'card_name': card_name});
              if(card_data.length>0){
                  topAlert.info("不能添加相同的卡類型");
                  return false;
              }
              var card_record = {
                  "agent_info_id":agent_info_id,
                  "card_name": card_name
              }

              commissionCard.save(card_record).$promise.then(function(){
                  commissionCard.query(globalFunction.generateUrlParams({agent_info_id:agent_info_id}))
                      .$promise.then(function(cards){
                          $scope.cards = angular.copy(cards);
                          $scope.card_rows  = split(cards,10);
                      });
              });
          }

          $scope.close = function(){
              $modalInstance.close($scope.type_record);
          }


  }])*/.controller('rollingSummaryCtrl',['$scope','rolling','getDate','$filter','globalFunction','breadcrumb','tmsPagination','agentsLists','commissionCard','rollingCardAmount','cardAmountTotal','hallName','$location','$modal','$log','currentShift','goBackData','shiftMark','topAlert','user','getMonths','settlementMonth','chipsType',
      function($scope,rolling, getDate, $filter, globalFunction, breadcrumb, tmsPagination,agentsLists, commissionCard, rollingCardAmount,cardAmountTotal,hallName,$location,$modal,$log,currentShift,goBackData,shiftMark,topAlert,user,getMonths,settlementMonth,chipsType){
          breadcrumb.items = [
              {"name":"轉碼卡匯總數","active":true}
          ];

          $scope.chipsTypes = chipsType;
          //聽會
          $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
              return hall.hall_type != 1;
          });

          //查詢條件
          var init_condition = {
              hall_id: "",
              agentInfo: {agent_code: ""},
              agent_group_name: "",
              commission_card_id: "",
              chips_type: "",
              year_month:[currentShift.data.year_month],
              date: ["",""],
              sort: "agent_code NUMASC,card_name NUMASC",
              common_currency_id:""
          }
          $scope.condition = angular.copy(init_condition);
          $scope.excel_condition  = angular.copy(init_condition);
          $scope.excel_condition.commission_card_id = "";
          $scope.condition = goBackData.get('condition',$scope.condition);
          $scope.condition_copy = goBackData.get('condition_copy',$scope.condition);
          //轉碼匯總數
          /*$scope.pagination = tmsPagination.create();
          $scope.pagination.resource = commissionCard;
          $scope.pagination.query_method = "cardLists";*/

          var fix_condition_copy = "";

          $scope.pagination = tmsPagination.create();
          $scope.pagination.resource = rolling;
          $scope.pagination.query_method = "rollingSum";
          $scope.select = function(page){
              $scope.condition.is_amount= '1';
              $scope.condition.year_month[0] = $scope.condition.year_month[0] ? $filter('date')($scope.condition.year_month[0], 'yyyy-MM') : "";
              $scope.condition.date[0] = $scope.condition.date[0] ? $filter('date')($scope.condition.date[0], 'yyyy-MM-dd') : "";
              $scope.condition.date[1] = $scope.condition.date[1] ? $filter('date')($scope.condition.date[1], 'yyyy-MM-dd') : "";
              goBackData.set('condition',$scope.condition);
              goBackData.set('condition_copy',$scope.condition);
              var conditions = fix_condition_copy = angular.copy($scope.condition);
              if(conditions.year_month[0]){
                  conditions.year_month[0] = conditions.year_month[0]+"-01";
              }
              $scope.excel_condition  = angular.copy($scope.condition);
              if($scope.excel_condition.commission_card_id === null){
                  $scope.excel_condition.commission_card_id = "";
              }

              if(!user.isAllHall()){
                  $scope.excel_condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
              }else{ //集團
                  if($scope.condition.hall_id)
                      $scope.excel_condition.halls = [{id:$scope.condition.hall_id, name:(_.findWhere($scope.halls, {id : $scope.condition.hall_id})).hall_name}];
                  else
                      $scope.excel_condition.halls = [];
              }
              delete $scope.excel_condition.hall_id;

              $scope.rollingCardAmounts = $scope.pagination.select(page,conditions);
              delete conditions.is_amount;
              $scope.rolling_amount_sum = cardAmountTotal.get(globalFunction.generateUrlParams(conditions));
          }

          $scope.search = function(){
              settlementMonth.query({is_current:"1",sort:"year_month DESC"}).$promise.then(function(settlementmonths){
                  if(user.hall.hall_type==1){
                      $scope.condition.year_month[0] = getMonths(settlementmonths[0].year_month);
                  }
                  if($scope.condition_copy.year_month[0]){
                      $scope.condition.year_month[0] = $scope.condition_copy.year_month[0];
                  }
                  $scope.select();
              });
          }
          $scope.search();

          //重置
          $scope.reset = function(){
              $scope.condition = angular.copy(init_condition);
//              $scope.condition.year_month[0] = currentShift.data.year_month;
              settlementMonth.query({is_current:"1",sort:"year_month DESC"}).$promise.then(function(settlementmonths){
                  if(user.hall.hall_type==1){
                      $scope.condition.year_month[0] = getMonths(settlementmonths[0].year_month);
                  }
                  $scope.select();
              });
          }
//          $scope.reset();

          //戶口下面轉碼卡
          $scope.$watch('condition.agentInfo.agent_code',globalFunction.debounce(function(new_value,old_value){
              //通過戶口編號查詢戶口信息
              $scope.agent_contact_name = "";
              $scope.condition.commission_card_id = "";
              $scope.commissionCards = {};
              if(new_value && new_value!=""){
                  agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value})).$promise.then(function (agents) {
                      if(agents[0]) {
                          $scope.agent_contact_name = agents[0].agent_name;
                          $scope.commissionCards = commissionCard.query(globalFunction.generateUrlParams({agent_info_id: agents[0].id}));
                      }
                  });
              }
          }));
          //流量轉移
          $scope.rollingRecord = function(rolling_card_amount){
              var modal_instance;
              modal_instance = $modal.open({
                  templateUrl: "views/rolling/rolling-record-detail.html",
                  controller: 'rollingSummaryRecordDetailCtrl',
                  backdrop: 'static',
                  keyboard: false,
                  resolve: {
                      rolling_card_amount:function(){
                          return rolling_card_amount;
                      },
                      condition:function(){
                          return $scope.condition;
                      },
                      login_user:function(){
                          return $scope.user;
                      }
                  }
              });
              modal_instance.result.then((function(status) {
                  if(status){
                      $scope.select();
                  }
              }), function() {
                  $log.info("Modal dismissed at: " + new Date());
              });
          }

          //轉碼卡匯總詳細
          $scope.detail = function(rollingCard_amount,rollingCard_amount_id,agent_code,agent_name,card_name){

              var start_date = fix_condition_copy.date[0] ? fix_condition_copy.date[0] : "";
              var end_date = fix_condition_copy.date[1] ? fix_condition_copy.date[1] : "";
              window.localStorage['start_date'] = start_date;
              window.localStorage['end_date'] = end_date;
              if(start_date || end_date){
                  $location.path('rolling/rolling-summary-detail/'+agent_code+'/'+agent_name+'/'+card_name+'/'+rollingCard_amount+'/'+rollingCard_amount_id);
              }else{
                  $location.path('rolling/rolling-summary-detail/'+agent_code+'/'+agent_name+'/'+card_name+'/'+rollingCard_amount+'/'+rollingCard_amount_id);
              }
              //$location.path('rolling/rolling-summary-detail/'+rollingCard_amount+'/'+rollingCard_amount_id);
          }
    }]).controller('rollingSummaryDetailCtrl',['$scope','rollingCardAmountRecord','rolling','commissionCard','rollingType','tmsPagination','globalFunction','$stateParams','breadcrumb',
        function($scope,rollingCardAmountRecord,rolling,commissionCard,rollingType,tmsPagination,globalFunction,$stateParams,breadcrumb){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"轉碼卡匯總數","url":'rolling/rolling-summary'},
                {"name":"轉碼卡匯總數詳細","active":true}
            ];
//            $scope.condition={rollingCardAmount:{commissionCard:{id:""}}};
            $scope.condition = {
                rollingCard_amount_id:"",
                is_offset: 0,
                shiftMark:
                {
                    shift_date: []
                }
            };
            $scope.agent_code = $stateParams.agent_code;
            $scope.agent_name = $stateParams.agent_name;
            $scope.card_name = $stateParams.card_name;
            $scope.condition.shiftMark.shift_date[0] = window.localStorage['start_date'] ?  window.localStorage['start_date'] : "";
            $scope.condition.shiftMark.shift_date[1] = window.localStorage['end_date'] ? window.localStorage['end_date'] : "";
            $scope.rollingType = rollingType;

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = rollingCardAmountRecord;
            $scope.select = function(page){

                $scope.rollingCardAmounts = $scope.pagination.select(page,globalFunction.generateUrlParams($scope.condition));
                window.localStorage['end_date'] = '';
                window.localStorage['start_date'] = '';
            }
            if($stateParams.id){
//                $scope.commission_card = commissionCard.get({id:$stateParams.id});
                $scope.rollingCard_amount = $stateParams.id;
            }
            if($stateParams.rollingCard_amount_id){
                $scope.condition.rollingCard_amount_id = $stateParams.rollingCard_amount_id;
                $scope.select();
            }

   }]).controller('rollingSummaryRecordDetailCtrl',['$scope','$filter','agentsLists','commissionCard','globalFunction','tmsPagination','user','rollingCardAmount','rolling_card_amount', 'condition','$modalInstance', 'rollingCardTransfer', 'topAlert', 'shiftMarks', 'currentShift', 'getAppointDay', 'dateComp','chipsType','login_user',
       function($scope,$filter,agentsLists,commissionCard,globalFunction,tmsPagination,user,rollingCardAmount,rolling_card_amount,condition,$modalInstance, rollingCardTransfer ,topAlert, shiftMarks, currentShift, getAppointDay, dateComp,chipsType,login_user){
              //轉移流量
              //$scope.addRollingCard = login_hall == '1AE7283167B57D1DE050A8C098155859' ? true : false;
//              $scope._rolling_card = [];
              $scope.user = login_user;
              $scope.shiftMarks = shiftMarks;
              $scope.hall_name = user.hall.hall_name;
              $scope.agent_name_out = rolling_card_amount.agent_name;
              $scope.agent_code = rolling_card_amount.agent_code;
              $scope.card = rolling_card_amount.card_name;
              $scope.chips_type = chipsType.items[rolling_card_amount.chips_type];
              $scope.card_amount_total = rolling_card_amount.rollingCard_amount;
              $scope.show_btn = false;
              $scope.sub_post_put = 'POST';
              $scope.rollingTransfer_url = globalFunction.getApiUrl('rolling/rollingcardtransfer');
              $scope.form_create_card_url = globalFunction.getApiUrl('commissionsetting/commissioncard');//轉碼卡驗證
              $scope.isDisabled = false;
              $scope.model_con = {receive_agent_code : $scope.agent_code};
              $scope.btn_title ='新增';

              //截月
              $scope.year_month = rolling_card_amount.year_month ? $filter('date')(new Date(rolling_card_amount.year_month.replace(/\-/g, "\/")),'yyyy-MM-01') : "";
              //截更日期
              $scope.shift_date = currentShift.data.shift_date ? $filter('date')(new Date(currentShift.data.shift_date.replace(/\-/g, "\/")),'yyyy-MM-01') : "";

              $scope.rollingRecord = {
                  in_agent_id :'',
                  chips_type: rolling_card_amount.chips_type ? rolling_card_amount.chips_type : "",
                  in_comm_card_id :'',
                  out_agent_id : rolling_card_amount.agent_info_id,
                  out_comm_card_id : rolling_card_amount.id,
                  rollingCard_amount_id:rolling_card_amount.rollingCard_amount_id,
                  amount :"",
                  remark:'',
                  shift_date: currentShift.data.shift_date,
                  shift: shiftMarks.morning,
                  is_add_card: "0",
                  card_name: "",
                  year_month:condition.year_month[0],
                  pin_code:''
              }
           $scope.init_rollingRecord = angular.copy($scope.rollingRecord);

           //如果截月小于
           if(dateComp($scope.shift_date,$scope.year_month)>0){
               var date = $scope.year_month.split('-');
               $scope.rollingRecord.shift_date = getAppointDay(date[0],date[1],1); //当前截月最后一天的前一天
           }else{
               $scope.rollingRecord.shift = currentShift.data.shift;
           }

           $scope.commissionCards = [];
           //獲取rollingCard_amount_id
//           $scope.pagination = tmsPagination.create();
//           $scope.pagination.resource = rollingCardAmount;
//           $scope.new_conditions ={commission_card_id:rolling_card_amount.id,year_month:condition.year_month+"-01"};
//           $scope._rolling_card =  $scope.pagination.select(1,$scope.new_conditions);

              $scope.$watch('model_con.receive_agent_code',globalFunction.debounce(function(new_value,old_value){
                  $scope.agent_name = "";
                  $scope.rollingRecord.in_agent_id = "";
                  $scope.rollingRecord.in_comm_card_id = "";
                  $scope.commissionCards = [];
                  if(new_value){
                      agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value},{})).$promise.then(function (agent) {
                          if (agent.length > 0) {
                              $scope.agent = agent[0];
                              $scope.rollingRecord.in_agent_id = $scope.agent.id;
                              $scope.agent_name = $scope.agent.agent_name;
                              commissionCard.query({agent_info_id:$scope.agent.id}).$promise.then(function(commissionCards){
                                  $scope.commissionCards = commissionCards;
                              });
                          }
                      })
                  }
              }))

           $scope.rollingRecordCard = function(){
               $scope.show_btn =  !$scope.show_btn;
               if($scope.show_btn){
                  $scope.btn_title ='選擇';
               }else{
                   $scope.btn_title ='新增';
               }
           }
           $scope.add = function () {
               if (isNaN(+($scope.rollingRecord.amount))) {
                   topAlert.warning("轉出流量必须为数字");
                   return;
               }
              if($scope.isDisabled){
                  return $scope.isDisabled;
              }
              if(parseFloat($scope.rollingRecord.amount) > parseFloat(rolling_card_amount.rollingCard_amount)){
                topAlert.warning("轉出流量不能大於本月總額!");
                return;
              }
              if($scope.show_btn){
                  $scope.rollingRecord.is_add_card = '1';
                  $scope.rollingRecord.in_comm_card_id = '';
              }else{
                  $scope.rollingRecord.is_add_card = '0';
                  $scope.rollingRecord.card_name = '';
              }
//                  if($scope._rolling_card.length){
//                      $scope.rollingRecord.rollingCard_amount_id = $scope._rolling_card[0].id;
//                  }

              var tis = "轉碼卡流量轉移成功。";
              $scope.isDisabled = true;
              $scope.form_add_transfers.checkValidity().then(function(){
                  if(typeof ($scope.rollingRecord.shift_date)=='string'){
                      $scope.rollingRecord.shift_date = $scope.rollingRecord.shift_date ? $filter('date')(new Date($scope.rollingRecord.shift_date.replace(/\-/g, "\/")), 'yyyy-MM-dd') : "";
                  }else{
                      $scope.rollingRecord.shift_date = $scope.rollingRecord.shift_date ? $filter("date")($scope.rollingRecord.shift_date,'yyyy-MM-dd') : "";
                  }

                  rollingCardTransfer.save($scope.rollingRecord, function () {
                      $scope.rollingRecord = angular.copy($scope.init_rollingRecord);
                      topAlert.success(tis);
                      $modalInstance.close(true);
                      $scope.isDisabled = false;
                  },function(){
                      $scope.isDisabled = false;
                  });
              });
          }
          $scope.reset = function()
          {
              $modalInstance.close(false);
          }

           /**
            * 新增轉碼卡
            */
           $scope.card_record = {
               "card_name":  "",
               "card_pin_code": ""
           }

           $scope.add_rollingRecord = function (card_name,pin_code) {
               if(!$scope.rollingRecord.in_agent_id){
                    topAlert.warning("請輸入正確的轉入戶口!");
                     return;
               }
               if(!$scope.card_record.card_name){
                   topAlert.warning("請輸入卡名稱!");
                   return;
               }
//               $scope.form_rolling_card.checkValidity().then(function() {
                   var card_data = _.where($scope.commissionCards, {'card_name': $scope.card_record.card_name});
                   if (card_data.length > 0) {
                       topAlert.info("不能添加相同的卡類型");
                       return false;
                   }
                   var card_record = {
                       "agent_info_id":  $scope.rollingRecord.in_agent_id,
                       "card_name":  $scope.card_record.card_name,
                       "pin_code": $scope.card_record.card_pin_code
                   }
                   commissionCard.save(card_record).$promise.then(function () {
                       topAlert.success("新增轉碼卡成功！");
                       commissionCard.query(globalFunction.generateUrlParams({agent_info_id: $scope.rollingRecord.in_agent_id}))
                           .$promise.then(function (cards) {
                               card_name = "";
                               $scope.commissionCards = angular.copy(cards);
                               $scope.disable_add = false;
                               $scope.show_btn = true;
                           },function(){
                                $scope.disable_add = false;
                                $scope.show_btn = true;
                       });
                   });
//               });
           }

          }]).controller('rollingCardRecordCtrl',['$scope','getDate','$filter','globalFunction','breadcrumb','tmsPagination','agentsLists','mainScene','sceneRecord','shiftMarks','hallName','currentShift','$modal','chipsType',
          function($scope, getDate, $filter, globalFunction, breadcrumb, tmsPagination,agentsLists, mainScene,sceneRecord,shiftMarks,hallName,currentShift,$modal,chipsType){
              breadcrumb.items = [
                  {"name":"轉碼場次記錄","active":true}
              ];
              //籌碼類型
              $scope.chipsTypes = chipsType;

              //聽會
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){
                  return hall.hall_type != 1;
              });
              $scope.shiftMarks = shiftMarks;
              //戶口下面轉碼卡
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value,old_value){
                  //通過戶口編號查詢戶口信息
                  $scope.agent_contact_name = "";
                  $scope.commissionCards = {};
                  if(new_value && new_value!=""){
                      agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value})).$promise.then(function (agents) {
                          if(agents[0]) {
                              $scope.agent_contact_name = agents[0].agent_name;
                          }
                      });
                  }
              }));

              //查詢條件
              var init_condition = {
                  hall_id:"",
                  agent_code: "" ,
                  main_scene_no:"",
                  is_scene_open:"0",
                  rolling:{chips_type:""},
                  outShiftMark: {
                      shift_date: [],
                      shift:"",
                      year_month:currentShift.data.year_month
                  },
                  sort:"status DESC,agent_code NUMASC,hall_id ASC,in_time DESC"
                  /*shift_date:[currentShift.data.year_month]
                  out_time : ["",""],
                  shiftMark:{
                      shift:"",
                      year_month:currentShift.data.year_month
                  },*/
              }
              $scope.condition = angular.copy(init_condition);
              $scope.excel_condition  = angular.copy(init_condition);
              //轉碼匯總數
              $scope.pagination = tmsPagination.create();
              $scope.pagination.resource = mainScene;//.query(globalFunction.generateUrlParams({},{agentInfo:{}}));
              $scope.select = function(page){
                  /*$scope.condition.out_time[0] = $filter('date')($scope.condition.out_time[0], 'yyyy-MM-dd');
                  $scope.condition.out_time[1] = $filter('date')($scope.condition.out_time[1], 'yyyy-MM-dd');*/
                  var conditions = angular.copy($scope.condition);
                  $scope.excel_condition = angular.copy($scope.condition);

//                  conditions.agent_code = conditions.agent_code ? conditions.agent_code+"!" : "";
                  conditions.outShiftMark.shift_date[0] = $scope.condition.outShiftMark.shift_date[0] ? $filter('date')($scope.condition.outShiftMark.shift_date[0], 'yyyy-MM-dd') : "";
                  conditions.outShiftMark.shift_date[1] = $scope.condition.outShiftMark.shift_date[1] ? $filter('date')($scope.condition.outShiftMark.shift_date[1], 'yyyy-MM-dd') : "";
                  conditions.outShiftMark.year_month =  conditions.outShiftMark.year_month ? $filter('date')(new Date($scope.condition.outShiftMark.year_month), 'yyyy-MM-01') : "";

                  $scope.excel_condition.outShiftMark.shift_date[0] = $scope.condition.outShiftMark.shift_date[0] ? $filter('date')($scope.condition.outShiftMark.shift_date[0], 'yyyy-MM-dd') : "";
                  $scope.excel_condition.outShiftMark.shift_date[1] = $scope.condition.outShiftMark.shift_date[1] ? $filter('date')($scope.condition.outShiftMark.shift_date[1], 'yyyy-MM-dd') : "";
                  $scope.excel_condition.outShiftMark.year_month = $scope.condition.outShiftMark.year_month ? $filter('date')(new Date($scope.condition.outShiftMark.year_month), 'yyyy-MM') : "";
                  $scope.excel_condition.agent_code = $scope.condition.agent_code ? $scope.condition.agent_code : "";

                  $scope.rollingCards = $scope.pagination.select(page,globalFunction.generateUrlParams(conditions,{outShiftMark:{}}));
              }
              $scope.select();

              //查詢
              $scope.search = function(){
                  $scope.select();
              }

              //重置
              $scope.reset = function(){
                  $scope.condition = angular.copy(init_condition);
                  $scope.form_search.$setPristine();
                  $scope.select();
              }

              /**
               *轉碼卡記錄修改
               */
              $scope.update = function(rollingCard){
                      var scene_data = {
                          scene_id: rollingCard.id,
                          agent_info_id: rollingCard.agent_info_id,
                          rolling_id: rollingCard.rolling_id,//get_scene.rolling_id,
                          scene_no: rollingCard.main_scene_no,//get_scene.main_scene_no,
                          agent_code: rollingCard.agent_code,
                          agent_name: rollingCard.agent_name,
                          quota_remark : rollingCard.remark,
                          is_edit:true
                      };

                      $modal.open({
                          templateUrl: "views/rolling/rolling-departure.html",
                          controller: 'rollingDepartureCtrl',
                          windowClass:'lg-modal',
                          resolve: {
                              scene_data : function(){
                                  return scene_data;
                              }
                          }
                      });
              }
              /**
               * 轉碼卡記錄詳細
               */
              $scope.detail = function(rollingCard){
                  var scene_data = {
                      scene_id: rollingCard.id,
                      agent_info_id: rollingCard.agent_info_id,
                      rolling_id: rollingCard.rolling_id,//get_scene.rolling_id,
                      scene_no: rollingCard.main_scene_no,//get_scene.main_scene_no,
                      agent_code: rollingCard.agent_code,
                      agent_name: rollingCard.agent_name

                  };

                  $modal.open({
                      templateUrl: "views/rolling/rolling-departure-detail.html",
                      controller: 'rollingDepartureDetailCtrl',
                      windowClass:'lg-modal',
                      resolve: {
                          scene_data : function(){
                              return scene_data;
                          }
                      }
                  });
              }

          }]).controller('rollingDailyListCtrl',[ '$scope','$timeout','$filter','$location','user','breadcrumb','topAlert','globalFunction','tmsPagination','hallName','getRollingRecord','areaCode','agentsLists','currentShift','getYesterday',
          function($scope,$timeout,$filter,$location,user,breadcrumb,topAlert,globalFunction,tmsPagination,hallName,getRollingRecord,areaCode,agentsLists,currentShift,getYesterday){
              breadcrumb.items = [
                  {"name":"轉碼日結","active":true}
              ];

              $scope.areaCodes = areaCode.query();
              hallName.query({hall_type:'|1',sort:"hall_type asc,create_time asc"}).$promise.then(function(halls){
                  $scope.halls = halls;
              });

              //获取昨天日期
              var init_condition = {
                  agent_code:"",
                  //shift_date:currentShift.data.shift_date
                  shift_date:getYesterday(currentShift.data.shift_date),
                  settlement_month:currentShift.data.year_month

              }
              $scope.condition = angular.copy(init_condition);
              $scope.excel_condition = angular.copy(init_condition);
              $scope.getRollingRecords =[];
              $scope.select = function(){
//                  if(!$scope.condition.shift_date){
//                      $scope.condition.shift_date = currentShift.data.shift_date;
//                  }
                  var conditions = angular.copy($scope.condition);
                  if(conditions.shift_date){
                      conditions.shift_date = $filter('date')(conditions.shift_date, 'yyyy-MM-dd');
                  }
                  if(conditions.settlement_month){
                      conditions.settlement_month = $filter('date')(conditions.settlement_month, 'yyyy-MM');
                  }
//                  if(!user.hall.hall_type || user.hall.hall_type == 1){
//                      $scope.condition.shift_date = getYesterday();
//                  }
                  /*if(conditions.agent_code){
                      conditions.agent_code =conditions.agent_code+"!";
                  }*/
                  $scope.excel_condition = angular.copy(conditions);
                  getRollingRecord.query(globalFunction.generateUrlParams(conditions,{})).$promise.then(function(_getRollingRecords){
//                      _.each(_getRollingRecords,function(_getRollingRecord){
//                          _getRollingRecord.monthly_rolling -= _getRollingRecord.hall2;
//                      })
                      $scope.getRollingRecords = _getRollingRecords;
                  });
              }
              $scope.select();

              $scope.search = function(){

                if($scope.condition.settlement_month && $scope.condition.shift_date)
                {
                    $scope.select(1);
                }
                else
                {
                    if(!$scope.condition.settlement_month)
                    {
                        topAlert.warning("年月不能為空")
                    }
                    if(!$scope.condition.shift_date)
                    {
                        topAlert.warning("日期不能為空")
                    }
                    return
                }
//                  if(!$scope.condition.shift_date){
//                      $scope.condition.shift_date = currentShift.data.shift_date;
//                  }
//                  var conditions = angular.copy($scope.condition);
//                  if($scope.condition.shift_date){
//                      $scope.condition.shift_date = $filter('date')($scope.condition.shift_date, 'yyyy-MM-dd');
//                  }
//                  $scope.excel_condition = angular.copy(conditions);
//                  getRollingRecord.query(globalFunction.generateUrlParams(conditions,{})).$promise.then(function(_getRollingRecord){
//                      $scope.getRollingRecords = _getRollingRecord;
//                  });
              }

              $scope.reset = function(){
                  $scope.condition = angular.copy(init_condition);
                  $scope.select();
              }
              //選取發送
              $scope.redirectSMS = function(){
                  $location.path('/rolling/rolling-daily-notice');
              }
              //户口編號監控
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value,old_value){
                  if(new_value){
                      agentsLists.query({agent_code:new_value}, {}).$promise.then(function (agents) {
                          if(agents.length > 0){
                              $scope.agent_name = agents[0].agent_name;
                          }else{
                              $scope.agent_name = "";
                          }
                      });
                  }else{
                      $scope.agent_name = "";
                  }
              }));


          }]).controller('rollingDailyNoticeCtrl',[ //貸款追收管理-發送SMS
              '$scope','$timeout','$filter','$location','breadcrumb','topAlert','globalFunction','tmsPagination','getYesterday','getTomorrow','hallName','getRollingRecord','areaCode','agentsLists','smsGroup','smsRecord','pinCodeModal','currentShift',
              function($scope,$timeout,$filter,$location,breadcrumb,topAlert,globalFunction,tmsPagination,getYesterday,getTomorrow,hallName,getRollingRecord,areaCode,agentsLists,smsGroup,smsRecord,pinCodeModal,currentShift){
                  breadcrumb.items = [
                      {"name":"轉碼日結","url": "/rolling/rolling-daily-list"},
                      {"name":"發送SMS","active":true}
                  ];

                  //發送短信
                  var init_record = {
                      "pin_code":"",
                      "sms_type":"1",
                      "priority":"1",
                      "is_sys":"0",
                      "content":"",
                      "type": 71,
                      "phoneNumbers":[
                          {
                              "agent_code":"",
                              "area_code":"",
                              "telephone_number":""
                          }
                      ]
                  }
                  $scope.record_create = angular.copy(init_record);

                  $scope.areaCodes = areaCode.query();
                 hallName.query({hall_type:"|1",sort:"hall_type asc,create_time asc"}).$promise.then(function(halls){
                     $scope.halls = halls;
                  });
                  var init_condition_search = {
                      shift_date: getYesterday(currentShift.data.shift_date),
                      settlement_month:currentShift.data.year_month
              }
                  $scope.condition_search = angular.copy(init_condition_search);
                  $scope.search_select = function(){
                      $scope.condition_copy = angular.copy($scope.condition_search);
                      if($scope.condition_copy.shift_date){
                          $scope.condition_copy.shift_date = $filter('date')($scope.condition_copy.shift_date, 'yyyy-MM-dd');
                      }else{
                          $scope.condition_copy.shift_date = $filter('date')(new Date(), 'yyyy-MM-dd');
                      }
                      $scope.condition_copy.settlement_month = $filter('date')($scope.condition_copy.settlement_month, 'yyyy-MM');
                      getRollingRecord.query($scope.condition_copy).$promise.then(function(_getRollingRecord){
                              $scope.getRollingRecords = _getRollingRecord;

                          });
                  }
                  $scope.search_select();

                  $scope.edit_disabled = true;
                  //選取發送
                  var init_multi_record = {
                      date: "",
                      month: "",
                      type_code: "ROLLING",
                      agents: []
                  }
                  $scope.multiRecord = angular.copy(init_multi_record);
                  $scope.sendSMS = function(){
                      if($scope.condition_search.shift_date){
                          $scope.condition_search.shift_date = $filter('date')($scope.condition_search.shift_date, 'yyyy-MM-dd');
                      }else{
                          $scope.condition_search.shift_date = $filter('date')(new Date(), 'yyyy-MM-dd');
                      }
                      $scope.condition_search.settlement_month = $filter('date')($scope.condition_search.settlement_month, 'yyyy-MM');
                      var expiredMarkerTotals_len = _.where($scope.getRollingRecords,{checked:true});
                      $scope.agents_sms_content = [];
                      _.each(expiredMarkerTotals_len,function(em){
                          $scope.agents_sms_content.push({
                              agent_info_id: em.agent_info_id,
                              recordIDs: em.sms_id ? em.sms_id : []
                          });
                      });
                      $scope.multiRecord.date = $scope.condition_search.shift_date;
                      $scope.multiRecord.month = $scope.condition_search.settlement_month;
                      $scope.multiRecord.agents = $scope.agents_sms_content;

                      if(expiredMarkerTotals_len.length>0){

                          pinCodeModal(smsRecord, 'multiSms' , $scope.multiRecord, '發送成功').then(function(){
                              $scope.agents_sms_content = [];
                              $scope.multiRecord = angular.copy(init_multi_record);
                              _.each(expiredMarkerTotals_len,function(em){
                                  em.checked = false;
                              });
                          });
                      }else{
                          topAlert.warning("請您選擇轉碼數記錄")
                      }
                  }

                  //添加號碼
                  $scope.sendTels_new = [];
                  $scope.add_tel = function(){
                      $scope.sendTels_new['key_'+$scope.agent_info_id].push({
                          agent_contact_name: "",
                          area_code: "",
                          phone_number: ""
                      });
                  }

                  //刪除號碼
                  /*$scope.del_tel = function($index){
                      $scope.sendTels_new['key_'+$scope.agent_info_id].splice($index,1);
                  }

                  $scope.remove = function($index){
                      $scope.sendTels['key_'+$scope.agent_info_id].splice($index,1);
                      //$scope.expiredMarker.sendTels.splice($index,1);
                  }*/

                  //選擇發送的內容
                  //$scope.sendTels = {};
                  $scope.agentSmsNotice = [];
                  $scope.sms_content = [];
                  $scope.selectSendSMS = function(getRollingRecord){
                      var StranLink_Obj=document.getElementById("StranLink")
                      var StranLink_Obj1=document.getElementById("StranLink1");
                      StranLink_Obj.style.backgroundColor = '#65A34D';StranLink_Obj.style.color = 'white';StranLink_Obj.style.border = '#65A34D solid 1px';
                      StranLink_Obj1.style.backgroundColor = '';StranLink_Obj1.style.color = '';StranLink_Obj1.style.border = '#ccc solid 1px';
                      window['textAreaValue'] = ''; //清空繁體和簡體轉換的內容
                      $scope.getRollingRecord = getRollingRecord;

                      $scope.agent_info_id = getRollingRecord.agent_info_id;
                      $scope.group_select();
                      $scope.agent_code = getRollingRecord.agent_code;
                      if($scope.getRollingRecord.sms_id){
                          $scope.agentSmsNotice = angular.copy($scope.agentSmsNotice_local['key_'+$scope.agent_info_id]); // = $scope.sendTels['key_'+$scope.agent_info_id]
                          //$scope.sendTels_new['key_'+$scope.agent_info_id];
                          $scope.tel_content = angular.copy($scope.tel_content_local['key_'+$scope.agent_info_id]);
                          $scope.record_create.content = angular.copy($scope.sms_content_local['key_' + $scope.agent_info_id]);// $scope.sendContent(_expiredMarker);
                          $scope.selected_group_content = angular.copy($scope.selected_group_content_local['key_'+$scope.agent_info_id]);

                      }else{
                          $scope.cancel();
                          agentsLists.agentSmsNotice({agent_info_id: getRollingRecord.agent_info_id, type_code:'ROLLING'})
                              .$promise.then(function(phoneNumbers){
                                  //$scope.agentSmsNotice = $scope.sendTels['key_'+$scope.agent_info_id] = phoneNumbers;
                                  //$scope.sendTels_new['key_'+$scope.agent_info_id] = [{agent_contact_name: "", area_code: "", telephone_number: ""}];
                                  //發送的內容
                                  $scope.record_create.content = $scope.sms_content['key_' + $scope.agent_info_id] = $scope.sendContent(getRollingRecord);
                                  $scope.tel_content = [];
                                  $scope.record_create.content = $scope.sendContent(getRollingRecord);
                                  $scope.agentSmsNotice = phoneNumbers;

                              });

                      }

                  }

                  $scope.sendContent = function(getRollingRecord){

                      if(getRollingRecord.rolling.substring(getRollingRecord.rolling.length-3,getRollingRecord.rolling.length) == ".00"){
                          getRollingRecord.rolling = getRollingRecord.rolling.substring(0,getRollingRecord.rolling.length-3)
                      }
                      if(getRollingRecord.monthly_rolling.substring(getRollingRecord.monthly_rolling.length-3,getRollingRecord.monthly_rolling.length) == ".00"){
                          getRollingRecord.monthly_rolling = getRollingRecord.monthly_rolling.substring(0,getRollingRecord.monthly_rolling.length-3)
                      }

                      var date = $scope.condition_copy.shift_date ? getTomorrow($scope.condition_copy.shift_date) : currentShift.data.shift_date;
                      date = $filter("date")(date,'MM月dd日');
                      $scope.isReadonly = true;
                      var sms_content = "";
                      sms_content = "【長城集團轉碼匯總】\n";
                      sms_content += "截至"+date+"早上7時\n";
                      sms_content += "戶口："+$scope.getRollingRecord.agent_code+"("+$scope.getRollingRecord.agent_contact_name+")\n";
                      _.each($scope.halls,function(_hall,index){
                          //if(Number($scope.getRollingRecord['hall'+index])){
                              sms_content+= _hall.hall_name+"["+$scope.getRollingRecord['hall'+index]+"萬]\n";
                          //}
                      });

                      //sms_content+="轉碼總數："+getRollingRecord.rolling+"萬\n";
                      sms_content+="本日轉碼總數："+getRollingRecord.rolling+"萬\n";
                      _.each($scope.halls,function(_hall,index){

                              sms_content+= _hall.hall_name+"本月轉碼："+$scope.getRollingRecord['hall_month'+index]+"萬\n";

                      });
                      //sms_content+="本月轉碼總數："+getRollingRecord.monthly_rolling+"萬\n";
                      sms_content+="(如有錯漏，請以賬房數據為準)";

                      return sms_content;
                  }

                  $scope.detail = function(){
                      $location.path("loan/loan-recovery-sms");
                  }

                  $scope.isReadonly = true;
                  //編輯
                  $scope.edit = function(){
                      $scope.isReadonly = false;
                  }

                  //保存
                  $scope.save = function(){
                      $scope.isReadonly = true;
                  }

                  //取消
                 /* $scope.cancel = function(){
                      $scope.isReadonly = true;
                      agentsLists.agentSmsNotice({agent_info_id: $scope.agent_info_id, type_code:'ROLLING'})
                          .$promise.then(function(phoneNumbers){
                              $scope.sendTels['key_'+$scope.agent_info_id] = phoneNumbers;
                              $scope.sendTels_new['key_'+$scope.agent_info_id] = [{agent_contact_name: "", area_code: "", telephone_number: ""}];
                              //發送的內容
                              $scope.sms_content['key_' + $scope.agent_info_id] = $scope.sendContent();
                          });
                  }*/


                  //全選
                  $scope.record = {
                      isCheckedAll : false
                  }
                  $scope.checkedAll = function() {

                      if ($scope.record.isCheckedAll) {
                          _.each($scope.getRollingRecords,function(getRollingRecord){
                              getRollingRecord.checked = true;
                          })
                      }else{
                          _.each($scope.getRollingRecords,function(getRollingRecord){
                              getRollingRecord.checked = false;
                          })
                      }
                  }

                  //===========發送SMS=============

                  //初始化列表數據
                  var init_new_record = {
                      search_type: "agent",
                      keyword: ""
                  }
                  $scope.new_record = angular.copy(init_new_record);
                  /*$scope.pagination = tmsPagination.create();
                   $scope.pagination.resource = smsGroup;*/
                  $scope.group_select = function(){
                      $scope.condition_key_copy = angular.copy($scope.new_record);
                      if($scope.condition_key_copy.keyword){
                          $scope.condition_key_copy.keyword = $scope.condition_key_copy.keyword+"!";
                      }
                      smsGroup.query({sms_group_name: $scope.condition_key_copy.keyword}).$promise.then(function(_smsGroup){
                          //不顯示選取的群組
                          _.each($scope.selected_group_content,function(selected_group){
                              var selected_data = _.findWhere(_smsGroup,{id:selected_group.id});
                              if(selected_data){
                                  selected_data.is_selected = true;
                              }
                          });
                          $scope.sms_groups = _smsGroup;
                      });
                  }

                  //輸入號碼
                  $scope.isWriteFlag = false;
                  $scope.write_num = function(){
                      $scope.isWriteFlag = true;
                      $scope.tel_record = angular.copy(init_tel_record);
                  }

                  //選擇搜索項
                  $scope.placeholder = "戶口查詢";
                  $scope.change_search_type = function(){
                      $scope.new_record.keyword="";
                      if($scope.new_record.search_type=="agent"){  //戶口查詢
                          $scope.placeholder = "戶口查詢";
                      }else if($scope.new_record.search_type=="group"){ //群組查詢
                          $scope.placeholder = "群組查詢";
                      }
                  }

                  $scope.search_list = function(){
                      if($scope.new_record.search_type=="agent"){  //戶口查詢
                          $scope.agent_watch();

                      }else if($scope.new_record.search_type=="group"){ //群組查詢
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
                      //$scope.selected_group_content['key_'+$scope.agent_info_id] = [];
                      $scope.isSelectDisabled = true;
                      smsGroup.get(globalFunction.generateUrlParams({id: record.id}, {smsGroupSubs: {}})).$promise.then(function (_smsGroup) {
                          //$scope.record_create.department_id = _smsGroup.department_id;
                          //$scope.tel_content[record.id] = _smsGroup.smsGroupSubs;
                          $scope.tel_content.push(_smsGroup.smsGroupSubs);
                          $scope.tel_content= _.flatten($scope.tel_content);
                          $scope.isSelectDisabled = false;
                      });
                      //隱藏選中的群組
                      record.is_selected = true;
                      $scope.selected_group_content.push(record);
                  }

                  //取消選中戶組
                  $scope.cancel_selected = function (record, index) {
                      var groups_data = _.findWhere($scope.sms_groups, {id: record.id});
                      var cancel_group = _.where($scope.tel_content , {sms_group_id: record.id});
                      if (groups_data) {
                          groups_data.is_selected = false;
                      }
                      $scope.selected_group_content.splice(index, 1);
                      $scope.tel_content = _.difference($scope.tel_content, cancel_group);
                  }

                  //通過戶口查詢
                  /*$scope.isHiddenCode = false;
                  $scope.$watch('tel_record.agent_code', globalFunction.debounce(function (new_value, old_value) {
                      $scope.tel_record.agent_name = "";
                      $scope.tel_record.telephone_number = "";
                      if (new_value) {
                          agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {refTelAgentMasterNoticeType: {agentContactTel: ''}}))
                              .$promise.then(function (agents) {
                                  if (agents[0]) {
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
                  }));*/

                  //通過戶口查詢
                  $scope.isHiddenCode = false;
                  $scope.agent_watch = function(){
                      $scope.tel_record.agent_name = "";
                      $scope.tel_record.telephone_number = "";
                      if($scope.new_record.keyword){
                          agentsLists.query(globalFunction.generateUrlParams({agent_code:$scope.new_record.keyword},{refTelAgentMasterNoticeType:{agentContactTel:''}}))
                              .$promise.then(function(agents){
                                  if(agents[0]) {
                                      $scope.tel_record.agent_code = agents[0].agent_code;
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
                              var tel_data = _.where($scope.tel_content, {area_code_id: _sys_tel.agentContactTel.area_code_id, telephone_number: _sys_tel.agentContactTel.telephone_number});
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
                          var tel_data = _.where($scope.tel_content, {area_code_id: $scope.tel_record_copy.area_code_id, telephone_number: $scope.tel_record_copy.telephone_number});
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

                  //保存短信草稿
                  $scope.send_sms_url = globalFunction.getApiUrl('sms/smsrecord');
                  //監聽内容是否改变
                  $scope.$watch('record_create.content',function(newValue){
                      if (newValue) {
                          window['textAreaValue'] = '';
                      }
                  });
                  $scope.submit = function() {
                      if($scope.isDisabled) { return $scope.isDisabled; }
                      $scope.isDisabled = true;

                      if(!$scope.agent_info_id){
                          topAlert.warning("請選擇要編輯的戶口");
                          return;
                      }

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

                      _.each($scope.tel_content, function (tel) {
                          $scope.phoneNumbers.push({
                              agent_code: tel.agent_code,
                              agent_name: tel.agent_name,
                              area_code: tel.area_code,
                              telephone_number: tel.telephone_number
                          });
                      });
                      //return false;

                      //普通發送
                      $scope.record_create.phoneNumbers = $scope.phoneNumbers;

                      $scope.form_send_sms.checkValidity().then(function () {
                          if(window['textAreaValue']){   //storm.xu
                              $scope.record_create.content = window['textAreaValue'];  //storm.xu
                          }

                          smsRecord.smsDraft($scope.record_create).$promise.then(function (result) {
                              topAlert.success('草稿保存成功');
                              //本地保存草稿
                              $scope.getRollingRecord.sms_id = result.id;
                              $scope.localSaveSMS();
                              $scope.record_create.pin_code='';//清空操作密码
                              //$scope.cancel();
                              $scope.isDisabled = false;
                              $scope.isReadonly = true;//禁止編輯
                          }, function () {
                              $scope.isDisabled = false;
                          });
                      });
                  };

                  //保存信息草稿到本地
                  $scope.agentSmsNotice_local = [];
                  $scope.tel_content_local = [];
                  $scope.selected_group_content_local = [];
                  $scope.sms_content_local = [];
                  $scope.localSaveSMS = function(){
                      $scope.agentSmsNotice_local['key_'+$scope.agent_info_id] = angular.copy($scope.agentSmsNotice);
                      $scope.tel_content_local['key_'+$scope.agent_info_id] = angular.copy($scope.tel_content);
                      $scope.selected_group_content_local['key_'+$scope.agent_info_id] = angular.copy($scope.selected_group_content);
                      $scope.sms_content_local['key_'+$scope.agent_info_id] = angular.copy($scope.record_create.content);
                  }

                  $scope.cancel = function(){
                      //清空選取的電話
                      $scope.tel_content = [];
                      //取消選中群/戶組
                      _.each($scope.selected_group_content,function(_selected_group){
                          _selected_group.is_selected = false;
                      });
                      $scope.selected_group_content = [];
                      //清空其他信息
                      $scope.sms_type = $scope.record_create.sms_type;
                      $scope.record_create = angular.copy(init_record);
                      $scope.record_create.sms_type = $scope.sms_type;

                      $scope.agentSmsNotice = [];
                  }


      }]);
}).call(this);
