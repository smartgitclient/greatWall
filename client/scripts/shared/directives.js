(function() {
  angular.module('app.directives', []).directive('imgHolder', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          return Holder.run({
            images: ele[0]
          });
        }
      };
    }
  ]).directive('customBackground', function() {
    return {
      restrict: "A",
      controller: [
        '$scope', '$element', '$location', function($scope, $element, $location) {
          var addBg, path;
          path = function() {
            return $location.path();
          };
          addBg = function(path) {
            $element.removeClass('body-home body-special body-tasks body-lock');
            switch (path) {
              case '/':
                return $element.addClass('body-home');
              case '/404':
              case '/pages/500':
              case '/common/signin':
              case '/pages/signup':
              case '/pages/forgot':
                return $element.addClass('body-special');
              case '/pages/lock-screen':
                return $element.addClass('body-special body-lock');
              case '/tasks':
                return $element.addClass('body-tasks');
            }
          };
          addBg($location.path());
          return $scope.$watch(path, function(newVal, oldVal) {
            if (newVal === oldVal) {
              return;
            }
            return addBg($location.path());
          });
        }
      ]
    };
  }).directive('uiColorSwitch', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          return ele.find('.color-option').on('click', function(event) {
            var $this, hrefUrl, style;
            $this = $(this);
            hrefUrl = void 0;
            style = $this.data('style');
            if (style === 'loulou') {
              hrefUrl = 'styles/main.css';
              $('link[href^="styles/main"]').attr('href', hrefUrl);
            } else if (style) {
              style = '-' + style;
              hrefUrl = 'styles/main' + style + '.css';
              $('link[href^="styles/main"]').attr('href', hrefUrl);
            } else {
              return false;
            }
            return event.preventDefault();
          });
        }
      };
    }
  ]).directive('toggleMinNav', [
    '$rootScope', function($rootScope) {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          var $content, $nav, $window, Timer, app, updateClass;
          app = $('#app');
          $window = $(window);
          $nav = $('#nav-container');
          $content = $('#content');
          ele.on('click', function(e) {
            if (app.hasClass('nav-min')) {
              app.removeClass('nav-min');
            } else {
              app.addClass('nav-min');
              $rootScope.$broadcast('minNav:enabled');
            }
            return e.preventDefault();
          });
          Timer = void 0;
          updateClass = function() {
            var width;
            width = $window.width();
            if (width < 768) {
              return app.removeClass('nav-min');
            }
          };
          return $window.resize(function() {
            var t;
            clearTimeout(t);
            return t = setTimeout(updateClass, 300);
          });
        }
      };
    }
  ]).directive('collapseNav', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          var $a, $aRest, $lists, $listsRest, app;
          $lists = ele.find('ul').parent('li');
          $lists.append('<i class="fa fa-caret-right icon-has-ul"></i>');
          $a = $lists.children('a');
          $listsRest = ele.children('li').not($lists);
          $aRest = $listsRest.children('a');
          app = $('#app');
          $a.on('click', function(event) {
            var $parent, $this;
            if (app.hasClass('nav-min')) {
              return false;
            }
            $this = $(this);
            $parent = $this.parent('li');
            $lists.not($parent).removeClass('open').find('ul').slideUp();
            $parent.toggleClass('open').find('ul').slideToggle();
            return event.preventDefault();
          });
          $aRest.on('click', function(event) {
            return $lists.removeClass('open').find('ul').slideUp();
          });
          return scope.$on('minNav:enabled', function(event) {
            return $lists.removeClass('open').find('ul').slideUp();
          });
        }
      };
    }
  ]).directive('highlightActive', [
    function() {
      return {
        restrict: "A",
        controller: [
          '$scope', '$element', '$attrs', '$location', function($scope, $element, $attrs, $location) {
            var highlightActive, links, path;
            links = $element.find('a');
            path = function() {
              return $location.path();
            };
            highlightActive = function(links, path) {
              path = '#' + path;
              return angular.forEach(links, function(link) {
                var $li, $link, href;
                $link = angular.element(link);
                $li = $link.parent('li');
                href = $link.attr('href');
                if ($li.hasClass('active')) {
                  $li.removeClass('active');
                }
                if (path.indexOf(href) === 0) {
                  return $li.addClass('active');
                }
              });
            };
            highlightActive(links, $location.path());
            return $scope.$watch(path, function(newVal, oldVal) {
              if (newVal === oldVal) {
                return;
              }
              return highlightActive(links, $location.path());
            });
          }
        ]
      };
    }
  ]).directive('toggleOffCanvas', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          return ele.on('click', function() {
            return $('#app').toggleClass('on-canvas');
          });
        }
      };
    }
  ]).directive('slimScroll', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele, attrs) {
          return ele.slimScroll({
            height: attrs.scrollHeight || '100%'
          });
        }
      };
    }
  ]).directive('goBack', [
    function() {
      return {
        restrict: "A",
        controller: [
          '$scope', '$element', '$window', function($scope, $element, $window) {
            return $element.on('click', function() {
              return $window.history.back();
            });
          }
        ]
      };
    }
  ]).directive('serverValidation',['validateForms','$q','$timeout','globalFunction',
      function(validateForms,$q,$timeout,globalFunction){
          return {
              restrict:"A",
              link: function(scope, ele, attrs) {
                      var current_form = scope[attrs.name.replace('$parent.','')];
                      //因为bowser只有在点击submit按钮时才会触发validate，所以这里生成一个隐藏的submit button
                      var submit_btn = $('<button type="submit" style="display:none" ></button>');
                      $(ele).append(submit_btn);
                      current_form.checkValidity = function () {
                          var deferred = $q.defer();
                          $timeout(function(){
                              validateForms.forms[attrs.serverValidation] = current_form;
                              if (ele[0].checkValidity()) {
                                  deferred.resolve('');
                              } else {
                                  deferred.reject('');
                              }
                          },0);
                          return deferred.promise;
                      }
                  current_form.checkPreValidity = function (method,url,fun,data) {
                      var deferred = $q.defer();
                      validateForms.forms[method+globalFunction.getApiUrl(url)] = current_form;
                      fun(data,function() {
                          deferred.resolve('');
                      },function(){
                          deferred.reject('');
                      });
                      return deferred.promise;
                  }


                      current_form.clearErrors = function(){
                          _.each(this,function(field,key){
                              if(key.substr(0,1) != '$' && typeof(current_form[key])!="function"){
                                  current_form[key].$setValidity('server',true);
                                  current_form[key].server_error = "";
                              }
                          })
                      }

                      //scope.$watch()
                      current_form.bindElements = function () {
                          $(ele).find('input,select,textarea').focus(function () {
                              if (current_form[this.name].$error.server === true && this.checkValidity()) {
                                  this.setCustomValidity(current_form[this.name].server_error);
                                  submit_btn.click();
                              }
                          }).blur(function () {
                              this.setCustomValidity('');
                          }).bind('input propertychange',function (event) {
                              this.setCustomValidity('');
                              if (current_form[this.name].$error.server === true && this.checkValidity()) {
                                  this.setCustomValidity(current_form[this.name].server_error);
                              }
                          })
                      }

                      current_form.getElementCount = function () {
                          var ele_keys = _.keys(this);
                          return ele_keys.length;
                      }

                      scope.$watch(attrs.name + '.getElementCount()', function (new_value, old_value) {
                          if (new_value > old_value) {
                              current_form.bindElements();
                          }
                      })
                      scope.$watch(function () {
                          return attrs.serverValidation
                      }, function (new_value, old_value) {
                          validateForms.forms[old_value] = null;
                          validateForms.forms[new_value] = current_form;
                      })
                      current_form.bindElements();
              }
          }

  }]).directive("dynamicName",[function(){
      return {
          restrict:"A",
          require: ['ngModel', '^form'],
          link:function(scope,element,attrs,ctrls){
              //TODO 该指令主要是用来处理列表元素的服务器端验证的，目前这种做法当中间的元素被删除时会有问题，因为被删元素下方的元素的序号没有相应的改变
              var model_ctrl = ctrls[0];
              var form_ctrl = ctrls[1];
              scope.$watch(function(){
                  return attrs.dynamicName;
              },function(newValue,oldValue){
                  form_ctrl.$removeControl(model_ctrl);
                  model_ctrl.$name = scope.$eval(attrs.dynamicName) || attrs.dynamicName;
                  $(element).attr('name',model_ctrl.$name);
                  form_ctrl.$addControl(model_ctrl);
              })
          }
      };
  }]).directive("tabValidation",[function(){
      return {
          restrict:"A",
          require:['tabset','^form'],
          link:function(scope,element,attrs,ctrls){
                var tabset = ctrls[0];
                var form = ctrls[1];
                //TODO 由于没有validate这个事件，所以只能重写checkValidaty，日后改善
                form.checkValidity = function(){
                    if($(element).parents('form')[0].checkValidity()){
                        return true;
                    }else{
                        var tab_panes = $(element).find('.tab-pane');
                        for(var i = 0; i<tab_panes.length;i++)
                        {
                            if($(tab_panes[i]).find('.ng-invalid').length > 0){
                                tabset.select(tabset.tabs[i]);
                                break;
                            }
                        }
                        return false;
                    }
                }
          }
      };
  }]).directive("inputUppercase", ['globalFunction',function(globalFunction) {
      return {
          require: "ngModel",
          restrict: "A",
          link: function(scope, elem, attrs, modelCtrl) {
              elem.bind("input propertychange",globalFunction.debounce(function(event) {
                  scope.$apply(function() {
                      if(!angular.isUndefined(modelCtrl.$modelValue)&&/[a-z]/.test(modelCtrl.$modelValue)){
                          modelCtrl.$setViewValue(angular.uppercase(modelCtrl.$modelValue));
                          $(elem).val(modelCtrl.$modelValue);
                      }
                  });
              },50))
          }
      };
  }]).directive("inputLowercase", ['globalFunction',function(globalFunction) {
      return {
          require: "ngModel",
          restrict: "A",
          link: function(scope, elem, attrs, modelCtrl) {
              elem.bind("input propertychange",globalFunction.debounce(function(event) {
                  scope.$apply(function() {
                      if(!angular.isUndefined(modelCtrl.$modelValue)&&/[A-Z]/.test(modelCtrl.$modelValue)){
                          modelCtrl.$setViewValue(angular.lowercase(modelCtrl.$modelValue));
                          $(elem).val(modelCtrl.$modelValue);
                      }
                  });
              },50))
          }
      };
  }]).directive("enterKey", function() {
      return {
          restrict: "A",
          link: function(scope, elem, attrs) {
              elem.bind("keydown", function(e) {
                  if(e.keyCode == 13){
                      eval('scope.'+attrs.enterKey);
                      return false;
                  }
              })
          }
      };
  }).directive('setFocus', function() {
      return {
          restrict: "A",
          link: function(scope, elem, attrs) {
              elem.bind("click", function(e) {
                  $('#'+attrs.setFocus).focus();
              })
          }

      };
  }).directive('phrasebooktis', ['$modal', function($modal){
      return {
          /*
           * 在节点中设置 属性参数
           * @dir  方向    default : rightTop
           * @margin 是 节点 与弹出窗体的边距 default : 5
           * @insertmodel  是插入到文本框的 name
           *
           * */
          restrict: 'A',
          replace: false,
          link : function($scope, $element, attr, ctrl){
              var insert_model = $element.attr('insertmodel');
              var type = $element.attr('phrasebooktis');
              $element.click(function()
              {
                  var modalInstance;
                  modalInstance = $modal.open({
                      templateUrl: "views/share/phrasebooktis.html",
                      controller: 'phrasebooktisCtrl',
                      windowClass: 'lg-modal',
                      resolve: {
                          phrasebooktis_type : function(){
                              return type;
                          }
                      }
                  });
                  modalInstance.result.then((function(result)
                  {
                      if(result)
                      {
                          var val = $('[name="'+ insert_model +'"]').val();
                          $('[name="'+ insert_model +'"]').val(val + result);
                          $('[name="'+ insert_model +'"]').trigger('input');
                      }
                  }), function()
                  {
                      //$log.info("Modal dismissed at: " + new Date());
                  });
              });

          }

      }
  }]).controller('phrasebooktisCtrl', ['$scope', 'commonPhrase', 'pinCodeModal', 'topAlert', 'globalFunction', 'tmsPagination', '$modalInstance', 'phraseType', 'phrasebooktis_type', function($scope, commonPhrase, pinCodeModal, topAlert, globalFunction, tmsPagination, $modalInstance, phraseType, phrasebooktis_type){

      $scope.form_tis_url = globalFunction.getApiUrl('common/commonphrase');

      $scope.tis_params = {
          phrase : "",
          pin_code: "",
          type : phraseType[phrasebooktis_type]
      }

      var type = phraseType[phrasebooktis_type];
      $scope.page = tmsPagination.create();
      $scope.page.resource = commonPhrase;

      $scope.search = function(page)
      {
          $scope.tiss = $scope.page.select(page, {type : type}, {});
      }
      $scope.search();

      $scope.delete = function(tis)
      {
          pinCodeModal(commonPhrase, 'delete', {id: tis.id}, '刪除成功！').then(function () {
              $scope.search();
          })
      }

      $scope.tis_isDisabled = false;
      $scope.addTis = function()
      {
          if($scope.tis_isDisabled){ return; }
          $scope.tis_isDisabled = true;
          commonPhrase.save($scope.tis_params, function() {
              topAlert.success('添加常用成功！');
              $scope.tis_isDisabled = false;
              $scope.search();
              $scope.form_tis.clearErrors();

              $scope.tis_params = {
                  phrase : "",
                  pin_code: "",
                  type : type
              }
          }, function()
          {
              $scope.tis_isDisabled = false;
          });
      }

      $scope.select = function(tis)
      {
          $modalInstance.close(tis.phrase);
      }

      $scope.cancel = function()
      {
          $modalInstance.dismiss();
      };


  }]).directive('phrasecurrency', ['$modal', function($modal){
      return {
          /*
           * 在节点中设置 属性参数
           * @dir  方向    default : rightTop
           * @margin 是 节点 与弹出窗体的边距 default : 5
           * @insertmodel  是插入到文本框的 name
           *
           * */
          restrict: 'A',
          replace: false,
          link : function($scope, $element, attr, ctrl){
              var insert_model = $element.attr('insertmodel');
              var type = $element.attr('phrasebooktis');
              $element.click(function()
              {
                  var modalInstance;
                  modalInstance = $modal.open({
                      templateUrl: "views/share/phrasecurrency.html",
                      controller: 'phraseCurrencyCtrl',
                      windowClass: 'lg-modal',
                      resolve: {
                          phrasebooktis_type : function(){
                              return type;
                          }
                      }
                  });
                  modalInstance.result.then((function(result)
                  {
                      if(result)
                      {
//                          var val = $('[name="'+ insert_model +'"]').val();
                          $('[name="'+ insert_model +'"]').val(result);
                          $('[name="'+ insert_model +'"]').trigger('input');
                      }
                  }), function()
                  {
                      //$log.info("Modal dismissed at: " + new Date());
                  });
              });

          }

      }
  }]).controller('phraseCurrencyCtrl', ['$scope', 'commonCurrency', 'pinCodeModal', 'topAlert', 'globalFunction', 'tmsPagination', '$modalInstance', 'phraseType', 'phrasebooktis_type', function($scope, commonCurrency, pinCodeModal, topAlert, globalFunction, tmsPagination, $modalInstance, phraseType, phrasebooktis_type){

      $scope.form_currency_url = globalFunction.getApiUrl('common/commoncurrency');

      $scope.tis_params = {
          currency : "",
          pin_code: ""
          //type : 1
      }

      var type = phraseType[phrasebooktis_type];
      $scope.page = tmsPagination.create();
      $scope.page.resource = commonCurrency;

      $scope.search = function(page)
      {
          $scope.tiss = $scope.page.select(page, {}, {});
      }
      $scope.search();

      $scope.delete = function(tis)
      {
          pinCodeModal(commonCurrency, 'delete', {id: tis.id}, '刪除成功！').then(function () {
              $scope.search();
          })
      }

      $scope.tis_isDisabled = false;
      $scope.addTis = function()
      {
          if($scope.tis_isDisabled){ return; }
          $scope.tis_isDisabled = true;
          commonCurrency.save($scope.tis_params, function() {
              topAlert.success('添加常用成功！');
              $scope.tis_isDisabled = false;
              $scope.search();
              $scope.form_tis.clearErrors();

              $scope.tis_params = {
                  currency : "",
                  pin_code: "",
                  type : 1
              }
          }, function()
          {
              $scope.tis_isDisabled = false;
          });
      }

      $scope.select = function(tis)
      {
          $modalInstance.close(tis.currency);
      }

      $scope.cancel = function()
      {
          $modalInstance.dismiss();
      };


  }]).directive('phrasegap', ['$modal', function($modal){
      return {
          /*
           * 在节点中设置 属性参数
           * @dir  方向    default : rightTop
           * @margin 是 节点 与弹出窗体的边距 default : 5
           * @insertmodel  是插入到文本框的 name
           *
           * */
          restrict: 'A',
          replace: false,
          link : function($scope, $element, attr, ctrl){
              var insert_model = $element.attr('insertmodel');
              var type = $element.attr('phrasebooktis');
              $element.click(function()
              {
                  var modalInstance;
                  modalInstance = $modal.open({
                      templateUrl: "views/share/phrasegap.html",
                      controller: 'phraseGapCtrl',
                      windowClass: 'lg-modal',
                      resolve: {
                          phrasebooktis_type : function(){
                              return type;
                          }
                      }
                  });
                  modalInstance.result.then((function(result)
                  {
                      if(result)
                      {
                          //var val = $('[name="'+ insert_model +'"]').val();
                          $('[name="'+ insert_model +'"]').val( result);
                          $('[name="'+ insert_model +'"]').trigger('input');
                      }
                  }), function()
                  {
                      //$log.info("Modal dismissed at: " + new Date());
                  });
              });

          }

      }
  }]).controller('phraseGapCtrl', ['$scope', 'commonGap', 'pinCodeModal', 'topAlert', 'globalFunction', 'tmsPagination', '$modalInstance', 'phraseType', 'phrasebooktis_type', function($scope, commonGap, pinCodeModal, topAlert, globalFunction, tmsPagination, $modalInstance, phraseType, phrasebooktis_type){

      $scope.form_currency_url = globalFunction.getApiUrl('common/commongap');

      $scope.tis_params = {
          gap : "",
          pin_code: "",
          type : 1
      }

      var type = phraseType[phrasebooktis_type];
      $scope.page = tmsPagination.create();
      $scope.page.resource = commonGap;

      $scope.search = function(page)
      {
          $scope.tiss = $scope.page.select(page, {}, {});
      }
      $scope.search();

      $scope.delete = function(tis)
      {
          pinCodeModal(commonGap, 'delete', {id: tis.id}, '刪除成功！').then(function () {
              $scope.search();
          })
      }

      $scope.tis_isDisabled = false;
      $scope.addTis = function()
      {
          if($scope.tis_isDisabled){ return; }
          $scope.tis_isDisabled = true;
          commonGap.save($scope.tis_params, function() {
              topAlert.success('添加限紅類型成功！');
              $scope.tis_isDisabled = false;
              $scope.search();
              $scope.form_tis.clearErrors();

              $scope.tis_params = {
                  currency : "",
                  pin_code: "",
                  type : 1
              }
          }, function()
          {
              $scope.tis_isDisabled = false;
          });
      }

      $scope.select = function(tis)
      {
          $modalInstance.close(tis.gap);
      }

      $scope.cancel = function()
      {
          $modalInstance.dismiss();
      };


  }]).directive('paginationselect', function(){
     return {
         restrict : 'EA',
         scope: { },
         templateUrl : 'views/share/paginationSelect.html',
         controller : ['$scope', '$element', '$attrs', 'paginationConfig', 'globalFunction','topAlert',function($scope, $element, $attrs, paginationConfig, globalFunction,topAlert){
             var self = this;
             var page_size_limit_min = 5;
             var page_size_limit_max = 100;
             self.select_method = $attrs.selectPage;
             self.pagectrl = $attrs.pagectrl;


             $scope.parent_pagination = $scope.$parent[self.pagectrl];
             $scope.page_directive = angular.copy($scope.parent_pagination);

             $scope.paginationSelectChange = function()
             {
                 if(!parseInt($scope.page_directive.items_per_page))
                 {
                     $scope.page_directive.items_per_page = $scope.parent_pagination.items_per_page;
                 }
                 else
                 {
                     $scope.page_directive.items_per_page = parseInt($scope.page_directive.items_per_page);
                 }
                 if($scope.page_directive.items_per_page < page_size_limit_min){
                     $scope.page_directive.items_per_page = $scope.parent_pagination.items_per_page
                     topAlert.warning('每頁條數不能低於'+page_size_limit_min+'條');
                 }else  if($scope.page_directive.items_per_page > page_size_limit_max){
                     $scope.page_directive.items_per_page = $scope.parent_pagination.items_per_page
                     topAlert.warning('每頁條數不能高於'+page_size_limit_max+'條');
                 }else{
                     $scope.parent_pagination.items_per_page =  $scope.page_directive.items_per_page;
                     $scope.$parent[self.select_method](Number($scope.page_directive.page));
                 }
             }

             $scope.$watch("parent_pagination.items_per_page + parent_pagination.page + parent_pagination.total_pages",function(newValue,oldValue){
                 $scope.page_directive = angular.copy($scope.parent_pagination);
             })
         }],
         link : function($scope, $element, attr, ctrl){
             if(angular.isUndefined(attr.pagectrl)){ return; }

             $scope.getPageLength = function(number)
             {
                 return new Array(Number(number));
             }
         },
         replace : true

     }
  }).directive('hallMenu', ['user',function(user){
      return{
          restrict: 'E',
          transclude: true,
          scope: {menu:'=expanderMenu',activeFunction:"=activeFunction"},
          controller: function ($scope,hallName,user,departmentType,globalFunction) {
              $scope.setHall = function(){
                  $scope.halls = globalFunction.getHall();
                  if($scope.halls && $scope.halls.length > 0){
                      if(user.checkPermissions('allowLoginGroup')){
                          $scope.hall1 = _.filter( $scope.halls,function(hall){
                              return hall.hall_type == "1"
                          });
                      }else{
                          $scope.hall1 = [];
                      }
                      $scope.hall2 = _.filter( $scope.halls,function(hall){
                          return hall.hall_type == "2"
                      });
                      $scope.hall2 = _.sortBy($scope.hall2,'create_time');
                  }
              }
              $scope.setHall();
              $scope.$on('executeAfterLogin',function(event){
                  $scope.setHall();
              });
          },
          templateUrl:'views/agent/hall-menu.html'
      }
  }]).directive('reportBtn', ['globalFunction', 'globalConfig', '$filter', '$state', 'topAlert', function(globalFunction, globalConfig, $filter, $state, topAlert){
      return {
          restrict : 'A',
          link : function(scope, ele, attrs, ctrl)
          {
              /*
              * channelType  报表 channel
              * reportParams  报表参数 一般为 搜索条件
              * */
              var channelType = attrs.channelType

              var allShow = attrs.allShow==undefined || attrs.allShow=="false" ? false : true;
              var reportParams = attrs.reportParams;
              var id = attrs.reportConditionId;
              var name =  attrs.reportConditionName
              var resource = globalFunction.createResource(globalConfig.reportUrl);
              var halls_id = ['marker.hall_id'];//
              var report_state = sessionStorage.getItem('report_error');
              if(null !== report_state){
                  sessionStorage.removeItem('report_error');
              }

              /*if(!channelType){ console.error("directive:reportBtn -- channelType null"); return false; }*/

              ele.on('click', function(ev){
                  //var page_condition =scope['pagination'];
                  //return ;
                  sessionStorage.setItem('report_error', $state.current.name);
                  if(id){
                      var condition = {};
                      condition[name] = id;
                  }else{
                      var condition = angular.copy(scope[reportParams]);
                      var condition_halls = condition.halls;
                      condition = globalFunction.generateUrlParams(condition);
                      if(condition_halls){
                          condition.halls =condition_halls;
                      }
                      delete condition['page'];
                      delete condition['halls-range'];
                      delete condition['halls-max'];
                      delete condition['halls-min'];
                      delete condition['per-page'];
                  }

                  condition.channelType = attrs.channelType;
                  /*if(undefined !== condition.hall_id)
                  {
                      if(!condition.hall_id){
                          condition.hall_id = scope.user.hall ? scope.user.hall.id : "";
                          if(condition.hall_id && !condition.hall_name){
                              condition.hall_name = globalFunction.getHall(condition.hall_id) ? (globalFunction.getHall(condition.hall_id)).hall_name : "";
                          }
                      }
                  }*/

                  for(var i in condition){
                      if(-1 == i.indexOf('hall_id') || halls_id.indexOf(i) != -1){
                          //continue;
                      }else{
                          if(undefined !== condition[i])
                          {
                              if(!condition[i] && !allShow){
                                  condition[i] = scope.user.hall && scope.user.hall.hall_type != 1 ? scope.user.hall.id : "";//当前厅是集团时，不提交hall id
                              }
                              else if(!condition[i] && allShow){
                                  condition[i] = "";
                              }
                              if(condition[i] && !condition.hall_name){
                                  condition.hall_name = globalFunction.getHall(condition[i]) ? (globalFunction.getHall(condition[i])).hall_name : "";
                              }
                          }
                      }
                      if(-1 != i.indexOf('.'))
                      {
                          var new_key = i.replace(/\./g,'_');
                          condition[new_key] = condition[i];
                          delete condition[i];
                      }
                  }

                  // 避免参数为nulll
                  _.each(condition,function(ele,index){
                      ele ? ele : condition[index] = "";
                  })
//                   return ;
                  resource.save(condition).$promise.then(function(data)
                  {
                      if(data.link)
                      {
                          location.href = data.link;
                      }
                      else
                      {
                          console.error('directive:reportBtn -- success but link null');
                      }
                  })
              });
          }
      }
  }]).directive("stopPropagation", function() {
      return {
          restrict: "A",
          link: function(scope, elem, attrs) {
              elem.bind("click", function(e) {
                  e.stopPropagation();
              })
          }
      };
  }).directive("tdSort", function() {
      return {
          restrict: "A",
          transclude: true,
          scope: {pagination:'=tdSortPagination',select:"=tdSortSelect"},
          controller: function ($scope,$attrs) {
              $scope.up = $attrs.tdSortUp;
              $scope.down = $attrs.tdSortDown;
              $scope.sortUp = function(){
                  $scope.pagination.sort = $scope.up;
                  $scope.select(1);
              }
              $scope.sortDown = function(){
                  $scope.pagination.sort = $scope.down;
                  $scope.select(1);
              }
          },
          templateUrl:'views/share/td-sort.html'


      };
  }).directive('hotelRoomDatepicker', function($timeout) {
      return {
          restrict:'EA',
          replace: false,
          require:['datepicker','^ngModel'],
          link:function (scope, element, attrs,ctrls) {
              var special_days = ["2014-12-06","2014-12-05"]
              var datepicker = ctrls;
              scope.$watch('special_days',function(new_value){
                  scope.updateSpecialDay();
              },true)
              ctrls[0].select = function(selected){
                  scope.updateSpecialDay();
              }
              scope.updateSpecialDay = function(){
                  $timeout(function(){
                      $(element).find('.background-red').removeClass('background-red');
                      _.each(scope.special_days,function(special_day){;
                          special_day = special_day.replace(' 00:00:00','');
                          $(element).find('[date='+special_day+']').addClass('background-red');
                      })
                  },0);
              }
              scope.updateSpecialDay();
          }
      };
  }).directive("closeWindow", function() {
      return {
          restrict: "A",
          link: function(scope, elem, attrs) {
              if(typeof require === 'function' ) {
                  var gui = require('nw.gui');
                  var win = gui.Window.get();
                  elem.bind("click", function (e) {
                      win.close();
                  })
              }
          }
      };
  }).directive("minimizeWindow", function() {
      return {
          restrict: "A",
          link: function(scope, elem, attrs) {
              if(typeof require === 'function' ) {
                  var gui = require('nw.gui');
                  var win = gui.Window.get();
                  elem.bind("click", function (e) {
                      win.minimize();
                  })
              }
          }
      };
  }).directive("checkPermissions", ['user', function(user) {
      return {
          restrict: "A",
          replace : false,
          link: function(scope, elem, attrs) {
              var permissions = attrs.checkPermissions.split(",");
              var hide_class = 'hide';
              var number = 0;
              _.each(permissions, function($that, $key){
                  if(user.checkPermissions($that)){
                      number++;
                  }
              });
              if(0 === number){
                  elem.addClass(hide_class);
              }
          }
      };
  }]).directive("minScreenWidth", [function() {
      return {
          restrict: "A",
          replace : false,
          link: function(scope, elem, attrs) {
              if(window.innerWidth <= 1450){
                  elem.css('width', attrs.minScreenWidth+'px');
              }
          }
      };
  }])/*.directive('removeZero', function() {//Input去掉无意义的0
      var cur;
      return {
          require: 'ngModel',
          link: function(scope, element, iAttrs, modelCtrl) {
                function remove(num){
                    if(num == 0){
                        cur = 0;
                        return cur;
                    }else if(!num){
                        cur = "";
                        return cur;
                    }else{
                        cur = parseFloat(num);
                        return cur;
                    }
                }
              function parser() {
                  return modelCtrl.$modelValue;
              }
              modelCtrl.$formatters.push(remove);
              modelCtrl.$parsers.unshift(parser);
          }
      };
  })*/.directive('selectedRows',[function(){
      return {
          restrict: "A",
          replace: false,
          link: function(scope, elem, attrs) {
              $(elem).bind('click', function() {
                  $(elem).addClass('selected').siblings().removeClass('selected');
                  /*elem.css('background-color', 'white');
                  scope.$apply(function() {
                      scope.color = "white";
                  });*/
              });
          }
      }
  }]).directive("inputFloat", ['globalFunction','user',function(globalFunction,user) {
      return {
          require: "ngModel",
          restrict: "A",
          link: function(scope, elem, attrs, modelCtrl) {
              elem.bind("input propertychange",globalFunction.debounce(function(event) {
                  scope.$apply(function() {
                      if(user.hall.id == '1AE7283167B57D1DE050A8C098155859' || user.hall.id == '27115D48C5F726D6E050A8C098150716'){//
                          var num = modelCtrl.$modelValue.indexOf('.')
                          if( num == -1){
                              modelCtrl.$setViewValue(parseInt(modelCtrl.$modelValue));
                          }else {
                              modelCtrl.$setViewValue( modelCtrl.$modelValue.substring(num+2,0));
                          }
                          $(elem).val(modelCtrl.$modelValue);
                      }else{
                          modelCtrl.$setViewValue(parseInt(modelCtrl.$modelValue));
                          $(elem).val(modelCtrl.$modelValue);
                      }
                  });
              },50))
          }
      };
  }]);

}).call(this);
