(function() {
  'use strict';
  angular.module('app.report.ctrls', ["app.report.services"])
     .controller('reportManagerCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','reportList',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,reportList){

          breadcrumb.items = [
              {"name":"報表管理","active":true}
          ];
          //當前廳
          $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
          //報表名稱
          $scope.reportLists = reportList.query();
          $scope.report_code = '';
          var init_record = {
              agent_code: "",
              halls : [{ id:user.hall.id, name: user.hall.hall_name}],
              year_month: $filter('date')(new Date(), 'yyyy-MM'),
              agent_group_name: "",
              shift_date: ["",""],
              pin_code: ""
          }
          $scope.record = angular.copy(init_record);

          //不需要提交的參數
          var init_new_record = {
              //agent_info_id: "",
              //agent_code: "",
              agent_name: ""
          }
          $scope.new_record = angular.copy(init_new_record);

          $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });

              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

          //查詢戶口名稱
          $scope.$watch('record.agent_code',globalFunction.debounce(function(new_value, old_value){
              $scope.new_record.agent_name = "";
              //$scope.new_record.agent_info_id = "";
              if(new_value){
                   agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                       if(agents[0]){
                           $scope.new_record.agent_name = agents[0].agent_name;
                           //$scope.new_record.agent_info_id = agents[0].id;
                       }
                   });
              }
          }));

          $scope.$watch('record.year_month',function(newValue,oldValue){
              if(angular.isDate(newValue)){
                  $scope.record.year_month = $filter('date')(newValue, 'yyyy-MM');
              }
          })

          /*$scope.report_url = "";
          $scope.report = function(){
          }*/

          $scope.reset = function(){
              $scope.select_halls = [];
              $scope.select_status = false;
              $scope.record = angular.copy(init_record);
              $scope.new_record = angular.copy(init_new_record);
              $scope.form_report.$setPristine();
              $scope.form_report.clearErrors();
          }

  }]).controller('loanSummaryReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists', 'currentShift','shiftMarks','user',
      function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,currentShift,shiftMarks,user){
          breadcrumb.items = [
              {"name":"貸款匯總","active":true}
          ];
          $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
          $scope.shiftMarts = shiftMarks.items;

          $scope.report_code = "LoanBusinessTotal";
          var init_condition = {
              halls : [{ id:user.hall.id, name: user.hall.hall_name}],
              agent_group_name: "",
              agent_code: ""
//              loan_time: ["",""],
//              year_month: "",//currentShift.data.year_month ? currentShift.data.year_month :"",
//              shift_date: "",//currentShift.data.shift_date ? currentShift.data.shift_date :"",
//              shift: ""
          };
//          if(currentShift.data && currentShift.data.year_month){
//              init_condition.year_month = currentShift.data.year_month;
//          }
//          if(currentShift.data && currentShift.data.shift_date){
//              init_condition.shift_date = currentShift.data.shift_date;
//          }
          $scope.condition = angular.copy(init_condition);

          $scope.select_halls = [];
          $scope.$watch('select_halls', function(new_value){
              if(!user.isAllHall())
              {
                  $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
              }
              else
              {
                  $scope.condition.halls = [];
                  _.each($scope.select_halls, function($that, $key){
                      var obj = {
                          id : $that,
                          name : (_.findWhere($scope.halls, {id : $that})).hall_name
                      }
                      $scope.condition.halls[$key] = obj;
                  })
              }
          });

          //全選
          $scope.select_all = function(){
              $scope.select_halls = [];
              if(!$scope.select_status){
                  _.each($scope.halls,function(hall){
                      $scope.select_halls.push(hall.id);
                  })
              }
          }

//          $scope.$watch("condition.loan_time", function(new_value){
//              $scope.condition.loan_time[0] = $scope.condition.loan_time[0] ? $filter('date')($scope.condition.loan_time[0], 'yyyy-MM-dd') : "";
//              $scope.condition.loan_time[1] = $scope.condition.loan_time[1] ? $filter('date')($scope.condition.loan_time[1], 'yyyy-MM-dd') : "";
//          }, true);
//
//          $scope.$watch("condition.year_month", function(new_value){
//              $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
//          });
//          $scope.$watch("condition.shift_date", function(new_value){
//              $scope.condition.shift_date = $scope.condition.shift_date ? $filter('date')($scope.condition.shift_date, 'yyyy-MM-dd') : "";
//          });

          //戶口查詢名稱
          $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
              $scope.agent_name = "";
              if(new_value){
                  agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                      if(agents[0])
                          $scope.agent_name = agents[0].agent_name;
                  });
              }
          }));

          $scope.reset = function(){
              $scope.select_halls = [];
              $scope.select_status = false;
              $scope.condition = angular.copy(init_condition);
          }


      }]).controller('loanReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"貸款報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "LoanReport"; //貸款匯總
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  agent_code: "",
                  loan_time: ["",""],
                  year_month: "",//currentShift.data.year_month ? currentShift.data.year_month :"",
                  shift_date: "",//currentShift.data.shift_date ? currentShift.data.shift_date :"",
                  shift: ""
              };
