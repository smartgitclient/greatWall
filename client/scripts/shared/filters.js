(function() {
    'use strict';
    angular.module('app.filters', []).filter('parseDollar',['currencyFilter',function(currencyFilter){
        return function(amount,format,minus,prefix){
            if(angular.isUndefined(prefix))
                prefix  = '';
            if(amount == '')
                prefix = '';
            if(minus == true && amount != 0 && amount != '')
                prefix+='-';
            var cur =  currencyFilter( parseFloat((amount*10000).toFixed(2)),'').replace('.00','');
            if(_.str.include(cur,'(')){
                cur = '-'+_.trim(cur,'()');
                if(_.str.include(cur,'.'))
                    cur = _.rtrim(_.trim(cur,'0'),'.');
            }
            if(format)
                return prefix+cur;
            else
                return parseInt(amount*10000);
        }
    }])
        //.filter('trunRollingTime', function () {
        //    return function(date_obj){
        //        if(date_obj) {
        //            return date_obj.substring(0,16);
        //        }else{
        //            return '';
        //        }
        //    }
        //})
        .filter('parseTenThousand',['currencyFilter',function(currencyFilter){//加萬單位
        return function(amount,minus,prefix,num){
               if(angular.isUndefined(prefix))
                    prefix = ''
               if(angular.isUndefined(num))
                    num = 4;
                if(_.startsWith(amount,'.')){
                    amount = '0'+amount;
                }
               var cur = currencyFilter(_.toNumber(amount,num),'',num);
               if(_.str.include(cur,'.')){
                   cur = _.rtrim( _.rtrim(_.trim(cur,'()'),'0'),'.');
               }
               if(minus === true || (_.toNumber(amount,num) < 0 && minus !== ''))
                   prefix+='-';
               if(cur != 0 && cur != '')
                    return prefix + cur +' 萬';
               else
                    return prefix + '0 萬';
        }
    }]).filter('parseTenThousand2',['parseTenThousandFilter',function(parseTenThousandFilter){ //去萬
            return function(amount,minus,prefix,num){
               return  _.rtrim(parseTenThousandFilter(amount,minus,prefix,num),' 萬');
            }
        }]).filter('integerCurrency',['currencyFilter',function(currencyFilter){
        return function(amount){
            return currencyFilter(amount).replace('.00','');
        }
    }]).filter('parseDate',['dateFilter','strToTime',function(dateFilter,strToTime){
        return function(str,format){
            if(angular.isUndefined(str) || str == null || str == '')
                return "";
            if(angular.isUndefined(format))
                format = 'yyyy-MM-dd'
            var date = str.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/);
            if(date.length > 0)
                return dateFilter(strToTime(str),format);
            else
                return str;
        }

    }]).filter('getDate',['$filter',function($filter){
        return function(date_obj){
            if( date_obj) {
                return date_obj.replace(" 00:00:00","");
            }else{
                return '';
            }
        }
    }]).filter('getDate1',['$filter',function($filter){
        return function(date_obj){
            if(date_obj) {
                return date_obj.substring(0,16);
            }else{
                return '';
            }
        }
    }]).filter('plusMinus',['$filter',function($filter){
        return function(num){
            if(num > 0) {
                return num;
            }else{
                return num.substr(1);
            }
        }
    }]).filter('gender',["genders",function(genders){
        return function(gender,minus){
            return genders.items[gender];
        }
    }]).filter('call',function(){
        return function(calls){
            var call_number = '';
            angular.forEach(calls,function(call){
                call_number += call.agentContactTel.area_code +' '+ call.agentContactTel.telephone_number +'<br/>';
            });
            return call_number;
        }
    }).filter('phone',function(){
        return function(phones){
            var phone_number = '';
            if(phones.length > 0){
                angular.forEach(phones,function(phone){
                    if(phone){
                        phone_number += phone.agentContactTel.area_code +'&nbsp;'+ phone.agentContactTel.telephone_number +'<br/>';
                    }
                });
            }
            return phone_number;
        }
    }).filter('contactPhone',function(){
        return function(phones){
            var phone_number = '';
            angular.forEach(phones,function(phone){
                if(phone.area_code == null){
                    phone.area_code = '';
                }
                if(phone.telephone_number == null){
                    phone.telephone_number = '';
                }
                phone_number += phone.area_code +'&nbsp;'+ phone.telephone_number +'<br/>';
            });
            return phone_number;
        }
    }).filter('tell',function(){
        return function(tells){
            var tell_number = '';
                angular.forEach(tells,function(tell){
                    if(tell.agentContactTel) {
                        tell_number += tell.agentContactTel.area_code + '&nbsp;' + tell.agentContactTel.telephone_number + '<br/>';
                    }
                });
            return tell_number;
        }
    }).filter('remark',function() {
        return function (remark) {
            return remark;
        }
    }).filter('content',function() {
            return function (content) {
                if(content.length > 15){
                    return content.substr(0,15)+"...";
                }else{
                    return content;
                }
            }
    }).filter('nl2br', function($sce){
        return function(msg,is_xhtml) {
            var is_xhtml = is_xhtml || true;
            var breakTag = (is_xhtml) ? '<br />' : '<br>';
            var msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
            if(msg == 'null')
                return '';
            return $sce.trustAsHtml(msg);
        }
    }).filter('parseTenThousandToYuan', ['currencyFilter',function(currencyFilter){
        return function(amount, num,allow_null){
            if(angular.isUndefined(num))
                num = 6;
            if(_.isNaN(Number(amount))){
                return amount;
            }
            if(allow_null === true && amount === '')
                return '';
            return Number(amount) ? (Number(amount)*10000).toFixed(2).replace('.00','') : 0;
        }
    }]).filter('parseYuanToTenThousand', ['currencyFilter',function(currencyFilter){
        return function(amount, num,allow_null){
            if(angular.isUndefined(num))
                num = 6;
            if(_.isNaN(Number(amount))){
                return amount;
            }
            if(allow_null === true && amount === '')
                return '';
            return Number(amount) ? Number(amount)/10000 : 0;
        }
    }]).filter('parseYuan', ['currencyFilter', '$filter',  function(currencyFilter, $filter){
        return function(amount, num,allow_null){
            if(_.isNaN(Number(amount))){
                return amount;
            }
            num = num ? num : 2;
            if(allow_null === true && amount === '')
                return '';
            //return Number(amount) ?   _.numberFormat(Number(amount)) : 0;
            return Number(amount) ? Number(Number(amount).toFixed(10)) : 0;
        }
    }]).filter('propsFilter', function() {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function(item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    }).filter('omitCommission', ['currencyFilter', '$filter',  function( currencyFilter,$filter){
            return function(omit_ommission){
                var omit_ommissions = '';
                var omits =Number(parseFloat((omit_ommission*10000).toFixed(2).replace('.00','')));
                if(omits > 0)
                {
                    /*var _omits=omits.split('.');
                    if(_omits[1]){
                        omit_ommissions = _omits[0].charAt(_omits[0].length-1)+"."+_omits[1];
                    }else{
                        omit_ommissions = _omits[0].charAt(_omits[0].length-1);
                    }
                    return  omit_ommissions;*/
                    return Number((omits - Math.floor((omits / 10)) * 10).toFixed(2));
                }
                else if(omits < 0)
                {
                    return Number((omits - Math.floor((omits / 10)) * 10).toFixed(2));
                }
                else
                {
                    return omits||0;
                }
            }
        }]).filter('actualCommission', ['currencyFilter', '$filter',  function( currencyFilter,$filter){
            return function(actual_commission){
                //var actual_commissions = '';
                var actuals =Number(parseFloat((actual_commission*10000).toFixed(2).replace('.00','')));
                if(actuals > 0)
                {
                    //var _actuals = actuals.split('.');
                    return Math.floor((actuals / 10)) * 10;
                }
                else if(actuals < 0)
                {
                    return Math.floor((actuals / 10)) * 10;
                }
                else
                {
                    return actuals||0;
                }

            }
        }]).filter('parseFloatWind',[function(){
            return function(val){
                var num =  parseFloat(val);
                return num.toString().substr(1);
            };
        }]).filter('parseFloatKing',[function(){
        return function(val){
            return  val?parseFloat(val) + "":"";
        };
    }]).filter('totalday',[function(){
        return function(marker){

            var expired_day = marker.markerExpiredFees?marker.markerExpiredFees[0].expired_add_days:"0";
            var days = marker?parseInt(marker.days)+parseInt(expired_day):"";
            return (days>=0)?days:"";
        }
    }]).filter('parseDay',[function(){
        return function(marker){
            var days = marker?parseInt(marker.loan_total_days)-parseInt(marker.term):"";
            return (days>=0)?days:"";
        }
    }]).filter('strNull',[function(){
        return function(str){
            return str && str != 0?str:"";
        }
    }]).filter('parseLoanDay',[function(){
        return function(marker){
            return marker?parseInt(marker.loan_days)-parseInt(marker.term):"";
        }
    }]).filter('parseComfireDay',[function(){
        return function(marker){
            var num = marker?parseInt(marker.markerExpiredFee.loan_total_days)-parseInt(marker.old_term):""
            return num?num:"";
        }
    }]).filter('yesterDay',['strToTime',function(strToTime){
        return function(dd){
            if(!dd)
                dd = new Date();
            if(angular.isString(dd))
                dd = strToTime(dd);
            dd.setDate(dd.getDate()-1);//获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = dd.getMonth()+1;//获取当前月份的日期
            var d = dd.getDate();
            if(parseInt(m) < 10){
                m = "0"+m;
            }
            if(parseInt(d) < 10){
                d = "0"+d;
            }
            return y+"-"+m+"-"+d;
        }
    }]).filter('abc', function(){
        return function(a,b) {
        return b[a]
        }
    }).filter('feeTotal',[function(){
        return function(markers){
            var total = 0;
            if(markers){
                _.each(markers,function(marker){
                    total += parseFloat(marker.fee*10000);
                })
                return total;
            }else{
                return "";
            }
        }
    }])//應收
    .filter('feeChargeTotal',[function(){
        return function(marker){
            var total = 0;
            if(marker.markerExpiredFees){
                _.each(marker.markerExpiredFees,function(markerExpiredFee){
                    if(markerExpiredFee.status != 4 && Number(markerExpiredFee.fee*10000) > 0 && markerExpiredFee.out_agent_code == markerExpiredFee.out_agent_code){
                        total += Number(markerExpiredFee.fee*10000);
                    }
                })
                return Number(total)/10000;
            }else{
                return "0";
            }
        }
    }])//手續費應收
    .filter('reductionAmount',[function(){
        return function(markers){
            var total = 0;
            if(markers){
                _.each(markers,function(marker){
                    total += Number(marker.reduction_amount*10000);
                })
                return total;
            }else{
                return "";
            }
        }
    }])//應收
    .filter('settlementAmount',[function(){
        return function(markers){
            var total = 0;
            if(markers){
                _.each(markers,function(marker){
                    if(Number(marker.fee*10000) > 0){
                        total +=  Number(marker.settlement_amount*10000);
                    }
                })
                return total/10000;
            }else{
                return "";
            }
        }
    }])//應收
    .filter('deleteZero', [function() {
        return function (num) {
            var cur;
            if(num == 0){
                cur = 0;
                return cur;
            }else if(!num){
                cur = "";
                return cur;
            }else{
                cur = parseFloat(num);
                return cur;
            }
        }
    }])//去掉无意义的0
}).call(this);
