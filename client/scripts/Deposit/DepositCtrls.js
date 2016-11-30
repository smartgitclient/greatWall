(function () {
    'use strict';
    angular.module('app.deposit.ctrls', ['app.deposit.services']).controller('depositTicketManageCtrl', ['$scope', 'currentShift', 'depositTicket', 'qzPrinter', 'printerType', 'agentsLists', 'depositCard', 'loanBusiness', 'hallName', 'tmsPagination', 'globalFunction', 'depositTicketTypes','TicketManagerStatusTypes', 'depositTypes', '$modal', '$log', 'breadcrumb', 'topAlert', '$filter', '$stateParams', '$location',
        function ($scope, currentShift, depositTicket, qzPrinter, printerType, agentsLists, depositCard, loanBusiness, hallName, tmsPagination, globalFunction, depositTicketTypes,TicketManagerStatusTypes, depositTypes, $modal, $log, breadcrumb, topAlert, $filter, $stateParams, $location) {
            //麵包屑導航
            breadcrumb.items = [
                {"name": "存單管理", "active": true}
            ];
            //自定義變量
            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function (hall) {
                return hall.hall_type != 1;
            });
            $scope.ticket_url = globalFunction.getApiUrl('deposit/depositticket');
            $scope.depositTicketTypes = depositTicketTypes.items;
            $scope.TicketManagerStatusTypes = TicketManagerStatusTypes.items;
            $scope.depositTypes = depositTypes;
            //定義存卡記錄變量
            var original_ticket;
            var init_ticket_manager = {
                "agent_info_id": "",
                "transaction_type": "1",
                "transaction_amount": "",
                "depositTicket_type": "",
                "agent_contact_id": "",
                "agent_contact_name": "",
                "agent_code": "",
                "depositTicket_no": "",
                "agent_name": "",
                "remark": "",
                "operation_password": ""
            }
            original_ticket = angular.copy(init_ticket_manager);
            $scope.ticket = angular.copy(init_ticket_manager);

            //監控agnent_code 獲取agent_info_id
            if ($stateParams.id) {
                $scope.ticket.agent_code = $stateParams.id;
            } else {
                $scope.ticket.agent_code = "";
            }
            $scope.$watch('ticket.agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.agent = [];
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function (agent) {
                        $scope.agent = agent;
                        if (agent.length > 0) {
                            $scope.ticket.agent_info_id = $scope.agent[0].id;
                            $scope.ticket.agent_name = $scope.agent[0].agent_name;
                            depositCard.query(globalFunction.generateUrlParams({agent_info_id: $scope.agent[0].id}, {})).$promise.then(function (depositCards) {
                                if (depositCards.length == 0) {
                                    $scope.depositCards.deposit_amount = 0;
                                    $scope.depositCards.frozen_amount = 0;
                                    $scope.depositCards.usable_amount = 0;
                                } else {
                                    $scope.depositCards = depositCards[0];
                                }
                            });
                            agentsLists.get(globalFunction.generateUrlParams({id: $scope.ticket.agent_info_id}, {depositicketContacts: {}})).$promise.then(function (loanBusiness) {
                                $scope.loanBusiness = loanBusiness.depositicketContacts;
                            });
                        } else {
                            $scope.ticket.agent_info_id = "";
                            $scope.ticket.agent_name = "";
                            $scope.depositCards = [];
                            $scope.loanBusiness = [];
                        }
                    });
                } else {
                    $scope.ticket.agent_info_id = "";
                    $scope.ticket.agent_name = "";
                    $scope.depositCards = [];
                    $scope.loanBusiness = [];
                }
            }));

            //新增存單
            $scope.addTicketManager = function () {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/deposit/ticket-manager-create.html",
                    controller: 'agentTicketManagerCreateCtrl'
                });
                modalInstance.result.then((function (status) {
                    if (status) {
                        $scope.select();
                    }
                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }

            $scope.selectDepositTicket = function (ticket) {
                $scope.selected_deposit_ticket = ticket;
            }


            $scope.disable_print = false;
            $scope.printDepositTicket = function () {
                if ($scope.selected_deposit_ticket) {
                    $scope.selected_deposit_ticket.depositTicket_settlement = +($scope.selected_deposit_ticket.usable_amount.toString().replace(/,/g, ''));
                    $scope.disable_print = true;
                    qzPrinter.print('PDFDepositTicketReceipt', printerType.stylusPrinter, $scope.selected_deposit_ticket).then(function () {
                        topAlert.success('列印成功');
                        $scope.disable_print = false;
                    }, function (msg) {
                        $scope.disable_print = false;
                    })
                } else {
                    topAlert.warning('請選中一張存單');
                }
            }

            //重置存卡數據
            $scope.reset_ticket = function () {
                $scope.ticket = angular.copy(original_ticket);
                $scope.form_ticket_create.$setPristine();
                $scope.form_ticket_create.clearErrors();
            }
            //存卡記錄查詢
            var original;
            var init_condition = {
                agent_code: "",
                hall_id: "",
                depositTicket_seqnumber: "",
                depositTicket_type: "",
                depositTicket_settlement: "|0",
                agentGroup: {agent_group_name: ""},
//                shiftMark:{year_month :[currentShift.data.year_month]},
                depositTicket_time: ['', ''],
                sort: "agent_code NUMASC"
            };
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.excel_condition = angular.copy(init_condition);
            $scope.print_condition = angular.copy(init_condition);
            var print_params = {
                year_month: "",
                agent_group_name: "",
                "shift_date-max": "",
                "shift_date-min": "",
                crate_time: ["", ""],
                shift_date: ""
            }
            $scope.print_condition = _.extend($scope.print_condition, print_params);
            var conditions;
            //初始化化存卡記錄客戶信息
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = depositTicket;
            $scope.select = function (page) {
                $scope.selected_deposit_ticket = null;
                $scope.condition.depositTicket_time[0] = $scope.condition.depositTicket_time[0] ? $filter('date')($scope.condition.depositTicket_time[0], 'yyyy-MM-dd') : "";
                $scope.condition.depositTicket_time[1] = $scope.condition.depositTicket_time[1] ? $filter('date')($scope.condition.depositTicket_time[1], 'yyyy-MM-dd') : "";

                conditions = angular.copy($scope.condition);
                $scope.excel_condition = angular.copy($scope.condition);
                $scope.print_condition = angular.copy($scope.excel_condition);
                $scope.print_condition = _.extend($scope.print_condition, print_params);
//                if(conditions.agent_code != ''){
//                    conditions.agent_code = conditions.agent_code+"!";
//                }
                $scope.pagination.select(page, globalFunction.generateUrlParams(conditions, {
                    shiftMark: {},
                    mortgageMarker: {marker: ""}
                })).$promise.then(function (tickets) {
                        $scope.tickets = tickets;
                    });
                $scope.depositticketSum = depositTicket.depositticketSum(globalFunction.generateUrlParams(conditions, {}));

            }
            $scope.select();

            //查詢方法
            $scope.search = function () {
                $scope.selected_deposit_ticket = null;
                $scope.condition.depositTicket_time[0] = $filter('date')($scope.condition.depositTicket_time[0], 'yyyy-MM-dd');
                $scope.condition.depositTicket_time[1] = $filter('date')($scope.condition.depositTicket_time[1], 'yyyy-MM-dd');
//                $scope.condition.shiftMark.year_month[0] = $scope.condition.shiftMark.year_month[0]?$filter('date')($scope.condition.shiftMark.year_month[0], 'yyyy-MM'):"";
                conditions = angular.copy($scope.condition);
                $scope.excel_condition = angular.copy($scope.condition);
//                if(conditions.agent_code != ''){
//                    conditions.agent_code = conditions.agent_code+"!";
//                }
                $scope.pagination.select(1, globalFunction.generateUrlParams(conditions, {shiftMark: {}})).$promise.then(function (tickets) {
                    $scope.tickets = tickets;
                    if ($scope.tickets.length == 1 && conditions.depositTicket_seqnumber) {
                        $scope.detail($scope.tickets[0].id);
                    }
                });
                $scope.depositticketSum = depositTicket.depositticketSum(globalFunction.generateUrlParams(conditions, {}));
            }
            //查詢方法重置
            $scope.reset = function () {
                $scope.condition = angular.copy(original);
                $scope.select();
            }
            //監控agent_code

            $scope.$watch('condition.agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.agent = [];
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function (agent) {
                        $scope.agent = agent;
                        if (agent.length > 0) {
                            $scope.agent_name = $scope.agent[0].agent_name;
                        } else {
                            $scope.agent_name = "";
                        }
                    });
                } else {
                    $scope.agent_name = "";
                }
            }));

            //取款
            $scope.searchOne = function (ticket, agent_code, type) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/deposit/ticket-manager-teller.html",
                    controller: 'agentTicketManagerTellerCtrl',
                    resolve: {
                        id: function () {
                            return ticket.id;
                        },
                        depositTicket_seqnumber: function () {
                            return ticket.depositTicket_seqnumber;
                        }
                    }
                });
                modalInstance.result.then((function (data){
                    if (data.loan_id) {
                        if (type == depositTicketTypes.marker) {//存M
                            if (data.draw_type == $scope.depositTypes.draw) {
                                $location.path('loan/create-result/' + data.loan_id);
                            } else {
                                $scope.select();
                            }
                        } else {
                            $scope.select();
                        }
                    } else {
                        $scope.select();
                    }
                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }
            //存單詳細
            $scope.detail = function (id) {
                var modalInstances;
                modalInstances = $modal.open({
                    templateUrl: "views/deposit/ticket-detail.html",
                    controller: 'depositTicketDetailCtrl',
                    resolve: {
                        id: function () {
                            return id;
                        }
                    }
                });
                modalInstances.result.then((function (status) {
                    if (status) {
                        $scope.select();
                    }
                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });

            }
            //存單修改備註
            $scope.update = function (id) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/deposit/ticket-remark-update.html",
                    controller: 'depositTicketDetailCtrl',
                    resolve: {
                        id: function () {
                            return id;
                        }
                    }
                });
                modalInstance.result.then((function (status) {
                    if (status) {
                        $scope.select();
                    }
                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }


        }]).controller('depositTicketStreamCtrl', ['$scope', 'currentShift', 'depositTicketRecord', 'agentsLists', 'hallName', 'tmsPagination', 'globalFunction', 'depositTicketTypes', 'depositTypes', 'breadcrumb', '$filter',
        function ($scope, currentShift, depositTicketRecord, agentsLists, hallName, tmsPagination, globalFunction, depositTicketTypes, depositTypes, breadcrumb, $filter) {
            //麵包屑導航
            breadcrumb.items = [
                {"name": "存單流水", "active": true}
            ];

            //自定義變量
            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function (hall) {
                return hall.hall_type != 1;
            });
            $scope.depositTicketTypes = depositTicketTypes.items;
            $scope.depositTypes = depositTypes;
            //查詢變量
            var original;
            var init_condition = {
                agent_code: "",
                hall_id: "",
                depositTicket: {
                    depositTicket_seqnumber: "",
                    depositTicket_type: ""
//                        create_time:['','']
                },
                shiftMark: {shift_date: ["", ""], year_month: [currentShift.data.year_month]},
                shift: "",
            };
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.excel_condition = angular.copy(init_condition);

            //初始化列表數據
            var conditions;
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = depositTicketRecord;
            $scope.select = function (page) {
                $scope.condition.shiftMark.shift_date[0] = $filter('date')($scope.condition.shiftMark.shift_date[0], 'yyyy-MM-dd');
                $scope.condition.shiftMark.shift_date[1] = $filter('date')($scope.condition.shiftMark.shift_date[1], 'yyyy-MM-dd');
                $scope.condition.shiftMark.year_month[0] = $scope.condition.shiftMark.year_month[0] ? $filter('date')($scope.condition.shiftMark.year_month[0], 'yyyy-MM') : "";
                conditions = angular.copy($scope.condition);
                if (conditions.agent_code != '') {
                    conditions.agent_code = conditions.agent_code + "!";
                }
                $scope.excel_condition = angular.copy(conditions);
                $scope.ticket_streams = $scope.pagination.select(page, conditions, {shiftMark: {}});

            }
            $scope.select();
            //搜索方法
            $scope.search = function () {
                $scope.select(1);
            }
            //重置查詢條件
            $scope.reset = function () {
                $scope.condition = angular.copy(original);
                $scope.select();
            }
            //
            $scope.$watch('condition.agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.agent = [];
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function (agent) {
                        $scope.agent = agent;
                        if (agent.length > 0) {
                            $scope.agent_name = $scope.agent[0].agent_name;
                        } else {
                            $scope.agent_name = "";
                        }
                    });
                } else {
                    $scope.agent_name = "";
                }

            }));
        }]).controller('agentTicketManagerCreateCtrl', ['$scope', 'BusinessSequence', 'depositTicket', 'agentsLists', 'depositCard', 'loanBusiness', 'hallName', 'tmsPagination', 'globalFunction', 'depositTicketTypes', '$modal', '$log', 'breadcrumb', 'topAlert', '$filter', '$stateParams', '$modalInstance', 'qzPrinter', 'printerType', 'user',
        function ($scope, BusinessSequence, depositTicket, agentsLists, depositCard, loanBusiness, hallName, tmsPagination, globalFunction, depositTicketTypes, $modal, $log, breadcrumb, topAlert, $filter, $stateParams, $modalInstance, qzPrinter, printerType, user) {

            //自定義變量
            $scope.halls = hallName.query();
            $scope.user = user;
            $scope.ticket_url = globalFunction.getApiUrl('deposit/depositticket');
            $scope.depositTicketTypes = depositTicketTypes.items;
            //定義存卡記錄變量
            var original_ticket;
            var init_ticket_manager = {
                "agent_info_id": "",
                "transaction_type": "1",
                "transaction_amount": "",
                "depositTicket_type": "",
                "agent_contact_id": "",
                "agent_contact_name": "",
                "agent_code": "",
                "depositTicket_seqnumber": "",
                "agent_name": "",
                "remark": "",
                "operation_password": "",
                "table_name": 'DepositTicket',
            }
            original_ticket = angular.copy(init_ticket_manager);
            $scope.ticket = angular.copy(init_ticket_manager);

            $scope.freshBusinessSequence = function () {
                BusinessSequence.businessSequence({"table_name": 'DepositTicket'}).$promise.then(function (data) {
                    $scope.ticket.depositTicket_seqnumber = data.business_sequence;
                    original_ticket.depositTicket_seqnumber = data.business_sequence;
                });
            }

            $scope.freshBusinessSequence();

            //監控agnent_code 獲取agent_info_id
            if ($stateParams.id) {
                $scope.ticket.agent_code = $stateParams.id;
            } else {
                $scope.ticket.agent_code = "";
            }
            $scope.$watch('ticket.agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.ticket = angular.copy(original_ticket);
                $scope.ticket.agent_code = new_value;
                $scope.agent = {};
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {agentMaster: {}})).$promise.then(function (agent) {
                        $scope.agent = agent[0];
                        if (agent.length > 0) {
                            $scope.ticket.agent_info_id = $scope.agent.id;
                            $scope.ticket.agent_name = $scope.agent.agent_name;
                            depositCard.query(globalFunction.generateUrlParams({agent_info_id: $scope.agent.id}, {})).$promise.then(function (depositCards) {
                                if (depositCards.length == 0) {
                                    $scope.depositCards.deposit_amount = 0;
                                    $scope.depositCards.frozen_amount = 0;
                                    $scope.depositCards.usable_amount = 0;
                                } else {
                                    $scope.depositCards = depositCards[0];
                                }
                            });
                            agentsLists.get(globalFunction.generateUrlParams({id: $scope.ticket.agent_info_id}, {depositicketContacts: {}})).$promise.then(function (loanBusiness) {
                                $scope.loanBusiness = loanBusiness.depositicketContacts;
                                if ($scope.loanBusiness.length > 0 && $scope.agent) {
                                    $scope.ticket.agent_contact_id = $scope.agent.agentMaster.id;
                                }
                            });
                        } else {
                            $scope.ticket.agent_info_id = "";
                            $scope.ticket.agent_name = "";
                            $scope.depositCards = [];
                            $scope.loanBusiness = [];
                        }
                    });
                } else {
                    $scope.ticket.agent_info_id = "";
                    $scope.ticket.agent_name = "";
                    $scope.depositCards = [];
                    $scope.loanBusiness = [];
                }
            }));

            //增加存卡記錄
            $scope.disabled_submit = false;
            $scope.add = function (is_print) {
                if ($scope.disabled_submit) {
                    return $scope.disabled_submit;
                }
                $scope.disabled_submit = true;
                angular.forEach($scope.loanBusiness, function (loanBusine) {
                    if (loanBusine.id == $scope.ticket.agent_contact_id) {
                        $scope.ticket.agent_contact_name = loanBusine.agent_contact_name;
                    }
                });
                $scope.form_ticket_create.checkValidity().then(function () {
                    depositTicket.save($scope.ticket, function (data) {
                        topAlert.success("添加成功！");
                        if (is_print === true) {
                            $scope.ticket.depositTicket_time = data.depositTicket_time;
                            $scope.ticket.depositTicket_settlement = data.depositTicket_settlement;
                            qzPrinter.print('PDFDepositTicketReceipt', printerType.stylusPrinter, $scope.ticket).then(function () {
                                topAlert.success('列印成功');
                                $scope.disabled_submit = false;
                            }, function (msg) {
                                $scope.disabled_submit = false;
                            });

                        } else {
                            $scope.disabled_submit = false;
                            $scope.disabled_submit = false;
                        }
                        $scope.reset_ticket();
                        $scope.card = 'card1';
                        $scope.SMSsend(data, $scope.card);
                        $modalInstance.close(true);
                    }, function () {
                        $scope.disabled_submit = false;
                    })
                })
            }
            //重置存卡數據
            $scope.reset_ticket = function () {
                $scope.ticket = angular.copy(original_ticket);
                $scope.form_ticket_create.$setPristine();
                $scope.form_ticket_create.clearErrors();
            }

            $scope.SMSsend = function (data, cardType) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/deposit/card-create-confirm.html",
                    controller: 'ticketCreateConfirmCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        },
                        cardType: function () {
                            return cardType;
                        }

                    }
                });
                modalInstance.result.then((function (status) {

                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }

        }]).controller('ticketCreateConfirmCtrl', ['$scope', 'depositTicket', 'topAlert', 'data', 'cardType', '$modalInstance',
        function ($scope, depositTicket, topAlert, data, cardType, $modalInstance) {
            //新增存單發送短信
            $scope.title = cardType ? "存單管理" : "存卡管理";
            $scope.isReadonly = true;
            $scope.sms = {
                agent_code: data.depositTicket.agent_code,
                agent_name: data.depositTicket.agent_name,
                content: data.content,
                phoneNumber: data.depositTicketPhoneNumbers
            }

            $scope.send_sms = {
                pin_code: "",
                id: data.depositTicketRecord_id,
                content: data.content,
                draw_type: data.draw_type,
                phoneNumber: data.depositTicketPhoneNumbers
            }

            //定義一個變量，監控是否修改短信內容
            $scope.sms_content = data.content;
            $scope.$watch("sms.content", function (new_value) {
                if (new_value) {
                    window['textAreaValue'] = '';
                    $scope.sms_content = $scope.sms.content;
                }
                $scope.send_sms.content = $scope.sms_content;
            })

            $scope.edit = function () {
                $scope.isReadonly = false;
            };

            //新增存單發送短信
            $scope.sendSms = function () {
                $scope.disabled_submit=true;
                if (window['textAreaValue']) {   //storm.xu
                    $scope.send_sms.content = window['textAreaValue'];  //storm.xu
                }
                $scope.form_card_sms.checkValidity().then(function () {
                    depositTicket.sendDepositTicketSms($scope.send_sms, function () {
                        if (cardType == "card1") {
                            topAlert.success("存單存款短信發送成功！");
                        } else {
                            topAlert.success("存單取款短信發送成功！");
                        }
                        $scope.disabled_submit = false;
                        $modalInstance.close();
                        window['textAreaValue'] = '';
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                });

            }

            $scope.close = function () {
                $modalInstance.dismiss();
            }
        }]).controller('agentTicketManagerTellerCtrl', ['$scope', 'user', 'qzPrinter', 'printerType', 'depositTicket', 'agentsLists', 'depositCard', 'loanBusiness', 'BusinessSequence', 'hallName', 'tmsPagination', 'globalFunction', 'depositTicketTypes', 'depositTypes', '$modal', '$log', 'breadcrumb', 'topAlert', 'id', '$filter', '$stateParams', '$modalInstance', 'depositTicket_seqnumber', 'formatNumber',
        function ($scope, user, qzPrinter, printerType, depositTicket, agentsLists, depositCard, loanBusiness, BusinessSequence, hallName, tmsPagination, globalFunction, depositTicketTypes, depositTypes, $modal, $log, breadcrumb, topAlert, id, $filter, $stateParams, $modalInstance, depositTicket_seqnumber, formatNumber) {

            $scope.depositTicketTypes = depositTicketTypes.items;
            $scope.depositTypes = depositTypes;
            $scope.ticket_one = {};
            $scope.user = user;
            $scope.ticket_reset_one = {};
            $scope.deposit_ticket_types = [];
            if (id) {
                depositTicket.get({id: id}).$promise.then(function (ticket_one) {
                    $scope.depositTicketRemark = ticket_one.remark;
                    ticket_one.remark = "";
                    $scope.ticket_one = ticket_one;

                    $scope.ticket_reset_one = angular.copy($scope.ticket_one);
                    if ($scope.ticket_one.depositTicket_type == '1') {
                        $scope.ticket_one.transaction_amount = formatNumber($scope.ticket_one.usable_amount);
                        $scope.show_type = true;
                        $scope.deposit_ticket_types = [{
                            type: $scope.depositTypes.drawcash,
                            val: $scope.depositTypes.items[2]},
                            {type: $scope.depositTypes.draw, val: $scope.depositTypes.items[4]},
                            {type: $scope.depositTypes.frozen, val: $scope.depositTypes.items[6]},
                            {type: $scope.depositTypes.thaw, val: $scope.depositTypes.items[7]}]
                    } else {
                        $scope.deposit_ticket_types = [{
                            type: $scope.depositTypes.partDrawcash,
                            val: $scope.depositTypes.items[1]
                        }, {
                            type: $scope.depositTypes.drawcash,
                            val: $scope.depositTypes.items[2]
                        }, {
                            type: $scope.depositTypes.partDraw,
                            val: $scope.depositTypes.items[3]
                        }, {type: $scope.depositTypes.draw, val: $scope.depositTypes.items[4]},
                            {type: $scope.depositTypes.frozen, val: $scope.depositTypes.items[6]},
                            {type: $scope.depositTypes.thaw, val: $scope.depositTypes.items[7]}]
                    }
                    agentsLists.get(globalFunction.generateUrlParams({id: $scope.ticket_one.agent_info_id}, {depositicketContacts: {}})).$promise.then(function (loanBusiness) {
                        $scope.loanBusiness = loanBusiness.depositicketContacts;
                    });
                });
                $scope.ticket_one.pin_code = "";
                $scope.disabled_submits = false;
            }

            $scope.freshBusinessSequence = function () {
                BusinessSequence.businessSequence({"table_name": 'DepositTicket'}).$promise.then(function (data) {
                    $scope.ticket_one.depositTicket_seqnumber = data.business_sequence;
//                    original_ticket.depositTicket_seqnumber = data.business_sequence;
                });
            }

            //監控存單編號
//            $scope.$watch('ticket_one.depositTicket_no',globalFunction.debounce(function(new_value,old_value){
//                if(new_value){
//                    depositTicket.query(globalFunction.generateUrlParams({depositTicket_no:new_value},{})).$promise.then(function(ticket_ones){
//                        if(ticket_ones.length > 0){
//                            $scope.ticket_one = ticket_ones[0];
//                            $scope.ticket_one.operation_password = "";
//                            $scope.ticket_one.draw_type = "";
//                            $scope.disabled_submits = false;
//                            agentsLists.get(globalFunction.generateUrlParams({id:$scope.ticket_one.agent_info_id},{depositicketContacts:{}})).$promise.then(function(loanBusiness){
//                                $scope.loanBusiness = loanBusiness.depositicketContacts;
//                            });
//                        }else{
//                            $scope.loanBusiness =[];
//                        }
//                    });
//                }else{
//                    $scope.loanBusiness =[];
//                }
//            }));
            //存單取款
            $scope.disabled_submits = false;
            $scope.ticket_url = globalFunction.getApiUrl('deposit/depositticket');
            $scope.addTeller = function (is_print) {
                if ($scope.disabled_submits) {
                    return $scope.disabled_submits;
                }
                if ($scope.ticket_one.draw_type != 7) {
                    if (parseFloat($scope.ticket_one.transaction_amount) > parseFloat($scope.ticket_one.usable_amount)) {
                        $scope.ticket_one.draw_type != 6 ? topAlert.warning("取款金額不能大於可用金額!") : topAlert.warning("凍結金額不能大於可用餘額!");
                        return;
                    }
                } else {
                    if (+$scope.ticket_one.frozen_deposit_amount < +$scope.ticket_one.transaction_amount) {
                        topAlert.warning("解凍金額不能大於凍結金額!");
                        return;
                    }
                }
                if(!$scope.ticket_one.draw_type){
                    topAlert.warning("請選擇取款類型!");
                    return;
                }
                if(isNaN(+($scope.ticket_one.transaction_amount.toString().replace(/,/g, '')))){
                    topAlert.warning("取款金額必须为数字類型!");
                    return;
                }

//                if( $scope.ticket_one.depositTicket_type ==  '1'){
//                   $scope.ticket_one.draw_type = $scope.depositTypes.draw;
//                }
                angular.forEach($scope.loanBusiness, function (loanBusine) {
                    if (loanBusine.id == $scope.ticket_one.agent_contact_id) {
                        $scope.ticket_one.agent_contact_name = loanBusine.agent_contact_name;
                    }
                });

                //$scope.ticket_one.transaction_amount = +($scope.ticket_one.transaction_amount.toString().replace(/,/g, ''));
                $scope.ticket_one.transaction_type = "2";
                $scope.form_ticket_teller.checkValidity().then(function () {
                    $scope.disabled_submits = true;
                    $scope.ticket_one_int = angular.copy($scope.ticket_one);
                    if ($scope.ticket_one_int.transaction_amount) {
                        $scope.ticket_one_int.transaction_amount = +($scope.ticket_one_int.transaction_amount.toString().replace(/,/g, ''));
                    } else {
                        $scope.ticket_one_int.transaction_amount = '';
                    }
                    $scope.ticket_one_c = angular.copy($scope.ticket_one);
                    depositTicket.save($scope.ticket_one_int, function (data) {
                        if (is_print && data.depositTicket_settlement) {
                            $scope.ticket_one.depositTicket_settlement = data.depositTicket_settlement.toString();
                            $scope.ticket_one_c = angular.copy($scope.ticket_one);
                            //$scope.ticket_one_c.depositTicket_settlement = Number($scope.ticket_one_c.depositTicket_amount) - Number($scope.ticket_one_c.transaction_amount);
                            //$scope.ticket_one_c.depositTicket_settlement = +($scope.ticket_one_c.usable_amount.toString().replace(/,/g, ''));
                            $scope.ticket_one_c.remark = data.remark;
                            if ($scope.ticket_one_c.draw_type != 7) {
                                $scope.ticket_one_c.depositTicket_settlement = Number($scope.ticket_one_c.usable_amount.toString().replace(/,/g, ''))-(+($scope.ticket_one_c.transaction_amount.toString().replace(/,/g, '')));
                            }else{
                                $scope.ticket_one_c.depositTicket_settlement = Number($scope.ticket_one_c.usable_amount.toString().replace(/,/g, ''))+(+($scope.ticket_one_c.transaction_amount.toString().replace(/,/g, '')));
                            }

                            console.log( $scope.ticket_one_c)
                            qzPrinter.print('PDFDepositTicketReceipt', printerType.stylusPrinter, $scope.ticket_one_c).then(function () {
                                topAlert.success('列印成功');
                            });
                        }
                        //data.draw_type=$scope.ticket_one.draw_type;
                        var draw_type=angular.copy($scope.ticket_one.draw_type);//解冻和冻结不要发送短信
                        topAlert.success("取款成功！");
                        $scope.card = 'card2';
                        if (draw_type != 6 && draw_type != 7) { //解冻和冻结不要发送短信
                            $scope.SMSsend(data, $scope.card);
                        }
                        $scope.resetTeller();
                        $modalInstance.close(data);
                        $scope.disabled_submits = false;
                    }, function () {
                        $scope.disabled_submits = false;
                        //$scope.ticket_one.transaction_amount = ($scope.ticket_one.transaction_amount || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                    })
                })
            }
            $scope.resetTeller = function () {
                $scope.form_ticket_teller.$setPristine();
                $scope.ticket_one = angular.copy($scope.ticket_reset_one);
                if ($scope.ticket_one.depositTicket_type == '1') {
                    $scope.ticket_one.transaction_amount = formatNumber($scope.ticket_one.usable_amount);
                    $scope.show_type = true;
                } else {
                    $scope.show_type = false;
                }
            }
            $scope.show_type = false;
            $scope.showType = function () {
                if ($scope.ticket_one.draw_type == $scope.depositTypes.drawcash || $scope.ticket_one.draw_type == $scope.depositTypes.draw) {
                    $scope.ticket_one.transaction_amount = formatNumber($scope.ticket_one.usable_amount);
                    $scope.ticket_one.depositTicket_seqnumber = $scope.ticket_reset_one.depositTicket_seqnumber;
                    $scope.show_type = true;
                } else {
                    $scope.ticket_one.transaction_amount = "";
                    $scope.show_type = false;
                    if (user.hall.id != '1AE7283167B57D1DE050A8C098155859') {
                        $scope.freshBusinessSequence();
                    }
                }
                if (!$scope.ticket_one.draw_type) {
                    $scope.ticket_one.remark = "";
                }
            }

            //新增存單之後手動發短信
            $scope.SMSsend = function (data, cardType) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/deposit/card-create-confirm.html",
                    controller: 'ticketCreateConfirmCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        },
                        cardType: function () {
                            return cardType;
                        }
                    }
                });
                modalInstance.result.then((function (status) {

                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }

        }]).controller('depositTicketDetailCtrl', ['$scope', '$log', '$modal', '$state', 'depositTicket', 'globalFunction', 'depositTicketTypes', '$modalInstance', 'id', 'topAlert', 'qzPrinter', 'printerType', 'depositTypes', 'agentsLists', 'formatNumber', 'BusinessSequence', 'user',
        function ($scope, $log, $modal, $state, depositTicket, globalFunction, depositTicketTypes, $modalInstance, id, topAlert, qzPrinter, printerType, depositTypes, agentsLists, formatNumber, BusinessSequence, user) {
            //取款
            $scope.depositTypes = depositTypes;
            $scope.ticket_one = {}
            $scope.ticket_reset_one = {};
            $scope.deposit_ticket_types = [];


            $scope.depositTicketTypes = depositTicketTypes.items;
            $scope.ticket_remark_url = globalFunction.getApiUrl('deposit/depositticket');
            $scope.remark_update = false;
            $scope.title = '存單詳細';
            $scope.search_one = false;
            $scope.ticket = {};
            $scope.ticket_remark = {
                id: "",
                remark: '',
                pin_code: ''
            }
            if (id) {
                depositTicket.get(globalFunction.generateUrlParams({id: id}, {depositTicketRecords: {}})).$promise.then(function (ticket) {
                    $scope.ticket = ticket;
                    $scope.ticket_remark.id = $scope.ticket.id;
                    $scope.ticket_remark.remark = $scope.ticket.remark;
                    $scope.deposit_ticket = _.findWhere($scope.ticket.depositTicketRecords, {transaction_type: '1'});
                    $scope.take_ticket = _.findWhere($scope.ticket.depositTicketRecords, {transaction_type: '2'});

                    /*
                     * 取款
                     * */
                    $scope.depositTicketRemark = ticket.remark;
//                    ticket.remark = "";
                    $scope.ticket_one = ticket;
                    $scope.ticket_reset_one = angular.copy($scope.ticket_one);
                    if ($scope.ticket_one.depositTicket_type == '1') {
                        $scope.ticket_one.transaction_amount = parseFloat($scope.ticket_one.usable_amount);
                        $scope.show_type = true;
                        $scope.deposit_ticket_types = [{
                            type: $scope.depositTypes.drawcash,
                            val: $scope.depositTypes.items[2]
                        }, {type: $scope.depositTypes.draw, val: $scope.depositTypes.items[4]},
                            {type: $scope.depositTypes.frozen, val: $scope.depositTypes.items[6]},
                            {type: $scope.depositTypes.thaw, val: $scope.depositTypes.items[7]}]
                    } else {
                        $scope.deposit_ticket_types = [{
                            type: $scope.depositTypes.partDrawcash,
                            val: $scope.depositTypes.items[1]
                        }, {
                            type: $scope.depositTypes.drawcash,
                            val: $scope.depositTypes.items[2]
                        }, {
                            type: $scope.depositTypes.partDraw,
                            val: $scope.depositTypes.items[3]
                        }, {type: $scope.depositTypes.draw, val: $scope.depositTypes.items[4]},
                            {type: $scope.depositTypes.frozen, val: $scope.depositTypes.items[6]},
                            {type: $scope.depositTypes.thaw, val: $scope.depositTypes.items[7]}]
                    }
                    agentsLists.get(globalFunction.generateUrlParams({id: $scope.ticket_one.agent_info_id}, {depositicketContacts: {}})).$promise.then(function (loanBusiness) {
                        $scope.loanBusiness = loanBusiness.depositicketContacts;
                    });
                });
                $scope.ticket_one.pin_code = "";
                $scope.disabled_submits = false;
            }

            //自動更新存單編號
            $scope.freshBusinessSequence = function () {
                BusinessSequence.businessSequence({"table_name": 'DepositTicket'}).$promise.then(function (data) {
                    $scope.ticket.depositTicket_seqnumber = data.business_sequence;
                    //original_ticket.depositTicket_seqnumber = data.business_sequence;
                });
            }
            $scope.freshBusinessSequence();

            $scope.disable_print = false;
            $scope.print = function () {
                $scope.disable_print = true;
                $scope.ticket_copy=angular.copy($scope.ticket);
                $scope.ticket_copy.depositTicket_settlement = Number($scope.ticket_copy.usable_amount.toString().replace(/,/g, ''));
                qzPrinter.print('PDFDepositTicketReceipt', printerType.stylusPrinter, $scope.ticket_copy).then(function () {
                    topAlert.success('列印成功');
                    $scope.disable_print = false;
                    $modalInstance.dismiss();
                }, function (msg) {
                    $scope.disable_print = false;
                })
            }
            //關閉
            $scope.cancel = function () {
                $modalInstance.close('');
            }
            //
            $scope.disabled_submit = false;
            $scope.add = function () {
                if ($scope.disabled_submit) {
                    return $scope.disabled_submit;
                }
                $scope.form_ticket_remark.checkValidity().then(function () {
                    $scope.disabled_submit = true;
                    depositTicket.update($scope.ticket_remark, function () {
                        topAlert.success("備註修改成功！");
                        $modalInstance.close(true);
                        $scope.disabled_submit = false;
                    }, function () {
                        $scope.disabled_submit = false;
                    })
                })
            }
            //取款
            $scope.searchOne = function (id, agent_code, type) {
                $scope.title = '存單取款';
                $scope.search_one = true;
                $scope.ticket_one.remark = "";
            }

            //存單修改備註
            $scope.update = function () {
                $scope.remark_update = true;
            }
            /*
             * 取款
             * */
            //存單取款
            $scope.disabled_submits = false;
            $scope.ticket_url = globalFunction.getApiUrl('deposit/depositticket');
            $scope.addTeller = function (is_print) {
                delete $scope.ticket_one.depositTicketRecords;
                if ($scope.disabled_submits) {
                    return $scope.disabled_submits;
                }
                if ($scope.ticket_one.draw_type != 7) {
                    if (parseFloat($scope.ticket_one.transaction_amount) > parseFloat($scope.ticket_one.usable_amount)) {
                        $scope.ticket_one.draw_type != 6?topAlert.warning("取款金額不能大於可用金額!"):topAlert.warning("凍結金額不能大於可用餘額!");
                        return;
                    }
                }else{
                    if (+$scope.ticket_one.frozen_deposit_amount < +$scope.ticket_one.transaction_amount) {
                        topAlert.warning("解凍金額不能大於凍結金額!");
                        return;
                    }
                }
                if(!$scope.ticket_one.draw_type){
                    topAlert.warning("請選擇取款類型!");
                    return;
                }
                if(isNaN(+($scope.ticket_one.transaction_amount.toString().replace(/,/g, '')))){
                    topAlert.warning("取款金額必须为数字類型!");
                    return;
                }
//                if( $scope.ticket_one.depositTicket_type ==  '1'){
//                   $scope.ticket_one.draw_type = $scope.depositTypes.draw;
//                }
                angular.forEach($scope.loanBusiness, function (loanBusine) {
                    if (loanBusine.id == $scope.ticket_one.agent_contact_id) {
                        $scope.ticket_one.agent_contact_name = loanBusine.agent_contact_name;
                    }
                });
                $scope.ticket_one.transaction_type = "2";
                $scope.form_ticket_teller.checkValidity().then(function () {
                    $scope.disabled_submits = true;
                    $scope.ticket_one_datilint = angular.copy($scope.ticket_one);
                    $scope.ticket_one_datilint.transaction_amount = +($scope.ticket_one_datilint.transaction_amount.toString().replace(/,/g, ''));
                    depositTicket.save($scope.ticket_one_datilint, function (data) {
                        if (is_print && data.depositTicket_settlement) {
                            //$scope.ticket_one.depositTicket_settlement = data.depositTicket_settlement.toString();
                            if ($scope.ticket_one.draw_type != 7) {
                                $scope.ticket_one.depositTicket_settlement = Number($scope.ticket_one.usable_amount.toString().replace(/,/g, ''))-(+($scope.ticket_one.transaction_amount.toString().replace(/,/g, '')));
                            }else{
                                $scope.ticket_one.depositTicket_settlement = Number($scope.ticket_one.usable_amount.toString().replace(/,/g, ''))+(+($scope.ticket_one.transaction_amount.toString().replace(/,/g, '')));
                            }
                            $scope.ticket_one.remark = $scope.depositTicketRemark;
                            console.log( $scope.ticket_one)
                            qzPrinter.print('PDFDepositTicketReceipt', printerType.stylusPrinter, $scope.ticket_one).then(function () {
                                topAlert.success('列印成功');
                            });
                        }
                        //data.draw_type=$scope.ticket_one.draw_type;
                        var draw_type=angular.copy($scope.ticket_one.draw_type);//解冻和冻结不要发送短信
                        $scope.resetTeller();
                        topAlert.success("取款成功！");
                        $scope.card = 'card2';
                        if (draw_type != 6 && draw_type != 7) {
                            $scope.SMSsend(data, $scope.card);
                        }
                        $modalInstance.close(data);
                        $scope.disabled_submits = false;
                    }, function () {
                        $scope.disabled_submits = false;
                    })
                })
            }
            $scope.resetTeller = function () {
                $scope.form_ticket_teller.$setPristine();
                $scope.ticket_one = angular.copy($scope.ticket_reset_one);
                if ($scope.ticket_one.depositTicket_type == '1') {
                    $scope.ticket_one.transaction_amount = formatNumber($scope.ticket_one.usable_amount);
                    $scope.show_type = true;
                } else {
                    $scope.show_type = false;
                }
            }
            $scope.show_type = false;
            $scope.showType = function () {
                if ($scope.ticket_one.draw_type == $scope.depositTypes.drawcash || $scope.ticket_one.draw_type == $scope.depositTypes.draw) {
                    $scope.ticket_one.transaction_amount = formatNumber($scope.ticket_one.usable_amount);
                    $scope.show_type = true;
                } else {
                    $scope.ticket_one.transaction_amount = "";
                    $scope.show_type = false;
                    if (user.hall.id != '1AE7283167B57D1DE050A8C098155859') {
                        $scope.freshBusinessSequence();
                    }
                }
                if (!$scope.ticket_one.draw_type) {
                    $scope.ticket_one.remark = "";
                }
            }


            //新增存單之後手動發短信
            $scope.SMSsend = function (data, cardType) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/deposit/card-create-confirm.html",
                    controller: 'ticketCreateConfirmCtrl',//存單取款發送短信
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        },
                        cardType: function () {
                            return cardType;
                        }
                    }
                });
                modalInstance.result.then((function (status) {

                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }


        }]).controller('depositCardListCtrl', ['$scope', 'depositCard', 'agentsLists', 'loanBusiness', 'hallName', 'tmsPagination', 'topAlert', 'globalFunction', 'breadcrumb', 'pinCodeModal',
        function ($scope, depositCard, agentsLists, loanBusiness, hallName, tmsPagination, topAlert, globalFunction, breadcrumb, pinCodeModal) {
            //麵包屑導航
            breadcrumb.items = [
                {"name": "存卡列表", "active": true}
            ];

            $scope.deposit_cards = [];
            $scope.show = true;
            //自定義變量
            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function (hall) {
                return hall.hall_type == 2;
            });

            $scope.all_halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function (hall) {
                return hall.hall_type != 1;
            });

            $scope.report_code = "DepositCardTotal"; //存單匯總
            $scope.deposit_card_url = globalFunction.getApiUrl('deposit/depositcard');
            $scope.disabled_update = false;
            $scope.sub_post_put = "POST";
            $scope.status = "0";
            //定義存卡記錄變量
            var original_card;
            var init_deposit_card = {
                "agent_info_id": "",
                "agent_code": "",
                "agent_name": "",
                "card_name": "",
                "selected": "",
                "allow_negative": "",
                "pin_code": ""
            }
            original_card = angular.copy(init_deposit_card);
            $scope.deposit_card = angular.copy(init_deposit_card);
            //$scope.excel_condition = angular.copy(init_deposit_card);

            //監控agnent_code 獲取agent_info_id
            $scope.$watch('deposit_card.agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.agent = [];
                $scope.deposit_card.agent_info_id = "";
                $scope.deposit_card.agent_name = "";
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function (agent) {
                        $scope.agent = agent;
                        if (agent.length > 0) {
                            $scope.deposit_card.agent_info_id = $scope.agent[0].id;
                            $scope.deposit_card.agent_name = $scope.agent[0].agent_name;
                        }
                    });
                }
            }));

            //增加存卡
            $scope.disabled_submit = false;
            $scope.add = function () {
                if ($scope.disabled_submit) {
                    return $scope.disabled_submit;
                }
                if ($scope.deposit_card.selected) {
                    $scope.deposit_card.allow_negative = '1';
                } else {
                    $scope.deposit_card.allow_negative = '0';
                }
                $scope.form_deposit_card_create.checkValidity().then(function () {
                    $scope.disabled_submit = true;
                    if ($scope.deposit_card.id) {
                        depositCard.update($scope.deposit_card, function () {
                            topAlert.success("修改成功！");
                            $scope.reset_deposit_card();
//                            $scope.select();
                            $scope.sub_post_put = "POST";
                            $scope.disabled_submit = false;
                            $scope.disabled_update = false;
                        }, function () {
                            $scope.disabled_submit = false;
                            $scope.disabled_update = true;
                        })
                    } else {
                        depositCard.save($scope.deposit_card, function () {
                            topAlert.success("添加成功！");
                            $scope.reset_deposit_card();
//                            $scope.select();
                            $scope.sub_post_put = "POST";
                            $scope.disabled_submit = false;
                            $scope.disabled_update = false;
                            ;
                        }, function () {
                            $scope.disabled_submit = false;
                            $scope.disabled_update = false;
                        })
                    }
                })
            }
            //
            $scope.addCard = function () {
                $scope.form_deposit_card_create.clearErrors();
                $scope.disabled_update = false;
                $scope.deposit_card = angular.copy(original_card);
                $scope.deposit_card.agent_name = "";
                $scope.sub_post_put = "POST";
            }
            //修改存卡
            $scope.update = function (id) {
                $scope.sub_post_put = "PUT";
                depositCard.get({id: id}).$promise.then(function (deposit_card) {
                    $scope.deposit_card = deposit_card;
                    if ($scope.deposit_card.allow_negative == '1') {
                        $scope.deposit_card.selected = true;
                    } else {
                        $scope.deposit_card.selected = false;
                    }
                    $scope.disabled_update = true;
                    $scope.deposit_card_reset = angular.copy($scope.deposit_card);
                })
            }
            //刪除沒有交易記錄的存卡
            $scope.delete = function (id) {
                pinCodeModal(depositCard, 'delete', {id: id}, '刪除成功！').then(function () {
                    $scope.select();
                    if (id == $scope.deposit_card.id) {
                        $scope.addCard();
                    }
                })


            }
            //重置存卡數據
            $scope.reset_deposit_card = function () {
                $scope.form_deposit_card_create.clearErrors();
//                if($scope.deposit_card.id){
//                    $scope.disabled_update = true;
//                    $scope.deposit_card = angular.copy($scope.deposit_card_reset);
//                }else{
                $scope.disabled_update = false;
                $scope.deposit_card = angular.copy(original_card);
//                }
            }
            //存卡記錄查詢
            var original;
            var init_condition = {
                hall_id: $scope.user.hall.id,
                agent_code: "",
                agent_name: "",
                card_name: "",
                sort: "agent_code NUMASC",
                deposit_amount: '',
                agentGroup: {agent_group_name: ""}
            };
            $scope.hall_name = "";
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.excel_hall = [{
                "id": $scope.user.hall.id,
                "name": $scope.user.hall.hall_name ? $scope.user.hall.hall_name : ""
            }];
            $scope.excel_condition = {
                halls: $scope.excel_hall,
                isHallAll: false,
                agent_code: $scope.condition.agent_code ? $scope.condition.agent_code : "no",
                agent_name: $scope.condition.agent_name ? $scope.condition.agent_name : "",
                card_name: $scope.condition.card_name ? $scope.condition.card_name : "",
                deposit_amount: $scope.condition.deposit_amount,
                agent_group_name: $scope.condition.agentGroup.agent_group_name ? $scope.condition.agentGroup.agent_group_name : ""
            }
            //$scope.excel_condition = angular.copy($scope.condition);
            //$scope.excel_condition.halls = $scope.excel_hall;

            var conditions;
            //初始化化存卡記錄客戶信息
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = depositCard;
            $scope.pagination.query_method = 'cardList';
            $scope.select = function (page) {
                $scope.show = false;
                $scope.excel_condition = angular.copy($scope.condition);
                if ($scope.condition.hall_id) {
                    var hall = _.findWhere($scope.all_halls, {id: $scope.condition.hall_id});
                    if (hall) {
                        $scope.hall_name = hall.hall_name ? hall.hall_name : "";
                        $scope.excel_hall = [{"id": hall.id, "name": hall.hall_name}]
                    } else {
                        $scope.hall_name = "全部";
                        $scope.condition.hall_id = "";
                        $scope.excel_hall = [];
                    }
                } else {
                    $scope.hall_name = "全部";
                    $scope.excel_hall = [];
                    $scope.condition.hall_id = "";
                }

                if ($scope.status == '0') {
                    $scope.condition.deposit_amount = "|0";
                } else if ($scope.status == '1') {
                    $scope.condition.deposit_amount = "0";
                } else {
                    $scope.condition.deposit_amount = "";
                }
                $scope.excel_condition.deposit_amount = $scope.status;

                conditions = angular.copy($scope.condition);
                if (conditions.agent_code != '') {
                    conditions.agent_code = conditions.agent_code + "!";
                    $scope.excel_condition.agent_code = $scope.condition.agent_code;
                }
                if (conditions.agent_name != '') {
                    conditions.agent_name = conditions.agent_name + "!";
                    $scope.excel_condition.agent_name = $scope.condition.agent_name;
                }
                if (conditions.card_name != '') {
                    conditions.card_name = conditions.card_name + "!";
                    $scope.excel_condition.card_name = $scope.condition.card_name;
                }

                if (conditions.agentGroup.agent_group_name != '') {
                    conditions.agentGroup.agent_group_name = conditions.agentGroup.agent_group_name + "!";
                }
                $scope.excel_condition.agent_group_name = $scope.condition.agentGroup.agent_group_name ? $scope.condition.agentGroup.agent_group_name : "";
                $scope.excel_condition.isHallAll = false;
                $scope.excel_condition.halls = $scope.excel_hall;
                delete $scope.excel_condition.hall_id;
                delete $scope.excel_condition.sort;
                delete $scope.excel_condition.agentGroup.agent_group_name;

                $scope.deposit_cards = $scope.pagination.select(page, globalFunction.generateUrlParams(conditions, {}));

            }