//              if(currentShift.data && currentShift.data.year_month){
//                  init_condition.year_month = currentShift.data.year_month;
//              }
//              if(currentShift.data && currentShift.data.shift_date){
//                  init_condition.shift_date = currentShift.data.shift_date;
//              }
              $scope.condition = angular.copy(init_condition);
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });

              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              $scope.$watch("condition.loan_time", function(new_value){
                  $scope.condition.loan_time[0] = $scope.condition.loan_time[0] ? $filter('date')($scope.condition.loan_time[0], 'yyyy-MM-dd') : "";
                  $scope.condition.loan_time[1] = $scope.condition.loan_time[1] ? $filter('date')($scope.condition.loan_time[1], 'yyyy-MM-dd') : "";
              }, true);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
              $scope.$watch("condition.shift_date", function(new_value){
                  $scope.condition.shift_date = $scope.condition.shift_date ? $filter('date')($scope.condition.shift_date, 'yyyy-MM-dd') : "";
              });

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

  }]).controller('loanWaterReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user','fundsTypes','transTypes',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user,fundsTypes,transTypes){
              breadcrumb.items = [
                  {"name":"貸款流水報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              fundsTypes.query({type:'2'}).$promise.then(function(_fundsTypes){
                  _fundsTypes.push({"funds_type": "工作碼"});
                  $scope.fundsTypes = _fundsTypes;
              });
              $scope.transTypes = transTypes;

              $scope.report_code = "LoanWaterReport"; //貸款流水報表
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agentGroup_agent_group_name: "",
                  agent_code: "",
                  marker_seqnumber:"",
                  trans_type:"",
                  funds_type:"",
                  remark:"",
                  shiftMark:{shift_date:["",""]},
                  shiftMark_shift_date:"",
                  shiftMark_year_month:currentShift.data && currentShift.data.year_month ? currentShift.data.year_month :"",//currentShift.data.year_month ? currentShift.data.year_month :"",
//                  shift_date: "",//currentShift.data.shift_date ? currentShift.data.shift_date :"",
                  shiftMark_shift: ""
              };
