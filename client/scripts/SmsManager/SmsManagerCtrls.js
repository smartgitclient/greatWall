/**
 * Created by Allen.zhang on 2014/8/21.
 */


(function() {
    'use strict';
    angular.module('app.sms-manager.ctrls',['app.sms-manager.services']).controller('usefulPhraseTemplateCtrl',['$scope','globalFunction','tmsPagination','breadcrumb','pinCodeModal','smsTepartments','smsDepartments','departMent','topAlert','$modal',
        function($scope,globalFunction,tmsPagination,breadcrumb,pinCodeModal,smsTepartments,smsDepartments,departMent,topAlert,$modal){
            breadcrumb.items = [
                {"name":"常用短信模板","active":true}
            ];

            $scope.smsDepartments = smsDepartments.data;
            $scope.departMents = departMent.query();//部門

            $scope.sub_post = "POST";
            $scope.disabled_update = false;
            //创建短信模板model
            var init_smstemplate = {
                "pin_code":"",
                "template_name":"",
                "department_id":"",
//                "sms_type_id":"",
                "content":"",
                "is_sys":"0"
            }
            var original = angular.copy(init_smstemplate);
            $scope.smstemplate = angular.copy(init_smstemplate);
            //初始化列表
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = smsTepartments;
            $scope.select = function(page){
                $scope.smstemplates = $scope.pagination.select(page);
            }
            $scope.select();

            //修改
            $scope.update = function(smstemplate)
            {
                $scope.sub_post = "PUT";
                _.extend_exist(original, smstemplate);
                original.id = smstemplate.id;
                $scope.smstemplate = angular.copy(original);
            }
            //
            $scope.delete = function(id){
                pinCodeModal(smsTepartments, 'delete', {id: id}, '刪除成功！').then(function () {
                    $scope.select();
                    if(id == $scope.smstemplate.id){
                        $scope.add();
                    }
                })
            }

            $scope.form_smstemplate_url = globalFunction.getApiUrl("sms/smstemplate");

            $scope.submit = function(){
                if($scope.disabled_submit) { return ; }
                $scope.disabled_submit = true;
                $scope.form_sms_template.checkValidity().then(function(){
                    var smstemplate_copy = angular.copy($scope.smstemplate);
                    if($scope.smstemplate.id){
                        smsTepartments.update(smstemplate_copy,function(){
                            topAlert.success("修改成功！");
                            $scope.select();
                            $scope.add();
                            $scope.sub_post = "POST";
                            $scope.disabled_submit = false;
                        },function(){
                            $scope.disabled_submit = false;
                        })
                    }else{
                        smsTepartments.save(smstemplate_copy,function(){
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
                var original = angular.copy(init_smstemplate);
                $scope.smstemplate = angular.copy(init_smstemplate);
                $scope.form_sms_template.clearErrors();
            }

            $scope.reset = function()
            {
                if($scope.smstemplate.id){
                    $scope.smstemplate = angular.copy(original);

                }else{
                    $scope.smstemplate = angular.copy(init_smstemplate);
                }
                $scope.form_sms_template.clearErrors();
                $scope.form_sms_template.clearErrors();
            }
//短訊詳細
            $scope.detailSmstemplate = function(smstemplate){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/sms-manager/sms-template-detail.html",
                    controller: 'smstemplateDetailCtrl',
                    resolve: {
                        smstemplate:function(){
                            return smstemplate;
                        }
                    }
                });
            }

        }]).controller('smstemplateDetailCtrl',['$scope','smstemplate','$modalInstance',
            function($scope,smstemplate,$modalInstance){
                $scope.smstemplate = smstemplate;
                //關閉
                $scope.cancel = function(){
                    $modalInstance.close();
                }

    }]).controller('sendSmsCtrl',['$scope','breadcrumb','$window','tmsPagination', 'globalFunction', '$modal', 'topAlert', 'departMent', 'areaCode', 'smsGroup', 'agentsLists', 'agentGroup', 'smsRecord', 'pinCodeUserName',
        function($scope,breadcrumb,$window,tmsPagination, globalFunction, $modal, topAlert, departMent, areaCode, smsGroup, agentsLists, agentGroup, smsRecord, pinCodeUserName){

            //如果是集團不能改內容
            if($scope.user.hall.hall_type==1){
                $window.history.back()
                topAlert.warning("集團不能發送短信");
                return;
            }

            breadcrumb.items = [
                {"name":"發送短信","active":true}
            ];

            $scope.departMents = departMent.query();//部門
            $scope.areaCodes = areaCode.query();//地區
            $scope.isDesabled = false;
            $scope.sub_method = "POST";

            var init_record = {
                pin_code:"",
                sms_type:"1",
                //"department_id":"",
                priority:"1",
                is_sys:"0",
                content:"",
                phoneNumbers:[
                    {
                        agent_info_id: "",
                        agent_code:"",
                        area_code:"",
                        telephone_number:""
                    }
                ]
            }
            $scope.record_create = angular.copy(init_record);

            var init_new_record = {
                search_type: "agent",
                keyword: ""
            }
            $scope.new_record = angular.copy(init_new_record);

            //初始化列表數據
            /*var init_condition = {
                sms_group_name: "",
                agent_group_name: ""
            }*/
            //$scope.condition = angular.copy(init_condition);
            /*$scope.pagination = tmsPagination.create();
            $scope.pagination.resource = smsGroup;*/
            $scope.group_select = function(){
                $scope.condition_copy = angular.copy($scope.new_record);
                if($scope.condition_copy.keyword){
                    $scope.condition_copy.keyword = $scope.condition_copy.keyword+"!";
                }
                smsGroup.query({sms_group_name: $scope.condition_copy.keyword}).$promise.then(function(_smsGroup){
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

            //指定戶組
            $scope.agent_select = function(){
                $scope.condition_copy = angular.copy($scope.new_record);
                if($scope.condition_copy.keyword){
                    $scope.condition_copy.keyword = $scope.condition_copy.keyword+"!";
                }
                agentGroup.query({agent_group_name: $scope.condition_copy.keyword}).$promise.then(function(_agentGroup){
                    _.each($scope.selected_group_content,function(selected_group){
                        var selected_data = _.findWhere(_agentGroup,{id:selected_group.id});
                        if(selected_data){
                            selected_data.is_selected = true;
                        }
                    });
                    $scope.agent_groups = _agentGroup;
                });
            }

            //$scope.group_select();
            //$scope.agent_select();

            //切換指定戶口
            /*$scope.smsType_change = function(){
                //普通發送(群組)
                if($scope.record_create.sms_type==1){
                    $scope.select();
                }else if($scope.record_create.sms_type==2){
                    $scope.agent_select();
                }
            }
            $scope.smsType_change();*/

            //輸入號碼
            $scope.isWriteFlag = false;
            $scope.write_num = function(){
                $scope.tel_records = [];
                $scope.agentTels = [];
                $scope.isWriteFlag = true;
                $scope.tel_record = angular.copy(init_tel_record);
                $scope.new_record = angular.copy(init_new_record);
            }

            //選擇搜索項
            $scope.placeholder = "戶口查詢";
            $scope.change_search_type = function(){
                $scope.tel_records = [];
                $scope.agentTels = [];
                $scope.new_record.keyword = "";
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
                }else if($scope.new_record.search_type=="agent_group"){ //戶組查詢
                    $scope.agent_select();
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
            $scope.group_selected = function(record,type){
                $scope.isSelectDisabled = true;
                //指定戶口
                if(type=='agent'){
                    smsRecord.groupTel({agent_group_id:record.id}).$promise.then(function(agentTel){
                        $scope.tel_content.push(agentTel);
                        $scope.tel_content = _.flatten($scope.tel_content);
                        $scope.isSelectDisabled = false;
                    });
                }else{
                    smsGroup.get(globalFunction.generateUrlParams({id:record.id},{smsGroupSubs:{}})).$promise.then(function(_smsGroup){
                        //$scope.record_create.department_id = _smsGroup.department_id;
                        //$scope.tel_content[record.id] = _smsGroup.smsGroupSubs;
                        $scope.tel_content.push(_smsGroup.smsGroupSubs);
                        $scope.tel_content = _.flatten($scope.tel_content);
                        $scope.isSelectDisabled = false;
                    });
                }

                //隱藏選中的群組
                record.is_selected = true;
                $scope.selected_group_content.push(record);
            }

            //取消選中戶組
            $scope.cancel_selected = function(record,index){
                if($scope.record_create.sms_type==1){
                    //var groups_data = _.findWhere($scope.sms_groups,{id:record.id});
                    var cancel_group = _.where($scope.tel_content,{sms_group_id:record.id});
                }else if($scope.record_create.sms_type==2){
                    //var groups_data = _.findWhere($scope.agent_groups,{id:record.id});
                    var cancel_group = _.where($scope.tel_content,{agent_group_id:record.id});
                }
                /*if(groups_data){
                    groups_data.is_selected = false;
                }*/
                $scope.selected_group_content.splice(index,1);
                $scope.tel_content = _.difference($scope.tel_content,cancel_group);
            }

            //通過戶口查詢
            $scope.isHiddenCode = false;
            $scope.tel_records = []
            $scope.agent_watch = function(){
                $scope.tel_records = [];
                $scope.agentTels = [];
                //$scope.tel_record.telephone_number = "";
                if($scope.new_record.keyword){
                    agentsLists.getSmsPhoneNumbers({agent_code:$scope.new_record.keyword}).$promise.then(function(agents_tel){

                        if(agents_tel && agents_tel.length>0){
                            $scope.isHiddenCode = true;
                            $scope.agentTels = agents_tel;
                            _.each($scope.agentTels,function(_sys_tel){
                                //判斷加入的列表是否存在要加入的號碼
                                var tel_data = _.where($scope.tel_content,{agent_code: _sys_tel.agent_code, area_code_id:  _sys_tel.area_code_id, telephone_number:_sys_tel.telephone_number});
                                if(tel_data && tel_data.length==0) {
                                    $scope.tel_content.push(
                                        {
                                            agent_name: _sys_tel.agent_name,
                                            agent_code: _sys_tel.agent_code,
                                            area_code_id: _sys_tel.area_code_id ? _sys_tel.area_code_id : "",
                                            area_code: _sys_tel.area_code ? _sys_tel.area_code : "",
                                            telephone_number: _sys_tel.telephone_number ? _sys_tel.telephone_number : ""
                                        }
                                    );
                                }
                            });
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
            $scope.addTel = function(index){
                //$scope.new_record = angular.copy(init_new_record);
                //系統數據
                //var i = 0;
                if($scope.tel_records[index] && $scope.tel_records[index].isSystemFlag){
                    $scope.tel_records[index].isHidden = true;
                    _.each($scope.agentTels[index],function(_sys_tel){
                        //判斷加入的列表是否存在要加入的號碼
                        var tel_data = _.where($scope.tel_content,{agent_code: _sys_tel.agent_code, area_code_id:  _sys_tel.area_code_id, telephone_number:_sys_tel.telephone_number});
                        if(tel_data && tel_data.length==0) {
                            $scope.tel_content.push(
                                {
                                    //agent_info_id: _sys_tel.agent_info_id,
                                    agent_name: _sys_tel.agent_name,
                                    agent_code: _sys_tel.agent_code,
                                    area_code_id: _sys_tel.area_code_id ? _sys_tel.area_code_id : "",
                                    area_code: _sys_tel.area_code ? _sys_tel.area_code : "",
                                    telephone_number: _sys_tel.telephone_number ? _sys_tel.telephone_number : ""
                                }
                            );
                        }/*else{
                            i++;
                            if(i==1) {
                                topAlert.success("存在相同的號碼，系統將自動替換相同號碼！");
                            }
                        }*/
                    });
//                    $scope.tel_records.splice(index, 1);
                }else {
                    $scope.tel_record_copy = angular.copy($scope.tel_record);
                    //手動填写才驗證
                    if(!$scope.isHiddenCode && !$scope.tel_record_copy.area_code_id){
                        topAlert.warning("區域不能為空");
                        return;
                    }
                    if(!$scope.isHiddenCode && !$scope.tel_record_copy.telephone_number){
                        topAlert.warning("號碼不能為空");
                        return;
                    }

                    var tel_data = _.where($scope.tel_content,{area_code_id:$scope.tel_record_copy.area_code_id, telephone_number:$scope.tel_record_copy.telephone_number});
                    if(tel_data && tel_data.length==0) {
                        $scope.tel_content.push($scope.tel_record_copy);
                    }else{
                        topAlert.success("存在相同的號碼，系統將自動替換相同號碼！");
                    }
                    $scope.tel_record = angular.copy(init_tel_record);
                }

                $scope.isHiddenCode = false;
            }

            $scope.delete_contatc_tels = [];
            $scope.removeTel = function(record,index){
                //按指定戶口發送
                if(record.sms_group_id || record.agent_group_id) {
                    if ($scope.record_create.sms_type == 2) {
                        //儲存刪除的號碼
                        $scope.delete_contatc_tels.push(record.id);

                        $scope.tel_content.splice(index, 1);
                        var data = _.where($scope.tel_content, {agent_group_id: record.agent_group_id});
                        if (data.length == 0) {
                            var record_new = _.findWhere($scope.selected_group_content, {id: record.agent_group_id});
                            $scope.cancel_selected(record_new);
                        }
                    } else if ($scope.record_create.sms_type == 1) {
                        $scope.tel_content.splice(index, 1);
                        //如果該組全部刪完刪掉選中的該組
                        var data = _.where($scope.tel_content, {sms_group_id: record.sms_group_id});
                        if (data.length == 0) {
                            var record_new = _.findWhere($scope.selected_group_content, {id: record.sms_group_id});
                            $scope.cancel_selected(record_new);
                        }
                    }
                }else{
                    $scope.tel_content.splice(index, 1);
                }
            }

            $scope.areaCode_change = function(){
                var areaCode_record = _.findWhere($scope.areaCodes,{id:$scope.tel_record.area_code_id});
                $scope.tel_record.area_code = areaCode_record.area_code;
            }

            //群組和號碼綁定
            $scope.send_sms_url = globalFunction.getApiUrl('sms/smsrecord');
            $scope.submit = function() {
                if($scope.isDisabled) { return $scope.isDisabled; }
                $scope.isDisabled = true;

                $scope.phoneNumbers = [];
                _.each($scope.tel_content,function(tel){
                    $scope.phoneNumbers.push({
                        //agent_info_id: tel.agent_info_id,
                        agent_code: tel.agent_code,
                        agent_name: tel.agent_name,
                        area_code: tel.area_code,
                        telephone_number: tel.telephone_number
                    });
                });
                //return false;

                //普通發送
                if($scope.record_create.sms_type==1) {
                    $scope.record_create.phoneNumbers = $scope.phoneNumbers;
                    $scope.record_create.type = "81";
                    $scope.form_send_sms.checkValidity().then(function () {
                        if($scope.phoneNumbers.length>0) {
                            smsRecord.save($scope.record_create).$promise.then(function () {
                                topAlert.success('普通短信發送成功');
                                $scope.cancel();
                                $scope.isDisabled = false;
                            }, function () {
                                $scope.isDisabled = false;
                            });
                        }else{
                            $scope.isDisabled = false;
                            topAlert.warning("請還沒加入要發送的號碼");
                        }
                    });
                }else if($scope.record_create.sms_type==2){

                    //所選擇的組
                    $scope.agent_group_id = [];
                    _.each($scope.selected_group_content,function(selected_group){
                        $scope.agent_group_id.push(selected_group.id);
                    });
                    $scope.agent_record_create = {
                            pin_code: $scope.record_create.pin_code,
                            //department_id: $scope.record_create.department_id,
                            content: $scope.record_create.content,
                            is_sys : 0,   //系統短信模板:1系統/0常用
                            priority : 1, //優先級:1高/3低
                            agent_group_id: $scope.agent_group_id,
                            delete_contatc_tels : $scope.delete_contatc_tels
                    }
                    $scope.agent_record_create.type = "81";
                    $scope.form_send_sms.checkValidity().then(function () {
                        if($scope.agent_record_create.agent_group_id.length>0) {
                            smsRecord.smsGroup($scope.agent_record_create).$promise.then(function () {
                                topAlert.success('指定戶組短信發送成功');
                                $scope.cancel();
                                $scope.isDisabled = false;
                            }, function () {
                                $scope.isDisabled = false;
                            });
                        }else{
                            $scope.isDisabled = false;
                            topAlert.warning("請還沒選擇要發送的戶組");
                        }
                    });
                }
            };

            //常用短信模板
            $scope.smsTemplateOpen = function(){
                var smsModal;
                smsModal = $modal.open({
                    templateUrl: "views/sms-manager/sms-template-window.html",
                    controller: 'smsTemplateWindowCtrl',
                    windowClass:'md-modal'
                    /*resolve: {
                        user_data : function(){
                            return $scope.user;
                        }
                    }*/
                });

                smsModal.result.then(function(result){
                    $scope.record_create.department_id = result.department_id;
                    $scope.record_create.content = result.content;
                });
            }

            $scope.username =  "",
            $scope.cancel = function(){
                if($scope.is_locked){
                    var pin_code = $scope.record_create.pin_code;
                }else{
                    $scope.username = "";
                }
                $scope.new_record = angular.copy(init_new_record);

                if($scope.record_create.sms_type==1){
                    $scope.placeholder = "戶口查詢";
                    $scope.new_record.search_type = "agent";
                }else if($scope.record_create.sms_type==2){
                    $scope.placeholder = "戶組查詢";
                    $scope.new_record.search_type = "agent_group";
                }
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
                $scope.record_create.pin_code = pin_code;

                $scope.record_create.sms_type = $scope.sms_type;
                $scope.isWriteFlag = false;
            }

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
                    if ($scope.record_create.pin_code) {
                        //pin_code 查詢用戶
                        pinCodeUserName.save({pin_code: $scope.record_create.pin_code}).$promise.then(function (username) {
                            if(username.name=="" || username.name==null){
                                topAlert.warning("操作密碼不正確！");
                                $scope.isLockedFlag = false;
                                return;
                            }else{
                                $scope.isLockedFlag = false;
                                $scope.username = username.name;
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

            $scope.reset = function(){

            }

    }]).controller('smsTemplateWindowCtrl',['$scope','breadcrumb','tmsPagination', '$modalInstance', 'globalFunction','topAlert','smsTepartments',
        function($scope, breadcrumb, tmsPagination, $modalInstance, globalFunction, topAlert, smsTepartments){

            //初始化列表數據
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = smsTepartments;
            $scope.pagination.max_size =3;
            $scope.select = function(page){
                /*$scope.condition_copy = angular.copy($scope.condtion);
                if($scope.condition_copy.sms_group_name){
                    $scope.condition_copy.sms_group_name = $scope.condition_copy.sms_group_name+"!";
                }*/
                $scope.smsTemplates = $scope.pagination.select(page);//,globalFunction.generateUrlParams($scope.condition_copy)
            }
            $scope.select();

            var init_record = {
                department_id: "",
                content: ""
            }
            $scope.record = angular.copy(init_record);
            $scope.detail = function(record){
                $scope.record.department_id = record.department_id;
                $scope.record.content = record.content;
            }

            $scope.selected = function(){
                $modalInstance.close($scope.record);
            }

            $scope.cancel = function(){
                $scope.record = angular.copy(init_record);
                $modalInstance.dismiss();
            }

    }]).controller('smsGroupManagerCtrl',['$scope','breadcrumb','tmsPagination','globalFunction','$modal','topAlert','departMent', 'smsGroup', 'agentsLists', 'areaCode', 'pinCodeModal',
        function($scope, breadcrumb, tmsPagination, globalFunction, $modal, topAlert, departMent, smsGroup, agentsLists, areaCode, pinCodeModal){
            breadcrumb.items = [
                {"name":"短信群組","active":true}
            ];

            $scope.departMents = departMent.query();//部門
            $scope.areaCodes = areaCode.query();//地區
            $scope.isDesabled = false;
            $scope.sub_method = "POST";

            var init_record = {
                "pin_code":"",
                "sms_group_name":"",
                "department_id":"",
                "smsGroupSubs":[
                    {
                        "agent_name":"",
                        "agent_code":"",
                        "area_code_id":"",
                        "telephone_number":""
                    }
                ]
            }
            $scope.record_create = angular.copy(init_record);

            //搜索條件
            var init_condition = {
                department_id: "",
                sms_group_name: ""
            }
            $scope.condition = angular.copy(init_condition);

            //初始化列表數據
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = smsGroup;
            $scope.select = function(page){
                $scope.condition_copy = angular.copy($scope.condition);
                if($scope.condition_copy.sms_group_name){
                    $scope.condition_copy.sms_group_name = $scope.condition_copy.sms_group_name+"!";
                }
                $scope.sms_groups = $scope.pagination.select(page,globalFunction.generateUrlParams($scope.condition_copy));
            }
            $scope.select();

            //新增號碼
            $scope.tel_content = [];
            var init_tel_record = {
                agent_name: "",
                agent_code: "",
                area_code_id: "",
                //type: "normal",
                telephone_number: ""
            }
            $scope.tel_record = angular.copy(init_tel_record);

            //通過戶口查詢
            $scope.isHiddenCode = false;
            $scope.$watch('tel_record.agent_code',globalFunction.debounce(function(new_value, old_value){
                $scope.tel_record.agent_name = "";
                $scope.tel_record.telephone_number = "";
                if(new_value){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code:new_value},{refTelAgentMasterNoticeType:{agentContactTel:''}}))
                        .$promise.then(function(agents){
                            if(agents[0]) {
                                $scope.tel_record.agent_name = agents[0].agent_name;
                                if(agents[0].refTelAgentMasterNoticeType.length>0){
                                    $scope.isHiddenCode = true;
                                    $scope.tel_record.isSystemFlag = agents[0].refTelAgentMasterNoticeType.length > 0 ? true : false;
                                    //$scope.tel_record.type = agents[0].refTelAgentMasterNoticeType.length > 1 ? "system" : "normal";
                                    //$scope.tel_record.telephone_number = [];

                                    $scope.agentTels = agents[0].refTelAgentMasterNoticeType;
                                    $scope.telephone_number_content = [];
                                    _.each(agents[0].refTelAgentMasterNoticeType,function(_tel){
                                        $scope.telephone_number_content.push(_tel.agentContactTel.area_code+"-"+_tel.agentContactTel.telephone_number);
                                    });
                                    $scope.tel_record.telephone_number = $scope.telephone_number_content.join(',');
                                }else{
                                    $scope.isHiddenCode = false;
                                    $scope.tel_record.isSystemFlag = false;
                                    //$scope.tel_record.type = "normal";
                                }
                            }
                        });
                }else{
                        $scope.isHiddenCode = false;
                }
            }));

            $scope.addTel = function(){
                $scope.tel_record_copy = angular.copy($scope.tel_record);
                //手動談些才驗證
                if(!$scope.isHiddenCode && !$scope.tel_record_copy.area_code_id){
                    topAlert.warning("區域不能為空");
                    return;
                }
                if(!$scope.tel_record_copy.telephone_number){
                    topAlert.warning("號碼不能為空");
                    return;
                }

                //系統數據
                var i = 0
                if($scope.tel_record_copy.isSystemFlag){
                    _.each($scope.agentTels,function(_sys_tel){
                        //判斷加入的列表是否存在要加入的號碼
                        var tel_data = _.where($scope.tel_content,{area_code_id:  _sys_tel.agentContactTel.area_code_id, telephone_number:_sys_tel.agentContactTel.telephone_number});
                        if(tel_data && tel_data.length==0){
                            $scope.tel_content.push(
                                {
                                    agent_name: $scope.tel_record_copy.agent_name,
                                    agent_code: $scope.tel_record_copy.agent_code,
                                    area_code_id: _sys_tel.agentContactTel.area_code_id ? _sys_tel.agentContactTel.area_code_id : "",
                                    area_code: _sys_tel.agentContactTel.area_code ? _sys_tel.agentContactTel.area_code : "",
                                    telephone_number: _sys_tel.agentContactTel.telephone_number ? _sys_tel.agentContactTel.telephone_number : ""
                                }
                            );
                        }else{
                            i++;
                            if(i==1) {
                                topAlert.success("存在相同的號碼，系統將自動替換相同號碼！");
                            }
                        }
                    });
                }else {
                    var tel_data = _.where($scope.tel_content,{area_code_id:$scope.tel_record_copy.area_code_id, telephone_number:$scope.tel_record_copy.telephone_number});
                    if(tel_data && tel_data.length==0) {
                        $scope.tel_content.push($scope.tel_record_copy);
                    }else{
                        topAlert.success("存在相同的號碼，系統將自動替換相同號碼！");
                    }
                }
                $scope.tel_record = angular.copy(init_tel_record);
                $scope.isHiddenCode = false;
            }

            $scope.removeTel = function(index){
                $scope.tel_content.splice(index,1);
            }

            $scope.areaCode_change = function(){
                var areaCode_record = _.findWhere($scope.areaCodes,{id:$scope.tel_record.area_code_id});
                $scope.tel_record.area_code = areaCode_record.area_code;
            }

            //群組和號碼綁定
            $scope.sms_group_url = globalFunction.getApiUrl('sms/smsgroup');
            $scope.submit = function() {
                if($scope.isDisabled) { return $scope.isDisabled; }
                $scope.isDisabled = true;

//                if($scope.tel_record.telephone_number){
//                    topAlert.warning("存在未加入發送列表的號碼，請先加入。");
//                    return false;
//                }

                //把系統多條電話數據拆分
                /*var system_tels = _.where($scope.tel_content,{type:"system"});
                var normal_tels = _.where($scope.tel_content,{type:"normal"});
                _.each(system_tels,function(_sys_tel){
                    var tels = _sys_tel.telephone_number.split(',');
                    for(var i=0; i<tels.length; i++){
                       var _tel = tels[i].split('-');
                        normal_tels.push(
                            {
                                agent_name: _sys_tel.agent_name,
                                agent_code: _sys_tel.agent_code,
                                area_code_id: _sys_tel.area_code_id,
                                area_code: _tel[0] ? _tel[0] : "",
                                telephone_number: _tel[1] ? _tel[1] : ""
                            }
                        )
                    }
                });*/
                $scope.record_create.smsGroupSubs = $scope.tel_content;
                //return false;

                $scope.form_sms_group.checkValidity().then(function() {
                    if($scope.record_create.id){
                        smsGroup.update($scope.record_create).$promise.then(function () {
                            topAlert.success('群組和號碼修改成功');
                            $scope.cancel();
                            $scope.select();
                            $scope.isDisabled = false;
                        }, function () {
                            $scope.isDisabled = false;
                        });
                    }else {
                        smsGroup.save($scope.record_create).$promise.then(function () {
                            topAlert.success('群組和號碼綁定成功');
                            $scope.cancel();
                            $scope.select();
                            $scope.isDisabled = false;
                        }, function () {
                            $scope.isDisabled = false;
                        });
                    }
                });
            };

            //修改戶組
            $scope.isDetailFlag = false;
            $scope.edit = function(id,type){
                smsGroup.get(globalFunction.generateUrlParams({id:id},{smsGroupSubs:{}})).$promise.then(function(_smsGroup){
                    $scope.tel_record = angular.copy(init_tel_record);
                    if(type=='detail'){
                        $scope.isDetailFlag = true;
                    }else if(type=='edit'){
                        $scope.sub_method = "PUT";
                        $scope.isDetailFlag = false;
                    }
                    $scope.record_create.id = _smsGroup.id;
                    $scope.record_create.department_id = _smsGroup.department_id;
                    $scope.record_create.sms_group_name = _smsGroup.sms_group_name;
                    $scope.tel_content = _smsGroup.smsGroupSubs;
                });
            }

            //刪除
            $scope.remove = function(id){
                pinCodeModal(smsGroup, 'delete', {id: id}, '群組刪除成功！').then(function () {
                    $scope.select();
                });
            }

            //取消
            $scope.cancel = function(){
                $scope.isDetailFlag = false;
                $scope.record_create = angular.copy(init_record);
                $scope.tel_record = angular.copy(init_tel_record);
                $scope.tel_content = [];
            }

            $scope.reset = function(){
                $scope.condition = angular.copy(init_condition);
                $scope.select();
            }


    }]).controller('smsRecordCtrl',['$scope','breadcrumb','tmsPagination','smsRecord','areaCode','hallName','agentModule','sendSmsStatus','goBackData','pinCodeModal','$filter','topAlert','$modal','sendSmsType',
        function($scope,breadcrumb,tmsPagination,smsRecord,areaCode,hallName,agentModule,sendSmsStatus,goBackData,pinCodeModal,$filter,topAlert,$modal,sendSmsType){
            breadcrumb.items = [
                {"name":"短信記錄","active":true}
            ];
            //部門
            /*departMent.query().$promise.then(function(departMents){
                $scope.departMents = departMents;
            });*/
            $scope.sendSmsType = sendSmsType;
            $scope.sendSmsStatus = sendSmsStatus;
            $scope.areacodes = areaCode.query(); //地區
            $scope.halls = hallName.query({hall_type:"|1"});//廳館
            $scope.agentModules = agentModule.query();//模組
            var now_date = $filter('date')(new Date(),'yyyy-MM');

            //定義短信記錄變量
            var original;
            var init_record = {
                sms_tel: "",
                sms_area:"",
                hall_id: "",
                agent_code:"",
                create_time:["",""],
                status: "",
                //module_id:"",
                type: "",
                sequence_id: "",
                year_month: now_date
            }
            original = angular.copy(init_record);
            $scope.condition = angular.copy(init_record);
            $scope.condition = goBackData.get('condition',$scope.condition);
            $scope.smsRecords = [];
//
            //初始化數據
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = smsRecord;
            $scope.select = function(page){

                var condition = angular.copy($scope.condition);
                if($scope.condition.sms_area){
                    condition.sms_area = "!"+$scope.condition.sms_area.substr(1);
                }
                if($scope.condition.year_month){
                    condition.year_month = $filter('date')($scope.condition.year_month, 'yyyy-MM');
                }
                //delete condition.year_month;

                condition.create_time[0] = $filter('date')($scope.condition.create_time[0], 'yyyy-MM-dd');
                condition.create_time[1] = $filter('date')($scope.condition.create_time[1], 'yyyy-MM-dd');
                goBackData.set('condition',condition);
                $scope.pagination.select(page,condition).$promise.then(function(_smsRecords){
                    $scope.smsRecords = _smsRecords;
                });
            }
            $scope.select();
            //搜索方法
            $scope.search = function(){
                $scope.select();
            }

            $scope.reset = function(){
                $scope.condition = angular.copy(original);
                $scope.select();
            }

            //發送普通短信
            $scope.sms_agent= {
                "sms_type":"",
                "department_id":"",
                "priority":"",
                "is_sys":"",
                "content":"",
                "phoneNumbers":[{
                        "agent_code":"",
                        "agent_name":"",
                        "area_code":"",
                        "telephone_number":""
                }]
            }
            //發送戶組短信
            $scope.sms_agent= {
                "sms_type":"",
                "department_id":"",
                "priority":"",
                "is_sys":"",
                "content":"",
                "phoneNumbers":[{
                    "agent_code":"",
                    "agent_name":"",
                    "area_code":"",
                    "telephone_number":""
                }]
            }
            //短訊詳細
            $scope.detailSms = function(smsRecord){
                $modal.open({
                    templateUrl: "views/sms-manager/sms-record-detail.html",
                    controller: 'smsRecordDetailCtrl',
                    resolve: {
                        smsRecord:function(){
                            return smsRecord;
                        }
                    }
                });
            }

            //發送SMS
            $scope.sendSms = function(sms_record){
                $scope.sms_agent_copy = angular.copy($scope.sms_agent);
                $scope.sms_agent_copy.sms_type = sms_record.sms_type;
                $scope.sms_agent_copy.department_id = sms_record.department_id;
                $scope.sms_agent_copy.priority = sms_record.priority;
                $scope.sms_agent_copy.type = sms_record.type;
                $scope.sms_agent_copy.is_sys = sms_record.is_sys;
                $scope.sms_agent_copy.sequence_id = sms_record.sequence_id,
                $scope.sms_agent_copy.content = sms_record.content;
                $scope.sms_agent_copy.phoneNumbers.splice(0,1,{
                    "agent_code": sms_record.agent_code,
                    "agent_name": sms_record.agent_name,
                    "area_code": sms_record.sms_area,
                    "telephone_number": sms_record.sms_tel
                });
                pinCodeModal(smsRecord, 'reSend', $scope.sms_agent_copy, '發送成功！').then(function () {
                    $scope.select();
                })

            }

        }]).controller('smsRecordDetailCtrl',['$scope','smsRecord','sendSmsStatus','$modalInstance',
            function($scope,smsRecord,sendSmsStatus,$modalInstance){
                $scope.smsRecord = smsRecord;
                $scope.sendSmsStatus = sendSmsStatus;
                //關閉
                $scope.cancel = function(){
                    $modalInstance.close('');
                }
    }]).controller('smsFlowCountCtrl',['$scope','breadcrumb','tmsPagination','smsRecord','hallName','departMent','goBackData','$filter','topAlert',
        function($scope,breadcrumb,tmsPagination,smsRecord,hallName,departMent,goBackData,$filter,topAlert){
            breadcrumb.items = [
                {"name":"短信流量統計","active":true}
            ];
            $scope.departMents = departMent.query();//部門
            $scope.halls = hallName.query({hall_type:"|1"});//廳館

            //定義短信記錄變量
            var original;
            var init_flow = {
                hall_id: "",
                date:["",""],
                department_id: ""
            }
            original = angular.copy(init_flow);
            $scope.condition = angular.copy(init_flow);
            $scope.condition = goBackData.get('condition',$scope.condition);
            $scope.smsFlowCounts = [];
//
            //初始化數據
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = smsRecord;
            $scope.pagination.query_method = "smsTotal";
            $scope.select = function(page){
                var condition = angular.copy($scope.condition);
                condition.date[0] = $filter('date')($scope.condition.date[0], 'yyyy-MM');
                condition.date[1] = $filter('date')($scope.condition.date[1], 'yyyy-MM');
                goBackData.set('condition',condition);
                $scope.pagination.select(page,condition).$promise.then(function(_smsFlowCounts){
                    $scope.smsFlowCounts = _smsFlowCounts;
                });
            }
            $scope.select();
            //搜索方法
            $scope.search = function(){
                $scope.select();
            }
//            //重置存卡數據
            $scope.reset = function(){
                $scope.condition = angular.copy(original);
                $scope.select();
            }

        }]);
}).call(this);

