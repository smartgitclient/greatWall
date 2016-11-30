(function() {
    'use strict';
    angular.module('app.profit.ctrls', [])
        .controller('profitSharePrinterCtrl', ['$scope', '$log', '$filter','pinCodeModal','getConsumption','breadcrumb','fixedNumber','agentsLists','$modal','sceneRecordProfit','sceneRecordRight','qzPrinter','printerType','mainScene', 'user', '$modalInstance', '$location', 'getDate', 'windowItems', 'globalFunction', 'tmsPagination', 'topAlert', 'outSceneWord','sceneRecord',
            function ($scope, $log, $filter,pinCodeModal,getConsumption,breadcrumb,fixedNumber,agentsLists,$modal,sceneRecordProfit,sceneRecordRight,qzPrinter,printerType,mainScene, user, $modalInstance, $location, getDate, windowItems, globalFunction, tmsPagination, topAlert, outSceneWord,sceneRecord) {

                //麵包屑導航
                breadcrumb.items = [
                    {"name":"分成開場","active":true}
                ];

                $scope.disabled_btn = false;
                //$scope.isSend_top = true;//是否禁用发送短信(列表1)
                //$scope.isSend_bottom = true;//是否禁用发送短信(列表2)
                $scope.partone_pin_code = "";//列印表一密码
                $scope.parttwo_pin_code = "";//列印表二密码
                //自定义显示户口编号和姓名
                $scope.int_code = {
                    agent_name:"",
                    agent_code:""
                }
                //mouseOn 提示
                $scope.tips_span = ['代理戶口', '代理戶口', '代理戶口', '股東戶口'];
                //定义一个model
                $scope.profit_information = {
                    mainSceneProfit:{
                        id:"",
                        main_scene_id:"",//主场次ID
                        print_no:"",//單編號
                        start_date:"",  //開工日期
                        start_time:"",  //開工時間
                        type:"",//類型:1現金2貸款
                        guarantee_amount:"0",//保證金
                        guarantor:"",//擔保人
                        partone_startevent:"",//開工條件(一):1三倍封頂2不封頂
                        parttwo_startevent:"",//開工條件(二):1股本內2股本外
                        currency:"",//幣種
                        partone_remark:"",//列印表一備註
                        end_date:"",//開工日期
                        end_time:"",//完場時間
                        out_amount:"0",//離台數
                        rolling_amount:"0",//轉碼數
                        loss_win_amount:"0",//上下數
                        shouldpay_from_agent:"0",//應收代理
                        shouldpay_to_agent:"0",//應付代理
                        total_commission:"0",//總碼傭
                        total_consumption:"0",//總消費數
                        company_actual_pay:"0",//公司實際交收
                        parttwo_remark:"",//列印表二備註
                        marker_seqnumber:"",//場次編號
                        scene_no:"",//場次(新增的)
                        is_shift_mark:"0"//是否截更新開記錄:0不是1是
                    },
                    mainSceneProfitAgent:[{
                            main_scene_profit_id:"",
                            agent_info_id:"",//即找户口(上)
                            agent_code:"",//即找户口码(上)
                            agent_name:"",//即找户口姓名(上)
                            percent:"0",//即找佔成(上)
                            commission_total:"0",//即找碼佣份數(上)
                            percent_profit:"0",//占成收益(下)
                            commission:"0",//碼佣(下)
                            consumption:"0",//消費數(下)
                            agent_pay:"0",//代理交收(下)
                            seqnumber:"0"//序號0~2為代理戶口,3为股東戶口
                        },
                        {
                            main_scene_profit_id:"",
                            agent_info_id:"",//即找户口(上)
                            agent_code:"",//即找户口码(上)
                            agent_name:"",//即找户口姓名(上)
                            percent:"0",//即找佔成(上)
                            commission_total:"0",//即找碼佣份數(上)
                            percent_profit:"0",//占成收益(下)
                            commission:"0",//碼佣(下)
                            consumption:"0",//消費數(下)
                            agent_pay:"0",//代理交收(下)
                            seqnumber:"1"//序號0~2為代理戶口,3为股東戶口
                        },
                        {
                            main_scene_profit_id:"",
                            agent_info_id:"",//即找户口(上)
                            agent_code:"",//即找户口码(上)
                            agent_name:"",//即找户口姓名(上)
                            percent:"0",//即找佔成(上)
                            commission_total:"0",//即找碼佣份數(上)
                            percent_profit:"0",//占成收益(下)
                            commission:"0",//碼佣(下)
                            consumption:"0",//消費數(下)
                            agent_pay:"0",//代理交收(下)
                            seqnumber:"2"//序號0~2為代理戶口,3为股東戶口
                        },
                        {
                            main_scene_profit_id:"",
                            agent_info_id:"",//即找户口(上)
                            agent_code:"",//即找户口码(上)
                            agent_name:"",//即找户口姓名(上)
                            percent:"0",//即找佔成(上)
                            commission_total:"0",//即找碼佣份數(上)
                            percent_profit:"0",//占成收益(下)
                            commission:"0",//碼佣(下)
                            consumption:"0",//消費數(下)
                            agent_pay:"0",//代理交收(下)
                            seqnumber:"3"//序號0~2為代理戶口,3为股東戶口
                        }
                    ],
                    incapital:[],
                    outcapital:[],
                    tip:[],
                    pin_code:"",
                    id:"",
                    is_shift_mark:""//是否截更新開記錄:0不是1是

                }
                $scope.profit_information_copy = angular.copy($scope.profit_information);
                $scope.show_type = [];//入场本金列表
                $scope.outtype = '';//入場本金操作
                $scope.intype = '';//入場本金類型
                $scope.show_type_out = [];//离场本金列表
                $scope.outtype_out = '';//离场本金操作
                $scope.intype_out = '';//离场本金類型
                $scope.is_shift_mark_status = false;//是否截月

                $scope.pagination_scene = tmsPagination.create();//右边分页
                $scope.pagination_scene.resource = mainScene;
                $scope.pagination_scene.max_size = 3;
                $scope.agent_keyword = "";
                $scope.isJieyue = [];
                $scope.sendSmsId = '';//发送短信要传的id

                //右边列表数据初始化
                $scope.select_scene = function(page){
                    $scope.pagination_scene.select(page,globalFunction.generateUrlParams({'agentInfo.agent_code':$scope.agent_keyword+"!",print_status:"0",rolling:{chips_type:'2'},is_profit:"1",sort:'agent_code asc',is_print_show:"0"},{mainSceneProfit:{},mainSceneProfitTip:{},mainSceneProfitOutcapital:{},mainSceneProfitIncapital:{},agentGroupOwner:{}}))
                        .$promise.then(function(_mainScenes){
                            $scope.mainScenes = _mainScenes;
                        });
                };
                $scope.select_scene();

                //右边列表删除按钮
                $scope.delete = function (e) {
                    pinCodeModal(sceneRecordProfit, 'delete_sceneRecordProfit', {id:e.id}, '刪除成功！').then(function () {
                        $scope.select_scene();
                        $scope.rest();
                    })
                }

                //右边列表选择按钮
                $scope.choice = function(row){
                    $scope.profit_information = angular.copy($scope.profit_information_copy);
                    $scope.int_code = {
                        agent_name:row.agent_name,
                        agent_code:row.agent_code
                    }
                    $scope.show_type = [];
                    $scope.show_type_out = [];

                    $scope.profit_information.mainSceneProfit.marker_seqnumber = row.main_scene_no;//场次编号
                    $scope.profit_information.mainSceneProfit.main_scene_id = row.id;//主场次表的ID

                    if(row.mainSceneProfit.length == 0){ //新入場
                        $scope.profit_information.mainSceneProfitAgent[0].agent_code = row.agent_code;
                        $scope.profit_information.mainSceneProfitAgent[0].agent_name = row.agent_name;
                        $scope.profit_information.mainSceneProfitAgent[0].agent_info_id = row.agent_info_id;
                        $scope.get_now_time(1);
                    }else{
                        //判断是否截月新开场  $scope.isJieyue = [];
                        if(row.mainSceneProfit.length == 1){
                            $scope.isJieyue = row.mainSceneProfit;
                        }else{
                            $scope.isJieyue = _.filter(row.mainSceneProfit,function(j){ return j.is_shift_mark == 1});
                        }
                        //重新组装数据
                        $scope.profit_information.id = $scope.isJieyue[0].id;
                        $scope.profit_information.mainSceneProfit.is_shift_mark = $scope.isJieyue[0].is_shift_mark;//是否截更新開記錄:0不是1是
                        $scope.profit_information.mainSceneProfit.start_time = $scope.isJieyue[0].start_time;//开工时间
                        $scope.profit_information.mainSceneProfit.start_date = $scope.isJieyue[0].start_time.toString().substring(0,10);//开工日期
                        if($scope.isJieyue[0].end_time){
                            $scope.profit_information.mainSceneProfit.end_time = $scope.isJieyue[0].end_time;//离场时间
                            $scope.profit_information.mainSceneProfit.end_date = $scope.isJieyue[0].end_time.toString().substring(0,10);//离场日期
                        }
                        $scope.profit_information.mainSceneProfit.print_no = $scope.isJieyue[0].print_no;//单编号
                        $scope.profit_information.mainSceneProfit.id = $scope.isJieyue[0].id;
                        $scope.profit_information.mainSceneProfit.currency = $scope.isJieyue[0].currency;//币种
                        $scope.profit_information.mainSceneProfit.partone_startevent = $scope.isJieyue[0].partone_startevent;//三本封顶或者不封顶
                        $scope.profit_information.mainSceneProfit.parttwo_startevent = $scope.isJieyue[0].parttwo_startevent;//股本内或者股本外
                        $scope.profit_information.mainSceneProfit.type = $scope.isJieyue[0].type;//类型
                        $scope.profit_information.mainSceneProfit.partone_remark = $scope.isJieyue[0].partone_remark;//列印表一备注
                        $scope.profit_information.mainSceneProfit.parttwo_remark = $scope.isJieyue[0].parttwo_remark;//列印表二备注
                        $scope.profit_information.mainSceneProfit.guarantor = $scope.isJieyue[0].guarantor;//担保人
                        $scope.profit_information.mainSceneProfit.guarantee_amount = parseFloat($scope.isJieyue[0].guarantee_amount);//保证金
                        $scope.profit_information.mainSceneProfit.loss_win_amount = parseFloat($scope.isJieyue[0].loss_win_amount)?parseFloat($scope.isJieyue[0].loss_win_amount):0;//上下数
                        $scope.profit_information.mainSceneProfit.out_amount = parseFloat($scope.isJieyue[0].out_amount)?parseFloat($scope.isJieyue[0].out_amount):0;//离台数
                        $scope.profit_information.mainSceneProfit.rolling_amount = parseFloat($scope.isJieyue[0].rolling_amount)?parseFloat($scope.isJieyue[0].rolling_amount):0;//轉碼
                        $scope.profit_information.mainSceneProfit.shouldpay_from_agent = $scope.isJieyue[0].shouldpay_from_agent;//应收代理
                        $scope.profit_information.mainSceneProfit.shouldpay_to_agent = $scope.isJieyue[0].shouldpay_to_agent;//应付代理
                        $scope.profit_information.mainSceneProfit.total_commission = $scope.isJieyue[0].total_commission;//公司交收
                        $scope.profit_information.mainSceneProfit.total_consumption = $scope.isJieyue[0].total_consumption;//總消費數
                        $scope.profit_information.mainSceneProfit.company_actual_pay = $scope.isJieyue[0].company_actual_pay;//公司實際交收
                        $scope.profit_information.mainSceneProfit.is_shift_mark = $scope.isJieyue[0].is_shift_mark;//是否截更新开场
                        $scope.profit_information.mainSceneProfit.scene_no = $scope.isJieyue[0].scene_no;//場次

                        $scope.profit_information.mainSceneProfit.start_date = $scope.profit_information.mainSceneProfit.start_time.toString().substring(0,10);//离场日期
                        if($scope.profit_information.mainSceneProfit.end_time){
                            $scope.profit_information.mainSceneProfit.end_date = $scope.profit_information.mainSceneProfit.end_time.toString().substring(0,10);//离场日期
                        }
                        //户口
                        if(!$scope.isJieyue[0].print_no && $scope.isJieyue[0].is_shift_mark == 1){//截更新开场，列印2部分栏位应该为空值
                            _.each($scope.isJieyue[0].mainSceneProfitAgent,function(d){
                                //_.each($scope.profit_information.mainSceneProfitAgent,function(a,i){
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].main_scene_profit_id = d.main_scene_profit_id;
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].agent_info_id = d.agent_info_id;//即找户口(上)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].agent_code = d.agent_code;//即找户口编码(上)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].agent_name = d.agent_name;//即找户口姓名(上)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].percent = parseFloat(d.percent);//即找佔成(上)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].commission_total = parseFloat(d.commission_total);//即找碼佣份數(上)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].percent_profit = 0;//占成收益(下)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].commission = 0;//碼佣(下)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].consumption = 0;//消費數(下)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].agent_pay = 0;//代理交收(下)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].consumption = 0;//消費數(下)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].commission = 0;//碼傭(下)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].commission = 0;//碼傭(下)
                               // })
                            })
                            $scope.profit_information.mainSceneProfit.shouldpay_from_agent = 0;
                            $scope.profit_information.mainSceneProfit.shouldpay_to_agent = 0;
                            $scope.profit_information.mainSceneProfit.total_commission = 0;
                            $scope.profit_information.mainSceneProfit.total_consumption = 0;
                            $scope.profit_information.mainSceneProfit.company_actual_pay = 0;
                            $scope.profit_information.mainSceneProfit.parttwo_remark = "";//列印2备注
                        }else{
                            _.each($scope.isJieyue[0].mainSceneProfitAgent,function(d){
                                //_.each($scope.profit_information.mainSceneProfitAgent,function(a,i){
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].main_scene_profit_id = d.main_scene_profit_id;
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].agent_info_id = d.agent_info_id;//即找户口(上)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].agent_code = d.agent_code;//即找户口编码(上)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].agent_name = d.agent_name;//即找户口姓名(上)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].percent = parseFloat(d.percent);//即找佔成(上)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].commission_total = parseFloat(d.commission_total);//即找碼佣份數(上)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].percent_profit = d.percent_profit;//占成收益(下)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].commission = d.commission;//碼佣(下)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].consumption = parseFloat(d.consumption);//消費數(下)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].agent_pay = d.agent_pay;//代理交收(下)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].consumption = parseFloat(d.consumption);//消費數(下)
                                    $scope.profit_information.mainSceneProfitAgent[d.seqnumber].commission = d.commission;//碼傭(下)
                                //})
                            })
                        }

                        //入场本金
                        if($scope.isJieyue[0].mainSceneProfitIncapital.length>0){
                            $scope.isJieyue[0].mainSceneProfitIncapital = _.sortBy($scope.isJieyue[0].mainSceneProfitIncapital,"amount_seq");
                            _.each($scope.isJieyue[0].mainSceneProfitIncapital,function(d){
                                $scope.show_type.push(
                                    {
                                        intype: _.findWhere($scope.inSceneWords, {id: d.out_scene_word_type_id}).o_word, //outtype
                                        type_number: d.amount,
                                        amount_seq: d.amount_seq
                                    }
                                )
                                $scope.profit_information.incapital.push({
                                    out_scene_word_type_id: d.out_scene_word_type_id,
                                    amount: d.amount,
                                    amount_seq: d.amount_seq,
                                    main_scene_profit_id: d.main_scene_profit_id
                                })
                            })
                        }

                        //离场本金
                        if($scope.isJieyue[0].mainSceneProfitOutcapital.length>0){
                            $scope.isJieyue[0].mainSceneProfitOutcapital = _.sortBy($scope.isJieyue[0].mainSceneProfitOutcapital,"amount_seq");
                            _.each($scope.isJieyue[0].mainSceneProfitOutcapital,function(d){
                                $scope.show_type_out.push(
                                    {
                                        outtype_out:_.findWhere($scope.outSceneWords, {id: d.out_scene_word_operate_id}).o_word,
                                        intype_out: _.findWhere($scope.inSceneWords, {id: d.out_scene_word_type_id}).o_word, //outtype
                                        amount_seq: d.amount_seq,
                                        type_number_out: d.amount
                                    }
                                )
                                $scope.profit_information.outcapital.push({
                                    out_scene_word_type_id: d.out_scene_word_type_id,
                                    amount: d.amount,
                                    amount_seq: d.amount_seq,
                                    out_scene_word_operate_id: d.out_scene_word_operate_id,
                                    main_scene_profit_id: d.main_scene_profit_id
                                })
                            })
                        }

                        //茶资
                        if($scope.isJieyue[0].mainSceneProfitTip.length>0){
                            _.each($scope.isJieyue[0].mainSceneProfitTip,function(d){
                                $scope.profit_information.tip.push({amount:d.amount,main_scene_profit_id: d.main_scene_profit_id})
                            })
                        }
                    }
                }

                //監聽戶口 獲取id
                $scope.getCode = function(agent,i){
                    if(agent){
                        agentsLists.query({agent_code:agent}).$promise.then(function(agents){
                            if(agents.length == 1){
                                $scope.profit_information.mainSceneProfitAgent[i].agent_info_id = agents[0].id;
                            }else{
                                $scope.profit_information.mainSceneProfitAgent[i].agent_info_id = "";
                            }
                        });
                    }

                }

                //获取入场本金的类型和操作
                outSceneWord.query().$promise.then(function (_outSceneWord) {
                    $scope.inSceneWords = _.where(_outSceneWord, {type: "1"});//類型
                    $scope.outSceneWords = _.where(_outSceneWord, {type: "0"});//操作
                });

                //mainSceneProfit 列表增加
                $scope.add_type = function () {
                    if(!$scope.intype.id){
                        topAlert.warning("請填寫入場本金類型！");
                        return;
                    }
                    if($scope.type_number){
                        var _length = _.size($scope.show_type);//序号赋值
                        console.log(_length)
                        $scope.show_type.push(
                            {
                                intype:$scope.intype.o_word,
                                amount_seq:_length?_length:0,//序號
                                type_number:$scope.type_number
                            }
                        )
                        $scope.profit_information.incapital.push({
                            out_scene_word_type_id:$scope.intype.id,
                            amount:$scope.type_number,
                            amount_seq:_length?_length:0
                        })
                        $scope.intype = _.findWhere($scope.inSceneWords, {o_word: ""});
                        $scope.outtype = _.findWhere($scope.outSceneWords, {o_word: ""});
                        $scope.type_number = "";
                    }else{
                        topAlert.warning("請填寫本金金額！")
                    }
                    $scope.count_loss_win();//计算上下数
                    $scope.num_total();
                };

                //part2 列表增加
                $scope.add_type_out = function () {
                    if(!$scope.intype_out.id || !$scope.outtype_out.id){
                        topAlert.warning("請填寫本金操作或類型！");
                        return;
                    }
                    if($scope.type_number_out){
                        var _length = _.size($scope.show_type_out);//序号赋值
                        $scope.show_type_out.push({
                                intype_out:$scope.intype_out.o_word,
                                outtype_out:$scope.outtype_out.o_word,
                                type_number_out:$scope.type_number_out,
                                amount_seq:_length?_length:0
                            }
                        )
                        $scope.profit_information.outcapital.push({
                            out_scene_word_type_id:$scope.intype_out.id,
                            amount:$scope.type_number_out,
                            out_scene_word_operate_id:$scope.outtype_out.id,
                            amount_seq:_length?_length:0
                        });
                        $scope.intype_out = _.findWhere($scope.inSceneWords, {o_word: ""});
                        $scope.outtype_out = _.findWhere($scope.outSceneWords, {o_word: ""});
                        $scope.type_number_out = "";
                    }else{
                        topAlert.warning("請填寫離場本金金額！")
                    }
                    $scope.count_loss_win();
                    $scope.num_total();
                };

                //mainSceneProfit 列表減少
                $scope.cut_type = function (e,index) {
                    $scope.show_type.splice(index,1);
                    $scope.profit_information.incapital.splice(index,1);
                    _.each($scope.show_type,function(d,i){
                        d.amount_seq = i;
                    })
                    _.each($scope.profit_information.incapital,function(d,i){
                        d.amount_seq = i;
                    })
                    $scope.count_loss_win();
                    $scope.num_total();
                }

                //离场本金列表減少
                $scope.cut_type_out = function (e,index) {
                    $scope.show_type_out.splice(index,1);
                    $scope.profit_information.outcapital.splice(index,1);
                    $scope.count_loss_win();
                    $scope.num_total();
                }

                //增加茶資
                $scope.add_tip = function () {
                    if($scope.tip){
                        $scope.profit_information.tip.push({amount:$scope.tip});
                        $scope.tip = "";
                    }else{
                        topAlert.warning("請填寫茶資金額！");
                    }
                    $scope.count_loss_win();
                    $scope.num_total();
                };
                //删除茶資
                $scope.cut_tip = function (e,index) {
                    $scope.profit_information.tip.splice(index,1);
                    $scope.count_loss_win();
                    $scope.num_total();
                };

                //點擊現時時間
                $scope.get_now_time = function (d) {
                    var myDate = new Date();
                    var time = $filter('date')(myDate, 'yyyy-MM-dd HH:mm');
                    var date = $filter('date')(myDate, 'yyyy-MM-dd');
                    if(d == 1){
                        $scope.profit_information.mainSceneProfit.start_time = time;
                        $scope.profit_information.mainSceneProfit.start_date = date;
                    }else{
                        $scope.profit_information.mainSceneProfit.end_time = time;
                        $scope.profit_information.mainSceneProfit.end_date = date;
                    }
                }

                //計算上下數
                $scope.count_loss_win = function(){
                    //上下數 = [(開埸本金總數 - 離埸本金總數)*(-1)] + 茶資總數
                    var tip_total = 0;
                    $scope.profit_information.mainSceneProfit.out_capital_total = 0;
                    $scope.profit_information.mainSceneProfit.in_capital_total =0;
                    $scope.profit_information.mainSceneProfit.loss_win_amount = 0;
                    _.each($scope.show_type, function (e,index) {
                        $scope.profit_information.mainSceneProfit.in_capital_total =parseFloat($scope.profit_information.mainSceneProfit.in_capital_total) + parseFloat(e.type_number);
                    })
                    _.each($scope.show_type_out, function (e,index) {
                        $scope.profit_information.mainSceneProfit.out_capital_total =parseFloat($scope.profit_information.mainSceneProfit.out_capital_total) + parseFloat(e.type_number_out);
                    })
                    _.each($scope.profit_information.tip, function (e_amount) {
                        tip_total = parseFloat(tip_total)+parseFloat(e_amount.amount);
                    })
                    $scope.profit_information.mainSceneProfit.loss_win_amount = fixedNumber.fixed4($scope.profit_information.mainSceneProfit.out_capital_total -  $scope.profit_information.mainSceneProfit.in_capital_total + tip_total);
                    $scope.profit_information.mainSceneProfit.loss_win_amount = $scope.profit_information.mainSceneProfit.loss_win_amount?$scope.profit_information.mainSceneProfit.loss_win_amount:0;
                }

                //各种计算
                $scope.num_total = function(){
                    $scope.count_loss_win();//先计算一下上下数
                    var total_commission_total = 0;//所有的佔成
                    var total_percent_profit = 0;//所有的佔成收益
                    var total_commission = 0;//所有的码佣
                    var total_consumption = 0;//总消费
                    var total_outAmount = 0;//所有的离场本金
                    var total_tip = 0;//所有的茶资
                    total_commission_total = _.reduce($scope.profit_information.mainSceneProfitAgent, function(memo, num){return memo + (parseFloat(num.percent)?parseFloat(num.percent):0) },0);
                    _.each($scope.profit_information.mainSceneProfitAgent,function(d,i){
                        if(d.agent_info_id && d.agent_code){
                            if(d.percent && d.percent!=0){
                                //佔成收益 = 上下數 * 佔成% *(-1) 。以萬為單位, 最多4位小數。
                                d.percent_profit = parseFloat(parseFloat($scope.profit_information.mainSceneProfit.loss_win_amount * d.percent/100*(-1)).toFixed(4));

                                //碼佣 = 轉碼數 * 碼傭份數/總佔成*佔成/10000 以萬為單位, 四舍五入
                                d.commission = parseFloat(parseFloat($scope.profit_information.mainSceneProfit.rolling_amount * d.commission_total/total_commission_total * d.percent/10000).toFixed(3));
                            }
                            //代理交收 =佔成收益 - 碼佣 - 消費數
                            d.agent_pay = parseFloat(parseFloat(d.percent_profit - d.commission - d.consumption).toFixed(4));
                        }else{
                            d.percent_profit = 0;
                            d.commission = 0;
                            d.consumption = 0;
                        }
                    })
                    if($scope.show_type_out.length > 0){
                        total_outAmount = _.reduce($scope.show_type_out, function(memo, num){return memo + (parseFloat(num.type_number_out)?parseFloat(num.type_number_out):0) },0);
                    }
                    if($scope.profit_information.tip.length > 0){
                        total_tip = _.reduce($scope.profit_information.tip, function(memo, num){return memo + (parseFloat(num.amount)?parseFloat(num.amount):0) },0);
                    }
                    $scope.profit_information.mainSceneProfit.out_amount = parseFloat(parseFloat(total_outAmount + total_tip).toFixed(4));//离台数

                    total_percent_profit = _.reduce($scope.profit_information.mainSceneProfitAgent, function(memo, num){return memo + (parseFloat(num.percent_profit)?parseFloat(num.percent_profit):0) },0);
                    total_commission = _.reduce($scope.profit_information.mainSceneProfitAgent, function(memo, num){return memo + (parseFloat(num.commission)?parseFloat(num.commission):0) },0);
                    total_consumption = _.reduce($scope.profit_information.mainSceneProfitAgent, function(memo, num){return memo + (parseFloat(num.consumption)?parseFloat(num.consumption):0) },0);

                    //代理应收和代理应付
                    if(parseFloat($scope.profit_information.mainSceneProfit.loss_win_amount) > 0){
                        $scope.profit_information.mainSceneProfit.shouldpay_from_agent = Math.abs(Math.ceil(total_percent_profit*10000)/10000);
                        $scope.profit_information.mainSceneProfit.shouldpay_to_agent = 0;
                    }else{
                        $scope.profit_information.mainSceneProfit.shouldpay_from_agent = 0;
                        $scope.profit_information.mainSceneProfit.shouldpay_to_agent = Math.abs(Math.ceil(total_percent_profit*10000)/10000);
                    }

                    //公司交收 = 所有的佔成收益 - 所有的码佣
                    $scope.profit_information.mainSceneProfit.total_commission = total_commission.toFixed(4);//總碼傭
                    $scope.profit_information.mainSceneProfit.total_consumption = Math.ceil(total_consumption * 10000)/10000;//总消费
                    $scope.profit_information.mainSceneProfit.company_actual_pay = parseFloat((total_percent_profit -total_consumption) * -1).toFixed(4);
                }


                //重置
                $scope.rest = function(){
                    $scope.profit_information = angular.copy($scope.profit_information_copy);
                    $scope.show_type = [];
                    $scope.show_type_out = [];
                    $scope.outtype = "";
                    $scope.outtype_out = "";
                    $scope.intype = "";
                    $scope.intype_out = "";
                    $scope.type_number = "";
                    $scope.type_number_out = "";
                    $scope.is_shift_mark_status = false;//是否截月
                    $scope.partone_pin_code = "";//列印表一密码
                    $scope.parttwo_pin_code = "";//列印表二密码
                    $scope.int_code = {
                        agent_name:"",
                        agent_code:""
                    }
                }

                //列印表一提交
                $scope.submit_one = function(){
                    if(!$scope.profit_information.mainSceneProfit.print_no){
                        topAlert.warning("單編號 不能為空！");
                        return;
                    }
                    /*if($scope.profit_information.mainSceneProfit.type == 2){
                        if(!$scope.profit_information.mainSceneProfit.parttwo_startevent){
                            topAlert.warning("類型為貸款的需選擇開工條件為股本內或股本外！");
                            return;
                        }
                    }*/
                    //格式化一下时间入库 ,当修改时间了，格式会变
                    if($scope.profit_information.mainSceneProfit.start_time){
                        $scope.profit_information.mainSceneProfit.start_time = $filter('date')($scope.profit_information.mainSceneProfit.start_time, 'yyyy-MM-dd HH:mm');
                        $scope.profit_information.mainSceneProfit.start_time =  $filter('date')($scope.profit_information.mainSceneProfit.start_date, 'yyyy-MM-dd') +" "+ $scope.profit_information.mainSceneProfit.start_time.substring(11,16);
                    }
                    //密码赋值
                    $scope.profit_information.pin_code =  $scope.partone_pin_code;
                    $scope.profit_information_submit = angular.copy($scope.profit_information);
                    //过滤没有填写户口的
                    $scope.profit_information_submit.mainSceneProfitAgent = _.filter($scope.profit_information_submit.mainSceneProfitAgent,function(d){ return d.agent_info_id !=""&&d.agent_code !=""});
                    _.each($scope.profit_information_submit.mainSceneProfitAgent,function(d){//主要是预防填写空值
                            d.percent = d.percent? d.percent:0;
                            d.commission_total = d.commission_total? d.commission_total:0;
                            d.consumption = d.consumption? d.consumption:0;
                    })
                    //正式提交
                    sceneRecordProfit.send_sceneRecordProfit($scope.profit_information_submit).$promise.then(function (data) {
                        topAlert.success("保存成功！");
                        $scope.select_scene();
                        $scope.isSend = true;//禁用发送短信按钮
                        $scope.rest();
                    },function(error){
                        if(!error.data.code && error.data.code != 0){
                            for(var key in error.data){
                                topAlert.warning(error.data[key]);
                            }
                        }
                    })
                }

                //列印表二提交
                $scope.submit_two = function(){
                    if(!$scope.profit_information.mainSceneProfit.print_no){
                        topAlert.warning("單編號 不能為空！");
                        return;
                    }
                    $scope.profit_information.mainSceneProfit.start_time = $filter('date')($scope.profit_information.mainSceneProfit.start_time, 'yyyy-MM-dd HH:mm');
                    if($scope.profit_information.id){
                        if($scope.profit_information.mainSceneProfit.end_time){
                            $scope.profit_information.mainSceneProfit.end_time = $filter('date')($scope.profit_information.mainSceneProfit.end_time, 'yyyy-MM-dd HH:mm');
                            $scope.profit_information.mainSceneProfit.end_time = $filter('date')($scope.profit_information.mainSceneProfit.end_date, 'yyyy-MM-dd')+" " + $scope.profit_information.mainSceneProfit.end_time.substring(11,16);

                            var t1 = new Date($scope.profit_information.mainSceneProfit.start_time);
                            var t2 = new Date($scope.profit_information.mainSceneProfit.end_time);
                            if(t1 > t2){
                                topAlert.warning("開場時間不能大於離場時間！");
                                return false;
                            }
                        }else{
                            $scope.profit_information.mainSceneProfit.end_time = "";
                        }

                        $scope.profit_information.pin_code =  $scope.parttwo_pin_code;
                        $scope.profit_information_submit = angular.copy($scope.profit_information);
                        //过滤没有填写户口的
                        $scope.profit_information_submit.mainSceneProfitAgent = _.filter($scope.profit_information_submit.mainSceneProfitAgent,function(d){ return d.agent_info_id !=""})
                        _.each($scope.profit_information_submit.mainSceneProfitAgent,function(d){//主要是预防填写空值
                            d.percent = d.percent? d.percent:0;
                            d.commission_total = d.commission_total? d.commission_total:0;
                            d.consumption = d.consumption? d.consumption:0;
                        })
                        sceneRecordProfit.update($scope.profit_information_submit).$promise.then(function (data) {
                            topAlert.success("保存成功！");
                            $scope.rest();
                            $scope.select_scene();
                        },function(error){
                            if(!error.data.code && error.data.code != 0){
                                for(var key in error.data){
                                    topAlert.warning(error.data[key]);
                                }
                            }
                        })
                    }
                }

                //離場
                $scope.out_scene = function () {
                    if(!$scope.profit_information.mainSceneProfit.end_time){
                        topAlert.warning("請填寫完場時間");
                        return false;
                    }else{
                        $scope.profit_information.mainSceneProfit.end_time = $filter('date')($scope.profit_information.mainSceneProfit.end_time, 'yyyy-MM-dd HH:mm');
                        $scope.profit_information.mainSceneProfit.end_time = $filter('date')($scope.profit_information.mainSceneProfit.end_date, 'yyyy-MM-dd')+" " + $scope.profit_information.mainSceneProfit.end_time.substring(11,16);
                        var t1 = new Date($scope.profit_information.mainSceneProfit.start_time);
                        var t2 = new Date($scope.profit_information.mainSceneProfit.end_time);
                        if(t1 > t2){
                            topAlert.warning("開場時間不能大於離場時間！");
                            return false;
                        }else{
                            //是否截月
                            if($scope.profit_information.mainSceneProfit.is_shift_mark == 1 && $scope.is_shift_mark_status){
                                topAlert.warning("該場次已截月");
                                return false;
                            }
                            if($scope.is_shift_mark_status){
                                $scope.profit_information.is_shift_mark = "1";//是否截更新開記錄:0不是1是
                                $scope.profit_information.pin_code =  $scope.parttwo_pin_code;//密码赋值
                                $scope.profit_information_submit = angular.copy($scope.profit_information);
                                //过滤没有填写户口的
                                $scope.profit_information_submit.mainSceneProfitAgent = _.filter($scope.profit_information_submit.mainSceneProfitAgent,function(d){ return d.agent_info_id !=""})
                                _.each($scope.profit_information_submit.mainSceneProfitAgent,function(d){//主要是预防填写空值
                                    d.percent = d.percent? d.percent:0;
                                    d.commission_total = d.commission_total? d.commission_total:0;
                                    d.consumption = d.consumption? d.consumption:0;
                                })
                                sceneRecordProfit.update($scope.profit_information_submit).$promise.then(function (data) {
                                    sceneRecordProfit.printdelete({
                                        is_shift_mark: 1,
                                        id: $scope.profit_information_submit.mainSceneProfit.main_scene_id,
                                        data: $scope.profit_information_submit,
                                        pin_code: $scope.parttwo_pin_code
                                    }).$promise.then(function (data) {
                                            topAlert.success('離場成功!');
                                            $scope.select_scene();
                                            $scope.rest();
                                        },function(error){
                                            if(!error.data.code && error.data.code != 0){
                                                for(var key in error.data){
                                                    topAlert.warning(error.data[key]);
                                                }
                                            }
                                        })
                                })
                            }else{
                                $scope.profit_information.is_shift_mark = "0";//是否截更新開記錄:0不是1是
                                $scope.profit_information.pin_code =  $scope.parttwo_pin_code;//密码赋值
                                $scope.profit_information_submit = angular.copy($scope.profit_information);
                                //过滤没有填写户口的
                                $scope.profit_information_submit.mainSceneProfitAgent = _.filter($scope.profit_information_submit.mainSceneProfitAgent,function(d){ return d.agent_info_id !=""})
                                _.each($scope.profit_information_submit.mainSceneProfitAgent,function(d){//主要是预防填写空值
                                    d.percent = d.percent? d.percent:0;
                                    d.commission_total = d.commission_total? d.commission_total:0;
                                    d.consumption = d.consumption? d.consumption:0;
                                })
                                sceneRecordProfit.update($scope.profit_information_submit).$promise.then(function (data) {
                                    sceneRecordProfit.printdelete({
                                        is_shift_mark: 0,
                                        id: $scope.profit_information_submit.mainSceneProfit.main_scene_id,
                                        data: $scope.profit_information_submit,
                                        pin_code: $scope.parttwo_pin_code
                                    }).$promise.then(function (data) {
                                            topAlert.success('離場成功!');
                                            $scope.select_scene();
                                            $scope.rest();
                                        },function(error){
                                            if(!error.data.code && error.data.code != 0){
                                                for(var key in error.data){
                                                    topAlert.warning(error.data[key]);
                                                }
                                            }
                                        })
                                })
                            }
                        }
                    }
                }

                //列印
                $scope.printSubmit = function(){
                    $scope.total_amount = "";//列印本金
                    _.each($scope.show_type,function(d){
                        $scope.total_amount += parseFloat(d.type_number) + '萬' + d.intype + ' + ';
                    })
                    var reg = /\+ $/gi;
                    $scope.total_amount = $scope.total_amount.replace(reg,"");
                    if($scope.profit_information.mainSceneProfit.main_scene_id){
                        $scope.printPart = {
                            agent_code:$scope.int_code.agent_code?$scope.int_code.agent_code:"",//户口编码
                            agent_name:$scope.int_code.agent_name?$scope.int_code.agent_name:"",//户口姓名
                            start_date:$scope.profit_information.mainSceneProfit.start_date?$scope.profit_information.mainSceneProfit.start_date:"",//开工日期
                            start_time:$scope.profit_information.mainSceneProfit.start_time?$scope.profit_information.mainSceneProfit.start_time:"",//开工时间
                            amount:$scope.total_amount,//本金
                            add_amount:"",//加本金
                            guarantee_amount:$scope.profit_information.mainSceneProfit.guarantee_amount?$scope.profit_information.mainSceneProfit.guarantee_amount:"",//保证金
                            end_date:$scope.profit_information.mainSceneProfit.end_date?$scope.profit_information.mainSceneProfit.end_date:"",//完工日期
                            end_time:$scope.profit_information.mainSceneProfit.end_time?$scope.profit_information.mainSceneProfit.end_time:"",//完工时间
                            loss_win_amount:$scope.profit_information.mainSceneProfit.loss_win_amount?$scope.profit_information.mainSceneProfit.loss_win_amount:"",//客上下数
                            out_amount:$scope.profit_information.mainSceneProfit.out_amount?$scope.profit_information.mainSceneProfit.out_amount:"",//离台数
                            rolling_amount:$scope.profit_information.mainSceneProfit.rolling_amount?$scope.profit_information.mainSceneProfit.rolling_amount:"",//转码数
                            shouldpay_agent:$scope.profit_information.mainSceneProfit.shouldpay_from_agent!=0?parseFloat($scope.profit_information.mainSceneProfit.shouldpay_from_agent):parseFloat($scope.profit_information.mainSceneProfit.shouldpay_to_agent),//应收代理
                            actual_pay:"",//实收
                            return_MK:"",//回MK  备注
                            cash:[], //CASH
                            tip:[],//茶资
                            temporary_storage:[],//暂存
                            type:"3",//全部列印
                            isMarker:true//列印的是是贷款还是现金
                        }
                        $scope.printPart.start_date = $filter('date')($scope.printPart.start_date,'yyyy-MM-dd');
                        $scope.printPart.start_time = ($filter('date')($scope.printPart.start_time,'yyyy-MM-dd')).substring(11,16);
                        $scope.printPart.end_date = $filter('date')($scope.printPart.end_date, 'yyyy-MM-dd');
                        $scope.printPart.end_time = ($filter('date')($scope.printPart.end_time, 'yyyy-MM-dd')).substring(11,16);
                        //茶资
                        _.each($scope.profit_information.tip, function (e) {
                            $scope.printPart.tip.push(parseFloat(e.amount));
                        })
                        //备注


                        if($scope.profit_information.mainSceneProfit.type == 1){ //现金
                            $scope.printPart.isMarker = false;
                            $scope.return_MKS = [];
                            $scope.return_MKS = _.filter($scope.profit_information.mainSceneProfitAgent,function(d){return d.agent_code!=""});
                            _.each($scope.return_MKS,function(d){
                                $scope.printPart.return_MK += d.agent_code + " " + "佔" + d.percent + "%" + "" + ",";
                            })
                            var reg1 = /,$/gi;
                            $scope.printPart.return_MK = $scope.printPart.return_MK.replace(reg1,"");//去除最后一个逗号
                        }else{ //贷款
                            $scope.printPart.isMarker = true;
                            $scope.printPart.return_MK = "";
                        }

                        qzPrinter.print('ProfitPrint', printerType.stylusPrinter, $scope.printPart).then(function () {
                            topAlert.success('列印成功');
                        });
                    }else{
                        topAlert.warning('請選擇場次！');
                        return;
                    }
                }

                //保存成功发送短信
                $scope.SMSsend = function (type) {
                    $scope.containA = '1';//是否发送A数短信，0发送  1不发送
                    $scope.iScontroller = 'dailiOneSmsCtrl';//选择进入那个控制器 默认是 dailiOneSmsCtrl
                    $scope.isHas = [];//开场户口是否有佔成
                    $scope.isHas = _.filter($scope.profit_information.mainSceneProfitAgent,function(d){ return d.agent_code == $scope.int_code.agent_code;});
                    if($scope.isHas.length > 0){
                        $scope.containA = '1';
                        $scope.iScontroller = 'dailiOneSmsCtrl';
                    }else{
                        $scope.containA = '0';
                        $scope.iScontroller = 'changMianSmsCtrl';
                    }

                    sceneRecordProfit.sendSms({id:$scope.profit_information.id,type:type,containA:$scope.containA}).$promise.then(function(e){
                        var modalInstance;
                        modalInstance = $modal.open({
                            templateUrl: "views/profit-share/profit-confirm.html",
                            controller: $scope.iScontroller,
                            resolve: {
                                sendType:function(){
                                    return type;
                                },
                                data :function () {
                                    return e;
                                }
                            }
                        });
                        modalInstance.result.then(function (status) {

                        });
                    })
                }


            }]).controller('profitShareListCtrl',['$scope','mainSceneProfit','user','$timeout','tmsPagination','fixedNumber','globalFunction','breadcrumb','$filter','sceneRecordProfit','pinCodeModal','topAlert','agentsLists',
            function($scope,mainSceneProfit,user,$timeout,tmsPagination,fixedNumber,globalFunction,breadcrumb,$filter,sceneRecordProfit,pinCodeModal,topAlert,agentsLists){
                //分成記錄

                //麵包屑導航
                breadcrumb.items = [
                    {"name":"分成記錄","active":true}
                ];

                $scope.isCheck = false;//是否确认离场
                $scope.suerArr = [];//选择离场的ID

                $scope.sreach_item = {
                    //agent_group_name:"",//户组
                    shiftMark:{
                        year_month:""
                    },
                    print_no:"",//单编号
                    status:"",
                    //is_type:"0",//是否包含内股 0不包含
                    start_time:["",""],
                    mainScene:{
                        print_status:0,
                        agent_code:""
                    },
                    recentlyLoanDeposit:{
                        seqnumber:"" //贷款单号
                    }
                }
                $scope.copy_sreach_item = angular.copy($scope.sreach_item);
                $scope.excel_condition = {
                    agent_code:$scope.sreach_item.mainScene.agent_code,
                    year_month:"",
                    statrt_date_time:$scope.sreach_item.start_time[0],
                    end_date_time:$scope.sreach_item.start_time[1],
                    marker_seqnumber:$scope.sreach_item.recentlyLoanDeposit.seqnumber,
                    hall_id:"",
                    status:"",
                    print_no:"",
                }
                $scope.pagination_scene = tmsPagination.create();
                $scope.pagination_scene.resource = mainSceneProfit;
                $scope.agent_keyword = "";
                $scope.isGroup = false;

                //修改备注
                $scope.updateagent = function (e) {
                    pinCodeModal(sceneRecordProfit, 'updateagent', {id: e.id,rcd_remark: e.rcd_remark}, '修改成功！').then(function (aaa) {
                        $scope.select_scene();
                    })
                }

                //獲取右邊數據
                $scope.select_scene = function(page){
                     $scope.suerArr = [];
                     $scope.sreach_item_information = angular.copy($scope.sreach_item);

                    if($scope.sreach_item.shiftMark.year_month){
                        $scope.sreach_item_information.shiftMark.year_month =  $filter('date')($scope.sreach_item.shiftMark.year_month, 'yyyy-MM')+ "-01";
                    }
                    $scope.sreach_item_information.start_time[0] =  $filter('date')($scope.sreach_item.start_time[0], 'yyyy-MM-dd');
                    $scope.sreach_item_information.start_time[1] =  $filter('date')($scope.sreach_item.start_time[1], 'yyyy-MM-dd');
                    $scope.excel_condition.hall_id =user.hall.id;
                    $scope.excel_condition.agent_code =$scope.sreach_item_information.mainScene.agent_code;
                    $scope.excel_condition.status =$scope.sreach_item_information.status;
                    $scope.excel_condition.print_no =$scope.sreach_item_information.print_no;
                    $scope.excel_condition.year_month =$filter('date')($scope.sreach_item.shiftMark.year_month, 'yyyy-MM');
                    $scope.excel_condition.statrt_date_time =$scope.sreach_item_information.start_time[0];
                    $scope.excel_condition.end_date_time =$scope.sreach_item_information.start_time[1];
                    $scope.excel_condition.marker_seqnumber =$scope.sreach_item_information.recentlyLoanDeposit.seqnumber;
                    $scope.mainScenes =$scope.pagination_scene.select(page,globalFunction.generateUrlParams($scope.sreach_item_information,{recentlyLoanDeposit:{},mainSceneProfitOutcapital:{},mainSceneProfitIncapital:{},mainSceneProfitTip:{},mainScene:{}}));
                    $scope.mainScenes.$promise.then(function(_mainScenes){
                        //處理相應數據，放到列表的數據
                            $scope.type_marker = "";//本金类型
                            $scope.seqnumber ="";//贷款单号
                            $scope.total_amount =　0;
                            $scope.mom_face_commission_ratio = "0";
                            $scope.code_commission_balance1 = 0;
                            $scope.code_commission_balance2 = 0;
                            $scope.dailiyong = 0;
                            $scope.zzc = 0;//总佔成
                            $scope.loss_win_amount_total = 0;//总上下数
                            $scope.rolling_amount_total = 0;//总转码数

                            _.each(_mainScenes, function (data,index) {
                                $scope.zzc = 0;//总佔成
                                //定义一个数组存放代理户口和股东户口的所有数据
                                data.group_code = [{
                                        agent_code:"",//户口
                                        agent_pay:"0",//代理交收
                                        consumption:"0",//消费数
                                        percent_profit:"0",//佔成收益
                                        percent:"0",//佔成
                                        commission:"0",//码佣佣金
                                        commission_total:"0",//码佣份数
                                        seqnumber:"0"
                                    },
                                    {
                                        agent_code:"",//户口
                                        agent_pay:"0",//代理交收
                                        consumption:"0",//消费数
                                        percent_profit:"0",//佔成收益
                                        percent:"0",//佔成
                                        commission:"0",//码佣佣金
                                        commission_total:"0",//码佣份数
                                        seqnumber:"1"
                                    },
                                    {
                                        agent_code:"",//户口
                                        agent_pay:"0",//代理交收
                                        consumption:"0",//消费数
                                        percent_profit:"0",//佔成收益
                                        percent:"0",//佔成
                                        commission:"0",//码佣佣金
                                        commission_total:"0",//码佣份数
                                        seqnumber:"2"
                                    },
                                    {
                                        agent_code:"",//户口
                                        agent_pay:"0",//代理交收
                                        consumption:"0",//消费数
                                        percent_profit:"0",//佔成收益
                                        percent:"0",//佔成
                                        commission:"0",//码佣佣金
                                        commission_total:"0",//码佣份数
                                        seqnumber:"3"
                                    }
                                ]
                                if(data.is_shift_mark == 1){
                                    data.mainScene.print_no =  data.mainScene.settlemonth_print_no;
                                }

                                if(data.rolling_amount != 0 && data.rolling_amount != null){
                                    $scope.rolling_amount_total += parseFloat(data.rolling_amount);
                                }

                                if(data.loss_win_amount != 0 && data.loss_win_amount != null){
                                    $scope.loss_win_amount_total += parseFloat(data.loss_win_amount);
                                }

                                //对代理户口和股东排序
                                data.mainSceneProfitAgent = _.sortBy(data.mainSceneProfitAgent,function(p){
                                    return p.seqnumber
                                })
                                _.each(data.mainSceneProfitAgent,function(x){
                                    $scope.zzc += parseFloat(x.percent);//总佔成计算
                                    data.group_code[x.seqnumber] = x;//相对应的户口
                                })
                                if(data.loss_win_amount == 0 || !data.loss_win_amount){//如果没有上下数，其它应为0
                                    _.each(data.group_code,function(r){
                                        data.company_actual_pay = r.agent_pay = r.consumption = r.commission = r.percent_profit = 0;
                                    })
                                }
                                data.zzc = $scope.zzc?$scope.zzc:"";//总佔成
                                _.each(data.mainSceneProfitIncapital, function (e) {
                                    if($scope.type_marker) {
                                        $scope.type_marker = $scope.type_marker + "," + e.out_scene_word_type_name;
                                    }else{
                                        $scope.type_marker = e.out_scene_word_type_name;
                                    }
                                    $scope.total_amount = parseFloat($scope.total_amount) + parseFloat(e.amount);
                                })
                                //贷款单号
                                _.each(data.recentlyLoanDeposit, function (e) {
                                    if($scope.seqnumber) {

                                        $scope.seqnumber = $scope.seqnumber + "," + e.seqnumber;
                                    }else{
                                        $scope.seqnumber = e.seqnumber;
                                    }
                                })

                                //列表显示新增还是修改按钮
                                if(data.rcd_remark){
                                    data.isShow = true;
                                }else{
                                    data.isShow = false;
                                }
                                if(data.status == 1){
                                    data.scene_status = "開場"
                                }else if(data.status == 2){
                                    data.scene_status = "離場"
                                }else{
                                    data.scene_status = "已確認"
                                }

                                data.yesCheck = false;
                                data.total_amount = fixedNumber.fixed4($scope.total_amount);
                                data.type_marker = $scope.type_marker;
                                var reg = /,$/gi;
                                data.seqnumber = $scope.seqnumber.replace(reg,"");//去掉最后的逗号
                                $scope.total_amount =　0;
                                data.rolling_amount = data.rolling_amount?data.rolling_amount:0;
                                data.loss_win_amount = data.loss_win_amount?data.loss_win_amount:0;
                                $scope.type_marker = "";
                                $scope.seqnumber = "";
                            })
                        });
                }
                $scope.select_scene();
                //回滚
                $scope.rollback = function (e) {
                    pinCodeModal(sceneRecordProfit, 'printrollback', {main_scene_id: e.mainScene.id,is_shift_mark: e.is_shift_mark,main_scene_profit_id: e.id}, '回滾成功！').then(function () {
                        $scope.select_scene();
                    })
                }
                $scope.reset = function(){
                    $scope.sreach_item = angular.copy($scope.copy_sreach_item);
                    $scope.isGroup = false;
                    $scope.select_scene();
                }



                //选择离场场次
                $scope.isSelect = function(bool){
                    $scope.suerArr = [];
                    $scope.isCheck = true;
                    if(bool){
                        _.each($scope.mainScenes,function(d){
                            if(d.status == 2){
                                d.yesCheck = true;
                                $scope.suerArr.push(d.id);
                            }
                        })
                    }else{
                        _.each($scope.mainScenes,function(d){
                            d.yesCheck = false;
                            $scope.suerArr = [];
                        })
                    }
                }

                //单个确认选择
                $scope.yesSelect = function(bool,index){
                    $scope.suerArr = [];
                    $scope.isCheck = false;
                    _.each($scope.mainScenes,function(d){
                        if(d.yesCheck){
                            $scope.suerArr.push(d.id);
                        }
                    })
                }

                //确认  --已经确认的不能回滚了--
                $scope.suer = function () {
                    console.log($scope.suerArr)
                    if($scope.suerArr.length == 0){
                        topAlert.warning("請選擇離場場次！");
                        return false;
                    }
                    pinCodeModal(sceneRecordProfit, 'sure', {id:$scope.suerArr}, '確認成功！').then(function () {
                        $scope.suerArr = [];
                        $scope.select_scene();
                    })
                }

            }]).controller('dailiOneSmsCtrl',['$scope','$modalInstance','$modal','SimplizedorFt','sceneRecordProfit','data','topAlert',function($scope,$modalInstance,$modal,SimplizedorFt,sceneRecordProfit,data,topAlert){
            //console.log(sendType);//1是开场  0是离场  2是加彩
            $scope.disabled_submit = false;//是否禁用发送按钮

            //定义几个数组接收短信
            $scope.daili1 = _.filter(data.smsBodyModelList,function(d){return d.layer == 0;})//代理1短信
            $scope.daili2 = _.filter(data.smsBodyModelList,function(d){return d.layer == 1;})//代理2短信
            $scope.daili3 = _.filter(data.smsBodyModelList,function(d){return d.layer == 2;})//代理3短信
            $scope.gudong4 = _.filter(data.smsBodyModelList,function(d){return d.layer == 3;})//股东短信

            //定义几个数组接收电话号码
            $scope.daili1_tel = _.filter(data.telNumberModelList,function(d){return d.layer == 0;})//代理1短信
            $scope.daili2_tel = _.filter(data.telNumberModelList,function(d){return d.layer == 1;})//代理2短信
            $scope.daili3_tel = _.filter(data.telNumberModelList,function(d){return d.layer == 2;})//代理3短信
            $scope.gudong4_tel = _.filter(data.telNumberModelList,function(d){return d.layer == 3;})//股东短信

            if($scope.daili1_tel.length == 0){
                $scope.disabled_submit = true;//是否禁用发送按钮
            }else{
                $scope.disabled_submit = false;//是否禁用发送按钮
            }

            //页面显示的
            $scope.sms = {
                agent_code:$scope.daili1.length > 0?$scope.daili1[0].agentCode:"",
                agent_name:$scope.daili1.length > 0?$scope.daili1[0].agentContactName:"",
                content:$scope.daili1.length > 0?$scope.daili1[0].content:"",
                phoneNumber:$scope.daili1_tel
            }

            //传给后台的
            $scope.send_sms = {
                pin_code: "",
                smsBodyModelList:$scope.daili1
            }

            //定義一個變量，監控是否修改短信內容
            $scope.$watch('sms.content',function(newValue){
                if(newValue){
                    _.each($scope.send_sms.smsBodyModelList,function(d){
                        d.content = newValue;
                    })
                }
            })

            //简繁体切换
            $scope.isActive = true;//简繁体背景色
            $scope.isActive1 = false;
            $scope.changeAt = function (con, flag) {
                $scope.isActive = flag;
                $scope.isActive1 = !flag;
                $scope.sms.content = SimplizedorFt(con, flag);
                _.each($scope.send_sms.smsBodyModelList, function (val) {
                    val.content = SimplizedorFt(val.content, flag)
                });
            }

            //代理1提交发送短信
            $scope.sendSms = function(){
                $scope.disabled_submit=true;
                $scope.form_loan_sms.checkValidity().then(function () {
                    sceneRecordProfit.sendPostSms($scope.send_sms, function () {
                        topAlert.success("短信發送成功！");
                        $scope.disabled_submit = false;
                        $modalInstance.close();
                        $scope.isSmsCode();
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                });
            }

            //代理2发送短信
            $scope.dailiTwoSms = function (data) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/profit-share/profit-confirm.html",
                    controller: 'dailiTwoSmsCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        }
                    }
                });
            }
            //代理3发送短信
            $scope.dailiThreeSms = function (data) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/profit-share/profit-confirm.html",
                    controller: 'dailiThreeSmsCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        }
                    }
                });
            }

            //股东发送短信
            $scope.gudongSms = function (data) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/profit-share/profit-confirm.html",
                    controller: 'gudongSmsCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        }
                    }
                });
            }

            //判断给哪个发送短信
            $scope.isSmsCode = function(){
                if($scope.daili2.length > 0){
                    $scope.dailiTwoSms(data);
                }else{
                    if($scope.daili3.length > 0){
                        $scope.dailiThreeSms(data);
                    }else{
                        if($scope.gudong4.length > 0){
                            $scope.gudongSms(data);
                        }
                    }
                }
            }

            //取消
            $scope.close = function () {
                $modalInstance.dismiss();
                $scope.isSmsCode();
            }
        }]).controller('dailiTwoSmsCtrl',['$scope','$modalInstance','$modal','SimplizedorFt','sceneRecordProfit','data','topAlert',function($scope,$modalInstance,$modal,SimplizedorFt,sceneRecordProfit,data,topAlert){
            //console.log(sendType);//1是开场  0是离场  2是加彩
            $scope.disabled_submit = false;//是否禁用发送按钮

            //定义几个数组接收短信
            $scope.daili2 = _.filter(data.smsBodyModelList,function(d){return d.layer == 1;})//代理2短信
            $scope.daili3 = _.filter(data.smsBodyModelList,function(d){return d.layer == 2;})//代理3短信
            $scope.gudong4 = _.filter(data.smsBodyModelList,function(d){return d.layer == 3;})//股东短信

            //定义几个数组接收电话号码
            $scope.daili2_tel = _.filter(data.telNumberModelList,function(d){return d.layer == 1;})//代理2短信
            $scope.daili3_tel = _.filter(data.telNumberModelList,function(d){return d.layer == 2;})//代理3短信
            $scope.gudong4_tel = _.filter(data.telNumberModelList,function(d){return d.layer == 3;})//股东短信

            if($scope.daili2.length == 0){
                $scope.disabled_submit = true;//是否禁用发送按钮
            }else{
                $scope.disabled_submit = false;//是否禁用发送按钮
            }

            //页面显示的
            $scope.sms = {
                agent_code:$scope.daili2.length > 0?$scope.daili2[0].agentCode:"",
                agent_name:$scope.daili2.length > 0?$scope.daili2[0].agentContactName:"",
                content:$scope.daili2.length > 0?$scope.daili2[0].content:"",
                phoneNumber:$scope.daili2_tel
            }

            //传给后台的
            $scope.send_sms = {
                pin_code: "",
                smsBodyModelList:$scope.daili2
            }

            //定義一個變量，監控是否修改短信內容
            $scope.$watch('sms.content',function(newValue){
                if(newValue){
                    _.each($scope.send_sms.smsBodyModelList,function(d){
                        d.content = newValue;
                    })
                }
            })

            //简繁体切换
            $scope.isActive = true;//简繁体背景色
            $scope.isActive1 = false;
            $scope.changeAt = function (con, flag) {
                $scope.isActive = flag;
                $scope.isActive1 = !flag;
                $scope.sms.content = SimplizedorFt(con, flag);
                _.each($scope.send_sms.smsBodyModelList, function (val) {
                    val.content = SimplizedorFt(val.content, flag)
                });
            }

            //代理2提交发送短信
            $scope.sendSms = function(){
                $scope.disabled_submit=true;
                $scope.form_loan_sms.checkValidity().then(function () {
                    sceneRecordProfit.sendPostSms($scope.send_sms, function () {
                        topAlert.success("短信發送成功！");
                        $scope.disabled_submit = false;
                        $modalInstance.close();
                        $scope.isSmsCode();
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                });
            }

            //代理3发送短信
            $scope.dailiThreeSms = function (data) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/profit-share/profit-confirm.html",
                    controller: 'dailiThreeSmsCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        }
                    }
                });
            }

            //股东发送短信
            $scope.gudongSms = function (data) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/profit-share/profit-confirm.html",
                    controller: 'gudongSmsCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        }
                    }
                });
            }

            //判断给哪个发送短信
            $scope.isSmsCode = function(){
                if($scope.daili3.length > 0){
                    $scope.dailiThreeSms(data);
                }else{
                    if($scope.gudong4.length > 0){
                        $scope.gudongSms(data);
                    }
                }
            }

            //取消
            $scope.close = function () {
                $modalInstance.dismiss();
                $scope.isSmsCode();
            }
        }]).controller('dailiThreeSmsCtrl',['$scope','$modalInstance','$modal','SimplizedorFt','sceneRecordProfit','data','topAlert',function($scope,$modalInstance,$modal,SimplizedorFt,sceneRecordProfit,data,topAlert){
            //console.log(sendType);//1是开场  0是离场  2是加彩
            $scope.disabled_submit = false;//是否禁用发送按钮

            //定义几个数组接收短信
            $scope.daili3 = _.filter(data.smsBodyModelList,function(d){return d.layer == 2;})//代理3短信
            $scope.gudong4 = _.filter(data.smsBodyModelList,function(d){return d.layer == 3;})//股东短信

            //定义几个数组接收电话号码
            $scope.daili3_tel = _.filter(data.telNumberModelList,function(d){return d.layer == 2;})//代理3短信
            $scope.gudong4_tel = _.filter(data.telNumberModelList,function(d){return d.layer == 3;})//股东短信

            if($scope.daili3_tel.length == 0){
                $scope.disabled_submit = true;//是否禁用发送按钮
            }else{
                $scope.disabled_submit = false;//是否禁用发送按钮
            }

            //页面显示的
            $scope.sms = {
                agent_code:$scope.daili3.length > 0?$scope.daili3[0].agentCode:"",
                agent_name:$scope.daili3.length > 0?$scope.daili3[0].agentContactName:"",
                content:$scope.daili3.length > 0?$scope.daili3[0].content:"",
                phoneNumber:$scope.daili3_tel
            }

            //传给后台的
            $scope.send_sms = {
                pin_code: "",
                smsBodyModelList:$scope.daili3
            }

            //定義一個變量，監控是否修改短信內容
            $scope.$watch('sms.content',function(newValue){
                if(newValue){
                    _.each($scope.send_sms.smsBodyModelList,function(d){
                        d.content = newValue;
                    })
                }
            })

            //简繁体切换
            $scope.isActive = true;//简繁体背景色
            $scope.isActive1 = false;
            $scope.changeAt = function (con, flag) {
                $scope.isActive = flag;
                $scope.isActive1 = !flag;
                $scope.sms.content = SimplizedorFt(con, flag);
                _.each($scope.send_sms.smsBodyModelList, function (val) {
                    val.content = SimplizedorFt(val.content, flag)
                });
            }

            //代理3提交发送短信
            $scope.sendSms = function(){
                $scope.disabled_submit=true;
                $scope.form_loan_sms.checkValidity().then(function () {
                    sceneRecordProfit.sendPostSms($scope.send_sms, function () {
                        topAlert.success("短信發送成功！");
                        $scope.disabled_submit = false;
                        $modalInstance.close();
                        $scope.isSmsCode();
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                });
            }

            //股东发送短信
            $scope.gudongSms = function (data) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/profit-share/profit-confirm.html",
                    controller: 'gudongSmsCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        }
                    }
                });
            }

            //判断股东是否发送短信
            $scope.isSmsCode = function(){
                if($scope.gudong4.length > 0){
                    $scope.gudongSms(data);
                }
            }

            //取消
            $scope.close = function () {
                $modalInstance.dismiss();
                $scope.isSmsCode();
            }
        }]).controller('gudongSmsCtrl',['$scope','$modalInstance','$modal','SimplizedorFt','sceneRecordProfit','data','topAlert',function($scope,$modalInstance,$modal,SimplizedorFt,sceneRecordProfit,data,topAlert){
            //console.log(sendType);//1是开场  0是离场  2是加彩
            $scope.disabled_submit = false;//是否禁用发送按钮

            //定义几个数组接收短信
            $scope.gudong4 = _.filter(data.smsBodyModelList,function(d){return d.layer == 3;})//股东短信

            //定义几个数组接收电话号码
            $scope.gudong4_tel = _.filter(data.telNumberModelList,function(d){return d.layer == 3;})//股东短信

            if($scope.gudong4_tel.length == 0){
                $scope.disabled_submit = true;//是否禁用发送按钮
            }else{
                $scope.disabled_submit = false;//是否禁用发送按钮
            }

            //页面显示的
            $scope.sms = {
                agent_code:$scope.gudong4.length > 0?$scope.gudong4[0].agentCode:"",
                agent_name:$scope.gudong4.length > 0?$scope.gudong4[0].agentContactName:"",
                content:$scope.gudong4.length > 0?$scope.gudong4[0].content:"",
                phoneNumber:$scope.gudong4_tel
            }

            //传给后台的
            $scope.send_sms = {
                pin_code: "",
                smsBodyModelList:$scope.gudong4
            }

            //定義一個變量，監控是否修改短信內容
            $scope.$watch('sms.content',function(newValue){
                if(newValue){
                    _.each($scope.send_sms.smsBodyModelList,function(d){
                        d.content = newValue;
                    })
                }
            })

            //简繁体切换
            $scope.isActive = true;//简繁体背景色
            $scope.isActive1 = false;
            $scope.changeAt = function (con, flag) {
                $scope.isActive = flag;
                $scope.isActive1 = !flag;
                $scope.sms.content = SimplizedorFt(con, flag);
                _.each($scope.send_sms.smsBodyModelList, function (val) {
                    val.content = SimplizedorFt(val.content, flag)
                });
            }

            //股东提交发送短信
            $scope.sendSms = function(){
                $scope.disabled_submit=true;
                $scope.form_loan_sms.checkValidity().then(function () {
                    sceneRecordProfit.sendPostSms($scope.send_sms, function () {
                        topAlert.success("短信發送成功！");
                        $scope.disabled_submit = false;
                        $modalInstance.close();
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                });
            }

            //取消
            $scope.close = function () {
                $modalInstance.dismiss();
            }
        }]).controller('changMianSmsCtrl',['$scope','$filter','$modalInstance','$modal','SimplizedorFt','sceneRecordProfit','topAlert','sendType','data',function($scope,$filter,$modalInstance,$modal,SimplizedorFt,sceneRecordProfit,topAlert,sendType,data){
            //console.log(sendType);//1是开场  0是离场  2是加彩
            $scope.disabled_submit = false;//是否禁用发送按钮

            //定义几个数组接收短信
            $scope.daili5 = _.filter(data.smsBodyModelList,function(d){return d.layer == -1;})//A数短信
            $scope.daili1 = _.filter(data.smsBodyModelList,function(d){return d.layer == 0;})//代理1短信
            $scope.daili2 = _.filter(data.smsBodyModelList,function(d){return d.layer == 1;})//代理2短信
            $scope.daili3 = _.filter(data.smsBodyModelList,function(d){return d.layer == 2;})//代理3短信
            $scope.gudong4 = _.filter(data.smsBodyModelList,function(d){return d.layer == 3;})//股东短信

            //定义几个数组接收电话号码
            $scope.daili5_tel = _.filter(data.telNumberModelList,function(d){return d.layer == -1;})//A数短信
            $scope.daili1_tel = _.filter(data.telNumberModelList,function(d){return d.layer == 0;})//代理1短信
            $scope.daili2_tel = _.filter(data.telNumberModelList,function(d){return d.layer == 1;})//代理2短信
            $scope.daili3_tel = _.filter(data.telNumberModelList,function(d){return d.layer == 2;})//代理3短信
            $scope.gudong4_tel = _.filter(data.telNumberModelList,function(d){return d.layer == 3;})//股东短信

            if($scope.daili5_tel.length == 0){
                $scope.disabled_submit = true;//是否禁用发送按钮
            }else{
                $scope.disabled_submit = false;//是否禁用发送按钮
            }

            //页面显示的
            $scope.sms = {
                agent_code:$scope.daili5.length > 0?$scope.daili5[0].agentCode:"",
                agent_name:$scope.daili5.length > 0?$scope.daili5[0].agentContactName:"",
                content:$scope.daili5.length > 0?$scope.daili5[0].content:"",
                phoneNumber:$scope.daili5_tel
            }

            //传给后台的
            $scope.send_sms = {
                pin_code: "",
                smsBodyModelList:$scope.daili5
            }

            //定義一個變量，監控是否修改短信內容
            $scope.$watch('sms.content',function(newValue){
                if(newValue){
                    _.each($scope.send_sms.smsBodyModelList,function(d){
                        d.content = newValue;
                    })
                }
            })

            //简繁体切换
            $scope.isActive = true;//简繁体背景色
            $scope.isActive1 = false;
            $scope.changeAt = function (con, flag) {
                $scope.isActive = flag;
                $scope.isActive1 = !flag;
                $scope.sms.content = SimplizedorFt(con, flag);
                _.each($scope.send_sms.smsBodyModelList, function (val) {
                    val.content = SimplizedorFt(val.content, flag)
                });
            }

            //代理1提交发送短信
            $scope.sendSms = function(){
                $scope.disabled_submit=true;
                $scope.form_loan_sms.checkValidity().then(function () {
                    sceneRecordProfit.sendPostSms($scope.send_sms, function () {
                        topAlert.success("短信發送成功！");
                        $scope.disabled_submit = false;
                        $modalInstance.close();
                        $scope.isSmsCode();
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                });
            }

            //代理1发送短信
            $scope.dailiOneSms = function (data) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/profit-share/profit-confirm.html",
                    controller: 'dailiOneSmsCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        }
                    }
                });
            }

            //代理2发送短信
            $scope.dailiTwoSms = function (data) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/profit-share/profit-confirm.html",
                    controller: 'dailiTwoSmsCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        }
                    }
                });
            }
            //代理3发送短信
            $scope.dailiThreeSms = function (data) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/profit-share/profit-confirm.html",
                    controller: 'dailiThreeSmsCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        }
                    }
                });
            }

            //股东发送短信
            $scope.gudongSms = function (data) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/profit-share/profit-confirm.html",
                    controller: 'gudongSmsCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        }
                    }
                });
            }

            //判断给哪个发送短信
            $scope.isSmsCode = function(){
                if($scope.daili1.length > 0){
                    $scope.dailiOneSms(data);
                }else{
                    if($scope.daili2.length > 0){
                        $scope.dailiTwoSms(data);
                    }else{
                        if($scope.daili3.length > 0){
                            $scope.dailiThreeSms(data);
                        }else{
                            if($scope.gudong4.length > 0){
                                $scope.gudongSms(data);
                            }
                        }
                    }
                }
            }

            //取消
            $scope.close = function () {
                $modalInstance.dismiss();
                $scope.isSmsCode();
            }
        }]);
}).call(this);