//              if(currentShift.data && currentShift.data.year_month){
//                  init_condition.year_month = currentShift.data.year_month;
//              }
//              if(currentShift.data && currentShift.data.shift_date){
//                  init_condition.shift_date = currentShift.data.shift_date;
//              }
              $scope.condition = angular.copy(init_condition);
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });

              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              $scope.$watch("condition.shiftMark.shift_date", function(new_value){
                  $scope.condition.shiftMark.shift_date[0] = $scope.condition.shiftMark.shift_date[0] ? $filter('date')($scope.condition.shiftMark.shift_date[0], 'yyyy-MM-dd') : "";
                  $scope.condition.shiftMark.shift_date[1] = $scope.condition.shiftMark.shift_date[1] ? $filter('date')($scope.condition.shiftMark.shift_date[1], 'yyyy-MM-dd') : "";
              }, true);

              $scope.$watch("condition.shiftMark_year_month", function(new_value){
                  $scope.condition.shiftMark_year_month = $scope.condition.shiftMark_year_month ? $filter('date')($scope.condition.shiftMark_year_month, 'yyyy-MM') : "";
              });
              $scope.$watch("condition.shiftMark_shift_date", function(new_value){
                  $scope.condition.shiftMark_shift_date = $scope.condition.shiftMark_shift_date ? $filter('date')($scope.condition.shiftMark_shift_date, 'yyyy-MM-dd') : "";
              });


              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('loanDayReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"貸款日報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "LoanDailyReport"; //貸款匯總
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  agent_code: "",
                  shift_date: "" //currentShift.data.shift_date ? currentShift.data.shift_date :""
              };
              if(currentShift.data && currentShift.data.shift_date){
                  init_condition.shift_date = currentShift.data.shift_date;
              }
              $scope.condition = angular.copy(init_condition);
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });

              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              $scope.$watch("condition.shift_date", function(new_value){
                  $scope.condition.shift_date = $scope.condition.shift_date ? $filter('date')($scope.condition.shift_date, 'yyyy-MM-dd') : "";
              });
              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

      }]).controller('depositTicketSummaryReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift', 'user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift, user){
              breadcrumb.items = [
                  {"name":"存單匯總","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;


              $scope.report_code = "DepositTicketTotal"; //存單匯總
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  agent_code: "",
                  crate_time: ["",""],
                  year_month: "",//currentShift.data.year_month ? currentShift.data.year_month :"",
                  shift_date: "",//currentShift.data.shift_date ? currentShift.data.shift_date :"",
                  shift: ""
              };
//              if(currentShift.data && currentShift.data.year_month){
//                  init_condition.year_month = currentShift.data.year_month;
//              }
//              if(currentShift.data && currentShift.data.shift_date){
//                  init_condition.shift_date = currentShift.data.shift_date;
//              }
              $scope.condition = angular.copy(init_condition);
//              if(currentShift.data && currentShift.data.year_month){
//                  $scope.condition.year_month = currentShift.data.year_month;
//              }
//              if(currentShift.data && currentShift.data.shift_date){
//                  $scope.condition.shift_date = currentShift.data.shift_date;
//              }
              $scope.select_halls = [];

              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });
              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              $scope.$watch("condition.crate_time", function(new_value){
                  $scope.condition.crate_time[0] = $scope.condition.crate_time[0] ? $filter('date')($scope.condition.crate_time[0], 'yyyy-MM-dd') : "";
                  $scope.condition.crate_time[1] = $scope.condition.crate_time[1] ? $filter('date')($scope.condition.crate_time[1], 'yyyy-MM-dd') : "";
              }, true);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
              $scope.$watch("condition.shift_date", function(new_value){
                  $scope.condition.shift_date = $scope.condition.shift_date ? $filter('date')($scope.condition.shift_date, 'yyyy-MM-dd') : "";
              });


              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }])
      .controller('depositTicketStreamReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift', 'user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift, user){
              breadcrumb.items = [
                  {"name":"存單流水報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "DepositTicketWaterReport"; //存單流水報表
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  agent_code: "",
                  crate_time: ["",""],
                  year_month: "",//currentShift.data.year_month ? currentShift.data.year_month :"",
                  shift_date: "",//currentShift.data.shift_date ? currentShift.data.shift_date :"",
                  shift: ""
              };
              if(currentShift.data && currentShift.data.year_month){
                  init_condition.year_month = currentShift.data.year_month;
              }
              if(currentShift.data && currentShift.data.shift_date){
                  init_condition.shift_date = currentShift.data.shift_date;
              }
              $scope.condition = angular.copy(init_condition);
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });
              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              $scope.$watch("condition.crate_time", function(new_value){
                  $scope.condition.crate_time[0] = $scope.condition.crate_time[0] ? $filter('date')($scope.condition.crate_time[0], 'yyyy-MM-dd') : "";
                  $scope.condition.crate_time[1] = $scope.condition.crate_time[1] ? $filter('date')($scope.condition.crate_time[1], 'yyyy-MM-dd') : "";
              }, true);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
              $scope.$watch("condition.shift_date", function(new_value){
                  $scope.condition.shift_date = $scope.condition.shift_date ? $filter('date')($scope.condition.shift_date, 'yyyy-MM-dd') : "";
              });

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

      }]).controller('depositTicketReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"存單報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "DepositTicketReport"; //存單報表
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  agent_code: "",
                  depositTicket_time: ["", ""],
                  depositTicket_seqnumber :"",
                  crate_time: ["",""],
                  "shift_date-max" : "",
                  "shift_date-min" : "",
                  depositTicket_type : "",
                  year_month: "",//currentShift.data.year_month ? currentShift.data.year_month :"",
                  shift_date: "",//currentShift.data.shift_date ? currentShift.data.shift_date :"",
                  shift: ""
              };
