/**
 * Created by harry on 2014/7/8.
 */
(function() {
    'use strict';
    angular.module('app.cross-trans.json',['ngResource']).service('crossTrans',function($resource){

        return [
            {"id":"0","hall":"永利鉅星","shift":"早更","depositcard_balance":"562415.569","customers_balance":"232415.233","receive_hall":"永利多金","receive_agent_code":"FV88","receive_agent_name":"李磊","amount":"2500","send_hall":"新葡京鉅星","send_agent_code":"DV88","send_agent_name":"王易","date":"2014-08-11 15:35","created":"2014-08-11 15:35","updated":"2014-08-11 15:35","brokerage":"陳美華","confirmor":"","status":"待處理","remark":"急用"},
            {"id":"1","hall":"永利鉅星","shift":"早更","depositcard_balance":"462415.569","customers_balance":"232415.233","receive_hall":"永利多金","receive_agent_code":"FV89","receive_agent_name":"李磊","amount":"2500","send_hall":"新葡京鉅星","send_agent_code":"DV89","send_agent_name":"王易","date":"2014-08-11 15:35","created":"2014-08-11 15:35","updated":"2014-08-11 15:35","brokerage":"陳美華","confirmor":"麥文","status":"已確認","remark":"急用"},
            {"id":"2","hall":"永利鉅星","shift":"早更","depositcard_balance":"362415.569","customers_balance":"232415.233","receive_hall":"永利多金","receive_agent_code":"FV10","receive_agent_name":"李磊","amount":"2500","send_hall":"新葡京鉅星","send_agent_code":"DV10","send_agent_name":"王易","date":"2014-08-11 15:35","created":"2014-08-11 15:35","updated":"2014-08-11 15:35","brokerage":"陳美華","confirmor":"麥文","status":"已拒絕","remark":"急用"},
            {"id":"3","hall":"永利鉅星","shift":"早更","depositcard_balance":"262415.569","customers_balance":"132415.233","receive_hall":"永利多金","receive_agent_code":"FV11","receive_agent_name":"李磊","amount":"2500","send_hall":"新葡京鉅星","send_agent_code":"DV11","send_agent_name":"王易","date":"2014-08-11 15:35","created":"2014-08-11 15:35","updated":"2014-08-11 15:35","brokerage":"陳美華","confirmor":"","status":"待處理","remark":"急用"},
            {"id":"4","hall":"永利鉅星","shift":"早更","depositcard_balance":"162415.569","customers_balance":"32415.233","receive_hall":"永利多金","receive_agent_code":"FV12","receive_agent_name":"李磊","amount":"2500","send_hall":"新葡京鉅星","send_agent_code":"DV12","send_agent_name":"王易","date":"2014-08-11 15:35","created":"2014-08-11 15:35","updated":"2014-08-11 15:35","brokerage":"陳美華","confirmor":"麥文","status":"已拒絕","remark":"急用"},
            {"id":"5","hall":"永利鉅星","shift":"早更","depositcard_balance":"62415.569","customers_balance":"415.233","receive_hall":"永利多金","receive_agent_code":"FV13","receive_agent_name":"李磊","amount":"2500","send_hall":"新葡京鉅星","send_agent_code":"DV13","send_agent_name":"王易","date":"2014-08-11 15:35","created":"2014-08-11 15:35","updated":"2014-08-11 15:35","brokerage":"陳美華","confirmor":"麥文","status":"已確認","remark":"急用"},


        ]
    }).factory('agent_Lists',[
        '$resource',function($resource){
            return $resource('data/loan/agents.json', {}, {
                query: {method:'GET',isArray:true}
            });
        }
    ]);
}).call(this);