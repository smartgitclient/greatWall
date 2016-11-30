/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.commission.json',['ngResource']).service('commissions',function($resource){

        return [
            {rule_name: 'AU', capital_type: 'U', commission_p: [
                {
                    suit_halls: '永利鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'F8', cash_rate: '80',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '5',integral_assign: '0'
                        },
                        {
                            user_type: '下線二',commission_assign: '2',integral_assign: '0'
                        },
                        {
                            user_type: '下線三',commission_assign: '3',integral_assign: '2'
                        },
                        {
                            user_type: '下線四',commission_assign: '90',integral_assign: '3'
                        }

                    ]
                },
                {
                    suit_halls: 'MGM鉅星',commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'F8', cash_rate: '80',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '5',integral_assign: '0'
                        },
                        {
                            user_type: '下線二',commission_assign: '2',integral_assign: '0'
                        },
                        {
                            user_type: '下線三',commission_assign: '3',integral_assign: '2'
                        },
                        {
                            user_type: '下線四',commission_assign: '90',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '新葡京鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'F8', cash_rate: '80',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '5',integral_assign: '0'
                        },
                        {
                            user_type: '下線二',commission_assign: '2',integral_assign: '0'
                        },
                        {
                            user_type: '下線三',commission_assign: '3',integral_assign: '2'
                        },
                        {
                            user_type: '下線四',commission_assign: '90',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金1', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'F8', cash_rate: '80',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '5',integral_assign: '0'
                        },
                        {
                            user_type: '下線二',commission_assign: '2',integral_assign: '0'
                        },
                        {
                            user_type: '下線三',commission_assign: '3',integral_assign: '2'
                        },
                        {
                            user_type: '下線四',commission_assign: '90',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金2',commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'F8', cash_rate: '80',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '5',integral_assign: '0'
                        },
                        {
                            user_type: '下線二',commission_assign: '2',integral_assign: '0'
                        },
                        {
                            user_type: '下線三',commission_assign: '3',integral_assign: '2'
                        },
                        {
                            user_type: '下線四',commission_assign: '90',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金3',commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'F8', cash_rate: '80',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '5',integral_assign: '0'
                        },
                        {
                            user_type: '下線二',commission_assign: '2',integral_assign: '0'
                        },
                        {
                            user_type: '下線三',commission_assign: '3',integral_assign: '2'
                        },
                        {
                            user_type: '下線四',commission_assign: '90',integral_assign: '3'
                        }
                    ]
                }
            ]
            },
            {rule_name: 'BU', capital_type: 'U', commission_p: [
                {
                    suit_halls: '永利鉅星', commission_total: '210', integral_total: '55', integral_expire: '10', recycle_agent: 'xx', cash_rate: '70',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '110',integral_assign: '10'
                        },
                        {
                            user_type: '下線一',commission_assign: '120',integral_assign: '20'
                        },
                        {
                            user_type: '下線二',commission_assign: '250',integral_assign: '30'
                        }
                    ]
                },
                {
                    suit_halls: 'MGM鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '新葡京鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金1', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金2', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金3', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                }
            ]
            },
            {rule_name: 'CU', capital_type: 'U', commission_p: [
                {
                    suit_halls: '永利鉅星', commission_total: '120', integral_total: '25', integral_expire: '11', recycle_agent: 'xx', cash_rate: '150',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '101',integral_assign: '210'
                        },
                        {
                            user_type: '下線一',commission_assign: '140',integral_assign: '222'
                        },
                        {
                            user_type: '下線二',commission_assign: '350',integral_assign: '123'
                        }

                    ]
                },
                {
                    suit_halls: 'MGM鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '新葡京鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金1', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金2', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金3', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                }
            ]
            },
            {rule_name: 'DU', capital_type: 'U', commission_p: [
                {
                    suit_halls: '永利鉅星', commission_total: '120', integral_total: '15', integral_expire: '5', recycle_agent: 'xx', cash_rate: '40',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '20',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '30',integral_assign: '10'
                        }
                    ]
                },
                {
                    suit_halls: 'MGM鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '新葡京鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金1', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金2', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金3', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                }
            ]
            },
            {rule_name: 'EU', capital_type: 'U', commission_p: [
                {
                    suit_halls: '永利鉅星', commission_total: '150', integral_total: '50', integral_expire: '8', recycle_agent: 'xx', cash_rate: '80',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '15',integral_assign: '5'
                        },
                        {
                            user_type: '下線一',commission_assign: '50',integral_assign: '32'
                        },
                        {
                            user_type: '下線二',commission_assign: '35',integral_assign: '13'
                        }
                    ]
                },
                {
                    suit_halls: 'MGM鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '新葡京鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金1', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金2', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金3', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線二',commission_assign: '50',integral_assign: '3'
                        }
                    ]
                }
            ]
            }

        ]
    }).service('capitalType',function($resource){
        return [
            {
                capital_type: 'C', integral_expire: '6', recycle_agent: 'F8', cash_rate: '50',
                assigns: [
                    {
                        user_type: '股東',commission_assign: '10',integral_assign: '0'
                    },
                    {
                        user_type: '下線一',commission_assign: '5',integral_assign: '0'
                    },
                    {
                        user_type: '下線二',commission_assign: '95',integral_assign: '5'
                    }
                ]
            },
            {
                capital_type: 'M', integral_expire: '6', recycle_agent: 'F8', cash_rate: '50',
                assigns: [
                    {
                        user_type: '股東',commission_assign: '10',integral_assign: '0'
                    },
                    {
                        user_type: '下線一',commission_assign: '5',integral_assign: '0'
                    },
                    {
                        user_type: '下線二',commission_assign: '95',integral_assign: '5'
                    }
                ]
            },
            {
                capital_type: 'U', integral_expire: '6', recycle_agent: 'F8', cash_rate: '50',
                assigns: [
                    {
                        user_type: '股東',commission_assign: '15',integral_assign: '0'
                    },
                    {
                        user_type: '下線一',commission_assign: '0',integral_assign: '0'
                    },
                    {
                        user_type: '下線二',commission_assign: '90',integral_assign: '5'
                    }
                ]
            }

        ]
    }).service('commissionCrads',function($resource){
       return [
           {"card_name":"A","rule_name":""},
           {"card_name":"B","rule_name":""},
           {"card_name":"C","rule_name":""},
           {"card_name":"D","rule_name":""},
           {"card_name":"E","rule_name":""},
           {"card_name":"F","rule_name":""},
           {"card_name":"G","rule_name":""},
           {"card_name":"H","rule_name":""},
           {"card_name":"I","rule_name":""},
           {"card_name":"J","rule_name":"AU"}

       ]
    }).service('bindingLines',function($resource){
        return [
            {"binding_line":"A線","binding_head":"A7"},
            {"binding_line":"B線","binding_head":"B9"},
            {"binding_line":"C線","binding_head":"C11"},
            {"binding_line":"D線","binding_head":"D6"},
            {"binding_line":"E線","binding_head":"E3"}
        ]
    }).service('new_cards',function($resource){
        this.data = null;
    }).service('agentsRollings',function($resource){
        return [
            {"binding_line":"A線","agent_code":"F8","agent_type":"上線","agent_name":"李靜1","phone":"+853-1478523","cards":[
                {"card_name":"C", "rule_name":"CU","status":"已綁定"}
            ],
               "agents":[
                    {"agent_code":"F8","agent_type":"股東"}
                ]
            },
            {"binding_line":"B線","agent_code":"FA8","agent_type":"內股","agent_name":"羅雯雯","phone":"+853-61235233","cards":[
                {"card_name":"AM", "rule_name":"BU","status":"已綁定"}
            ],
            "agents":[
                {"agent_code":"F8","agent_type":"股東"},
                {"agent_code":"FA8","agent_type":"內股"}
            ]
            },
            {"binding_line":"A線","agent_code":"FA233","agent_type":"下線","agent_name":"李達文","phone":"+853-1478523","cards":[
                {"card_name":"A", "rule_name":"","status":"未綁定"},
                {"card_name":"B", "rule_name":"BU","status":"已綁定"},
                {"card_name":"C", "rule_name":"CU","status":"已綁定"}
            ],
            "agents":[
                {"agent_code":"F8","agent_type":"股東"},
                {"agent_code":"FA8","agent_type":"內股"},
                {"agent_code":"FA233","agent_type":"下線"}
            ]
            },
            {"binding_line":"C線","agent_code":"FA38","agent_type":"下線","agent_name":"王林","phone":"+853-1478523","cards":[
                {"card_name":"A", "rule_name":"AU","status":"已綁定"},
                {"card_name":"C", "rule_name":"BU","status":"已綁定"},
                {"card_name":"D", "rule_name":"CU","status":"已綁定"}
            ],
                "agents":[
                    {"agent_code":"F8","agent_type":"股東"},
                    {"agent_code":"FA8","agent_type":"內股"},
                    {"agent_code":"FA38","agent_type":"下線"}
                ]
            },
            {"binding_line":"C線","agent_code":"FA256","agent_type":"下線","agent_name":"陳陽","phone":"+853-1478523","cards":[
                {"card_name":"A", "rule_name":"AU","status":"已綁定"},
                {"card_name":"C", "rule_name":"BU","status":"已綁定"},
                {"card_name":"D", "rule_name":"CU","status":"已綁定"}
            ],
                "agents":[
                    {"agent_code":"F8","agent_type":"股東"},
                    {"agent_code":"FA8","agent_type":"內股"},
                    {"agent_code":"FA256","agent_type":"下線"}
                ]
            },
            {"binding_line":"C線","agent_code":"FA338","agent_type":"下線","agent_name":"黃丰","phone":"+853-1478523","cards":[
                {"card_name":"A", "rule_name":"AU","status":"已綁定"},
                {"card_name":"C", "rule_name":"BU","status":"已綁定"},
                {"card_name":"D", "rule_name":"CU","status":"已綁定"}
            ],
                "agents":[
                    {"agent_code":"F8","agent_type":"股東"},
                    {"agent_code":"FA8","agent_type":"內股"},
                    {"agent_code":"FA338","agent_type":"下線"}
                ]
            },
            {"binding_line":"C線","agent_code":"FA456","agent_type":"下線","agent_name":"張山","phone":"+853-1478523","cards":[
                {"card_name":"A", "rule_name":"AU","status":"已綁定"},
                {"card_name":"C", "rule_name":"BU","status":"已綁定"},
                {"card_name":"D", "rule_name":"CU","status":"已綁定"}
            ],
                "agents":[
                    {"agent_code":"F8","agent_type":"股東"},
                    {"agent_code":"FA8","agent_type":"內股"},
                    {"agent_code":"FA456","agent_type":"下線"}
                ]
            }


        ]
    }).service('commissions_cards',function($resource){
        return [
            {'card_name':'A',rule_name: 'AU','agent_code':'FA233',capital_type: 'U','status':'已綁定', commission_p: [
                {
                    suit_halls: '永利鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'F8', cash_rate: '50',
                    assigns: [
                        {
                          'user_type': '股東',commission_assign: '11',integral_assign: '1'
                        },
                        {
                            user_type: '下線一',commission_assign: '12',integral_assign: '2'
                        },
                        {
                            user_type: '下線一',commission_assign: '12',integral_assign: '2'
                        }
                    ]
                },
                {
                    suit_halls: 'MGM鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'F8', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '16',integral_assign: '4'
                        },
                        {
                            user_type: '下線一',commission_assign: '24',integral_assign: '5'
                        },
                        {
                            user_type: '下線一',commission_assign: '12',integral_assign: '2'
                        }
                    ]
                },
                {
                    suit_halls: '新葡京鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '19',integral_assign: '7'
                        },
                        {
                            user_type: '下線一',commission_assign: '24',integral_assign: '8'
                        },
                        {
                            user_type: '下線一',commission_assign: '12',integral_assign: '2'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金1', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '22',integral_assign: '10'
                        },
                        {
                            user_type: '下線一',commission_assign: '23',integral_assign: '11'
                        },
                        {
                            user_type: '下線一',commission_assign: '12',integral_assign: '2'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金2', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '25',integral_assign: '13'
                        },
                        {
                            user_type: '下線一',commission_assign: '26',integral_assign: '14'
                        },
                        {
                            user_type: '下線一',commission_assign: '12',integral_assign: '2'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金3', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '10',integral_assign: '2'
                        },
                        {
                            user_type: '下線一',commission_assign: '12',integral_assign: '2'
                        }
                    ]
                }
            ]
            },
            {'card_name':'B',rule_name: 'BU','agent_code':'FA233', capital_type: 'U', 'status':'已綁定',commission_p: [
                {
                    suit_halls: '永利鉅星', commission_total: '210', integral_total: '55', integral_expire: '10', recycle_agent: 'xx', cash_rate: '70',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '110',integral_assign: '10'
                        },
                        {
                            user_type: '下線一',commission_assign: '24',integral_assign: '20'
                        }
                    ]
                },
                {
                    suit_halls: 'MGM鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '36',integral_assign: '2'
                        }
                    ]
                },
                {
                    suit_halls: '新葡京鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '36',integral_assign: '2'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金1', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '35',integral_assign: '2'
                        }

                    ]
                },
                {
                    suit_halls: '太陽城多金2', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '38',integral_assign: '2'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金3', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        },
                        {
                            user_type: '下線一',commission_assign: '32',integral_assign: '2'
                        }
                    ]
                }
            ]
            },
            {'card_name':'C',rule_name: 'CU','agent_code':'FA233', capital_type: 'U', 'status':'已綁定',commission_p: [
                {
                    suit_halls: '永利鉅星', commission_total: '120', integral_total: '25', integral_expire: '11', recycle_agent: 'xx', cash_rate: '150',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '101',integral_assign: '210'
                        }

                    ]
                },
                {
                    suit_halls: 'MGM鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        }
                    ]
                },
                {
                    suit_halls: '新葡京鉅星', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金1', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金2', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        }
                    ]
                },
                {
                    suit_halls: '太陽城多金3', commission_total: '110', integral_total: '5', integral_expire: '6', recycle_agent: 'xx', cash_rate: '50',
                    assigns: [
                        {
                            user_type: '股東',commission_assign: '10',integral_assign: '0'
                        }
                    ]
                }
            ]
            }
        ]
    });

}).call(this);