//              if(currentShift.data && currentShift.data.year_month){
//                  init_condition.year_month = currentShift.data.year_month;
//              }
//              if(currentShift.data && currentShift.data.shift_date){
//                  init_condition.shift_date = currentShift.data.shift_date;
//              }
              $scope.condition = angular.copy(init_condition);
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });
              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              $scope.$watch("condition.crate_time", function(new_value){
                  $scope.condition.crate_time[0] = $scope.condition.crate_time[0] ? $filter('date')($scope.condition.crate_time[0], 'yyyy-MM-dd') : "";
                  $scope.condition.crate_time[1] = $scope.condition.crate_time[1] ? $filter('date')($scope.condition.crate_time[1], 'yyyy-MM-dd') : "";
              }, true);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
              $scope.$watch("condition.shift_date", function(new_value){
                  $scope.condition.shift_date = $scope.condition.shift_date ? $filter('date')($scope.condition.shift_date, 'yyyy-MM-dd') : "";
              });

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('depositTicketDayReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"存單日報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "DepositTicketDayReport"; //存單日報表
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  agent_code: "",
                  shift_date: ""//currentShift.data.shift_date ? currentShift.data.shift_date :"",
              };
              if(currentShift.data && currentShift.data.shift_date){
                  init_condition.shift_date = currentShift.data.shift_date;
              }
              $scope.condition = angular.copy(init_condition);

              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });
              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }


              $scope.$watch("condition.shift_date", function(new_value){
                  $scope.condition.shift_date = $scope.condition.shift_date ? $filter('date')($scope.condition.shift_date, 'yyyy-MM-dd') : "";
              });

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

      }]).controller('depositCardSummaryReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,user){
              breadcrumb.items = [
                  {"name":"存卡匯總","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.report_code = "DepositCardTotal"; //存卡匯總
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  agent_code: "",

                  agent_name: "",
                  card_name: "",
                  deposit_amount:"",
                  isHallAll:""

              };
              $scope.condition = angular.copy(init_condition);

              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){

                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }

                  if($scope.condition.halls && $scope.condition.halls.length>0){
                      $scope.condition.isHallAll = "";
                  }else{
                      $scope.condition.isHallAll = true;
                  }
              });
              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

     }]).controller('depositCardReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"存卡報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "DepositCardReport"; //存卡報表
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  agent_code: "",
                  crate_time: ["",""],
                  year_month: "",//currentShift.data.year_month ? currentShift.data.year_month :"",
                  shift_date: "",//currentShift.data.shift_date ? currentShift.data.shift_date :"",
                  shift: ""
              };
              if(currentShift.data && currentShift.data.year_month){
                  init_condition.year_month = currentShift.data.year_month;
              }
              if(currentShift.data && currentShift.data.shift_date){
                  init_condition.shift_date = currentShift.data.shift_date;
              }
              $scope.condition = angular.copy(init_condition);
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });
              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              $scope.$watch("condition.crate_time", function(new_value){
                  $scope.condition.crate_time[0] = $scope.condition.crate_time[0] ? $filter('date')($scope.condition.crate_time[0], 'yyyy-MM-dd') : "";
                  $scope.condition.crate_time[1] = $scope.condition.crate_time[1] ? $filter('date')($scope.condition.crate_time[1], 'yyyy-MM-dd') : "";
              }, true);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
              $scope.$watch("condition.shift_date", function(new_value){
                  $scope.condition.shift_date = $scope.condition.shift_date ? $filter('date')($scope.condition.shift_date, 'yyyy-MM-dd') : "";
              });

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('depositCardWaterReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"存卡流水報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "DepositCardWaterReport"; //存卡報表
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  agent_code: "",
                  agent_name:"",
                  shift_date: ["",""],
                  year_month: "",//currentShift.data.year_month ? currentShift.data.year_month :"",
                  shift: "",
                  card_name:"",
                  transaction_type:""
              };
              if(currentShift.data && currentShift.data.year_month){
                  init_condition.year_month = currentShift.data.year_month;
              }
//              if(currentShift.data && currentShift.data.shift_date){
//                  init_condition.shift_date = currentShift.data.shift_date;
//              }
              $scope.condition = angular.copy(init_condition);
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });
              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              $scope.$watch("condition.shift_date", function(new_value){
                  $scope.condition.shift_date[0] = $scope.condition.shift_date[0] ? $filter('date')($scope.condition.shift_date[0], 'yyyy-MM-dd') : "";
                  $scope.condition.shift_date[1] = $scope.condition.shift_date[1] ? $filter('date')($scope.condition.shift_date[1], 'yyyy-MM-dd') : "";
              }, true);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
