(function() {
    'use strict';
    angular.module('app.constants', []).constant('agentType',{
        shareholder:1,
        innerholder:2,
        normal:3,
        items:{
            1: '股東',
            2: "內股",
            3:"下線"
        }
    }).constant('settlementType',{
        shareholder:1,
        monthly:2,
        common:3,
        items:{
            1: '股東',
            2: "月結",
            3:"普通"
        }
    }).constant('contactType',{
        master:1,
        authorizer:2,
        assistant:3,
        items:{
            1: '戶主',
            2: "授權人",
            3:"助手"
            //4:"批核人"
        }
    }).constant('markerStatus',{
        unPay:1,
        partialPaid:2,
        Paid:3,
        payment:4,
        items:{
            1: "未還款",
            2: "部分還款",
            3: "已還款",
            4: "代付"
        }
    }).constant('markerFeeStatus',{
        unPay:1,
        partialPaid:2,
        Paid:3,
        items:{
            1: "未還款",
            2: "部分還款",
            3: "已還款"
        }
    }).constant('repaymentType',{
        partialPay:0,
        allPay:1,
        items:{
            0: "部分還款",
            1: "全部還款"
        }
    }).constant('repaymentMethod',{
        storingCard:1,
        cash:2,
        order:4,
        backM:5,
        cashRolling:7,
        items:{
            1: "存卡",
            2: "現金",
            4: "存M",
            5:"完場回",
            7:"現金碼"
        }
    }).constant('commissionRecordStatus',{
        commissionUnpay:1,
        commissionPaid:2,
        items:{
            1:"未出佣",
            2:"已出佣"
        }
    }).constant('preCommissionRecordStatus',{
        unsettlement:1,
        settlement:2,
        items:{
            1:"未月結",
            2:"已月結"
        }
    }).constant('CommissionMonthStatus',{
        calculating:1,
        unsettlement:2,
        settlement:3,
            items:{
            1:"計佣中",
            2:"未月結",
            3:"已月結"
        }
    }).constant('genders',{
        items:{
            0:"女",
            1:"男"
        }
    }).constant('idCardType',{
        items:{
            1:"身份證",
            2:"護照"
        }
    }).constant('CommissionCardBindStatus',{
        unbind:0,
        binded:1,
        items:{
            0:"未綁定",
            1:"已綁定"
        }
    }).constant('OrderPriority',{
        high:1,
        middle:2,
        low:3,
        items:{
            1:"高",
            2:"中",
            3:"低"
        }
    }).constant('sendSecret',{
        show:0,
        hidden:1,
        items:{
            0:"不隱藏",
            1:"隱藏"
        }
    }).constant('noticeTypes',{
        telephone:1,
        sms:2,
        all:3,
        items:{
            1:"短信",
            2:"電話",
            3:"全部"
        }
    }).constant('specialCodeTrans',{
        items:{
            INCREASE:"工作碼",
//            PROP:"道具",
            "":"普通貸款"
        }
    }).constant('depositCardTypes',{
        deposit:"DEPOSIT",
        draw :"DRAW",
        drawCash:"DRAWCASH",
        transfer:"TRANSFER",
        frozen:'FROZEN',
        thaw:'THAW',
        items:{
            "DEPOSIT":"存款",
            "DRAW":"開工",
            "DRAWCASH":"取款",
            "TRANSFER":"轉賬",
            "FROZEN":"凍結",
            "THAW":"解凍"
        }
    }).constant('depositCardRecordTypes',{
        deposit:"1",
        draw :"2",
        drawCash:"3",
        transferIn:"4",
        transferOut:"5",
        crossTransferIn:"6",
        crossTransferOut:"7",
        backM:"9",
        items:{
            "1":"存款",
            "2":"開工",
            "3":"取款",
            "4":"轉入",
            "5":"轉出",
            "6":"飛入",
            "7":"飛出",
            "8":"即出碼佣",
            "9":"回M",//回M入
            "10":"積分回收",//入
            "11":"回M",//回M出
            "12":"還款",//還款入
            "13":"還款",//還款出
            "14":"還息",//還息入
            "15":"還息",//還息出
            "16":"出佣",
            "17":"凍結",
            "18":"解凍"
        }
    }).constant('specialCodeTypesTrans',{
        items:{
            INCREASE:"工作碼",
//            WORKROLLING:"工作碼",
            PROP:"道具",
            "":"普通貸款"
        }
    }).constant('TicketManagerStatusTypes',{
        items:{
            1:"未取",
            2:"已取",
            3:"部分取款",
            4:"部分凍結",
            5:"全额凍結"
        }
    }).constant('rollingTypes',{
        openCapital:1,
        middleAddColor :2,
        middleRolling :3,
        items:{
            1:"開場本金",
            2:"中場加彩",
            3:"中場轉碼"
        }
    }).constant('rollingType',{
            openCapital:0,
            middleAddColor :1,
            middleRolling :2,
            items:{
                0:"即時轉碼",
                1:"轉碼轉移",
                2:"即出碼佣"
            }
        }).constant('depositTicketTypes',{
        marker:1,
        cash:2,
        items:{
            1:"存M",
            2:"存現",
            5:"存款"
        }
    }).constant('depositTypes',{
            partDrawcash:1,
            drawcash:2,
            partDraw:3,
            draw:4,
            frozen:6,
            thaw:7,
            items:{
                1:"部分取款",
                2:"全额取款",
                3:"部分開工",
                4:"全額開工",
                5:"存款",
                6:"凍結",
                7:"解凍"
            }
    })/*.constant('loanTypes',{
        items:{
            1:"貸款",
            2:"現金",
            3:"存卡",
            4:"存單",
            5:"升紅",
            6:"道具",
            7:"現金碼"
        }
    })*/.constant('fundSourceTypes',{
        1:"M",
        2 :"C",
        3 :"存C",
        4:"存M",
        5:"工作碼",
       // 6 :"M(道具)",
        7 : "現碼",
        8 : "泥碼",
        9 : "存現",
        items:{
            1:"貸款",
            2:"現金",
            3:"存卡",
            4:"存M",
            5:"工作碼",
            //6:"道具",
            7:"現金碼",
            8:"泥碼",
            9:"存現"
        },
        data: [
            {id:1,name:'貸款'},
            {id:2, name:'現金'},
            {id:3, name:'存卡'},
            {id:4, name:'存M'},
            {id:5, name:'工作碼'},
            {id:7, name:'現金碼'},
            {id:8, name:'泥碼'},
            {id:9, name:'存現'}
        ]
    }).constant('transTypes',{  //交易類型
        items:{
            1:"貸款",
            2:"還款"
        },data:[
                {id: '1', name:'貸款'},
                {id: '2', name:'還款'}
            ]
    })
    .constant('markerExpiredFeeTypes',{//首期手續費流水類型
            "還息":1,
            "減免" :2,
            items:{
                0:"還息",
                1:"減免"
            }
    }) .constant('adjustTypes',{//手續費調整類型
            "jian":1,
            "adjust" :2,
            items:{
                1:"減免",
                2:"調整"
            }
    }).constant('feeTypes',{
        repaymentExpiredFee:1,
        monthlyExpiredFee :2,
        mortagageExpiredFee :3,
        items:{
            1:"還款",
            2:"截息",
            3:"抵押"
        }
    }).constant('orderTypes',{
        agent:0,
        group :1,
        items:{
            0:"戶口",
            1:"戶組"
        }
    }).constant('agentSceneStatus',{
        sceneWaiting:1,
        sceneBegin :2,
        sceneOut :3,
        items:{
            1:"在場",
            2:"已開場",
            3:"離場"
        }
    }).constant('sceneStatus',{
            sceneOut :0,
            sceneBegin :1,
            items:{
                0:"離場",
                1:"已開場",
                2:"待入場"
            }
    }).constant('matchesStatus',{ //子場次場次狀態
        inScene:1,
        outScene :2,
        items:{
            1:"開場",
            2:"離場"
        }
    }).constant('SceneRecordShiftStatus',{ //子場次截更狀態
            inScene:1,
            outScene :0,
            items:{
                1:"開場",
                0:"離場"
            }
    }).constant('crossTransferStatus',{
        pending:"1",
        success:"2",
        reject:"3",
        cancel:"4",
        items:{
            1:"待處理",
            2:"接受",
            3:"拒絕",
            4:"取消"
        }
    }).constant('crossTransferTypes',{//飛數類型
            dispose:"0",
            request:"1",
            returnM:"2",
            items:{
                0:"飛數",
                1:"請求飛數",
                2:"抵押回M"
            }
    }).constant('mortgageTypes',{ //抵押類型
        outside:"0",
        inside:"1",
        items:{
            0:"外線抵押",
            1:"本線抵押"
        }
    }).constant('mortgageMethods',{ //抵押方式
            items:{
                0:"部分抵押",
                1:"全部抵押"
            }
    }).constant('operationTypes',{
        add:"1",
        edit:"2",
        del:"3",
        items:{
            1:"新增",
            2:"修改",
            3:"刪除"
        }
    }).constant('bookingState', {
        no_settled : '0',
        Settled : '1',
        items : {
            0 : '未結算',
            1 : '已結算'
        }
    }).constant('flightType', {
        oneWay : '1',
        twoWay : '2',
        items : {
            1 : '單程',
            2 : '雙程'
        }
    }).constant('dayType', {
            normal : '1',
            weekend : '2',
            special : '3',
            items : {
                1 : '平日',
                2 : '週末',
                3 : '特別日子'
        }
    }).constant('tableStatus', {
        normal : 0,
        weekend : 2,
        items : {
            0 : '閒置',
            1 : '已開檯'
        }
    }).constant('tableLayerStatus', {
            normal : 1,
            weekend : 2,
            items : {
                1 : '第一層',
                2 : '第二層'
            }
    }).constant('shiftMarks', {
            morning : '早更',
            afternoon : '中更',
            evening:'晚更',
            items : {
                morning : '早更',
                afternoon : '中更',
                evening:'晚更'
            },data: [
                {"name" : "早更"},
                {"name" : "中更"},
                {"name" : "晚更"}]

        }).constant('departmentType', {
        treasury : 'TREASURY_DEPT',//賬房部
        account : 'ACCOUNT_DEPT_A',//會計部A
        scene : 'SCENE_DEPT',//場面部
        service : 'SERVICE_DEPT',//服務部
        accountB: 'ACCOUNT_DEPT_B',//會計部B
        guestService:'GUEST_SERVICE_DEPT',//客戶服務部
        it:'IT_DEPT',//資訊科技部
        market:'MARKET_DEPT',//市場拓展部
        businessDev:'BUSINESS_DEV_DEPT',//業務發展部
        Credit:'CREDIT_DEPT',//信貸部
        financial:'FINANCIAL',//財務
        analysts:'ANALYSTS',//數據分析員
        overseasDev:'OVERSEAS_DEV_DEPT',//海外發展部
        optimusInterNational:'OPTIMUS_INTERNATIONAL_DEPT',//獅帆國際
        items : {
            'TREASURY_DEPT' : '賬房部',
            'ACCOUNT_DEPT_A' : '會計部',
            'SCENE_DEPT':'場面部',
            'SERVICE_DEPT':'服務部',
            'ACCOUNT_DEPT_B':'會計部B',
            'GUEST_SERVICE_DEPT':'客戶服務部',
            'IT_DEPT':'資訊科技部',
            'MARKET_DEPT':'市場拓展部',
            'BUSINESS_DEV_DEPT':'業務發展部',
            'CREDIT_DEPT':'信貸部',
            'FINANCIAL':'財務',
            'ANALYSTS':'數據分析員',
            'OVERSEAS_DEV_DEPT':'海外發展部',
            'OPTIMUS_INTERNATIONAL_DEPT':'獅帆國際'
        }
    }).constant('hotelTravelType', {
        hotel : 1,
        travel : 2,
        items : {
            1 : '酒店',
            2 : '旅行社'
        }
    }).constant('departmentTrans', {
            ACCOUNT : 0,
            SCENE : 1,
            items : {
                0 : '賬房',
                1 : '場面'
            }
    }).constant('tableLayerXY', {
        X : 6,
        Y : 6
    }).constant('DeskLayers', {
        items:{
            LAYER1:'區域1',
            LAYER2:'區域2'
        }
    }).constant('integralTypeExpire', {
        items:{
            "3": '3個月',
            "6": '6個月',
            "9": '9個月',
            "-1": '永久'
        }
    }).constant('integralTypeStatus', {
        items:{
            "1": '激活',
            "0": '禁用'
        }
    }).constant('smsDepartments', {
            items:{
                "1": '賬房部',
                "2": '會計部',
                "3": '場面部',
                "4": '服務部'
            },
            data:[
                {id:"1", name:"賬房部"},
                {id:"2", name:"會計部"},
                {id:"3", name:"場面部"},
                {id:"4", name:"服務部"}
            ]
        }).constant('phraseType', {
            hotel : 1,
            food : 2,
            helicopter : 3,
            ship : 4,
            air : 5,
            car : 6,
            ticket :7,
            other : 8,
            consumption_other_content : 9,
            car_trip : 10,
            scene : 11,
            loan: 12,
            birthday: 13,
            bishu_in:14,
            bishu_out:15,
            items : {
                "1" : '酒店',
                "2" : '食飛',
                "3" : '直升機',
                "4" : '船票',
                "5" : '機票',
                "6" : '租車',
                "7" : '門票',
                "8" : '雜項',
                "9" : '消費內容', //杂项里,
                "10" : '行程', //租车里的
                "11" : '場面',
                "12" : "貸款",  //貸款還款裡的
                "13" : "生日短信",
                '14':"B數開場",
                '15':"B數離場",
            }
    }).constant('commissionType', {
            share : 1,
            cash : 2,
            M: 3,
            company : 4,
            items : {
                "1" : '股本佣',
                "2" : '現金佣',
                "3" : 'M佣',
                "4" : '公司佣'
            }
    }).constant('sendSmsStatus', {
            sending : 1,
            sending_n : 2,
            sending_y : 3,
            sent : 4,
            items : {
                "1" : '發送中',
                "2" : '發送失敗',
                "3" : '發送成功',
                "4" : '已投遞'
            }
     }).constant('printerType',{
            stylusPrinter:"stylus_printer", //針式打印機
            thermalPrinter:"thermal_printer",  //熱敏式打印機
            laserPrinter:"laser_printer", //激光打印機
            items : {//應客戶要求，按業務區分打印機
                "thermal_printer" : '小票打印機',
                "stylus_printer" : '票據打印機',
                "laser_printer" : '印表打印機'
            }
     }).constant('sendSmsType', {
            items : {
                "11":"新增貸款",
                "12":"貸款還款",
                "13":"貸款追收",
                "21":"存卡存款",
                "22":"存卡取款",
                "23":"存卡開工",
                "24":"存卡轉賬",
                "31":"存單存款",
                "32":"部分取款",
                "33":"全額取款",
                "34":"部分開工",
                "35":"全額開工",
                "41":"積分提醒",
                "42":"新增消費",
                "51":"場面開場",
                "52":"場面加彩",
                "53":"場面離場",
                "61":"新開戶口",
                "91":"修改戶口",
                "62":"新增授權",
                "63":"修改授權",
                "64":"取消授權",
                "71":"轉碼日結",
                "81":"其他",
                "92":"生日短信",
                "101":"分成開場",
                "102":"分成離場",
                "103":"分成加彩"

            },
            data : [
                {id:"11", name:"新增貸款"},
                {id:"12", name:"貸款還款"},
                {id:"13", name:"貸款追收"},
                {id:"21", name:"存卡存款"},
                {id:"22", name:"存卡取款"},
                {id:"23", name:"存卡開工"},
                {id:"24", name:"存卡轉賬"},
                {id:"31", name:"存單存款"},
                {id:"32", name:"部分取款"},
                {id:"33", name:"全額取款"},
                {id:"34", name:"部分開工"},
                {id:"35", name:"全額開工"},
                {id:"41", name:"積分提醒"},
                {id:"42", name:"新增消費"},
                {id:"51", name:"場面開場"},
                {id:"52", name:"場面加彩"},
                {id:"53", name:"場面離場"},
                {id:"61", name:"新開戶口"},
                {id:"62", name:"新增授權"},
                {id:"63", name:"修改授權"},
                {id:"64", name:"取消授權"},
                {id:"91", name:"修改戶口"},
                {id:"71", name:"轉碼日結"},
                {id:"92", name:"生日短信"},
                {id:"81", name:"其他"},
                {id:"101", name:"分成開場"},
                {id:"102", name:"分成離場"},
                {id:"103", name:"分成加彩"}


            ]

        })
        .constant("chipsType",{
            items: {
                "1": "A籌碼",
                "2": "B籌碼"
            },
            data:[
                {id:"1",name:"A籌碼"},
                {id:"2",name:"B籌碼"}
            ]
        })
        .constant("sceneSmsTypes",{
            items: {
                "1": "私營",
                "2": "電投",
                "3": "現場",
                "4": "其它"
            },
            data:[
                {id:"1",name:"私營"},
                {id:"2",name:"電投"},
                {id:"2",name:"現場"},
                {id:"2",name:"其它"}
            ]
        }).constant("confirmStatus",{
            confirm : 1,
            confirm_n : 2,
            items: {
                "1": "已確認",
                "2": "未確認"
            }
        })

}).call(this);