//            $scope.select();

            //查詢方法
            $scope.search = function () {
                $scope.select();
            }
            //查詢方法重置
            $scope.reset = function () {
                $scope.status = "0";
                $scope.condition = angular.copy(original);
//                $scope.select();
                $scope.show = true;
                $scope.deposit_cards = [];
                $scope.excel_hall = [{
                    "id": $scope.user.hall.id,
                    "name": $scope.user.hall.hall_name ? $scope.user.hall.hall_name : ""
                }];
                $scope.excel_condition = {
                    halls: $scope.excel_hall,
                    isHallAll: false,
                    agent_code: $scope.condition.agent_code ? $scope.condition.agent_code : "no",
                    agent_name: $scope.condition.agent_name ? $scope.condition.agent_name : "",
                    card_name: $scope.condition.card_name ? $scope.condition.card_name : "",
                    deposit_amount: $scope.condition.deposit_amount,
                    agent_group_name: $scope.condition.agentGroup.agent_group_name ? $scope.condition.agentGroup.agent_group_name : ""
                }
            }

        }]).controller('CardCreateConfirmCtrl', ['$scope', '$modalInstance', '$modal', 'data', 'depositCard', 'topAlert', 'type', function ($scope, $modalInstance, $modal, data, depositCard, topAlert, type) {
        //存卡列表類型選擇存款時候發送的短信
        $scope.title = "存卡管理";
        $scope.isReadonly = true;
        $scope.is_two_send = 1;
        $scope.sms = {
            agent_code: type == 1 ? data.depositCardRecord.agent_code : data.receiveCardRecord.agent_code,
            agent_name: type == 1 ? data.depositCardRecord.agent_contact_name : data.receiveCardRecord.agent_name,
            content: type == 1 ? data.sendContent : data.receiveContent,
            phoneNumber: type == 1 ? data.sendPhoneNumbers : data.receivePhoneNumbers
        }

        $scope.send_sms = {
            pin_code: "",
            id: type == 1 ? data.depositCardRecord.id : data.receiveCardRecord.id,
            agent_contact_name: type == 1 ? data.depositCardRecord.agent_contact_name : data.receiveCardRecord.agent_contact_name,
            content: '',
            sendPhoneNumbers: data.sendPhoneNumbers,//電話號碼傳給後台
            transaction_type: data.depositCardRecord.transaction_type//選擇的類型
        }


        //定義一個變量，監控是否修改短信內容
        $scope.sms_content = $scope.sms.content;//初始化
        $scope.$watch("sms.content", function (new_value) {
            if (new_value) {
                window['textAreaValue'] = ''; //storm.xu
                $scope.sms_content = $scope.sms.content;
            }
            $scope.send_sms.content = $scope.sms_content;
        })
        $scope.edit = function () {
            $scope.isReadonly = false;
        };
        //存卡列表類型選擇存款時候發送的短信

        $scope.sendSms = function () {
            $scope.disabled_submit=true;
            if (window['textAreaValue']) {   //storm.xu
                $scope.send_sms.content = window['textAreaValue'];  //storm.xu
            }
            $scope.form_card_sms.checkValidity().then(function () {
                depositCard.sendDepositCardSms($scope.send_sms, function () {
                    topAlert.success("短信發送成功！");
                    $scope.disabled_submit = false;
                    $modalInstance.close();
                    window['textAreaValue'] = ''; //storm.xu
                    if (data.receiveCardRecord&&data.receivePhoneNumbers.length) {
                        $scope.receiveSMSsend(data, 2);//2：轉賬，1：其它
                    }
                }, function () {
                    $scope.disabled_submit = false;
                });
            });

        }

        //
        $scope.receiveSMSsend = function (data, type) {
            var modalInstance;
            modalInstance = $modal.open({
                templateUrl: "views/deposit/card-create-confirm-receive.html",
                controller: 'receiveCardCreateConfirmCtrl',//轉賬發送短信
                resolve: {
                    data: function () {
                        return data ? data : "";
                    },
                    type: function () {
                        return type;
                    }
                }
            });
        }

        $scope.close = function () {
            $modalInstance.dismiss();
            if (data.receiveCardRecord&&data.receivePhoneNumbers.length) {
                $scope.receiveSMSsend(data, 2);//2：轉賬，1：其它
            }
        }

    }]).controller('receiveCardCreateConfirmCtrl', ['$scope', '$modalInstance', '$modal', 'data', 'depositCard', 'topAlert', 'type', function ($scope, $modalInstance, $modal, data, depositCard, topAlert, type) {
        //存卡管理轉賬發送的短信
        $scope.title = "存卡管理";
        $scope.sms = {
            agent_code: data.receiveCardRecord.agent_code,
            agent_name: data.receiveCardRecord.agent_name,
            content: data.receiveContent,
            phoneNumber: data.receivePhoneNumbers
        }
        $scope.send_sms = {
            pin_code: "",
            id: data.receiveCardRecord.id,
            agent_contact_name: data.depositCardRecord.agent_contact_name,
            content: data.receiveContent
        }

        //定義一個變量,監控是否改變短信的內容
        $scope.sms_content = $scope.sms.content;
        $scope.$watch("sms.content", function (new_value) {
            if (new_value) {
                window['textAreaValue'] = '';
                $scope.sms_content = $scope.sms.content;
            }
            $scope.send_sms.content = $scope.sms_content;
        })

        $scope.sendSms = function () {
            $scope.disabled_submit=true;
            if (window['textAreaValue']) {   //storm.xu
                $scope.send_sms.content = window['textAreaValue'];  //storm.xu
            }
            $scope.form_card_sms.checkValidity().then(function () {
                depositCard.sendDepositCardSms($scope.send_sms, function () {
                    topAlert.success("短信發送成功！");
                    $scope.disabled_submit = false;
                    $modalInstance.close();
                    window['textAreaValue'] = '';
                }, function () {
                    $scope.disabled_submit = false;
                });
            });
        }

        $scope.close = function () {
            $modalInstance.dismiss();
        }

    }]).controller('depositCardsManageCtrl', ['$scope', 'user', 'qzPrinter', 'windowItems', 'printerType', 'depositCard', 'depositCardRecord', 'crossTransfer', 'transfer', 'agentsLists', 'loanBusiness', 'hallName', 'depositCardTypes', 'depositCardRecordTypes', 'crossTransferStatus', 'tmsPagination', 'pinCodeModal', 'topAlert', 'globalFunction', 'breadcrumb', '$filter', '$modal', '$stateParams', 'shiftMarks', '$log', 'currentShift', 'printRecord', 'crossTransferTypes',
        function ($scope, user, qzPrinter, windowItems, printerType, depositCard, depositCardRecord, crossTransfer, transfer, agentsLists, loanBusiness, hallName, depositCardTypes, depositCardRecordTypes, crossTransferStatus, tmsPagination, pinCodeModal, topAlert, globalFunction, breadcrumb, $filter, $modal, $stateParams, shiftMarks, $log, currentShift, printRecord, crossTransferTypes) {
            //麵包屑導航
            breadcrumb.items = [
                {"name": "存卡管理", "active": true}
            ];

            //自定義變量
            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function (hall) {
                return hall.hall_type != 1;
            });
            $scope.deposit_url = globalFunction.getApiUrl('deposit/depositcard/transaction');
            $scope.localtion_url = globalFunction.getApiUrl('deposit/depositcard/update-print-position');
            $scope.show_type = false;
            $scope.depositCardTypes = depositCardTypes;
            $scope.depositCardRecordTypes = depositCardRecordTypes.items;
            $scope.crossTransferStatus = crossTransferStatus;
            $scope.crossTransferTypes = crossTransferTypes;
            $scope.disabled_update = false;
            $scope.shiftMarks = shiftMarks;
            $scope.sub_post_put = "POST";

            //$scope.deposit_manager_cards = depositCard.query();
            //定義存卡記錄變量
            var original_card;
            var init_deposit_card = {
                "deposit_card_id": "",
                "card_name": "",
                "agent_info_id": "",
                "agent_code": "",
                "agent_name": "",
                "agent_contact_id": "",
                "agent_contact_name": "",
                "transaction_type": "",
                "transaction_amount": "",
                "remark": "",
                "receive_agent_id": "",
                "receive_agent_code": "",
                "receive_card_id": "",
                "allow_negative": "",
                "pin_code": ""
            }
            original_card = angular.copy(init_deposit_card);
            $scope.deposit_card = angular.copy(init_deposit_card);

            //監控agnent_code 獲取agent_info_id
            if ($stateParams.id) {
                $scope.deposit_card.agent_code = $stateParams.id;
            } else {
                $scope.deposit_card.agent_code = "";
            }
            $scope.$watch('deposit_card.agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.agent = {};
                $scope.deposit_card = angular.copy(original_card);
                $scope.deposit_card.agent_code = new_value;
                $scope.handler_name = "";
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {
                        agentMaster: {},
                        depositicketContacts: {}
                    })).$promise.then(function (agent) {
                            $scope.agent = agent[0];
                            /*if($scope.deposit_card_copy){
                             $scope.deposit_card = $scope.deposit_card_copy;
                             if($scope.deposit_card.transaction_type == '1'){
                             $scope.deposit_card.transaction_type = depositCardTypes.deposit;
                             }else if($scope.deposit_card.transaction_type == '2'){
                             $scope.deposit_card.transaction_type = depositCardTypes.draw;
                             }else if($scope.deposit_card.transaction_type == '3'){
                             $scope.deposit_card.transaction_type = depositCardTypes.drawCash;
                             }else{
                             $scope.deposit_card.transaction_type = depositCardTypes.transfer;
                             }
                             $scope.deposit_card_reset = angular.copy($scope.deposit_card);
                             }*/

                            if ($scope.agent) {
                                $scope.deposit_card.agent_info_id = $scope.agent.id;
                                $scope.deposit_card.agent_name = $scope.agent.agent_name;
                                //agentsLists.get(globalFunction.generateUrlParams({id:$scope.agent.id},{depositicketContacts:{}})).$promise.then(function(loanBusiness){
                                $scope.loanBusiness = $scope.agent.depositicketContacts;
                                if ($scope.loanBusiness.length > 0 && $scope.agent) {
                                    $scope.deposit_card.agent_contact_id = $scope.agent.agentMaster.id;
                                    $scope.handler_name = $scope.agent.agentMaster.agent_contact_name;
                                }
                                //});
                                depositCard.query({agent_info_id: $scope.agent.id}).$promise.then(function (cards) {
                                    $scope.cards = cards;
                                    var card_data = _.findWhere(cards, {card_name: 'HKD'});
                                    $scope.deposit_card.deposit_card_id = card_data ? card_data.id : '';
                                    /*_.each($scope.cards,function(card){
                                     if(card.card_name == 'A'){
                                     $scope.deposit_card.deposit_card_id = card.id;
                                     }
                                     });*/
                                    $scope.select_card();
                                });

                            } else {
                                $scope.deposit_card.agent_info_id = "";
                                $scope.deposit_card.agent_name = "";
                                $scope.handler_name = "";
                                $scope.cards = [];
                                $scope.loanBusiness = [];
                            }
                        });
                } else {
                    $scope.deposit_card.agent_info_id = "";
                    $scope.deposit_card.agent_name = "";
                    $scope.cards = [];
                    $scope.loanBusiness = [];
                }
            }));

            //修改備註
            $scope.editRemark = function (record) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/share/edit-remark.html",
                    controller: "depositCardEditRemarkCtrl",
                    resolve: {
                        record: function () {
                            return record;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    $scope.select();
                });
            }


            $scope.handle_change = function () {
                var agent_contact_data = _.findWhere($scope.loanBusiness, {'id': $scope.deposit_card.agent_contact_id});
                $scope.handler_name = agent_contact_data.agent_contact_name;
            }


            $scope.$watch('deposit_card.receive_agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.agent_receive = {};
                if (new_value && $scope.deposit_card.transaction_type == 'TRANSFER') {
                    agentsLists.query({agent_code: new_value}).$promise.then(function (agent_receive) {
                        $scope.agent_receive = agent_receive[0];
                        if ($scope.agent_receive) {
                            $scope.deposit_card.receive_agent_id = $scope.agent_receive.id;
                            $scope.deposit_card.receive_agent_name = $scope.agent_receive.agent_name;
                            depositCard.query({agent_info_id: $scope.agent_receive.id}).$promise.then(function (receive_cards) {
                                $scope.receive_cards = receive_cards;
                                var card_data = _.findWhere(receive_cards, {card_name: 'HKD'});
                                $scope.deposit_card.receive_card_id = card_data ? card_data.id : '';
                                /*_.each($scope.receive_cards,function(card){
                                 if(card.card_name == 'A'){
                                 $scope.deposit_card.receive_card_id = card.id;
                                 }
                                 });*/
                            });
                        } else {
                            $scope.deposit_card.receive_agent_id = "";
                            $scope.receive_cards = [];
                        }
                    });
                } else {
                    $scope.deposit_card.agent_info_id = "";
                    $scope.receive_cards = [];
                }
            }));

            //根據不同存卡選擇金額
            $scope.select_card = function () {
                if ($scope.deposit_card.deposit_card_id) {
                    depositCard.get({id: $scope.deposit_card.deposit_card_id}).$promise.then(function (card) {
                        if (card) {
                            $scope.deposit_card.card_name = card.card_name;
                            $scope.deposit_card.deposit_amount = card.deposit_amount;
                            $scope.deposit_card.frozen_amount = card.frozen_amount;
                            $scope.deposit_card.frozen_deposit_amount = card.frozen_deposit_amount;
                            $scope.deposit_card.usable_amount = card.usable_amount;
                            $scope.deposit_card.allow_negative = card.allow_negative;
                            $scope.localtion.print_page = card.print_page;
                            $scope.localtion.print_row = card.print_row;
                        } else {
                            $scope.deposit_card.card_name = "";
                            $scope.deposit_card.deposit_amount = 0;
                            $scope.deposit_card.frozen_amount = 0;
                            $scope.deposit_card.frozen_deposit_amount = 0;
                            $scope.deposit_card.usable_amount = 0;
                            $scope.deposit_card.allow_negative = "";
                            $scope.localtion.print_page = "";
                            $scope.localtion.print_row = "";
                        }
                    });
                } else {
                    $scope.deposit_card.card_name = "";
                    $scope.deposit_card.deposit_amount = 0;
                    $scope.deposit_card.frozen_amount = 0;
                    $scope.deposit_card.frozen_deposit_amount = 0;
                    $scope.deposit_card.usable_amount = 0;
                    $scope.deposit_card.allow_negative = "";
                    $scope.localtion.print_page = "";
                    $scope.localtion.print_row = "";
                }
            }
            //根據類型顯示不同的存卡類型
            $scope.select_type = function () {
                if ($scope.deposit_card.transaction_type == depositCardTypes.transfer) {
                    $scope.show_type = true;
                } else {
                    $scope.show_type = false;
                }
            }
            //新增存卡流水
            $scope.addCardRecord = function () {
                $scope.sub_post_put = "POST";
                $scope.disabled_update = false;
                $scope.deposit_card.agent_name = "";
                $scope.deposit_card = angular.copy(original_card);
                $scope.form_deposit_create.clearErrors();
                $scope.form_deposit_create.$setPristine();
            }

            //編輯存卡流水詳細
            /*$scope.update = function(id){
             $scope.sub_post_put = "PUT";
             $scope.disabled_update = true;
             depositCardRecord.get({id:id}).$promise.then(function(deposit_card){
             $scope.deposit_card_edit = angular.copy(deposit_card);
             $scope.deposit_card.agent_code = deposit_card.agent_code;
             $scope.deposit_card_copy = angular.copy(deposit_card);

             });
             }*/

            //弹出提示框
            $scope.is_two_send = false;
            $scope.SMSsend = function (data, type) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/deposit/card-create-confirm.html",
                    controller: 'CardCreateConfirmCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        },
                        type: function () {
                            return type;
                        }
                    }
                });
                modalInstance.result.then((function (status) {
                    if (status) {
                        $scope.is_two_send = true;
                    }
                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }

            //增加存卡記錄
            $scope.disabled_submit = false;
            $scope.add = function (print) {
                if ($scope.disabled_submit) {
                    return false;
                }
                if ($scope.deposit_card.allow_negative == '0') {
                    if ($scope.deposit_card.usable_amount == '0' && $scope.deposit_card.transaction_type != '' && $scope.deposit_card.transaction_type != depositCardTypes.deposit) {
                        topAlert.warning("此戶口編號可用餘額不足以取款或提現！");
                        return;
                    } else {
                        if ($scope.deposit_card.transaction_type && $scope.deposit_card.transaction_type != depositCardTypes.deposit) {
                            if($scope.deposit_card.transaction_type!='THAW') {
                                if (parseFloat($scope.deposit_card.transaction_amount) >parseFloat($scope.deposit_card.usable_amount)) {
                                    $scope.deposit_card.transaction_type!='FROZEN'? topAlert.warning("金額不能大於可用餘額！"):topAlert.warning("凍結金額不能大於可用餘額！");
                                    return;
                                }
                            }
                        }
                    }
                }
                if ($scope.deposit_card.transaction_type == 'FROZEN') {
                    if (parseFloat($scope.deposit_card.usable_amount) < 0||parseFloat($scope.deposit_card.usable_amount) == 0) {
                        parseFloat($scope.deposit_card.usable_amount) < 0?topAlert.warning("可用餘額为负数不能冻结！"):topAlert.warning("可用餘額为0不能冻结！");
                        return;
                    }
                    if (parseFloat($scope.deposit_card.transaction_amount) >parseFloat($scope.deposit_card.usable_amount)) {
                        topAlert.warning("凍結金額不能大於可用餘額！");
                        return;
                    }
                }
                if($scope.deposit_card.transaction_type=='THAW') {
                    if(parseFloat($scope.deposit_card.transaction_amount)>parseFloat($scope.deposit_card.frozen_deposit_amount)){
                        topAlert.warning("解凍金額不能大於凍結金額!");
                        return;
                    }
                }
                if(+$scope.deposit_card.transaction_amount&&$scope.deposit_card.transaction_amount.toString().indexOf('.')!=-1){
                    if($scope.deposit_card.transaction_amount.toString().split(".")[1].length>4){
                        topAlert.warning('金額小數位不能大於4位');
                        return;
                    }
                }
                $scope.deposit_card.transaction_amount.toString();
                if ($scope.deposit_card.transaction_type != depositCardTypes.transfer) {
                    $scope.deposit_card.receive_agent_id = '';
                    $scope.deposit_card.receive_agent_code = '';
                    $scope.deposit_card.receive_card_id = '';
                }
                angular.forEach($scope.loanBusiness, function (loanBusine) {
                    if (loanBusine.id == $scope.deposit_card.agent_contact_id) {
                        $scope.deposit_card.agent_contact_name = loanBusine.agent_contact_name;
                    }
                });
                /*if($scope.deposit_card.id){
                 $scope.form_deposit_create.checkValidity().then(function(){
                 $scope.disabled_submit = true;
                 pinCodeModal(depositCardRecord, 'update' , $scope.deposit_card, '修改成功').then(function () {
                 $scope.select();
                 $scope.deposit_card = angular.copy(original_card);
                 $scope.show_type = false;
                 $scope.sub_post_put = "POST";
                 $scope.disabled_submit = false;
                 $scope.disabled_update = false;
                 },function(){
                 $scope.disabled_submit = false;
                 $scope.disabled_update = true;
                 })
                 });
                 }else{*/
                $scope.form_deposit_create.checkValidity().then(function () {
                    $scope.disabled_submit = true;
                    //判断是否列印了表头
                    if (print === true) {
                        $scope.print_add(print);
                    } else {
                        $scope.print_add(print);
                    }
                });
                //}
            }

            //提交并列印
            $scope.print_add = function (print) {

                $scope.print_header_agent_code = angular.copy($scope.deposit_card.agent_code);
                $scope.print_header_deposit_card_id = angular.copy($scope.deposit_card.deposit_card_id);
                $scope.print_header_card_name = angular.copy($scope.deposit_card.card_name);
                pinCodeModal(depositCard, 'transaction', $scope.deposit_card, '添加成功').then(function (data) {
                    //});
//                depositCard.transaction($scope.deposit_card, function (data) {
                    if (print === true) {
                        depositCard.get({id: $scope.deposit_card.deposit_card_id}).$promise.then(function (_depositCard) {
//                            printRecord.save({print_module:'1',print_type:"1",depositcard_record_id:$scope.selected_deposit_card.id}).$promise.then(function(){
////                                    topAlert.success('列印記錄新增成功');
//                            });

                            qzPrinter.print('PDFDepositCardRecord', printerType.stylusPrinter, {
                                'deposit_card_record_id': data.depositCardRecord.id,
                                'hall_id': $scope.user.hall.id
                            }).then(function () {

                                topAlert.success('列印成功');
                                $scope.show_type = false;
                                $scope.sub_post_put = "POST";
                                $scope.disabled_submit = false;
                                $scope.disabled_update = false;

                                printRecord.save({
                                    print_module: '1',
                                    print_type: "1",
                                    depositcard_record_id: data.depositCardRecord.id
                                }).$promise.then(function () {
//                                    topAlert.success('列印記錄新增成功');
                                        $scope.print_record();
                                    });

                                //存卡15行之後提示打印表頭
//                                if(_depositCard.print_row == 15){
//                                    windowItems.confirm("提示","請先列印"+$scope.print_header_agent_code+"，存卡"+$scope.print_header_card_name+"的表頭",function(){
//                                        qzPrinter.print('PDFDepositCardTableHead',printerType.stylusPrinter,{'deposit_card_title_id':$scope.print_header_deposit_card_id, 'hall_id': $scope.user.hall.id}).then(function(){
//                                            topAlert.success('列印成功');
//                                            $scope.disabled_submit = false;
//                                            $scope.reset_print_header();
//                                        },function(){
//                                            $scope.disabled_submit = false;
//                                            $scope.reset_print_header();
//                                        });
//                                    });
//                                }

                                if (data.receiveCardRecord) {
                                    $scope.selected_deposit_card = data.receiveCardRecord;
//                                    $scope.print_card('存卡轉賬列印');
                                    qzPrinter.print('PDFDepositCardRecord', printerType.stylusPrinter, {
                                        'deposit_card_record_id': $scope.selected_deposit_card.id,
                                        'hall_id': $scope.user.hall.id
                                    }).then(function () {
                                        topAlert.success('列印成功');
                                        printRecord.save({
                                            print_module: '1',
                                            print_type: "1",
                                            depositcard_record_id: $scope.selected_deposit_card.id
                                        }).$promise.then(function () {
                                                //topAlert.success('列印記錄新增成功');
                                                $scope.print_record();
                                            });
                                    });
                                }

                            }, function () {
                                $scope.show_type = false;
                                $scope.sub_post_put = "POST";
                                $scope.disabled_submit = false;
                                $scope.disabled_update = false;
                            });
                        });
                    } else {
                        $scope.show_type = false;
                        $scope.sub_post_put = "POST";
                        $scope.disabled_submit = false;
                        $scope.disabled_update = false;
                    }
                    //解冻和冻结不要发送短信
                    if($scope.deposit_card.transaction_type!='THAW'&&$scope.deposit_card.transaction_type!='FROZEN'){
                        $scope.SMSsend(data, 1);//2：轉賬，1：其它
                    }
                    $scope.select();
                    $scope.reset_deposit_card();
                    $scope.select_transfer();
                    $scope.localtion.print_page = "";
                    $scope.localtion.print_row = "";

                }, function () {
                    $scope.disabled_submit = false;
                    $scope.disabled_update = false;
                })

            }

            //清空打印表頭的參數
            $scope.reset_print_header = function () {
                $scope.print_header_agent_code = "";
                $scope.print_header_deposit_card_id = "";
                $scope.print_header_card_name = "";
            }

            //重置存卡數據
            $scope.reset_deposit_card = function () {
                if ($scope.deposit_card.id) {
                    $scope.sub_post_put = "PUT";
                    $scope.disabled_update = true;
                    $scope.deposit_card = angular.copy($scope.deposit_card_reset);
                } else {
                    $scope.sub_post_put = "POST";
                    $scope.disabled_update = false;
                    $scope.deposit_card = angular.copy(original_card);
                }
                $scope.handler_name = "";
                $scope.form_deposit_create.clearErrors();
                $scope.form_deposit_create.$setPristine();
            }
            //電話授權
            $scope.authorization = function (deposit_card) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/deposit/card-manager-authorization.html",
                    controller: 'agentCardManagerAuthorizationCtrl',
                    resolve: {
                        deposit_card: function () {
                            return deposit_card;
                        }
                    }
                });
            }
            $scope.showSMS = function (deposit_card) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/deposit/card-manager-detail.html",
                    controller: 'agentCardManagerDetailCtrl',
                    resolve: {
                        deposit_card: function () {
                            return deposit_card;
                        }
                    }
                });
            }

            //存卡流水查詢
            var original;
            var init_condition = {
                agent_code: '',
                agent_name: '',
                card_name: '',
//                year_month:[currentShift.data.year_month],
//                transaction_time:['',''],
                shiftMark: {shift_date: ["", ""], year_month: [currentShift.data.year_month]},
                shift: "",
                transaction_type: "",
                sort: "transaction_time DESC"
            };
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);
            $scope.excel_condition = angular.copy(init_condition);
            //初始化列表數據
            $scope.statisticSums = {
                deposit_total: "0",
                draw_total: "0",
                cross_in_total: "0",
                cross_out_total: "0"
            }
            var conditions;
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = depositCardRecord;
            $scope.select = function (page) {
                $scope.condition.shiftMark.shift_date[0] = $scope.condition.shiftMark.shift_date[0] ? $filter('date')($scope.condition.shiftMark.shift_date[0], 'yyyy-MM-dd') : "";
                $scope.condition.shiftMark.shift_date[1] = $scope.condition.shiftMark.shift_date[1] ? $filter('date')($scope.condition.shiftMark.shift_date[1], 'yyyy-MM-dd') : "";

//                $scope.condition.transaction_time[0] = $filter('date')($scope.condition.transaction_time[0], 'yyyy-MM-dd');
//                $scope.condition.transaction_time[1] = $filter('date')($scope.condition.transaction_time[1], 'yyyy-MM-dd');
                conditions = angular.copy($scope.condition);
                conditions.shiftMark.year_month[0] = $filter('date')(conditions.shiftMark.year_month[0], 'yyyy-MM');
                if (conditions.shiftMark.year_month[0]) {
                    conditions.shiftMark.year_month[0] = conditions.shiftMark.year_month[0] + "-01";
                }
                if (conditions.agent_code != '') {
                    conditions.agent_code = conditions.agent_code;
                }
                if (conditions.agent_name != '') {
                    conditions.agent_name = conditions.agent_name + "!";
                }
                if (conditions.card_name != '') {
                    conditions.card_name = conditions.card_name + "!";
                }
                $scope.excel_condition = angular.copy(conditions);
                $scope.excel_condition.shiftMark.year_month[0] = $scope.condition.shiftMark.year_month[0] ? $filter('date')($scope.condition.shiftMark.year_month[0], 'yyyy-MM') : "";

                $scope.cardsRecords = $scope.pagination.select(page, conditions, {});
                //$scope.cardsRecords = $scope.pagination.select(page,conditions);
                //$scope.selected_deposit_card = "";
                $scope.statisticSums = depositCard.statisticSum(globalFunction.generateUrlParams(conditions, {}));
            }
            $scope.select();
            //搜索方法
            $scope.search = function () {
                $scope.select(1);
            }
            //重置查詢條件
            $scope.reset = function () {
                $scope.condition = angular.copy(original);
                $scope.select();
            }

            //轉賬流水查詢
            var transfer_original;
            var init_transfer_condition = {
                send_agent_code: '',
                receive_agent_code: '',
                send_card_name: '',
                receive_card_name: '',
                shiftMark: {shift_date: [""], year_month: [currentShift.data.year_month]},
                shift: "",
                transfer_time: ['', ''],
                sort: "create_time DESC"
            };
            transfer_original = angular.copy(init_transfer_condition);
            $scope.transfer_condition = angular.copy(init_transfer_condition);
            $scope.transfer_condition_excel = angular.copy(init_transfer_condition);
            //初始化列表數據
            var transfer_conditions;
            $scope.pagination_transfer = tmsPagination.create();
            $scope.pagination_transfer.resource = transfer;
            $scope.select_transfer = function (page) {
                $scope.transfer_condition.shiftMark.shift_date[0] = $filter('date')($scope.transfer_condition.shiftMark.shift_date[0], 'yyyy-MM-dd');
                $scope.transfer_condition.transfer_time[0] = $filter('date')($scope.transfer_condition.transfer_time[0], 'yyyy-MM-dd');
                $scope.transfer_condition.transfer_time[1] = $filter('date')($scope.transfer_condition.transfer_time[1], 'yyyy-MM-dd');

                transfer_conditions = angular.copy($scope.transfer_condition);
                transfer_conditions.shiftMark.year_month[0] = transfer_conditions.shiftMark.year_month[0] ? $filter('date')(transfer_conditions.shiftMark.year_month[0], 'yyyy-MM') : "";
                if (transfer_conditions.send_agent_code != '') {
                    transfer_conditions.send_agent_code = transfer_conditions.send_agent_code + "!";
                }
                if (transfer_conditions.receive_agent_code != '') {
                    transfer_conditions.receive_agent_code = transfer_conditions.receive_agent_code + "!";
                }
                if (transfer_conditions.send_card_name != '') {
                    transfer_conditions.send_card_name = transfer_conditions.send_card_name + "!";
                }
                if (transfer_conditions.receive_card_name != '') {
                    transfer_conditions.receive_card_name = transfer_conditions.receive_card_name + "!";
                }
                $scope.transfer_condition_excel = angular.copy(transfer_conditions);
                $scope.transfer_condition_excel.hall_id = $scope.transfer_condition.hall_id ? $scope.transfer_condition.hall_id : "";
                $scope.transferCardsRecords = $scope.pagination_transfer.select(page, transfer_conditions, {});
            }
            $scope.select_transfer();
            //搜索方法
            $scope.search_transfer = function () {
                $scope.select_transfer();
            }
            //重置查詢條件
            $scope.reset_transfer = function () {
                $scope.transfer_condition = angular.copy(transfer_original);
                $scope.select_transfer();
            }

            //飞数流水查詢
            var cross_transfer_original;
            var init_cross_transfer_condition = {
                send_agent_code: '',
                receive_agent_code: '',
                send_card_name: '',
                receive_card_name: '',
//                shiftMark:{shift_date:[""],year_month :[currentShift.data.year_month]},
//                shift:"",
//                transfer_time:['',''],
                send_time: ['', ''],
                receive_time: ['', ''],
                send_hall_id: "",
                receive_hall_id: "",
                sort: "create_time DESC"
            };
            cross_transfer_original = angular.copy(init_cross_transfer_condition);
            $scope.cross_transfer_condition = angular.copy(init_cross_transfer_condition);
            $scope.cross_transfer_condition_excel = angular.copy(init_cross_transfer_condition);
            //初始化列表數據
            var cross_transfer_conditions;
            $scope.pagination_cross_transfer = tmsPagination.create();
            $scope.pagination_cross_transfer.resource = crossTransfer;
            $scope.select_cross_transfer = function (page) {
//                $scope.cross_transfer_condition.shiftMark.shift_date[0] = $filter('date')($scope.cross_transfer_condition.shiftMark.shift_date[0], 'yyyy-MM-dd');
                $scope.cross_transfer_condition.send_time[0] = $filter('date')($scope.cross_transfer_condition.send_time[0], 'yyyy-MM-dd');
                $scope.cross_transfer_condition.send_time[1] = $filter('date')($scope.cross_transfer_condition.send_time[1], 'yyyy-MM-dd');
                $scope.cross_transfer_condition.receive_time[0] = $filter('date')($scope.cross_transfer_condition.receive_time[0], 'yyyy-MM-dd');
                $scope.cross_transfer_condition.receive_time[1] = $filter('date')($scope.cross_transfer_condition.receive_time[1], 'yyyy-MM-dd');
                cross_transfer_conditions = angular.copy($scope.cross_transfer_condition);
//                cross_transfer_conditions.shiftMark.year_month[0] = cross_transfer_conditions.shiftMark.year_month[0]?$filter('date')(cross_transfer_conditions.shiftMark.year_month[0], 'yyyy-MM'):"";
//                if(cross_transfer_conditions.send_agent_code != ''){
//                    cross_transfer_conditions.send_agent_code = cross_transfer_conditions.send_agent_code+"!";
//                }
//                if(cross_transfer_conditions.receive_agent_code != ''){
//                    cross_transfer_conditions.receive_agent_code = cross_transfer_conditions.receive_agent_code+"!";
//                }
                if (cross_transfer_conditions.send_card_name != '') {
                    cross_transfer_conditions.send_card_name = cross_transfer_conditions.send_card_name + "!";
                }
                if (cross_transfer_conditions.receive_card_name != '') {
                    cross_transfer_conditions.receive_card_name = cross_transfer_conditions.receive_card_name + "!";
                }
                $scope.cross_transfer_condition_excel = angular.copy(cross_transfer_conditions);
                $scope.cross_transfer_condition_excel.hall_id = user.hall.id;
                $scope.cross_transfer_condition_excel.hall_name = user.hall.hall_name;

                $scope.cross_transfers = $scope.pagination_cross_transfer.select(page, cross_transfer_conditions, {});
            }
            $scope.select_cross_transfer();
            //搜索方法
            $scope.search_cross_transfer = function () {
                $scope.select_cross_transfer();
            }
            //重置查詢條件
            $scope.reset_cross_transfer = function () {
                $scope.cross_transfer_condition = angular.copy(cross_transfer_original);
                $scope.select_cross_transfer();
            }
            //詳細
            $scope.detail = function (id) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/deposit/card-cross-transfer-detail.html",
                    controller: 'cardCrossTransferDetailCtrl',
                    resolve: {
                        id: function () {
                            return id;
                        }
                    }
                });
            }
            //飛數流水修改備註
            $scope.crossTransferRemark = function (cross_transfer, type) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/share/edit-remark.html",
                    controller: "depositCardCrossTransferRemarkCtrl",
                    resolve: {
                        record: function () {
                            return cross_transfer;
                        },
                        cross_transfer_type: function () {
                            return type;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    $scope.select_cross_transfer();
                });
            }
            //更新位置
            $scope.localtion = {
                id: "",
                print_page: "",
                print_row: ""
            }
            $scope.disabled_location = false;
            $scope.update_location = function () {
                if ($scope.deposit_card.deposit_card_id) {
                    $scope.localtion.id = $scope.deposit_card.deposit_card_id;
                } else {
                    topAlert.warning('請選擇存卡');
                    return;
                }

                $scope.form_update_localtion.checkValidity().then(function () {
                    $scope.disabled_location = true;
                    /*pinCodeModal(depositCard, 'UpdatePrintPosition',$scope.localtion, '位置更新成功！').then(function () {
                     $scope.disabled_location = false;
                     },function(){
                     $scope.disabled_location = false;
                     });*/
                    depositCard.UpdatePrintPosition($scope.localtion, function (data) {
                        topAlert.success("位置更新成功！");
                        $scope.disabled_location = false;
                    }, function () {
                        $scope.disabled_location = false;
                    });
                });
            }


            /* ======================列印功能=================== */
            //列印
            $scope.print_header = function () {
                if ($scope.deposit_card.deposit_card_id) {
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/deposit/print-header.html",
                        controller: 'printHeaderCtrl',
                        windowClass: 'print-modal',
                        resolve: {
                            deposit_card_id: function () {
                                return $scope.deposit_card.deposit_card_id;
                            },
                            login_user: function () {
                                return $scope.user;
                            }
                        }
                    });
                    modalInstance.result.then((function (remark) {
                    }), function () {
                        $log.info("Modal dismissed at: " + new Date());
                    });
                } else {
                    topAlert.warning('請選擇存卡');
                }
            }
            //選中存卡
            $scope.selectDepositCard = function (cardsRecord) {
                $scope.selected_deposit_card = cardsRecord;
            }

            $scope.print_card = function (title) {
                if ($scope.selected_deposit_card) {
//                    var modalInstance;
//                    modalInstance = $modal.open({
//                        templateUrl: "views/deposit/print-card.html",
//                        controller: 'printCardCtrl',
//                        resolve: {
//                            selected_deposit_card:function(){
//                                return $scope.selected_deposit_card;
//                            },
//                            title:function(){
//                                return title;
//                            },
//                            login_user:function(){
//                                return $scope.user;
//                            }
//                        }
//                    });
//                    modalInstance.result.then(function(_depositCard) {
                    //存卡15行之後提示打印表頭
//                        if(_depositCard.print_row == 15){
//                            windowItems.confirm("提示","請先列印"+_depositCard.agent_code+"，存卡"+_depositCard.card_name+"的表頭",function(){
//                                qzPrinter.print('PDFDepositCardTableHead',printerType.stylusPrinter,{'deposit_card_title_id':_depositCard.id, 'hall_id': $scope.user.hall.id}).then(function(){
//                                    topAlert.success('列印成功');
//                                    //$scope.reset_print_header();
//                                }/*,function(){
//                                 $scope.reset_print_header();
//                                 }*/);
//                            });
//                        }
//                        $scope.selected_deposit_card="";
//                    }, function() {
//                        $log.info("Modal dismissed at: " + new Date());
//                    });

//                    qzPrinter.print('PDFDepositCardTableHead',printerType.stylusPrinter,{'deposit_card_record_id':$scope.selected_deposit_card.id, 'hall_id': $scope.user.hall.id}).then(function(){
//                                    topAlert.success('列印成功');
//                                    //$scope.reset_print_header();
//                    }/*,function(){
//                     $scope.reset_print_header();
//                     }*/);
//                    printRecord.save({print_module:'1',print_type:"2",depositcard_record_id:$scope.selected_deposit_card.id}).$promise.then(function(){
//                        topAlert.success('列印記錄新增成功');
//                    });

                    qzPrinter.print('PDFDepositCardRecord', printerType.stylusPrinter, {
                        'deposit_card_record_id': $scope.selected_deposit_card.id,
                        'hall_id': $scope.user.hall.id
                    }).then(function () {
                        topAlert.success('列印成功');
                        if (title == '存卡轉賬列印') {
                            printRecord.save({
                                print_module: '1',
                                print_type: "1",
                                depositcard_record_id: $scope.selected_deposit_card.id
                            }).$promise.then(function () {
                                    //topAlert.success('列印記錄新增成功');
                                });
                        } else {
                            printRecord.save({
                                print_module: '1',
                                print_type: "2",
                                depositcard_record_id: $scope.selected_deposit_card.id
                            }).$promise.then(function () {
                                    //topAlert.success('列印記錄新增成功');
                                    $scope.print_record();
                                });
                        }

                        //$scope.reset_print_header();
                    }/*,function(){
                     $scope.reset_print_header();
                     }*/);
                } else {
                    topAlert.warning('請選中一條存卡記錄');
                }
            }

            $scope.disable_print = false;
            //打印單據
            $scope.print_bill = function () {
                $scope.bill = {
                    "transaction_time": $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    "agent_code": $scope.deposit_card.agent_code,
                    "agent_name": $scope.deposit_card.agent_name,
                    "transaction_amount": $scope.deposit_card.transaction_amount * 10000,
                    "type": $scope.deposit_card.transaction_type == 'DEPOSIT' ? 1 : 2,
                    "remark": $scope.deposit_card.remark,
                    "handler_name": $scope.handler_name
                }
                $scope.disable_print = true;
                qzPrinter.print('PDFFakeDepositCardReceipt', printerType.stylusPrinter, $scope.bill).then(function () {
                    topAlert.success('列印成功');
                    $scope.disable_print = false;
                }, function (msg) {
                    $scope.disable_print = false;
                })
            }
            //補印選中項單據
            $scope.print_bill_id = function () {
                if ($scope.selected_deposit_card) {
                    $scope.disable_print = true;
                    depositCard.get({id: $scope.selected_deposit_card.depositcard_id}).$promise.then(function (_depositCard) {
//                        if (_depositCard.print_header == 0) {
//                            topAlert.warning("請先列印表頭");
                        $scope.disable_print = false;
//                        } else {
                        qzPrinter.print('PDFDepositCardReceipt', printerType.stylusPrinter, {'deposit_card_record_id': $scope.selected_deposit_card.id}).then(function () {
                            topAlert.success('列印成功');
                            //depositCard.get({id: $scope.selected_deposit_card.depositcard_id}).$promise.then(function (card) {
                            /*if(_depositCard.print_row == 15){
                             topAlert.warning('請列印表頭');
                             }*/
                            //});
                            $scope.disable_print = false;
                        }, function (msg) {
                            $scope.disable_print = false;
                        })
//                        }
                    });

                } else {
                    topAlert.warning('請選中一條存卡記錄');
                }
            }

            //
            $scope.print_record_contion = {
                create_time: currentShift.data.shift_date
            }
            $scope.print_record = function () {
                $scope.print_record_contion.create_time = $scope.print_record_contion.create_time ? $filter('date')($scope.print_record_contion.create_time, 'yyyy-MM-dd') : "";
                printRecord.printRecordTotal($scope.print_record_contion).$promise.then(function (printRecords) {
                    $scope.print_num = printRecords[0];
                    if (printRecords.length == 1) {
                        $scope.print_num = printRecords[0];
                    } else {
                        _.each(printRecords, function (printRecord) {
                            if (printRecord.print_num != 0) {
                                $scope.print_num.print_num = printRecord.print_num;
                            }
                            if (printRecord.fill_num != 0) {
                                $scope.print_num.fill_num = printRecord.fill_num;
                            }
                        })
                    }
                });
            }
            $scope.print_record();

        }]).controller('depositCardEditRemarkCtrl', ['$scope', 'globalFunction', 'topAlert', '$modalInstance', 'depositCardRecord', 'record',
        function ($scope, globalFunction, topAlert, $modalInstance, depositCardRecord, record) {
            $scope.title = "修改存卡備註";
            $scope.record_copy = angular.copy(record);
            $scope.record_create = {
                id: $scope.record_copy.id,
                remark: "",
                pin_code: ""
            };

            depositCardRecord.get({id: $scope.record_copy.id}).$promise.then(function (deposit_card) {
                $scope.record_create = deposit_card;
            });

            $scope.disabled_submit = false;
            $scope.commission_url = globalFunction.getApiUrl('deposit/depositcardrecord');
            $scope.edit = function () {
                if ($scope.disabled_submit) {
                    return;
                }
                $scope.disabled_submit = true;
                $scope.form_commission.checkValidity().then(function () {
                    depositCardRecord.update($scope.record_create, function () {
                        topAlert.success("修改備註成功！");
                        $scope.disabled_submit = false;
                        $modalInstance.close();
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                })
            };

            $scope.close = function () {
                $modalInstance.dismiss();
            }

        }]).controller('depositCardCrossTransferRemarkCtrl', ['$scope', 'globalFunction', 'topAlert', '$modalInstance', 'crossTransfer', 'record', 'cross_transfer_type', 'formatNumber',
        function ($scope, globalFunction, topAlert, $modalInstance, crossTransfer, record, cross_transfer_type, formatNumber) {
            $scope.title = "修改飛數備註";
            $scope.record_create = angular.copy(record);
            $scope.record_create.cross_transfer_type = $scope.record_create.pin_code = "";
            $scope.record_create.remark = cross_transfer_type == 1 ? $scope.record_create.send_remark : $scope.record_create.receive_remark;
            $scope.record_create.cross_transfer_type = cross_transfer_type;
//            depositCardRecord.get({id:$scope.record_copy.id}).$promise.then(function(deposit_card){
//                $scope.record_create = deposit_card;
//            });

            $scope.disabled_submit = false;
            $scope.commission_url = globalFunction.getApiUrl('deposit/crosstransfer');
            $scope.edit = function () {
                if ($scope.disabled_submit) {
                    return;
                }
                $scope.record_create.amount = formatNumber($scope.record_create.amount);
                $scope.disabled_submit = true;
                $scope.form_commission.checkValidity().then(function () {
                    crossTransfer.update($scope.record_create, function () {
                        topAlert.success("修改備註成功！");
                        $scope.disabled_submit = false;
                        $modalInstance.close();
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                })
            };

            $scope.close = function () {
                $modalInstance.dismiss();
            }

        }]).controller('printHeaderCtrl', ['$scope', 'qzPrinter', 'printerType', 'deposit_card_id', '$modalInstance', 'topAlert', 'login_user',
        function ($scope, qzPrinter, printerType, deposit_card_id, $modalInstance, topAlert, login_user) {
            $scope.disable_print = false;
            $scope.print = function () {
                if (deposit_card_id) {
                    $scope.disable_print = true;
                    qzPrinter.print('PDFDepositCardTableHead', printerType.stylusPrinter, {
                        'deposit_card_title_id': deposit_card_id,
                        'hall_id': login_user.hall.id
                    }).then(function () {
                        topAlert.success('列印成功');
                        $scope.disable_print = false;
                        $scope.cancel();
                    }, function (msg) {
                        $scope.disable_print = false;
                    })
                }
            }

            $scope.cancel = function () {
                $modalInstance.close();
            }

        }]).controller('printCardCtrl', ['$scope', 'depositCard', 'qzPrinter', 'printerType', 'selected_deposit_card', 'globalFunction', '$modalInstance', 'pinCodeModal', 'topAlert', 'title', 'login_user',
        function ($scope, depositCard, qzPrinter, printerType, selected_deposit_card, globalFunction, $modalInstance, pinCodeModal, topAlert, title, login_user) {

            $scope.title = title;
            $scope.selected_deposit_card = selected_deposit_card;
            $scope.disable_print = false;

            $scope.localtion_url = globalFunction.getApiUrl('deposit/depositcard/update-print-position');
            $scope.print = function () {
                if (selected_deposit_card.id) {
                    $scope.disable_print = true;
                    depositCard.get({id: $scope.selected_deposit_card.depositcard_id}).$promise.then(function (_depositCard) {
                        qzPrinter.print('PDFDepositCardRecord', printerType.stylusPrinter, {
                            'deposit_card_record_id': selected_deposit_card.id,
                            'hall_id': login_user.hall.id
                        }).then(function () {
                            topAlert.success('列印成功');
                            //if(_depositCard.print_row == 15){
                            //topAlert.warning('請列印表頭');
                            //}
                            $scope.disable_print = false;
                            $modalInstance.close(_depositCard);
                        }, function () {
                            $scope.disable_print = false;
                        })
                    });
                } else {
                    topAlert.warning("存卡ID為空");
                }
            }

            $scope.cancel = function () {
                $modalInstance.close();
            }

            //更新位置
            $scope.localtion = {
                id: selected_deposit_card.depositcard_id,
                print_page: "",
                print_row: ""
            }
            depositCard.get(globalFunction.generateUrlParams({id: selected_deposit_card.depositcard_id}, {})).$promise.then(function (card) {
                if (card) {
                    $scope.localtion.print_page = card.print_page;
                    $scope.localtion.print_row = card.print_row;
                }
            });
            $scope.disabled_location = false;
            $scope.update_location = function () {
                $scope.form_update_localtion.checkValidity().then(function () {
                    $scope.disabled_location = true;

                    depositCard.UpdatePrintPosition($scope.localtion, function (data) {
                        topAlert.success("位置更新成功！");
                        $scope.disabled_location = false;
                    }, function () {
                        $scope.disabled_location = false;
                    });

//                    pinCodeModal(depositCard, 'UpdatePrintPosition',$scope.localtion, '位置更新成功！').then(function () {
//                        $scope.disabled_location = false;
//                    },function(){
//                        $scope.disabled_location = false;
//                    });
                });
            }

        }]).controller('cardCrossTransferDetailCtrl', ['$scope', 'crossTransfer', '$modalInstance', 'id', 'crossTransferTypes',
        function ($scope, crossTransfer, $modalInstance, id, crossTransferTypes) {
            $scope.crossTransferTypes = crossTransferTypes;
            if (id) {
                $scope.cross_transfer = crossTransfer.get({id: id});
            }
            $scope.close = function () {
                $modalInstance.close(false);
            }
        }]).controller('agentCardManagerAuthorizationCtrl', ['$scope', 'deposit_card', '$modalInstance', '$modal',
        function ($scope, deposit_card, $modalInstance, $modal) {
            //自定義變量
            $scope.showCross = true;
            $scope.closeCross = $scope.show = false;

            $scope.authorization = function () {
                $scope.show = true;
                if ($scope.show) {
                    $scope.showCross = false;
                    $scope.closeCross = true;
                }
            }
            $scope.cancel = function () {
                $modalInstance.close();
            }
            $scope.remove = function () {
                $modalInstance.close();
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/deposit/card-manager-detail.html",
                    controller: 'agentCardManagerDetailCtrl',
                    resolve: {
                        deposit_card: function () {
                            return deposit_card;
                        }
                    }
                });
            }
        }]).controller('agentCardManagerDetailCtrl', ['$scope', 'deposit_card', 'agentsLists', 'depositCard', 'depositCardTypes', '$modalInstance',
        function ($scope, deposit_card, agentsLists, depositCard, depositCardTypes, $modalInstance) {
            $scope.depositCardTypes = depositCardTypes;
            $scope.receive_card = {
                agent_code: "",
                agent_name: "",
                card_name: ""
            }

            if (deposit_card) {
                $scope.deposit_card = deposit_card;
                if ($scope.deposit_card.transaction_type == $scope.depositCardTypes.transfer) {
                    agentsLists.get({id: $scope.deposit_card.receive_agent_id}).$promise.then(function (agent) {
                        if (agent) {
                            $scope.receive_card.agent_code = agent.agent_code;
                            $scope.receive_card.agent_name = agent.agent_name;
                        } else {
                            $scope.receive_card.agent_code = "";
                            $scope.receive_card.agent_name = "";
                        }
                    });
                    depositCard.get({id: $scope.deposit_card.receive_card_id}).$promise.then(function (receive_card) {
                        if (receive_card) {
                            $scope.receive_card.card_name = receive_card.card_name;
                        }
                    });

                }
            } else {
                $scope.deposit_card = {};
            }
            $scope.cancel = function () {
                $modalInstance.close();
            }

        }]).controller('depositCardRecordCtrl', ['$scope', 'depositCardRecord', 'hallName', 'tmsPagination', 'globalFunction', 'TransactionTypes', 'breadcrumb', '$filter',
        function ($scope, depositCardRecord, hallName, tmsPagination, globalFunction, TransactionTypes, breadcrumb, $filter) {
            //麵包屑導航
            breadcrumb.items = [
                {"name": "存卡流水", "active": true}
            ];
            //自定義變量
            $scope.halls = hallName.query();
            $scope.transactionTypes = TransactionTypes.items;
            //查詢變量
            var original;
            var init_condition = {
                agent_code: '',
                agent_name: '',
                //hall_id:'',
                shift: '',
                transaction_type: '',
                create_time: ['', '']
            };
            original = angular.copy(init_condition);
            $scope.condition = angular.copy(init_condition);

            //初始化列表數據
            var conditions;
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = depositCardRecord;
            $scope.select = function (page) {
                $scope.condition.create_time[0] = $filter('date')($scope.condition.create_time[0], 'yyyy-MM-dd');
                $scope.condition.create_time[1] = $filter('date')($scope.condition.create_time[1], 'yyyy-MM-dd');
                conditions = angular.copy($scope.condition);

                if (conditions.agent_code != '') {
                    conditions.agent_code = conditions.agent_code + "!";
                }
                if (conditions.agent_name != '') {
                    conditions.agent_name = conditions.agent_name + "!";
                }
                $scope.cardsRecords = $scope.pagination.select(page, conditions);
            }
            $scope.select();
            //搜索方法
            $scope.search = function () {
                $scope.select(1);
            }
            //重置查詢條件
            $scope.reset = function () {
                $scope.condition = angular.copy(original);
                $scope.select();
            }
        }]);
}).call(this);
