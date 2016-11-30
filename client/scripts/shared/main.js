(function() {
  'use strict';
  angular.module('app.controllers', []).controller('AppCtrl', [
    '$scope', '$location','user','userManager','globalConfig','$state', '$window','$timeout', 'windowTheme','topAlert','currentShift', function($scope, $location,user,userManager,globalConfig,$state, $window, $timeout, windowTheme,topAlert, currentShift) {

          windowTheme.change();
          /*ivr1*/
          $scope.signstate=true
          $scope.$on("signstate",function(ev,data)
          {
              $scope.signstate=data
          })
          /*ivr1_end*/
      $scope.isSpecificPage = function() {
        var path;
        path = $location.path();
        return _.contains(['/404', '/pages/500', '/pages/login', '/common/signin','/pages/signup', '/pages/signup1', '/pages/signup2', '/pages/forgot', '/pages/lock-screen'], path);
      };
          /*ivr1*/
          var iframePanelsScope = $window.parent.angular.element("#iframePanels").scope();
          if(iframePanelsScope)
              $scope.socket = iframePanelsScope.socket;
          /*ivr1_end*/
      $scope.enableClientValidation = globalConfig.enableClientValidation;
      $scope.state = $state;
      $scope.topAlert = topAlert;
      userManager.restorageUserInfo().then(function(){
          $scope.$broadcast('executeAfterGetUserInfo');
//          $scope.$broadcast('agentDetailCtrl');
      });
      $scope.user = user;
      $scope.$on('$stateChangeStart',
          function(event, toState, toParams, fromState, fromParams){
              // set previousUrl
              toState.previousUrl = fromState.url;

              //if not login then go to sign page
              if(!sessionStorage.token && toState.name != globalConfig.signinUrl){
                  event.preventDefault();
                  $state.go(globalConfig.signinUrl);
              }
              //check permission
              if(!angular.isUndefined(toState.permissions) && !user.checkPermissions(toState.permissions)) {
                  topAlert.warning('您沒有操作該功能的權限');
                  event.preventDefault();
                  return false;
              }
              sessionStorage.setItem('report_error',toState.name);
          });

        $scope.$on('$stateChangeSuccess',
            function(event){
                if(!$window.parent.angular.element("#iframePanels").length){ return false; }
                $timeout(function(){}, 100)
                    .then(function()
                    {
                        var scope = angular.element("#breadcrumb").scope();
                        var items = scope.breadcrumb.items;
                        var activeObj = _.findWhere(items, {active: true});
                        var iframePanelsScope = $window.parent.angular.element("#iframePanels").scope();

                        if(sessionStorage.getItem("token"))
                        {
                            var show_index = iframePanelsScope.show_index; //高亮 tab 的 index
                            iframePanelsScope.iframePanels[show_index]['title'] = activeObj.name;
                            iframePanelsScope.resize();
                        }
                        else
                        {
                            iframePanelsScope.reset();
                        }
                        iframePanelsScope.$apply();

                    })
          });

          $scope.changeCurrentShift = function(shift)
          {
              currentShift.set(shift);
          }

          $scope.logOut = function()
          {
              if($window.location.hash != '#/'+globalConfig.signinUrl)
              {
                  $location.path(globalConfig.signinUrl);
              }

          }



      $scope.$on('afterLogin', function(e) {
          $scope.$broadcast('executeAfterLogin');
          $scope.$broadcast('executeAfterGetUserInfo');

      });
      $scope.$on('afterChangeHall', function(e) {
          $scope.$broadcast('executeAfterChangeHall');
      });

      //存卡管理
//      $scope.$on('depositTicketCard', function(e) {
//          $scope.$broadcast('executeDepositTicketCard');
//      });

      return $scope.main = {
        brand: 'TMS',
        user: user
      };
    }
  ]).controller('NavCtrl', [
    '$scope', 'taskStorage', 'filterFilter','shiftMark','getDate','userInfo','currentShift',function($scope, taskStorage, filterFilter,shiftMark,getDate,userInfo,currentShift) {
      $scope.permissions = [];

      $scope.checkPermissions = function(permission){
//          return true;
          return $scope.user.checkPermissions(permission);
      }

      if(sessionStorage.token){
          currentShift.set(JSON.parse(sessionStorage.getItem('currentShift')));
      }
      /*$scope.$on('executeAfterLogin', function(event) {
          $scope.shift_mark = currentShift;
      });
      $scope.$on('executeAfterChangeHall', function(event) {
          $scope.shift_mark = currentShift;
      });*/
      $scope.shift_mark = currentShift;
      var tasks;
      tasks = $scope.tasks = taskStorage.get();
      $scope.taskRemainingCount = filterFilter(tasks, {
        completed: false
      }).length;
    }
  ]).controller('DashboardCtrl', ['$scope', function($scope) {

  }]).controller('emptyCtrl', ['$scope','breadcrumb', function($scope,breadcrumb) {
      breadcrumb.items = [
          {"name":"新頁面","active":true}
      ];
  }]).controller('breadcrumbCtrl',['$scope','breadcrumb','$window', 'departmentShortcuts', 'user','$state',function($scope,breadcrumb,$window, departmentShortcuts, user,$state){
      $scope.breadcrumb = breadcrumb;
      $scope.goBack = function(){
          $window.history.back();
      }
      $scope.reflesh = function(){
          $state.go($state.current, {}, {reload: true});
      }
      var department_id = user.department.id;
      $scope.department_shortcuts = [];
      $scope.$watch('user.department.id', function(new_value)
      {
          if(!$scope.department_shortcuts.length && new_value)
          {
              $scope.department_shortcuts = departmentShortcuts.query({department_id : new_value});
          }
      })
      $scope.$on('executeAfterLogin', function(event) {
          $scope.department_shortcuts = [];
          $scope.department_shortcuts = departmentShortcuts.query({department_id : user.department.id});
      });
  }]).controller('alertCtrl',['$scope','topAlert','$interval', '$document', function($scope,topAlert,$interval, $document){
      $scope.alerts = topAlert.alerts;
      $interval(function(){
          if($scope.alerts.length > 0){
              var last_alert = _.last($scope.alerts);
              if(last_alert.expires <= Date.parse(new Date()))
                  $scope.alerts.pop();
          }
      },500);//0.5秒
      $scope.closeAlert = function(index) {
          $scope.alerts.splice(index, 1);
      };
      $scope.closeAll = function() {
          topAlert.clear();
      };

      $document[0].onkeyup = function(event){
          if(event.keyCode === 27) {
              topAlert.clear();
              event.preventDefault();
          }
      }

  }]).controller('signinCtrl',['$scope','$http','$location','globalFunction','user','userManager','hallName','nodeFunction','departmentType','$timeout','$q','currentMachine',
      function($scope,$http,$location,globalFunction,user,userManager,hallName,nodeFunction,departmentType,$timeout,$q,currentMachine){
      var original;
          /*ivr1*/
          $scope.$emit("signstate",false)
          /*ivr1_end*/
      $scope.is_loading = false;
      $scope.user = {
          username: '',
          password: '',
          hall_id:""
      };
      $scope.halls = hallName.query({hall_type:"|3"});
      $scope.signin_url = globalFunction.getApiUrl('common/user/login');
      original = angular.copy($scope.user);
      $scope.revert = function() {
          $scope.user = angular.copy(original);
          return $scope.form_signin.$setPristine();
      };
      $scope.canSubmit = function() {
          return $scope.form_signin.$valid && !angular.equals($scope.user, original);
      };
      function resize_window(){
          if(window.innerWidth <= 1450){
              $('body').addClass('nav-min');
          }else{
              $('body').removeClass('nav-min');
          }
      }
      $scope.login = function(){
          var deferred = $q.defer();
          userManager.login($scope.user).then(function(greeting) {
              /*ivr1*/
              $scope.$emit("signstate",true)
              $scope.socket.emit('init',{
                  hall_id:user.hall.id,
//                  hall_id: currentMachine.get('hall_id'),
              /*    hall_id:"03A665B512BF621BE0539715A8C03C44",*/
                  line_id:user.hall.line_id,
                  department_id:user.department.id,
                  user_id:user.id,
                  landline_id:currentMachine.get('landline_id')
              })
              sessionStorage.setItem("call_id","")
              /*ivr1_end*/

              $timeout(function(){resize_window()},500);
              $scope.$emit("afterLogin");
              if(user.department.id == "19E3111A0455BF7BE050A8C0981566B0" || user.department.id == "1A58D1844FE649DEE050A8C098151B5C") {
                  $location.path('/agent/agent-detail/');
              }else if(user.department.code == departmentType.treasury){
                  $location.path('/agent/agent-detail/');
              }else if(user.department.code == departmentType.account || user.department.code == departmentType.accountB){
                  $location.path('/agent/agent-account-detail/');
              }else if(user.department.code == departmentType.scene){
                  $location.path('/agent/agent-scene-detail/');
              }else{
                  $location.path('/agent/agent-service-detail/');
              }
              deferred.resolve(greeting);
          },function(){
              deferred.reject();
          });
          return deferred.promise;
      }
      return $scope.submitForm = function() {
          $scope.is_loading = true;
          if(typeof require === 'function') {
              nodeFunction.getMac().then(function(mac){
                  $scope.user.mac = mac;
                  $scope.login().then(function(){
                      nodeFunction.maximize();
                      $scope.is_loading = false;
                  },function(){
                      $scope.is_loading = false;
                  })
              },function(error){
                  $scope.is_loading = false;
              })
          }else{
             $scope.user.mac = "C8-1F-66-46-30-1D";
              $scope.login().then(function(){
                  $scope.is_loading = false;
              },function(){
                  $scope.is_loading = false;
              })
          }
      };
  }]).controller('headerCtrl',['$scope','$location','$modal','$state','windowItems','userManager','hallName','departmentType', 'windowTheme', 'hallTotalMonthly','currentShift', '$window', 'globalConfig', 'getVersion',
      function($scope,$location,$modal,$state,windowItems,userManager,hallName,departmentType, windowTheme, hallTotalMonthly,currentShift, $window ,globalConfig, getVersion){
      $scope.show_hall_menu = false;
      //alert(1);
//      $scope.tests = function(){
//          windowItems.confirm("系統提示","您確定要最小化嗎？",function(){alert(1);});//
//      }
          $scope.version = globalConfig.version;
          $scope.getVersion = function(){
              $modal.open({
                  templateUrl: "views/share/version.html",
                  controller: "versionCtrl"
              });
          }

          //選擇廳管
          $scope.selectHall = function(hall){
              //console.log(hall)
              $scope.selectd_hall= hall;

              userManager.setUserAttribute("hall",hall);
              $scope.menu = false;
              hallName.setHall({"id":$scope.user.hall.id}).$promise.then(function(data){
                  currentShift.set(data.shift);
                  //console.log(currentShift)
                  $scope.$emit('afterChangeHall');
                  $state.go($state.current, {}, {reload: true});
              });
              if($window.parent.angular.element("#iframePanels").length)
              {
                  var iframePanelsScope = $window.parent.angular.element("#iframePanels").scope();
                  iframePanelsScope.resetHall(hall);
              }
              //window.location.reload();//強制刷新
          }

          /*this.selectHall = function(hall){
              $scope.selectHall(hall);
          }*/
/*      $scope.$on('executeAfterGetUserInfo',function(event){
          var condtion = {};
          //if($scope.user.department.code != departmentType.account)
          //  condtion = {"hall_type":'|1'};
          $scope.halls = hallName.query(condtion);
      })*/
      //显示廳會列表
      $scope.menu=false;
      $scope.show_hall = function(){
          $scope.menu = !$scope.menu;
      }

      if(typeof require === 'function' ){

          var gui = require('nw.gui');
          var win = gui.Window.get();

          //window.WindowManager = new WindowManager();
          //win.maximize();

          //是否关闭程序
          var isShowConfirm = true;
          var isShowWindow = true;
          var tray = new gui.Tray({ title: '長城賬房系統', icon: './images/icon.png' });
          tray.tooltip = '長城賬房系統';

          //添加一个菜单
          var menu = new gui.Menu();
          menu.append(new gui.MenuItem({
              label: '關閉程序' ,
              //icon: './images/icon.png',
              click: function() {
                  win.show();
                  isShowWindow = true;
                  //确定关闭窗口打开
                  if(isShowConfirm)
                      winClose();
              }
          }));

          tray.menu = menu;
          tray.on('click', function () {
              if (isShowWindow) {
                  win.minimize();
                  isShowWindow = false;

              } else {
                  win.show();
                  isShowWindow = true;
              }
          });

          //最小化
          $('.fa.fa-minus').click(function () {
              // win.minimize();
              win.minimize();
              isShowWindow = false;
          });

          //关闭
          $('.fa.fa-times').click(function () {
              winClose();
          });

          //關閉程序提醒窗
          var winClose = function() {
              isShowConfirm = false;
              windowItems.confirm("系統提醒", "確定關閉程序嗎？", function () {
                  win.close();
              }).result.then({},function(){
                      isShowConfirm = true;
              });
          }
          /*var WindowManager = function(){}
          WindowManager.prototype.minimize = function(){
              return win.minimize();
          }*/
      }

      $scope.changeTheme = function(theme)
      {
          windowTheme.change(theme);
      }

      var hall_total = {
          loan : "",
          deposit_ticket : "",
          deposit_card : "",
          rolling : ""
      }
      $scope.hall_total = angular.copy(hall_total);

      $scope.getTotal = function(data)
      {
          $scope.hall_total = angular.copy(hall_total);
          hallTotalMonthly.get().$promise.then(function(data){
              $scope.hall_total = data;
          })
      }

      //退出系統
      $scope.logout = function(){
          windowItems.confirm("系統提醒","您確定要退出程序嗎？",function(){
              //TODO 註銷登錄
              userManager.logout();
          });
      }



  }]).controller('windowCtrl',['$scope','$modalInstance','data',function($scope,$modalInstance,data){

      $scope.dialog_data = data;
      $scope.ok = function () {
          data.callback();
          $modalInstance.close();
      };

      $scope.cancel = function () {
          if(data.callback2){data.callback2()};
          $modalInstance.dismiss('cancel');
      };
  }]).controller('pinCodeModalCtrl',['$scope','$modalInstance','topAlert','md5','resource','method','params','message','is_second_pin_code','get_params',
      function($scope,$modalInstance,topAlert,md5,resource,method,params,message,is_second_pin_code,get_params){
        $scope.allowSubmit = true;
        $scope.is_second_pin_code = is_second_pin_code;
        $scope.confirm=function(pin_code,second_pin_code){
            $scope.allowSubmit = false;
            if(!pin_code || (is_second_pin_code === true && !second_pin_code)){
                if(!pin_code)
                    topAlert.warning("請輸入操作密碼");
                if(is_second_pin_code === true && !second_pin_code)
                    topAlert.warning("請輸入二次授權操作密碼");
                $scope.allowSubmit = true;
            }else{
                params.pin_code = md5.createHash(pin_code);
                if(is_second_pin_code === true)
                    params.second_pin_code = md5.createHash(second_pin_code);
                var p;
                if(get_params){
                    p = resource[method](get_params,params).$promise
                }else{
                    p = resource[method](params).$promise
                }
                p.then(function(data){
                    if(message)
                        topAlert.success(message);
                    $modalInstance.close(data);
                },function(error){
                    if(error.data.status == 400 && (error.data.code == 1001 || error.data.code == 1002|| error.data.code == 1003|| error.data.code == 1004|| error.data.code == 1005))
                        $scope.allowSubmit = true;
                    else
                        $scope.cancel();

                })
            }
        }
        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }
  }]).controller('reportError', ['$scope', '$state', 'topAlert', function($scope, $state, topAlert){
      var report_state = sessionStorage.getItem('report_error');
      topAlert.warning("报表参数错误。");
      $state.go(report_state);
  }]);

}).call(this);
