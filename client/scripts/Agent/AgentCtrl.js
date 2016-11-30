(function() {
    'use strict';
    angular.module('app.agent.ctrls', ['app.agent.services']).controller('agentSearchCtrl',['$scope','$filter','$location','agentsLists','globalFunction','departmentType','topAlert','$modal','$state','$stateParams','currentShift','getDate','user','hallName',
        function($scope,$filter,$location,agentsLists,globalFunction,departmentType,topAlert,$modal,$state,$stateParams,currentShift,getDate,user,hallName){
            $scope.condition = {
                year_month:[]
            }

            //var init = function(){
            //
            //    //$scope.$apply();
            //}
            //init();
            //戶口速查方法
            $scope.search=function(){
                $scope.condition.year_month[0] = $filter('date')($scope.condition.year_month[0], 'yyyy-MM');
                //$scope.condition.year_month[0]=$filter("parseDate")(getDate(new Date()) , 'yyyy-MM');
                //$scope.condition.year_month[1]=currentShift.data.year_month;
                if($scope.keyword){
                        window.localStorage['consumption_code'] = $scope.keyword;
                        window.localStorage['consumption_date'] = $scope.condition.year_month[0];
//                    agentsLists.query(globalFunction.generateUrlParams({agent_code:$scope.keyword}, {id:''})).$promise.then(function (agent) {
                    agentsLists.agentInfoList({agent_key:$scope.keyword}).$promise.then(function (agents) {
                        //window.lo
//                        agentsLists.getAgentByTelephoneNumber({agent_key:$scope.keyword}).$promise.then(function (agents) {
//                        agentsLists.agentInfoList(globalFunction.generateUrlParams({agent_key: $scope.keyword}, {agentMaster:{idcardImages:"",agentContactIdcards:""}})).$promise.then(function (agents) {
                        if(agents.length == 1){
                            $scope.path(agents[0].id,$scope.condition.year_month[0]);
                        }else if(agents.length == 0){
                            topAlert.warning("無此戶口編號!");
                        }else{
                            var modalInstance;
                            modalInstance = $modal.open({
                                templateUrl: "views/agent/show-agent-list.html",
                                controller: 'agentShowListCtrl',
                                resolve: {
                                    agents: function(){
                                        return agents;
                                    }

                                }
                            });
                        }
                    })
                }else{
                    //$scope.path('');
                }
            };


            $scope.$watch("condition.year_month[0]",function(newValue,oldValue){
                if(newValue == '' && oldValue == '')return;
                window.localStorage['bumber'] = newValue;
                $scope.search();
            })

            $scope.$watch("user.hall.hall_name",function(newValue,oldValue){
                 if(newValue == '' && oldValue == ''){
                     return;
                 }
                hallName.setHall({"id":$scope.user.hall.id}).$promise.then(function(data){
                    currentShift.set(data.shift);

                    if(currentShift.data.hall_id){
                        $scope.condition.year_month[0] = currentShift.data.year_month;
                    }
                });
                 /*if(currentShift.data.hall_id){
                     //凱旋門id：1AE7283167B57D1DE050A8C098155859
                     //銀河id：03A667A3393B6225E0539715A8C018ED
                     if(user.hall.hall_name === "凱旋門"){
                         $scope.condition.year_month[0] = currentShift.data.year_month;
                     }else{
                         $scope.condition.year_month[0] = $filter("parseDate")(getDate(new Date()) , 'yyyy-MM');
                     }
                 }*/
             })


            //根據不同的部門跳轉到不同的戶口速查
            $scope.path = function(id,year_month){
                if(user.department.id == "19E3111A0455BF7BE050A8C0981566B0" || user.department.id == "1A58D1844FE649DEE050A8C098151B5C"){
                    $location.path('/agent/agent-detail/'+id+'/'+year_month);
                }else if(user.department.code == departmentType.treasury || user.department.code == departmentType.analysts || user.department.code == departmentType.it || user.department.code == departmentType.optimusInterNational){//賬房、數據分析員、資訊科技部
                    $location.path('/agent/agent-detail/'+id+'/'+year_month);
                }else if(user.department.code == departmentType.account || user.department.code == departmentType.accountB || user.department.code == departmentType.financial || user.department.code == departmentType.Credit){//會計、會計部B、財務、信貸部
                    $location.path('/agent/agent-account-detail/'+id+'/'+year_month);
                }else if(user.department.code == departmentType.scene || user.department.code == departmentType.market || user.department.code == departmentType.businessDev || user.department.code == departmentType.overseasDev){//場面、市場拓展部、業務發展部、海外發展部
                    $location.path('/agent/agent-scene-detail/'+id+'/'+year_month);
                }else{//服務
                    $location.path('/agent/agent-service-detail/'+id+'/'+year_month);
                }
                /*if(id && $stateParams.id && id == $stateParams.id && !$stateParams.types){
                    $state.go($state.current, {}, {reload: true});
                }*/
            }

            //按姓名查询查詢聯絡人
            $scope.agent_data = [];
            $scope.searchAgents = function(){
                if($scope.keyword){
                    agentsLists.agentInfoList({agent_key:$scope.keyword}).$promise.then(function(agents){
                        if(agents.length > 0){
                            $scope.agent_data = agents;
                        }else{
                            $scope.agent_data = [];
                            topAlert.warning("沒有此聯絡人!");
                        }
                    })
                }else{
                    topAlert.warning("請輸入戶口編號!");
                }
            }
            $scope.writeAgents = function(){
                $scope.keyword = "";
                $scope.agent_name = "請選擇戶口";
                $scope.agent_data = [];
            }
            //選取聯繫人跳轉修改
            $scope.agent_name = "請選擇戶口";
            $scope.redirectUpdate = function(agent_code,agent_name,id){
                $scope.agent_name = agent_code+" "+agent_name;
            }

    }]).controller('agentShowListCtrl',['$scope','agents','$location','$modalInstance','departmentType','user',
        function($scope,agents,$location,$modalInstance,departmentType,user){
            if(agents.length > 0){
                $scope.agents = agents;
            }
            $scope.redirectUpdate = function(id){
                $modalInstance.close();

                if(user.department.code == departmentType.treasury || user.department.code == departmentType.analysts || user.department.code == departmentType.it || user.department.code == departmentType.optimusInterNational){//賬房、數據分析員、資訊科技部
                    $location.path('/agent/agent-detail/');
                }else if(user.department.code == departmentType.account || user.department.code == departmentType.accountB || user.department.code == departmentType.financial || user.department.code == departmentType.Credit){//會計、會計部B、財務、信貸部
                    $location.path('/agent/agent-account-detail/'+id);
                }else if(user.department.code == departmentType.scene || user.department.code == departmentType.market || user.department.code == departmentType.businessDev || user.department.code == departmentType.overseasDev){//場面、市場拓展部、業務發展部、海外發展部
                    $location.path('/agent/agent-scene-detail/'+id);
                }else{//服務
                    $location.path('/agent/agent-service-detail/'+id);
                }
//                if(user.department.code == departmentType.treasury){
//                    $location.path('/agent/agent-detail/'+id);
//                }else if(user.department.code == departmentType.account){
//                    $location.path('/agent/agent-account-detail/'+id);
//                }else if(user.department.code == departmentType.scene){
//                    $location.path('/agent/agent-scene-detail/'+id);
//                }else{
//                    $location.path('/agent/agent-service-detail/'+id);
//                }
            }
    }]).controller('agentDetailCtrl',['$scope','topAlert','refAgentGroupType','agentGroup','agentsLists','agentIntegral','agentGuest','contactPrivilege','agentHobby','refagentcontacttypes','agentRemark','agentOrders','globalFunction','tmsPagination','agentType','$stateParams','$modal','$log','$location','breadcrumb','agentsList','screeings','noticeTypes','agentQuota','pinCodeModal','user','departmentType','$filter','getDate','$state','qzPrinter','printerType','currentShift','$window','$modalInstance','currentMachine',
        function($scope,topAlert,refAgentGroupType,agentGroup,agentsLists,agentIntegral,agentGuest,contactPrivilege,agentHobby,refagentcontacttypes,agentRemark,agentOrders,globalFunction,tmsPagination,agentType,$stateParams,$modal,$log,$location,breadcrumb,agentsList,screeings,noticeTypes,agentQuota,pinCodeModal,user,departmentType,$filter,getDate,$state,qzPrinter,printerType,currentShift,$window,$modalInstance,currentMachine){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"戶口速查","active":true}
            ];

           // $scope.IVRoperation=sessionStorage.getItem("IVRoperation");
            $scope.IVRoperation=sessionStorage.getItem("IVRotherFunction");
            $scope.IVRunlock=user.checkPermissions("IVRunlock")
            $scope.print_agent_image_submit = false;

            $scope.print_agent_image = function(url){
                if(!url){
                    topAlert.warning('暫無證件圖片');
                    return;
                }

                $scope.print_agent_image_submit = true;

                qzPrinter.print('PDFIdPhoto',"",{image_url:url}).then(function(){
                    topAlert.success('列印成功');
                    $scope.print_agent_image_submit = false;
                },function(msg){
                    $scope.print_agent_image_submit = false;
                })
            };
//            if(user.department.code == departmentType.treasury || user.department.code == departmentType.analysts || user.department.code == departmentType.it || user.department.code == departmentType.optimusInterNational){//賬房、數據分析員、資訊科技部
//                $location.path('/agent/agent-detail/'+ $stateParams.id);
//            }else if(user.department.code == departmentType.account || user.department.code == departmentType.accountB || user.de cpartment.code == departmentType.financial || user.department.code == departmentType.Credit){//會計、會計部B、財務、信貸部
//                $location.path('/agent/agent-account-detail/'+ $stateParams.id);
//            }else if(user.department.code == departmentType.scene || user.department.code == departmentType.market || user.department.code == departmentType.businessDev || user.department.code == departmentType.overseasDev){//場面、市場拓展部、業務發展部、海外發展部
//                $location.path('/agent/agent-scene-detail/'+ $stateParams.id);
//            }else{//服務
//                $location.path('/agent/agent-service-detail/'+ $stateParams.id);
//            }

            //自定義變量
            $scope.agent_info_id = $stateParams.id;
            $scope.now_data = getDate(new Date());
            $scope.agentTypes = agentType.items;

            if($stateParams.id){
                $scope.contact_privileges =  contactPrivilege.query();
            }
            $scope.notice_types = noticeTypes.items;
            $scope.agent_group = {};


            //愛好紙
            $scope.showHobby = function(agent_hobbys){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/agent/hobbies-show.html",
                    controller: 'agentHobbiesShowCtrl',
                    resolve: {
                        agent_hobbys: function () {
                            return agent_hobbys;
                        }
                    }
                });
            }
            if(user.department.code == departmentType.scene || user.department.code == departmentType.market || user.department.code == departmentType.businessDev || user.department.code == departmentType.overseasDev){
                if($stateParams.id){
                    //$scope.agent_hobbys =  agentHobby.query({agent_info_id:agent_info_id}).$promis;

                    if(!angular.isUndefined($stateParams.id) && $stateParams.id) {
                        agentHobby.query({agent_info_id:$stateParams.id}).$promise.then(function(agent_hobbys){
                            $scope.agent_hobbys = agent_hobbys;
                            $scope.showHobby(agent_hobbys);
                        });
                    }

                }

            }
            /*ivr1*/
            $scope.agent=""
            /*ivr1_end*/

            //根据戶口ID對速查出戶口
            if(!angular.isUndefined($stateParams.id) && $stateParams.id){
                //顯示戶組
                refAgentGroupType.query(globalFunction.generateUrlParams({agent_info_id: $stateParams.id}, {agentGroup: {}})).$promise.then(function(refagentgrouptypes){
                    if(refagentgrouptypes.length > 0){
                        if(refagentgrouptypes[0].agentGroup.top_group_name == ''){
                            $scope.agent_group.top_group_name =refagentgrouptypes[0].agentGroup.owner_name;
                        }else{
                            $scope.agent_group.top_group_name =refagentgrouptypes[0].agentGroup.top_group_name;
                        }
                        if(refagentgrouptypes.length == 1){
                            $scope.agent_group.parent_group_name =refagentgrouptypes[0].agentGroup.parent_group_name;
                            $scope.agent_group.agent_group_name =refagentgrouptypes[0].agentGroup.agent_group_name;
                        }else{
                            angular.forEach(refagentgrouptypes,function(refagentgrouptype){
                                if(refagentgrouptype.agent_type == "2"){
                                    $scope.agent_group.parent_group_name =refagentgrouptype.agentGroup.agent_group_name;
                                }else{
                                    $scope.agent_group.agent_group_name =refagentgrouptype.agentGroup.agent_group_name;
                                }
                            });
                        }
                    }
                })
                /*ivr1*/
                $scope.pwIsSetshow1=false
                //主要顯示戶口速查中的戶口信息
                agentsLists.get(globalFunction.generateUrlParams({id: $stateParams.id}, {quotaRemarks:{},parentSupervisor:{},agentMaster:{idcardImages:"",agentContactIdcards:""},refAgentMaster:{},refTelAgentMasterNoticeType:{agentContactTel:""},agentRemarks:{},refAgentComps:{}})).$promise.then(function(agent){
                    $scope.agent = agent;
                    $scope.ivr_failed_time=parseInt($scope.agent.refAgentMaster.ivr_failed_time)
                    if($scope.agent.refAgentMaster.newpsd!=null)
                    {
                        $scope.pwIsSetshow1=true
                    }
                    else
                    {
                        $scope.pwIsSetshow1=false
                    }
                    /*ivr1_end*/
                    $scope.agentContactMessages =_.filter($scope.agent.refTelAgentMasterNoticeType,function(refTelAgentNoticeType){
                        return  refTelAgentNoticeType.notice_type == '1' || refTelAgentNoticeType.notice_type == '3'
                    });
                    $scope.refTelAgentMasterNoticeType =_.filter($scope.agent.refTelAgentMasterNoticeType,function(refTelAgentNoticeType){
                        return  refTelAgentNoticeType.notice_type == '2' || refTelAgentNoticeType.notice_type == '3'
                    });
                    $scope.agentContactTel =_.filter($scope.agent.refTelAgentMasterNoticeType,function(refTelAgentNoticeType){
                        return  refTelAgentNoticeType.notice_type == '2' || refTelAgentNoticeType.notice_type == '3'
                    });
                    $scope.companyContact = _.pluck($scope.agent.refAgentComps,"comp_contact_name");
                    $scope.companyContact = $scope.companyContact.join(',');
                    $scope.show_certificate();
                });
            }
            //授權人信息
            /*ivr1*/
            var agent_privileges
            if(!angular.isUndefined($stateParams.id) && $stateParams.id) {
                refagentcontacttypes.query(globalFunction.generateUrlParams({agent_info_id: $stateParams.id,contact_type:2},{agentContact: {phoneNumbers:"",idcardImages:""},refTelAgentNoticeTypes:{agentContactTel:""},refAgentContactPrivileges:{}})).$promise.then(function(data)
                {

                    agent_privileges =data;
                    _.each(agent_privileges,function(agent_privilege){
                        agent_privilege.refTelAgentNoticeTypes = _.filter(agent_privilege.refTelAgentNoticeTypes, function(refTelAgentNoticeType){ return refTelAgentNoticeType.notice_type != 1; });
                    });

                    if(agent_privileges)
                    {
                        $.each(agent_privileges,function(index,val)
                        {

                            agent_privileges[index].tel_verify_disable=true

                        })
                        $scope.agent_privileges=agent_privileges;
                    }

                });
            }

            /*ivr1_end*/
            //簽額
            $scope.quotas_checked_layout = function(){
                $scope.agentQuotas = [];
                $scope.all_agentQuotas = [];
                if(!angular.isUndefined($stateParams.id) && $stateParams.id) {
                    agentQuota.get(globalFunction.generateUrlParams({agent_info_id: $stateParams.id},{})).$promise.then(function(_agentQuotas) {
//                        if(_agentQuotas && _agentQuotas.message=='1016'){
//                            topAlert.warning("無法查詢外館簽額（網絡或rollex服務問題）");
//                        }
                        $scope.all_agentQuotas =_agentQuotas.agent_quota;
                    });
                }
            }
            $scope.quotas_checked_layout();
            //公共簽額
            $scope.tr_click = 0;
            $scope.commonQuota = function(agent_info_id){
                $scope.tr_click = 1;
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/agent/agent-common-quota.html",
                    controller: 'agentCommonQuotaCtrl',
                    windowClass:'lg-modal',
                    resolve: {
                        agent_info_id: function(){
                            return agent_info_id;
                        },
                        agentCommon:function(){
                            return $scope.agent;
                        }
                    }
                });
                modalInstance.result.then((function(status) {
                    $scope.tr_click = 0;
                }), function() {
                    $log.info("Modal dismissed at: " + new Date());
                });

            }
            //彈出未還利息總額
            $scope.overdueCharge = function(agent_code){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/agent/agent-overdue-charge.html",
                    controller: 'agentOverdueChargeCtrl',
                    windowClass:'xlg-modal',
                    resolve: {
                        agent_code:function(){
                            return agent_code;
                        }
                    }
                });
            }

            //彈出未還貸款
            $scope.showLoan = function(agentQuota){
                if($scope.tr_click == 0){
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/agent/show-loan.html",
                        controller: 'agentShowLoanCtrl',
                        windowClass:'xlg-modal',
                        resolve: {
                            agentQuota: function(){
                                return agentQuota;
                            }
                        }
                    });
                    modalInstance.result.then((function(remark) {
                        if(remark){
                            $scope.tr_click = 0;
                        }
                    }), function() {
                        $log.info("Modal dismissed at: " + new Date());
                    });
                }
            }
            //客戶信息助手
            $scope.agent_keyword = '';
            $scope.pagination = tmsPagination.create();
//            $scope.pagination.resource = refagentcontacttypes;
            $scope.pagination.resource = agentsLists;
            $scope.pagination.max_size = 6;
            $scope.pagination.items_per_page = 10;
            $scope.pagination.query_method = "agentAssistantList";
            $scope.select = function(page){
                if(!angular.isUndefined($stateParams.id) && $stateParams.id) {
                    //$scope.agent_assistants = $scope.pagination.select(page,{agent_info_id: $stateParams.id,contact_type:3,agentContact:{agent_contact_name:$scope.agent_keyword+"!"}},{agentContact:{phoneNumbers:"",idcardImages:""},refTelAgentNoticeTypes:{agentContactTel:""},agentContactTels:{}});
                    $scope.agent_assistants = $scope.pagination.select(page,{agent_info_id: $stateParams.id,assistant_key:$scope.agent_keyword,sort:"agent_contact_name"},{agentContactIdcards:{},agentContactTels:{}});
                }
            }
            $scope.select();

            //客戶信息
            $scope.pagination_guest = tmsPagination.create();
            $scope.pagination_guest.resource = agentsLists;
            $scope.pagination_guest.max_size = 6;
            $scope.pagination_guest.items_per_page = 10;
            $scope.pagination_guest.query_method = "agentGuestList";
            $scope.select_guest = function(page){
                if(!angular.isUndefined($stateParams.id) && $stateParams.id) {
                    $scope.agentGuests = $scope.pagination_guest.select(page,{agent_info_id: $stateParams.id,guest_key:$scope.agent_keyword,sort:"agent_guest_name"},{});
                }
            }
            $scope.select_guest();

            //客戶詳細
//            $scope.detail_guest = function(id){
//                $location.path('/agent/agent-guest-detail/'+id);
//            }
           // 精確查詢
            $scope.$watch("agent_keyword",globalFunction.debounce(function(new_value,old_value){
                if(!angular.isUndefined($stateParams.id)  && $stateParams.id) {
//                    $scope.agent_assistants = $scope.pagination.select(1,globalFunction.generateUrlParams({agent_info_id: $stateParams.id,contact_type:3,agentContact:{agent_contact_name:new_value+"!"}},{agentContact: {idcardImages:"",phoneNumbers:""},refTelAgentNoticeTypes:{agentContactTel:""},agentContactTels:{}}));
                    $scope.agent_assistants = $scope.pagination.select(1,{agent_info_id: $stateParams.id,assistant_key:new_value,sort:"agent_contact_name"},{agentContactIdcards:{},agentContactTels:{}});
                    $scope.agentGuests = $scope.pagination_guest.select(1,{agent_info_id: $stateParams.id,guest_key:new_value,sort:"agent_guest_name"},{});
                }
            }));
            //户口速查客人
            $scope.detail_guest = function(id){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/agent/agent-show-guest-detail.html",
                    controller: 'agentShowGuestDetailCtrl',
                    windowClass:'alg-modal',
                    resolve: {
                        id: function () {
                            return id;
                        }
                    }
                });
            }

            //顯示備註信息
            if(!angular.isUndefined($stateParams.id) && $stateParams.id) {
                agentRemark.query({type:"1",agent_info_id: $stateParams.id}).$promise.then(function(agent_remarks){
                    $scope.agent_remarks = agent_remarks;
                });
            }
            //顯示order紙信息
//            $scope.pagination_order = tmsPagination.create();
//            $scope.pagination_order.resource = agentOrders;
//            $scope.pagination_order.max_size = 6;
//            $scope.pagination_order.items_per_page =3;
//            $scope.pagination_order.query_method = "agentOrderLists";
//            $scope.select_order= function(page){
//                if(!angular.isUndefined($stateParams.id)) {
//                    $scope.agent_orders = $scope.pagination_order.select(page,globalFunction.generateUrlParams({
//                        agent_info_id: $stateParams.id,
//                        module_code:"TREASURY_FASTCHECK"
//                        start_time:['',getDate(null,true)],
//                        end_time:[getDate(null,true),'']
//                    //TODO 需要指定模块，但因为目前模块没有中文名，不好定位，等DBA加个modulecode字段再修改
//                    },{}));
//
//                }
//            }
//            $scope.select_order();
            $scope.getOrders = function(type){
                if(!angular.isUndefined($stateParams.id) && $stateParams.id) {
                    $scope.agent_orders = agentOrders.agentOrderLists({agent_info_id: $stateParams.id, module_code:type });
                }
            }

            if(!angular.isUndefined($stateParams.id)){
                if(user.department.code == departmentType.treasury || user.department.code == departmentType.analysts || user.department.code == departmentType.it || user.department.code == departmentType.optimusInterNational){//賬房、數據分析員、資訊科技部
                    $scope.getOrders("TREASURY_FASTCHECK");
                }else if(user.department.code == departmentType.account || user.department.code == departmentType.accountB || user.department.code == departmentType.financial || user.department.code == departmentType.Credit){//會計、會計部B、財務、信貸部
                    $scope.getOrders("ACCOUNT_FASTCHECK");
                }else if(user.department.code == departmentType.scene || user.department.code == departmentType.market || user.department.code == departmentType.businessDev || user.department.code == departmentType.overseasDev){//場面、市場拓展部、業務發展部、海外發展部
                    $scope.getOrders("SCENE_FASTCHECK");
                }else{//服務
                    $scope.getOrders("SERVICE_FASTCHECK");
                }
//                if(user.department.code == departmentType.treasury){
//                    $scope.getOrders("TREASURY_FASTCHECK");
//                }else if(user.department.code == departmentType.account){
//                    $scope.getOrders("ACCOUNT_FASTCHECK");
//                }else if(user.department.code == departmentType.scene){
//                    $scope.getOrders("SCENE_FASTCHECK");
//                }else{
//                    $scope.getOrders("SERVICE_FASTCHECK");
//                }
            }
            //新增備註
            $scope.addRemark = function (){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/agent/remark-create.html",
                    controller: 'agentRemarkCreateCtrl',
                    resolve: {
                        id: function () {
                            return $stateParams.id;
                        }
                    }
                });
                modalInstance.result.then((function(remark) {
                    if(remark){
                        $scope.agent_remarks = agentRemark.query({type:"1",agent_info_id: $stateParams.id});
                    }
                }), function() {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }
            //新增Order紙
            $scope.addOrder = function(id,agent_code,agent_group){
                var modalInstance;
                modalInstance =  $modal.open({
                    templateUrl: "views/agent/message-agent-order-create.html",
                    controller: 'messageAgentOrderCreateCtrl',
                    resolve: {
                        id: function () {
                            return id;
                        },
                        agent_code:function(){
                            return agent_code;
                        },
                        agent_group:function(){
                            return  agent_group;
                        }
                    }
                });
                modalInstance.result.then((function(status){
                    if(status && !angular.isUndefined($stateParams.id)){

                        if(user.department.code == departmentType.treasury || user.department.code == departmentType.analysts || user.department.code == departmentType.it || user.department.code == departmentType.optimusInterNational){//賬房、數據分析員、資訊科技部
                            $scope.getOrders("TREASURY_FASTCHECK");
                        }else if(user.department.code == departmentType.account || user.department.code == departmentType.accountB || user.department.code == departmentType.financial || user.department.code == departmentType.Credit){//會計、會計部B、財務、信貸部
                            $scope.getOrders("ACCOUNT_FASTCHECK");
                        }else if(user.department.code == departmentType.scene || user.department.code == departmentType.market || user.department.code == departmentType.businessDev || user.department.code == departmentType.overseasDev){//場面、市場拓展部、業務發展部、海外發展部
                            $scope.getOrders("SCENE_FASTCHECK");
                        }else{//服務
                            $scope.getOrders("SERVICE_FASTCHECK");
                        }
//                        if(user.department.code == departmentType.treasury ){
//                            $scope.getOrders("TREASURY_FASTCHECK");
//                        }else if(user.department.code == departmentType.account){
//                            $scope.getOrders("ACCOUNT_FASTCHECK");
//                        }else if(user.department.code == departmentType.scene){
//                            $scope.getOrders("SCENE_FASTCHECK");
//                        }else{
//                            $scope.getOrders("SERVICE_FASTCHECK");
//                        }
                    }
                }));
            }
            //Order紙詳細
            $scope.detail_message = function(id){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/agent/message-detail.html",
                    controller: 'agentMessageDetailCtrl',
                    resolve: {
                        id:function(){
                            return id;
                        },
                        messages:function(){
                            return $scope.messages;
                        }
                    }
                });
            }

            //顯示戶主圖片
            $scope.certificate_images =[{image:"",expire_date:""},{image:"",expire_date:""}];
            $scope.show_certificate = function(){
                for(var i = 0;i < 2;i++){
                    if(!angular.isUndefined($scope.agent.agentMaster.idcardImages[i])){
                        $scope.certificate_images[i].image = $scope.agent.agentMaster.idcardImages[i].show_image_path;
                    }else{
                        $scope.certificate_images[i].image = "";
                    }
                    if(!angular.isUndefined($scope.agent.agentMaster.agentContactIdcards[i]) && $scope.agent.agentMaster.agentContactIdcards[i].expire_date){
                        $scope.certificate_images[i].expire_date = $scope.agent.agentMaster.agentContactIdcards[i].expire_date;
                    }else{
                        $scope.certificate_images[i].expire_date = "";
                    }
                }
            }
            //顯示客戶信息
            $scope.show_contacter_image = function(contacter){
                for(var i = 0;i < 2;i++){
                    if(!angular.isUndefined(contacter.idcardImages[i])){
                        $scope.certificate_images[i].image = contacter.idcardImages[i].show_image_path;
                    }else{
                        $scope.certificate_images[i].image = "";
                    }
                    if(!angular.isUndefined(contacter.agentContactIdcards[i]) && contacter.agentContactIdcards[i].expire_date){
                        $scope.certificate_images[i].expire_date =contacter.agentContactIdcards[i].expire_date;
                    }else{
                        $scope.certificate_images[i].expire_date = "";
                    }
                }
            }

            $scope.show_guest_image = function(guest){
                for(var i = 0;i < 2;i++){
                    if(!angular.isUndefined(guest.idcardImages[i])){
                        $scope.certificate_images[i].image =guest.idcardImages[i].show_image_path;
                    }else{
                        $scope.certificate_images[i].image = "";
                    }
                    if(!angular.isUndefined(guest.agentGuestIdcards[i]) && guest.agentGuestIdcards[i].expired_date){
                        $scope.certificate_images[i].expire_date =guest.agentGuestIdcards[i].expired_date;
                    }else{
                        $scope.certificate_images[i].expire_date = "";
                    }
                }
            }
            $scope.show_contacter_certificate = function(contact){
                for(var i = 0;i < 2;i++){
                    if(!angular.isUndefined(contact.agentContact.idcardImages[i])){
                        $scope.certificate_images[i].image = contact.agentContact.idcardImages[i].show_image_path;
                    }else{
                        $scope.certificate_images[i].image = "";
                    }
                    if(!angular.isUndefined(contact.agentContact.idcardImages[i]) && contact.agentContact.idcardImages[i].expire_date){
                        $scope.certificate_images[i].expire_date =contact.agentContact.agentContactIdcards[i].expire_date;
                    }else{
                        $scope.certificate_images[i].expire_date = "";
                    }
                }
            }
            //密碼更新或新增
            $scope.addPassword = function(){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/agent/agent-password-create.html",
                    controller: 'agentPasswordCreateCtrl',
                    resolve: {
                        id: function () {
                            return $stateParams.id;
                        }
                    }
                });
            }
            $scope.updatePassword = function(){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/agent/agent-password-update.html",
                    controller: 'agentPasswordUpdateCtrl',
                    resolve: {
                        id: function () {
                            return $stateParams.id;
                        }
                    }
                });
            }

            //聯絡人詳細信息
            $scope.detail = function(id){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/agent/agent-show-contact-detail.html",
                    controller: 'agentShowContactDetailCtrl',
                    windowClass:'xlg-modal',
                    resolve: {
                        id: function () {
                            return id;
                        }
                    }
                });
//                $location.path('/agent/contact-detail/'+id);
            }
            $scope.detailBrokerage = function(id){
                $location.path('/agent/contact-detail/'+id);
            }

            //愛好紙
            $scope.addHobby = function (){
              var modalInstance;
              modalInstance = $modal.open({
                  templateUrl: "views/agent/hobbies-create.html",
                  controller: 'agentHobbiesCreateCtrl',
                  resolve: {
                      id:function(){
                          return '';
                      },
                      agent_info_id:function(){
                          return $stateParams.id;
                      },
                      hobbies:function(){
                          return '';
                      },
                      title:function(){
                          return '新增愛好紙';
                      }
                  }
              });
              modalInstance.result.then((function(hobbies) {
                  $scope.agent_hobbys = agentHobby.query({agent_info_id:$stateParams.id});
              }), function() {
                  $log.info("Modal dismissed at: " + new Date());
              });
            }

            $scope.updateHobby = function (id){
              var modalInstance;
              modalInstance = $modal.open({
                  templateUrl: "views/agent/hobbies-create.html",
                  controller: 'agentHobbiesCreateCtrl',
                  resolve: {
                      id:function(){
                          return id;
                      },
                      agent_info_id:function(){
                          return $stateParams.id;
                      },
                      hobbies:function(){
                          return $scope.agent.hobbies;
                      },
                      title:function(){
                          return '修改愛好紙';
                      }
                  }
              });
              modalInstance.result.then((function(hobbies) {
                  $scope.agent_hobbys = agentHobby.query({agent_info_id:$stateParams.id});
              }), function() {
                  $log.info("Modal dismissed at: " + new Date());
              });
            }
            $scope.deteleHobby = function(id){
                pinCodeModal(agentHobby,'delete',{id:id},'刪除成功！').then(function(){
                    $scope.agent_hobbys = agentHobby.query({agent_info_id:$stateParams.id});
                })

            }
            //户口速查积分/佣金
            $scope.agent_integral = [];
            if(!angular.isUndefined($stateParams.id) && $stateParams.id){
//                agentIntegral.get({agent_info_id:$stateParams.id},(function(data){
//                    $scope.agent_integral = data;
//                }));

                var params = {
                    agent_info_id:$stateParams.id,
                    year_month:currentShift.data.year_month + "-01"
                };

                agentIntegral.integralAllowance(params).$promise.then(function(agent_integral){
                    $scope.agent_integral = agent_integral;
                })
            }
            $scope.addIntegralDetail = function(){
              var modalInstance;
              modalInstance = $modal.open({
                  templateUrl: "views/agent/add-integral-detail.html",
                  controller: 'agentIntegralDetailCtrl',
                  windowClass:'lg-modal',
                  resolve: {
                      agent_integral:function(){
                          return $scope.agent_integral;
                      }
                  }
              });
            }


            var search_screeing =[{field_name:'agent_code'}]
            $scope.condition_screeing={
              "agent_code":""
            }
            $scope.sceneDetail = function(){
              if($stateParams.agent_code != null){
                  $scope.condition_screeing.agent_code = $stateParams.agent_code;
                  $scope.screeings = search(screeings,search_screeing,$scope.condition_screeing);

                  if( $scope.screeings.length > 0){
                      $location.path("/scene/screening-detail/"+$stateParams.agent_code);
                  }else{
                      $location.path("/scene/screening-create/");
                  }
               }else{
                  alert("請選擇客戶編號！");
              }
            }

            //密码管理
            $scope.managerPassword = function(id,type){
                var modalInstance;
                modalInstance = $modal.open({
                    controller: type == 'agent'?'agentSetPasswordCtrl':'refAgentContactTypeSetPasswordCtrl',
                    templateUrl: "views/agent/agent-password-management.html",
                    windowClass:'print-modal',
                    resolve: {
                        id: function() {
                            return id;
                        }
                    }
                });
            }

            /***********************ivr2************************/
            var contact_active = false;
            $scope.call_id = "";
            $scope.phone_number = "";
            $scope.tel_verify_disable=true
            $scope.call_phone_number=""
            $scope.jypasswordset=false

            if($stateParams.call_id)
                $scope.call_id = $stateParams.call_id;
            if($stateParams.phone_number)
                $scope.phone_number = $stateParams.phone_number;
            var iframePanelsScope = $window.parent.angular.element("#iframePanels").scope();
           $scope.socket = iframePanelsScope.socket;
//           $scope.socket=
//            {
//                on:function(){}
//            }
//监听拨打类型
            setInterval(function()
            {
                if(sessionStorage.getItem("call_type")=="")
                {
                    $scope.call_phone_number=""
                }
            },500)

//监听call_id 从儿决定按钮是否禁用
            setInterval(function()
            {
                if(sessionStorage.getItem("call_id")=="")
                {

//1
                    $scope.tel_verify_disable=true
                    if($scope.agent_privileges)
                    {
                        $.each($scope.agent_privileges,function(index,val)
                        {

                            $scope.agent_privileges[index].tel_verify_disable=true

                        })
                    }


                }
                else
                {

                    if(sessionStorage.getItem("user_group_type")==1)
                    {
                        $scope.tel_verify_disable=false
                        if($scope.agent_privileges)
                        {
                            $.each($scope.agent_privileges,function(index,val)
                            {
//1
                                $scope.agent_privileges[index].tel_verify_disable=true

                            })
                        }
                    }
                    if(sessionStorage.getItem("user_group_type")==2)
                    {
                        $scope.tel_verify_disable=true
                        if($scope.agent_privileges)
                        {
                            $.each($scope.agent_privileges,function(index,val)
                            {

                                if($scope.agent_privileges[index].id==sessionStorage.getItem("ref_agent_contact_type_id"))
                                {

                                    $scope.agent_privileges[index].tel_verify_disable=false
                                }
                            })
                        }

                    }
                    if(sessionStorage.getItem("user_group_type")==3)
                    {
                        $scope.tel_verify_disable=false
                        if($scope.agent_privileges)
                        {
                            $.each($scope.agent_privileges,function(index,val)
                            {

                                $scope.agent_privileges[index].tel_verify_disable=false

                            })
                        }
                    }
                }
            },500)


//makecall
            var makecallable=true
            $scope.ref_agent_contact_type_id
            $scope.makeCall = function(contact,type,contact2)
            {
                   var type=type
                $scope.phone_number = contact.agentContactTel.area_code+'-'+contact.agentContactTel.telephone_number;
                   var JSON=angular.fromJson(sessionStorage.getItem("CallList"))
                   if(_.findIndex(JSON["log"],{phone_number:$scope.phone_number})>=0)
                   {
                       topAlert.warning("該號碼正在通話中!");
                   }
                   else if(sessionStorage.getItem("call_id")!="")
                   {
                       topAlert.warning("該分機正在操作中!");
                   }
                   else
                   {
                       if(makecallable)
                       {
                           makecallable=false;
                           if(contact_active) { return false; }
                           contact_active = true;
                           contact.active = true;

                           sessionStorage.setItem("user_group_type",type)
                           if(type==2)
                           {
                               sessionStorage.setItem("ref_agent_contact_type_id",contact2.id)

                               sessionStorage.setItem("lang_name",contact2.agentContact.language_type)
                           }
                           else
                           {
                               sessionStorage.setItem("ref_agent_contact_type_id",contact.ref_agent_contact_type_id)
                               sessionStorage.setItem("lang_name",$scope.agent.agentMaster.language_type)
                           }


                           agentsLists.makeCall({phone_number : $scope.phone_number}).$promise.then(function(data)
                           {
                               $scope.call_id = data.call_id;
                               $scope.call_phone_number=$scope.phone_number

                               contact.active = false;
                               contact_active = false;
                               if(type==2)
                               {
                                   $modalInstance.dismiss(false);
                               }

                           })



                           setTimeout(function()
                           {
                               makecallable=true
                           },2000)
                       }
                   }








            }
//電話號碼驗證
            $scope.tel_verify_pwd = function(ref_agent_contact_type_id,type,lang){

                /*             if(sessionStorage.getItem("user_group_type")==3)
                 {
                 sessionStorage.setItem("ref_agent_contact_type_id",ref_agent_contact_type_id)
                 }*/

                sessionStorage.setItem("ref_agent_contact_type_id",ref_agent_contact_type_id)
                sessionStorage.setItem("lang_name",lang)
                agentsLists.query(globalFunction.generateUrlParams({"id":$stateParams.id},{'passwordUser':{},refAgentMaster:{}})).$promise.then(function(data){
                    if(sessionStorage.getItem("user_group_type")==2)
                    {
                        $.each($scope.agent_privileges,function(index,val)
                        {
                            $scope.agent_privileges[index].ivr_failed_time=parseInt(val.ivr_failed_time)
                            if($scope.agent_privileges[index].id==sessionStorage.getItem("ref_agent_contact_type_id"))
                            {
                                if($scope.agent_privileges[index].newpsd!=null)
                                {
                                    $scope.jypasswordset=true
                                }
                                else
                                {
                                    $scope.jypasswordset=false
                                }
                            }

                        })
                    }
                    if(sessionStorage.getItem("user_group_type")==1)
                    {
                        if(data[0].refAgentMaster.newpsd!=null)
                        {
                            $scope.jypasswordset=true
                        }
                        else
                        {
                            $scope.jypasswordset=false
                        }
                    }
                    if(sessionStorage.getItem("user_group_type")==3)
                    {
                        if(type==2)
                        {
                            $.each($scope.agent_privileges,function(index,val)
                            {

                                if($scope.agent_privileges[index].id==sessionStorage.getItem("ref_agent_contact_type_id"))
                                {
                                    if($scope.agent_privileges[index].newpsd!=null)
                                    {
                                        $scope.jypasswordset=true
                                    }
                                    else
                                    {
                                        $scope.jypasswordset=false
                                    }
                                }

                            })
                        }
                        if(type==1)
                        {
                            if(data[0].refAgentMaster.newpsd!=null)
                            {
                                $scope.jypasswordset=true
                            }
                            else
                            {
                                $scope.jypasswordset=false
                            }
                        }
                    }


                    if(currentMachine.get('landline_id')==null)
                    {
                        topAlert.warning("未設置分機號，無法使用電話功能!");
                    }
                    else
                    {
                        var modalInstance;
                        modalInstance = $modal.open({
                            templateUrl: "views/agent/tel_verify.html",
                            controller: 'agentTelVerifyCtrl',
                            resolve: {
                                Agent_info_id:function(){
                                    return $scope.agent_info_id;
                                },
                                Call_id:function(){
                                    return $scope.call_id;
                                },
                                Phone_number:function(){
                                    return $scope.phone_number;
                                },
                                Has_password: function(){
                                    return $scope.agent.has_password;
                                },
                                jypasswordset:function()
                                {
                                    return $scope.jypasswordset
                                },
                                ivr_available:function()
                                {
                                    var ivr_available
                                    if(sessionStorage.getItem("user_group_type")==2)
                                    {
                                        $.each($scope.agent_privileges,function(index,val)
                                        {
                                            $scope.agent_privileges[index].ivr_failed_time=parseInt(val.ivr_failed_time)
                                            if($scope.agent_privileges[index].id==sessionStorage.getItem("ref_agent_contact_type_id"))
                                            {
                                                ivr_available=$scope.agent_privileges[index].ivr_available

                                            }

                                        })
                                    }
                                    else
                                    {
                                        ivr_available=data[0].refAgentMaster.ivr_available

                                    }


                                    return ivr_available

                                },
                                ivr_failed_time:function()
                                {

                                    var ivr_failed_time

                                    if(sessionStorage.getItem("user_group_type")==2)
                                    {
                                        $.each($scope.agent_privileges,function(index,val)
                                        {
                                            $scope.agent_privileges[index].ivr_failed_time=parseInt(val.ivr_failed_time)
                                            if($scope.agent_privileges[index].id==sessionStorage.getItem("ref_agent_contact_type_id"))
                                            {

                                                ivr_failed_time=$scope.agent_privileges[index].ivr_failed_time

                                            }

                                        })
                                    }
                                    else
                                    {
                                        ivr_failed_time=data[0].refAgentMaster.ivr_failed_time

                                    }
                                    return ivr_failed_time


                                },
                                ref_agent_contact_type_id:function()
                                {
                                    return $scope.ref_agent_contact_type_id
                                },
                                landlineshow:function()
                                {


                                }
                            }
                        });
                    }


                });

            }
//現場電話號碼驗證
            $scope.xctel_verify_pwd = function(ref_agent_contact_type_id,type){
                if(!ref_agent_contact_type_id)
                {
                    return false
                }

                sessionStorage.setItem("xcref_agent_contact_type_id",ref_agent_contact_type_id)
                sessionStorage.setItem("xcuser_group_type",type)
                agentsLists.query(globalFunction.generateUrlParams({"id":$stateParams.id},{'passwordUser':{},refAgentMaster:{}})).$promise.then(function(data){
                    if(sessionStorage.getItem("xcuser_group_type")==2)
                    {
                        $.each($scope.agent_privileges,function(index,val)
                        {
                            $scope.agent_privileges[index].ivr_failed_time=parseInt(val.ivr_failed_time)
                            if($scope.agent_privileges[index].id==sessionStorage.getItem("xcref_agent_contact_type_id"))
                            {
                                if($scope.agent_privileges[index].newpsd!=null)
                                {
                                    $scope.jypasswordset=true
                                }
                                else
                                {
                                    $scope.jypasswordset=false
                                }
                            }

                        })
                    }
                    if(sessionStorage.getItem("xcuser_group_type")==1)
                    {
                        if(data[0].refAgentMaster.newpsd!=null)
                        {
                            $scope.jypasswordset=true
                        }
                        else
                        {
                            $scope.jypasswordset=false
                        }
                    }
                    if(sessionStorage.getItem("xcuser_group_type")==3)
                    {
                        if(type==2)
                        {
                            $.each($scope.agent_privileges,function(index,val)
                            {

                                if($scope.agent_privileges[index].id==sessionStorage.getItem("xcref_agent_contact_type_id"))
                                {
                                    if($scope.agent_privileges[index].newpsd!=null)
                                    {
                                        $scope.jypasswordset=true
                                    }
                                    else
                                    {
                                        $scope.jypasswordset=false
                                    }
                                }

                            })
                        }
                        if(type==1)
                        {
                            if(data[0].refAgentMaster.newpsd!=null)
                            {
                                $scope.jypasswordset=true
                            }
                            else
                            {
                                $scope.jypasswordset=false
                            }
                        }
                    }
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/agent/xctel_verify.html",
                        controller: 'agentxcTelVerifyCtrl',
                        resolve: {
                            Agent_info_id:function(){
                                return $scope.agent_info_id;
                            },
                            Call_id:function(){
                                return $scope.call_id;
                            },
                            Phone_number:function(){
                                return $scope.phone_number;
                            },
                            Has_password: function(){
                                return $scope.agent.has_password;
                            },
                            jypasswordset:function()
                            {
                                return $scope.jypasswordset
                            },
                            ivr_available:function()
                            {
                                var ivr_available
                                if(sessionStorage.getItem("xcuser_group_type")==2)
                                {
                                    $.each($scope.agent_privileges,function(index,val)
                                    {
                                        $scope.agent_privileges[index].ivr_failed_time=parseInt(val.ivr_failed_time)
                                        if($scope.agent_privileges[index].id==sessionStorage.getItem("xcref_agent_contact_type_id"))
                                        {
                                            ivr_available=$scope.agent_privileges[index].ivr_available

                                        }

                                    })
                                }
                                else
                                {
                                    ivr_available=data[0].refAgentMaster.ivr_available

                                }


                                return ivr_available

                            },
                            ivr_failed_time:function()
                            {

                                var ivr_failed_time

                                if(sessionStorage.getItem("xcuser_group_type")==2)
                                {
                                    $.each($scope.agent_privileges,function(index,val)
                                    {
                                        $scope.agent_privileges[index].ivr_failed_time=parseInt(val.ivr_failed_time)
                                        if($scope.agent_privileges[index].id==sessionStorage.getItem("xcref_agent_contact_type_id"))
                                        {

                                            ivr_failed_time=$scope.agent_privileges[index].ivr_failed_time

                                        }

                                    })
                                }
                                else
                                {
                                    ivr_failed_time=data[0].refAgentMaster.ivr_failed_time

                                }
                                return ivr_failed_time


                            },
                            ref_agent_contact_type_id:function()
                            {
                                return $scope.ref_agent_contact_type_id
                            }
                        }
                    })

                });

            }
//解鎖
            $scope.unlock_ref_agent_contact_type_id
            $scope.unlock_type
            $scope.unlockalert = function(ref_agent_contact_type_id,type){
                $scope.lock={
                    call_id :"",
                    phone_number:"",
                    ref_agent_contact_type_id:ref_agent_contact_type_id,
                    lang_name: "粵語"  ,
                    type:4
                }
                pinCodeModal(agentsLists,'unlock',$scope.lock,'解鎖成功！').then(function(){
                    $scope.select();
                    if(type==1)
                    {
                        $scope.ivr_failed_time=0
                        $scope.pwIsSetshow1=false
                    }
                    if(type==2)
                    {

                        if($scope.agent_privileges)
                        {
                            $.each($scope.agent_privileges,function(index,val)
                            {

                                if($scope.agent_privileges[index].id==ref_agent_contact_type_id)
                                {

                                    $scope.agent_privileges[index].ivr_failed_time=0
                                    $scope.agent_privileges[index].newpsd=null
                                }
                            })
                        }
                    }
                })

            }

//電話查詢
            $scope.tel_records = function(ref_agent_contact_type_id){

                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/agent/records.html",
                    controller: 'TelRecordsCtrl',
                    resolve: {
                        ref_agent_contact_type_id:function(){
                            return ref_agent_contact_type_id;
                        }
                    }

                });


            }
            if(sessionStorage.getItem("tels"))
            {
                $scope.tels=angular.fromJson(sessionStorage.getItem("tels"))
            }

            //多電話選擇
            $scope.contact_privilegesTels = function(agent_privilege){

                sessionStorage.setItem("tels",angular.toJson(agent_privilege))
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/agent/contact_privilegesTels.html",
                    controller: 'agentDetailCtrl',
                    windowClass:'print-modal'

                });


            }
            $scope.cancel = function()
            {
                $modalInstance.dismiss(false);
            }
//socket监听

            //交易密碼狀態
            $scope.socket.on('pwIsSet',function(data)
            {
                var data=data
                if(data.call_id==sessionStorage.getItem("call_id"))
                {

                    if(sessionStorage.getItem("user_group_type")==1)
                    {
                        if(data.pwIsSet=="1")
                        {
                            $scope.pwIsSetshow1=true
                        }
                        else
                        {
                            $scope.pwIsSetshow1=false
                        }
                    }
                    if(sessionStorage.getItem("user_group_type")==2)
                    {
                        if(data.pwIsSet=="1")
                        {

                            $.each($scope.agent_privileges,function(index,val)
                            {

                                if($scope.agent_privileges[index].id==sessionStorage.getItem("ref_agent_contact_type_id"))
                                {

                                    $scope.agent_privileges[index].newpsd=1
                                }
                            })

                        }
                        else
                        {
                            $.each($scope.agent_privileges,function(index,val)
                            {
                                if($scope.agent_privileges[index].id==sessionStorage.getItem("ref_agent_contact_type_id"))
                                {
                                    $scope.agent_privileges[index].newpsd=null
                                }
                            })
                        }
                    }

                }
            })

            //輸錯次數
            $scope.socket.on('errorPWNum',function(data)
            {
                var data=data
                if(data.call_id==sessionStorage.getItem("call_id"))
                {
                    if(sessionStorage.getItem("user_group_type")==1)
                    {
                        $scope.ivr_failed_time=data.errorNum

                    }
                    else
                    {
                        $.each($scope.agent_privileges,function(index,val)
                        {
                            if($scope.agent_privileges[index].id==sessionStorage.getItem("ref_agent_contact_type_id"))
                            {
                                $scope.agent_privileges[index].ivr_failed_time=data.errorNum

                            }
                        })
                    }



                }
                /*               if(data.errorNum>3)
                 {
                 sessionStorage.setItem("agentLock",1)
                 }
                 else
                 {
                 sessionStorage.setItem("agentLock", 0)
                 }*/
            })

            //現場交易密碼狀態
            $scope.socket.on('xcpwIsSet',function(data)
            {
                var data=data
                if(data.xccall_id==sessionStorage.getItem("xccall_id"))
                {

                    if(sessionStorage.getItem("xcuser_group_type")==1)
                    {
                        if(data.pwIsSet=="1")
                        {
                            $scope.pwIsSetshow1=true
                        }
                        else
                        {
                            $scope.pwIsSetshow1=false
                        }
                    }
                    if(sessionStorage.getItem("xcuser_group_type")==2)
                    {
                        if(data.pwIsSet=="1")
                        {

                            $.each($scope.agent_privileges,function(index,val)
                            {

                                if($scope.agent_privileges[index].id==sessionStorage.getItem("xcref_agent_contact_type_id"))
                                {

                                    $scope.agent_privileges[index].newpsd=1
                                }
                            })

                        }
                        else
                        {
                            $.each($scope.agent_privileges,function(index,val)
                            {
                                if($scope.agent_privileges[index].id==sessionStorage.getItem("xcref_agent_contact_type_id"))
                                {
                                    $scope.agent_privileges[index].newpsd=null
                                }
                            })
                        }
                    }

                }
            })

            //現場輸錯次數
            $scope.socket.on('xcerrorPWNum',function(data)
            {
                var data=data
                if(data.xccall_id==sessionStorage.getItem("xccall_id"))
                {
                    if(sessionStorage.getItem("xcuser_group_type")==1)
                    {
                        $scope.ivr_failed_time=parseInt(data.errorNum)

                    }
                    else
                    {
                        $.each($scope.agent_privileges,function(index,val)
                        {
                            if($scope.agent_privileges[index].id==sessionStorage.getItem("xcref_agent_contact_type_id"))
                            {
                                $scope.agent_privileges[index].ivr_failed_time=parseInt(data.errorNum)

                            }
                        })
                    }



                }

            })
    }]).controller('agentIntegralDetailCtrl',['$scope','agent_integral','$modalInstance',
        function($scope,agent_integral,$modalInstance){

            if(agent_integral){
                $scope.agent_integral = agent_integral;
            }

            //关闭
            $scope.closed = function(){
                $modalInstance.close();
            }

   }]).controller('agentPasswordCreateCtrl',['$scope',
        function($scope){
            var original;
            var init_password = {
                "agent_info_id":"",
                "password":"",
                "comfirem_password":""
            }
            $scope.original = angular.copy(init_password);
            $scope.password = angular.copy(init_password);

            $scope.add = function(){

            }

            $scope.reset = function(){
                $scope.password = angular.copy(original);
            }


    }]).controller('agentPasswordUpdateCtrl',['$scope',
        function($scope){
            var original;
            var init_password = {
                "agent_info_id":"",
                "password":"",
                "comfirem_password":""
            }
            $scope.original = angular.copy(init_password);
            $scope.password = angular.copy(init_password);

            $scope.add = function(){

            }

            $scope.reset = function(){
                $scope.password = angular.copy(original);
            }


    }]).controller('agentCommonQuotaCtrl',['$scope','agent_info_id','quotaSetting','agentsLists','agentCommon','fundsTypes','agentType','tmsPagination','globalFunction','$modalInstance',
        function($scope,agent_info_id,quotaSetting,agentsLists,agentCommon,fundsTypes,agentType,tmsPagination,globalFunction,$modalInstance){

            $scope.agent_type_list = agentType.items;
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = quotaSetting;
            $scope.common_pagination = tmsPagination.create();
            $scope.common_pagination.resource = agentsLists;

            if(agent_info_id){
                agentsLists.get(globalFunction.generateUrlParams({id:agent_info_id},{parentSupervisor : {}})).$promise.then(function(agent){
                    if(agent){
                        var id = undefined !== agent.id ? '|' + agent.id : "";
                        $scope.agent_quotas = $scope.pagination.select(1, globalFunction.generateUrlParams({quota_id:agent.quota_id, sort : 'lower_amount DESC'},{}));
                        $scope.common_pagination.select(1, globalFunction.generateUrlParams({quota_id:agent.quota_id, id :id},{parentSupervisor : {}})).$promise.then(function(data){

                            if(agentCommon.id){
                                data.unshift(agent);
                            }
                            $scope.common_agents =data;
                        });
                    }
                });
            }
            $scope.funds = fundsTypes.query({type : 2}, function()
            {
                var obj = {};
                for(var i = 0, len= $scope.funds.length; i<len; i++)
                {
                    if(undefined !== $scope.funds[i].funds_name)
                    {
                        obj[$scope.funds[i].id] = $scope.funds[i].funds_name;
                    }
                }
                $scope.funds_expend = obj;
            });


            $scope.closed = function(){
                $modalInstance.close(true);
            }


    }]).controller("agentSceneRecordCtrl",['$scope','$modalInstance','rollingRecord','id','agentSceneStatus',
        function($scope,$modalInstance,rollingRecord,id,agentSceneStatus){
            $scope.remove =function(){
             $modalInstance.close();
            }
            $scope.print =function(){
              $modalInstance.close();

            }
            if(id){
                $scope.sceneRollings = rollingRecord.query({rolling_id:id});
            }
    }]).controller("agentTotalCtrl",['$scope','$http','qzPrinter','rolling','rollingType','currentShift','bookingState','printerType','flightType','getConsumption','consumption','consumption_total','depositTicket','depositCard','depositCardRecord','rollingRecord','consumptionHotelSub','consumptionFoodcoupon','consumptionHelicopter','consumptionBoat','consumptionFlight','consumptionCar','consumptionTicket','consumptionMiscellaneous','tmsPagination','globalFunction','$modalInstance','status','hall_id','depositTicketTypes','agent_info_id','hall_type','marker','depositCardRecordTypes','commissionRecordStatus','commissionRecord','agentTotal','year_month','topAlert',
        function($scope,$http,qzPrinter,rolling,rollingType,currentShift,bookingState,printerType,flightType,getConsumption,consumption,consumption_total,depositTicket,depositCard,depositCardRecord,rollingRecord,consumptionHotelSub,consumptionFoodcoupon,consumptionHelicopter,consumptionBoat,consumptionFlight,consumptionCar,consumptionTicket,consumptionMiscellaneous,tmsPagination,globalFunction,$modalInstance,status,hall_id,depositTicketTypes,agent_info_id,hall_type,marker,depositCardRecordTypes,commissionRecordStatus,commissionRecord,agentTotal,year_month,topAlert){
            $scope.bookingState_items = bookingState.items;
            $scope.flightType_items = flightType.items;
            $scope.depositTicketTypes = depositTicketTypes;
            $scope.commission_record_status = commissionRecordStatus;
            $scope.remove =function(){
                $modalInstance.close();
            }
            $scope.rollingType = rollingType;

                $scope.print =function(){

                if($scope.pagination_card_records[0].depositcard_id){
                    $scope.paramas = {
                        "depositcard_id":$scope.pagination_card_records[0].depositcard_id,
                        "hall_id":$scope.pagination_card_records[0].hall_id
                    }
                //$modalInstance.close();
                //qzPrinter.print('PDFQuickDepositCardRecord',printerType.laserPrinter,$scope.paramas).then(function(){
                //    topAlert.success('列印成功');
                //});
                    qzPrinter.print('PDFQuickDepositCardRecord',"",$scope.paramas,true).then(function(){
                        topAlert.success('列印成功');
                    });
           }
           }

            $scope.print_consumptionReport = function () {

                $scope.paramas_c = {
                    "agent_code":window.localStorage['consumption_code'],
                    "hall_id":hall_id,
                    "bookTimeBegin": window.localStorage['consumption_date']+"-01"
                }
                qzPrinter.print('TotalConsumptionReport',"",$scope.paramas_c,true).then(function(){
                    topAlert.success('列印成功');
                });
                //window.localStorage['consumption_code'] = '';
                //window.localStorage['consumption_date'] = '';
            }

            //貸款

            //判斷戶口類型、線頭類型、主線頭類型
            var markers_remark = function(data){

                _.each(data,function(ele,index,list){

                    var markerTerms = ele.markerTerms;

                    //判斷戶口類型、線頭類型、主線頭類型
                    var len = markerTerms.length;
                    if(len == 0){
                        ele.funds_type_remark = '工作碼';
                        ele.group_funds_type_remark = '工作碼';
                        ele.main_group_funds_type_remark = '工作碼';
                        ele.interest_type =  '工作碼';
                    }
                    for(var i = 1; i<=len; i++){
                        var terms_data = _.findWhere(markerTerms,{layer: i.toString()});
                        if(terms_data) {
                            if (len == 1) { //戶口類型（下線/貸款戶口）
                                ele.main_group_funds_type_remark = ele.funds_type_remark = terms_data.funds_type_remark;
                                ele.interest_type =  terms_data.interest_type;
                                //loan.main_group_funds_type_remark = loan.funds_type;//loan.group_funds_type_remark = "";
                            }

                            if (len == 2) { //線頭類型（內股）
                                if(i==1)
                                    ele.funds_type_remark = terms_data.funds_type_remark;
                                else
                                if(ele.agent_type==2)//内股
                                    ele.group_funds_type_remark = ele.funds_type_remark;
                                else
                                    ele.group_funds_type_remark = ele.parent_id ? terms_data.funds_type_remark : "";
                                    ele.main_group_funds_type_remark = terms_data.funds_type_remark;
                                ele.interest_type =  terms_data.interest_type;
                            }

                            if (len == 3) { //主線頭類型（上線）
                                if(i==1)
                                    ele.funds_type_remark = terms_data.funds_type_remark;
                                else if(i==2)
                                    ele.group_funds_type_remark = terms_data.funds_type_remark;
                                else
                                    ele.main_group_funds_type_remark = terms_data.funds_type_remark;
                                ele.interest_type =  terms_data.interest_type;
                            }

                            if(len==4){
                                if(i==1)
                                    ele.funds_type_remark = terms_data.funds_type_remark;
                                else if(i==3)
                                    ele.group_funds_type_remark = terms_data.funds_type_remark;
                                else if(i==4)
                                    ele.main_group_funds_type_remark = terms_data.funds_type_remark;
                                ele.interest_type =  terms_data.interest_type;
                            }
                        }
                    }

                });
            }

            $scope.pagination_loan = tmsPagination.create();
            $scope.pagination_loan.resource = marker;
            $scope.pagination_loan.items_per_page =10;
            $scope.pagination_loan.query_method = "query";
            $scope.select_loan = function(page){

                var condition;

                if(hall_type == '1'){
                    condition = {agent_info_id:agent_info_id,status:"|3",only_current_hall:"0"};
                }
                else{
                    condition = {agent_info_id:agent_info_id,hall_id:hall_id,status:"|3",only_current_hall:"0"};
                }


                $scope.pagination_loan.select(page,globalFunction.generateUrlParams(condition,{refMortgageMarker:{},markerTerms:{}})).$promise.then(function(data){

                    markers_remark(data);
                    $scope.unRepayments = data;

                });
            }
            //列印户口速查的户口匯總的貸款詳細
            //$scope.printAgentLoan = function(){
            //    var condition_pdf;
            //    if(hall_type == '1'){
            //        condition_pdf = {agent_info_id:agent_info_id,status:"|3",only_current_hall:"0"};
            //    }
            //    else{
            //        condition_pdf = {agent_info_id:agent_info_id,hall_id:hall_id,status:"|3",only_current_hall:"0"};
            //    }
            //    //打印還款單
            //    qzPrinter.print('PDFAgentLoan',"",condition_pdf).then(function(){
            //        topAlert.success('戶口匯總貸款詳細列印成功');
            //        $scope.isDisabled = false;
            //    },function(){
            //        $scope.isDisabled = false;
            //    })
            //}

            //格式化抵押金額
//            $scope.mortgage_format = function(marker_amount,not_mortgage){
//                var marker_amount = Number(marker_amount);
//                var not_mortgage = Number(not_mortgage);
//                //未抵押金額
//                if(not_mortgage==0){
//                    return "***";
//                }else if(marker_amount!=not_mortgage){
//                    return "*"+parseInt(marker_amount-not_mortgage)+"*";
//                }else{
//                    return "";
//                }
//            }
            //格式化抵押金額
            $scope.mortgage_format = function(settlement_marker_amount,refMortgageMarker){
                /*//貸款*号顯示
                settlement_marker_amount = Number(settlement_marker_amount); //贷款尚欠金额
                var mortgage_amount = 0;
                var settlement_mortgage_amount = 0;
                _.each(refMortgageMarker,function(_refMortgageMarker){
                    mortgage_amount +=Number(_refMortgageMarker.mortgage_amount); //抵押金额
                    settlement_mortgage_amount +=Number(_refMortgageMarker.settlement_amount); //抵押余额
                });

                //貸款尚欠等於抵押尚欠
                if(settlement_marker_amount==settlement_mortgage_amount){
                    return "***";
                }else if(mortgage_amount==0 || settlement_mortgage_amount==0){
                    return "";
                }else{
                    return "*"+parseInt(settlement_mortgage_amount)+"*";
                }*/
            }
            //消費總額
            $scope.consumption_total = consumption_total;
            //存單
            $scope.pagination_ticket = tmsPagination.create();
            $scope.pagination_ticket.resource = depositTicket;
            $scope.pagination_ticket.items_per_page =20;
            $scope.select_ticket = function(){
                if(hall_type == '1')
                    $scope.tickets = $scope.pagination_ticket.select(1, {agent_info_id: agent_info_id,only_current_hall: "0",depositTicket_settlement:"|0"});
                else
                    $scope.tickets = $scope.pagination_ticket.select(1, {agent_info_id: agent_info_id, hall_id: hall_id, only_current_hall: "0",depositTicket_settlement:"|0"});

            }
            //存卡
            $scope.card_status = ['2','3','5','7','9','11','12','13','14','15'];
            $scope.pagination_card_records  =[];
            $scope.depositCardRecordTypes = depositCardRecordTypes.items;
            $scope.pagination_card = tmsPagination.create();
            $scope.pagination_card.resource = depositCard;
            $scope.pagination_card.max_size = 4;
//            $scope.pagination_card.items_per_page =20;
            $scope.select_card = function(page){
                if(hall_type == '1')
                    $scope.deposit_cards = $scope.pagination_card.select(page,{agent_info_id:agent_info_id,only_current_hall:"0",hide_empty_card :"1"/*,usable_amount:"|0"*/});
                else
                    $scope.deposit_cards = $scope.pagination_card.select(page,{agent_info_id:agent_info_id,hall_id:hall_id,only_current_hall:"0",hide_empty_card:"1"/*,usable_amount:"|0"*/});
            }
            $scope.pagination_card_record = tmsPagination.create();
            $scope.pagination_card_record.resource = depositCardRecord;
//            $scope.pagination_card_record.items_per_page =20;
            $scope.pagination_card_record.max_size = 4;
            $scope.select_card_record = function(page){
                if(angular.isUndefined($scope.current_card)){
                    $scope.pagination_card_records = [];
                    return;
                }
                if(hall_type == '1')
                    $scope.pagination_card_records = $scope.pagination_card_record.select(page,{only_current_hall:"0",depositcard_id:$scope.current_card.id, sort:"transaction_time DESC"});
                else
                    $scope.pagination_card_records = $scope.pagination_card_record.select(page,{hall_id:hall_id,only_current_hall:"0",depositcard_id:$scope.current_card.id, sort:"transaction_time DESC"});

            }
            $scope.cardDetail = function(card){
                $scope.current_card = card;
                $scope.select_card_record(1);
            }
            //轉碼各個廳館



            //$scope.pagination_rolling_detail = tmsPagination.create();
            //$scope.pagination_rolling_detail = rollingRecord.rollingRecordDetailTotal;
            ////$scope.pagination_rolling_tetail.items_per_page = 10;
            //$scope.pagination_rolling_detail.query_method = 'rollingRecordDetailTotal';
            //$http.get(globalFunction+'rolling/rollingrecord/rolling-record-totals')


            //獲取分卡數據
            //$scope.select_rollings = function (e) {
            //    //$scope.rolling_detail = angular.copy(e);
            //}
            //根據不用的轉碼卡獲取不同的數據展示到右邊的列表中
            $scope.up_total = 0;
            $scope.conditions_detail = {
                hall_id: "",
                agent_info_id: agent_info_id,
                agent_group_name: "",
                chips_type: "",
                type:"agent",
                //is_amount:1,
                year_month:[],
                sort: "agent_code NUMASC,card_name NUMASC"
            }

            $scope.conditions_detail.year_month[0] =  window.localStorage['bumber']+"-01"

            //轉碼匯總數
            /*$scope.pagination = tmsPagination.create();
             $scope.pagination.resource = commissionCard;
             $scope.pagination.query_method = "cardLists";*/


            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = rolling;
            $scope.pagination.query_method = "rollingSum";
            $scope.select_rolling_detail = function(page){
                $scope.up_total = 0;

                if(status == "rolling_a"){
                    //if(hall_id == "0493728BB89506C6E0539715A8C0267D") {

                        $scope.conditions_detail.chips_type = 1;
                        $scope.conditions_detail.hall_id = hall_id;


                        $scope.rollings_detail = $scope.pagination.select(page,$scope.conditions_detail);
                        $scope.rollings_detail.$promise.then(function(data){
                            $scope.rollings_detail=data;
                            _.each($scope.rollings_detail,function(data){

                                $scope.up_total = Number($scope.up_total)+Number(data.rollingCard_amount);
                                $scope.up_total = $scope.up_total.toFixed(2);

                            })
                            if($scope.up_total.substring($scope.up_total.length-3,$scope.up_total.length) == ".00"){
                                $scope.up_total = $scope.up_total.substring(0,$scope.up_total.length-3);
                            }else if($scope.up_total.substring($scope.up_total.length-1,$scope.up_total.length) == "0"){
                                $scope.up_total = $scope.up_total.substring(0,$scope.up_total.length-1);
                            }
                        })



                    }else{

                        $scope.conditions_detail.chips_type = 2;
                        $scope.conditions_detail.hall_id = hall_id;


                        $scope.rollings_detail = $scope.pagination.select(page,$scope.conditions_detail);
                        $scope.rollings_detail.$promise.then(function(data){
                                    $scope.rollings_detail=data;
                                    _.each($scope.rollings_detail,function(data){

                                        $scope.up_total = Number($scope.up_total)+Number(data.rollingCard_amount);
                                        $scope.up_total = $scope.up_total.toFixed(2);

                                    })
                            if($scope.up_total.substring($scope.up_total.length-3,$scope.up_total.length) == ".00"){
                                $scope.up_total = $scope.up_total.substring(0,$scope.up_total.length-3);
                            }else if($scope.up_total.substring($scope.up_total.length-1,$scope.up_total.length) == "0"){
                                $scope.up_total = $scope.up_total.substring(0,$scope.up_total.length-1);
                            }
                                })

                    }

                //$scope.up_total = $scope.up_total.toFixed(2);


            }
                //轉碼詳情
            $scope.show_Detail = function (e) {
                $scope.hall_name = e.hall_name;
                $scope.pagination_rolling = tmsPagination.create();
                $scope.pagination_rolling.resource = rollingRecord;
                //$scope.pagination_rolling.query_method = 'rollingRecordTotal';
                $scope.pagination_rolling.items_per_page = 10;
                console.log(e);
                if(e.chips_type == 1){


                }

                var init_condition_detail = {
                    hall_id: e.hall_id,
                    //rollingCard_amount_id: e.rollingCard_amount_id,
                    agent_code: e.agent_code,
                    card_name: e.card_name,
                    chips_type: e.chips_type,
                    //agent_info_id: agent_info_id,
                    //is_offset: 0,
                    //card_name: e.card_name,
                    //agentGroup:{
                    //    agent_group_name: ""
                    //},
                    shiftMark:{
                        settlementMonth:{year_month:[window.localStorage['bumber']+"-01"]},
                        //shift_date:['',''],
                        //shift : ""
                    },
                    //agent_name: '',
                    //sort:"roll_time DESC,rolling DESC"
                };

                $scope.select_rolling = function(page){

                    if(status == "rolling_a"){
                        if(hall_id == "0493728BB89506C6E0539715A8C0267D") {
                            $scope.rollings = $scope.pagination_rolling.select(page, init_condition_detail);

                            //$scope.select_rollings($scope.rollings);
                            //$scope.rollings =  $scope.rollings.reverse();
                        }else{
                            //init_condition_detail.hall_id = hall_id
                            $scope.rollings = $scope.pagination_rolling.select(page,init_condition_detail)
                            //$scope.select_rollings($scope.rollings);
                            //$scope.rollings =  $scope.rollings.reverse();

                        }
                    }
                    else{
                        if(hall_id == "0493728BB89506C6E0539715A8C0267D") {
                            $scope.rollings = $scope.pagination_rolling.select(page,init_condition_detail);
                            //$scope.select_rollings($scope.rollings);
                            //$scope.rollings =  $scope.rollings.reverse();

                        }else{
                            //init_condition_detail.hall_id = hall_id
                            $scope.rollings = $scope.pagination_rolling.select(page,init_condition_detail);


                        }
                    }


                };
                $scope.select_rolling();

            }



            //轉碼詳細
            $scope.rollingDetail = function(rolling){
                $scope.show_Detail();

            }
            //$scope.rollingDetail();

            //佣金
            $scope.pagination_commission = tmsPagination.create();
//            $scope.pagination_commission.resource = commissionRecord;
            $scope.pagination_commission.resource = agentTotal;//commissionRecordSub;
            $scope.pagination_commission.query_method = 'agentCommissionDetail';
            $scope.select_commission = function(page){ //, only_current_hall:"0"
                var year_month_r = year_month ? year_month+"-01" : "";
                if(hall_type == '1'){ //集團
                    $scope.commissionRecords = $scope.pagination_commission.select(page,{agent_info_id: agent_info_id,year_month:year_month_r,hall_id:hall_id});
                }else{
                    $scope.commissionRecords = $scope.pagination_commission.select(page,{agent_info_id:agent_info_id,year_month:year_month_r,hall_id:hall_id});
                }
            }
            //根据 url 参数 改变 views
            $scope.tabs = {
                hotel : false,
                food: false,
                helicopter: false,
                ship: false,
                air: false,
                car: false,
                ticket: false,
                other: false
            }
            $scope.type = 'HOTEL';
            //消費
/*            $scope.tabClick = function(type) {
                $scope.type = type;
                $scope.select(1,type);
            }*/


/*            $scope.pagination =tmsPagination.create();
            $scope.pagination.resource = consumption;
            $scope.pagination.query_method = 'get-consumption-record';
            $scope.pagination.items_per_page =10;
            $scope.select = function(page,type){
                $scope.condition = {
//                    consumptionType:{consumption_code:type},
                    year_month:year_month[0],
                    agent_info_id:agent_info_id,
                    only_current_hall:"0",
                    hall_id:hall_id
                }
                if(hall_type == '1'){ //集團
                    $scope.consumptions = $scope.pagination.select(page,{year_month:year_month[0],agent_info_id:agent_info_id, only_current_hall:"0",sort:"book_time DESC"});
                }else{
                    $scope.consumptions = $scope.pagination.select(page,{year_month:year_month[0],agent_info_id:agent_info_id, only_current_hall:"0",hall_id:hall_id,sort:"book_time DESC"});
                }

//                if(hall_type == '1'){ //集團
//                    $scope.consumptions = $scope.pagination.select(page,$scope.condition);
//                }else{
//                    $scope.consumptions = $scope.pagination.select(page,$scope.condition);
//                }

//                $scope.consumptions =  $scope.pagination.select(page,$scope.condition);
            }*/

            //点击 tab  切换界面 搜索出相关信息
            $scope.tabClick = function(name) {
                Get_booking_data(name);
                $scope.type = name;
            }
            function Get_booking_data(name)
            {
                var tab_content_list = $scope[name.toLowerCase() + 'Bookings'];
                var search_method = $scope[name.toLowerCase() + '_search'];
                if (!!tab_content_list && !tab_content_list.length)
                {
                    search_method();
                }
            }

            function getConsumptionSummary()
            {
                var condition = {
                    year_month:year_month,
                    agent_info_id:agent_info_id,
                    hall_id:hall_type == '1'?null:hall_id
                }
                $scope.consumption_summary = consumption.getConsumptionSummary(condition);
            }
            $scope.getConsumptionSummary = function(type){
                if( $scope.consumption_summary[type])
                    return $scope.consumption_summary[type].record_total;
                else
                    return 0;
            }
            /*
             *  TAB hotel 酒店  ---------------------------------------------
             */
            $scope.hotel_page = tmsPagination.create();
            $scope.hotel_page.resource = consumptionHotelSub;
            $scope.hotelBookings = [];
            $scope.condition_hotel = {
                consumptionHotel :{
                    consumption : {
                        year_month :year_month,
                        agent_info_id:agent_info_id
                    },
                    hall_id:hall_type == '1'?null:hall_id
                },
                only_current_hall:"0",
                sort:'create_time DESC'
            }
            //酒店查询按钮
            $scope.hotel_search = function(page)
            {
                $scope.hotelBookings = $scope.hotel_page.select(page,$scope.condition_hotel, {consumptionHotel : { consumptionHotelRegisters : "", consumption : "" }});

            }
            //$scope.hotel_search();
            /*
             *  TAB food 食飞 ---------------------------------------------
             */
            $scope.food_page = tmsPagination.create();
            $scope.food_page.resource = consumptionFoodcoupon;
            $scope.foodBookings = [];
            $scope.condition_food = {
                consumption : {
                    year_month:year_month,
                    agent_info_id:agent_info_id
                },
                hall_id:hall_type == '1'?null:hall_id,
                only_current_hall:"0",
                sort:'consumption.book_time DESC'
            }
            //食飛查询按钮
            $scope.food_search = function(page)
            {
                $scope.foodBookings = $scope.food_page.select(page,$scope.condition_food,{consumption : {}});
            }
            /*
             *  TAB helicopter 直升機 ---------------------------------------------
             */
            $scope.helicopter_page = tmsPagination.create();
            $scope.helicopter_page.resource = consumptionHelicopter;
            $scope.helicopterBookings = [];
            $scope.condition_helicopter = {
                consumption : {
                    year_month:year_month,
                    agent_info_id:agent_info_id
                },
                hall_id:hall_type == '1'?null:hall_id,
                only_current_hall:"0",
                sort:'consumption.book_time DESC'
            }
            //直升機查询按钮
            $scope.helicopter_search = function(page)
            {
                $scope.helicopterBookings = $scope.helicopter_page.select(page,$scope.condition_helicopter,{consumption : {}, helicoptertrip : {}});
            }

            /*
             *  TAB ship 船票 ---------------------------------------------
             */
            $scope.ship_page = tmsPagination.create();
            $scope.ship_page.resource = consumptionBoat;
            $scope.shipBookings = [];
            $scope.condition_ship = {
                consumption : {
                    year_month:year_month,
                    agent_info_id:agent_info_id
                },
                hall_id:hall_type == '1'?null:hall_id,
                only_current_hall:"0",
                sort:'consumption.book_time DESC'
            }
            //船票查询按钮
            $scope.ship_search = function(page)
            {
                $scope.shipBookings = $scope.ship_page.select(page, $scope.condition_ship,{consumption : {}});
            }
            /*
             *  TAB air 機票 ---------------------------------------------
             */
            $scope.air_page = tmsPagination.create();
            $scope.air_page.resource = consumptionFlight;
            $scope.airBookings = [];
            $scope.condition_air = {
                consumption : {
                    year_month:year_month,
                    agent_info_id:agent_info_id
                },
                hall_id:hall_type == '1'?null:hall_id,
                only_current_hall:"0",
                sort:'consumption.book_time DESC'
            }
            //機票查询按钮
            $scope.air_search = function(page)
            {
                $scope.airBookings = $scope.air_page.select(page, $scope.condition_air,{consumption : {}});
            }
            /*
             *  TAB car 租车 ---------------------------------------------
             */
            $scope.car_page = tmsPagination.create();
            $scope.car_page.resource = consumptionCar;
            $scope.carBookings = [];
            $scope.condition_car = {
                consumption : {
                    year_month:year_month,
                    agent_info_id:agent_info_id
                },
                hall_id:hall_type == '1'?null:hall_id,
                only_current_hall:"0",
                sort:'consumption.book_time DESC'
            }
            //租车查询按钮
            $scope.car_search = function(page)
            {
                $scope.carBookings = $scope.car_page.select(page, $scope.condition_car,{consumption : {}});
            }
            /*
             *  TAB ticket 門票 ---------------------------------------------
             */
            $scope.ticket_page = tmsPagination.create();
            $scope.ticket_page.resource = consumptionTicket;
            $scope.ticketBookings = [];
            $scope.condition_ticket = {
                consumption : {
                    year_month:year_month,
                    agent_info_id:agent_info_id
                },
                hall_id:hall_type == '1'?null:hall_id,
                only_current_hall:"0",
                sort:'consumption.book_time DESC'
            }
            //門票查询按钮
            $scope.ticket_search = function(page)
            {

                $scope.ticketBookings = $scope.ticket_page.select(page, $scope.condition_ticket,{consumption : {}});
            }
            /*
             *  TAB other 其他 ---------------------------------------------
             */
            $scope.other_page = tmsPagination.create();
            $scope.other_page.resource = consumptionMiscellaneous;
            $scope.otherBookings = [];
            $scope.condition_other = {
                consumption : {
                    year_month:year_month,
                    agent_info_id:agent_info_id
                },
                hall_id:hall_type == '1'?null:hall_id,
                only_current_hall:"0",
                sort:'consumption.book_time DESC'
            }
            //其他查询按钮
            $scope.other_search = function(page)
            {
                $scope.otherBookings = $scope.other_page.select(page, $scope.condition_other,{consumption : {}});
            }

            if(status == 'loan'){
                $scope.select_loan();
            }else if(status == 'ticket'){
                $scope.select_ticket();
            }else if(status == 'card'){
                $scope.select_card();
            }else if(status == 'rolling_a'){
                if(hall_type == 1){
                    $scope.select_rolling_detail();
                }else{
                    //$scope.select_rolling();
                    $scope.select_rolling_detail();
                }
            }
            else if(status == 'rolling_b'){
                if(hall_type == 1){
                    $scope.select_rolling_detail();
                }else{
                    //$scope.select_rolling();
                    $scope.select_rolling_detail();
                }
            }
            else if(status=="commission"){
                $scope.select_commission();
            }else{
                $scope.tabs[$scope.type] = true;
                Get_booking_data($scope.type);
                getConsumptionSummary();
                // $scope.select(1, $scope.type);
            }

        }]).controller('agentOverdueChargeCtrl',['$scope','markerFee','tmsPagination','markerStatus','agent_code',
            function($scope,markerFee,tmsPagination,markerStatus,agent_code){

                //過期手續費
                $scope.pagination = tmsPagination.create();
                $scope.pagination.resource = markerFee;
                $scope.markerExpiredFeeStatus = markerStatus.items; //過期手續費狀態

                $scope.select = function(page){

                    $scope.pagination.select(page,{only_current_hall:"0",status:"|3",outAgent:{agent_code:agent_code}},{marker:{markerTerms:""}}).$promise.then(function(data){

                       $scope.markers = data;

                    });
                }
                if(agent_code){
                    $scope.select(1);
                }

        }]).controller('agentMessageDetailCtrl',['$scope','agentOrders','globalFunction','$modalInstance','messages','id','OrderPriority','orderTypes',
        function($scope,agentOrders,globalFunction,$modalInstance,messages,id,OrderPriority,orderTypes){
            $scope.orderTypes = orderTypes;

            $scope.order_prioritys = OrderPriority.items;
            agentOrders.get(globalFunction.generateUrlParams({id:id},{modules:{},agentGroups:{},refOrderGroups:{},refOrderAgents:{}})).$promise.then(function(order){
                $scope.order = order;
            })
            $scope.closeed = function(){
                $modalInstance.close();
            }

    }]).controller('agentRemarkCreateCtrl',['$scope','agentRemark','departMent','globalFunction','$modalInstance','id','topAlert',
        function($scope,agentRemark,departMent,globalFunction,$modalInstance,id,topAlert){
            //自定義變量
           $scope.enableClientValidation = true;
           departMent.query().$promise.then(function(departMents){
               $scope.departMents = departMents;
               $scope.departMents.splice(0,0,{id:"DEPARTMENT_ALL",department:"全部"});
           });//部門
            $scope.create_remark_url = globalFunction.getApiUrl('agent/agentremark');
            var original;
            var init_remark = {
              "agent_info_id":id,
              "content":"",
              "department_id":"",
              "type":"1",
              "pin_code":""
            }
            original = angular.copy(init_remark);
            $scope.remark = angular.copy(init_remark);
            //添加備註
            $scope.add = function(){
                if($scope.remark.agent_info_id != null){
                    $scope.form_create_remark.checkValidity().then(function() {
                        agentRemark.save($scope.remark, function () {
                            topAlert.success('新增成功!');
                            $modalInstance.close(true);
                        })
                    });
                }else{
                    topAlert.warning("請輸入戶口編號!");
                }
            }
            //重置備註
            $scope.reset = function(){
                $scope.form_create_remark.$setPristine();
                $scope.remark= angular.copy(original);
            }
    }]).controller('agentShowLoanCtrl',['$scope','marker','tmsPagination','agentQuota','$modalInstance','topAlert','globalFunction',
        function($scope,marker,tmsPagination,agentQuota,$modalInstance,topAlert,globalFunction){

            var markers_remark = function(data){

                _.each(data,function(ele,index,list){

                    var markerTerms = ele.markerTerms;

                    //判斷戶口類型、線頭類型、主線頭類型
                    var len = markerTerms.length;
                    if(len == 0){
                        ele.funds_type_remark = '工作碼';
                        ele.group_funds_type_remark = '工作碼';
                        ele.main_group_funds_type_remark = '工作碼';
                        ele.interest_type =  '工作碼';
                    }
                    for(var i = 1; i<=len; i++){
                        var terms_data = _.findWhere(markerTerms,{layer: i.toString()});
                        if(terms_data) {
                            if (len == 1) { //戶口類型（下線/貸款戶口）
                                ele.main_group_funds_type_remark = ele.funds_type_remark = terms_data.funds_type_remark;
                                ele.interest_type =  terms_data.interest_type;
                                //loan.main_group_funds_type_remark = loan.funds_type;//loan.group_funds_type_remark = "";
                            }

                            if (len == 2) { //線頭類型（內股）
                                if(i==1)
                                    ele.funds_type_remark = terms_data.funds_type_remark;
                                else
                                    if(ele.agent_type==2)//内股
                                        ele.group_funds_type_remark = ele.funds_type_remark;
                                    else
                                        ele.group_funds_type_remark = ele.parent_id ? terms_data.funds_type_remark : "";
                                        ele.main_group_funds_type_remark = terms_data.funds_type_remark;
                                ele.interest_type =  terms_data.interest_type;
                            }

                            if (len == 3) { //主線頭類型（上線）
                                if(i==1)
                                    ele.funds_type_remark = terms_data.funds_type_remark;
                                else if(i==2)
                                    ele.group_funds_type_remark = terms_data.funds_type_remark;
                                else
                                    ele.main_group_funds_type_remark = terms_data.funds_type_remark;
                                ele.interest_type =  terms_data.interest_type;
                            }

                            if(len==4){
                                if(i==1)
                                    ele.funds_type_remark = terms_data.funds_type_remark;
                                else if(i==3)
                                    ele.group_funds_type_remark = terms_data.funds_type_remark;
                                else if(i==4)
                                    ele.main_group_funds_type_remark = terms_data.funds_type_remark;
                                ele.interest_type =  terms_data.interest_type;
                            }
                        }
                    }
                });
            }

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = marker;
            $scope.pagination.items_per_page =12;
            if(agentQuota.type == '3' && agentQuota.is_special_underling == '0'){
                //type等于3
                $scope.pagination.query_method = "followerUnRepayment";
            }else{
                //type不等于3
                $scope.pagination.query_method = "unRepayment";
            }
            $scope.select = function(page){

                var condition;
                if(agentQuota.type == '3') {
                    if(agentQuota.quota.length>0){
                        condition = {agent_info_id: agentQuota.agent_info_id,quota_id: agentQuota.quota[0].quota_id,status:"|3",only_current_hall:"0",sort:"agent_code"};
                    }else{
                        condition = {agent_info_id: agentQuota.agent_info_id,status:"|3",only_current_hall:"0",sort:"agent_code"};
                    }
                }else{
                    condition = {agent_info_id: agentQuota.agent_info_id,status:"|3",only_current_hall:"0",sort:"agent_code"};
                }

                $scope.pagination.select(page,globalFunction.generateUrlParams(condition,{refMortgageMarker:{},markerTerms:{}})).$promise.then(function(data){
                    markers_remark(data);
                    $scope.unRepayments = data;
                });

            }
            $scope.select();

            //關閉
            $scope.close = function(){
                $modalInstance.close();
            }

            //格式化抵押金額
//            $scope.mortgage_format = function(marker_amount,not_mortgage){
//                var marker_amount = Number(marker_amount);
//                var not_mortgage = Number(not_mortgage);
//                //未抵押金額
//                if(not_mortgage==0){
//                    return "***";
//                }else if(marker_amount!=not_mortgage){
//                    return "*"+parseInt(marker_amount-not_mortgage)+"*";
//                }else{
//                    return "";
//                }
//            }

            //格式化抵押金額
            $scope.mortgage_format = function(settlement_marker_amount,refMortgageMarker){
                /*settlement_marker_amount = Number(settlement_marker_amount); //贷款尚欠金额
                var mortgage_amount = 0;
                var settlement_mortgage_amount = 0;
                _.each(refMortgageMarker,function(_refMortgageMarker){
                    mortgage_amount +=Number(_refMortgageMarker.mortgage_amount); //抵押金额
                    settlement_mortgage_amount +=Number(_refMortgageMarker.settlement_amount); //抵押余额
                });

                //貸款尚欠等於抵押尚欠
                if(settlement_marker_amount==settlement_mortgage_amount){
                    return "***";
                }else if(mortgage_amount==0 || settlement_mortgage_amount==0){
                    return "";
                }else{
                    return "*"+parseInt(settlement_mortgage_amount)+"*";
                }*/
            }


    }]).controller('agentHobbiesShowCtrl',['$scope','agent_hobbys','$modalInstance',
        function($scope,agent_hobbys,$modalInstance){
            if(agent_hobbys){
                $scope.agent_hobbys =  agent_hobbys;
            }
            $scope.closeed = function(){
                $modalInstance.close();
            }

    }]).controller('agentHobbiesCreateCtrl',['$scope','agentHobby','globalFunction','$modalInstance','hobbies','agent_info_id','id','title','topAlert',
        function($scope,agentHobby,globalFunction,$modalInstance,hobbies,agent_info_id,id,title,topAlert){
            //自定義變量
            $scope.enableClientValidation = false;
            $scope.create_hobby_url = globalFunction.getApiUrl('agent/agenthobby');
            $scope.sub_post_put = 'POST';
            $scope.title = title;
            var original;
            $scope.hobbies = {
              agent_info_id:agent_info_id,
              "content":"",
              "type":"",
              "pin_code":""
            }
            original = angular.copy($scope.hobbies);
            if(id){
                $scope.sub_post_put = 'PUT';
                 agentHobby.get({id:id}).$promise.then(function(hobbies){
                     $scope.hobbies =hobbies;
                     $scope.reset_hobbies = angular.copy($scope.hobbies);
                 });

            }

            $scope.add = function(){
                if(id){
                    $scope.form_hobby.checkValidity().then(function() {
                        agentHobby.update($scope.hobbies, function () {
                            topAlert.success('修改成功!');
                            $modalInstance.close(true);
                        })
                    });
                }else{
                    $scope.form_hobby.checkValidity().then(function() {
                        agentHobby.save($scope.hobbies, function () {
                            topAlert.success('新增成功!');
                            $modalInstance.close(true);
                        })
                    });
                }
            }

            $scope.reset = function(){
                if(id){
                    $scope.hobbies = angular.copy($scope.reset_hobbies);
                    $scope.form_hobby.clearErrors();
                }else{
                      $scope.hobbies = angular.copy(original);
                      $scope.form_hobby.$setPristine();
                      $scope.form_hobby.clearErrors();
                }
            }

    }]).controller('agentCreateCtrl',['$scope','smsnoticeType','$upload','agentsLists','agentContact','agentsValidate','agentCompcontact','nationaLity','languageType','idcardType','areaCode','departMent','globalFunction','$stateParams','breadcrumb','idCardType','$location','$filter','topAlert','getDate',
        function($scope,smsnoticeType,$upload,agentsLists,agentContact,agentsValidate,agentCompcontact,nationaLity,languageType,idcardType,areaCode,departMent,globalFunction,$stateParams,breadcrumb,idCardType,$location,$filter,topAlert,getDate){
            $scope.img1="";
            $scope.img2="";
            $scope.onFileSelect = function($files) {
                    var file = $files[0];
                    $scope.upload = $upload.upload({
                        url: globalFunction.getApiUrl('agent/agentcontact/upload-id-card-image?PHPSESSID='+sessionStorage.token), //upload.php script, node.js route, or servlet url
                        file: file
                    }).progress(function(evt) {
                    }).success(function(data, status, headers, config) {
                        $scope.img1 = data.url;
                        if(!angular.isUndefined($scope.agent.agentMaster.idcardImages[0])){
                            $scope.agent.agentMaster.idcardImages[0].image_path = data.path;
                        }else{
                            $scope.agent.agentMaster.idcardImages.push({"image_path":data.path,"file_type":"jpg"});
                        }

                    });
            };
            //刪除圖片1
            $scope.removeImg1 = function(){
                $scope.img1 = "";
                $scope.agent.agentMaster.idcardImages.splice(0,1);
            }
            $scope.onFileSelect2 = function($files) {
                var file = $files[0];
                $scope.upload = $upload.upload({
                    url: globalFunction.getApiUrl('agent/agentcontact/upload-id-card-image?PHPSESSID='+sessionStorage.token), //upload.php script, node.js route, or servlet url
                    file: file
                }).progress(function(evt) {

                }).success(function(data, status, headers, config) {
                    $scope.img2 = data.url;
                    if(!angular.isUndefined($scope.agent.agentMaster.idcardImages[1])){
                        $scope.agent.agentMaster.idcardImages[1].image_path = data.path;
                    }else{
                        $scope.agent.agentMaster.idcardImages.push({"image_path":data.path,"file_type":"jpg"});
                    }
                });
            };
            //刪除圖片1
            $scope.removeImg2 = function(){
                $scope.img2 = "";
                $scope.agent.agentMaster.idcardImages.splice(1,1);
            }
            //建議戶口編號
            $scope.agentsValidate = function(){
                if($scope.agent.agent_code){
                    agentsValidate.get({agent_code:$scope.agent.agent_code}).$promise.then(function(data){
                        $scope.agentsValidates = data;
                    })
                }
            }
            //麵包屑導航
            if(angular.isUndefined($stateParams.id)){
                breadcrumb.items = [
                  {"name":"新增戶口","active":true}
                ];
            }else{
                breadcrumb.items = [
                  {"name":"户口列表","url":'agent/list'},
                  {"name":"戶口修改","active":true}
                ];
            }
            //自定義變量
            $scope.now_data = getDate(new Date());//獲取當前日期用於證件照片過期比較
            $scope.agent_id = '';
            $scope.idcards = idCardType.items ;//證件類型
            //$scope.smsnoticeTypes =  smsnoticeType.query();//通知類型
            $scope.nationalitys = nationaLity.query();//國籍數據
            $scope.idcardTypes = idcardType.query();//證件
            $scope.areaCodes = areaCode.query();//地區
            $scope.languageTypes = languageType.query();//語言
            departMent.query().$promise.then(function(departMents){
                $scope.departMents = departMents;
                $scope.departMents.splice(0,0,{id:"DEPARTMENT_ALL",department:"全部"});
            });//部門
            $scope.contacts =agentCompcontact.query()//聯絡人

            $scope.sub_post = "POST";//判斷戶口是修改PUT,增加POST
            $scope.agent_url = globalFunction.getApiUrl('agent/agent');//數據驗證API
            $scope.introducer_contion = {agent_code:"" };

            //初始化對象
            var original;
            var init_agent = {
                "agent_code": "",
                "introducer": null,
                "introducer_agent_id":"",
                "introducer_agent_code":"",
                "pin_code":"",
                "agentMaster":{
                    "agent_contact_name": "",
                    "nationality_id":"",
                    "language_type_id":"",
                    "birthdate":"",
                    "gender":"1",
                    "address":"",
                    occupation:"",

                    "idcardImages":[{
                        "image_path":"",
                        "file_type":"jpg"
                        },{
                        "image_path":"",
                        "file_type":"jpg"
                    }],
                    "agentContactIdcards":[{
                        "idcard_type_id": "",
                        "idcard_number": "",
                        "expire_date":""
                        },{
                        "idcard_type_id": "",
                        "idcard_number": "",
                        "expire_date":""
                    }]
                },
                "agentRemarks": [{
                    "content":"",
                    "department_id":""
                }],
                "refTelAgentMasterNoticeType": [{
                    "notice_type": "",
                    "agentContactTel": {
                        "telephone_number": "",
                        "area_code_id": "",
                        "remark": ""
                    }
                }],
                "refAgentComps":[{"comp_contact_id":""}]
            };
            $scope.agent_contact_filter= {
                "agent_code": "",
                "introducer": null,
                "introducer_agent_id":"",
                "introducer_agent_code":"",
                "pin_code":"",
                "comp_contact_id":"",
                "agent_master_id":"",
                "agentRemarks": [],
                "refTelAgentMasterNoticeType": [],
                "refAgentComps":[]
            };
            $scope.contactsIdCards ={
                "idcard_type_id": [],
                "idcard_number": [],
                "expire_date": []
            };

            original = angular.copy(init_agent);
            $scope.agent = angular.copy(init_agent);
            //監控戶口編號 當戶口編號 存在時 提示
            $scope.$watch('agent.agent_code',globalFunction.debounce(function(new_value,old_value){
                if( !$scope.agent.id && new_value){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code:new_value}, {})).$promise.then(function (agents) {
                        if(agents.length > 0){
                           topAlert.warning(new_value+"戶口編號已存在!");
                        }
                    });
                }
            },350));

            //增加聯絡資料跟刪除聯絡資料
            $scope.addContactInfo =function(){
                $scope.agent.refTelAgentMasterNoticeType.push({"notice_type": "", "agentContactTel": {"telephone_number": "","area_code_id": "","remark": ""}});
            }
            $scope.removeContactInfo=function(index){
                $scope.agent.refTelAgentMasterNoticeType.splice(index,1);
            }
            //增加戶口備註跟修改戶口備註
            $scope.addRemark =function(){
                $scope.agent.agentRemarks.push({ "content":"", "department_id":""});
            }
            $scope.removeRemark=function(index){
                $scope.agent.agentRemarks.splice(index,1);
            }
            //增加聯絡人
            $scope.addContact = function(){
                $scope.agent.refAgentComps.push({"comp_contact_id":""});
            }
            $scope.removeContact = function(index){
                $scope.agent.refAgentComps.splice(index,1);
            }
            //新增戶口
            $scope.disabled_submit = false;
            //控制聯絡資料的样式
            $scope.notice_type=false;
            $scope.area_code_id=false;
            $scope.telephone_number=false;
            $scope.add = function(){

                if($scope.disabled_submit){
                    return $scope.disabled_submit;
                }
                $scope.agent_c = angular.copy($scope.agent);
                if($scope.agent.introducer_agent_code && !$scope.agent.introducer_agent_id){
                    topAlert.warning("介紹人必須是其它戶口姓名!");
                    return;
                }
                $scope.agent_c.agentMaster.birthdate=  $filter('date')($scope.agent.agentMaster.birthdate, 'yyyy-MM-dd');
                _.each($scope.agent_c.agentMaster.idcardImages,function(image,index){

                    if(image && image.image_path == '')
                        $scope.agent_c.agentMaster.idcardImages.splice(index, 1);
                });
                if(!angular.isUndefined($scope.agent_c.agentMaster.idcardImages[0])) {
                    if ($scope.agent_c.agentMaster.idcardImages[0].image_path == ''){
                        $scope.agent_c.agentMaster.idcardImages = [];
                    }
                }
                for(var i = 0; i < $scope.agent_c.refTelAgentMasterNoticeType.length;i++){
                    if(($scope.agent_c.refTelAgentMasterNoticeType[i].notice_type == '' || $scope.agent_c.refTelAgentMasterNoticeType[i].notice_type == null) && ($scope.agent_c.refTelAgentMasterNoticeType[i].agentContactTel.telephone_number == '' || $scope.agent_c.refTelAgentMasterNoticeType[i].agentContactTel.telephone_number == null) && ($scope.agent_c.refTelAgentMasterNoticeType[i].agentContactTel.area_code_id == '' || $scope.agent_c.refTelAgentMasterNoticeType[i].agentContactTel.area_code_id == null)){
                        $scope.agent_c.refTelAgentMasterNoticeType.splice(i,1);
                        i = 0;
                    }
                }

                if(!angular.isUndefined($scope.agent_c.refTelAgentMasterNoticeType[0])){
                    if(($scope.agent_c.refTelAgentMasterNoticeType[0].notice_type == '' || $scope.agent_c.refTelAgentMasterNoticeType[0].notice_type == null) && ($scope.agent_c.refTelAgentMasterNoticeType[0].agentContactTel.telephone_number == '' || $scope.agent_c.refTelAgentMasterNoticeType[0].agentContactTel.telephone_number == null) && ($scope.agent_c.refTelAgentMasterNoticeType[0].agentContactTel.area_code_id == '' || $scope.agent_c.refTelAgentMasterNoticeType[0].agentContactTel.area_code_id == null)){
                        $scope.agent_c.refTelAgentMasterNoticeType = [];
                    }
                }

                for(var i = 0; i < $scope.agent_c.agentRemarks.length;i++){
                   if(($scope.agent_c.agentRemarks[i].content == '' || $scope.agent_c.agentRemarks[i].content == null) && ($scope.agent_c.agentRemarks[0].department_id == '' || $scope.agent_c.agentRemarks[0].department_id == null)){
                       $scope.agent_c.agentRemarks.splice(i,1);
                       i=0;
                    }
                }
                if(!angular.isUndefined($scope.agent_c.agentRemarks[0])){
                    if(($scope.agent_c.agentRemarks[0].content == '' || $scope.agent_c.agentRemarks[0].content == null) && ($scope.agent_c.agentRemarks[0].department_id == '' || $scope.agent_c.agentRemarks[0].department_id == null)){
                        $scope.agent_c.agentRemarks = [];
                    }
                }
                for (var i = 0; i < $scope.agent_c.agentMaster.agentContactIdcards.length; i++) {
                    if (($scope.agent_c.agentMaster.agentContactIdcards[i].idcard_type_id == '' || $scope.agent_c.agentMaster.agentContactIdcards[i].idcard_type_id == null) && ($scope.agent_c.agentMaster.agentContactIdcards[i].idcard_number == '' || $scope.agent_c.agentMaster.agentContactIdcards[i].idcard_number == null)) {
                        $scope.agent_c.agentMaster.agentContactIdcards.splice(i, 1);
                        i = 0;
                    }
                }

                if(!angular.isUndefined($scope.agent_c.agentMaster.agentContactIdcards[0])){
                    if(($scope.agent_c.agentMaster.agentContactIdcards[0].idcard_type_id == '' || $scope.agent_c.agentMaster.agentContactIdcards[0].idcard_type_id == null) && ($scope.agent_c.agentMaster.agentContactIdcards[0].idcard_number == '' || $scope.agent_c.agentMaster.agentContactIdcards[0].idcard_number == null)){
                        $scope.agent_c.agentMaster.agentContactIdcards = [];
                    }
                }
                if($scope.agent_c.agentMaster.agentContactIdcards.length > 0){
                    angular.forEach($scope.agent_c.agentMaster.agentContactIdcards,function(agentContactIdcard){
                        agentContactIdcard.expire_date = $filter('date')(agentContactIdcard.expire_date, 'yyyy-MM-dd');
                    })
                }
                for(var i = 0; i < $scope.agent_c.refAgentComps.length;i++){
                    if($scope.agent_c.refAgentComps[i].comp_contact_id == '' || $scope.agent_c.refAgentComps[i].comp_contact_id == null){
                        $scope.agent_c.refAgentComps.splice(i,1);
                        i = 0;
                    }
                }
                if(!angular.isUndefined($scope.agent_c.refAgentComps[0])){
                    if($scope.agent_c.refAgentComps[0].comp_contact_id == '' || $scope.agent_c.refAgentComps[0].comp_contact_id == null){
                        $scope.agent_c.refAgentComps = [];
                    }
                }
                $scope.enableClientValidation1 = false;
                $scope.enableClientValidation2 = false;
                $scope.enableClientValidation3 = false;
                $scope.enableClientValidation4 = false;
                $scope.enableClientValidation5 = false;
                $scope.notice_type=false;
                $scope.area_code_id=false;
                $scope.telephone_number=false;
                var errror_massage = [];
                if ($scope.agent.agent_code == "" || $scope.agent.agent_code == undefined) {
                    $scope.enableClientValidation1 = true;
                    errror_massage.push("戶口編號不能为空白");
                }
                if ($scope.agent.agentMaster.agent_contact_name == "" || $scope.agent.agentMaster.agent_contact_name == undefined) {
                    $scope.enableClientValidation2 = true;
                    errror_massage.push("姓名不能为空白");
                }
                if ($scope.agent.agentMaster.language_type_id == "" || $scope.agent.agentMaster.language_type_id == undefined) {
                    $scope.enableClientValidation3 = true;
                    errror_massage.push("語言不能为空白");
                }

                if ($scope.contactsIdCards.idcard_type_id[0] == "" || $scope.contactsIdCards.idcard_type_id[0] == undefined) {
                    $scope.enableClientValidation4 = true;
                    errror_massage.push("證件類型不能为空白");

                }
                if ($scope.contactsIdCards.idcard_number[0] == "" || $scope.contactsIdCards.idcard_number[0] == undefined) {
                    $scope.enableClientValidation5 = true;
                    errror_massage.push("證件號碼不能为空白");

                }

                if (errror_massage.length > 0) {
                    for (var i = 0; i < errror_massage.length; i++) {
                        topAlert.warning(errror_massage[i]);
                    }
                    return false;
                }


                if(angular.isUndefined($stateParams.id)){
                    $scope.contactsIdCards_record = [{
                        "idcard_type_id": angular.isUndefined($scope.contactsIdCards.idcard_type_id[0]) ? "" : $scope.contactsIdCards.idcard_type_id[0],
                        "idcard_number": angular.isUndefined($scope.contactsIdCards.idcard_number[0]) ? "" : $scope.contactsIdCards.idcard_number[0],
                        "expire_date" : $scope.contactsIdCards.expire_date[0]? getDate($scope.contactsIdCards.expire_date[0]) : ""  ,
                    }];

                    if (($scope.contactsIdCards.idcard_type_id[1]=='' || $scope.contactsIdCards.idcard_type_id[1]==null)
                      && ($scope.contactsIdCards.idcard_number[1]=='' || $scope.contactsIdCards.idcard_number[1]==null)) {

                    } else {
                        $scope.contactsIdCards_record.push({
                            "idcard_type_id": angular.isUndefined($scope.contactsIdCards.idcard_type_id[1]) ? "" : $scope.contactsIdCards.idcard_type_id[1],
                            "idcard_number": angular.isUndefined($scope.contactsIdCards.idcard_number[1]) ? "" : $scope.contactsIdCards.idcard_number[1],
                            "expire_date" : $scope.contactsIdCards.expire_date[1]?getDate($scope.contactsIdCards.expire_date[1]):""
                        });
                    }
                }else{
                    //證件類型
                    $scope.contactsIdCards_record = [{
                        "idcard_type_id": angular.isUndefined($scope.contactsIdCards.idcard_type_id[0]) ? "" : $scope.contactsIdCards.idcard_type_id[0],
                        "idcard_number": angular.isUndefined($scope.contactsIdCards.idcard_number[0]) ? "" : $scope.contactsIdCards.idcard_number[0],
                        "expire_date" : $scope.contactsIdCards.expire_date[0]? getDate($scope.contactsIdCards.expire_date[0]):""
                    }];

                    if (($scope.contactsIdCards.idcard_type_id[1]=='' || $scope.contactsIdCards.idcard_type_id[1]==null)
                      && ($scope.contactsIdCards.idcard_number[1]=='' || $scope.contactsIdCards.idcard_number[1]==null)) {

                    } else {
                        $scope.contactsIdCards_record.push({
                            "idcard_type_id": angular.isUndefined($scope.contactsIdCards.idcard_type_id[1]) ? "" : $scope.contactsIdCards.idcard_type_id[1],
                            "idcard_number": angular.isUndefined($scope.contactsIdCards.idcard_number[1]) ? "" : $scope.contactsIdCards.idcard_number[1],
                        "expire_date" : $scope.contactsIdCards.expire_date[1]? getDate($scope.contactsIdCards.expire_date[1]):""
                        });
                    }
                }
                $scope.agent_c.agentMaster.agentContactIdcards=$scope.contactsIdCards_record;
                $scope.agent_contact_filter.agentRemarks=[];
                $scope.agent_contact_filter.refTelAgentMasterNoticeType =[];
                $scope.agent_contact_filter.refAgentComps =[];
                if($scope.agent_filter.agent_id){
                    $scope.agent_contact_filter.agent_code= $scope.agent_c.agent_code;
                    $scope.agent_contact_filter.introducer= $scope.agent_c.introducer;
                    $scope.agent_contact_filter.refAgentComps = $scope.agent_c.refAgentComps;
                    $scope.agent_contact_filter.comp_contact_id = $scope.agent_c.comp_contact_id;
                    $scope.agent_contact_filter.pin_code= $scope.agent_c.pin_code;
                    if($scope.agent_c.agentRemarks.length>0){
                        angular.forEach($scope.agent_c.agentRemarks,function(remark){
                            $scope.agent_contact_filter.agentRemarks.push(remark);
                        })
                    }
                    if($scope.agent_c.refTelAgentMasterNoticeType.length>0){
                        angular.forEach($scope.agent_c.refTelAgentMasterNoticeType,function(refTelAgentMasterNoticeType){
                            $scope.agent_contact_filter.refTelAgentMasterNoticeType.push(refTelAgentMasterNoticeType);
                        })
                    }
                }
                if(angular.isUndefined($stateParams.id)){
                    $scope.form_agent.checkValidity().then(function(){
                        $scope.disabled_submit = true;
                        if($scope.agent_filter.agent_id){
                            agentsLists.save($scope.agent_contact_filter,function(){
                                topAlert.success("添加成功！");
                                //控制聯絡資料的样式
                                $scope.notice_type=false;
                                $scope.area_code_id=false;
                                $scope.telephone_number=false;
                                $scope.disabled_submit = false;
                                $location.path('/agent/agent-list');
                            },function(){
                                $scope.disabled_submit = false;
                            });
                        }else{
                            $scope.form_agent.checkPreValidity('POST','agent/agent/create-validate',agentsLists.createValidate,$scope.agent_c).then(function(){
                                agentsLists.save($scope.agent_c,function(){
                                    topAlert.success("添加成功！");
                                    $scope.disabled_submit = false;
                                    //控制聯絡資料的样式
                                    $scope.notice_type=false;
                                    $scope.area_code_id=false;
                                    $scope.telephone_number=false;
                                    $location.path('/agent/agent-list');
                                },function(){
                                    $scope.disabled_submit = false;
                                });
                            },function(){
                                $scope.disabled_submit = false;
                            });

                        }
                    });
                }else{
                    $scope.form_agent.checkValidity().then(function(){
                        $scope.disabled_submit = true;
                        agentsLists.update($scope.agent_c,function(){
                            topAlert.success("修改成功！");
                            //控制聯絡資料的样式
                            $scope.notice_type=false;
                            $scope.area_code_id=false;
                            $scope.telephone_number=false;
                            $scope.disabled_submit = false;
                            $location.path('/agent/list');
                        },function(){
                            $scope.disabled_submit = false;
                        });
                    });
                }
            }
            //數據重置
            $scope.show_agent_disable = false;
            var original_reset;
            $scope.reset = function(){
                $scope.show_agent_disable = false;
                $scope.form_agent.$setPristine();
                if(!angular.isUndefined($stateParams.id)){
                    $scope.agent =  angular.copy(original_reset);
                    angular.forEach($scope.agent.agentMaster.agentContactIdcards,function(idcard,index){
                        if(idcard.expire_date){
                            $scope.agent.agentMaster.agentContactIdcards[index].expire_date =  $filter("parseDate")(idcard.expire_date,"yyyy-MM-dd");
                        }
                    })
                    if($scope.agent.agentRemarks.length  == 0) {
                        $scope.agent.agentRemarks.push({"content": "", "department_id": ""});
                    }else{
                        angular.forEach($scope.agent.agentRemarks,function(remark){
                            if(remark.department_id == null){
                                remark.department_id = "DEPARTMENT_ALL";
                            }
                        })
                    }
                    if($scope.agent.refTelAgentMasterNoticeType.length == 0){
                        $scope.agent.refTelAgentMasterNoticeType.push({"notice_type": "",agentContactTel:{"telephone_number": "", "area_code_id": "", "remark":""}});
                    }
                    if(!angular.isUndefined($scope.agent.agentMaster.idcardImages[0]) && angular.isUndefined($scope.agent.agentMaster.idcardImages[1])){
                        $scope.img1 = $scope.agent.agentMaster.idcardImages[0].show_image_path;
                        $scope.img2 ="";
                    }else if(angular.isUndefined($scope.agent.agentMaster.idcardImages[0]) && !angular.isUndefined($scope.agent.agentMaster.idcardImages[1])){
                        $scope.img1 ="";
                        $scope.img2 =$scope.agent.agentMaster.idcardImages[1].show_image_path;
                    }else if(!angular.isUndefined($scope.agent.agentMaster.idcardImages[0]) && !angular.isUndefined($scope.agent.agentMaster.idcardImages[1])){
                        $scope.img1 = $scope.agent.agentMaster.idcardImages[0].show_image_path;
                        $scope.img2 = $scope.agent.agentMaster.idcardImages[1].show_image_path;
                    }else{
                        $scope.img1 = "";
                        $scope.img2 = "";
                    }
                }else{
                    $scope.agent = angular.copy(original);
                    $scope.img1 ="";
                    $scope.img2 ="";
                    $scope.writeAgents();
                }
            }
            //戶口修改詳細
            $scope.edit = function(id){
                if(!angular.isUndefined($stateParams.id)){
                    $scope.contactsIdCards = {
                        "id":[],
                        "idcard_type_id": [],
                        "idcard_number": [],
                        "expire_date": []
                    };
                    $scope.sub_post = "PUT";
                    $scope.agent_id = $stateParams.id;
                    agentsLists.get(globalFunction.generateUrlParams({id:id},{agentMaster:{idcardImages:"",agentContactIdcards:""},refTelAgentMasterNoticeType:{agentContactTel:""},agentRemarks:{},refAgentComps:{}}),function(agent){
                        $scope.agent =  agent;
                        $scope.agent.agentMaster.birthdate = $filter("parseDate")( $scope.agent.agentMaster.birthdate,"yyyy-MM-dd");
                        if($scope.agent.agentMaster.agentContactIdcards.length == 1){
                            $scope.agent.agentMaster.agentContactIdcards.push({"idcard_type_id": "", "idcard_number": "" });
                        }
                        original_reset = angular.copy($scope.agent);
                        if(!angular.isUndefined($scope.agent.agentMaster.idcardImages[0]) && angular.isUndefined($scope.agent.agentMaster.idcardImages[1])){
                            $scope.img1 = $scope.agent.agentMaster.idcardImages[0].show_image_path;
                            $scope.img2 ="";
                        }else if(angular.isUndefined($scope.agent.agentMaster.idcardImages[0]) && !angular.isUndefined($scope.agent.agentMaster.idcardImages[1])){
                            $scope.img1 ="";
                            $scope.img2 =$scope.agent.agentMaster.idcardImages[1].show_image_path;
                        }else if(!angular.isUndefined($scope.agent.agentMaster.idcardImages[0]) && !angular.isUndefined($scope.agent.agentMaster.idcardImages[1])){
                            $scope.img1 = $scope.agent.agentMaster.idcardImages[0].show_image_path;
                            $scope.img2 = $scope.agent.agentMaster.idcardImages[1].show_image_path;
                        }else{
                            $scope.img1 = "";
                            $scope.img2 = "";
                        }
                        if(!$scope.agent.refAgentComps.length) {
                            $scope.agent.refAgentComps.push({"comp_contact_id": ""});
                        }
                        if($scope.agent.agentRemarks.length  == 0) {
                            $scope.agent.agentRemarks.push({"content": "", "department_id": ""});
                        }else{
                            angular.forEach($scope.agent.agentRemarks,function(remark){
                                if(remark.department_id == null){
                                    remark.department_id = "DEPARTMENT_ALL";
                                }
                            })
                        }
                        if($scope.agent.refTelAgentMasterNoticeType.length  == 0) {
                            $scope.agent.refTelAgentMasterNoticeType.push({"notice_type": "", "agentContactTel": {"telephone_number": "","area_code_id": "","remark": ""}});
                        }
                        angular.forEach(agent.agentMaster.agentContactIdcards,function(idcard,index){
                            if(idcard.expire_date){
                                $scope.agent.agentMaster.agentContactIdcards[index].expire_date =  $filter("parseDate")(idcard.expire_date,"yyyy-MM-dd");
                            }
                            $scope.contactsIdCards.id[index] = idcard.id;
                            $scope.contactsIdCards.idcard_type_id[index] = idcard.idcard_type_id;
                            $scope.contactsIdCards.idcard_number[index] = idcard.idcard_number;
                            $scope.contactsIdCards.expire_date[index] = idcard.expire_date ? $filter("parseDate")(idcard.expire_date,'yyyy-MM-dd') : "";
                        })
                        if($scope.agent.agentMaster.agentContactIdcards.length  == 0) {
                            $scope.agent.agentMaster.agentContactIdcards=[{
                                "idcard_type_id": "",
                                "idcard_number": "",
                                "expire_date":""
                            },{
                                "idcard_type_id": "",
                                "idcard_number": "",
                                "expire_date":""
                            }]
                        }
                    });
                }else if(id){
                    $scope.contactsIdCards = {
                        "id":[],
                        "idcard_type_id": [],
                        "idcard_number": [],
                        "expire_date": []
                    };
                    $scope.agent_id = "";//{agentMaster:{idcardImages:"",agentContactIdcards:""},refTelAgentMasterNoticeType:{agentContactTel:""},agentRemarks:{}}
                    agentContact.get(globalFunction.generateUrlParams({id:id,type:"1"},{idcardImages:{},agentContactIdcards:{}}),function(agent){
                        $scope.agent_contact =  agent;
                        if($scope.agent_filter.agent_id == id){
                            delete $scope.agent.id;
                        }
                        $scope.agent_contact_filter.agent_master_id = $scope.agent_contact.id;

                        $scope.show_agent_disable = true;
                        $scope.agent.agentMaster.birthdate = $filter("parseDate")( $scope.agent_contact.birthdate,"yyyy-MM-dd");
                        $scope.agent.agentMaster.agent_contact_name = $scope.agent_contact.agent_contact_name;
                        $scope.agent.agentMaster.nationality_id =  $scope.agent_contact.nationality_id;
                        $scope.agent.agentMaster.language_type_id =$scope.agent_contact.language_type_id;

                        $scope.agent.agentMaster.gender=  $scope.agent_contact.gender;
                        $scope.agent.agentMaster.occupation=  $scope.agent_contact.occupation;
                        angular.forEach(agent.agentContactIdcards,function(idcard,index){
                            $scope.agent.agentMaster.agentContactIdcards[index].idcard_type_id = idcard.idcard_type_id;
                            $scope.agent.agentMaster.agentContactIdcards[index].idcard_number = idcard.idcard_number;
                            if(idcard.expire_date){
                                $scope.agent.agentMaster.agentContactIdcards[index].expire_date =  $filter("parseDate")(idcard.expire_date,"yyyy-MM-dd");
                            }
                            $scope.contactsIdCards.id[index] = idcard.id;
                            $scope.contactsIdCards.idcard_type_id[index] = idcard.idcard_type_id;
                            $scope.contactsIdCards.idcard_number[index] = idcard.idcard_number;
                            $scope.contactsIdCards.expire_date[index] = idcard.expire_date ? $filter("parseDate")(idcard.expire_date,'yyyy-MM-dd') : "";

                        })
                        $scope.img1 ="";
                        $scope.img2 ="";
                        angular.forEach($scope.agent_contact.idcardImages,function(idcardImage,index){
                            $scope.agent.agentMaster.idcardImages[index].image_path = idcardImage.image_path;
                            $scope.agent.agentMaster.idcardImages[index].file_type = idcardImage.file_type;
                            if(index == 0){
                                $scope.img1 = idcardImage.show_image_path;
                            }else{
                                $scope.img2 = idcardImage.show_image_path;
                            }
                        })
                    });
                }

            }
           $scope.edit($stateParams.id);
           //---agent END
            //查詢介紹人
            $scope.$watch('agent.introducer_agent_code',globalFunction.debounce(function(new_value,old_value){
                if(new_value){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code:new_value}, {agentMaster:{}})).$promise.then(function (agents) {
                        if(agents.length > 0){
                            $scope.agent.introducer = agents[0].agentMaster.agent_contact_name;
                            $scope.agent.introducer_agent_id = agents[0].id;
                            $scope.agent_contact_filter.introducer = agents[0].agentMaster.agent_contact_name;
                            $scope.agent_contact_filter.introducer_agent_id = agents[0].id;
                        }else{
                            $scope.agent.introducer ="";
                            $scope.agent.introducer_agent_id = "";
                            $scope.agent_contact_filter.introducer ="";
                            $scope.agent_contact_filter.introducer_agent_id = "";
                        }
                    });
                }else{
                    $scope.agent.introducer ="";
                    $scope.agent.introducer_agent_id = "";
                }
            }));

            //查詢聯絡人
            $scope.agent_filter = {
                agent_id:"",
                agent_contact_name:""
            };
            $scope.agent_contion = {
                agent_contact_name:"",
                type:'1'
            }
            $scope.agent_data = [];
            $scope.searchAgents = function(){
                if($scope.agent.agentMaster.agent_contact_name){
                    if($stateParams.id){ //修改
                        $scope.agent_filter.agent_id = $stateParams.id;
                        $scope.agent_filter.agent_contact_name = $scope.agent_filter.agent_contact_name;
                        $scope.agent_contion.agent_contact_name =$scope.agent_filter.agent_contact_name+'!';
                    }else{ //新增
                        $scope.agent_filter.agent_contact_name = $scope.agent.agentMaster.agent_contact_name;
                        $scope.agent_contion.agent_contact_name =$scope.agent_filter.agent_contact_name+'!';
                    }
                    if($scope.agent_filter.agent_contact_name){
                        agentContact.query(globalFunction.generateUrlParams($scope.agent_contion,{})).$promise.then(function(agent_datas){
                            if(agent_datas.length > 0){
                                $scope.agent_data = agent_datas;
                            }else{
                                $scope.agent_data = [];
                                topAlert.warning("沒有此聯絡人!");
                            }
                        });
                    }else{
                        $scope.agent_data = [];
                    }
                }else{
                    topAlert.warning("請輸入姓名!");
                }
            }
            $scope.writeAgents = function(){
                $scope.agent.agentMaster.agent_contact_name = "";
                $scope.agent_data = [];
                $scope.agent_filter=[];
                if($scope.agent_contact && $scope.agent_contact.id){
                    $scope.show_agent_disable =false;
                    $scope.agent.agentMaster = angular.copy(original.agentMaster);
                    $scope.img1 ="";
                    $scope.img2 ="";
                }
            }
            //選取聯繫人跳轉修改
            $scope.redirectUpdate = function(){
                $scope.show_agent_disable = false;
                if($scope.agent_filter.agent_id){
                    $scope.edit($scope.agent_filter.agent_id);
                }else{
                    topAlert.warning("此聯絡人不存在！");
                    $scope.reset();
                }
            }
    }]).controller('agentDetailedCtrl',['$scope','agentsLists','globalFunction','$stateParams','$location','breadcrumb','noticeTypes','getDate','topAlert','qzPrinter',
        function($scope,agentsLists,globalFunction,$stateParams,$location,breadcrumb,noticeTypes,getDate,topAlert,qzPrinter){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"户口列表","url":'agent/list'},
                {"name":"戶口詳細","active":true}
            ];
            $scope.now_data = getDate(new Date());
            $scope.notice_types = noticeTypes.items;

            $scope.print_agent_image_submit = false;

            $scope.print_agent_image = function(url){

                if(!url){
                    topAlert.warning('暫無證件圖片');
                    return;
                }

                $scope.print_agent_image_submit = true;

                qzPrinter.print('PDFIdPhoto',"",{image_url:url}).then(function(){
                    topAlert.success('列印成功');
                    $scope.print_agent_image_submit = false;
                },function(msg){
                    $scope.print_agent_image_submit = false;
                })
            };

            if(!angular.isUndefined($stateParams.id)) {
                 agentsLists.get(globalFunction.generateUrlParams({id: $stateParams.id}, {agentMaster:{idcardImages:"",agentContactIdcards:""},refTelAgentMasterNoticeType:{agentContactTel:""},agentRemarks:{},refAgentComps:{},compContact:{phoneNumbers:""}})).$promise.then(function(agent_detail){
                     $scope.agent_detail = agent_detail;
                });
            }
            //返回戶口列表
            $scope.goToAgent = function(){
                $location.path('agent/list');
            }
            //编辑
            $scope.update= function(){
                $location.path('/agent/create/'+$stateParams.id);
            }

    }]).controller('agentAuthorizationCtrls',['$scope','$modalInstance','$location','agent',function($scope,$modalInstance,$location,agent){
        $scope.cancel = function(){
            $modalInstance.close();
        }
      $scope.authorization = function(){
          $modalInstance.close();
          $location.path('agent/list');
      }

    }]).controller('agentListCtrl',['$scope','agentsLists','hallName','tmsPagination','globalFunction','$filter','$location','breadcrumb','topAlert','windowItems','pinCodeModal','getDate','$modal','goBackData','$state','qzPrinter','uiGridOptions',
        function($scope,agentsLists,hallName,tmsPagination,globalFunction,$filter,$location,breadcrumb,topAlert,windowItems,pinCodeModal,getDate,$modal,goBackData,$state,qzPrinter,uiGridOptions){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"戶口查詢","active":true}
            ];
            //自定義變量
            $scope.now_data = getDate(new Date());//獲取當前日期用於證件過期比較
            $scope.halls = hallName.query({hall_type:2});//廳館只顯示內管

            $scope.print_agent_image_submit = false;

            $scope.print_agent_image = function(url){
                if(!url){
                    topAlert.warning('暫無證件圖片');
                    return;
                }

                $scope.print_agent_image_submit = true;

                qzPrinter.print('PDFIdPhoto',"",{image_url:url}).then(function(){
                    topAlert.success('列印成功');
                    $scope.print_agent_image_submit = false;
                },function(msg){
                    $scope.print_agent_image_submit = false;
                })
            };


            $scope.agents = [];
            //初始化查詢條件
            var original;
            var init_condition = {
                agent_code:"",
                agentMaster:{agent_contact_name:"",agentContactIdcards:{idcard_type_id:"",idcard_number:""}},
                refTelAgentMasterNoticeType:{agentContactTel:{telephone_number:""}},
                agentGroup:{agent_group_name:""},
                introducer:"",
                register_time:[''],
                hall_id:"",
                hall_name: "",
                sort:"agent_code NUMASC"
            };
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.excel_condition = angular.copy($scope.condition);
            $scope.condition = goBackData.get('condition',$scope.condition);
            //初始化列表數據
            var conditions;
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = agentsLists;
            $scope.select = function(page){
                $scope.condition.register_time[0] = $filter('date')($scope.condition.register_time[0], 'yyyy-MM-dd');
                conditions =angular.copy($scope.condition);
                $scope.excel_condition = angular.copy($scope.condition);
                if(conditions.agent_code){
                    conditions.agent_code=conditions.agent_code+"!";
                }
                if(conditions.agentMaster.agent_contact_name){
                    conditions.agentMaster.agent_contact_name = "!"+conditions.agentMaster.agent_contact_name+"!";
                }
                if(conditions.agentMaster.agentContactIdcards.idcard_number){
                    conditions.agentMaster.agentContactIdcards.idcard_number = conditions.agentMaster.agentContactIdcards.idcard_number+"!";
                }
                if(conditions.refTelAgentMasterNoticeType.agentContactTel.telephone_number){
                    conditions.refTelAgentMasterNoticeType.agentContactTel.telephone_number= "!"+conditions.refTelAgentMasterNoticeType.agentContactTel.telephone_number+"!";
                }
                if(conditions.introducer){
                    conditions.introducer = conditions.introducer+"!";
                }
                $scope.agents = $scope.pagination.select(page,conditions,{agentMaster:{idcardImages:"",agentContactIdcards:""},refTelAgentMasterNoticeType:{agentContactTel:""}});
            }
//            if($state.current.nextLinks && _.contains($state.current.nextLinks,$state.current.previousUrl)){
//                $scope.select();
//            }
            //搜索方法
            $scope.search =function(){
                goBackData.set('condition',$scope.condition);
                $scope.select();
            }
            //重置方法
            $scope.reset =function(){
                $scope.condition = angular.copy(original);
                $scope.select();
            }
            //新增戶口
            $scope.addAgents = function(){
                $location.path('agent/create');
            }
            //戶口詳細
            $scope.detailAgent= function(id){
                $location.path('/agent/detailed/2/'+id);
            }
            //戶口編輯
            $scope.update= function(id){
                $location.path('/agent/create/'+id);
            }
            //戶口刪除
            $scope.remove =function(id){
                pinCodeModal(agentsLists,'delete',{id:id},'刪除成功！').then(function(){
                    $scope.select();
                })
            }
            //ff顯示證件
            $scope.certificate_images =[{image:""},{image:""}];
            $scope.show_certificate = function(id){
                agentsLists.get(globalFunction.generateUrlParams({id:id},{agentMaster:{idcardImages:"",agentContactIdcards:""}}),function(agent){
                    $scope.agent_image = agent;
                    if(!angular.isUndefined(agent.agentMaster.idcardImages[0]) && angular.isUndefined(agent.agentMaster.idcardImages[1]) ){
                        $scope.certificate_images =[{image:agent.agentMaster.idcardImages[0].show_image_path},{image:""}];
                    }else if(angular.isUndefined(agent.agentMaster.idcardImages[0]) && !angular.isUndefined(agent.agentMaster.idcardImages[1]) ){
                        $scope.certificate_images =[{image:""},{image:agent.agentMaster.idcardImages[1].show_image_path}];
                    }else if(!angular.isUndefined(agent.agentMaster.idcardImages[0]) && !angular.isUndefined(agent.agentMaster.idcardImages[1])){
                        $scope.certificate_images =[{image:agent.agentMaster.idcardImages[0].show_image_path},{image:agent.agentMaster.idcardImages[1].show_image_path}];
                    }else{
                        $scope.certificate_images =[{image:""},{image:""}];
                    }
                });
            }



    }]).controller('agentGuestListCtrl',['$scope','agentGuest','pinCodeModal','$location','globalFunction','tmsPagination','hallName','breadcrumb','getDate','goBackData','$state','qzPrinter','topAlert',
        function($scope,agentGuest,pinCodeModal,$location,globalFunction,tmsPagination,hallName,breadcrumb,getDate,goBackData,$state,qzPrinter,topAlert){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"客人查詢","active":true}
            ];
            //自定義變量
            $scope.now_data = getDate(new Date());
            $scope.halls = hallName.query({hall_type:2});



            $scope.print_agent_image_submit = false;

            $scope.print_agent_image = function(url){
                if(!url){
                    topAlert.warning('暫無證件圖片');
                    return;
                }

                $scope.print_agent_image_submit = true;

                qzPrinter.print('PDFIdPhoto',"",{image_url:url}).then(function(){
                    topAlert.success('列印成功');
                    $scope.print_agent_image_submit = false;
                },function(msg){
                    $scope.print_agent_image_submit = false;
                })
            };


            $scope.agentGuests =[];
            //初始化查詢條件
            var original;
            var init_condition = {
                agentInfo:{agent_code:""},
                agent_guest_name:"",
                sort:"agentInfo.agent_code NUMASC"
            };
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.condition = goBackData.get('condition',$scope.condition);
            //初始化列表數據
            var conditions;
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = agentGuest;
            $scope.select = function(page){
                conditions =angular.copy($scope.condition);
                if(conditions.agentInfo.agent_code){
                    conditions.agentInfo.agent_code=conditions.agentInfo.agent_code+"!";
                }
                if(conditions.agent_guest_name){
                    conditions.agent_guest_name = conditions.agent_guest_name+"!";
                }
                $scope.agentGuests = $scope.pagination.select(page,conditions,{guestTels:{},idCards:{},guestImages:{}});
            }
            if($state.current.nextLinks && _.contains($state.current.nextLinks,$state.current.previousUrl)){
                $scope.select();
            }
            //搜索方法
            $scope.search =function(){
                goBackData.set('condition',$scope.condition);
                $scope.select();
            }
            $scope.reset =function(){
                $scope.condition = angular.copy(original);
                $scope.select();
            }
            //新增戶口
            $scope.addGuest = function(){
                $location.path('agent/agent-guest-create');
            }
            //戶口詳細
            $scope.detailAgentGuest= function(id){
                $location.path('/agent/agent-guest-detail/'+id);
            }
            //戶口編輯
            $scope.update= function(id){
                $location.path('/agent/agent-guest-create/'+id);
            }
            //戶口刪除
            $scope.remove =function(id){
                pinCodeModal(agentGuest,'delete',{id:id},'刪除成功！').then(function(){
                    $scope.select();
                })
            }
            //顯示證件
            $scope.certificate_images =[{image:""},{image:""}];
            $scope.show_certificate = function(id){
                agentGuest.get(globalFunction.generateUrlParams({id:id},{guestImages:{},idCards:{}}),function(guest){
                    $scope.guest_image = guest;
                    if(!angular.isUndefined(guest.guestImages[0]) && angular.isUndefined(guest.guestImages[1]) ){
                        $scope.certificate_images =[{image:guest.guestImages[0].show_image_path},{image:""}];
                    }else if(angular.isUndefined(guest.guestImages[0]) && !angular.isUndefined(guest.guestImages[1]) ){
                        $scope.certificate_images =[{image:""},{image:guest.guestImages[1].show_image_path}];
                    }else if(!angular.isUndefined(guest.guestImages[0]) && !angular.isUndefined(guest.guestImages[1])){
                        $scope.certificate_images =[{image:guest.guestImages[0].show_image_path},{image:guest.guestImages[1].show_image_path}];
                    }else{
                        $scope.certificate_images =[{image:""},{image:""}];
                    }
                });
            }
    }]).controller('agentGuestCreateCtrl',['$scope','agentGuest','agentsLists','idCardType','smsnoticeType','nationaLity','idcardType','areaCode','languageType','$stateParams','globalFunction','tmsPagination','breadcrumb','$upload','topAlert','$filter','$location','getDate',
        function($scope,agentGuest,agentsLists,idCardType,smsnoticeType,nationaLity,idcardType,areaCode,languageType,$stateParams,globalFunction,tmsPagination,breadcrumb,$upload,topAlert,$filter,$location,getDate){

            $scope.img1="";
            $scope.img2="";
            $scope.onFileSelect = function($files) {
                var file = $files[0];
                $scope.upload = $upload.upload({
                    url: globalFunction.getApiUrl('agent/agentcontact/upload-id-card-image?PHPSESSID='+sessionStorage.token), //upload.php script, node.js route, or servlet url
                    file: file
                }).progress(function(evt) {
                    }).success(function(data, status, headers, config) {
                        $scope.img1 = data.url;
                        if(!angular.isUndefined($scope.guest.guestImages[0])){
                            $scope.guest.guestImages[0].image_path = data.path;
                        }else{
                            $scope.guest.guestImages.push({"image_path":data.path,"file_type":"jpg"});
                        }
                    });
            };
            //刪除圖片1
            $scope.removeImg1 = function(){
                $scope.img1 = "";
                $scope.guest.guestImages.splice(0,1);
            }
            $scope.onFileSelect2 = function($files) {
                var file = $files[0];
                $scope.upload = $upload.upload({
                    url: globalFunction.getApiUrl('agent/agentcontact/upload-id-card-image?PHPSESSID='+sessionStorage.token), //upload.php script, node.js route, or servlet url
                    file: file
                }).progress(function(evt) {

                    }).success(function(data, status, headers, config) {
                        $scope.img2 = data.url;
                        if(!angular.isUndefined($scope.guest.guestImages[1])){
                            $scope.guest.guestImages[1].image_path = data.path;
                        }else{
                            $scope.guest.guestImages.push({"image_path":data.path,"file_type":"jpg"});
                        }
                    });
            };
            //刪除圖片1
            $scope.removeImg2 = function(){
                $scope.img2 = "";
                $scope.guest.guestImages.splice(1,1);
            }
            //麵包屑導航

            if(angular.isUndefined($stateParams.id) || !angular.isUndefined($stateParams.agent_code)){
                breadcrumb.items = [
                    {"name":"客人列表","url":'agent/guest-list'},
                    {"name":"新增客人","active":true}
                ];
            }else{
                breadcrumb.items = [
                    {"name":"客人列表","url":'agent/guest-list'},
                    {"name":"客人修改","active":true}
                ];
            }
            //自定義變量idCardType,smsnoticeType,areaCode,languageType,departMent
            //$scope.now_data = getDate(new Date());
            $scope.agent_id = '';
            $scope.idcards = idCardType.items ;//證件類型
            $scope.smsnoticeTypes =  smsnoticeType.query();//通知類型
            $scope.nationalitys = nationaLity.query();//
            $scope.idcardTypes = idcardType.query();//證件
            $scope.areaCodes  =areaCode.query();//地區
            $scope.languageTypes = languageType.query();//語言
            $scope.sub_post = "POST";
            $scope.guest_url = globalFunction.getApiUrl('agent/agentguest');
            $scope.now_data = getDate(new Date());
            //初始化對象
            var original;
            var original_reset;
            var init_guest = {
                "pin_code":"",
                "agent_code":"",
                "agent_info_id":"",
                "nationality_id":"",
                "agent_guest_name":"",
                "gender":"1",
                "birthdate":"",
                "guestTels":[{
                    "area_code_id":"",
                    "telephone_number":"",
                    "notice_type":""
                 }],
                "idCards":[{
                        "idcard_type_id":"",
                        "idcard_number":"",
                        "idcard_name":"",
                        "expired_date":""
                },{
                    "idcard_type_id":"",
                    "idcard_number":"",
                    "idcard_name":"",
                    "expired_date":""
                }],
                "guestImages":[{
                        "image_path":"",
                        "file_type":"jpg"
                },{
                    "image_path":"",
                    "file_type":"jpg"
                }]
            };
            var original = angular.copy(init_guest);
            $scope.guest = angular.copy(init_guest);

            //根據戶口編號獲取agent_info_id 跟 agent_name
            if(!angular.isUndefined($stateParams.agent_code)){
                if(!angular.isUndefined($stateParams.agent_code)){
                    $scope.guest.agent_code = $stateParams.agent_code;
                }
            }
            $scope.$watch('guest.agent_code',globalFunction.debounce(function(new_value,old_value){
                $scope.agent =[];
                if(new_value){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code:new_value}, {})).$promise.then(function (agent) {
                        if(agent.length > 0){
                            $scope.agent = agent[0];
                            $scope.guest.agent_info_id = $scope.agent.id;
                            $scope.agent_name = $scope.agent.agent_name;
                        }else{
                            $scope.guest.agent_info_id ="";
                            $scope.agent_name = "";
                        }
                    });
                }else{
                    $scope.guest.agent_info_id ="";
                    $scope.agent_name = "";
                }
            }));

            //增加聯絡資料跟刪除聯絡資料
            $scope.addGuestInfo =function(){
                if($scope.guest.id){
                    $scope.guest.guestTels.push({agent_guest_id:$scope.guest.id,"notice_type": "", "area_code_id":"","telephone_number":"","remark":""});
                }else{
                    $scope.guest.guestTels.push({"notice_type": "", "area_code_id":"","telephone_number":"","remark":""});
                }

            }
            $scope.removeGuestInfo=function(index){
                $scope.guest.guestTels.splice(index,1);
            }

            //修改客人
                if( $stateParams.id){
                    $scope.sub_post = "PUT";
                    agentGuest.get(globalFunction.generateUrlParams({id: $stateParams.id},{guestTels:{},idCards:{},guestImages:{}}),function(guest){
                        $scope.guest =  guest;
                        $scope.guest.birthdate = $filter("parseDate")( $scope.guest.birthdate,"yyyy-MM-dd");

                        if($scope.guest.idCards.length == 1){
                            $scope.guest.idCards.push( {"idcard_type_id":"","idcard_number":"","idcard_name":"","expired_date":""});
                        }
                        original_reset = angular.copy($scope.guest);
                        if(!angular.isUndefined($scope.guest.guestImages[0]) && angular.isUndefined($scope.guest.guestImages[1])){
                            $scope.img1 = $scope.guest.guestImages[0].show_image_path;
                            $scope.img2 ="";
                        }else if(angular.isUndefined($scope.guest.guestImages[0]) && !angular.isUndefined($scope.guest.guestImages[1])){
                            $scope.img1 ="";
                            $scope.img2 =$scope.guest.guestImages[1].show_image_path;
                        }else if(!angular.isUndefined($scope.guest.guestImages[0]) && !angular.isUndefined($scope.guest.guestImages[1])){
                            $scope.img1 = $scope.guest.guestImages[0].show_image_path;
                            $scope.img2 =$scope.guest.guestImages[1].show_image_path;
                        }else{
                            $scope.img1 = "";
                            $scope.img2 = "";
                        }
                        if($scope.guest.guestTels.length  == 0) {
                            $scope.guest.guestTels.push({"agent_guest_id":$scope.guest.id,"notice_type": "","telephone_number": "","area_code_id": "","remark": ""});
                        }
                        angular.forEach($scope.guest.idCards,function(idcard,index){
                            if(idcard.expired_date){
                                $scope.guest.idCards[index].expired_date =  $filter("parseDate")(idcard.expired_date,"yyyy-MM-dd");
                            }
                        })
                        if($scope.guest.idCards.length  == 0) {
                            $scope.guest.idCards=[{
                                "idcard_type_id":"","idcard_number":"","idcard_name":"","expired_date":""
                            },{"idcard_type_id":"","idcard_number":"","idcard_name":"","expired_date":""}]
                        }
                    });
                }

            //新增客人
            $scope.disabled_submit = false;
            $scope.add = function(){
                if($scope.disabled_submit){
                    return $scope.disabled_submit;
                }
                $scope.guest_c= angular.copy($scope.guest);
                $scope.guest_c.birthdate=  $filter('date')($scope.guest_c.birthdate, 'yyyy-MM-dd');
                _.each($scope.guest_c.guestImages,function(image,index){
                    if(image && image.image_path == '')
                        $scope.guest_c.guestImages.splice(index, 1);
                });
                if(!angular.isUndefined( $scope.guest_c.guestImages[0])) {
                    if ( $scope.guest_c.guestImages[0].image_path == ''){
                        $scope.guest_c.guestImages = [];
                    }
                }

                for(var i = 0; i < $scope.guest_c.guestTels.length;i++){
                    if(($scope.guest_c.guestTels[i].notice_type == '' || $scope.guest_c.guestTels[i].notice_type == null) && ( $scope.guest_c.guestTels[i].telephone_number == '' ||  $scope.guest_c.guestTels[i].telephone_number == null) && ( $scope.guest_c.guestTels[i].area_code_id == '' ||  $scope.guest_c.guestTels[i].area_code_id == null)){
                        $scope.guest_c.guestTels.splice(i,1);
                        i = 0;
                    }
                }

                if(!angular.isUndefined($scope.guest_c.guestTels[0])){
                    if(($scope.guest_c.guestTels[0].notice_type == '' || $scope.guest_c.guestTels[0].notice_type == null) && ( $scope.guest_c.guestTels[0].telephone_number == '' ||  $scope.guest_c.guestTels[0].telephone_number == null) && ( $scope.guest_c.guestTels[0].area_code_id == '' ||  $scope.guest_c.guestTels[0].area_code_id == null)){
                        $scope.guest_c.guestTels[0]= [];
                    }
                }

                for(var i = 0; i < $scope.guest_c.idCards.length;i++){
                    if(($scope.guest_c.idCards[i].idcard_type_id == '' || $scope.guest_c.idCards[i].idcard_type_id == null) && ($scope.guest_c.idCards[i].idcard_number == '' || $scope.guest_c.idCards[i].idcard_number == null)){
                        $scope.guest_c.idCards.splice(i, 1);
                        i = 0;
                    }
                }
                if(!angular.isUndefined($scope.guest_c.idCards[0])){
                    if(($scope.guest_c.idCards[0].idcard_type_id == '' || $scope.guest_c.idCards[0].idcard_type_id == null) && ($scope.guest_c.idCards[0].idcard_number == '' || $scope.guest_c.idCards[0].idcard_number == null)){
                        $scope.guest_c.idCards = [];
                    }
                }
                if($scope.guest_c.idCards.length > 0){
                    angular.forEach($scope.guest_c.idCards,function(idcard){
                        idcard.expired_date = $filter('date')(idcard.expired_date, 'yyyy-MM-dd');
                    })
                }
                if($stateParams.id && angular.isUndefined($stateParams.agent_code)){
                    $scope.form_guest.checkValidity().then(function(){
                        $scope.disabled_submit = true;
                        agentGuest.update($scope.guest_c,function(){
                            topAlert.success("修改成功！");
                            $scope.disabled_submit = false;
                            $location.path('/agent/guest-list');
                        },function(){
                            $scope.disabled_submit = false;
                        });
                    });
                }else{
                    //执行验证方法
                    $scope.form_guest.checkValidity().then(function(){
                        $scope.disabled_submit = true;

                        //提交数据 这时会有拦截器验证身份和验证数据 验证没有通过则返回一个bad相应 调用失败的方法 如果成功则显示添加成功的相关内容
                        agentGuest.save($scope.guest_c,function(){
                            topAlert.success("添加成功！");
                            $scope.disabled_submit = false;
                            $location.path('/agent/guest-list');
                        },function(){
                            $scope.disabled_submit = false;
                        });
                    });
                }
            }

            $scope.reset = function(){
                if($stateParams.id){
                    $scope.guest =  angular.copy(original_reset);
                    if($scope.guest.guestTels.length == 0){
                        $scope.agent.guestTels.push({"notice_type": "","telephone_number": "", "area_code_id": "", "remark":""});
                    }
                    if(!angular.isUndefined($scope.guest.guestImages[0]) && angular.isUndefined($scope.guest.guestImages[1])){
                        $scope.img1 = $scope.guest.guestImages[0].show_image_path;
                        $scope.img2 ="";
                    }else if(angular.isUndefined($scope.guest.guestImages[0]) && !angular.isUndefined($scope.guest.guestImages[1])){
                        $scope.img1 ="";
                        $scope.img2 =$scope.guest.guestImages[1].show_image_path;
                    }else if(!angular.isUndefined($scope.guest.guestImages[0]) && !angular.isUndefined($scope.guest.guestImages[1])){
                        $scope.img1 = $scope.guest.guestImages[0].show_image_path;
                        $scope.img2 =$scope.guest.guestImages[1].show_image_path;
                    }else{
                        $scope.img1 = "";
                        $scope.img2 = "";
                    }
                }else{
                    $scope.guest = angular.copy(original);
                }
            }



    }]).controller('agentGuestDetailCtrl',['$scope','agentGuest','globalFunction','$stateParams','$location','breadcrumb','noticeTypes','getDate','topAlert','qzPrinter',
                function($scope,agentGuest,globalFunction,$stateParams,$location,breadcrumb,noticeTypes,getDate,topAlert,qzPrinter){

                    //麵包屑導航
                    breadcrumb.items = [
                        {"name":"客人列表","url":'agent/guest-list'},
                        {"name":"客人詳細","active":true}
                    ];

                    $scope.print_agent_image_submit = false;

                    $scope.print_agent_image = function(url){
                        if(!url){
                            topAlert.warning('暫無證件圖片');
                            return;
                        }

                        $scope.print_agent_image_submit = true;

                        qzPrinter.print('PDFIdPhoto',"",{image_url:url}).then(function(){
                            topAlert.success('列印成功');
                            $scope.print_agent_image_submit = false;
                        },function(msg){
                            $scope.print_agent_image_submit = false;
                        })
                    };


                    $scope.now_data = getDate(new Date());
                    $scope.notice_types = noticeTypes.items;

                    if(!angular.isUndefined($stateParams.id)) {
                        agentGuest.get(globalFunction.generateUrlParams({id: $stateParams.id}, {guestTels:{},idCards:{},guestImages:{}})).$promise.then(function(guest_detail){
                            $scope.guest_detail = guest_detail;
                        });
                    }
                    //返回戶口列表
                    $scope.goToGuest = function(){
                        $location.path('agent/guest-list');
                    }
                    //编辑
                    $scope.updateGuest= function(){
                        $location.path('/agent/agent-guest-create/'+$stateParams.id);
                    }

    }]).controller('agentShowGuestDetailCtrl',['$scope','agentGuest','globalFunction','$stateParams','$location','breadcrumb','noticeTypes','getDate','id','$modalInstance','topAlert','qzPrinter',
            function($scope,agentGuest,globalFunction,$stateParams,$location,breadcrumb,noticeTypes,getDate,id,$modalInstance,topAlert,qzPrinter){

                $scope.print_agent_image_submit = false;

                $scope.print_agent_image = function(url){
                    if(!url){
                        topAlert.warning('暫無證件圖片');
                        return;
                    }

                    $scope.print_agent_image_submit = true;

                    qzPrinter.print('PDFIdPhoto',"",{image_url:url}).then(function(){
                        topAlert.success('列印成功');
                        $scope.print_agent_image_submit = false;
                    },function(msg){
                        $scope.print_agent_image_submit = false;
                    })
                };

                $scope.now_data = getDate(new Date());
                $scope.notice_types = noticeTypes.items;
                if(id) {
                    agentGuest.get(globalFunction.generateUrlParams({id:id}, {guestTels:{},idCards:{},guestImages:{}})).$promise.then(function(guest_detail){
                        $scope.guest_detail = guest_detail;
                    });
                }
                //返回戶口列表
                $scope.goToGuest = function(){
                    $modalInstance.close();
                    $location.path('agent/guest-list');
                }
                //编辑
                $scope.updateGuest= function(){
                    $modalInstance.close();
                    $location.path('/agent/agent-guest-create/'+id);
                }

    }]).controller('agentInfoListCtrl',['$scope','agentsLists','tmsPagination','breadcrumb','topAlert',
        function($scope,agentsLists,tmsPagination,breadcrumb,topAlert){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"戶口信息表","active":true}
            ];
            //定義存卡記錄變量
            var original;
            var init_condition = {
                "prefix":"",
                "num":["",""],
                "is_used":""
            }
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.excel_condition = {
                group_name :"",
                find_range : ["",""],
                type : ""
            }

            //初始化數據
            $scope.agentInfos = [];
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = agentsLists;
//            $scope.pagination.max_size = 6;
            $scope.pagination.items_per_page = 100;
            $scope.pagination.query_method = "usedAgent";
            $scope.select = function(page){
                if(!$scope.condition.prefix){
                    topAlert.warning("請輸入編號開頭!");
                    return;
                }else if(!$scope.condition.is_used){
                    topAlert.warning("請選擇類型!");
                    return;
                }else if(!$scope.condition.num[0] || !$scope.condition.num[1] || parseFloat($scope.condition.num[0]) > parseFloat($scope.condition.num[1])){
                    topAlert.warning("請輸入正確的查詢範圍!");
                    return;
                }
                if(parseInt($scope.condition.num[0]) > 1000000000 || parseInt($scope.condition.num[1]) > 1000000000){
                    topAlert.warning("查詢範圍必须在1~1000000000");
                    return;
                }

                $scope.excel_condition.group_name = $scope.condition.prefix;
                $scope.excel_condition.find_range[0] = $scope.condition.num[0];
                $scope.excel_condition.find_range[1] = $scope.condition.num[1];
                $scope.excel_condition.type = "1" === $scope.condition.is_used ? 2 : 1; //报表 1：未開戶，2：已開戶

                $scope.agentInfos = [];
                $scope.pagination.select(page,$scope.condition,{sort:"ROWNUMID"}).$promise.then(function(all_agentInfos){
                    $scope.all_agentInfos = all_agentInfos;
                    for (var i = 0; i < Math.ceil($scope.all_agentInfos.length / 10); i++) {
                        $scope.agentInfos.push($scope.all_agentInfos.slice(i * 10, 10 * (i + 1)));
                    }
                    _.each($scope.agentInfos,function(agent_info){
                        if(agent_info.length < 10){
                            for(var i = agent_info.length;i<10;i++){
                                agent_info.push({id:"",agent_code:"", ROWNUMID:""});
                            }
                        }
                    });
                });
            }
            //$scope.select();

            $scope.search = function(){
                $scope.select();
            }

            $scope.reset = function(){
                $scope.condition = angular.copy(original);
                $scope.excel_condition = {
                    group_name :"",
                    find_range : ["",""],
                    type : ""
                }
                $scope.pagination.select(1,$scope.condition).$promise.then(function(all_agentInfos){
                    $scope.agentInfos = all_agentInfos;
                })
            }


    }]).controller('agentStructureCtrl',['$scope','agentsLists','globalFunction','refAgentGroupType','topAlert','breadcrumb',
            function($scope,agentsLists,globalFunction,refAgentGroupType,topAlert,breadcrumb){
                //麵包屑導航
                breadcrumb.items = [
                    {"name":"戶口結構圖","active":true}
                ];
                $scope.structure ="請輸入戶口編號";
                $scope.condition = {
                    refAgentGroupTypeOwner:{id:""}
                }

                $scope.$watch('agent_code',globalFunction.debounce(function(new_value,old_value){
                    $scope.agent ={};
                    $scope.refagents =[];
                    if(new_value){
                        agentsLists.query(globalFunction.generateUrlParams({agent_code:new_value},{})).$promise.then(function(agents){
                            if(agents.length){
                                $scope.agent = agents[0];
                                if($scope.agent.id){
                                    refAgentGroupType.getAgentGroupMembers({agent_info_id: $scope.agent.id,sort:"agentInfo.agent_code NUMASC"}).$promise.then(function(refagents){
                                        $scope.refagents = _.filter(refagents, function(refagent){ return refagent.agent_info_id != $scope.agent.id;})
                                    })
                                }else{
                                    topAlert.warning("此戶口不存在！");
                                }
                            }
                        });
                    }
                }));
                //
                $scope.changAgentCode = function(ref_agent){

                    if(ref_agent.type == '3'){
                        topAlert.warning("此戶口沒有下線戶口！");
                    }else{
                        $scope.agent ={};
                        $scope.refagents =[];
                        if(ref_agent.agent_info_id){
                            $scope.agent = ref_agent;
                            refAgentGroupType.getAgentGroupMembers({agent_info_id: ref_agent.agent_info_id,sort:"agentInfo.agent_code NUMASC"}).$promise.then(function(refagents){
                                $scope.refagents = _.filter(refagents, function(refagent){ return refagent.agent_info_id != $scope.agent.id; })
                            })
                        }
                    }
                }


    }]).controller('agentMessageOrderCtrl',['$scope','agentOrders','agentOrderType','departMent','agentModule','hallName','OrderPriority','tmsPagination','breadcrumb','$modal','$filter','$location','orderTypes','topAlert','windowItems','pinCodeModal','getDate','goBackData',
        function($scope,agentOrders,agentOrderType,departMent,agentModule,hallName,OrderPriority,tmsPagination,breadcrumb,$modal,$filter,$location,orderTypes,topAlert,windowItems,pinCodeModal,getDate,goBackData){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"Order紙管理","active":true}
            ];
            //初始化查詢條件
            var original_condition;
            var init_condition = {
                hall_id:"",
                order_type:"",
                order_type_id:"",
                modules:{module_id:""},
                agentInfos:{agent_code:""},
                agentGroups:{agent_group_name:""},
                start_time:['',''],
                end_time:['',''],
                create_time:['',''],
                user:{name:""},
                is_expired:"",
                sort:"agentInfos.agent_code"
            };
            original_condition = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.condition = goBackData.get('condition',$scope.condition);
            //自定義變量
            $scope.now_data = getDate(new Date());
            $scope.departMents = departMent.query();//部門
            $scope.agentModules = agentModule.query();//模組
            $scope.prioritys= OrderPriority.items;
            $scope.agentOrderTypes =  agentOrderType.query();
            $scope.orderTypes = orderTypes;
            $scope.halls = hallName.query({hall_type:"|3"});
            //初始化order列表數據
            var conditions ;
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = agentOrders;
            $scope.pagination.items_per_page = 10;
            $scope.pagination.query_method = "agentOrderLists";
            $scope.select = function(page){
                conditions =angular.copy($scope.condition);
                conditions.start_time[1] = $filter('date')($scope.condition.start_time[1], 'yyyy-MM-dd');
                conditions.end_time[0] = $filter('date')($scope.condition.end_time[0], 'yyyy-MM-dd');
                conditions.create_time[0] = $filter('date')($scope.condition.create_time[0], 'yyyy-MM-dd');
                conditions.create_time[1] = $filter('date')($scope.condition.create_time[1], 'yyyy-MM-dd');
                if( conditions.name != ''){
                    conditions.user.name=conditions.user.name+"!";
                }
                if(conditions.agentGroups.agent_group_name != ''){
                    conditions.agentGroups.agent_group_name=conditions.agentGroups.agent_group_name+"!";
                }
                $scope.orders = $scope.pagination.select(page,conditions,{user:{},modules:{},agentGroup:{},ref_agent:{}});
            }
            $scope.select();

            //搜索方法
            $scope.search = function(){
                goBackData.set('condition',$scope.condition);
                conditions =angular.copy($scope.condition);
                conditions.start_time[1] = $filter('date')($scope.condition.start_time[1], 'yyyy-MM-dd');
                conditions.end_time[0] = $filter('date')($scope.condition.end_time[0], 'yyyy-MM-dd');
                conditions.create_time[0] = $filter('date')($scope.condition.create_time[0], 'yyyy-MM-dd');
                conditions.create_time[1] = $filter('date')($scope.condition.create_time[1], 'yyyy-MM-dd');
                if(conditions.create_time[1] && conditions.create_time[1] < conditions.create_time[0]){
                    topAlert.warning("創建日期中開始日期不能大於結束日期！");
                    return;
                }
                if(conditions.start_time[1] && conditions.start_time[1] < conditions.end_time[0]){
                    topAlert.warning("有效日期中開始日期不能大於結束日期！");
                    return;
                }
                if(conditions.name != ''){
                    conditions.user.name=conditions.user.name+"!";
                }
                if(conditions.agentGroups.agent_group_name != ''){
                    conditions.agentGroups.agent_group_name=conditions.agentGroups.agent_group_name+"!";
                }
                $scope.orders = $scope.pagination.select(1,conditions,{user:{},modules:{},agentGroup:{},ref_agent:{}});
            }

            //重置方法
            $scope.reset =function(){
                $scope.condition = angular.copy(original_condition);
                $scope.select();
            }

            //新增Order紙
            $scope.addOrder = function(id,agent_code){
                if(id){
                    $location.path('/agent/message-order-create/'+id);
                }else{
                    $location.path('/agent/message-order-create');
                }
            }
            //删除order纸
            $scope.delete = function(id){
                windowItems.confirm('系統提示','確定刪除該條記錄嗎？',function() {
                    pinCodeModal(agentOrders, 'delete', {id: id}, '刪除成功！').then(function () {
                        $scope.select();
                    })
                })
            }
    }]).controller('messageOrderCreateCtrl',['$scope','agentOrders','agentsLists','agentGroup','agentModule','globalFunction','hallName','agentOrderType','OrderPriority','orderTypes','strToTime','$filter','globalConfig','topAlert','$stateParams','$location','getDate','user',
        function($scope,agentOrders,agentsLists,agentGroup,agentModule,globalFunction,hallName,agentOrderType,OrderPriority,orderTypes,strToTime,$filter,globalConfig,topAlert,$stateParams,$location,getDate,user){
            //order變量
            var original_reset;
            $scope.agentModules = agentModule.query();//模組
            $scope.agentOrderTypes =  agentOrderType.query();
            $scope.updateDate=false; //如果order 是修改的话對象類型就改成只读updateDate=true,新增就否之
            $scope.sub_post_put ="POST";
            $scope.create_order_url =globalFunction.getApiUrl('agent/agentorder');
            $scope.prioritys= OrderPriority.items;
            $scope.title ="新增Order紙";
            $scope.agent_group_show = true;
            $scope.enableClientValidation = globalConfig.enableClientValidation;
            $scope.order_mondules = []; //4個每行全部授權項
            $scope.all_mondule = [];  //全部授權項
            $scope.orderTypes = orderTypes;
            var original;

            var init_order= {
                "is_group":"0",
                "agent_group":[{agent_group_code:"",agent_group_name:"",agent_info_id:"",agent_group_id:""}],
                "refOrderAgents":[],
                "refOrderGroups":[],
                "hall_id":"",
                "modules": [ ],
                "order_type_id": "",
                "start_time":new Date(),
                "end_time": "",
                "order_content": "",
                "priority": "",
                "pin_code":""
            }
            original = angular.copy(init_order);
            $scope.order = angular.copy(init_order);
            hallName.query({hall_type:'|3'}).$promise.then(function(halls){
                $scope.halls = _.move(halls,{id:user.hall.id},1);
                _.find($scope.halls,function(hall){
                    if(hall.hall_type == 1){
                        $scope.order.hall_id = hall.id;
                    }
                })
            });
            //戶口跟戶組切換
            $scope.agent_group_type = function(){

                $scope.order.agent_group = angular.copy(original.agent_group);
                $scope.order.agent_group.agent_group_code = "";  //
                $scope.order.refOrderAgents = angular.copy(original.refOrderAgents);
                $scope.order.refOrderGroups = angular.copy(original.refOrderGroups);
                if($scope.order.is_group == '0'){
                    $scope.agent_group_show = true;
                }else{
                    $scope.agent_group_show = false;
                }
            }
            //新增戶口或者戶組
            $scope.addAgentGroup = function(){
                $scope.order.agent_group.push({agent_group_code:"",agent_group_name:"",agent_info_id:"",agent_group_id:""});
                _.each($scope.order.agent_group,function(d,i){
                    d.soft = i+1;
                });
                console.log( $scope.order.agent_group)
            }
            //刪除戶口或者戶組
            $scope.removeAgentGroup = function(agent_info_id,index){
               if($stateParams.id && agent_info_id){
                   if($scope.order.is_group == '0'){
                        if(_.pluck($scope.order.refOrderAgents,'agent_info_id').indexOf(agent_info_id) > 0){
                            $scope.order.refOrderAgents.splice(_.pluck($scope.order.refOrderAgents, 'agent_info_id').indexOf(agent_info_id), 1);
                        }
                   }else{
                       if(_.pluck($scope.order.refOrderGroups,'agent_group_id').indexOf(agent_info_id) > 0){
                           $scope.order.refOrderGroups.splice(_.pluck($scope.order.refOrderGroups, 'agent_group_id').indexOf(agent_info_id), 1);
                       }
                   }
                }
                $scope.order.agent_group.splice(index, 1);
            }

            //根據戶口編號獲取agent_info_id 跟 agent_name
            $scope.$watch('order.agent_group',globalFunction.debounce(function(agent_groups,old_agent_groups){
                if($scope.order.is_group == '0'){
                    angular.forEach(agent_groups,function(agent_group,index){
                        if(agent_group.agent_group_code){
                            var len = _.pluck($scope.order.refOrderAgents,'agent_code').indexOf(agent_group.agent_group_code);
                            if(len < 0 && agent_group.agent_group_code){
                                if (old_agent_groups[index] && old_agent_groups[index].agent_group_code != agent_group.agent_group_code) {
                                    agentsLists.query(globalFunction.generateUrlParams({agent_code: agent_group.agent_group_code}, {})).$promise.then(function (agent) {
                                        if (agent.length > 0) {
                                            $scope.agent = agent[0];
                                            agent_group.agent_group_name = $scope.agent.agent_name;
                                            agent_group.agent_info_id = $scope.agent.id;
                                        } else {
                                            agent_group.agent_group_name = "";
                                            agent_group.agent_info_id = "";
                                        }
                                    });
                                }
                            }else{
                                agent_group.agent_group_name =$scope.order.refOrderAgents[len].agent_name;
                                agent_group.agent_info_id = $scope.order.refOrderAgents[len].agent_info_id;
                            }
                        }else{
                            agent_group.agent_group_name = "";
                            agent_group.agent_info_id = "";
                        }
                    });
                }else{
                    var num = -1;
                    $scope.ref_order_groups=[];
                    angular.forEach(agent_groups,function(agent_group,index){
                        if(agent_group.agent_group_code) {
                            if($scope.order.refOrderGroups.length > 0 && $stateParams.id && $scope.order.refOrderGroups.agentGroup){
                                $scope.ref_order_groups =  _.pluck($scope.order.refOrderGroups,'agentGroup');
                            }
                            num = _.pluck($scope.ref_order_groups,'agent_group_name').indexOf(agent_group.agent_group_code);
                            if(num < 0 && agent_group.agent_group_code){
                                if (old_agent_groups[index] && agent_group.agent_group_code) {
                                    agentGroup.query(globalFunction.generateUrlParams({agent_group_name: agent_group.agent_group_code}, {refAgentGroupTypeOwner:{}})).$promise.then(function (groups) {
                                        if (groups.length > 0) {
                                            agent_group.agent_group_id = groups[0].id;
                                            if(groups[0].refAgentGroupTypeOwner){
                                                agent_group.agent_group_name = groups[0].refAgentGroupTypeOwner.agent_name;
                                            }
                                        }else{
                                            agent_group.agent_group_id ="";
                                            agent_group.agent_group_name ="";
                                        }
                                    });
                                }
                            }else{
                                agent_group.agent_group_name =$scope.order.refOrderGroups[num].agentGroup.agent_group_name;
                                agent_group.agent_group_id = $scope.order.refOrderGroups[num].agent_group_id;
                            }
                        }else {
                            agent_group.agent_group_id ="";
                            agent_group.agent_group_name = "";
                        }
                    })
                }
            },500),true);

            //模組排列
            $scope.module_checked_layout = function(){
                agentModule.query().$promise.then(function(agent_module){
                    $scope.all_mondule = agent_module;
                    $scope.order_mondules = [];
                    for(var i = 0; i<Math.ceil($scope.all_mondule.length/3); i++){
                        $scope.order_mondules.push($scope.all_mondule.slice(i*3,3*(i+1)))
                    }
                });
            }
            $scope.module_checked_layout();
            //全選跟取消全選
            $scope.order_check_alls = "";
            $scope.order_check_all = function(){
                $scope.order.modules = [];
                if($scope.order_check_alls){
                    _.each($scope.all_mondule,function(mondule){
                        mondule.selected = true;
                        $scope.order.modules.push({module_id:mondule.id,disable:"0"});
                    });
                }else{
                    _.each($scope.all_mondule,function(mondule){
                        mondule.selected = false;
                    });
                }
            }

            $scope.check_order_one = function(od){
                if(od.selected){
                    if($stateParams.id == ''){
                        $scope.order.modules.push({module_id:od.id});
                    }else{
                        if( _.pluck($scope.order.modules,'module_id').indexOf(od.id) >= 0){
                            angular.forEach($scope.order.modules,function(order_module){
                                if(od.id == order_module.module_id){
                                    order_module.disable = "0";
                                }
                            })
                        }else{
                            $scope.order.modules.push({module_id:od.id,disable:"0"});
                        }
                    }
                }else{
                    if($stateParams.id == ''){
                        $scope.order.modules.splice($scope.order.modules.indexOf(od), 1);
                    }else {
                        if(_.pluck($scope.order.modules,'module_id').indexOf(od.id) >= 0){
                            angular.forEach($scope.order.modules,function(order_module){
                                if(od.id == order_module.module_id){
                                    order_module.disable = "1";
                                }
                            })
                        }else{
                            $scope.order.modules.splice($scope.order.modules.indexOf(od), 1);
                        }
                    }
                }
               $scope.len = _.where($scope.order.modules,{disable:"0"}).length;
                if($scope.len == 6){
                    $scope.order_check_alls = true;
                }else{
                    $scope.order_check_alls = false;
                }
            }
            //修改order紙
            if($stateParams.id){
                $scope.updateDate=true;
                $scope.sub_post_put = "PUT";
                $scope.title="修改Order紙";
                agentOrders.get(globalFunction.generateUrlParams({id:$stateParams.id},{modules:{},refOrderAgents:{},refOrderGroups:{agentGroup:""}})).$promise.then(function(order){
                    $scope.order = order;
                    $scope.order.pin_code
                    $scope.order.agent_group =[];
                    if($scope.order.is_group == '0'){
                        $scope.agent_group_show = true;
                        //戶口排序
                        $scope.order.refOrderAgents = _.sortBy($scope.order.refOrderAgents,"soft");
                        _.each($scope.order.refOrderAgents,function(refOrderAgent){
                            $scope.order.agent_group.push({agent_group_code:refOrderAgent.agent_code,agent_group_name:refOrderAgent.agent_name,agent_info_id:refOrderAgent.agent_info_id,agent_group_id:""});
                        });
                    }else{
                        $scope.agent_group_show = false;
                        //戶組排序
                        $scope.order.refOrderGroups = _.sortBy($scope.order.refOrderGroups,"soft");
                        _.each($scope.order.refOrderGroups,function(refOrderGroup){
                            $scope.order.agent_group.push({agent_group_code:refOrderGroup.agentGroup.agent_group_name,agent_group_name:"",agent_info_id:"",agent_group_id:refOrderGroup.agent_group_id});
                        });
                    }
                    $scope.order.start_time = strToTime($scope.order.start_time);
                    $scope.order.end_time = strToTime($scope.order.end_time);
                    original_reset = angular.copy($scope.order);
                    if($scope.order.modules.length > 0){
                        agentModule.query().$promise.then(function(agent_module){
                            $scope.all_mondule = agent_module;
                            $scope.order_mondules = [];
                            for(var i = 0; i<Math.ceil($scope.all_mondule.length/3); i++){
                                $scope.order_mondules.push($scope.all_mondule.slice(i*3,3*(i+1)));
                            }
                            angular.forEach($scope.order.modules,function(order_module){
                                for(var j = 0;j<$scope.order_mondules.length;j++){
                                    for(var k =0 ; k <$scope.order_mondules[j].length;k++){
                                        if($scope.order_mondules[j][k].id == order_module.module_id){
                                            $scope.order_mondules[j][k].selected = true;
                                        }
                                    }
                                }
                            })
                        });
                    }
                    if($scope.order.modules.length == 6){
                        $scope.order_check_alls = true;
                    }else{
                        $scope.order_check_alls = false;
                    }
                });
            }
            //增加Order
            $scope.disabled_submit = false;
            $scope.add = function(){
                if($scope.disabled_submit){
                    return $scope.disabled_submit;
                }
                if($scope.order.is_group == '0'){
                    $scope.order.agent_info_id = _.pluck($scope.order.agent_group, 'agent_info_id');
                    $scope.order.agent_group_id =[];
                    if(!$stateParams.id){
                        $scope.order.refOrderAgents =[];
                    }
                    _.each($scope.order.agent_group,function(agent_group){
                       if($stateParams.id){
                           if(_.pluck($scope.order.refOrderAgents, 'agent_info_id').indexOf(agent_group.agent_info_id) < 0){
                               $scope.order.refOrderAgents.push({agent_info_id:agent_group.agent_info_id,soft:agent_group.soft});
                           }
                           _.each($scope.order.refOrderAgents,function(refOrderAgent,index){
                                if(_.pluck($scope.order.agent_group, 'agent_info_id').indexOf(refOrderAgent.agent_info_id) < 0){
                                    $scope.order.refOrderAgents.splice(index,1);
                                }
                           })
                       }else{
                            $scope.order.refOrderAgents.push({agent_info_id:agent_group.agent_info_id,soft:agent_group.soft});
                       }
                    })
                    var agent_info_id_uniq = _.uniq($scope.order.agent_info_id);
                    if($scope.order.agent_info_id.length > 0 && $scope.order.agent_info_id.length != agent_info_id_uniq.length){
                        topAlert.warning('户口編號不存在或不能重复！');
                        return;
                    }

                    _.each($scope.order.agent_group,function(group,index){
                        _.each($scope.order.refOrderAgents,function(data,i){
                            if(group.agent_info_id==data.agent_info_id)
                                data.soft=group.soft;
                        });
                    });
                }else{
                    $scope.order.agent_info_id =[];
                    $scope.order.agent_group_id =_.pluck($scope.order.agent_group, 'agent_group_id');
                    if(!$stateParams.id){
                        $scope.order.refOrderGroups =[];
                    }
                    _.each($scope.order.agent_group,function(agent_group){
                        if($stateParams.id){
                            if(_.pluck($scope.order.refOrderGroups, 'agent_group_id').indexOf(agent_group.agent_group_id) < 0){
                                $scope.order.refOrderGroups.push({agent_group_id:agent_group.agent_group_id,soft:agent_group.soft});
                            }
                            _.each($scope.order.refOrderGroups,function(refOrderGroup,index){
                                if(_.pluck($scope.order.agent_group, 'agent_group_id').indexOf(refOrderGroup.agent_group_id) < 0){
                                    $scope.order.refOrderGroups.splice(index,1);
                                }
                            })
                        }else{
                            $scope.order.refOrderGroups.push({agent_group_id:agent_group.agent_group_id,soft:agent_group.soft});
                        }
                    })
                    var agent_group_id_uniq = _.uniq( $scope.order.agent_group_id);
                    if($scope.order.agent_group_id.length > 0 && $scope.order.agent_group_id.length!=agent_group_id_uniq.length){
                        topAlert.warning('戶組不存在或不能重复！');
                        return;
                    }

                    _.each($scope.order.agent_group,function(group,index){
                        _.each($scope.order.refOrderGroups,function(data,i){
                            if(group.agent_group_id==data.agent_group_id)
                                data.soft=group.soft;
                        });
                    });
                }
                $scope.order.start_time= $filter('date')($scope.order.start_time, 'yyyy-MM-dd HH:mm:ss');
                $scope.order.end_time= $filter('date')($scope.order.end_time, 'yyyy-MM-dd HH:mm:ss');
                if($scope.order.end_time && $scope.order.end_time < $scope.order.start_time){
                    topAlert.warning("開始日期不能大於結束日期！");
                    return;
                }
                if(angular.isUndefined($scope.order.end_time)){
                    $scope.order.end_time = '';
                }

                if(!$stateParams.id){
                    var module_obj = [];
                    var module_data = _.where($scope.all_mondule,{selected:true});
                    _.each(module_data, function (data) {
                        module_obj.push({module_id: data.id});
                    });
                    $scope.order.modules = module_obj;
                }

                if($scope.order.modules.length>0){
                    if($stateParams.id){
                        $scope.disabled_submit = true;
                        $scope.form_create_order.checkValidity().then(function(){
                            agentOrders.update($scope.order,function(){
                                topAlert.success("修改成功！");
                                $location.path('/agent/message-order');
                                $scope.disabled_submit = false;
                            },function(){
                                $scope.disabled_submit = false;
                            });
                        })
                    }else{
                        $scope.form_create_order.checkValidity().then(function() {
                            $scope.disabled_submit = true;
                            agentOrders.save($scope.order, function () {
                                topAlert.success("添加成功！");
                                $location.path('/agent/message-order');
                                $scope.disabled_submit = false;
                            },function(){
                                $scope.disabled_submit = false;
                            });
                        });
                    }
//                    });
                }else{
                    topAlert.warning("模組不能為空！");
                }
            }
            //重置Order
            $scope.reset = function(){
                $scope.form_create_order.$setPristine();
                $scope.form_create_order.clearErrors();
                if($stateParams.id){
                    $scope.order =  angular.copy(original_reset);
                    if($scope.order.modules.length > 0){
                        agentModule.query().$promise.then(function(agent_module){
                            $scope.all_mondule = agent_module;
                            $scope.order_mondules = [];
                            for(var i = 0; i<Math.ceil($scope.all_mondule.length/3); i++){
                                $scope.order_mondules.push($scope.all_mondule.slice(i*3,3*(i+1)));
                            }
                            angular.forEach($scope.order.modules,function(order_module){
                                for(var j = 0;j<$scope.order_mondules.length;j++){
                                    for(var k =0 ; k <$scope.order_mondules[j].length;k++){
                                        if($scope.order_mondules[j][k].id == order_module.module_id){
                                            $scope.order_mondules[j][k].selected = true;
                                        }
                                    }
                                }
                            })
                        });
                    }
                }else{
                    $scope.order = angular.copy(original);
                    $scope.order_check_alls = false;
                    agentModule.query().$promise.then(function(agent_module){
                        $scope.all_mondule = agent_module;
                        $scope.order_mondules = [];
                        for(var i = 0; i<Math.ceil($scope.all_mondule.length/3); i++){
                            $scope.order_mondules.push($scope.all_mondule.slice(i*3,3*(i+1)));
                        }
                        for(var j = 0;j<$scope.order_mondules.length;j++){
                            for(var k =0 ; k <$scope.order_mondules[j].length;k++){
                                $scope.order_mondules[j][k].selected = false;

                            }
                        }
                    })
                }
            }
        }]).controller('messageAgentOrderCreateCtrl',['$scope','agentOrders','agentsLists','agentGroup','agentModule','globalFunction','hallName','agentOrderType','OrderPriority','orderTypes','id','strToTime','$filter','$modalInstance','globalConfig','topAlert','agent_code','agent_group','user',
        function($scope,agentOrders,agentsLists,agentGroup,agentModule,globalFunction,hallName,agentOrderType,OrderPriority,orderTypes,id,strToTime,$filter,$modalInstance,globalConfig,topAlert,agent_code,agent_group,user){
            //order變量
            var original_reset;
            $scope.agentModules = agentModule.query();//模組
            $scope.agentOrderTypes =  agentOrderType.query();
            $scope.updateDate=false; //如果order 是修改的话對象類型就改成只读updateDate=true,新增就否之
            $scope.create_order_url =globalFunction.getApiUrl('agent/agentorder');
            $scope.prioritys= OrderPriority.items;
            $scope.sub_post_put ="POST";
            $scope.title ="新增Order紙";
            $scope.agent_group_show = true;
            $scope.enableClientValidation = globalConfig.enableClientValidation;
            $scope.order_mondules = []; //4個每行全部授權項
            $scope.all_mondule = [];  //全部授權項
            $scope.orderTypes = orderTypes;

            var original;
            var init_order= {
            "is_group":"0",
            "agent_info_id": "",
            "agent_code":"",
            "agent_group_id":"",
            "agent_group":"",
            "hall_id":"",
            "modules": [ ],
            "order_type_id": "",
            "refOrderAgents":[{agent_info_id:""}],
            "refOrderGroups":[{agent_group_id:""}],
            "start_time": new Date(),
            "end_time": "",
            "order_content": "",
            "priority": "",
            "pin_code":"",
            "order_check_alls":""
            }
            original = angular.copy(init_order);
            $scope.order = angular.copy(init_order);
            hallName.query({hall_type:'|3'}).$promise.then(function(halls){
                $scope.halls = _.move(halls,{id:user.hall.id},1);
                _.find($scope.halls,function(hall){
                    if(hall.hall_type == 1){
                        $scope.order.hall_id = hall.id;
                    }
                })
            });
            //戶口跟戶組切換
            $scope.agent_group_type = function(){
                $scope.order.agent_code = "";
                $scope.order.agent_info_id ="";
                $scope.order.agent_group = "";
                $scope.order.agent_group_id ="";
                if($scope.order.is_group == '0'){
                    $scope.agent_group_show = true;
                    $scope.order.agent_code = agent_code;
                }else{
                    $scope.agent_group_show = false;
                    $scope.order.agent_group = agent_group;
                }
            }

            //根據戶口編號獲取agent_info_id 跟 agent_name
            $scope.$watch('order.agent_code',globalFunction.debounce(function(new_value,old_value){
                $scope.agent =[];
                if(new_value){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code:new_value}, {})).$promise.then(function (agent) {
                        if(agent.length > 0){
                            $scope.agent = agent[0];
                            $scope.order.agent_info_id = $scope.agent.id;
                        }else{
                            $scope.agent ={};
                        }
                    });
                }else{
                    $scope.agent = {};
                }
            }));
            //根據戶組獲取agent_group_id 跟 owner_name
            $scope.$watch('order.agent_group',globalFunction.debounce(function(new_value,old_value){
                $scope.group =[];
                if(new_value){
                    agentGroup.query(globalFunction.generateUrlParams({agent_group_name:new_value}, {})).$promise.then(function (groups) {
                        if(groups.length > 0){
                            $scope.order.agent_group_id = groups[0].id;
                            agentsLists.query(globalFunction.generateUrlParams({agent_code:groups[0].owner_name}, {})).$promise.then(function (agents) {
                                if(agents.length > 0){
                                    $scope.group = agents[0];
                                }else{
                                    $scope.group ={};
                                }
                            });
                        }
                    });
                }else{
                    $scope.group = {};
                }
            }));

            //模組排列
            $scope.module_checked_layout = function(){
                agentModule.query().$promise.then(function(agent_module){
                    $scope.all_mondule = agent_module;
                    $scope.order_mondules = [];
                    for(var i = 0; i<Math.ceil($scope.all_mondule.length/3); i++){
                        $scope.order_mondules.push($scope.all_mondule.slice(i*3,3*(i+1)))
                    }
                });
            }
            if(id == '') {
                $scope.module_checked_layout();
            }
            if(id == '' && agent_code){
                $scope.order.agent_code = agent_code;
            }
            if(id){
                $scope.updateDate=true;
                $scope.title ="修改Order紙";
                agentOrders.get(globalFunction.generateUrlParams({id:id},{modules:{},refOrderAgents:{},refOrderGroups:{agentGroup:""}})).$promise.then(function(order){
//                agentOrders.get(globalFunction.generateUrlParams({id:id},{modules:{},refOrderAgents:{},refOrderGroups:{agentGroup:""}})).$promise.then(function(order){
                        $scope.order = order;
                        if($scope.order.is_group == '0'){
                            $scope.agent_group_show = true;
                            _.each($scope.order.refOrderAgents,function(refOrderAgent){
                                if(refOrderAgent.agent_code){
                                    $scope.order.agent_code = refOrderAgent.agent_code;
                                    $scope.order.refOrderAgents[0].agent_info_id = refOrderAgent.agent_info_id;

                                }
                            });
                        }else{
                            $scope.agent_group_show = false;
                            _.each($scope.order.refOrderGroups,function(refOrderGroup){
                                if(refOrderGroup.agentGroup.agent_group_name){
                                    $scope.order.agent_group = refOrderGroup.agentGroup.agent_group_name;
                                    $scope.order.refOrderGroups[0].agent_group_id = refOrderGroup.agent_group_id;
                                }
                            });
                        }
                        $scope.order.start_time = strToTime($scope.order.start_time);
                        $scope.order.end_time = strToTime($scope.order.end_time);
                        original_reset = angular.copy($scope.order);
                        if($scope.order.modules.length > 0){
                            agentModule.query().$promise.then(function(agent_module){
                                $scope.all_mondule = agent_module;
                                $scope.order_mondules = [];
                                for(var i = 0; i<Math.ceil($scope.all_mondule.length/3); i++){
                                    $scope.order_mondules.push($scope.all_mondule.slice(i*3,3*(i+1)));
                                }
                                angular.forEach($scope.order.modules,function(order_module){
                                    for(var j = 0;j<$scope.order_mondules.length;j++){
                                        for(var k =0 ; k <$scope.order_mondules[j].length;k++){
                                            if($scope.order_mondules[j][k].id == order_module.module_id){
                                                $scope.order_mondules[j][k].selected = true;
                                            }
                                        }
                                    }
                                })
                            });
                        }
                        if($scope.order.modules.length == 6){
                            $scope.order.order_check_alls = true;
                        }else{
                            $scope.order.order_check_alls = false;
                        }
                    });
                }

//            }
            //全選跟取消全選
            $scope.order_check_alls =false;
            $scope.order_check_all = function(){
                $scope.order.modules = [];
                //$scope.order_check_alls = order_check_alls;
                if($scope.order.order_check_alls){
                    _.each($scope.all_mondule,function(mondule){
                        mondule.selected = true;
                        $scope.order.modules.push({module_id:mondule.id});
                    });
                }else{
                    _.each($scope.all_mondule,function(mondule){
                        mondule.selected = false;
                    });

                }
            }
            //模組单个复选框选中取消
            $scope.check_order_one = function(od){
                    if(od.selected){
                        if(id == ''){
                            $scope.order.modules.push({module_id:od.id});
                        }else{
                            if( _.pluck($scope.order.modules,'module_id').indexOf(od.id) >= 0){
                                angular.forEach($scope.order.modules,function(order_module){
                                    if(od.id == order_module.module_id){
                                        order_module.disable = "0";
                                    }
                                })
                            }else{
                                $scope.order.modules.push({module_id:od.id,disable:"0"});
                            }
                        }
                    }else{
                        if(id == ''){
                            $scope.order.modules.splice($scope.order.modules.indexOf(od), 1);
                        }else {
                            if(_.pluck($scope.order.modules,'module_id').indexOf(od.id) >= 0){
                                angular.forEach($scope.order.modules,function(order_module){
                                    if(od.id == order_module.module_id){
                                        order_module.disable = "1";
                                    }
                                })
                            }else{
                                $scope.order.modules.splice($scope.order.modules.indexOf(od), 1);
                            }
                        }
                    }
                    if($scope.order.modules.length == 6){
                        $scope.order.order_check_alls = true;
                    }else{
                        $scope.order.order_check_alls = false;
                    }
            }


            //增加Order
            $scope.add = function(){
                if($scope.order.is_group == '0'){
                    $scope.order.agent_group_id ="";
                    $scope.order.agent_group="";
                    $scope.order.refOrderGroups=[];
                    $scope.order.refOrderAgents[0].agent_info_id = $scope.order.agent_info_id;
                }else{
                    $scope.order.agent_info_id = "";
                    $scope.order.agent_code="";
                    $scope.order.refOrderAgents =[];
                    $scope.order.refOrderGroups[0].agent_group_id = $scope.order.agent_group_id;
                }
                $scope.order.start_time= $filter('date')($scope.order.start_time, 'yyyy-MM-dd HH:mm:ss');
                $scope.order.end_time= $filter('date')($scope.order.end_time, 'yyyy-MM-dd HH:mm:ss');
                if($scope.order.end_time && $scope.order.end_time < $scope.order.start_time){
                    topAlert.warning("開始日期不能大於結束日期！");
                    return;
                }

                if(!id){
                    var module_data = _.where($scope.all_mondule,{selected:true});
                    var module_obj = [];
                    _.each(module_data,function(data){
                        module_obj.push({module_id:data.id});
                    });
                    $scope.order.modules = module_obj;
                }
                if($scope.order.modules.length>0){
                        if(id){
                            $scope.form_create_order.checkValidity().then(function(){
                                agentOrders.update($scope.order,function(){
                                    topAlert.success("修改成功！");
                                    $modalInstance.close(true);
                                });
                            })
                        }else{
                            $scope.form_create_order.checkValidity().then(function() {
                                agentOrders.save($scope.order, function () {
                                    topAlert.success("添加成功！");
                                    $modalInstance.close(true);
                                });
                            });
                        }
//                    });
                }else{
                    topAlert.warning("模組不能為空！");
                }
            }

            //重置Order
            $scope.reset = function(){
                $scope.order_check_alls = false;
                if(id != ''){
                    $scope.order =  angular.copy(original_reset);
                    if($scope.order.modules.length > 0){
                        agentModule.query().$promise.then(function(agent_module){
                            $scope.all_mondule = agent_module;
                            $scope.order_mondules = [];
                            for(var i = 0; i<Math.ceil($scope.all_mondule.length/3); i++){
                                $scope.order_mondules.push($scope.all_mondule.slice(i*3,3*(i+1)));
                            }
                            angular.forEach($scope.order.modules,function(order_module){
                                for(var j = 0;j<$scope.order_mondules.length;j++){
                                    for(var k =0 ; k <$scope.order_mondules[j].length;k++){
                                        if($scope.order_mondules[j][k].id == order_module.module_id){
                                            $scope.order_mondules[j][k].selected = true;
                                        }
                                    }
                                }
                            })
                        });
                    }
                }else{
                    $scope.form_create_order.$setPristine();
                    $scope.order = angular.copy(original);

                    agentModule.query().$promise.then(function(agent_module){
                        $scope.all_mondule = agent_module;
                        $scope.order_mondules = [];
                        for(var i = 0; i<Math.ceil($scope.all_mondule.length/3); i++){
                            $scope.order_mondules.push($scope.all_mondule.slice(i*3,3*(i+1)));
                        }
                            for(var j = 0;j<$scope.order_mondules.length;j++){
                                for(var k =0 ; k <$scope.order_mondules[j].length;k++){
                                        $scope.order_mondules[j][k].selected = false;

                                }
                            }
                        })
                    }
            }

    }]).controller('agentMessageListCtrl', [
    '$scope','$modal','$log','breadcrumb','search','page','messageList','newAgent', function($scope,$modal,$log,breadcrumb,search,page,messageList,newAgent) {
          breadcrumb.items = [
              {"name":"消息提醒","active":true}
          ];
          messageList.query().$promise.then(function(messages){
              $scope.all_messages = messages;
              $scope.messages_s = messages;
              $scope.messages = page.select(1,messages);
          });

          $scope.status = ['已完成','未完成'];
          $scope.receivers = ['場面','賬房'];
          $scope.senders = ['場面','賬房'];
          $scope.modules = ['場面戶口速查','賬房'];
          //resset form
          var original;
          $scope.condition = {
          };

          original = angular.copy($scope.condition);
          $scope.reset = function(){
              $scope.condition = angular.copy(original);
              $scope.form_search.$setPristine();
          }
          //search form
          var search_config = [
              {field_name:'receiver'},
              {field_name:'agent_code'},
              {field_name:'module'},
              {field_name:'sender'},
              {field_name:'operator'},
              {field_name:'status'},
              {field_name:'effective_time',comparison_type:'>=',condition_name:'effective_start_time',data_type:'date'},
              {field_name:'effective_time',comparison_type:'<=',condition_name:'effective_end_time',data_type:'date'},
              {field_name:'create_time',comparison_type:'>=',condition_name:'created_start_time',data_type:'date'},
              {field_name:'create_time',comparison_type:'<=',condition_name:'created_end_time',data_type:'date'}
          ];

          $scope.search = function(){

              $scope.all_messages = search($scope.messages_s,search_config,$scope.condition);
              $scope.messages = page.select(1, $scope.all_messages);
          }

          $scope.remove=function(index){
              $scope.messages.splice(index,1);
          }

          $scope.add = function (){
                  var modalInstance;
                  modalInstance = $modal.open({
                      templateUrl: "views/agent/message-create.html",
                      controller: 'agentMessageCreateCtrl',
                      resolve: {
                          messages_s: function() {
                              return $scope.messages_s;
                          },
                          num:function(){
                              return '';
                          },
                          message_title:function(){
                              return '新增消息';
                          },
                          agent_code:function(){
                              return '';
                          }
                      }
                  });
                  modalInstance.result.then((function(message) {
                      message.id= $scope.messages_s.length+"";
                      $scope.message = message;
                      if( $scope.message != null){
                          $scope.messages_s.push($scope.message);
                          $scope.messages.push($scope.message);
                      }
                  }), function() {
                      $log.info("Modal dismissed at: " + new Date());
                  });
          }

          $scope.edit = function (num,id){
              var modalInstances;
              modalInstances = $modal.open({
                  templateUrl: "views/agent/message-create.html",
                  controller: 'agentMessageCreateCtrl',
                  resolve: {
                      messages_s: function() {
                          return $scope.messages_s;
                      },
                      num:function(){
                          return id;
                      },
                      message_title:function(){
                          return '消息編輯';
                      },
                      agent_code:function(){
                          return '';
                      }
                  }
              });

              modalInstances.result.then((function(message) {
                  $scope.message = message;
                  if( $scope.message != null){
                      $scope.messages_s[$scope.num] = message;
                      $scope.messages[$scope.num] = message;
                  }
              }), function() {
                  $log.info("Modal dismissed at: " + new Date());
              });
          }
      }]).controller('agentMessageCreateCtrl',['$scope','$modalInstance','$filter','messageList','newAgent','messages_s','num','message_title','agent_code',function($scope,$modalInstance,$filter,messageList,newAgent,messages_s,num,message_title,agent_code){
              $scope.status = ['已完成','未完成'];
              $scope.receivers = ['場面','賬房'];
              $scope.senders = ['場面','賬房'];
              $scope.modules = ['場面戶口速查','賬房'];
              var original;
              $scope.message = {
                  "id":'',
                  "receiver":"",
                  "agent_code":"",
                  "module":"",
                  "effective_time":"",
                  "create_time":"",
                  "sender":"",
                  "operator":"",
                  "status":"",
                  "content":""
              };

              original = angular.copy($scope.message);
              $scope.remove = function(){
                  $scope.message = angular.copy(original);
                  $scope.form_search.$setPristine();
                  if(agent_code != null){
                      $scope.message.agent_code = agent_code
                  }
              }
              $scope.num = num;
              $scope.message_title = message_title;
                if(parseInt($scope.num) >= 0){
                    $scope.messages_s = messages_s;
                    $scope.message = $scope.messages_s[$scope.num];
                }
                if(agent_code != null){
                    $scope.message.agent_code = agent_code;
                }
                $scope.add = function(){
                  $scope.message.effective_time = $filter('date')($scope.message.effective_time, 'yyyy-MM-dd');
                  $scope.message.create_time = $filter('date')($scope.message.create_time, 'yyyy-MM-dd');
                  $modalInstance.close($scope.message);
                }

  }]).controller('agentContactListCtrl',['$scope','$state','$location','globalFunction','breadcrumb','windowItems','tmsPagination','agentContact','idcardType','topAlert','pinCodeModal','getDate','goBackData','qzPrinter','printerType',
          function($scope,$state,$location,globalFunction,breadcrumb,windowItems,tmsPagination,agentContact,idcardType,topAlert,pinCodeModal,getDate,goBackData,qzPrinter,printerType){
              breadcrumb.items = [
                  {"name":"聯絡人查詢","active":true}
              ];
              $scope.now_data = getDate(new Date());
              $scope.contacters = [];
              //證件類型
              $scope.idcardtypes = idcardType.query();

              $scope.pagination = tmsPagination.create();
              $scope.pagination.resource = agentContact;
              $scope.select = function(page){
                  $scope.contacters = $scope.pagination.select(page,$scope.current_condition,{agentContactIdcards:{},idcardImages:{},agentContactTels:{}});
              }

              //resset form
              //var original;
              var init_condition = {
                'agent_contact_name':'',
                'agentContactTels':{
                    telephone_number:''
                },
                'agentMasterIdcards':{
                    idcard_number:''
                },
                'agentContactIdcards':{
                    idcard_number:''
                },
                'refAgentContactTypeOwner':{
                   contact_type:'null'
                },
              'refAgentContactTypes':{
                  agentInfo:{
                      agent_code:''
                  }
              },
                'sort': 'agent_contact_name'
              };

              //$scope.current_condition = angular.copy(init_condition);
              $scope.condition = angular.copy(init_condition);
              $scope.condition = goBackData.get('condition',$scope.condition);

              $scope.reset = function(){
                  $scope.condition = angular.copy(init_condition);
                  //$scope.current_condition = angular.copy($scope.condition);
                  $scope.form_search.$setPristine();
                  $scope.select();
              }

              $scope.remove = function(id){
                  pinCodeModal(agentContact, 'delete', {id: id}, '刪除成功！').then(function () {
                      $scope.select();
                  })
              }

              //顯示證件照
              $scope.show = true;
                $scope.certificate_images =[{image:""},{image:""}];
                $scope.show_certificate = function(id){
                    $scope.show = false;
                    agentContact.get(globalFunction.generateUrlParams({id:id},{idcardImages:{},agentContactIdcards:{}}),function(contact){
                        $scope.contact_image = contact;
                        if(!angular.isUndefined(contact.idcardImages[0]) && angular.isUndefined(contact.idcardImages[1]) ){
                            $scope.certificate_images =[{image:contact.idcardImages[0].show_image_path},{image:""}];
                        }else if(angular.isUndefined(contact.idcardImages[0]) && !angular.isUndefined(contact.idcardImages[1]) ){
                            $scope.certificate_images =[{image:""},{image:contact.idcardImages[1].show_image_path}];
                        }else if(!angular.isUndefined(contact.idcardImages[0]) && !angular.isUndefined(contact.idcardImages[1])){
                            $scope.certificate_images =[{image:contact.idcardImages[0].show_image_path},{image:contact.idcardImages[1].show_image_path}];
                        }else{
                            $scope.certificate_images =[{image:""},{image:""}];
                        }
                    });
                }

             $scope.search = function(){
                 $scope.current_condition =angular.copy($scope.condition);
                 goBackData.set('condition',$scope.condition);
                 if($scope.current_condition.agent_contact_name != ''){
                     $scope.current_condition.agent_contact_name="!"+$scope.current_condition.agent_contact_name+"!";
                 }
                 if( $scope.current_condition.agentContactTels.telephone_number != ''){
                     $scope.current_condition.agentContactTels.telephone_number = $scope.current_condition.agentContactTels.telephone_number+"!";
                 }
                 if($scope.current_condition.agentMasterIdcards.idcard_number != ''){
                     $scope.current_condition.agentMasterIdcards.idcard_number= $scope.current_condition.agentMasterIdcards.idcard_number+"!";
                 }
                 if($scope.current_condition.agentContactIdcards.idcard_number != ''){
                     $scope.current_condition.agentContactIdcards.idcard_number= $scope.current_condition.agentContactIdcards.idcard_number+"!";
                 }
                 $scope.select(1);
              }

              if($state.current.nextLinks && _.contains($state.current.nextLinks,$state.current.previousUrl)){
                  $scope.search();
              }

              $scope.edit = function(id){
                  $location.path('/agent/contact-edit/'+id);
              }

              $scope.detail = function(id){
                  $location.path('/agent/contact-detail/'+id);
              }

              $scope.addContact = function(){
                  $location.path('agent/contact-create');
              }

              $scope.print_agent_image_submit = false;

              $scope.print_agent_image = function(url){

                  if(!url){
                      topAlert.warning('暫無證件圖片');
                      return;
                  }


                  $scope.print_agent_image_submit = true;

                  qzPrinter.print('PDFIdPhoto',"",{image_url:url}).then(function(){
                      topAlert.success('列印成功');
                      $scope.print_agent_image_submit = false;
                  },function(msg){
                      $scope.print_agent_image_submit = false;
                  })
              };

  }]).controller('agentContactCreateCtrl',['$scope','$location','$upload','topAlert','getDate','tmsPagination','globalFunction','$stateParams','windowItems','$modal','breadcrumb','agentContact','smsnoticeType','nationaLity','languageType','genders','idcardType','areaCode','contactPrivilege','contactTypes','agentsLists','$filter','contactType','refTelAgent','strToTime'
          ,function($scope,$location,$upload,topAlert,getDate,tmsPagination,globalFunction,$stateParams,windowItems,$modal,breadcrumb,agentContact,smsnoticeType,nationaLity,languageType,genders,idcardType,areaCode,contactPrivilege,contactTypes,agentsLists,$filter,contactType,refTelAgent,strToTime){

              $scope.contacttypes = contactTypes.query(globalFunction.generateUrlParams({contact_type_code: '|MASTER'})); //聯絡人類型
              $scope.smsnoticetypes = smsnoticeType/*.query()*/; //通知類型
              $scope.nationalitys = nationaLity.query(); //國際
              $scope.languagetypes = languageType.query(); //語言
              $scope.genders = genders.items;  //性別
              $scope.idcardtypes = idcardType.query();  //證件類型
              $scope.areacodes = areaCode.query(); //地區
              $scope.disabled = false;
              $scope.now_data = getDate(new Date());
              $scope.run_one = true;
            //列表
//            $scope.reftelagents =[];
//            $scope.pagination = tmsPagination.create();
//            $scope.pagination.resource = refTelAgent;
//            $scope.pagination.query_method = "AgentNotices";
//            $scope.select = function(page,agent_info_id){
//                refTelAgent.AgentNotices(page,globalFunction.generateUrlParams({agent_info_id:agent_info_id},{agentGroup:{},refTelAgentSMSNoticeTypes:{}})).$promise.then(function(data){
//                    $scope.reftelagents = data;
//                    _.each($scope.reftelagents,function(data){
//                        data.refTelAgentSMSNoticeTypes = _.sortBy(data.refTelAgentSMSNoticeTypes,function(item){return 1 - strToTime(item.sms_notice_type_create_time)})
//                    })
//                });
//            }
              $scope.refAgentContactTypes_record = [];
              $scope.info_data = {contact_type_id:"",agent_info_id:"",agent_code:""};
              if($stateParams.id && $stateParams.type && !$stateParams.contact_name) { //户口速查新增助手
                  $scope.sub_method= 'POST';
                  $scope.boundAgentType = 'add'
                  $scope.info_data.agent_info_id = $stateParams.id;
                  $scope.info_data.contact_type_id = $stateParams.type;  //联系人类型
                  $scope.isCtrlShow = true;

                  var init_contact =  {
                      "agent_contact_name": "",
                      "nationality_id":"",
                      "language_type_id":"",
                      "birthdate":"",
                      "gender":"1",
                      "occupation":"",
                      "idcardImages":[],
                      "agentContactIdcards": [],
                      "refAgentContactTypes":[],
                      "address":''
                  }
                  $scope.contact = angular.copy(init_contact);
                  //證件資料
                  $scope.contactsIdCards = {
                      "idcard_type_id": [],
                      "idcard_number": [],
                      "expire_date": []
                  };

                  //加聯繫人資料
                  $scope.contactsTels = [{
                      //"index":"",
                      "notice_type":"",
                      "area_code_id":"",
                      "telephone_number":"",
                      "status":0
                  }];

                  //證件圖片
                  $scope.idcardImages = [];

                  //上传图片
                  $scope.card_img = [];

                  //戶口綁定資料
                  $scope.bindAgents = []

                  agentsLists.get({id:$stateParams.id}).$promise.then(function( agent){
                      $scope.info_data.agent_code =  agent.agent_code;
                  });

                  breadcrumb.items = [
                      {"name":"新增聯絡人","active":true}
                  ];

              //新增
              }else if(angular.isUndefined($stateParams.contact_id) || $stateParams.contact_id=="" || $stateParams.contact_id ==null){
                  $scope.isCtrlShow = true;
                  $scope.sub_method= 'POST';
                  $scope.boundAgentType = 'add'

                  breadcrumb.items = [
                      {"name":"新增聯絡人","active":true}
                  ];
                  var init_contact =  {
                      "agent_contact_name": "",
                      "nationality_id":"",
                      "language_type_id":"",
                      "birthdate":"",
                      "gender":"1",
                      "occupation":"",
                      "idcardImages":[],
                      "agentContactIdcards": [],
                      "refAgentContactTypes":[],
                      "address":''
                  }
                  $scope.contact = angular.copy(init_contact);

                  //證件資料
                  $scope.contactsIdCards = {
                      "idcard_type_id": [],
                      "idcard_number": [],
                      "expire_date": []
                  };

                  //加聯繫人資料
                  $scope.contactsTels = [{
                      //"index":"",
                      "notice_type":"",
                      "area_code_id":"",
                      "area_code":"",
                      "telephone_number":"",
                      "status":0
                  }];

                  //證件圖片
                  $scope.idcardImages = [];
                  //上传图片
                  $scope.card_img = [];
                  //戶口綁定資料
                  $scope.bindAgents = []

              }else{  //修改聯繫人

                  $scope.sub_method= 'PUT';
                  $scope.boundAgentType = 'edit'
                  if($stateParams.type && $stateParams.id){
                      $scope.info_data.agent_info_id = $stateParams.id;
                      $scope.info_data.contact_type_id = $stateParams.type;  //联系人类型
                      agentsLists.get({id:$stateParams.id}).$promise.then(function(agent){
                          $scope.info_data.agent_code =  agent.agent_code;
                      });
                  }
                  breadcrumb.items = [
                      {"name":"修改聯絡人","active":true}
                  ];



                  $scope.contactprivileges = contactPrivilege.query();
//                  $scope.smsnoticeTypes = smsnoticeType.query({show_type:"|1"});

                  /*数据未传回前性别会为空 添加此项默认没传回之前为男*/
                  $scope.contact = {
                      "gender": "1"
                  };

                  //$scope.contact = {};
                  agentContact.get(globalFunction.generateUrlParams({id:$stateParams.contact_id},{idcardImages:{},agentContactIdcards:{},agentContactTels:{},refAgentContactTypes:{refTelAgentNoticeTypes:"",refAgentContactPrivileges:""}}))
                      .$promise.then(function(contact){
                          $scope.contact = {
                              "id":contact.id,
                              "agent_contact_name": contact.agent_contact_name,
                              "nationality_id": contact.nationality_id,
                              "language_type_id": contact.language_type_id,
                              "birthdate": contact.birthdate ? $filter("parseDate")(contact.birthdate,'yyyy-MM-dd') : "",
                              "gender": contact.gender,
                              "address":contact.address,
                              "occupation":contact.occupation,
                              "agentContactIdcards":contact.agentContactIdcards
                          };

                          //加聯繫人資料
                          $scope.contactsTels = contact.agentContactTels.length>0 ? contact.agentContactTels : [{id:"", telephone_number:""}];

                          //證件資料
                          $scope.contactsIdCards = {
                              "id":[],
                              "idcard_type_id": [],
                              "idcard_number": [],
                              "expire_date": []
                          };

                          //證件類型

                          _.each(contact.agentContactIdcards,function(card,index){
                              $scope.contactsIdCards.id[index] = card.id;
                              $scope.contactsIdCards.idcard_type_id[index] = card.idcard_type_id;
                              $scope.contactsIdCards.idcard_number[index] = card.idcard_number;
                              $scope.contactsIdCards.expire_date[index] = card.expire_date ? $filter("parseDate")(card.expire_date,'yyyy-MM-dd') : ""
                          });

                          //需要保存的圖片
                          $scope.idcardImages = [];

                          //顯示的图片
                          $scope.card_img = [];
                          _.each(contact.idcardImages,function(img,index){
                              $scope.idcardImages.push({image_path:img.image_path, file_type:img.file_type});
                              $scope.card_img[index] = img.show_image_path;
                          })

                          //戶口綁定資料
                          $scope.bindAgents = [];

                          _.each(contact.refAgentContactTypes,function(refAgentContactTypes,index){
                              $scope.reftelagent = [];
                              //聯繫人電話
                              var contactsTels_copy = [];
                              //refAgentContactTypes.refTelAgentNoticeTypes = contactsTels_copy;

                              _.each(refAgentContactTypes.refTelAgentNoticeTypes,function(_refTelAgentNoticeType){
                                  var tel = _.findWhere($scope.contactsTels,{id:_refTelAgentNoticeType.telephone_number_id});
                                  contactsTels_copy.push({id:_refTelAgentNoticeType.id,telephone_number:tel?tel.telephone_number:"", telephone_number_id:_refTelAgentNoticeType.telephone_number_id, notice_type:_refTelAgentNoticeType.notice_type});
                              });
                              //綁定權限
                              var refAgentContactTypes_copy = [];
                              _.each(refAgentContactTypes.refAgentContactPrivileges,function(_refAgentContactPrivileges){
                                  refAgentContactTypes_copy.push({"id":_refAgentContactPrivileges.id, "contact_privilege_id": _refAgentContactPrivileges.contact_privilege_id});
                              });
                              refAgentContactTypes.refAgentContactPrivileges = refAgentContactTypes_copy;

                              //拼合全部選中未選中的權限CheckBox
                              //refAgentContactTypes.refAgentContactPrivileges //選中的信息
                              var contact_privilege_ids = _.pluck(refAgentContactTypes.refAgentContactPrivileges,'contact_privilege_id');
                              $scope.contactprivileges_copy = angular.copy($scope.contactprivileges)
                              _.each($scope.contactprivileges_copy,function(contactprivilege){
                                  if(_.indexOf(contact_privilege_ids,contactprivilege.id)==-1){
                                      contactprivilege.selected = false;
                                  }else{
                                      contactprivilege.selected = true;
                                  }
                              });

                              //顯示的字段
                              $scope.bindAgents.push({
                                  "num":index,
                                  "id":refAgentContactTypes.id,
                                  "agent_info_id":refAgentContactTypes.agent_info_id,
                                  "agent_code":refAgentContactTypes.agent_code,
                                  "agent_info_name":refAgentContactTypes.agent_info_name,
                                  "contact_type": refAgentContactTypes.contact_type,
                                  "remark": refAgentContactTypes.remark,
                                  "contact_type_name":refAgentContactTypes.contact_type_name,
                                  "refTelAgentNoticeTypes":contactsTels_copy, //綁定的電話
                                  "refAgentContactPrivileges_copy":$scope.contactprivileges_copy,  //全部綁定的權限（選中或未選中）
                                  "smsnoticeTypes_copy":smsnoticeType.query({show_type:"|1"})
                              });

                              //需要保存的值
                              $scope.refAgentContactTypes_record.push({
                                  "id":refAgentContactTypes.id,
                                  "agent_info_id":refAgentContactTypes.agent_info_id,
                                  "contact_type": refAgentContactTypes.contact_type,
                                  "remark": refAgentContactTypes.remark,
                                  //"agentContactTels":refAgentContactTypes.agentContactTels, //綁定的電話
                                  "refTelAgentNoticeTypes": contactsTels_copy,//綁定的電話
                                  "refAgentContactPrivileges":refAgentContactTypes.refAgentContactPrivileges  //綁定的權限
                              });
                          });
                      });
              } //=========ELSE END===========

              $scope.contact_filter = {
                  contact_id:"",
                  contact_name:""
              };

              //查詢聯絡人
              $scope.contact_data = [];
              $scope.searchContacts = function(){
                  if($stateParams.type && $stateParams.id){ //助手
                      if($stateParams.contact_name){
                          $scope.contact_filter.contact_name = $stateParams.contact_name;
                      }else{
                          $scope.contact_filter.contact_name = $scope.contact.agent_contact_name;
                      }
                  }else if($stateParams.contact_id){ //修改
                      if($stateParams.contact_name){
                          var _contact_name = $stateParams.contact_name;
                      }else{
                          var _contact_name = angular.isUndefined($scope.contact) ? "" : $scope.contact.agent_contact_name;
                      }
                      $scope.contact_filter.contact_id = $stateParams.contact_id;
                      $scope.contact_filter.contact_name = _contact_name;
                  }else{ //新增
                      $scope.contact_filter.contact_name = $scope.contact.agent_contact_name;
                  }
                  if($scope.contact_filter.contact_name){
                      agentContact.query(globalFunction.generateUrlParams({agent_contact_name:$scope.contact_filter.contact_name+'!',refAgentContactTypeOwner:{contact_type:'null'}})).$promise.then(function(data){
                          $scope.contact_data = data;
                          if(data.length <= 0)
                             topAlert.warning("找不到符合條件的聯絡人");
                          else
                              $scope.isCtrlShow = false;
                      });
                  }else{
                      $scope.contact_data = [];
                  }
              }
              $scope.writeContacts = function(){
                   $location.path('/agent/contact-create');
                   $scope.isCtrlShow = true;
                   $scope.contact_data = [];

              }

            if($stateParams.contact_id && $stateParams.contact_name){
                $scope.isCtrlShow = false;

                $scope.searchContacts();

            }else if($stateParams.contact_id && angular.isUndefined($stateParams.contact_name)){
                $scope.isCtrlShow = true;
                $scope.isEdit = false;
            }else{
                $scope.isEdit = true;
            }

              //選取聯繫人跳轉修改
              $scope.redirectUpdate = function(){
                  if($stateParams.type){
                      $location.path('/agent/contact-assistant-edit/'+$scope.contact_filter.contact_id+'/'+$scope.contact_filter.contact_name+'/3/'+$stateParams.id)
                  }else{
                      $location.path('/agent/contact-edit/'+$scope.contact_filter.contact_id+'/'+$scope.contact_filter.contact_name);
                  }
              }

              //驗證鏈接
              $scope.contact_url =  globalFunction.getApiUrl('agent/agentcontact');

              $scope.onFileSelect = function($files,index) {
                  var file = $files[0];
                  $scope.upload = $upload.upload({
                      url: globalFunction.getApiUrl('agent/agentcontact/upload-id-card-image?PHPSESSID='+sessionStorage.token), //upload.php script, node.js route, or servlet url
                      file: file
                  }).progress(function(evt) {
                  }).success(function(data, status, headers, config) {
                      $scope.idcardImages[index] = {image_path: data.path, file_type: "jpg"};
                      $scope.card_img[index] = data.url;
                  });
              };

              $scope.deleteFile = function(index){
                  $scope.card_img[index] = null;
                  $scope.idcardImages.splice(index,1);
              }

              //戶口綁定資料
              $scope.addContactsTels=function(){
                  if($scope.contactsTels.length > 9){
                      windowItems.alert("系統提醒","電話號碼最多不超出10個");
                  }else{
                      $scope.contactsTels.push({"id":"","notice_type":"","area_code_id":"","telephone_number":""}); //联系人电话
                      //"index":($scope.contactsTels.length-1),
                  }
             }

              $scope.removeContactsTels=function(index){
                  $scope.contactsTels.splice(index,1);
              }


              //公共方法 處理要提交的數據結構
              $scope.setting_data_structure = function(refAgentContactTypes){
                  var agentContactTels = [];
                  _.each(refAgentContactTypes.agentContactTels,function(_agentContactTels){
                      //可能是新增号码
                      if(_agentContactTels.telephone_number_id){
                          agentContactTels.push({
                              notice_type:_agentContactTels.notice_type,
                              telephone_number_id : _agentContactTels.telephone_number_id,
                              refTelAgentSMSNoticeTypes:_agentContactTels.notice_type ==2?[]:_agentContactTels.refTelAgentSMSNoticeTypes
                          });
                      }else{
                          agentContactTels.push({
                              area_code_id:_agentContactTels.area_code_id,
                              notice_type:_agentContactTels.notice_type,
                              telephone_number : _agentContactTels.telephone_number,
                              refTelAgentSMSNoticeTypes:_agentContactTels.notice_type ==2 ?[]:_agentContactTels.refTelAgentSMSNoticeTypes
                          });
                      }
                  });
                  //過濾選中的用戶綁定權限
                  var refAgentContactPrivileges = [];
                  _.each(refAgentContactTypes.refAgentContactPrivileges,function(ck){
                      if(ck.selected){
                          refAgentContactPrivileges.push({
                              "contact_privilege_id": ck.id
                          });
                      }
                  });
                  //显示绑定信息
                  $scope.bindAgents.push({
                      "num":refAgentContactTypes.num,
                      "agent_info_id":refAgentContactTypes.agent_info_id,
                      "agent_code":refAgentContactTypes.agent_code,
                      "agent_info_name":refAgentContactTypes.agent_info_name,
                      "contact_type": refAgentContactTypes.contact_type,
                      "remark": refAgentContactTypes.remark,
                      "contact_type_name":refAgentContactTypes.contact_type_name,
                      "refTelAgentNoticeTypes": agentContactTels, //綁定的電話
                      "refAgentContactPrivileges_copy":refAgentContactTypes.refAgentContactPrivileges,  //全部綁定的權限（選中或未選中）
                      "smsnoticeTypes_copy":smsnoticeType.query({show_type:"|1"})

                  });
                  $scope.bindAgents = _.sortBy($scope.bindAgents,function(stooge){ return stooge.agent_code; });
                  //需要保存的值
                  $scope.refAgentContactTypes_record.push({
                      "agent_info_id":refAgentContactTypes.agent_info_id,
                      "contact_type": refAgentContactTypes.contact_type,
                      "remark": refAgentContactTypes.remark,
                      "refTelAgentNoticeTypes": agentContactTels,//綁定的電話
                      "refAgentContactPrivileges":refAgentContactPrivileges  //綁定的權限
                  });
              }

              /*綁定戶口*/
              $scope.addBindingAgent = function(){
                  if($scope.contact.agent_contact_name =="" || $scope.contact.agent_contact_name==undefined){
                      windowItems.alert("系統提醒","請先填寫聯繫人姓名");
                      return false;
                  }

                  var modalInstance;
                  modalInstance = $modal.open({
                      templateUrl: "views/agent/agent-binding.html",
                      controller: 'agentBindingCtrl',
                      windowClass:'slg-modal',
                      resolve: {
                          agent_contact_name:function(){
                              return  $scope.contact.agent_contact_name;
                          },
                          refAgentContactTypes_edit:function(){
                              return null;
                          },
                          contactsTels:function(){
                              return $scope.contactsTels;
                          },
                          contacttypes_copy:function(){
                              return $scope.contacttypes;
                          },
                          num:function(){
                              return -1;
                          },
                          boundAgentType:function() {
                              return $scope.boundAgentType;
                          },
                          info_data:function(){
                              return $scope.info_data;
                          },
                          reftelagents:function(){
                              return [];
                          }
                      }
                  });
                  modalInstance.result.then(function(refAgentContactTypes) {
                      $scope.setting_data_structure(refAgentContactTypes);
                  });
              }

              //便利綁定戶口信息
              $scope.updateBindingAgent = function(index) {
                  //index = 0;
//                  $scope.select(1, $scope.bindAgents[index].agent_info_id)
                  refTelAgent.AgentNotices(globalFunction.generateUrlParams({agent_info_id: $scope.bindAgents[index].agent_info_id}, {agentGroup: {}, refTelAgentSMSNoticeTypes: {}})).$promise.then(function (data) {
                      $scope.reftelagents = data;
                      if($scope.run_one && $stateParams.contact_id){
                          _.each($scope.bindAgents[index].refTelAgentNoticeTypes,function(refTelAgentNoticeType){
                              if(refTelAgentNoticeType.telephone_number_id){
                                  var reftelagent = _.findWhere($scope.reftelagents,{telephone_number_id:refTelAgentNoticeType.telephone_number_id});
                                  refTelAgentNoticeType.refTelAgentSMSNoticeTypes =reftelagent?reftelagent.refTelAgentSMSNoticeTypes:[];
                              }
                          })
                      }


                  var modalInstance;
                  modalInstance = $modal.open({
                      templateUrl: "views/agent/agent-binding.html",
                      controller: 'agentBindingCtrl',
                      windowClass: 'slg-modal',
                      resolve: {
                          agent_contact_name: function () {
                              return  $scope.contact.agent_contact_name;
                          },
                          refAgentContactTypes_edit: function () {
                              return  $scope.bindAgents[index];
                          },
                          contactsTels: function () {
                              return $scope.contactsTels;
                          },
                          contacttypes_copy: function () {
                              return $scope.contacttypes;
                          },
                          num: function () {
                              return index;
                          },
                          boundAgentType: function () {
                              return $scope.boundAgentType;
                          },
                          info_data: function () {
                              return $scope.info_data;
                          },
                          reftelagents: function () {
                              return $scope.reftelagents;
                          }
                      }
                  });

                  modalInstance.result.then(function (refAgentContactTypes) {
                      //過濾選中的用戶綁定權限
                      var refAgentContactPrivileges = [];
                      _.each(refAgentContactTypes.refAgentContactPrivileges, function (ck) {
                          if (ck.selected) {
                              refAgentContactPrivileges.push({"agent_info_id": refAgentContactTypes.agent_info_id, "contact_privilege_id": ck.id});
                          }
                      });

                      //判断电话号码是新增还是修改等
                      var agentContactTels = [];
                      _.each(refAgentContactTypes.agentContactTels, function (_agentContactTels) {
                          //可能是新增号码
                          if (_agentContactTels.id) {
                              if (_agentContactTels.telephone_number_id) {
                                  agentContactTels.push({
                                      id: _agentContactTels.id,
                                      notice_type: _agentContactTels.notice_type,
                                      telephone_number_id: _agentContactTels.telephone_number_id,
                                      refTelAgentSMSNoticeTypes: _agentContactTels.refTelAgentSMSNoticeTypes
                                  });
                              } else {
                                  agentContactTels.push({
                                      id: _agentContactTels.id,
                                      area_code_id: _agentContactTels.area_code_id,
                                      notice_type: _agentContactTels.notice_type,
                                      telephone_number: _agentContactTels.telephone_number,
                                      refTelAgentSMSNoticeTypes: _agentContactTels.refTelAgentSMSNoticeTypes
                                  });
                              }
                          } else {
                              if (_agentContactTels.telephone_number_id) {
                                  agentContactTels.push({
                                      notice_type: _agentContactTels.notice_type,
                                      telephone_number_id: _agentContactTels.telephone_number_id,
                                      refTelAgentSMSNoticeTypes: _agentContactTels.refTelAgentSMSNoticeTypes
                                  });
                              } else {
                                  agentContactTels.push({
                                      area_code_id: _agentContactTels.area_code_id,
                                      notice_type: _agentContactTels.notice_type,
                                      telephone_number: _agentContactTels.telephone_number,
                                      refTelAgentSMSNoticeTypes: _agentContactTels.refTelAgentSMSNoticeTypes
                                  });
                              }
                          }
                      });
                      var _index = refAgentContactTypes.num;
                      //查詢原來修改的項目
                      if ($scope.bindAgents[_index] == undefined) {
                          alert("無效數據");
                          return false;
                      }

                      //显示绑定信息
                      $scope.bindAgents[_index].agent_info_id = refAgentContactTypes.agent_info_id,
                          $scope.bindAgents[_index].agent_code = refAgentContactTypes.agent_code,
                          $scope.bindAgents[_index].agent_info_name = refAgentContactTypes.agent_info_name,
                          $scope.bindAgents[_index].contact_type = refAgentContactTypes.contact_type,
                          $scope.bindAgents[_index].remark = refAgentContactTypes.remark,
                          $scope.bindAgents[_index].contact_type_name = refAgentContactTypes.contact_type_name,
                          $scope.bindAgents[_index].agentContactTels = $scope.contactsTels;
                      $scope.bindAgents[_index].refTelAgentNoticeTypes = agentContactTels, //綁定的電話
                          $scope.bindAgents[_index].refAgentContactPrivileges_copy = refAgentContactTypes.refAgentContactPrivileges  //全部綁定的權限（選中或未選中）

                      //保存的植
                      $scope.refAgentContactTypes_record[_index].agent_info_id = refAgentContactTypes.agent_info_id,
                      $scope.refAgentContactTypes_record[_index].contact_type = refAgentContactTypes.contact_type,
                      $scope.refAgentContactTypes_record[_index].remark = refAgentContactTypes.remark,
                      $scope.refAgentContactTypes_record[_index].refTelAgentNoticeTypes = agentContactTels,//綁定的電話
                      $scope.refAgentContactTypes_record[_index].refAgentContactPrivileges = refAgentContactPrivileges  //綁定的權限
                      $scope.run_one = false;

                  });

                });
              }

              //刪除綁定戶口
              $scope.removeBindingAgent = function(index){
                  $scope.bindAgents.splice(index,1);//刪除顯示
                  $scope.refAgentContactTypes_record.splice(index,1);

              }

              //新增聯繫人
              $scope.disabled = false;
              $scope.submit = function(){
                  if($scope.disabled){
                      return $scope.disabled;
                  }
                  $scope.disabled = true;

                  $scope.contact.birthdate = $scope.contact.birthdate ? getDate($scope.contact.birthdate) : "";

                  //联络人电话
                  $scope.contactsTels_copy = [];
                  if($stateParams.contact_id){//保存成功
                      //證件類型
                      $scope.contactsIdCards_record = [{
                              "id" : angular.isUndefined($scope.contactsIdCards.id[0]) ? "" : $scope.contactsIdCards.id[0],
                              "idcard_type_id": angular.isUndefined($scope.contactsIdCards.idcard_type_id[0]) ? "" : $scope.contactsIdCards.idcard_type_id[0],
                              "idcard_number": angular.isUndefined($scope.contactsIdCards.idcard_number[0]) ? "" : $scope.contactsIdCards.idcard_number[0],
                              "expire_date" : $scope.contactsIdCards.expire_date[0] ? getDate($scope.contactsIdCards.expire_date[0]) : ""
                      }];

                      if ((angular.isUndefined($scope.contactsIdCards.idcard_type_id[1]) || $scope.contactsIdCards.idcard_type_id[1]==null)
                          && angular.isUndefined($scope.contactsIdCards.idcard_number[1] || $scope.contactsIdCards.idcard_number[1])) {

                      }else{
                          $scope.contactsIdCards_record.push({
                              "id": $scope.contactsIdCards.id[1],
                              "idcard_type_id": angular.isUndefined($scope.contactsIdCards.idcard_type_id[1]) ? "" : $scope.contactsIdCards.idcard_type_id[1],
                              "idcard_number": angular.isUndefined($scope.contactsIdCards.idcard_number[1]) ? "" : $scope.contactsIdCards.idcard_number[1],
                              "expire_date" : $scope.contactsIdCards.expire_date[1] ? getDate($scope.contactsIdCards.expire_date[1]) : ""
                          });
                       }


                      _.each($scope.contactsTels,function(tel){
                          if(tel.telephone_number || tel.area_code_id){
                                if(tel.id)
                                    $scope.contactsTels_copy.push({id:tel.id, telephone_number:tel.telephone_number, area_code_id:tel.area_code_id});
                                else
                                    $scope.contactsTels_copy.push({telephone_number:tel.telephone_number, area_code_id:tel.area_code_id});
                          }

                      });
                  }else{
                      //證件類型
                      $scope.contactsIdCards_record = [{
                              "idcard_type_id": angular.isUndefined($scope.contactsIdCards.idcard_type_id[0]) ? "" : $scope.contactsIdCards.idcard_type_id[0],
                              "idcard_number": angular.isUndefined($scope.contactsIdCards.idcard_number[0]) ? "" : $scope.contactsIdCards.idcard_number[0],
                              "expire_date" : $scope.contactsIdCards.expire_date[0] ? getDate($scope.contactsIdCards.expire_date[0]):""
                      }];

                      if ((angular.isUndefined($scope.contactsIdCards.idcard_type_id[1]) || $scope.contactsIdCards.idcard_type_id[1]==null)
                          && angular.isUndefined($scope.contactsIdCards.idcard_number[1] || $scope.contactsIdCards.idcard_number[1])) {

                      } else {
                         $scope.contactsIdCards_record.push({
                              "idcard_type_id": angular.isUndefined($scope.contactsIdCards.idcard_type_id[1]) ? "" : $scope.contactsIdCards.idcard_type_id[1],
                              "idcard_number": angular.isUndefined($scope.contactsIdCards.idcard_number[1]) ? "" : $scope.contactsIdCards.idcard_number[1],
                              "expire_date" : $scope.contactsIdCards.expire_date[1] ? getDate($scope.contactsIdCards.expire_date[1]) :  ""
                         });
                      }
                      _.each($scope.contactsTels,function(tel){
                          if(tel.telephone_number || tel.area_code_id)
                              $scope.contactsTels_copy.push({telephone_number:tel.telephone_number, area_code_id:tel.area_code_id});
                      });
                  }
                  _.each($scope.contactsIdCards_record,function(contactsIdCard){
                        if(!contactsIdCard.id){
                            delete contactsIdCard.id;
                        }
                  })
                  if($scope.contactsIdCards_record.length==1&&($scope.contactsIdCards_record[0].idcard_type_id==''||$scope.contactsIdCards_record[0].idcard_type_id==null)&&($scope.contactsIdCards_record[0].idcard_number==''||$scope.contactsIdCards_record[0].idcard_number==null)){
                      $scope.contactsIdCards_record=[];
                  }
                  $scope.contact.idcardImages = $scope.idcardImages;
                  $scope.contact.agentContactIdcards = $scope.contactsIdCards_record;
                  $scope.contact.agentContactTels = $scope.contactsTels_copy;
                  $scope.contact.refAgentContactTypes = $scope.refAgentContactTypes_record; //绑定信息
                  _.each($scope.contact.refAgentContactTypes,function(refAgentContactType){
                      $scope.refAgentContactPrivilege = _.findWhere(refAgentContactType.refAgentContactPrivileges,{contact_privilege_id:'0574837B0C64518AE0539715A8C010FE'});
                      _.each(refAgentContactType.refTelAgentNoticeTypes,function(refTelAgentNoticeType) {
                          if (refTelAgentNoticeType.notice_type == 2 || refAgentContactType.contact_type == 3 || !$scope.refAgentContactPrivilege)
                              refTelAgentNoticeType.refTelAgentSMSNoticeTypes = [];
                      })
                  });
                  //判斷新增還是修改
                  $scope.form_contact.checkValidity().then(function() {
                      //$stateParams.type==3 &&
                      if($scope.refAgentContactTypes_record.length==0){
                          topAlert.warning("未綁定戶口不能儲存");
                          $scope.disabled = false;
                          return;
                      }
                      if(angular.isUndefined($stateParams.contact_id) || $stateParams.contact_id=="" || $stateParams.contact_id ==null/* || $stateParams.type*/){//保存成功
                         agentContact.save($scope.contact).$promise.then(function(){
                             $scope.disabled = false;
                             topAlert.success("聯絡人新增成功");
                             $scope.form_contact.clearErrors();
                             if($stateParams.column){
                                 $location.path("loan/create/"+$stateParams.column+"/contact/"+$scope.contact.agent_contact_name);
                             }
                             $scope.reset();
                         },function(){
                             $scope.disabled = false;
                         })
                      }else{ //修改
                          agentContact.update($scope.contact).$promise.then(function(){
                              $scope.disabled = true;
                              $location.path('agent/contact-list');
                              topAlert.success('聯絡人修改成功！');
                              $scope.form_contact.clearErrors();
                          },function(){
                              $scope.disabled = false;
                          });
                      }
                  });
              }

              var original = angular.copy(init_contact);
              $scope.reset = function(){
                  $scope.contact = angular.copy(original);
                  $scope.contactsTels = [{}] //联系资料
                  $scope.contactsIdCards = []; //卡类型
                  $scope.bindAgents = []; //绑定户口显示资料
                  $scope.refAgentContactTypes_record = []; //绑定户口数据
                  $scope.card_img=[];
              }

              $scope.goBack = function(){
                  $location.path('agent/contact-list');
              }

   }]).controller('agentContactDetailCtrl',['$scope','$location','breadcrumb','globalFunction','$stateParams','agentContact','getDate','qzPrinter','topAlert',
       function($scope,$location,breadcrumb,globalFunction,$stateParams,agentContact,getDate,qzPrinter,topAlert){
          breadcrumb.items = [
              {"name":"聯絡人詳細","active":true}
          ];


           $scope.print_agent_image_submit = false;

           $scope.print_agent_image = function(url){
               if(!url){
                   topAlert.warning('暫無證件圖片');
                   return;
               }

               $scope.print_agent_image_submit = true;

               qzPrinter.print('PDFIdPhoto',"",{image_url:url}).then(function(){
                   topAlert.success('列印成功');
                   $scope.print_agent_image_submit = false;
               },function(msg){
                   $scope.print_agent_image_submit = false;
               })
           };

            $scope.now_data = getDate(new Date());
          //聯繫人詳細
          if(!angular.isUndefined($stateParams.id)){
              agentContact.get(globalFunction.generateUrlParams({id:$stateParams.id},{idcardImages:{},agentContactIdcards:{},agentContactTels:{},refAgentContactTypes:{}}))
                  .$promise.then(function(_contact){
                      _contact.refAgentContactTypes = _.sortBy(_contact.refAgentContactTypes,function(stooge){return stooge.agent_code;})
                      $scope.contact = _contact;
                  });
          }

          $scope.goto_contact = function(){
              $location.path('agent/contact-list');
          }
          //聯絡人資料修改
            $scope.update= function(){
                $location.path('/agent/contact-edit/'+$stateParams.id);
            }


   }]).controller('agentShowContactDetailCtrl',['$scope','$location','globalFunction','$stateParams','agentContact','getDate','id','$modalInstance','qzPrinter','printerType','topAlert',
            function($scope,$location,globalFunction,$stateParams,agentContact,getDate,id,$modalInstance,qzPrinter,printerType,topAlert){

                $scope.print_agent_image_submit = false;

                $scope.print_agent_image = function(url){

                    if(!url){
                        topAlert.warning('暫無證件圖片');
                        return;
                    }

                    $scope.print_agent_image_submit = true;

                    qzPrinter.print('PDFIdPhoto',"",{image_url:url}).then(function(){
                        topAlert.success('列印成功');
                        $scope.print_agent_image_submit = false;
                    },function(msg){
                        $scope.print_agent_image_submit = false;
                    })
                };

                $scope.now_data = getDate(new Date());
                //聯繫人詳細
                if(id){
                    agentContact.get(globalFunction.generateUrlParams({id:id},{idcardImages:{},agentContactIdcards:{},agentContactTels:{},refAgentContactTypes:{}}))
                        .$promise.then(function(_contact){
                            _contact.refAgentContactTypes = _.sortBy(_contact.refAgentContactTypes,function(stooge){return stooge.agent_code;})
                            $scope.contact = _contact;
                        });
                }

                $scope.goto_contact = function(){
                    $modalInstance.close();
                    $location.path('agent/contact-list');
                }
                //聯絡人資料修改
                $scope.update= function(){
                    $modalInstance.close();
                    if($stateParams.id){
                        $location.path('/agent/contact-edit/'+id);
                    }
                }

            }]).controller('contactAuthorizationCtrls',['$scope','$modalInstance','$location','agent',function($scope,$modalInstance,$location,agent){
          $scope.cancel = function(){
              $modalInstance.close();
          }
          $scope.authorization = function(){
              $modalInstance.close();
              $location.path('agent/contact-list')
          }

  }]).controller('agentBindingCtrl',['$scope','globalFunction','windowItems','$modalInstance','$stateParams','contactType','contacttypes_copy','agent_contact_name','contactsTels',"agentsLists",'contactPrivilege','bindSmsnoticeType','refAgentContactTypes_edit','num','boundAgentType','topAlert','info_data','smsnoticeType','refTelAgent','strToTime','reftelagents'
          ,function($scope,globalFunction,windowItems,$modalInstance,$stateParams,contactType,contacttypes_copy,agent_contact_name,contactsTels,agentsLists,contactPrivilege,bindSmsnoticeType,refAgentContactTypes_edit,num,boundAgentType,topAlert,info_data,smsnoticeType,refTelAgent,strToTime,reftelagents){
              $scope.enableClientValidation = true;
              $scope.contacttypes = contacttypes_copy;//contacttypes.query(globalFunction.generateUrlParams({contact_type_code: '|MASTER'})); //聯絡人類型
              $scope.smsnoticetypes = bindSmsnoticeType/*.query()*/; //通知類型
              $scope.boundAgentType = boundAgentType;
              $scope.contact_all_smsnoticeTypes =[];
              $scope.contact_smsnoticeTypes =[];
              $scope.nocite_type_show = false;
              var check_i= [0];
              $scope.contact_auth = function(){
                  $scope.show_binding = false;
                  $scope.$watch('refAgentContactTypes.contact_type',function(new_value,old_value){
                      if(new_value==undefined || new_value==""){
                          $scope.refAgentContactTypes.contact_type_name = "";
                      }else {
                          var contacttype = _.findWhere($scope.contacttypes,{contact_type:new_value});
                          $scope.refAgentContactTypes.contact_type_name = contacttype.contact_type_name;
                          if (contacttype.contact_type_code == "AUTH") {
                              $scope.show_binding = true;
                          }else{
                              $scope.show_binding = false;
                              //清空選中的戶口權限
                              $scope.authorization_checked_layout();
                          }
                      }
                  });
              }

              //戶口授權
              $scope.authorization_checked_layout = function(){
                  contactPrivilege.query().$promise.then(function(authorization){
                      $scope.all_authorization = authorization;
                      $scope.agentAuthorization = [];
                      for(var i = 0; i<Math.ceil($scope.all_authorization.length/4); i++){
                          $scope.agentAuthorization.push($scope.all_authorization.slice(i*4,4*(i+1)))
                      }
                  });
              }

            //通知事項
            $scope.smsnoticetypes_checked_layout = function() {
                $scope.disabled_add = true;
                smsnoticeType.query({show_type:"|1"}).$promise.then(function (_contactPrivilege) {
                    $scope.smsnoticeTypes = [];
                    $scope.all_smsnoticeTypes = [];
                    $scope.all_smsnoticeTypes = _contactPrivilege;
                    for (var i = 0; i < Math.ceil($scope.all_smsnoticeTypes.length / 4); i++) {
                        $scope.smsnoticeTypes.push($scope.all_smsnoticeTypes.slice(i * 4, 4 * (i + 1)))
                    }
                    $scope.contact_smsnoticeTypes.push($scope.smsnoticeTypes);
                    $scope.contact_all_smsnoticeTypes.push($scope.all_smsnoticeTypes);
                    $scope.disabled_add = false;
                });
            }

              $scope.bindContactsTels = [];
              $scope.agentAuthorization = []; //4個每行全部授權項
              $scope.all_authorization = [];  //全部授權項

              //新增戶口綁定
              if(num<0){
                  $scope.contactsTels = contactsTels;//.length>0 ? contactsTels : [{id:"", telephone_number:null}]; //聯繫方式
                  //保存需要的数据
                  var init_record = {
                      "id":"",
                      "agent_contact_name":agent_contact_name,
                      "agent_code": info_data.agent_code,
                      "agent_info_id": info_data.agent_info_id,
                      "agent_info_name": info_data.agent_info_name,
                      "contact_type": info_data.contact_type_id,
                      "contact_type_name": "",
                      "agentContactTels": [],
                      "refAgentContactPrivileges":{
                          "contact_privilege_id": ""
                      }
                  };
                  $scope.refAgentContactTypes = angular.copy(init_record);

                  //重新加載授權
                  $scope.authorization_checked_layout();
                  //加載權限CheckBox
                  $scope.contact_auth();

                  //綁定通知類型
                  $scope.bindContactsTels = [];
                  $scope.contacts = [];
                  if(contactsTels.length>0) {
                      _.each(contactsTels, function (_contactsTels) {
                          $scope.bindContactsTels.push({
                                  "notice_type": "",//info_data.contact_type_id ==3 ? '2' : "",
                                  "telephone_number_id": "",
                                  "telephone_number": _contactsTels.telephone_number,
                                  "area_code_id": _contactsTels.area_code_id,
                                  "check_all":"",
                                  "refTelAgentSMSNoticeTypes":[{
                                          "sms_notice_type_id":""
                                   }]
                          });
                          check_i[$scope.contacts.length-1] = 0;
                          $scope.smsnoticetypes_checked_layout();
                      });
                  }else{
                      $scope.bindContactsTels = [{
                          "notice_type": "",//info_data.contact_type_id ==3 ? '2' : "",
                          "telephone_number_id": -1,
                          "telephone_number": null,
                          "area_code_id": "",
                          "check_all":"",
                          "refTelAgentSMSNoticeTypes":[{
                              "sms_notice_type_id":""
                          }]
                      }];
                      $scope.smsnoticetypes_checked_layout();
                  }
              }else{ //修改
//                  $scope.reftelagent = reftelagents;
                  $scope.refAgentContactTypes = {
                      "agent_contact_name":agent_contact_name,
                      "agent_code":refAgentContactTypes_edit.agent_code,
                      "agent_info_name":refAgentContactTypes_edit.agent_info_name,
                      "contact_type": refAgentContactTypes_edit.contact_type,
                      "remark": refAgentContactTypes_edit.remark
                  };
                  //
                  $scope.refAgentContactType =_.findWhere(refAgentContactTypes_edit.refAgentContactPrivileges_copy,{privilege_code: "SMS"});
                  if(refAgentContactTypes_edit.contact_type == 2 && $scope.refAgentContactType && $scope.refAgentContactType.selected){
                      $scope.nocite_type_show = true;
                  }else{

                      $scope.nocite_type_show = false;
                  }

                  //要修改的授權項
                  $scope.all_authorization = refAgentContactTypes_edit.refAgentContactPrivileges_copy;
                  for(var i = 0; i<Math.ceil($scope.all_authorization .length/4); i++){
                      $scope.agentAuthorization.push($scope.all_authorization.slice(i*4,4*(i+1)))
                  }

                  //加載權限CheckBox
                  $scope.contact_auth();

                  //TODO 判斷是全選 或 取消全選
                  //$scope.auth_cheked_all = true;
                  contactPrivilege.query().$promise.then(function(authorization){
                      var selected_len = _.where($scope.all_authorization,{selected:true}).length;
                          $scope.auth_cheked_all = selected_len==authorization.length;
                  });
                  //TODO 对比下拉框还没有绑定的电话
                  $scope.contactsTels = contactsTels; //聯繫方式

                  //TODO 選中綁定的電話號碼
                  $scope.bindContactsTels = refAgentContactTypes_edit.refTelAgentNoticeTypes.length>0 ?
                      refAgentContactTypes_edit.refTelAgentNoticeTypes : [{"notice_type": "","telephone_number_id":-1,"telephone_number":  null,"area_code_id": ""}];


                  _.each($scope.bindContactsTels, function (_contactsTels,$index) {
                      $scope.smsnoticeTypes = [];
                      $scope.all_smsnoticeTypes = [];
                      $scope.all_smsnoticeTypes = angular.copy(refAgentContactTypes_edit.smsnoticeTypes_copy);
                      for (var i = 0; i < Math.ceil($scope.all_smsnoticeTypes.length / 4); i++) {
                          $scope.smsnoticeTypes.push($scope.all_smsnoticeTypes.slice(i * 4, 4 * (i + 1)))
                      }
                      $scope.contact_smsnoticeTypes.push($scope.smsnoticeTypes);
                      $scope.contact_all_smsnoticeTypes.push($scope.all_smsnoticeTypes);
                      if(_contactsTels.telephone_number_id){
                          var noticeType_ids = _.pluck(_contactsTels.refTelAgentSMSNoticeTypes,'sms_notice_type_id');
                          var noticeType_key_ids = _.pluck(_contactsTels.refTelAgentSMSNoticeTypes,'id');//選中的ID
                          var i = 0;
                          _.each($scope.all_smsnoticeTypes,function(_contactPrivilege){
                              if(_.indexOf(noticeType_ids,_contactPrivilege.id)==-1){
                                  _contactPrivilege.selected = false;
                              }else{
                                  _contactPrivilege.selected = true;
                                  i++;
                              }
                          });
                          if(_contactsTels.refTelAgentSMSNoticeTypes && _contactsTels.refTelAgentSMSNoticeTypes.length == $scope.all_smsnoticeTypes.length){
                              _contactsTels.check_all = true;
                          }else{
                              _contactsTels.check_all = false;
                          }

                      }else{
                          var noticeType_ids = _.pluck(_contactsTels.refTelAgentSMSNoticeTypes,'sms_notice_type_id');
                          var i = 0;
                          _.each($scope.all_smsnoticeTypes,function(_contactPrivilege){
                              if(_.indexOf(noticeType_ids,_contactPrivilege.id)==-1){
                                  _contactPrivilege.selected = false;
                              }else{
                                  _contactPrivilege.selected = true;
                                  i++;
                              }
                          });
                          if(_contactsTels.refTelAgentSMSNoticeTypes.length == $scope.all_smsnoticeTypes.length){
                              _contactsTels.check_all = true;
                          }else{
                              _contactsTels.check_all = false;
                          }

                      }


                  });

              }// =========== END else

              //聯繫人類型是助手通知類型為電話
              /*$scope.change_contact_type = function(){

                   if($scope.refAgentContactTypes.contact_type==3){
                       _.each($scope.bindContactsTels,function(_bindContactsTels){
                           _bindContactsTels.notice_type = '2';
                       });
                   }else{
                       _.each($scope.bindContactsTels,function(_bindContactsTels){
                           _bindContactsTels.notice_type = "";
                       });
                   }
              };*/

              //全選
              $scope.authorization_check_all = function(selected){
                  _.each($scope.all_authorization,function(ck){
                      ck.selected =  selected;
                  });
                  $scope.nocite_type_show = selected;
              }

              //判斷子項全部選中之後勾選權限CheckBox
              $scope.is_checkbox_item = function(auth){
                  if(auth.privilege_name == '訊息'){
                      $scope.nocite_type_show = auth.selected;
                  }
                  var selected_len = _.where($scope.all_authorization,{selected:true}).length;
                  $scope.auth_cheked_all = $scope.all_authorization.length==selected_len;
              }

              $scope.check_all_message_sms_notice_type = function(index){
                if($scope.bindContactsTels[index].check_all){
                    _.each($scope.contact_all_smsnoticeTypes[index],function(noticeType){
                        noticeType.selected = true;
                    });
                }else{
                    _.each($scope.contact_all_smsnoticeTypes[index],function(noticeType){
                        noticeType.selected = false;
                    });
                }
                    check_i[index] = $scope.all_smsnoticeTypes.length;
              }
            $scope.check_message_sms_notice_type = function(sms,index){
                if(sms.selected){
                    check_i[index]++;
                }else{
                    check_i[index]--;
                }
                if($scope.all_smsnoticeTypes.length == check_i[index]){
                    $scope.bindContactsTels[index].check_all = true;
                }else{
                    $scope.bindContactsTels[index].check_all = false
                }
            }

              //編號查詢戶口姓名
              $scope.$watch('refAgentContactTypes.agent_code',globalFunction.debounce(function(new_value,old_value){
//                  $scope.refAgentContactTypes.agent_info_name = "";
//                  $scope.refAgentContactTypes.agent_info_id = "";
                  if(new_value){
                      agentsLists.query(globalFunction.generateUrlParams({agent_code:new_value})).$promise.then(function(agents) {
                          if(agents[0]) {
                              $scope.refAgentContactTypes.agent_info_name = agents[0].agent_name;
                              $scope.refAgentContactTypes.agent_info_id =  agents[0].id;
                          }else{
                              $scope.refAgentContactTypes.agent_info_name = "";
                              $scope.refAgentContactTypes.agent_info_id = "";
                          }
                      });
                  }
              }));

              $scope.addBindNoctice = function(index){
                  if($scope.bindContactsTels.length>$scope.contactsTels.length-1){
                      windowItems.alert("系統提醒","不能多於電話數"+$scope.contactsTels.length+"個");
                      return false;
                  }
                  $scope.bindContactsTels.push({
                      //"index":$scope.contactsTels.length-1,
                      "notice_type": "",//$scope.refAgentContactTypes.contact_type==3 ? '2' : "",
                      "telephone_number": "",
                      "telephone_number_index": "",
                      "area_code_id": "",
                      "isRequired" : false,
                      "refTelAgentSMSNoticeTypes":[{
                          "sms_notice_type_id":""
                      }]
                  });
                  $scope.smsnoticetypes_checked_layout();
                  //刪除選中的號碼
              }


              $scope.updateBindNotice = function(contactTel){
                  if(contactTel.telephone_number_index){
                      var tel = $scope.contactsTels[contactTel.telephone_number_index];
                      contactTel.area_code_id = tel.area_code_id;
                      contactTel.telephone_number = tel.telephone_number;
                      contactTel.telephone_number_id = tel.id; //绑定的ID
                      contactTel.id = contactTel.id;

                      //contactTel.notice_type = tel.notice_type;
                  }else{
                      contactTel.area_code_id = "";
                      contactTel.telephone_number = "";
                      contactTel.telephone_number_id = "";
                      contactTel.id = "";
                  }
              }

              $scope.removeBindNoctice = function(index){
                  $scope.bindContactsTels.splice(index,1);
                  $scope.contact_all_smsnoticeTypes.splice(index,1);
                  $scope.contact_smsnoticeTypes.splice(index,1);
              }

               //保存
               $scope.add = function(){
                   //聯繫方式綁定信息
                   var all_bindContactsTels = [];
                   if($scope.boundAgentType=='edit'){
//                       var noticeType_ids = _.pluck($scope.reftelagent.refTelAgentSMSNoticeTypes,'sms_notice_type_id');

                       _.each($scope.bindContactsTels,function(tel,$index){
                           var noticeType_ids = [];
                           var refTelAgentSMSNoticeType = {};
                           var num;
                           if(tel.notice_type && (tel.telephone_number_id || tel.telephone_number) && tel.telephone_number_id!='-1'){
                               all_bindContactsTels.push({
                                   "id":tel.id,
                                   "notice_type": tel.notice_type,
                                   "telephone_number": tel.telephone_number,
                                   "area_code_id": tel.area_code_id,
                                   "telephone_number_id":tel.telephone_number_id,
                                   "refTelAgentSMSNoticeTypes":[]
                               });

                               _.each($scope.reftelagent,function(data){
                                   if(tel.telephone_number_id ==  data.telephone_number_id) {
                                       refTelAgentSMSNoticeType = data;
                                       noticeType_ids = _.pluck(data.refTelAgentSMSNoticeTypes, 'sms_notice_type_id');
                                       var noticeType_key_ids = _.pluck(data.refTelAgentSMSNoticeTypes, 'id');//選中的ID
                                   }
                               });
                               _.each($scope.contact_all_smsnoticeTypes[$index],function(noticeType){
                                   if(noticeType.selected){
                                       num = noticeType_ids.indexOf(noticeType.id);
                                       if(num < 0){
                                           all_bindContactsTels[$index].refTelAgentSMSNoticeTypes.push({sms_notice_type_id:noticeType.id});
                                       }else{
                                           all_bindContactsTels[$index].refTelAgentSMSNoticeTypes.push({id:refTelAgentSMSNoticeType.refTelAgentSMSNoticeTypes[num].id, sms_notice_type_id:noticeType.id});
                                       }

                                   }
                               });


                           }else{
                               if((tel.notice_type==undefined || tel.notice_type=="" || tel.notice_type==null) &&
                                   (!tel.telephone_number) && (!tel.telephone_number_id || tel.telephone_number_id=='-1')) {
                                   tel.isRequired = false;
                               }else{
                                   tel.isRequired = true;
                               }
                           }
                       });
                   }else{
                       _.each($scope.bindContactsTels,function(tel,$index){
                           if(tel.notice_type && tel.telephone_number){
                               all_bindContactsTels.push({
                                   "id":tel.id,
                                   "notice_type": tel.notice_type,
                                   "telephone_number": tel.telephone_number,
                                   "area_code_id": tel.area_code_id,
                                   "telephone_number_id":tel.telephone_number_id,
                                   "refTelAgentSMSNoticeTypes":[]
                               });
                               _.each($scope.contact_all_smsnoticeTypes[$index],function(noticeType){
                                   if(noticeType.selected){
                                       all_bindContactsTels[$index].refTelAgentSMSNoticeTypes.push({sms_notice_type_id:noticeType.id});
                                   }
                               });
                           }else{
                               if((tel.notice_type==undefined || tel.notice_type=="" || tel.notice_type==null)
                                   && (tel.telephone_number==undefined || tel.telephone_number=="" || tel.telephone_number==null)) {
                                   tel.isRequired = false;
                               }else{
                                   tel.isRequired = true;
                               }
                           }
                       });
                   }
                   $scope.form_binding_agent.checkValidity().then(function(){
                       if(!$scope.refAgentContactTypes.agent_info_id){
                           topAlert.warning("請稍等，戶口姓名還沒有加載完成！");
                           return;
                       }
                       //return false;
                       if($scope.show_binding && !_.some($scope.all_authorization,function(auth){return auth.selected})){
                           topAlert.warning("聯絡人類型為授權人時，請至少選擇一個戶口授權項");
                           return;
                       }

                       $scope.refAgentContactTypes.num = num;
                       $scope.refAgentContactTypes.agentContactTels = all_bindContactsTels;//$scope.contactsTels;
                       //授權信息
                       $scope.refAgentContactTypes.refAgentContactPrivileges = $scope.all_authorization;
                       var refAgentContactTypes_copy = angular.copy($scope.refAgentContactTypes);
                       $modalInstance.close(refAgentContactTypes_copy);
                   },function(){
                       if($scope.refAgentContactTypes.agent_code==null||$scope.refAgentContactTypes.agent_code==''){
                           $scope.refAgentContactTypes_0_agent_info_id = true;
                           topAlert.warning("戶口編號不能为空白");
                       }
                       if($scope.refAgentContactTypes.contact_type==null||$scope.refAgentContactTypes.contact_type==''||$scope.refAgentContactTypes.contact_type==undefined){
                           $scope.refAgentContactTypes_0_contact_type = true;
                           topAlert.warning("聯絡人類型不能为空白");
                       }

                   })
               };
            $scope.refAgentContactTypes_0_agent_info_id = false;
            $scope.refAgentContactTypes_0_contact_type = false;


    }]).controller('agentGroupCtrl',['$scope','tmsPagination','agentGroup','refAgentGroupType','agentsLists','globalFunction','breadcrumb','topAlert','windowItems','pinCodeModal',
        function($scope,tmsPagination,agentGroup,refAgentGroupType,agentsLists,globalFunction,breadcrumb,topAlert,windowItems,pinCodeModal){
            //麵包屑導航
            breadcrumb.items = [
                 {"name":"戶組管理","active":true}
            ];
            //自定義變量
            $scope.bind_agent_group_url = globalFunction.getApiUrl('agent/agentgroup');
            $scope.bind_agent_url = globalFunction.getApiUrl('agent/refagentgrouptype');
            $scope.sub_put= 'PUT';
            $scope.sub_post= 'POST';
            $scope.bind_disabled_submit =$scope.bind_ref_disabled_submit = true;
            $scope.bind_agent_groups =[];
            $scope.show_group = true;
            $scope.agent_group_name ='';
            //初始化列表數據
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = agentGroup;
            $scope.pagination.max_size =2;
            $scope.pagination.items_per_page = 18;
            $scope.select = function(page){
                $scope.agent_groups = $scope.pagination.select(page,{agent_group_name:$scope.agent_group_name+"!","sort":"agent_group_name asc"});
            }
            $scope.select();
            //戶組模糊查詢
            $scope.$watch("agent_group_name",globalFunction.debounce(function(new_value,old_value){
                if(new_value){
                    $scope.agent_groups = $scope.pagination.select(1,{agent_group_name:new_value+"!","sort":"agent_group_name asc"});
                }else{
                    $scope.agent_group_name = "";
                    $scope.select();
                }
            }));
            //未綁定初始化列表數據
            $scope.no_agent_group = {
                agent_code:'',
                refAgentGroupTypes:{agent_info_id:'null'}
            }
            $scope.pagination_no = tmsPagination.create();
            $scope.pagination_no.resource = agentsLists;
            $scope.pagination_no.max_size = 4;
            $scope.pagination_no.items_per_page = 19;
            $scope.select_no_bind = function(page){
                $scope.no_agent_groups = $scope.pagination_no.select(page, $scope.no_agent_group);

            }
//            $scope.select_no_bind();
            //未綁定戶組查找精確查詢
            $scope.$watch("agent_group_name_no",globalFunction.debounce(function(new_value,old_value){
                if(new_value){
                    $scope.no_agent_group.agent_code = new_value+"!";
                    $scope.no_agent_groups = $scope.pagination_no.select(1, $scope.no_agent_group);

                }else{
                    $scope.no_agent_group.agent_code = "";
                    $scope.select_no_bind();
                }
            }));
            //户组绑定方法
            $scope.disabled_bind = false;
            var status =[];
            var original_bind_reset;
            $scope.bindGroup = function(id){
                $scope.show_group = false;
                $scope.disabled_bind = true;
                agentGroup.get({id:id}).$promise.then(function(agent_group){
                    $scope.bind_agent_group = agent_group;
                    $scope.bind_agent_group.pin_code = "";
                    status[0] = true;
                    original_bind_reset = angular.copy($scope.bind_agent_group);
                    $scope.bind_agent_code = agent_group.owner_name;
                    $scope.bind_disabled_submit = $scope.bind_ref_disabled_submit = false;
                    if($scope.bind_agent_group.id != ''){
                        $scope.parentGroup($scope.bind_agent_group.id);
                        $scope.selectRefAgentGroupTypes(1,$scope.bind_agent_group.id,$scope.bind_agent_code);
                        $scope.ref_agent_code = "";
                        $scope.refAgentGroup = "";
                    }

                })
            }
            //初始化戶組成員列表
            $scope.ref_bind_agent_code ="";
            $scope.pagination_refAgentGroupType = tmsPagination.create();
            $scope.pagination_refAgentGroupType.resource = refAgentGroupType;
            $scope.pagination_refAgentGroupType.max_size = 2;
            $scope.pagination_refAgentGroupType.items_per_page = 7;
            $scope.selectRefAgentGroupTypes = function(page,agent_group_id,agent_code){
                $scope.ref_bind_agent_code =agent_code;
                $scope.pagination_refAgentGroupType.select(page,{agent_group_id:agent_group_id,sort:"agentInfo.agent_code NUMASC"}).$promise.then(function(refAgentGroupTypes){
                    $scope.refAgentGroupTypes  = refAgentGroupTypes;
                    status[1] = true;
                    if(status[0] && status[2]){
                        $scope.disabled_bind = false;
                    }
                });
            }
            //戶組成員搜索
            $scope.refAgentGroup_search ={
                agentInfo:{agent_code:""},
                agent_group_id: "",
                sort: "agentInfo.agent_code NUMASC"
            } ;
            $scope.$watch("refAgentGroup",globalFunction.debounce(function(new_value,old_value){
                if(new_value) {
                    if ($scope.bind_agent_group.id) {
                        $scope.refAgentGroup_search.agent_group_id = $scope.bind_agent_group.id;
                        $scope.refAgentGroup_search.agentInfo.agent_code=new_value+"!";
                        $scope.pagination_refAgentGroupType.select(1, $scope.refAgentGroup_search).$promise.then(function (refAgentGroupTypes) {
                            if (refAgentGroupTypes.length > 0) {
                                $scope.refAgentGroupTypes = refAgentGroupTypes;
                            } else {
                                $scope.refAgentGroupTypes = [];
                            }
                        });
                    }
                }else{
                    $scope.pagination_refAgentGroupType.select(1, {agent_group_id: $scope.bind_agent_group.id, sort: "agentInfo.agent_code NUMASC"}).$promise.then(function (refAgentGroupTypes) {
                        $scope.refAgentGroupTypes = refAgentGroupTypes;
                    });
                }
            }));


//            $scope.refAgentGroupSearch = function(){
//                if($scope.refAgentGroup){
//                    agentsLists.query(globalFunction.generateUrlParams({agent_code: $scope.refAgentGroup},{}),function(agent) {
//                        if(agent.length > 0){
//                            $scope.pagination_refAgentGroupType.select(1,{agent_info_id: agent[0].id,agent_group_id: $scope.bind_agent_group.id, sort: "agentInfo.agent_code", agent_type: '2'}).$promise.then(function (refAgentGroupTypes) {
//                                $scope.refAgentGroupTypes = refAgentGroupTypes;
//                            });
//                        }
//                    });
//                }else{
//                    $scope.pagination_refAgentGroupType.select(1, {agent_group_id: $scope.bind_agent_group.id, sort: "agentInfo.agent_code", agent_type: '2'}).$promise.then(function (refAgentGroupTypes) {
//                        $scope.refAgentGroupTypes = refAgentGroupTypes;
//                    });
//                }
//            }

            //戶組刪除
            var deleteGroup_status;
            $scope.deleteGroup= function(id){
                deleteGroup_status = 0;
                agentGroup.get(globalFunction.generateUrlParams({id:id},{subAgentGroups:{}})).$promise.then(function(subAgentGroup){
                    if(subAgentGroup.subAgentGroups.length == 0 ){
                        deleteGroup_status = 1;
                    }
                });
                $scope.refAgentGroupTypeMember =  agentGroup.get(globalFunction.generateUrlParams({id:id},{refAgentGroupTypeMembers:{}})).$promise.then(function(refAgentGroupTypeMember){
                    if(refAgentGroupTypeMember.refAgentGroupTypeMembers.length == 0 ){
                        deleteGroup_status = 1;
                    }
                });
                if(deleteGroup_status == 0 ){
                    windowItems.confirm('系統提示','確定刪除此戶組嗎？',function() {
                        pinCodeModal(agentGroup,'delete',{id:id},'刪除成功！').then(function(){
//                            topAlert.success("刪除成功");
                            $scope.select_no_bind();
                            $scope.select();
                            if ($scope.bind_agent_group.id != '' && $scope.bind_agent_group.id == id) {
                                $scope.resetBindGroups();
                            }
                        })
                    })
                }else{
                    topAlert.warning("此戶組有下級戶組或戶組成員，不能刪除！");
                }
            }

            //判斷上層戶組: 顯示除了自己所屬戶組的的所有戶組
            $scope.parentGroup = function(id){
                agentGroup.query({sort:"agent_group_name asc"},function(agent_groups){
                    $scope.bind_agent_groups = agent_groups;
                    angular.forEach($scope.bind_agent_groups,function(bind_agent_group){
                        if(bind_agent_group.id == id){
                            $scope.bind_agent_groups.splice($scope.bind_agent_groups.indexOf(bind_agent_group),1);
                        }
                    });
                    status[2] = true;
                    if(status[0] && status[1]){
                        $scope.disabled_bind = false;
                    }
                })
            }
            //戶組綁定
            var bind_original;
            var init_bind_agent_group = {
                agent_info_id:"",
                parent_id:""
            }
            bind_original = angular.copy(init_bind_agent_group);
            $scope.bind_agent_group = angular.copy(init_bind_agent_group);
            //戶組綁定中的戶組股東
            $scope.$watch("bind_agent_code",globalFunction.debounce(function(new_value,old_value){
                if(!angular.isUndefined(new_value) && new_value !=''){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value},{}),function(agent){
                        $scope.agent = agent;
                        if($scope.agent.length > 0){
                            $scope.bind_agent_group.agent_info_id =  $scope.agent[0].id;
                        }else{
                            $scope.agent = [];
                            $scope.bind_agent_group.agent_info_id = '';
                        }
                    });
                }else{
                    $scope.agent = [];
                    $scope.bind_agent_group.agent_info_id = '';
                }
            }));
            //保存需要綁定的戶組
            $scope.bind_disabled_submit = false;
            $scope.addBindGroup = function(){
                if($scope.bind_disabled_submit){
                    return $scope.bind_disabled_submit;
                }
                if($scope.form_bind_agent_group.checkValidity()) {
                    $scope.bind_disabled_submit = true;
                    agentGroup.update($scope.bind_agent_group, function () {
                        topAlert.success("修改成功");
                        $scope.resetBindGroups();
                        $scope.select_no_bind();
                        //新增完之后重新reset
                        $scope.agent_groups_all = agentGroup.query({sort:"agent_group_name"});
                        $scope.select();
                    }, function () {
                        $scope.bind_disabled_submit = false;
                    })
                }
            }
            $scope.resetBindGroups = function(){
                $scope.form_bind_agent_group.$setPristine();
                $scope.bind_agent_group = angular.copy(bind_original);
                $scope.bind_disabled_submit = $scope.bind_ref_disabled_submit = true;
                $scope.bind_agent_code = "";
                $scope.refAgentGroupTypes = [];
            }

            $scope.resetBindGroup = function(){
                $scope.bind_agent_group = angular.copy(original_bind_reset);
                $scope.bind_agent_code = original_bind_reset.agent_group_name;
            }

            //添加戶組成員
            var original_bind_agent
            var init_bind_agent ={
                agent_group_id:"",
                agent_info_id:""
            };
            original_bind_agent = angular.copy(init_bind_agent);
            $scope.bind_agent= angular.copy(init_bind_agent);
            $scope.bind_ref_disabled_submit = false;
            $scope.addBindAgent = function(){
                if($scope.bind_ref_disabled_submit){
                    return $scope.bind_ref_disabled_submit;
                }
                if($scope.bind_agent_group.id == ''){
                    topAlert.warning("請選擇戶組");
                }else{
                    if(!angular.isUndefined($scope.bind_agent.agent_info_id)){
                              $scope.form_bind_agent.checkValidity().then(function(){
                                $scope.bind_ref_disabled_submit = true;
                                  pinCodeModal(refAgentGroupType,'save',$scope.bind_agent).then(function(){
                                      topAlert.success("添加戶組成員成功");
                                      $scope.ref_agent_code= "";
                                      $scope.ref_agent_name = "";
                                      $scope.select_no_bind();
                                      $scope.pagination_refAgentGroupType.select(1,{agent_group_id:$scope.bind_agent.agent_group_id}).$promise.then(function(refAgentGroupTypes){
                                          $scope.refAgentGroupTypes  = refAgentGroupTypes;
                                      });
                                      $scope.bind_ref_disabled_submit = false;
                                  }, function () {
                                      $scope.bind_ref_disabled_submit = false;
                                  });
                            });
                        }else{
                        topAlert.warning("不存在此戶口");
                        }
                }
            }
            $scope.$watch("ref_agent_code",globalFunction.debounce(function(new_value,old_value){
                if(!angular.isUndefined(new_value) && new_value != '' ){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value},{}),function(agent){
                        $scope.ref_agent = agent;
                        if($scope.ref_agent.length > 0){
                            $scope.bind_agent.agent_info_id = $scope.ref_agent[0].id;
                            $scope.bind_agent.agent_group_id = $scope.bind_agent_group.id;
                            $scope.ref_agent_name = $scope.ref_agent[0].agent_name;
                        }else{
                            $scope.bind_agent.agent_info_id = "";
                            $scope.bind_agent = {};
                            $scope.ref_agent_name = '';
                        }
                    });
                }else{
                    $scope.ref_agent_name = '';
                    $scope.bind_agent.agent_info_id = "";
                }
            }));

            //刪除戶組成員
            $scope.ref_delete = function(id){
                windowItems.confirm('系統提示','確定刪除此戶組成員嗎？',function() {
                    pinCodeModal(refAgentGroupType,'delete',{id:id},'刪除戶組成員成功！').then(function(){
//                        topAlert.success("刪除戶組成員成功");
                        $scope.select_no_bind();
                        $scope.pagination_refAgentGroupType.select(1, {agent_group_id: $scope.bind_agent_group.id}).$promise.then(function (refAgentGroupTypes) {
                            $scope.refAgentGroupTypes = refAgentGroupTypes;
                        });
                    });
                });
            }
            //新增戶組
            $scope.agent_groups_all = agentGroup.query({sort:"agent_group_name"});
            var original;
            var init_agent_group = {
                agent_group_name:"",
                parent_id:"",
                agent_info_id:"",
                pin_code:""
            }
            original = angular.copy(init_agent_group);
            $scope.agent_group = angular.copy(init_agent_group);

            //獲取戶組股東ID
            $scope.$watch("agent_code",globalFunction.debounce(function(new_value,old_value){
                if(!angular.isUndefined(new_value) && new_value != ''){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value},{}),function(agent){
                        if(!angular.isUndefined(new_value) && new_value !=''){
                            $scope.agentID = agent;
                        }else{
                            $scope.agentID = [];
                        }
                        if($scope.agentID.length > 0){
                            $scope.agent_group.agent_info_id =  $scope.agentID[0].id;
                        }else{
                            $scope.agentID = [];
                            $scope.agent_group.agent_info_id = '';
                        }
                    });
                }
            }));
            //新增戶組
            $scope.addGroupShow = function(){
                $scope.agent = [];
                $scope.show_group = true;
            }
            $scope.disabled_submit = false;
            $scope.addGroup = function(){
                if($scope.disabled_submit){
                    return $scope.disabled_submit;
                }
                $scope.form_agent_group.checkValidity().then(function(){
                    $scope.disabled_submit = true;
                    agentGroup.save($scope.agent_group, function () {
                        topAlert.success("新增成功");
                        $scope.resetGroup();
                        $scope.select();
                        $scope.select_no_bind();
                        //新增完之后重新reset
                        $scope.agent_groups_all = agentGroup.query();
                        $scope.disabled_submit = false;
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                });
            }
            $scope.resetGroup = function(){
                $scope.form_agent_group.$setPristine();
                $scope.form_agent_group.clearErrors();
                $scope.agent_group = angular.copy(bind_original);
                $scope.agent_code = '';
                $scope.agentID=[];
            }

    }]).controller('boundMessagePeopleCtrl',['$scope','breadcrumb','globalFunction','tmsPagination','windowItems','topAlert','refTelAgent','smsnoticeType','agentsLists','agentContact','pinCodeModal','strToTime',
        function($scope,breadcrumb,globalFunction,tmsPagination,windowItems,topAlert,refTelAgent,smsnoticeType,agentsLists,agentContact,pinCodeModal,strToTime){
            //麵包屑導航
            breadcrumb.items = [
              {"name":"綁定短信通知人","active":true}
            ];
            //自定义变量
            $scope.showAdd = false;
            $scope.disabled_add = false;
            $scope.contact_all_smsnoticeTypes =[];
            $scope.contact_smsnoticeTypes =[];
            var check_i= [0];

            $scope.smsnoticeTypes = smsnoticeType.query();
            $scope.bound_msg_url =  globalFunction.getApiUrl('agent/reftelagent');

            var init_condition = {
              "id":"",
              "agent_code":"",
              "agent_info_id":"",
              "agent_name":"",
              "agent_contact_id":"",
              "telephone_number_id":"",
              "sms_notice_type_id":"",
              "send_secret":0,
              "pin_code":"",
              "smsNoticeTypes":[]
            };
              $scope.record = angular.copy(init_condition);
              $scope.original_record =  angular.copy(init_condition);

              //列表
              $scope.reftelagentsmsNoticets =[];
              $scope.pagination = tmsPagination.create();
              $scope.pagination.resource = refTelAgent;
              $scope.pagination.query_method = "AgentNotices";
              $scope.select = function(page){
                  $scope.pagination.select(page,globalFunction.generateUrlParams({agent_info_id:$scope.record.agent_info_id},{agentGroup:{},refTelAgentSMSNoticeTypes:{}})).$promise.then(function(data){
                      $scope.reftelagentsmsNoticets = data;
                      _.each($scope.reftelagentsmsNoticets,function(data){
                          data.refTelAgentSMSNoticeTypes = _.sortBy(data.refTelAgentSMSNoticeTypes,function(item){return 1 - strToTime(item.sms_notice_type_create_time)})
                      })
                  });
              }
            //增加通知人
            var original_contacts;
            $scope.contacts = [{
                    check_all:"",
                    "agent_contact_id":"",
                    "agent_info_id":"",
                    "telephone_number_id":"",
                    "send_secret":"0",
                    "pin_code":"",
                    "val":"",//設定聯絡人的val
                    "refTelAgentSMSNoticeTypes":[
                        {
                            "sms_notice_type_id":"",
                            "disable":"0"
                        }
                    ]
                }]

            original_contacts = angular.copy($scope.contacts);

            //增加联络人呢
            $scope.addMessageContact = function(){
                if($scope.agent.id){
                    $scope.contacts.push({
                        "check_all":"",
                        "agent_contact_id":"",
                        "agent_info_id":"",
                        "telephone_number_id":"",
                        "send_secret":"0",
                        "pin_code":"",
                        "refTelAgentSMSNoticeTypes":[
                            {
                                "sms_notice_type_id":""
                            }
                        ]
                    });
                    check_i[$scope.contacts.length-1] = 0;
                    $scope.smsnoticetypes_checked_layout();
                }else{
                    topAlert.warning("請輸入戶口編號!");
                }
            }
            //通知事項
              $scope.smsnoticetypes_checked_layout = function() {
                  $scope.disabled_add = true;
                  $scope.smsnoticeTypes = [];
                  $scope.all_smsnoticeTypes = [];
                  smsnoticeType.query({show_type:"|1"}).$promise.then(function (_contactPrivilege) {
                      $scope.all_smsnoticeTypes = _contactPrivilege;
                      for (var i = 0; i < Math.ceil($scope.all_smsnoticeTypes.length / 4); i++) {
                          $scope.smsnoticeTypes.push($scope.all_smsnoticeTypes.slice(i * 4, 4 * (i + 1)))
                      }
                      $scope.contact_smsnoticeTypes.push($scope.smsnoticeTypes);
                      $scope.contact_all_smsnoticeTypes.push($scope.all_smsnoticeTypes);
                      $scope.disabled_add = false;
                  });
              }
              $scope.smsnoticetypes_checked_layout();
            //选择通知事项
            $scope.check_message_sms_notice_type_id = function(sms,index){
                if(sms.selected){
                    if(1!=1){
                        if(_.pluck($scope.reftelagentgrouptype.refTelAgentSMSNoticeTypes,'sms_notice_type_id').indexOf(sms.id) >= 0){
                            angular.forEach($scope.reftelagentgrouptype.refTelAgentSMSNoticeTypes,function(refTelAgentSMSNoticeType){
                                if(sms.id == refTelAgentSMSNoticeType.sms_notice_type_id){
                                    smsNoticeType.disable = "0";
                                }
                            })
                        }else{
                            $scope.reftelagentgrouptype.refTelAgentSMSNoticeTypes.push({sms_notice_type_id:sms.id,disable:"0"});
                        }
                    }else{
                        $scope.contacts[index].refTelAgentSMSNoticeTypes.push({sms_notice_type_id:sms.id,disable:"0"});
                    }
                }else{
                    if($scope.ref_tel_agent_group.id){
                        if( _.pluck($scope.reftelagentgrouptype.refTelAgentSMSNoticeTypes,'sms_notice_type_id').indexOf(sms.id) >= 0){
                            angular.forEach($scope.reftelagentgrouptype.refTelAgentSMSNoticeTypes,function(refTelAgentSMSNoticeType){
                                if(sms.id == refTelAgentSMSNoticeType.sms_notice_type_id && refTelAgentSMSNoticeType.id){
                                    smsNoticeType.disable = "1";
                                    $scope.group_check_alls = false;
                                }else{
                                    $scope.reftelagentgrouptype.refTelAgentSMSNoticeTypes.splice(_.pluck($scope.reftelagentgrouptype.refTelAgentSMSNoticeTypes,'sms_notice_type_id').indexOf(sms.id), 1);
                                }
                            })
                        }
                    }else {
                        $scope.reftelagentgrouptype.refTelAgentSMSNoticeTypes.splice($scope.reftelagentgrouptype.refTelAgentSMSNoticeTypes.indexOf(sms), 1);
                    }
                }
            }
            //通過戶口編號查詢戶口名稱和對於的聯絡人
              $scope.$watch('record.agent_code',globalFunction.debounce(function(new_value,old_value){
                  if(new_value){
                      agentsLists.query(globalFunction.generateUrlParams({agent_code:new_value},{agentContacts:{},level:{}})).$promise.then(function(agents) {
                          if(agents[0]){
                              $scope.record.agent_name = agents[0].agent_name;
                              $scope.record.agent_info_id = agents[0].id;
                              $scope.select(1);
                          }else{
                              $scope.record.agent_name = "";
                              $scope.record.agent_info_id ="";
                              $scope.select(1);
                          }
                      })
                  }else{
                      $scope.record.agent_name = "";
                      $scope.record.agent_info_id ="";
                      $scope.select(1);
                  }
              }));
            //新增绑定
            $scope.addBind = function(){
                $scope.reftelagent = {};
                $scope.reset();
                $scope.showAdd = true;
                if($scope.record.agent_code != ''){
                    $scope.agent_code = $scope.record.agent_code;
                }else{
                    $scope.agent_code = "";
                }
            }
              //查詢通知電話
              $scope.$watch('record.agent_contact_id',globalFunction.debounce(function(new_value,old_value){
                  if(new_value!=""){
                      $scope.contactTels =agentContact.get(globalFunction.generateUrlParams({id:new_value},{agentContactTels:{}}))
                  }
              }));
            $scope.$watch('agent_code',globalFunction.debounce(function(new_value,old_value){
                $scope.agent =[];
                $scope.agent_contact = [];
                if(new_value){
                    agentsLists.query(globalFunction.generateUrlParams({agent_code:new_value}, {})).$promise.then(function (agent) {
                        if(agent.length > 0){
                            $scope.agent = agent[0];
                            $scope.showAdd = true;
                            agentsLists.get(globalFunction.generateUrlParams({id:$scope.agent.id},{bindSmsAgentContacts:{bindContactTels:""}})).$promise.then(function(agent_contact){

                                _.each(agent_contact.bindSmsAgentContacts,function(contact,$index){
                                    contact.key = $index;
                                    if($index == 0){
                                        contact.val = contact.agent_contact_name+"("+agent_contact.agent_code+"戶主)";
                                        contact.show_agent_code = agent_contact.agent_code;
                                    }else{
                                        if(contact.show_agent_code){
                                            contact.val = contact.agent_contact_name+"("+contact.show_agent_code+"授權人)";
                                        }else{
                                            contact.val = contact.agent_contact_name+"("+contact.agent_code+"戶主)";
                                            contact.show_agent_code = contact.agent_code;
                                        }
                                    }
                                })
                                $scope.agent_contact = agent_contact;
                                $scope.agent_contact.bindSmsAgentContacts[0].show_agent_code = agent_contact.agent_code;//
                                if($scope.reftelagent.id){
                                    _.each(agent_contact.bindSmsAgentContacts,function(contact,$index){
                                        if(contact.id ==$scope.reftelagent.agent_contact_id && contact.show_agent_code ==$scope.reftelagent.agent_code ){
//                                            $scope.reftelagent.key = $index;
                                            $scope.contacts[0].val = $index;
                                        }
                                    })
                                    $scope.select_only_contact(0);
                                }else{
                                    angular.forEach($scope.contacts,function(contact){
                                        contact.agent_contact_id = '';
                                        contact.telephone_number_id = '';
                                    })
                                    $scope.agent_contact_tel = []
                                }

                            });
                        }else{
                            $scope.agent ={};
                            $scope.showAdd = false;
                            $scope.agent_contact = [];
                            angular.forEach($scope.contacts,function(contact){
                                contact.agent_contact_id = '';
                                contact.telephone_number_id = '';
                            })
                            $scope.agent_contact_tel = []
                        }
                    });
                }else{
                    $scope.agent = {};
                    $scope.showAdd = false;
                    $scope.agent_contact = [];
                    angular.forEach($scope.contacts,function(contact){
                        contact.agent_contact_id = '';
                        contact.telephone_number_id = '';
                    })
                    $scope.agent_contact_tel = []
                }
            }));
            //聯絡人選擇通知電話
            $scope.agent_contact_tel = []
            $scope.select_only_contact = function(index){
//                if($scope.contacts[index].agent_contact_id){
//                    angular.forEach($scope.agent_contact.bindSmsAgentContacts,function(smsAgentContact) {
//                        if (smsAgentContact != null) {
//                            if ($scope.contacts[index].agent_contact_id == smsAgentContact.id) {
//                                $scope.agent_contact_tel[index] = smsAgentContact;
//                            }
//                        }
//                    })

                if($scope.contacts[index].val || $scope.contacts[index].val == 0){
                    $scope.agent_contact_tel = [];
                    angular.forEach($scope.agent_contact.bindSmsAgentContacts,function(smsAgentContact) {
                        if (smsAgentContact) {
                            $scope.contacts[index].agent_contact_id = smsAgentContact.id;
                            if ($scope.contacts[index].val == smsAgentContact.key) {
                                $scope.agent_contact_tel[index] = smsAgentContact;
                            }
                        }
                    })
                }else{
                    $scope.agent_contact_tel[index] = {};
                }
                if($scope.reftelagent.id){
//                    if($scope.contacts[index].agent_contact_id != $scope.reftelagent.agent_contact_id){
//                        $scope.contacts[index].telephone_number_id = "";
//                    }else{
//                        $scope.contacts[index].telephone_number_id =$scope.reftelagent.telephone_number_id;
//                    }
                    if($scope.reftelagent.agent_contact_id){
                        $scope.contacts[index].telephone_number_id =$scope.reftelagent.telephone_number_id;
                    }
                }
            }

              //修改綁定聯繫人
              $scope.bound_msg_method = 'POST';
              $scope.reftelagent = {};
              $scope.edit = function(id){
                  $scope.contacts = angular.copy(original_contacts);
                  $scope.all_smsnoticeTypes =$scope.contact_all_smsnoticeTypes[0];
                  $scope.showAdd = false
                  $scope.bound_msg_method = 'PUT';

                  refTelAgent.get(globalFunction.generateUrlParams({id:id},{refTelAgentSMSNoticeTypes:{}})).$promise.then(function(reftelagent){
                      $scope.reftelagent = reftelagent;
                      $scope.agent_code = $scope.reftelagent.agent_code;
                      $scope.contacts[0].agent_contact_id = $scope.reftelagent.agent_contact_id;

                      //$scope.contacts[0].agent_contact_id.telephone_number_id = $scope.reftelagent.telephone_number_id;
                      $scope.contacts[0].telephone_number_id = $scope.reftelagent.telephone_number_id;
                      $scope.contacts[0].send_secret= $scope.reftelagent.send_secret == 0 ? false : true;
                      $scope.select_only_contact(0);
                      //通知到事項
                      var noticeType_ids = _.pluck($scope.reftelagent.refTelAgentSMSNoticeTypes,'sms_notice_type_id');
                      var noticeType_key_ids = _.pluck($scope.reftelagent.refTelAgentSMSNoticeTypes,'id');//選中的ID
                      var i = 0
                      _.each($scope.all_smsnoticeTypes,function(_contactPrivilege,index){
                             if(_.indexOf(noticeType_ids,_contactPrivilege.id)==-1){
                                 _contactPrivilege.selected = false;
                             }else{
                                 _contactPrivilege.sms_id = noticeType_key_ids[i];
                                 _contactPrivilege.selected = true;
                                 i++;
                             }
                      });
                      if($scope.reftelagent.refTelAgentSMSNoticeTypes.length == $scope.all_smsnoticeTypes.length){
                          $scope.contacts[0].check_all = true;
                      }else{
                          $scope.contacts[0].check_all = false;
                      }
                  });
              }
              //刪除綁定聯繫人
              $scope.remove = function(id){
                  windowItems.confirm('系統提醒','確認刪除綁定短信通知嗎？',function(){
                      pinCodeModal(refTelAgent,'delete',{id:id},'刪除成功！').then(function(){
                          $scope.bound_msg_method = 'POST';
                          $scope.smsnoticetypes_checked_layout();
                          $scope.select();
                      });
                  });
              }
              //全选取消全选
              $scope.check_all_message_sms_notice_type = function(index){
                if($scope.contacts[index].check_all){
                    _.each($scope.contact_all_smsnoticeTypes[index],function(noticeType){
                        noticeType.selected = true;
                    });
                }else{
                    _.each($scope.contact_all_smsnoticeTypes[index],function(noticeType){
                        noticeType.selected = false;
                    });
                }
                check_i[index] = $scope.all_smsnoticeTypes.length;
              }
             $scope.check_message_sms_notice_type = function(sms,index){
                 if(sms.selected){
                     check_i[index]++;
                 }else{
                     check_i[index]--;
                 }
                 if($scope.all_smsnoticeTypes.length == check_i[index]){
                    $scope.contacts[index].check_all = true;
                 }else{
                     $scope.contacts[index].check_all = false
                 }
             }
              $scope.reset_add = function(){
                  $scope.showAdd = true;
                  angular.forEach($scope.contacts,function(contact){
                      contact.agent_contact_id = '';
                      contact.telephone_number_id = '';
                  })
                  $scope.contacts = angular.copy(original_contacts);
                  //$scope.agent_code = "";
                  $scope.bound_msg_method = 'POST';
                  $scope.check_all_message_sms_notice_type(0);
              }
              $scope.reset =function(){
                  $scope.form_bound_msg.$setPristine();
                  if ($scope.reftelagent.id) {
                      $scope.edit($scope.reftelagent.id);
                  }else{
                      angular.forEach($scope.contacts,function(contact){
                          contact.agent_contact_id = '';
                          contact.telephone_number_id = '';
                      })
                      $scope.contacts = angular.copy(original_contacts);
                      //$scope.agent_code = "";
                      $scope.bound_msg_method = 'POST';
                      $scope.check_all_message_sms_notice_type(0);
                  }

              }
              var status = 0;
              $scope.disabled_submit = false;
              $scope.add = function(){
                  if($scope.disabled_submit){
                      return $scope.disabled_submit;
                  }
                  var breakContact = true;
                  angular.forEach($scope.contacts,function(contact,index){
                      if(breakContact){
                          if(!_.some($scope.contact_all_smsnoticeTypes[index],function(type){return type.selected})){
                              status = 1;
                              breakContact = false;
                          }else{
                              status = 0;
                          }
                      }
                  });
                  if(status == 1){
                      topAlert.warning("請至少選擇一個通知事項");
                      return false;
                  }
                  //選中的通知項
                  if ($scope.reftelagent.id) {
                      var noticeType_ids = _.pluck($scope.reftelagent.refTelAgentSMSNoticeTypes,'sms_notice_type_id');
                      $scope.contacts[0].refTelAgentSMSNoticeTypes = [];
                      $scope.contacts[0].agent_info_id = $scope.agent.id;
                      $scope.contacts[0].refTelAgentSMSNoticeTypes.splice(0,1);
                      $scope.contacts[0].send_secret=$scope.contacts[0].send_secret == false ? 0 : 1,
                          _.each($scope.all_smsnoticeTypes,function(noticeType){
                              if(noticeType.selected){
                                  if(noticeType_ids.indexOf(noticeType.id) < 0){
                                      $scope.contacts[0].refTelAgentSMSNoticeTypes.push({sms_notice_type_id:noticeType.id});
                                  }else{
                                      $scope.contacts[0].refTelAgentSMSNoticeTypes.push({id:noticeType.sms_id, sms_notice_type_id:noticeType.id});
                                  }

                              }
                          });
                  }else{
                      angular.forEach($scope.contacts,function(contact,index){
                          $scope.contacts[index].refTelAgentSMSNoticeTypes =[];
                          $scope.contacts[index].refTelAgentSMSNoticeTypes.splice(0,1);
                          contact.agent_info_id = $scope.agent.id;
                          contact.send_secret=contact.send_secret == false ? 0 : 1,
                              _.each($scope.contact_all_smsnoticeTypes[index],function(noticeType){
                                  if(noticeType.selected){
                                      contact.refTelAgentSMSNoticeTypes.push({sms_notice_type_id:noticeType.id});
                                  }
                              });
                      });
                  }
                  if(status == 0){
                      $scope.form_bound_msg.checkValidity().then(function() {
                          //edit
                          $scope.disabled_submit = true;
                          if ($scope.reftelagent.id) {
                              $scope.record.agent_code = '';
                              $scope.contacts[0].id = $scope.reftelagent.id;
                              refTelAgent.update($scope.contacts[0]).$promise.then(function () {
                                  $scope.record = angular.copy(init_condition);
                                  $scope.bound_msg_method = 'POST';
                                  $scope.smsnoticetypes_checked_layout();
                                  $scope.select();
                                  topAlert.success('修改綁定短信通知成功！');
                                  $scope.reset_add();
                                  $scope.record.agent_code = $scope.agent_code;
                                  $scope.disabled_submit = false;
                              },function(){
                                  $scope.disabled_submit = false;
                              });
                          } else {
                              $scope.record.agent_code = '';
                              refTelAgent.save($scope.contacts).$promise.then(function(){
                                  topAlert.success('添加綁定短信通知成功！');
                                  $scope.record = angular.copy(init_condition);
                                  $scope.bound_msg_method = 'POST';
                                  $scope.smsnoticetypes_checked_layout();
                                  $scope.select();
                                  $scope.reset_add();
                                  $scope.record.agent_code = $scope.agent_code;
                                  $scope.disabled_submit = false;
                              },function(){
                                  $scope.disabled_submit = false;
                              });

                          }
                      });
                  }
              }
    }]).controller('batchBoundMessagePeopleCtrl',['$scope','refTelAgent','agentContact','agentsLists','agentGroup','smsnoticeType','contactPrivilege','globalFunction','tmsPagination','topAlert','windowItems','breadcrumb','pinCodeModal',
        function($scope,refTelAgent,agentContact,agentsLists,agentGroup,smsnoticeType,contactPrivilege,globalFunction,tmsPagination,topAlert,windowItems,breadcrumb,pinCodeModal){
            //麵包屑導航
            breadcrumb.items = [
                {"name":"上線短信設定","active":true}
            ];
            //自定義變量
            $scope.sub_put_post = "POST";
            $scope.batch_bound_message_people_url = globalFunction.getApiUrl('agent/reftelagent/create-sms-bind-group');
            $scope.ref_tel_agent_group ={};
            $scope.agent_group_name = '';
            $scope.disabled_group = false;
            //初始化列表
            //顯示order紙信息
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = refTelAgent;
            $scope.select= function(page){
                $scope.reftelagentgrouptypes = $scope.pagination.select(page,$scope.agent_group_names,{agentGroup:{refAgentGroupTypeOwner:""},refTelAgentSMSNoticeTypes:{}});
            }
            $scope.agent_group_names = {
                agentGroup:{agent_group_name:""},
                is_group:"1",
                sort:"agentGroup.agent_group_name ASC"
            }
            //戶組
            $scope.$watch("agent_group_name",globalFunction.debounce(function(new_value,old_value){
                if(new_value){
                    $scope.agent_group_names.agentGroup.agent_group_name = new_value+"!";
                    $scope.reftelagentgrouptypes = $scope.pagination.select(1,$scope.agent_group_names,{agentGroup:{refAgentGroupTypeOwner:""},refTelAgentSMSNoticeTypes:{}});
                }else{
                    $scope.agent_group_names.agentGroup.agent_group_name = "";
                    $scope.select();
                }
            }));
            //變量
            var original ;
            $scope.reftelagentgrouptype = {
                "agent_contact_id":"",
                "agent_group_id":"",
                "telephone_number_id":"",
                "send_secret":"0",
                "pin_code":"",
                "refTelAgentSMSNoticeTypes":[{
                        "sms_notice_type_id":"",
                        "disable":"0"
                    }]
            }
            $scope.reftelagentgrouptype.refTelAgentSMSNoticeTypes.splice(0,1);
            original = angular.copy($scope.reftelagentgrouptype);

           //對戶組進行監控
            $scope.$watch("agentGroup",globalFunction.debounce(function(new_value,old_value){
                if(new_value){
                    agentGroup.query(globalFunction.generateUrlParams({agent_group_name:new_value},{bindSmsAgentContacts:{bindContactTels:""}})).$promise.then(function(agent_group){
                    //agentGroup.query(globalFunction.generateUrlParams({agent_group_name:new_value},{smsAgentContacts:{agentContactTels:""}})).$promise.then(function(agent_group){
                        if(agent_group.length > 0){
                            $scope.agent_group = agent_group[0];
                            $scope.reftelagentgrouptype.agent_group_id = $scope.agent_group.id;
                            $scope.select_contact();
                            if($scope.agent_group.owner_name){
                                agentsLists.query(globalFunction.generateUrlParams({agent_code:$scope.agent_group.owner_name}, {})).$promise.then(function (agent) {
                                    if(agent.length > 0){
                                        $scope.agent = agent[0];
                                    }
                                });
                            }
                        }
                    })
                }else{
                    $scope.agent_group = [];
                    $scope.agent_contact= [];
                    $scope.agent = {};
                }
            }));
            //聯絡人選擇通知電話
            $scope.select_contact = function(){
                if($scope.agent_group && $scope.reftelagentgrouptype.agent_contact_id){
                    angular.forEach($scope.agent_group.bindSmsAgentContacts,function(smsAgentContact){
                       if(smsAgentContact != null){
                           if($scope.reftelagentgrouptype.agent_contact_id == smsAgentContact.id){
                               $scope.agent_contact_tel = smsAgentContact;
                           }
                       }
                    })
                }else{
                    $scope.agent_contact_tel = {};
                }
                if($scope.ref_tel_agent_group.id){
                    if($scope.reftelagentgrouptype.agent_contact_id != $scope.ref_tel_agent_group.agent_contact_id){
                        $scope.reftelagentgrouptype.telephone_number_id = "";
                    }else{
                        $scope.reftelagentgrouptype.telephone_number_id = $scope.ref_tel_agent_group.telephone_number_id;
                    }
                }
            }

            //通知事項排列
            $scope.module_checked_layout = function(){
                $scope.all_contact_privileges = [];
                $scope.contact_privileges = [];
                smsnoticeType.query({show_type:'|2'}).$promise.then(function(contact_privileges){
                    $scope.all_contact_privileges = _.filter(contact_privileges, function(contact_privilege){ return contact_privilege.sms_notice_type != '存卡' && contact_privilege.sms_notice_type != '存單'});
                    for(var i = 0; i<Math.ceil($scope.all_contact_privileges.length/4); i++){
                        $scope.contact_privileges.push($scope.all_contact_privileges.slice(i*4,4*(i+1)))
                    }
                });
            }
            $scope.module_checked_layout();
            $scope.group_check_alls="";
            //全選跟取消全選
            $scope.group_check_all = function(){
                if($scope.group_check_alls){
                    _.each($scope.all_contact_privileges,function(noticeType){
                        noticeType.selected = true;
                    });
                    check_j = $scope.all_contact_privileges.length;
                }else{
                    _.each($scope.all_contact_privileges,function(noticeType){
                        noticeType.selected = false;
                    });
                    check_j = 0;
                }

            }
            //選擇通知事項
            var check_j=0;
            $scope.check_sms_notice_type_id = function(sms){
                if(sms.selected){
                    check_j++;
                }else{
                    check_j--;
                }
                if($scope.all_contact_privileges.length == check_j){
                    $scope.group_check_alls = true;
                }else{
                    $scope.group_check_alls = false
                }
            }

            //戶組綁定
            $scope.disabled_submit = false;
            $scope.add = function(){
                if($scope.disabled_submit){
                    return $scope.disabled_submit;
                }
                $scope.reftelagentgrouptype.refTelAgentSMSNoticeTypes = [];
                if(!_.some($scope.all_contact_privileges,function(type){return type.selected})){
                    topAlert.warning("請至少選擇一個通知事項");
                    return false;
                }
                //選中的通知項
                $scope.reftelagentgrouptype.refTelAgentSMSNoticeTypes = [];
                if ($scope.ref_tel_agent_group.id) {
                    _.each($scope.all_contact_privileges,function(noticeType){
                        if(noticeType.selected){
                            $scope.reftelagentgrouptype.refTelAgentSMSNoticeTypes.push({id:noticeType.sms_id, sms_notice_type_id:noticeType.id});
                        }
                    });
                }else{
                    _.each($scope.all_contact_privileges,function(noticeType){
                        if(noticeType.selected){
                            $scope.reftelagentgrouptype.refTelAgentSMSNoticeTypes.push({sms_notice_type_id:noticeType.id});
                        }
                    });
                }
                if($scope.ref_tel_agent_group.id){
                    $scope.reftelagentgrouptype.id = $scope.ref_tel_agent_group.id;
                    $scope.form_batch_bound_message_people.checkValidity().then(function(){
                        $scope.disabled_submit = true;
                        refTelAgent.UpdateSmsBindGroup($scope.reftelagentgrouptype, function () {
                            topAlert.success("修改成功");
                            $scope.addSet();
                            $scope.select();
                            check_j=0;
                            $scope.disabled_submit = false;
                        }, function () {
                            $scope.disabled_submit = false;
                        });
                    });
                }else{
                    $scope.form_batch_bound_message_people.checkValidity().then(function(){
                        $scope.disabled_submit = true;
                        refTelAgent.CreateSmsBindGroup($scope.reftelagentgrouptype, function () {
                            topAlert.success("新增成功");
                            $scope.reset();
                            $scope.select();
                            check_j=0;
                            $scope.disabled_submit = false;
                        }, function () {
                            $scope.disabled_submit = false;
                        });
                    });
                }
            }

            //重置方法
            $scope.reset = function(){
                $scope.form_batch_bound_message_people.$setPristine();
                $scope.form_batch_bound_message_people.clearErrors();
                if($scope.ref_tel_agent_group.id) {
                    $scope.sub_put_post = "PUT";
                    $scope.batch_bound_message_people_url = globalFunction.getApiUrl('agent/reftelagent/update-sms-bind-group');
                    $scope.update($scope.ref_tel_agent_group.id);
                }else{
                    $scope.sub_put_post = "POST";
                    $scope.batch_bound_message_people_url = globalFunction.getApiUrl('agent/reftelagent/create-sms-bind-group');
                    $scope.agentGroup = '';
                    $scope.reftelagentgrouptype = angular.copy(original);
                    smsnoticeType.query({show_type:'|2'}).$promise.then(function (contact_privileges) {
//                        $scope.all_contact_privileges = contact_privileges;
                        $scope.all_contact_privileges = _.filter(contact_privileges, function(contact_privilege){ return contact_privilege.sms_notice_type != '存卡' && contact_privilege.sms_notice_type != '存單'});
                        $scope.contact_privileges = [];
                        for (var i = 0; i < Math.ceil($scope.all_contact_privileges.length / 4); i++) {
                            $scope.contact_privileges.push($scope.all_contact_privileges.slice(i * 4, 4 * (i + 1)))
                        }
                        for (var j = 0; j < $scope.contact_privileges.length; j++) {
                            for (var k = 0; k < $scope.contact_privileges[j].length; k++) {
                                $scope.contact_privileges[j][k].selected = false;
                            }
                        }
                    });
                }
                $scope.agent_contact_tel = [];
                $scope.group_check_alls = false;
            }

            $scope.addSet = function(){
                $scope.sub_put_post = "POST";
                $scope.batch_bound_message_people_url = globalFunction.getApiUrl('agent/reftelagent/create-sms-bind-group');
                $scope.disabled_group = false;
                $scope.ref_tel_agent_group.id = '';
                $scope.reset();
            }

            //update查詢 需要修改的方法
            $scope.update = function(id){
                $scope.disabled_group = true;
                $scope.sub_put_post = "PUT";
                $scope.batch_bound_message_people_url = globalFunction.getApiUrl('agent/reftelagent/update-sms-bind-group');
                check_j = 0;
                refTelAgent.get(globalFunction.generateUrlParams({is_group:"1",id:id},{agentGroup:{refAgentGroupTypeOwner:""},refTelAgentSMSNoticeTypes:{}})).$promise.then(function(ref_tel_agent_group){
                    $scope.ref_tel_agent_group = ref_tel_agent_group;
                    if($scope.ref_tel_agent_group){
                        $scope.agentGroup =  $scope.ref_tel_agent_group.agentGroup.agent_group_name;
                        $scope.reftelagentgrouptype.agent_contact_id = $scope.ref_tel_agent_group.agent_contact_id;
                        $scope.select_contact();
                        //通知到事項
                        var noticeType_ids = _.pluck($scope.ref_tel_agent_group.refTelAgentSMSNoticeTypes,'sms_notice_type_id');
                        var noticeType_key_ids = _.pluck($scope.ref_tel_agent_group.refTelAgentSMSNoticeTypes,'id');//選中的ID
                        var i = 0
                        _.each($scope.all_contact_privileges,function(_contactPrivilege,index){
                            if(_.indexOf(noticeType_ids,_contactPrivilege.id)==-1){
                                //_contactPrivilege.sms_id = "";
                                _contactPrivilege.selected = false;
                            }else{
                                _contactPrivilege.sms_id = noticeType_key_ids[i];
                                _contactPrivilege.selected = true;
                                check_j++;
                                i++;
                            }
                        });
                        if($scope.ref_tel_agent_group.refTelAgentSMSNoticeTypes.length == $scope.all_contact_privileges.length){
                            $scope.group_check_alls = true;
                        }else{
                            $scope.group_check_alls = false;
                        }
                    }
                });
            };
            //删除方法
            $scope.delete = function(id){
                windowItems.confirm('系統提醒','確認刪除綁定短信通知設定嗎？',function(){
                    pinCodeModal(refTelAgent, 'delete', {id: id}, '刪除成功！').then(function () {
                        if($scope.ref_tel_agent_group.id == id) {
                            $scope.addSet();
                        }
                        $scope.select();
                    })
                });
            }

    }]).controller('birthDaySmsListCtrl',['$scope','breadcrumb','globalFunction','tmsPagination','$location','agentsLists','$filter','$state','topAlert','goBackData','birthdayCondition','smsBirthDay','pinCodeModal','getDate',
        function($scope,breadcrumb,globalFunction,tmsPagination,$location,agentsLists,$filter,$state,topAlert,goBackData,birthdayCondition,smsBirthDay,pinCodeModal,getDate){
            breadcrumb.items = [
                {"name":"生日提醒","active":true}
            ];

            $scope.is_search = false;//主要控制用戶查詢當天的生日日期

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

            $scope.check  = {all1:"",all2:"" };

            //单个复选框选中取消
            $scope.check_one = function(agent){
                if($scope.select_status == 1){
                    if(agent.selected){
                        $scope.check_agent_false.push(agent.id);
                    }else{
                        $scope.check_agent_false.splice(_.pluck($scope.check_agent_false,'id').indexOf(agent.id),1);
                    }
                }else{
                    if(agent.selected){
                        $scope.check.all1 = false;
                        $scope.check_agent_true.splice($scope.check_agent_true.indexOf(agent),1);
                    }else{
                        $scope.check_agent_true.push(agent.id);
                        if( $scope.pagination.items_per_page == $scope.check_agent_true.length){
                            $scope.check.all1 = true;
                        }
                    }
                }
            };

            $scope.check_agent_true = [];
            $scope.check_agent_false = [];

            $scope.select_status = 0;

            $scope.check_all2 = function(){
                if($scope.check.all1){
                    $scope.select_status = 0;
                    _.each($scope.agentLists, function (agent) {
                        agent.selected = false;
                    });
                    $scope.bind_agent = 0;
                    $scope.check_agent_true = [];
                    $scope.check_agent_false = [];
                    $scope.check.all1 = false;
                }else{
                    $scope.select_status = 1;
                    _.each($scope.agentLists, function (agent){
                        agent.selected = true;
                    });
                    $scope.check_agent_false = [];
                    $scope.check_agent_true = [];
                    $scope.check.all1 = true;
                }
            };

            var init_condition = {
                agent_code: "",
                sort:"agent_code NUMASC",
                tip_date: "0",
                birthday: $filter('date')(getDate(new Date()), 'MM-dd'),
                agentMaster: {
                    agent_contact_name:""
                }
            };
            $scope.condition = angular.copy(init_condition);
            $scope.condition = goBackData.get('condition',$scope.condition);
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = agentsLists;
            $scope.pagination.query_method = 'agentBirthdayList';
            $scope.select = function(page){
                var conditions = angular.copy($scope.condition);
                $scope.is_search = false;
                goBackData.set('condition',conditions);
                if(conditions.birthday && conditions.birthday != ""){
                    conditions.birthday = conditions.birthday ? $filter('date')(conditions.birthday, 'MM-dd') : "";
                    if($filter('date')(conditions.birthday, 'MM-dd') == $filter('date')(getDate(new Date()), 'MM-dd') && conditions.tip_date !=1){
                        $scope.is_search = true;
                    }else{
                        $scope.is_search = false;
                    }
                }

                if(conditions.agentMaster.agent_contact_name) {
                    conditions.agentMaster.agent_contact_name = conditions.agentMaster.agent_contact_name ? "!" + conditions.agentMaster.agent_contact_name + "!" : "";
                }

                birthdayCondition.init(angular.copy(conditions));

                $scope.pagination.select(page,globalFunction.generateUrlParams(conditions,{agentMaster:{},refTelAgentMasterNoticeType: {agentContactTel: ''}})).$promise.then(function(_agentLists){
                    $scope.agentLists = _agentLists;
                    _.each($scope.agentLists, function (ld) {
                        if ($scope.select_status == 1) {
                            if ($scope.check_agent_false.length > 0) {
                                if ($scope.check_agent_false.indexOf(ld.id) == -1) {
                                    ld.selected = true;
                                } else {
                                    ld.selected = false;
                                }
                            } else {
                                ld.selected = true;
                            }
                        } else {
                            if ($scope.check_agent_true.length > 0) {
                                if ($scope.check_agent_true.indexOf(ld.id) >= 0) {
                                    ld.selected = true;
                                    if( $scope.pagination.items_per_page == $scope.check_agent_true.length){
                                        $scope.check1.all1 = true;
                                    }
                                } else {
                                    ld.selected = false;
                                }
                            } else {
                                ld.selected = false;
                            }
                        }
                    });
                });
            };

            $scope.search = function(){
                $scope.select_status = 0;
                $scope.check_agent_true = [];
                $scope.check_agent_false = [];
                $scope.check.all1 = "";
                $scope.select(1);
            };

            $scope.reset = function(){
                $scope.condition = angular.copy(init_condition);
                $scope.select(1);
            };

            $scope.search();

            //全選
            $scope.selected = false;
            $scope.selectedAll = function(){
                _.each( $scope.agentLists,function(_agent){
                    _agent.selected = $scope.selected;
                });
            };

            $scope.sms_number = function(agent){
                var result = "";
                _.each(agent.refTelAgentMasterNoticeType,function(ele){
                    if(ele.notice_type != 2){
                        var number = ele.agentContactTel.area_code + " " +ele.agentContactTel.telephone_number;
                        result += (number + "  ");
                    }
                });
                return result;
            };

            //戶口詳細
            $scope.detailAgent= function(id){
                $location.path('/agent/detailed/2/'+id);
            };

            $scope.birthdaySMS = function(){

                var result = {
                    is_selected_all:angular.copy($scope.select_status),
                    agent_ids:[]
                };

                if(result.is_selected_all == 0){
                    result.agent_ids = angular.copy($scope.check_agent_true);
                }else{
                    result.agent_ids = angular.copy($scope.check_agent_false);
                }

                if(result.is_selected_all != 0 || result.agent_ids.length > 0) {
                    result.agent_ids = result.agent_ids.join(',');

                    $state.go("birthday-sms-detail",{is_select_all:result.is_selected_all,agent_info_id:result.agent_ids,is_birthday:""});
                }else {
                    topAlert.warning("請選擇要通知到的戶口");

                }

            };
            //手動生日短信
            $scope.birthdayNowSMS = function()
            {
//                pinCodeModal(smsBirthDay, 'sendBirthDaySms' ,{ agent_code:$scope.condition.agent_code}, '生日短信發送成功').then(function(){
//
//                });
                if(!$scope.is_search){
                    topAlert.warning('請選擇當天時間發送');
                    return;
                }
                var result = {
                    is_selected_all:angular.copy($scope.select_status),
                    agent_ids:[],
                    is_now:1
                };

                if(result.is_selected_all == 0){
                    result.agent_ids = angular.copy($scope.check_agent_true);
                }else{
                    result.agent_ids = angular.copy($scope.check_agent_false);
                }

                if(result.is_selected_all != 0 || result.agent_ids.length > 0) {
                    result.agent_ids = result.agent_ids.join(',');

                    $state.go("birthday-day-sms-detail",{is_select_all:result.is_selected_all,agent_info_id:result.agent_ids,is_birthday:"1"});
                }else {
                    topAlert.warning("請選擇要通知到的戶口");

                }
            }


        }]).service('birthdayCondition',[function(){

            this.condition;

            this.init = function(obj){
                this.condition = obj;
            };

        }]).controller('birthDaySmsDetailCtrl',['$scope','breadcrumb','globalFunction','pinCodeModal','tmsPagination','$location','agentsLists','$state','smsGroup','agentGroup','departMent','areaCode','topAlert','$modal','$stateParams','smsRecord','birthdayCondition',
            function($scope,breadcrumb,globalFunction,pinCodeModal,tmsPagination,$location,agentsLists,$state,smsGroup,agentGroup,departMent,areaCode,topAlert,$modal,$stateParams,smsRecord,birthdayCondition){
                breadcrumb.items = [
                    {"name":"生日短信","url":'agent/birthday-sms-list'},
                    {"name":"發送生日短信","active":true}
                ];
                $scope.areaCodes = areaCode.query();
                if($stateParams.is_select_all){
                    var condition = birthdayCondition.condition;
                    var params = {
                        is_selected_all:$stateParams.is_select_all,
                        agent_ids:$stateParams.agent_info_id,
                        sort:"agent_code NUMASC"
                    };

                    condition = _.extend(condition,params);
                    agentsLists.agentBirthDay(globalFunction.generateUrlParams(condition,{
                        agentMaster:{},
                        refTelAgentMasterNoticeType: {agentContactTel: ''}
                    })).$promise.then(function(agents){
                            $scope.agent_lists = agents;
                        });
                }


                //發送短信
                var init_record = {
                    "pin_code":"",
                    "sms_type":"1",
                    "priority":"1",
                    "is_sys":"0",
                    "content":"",
                    "type": 92,
                    "phoneNumbers":[
                        {
                            "agent_code":"",
                            "area_code":"",
                            "telephone_number":""
                        }
                    ]
                }
                $scope.record_create = angular.copy(init_record);

                $scope.edit_disabled = true;
                //選取發送
                var init_multi_record = {
                    agents: []
                }
                $scope.multiRecord = angular.copy(init_multi_record);
                $scope.sendSMS = function(){
                    $scope.agents_sms_content = [];
                    _.each($scope.agent_lists,function(em){
                        $scope.agents_sms_content.push({
                            agent_info_id: em.id,
                            recordIDs: em.sms_id ? em.sms_id : []
                        });
                    });
                    $scope.multiRecord.agents = $scope.agents_sms_content;
                    $scope.multiRecord.is_birthday = $stateParams.is_birthday;
                    if($scope.agent_lists.length>0){
                        pinCodeModal(agentsLists, 'birthdaySms' , $scope.multiRecord, '發送成功').then(function(){
                            $scope.agents_sms_content = [];
                            $scope.multiRecord = angular.copy(init_multi_record);
                            _.each($scope.agent_lists,function(em){
                                em.checked = false;
                            });
                        });
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

                //選擇發送的內容
                $scope.agentSmsNotice = [];
                $scope.sms_content = [];
                $scope.selectSendSMS = function(record){
                    $scope.agent_record = record;
                    //$scope.getRollingRecord_copy = angular.copy($scope.getRollingRecord)
                    $scope.agent_info_id = record.id;
                    $scope.group_select();
                    $scope.agent_code = record.agent_code;
                    if($scope.agent_record.sms_id){
                        $scope.agentSmsNotice = angular.copy($scope.agentSmsNotice_local['key_'+$scope.agent_info_id]); // = $scope.sendTels['key_'+$scope.agent_info_id]
                        //$scope.sendTels_new['key_'+$scope.agent_info_id];
                        $scope.tel_content = angular.copy($scope.tel_content_local['key_'+$scope.agent_info_id]);
                        $scope.record_create.content = angular.copy($scope.sms_content_local['key_' + $scope.agent_info_id]);// $scope.sendContent(_expiredMarker);
                        $scope.selected_group_content = angular.copy($scope.selected_group_content_local['key_'+$scope.agent_info_id]);


                    }else{
                        $scope.cancel();
                        if(record.refTelAgentMasterNoticeType) {
                            $scope.agentSmsNotice = [];
                            _.each(record.refTelAgentMasterNoticeType, function (_tel) {
                                if(_tel.notice_type !=2) {
                                    $scope.agentSmsNotice.push({
                                        agent_code: record.agent_code,
                                        agent_name: record.agent_name,
                                        area_code: _tel.agentContactTel.area_code,
                                        telephone_number: _tel.agentContactTel.telephone_number
                                    });
                                }
                            });
                            $scope.record_create.content = $scope.sendContent(record);
                        } else {
                            $scope.tel_record.isSystemFlag = false;
                        }
                    }
                }

                $scope.sendContent = function(agent_record){
                    $scope.isReadonly = true;
                    $scope.sex = agent_record.agentMaster.gender == '0'?'女士':'先生'
                    var sms_content = "";
                    if($stateParams.is_birthday){
                        sms_content += "尊敬的"+agent_record.agentMaster.agent_contact_name+"女士/先生:\n";
                        sms_content += "今天是個重要的日子, 謹此獻上最真摰的祝福: 祝您生日快樂!\n";
                        sms_content += "長城集團 敬上";
                    }else{
                        sms_content = "長城集團生日提醒：\n";
                        sms_content += "戶口："+agent_record.agent_code+"("+agent_record.agentMaster.agent_contact_name+")\n";
                        sms_content +="您的生日將到，祝您生日快樂";
                    }
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

                //===========發送SMS=============

                //初始化列表數據
                var init_new_record = {
                    search_type: "agent",
                    keyword: ""
                }
                $scope.new_record = angular.copy(init_new_record);
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
                            $scope.agent_record.sms_id = result.id;
                            $scope.localSaveSMS();
                            $scope.cancel();
                            $scope.isDisabled = false;
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




        }]).filter('contact',function(){
          return function(contacters){
              var contacts = '';
              angular.forEach(contacters,function(contacter){
                  contacts += contacter.agent_name +' '+contacter.area_code+ contacter.phone_number +'<br/>';
              });
              return contacts;
          }
  }).filter('suggestCode',function(){
          return function(suggestCodes){
              var suggest_code = '';
              if(!angular.isUndefined(suggestCodes)){
                  for(var i = 0; i< suggestCodes.suggest_agent_code.length;i++){
                      suggest_code += suggestCodes.suggest_agent_code[i] +'<br/>';
                  }
              }
              return suggest_code;
          }
      }).controller('agentSetPasswordCtrl',['$scope','globalFunction','id','agentsLists','topAlert','$modalInstance',
        function($scope,globalFunction,id,agentsLists,topAlert,$modalInstance){
            var original_password = '';
            $scope.data = {
                agent_info_id:id,
                password:'',
                pin_code:''
            };
            agentsLists.get(globalFunction.generateUrlParams({"id":id},{'passwordUser':{}})).$promise.then(function(data){
                $scope.data.password = data.password;
                $scope.name = data.passwordUser?data.passwordUser.name:'';
                $scope.update_time = data.password_update_time;
                original_password = data.password;

            });
            $scope.url = globalFunction.getApiUrl('agent/agent/set-password');
            $scope.disabled_submit = false;

            $scope.submit = function(){
                if($scope.disabled_submit) { return ; }
                $scope.form_set_password.checkValidity().then(function(){
                    $scope.disabled_submit = true;
                    agentsLists.setPassword($scope.data,function(){
                            topAlert.success("設置密碼成功！");
                            $scope.disabled_submit = false;
                            $modalInstance.close();
                        },function(){
                            $scope.disabled_submit = false;
                        })
                })
            }

            $scope.reset = function(){
                $scope.data.password = original_password;
            }
        }]).controller('agentTelVerifyCtrl', ['$scope', '$location', '$modalInstance', 'Agent_info_id', 'agentsLists', 'agentValidateRecord', 'Call_id', 'Phone_number', 'Has_password','jypasswordset','$window','ivr_available','currentMachine','ivr_failed_time','ref_agent_contact_type_id','tmsPagination',
        function($scope, $location, $modalInstance, Agent_info_id, agentsLists, agentValidateRecord, Call_id, Phone_number, Has_password,jypasswordset,$window,ivr_available,currentMachine,ivr_failed_time,ref_agent_contact_type_id,tmsPagination)
        {

            $scope.calllog=false

            var iframePanelsScope = $window.parent.angular.element("#iframePanels").scope();
            if(iframePanelsScope)
                $scope.socket = iframePanelsScope.socket;
            //驗證狀態
            $scope.socket.on('validateNum',function(data)
            {
                var data=data
                if(data.call_id==sessionStorage.getItem("call_id"))
                {
                    if(data.is_update=="1")
                    {
                        if(data.validateNo==1)
                        {
                            $scope.CustomerOperation="第二次驗證"
                        }
                        if(data.validateNo==2)
                        {
                            $scope.CustomerOperation="第三次驗證"
                        }
                    }
                    if(data.is_update=="2")
                    {
                        if(data.validateNo==1)
                        {
                            $scope.CustomerOperation="第一次修改"
                        }
                        if(data.validateNo==2)
                        {
                            $scope.CustomerOperation="第二次修改"
                        }
                        if(data.validateNo==3)
                        {
                            $scope.CustomerOperation="第三次修改"
                        }
                    }


                }
            })
            $scope.socket.on('hangup',function(data){
                // sessionStorage.setItem("phone_number","")
                if(data.phone_number==sessionStorage.getItem("phone_number"))
                {

                    if(data.landlineID==currentMachine.get('landline_id'))
                    {
                        $scope.calllog=true
                    }

                }


            })
            //交易密碼狀態
            $scope.socket.on('pwIsSet',function(data)
            {
                if(data.call_id==sessionStorage.getItem("call_id"))
                {
                    if(data.pwIsSet=="1")
                    {
                        $scope.jypasswordset=true
                    }
                    else
                    {
                        $scope.jypasswordset=false
                    }
                }


            })
            //輸錯次數
            $scope.socket.on('errorPWNum',function(data)
            {
                var data=data
                if(data.call_id==sessionStorage.getItem("call_id"))
                {
                    $scope.passwordError=[]

                    for(var i=0;i<data.errorNum;i++)
                    {
                        $scope.passwordError.push(1)
                    }
                    $scope.ivr_failed_time=data.errorNum
                }



            })
            $scope.ivr_failed_time=ivr_failed_time
            $scope.passwordError=[]
            for(var i=0;i<parseInt(ivr_failed_time);i++)
            {
                $scope.passwordError.push(1)
            }

            // $scope.CustomerOperation="第一次驗證"
            var ref_agent_contact_type_id=sessionStorage.getItem("ref_agent_contact_type_id")
            $scope.condition = {
                call_id :sessionStorage.getItem("call_id"),
                /*  agent_info_id : Agent_info_id,*/
                phone_number:sessionStorage.getItem("phone_number"),
                ref_agent_contact_type_id: sessionStorage.getItem("ref_agent_contact_type_id"),
                lang_name:sessionStorage.getItem("lang_name")
            }
            if(ivr_available==0)
            {
                $scope.ivr_availableshow=true
            }
            $scope.records_page = tmsPagination.create();
            $scope.records_page.resource = agentValidateRecord;
            /*   $scope.records_page.query_method = "getRecord";*/
            $scope.recordstarget

            $scope.jypasswordset=jypasswordset
            $scope.operationMode=
            {
                id:""
            }
            $scope.records_search=function(page)
            {
                $scope.records=$scope.records_page.select(page,{ref_agent_contact_type_id:ref_agent_contact_type_id,type:$scope.recordstarget},{});
            }
            $scope.records_search2=function(type)
            {
                $scope.records=$scope.records_page.select("",{ref_agent_contact_type_id:ref_agent_contact_type_id,type:type},{});
            }
            if($scope.jypasswordset==false)
            {
                $scope.operationMode.id="init"
                $scope.recordstarget=0
                $scope.records_search2(0)

            }
            else
            {
                $scope.operationMode.id="verify"
                $scope.recordstarget=1
                $scope.records_search2(1)
            }
            /* $scope.has_password = Has_password;*/

            $scope.isDisabled = false;
            $scope.save = function()
            {
                if($scope.isDisabled) { return false;  }
                //$scope.isDisabled = true;
            }
            $scope.isDisabledVerify = false;

            $scope.result = '';
            var sendable=true



            $scope.$watch('operationMode.id',
                function(h)
                {

                    if(h=="verify")
                    {
                        $scope.recordstarget=1
                        $scope.records_search2(1)
                    }
                    if(h=="modify")
                    {
                        $scope.recordstarget=2
                        $scope.records_search2(2)
                    }
                    if(h=="init")
                    {
                        $scope.recordstarget=0
                        $scope.records_search2(0)
                    }


                }
            );


            $scope.Send=function(mode)
            {
                if(sendable)
                {
                    sendable=false
                    if(mode=="verify")
                    {
                        $scope.isDisabledVerify = true;
                        $scope.CustomerOperation="第一次驗證"

                        var condition = angular.copy($scope.condition);
                        condition.type = 1;
                        $scope.result = '';
                        agentsLists.requestPassword(condition).$promise.then(function(data)
                        {
                            $scope.result = true;
                            $scope.isDisabledVerify = false;
                            $scope.CustomerOperation="第一次驗證"
                            $scope.records_search()
                        }, function()
                        {
                            $scope.result = false;
                            $scope.isDisabledVerify = false;
                            $scope.CustomerOperation="第一次驗證"
                            $scope.records_search()
                        });
                    }
                    if(mode=="modify")
                    {

                        $scope.isDisabledVerify = true;
                        $scope.CustomerOperation="第一次驗證"
                        var condition = angular.copy($scope.condition);
                        condition.type = 2;
                        $scope.result = '';
                        agentsLists.requestPassword(condition).$promise.then(function(data)
                        {
                            $scope.result = true;
                            $scope.isDisabledVerify=false;
                            $scope.CustomerOperation="第一次驗證"
                            $scope.records_search()
                        }, function()
                        {
                            $scope.isDisabledVerify=false;
                            $scope.result = false;
                            $scope.CustomerOperation="第一次驗證"
                            $scope.records_search()
                        });
                    }
                    if(mode=="init")
                    {
                        $scope.isDisabledVerify = true;
                        $scope.CustomerOperation="第一次修改"
                        var condition = angular.copy($scope.condition);
                        condition.type = 0;
                        $scope.result = '';
                        agentsLists.requestPassword(condition).$promise.then(function(data)
                        {
                            $scope.result = true;
                            $scope.isDisabledVerify=false;
                            $scope.CustomerOperation="第一次修改"
                            $scope.records_search()
                        }, function()
                        {
                            $scope.result = false;
                            $scope.isDisabledVerify=false;
                            $scope.CustomerOperation="第一次修改"
                            $scope.records_search()
                        });
                    }
                    //xhg 随机密码
                    if(mode=="random")
                    {
                        $scope.isDisabledVerify = true;
                        $scope.CustomerOperation="第一次驗證"
                        var condition = angular.copy($scope.condition);
                        condition.type = 3;
                        $scope.result = '';

                        agentsLists.requestPassword(condition).$promise.then(function(data)
                        {
                            $scope.result = true;
                            $scope.isDisabledVerify=false;
                            $scope.CustomerOperation="第一次驗證"
                        }, function()
                        {
                            $scope.result = false;
                            $scope.isDisabledVerify=false;
                            $scope.CustomerOperation="第一次驗證"
                        });
                    }


                    setTimeout(function()
                    {
                        sendable=true
                    },2000)
                }

            }

            $scope.cancel = function()
            {
                $modalInstance.dismiss(false);
            }
            $modalInstance.result.then((
                    function(status)
                    {

                    }),
                function()
                {

                });

        }]).controller('agentxcTelVerifyCtrl', ['$scope', '$location', '$modalInstance', 'Agent_info_id', 'agentsLists', 'agentValidateRecord', 'Call_id', 'Phone_number', 'Has_password','jypasswordset','$window','ivr_available','currentMachine','ivr_failed_time','ref_agent_contact_type_id','xcverify','tmsPagination',function($scope, $location, $modalInstance, Agent_info_id, agentsLists, agentValidateRecord, Call_id, Phone_number, Has_password,jypasswordset,$window,ivr_available,currentMachine,ivr_failed_time,ref_agent_contact_type_id,xcverify,tmsPagination)
    {
        var jschars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        function generateMixed() {
            var res = "";
            for(var i = 0; i < 32 ; i ++) {
                var id = Math.ceil(Math.random()*35);
                res += jschars[id];
            }
            return res;
        }


        $scope.calllog=false
        var iframePanelsScope = $window.parent.angular.element("#iframePanels").scope();
        if(iframePanelsScope)
            $scope.socket = iframePanelsScope.socket;
        //驗證狀態
        $scope.socket.on('xcvalidateNum',function(data)
        {
            var data=data
            if(data.xccall_id==sessionStorage.getItem("xccall_id"))
            {
                if(data.is_update=="1")
                {
                    if(data.validateNo=="1")
                    {
                        $scope.CustomerOperation="第二次驗證"
                    }
                    if(data.validateNo=="2")
                    {
                        $scope.CustomerOperation="第三次驗證"
                    }
                }
                if(data.is_update=="2")
                {
                    if(data.validateNo=="1")
                    {
                        $scope.CustomerOperation="第一次修改"
                    }
                    if(data.validateNo=="2")
                    {
                        $scope.CustomerOperation="第二次修改"
                    }
                    if(data.validateNo=="3")
                    {
                        $scope.CustomerOperation="第三次修改"
                    }
                }


            }
        })

        //交易密碼狀態
        $scope.socket.on('xcpwIsSet',function(data)
        {
            if(data.xccall_id==sessionStorage.getItem("xccall_id"))
            {
                if(data.pwIsSet=="1")
                {
                    $scope.jypasswordset=true
                }
                else
                {
                    $scope.jypasswordset=false
                }
            }


        })
        //輸錯次數
        $scope.socket.on('xcerrorPWNum',function(data)
        {
            var data=data
            if(data.xccall_id==sessionStorage.getItem("xccall_id"))
            {
                $scope.passwordError=[]

                for(var i=0;i<parseInt(data.errorNum);i++)
                {
                    $scope.passwordError.push(1)
                }
                $scope.ivr_failed_time=parseInt(data.errorNum)
            }



        })
        $scope.ivr_failed_time=ivr_failed_time
        $scope.passwordError=[]
        for(var i=0;i<parseInt(ivr_failed_time);i++)
        {
            $scope.passwordError.push(1)
        }

        var ref_agent_contact_type_id=sessionStorage.getItem("xcref_agent_contact_type_id")
        $scope.condition = {


            ref_agent_contact_type_id: sessionStorage.getItem("xcref_agent_contact_type_id")

        }
        if(ivr_available==0)
        {
            $scope.ivr_availableshow=true
        }
        $scope.records_page = tmsPagination.create();
        $scope.records_page.resource = agentValidateRecord;
//        $scope.records_page.query_method = "getRecord";
        $scope.recordstarget=""

        $scope.jypasswordset=jypasswordset
        $scope.operationMode=
        {
            id:""
        }
        $scope.records_search=function(page)
        {
            $scope.records=$scope.records_page.select(page,{ref_agent_contact_type_id:ref_agent_contact_type_id,type:$scope.recordstarget},{});
        }
        $scope.records_search2=function(type)
        {
            $scope.records=$scope.records_page.select("",{ref_agent_contact_type_id:ref_agent_contact_type_id,type:type},{});
        }
        if($scope.jypasswordset==false)
        {
            $scope.operationMode.id="init"
            $scope.recordstarget=5
            $scope.records_search2(5)

        }
        else
        {
            $scope.operationMode.id="verify"
            $scope.recordstarget=6
            $scope.records_search2(6)
        }
        /* $scope.has_password = Has_password;*/

        $scope.isDisabled = false;
        $scope.save = function()
        {
            if($scope.isDisabled) { return false;  }
            //$scope.isDisabled = true;
        }
        $scope.isDisabledVerify = false;

        $scope.result = '';
        var sendable=true
        $scope.recordstarget=""

        $scope.inputNum=0
        $scope.$watch('operationMode.id',
            function(h)
            {
                $scope.inputwarn=""
                $scope.inputNum=0
                if(h=="verify")
                {
                    $scope.recordstarget=6
                    $scope.records_search2(6)

                }
                if(h=="modify")
                {

                    $scope.recordstarget=7
                    $scope.records_search2(7)

                }
                if(h=="init")
                {
                    $scope.recordstarget=5
                    $scope.records_search2(5)

                }


            }
        );

        //現場電話驗證
        $scope.socket.on('xcvalidateStuts',function(data)
        {
            if(data.xccall_id==sessionStorage.getItem("xccall_id"))
            {

                if(data.xcvalidateStuts=="1")
                {
                    $scope.result = true;
                }
                else
                {
                    $scope.result = false;
                }
                $scope.isDisabledVerify = false;
                $scope.CustomerOperation="第一次驗證"
                $scope.records_search()
            }


        })
        $scope.inputwarn=""

        //現場輸入次數
        $scope.socket.on('xcinputNum',function(data)
        {
            var data=data
            if(data.xccall_id==sessionStorage.getItem("xccall_id"))
            {
                if(data.inputNo==1)
                {
                    $scope.inputwarn="驗證失敗"
                }
                else
                {
                    $scope.inputwarn="兩次密碼不相符，設置失敗"
                }
            }
        })
        $scope.Send=function(mode)
        {
            if(sendable)
            {
                sendable=false
                $scope.inputwarn=""
                $scope.inputNum=1
                if(mode=="verify")
                {
                    $scope.isDisabledVerify = true;
                    $scope.CustomerOperation="第一次驗證"

                    var condition = angular.copy($scope.condition);

                    condition.type = 6;
                    $scope.result = '';
                    condition.call_id = generateMixed();
                    sessionStorage.setItem("xccall_id",condition.call_id),
                        agentsLists.requestPassword(condition).$promise.then(function(data)
                        {
                            /*        $scope.result = true;
                             $scope.isDisabledVerify = false;
                             $scope.CustomerOperation="第一次驗證"
                             $scope.records_search()*/

                            $("#xcinputpassword").focus()
                        }, function()
                        {
                            /*                 $scope.result = false;
                             $scope.isDisabledVerify = false;
                             $scope.CustomerOperation="第一次驗證"
                             $scope.records_search()*/
                            $("#xcinputpassword").focus()
                        });
                }
                if(mode=="modify")
                {

                    $scope.isDisabledVerify = true;
                    $scope.CustomerOperation="第一次驗證"
                    var condition = angular.copy($scope.condition);
                    condition.type = 7;
                    $scope.result = '';
                    condition.call_id = generateMixed();
                    sessionStorage.setItem("xccall_id",condition.call_id),
                        agentsLists.requestPassword(condition).$promise.then(function(data)
                        {
                            /*          $scope.result = true;
                             $scope.isDisabledVerify=false;
                             $scope.CustomerOperation="第一次驗證"
                             $scope.records_search()*/
                            $("#xcinputpassword").focus()
                        }, function()
                        {
                            /*       $scope.isDisabledVerify=false;
                             $scope.result = false;
                             $scope.CustomerOperation="第一次驗證"
                             $scope.records_search()*/
                            $("#xcinputpassword").focus()
                        });
                }
                if(mode=="init")
                {
                    $scope.isDisabledVerify = true;
                    $scope.CustomerOperation="第一次修改"
                    var condition = angular.copy($scope.condition);
                    condition.type = 5;
                    $scope.result = '';
                    condition.call_id = generateMixed();
                    sessionStorage.setItem("xccall_id",condition.call_id),
                        agentsLists.requestPassword(condition).$promise.then(function(data)
                        {
                            /*           $scope.result = true;
                             $scope.isDisabledVerify=false;
                             $scope.CustomerOperation="第一次修改"
                             $scope.records_search()*/
                            $("#xcinputpassword").focus()
                        }, function()
                        {
                            /*         $scope.result = false;
                             $scope.isDisabledVerify=false;
                             $scope.CustomerOperation="第一次修改"
                             $scope.records_search()*/
                            $("#xcinputpassword").focus()
                        });
                }
                //xhg 随机密码
                if(mode=="random")
                {
                    $scope.isDisabledVerify = true;
                    $scope.CustomerOperation="第一次驗證"
                    var condition = angular.copy($scope.condition);
                    condition.type = 3;
                    $scope.result = '';
                    condition.call_id = generateMixed();
                    sessionStorage.setItem("xccall_id",condition.call_id),
                        agentsLists.requestPassword(condition).$promise.then(function(data)
                        {
                            /*           $scope.result = true;
                             $scope.isDisabledVerify=false;
                             $scope.CustomerOperation="第一次驗證"*/
                            $("#xcinputpassword").focus()
                        }, function()
                        {
                            /*                $scope.result = false;
                             $scope.isDisabledVerify=false;
                             $scope.CustomerOperation="第一次驗證"*/
                            $("#xcinputpassword").focus()
                        });
                }


                setTimeout(function()
                {
                    sendable=true
                },2000)
            }

        }

        $scope.cancel = function()
        {
            $modalInstance.dismiss(false);
        }
        $modalInstance.result.then((
                function(status)
                {

                }),
            function()
            {

            });
        //發送密碼
        $scope.password=
        {
            "session_id":"",
            "pin_code":""
        }

        $scope.pin_codeable=false
        $scope.sendpassword=function()
        {
            if($scope.pin_codeable)
            {
                return false
            }

            $scope.password.session_id=sessionStorage.getItem("xccall_id")
            if($scope.password.pin_code.length!=6)
            {
                $scope.password.pin_code=""
                $scope.pin_codewarn="密碼必須為6位數"
                $("#xcinputpassword").focus()
            }
            else if($scope.password.pin_code.length==0)
            {
                $scope.pin_codewarn="密碼不能為空"
                $("#xcinputpassword").focus()
            }
            else
            {
                $scope.pin_codewarn=""
                $scope.pin_codeable=true
                agentsLists.localValidate($scope.password,function()
                {

                    $scope.password.pin_code=""
                    $scope.pin_codeable=false

                    $scope.inputNum+=1
                    setTimeout(function()
                    {
                        $("#xcinputpassword").focus()
                    },500)

                },function()
                {

                    $scope.password.pin_code=""
                    $scope.pin_codeable=false
                    setTimeout(function()
                    {
                        $("#xcinputpassword").focus()
                    },500)

                })
            }

        }

    }]).controller('TelRecordsCtrl', ['$scope','$modalInstance','ref_agent_contact_type_id','agentValidateRecord','tmsPagination',function($scope,$modalInstance,ref_agent_contact_type_id,agentValidateRecord,tmsPagination)
    {

        $scope.operationMode=
        {
            id:""
        }

        $scope.recordstarget=""

        $scope.records_page = tmsPagination.create();
        $scope.records_page.resource = agentValidateRecord;
        $scope.records_page.query_method = "getRecord";

        $scope.records_search=function(page)
        {
            $scope.records=$scope.records_page.select(page,{ref_agent_contact_type_id:ref_agent_contact_type_id,type:$scope.recordstarget},{});
        }
        $scope.records_search2=function(type)
        {
            $scope.records=$scope.records_page.select("",{ref_agent_contact_type_id:ref_agent_contact_type_id,type:type},{});
        }

        $scope.$watch('operationMode.id',
            function(h)
            {
                if(h=="verify")
                {
                    $scope.recordstarget=1
                    /*   $scope.xcrecordstarget="6"*/
                    $scope.records_search2(1)
                }
                if(h=="modify")
                {
                    $scope.recordstarget=2
                    /*   $scope.xcrecordstarget="7"*/
                    $scope.records_search2(2)
                }
                if(h=="init")
                {a
                    $scope.recordstarget=3
                    /*          $scope.xcrecordstarget="5"*/
                    $scope.records_search2(3)
                }
                if(h=="unlock")
                {
                    $scope.recordstarget=4
                    $scope.records_search2(4)
                }
            }
        );
//        $scope.hotel_page = tmsPagination.create();
        $scope.records_search();
        $scope.cancel = function()
        {
            $modalInstance.dismiss(false);
        }
    }]).controller('refAgentContactTypeSetPasswordCtrl',['$scope','globalFunction','id','refagentcontacttypes','topAlert','$modalInstance',
        function($scope,globalFunction,id,refagentcontacttypes,topAlert,$modalInstance){
            var original_password = '';
            $scope.data = {
                ref_agent_contact_type_id:id,
                password:'',
                pin_code:''
            };
            refagentcontacttypes.get(globalFunction.generateUrlParams({"id":id},{'passwordUser':{}})).$promise.then(function(data){
                $scope.data.password = data.password;
                $scope.name = data.passwordUser?data.passwordUser.name:'';
                $scope.update_time = data.password_update_time;
                original_password = data.password;

            });
            $scope.url = globalFunction.getApiUrl('agent/refagentcontacttype/set-password');
            $scope.disabled_submit = false;

            $scope.submit = function(){
                if($scope.disabled_submit) { return ; }
                $scope.form_set_password.checkValidity().then(function(){
                    $scope.disabled_submit = true;
                    refagentcontacttypes.setPassword($scope.data,function(){
                        topAlert.success("設置密碼成功！");
                        $scope.disabled_submit = false;
                        $modalInstance.close();
                    },function(){
                        $scope.disabled_submit = false;
                    })
                })
            }

            $scope.reset = function(){
                $scope.data.password = original_password;
            }
        }])
}).call(this);
