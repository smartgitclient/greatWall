(function () {
    'use strict';
    angular.module('app.loan.ctrls', ['app.loan.services']).controller('loanListCtrl', ['$scope', '$filter', 'tmsPagination', 'globalFunction', '$modal', '$location', 'breadcrumb'/*,'loanBusiness'*/, 'getDate', 'markerStatus', 'hallName', 'agentsLists', 'marker', 'goBackData', 'user',
        function ($scope, $filter, tmsPagination, globalFunction, $modal, $location, breadcrumb/*,loanBusiness*/, getDate, markerStatus, hallName, agentsLists, marker, goBackData, user) {
            breadcrumb.items = [
                {"name": "貸款列表", "active": true}
            ];

            $scope.markerStatus = markerStatus.items;
            //聽會
            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function (hall) {
                return hall.hall_type != 1;
            });
            $scope.select_status = false;

            var init_condition = {
                halls: [],
                marker_seqnumber: "",
                settlement_amount: "|0",
                agentGroup: {
                    agent_group_name: ""
                },
                loanBusiness: {
                    agent_code: "",
                    remark:'',//增加备注
                    loan_time: ["", ""],
                    shiftMark: {
                        year_month: "",
                        shift_date: ""
                    }
                },
                page: 1,
                sort: "loanBusiness.agent_code NUMASC,loanBusiness.loan_time DESC"
            };
            $scope.condition = angular.copy(init_condition);
            $scope.excel_condition = angular.copy(init_condition);
            $scope.condition = goBackData.get('condition', $scope.condition);

            //初始化列表數據
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = marker;
            $scope.select = function (page) {

                $scope.condition.page = page;
                $scope.condition.page = $scope.condition.page ? $scope.condition.page : 1;
//                 goBackData.set('condition',$scope.condition);

                $scope.items_per_page = goBackData.get('items_per_page', $scope.pagination.items_per_page);
                goBackData.set('items_per_page', $scope.items_per_page);
                $scope.pagination.items_per_page = $scope.items_per_page;

                $scope.condition_copy = angular.copy($scope.condition);

                if (user.isAllHall()) {
                    /*var halls_arr = "";
                     _.each($scope.condition_copy.hall_ids,function(ele,index,list){
                     halls_arr += (ele + ",");
                     });
                     $scope.condition_copy.hall_ids = halls_arr.substring(0,halls_arr.length - 1);*/
                    $scope.select_halls = [];
                    _.each($scope.condition_copy.halls, function ($that, $key) {
                        var obj = {
                            id: $that,
                            name: (_.findWhere($scope.halls, {id: $that})).hall_name
                        };
                        $scope.select_halls[$key] = obj;
                    })
                    $scope.condition_copy.halls = $scope.condition_copy.halls.join(',');
                } else {
                    $scope.select_halls = [{id: user.hall.id, name: user.hall.hall_name}];
                    $scope.condition_copy.halls = user.hall.id;
                }

                if ($scope.condition_copy.loanBusiness.loan_time[0]) {
                    $scope.condition_copy.loanBusiness.loan_time[0] = getDate($scope.condition.loanBusiness.loan_time[0]);
                }
                if ($scope.condition_copy.loanBusiness.loan_time[1]) {
                    $scope.condition_copy.loanBusiness.loan_time[1] = getDate($scope.condition.loanBusiness.loan_time[1]);
                }
                if ($scope.condition_copy.loanBusiness.shiftMark.shift_date) {
                    $scope.condition_copy.loanBusiness.shiftMark.shift_date = getDate($scope.condition_copy.loanBusiness.shiftMark.shift_date);
                }
                if ($scope.condition_copy.loanBusiness.shiftMark.year_month) {
                    $scope.condition_copy.loanBusiness.shiftMark.year_month = $filter('date')($scope.condition_copy.loanBusiness.shiftMark.year_month, 'yyyy-MM-01');
                }
                $scope.excel_condition = angular.copy($scope.condition_copy);
                if ($scope.excel_condition.loanBusiness.shiftMark.year_month) {
                    $scope.excel_condition.loanBusiness.shiftMark.year_month = $scope.excel_condition.loanBusiness.shiftMark.year_month.substring(0, 7);
                }
                if ($scope.condition_copy.marker_seqnumber) {
                    $scope.condition_copy.marker_seqnumber = $scope.condition_copy.marker_seqnumber + '!';
                }
                var remark=angular.copy($scope.condition_copy.loanBusiness.remark);
                if ($scope.condition_copy.loanBusiness.remark) {
                    $scope.condition_copy.loanBusiness.remark = '!'+$scope.condition_copy.loanBusiness.remark + '!';
                }
                $scope.excel_condition.halls = $scope.select_halls;
                $scope.excel_condition.remark = remark;
                $scope.pagination.items_per_page = $scope.items_per_page;
                $scope.pagination.init($scope.condition_copy.page);
                $scope.pagination.select($scope.condition_copy.page, globalFunction.generateUrlParams($scope.condition_copy, {
                    markerTerms: {},
                    refMortgageMarker: {}
                })).$promise.then(function (loans) {
                        $scope.loans = loans;
                        if ($scope.loans.length == 1 && $scope.condition_copy.marker_seqnumber) {
                            $scope.condition = angular.copy(init_condition);
                            $scope.detail($scope.loans[0].loan_business_id);
                        }
                        goBackData.set('condition', $scope.condition);
                    });
                $scope.loans_total = marker.markerTotal(globalFunction.generateUrlParams($scope.condition_copy, {}));

            }
            $scope.select($scope.condition.page);

            $scope.search = function (page) {
                goBackData.set('items_per_page', $scope.pagination.items_per_page);
                $scope.select(page);
            }

            //戶口查詢名稱
            $scope.$watch('condition.loanBusiness.agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.agent_name = "";
                if (new_value) {
                    agentsLists.query({agent_code: new_value}).$promise.then(function (agents) {
                        if (agents[0])
                            $scope.agent_name = agents[0].agent_name;
                    });
                }
            }));

            //全選
            $scope.select_all = function () {
                $scope.condition.halls = [];
                if (!$scope.select_status) {
                    _.each($scope.halls, function (hall) {
                        $scope.condition.halls.push(hall.id);
                    })
                }
            };

            //格式化抵押金額
            $scope.mortgage_format = function (loan) {//settlement_marker_amount,refMortgageMarker,markerTerms*/
                var markerTerms = loan.markerTerms;

                //判斷戶口類型、線頭類型、主線頭類型
                var len = markerTerms.length;
                if (len == 0) {
                    loan.funds_type_remark = '工作碼';
                    loan.group_funds_type_remark = '工作碼';
                    loan.main_group_funds_type_remark = '工作碼';
                    loan.interest_type = '工作碼';
                }
                for (var i = 1; i <= len; i++) {
                    var terms_data = _.findWhere(markerTerms, {layer: i.toString()});
                    if (terms_data) {
                        if (len == 1) { //戶口類型（下線/貸款戶口）
                            loan.main_group_funds_type_remark = loan.funds_type_remark = terms_data.funds_type_remark;
                            //loan.main_group_funds_type_remark = loan.funds_type;//loan.group_funds_type_remark = "";
                            loan.interest_type = terms_data.interest_type;
                        }

                        if (len == 2) { //線頭類型（內股）
                            if (i == 1)
                                loan.funds_type_remark = terms_data.funds_type_remark;
                            else if (loan.agent_type == 2)//内股
                                loan.group_funds_type_remark = loan.funds_type_remark;
                            else
                                loan.group_funds_type_remark = loan.parent_id ? terms_data.funds_type_remark : "";
                            loan.main_group_funds_type_remark = terms_data.funds_type_remark;
                            loan.interest_type = terms_data.interest_type;
                        }

                        if (len == 3) { //主線頭類型（上線）
                            if (i == 1)
                                loan.funds_type_remark = terms_data.funds_type_remark;
                            else if (i == 2)
                                loan.group_funds_type_remark = terms_data.funds_type_remark;
                            else
                                loan.main_group_funds_type_remark = terms_data.funds_type_remark;
                            loan.interest_type = terms_data.interest_type;
                        }

                        if (len == 4) {
                            if (i == 1)
                                loan.funds_type_remark = terms_data.funds_type_remark;
                            else if (i == 3)
                                loan.group_funds_type_remark = terms_data.funds_type_remark;
                            else if (i == 4)
                                loan.main_group_funds_type_remark = terms_data.funds_type_remark;
                            loan.interest_type = terms_data.interest_type;
                        }
                    }
                }

                //貸款*号顯示
                /*var settlement_marker_amount = loan.settlement_amount;
                 var refMortgageMarker = loan.refMortgageMarker;
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

            $scope.reset = function () {
                $scope.agent_name = "";
                $scope.condition = angular.copy(init_condition);
                //$scope.form_search.$setPristine();
                $scope.select(1);
            }

            //loan detail
            $scope.detail = function (loan_id) {
                $location.path('/loan/detail/' + loan_id);
            }
            $scope.recalculation = function () {
                $location.path('loan/loan-recalculate');
            }

            $scope.goRepyamentFee = function () {
                $location.path('loan/overdue-charge');
            }
        }

    ]).controller('loanStreamListCtrl', ['$scope', 'breadcrumb', 'getDate', '$filter', 'globalFunction', 'tmsPagination', 'markerRepayment', 'fundSourceTypes', 'transTypes', 'hallName', 'agentsLists', 'fundsTypes', '$location', 'repaymentMethod', 'user',
        function ($scope, breadcrumb, getDate, $filter, globalFunction, tmsPagination, markerRepayment, fundSourceTypes, transTypes, hallName, agentsLists, fundsTypes, $location, repaymentMethod, user) {
            breadcrumb.items = [
                {"name": "貸款流水", "active": true}
            ];

            $scope.repaymentMethod = repaymentMethod.items;
            //聽會
            $scope.halls = hallName.query({hall_type: "|1"});

            fundsTypes.query({type: '2'}).$promise.then(function (_fundsTypes) {
                _fundsTypes.push({"funds_type": "工作碼"});
                $scope.fundsTypes = _fundsTypes;
            });
            $scope.transTypes = transTypes;

            //全选状态
            $scope.select_status = false;

            //全選
            $scope.select_all = function () {
                $scope.condition.halls = [];
                if (!$scope.select_status) {
                    _.each($scope.halls, function (hall) {
                        $scope.condition.halls.push(hall.id);
                    })
                }
            };

            var init_condition = {
                halls: [],
                agent_code: '',
                agentGroup: {agent_group_name: ""},
                marker_seqnumber: '',
                trans_type: "", //交易類型
                funds_type: "",  //貸款類型
                remark:'',//增加备注
                shiftMark: {
                    year_month: "",
                    shift_date: ["", ""],
                    only_shift_date: "",
                    shift: ""
                },
                sort: "repayment_time DESC"//,create_time DESC

            };
            $scope.condition = angular.copy(init_condition);
            $scope.excel_condition = angular.copy(init_condition);

            //初始化列表數據
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = markerRepayment;
            //$scope.pagination.query_method = "loanMarkerRepayment";
            $scope.loan_streams = [];
            $scope.select = function (page) {
                $scope.pagination.select(page, globalFunction.generateUrlParams($scope.params, {marker: {}})).$promise.then(function (data) {
                    //if_empty_interest_type(data);
                    $scope.loan_streams = data;
                });

            };
            //$scope.select();

            //根據條件查詢方法
            $scope.search = function () {
                $scope.condition_copy = angular.copy($scope.condition);

                if (user.isAllHall()) {
                    $scope.select_halls = [];
                    _.each($scope.condition_copy.halls, function ($that, $key) {
                        var obj = {
                            id: $that,
                            name: (_.findWhere($scope.halls, {id: $that})).hall_name
                        };
                        $scope.select_halls[$key] = obj;
                    })
                    $scope.condition_copy.halls = $scope.condition_copy.halls.join(',');
                } else {
                    $scope.select_halls = [{id: user.hall.id, name: user.hall.hall_name}];
                    $scope.condition_copy.halls = user.hall.id;
                }

                if ($scope.condition_copy.marker_seqnumber) {
                    $scope.condition_copy.marker_seqnumber = '!' + $scope.condition_copy.marker_seqnumber + '!';
                }
                var remark=angular.copy($scope.condition_copy.remark);
                if ($scope.condition_copy.remark) {
                    $scope.condition_copy.remark ='!'+ $scope.condition_copy.remark + '!';
                }
                $scope.params = {
                    halls: $scope.condition_copy.halls,
                    agentGroup: {
                        agent_group_name: $scope.condition_copy.agentGroup.agent_group_name ? $scope.condition_copy.agentGroup.agent_group_name : ""
                    },
                    agent_code: $scope.condition_copy.agent_code,
                    marker_seqnumber: $scope.condition_copy.marker_seqnumber,
                    trans_type: $scope.condition_copy.trans_type, //交易類型
                    funds_type: $scope.condition_copy.funds_type,  //貸款類型
                    remark:$scope.condition_copy.remark,//增加备注
                    shiftMark: {
                        "year_month": $scope.condition_copy.shiftMark.year_month ? $filter('date')($scope.condition_copy.shiftMark.year_month, 'yyyy-MM-01') : "",
                        "shift_date-min": $scope.condition_copy.shiftMark.shift_date[0] ? getDate($scope.condition_copy.shiftMark.shift_date[0]) : "",
                        "shift_date-max": $scope.condition_copy.shiftMark.shift_date[1] ? getDate($scope.condition_copy.shiftMark.shift_date[1]) : "",
                        "shift_date": $scope.condition_copy.shiftMark.only_shift_date ? $filter('date')($scope.condition_copy.shiftMark.only_shift_date, 'yyyy-MM-dd') : "",
                        "shift": $scope.condition_copy.shiftMark.shift ? $scope.condition_copy.shiftMark.shift : ""
                    },
                    sort: $scope.condition_copy.sort//,create_time DESC
                }
                $scope.excel_condition = angular.copy($scope.params);
                $scope.excel_condition.remark=remark;
                if ($scope.condition_copy.shiftMark.year_month) {
                    $scope.excel_condition.shiftMark.year_month = $filter('date')($scope.condition_copy.shiftMark.year_month, 'yyyy-MM');
                }
                $scope.excel_condition.halls = $scope.select_halls;

                delete $scope.params.only_shift_date;
                delete $scope.excel_condition.only_shift_date;

                $scope.pagination.select(1, globalFunction.generateUrlParams($scope.params, {marker: {}})).$promise.then(function (data) {
                    //if_empty_interest_type(data);
                    $scope.loan_streams = data;
                });
            };

            // 如果贷款类型为空 则默认为升红
            /*var if_empty_interest_type = function(list){
             for(var i = 0 ; i < list.length ; i ++){
             if(!list[i].interest_type){
             list[i].interest_type = list[i].agent_fund_remark = list[i].group_fund_remark = list[i].top_group_fund_remark = '升紅';
             //list[i].interest_type  = '升紅';
             }
             }
             };*/

            $scope.search();

            //戶口查詢名稱
            $scope.$watch('condition.agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.agent_name = "";
                if (new_value) {
                    agentsLists.query({agent_code: new_value}).$promise.then(function (agents) {
                        if (agents[0])
                            $scope.agent_name = agents[0].agent_name;
                    });
                }
            }));

            $scope.reset = function () {
                $scope.condition = angular.copy(init_condition);
                $scope.search();
            }

            $scope.detail = function (loan_id) {
                $location.path('/loan/detail/' + loan_id);
            }

        }]).controller('repaymentCtrl', ['$scope', '$modalInstance', 'globalFunction', 'windowItems', 'loan_data', 'marker_data', 'getDate', 'topAlert', 'repaymentType', 'repaymentMethod', 'loanBusinessOperation', 'depositCard', 'markerRepayment', 'agentsLists', 'depositTicket', 'agentContact', 'qzPrinter', 'printerType', '$modal', 'login_user', 'formatNumber',
        function ($scope, $modalInstance, globalFunction, windowItems, loan_data, marker_data, getDate, topAlert, repaymentType, repaymentMethod, loanBusinessOperation, depositCard, markerRepayment, agentsLists, depositTicket, agentContact, qzPrinter, printerType, $modal, login_user, formatNumber) {
            //還款方式
            //$scope.payment_methods = paymentMethods;
            //房款類型
            //$scope.payment_types = paymentTypes;
            $scope.repaymentType = repaymentType.items;
            $scope.repaymentMethod = repaymentMethod.items;
            $scope.loanSequnmber = {
                number: ''
            }
            //業務單
            $scope.loan = angular.copy(loan_data);
            $scope.loanSequnmber.number = angular.copy($scope.loan.loan_seqnumber);
            //貸款單
            $scope.marker = marker_data;
            var init_repayment = {
                "agent_info_id": $scope.loan.agent_info_id,
                "marker_id": $scope.marker.id,
                "repayment_type": "",
                "repay_name": "",
                "is_all": "",
                "card_id": "",
                "ticket_id": "",
                "amount": "",
                "remark": ""
            }
            $scope.repayment = angular.copy(init_repayment);

            $scope.repayment_url = globalFunction.getApiUrl('loan/markerrepayment');

            //還款
            $scope.isDisabled = false;
            $scope.submit = function (is_print) {
                if ($scope.isDisabled) {
                    return $scope.isDisabled;
                }
                if ($scope.repayment.repayment_type == 1||$scope.repayment.repayment_type ==4 ) {
                    if(+$scope.transaction_amount<+$scope.repayment.amount){
                        topAlert.warning("還款金額大於可用餘額，不能進行還款");
                        return false;
                    }
                }//存卡
                $scope.isDisabled = true;
                $scope.form_repayment.checkValidity().then(function () {

                    //還款成功repayment.amount
                    $scope.repayment.agent_info_id = $scope.loan.agent_info_id;
                    $scope.repayment_amountint = angular.copy($scope.repayment);
                    $scope.repayment_amountint.amount = +($scope.repayment_amountint.amount.toString().replace(/,/g, ''));
                    markerRepayment.save($scope.repayment_amountint).$promise.then(function (data) {
                        if (data && data.message == '1016') {
                            topAlert.warning("無法查詢外館簽額（網絡或rollex服務問題）");
                        }
                        if (is_print === true) {
                            if ($scope.repayment.repayment_type == 1) {//存卡
                                if (data.settlement_amount_all && Number(data.settlement_amount_all) > 0) { //部分還款
                                    //打印還款單
                                    qzPrinter.print('PDFLoanReceipt', printerType.stylusPrinter, {
                                        'loan_id': $scope.loan.id,
                                        'loan_sequnmber': $scope.loanSequnmber.number
                                    }).then(function () {
                                        topAlert.success('貸款列印成功');
                                        $scope.isDisabled = false;
                                    }, function (msg) {
                                        $scope.isDisabled = false;
                                    })
                                }

//                                if(Number(data.settlement_amount_cardorticket)>0) {
//                                    //打印存卡
//                                    var print_record = {
//                                        id: data.record_id, //存卡流水ID
//                                        depositcard_id: $scope.repayment.card_id,  //存卡ID
//                                        agent_code: $scope.loan.agent_code,
//                                        agent_name: $scope.loan.agent_name,
//                                        card_name: $scope.card_name
//                                    }
//                                    $scope.print_card("還款存卡列印", print_record);
//                                }

                            } else if ($scope.repayment.repayment_type == 4) {//存M
                                //還款之後餘額為0不打印
                                if (Number(data.settlement_amount_all) > 0 && Number(data.settlement_amount_cardorticket) > 0) {
                                    //打印還款單
                                    qzPrinter.print('PDFLoanReceipt', printerType.stylusPrinter, {
                                        'loan_id': $scope.loan.id,
                                        'loan_sequnmber': $scope.loanSequnmber.number
                                    }).then(function () {
                                        topAlert.success('列印貸款成功');
                                        depositTicket.get({id: $scope.repayment.ticket_id}).$promise.then(function (ticket_one) {
                                            qzPrinter.print('PDFDepositTicketReceipt', printerType.stylusPrinter, ticket_one).then(function () {
                                                topAlert.success('存M列印成功');
                                                $scope.repayment = angular.copy(init_repayment);
                                            });
                                        });
                                    });
                                } else {
                                    if (Number(data.settlement_amount_all) > 0) {
                                        qzPrinter.print('PDFLoanReceipt', printerType.stylusPrinter, {
                                            'loan_id': $scope.loan.id,
                                            'loan_sequnmber': $scope.loanSequnmber.number
                                        }).then(function () {
                                            topAlert.success('列印貸款成功');
                                        });
                                    }
                                    if (Number(data.settlement_amount_cardorticket) > 0) {
                                        depositTicket.get({id: $scope.repayment.ticket_id}).$promise.then(function (ticket_one) {
                                            qzPrinter.print('PDFDepositTicketReceipt', printerType.stylusPrinter, ticket_one).then(function () {
                                                topAlert.success('存M列印成功');
                                                $scope.repayment = angular.copy(init_repayment);
                                            });
                                        });
                                    }
                                }
                            } else {
                                if (Number(data.settlement_amount_all) > 0) {
                                    qzPrinter.print('PDFLoanReceipt', printerType.stylusPrinter, {
                                        'loan_id': $scope.loan.id,
                                        'loan_sequnmber': $scope.loanSequnmber.number
                                    }).then(function () {
                                        topAlert.success('列印貸款成功');
                                        $scope.repayment = angular.copy(init_repayment);
                                    });
                                }
                            }
                        } else {
//                            $scope.repayment = angular.copy(init_repayment);
                        }
                        $scope.SMSsend(data, $scope.repayment);
                        if (is_print !== true) {
                            $scope.repayment = angular.copy(init_repayment);
                        }
                        topAlert.success('還款成功');
                        $scope.cancel();
                        $scope.isDisabled = false;
                    }, function () {
                        $scope.isDisabled = false;
                    });
                });
            };

            $scope.print_card = function (title, record) {
                if (record) {
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/deposit/print-card.html",
                        controller: 'printCardCtrl',
                        resolve: {
                            selected_deposit_card: function () {
                                return record;
                            },
                            title: function () {
                                return title;
                            },
                            login_user: function () {
                                return login_user;
                            }
                        }
                    });
                    modalInstance.result.then(function (_depositCard) {
                        $scope.repayment = angular.copy(init_repayment);
                        //存卡15行之後提示打印表頭
                        if (_depositCard.print_row == 15) {
                            windowItems.confirm("提示", "請先列印" + _depositCard.agent_code + "，存卡" + _depositCard.card_name + "的表頭", function () {
                                qzPrinter.print('PDFDepositCardTableHead', printerType.stylusPrinter, {
                                    'deposit_card_title_id': _depositCard.id,
                                    'hall_id': login_user.hall.id
                                }).then(function () {
                                    topAlert.success('列印成功');
                                });
                            });
                        }

                    }, function () {
                        $log.info("Modal dismissed at: " + new Date());
                    });
                } else {
                    topAlert.warning('請選中一條存卡記錄');
                }
            }

            $scope.cancel = function () {
                $modalInstance.close();
            };

            //查询存卡
            $scope.card_select = function () {
                if ($scope.repayment.repayment_type == 1) {//存卡
                    //查詢存卡類型
                    depositCard.query({agent_info_id: $scope.loan.agent_info_id}).$promise.then(function (depositCards) {
                        $scope.depositCards = depositCards;
                        if ($scope.depositCards) {
                            $scope.card = _.findWhere($scope.depositCards, {card_name: "A"});
                            $scope.repayment.card_id = $scope.card.id;
                        }
                    });
                } else {
                    $scope.depositCards = "";
                    $scope.repayment.card_id = "";
                }
            }

            //查询存单
            $scope.order_select = function () {
                if ($scope.repayment.repayment_type == 4) {
                    //查询户口下未全額取款的"存M"记录
                    $scope.depositOrders = depositTicket.query({
                        agent_info_id: $scope.loan.agent_info_id,
                        depositTicket_type: 1,
                        depositTicket_settlement: '|0'
                    });
                } else {
                    $scope.depositOrders = ""
                    $scope.repayment.ticket_id = "";
                }
            }

            //更换还款户口
            $scope.$watch('loan.agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.loan.agent_info_id = "";
                $scope.loan.agent_name = "";
                $scope.agentContacts = [];
                $scope.repayment.repay_name = "";
                $scope.card_name = "";
                if (new_value) {
                    agentsLists.query({agent_code: new_value}).$promise.then(function (agents) {
                        if (agents[0]) {
                            $scope.loan.agent_info_id = agents[0].id;
                            $scope.loan.agent_code = agents[0].agent_code;
                            $scope.loan.agent_name = agents[0].agent_name;
                            if ($scope.repayment.repayment_type == 1) {
                                $scope.card_select();
                            } else if ($scope.repayment.repayment_type == 4) {
                                $scope.order_select();
                            }
                            //$scope.isDisabled = false;

                            //查詢還款聯絡人
                            agentContact.query({'agentInfo.agent_code': new_value}).$promise.then(function (_agentContact) {
                                /*if(_agentContact){
                                 var contact_data = _.findWhere(_agentContact,{type:'1'});

                                 $scope.repayment.repay_name = contact_data.agent_contact_name;
                                 }*/
                                $scope.agentContacts = _agentContact
                                $scope.repayment.repay_name = $scope.marker.borrower;
                            });
                        }
                    });
                } else {
                    $scope.depositCards = ""
                    $scope.repayment.card_id = "";
                    $scope.loan.agent_info_id = "";
                    $scope.loan.agent_code = "";
                    $scope.loan.agent_name = "";
                }
                //$scope.isDisabled = true;
            }));

            //還款方式
            $scope.$watch('repayment.repayment_type', function (new_value, old_value) {
                if (new_value == 1) {
                    $scope.card_select();
                } else if (new_value == 4) {
                    $scope.order_select();
                }
            });

            //還款類型
            $scope.$watch('repayment.is_all', function (new_value, old_value) {
                if (new_value == 1) {//全部還款
                    //全部還款 = 貸款金額 - 未還金額
                    //$scope.repayment.amount = formatNumber($scope.marker.settlement_amount);
                    $scope.repayment.amount = parseFloat($scope.marker.settlement_amount);
                } else {
                    $scope.repayment.amount = "";
                }
            });

            $scope.$watch('repayment.card_id', function (new_value, old_value) {
                //查詢存卡餘額
                if (new_value) {
                    var mortgage_data = _.findWhere($scope.depositCards, {id: new_value});
                    $scope.transaction_amount = mortgage_data.usable_amount;
                    $scope.card_name = mortgage_data.card_name;
                } else {
                    $scope.transaction_amount = 0;
                    $scope.card_name = "";
                }
            });

            $scope.$watch('repayment.ticket_id', function (new_value, old_value) {
                //查詢存M餘額
                if (new_value) {
                    var mortgage_data = _.findWhere($scope.depositOrders, {id: new_value});
                    //$scope.transaction_amount = mortgage_data.depositTicket_settlement;
                    $scope.transaction_amount = mortgage_data.usable_amount;
                } else {
                    $scope.transaction_amount = 0;
                }
            })
            //新增存單之後手動發短信
            $scope.SMSsend = function (data, repayment) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/loan/loan-create-sms.html",
                    controller: 'loanRepaymentCreateSmsCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        },
                        agent_name: function () {
                            return $scope.loan.agent_name;
                        },
                        agent_code: function () {
                            return $scope.loan.agent_code;
                        },
                        repayment: function () {
                            return repayment
                        }
                    }
                });
            }

        }
    ]).controller('repaymentFeeCtrl', ['$scope', '$modal', '$modalInstance', 'user', 'tmsPagination', 'globalFunction', 'currentShift', 'agentsLists', 'getDate', 'topAlert', 'paymentMethods', 'paymentTypes', 'feeTotal', 'markerFee', 'feeTypes', 'depositCard', 'marker', 'repaymentType', 'repaymentMethod', 'condition', '$filter',
        function ($scope, $modal, $modalInstance, user, tmsPagination, globalFunction, currentShift, agentsLists, getDate, topAlert, paymentMethods, paymentTypes, feeTotal, markerFee, feeTypes, depositCard, marker, repaymentType, repaymentMethod, condition, $filter) {
            //還款方式
            //$scope.payment_methods = paymentMethods;
            //房款類型
            //$scope.payment_types = paymentTypes;
            $scope.user = user;
            $scope.feeTypes = feeTypes.items;
            $scope.repaymentType = repaymentType.items;
            $scope.repaymentMethod = repaymentMethod.items;
            $scope.condition = angular.copy(condition);
            $scope.out_agent_name = $scope.condition.loan_agent_name;
            $scope.feeTotal = feeTotal;
            $scope.markerExpiredFees = [];
            $scope.depositCards = [];
            $scope.halls = _.filter(JSON.parse(sessionStorage.getItem("halls")), function (hall) {
                return hall.hall_type != 1;
            });
            $scope.add_booktis = function () {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/share/phrasebooktis.html",
                    controller: 'test',
                    windowClass: 'lg-modal',
                    resolve: {}
                });
                modalInstance.result.then((function (result) {
                    $scope.repayment.remark = result
                }), function () {
                    //$log.info("Modal dismissed at: " + new Date());
                });
            }

            //貸款單
            //$scope.mefee = markerExpiredFee_data;
            //$scope.mefee.marker = marker.get({id:markerExpiredFee_data.marker_id});
            $scope.repayment = {
                "agent_info_id": $scope.condition.agent_info_id,
                "deposit_agent_info_id": $scope.condition.agent_info_id,
                "agentName": $scope.condition.loan_agent_name,
                "deposit_type": "2",
                "deposit_card_id": "",
                "amount": "",
                "hall_id": currentShift.data.hall_id,
                "remark": "",
                "agent_code": $scope.condition.outAgent.agent_code
            }
            $scope.agent = {
                "agent_info_id": "",
                "agent_name": ""
            }

            $scope.repayment_url = globalFunction.getApiUrl('loan/markerfee/add-expired-fee');

            $scope.condition = {
                only_current_hall: 0,
                outAgent: {agent_code: $scope.condition.outAgent.agent_code},
                status: "1",
                end_date: ["", ""],
                marker_seqnumber: $scope.condition.marker_seqnumber,
                settlement_amount: "|0"
//                loan_agent_name:condition
            }
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = markerFee;
            $scope.pagination.items_per_page = 5;
            $scope.select = function (page) {
                $scope.condition_copy = angular.copy($scope.condition);
                if ($scope.condition.status == 1) {
                    $scope.condition_copy.status = '|3';
                } else if ($scope.condition.status == 2) {
                    $scope.condition_copy.status = '3';
                } else {
                    $scope.condition_copy.status = "";
                }
//                $scope.condition_copy.year_month = $filter('date')(new Date($scope.condition_copy.year_month), 'yyyy-MM-dd');
                $scope.condition_copy.end_date[0] = $scope.condition_copy.end_date[0] ? $filter('date')(new Date($scope.condition_copy.end_date[0]), 'yyyy-MM-dd') : "";
                $scope.condition_copy.end_date[1] = $scope.condition_copy.end_date[1] ? $filter('date')(new Date($scope.condition_copy.end_date[1]), 'yyyy-MM-dd') : "";
                $scope.markerExpiredFees = $scope.pagination.select(page, globalFunction.generateUrlParams($scope.condition_copy, {markerExpiredFees: {}}));//,{marker:{}}
            }

            //還款
            $scope.disabled_submit = false;
            $scope.add = function () {
                if ($scope.disabled_submit) {
                    return false;
                }

                if ($scope.repayment.deposit_type == '1') {
                    if (parseFloat($scope.repayment.amount) > parseFloat($scope.transaction_amount)) {
                        topAlert.warning("存款金額不能大於存卡餘額！");
                        return;
                    }
                }
                $scope.disabled_submit = true;
                $scope.form_repayment.checkValidity().then(function () {

                    $scope.repayment_copy = angular.copy($scope.repayment);
                    delete $scope.repayment_copy.agent_code;
//                    $scope.repayment_copy.amount = parseFloat($scope.repayment.amount/10000);
                    //還款成功
                    markerFee.addExpiredFee($scope.repayment_copy).$promise.then(function (data) {
                        topAlert.success('存款成功');
                        $modalInstance.close(true);
                        if (data.depositTelNumberModelList.length > 0) {//判斷是否有發送的內容
                            $scope.SMSsend(data);
                        }
                        //現金支付
                        if (data.depositTelNumberModelList.length == 0 && data.saveSmsBodyModelList.length > 0) {
                            $scope.receiveSMSsend(data);
                        }

                        $scope.disabled_submit = true;
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                });
            };

            $scope.cancel = function () {
                $modalInstance.close('');
            };

            $scope.SMSsend = function (data) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/loan/loan-create-sms.html",
                    controller: 'repaymentFeeSmsCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        }
                    }
                });
                modalInstance.result.then((function (status) {

                }), function () {

                });
            }

            //手續費付款接收短信
            $scope.receiveSMSsend = function (data) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/loan/loan-create-sms.html",
                    controller: 'receiveRepaymentFeeSmsCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        }
                    }
                });
            }

            $scope.$watch('repayment.agent_code', globalFunction.debounce(function (new_value, old_value) {
                if (new_value) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function (agents) {
                        if (agents.length > 0) {
                            $scope.agent.agent_info_id = agents[0].id;
                            $scope.repayment.deposit_agent_info_id = agents[0].id;
                            $scope.agent.agent_name = agents[0].agent_name;
                            $scope.depositCards = [];
                            $scope.repayment.deposit_card_id = "";
                            $scope.repayment.deposit_type = "2";
                        } else {
                            $scope.agent.agent_info_id = "";
                            $scope.repayment.agent_name = "";
                            $scope.depositCards = [];
                            $scope.repayment.deposit_agent_info_id = "";
                            $scope.repayment.deposit_card_id = "";
                            $scope.repayment.deposit_type = "";
                        }
                    });
                } else {
                    $scope.agent.agent_info_id = "";
                    $scope.agent.agent_name = "";
                    $scope.depositCards = [];
                    $scope.repayment.deposit_agent_info_id = "";
                    $scope.repayment.deposit_card_id = "";
                    $scope.repayment.deposit_type = "";
                }
            }, 350));
            $scope.$watch('repayment.deposit_type', function (new_value, old_value) {
                if (new_value == 1) {//存卡
                    //查詢存卡類型
                    if ($scope.repayment.agent_info_id) {
                        depositCard.query({agent_info_id: $scope.agent.agent_info_id}).$promise.then(function (depositCards) {
//                            $scope.depositCards = depositCards;
                            $scope.depositCards = _.filter(depositCards, function (depositCard) {
                                return depositCard.hall_id == $scope.repayment.hall_id;
                            });
                            var card_data = _.findWhere($scope.depositCards, {card_name: 'A'});
                            $scope.repayment.deposit_card_id = card_data ? card_data.id : '';
                        });
                    }
                } else {
                    $scope.depositCards = [];
                    $scope.repayment.deposit_card_id = "";
                }
            });

            $scope.change_card = function () {
                if ($scope.repayment.hall_id) {
                    depositCard.query({agent_info_id: $scope.agent.agent_info_id}).$promise.then(function (depositCards) {
                        $scope.depositCards = _.filter(depositCards, function (depositCard) {
                            return depositCard.hall_id == $scope.repayment.hall_id;
                        });
                    });
                }
            }

            $scope.$watch('repayment.deposit_card_id', function (new_value, old_value) {
                //查詢存卡餘額
                if (new_value) {
                    var mortgage_data = _.findWhere($scope.depositCards, {id: new_value});
                    $scope.transaction_amount = mortgage_data.usable_amount;
                } else {
                    $scope.transaction_amount = 0;
                }
            })

        }
    ]).controller('repaymentFeeSmsCtrl', ['$scope', '$modalInstance', '$modal', 'SimplizedorFt', 'markerFee', 'data', 'depositCard', 'topAlert', function ($scope, $modalInstance, $modal, SimplizedorFt, markerFee, data, depositCard, topAlert) {
        //手續費付款短信

        $scope.sms = {
            agent_code: data.depositTelNumberModelList[0].agentCode,
            agent_name: data.depositTelNumberModelList[0].agentContactName,
            content: data.depositSmsBodyModelList[0].content,
            phoneNumber: data.depositTelNumberModelList
        }

        $scope.send_sms = {
            pin_code: "",
            smsBodyModelList: data.depositSmsBodyModelList,
        }

        //定義一個變量，監控是否修改短信內容
        $scope.sms_content = $scope.sms.content;
        $scope.$watch("sms.content", function (new_value) {
            if (new_value) {
                $scope.sms_content = $scope.sms.content;
            }

            _.each($scope.send_sms.smsBodyModelList, function (d) {
                d.content = $scope.sms.content = $scope.sms_content;
            })
        })

        /*storm end*/
        $scope.isActive = true;
        $scope.isActive1 = false;
        $scope.changeAt = function (con, flag) {
            $scope.isActive = flag;
            $scope.isActive1 = !flag;
            $scope.sms.content = SimplizedorFt(con, flag);
            _.each($scope.send_sms.smsBodyModelList, function (val) {
                val.content = SimplizedorFt(val.content, flag)
            });
        }
        /*storm end*/


        $scope.edit = function () {
            $scope.isReadonly = false;
        };

        $scope.sendSms = function () {
            //console.log($scope.send_sms);
            $scope.disabled_submit=true;
            $scope.form_loan_sms.checkValidity().then(function () {
                markerFee.repaymentfeeSms($scope.send_sms, function () {
                    topAlert.success("短信發送成功！");
                    $scope.disabled_submit = false;
                    $modalInstance.close();
                    if (data.saveSmsBodyModelList.length > 0) {
                        $scope.receiveSMSsend(data);//彈出第二條短信
                    }
                }, function () {
                    $scope.disabled_submit = false;
                });
            });

        }

        $scope.close = function () {
            $modalInstance.dismiss();
        }


        //手續費付款接收短信
        $scope.receiveSMSsend = function (data) {
            var modalInstance;
            modalInstance = $modal.open({
                templateUrl: "views/loan/loan-create-sms.html",
                controller: 'receiveRepaymentFeeSmsCtrl',
                resolve: {
                    data: function () {
                        return data ? data : "";
                    }
                }
            });
        }

    }]).controller('receiveRepaymentFeeSmsCtrl', ['$scope', '$modalInstance', '$modal', 'SimplizedorFt', 'markerFee', 'data', 'depositCard', 'topAlert', function ($scope, $modalInstance, $modal, SimplizedorFt, markerFee, data, depositCard, topAlert) {
        //手續費付款短信

        $scope.sms = {
            agent_code: data.saveTelNumberModelList[0].agentCode,
            agent_name: data.saveTelNumberModelList[0].agentContactName,
            content: data.saveSmsBodyModelList[0].content,
            phoneNumber: data.saveTelNumberModelList
        }

        $scope.send_sms = {
            pin_code: "",
            smsBodyModelList: data.saveSmsBodyModelList,
        }

        //定義一個變量，監控是否修改短信內容
        $scope.sms_content = $scope.sms.content;
        $scope.$watch("sms.content", function (new_value) {
            if (new_value) {
                $scope.sms_content = $scope.sms.content;
            }

            _.each($scope.send_sms.smsBodyModelList, function (d) {
                d.content = $scope.sms.content = $scope.sms_content;
            })
        })

        /*storm end*/
        $scope.isActive = true;
        $scope.isActive1 = false;
        $scope.changeAt = function (con, flag) {
            $scope.isActive = flag;
            $scope.isActive1 = !flag;
            $scope.sms.content = SimplizedorFt(con, flag);
            _.each($scope.send_sms.smsBodyModelList, function (val) {
                val.content = SimplizedorFt(val.content, flag)
            });
        }
        /*storm end*/

        $scope.edit = function () {
            $scope.isReadonly = false;
        };

        $scope.sendSms = function () {
            $scope.disabled_submit=true;
            $scope.form_loan_sms.checkValidity().then(function () {
                markerFee.repaymentfeeSms($scope.send_sms, function () {
                    topAlert.success("短信發送成功！");
                    $scope.disabled_submit = false;
                    $modalInstance.close();
                }, function () {
                    $scope.disabled_submit = false;
                });
            });

        }

        $scope.close = function () {
            $modalInstance.dismiss();
        }


    }]).controller('loanDetailCtrl', ['$scope', 'globalFunction', 'qzPrinter', 'printerType', '$state', '$stateParams', '$location', 'breadcrumb', 'loanBusiness', 'marker', '$modal', 'tmsPagination'/*,'loanMarkerRepayment'*/, 'markerStatus', 'topAlert', 'markerTerm', 'repaymentType', 'repaymentMethod', 'markerRepayment', 'pinCodeModal',
        function ($scope, globalFunction, qzPrinter, printerType, $state, $stateParams, $location, breadcrumb, loanBusiness, marker, $modal, tmsPagination/*,loanMarkerRepayment*/, markerStatus, topAlert, markerTerm, repaymentType, repaymentMethod, markerRepayment, pinCodeModal) {
            breadcrumb.items = [
                {"name": "貸款管理", "url": "/loan/list"},
                {"name": "貸款單詳細", "active": true}
            ];

            $scope.markerStatus = markerStatus.items;
            //貸款單還款狀態
            $scope.repaymentType = repaymentType.items;
            $scope.repaymentMethod = repaymentMethod.items;
            $scope.marker_status = markerStatus.items;
            $scope.loan_id = $stateParams.loan_id;

            //貸款詳細
            $scope.select = function () {
                loanBusiness.get(globalFunction.generateUrlParams({id: $scope.loan_id}, {
                    markers: {},
                    loanSupervisors: {}
                }))
                    .$promise.then(function (loan) {
                        $scope.loan = loan;
                    });
            }
            $scope.select();


            //還款記錄
//            $scope.pagination = tmsPagination.create();
//            $scope.pagination.resource = loanMarkerRepayment;
            $scope.searchRepayment = function () {
                $scope.repaymentList = loanBusiness.loanMarkerRepayment(globalFunction.generateUrlParams({loan_business_id: $scope.loan_id}));
            }
            $scope.searchRepayment();

            //刪除業務單
            $scope.delete = function (loan_data) {
                $modal.open({
                    templateUrl: "views/loan/loan-delete.html",
                    controller: 'loanDeleteCtrl',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        loanData: function () {
                            return loan_data;
                        }
                    }
                });
            };
            $scope.copy = function () {
                $location.path('loan/create/' + $scope.loan_id + '/copy');
            }

            $scope.update = function () {
                $location.path('loan/update/' + $scope.loan_id + '/update');
            }

            //repayment  還款
            $scope.repayment = function (marker_id) {
                marker.get({id: marker_id}).$promise.then(function (marker_data) {
                    var modal_instance;
                    modal_instance = $modal.open({
                        templateUrl: "views/loan/repayment-create.html",
                        controller: 'repaymentCtrl',
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            loan_data: function () {
                                return $scope.loan;
                            }, marker_data: function () {
                                return marker_data;
                            },
                            login_user: function () {
                                return $scope.user;
                            }
                        }
                    });

                    //還款
                    modal_instance.result.then(function () {
                        //還款成功刷新列表
                        $scope.select();
                        $scope.searchRepayment();
                    })
                });
            };

            $scope.edit_remark = function () {
                pinCodeModal(loanBusiness, 'updateRemark', {id: $scope.loan.id, remark: $scope.loan.remark}, '備註修改成功！');
            }

            //還款記錄回滾
            $scope.rollbackRepayment = function (id) {
                pinCodeModal(markerRepayment, 'repaymentRollback', {
                    marker_repayment_id: id,
                    remark: ""
                }, '回滾成功！').then(function () {
                    $scope.select();
                    $scope.searchRepayment();
                });
            }

            //貸款單詳細
            $scope.markerTerms = [];
            $scope.markerDetail = function (marker_id) {
                $scope.markerTerms = markerTerm.query(globalFunction.generateUrlParams({
                    marker_id: marker_id,
                    sort: 'layer desc'
                }));
            }

            $scope.gotoOperationRecord = function () {
                $location.path('loan/operation-record/' + $scope.loan_id + '/' + $scope.loan.loan_seqnumber);
            }

            //查看轉碼記錄
            $scope.gotoRolling = function () {
                $location.path('rolling/rolling-list/' + $scope.loan.agent_code);
            }
            $scope.disable_print = false;
            //列印
            $scope.print = function () {
                $scope.disable_print = true;
                qzPrinter.print('PDFLoanReceipt', printerType.stylusPrinter, {
                    'loan_id': $scope.loan.id,
                    'hall_id': '1AE7283167B57D1DE050A8C098155859'
                }).then(function () { //TODO
                    topAlert.success('列印成功');
                    $scope.disable_print = false;
                }, function (msg) {
                    $scope.disable_print = false;
                })
            }
            //試算手續費功能
            $scope.trial = function (marker) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/loan/trial.html",
                    controller: 'trialCtrl',
                    resolve: {
                        marker: function () {
                            return marker;
                        },
                        loan: function () {
                            return $scope.loan;
                        }
                    }
                });
            }

        }
    ]).controller('trialCtrl', [
        '$scope', 'globalFunction', '$modalInstance', 'marker', 'markerExpiredFee', 'topAlert', 'formatNumber', function ($scope, globalFunction, $modalInstance, marker, markerExpiredFee, topAlert, formatNumber) {
            $scope.marker = marker;
            $scope.loan_marker = {
                marker_id: $scope.marker.id,
                settlement_amount: formatNumber($scope.marker.settlement_amount),
                amount: ""
            }
            $scope.show = false;
            $scope.trial_url = globalFunction.getApiUrl("loan/markerexpiredfee/trial");

            $scope.trial = function () {
                if ($scope.isDisabled) {
                    return;
                }
                if (!$scope.loan_marker.amount) {
                    topAlert.warning("請填寫還款金額。");
                    return;
                }
                //if(Number($scope.loan_marker.amount.toString().replace(/,/g, '')) > Number($scope.marker.settlement_amount.toString().replace(/,/g, ''))){
                //    topAlert.warning("還款金額不能大於未還金額。");
                //    return;
                //}
                $scope.isDisabled = true;
                $scope.loan_marker_copy = angular.copy($scope.loan_marker);
                $scope.loan_marker_copy.settlement_amount = Number($scope.loan_marker_copy.settlement_amount.toString().replace(/,/g, ''));

                $scope.form_trial.checkValidity().then(function () {
                    markerExpiredFee.trial($scope.loan_marker_copy).$promise.then(function (results) {

                        if (results.length != 0) {
                            $scope.show = true;
                        } else {
                            $scope.show = false;
                        }
                        $scope.trial1 = $scope.trial2 = "";
                        $scope.feeTotal = 0;
                        _.each(results, function (result) {
                            if (result.feeType == 1) {
                                $scope.trial1 = result
                            }
                            if (result.feeType == 2) {
                                $scope.trial2 = result
                            }
                            $scope.feeTotal += Number(result.fee);
                        });
                        $scope.isDisabled = false;
                    }, function () {
                        $scope.isDisabled = false;
                    })
                });
            }

        }]).controller('loanEditSmsCtrl', [
        '$scope', '$modalInstance', 'loan_data', 'sms_content', function ($scope, $modalInstance, loan_data, sms_content) {
            $scope.loan = loan_data;
            $scope.sms = angular.copy(sms_content);
            $scope.submit = function (sms) {
                $modalInstance.close(sms);
            }
            $scope.cancel = function () {
                $modalInstance.dismiss("cancel");
            }
        }
    ]).controller('loanCreateCtrl', ['$scope', '$modal', 'globalFunction', 'BusinessSequence', 'qzPrinter', 'printerType', '$stateParams', 'user', 'getDate', 'topAlert', '$location', 'goBackData', 'checkUppercase', 'breadcrumb', 'loanBusiness', 'markerExpiredFee', 'agentsLists', 'agentQuota', 'agentOrders', 'agentType', 'specialCodeTypes', 'specialCodeTypesTrans', 'windowItems', 'fundsTypes', 'tmsPagination', 'sceneInfo', 'agentSceneStatus', 'agentFundType', 'quotaSetting', '$filter', 'stroke', 'agentContact', 'formatNumber',
        function ($scope, $modal, globalFunction, BusinessSequence, qzPrinter, printerType, $stateParams, user, getDate, topAlert, $location, goBackData, checkUppercase, breadcrumb, loanBusiness, markerExpiredFee, agentsLists, agentQuota, agentOrders, agentType, specialCodeTypes, specialCodeTypesTrans, windowItems, fundsTypes, tmsPagination, sceneInfo, agentSceneStatus, agentFundType, quotaSetting, $filter, stroke, agentContact, formatNumber) {

            $scope.agentType = agentType.items;

            //特別碼
            $scope.specialCodeTypes = specialCodeTypes;
            $scope.specialCodeTypesTrans = specialCodeTypesTrans.items;
            $scope.agentSceneStatus = agentSceneStatus.items;
            $scope.is_lock = true;
            $scope.isPrintFlag = false;
            $scope.confirmIsDisabled = false;

            breadcrumb.items = [
                {"name": "貸款管理", "url": "/loan/list"},
                {"name": "新增貸款", "active": true}
            ];

            $scope.sub_method = "POST";
            $scope.is_confirm = false;//禁止輸入
            $scope.is_agentQuotas_show = false;   //確認貸款信息

            $scope.title = '新增貸款';
            $scope.have_overdue_loan = false;

            //贷款业务单
            var init_loan = {
                "ref_agent_contact_type_id": "",
                "agent_name": "",
                "borrow_agent_name": "",
                "loan_amount": "",
                "is_modifed": 0,
                "borrower": "",
                "loan_time": "",
                "type": "",
                "pin_code": "",
                "borrow_agent_info_id": "",
                "supervisors": []
            };
            init_loan.loan_time = new Date();
            $scope.loan = angular.copy(init_loan);
            $scope.loan = goBackData.get('loan', $scope.loan);
            //$scope.agent_code = goBackData.get('agent_code',$scope.agent_code);
            $scope.loan_time_copy = angular.copy($scope.loan.loan_time);

            //添加批額人
            $scope.loan_supervisors = [{supervisor_id: "", supervisor: ""}];
            //$scope.loan_supervisors = goBackData.get('loan_supervisors',$scope.loan_supervisors);

            //在場戶口列表
            /* $scope.pagination_scene = tmsPagination.create();
             $scope.pagination_scene.resource = sceneInfo;
             $scope.agent_keyword = "";
             $scope.select_scene = function(page){
             $scope.sceneInfos = $scope.pagination_scene.select(page,{agent_code:$scope.agent_keyword+"!", status:'|3', sort:'status desc'});
             }
             $scope.select_scene();*/

            /*$scope.settingCode = function(agent_code){
             $scope.agent_code = agent_code;
             }*/


            //判斷是否已經全部閱讀
            /*$scope.read_ids = [];
             $scope.settingRead = function(order){
             if(order.read){
             $scope.read_ids.push(order.id);
             }else{
             $scope.read_ids = _.without($scope.read_ids,0,order.id);
             }
             }*/

            //Order 紙
            /*$scope.pagination = tmsPagination.create();
             $scope.pagination.items_per_page = 5;
             $scope.pagination.resource = agentOrders;
             $scope.pagination.query_method = "agentOrderLists";*/
            /* $scope.select = function(page){
             $scope.agentOrders = agentOrders.agentOrderLists({agent_info_id: $scope.agent_info_id, module_code:'NEW_LOAN'})
             $scope.pagination.select(page, {agent_info_id: $scope.agent_info_id, module_code:'NEW_LOAN'}).$promise.then(function(orders){
             $scope.agentOrders = orders;
             _.each(orders,function(order){
             if(_.indexOf($scope.read_ids,order.id)==-1){
             order.read = false;
             }else{
             order.read = true;
             }
             });
             });
             }*/

            //通過編號查詢戶口信息
            $scope.agentOrders = [];
            $scope.quotaRemarks = "";
            if ($stateParams.agent_code) {
                $scope.agent_code = $stateParams.agent_code;
            }
            $scope.$watch('borrow_agent_code', globalFunction.debounce(function (new_value, old_value) {
                //$scope.agent_info_id = "";
                //$scope.agent_type = "";
                //$scope.quotaRemarks = "";

                $scope.loan.borrow_agent_name = "";
                $scope.loan.borrow_agent_info_id = "";
                //$scope.loan.borrower="";
                //$scope.agentQuotas = [];
                //$scope.agentOrders = [];
                //$scope.borrowers = [];
                //$scope.read_ids = [];
                //$scope.supervisor_ids=[];
                //$scope.loan_supervisors = [{/*supervisor_id:"",*/supervisor:""}];
                if (new_value) {
                    //$scope.isDisabled = true;
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {
                        bindLoanAuthorizers: {},
                        quotaRemarks: {}
                    }))
                        .$promise.then(function (selected_agent) {
                            if (selected_agent[0]) {
                                //$scope.agent_info_id = "";
                                //$scope.agent_info_id = selected_agent[0].id;
                                $scope.loan.borrow_agent_name = selected_agent[0].agent_name;
                                $scope.loan.borrow_agent_info_id = selected_agent[0].id;
                                //$scope.quotaRemarks = selected_agent[0].quotaRemarks.length>0 ? selected_agent[0].quotaRemarks[0].content : "";
                                //$scope.agent_type = $scope.agentType[selected_agent[0].type];

                                //查詢Order紙
                                //$scope.agentOrders = agentOrders.agentOrderLists({agent_info_id: $scope.agent_info_id, module_code:'NEW_LOAN'})
                                //借款人默认选中户主
                                //loanBusiness.borrowers({agent_info_id: selected_agent[0].id})
                                //    .$promise.then(function(_borrowers){
                                //        //$scope.borrowers = _borrowers;
                                //        //$scope.borrowers = stroke.sort(_borrowers,"agent_contact_name");
                                //        /*$scope.borrowers = _.sortBy(_borrowers,function(stooge){return stooge.agent_contact_name;});*/
                                //        var contact_data = _.findWhere(_borrowers,{contact_type:'1'});
                                //        if(contact_data){
                                //            $scope.borrower_id = contact_data.agent_contact_id;
                                //        }
                                //        //if($stateParams.contact_name){
                                //        //    _.each($scope.borrowers,function(borrower){
                                //        //        if(borrower && borrower.agent_contact_name == $stateParams.contact_name){
                                //        //            $scope.borrower_id = borrower.agent_contact_id;
                                //        //        }
                                //        //    });
                                //        //}
                                //    });
                                //批核人
                                // $scope.supervisors = selected_agent[0].bindLoanAuthorizers;
                                //$scope.supervisors = _.sortBy(selected_agent[0].bindLoanAuthorizers,function(stooge){return stooge.agent_contact_name;});

                                //$scope.supervisors = loanBusiness.loanSupervisors(globalFunction.generateUrlParams({agent_info_id: selected_agent[0].id}));
                                //查询批額
                                //$scope.agentQuotas = agentQuota.get({agent_info_id: selected_agent[0].id}, {agent_quota: { quota: ""}});
                                //下一步按鈕
                                //$scope.isDisabled = false;

                            }
                        });
                }

            }));
            $scope.$watch('agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.agent_info_id = "";
                $scope.agent_type = "";
                $scope.quotaRemarks = "";

                $scope.loan.agent_name = "";
                $scope.loan.borrower = "";
                $scope.agentQuotas = [];
                $scope.agentOrders = [];
                $scope.borrowers = [];
                //$scope.read_ids = [];
                //$scope.supervisor_ids=[];
                $scope.loan_supervisors = [{/*supervisor_id:"",*/supervisor: ""}];
                if (new_value) {
                    $scope.isDisabled = true;
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {
                        bindLoanAuthorizers: {},
                        quotaRemarks: {}
                    }))
                        .$promise.then(function (selected_agent) {
                            if (selected_agent[0]) {
                                $scope.agent_info_id = "";
                                $scope.agent_info_id = selected_agent[0].id;
                                $scope.loan.agent_name = selected_agent[0].agent_name;
                                $scope.quotaRemarks = selected_agent[0].quotaRemarks.length > 0 ? selected_agent[0].quotaRemarks[0].content : "";
                                $scope.agent_type = $scope.agentType[selected_agent[0].type];

                                //查詢Order紙
                                $scope.agentOrders = agentOrders.agentOrderLists({
                                    agent_info_id: $scope.agent_info_id,
                                    module_code: 'NEW_LOAN'
                                })
                                //借款人默认选中户主
                                loanBusiness.borrowers({
                                    agent_info_id: selected_agent[0].id,
                                    sort: 'agent_contact_name asc'
                                })
                                    .$promise.then(function (_borrowers) {
                                        //$scope.borrowers = _borrowers;
                                        $scope.borrowers = stroke.sort(_borrowers, "agent_contact_name");
                                        /*$scope.borrowers = _.sortBy(_borrowers,function(stooge){return stooge.agent_contact_name;});*/
                                        var contact_data = _.findWhere(_borrowers, {contact_type: '1'});
                                        if (contact_data) {
                                            $scope.borrower_id = contact_data.agent_contact_id;
                                        }
                                        if ($stateParams.contact_name) {
                                            _.each($scope.borrowers, function (borrower) {
                                                if (borrower && borrower.agent_contact_name == $stateParams.contact_name) {
                                                    $scope.borrower_id = borrower.agent_contact_id;
                                                }
                                            });
                                        }
                                    });
                                //批核人
                                // $scope.supervisors = selected_agent[0].bindLoanAuthorizers;
                                $scope.supervisors = _.sortBy(selected_agent[0].bindLoanAuthorizers, function (stooge) {
                                    return stooge.agent_contact_name;
                                });

                                //$scope.supervisors = loanBusiness.loanSupervisors(globalFunction.generateUrlParams({agent_info_id: selected_agent[0].id}));
                                //查询批額
                                //$scope.agentQuotas = agentQuota.get({agent_info_id: selected_agent[0].id}, {agent_quota: { quota: ""}});
                                //下一步按鈕
                                $scope.isDisabled = false;

                            }
                        });
                }

            }));

            //新增助手
            $scope.addHelper = function () {
                goBackData.set('loan', $scope.loan);
                goBackData.set('agent_code', $scope.agent_code);
                //goBackData.set('loan_supervisors',$scope.loan_supervisors);

                //return false;
                if ($scope.agent_info_id) {
                    $location.path("agent/contact-create/" + $scope.agent_code + "/3/" + $scope.agent_info_id);
                } else {
                    topAlert.warning("请先输入户口编号");
                }
            }

            //驗證鏈接
            $scope.loan_url = globalFunction.getApiUrl('loan/loanbusiness/create-marker');
            //批核人電話
            $scope.borrowers_phoneNumbers = {};
            $scope.$watch('borrower_id', function (new_value, old_value) {
                if (new_value) {
                    $scope.borrowers_phoneNumbers = _.findWhere($scope.borrowers, {agent_contact_id: new_value});
                    $scope.loan.borrower = $scope.borrowers_phoneNumbers.agent_contact_name;
                    $scope.loan.ref_agent_contact_type_id = $scope.borrowers_phoneNumbers.id;
                } else {
                    $scope.loan.ref_agent_contact_type_id = "";
                }
            });

            //判斷是否攢在相同批核人
            $scope.existSupervisor = function () {
                var supervisor_data = _.pluck($scope.loan_supervisors, 'supervisor');
                if ($scope.loan_supervisors.length != _.uniq(supervisor_data).length) {
                    topAlert.warning("存在相同的批核人");
                    $scope.isSupervisorSame = true;
                } else {
                    $scope.isSupervisorSame = false;
                }
            }
            //判斷是否攢在相同批核人
            /*$scope.existSupervisor = function() {
             if ($scope.loan_supervisors.length > 1) {
             $scope.supervisor_ids = _.pluck($scope.loan_supervisors, 'supervisor_id');
             //判斷是否有重複的批額人
             if ($scope.supervisor_ids.length != _.uniq($scope.supervisor_ids).length) {
             topAlert.warning("存在相同的批核人");
             $scope.isSupervisorSame = true;
             } else {
             $scope.isSupervisorSame = false;
             }
             }
             }*/

            //批核人電話
            /*$scope.supervisors_phoneNumbers = [];
             $scope.supervisorChange = function(_supervisor,$index){
             if(_supervisor){
             var phoneNumbers = _.findWhere($scope.supervisors,{id:_supervisor.supervisor_id});
             //判斷是否攢在相同批核人
             //$scope.existSupervisor();
             if(phoneNumbers){
             $scope.loan_supervisors[$index].supervisor = phoneNumbers.agent_contact_name;
             }else{
             $scope.loan_supervisors[$index].supervisor = "";
             }
             }else{
             $scope.loan_supervisors[$index].supervisor = "";
             }
             }*/


            //添加批額人
            $scope.add_supervisor = function () {
                $scope.existSupervisor();
                if ($scope.isSupervisorSame) {
                    return false;
                }
                if ($scope.loan_supervisors.length > 2) {
                    topAlert.warning("批核人不能超過3個");
                } else {
                    $scope.loan_supervisors.push({/*supervisor_id:"",*/supervisor: ""});
                }
            }

            $scope.remove_supervisor = function (index) {
                //$scope.supervisor_ids = _.without($scope.supervisor_ids,0,$scope.loan_supervisors[index].supervisor_id);
                $scope.isSupervisorSame = false;
                //$scope.existSupervisor();
                if ($scope.loan_supervisors.length <= 1) {
                    topAlert.warning("至少要有一個批核人");
                } else {
                    $scope.loan_supervisors.splice(index, 1);
                    //$scope.supervisors.splice(index,1);
                }
            }

            //下一步
            $scope.isDisabled = false;
            $scope.loan_confirm_markers = [];
            $scope.fundsTypes = [];

            $scope.freshBusinessSequence = function () {
                BusinessSequence.businessSequence({"table_name": 'Loan_Business'}).$promise.then(function (data) {
                    $scope.loan_confirm.loan_seqnumber = data.business_sequence;
                });
            }

            $scope.confirm = function () {

                //判断是否阅读完Order纸
                /*var _read_ids = _.uniq($scope.read_ids);
                 if($scope.agentOrders.length>0) {
                 if (_read_ids.length != $scope.agentOrders.length) {
                 topAlert.warning('請查閱完Order紙');
                 return;
                 }
                 }*/
                //判斷是否存在相同的批核人
                $scope.existSupervisor();
                if ($scope.isSupervisorSame) {
                    return false;
                }

                $scope.isDisabled = true;
                var loan_record = angular.copy($scope.loan);
                //判斷貸款時間有無修改
                if (angular.equals(getDate(loan_record.loan_time, true), getDate($scope.loan_time_copy, true))) {
                    loan_record.loan_time = "";
                } else {
                    loan_record.loan_time = getDate($scope.loan.loan_time, true);
                }

                //查询资金类型
//                if(loan_record.type==""){
//                    $scope.fundsTypes = agentFundType.query({agent_info_id:$scope.agent_info_id});
//                }else{
//                    $scope.fundsTypes = fundsTypes.query({priority:0});
//                }
                $scope.fundsTypes = fundsTypes.query({type: 2});//查询资金类型

                _.each($scope.loan_supervisors, function (data) {
                    loan_record.supervisors.push({supervisor: data.supervisor});
                });

                loan_record.agent_code = $scope.agent_code;
                loan_record.borrow_agent_code = $scope.borrow_agent_code;
                $scope.form_loan.checkValidity().then(function () {
                    if (_.every($scope.agentOrders, function (order) {
                            return order.read
                        })) {
                        loanBusiness.createMarker(loan_record).$promise.then(function (result) {
                            //查询批額
                            agentQuota.get({agent_info_id: $scope.agent_info_id}, {agent_quota: {quota: ""}})
                                .$promise.then(function (_agentQuotas) {
                                    if (_agentQuotas && _agentQuotas.message == '1016') {
                                        topAlert.warning("無法查詢外館簽額（網絡或rollex服務問題）");
                                    }
                                    $scope.agentQuotas = _agentQuotas;
                                });
                            $scope.loan_amount_copy = angular.copy(loan_record.loan_amount); //记录第一次贷款金额
                            $scope.loan_amount = loan_record.loan_amount;
                            $scope.loan_confirm = angular.copy(loan_record);

                            $scope.loan_confirm.loan_seqnumber = "";
                            //臨時注釋
                            $scope.freshBusinessSequence();
//                            $scope.loan_confirm = angular.copy(loan_record);
                            $scope.loan_confirm.calc_id = result.calc_id;
                            $scope.loan_confirm.hall_name = result.hall_name;
                            $scope.loan_confirm.loan_time = result.loan_time;
//                            $scope.fundsTypes = fundsTypes.query({type:2});//查询资金类型
                            //Markers信息
                            var markers = angular.copy(result.markers);
                            //構造Markers單結構
                            _.each(markers, function (marker) {
                                var marker_terms_content = [];
                                _.each(marker.marker_terms, function (_terms) {
                                    marker_terms_content.push({
                                        agent_code: _terms.agent_code,
                                        agent_info_id: _terms.agent_info_id,
                                        expired_add_days: _terms.expired_add_days.toString(),
                                        expired_rate: _terms.expired_rate.toString(),
                                        funds_type: _terms.funds_type,
                                        layer: _terms.layer,
                                        special_rate: _terms.special_rate.toString(),
                                        special_term: _terms.special_term.toString(),
                                        term: _terms.term.toString()
                                    });
                                });
                                $scope.loan_confirm_markers.push({
                                    "expired_rate": marker.expired_rate.toString(),
                                    "funds_type": marker.funds_type,
                                    "id": marker.id,
                                    "marker_amount": marker.marker_amount,
                                    "term": marker.term,
                                    "special_term": marker.special_term, //特別期限
                                    "special_rate": marker.special_rate,
                                    "expired_add_days": marker.expired_add_days, //罰款天數
                                    "markerTerms": marker_terms_content
                                });
                            });
                            $scope.loan_confirm_markers_copy = angular.copy($scope.loan_confirm_markers);

                            //得到層級關係
                            $scope.markerTerms_content = [];
                            if (markers[0]) {
                                _.each(markers[0].marker_terms, function (terms) {
                                    $scope.markerTerms_content.push({
                                        //"marker_term_id": "",
                                        "agent_info_id": terms.agent_info_id,
                                        "agent_code": terms.agent_code,
                                        "funds_type": "",
                                        "term": "",
                                        "expired_rate": "",
                                        "expired_add_days": "",
                                        "special_term": "",
                                        "special_rate": "",
                                        "layer": terms.layer
                                    })
                                })
                            }

                            $scope.is_confirm = true;
                            $scope.is_agentQuotas_show = true;
                            $scope.form_loan.clearErrors();

                            //返回的数据
                        }, function () {
                            $scope.isDisabled = false;
                        });
                    } else {
                        topAlert.warning('必須查閱全部的order紙才能執行下一步');
                        $scope.isDisabled = false;
                    }
                });
            }

            //修改貸款類型加載相應批額
            $scope.quota_array = [];
            $scope.quota_change = function (terms) {
                //查詢批額數據
                if ($scope.quota_array[terms.agent_info_id] && $scope.quota_array[terms.agent_info_id].length > 0) {
                    var quota_data = _.findWhere($scope.quota_array[terms.agent_info_id], {funds_type: terms.funds_type});
                    $scope.setingQuota(terms, quota_data);
                } else {
                    loanBusiness.agentQuotaSetting({agent_info_id: terms.agent_info_id}).$promise.then(function (quota) {
                        $scope.quota_array[terms.agent_info_id] = quota;
                        var quota_data = _.findWhere(quota, {funds_type: terms.funds_type});
                        $scope.setingQuota(terms, quota_data);
                    });
                }
            }

            /**
             * 賦值批額
             * @param terms 批額Obj
             * @param quota_data 批額數據
             */
            $scope.setingQuota = function (terms, quota_data) {
                if (quota_data) {
                    terms.term = quota_data.term,
                        terms.expired_rate = formatNumber(quota_data.expired_rate),
                        terms.special_term = quota_data.special_term, //特別期限
                        //terms.special_rate = formatNumber(quota_data.special_rate),
                        terms.special_rate = parseFloat(quota_data.special_rate),
                        terms.expired_add_days = quota_data.add_term //罰款天數
                } else {
                    terms.term = "",
                        terms.expired_rate = "",
                        terms.special_term = "", //特別期限
                        terms.special_rate = "",
                        terms.expired_add_days = "" //罰款天數
                }
            }

            //修改贷款单详细
            $scope.layer_marker = [];
            $scope.terms_obj = {}
            $scope.marker_detail = function (marker, index) {
                $scope.layer_marker = marker;
                $scope.marker_index = index;
                $scope.terms_obj = _.findWhere($scope.layer_marker.markerTerms, {layer: 1});
            }

            //監聽貸款人修改
            $scope.$watch('terms_obj', function (new_obj, old_obj) {
                if ($scope.terms_obj) {
                    $scope.layer_marker.amount = new_obj.marker_amount;
                    $scope.layer_marker.funds_type = new_obj.funds_type;
                    $scope.layer_marker.term = new_obj.term;
                    $scope.layer_marker.expired_rate = new_obj.expired_rate;
                    $scope.layer_marker.special_term = new_obj.special_term;
                    $scope.layer_marker.special_rate = new_obj.special_rate;
                    $scope.layer_marker.expired_add_days = new_obj.expired_add_days;
                }
            }, true);

            $scope.reset = function () {
                $scope.loan = angular.copy(init_loan);
                //$scope.loan.type="";
                $scope.borrower_id = "";
                $scope.agent_code = "";
                $scope.agent_info_id = "";
                $scope.agent_type = "";
                $scope.agentQuotas = [];
                $scope.agentOrders = [];
                $scope.borrowers = [];
                $scope.supervisors = [];
                $scope.loan_confirm_markers = [];
                $scope.loan_confirm_markers.markerTerms = [];
                $scope.form_loan.clearErrors();
            }

            //手動新增Markers單據
            $scope.add_marker = function () {
                if ($scope.loan_confirm_markers.length > 4) {
                    topAlert.warning("不能超過5條貸款單");
                    return;
                }
                var markerTerms_content = angular.copy($scope.markerTerms_content);
                $scope.loan_confirm_markers.push({
                    "funds_type": "",
                    "marker_amount": "",
                    "term": "",
                    "expired_rate": "",
                    "special_term": "", //特別期限
                    "special_rate": "",
                    "expired_add_days": "", //罰款天數
                    "markerTerms": markerTerms_content
                });
                $scope.marker_index = $scope.loan_confirm_markers.length;
                $scope.marker_detail($scope.loan_confirm_markers[$scope.loan_confirm_markers.length - 1]);
            }

            //Keyup計算新增的markert金額
            $scope.sumAmount = function () {
                var rolling_amount_sum = _.reduce($scope.loan_confirm_markers, function (memo, num) {
                    return memo + Number(num.marker_amount);
                }, 0);
                $scope.loan.loan_amount = rolling_amount_sum;
                $scope.loan_confirm.loan_amount = rolling_amount_sum;
            }

            $scope.remove_marker = function (index) {
                $scope.loan_confirm_markers.splice(index, 1);
                $scope.layer_marker = [];
                $scope.sumAmount();
            }

            //列印
            var init_print_record = {
                "loan_time": "",
                "loan_seqnumber": "",
                "agent_code": "",
                "agent_name": "",
                "borrower": "",
                "idcard_number": "",
                "idcard_name": "",
                "loan_amount": "",
                "remark": ""
            };
            $scope.print_record = angular.copy(init_print_record);
            $scope.print = function (flag) {

                $scope.loan_confirm_print = angular.copy($scope.loan_confirm);

                $scope.loan_confirm_print.loan_time = new Date(Date.parse($scope.loan_confirm_print.loan_time.replace(/-/g, "/")));
                $scope.print_record.loan_time = $filter('date')($scope.loan_confirm_print.loan_time, 'yyyy-MM-dd HH:mm');
                if (flag) {//列印
                    $scope.loan_confirm_print.loan_time = getDate($scope.loan_confirm_print.loan_time, true);
                    $scope.print_record_copy = angular.copy($scope.print_record);
                    if ($scope.print_record.idcard_name.split(',').length > 0) {
                        $scope.print_record_copy.idcard_name = $scope.print_record.idcard_name.split(',')[0];
                        $scope.print_record_copy.idcard_number = $scope.print_record.idcard_number.split(',')[0];
                    }
                    qzPrinter.print('PDFFakeLoanReceipt', printerType.stylusPrinter, $scope.print_record_copy).then(function () {
                        topAlert.success('假單列印成功');
                        $scope.last_print();
                        $scope.print_record = angular.copy(init_print_record);
                    });
                } else {//開啟列印

                    $scope.print_record = {
                        loan_time: $scope.loan_confirm_print.loan_time,
                        loan_seqnumber: $scope.loan_confirm_print.loan_seqnumber,
                        agent_code: $scope.agent_code,
                        agent_name: $scope.loan_confirm_print.agent_name,
                        borrower: $scope.loan_confirm_print.borrower,
                        idcard_number: "",
                        idcard_name: "",
                        hall_id: user.hall.id,
                        term: _.min($scope.loan_confirm_markers, function (mark) {
                            return mark.term
                        }).term,
                        //loan_amount: Number($scope.loan_confirm_print.loan_amount)*10000,
                        loan_amount: $scope.loan_confirm_print.loan_amount,
                        remark: $scope.print_record.remark ? $scope.print_record.remark : ""
                    };

                    var contact_init = {
                        agent_contact_name: $scope.loan_confirm_print.borrower,
//                        'refAgentContactTypes.agentInfo.agent_code':$scope.agent_code,
                        expand: "agentContactIdcards"
                    };

                    agentContact.query(contact_init).$promise.then(function (data) {
//                        $scope.idCards = ['身份證','通行證','護照','其他'];//按證件排序
                        if (data[0].agentContactIdcards.length > 1) {

                            if (_.findWhere(data[0].agentContactIdcards, {idcard_type_name: '身份證'})) {
                                $scope.print_record.idcard_name += (_.findWhere(data[0].agentContactIdcards, {idcard_type_name: '身份證'}).idcard_type_name + ",");
                                $scope.print_record.idcard_number += (_.findWhere(data[0].agentContactIdcards, {idcard_type_name: '身份證'}).idcard_number + ",");
                            }
                            if (_.findWhere(data[0].agentContactIdcards, {idcard_type_name: '通行證'})) {
                                $scope.print_record.idcard_name += (_.findWhere(data[0].agentContactIdcards, {idcard_type_name: '通行證'}).idcard_type_name + ",");
                                $scope.print_record.idcard_number += (_.findWhere(data[0].agentContactIdcards, {idcard_type_name: '通行證'}).idcard_number + ",");
                            }
                            if (_.findWhere(data[0].agentContactIdcards, {idcard_type_name: '護照'})) {
                                $scope.print_record.idcard_name += (_.findWhere(data[0].agentContactIdcards, {idcard_type_name: '護照'}).idcard_type_name + ",");
                                $scope.print_record.idcard_number += (_.findWhere(data[0].agentContactIdcards, {idcard_type_name: '護照'}).idcard_number + ",");
                            }
                            if (_.findWhere(data[0].agentContactIdcards, {idcard_type_name: '其他'})) {
                                $scope.print_record.idcard_name += (_.findWhere(data[0].agentContactIdcards, {idcard_type_name: '其他'}).idcard_type_name + ",");
                                $scope.print_record.idcard_number += (_.findWhere(data[0].agentContactIdcards, {idcard_type_name: '其他'}).idcard_number + ",");
                            }

//                                _.each(data[0].agentContactIdcards,function(ele,index){
//                                    $scope.print_record.idcard_name += (ele.idcard_type_name + ",");
//                                    $scope.print_record.idcard_number += (ele.idcard_number + ",");
//                                });

                            $scope.print_record.idcard_name = $scope.print_record.idcard_name.substring(0, $scope.print_record.idcard_name.length - 1);
                            $scope.print_record.idcard_number = $scope.print_record.idcard_number.substring(0, $scope.print_record.idcard_number.length - 1);
                        } else {
                            $scope.print_record.idcard_name = data[0].agentContactIdcards[0].idcard_type_name;
                            $scope.print_record.idcard_number = data[0].agentContactIdcards[0].idcard_number;
                        }
                    });

                    $scope.isPrintFlag = true;
                }
            };

            $scope.last_print = function () {
                $scope.isPrintFlag = false;
            };

            //確認生成貸款
            $scope.submit = function (is_print) {
                if ($scope.confirmIsDisabled) {
                    return false;
                }
                $scope.confirmIsDisabled = true;
                if (Number($scope.loan.loan_amount) != Number($scope.loan_amount_copy)) {
                    topAlert.warning("修改的貸款金額不等於原始貸款金額" + $scope.loan_amount_copy + "萬！請返回重新生成");
                    $scope.confirmIsDisabled = false;
                    return false;
                }

                //判断是否修改过Markers
                $scope.is_modifed = 0;
                if (Number($scope.loan_amount) != Number($scope.loan_confirm.loan_amount)) {
                    $scope.is_modifed = 1;
                } else {
                    if ($scope.loan_confirm_markers.length == $scope.loan_confirm_markers_copy.length) {
                        //clone
                        _.each($scope.loan_confirm_markers_copy, function (marker, index) {
                            if (Number($scope.loan_confirm_markers[index].marker_amount) != Number(marker.marker_amount)) {
                                $scope.is_modifed = 1; // return true is 0 未改动
                                return false;
                            } else if (!angular.equals($scope.loan_confirm_markers[index].markerTerms, marker.markerTerms)) {
                                $scope.is_modifed = 1; // return true is 0 未改动
                                return false;
                            }
                        });
                    } else {
                        $scope.is_modifed = 1;
                    }
                }

                var create_record = $scope.loan_confirm;
                var markers_data = [];
                _.each($scope.loan_confirm_markers, function (marker) {
                    var terms_content = [];
                    _.each(marker.markerTerms, function (term) {
                        terms_content.push({
                            "agent_info_id": term.agent_info_id,
                            "funds_type": term.funds_type,
                            "term": term.term,
                            "expired_rate": term.expired_rate,
                            "expired_add_days": term.expired_add_days,
                            "special_term": term.special_term,
                            "special_rate": term.special_rate
                        });
                    });
                    markers_data.push({
                        "marker_id": marker.marker_id,
                        "marker_amount": marker.marker_amount,
                        "marker_terms": terms_content
                    });
                });

                //計算貸款總額
                /*var rolling_amount_sum = _.reduce($scope.loan_confirm_markers, function(memo, num){
                 return memo + Number(num.marker_amount);
                 }, 0);
                 create_record.loan_amount = rolling_amount_sum;*/

                create_record.is_modifed = $scope.is_modifed;
                create_record.markers = markers_data;

                $scope.marker_term_url = globalFunction.getApiUrl('loan/loanbusiness/confirm-loan');
                $scope.marker_term_form.checkValidity().then(function () {
                    loanBusiness.confirmLoan(create_record).$promise.then(function (result) {

                        if (result.id) {
                            if (is_print) {
                                qzPrinter.print('PDFLoanReceipt', printerType.stylusPrinter, {'loan_id': result.id}).then(function () {
                                    topAlert.success('列印成功');
//                                    $location.path('loan/create-result/' + result.id);
                                    $scope.confirmIsDisabled = false;
                                }, function (msg) {
//                                    $location.path('loan/create-result/' + result.id);
                                    $scope.confirmIsDisabled = false;
                                })
                            } else {
//                                $location.path('loan/create-result/' + result.id);
                                $scope.confirmIsDisabled = false;
                            }
                            if (result.telNumberModelList.length == 0) {
                                $location.path('loan/create-result/' + result.id);
                            } else {
                                $scope.SMSsend(result);
                            }
                        } else {
                            topAlert.warning("貸款批額發生變化，請重新提交");
                            $scope.confirmIsDisabled = false;
                        }

                    }, function () {
                        $scope.confirmIsDisabled = false;
                    });
                });

            }

            $scope.return = function () {
                //更新签额
                agentQuota.get({agent_info_id: $scope.agent_info_id}, {
                    agent_quota: {
                        usedQuota: {},
                        quota: {quotaSetting: ""}
                    }
                })
                    .$promise.then(function (_agentQuotas) {
                        if (_agentQuotas && _agentQuotas.message == '1016') {
                            topAlert.warning("無法查詢外館簽額（網絡或rollex服務問題）");
                            $scope.agentQuotas = _agentQuotas;
                        }
                    });
                $scope.is_confirm = false;
                $scope.is_agentQuotas_show = false;
                $scope.isDisabled = false;
                //$scope.loan_confirm = [];
                $scope.loan_confirm_markers = [];
                $scope.layer_marker = [];
                $scope.loan_confirm = angular.copy(init_loan);
                $scope.print_record = angular.copy(init_print_record);
                $scope.marker_term_form.clearErrors();

            }

            $scope.lockCreated = function () {
                $scope.is_lock = !$scope.is_lock;
            }

            //即時轉碼
            if ($stateParams.agent_code) {
                $scope.agent_code = $stateParams.agent_code;
            }

            //新增存單之後手動發短信
            $scope.SMSsend = function (data) {
                console.log(data);
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/loan/loan-create-sms.html",
                    controller: 'loanCreateSmsCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        },
                        agent_name: function () {
                            return $scope.loan_confirm.agent_name;
                        }
                    }
                });
                modalInstance.result.then((function (status) {
                    $location.path('loan/create-result/' + data.id);
                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }

        }
    ]).controller('loanRepaymentCreateSmsCtrl', ['$scope', 'SimplizedorFt', '$modal', '$location', 'loanBusiness', 'topAlert', 'data', '$modalInstance', 'agent_code', 'agent_name', 'repayment',
        function ($scope, SimplizedorFt, $modal, $location, loanBusiness, topAlert, data, $modalInstance, agent_code, agent_name, repayment) {
            $scope.title = "還款短信"
            $scope.isReadonly = true;
            $scope.sms = {
                agent_code: data.repaymentSmsAgentTelModelList[0].agentCode,
                agent_name: data.repaymentSmsAgentTelModelList[0].agentContactName,
                content: data.smsBodyModelList ? _.findWhere(data.smsBodyModelList, {type: "12"}).content : "",
                phoneNumber: data.repaymentSmsAgentTelModelList
            }

            $scope.send_sms = {//要發送的號碼群組
                pin_code: "",
                smsBodyModelList: data.smsBodyModelList ? _.where(data.smsBodyModelList, {type: "12"}) : ""
            }
            var flag = true, agentId_start = data.smsBodyModelList[0].agentId, agentId_start_index = 0;
            console.log(agentId_start)
            _.each($scope.send_sms.smsBodyModelList, function (d) {
                if (agentId_start == d.agentId) {
                    agentId_start_index += 1;
                    flag = true;
                } else {
                    flag = false;
                }
            });
            //定義一個新的變量存儲修改後的短信
            $scope.sms_content = $scope.sms.content;
            //監控是否修改短信的內容
            $scope.$watch("sms.content", function (new_value) {
                if (new_value) {
                    $scope.sms_content = $scope.sms.content;
                    _.each($scope.send_sms.smsBodyModelList, function (d, index) {
                        if (flag) {
                            d.content = $scope.sms_content;
                        } else {
                            if (index < agentId_start_index) {
                                $scope.send_sms.smsBodyModelList[index].content = $scope.sms_content;
                            }
                        }
                    });
                }

            });
            /*storm end*/
            $scope.isActive = true;
            $scope.isActive1 = false;
            $scope.changeAt = function (con, flag) {
                $scope.isActive = flag;
                $scope.isActive1 = !flag;
                $scope.sms.content = SimplizedorFt(con, flag);
                _.each($scope.send_sms.smsBodyModelList, function (val) {
                    val.content = SimplizedorFt(val.content, flag)
                });
            }
            /*storm end*/
            $scope.sendSms = function () {
                console.log($scope.send_sms.smsBodyModelList)
                $scope.disabled_submit=true;
                $scope.form_loan_sms.checkValidity().then(function () {
                    loanBusiness.loanSendSms($scope.send_sms, function () {
                        topAlert.success("還款短信發送成功！");
                        $scope.disabled_submit = false;
                        if (repayment.repayment_type == 1 || repayment.repayment_type == 4) {
                            $scope.SMSsend(data);
                        }
                        $modalInstance.dismiss();
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                });
            }

            //新增存單之後手動發短信
            $scope.SMSsend = function (data) {
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/loan/loan-create-sms.html",
                    controller: 'loanCardCreateSmsCtrl',
                    resolve: {
                        data: function () {
                            return data ? data : "";
                        },
                        agent_name: function () {
                            return agent_name;
                        },
                        agent_code: function () {
                            return agent_code;
                        },
                        repayment: function () {
                            return repayment;
                        }
                    }
                });
                modalInstance.result.then((function (status) {

                }), function () {
                    $log.info("Modal dismissed at: " + new Date());
                });
            }
            $scope.close = function () {
                $modalInstance.dismiss();
            }
        }]).controller('loanCardCreateSmsCtrl', ['$scope', '$location', 'SimplizedorFt', 'loanBusiness', 'topAlert', 'data', '$modalInstance', 'agent_code', 'agent_name', 'repayment',
        function ($scope, $location, SimplizedorFt, loanBusiness, topAlert, data, $modalInstance, agent_code, agent_name, repayment) {
            $scope.title = repayment.repayment_type == '1' ? "存卡取款短信" : "存單取款短信";
            $scope.isReadonly = true;
            $scope.sms = {
                agent_code: agent_code,
                agent_name: agent_name,
                content: data.smsBodyModelList ? data.smsBodyModelList[0].content : "",
                phoneNumber: repayment.repayment_type == '1' ? data.depositCardSmsAgentTelModelList : data.depositTicketSmsAgentTelModelList
            }
            $scope.send_sms = {
                pin_code: "",
                smsBodyModelList: data.smsBodyModelList && repayment.repayment_type == '1' ? _.where(data.smsBodyModelList, {type: "22"}) : _.where(data.smsBodyModelList, {type: "32"})
            }
            //建一個變量監控是否修改了短信內容
            $scope.sms_content = $scope.sms.content;
            $scope.$watch("sms.content", function (new_value) {
                if (new_value) {
                    $scope.sms_content = $scope.sms.content;
                }
                _.each($scope.send_sms.smsBodyModelList, function (d) {
                    d.content = $scope.sms_content;
                })
            });
            /*storm end*/
            $scope.isActive = true;
            $scope.isActive1 = false;
            $scope.changeAt = function (con, flag) {
                $scope.isActive = flag;
                $scope.isActive1 = !flag;
                $scope.sms.content = SimplizedorFt(con, flag);
                _.each($scope.send_sms.smsBodyModelList, function (val) {
                    val.content = SimplizedorFt(val.content, flag)
                });
            }
            /*storm end*/
            $scope.sendSms = function () {
                console.log($scope.send_sms);
                $scope.disabled_submit=true;
                $scope.form_loan_sms.checkValidity().then(function () {
                    loanBusiness.loanSendSms($scope.send_sms, function () {
                        topAlert.success("還款短信發送成功！");
                        $scope.disabled_submit = false;
                        $modalInstance.close();
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                });
            }

            $scope.close = function () {
                $modalInstance.dismiss();
            }
        }]).controller('loanCreateSmsCtrl', ['$scope', 'SimplizedorFt', '$location', 'loanBusiness', 'topAlert', 'data', '$modalInstance', 'agent_name',
        function ($scope, SimplizedorFt, $location, loanBusiness, topAlert, data, $modalInstance, agent_name) {
            console.log(data);
            $scope.isReadonly = true;
            $scope.sms = {
                agent_code: data.agent_code,
                agent_name: agent_name,
                content: data.loanSmsBodyModelList ? data.loanSmsBodyModelList[0].content : "",
                phoneNumber: data.telNumberModelList
            }
            $scope.send_sms = {
                pin_code: "",
                smsBodyModelList: data.loanSmsBodyModelList
            }


            //建一個變量監控是否修改了短信內容
            $scope.sms_content = $scope.sms.content;

            var flag = true, agentId_start = data.loanSmsBodyModelList ? data.loanSmsBodyModelList[0].agentId : "", agentId_start_index = 0;
            _.each($scope.send_sms.smsBodyModelList, function (d) {
                if (agentId_start == d.agentId) {
                    agentId_start_index += 1;
                    flag = true;
                } else {
                    flag = false;
                }
            });
            //定義一個新的變量存儲修改後的短信
            $scope.sms_content = $scope.sms.content;
            //監控是否修改短信的內容
            $scope.$watch("sms.content", function (new_value) {
                if (new_value) {
                    $scope.sms_content = $scope.sms.content;
                    _.each($scope.send_sms.smsBodyModelList, function (d, index) {
                        if (flag) {
                            d.content = $scope.sms_content;
                        } else {
                            if (index < agentId_start_index) {
                                $scope.send_sms.smsBodyModelList[index].content = $scope.sms_content;
                            }
                        }
                    });
                }

            });
            /*storm end*/
            $scope.isActive = true;
            $scope.isActive1 = false;
            $scope.changeAt = function (con, flag) {
                $scope.isActive = flag;
                $scope.isActive1 = !flag;
                $scope.sms.content = SimplizedorFt(con, flag);
                _.each($scope.send_sms.smsBodyModelList, function (val) {
                    val.content = SimplizedorFt(val.content, flag)
                });
            }
            /*storm end*/
            $scope.sendSms = function () {
                console.log($scope.send_sms.smsBodyModelList)
                $scope.disabled_submit=true;
                $scope.form_loan_sms.checkValidity().then(function () {
                    loanBusiness.loanSendSms($scope.send_sms, function () {
                        topAlert.success("新增貸款短信發送成功！");
                        $scope.disabled_submit = false;
                        $location.path('loan/create-result/' + data.id);
                        $modalInstance.close();
                    }, function () {
                        $scope.disabled_submit = false;
                    });
                });
            }

            $scope.close = function () {
                $modalInstance.dismiss();
                $location.path('loan/create-result/' + data.id);
            }
        }]).controller('loanUpdateCtrl', [
        '$scope', '$filter', 'globalFunction', '$stateParams', 'getDate', '$window', '$location', 'topAlert', 'breadcrumb', 'loanBusiness', 'agentsLists', 'agentQuota', 'agentOrders', 'agentType', 'specialCodeTypes', 'specialCodeTypesTrans', 'windowItems', 'fundsTypes', 'tmsPagination', 'agentFundType', 'quotaSetting', 'formatNumber',
        function ($scope, $filter, globalFunction, $stateParams, getDate, $window, $location, topAlert, breadcrumb, loanBusiness, agentsLists, agentQuota, agentOrders, agentType, specialCodeTypes, specialCodeTypesTrans, windowItems, fundsTypes, tmsPagination, agentFundType, quotaSetting, formatNumber) {

            $scope.agentType = agentType.items;
            //批额备注
            $scope.quotaRemarks = "";
            //特別碼
            $scope.specialCodeTypes = specialCodeTypes;
            $scope.specialCodeTypesTrans = specialCodeTypesTrans.items;
            $scope.is_lock = true;

            //修改貸款信息
            breadcrumb.items = [
                {"name": "貸款管理", "url": "/loan/list"},
                {"name": "貸款單詳細", "url": "/loan/detail/" + $stateParams.loan_id},
                {"name": "修改貸款單", "active": true}
            ];

            $scope.sub_method = "PUT";
            $scope.title = '修改貸款';
            $scope.is_confirm = true;  //禁止輸入

            /*$scope.pagination = tmsPagination.create();
             $scope.pagination.resource = agentOrders;
             $scope.select = function(page){
             $scope.agentOrders = $scope.pagination.select(page, {agent_info_id: $scope.agent_info_id});
             }*/

            //$scope.is_special = true;
            $scope.isDesbled = false;
            $scope.settlement_amount_copy = ""; //原始貸款金額
            $scope.type_name = "";
            $scope.loanEditSetting = function () {
                loanBusiness.get(globalFunction.generateUrlParams({id: $stateParams.loan_id}, {
                    markers: {markerTerms: ""},
                    loanSupervisors: {}
                })).$promise.then(function (loan) {

                        //借款人
                        loanBusiness.borrowers({agent_info_id: loan.agent_info_id, sort: 'agent_contact_name asc'})
                            .$promise.then(function (_borrowers) {
                                $scope.borrowers = _.sortBy(_borrowers, function (stooge) {
                                    return stooge.agent_contact_name;
                                })
                            });

                        loan.loan_time = new Date(Date.parse(loan.loan_time.replace(/-/g, "/")));
                        $scope.loan = loan;
                        $scope.is_special = loan.is_special;
                        $scope.type_name = loan.is_special == 0 ? "普通貸款" : "昇紅或道具";
                        //$scope.type = loan.is_special == 0 ? "" : 2;

                        $scope.loan.type = loan.is_special == 0 ? "" : "INCREASE";
                        $scope.isDesbled = loan.hall_type == 3 && loan.type == 'INCREASE' ? true : false;

//                    if($scope.loan.type==""){
//                        agentFundType.query({agent_info_id:loan.agent_info_id}).$promise.then(function(fundsTypes){
//                            $scope.fundsTypes = fundsTypes;
//                        });
//                    }else{
//                        fundsTypes.query({priority:0}).$promise.then(function(fundsTypes){
//                            $scope.fundsTypes = fundsTypes;
//                        });
//                    }

                        fundsTypes.query({type: 2}).$promise.then(function (fundsTypes) {
                            $scope.fundsTypes = fundsTypes;
                        });


                        var markers_content = [];
                        $scope.loan.settlement_amount = 0;
                        _.each(loan.markers, function (marker) {
                            $scope.loan.settlement_amount += Number(marker.settlement_amount * 10000);
                            markers_content.push({
                                "marker_id": marker.id,
                                "status": marker.status,
                                "marker_amount": marker.marker_amount,
                                "settlement_amount": formatNumber(marker.settlement_amount),
                                "funds_type": marker.funds_type,
                                "term": marker.term,
                                "expired_rate": marker.expired_rate,
                                "expired_add_days": marker.expired_add_days,
                                "special_term": marker.special_term,
                                "special_rate": marker.special_rate,
                                "markerTerms": marker.markerTerms
                            });
                        });
                        $scope.loan.settlement_amount = formatNumber($scope.loan.settlement_amount / 10000);
                        //記錄原始貸款金額
                        $scope.settlement_amount_copy = angular.copy(loan.settlement_amount);
                        $scope.loan_amount_copy = angular.copy(loan.loan_amount);

                        //得到層級關係
                        $scope.markerTerms_content = [];
                        if (loan.markers[0]) {
                            _.each(loan.markers[0].markerTerms, function (terms) {
                                /* agentFundType.query({id: terms.agent_info_id}).$promise.then(function(agent){
                                 if(agent){
                                 quotaSettingsCommon.get({quota_id:agent.quota_id}).$promise.then(function(fundsTypes){
                                 $scope.fundsTypes = fundsTypes;
                                 });
                                 }
                                 });*/
                                $scope.markerTerms_content.push({
                                    "agent_info_id": terms.agent_info_id,
                                    "agent_code": terms.agent_code,
                                    "funds_type_remark": terms.funds_type_remark,
                                    "funds_type": "",
                                    "term": "",
                                    "expired_rate": "",
                                    "expired_add_days": "",
                                    "special_term": "",
                                    "special_rate": "",
                                    "layer": terms.layer
                                })
                            })
                        }

                        $scope.loan_time_copy = angular.copy(loan.loan_time);
                        $scope.loan_record = {
                            "id": loan.id,
                            "borrower": loan.borrower,
                            "agent_contact_id": loan.agent_contact_id,
                            "loan_amount": loan.loan_amount,
                            "loan_record": loan.settlement_amount,
                            "loan_time": loan.loan_time,
                            "remark": loan.remark ? loan.remark : "",
                            "markers": markers_content
                        }

                        agentsLists.get(globalFunction.generateUrlParams({id: loan.agent_info_id}, {
                            borrowers: {},
                            quotaRemarks: {}
                        })).$promise.then(function (selected_agent) {
                                if (selected_agent) {

                                    $scope.agent_info_id = selected_agent.id;
                                    //$scope.have_overdue_loan = true;
                                    $scope.loan.agent_name = selected_agent.agent_name;
                                    $scope.agent_type = $scope.agentType[selected_agent.type];
                                    $scope.quotaRemarks = selected_agent.quotaRemarks.length > 0 ? selected_agent.quotaRemarks[0].content : "";

                                    //借款人
                                    //$scope.borrowers = loanBusiness.borrowers(globalFunction.generateUrlParams({agent_info_id: selected_agent.id}));
                                    //查询批額
                                    //$scope.agentQuotas = agentQuota.get({agent_info_id: selected_agent.id}, {agent_quota: {usedQuota: ""}});
                                    //查詢Order紙
                                    //$scope.agentOrders = agentOrders.agentOrderLists(globalFunction.generateUrlParams({agent_info_id: selected_agent.id,module_code:'NEW_LOAN'}));
                                    //$scope.pagination.query_method = "agentOrderLists";
                                }
                            });
                    });
            }

            $scope.loanEditSetting();

            $scope.agent_contact_name = "";
            $scope.contactName_select = function () {
                var borrowers_data = _.findWhere($scope.borrowers, {agent_contact_id: $scope.loan_record.agent_contact_id});
                if (borrowers_data)
                    $scope.loan_record.borrower = borrowers_data.agent_contact_name;
            }

            //批核人電話
            /*$scope.borrowers_phoneNumbers = {};
             $scope.$watch('borrower_id',function(new_value,old_value){
             if(new_value){
             $scope.borrowers_phoneNumbers = _.findWhere($scope.borrowers,{agent_contact_id:new_value});
             $scope.loan.borrower = $scope.borrowers_phoneNumbers.agent_contact_name;
             $scope.loan.ref_agent_contact_type_id = $scope.borrowers_phoneNumbers.id;
             }else{
             $scope.loan.ref_agent_contact_type_id = "";
             }
             });*/

            //特別碼修改賦值
            $scope.specialCode_change = function () {
                if ($scope.loan.type == "") //普通
                    $scope.is_special = 0;
                else if ($scope.loan.type == 'INCREASE') //工作碼
                    $scope.is_special = 1;
            }

            //修改貸款類型加載相應批額
            $scope.quota_array = [];
            $scope.quota_change = function (terms) {
                //查詢批額數據
                if ($scope.quota_array[terms.agent_info_id] && $scope.quota_array[terms.agent_info_id].length > 0) {
                    var quota_data = _.findWhere($scope.quota_array[terms.agent_info_id], {funds_type: terms.funds_type});
                    $scope.setingQuota(terms, quota_data);
                } else {
                    loanBusiness.agentQuotaSetting({agent_info_id: terms.agent_info_id}).$promise.then(function (quota) {
                        $scope.quota_array[terms.agent_info_id] = quota;
                        var quota_data = _.findWhere(quota, {funds_type: terms.funds_type});
                        $scope.setingQuota(terms, quota_data);
                    });
                }
            }

            /**
             * 賦值批額
             * @param terms 批額Obj
             * @param quota_data 批額數據
             */
            $scope.setingQuota = function (terms, quota_data) {
                if (quota_data) {
                    terms.term = quota_data.term,
                        terms.expired_rate = formatNumber(quota_data.expired_rate),
                        terms.special_term = quota_data.special_term, //特別期限
                        //terms.special_rate = formatNumber(quota_data.special_rate),
                        terms.special_rate = parseFloat(quota_data.special_rate),
                        terms.expired_add_days = quota_data.add_term //罰款天數
                } else {
                    terms.term = "",
                        terms.expired_rate = "",
                        terms.special_term = "", //特別期限
                        terms.special_rate = "",
                        terms.expired_add_days = "" //罰款天數
                }
            }

            //查詢資金類型
            $scope.changeFundType = function (new_value) {
                if (new_value == "") {
                    $scope.fundsTypes = agentFundType.query({agent_info_id: $scope.agent_info_id});
                } else {
                    $scope.fundsTypes = fundsTypes.query({priority: 0});
                }
            }

            //手動新增Markers單據
            $scope.add_marker = function () {
                if ($scope.loan_record.length > 4) {
                    topAlert.warning("不能超過5條貸款單");
                    return;
                }
                var markerTerms_content = angular.copy($scope.markerTerms_content);
                $scope.loan_record.markers.push({
                    "marker_id": "",
                    "funds_type": "",
                    "marker_amount": "",
                    "settlement_amount": "",
                    "term": "",
                    "expired_rate": "",
                    "special_term": "", //特別期限
                    "special_rate": "",
                    "expired_add_days": "", //罰款天數
                    "markerTerms": markerTerms_content,
                    "interest_type": ""
                });

                $scope.marker_index = $scope.loan_record.markers.length;
                $scope.marker_detail($scope.loan_record.markers[$scope.loan_record.markers.length - 1]);
            }

            //Keyup計算新增的markert金額
            $scope.sumAmount = function (marker) {
                var rolling_amount_sum = _.reduce($scope.loan_record.markers, function (memo, num) {
                    return memo + Number(num.settlement_amount * 10000);
                }, 0);
                $scope.loan.settlement_amount = rolling_amount_sum / 10000;

                /*if($scope.loan.status==1){//未還
                 marker.marker_amount = marker.settlement_amount;
                 }else{//已還或已還部分
                 if(marker.marker_id){ //存在的數據
                 var new_marker_data = _.where($scope.loan_record.markers,{marker_id:""});
                 var new_amount_sum = _.reduce(new_marker_data, function(memo, num){
                 return memo + Number(num.settlement_amount);
                 }, 0);
                 marker.marker_amount = Number($scope.loan_amount_copy)-Number(new_amount_sum);
                 }else{ //新增數據
                 marker.marker_amount = marker.settlement_amount;
                 }
                 }*/
            }

            $scope.remove_marker = function (marker, index) {
                $scope.loan_record.markers.splice(index, 1);
                $scope.layer_marker = [];
                $scope.sumAmount(marker);
            }

            //修改贷款单详细
            $scope.layer_marker = [];
            $scope.terms_obj = {}
            $scope.marker_detail = function (marker, index) {
                $scope.layer_marker = marker;
                _.each($scope.layer_marker.markerTerms, function (markerTerm) {
                    markerTerm.expired_rate = formatNumber(markerTerm.expired_rate);
                    // markerTerm.special_rate = formatNumber(markerTerm.special_rate);
                    markerTerm.special_rate = parseFloat(markerTerm.special_rate);
                })
                $scope.marker_index = index;
                $scope.terms_obj = _.findWhere($scope.layer_marker.markerTerms, {layer: "1"});
                $scope.terms_obj.expired_rate = formatNumber(marker.expired_rate);
                // $scope.terms_obj.special_rate = formatNumber(marker.special_rate);
                $scope.terms_obj.special_rate = parseFloat(marker.special_rate);
            }

            //監聽貸款人修改
            $scope.$watch('terms_obj', function (new_obj, old_obj) {
                if ($scope.terms_obj) {
                    //new_obj.marker_amount = new_obj.settlement_amount;
                    $scope.layer_marker.amount = new_obj.settlement_amount;
                    $scope.layer_marker.funds_type = new_obj.funds_type;
                    $scope.layer_marker.term = new_obj.term;
                    $scope.layer_marker.expired_rate = new_obj.expired_rate;
                    $scope.layer_marker.special_term = new_obj.special_term;
                    $scope.layer_marker.special_rate = new_obj.special_rate;
                    $scope.layer_marker.expired_add_days = new_obj.expired_add_days;
                }
            }, true);

            $scope.return = function () {
                $scope.loanEditSetting();
                $scope.is_lock = true;
                $scope.layer_marker = [];
            }

            //通过贷款类型查询相应天期
            /*$scope.selectLoanType = function(type,record){
             /*var funds_type_data = _.where($scope.fundsTypes,{funds_name:type})
             }*/

            //確認生成貸款
            $scope.submit = function () {
                if (Number($scope.loan.settlement_amount.toString().replace(/,/g, '')) != Number($scope.settlement_amount_copy.toString().replace(/,/g, ''))) {
                    topAlert.warning("修改的貸款金額不等於原始貸款金額" + $scope.settlement_amount_copy + "萬！");
                    return false;
                }
                if ($scope.confirmIsDisabled) {
                    return false;
                }
                $scope.confirmIsDisabled = true;
                //$scope.loan.loan_time = getDate($scope.loan.loan_time,true);
                var record = angular.copy($scope.loan_record);

                var markers_data = [];

                _.each(record.markers, function (marker) {
                    var terms_content = [];
                    _.each(marker.markerTerms, function (term) {
                        terms_content.push({
                            "agent_info_id": term.agent_info_id,
                            "funds_type_remark": term.funds_type_remark,
                            "funds_type": term.funds_type,
                            "term": term.term,
                            "expired_rate": term.expired_rate,
                            "expired_add_days": term.expired_add_days,
                            "special_term": term.special_term,
                            "special_rate": term.special_rate,
                            "interest_type": term.interest_type
                        });
                    });
                    if (marker.status == 1) {//未還
                        marker.marker_amount = marker.settlement_amount.toString().replace(/,/g, '');
                    } else {//已還或已還部分
                        if (marker.marker_id) { //存在的數據
                            var new_marker_data = _.where(record.markers, {marker_id: ""});
                            var new_amount_sum = _.reduce(new_marker_data, function (memo, num) {
                                return memo + Number(num.settlement_amount.toString().replace(/,/g, ''));
                            }, 0);
                            marker.marker_amount = Number(marker.marker_amount.toString().replace(/,/g, '')) - Number(new_amount_sum);
                        } else { //新增數據
                            marker.marker_amount = marker.settlement_amount.toString().replace(/,/g, '');
                        }
                    }

                    markers_data.push({
                        "marker_id": marker.marker_id,
                        "marker_amount": marker.marker_amount.toString(),
                        "settlement_amount": marker.settlement_amount.toString().replace(/,/g, ''),
                        "terms": terms_content
                    });
                });

                var create_record = {
                    "id": record.id,
                    "loan_time": "",
                    "is_special": $scope.is_special,
                    "remark": record.remark,
                    "agent_contact_id": record.agent_contact_id,
                    "borrower": record.borrower,
                    "markers": markers_data,
                    "pin_code": record.pin_code
                }
                if (angular.equals(getDate(record.loan_time, true), getDate($scope.loan_time_copy, true))) {
                    create_record.loan_time = "";
                } else {
                    create_record.loan_time = getDate($scope.loan.loan_time, true);
                }
                //create_record.loan_time = getDate(create_record.loan_time,true);
                //return false;
                $scope.marker_term_url = globalFunction.getApiUrl('loan/loanbusiness');
                $scope.marker_term_form.checkValidity().then(function () {
                    loanBusiness.update(create_record).$promise.then(function (result) {
                        topAlert.success("貸款單修改成功")
                        $location.path('loan/list');
                        //$window.history.go(-2);
                        $scope.confirmIsDisabled = false;
                    }, function () {
                        $scope.confirmIsDisabled = false;
                    });
                });
            }

            $scope.lockCreated = function () {
                $scope.is_lock = !$scope.is_lock;
            }


        }]).controller('loanDeleteCtrl', [
        '$scope', '$location', '$modalInstance', function ($scope, $location, $modalInstance) {
            $scope.submit = function () {
                $modalInstance.close();
                $location.path('loan/list');
            }
            $scope.cancel = function () {
                $modalInstance.close();
            }
        }
    ]).controller('loanCreateResultCtrl', [
        '$scope', '$location', '$modal', 'breadcrumb', '$state', '$stateParams', 'globalFunction', 'loanBusiness', 'specialCodeTypesTrans', 'agentsLists', 'agentType', 'markerTerm',
        function ($scope, $location, $modal, breadcrumb, $state, $stateParams, globalFunction, loanBusiness, specialCodeTypesTrans, agentsLists, agentType, markerTerm) {
            breadcrumb.items = [
                {"name": "貸款管理", "url": "/loan/list"},
                {"name": "新增貸款", "url": "/loan/create"},
                {"name": "貸款結果", active: true}
            ];
            $scope.is_show = false;
            if ($state.current.previousUrl == '/deposit/ticket-manager') {
                $scope.is_show = true;
            }

            $scope.specialCodeTypesTrans = specialCodeTypesTrans.items;
            $scope.agentType = agentType.items;
            if ($stateParams.id) {
                $scope.loan_id = $stateParams.id;
                //查询业务单
//                globalFunction.generateUrlParams
                loanBusiness.get(globalFunction.generateUrlParams({id: $scope.loan_id}, {
                    markers: {},
                    loanSupervisors: {}
                })).$promise.then(function (loan) {
                        $scope.loan = loan;
                        $scope.loan.quotaRemarks = "";
                        agentsLists.get(globalFunction.generateUrlParams({id: loan.agent_info_id}, {quotaRemarks: {}})).$promise.then(function (agent) {
                            if (agent) {
                                $scope.loan.agent_type = $scope.agentType[agent.type];
                                $scope.loan.quotaRemarks = agent.quotaRemarks.length > 0 ? agent.quotaRemarks[0].content : "";
                            }
                        });
                    });
            }

            //貸款單詳細
            $scope.markerTerms = [];
            $scope.markerDetail = function (marker_id) {
                $scope.markerTerms = markerTerm.query(globalFunction.generateUrlParams({
                    marker_id: marker_id,
                    sort: 'layer desc'
                }));
            }

            /*$scope.loan = newLoan.data;
             $scope.sms = $scope.loan.agent_code + "戶口已成功貸款"+$scope.loan.loan_amount+"萬,業務單號 " + $scope.loan.loan_seqnumber;
             $scope.editSms = function (sms_data){
             var modalInstance;
             modalInstance = $modal.open({
             templateUrl: "views/loan/loan-edit-sms.html",
             controller: 'loanEditSmsCtrl',
             resolve: {
             loan_data: function() {
             return $scope.loan;
             },
             sms_content:function(){
             return $scope.sms;
             }
             }
             });
             modalInstance.result.then(function(sms){
             $scope.sms = sms;
             })
             };*/

            $scope.goto_list = function () {
                $location.path('loan/list');
            }

            $scope.rolling = function (marker_seqnumber) {
                $location.path('/rolling/rolling/' + $scope.loan.agent_code + "/" + marker_seqnumber);
            }
        }
    ]).controller('repaymentListCtrl', [
        '$scope', 'payment', function ($scope, payment) {
            //init data
            payment.query().$promise.then(function (payments) {
                $scope.all_payments = payments;
                $scope.payments = page.select(1, payments);
            })

            //pagination
            $scope.select = function (current_page) {
                $scope.payments = page.select(current_page, $scope.all_payments);
            }

            $scope.search = function () {
                alert($scope.condition.created_min);
            }

            $scope.today = function () {
                $scope.dt = new Date();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.dt = null;
            };

            // Disable weekend selection
            $scope.disabled = function (date, mode) {
                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            };

            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

        }
    ]).controller('overdueChargeListCtrl', [
        '$scope', '$modal', 'breadcrumb', '$location', '$stateParams', 'globalFunction', 'tmsPagination', 'markerFee', 'agentsLists', 'hallName', 'markerStatus', 'feeTypes', '$filter', 'user', 'currentShift', 'topAlert',
        function ($scope, $modal, breadcrumb, $location, $stateParams, globalFunction, tmsPagination, markerFee, agentsLists, hallName, markerStatus, feeTypes, $filter, user, currentShift, topAlert) {
            breadcrumb.items = [
                {"name": "手續費付款", "active": true}
            ];

            $scope.markerExpiredFeeStatus = markerStatus.items; //過期手續費狀態
            $scope.feeTypes = feeTypes.items; //過去手續費類型
            $scope.feeTotal = {"fee_total": "0", "settlement_amount_total": "0"},
                $scope.markerExpiredFees = [];
            var init_condition = {
                only_current_hall: 0,
                outAgent: {agent_code: $stateParams.agent_code ? $stateParams.agent_code : ""},
                status: "1",
                end_date: ["", ""],
                marker_seqnumber: ""
//                settlement_amount:"|0"
            };
            $scope.condition = angular.copy(init_condition);

            //過期手續費
            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = markerFee;
            $scope.select = function (page) {
                $scope.total_condition = {
                    agent_info_id: $scope.agent_info_id ? $scope.agent_info_id : "",
                    status: "",
                    end_date: ["", ""],
                    marker_seqnumber: ""
                }
                $scope.condition_copy = angular.copy($scope.condition);
                delete $scope.condition_copy.loan_agent_name;
                delete $scope.condition_copy.agent_info_id;
                if ($scope.condition.status == 1) {
                    $scope.condition_copy.status = '|3';
                } else if ($scope.condition.status == 2) {
                    $scope.condition_copy.status = '3';
                } else {
                    $scope.condition_copy.status = "";
                }
//                $scope.condition_copy.year_month = $filter('date')(new Date($scope.condition_copy.year_month), 'yyyy-MM-dd');
                $scope.condition_copy.end_date[0] = $scope.condition_copy.end_date[0] ? $filter('date')(new Date($scope.condition_copy.end_date[0]), 'yyyy-MM-dd') : "";
                $scope.condition_copy.end_date[1] = $scope.condition_copy.end_date[1] ? $filter('date')(new Date($scope.condition_copy.end_date[1]), 'yyyy-MM-dd') : "";
                $scope.total_condition.end_date[0] = $scope.condition_copy.end_date[0] ? $filter('date')(new Date($scope.condition_copy.end_date[0]), 'yyyy-MM-dd') : "";
                $scope.total_condition.end_date[1] = $scope.condition_copy.end_date[1] ? $filter('date')(new Date($scope.condition_copy.end_date[1]), 'yyyy-MM-dd') : "";
                $scope.markerExpiredFees = $scope.pagination.select(page, globalFunction.generateUrlParams($scope.condition_copy, {markerExpiredFees: {}}));//,{marker:{}}
                $scope.total_condition.marker_seqnumber = $scope.condition_copy.marker_seqnumber;
                $scope.total_condition.status = $scope.condition.status;

                $scope.excel_condition = {
                    marker_seqnumber: $scope.condition_copy.marker_seqnumber,
                    agent_name: $scope.loan_agent_name,
                    agent_code: $scope.condition_copy.outAgent.agent_code ? $scope.condition_copy.outAgent.agent_code : "",
                    status: $scope.condition.status,
                    end_date_min: $scope.condition_copy.end_date[0] ? $filter('date')(new Date($scope.condition_copy.end_date[0]), 'yyyy-MM-dd') : "",
                    end_date_max: $scope.condition_copy.end_date[1] ? $filter('date')(new Date($scope.condition_copy.end_date[1]), 'yyyy-MM-dd') : ""
                }
                if ($scope.agent_info_id) {
                    markerFee.feeTotal(globalFunction.generateUrlParams($scope.total_condition, {})).$promise.then(function (feeTotals) {
                        $scope.feeTotal = feeTotals;
                    });
                }
            }

            //根據條件查詢方法
            $scope.search = function () {
                if (!$scope.condition.outAgent.agent_code) {
                    topAlert.warning("請輸入還息戶口!");
                    return;
                }
//                if(!$scope.condition.year_month){
//                    topAlert.warning("請選擇年月!");
//                    return;
//                }

                $scope.select();
            }

            $scope.loan_agent_name = "";
            $scope.agent_info_id = "";
            $scope.$watch('condition.outAgent.agent_code', globalFunction.debounce(function (new_value, old_value) {
                $scope.feeTotal = {};
                $scope.agent_info_id = "";
                if ($scope.condition.outAgent.agent_code) {
                    var conditions = angular.copy($scope.condition);
                    agentsLists.query({agent_code: $scope.condition.outAgent.agent_code}).$promise.then(function (agents) {
                        if (agents[0]) {
                            $scope.loan_agent_name = agents[0].agent_name;
                            $scope.agent_info_id = agents[0].id;
                            $scope.search();
//                            conditions.year_month = $filter('date')(new Date($scope.condition.year_month), 'yyyy-MM-dd');
//                            markerFee.feeTotal({agent_info_id: $scope.agent_info_id}).$promise.then(function(feeTotals){
//                                $scope.feeTotal = feeTotals;
//                            });
                        } else {
                            $scope.loan_agent_name = "";
                        }
                    });
                } else {
//                    $scope.search();
                    $scope.feeTotal = "";
                    $scope.markerExpiredFees = [];
                    $scope.loan_agent_name = "";
                }

            }, 350));
//            $scope.$watch('condition.outAgent.agent_code+condition.year_month',globalFunction.debounce(function(new_value,old_value){
//                $scope.feeTotal = {};
//                $scope.agent_info_id ="";
//                if($scope.condition.outAgent.agent_code && $scope.condition.year_month ) {
//                    var conditions = angular.copy($scope.condition);
//                    agentsLists.query({agent_code: $scope.condition.outAgent.agent_code}).$promise.then(function(agents){
//                        if(agents[0]){
//                            $scope.loan_agent_name = agents[0].agent_name;
//                            $scope.agent_info_id = agents[0].id;
//                            conditions.year_month = $filter('date')(new Date($scope.condition.year_month), 'yyyy-MM-dd');
//                            markerFee.feeTotal({year_month: conditions.year_month,agent_info_id: $scope.agent_info_id}).$promise.then(function(feeTotals){
//                                $scope.feeTotal = feeTotals;
//                            });
//                        }else{
//                            $scope.loan_agent_name = "";
//                        }
//                    });
//                }
//                if(!$scope.condition.outAgent.agent_code){
//                    $scope.loan_agent_name = "";
//                }
//            },350));

            $scope.reset = function () {
                $scope.condition = angular.copy(init_condition);
//                $scope.condition.year_month=currentShift.data.year_month
//                $scope.select();
                $scope.markerExpiredFees = $scope.pagination.select(1, {status: "NO"});
            }
            //還款手續費
            $scope.repayment = function (condition, feeTotal) {
                condition.loan_agent_name = $scope.loan_agent_name;
                condition.agent_info_id = $scope.agent_info_id;
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/loan/repayment-fee.html",
                    controller: 'repaymentFeeCtrl',
                    windowClass: 'lg-modal',
//                    backdrop: 'static',
//                    keyboard: false,
                    resolve: {
                        condition: function () {
                            return condition;
                        },
                        feeTotal: function () {
                            return feeTotal;
                        }
                    }
                });
                //還款
                modalInstance.result.then(function (status) {
                    //還款成功刷新列表
                    if (status) {
                        $scope.select();
//                        if($scope.agent_info_id && $scope.condition.year_month) {
//                            var conditions = angular.copy($scope.condition);
//                            conditions.year_month = $filter('date')(new Date($scope.condition.year_month), 'yyyy-MM-dd');
//                            markerFee.feeTotal({year_month: conditions.year_month,agent_info_id: $scope.agent_info_id}).$promise.then(function(feeTotals){
//                                $scope.feeTotal = feeTotals;
//                            });
//                        }
                    }
                })
            }

        }
    ]).controller('repayOverdueChargeCtrl', [
        '$scope', '$modalInstance', '$q', 'overdue_charge_data', 'getDate', function ($scope, $modalInstance, $q, overdue_charge_data, getDate) {
            $scope.overdue_charge = overdue_charge_data;
            $scope.submit = function () {
                overdue_charge_data.status = '已付';
                $modalInstance.close();
            };
            $scope.cancel = function () {
                $modalInstance.close();
            };
        }
    ]).controller('loanOperationRecordCtrl', [
        '$scope', '$stateParams', '$location', 'breadcrumb', 'globalFunction', 'loanBusinessOperation', 'operationTypes',
        function ($scope, $stateParams, $location, breadcrumb, globalFunction, loanBusinessOperation, operationTypes) {
            breadcrumb.items = [
                {"name": "貸款管理", "url": "/loan/list"},
                {"name": "貸款單詳細", "url": "/loan/detail/" + $stateParams.loan_id},
                {"name": "貸款單操作記錄"}
            ];
            $scope.operationTypes = operationTypes.items;
            //查詢貸款單操作記錄
            $scope.operationLogs = loanBusinessOperation.query(globalFunction.generateUrlParams({loan_seqnumber: $stateParams.loan_seqnumber}, {markerOperation: {}}));

            $scope.return = function () {
                $location.path("/loan/detail/" + $stateParams.loan_id);
            }
        }

    ]).controller('loanRecalculateResultCtrl', [  //贷款重算
        '$scope', '$location', 'loanRecalculates', 'search', 'page', '$timeout', 'breadcrumb', function ($scope, $location, loanRecalculate, search, page, $timeout, breadcrumb) {

            breadcrumb.items = [
                {"name": "貸款管理", "url": "/loan/list"},
                {"name": "貸款重算", "url": "/loan/loan-recalculate/"}
            ];

            $scope.goback = function () {
                $location.path("loan/loan-recalculate/");
            }

            //變更動作
            var changes = [{"change_id": "0", "change_name": "插入"}, {
                "change_id": "1",
                "change_name": "刪除"
            }, {"change_id": "2", "change_name": "修改"}]
            $scope.changes = _.pluck(changes, 'change_name');

            //是否重算
            var is_reruns = [{"reruns_id": "0", "reruns_name": "未重算"}, {"reruns_id": "1", "reruns_name": "已重算"}]
            $scope.is_reruns = _.pluck(is_reruns, 'reruns_name');

            var init_condition = {
                "agent_code": "",
                "agent_name": "",
                "loan_seqnumber": "",
                "change_status": "",
                "is_rerun": ""
            };
            var search_config = [
                {field_name: 'agent_code'},
                {field_name: 'agent_name'},
                {field_name: 'loan_seqnumber'},
                {field_name: 'change_status'},
                {field_name: 'is_rerun'}
            ];

            $scope.condition = angular.copy(init_condition);
            $scope.loanRecalculates = search(loanRecalculate, search_config, $scope.condition);
            //$scope.loanRecalculate = page.select(1,$scope.all_loanRecalculate) ;

            //查詢
            $scope.search = function () {
                $scope.loanRecalculates = search(loanRecalculate, search_config, $scope.condition);
            }

            //重置
            $scope.reset = function () {
                $scope.condition = angular.copy(init_condition);
                $scope.form_search.$setPristine();
                $scope.search();
            }

            //全部重新計算
            $scope.all_reruns = function () {
                var reruns_data = _.where(loanRecalculate, {'is_rerun': '已重算'});
                if (reruns_data.length == loanRecalculate.length) {
                    alert("您已經全部重新計算過了");
                    return false;
                }
                if (confirm("確定要重新計算嗎？")) {
                    alert("重算任務已排隊，正在重新計算\n貸款業務單，請稍後進入系\n統查詢重算結果。");
                    $timeout(function () {
                        _.each($scope.loanRecalculates, function (loanRecalculate) {
                            if (loanRecalculate.is_rerun == "未重算") {
                                loanRecalculate.is_rerun = "已重算";
                            }
                        });
                    }, 500);
                }
            }

            //業務單詳細
            $scope.detail = function (loan_id) {
                $location.path("/loan/loan-recalculate-result/" + loan_id);
            }
        }
    ]).controller('rerunLoanCtrl', [
        '$scope', '$timeout', '$location', '$stateParams', 'loanRecalculates', 'markers', 'loanAffecteds', 'rollingAffects', 'streamTranscodes', 'page', 'breadcrumb', function ($scope, $timeout, $location, $stateParams, loanRecalculates, markers, loanAffecteds, rollingAffects, streamTranscodes, page, breadcrumb) {

            breadcrumb.items = [
                {"name": "貸款管理", "url": "/loan/list"},
                {"name": "貸款重算", "url": "/loan/loan-recalculate/"},
                {"name": "重算業務單"}
            ];

            //重改詳細業務單
            $scope.loanRecalculate_record = _.findWhere(loanRecalculates, {"loan_id": parseInt($stateParams.loan_id)});

            //業務單下面的Marker單
            $scope.markers = _.where(markers, {"loan_id": $stateParams.loan_id});
            _.each($scope.markers, function (marker) {
                marker.is_rerun = $scope.loanRecalculate_record.is_rerun;
            });

            //影響的貸款單
            $scope.loanAffecteds = loanAffecteds;
            _.each($scope.loanAffecteds, function (loanAffected) {
                loanAffected.is_rerun = $scope.loanRecalculate_record.is_rerun;
            });
//            $scope.all_loanAffecteds = page.select(1,loanAffecteds);

            //全選或取消全選
            var check_config = {
                all_check: ""
            }
            $scope.config_data = angular.copy(check_config);
            $scope.checkAll = function () {

                //判斷是否全部核對
                var checed_loan = _.where($scope.loanAffecteds, {'status': "已核對"});
                if (checed_loan.length == $scope.loanAffecteds.length) {

                    $scope.config_data.all_check = false;
                } else {
                    _.each($scope.loanAffecteds, function (la) {
                        if (la.status == "已核對") {
                            la.selected = false;
                        } else {
                            la.selected = $scope.config_data.all_check;
                        }

                    });
                }
            }

            //單獨選中或取消業務單
            $scope.setChecked = function (r) {
                if (r.status == "已核對") {
                    r.selected = false;
                    alert("此條業務單已核對");
                    return false;
                }
            }

            //全部核對
            $scope.allChecked = function () {

                var checked_data = _.where($scope.loanAffecteds, {'selected': true});
                if (checked_data.length == 0) {
                    alert("請選擇要核對的業務單!");
                    return false;
                }

                var checked_all = _.where($scope.loanAffecteds, {'selected': true, 'is_rerun': '未重算'});
                if (checked_all.length > 0) {
                    alert("未重算的單不能核算!");
                    return false;
                }

                if (confirm("確定核對嗎？")) {
                    _.each(checked_data, function (cl) {
                        cl.status = "已核對";
                        cl.selected = false;
                    });
                }
                $scope.config_data.all_check = false;

            }
            //受影響的業務單
            $scope.all_rollingAffects = rollingAffects;
            $scope.rollingAffects = page.select(1, $scope.all_rollingAffects);
            _.each($scope.rollingAffects, function (ra) {
                var st_data = _.where(streamTranscodes, {'rolling_id': ra.rolling_id.toString()});
                var sum = _.reduce(st_data, function (memo, obj) {
                    return memo + parseInt(obj.amount);
                }, 0);
                ra.total_rolling_amount = sum;
            });

            //pagination
            $scope.select = function (current_page) {
                $scope.rollingAffects = page.select(current_page, $scope.all_rollingAffects);
            }


            //業務單詳情
            $scope.loan_detail = function (loan_id) {
                $location.path("loan/detail/" + loan_id);
            }

            //修改貸款單
            $scope.loan_update = function (loan_id) {
                $location.path("loan/update/" + loan_id + "/account_update");
            }

            //轉碼單詳細
            $scope.rolling_detail = function (rolling_id) {
                $location.path('loan/rolling-check/' + rolling_id + "/detail");
            }

            //轉碼但修改
            $scope.rolling_update = function (rolling_id) {
                $location.path('loan/rolling-check/' + rolling_id + "/update");
            }

            $scope.goback = function () {
                $location.path("loan/loan-recalculate/");
            }
        }

    ]).controller('rollingCheckManagerCtrl', [
        '$scope', '$location', '$modal', '$stateParams', 'rollingAffects', 'streamTranscodes', 'breadcrumb', function ($scope, $location, $modal, $stateParams, rollingAffects, streamTranscodes, breadcrumb) {


            //查看轉碼詳細
            $scope.operation_type = $stateParams.operation_type;
            var title = $scope.operation_type == "update" ? "轉碼單修改" : "轉碼單詳細"
            breadcrumb.items = [
                {"name": "貸款管理", "url": "/loan/list"},
                {"name": "貸款重算", "url": "/loan/loan-recalculate/"},
                {"name": "重算業務單", "url": "/loan/loan-recalculate-result/" + $stateParams.rolling_id},
                {"name": title}
            ];

            $scope.rolling_record = _.findWhere(rollingAffects, {'rolling_id': parseInt($stateParams.rolling_id)});


            //查詢轉單的流水
            $scope.streamTranscodes = _.where(streamTranscodes, {"rolling_id": $stateParams.rolling_id});
            //最有一單子流水
            var last_stream_data = _.first($scope.streamTranscodes, [1])
            $scope.rolling_record.last_amount = last_stream_data[0].amount;

            //計算轉碼總數
            var sum = _.reduce($scope.streamTranscodes, function (memo, obj) {
                return memo + Number(obj.amount);
            }, 0);
            $scope.rolling_record.total_amount = sum;

            //COPY副本
            $scope.rolling_record_copy = angular.copy($scope.rolling_record);
            $scope.streamTranscodes_copy = angular.copy($scope.streamTranscodes);
            //$scope.rolling_record_types_copy =  angular.copy($scope.rolling_record_copy.types);

            //選擇/新增轉馬卡
            //新增卡類型
            $scope.addCardType = function (t, index) {

                /*var modal_card;
                 modal_card = */
                $modal.open({
                    templateUrl: "views/loan/add-card-type.html",
                    controller: 'loanAddCardTypeCtrl',
                    windowClass: 'sm-modal',
                    resolve: {
                        cardType: function () {
                            return t;
                        },
                        card_index: function () {
                            return index;
                        }
                    }
                });
            }

            //新增轉碼流水
            $scope.addRollingSteam = function (rolling_record) {
                var rolling_create_modal;
                rolling_create_modal = $modal.open({
                    templateUrl: "views/loan/rolling-create.html",
                    controller: 'rollingCreateCtrl',
                    windowClass: 'lg-modal',
                    resolve: {
                        rolling_record: function () {
                            return rolling_record;
                        }
                    }
                });

                //新增轉碼流水
                $scope.rolling_stream_record = [];
                rolling_create_modal.result.then(function (rolling_stream_record) {
                    if (rolling_stream_record.is_refund) {
                        rolling_stream_record.amount = -(rolling_stream_record.amount);
                    }

                    $scope.rolling_stream_record = rolling_stream_record;
                    $scope.streamTranscodes_copy.push(angular.copy(rolling_stream_record));
                    $scope.streamTranscodes_copy = _.where($scope.streamTranscodes_copy, {"rolling_id": $stateParams.rolling_id});

                    //更新总数
                    var sum = _.reduce($scope.streamTranscodes_copy, function (memo, obj) {
                        return memo + Number(obj.amount);
                    }, 0);
                    $scope.rolling_record.total_amount = sum;
                });
            }

            //最後確認提交
            $scope.lastSubmit = function (rolling_id) {
                if ($scope.rolling_stream_record != undefined) {
                    streamTranscodes.push($scope.rolling_stream_record);
                }
                $scope.rolling_record.types = $scope.rolling_record_copy.types;
                $location.path("loan/loan-recalculate-result/" + rolling_id);
            }

            //轉碼流水詳細
            $scope.stream_detail = function (stream_record) {

                $modal.open({
                    templateUrl: "views/loan/stream-detail.html",
                    controller: 'loanStreamDetailCtrl',
                    windowClass: 'lg-modal',
                    resolve: {
                        stream_record: function () {
                            return stream_record;
                        },
                        rolling_record: function () {
                            return $scope.rolling_record;
                        }
                    }
                });
            }

            //返回
            $scope.goback = function () {
                $location.path("loan/loan-recalculate-result/" + $stateParams.rolling_id);
            }

            //取消
            $scope.cancel = function () {
                $location.path("loan/loan-recalculate-result/" + $stateParams.rolling_id);
            }

        }
    ]).controller('loanStreamDetailCtrl', ['$scope', 'rolling_record', 'stream_record', function ($scope, rolling_record, stream_record) {
        //轉碼流水
        $scope.stream_record = stream_record;
        //轉碼單信息
        $scope.rolling_record = rolling_record;

        $scope.types = [];
        _.each($scope.rolling_record.types, function (type) {

            var amount = parseInt(type.amount) / parseInt($scope.rolling_record.rolling_amount) * parseInt($scope.stream_record.amount);
            var new_type = {
                "amount": amount.toString().replace(/\d+\.\d+/ig, a),
                "amount_type": type.amount_type,
                "card_type": type.card_type
            }
            $scope.types.push(new_type);
        });

        function a(v) {
            return ((v * 1).toFixed(2));
        }
    }


    ]).controller('loanAddCardTypeCtrl', ['$scope', '$modalInstance', '$location', 'card', 'cardType', function ($scope, $modalInstance, $location, card, cardType) {

        $scope.type_record = {
            card_id: '',
            card_name: cardType.card_type
        };

        if (cardType.hasOwnProperty('cards')) {
            $scope.cards = angular.copy(cardType.cards);
            $scope.card_rows = split(angular.copy(cardType.cards), 10);
        } else {
            card.query().$promise.then(function (cards) {
                $scope.cards = angular.copy(cards);
                $scope.card_rows = split(cards, 10);
            });
        }

        function split(arr, size) {
            var arrays = [];
            while (arr.length > 0) {
                arrays.push(arr.splice(0, size));
            }
            return arrays;
        }

        $scope.submit = function () {
            cardType.card_type = $scope.type_record.card_name;
            $modalInstance.close();
        }
        $scope.cancel = function () {
            $modalInstance.close();
        }

        //新增卡類型
        $scope.add = function (card_name) {
            var card_data = _.where($scope.cards, {'card_name': card_name});
            if (card_data.length > 0) {
                alert("不能添加相同的卡類型");
                return false;
            }
            if (card_name == "" || card_name == undefined) {
                alert("新增卡類型不能為空！");
                return false;
            }
            $scope.cards.push(angular.copy({"card_id": "0", "card_name": card_name}));
            $scope.card_rows = split(angular.copy($scope.cards), 10);
            cardType.cards = $scope.cards;
            $scope.card_name = '';
        }

        $scope.close = function () {
            $modalInstance.close($scope.type_record);
        }


    }
    ]).controller('rollingCreateCtrl', ['$scope', 'getDate', '$modalInstance', 'streamTranscodes', 'rolling_record', function ($scope, getDate, $modalInstance, streamTranscodes, rolling_record) {

        //查流水最後一條ID
        var lastStream = _.last(streamTranscodes, [1]);

        //加載轉碼信息
        var i = 0;
        $scope.rolling_record = rolling_record;
        $scope.rolling_stream_record = {
            id: lastStream[0].id + 1,
            rolling_id: rolling_record.rolling_id.toString(),
            loan_id: rolling_record.loan_id,
            rolling_seqnumber: "R001",
            stream_number: "R" + new Date().getTime() + "-1",
            fund_type: "贷款",
            agent_code: rolling_record.agent_code,
            full_name: rolling_record.agent_name,
            rolling_time: getDate(new Date(), true),
            amount: "",
            shift: "早更",
            supervisor: "陳三",
            brokerage: "陳惠怡",
            is_refund: "",
            remark: "",
            types: [],
            pwd: ""
        }

        $scope.$watch('rolling_stream_record.amount', function (new_value, old_value) {
            $scope.rolling_stream_record.types = [];

            if (new_value != "") {
                _.each(rolling_record.types, function (type) {
                    var amount = (parseInt(parseInt(type.amount) / parseInt($scope.rolling_record.rolling_amount) * parseInt($scope.rolling_stream_record.amount)));
                    var new_type = {
                        "amount": amount.toString().replace(/\d+\.\d+/ig, a),
                        "amount_type": type.amount_type,
                        "card_type": type.card_type
                    }
                    $scope.rolling_stream_record.types.push(new_type);
                });
            }

        });

        function a(v) {
            return ((v * 1).toFixed(2));
        }


        //新增轉碼流水
        $scope.submit = function () {
            $modalInstance.close($scope.rolling_stream_record);
        }

        //取消
        $scope.close = function () {
            $scope.rolling_stream_record = [];
            $modalInstance.close($scope.rolling_stream_record);
        }
    }
    ]).controller('loanRecoveryCtrl', [ //貸款追收管理
        '$scope', '$location', 'getDate', 'breadcrumb', 'globalFunction', 'tmsPagination', 'hallName', 'marker', 'goBackData', '$stateParams', 'currentShift', '$filter',
        function ($scope, $location, getDate, breadcrumb, globalFunction, tmsPagination, hallName, marker, goBackData, $stateParams, currentShift, $filter) {
            breadcrumb.items = [
                {"name": "貸款追收管理", "active": true}
            ];

            //聽會
            $scope.halls = hallName.query({hall_type: "|1"});

            //查詢過期日期
            $scope.markerDates = marker.markerDate();

            var init_condition = {
                date: $scope.filter_date,
                marker_seqnumber: "",
                hall_id: "",
                status: "|3",
                is_type: "1",//判断是否是贷款追收页面请求API
                loanBusiness: {
                    agent_code: $stateParams.agent_code || "",
                    agent_name: "",
                    loan_time: ["", ""]
                },
                "sort": "loanBusiness.agent_code NUMASC,loanBusiness.loan_time ASC"
            }
            $scope.condition = angular.copy(init_condition);
            $scope.excel_condition = angular.copy($scope.condition);
            $scope.condition = goBackData.get('condition', $scope.condition);

            $scope.pagination = tmsPagination.create();
            $scope.pagination.resource = marker;
            $scope.pagination.query_method = "markerList";
            $scope.select = function (page) {
                if ($scope.user.hall.hall_type == 1 && !$scope.condition.hall_id) {
                    $scope.condition.hall_id = "";
                }
                /*else if($scope.user.hall.hall_type != 1){
                 $scope.condition.hall_id=$scope.user.hall.id;
                 }*/
                goBackData.set('condition', $scope.condition);
                $scope.condition.date = $scope.filter_date,
                    $scope.condition_copy = angular.copy($scope.condition);
                if ($scope.condition.date) {
                    if ($scope.condition.loanBusiness.agent_code) {
                        $scope.condition_copy.loanBusiness.agent_code = $scope.condition.loanBusiness.agent_code + "!";
                    }
                } else {
                    if ($scope.condition.loanBusiness.agent_code) {
                        $scope.condition_copy.loanBusiness.agent_code = $scope.condition.loanBusiness.agent_code + "!";
                    }
                }
                if ($scope.condition.loanBusiness.agent_name) {
                    $scope.condition_copy.loanBusiness.agent_name = $scope.condition.loanBusiness.agent_name + "!";
                }
                if ($scope.condition.loanBusiness.loan_time[0]) {
                    $scope.condition_copy.loanBusiness.loan_time[0] = getDate($scope.condition.loanBusiness.loan_time[0]);
                }
                if ($scope.condition.loanBusiness.loan_time[1]) {
                    $scope.condition_copy.loanBusiness.loan_time[1] = getDate($scope.condition.loanBusiness.loan_time[1]);
                }
                if ($scope.condition.marker_seqnumber) {
                    $scope.condition_copy.marker_seqnumber = $scope.condition.marker_seqnumber + "!";
                }
                var excel_condition = angular.copy($scope.condition);
                excel_condition.loanBusiness.loan_time[0] = excel_condition.loanBusiness.loan_time[0] ? $filter("date")(excel_condition.loanBusiness.loan_time[0], "yyyy-MM-dd") : "";
                excel_condition.loanBusiness.loan_time[1] = excel_condition.loanBusiness.loan_time[1] ? $filter("date")(excel_condition.loanBusiness.loan_time[1], "yyyy-MM-dd") : "";


                $scope.excel_condition = excel_condition;
                //$scope.excel_condition.hall_name = $scope.hall_name;
                $scope.markerLists = $scope.pagination.select(page, $scope.condition_copy)
            }
            $scope.select();

            $scope.search = function (date) {
                if (date) {
                    $scope.filter_date = date;
                } else {
                    $scope.filter_date = "";
                }
                $scope.select();
            }

            $scope.reset = function () {
                $scope.condition = angular.copy(init_condition);
                $scope.select();
            }

            $scope.detail = function (loan_id) {
                // $location.path("loan/loan-recovery-detail");
                goBackData.set('condition', $scope.condition);
                $location.path('/loan/detail/' + loan_id);
            }

            //發送SMS
            $scope.sendSMS = function () {
                $location.path("loan/loan-recovery-sms");
            }

        }]).controller('loanRecoverySmsCtrl', [ //貸款追收管理-發送SMS
        '$scope', '$timeout', '$filter', '$location', 'breadcrumb', 'getDate', 'topAlert', 'globalFunction', 'tmsPagination', 'marker', 'areaCode', 'agentsLists', 'smsGroup', 'smsRecord', 'pinCodeModal', 'formatNumber',
        function ($scope, $timeout, $filter, $location, breadcrumb, getDate, topAlert, globalFunction, tmsPagination, marker, areaCode, agentsLists, smsGroup, smsRecord, pinCodeModal, formatNumber) {
            breadcrumb.items = [
                {"name": "貸款追收管理", "url": 'loan/loan-recovery'},
                {"name": "戶口貸款發送SMS", "active": true}
            ];

            //保存短信草稿
            var init_record = {
                "pin_code": "",
                "sms_type": "1",
                "priority": "1",
                "is_sys": "0",
                "content": "",
                "type": 13,
                "phoneNumbers": [
                    {
                        "agent_code": "",
                        "agent_name": "",
                        "area_code": "",
                        "telephone_number": ""
                    }
                ]
            }
            $scope.record_create = angular.copy(init_record);

            $scope.areaCodes = areaCode.query();

            marker.markerDate().$promise.then(function (markerDate) {
                $scope.markerDates = markerDate;
                $scope.markerDateLabels = [];
                _.each(markerDate, function (dates) {
                    $scope.markerDateLabels.push({'text': 'day' + $filter('date')(dates.date, 'yyyyMMdd')})
                });
            });

            /*$scope.pagination = tmsPagination.create();
             $scope.pagination.resource = marker;
             $scope.pagination.query_method = "expiredMarkerTotal";*/
            var init_condition_search = {
                agent_code: "",
                agent_group_name: "",
                sort: "agent_code NUMASC"
            }
            $scope.condition_search = angular.copy(init_condition_search);
            $scope.search_select = function () {
                $scope.condition_search_copy = angular.copy($scope.condition_search);
                marker.expiredMarkerTotal($scope.condition_search_copy)
                    .$promise.then(function (_expiredMarkerTotal) {
                        $scope.expiredMarkerTotals = _expiredMarkerTotal;

                    });

            }
            $scope.search_select();

            $scope.edit_disabled = true;
            //選取發送
            var init_multi_record = {
                type_code: "DUN",
                agents: []
            }
            $scope.multiRecord = angular.copy(init_multi_record);
            $scope.sendSMS = function () {
                var expiredMarkerTotals_len = _.where($scope.expiredMarkerTotals, {checked: true});
                $scope.agents_sms_content = [];
                _.each(expiredMarkerTotals_len, function (em) {
                    $scope.agents_sms_content.push({
                        agent_info_id: em.agent_info_id,
                        recordIDs: em.sms_id ? em.sms_id : []
                    });
                });
                $scope.multiRecord.agents = $scope.agents_sms_content;
                if (expiredMarkerTotals_len.length > 0) {
                    pinCodeModal(smsRecord, 'multiSms', $scope.multiRecord, '發送成功').then(function () {
                        $scope.agents_sms_content = [];
                        $scope.multiRecord = angular.copy(init_multi_record);
                        _.each(expiredMarkerTotals_len, function (em) {
                            em.checked = false;
                        });
                    });
                } else {
                    topAlert.warning("請您選擇要發送的貸款單信息")
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
             }*/

            //刪除號碼
            /* $scope.del_tel = function($index){
             $scope.sendTels_new['key_'+$scope.agent_info_id].splice($index,1);
             }

             $scope.remove = function($index){
             $scope.sendTels['key_'+$scope.agent_info_id].splice($index,1);
             //$scope.expiredMarker.sendTels.splice($index,1);
             }*/


            //選擇發送的內容
            //$scope.sendTels = {};
            $scope.sms_content = [];
            $scope.agentSmsNotice = [];
            $scope.selectSendSMS = function (expiredMarkerTotal) {
                var StranLink_Obj = document.getElementById("StranLink")
                var StranLink_Obj1 = document.getElementById("StranLink1");
                StranLink_Obj.style.backgroundColor = '#65A34D';
                StranLink_Obj.style.color = 'white';
                StranLink_Obj.style.border = '#65A34D solid 1px';
                StranLink_Obj1.style.backgroundColor = '';
                StranLink_Obj1.style.color = '';
                StranLink_Obj1.style.border = '#ccc solid 1px';
                window['textAreaValue'] = ''; //清空繁體和簡體轉換的內容

                //$scope.selectedRow = $index;
                $scope.sms_record = expiredMarkerTotal;
                $scope.agent_info_id = expiredMarkerTotal.agent_info_id;
                $scope.agent_code = expiredMarkerTotal.agent_code;
                $scope.agent_name = expiredMarkerTotal.agent_name;
                //已經存在草稿模板
                if ($scope.sms_record.sms_id) {
                    $scope.agentSmsNotice = angular.copy($scope.agentSmsNotice_local['key_' + $scope.agent_info_id]); // = $scope.sendTels['key_'+$scope.agent_info_id]
                    //$scope.sendTels_new['key_'+$scope.agent_info_id];
                    $scope.tel_content = angular.copy($scope.tel_content_local['key_' + $scope.agent_info_id]);
                    $scope.record_create.content = angular.copy($scope.sms_content_local['key_' + $scope.agent_info_id]);// $scope.sendContent(_expiredMarker);
                    $scope.selected_group_content = angular.copy($scope.selected_group_content_local['key_' + $scope.agent_info_id]);


                } else {
                    //$scope.cancel();
                    marker.expiredMarker(globalFunction.generateUrlParams({agent_info_id: expiredMarkerTotal.agent_info_id}))
                        .$promise.then(function (_expiredMarker) {
                            //發送的內容
                            $scope.record_create.content = $scope.sendContent(_expiredMarker);

                        });

                    agentsLists.agentSmsNotice({
                        agent_info_id: expiredMarkerTotal.agent_info_id,
                        type_code: 'DUN',
                        is_master: 1
                    })
                        .$promise.then(function (phoneNumbers) {
                            $scope.agentSmsNotice = phoneNumbers;
                            $scope.tel_content = [];
                            //$scope.sendTels_new['key_'+$scope.agent_info_id] = [{agent_contact_name: "", area_code: "", telephone_number: ""}];
                        });
                }
                //$scope.group_select();
            }
            //$scope.selectSendSMS();
            //發送SMS
            $scope.sendContent = function (content) {

                $scope.isReadonly = true;
                var sms_content = "【溫馨提示】\n";
                sms_content += "尊敬的客戶您好！\n";
                sms_content += "戶口編號：" + $scope.agent_code + "(" + $scope.agent_name + ")\n";
                if (content.expired.length > 0) {
                    sms_content += "以下貸款單已過期：\n";
                    _.each(content.expired, function (_content) {
                        var sms_loan_time = new Date(Date.parse(_content.loan_time.replace(/-/g, "/")));
                        sms_content += _content.hall_name + "，" + formatNumber(_content.settlement_amount) + "萬，貸款日：" + $filter("date")(sms_loan_time, "yyyy-MM-dd") + "，貸款到期日：" + _content.coming_expired_date + "\n";
                    });
                }

                //过期日
                if (content.current_date_expired.length > 0) {
                    sms_content += "以下貸款單今天到期：\n";
                    _.each(content.current_date_expired, function (_content) {
                        var sms_loan_time = new Date(Date.parse(_content.loan_time.replace(/-/g, "/")));
                        sms_content += _content.hall_name + "，" + formatNumber(_content.settlement_amount) + "萬，貸款日：" + $filter("date")(sms_loan_time, "yyyy-MM-dd") + "，貸款到期日：" + _content.coming_expired_date + "\n";
                    });
                }
                if (content.coming_expired.length > 0) {
                    sms_content += "以下貸款單即將到期：\n";
                    _.each(content.coming_expired, function (_content) {
                        var sms_loan_time = new Date(Date.parse(_content.loan_time.replace(/-/g, "/")));
                        sms_content += _content.hall_name + "，" + formatNumber(_content.settlement_amount) + "萬，貸款日：" + $filter("date")(sms_loan_time, "yyyy-MM-dd") + "，貸款到期日：" + _content.coming_expired_date + "\n";
                    });
                }
                sms_content += "過期將會產生手續費\n" + "短訊如有錯漏，以借款單為準。若已清還款項，則無須理會本訊息\n" + "如需查詢,歡迎致電：\n凱旋門：+853 2872 2952\n銀河：+853 2882 3681";
                return sms_content;
            }

            $scope.detail = function () {
                $location.path("loan/loan-recovery-sms");
            }

            $scope.isReadonly = true;
            //編輯
            $scope.edit = function () {
                $scope.isReadonly = false;
            }

            //保存
            $scope.save = function () {
                $scope.isReadonly = true;
            }

            //取消
            /* $scope.cancel = function(){
             $scope.isReadonly = true;
             marker.expiredMarker(globalFunction.generateUrlParams({agent_info_id: $scope.agent_info_id}))
             .$promise.then(function(_expiredMarker){
             //$scope.sendTels['key_'+$scope.agent_info_id] = _expiredMarker.phoneNumbers;
             $scope.sendTels_new = [{agent_name: "", area_code: "", telephone_number: ""}];
             //發送的內容
             $scope.sms_content = $scope.sendContent(_expiredMarker);
             });
             }*/

            //$scope.checked_all = false;
            //全選
            $scope.record = {
                isCheckedAll: false
            }
            $scope.checkedAll = function () {
                if ($scope.record.isCheckedAll) {

                    _.each($scope.expiredMarkerTotals, function (expiredMarkerTotal) {
                        expiredMarkerTotal.checked = true;
                    })
                } else {
                    _.each($scope.expiredMarkerTotals, function (expiredMarkerTotal) {
                        expiredMarkerTotal.checked = false;
                    })
                }
            }

            //===========發送SMS=============

            //初始化列表數據
            var init_new_record = {
                search_type: "agent",
                keyword: ""
            }
            $scope.new_record = angular.copy(init_new_record);
            /*$scope.pagination = tmsPagination.create();
             $scope.pagination.resource = smsGroup;*/
            $scope.group_select = function () {
                $scope.condition_copy = angular.copy($scope.new_record);
                if ($scope.condition_copy.keyword) {
                    $scope.condition_copy.keyword = $scope.condition_copy.keyword + "!";
                }
                smsGroup.query({sms_group_name: $scope.condition_copy.keyword}).$promise.then(function (_smsGroup) {
                    //不顯示選取的群組
                    _.each($scope.selected_group_content, function (selected_group) {
                        var selected_data = _.findWhere(_smsGroup, {id: selected_group.id});
                        if (selected_data) {
                            selected_data.is_selected = true;
                        }
                    });
                    $scope.sms_groups = _smsGroup;
                });
            }

            /*$scope.prefix = "";
             $scope.setSelected = function(newValue) {
             return [{"ID":13,"Name":"Portrait Photography"},{"ID":24,"Name":"Commercial Photography"},{"ID":21,"Name":"Pet Photography"},{"ID":16,"Name":"Event Photography"},{"ID":26,"Name":"Headshot Photography"}];
             };

             smartyConfig.getSmartySuggestions($scope.prefix).$promise.then(function(data) {
             $scope.suggestions = data;
             });*/

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
            $scope.write_num = function () {
                $scope.isWriteFlag = true;
                $scope.tel_record = angular.copy(init_tel_record);
            }

            //選擇搜索項
            $scope.placeholder = "戶口查詢";
            $scope.change_search_type = function () {
                $scope.new_record.keyword = "";
                if ($scope.new_record.search_type == "agent") {  //戶口查詢
                    $scope.placeholder = "戶口查詢";
                } else if ($scope.new_record.search_type == "group") { //群組查詢
                    $scope.placeholder = "群組查詢";
                }
            }

            $scope.search_list = function () {
                if ($scope.new_record.search_type == "agent") {  //戶口查詢
                    $scope.agent_watch();

                } else if ($scope.new_record.search_type == "group") { //群組查詢
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
                    $scope.tel_content = _.flatten($scope.tel_content);
                    $scope.isSelectDisabled = false;
                });
                //隱藏選中的群組
                record.is_selected = true;
                $scope.selected_group_content.push(record);
            }

            //取消選中戶組
            $scope.cancel_selected = function (record, index) {
                //var groups_data = _.findWhere($scope.sms_groups, {id: record.id});
                var cancel_group = _.where($scope.tel_content, {sms_group_id: record.id});
                /*if (groups_data) {
                 groups_data.is_selected = false;
                 }*/
                $scope.selected_group_content.splice(index, 1);
                $scope.tel_content = _.difference($scope.tel_content, cancel_group);
            }

            //通過戶口查詢
            /*$scope.isHiddenCode = false;
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
            $scope.agent_watch = function () {
                $scope.tel_record.agent_name = "";
                $scope.tel_record.telephone_number = "";
                if ($scope.new_record.keyword) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: $scope.new_record.keyword}, {refTelAgentMasterNoticeType: {agentContactTel: ''}}))
                        .$promise.then(function (agents) {
                            if (agents[0]) {
                                $scope.tel_record.agent_code = agents[0].agent_code;
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
                        var tel_data = _.where($scope.tel_content, {
                            area_code_id: _sys_tel.agentContactTel.area_code_id,
                            telephone_number: _sys_tel.agentContactTel.telephone_number
                        });
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
                    var tel_data = _.where($scope.tel_content, {
                        area_code_id: $scope.tel_record_copy.area_code_id,
                        telephone_number: $scope.tel_record_copy.telephone_number
                    });
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
            //監聽内容是否改变
            $scope.$watch('record_create.content', function (newValue) {
                if (newValue) {
                    window['textAreaValue'] = '';
                }
            });

            //保存短信草稿
            $scope.send_sms_url = globalFunction.getApiUrl('sms/smsrecord');
            $scope.submit = function () {
                if ($scope.isDisabled) {
                    return $scope.isDisabled;
                }
                $scope.isDisabled = true;

                if (!$scope.agent_info_id) {
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
                if (window['textAreaValue']) {   //storm.xu
                    $scope.record_create.content = window['textAreaValue'];  //storm.xu
                }
                ;
                $scope.form_send_sms.checkValidity().then(function () {
                    smsRecord.smsDraft($scope.record_create).$promise.then(function (result) {
                        topAlert.success('草稿保存成功');
                        window['textAreaValue'] = ''
                        //本地保存草稿
                        $scope.sms_record.sms_id = result.id;
                        $scope.localSaveSMS();
                        $scope.record_create.pin_code = '';
                        $scope.isReadonly = true;
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
            $scope.localSaveSMS = function () {
                $scope.agentSmsNotice_local['key_' + $scope.agent_info_id] = angular.copy($scope.agentSmsNotice);
                $scope.tel_content_local['key_' + $scope.agent_info_id] = angular.copy($scope.tel_content);
                $scope.selected_group_content_local['key_' + $scope.agent_info_id] = angular.copy($scope.selected_group_content);
                $scope.sms_content_local['key_' + $scope.agent_info_id] = angular.copy($scope.record_create.content);
            }

            $scope.cancel = function () {
                //清空選取的電話
                $scope.tel_content = [];
                //取消選中群/戶組
                _.each($scope.selected_group_content, function (_selected_group) {
                    _selected_group.is_selected = false;
                });
                $scope.selected_group_content = [];
                //清空其他信息
                $scope.sms_type = $scope.record_create.sms_type;
                $scope.record_create = angular.copy(init_record);
                $scope.record_create.sms_type = $scope.sms_type;
                $scope.agentSmsNotice = [];
            }

        }]).controller('loanRecoveryDetailCtrl', ['$scope', '$location', 'breadcrumb', function ($scope, $location, breadcrumb) {
        breadcrumb.items = [
            {"name": "貸款重算管理", "url": 'loan/loan-recovery'},
            {"name": "貸款單處理流水", "active": true}
        ];
        $scope.goback = function () {
            $location.path("loan/loan-recovery");
        }

    }])
    /**
     * 過期手續費管理  account
     */
        .controller('loanAccountOverdueChargeCtrl', ['$scope', '$stateParams', '$location', 'user', 'globalFunction', 'tmsPagination', '$modal', '$filter', 'breadcrumb', 'markerFee', 'hallName', 'feeTypes', 'markerStatus', 'adjustTypes', 'agentGroup', 'agentsLists', 'topAlert', 'currentShift', 'marker', 'markerExpiredFee', 'markerFeeRepayment', 'markerExpiredFeeAdjustRecord', 'goBackData', 'pinCodeModal', '$log', 'confirmStatus', 'markerfeeoutagentremark', 'getDate',
            function ($scope, $stateParams, $location, user, globalFunction, tmsPagination, $modal, $filter, breadcrumb, markerFee, hallName, feeTypes, markerStatus, adjustTypes, agentGroup, agentsLists, topAlert, currentShift, marker, markerExpiredFee, markerFeeRepayment, markerExpiredFeeAdjustRecord, goBackData, pinCodeModal, $log, confirmStatus, markerfeeoutagentremark, getDate) {

                breadcrumb.items = [
                    {"name": "過期手續費管理", "active": true}
                ];
                if ($stateParams.type == 1 || (user.department.id == '03X3EAE12CA45F7EE0539715A8C07DE6' && user.checkPermissions('markerExpiredFeeRepaymentView'))) {
                    $scope.tab = {
                        total: false,
                        record: true,
                        monthly: false
                    }
                }
                $scope.feeTypes = feeTypes.items;
                $scope.markerStatus = markerStatus.items;
                $scope.adjustTypes = adjustTypes.items;
                $scope.confirmStatus = confirmStatus.items;
                $scope.user = user;
                $scope.chk_loan_group = {group1: "", group2: ""};

                $scope.halls = hallName.query({hall_type: "|1"});
                /*$scope.all_overdueCharges = overdueCharges;
                 $scope.overdueCharges = page.select(1,$scope.all_overdueCharges);*/
                $scope.account_overdue_url = globalFunction.getApiUrl('loan/markerexpiredfee/calculate-fee');
                //月结
                var init_account_overdue = {
                    date: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    year_month: currentShift.data.year_month,
                    agentInfo: {
                        agent_code: ""
                    },
                    agentGroup: {
                        agent_group_name: ""
                    },
                    agent_name: "",
                    agent_group: "",
                    //agent_group_name: "",
                    agent_id: "",
                    agent_group_id: "",
                    marker_seqnumber: "",
                    loanBusiness: {
                        loan_seqnumber: ""
                    },
                    loan_days: "",
                    status: "|3",
                    select_all: false,
                    pin_code: ""
                }
                $scope.account_overdue = angular.copy(init_account_overdue);


                //下一步
                $scope.expired_date = "";
                $scope.marker_list = [];
                //选中值数组
                $scope.check_marker_true = [];
                $scope.pagination_monthly = tmsPagination.create();
                $scope.pagination_monthly.resource = marker;
                $scope.pagination_monthly.query_method = 'markerList';
                $scope.show_monthly_list = false;
                $scope.monthlyNextStep = function (page) {
                    $scope.account_overdue.select_all = false;
                    $scope.show_monthly_list = true;
                    $scope.expired_date = $filter('date')($scope.account_overdue.date, 'yyyy-MM-dd HH:mm:ss');
                    var condition_copy = angular.copy($scope.account_overdue);
                    var condition = {
                        loanBusiness: {
                            agent_code: "",
                            loan_seqnumber: ""
                        },
                        agentGroup: {
                            agent_group_name: ""
                        },
                        date: "",
//                    shiftMark : {
//                        year_month : ""
//                    },
                        loan_days: "",
                        marker_seqnumber: ""
                    }
                    if (condition_copy.agentInfo.agent_code) {
                        condition.loanBusiness.agent_code = condition_copy.agentInfo.agent_code;
                    }
                    if (condition_copy.agentGroup.agent_group_name) {
                        condition.agentGroup.agent_group_name = condition_copy.agentGroup.agent_group_name;
                    }
                    if (condition_copy.date) {
                        condition.date = $filter('date')(condition_copy.date, 'yyyy-MM-dd HH:mm:ss');
                    }
                    if (condition_copy.loan_days) {
                        condition.loan_days = condition_copy.loan_days;
                    }
                    if (condition_copy.marker_seqnumber) {
                        condition.marker_seqnumber = condition_copy.marker_seqnumber;
                    }
                    if (condition_copy.agentGroup.agent_group_name) {
                        if ($scope.chk_loan_group.group2) {
                            condition.agentGroup.agent_group_name = condition.agentGroup.agent_group_name + "!";
                        } else {
                            condition.agentGroup.agent_group_name = condition.agentGroup.agent_group_name;
                        }
                    }
                    if (condition_copy.loanBusiness.loan_seqnumber) {
                        condition.loanBusiness.loan_seqnumber = condition_copy.loanBusiness.loan_seqnumber;
                    }
//                if(condition_copy.year_month){
//                    condition.shiftMark.year_month = $filter('date')(condition_copy.year_month, 'yyyy-MM') + '-01';
//                }else{
//                    condition.shiftMark.year_month = "";
//                }

                    $scope.pagination_monthly.select(page, globalFunction.generateUrlParams(condition, {agentGroup: {}})).$promise.then(function (marker_list) {
                        $scope.marker_list = marker_list;
//                   $scope.check_true_IDS = _.pluck($scope.check_marker_true,'id');
//                   _.each($scope.marker_list, function (ml) {
//                           if ($scope.check_true_IDS.length > 0) {
//                               if ($scope.check_true_IDS.indexOf(ml.id) == -1) {
//                                   ml.selected = false;
//                               } else {
//                                   ml.selected = true;
//                               }
//                           } else {
//                               ml.selected = false;
//                           }
//                   });
                    });
                }


                //全选\取消按钮事件
//            $scope.monthly_select_all = function(){
//                if($scope.account_overdue.select_all){
//                    _.each($scope.marker_list, function (ml) {
//                        ml.selected = true;
//                        $scope.check_marker_true.push({id:ml.id});
//                    });
//                }else{
//                    _.each($scope.marker_list, function (ml){
//                        ml.selected = false;
//                    });
//                    $scope.check_marker_true = [];
//                }
//            }
//            //单个复选框选中取消
//            $scope.check_one = function(ml){
//                if(ml.selected){
//                    $scope.check_marker_true.push({id:ml.id});
//                }else{
//                    $scope.check_marker_true.splice(_.pluck($scope.check_marker_true,'id').indexOf(ml.id),1);
//                }
//            }

                $scope.reset_nextstep = function () {
                    $scope.account_overdue.select_all = false;
                    $scope.marker_list = [];
                    $scope.check_marker_true = [];
                    $scope.show_monthly_list = false;
                    $scope.chk_loan_group.group2 = "";
                    $scope.account_overdue = angular.copy(init_account_overdue);
                }

//            //月结全选
                $scope.monthly_select_all = function () {
                    _.each($scope.marker_list, function ($that, $key) {
                        $scope.marker_list[$key].selected = !!$scope.account_overdue.select_all;
                    })
                }

                //月結
                $scope.monthly_isDisabled = false;
                $scope.monthly = function () {
                    if ($scope.monthly_isDisabled) {
                        return;
                    }
                    var account_overdues = {
                        date: getDate($scope.account_overdue.date, true),
                        year_month: $filter('date')($scope.account_overdue.year_month, 'yyyy-MM'),
                        agent_id: $scope.account_overdue.agent_id,
                        agent_group_id: $scope.account_overdue.agent_group_id,
                        pin_code: $scope.account_overdue.pin_code,
                        markers: []
                    }

                    if (account_overdues.agent_group_id && account_overdues.agent_id) {
                        delete account_overdues.agent_group_id;
                    }
//                _.each($scope.check_marker_true, function($that, $key){
                    _.each($scope.marker_list, function ($that, $key) {
                        if ($that.selected) {
                            account_overdues.markers.push({
                                marker_id: $that.id
                            })
                        }
                    });
                    if (account_overdues.year_month)
                        account_overdues.year_month = account_overdues.year_month + "-01";
                    if (account_overdues.markers.length == 0) {
                        topAlert.warning("請選擇截息記錄。");
                        return;
                    }
                    $scope.monthly_isDisabled = true;
                    $scope.form_overdue.checkValidity().then(function () {
                        markerExpiredFee.calculateFee(account_overdues, function () {
                            $scope.reset_month();
                            $scope.monthlyNextStep();
                            topAlert.success("截息成功");
//                        $scope.select(); // 刷新总表
                            $scope.monthly_isDisabled = false;
                        }, function () {
                            $scope.monthly_isDisabled = false;
                        })
                    });
                }

                $scope.reset_month = function () {
                    $scope.account_overdue.select_all = false;
                    $scope.monthly_select_all();
                    //$scope.account_overdue = angular.copy(init_account_overdue);
                }


                //跳转至贷款详细
                $scope.loan_detail = function (id) {
                    marker.get({id: id}).$promise.then(function (_marker) {
                        $location.path('loan/detail/' + _marker.loan_business_id);
                    });
                }

                //監控戶口編號
                $scope.$watch("account_overdue.agentInfo.agent_code", globalFunction.debounce(function (new_value, old_value) {
                    if (new_value) {
                        agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function (agent) {
                            if (agent.length > 0) {
                                $scope.account_overdue.agent_name = agent[0].agent_name;
                                $scope.account_overdue.agent_id = agent[0].id;
                            } else {
                                $scope.account_overdue.agent_name = "";
                                $scope.account_overdue.agent_id = "";
                            }
                        });
                    } else {
                        $scope.account_overdue.agent_name = "";
                        $scope.account_overdue.agent_id = "";
                    }
                }));
                $scope.$watch("account_overdue.agentGroup.agent_group_name", globalFunction.debounce(function (new_value, old_value) {
                    if (new_value) {
                        agentGroup.query(globalFunction.generateUrlParams({agent_group_name: new_value}, {})).$promise.then(function (groups) {
                            if (groups.length > 0) {
                                $scope.account_overdue.agent_group_id = groups[0].id;
                                agentsLists.query(globalFunction.generateUrlParams({agent_code: groups[0].owner_name}, {})).$promise.then(function (agents) {
                                    if (agents.length > 0) {
                                        $scope.group = agents[0];
                                        $scope.account_overdue.agent_group = agents[0].agent_name;
                                    } else {
                                        $scope.account_overdue.agent_group = "";
                                    }
                                });
                            } else {
                                $scope.account_overdue.agent_group_id = "";
                                $scope.account_overdue.agent_group = "";
                            }
                        });
                    } else {
                        $scope.account_overdue.agent_group_id = "";
                        $scope.account_overdue.agent_group = "";
                    }
                }));

                //手續費確認
                //搜索條件
                var init_fee_condition = {
                    marker_seqnumber: "",
                    loan_agent_code: "",
//                top_agent : "",
                    status: "2",
                    agent_group_name: "",
                    end_date: ["", ""]
                };
                $scope.fee_condition = angular.copy(init_fee_condition);
                $scope.account_overdue.cheked_all = false;
                //過期手續費
                $scope.pagination_fee = tmsPagination.create();
                $scope.pagination_fee.resource = markerExpiredFee;
                $scope.pagination_fee.query_method = 'markerExpiredFeeTotal';
                $scope.select_fee = function (page) {
                    var condition_fee_copy = angular.copy($scope.fee_condition);
                    if (condition_fee_copy.agent_group_name) {
                        if ($scope.chk_loan_group.group1) {
                            condition_fee_copy.agent_group_name = condition_fee_copy.agent_group_name + "!";
                        } else {
                            condition_fee_copy.agent_group_name = condition_fee_copy.agent_group_name;
                        }
                    }
                    condition_fee_copy.end_date[0] = condition_fee_copy.end_date[0] ? $filter('date')(condition_fee_copy.end_date[0], 'yyyy-MM-dd') : "";
                    condition_fee_copy.end_date[1] = condition_fee_copy.end_date[0] ? $filter('date')(condition_fee_copy.end_date[1], 'yyyy-MM-dd') : "";
                    $scope.excel_condition = {
                        hall_id: $scope.user.hall.hall_type != 1 ? $scope.user.hall.id : "",
                        hall_name: $scope.user.hall.hall_type != 1 ? $scope.user.hall.hall_name : "",
                        marker_seqnumber: condition_fee_copy.marker_seqnumber,
                        loan_agent_code: condition_fee_copy.loan_agent_code,
                        end_date_min: condition_fee_copy.end_date[0],
                        end_date_max: condition_fee_copy.end_date[1],
                        status: condition_fee_copy.status,
                        agentGroup: {
                            agent_group_name: condition_fee_copy.agent_group_name
                        }
                    }
                    $scope.markerExpiredFeesConfirms = $scope.pagination_fee.select(page, condition_fee_copy);
                }
                $scope.select_fee();
                $scope.reset_fee = function () {
                    $scope.fee_condition = angular.copy(init_fee_condition);
                    $scope.chk_loan_group.group1 = "";
                    $scope.select_fee();
                }

                //詳細
                $scope.confirm_detail = function (marker) {
                    var confirm_modal;
                    confirm_modal = $modal.open({
//                    templateUrl: "views/loan/fee-confirm.html",
//                    controller: 'feeConfirmCtrl',
                        templateUrl: "views/loan/new-fee-confirm.html",
                        controller: 'newFeeConfirmCtrl',
                        windowClass: 'xlg-modal',
                        resolve: {
                            markerExpiredFee_data: function () {
                                return marker;
                            }
                        }
                    });

                    confirm_modal.result.then(function (status) {
                        if (status)
                            $scope.select_fee();
                    });
                }

                //
                //全選
                $scope.marker_check_all = function (selected) {
                    _.each($scope.markerExpiredFeesConfirms, function (mf) {
                        if (mf.status == 2) {
                            mf.selected = !selected;
                        }

                    });
                }
                //判斷子項全部選中之後勾選權限CheckBox
                $scope.is_checkbox_item = function () {
                    var selected_len = _.where($scope.markerExpiredFeesConfirms, {selected: true}).length;
                    $scope.cheked_all = $scope.markerExpiredFeesConfirms.length == selected_len;
                }
                //確認
                $scope.marker_ok = function (id) {
                    var marker_fee = {
                        markerExpiredFeesConfirms: []
                    }
                    _.each($scope.markerExpiredFeesConfirms, function ($that, $key) {
                        if ($that.selected) {
                            marker_fee.markerExpiredFeesConfirms.push({
                                id: $that.id
                            })
                        }
                    });
                    if (marker_fee.markerExpiredFeesConfirms.length == 0) {
                        topAlert.warning("請勾選要確認的記錄。");
                        return;
                    }
                    pinCodeModal(markerExpiredFee, 'markerExpiredFeeConfirm', marker_fee, '手續費確認成功！').then(function () {
                        $scope.select_fee();
                        $scope.account_overdue.cheked_all = false;
                    })
                }


            }]).controller('loanAccountOverdueChargeAdjustCtrl', ['$scope', '$filter', '$location', '$modal', 'globalFunction', 'tmsPagination', 'pinCodeModal', 'currentShift', 'agentsLists', 'markerExpiredFee', 'markerFeeRepayAssign', 'markerExpiredFeeAdjustRecord', 'goBackData', 'markerFeeRepayment', 'markerfeeoutagentremark', 'user',
            function ($scope, $filter, $location, $modal, globalFunction, tmsPagination, pinCodeModal, currentShift, agentsLists, markerExpiredFee, markerFeeRepayAssign, markerExpiredFeeAdjustRecord, goBackData, markerFeeRepayment, markerfeeoutagentremark, user) {

                $scope.chk_group = {group1: "", group2: ""};
                $scope.chk_group_assignment = {group1: "", group2: ""}
                //搜索條件
                var init_condition = {
                    marker_seqnumber: "",
                    loan_agent_code: "",
                    outAgent: {
                        agent_code: ""
                    },
                    inAgent: {
                        agent_code: ""
                    },
                    agentGroup: {
                        agent_group_name: ""
                    },
                    is_show: "1",
//                    fee:"|0",
//                    is_compute:"0",//是否是计算生成
                    year_month: [""],//currentShift.data.year_month
//                end_date : [currentShift.data.shift_date],
                    status: "",
                    fee_type: "",
                    is_group: "",
                    markerExpiredFeeConfirm: {status: "1"},
                    hall_id: $scope.user.hall.hall_type != 1 ? $scope.user.hall.id : "",
                    /*outAgent: {
                     agent_code : ""
                     },
                     marker : {
                     loanBusiness : {
                     loan_seqnumber : ""
                     }
                     },*/
//                    top_agent : "",
                    sort: "marker_seqnumber NUMASC,loan_date ASC"

                };
                //搜索條件
                var init_condition_assign = {
                    marker_seqnumber: "",
                    loan_agent_code: "",
                    outAgent: {
                        agent_code: ""
                    },
                    inAgent: {
                        agent_code: ""
                    },
                    agentGroup: {
                        agent_group_name: ""
                    },
                    pay_year_month: [""],
                    year_month: [""],//currentShift.data.year_month
                    fee_type: "",
                    is_group: "",
                    hall_id: $scope.user.hall.hall_type != 1 ? $scope.user.hall.id : "",
                    sort: "marker_seqnumber NUMASC,loan_date ASC"
                };
                $scope.condition = angular.copy(init_condition);
                $scope.condition_assignment = angular.copy(init_condition_assign);//分派

                //
                $scope.select_types = [];
                $scope.select_assignment_types = [];
                $scope.selectTypes = [{id: 1, name: "還款"}, {id: 2, name: "截息"}];//,{id:3,name:"抵押"}
                $scope.$watch('select_types', function (new_value) {
                    $scope.condition.fee_type = "";
                    if (new_value) {
                        $scope.condition.fee_type += '#';
                        _.each($scope.select_types, function ($type, $key) {
                            $scope.condition.fee_type += $type;
                            if ($key != $scope.select_types.length - 1) {
                                $scope.condition.fee_type += ',';
                            }
                        })
                    }
                });
                $scope.$watch('select_assignment_types', function (new_value) {
                    $scope.condition_assignment.fee_type = "";
                    if (new_value) {
                        $scope.condition_assignment.fee_type += '#';
                        _.each($scope.select_assignment_types, function ($type, $key) {
                            $scope.condition_assignment.fee_type += $type;
                            if ($key != $scope.select_assignment_types.length - 1) {
                                $scope.condition_assignment.fee_type += ',';
                            }
                        })
                    }
                });
                //
                $scope.select_status = [];
                $scope.selectStatus = [{id: 1, name: "未還款"}, {id: 2, name: "部分還款"}, {id: 3, name: "已還款"}, {
                    id: 4,
                    name: "代付"
                }];
                $scope.$watch('select_status', function (new_value) {
                    $scope.condition.status = "";
                    if (new_value) {
                        $scope.condition.status += '#';
                        _.each($scope.select_status, function ($type, $key) {
                            $scope.condition.status += $type;
                            if ($key != $scope.select_status.length - 1) {
                                $scope.condition.status += ',';
                            }
                        })
                    }
                });
                //過期手續費
                $scope.pagination = tmsPagination.create();
                $scope.pagination.resource = markerExpiredFee;
                $scope.select = function (page) {
                    var condition_copy = angular.copy($scope.condition);
                    if ($scope.condition.year_month[0]) {
                        condition_copy.year_month[0] = $filter('date')(condition_copy.year_month[0], 'yyyy-MM');
                    } else {
                        condition_copy.year_month[0] = "";
                    }
                    if ($scope.condition.inAgent.agent_code) {
                        condition_copy.inAgent.agent_code = "#" + $scope.condition.inAgent.agent_code;
                    }
                    if ($scope.condition.year_month[0]) {
                        $scope.condition.year_month[0] = $scope.condition.year_month[0] ? $filter('date')($scope.condition.year_month[0], 'yyyy-MM') : "";
                    }
                    if ($scope.select_types.length == 0) {
                        condition_copy.fee_type = "";
                    }
                    if (condition_copy.agentGroup.agent_group_name) {
                        if ($scope.chk_group.group1) {
                            condition_copy.agentGroup.agent_group_name = condition_copy.agentGroup.agent_group_name + "!";
                        } else {
                            condition_copy.agentGroup.agent_group_name = condition_copy.agentGroup.agent_group_name;
                        }
                    }

                    if ($scope.select_status.length == 0) {
                        condition_copy.status = "";
                    }
                    $scope.excel_condition = {
                        hall_id: $scope.user.hall.hall_type != 1 ? $scope.user.hall.id : "",
                        hall_name: $scope.user.hall.hall_type != 1 ? $scope.user.hall.hall_name : "",
                        marker_seqnumber: $scope.condition.marker_seqnumber,
                        loan_agent_code: $scope.condition.loan_agent_code,
                        outAgent_agent_code: $scope.condition.outAgent.agent_code ? $scope.condition.outAgent.agent_code : "",
                        inAgent_agent_code: $scope.condition.inAgent.agent_code ? $scope.condition.inAgent.agent_code : "",
                        year_month: $scope.condition.year_month,
                        status: condition_copy.status,
                        fee_type: condition_copy.fee_type,
                        top_agent: "",
                        agentGroup: {
                            agent_group_name: condition_copy.agentGroup.agent_group_name
                        },
                        sort: "end_date DESC,outAgent.agent_code NUMASC,hall_id ASC,year_month DESC"
                    }
                    $scope.markerExpiredFees = $scope.pagination.select(page, globalFunction.generateUrlParams(condition_copy, {
                        markerExpireFeeConfirm: {},
                        markerExpiredFeeRepayment: {}
                    }));
                    markerExpiredFee.expiredFeeTotal(globalFunction.generateUrlParams(condition_copy, {})).$promise.then(function (data) {
                        $scope.fee_total = data;
                    })

                }
                $scope.select();
                $scope.reset = function () {
                    $scope.condition = angular.copy(init_condition);
                    //$scope.form_search.$setPristine();
                    $scope.select_status = [];
                    $scope.select_types = [];
                    $scope.chk_group.group1 = "";
                    $scope.select();
                }
                //分派流水記錄
                //過期手續費
                $scope.pagination_assignment = tmsPagination.create();
                $scope.pagination_assignment.resource = markerFeeRepayAssign;
                $scope.search_assignment = function (page) {
                    var condition_assignment_copy = angular.copy($scope.condition_assignment);
                    if ($scope.condition_assignment.year_month[0]) {
                        condition_assignment_copy.year_month[0] = $filter('date')(condition_assignment_copy.year_month[0], 'yyyy-MM');
                    } else {
                        condition_assignment_copy.year_month[0] = "";
                    }
                    if ($scope.condition_assignment.pay_year_month[0]) {
                        condition_assignment_copy.pay_year_month[0] = $filter('date')(condition_assignment_copy.pay_year_month[0], 'yyyy-MM');
                    } else {
                        condition_assignment_copy.pay_year_month[0] = "";
                    }
                    if ($scope.condition_assignment.inAgent.agent_code) {
                        condition_assignment_copy.inAgent.agent_code = "#" + $scope.condition_assignment.inAgent.agent_code;
                    }
                    if ($scope.condition_assignment.year_month[0]) {
                        condition_assignment_copy.year_month[0] = $scope.condition_assignment.year_month[0] ? $filter('date')($scope.condition_assignment.year_month[0], 'yyyy-MM') : "";
                    }
                    if ($scope.select_assignment_types.length == 0) {
                        condition_assignment_copy.fee_type = "";
                    }
                    if (condition_assignment_copy.agentGroup.agent_group_name) {
                        if ($scope.chk_group_assignment.group1) {
                            condition_assignment_copy.agentGroup.agent_group_name = condition_assignment_copy.agentGroup.agent_group_name + "!";
                        } else {
                            condition_assignment_copy.agentGroup.agent_group_name = condition_assignment_copy.agentGroup.agent_group_name;
                        }
                    }

                    $scope.excel_condition = {
                        hall_id: $scope.user.hall.hall_type != 1 ? $scope.user.hall.id : "",
                        hall_name: $scope.user.hall.hall_type != 1 ? $scope.user.hall.hall_name : "",
                        marker_seqnumber: $scope.condition_assignment.marker_seqnumber,
                        loan_agent_code: $scope.condition_assignment.loan_agent_code,
                        outAgent_agent_code: $scope.condition_assignment.outAgent.agent_code ? $scope.condition_assignment.outAgent.agent_code : "",
                        inAgent_agent_code: $scope.condition_assignment.inAgent.agent_code ? $scope.condition_assignment.inAgent.agent_code : "",
                        year_month: $scope.condition_assignment.year_month,
                        pay_year_month: condition_assignment_copy.pay_year_month[0],
                        fee_type: condition_assignment_copy.fee_type,
                        status: "",
                        top_agent: "",
                        agentGroup: {
                            agent_group_name: condition_assignment_copy.agentGroup.agent_group_name
                        }
//                        sort:"end_date DESC,outAgent.agent_code NUMASC,hall_id ASC,year_month DESC"
                    }
                    $scope.markerExpiredAssignmentFees = $scope.pagination_assignment.select(page, globalFunction.generateUrlParams(condition_assignment_copy, {markerFeeRepayment: {}}));

                }
                $scope.search_assignment();
                $scope.reset_assignment = function () {
                    $scope.condition_assignment = angular.copy(init_condition_assign);
                    //$scope.form_search.$setPristine();
                    $scope.select_assignment_types = [];
                    $scope.chk_group_assignment.group1 = "";
                    $scope.search_assignment();
                }


                $scope.addRemarkbtnshow = true;
                $scope.addAssignmetRemarkbtnshow = true;
                $scope.out_agent_id = "";
                $scope.$watch('condition.outAgent.agent_code', globalFunction.debounce(function (new_value, old_value) {
                    if (new_value) {
                        agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function (agents) {
                            if (agents.length > 0) {
                                $scope.addRemarkbtnshow = false;
                                $scope.out_agent_id = agents[0].id;
                                markerfeeoutagentremark.query({out_agent_id: agents[0].id}).$promise.then(function (remarks) {
                                    $scope.remarks = remarks;
                                })
                            } else {
                                $scope.addRemarkbtnshow = true;
                                $scope.out_agent_id = "";
                                $scope.remarks = [];
                            }
                        });
                    } else {
                        $scope.out_agent_id = "";
                        $scope.addRemarkbtnshow = true;
                        $scope.remarks = [];
                    }
                }, 350));
//                $scope.$watch('condition_assignment.outAgent.agent_code',globalFunction.debounce(function(new_value,old_value){
//                    if(new_value){
//                        agentsLists.query(globalFunction.generateUrlParams({agent_code:new_value}, {})).$promise.then(function (agents) {
//                            if(agents.length > 0){
//                                $scope.addAssignmetRemarkbtnshow=false;
//                                $scope.out_agent_id = agents[0].id;
//                                markerfeeoutagentremark.query({out_agent_id:agents[0].id}).$promise.then(function(remarks){
//                                    $scope.remarks = remarks;
//                                })
//                            }else{
//                                $scope.addAssignmetRemarkbtnshow=true;
//                                $scope.out_agent_id = "";
//                                $scope.remarks = [];
//                            }
//                        });
//                    }else{
//                        $scope.out_agent_id = "";
//                        $scope.addAssignmetRemarkbtnshow=true;
//                        $scope.remarks = [];
//                    }
//                },350));
                //新增備註
                $scope.addRemark = function (remark) {
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/loan/remark-create.html",
                        controller: 'loanRemarkCtrl',
                        resolve: {
                            agent_code: function () {
                                return $scope.condition.outAgent.agent_code
                            },
                            remark: function () {
                                return remark
                            },
                            out_agent_id: function () {
                                return $scope.out_agent_id
                            }
                        }
                    });
                    modalInstance.result.then((function (status) {
                        if (status && $scope.out_agent_id)
                            markerfeeoutagentremark.query({out_agent_id: $scope.out_agent_id}).$promise.then(function (remarks) {
                                $scope.remarks = remarks;
                            })
                    }));
                }
                $scope.delRemark = function (id) {
                    pinCodeModal(markerfeeoutagentremark, 'delete', {id: id}, '刪除成功！').then(function () {
                        if ($scope.out_agent_id) {
                            markerfeeoutagentremark.query({out_agent_id: $scope.out_agent_id}).$promise.then(function (remarks) {
                                $scope.remarks = remarks;
                            })
                        }
                    })
                }
                //新增手續費
                $scope.addFees = function () {
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/loan/feeds-create.html",
                        controller: 'feedsCreateCtrl'
                    });
                    modalInstance.result.then((function (status) {
                        if (status) {
                            $scope.select();
                        }
                    }), function () {
                        $log.info("Modal dismissed at: " + new Date());
                    });
                }

                //減免
                $scope.reduction = function (markerFee) {
                    /*if(!$scope.overdue_charge){
                     return;
                     }*/
                    var reduction_modal;
                    reduction_modal = $modal.open({
                        templateUrl: "views/loan/loan-reduction.html",
                        controller: 'loanReductionCtrl',
                        windowClass: 'sm-modal',
                        resolve: {
                            markerExpiredFee_data: function () {
                                return markerFee;
                            }
                        }
                    });

                    reduction_modal.result.then(function () {
                        $scope.select_fee();
                    });
                }


                //代付
                $scope.payment = function (marker) {
                    pinCodeModal(markerExpiredFee, 'payForAnother', {expired_fee_id: marker.id}, '代付成功！').then(function () {
                        $scope.select();
                    })
                }
                //搜索條件
                var init_condition_record = {
                    out_agent_code: "",
                    repayment_time: ["", ""],
                    type: "1"

                };
                $scope.condition_record = angular.copy(init_condition_record);
                $scope.condition_record = goBackData.get('condition', $scope.condition_record);
                $scope.excel_condition_record = angular.copy($scope.condition_record);

                if (!_.isEqual(init_condition_record, $scope.condition_record)) {
                    $scope.tab = {
                        total: false,
                        record: true,
                        monthly: false
                    }
                }
                //收付記錄的廳館條件搜索
                $scope.select_halls = [];
                $scope.$watch('select_halls', function (new_value) {
                    if (user.isAllHall()) {
                        $scope.condition_record.hall_id = "";
                        if (new_value) {
                            $scope.condition_record.hall_id += '#';
                            _.each($scope.select_halls, function ($hall_id, $key) {
                                $scope.condition_record.hall_id += $hall_id;
                                if ($key != $scope.select_halls.length - 1) {
                                    $scope.condition_record.hall_id += ',';
                                }
                            })
                        }
                    }
                });
                //手续费收付记录
                $scope.pagination_record = tmsPagination.create();
                $scope.pagination_record.resource = markerFeeRepayment;
                $scope.select_record = function (page) {
                    var condition_copy = angular.copy($scope.condition_record);
                    goBackData.set('condition', condition_copy);
                    if (condition_copy.type == 1) {
                        condition_copy.not_assign_amount = "|0";
                    } else if (condition_copy.type == 2) {
                        condition_copy.not_assign_amount = "0";
                    } else {
                        condition_copy.not_assign_amount = "";
                    }
                    if ($scope.select_halls.length == 0) {
                        condition_copy.hall_id = "";
                    }
                    if ($scope.condition_record.repayment_time[0]) {
                        condition_copy.repayment_time[0] = $filter('date')(condition_copy.repayment_time[0], 'yyyy-MM-dd');
                    }
                    if ($scope.condition_record.repayment_time[1]) {
                        condition_copy.repayment_time[1] = $filter('date')(condition_copy.repayment_time[1], 'yyyy-MM-dd');
                    }
                    delete condition_copy.type;
                    $scope.excel_condition_record = angular.copy(condition_copy);
                    $scope.markerFeeRepayments = $scope.pagination_record.select(page, condition_copy);
                }
                $scope.select_record();

                $scope.reset_record = function () {
                    $scope.condition_record = angular.copy(init_condition_record);
                    $scope.select_halls = [];
                    $scope.select_record();
                }
                $scope.detail = function (id) {
                    $location.path('loan/account-overdue-charge-detail/' + id);
                }

                //回滚方法
                $scope.rollback = function (id, type) {
                    var confirm_modal;
                    confirm_modal = $modal.open({
                        templateUrl: "views/loan/marker-fee-remark.html",
                        controller: 'markerFeeRemarkCtrl',
                        windowClass: 'ng-modal',
                        resolve: {
                            id: function () {
                                return id;
                            },
                            type: function () {
                                return type;
                            }
                        }
                    });
                    confirm_modal.result.then(function (status) {
                        if (status)
                            $scope.select_record();
                    });
                }

                //退款
                $scope.refund = function (marker) {
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/loan/refund.html",
                        controller: 'refundCtrl',
                        resolve: {
                            marker: function () {
                                return marker
                            }
                        }
                    });
                    modalInstance.result.then((function (status) {
                        if (status) {
                            $scope.select_record();
                        }
                    }));
                }
                //退款記錄
                $scope.refundReord = function (marker) {
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/loan/refund-record.html",
                        controller: 'refundRecordCtrl',
                        windowClass: 'lg-modal',
                        resolve: {
                            marker: function () {
                                return marker
                            }
                        }
                    });
                    modalInstance.result.then((function (status) {
                        if (status) {
                            $scope.select_record();
                        }
                    }));
                }


                //手續費調整記錄markerExpiredFeeAdjustRecord
                //搜索條件
                var init_adjust_condition = {
                    markerExpiredFee: {
                        marker_seqnumber: "",
                        loan_agent_code: "",
                        outAgent: {
                            agent_code: ""
                        },
                        inAgent: {
                            agent_code: ""
                        },
                        year_month: [currentShift.data.year_month],
                        fee_type: "",
                        top_agent: ""
                    },
                    agentGroup: {agent_group_name: ""},
                    operation_type: "",
                    sort: "markerExpiredFee.outAgent.agent_code NUMASC,markerExpiredFee.hall_id ASC,markerExpiredFee.year_month DESC"
                };
                $scope.adjust_condition = angular.copy(init_adjust_condition);
                //收付記錄的廳館條件搜索
                $scope.select_fee_types = [];
                $scope.selectFeeTypes = [{id: 1, name: "還款"}, {id: 2, name: "截息"}];//,{id:3,name:"抵押"}
                $scope.$watch('select_fee_types', function (new_value) {
                    $scope.adjust_condition.markerExpiredFee.fee_type = "";
                    if (new_value) {
                        $scope.adjust_condition.markerExpiredFee.fee_type += '#';
                        _.each($scope.select_fee_types, function ($type, $key) {
                            $scope.adjust_condition.markerExpiredFee.fee_type += $type;
                            if ($key != $scope.select_fee_types.length - 1) {
                                $scope.adjust_condition.markerExpiredFee.fee_type += ',';
                            }
                        })
                    }
                });
                //過期手續費
                $scope.pagination_adjust = tmsPagination.create();
                $scope.pagination_adjust.resource = markerExpiredFeeAdjustRecord;
                $scope.select_adjust = function (page) {
                    var condition_adjust_copy = angular.copy($scope.adjust_condition);
                    if ($scope.adjust_condition.markerExpiredFee.year_month[0]) {
                        condition_adjust_copy.markerExpiredFee.year_month[0] = $filter('date')(condition_adjust_copy.markerExpiredFee.year_month[0], 'yyyy-MM');
                    } else {
                        condition_adjust_copy.markerExpiredFee.year_month[0] = "";
                    }

                    if ($scope.adjust_condition.markerExpiredFee.year_month[0]) {
                        $scope.adjust_condition.markerExpiredFee.year_month[0] = $scope.adjust_condition.markerExpiredFee.year_month[0] ? $filter('date')($scope.adjust_condition.markerExpiredFee.year_month[0], 'yyyy-MM') : "";
                    }
                    if ($scope.select_fee_types.length == 0) {
                        condition_adjust_copy.markerExpiredFee.fee_type = "";
                    }
                    if ($scope.adjust_condition.markerExpiredFee.inAgent.agent_code) {
                        condition_adjust_copy.markerExpiredFee.inAgent.agent_code = "#" + $scope.adjust_condition.markerExpiredFee.inAgent.agent_code;
                    }
                    if (condition_adjust_copy.agentGroup.agent_group_name) {
                        if ($scope.chk_group.group2) {
                            condition_adjust_copy.agentGroup.agent_group_name = condition_adjust_copy.agentGroup.agent_group_name + "!";
                        } else {
                            condition_adjust_copy.agentGroup.agent_group_name = condition_adjust_copy.agentGroup.agent_group_name;
                        }
                    }
                    $scope.markerExpiredFeesAdjustRecords = $scope.pagination_adjust.select(page, globalFunction.generateUrlParams(condition_adjust_copy, {markerExpiredFee: {}}));//condition_adjust_copy
                }