//              $scope.$watch("condition.shift_date", function(new_value){
//                  $scope.condition.shift_date = $scope.condition.shift_date ? $filter('date')($scope.condition.shift_date, 'yyyy-MM-dd') : "";
//              });

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('transferWaterReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"轉賬流水報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "TransferWaterReport"; //轉賬流水報表
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_code:"",
                  send_agent_code: "",
                  send_card_name:"",
                  receive_agent_code: "",
                  receive_card_name:"",
                  agent_group_name:"",
                  shift_date: ["",""],
                  shiftMark_shift_date:[""],
                  year_month:"",
                  shift: ""
              };
              if(currentShift.data && currentShift.data.year_month){
                  init_condition.year_month = currentShift.data.year_month;
              }
//              if(currentShift.data && currentShift.data.shift_date){
//                  init_condition.shift_date = currentShift.data.shift_date;
//              }
              $scope.condition = angular.copy(init_condition);
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });
              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              $scope.$watch("condition.shift_date", function(new_value){
                  $scope.condition.shift_date[0] = $scope.condition.shift_date[0] ? $filter('date')($scope.condition.shift_date[0], 'yyyy-MM-dd') : "";
                  $scope.condition.shift_date[1] = $scope.condition.shift_date[1] ? $filter('date')($scope.condition.shift_date[1], 'yyyy-MM-dd') : "";
              }, true);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
              $scope.$watch("condition.shiftMark_shift_date", function(new_value){
                  $scope.condition.shiftMark_shift_date[0] = $scope.condition.shiftMark_shift_date[0] ? $filter('date')($scope.condition.shiftMark_shift_date[0], 'yyyy-MM-dd') : "";
              }, true);

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('crossTransferWaterReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"飛數流水報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "CrossTransferWaterReport"; //飛數流水報表
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  send_agent_code: "",
                  send_card_name:"",
                  receive_agent_code: "",
                  receive_card_name:"",
                  agent_group_name:"",
                  shift_date: ["",""],
                  shiftMark:{shift_date:[""]},
                  year_month:"",
                  shift: ""
              };
              if(currentShift.data && currentShift.data.year_month){
                  init_condition.year_month = currentShift.data.year_month;
              }
