(function () {
    'use strict';
    angular.module('app.commission.ctrls', ['app.commission.services', 'app.commission.json']).controller('commonRuleSettingCtrls', ['$scope', function ($scope) {

    }]).controller('ruleSettingCtrls', ['$scope', 'commissions', 'page', 'search', function ($scope, commissions, page, search) {
        $scope.commissions = commissions;
        $scope.condition = {"online_agent": ""};
        $scope.show = $scope.show_online = false;
        //var original;
        var init_commission = {
            "agent_code": "",
            "agent_type": "",
            "agent_name": "",
            "agent_phone": "",
            "brokerage": "",
            "brokerage_phone": "",
            "online_agent": ""
        }


        //original = angular.copy(init_commission);
        $scope.commission = angular.copy(init_commission);
        var search_config = [
            {field_name: 'online_agent'}
        ];

        $scope.$watch('agent_code', function (new_value, old_value) {
            var selected_commission = _.findWhere($scope.commissions, {"agent_code": new_value});
            if (!angular.isUndefined(selected_commission)) {
                $scope.show = true;
                $scope.commission = selected_commission;
                $scope.condition.online_agent = $scope.commission.agent_code;
                if (!angular.isUndefined($scope.condition.online_agent) && $scope.condition.online_agent) {
                    $scope.off_commissions = search($scope.commissions, search_config, $scope.condition);
                    $scope.all_off_commissions = page.select(1, $scope.off_commissions);
                    if ($scope.off_commissions.length > 0) {
                        $scope.show_online = true;
                    } else {
                        $scope.show_online = false;
                    }
                    var on_commission = _.findWhere($scope.commissions, {"agent_code": $scope.off_commissions[0].online_agent});
                    if (!angular.isUndefined(on_commission)) {
                        $scope.on_commission = on_commission;
                    }
                }
            } else {
                $scope.show_online = $scope.show = false;
                $scope.online_commissions = {};
                $scope.commission = {};
            }
        });

        $scope.setting = function (agent_code) {
            $scope.agent_code = agent_code;
        }

    }]).controller('commissionCommonRuleSettingCtrl', ['$scope', 'tmsPagination', 'commissionRuleNameCommon', 'agentsLists', 'globalFunction', 'breadcrumb', 'page', 'hallName', 'capitalTypes', 'pinCodeModal', 'topAlert', '$modal', '$log',
        function ($scope, tmsPagination, commissionRuleNameCommon, agentsLists, globalFunction, breadcrumb, page, hallName, capitalTypes, pinCodeModal, topAlert, $modal, $log) {
            //面包屑导航
            breadcrumb.items = [
                {"name": "碼佣公共設定", "active": true}
            ];
            //自定義變量
            $scope.commissions_rule_url = globalFunction.getApiUrl('commissionsetting/commissionrulenamecommon');
            $scope.userType = ['户口', '上線一', '上線二', '上線三', '上線四', '上線五', '上線六', '上線七', '上線八', '上線九'];
            $scope.user_type = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            $scope.months = [{key: "1", val: "1"}, {key: "2", val: "2"}, {key: "3", val: "3"}, {
                key: "4",
                val: "4"
            }, {key: "5", val: "5"}, {key: "6", val: "6"}, {key: "7", val: "7"}, {key: "8", val: "8"}, {
                key: "9",
                val: "9"
            }, {key: "10", val: "10"}, {key: "11", val: "11"}, {key: "12", val: "12"}, {key: "永久", val: "-1"}];//,{key:"無限",val:"-1"}
            $scope.capitaltypes = capitalTypes.query({"capital_type": 1});//碼佣規則-本金類型
            $scope.sub_post = 'POST';
            $scope.update_diable = false;
            $scope.show_btn = true;
            var original;
            var init_commissions = {
                "pin_code": "",
                "rule_name": "",
                "capital_type_id": "",
                "commissionRuleHalls": [{
                    "hall_id": "",
                    "commission_total": "",
                    "integral_total": "",
                    "recycle_rate_total": "",
                    "integral_expire": "",
                    "compAgentRuleHalls": [{
                        "layer": "0",
                        "commission_should": "",
                        "integral_should": "",
                        "recycle_rate": "",
                        "is_comp_agent": "1",
                        "agent_info_id": ""

                    }],
                    "commissionRuleHallSubs": [{
                        "layer": "0",
                        "commission_should": "",
                        "integral_should": "",
                        "recycle_rate": "",
                        "integral_recycle_agent_code": "",
                        "integral_recycle_agent_id": ""//积分回收户口
                    },
                        {
                            "layer": "1",
                            "commission_should": "",
                            "integral_should": "",
                            "recycle_rate": "",
                            "integral_recycle_agent_code": "",
                            "integral_recycle_agent_id": ""//积分回收户口
                        },
                        {
                            "layer": "2",
                            "commission_should": "",
                            "integral_should": "",
                            "recycle_rate": "",
                            "integral_recycle_agent_code": "",
                            "integral_recycle_agent_id": ""//积分回收户口
                        }]
                }],
                "commissionRuleCommon": {
                    "commission_total": "",
                    "integral_total": "",
                    "recycle_rate_total": "",
                    "integral_expire": "",
                    "commissionRuleCommonSubs": [
                        {
                            "layer": "0",
                            "commission_should": 0,
                            "integral_should": 0,
                            "recycle_rate": 0,
                            "integral_recycle_agent_code": "",
                            "integral_recycle_agent_id": ""//积分回收户口
                        },
                        {
                            "layer": "1",
                            "commission_should": 0,
                            "integral_should": 0,
                            "recycle_rate": 0,
                            "integral_recycle_agent_code": "",
                            "integral_recycle_agent_id": ""//积分回收户口
                        },
                        {
                            "layer": "2",
                            "commission_should": 0,
                            "integral_should": 0,
                            "recycle_rate": 0,
                            "integral_recycle_agent_code": "",
                            "integral_recycle_agent_id": ""//积分回收户口
                        }
                    ],
                    "compAgentRules": [{
                        "layer": "0",
                        "commission_should": 0,
                        "integral_should": 0,
                        "recycle_rate": 0,
                        "is_comp_agent": "1",
                        "agent_code": "",
                        "agent_info_id": "",
                        "integral_recycle_agent_code": "",
                        "integral_recycle_agent_id": ""//积分回收户口
                    }]

                }
            }
            original = angular.copy(init_commissions);
            $scope.commissions = angular.copy(init_commissions);
            $scope.commissions.commissionRuleHalls.splice(0, 1);
            //初始化規則列表數據
            $scope.pagination_setting = tmsPagination.create();
            $scope.pagination_setting.items_per_page = 15;
            $scope.pagination_setting.max_size = 6;
            $scope.pagination_setting.resource = commissionRuleNameCommon;
            $scope.select = function (page) {
                $scope.commissions_rules = $scope.pagination_setting.select(page);
            }
            $scope.select();
            //佣金总额计算
            $scope.commission_total = function () {
                $scope.c_total = 0;
                for (var j = 0; j < $scope.commissions.commissionRuleCommon.commissionRuleCommonSubs.length; j++) {
                    if ($scope.commissions.commissionRuleCommon.commissionRuleCommonSubs[j].commission_should) {
                        $scope.c_total += parseInt($scope.commissions.commissionRuleCommon.commissionRuleCommonSubs[j].commission_should);
                    }
                }
                for (var j = 0; j < $scope.commissions.commissionRuleCommon.compAgentRules.length; j++) {
                    if ($scope.commissions.commissionRuleCommon.compAgentRules[j].commission_should) {
                        $scope.c_total += parseInt($scope.commissions.commissionRuleCommon.compAgentRules[j].commission_should);
                    }
                }
                $scope.commissions.commissionRuleCommon.commission_total = $scope.c_total;
                return parseInt($scope.c_total);
            }
            //積分
            $scope.integral_total = function () {
                $scope.i_total = 0;
                for (var j = 0; j < $scope.commissions.commissionRuleCommon.commissionRuleCommonSubs.length; j++) {
                    if ($scope.commissions.commissionRuleCommon.commissionRuleCommonSubs[j].integral_should) {
                        $scope.i_total += parseInt($scope.commissions.commissionRuleCommon.commissionRuleCommonSubs[j].integral_should);
                    }
                }
                for (var j = 0; j < $scope.commissions.commissionRuleCommon.compAgentRules.length; j++) {
                    if ($scope.commissions.commissionRuleCommon.compAgentRules[j].integral_should) {
                        $scope.i_total += parseInt($scope.commissions.commissionRuleCommon.compAgentRules[j].integral_should);
                    }
                }
                $scope.commissions.commissionRuleCommon.integral_total = parseInt($scope.i_total);
                return parseInt($scope.i_total);
            }
            //積分回收比例
            $scope.recycle_rate_total = function () {
                $scope.r_total = 0;
                for (var j = 0; j < $scope.commissions.commissionRuleCommon.commissionRuleCommonSubs.length; j++) {
                    if ($scope.commissions.commissionRuleCommon.commissionRuleCommonSubs[j].recycle_rate) {
                        $scope.r_total += parseInt($scope.commissions.commissionRuleCommon.commissionRuleCommonSubs[j].recycle_rate);
                    }
                }
                for (var j = 0; j < $scope.commissions.commissionRuleCommon.compAgentRules.length; j++) {
                    if ($scope.commissions.commissionRuleCommon.compAgentRules[j].recycle_rate) {
                        $scope.r_total += parseInt($scope.commissions.commissionRuleCommon.compAgentRules[j].recycle_rate);
                    }
                }
                $scope.commissions.commissionRuleCommon.recycle_rate_total = parseInt($scope.r_total);
                return parseInt($scope.r_total);
            }
            //新增用戶類型
            $scope.addCommissions = function () {
                $scope.commissions.commissionRuleCommon.commissionRuleCommonSubs.push({
                    "layer": ($scope.commissions.commissionRuleCommon.commissionRuleCommonSubs.length - 1),
                    "commission_should": 0,
                    "integral_should": 0,
                    "recycle_rate": 0,
                    "integral_recycle_agent_code": "",
                    "integral_recycle_agent_id": ""//积分回收户口
                });
            }
            //新增特別收益戶口
            $scope.addAgentCommissions = function () {
                $scope.commissions.commissionRuleCommon.compAgentRules.push({
                    "layer": ($scope.commissions.commissionRuleCommon.compAgentRules.length - 1),
                    "commission_should": 0,
                    "integral_should": 0,
                    "recycle_rate": 0,
                    "is_comp_agent": "1",
                    "agent_info_id": "",
                    "integral_recycle_agent_code": "",
                    "integral_recycle_agent_id": ""//积分回收户口
                });
            }
            //刪除用戶類型
            $scope.removeCommissions = function (index) {
                $scope.commissions.commissionRuleCommon.commissionRuleCommonSubs.splice(index, 1);
            }
            //刪除特別收益戶口
            $scope.removeAgentCommissions = function (index) {
                $scope.commissions.commissionRuleCommon.compAgentRules.splice(index, 1);
            }
            //特別收益戶口監控
            $scope.$watch('commissions.commissionRuleCommon.compAgentRules', globalFunction.debounce(function (agents, old_agents) {
                angular.forEach(agents, function (agent, index) {
                    if (agent.agent_code) {
                        if (old_agents[index] && old_agents[index].agent_code != agent.agent_code) {
                            agentsLists.query(globalFunction.generateUrlParams({agent_code: agent.agent_code}, {})).$promise.then(function (agent_setting) {
                                if (agent_setting.length > 0) {
                                    $scope.agent = agent_setting[0];
                                    agent.agent_info_id = $scope.agent.id;
                                } else {
                                    agent.agent_info_id = "";
                                }
                            });
                        }
                    } else {
                        agent.agent_info_id = "";
                    }
                    if (agent.integral_recycle_agent_code) {
                        if (old_agents[index] && old_agents[index].integral_recycle_agent_code != agent.integral_recycle_agent_code) {
                            agentsLists.query(globalFunction.generateUrlParams({agent_code: agent.integral_recycle_agent_code}, {})).$promise.then(function (agent_setting) {
                                if (agent_setting.length > 0) {
                                    $scope.agent = agent_setting[0];
                                    agent.integral_recycle_agent_id = $scope.agent.id;
                                } else {
                                    agent.integral_recycle_agent_id = "";
                                }
                            });
                        }
                    } else {
                        agent.integral_recycle_agent_id = "";
                    }
                });
            }, 500), true);

            //戶口監控
            $scope.$watch('commissions.commissionRuleCommon.commissionRuleCommonSubs', globalFunction.debounce(function (agents, old_agents) {
                angular.forEach(agents, function (agent, index) {
                    if (agent.integral_recycle_agent_code) {
                        if (old_agents[index] && old_agents[index].integral_recycle_agent_code != agent.integral_recycle_agent_code) {
                            agentsLists.query(globalFunction.generateUrlParams({agent_code: agent.integral_recycle_agent_code}, {})).$promise.then(function (integral_agent_setting) {
                                if (integral_agent_setting.length > 0) {
                                    $scope.integral_agent = integral_agent_setting[0];
                                    agent.integral_recycle_agent_id = $scope.integral_agent.id;
                                } else {
                                    agent.integral_recycle_agent_id = "";
                                }
                            });
                        }
                    } else {
                        agent.integral_recycle_agent_id = "";
                    }
                });
            }, 500), true);

            //廳館排列
            $scope.hall_checked_layout = function () {
                $scope.halls = [];
                $scope.all_halls = [];
                hallName.query({hall_type: "|1", sort: "hall_type"}).$promise.then(function (_halls) {
                    $scope.all_halls = _.filter(_halls, function (hall) {
                        return hall.id != '27115D48C5F726D6E050A8C098150716'
                    });
                    for (var i = 0; i < Math.ceil($scope.all_halls.length / 2); i++) {
                        $scope.halls.push($scope.all_halls.slice(i * 2, 2 * (i + 1)))
                    }
                });
            }
            $scope.hall_checked_layout();
            //全選廳館
            $scope.hall_ids = [];
            //$scope.hall_check_alls=["hall_check_all1","hall_check_all2"];//定義全選變量
            $scope.hall_check_alls = {"hall_check_all1": "", "hall_check_all2": ""};
            $scope.hall_check_all1 = function () {
                if ($scope.hall_check_alls.hall_check_all1) {
                    _.each($scope.halls, function (hall) {
                        hall[0].selected = true;
                    });
                } else {
                    _.each($scope.halls, function (hall) {
                        hall[0].selected = false;
                    });
                }
            }
            $scope.hall_check_all2 = function () {
                if ($scope.hall_check_alls.hall_check_all2) {
                    _.each($scope.halls, function (hall) {
                        if (hall.length == 2) {
                            hall[1].selected = true;
                        }
                    });
                } else {
                    _.each($scope.halls, function (hall) {
                        if (hall.length == 2) {
                            hall[1].selected = false;
                        }
                    });
                }
            }
            //绑定厅馆
            $scope.commissions_old = [];
            $scope.hall_old_ids = [];
            $scope.hall_ids = [];
            $scope.disabled_bind = false;
            $scope.bindCommission = function () {
                if ($scope.disabled_bind) {
                    return $scope.disabled_bind;
                }
                if ($scope.commissions.commissionRuleCommon.commissionRuleCommonSubs[0].commission_should <= 0) {
                    topAlert.warning("戶口分派佣金額不能小於 0");
                    return;
                }
                for (var i = 0; i < $scope.commissions.commissionRuleCommon.compAgentRules.length; i++) {
                    if (($scope.commissions.commissionRuleCommon.compAgentRules[i].agent_info_id == '' || $scope.commissions.commissionRuleCommon.compAgentRules[i].agent_info_id == null) && ($scope.commissions.commissionRuleCommon.compAgentRules[i].commission_should == '' || $scope.commissions.commissionRuleCommon.compAgentRules[i].commission_should == null) && ($scope.commissions.commissionRuleCommon.compAgentRules[i].integral_should == '' || $scope.commissions.commissionRuleCommon.compAgentRules[i].integral_should == null) && ($scope.commissions.commissionRuleCommon.compAgentRules[i].recycle_rate == '' || $scope.commissions.commissionRuleCommon.compAgentRules[i].recycle_rate == null) && ($scope.commissions.commissionRuleCommon.compAgentRules[i].integral_recycle_agent_id == '' || $scope.commissions.commissionRuleCommon.compAgentRules[i].integral_recycle_agent_id == null)) {
                        $scope.commissions.commissionRuleCommon.compAgentRules.splice(i, 1);
                        i = 0;
                    }
                }
                if (!angular.isUndefined($scope.commissions.commissionRuleCommon.compAgentRules[0])) {
                    if (($scope.commissions.commissionRuleCommon.compAgentRules[0].agent_info_id == '' || $scope.commissions.commissionRuleCommon.compAgentRules[0].agent_info_id == null) && ($scope.commissions.commissionRuleCommon.compAgentRules[0].commission_should == '' || $scope.commissions.commissionRuleCommon.compAgentRules[0].commission_should == null) && ($scope.commissions.commissionRuleCommon.compAgentRules[0].integral_should == '' || $scope.commissions.commissionRuleCommon.compAgentRules[0].integral_should == null) && ($scope.commissions.commissionRuleCommon.compAgentRules[0].recycle_rate == '' || $scope.commissions.commissionRuleCommon.compAgentRules[0].recycle_rate == null) && ($scope.commissions.commissionRuleCommon.compAgentRules[0].integral_recycle_agent_id == '' || $scope.commissions.commissionRuleCommon.compAgentRules[0].integral_recycle_agent_id == null)) {
                        $scope.commissions.commissionRuleCommon.compAgentRules = [];
                    }
                }
                if ($scope.commissions.commissionRuleCommon.compAgentRules.length > 0 && $scope.commissions.commissionRuleCommon.compAgentRules[0].commission_should <= 0) {
                    topAlert.warning("特別收益戶口分派佣金額不能小於 0");
                    return;
                }
                $scope.disabled_bind = true;
                $scope.form_commission.checkPreValidity('POST', 'commissionsetting/commissionrulenamecommon/create-validate', commissionRuleNameCommon.createValidate, {
                    "rule_name": $scope.commissions.rule_name,
                    "capital_type_id": $scope.commissions.capital_type_id,
                    "commissionRuleCommon": $scope.commissions.commissionRuleCommon
                }).then(function () {
                    $scope.form_commission.clearErrors();
                    if ($scope.commissions.commissionRuleCommon.compAgentRules.length == 0) {
                        $scope.commissions.commissionRuleCommon.compAgentRules.push({
                            "layer": "0",
                            "commission_should": "",
                            "integral_should": "",
                            "recycle_rate": "",
                            "is_comp_agent": "1",
                            "agent_code": "",
                            "agent_info_id": "",
                            "integral_recycle_agent_code": "",
                            "integral_recycle_agent_id": ""//积分回收户口
                        });
                    }
                    $scope.bindCommissions();
                    $scope.disabled_bind = false;
                }, function () {
                    if ($scope.commissions.commissionRuleCommon.compAgentRules.length == 0) {
                        $scope.commissions.commissionRuleCommon.compAgentRules.push({
                            "layer": "0",
                            "commission_should": "",
                            "integral_should": "",
                            "recycle_rate": "",
                            "is_comp_agent": "1",
                            "agent_code": "",
                            "agent_info_id": "",
                            "integral_recycle_agent_code": "",
                            "integral_recycle_agent_id": ""//积分回收户口
                        });
                    }
                    $scope.disabled_bind = false;
                });
            }
            $scope.bindCommissions = function () {
                //獲取選中的hall_id;
                $scope.hall_ids = [];
                _.each($scope.halls, function (hall) {
                    _.each(hall, function (h) {
                        if (h.selected == true) {
                            $scope.hall_ids.push(h.id);
                        }
                    })
                });
                $scope.commissions.commissionRuleHalls_one = [];
                $scope.commissions.commissionRuleHalls_one = angular.copy($scope.commissions.commissionRuleHalls);
                $scope.commission_rule_halls = _.pluck($scope.commissions.commissionRuleHalls_one, "hall_id");
                if ($scope.hall_ids.length > 0) {
                    if ($scope.commissions.id) {
                        var commissions_copy = angular.copy($scope.commissions.commissionRuleCommon);
                        angular.forEach($scope.hall_ids, function (hall_id, index) {
                            if ($scope.commission_rule_halls.indexOf(hall_id) >= 0) {
                                $scope.sub = $scope.commission_rule_halls.indexOf(hall_id);
                                $scope.commissions.commissionRuleHalls[$scope.sub].id = $scope.commissions.commissionRuleHalls_one[$scope.sub].id;
                                $scope.commissions.commissionRuleHalls[$scope.sub].commission_total = commissions_copy.commission_total;
                                $scope.commissions.commissionRuleHalls[$scope.sub].integral_total = commissions_copy.integral_total;
                                $scope.commissions.commissionRuleHalls[$scope.sub].recycle_rate_total = commissions_copy.recycle_rate_total;
                                $scope.commissions.commissionRuleHalls[$scope.sub].integral_expire = commissions_copy.integral_expire;
                                //收益戶口
                                _.each(commissions_copy.commissionRuleCommonSubs, function (commissionRuleCommonSub, num) {
                                    if ($scope.commissions.commissionRuleHalls_one[$scope.sub].commissionRuleHallSubs[num]) {
                                        $scope.commissions.commissionRuleHalls[$scope.sub].commissionRuleHallSubs[num].id = $scope.commissions.commissionRuleHalls_one[$scope.sub].commissionRuleHallSubs[num].id,
                                            $scope.commissions.commissionRuleHalls[$scope.sub].commissionRuleHallSubs[num].commission_rule_hall_id = $scope.commissions.commissionRuleHalls_one[$scope.sub].commissionRuleHallSubs[num].commission_rule_hall_id,
                                            $scope.commissions.commissionRuleHalls[$scope.sub].commissionRuleHallSubs[num].commission_should = commissionRuleCommonSub.commission_should,
                                            $scope.commissions.commissionRuleHalls[$scope.sub].commissionRuleHallSubs[num].integral_should = commissionRuleCommonSub.integral_should,
                                            $scope.commissions.commissionRuleHalls[$scope.sub].commissionRuleHallSubs[num].recycle_rate = commissionRuleCommonSub.recycle_rate,
                                            $scope.commissions.commissionRuleHalls[$scope.sub].commissionRuleHallSubs[num].integral_recycle_agent_code = commissionRuleCommonSub.integral_recycle_agent_code,
                                            $scope.commissions.commissionRuleHalls[$scope.sub].commissionRuleHallSubs[num].integral_recycle_agent_id = commissionRuleCommonSub.integral_recycle_agent_id
                                    } else {
                                        $scope.commissions.commissionRuleHalls[$scope.sub].commissionRuleHallSubs.push({
                                            commission_rule_hall_id: $scope.commissions.commissionRuleHalls_one[$scope.sub].commissionRuleHallSubs[0].commission_rule_hall_id,
                                            layer: num,
                                            commission_should: commissionRuleCommonSub.commission_should,
                                            integral_should: commissionRuleCommonSub.integral_should,
                                            recycle_rate: commissionRuleCommonSub.recycle_rate,
                                            integral_recycle_agent_code: commissionRuleCommonSub.integral_recycle_agent_code,
                                            integral_recycle_agent_id: commissionRuleCommonSub.integral_recycle_agent_id
                                        })
                                    }
                                });
                                //特別收益戶口
                                _.each(commissions_copy.compAgentRules, function (compAgentRuleHall, num) {
                                    if ($scope.commissions.commissionRuleHalls_one[$scope.sub].compAgentRuleHalls[num]) {
                                        $scope.commissions.commissionRuleHalls[$scope.sub].compAgentRuleHalls[num].is_comp_agent = "1",
                                            $scope.commissions.commissionRuleHalls[$scope.sub].compAgentRuleHalls[num].commission_should = compAgentRuleHall.commission_should;
                                        $scope.commissions.commissionRuleHalls[$scope.sub].compAgentRuleHalls[num].integral_should = compAgentRuleHall.integral_should;
                                        $scope.commissions.commissionRuleHalls[$scope.sub].compAgentRuleHalls[num].recycle_rate = compAgentRuleHall.recycle_rate;
                                        $scope.commissions.commissionRuleHalls[$scope.sub].compAgentRuleHalls[num].layer = compAgentRuleHall.layer;
                                        $scope.commissions.commissionRuleHalls[$scope.sub].compAgentRuleHalls[num].agent_code = compAgentRuleHall.agent_code;
                                        $scope.commissions.commissionRuleHalls[$scope.sub].compAgentRuleHalls[num].agent_info_id = compAgentRuleHall.agent_info_id;
                                        $scope.commissions.commissionRuleHalls[$scope.sub].compAgentRuleHalls[num].integral_recycle_agent_code = compAgentRuleHall.integral_recycle_agent_code;
                                        $scope.commissions.commissionRuleHalls[$scope.sub].compAgentRuleHalls[num].integral_recycle_agent_id = compAgentRuleHall.integral_recycle_agent_id;
                                    } else {
                                        $scope.commissions.commissionRuleHalls[$scope.sub].compAgentRuleHalls.push({
                                            "commission_rule_hall_id": $scope.commissions.commissionRuleHalls_one[$scope.sub].commissionRuleHallSubs[0].commission_rule_hall_id,
                                            "layer": num,
                                            "is_comp_agent": "1",
                                            "commission_should": compAgentRuleHall.commission_should,
                                            "integral_should": compAgentRuleHall.integral_should,
                                            "recycle_rate": compAgentRuleHall.recycle_rate,
                                            "agent_code": compAgentRuleHall.agent_code,
                                            "agent_info_id": compAgentRuleHall.agent_info_id,
                                            "integral_recycle_agent_code": compAgentRuleHall.integral_recycle_agent_code,
                                            "integral_recycle_agent_id": compAgentRuleHall.integral_recycle_agent_id//积分回收户口
                                        })
                                    }
                                });
                            }
                        })
//                        if($scope.all_halls.length > $scope.commissions.commissionRuleHalls.length){
//                            angular.forEach($scope.hall_ids,function(hall_id,index){
//                                var commissions_copy = angular.copy($scope.commissions.commissionRuleCommon);
//                                if($scope.commission_rule_halls.indexOf(hall_id) < 0){
//                                    $scope.commissions.commissionRuleHalls.push({
//                                        "hall_id":hall_id,
//                                        "commission_total":commissions_copy.commission_total,
//                                        "integral_total":commissions_copy.integral_total,
//                                        "recycle_rate_total":commissions_copy.recycle_rate_total,
//                                        "integral_expire":commissions_copy.integral_expire,
//                                        "commissionRuleHallSubs":commissions_copy.commissionRuleCommonSubs,
//                                        "compAgentRuleHalls":commissions_copy.compAgentRules
//                                    });
//                                }else{
//                                    $scope.num = $scope.commission_rule_halls.indexOf(hall_id);
//                                    $scope.commissions.commissionRuleHalls[$scope.num].commissionRuleHallSubs = [];
//                                    $scope.commissions.commissionRuleHalls[$scope.num].compAgentRuleHalls = [];
//                                    $scope.commissions.commissionRuleHalls[$scope.num].hall_id = hall_id;
//                                    $scope.commissions.commissionRuleHalls[$scope.num].commission_total= commissions_copy.commission_total;
//                                    $scope.commissions.commissionRuleHalls[$scope.num].integral_total = commissions_copy.integral_total;
//                                    $scope.commissions.commissionRuleHalls[$scope.num].recycle_rate_total = commissions_copy.recycle_rate_total;
//                                    $scope.commissions.commissionRuleHalls[$scope.num].integral_expire = commissions_copy.integral_expire;
//                                    $scope.commissions.commissionRuleHalls[$scope.num].commissionRuleHallSubs = commissions_copy.commissionRuleCommonSubs;
//                                    $scope.commissions.commissionRuleHalls[$scope.num].compAgentRuleHalls = commissions_copy.compAgentRules;
//                                }
//                            })
//                        }

                    } else {
                        angular.forEach($scope.hall_ids, function (hall_id, index) {
                            var commissions_copy = angular.copy($scope.commissions.commissionRuleCommon);
                            if ($scope.commission_rule_halls.indexOf(hall_id) < 0) {
                                $scope.commissions.commissionRuleHalls.push({
                                    "hall_id": hall_id,
                                    "commission_total": commissions_copy.commission_total,
                                    "integral_total": commissions_copy.integral_total,
                                    "recycle_rate_total": commissions_copy.recycle_rate_total,
                                    "integral_expire": commissions_copy.integral_expire,
                                    "commissionRuleHallSubs": commissions_copy.commissionRuleCommonSubs,
                                    "compAgentRuleHalls": commissions_copy.compAgentRules
                                });
                            } else {
                                $scope.num = $scope.commission_rule_halls.indexOf(hall_id);
                                $scope.commissions.commissionRuleHalls[$scope.num].commissionRuleHallSubs = [];
                                $scope.commissions.commissionRuleHalls[$scope.num].compAgentRuleHalls = [];
                                $scope.commissions.commissionRuleHalls[$scope.num].hall_id = hall_id;
                                $scope.commissions.commissionRuleHalls[$scope.num].commission_total = commissions_copy.commission_total;
                                $scope.commissions.commissionRuleHalls[$scope.num].integral_total = commissions_copy.integral_total;
                                $scope.commissions.commissionRuleHalls[$scope.num].recycle_rate_total = commissions_copy.recycle_rate_total;
                                $scope.commissions.commissionRuleHalls[$scope.num].integral_expire = commissions_copy.integral_expire;
                                $scope.commissions.commissionRuleHalls[$scope.num].commissionRuleHallSubs = commissions_copy.commissionRuleCommonSubs;
                                $scope.commissions.commissionRuleHalls[$scope.num].compAgentRuleHalls = commissions_copy.compAgentRules;
                            }
                        })
                    }

                } else {
                    topAlert.warning("請選擇廳會!");
                }
                $scope.commissions_old = {};
                $scope.hall_old_ids = [];
                $scope.commissions_old = angular.copy($scope.commissions);
                if ($scope.commissions.id) {
                    angular.forEach($scope.hall_ids, function (hall_id) {
                        $scope.hall_old_ids.push(hall_id);
                    });
                } else {
                    if ($scope.commissions_old.commissionRuleHalls.length > 0) {
                        $scope.hall_old_ids = _.pluck($scope.commissions_old.commissionRuleHalls, "hall_id");
                    }
                }
            }
            //綁定重置
            $scope.resetCommission = function () {
                if ($scope.commissions.id) {
                    $scope.hall_check_alls.hall_check_all1 = true;
                    $scope.hall_check_alls.hall_check_all2 = true;
                    $scope.hall_check_all1();
                    $scope.hall_check_all2();
                    $scope.commissions.commissionRuleHalls = angular.copy($scope.commissions_update.commissionRuleHalls);
                    $scope.hall_ids = [];
                    $scope.commissions_old = [];
                    $scope.hall_old_ids = [];
                    $scope.form_commission.clearErrors();
                } else {
                    $scope.hall_check_alls.hall_check_all1 = false;
                    $scope.hall_check_alls.hall_check_all2 = false;
                    $scope.hall_check_all1();
                    $scope.hall_check_all2();
                    $scope.commissions.commissionRuleHalls = angular.copy(original.commissionRuleHalls);
                    $scope.hall_ids = [];
                    $scope.commissions_old = [];
                    $scope.hall_old_ids = [];
                    $scope.form_commission.clearErrors();
                }

            }
            //彈出公共設定頁面
            $scope.showCommission = function (hall_name, hall_id) {
//                if($scope.hall_old_ids.indexOf(hall_id) >= 0){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/commission/commission-common-rule-detail.html",
                    controller: 'commissionCommonRuleDetailCtrl',
                    windowClass: 'xlg-modal',
                    resolve: {
                        hall_name: function () {
                            return hall_name;
                        },
                        hall_id: function () {
                            return hall_id;
                        },
                        commissions: function () {
                            return $scope.commissions;
                        }
                    }
                });
                modalInstance.result.then((function (commission_detail) {
                    if (commission_detail) {
                        if ($scope.hall_ids.indexOf(commission_detail.commissionRuleHall.hall_id) < 0 && $scope.all_halls.length != $scope.commissions.commissionRuleHalls.length) {
                            $scope.hall_ids.push(commission_detail.commissionRuleHall.hall_id);
                            $scope.hall_old_ids.push(commission_detail.commissionRuleHall.hall_id);
                            $scope.commissions.commissionRuleHalls.push({
                                "hall_id": hall_id,
                                "commission_total": commission_detail.commissionRuleCommon.commission_total,
                                "integral_total": commission_detail.commissionRuleCommon.integral_total,
                                "recycle_rate_total": commission_detail.commissionRuleCommon.recycle_rate_total,
                                "integral_expire": commission_detail.commissionRuleCommon.integral_expire,
                                "commissionRuleHallSubs": commission_detail.commissionRuleCommon.commissionRuleCommonSubs,
                                "compAgentRuleHalls": commission_detail.commissionRuleCommon.compAgentRules
                            });
                        } else {
                            angular.forEach($scope.commissions.commissionRuleHalls, function (commissionRuleHall) {
                                if (commission_detail.commissionRuleHall.hall_id && commissionRuleHall.hall_id == commission_detail.commissionRuleHall.hall_id) {
                                    $scope.hall_old_ids.push(commission_detail.commissionRuleHall.hall_id);
                                    commissionRuleHall.commission_total = commission_detail.commissionRuleCommon.commission_total;
                                    commissionRuleHall.integral_total = commission_detail.commissionRuleCommon.integral_total;
                                    commissionRuleHall.recycle_rate_total = commission_detail.commissionRuleCommon.recycle_rate_total;
                                    commissionRuleHall.integral_expire = commission_detail.commissionRuleCommon.integral_expire;
                                    commissionRuleHall.commissionRuleHallSubs = [];
                                    commissionRuleHall.compAgentRuleHalls = [];
                                    commissionRuleHall.commissionRuleHallSubs = commission_detail.commissionRuleCommon.commissionRuleCommonSubs;
                                    commissionRuleHall.compAgentRuleHalls = commission_detail.commissionRuleCommon.compAgentRules;
                                    angular.forEach(commissionRuleHall.compAgentRuleHalls, function (compAgentRuleHall) {
                                        if (commissionRuleHall.id && !compAgentRuleHall.commission_rule_hall_id) {
                                            compAgentRuleHall.commission_rule_hall_id = commissionRuleHall.id;
                                        }
                                    });
                                }
                            });
                        }
                    }
                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });
//                }
            }
            //重置
            $scope.reset = function () {
                if ($scope.commissions.id) {
                    $scope.sub_post = 'PUT';
                    $scope.update_diable = true;
                    $scope.hall_check_alls.hall_check_all1 = true;
                    $scope.hall_check_alls.hall_check_all2 = true;
                    $scope.hall_check_all1();
                    $scope.hall_check_all2();
                    $scope.commissions = angular.copy($scope.commissions_update);
                    $scope.hall_ids = [];
                    $scope.commissions_old = [];
                    $scope.hall_old_ids = [];
                    $scope.form_commission.clearErrors();
                } else {
                    $scope.sub_post = 'POST';
                    $scope.update_diable = false;
                    $scope.hall_check_alls.hall_check_all1 = false;
                    $scope.hall_check_alls.hall_check_all2 = false;
                    $scope.hall_check_all1();
                    $scope.hall_check_all2();
                    $scope.commissions = angular.copy(original);
                    $scope.commissions.commissionRuleHalls.splice(0, 1);
                    $scope.hall_ids = [];
                    $scope.commissions_old = [];
                    $scope.hall_old_ids = [];
                    $scope.form_commission.clearErrors();
                }
            }
            //提交
            $scope.disabled_submit = false;
            $scope.add = function () {
                if ($scope.disabled_submit) {
                    return $scope.disabled_submit;
                }
                if ($scope.all_halls.length != $scope.commissions.commissionRuleHalls.length) {
                    topAlert.warning("還有廳館沒有設置！");
                    return;
                }
                angular.forEach($scope.commissions.commissionRuleHalls, function (commissionRuleHalls) {
                    for (var i = 0; i < commissionRuleHalls.compAgentRuleHalls.length; i++) {
                        if ((commissionRuleHalls.compAgentRuleHalls[i].agent_info_id == '' || commissionRuleHalls.compAgentRuleHalls[i].agent_info_id == null) && (commissionRuleHalls.compAgentRuleHalls[i].commission_should == '' || commissionRuleHalls.compAgentRuleHalls[i].commission_should == null) && (commissionRuleHalls.compAgentRuleHalls[i].integral_should == '' || commissionRuleHalls.compAgentRuleHalls[i].integral_should == null) && (commissionRuleHalls.compAgentRuleHalls[i].recycle_rate == '' || commissionRuleHalls.compAgentRuleHalls[i].recycle_rate == null) && (commissionRuleHalls.compAgentRuleHalls[i].integral_recycle_agent_id == '' || commissionRuleHalls.compAgentRuleHalls[i].integral_recycle_agent_id == null)) {
                            commissionRuleHalls.compAgentRuleHalls.splice(i, 1);
                            i = 0;
                        }
                    }
                    if (!angular.isUndefined(commissionRuleHalls.compAgentRuleHalls[0])) {
                        if ((commissionRuleHalls.compAgentRuleHalls[0].agent_info_id == '' || commissionRuleHalls.compAgentRuleHalls[0].agent_info_id == null) && (commissionRuleHalls.compAgentRuleHalls[0].commission_should == '' || commissionRuleHalls.compAgentRuleHalls[0].commission_should == null) && (commissionRuleHalls.compAgentRuleHalls[0].integral_should == '' || commissionRuleHalls.compAgentRuleHalls[0].integral_should == null) && (commissionRuleHalls.compAgentRuleHalls[0].recycle_rate == '' || commissionRuleHalls.compAgentRuleHalls[0].recycle_rate == null) && (commissionRuleHalls.compAgentRuleHalls[0].integral_recycle_agent_id == '' || commissionRuleHalls.compAgentRuleHalls[0].integral_recycle_agent_id == null)) {
                            commissionRuleHalls.compAgentRuleHalls = [];
                        }
                    }
                });
                for (var i = 0; i < $scope.commissions.commissionRuleCommon.compAgentRules.length; i++) {
                    if (($scope.commissions.commissionRuleCommon.compAgentRules[i].agent_info_id == '' || $scope.commissions.commissionRuleCommon.compAgentRules[i].agent_info_id == null) && ($scope.commissions.commissionRuleCommon.compAgentRules[i].commission_should == '' || $scope.commissions.commissionRuleCommon.compAgentRules[i].commission_should == null) && ($scope.commissions.commissionRuleCommon.compAgentRules[i].integral_should == '' || $scope.commissions.commissionRuleCommon.compAgentRules[i].integral_should == null) && ($scope.commissions.commissionRuleCommon.compAgentRules[i].recycle_rate == '' || $scope.commissions.commissionRuleCommon.compAgentRules[i].recycle_rate == null) && ($scope.commissions.commissionRuleCommon.compAgentRules[i].integral_recycle_agent_id == '' || $scope.commissions.commissionRuleCommon.compAgentRules[i].integral_recycle_agent_id == null)) {
                        $scope.commissions.commissionRuleCommon.compAgentRules.splice(i, 1);
                        i = 0;
                    }
                }
                if (!angular.isUndefined($scope.commissions.commissionRuleCommon.compAgentRules[0])) {
                    if (($scope.commissions.commissionRuleCommon.compAgentRules[0].agent_info_id == '' || $scope.commissions.commissionRuleCommon.compAgentRules[0].agent_info_id == null) && ($scope.commissions.commissionRuleCommon.compAgentRules[0].commission_should == '' || $scope.commissions.commissionRuleCommon.compAgentRules[0].commission_should == null) && ($scope.commissions.commissionRuleCommon.compAgentRules[0].integral_should == '' || $scope.commissions.commissionRuleCommon.compAgentRules[0].integral_should == null) && ($scope.commissions.commissionRuleCommon.compAgentRules[0].recycle_rate == '' || $scope.commissions.commissionRuleCommon.compAgentRules[0].recycle_rate == null) && ($scope.commissions.commissionRuleCommon.compAgentRules[0].integral_recycle_agent_id == '' || $scope.commissions.commissionRuleCommon.compAgentRules[0].integral_recycle_agent_id == null)) {
                        $scope.commissions.commissionRuleCommon.compAgentRules = [];
                    }
                }
                if ($scope.commissions.id) {
                    if ($scope.form_commission.checkValidity()) {
                        $scope.disabled_submit = true;
                        commissionRuleNameCommon.update($scope.commissions, function () {
                            topAlert.success("修改成功");
                            $scope.select();
                            $scope.addRule();
                            $scope.disabled_submit = false;
                        }, function () {
                            $scope.disabled_submit = false;
                            if ($scope.commissions.commissionRuleCommon.compAgentRules.length == 0) {
                                $scope.commissions.commissionRuleCommon.compAgentRules.push({
                                    "layer": "0",
                                    "commission_should": "",
                                    "integral_should": "",
                                    "recycle_rate": "",
                                    "is_comp_agent": "1",
                                    "agent_code": "",
                                    "agent_info_id": "",
                                    "integral_recycle_agent_id": ""
                                });
                            }
                        });
                    }
                } else {
                    if ($scope.form_commission.checkValidity()) {
                        $scope.disabled_submit = true;
                        commissionRuleNameCommon.save($scope.commissions, function (response) {
                            topAlert.success("添加成功");
                            $scope.select();
                            $scope.addRule();
                            $scope.disabled_submit = false;
                        }, function () {
                            $scope.disabled_submit = false;
                            if ($scope.commissions.commissionRuleCommon.compAgentRules.length == 0) {
                                $scope.commissions.commissionRuleCommon.compAgentRules.push({
                                    "layer": "0",
                                    "commission_should": "",
                                    "integral_should": "",
                                    "recycle_rate": "",
                                    "is_comp_agent": "1",
                                    "agent_code": "",
                                    "agent_info_id": "",
                                    "integral_recycle_agent_id": ""
                                });
                            }
                        });
                    }
                }
            }
            //規則列表
            //新增規則
            $scope.addRule = function () {
                $scope.sub_post = 'POST';
                $scope.update_diable = false;
                $scope.hall_check_alls.hall_check_all1 = false;
                $scope.hall_check_alls.hall_check_all2 = false;
                $scope.hall_check_all1();
                $scope.hall_check_all2();
                $scope.show_btn = true;
                $scope.commissions = angular.copy(original);
                $scope.commissions.commissionRuleHalls.splice(0, 1);
                $scope.hall_ids = [];
                $scope.commissions_old = [];
                $scope.hall_old_ids = [];
                $scope.form_commission.clearErrors();
            }
            $scope.detail = function (id) {
                $scope.selected_commissions = commissionRuleNameCommon.get(globalFunction.generateUrlParams({id: id}, {commissionRuleCommons: {commissionRuleCommonSubs: ""}}));
            }
            //修改方法
            $scope.update = function (id, status) {
                $scope.addRule();
                $scope.show_btn = status;
                $scope.sub_post = 'PUT';
                $scope.update_diable = true;
                commissionRuleNameCommon.get(globalFunction.generateUrlParams({id: id}, {
                    commissionRuleHalls: {
                        commissionRuleHallSubs: "",
                        compAgentRuleHalls: ""
                    }, commissionRuleCommon: {commissionRuleCommonSubs: "", compAgentRules: ""}
                })).$promise.then(function (commissions) {
                    $scope.commissions = commissions;
                    if ($scope.commissions.commissionRuleCommon.compAgentRules.length == 0) {
                        $scope.commissions.commissionRuleCommon.compAgentRules.push({
                            "layer": "0",
                            "commission_should": "",
                            "integral_should": "",
                            "recycle_rate": "",
                            "is_comp_agent": "1",
                            "agent_code": "",
                            "agent_info_id": "",
                            "integral_recycle_agent_code": "",
                            "integral_recycle_agent_id": ""
                        })
                    }
                    $scope.commissions_update = angular.copy($scope.commissions);
                    $scope.hall_old_ids = $scope.hall_ids = _.pluck($scope.commissions.commissionRuleHalls, "hall_id");
                    $scope.hall_check_alls.hall_check_all1 = true;
                    $scope.hall_check_alls.hall_check_all2 = true;
                    $scope.hall_check_all1();
                    $scope.hall_check_all2();

                });
            }

            $scope.delete = function (id) {
                pinCodeModal(commissionRuleNameCommon, 'delete', {id: id}, '刪除成功！').then(function () {
//                commissionRuleNameCommon.delete({id:id},function(){
                    $scope.select();
                    $scope.update_diable = false;
                    if ($scope.commissions.id == id) {
                        $scope.reset();
                    }
                });
            }
        }]).controller('commissionCommonRuleDetailCtrl', ['$scope', 'commissionRuleNameCommon', 'agentsLists', 'hallName', 'globalFunction', 'capitalTypes', '$modalInstance', 'hall_name', 'hall_id', 'commissions', 'topAlert',
        function ($scope, commissionRuleNameCommon, agentsLists, hallName, globalFunction, capitalTypes, $modalInstance, hall_name, hall_id, commissions, topAlert) {
            //自定義變量

            $scope.commissions_rule_url = globalFunction.getApiUrl('commissionsetting/commissionrulenamecommon');
            $scope.sub_post = 'POST';
            $scope.halls = [];
            $scope.num = 0;
            $scope.userType = ['户口', '上線一', '上線二', '上線三', '上線四', '上線五', '上線六', '上線七', '上線八', '上線九'];
            $scope.user_type = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            $scope.months = [{key: "1", val: "1"}, {key: "2", val: "2"}, {key: "3", val: "3"}, {
                key: "4",
                val: "4"
            }, {key: "5", val: "5"}, {key: "6", val: "6"}, {key: "7", val: "7"}, {key: "8", val: "8"}, {
                key: "9",
                val: "9"
            }, {key: "10", val: "10"}, {key: "11", val: "11"}, {key: "12", val: "12"}, {key: "永久", val: "-1"}];//,{key:"無限",val:"-1"}];
            capitalTypes.query({"capital_type": 1}).$promise.then(function (capitalTypes) {
                $scope.capitaltype = _.findWhere(capitalTypes, {id: commissions.capital_type_id});
            });
            $scope.hall_name = hall_name;
            $scope.commission_detail = {
                "rule_name": commissions.rule_name,
                "capital_type_id": commissions.capital_type_id,
                "integral_expire": commissions.commissionRuleCommon.integral_expire,
                "commissionRuleHall": {"hall_id": hall_id},
//                commissionRuleHalls:commissions.commissionRuleHalls,
                commissionRuleHalls: commissions.commissionRuleHalls,
                commissionRuleCommon: {
                    "commission_total": "",
                    "integral_total": "",
                    "recycle_rate_total": "",
                    "integral_expire": "",
//                    "integral_expire":commissions.commissionRuleCommon.integral_expire,
                    "commissionRuleCommonSubs": [{
                        "layer": "0",
                        "commission_should": 0,
                        "integral_should": 0,
                        "recycle_rate": 0,
                        "integral_recycle_agent_code": "",
                        "integral_recycle_agent_id": ""
                    }, {
                        "layer": "1",
                        "commission_should": 0,
                        "integral_should": 0,
                        "recycle_rate": 0,
                        "integral_recycle_agent_code": "",
                        "integral_recycle_agent_id": ""
                    }, {
                        "layer": "2",
                        "commission_should": 0,
                        "integral_should": 0,
                        "recycle_rate": 0,
                        "integral_recycle_agent_code": "",
                        "integral_recycle_agent_id": ""
                    }],
                    "compAgentRules": [{
                        "layer": "0",
                        "commission_should": 0,
                        "integral_should": 0,
                        "recycle_rate": 0,
                        "is_comp_agent": "1",
                        "agent_code": "",
                        "agent_info_id": "",
                        "integral_recycle_agent_code": "",
                        "integral_recycle_agent_id": ""
                    }]
                }
            }
            $scope.commission_update = {
                "rule_name": commissions.rule_name,
                "capital_type_id": commissions.capital_type_id,
                "integral_expire": "",
                "commissionRuleHall": {"hall_id": hall_id},
                commissionRuleHalls: commissions.commissionRuleHalls,
                commissionRuleCommon: {
                    "commission_total": "",
                    "integral_total": "",
                    "recycle_rate_total": "",
                    "integral_expire": "",
                    "commissionRuleCommonSubs": [],
                    "compAgentRules": []
                }
            }
            var commissionRuleHallSubs_copy = [];
            angular.forEach(commissions.commissionRuleHalls, function (commissionRuleHall) {
                if (commissionRuleHall.hall_id == hall_id) {
                    $scope.commission_detail.commissionRuleHall = angular.copy(commissionRuleHall);
                    $scope.commission_update.commissionRuleHall = angular.copy(commissionRuleHall);
                    $scope.commission_detail.commissionRuleCommon.integral_expire = commissionRuleHall.integral_expire;
                    $scope.commission_update.commissionRuleCommon.integral_expire = commissionRuleHall.integral_expire;
                    $scope.commission_update.commissionRuleCommon.commission_total = commissionRuleHall.commission_total;
                    $scope.commission_update.commissionRuleCommon.integral_total = commissionRuleHall.integral_total;
                    $scope.commission_update.commissionRuleCommon.recycle_rate_total = commissionRuleHall.recycle_rate_total;
                    if (commissionRuleHall.commissionRuleHallSubs.length > 0) {
                        $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs = [];
                        $scope.commission_update.commissionRuleCommon.commissionRuleCommonSubs = [];
                        var commissionRuleHallSubs_copy = angular.copy(commissionRuleHall.commissionRuleHallSubs);
                        _.each(commissionRuleHall.commissionRuleHallSubs, function (commissionRuleHallSub) {
                            $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs.push(angular.copy(commissionRuleHallSub));
                            $scope.commission_update.commissionRuleCommon.commissionRuleCommonSubs.push(angular.copy(commissionRuleHallSub));
                        })
                    }
                    //特別收益戶口
                    if (commissionRuleHall.compAgentRuleHalls.length > 0) {
                        $scope.commission_detail.commissionRuleCommon.compAgentRules = [];
                        $scope.commission_update.commissionRuleCommon.compAgentRules = [];
                        var commissionAgentRuleHallSubs_copy = angular.copy(commissionRuleHall.compAgentRuleHalls);
                        _.each(commissionRuleHall.compAgentRuleHalls, function (commissionAgentRuleHallSub) {
                            $scope.commission_detail.commissionRuleCommon.compAgentRules.push(angular.copy(commissionAgentRuleHallSub));
                            $scope.commission_update.commissionRuleCommon.compAgentRules.push(angular.copy(commissionAgentRuleHallSub));
                        })
                    }
                }
            });
            //特別戶口監控
            $scope.$watch('commission_detail.commissionRuleCommon.compAgentRules', globalFunction.debounce(function (agents, old_agents) {
                angular.forEach(agents, function (agent, index) {
                    if (agent.agent_code) {
                        if (old_agents[index] && old_agents[index].agent_code != agent.agent_code) {
                            agentsLists.query(globalFunction.generateUrlParams({agent_code: agent.agent_code}, {})).$promise.then(function (agent_setting) {
                                if (agent_setting.length > 0) {
                                    $scope.agent = agent_setting[0];
                                    agent.agent_info_id = $scope.agent.id;
                                } else {
                                    agent.agent_info_id = "";
                                }
                            });
                        }
                    } else {
                        agent.agent_info_id = "";
                    }
                    if (agent.integral_recycle_agent_code) {
                        if (old_agents[index] && old_agents[index].integral_recycle_agent_code != agent.integral_recycle_agent_code) {
                            agentsLists.query(globalFunction.generateUrlParams({agent_code: agent.integral_recycle_agent_code}, {})).$promise.then(function (agent_setting) {
                                if (agent_setting.length > 0) {
                                    $scope.agent = agent_setting[0];
                                    agent.integral_recycle_agent_id = $scope.agent.id;
                                } else {
                                    agent.integral_recycle_agent_id = "";
                                }
                            });
                        }
                    } else {
                        agent.integral_recycle_agent_id = "";
                    }
                });
            }, 500), true);
            //戶口監控
            $scope.$watch('commission_detail.commissionRuleCommon.commissionRuleCommonSubs', globalFunction.debounce(function (agents, old_agents) {
                angular.forEach(agents, function (agent, index) {
                    if (agent.integral_recycle_agent_code) {
                        if (old_agents[index] && old_agents[index].integral_recycle_agent_code != agent.integral_recycle_agent_code) {
                            agentsLists.query(globalFunction.generateUrlParams({agent_code: agent.integral_recycle_agent_code}, {})).$promise.then(function (integral_agent_setting) {
                                if (integral_agent_setting.length > 0) {
                                    $scope.integral_agent = integral_agent_setting[0];
                                    agent.integral_recycle_agent_id = $scope.integral_agent.id;
                                } else {
                                    agent.integral_recycle_agent_id = "";
                                }
                            });
                        }
                    } else {
                        agent.integral_recycle_agent_id = "";
                    }
                });
            }, 500), true);
            //佣金总额计算
            $scope.commission_total = function () {
                $scope.c_total = 0;
                for (var j = 0; j < $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs.length; j++) {
                    if ($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[j].commission_should) {
                        $scope.c_total += parseInt($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[j].commission_should);
                    }
                }
                for (var j = 0; j < $scope.commission_detail.commissionRuleCommon.compAgentRules.length; j++) {
                    if ($scope.commission_detail.commissionRuleCommon.compAgentRules[j].commission_should) {
                        $scope.c_total += parseInt($scope.commission_detail.commissionRuleCommon.compAgentRules[j].commission_should);
                    }
                }
                $scope.commission_detail.commissionRuleCommon.commission_total = $scope.c_total;
                return parseInt($scope.c_total);
            }
            //積分
            $scope.integral_total = function () {
                $scope.i_total = 0;
                for (var j = 0; j < $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs.length; j++) {
                    if ($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[j].integral_should) {
                        $scope.i_total += parseInt($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[j].integral_should);
                    }
                }
                for (var j = 0; j < $scope.commission_detail.commissionRuleCommon.compAgentRules.length; j++) {
                    if ($scope.commission_detail.commissionRuleCommon.compAgentRules[j].integral_should) {
                        $scope.i_total += parseInt($scope.commission_detail.commissionRuleCommon.compAgentRules[j].integral_should);
                    }
                }
                $scope.commission_detail.commissionRuleCommon.integral_total = parseInt($scope.i_total);
                return parseInt($scope.i_total);
            }
            //積分回收比例
            $scope.recycle_rate_total = function () {
                $scope.r_total = 0;
                for (var j = 0; j < $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs.length; j++) {
                    if ($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[j].recycle_rate) {
                        $scope.r_total += parseInt($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[j].recycle_rate);
                    }
                }
                for (var j = 0; j < $scope.commission_detail.commissionRuleCommon.compAgentRules.length; j++) {
                    if ($scope.commission_detail.commissionRuleCommon.compAgentRules[j].recycle_rate) {
                        $scope.r_total += parseInt($scope.commission_detail.commissionRuleCommon.compAgentRules[j].recycle_rate);
                    }
                }
                $scope.commission_detail.commissionRuleCommon.recycle_rate_total = parseInt($scope.r_total);
                return parseInt($scope.r_total);
            }
            //新增用戶類型
            $scope.addCommissions = function () {
                $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs.push({
                    "layer": ($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs.length - 1) + "",
                    "commission_should": 0,
                    "integral_should": 0,
                    "recycle_rate": 0,
                    "integral_recycle_agent_id": ""
                });
            }
            //新增特別收益戶口
            $scope.addAgentCommissions = function () {
                $scope.commission_detail.commissionRuleCommon.compAgentRules.push({
                    "layer": ($scope.commission_detail.commissionRuleCommon.compAgentRules.length - 1),
                    "commission_should": 0,
                    "integral_should": 0,
                    "recycle_rate": 0,
                    "is_comp_agent": "1",
                    "agent_info_id": "",
                    "integral_recycle_agent_code": "",
                    "integral_recycle_agent_id": ""
                });
            }
            //刪除用戶類型
            $scope.removeCommissions = function (index) {
                $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs.splice(index, 1);
            }
            //刪除特別收益戶口
            $scope.removeAgentCommissions = function (index) {
                $scope.commission_detail.commissionRuleCommon.compAgentRules.splice(index, 1);
            }
            //修改本廳碼佣規則
            $scope.status = 0;
            $scope.disabled_submit = false;
            $scope.update = function () {
                if ($scope.disabled_submit) {
                    return $scope.disabled_submit;
                }
                $scope.commissionRuleHall_one = {
                    hall_id: hall_id,
                    commissionRuleHallSubs: [],
                    compAgentRuleHalls: [],
                    integral_expire: $scope.commission_detail.commissionRuleCommon.integral_expire,
                    commission_total: $scope.commission_detail.commissionRuleCommon.commission_total,
                    integral_total: $scope.commission_detail.commissionRuleCommon.integral_total,
                    recycle_rate_total: $scope.commission_detail.commissionRuleCommon.recycle_rate_total
                }
                angular.forEach($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs, function (commissionRuleCommonSub) {
                    $scope.commissionRuleHall_one.commissionRuleHallSubs.push({
                        "layer": commissionRuleCommonSub.layer,
                        "commission_should": commissionRuleCommonSub.commission_should,
                        "integral_should": commissionRuleCommonSub.integral_should,
                        "recycle_rate": commissionRuleCommonSub.recycle_rate,
                        "agent_code": commissionRuleCommonSub.agent_code,
                        "agent_info_id": commissionRuleCommonSub.agent_info_id,
                        "integral_recycle_agent_code": commissionRuleCommonSub.integral_recycle_agent_code,
                        "integral_recycle_agent_id": commissionRuleCommonSub.integral_recycle_agent_id
                    });
                });
                angular.forEach($scope.commission_detail.commissionRuleCommon.compAgentRules, function (compAgentRule) {
                    $scope.commissionRuleHall_one.compAgentRuleHalls.push(compAgentRule);
                });
                for (var i = 0; i < $scope.commissionRuleHall_one.compAgentRuleHalls.length; i++) {
                    if (($scope.commissionRuleHall_one.compAgentRuleHalls[i].agent_info_id == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[i].agent_info_id == null) && ($scope.commissionRuleHall_one.compAgentRuleHalls[i].commission_should == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[i].commission_should == null) && ($scope.commissionRuleHall_one.compAgentRuleHalls[i].integral_should == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[i].integral_should == null) && ($scope.commissionRuleHall_one.compAgentRuleHalls[i].recycle_rate == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[i].recycle_rate == null) && ($scope.commissionRuleHall_one.compAgentRuleHalls[i].integral_recycle_agent_id == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[i].integral_recycle_agent_id == null)) {
                        $scope.commissionRuleHall_one.compAgentRuleHalls.splice(i, 1);
                        i = 0;
                    }
                }
                if (!angular.isUndefined($scope.commissionRuleHall_one.compAgentRuleHalls[0])) {
                    if (($scope.commissionRuleHall_one.compAgentRuleHalls[0].agent_info_id == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[0].agent_info_id == null) && ($scope.commissionRuleHall_one.compAgentRuleHalls[0].commission_should == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[0].commission_should == null) && ($scope.commissionRuleHall_one.compAgentRuleHalls[0].integral_should == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[0].integral_should == null) && ($scope.commissionRuleHall_one.compAgentRuleHalls[0].recycle_rate == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[0].recycle_rate == null) && ($scope.commissionRuleHall_one.compAgentRuleHalls[0].integral_recycle_agent_id == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[0].integral_recycle_agent_id == null)) {
                        $scope.commissionRuleHall_one.compAgentRuleHalls = [];
                    }
                }
                if ($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[0].commission_should <= 0) {
                    topAlert.warning("戶口分派佣金額不能小於 0");
                    return;
                }
                $scope.disabled_submit = true;
                $scope.form_commission.checkPreValidity('POST', 'commissionsetting/commissionrulenamecommon/create-validate', commissionRuleNameCommon.createValidate, {"commissionRuleHalls": [$scope.commissionRuleHall_one]}).then(function () {
                    $scope.form_commission.clearErrors();
                    $modalInstance.close($scope.commission_detail);
                    $scope.disabled_submit = false;
                }, function () {
                    $scope.disabled_submit = false;
                });
            }
            //關閉彈出框
            $scope.return = function () {
                $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs = [];
                $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs = commissionRuleHallSubs_copy;
                $modalInstance.close("");
            }

        }]).controller('rollingCardCommonSettingCtrls', ['$scope', 'tmsPagination', 'commissionCardCommon', 'commissionRuleNameCommon', 'agentsLists', 'agentGroup', 'hallName', 'breadcrumb', 'globalFunction', 'topAlert',
        function ($scope, tmsPagination, commissionCardCommon, commissionRuleNameCommon, agentsLists, agentGroup, hallName, breadcrumb, globalFunction, topAlert) {
            //面包屑导航
            breadcrumb.items = [
                {"name": "公共轉碼卡設置", "active": true}
            ];
            //自定義變量
            $scope.userType = ['户口', '下線一', '下線二', '下線三', '下線四', '下線五', '下線六', '下線七', '下線八', '下線九'];
            $scope.cards_url = globalFunction.getApiUrl('commissionsetting/commissioncardcommon');
            $scope.common_cards_url = globalFunction.getApiUrl('commissionsetting/commissioncardcommon/bind_commission_card');
            $scope.rule_names = commissionRuleNameCommon.query({}, {rule_name: ""});
            $scope.query = function () {
                commissionCardCommon.query({"per-page": 1000}).$promise.then(function (commission_cards) { //不分页
                    $scope.commission_cards = commission_cards;
                    _.each($scope.commission_cards, function (commission_cards) {
                        commission_cards.status = 0;
                    })
                });
            }
            $scope.query();

            // $scope.agentsRollings = agentsLists.query();
            //定義from表單
            var original_card_common;
            var init_card_common = {
                "card_name": ""
            }
            original_card_common = angular.copy(init_card_common);
            $scope.card_common = angular.copy(init_card_common);

            hallName.query().$promise.then(function (halls) {
                $scope.halls = halls;
                $scope.commissions.commissionRuleCommons.splice(0, 1);
                for (var i = 0; i < $scope.halls.length; i++) {
                    $scope.commissions.commissionRuleCommons.push({
                        "hall_id": $scope.halls[i].id,
                        "commission_total": "",
                        "integral_total": "",
                        "suit_halls": "",
                        "commissionRuleCommonSubs": [
                            {
                                "layer": "0",
                                "commission_should": "0",
                                "integral_should": "0"
                            },
                            {
                                "layer": "1",
                                "commission_should": "0",
                                "integral_should": "0"
                            },
                            {
                                "layer": "2",
                                "commission_should": "0",
                                "integral_should": "0"
                            }
                        ]
                    });
                }
            });
            //轉碼卡列表
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = commissionCardCommon;
            $scope.pagination.items_per_page = 10;
            $scope.select = function (page) {
                $scope.cards = $scope.pagination.select(page);
            }
            $scope.select();
            //增加卡
            $scope.addCard = function () {
                if ($scope.form_cards.checkValidity()) {
                    $scope.disabled_card_submit = true;
                    commissionCardCommon.save($scope.card_common, function () {
                        topAlert.success("添加成功");
                        $scope.reset();
                        $scope.select();
                        $scope.query();
                        $scope.disabled_card_submit = false;
                    }, function () {
                        $scope.disabled_card_submit = false;
                    });
                }
            }
            //重置卡
            $scope.reset = function () {
                $scope.form_cards.$setPristine();
                $scope.card_common = angular.copy(original_card_common);
                $scope.rolling_cards = angular.copy(init_rolling_cards);
                _.each($scope.commission_cards, function (value) {
                    value.status = 0;
                })
            }
            //刪除公共卡
            $scope.delete = function (id) {
                commissionCardCommon.delete({id: id}, function () {
                    topAlert.warning("刪除成功");
                    $scope.select();
                    $scope.query();
                })
            }
            //公共卡設置
//        var original;
            var init_commission = {
                "rule_name": "",
                "capital_type_id": "",
                "commissionRuleCommons": [
                    {
                        "hall_id": "",
                        "commission_total": "",
                        "integral_total": "",
                        "commissionRuleCommonSubs": [
                            {
                                "layer": "0",
                                "commission_should": "0",
                                "integral_should": "0"
                            }
                        ]
                    }
                ]
            }
            //original = angular.copy(init_commission);
            $scope.commissions = angular.copy(init_commission);
            $scope.agents_rolling = {
                commonCardIDs: [],
                agentInfoIDs: [],
                commonRuleNameID: "",
                agentGroupIDs: [],
                agent_selected: "",
                group_selected: ""
            }
            //轉碼卡
            var original_rolling_cards;
            var init_rolling_cards = [{
                "id": ""
            }];
            original_rolling_cards = angular.copy(init_rolling_cards);
            $scope.rolling_cards = angular.copy(init_rolling_cards);

            $scope.select_rule_name = function () {
                commissionRuleNameCommon.get(globalFunction.generateUrlParams({id: $scope.rule_name}, {
                    commissionCardCommons: {},
                    commissionRuleCommons: {commissionRuleCommonSubs: ""}
                }), function (commissions) {
                    $scope.commissions = commissions;
                    _.each($scope.commission_cards, function (value) {
                        value.status = 0;
                    })
                    if ($scope.commissions.commissionCardCommons.length > 0) {
                        $scope.rolling_cards = [];
                        angular.forEach($scope.commissions.commissionCardCommons, function (commissionCardCommon) {
                            $scope.rolling_cards.push({id: commissionCardCommon.id});
                        });
                        for (var i = 0; i < $scope.commission_cards.length; i++) {
                            for (var j = 0; j < $scope.rolling_cards.length; j++) {
                                if ($scope.rolling_cards[j].id == $scope.commission_cards[i].id) {
                                    $scope.rolling_cards[j].old_commission_card_index = i;
                                    $scope.rolling_cards[j].commission_card_index = i;
                                    $scope.commission_cards[i].status = 1;
                                    continue;
                                }
                            }
                        }
                    } else {
                        $scope.rolling_cards = angular.copy(init_rolling_cards);
                    }
                });
            }

            $scope.addRollingCard = function () {
                if ($scope.rolling_cards.length == $scope.commission_cards.length) {
                    topAlert.warning("轉碼卡不能超出" + $scope.commission_cards.length);
                } else {
                    $scope.rolling_cards.push({"id": ""});
                    _.each($scope.rolling_cards, function (rolling_card) {
                        for (var i = 0; i < $scope.commission_cards.length; i++) {
                            if (rolling_card.id != '' && rolling_card.id == $scope.commission_cards[i].id) {
                                $scope.commission_cards[i].status = 1;
                            }
                        }
                    });
                }
            }

            $scope.updateRollingCard = function (rolling_card) {
                if (rolling_card.old_commission_card_index) {
                    $scope.commission_cards[rolling_card.old_commission_card_index].status = 0;
                }
                rolling_card.old_commission_card_index = rolling_card.commission_card_index;
                if (!angular.isUndefined(rolling_card.commission_card_index)) {
                    $scope.commission_cards[rolling_card.commission_card_index].status = 1;
                    rolling_card.id = $scope.commission_cards[rolling_card.commission_card_index].id;
                } else {
                    rolling_card.id = '';
                }
            }
            $scope.removeRollingCard = function (index) {

                if (!angular.isUndefined($scope.commission_cards[$scope.rolling_cards[index].commission_card_index]))
                    $scope.commission_cards[$scope.rolling_cards[index].commission_card_index].status = 0;
                $scope.rolling_cards.splice(index, 1);
            }

            //綁定線
            $scope.condition_group = {
                agent_group_name: "",
                owner_name: '',
                parent_id: 'null'
            };
            $scope.bind_group = 0;
            $scope.select_group_status = 0;
            $scope.check2 = {
                all1: ""
            }
            //选中值数组
            $scope.check_group_true = [{id: ""}];
            //未选中值数组
            $scope.check_group_false = [{id: ""}];

            $scope.check_group_true.splice(0, 1);
            $scope.check_group_false.splice(0, 1);
            $scope.check_all1 = function () {
                if ($scope.check2.all1) {
                    $scope.select_group_status = 0;
                    _.each($scope.bindingLines, function (ld) {
                        ld.selected = false;
                    });
                    $scope.bind_group = 0;
                    $scope.check_group_true = [];
                    $scope.check_group_false = [];
                } else {
                    $scope.select_group_status = 1;
                    _.each($scope.bindingLines, function (ld) {
                        ld.selected = true;
                    });
                    $scope.bind_group = $scope.pagination_group.total_items - $scope.check_group_false.length;
                    $scope.check_group_true = [];
                    $scope.check_group_false = [];
                }
            }
            //单个复选框选中取消
            $scope.check_group_one = function (ld) {
                if ($scope.select_group_status == 1) {
                    if (ld.selected) {
                        $scope.check_group_false.push({id: ld.id});
                    } else {
                        $scope.check_group_false.splice($scope.check_group_false.indexOf(ld), 1);
                    }
                    $scope.bind_group = $scope.pagination_group.total_items - $scope.check_group_false.length;

                } else {
                    if (ld.selected) {
                        $scope.check_group_true.splice($scope.check_group_true.indexOf(ld), 1);
                    } else {
                        $scope.check_group_true.push({id: ld.id});
                    }
                    $scope.bind_group = $scope.check_group_true.length
                }
            }
            $scope.pagination_group = tmsPagination.create();
            $scope.pagination_group.items_per_page = 5;
            $scope.pagination_group.max_size = 6;
            $scope.pagination_group.resource = agentGroup;
            $scope.select_group = function (page) {
                $scope.bindingLines = $scope.pagination_group.select(page, $scope.condition_group);
                $scope.check_group_false_IDS = _.pluck($scope.check_group_false, 'id');
                $scope.check_group_true_IDS = _.pluck($scope.check_group_true, 'id');
                $scope.bindingLines.$promise.then(function (bindingLines) {
                    _.each(bindingLines, function (bd) {
                        if ($scope.select_group_status == 1) {
                            if ($scope.check_group_false_IDS.length > 0) {
                                if ($scope.check_group_false_IDS.indexOf(bd.id) == -1) {
                                    bd.selected = true;
                                } else {
                                    bd.selected = false;
                                }
                            } else {
                                bd.selected = true;
                            }
                        } else {
                            if ($scope.check_group_true_IDS.length > 0) {
                                if ($scope.check_group_true_IDS.indexOf(bd.id) >= 0) {
                                    bd.selected = true;
                                } else {
                                    bd.selected = false;
                                }
                            } else {
                                bd.selected = false;
                            }
                        }
                    });
                });
            }
            $scope.select_group();

            $scope.search_group = function () {
                $scope.select_group_status = 0;
                $scope.check2.all1 = false;
                $scope.bind_group = 0;
                $scope.check_group_true = [];
                $scope.check_group_false = [];
                $scope.bindingLines = $scope.pagination_group.select(1, $scope.condition_group);
                _.each($scope.bindingLines, function (bd) {
                    bd.selected = false;
                });
            }

            //綁定用戶
            $scope.condition = {
                agentGroup: {agent_group_name: ""},
                agent_code: ''
            };
            $scope.bind_agent = 0;
            $scope.agentsRollings_user = [];
            $scope.select_status = 0;
            $scope.check1 = {all2: ""}
            //选中值数组
            $scope.check_agent_true = [{id: ""}]
            //未选中值数组
            $scope.check_agent_false = [{id: ""}]

            $scope.check_agent_true.splice(0, 1);
            $scope.check_agent_false.splice(0, 1);
            //全选\取消按钮事件
            $scope.check_all2 = function () {
                if ($scope.check1.all2) {
                    $scope.select_status = 0;
                    _.each($scope.agentsRollings, function (ld) {
                        ld.selected = false;
                    });
                    $scope.bind_agent = 0;
                    $scope.check_agent_true = [];
                    $scope.check_agent_false = [];
                } else {
                    $scope.select_status = 1;
                    _.each($scope.agentsRollings, function (ld) {
                        ld.selected = true;
                    });
                    $scope.check_agent_false = [];
                    $scope.check_agent_true = [];
                    $scope.bind_agent = $scope.pagination_common.total_items;
                }

            }
            //单个复选框选中取消
            $scope.check_one = function (ld) {
                if ($scope.select_status == 1) {
                    if (ld.selected) {
                        $scope.check_agent_false.push({id: ld.id});
                    } else {
                        $scope.check_agent_false.splice(_.pluck($scope.check_agent_false, 'id').indexOf(ld.id), 1);
                    }
                    $scope.bind_agent = $scope.pagination_common.total_items - $scope.check_agent_false.length;

                } else {
                    if (ld.selected) {
                        $scope.check_agent_true.splice($scope.check_agent_true.indexOf(ld), 1);
                    } else {
                        $scope.check_agent_true.push({id: ld.id});
                    }
                    $scope.bind_agent = $scope.check_agent_true.length;
                }
            }

            $scope.pagination_common = tmsPagination.create();
            $scope.pagination_common.items_per_page = 5;
            $scope.pagination_common.max_size = 6;
            $scope.pagination_common.resource = agentsLists;
            $scope.select_common = function (page) {
                $scope.agentsRollings = $scope.pagination_common.select(page, $scope.condition);
                $scope.check_false_IDS = _.pluck($scope.check_agent_false, 'id');
                $scope.check_true_IDS = _.pluck($scope.check_agent_true, 'id');
                $scope.agentsRollings.$promise.then(function (agentsRollings) {
                    _.each(agentsRollings, function (ld) {
                        if ($scope.select_status == 1) {
                            if ($scope.check_false_IDS.length > 0) {
                                if ($scope.check_false_IDS.indexOf(ld.id) == -1) {
                                    ld.selected = true;
                                } else {
                                    ld.selected = false;
                                }
                            } else {
                                ld.selected = true;
                            }
                        } else {
                            if ($scope.check_true_IDS.length > 0) {
                                if ($scope.check_true_IDS.indexOf(ld.id) >= 0) {
                                    ld.selected = true;
                                } else {
                                    ld.selected = false;
                                }
                            } else {
                                ld.selected = false;
                            }
                        }
                    });
                });
            }
            $scope.select_common();

            $scope.search = function () {
                $scope.select_status = 0;
                $scope.check1.all2 = false;
                $scope.bind_agent = 0;
                $scope.check_agent_true = [];
                $scope.check_agent_false = [];
                $scope.agentsRollings = $scope.pagination_common.select(1, $scope.condition);
                _.each($scope.agentsRollings, function (ld) {
                    ld.selected = false;
                });
            }
            $scope.add_binging = function () {
                $scope.agents_rolling.commonCardIDs = _.pluck($scope.rolling_cards, 'id');
                $scope.agents_rolling.commonRuleNameID = $scope.commissions.id;
                $scope.agents_rolling.group_selected = $scope.select_group_status;
                $scope.agents_rolling.agent_selected = $scope.select_status;
                if ($scope.select_status == 0) {
                    $scope.agents_rolling.agentInfoIDs = _.pluck($scope.check_agent_true, 'id');
                } else {
                    $scope.agents_rolling.agentInfoIDs = _.pluck($scope.check_agent_false, 'id');
                }
                if ($scope.select_group_status == 0) {
                    $scope.agents_rolling.agentGroupIDs = _.pluck($scope.check_group_true, 'id');
                } else {
                    $scope.agents_rolling.agentGroupIDs = _.pluck($scope.check_group_false, 'id');
                }

                if ($scope.form_common_cards.checkValidity()) {
                    if ($scope.agents_rolling.agentInfoIDs.length > 0 || $scope.agents_rolling.agentGroupIDs.length > 0 || $scope.agents_rolling.group_selected == 1 || $scope.agents_rolling.agent_selected == 1) {
                        $scope.disabled_submit = true;
                        commissionCardCommon.bindCommissionCard($scope.agents_rolling, function () {
                            topAlert.warning("綁定成功");
                            $scope.select();
                            $scope.reset_cards();
                            $scope.disabled_submit = false;
                        }, function () {
                            $scope.disabled_submit = false;
                        });
                    }
                }
            }

            $scope.reset_cards = function () {
                $scope.form_common_cards.$setPristine();
                $scope.rule_name = '';
                $scope.commissions = angular.copy(init_commission);
                $scope.card_common = angular.copy(init_card_common);
                $scope.rolling_cards = angular.copy(original_rolling_cards);
                $scope.commissions.commissionRuleCommons.splice(0, 1);
                for (var i = 0; i < $scope.halls.length; i++) {
                    $scope.commissions.commissionRuleCommons.push({
                        "hall_id": $scope.halls[i].id,
                        "commission_total": "",
                        "integral_total": "",
                        "suit_halls": "",
                        "commissionRuleCommonSubs": [
                            {
                                "layer": "1",
                                "commission_should": "0",
                                "integral_should": "0"
                            },
                            {
                                "layer": "2",
                                "commission_should": "0",
                                "integral_should": "0"
                            },
                            {
                                "layer": "3",
                                "commission_should": "0",
                                "integral_should": "0"
                            }
                        ]
                    });
                }
                //重置線跟用戶

                $scope.check1.all2 = false;
                $scope.check2.all1 = false;
                if ($scope.bind_group > 0) {
                    $scope.pagination_group.select(1).$promise.then(function (agentGroups) {
                        $scope.bindingLines = agentGroups;
                        _.each($scope.bindingLines, function (ag) {
                            ag.selected = false;
                        });
                        $scope.bind_group = 0;
                    });
                }
                if ($scope.bind_agent > 0) {
                    $scope.pagination_common.select(1).$promise.then(function (agents) {
                        $scope.agentsRollings = agents;
                        _.each($scope.agentsRollings, function (ld) {
                            ld.selected = false;
                        });
                        $scope.bind_agent = 0;
                    });
                }
            }
        }]).controller('rollingCardAgentSettingCtrl', ['$scope', 'user','$modal', 'tmsPagination', 'commissionCard', 'commissionRuleNameCommon', 'agentsLists', 'agentGroup', 'rollingCardRecord', 'hallName', 'capitalTypes', 'breadcrumb', 'commissions', 'globalFunction', 'CommissionCardBindStatus', 'pinCodeModal', 'topAlert', '$log', '$filter', 'currentShift', 'settlementMonth', 'getMonths', 'pinCodeUserName', 'commissionMonth', 'getYestermonth', '$stateParams', 'formatNumber',
        function ($scope,user, $modal, tmsPagination, commissionCard, commissionRuleNameCommon, agentsLists, agentGroup, rollingCardRecord, hallName, capitalTypes, breadcrumb, commissions, globalFunction, CommissionCardBindStatus, pinCodeModal, topAlert, $log, $filter, currentShift, settlementMonth, getMonths, pinCodeUserName, commissionMonth, getYestermonth, $stateParams, formatNumber) {
            //面包屑导航
            breadcrumb.items = [
                {"name": "轉碼卡管理", "active": true}
            ];
//            $scope.userType = agentType.items;
//            $scope.agentType = agentType.items;
            $scope.lastPerson = "";//定義一個全局的操作者
            $scope.newPerson = user.id;//定義一個全局的操作者
            $scope.cards = {};
            $scope.commission_card_bind_status = CommissionCardBindStatus;
            $scope.agents = $scope.commissionRuleNames = [];
            $scope.sub_post = "POST";
            $scope.bindCards = 0;
            $scope.show = true;
            $scope.disabled_submit = true;
            $scope.hall_index = 0;
            $scope.bind_update = -1;
            $scope.userType = ['戶口', '上線一', '上線二', '上線三', '上線四', '上線五', '上線六', '上線七', '上線八', '上線九'];
            $scope.months = [{key: "1", val: "1"}, {key: "2", val: "2"}, {key: "3", val: "3"}, {
                key: "4",
                val: "4"
            }, {key: "5", val: "5"}, {key: "6", val: "6"}, {key: "7", val: "7"}, {key: "8", val: "8"}, {
                key: "9",
                val: "9"
            }, {key: "10", val: "10"}, {key: "11", val: "11"}, {key: "12", val: "12"}, {key: "永久", val: "-1"}];//,{key:"無限",val:"-1"}
            $scope.commissions_card_agent_url = globalFunction.getApiUrl('commissionsetting/commissioncard/bind-card');
            $scope.commissions_hall_url = globalFunction.getApiUrl('commissionsetting/commissionrulenamecommon');

//            $scope.sub_post = "POST";
            $scope.halls = hallName.query(globalFunction.generateUrlParams(null, {id: '', hall_name: ''}));
            capitalTypes.query({"capital_type": 1}).$promise.then(function (capitalTypes) {
                $scope.capitaltypes = capitalTypes;
                $scope.capitaltypes_name = _.pluck($scope.capitaltypes, 'capital_name');
            });

            $scope.rule_names = commissionRuleNameCommon.query(globalFunction.generateUrlParams(null, {
                id: '',
                rule_name: ''
            }));
            $scope.agent_groups = agentGroup.query({sort: "agent_group_name ASC"});
            $scope.commission_rule_name_ommons = [];//規則名稱列表變量
            $scope.title = "綁定轉碼卡";
            $scope.hall_old_ids = [];//数据比较显示！标识

            //綁定用戶
            //轉碼卡列表
            var original_condition;
            var init_condition = {
                agent_group_name: "",
//                agentGroup:{id:""},
                agentInfo: {agent_code: $stateParams.agent_code},
                is_binding: "",
                card_name: "",
                year_month: [''],
                is_amount: $stateParams.agent_code ? "" : "1",//有無轉碼
                sort: "agent_code NUMASC,card_name NUMASC"
            }
            original_condition = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);

            $scope.excel_condition = angular.copy(init_condition);
            $scope.excel_condition.agentGroup_id = "";

            $scope.bind_agent = 0;
            $scope.agentsRollings_user = [];
            $scope.select_status = 0;//0：取消 1：全選
            $scope.check1 = {all1: "", all2: ""};
            //选中值数组
            $scope.check_agent_true = [{id: "", agent_info_id: ""}]
            //未选中值数组
            $scope.check_agent_false = [{id: "", agent_info_id: ""}]
            $scope.check_agent_true.splice(0, 1);
            $scope.check_agent_false.splice(0, 1);
            //全选\取消按钮事件
            $scope.check_all2 = function () {
                if ($scope.check1.all2) {
                    $scope.select_status = 0;
                    _.each($scope.rolling_cards, function (ld) {
                        ld.selected = false;
                    });
                    $scope.bind_agent = 0;
                    $scope.check_agent_true = [];
                    $scope.check_agent_false = [];
                    $scope.check1.all1 = false;
                } else {
                    $scope.select_status = 1;
                    _.each($scope.rolling_cards, function (ld) {
                        ld.selected = true;
                    });
                    $scope.check_agent_false = [];
                    $scope.check_agent_true = [];
                    $scope.check1.all1 = true;
                    // $scope.bind_agent = $scope.pagination_common.total_items;
                }
            }
            //當前列表中選中選出的數據全选\取消按钮事件
            $scope.check_all1 = function () {
                if ($scope.check1.all2) {
                    $scope.select_status = 1;
                } else {
                    $scope.select_status = 0;
                }
                if ($scope.check1.all1) {
                    _.each($scope.rolling_cards, function (ld) {
                        ld.selected = false;
                        $scope.check_agent_true = [];
                        $scope.check_agent_false.push({id: ld.id, agent_info_id: ld.agent_info_id});
                    });
                    $scope.bind_agent = 0;
                } else {
                    _.each($scope.rolling_cards, function (ld) {
                        ld.selected = true;
                        $scope.check_agent_false = [];
                        $scope.check_agent_true.push({id: ld.id, agent_info_id: ld.agent_info_id});
                    });
                }
            }
            //单个复选框选中取消
            $scope.check_one = function (ld) {
                if ($scope.select_status == 1) {
                    if (ld.selected) {
                        $scope.check_agent_false.push({id: ld.id, agent_info_id: ld.agent_info_id});
                    } else {
                        $scope.check_agent_false.splice(_.pluck($scope.check_agent_false, 'id').indexOf(ld.id), 1);
                    }
                } else {
                    if (ld.selected) {
                        $scope.check1.all1 = false;
                        $scope.check_agent_true.splice($scope.check_agent_true.indexOf(ld), 1);
                    } else {
                        $scope.check_agent_true.push({id: ld.id, agent_info_id: ld.agent_info_id});
                        if ($scope.pagination.items_per_page == $scope.check_agent_true.length) {
                            $scope.check1.all1 = true;
                        }
                    }
                }
            }
            //转码卡列表
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = commissionCard;
            $scope.pagination.query_method = "cardLists";
            $scope.pagination.max_size = 1;
            $scope.pagination.items_per_page = 15;
            $scope.page = 1;
            $scope.select = function (page) {
                $scope.page = page;
                $scope.excel_condition = angular.copy($scope.condition);
                $scope.check1.all1 = false;
                $scope.excel_condition.year_month[0] = $filter('date')($scope.condition.year_month[0], 'yyyy-MM');
                var conditions = angular.copy($scope.condition);
                conditions.year_month[0] = $filter('date')(conditions.year_month[0], 'yyyy-MM');
                if (conditions.year_month[0]) {
                    conditions.year_month[0] = conditions.year_month[0] + '-01';
                }
                $scope.rolling_cards = $scope.pagination.select(page, globalFunction.generateUrlParams(conditions, {
                    commissionRules: {commissionRuleSubs: ""},
                    agentGroup: {}
                }));
                $scope.check_false_IDS = _.pluck($scope.check_agent_false, 'id');
                $scope.check_true_IDS = _.pluck($scope.check_agent_true, 'id');

                $scope.rolling_cards.$promise.then(function (agentsRollings) {
                    _.each(agentsRollings, function (ld) {
                        if ($scope.select_status == 1) {
                            if ($scope.check_false_IDS.length > 0) {
                                if ($scope.check_false_IDS.indexOf(ld.id) == -1) {
                                    ld.selected = true;
                                } else {
                                    ld.selected = false;
                                }
                            } else {
                                ld.selected = true;
                            }
                        } else {
                            if ($scope.check_true_IDS.length > 0) {
                                if ($scope.check_true_IDS.indexOf(ld.id) >= 0) {
                                    ld.selected = true;
                                    if ($scope.pagination.items_per_page == $scope.check_true_IDS.length) {
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
            }

            $scope.init_select = function () {
                /*settlementMonth.query({is_settlement:"0",only_current_hall:"0", sort:"year_month ASC"}).$promise.then(function(settlementmonths){
                 if(settlementmonths.length){
                 $scope.condition.year_month[0] = getMonths(settlementmonths[0].year_month);
                 }
                 $scope.select(1);
                 });*/
                commissionMonth.query({
                    'status': '3',
                    'page': 1,
                    'per-page': 1,
                    'sort': 'year_month DESC'
                }).$promise.then(function (commissionMonth) {
                    if (commissionMonth.length) {
                        $scope.condition.year_month[0] = commissionMonth[0] ? getYestermonth(getMonths(commissionMonth[0].year_month), true) : "";
                    }
                    $scope.select(1);
                });
            }
            $scope.init_select();
            //保存成功后去掉複選框選中方法
            $scope.select_check_false = function (page) {
                $scope.page = page;
                $scope.excel_condition = angular.copy($scope.condition);
                $scope.excel_condition.year_month[0] = $filter('date')($scope.condition.year_month[0], 'yyyy-MM');
                var conditions = angular.copy($scope.condition);
                conditions.year_month[0] = $filter('date')(conditions.year_month[0], 'yyyy-MM');
                if (conditions.year_month[0]) {
                    conditions.year_month[0] = conditions.year_month[0] + '-01';
                }
                $scope.rolling_cards = $scope.pagination.select(page, globalFunction.generateUrlParams(conditions, {
                    commissionRules: {commissionRuleSubs: ""},
                    agentGroup: {}
                }));
//                $scope.check_false_IDS = _.pluck($scope.check_agent_false, 'id');
//                $scope.check_true_IDS = _.pluck($scope.check_agent_true, 'id');
//                $scope.rolling_cards.$promise.then(function (agentsRollings) {
//                    _.each(agentsRollings, function(ld){
//                        ld.selected = false;
//                    })
//                });
            }

            $scope.$watch('condition.agent_group_name', globalFunction.debounce(function (new_value) {
                $scope.excel_condition.agentGroup_id = "";
                if (new_value) {
                    agentGroup.query({agent_group_name: new_value}).$promise.then(function (group) {
                        if (group[0]) {
                            $scope.excel_condition.agentGroup_id = group[0].id;
                        }
                    });
                }
            }));

            //搜索方法
            $scope.rolling_cards = [];
            $scope.search = function () {
                $scope.check1.all1 = $scope.check1.all2 = false;
                var conditions = angular.copy($scope.condition);
                conditions.year_month[0] = $filter('date')(conditions.year_month[0], 'yyyy-MM');
                if (conditions.year_month[0]) {
                    conditions.year_month[0] = conditions.year_month[0] + '-01';
                }
                $scope.excel_condition = angular.copy($scope.condition);
                $scope.excel_condition.year_month[0] = $filter('date')($scope.condition.year_month[0], 'yyyy-MM');
//                if($scope.excel_condition.agent_group_name){
//                    delete $scope.excel_condition.agent_group_name;
//                }
                $scope.rolling_cards = $scope.pagination.select(1, conditions);
            }
            //搜索方法重置
            $scope.reset = function () {

                $scope.condition = angular.copy(_.extend(original_condition, {
                    agentInfo: {agent_code: ""},
                    is_amount: "1"
                }));
                settlementMonth.query({
                    is_current: "1",
                    sort: "year_month DESC"
                }).$promise.then(function (settlementmonths) {
                    $scope.condition.year_month[0] = settlementmonths[0].year_month.replace("-01", "")
                    $scope.select(1);
                });
            }
            //綁定轉碼卡
            var original_rolling_card;
            var init_rolling_card = {
                pin_code: "",
                agent_group: "",
                "commissionCards": [{"agent_info_id": "", "id": ""}],
                "cardSelected": "0",
                cardRule: {
                    "capital_type_id": "",
                    "card_name": "",
                    "rule_name": "",
                    agent_group: "",
                    "agent_code": "",
                    "commission_rule_name": "",
                    "rollingCard_amount": "",
                    "commissionRuleHalls": [
                        {
                            "id": "",
                            "hall_id": "",
                            "commission_total": "",
                            "integral_total": "",
                            "integral_expire": "",
                            "commission_card_id": "",
                            "recycle_rate_total": "",
                            "commissionRuleHallSubs": [
                                {
                                    "id": "",
                                    "commission_rule_id": "",
                                    "layer": "",
                                    "commission_should": "",
                                    "integral_should": "",
                                    "recycle_rate": "",
                                    "recycle_agent_id": "",
                                    "agent_info_id": "",
                                    "integral_recycle_agent_code": "",
                                    "integral_recycle_agent_id": ""
                                }
                            ],
                            "compAgentRuleHalls": [{
                                "layer": "",
                                "commission_should": "",
                                "integral_should": "",
                                "recycle_rate": "",
                                "is_comp_agent": "1",
                                "agent_info_id": "",
                                "integral_recycle_agent_code": "",
                                "integral_recycle_agent_id": ""
                            }]
                        }
                    ]
                }
            }
            original_rolling_card = angular.copy(init_rolling_card);
            $scope.rolling_card = angular.copy(init_rolling_card);
            $scope.rolling_card.commissionCards.splice(0, 1);
            //新增轉碼卡
            $scope.addRollingCard = function () {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/rolling-card/rolling-card-agent-create.html",
                    controller: 'rollingCardAgentCreateCtrls'
                });
                modalInstance.result.then((function (status) {
                    if (status)
                        $scope.select();
                }));
            }

            //廳館排列
            $scope.halls = [];
            $scope.all_halls = [];
            $scope.hall_checked_layout = function () {
                hallName.query({hall_type: "|1", sort: "hall_type"}).$promise.then(function (_halls) {
                    $scope.all_halls = _halls;
                    for (var i = 0; i < Math.ceil($scope.all_halls.length / 2); i++) {
                        $scope.halls.push($scope.all_halls.slice(i * 2, 2 * (i + 1)))
                    }
                });
            }

            //批量綁定
            $scope.bindCards = function () {
//                $scope.resetCards();
//                $scope.bind_update = 2;
//                $scope.disabled_submit = false;

                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/rolling-card/rolling-card-bind.html",
                    controller: 'rollingCardBindCtrl',
                    resolve: {
                        conditions: function () {
                            return $scope.condition;
                        },
                        select_status: function () {
                            return $scope.select_status;
                        },
                        check_agent_true: function () {
                            return $scope.check_agent_true;
                        },
                        check_agent_false: function () {
                            return $scope.check_agent_false;
                        }
                    }
                });
                modalInstance.result.then((function (status) {
                    if (status) {
                        $scope.check1.all2 = false;
                        $scope.check1.all1 = false;
                        $scope.select_status = 0;
                        $scope.select_hall_ids = [];
                        $scope.check_agent_true = [];
                        $scope.check_agent_false = [];
                        $scope.select_check_false($scope.page);
                    }
                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });

            }

            //單條綁定
            $scope.bindCard = function (id, agent_group, agent_code) {
                $scope.resetCards();
                $scope.title = "綁定轉碼卡";
                $scope.rolling_card.cardRule.agent_group = agent_group;
                $scope.rolling_card.cardRule.agent_code = agent_code;
                $scope.hall_index = 0;
                $scope.bind_update = 1;
                $scope.hall_id = '';
                $scope.commission_rule_id = "";
                $scope.disabled_submit = false;
                $scope.bind_commission_card_id = id;
                $scope.capitaltype_disabled = false;
                $scope.rolling_card.commissionCards.splice(0, 1);
                commissionCard.get(globalFunction.generateUrlParams({id: id}, {
                    commissionRules: {commissionRuleSubs: ""},
                    agentInfo: {}
                })).$promise.then(function (commissionRuleNameCommons) {
                    agentsLists.get(globalFunction.generateUrlParams({id: commissionRuleNameCommons.agentInfo.id}, {level: {}})).$promise.then(function (agents) {
                        $scope.agents = agents;
                    });
                    $scope.rolling_card.commissionCards.push({
                        "id": id,
                        "agent_info_id": commissionRuleNameCommons.agent_info_id
                    });
                    $scope.rolling_card.cardRule.capital_type_id = commissionRuleNameCommons.capital_type_id;
                    $scope.rolling_card.cardRule.card_name = commissionRuleNameCommons.card_name;
                    if ($scope.capitaltypes_name.indexOf($scope.rolling_card.cardRule.card_name) != -1) {
                        $scope.capitaltype_disabled = true;
                    }
                });
            }
            //修改
            $scope.update = function (id, agent_group, agent_code) {
                $scope.resetCards();
                $scope.bind_update = 0;
                $scope.title = "修改綁定轉碼卡";
                $scope.hall_index = 0;
                $scope.rolling_card.cardRule.agent_group = agent_group;
                $scope.rolling_card.cardRule.agent_code = agent_code;
                $scope.hall_id = '';
                $scope.disabled_submit = false;
                $scope.commission_rule_id = "";
                $scope.select_hall_ids = [];
                $scope.show_hall_id = "";
                $scope.bind_commission_card_id = id;
                var condition = {id: id, year_month: ['']};
                condition.year_month[0] = $filter('date')($scope.condition.year_month[0], 'yyyy-MM');
                if (condition.year_month[0]) condition.year_month[0] = condition.year_month[0] + "-01";
                commissionCard.get(globalFunction.generateUrlParams(condition, {
                    commissionRules: {
                        commissionRuleSubs: "",
                        compAgentRules: "",
                        userInfo: ""
                    }, agentInfo: {}
                })).$promise.then(function (commissionRuleNameCommons) {
                    agentsLists.get(globalFunction.generateUrlParams({id: commissionRuleNameCommons.agentInfo.id}, {level: {}})).$promise.then(function (agents) {
                        $scope.agents = agents;
                    });
                    $scope.capitaltype_disabled = false;
                    $scope.rolling_card.commissionCards.splice(0, 1);
                    $scope.rolling_card.commissionCards.push({
                        "id": id,
                        "agent_info_id": commissionRuleNameCommons.agent_info_id
                    });
                    $scope.rolling_card.cardRule.capital_type_id = commissionRuleNameCommons.capital_type_id;
                    $scope.rolling_card.cardRule.card_name = commissionRuleNameCommons.card_name;
                    $scope.rolling_card.cardRule.agent_code = commissionRuleNameCommons.agent_code;
                    $scope.rolling_card.cardRule.hall_name = commissionRuleNameCommons.hall_name;
                    $scope.rolling_card.id = commissionRuleNameCommons.id;
                    $scope.rolling_card.cardRule.commission_rule_name = commissionRuleNameCommons.commission_rule_name;
                    $scope.rolling_card.commission_rule_name = commissionRuleNameCommons.commission_rule_name;
                    $scope.rolling_card.cardRule.commissionRuleHalls.splice(0, 1);
                    if ($scope.capitaltypes_name.indexOf($scope.rolling_card.cardRule.card_name) != -1) {
                        $scope.capitaltype_disabled = true;
                    }
                    //$scope.rolling_card.cardRule.commissionRuleHalls = commissionRuleNameCommons.commissionRules;
                    angular.forEach(commissionRuleNameCommons.commissionRules, function (commissionRule, index) {
                        $scope.lastPerson = commissionRule.userInfo[0].name,//上一次操作者名字
                          $scope.lastPersonId = commissionRule.userInfo[0].id,//上一次操作者id
                        $scope.rolling_card.cardRule.commissionRuleHalls.push({
                            "id": commissionRule.id,
                            "hall_id": commissionRule.hall_id,
                            "commission_total": commissionRule.commission_total,
                            "integral_total": commissionRule.integral_total,
                            "integral_expire": commissionRule.integral_expire,
                            "commission_card_id": commissionRule.commission_card_id,
                            "recycle_rate_total": commissionRule.recycle_rate_total,
                            "commission_should": commissionRule.commission_should,
                            "integral_should": commissionRule.integral_should,
                            "recycle_rate": commissionRule.recycle_rate,
                            "hall_name": commissionRule.hall_name,
                            "rollingCard_amount": commissionRule.rollingCard_amount,
                            "lastPerson": commissionRule.userInfo[0].name,//上一次操作者
                            "user_id": commissionRule.userInfo[0].id,//上一次操作者
                            "commissionRuleHallSubs": [],
                            "compAgentRuleHalls": []
                        });

                        $scope.rolling_card.cardRule.commissionRuleHalls[index].commissionRuleHallSubs.splice(0, 0, {
                            "id": commissionRule.id,
                            "layer": "0",
                            "agent_code": commissionRuleNameCommons.agent_code,
                            "commission_should": formatNumber(commissionRule.commission_should),
                            "integral_should": formatNumber(commissionRule.integral_should),
                            "recycle_rate": commissionRule.recycle_rate,
                            "is_comp_agent": "0",
                            "integral_recycle_agent_code": commissionRule.integral_recycle_agent_code,
                            "integral_recycle_agent_id": commissionRule.integral_recycle_agent_id
                        });

                        if (commissionRule.commissionRuleSubs.length > 0) {
                            _.each(commissionRule.commissionRuleSubs, function (commissionRuleSub) {
                                $scope.rolling_card.cardRule.commissionRuleHalls[index].commissionRuleHallSubs.push({
                                    "id": commissionRuleSub.id,
                                    "commission_rule_id": commissionRuleSub.commission_rule_id,
                                    "layer": commissionRuleSub.layer,
                                    "commission_should": formatNumber(commissionRuleSub.commission_should),
                                    "integral_should": formatNumber(commissionRuleSub.integral_should),
                                    "recycle_rate": commissionRuleSub.recycle_rate,
                                    "recycle_agent_id": commissionRuleSub.recycle_agent_id,
                                    "agent_info_id": commissionRuleSub.agent_info_id,
                                    "agent_code": commissionRuleSub.agent_code,
                                    "integral_recycle_agent_code": commissionRuleSub.integral_recycle_agent_code,
                                    "integral_recycle_agent_id": commissionRuleSub.integral_recycle_agent_id
                                });
                            })
                        }

                        if (commissionRule.compAgentRules.length > 0) {
                            _.each(commissionRule.compAgentRules, function (compAgentRule) {
                                $scope.rolling_card.cardRule.commissionRuleHalls[index].compAgentRuleHalls.push({
                                    "id": compAgentRule.id,
                                    "layer": compAgentRule.layer,
                                    "commission_should": formatNumber(compAgentRule.commission_should),
                                    "integral_should": formatNumber(compAgentRule.integral_should),
                                    "recycle_rate": compAgentRule.recycle_rate,
                                    "is_comp_agent": "1",
                                    "agent_info_id": compAgentRule.agent_info_id,
                                    "agent_code": compAgentRule.agent_code,
                                    "integral_recycle_agent_code": compAgentRule.integral_recycle_agent_code,
                                    "integral_recycle_agent_id": compAgentRule.integral_recycle_agent_id
                                });
                            })
                        } else {
                            $scope.rolling_card.cardRule.commissionRuleHalls[index].compAgentRuleHalls.push({
//                                "id":compAgentRule.id,
                                "layer": 0,
                                "commission_should": "",
                                "integral_should": "",
                                "recycle_rate": "0",
                                "is_comp_agent": "1",
                                "agent_info_id": "",
                                "agent_code": "",
                                "integral_recycle_agent_code": "",
                                "integral_recycle_agent_id": ""
                            });
                        }
                    });
                    $scope.hall_checked_layout();
                });
            }
            //刪除
            $scope.delete = function (id) {
                pinCodeModal(commissionCard, 'delete', {id: id}, '刪除成功！').then(function () {
                    $scope.select();
                    $scope.resetCards();
                })
            }

            //規則名稱
            $scope.select_rule_name = function () {
                $scope.halls = [];
                $scope.all_halls = [];
                $scope.hall_old_ids = [];
                $scope.select_hall_ids = [];
                $scope.show_hall_id = "";
//                $scope.rolling_card.cardRule.capital_type_id = "";
                $scope.rolling_card.cardRule.commissionRuleHalls = [];
                var condition = {
                    id: $scope.commission_rule_id,
                    commission_card_id: $scope.bind_commission_card_id,
                    year_month: ['']
                };
                if ($scope.commission_rule_id) {
                    condition.year_month[0] = $filter('date')($scope.condition.year_month[0], 'yyyy-MM');
                    if (condition.year_month[0]) condition.year_month[0] = condition.year_month[0] + "-01";
                    commissionRuleNameCommon.get(globalFunction.generateUrlParams(condition, {
                        commissionRuleHalls: {
                            commissionRuleHallSubs: "",
                            compAgentRuleHalls: "",
                            userInfo:""
                        }
                    })).$promise.then(function (commission) {
                        $scope.capitaltype_disabled = false;
                        $scope.rolling_card.cardRule.rule_name = commission.rule_name;
//                        $scope.rolling_card.cardRule.capital_type_id = commission.capital_type_id;
                        $scope.rolling_card.cardRule.commission_rule_name = commission.rule_name;
                        $scope.rolling_card.commission_rule_name = commission.rule_name;
//                        _.each($scope.capitaltypes,function(capitaltype){
//                            $scope.capital_name = capitaltype.capital_name;
//                            if($scope.rolling_card.cardRule.card_name == capitaltype.capital_name){
//                                $scope.capitaltype_disabled = true;
//                            }$scope.lastPerson
//                        })
                        if ($scope.capitaltypes_name.indexOf($scope.rolling_card.cardRule.card_name) < 0) {
                            $scope.rolling_card.cardRule.capital_type_id = commission.capital_type_id;
                        } else {
                            $scope.capitaltype_disabled = true;
                        }
                        //$scope.commission_rule_hall = _.findWhere($scope.commission_rule_name_ommon.commissionRuleHalls,{hall_id:$scope.hall_id});
                        $scope.rolling_card.cardRule.commissionRuleHalls = [];
                        $scope.rolling_card.cardRule.commissionRuleHalls = commission.commissionRuleHalls;
                            _.each($scope.rolling_card.cardRule.commissionRuleHalls,function(d){
                                d.lastPerson = user.name ; //這個是為了在改變全局規則的時候，操作者的名字還在
                                d.user_id = user.id;//這個是為了在改變全局規則的時候，user_id;
                            });
                        $scope.recycle_rate_total = function () {
                            $scope.r_total = 0;
                            for (var j = 0; j < $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs.length; j++) {
                                if ($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[j].recycle_rate) {
                                    $scope.r_total += parseInt($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[j].recycle_rate);
                                }
                            }
                            for (var j = 0; j < $scope.commission_detail.commissionRuleCommon.compAgentRules.length; j++) {
                                if ($scope.commission_detail.commissionRuleCommon.compAgentRules[j].recycle_rate) {
                                    $scope.r_total += parseInt($scope.commission_detail.commissionRuleCommon.compAgentRules[j].recycle_rate);
                                }
                            }
                            $scope.commission_detail.commissionRuleCommon.recycle_rate_total = parseInt($scope.r_total);
                            return parseInt($scope.r_total);
                        }

                        $scope.hall_checked_layout();
                        $scope.agents_level = [];
                        if ($scope.bind_update != 2) {
                            $scope.agents_level = angular.copy($scope.agents);

                            if ($scope.agents_level.level && $scope.agents_level.level.length > 0) {
                                $scope.agents_level.level.reverse();
                            }
                            angular.forEach($scope.rolling_card.cardRule.commissionRuleHalls, function (commissionRuleHall) {
                                if ($scope.agents.level && commissionRuleHall.commissionRuleHallSubs.length == $scope.agents.level.length) {
                                    _.each($scope.agents_level.level, function (level, index) {
                                        commissionRuleHall.commissionRuleHallSubs[index].agent_code = level.agent_code;
                                    })
                                } else if ($scope.agents.level && commissionRuleHall.commissionRuleHallSubs.length > $scope.agents.level.length) {
                                    $scope.commission_should = 0;
                                    $scope.integral_should = 0;
                                    $scope.recycle_rate = 0;
                                    _.each(commissionRuleHall.commissionRuleHallSubs, function (commissionRuleHallSub, index) {

                                        if (!commissionRuleHallSub.agent_code && ($scope.agents.level.length - 1) > 0 && index > ($scope.agents.level.length - 1)) {

                                            commissionRuleHall.commissionRuleHallSubs[index - 1].commission_should = commissionRuleHallSub.commission_should;
                                            commissionRuleHall.commissionRuleHallSubs[index - 1].integral_should = commissionRuleHallSub.integral_should;
                                            commissionRuleHall.commissionRuleHallSubs[index - 1].recycle_rate = commissionRuleHallSub.recycle_rate;
                                            commissionRuleHall.commissionRuleHallSubs[index - 1].integral_recycle_agent_code = commissionRuleHallSub.integral_recycle_agent_code;
                                            commissionRuleHall.commissionRuleHallSubs[index - 1].integral_recycle_agent_id = commissionRuleHallSub.integral_recycle_agent_id;
//                                            commissionRuleHall.commissionRuleHallSubs[0].commission_should = parseFloat(commissionRuleHall.commissionRuleHallSubs[0].commission_should) + parseFloat(commissionRuleHallSub.commission_should);
//                                            commissionRuleHall.commissionRuleHallSubs[0].integral_should = parseFloat(commissionRuleHall.commissionRuleHallSubs[0].integral_should) + parseFloat(commissionRuleHallSub.integral_should);
//                                            commissionRuleHall.commissionRuleHallSubs[0].recycle_rate = parseFloat(commissionRuleHall.commissionRuleHallSubs[0].recycle_rate) + parseFloat(commissionRuleHallSub.recycle_rate);
//                                            commissionRuleHall.commissionRuleHallSubs[0].commission_should = parseFloat(commissionRuleHall.commissionRuleHallSubs[0].commission_should) + parseFloat($scope.commission_rule_hall_subs_copy[index].commission_should);
//                                            commissionRuleHall.commissionRuleHallSubs[0].integral_should = parseFloat(commissionRuleHall.commissionRuleHallSubs[0].integral_should) + parseFloat($scope.commission_rule_hall_subs_copy[index].integral_should);
//                                            commissionRuleHall.commissionRuleHallSubs[0].recycle_rate = parseFloat(commissionRuleHall.commissionRuleHallSubs[0].recycle_rate) + parseFloat($scope.commission_rule_hall_subs_copy[index].recycle_rate);

                                        } else {
//                                            commissionRuleHall.commissionRuleHallSubs[0].commission_should = 0;
//                                            commissionRuleHall.commissionRuleHallSubs[0].integral_should =0;
//                                            commissionRuleHall.commissionRuleHallSubs[0].integral_should =0;
                                            if (index < $scope.agents.level.length && $scope.agents.level.length > 1) {
                                                $scope.commission_should = parseFloat($scope.commission_should) + parseFloat(commissionRuleHallSub.commission_should);
                                                $scope.integral_should = parseFloat($scope.integral_should) + parseFloat(commissionRuleHallSub.integral_should);
                                                $scope.recycle_rate = parseFloat($scope.recycle_rate) + parseFloat(commissionRuleHallSub.recycle_rate);
                                                commissionRuleHall.commissionRuleHallSubs[0].commission_should = $scope.commission_should;
                                                commissionRuleHall.commissionRuleHallSubs[0].integral_should = $scope.integral_should;
                                                commissionRuleHall.commissionRuleHallSubs[0].recycle_rate = $scope.recycle_rate;
//                                                commissionRuleHall.commissionRuleHallSubs[0].recycle_rate = commissionRuleHall.commissionRuleHallSubs[index].recycle_rate;
                                                commissionRuleHall.commissionRuleHallSubs[0].integral_recycle_agent_code = commissionRuleHallSub.integral_recycle_agent_code;
                                                commissionRuleHall.commissionRuleHallSubs[0].integral_recycle_agent_id = commissionRuleHallSub.integral_recycle_agent_id;
                                                commissionRuleHall.commissionRuleHallSubs[index].agent_code = $scope.agents_level.level[index].agent_code;
                                                commissionRuleHall.commissionRuleHallSubs[index].agent_code = $scope.agents_level.level[index].agent_code;
                                            } else {
                                                $scope.commission_should = parseFloat($scope.commission_should) + parseFloat(commissionRuleHallSub.commission_should);
                                                $scope.integral_should = parseFloat($scope.integral_should) + parseFloat(commissionRuleHallSub.integral_should);
                                                $scope.recycle_rate = parseFloat($scope.recycle_rate) + parseFloat(commissionRuleHallSub.recycle_rate);
                                                commissionRuleHall.commissionRuleHallSubs[0].commission_should = $scope.commission_should;
                                                commissionRuleHall.commissionRuleHallSubs[0].integral_should = $scope.integral_should;
                                                commissionRuleHall.commissionRuleHallSubs[0].recycle_rate = $scope.recycle_rate;
//                                                commissionRuleHall.commissionRuleHallSubs[0].recycle_rate =commissionRuleHall.commissionRuleHallSubs[index].recycle_rate;
                                                commissionRuleHall.commissionRuleHallSubs[0].integral_recycle_agent_code = commissionRuleHall.commissionRuleHallSubs[0].integral_recycle_agent_code;
                                                commissionRuleHall.commissionRuleHallSubs[0].integral_recycle_agent_id = commissionRuleHall.commissionRuleHallSubs[0].integral_recycle_agent_id;
                                            }
                                        }
                                    });
                                    if ($scope.agents_level.level.length == 1) {
                                        commissionRuleHall.commissionRuleHallSubs[0].agent_code = $scope.agents_level.level[0].agent_code;
                                    }
                                    var len = angular.copy(commissionRuleHall.commissionRuleHallSubs).length;
                                    for (var i = $scope.agents.level.length; i < len; i++) {
                                        commissionRuleHall.commissionRuleHallSubs.splice((commissionRuleHall.commissionRuleHallSubs.length - 1), 1);
                                    }
                                } else {
                                    _.each($scope.agents_level.level, function (level, index) {
                                        if (index < commissionRuleHall.commissionRuleHallSubs.length) {
                                            commissionRuleHall.commissionRuleHallSubs[index].agent_code = level.agent_code;
                                        }
                                    })
                                    if (parseInt($scope.agents_level.level.length - commissionRuleHall.commissionRuleHallSubs.length) == 1) {
                                        commissionRuleHall.commissionRuleHallSubs.push({
                                            layer: $scope.agents_level.level.length - 1,
                                            agent_code: $scope.agents_level.level[$scope.agents_level.level.length - 1].agent_code,
                                            commission_should: "0",
                                            integral_should: "0",
                                            recycle_rate: "0",
                                            id: commissionRuleHall.id,
                                            commission_rule_hall_id: commissionRuleHall.id,
                                            integral_recycle_agent_code: "",
                                            integral_recycle_agent_id: ""
                                        })
                                    } else {
                                        for (var i = 1; i < 3; i++) {
                                            commissionRuleHall.commissionRuleHallSubs.push({
                                                layer: i,
                                                agent_code: $scope.agents_level.level[i].agent_code,
                                                commission_should: "0",
                                                integral_should: "0",
                                                recycle_rate: "0",
                                                id: commissionRuleHall.id,
                                                commission_rule_hall_id: commissionRuleHall.id,
                                                integral_recycle_agent_code: "",
                                                integral_recycle_agent_id: ""
                                            })
                                        }
                                    }
                                }
                                if (commissionRuleHall.compAgentRuleHalls.length == 0) {
                                    commissionRuleHall.compAgentRuleHalls.push({
//                                "id":compAgentRule.id,
                                        "layer": 0,
                                        "commission_should": "",
                                        "integral_should": "",
                                        "recycle_rate": "0",
                                        "is_comp_agent": "1",
                                        "agent_info_id": "",
                                        "agent_code": "",
                                        "integral_recycle_agent_code": "",
                                        "integral_recycle_agent_id": ""
                                    });
                                }
//                                if(commissionRuleHall.compAgentRuleHalls.length){
//                                    _.each(commissionRuleHall.compAgentRuleHalls,function(compAgentRuleHall){
//                                        commissionRuleHall.commissionRuleHallSubs.push(compAgentRuleHall);
//                                    })
//                                }
                            });//
                        }
                    });
                }
            }

            //彈出公共設定頁面
            $scope.showCommission = function (hall_name, hall_id) {
//                if($scope.hall_old_ids.indexOf(hall_id) >= 0){
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/rolling-card/rolling-card-agent-setting-detail.html",
                    controller: 'rollingCardAgentSettingDetailCtrl',
                    windowClass: 'xlg-modal',
                    resolve: {
                        hall_name: function () {
                            return hall_name;
                        },
                        hall_id: function () {
                            return hall_id;
                        },
                        rolling_card: function () {
                            return $scope.rolling_card;
                        },
                        agents: function () {
                            return $scope.agents;
                        },
                        bind_update: function () {
                            return $scope.bind_update;
                        },
                        commission_rule_id: function () {
                            return $scope.commission_rule_id;
                        },
                        hall_old_ids: function () {
                            return $scope.hall_old_ids;
                        }
                    }
                });
                modalInstance.result.then((function (commission_detail) {
                    if (commission_detail) {
                        angular.forEach($scope.rolling_card.cardRule.commissionRuleHalls, function (commissionRuleHall) {
                            if (commission_detail.commissionRuleHall.hall_id && commissionRuleHall.hall_id == commission_detail.commissionRuleHall.hall_id) {
                                $scope.hall_old_ids.push(commission_detail.commissionRuleHall.hall_id);
                                commissionRuleHall.commission_total = commission_detail.commissionRuleCommon.commission_total;
                                commissionRuleHall.integral_total = commission_detail.commissionRuleCommon.integral_total;
                                commissionRuleHall.recycle_rate_total = commission_detail.commissionRuleCommon.recycle_rate_total;
                                commissionRuleHall.integral_expire = commission_detail.integral_expire;
                                commissionRuleHall.commissionRuleHallSubs = [];
                                commissionRuleHall.compAgentRuleHalls = [];
//                                    commissionRuleHall.commissionRuleHallSubs =angular.copy(commission_detail.commissionRuleCommon.commissionRuleCommonSubs);
                                angular.forEach(commission_detail.commissionRuleCommon.commissionRuleCommonSubs, function (commissionRuleCommonSub) {
                                    commissionRuleHall.commissionRuleHallSubs.push(commissionRuleCommonSub);
                                })
                                angular.forEach(commission_detail.commissionRuleCommon.compAgentRules, function (compAgentRule) {
                                    commissionRuleHall.compAgentRuleHalls.push(compAgentRule);
                                })
                            }
                        });
                    }
                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });
//                }
            }
            //*============根據選中列表的綁定廳館規則修改綁定卡 ===============*/
            $scope.select_commissionRuleHall = "";
            $scope.len;
            $scope.show_hall_id = "";
            //選中某個廳館進行賦值
            $scope.selectCommissionRuleHall = function (select_commissionRuleHall) {

                $scope.len = select_commissionRuleHall.commissionRuleHallSubs.length;
                $scope.select_commissionRuleHall_copy = angular.copy(select_commissionRuleHall);
                $scope.select_commissionRuleHall = angular.copy(select_commissionRuleHall);
                $scope.integral_recycle_agent_code = select_commissionRuleHall.commissionRuleHallSubs[0].integral_recycle_agent_code;
                $scope.show_hall_id = select_commissionRuleHall.hall_id;
//                if(!$scope.select_commissionRuleHall.compAgentRuleHalls.length){
//                    $scope.select_commissionRuleHall.compAgentRuleHalls.push({
//                        "layer": ($scope.select_commissionRuleHall.compAgentRuleHalls.length),
//                        "commission_should": "",
//                        "integral_should": "",
//                        "recycle_rate":"0",
//                        "is_comp_agent": "1",
//                        "agent_info_id": "",
//                        "agent_code":"",
//                        "integral_recycle_agent_code":"",
//                        "integral_recycle_agent_id":""
//                    });
//                }
            }
            //佣金总额计算
            $scope.commission_total = function () {
                $scope.c_total = 0;
                if ($scope.select_commissionRuleHall) {
                    for (var j = 0; j < $scope.select_commissionRuleHall.commissionRuleHallSubs.length; j++) {
                        if ($scope.select_commissionRuleHall.commissionRuleHallSubs[j].commission_should) {
                            $scope.c_total += parseFloat($scope.select_commissionRuleHall.commissionRuleHallSubs[j].commission_should);
                        }
                    }
                    for (var j = 0; j < $scope.select_commissionRuleHall.compAgentRuleHalls.length; j++) {
                        if ($scope.select_commissionRuleHall.compAgentRuleHalls[j].commission_should) {
                            $scope.c_total += parseInt($scope.select_commissionRuleHall.compAgentRuleHalls[j].commission_should);
                        }
                    }
                    $scope.select_commissionRuleHall.commission_total = parseFloat($scope.c_total);
                }
                return parseFloat($scope.c_total);
            }
            //積分
            $scope.integral_total = function () {
                $scope.i_total = 0;
                if ($scope.select_commissionRuleHall) {
                    for (var j = 0; j < $scope.select_commissionRuleHall.commissionRuleHallSubs.length; j++) {
                        if ($scope.select_commissionRuleHall.commissionRuleHallSubs[j].integral_should) {
                            $scope.i_total += parseFloat($scope.select_commissionRuleHall.commissionRuleHallSubs[j].integral_should);
                        }
                    }
                    for (var j = 0; j < $scope.select_commissionRuleHall.compAgentRuleHalls.length; j++) {
                        if ($scope.select_commissionRuleHall.compAgentRuleHalls[j].integral_should) {
                            $scope.i_total += parseInt($scope.select_commissionRuleHall.compAgentRuleHalls[j].integral_should);
                        }
                    }
                    $scope.select_commissionRuleHall.integral_total = parseFloat($scope.i_total);
                }
                return parseFloat($scope.i_total);
            }

            //確定方法
            $scope.select_hall_ids = [];
            $scope.comfire_hall = function () {
                //==============================;
                if (_.isEmpty($scope.select_commissionRuleHall.commissionRuleHallSubs[0].integral_recycle_agent_code)) {
                    $scope.select_commissionRuleHall.commissionRuleHallSubs[0].integral_recycle_agent_id = "";
                }
                $scope.commissions_card_agent_url = globalFunction.getApiUrl('commissionsetting/commissionrulenamecommon');
                $scope.select_commission_rule_halls = _.pluck($scope.rolling_card.cardRule.commissionRuleHalls, "hall_id");

                $scope.commissionRuleHall_one = {
                    hall_id: $scope.select_commissionRuleHall.hall_id,
                    commissionRuleHallSubs: [],
                    compAgentRuleHalls: [],
                    integral_expire: $scope.select_commissionRuleHall.integral_expire,
                    commission_total: $scope.select_commissionRuleHall.commission_total,
                    integral_total: $scope.select_commissionRuleHall.integral_total,
                    recycle_rate_total: $scope.select_commissionRuleHall.recycle_rate_total
                }
                angular.forEach($scope.select_commissionRuleHall.commissionRuleHallSubs, function (commissionRuleCommonSub) {
                    $scope.commissionRuleHall_one.commissionRuleHallSubs.push({
                        "layer": commissionRuleCommonSub.layer,
                        "commission_should": commissionRuleCommonSub.commission_should,
                        "integral_should": commissionRuleCommonSub.integral_should,
                        "recycle_rate": commissionRuleCommonSub.recycle_rate,
                        "agent_code": commissionRuleCommonSub.agent_code,
                        "integral_recycle_agent_code": commissionRuleCommonSub.integral_recycle_agent_code,
                        "integral_recycle_agent_id": commissionRuleCommonSub.integral_recycle_agent_id
                    });
                });
                angular.forEach($scope.select_commissionRuleHall.compAgentRuleHalls, function (commissionRuleCommonSub) {
                    if (commissionRuleCommonSub.agent_info_id) {
                        $scope.commissionRuleHall_one.compAgentRuleHalls.push({
                            "layer": commissionRuleCommonSub.layer,
                            "commission_should": commissionRuleCommonSub.commission_should,
                            "integral_should": commissionRuleCommonSub.integral_should,
                            "recycle_rate": commissionRuleCommonSub.recycle_rate,
                            "agent_code": commissionRuleCommonSub.agent_code,
                            "integral_recycle_agent_code": commissionRuleCommonSub.integral_recycle_agent_code,
                            "integral_recycle_agent_id": commissionRuleCommonSub.integral_recycle_agent_id
                        });
                    }

                });
                $scope.disabled_submit = true;
                $scope.form_bind_card.checkPreValidity('POST', 'commissionsetting/commissionrulenamecommon/create-validate', commissionRuleNameCommon.createValidate, {"commissionRuleHalls": [$scope.commissionRuleHall_one]}).then(function () {
                    $scope.form_bind_card.clearErrors();
                    $scope.disabled_submit = false;
                    _.each($scope.rolling_card.cardRule.commissionRuleHalls, function (commissionRuleHalls) {
                        if (commissionRuleHalls.hall_id == $scope.select_commissionRuleHall.hall_id) {
                            commissionRuleHalls.commission_total = $scope.select_commissionRuleHall.commission_total;
                            commissionRuleHalls.integral_total = $scope.select_commissionRuleHall.integral_total;
                            commissionRuleHalls.integral_expire = $scope.select_commissionRuleHall.integral_expire;
                            commissionRuleHalls.commissionRuleHallSubs = [];
                            commissionRuleHalls.commissionRuleHallSubs = angular.copy($scope.select_commissionRuleHall.commissionRuleHallSubs);
                            commissionRuleHalls.compAgentRuleHalls = [];
                            commissionRuleHalls.lastPerson=user.name;
                            commissionRuleHalls.user_id=user.id;
                            commissionRuleHalls.compAgentRuleHalls = angular.copy($scope.select_commissionRuleHall.compAgentRuleHalls);
                            //commissionRuleHalls = angular.copy($scope.select_commissionRuleHall);
                        }
                    });
                    if ($scope.select_hall_ids.indexOf($scope.select_commissionRuleHall.hall_id) < 0) {
                        $scope.select_hall_ids.push($scope.select_commissionRuleHall.hall_id);
                    }
                    $scope.select_commissionRuleHall = "";
                }, function () {
                    $scope.disabled_submit = false;
                });
            }

            //新增戶口
            $scope.addCommission_agent = function () {
                $scope.commissionRuleHallSubs = _.filter($scope.select_commissionRuleHall.commissionRuleHallSubs, function (commissionRuleHallSub) {
                    return commissionRuleHallSub.disabled != 1;
                })
                //戶口數據
//                $scope.select_commissionRuleHall.commissionRuleHallSubs.push({
//                    "layer": ($scope.select_commissionRuleHall.commissionRuleHallSubs.length),
//                    "commission_should": "",
//                    "integral_should": "",
//                    "recycle_rate": "0",
//                    "agent_code": "",
//                    "agent_info_id": "",
//                    "commission_rule_id":$scope.select_commissionRuleHall.id,
//                    "integral_recycle_agent_code":"",
//                    "integral_recycle_agent_id":"",
//                    "recycle_agent_id":""
//                });
                if ($scope.commissionRuleHallSubs.length >= $scope.agents.level.length) {
                    topAlert.warning('新增戶口條數不能大於戶口本身層級。');
                    return;
                }
                $scope.select_commissionRuleHall.commissionRuleHallSubs.splice($scope.commissionRuleHallSubs.length, 0, {
                    "layer": ($scope.select_commissionRuleHall.commissionRuleHallSubs.length),
                    "commission_should": "",
                    "integral_should": "",
                    "recycle_rate": "0",
                    "agent_code": "",
                    "agent_info_id": "",
                    "commission_rule_id": $scope.select_commissionRuleHall.id,
                    "integral_recycle_agent_code": "",
                    "integral_recycle_agent_id": "",
                    "recycle_agent_id": ""
                });
            }
            //新增特別收益戶口
            $scope.addComp_agent = function () {
                $scope.select_commissionRuleHall.compAgentRuleHalls.push({
                    "layer": ($scope.select_commissionRuleHall.compAgentRuleHalls.length),
                    "commission_should": "",
                    "integral_should": "",
                    "recycle_rate": "0",
                    "is_comp_agent": "1",
                    "agent_code": "",
                    "agent_info_id": "",
                    "integral_recycle_agent_code": "",
                    "integral_recycle_agent_id": ""
                });
            }
            //刪除用戶類型
            $scope.removeCommission_agent = function (index) {
//                $scope.select_commissionRuleHall.commissionRuleHallSubs[index].disabled = 1;
                $scope.select_commissionRuleHall.commissionRuleHallSubs.splice(index, 1);
            }
            //刪除特殊用戶類型
            $scope.removeComp_agent = function (index) {
                $scope.select_commissionRuleHall.compAgentRuleHalls.splice(index, 1);
            }
            //戶口監控監控
            $scope.$watch('select_commissionRuleHall.commissionRuleHallSubs', globalFunction.debounce(function (agents, old_agents) {
                angular.forEach(agents, function (agent, index) {
                    if (agent.agent_code && old_agents) {
                        if (old_agents[index] && old_agents[index].agent_code != agent.agent_code) {
                            agentsLists.query(globalFunction.generateUrlParams({agent_code: agent.agent_code}, {})).$promise.then(function (agent_setting) {
                                if (agent_setting.length > 0) {
                                    $scope.agent = agent_setting[0];
                                    agent.agent_info_id = $scope.agent.id;
                                } else {
                                    agent.agent_info_id = "";
                                }
                            });
                        }
                    } else {
                        agent.agent_info_id = "";
                    }
                });
            }, 500), true);

            //特殊戶口監控監控
            $scope.$watch('select_commissionRuleHall.compAgentRuleHalls', globalFunction.debounce(function (agents, old_agents) {

                angular.forEach(agents, function (agent, index) {
                    if (agent.agent_code && old_agents) {
                        if (old_agents[index] && old_agents[index].agent_code != agent.agent_code) {
                            agentsLists.query(globalFunction.generateUrlParams({agent_code: agent.agent_code}, {})).$promise.then(function (agent_setting) {
                                if (agent_setting.length > 0) {
                                    $scope.agent = agent_setting[0];
                                    agent.agent_info_id = $scope.agent.id;
                                } else {
                                    agent.agent_info_id = "";
                                }
                            });
                        }
                    } else {
                        agent.agent_info_id = "";
                    }
                });
            }, 500), true);

            //顯示列方法
            $scope.showRow = function (commissionRuleHall) {
                if (commissionRuleHall) {
                    var lens = [];
                    var len = 1;
                    len = commissionRuleHall.commissionRuleHallSubs.length + commissionRuleHall.compAgentRuleHalls.length;
                    if (5 - parseInt(len) == 4) {
                        lens = ['1', '2', '3', '4'];
                    } else if (5 - parseInt(len) == 3) {
                        lens = ['1', '2', '3'];
                    } else if (5 - parseInt(len) == 2) {
                        lens = ['1', '2'];
                    } else if (5 - parseInt(len) == 1) {
                        lens = ['1'];
                    }
                }
                return lens;
            }

            //取消方法
            $scope.cancel_hall = function () {
                $scope.select_commissionRuleHall = angular.copy($scope.select_commissionRuleHall_copy);
                $scope.show_hall_id = "";
            }
            //全選廳館
            $scope.hall_select_ids = [];
            $scope.select_hall_status = 0;
            //$scope.hall_check_alls=["hall_check_all1","hall_check_all2"];//定義全選變量
            $scope.hall_select_alls = {"hall_check_all": ""};
            $scope.hall_select_all = function () {
                if ($scope.hall_select_alls.hall_check_all) {
                    $scope.select_hall_status == 0;
                    _.each($scope.rolling_card.cardRule.commissionRuleHalls, function (hall) {
                        hall.selected = true;
                        $scope.hall_select_ids.push(hall.hall_id);
                    });
                } else {
                    $scope.select_hall_status = 1;
                    _.each($scope.rolling_card.cardRule.commissionRuleHalls, function (hall) {
                        hall.selected = false;
                    });
                    $scope.hall_select_ids = [];
                }
            }
            //津贴户口监控
            $scope.integral_recycle_agent_code = "";
            $scope.isAgentDisabled = false;
            $scope.$watch('select_commissionRuleHall.commissionRuleHallSubs[0].integral_recycle_agent_code', globalFunction.debounce(function (new_value, old_value) {

                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value})).$promise.then(function (agents) {
                        if (agents[0]) {
                            $scope.select_commissionRuleHall.commissionRuleHallSubs[0].integral_recycle_agent_code = agents[0].agent_code;
                            $scope.select_commissionRuleHall.commissionRuleHallSubs[0].integral_recycle_agent_id = agents[0].id;
                        }
                    });
                }
            }));
            //单个复选框选中取消
            $scope.select_one = function (ld) {
                if (ld.selected) {
                    if ($scope.hall_select_ids.indexOf(ld.hall_id) > 0) {
                        $scope.hall_select_ids.splice($scope.hall_select_ids.indexOf(ld.hall_id), 1);
                    }
                    $scope.hall_select_alls.hall_check_all = false;
                } else {
                    if ($scope.hall_select_ids.indexOf(ld.hall_id) < 0) {
                        $scope.hall_select_ids.push(ld.hall_id);
                    }
                    if ($scope.hall_select_ids.length == $scope.rolling_card.cardRule.commissionRuleHalls.length) {
                        $scope.hall_select_alls.hall_check_all = true;
                    }
                }
            }

            //選中應用到其他廳館
            $scope.select_commissionRuleHalls = function () {
                if ($scope.hall_select_ids.length) {
                    _.each($scope.rolling_card.cardRule.commissionRuleHalls, function (commissionRuleHalls, num) {
                        if ($scope.hall_select_ids.indexOf(commissionRuleHalls.hall_id) >= 0) {
                            commissionRuleHalls.commission_total = $scope.select_commissionRuleHall.commission_total;
                            commissionRuleHalls.integral_total = $scope.select_commissionRuleHall.integral_total;
                            commissionRuleHalls.integral_expire = $scope.select_commissionRuleHall.integral_expire;
                            if ($scope.select_hall_ids.indexOf(commissionRuleHalls.hall_id) < 0) {
                                $scope.select_hall_ids.push(commissionRuleHalls.hall_id);
                            }
//                            commissionRuleHalls.commissionRuleHallSubs = [];
//                            commissionRuleHalls.commissionRuleHallSubs = angular.copy($scope.select_commissionRuleHall.commissionRuleHallSubs);
                            _.each(commissionRuleHalls.commissionRuleHallSubs, function (commissionRuleHallSub, index) {
//                                if($scope.select_commissionRuleHall.commissionRuleHallSubs[index]){
//                                    commissionRuleHallSub = angular.copy($scope.select_commissionRuleHall.commissionRuleHallSubs);
////                                    commissionRuleHallSub.commission_should = $scope.select_commissionRuleHall.commissionRuleHallSubs[index].commission_should;
////                                    commissionRuleHallSub.integral_should = $scope.select_commissionRuleHall.commissionRuleHallSubs[index].integral_should;
////                                    commissionRuleHallSub.recycle_rate =  $scope.select_commissionRuleHall.commissionRuleHallSubs[index].recycle_rate;
////                                    commissionRuleHallSub.integral_recycle_agent_code =  $scope.select_commissionRuleHall.commissionRuleHallSubs[index].integral_recycle_agent_code;
////                                    commissionRuleHallSub.integral_recycle_agent_id = $scope.select_commissionRuleHall.commissionRuleHallSubs[index].integral_recycle_agent_id
//                                }else{
//                                    commissionRuleHalls.commissionRuleHallSubs.splice(index,1);
//                                }
////                                commissionRuleHallSub = angular.copy($scope.select_commissionRuleHall.commissionRuleHallSubs);
                            })
                            commissionRuleHalls.commissionRuleHallSubs = [];
                            commissionRuleHalls.commissionRuleHallSubs = angular.copy($scope.select_commissionRuleHall.commissionRuleHallSubs);
                            commissionRuleHalls.compAgentRuleHalls = [];
                            commissionRuleHalls.compAgentRuleHalls = angular.copy($scope.select_commissionRuleHall.compAgentRuleHalls);
                        }
                    });
                    _.each($scope.rolling_card.cardRule.commissionRuleHalls, function (hall) {
                        hall.selected = false;
                    })
                    topAlert.warning("成功應用到其他廳館!");
                    $scope.hall_select_ids = [];
                } else {
                    topAlert.warning("請選擇廳館!");
                }
            }
            //批量綁定
            //增加用戶類型
            $scope.addCommissionRuleSub = function () {
                $scope.num = $scope.rolling_card.cardRule.commissionRuleHalls[$scope.hall_index].commissionRuleHallSubs.length;
                $scope.rolling_card.cardRule.commissionRuleHalls[$scope.hall_index].commissionRuleHallSubs.push({
                    "agent_code": "",
                    "layer": $scope.num,
                    "commission_should": "",
                    "integral_should": "",
                    "recycle_rate": ""
                });
            }
            //刪除用戶類型
            $scope.removeCommissionRuleSub = function (index) {
                $scope.rolling_card.cardRule.commissionRuleHalls[$scope.hall_index].commissionRuleHallSubs.splice(index, 1);
            }

            //綁定轉碼卡跟修改轉碼卡
            $scope.disabled_submit = false;
            $scope.add = function () {
                $scope.commissions_card_agent_url = globalFunction.getApiUrl('commissionsetting/commissioncard/bind-card');
                var conditions = angular.copy($scope.condition);
                conditions.year_month[0] = $filter('date')(conditions.year_month[0], 'yyyy-MM-01');
                if ($scope.disabled_submit) {
                    return $scope.disabled_submit;
                }
                angular.forEach($scope.rolling_card.cardRule.commissionRuleHalls, function (commissionRuleHalls) {
                    commissionRuleHalls.recycle_rate_total = 0;
//                    delete commissionRuleHalls.compAgentRuleHalls
                    for (var i = 0; i < commissionRuleHalls.compAgentRuleHalls.length; i++) {
                        if ((commissionRuleHalls.compAgentRuleHalls[i].agent_info_id == '' || commissionRuleHalls.compAgentRuleHalls[i].agent_info_id == null) && (commissionRuleHalls.compAgentRuleHalls[i].commission_should == '' || commissionRuleHalls.compAgentRuleHalls[i].commission_should == null) && (commissionRuleHalls.compAgentRuleHalls[i].integral_should == '' || commissionRuleHalls.compAgentRuleHalls[i].integral_should == null) && (commissionRuleHalls.compAgentRuleHalls[i].recycle_rate == '' || commissionRuleHalls.compAgentRuleHalls[i].recycle_rate == null)) {
                            commissionRuleHalls.compAgentRuleHalls.splice(i, 1);
                            i = 0;
                        }
                    }
                    if (!angular.isUndefined(commissionRuleHalls.compAgentRuleHalls[0])) {
                        if ((commissionRuleHalls.compAgentRuleHalls[0].agent_info_id == '' || commissionRuleHalls.compAgentRuleHalls[0].agent_info_id == null) && (commissionRuleHalls.compAgentRuleHalls[0].commission_should == '' || commissionRuleHalls.compAgentRuleHalls[0].commission_should == null) && (commissionRuleHalls.compAgentRuleHalls[0].integral_should == '' || commissionRuleHalls.compAgentRuleHalls[0].integral_should == null) && (commissionRuleHalls.compAgentRuleHalls[0].recycle_rate == '' || commissionRuleHalls.compAgentRuleHalls[0].recycle_rate == null)) {
                            commissionRuleHalls.compAgentRuleHalls = [];
                        }
                    }
                    $scope.r_total = 0;
                    for (var j = 0; j < commissionRuleHalls.commissionRuleHallSubs.length; j++) {
                        if (commissionRuleHalls.commissionRuleHallSubs[j].recycle_rate) {
                            $scope.r_total += parseInt(commissionRuleHalls.commissionRuleHallSubs[j].recycle_rate);
                        }
                    }
                    for (var j = 0; j < commissionRuleHalls.compAgentRuleHalls.length; j++) {
//                        if(commissionRuleHalls.compAgentRuleHalls[j].recycle_rate){
//                            $scope.r_total += parseInt(commissionRuleHalls.compAgentRuleHalls[j].recycle_rate);
//                        }
                        if (!commissionRuleHalls.compAgentRuleHalls[j].agent_code) {
                            commissionRuleHalls.compAgentRuleHalls = [];
                        }
                    }
                    commissionRuleHalls.recycle_rate_total = parseInt($scope.r_total);

                });
//                return;
//                if($sope.form_bind_card.checkValidity()) {
                if ($scope.bind_update == 0) {
                    $scope.disabled_submit = true;
                    commissionCard.bindCard($scope.rolling_card, function () {
                        topAlert.success("修改成功!");
                        $scope.resetCards();
                        $scope.select($scope.page);
                        $scope.disabled_submit = false;
                        $scope.select_commissionRuleHall = "";
                        $scope.select_hall_ids = [];
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                } else if ($scope.bind_update == 1) {
                    if (!$scope.commission_rule_id) {
                        topAlert.warning("請選擇規則名稱！");
                        return;
                    }
                    $scope.disabled_submit = true;
                    commissionCard.bindCard($scope.rolling_card, function () {
                        topAlert.success("綁定成功!");
                        $scope.resetCards();
                        $scope.select($scope.page);
                        $scope.disabled_submit = false;
                        $scope.select_commissionRuleHall = "";
                        $scope.select_hall_ids = [];
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                } else {
                    if (!$scope.commission_rule_id) {
                        topAlert.warning("請選擇規則名稱！");
                        return;
                    }
                    $scope.rolling_card.commissionCards.splice(0, 1);
                    $scope.rolling_card.cardSelected = $scope.select_status;
                    if ($scope.select_status == 0) {
                        if ($scope.check_agent_true.length > 0) {
                            angular.forEach($scope.check_agent_true, function (cd) {
                                $scope.rolling_card.commissionCards.push({id: cd.id, agent_info_id: cd.agent_info_id});
                            })
                        } else {
                            $scope.rolling_card.commissionCards = [];
                            topAlert.warning("請選擇需要綁定的卡");
                            return;
                        }
                    } else {
                        if ($scope.check_agent_false.length > 0) {
                            angular.forEach($scope.check_agent_false, function (cd) {
                                $scope.rolling_card.commissionCards.push({id: cd.id, agent_info_id: cd.agent_info_id})
                            })
                        } else {
                            $scope.rolling_card.commissionCards = [];
                        }
                    }
                    $scope.disabled_submit = true;
                    commissionCard.bindCard(globalFunction.generateUrlParams(conditions), $scope.rolling_card, function () {
                        topAlert.success("批量綁定成功");
                        $scope.resetCards();
                        $scope.check1.all2 = false;
                        $scope.select_check_false($scope.page);
//                            $scope.check_agent_true = [];
//                            $scope.check_agent_false = [];
//                            $scope.check_all2();
                        $scope.disabled_submit = false;
                        $scope.select_commissionRuleHall = "";
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                }
            }
            //重置轉碼卡
            $scope.resetCards = function () {
                if ($scope.is_locked) {
//                    var pin_code = $scope.record_create.pin_code;
                    var pin_code = $scope.rolling_card.pin_code;
                } else {
                    $scope.username = "";
                }
                $scope.form_bind_card.$setPristine();
                $scope.hall_id = '';
                $scope.title = "綁定轉碼卡";
                $scope.commission_rule_id = "";
                $scope.bind_update = -1;
                $scope.disabled_submit = true;
                $scope.halls = [];
                $scope.all_halls = [];
                $scope.hall_old_ids = [];
                $scope.select_commissionRuleHall = "";
                $scope.select_hall_ids = [];
                $scope.show_hall_id = "";
                $scope.rolling_card = angular.copy(original_rolling_card);
                $scope.rolling_card.pin_code = pin_code;
            }

            /**
             * 操作密码锁定
             * @type {boolean}
             */
            $scope.is_locked = false;
            $scope.isLockedFlag = false;
            $scope.username = "";
            $scope.agent_locked = function (lock) {
                if ($scope.isLockedFlag) {
                    return;
                }
                $scope.isLockedFlag = true;
                if (lock) {
                    if ($scope.rolling_card.pin_code) {
                        //pin_code 查詢用戶
                        pinCodeUserName.save({pin_code: $scope.rolling_card.pin_code}).$promise.then(function (username) {
                            if (username.name == "" || username.name == null) {
                                topAlert.warning("操作密碼不正確！");
                                $scope.isLockedFlag = false;
                                return;
                            } else {
                                $scope.isLockedFlag = false;
                                $scope.username = username.name;
                                $scope.is_locked = lock;
                            }
                        });
                    } else {
                        $scope.isLockedFlag = false;
                        topAlert.warning("請輸入操作密碼！");
                        return;
                    }
                } else {
                    $scope.isLockedFlag = false;
                    $scope.is_locked = lock;
                }

            }


        }]).controller('rollingCardBindCtrl', ['$scope', 'commissionCard', 'commissionRuleNameCommon', 'conditions', 'globalFunction', 'topAlert', 'select_status', 'check_agent_true', 'check_agent_false', '$modalInstance', '$filter',
        function ($scope, commissionCard, commissionRuleNameCommon, conditions, globalFunction, topAlert, select_status, check_agent_true, check_agent_false, $modalInstance, $filter) {

            $scope.select_status = select_status;
            $scope.conditions = angular.copy(conditions);
            $scope.check_agent_true = check_agent_true;
            $scope.check_agent_false = check_agent_false;
            commissionRuleNameCommon.query({}).$promise.then(function (rule_names) {
                $scope.rule_names = rule_names;
                $scope.commission_rule_id = "";
            });

            $scope.rolling_card = {
                pin_code: "",
                agent_group: "",
                "commissionCards": [{"agent_info_id": "", "id": ""}],
                "cardSelected": "0",
                cardRule: {
                    "capital_type_id": "",
                    "capital_type": "",
                    "card_name": "",
                    "rule_name": "",
                    agent_group: "",
                    "agent_code": "",
                    "commission_rule_name": "",
                    "commissionRuleHalls": [
                        {
                            "id": "",
                            "hall_id": "",
                            "commission_total": "",
                            "integral_total": "",
                            "integral_expire": "",
                            "commission_card_id": "",
                            "recycle_rate_total": "",
                            "commissionRuleHallSubs": [
                                {
                                    "id": "",
                                    "commission_rule_id": "",
                                    "layer": "",
                                    "commission_should": "",
                                    "integral_should": "",
                                    "recycle_rate": "",
                                    "recycle_agent_id": "",
                                    "agent_info_id": "",
                                    "integral_recycle_agent_code": "",
                                    "integral_recycle_agent_id": ""
                                }
                            ],
                            "compAgentRuleHalls": [{
                                "layer": "",
                                "commission_should": "",
                                "integral_should": "",
                                "recycle_rate": "",
                                "is_comp_agent": "1",
                                "agent_info_id": "",
                                "integral_recycle_agent_code": "",
                                "integral_recycle_agent_id": ""
                            }]
                        }
                    ]
                }
            }
            $scope.card = {
                commission_rule_id: ""
            }


            //規則名稱
            $scope.select_rule_name = function () {
                $scope.bind_update = 2;
                $scope.commission_rule_id = $scope.card.commission_rule_id;
                $scope.halls = [];
                $scope.all_halls = [];
                $scope.hall_old_ids = [];
                $scope.rolling_card.cardRule.capital_type_id = "";
                $scope.rolling_card.cardRule.commissionRuleHalls = [];
                if ($scope.commission_rule_id) {
                    commissionRuleNameCommon.get(globalFunction.generateUrlParams({id: $scope.commission_rule_id}, {
                        commissionRuleHalls: {
                            commissionRuleHallSubs: "",
                            compAgentRuleHalls: ""
                        }
                    })).$promise.then(function (commission) {
                        $scope.capitaltype_disabled = false;
                        $scope.rolling_card.cardRule.rule_name = commission.rule_name;
                        $scope.rolling_card.cardRule.capital_type_id = commission.capital_type_id;
                        $scope.rolling_card.cardRule.capital_type = commission.capital_type;
                        $scope.rolling_card.cardRule.commission_rule_name = commission.rule_name;
                        _.each($scope.capitaltypes, function (capitaltype) {
                            if (capitaltype.id == $scope.rolling_card.cardRule.capital_type_id) {
                                if ($scope.rolling_card.cardRule.card_name == capitaltype.capital_name) {
                                    $scope.capitaltype_disabled = true;
                                }
                            }
                        })
                        //$scope.commission_rule_hall = _.findWhere($scope.commission_rule_name_ommon.commissionRuleHalls,{hall_id:$scope.hall_id});
                        $scope.rolling_card.cardRule.commissionRuleHalls = [];
                        $scope.rolling_card.cardRule.commissionRuleHalls = commission.commissionRuleHalls;
                        $scope.recycle_rate_total = function () {
                            $scope.r_total = 0;
                            for (var j = 0; j < $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs.length; j++) {
                                if ($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[j].recycle_rate) {
                                    $scope.r_total += parseInt($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[j].recycle_rate);
                                }
                            }
                            for (var j = 0; j < $scope.commission_detail.commissionRuleCommon.compAgentRules.length; j++) {
                                if ($scope.commission_detail.commissionRuleCommon.compAgentRules[j].recycle_rate) {
                                    $scope.r_total += parseInt($scope.commission_detail.commissionRuleCommon.compAgentRules[j].recycle_rate);
                                }
                            }
                            $scope.commission_detail.commissionRuleCommon.recycle_rate_total = parseInt($scope.r_total);
                            return parseInt($scope.r_total);
                        }

//                    $scope.hall_checked_layout();
                        $scope.agents_level = [];
                        if ($scope.bind_update != 2) {
                            $scope.agents_level = angular.copy($scope.agents);
                            if ($scope.agents_level.level && $scope.agents_level.level.length > 0) {
                                $scope.agents_level.level.reverse();
                            }
                            angular.forEach($scope.rolling_card.cardRule.commissionRuleHalls, function (commissionRuleHall) {

                                if ($scope.agents.level && commissionRuleHall.commissionRuleHallSubs.length == $scope.agents.level.length) {
                                    _.each($scope.agents_level.level, function (level, index) {
                                        commissionRuleHall.commissionRuleHallSubs[index].agent_code = level.agent_code;
                                    })
                                } else {
                                    $scope.commission_should = 0;
                                    $scope.integral_should = 0;
                                    $scope.recycle_rate = 0;
                                    _.each(commissionRuleHall.commissionRuleHallSubs, function (commissionRuleHallSub, index) {
                                        if (!commissionRuleHallSub.agent_code && ($scope.agents.level.length - 1) > 0 && index > ($scope.agents.level.length - 1)) {
                                            commissionRuleHall.commissionRuleHallSubs[index - 1].commission_should = commissionRuleHallSub.commission_should;
                                            commissionRuleHall.commissionRuleHallSubs[index - 1].integral_should = commissionRuleHallSub.integral_should;
                                            commissionRuleHall.commissionRuleHallSubs[index - 1].recycle_rate = commissionRuleHallSub.recycle_rate;
                                            commissionRuleHall.commissionRuleHallSubs[index - 1].integral_recycle_agent_code = commissionRuleHallSub.integral_recycle_agent_code;
                                            commissionRuleHall.commissionRuleHallSubs[index - 1].integral_recycle_agent_id = commissionRuleHallSub.integral_recycle_agent_id;

                                        } else {
                                            if (index < $scope.agents.level.length && $scope.agents.level.length > 1) {
                                                $scope.commission_should = parseFloat($scope.commission_should) + parseFloat(commissionRuleHallSub.commission_should);
                                                $scope.integral_should = parseFloat($scope.integral_should) + parseFloat(commissionRuleHallSub.integral_should);
//                                                $scope.recycle_rate = parseFloat($scope.recycle_rate) + parseFloat(commissionRuleHallSub.recycle_rate);
                                                commissionRuleHall.commissionRuleHallSubs[0].commission_should = $scope.commission_should;
                                                commissionRuleHall.commissionRuleHallSubs[0].integral_should = $scope.integral_should;
//                                                commissionRuleHall.commissionRuleHallSubs[0].recycle_rate = $scope.recycle_rate;
                                                commissionRuleHall.commissionRuleHallSubs[0].recycle_rate = commissionRuleHall.commissionRuleHallSubs[index].recycle_rate;
                                                commissionRuleHall.commissionRuleHallSubs[0].integral_recycle_agent_code = commissionRuleHallSub.integral_recycle_agent_code;
                                                commissionRuleHall.commissionRuleHallSubs[0].integral_recycle_agent_id = commissionRuleHallSub.integral_recycle_agent_id;
                                                commissionRuleHall.commissionRuleHallSubs[index].agent_code = $scope.agents_level.level[index].agent_code;
                                                commissionRuleHall.commissionRuleHallSubs[index].agent_code = $scope.agents_level.level[index].agent_code;
                                            } else {
                                                $scope.commission_should = parseFloat($scope.commission_should) + parseFloat(commissionRuleHallSub.commission_should);
                                                $scope.integral_should = parseFloat($scope.integral_should) + parseFloat(commissionRuleHallSub.integral_should);
//                                                $scope.recycle_rate = parseFloat($scope.recycle_rate) + parseFloat(commissionRuleHallSub.recycle_rate);
                                                commissionRuleHall.commissionRuleHallSubs[0].commission_should = $scope.commission_should;
                                                commissionRuleHall.commissionRuleHallSubs[0].integral_should = $scope.integral_should;
//                                                commissionRuleHall.commissionRuleHallSubs[0].recycle_rate = $scope.recycle_rate;
                                                commissionRuleHall.commissionRuleHallSubs[0].recycle_rate = commissionRuleHall.commissionRuleHallSubs[index].recycle_rate;
                                                commissionRuleHall.commissionRuleHallSubs[0].integral_recycle_agent_code = commissionRuleHallSub.integral_recycle_agent_code;
                                                commissionRuleHall.commissionRuleHallSubs[0].integral_recycle_agent_id = commissionRuleHallSub.integral_recycle_agent_id;
                                            }
                                        }
                                    });
                                    if ($scope.agents_level.level.length == 1) {
                                        commissionRuleHall.commissionRuleHallSubs[0].agent_code = $scope.agents_level.level[0].agent_code;
                                    }

                                    var len = angular.copy(commissionRuleHall.commissionRuleHallSubs).length;
                                    for (var i = $scope.agents.level.length; i < len; i++) {
                                        commissionRuleHall.commissionRuleHallSubs.splice((commissionRuleHall.commissionRuleHallSubs.length - 1), 1);
                                    }
                                }
//                            if(commissionRuleHall.compAgentRuleHalls.length){
//                                _.each(commissionRuleHall.compAgentRuleHalls,function(compAgentRuleHall){
//                                    commissionRuleHall.commissionRuleHallSubs.push(compAgentRuleHall);
//                                })
//                            }
                            });//

                        }
                    });
                }
            }

            $scope.add = function () {
                if (!$scope.commission_rule_id) {
                    topAlert.warning("請選擇規則名稱！");
                    return;
                }
                $scope.rolling_card.commissionCards.splice(0, 1);
                $scope.rolling_card.cardSelected = $scope.select_status;
                if ($scope.select_status == 0) {
                    if ($scope.check_agent_true.length > 0) {
                        angular.forEach($scope.check_agent_true, function (cd) {
                            $scope.rolling_card.commissionCards.push({id: cd.id, agent_info_id: cd.agent_info_id});
                        })
                    } else {
                        $scope.rolling_card.commissionCards = [];
                        topAlert.warning("請選擇需要綁定的卡");
                        return;
                    }
                } else {
                    if ($scope.check_agent_false.length > 0) {
                        angular.forEach($scope.check_agent_false, function (cd) {
                            $scope.rolling_card.commissionCards.push({id: cd.id, agent_info_id: cd.agent_info_id})
                        })
                    } else {
                        $scope.rolling_card.commissionCards = [];
                    }
                }
                $scope.conditions.year_month[0] = $filter('date')($scope.conditions.year_month[0], 'yyyy-MM');
                if ($scope.conditions.year_month[0]) {
                    $scope.conditions.year_month[0] = $scope.conditions.year_month[0] + '-01';
                }
                $scope.disabled_submit = true;
                commissionCard.batchBindCard(globalFunction.generateUrlParams($scope.conditions), $scope.rolling_card, function () {
//              commissionCard.bindCard(globalFunction.generateUrlParams($scope.conditions),$scope.rolling_card,function () {
                    topAlert.success("批量綁定成功");
                    $modalInstance.close(true);
                    $scope.disabled_submit = false;
                }, function () {
                    $scope.disabled_submit = false;
                });
            }
            $scope.cancel = function () {
                $modalInstance.close(false);
            }

        }]).controller('rollingCardAgentSettingDetailCtrl', ['$scope', 'commissionRuleNameCommon', 'agentsLists', 'globalFunction', 'agents', 'capitalTypes', '$modalInstance', 'hall_name', 'hall_id', 'commissions', 'rolling_card', 'bind_update', 'commission_rule_id', 'topAlert', 'hall_old_ids',
        function ($scope, commissionRuleNameCommon, agentsLists, globalFunction, agents, capitalTypes, $modalInstance, hall_name, hall_id, commissions, rolling_card, bind_update, commission_rule_id, topAlert, hall_old_ids) {
            //自定義變量
//            $scope.enableClientValidation = true;
            $scope.agents = agents;
            $scope.bind_update = bind_update;
            $scope.commissions_rule_url = globalFunction.getApiUrl('commissionsetting/commissionrulenamecommon');
            $scope.sub_post = 'POST';
            $scope.userType = ['户口', '上線一', '上線二', '上線三', '上線四', '上線五', '上線六', '上線七', '上線八', '上線九'];
            $scope.user_type = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            $scope.months = [{key: "1", val: "1"}, {key: "2", val: "2"}, {key: "3", val: "3"}, {
                key: "4",
                val: "4"
            }, {key: "5", val: "5"}, {key: "6", val: "6"}, {key: "7", val: "7"}, {key: "8", val: "8"}, {
                key: "9",
                val: "9"
            }, {key: "10", val: "10"}, {key: "11", val: "11"}, {key: "12", val: "12"}, {key: "永久", val: "-1"}];//,{key:"無限",val:"-1"}
            capitalTypes.query({"capital_type": 1}).$promise.then(function (capitalTypes) {
                $scope.capitaltype = _.findWhere(capitalTypes, {id: rolling_card.cardRule.capital_type_id});
            });
            $scope.num = 0;
            $scope.hall_name = hall_name;
            $scope.commission_detail = {
                "rule_name": rolling_card.cardRule.rule_name,
                "capital_type_id": rolling_card.cardRule.capital_type_id,
                "integral_expire": "",
                commissionRuleHall: {},
                commissionRuleCommon: {
                    "commission_total": "",
                    "integral_total": "",
                    "recycle_rate_total": "",
                    "integral_expire": "",
                    "commissionRuleCommonSubs": [{
                        "layer": "0",
                        "commission_should": "",
                        "integral_should": "",
                        "recycle_rate": "",
                        "integral_recycle_agent_code": "",
                        "integral_recycle_agent_id": ""

                    }, {
                        "layer": "1",
                        "commission_should": "",
                        "integral_should": "",
                        "recycle_rate": "",
                        "integral_recycle_agent_code": "",
                        "integral_recycle_agent_id": ""
                    }, {
                        "layer": "2",
                        "commission_should": "",
                        "integral_should": "",
                        "recycle_rate": "",
                        "integral_recycle_agent_code": "",
                        "integral_recycle_agent_id": ""
                    }],
                    "compAgentRules": [{
                        "layer": "0",
                        "commission_should": "",
                        "integral_should": "",
                        "recycle_rate": "",
                        "is_comp_agent": "1",
                        "agent_code": "",
                        "agent_info_id": "",
                        "integral_recycle_agent_code": "",
                        "integral_recycle_agent_id": ""
                    }]
                }
            }
            $scope.commission_update = {
                "rule_name": rolling_card.cardRule.rule_name,
                "capital_type_id": rolling_card.cardRule.capital_type_id,
                "integral_expire": "",
                commissionRuleHall: {},
                commissionRuleCommon: {
                    "commission_total": "",
                    "integral_total": "",
                    "recycle_rate_total": "",
                    "integral_expire": "",
                    "commissionRuleCommonSubs": [],
                    "compAgentRules": []
                }
            }

            angular.forEach(rolling_card.cardRule.commissionRuleHalls, function (commissionRuleHall) {
                if (commissionRuleHall.hall_id == hall_id) {
                    $scope.commission_detail.commissionRuleHall = angular.copy(commissionRuleHall);
                    $scope.commission_update.commissionRuleHall = angular.copy(commissionRuleHall);
                    $scope.commission_detail.integral_expire = commissionRuleHall.integral_expire;
                    $scope.commission_update.integral_expire = commissionRuleHall.integral_expire;
                    $scope.commission_update.commissionRuleCommon.commission_total = commissionRuleHall.commission_total;
                    $scope.commission_update.commissionRuleCommon.integral_total = commissionRuleHall.integral_total;
                    $scope.commission_detail.commissionRuleCommon.recycle_rate_total = commissionRuleHall.recycle_rate_total;//測試增加
                    $scope.commission_update.commissionRuleCommon.recycle_rate_total = commissionRuleHall.recycle_rate_total;
                    $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs = [];
                    $scope.commission_update.commissionRuleCommon.commissionRuleCommonSubs = [];
                    $scope.commission_detail.commissionRuleCommon.compAgentRules = [];
                    $scope.commission_update.commissionRuleCommon.compAgentRules = [];
                    if (rolling_card.id) {
                        if (commissionRuleHall.commissionRuleHallSubs.length > 0) {
                            $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs = angular.copy(commissionRuleHall.commissionRuleHallSubs);
                            $scope.commission_update.commissionRuleCommon.commissionRuleCommonSubs = angular.copy(commissionRuleHall.commissionRuleHallSubs);
                        }
                    } else {
                        $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs = angular.copy(commissionRuleHall.commissionRuleHallSubs);
                        $scope.commission_update.commissionRuleCommon.commissionRuleCommonSubs = angular.copy(commissionRuleHall.commissionRuleHallSubs);
                    }
                    if (bind_update != 2 && !rolling_card.id) {
                        $scope.agents_level = angular.copy($scope.agents);
                        $scope.agents_level.level.reverse();
                        if (commissionRuleHall.commissionRuleHallSubs.length == $scope.agents.level.length) {
                            _.each($scope.agents_level.level, function (level, index) {
                                commissionRuleHall.commissionRuleHallSubs[index].agent_code = level.agent_code;
                                $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[index].agent_code = level.agent_code;
                                $scope.commission_update.commissionRuleCommon.commissionRuleCommonSubs[index].agent_code = level.agent_code;
                            })
                        } else {
                            _.each(commissionRuleHall.commissionRuleHallSubs, function (commissionRuleHallSub, index) {
                                if (index < $scope.agents_level.level.length) {
                                    $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[index].agent_code = $scope.agents_level.level[index].agent_code;
                                    $scope.commission_update.commissionRuleCommon.commissionRuleCommonSubs[index].agent_code = $scope.agents_level.level[index].agent_code;
                                }
                            });
                        }
                    }

                    if (commissionRuleHall.compAgentRuleHalls && commissionRuleHall.compAgentRuleHalls.length > 0) {
                        _.each(commissionRuleHall.compAgentRuleHalls, function (compAgentRuleHall) {
                            $scope.commission_detail.commissionRuleCommon.compAgentRules.push(compAgentRuleHall);
                            $scope.commission_update.commissionRuleCommon.compAgentRules.push(compAgentRuleHall);
                        })
                    } else {
                        $scope.commission_detail.commissionRuleCommon.compAgentRules.push({
                            "layer": "0",
                            "commission_should": "",
                            "integral_should": "",
                            "recycle_rate": "",
                            "is_comp_agent": "1",
                            "agent_code": "",
                            "agent_info_id": "",
                            "integral_recycle_agent_code": "",
                            "integral_recycle_agent_id": ""
                        })
                        $scope.commission_update.commissionRuleCommon.compAgentRules.push({
                            "layer": "0",
                            "commission_should": "",
                            "integral_should": "",
                            "recycle_rate": "",
                            "is_comp_agent": "1",
                            "agent_code": "",
                            "agent_info_id": "",
                            "integral_recycle_agent_code": "",
                            "integral_recycle_agent_id": ""
                        })
                    }
                }
            });
            //特殊戶口監控監控
            $scope.$watch('commission_detail.commissionRuleCommon.compAgentRules', globalFunction.debounce(function (agents, old_agents) {
                angular.forEach(agents, function (agent, index) {
                    if (agent.agent_code) {
                        if (old_agents[index] && old_agents[index].agent_code != agent.agent_code) {
                            agentsLists.query(globalFunction.generateUrlParams({agent_code: agent.agent_code}, {})).$promise.then(function (agent_setting) {
                                if (agent_setting.length > 0) {
                                    $scope.agent = agent_setting[0];
                                    agent.agent_info_id = $scope.agent.id;
                                } else {
                                    agent.agent_info_id = "";
                                }
                            });
                        }
                    } else {
                        agent.agent_info_id = "";
                    }
                    if (agent.integral_recycle_agent_code) {
                        if (old_agents[index] && old_agents[index].integral_recycle_agent_code != agent.integral_recycle_agent_code) {
                            agentsLists.query(globalFunction.generateUrlParams({agent_code: agent.integral_recycle_agent_code}, {})).$promise.then(function (agent_setting) {
                                if (agent_setting.length > 0) {
                                    $scope.agent = agent_setting[0];
                                    agent.integral_recycle_agent_id = $scope.agent.id;
                                } else {
                                    agent.integral_recycle_agent_id = "";
                                }
                            });
                        }
                    } else {
                        agent.integral_recycle_agent_id = "";
                    }
                });
            }, 500), true);

            //戶口監控
            $scope.$watch('commission_detail.commissionRuleCommon.commissionRuleCommonSubs', globalFunction.debounce(function (agents, old_agents) {
                angular.forEach(agents, function (agent, index) {
                    if (agent.integral_recycle_agent_code) {
                        if (old_agents[index] && old_agents[index].integral_recycle_agent_code != agent.integral_recycle_agent_code) {
                            agentsLists.query(globalFunction.generateUrlParams({agent_code: agent.integral_recycle_agent_code}, {})).$promise.then(function (integral_agent_setting) {
                                if (integral_agent_setting.length > 0) {
                                    $scope.integral_agent = integral_agent_setting[0];
                                    agent.integral_recycle_agent_id = $scope.integral_agent.id;
                                } else {
                                    agent.integral_recycle_agent_id = "";
                                }
                            });
                        }
                    } else {
                        agent.integral_recycle_agent_id = "";
                    }
                });
            }, 500), true);

            //佣金总额计算
            $scope.commission_total = function () {
                $scope.c_total = 0;
                for (var j = 0; j < $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs.length; j++) {
                    if ($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[j].commission_should) {
                        $scope.c_total += parseFloat($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[j].commission_should);
                    }
                }
                for (var j = 0; j < $scope.commission_detail.commissionRuleCommon.compAgentRules.length; j++) {
                    if ($scope.commission_detail.commissionRuleCommon.compAgentRules[j].commission_should) {
                        $scope.c_total += parseFloat($scope.commission_detail.commissionRuleCommon.compAgentRules[j].commission_should);
                    }
                }
                $scope.commission_detail.commissionRuleCommon.commission_total = parseFloat($scope.c_total);
                return parseFloat($scope.c_total);
            }
            //積分
            $scope.integral_total = function () {
                $scope.i_total = 0;
                for (var j = 0; j < $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs.length; j++) {
                    if ($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[j].integral_should) {
                        $scope.i_total += parseFloat($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[j].integral_should);
                    }
                }
                for (var j = 0; j < $scope.commission_detail.commissionRuleCommon.compAgentRules.length; j++) {
                    if ($scope.commission_detail.commissionRuleCommon.compAgentRules[j].integral_should) {
                        $scope.i_total += parseFloat($scope.commission_detail.commissionRuleCommon.compAgentRules[j].integral_should);
                    }
                }
                $scope.commission_detail.commissionRuleCommon.integral_total = parseFloat($scope.i_total);
                return parseFloat($scope.i_total);
            }
            //積分回收比例
            $scope.recycle_rate_total = function () {
                $scope.r_total = 0;
                for (var j = 0; j < $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs.length; j++) {
                    if ($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[j].recycle_rate) {
                        $scope.r_total += parseFloat($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[j].recycle_rate);
                    }
                }
                for (var j = 0; j < $scope.commission_detail.commissionRuleCommon.compAgentRules.length; j++) {
                    if ($scope.commission_detail.commissionRuleCommon.compAgentRules[j].recycle_rate) {
                        $scope.r_total += parseFloat($scope.commission_detail.commissionRuleCommon.compAgentRules[j].recycle_rate);
                    }
                }
                $scope.commission_detail.commissionRuleCommon.recycle_rate_total = parseFloat($scope.r_total);
                return parseFloat($scope.r_total);
            }
            $scope.recycle_rate_update_total = function () {
                $scope.r_update_total = 0;
                for (var j = 0; j < $scope.commission_update.commissionRuleCommon.commissionRuleCommonSubs.length; j++) {
                    if ($scope.commission_update.commissionRuleCommon.commissionRuleCommonSubs[j].recycle_rate) {
                        $scope.r_update_total += parseFloat($scope.commission_update.commissionRuleCommon.commissionRuleCommonSubs[j].recycle_rate);
                    }
                }
                for (var j = 0; j < $scope.commission_update.commissionRuleCommon.compAgentRules.length; j++) {
                    if ($scope.commission_update.commissionRuleCommon.compAgentRules[j].recycle_rate) {
                        $scope.r_update_total += parseFloat($scope.commission_update.commissionRuleCommon.compAgentRules[j].recycle_rate);
                    }
                }
                $scope.commission_update.commissionRuleCommon.recycle_rate_total = parseInt($scope.r_update_total);
                return parseFloat($scope.r_update_total);
            }
            //新增用戶類型
            $scope.addCommissions = function () {
                $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs.push({
                    "layer": ($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs.length) + "",
                    "commission_should": "",
                    "integral_should": "",
                    "recycle_rate": "",
                    "agent_code": "",
                    "integral_recycle_agent_code": "",
                    "integral_recycle_agent_id": ""
                });
            }
            //新增特別收益戶口
            $scope.addAgentCommissions = function () {
                $scope.commission_detail.commissionRuleCommon.compAgentRules.push({
                    "layer": ($scope.commission_detail.commissionRuleCommon.compAgentRules.length - 1),
                    "commission_should": "",
                    "integral_should": "",
                    "recycle_rate": "",
                    "is_comp_agent": "1",
                    "agent_info_id": "",
                    "integral_recycle_agent_code": "",
                    "integral_recycle_agent_id": ""
                });
            }
            //刪除用戶類型
            $scope.removeCommissions = function (index) {
                $scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs.splice(index, 1);
            }
            //新增特別收益戶口
            $scope.removeAgentCommissions = function (index) {
                $scope.commission_detail.commissionRuleCommon.compAgentRules.splice(index, 1);
            }
            //修改本廳碼佣規則
            $scope.status = 0;
            $scope.update = function () {
                $scope.commissionRuleHall_one = {
                    hall_id: hall_id,
                    commissionRuleHallSubs: [],
                    compAgentRuleHalls: [],
                    integral_expire: $scope.commission_detail.integral_expire,
                    commission_total: $scope.commission_detail.commissionRuleCommon.commission_total,
                    integral_total: $scope.commission_detail.commissionRuleCommon.integral_total,
                    recycle_rate_total: $scope.commission_detail.commissionRuleCommon.recycle_rate_total
                }
                angular.forEach($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs, function (commissionRuleCommonSub) {
                    $scope.commissionRuleHall_one.commissionRuleHallSubs.push({
                        "layer": commissionRuleCommonSub.layer,
                        "commission_should": commissionRuleCommonSub.commission_should,
                        "integral_should": commissionRuleCommonSub.integral_should,
                        "recycle_rate": commissionRuleCommonSub.recycle_rate,
                        "agent_code": commissionRuleCommonSub.agent_code,
                        "integral_recycle_agent_code": commissionRuleCommonSub.integral_recycle_agent_code,
                        "integral_recycle_agent_id": commissionRuleCommonSub.integral_recycle_agent_id
                    });
                });
                angular.forEach($scope.commission_detail.commissionRuleCommon.compAgentRules, function (compAgentRule) {
                    $scope.commissionRuleHall_one.compAgentRuleHalls.push(compAgentRule);
                });
                for (var i = 0; i < $scope.commissionRuleHall_one.compAgentRuleHalls.length; i++) {
                    if (($scope.commissionRuleHall_one.compAgentRuleHalls[i].agent_info_id == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[i].agent_info_id == null) && ($scope.commissionRuleHall_one.compAgentRuleHalls[i].commission_should == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[i].commission_should == null) && ($scope.commissionRuleHall_one.compAgentRuleHalls[i].integral_should == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[i].integral_should == null) && ($scope.commissionRuleHall_one.compAgentRuleHalls[i].recycle_rate == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[i].recycle_rate == null) && ($scope.commissionRuleHall_one.compAgentRuleHalls[i].integral_recycle_agent_id == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[i].integral_recycle_agent_id == null)) {
                        $scope.commissionRuleHall_one.compAgentRuleHalls.splice(i, 1);
                        i = 0;
                    }
                }
                if (!angular.isUndefined($scope.commissionRuleHall_one.compAgentRuleHalls[0])) {
                    if (($scope.commissionRuleHall_one.compAgentRuleHalls[0].agent_info_id == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[0].agent_info_id == null) && ($scope.commissionRuleHall_one.compAgentRuleHalls[0].commission_should == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[0].commission_should == null) && ($scope.commissionRuleHall_one.compAgentRuleHalls[0].integral_should == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[0].integral_should == null) && ($scope.commissionRuleHall_one.compAgentRuleHalls[0].recycle_rate == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[0].recycle_rate == null) && ($scope.commissionRuleHall_one.compAgentRuleHalls[0].integral_recycle_agent_id == '' || $scope.commissionRuleHall_one.compAgentRuleHalls[0].integral_recycle_agent_id == null)) {
                        $scope.commissionRuleHall_one.compAgentRuleHalls = [];
                    }
                }
//                if($scope.commission_detail.commissionRuleCommon.commissionRuleCommonSubs[0].commission_should <= 0){
//                    topAlert.warning("戶口分派佣金額不能小於 0");
//                    return;
//                }
                $scope.commission_detail.commissionRuleHall.hall_id = hall_id;
                $scope.commission_update.commissionRuleHall.hall_id = hall_id;
                $scope.disabled_submit = true;
                $scope.form_bind_card.checkPreValidity('POST', 'commissionsetting/commissionrulenamecommon/create-validate', commissionRuleNameCommon.createValidate, {"commissionRuleHalls": [$scope.commissionRuleHall_one]}).then(function () {
                    $scope.form_bind_card.clearErrors();
                    $modalInstance.close($scope.commission_detail);
                    $scope.disabled_submit = false;
                }, function () {
                    $scope.disabled_submit = false;
                });
            }
            //關閉彈出框
            $scope.return = function () {
                $modalInstance.close("");
            }

        }]).controller('rollingCardAgentCreateCtrls', ['$scope', 'commissionCard', 'agentsLists', 'globalFunction', '$modalInstance', 'topAlert',
        function ($scope, commissionCard, agentsLists, globalFunction, $modalInstance, topAlert) {
            //自定義變量
            $scope.sub_post = 'POST';
            $scope.create_card_url = globalFunction.getApiUrl('commissionsetting/commissioncard');
            //轉碼卡變量
            $scope.card = {
                "agent_code": "",
                agent_info_id: "",
                card_name: "",
                pin_code: ""
            }
            $scope.init_card = angular.copy($scope.card);

            //根據戶口編號來顯示戶口名稱
            $scope.$watch("card.agent_code", globalFunction.debounce(function (new_value, old_value) {
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function (agent) {
                        $scope.agent = agent;
                        if ($scope.agent.length > 0) {
                            $scope.card.agent_info_id = $scope.agent[0].id;
                        } else {
                            $scope.agent = [];
                        }
                    });
                } else {
                    $scope.agent = [];
                }
            }));

            //新增轉碼卡
            $scope.disabled_submit = false;
            $scope.add = function () {
                if ($scope.disabled_submit) {
                    return $scope.disabled_submit;
                }
                if ($scope.form_create_card.checkValidity()) {
                    $scope.disabled_submit = true;
                    commissionCard.save($scope.card, function () {
                        $scope.card = angular.copy($scope.init_card);
                        topAlert.success("添加成功");
                        $modalInstance.close(true);
                        $scope.disabled_submit = false;
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                }
            }
            //取消
            $scope.cancel = function () {
                $modalInstance.close(false);
            }
        }]).controller('commissionEarningsRecordCtrls', ['$scope', 'tmsPagination', 'commissionRecord', 'globalFunction', '$location', '$filter', 'breadcrumb', 'currentShift', 'goBackData',
        function ($scope, tmsPagination, commissionRecord, globalFunction, $location, $filter, breadcrumb, currentShift, goBackData) {
            //麵包屑導航
            breadcrumb.items = [
                {"name": "碼佣收益記錄", "active": true}
            ];

            //自定義變量
            var original_condition;
            var init_condition = {
                agentInfo: {agent_code: ''},
                agentMaster: {agent_contact_name: ''},
                year_month: [currentShift.data.year_month],
                commission_total: "|0",
                thismonth_allowance: "|0",
                sort: 'agentInfo.agent_code NUMASC'
            }
            original_condition = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.condition = goBackData.get('condition', $scope.condition);
            //初始化列表數據
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = commissionRecord;
            $scope.select = function (page) {
                var conditions = angular.copy($scope.condition);
                if ($scope.condition.agentInfo.agent_code) {
                    conditions.agentInfo.agent_code = $scope.condition.agentInfo.agent_code + "!";
                }
                if ($scope.condition.agentMaster.agent_contact_name) {
                    conditions.agentMaster.agent_contact_name = "!" + $scope.condition.agentMaster.agent_contact_name + "!";
                }
                conditions.year_month[0] = $filter('date')($scope.condition.year_month[0], 'yyyy-MM');
                $scope.commission_earnings = $scope.pagination.select(page, conditions);
            }
            $scope.select();
            //根據條件查詢方法
            $scope.search = function () {
                $scope.condition.year_month[0] = $filter('date')($scope.condition.year_month[0], 'yyyy-MM');
                goBackData.set('condition', $scope.condition);
                $scope.select();
            }
            //重置方法
            $scope.reset = function () {
                $scope.condition = angular.copy(original_condition);
                $scope.select();
            }
            //查看方法
            $scope.detail = function (agent_code) {
                $location.path('commission/commission-earnings-detail/' + agent_code);
            }

        }]).controller('commissionEarningsDetailCtrls', ['$scope', 'tmsPagination', 'rollingCardCommission', 'commissionRecord', 'globalFunction', 'hallName', 'capitalTypes', '$location', '$stateParams', 'breadcrumb', '$filter',
        function ($scope, tmsPagination, rollingCardCommission, commissionRecord, globalFunction, hallName, capitalTypes, $location, $stateParams, breadcrumb, $filter) {

            breadcrumb.items = [
                {"name": "碼佣收益記錄", "url": 'commission/commission-earnings-record'},
                {"name": "碼佣收益詳細", "active": true}
            ];
            $scope.capitaltypes = capitalTypes.query({"capital_type": 1});
            $scope.halls = hallName.query();
            $scope.agents = commissionRecord.query(globalFunction.generateUrlParams({agentInfo: {agent_code: $stateParams.agent_code}}, {
                agent_code: '',
                agent_name: '',
                year_month: '',
                commission_total: '',
                thismonth_allowance: ''
            }));
            $scope.types = [{type: '1', 'name': '應得碼佣'}, {type: '2', name: '碼佣提成'}];
            var original_condition;
            var init_condition = {
                capital_type_id: "",
                hall_id: "",
                type: '',
                create_time: [''],
                agentInfo: {agent_code: $stateParams.agent_code}
            }
            original_condition = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);

            //初始化列表數據
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = rollingCardCommission;
            $scope.select = function (page) {
                var conditions = angular.copy($scope.condition);
                if ($scope.condition.agentInfo.agent_code) {
                    conditions.agentInfo.agent_code = $scope.condition.agentInfo.agent_code + "!";
                }
                conditions.create_time[0] = $filter('date')($scope.condition.create_time[0], 'yyyy-MM-dd');
                $scope.rollingCardCommissions = $scope.pagination.select(page, conditions);
                $scope.rollingCommissionTotal = rollingCardCommission.rollingCommissionTotal(globalFunction.generateUrlParams(conditions, {}));
            }
            $scope.select();
            //按條件查詢
            $scope.search = function () {
                $scope.select();
            }
            //重置方法
            $scope.reset = function () {
                $scope.condition = angular.copy(original_condition);
                $scope.select();
            }

        }]).filter('disable', function () {
        return function (commissionRules) {
            var commissionRulesSubs = [];
            angular.forEach(commissionRules, function (commissionRule) {
                if (commissionRule.disable == 0) {
                    commissionRulesSubs.push(commissionRule);
                }
            });
            return commissionRulesSubs;
        }
    });

}).call(this);