//            $scope.select_adjust();

                $scope.reset_adjust = function () {
                    $scope.adjust_condition = angular.copy(init_adjust_condition);
                    $scope.select_fee_types = [];
                    $scope.chk_group.group2 = "";
                    $scope.select_adjust();
                }
            }])
        .controller('refundRecordCtrl', [
            '$scope', 'globalFunction', 'tmsPagination', 'topAlert', '$modalInstance', 'markerFeeRepayRefund', 'marker', 'repaymentMethod',
            function ($scope, globalFunction, tmsPagination, topAlert, $modalInstance, markerFeeRepayRefund, marker, repaymentMethod) {
                $scope.repaymentMethod = repaymentMethod.items;
                $scope.pagination = tmsPagination.create();
                $scope.pagination.resource = markerFeeRepayRefund;
                $scope.select = function (page) {
                    $scope.pagination.select(page, globalFunction.generateUrlParams({marker_fee_repay_id: marker.id}, {})).$promise.then(function (data) {
                        $scope.markerFeeRepayRefunds = data;
                    });
                }
                $scope.select();

                //關閉
                $scope.close = function () {
                    $modalInstance.close();
                }

            }])
        .controller('loanRemarkCtrl', [
            '$scope', 'globalFunction', 'agent_code', 'markerfeeoutagentremark', 'topAlert', 'remark', '$modalInstance', 'out_agent_id',
            function ($scope, globalFunction, agent_code, markerfeeoutagentremark, topAlert, remark, $modalInstance, out_agent_id) {
                $scope.loan_remark_url = globalFunction.getApiUrl('loan/markerfeeoutagentremark');
                $scope.agent_code = agent_code;
                $scope.sub_post = 'POST';
                $scope.remark = {
                    id: "",
                    out_agent_id: out_agent_id,
                    content: "",
                    pin_code: ''
                };
                if (remark) {
                    $scope.remark.content = remark.content;
                    $scope.remark.id = remark.id;
                    $scope.sub_post = 'PUT';
                }

                $scope.reset = function () {
                    $scope.remark.content = $scope.remark.pin_code = "";
                }

                $scope.add = function () {
                    if ($scope.disabled_submit) {
                        return $scope.disabled_submit;
                    }
                    if ($scope.remark.id) {
                        var remark = {
                            id: $scope.remark.id,
                            content: $scope.remark.content,
                            pin_code: $scope.remark.pin_code
                        }
                        $scope.form_loan_remark.checkValidity().then(function () {
                            $scope.disabled_submit = true;
                            markerfeeoutagentremark.update(remark, function () {
                                topAlert.success("備註修改成功！");
                                $modalInstance.close(true);
                                $scope.disabled_submit = false;
                            }, function () {
                                $scope.disabled_submit = false;
                            })
                        })
                    } else {
                        var remark = {
                            out_agent_id: $scope.remark.out_agent_id,
                            content: $scope.remark.content,
                            pin_code: $scope.remark.pin_code
                        }
                        $scope.form_loan_remark.checkValidity().then(function () {
                            $scope.disabled_submit = true;
                            markerfeeoutagentremark.save(remark, function () {
                                topAlert.success("備註新增成功！");
                                $modalInstance.close(true);
                                $scope.disabled_submit = false;
                            }, function () {
                                $scope.disabled_submit = false;
                            })
                        })
                    }
                }
            }
        ]).controller('delRemarkCtrl', [
            '$scope', 'id', 'markerfeeoutagentremark', 'topAlert', '$modalInstance',
            function ($scope, id, markerfeeoutagentremark, topAlert, $modalInstance) {
                $scope.data =
                {
                    id: id,
                    pin_code: ''
                }
                $scope.add = function () {
                    markerfeeoutagentremark.delete($scope.data, function () {
                        topAlert.success('刪除備註成功!')
                        $modalInstance.close();
                    })
                }


            }])
        .controller('refundCtrl', [
            '$scope', '$modalInstance', 'marker', 'agentsLists', 'globalFunction', 'depositCard', 'repaymentMethod', 'currentShift', 'user', 'topAlert', 'markerExpiredFee',
            function ($scope, $modalInstance, marker, agentsLists, globalFunction, depositCard, repaymentMethod, currentShift, user, topAlert, markerExpiredFee) {
                $scope.repaymentMethod = repaymentMethod.items;
                $scope.marker = marker;
                $scope.depositCards = [];
                $scope.transaction_amount = "";
                $scope.refund_url = globalFunction.getApiUrl('loan/markerexpiredfee/marker-fee-refund');
                $scope.user = user;
                $scope.refund = {
                    marker_fee_repayment_id: marker.id,
                    agent_code: marker.out_agent_code,
                    deposit_agent_info_id: "",
                    agent_info_id: marker.out_agent_id,
                    agentName: "",
                    deposit_type: "2",
                    deposit_card_id: "",
                    hall_id: currentShift.data.hall_id,
                    amount: Number(marker.not_assign_amount),
                    remark: "",
                    pin_code: ""
                }

                $scope.$watch('refund.agent_code', globalFunction.debounce(function (new_value, old_value) {
                    if (new_value) {
                        agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {})).$promise.then(function (agents) {
                            if (agents.length > 0) {
                                $scope.refund.deposit_agent_info_id = agents[0].id;
                                $scope.refund.agentName = agents[0].agent_name;
                                $scope.depositCards = [];
                                $scope.refund.deposit_card_id = "";
                                $scope.refund.deposit_type = "2";
                            } else {
                                $scope.refund.deposit_agent_info_id = "";
                                $scope.refund.agentName = "";
                                $scope.depositCards = [];
                                $scope.refund.deposit_card_id = "";
                                $scope.refund.deposit_type = "";
                            }
                        });
                    } else {
                        $scope.refund.deposit_agent_info_id = "";
                        $scope.refund.agentName = "";
                        $scope.depositCards = [];
                        $scope.refund.deposit_card_id = "";
                        $scope.refund.deposit_type = "";
                    }
                }, 350));
                $scope.$watch('refund.deposit_type', function (new_value, old_value) {
                    if (new_value == 1) {//存卡
                        //查詢存卡類型
                        if ($scope.refund.agent_info_id) {
                            depositCard.query({agent_info_id: $scope.refund.deposit_agent_info_id}).$promise.then(function (depositCards) {
//                            $scope.depositCards = depositCards;
                                $scope.depositCards = _.filter(depositCards, function (depositCard) {
                                    return depositCard.hall_id == $scope.refund.hall_id;
                                });
                                var card_data = _.findWhere($scope.depositCards, {card_name: 'A'});
                                $scope.refund.deposit_card_id = card_data ? card_data.id : '';
                            });
                        }
                    } else {
                        $scope.depositCards = [];
                        $scope.refund.deposit_card_id = "";
                    }
                });

                $scope.$watch('refund.deposit_card_id', function (new_value, old_value) {
                    //查詢存卡餘額
                    if (new_value) {
                        var mortgage_data = _.findWhere($scope.depositCards, {id: new_value});
                        $scope.transaction_amount = mortgage_data.usable_amount;
                    } else {
                        $scope.transaction_amount = 0;
                    }
                })

                //還款
                $scope.disabled_submit = false;
                $scope.add = function () {
                    if ($scope.disabled_submit) {
                        return false;
                    }
//                if(parseFloat($scope.repayment.amount*10000) > parseFloat($scope.feeTotal.settlement_amount_total*10000)){
//                     topAlert.warning("還款金額不能大於未還手續費！");
//                     return;
//                }
//                    if($scope.refund.deposit_type == '1'){
                    if (parseFloat($scope.refund.amount) > parseFloat(marker.not_assign_amount)) {
                        topAlert.warning("退款金額不能大於未分派金額！");
                        return;
                    }
//                    }
                    $scope.disabled_submit = true;
                    $scope.form_refund.checkValidity().then(function () {
                        $scope.refund_copy = angular.copy($scope.refund);

                        delete $scope.refund_copy.agent_code;
//                    $scope.repayment_copy.amount = parseFloat($scope.repayment.amount/10000);
                        //還款成功
                        markerExpiredFee.markerFeeRefund($scope.refund_copy).$promise.then(function () {
                            topAlert.success('退款成功');
                            $modalInstance.close(true);
                            $scope.disabled_submit = true;
                        }, function () {
                            $scope.disabled_submit = false;
                        });
                    });
                };

                $scope.cancel = function () {
                    $modalInstance.close('');
                };


            }]).controller('markerFeeRemarkCtrl', [
            '$scope', '$modalInstance', 'globalFunction', 'topAlert', 'id', 'agentsLists', '$filter', 'markerExpiredFee', 'type',
            function ($scope, $modalInstance, globalFunction, topAlert, id, agentsLists, $filter, markerExpiredFee, type) {
                $scope.rollback_url = globalFunction.getApiUrl('loan/markerexpiredfee/marker-fee-rollback');


                //貸款單
                //$scope.mefee = markerExpiredFee_data;
                //$scope.mefee.marker = marker.get({id:markerExpiredFee_data.marker_id});
                $scope.rollback = {
                    marker_fee_repayment_id: id,
                    remark: "",
                    pin_code: ""
                }

                //還款
                $scope.submit = function () {
                    $scope.form_rollback.checkValidity().then(function () {
                        $scope.rollback_copy = angular.copy($scope.rollback);
                        //利息調整成功
                        if (type == 1) {//会计分派
                            markerExpiredFee.markerRollback($scope.rollback_copy).$promise.then(function () {
                                topAlert.success('手續費回滾成功');
                                $modalInstance.close(true);
                            });
                        } else {
                            markerExpiredFee.markerFeeRollback($scope.rollback_copy).$promise.then(function () {
                                topAlert.success('手續費回滾成功');
                                $modalInstance.close(true);
                            });
                        }

                    });
                };

                $scope.cancel = function () {
                    $modalInstance.close('');
                };
            }
        ])
    /**
     *  新增手續費
     */
        .controller('feedsCreateCtrl', ['$scope', '$filter', 'globalFunction', '$modalInstance', 'marker', 'markerExpiredFee', 'topAlert', 'agentsLists', 'getDays', 'getDate',
            function ($scope, $filter, globalFunction, $modalInstance, marker, markerExpiredFee, topAlert, agentsLists, getDays, getDate) {

                //create record
                var init_record = {
                    pin_code: "",
                    marker_id: "",
                    in_agent_id: "",
                    year_month: "",
                    start_date: "",
                    end_date: "",
                    days: "",
                    calc_amount: "",
                    rate: "",
                    fee: ""
                }
                $scope.record_create = angular.copy(init_record);

                var init_record_show = {
                    marker_seqnumber: "",
                    loan_time: "",
                    agent_code: "",
                    agent_name: "",
                    marker_amount: "",
                    //settlement_amount: "",
                    in_agent_code: "",
                    out_agent_code: "",
                    in_agent_name: "",
                    out_agent_name: ""
                }
                $scope.marker = angular.copy(init_record_show);

                //通過貸款單查詢貸款信息
                $scope.$watch('marker.marker_seqnumber', globalFunction.debounce(function (new_value, old_value) {
                    $scope.marker.marker_id = "";
                    $scope.marker.loan_time = "";
                    $scope.marker.agent_code = "";
                    $scope.marker.agent_name = "";
                    $scope.marker.marker_amount = "";
                    $scope.marker.settlement_amount = "";
                    $scope.record_create.calc_amount = "";
                    if (new_value) {
                        marker.query({marker_seqnumber: new_value}).$promise.then(function (_marker) {
                            if (_marker[0]) {
                                $scope.marker = _marker[0];
                                $scope.record_create.calc_amount = $scope.marker.settlement_amount;
                                $scope.record_create.marker_id = _marker[0].id;
                                $scope.marker.loan_time = $filter("date")(Date.parse($scope.marker.loan_time.replace(/-/g, "/")), 'yyyy-MM-dd HH:mm');
                                if ($scope.record_create.rate && $scope.record_create.days && $scope.record_create.days) {
                                    /* if($scope.record_create==0){
                                     $scope.record_create.calc_amount = $scope.marker.settlement_amount;
                                     }else{*/
                                    $scope.record_create.fee = $filter("parseTenThousand2")(Number($scope.marker.settlement_amount) * (Number($scope.record_create.rate) / 100) * Number($scope.record_create.days));
                                    //}
                                }
                            }
                        });
                    }
                }));

                $scope.$watch('marker.in_agent_code', globalFunction.debounce(function (new_value, old_value) {
                    $scope.record_create.in_agent_id = "";
                    $scope.marker.in_agent_name = "";
                    if (new_value) {
                        agentsLists.query({agent_code: new_value}).$promise.then(function (_agent) {
                            if (_agent[0]) {
                                var agent = _agent[0];
                                $scope.record_create.in_agent_id = agent.id;
                                $scope.marker.in_agent_name = agent.agent_name;
                            }
                        });
                    }
                }));

                $scope.$watch('marker.out_agent_code', globalFunction.debounce(function (new_value, old_value) {
                    $scope.record_create.out_agent_id = "";
                    $scope.marker.out_agent_name = "";
                    if (new_value) {
                        agentsLists.query({agent_code: new_value}).$promise.then(function (_agent) {
                            if (_agent[0]) {
                                var agent = _agent[0];
                                $scope.record_create.out_agent_id = agent.id;
                                $scope.marker.out_agent_name = agent.agent_name;
                            }
                        });
                    }
                }));


                //計算手續費金額
                $scope.$watch('record_create.rate', function (new_value, old_value) {
                    new_value = Number(new_value) < 0 ? "" : new_value;
                    if ($scope.record_create.calc_amount && $scope.record_create.days) {
                        if (new_value == 0) {
                            $scope.record_create.fee = 0;
                        } else {
                            $scope.record_create.fee = $filter("parseTenThousand2")(Number($scope.record_create.calc_amount) * (Number(new_value) / 100) * Number($scope.record_create.days));
                        }
                    }
                });

                //算計息天數
                $scope.date_change = function () {
                    if ($scope.record_create.start_date && $scope.record_create.end_date) {
                        var start_date = getDate($scope.record_create.start_date);
                        var end_date = getDate($scope.record_create.end_date);
                        if ($scope.record_create.start_date > $scope.record_create.end_date) {
                            topAlert.warning("計息開始時間不能大於計息結束時間");
                        } else {

                            $scope.record_create.days = getDays(start_date, end_date) + 1;
                            if ($scope.record_create.calc_amount && $scope.record_create.rate && $scope.record_create.days) {
                                $scope.record_create.fee = $filter("parseTenThousand2")(Number($scope.record_create.calc_amount) * (Number($scope.record_create.rate) / 100) * Number($scope.record_create.days));

                            }
                        }
                    }
                }

                //增加存卡記錄
                $scope.disabled_submit = false;
                $scope.feeds_url = globalFunction.getApiUrl('loan/markerexpiredfee');
                $scope.add = function () {
                    if ($scope.disabled_submit) {
                        return $scope.disabled_submit;
                    }
                    $scope.disabled_submit = true;
                    if ($scope.record_create.start_date > $scope.record_create.end_date) {
                        topAlert.warning("計息開始時間不能大於計息結束時間");
                        return false;
                    }
                    $scope.form_feeds_create.checkValidity().then(function () {
                        $scope.record_create.year_month = $filter("date")($scope.record_create.year_month, 'yyyy-MM')
                        $scope.record_create.start_date = getDate($scope.record_create.start_date);
                        $scope.record_create.end_date = getDate($scope.record_create.end_date);
                        markerExpiredFee.save($scope.record_create, function () {
                            $scope.reset();
                            topAlert.success("添加成功！");
                            $modalInstance.close(true);
                            $scope.disabled_submit = false;
                        }, function () {
                            $scope.disabled_submit = false;
                        })
                    })
                }
                //重置存卡數據
                $scope.cancel = function () {
                    $modalInstance.close();
                }

                $scope.reset = function () {
                    $scope.record_create = angular.copy(init_record);
                    $scope.marker = angular.copy(init_record_show);
                }
            }])
    /**
     *  減免
     */
        .controller('loanReductionCtrl', ['$scope', '$modalInstance', 'topAlert', 'globalFunction', 'markerExpiredFee_data', 'markerExpiredFee', '$filter',
            function ($scope, $modalInstance, topAlert, globalFunction, markerExpiredFee_data, markerExpiredFee, $filter) {

                var surplus_amount = markerExpiredFee_data.settlement_amount - markerExpiredFee_data.reduction_amount;
                $scope.mitigate_record = {
                    "marker_seqnumber": markerExpiredFee_data.marker_seqnumber,
                    "settlement_amount": Number(markerExpiredFee_data.settlement_amount), //尚欠手續費
                    "amount": "",   //減免手續費
                    "surplus_amount": surplus_amount == null ? 0 : surplus_amount,    //剩餘手續費
                    "remark": "",
                    "pin_code": ""
                }

                //計算剩餘手續費
                $scope.$watch('mitigate_record.amount', function (new_value, old_value) {
                    var settlement_amount = markerExpiredFee_data.settlement_amount == null || "" ? 0 : Number(markerExpiredFee_data.settlement_amount);
                    var new_value = new_value == null || "" || undefined ? 0 : Number(new_value);
                    if (new_value > $scope.mitigate_record.settlement_amount * 10000) {
                        new_value = $scope.mitigate_record.settlement_amount * 10000;
                        $scope.mitigate_record.amount = new_value ? $filter('parseYuan')(new_value) : "";
                    }
                    $scope.mitigate_record.surplus_amount = ($scope.mitigate_record.settlement_amount * 10000 - new_value).toFixed(2).replace(".00", "");
                });

                $scope.loan_reduction_url = globalFunction.getApiUrl("loan/markerexpiredfee/mitigate-expired-fee");
                $scope.isDisabled = false;
                $scope.reduction_ok = function () {
                    var record = {
                        "expired_fee_id": markerExpiredFee_data.id,
                        "amount": $scope.mitigate_record.amount ? $filter('parseYuan')($scope.mitigate_record.amount / 10000) : "",
                        "remark": $scope.mitigate_record.remark,
                        "pin_code": $scope.mitigate_record.pin_code
                    }
                    if (!record.remark) {
                        topAlert.warning("備註不能為空。");
                        return;
                    }
                    if ($scope.isDisabled) {
                        return;
                    }
                    $scope.isDisabled = true;
                    $scope.form_loan_reduction.checkValidity().then(function () {
                        markerExpiredFee.mitigateExpiredFee(record).$promise.then(function () {
                            topAlert.success("減免手續費成功");
                            $scope.isDisabled = false;
                            $modalInstance.close(record);
                        }, function () {
                            $scope.isDisabled = false;
                        });
                    });
                }

                $scope.cancel = function () {
                    $modalInstance.dismiss();
                }


            }])
    /**
     *  調整
     */
        .controller('feeConfirmCtrl', [
            '$scope', '$modalInstance', 'globalFunction', 'topAlert', 'markerExpiredFee_data', 'agentsLists', '$filter', 'markerExpiredFee', 'feeTypes', 'markerStatus', 'dateComp', 'getDate', 'getRound', 'getNextDays',
            function ($scope, $modalInstance, globalFunction, topAlert, markerExpiredFee_data, agentsLists, $filter, markerExpiredFee, feeTypes, markerStatus, dateComp, getDate, getRound, getNextDays) {
                //
                $scope.title = '';
                $scope.type = 1;
                $scope.marker = markerExpiredFee_data;
                $scope.markerStatus = markerStatus.items;
                $scope.feeTypes = feeTypes.items;
                $scope.in_agent_code = markerExpiredFee_data.in_agent_code;
                $scope.out_agent_code = markerExpiredFee_data.out_agent_code;
                $scope.markerExpiredFees = [];
                $scope.show1 = $scope.show2 = false;

                $scope.markerFee = {end_date: markerExpiredFee_data.end_date};//
//                //調整
//                $scope.confirm = {
//                    subs:[{
//                        "term":"",//免收天期
//                        "rate":"",//息率
//                        "days":"",//計息天期
//                        "out_agent_id":"",//還息戶口
//                        "in_agent_id":"",//收益戶口
//                        "out_agent_code":"",
//                        "in_agent_code":"",
//                        "settlement_amount":"",//尚欠
//                        "fee":"",//應收
//                        "expired_fee_id":"",//id
//                        "remark":""
//                    }],
//                    year_month:""
//                }
//                //減免
//                $scope.reduction
//                    subs:[{
//                        "amount":"",
//                        "expired_fee_id":"",//id
//                        "remark":""
//                    }],
//                    year_month:""
//                }

                if (markerExpiredFee_data) {
                    markerExpiredFee.query({
                        marker_expired_fee_confirm_id: markerExpiredFee_data.id,
                        sort: "expired_date ASC,loan_date ASC"
                    }).$promise.then(function (markerExpiredFees) {
                            if (markerExpiredFees) {
                                //調整
                                $scope.confirm = {
                                    subs: [],
                                    year_month: "",
                                    pin_code: ""
                                }
                                //減免
                                $scope.reduction = {
                                    subs: [],
                                    year_month: "",
                                    pin_code: ""
                                }
//                         $scope.reduction.subs.splice(0,1);
//                         $scope.confirm.subs.splice(0,1);

                                _.each(markerExpiredFees, function (markerExpiredFee) {
                                    markerExpiredFee.term_c = angular.copy(markerExpiredFee.term);
                                    markerExpiredFee.amount = 0;
                                    markerExpiredFee.remark = "";
                                    markerExpiredFee.selected = false;
                                    if (markerExpiredFee.rate && markerExpiredFee.rate != "0") {
                                        markerExpiredFee.isDesabled = false
                                    } else {
                                        markerExpiredFee.isDesabled = true;
                                    }
                                    markerExpiredFee.old_fee = angular.copy(markerExpiredFee.fee);
                                    markerExpiredFee.old_settlement_amount = angular.copy(markerExpiredFee.settlement_amount);
                                    $scope.confirm.subs.push({
                                        "term": markerExpiredFee.term,//免收天期
                                        "rate": markerExpiredFee.rate,//息率
                                        "days": markerExpiredFee.days,//計息天期
                                        "out_agent_id": markerExpiredFee.out_agent_id,//還息戶口
                                        "in_agent_id": markerExpiredFee.in_agent_id,//收益戶口
                                        "in_agent_code": markerExpiredFee.in_agent_code,
                                        "out_agent_code": markerExpiredFee.out_agent_code,
                                        "settlement_amount": markerExpiredFee.settlement_amount,//尚欠
                                        "fee": markerExpiredFee.fee,//應收
                                        "original_fee": markerExpiredFee.original_fee ? markerExpiredFee.original_fee : "0",//原手續費
                                        "deduction_fee": markerExpiredFee.deduction_fee ? markerExpiredFee.deduction_fee : "0",//扣除上線
                                        "reduce_amount": markerExpiredFee.amount,//減免金額
                                        "expired_fee_id": markerExpiredFee.id,//markerExpiredFee.status == 1?markerExpiredFee.id:"",
                                        "end_date": markerExpiredFee.end_date ? markerExpiredFee.end_date : "",//結算日期
                                        "isDesabled": markerExpiredFee.isDesabled,
                                        "expired_date": markerExpiredFee.expired_date,
                                        "remark": ""
                                    })
                                    $scope.reduction.subs.push({
                                        "amount": "",
                                        "expired_fee_id": markerExpiredFee.status != 3 ? markerExpiredFee.id : "",//id
                                        "remark": markerExpiredFee.remark
                                    });
//                             markerExpiredFee.end_date =  $filter('parseDate')(markerExpiredFee.end_date, 'yyyy-MM-dd HH:mm');
                                    if ($filter('parseDate')(markerExpiredFee.end_date, 'yyyy-MM-dd') == $filter('parseDate')(markerExpiredFee_data.end_date, 'yyyy-MM-dd')) {
                                        markerExpiredFee.is_end_date = true;
                                    } else {
                                        markerExpiredFee.is_end_date = false;
                                    }
                                })
                            }
                            $scope.markerExpiredFees_copy = angular.copy(markerExpiredFees);
                            $scope.markerExpiredFees = angular.copy(markerExpiredFees);
                            $scope.resetMarkerExpiredFees = angular.copy(markerExpiredFees);
                            _.each($scope.resetMarkerExpiredFees, function (markerExpiredFee, $index) {
                                markerExpiredFee.fee_copy = angular.copy(markerExpiredFee.fee);
                                if (markerExpiredFee.status == 1) {
                                    markerExpiredFee.fee = (((markerExpiredFee.calc_amount * 10000) * (parseFloat(markerExpiredFee.days) + parseFloat(markerExpiredFee.term) - parseFloat(markerExpiredFee.term_c))) * (markerExpiredFee.rate / 100)) / 10000;//尚欠
                                    if (markerExpiredFee.deduction_fee) {
                                        markerExpiredFee.fee -= markerExpiredFee.deduction_fee;
                                    }
                                    if (markerExpiredFee.isDesabled) {
                                        markerExpiredFee.settlement_amount = markerExpiredFee.fee - markerExpiredFee.reduction_amount;
                                    } else {
                                        markerExpiredFee.settlement_amount = markerExpiredFee.old_settlement_amount
                                    }
                                } else {
                                    markerExpiredFee.settlement_amount = markerExpiredFee.settlement_amount;
                                }
//                         markerExpiredFee.fee = (((markerExpiredFee.calc_amount * 10000) * (parseFloat(markerExpiredFee.days) + parseFloat(markerExpiredFee.term) - parseFloat(markerExpiredFee.term_c))) * (markerExpiredFee.rate / 100)) / 10000;//尚欠
//                         markerExpiredFee.settlement_amount =markerExpiredFee.fee-markerExpiredFee.reduction_amount;
                            });
                        });
                }
                //調整方法
                $scope.confirm_ok = function (title, type) {
                    $scope.title = title;
                    $scope.type = type;
                    $scope.confirm_url = globalFunction.getApiUrl('loan/markerexpiredfee/expired-fee-confirm');
                }
                //减免方法
                $scope.reduction_ok = function (title, type) {
                    $scope.title = title;
                    $scope.type = type;
                    $scope.confirm_url = globalFunction.getApiUrl("loan/markerexpiredfee/mitigate-expired-fee");
                    ;

                }

                //
                $scope.check_one = function (marker) {
                    if (!marker.selected) {
                        marker.remark = $scope.markerExpiredFees[0].remark;
                    } else {
                        marker.remark = "";
                    }
                }


                //重新計算方法
                $scope.reset_calcaulate = function () {
                    $scope.show2 = false;
                    _.each($scope.markerExpiredFees, function (markerExpiredFee, $index) {
                        $scope.resetMarkerExpiredFees[$index].term_c = markerExpiredFee.term_c;
                        $scope.resetMarkerExpiredFees[$index].rate = markerExpiredFee.rate;
                        $scope.resetMarkerExpiredFees[$index].days = $scope.confirm.subs[$index].days;
                        $scope.resetMarkerExpiredFees[$index].fee = $scope.confirm.subs[$index].fee;
                        $scope.resetMarkerExpiredFees[$index].end_date = $scope.confirm.subs[$index].end_date;
                        $scope.resetMarkerExpiredFees[$index].settlement_amount = $scope.confirm.subs[$index].settlement_amount;
                    });
                    topAlert.success("重新計算成功。");
                }

                //還款
                $scope.submit = function () {
                    if ($scope.isDesabled) {
                        return false;
                    }

                    $scope.markerExpiredFees_copy = angular.copy($scope.markerExpiredFees);
                    $scope.confirm_copy = angular.copy($scope.confirm);
                    _.each($scope.markerExpiredFees_copy, function (markerExpiredFee, $index) {

                        delete $scope.confirm_copy.subs[$index].out_agent_code;
                        delete $scope.confirm_copy.subs[$index].in_agent_code;
                        $scope.confirm_copy.subs[$index].remark = $scope.reduction.subs[$index].remark;
                        $scope.confirm_copy.subs[$index].reduce_amount = $scope.confirm_copy.subs[$index].reduce_amount ? $scope.confirm_copy.subs[$index].reduce_amount + "" : "0";
                        if (markerExpiredFee.rate && markerExpiredFee.rate != "0") {
                            $scope.confirm_copy.subs[$index].fee = $scope.confirm_copy.subs[$index].fee ? Number($scope.confirm_copy.subs[$index].fee) + "" : "0";
                        } else {
                            $scope.confirm_copy.subs[$index].fee = markerExpiredFee.old_fee ? Number(markerExpiredFee.old_fee) + "" : "0";
                        }
                        $scope.confirm_copy.subs[$index].term = $scope.confirm_copy.subs[$index].term ? $scope.confirm_copy.subs[$index].term + "" : "0";
                        $scope.confirm_copy.subs[$index].rate = $scope.confirm_copy.subs[$index].rate ? $scope.confirm_copy.subs[$index].rate + "" : "0";
                        $scope.confirm_copy.subs[$index].days = $scope.confirm_copy.subs[$index].days ? $scope.confirm_copy.subs[$index].days + "" : "0";
                        $scope.confirm_copy.subs[$index].settlement_amount = $scope.confirm_copy.subs[$index].settlement_amount ? Number($scope.confirm_copy.subs[$index].settlement_amount) + "" : "0";
                        if ($scope.confirm_copy.subs[$index].term != markerExpiredFee.term && (markerExpiredFee.status == 1 || markerExpiredFee.fee_type == 1)) {
                            $scope.confirm_copy.subs[$index].expired_date = getNextDays(markerExpiredFee.loan_date, $scope.confirm_copy.subs[$index].term);
                            $scope.confirm_copy.subs[$index].expired_date = $scope.confirm_copy.subs[$index].expired_date + " 00:00:00";
                        }
                    })
                    $scope.confirm_copy.year_month = $filter('parseDate')(markerExpiredFee_data.year_month, 'yyyy-MM');
                    $scope.confirm_copy.subs = _.filter($scope.confirm_copy.subs, function (sub) {
                        return sub.expired_fee_id != ""
                    });
                    _.each($scope.confirm_copy.subs, function (sub) {
                        delete sub.end_date_copy;
                        delete sub.settlement_amount_round
                    });
                    $scope.isDesabled = true;
                    $scope.form_confirm.checkValidity().then(function () {
                        //利息調整成功
                        markerExpiredFee.expiredFeeConfirm($scope.confirm_copy).$promise.then(function () {
                            topAlert.success('利息調整成功');
                            $scope.isDesabled = false;
                            $modalInstance.close(true);
                        }, function () {
                            $scope.isDesabled = false;
                        });
                    });
                };

                $scope.cancel = function () {
                    $modalInstance.close('');
                };

                //監控
                $scope.$watch('markerFee.end_date', globalFunction.debounce(function (new_end_date, old_end_date) {
                    if (new_end_date) {
                        _.each($scope.markerExpiredFees, function (markerExpiredFee, $index) {
                            if (markerExpiredFee.is_end_date && markerExpiredFee.status == '1' && markerExpiredFee.fee_type == '1') {
                                markerExpiredFee.end_date = getDate(new_end_date, 'yyyy-MM-dd HH:mm');
                            }
                        })
                    }
                }, 350), true);


                //調整監控數組
                $scope.$watch('markerExpiredFees', globalFunction.debounce(function (markerExpiredFees, old_markerExpiredFees) {
                    _.each(markerExpiredFees, function (markerExpiredFee, $index) {
                        $scope.confirm.subs[$index].term = markerExpiredFee.term_c;
                        $scope.confirm.subs[$index].rate = markerExpiredFee.rate;
//                        alert(markerExpiredFee.end_date+"ss");
//                        markerExpiredFee.expired_date =  getNextDays(markerExpiredFee.loan_date,markerExpiredFee.term);
                        $scope.confirm.subs[$index].expired_date = markerExpiredFee.expired_date;
                        $scope.confirm.subs[$index].end_date_copy = $filter('parseDate')(markerExpiredFee.end_date, 'yyyy-MM-dd');
                        $scope.confirm.subs[$index].end_date = markerExpiredFee.end_date;
                        markerExpiredFee.days = dateComp($scope.confirm.subs[$index].end_date_copy, $filter('parseDate')(markerExpiredFee.expired_date, 'yyyy-MM-dd')) + 1;
                        $scope.confirm.subs[$index].days = parseFloat(markerExpiredFee.days) + parseFloat(markerExpiredFee.expired_add_days) + parseFloat(markerExpiredFee.term) - parseFloat(markerExpiredFee.term_c);
//                        $scope.confirm.subs[$index].days = parseFloat(markerExpiredFee.days)+parseFloat(markerExpiredFee.expired_add_days);

                        if (markerExpiredFee.status == 1) {
//                            $scope.confirm.subs[$index].fee = (((markerExpiredFee.calc_amount*10000)*(parseFloat($scope.confirm.subs[$index].days)+parseFloat(markerExpiredFee.expired_add_days)+parseFloat(markerExpiredFee.term) - parseFloat(markerExpiredFee.term_c)))* (markerExpiredFee.rate/100))/10000;//尚欠
                            $scope.confirm.subs[$index].fee = (((markerExpiredFee.calc_amount * 10000) * (parseFloat($scope.confirm.subs[$index].days))) * (markerExpiredFee.rate / 100)) / 10000;//尚欠
                            if (markerExpiredFee.deduction_fee) {
                                $scope.confirm.subs[$index].fee -= markerExpiredFee.deduction_fee;
                            }
                            $scope.confirm.subs[$index].fee = getRound($scope.confirm.subs[$index].fee);
                            $scope.confirm.subs[$index].settlement_amount = $scope.confirm.subs[$index].settlement_amount_round = getRound($scope.confirm.subs[$index].fee - markerExpiredFee.reduction_amount);
                        } else {
                            $scope.confirm.subs[$index].settlement_amount = $scope.confirm.subs[$index].settlement_amount_round = markerExpiredFee.settlement_amount;
                        }
                        if ($scope.confirm.subs[$index].days < 0) {
                            $scope.confirm.subs[$index].fee = 0;
                            $scope.confirm.subs[$index].settlement_amount = 0;
                            $scope.confirm.subs[$index].settlement_amount_round = 0;
                        }
//                        $scope.confirm.subs[$index].fee = (((markerExpiredFee.calc_amount*10000)*(parseFloat(markerExpiredFee.days)+parseFloat(markerExpiredFee.term) - parseFloat(markerExpiredFee.term_c)))* (markerExpiredFee.rate/100))/10000;//尚欠
//                        $scope.confirm.subs[$index].settlement_amount =$scope.confirm.subs[$index].fee-markerExpiredFee.reduction_amount;

                        if (old_markerExpiredFees[$index] && (markerExpiredFee.term_c !== old_markerExpiredFees[$index].term_c || markerExpiredFee.rate !== old_markerExpiredFees[$index].rate || markerExpiredFee.end_date !== old_markerExpiredFees[$index].end_date)) {
                            $scope.show2 = true;
                        }
                    })
                }, 500), true);
                //減免監控數組
                $scope.$watch('resetMarkerExpiredFees', globalFunction.debounce(function (resetMarkerExpiredFees, old_resetMarkerExpiredFees) {
                    $scope.settlement_amount_total = 0;
                    _.each(resetMarkerExpiredFees, function (markerExpiredFee, $index) {//
                        if (old_resetMarkerExpiredFees && (markerExpiredFee.amount !== old_resetMarkerExpiredFees[$index].amount || markerExpiredFee.in_agent_code !== old_resetMarkerExpiredFees[$index].in_agent_code || markerExpiredFee.out_agent_code !== old_resetMarkerExpiredFees[$index].out_agent_code)) {
                            $scope.show1 = true;
                        }
//                        $scope.reduction.subs[$index].amount = markerExpiredFee.amount;
                        $scope.confirm.subs[$index].reduce_amount = markerExpiredFee.amount / 10000;
                        markerExpiredFee.reduction_amount_copy = Number(markerExpiredFee.reduction_amount) + Number($scope.confirm.subs[$index].reduce_amount);

                        if (markerExpiredFee.isDesabled) {
                            markerExpiredFee.old_fee = getRound(markerExpiredFee.old_fee);
                            if (markerExpiredFee.status == "1") {
                                $scope.confirm.subs[$index].settlement_amount = (parseFloat(markerExpiredFee.old_fee * 10000) - parseFloat(markerExpiredFee.amount)) / 10000;
                            } else {
                                $scope.confirm.subs[$index].settlement_amount = markerExpiredFee.settlement_amount;
                            }
//                            markerExpiredFee.settlement_amount = $scope.confirm.subs[$index].settlement_amount;
                        } else {
                            markerExpiredFee.fee = getRound(markerExpiredFee.fee);
                            if (markerExpiredFee.status == "1")
                                $scope.confirm.subs[$index].settlement_amount = (parseFloat(markerExpiredFee.fee * 10000) - (parseFloat(markerExpiredFee.reduction_amount * 10000)) - parseFloat(markerExpiredFee.amount)) / 10000;
                            else
                                $scope.confirm.subs[$index].settlement_amount = (parseFloat(markerExpiredFee.settlement_amount * 10000) - parseFloat(markerExpiredFee.amount)) / 10000;
//                            markerExpiredFee.settlement_amount = $scope.confirm.subs[$index].settlement_amount;
                        }
                        if (markerExpiredFee.old_fee > 0) {
                            $scope.settlement_amount_total += Number($scope.confirm.subs[$index].settlement_amount);//
                        }
                        if (markerExpiredFee.in_agent_code) {
                            agentsLists.query(globalFunction.generateUrlParams({agent_code: markerExpiredFee.in_agent_code}, {})).$promise.then(function (agents) {
                                if (agents.length > 0) {
//                                    markerExpiredFee.in_agent_id = agents[0].id;
                                    $scope.confirm.subs[$index].in_agent_id = agents[0].id;
                                } else {
                                    $scope.confirm.subs[$index].in_agent_id = "";
                                }
                            });
                        } else {
                            $scope.confirm.subs[$index].in_agent_id = "";
                        }
                        if (markerExpiredFee.out_agent_code) {
                            agentsLists.query(globalFunction.generateUrlParams({agent_code: markerExpiredFee.out_agent_code}, {})).$promise.then(function (agents) {
                                if (agents.length > 0) {
//                                    markerExpiredFee.in_agent_id = agents[0].id;
                                    $scope.confirm.subs[$index].out_agent_id = agents[0].id;
                                } else {
                                    $scope.confirm.subs[$index].out_agent_id = "";
                                }
                            });
                        } else {
                            $scope.confirm.subs[$index].out_agent_id = "";
                        }
                    })
                }, 500), true);


            }]).controller('newFeeConfirmCtrl', [
            '$scope', '$modalInstance', 'globalFunction', 'topAlert', 'markerExpiredFee_data', 'agentsLists', '$filter', 'markerExpiredFee', 'feeTypes', 'markerStatus', 'dateComp', 'getDate', 'getRound', 'getNextDays', 'markerTerm', 'refMortgageMarker',
            function ($scope, $modalInstance, globalFunction, topAlert, markerExpiredFee_data, agentsLists, $filter, markerExpiredFee, feeTypes, markerStatus, dateComp, getDate, getRound, getNextDays, markerTerm, refMortgageMarker) {

                $scope.markerStatus = markerStatus.items;
                $scope.feeTypes = feeTypes.items;
//            $scope.settlement_amount_total = 0;
                $scope.is_calcaulate = false;//是否重新計算了利息
                $scope.monthly_records = [];
                $scope.calcaulate_btn = true;//是否禁用重新按鈕，當手續費的狀態都是未還款時才能重算
                //重新計算model
                $scope.calcaulate = {
                    subModels: [],
                    end_date: $filter('parseDate')(markerExpiredFee_data.end_date, 'yyyy-MM-dd HH:mm:ss'),
                    confirm_id: markerExpiredFee_data.id,
                    pin_code: ""
                }
                //調整model
                $scope.confirm = {
                    "expiredFeeSubs": [],
                    "subModels": [],
                    "confirm_id": markerExpiredFee_data.id,
                    "end_date": $filter('parseDate')(markerExpiredFee_data.end_date, 'yyyy-MM-dd HH:mm:ss'),
                    "pin_code": ""
                }
                $scope.markerTermFees = [];
                $scope.markerExpiredFees = [];//重新計算的subModels賦值變量
                $scope.calcaulate_url = globalFunction.getApiUrl('loan/markerexpiredfee/expired-fee-calcaulate');
                $scope.confirm_url = globalFunction.getApiUrl('loan/markerexpiredfee/retry-expired-fee-confirm');

                if (markerExpiredFee_data) {
                    markerTerm.markerTermFee({
                        marker_expired_fee_confirm_id: markerExpiredFee_data.id,
                        sort: "expired_date ASC"
                    }).$promise.then(function (markerTermFees) {
                            if (markerTermFees.length) {
                                $scope.markerTermFees = angular.copy(markerTermFees);
                                $scope.calcaulate.subModels = [];
                                _.each($scope.markerTermFees, function (markerTermFee) {
                                    $scope.confirm.subModels.push({
                                        "id": markerTermFee.id,
                                        "agent_info_id": markerTermFee.agent_info_id,
                                        "term": markerTermFee.term,
                                        "expired_rate": markerTermFee.expired_rate,
                                        "special_term": markerTermFee.special_term,
                                        "special_rate": markerTermFee.special_rate,
                                        "expired_add_days": markerTermFee.expired_add_days,
                                        "layer": markerTermFee.layer
                                    })
                                });
//                        $scope.reset_calcaulate(true);
                            }
                        });
                    markerExpiredFee.query({
                        marker_expired_fee_confirm_id: markerExpiredFee_data.id,
                        sort: "expired_date ASC,loan_date ASC"
                    }).$promise.then(function (markerExpiredFees) {
                            $scope.calcaulate_btn = true;
                            if (markerExpiredFees.length > 0) {
                                if (markerExpiredFees.length == _.where(markerExpiredFees, {status: "1"}).length) {
                                    $scope.calcaulate_btn = false;
                                }
                                _.each(markerExpiredFees, function (markerExpiredFee) {
                                    if (markerExpiredFee.fee > 0) {
                                        $scope.markerExpiredFees.push({
                                            amount: markerExpiredFee.amount,
                                            borrower: markerExpiredFee.borrower,
                                            calc_amount: markerExpiredFee.calc_amount,
                                            compute: markerExpiredFee.compute ? markerExpiredFee.compute : "0",//
                                            days: markerExpiredFee.days,
                                            deduction_fee: markerExpiredFee.deduction_fee,
                                            end_date: markerExpiredFee.end_date,
                                            expired_add_days: markerExpiredFee.expired_add_days,
                                            expired_date: markerExpiredFee.expired_date,
                                            fee: markerExpiredFee.fee,
                                            fee_confirm_id: markerExpiredFee_data.id,//
                                            fee_type: markerExpiredFee.fee_type,
                                            hall_id: markerExpiredFee.hall_id,
                                            hall_name: markerExpiredFee.hall_name,
                                            in_agent_code: markerExpiredFee.in_agent_code,
                                            in_agent_id: markerExpiredFee.in_agent_id,
                                            last_second_settlement_date: markerExpiredFee.last_second_settlement_date,
                                            loan_agent_code: markerExpiredFee.loan_agent_code,
                                            loan_agent_name: markerExpiredFee.loan_agent_name,
                                            loan_agent_id: markerExpiredFee.loan_agent_id,
                                            loan_date: markerExpiredFee.loan_date,
                                            loan_total_days: markerExpiredFee.loan_total_days,
                                            loantype: markerExpiredFee.loan_type,
                                            marker_amount: markerExpiredFee.marker_amount,
                                            marker_fee_id: markerExpiredFee.marker_fee_id,
                                            marker_id: markerExpiredFee.marker_id,
                                            marker_seqNumber: markerExpiredFee.loan_seqnumber,
                                            mortgage_time: markerExpiredFee.mortgage_time,
                                            original_fee: markerExpiredFee.original_fee,
                                            out_agent_code: markerExpiredFee.out_agent_code,
                                            out_agent_id: markerExpiredFee.out_agent_id,
                                            rate: markerExpiredFee.rate,
                                            reduction_amount: markerExpiredFee.reduction_amount,
                                            repayment_amount_total: markerExpiredFee.repayment_amount_total,
                                            replace_pay: markerExpiredFee.status == 4 ? "1" : "0",//曾經代付
                                            settlement_amount: markerExpiredFee.settlement_amount,
                                            status: markerExpiredFee.status,
                                            term: markerExpiredFee.term,
                                            top_agent_code: markerExpiredFee.top_agent,
                                            year_month: markerExpiredFee.year_month,
                                            reduction_amount_copy: markerExpiredFee.reduction_amount,
                                            settlement_amount_copy: markerExpiredFee.settlement_amount,
                                            reduction_amount_new: 0,
                                            "expired_fee_id": markerExpiredFee.id
                                        })
                                    }

                                })
                            }
                        })

//                //抵押記錄
//                $scope.mortgage_records = refMortgageMarker.query(globalFunction.generateUrlParams({marker_id:markerExpiredFee_data.marker_id},{marker:{},mortgage:{}}));
//                //截息記錄
//                markerExpiredFee.markerExpiredFeeTotal({marker_seqnumber:markerExpiredFee_data.marker_seqnumber}).$promise.then(function(monthly_records){
//                    if(monthly_records){
//                        $scope.monthly_records = _.filter(monthly_records,function(monthly_record){return monthly_record.fee_type == 2});
//                    }
//
//                });
                }

                //重新計算方法
                $scope.reset_calcaulate = function (show) {
                    if ($scope.isDesabled) {
                        return $scope.isDesabled;
                    }
                    $scope.is_calcaulate = false;
                    $scope.calcaulate.subModels = [];
                    _.each($scope.markerTermFees, function (markerTermFee) {
                        $scope.calcaulate.subModels.push({
                            "id": markerTermFee.id,
                            "agent_info_id": markerTermFee.agent_info_id,
                            "term": markerTermFee.term,
                            "expired_rate": markerTermFee.expired_rate,
                            "special_term": markerTermFee.special_term,
                            "special_rate": markerTermFee.special_rate,
                            "expired_add_days": markerTermFee.expired_add_days,
                            "layer": markerTermFee.layer
                        })
                    });
                    $scope.calcaulate_copy = angular.copy($scope.calcaulate);
                    $scope.calcaulate_copy.end_date = getDate($scope.calcaulate.end_date, true);
                    $scope.confirm.subModels = [];
                    $scope.confirm.subModels = angular.copy($scope.calcaulate_copy.subModels);
                    $scope.isDesabled = true;
                    $scope.form_calcaulate.checkValidity().then(function () {
                        //利息調整成功
                        markerExpiredFee.expiredFeeCalcaulate($scope.calcaulate_copy).$promise.then(function (data) {
                            if (!show) {
                                topAlert.success('手續費重新計算成功。');
                            }
                            $scope.is_calcaulate = true;
//                        $scope.settlement_amount_total = 0;
                            $scope.isDesabled = false;
                            $scope.confirm.confirm_id = data.fee_confirm_id;
                            $scope.confirm.end_date = $scope.calcaulate_copy.end_date
                            $scope.markerExpiredFees = data.subModels;
                            $scope.markerExpiredFees = [];
                            _.each(data.subModels, function (subModel, $index) {
                                if (subModel.fee > 0) {
                                    $scope.markerExpiredFees.push(subModel);
                                }
                            })
                            _.each($scope.markerExpiredFees, function (markerExpiredFee, $index) {
                                markerExpiredFee.fee = getRound(markerExpiredFee.fee);
                                markerExpiredFee.settlement_amount = (Number(markerExpiredFee.fee * 10000) - Number(markerExpiredFee.reduction_amount * 10000)) / 10000;
                                markerExpiredFee.reduction_amount = (Number(markerExpiredFee.reduction_amount)) / 10000;
                                markerExpiredFee.reduction_amount_copy = (Number(markerExpiredFee.reduction_amount)) / 10000;
                                markerExpiredFee.reduction_amount_new = 0;
//                            $scope.settlement_amount_total += Number(markerExpiredFee.settlement_amount);//
                                markerExpiredFee.fee_confirm_id = data.fee_confirm_id;
                            });
                        }, function () {
                            $scope.isDesabled = false;
                        });
                    });
                }

                //減免監控數組
                $scope.$watch('markerExpiredFees', globalFunction.debounce(function (resetMarkerExpiredFees, old_resetMarkerExpiredFees) {
//                $scope.settlement_amount_total = 0;
                    _.each(resetMarkerExpiredFees, function (markerExpiredFee, $index) {//
                        if (old_resetMarkerExpiredFees && (markerExpiredFee.reduction_amount_new !== old_resetMarkerExpiredFees[$index].reduction_amount_new || markerExpiredFee.in_agent_code !== old_resetMarkerExpiredFees[$index].in_agent_code || markerExpiredFee.out_agent_code !== old_resetMarkerExpiredFees[$index].out_agent_code)) {
                            $scope.show1 = true;
                        }

                        markerExpiredFee.fee = getRound(markerExpiredFee.fee);
                        markerExpiredFee.reduction_amount = (Number(markerExpiredFee.reduction_amount_copy * 10000) + Number(markerExpiredFee.reduction_amount_new)) / 10000;
                        if (markerExpiredFee.status == 4) {
                            markerExpiredFee.settlement_amount = (Number(markerExpiredFee.settlement_amount_copy * 10000) - Number(markerExpiredFee.reduction_amount_new)) / 10000;
                        } else {
                            markerExpiredFee.settlement_amount = (Number(markerExpiredFee.fee * 10000) - Number(markerExpiredFee.reduction_amount * 10000) - Number(markerExpiredFee.repayment_amount_total * 10000)) / 10000;
                        }

//                    $scope.settlement_amount_total += Number(markerExpiredFee.settlement_amount);//

                        if (markerExpiredFee.in_agent_code) {
                            agentsLists.query(globalFunction.generateUrlParams({agent_code: markerExpiredFee.in_agent_code}, {})).$promise.then(function (agents) {
                                if (agents.length > 0) {
                                    markerExpiredFee.in_agent_id = agents[0].id;
                                } else {
                                    markerExpiredFee.in_agent_id = "";
                                }
                            });
                        } else {
                            markerExpiredFee.in_agent_id = "";
                        }
                        if (markerExpiredFee.out_agent_code) {
                            agentsLists.query(globalFunction.generateUrlParams({agent_code: markerExpiredFee.out_agent_code}, {})).$promise.then(function (agents) {
                                if (agents.length > 0) {
//                                    markerExpiredFee.in_agent_id = agents[0].id;
                                    markerExpiredFee.out_agent_id = agents[0].id;
                                } else {
                                    markerExpiredFee.out_agent_id = "";
                                }
                            });
                        } else {
                            markerExpiredFee.out_agent_id = "";
                        }
                    })
                }, 500), true);

                //還款
                $scope.submit = function () {
                    if ($scope.submit_desabled) {
                        return false;
                    }
//                $scope.markerExpiredFees_copy = angular.copy($scope.markerExpiredFees);
                    $scope.confirm_copy = angular.copy($scope.confirm);
                    $scope.confirm_copy.expiredFeeSubs = angular.copy($scope.markerExpiredFees);
                    _.each($scope.confirm_copy.expiredFeeSubs, function (expiredFeeSub) {
//                    expiredFeeSub.repayment_amount_total = $scope.reduction_amount_total($scope.confirm_copy.expiredFeeSubs);
                        delete expiredFeeSub.loan_total_days;
                        delete expiredFeeSub.reduction_amount_copy;
                        delete expiredFeeSub.reduction_amount_new;
                        delete markerExpiredFee.settlement_amount_copy;
                        delete markerExpiredFee.expired_fee_id;
                    });
                    $scope.submit_desabled = true;
                    $scope.form_confirm.checkValidity().then(function () {
                        if ($scope.is_calcaulate) {
                            //重新計算之後利息調整
                            markerExpiredFee.retryExpiredFeeConfirm($scope.confirm_copy).$promise.then(function () {
                                topAlert.success('利息調整成功');
                                $scope.submit_desabled = false;
                                $modalInstance.close(true);
                            }, function () {
                                $scope.submit_desabled = false;
                            });
                        } else {
                            var confirm_sub = {
                                subs: [],
                                year_month: $filter('parseDate')(markerExpiredFee_data.year_month, 'yyyy-MM'),
                                pin_code: $scope.confirm_copy.pin_code
                            }
                            _.each($scope.markerExpiredFees, function (markerExpiredFee) {
                                confirm_sub.subs.push({
                                    "term": markerExpiredFee.term ? markerExpiredFee.term : "0",//免收天期
                                    "rate": markerExpiredFee.rate ? markerExpiredFee.rate : "0",//息率
                                    "days": markerExpiredFee.days,//計息天期
                                    "out_agent_id": markerExpiredFee.out_agent_id,//還息戶口
                                    "in_agent_id": markerExpiredFee.in_agent_id,//收益戶口
                                    "in_agent_code": markerExpiredFee.in_agent_code,
                                    "out_agent_code": markerExpiredFee.out_agent_code,
                                    "settlement_amount": markerExpiredFee.settlement_amount,//尚欠
                                    "fee": markerExpiredFee.fee,//應收
                                    "original_fee": markerExpiredFee.original_fee ? markerExpiredFee.original_fee : "0",//原手續費
                                    "deduction_fee": markerExpiredFee.deduction_fee ? markerExpiredFee.deduction_fee : "0",//扣除上線
                                    "reduce_amount": markerExpiredFee.reduction_amount,//減免金額
                                    "expired_fee_id": markerExpiredFee.expired_fee_id,//markerExpiredFee.status == 1?markerExpiredFee.id:"",
                                    "end_date": markerExpiredFee.end_date ? $filter('parseDate')(markerExpiredFee.end_date, 'yyyy-MM-dd 00:00:00') : "",//結算日期
                                    "expired_date": markerExpiredFee.expired_date,
                                    "remark": ""
                                })
                            })

                            //利息調整成功
                            markerExpiredFee.expiredFeeConfirm(confirm_sub).$promise.then(function () {
                                topAlert.success('利息調整成功');
                                $scope.submit_desabled = false;
                                $modalInstance.close(true);
                            }, function () {
                                $scope.submit_desabled = false;
                            });

                        }

                    });
                };

                $scope.cancel = function () {
                    $modalInstance.close('');
                };

                //減免總額
                $scope.reduction_amount_total = function (expiredFeeSubs) {
                    var repayment_amount_total = 0;
                    _.each(expiredFeeSubs, function (expiredFeeSub) {
                        repayment_amount_total += Number(expiredFeeSub.reduction_amount * 10000);
                    });
                    return Number(repayment_amount_total) / 10000;
                }


            }]).controller('accountOverdueChargeEditCtrls', ['$scope', '$modalInstance', 'overdue_charge', function ($scope, $modalInstance, overdue_charge) {
            $scope.overdue_charge = overdue_charge;
            $scope.submit = function () {
                $modalInstance.close(true);
            }
            $scope.cancel = function () {
                $modalInstance.close(false);
            }
        }]).controller('loanAccountOverdueChargeDetailCtrl', ['$scope', '$state', '$stateParams', '$location', '$modal', 'currentShift', 'breadcrumb', 'topAlert', 'globalFunction', 'markerExpiredFee', 'feeTypes', 'markerStatus', 'markerExpiredFeeRepayment', 'markerExpiredFeeTypes', 'pinCodeModal', 'markerFeeRepayment', '$filter', 'agentsLists', 'getDate',
            function ($scope, $state, $stateParams, $location, $modal, currentShift, breadcrumb, topAlert, globalFunction, markerExpiredFee, feeTypes, markerStatus, markerExpiredFeeRepayment, markerExpiredFeeTypes, pinCodeModal, markerFeeRepayment, $filter, agentsLists, getDate) {
                breadcrumb.items = [
                    {"name": "過期手續費管理", "url": 'loan/account-overdue-charge'},
                    {"name": "過期手續費詳細", "active": true}
                ];
                $scope.chk_group = {group1: ""};
                $scope.feeTypes = feeTypes.items;
                $scope.markerStatus = markerStatus.items;
                $scope.select_status = [];
                $scope.markerExpiredFeeTypes = markerExpiredFeeTypes.items;
                //搜索條件
                var init_condition = {
                    marker_seqnumber: "",
                    loan_agent_code: "",
                    outAgent: {
                        agent_code: ""
                    },
                    inAgent: {
                        agent_code: ""
                    },
                    agentGroup: {
                        agent_group_name: ""
                    },
                    markerExpiredFeeConfirm: {status: "1"},
                    is_show: "1",
                    year_month: [""],//currentShift.data.year_month
//            status: '|3',
                    status: '',
                    fee_type: "",
                    sort: "end_date DESC,outAgent.agent_code NUMASC,hall_id ASC,year_month DESC"
                };
                $scope.condition = angular.copy(init_condition);

                $scope.repay_amount = 0;
                $scope.fee_total = {
                    fee_total: 0,
                    settlement_amount_total: 0
                }
                $scope.markerFeeRepaymentRecord = {};
                $scope.overdue_charges = [];
                $scope.selectStatus = [{id: 1, name: "未還款"}, {id: 2, name: "部分還款"}, {id: 4, name: "代付"}];
                $scope.$watch('select_status', function (new_value) {
                    $scope.condition.status = "";
                    if (new_value) {
                        $scope.condition.status += '#';
                        _.each($scope.select_status, function ($type, $key) {
                            $scope.condition.status += $type;
                            if ($key != $scope.select_status.length - 1) {
                                $scope.condition.status += ',';
                            }
                        })
                    }
                });

                $scope.select = function () {
                    markerFeeRepayment.get(globalFunction.generateUrlParams({id: $stateParams.overdue_charge_id}, {}))
                        .$promise.then(function (record) {

                            $scope.markerFeeRepaymentRecord = record;
                            $scope.condition.outAgent.agent_code = $scope.markerFeeRepaymentRecord ? $scope.markerFeeRepaymentRecord.out_agent_code : "";
                            var year_month = $filter('limitTo')(record.year_month, '7');
                            var condition = {
                                status: '|3',
                                year_month: [year_month],
                                out_agent_id: record.out_agent_id
                            }
                            var params = globalFunction.generateUrlParams(condition, {});

//                    markerExpiredFee.query(params).$promise.then(function(data)
//                    {
//                        $scope.overdue_charges = data;
//                        _.each($scope.overdue_charges.markerFeeRepayments, function($that)
//                        {
//                            $scope.repay_amount += Number($that.amount);
//                        })
//                        $scope.repay_amount -= $scope.overdue_charges.not_sure_amount;
//
//                    })
//                    markerExpiredFee.expiredFeeTotal(params).$promise.then(function(data){
//                        $scope.fee_total = data;
//                    })
                            $scope.search();

                        });
                }
                $scope.select();


                //過期手續費
//      $scope.pagination = tmsPagination.create();
//      $scope.pagination.resource = markerExpiredFee;
                $scope.search = function (page) {
                    var condition_copy = angular.copy($scope.condition);
                    if ($scope.condition.year_month[0]) {
                        condition_copy.year_month[0] = $filter('date')(condition_copy.year_month[0], 'yyyy-MM');
                    } else {
                        condition_copy.year_month[0] = "";
                    }
//            if($scope.condition.inAgent.agent_code){
//                condition_copy.inAgent.agent_code = $scope.condition.inAgent.agent_code+"!"
//            }
//            if($scope.condition.outAgent.agent_code){
//                condition_copy.outAgent.agent_code = $scope.condition.outAgent.agent_code+"!"
//            }
//            if($scope.condition.loan_agent_code){
//                condition_copy.loan_agent_code = $scope.condition.loan_agent_code+"!"
//            }
//            if($scope.condition.marker_seqnumber){
//                condition_copy.marker_seqnumber = '!'+$scope.condition.marker_seqnumber+"!"
//            }
//            if($scope.condition.top_agent){
//                condition_copy.top_agent = '!'+$scope.condition.top_agent+"!"
//            }
                    if (condition_copy.agentGroup.agent_group_name) {
                        if ($scope.chk_group.group1) {
                            condition_copy.agentGroup.agent_group_name = condition_copy.agentGroup.agent_group_name + "!";
                        } else {
                            condition_copy.agentGroup.agent_group_name = condition_copy.agentGroup.agent_group_name;
                        }
                    }
                    if ($scope.select_status.length == 0) {
                        condition_copy.status = "";
                    }
                    if ($scope.condition.year_month[0]) {
                        $scope.condition.year_month[0] = $scope.condition.year_month[0] ? $filter('date')($scope.condition.year_month[0], 'yyyy-MM') : "";
                    }
                    markerExpiredFee.query(globalFunction.generateUrlParams(condition_copy, {})).$promise.then(function (data) {
                        $scope.overdue_charges = data;
                        _.each($scope.overdue_charges.markerFeeRepayments, function ($that) {
                            $scope.repay_amount += Number($that.amount);
                        });

                        $scope.repay_amount -= $scope.overdue_charges.not_sure_amount;
                        _.each($scope.overdue_charges, function (overdue_charge) {
                            overdue_charge.repay_time = $filter('date')(getDate(new Date()), 'yyyy-MM');
                        });

                    });
                    markerExpiredFee.expiredFeeTotal(globalFunction.generateUrlParams(condition_copy, {})).$promise.then(function (data) {
                        $scope.fee_total = data;
                    })
                }

                $scope.reset = function () {
                    $scope.condition = angular.copy(init_condition);
                    $scope.condition.outAgent.agent_code = $scope.markerFeeRepaymentRecord ? $scope.markerFeeRepaymentRecord.out_agent_code : "";
                    $scope.chk_group.group1 = "";
                    $scope.select_status = [];
                    $scope.search();
                }

                $scope.return = function () {
                    $location.path('loan/account-overdue-charge/1');
                }

                //贷款手续费流水
                /*$scope.select_stream = function(){
                 $scope.markerExpiredFeeRepayments = markerExpiredFeeRepayment.query({marker_expired_fee_id:$stateParams.overdue_charge_id});
                 }*/
                //$scope.select_stream();

                //減免
                $scope.reduction = function () {
                    if (!$scope.overdue_charge) {
                        return;
                    }
                    var reduction_modal;
                    reduction_modal = $modal.open({
                        templateUrl: "views/loan/loan-reduction.html",
                        controller: 'loanReductionCtrl',
                        windowClass: 'sm-modal',
                        resolve: {
                            markerExpiredFee_data: function () {
                                return $scope.overdue_charge;
                            }
                        }
                    });

                    reduction_modal.result.then(function (new_record) {
                        /*if(markerExpiredFee.save(new_record)){
                         $scope.select();
                         }*/
                    });
                }

                $scope.reduceFee = function (markerExpiredFee) {
                    if (!markerExpiredFee) {
                        return;
                    }

                    var reduction_modal;
                    reduction_modal = $modal.open({
                        templateUrl: "views/loan/loan-reduction.html",
                        controller: 'loanReductionCtrl',
                        windowClass: 'sm-modal',
                        resolve: {
                            markerExpiredFee_data: function () {
                                return markerExpiredFee;
                            }
                        }
                    });

                    reduction_modal.result.then(function (new_record) {
                        markerExpiredFee.reduction_amount = Number(markerExpiredFee.reduction_amount) + Number(new_record.amount);
                        markerExpiredFee.settlement_amount -= new_record.amount;
                    });
                }

                $scope.form_markerExpiredFee_url = globalFunction.getApiUrl('loan/markerexpiredfee/confirm-expired-fee');
                $scope.mitigate = {
                    remark: "",
                    marker_fee_repayment_id: "",
                    fees: [],
                    pin_code: ""
                }

                $scope.isDisabled = false;
                $scope.save = function () {
                    if ($scope.isDisabled) {
                        return;
                    }
                    var fee_arr = [];
                    $scope.warn = false;
                    _.each($scope.overdue_charges, function ($that, $key) {
                        if ($that.sure_amount && $that.sure_amount % 10 != 0) {
                            $scope.warn = true;
                        }
                        if (3 != $that.status && !!Number($that.sure_amount)) {
                            fee_arr.push({
                                expired_fee_id: $that.id,
                                in_agent_id: $that.in_agent_id,
                                repayment_time: $that.repay_time + '-01',
                                amount: $that.sure_amount / 10000
                            })
                        }
                    });
                    if ($scope.warn) {
                        topAlert.warning("手續費必須為10的倍數。");
                        return;
                    }
                    if (!fee_arr.length) {
                        topAlert.warning("請填寫手續費確認還息信息。");
                        $scope.isDisabled = false;
                        return false;
                    }
                    $scope.isDisabled = true;
                    $scope.mitigate.fees = fee_arr;
                    $scope.mitigate.marker_fee_repayment_id = $scope.markerFeeRepaymentRecord.id;
                    $scope.form_markerExpiredFee.checkValidity().then(function () {
                        markerExpiredFee.confirmExpiredFee($scope.mitigate, function () {
                            topAlert.success("手續費分成確認成功");
                            $scope.form_markerExpiredFee.clearErrors();
                            $scope.isDisabled = false;
//                    $scope.select();
                            $scope.return();
                        }, function () {
                            $scope.isDisabled = false;
                        });
                    });
                }
                $scope.cancel = function () {
                    _.each($scope.overdue_charges, function ($that, $key) {
                        $that.sure_amount = "";
                    });
                    $scope.mitigate = {
                        remark: "",
                        marker_fee_repayment_id: "",
                        fees: [],
                        pin_code: ""
                    }
                }

                $scope.change_in_agent = globalFunction.debounce(function (overdue_charge) {
                    overdue_charge.in_agent_id = "";
                    if (overdue_charge.in_agent_code) {
                        agentsLists.query(globalFunction.generateUrlParams({agent_code: overdue_charge.in_agent_code}, {})).$promise.then(function (agent) {
                            if (agent.length > 0) {
                                overdue_charge.in_agent_id = agent[0].id;
                            } else {
                                overdue_charge.in_agent_id = "";
                            }
                        });
                    } else {
                        overdue_charge.in_agent_id = "";
                    }
                })

                //刪除過期手續費流水
                $scope.remove = function (id) {
                    pinCodeModal(markerExpiredFeeRepayment, 'delete', {id: id}, '過期手續費流水刪除成功！').then(function () {
                        //topAlert.success("過期手續費流水刪除成功")
                        //$scope.select_stream();
                    });
                }

                $scope.return_list = function () {
                    $state.go('account-overdue-charge');
                    //$location.path('loan/account-overdue-charge');
                }

            }]).controller('loanAccountOverdueChargeReduction', ['$scope', '$modalInstance', 'index', 'overdueChargeDetails', function ($scope, $modalInstance, index, overdueChargeDetails) {

            if (index >= 0) {
                $scope.overdue_charge_reduction = overdueChargeDetails[index];
                $scope.$watch('overdue_charge_reduction.reduction', function (new_value, old_value) {
                    $scope.amount = $scope.overdue_charge_reduction.charge_relief_amount - new_value;
                });
            }
            $scope.add = function () {
                $modalInstance.close($scope.overdue_charge_reduction);
            }
            $scope.cancel = function () {
                $scope.overdue_charge_reduction.reduction = 0;
                $modalInstance.close();
            }
        }]).controller('commonQuotaSettingCtrl', ['$scope', 'tmsPagination', 'globalFunction', '$modal', '$location', 'breadcrumb', 'quotaSettingsCommon', 'fundsTypes', 'globalConfig', 'topAlert', 'pinCodeModal', 'formatNumber',
            function ($scope, tmsPagination, globalFunction, $modal, $location, breadcrumb, quotaSettingsCommon, fundsTypes, globalConfig, topAlert, pinCodeModal, formatNumber) {
                breadcrumb.items = [
                    {"name": "貸款公共批額設定", "active": true}
                ];
                $scope.isDisabled = false;
                $scope.sub_post_put = 'POST';
                $scope.funds = fundsTypes.query({type: 2}, function () {
                    var obj = {};
                    for (var i = 0, len = $scope.funds.length; i < len; i++) {
                        if (undefined !== $scope.funds[i].funds_name) {
                            obj[$scope.funds[i].id] = $scope.funds[i].funds_name;
                        }
                    }
                    $scope.funds_expend = obj;
                });

                $scope.deposit_url = globalFunction.getApiUrl('loan/quotasettingcommon');
                $scope.pagination = tmsPagination.create();
                $scope.pagination.resource = quotaSettingsCommon;
                var original;
                var quota_setting_one;
                var init_quota_setting_one = {
                    add_term: "",
                    create_time: "",
                    expired_rate: "",
                    funds_type_id: "",
                    id: "",
                    layer: "",
                    lower_amount: "",
                    special_rate: "",
                    special_term: "",
                    term: "",
                    update_time: "",
                    upper_amount: "",
                    pin_code: ""
                };

                original = angular.copy(init_quota_setting_one);
                $scope.quota_setting_one = angular.copy(init_quota_setting_one);

                $scope.select = function (page) {
                    $scope.quota_settings = $scope.pagination.select(page);
                }
                $scope.select();

                //修改指定数据
                $scope.update = function (id) {
                    $scope.quota_setting_one = quotaSettingsCommon.get({id: id}, function (data) {
                        //$scope.quota_setting_one.amount_range = $scope.quota_setting_one.lower_amount + ' - ' + $scope.quota_setting_one.upper_amount;
                        $scope.quota_setting_one.expired_rate = formatNumber($scope.quota_setting_one.expired_rate);
                        $scope.quota_setting_one.special_rate = formatNumber($scope.quota_setting_one.special_rate);
                        original = angular.copy($scope.quota_setting_one);
                        $scope.sub_post_put = 'PUT';
                        $scope.reset()
                    });
                    //$scope.disabled_submit = false;
                };

                //删除指定数据
                $scope.delete = function (id) {
                    pinCodeModal(quotaSettingsCommon, 'delete', {id: id}, '刪除成功！').then(function () {
                        $scope.select();
                    })
                };
                //最终提交表单修改数据
                $scope.submit_update = function () {
                    var sub_method = quotaSettingsCommon.save;
                    var tis = "添加成功。";
                    if (!!$scope.quota_setting_one.id) {
                        sub_method = quotaSettingsCommon.update;
                        tis = "修改成功。";
                    }
                    //!!$scope.quota_setting_one.id ? quotaSettingsCommon.update : quotaSettingsCommon.save;
                    if ($scope.isDisabled) {
                        return;
                    }
                    $scope.isDisabled = true;
                    $scope.form_quota_setting.checkValidity().then(function () {
                        sub_method($scope.quota_setting_one, function () {
                            topAlert.success(tis);
                            original = angular.copy(init_quota_setting_one);
                            $scope.select();
                            $scope.reset();
                            $scope.isDisabled = false;
                        }, function () {
                            $scope.isDisabled = false;
                            //topAlert.success('修改失败。');
                        });

                    });
                }

                // 重置按钮
                $scope.reset = function () {
                    $scope.form_quota_setting.$setPristine();
                    $scope.quota_setting_one = angular.copy(original);
                    $scope.form_quota_setting.clearErrors();
                }

                //新增批额设定按钮
                $scope.add = function () {
                    original = angular.copy(init_quota_setting_one);
                    $scope.reset();
                }
            }]).controller('quotaSettingCtrl', ['$scope', 'tmsPagination', 'globalFunction', '$modal', '$location', 'breadcrumb', 'quotaSettingsCommon', 'quotaSetting', 'fundsTypes', 'agentsLists', 'agentQuota', 'topAlert', 'agentType', 'quotaShare', 'pinCodeModal', 'windowItems', '$stateParams', 'agentRemark', 'departMent', 'formatNumber',
            function ($scope, tmsPagination, globalFunction, $modal, $location, breadcrumb, quotaSettingsCommon, quotaSetting, fundsTypes, agentsLists, agentQuota, topAlert, agentType, quotaShare, pinCodeModal, windowItems, $stateParams, agentRemark, departMent, formatNumber) {
                breadcrumb.items = [
                    {"name": "貸款批額設定", "active": true}
                ];

                var condition_base = {
                    id: "",
                    agent_code: "",
                    agent_name: "",
                    quota_id: "",
                    funds_type_id: "",
                    header: "",
                    remark: {}
                };
                var init_quota_setting_one = {
                    agent_info_id: "",
                    funds_type_id: "",
                    lower_amount: "",
                    upper_amount: "",
                    term: "",
                    add_term: "",
                    special_rate: "",
                    special_term: "",
                    expired_rate: "",
                    layer: "",
                    remark: "",
                    upper_limit: "",
                    quota_id: "",
                    pin_code: ""
                };
                var agent_info_base = {
                    agent_code: "",
                    type: "",
                    header: "",
                    quota_id: "",
                    agent_info_id: "",
                    remark: {
                        agent_info_id: "",
                        content: "",
                        create_time: "",
                        department_id: "",
                        id: "",
                        type: "",
                        update_time: ""
                    }
                }
                var agent_remark_base = {
                    id: "",
                    agent_info_id: "",
                    content: "",
                    department_id: "DEPARTMENT_ALL",
                    type: 2,
                    pin_code: ""
                }
                //var condition_original = angular.copy(condition_base);
                var quota_original = angular.copy(init_quota_setting_one);
                var agent_info_base_original = angular.copy(agent_info_base);
                var agent_remark_original = angular.copy(agent_remark_base);
                $scope.agent_type_list = agentType.items;
                $scope.sub_post_put = 'POST';
                $scope.deposit_url = globalFunction.getApiUrl('loan/quotasetting');
                $scope.pagination = tmsPagination.create();
                $scope.pagination.resource = quotaSetting;
                $scope.common_pagination = tmsPagination.create();
                $scope.common_pagination.resource = agentsLists;
                $scope.condition = angular.copy(condition_base);
                $scope.quota_setting_one = angular.copy(init_quota_setting_one);
                $scope.agent_info = angular.copy(agent_info_base_original);
                $scope.agent_remark = angular.copy(agent_remark_original);
                //$scope.quote_agent_code = "";
                $scope.isDisabled = false;
                $scope.isDisabled_remark = false;
                $scope.isModifyRemark = false;
                $scope.create_remark_url = globalFunction.getApiUrl('agent/agentremark/update-quota-remark');
                $scope.create_remark_url_put = globalFunction.getApiUrl('agent/agentremark/update-quota-remark');
                $scope.create_remark_url_post = globalFunction.getApiUrl('agent/agentremark/create-quota-remark');
                $scope.remark_agent_code = "";

                $scope.funds = fundsTypes.query({type: 2}, function () {
                    var obj = {};
                    for (var i = 0, len = $scope.funds.length; i < len; i++) {
                        if (undefined !== $scope.funds[i].funds_name) {
                            obj[$scope.funds[i].id] = $scope.funds[i].funds_name;
                        }
                    }
                    $scope.funds_expend = obj;
                });

                $scope.department = departMent.query().$promise.then(function (data) {
                });

                $scope.agent_quotas = "";
                $scope.common_agents = "";

                $scope.excel_condition = {
                    agent_code: ""
                };

                //$scope.excel_condition_sales = {
                //    agent_code : "",
                //    agent_name : "",
                //    upper_limit : "",
                //    term : 0,
                //    expired_rate : 0,
                //    add_term : 0,
                //    special_term : 0,
                //    special_rate : 0
                //}

                $scope.select = function (page) {
                    $scope.excel_condition.agent_code = $scope.condition.agent_code;
                    if (!$scope.condition.quota_id) {
                        return;
                    }
                    $scope.agent_quotas = $scope.pagination.select(page, globalFunction.generateUrlParams({
                        quota_id: $scope.condition.quota_id,
                        sort: 'lower_amount DESC'
                    }, {}));

                }

                // 显示公共批额列表
                $scope.common_select = function (page) {
                    var quota_id = $scope.agent.quota_id;
                    var id = undefined !== $scope.agent.id ? '|' + $scope.agent.id : "";

                    if (!quota_id || !id) {
                        return;
                    }

                    $scope.common_pagination.select(page, globalFunction.generateUrlParams({
                        quota_id: quota_id,
                        id: id
                    }, {parentSupervisor: {}})).$promise.then(function (data) {
                            if (!page || 1 == page) {
                                data.unshift($scope.agent);
                            }
                            $scope.common_agents = data;
                        }, function () {
                            $scope.common_agents = [];
                        });
                }

                //查询用户编号相关信息
                function Search_agent_code(new_value, old_value, callback) {
                    $scope.agent = [];
                    if (new_value) {
                        agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {
                            parentSupervisor: {},
                            quotaRemarks: {}
                        })).$promise.then(function (agent) {
                                if (agent.length > 0) {
                                    $scope.agent = agent[0];
                                    $scope.condition.id = $scope.agent.id;
                                    $scope.condition.agent_name = $scope.agent.agent_name;
                                    $scope.condition.quota_id = $scope.agent.quota_id;
                                    $scope.condition.is_special_underling = $scope.agent.is_special_underling;
                                    $scope.condition.funds_type_id = $scope.agent.funds_type_id;
                                    $scope.condition.agent_type = $scope.agent_type_list[$scope.agent.type];
                                    $scope.condition.header = $scope.agent.parentSupervisor;
                                    //$scope.condition.remark = $scope.agent.quotaRemarks ? $scope.agent.quotaRemarks[0] : {};

                                    $scope.quota_setting_one.agent_info_id = quota_original.agent_info_id = $scope.agent.id;
                                    //remark
                                    $scope.remark_agent_code = new_value;

                                    agent_remark_original.agent_info_id = $scope.agent.id;
                                    agent_remark_original.id = $scope.agent.quotaRemarks[0] ? $scope.agent.quotaRemarks[0]['id'] : "";
                                    agent_remark_original.content = $scope.agent.quotaRemarks[0] ? $scope.agent.quotaRemarks[0]['content'] : "";
                                    //$scope.order.agent_info_id = $scope.agent.id;
                                }
                                else {
                                    //查询 无结果集， 清空已查询出来的相关信息
                                    $scope.agent = {};
                                    //清空 agent information
                                    $scope.condition.id = "";
                                    $scope.condition.agent_name = "";
                                    $scope.condition.quota_id = "";
                                    $scope.condition.funds_type_id = "";
                                    $scope.condition.agent_type = "";
                                    $scope.condition.header = "";
                                    $scope.condition.remark = {};
                                    //清空 批额设定列表
                                    $scope.agent_quotas = "";
                                    //remark
                                    $scope.remark_agent_code = "";
                                    agent_remark_original.agent_info_id = "";
                                    agent_remark_original.id = "";
                                    agent_remark_original.content = "";

                                }
                                $scope.agent_remark = angular.copy(agent_remark_original);
                                if (!!callback) {
                                    callback();
                                }
                            });
                    }
                    else {
                        $scope.agent = {};
                    }
                }

                //监听搜索条件的用户编号
                $scope.$watch('condition.agent_code', globalFunction.debounce(function (new_value, old_value) {
                    Search_agent_code(new_value, old_value);
                }));

                //监听户口编号 input val的长度，一旦有变动，立即隐藏相关数据
                /*var agent_code_length = 0;
                 $scope.agent_code_key_down = function()
                 {
                 agent_code_length = $scope.condition.agent_code.length;
                 }*/
                $scope.agent_code_key_up = function () {
                    var len = $scope.condition.agent_code.length;
                    if ($scope.condition.agent_code !== $scope.agent.agent_code && !!$scope.condition.id) {
                        $scope.condition.id = "";
                        $scope.condition.agent_name = "";
                        $scope.condition.quota_id = "";
                        $scope.condition.funds_type_id = "";
                        $scope.condition.agent_type = "";
                        $scope.condition.header = "";
                        $scope.condition.remark = {};
                        $scope.remark_agent_code = "";

                        $scope.form_agent_remark.clearErrors();
                        $scope.isModifyRemark = false;
                        agent_remark_original.id = "";
                        agent_remark_original.content = "";
                        $scope.agent_remark = angular.copy(agent_remark_original);
                        //$scope.order.agent_info_id = $scope.agent.id;
                        //清空 批额设定列表
                        $scope.agent_quotas = "";

                        $scope.common_agents = [];


                        if ('PUT' == $scope.sub_post_put && $scope.agent_info.agent_code !== $scope.condition.agent_code) {
                            quota_original = angular.copy(init_quota_setting_one);
                            agent_info_base_original = angular.copy(agent_info_base);
                            $scope.quota_setting_one = angular.copy(quota_original);
                            $scope.agent_info = angular.copy(agent_info_base_original);
                            $scope.sub_post_put = 'POST';
                            $scope.quote_agent_code = '';
                        }

                    }
                }

                $scope.quotaSettingInput = function () {
                    $scope.agent_info.type = "";
                    $scope.agent_info.header = "";
                    $scope.quota_setting_one.lower_amount = "";
                    $scope.quota_setting_one.upper_limit = "";

                }

                //
                var param_agent_code = $stateParams.agent_code;
                if (!angular.isUndefined(param_agent_code)) {
                    $scope.condition.agent_code = param_agent_code;
                    Search_agent_code(param_agent_code, "", function () {
                        $scope.search();
                    });
                }

                $scope.add_quota_agent_is_special_underling = false;
                function Search_quota_agent_code(new_value, old_value) {
                    if (new_value) {
                        agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {
                            parentSupervisor: {},
                            quotaRemarks: {}
                        })).$promise.then(function (agent) {
                                if (agent.length > 0) {
                                    if (1 == agent[0].is_special_underling) {
                                        $scope.add_quota_agent_is_special_underling = true;
                                        topAlert.warning('戶口 [' + $scope.quote_agent_code + '] 與上線共享共用批額，不可修改！');
                                        return false;
                                    }
                                    else {
                                        $scope.add_quota_agent_is_special_underling = false;
                                    }

                                    $scope.quota_setting_one.agent_info_id = agent[0]["id"];
                                    $scope.quota_setting_one.quota_id = agent[0].quota_id ? agent[0].quota_id : "";
                                    agent_info_base_original.agent_code = new_value;
                                    agent_info_base_original.type = $scope.agent_type_list[agent[0].type];
                                    agent_info_base_original.header = agent[0].parentSupervisor ? agent[0].parentSupervisor.agent_code : "";
                                    agent_info_base_original.quota_id = agent[0].quota_id ? agent[0].quota_id : "";
                                    agent_info_base_original.agent_info_id = agent[0]["id"];
                                    quota_original.agent_info_id = $scope.quota_setting_one.agent_info_id;
                                    //检测 批额 下限
                                    SetLowerAmount(agent[0].quota_id, true);
                                }
                                else {
                                    $scope.quota_setting_one.agent_info_id = "";
                                    $scope.quota_setting_one.quota_id = "";
                                    agent_info_base_original.agent_code = "";
                                    agent_info_base_original.type = "";
                                    agent_info_base_original.header = "";
                                    agent_info_base_original.quota_id = "";
                                    agent_info_base_original.agent_info_id = "";
                                }
                                $scope.agent_info = angular.copy(agent_info_base_original);
                            });
                    } else {
                        $scope.quota_setting_one.agent_info_id = "";
                        $scope.quota_setting_one.quota_id = "";
                        agent_info_base_original.agent_code = "";
                        agent_info_base_original.type = "";
                        agent_info_base_original.header = "";
                        agent_info_base_original.quota_id = "";
                        agent_info_base_original.agent_info_id = "";
                        $scope.agent_info = angular.copy(agent_info_base_original);
                    }

                }

                //监听批额设定的用户编号
                $scope.$watch('quote_agent_code', globalFunction.debounce(function (new_value, old_value) {
                    Search_quota_agent_code(new_value, old_value);
                }));

                //查询按钮
                $scope.search = function () {
                    if (!$scope.condition.id) {
                        return;
                    }

                    //$scope.excel_condition_sales = "";
                    $scope.agent_quotas = "";
                    $scope.common_agents = "";
                    $scope.pagination.total_items = 0;
                    $scope.common_pagination.total_items = 0;

                    $scope.select();
                    $scope.common_select();
                    //$scope.agent_quotas.$promise.then(function (data) {
                    //
                    //    _.each(data, function (e,index) {

                    //        $scope.excel_condition_sales.agent_code = e.agent_code;
                    //        $scope.excel_condition_sales.agent_name = e.agent_name;
                    //        $scope.excel_condition_sales.upper_limit = e.upper_limit;
                    //        if(index == 0){
                    //            $scope.excel_condition_sales.term = e.term;
                    //            $scope.excel_condition_sales.expired_rate = e.expired_rate;
                    //            $scope.excel_condition_sales.add_term = e.add_term;
                    //            $scope.excel_condition_sales.special_term = e.special_term;
                    //            $scope.excel_condition_sales.special_rate = e.special_rate;
                    //        }
                    //        if($scope.excel_condition_sales.term != e.term && parseInt($scope.excel_condition_sales.term) >= parseInt(e.term))
                    //            $scope.excel_condition_sales.term = e.term;
                    //        if($scope.excel_condition_sales.expired_rate != e.expired_rate && parseInt($scope.excel_condition_sales.expired_rate) <= parseInt(e.expired_rate))
                    //            $scope.excel_condition_sales.expired_rate = e.expired_rate;
                    //        if($scope.excel_condition_sales.add_term != e.add_term && parseInt($scope.excel_condition_sales.add_term) <= parseInt(e.add_term))
                    //            $scope.excel_condition_sales.add_term = e.add_term;
                    //        if($scope.excel_condition_sales.special_term != e.special_term && parseInt($scope.excel_condition_sales.special_term) >= parseInt(e.special_term))
                    //            $scope.excel_condition_sales.special_term = e.special_term;
                    //        if($scope.excel_condition_sales.special_rate != e.special_rate && parseInt($scope.excel_condition_sales.special_rate) <= parseInt(e.special_rate))
                    //            $scope.excel_condition_sales.special_rate = e.special_rate;
                    //    })

                    //})


                }

                //查询 重置按钮
                $scope.resetSearch = function () {
                    $scope.form_search.$setPristine();
                    $scope.condition = angular.copy(condition_base);
                    $scope.excel_condition.agent_code = "";
                    $scope.agent_quotas = "";
                    $scope.common_agents = "";
                    $scope.pagination.total_items = 0;
                    $scope.common_pagination.total_items = 0;

                    //重置备注
                    $scope.remark_agent_code = "";
                    agent_remark_original = angular.copy(agent_remark_base);
                    $scope.agent_remark = angular.copy(agent_remark_original);

                    //在编辑某用户批额设定， 点击了 search 中的重置按钮，把编辑框的内容清空。
                    if ('PUT' == $scope.sub_post_put && $scope.agent_info.agent_code !== $scope.condition.agent_code) {
                        quota_original = angular.copy(init_quota_setting_one);
                        agent_info_base_original = angular.copy(agent_info_base);
                        $scope.quota_setting_one = angular.copy(quota_original);
                        $scope.agent_info = angular.copy(agent_info_base_original);
                        $scope.sub_post_put = 'POST';
                        $scope.quote_agent_code = '';
                    }

                }


                //貸款限期和過期手續費設定 編輯按钮
                $scope.update = function (id) {
                    $scope.sub_post_put = 'PUT';

                    quotaSetting.get({id: id}, function (data) {
                        $scope.quota_setting_one = data;
                        $scope.quota_setting_one.expired_rate = formatNumber($scope.quota_setting_one.expired_rate);//用於格式數據
                        //$scope.quota_setting_one.special_rate = formatNumber($scope.quota_setting_one.special_rate);
                        $scope.quota_setting_one.special_rate = parseFloat($scope.quota_setting_one.special_rate);
                        if (angular.isUndefined($scope.quota_setting_one.agent_info_id)) {
                            $scope.quota_setting_one.agent_info_id = $scope.agent_info.agent_info_id;
                        }
                        quota_original = angular.copy($scope.quota_setting_one);
                        //quota_original.remark_id = $scope.condition.remark ? $scope.condition.remark.id : '';
                        //$scope.quota_setting_one.remark_id = $scope.condition.remark ? $scope.condition.remark.id : '';

                        if ($scope.quote_agent_code != $scope.condition.agent_code) {
                            $scope.quote_agent_code = $scope.condition.agent_code;
                        }
                        agent_info_base_original.agent_code = $scope.condition.agent_code;
                    });
                }

                //貸款限期和過期手續費設定 删除按钮
                $scope.delete = function (id) {
                    //windowItems.confirm('系統提示','確定刪除該條記錄嗎？',function() {
                    pinCodeModal(quotaSetting, 'delete', {id: id}, '刪除成功！').then(function () {
                        $scope.select();
                        SetLowerAmount(agent_info_base_original.quota_id, true);
                    })
                    //})

                }

                $scope.$watch("quota_setting_one.funds_type_id", globalFunction.debounce(function (new_value, old_value) {
                    if (!new_value || 'PUT' == $scope.sub_post_put) {
                        return;
                    }
                    quotaSettingsCommon.query({funds_type_id: new_value}, function (data) {
                        var quote_data = data[0];
                        quote_data.expired_rate = formatNumber(quote_data.expired_rate);
                        quote_data.special_rate = formatNumber(quote_data.special_rate);
                        if (quote_data) // 当有数据的时候，才赋值
                        {
                            delete quote_data.lower_amount;
                            delete quote_data.upper_amount;
                            for (var i in quote_data) {
                                if (undefined !== $scope.quota_setting_one[i]) {
                                    $scope.quota_setting_one[i] = quote_data[i];
                                }
                            }
                        }
                    });
                }));

                //新增批额设定
                $scope.addQuotaSetting = function (show_max_tis) {
                    $scope.sub_post_put = 'POST';
                    if ($scope.quote_agent_code != $scope.condition.agent_code) {
                        agent_info_base_original = angular.copy(agent_info_base);
                        $scope.quote_agent_code = $scope.condition.agent_code;
                        quota_original = angular.copy(init_quota_setting_one);
                        SetLowerAmount(agent_info_base_original.quota_id, true, true);
                    } else {
                        //$scope.quote_agent_code = "";
                        var agent_info_id = $scope.quota_setting_one.agent_info_id;
                        quota_original = angular.copy(init_quota_setting_one);
                        quota_original.agent_info_id = agent_info_id;
                        SetLowerAmount(agent_info_base_original.quota_id, show_max_tis, true);
                    }

                    $scope.reset();
                }

                //设置批额下限
                function SetLowerAmount(quota_id, show_max_tis, event_add) {
                    if ('PUT' == $scope.sub_post_put) {
                        return;
                    }
                    var lower_amount = null;
                    if (!quota_id) {
                        quota_original.lower_amount = event_add ? "" : 0;
                        $scope.quota_setting_one.lower_amount = event_add ? "" : 0;
                        return;
                    }
                    quotaSetting.query(globalFunction.generateUrlParams({
                        quota_id: quota_id,
                        sort: 'lower_amount DESC'
                    }, {})).$promise.then(function (data) {
                            if (data.length) {
                                var upper = data[0]['upper_amount'];
                                var lower = data[0]['lower_amount'];
                                if (0 == upper) {
                                    if (false !== show_max_tis) {
                                        topAlert.warning('戶口 [' + $scope.quote_agent_code + '] 的批額範圍已設置成無限大，不可再新增批額設定');
                                    }
                                    $scope.quote_agent_code = "";
                                    quota_original.lower_amount = "";
                                    quota_original.upper_limit = "";
                                    $scope.quota_setting_one.lower_amount = "";
                                    $scope.quota_setting_one.upper_limit = "";
                                }
                                else {
                                    quota_original.upper_limit = data[0]['upper_limit'];
                                    quota_original.lower_amount = Number(upper) + 1;
                                    $scope.quota_setting_one.upper_limit = data[0]['upper_limit'];
                                    $scope.quota_setting_one.lower_amount = Number(upper) + 1;
                                }
                            }
                            else {
                                quota_original.lower_amount = 0;
                                quota_original.upper_limit = 0;
                                $scope.quota_setting_one.lower_amount = 0;
                                $scope.quota_setting_one.upper_limit = 0;
                            }
                        });

                }

                //批額設定 提交按钮
                $scope.add = function () {
                    if ($scope.add_quota_agent_is_special_underling) {
                        topAlert.warning('戶口 [' + $scope.quote_agent_code + '] 與上線共享共用批額，不可修改！');
                        return;
                    }

                    var sub_method = quotaSetting.save;
                    var tis = "添加成功。";
                    if ('PUT' == $scope.sub_post_put) {
                        sub_method = quotaSetting.update;
                        tis = "修改成功。";
                    }
                    //$scope.quota_setting_one.remark = $scope.agent_info.remark.content;
                    if ($scope.isDisabled) {
                        return;
                    }
                    $scope.isDisabled = true;

                    $scope.form_quota_setting.checkValidity().then(function () {
                        sub_method($scope.quota_setting_one, function () {

                            topAlert.success(tis);
                            $scope.addQuotaSetting(false);
                            //$scope.select();
                            $scope.isDisabled = false;

                            // 新增的用户 刚开始没有 quota_id  ，增加批额后，需重新获取用户 quota_id 在select
                            Search_agent_code($scope.condition.agent_code, "", function () {
                                SetLowerAmount($scope.agent.quota_id, false);
                                $scope.search();

                                agent_info_base_original.remark = $scope.condition.remark;
                                $scope.agent_info.remark = agent_info_base_original.remark;
                            });

                        }, function () {
                            $scope.isDisabled = false;
                        });
                    });
                }

                //批額設定 重置按钮
                $scope.reset = function () {
                    if ('PUT' == $scope.sub_post_put) {
                        $scope.quote_agent_code = $scope.condition.agent_code;
                    }
                    $scope.form_quota_setting.$setPristine();
                    $scope.quota_setting_one = angular.copy(quota_original);
                    $scope.agent_info = angular.copy(agent_info_base_original);
                    $scope.form_quota_setting.clearErrors();
                }

                //修改 备注按钮
                $scope.modifyRemark = function () {
                    $scope.isModifyRemark = !$scope.isModifyRemark;
                }

                $scope.deleteRemark = function () {
                    if ('' === $scope.agent_remark.id) {
                        return;
                    }

                    pinCodeModal(agentRemark, 'delete', {id: $scope.agent_remark.id}, '刪除成功！').then(function () {
                        Search_agent_code($scope.condition.agent_code, "", function () {
                        });
                    })


                }

                //批额备注 提交按钮
                $scope.addRemark = function () {
                    if ($scope.isDisabled_remark) {
                        return;
                    }
                    $scope.isDisabled_remark = true;

                    var sub_method = agentRemark.agentRemarkCreate;
                    var tis = "添加批額備註成功。";
                    var params = angular.copy($scope.agent_remark);
                    $scope.create_remark_url = $scope.create_remark_url_post;

                    if ('' !== $scope.agent_remark.id) {
                        delete params.agent_info_id;
                        $scope.create_remark_url = $scope.create_remark_url_put;
                        sub_method = agentRemark.agentRemarkUpdate;
                        tis = "修改批額備註成功。";
                    }
                    else {
                        delete params.id;
                    }

                    $scope.form_agent_remark.checkValidity().then(function () {
                        sub_method(params, function () {
                            topAlert.success(tis);
                            $scope.modifyRemark();
                            Search_agent_code($scope.condition.agent_code, "", function () {
                            });
                            $scope.isDisabled_remark = false;
                        }, function () {
                            $scope.isDisabled_remark = false;
                        });
                    });
                }

                //批额备注 重置按钮
                $scope.resetRemark = function () {
                    $scope.agent_remark = angular.copy(agent_remark_original);
                }

                //撤销公共 按钮
                $scope.deleteComman = function (id) {
                    //return;
                    var con = {
                        type: 3,
                        agent_info_id: id,
                        source_agent_id: $scope.agent.id,
                        quota_id: $scope.agent.quota_id

                    }
                    pinCodeModal(quotaShare, 'save', con, '刪除成功！').then(function () {
                        $scope.agent_quotas = [];
                        $scope.common_agents = [];
                        $scope.quota_setting_one.lower_amount = 0;
                    })
                }

                //新增公共批额按钮
                $scope.addComman = function () {
                    var modalInstance;
                    modalInstance = $modal.open({
                        templateUrl: "views/loan/add-quota-common.html",
                        controller: 'addQuotaCommonCtrl',
                        resolve: {
                            quota_id: function () {
                                return $scope.agent.quota_id;
                            },
                            source_agent_id: function () {
                                return $scope.agent.id;
                            }
                        }
                    });
                    modalInstance.result.then((function (result) {
                        if (result) {
                            $scope.common_select();
                        }
                    }), function () {
                        //$log.info("Modal dismissed at: " + new Date());
                    });
                }

            }]).controller('addQuotaCommonCtrl', ['$scope', 'globalFunction', 'agentsLists', 'agentQuota', 'topAlert', 'agentType', '$modalInstance', 'quotaShare', 'quota_id', 'source_agent_id',
            function ($scope, globalFunction, agentsLists, agentQuota, topAlert, agentType, $modalInstance, quotaShare, quota_id, source_agent_id) {

                $scope.sub_post_put = 'POST';
                $scope.quota_share_url = globalFunction.getApiUrl('loan/quotasetting/quota-share');

                $scope.common_agent = {
                    source_agent_id: source_agent_id,
                    agent_info_id: "",
                    quota_id: quota_id,
                    type: "1",
                    pin_code: ""
                };

                $scope.agent = {
                    agent_code: ""
                };
                $scope.agent_type = "";
                $scope.header = "";
                $scope.sub_post_put = 'POST';
                $scope.deposit_url = globalFunction.getApiUrl('loan/quotasetting/create-common');
                //监听新增公共的用户编号
                $scope.$watch('agent.agent_code', globalFunction.debounce(function (new_value, old_value) {
                    if (new_value) {
                        agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {parentSupervisor: {}})).$promise.then(function (agent) {
                            if (agent.length > 0) {
                                //$scope.agent = agent[0];
                                var tmp_agent = agent[0];
                                $scope.agent_name = tmp_agent.agent_name;
                                $scope.agent_type = agentType.items[tmp_agent.type];
                                $scope.header = tmp_agent.parentSupervisor ? tmp_agent.parentSupervisor.agent_code : "";
                                $scope.common_agent.agent_info_id = tmp_agent.id;
                                //$scope.common_agent.quota_id = $scope.agent.quota_id;
                            }
                            else {
                                $scope.agent_name = "";
                                $scope.agent_type = "";
                                $scope.common_agent.agent_info_id = "";
                            }
                        });
                    }

                }));
                $scope.isDisabled = false;
                $scope.sub_add_common = function () {
                    $scope.isDisabled = true;
                    $scope.form_add_common_quota.checkValidity().then(function () {
                        quotaShare.save($scope.common_agent, function () {
                            $scope.isDisabled = false;
                            topAlert.success("添加成功。");
                            //$scope.search();
                            $modalInstance.close(true);
                        }, function () {
                            $scope.isDisabled = false;
                        })
                    });
                };

                $scope.cancel_add_common = function () {
                    $modalInstance.close(false);
                };
            }]).controller('quotaSettingStreamCtrl', ['$scope', '$filter', 'tmsPagination', 'globalFunction', 'breadcrumb', 'agentsLists', 'agentType', '$stateParams', 'quotaOperation', 'agentreMarkOperation', 'operationTypes',
            function ($scope, $filter, tmsPagination, globalFunction, breadcrumb, agentsLists, agentType, $stateParams, quotaOperation, agentreMarkOperation, operationTypes) {

                breadcrumb.items = [
                    {"name": "批額流水", "active": true}
                ];
                var init_search = true;
                if ($stateParams.agent_code) {
                    init_search = false;
                }
                $scope.operationTypes = operationTypes.items;
                $scope.agentType = agentType.items;
                var condition_init = {
                    agent_code: $stateParams.agent_code || "",
                    agent_info_id: "",
                    agent_remark_id: ""
                }
                $scope.condition = angular.copy(condition_init);

                $scope.page = tmsPagination.create();
                $scope.page.resource = quotaOperation;

                $scope.page_remark = tmsPagination.create();
                $scope.page_remark.resource = agentreMarkOperation;

                $scope.settingStreams = [];
                $scope.settingStream_remarks = [];
                $scope.search = function (page) {
                    var tmp_condition = angular.copy($scope.condition);

                    $scope.settingStreams = $scope.page.select(page, {agent_info_id: tmp_condition.agent_info_id}, {});
                }
                $scope.search_remark = function (page) {
                    var tmp_condition = angular.copy($scope.condition);

                    if (!(!!tmp_condition.agent_info_id ^ !!tmp_condition.agent_remark_id)) {
                        $scope.settingStream_remarks = $scope.page_remark.select(page, {agent_remark_id: tmp_condition.agent_remark_id}, {});
                    } else {
                        $scope.settingStream_remarks = [];
                    }

                }

                $scope.select = function () {
                    $scope.search();
                    $scope.search_remark();
                }
                if (init_search) {
                    $scope.select();
                }

                $scope.reset = function () {
                    $scope.condition = angular.copy(condition_init);
                    $scope.settingStreams = [];
                    $scope.settingStream_remarks = [];
                    $scope.search();
                    $scope.search_remark();
                }

                $scope.agent = {};

                $scope.$watch('condition.agent_code', globalFunction.debounce(function (new_value, old_value) {
                    if (new_value) {
                        agentsLists.query(globalFunction.generateUrlParams({agent_code: new_value}, {
                            parentSupervisor: {},
                            quotaRemarks: {}
                        })).$promise.then(function (agent) {
                                if (agent.length > 0) {
                                    var tmp_agent = agent[0];
                                    $scope.agent.agent_name = tmp_agent.agent_name;
                                    $scope.agent.agent_type = agentType.items[tmp_agent.type];
                                    $scope.agent.header = tmp_agent.parentSupervisor ? tmp_agent.parentSupervisor.agent_code : "";
                                    $scope.condition.agent_info_id = tmp_agent.id;
                                    $scope.condition.agent_remark_id = tmp_agent.quotaRemarks.length ? tmp_agent.quotaRemarks[0].id : "";
                                    //$scope.common_agent.agent_info_id = tmp_agent.id;
                                    //$scope.common_agent.quota_id = $scope.agent.quota_id;

                                    if (!init_search) {
                                        $scope.select();
                                        init_search = true;
                                    }

                                }
                                else {
                                    $scope.agent.agent_name = "";
                                    $scope.agent.agent_type = "";
                                    $scope.agent.header = "";
                                    $scope.condition.agent_info_id = "123456789";
                                    $scope.condition.agent_remark_id = "";
                                    //$scope.common_agent.agent_info_id = "";
                                }
                            });
                    }
                    else {
                        $scope.agent.agent_name = "";
                        $scope.agent.agent_type = "";
                        $scope.agent.header = "";
                        $scope.condition.agent_info_id = "";
                        $scope.condition.agent_remark_id = "";
                    }
                }));

            }])
        //手續費付款 ==常用備註彈框
        .controller('test', ['$scope', 'commonPhrase', 'pinCodeModal', 'topAlert', 'globalFunction', 'tmsPagination', '$modalInstance', function ($scope, commonPhrase, pinCodeModal, topAlert, globalFunction, tmsPagination, $modalInstance) {

            $scope.form_currency_url = globalFunction.getApiUrl('common/commoncurrency');

            $scope.tis_params = {
                currency: "",
                pin_code: "",
                type: 15
            }

            var type = 15;
            $scope.page = tmsPagination.create();
            $scope.page.resource = commonPhrase;
            //$scope.page.join({"type":""})


            $scope.search = function (page) {
                $scope.tiss = $scope.page.select(page, {type: 15}, {});
            }
            $scope.search();

            $scope.delete = function (tis) {
                pinCodeModal(commonPhrase, 'delete', {id: tis.id}, '刪除成功！').then(function () {
                    $scope.search();
                })
            }

            $scope.tis_isDisabled = false;
            $scope.addTis = function () {
                if ($scope.tis_isDisabled) {
                    return;
                }
                $scope.tis_isDisabled = true;
                commonPhrase.save($scope.tis_params, function () {
                    topAlert.success('添加常用成功！');
                    $scope.tis_isDisabled = false;
                    $scope.search();
                    $scope.form_tis.clearErrors();

                    $scope.tis_params = {
                        currency: "",
                        pin_code: "",
                        type: 1
                    }
                }, function () {
                    $scope.tis_isDisabled = false;
                });
            }

            $scope.select = function (tis) {
                $modalInstance.close(tis.phrase);
            }

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };
        }])
}).call(this);