//              if(currentShift.data && currentShift.data.shift_date){
//                  init_condition.shift_date = currentShift.data.shift_date;
//              }
              $scope.condition = angular.copy(init_condition);
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });
              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              $scope.$watch("condition.shift_date", function(new_value){
                  $scope.condition.shift_date[0] = $scope.condition.shift_date[0] ? $filter('date')($scope.condition.shift_date[0], 'yyyy-MM-dd') : "";
                  $scope.condition.shift_date[1] = $scope.condition.shift_date[1] ? $filter('date')($scope.condition.shift_date[1], 'yyyy-MM-dd') : "";
              }, true);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
              $scope.$watch("condition.shiftMark.shift_date", function(new_value){
                  $scope.condition.shiftMark.shift_date[0] = $scope.condition.shiftMark.shift_date[0] ? $filter('date')($scope.condition.shiftMark.shift_date[0], 'yyyy-MM-dd') : "";
              }, true);

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('depositTotalReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,user){
              breadcrumb.items = [
                  {"name":"存款統計報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.report_code = "DepositStatisticsReport"; //存款統計報表
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  agent_code: ""
              };
              $scope.condition = angular.copy(init_condition);
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });
              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('everyHallLoanRecordReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','currentShift','shiftMarks','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,currentShift,shiftMarks,user){
              breadcrumb.items = [
                  {"name":"各館貸款記錄報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "EveryHallLoanRecordReport";
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  agent_code: "",
                  loan_time: ["",""],
                  year_month: "",//currentShift.data.year_month ? currentShift.data.year_month :"",
                  shift_date: "",//currentShift.data.shift_date ? currentShift.data.shift_date :"",
                  shift: ""
              };
              if(currentShift.data && currentShift.data.year_month){
                  init_condition.year_month = currentShift.data.year_month;
              }
              if(currentShift.data && currentShift.data.shift_date){
                  init_condition.shift_date = currentShift.data.shift_date;
              }
              $scope.condition = angular.copy(init_condition);
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });

              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              $scope.$watch("condition.loan_time", function(new_value){
                  $scope.condition.loan_time[0] = $scope.condition.loan_time[0] ? $filter('date')($scope.condition.loan_time[0], 'yyyy-MM-dd') : "";
                  $scope.condition.loan_time[1] = $scope.condition.loan_time[1] ? $filter('date')($scope.condition.loan_time[1], 'yyyy-MM-dd') : "";
              }, true);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
              $scope.$watch("condition.shift_date", function(new_value){
                  $scope.condition.shift_date = $scope.condition.shift_date ? $filter('date')($scope.condition.shift_date, 'yyyy-MM-dd') : "";
              });

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }


          }]).controller('rollingSummaryReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user','commissionCard',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user,commissionCard){
              breadcrumb.items = [
                  {"name":"轉碼匯總","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;
              $scope.report_code = "RollingTotal1"; //轉碼匯總
              var init_condition = {
                  /*halls : [],
                  agent_group_name: "",
                  agent_code: "",
                  shift_date: ["",""],
                  year_month: "",//currentShift.data.year_month ? currentShift.data.year_month :"",
                  only_shift_date: "",//currentShift.data.shift_date ? currentShift.data.shift_date :"",
                  shift: ""*/

                  halls:[],
                  agentInfo:{agent_code: ""},
                  agent_group_name: "",
                  commission_card_id:"",
                  is_amount: "1",
                  year_month:[currentShift.data.year_month],
                  date:["",""],
                  chips_type:""
              };

              $scope.condition = angular.copy(init_condition);
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });
              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              $scope.$watch("condition.year_month[0]", function(new_value){
                  $scope.condition.year_month[0] = $scope.condition.year_month[0] ? $filter('date')($scope.condition.year_month[0], 'yyyy-MM') : "";
              });
              $scope.$watch("condition.date[0]", function(new_value){
                  $scope.condition.date[0] = $scope.condition.date[0] ? $filter('date')($scope.condition.date[0], 'yyyy-MM-dd') : "";
              });
              $scope.$watch("condition.date[1]", function(new_value){
                  $scope.condition.date[1] = $scope.condition.date[1] ? $filter('date')($scope.condition.date[1], 'yyyy-MM-dd') : "";
              });

              //戶口查詢名稱
              $scope.$watch('condition.agentInfo.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  $scope.commissionCards = [];
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0]) {
                              $scope.agent_name = agents[0].agent_name;
                              $scope.commissionCards = commissionCard.query(globalFunction.generateUrlParams({agent_info_id: agents[0].id}));
                          }
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('rollingReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"轉碼報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "RollingReport"; //轉碼報表
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  agent_code: "",
                  shift_date: ["",""],
                  year_month: "",//currentShift.data.year_month ? currentShift.data.year_month :"",
                  only_shift_date: "",//currentShift.data.shift_date ? currentShift.data.shift_date :"",
                  shift: ""
              };
              if(currentShift.data && currentShift.data.year_month){
                  init_condition.year_month = currentShift.data.year_month;
              }
//              if(currentShift.data && currentShift.data.shift_date){
//                  init_condition.only_shift_date = currentShift.data.shift_date;
//              }
              $scope.condition = angular.copy(init_condition);

              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });

              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              $scope.$watch("condition.shift_date", function(new_value){
                  $scope.condition.shift_date[0] = $scope.condition.shift_date[0] ? $filter('date')($scope.condition.shift_date[0], 'yyyy-MM-dd') : "";
                  $scope.condition.shift_date[1] = $scope.condition.shift_date[1] ? $filter('date')($scope.condition.shift_date[1], 'yyyy-MM-dd') : "";
              }, true);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
              $scope.$watch("condition.only_shift_date", function(new_value){
                  $scope.condition.only_shift_date = $scope.condition.only_shift_date ? $filter('date')($scope.condition.only_shift_date, 'yyyy-MM-dd') : "";
              });

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('consumptionSummaryReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"消費匯總","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "ConsumptionTotal"; //消費匯總
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  agent_code: "",
                  shift_date: ["",""],
                  year_month: "",//currentShift.data.year_month ? currentShift.data.year_month :"",
                  only_shift_date: "",//currentShift.data.shift_date ? currentShift.data.shift_date :"",
                  shift: ""
              };
              if(currentShift.data && currentShift.data.year_month){
                  init_condition.year_month = currentShift.data.year_month;
              }
