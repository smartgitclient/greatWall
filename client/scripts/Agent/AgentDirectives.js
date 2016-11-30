(function() {
  'use strict';
  angular.module('app.agent.directives', []).directive('shortcutKey', ['$location',
    function($location) {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
            var TAB_KEY  = 9;
            var key_map = {
                "F1":112,
                "F2":113,
                "F3":114,
                "F4":115,
                "F5":116,
                "F6":117,
                "F7":118,
                "F8":119,
                "F9":120
            }
            if(key_map.hasOwnProperty(attrs.shortcutKey)){
                if(!attrs.shortcutWindow){
                    ele.attr('value',ele.html());
                }

                var key = key_map[attrs.shortcutKey];
                $('body').on('keydown', function(e){
                    //快捷键功能只在户口速查页面有效
                    if( -1 != $location.url().indexOf('/agent/agent-detail') ||
                        -1 != $location.url().indexOf('/agent/agent-service-detail') ||
                        -1 != $location.url().indexOf('/agent/agent-account-detail') ||
                        -1 != $location.url().indexOf('/agent/agent-scene-detail') ){
                        if(e.keyCode == key && !attrs.shortcutWindow){
                            ele.click();
                            return false;
                        }
                        /*if(e.keyCode == TAB_KEY){
                            //if(!attrs.shortcutWindow){
                            //    ele.html('Alt+'+attrs.shortcutKey);
                            //}else{
                            ele.html(attrs.shortcutKey);
                            //}

                            return false;
                        }*/

                    }

                    /*if(e.keyCode == key && attrs.shortcutWindow &&  !e.altKey ){
                        ele.click();
                        return false;
                    }*/



                })
                $('body').on('keyup', function(e){
                    if(e.keyCode == TAB_KEY){
                        ele.html(ele.attr('value'));
                        e.step
                    }
                })
            }
        }
      };
    }
  ]).directive('myOpen',function(){
      return{
          restrict: 'E',
          transclude: true,
          scope:{},
          controller:function($scope,settlementMonth,tmsPagination,currentShift,getDate,$modal,agentsLists,sceneRecordShift,SceneRecordShiftStatus,marker,globalFunction,agentTotal,fundSourceTypes,matchesStatus,sceneStatus,$stateParams,user,topAlert,$filter,goBackData,formatNumber){
              $scope.sceneStatus = sceneStatus;
              $scope.matchesStatus = matchesStatus;
              $scope.fundSourceTypes = fundSourceTypes;
              $scope.SceneRecordShiftStatus = SceneRecordShiftStatus.items;
              $scope.condition = {
                  year_month:['']
              }

              $scope.selected = true;
              $scope.show_first = true;
              $scope.show_two = false;
              $scope.show_three = false;
              $scope.bottom="slider-hide";
              $scope.condition = goBackData.get('condition',$scope.condition);

              if(currentShift.data.year_month == ''){
                  settlementMonth.query({"sort":'year_month'},function(data){
                      if(data){
                          $scope.condition.year_month[0] = $filter("parseDate")(data[0].year_month,'yyyy-MM');
                      }
                  })
              }else{
                  $scope.condition.year_month[0] = currentShift.data.year_month;
              }


              var i = 2;
              var content_height = $("#content").height();
              $(".agent-total").height(content_height).css("bottom", 50-content_height);
              $scope.showOpen = function(len){
                  $(".agent-total").css({"bottom": 50-content_height,"height":$("#content").height()});
                  if(i == len){
                      if($scope.bottom == "slider-hide"){
                      }else{
                          $scope.selected = true;
                      }
                  }else{
                      $scope.selected = false;
                  }
                  if( $scope.selected){
                      $scope.selected = false;
                      $('.agent_open').css('display','block');
                      $(".agent-total").css("bottom", 50-$("#content").height());
                      $scope.bottom="slider-hide";
                  }else{

                      $(".agent-total").css({"bottom": '-10px',"height":$("#content").height()});
                      $('.agent_open').css('display','none');
                      $scope.bottom="slider-open";
                  }
                  if(len == 0){
                      $scope.show_first = true;
                      $scope.show_two =  false;
                      $scope.show_three =  false;
                      i = len;
                  }else if(len == 1){
                      $scope.show_first = false;
                      $scope.show_two =  true;
                      $scope.show_three =  false;
//                      if($stateParams.id) {
//                          $scope.condition_scene_record = {sceneRecord: {agent_info_id: $stateParams.id}};
//                          sceneRecordShift.query(globalFunction.generateUrlParams($scope.condition_scene_record, {inCapitals: {}, outCapitals: {}})).$promise.then(function (sceneRecords) {
//                              $scope.sceneRecords = sceneRecords;
//                          });
//                      }
                      i = len;
                  }else{
                      $scope.show_first = false;
                      $scope.show_two =  false;
                      $scope.show_three =  true;
                      i = len;
                  }

              }

              //戶口匯總
              if($stateParams.id){
                  if($stateParams.year_month){
                      $scope.condition.year_month[0] = $stateParams.year_month
                  }
                  $scope.$watch("condition.year_month[0]",function(newValue,oldValue){
//                      if(!$scope.selected) return ;
                      if(newValue == '' && oldValue == '')return;
                      var year_month = $filter('date')(newValue, 'yyyy-MM');
                      //$scope.condition.year_month[0] = year_month;
                      goBackData.set('condition',$scope.condition);
                          agentsLists.get({id: $stateParams.id}).$promise.then(function(agent){
                              agentTotal.agentTotalList(globalFunction.generateUrlParams({agent_info_id:agent.id,sort:"hall.hall_type",hall_type:"|1",only_current_hall:"0",year_month:year_month})).$promise.then(function(agentTotals){
                                 // $scope.hall_agentTotal = _.findWhere(agentTotals, {hall_id: user.hall.id});
                                  if(agentTotals.length >= 2){
                                      $scope.agentTotals = _.move(agentTotals,{hall_id:user.hall.id},1);
                                  }else{
                                      $scope.agentTotals = agentTotals;
                                  }

//                                  if(user.hall.hall_type == 1 && $scope.agentTotals[0] && $scope.agentTotals[0].hall_type == 1){
//                                      $scope.agentTotals.splice(0,1);
//                                  }

                                  _.each($scope.agentTotals,function(agent_total,index){
                                      if(agent_total && agent_total.hall_type == 1){
                                          $scope.hall_id = agent_total.hall_id;
                                          $scope.agentTotals.splice(index,1);
                                          $scope.agentTotals.splice(0,0,agent_total);
                                      }
                                  })
                                  //$scope.agentTotals.splice(0,0,{
                                  //    "hall_name":"集團",
                                  //    "hall_type":"1",
                                  //    "hall_id": $scope.hall_id,
                                  //    "loan":"",
                                  //    "deposit_ticket":"",
                                  //    "deposit_card":"",
                                  //    "rolling_a":"",
                                  //    "rolling_b":"",
                                  //    "consumption":"",
                                  //    "commission":"",
                                  //    "thismonth_allowance":"",
                                  //    "lastmonth_allowance":"",
                                  //    "settlement_allowance":""
                                  //});
                                  //$scope.totalAll($scope.agentTotals);
                              });
                          });

                  })
                  //
                  //$scope.totalAll = function(agentTotals){
                  //    $scope.loan = $scope.deposit_ticket = $scope.deposit_card = $scope.rolling_a = $scope.rolling_b = $scope.consumption = $scope.commission = $scope.thismonth_allowance = $scope.lastmonth_allowance = $scope.settlement_allowance = 0;
                  //    angular.forEach(agentTotals,function(agentTotal){
                  //        if(agentTotal.loan){
                  //            $scope.loan += parseFloat(agentTotal.loan);
                  //        }
                  //        if(agentTotal.deposit_ticket){
                  //          $scope.deposit_ticket += parseFloat(agentTotal.deposit_ticket);
                  //        }
                  //        if(agentTotal.deposit_card ){
                  //          $scope.deposit_card += parseFloat(agentTotal.deposit_card);
                  //        }
                  //        if(agentTotal.rolling_a){
                  //              $scope.rolling_a += parseFloat(agentTotal.rolling_a);
                  //        }
                  //        if(agentTotal.rolling_b){
                  //            $scope.rolling_b += parseFloat(agentTotal.rolling_b);
                  //        }
                  //        if(agentTotal.consumption){
                  //              $scope.consumption +=parseFloat(agentTotal.consumption);
                  //        }
                  //        if(agentTotal.commission){
                  //              $scope.commission += parseFloat(agentTotal.commission);
                  //        }
                  //        if(agentTotal.thismonth_allowance){
                  //              $scope.thismonth_allowance += parseFloat(agentTotal.thismonth_allowance);
                  //        }
                  //        if(agentTotal.lastmonth_allowance){
                  //              $scope.lastmonth_allowance += parseFloat(agentTotal.lastmonth_allowance);
                  //        }
                  //        if(agentTotal.settlement_allowance){
                  //              $scope.settlement_allowance += parseFloat(agentTotal.settlement_allowance);
                  //        }
                  //    });
                  //
                  //    $scope.agentTotals[0].loan = $scope.loan;
                  //    $scope.agentTotals[0].deposit_ticket = $scope.deposit_ticket;
                  //    $scope.agentTotals[0].deposit_card = $scope.deposit_card;
                  //    $scope.agentTotals[0].rolling_a = $scope.rolling_a;
                  //    $scope.agentTotals[0].rolling_b = $scope.rolling_b;
                  //    $scope.agentTotals[0].consumption = $scope.consumption;
                  //    $scope.agentTotals[0].commission = $scope.commission;
                  //    $scope.agentTotals[0].thismonth_allowance = $scope.thismonth_allowance;
                  //    $scope.agentTotals[0].lastmonth_allowance = $scope.lastmonth_allowance;
                  //    $scope.agentTotals[0].settlement_allowance = $scope.settlement_allowance;
                  //}

                   //場面記錄
//                  sceneRecord.query(globalFunction.generateUrlParams({agent_info_id:$stateParams.id},{sceneRecordSubs:{},sceneShiftRecord:{},mainScene:{},outCapitals:{}})).$promise.then(function(sceneRecords){
//                    $scope.sceneRecords = sceneRecords;
//                  });
                  $scope.pagination_shift = tmsPagination.create();
                  $scope.pagination_shift.resource = sceneRecordShift;
                  $scope.pagination_shift.items_per_page = 20;
                  $scope.condition_scene_record ={sceneRecord:{agent_info_id:$stateParams.id,mainScene:{"is_scene_show":"|1"}},sort: "status DESC,start_time DESC"};
                  $scope.select_shift = function(page){
                      $scope.sceneRecords = $scope.pagination_shift.select(1,$scope.condition_scene_record,{inCapitals:{},outCapitals:{}});
                  }
                  $scope.select_shift();
//                  sceneRecordShift.query(globalFunction.generateUrlParams($scope.condition_scene_record,{inCapitals:{},outCapitals:{}})).$promise.then(function(sceneRecords){
//                      $scope.sceneRecords = sceneRecords;
//                  });


                  //轉碼戶口資料
                 marker.agentMarker(globalFunction.generateUrlParams({agent_info_id:$stateParams.id},{})).$promise.then(function(agentMarkers){
                      $scope.agentMarkers = _.filter(agentMarkers, function(agentMarker){ return agentMarker.settlement_amount > 0;});
//                      $scope.agentMarkers = agentMarkers;
                  });
              }
              //離場理算
//              $scope.outScene = function(outCapitals){
//                  var _sceneRecord = [];
//                  if(outCapitals && outCapitals.length>0){
//                      _.each(outCapitals,function(_outCapital){
//                          _sceneRecord.push(_outCapital.o_word+""+_outCapital.amount+""+_outCapital.funds_type)
//                      });
//                  }
//                  return  _sceneRecord.join(" + ");
//              }
//              //選擇加載場次詳細
//              $scope.inScene = function(_sceneRecordSubs){
//                  var in_capital_total = [];// 入場本金
//                  _.each(_sceneRecordSubs, function (sceneRecordSub) {
//                      //in_capital_total.push(sceneRecordSub.amount+ "" +(sceneRecordSub.source_type?sceneRecordSub.source_type:''));
//                      in_capital_total.push(sceneRecordSub.amount+ "" +(sceneRecordSub.funds_type?sceneRecordSub.funds_type:''));
//                  });
//                  return  in_capital_total.join(" + ");
//              }
              $scope.outScene = function(outCapitals){
                  var _sceneRecord = [];
                  if(outCapitals && outCapitals.length>0){
                      _.each(outCapitals,function(_outCapital){
                          _sceneRecord.push((_outCapital.o_word?_outCapital.o_word:'')+""+formatNumber(_outCapital.amount)+""+(_outCapital.funds_type?_outCapital.funds_type:''))
                      });
                  }
                  return  _sceneRecord.join(" + ");
              }
              //選擇加載場次詳細
              $scope.inScene = function(_sceneRecordSubs){
                  var in_capital_total = [];// 入場本金
                  _.each(_sceneRecordSubs, function (sceneRecordSub) {
                      //in_capital_total.push(sceneRecordSub.amount+ "" +(sceneRecordSub.source_type?sceneRecordSub.source_type:''));
                      in_capital_total.push(formatNumber(sceneRecordSub.amount)+ "" +(sceneRecordSub.funds_type?sceneRecordSub.funds_type:''));
                  });
                  return  in_capital_total.join(" + ");
              }

              $scope.shift_amount_sum = function(last_shift_amount){
                  var shift_amount_content = [];
                  if(last_shift_amount && last_shift_amount.length>0)
                      _.each(last_shift_amount,function(record){
                          shift_amount_content.push(record.amount+""+record.source_type);
                      });
                  return shift_amount_content.join("+");
              }

              //選擇加載場次詳細
              $scope.scene_selected = function(sceneRecordSubs){
                  var in_capital_total = [];// 入場本金
                  _.each(sceneRecordSubs.sceneRecordSubs, function (sceneRecordSub) {
                      in_capital_total.push(sceneRecordSub.amount+ "" +$scope.fundSourceTypes[sceneRecordSub.source_type]);
                  });
                  return  in_capital_total.join(" + ");
              }

                $scope.sceneRecord = function(id){
                 var modalInstance;
                 modalInstance = $modal.open({
                     templateUrl: "views/agent/scene_record.html",
                     controller: "agentSceneRecordCtrl",
                     windowClass:'lg-modal',
                     resolve: {
                         id:function(){
                             return id;
                         }
                     }
                 });
                }
              //贷款总额列表
              $scope.loanTotal = function(status,hall_id,agent_info_id,hall_type){
                  var modalInstance;
                  modalInstance = $modal.open({
                      templateUrl: "views/agent/agent-loan.html",
                      controller: "agentTotalCtrl",
                      windowClass:'xlg-modal',
                      resolve: {
                          status:function(){
                              return status;
                          },
                          hall_id:function(){
                              return hall_id;
                          },
                          agent_info_id:function(){
                              return $stateParams.id;
                          },
                          hall_type:function(){
                              return hall_type;
                          },
                          year_month:function(){
                              return $scope.condition.year_month;
                          },
                          consumption_total:function(){
                              return "";
                          }
                      }
                  });
              }
              //存单总额列表
              $scope.ticketTotal = function(status,hall_id,agent_info_id,hall_type){
                  var modalInstance;
                  modalInstance = $modal.open({
                      templateUrl: "views/agent/agent-ticket.html",
                      controller: "agentTotalCtrl",
                      windowClass:'lg-modal',
                      resolve: {
                          status:function(){
                              return status;
                          },
                          hall_id:function(){
                              return hall_id;
                          },
                          agent_info_id:function(){
                              return $stateParams.id;
                          },
                          hall_type:function(){
                              return hall_type ? hall_type : 1;
                          },
                          year_month:function(){
                              return $scope.condition.year_month;
                          },
                          consumption_total:function(){
                              return "";
                          }
                      }
                  });
              }
              //存卡总额列表
              $scope.cardTotal = function(status,hall_id,agent_info_id,hall_type,consumption_total){
                  var modalInstance;
                  modalInstance = $modal.open({
                      templateUrl: "views/agent/agent-card.html",
                      controller: "agentTotalCtrl",
                      windowClass:'xlg-modal',
                      resolve: {
                          status:function(){
                              return status;
                          },
                          hall_id:function(){
                              return hall_id;
                          },
                          agent_info_id:function(){
                              return $stateParams.id;
                          },
                          hall_type:function(){
                              return hall_type;
                          },
                          year_month:function(){
                              return $scope.condition.year_month;
                          },
                          consumption_total:function(){
                              return consumption_total;
                          }
                      }
                  });
              }
              //轉碼总额列表
              $scope.rollingTotal = function(status,hall_id,agent_info_id,hall_type,rolling){
                  if($scope.condition.year_month!=""){
                      $scope.condition.year_month[0] = $filter('date')($scope.condition.year_month[0], 'yyyy-MM');
                  }
                  if(hall_type !=1){
                      var modalInstance;
                      modalInstance = $modal.open({
                          templateUrl: "views/agent/agent-rolling.html",
                          controller: "agentTotalCtrl",
                          windowClass:'lg-modal',
                          resolve: {
                              status:function(){
                                  return status;
                              },
                              hall_id:function(){
                                  return hall_id;
                              },
                              agent_info_id:function(){
                                  return $stateParams.id;
                              },
                              hall_type:function(){
                                  return hall_type;
                              },
                              year_month:function(){
                                  return $scope.condition.year_month;
                              },
                              consumption_total:function(){
                                  return rolling;
                              }
                          }
                      });
                  }else{
                      var modalInstance;
                      modalInstance = $modal.open({
                          templateUrl: "views/agent/agent-rolling-group.html",
//                          templateUrl: "views/agent/agent-rolling.html",
                          controller: "agentTotalCtrl",
                          windowClass:'xlg-modal',
                          resolve: {
                              status:function(){
                                  return status;
                              },
                              hall_id:function(){
                                  return hall_id;
                              },
                              agent_info_id:function(){
                                  return $stateParams.id;
                              },
                              hall_type:function(){
                                  return hall_type;
                              },
                              year_month:function(){
                                  return $scope.condition.year_month;
                              },
                              consumption_total:function(){
                                  return rolling;
                              }
                          }
                      });
                  }

              }

              //消費總額
              $scope.consumptionTotal = function(status,hall_id,agent_info_id,hall_type,consumption_total){
                  if($scope.condition.year_month!=""){
                      $scope.condition.year_month[0] = $filter('date')($scope.condition.year_month[0], 'yyyy-MM');
                  }
                  var modalInstance;
                  modalInstance = $modal.open({
                      templateUrl: "views/agent/agent-consumption.html",
                      controller: "agentTotalCtrl",
                      windowClass:'glg-modal',
                      resolve: {
                          status:function(){
                              return status;
                          },
                          hall_id:function(){
                              return hall_id;
                          },
                          agent_info_id:function(){
                              return $stateParams.id;
                          },
                          hall_type:function(){
                              return hall_type;
                          },
                          year_month:function(){
                              return $scope.condition.year_month;
                          },
                          consumption_total:function(){
                              return consumption_total;
                          }
                      }
                  });
              }

              //佣金
              $scope.commissionTotal = function(status,hall_id,agent_info_id,hall_type){
                  if($scope.condition.year_month!=""){
                      $scope.condition.year_month[0] = $filter('date')($scope.condition.year_month[0], 'yyyy-MM');
                  }
                  var modalInstance;
                  modalInstance = $modal.open({
                      templateUrl: "views/agent/agent-commission.html",
                      controller: "agentTotalCtrl",
                      windowClass:'lg-modal',
                      resolve: {
                          status:function(){
                              return status;
                          },
                          hall_id:function(){
                              return hall_id;
                          },
                          agent_info_id:function(){
                              return $stateParams.id;
                          },
                          hall_type:function(){
                              return hall_type;
                          },
                          year_month:function(){
                              return $scope.condition.year_month[0];
                          },
                          consumption_total:function(){
                              return "";
                          }
                      }
                  });
                  //topAlert.warning("對不起，沒有相應佣金記錄");
              }

          },
          templateUrl:'views/agent/my-open.html'
      }
  }).directive('serviceOpen',function(){
          return{
              restrict: 'E',
              transclude: true,
              scope:{},
              controller:function($scope,tmsPagination,settlementMonth,getDate,$modal,agentsLists,sceneRecordShift,SceneRecordShiftStatus,currentShift,goBackData,globalFunction,agentTotal,fundSourceTypes,matchesStatus,sceneStatus,$stateParams,user,topAlert,$filter){
                  $scope.sceneStatus = sceneStatus;
                  $scope.matchesStatus = matchesStatus;
                  $scope.fundSourceTypes = fundSourceTypes;
                  $scope.SceneRecordShiftStatus = SceneRecordShiftStatus.items;
                  $scope.condition = {
                      year_month:['']
                  }

                  $scope.selected = true;
                  $scope.show_first = true;
                  $scope.show_two = false;
                  $scope.show_three = false;
                  $scope.condition = goBackData.get('condition',$scope.condition);
                  if(currentShift.data.year_month == ''){
                      settlementMonth.query({"sort":'year_month'},function(data){
                          if(data){
                              $scope.condition.year_month[0] = $filter("parseDate")(data[0].year_month,'yyyy-MM');
                          }
                      })
                  }else{
                      $scope.condition.year_month[0] = currentShift.data.year_month;
                  }
                  $scope.bottom="slider-hide";
                  var i = 2;
                  var content_height = $("#content").height();
                  $(".agent-total").height(content_height).css("bottom", 50-content_height);
                  $scope.showOpen = function(len){
                      if(i == len){
                          if($scope.bottom == "slider-hide"){
                              $scope.selected = false;
                          }else{
                              $scope.selected = true;
                          }
                      }else{
                          $scope.selected = false;
                      }
                      if( $scope.selected){
                          $('.agent_open').css('display','block');
                          $(".agent-total").css("bottom", 50-content_height);
                          $scope.bottom="slider-hide";
                      }else{
//                          $scope.condition.year_month[0] = $filter('date')(new Date(), 'yyyy-MM');
                          $(".agent-total").css("bottom", '-10px');
                          $('.agent_open').css('display','none');
                          $scope.bottom="slider-open";
                      }
                      if(len == 0){
                          $scope.show_first = true;
                          $scope.show_two =  false;
                          $scope.show_three =  false;
                          i = len;
                      }else if(len == 1){
                          $scope.show_first = false;
                          $scope.show_two =  true;
                          $scope.show_three =  false;
                          i = len;
                      }else{
                          $scope.show_first = false;
                          $scope.show_two =  false;
                          $scope.show_three =  true;
                          i = len;
                      }
                  }
                  //戶口匯總
                  if($stateParams.id){
                      if($stateParams.year_month){
                          $scope.condition.year_month[0] = $stateParams.year_month
                      }

                      $scope.$watch("condition.year_month[0]",function(newValue,oldValue){
                          if(newValue == '' && oldValue == '')return;
                          var year_month = $filter('date')(newValue, 'yyyy-MM');
                          goBackData.set('condition',$scope.condition);
                              agentsLists.get({id: $stateParams.id}).$promise.then(function(agent){
                                  agentTotal.agentTotalList(globalFunction.generateUrlParams({agent_info_id:agent.id,sort:"hall.hall_type",hall_type:"|1",only_current_hall:"0",year_month:year_month})).$promise.then(function(agentTotals){
                                      $scope.hall_agentTotal = _.findWhere(agentTotals, {hall_id: user.hall.id});
                                      if(agentTotals.length >=2){
                                          $scope.agentTotals = _.move(agentTotals,{hall_id:user.hall.id},1);
                                      }else{
                                          $scope.agentTotals = agentTotals;
                                      }
//                                      if(user.hall.hall_type == 1){
//                                          $scope.agentTotals.splice(0,1);
//                                      }
                                      _.each($scope.agentTotals,function(agent_total,index){
                                          if(agent_total && agent_total.hall_type == 1){
                                              $scope.hall_id = agent_total.hall_id;
                                              $scope.agentTotals.splice(index,1);
                                          }
                                      })
                                      $scope.agentTotals.splice(0,0,{
                                          "hall_name":"集團",
                                          "hall_type":"1",
                                          "loan":"",
                                          "hall_id": $scope.hall_id,
                                          "deposit_ticket":"",
                                          "deposit_card":"",
                                          "rolling":"",
                                          "consumption":"",
                                          "commission":"",
                                          "thismonth_allowance":"",
                                          "lastmonth_allowance":"",
                                          "settlement_allowance":""
                                      });
                                      $scope.totalAll($scope.agentTotals);

                                  });
                              });

                      })
                      //
                      $scope.totalAll = function(agentTotals){
                          $scope.loan = $scope.deposit_ticket = $scope.deposit_card = $scope.rolling = $scope.consumption = $scope.commission = $scope.thismonth_allowance = $scope.lastmonth_allowance = $scope.settlement_allowance = 0;
                          angular.forEach(agentTotals,function(agentTotal){
                              if(agentTotal.loan){
                                  $scope.loan += parseFloat(agentTotal.loan);
                              }
                              if(agentTotal.deposit_ticket){
                                  $scope.deposit_ticket += parseFloat(agentTotal.deposit_ticket);
                              }
                              if(agentTotal.deposit_card ){
                                  $scope.deposit_card += parseFloat(agentTotal.deposit_card);
                              }
                              if(agentTotal.rolling){
                                  $scope.rolling += parseFloat(agentTotal.rolling);
                              }
                              if(agentTotal.consumption){
                                  $scope.consumption +=parseFloat(agentTotal.consumption);
                              }
                              if(agentTotal.commission){
                                  $scope.commission += parseFloat(agentTotal.commission);
                              }
                              if(agentTotal.thismonth_allowance){
                                  $scope.thismonth_allowance += parseFloat(agentTotal.thismonth_allowance);
                              }
                              if(agentTotal.lastmonth_allowance){
                                  $scope.lastmonth_allowance += parseFloat(agentTotal.lastmonth_allowance);
                              }
                              if(agentTotal.settlement_allowance){
                                  $scope.settlement_allowance += parseFloat(agentTotal.settlement_allowance);
                              }
                          });

                          $scope.agentTotals[0].loan = $scope.loan;
                          $scope.agentTotals[0].deposit_ticket = $scope.deposit_ticket;
                          $scope.agentTotals[0].deposit_card = $scope.deposit_card;
                          $scope.agentTotals[0].rolling = $scope.rolling;
                          $scope.agentTotals[0].consumption = $scope.consumption;
                          $scope.agentTotals[0].commission = $scope.commission;
                          $scope.agentTotals[0].thismonth_allowance = $scope.thismonth_allowance;
                          $scope.agentTotals[0].lastmonth_allowance = $scope.lastmonth_allowance;
                          $scope.agentTotals[0].settlement_allowance = $scope.settlement_allowance;
                      }
//                      sceneRecord.query(globalFunction.generateUrlParams({agent_info_id:$stateParams.id},{sceneRecordSubs:{},sceneShiftRecord:{},mainScene:{}})).$promise.then(function(sceneRecords){
//                          $scope.sceneRecords = sceneRecords;
//                      });

                      $scope.pagination_shift = tmsPagination.create();
                      $scope.pagination_shift.resource = sceneRecordShift;
                      $scope.pagination_shift.items_per_page = 20;
                      $scope.condition_scene_record ={sceneRecord:{agent_info_id:$stateParams.id,mainScene:{"is_scene_show":"|1"}},sort: "status DESC,start_time DESC"};
                      $scope.select_shift = function(page){
                          $scope.sceneRecords = [];
                          $scope.sceneRecords = $scope.pagination_shift.select(1,$scope.condition_scene_record,{inCapitals:{},outCapitals:{}});
                      }
                      $scope.select_shift();
//                      $scope.condition_scene_record ={sceneRecord:{agent_info_id:$stateParams.id}};
//                      sceneRecordShift.query(globalFunction.generateUrlParams($scope.condition_scene_record,{inCapitals:{},outCapitals:{}})).$promise.then(function(sceneRecords){
//                          $scope.sceneRecords = sceneRecords;
//                      });
                  }
                  //離場理算
//                  $scope.outScene = function(sceneRecord){
//                      var _sceneRecord = [];
//                      if(sceneRecord.payback_marker && sceneRecord.payback_marker>0){
//                          _sceneRecord.push("贖"+sceneRecord.payback_marker+"M")
//                      }
//
//                      if(sceneRecord.payback_limit_marker && sceneRecord.payback_limit_marker>0){
//                          _sceneRecord.push("贖"+sceneRecord.payback_limit_marker+"M(昇紅)");
//                      }
//
//                      if(sceneRecord.payback_prop_marker && sceneRecord.payback_prop_marker>0){
//                          _sceneRecord.push("贖"+sceneRecord.payback_prop_marker+"M(道具)");
//                      }
//
//                      if(sceneRecord.get_cash && sceneRecord.get_cash>0){
//                          _sceneRecord.push("提"+sceneRecord.get_cash+"現");
//                      }
//
//                      if(sceneRecord.deposit_marker && sceneRecord.deposit_marker>0){
//                          _sceneRecord.push("存"+sceneRecord.deposit_marker+"M");
//                      }
//
//                      if(sceneRecord.deposit_cash && sceneRecord.deposit_cash>0){
//                          _sceneRecord.push("存"+sceneRecord.deposit_cash+"現");
//                      }
//                      return  _sceneRecord.join(" + ");
//                  }
//                  //選擇加載場次詳細
//                  $scope.inScene = function(_sceneRecordSubs){
//                      var in_capital_total = [];// 入場本金
//                      _.each(_sceneRecordSubs, function (sceneRecordSub) {
//                          in_capital_total.push(sceneRecordSub.amount+ "" +(sceneRecordSub.source_type?sceneRecordSub.source_type:''));
//                      });
//                      return  in_capital_total.join(" + ");
//                  }
                  $scope.outScene = function(outCapitals){
                      var _sceneRecord = [];
                      if(outCapitals && outCapitals.length>0){
                          _.each(outCapitals,function(_outCapital){
                              _sceneRecord.push((_outCapital.o_word?_outCapital.o_word:'')+""+_outCapital.amount+""+(_outCapital.funds_type?_outCapital.funds_type:''))
                          });
                      }
                      return  _sceneRecord.join(" + ");
                  }
                  //選擇加載場次詳細
                  $scope.inScene = function(_sceneRecordSubs){
                      var in_capital_total = [];// 入場本金
                      _.each(_sceneRecordSubs, function (sceneRecordSub) {
                          //in_capital_total.push(sceneRecordSub.amount+ "" +(sceneRecordSub.source_type?sceneRecordSub.source_type:''));
                          in_capital_total.push(sceneRecordSub.amount+ "" +(sceneRecordSub.funds_type?sceneRecordSub.funds_type:''));
                      });
                      return  in_capital_total.join(" + ");
                  }
                  //選擇加載場次詳細
                  $scope.scene_selected = function(sceneRecordSubs){
                      var in_capital_total = [];// 入場本金
                      _.each(sceneRecordSubs.sceneRecordSubs, function (sceneRecordSub) {
                          in_capital_total.push(sceneRecordSub.amount+ "" +$scope.fundSourceTypes[sceneRecordSub.source_type]);
                      });
                      return  in_capital_total.join(" + ");
                  }


                  $scope.sceneRecord = function(id){
                      var modalInstance;
                      modalInstance = $modal.open({
                          templateUrl: "views/agent/scene_record.html",
                          controller: "agentSceneRecordCtrl",
                          windowClass:'lg-modal',
                          resolve: {
                              id:function(){
                                  return id;
                              }
                          }
                      });
                  }
                  //贷款总额列表
                  $scope.loanTotal = function(status,hall_id,agent_info_id,hall_type){
                      var modalInstance;
                      modalInstance = $modal.open({
                          templateUrl: "views/agent/agent-loan.html",
                          controller: "agentTotalCtrl",
                          windowClass:'lg-modal',
                          resolve: {
                              status:function(){
                                  return status;
                              },
                              hall_id:function(){
                                  return hall_id;
                              },
                              agent_info_id:function(){
                                  return $stateParams.id;
                              },
                              hall_type:function(){
                                  return hall_type;
                              },
                              year_month:function(){
                                  return $scope.condition.year_month;
                              },
                              consumption_total:function(){
                                  return "";
                              }
                          }
                      });
                  }

                  //存单总额列表 service
                  $scope.ticketTotal = function(status,hall_id,agent_info_id,hall_type){
                      var modalInstance;
                      modalInstance = $modal.open({
                          templateUrl: "views/agent/agent-ticket.html",
                          controller: "agentTotalCtrl",
                          windowClass:'lg-modal',
                          resolve: {
                              status:function(){
                                  return status;
                              },
                              hall_id:function(){
                                  return hall_id;
                              },
                              agent_info_id:function(){
                                  return $stateParams.id;
                              },
                              hall_type:function(){
                                  return hall_type ? hall_type : 1;
                              },
                              year_month:function(){
                                  return $scope.condition.year_month;
                              },
                              consumption_total:function(){
                                  return "";
                              }
                          }
                      });
                  }
                  //存卡总额列表 service
                  $scope.cardTotal = function(status,hall_id,agent_info_id,hall_type,consumption_total){
                      var modalInstance;
                      modalInstance = $modal.open({
                          templateUrl: "views/agent/agent-card.html",
                          controller: "agentTotalCtrl",
                          windowClass:'xlg-modal',
                          resolve: {
                              status:function(){
                                  return status;
                              },
                              hall_id:function(){
                                  return hall_id;
                              },
                              agent_info_id:function(){
                                  return $stateParams.id;
                              },
                              hall_type:function(){
                                  return hall_type ? hall_type : 1;
                              },
                              year_month:function(){
                                  return $scope.condition.year_month;
                              },
                              consumption_total:function(){
                                  return consumption_total;
                              }
                          }
                      });
                  }
                  //轉碼总额列表 service
                  $scope.rollingTotal = function(status,hall_id,agent_info_id,hall_type,rolling){
                      //alert(agentTotal);
                      if($scope.condition.year_month!=""){
                          $scope.condition.year_month[0] = $filter('date')($scope.condition.year_month[0], 'yyyy-MM');
                      }
                      if(hall_type && hall_type != 1 ){
                          var modalInstance;
                          modalInstance = $modal.open({
                              templateUrl: "views/agent/agent-rolling.html",
                              controller: "agentTotalCtrl",
                              windowClass:'xlg-modal',
                              resolve: {
                                  status:function(){
                                      return status;
                                  },
                                  hall_id:function(){
                                      return hall_id;
                                  },
                                  agent_info_id:function(){
                                      return $stateParams.id;
                                  },
                                  hall_type:function(){
                                      return hall_type;
                                  },
                                  year_month:function(){
                                      return $scope.condition.year_month;
                                  },
                                  consumption_total:function(){
                                      return rolling;
                                  },

                              }
                          });
                      }else{
                          var modalInstance;
                          modalInstance = $modal.open({
                              templateUrl: "views/agent/agent-rolling-group.html",
//                          templateUrl: "views/agent/agent-rolling.html",
                              controller: "agentTotalCtrl",
                              windowClass:'xlg-modal',
                              resolve: {
                                  status:function(){
                                      return status;
                                  },
                                  hall_id:function(){
                                      return hall_id;
                                  },
                                  agent_info_id:function(){
                                      return $stateParams.id;
                                  },
                                  hall_type:function(){
                                      return hall_type ? hall_type : 1;
                                  },
                                  year_month:function(){
                                      return $scope.condition.year_month;
                                  },
                                  consumption_total:function(){
                                      return rolling;
                                  }
                              }
                          });
                      }

                  }

                  //消費總額 service
                  $scope.consumptionTotal = function(status,hall_id,agent_info_id,hall_type,consumption_total){
                      if($scope.condition.year_month!=""){
                          $scope.condition.year_month[0] = $filter('date')($scope.condition.year_month[0], 'yyyy-MM');
                      }
                      var modalInstance;
                      modalInstance = $modal.open({
                          templateUrl: "views/agent/agent-consumption.html",
                          controller: "agentTotalCtrl",
                          windowClass:'lg-modal',
                          resolve: {
                              status:function(){
                                  return status;
                              },
                              hall_id:function(){
                                  return hall_id;
                              },
                              agent_info_id:function(){
                                  return $stateParams.id;
                              },
                              hall_type:function(){
                                  return hall_type ? hall_type :1;
                              },
                              year_month:function(){
                                  return $scope.condition.year_month;
                              },
                              consumption_total:function(){
                                  return consumption_total;
                              }
                          }
                      });
                  }

                  //佣金 service
                  $scope.commissionTotal = function(status,hall_id,agent_info_id,hall_type){
                      if($scope.condition.year_month!=""){
                          $scope.condition.year_month[0] = $filter('date')($scope.condition.year_month[0], 'yyyy-MM');
                      }
                      var modalInstance;
                      modalInstance = $modal.open({
                          templateUrl: "views/agent/agent-commission.html",
                          controller: "agentTotalCtrl",
                          windowClass:'lg-modal',
                          resolve: {
                              status:function(){
                                  return status;
                              },
                              hall_id:function(){
                                  return hall_id;
                              },
                              agent_info_id:function(){
                                  return $stateParams.id;
                              },
                              hall_type:function(){
                                  return hall_type ? hall_type : 1;
                              },
                              year_month:function(){
                                  return $scope.condition.year_month;
                              },
                              consumption_total:function(){
                                  return "";
                              }
                          }
                      });
                      //topAlert.warning("對不起，沒有相應佣金記錄");
                  }

              },
              templateUrl:'views/agent/service-open.html'
          }
      }).directive('myOpens',function(){
      return{
          restrict: 'E',
          transclude: true,
          scope:{},
          controller:function($scope,$modal){
              $scope.selected = true;
              $scope.show_first = true;
              $scope.show_two = false;
              $scope.bottom="slider-hide";
              var i = 2;
              $scope.showOpen = function(len){
                  if(i == len){
                      if($scope.bottom == "slider-hide"){
                          $scope.selected = false;
                      }else{
                          $scope.selected = true;
                      }
                  }else{
                      $scope.selected = false;
                  }
                  if( $scope.selected){
                      $('.agent_open').css('display','block');
                      $scope.bottom="slider-hide";
                  }else{
                      $('.agent_open').css('display','none');
                      $scope.bottom="slider-open";
                  }
                  if(len == 0){
                      $scope.show_first = true;
                      $scope.show_two =  false;
                      i = len;
                  }else{
                      $scope.show_first = false;
                      $scope.show_two =  true;
                      i = len;
                  }
                  // alert(len+"==="+$scope.show_first+"=="+$scope.bottom);
              }

              $scope.consumption = function(){
                  var modalInstance;
                  modalInstance = $modal.open({
                      templateUrl: "views/agent/consumption.html",
                      controller: 'agentIntegralDetailCtrl',
                      windowClass:'lg-modal'
                  });
              }

              $scope.transcoding = function(){
                  var modalInstance;
                  modalInstance = $modal.open({
                      templateUrl: "views/agent/transcoding.html",
                      controller: 'agentIntegralDetailCtrl',
                      windowClass:'lg-modal'
                  });
              }
              $scope.memory_card = function(){
                  var modalInstance;
                  modalInstance = $modal.open({
                      templateUrl: "views/agent/memory_card.html",
                      controller: 'agentIntegralDetailCtrl',
                      windowClass:'lg-modal'
                  });
              }

              $scope.sceneRecord = function(){
                  var modalInstance;
                  modalInstance = $modal.open({
                      templateUrl: "views/agent/scene_record.html",
                      controller: "agentIntegralDetailCtrl",
                      windowClass:'lg-modal'
                  });
              }
          },
          templateUrl:'views/agent/my-opens.html'
      }
  }).directive('tabs', function() {
      return {
          restrict: 'E',
          transclude: true,
          scope: {},
          controller: ["$scope","agentsLists","globalFunction","$location","$element","$stateParams",function($scope,agentsLists,globalFunction,$location,$element,$stateParams) {
              $scope.buttons = eval($element.attr('buttons'));
              var panes = $scope.panes = [];
              $scope.show = true;
              $scope.bottom="slider-open";
              $scope.print_image = 0;

              $scope.select = function(pane) {
                  angular.forEach(panes, function(pane) {
                      pane.selected = false;
                  });
                  pane.selected = true;
                  $scope.show = !$scope.show;
                  if($scope.show){
                      $scope.bottom="slider-hide";
                  }else{
                      $scope.bottom="slider-open";
                  }
                  if(pane.title == '助手'){
                      $scope.btn_contact = true;
                      $scope.btn_guest = false;
                  }else{
                      $scope.btn_contact = false;
                      $scope.btn_guest = true;
                  }
                 if( !angular.isUndefined($scope.buttons)){
                     if(pane.title == '客人' || pane.title == '助手'){
                         $scope.buttons[0].text ="新增"+pane.title;
                     }
                 }else{
                     $scope.btn_contact = false;
                     $scope.btn_guest = false;
                 }
              }
              this.addPane = function(pane) {
                  if (panes.length == 0) $scope.select(pane);
                  panes.push(pane);
              }
              //顯示隱藏按鈕
              $scope.addContact = function(){
                  if($stateParams.id){
                      agentsLists.get({id:$stateParams.id}).$promise.then(function(agent){
                          if(agent.agent_code){
                              if( $scope.buttons[0].text == '新增助手'){
                                  $location.path('agent/contact-create/3/'+$stateParams.id);
                              }else{
                                  $location.path('agent/agent-guest-create/'+$stateParams.id+"/"+agent.agent_code);
                              }
                          }
                      })
                  }else{
                      if( $scope.buttons[0].text == '新增助手'){
                          $location.path('agent/contact-create/3/'+$stateParams.id);
                      }else{
                          $location.path('agent/agent-guest-create');
                      }
                  }

              }
//              $scope.certificate_images =[{image:""},{image:""}];
//              $scope.show_certificate = function(){
//                  agentsLists.get(globalFunction.generateUrlParams({id:$stateParams.id},{agentMaster:{idcardImages:""}})).$promise.then(function(agent){
//                      for(var i = 0;i < 2;i++){
//                          if(agent.agentMaster.idcardImages[i]){
//                              $scope.certificate_images[i].image = agent.agentMaster.idcardImages[i].show_image_path;
//                          }else{
//                              $scope.certificate_images[i].image = "";
//                          }
//                      }
//                  })
//              }

              $scope.print_img = function(){
                  $scope.img_url =$('#img_content .tab-content .active a').attr("href");
                  window.open("print-image.html?url="+$scope.img_url);
              }


          }],
          template:
              '<div class="tabbable">' +
              '<ul class="filters nav nav-tabs">' +
              '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
              '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
              '</li>' +
              '</ul>' +
              '<button data-ng-show="btn_contact" class="btn btn-confirm btn-tab pull-right" ng-click="addContact()" check-permissions="agentContactCreate">新增助手</button>'+
              '<button data-ng-show="btn_guest" class="btn btn-confirm btn-tab pull-right" ng-click="addContact()" check-permissions="agentGuestCreate">新增客人</button>'+
              '<div class="tab-content" ng-transclude></div>' +
              '</div>',
          replace: true
      };
  }).directive('pane', function() {
      return {
          require: '^tabs',
          restrict: 'E',
          transclude: true,
          scope: { title: '@' },
          link: function(scope, element, attrs, tabsCtrl) {
              tabsCtrl.addPane(scope);
          },
          template:
              '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
              '</div>',
          replace: true
      };
  });
}).call(this);
