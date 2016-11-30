/**
 * Created by Allen.zhang on 2014/8/21.
 */
(function() {
    'use strict';
    angular.module('app.system-set.ctrls',['app.system-set.services']).controller('commissionLimitCtrl',['$scope','commissionLimit','hallName','capitalTypes','tmsPagination','globalFunction','breadcrumb','pinCodeModal','topAlert',
        function($scope,commissionLimit,hallName,capitalTypes,tmsPagination,globalFunction,breadcrumb,pinCodeModal,topAlert){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"廳會佣金限制","active":true}
            ];
            //自定義變量
            $scope.halls = hallName.query({hall_type:"|1"});
            $scope.commission_limit_url = globalFunction.getApiUrl('systemsetting/commissionlimit');
            $scope.sub_post = "POST";
            $scope.disabled_update = false;
            capitalTypes.query({capital_type:1}).$promise.then(function(capitalTypes){
                $scope.capitalTypes =capitalTypes;
            });
            //定義存卡記錄變量
            var original_commission_limit;
            var init_commission_limit = {
                "hall_id":"",
                "commission_limit":"",
                "capital_type_id":"",
                "pin_code":""
            }
            original_commission_limit = angular.copy(init_commission_limit);
            $scope.commission_limit = angular.copy(init_commission_limit);

            //初始化數據
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = commissionLimit;
            $scope.select = function(page){
                $scope.commission_limits =$scope.pagination.select(page);
            }
            $scope.select();

            //增加存卡
            $scope.add = function(){
                if($scope.disabled_submit) { return ; }
                $scope.form_commission_limit_create.checkValidity().then(function(){
                    $scope.disabled_submit = true;
                    if($scope.commission_limit.id){
                        commissionLimit.update($scope.commission_limit,function(){
                            topAlert.success("修改成功！");
                            original_commission_limit = angular.copy(init_commission_limit);
                            $scope.commission_limit = angular.copy(init_commission_limit);
                            $scope.select();
                            $scope.sub_post = "POST";
                            $scope.disabled_submit = false;
                            $scope.disabled_update = false;
                        },function(){
                            $scope.disabled_submit = false;
                            $scope.disabled_update = true;
                        })
                    }else{
                        commissionLimit.save($scope.commission_limit,function(){
                            topAlert.success("添加成功！");
                            original_commission_limit = angular.copy(init_commission_limit);
                            $scope.commission_limit = angular.copy(init_commission_limit);
                            $scope.select();
                            $scope.disabled_submit = false;
                            $scope.disabled_update = false;
                        },function(){
                            $scope.disabled_submit = false;
                            $scope.disabled_update = false;
                        })
                    }
                })
            }
            //
            $scope.addCommissionLimit = function(){
                $scope.form_commission_limit_create.clearErrors();
                $scope.disabled_update = false;
                original_commission_limit = angular.copy(init_commission_limit);
                $scope.commission_limit = angular.copy(init_commission_limit);
            }
            //修改存卡
            $scope.update = function(id){
                commissionLimit.get({id:id}).$promise.then(function(commission_limit){
                    original_commission_limit = commission_limit;
                    $scope.sub_post = "PUT";
                    $scope.commission_limit = angular.copy(original_commission_limit);
                    $scope.disabled_update = true;
                })
            }
            //刪除沒有交易記錄的存卡
            $scope.delete = function(id){
                pinCodeModal(commissionLimit, 'delete', {id: id}, '刪除成功！').then(function () {
                    if($scope.commission_limit.id && id ==$scope.commission_limit.id){
                        $scope.addCommissionLimit();
                    }
                    $scope.select();
                })
            }
            //重置存卡數據
            $scope.reset = function(){
                $scope.form_commission_limit_create.clearErrors();
                if($scope.commission_limit.id){
                    $scope.disabled_update = true;
                    $scope.commission_limit = angular.copy(original_commission_limit);
                }else{
                    $scope.disabled_update = false;
                    $scope.commission_limit = angular.copy(original_commission_limit);
                }

            }
    }]).controller('commissionCurrencyCtrl',['$scope','commonCurrency','hallName','capitalTypes','tmsPagination','globalFunction','breadcrumb','pinCodeModal','topAlert',
        function($scope,commonCurrency,hallName,capitalTypes,tmsPagination,globalFunction,breadcrumb,pinCodeModal,topAlert){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"幣種管理","active":true}
            ];

            //這裡是匯率管理代碼塊
            $scope.commonCurrency = commonCurrency;
            //console.log($scope.commonCurrency);
            $scope.commission_currency_url = globalFunction.getApiUrl('common/commoncurrency');
            $scope.btn = "新增";//這個是按鈕的

            //自定義model
            var original_commission_Currency;
            var init_commission_Currency = {
                "currency":"",
                "remark":"",
                "pin_code":""
            }

            original_commission_Currency = angular.copy(init_commission_Currency);
            $scope.commission_Currency = angular.copy(init_commission_Currency);

            //初始化數據
            $scope.pagination = tmsPagination.create();//上一頁下一頁
            $scope.pagination.resource = commonCurrency;
            $scope.select = function(page){
                //關聯數據
                $scope.pagination.select(page,{userInfo:{}}).$promise.then(function(loans){
                    $scope.loans = loans;
                    //console.log(loans)
                });
            }
            $scope.select();
            //console.log($scope.commission_Currencys)
            $scope.addCommissionLimit = function(){
                $scope.form_commission_currency_create.clearErrors();
                $scope.disabled_update = false;
                original_commission_Currency = angular.copy(init_commission_Currency);
                $scope.commission_Currency = angular.copy(init_commission_Currency);
            }

            //新增
            $scope.add = function(){
                if(!$scope.commission_Currency.currency){
                    topAlert.warning("幣種不能為空");
                }else{
                    if($scope.disabled_submit) { return ; }
                    $scope.form_commission_currency_create.checkValidity().then(function(){
                        $scope.disabled_submit = true;
                        if($scope.commission_Currency.id){
                            //console.log($scope.commission_Currency);
                            commonCurrency.update($scope.commission_Currency,function(){
                                topAlert.success("修改成功！");
                                original_commission_Currency = angular.copy(original_commission_Currency);
                                $scope.commission_Currency = angular.copy(init_commission_Currency);
                                $scope.select();
                                $scope.sub_post = "POST";
                                $scope.disabled_submit = false;
                                $scope.disabled_update = false;
                            },function(){
                                $scope.disabled_submit = false;
                                $scope.disabled_update = true;
                            })
                        }else{
                            //console.log($scope.commission_Currency);
                            commonCurrency.save($scope.commission_Currency,function(){
                                topAlert.success("添加成功！");
                                original_commission_Currency = angular.copy(init_commission_Currency);
                                $scope.commission_Currency = angular.copy(init_commission_Currency);
                                $scope.select();
                                $scope.disabled_submit = false;
                                $scope.disabled_update = false;
                            },function(){
                                $scope.disabled_submit = false;
                                $scope.disabled_update = false;
                            })
                        }
                    })
                }
            }


            //重置
            $scope.reset = function(){
                $scope.form_commission_currency_create.clearErrors();
                //當是修改時重置
                if($scope.commission_Currency.id){
                    //$scope.commission_Currency = angular.copy(original_commission_Currency);
                    $scope.commission_Currency = '';
                }else{
                    //當是新增時重置
                    $scope.disabled_update = false;
                    $scope.commission_Currency = '';
                }
                $scope.btn = "新增";//這個是按鈕的
            }

            //修改
            $scope.update = function(id){
                $scope.btn = "保存";//這個是按鈕的
                commonCurrency.get({id:id}).$promise.then(function(commission_Currency){
                    console.log(commission_Currency);
                    original_commission_Currency = commission_Currency;
                    $scope.sub_post = "PUT";
                    $scope.commission_Currency = angular.copy(original_commission_Currency);
                    $scope.disabled_update = true;
                })
            }

            //刪除
            $scope.delete = function(id){
                pinCodeModal(commonCurrency, 'delete', {id: id}, '刪除成功！').then(function () {
                    $scope.select();
                })
            }

        }]).controller('userInfoCtrl',['$scope','usersInfo','departMent','hallName','tmsPagination','globalFunction','breadcrumb','pinCodeModal','$location','goBackData',
            function($scope,usersInfo,departMent,hallName,tmsPagination,globalFunction,breadcrumb,pinCodeModal,$location,goBackData){
                //麵包屑導航
                breadcrumb.items = [
                    {"name":"用戶列表","active":true}
                ];

                departMent.query().$promise.then(function(departMents){
                    $scope.departMents = departMents;
                });//部門
                $scope.users =[];
                //定義存卡記錄變量
                var original_user;
                var init_user = {
                    username: "",
                    name: "",
                    new_password: "",
                    new_pin_code: "",
                    user_no: "",
                    roles: "",
                    is_system : 0
                }
                original_user = angular.copy(init_user);
                $scope.condition = angular.copy(init_user);
                $scope.condition = goBackData.get('condition',$scope.condition);

                //初始化數據
                $scope.pagination = tmsPagination.create();
                $scope.pagination.resource = usersInfo;
                $scope.select = function(page){
                    var condition = angular.copy($scope.condition);
                    if($scope.condition.username){
                        condition.username = $scope.condition.username+"!";
                    }
                    if($scope.condition.name){
                        condition.name ="!"+ $scope.condition.name+"!";
                    }
                    if($scope.condition.user_no){
                        condition.user_no ="!"+ $scope.condition.user_no+"!";
                    }
                    goBackData.set('condition',condition);
                    $scope.pagination.select(page,condition,{allRoles : {}}).$promise.then(function(_users){
                        $scope.users = _users;
                    });
                }
                $scope.select();
                //重置存卡數據
                $scope.reset = function(){
                    $scope.condition = angular.copy(original_user);
                    $scope.select();
                }
                //新增用戶
                $scope.addUser = function(){
                    $location.path("/system-set/userinfo-create");
                }
                //用戶修改
                $scope.update = function(id){
                    goBackData.set('condition',$scope.condition);
                    $location.path("/system-set/userinfo-create/"+id);
                }
                //刪除用戶
                $scope.delete = function(id){
                    pinCodeModal(usersInfo, 'delete', {id: id}, '刪除成功！').then(function () {
                        $scope.select();
                    })
                }

    }]).controller('userInfoCreateCtrl',['$scope','$location','$stateParams','topAlert','tmsPagination','globalFunction','breadcrumb','usersInfo','pinCodeModal','departMent','authitem',
            function($scope,$location,$stateParams,topAlert,tmsPagination,globalFunction,breadcrumb,usersInfo,pinCodeModal,departMent,authitem){
                //麵包屑導航
                breadcrumb.items = [
                    {"name":"用戶列表","url":'system-set/userinfo-list'},
                    {"name":"新增用戶","active":true}
                ];

                $scope.sub_post = "POST";
                $scope.disabled_update = false;

                //部門
                departMent.query().$promise.then(function(departMents){
                    $scope.departMents = departMents;
                });

                //保存的值
                var init_record_create = {
                    "username":"",
                    "name":"",
                    "new_password":"",
                    "new_pin_code":"",
                    "user_no":"",
                    "department_id":"",
                    "roles":[],
                    "pin_code":""
                }

                $scope.get_user_select = function(){
                    usersInfo.get({id:$stateParams.id}).$promise.then(function(_usersInfo){
                        $scope.record_create = {
                            "id": _usersInfo.id,
                            "username": _usersInfo.username,
                            "name": _usersInfo.name,
                            "new_password": _usersInfo.new_password,
                            "new_pin_code": _usersInfo.new_pin_code,
                            "user_no": _usersInfo.user_no,
                            "department_id": _usersInfo.department_id,
                            "roles": _usersInfo.roles
                        };

                        //加載權限
                        authitem.query({type:1}).$promise.then(function(_authitems){
                            var team_names = _.pluck(_usersInfo.auth_assignments,"item_name");
                            _.each(_authitems,function(authitem){
                                if(_.indexOf(team_names,authitem.name)==-1){
                                    authitem.checked = false;
                                }else{
                                    authitem.checked = true;
                                }
                            });

                            $scope.authitem_content = [];
                            while (_authitems.length > 0) {
                                $scope.authitem_content.push(_authitems.splice(0, 5));
                            }
                        });
                    });
                }

                if($stateParams.id){
                    $scope.sub_post = "PUT";
                    $scope.get_user_select();

                }else{
                    $scope.sub_post = "POST";
                    //角色
                    authitem.query({type:1}).$promise.then(function(_authitem){
                        $scope.authitem = _authitem;
                        $scope.authitem_content = [];
                        while ($scope.authitem.length > 0) {
                            $scope.authitem_content.push($scope.authitem.splice(0, 5));
                        }
                    });

                    $scope.record_create = angular.copy(init_record_create);
                }

                //增加存卡
                $scope.authitem_create_url = globalFunction.getApiUrl('systemsetting/userinfo');
                $scope.submit = function(){
                    if($scope.disabled_submit) { return ; }
                    $scope.form_authitem_create.checkValidity().then(function(){

                        $scope.disabled_submit = true;
                        //角色權限
                        var authitem_flatten = _.flatten($scope.authitem_content,true);
                        var authitem_content = [];
                        _.each(authitem_flatten,function(_authitem){
                            if(_authitem.checked)
                                authitem_content.push(_authitem.name);
                        });
                        $scope.record_create.roles = authitem_content;
                        if($scope.record_create.id){
                            usersInfo.update($scope.record_create,function(){
                                topAlert.success("修改成功！");
                                $scope.record_create = angular.copy(init_record_create);
                                $scope.disabled_submit = false;
                                $scope.go_list();
                                $scope.sub_post = "POST";
                            },function(){
                                $scope.disabled_submit = false;
                            })
                        }else{
                            usersInfo.save($scope.record_create,function(){
                                topAlert.success("添加成功！");
                                $scope.record_create = angular.copy(init_record_create);
                                $scope.disabled_submit = false;
                                $scope.go_list();
                            },function(){
                                $scope.disabled_submit = false;
                            })
                        }
                    })
                }

                //全選去取消
                $scope.checked_all_flag = false;
                $scope.checked_all = function(){
                    //角色權限
                    var authitem_flatten = _.flatten($scope.authitem_content,true);
                    _.each(authitem_flatten,function(_authitem){
                        _authitem.checked = $scope.checked_all_flag;
                    });
                }

                //重置存卡數據
                $scope.reset = function(){
                    $scope.form_authitem_create.clearErrors();
                    if($scope.record_create.id){
                        $scope.disabled_submit = false;
                        $scope.get_user_select();
                    }else{
                        $scope.disabled_submit = false;
                        $scope.record_create = angular.copy(init_record_create);
                    }
                }

                $scope.go_list = function(){
                    $location.path("/system-set/userinfo-list");
                }

    }]).controller('smsNotificationCtrl',[
        '$scope','$modal','$log','getDate','$filter','$location','breadcrumb','smsContent','search','page',function($scope,$modal,$log,getDate,$filter,$location,breadcrumb,smsContent,search,page) {

            breadcrumb.items = [
                {"name":"短信通知事項","active":true}
            ];

    }]).controller('companyContactCreateCtrl',['$scope','compContact','areaCode','tmsPagination','globalFunction','breadcrumb','pinCodeModal','topAlert',
            function($scope,compContact,areaCode,tmsPagination,globalFunction,breadcrumb,pinCodeModal,topAlert){
                //麵包屑導航
                breadcrumb.items = [
                    {"name":"新增公司聯絡人","active":true}
                ];
                //自定義變量
               //$scope.halls = hallName.query({hall_type:"|1"});
                $scope.areaCodes  =areaCode.query();//地區
                $scope.comp_contact_url = globalFunction.getApiUrl('systemsetting/compcontact');
                $scope.sub_post = "POST";
//                areaCode.query().$promise.then(function(areacodes){
//                    $scope.areacodes = areacodes;
//                }); //地區

                $scope.disabled_update = false;
                //定義存卡記錄變量
                var original_comp_contact;
                var init_comp_contact_card = {
                    "comp_contact_name":"",
                    "remark":"",
                    "pin_code":"",
                    "compContactTels":[{
                                "notice_type":"",
                                "area_code_id":" ",
                                "telephone_number":""
                            }]
                }
                original_comp_contact = angular.copy(init_comp_contact_card);
                $scope.comp_contact = angular.copy(init_comp_contact_card);

                //初始化數據
                $scope.pagination = tmsPagination.create();
                $scope.pagination.resource = compContact;
                $scope.select = function(page){
                    $scope.comp_contacts =$scope.pagination.select(page);
                }
                $scope.select();
                //增加電話
                $scope.addTel = function(){
                    $scope.comp_contact.compContactTels.push({
                        "area_code_id":" ",
                        "telephone_number":""
                    })
                }
                $scope.removeTel = function(index){
                    $scope.comp_contact.compContactTels.splice(index,1);
                }
                //增加存卡
                $scope.add = function(){
                    $scope.comp_contact_c = angular.copy($scope.comp_contact);
                    for(var i = 0; i < $scope.comp_contact_c.compContactTels.length;i++){
                        if(!$scope.comp_contact_c.compContactTels[i].area_code_id && !$scope.comp_contact_c.compContactTels[i].telephone_number){
                            $scope.comp_contact_c.compContactTels.splice(i,1);
                            i = 0;
                        }
                    }
                    if(!angular.isUndefined($scope.comp_contact_c.compContactTels[0])){
                        if(!$scope.comp_contact_c.compContactTels[0].area_code_id && !$scope.comp_contact_c.compContactTels[0].telephone_number){
                            $scope.comp_contact_c.compContactTels = [];
                        }
                    }
                    if($scope.disabled_submit) { return ; }
                    $scope.form_com_contact_create.checkValidity().then(function(){
                        $scope.disabled_submit = true;
                        if($scope.comp_contact.id){
                            compContact.update($scope.comp_contact_c,function(){
                                topAlert.success("修改成功！");
                                $scope.comp_contact = angular.copy(original_comp_contact);
                                $scope.select();
                                $scope.sub_post = "POST";
                                $scope.disabled_submit = false;
                                $scope.disabled_update = false;
                            },function(){
                                $scope.disabled_submit = false;
                                $scope.disabled_update = true;
                            })
                        }else{
                            compContact.save($scope.comp_contact_c,function(){
                                topAlert.success("添加成功！");
                                $scope.comp_contact = angular.copy(original_comp_contact);
                                $scope.select();
                                $scope.disabled_submit = false;
                                $scope.disabled_update = false;
                            },function(){
                                $scope.disabled_submit = false;
                                $scope.disabled_update = false;
                            })
                        }
                    })
                }
                //
                $scope.addContact = function(){
                    $scope.form_com_contact_create.clearErrors();
                    $scope.disabled_update = false;
                    $scope.comp_contact = angular.copy(original_comp_contact);
                }
                //修改存卡
                $scope.update = function(id){
                    compContact.get(globalFunction.generateUrlParams({id:id},{phoneNumbers:{}})).$promise.then(function(comp_contact){
                        $scope.comp_contact = comp_contact;
                        $scope.sub_post = "PUT";
                        $scope.comp_contact.compContactTels = [];
                        if(comp_contact.phoneNumbers.length > 0){
                            $scope.comp_contact.compContactTels =angular.copy(comp_contact.phoneNumbers);
                        }
                        $scope.comp_contact_reset = angular.copy($scope.comp_contact);
                        $scope.disabled_update = true;
                    })
                }
                //刪除沒有交易記錄的存卡
                $scope.delete = function(id){
                    pinCodeModal(compContact, 'delete', {id: id}, '刪除成功！').then(function () {
                        if($scope.comp_contact.id && id ==$scope.comp_contact.id){
                            $scope.addContact();
                        }
                        $scope.select();
                    })
                }
                //重置存卡數據
                $scope.reset = function(){
                    $scope.form_com_contact_create.clearErrors();
                    if($scope.comp_contact.id){
                        $scope.disabled_update = true;
                        $scope.comp_contact = angular.copy($scope.comp_contact_reset);
                    }else{
                        $scope.disabled_update = false;
                        $scope.comp_contact = angular.copy(original_comp_contact);
                    }

                }
    }]).controller('userPasswordCtrl',['$scope','$location','$stateParams','topAlert','tmsPagination','globalFunction','breadcrumb','usersInfo','pinCodeModal','departMent',
            function($scope,$location,$stateParams,topAlert,tmsPagination,globalFunction,breadcrumb,usersInfo,pinCodeModal,departMent){
                //麵包屑導航
                breadcrumb.items = [
                    {"name":"個人修改密碼","active":true}
                ];

                $scope.sub_post = "PUT";
                $scope.disabled_update = false;
                $scope.authitem_create_url = globalFunction.getApiUrl('systemsetting/userinfo/update-password');
                //部門
                departMent.query().$promise.then(function(departMents){
                    $scope.departMents = departMents;
                });

                //保存的值
                var original_password;
                var init_record_create = {
                    "username":"",
                    "name":"",
                    "user_no":"",
                    "department_id":"",
                    "old_password":"",
                    "new_password":"",
                    "old_pin_code":"",
                    "new_pin_code":"",
                    "pin_code" : ""
                }
                original_password = angular.copy(init_record_create);
                $scope.password_create = angular.copy(init_record_create);

                $scope.add = function(){
                    if($scope.disabled_update) { return ; }
                    $scope.disabled_update = true;
                    $scope.form_authitem_create.checkValidity().then(function(){
                        usersInfo.updatePassword( $scope.password_create,function(){
                            topAlert.success('修改密碼成功。');
                            $scope.disabled_update = false;
                            $scope.reset();
                        },function(){
                            $scope.disabled_update = false;
                        })
                    })
                }
                //重置存卡數據
                $scope.reset = function(){
                    $scope.form_authitem_create.clearErrors();
                    $scope.password_create = angular.copy(original_password);
                }

    }]).controller('workstationCtrl',['$scope','workstation','hallName','tmsPagination','globalFunction','breadcrumb','pinCodeModal','topAlert',
        function($scope,workstation,hallName,tmsPagination,globalFunction,breadcrumb,pinCodeModal,topAlert){
                //麵包屑導航
                breadcrumb.items = [
                    {"name":"操作機器","active":true}
                ];
                //自定義變量
                $scope.halls = hallName.query({/*hall_type:"|1"*/ sort:'hall_type asc'});
                $scope.workstation_url = globalFunction.getApiUrl('systemsetting/workstation');
                $scope.sub_post = "POST";
                $scope.disabled_update = false;
                //定義存卡記錄變量
                var original_workstation;
                var init_workstation = {
                    "hall_id":"",
                    "pc_name":"",
                    "mac":"",
                    "landline_id":"",
                    "pin_code":""
                }
                original_workstation = angular.copy(init_workstation);
                $scope.workstation = angular.copy(init_workstation);

                $scope.condition = {
                    is_system:0,
                    mac:""
                }
                //初始化數據
                $scope.pagination = tmsPagination.create();
                $scope.pagination.resource = workstation;
                $scope.select = function(page){
                    $scope.workstations =$scope.pagination.select(page,$scope.condition);
                }
                $scope.select();
                $scope.search = function(){
                    $scope.select();
                }
                //增加存卡
                $scope.add = function(){
                    if($scope.disabled_submit) { return ; }
                    $scope.form_workstation_create.checkValidity().then(function(){
                        $scope.disabled_submit = true;
                        if($scope.workstation.id){
                            $scope.sub_post = "PUT";
                            workstation.update($scope.workstation,function(){
                                topAlert.success("修改成功！");
                                original_workstation = angular.copy(init_workstation);
                                $scope.workstation = angular.copy(init_workstation);
                                $scope.select();

                                $scope.disabled_submit = false;
                            },function(){
                                $scope.disabled_submit = false;
                            })
                        }else{
                            $scope.sub_post = "POST";
                            workstation.save($scope.workstation,function(){
                                topAlert.success("添加成功！");
                                $scope.workstation = angular.copy(original_workstation);
                                $scope.form_workstation_create.clearErrors();
                                $scope.select();
                                $scope.disabled_submit = false;
                            },function(){
                                $scope.disabled_submit = false;
                            })
                        }
                    })
                }
                //
                $scope.addWorkstation = function(){
                    $scope.form_workstation_create.clearErrors();
                    $scope.sub_post = "POST";
                    original_workstation = angular.copy(init_workstation);
                    $scope.workstation = angular.copy(init_workstation);
                }
                $scope.update = function(workstation)
                {
                    _.extend_exist(original_workstation, workstation);
                    original_workstation.id = workstation.id;
                    $scope.workstation = angular.copy(original_workstation);
                }

                //刪除沒有交易記錄的存卡
                $scope.delete = function(id){
                    pinCodeModal(workstation, 'delete', {id: id}, '刪除成功！').then(function () {
                        if($scope.workstation.id && id ==$scope.workstation.id){
                            $scope.addWorkstation();
                        }
                        $scope.select();
                    })
                }
                //重置存卡數據
                $scope.reset = function(){
                    $scope.form_workstation_create.clearErrors();
                    if($scope.workstation.id){
                        $scope.workstation = angular.copy(original_workstation);
                    }else{
                        $scope.workstation = angular.copy(init_workstation);
                    }
                }

            //Allen.zhang 佣金份數
        }])

        //打印机设置
        .controller('printersetCtrl',['$scope',"workstation",'hallName','tmsPagination','globalFunction','breadcrumb','pinCodeModal','topAlert','qzPrinter','currentMachine',
            function($scope,workstation,hallName,tmsPagination,globalFunction,breadcrumb,pinCodeModal,topAlert,qzPrinter,currentMachine){

                //麵包屑導航
                breadcrumb.items = [
                    {"name":"打印機設置","active":true}
                ];


               //获取打印机列表
                qzPrinter.findPrinters().then(function(printers){
                    $scope.printers_list=printers;
                });


                //自定義變量
                $scope.halls = hallName.query({/*hall_type:"|1"*/ sort:'hall_type asc'});
                $scope.printerset_url = globalFunction.getApiUrl('systemsetting/workstation/update-printer');
                $scope.sub_post = "POST";
                $scope.disabled_update = false;
                $scope.modify_show=true;
                $scope.add_show=false;

                //定義存卡記錄變量
                var original_printerset;
                var init_printerset = {
                    "id":"",
                    "stylus_printer":"",
                    "thermal_printer":"",
                    "laser_printer":"",
                    "pin_code":""
                }
                original_printerset = angular.copy(init_printerset);
                $scope.printerset = angular.copy(init_printerset);

                //获取操作机器 MAC地址 打印机列表
                function getData()
                {
                    var machine = JSON.parse(sessionStorage.getItem("machine"))
                    if(machine)
                    {
                        $scope.printerset_mac=machine.mac
                        $scope.printerset_pc_name=machine.pc_name
                        $scope.printerset.id=machine.id
                        $scope.printerset.stylus_printer=machine.stylus_printer
                        $scope.printerset.thermal_printer=machine.thermal_printer
                        $scope.printerset.laser_printer=machine.laser_printer
                    }
                }
                getData()

                //修改界面
                $scope.modify=function()
                {
                    $scope.add_show=true;
                    $scope.modify_show=false;
                }

                //增加存卡
                $scope.add = function(){
                    if($scope.disabled_submit) { return ; }
                    $scope.form_printerset_create.checkValidity().then(function(){
                        $scope.disabled_submit = true;
                        if($scope.printerset.id){
                            $scope.sub_post = "PUT";
                            workstation.updatePrinter($scope.printerset,function(){
                                topAlert.success("修改成功！");
                                $scope.add_show=false;
                                $scope.modify_show=true;
                                currentMachine.setField("stylus_printer", $scope.printerset.stylus_printer)
                                currentMachine.setField("thermal_printer", $scope.printerset.thermal_printer)
                                currentMachine.setField("laser_printer", $scope.printerset.laser_printer)
                                original_printerset = angular.copy(init_printerset);
                                $scope.printerset = angular.copy(init_printerset);
                                getData()
                                $scope.disabled_submit = false;
                            },function(){
                                $scope.disabled_submit = false;
                            })
                        }else{
                            $scope.sub_post = "POST";
                            workstation.updatePrinter($scope.printerset,function(){
                                topAlert.success("添加成功！");
                                $scope.printerset = angular.copy(original_printerset);
                                $scope.form_printerset_create.clearErrors();
                                $scope.disabled_submit = false;
                            },function(){
                                $scope.disabled_submit = false;
                            })
                        }
                    })
                }
                //重置數據
                $scope.reset = function(){
                    var machine = JSON.parse(sessionStorage.getItem("machine"))
                    $scope.form_printerset_create.clearErrors();
                    if($scope.printerset.id){
                        $scope.printerset = angular.copy(original_printerset);
                        $scope.printerset.id=machine.id
                    }else{
                        $scope.printerset = angular.copy(init_printerset);
                        $scope.printerset.id=machine.id
                    }
                }
            }])

        .controller('CommissionFractionCtrl',['$scope','$modal','$log','getDate','$location','breadcrumb','topAlert','globalFunction','tmsPagination','hallName','commissionDivide','pinCodeModal',
            function($scope,$modal,$log,getDate,$location,breadcrumb,topAlert,globalFunction,tmsPagination,hallName,commissionDivide,pinCodeModal) {

                breadcrumb.items = [
                    {"name":"佣金份數","active":true}
                ];
                $scope.sub_post = "POST";
                $scope.disabled_update = false;

                $scope.halls = hallName.query({hall_type:"|1"});

                var init_record = {
                    hall_id: "",
                    commission_total: "",
                    integral_total: "",
                    pin_code: ""
                }
                $scope.record = angular.copy(init_record);
                $scope.commissionDivides = [];

                $scope.pagination = tmsPagination.create();
                $scope.pagination.resource = commissionDivide;
                $scope.select = function(page){
                    $scope.pagination.select(page).$promise.then(function(_commissionDivides){
                        $scope.commissionDivides = _commissionDivides;
                    });
                }
                $scope.select();

                //修改存卡
                $scope.update = function(id){
                    commissionDivide.get({id:id}).$promise.then(function(_record){
                        $scope.record = _record;
                        $scope.sub_post = "PUT";
                        $scope.recod_reset = angular.copy(_record);
                        $scope.disabled_update = true;
                    })
                }
                //刪除沒有交易記錄的存卡
                $scope.delete = function(id){
                    pinCodeModal(commissionDivide, 'delete', {id: id}, '刪除成功！').then(function () {
                        if($scope.record.id && id == $scope.record.id){
                            $scope.add_fraction();
                        }
                        $scope.select();
                    })
                }

                $scope.commission_fraction_url = globalFunction.getApiUrl("systemsetting/commissiondivide");
                $scope.submit = function(){
                    if($scope.disabled_submit) { return ; }
                    $scope.form_commission_fraction.checkValidity().then(function(){
                        $scope.disabled_submit = true;
                        if($scope.record.id){
                            $scope.record_copy = {
                                id: $scope.record.id,
                                hall_id: $scope.record.hall_id,
                                commission_total: $scope.record.commission_total,
                                integral_total: $scope.record.integral_total,
                                pin_code: $scope.record.pin_code
                            }
                            commissionDivide.update($scope.record_copy,function(){
                                topAlert.success("修改成功！");
                                $scope.record = angular.copy(init_record);
                                $scope.select();
                                $scope.sub_post = "POST";
                                $scope.disabled_submit = false;
                            },function(){
                                $scope.disabled_submit = false;
                            })
                        }else{
                            commissionDivide.save($scope.record,function(){
                                topAlert.success("添加成功！");
                                $scope.record = angular.copy(init_record);
                                $scope.select();
                                $scope.disabled_submit = false;
                            },function(){
                                $scope.disabled_submit = false;
                            })
                        }
                    });
                }

                //切換新增狀態
                $scope.add_fraction = function(){
                    $scope.disabled_update = false;
                    $scope.record = angular.copy(init_record);
                    $scope.form_commission_fraction.clearErrors();
                }

                $scope.reset = function(){
                    if($scope.record.id){
                        $scope.disabled_update = true;
                        $scope.record = angular.copy($scope.recod_reset);
                    }else{
                        $scope.disabled_update = false;
                        $scope.record = angular.copy(init_record);
                    }
                    $scope.form_commission_fraction.clearErrors();
                }

        }]).controller('commissionSharingCtrl',['$scope','commissionType','breadcrumb','globalFunction','tmsPagination','hallName','commissionDivide','capitalTypes','topAlert','$modal','$log',
            function($scope,commissionType,breadcrumb,globalFunction,tmsPagination,hallName,commissionDivide,capitalTypes,topAlert,$modal,$log){
                //面包屑导航
                breadcrumb.items = [
                    {"name":"佣金分成默認","active":true}
                ];

                $scope.commissionTypes = commissionType.items;
                $scope.commissiondivide_updates = {};
                $scope.num =0;
                $scope.userType = ['户口','上線一','上線二','上線三','上線四','上線五','上線六','上線七','上線八','上線九'];
                $scope.capitaltypes = capitalTypes.query({"capital_type":1});//碼佣規則-本金類型
                //建立model
                var original;
                var init_commissiondivide={
                    "pin_code":"",
                    "commission_total": "",
                    "integral_total": "",
                    "letter_mark": "",
                    "commissionDivideSubs": [
                        {
                            "commission_divide_id": "",
                            "layer": "0",
                            "commission_should": "",
                            "integral_should": ""
                        },
                        {
                            "commission_divide_id": "",
                            "layer": "1",
                            "commission_should": "",
                            "integral_should": ""
                        },
                        {
                            "commission_divide_id": "",
                            "layer": "2",
                            "commission_should": "",
                            "integral_should": ""
                        }
                    ],
                    "commissionDivideHalls":[
                        {
                            "commission_total": "",
                            "integral_total": "",
                            "letter_mark": "",
                            "capital_type_id":"",
                            "commission_type":"",
                            "commissionDivideHallSubs":[
                                {
                                    "layer":"0",
                                    "commission_should":"",
                                    "integral_should":""

                                }
                            ]
                        }
                    ]
                }
                original = angular.copy(init_commissiondivide);
                $scope.commissiondivide = angular.copy(init_commissiondivide);

                //初始化規則列表數據
                $scope.pagination_setting = tmsPagination.create();
                $scope.pagination_setting.items_per_page = 15;
                $scope.pagination_setting.max_size = 6;
                $scope.pagination_setting.resource = commissionDivide;
                $scope.select = function(page){
                    $scope.commissions_divides = $scope.pagination_setting.select(page);
                }
                $scope.select();

                //刪除用戶類型
                $scope.addCommissiondivide = function(index) {
                    $scope.commissiondivide.commissionDivideSubs.push({
                        "commission_divide_id": "",
                        "layer": ($scope.commissiondivide.commissionDivideSubs.length-1),
                        "commission_should": "",
                        "integral_should": ""
                    });
                }
                //刪除特別收益戶口
                $scope.removeCommissiondivide = function(index){
                    $scope.commissiondivide.commissionDivideSubs.splice(index,1);
                }

                //佣金总额计算
                $scope.commission_total = function(){
                    $scope.c_total = 0;
                    for(var j = 0;j < $scope.commissiondivide.commissionDivideSubs.length;j++){
                        if($scope.commissiondivide.commissionDivideSubs[j].commission_should){
                            $scope.c_total += parseInt($scope.commissiondivide.commissionDivideSubs[j].commission_should);
                        }
                    }
                    $scope.commissiondivide.commission_total = $scope.c_total;
                    return parseInt($scope.c_total);
                }
                //積分
                $scope.integral_total = function(){
                    $scope.i_total = 0;
                    for(var j = 0;j < $scope.commissiondivide.commissionDivideSubs.length;j++){
                        if($scope.commissiondivide.commissionDivideSubs[j].integral_should){
                            $scope.i_total += parseInt($scope.commissiondivide.commissionDivideSubs[j].integral_should);
                        }
                    }
                    $scope.commissiondivide.integral_total = parseInt($scope.i_total);
                    return parseInt($scope.i_total);
                }
                //廳館排列
                $scope.hall_checked_layout = function(){
                    $scope.halls = [];
                    $scope.all_halls = [];
                    hallName.query({hall_type:"|1",sort:"hall_type"}).$promise.then(function(_halls) {
                        $scope.all_halls = _.filter(_halls,function(hall){return hall.id !='27115D48C5F726D6E050A8C098150716'});
                        for (var i = 0; i < Math.ceil($scope.all_halls.length / 2); i++) {
                            $scope.halls.push($scope.all_halls.slice(i * 2, 2 * (i + 1)))
                        }
                    });
                }
                $scope.hall_checked_layout();
                //全選廳館
                $scope.hall_ids = [];
                //$scope.hall_check_alls=["hall_check_all1","hall_check_all2"];//定義全選變量
                $scope.hall_check_alls={"hall_check_all1":"","hall_check_all2":""};
                $scope.hall_check_all1 = function(){
                    if($scope.hall_check_alls.hall_check_all1){
                        _.each($scope.halls,function(hall){
                            hall[0].selected = true;
                        });
                    }else{
                        _.each($scope.halls,function(hall){
                            hall[0].selected = false;
                        });
                    }
                }
                $scope.hall_check_all2 = function(){
                    if($scope.hall_check_alls.hall_check_all2){
                        _.each($scope.halls,function(hall){
                            if(hall.length == 2){
                                hall[1].selected = true;
                            }
                        });
                    }else{
                        _.each($scope.halls,function(hall){
                            if(hall.length == 2) {
                                hall[1].selected = false;
                            }
                        });
                    }
                }
                //绑定厅馆
                $scope.commissions_old = [];
                $scope.hall_old_ids =[];
                $scope.hall_ids = [];
                $scope.disabled_bind = false;
                $scope.bindCommissionDivide = function() {
                    if($scope.disabled_bind){
                        return $scope.disabled_bind;
                    }
                    if($scope.commissiondivide.commissionDivideSubs[0].commission_should <= 0 ){
                        topAlert.warning("戶口分派佣金額不能小於 0");
                        return;
                    }
                    $scope.disabled_bind  = true;
                    $scope.form_commission_divide.checkPreValidity('POST', 'systemsetting/commissiondivide/create-validate', commissionDivide.createValidate, {"commissionDivideSubs": $scope.commissiondivide.commissionDivideSubs}).then(function () {
                        $scope.form_commission_divide.clearErrors();
                        $scope.bindCommissions();
                        $scope.disabled_bind  = false;
                    },function(){
                        $scope.disabled_bind  = false;
                    });
                }
                $scope.bindCommissions = function(){
                    //獲取選中的hall_id;
                    $scope.hall_ids =[];
                    _.each($scope.halls,function(hall){
                        _.each(hall,function(h){
                            if(h.selected == true) {
                                $scope.hall_ids.push(h.id);
                            }
                        })
                    });
                    $scope.commissiondivide.commissiondivide_one = [];
                    if(!$scope.commissiondivide.commissionDivideHalls){
                        $scope.commissiondivide.commissionDivideHalls = [];
                    }
                    $scope.commissiondivide.commissiondivide_one = angular.copy($scope.commissiondivide.commissionDivideHalls);
                    $scope.commission_divide_halls = _.pluck($scope.commissiondivide.commissiondivide_one,"hall_id");
                    if($scope.hall_ids.length > 0){
                        if($scope.commissiondivide.id){
                            if($scope.commission_divide_halls.length == $scope.hall_ids.length){
                                angular.forEach($scope.hall_ids,function(hall_id,index){
                                    if($scope.commission_divide_halls.indexOf(hall_id) >= 0){
                                        $scope.sub = $scope.commission_divide_halls.indexOf(hall_id);
                                        $scope.commissiondivide.commissionDivideHalls[$scope.sub].commission_total=$scope.commissiondivide.commission_total;
                                        $scope.commissiondivide.commissionDivideHalls[$scope.sub].integral_total=$scope.commissiondivide.integral_total;
                                        $scope.commissiondivide.commissionDivideHalls[$scope.sub].letter_mark= $scope.commissiondivide.letter_mark;
                                        $scope.commissiondivide.commissionDivideHalls[$scope.sub].commissionDivideHallSubs = [];
                                        _.each($scope.commissiondivide.commissionDivideSubs,function(commissionDivideSub,index){
                                            $scope.commissiondivide.commissionDivideHalls[$scope.sub].commissionDivideHallSubs.push({
                                                "layer":commissionDivideSub.layer,
                                                "commission_should":commissionDivideSub.commission_should,
                                                "integral_should":commissionDivideSub.integral_should
                                            })
                                        })
                                    }
                                })
                            }else{
                                angular.forEach($scope.hall_ids,function(hall_id,index){
                                    if($scope.commission_divide_halls.indexOf(hall_id) < 0){
                                        $scope.commissiondivide.commissionDivideHalls.push({
                                            "hall_id":hall_id,
                                            "commission_total":$scope.commissiondivide.commission_total,
                                            "integral_total":$scope.commissiondivide.integral_total,
                                            "letter_mark":$scope.commissiondivide.letter_mark,
                                            "capital_type_id":$scope.commissiondivide.capital_type_id,
                                            "commission_type":$scope.commissiondivide.commission_type,
                                            "commissionDivideHallSubs":[]
                                        });

                                        $scope.commission_divide_halls1 = _.pluck($scope.commissiondivide.commissionDivideHalls,"hall_id");
                                        $scope.num = $scope.commission_divide_halls1.indexOf(hall_id);
                                        _.each($scope.commissiondivide.commissionDivideSubs,function(commissionDivideSub,index){
                                            $scope.commissiondivide.commissionDivideHalls[$scope.num].commissionDivideHallSubs.push({
                                                "layer":commissionDivideSub.layer,
                                                "commission_should":commissionDivideSub.commission_should,
                                                "integral_should":commissionDivideSub.integral_should
                                            })
                                        })
                                    }
                                })
                            }

                        }
                    }else{
                        topAlert.warning("請選擇廳會!");
                    }
                    $scope.commissiondivide_old ={};
                    $scope.hall_old_ids =[];
                    $scope.commissiondivide_old = angular.copy($scope.commissiondivide);
                    if($scope.commissiondivide.id){
                        angular.forEach($scope.hall_ids,function(hall_id){
                            $scope.hall_old_ids.push(hall_id);
                        });
                    }else{
                        if($scope.commissiondivide_old.commissionDivideHalls.length > 0){
                            $scope.hall_old_ids = _.pluck($scope.commissiondivide_old.commissionDivideHalls,"hall_id");
                        }
                    }
                }
                //綁定重置
                $scope.resetCommission = function(){
                    if($scope.commissiondivide.id){
                        if($scope.commissiondivide.commissionDivideHalls.length == $scope.halls.length){
                            $scope.hall_check_alls.hall_check_all1 = true;
                            $scope.hall_check_alls.hall_check_all2= true;
                        }else{
                            $scope.hall_check_alls.hall_check_all1 = false;
                            $scope.hall_check_alls.hall_check_all2= false;
                        }
                        $scope.commissiondivide.commissionDivideHalls = angular.copy($scope.commissiondivide_updates.commissionDivideHalls);
                        $scope.hall_check_all1();
                        $scope.hall_check_all2();
                        $scope.hall_ids = [];
                        $scope.commissions_old =[];
                        $scope.hall_old_ids =[];
                        $scope.form_commission_divide.clearErrors();
                    }
                }

                $scope.showCommission = function(hall_name,hall_id){
//                if($scope.hall_old_ids.indexOf(hall_id) >= 0){
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/system-set/commission-sharing-detail.html",
                        controller: 'commissionSharingDetailCtrl',
                        windowClass:'xlg-modal',
                        resolve: {
                            hall_name:function(){
                                return hall_name;
                            },
                            hall_id: function () {
                                return hall_id;
                            },
                            commissiondivide:function(){
                                return $scope.commissiondivide;
                            }
                        }
                    });
                    modalInstance.result.then((function(commissiondivide_detail) {
                        if(commissiondivide_detail){
                            if($scope.hall_ids.indexOf(commissiondivide_detail.hall_id) < 0 && $scope.all_halls.length != $scope.commissiondivide.commissionDivideHalls.length){
                                $scope.hall_ids.push(commissiondivide_detail.hall_id);
                                $scope.hall_old_ids.push(commissiondivide_detail.hall_id);
                                $scope.commissiondivide.commissionDivideHalls.push({
                                    "hall_id":hall_id,
                                    "commission_total":commissiondivide_detail.commission_total,
                                    "integral_total":commissiondivide_detail.integral_total,
                                    "letter_mark":commissiondivide_detail.letter_mark,
                                    "capital_type_id":commissiondivide_detail.capital_type_id,
                                    "commission_type":commissiondivide_detail.commission_type,
                                    commissionDivideHallSubs:angular.copy(commissiondivide_detail.commissionDivideHallSubs)
                                });
                            }else{
                                angular.forEach($scope.commissiondivide.commissionDivideHalls,function(commissionDivideHall){
                                    if(commissiondivide_detail.hall_id && commissionDivideHall.hall_id == commissiondivide_detail.hall_id){
                                        $scope.hall_old_ids.push(commissiondivide_detail.hall_id);
                                        commissionDivideHall.commission_total=commissiondivide_detail.commission_total;
                                        commissionDivideHall.integral_total=commissiondivide_detail.integral_total;
                                        commissionDivideHall.letter_mark=commissiondivide_detail.letter_mark;
                                        commissionDivideHall.commissionDivideHallSubs = [];
                                        commissionDivideHall.commissionDivideHallSubs = angular.copy(commissiondivide_detail.commissionDivideHallSubs);
                                    }
                                });
                            }
                        }
                    }), function() {
                        $log.info("Modal dismissed at: " + new Date());
                    });
//                }
                }
                //重置
                $scope.reset = function(){
                    if($scope.commissiondivide.id){
                        $scope.sub_post= 'PUT';
                        $scope.update_diable = true;
                        $scope.hall_check_alls.hall_check_all1 = false;
                        $scope.hall_check_alls.hall_check_all2= false;
                        $scope.hall_check_all1();
                        $scope.hall_check_all2();
                        $scope.commissiondivide = angular.copy(original);
                        $scope.hall_ids = [];
                        $scope.commissions_old =[];
                        $scope.hall_old_ids =[];
                        $scope.form_commission_divide.clearErrors();
                    }
                }
                $scope.reset_commissiondivide = function(){
                    $scope.commissiondivide = angular.copy($scope.commissiondivide_updates);
                }
                //提交
                $scope.disabled_submit = false;
                $scope.add = function() {
                    if($scope.disabled_submit){
                        return $scope.disabled_submit;
                    }
                    if($scope.all_halls.length != $scope.commissiondivide.commissionDivideHalls.length){
                        topAlert.warning("還有廳館沒有設置！");
                        return;
                    }
                    for(var i = 0; i < $scope.commissiondivide.commissionDivideSubs.length;i++){
                        if(($scope.commissiondivide.commissionDivideSubs[i].commission_should == '' || $scope.commissiondivide.commissionDivideSubs[i].commission_should == null) && ($scope.commissiondivide.commissionDivideSubs[i].integral_should == '' || $scope.commissiondivide.commissionDivideSubs[i].integral_should == null)){
                            $scope.commissiondivide.commissionDivideSubs.splice(i,1);
                            i=0;
                        }
                    }
                    if(!angular.isUndefined($scope.commissiondivide.commissionDivideSubs[0])){
                        if(($scope.commissiondivide.commissionDivideSubs[0].commission_should == '' || $scope.commissiondivide.commissionDivideSubs[0].commission_should == null) && ($scope.commissiondivide.commissionDivideSubs[0].integral_should == '' || $scope.commissiondivide.commissionDivideSubs[0].integral_should == null)){
                            $scope.commissiondivide.commissionDivideSubs = [];
                        }
                    }

                    angular.forEach($scope.commissiondivide.commissionDivideHalls,function(commissionDivideHall){
                        for(var i = 0; i < commissionDivideHall.commissionDivideHallSubs.length;i++){
                            if((commissionDivideHall.commissionDivideHallSubs[i].commission_should == '' || commissionDivideHall.commissionDivideHallSubs[i].commission_should == null) && (commissionDivideHall.commissionDivideHallSubs[i].integral_should == '' || commissionDivideHall.commissionDivideHallSubs[i].integral_should == null)){
                                commissionDivideHall.commissionDivideHallSubs.splice(i,1);
                                i=0;
                            }
                        }
                        if(!angular.isUndefined(commissionDivideHall.commissionDivideHallSubs[0])){
                            if((commissionDivideHall.commissionDivideHallSubs[0].commission_should == '' || commissionDivideHall.commissionDivideHallSubs[0].commission_should == null) && (commissionDivideHall.commissionDivideHallSubs[0].integral_should == '' || commissionDivideHall.commissionDivideHallSubs[0].integral_should == null)){
                                commissionDivideHall.commissionDivideHallSubs = [];
                            }
                        }
                    });

                    if($scope.commissiondivide.id){
                        if($scope.form_commission_divide.checkValidity()) {
                            $scope.disabled_submit = true;
                            commissionDivide.update($scope.commissiondivide,function(){
                                topAlert.success("修改成功");
                                $scope.select();
                                $scope.reset();
                                $scope.disabled_submit = false;
                            },function(){
                                $scope.disabled_submit = false;
                                if($scope.commissiondivide.commissionDivideSubs.length == 0){
                                    $scope.commissiondivide.commissionDivideSubs.push({
                                        "id": "",
                                        "commission_divide_id": "",
                                        "layer": ($scope.commissiondivide.commissionDivideSubs.length-1),
                                        "commission_should": "",
                                        "integral_should": ""
                                    });
                                }
                            });
                        }
                    }
                }
                //修改方法
                $scope.update = function(id){
                    $scope.sub_post = 'PUT';
                    $scope.update_diable = true;
                    commissionDivide.get(globalFunction.generateUrlParams({id:id},{commissionDivideSubs:{},commissionDivideHalls:{commissionDivideHallSubs:""}})).$promise.then(function(commissiondivide){
                        $scope.commissiondivide = commissiondivide;//
                        $scope.commissiondivide_updates = angular.copy(commissiondivide);
                        if($scope.commissiondivide_updates.commissionDivideHalls.length == $scope.halls.length*2){
                            $scope.hall_check_alls.hall_check_all1 = true;
                            $scope.hall_check_alls.hall_check_all2= true;
                            $scope.hall_check_all1();
                            $scope.hall_check_all2();
                        }
                        if($scope.commissiondivide.commissionDivideSubs && !$scope.commissiondivide.commissionDivideSubs.length){
                            $scope.commissiondivide.commissionDivideSubs =original. commissionDivideSubs;
                        }
                    });
                }
                //
        }]).controller('commissionSharingDetailCtrl',['$scope','commissionDivide','globalFunction','$modalInstance','hall_name','hall_id','commissiondivide','topAlert','commissionType',
            function($scope,commissionDivide,globalFunction,$modalInstance,hall_name,hall_id,commissiondivide,topAlert,commissionType){

                $scope.sub_post= 'POST';
                $scope.halls= [];
                $scope.commissions_rule_url = globalFunction.getApiUrl('systemsetting/commissiondivide');
                $scope.num = 0;
                $scope.userType = ['户口','上線一','上線二','上線三','上線四','上線五','上線六','上線七','上線八','上線九'];
                $scope.hall_name = hall_name;
                $scope.commissiondivide = commissiondivide;
                $scope.commissionTypes = commissionType.items;
                $scope.commissiondivide_detail = {
                    "hall_id":hall_id,
                    "commission_total": "",
                    "integral_total": "",
                    "letter_mark":commissiondivide.letter_mark,
                    "capital_type_id":commissiondivide.capital_type_id,
                    "commission_type":commissiondivide.commission_type,
                    "commissionDivideHallSubs":[{
                        "layer":"0",
                        "commission_should":"",
                        "integral_should":""

                    },{
                        "layer":"1",
                        "commission_should":"",
                        "integral_should":""

                    },{
                        "layer":"2",
                        "commission_should":"",
                        "integral_should":""

                    }]
                };
                $scope.commissiondivide_update = {
                    "hall_id":hall_id,
                    "commission_total": "",
                    "integral_total": "",
                    "letter_mark": commissiondivide.letter_mark,
                    "capital_type_id":commissiondivide.capital_type_id,
                    "commission_type":commissiondivide.commission_type,
                    "commissionDivideHallSubs":[{
                        "layer":"0",
                        "commission_should":"",
                        "integral_should":""

                    },{
                        "layer":"1",
                        "commission_should":"",
                        "integral_should":""

                    },{
                        "layer":"2",
                        "commission_should":"",
                        "integral_should":""

                    }]
                };
                angular.forEach(commissiondivide.commissionDivideHalls,function(commissionDivideHall){
                    if(commissionDivideHall.hall_id == hall_id){
                        $scope.commissiondivide_detail = angular.copy(commissionDivideHall);
                        $scope.commissiondivide_update = angular.copy(commissionDivideHall);
                    }
                });
                //刪除用戶類型
                $scope.addCommissiondivide = function(index) {
                    $scope.commissiondivide_detail.commissionDivideSubs.push({
                        "layer": ($scope.commissiondivide_detail.commissionDivideSubs.length-1),
                        "commission_should": "",
                        "integral_should": ""
                    });
                }
                //刪除特別收益戶口
                $scope.removeCommissiondivide = function(index){
                    $scope.commissiondivide_detail.commissionDivideSubs.splice(index,1);
                }

                //佣金总额计算
                $scope.commission_total = function(){
                    $scope.c_total = 0;
                    for(var j = 0;j < $scope.commissiondivide_detail.commissionDivideHallSubs.length;j++){
                        if($scope.commissiondivide_detail.commissionDivideHallSubs[j].commission_should){
                            $scope.c_total += parseInt($scope.commissiondivide_detail.commissionDivideHallSubs[j].commission_should);
                        }
                    }
                    $scope.commissiondivide_detail.commission_total = $scope.c_total;
                    return parseInt($scope.c_total);
                }
                //積分
                $scope.integral_total = function(){
                    $scope.i_total = 0;
                    for(var j = 0;j < $scope.commissiondivide_detail.commissionDivideHallSubs.length;j++){
                        if($scope.commissiondivide_detail.commissionDivideHallSubs[j].integral_should){
                            $scope.i_total += parseInt($scope.commissiondivide_detail.commissionDivideHallSubs[j].integral_should);
                        }
                    }
                    $scope.commissiondivide_detail.integral_total = parseInt($scope.i_total);
                    return parseInt($scope.i_total);
                }
                //修改本廳碼佣規則
                $scope.status = 0;
                $scope.disabled_submit = false;
                $scope.update = function(){
                    if($scope.disabled_submit){
                        return $scope.disabled_submit;
                    }
                    $scope.commissionDivideHall_one = angular.copy($scope.commissiondivide_detail);
                    $scope.disabled_submit = true;
                    $scope.form_commission.checkPreValidity('POST', 'systemsetting/commissiondivide/create-validate', commissionDivide.createValidate, {"commissionDivideHalls": [$scope.commissionDivideHall_one]}).then(function () {
                        $scope.form_commission.clearErrors();
                        $modalInstance.close($scope.commissiondivide_detail);
                        $scope.disabled_submit = false;
                    },function(){
                        $scope.disabled_submit = false;
                    });
                }

                //關閉彈出框
                $scope.return = function(){
                    $modalInstance.close("");
                }

        }]).controller('CommissionAgentManagerCtrl',['$scope','$modal','$log','getDate','$location','breadcrumb','topAlert','globalFunction','tmsPagination','hallName','specialAgent','pinCodeModal','agentsLists','businessType','depositCard',
           function($scope,$modal,$log,getDate,$location,breadcrumb,topAlert,globalFunction,tmsPagination,hallName,specialAgent,pinCodeModal,agentsLists,businessType,depositCard) {

            breadcrumb.items = [
                {"name":"公司戶口管理","active":true}
            ];
            $scope.sub_post = "POST";
            $scope.disabled_update = false;

            $scope.halls = hallName.query({hall_type:"|3"});
            $scope.businessTypes = businessType.query();

            var init_record = {
                agent_info_id: "",
                deposit_card_id: "",
                business_type_id: ""
            }
            $scope.record = angular.copy(init_record);

            var init_new_record = {
                agent_code : "",
                agent_name: ""
            }
            $scope.new_record = angular.copy(init_new_record);

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = specialAgent;
            $scope.select = function(page){
                $scope.specialAgents = $scope.pagination.select(page,{sort: 'create_time desc'});
            }
            $scope.select();

            $scope.is_update = false;
            $scope.$watch('new_record.agent_code',globalFunction.debounce(function(new_value, old_value){
                if(!$scope.is_update) {
                    $scope.new_record.agent_name = "";
                    $scope.record.agent_info_id = "";
                    $scope.depositCards = [];
                    if (new_value) {
                        agentsLists.query({agent_code: new_value}).$promise.then(function (agents) {
                            if (agents[0]) {
                                $scope.record.agent_info_id = agents[0].id;
                                $scope.new_record.agent_name = agents[0].agent_name;
                                $scope.depositCards = depositCard.query({agent_info_id: $scope.record.agent_info_id});
                            }
                        });
                    }
                }
            }));

            $scope.update = function(id){
                $scope.is_update = true;
                specialAgent.get({id:id}).$promise.then(function(_record){
                    $scope.record = _record;
                    $scope.sub_post = "PUT";
                    $scope.recod_reset = angular.copy(_record);
                    $scope.disabled_update = true;

                    $scope.new_record = {
                        agent_code:  $scope.record.agent_code,
                        agent_name:  $scope.record.agent_name
                    }

                    $scope.depositCards = depositCard.query({agent_info_id:$scope.record.agent_info_id});
                });


            }
            //刪除沒有交易記錄的存卡
            $scope.delete = function(id){
                pinCodeModal(specialAgent, 'delete', {id: id}, '刪除成功！').then(function () {
                    if($scope.record.id && id == $scope.record.id){
                        $scope.add_fraction();
                    }
                    $scope.select();
                })
            }

            $scope.company_agent_url = globalFunction.getApiUrl("systemsetting/specialagent");
            $scope.submit = function(){
                if($scope.disabled_submit) { return ; }
                $scope.form_company_agent.checkValidity().then(function(){
                    $scope.disabled_submit = true;
                    if($scope.record.id){
                        $scope.sub_post = "PUT";

                        $scope.record_copy = {
                            id: $scope.record.id,
                            agent_info_id: $scope.record.agent_info_id,
                            deposit_card_id: $scope.record.deposit_card_id,
                            business_type_id: $scope.record.business_type_id,
                            pin_code: $scope.record.pin_code
                        }

                        specialAgent.update($scope.record_copy,function(){
                            topAlert.success("修改成功！");
                            $scope.record = angular.copy(init_record);
                            $scope.select();
                            $scope.disabled_submit = false;
                            $scope.is_update = false;
                            $scope.sub_post = "POST";
                            $scope.new_record = angular.copy(init_new_record);
                        },function(){
                            $scope.disabled_submit = false;
                            $scope.is_update= false;
                        })
                    }else{
                        $scope.sub_post = "POST";
                        specialAgent.save($scope.record,function(){
                            topAlert.success("添加成功！");
                            $scope.record = angular.copy(init_record);
                            $scope.select();
                            $scope.disabled_submit = false;
                            $scope.is_update = false;
                            $scope.new_record = angular.copy(init_new_record);
                        },function(){
                            $scope.disabled_submit = false;
                            $scope.is_update = false;
                        })
                    }
                });
            }

            //切換新增狀態
            $scope.add_fraction = function(){
                $scope.disabled_update = false;
                $scope.is_update = false;
                $scope.record = angular.copy(init_record);
                $scope.new_record = angular.copy(init_new_record);
                $scope.form_company_agent.clearErrors();
            }

            $scope.reset = function(){
                $scope.disabled_submit = false;
                if($scope.record.id){
                    $scope.record = angular.copy($scope.recod_reset);
                    $scope.new_record.agent_code =$scope.recod_reset.agent_code;
                    $scope.new_record.agent_name =$scope.recod_reset.agent_name;
                }else{
                    $scope.record = angular.copy(init_record);
                    $scope.new_record = angular.copy(init_new_record);
                }
                $scope.is_update = false;
                $scope.form_company_agent.clearErrors();
            }

        }]).controller('integralTypeCreateCtrl',['$scope', '$modal', '$log', '$location', 'breadcrumb','topAlert','globalFunction','tmsPagination', 'integralType', 'pinCodeModal', 'integralTypeExpire', 'integralTypeStatus',
        function($scope,$modal,$log, $location,breadcrumb,topAlert,globalFunction,tmsPagination, integralType, pinCodeModal, integralTypeExpire, integralTypeStatus) {

            breadcrumb.items = [
                {"name":"積分類型管理","active":true}
            ];
            $scope.integralTypeExpire = integralTypeExpire.items;
            $scope.integralTypeStatus = integralTypeStatus.items;
            $scope.sub_post = "POST";
            $scope.disabled_update = false;

            var init_record = {
                integral_name: "",
                integral_expire: "",
                status : "",
                pin_code: ""
            }
            var original_record = angular.copy(init_record);
            $scope.record = angular.copy(init_record);

            $scope.integrals = [];

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = integralType;
            $scope.select = function(page){
                $scope.pagination.select(page).$promise.then(function(data){
                    $scope.integrals = data;
                });
            }
            $scope.select();

            //修改
            $scope.update = function(integral)
            {
                _.extend_exist(original_record, integral)
                original_record.id = integral.id;
                $scope.record = angular.copy(original_record);
            }
            //
            $scope.delete = function(id){
                pinCodeModal(integralType, 'delete', {id: id}, '刪除成功！').then(function () {
                    $scope.select();
                    if(id == $scope.record.id){
                        $scope.add()
                    }
                })
            }

            $scope.form_integral_create_url = globalFunction.getApiUrl("consumption/integraltype");

            $scope.submit = function(){
                if($scope.disabled_submit) { return ; }
                $scope.disabled_submit = true;

                $scope.form_integral_create.checkValidity().then(function(){

                    if($scope.record.id){
                        var record_copy = angular.copy($scope.record);
                        integralType.update(record_copy,function(){
                            topAlert.success("修改成功！");
                            $scope.select();
                            $scope.add();
                            $scope.sub_post = "POST";
                            $scope.disabled_submit = false;
                        },function(){
                            $scope.disabled_submit = false;
                        })
                    }else{
                        integralType.save($scope.record,function(){
                            topAlert.success("添加成功！");
                            $scope.select();
                            $scope.add();
                            $scope.disabled_submit = false;
                        },function(){
                            $scope.disabled_submit = false;
                        })
                    }
                });
            }

            $scope.add = function()
            {
                var original_record = angular.copy(init_record);
                $scope.record = angular.copy(init_record);
                $scope.form_integral_create.clearErrors();
            }

            $scope.reset = function()
            {
                $scope.record = angular.copy(original_record);
                $scope.form_integral_create.clearErrors();
            }

        }]).controller('integralTypeBindCtrl',['$scope', '$modal', '$log', '$location', 'breadcrumb','topAlert','globalFunction','tmsPagination', 'hallName', 'commissionDivide', 'pinCodeModal', 'integralType',
        function($scope,$modal,$log, $location,breadcrumb,topAlert,globalFunction,tmsPagination,hallName,commissionDivide,pinCodeModal, integralType) {

            breadcrumb.items = [
                {"name":"積分類型綁定","active":true}
            ];
            $scope.sub_post = "PUT";
            $scope.disabled_update = false;

            $scope.integralTypes = integralType.query({status : 1});
            $scope.halls = hallName.query({hall_type:"|1"});

            var init_record = {
                id: "",
                integral_type_id: "",
                pin_code: ""
            }
            var original_record = angular.copy(init_record);
            $scope.record = angular.copy(init_record);

            $scope.hallNames = [];

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = hallName;
            $scope.select = function(page){
                $scope.pagination.select(page).$promise.then(function(data){
                    $scope.hallNames = data;
                });
            }
            $scope.select();

            //修改
            $scope.update = function(hall)
            {
                _.extend_exist(original_record, hall)
                $scope.record = angular.copy(original_record);
            }
            //
            $scope.delete = function(id){
                pinCodeModal(hallName, 'deleteHallIntegralType', {id: id}, '刪除成功！').then(function () {
                    $scope.select();
                    if(id == $scope.record.id){
                        $scope.add();
                    }
                })
            }

            $scope.form_integral_bind_url = globalFunction.getApiUrl("common/hall/set-hall-integral-type");

            $scope.submit = function(){
                if($scope.disabled_submit) { return ; }
                $scope.disabled_submit = true;

                $scope.form_integral_bind.checkValidity().then(function(){

                    if($scope.record.id){
                        var record_copy = angular.copy($scope.record);
                        hallName.setHallIntegralType(record_copy,function(){
                            topAlert.success("積分類型綁定成功！");
                            $scope.record = angular.copy(init_record);
                            $scope.select();
                            $scope.disabled_submit = false;
                            $scope.add();
                        },function(){
                            $scope.disabled_submit = false;
                        })
                    }else{
                        hallName.setHallIntegralType($scope.record,function(){
                            topAlert.success("添加成功！");
                            $scope.record = angular.copy(init_record);
                            $scope.select();
                            $scope.disabled_submit = false;
                            $scope.add();
                        },function(){
                            $scope.disabled_submit = false;
                        })
                    }
                });
            }

            $scope.add = function()
            {
                var original_record = angular.copy(init_record);
                $scope.record = angular.copy(init_record);
                $scope.form_integral_bind.clearErrors();
            }

            $scope.reset = function()
            {
                $scope.record = angular.copy(original_record);
                $scope.form_integral_bind.clearErrors();
            }

        }]).controller('keyboardManagerCtrl',[ '$scope','$modal','$log','getDate','$filter','$location','breadcrumb','departMent', 'departmentShortcuts', 'globalFunction', 'topAlert', 'pinCodeModal',
            function($scope,$modal,$log,getDate,$filter,$location,breadcrumb,departMent, departmentShortcuts, globalFunction, topAlert, pinCodeModal) {

                breadcrumb.items = [
                    {"name":"系統快捷鍵管理","active":true}
                ];

                $scope.form_method = "POST";
                $scope.form_url = globalFunction.getApiUrl("systemsetting/departmentshortcuts");

                $scope.active_id = "";
                departMent.query().$promise.then(function(departMents){
                    $scope.departMents = departMents;
                    if(departMents) {
                        $scope.keyboard_select(departMents[0].id);
                    }
                });//部門

                //通過部門查詢快捷鍵設置項
                $scope.keyboards = [];
                $scope.keyboards_update = [];
                //$scope.keyboard_original = [];
                $scope.keyboard_select = function(id){
                    $scope.active_id = id;
                    $scope.keyboards = [];
                    $scope.keyboards_update = [];
                    departmentShortcuts.query({department_id : id}).$promise.then(function(data)
                    {
                        $scope.keyboards = [];
                        $scope.keyboards_update = [];
                        for(var i=1; i<9; i++) {
                            var shortcuts = "F" + i;
                            var tmp_key = _.findWhere(data, {shortcuts : shortcuts});
                            var keyboard = {
                                id : "",
                                department_id : id,
                                shortcuts: shortcuts,
                                link: "",
                                group : "",
                                btn_name: ""
                            }
                            if(tmp_key){
                                _.extend_exist(keyboard, tmp_key);

                                _.each($scope.select_arr, function($that, $key){
                                    var name = _.find($that, function(arr){ return keyboard.link == arr[0] });
                                    if(name)
                                    {
                                        keyboard.group = $that[0][1] +'-'+ name[1];
                                        return false;
                                    }
                                })
                            }
                            $scope.keyboards.push(keyboard);
                        }
                        $scope.keyboards_update = angular.copy($scope.keyboards);
                    })
                }

                $scope.changeLink = function(keyboard)
                {
                    _.each($scope.select_arr, function($that, $key){
                        var name = _.find($that, function(arr){ return keyboard.link == arr[0] });
                        if(name)
                        {
                            keyboard.btn_name = name[1];
                            return false;
                        }
                    })
                    //var link = _.find($scope.select_arr, keyboard.link);
                }


                $scope.update = function(keyboard)
                {
                    //$scope.keyboards_update.push(angular.copy(keyboard));
                    _.each($scope.keyboards, function($that)
                    {
                        if(keyboard.shortcuts != $that.shortcuts)
                        {
                            $that.updated = false;
                            $scope.cancel($that);
                        }
                    })
                    keyboard.updated = true;
                }

                $scope.save = function(keyboard)
                {
                    var keyboard_copy = angular.copy(keyboard)
                    delete keyboard_copy.group;
                    if("" === keyboard_copy.id)
                    {
                        delete keyboard_copy.id;
                        $scope.form_method = "POST";
                        pinCodeModal(departmentShortcuts, 'save', keyboard_copy, '添加快捷鍵成功！').then(function () {
                            keyboard.updated = false;
                            $scope.keyboard_select($scope.active_id);
                        })
                    }
                    else
                    {
                        $scope.form_method = "PUT";
                        pinCodeModal(departmentShortcuts, 'update', keyboard_copy, '修改快捷鍵成功！').then(function () {
                            keyboard.updated = false;
                            $scope.keyboard_select($scope.active_id);
                        });
                    }
                }

                $scope.delete = function(keyboard)
                {
                    pinCodeModal(departmentShortcuts, 'delete', {id : keyboard.id}, '刪除快捷鍵成功！').then(function () {
                        keyboard.updated = false;
                        $scope.keyboard_select($scope.active_id);
                    });
                }

                $scope.cancel = function(keyboard)
                {
                    var old_keyboard = _.findWhere($scope.keyboards_update , {shortcuts : keyboard.shortcuts});
                    keyboard.link = old_keyboard.link;
                    keyboard.btn_name = old_keyboard.btn_name;
                    keyboard.updated = false;
                }

                function Get_nav()
                {
                    var select_arr = [];
                    var nav = $("#nav");
                    var lis = nav.find(">li:gt(0)");
                    lis.each(function($index)
                    {
                        var links = $(this).find('a').map(function(i, e)
                        {
                            var href = this.href;
                            href = href.substring(href.indexOf("#"), href.length);
                            return href;
                        })

                        var names = $(this).find('span').map(function(i, e)
                        {
                            return this.innerText;
                        })
                        var zip_arr = _.zip(links, names);
                        select_arr.push(zip_arr);

                    });
                    return select_arr;
                }
                $scope.select_arr = Get_nav();
        }])
}).call(this);

