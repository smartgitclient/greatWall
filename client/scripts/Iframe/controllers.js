/**
 * Created by harry on 2015/4/10.
 */
(function() {
    'use strict';
    angular.module('app.iframe.ctrls',[]).controller('iframePanelCtrl',['$scope', '$timeout', 'iframeConfig','globalConfig','$modal','agentsLists','tmsPagination','departmentType','tmsSocket','$http','currentMachine',
        function($scope, $timeout, iframeConfig,globalConfig,$modal,agentsLists,tmsPagination,departmentType,tmsSocket,$http,currentMachine){
        $scope.socket = tmsSocket;
        var defaultUrl = globalConfig.frontendUrl + iframeConfig.url;
        var defaultTitle = iframeConfig.title;

        $scope.defaultTitle = iframeConfig.title;
        $scope.show_index = 0;
        $scope.isDisabled = false;
         var dialOut_item={phone_number:1};
        $scope.iframePanels = [{
            url : defaultUrl,
            title : defaultTitle
        }];

        var iframe_panel = {
            url : defaultUrl,
            title : defaultTitle
        }
        $scope.show = function($index)
        {
            $scope.show_index = $index;
        }

        $scope.remove = function($index)
        {
            $scope.iframePanels.splice($index, 1);
            if($scope.iframePanels.length)
            {
                $scope.show_index = $scope.iframePanels.length - 1;
            }

        }
            $scope.icon123="zhuanjie-h.png"
            $scope.phoneicon=function(data)
            {
                if(data==1)
                {
                    $scope.icon123="zhuanjie.png"
                }
                if(data==0)
                {

                    $scope.icon123="zhuanjie-h.png"
                }

            }
        $scope.resize =  function()
        {
            resize();
        }

        $scope.addPanel = function(id,call_id,phone_humber)
        {
            if(id)
            {
                var iframe_content = document.getElementById('iframe0').contentWindow.angular.element("#AppCtrl").scope();
                var user=iframe_content.user
                var url;
                if(user.department.code == departmentType.treasury || user.department.code == departmentType.analysts || user.department.code == departmentType.it || user.department.code == departmentType.optimusInterNational){//賬房、數據分析員、資訊科技部
                    url='#/agent/agent-detail/'+id
                }else if(user.department.code == departmentType.account || user.department.code == departmentType.accountB || user.department.code == departmentType.financial || user.department.code == departmentType.Credit){//會計、會計部B、財務、信貸部
                    url='#/agent/agent-account-detail/'+id
                }else if(user.department.code == departmentType.scene || user.department.code == departmentType.market || user.department.code == departmentType.businessDev || user.department.code == departmentType.overseasDev){//場面、市場拓展部、業務發展部、海外發展部
                    url='#/agent/agent-scene-detail/'+id
                }else{//服務

                    url='#/agent/agent-service-detail/'+id
                }
                if(call_id)
                    url+='/'+call_id;
                if(phone_humber)
                    url+='/'+phone_humber;
                iframe_panel.url=globalConfig.frontendUrl+url;
            }
            else
            {
                iframe_panel.url=defaultUrl;
            }
            $scope.isDisabled = true;
            $timeout(function()
            {
                $scope.isDisabled = false;

            }, 1000);

            var tmp_panel = angular.copy(iframe_panel);
            $scope.iframePanels.push(tmp_panel);
            if($scope.iframePanels.length)
            {
                $scope.show_index = $scope.iframePanels.length - 1;
                //GetIframeScope($scope.show_index);
                $timeout(function(){resize()},200)
            }
        }

        $scope.reset = function()
        {
            var child_scope =  document.getElementById('iframe0').contentWindow.angular.element("#AppCtrl").scope();
            $timeout(function()
            {
                child_scope.logOut();
                if(typeof require === 'function')
                {
                    var gui = require('nw.gui');
                    var win = gui.Window.get();
                    win.unmaximize();
                    setTimeout(function(){
                        resize_reset();
                    }, 200);
                }
            }, 200).then(function()
            {
                $scope.show_index = 0;
                $scope.iframePanels[0]['title'] = defaultTitle;
                $scope.iframePanels.splice(1, $scope.iframePanels.length);
            })
        }

        $scope.top = function()
        {
            var iframe_content = document.getElementById('iframe'+$scope.show_index).contentWindow.angular.element("#content");
            iframe_content.scrollTop(0);
            iframe_content.perfectScrollbar('update');
        }

        var hall_id = ""
        $scope.resetHall = function(hall)
        {
            if(hall_id == hall.id){return ;}
            hall_id = hall.id;
            for(var i= 0; i< $scope.iframePanels.length; i++)
            {
                if($scope.show_index != i){
                    var iframe_content = document.getElementById('iframe'+i).contentWindow.angular.element("#header").scope();
                    iframe_content.$$childTail.selectHall(hall);
                }
            }
        }

        var iframe_shift = "";
            $scope.IVRoperation
        $scope.resetShift = function(shift)
        {
            if(!!iframe_shift && shift.year_month == iframe_shift.year_month && shift.shift_date == iframe_shift.shift_date){return ;}
            iframe_shift = shift;
            for(var i= 0; i< $scope.iframePanels.length; i++)
            {
                if($scope.show_index != i) {
                    var iframe_content = document.getElementById('iframe' + i).contentWindow.angular.element("#AppCtrl").scope();
                    iframe_content.changeCurrentShift(shift);
                }
            }
        }
            $scope.Callline=-1

            //电话列表 模拟数据
/*           $scope.CallList=[
                {phone_number:"+853-62076666","call_id":123,type:"in"},
                {phone_number:"+86-13168676d960","call_id":123,type:"in"},
                {phone_number:"+86-13168676960","call_id":123,type:"in"},
                {phone_number:"+86-13168676960","call_id":123,type:"in"}



            ];*/
         $scope.CallList=[];
       var callreminder=false
            $scope.page = tmsPagination.create();
            $scope.page.resource = agentsLists;
            $scope.page.query_method = 'getAgentByTelephoneNumber';
            var call_indata=[]
            $scope.socket.on('call-in',function(data){
                if(_.findIndex($scope.CallList,{call_id:data.call_id})==-1)
                {
                   call_indata=data
                }

            })

            //接电话

            $scope.socket.on('pickup',function(data){

                 if(callreminder && data.line_id==sessionStorage.getItem("line_id"))
                 {
                     if(data.type=="out")
                     {

                         if(data.landlineID==currentMachine.get('landline_id'))
                         {
                             sessionStorage.setItem("call_id",data.call_id)
                             sessionStorage.setItem("phone_number",data.phone_number)
                             sessionStorage.setItem("call_type","out")
                         }
                         if(_.findIndex($scope.CallList,{call_id:data.call_id})==-1)
                         {
                             $scope.CallList.unshift(data);
                             $scope.callreminder();
                             var json=
                             {
                                 log:$scope.CallList
                             }
                             var dataStr=angular.toJson(json);
                             sessionStorage.setItem("CallList",dataStr)
                         }

                     }
                     else
                     {

                         if( _.findIndex($scope.CallList,{call_id:data.call_id})==-1)
                         {

                             $scope.CallList.unshift(data);
                             $scope.callreminder();
                             var json=
                             {
                                 log:$scope.CallList
                             }
                             var dataStr=angular.toJson(json);
                             sessionStorage.setItem("CallList",dataStr)
                         }

                         if(data.landlineID==currentMachine.get('landline_id') && $scope.IVRoperation)
                         {

                             sessionStorage.setItem("call_id",data.call_id)
                             sessionStorage.setItem("phone_number",data.phone_number)
                             sessionStorage.setItem("call_type","in")
                             $scope.answer(_.findIndex($scope.CallList,{phone_number:data.phone_number}))



                         }

                     }
                 }
            })



            //挂电话
            $scope.socket.on('hangup',function(data){

               // sessionStorage.setItem("phone_number","")

                dialOut_item={phone_number:1};
                if($scope.CallList[_.findIndex($scope.CallList,{phone_number:data.phone_number})].call_id==sessionStorage.getItem("call_id"))
                {
                    sessionStorage.setItem("call_id","")
                    sessionStorage.setItem("call_type","")
                }
                if(_.findIndex($scope.CallList,{phone_number:data.phone_number})>=0)
                {

                    $scope.CallList.splice(_.findIndex($scope.CallList,{phone_number:data.phone_number}),1);
                    var json=
                    {
                        log:$scope.CallList
                    }
                    var dataStr=angular.toJson(json);
                    sessionStorage.setItem("CallList",dataStr)
                }

                if(data.landlineID==currentMachine.get('landline_id'))
                {

                    $(".callreminder").animate({"height":0},300)
                }

            })
            //转接
            var transferable=true
            $scope.transfer=function($index,call_id,phone_number)
            {
                if(transferable)
                {
                    transferable=false
                    $scope.socket.emit('ClientTransfer',phone_number)
                    sessionStorage.setItem("call_type","transfer")
                    sessionStorage.setItem("call_id",call_id)
                    sessionStorage.setItem("phone_number",phone_number)
                    sessionStorage.setItem("user_group_type","")
                    $scope.answer($index)
                    setTimeout(function()
                    {
                        transferable=true
                    },2000)
                }

            }
            //接受转接指令
            $scope.socket.on('NodeTransfer',function(phone_number){

                  if(sessionStorage.getItem("call_type")!="transfer" &&
                      sessionStorage.getItem("phone_number")==phone_number)
                  {
                      sessionStorage.setItem("call_id","")
                      sessionStorage.setItem("phone_number","")
                  }
            })

            //語言

            $scope.language=""
            $scope.language_tel=""
            $scope.socket.on('pnlang',function(data){
                   if(data.lang=="0")
                   {
                       $scope.language="其他"
                   }
                    if(data.lang=="1")
                    {
                        $scope.language="粵語"
                    }
                    if(data.lang=="2")
                    {
                        $scope.language="國語"
                    }
                    if(data.lang=="3")
                    {
                        $scope.language="英語"
                    }


                $scope.language_tel=data.phone_number
            })

            //接听
            $scope.answer=function(index)
            {

                $scope.Callline=index
               var phone_number=$scope.CallList[index].phone_number.split('-')
                var condition = {
                    area_code : phone_number[0],
                    telephone_number : phone_number[1]
                };

                $scope.page.select(1,condition,{}).$promise.then(function(data)
                {
                   // $scope.socket.emit('logsucha',data)
                        var modalInstance;
                        modalInstance = $modal.open({
                            templateUrl: "views/agent/tel_information.html",
                            controller:'agentCallInCtrl',
                            resolve: {
                                callIn: function(){
                                    return $scope.CallList[index];
                                },
                                addPanel:function(){
                                    return $scope.addPanel
                                },
                                page:function(){
                                    return $scope.page
                                },
                                condition:function(){
                                    return condition
                                },
                                language:function(){
                                    return $scope.language
                                },
                                language_tel:function(){
                                    return $scope.language_tel
                                },
                                codeId:function(){

                                    if(data.length>0)
                                    {
                                        return data[0].id
                                    }
                                    else
                                    {
                                        return ""
                                    }

                                }
                            }
                        })

                },function()
                {
                   // $scope.socket.emit('logsucha','電話號碼速查失敗')
                })
            }
            var line_id
 /*           setInterval(function()
            {

                if(document.getElementById('iframe0')!=null)
                {
                    if(document.getElementById('iframe0').contentWindow.angular.element("#AppCtrl")!=undefined)
                    {
                        if(document.getElementById('iframe0').contentWindow.angular.element("#AppCtrl").scope()!=undefined)
                        {
                            var iframe_content = document.getElementById('iframe0').contentWindow.angular.element("#AppCtrl").scope();
                            var user=iframe_content.user
                            if(user.hall.line_id!="")
                            {

                                line_id=user.hall.line_id

                            }
                        }

                    }
                }




            },300)*/

            //登陆推送
            var lognpush=true

            $scope.socket.on('loginPN',function(json){
                line_id=sessionStorage.getItem("line_id");
                if(lognpush)
                {
                       lognpush=false;
                       if(line_id && json.line_id==line_id && $scope.IVRoperation)
                       {
                          var callremindershow=false
                           $.each(json.data,function(index,val)
                           {
                               var val=val
                               if(_.findIndex($scope.CallList,{phone_number:val.phone_number})==-1)
                               {
                                   callremindershow=true
                                   if(val.breakInto==1)
                                   {
                                       val.type="out"
                                       $scope.CallList.unshift(val);
                                   }
                                   else
                                   {
                                       val.type="in"
                                       $scope.CallList.unshift(val);
                                   }
                               }
                           })
                           if(callremindershow)
                           {
                               var json=
                               {
                                   log:$scope.CallList
                               }
                               var dataStr=angular.toJson(json);
                               sessionStorage.setItem("CallList",dataStr)
                               $scope.callreminder();
                           }
                       }
                }

            })
            //打开来电提醒
            $scope.callreminder=function(){

                    /*if($(".callreminder").height()>0)
                    {
                        $(".callreminder").animate({"height":0},300)
                    }
                    else
                    {*/
                        $(".callreminder").animate({"height":290},300)
                    //}

            }
            //关闭来电提醒
            $scope.close=function(){
                $(".callreminder").animate({"height":0},300)
            }







          //轮询登陆状态

          var iframetime=null
            iframetime=setInterval(function()
            {
              if(document.getElementById('iframe0')!=null)
              {
                  if(document.getElementById('iframe0').contentWindow.angular.element("#AppCtrl").scope()!=undefined)
                  {
                      clearInterval(iframetime)
                      var iframe = document.getElementById('iframe0').contentWindow.angular.element("#AppCtrl").scope();
                      iframe.$on("signstate",function(ev,data)
                      {

                          if(!data)
                          {
                              $scope.CallList=[];
                              $(".callreminder").css({"height":0})
                              lognpush=false
                              callreminder=false
                          }
                          else
                          {
                              $scope.IVRoperation=sessionStorage.getItem("IVRotherFunction");
                              lognpush=true
                              callreminder=true
                          }
                      })
                  }

              }
            },500)



    }]).controller('agentCallInCtrl', ['$scope', '$location', '$modalInstance','condition','addPanel','agentsLists','page','callIn','topAlert','tmsSocket','language','language_tel','globalFunction','codeId','refagentcontacttypes',function($scope, $location, $modalInstance,condition,addPanel, agentsLists,page,callIn,topAlert,tmsSocket,language,language_tel,globalFunction,codeId,refagentcontacttypes)
    {
        $scope.phone_number=condition
        $scope.socket = tmsSocket;

        $scope.page=page
        $scope.agent_lists = [];

        $scope.language=""
        //語言選擇
        $scope.socket.on('pnlang',function(data){
            $scope.languageshow=true
            if(data.phone_number==sessionStorage.getItem("phone_number"))
            {
                if(data.lang=="0")
                {
                    $scope.language="其他"

                }
                if(data.lang=="1")
                {
                   $scope.language="粵語"

                }
                if(data.lang=="2")
                {
                    $scope.language="國語"

                }
                if(data.lang=="3")
                {
                    $scope.language="英語"

                }
            }

        })


      if(codeId=="")
      {
          if(language_tel==sessionStorage.getItem("phone_number"))
          {
              $scope.language=language
          }
      }


        //主要顯示戶口速查中的戶口信息
        agentsLists.get(globalFunction.generateUrlParams({id:codeId},{agentMaster:{},agentContact:{},refAgentMaster:{}})).$promise.then(function(agent){

            if(agent.agentMaster.language_type=="")
            {
                if(language_tel==sessionStorage.getItem("phone_number"))
                {
                    $scope.language=language
                }
            }
            $scope.language=agent.agentMaster.language_type
        });


        //通过号码查询户口
        $scope.search = function(page)
        {
            $scope.page.select(page, condition, {}).$promise.then(function(data)
            {
                if(!data || 0 === data.length)
                {
                   $scope.agent_lists =false;
                }
                else
                {
                    var arr=data
                    $.each(arr,function(index,val)
                    {
                        if(val.contact_type==1)
                        {
                            arr[index].contact_type="戶主"
                        }
                        if(val.contact_type==2)
                        {
                            arr[index].contact_type="授權人"
                        }
                    })
                    $scope.agent_lists=arr
                    $scope.language=$scope.agent_lists[0].language_type_name;
/*                    $.each(data,function(index,val)
                    {
                        agentsLists.get(globalFunction.generateUrlParams({id:val.id}, {agentMaster:{},refAgentMaster:{},refTelAgentMasterNoticeType:{}
                        })).$promise.then(function(agent){

                            arr[index].language=agent.agentMaster.language_type

                             arr[index].type=agent.refAgentMaster.contact_type_name
                             arr[index].ref_agent_contact_type_id=agent.refAgentMaster.id

                            if(index==data.length-1)
                            {
                                $scope.agent_lists = arr;
                            }
                        });

                    })*/

                }
            }, function(data)
            {
                $scope.agent_lists = false;
            });
        }
        $scope.search();
        //关闭户口资料弹出框
        $scope.cancel=function(){
            $modalInstance.close()
        };
        //速查
        $scope.searchAgent=function(agent_code,ref_agent_contact_type_id,type,lang,agent){


            $scope.socket.emit('Log_searchAgent',agent)

            if(type=="戶主")
            {
                sessionStorage.setItem("user_group_type",1)
            }
            if(type=="授權人")
            {
                sessionStorage.setItem("user_group_type",2)
            }
            if(agent_code){
                agentsLists.agentInfoList({agent_key:agent_code}).$promise.then(function (agents) {
                    if(agents.length == 1){
                        addPanel(agents[0].id,callIn.call_id,callIn.phone_number);
                    }
                })
            }
            sessionStorage.setItem("ref_agent_contact_type_id",ref_agent_contact_type_id)
            sessionStorage.setItem("lang_name",lang)
            $modalInstance.close()
        }
        $scope.keyword=
        {
            code:"",
            warning:""
        }
        //输入速查
        $scope.searchinput=function(){
            sessionStorage.setItem("user_group_type",3)
            if($scope.keyword.code){
                agentsLists.agentInfoList({agent_key:$scope.keyword.code}).$promise.then(function (agents) {
                    if(agents.length == 1){
                        addPanel(agents[0].id,callIn.call_id,callIn.phone_number);
                        $modalInstance.close()

                    }else if(agents.length == 0){
                       // topAlert.warning("無此戶口編號!");
                        $scope.keyword.warning="無此戶口編號!"
                    }
                })
            }
        }






    }])
}).call(this);