//              if(currentShift.data && currentShift.data.shift_date){
//                  init_condition.only_shift_date = currentShift.data.shift_date;
//              }
              $scope.condition = angular.copy(init_condition);
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });

              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              $scope.$watch("condition.shift_date", function(new_value){
                  $scope.condition.shift_date[0] = $scope.condition.shift_date[0] ? $filter('date')($scope.condition.shift_date[0], 'yyyy-MM-dd') : "";
                  $scope.condition.shift_date[1] = $scope.condition.shift_date[1] ? $filter('date')($scope.condition.shift_date[1], 'yyyy-MM-dd') : "";
              }, true);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
              $scope.$watch("condition.only_shift_date", function(new_value){
                  $scope.condition.only_shift_date = $scope.condition.only_shift_date ? $filter('date')($scope.condition.only_shift_date, 'yyyy-MM-dd') : "";
              });

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('consumptionIncomeReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"消費收益報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;
              $scope.report_code = "ConsumptionProfitReport"; //消費收益報表
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  agent_code: "",
                  shift_date: ["",""],
                  year_month: "",//currentShift.data.year_month ? currentShift.data.year_month :"",
                  only_shift_date: "",//currentShift.data.shift_date ? currentShift.data.shift_date :"",
                  shift: ""
              };
              if(currentShift.data && currentShift.data.year_month){
                  init_condition.year_month = currentShift.data.year_month;
              }
//              if(currentShift.data && currentShift.data.shift_date){
//                  init_condition.only_shift_date = currentShift.data.shift_date;
//              }
              $scope.condition = angular.copy(init_condition);
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });
              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }


              $scope.$watch("condition.shift_date", function(new_value){
                  $scope.condition.shift_date[0] = $scope.condition.shift_date[0] ? $filter('date')($scope.condition.shift_date[0], 'yyyy-MM-dd') : "";
                  $scope.condition.shift_date[1] = $scope.condition.shift_date[1] ? $filter('date')($scope.condition.shift_date[1], 'yyyy-MM-dd') : "";
              }, true);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
              $scope.$watch("condition.only_shift_date", function(new_value){
                  $scope.condition.only_shift_date = $scope.condition.only_shift_date ? $filter('date')($scope.condition.only_shift_date, 'yyyy-MM-dd') : "";
              });

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('consumptionReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','consumptionType','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,consumptionType,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"消費報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;
              $scope.report_code = "ConsumptionReport"; //消費報表
              $scope.consumptionTypes = consumptionType.query();
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  agent_code: "",
                  shift_date: ["",""],
                  year_month: "",//currentShift.data.year_month ? currentShift.data.year_month :"",
                  only_shift_date: "",//currentShift.data.shift_date ? currentShift.data.shift_date :"",
                  shift: "",
                  consumption_type_id:""
              };
              if(currentShift.data && currentShift.data.year_month){
                  init_condition.year_month = currentShift.data.year_month;
              }
              if(currentShift.data && currentShift.data.shift_date){
                  init_condition.only_shift_date = currentShift.data.shift_date;
              }
              $scope.condition = angular.copy(init_condition);
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });

              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }


              $scope.$watch("condition.shift_date", function(new_value){
                  $scope.condition.shift_date[0] = $scope.condition.shift_date[0] ? $filter('date')($scope.condition.shift_date[0], 'yyyy-MM-dd') : "";
                  $scope.condition.shift_date[1] = $scope.condition.shift_date[1] ? $filter('date')($scope.condition.shift_date[1], 'yyyy-MM-dd') : "";
              }, true);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
              $scope.$watch("condition.only_shift_date", function(new_value){
                  $scope.condition.only_shift_date = $scope.condition.only_shift_date ? $filter('date')($scope.condition.only_shift_date, 'yyyy-MM-dd') : "";
              });

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('sceneRecordReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"場面數報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;
              $scope.report_code = "SceneCountReport"; //場面數報表
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  agent_code: "",
                  //loan_time: ["",""],
                  year_month: currentShift.data.year_month ? currentShift.data.year_month :"",
                  shift_date: ["",""],
                  only_shift_date: currentShift.data.shift_date ? currentShift.data.shift_date :"",
                  shift: ""
              };
              if(currentShift.data && currentShift.data.year_month){
                  init_condition.year_month = currentShift.data.year_month;
              }
              if(currentShift.data && currentShift.data.shift_date){
                  init_condition.only_shift_date = currentShift.data.shift_date;
              }
              $scope.condition = angular.copy(init_condition);
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });

              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              $scope.$watch("condition.shift_date", function(new_value){
                  $scope.condition.shift_date[0] = $scope.condition.shift_date[0] ? $filter('date')($scope.condition.shift_date[0], 'yyyy-MM-dd') : "";
                  $scope.condition.shift_date[1] = $scope.condition.shift_date[1] ? $filter('date')($scope.condition.shift_date[1], 'yyyy-MM-dd') : "";
              }, true);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
              $scope.$watch("condition.only_shift_date", function(new_value){
                  $scope.condition.only_shift_date = $scope.condition.only_shift_date ? $filter('date')($scope.condition.only_shift_date, 'yyyy-MM-dd') : "";
              });

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('overdueAllowanceIncomeReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"下線津貼收益","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "UnderlingAllowance"; //下線津貼收益
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  year_month: ""//currentShift.data.year_month ? currentShift.data.year_month :""
              };
              if(currentShift.data && currentShift.data.year_month){
                  init_condition.year_month = currentShift.data.year_month;
              }
              $scope.condition = angular.copy(init_condition);

              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });

              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('overdueAllowanceReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"逾期津貼","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "OverdueAllowance"; //逾期津貼
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  year_month: ""//currentShift.data.year_month ? currentShift.data.year_month :""
              };
              if(currentShift.data && currentShift.data.year_month){
                  init_condition.year_month = currentShift.data.year_month;
              }
              $scope.condition = angular.copy(init_condition);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
