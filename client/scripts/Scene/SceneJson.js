/**
 * Created by Allen.zhang on 2014/8/21.
 */
(function() {
    'use strict';
    angular.module('app.scene.json', ['ngResource'])/*.service('sceneShiftRecord', function ($resource) {
            return [
            {"scene_id": 0, "hall":"永利鉅星", "month_settlement": "3635", "day_settlement": "320", "table_settlement": "60", "year": "2014", "month": "08", "shift_date": "19", "remark": ""},
            {"scene_id": 1, "hall":"永利鉅星", "month_settlement": "3315", "day_settlement": "450", "table_settlement": "0", "year": "2014", "month": "08", "shift_date": "17", "remark": ""},
            {"scene_id": 2, "hall":"永利鉅星", "month_settlement": "2865", "day_settlement": "625", "table_settlement": "0", "year": "2014", "month": "08", "shift_date": "17", "remark": ""},
            {"scene_id": 3, "hall":"永利鉅星", "month_settlement": "2242", "day_settlement": "258", "table_settlement": "0", "year": "2014", "month": "08", "shift_date": "16", "remark": ""},
            {"scene_id": 4, "hall":"永利鉅星", "month_settlement": "1984", "day_settlement": "316", "table_settlement": "210", "year": "2014", "month": "08", "shift_date": "15", "remark": ""},
            {"scene_id": 5, "hall":"永利鉅星", "month_settlement": "1668", "day_settlement": "-230", "table_settlement": "122", "year": "2014", "month": "08", "shift_date": "14", "remark": ""},
            {"scene_id": 6, "hall":"永利鉅星", "month_settlement": "1898", "day_settlement": "356", "table_settlement": "0", "year": "2014", "month": "08", "shift_date": "13", "remark": ""},
            {"scene_id": 7, "hall":"永利鉅星", "month_settlement": "1542", "day_settlement": "-108", "table_settlement": "20", "year": "2014", "month": "08", "shift_date": "12", "remark": ""},
            {"scene_id": 8, "hall":"永利鉅星", "month_settlement": "1650", "day_settlement": "420", "table_settlement": "0", "year": "2014", "month": "08", "shift_date": "11", "remark": ""},
            {"scene_id": 9, "hall":"永利鉅星", "month_settlement": "1230", "day_settlement": "235", "table_settlement": "180", "year": "2014", "month": "08", "shift_date": "10", "remark": ""}

        ]

    })*/.service('halls', function($resource){
        return [
            {"hall_id":"0","hall_name":"永利鉅星"},
            {"hall_id":"1","hall_name":"美高梅鉅星"},
            {"hall_id":"2","hall_name":"新葡京鉅星"},
            {"hall_id":"3","hall_name":"银河鉅星"},
            {"hall_id":"4","hall_name":"新濠天地鉅星"}
        ]
    }).service('sceneSummary',function(){ //場面匯總
        return [
            {"id":0,"agent_code":"FA233", "thrum":"F8", "full_name":"李達文","loss_win_amount": "30", "rolling_amount": "600","created":"2014.08.01 14:30:30","brokerage":"蔡晓洁","remark":""},
            {"id":1,"agent_code":"FA8", "thrum":"F8","full_name":"吳清","loss_win_amount": "55", "rolling_amount": "150","created":"2014.08.01 15:21:28","brokerage":"蔡晓洁","remark":""},
            {"id":2,"agent_code":"FA408", "thrum":"D1","full_name":"李強","loss_win_amount": "-20", "rolling_amount": "100","created":"2014.08.01 14:22:55","brokerage":"蔡晓洁","remark":""},
            {"id":3,"agent_code":"D56", "thrum":"D1","full_name":"王富","loss_win_amount": "-150", "rolling_amount": "200","created":"2014.08.01 14:22:55","brokerage":"蔡晓洁","remark":""},
            {"id":4,"agent_code":"H11", "thrum":"D1","full_name":"李鑫","loss_win_amount": "0", "rolling_amount": "180","created":"2014.08.01 14:22:55","brokerage":"蔡晓洁","remark":""}
        ]
    }).service('agentSceneDetail',function(){ //戶口場面數明細
        return [
            {"id":0, "hall":"永利鉅星", "scene_summary_id":"0", "agent_code":"FA233","agent_name":"于成","guest":"陳明" ,"in_time":"14:08:20" ,"out_time":"16:16:18","in_capital": "50現", "out_capital": "提 63現 	", "loss_win_amount":"13", "rolling_amount":"50", "created":"2014-08-25","brokerage":"蔡晓洁","status":"已離場","remark":""},
            {"id":1, "hall":"永利鉅星", "scene_summary_id":"0", "agent_code":"FA233","agent_name":"吳清","guest":"李洪","in_time":"14:10:34" ,"out_time":"17:08:12","in_capital": "80M+20M（道具）", "out_capital": "贖 80M+ 贖20M（道具）+提 20現", "loss_win_amount":"20", "rolling_amount":"100","created":"2014-08-25","brokerage":"蔡晓洁","status":"已離場","remark":""},

            {"id":2, "hall":"永利鉅星", "scene_summary_id":"1", "agent_code":"FA8","agent_name":"陳德","guest":"張小龍","in_time":"2014-08-07 14:20:00" ,"out_time":"2014-08-07 19:40:00","in_capital": "250現+40M+10M（道具）", "out_capital": "贖 40M+ 贖10M（道具）+存 300現", "loss_win_amount":"20", "rolling_amount":"60","created":"2014-08-25","brokerage":"蔡晓洁","status":"已離場","remark":""},

            {"id":3, "hall":"永利鉅星", "scene_summary_id":"2", "agent_code":"FA408","agent_name":"吳清","guest":"李子華" ,"in_time":"2014-08-07 11:20:00" ,"out_time":"2014-08-07 17:30:00","in_capital": "20", "out_capital": "22", "loss_win_amount":"2", "rolling_amount":"500", "created":"2014-08-25","brokerage":"郭美義","status":"已離場","remark":""}

//            {"id":4, "hall":"永利鉅星", "scene_summary_id":"3", "agent_code":"D56","agent_name":"陳德","guest":"黃日彬" ,"in_time":"2014-08-07 11:20:00" ,"out_time":"2014-08-07 17:30:00","in_capital": "10", "out_capital": "7", "loss_win_amount":"-3", "rolling_amount":"50", "created":"2014-08-12","brokerage":"Jake","status":"離場","remark":""}
//            {"id":5, "hall":"永利鉅星", "scene_summary_id":"4", "agent_code":"H11","agent_name":"陳德","guest":"黃日彬","in_time":"2014-08-07 12:30:00" ,"out_time":"2014-08-07 14:55:00","in_capital": "45", "out_capital": "60", "loss_win_amount":"15", "rolling_amount":"30","created":"2014-08-12","brokerage":"李華成","status":"離場","remark":""}

        ]
    }).service('guests',function($resource){
        return [
            {"agent_code":"FA233","hall":"永利钜星","agent_name":"李達文","time":"2014-06-05 14:05:13","status":"已在場"},
            {"agent_code":"FV8","hall":"永利钜星","agent_name":"王易","time":"2014-06-05 14:05:13","status":"已開場"},
            {"agent_code":"FA302","hall":"永利钜星","agent_name":"陳紅","time":"2014-06-05 14:05:13","status":"已開場"},
            {"agent_code":"FV326","hall":"永利钜星","agent_name":"林海","time":"2014-06-05 14:05:13","status":"已開場"},
            {"agent_code":"FV412","hall":"永利钜星","agent_name":"吳為","time":"2014-06-05 14:05:13","status":"已開場"}
        ]

    }).service('screeings',function($resource){
        return [
            {"guest_name":"陳明","field_no":"T0001","desk_no":"D0001","agent_code":"FV8","in_capital":"250","out_capital":"","loss_win_amount":"50","rolling":"600","payback_marker":"","payback_limit_marker":"","payback_prop_marker":"","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"2014-8-20 14:08:20","out_time":"","status":"已開場","remark":"",
                capitals:[
                    {"in_capital":"250","mark_amount":"","mark_type":"","capital_type":"現金","type":"現"},
                    {"in_capital":"50","mark_amount":"10","mark_type":"道具","capital_type":"貸款","type":"M"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"250","out_capital":"200","loss_win_amount":"50","brokage":"麥文"}
                ]
            },
            {"guest_name":"李洪","field_no":"T0002","desk_no":"D0002","agent_code":"FV8","in_capital":"100","out_capital":"","loss_win_amount":"20","rolling":"600","payback_marker":"","payback_limit_marker":"","payback_prop_marker":"","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"2014-8-20 14:10:34","out_time":"","status":"已開場","remark":"",
                capitals:[
                    {"in_capital":"100","mark_amount":"10","mark_type":"昇紅","capital_type":"貸款","type":"M"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ]
            }
//            {"guest":"王易","field_no":"T0002","desk_no":"D0002","agent_code":"FV8","in_capital":"150","out_capital":"100","loss_win_amount":"50","rolling":"900","payback_marker":"100","payback_limit_marker":"50","payback_prop_marker":"0","get_cash":"20","deposit_marker":"0","deposit_cash":"10","in_time":"2014-06-05 14:05:13","out_time":"2014-06-05 14:05:13","status":"開場","remark":"",
//                capitals:[
//                    {"in_capital":"40","capital_type":"貸款"},
//                    {"in_capital":"10","capital_type":"貸款"},
//                    {"in_capital":"10","capital_type":"貸款"}
//                ],
//                scene_record_shift:[
//                    {"shift":"中更","in_capital":"200","out_capital":"80","loss_win_amount":"120","brokage":"麥文"}
//                ]
//            },
//            {"guest":"陳達文","field_no":"T0003","desk_no":"D0001","agent_code":"FA233","in_capital":"100","out_capital":"120","loss_win_amount":"20","rolling":"900","payback_marker":"100","payback_limit_marker":"0","payback_prop_marker":"0","get_cash":"20","deposit_marker":"0","deposit_cash":"0","in_time":"2014-06-05 14:05:13","out_time":"2014-06-05 14:05:13","status":"開場","remark":"",
//                capitals:[
//                    {"in_capital":"80","capital_type":"貸款"},
//                    {"in_capital":"20","capital_type":"貸款"}
//                ],
//                scene_record_shift:[
//                    {"shift":"中更","in_capital":"250","out_capital":"150","loss_win_amount":"100","brokage":"麥文"}
//                ]
//            },
//            {"guest":"王易","field_no":"T0004","desk_no":"D0002","agent_code":"FA233","in_capital":"150","out_capital":"100","loss_win_amount":"50","rolling":"900","payback_marker":"100","payback_limit_marker":"50","payback_prop_marker":"0","get_cash":"20","deposit_marker":"0","deposit_cash":"10","in_time":"2014-06-05 14:05:13","out_time":"2014-06-05 14:05:13","status":"開場","remark":"",
//                capitals:[
//                    {"in_capital":"40","capital_type":"貸款"}
//                ],
//                scene_record_shift:[
//                    {"shift":"中更","in_capital":"200","out_capital":"80","loss_win_amount":"120","brokage":"麥文"}
//                ]
//            }

        ]

    }).service('screeings_list',function($resource){
        return [
            {"agent_name":"王易","guest_name":"陳明","field_no":"T0001","desk_no":"D0001","agent_code":"FV8","in_capital":"300","out_capital":"350","loss_win_amount":"50","rolling":"600","payback_marker":"40","payback_limit_marker":"","payback_prop_marker":"10","get_cash":"","deposit_marker":"","deposit_cash":"300","in_time":"14:08:20","out_time":"16:16:18","status":"已離場","remark":"",
                show_in_capital:"250現+40M+10M（道具）",
                show_out_capital:"贖 40M+ 贖10M（道具）+存 300現",
                capitals:[
                    {"in_capital":"250","mark_amount":"","mark_type":"","capital_type":"現金","type":"現"},
                    {"in_capital":"50","mark_amount":"10","mark_type":"道具","capital_type":"貸款","type":"M"}

                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"250","out_capital":"200","loss_win_amount":"50","brokage":"麥文"}
                ]
            },
            {"agent_name":"王易","guest_name":"李洪","field_no":"T0002","desk_no":"D0002","agent_code":"FV8","in_capital":"100","out_capital":"80","loss_win_amount":"-20","rolling":"600","payback_marker":"70","payback_limit_marker":"10","payback_prop_marker":"","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"14:10:34","out_time":"16:25:30","status":"已離場","remark":"",
                show_in_capital:"90M+10（升紅）",
                show_out_capital:"贖 70M+ 贖10M（升紅）",
                capitals:[
                    {"in_capital":"100","mark_amount":"10","mark_type":"升紅","capital_type":"貸款","type":"M"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ]
            },
            {"agent_name":"李達文","guest_name":"何發","field_no":"T0003","desk_no":"D0002","agent_code":"FA233","in_capital":"50","out_capital":"63","loss_win_amount":"13","rolling":"600","payback_marker":"","payback_limit_marker":"","payback_prop_marker":"","get_cash":"63","deposit_marker":"","deposit_cash":"","in_time":"14:10:34","out_time":"15:39:45","status":"已離場","remark":"",
                show_in_capital:"50現",
                show_out_capital:"提現63",
                capitals:[
                    {"in_capital":"50","mark_amount":"","mark_type":"升紅","capital_type":"現金","type":"現"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ]
            },
            {"agent_name":"李達文","guest_name":"羅海","field_no":"T0004","desk_no":"D0002","agent_code":"FA233","in_capital":"100","out_capital":"","loss_win_amount":"","rolling":"600","payback_marker":"","payback_limit_marker":"","payback_prop_marker":"","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"14:10:34","out_time":"16:08:18","status":"已開場","remark":"",
                show_in_capital:"80M+20M（道具）",
                show_out_capital:"",
                capitals:[
                    {"in_capital":"100","mark_amount":"20","mark_type":"道具","capital_type":"貸款","type":"M"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ]
            },
            {"agent_name":"李強","guest_name":"陳山","field_no":"T0005","desk_no":"D0002","agent_code":"FA408","in_capital":"100","out_capital":"80","loss_win_amount":"-20","rolling":"600","payback_marker":"80","payback_limit_marker":"","payback_prop_marker":"","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"14:10:34","out_time":"16:36:48","status":"已離場","remark":"",
                show_in_capital:"100M",
                show_out_capital:"贖 80M",
                capitals:[
                    {"in_capital":"100","mark_amount":"","mark_type":"","capital_type":"貸款","type":"M"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ]
            },
            {"agent_name":"陳紅","guest_name":"劉大海","field_no":"T0006","desk_no":"D0002","agent_code":"FA302","in_capital":"100","out_capital":"138","loss_win_amount":"38","rolling":"600","payback_marker":"60","payback_limit_marker":"40","payback_prop_marker":"","get_cash":"38","deposit_marker":"","deposit_cash":"","in_time":"14:10:34","out_time":"16:45:32","status":"已離場","remark":"",
                show_in_capital:"60M+40M（升紅）",
                show_out_capital:"贖 60M+ 贖40M（升紅）+提 38現",
                capitals:[
                    {"in_capital":"60","mark_amount":"40","mark_type":"升紅","capital_type":"貸款","type":"M"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ]
            },
            {"agent_name":"林海","guest_name":"張宇","field_no":"T0007","desk_no":"D0002","agent_code":"FA326","in_capital":"100","out_capital":"75","loss_win_amount":"-25","rolling":"600","payback_marker":"75","payback_limit_marker":"","payback_prop_marker":"","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"14:10:34","out_time":"16:59:33","status":"已離場","remark":"",
                show_in_capital:"100M",
                show_out_capital:"贖 75M",
                capitals:[
                    {"in_capital":"100","mark_amount":"","mark_type":"","capital_type":"貸款","type":"M"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ]
            },
            {"agent_name":"吳為","guest_name":"李彬","field_no":"T0008","desk_no":"D0002","agent_code":"FA412","in_capital":"150","out_capital":"130","loss_win_amount":"-20","rolling":"600","payback_marker":"80","payback_limit_marker":"","payback_prop_marker":"50","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"14:10:34","out_time":"17:02:33","status":"已離場","remark":"",
                show_in_capital:"100M+50M（道具）",
                show_out_capital:"贖 80M+ 贖50M（道具）",
                capitals:[
                    {"in_capital":"150","mark_amount":"50","mark_type":"道具","capital_type":"貸款","type":"M"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ]
            },
            {"agent_name":"李想","guest_name":"何東","field_no":"T0009","desk_no":"D0002","agent_code":"FA235","in_capital":"","out_capital":"","loss_win_amount":"","rolling":"600","payback_marker":"","payback_limit_marker":"","payback_prop_marker":"","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"16:27:18","out_time":"","status":"已開場","remark":"",
                show_in_capital:"",
                show_out_capital:"",
                capitals:[
                    {"in_capital":"100","mark_amount":"10","mark_type":"升紅","capital_type":"貸款","type":"M"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ]
            },
            {"agent_name":"陳方","guest_name":"方麗","field_no":"T0010","desk_no":"D0002","agent_code":"FA103","in_capital":"","out_capital":"","loss_win_amount":"","rolling":"600","payback_marker":"","payback_limit_marker":"","payback_prop_marker":"","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"17:05:21","out_time":"","status":"已開場","remark":"",
                show_in_capital:"",
                show_out_capital:"",
                capitals:[
                    {"in_capital":"100","mark_amount":"10","mark_type":"升紅","capital_type":"貸款","type":"M"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ]
            }

        ]

    }).service('availables',function($resource){
        return [
            {"agent_code":"FA233","agent_name":"李達文","guest_name":"","capital":"200","type":"現金","time":"2014-8-20 14:05:13","in_capital":"0","out_capital":"200","rolling_type":"開場本金","field_no":"","brokage":"張三"},
            {"agent_code":"FA233","agent_name":"李達文","guest_name":"","capital":"100","type":"貸款","time":"2014-8-20 14:40:13","in_capital":"0","out_capital":"100","rolling_type":"開場本金","field_no":"","brokage":"張三"},
            {"agent_code":"FV8","agent_name":"王易","guest_name":"陳明","capital":"50","type":"貸款","time":"2014-06-03 14:05:13","in_capital":"0","out_capital":"50","rolling_type":"中場加彩","field_no":"T0001","brokage":"麥文"},
            {"agent_code":"FV8","agent_name":"王易","guest_name":"李洪","capital":"100","type":"貸款","time":"2014-06-03 14:05:13","in_capital":"0","out_capital":"100","rolling_type":"中場加彩","field_no":"T0002","brokage":"麥文"}
        ]

    }).service('screeings_lists',function($resource) {
        return [
            {"agent_name":"李達文","guest": "陳明", "field_no": "T0001", "desk_no": "D0001", "agent_code": "FA233", "in_capital": "250", "out_capital": "300", "loss_win_amount": "50", "rolling": "600", "payback_marker": "250", "payback_limit_marker": "0", "payback_prop_marker": "0", "get_cash": "50", "deposit_marker": "0", "deposit_cash": "0", "in_time": "2014-8-20 14:08:20", "out_time": "2014-8-20 16:16:18", "status": "已離場", "remark": "",
                capitals: [
                    {"in_capital": "250", "capital_type": "現金"}
                ],
                scene_record_shift: [
                    {"shift": "中更", "in_capital": "250", "out_capital": "200", "loss_win_amount": "50", "brokage": "麥文"}
                ]
            },
            {"agent_name":"李達文","guest": "李洪", "field_no": "T0002", "desk_no": "D0002", "agent_code": "FA233", "in_capital": "100", "out_capital": "", "loss_win_amount": "20", "rolling": "600", "payback_marker": "30", "payback_limit_marker": "0", "payback_prop_marker": "0", "get_cash": "50", "deposit_marker": "0", "deposit_cash": "0", "in_time": "2014-8-20 14:10:34", "out_time": "", "status": "已開場", "remark": "",
                capitals: [
                    {"in_capital": "100", "capital_type": "貸款"}
                ],
                scene_record_shift: [
                    {"shift": "中更", "in_capital": "100", "out_capital": "80", "loss_win_amount": "-20", "brokage": "麥文"}
                ]
            },
            {"agent_name":"吳清","guest": "何發", "field_no": "T0003", "desk_no": "D0003", "agent_code": "FA8", "in_capital": "100", "out_capital": "85", "loss_win_amount": "20", "rolling": "600", "payback_marker": "30", "payback_limit_marker": "0", "payback_prop_marker": "0", "get_cash": "50", "deposit_marker": "0", "deposit_cash": "0", "in_time": "2014-8-20 14:10:34", "out_time": "2014-8-20 17:08:12", "status": "已離場", "remark": "",
                capitals: [
                    {"in_capital": "50", "capital_type": "貸款"}
                ],
                scene_record_shift: [
                    {"shift": "中更", "in_capital": "100", "out_capital": "80", "loss_win_amount": "-20", "brokage": "麥文"}
                ]
            },
            {"agent_name":"吳清","guest": "羅海", "field_no": "T0004", "desk_no": "D0004", "agent_code": "FA8", "in_capital": "100", "out_capital": "120", "loss_win_amount": "20", "rolling": "600", "payback_marker": "30", "payback_limit_marker": "0", "payback_prop_marker": "0", "get_cash": "50", "deposit_marker": "0", "deposit_cash": "0", "in_time": "2014-8-20 14:10:34", "out_time": "2014-8-20 17:08:12", "status": "已離場", "remark": "",
                capitals: [
                    {"in_capital": "20", "capital_type": "貸款"},
                    {"in_capital": "80", "capital_type": "貸款"}
                ],
                scene_record_shift: [
                    {"shift": "中更", "in_capital": "100", "out_capital": "80", "loss_win_amount": "-20", "brokage": "麥文"}
                ]
            },
            {"agent_name":"李強","guest": "陳山", "field_no": "T0005", "desk_no": "D0005", "agent_code": "FA408", "in_capital": "100", "out_capital": "80", "loss_win_amount": "20", "rolling": "600", "payback_marker": "30", "payback_limit_marker": "0", "payback_prop_marker": "0", "get_cash": "50", "deposit_marker": "0", "deposit_cash": "0", "in_time": "2014-8-20 14:10:34", "out_time": "2014-8-20 17:08:12", "status": "已離場", "remark": "",
                capitals: [
                    {"in_capital": "100", "capital_type": "貸款"}
                ],
                scene_record_shift: [
                    {"shift": "中更", "in_capital": "100", "out_capital": "80", "loss_win_amount": "-20", "brokage": "麥文"}
                ]
            }

        ]
    }).service('sceneRecordst',function($resource){
        return [
            {"agent_name":"李達文","guest_name":"羅海","time":"2014-08-25 14:05:13","field_no":"T0004","desk_no":"D0002","agent_code":"FA233","in_capital":"100","out_capital":"120","loss_win_amount":"","rolling":"600","payback_marker":"","payback_limit_marker":"","payback_prop_marker":"","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"14:10:34","out_time":"","status":"已開場","remark":"",
                show_in_capital:"80M+20M（道具）",
                show_out_capital:"",
                capitals:[
                    {"in_capital":"100","mark_amount":"20","mark_type":"道具","capital_type":"貸款","type":"M"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ],"operation_machine":"永利鉅星-4","brokage":"麥文"
            },
            {"agent_name":"李達文","guest_name":"羅海","time":"2014-08-25 14:05:13","field_no":"T0003","desk_no":"D0002","agent_code":"FA233","in_capital":"100","out_capital":"","loss_win_amount":"13","rolling":"600","payback_marker":"","payback_limit_marker":"","payback_prop_marker":"","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"14:10:34","out_time":"15:39:45","status":"已離場","remark":"",
                show_in_capital:"50現",
                show_out_capital:"提 63現",
                capitals:[
                    {"in_capital":"50","mark_amount":"","mark_type":"昇紅","capital_type":"現金","type":"現"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ],"operation_machine":"永利鉅星-4","brokage":"麥文"
            },


            {"agent_name":"王易","guest_name":"陳明","time":"2014-08-25 14:05:13","field_no":"T0001","desk_no":"D0001","agent_code":"FV8","in_capital":"300","out_capital":"350","loss_win_amount":"50","rolling":"600","payback_marker":"","payback_limit_marker":"","payback_prop_marker":"","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"14:08:20","out_time":"16:16:18","status":"已離場","remark":"",
                show_in_capital:"250現+40M+10M（道具）",
                show_out_capital:"贖 40M+ 贖10M（道具）+存 300現",
                capitals:[
                    {"in_capital":"250","mark_amount":"","mark_type":"","capital_type":"現金","type":"現"},
                    {"in_capital":"50","mark_amount":"10","mark_type":"道具","capital_type":"貸款","type":"M"}

                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"250","out_capital":"200","loss_win_amount":"50","brokage":"麥文"}
                ],"operation_machine":"永利鉅星-4","brokage":"麥文"
            },
            {"agent_name":"王易","guest_name":"李洪","time":"2014-08-25 14:03:14","field_no":"T0002","desk_no":"D0002","agent_code":"FV8","in_capital":"100","out_capital":"80","loss_win_amount":"-20","rolling":"600","payback_marker":"","payback_limit_marker":"","payback_prop_marker":"","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"14:10:34","out_time":"16:25:30","status":"已離場","remark":"",
                show_in_capital:"90M+10（昇紅）",
                show_out_capital:"贖 70M+ 贖10M（昇紅）",
                capitals:[
                    {"in_capital":"100","mark_amount":"10","mark_type":"昇紅","capital_type":"貸款","type":"M"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ],"operation_machine":"永利鉅星-4","brokage":"麥文"
            },

            {"agent_name":"李強","guest_name":"陳山","time":"2014-08-25 14:05:13","field_no":"T0005","desk_no":"D0002","agent_code":"FA408","in_capital":"100","out_capital":"80","loss_win_amount":"-20","rolling":"600","payback_marker":"","payback_limit_marker":"","payback_prop_marker":"","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"14:10:34","out_time":"16:36:48","status":"已離場","remark":"",
                show_in_capital:"100M",
                show_out_capital:"贖 80M",
                capitals:[
                    {"in_capital":"100","mark_amount":"","mark_type":"","capital_type":"貸款","type":"M"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ],"operation_machine":"永利鉅星-4","brokage":"麥文"
            },
            {"agent_name":"陳紅","guest_name":"劉大海","time":"2014-08-25 14:05:13","field_no":"T0006","desk_no":"D0002","agent_code":"FA302","in_capital":"100","out_capital":"138","loss_win_amount":"38","rolling":"600","payback_marker":"","payback_limit_marker":"","payback_prop_marker":"","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"14:10:34","out_time":"16:45:32","status":"已離場","remark":"",
                show_in_capital:"60M+40M（昇紅）",
                show_out_capital:"贖 60M+ 贖40M（升紅）+提 38現",
                capitals:[
                    {"in_capital":"60","mark_amount":"40","mark_type":"昇紅","capital_type":"貸款","type":"M"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ],"operation_machine":"永利鉅星-4","brokage":"麥文"
            },
            {"agent_name":"林海","guest_name":"張宇","time":"2014-08-25 14:05:13","field_no":"T0007","desk_no":"D0002","agent_code":"FA326","in_capital":"100","out_capital":"75","loss_win_amount":"-25","rolling":"600","payback_marker":"","payback_limit_marker":"","payback_prop_marker":"","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"14:10:34","out_time":"16:59:33","status":"已離場","remark":"",
                show_in_capital:"100M",
                show_out_capital:"贖 75M",
                capitals:[
                    {"in_capital":"100","mark_amount":"","mark_type":"","capital_type":"貸款","type":"M"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ],"operation_machine":"永利鉅星-4","brokage":"麥文"
            },
            {"agent_name":"吳為","guest_name":"李彬","time":"2014-08-25 14:05:13","field_no":"T0008","desk_no":"D0002","agent_code":"FA412","in_capital":"150","out_capital":"130","loss_win_amount":"-20","rolling":"600","payback_marker":"","payback_limit_marker":"","payback_prop_marker":"","get_cash":"","deposit_marker":"","deposit_cash":"","in_time":"14:10:34","out_time":"17:02:33","status":"已離場","remark":"",
                show_in_capital:"100M+50M（道具）",
                show_out_capital:"贖 80M+ 贖50M（道具）",
                capitals:[
                    {"in_capital":"150","mark_amount":"50","mark_type":"道具","capital_type":"貸款","type":"M"}
                ],
                scene_record_shift:[
                    {"shift":"中更","in_capital":"100","out_capital":"80","loss_win_amount":"-20","brokage":"麥文"}
                ],"operation_machine":"永利鉅星-4","brokage":"麥文"
            }



//            {"id":0, "status":"已離場", "full_name":"吳清", "agent_code":"FV8", "guest":"何發","agent_name":"王易","rolling_amount":"150","type":"貸款","in_time":"2014-08-21 11:20:00" ,"out_time":"2014-08-07 21:30:00","time":"2014-06-03 14:05:13","in_capital":"50","out_capital":"85","operation_machine":"永利鉅星-4","field_no":"T0003","brokage":"麥文","remark":""
//                ,"loss_win_amount":"35","payback_marker":"10", "payback_limit_marker":"90", "get_cash":"", "deposit_marker":"",  "deposit_cash":""},
//            {"id":1, "status":"已離場", "full_name":"吳清", "agent_code":"FV8", "guest":"羅海","agent_name":"陳達文","rolling_amount":"50","type":"貸款","in_time":"2014-08-21 11:20:00" ,"out_time":"2014-08-21 17:30:00","time":"2014-06-03 14:05:13","in_capital":"80+20","out_capital":"120","operation_machine":"永利鉅星-5","field_no":"T0004","brokage":"麥文","remark":""
//                ,"loss_win_amount":"20","payback_marker":"10", "payback_limit_marker":"90", "get_cash":"", "deposit_marker":"",  "deposit_cash":""
//            },
//
//            {"id":2, "status":"已離場", "full_name":"李達文", "agent_code":"FA233",  "guest":"陳明","agent_name":"王易","rolling_amount":"500","type":"貸款","in_time":"2014-08-20 14:08:20" ,"out_time":"2014-08-21 17:30:00","time":"2014-06-03 14:05:13","in_capital":"250","out_capital":"300","operation_machine":"永利鉅星-2","field_no":"T0001","brokage":"麥文","remark":""
//                ,"loss_win_amount":"50","payback_marker":"10", "payback_limit_marker":"90", "get_cash":"", "deposit_marker":"",  "deposit_cash":""
//            },
//            {"id":3, "status":"已開場", "full_name":"李達文", "agent_code":"FA233", "guest":"李洪","agent_name":"王易","rolling_amount":"100","type":"貸款","in_time":"2014-08-20 14:10:34" ,"out_time":"","time":"2014-06-03 14:05:13","in_capital":"100","out_capital":"","operation_machine":"永利鉅星-3","field_no":"T0002","brokage":"麥文","remark":""
//                ,"loss_win_amount":"","payback_marker":"10", "payback_limit_marker":"90", "get_cash":"", "deposit_marker":"",  "deposit_cash":""},
//
//
//            {"id":4, "status":"已離場", "full_name":"李強", "agent_code":"FA408", "guest":"陳山","agent_name":"陳達文","rolling_amount":"100","type":"貸款","in_time":"2014-08-21 11:20:00" ,"out_time":"2014-08-21 17:30:00","time":"2014-06-03 14:05:13","in_capital":"100","out_capital":"80","operation_machine":"永利鉅星-6","field_no":"T0005","brokage":"麥文","remark":""
//                ,"loss_win_amount":"-20","payback_marker":"10", "payback_limit_marker":"90", "get_cash":"", "deposit_marker":"",  "deposit_cash":""
//            },
//            {"id":5, "status":"已離場", "full_name":"王富", "agent_code":"D56", "guest":"陳大海","agent_name":"陳達文","rolling_amount":"200","type":"貸款","in_time":"2014-08-21 11:20:00" ,"out_time":"2014-08-21 17:30:00","time":"2014-06-03 14:05:13","in_capital":"150+50","out_capital":"50","operation_machine":"永利鉅星-7","field_no":"T0006","brokage":"麥文","remark":""
//                ,"loss_win_amount":"-150","payback_marker":"10", "payback_limit_marker":"90", "get_cash":"", "deposit_marker":"",  "deposit_cash":""
//            },
//
//            {"id":6, "status":"離場", "full_name":"李鑫", "agent_code":"H11", "guest":"吳麗","agent_name":"陳達文","rolling_amount":"200","type":"貸款","in_time":"2014-08-21 11:20:00" ,"out_time":"2014-08-21 17:30:00","time":"2014-06-03 14:05:13","in_capital":"60","out_capital":"80","operation_machine":"永利鉅星-8","field_no":"T0006","brokage":"麥文","remark":""
//                ,"loss_win_amount":"20","payback_marker":"10", "payback_limit_marker":"90", "get_cash":"", "deposit_marker":"",  "deposit_cash":""
//            },
//            {"id":7, "status":"離場", "full_name":"李鑫", "agent_code":"H11", "guest":"黎鴻","agent_name":"陳達文","rolling_amount":"200","type":"貸款","in_time":"2014-08-21 11:20:00" ,"out_time":"2014-08-21 17:30:00","time":"2014-06-03 14:05:13","in_capital":"120","out_capital":"100","operation_machine":"永利鉅星-9","field_no":"T0006","brokage":"麥文","remark":""
//                ,"loss_win_amount":"-20","payback_marker":"10", "payback_limit_marker":"90", "get_cash":"", "deposit_marker":"",  "deposit_cash":""
//            },
//            {"id":8, "status":"離場", "full_name":"楊貴", "agent_code":"D333", "guest":"王嘉欣","agent_name":"陳達文","rolling_amount":"200","type":"貸款","in_time":"2014-08-21 11:20:00" ,"out_time":"2014-08-21 17:30:00","time":"2014-06-03 14:05:13","in_capital":"300","out_capital":"346","operation_machine":"永利鉅星-10","field_no":"T0006","brokage":"麥文","remark":""
//                ,"loss_win_amount":"46","payback_marker":"10", "payback_limit_marker":"90", "get_cash":"", "deposit_marker":"",  "deposit_cash":""
//            },
//            {"id":9, "status":"離場", "full_name":"楊貴", "agent_code":"D333", "guest":"陳玲","agent_name":"陳達文","rolling_amount":"200","type":"貸款","in_time":"2014-08-21 11:20:00" ,"out_time":"2014-08-21 17:30:00","time":"2014-06-03 14:05:13","in_capital":"150","out_capital":"80","operation_machine":"永利鉅星-11","field_no":"T0006","brokage":"麥文","remark":""
//                ,"loss_win_amount":"-70","payback_marker":"10", "payback_limit_marker":"90", "get_cash":"", "deposit_marker":"",  "deposit_cash":""
//            }
        ]

    });
}).call(this);
