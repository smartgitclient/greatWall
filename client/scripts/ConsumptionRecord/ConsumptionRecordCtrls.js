(function() {
    'use strict';
    angular.module('app.consumption-record.ctrls', ['app.consumption-record.services','app.consumption-record.json']).controller('consumptionRecordCheckCtrls',[
        '$scope','$filter','$location','$modal','breadcrumb','page','search','hall',function($scope,$filter,$location,$modal,breadcrumb,page,search,hall){
            breadcrumb.items = [
                {"name":"消費單核對","active":true}
            ];
            hall.query().$promise.then(function(halls){
                $scope.halls = _.pluck(halls,'hall_name');
            });

            $scope.update = function(){
                $location.path('/consumption-record/consumption-record-edit/');
            }

            $scope.check = function(title){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/consumption-record/consumption-record-shift.html",
                    controller: 'consumptionRecordShiftCtrls',
                    resolve: {
                        title:function(){
                            return title;
                        }
                    }
                });
            }

    }]).controller('consumptionRecordShiftCtrls',['$scope','$modalInstance','breadcrumb','title',function($scope,$modalInstance,breadcrumb,title){
        $scope.title = title;
        $scope.submit  =function(){
            $modalInstance.close();
        }

    }]).controller('consumptionRecordEditCtrls',['$scope','$location','breadcrumb','hall',function($scope,$location,breadcrumb,hall){
        breadcrumb.items = [
            {"name":"消費單核對","active":true}
        ];
        hall.query().$promise.then(function(halls){
            $scope.halls = _.pluck(halls,'hall_name');
        });
        $scope.edit = function(){
            $location.path('/consumption-record/consumption-record-check/');
        }

    }]).controller('settlementTypeCtrls',['$scope', '$location', 'breadcrumb', 'tmsPagination', 'agentType', 'pinCodeModal', 'agentsLists', 'settlementType', function($scope, $location, breadcrumb, tmsPagination, agentType, pinCodeModal, agentsLists, settlementType){
        breadcrumb.items = [
            {"name":"結算方式管理","active":true}
        ];

        $scope.settlementTypes = settlementType.items;
        $scope.agentTypes = agentType.items;
        $scope.agent_lists = [];
        var condition_init = {
            agent_code : "",
            agentMaster : {
                agent_contact_name : ""
            },
            type : "",
            settlement_type : ""
        };
        $scope.condition = angular.copy(condition_init);

        $scope.page = tmsPagination.create();
        $scope.page.resource = agentsLists;
        $scope.search = function(page)
        {
            var condition = angular.copy($scope.condition);
            if(condition.agent_code)
            {
                condition.agent_code += '!';
            }
            if(condition.agentMaster.agent_contact_name)
            {
                condition.agentMaster.agent_contact_name += '!';
            }

            $scope.agent_lists = $scope.page.select(page, condition);
        }
        $scope.search();

        $scope.reset = function()
        {
            $scope.condition = angular.copy(condition_init);
            $scope.search();
        }

        $scope.edit = function(agent)
        {
            agent.old_settlement_type = agent.settlement_type;
            agent.updated = true;
        }

        $scope.save = function(agent)
        {
            if(agent.disabled) { return ; }
            agent.disabled = true;
            var params = {id: agent.id, settlement_type : agent.settlement_type};
            pinCodeModal(agentsLists, 'updateSettlementType', params, '修改成功！').then(function () {
                agent.updated = false;
                agent.disabled = false;
            }, function()
            {
                agent.disabled = false;
            })
        }

        $scope.cancel = function(agent)
        {
            agent.settlement_type = agent.old_settlement_type;
            agent.updated = false;
        }

    }]).controller('integralSmsCtrl',['$scope','$location','$modal','breadcrumb','globalFunction', 'agentIntegral', 'topAlert', 'agentsLists', 'areaCode', '$filter', '$stateParams','smsGroup','smsRecord','pinCodeModal',
        function($scope,$location,$modal,breadcrumb,globalFunction, agentIntegral, topAlert, agentsLists, areaCode, $filter,$stateParams,smsGroup,smsRecord,pinCodeModal){
            breadcrumb.items = [
                {"name":"積分到期提醒","active":true}
            ];

        //發送短信
        var init_record = {
            "pin_code":"",
            "sms_type":"1",
            "priority":"1",
            "is_sys":"0",
            "content":"",
            "type": 41,
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
        $scope.checked = [];

        $scope.integral = {
            checked_all : "",
            agent_code : "",
            agent_group_name:"",
            sort:"agent_code NUMASC"
        }
        $scope.integral_agent_lists = [];
        $scope.search = function()
        {
            var integral = angular.copy($scope.integral);
            delete integral.checked_all;
            agentIntegral.getIntegralAgent(integral).$promise.then(function(data)
            {
                $scope.integral_agent_lists = data;
            })
        }
        $scope.search();

        if($stateParams.agent_code){
            $scope.integral.agent_code = $stateParams.agent_code;
        }

        /*$scope.active_code = "";

        $scope.selectSendSMS = function(agent)
        {
            $scope.active_code = agent.agent_code;
            $scope.sms_lists = agentIntegral.getIntegralDetail({agent_info_id : agent.id});
        }*/

        //全選
        $scope.checkedAll = function()
        {
            if($scope.integral.checked_all)
            {
                _.each($scope.integral_agent_lists, function($that, $key)
                {
                    $scope.integral_agent_lists[$key].checked = true;
                    $scope.checked.push($that.id);
                })
            }
            else
            {
                $scope.checked = [];
                _.each($scope.integral_agent_lists, function($that, $key)
                {
                    $scope.integral_agent_lists[$key].checked = false;
                })
            }
        }

        $scope.checkedOne = function(agent)
        {
            if(agent.checked)
            {
                if(-1 != _.indexOf($scope.checked, agent.id))
                {
                }
                else
                {
                    $scope.checked.push(agent.id);
                }
            }
            else
            {
                var index = _.indexOf($scope.checked, agent.id);
                if(-1 != index)
                {
                    $scope.checked.splice(index, 1);
                }
            }
        }

        $scope.agentSmsNotice = [];
        var init_multi_record = {
            type_code: "INTEGRALTERM",
            agents: []
        }
        $scope.multiRecord = angular.copy(init_multi_record);
        $scope.sendSMS = function(){
            var integral_agent_lists_len = _.where($scope.integral_agent_lists,{checked:true});
            $scope.agents_sms_content = [];
            _.each(integral_agent_lists_len,function(em){
                $scope.agents_sms_content.push({
                    agent_info_id: em.id,
                    recordIDs: em.sms_id ? em.sms_id : []
                });
            });
            $scope.multiRecord.agents = $scope.agents_sms_content;

            if(integral_agent_lists_len.length>0){
                pinCodeModal(smsRecord, 'multiSms' , $scope.multiRecord, '發送成功').then(function(){
                    $scope.agents_sms_content = [];
                    $scope.multiRecord = angular.copy(init_multi_record);
                    _.each(integral_agent_lists_len,function(em){
                        em.checked = false;
                    });
                });
            }else{
                topAlert.warning("請選擇戶口")
            }
        }

        //添加號碼
        /*$scope.sendTels_new = [];
        $scope.add_tel = function(){
            $scope.sendTels_new['key_'+$scope.agent_info_id].push({
                agent_contact_name: "",
                area_code: "",
                phone_number: ""
            });
        }

        //刪除號碼
        $scope.del_tel = function($index){
            $scope.sendTels_new['key_'+$scope.agent_info_id].splice($index,1);
        }

        $scope.remove = function($index){
            $scope.sendTels['key_'+$scope.agent_info_id].splice($index,1);
            //$scope.expiredMarker.sendTels.splice($index,1);
        }*/

        //選擇發送的內容
        //$scope.sendTels = {};
        $scope.sms_content = [];
        //$scope.sms_lists = [];
        $scope.selectSendSMS = function(agent){
            $scope.agent = agent;
            $scope.agent_info_id = agent.id;
            $scope.agent_code = agent.agent_code;
            if($scope.agent.sms_id){
                $scope.agentSmsNotice = angular.copy($scope.agentSmsNotice_local['key_'+$scope.agent_info_id]); // = $scope.sendTels['key_'+$scope.agent_info_id]
                //$scope.sendTels_new['key_'+$scope.agent_info_id];
                $scope.tel_content = angular.copy($scope.tel_content_local['key_'+$scope.agent_info_id]);
                $scope.record_create.content = angular.copy($scope.sms_content_local['key_' + $scope.agent_info_id]);// $scope.sendContent(_expiredMarker);
                $scope.selected_group_content = angular.copy($scope.selected_group_content_local['key_'+$scope.agent_info_id]);

            }else{
               /* agentsLists.agentSmsNotice({agent_info_id: agent.id, type_code:'INTEGRALTERM'/*, is_master : 1})
                    .$promise.then(function(phoneNumbers){
                        agentIntegral.getIntegralDetail({agent_info_id : agent.id})
                            .$promise.then(function(smsdate){
                                $scope.record_create.content = $scope.sendContent(smsdate);
                                $scope.agentSmsNotice = phoneNumbers;
                                $scope.tel_content = [];

                            });
                    });*/


                //發送戶組自己
               /* agentsLists.get(globalFunction.generateUrlParams({id: agent.id}, {refTelAgentMasterNoticeType: {agentContactTel: ''}}))
                    .$promise.then(function (agent) {
                        if (agent) {
                            $scope.agentSmsNotice = [];
                            if (agent.refTelAgentMasterNoticeType.length > 0) {
                                _.each(agent.refTelAgentMasterNoticeType, function (_tel) {
                                    $scope.agentSmsNotice.push({agent_code: agent.agent_code, agent_name: agent.agent_name, area_code:_tel.agentContactTel.area_code, telephone_number:  _tel.agentContactTel.telephone_number});
                                });
                            }
                        }
                    });*/
                $scope.cancel();
                //發送戶組自己
                agentsLists.agentSmsNotice({agent_info_id: agent.id, is_master : 1})
                    .$promise.then(function(phoneNumbers){
                        $scope.agentSmsNotice = phoneNumbers;
                        //$scope.agentSmsNotice.push({agent_code: agent.agent_code, agent_name: agent.agent_name, area_code:_tel.agentContactTel.area_code, telephone_number:  _tel.agentContactTel.telephone_number});
                    });

                agentIntegral.getIntegralDetail({agent_info_id : agent.id})
                    .$promise.then(function(smsdate){
                        $scope.record_create.content = $scope.sendContent(smsdate);
                        $scope.tel_content = [];
                    });
            }

        }

        //預覽
        $scope.sendContent = function(sms_lists){
            var date = $filter('date')(new Date(), 'yyyy年MM月');
            $scope.isReadonly = true;
            var sms_content = "";

            sms_content = "【長城溫馨提示】\n";
            sms_content += "閣下戶口"+$scope.agent.agent_code+"("+$scope.agent.agent_contact_name+")"+"截至"+date+"累計津貼明細\n如下\n";
            _.each(sms_lists,function(sms, index){
                var name = sms.integral_name ? sms.integral_name : "";
                var amount = Number(sms.integral_amount) * 10000;
                if(amount)
                {
                    sms_content += name + '累計津貼 $'+ $filter('parseYuan')(amount) +' 將於 '+ sms.expired_month +' 到期，\n';
                }

            });
            sms_content+="(如有錯漏，以本系統資料為準)\n\n";
//            sms_content+="如需查詢可致電鉅星服務部：28755775/28786117。\n";
//            sms_content+="鉅星24小時尊貴客戶熱缐：+853 6205 5555\n";
            sms_content+="長城禮賓部24小時服務專缐：+853 6205 5555\n";

            return sms_content;
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
        /*$scope.cancel = function(){
            $scope.isReadonly = true;
            agentsLists.agentSmsNotice({agent_info_id: $scope.agent_info_id,type_code:'INTEGRALTERM'})
                .$promise.then(function(phoneNumbers){
                    $scope.sendTels['key_'+$scope.agent_info_id] = phoneNumbers;
                    $scope.sendTels_new['key_'+$scope.agent_info_id] = [{agent_contact_name: "", area_code: "", telephone_number: ""}];
                    //發送的內容
                    $scope.sms_content['key_' + $scope.agent_info_id] = $scope.sendContent();
                });
        }*/

        //預覽
       /* $scope.sms_content = "";
//        $scope.model1 = false;
//        $scope.model2 = false;
        $scope.view = function(id){
            $scope["model"+id] = !$scope["model"+id];

            if(id==1){
                $scope.sms_content = "\n鉅星集團溫馨提示:\n"+
                "閣下戶口F8吳越截至2014年6月份累計津貼明細如下:\n"+
                "永利多金累計津貼$2000將於2014-04-29到期，\n"+
                "永利鉅星累計津貼$1000將於2014-04-30到期，\n"+
                "外館積分累計津貼$1000將於2014-04-29到期，\n"+
                "永利多金累計津貼$2000將於2014-05-31到期，\n"+
                "永利鉅星累計津貼$200將於2014-05-30到期，	\n"+
                "外館積分累計津貼$200將於2014-05-30到期，\n"+
                "短訊如有錯漏,以系統資料為準.\n"+
                "如需查詢可致電鉅星服務部:28755775/28786117";
            }else if(id==2){
                $scope.sms_content = "\n閣下戶口FV8吳越截至2014年6月份累計津貼明細如下:\n"	+
                    "永利多金累計津貼$500將於2014-04-29到期，\n"+
                    "永利鉅星累計津貼$1000將於2014-04-30到期，\n"	+
                    "外館積分累計津貼$200將於2014-04-29到期，\n"+
                    "永利多金累計津貼$2000將於2014-05-31到期，\n"+
                    "永利鉅星累計津貼$200將於2014-05-30到期，\n"+
                    "外館積分累計津貼$200將於2014-05-30到期，\n"+
                    "短訊如有錯漏,以系統資料為準.";

            }

        }*/

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
                //var groups_data = _.findWhere($scope.sms_groups, {id: record.id});
                var cancel_group = _.where($scope.tel_content , {sms_group_id: record.id});
                /*if (groups_data) {
                    groups_data.is_selected = false;
                }*/
                $scope.selected_group_content.splice(index, 1);
                $scope.tel_content = _.difference($scope.tel_content, cancel_group);
            }

            //通過戶口查詢
           /* $scope.isHiddenCode = false;
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
                    smsRecord.smsDraft($scope.record_create).$promise.then(function (result) {
                        topAlert.success('草稿保存成功');
                        //本地保存草稿
                        $scope.agent.sms_id = result.id;
                        $scope.localSaveSMS();
                        //$scope.cancel();
                        $scope.isDisabled = false;
                        $scope.isReadonly = true;
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

    }]).controller('sendIntegralSmsCtrls',['$scope','$location','$modalInstance',function($scope,$location,$modalInstance){
        $scope.send =function(){
            $modalInstance.close();
            alert('發送成功');
        }
        $scope.cancel =function(){
            $modalInstance.close();
        }
        $scope.edit =function(){
            $modalInstance.close();
        }

    }]).controller('consumptionRecordCtrl', ['$scope','globalFunction', '$modal', 'consumptionMiscellaneous', 'windowItems', 'pinCodeModal', 'topAlert', 'idcardType', 'hallName', 'tmsPagination', 'agentsLists', 'breadcrumb', 'consumptionPaytype', 'bookingState', 'consumption', 'consumptionType', '$location', '$filter', 'flightType', 'carType', 'ticketType', 'currentShift', 'goBackData', '$stateParams','uiGridOptions',
        function($scope, globalFunction, $modal, consumptionMiscellaneous, windowItems, pinCodeModal, topAlert, idcardType, hallName, tmsPagination, agentsLists, breadcrumb, consumptionPaytype, bookingState, consumption, consumptionType, $location, $filter, flightType, carType, ticketType, currentShift, goBackData, $stateParams,uiGridOptions)
        {
            //$scope.halls = hallName.query();
            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function(that){ return that.hall_type != 1; });
            //$scope.pay_types = consumptionPaytype.query();
            $scope.pay_types = [];
            consumptionPaytype.query().$promise.then(function(data)// 支付方式
            {
                _.each(data, function($that, $key){
                    if('COMMISSION' == $that.pay_type_code  || 'COMSUMPTION' == $that.pay_type_code ){
                        $scope.pay_types.push($that);
                    }
                })
            });
            //$scope.hotelTravels = consumptionHoteltravel.query();
            $scope.consumptionTypes = consumptionType.query();
            $scope.bookingState_items = bookingState.items;

            //$scope.flightType_items = flightType.items;
            //$scope.idCardtypes = idcardType.query();
            //$scope.car_types = carType.query();
            //$scope.ticket_types = ticketType.query();

            breadcrumb.items = [
                {"name":"消費記錄","active":true}
            ];
            var condition_base = {
                consumption_no : "",
                consumption_type_id : "",
                hall_id : "",
                agent_code : $stateParams.agent_code || "",
                agent_group_name:'',
                agentMaster : {
                    agent_contact_name : ""
                },
                /*shiftMark : {
                    shift_date : ["", ""]
                },*/
                room_no:"",
                shift_date : ["", ""],
                year_month : "",
                search_type : "0",
                pay_type_id : "",
                book_no:"",
                trader : "",
                book_time : ['', ''],
                checkin_datetime:"",
                checkout_datetime:"",
                remark:"",//备注
                sort:'book_time DESC'
            }
            if(currentShift.data && currentShift.data.year_month){
                condition_base.year_month = currentShift.data.year_month;
            }
            /*if(currentShift.data && currentShift.data.shift_date){
                condition_base.shift_date = currentShift.data.shift_date;
            }*/
            $scope.condition = angular.copy(condition_base);
            $scope.condition = goBackData.get('condition',$scope.condition);
            $scope.condition.year_month = $scope.condition.year_month ? $filter('date')($scope.condition.year_month, 'yyyy-MM') : "";

            $scope.excel_condition = angular.copy(condition_base);
            $scope.page = tmsPagination.create();
            $scope.page.resource = consumption;
            $scope.page.query_method = 'get-consumption-record';
            $scope.bookings = [];
            $scope.consumption_total = {};
            //查询按钮
            $scope.search_type_submit = "";


            $scope.abc=function(a)
            {
            }
            $scope.$watch('consumptions[0]',function()
            {

                angular.forEach($scope.consumptions, function(data,index,array)
                {

                    $scope.consumptions[index].status1=$scope.bookingState_items[data.status]
                });
            })
            $scope.gridOptions1 = uiGridOptions.create($scope,{
                data:"consumptions",
                pagination:$scope.page,
                paginationPageSize:10,
                buttonColumn:{
                    width:200,
                    buttons:[
                        {
                            title:"修改",
                            class:"btn  btn-information btn-table margin-right-5",
                            click:"update(consumption.consumption_type_id, consumption.id)",
                            checkPermissions:"consumptionRecordUpdate"
                        },
                        {
                            title:"删除",
                            class:"btn  btn-information btn-table",
                            isShow:'0 == row.entity.status',
                            checkPermissions:"consumptionRecordDelete"
                        }

                    ]
                },
                rowHeight:42,
                headerRowHeight:42,
                minRowsToShow:10,
                columnDefs: [
                    {name:"agent_code",field:'agent_code', displayName:'操作',width:145},
                    {name:"book_no",field:'book_no', displayName:'預訂單號',width:145},
                    {name:"hall_name",field:'hall_name', displayName:'廳館',width:145},
                    {name:"agent_code",field:'agent_code', displayName:'戶口編號',width:145},
                    {name:"agent_contact_name",field:'agent_contact_name', displayName:'戶口姓名',width:145},
                    {name:"trader",field:'agent_code', trader:'客人姓名',width:145},
                    {name:"consumption_type",field:'consumption_type', displayName:'消費類型',width:145},
                    {name:"consumption_content",field:'consumption_content', displayName:'消費內容',width:145},
                    {name:"cost_total",field:'cost_total', displayName:'成本',width:145,cellFilter:"parseTenThousandToYuan"},
                    {name:"sell_total",field:'sell_total', displayName:'實收',width:145,cellFilter:'parseTenThousandToYuan'},
                    {name:"profit",field:'profit', displayName:'收益',width:145,cellFilter:'parseTenThousandToYuan'},
                    {name:"should_pay",field:'should_pay', displayName:'應付消費',width:145,cellFilter:'parseTenThousandToYuan'},
                    {name:"pay_type_name",field:'pay_type_name', displayName:'付款方式',width:145},
                    {name:"remark",field:'remark', displayName:'備註',width:145},
                    {name:"book_time",field:'book_time', displayName:'新增時間',width:145,cellFilter:'limitTo : 16'},
                    {name:"year_month",field:'year_month', displayName:'年月',width:145,cellFilter:'limitTo : 7'},
                    {name:"shift_date",field:'shift_date', displayName:'結算日期',width:145,cellFilter:'limitTo : 11'},
                    {name:"shift",field:'shift', displayName:'更數',width:145},
                    {name:"agent_code",field:'agent_code', displayName:'狀態',width:145},
                    {name:"user_name",field:'user_name', displayName:'經手人',width:145}
                ]
            });

            $scope.gridOptions2 = uiGridOptions.create($scope,{
                data:"consumptions",
                pagination:$scope.page,
                paginationPageSize:10,
                condition:"",
                buttonColumn:{
                    width:200,
                    buttons:[
                        {
                            title:"詳細",
                            class:"btn  btn-information btn-table margin-right-5",
                            isShow:"grid.appScope.bookingState_items[row.entity.status]=='已結算'",
                            click:"detail(row.entity.consumption_type_id, row.entity.id)"
                        },
                        {
                            title:"修改",
                            class:"btn  btn-information btn-table margin-right-5",
                            isShow:"grid.appScope.bookingState_items[row.entity.status]!='已結算'",
                            click:"update(row.entity.consumption_type_id, row.entity.id)",
                            checkPermissions:"consumptionRecordUpdate"
                        },
                        {
                            title:"删除",
                            class:"btn  btn-information btn-table",
                            isShow:"0 == row.entity.status",
                            click:"delete(row.entity.id)",
                            checkPermissions:"consumptionRecordDelete"
                        }

                    ]
                },
                rowHeight:42,
                headerRowHeight:42,
                minRowsToShow:10,
                columnDefs: [
                    {name:"book_no",field:'book_no', displayName:'預訂單號',width:145,enableSorting: true},
                    {name:"hall_name",field:'hall_name', displayName:'廳館',width:145,enableSorting: false},
                    {name:"agent_code",field:'agent_code', displayName:'戶口編號',width:145,enableSorting: true},
                    {name:"agent_contact_name",field:'agent_contact_name', displayName:'戶口姓名',width:145,enableSorting: false},
                    {name:"trader",field:'trader', displayName:'客人姓名',width:145,enableSorting: false},
                    {name:"room_no",field:'room_no', displayName:'房間號碼',width:145,enableSorting: false},
                    {name:"consumption_type",field:'consumption_type', displayName:'消費類型',width:145,enableSorting: false},
                    {name:"consumption_content",field:'consumption_content', displayName:'消費內容',width:145,enableSorting: false},
                    {name:"cost_total",field:'cost_total', displayName:'成本',width:145,cellFilter:"parseTenThousandToYuan",enableSorting: false},
                    {name:"sell_total",field:'sell_total', displayName:'實收',width:145,cellFilter:'parseTenThousandToYuan',enableSorting: false},
                    {name:"profit",field:'profit', displayName:'收益',width:145,cellFilter:'parseTenThousandToYuan',enableSorting: false},
                    {name:"should_pay",field:'should_pay', displayName:'應付消費',width:145,cellFilter:'parseTenThousandToYuan',enableSorting: false},
                    {name:"room_pay",field:'room_pay', displayName:'房間消費',cellFilter:'parseTenThousandToYuan',width:145,enableSorting: false},
                    {name:"pay_type_name",field:'pay_type_name', displayName:'付款方式',width:145,enableSorting: false},
                    {name:"remark",field:'remark', displayName:'備註',width:145,enableSorting: false},
                    {name:"checkin_datetime",field:'checkin_datetime', displayName:'入住日期',width:145,cellFilter:'limitTo : 11',enableSorting: false},
                    {name:"checkout_datetime",field:'checkout_datetime', displayName:'退房日期',width:145,cellFilter:'limitTo : 11',enableSorting: false},
                    {name:"book_time",field:'book_time', displayName:'新增時間',width:145,cellFilter:'limitTo : 16',enableSorting: false},
                    {name:"year_month",field:'year_month', displayName:'年月',width:145,cellFilter:'limitTo : 7',enableSorting: false},
                    {name:"shift_date",field:'shift_date', displayName:'結算日期',width:145,cellFilter:'limitTo : 11',enableSorting: true},
                    {name:"shift",field:'shift', displayName:'更數',width:145,enableSorting: false},
                    { name:'status', field:'status1',displayName: '狀態', width: 100,enableSorting: false},
                    {name:"user_name",field:'user_name', displayName:'經手人',width:145,enableSorting: false}
                ]
            });
            $scope.search = function(page)
            {
                var condition_copy = angular.copy($scope.condition);
                $scope.search_type_submit = condition_copy.search_type;
                var remark=angular.copy($scope.condition.remark);
                //if($scope.condition.remark){
                //    condition_copy.remark="!"+$scope.condition.remark+"!";
                //}
                goBackData.set('condition', $scope.condition);
                if(condition_copy.book_time[0])
                {
                    condition_copy.book_time[0] = $filter('date')(condition_copy.book_time[0], 'yyyy-MM-dd');
                }else{
                    condition_copy.book_time[0] = '';
                }
                if(condition_copy.book_time[1])
                {
                    condition_copy.book_time[1] = $filter('date')(condition_copy.book_time[1], 'yyyy-MM-dd');
                }else{
                    condition_copy.book_time[1] = '';
                }
                /*if(condition_copy.shiftMark.shift_date[0])
                {
                    condition_copy.shiftMark.shift_date[0] = $filter('date')(condition_copy.shiftMark.shift_date[0], 'yyyy-MM-dd');
                }
                if(condition_copy.shiftMark.shift_date[1])
                {
                    condition_copy.shiftMark.shift_date[1] = $filter('date')(condition_copy.shiftMark.shift_date[1], 'yyyy-MM-dd');
                }*/
                condition_copy.year_month = condition_copy.year_month ? $filter('date')(condition_copy.year_month, 'yyyy-MM') : "";
                condition_copy.shift_date[0] = condition_copy.shift_date[0] ? $filter('date')(condition_copy.shift_date[0], 'yyyy-MM-dd') : "";
                condition_copy.shift_date[1] = condition_copy.shift_date[1] ? $filter('date')(condition_copy.shift_date[1], 'yyyy-MM-dd') : "";
                condition_copy.checkin_datetime = condition_copy.checkin_datetime ? $filter('date')(condition_copy.checkin_datetime, 'yyyy-MM-dd') : "";
                condition_copy.checkout_datetime = condition_copy.checkout_datetime ? $filter('date')(condition_copy.checkout_datetime, 'yyyy-MM-dd') : "";
                condition_copy.pay_type_id = condition_copy.pay_type_id == null ? "" : condition_copy.pay_type_id ;
                $scope.excel_condition = angular.copy(condition_copy);
                $scope.excel_condition.remark = remark;
                condition_copy.year_month = condition_copy.year_month?condition_copy.year_month+"-01":"";
                delete condition_copy.agentMaster;
                //$scope.condition_copy = addSearchCode(condition_copy, true);
               // $scope.consumptions = $scope.page.select(page, condition_copy, {});
                $scope.consumption_total = consumption.getConsumptionTotal(globalFunction.generateUrlParams(condition_copy));
                $scope.gridOptions2.condition=condition_copy
                $scope.gridOptions2.initialization()
                $scope.gridOptions2.paginationCurrentPage=1

            }
            $scope.search();

            //重置按钮
            $scope.reset = function()
            {
                $scope.condition = angular.copy(condition_base);
                $scope.search();
            }

            $scope.delete = function(id)
            {
                windowItems.confirm('系統提示','確定刪除該條消費單嗎？',function() {
                    pinCodeModal(consumption, 'delete', {id: id}, '刪除成功！').then(function () {
                        $scope.search();
                    })
                });
            }

            // 户口编号
            $scope.$watch('condition.agent_code', globalFunction.debounce(function(new_value, old_value)
            {
                $scope.condition.agentMaster.agent_contact_name = "";
                if(new_value)
                {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code : new_value}, {})).$promise.then(function (agent)
                    {
                        if(agent.length > 0){
                            $scope.condition.agentMaster.agent_contact_name = agent[0].agent_name;
                        }
                    });
                }
            }));

            $scope.booking_detail = null;
            var template_url = {
                'HOTEL' : '/consumption-manager/consumption-manager/hotel/consumption-hotel-booking-detail/',
                'FOODCOUPON' : '/consumption-manager/consumption-manager/food/consumption-food-fly-booking-detail/',
                'HELICOPTER' :'/consumption-manager/consumption-manager/helicopter/consumption-helicopter-booking-detail/',
                'BOAT' :'/consumption-manager/consumption-manager/ship/consumption-ship-ticket-booking-detail/',
                'CAR' :'/consumption-manager/consumption-manager/car/consumption-car-booking-detail/',
                'FLIGHT' : '/consumption-manager/consumption-manager/air/consumption-air-booking-detail/',
                'TICKET' : '/consumption-manager/consumption-manager/ticket/consumption-admission-ticket-booking-detail/',
                'MISCELLANEOUS' : '/consumption-manager/consumption-manager/other/consumption-other-booking-detail/'
            }
            $scope.detail = function(consumption_type_id, consumption_id)
            {
                var type_obj = _.findWhere($scope.consumptionTypes, {id : consumption_type_id});
                if(!type_obj)
                {
                    topAlert.warning('無效的消費類型');
                    return false;
                }

                var t_url = template_url[type_obj.consumption_code];
                $location.path(t_url+consumption_id);


            }

            var template_update = {
                'HOTEL' : ['views/consumption-manager/consumption-hotel-booking-update.html','consumptionManagerUpdateCtrls'],
                'FOODCOUPON' : ['views/consumption-manager/consumption-food-fly-booking-update.html','consumptionFoodFlyBookingUpdateCtrls'],
                'HELICOPTER' :['views/consumption-manager/consumption-helicopter-booking-update.html','consumptionHelicopterBookingUpdateCtrls'],
                'BOAT' :['views/consumption-manager/consumption-ship-ticket-booking-update.html','consumptionShipTicketBookingUpdateCtrls'],
                'CAR' :['views/consumption-manager/consumption-car-booking-update.html','consumptionCarBookingUpdateCtrls'],
                'FLIGHT' : ['views/consumption-manager/consumption-air-booking-update.html','consumptionAirBookingUpdateCtrls'],
                'TICKET' : ['views/consumption-manager/consumption-admission-ticket-booking-update.html','consumptionTicketBookingUpdateCtrls'],
                'MISCELLANEOUS' :['views/consumption-manager/consumption-other-booking-update.html','consumptionOtherBookingUpdateCtrls']
            }
            $scope.update = function(consumption_type_id, consumption_id)
            {
                var type_obj = _.findWhere($scope.consumptionTypes, {id : consumption_type_id});
                if(!type_obj)
                {
                    topAlert.warning('無效的消費類型');
                    return false;
                }

               var t_url = template_update[type_obj.consumption_code][0];
               var t_ctr = template_update[type_obj.consumption_code][1];

                $stateParams.id=consumption_id
                var modalInstance;
                modalInstance = $modal.open({
                    controller:t_ctr,
                    templateUrl: t_url
                });
                modalInstance.result.then((function(status) {
                    if(status){
                        $scope.search();
                    }
                }));
            }
            var template_url = {
                'HOTEL' : '/consumption-manager/consumption-manager/hotel/consumption-hotel-booking-detail/',
                'FOODCOUPON' : '/consumption-manager/consumption-manager/food/consumption-food-fly-booking-detail/',
                'HELICOPTER' :'/consumption-manager/consumption-manager/helicopter/consumption-helicopter-booking-detail/',
                'BOAT' :'/consumption-manager/consumption-manager/ship/consumption-ship-ticket-booking-detail/',
                'CAR' :'/consumption-manager/consumption-manager/car/consumption-car-booking-detail/',
                'FLIGHT' : '/consumption-manager/consumption-manager/air/consumption-air-booking-detail/',
                'TICKET' : '/consumption-manager/consumption-manager/ticket/consumption-admission-ticket-booking-detail/',
                'MISCELLANEOUS' : '/consumption-manager/consumption-manager/other/consumption-other-booking-detail/'
            }
            $scope.detail = function(consumption_type_id, consumption_id)
            {
                var type_obj = _.findWhere($scope.consumptionTypes, {id : consumption_type_id});
                if(!type_obj)
                {
                    topAlert.warning('無效的消費類型');
                    return false;
                }
                var t_url = template_url[type_obj.consumption_code];
                $location.path(t_url+consumption_id);
                $stateParams.id=consumption_id

            }





    }])
}).call(this);