//              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });

              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('windingAllowanceIncomeReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"下線津貼收益","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "UnderlingAllowance"; //逾期津貼
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  year_month: ""//currentShift.data.year_month ? currentShift.data.year_month :""
              };
              if(currentShift.data && currentShift.data.year_month){
                  init_condition.year_month = currentShift.data.year_month;
              }
              $scope.condition = angular.copy(init_condition);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });

              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('overdueRecoveryReportCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"津貼回收","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "AllowanceRetrieve"; //過期回收
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  agent_group_name: "",
                  year_month: ""//currentShift.data.year_month ? currentShift.data.year_month :""
              };
              if(currentShift.data && currentShift.data.year_month){
                  init_condition.year_month = currentShift.data.year_month;
              }
              $scope.condition = angular.copy(init_condition);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });

              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

              //戶口查詢名稱
              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
                  $scope.agent_name = "";
                  if(new_value){
                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
                          if(agents[0])
                              $scope.agent_name = agents[0].agent_name;
                      });
                  }
              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }]).controller('dividedIntoCtrl',['$scope','$filter','$modal','breadcrumb','topAlert','getDate','globalFunction','tmsPagination','hallName','agentsLists','shiftMarks','currentShift','user',
          function($scope,$filter,$modal,breadcrumb,topAlert,getDate,globalFunction,tmsPagination,hallName,agentsLists,shiftMarks,currentShift,user){
              breadcrumb.items = [
                  {"name":"分成報表","active":true}
              ];
              $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(hall){return hall.hall_type != 1;});
              $scope.shiftMarts = shiftMarks.items;

              $scope.report_code = "DividedReport"; //分成報表
              var init_condition = {
                  halls : [{ id:user.hall.id, name: user.hall.hall_name}],
                  year_month: ""//currentShift.data.year_month ? currentShift.data.year_month :""
              };
              if(currentShift.data && currentShift.data.year_month){
                  init_condition.year_month = currentShift.data.year_month;
              }
              $scope.condition = angular.copy(init_condition);

              $scope.$watch("condition.year_month", function(new_value){
                  $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";
              });
              $scope.select_halls = [];
              $scope.$watch('select_halls', function(new_value){
                  if(!user.isAllHall())
                  {
                      $scope.condition.halls = [{ id:user.hall.id, name: user.hall.hall_name}];
                  }
                  else
                  {
                      $scope.condition.halls = [];
                      _.each($scope.select_halls, function($that, $key){
                          var obj = {
                              id : $that,
                              name : (_.findWhere($scope.halls, {id : $that})).hall_name
                          }
                          $scope.condition.halls[$key] = obj;
                      })
                  }
              });

              //全選
              $scope.select_all = function(){
                  $scope.select_halls = [];
                  if(!$scope.select_status){
                      _.each($scope.halls,function(hall){
                          $scope.select_halls.push(hall.id);
                      })
                  }
              }

//              //戶口查詢名稱
//              $scope.$watch('condition.agent_code',globalFunction.debounce(function(new_value, old_value){
//                  $scope.agent_name = "";
//                  if(new_value){
//                      agentsLists.query({agent_code:new_value}).$promise.then(function(agents){
//                          if(agents[0])
//                              $scope.agent_name = agents[0].agent_name;
//                      });
//                  }
//              }));

              $scope.reset = function(){
                  $scope.select_halls = [];
                  $scope.select_status = false;
                  $scope.condition = angular.copy(init_condition);
              }

          }])
}).call(this);
