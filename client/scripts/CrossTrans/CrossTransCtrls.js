(function () {
    'use strict';
    angular.module('app.cross-trans.ctrls', ['app.cross-trans.services', 'app.cross-trans.json']).controller('crossTransferManagerCtrl', [
        '$scope', '$modal', 'crossTransfer', 'depositCard', 'pinCodeModal', 'loanBusiness', 'globalFunction', 'tmsPagination', 'crossTransferStatus', 'crossTransferTypes', '$log', 'breadcrumb', 'hallName', 'agentsLists', 'topAlert', 'getDate',
        function ($scope, $modal, crossTransfer, depositCard, pinCodeModal, loanBusiness, globalFunction, tmsPagination, crossTransferStatus, crossTransferTypes, $log, breadcrumb, hallName, agentsLists, topAlert, getDate) {
            //麵包屑導航
            breadcrumb.items = [
                {"name": "飛數管理", "active": true}
            ];
            //自定義變量
            hallName.query({"hall_type": 2}).$promise.then(function (halls) {
                $scope.halls = halls;
                angular.forEach($scope.halls, function (hall, index) {
                    if (hall.id == $scope.user.hall.id) {
                        $scope.halls.splice(index, 1);
                    }
                })
            });
            $scope.cross_transfer_url = globalFunction.getApiUrl('deposit/crosstransfer');
            $scope.crossTransferStatus = crossTransferStatus;
            $scope.crossTransferTypes = crossTransferTypes;
            $scope.nowDate = getDate(new Date());
            //創建飛數model
            var original;
            var init_cross_transfer = {
                "send_card_id": "",
                "send_agent_name": "",
                "receive_card_id": "",
                "receive_agent_name": "",
                "receive_hall_id": "",
                "amount": "",
                "remark": "",
                "pin_code": ""
            };
            original = angular.copy(init_cross_transfer);
            $scope.cross_transfer = angular.copy(init_cross_transfer);
            //監控飛出客戶編號
            $scope.$watch('send_agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.send_agent = {};
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function (send_agent) {
                        $scope.send_agent = send_agent[0];
                        if ($scope.send_agent) {
                            $scope.cross_transfer.send_agent_name = $scope.send_agent.agent_name;
                            depositCard.query(globalFunction.generateUrlParams({
                                agent_info_id: $scope.send_agent.id,
                                hall_id: $scope.user.hall.id
                            }, {})).$promise.then(function (cards) {
                                    $scope.cards = cards;
                                });
                            $scope.deposit_send_card = angular.copy(original_send);
                            $scope.cross_transfer.send_card_id = '';
                        } else {
                            $scope.send_agent = {};
                            $scope.cards = [];
                            $scope.cross_transfer.send_card_id = '';
                            $scope.deposit_send_card = angular.copy(original_send);
                        }
                    });
                } else {
                    $scope.cards = [];
                    $scope.cross_transfer.send_card_id = '';
                    $scope.deposit_send_card = angular.copy(original_send);
                }
            }));

            //根據飛出不同存卡選擇金額
            var original_send;
            $scope.deposit_send_card = {
                deposit_amount: "",
                frozen_amount: "",
                usable_amount: ""
            };
            original_send = angular.copy($scope.deposit_send_card);
            $scope.select_send_card = function () {
                if ($scope.cross_transfer.send_card_id) {
                    depositCard.get(globalFunction.generateUrlParams({id: $scope.cross_transfer.send_card_id}, {})).$promise.then(function (card) {
                        if (card) {
                            $scope.deposit_send_card.deposit_amount = card.deposit_amount;
                            $scope.deposit_send_card.frozen_amount = card.frozen_amount;
                            $scope.deposit_send_card.usable_amount = card.usable_amount;
                        } else {
                            $scope.deposit_send_card.deposit_amount = "";
                            $scope.deposit_send_card.frozen_amount = "";
                            $scope.deposit_send_card.usable_amount = "";
                        }
                    });
                } else {
                    $scope.deposit_send_card.deposit_amount = "";
                    $scope.deposit_send_card.frozen_amount = "";
                    $scope.deposit_send_card.usable_amount = "";
                }
            }
            //對飛入客戶提供飛入廳的id
            $scope.show_cross = true;
            $scope.select_hall = function () {
                if ($scope.cross_transfer.receive_hall_id) {
                    $scope.show_cross = false;
                    if ($scope.receive_agent_code) {
                        agentsLists.query(globalFunction.generateUrlParams({agent_code: $scope.receive_agent_code}, {})).$promise.then(function (receive_agent) {
                            depositCard.query(globalFunction.generateUrlParams({
                                agent_info_id: $scope.receive_agent.id,
                                hall_id: $scope.cross_transfer.receive_hall_id,
                                only_current_hall: 0
                            }, {})).$promise.then(function (cards) {
                                    $scope.receive_cards = cards;
                                });
                        })
                    }
                } else {
                    $scope.show_cross = true;
                    $scope.receive_agent_code = '';
                }
            }

            //監控飛入客戶編號
            $scope.$watch('receive_agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.receive_agent = {};
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function (receive_agent) {
                        $scope.receive_agent = receive_agent[0];
                        if ($scope.receive_agent) {
                            $scope.cross_transfer.receive_agent_name = $scope.receive_agent.agent_name;
                            depositCard.query(globalFunction.generateUrlParams({
                                agent_info_id: $scope.receive_agent.id,
                                hall_id: $scope.cross_transfer.receive_hall_id,
                                only_current_hall: 0
                            }, {})).$promise.then(function (cards) {
                                    $scope.receive_cards = cards;
                                });
                            $scope.deposit_receive_card = angular.copy(original_receive);
                            $scope.cross_transfer.receive_card_id = '';
                        } else {
                            $scope.receive_agent = {};
                            $scope.receive_cards = [];
                            $scope.deposit_receive_card = angular.copy(original_receive);
                            $scope.cross_transfer.receive_card_id = '';
                        }
                    });
                } else {
                    $scope.receive_cards = [];
                    $scope.deposit_receive_card = angular.copy(original_receive);
                    $scope.cross_transfer.receive_card_id = '';
                }

            }));
            //根據飛入不同存卡選擇金額
            var original_receive;
            $scope.deposit_receive_card = {
                deposit_amount: "",
                frozen_amount: "",
                usable_amount: ""
            };
            original_receive = angular.copy($scope.deposit_receive_card);

            $scope.select_receive_card = function () {
                if ($scope.cross_transfer.receive_card_id) {
                    depositCard.get(globalFunction.generateUrlParams({id: $scope.cross_transfer.receive_card_id}, {})).$promise.then(function (card) {
                        if (card) {
                            $scope.deposit_receive_card.deposit_amount = card.deposit_amount;
                            $scope.deposit_receive_card.frozen_amount = card.frozen_amount;
                            $scope.deposit_receive_card.usable_amount = card.usable_amount;
                        } else {
                            $scope.deposit_receive_card.deposit_amount = "";
                            $scope.deposit_receive_card.frozen_amount = "";
                            $scope.deposit_receive_card.usable_amount = "";
                        }
                    });
                } else {
                    $scope.deposit_receive_card.deposit_amount = "";
                    $scope.deposit_receive_card.frozen_amount = "";
                    $scope.deposit_receive_card.usable_amount = "";
                }
            }
            //飛數
            $scope.crossTransferDispose = function () {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/cross-transfer/cross-transfer-dispose.html",
                    controller: 'agentCrossTransferDisposeCtrl'
                });
                modalInstance.result.then((function (status) {
                    if (status) {
                        $scope.select();
                    }
                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }

            //請求飛數
            $scope.crossTransferRequest = function () {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/cross-transfer/cross-transfer-request.html",
                    controller: 'agentCrossTransferRequestCtrl'
                });
                modalInstance.result.then((function (status) {
                    if (status) {
                        $scope.select();
                    }
                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }
            //飛數處理彈出框
            $scope.dispose = function (cross_transfer) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/cross-transfer/cross-transfer-detail.html",
                    controller: 'agentCrossTransferDetailCtrl',
                    resolve: {
                        cross_transfer: function () {
                            return cross_transfer;
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

            //飛出廳取消操作
            $scope.cross_transfer_cancel = function (cross_transfer) {
                pinCodeModal(crossTransfer, 'handle', {
                    cross_transfer_id: cross_transfer.id,
                    cross_transfer_type: '4',
                    type: cross_transfer.type
                }, '飛數取消成功！').then(function () {
                    $scope.select();
                })
            }


            //待處理請求列表初始化數據
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = crossTransfer;
            $scope.select = function (page) {
                $scope.cross_transfers = $scope.pagination.select(page, globalFunction.generateUrlParams({"status": "1"}, {mortgageMarker: {marker: ""}}));
            }
            $scope.select();


        }]).controller('agentCrossTransferDisposeCtrl', ['$scope', 'shiftMark', 'user', '$modal', 'crossTransfer', 'depositCard', 'loanBusiness', 'globalFunction', 'tmsPagination', 'crossTransferStatus', '$log', 'breadcrumb', 'hallName', 'agentsLists', 'topAlert', 'getDate', '$modalInstance',
        function ($scope, shiftMark, user, $modal, crossTransfer, depositCard, loanBusiness, globalFunction, tmsPagination, crossTransferStatus, $log, breadcrumb, hallName, agentsLists, topAlert, getDate, $modalInstance) {
            //點擊飛數進來的頁面
            $scope.user = user;
            //自定義變量
            hallName.query({"hall_type": 2}).$promise.then(function (halls) {
                $scope.halls = halls;
                angular.forEach($scope.halls, function (hall, index) {
                    if (hall.id == user.hall.id) {
                        $scope.halls.splice(index, 1);
                    }
                })
            });

            shiftMark.get().$promise.then(function (shift_mark) {
                $scope.shift_mark = shift_mark;
            });
            $scope.cross_transfer_url = globalFunction.getApiUrl('deposit/crosstransfer');
            $scope.crossTransferStatus = crossTransferStatus;
            $scope.nowDate = getDate(new Date());
            //創建飛數model
            var original;
            var init_cross_transfer = {
                "send_agent_code": "",
                "send_agent_name": "",
                "receive_agent_name": "",
                "receive_agent_code": "",
                "send_hall_id": user.hall.id,
                "send_card_id": "",
                "receive_card_id": "",
                "receive_hall_id": "",
                "amount": "",
                "remark": "",
                "type": "0",
                "pin_code": ""
            };
            original = angular.copy(init_cross_transfer);
            $scope.cross_transfer = angular.copy(init_cross_transfer);
            //監控飛出客戶編號
            $scope.$watch('cross_transfer.send_agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.deposit_send_card = angular.copy(original_send);
                $scope.cross_transfer.send_card_id = '';
                $scope.cross_transfer.send_agent_code = new_value;
                $scope.send_agent = {};
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function (send_agent) {
                        $scope.send_agent = send_agent[0];

                        if ($scope.send_agent) {
                            $scope.cross_transfer.send_agent_name = $scope.send_agent.agent_name;
                            depositCard.query(globalFunction.generateUrlParams({agent_info_id: $scope.send_agent.id}, {})).$promise.then(function (cards) {//hall_id:user.hall.id
                                $scope.cards = cards;

                                _.each($scope.cards, function (card) {
                                    if (card.card_name == 'HKD') {
                                        $scope.cross_transfer.send_card_id = card.id;
                                    }
                                });
                                $scope.select_send_card();
                            });
                            $scope.deposit_send_card = angular.copy(original_send);

                        } else {
                            $scope.send_agent = {};
                            $scope.cards = [];
                            $scope.cross_transfer.send_card_id = '';
                            $scope.deposit_send_card = angular.copy(original_send);
                        }
                    });
                } else {
                    $scope.cards = [];
                    $scope.cross_transfer.send_card_id = '';
                    $scope.deposit_send_card = angular.copy(original_send);
                }
            }));

            //根據飛出不同存卡選擇金額
            var original_send;
            $scope.deposit_send_card = {
                deposit_amount: "",
                frozen_amount: "",
                usable_amount: ""
            };
            original_send = angular.copy($scope.deposit_send_card);
            $scope.select_send_card = function () {
                if ($scope.cross_transfer.send_card_id) {
                    depositCard.get(globalFunction.generateUrlParams({id: $scope.cross_transfer.send_card_id}, {})).$promise.then(function (card) {
                        if (card) {
                            $scope.deposit_send_card.deposit_amount = card.deposit_amount;
                            $scope.deposit_send_card.frozen_amount = card.frozen_amount;
                            $scope.deposit_send_card.usable_amount = card.usable_amount;
                        } else {
                            $scope.deposit_send_card.deposit_amount = "";
                            $scope.deposit_send_card.frozen_amount = "";
                            $scope.deposit_send_card.usable_amount = "";
                        }
                    });
                } else {
                    $scope.deposit_send_card.deposit_amount = "";
                    $scope.deposit_send_card.frozen_amount = "";
                    $scope.deposit_send_card.usable_amount = "";
                }
            }
            //對飛入客戶提供飛入廳的id
            $scope.show_cross = true;
            $scope.select_hall = function () {
                if ($scope.cross_transfer.receive_hall_id) {
                    $scope.show_cross = false;
                    if ($scope.cross_transfer.receive_agent_code) {
                        agentsLists.query(globalFunction.generateUrlParams({agent_code: $scope.receive_agent_code}, {})).$promise.then(function (receive_agent) {
                            depositCard.query(globalFunction.generateUrlParams({
                                agent_info_id: $scope.receive_agent.id,
                                hall_id: $scope.cross_transfer.receive_hall_id,
                                only_current_hall: 0
                            }, {})).$promise.then(function (cards) {
                                    $scope.receive_cards = cards;
                                    _.each($scope.receive_cards, function (card) {
                                        if (card.card_name == 'HKD') {
                                            $scope.cross_transfer.receive_card_id = card.id;
                                        }
                                    });
                                    $scope.select_receive_card();
                                });
                        })
                    }
                } else {
                    $scope.show_cross = true;
                    $scope.cross_transfer.receive_agent_code = '';
                }
            }

            //監控飛入客戶編號
            $scope.$watch('cross_transfer.receive_agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.deposit_receive_card = angular.copy(original_receive);
                $scope.cross_transfer.receive_agent_code = new_value;
                $scope.cross_transfer.receive_card_id = '';
                $scope.receive_agent = {};
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function (receive_agent) {
                        $scope.receive_agent = receive_agent[0];
                        if ($scope.receive_agent) {
                            $scope.cross_transfer.receive_agent_name = $scope.receive_agent.agent_name;
                            depositCard.query(globalFunction.generateUrlParams({
                                agent_info_id: $scope.receive_agent.id,
                                hall_id: $scope.cross_transfer.receive_hall_id,
                                only_current_hall: 0
                            }, {})).$promise.then(function (cards) {
                                    $scope.receive_cards = cards;
                                    _.each($scope.receive_cards, function (card) {
                                        if (card.card_name == 'HKD') {
                                            $scope.cross_transfer.receive_card_id = card.id;
                                        }
                                    });
                                    $scope.select_receive_card();
                                });
                            $scope.deposit_receive_card = angular.copy(original_receive);
                        } else {
                            $scope.receive_agent = {};
                            $scope.receive_cards = [];
                            $scope.deposit_receive_card = angular.copy(original_receive);
                            $scope.cross_transfer.receive_card_id = '';
                        }
                    });
                } else {
                    $scope.receive_cards = [];
                    $scope.deposit_receive_card = angular.copy(original_receive);
                    $scope.cross_transfer.receive_card_id = '';
                }

            }));
            //根據飛入不同存卡選擇金額
            var original_receive;
            $scope.deposit_receive_card = {
                deposit_amount: "",
                frozen_amount: "",
                usable_amount: ""
            };
            original_receive = angular.copy($scope.deposit_receive_card);

            $scope.select_receive_card = function () {
                if ($scope.cross_transfer.receive_card_id) {
                    depositCard.get(globalFunction.generateUrlParams({id: $scope.cross_transfer.receive_card_id}, {})).$promise.then(function (card) {
                        if (card) {
                            $scope.deposit_receive_card.deposit_amount = card.deposit_amount;
                            $scope.deposit_receive_card.frozen_amount = card.frozen_amount;
                            $scope.deposit_receive_card.usable_amount = card.usable_amount;
                        } else {
                            $scope.deposit_receive_card.deposit_amount = "";
                            $scope.deposit_receive_card.frozen_amount = "";
                            $scope.deposit_receive_card.usable_amount = "";
                        }
                    });
                } else {
                    $scope.deposit_receive_card.deposit_amount = "";
                    $scope.deposit_receive_card.frozen_amount = "";
                    $scope.deposit_receive_card.usable_amount = "";
                }
            }

            $scope.disabled_submit = false;
            $scope.add = function () {
                if ($scope.disabled_submit) {
                    return $scope.disabled_submit;
                }
                  _.each($scope.cards,function(card){
                        if($scope.cross_transfer.send_card_id == card.id){
                                $scope.allow_negative_satus = card.allow_negative
                            }
                        });
                if($scope.allow_negative_satus==0 && parseFloat($scope.cross_transfer.amount) > parseFloat($scope.deposit_send_card.usable_amount)){
                    topAlert.warning("飛數金額不能大於飛出可用餘額！");
                    return;
                }
                $scope.form_cross_transfer_create.checkValidity().then(function () {
                    $scope.disabled_submit = true;
                    crossTransfer.save($scope.cross_transfer, function () {
                        topAlert.success("添加成功！");
                        $scope.reset();
                        $modalInstance.close(true);
                        $scope.disabled_submit = false;
                    }, function () {
                        $scope.disabled_submit = false;
                    })
                })
            }
            //數據重置
            $scope.reset = function () {
                $scope.form_cross_transfer_create.clearErrors()
                $scope.cross_transfer = angular.copy(original);
                $scope.send_agent_code = '';
                $scope.receive_agent_code = '';
                $scope.deposit_receive_card = angular.copy(original_receive);
                $scope.deposit_send_card = angular.copy(original_send);
            }

        }]).controller('agentCrossTransferRequestCtrl', ['$scope', 'shiftMark', 'user', '$modal', 'crossTransfer', 'depositCard', 'loanBusiness', 'globalFunction', 'tmsPagination', 'crossTransferStatus', '$log', 'breadcrumb', 'hallName', 'agentsLists', 'topAlert', 'getDate', '$modalInstance',
        function ($scope, shiftMark, user, $modal, crossTransfer, depositCard, loanBusiness, globalFunction, tmsPagination, crossTransferStatus, $log, breadcrumb, hallName, agentsLists, topAlert, getDate, $modalInstance) {
            //點擊 請求飛數 進來的頁面
            $scope.user = user;
            //自定義變量
            hallName.query({"hall_type": 2}).$promise.then(function (halls) {
                $scope.halls = halls;
                angular.forEach($scope.halls, function (hall, index) {
                    if (hall.id == user.hall.id) {
                        $scope.halls.splice(index, 1);
                    }
                })
            });

            shiftMark.get().$promise.then(function (shift_mark) {
                $scope.shift_mark = shift_mark;
            });
            $scope.cross_transfer_url = globalFunction.getApiUrl('deposit/crosstransfer');
            $scope.crossTransferStatus = crossTransferStatus;
            $scope.nowDate = getDate(new Date());
            //創建飛數model
            var original;
            var init_cross_transfer = {
                "send_agent_code": "",
                "send_agent_name": "",
                "receive_agent_name": "",
                "receive_agent_code": "",
                "send_card_id": "",
                "send_hall_id": "",
                "receive_card_id": "",
                "receive_hall_id": user.hall.id,
                "amount": "",
                "remark": "",
                "type": "1",
                "pin_code": ""
            };
            original = angular.copy(init_cross_transfer);
            $scope.cross_transfer = angular.copy(init_cross_transfer);
            //監控飛出客戶編號
            $scope.$watch('cross_transfer.send_agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.deposit_send_card = angular.copy(original_send);
                $scope.cross_transfer.send_card_id = '';
                $scope.cross_transfer.send_agent_code = new_value;
                $scope.send_agent = {};
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function (send_agent) {
                        $scope.send_agent = send_agent[0];

                        if ($scope.send_agent) {
                            $scope.cross_transfer.send_agent_name = $scope.send_agent.agent_name;
                            depositCard.query(globalFunction.generateUrlParams({
                                agent_info_id: $scope.send_agent.id,
                                hall_id: $scope.cross_transfer.send_hall_id,
                                only_current_hall: 0
                            }, {})).$promise.then(function (cards) {//hall_id:user.hall.id
                                    $scope.cards = cards;

                                    _.each($scope.cards, function (card) {
                                        if (card.card_name == 'HKD') {
                                            $scope.cross_transfer.send_card_id = card.id;
                                        }
                                    });
                                    $scope.select_send_card();
                                });
                            $scope.deposit_send_card = angular.copy(original_send);

                        } else {
                            $scope.send_agent = {};
                            $scope.cards = [];
                            $scope.cross_transfer.send_card_id = '';
                            $scope.deposit_send_card = angular.copy(original_send);
                        }
                    });
                } else {
                    $scope.cards = [];
                    $scope.cross_transfer.send_card_id = '';
                    $scope.deposit_send_card = angular.copy(original_send);
                }
            }));

            //根據飛出不同存卡選擇金額
            var original_send;
            $scope.deposit_send_card = {
                deposit_amount: "",
                frozen_amount: "",
                usable_amount: ""
            };
            original_send = angular.copy($scope.deposit_send_card);
            $scope.select_send_card = function () {
                if ($scope.cross_transfer.send_card_id) {
                    depositCard.get(globalFunction.generateUrlParams({id: $scope.cross_transfer.send_card_id}, {})).$promise.then(function (card) {
                        if (card) {
                            $scope.deposit_send_card.deposit_amount = card.deposit_amount;
                            $scope.deposit_send_card.frozen_amount = card.frozen_amount;
                            $scope.deposit_send_card.usable_amount = card.usable_amount;
                        } else {
                            $scope.deposit_send_card.deposit_amount = "";
                            $scope.deposit_send_card.frozen_amount = "";
                            $scope.deposit_send_card.usable_amount = "";
                        }
                    });
                } else {
                    $scope.deposit_send_card.deposit_amount = "";
                    $scope.deposit_send_card.frozen_amount = "";
                    $scope.deposit_send_card.usable_amount = "";
                }
            }
            //對飛出客戶提供飛入廳的id
            $scope.show_cross = true;
            $scope.select_hall = function () {
                if ($scope.cross_transfer.send_hall_id) {
                    $scope.show_cross = false;
                    if ($scope.cross_transfer.send_agent_code) {
                        agentsLists.query(globalFunction.generateUrlParams({agent_code: $scope.send_agent_code}, {})).$promise.then(function (send_agent) {
                            depositCard.query(globalFunction.generateUrlParams({
                                agent_info_id: $scope.send_agent.id,
                                hall_id: $scope.cross_transfer.send_hall_id,
                                only_current_hall: 0
                            }, {})).$promise.then(function (cards) {
                                    $scope.cards = cards;
                                    _.each($scope.cards, function (card) {
                                        if (card.card_name == 'HKD') {
                                            $scope.cross_transfer.send_card_id = card.id;
                                        }
                                    });
                                    $scope.select_send_card();
                                });
                        })
                    }
                } else {
                    $scope.show_cross = true;
                    $scope.cross_transfer.send_agent_code = '';
                }
            }

            //監控飛入客戶編號
            $scope.$watch('cross_transfer.receive_agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.deposit_receive_card = angular.copy(original_receive);
                $scope.cross_transfer.receive_agent_code = new_value;
                $scope.cross_transfer.receive_card_id = '';
                $scope.receive_agent = {};
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function (receive_agent) {
                        $scope.receive_agent = receive_agent[0];
                        if ($scope.receive_agent) {
                            $scope.cross_transfer.receive_agent_name = $scope.receive_agent.agent_name;
                            depositCard.query(globalFunction.generateUrlParams({agent_info_id: $scope.receive_agent.id}, {})).$promise.then(function (cards) {//hall_id: $scope.cross_transfer.receive_hall_id,only_current_hall:0
                                $scope.receive_cards = cards;
                                _.each($scope.receive_cards, function (card) {
                                    if (card.card_name == 'HKD') {
                                        $scope.cross_transfer.receive_card_id = card.id;
                                    }
                                });
                                $scope.select_receive_card();
                            });
                            $scope.deposit_receive_card = angular.copy(original_receive);
                        } else {
                            $scope.receive_agent = {};
                            $scope.receive_cards = [];
                            $scope.deposit_receive_card = angular.copy(original_receive);
                            $scope.cross_transfer.receive_card_id = '';
                        }
                    });
                } else {
                    $scope.receive_cards = [];
                    $scope.deposit_receive_card = angular.copy(original_receive);
                    $scope.cross_transfer.receive_card_id = '';
                }

            }));
            //根據飛入不同存卡選擇金額
            var original_receive;
            $scope.deposit_receive_card = {
                deposit_amount: "",
                frozen_amount: "",
                usable_amount: ""
            };
            original_receive = angular.copy($scope.deposit_receive_card);

            $scope.select_receive_card = function () {
                if ($scope.cross_transfer.receive_card_id) {
                    depositCard.get(globalFunction.generateUrlParams({id: $scope.cross_transfer.receive_card_id}, {})).$promise.then(function (card) {
                        if (card) {
                            $scope.deposit_receive_card.deposit_amount = card.deposit_amount;
                            $scope.deposit_receive_card.frozen_amount = card.frozen_amount;
                            $scope.deposit_receive_card.usable_amount = card.usable_amount;
                        } else {
                            $scope.deposit_receive_card.deposit_amount = "";
                            $scope.deposit_receive_card.frozen_amount = "";
                            $scope.deposit_receive_card.usable_amount = "";
                        }
                    });
                } else {
                    $scope.deposit_receive_card.deposit_amount = "";
                    $scope.deposit_receive_card.frozen_amount = "";
                    $scope.deposit_receive_card.usable_amount = "";
                }
            }
            $scope.disabled_submit = false;
            $scope.add = function () {
                if ($scope.disabled_submit) {
                    return $scope.disabled_submit;
                }
                 _.each($scope.cards,function(card){
                    console.log($scope.cross_transfer.send_card_id);
                        if($scope.cross_transfer.send_card_id == card.id){
                                $scope.allow_negative_status = card.allow_negative
                            }
                        });
                //a
                if($scope.allow_negative_status==0 && parseFloat($scope.cross_transfer.amount) > parseFloat($scope.deposit_send_card.usable_amount)){
                    topAlert.warning("飛數金額不能大於飛出可用餘額！");
                    return;
                }
                $scope.form_cross_transfer_create.checkValidity().then(function () {
                    $scope.disabled_submit = true;
                    crossTransfer.save($scope.cross_transfer, function () {
                        topAlert.success("添加成功！");
                        $scope.reset();
                        $modalInstance.close(true);
                        $scope.disabled_submit = false;
                    }, function () {
                        $scope.disabled_submit = false;
                    })
                })
            }
            //數據重置
            $scope.reset = function () {
                $scope.form_cross_transfer_create.clearErrors()
                $scope.cross_transfer = angular.copy(original);
                $scope.send_agent_code = '';
                $scope.receive_agent_code = '';
                $scope.deposit_receive_card = angular.copy(original_receive);
                $scope.deposit_send_card = angular.copy(original_send);
            }


        }]).controller('agentCrossTransferAuthorizationCtrl', ['$scope', '$modalInstance', 'cross_transfer', 'agentsLists', 'num', function ($scope, $modalInstance, cross_transfer, agentsLists, num) {
        $scope.phone_numbers = [];
        $scope.cross_transfer = cross_transfer;

        agentsLists.query().$promise.then(function (agents) {
            var selected_agent = _.findWhere(agents, {"agent_code": cross_transfer.receive_agent_code});
            if (!angular.isUndefined(selected_agent)) {
                $scope.phone_numbers = selected_agent.phone_numbers;
            }
        });
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
            $modalInstance.close(false);
        }
        $scope.remove = function () {
            $modalInstance.close(true);
        }


    }]).controller('agentCrossTransferDetailCtrl', ['$scope','$modal', 'qzPrinter', 'globalFunction', 'agentsLists', 'crossTransfer', '$modalInstance', 'topAlert', 'refagentcontacttypes', 'cross_transfer', 'crossTransferTypes', 'mortgageRecords', 'printerType',
        function ($scope, $modal, qzPrinter, globalFunction, agentsLists, crossTransfer, $modalInstance, topAlert, refagentcontacttypes, cross_transfer, crossTransferTypes, mortgageRecords, printerType) {
            //顯示title
            $scope.handle = {
                "cross_transfer_id": "",
                "cross_transfer_type": "2",
                "send_remark": cross_transfer.remark,
                "receive_remark": cross_transfer.remark,
                "receive_contact_id": "",
                "type": cross_transfer.type,
                "marker_agent_code": cross_transfer.type == '2' ? cross_transfer.mortgageMarker.marker.agent_code : "",
                "marker_agent_name": cross_transfer.type == '2' ? cross_transfer.mortgageMarker.marker.agent_name : "",
                "marker_hall_name": cross_transfer.type == '2' ? cross_transfer.mortgageMarker.marker.hall_name : "",
                "pin_code": ""
            }
            $scope.crossTransferTypes = crossTransferTypes;
            $scope.cross_transfer = cross_transfer;
            $scope.ticket_url = globalFunction.getApiUrl('deposit/crosstransfer/handle');

            $scope.names = [];
            if (cross_transfer) {
                $scope.handle.cross_transfer_id = cross_transfer.id;
//                if(cross_transfer.type==0){
//                    $scope.names.push({id:cross_transfer.receive_agent_name,receive_user_name:cross_transfer.receive_agent_name});
//                    $scope.handle.receive_user_name =  cross_transfer.receive_agent_name;
//                }else{
//                    $scope.names.push({id:cross_transfer.send_agent_name,receive_user_name:cross_transfer.send_agent_name});
//                    $scope.handle.receive_user_name =  cross_transfer.send_agent_name;
//                }
            }

            refagentcontacttypes.query(globalFunction.generateUrlParams({agent_info_id: cross_transfer.type == 0 ? cross_transfer.receive_agent_id : cross_transfer.send_agent_id}, {})).$promise.then(function (refagentcontacttypes) {
                _.each(refagentcontacttypes, function (refagentcontacttype) {
                    $scope.names.push({
                        id: refagentcontacttype.agent_contact_id,
                        receive_user_name: refagentcontacttype.agent_contact_name
                    });
                    if (cross_transfer.type == 0) {
                        if (cross_transfer.receive_agent_name == refagentcontacttype.agent_contact_name)
                            $scope.handle.receive_contact_id = refagentcontacttype.agent_contact_id;
                    } else {
                        if (cross_transfer.send_agent_name == refagentcontacttype.agent_contact_name)
                            $scope.handle.receive_contact_id = refagentcontacttype.agent_contact_id;
                    }
                })
            });
//            agentsLists.agentAssistantList({agent_info_id: cross_transfer.type==0?cross_transfer.receive_agent_id:cross_transfer.send_agent_id}).$promise.then(function(agentsLists){
//                _.each(agentsLists,function(agent){
//                    $scope.names.push({id:agent.id,receive_user_name:agent.agent_contact_name});
//                })
//            });


            //接受飛數
            $scope.disabled_submit = false;
            $scope.add = function () {
                if ($scope.disabled_submit) {
                    return $scope.disabled_submit;
                }
                if ($scope.handle.cross_transfer_id) {
                    $scope.disabled_submit = true;
                    $scope.form_cross_transfer_detail.checkValidity().then(function () {
                        crossTransfer.handle($scope.handle, function (data) {
                            $scope.disabled_submit = true;
//                        topAlert.success("成功接受飛數！");
                            if (cross_transfer['type'] == 2) {
                                $scope.mortgage = {
                                    "remark": cross_transfer.remark,
                                    "pin_code": $scope.handle.pin_code,
                                    "hall_id": cross_transfer.send_hall_id,
                                    "is_cf": "1",
                                    "sms_remark": "抵押回M," + cross_transfer.mortgageMarker.marker.agent_code + ',' + cross_transfer.mortgageMarker.marker.agent_name + ',' + cross_transfer.mortgageMarker.marker.hall_name + ',' + cross_transfer.mortgageMarker.marker.marker_seqnumber + ',' + $scope.handle.receive_remark,
                                    "refs": [
                                        {
                                            "ref_mortgage_marker_id": cross_transfer.ref_mortgage_marker_id,
                                            "amount": cross_transfer.amount
                                        }
                                    ]
                                }
                                $scope.ticket_url = globalFunction.getApiUrl('mortgage/mortgage/cross-transfer-return-m');
                                mortgageRecords.crossTransferReturnM($scope.mortgage).$promise.then(function (data) {
                                    if (data && data.message == '1016') {
                                        topAlert.warning("無法查詢外館簽額（網絡或rollex服務問題）");
                                    }
                                    topAlert.success('接受飛數抵押回M成功');
//                                $scope.marker = "抵押回M," + cross_transfer.send_agent_code + cross_transfer.send_agent_name + cross_transfer.receive_hall_name + cross_transfer.mortgageMarker.marker.marker_seqnumber+$scope.handle.receive_remark;
                                    if (cross_transfer.amount != cross_transfer.mortgageMarker.marker.settlement_amount) {
                                        qzPrinter.print('PDFLoanReceipt', printerType.stylusPrinter, {'loan_id': cross_transfer.mortgageMarker.marker.loan_id}).then(function () {
                                            topAlert.success('貸款列印成功');
                                            $scope.disabled_submit = false;
                                        }, function (msg) {
                                            $scope.disabled_submit = false;
                                        })
                                    }
                                    $modalInstance.close(true);
                                    $scope.disabled_submit = false;
                                }, function () {
                                    $scope.disabled_submit = false;
                                    crossTransfer.update({id: cross_transfer.id, type: '2'}).$promise.then(function () {
                                        topAlert.warning('抵押回M處理失敗');
                                    })
                                });
                            } else {
                                topAlert.success("成功接受飛數！");
                                $scope.disabled_submit = false;
                                $scope.SMSsend(data);
                                $modalInstance.close(true);

                            }

                        }, function () {
                            $scope.disabled_submit = false
                        });
                    });

                }
            }
            //拒絕飛數
            $scope.refuse = function () {
                if ($scope.disabled_submit) {
                    return $scope.disabled_submit;
                }
                $scope.handle.cross_transfer_type = '3';
                if ($scope.handle.cross_transfer_id) {
                    $scope.disabled_submit = true;
                    crossTransfer.handle($scope.handle, function () {
                        topAlert.success("成功拒絕飛數！");
                        $modalInstance.close(true);
                        $scope.disabled_submit = false;
                    }, function () {
                        $scope.disabled_submit = false
                    });
                }
            }
            //接收飛數發送短信
            $scope.SMSsend = function (data) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/cross-transfer/cross-transfer-confirm.html",
                    controller: 'crossTransferConfirmCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        }
                    }
                });
                modalInstance.result.then((function (status) {

                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }

        }]).controller('crossTransferConfirmCtrl', ['$scope', '$modalInstance', '$modal','crossTransfer', 'data', 'depositCard', 'topAlert', function ($scope, $modalInstance, $modal,crossTransfer, data, depositCard, topAlert) {

        $scope.isReadonly = true;
        $scope.sms = {
            agent_code: data.sendRecord.agent_code,
            agent_name: data.sendRecord.agent_name,
            content: data.sendContent,
            phoneNumber: data.sendPhoneNumbers
        }

        $scope.send_sms = {
            pin_code: "",
            id:data.crossTransfer.id,
            agent_contact_name:data.sendRecord.agent_contact_name,
            content: '',
            sendPhoneNumbers: data.sendPhoneNumbers,//電話號碼傳給後台
            transaction_type: data.sendRecord.transaction_type//選擇的類型
        }

        //定義一個變量，監控是否修改短信內容
        $scope.sms_content = $scope.sms.content;//初始化
        $scope.$watch("sms.content", function (new_value) {
            if (new_value) {
                window['textAreaValue']=''; //storm.xu
                $scope.sms_content = $scope.sms.content;
            }
            $scope.send_sms.content = $scope.sms_content;
        })
        $scope.edit = function () {
            $scope.isReadonly = false;
        };

        $scope.sendSms = function () {
            if(window['textAreaValue']){   //storm.xu
                $scope.send_sms.content = window['textAreaValue'];  //storm.xu
            }

            $scope.form_transfer_sms.checkValidity().then(function () {
                crossTransfer.sendDepositCardSms($scope.send_sms, function () {
                    topAlert.success("短信發送成功！");
                    $scope.disabled_submit = false;
                    $modalInstance.close();
                    window['textAreaValue']=''; //storm.xu
                    $scope.receiveSMSsend(data)
                }, function () {
                    $scope.disabled_submit = false;
                });
            });
        }

        //接收短信
        $scope.receiveSMSsend = function (data) {
            var modalInstance;
            modalInstance = $modal.open({
                templateUrl: "views/cross-transfer/cross-transfer-confirm-receive.html",
                controller: 'receiveCrossTransferConfirmCtrl',
                resolve: {
                    data: function () {
                        return data ? data : "";
                    }
                }
            });
        }

        $scope.close = function () {
            $modalInstance.dismiss();
            $scope.receiveSMSsend(data);
        }


    }]).controller('receiveCrossTransferConfirmCtrl', ['$scope', '$modalInstance', '$modal','crossTransfer', 'data', 'depositCard', 'topAlert', function ($scope, $modalInstance, $modal,crossTransfer, data, depositCard, topAlert) {

        $scope.isReadonly = true;
        $scope.sms = {
            agent_code: data.receiveCardRecord.agent_code,
            agent_name: data.receiveCardRecord.agent_contact_name,
            content: data.receiveContent,
            phoneNumber: data.receivePhoneNumbers
        }

        $scope.send_sms = {
            pin_code: "",
            id:data.crossTransfer.id,
            agent_contact_name:data.sendRecord.agent_contact_name,
            content: '',
            sendPhoneNumbers: data.receivePhoneNumbers,//電話號碼傳給後台
            transaction_type: data.receiveCardRecord.transaction_type//選擇的類型
        }

        //定義一個變量，監控是否修改短信內容
        $scope.sms_content = $scope.sms.content;//初始化
        $scope.$watch("sms.content", function (new_value) {
            if (new_value) {
                window['textAreaValue']=''; //storm.xu
                $scope.sms_content = $scope.sms.content;
            }
            $scope.send_sms.content = $scope.sms_content;
        })
        $scope.edit = function () {
            $scope.isReadonly = false;
        };

        $scope.sendSms = function () {
            if(window['textAreaValue']){   //storm.xu
                $scope.send_sms.content = window['textAreaValue'];  //storm.xu
            }

            $scope.form_transfer_sms.checkValidity().then(function () {
                crossTransfer.sendDepositCardSms($scope.send_sms, function () {
                    topAlert.success("短信發送成功！");
                    $scope.disabled_submit = false;
                    $modalInstance.close();
                    window['textAreaValue']=''; //storm.xu
                }, function () {
                    $scope.disabled_submit = false;
                });
            });
        }

        $scope.close = function () {
            $modalInstance.dismiss();
        }

    }]).controller('crossTransferRecordCtrls', ['$scope', '$modal', 'page', 'search', 'breadcrumb', 'crossTrans', 'hall', function ($scope, $modal, page, search, breadcrumb, crossTrans, hall) {
        breadcrumb.items = [
            {"name": "飛數記錄"}
        ];
        hall.query().$promise.then(function (halls) {
            $scope.halls = _.pluck(halls, 'hall_name');
        });
        $scope.all_cross_transfers = crossTrans;
        $scope.cross_transfers = page.select(1, crossTrans);
        var original;
        $scope.condition = {};
        original = angular.copy($scope.condition);
        var search_config = [
            {field_name: 'send_hall'},
            {field_name: 'receive_agent_code'},
            {field_name: 'status'},
            {field_name: 'created', comparison_type: '>=', condition_name: 'created_start_time', data_type: 'date'},
            {field_name: 'created', comparison_type: '<=', condition_name: 'created_end_time', data_type: 'date'}
        ];
        $scope.search = function () {
            $scope.all_cross_transfers = search(crossTrans, search_config, $scope.condition);
            $scope.cross_transfers = page.select(1, $scope.all_cross_transfers);
        }
        $scope.reset = function () {
            $scope.condition = angular.copy(original);
            $scope.form_search.$setPristine();
        }
        $scope.detail = function (index) {
            $scope.cross_title = "ss";

            var modalInstance;
            modalInstance = $modal.open({
                templateUrl: "views/cross-transfer/cross-transfer-detail.html",
                controller: 'agentCrossTransferDetailCtrl',
                resolve: {
                    cross_transfers: function () {
                        return $scope.cross_transfers;
                    },
                    num: function () {
                        return index;
                    },
                    detail: function () {
                        return false;
                    },
                    title: function () {
                        return '飛數詳細';
                    }
                }
            });
        }


    }]);

}).call(this);
