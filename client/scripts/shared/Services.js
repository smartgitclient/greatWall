(function () {
    'use strict';
    angular.module('app.services', ['ngResource'])
        .factory('capitalTypes', ['globalFunction', function (globalFunction) {
            return globalFunction.createResource('common/capitaltype');
        }]).factory('BusinessSequence', ['globalFunction', function (globalFunction) {
            return globalFunction.createResource('common/businesssequence', {}, {
                'businessSequence': {
                    method: 'GET',
                    url: globalFunction.getApiUrl('common/businesssequence/business-sequence')
                }
            });
        }]).factory('commonPhrase', ['globalFunction', function (globalFunction) {
            return globalFunction.createResource('common/commonphrase');
        }]).factory('commonCurrency', ['globalFunction', function (globalFunction) {
            return globalFunction.createResource('common/commoncurrency');
        }]).factory('commonGap', ['globalFunction', function (globalFunction) {
            return globalFunction.createResource('common/commongap');
        }]).factory('hallName', ['globalFunction', function (globalFunction) {
            return globalFunction.createResource('common/hall', {}, {
                'setHall': {method: 'POST', url: globalFunction.getApiUrl('common/hall/set-hall')},
                'getHall': {method: 'GET', url: globalFunction.getApiUrl('common/hall/get-hall')},
                'setHallSettlementDate': {
                    method: 'PUT',
                    url: globalFunction.getApiUrl('common/hall/set-hall-settlement-date')
                },
                'setHallIntegralType': {
                    method: 'PUT',
                    url: globalFunction.getApiUrl('common/hall/set-hall-integral-type')
                },
                'deleteHallIntegralType': {
                    method: 'GET',
                    url: globalFunction.getApiUrl('common/hall/delete-hall-integral-type')
                }
            });
        }]).factory('printRecord', ['globalFunction', function (globalFunction) {
            return globalFunction.createResource('printrecord/printrecord', {}, {
                'printRecordTotal': {
                    method: 'GET',
                    url: globalFunction.getApiUrl('printrecord/printrecord/print-record-total'),
                    isArray: true
                }
            });
        }]).factory('search', ['$filter', function ($filter) {
            return function (datas, configs, condition) {
                return _.filter(datas, function (data, index) {
                    return _.every(configs, function (config) {
                        //comparisonType 默认为%
                        if (!config.hasOwnProperty('comparison_type'))
                            config.comparison_type = '%';
                        //conditionName 默认与fieldName一致
                        if (!config.hasOwnProperty('condition_name'))
                            config.condition_name = config.field_name;
                        //dataType 数据类型默认为string
                        if (!config.hasOwnProperty('data_type'))
                            config.data_type = 'string'

                        //如果相关搜索条件为空，则直接返回true;
                        if (!condition.hasOwnProperty(config.condition_name) || condition[config.condition_name] == '')
                            return true;

                        switch (config.data_type) {
                            case 'number':
                                data[config.field_name] = parseFloat(data[config.field_name]);
                                condition[config.condition_name] = parseFloat(condition[config.condition_name]);
                                break;
                            case 'date':
                                condition[config.condition_name] = $filter('date')(condition[config.condition_name], 'yyyy-MM-dd');
                                break;
                            case 'month_date':
                                condition[config.condition_name] = $filter('date')(condition[config.condition_name], 'yyyy-MM-dd').substr(0, 7);
                                break;
                        }
                        switch (config.comparison_type) {
                            case '%'://模糊查询 类似sql 的 like

                                if (data[config.field_name].indexOf(condition[config.condition_name]) != 0)
                                    return false;
                                break;
                            case '=':
                                if (data[config.field_name] != condition[config.condition_name])
                                    return false;
                                break;
                            case '>=':
                                if (data[config.field_name] < condition[config.condition_name])
                                    return false;
                                break;
                            case '<=':
                                if (data[config.field_name] > condition[config.condition_name])
                                    return false;
                                break;
                            default:
                                return true;
                        }
                        return true;
                    })
                })
            };


        }]).service('page', ['paginationConfig', '$http', '$q', 'globalFunction', function (paginationConfig, $http, $q, globalFunction) {
            this.select = function (current_page, data) {

                var end, start;
                start = (current_page - 1) * paginationConfig.itemsPerPage;
                end = start + paginationConfig.itemsPerPage;
                return data.slice(start, end);
            }
            //分頁方法
            this.select_data = function (url, condition) {
                var deferred = $q.defer();
                $http.get(globalFunction.getApiUrl(url), {params: condition}).success(function (data, status, headers, config) {
                    var page_total = headers('X-Pagination-Total-Count');
                    var page_number = headers('X-Pagination-Page-Count');
                    deferred.notify(data);
                    deferred.resolve({"page_total": page_total, "page_number": page_number});
                }).error(function (data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            }

        }]).factory('dateComp', function () {
            return function (d1, d2) {
                var date1 = new Date(d1.replace(/\-/g, "\/"));
                var date2 = new Date(d2.replace(/\-/g, "\/"));
                var r = (date1 - date2) / (24 * 60 * 60 * 1000);
                return r;
            }
        }).factory('getDate', ['$filter', function ($filter) {
            return function (date_obj, have_time) {
                if (!date_obj)
                    date_obj = new Date();
                if (have_time)
                    return $filter('date')(date_obj, 'yyyy-MM-dd HH:mm:ss');
                else
                    return $filter('date')(date_obj, 'yyyy-MM-dd');
            }
        }]).factory('getRound', ['$filter', function ($filter) {
            return function (number) {
                var str = parseInt(number * 10000) + "";
                var a = str.substr(-1);
                var num = 0;
                if (a >= 5) {
                    num = (parseInt(number * 10000)) + 10 - a;
                } else {
                    num = (parseInt(number * 10000)) - a;
                }
                return num / 10000;
            }
        }]).factory('getDay', ['$filter', function ($filter) {
            return function (date_obj) {
                if (date_obj) {
                    return date_obj.replace(" 00:00:00", "");
                } else {
                    return '';
                }
            }
        }]).factory('getMonths', ['$filter', function ($filter) {
            return function (date_obj) {
                if (date_obj) {
                    return date_obj.replace("-01 00:00:00", "");
                } else {
                    return '';
                }
            }
        }]).factory('getTomorrow', ['$filter', 'strToTime', function ($filter, strToTime) {
            return function (dd) {
                if (!dd)
                    dd = new Date();
                if (angular.isString(dd))
                    dd = strToTime(dd);

                dd.setDate(dd.getDate() + 1);//获取AddDayCount天后的日期
                var y = dd.getFullYear();
                var m = dd.getMonth() + 1;//获取当前月份的日期
                if (parseInt(m) < 10) {
                    m = "0" + m;
                }
                var d = dd.getDate();
                if (parseInt(d) < 10) {
                    d = "0" + d;
                }
                return y + "-" + m + "-" + d;
            }
        }]).factory('getNextDays', ['$filter', 'strToTime', function ($filter, strToTime) {
            return function (date, num) {
                var dd = strToTime($filter('date')(date, 'yyyy-MM-dd HH:mm:ss'));

                dd.setDate(dd.getDate() + parseInt(num));//获取AddDayCount天后的日期
                var y = dd.getFullYear();
                var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
                var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
                return y + "-" + m + "-" + d;
            }
        }]).factory('getAppointDay', function () {
            return function (year, month, index) {
                var old_month = month;
                var new_year = year;       //取当前的年份
                var new_month = month++;   //取下一个月的第一天，方便计算（最后一天不固定）
                if (month > 12)               //如果当前大于12月，则年份转到下一年
                {
                    new_month -= 12;        //月份减
                    new_year++;            //年份增
                }
                index = index ? index : 0;
                var new_date = new Date(new_year, new_month, 1);                //取当年当月中的第一天
                var date = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24 * Number(index + 1))).getDate(); //获取当月最后一天日期  index: 返回后几天
                return year + "-" + old_month + "-" + date;
            }
        }).factory('getYesterday', ['$filter', 'strToTime', function ($filter, strToTime) {
            return function (dd) {
                if (!dd)
                    dd = new Date();
                if (angular.isString(dd))
                    dd = strToTime(dd);
                dd.setDate(dd.getDate() - 1);//获取AddDayCount天后的日期
                var y = dd.getFullYear();
                var m = dd.getMonth() + 1;//获取当前月份的日期
                var d = dd.getDate();
                if (parseInt(m) < 10) {
                    m = "0" + m;
                }
                if (parseInt(d) < 10) {
                    d = "0" + d;
                }
                return y + "-" + m + "-" + d;
            }
        }]).factory('getYestermonth', ['$filter', function ($filter) {
            return function (date_obj, flag) {
//                if(!date_obj)
//                    dd = new Date();
                var months = date_obj.split('-');
                var y = months[0];
                var m = flag === true ? Number(months[1]) + 1 : Number(months[1]) - 1;
                if (m == 0) {
                    m = 12;
                    y = Number(y) - 1;
                }
                if (m > 12 && flag === true) {
                    m = 1;
                    y = Number(y) + 1;
                }
                if (m < 10) {
                    m = "0" + m;
                }
                return y + "-" + m;
            }
        }]).factory('strToTime', [function () {
            return function (str) {
                if (typeof str == 'string') {
                    var results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) *$/);
                    if (results && results.length > 3)
                        return new Date(parseInt(results[1]), parseInt(results[2]) - 1, parseInt(results[3]));
                    results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2}) *$/);
                    if (results && results.length > 6)
                        return new Date(parseInt(results[1]), parseInt(results[2]) - 1, parseInt(results[3]), parseInt(results[4]), parseInt(results[5]), parseInt(results[6]));
                    results = str.match(/^ *(\d{4})-(\d{1,2})-(\d{1,2}) +(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d{1,9}) *$/);
                    if (results && results.length > 7)
                        return new Date(parseInt(results[1]), parseInt(results[2]) - 1, parseInt(results[3]), parseInt(results[4]), parseInt(results[5]), parseInt(results[6]), parseInt(results[7]));
                }
                return null;
            }
        }]).factory('inputFloat', ['user', function (user) { //判斷是否為大寫
            return function (val) {
                val = val + "";
                if (user.hall.id == '1AE7283167B57D1DE050A8C098155859' || user.hall.id == '27115D48C5F726D6E050A8C098150716') {//
                    var num = val.indexOf('.')
                    if (num == -1) {
                        return parseInt(val);
                    } else {
                        return val.substring(num + 2, 0);
                    }
                } else {
                    return parseInt(val);
                }
            }
        }]).factory('checkUppercase', [function () { //判斷是否為大寫
            return function (val) {
                if (/[a-z]/.test(val)) {
                    return false;
                }
                return true;
                //alert(val+"请输入大写英文字母");
//               && /\d/.test(str)
            }

        }]).factory('formatNumber', ['currencyFilter', function (currencyFilter) { //數字格式方法
            return function (amount, minus, prefix, num) {
                if (angular.isUndefined(prefix))
                    prefix = ''
                if (angular.isUndefined(num))
                    num = 4;
                if (_.startsWith(amount, '.')) {
                    amount = '0' + amount;
                }
                var cur = currencyFilter(_.toNumber(amount, num), '', num);
                if (_.str.include(cur, '.')) {
                    cur = _.rtrim(_.rtrim(_.trim(cur, '()'), '0'), '.');
                }
                if (minus === true || (_.toNumber(amount, num) < 0 && minus !== ''))
                    prefix += '-';
                if (cur != 0 && cur != '')
                    return prefix + cur;
                else
                    return prefix;
            }
        }]).service('breadcrumb', function () {
            this.items = [];
        }).factory('validateInterceptor', ['$q', 'validateForms', 'topAlert', function ($q, validateForms, topAlert) {
            return {
                'responseError': function (response) {
                    var form_name = response.config.method + response.config.url;
                    if (/[a-zA-Z0-9]{32}$/.test(form_name))
                        form_name = form_name.slice(0, -33);
                    if (response.status == 422 && validateForms.forms.hasOwnProperty(form_name)) {
                        var current_form = validateForms.forms[form_name];
                        _.each(current_form, function (field, key) {

                            var err_item;
                            if (key.substr(0, 1) != '$' && typeof(current_form[key]) != "function") {
                                current_form[key].$setValidity('server', true);
                                current_form[key].server_error = "";
                            }
                        })

                        var setErrors = function (error, prefix) {
                            _.each(error, function (value, key, list) {
                                if (/^\d+$/.test(key) && prefix == '')
                                    prefix = 'parent_';
                                if (_.isObject(value))
                                    setErrors(value, prefix + key + '_');
                                else {
                                    var current_key = prefix + key;
                                    if (!angular.isUndefined(current_form[current_key])) {
                                        current_form[current_key].$setValidity('server', false);
                                        current_form[current_key].server_error = value;
                                    } else {
                                        //TODO 返回来的错误在form中找不到对应的元素，应放在全局错误提示里
                                    }
                                    topAlert.warning(value);
                                }

                            })
                            return error;
                        }
                        setErrors(response.data, '');

                    }
                    return $q.reject(response);
                }
            }
        }]).factory('errorInterceptor', ['$q', 'topAlert', 'globalConfig', '$window', function ($q, topAlert, globalConfig, $window) {
            return {
                'responseError': function (response) {

                    if (response.data.status == 400) {
                        topAlert.warning(response.data.message);
                    } else if (response.data.status == 401 && $window.location.hash != '#' + globalConfig.signinUrl) {
                        if (angular.isUndefined(_.findWhere(topAlert.alerts, {'msg': response.data.message})))
                            topAlert.warning(response.data.message);
                        sessionStorage.clear();
                        $window.location.href = '#' + globalConfig.signinUrl;
                    } else if (response.data.status == 403) {
                        topAlert.warning(response.data.message);
                    }
                    return $q.reject(response);
                }
            }
        }]).service('validateForms', [function () {
            this.forms = [];
        }]).service('fixedNumber',[function(){
            this.quweishu = function (e) {
                var test = e;
                if(test){
                     test = test.toFixed(5)
                test = test.substring(0, test.length-2);
                if(test.substring(test.length-3,test.length) == "000"){
                    test = test.substring(0,test.length-4);
                }else{
                    if(test.substring(test.length-2,test.length) == "00"){
                    test = test.substring(0,test.length-2)
                    }else{
                        if(test.substring(test.length-1,test.length) == "0"){
                            test = test.substring(0,test.length-1);
                        }
                    }
                }
            }else{
                test = 0
            }
                return test;
            };
            this.fixed4 = function (e) {
                var test = e;
                if(test){
                test = test.toFixed(6)
                test = test.substring(0, test.length-2);
                 if(test.substring(test.length-4,test.length) == "0000"){
                    test = test.substring(0,test.length-5);
                    return test;
                    }else{
                        if(test.substring(test.length-3,test.length) == "000"){
                            test = test.substring(0,test.length-3);
                            return test;
                            }else{
                                 if(test.substring(test.length-2,test.length) == "00"){
                                test = test.substring(0,test.length-2);
                                return test;
                                }else{
                                    if(test.substring(test.length-1,test.length) == "0"){
                                        test = test.substring(0,test.length-1);
                                        return test;
                                        }else{
                                            return test;
                                        }
                                }
                            }
                        }
            }else{
                 return 0;
            }
        }
        }]).service('globalFunction',['globalConfig','$resource','user','$timeout','$q',function(globalConfig,$resource,user,$timeout,$q){

            this.getApiUrl = function (url) {
                return globalConfig.apiUrl + url;
            }
            this.javaApi = function (url) {
                return globalConfig.javaApi + url;
            }
            this.generateUrlParams = function (condtion, fields) {
                var params = {};
                //set condition
                var setParams = function (params, obj, prefix) {
                    _.each(obj, function (value, key, list) {
                        if (_.isArray(value)) {
                            if (value.length == 1) {
                                params[prefix + key + '-range'] = value[0];
                            } else if (value.length == 3) {
                                params[prefix + key + '-range'] = value[2];
                                params[prefix + key + '-min'] = value[0];
                                params[prefix + key + '-max'] = value[1];
                            } else {
                                params[prefix + key + '-min'] = value[0];
                                params[prefix + key + '-max'] = value[1];
                            }
                        } else if (_.isObject(value)) {
                            setParams(params, value, prefix + key + '.')
                        } else {
                            params[prefix + key] = value;
                        }

                    })
                    return obj;
                }
                setParams(params, condtion, '')

                //set fields
                if (fields) {
                    params['fields'] = [];
                    params['expand'] = [];
                    params['expand-fields'] = {};
                    _.each(fields, function (value, key, list) {
                        if (_.isObject(value)) {
                            params['expand'].push(key);
                            setParams(params['expand-fields'], value, key + '.');
                        } else {
                            params['fields'].push(key);
                        }
                    })
                    params['fields'] = params['fields'].join(',');
                    params['expand'] = params['expand'].join(',');
                    params['expand-fields'] = _.keys(params['expand-fields']).join(',');
                }
                return params;
            }
            this.createResource = function (url, param_defaults, actions) {
                var canceler = $q.defer();
                var inner_actions = {
                    'get': {method: 'GET', url: this.getApiUrl(url + '/:id')},
                    'query': {method: 'GET', isArray: true, timeout: canceler.promise},
                    'update': {method: 'PUT', url: this.getApiUrl(url + '/:id')},
                    'delete': {method: 'DELETE', url: this.getApiUrl(url + '/:id')}
                };

                var inner_param_defaults = {
                    id: "@id", PHPSESSID: function () {
                        return sessionStorage.token ? sessionStorage.token : null
                    }
                };
                //$timeout(function(){canceler.resolve();},10);

                actions = _.extend(inner_actions, actions);
                param_defaults = _.extend(inner_param_defaults, param_defaults);
                return $resource(this.getApiUrl(url), param_defaults, actions);
            }
            this.debounce = function (fun, wait) {
                if (angular.isUndefined(wait))
                    wait = 800;
                return _.debounce(fun, wait);
            },
                this.getHall = function (condition) {
                    var halls = JSON.parse(sessionStorage.getItem('halls'));
                    if (typeof condition == 'string')
                        return _.findWhere(halls, {"id": condition});
                    else if (condition == null)
                        return halls;
                    else
                        return _.where(halls, condition);
                }
        }]).service('user', function () {
            this.id;
            this.username;
            this.name;
            this.no;
            this.token;
            this.hall = {
                id: "",
                hall_name: "",
                hall_type: "",
                line_id: ""
            },
                this.department = {
                    id: "",
                    name: "",
                    code: ""
                }
            this.permissions = [];
            this.checkPermissions = function (permission) {
                if (angular.isArray(permission)) {
                    return _.intersection(this.permissions, permission).length ? true : false;
                } else {
                    return _.indexOf(this.permissions, permission) == -1 ? false : true;
                }
            }

            this.set = function (info) {
                this.id = info.id;
                this.username = info.username;
                this.name = info.name;
                this.no = info.user_no;
                this.token = info.token;
                this.hall.id = info.hall.id;
                this.hall.hall_name = info.hall.hall_name;
                this.hall.hall_type = info.hall.hall_type;
                this.department.id = info.department.id;
                this.department.name = info.department.department;
                this.department.code = info.department.department_code;
                this.permissions = info.permissions;

            }
            this.reset = function () {
                this.id = '';
                this.username = '';
                this.name = '';
                this.no = '';
                this.token = '';
                this.hall = {
                    id: "",
                    hall_name: ""
                },
                    this.deparment = {
                        id: "",
                        name: "",
                        code: ""
                    }
                this.permissions = [];
            }
            this.isAllHall = function () {
                return this.hall.hall_type == 1;
            }

        }).service('userManager', ['userInfo', '$q', 'globalFunction', 'globalConfig', '$location', 'user', 'hallTotalMonthly', 'currentShift', 'currentMachine',
            function (userInfo, $q, globalFunction, globalConfig, $location, user, hallTotalMonthly, currentShift, currentMachine) {
                var _self = this;
                this.login = function (user_info) {
                    var deferred = $q.defer();
                    userInfo.login(user_info).$promise.then(function (response) {
                        user.set(response);
                        sessionStorage.setItem("IVRotherFunction", user.checkPermissions("IVRotherFunction"));
                        sessionStorage.setItem("line_id", response.hall.line_id);
                        var dataStr = angular.toJson({log: []});
                        console.log(dataStr);
                        sessionStorage.setItem("CallList", dataStr)
                        sessionStorage.setItem("token", response.token);
                        sessionStorage.setItem("permissions", JSON.stringify(response.permissions));
                        sessionStorage.setItem("halls", JSON.stringify(response.halls));
                        currentShift.set(response.shift);
                        //  response.machine.landline_id="1203"
                        currentMachine.set(response.machine);
                        deferred.resolve();
                    }, function (response) {
                        deferred.reject();
                    });
                    return deferred.promise;
                }
                this.logout = function () {
                    userInfo.logout().$promise.then(function () {
                        user.reset();
                        sessionStorage.clear();
                        try {
                            var gui = require('nw.gui');
                            var win = gui.Window.get();
                            win.reloadDev();
                        }catch(e){
                                $location.path(globalConfig.signinUrl);
                            }
                        //$location.path(globalConfig.signinUrl);
                    });
                }
                this.setUserAttribute = function (field, value) {
                    user[field] = value;
                }
                this.restorageUserInfo = function () {
                    var deferred = $q.defer();
                    user.permissions = JSON.parse(sessionStorage.getItem("permissions"));
                    userInfo.loginedUserInfo().$promise.then(function (response) {
                        if (response.id) {
                            user.set(response);
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    }, function (response) {
                        {
                            deferred.reject();
                        }
                    })
                    return deferred.promise;
                }

            }]).factory('tmsPagination', ['paginationConfig', '$http', '$q', 'globalFunction', function (paginationConfig, $http, $q, globalFunction) {
            return {
                create: function () {
                    return {
                        items_per_page: paginationConfig.itemsPerPage,
                        total_items: 0,
                        total_pages: 0,
                        page: 1,
                        max_size: paginationConfig.maxSize,
                        query_method: 'query',
                        resource: null,
                        sort: "",
                        init: function (page) { //当指定页数，但没指定总记录数时，bootstrap的分页控件会将page强制为1
                            this.page = page;
                            this.total_items = this.items_per_page * page;
                        },
                        select: function (page, condition, fields) {
                            if (condition == null)
                                condition = {};
                            condition['page'] = this.page = page ? page : 1;
                            condition['per-page'] = this.items_per_page;
                            var _self = this;
                            if (this.sort)
                                condition.sort = this.sort;
                            return this.resource[_self.query_method](globalFunction.generateUrlParams(condition, fields), function (data, headers) {
                                _self.total_items = headers('X-Pagination-Total-Count');
                                _self.total_pages = headers('X-Pagination-Page-Count');
                            });
                        }
                    }
                }
            }

        }])/*.factory('windowItems',['$modal','$modalInstance',function($modal,$modalInstance){
     return {
     /**
     *
     * @param title
     * @param message
     * @param callback  確定事件
     * @param callback2 取消事件
     * @param btn 自定義操作按鈕名稱
     *
     confirm : function(title, message, callback, callback2, btn_txt, $modalInstance) {
     var $modalInstance;
     $modalInstance = $modal.open({
     templateUrl: 'views/share/dialog-confirm.html',
     controller: 'windowCtrl',
     size:'sm',
     resolve: {
     data : function(){
     return {
     'title' : title,
     'content': message,
     'callback' : callback == undefined || "" ? Function : callback(),
     'callback2' : callback2 == undefined || "" ? Function : callback2(),
     'btn_txt' : btn_txt==undefined || "" ? "確定" : btn_txt
     };
     }
     }
     })
     return $modalInstance;
     },
     alert : function(title, message) {
     var  $modalInstance;
     $modalInstance = $modal.open({
     //template: content,
     templateUrl: 'views/share/dialog-alert.html',
     controller: 'windowCtrl',
     size:'sm',
     //windowClass: 'lg-modal',
     resolve: {
     data : function(){
     return {
     'title' : title,
     'content': message
     };
     }
     }
     })

     return $modalInstance;
     },
     prompt : function(title, message, callback){

     }

     }

     }])*/.factory("httpTms", ['$http', '$q', 'globalFunction', function ($http, $q, globalFunction) {
            return {
                //获取指定id的數據
                getById: function (url) {
                    var defer = $q.defer();
                    $http.get(globalFunction.getApiUrl(url)).success(function (data, status, headers, config) {
                        defer.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defer.reject(data);
                    });
                    return defer.promise;
                },
                //获取指定id的數據
                getByConditions: function (url, conditions) {
                    var defer = $q.defer();
                    $http.get(globalFunction.getApiUrl(url), {params: conditions}).success(function (data, status, headers, config) {
                        defer.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defer.reject(data);
                    });
                    return defer.promise;
                },
                //查詢所以的數據
                query: function (url) {
                    var defer = $q.defer();
                    $http.get(globalFunction.getApiUrl(url)).success(function (data, status, headers, config) {
                        defer.resolve(data);
                    }).error(function (data, status, headers, config) {
                        defer.reject(data);
                    });
                    return defer.promise;
                },
                //保存數據，如果數據有id的話，那就更新這條數據，如果沒有id的話就新建一條數據
                save: function (url, obj) {
                    var defer = $q.defer();
                    url = obj.id ? url + '/' + obj.id : url;
                    $http.post(globalFunction.getApiUrl(url), obj).success(function (data, status, headers, config) {
                        alert("新增成功");
                        defer.resolve(data);
                    }).error(function (data) {
                        defer.reject(data);
                    });
                    return defer.promise
                },
                //刪除指定id的數據
                del: function (url) {
                    var defer = $q.defer();
                    $http.delete(globalFunction.getApiUrl(url)).success(function (data) {
                        defer.resolve(data);
                    }).error(function (data) {
                        defer.reject(data);
                    });
                    return defer.promise;
                }
            }
        }]).factory('pinCodeUserName', ['globalFunction', function (globalFunction) {//證件類型
            return globalFunction.createResource('common/user/user-name');
        }]).factory('sceneInfo', ['globalFunction', function (globalFunction) { //在場客戶列表
            return globalFunction.createResource('common/sceneinfo');
        }]).factory('userInfo', ['globalFunction', function (globalFunction) { //在場客戶列表
            return globalFunction.createResource('common/user', {}, {
                login: {method: 'POST', url: globalFunction.getApiUrl('common/user/login')},
                logout: {method: 'POST', url: globalFunction.getApiUrl('common/user/logout')},
                permissions: {method: 'GET', url: globalFunction.getApiUrl('common/user/permissions'), isArray: true},
                loginedUserInfo: {method: 'GET', url: globalFunction.getApiUrl('common/user/logined-user-info')},
                getVersion: {method: 'GET', url: globalFunction.getApiUrl('common/user/get-version')}
            });
        }]).factory('capitalTypes', ['globalFunction', function (globalFunction) {
            return globalFunction.createResource('common/capitaltype');
        }]).factory('paymentMethods', ['globalFunction', function (globalFunction) {
            return [{'id': '1', 'name': '存卡'}, {'id': '2', 'name': '現金'}];//globalFunction.createResource('common/hall');

        }]).factory('paymentTypes', ['globalFunction', function (globalFunction) {
            return [{'id': '1', 'name': '全部還款'}, {'id': '0', 'name': '部分還款'}]; //globalFunction.createResource('common/hall');
        }]).factory('bindSmsnoticeType', ['globalFunction', function () { //聯絡人綁定 通知類型
            return [
                {'id': '1', sms_notice_type: '短信'},
                {'id': '2', sms_notice_type: '電話'},
                {'id': '3', sms_notice_type: '全部'}
            ]
        }]).factory('nationaLity', ['globalFunction', function (globalFunction) {//國際
            return globalFunction.createResource('common/nationality');
        }]).factory('languageType', ['globalFunction', function (globalFunction) {//語言
            return globalFunction.createResource('common/languagetype');
        }]).factory('specialCodeTypes', ['globalFunction', function (globalFunction) {//性別
            return [
                {'id': '', 'name': '普通貸款'},
//                {'id':'WORKROLLING', 'name':'工作碼'}
                {'id': 'INCREASE', 'name': '工作碼'}
//                {'id':'PROP', 'name':'道具'}

            ]
        }]).factory('idcardType', ['globalFunction', function (globalFunction) {//證件類型
            return globalFunction.createResource('common/idcardtype');
        }]).factory('areaCode', ['globalFunction', function (globalFunction) { //地區號
            return globalFunction.createResource('common/areacode');
        }]).factory('contactPrivilege', ['globalFunction', function (globalFunction) { //授權類型
            return globalFunction.createResource('common/contactprivilege');
        }]).factory('departMent', ['globalFunction', function (globalFunction) { //所有部门
            return globalFunction.createResource('common/department');
        }]).factory('contactTypes', ['globalFunction', function (globalFunction) { //聯絡人綁定類型
            return globalFunction.createResource('common/contacttype');
        }]).factory('fundsTypes', ['globalFunction', function (globalFunction) { //聯絡人綁定類型
            return globalFunction.createResource('common/fundstype');
        }]).factory('shiftMark', ['globalFunction', function (globalFunction) { //更數
            return globalFunction.createResource('shift/shiftmark');
        }]).factory('getVersion', ['globalFunction', function (globalFunction) { //獲取版本信息
            return globalFunction.createResource('common/version');
        }]).factory('windowItems', ['$modal', function ($modal) {
            return {
                /**
                 *
                 * @param title
                 * @param message
                 * @param callback  確定事件
                 * @param callback2 取消事件
                 * @param btn 自定義操作按鈕名稱
                 */
                confirm: function (title, message, callback, callback2, btn_txt) {
                    var $modalInstance;
                    $modalInstance = $modal.open({
                        templateUrl: 'views/share/dialog-confirm.html',
                        controller: 'windowCtrl',
                        size: 'sm',
                        //windowClass: 'lg-modal',
                        resolve: {
                            data: function () {
                                return {
                                    'title': title,
                                    'content': message,
                                    'callback': callback == undefined || "" ? Function : callback,
                                    'callback2': callback == undefined || "" ? Function : callback2,
                                    'btn_txt': btn_txt == undefined || "" ? "確定" : btn_txt
                                };
                            }
                        }
                    });
                    return $modalInstance;
                },
                alert: function (title, message) {
                    var $modalInstance;
                    $modalInstance = $modal.open({
                        //template: content,
                        templateUrl: 'views/share/dialog-alert.html',
                        controller: 'windowCtrl',
                        size: 'sm',
                        //windowClass: 'lg-modal',
                        resolve: {
                            data: function () {
                                return {
                                    'title': title,
                                    'content': message
                                };
                            }
                        }
                    });
                    return $modalInstance;
                },
                prompt: function (title, message, callback) {

                }

            }
        }]).service('topAlert', function () {
            this.alerts = [];
            this.warning = function (msg) {
                this.addAlert({type: 'warning', msg: msg});
            }
            this.success = function (msg) {
                this.addAlert({type: 'success', msg: msg});
            }
            this.danger = function (msg) {
                this.addAlert({type: 'danger', msg: msg});
            }
            this.info = function (msg) {
                this.addAlert({type: 'info', msg: msg});
            }
            this.addAlert = function (msg) {
                msg.expires = Date.parse(new Date()) + 3000;//5秒
                this.alerts.unshift(msg);
                if (this.alerts.length > 10)
                    this.alerts.pop();
            }
            this.clear = function () {
                this.alerts.splice(0);
            }
        }).factory('pinCodeModal', ['$q', 'globalFunction', '$modal', function ($q, globalFunction, $modal) {
            return function (resource, method, params, message, is_second_pin_code, get_params) {
                var deferred = $q.defer();
                var modalInstance;
                modalInstance = $modal.open({
                    templateUrl: "views/share/pin-code-modal.html",
                    controller: 'pinCodeModalCtrl',
                    resolve: {
                        resource: function () {
                            return resource
                        },
                        method: function () {
                            return method
                        },
                        params: function () {
                            return params
                        },
                        message: function () {
                            return message
                        },
                        is_second_pin_code: function () {
                            return is_second_pin_code
                        },
                        get_params: function () {
                            return get_params;
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                    deferred.resolve(data);
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            }
        }]).service('nodeFunction', ['$q', function ($q) {
            this.getMac = function () {
                var deferred = $q.defer();

                require('getmac').getMac(function (err, macAddress) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(macAddress);
                    }
                });
                return deferred.promise;
            };
            this.maximize = function () {
                if (typeof require === 'function') {
                    var gui = require('nw.gui');
                    var win = gui.Window.get();
                    win.maximize();
                }
            };

        }]).service('windowTheme', [function () {
            this.change = function (theme) {
                var theme_css_link = angular.element("#theme_css_link");
                var href = theme_css_link.attr("href");
                var defaultTheme = theme_css_link.attr("default-theme");
                var local_theme = localStorage.getItem('theme');
                var css_name = theme ? theme : ('undefined' == local_theme || 'null' == local_theme || !local_theme ? defaultTheme : localStorage.getItem('theme') );

                localStorage.setItem('theme', css_name);
                if (-1 == href.indexOf('/' + css_name + '.css')) {
                    var new_href = href.replace(/\/.*\.css/ig, '/' + css_name + '.css');
                    theme_css_link.attr("href", new_href);
                }
            }
        }]).service('currentShift', ['$filter', '$window', function ($filter, $window) {
            this.data = {year_month: '', shift_date: ''};
            this.set = function (shift) {
                sessionStorage.setItem("currentShift", JSON.stringify(shift));
                if (shift) {
                    this.data = shift;
                    this.data.year_month = $filter("parseDate")(this.data.year_month, 'yyyy-MM');
                    this.data.shift_date = $filter("parseDate")(this.data.shift_date, 'yyyy-MM-dd');
                } else {
                    this.data.year_month = '';
                    this.data.shift_date = '';
                }

                if ($window.parent.angular.element("#iframePanels").length) {
                    var iframePanelsScope = $window.parent.angular.element("#iframePanels").scope();
                    iframePanelsScope.resetShift(this.data);
                }

            }
        }]).service('currentMachine', ['$window', function ($window) {
            this.set = function (machine) {
                sessionStorage.setItem("machine", JSON.stringify(machine));
            }
            this.setField = function (field_name, value) {
                var machine = JSON.parse(sessionStorage.getItem("machine"));
                machine[field_name] = value;
                sessionStorage.setItem("machine", JSON.stringify(machine));
            }
            this.get = function (name) {
                var machine = JSON.parse(sessionStorage.getItem("machine"));
                if (machine)
                    return machine[name];
            }
        }]).service('goBackData', ['$state', function ($state) {
            this.set = function (item_name, value) {
                if (!$state.current.data) {
                    $state.current.data = {};
                }
                $state.current.data[item_name] = angular.copy(value);
            }
            this.get = function (item_name, defaut_value) {
                if ($state.current.nextLinks && _.contains($state.current.nextLinks, $state.current.previousUrl)) {
                    if ($state.current.data && $state.current.data[item_name]) {
                        return $state.current.data[item_name];
                    }
                } else {
                    if ($state.current.data && $state.current.data[item_name]) {
                        $state.current.data[item_name] = null;
                    }
                }
                return defaut_value;
            }
        }]).service('ConsumptionSmsTemp', [function () {

            this.model;

            this.init = function (_model) {
                this.model = _model;
            };

            this.destroy = function () {
                this.model = undefined;
            }

        }]).factory('isSendSmsModal', ['$modal', 'windowItems', '$location', function ($modal, windowItems, $location) {
            return function (agent_info_id) {
                windowItems.confirm('系統提醒', '是否發送SMS', function () {
                    /*$modal.open({
                     templateUrl: "views/share/send-sms-window.html",
                     controller: 'normalSmsCtrl',
                     windowClass:'md-modal',
                     resolve: {
                     agent_info_id : function() {
                     return agent_info_id;
                     }
                     }
                     });*/
                    $location.path("share/share-send-sms/" + agent_info_id);
                });

            }
        }]).factory('SimplizedorFt', function () {
          //简体繁体 start
          function JTPYStr() {
              return '啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸尽劲荆兢觉决诀绝均菌钧军君峻俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座锕嗳嫒瑷暧霭谙铵鹌媪骜鳌钯呗钣鸨龅鹎贲锛荜哔滗铋筚跸苄缏笾骠飑飙镖镳鳔傧缤槟殡膑镔髌鬓禀饽钹鹁钸骖黪恻锸侪钗冁谄谶蒇忏婵骣觇禅镡伥苌怅阊鲳砗伧谌榇碜龀枨柽铖铛饬鸱铳俦帱雠刍绌蹰钏怆缍鹑辍龊鹚苁骢枞辏撺锉鹾哒鞑骀绐殚赕瘅箪谠砀裆焘镫籴诋谛绨觌镝巅钿癫铫鲷鲽铤铥岽鸫窦渎椟牍笃黩簖怼镦炖趸铎谔垩阏轭锇锷鹗颚颛鳄诶迩铒鸸鲕钫鲂绯镄鲱偾沣凫驸绂绋赙麸鲋鳆钆赅尴擀绀戆睾诰缟锆纥镉颍亘赓绠鲠诟缑觏诂毂钴锢鸪鹄鹘鸹掴诖掼鹳鳏犷匦刿妫桧鲑鳜衮绲鲧埚呙帼椁蝈铪阚绗颉灏颢诃阖蛎黉讧荭闳鲎浒鹕骅桦铧奂缳锾鲩鳇诙荟哕浍缋珲晖诨馄阍钬镬讦诘荠叽哜骥玑觊齑矶羁虿跻霁鲚鲫郏浃铗镓蛲谏缣戋戬睑鹣笕鲣鞯绛缰挢峤鹪鲛疖颌鲒卺荩馑缙赆觐刭泾迳弪胫靓阄鸠鹫讵屦榉飓钜锔窭龃锩镌隽谲珏皲剀垲忾恺铠锴龛闶钪铐骒缂轲钶锞颔龈铿喾郐哙脍狯髋诓诳邝圹纩贶匮蒉愦聩篑阃锟鲲蛴崃徕涞濑赉睐铼癞籁岚榄斓镧褴阆锒唠崂铑铹痨鳓诔缧俪郦坜苈莅蓠呖逦骊缡枥栎轹砺锂鹂疠粝跞雳鲡鳢蔹奁潋琏殓裢裣鲢魉缭钌鹩蔺廪檩辚躏绫棂蛏鲮浏骝绺镏鹨茏泷珑栊胧砻偻蒌喽嵝镂瘘耧蝼髅垆撸噜闾泸渌栌橹轳辂辘氇胪鸬鹭舻鲈脔娈栾鸾銮囵荦猡泺椤脶镙榈褛锊呒唛嬷杩劢缦镘颡鳗麽扪焖懑钔芈谧猕祢渑腼黾缈缪闵缗谟蓦馍殁镆钼铙讷铌鲵辇鲶茑袅陧蘖嗫颟蹑苎咛聍侬哝驽钕傩讴怄瓯蹒疱辔纰罴铍谝骈缥嫔钋镤镨蕲骐绮桤碛颀颃鳍佥荨悭骞缱椠钤嫱樯戗炝锖锵镪羟跄诮谯荞缲硗跷惬锲箧锓揿鲭茕蛱巯赇虮鳅诎岖阒觑鸲诠绻辁铨阕阙悫荛娆桡饪轫嵘蝾缛铷颦蚬飒毵糁缫啬铯穑铩鲨酾讪姗骟钐鳝垧殇觞厍滠畲诜谂渖谥埘莳弑轼贳铈鲥绶摅纾闩铄厮驷缌锶鸶薮馊飕锼谡稣谇荪狲唢睃闼铊鳎钛鲐昙钽锬顸傥饧铴镗韬铽缇鹈阗粜龆鲦恸钭钍抟饨箨鼍娲腽纨绾辋诿帏闱沩涠玮韪炜鲔阌莴龌邬庑怃妩骛鹉鹜饩阋玺觋硖苋莶藓岘猃娴鹇痫蚝籼跹芗饷骧缃飨哓潇骁绡枭箫亵撷绁缬陉荥馐鸺诩顼谖铉镟谑泶鳕埙浔鲟垭娅桠氩厣赝俨兖谳恹闫酽魇餍鼹炀轺鹞鳐靥谒邺晔烨诒呓峄饴怿驿缢轶贻钇镒镱瘗舣铟瘾茔莺萦蓥撄嘤滢潆璎鹦瘿颏罂镛莸铕鱿伛俣谀谕蓣嵛饫阈妪纡觎欤钰鹆鹬龉橼鸢鼋钺郓芸恽愠纭韫殒氲瓒趱錾驵赜啧帻箦谮缯谵诏钊谪辄鹧浈缜桢轸赈祯鸩诤峥钲铮筝骘栉栀轵轾贽鸷蛳絷踬踯觯锺纣绉伫槠铢啭馔颞骓缒诼镯谘缁辎赀眦锱龇鲻偬诹驺鲰镞缵躜鳟讠谫郄勐凼坂垅垴埯埝苘荬荮莜莼菰藁揸吒吣咔咝咴噘噼嚯幞岙嵴彷徼犸狍馀馇馓馕愣憷懔丬溆滟溷漤潴澹甯纟绔绱珉枧桊桉槔橥轱轷赍肷胨飚煳煅熘愍淼砜磙眍钚钷铘铞锃锍锎锏锘锝锪锫锿镅镎镢镥镩镲稆鹋鹛鹱疬疴痖癯裥襁耢颥螨麴鲅鲆鲇鲞鲴鲺鲼鳊鳋鳘鳙鞒鞴齄';
          };
          function FTPYStr() {
              return '啊阿埃挨哎唉哀皚癌藹矮艾礙愛隘鞍氨安俺按暗岸胺案骯昂盎凹敖熬翺襖傲奧懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙壩霸罷爸白柏百擺佰敗拜稗斑班搬扳般頒板版扮拌伴瓣半辦絆邦幫梆榜膀綁棒磅蚌鎊傍謗苞胞包褒剝薄雹保堡飽寶抱報暴豹鮑爆杯碑悲卑北輩背貝鋇倍狽備憊焙被奔苯本笨崩繃甭泵蹦迸逼鼻比鄙筆彼碧蓖蔽畢斃毖幣庇痹閉敝弊必辟壁臂避陛鞭邊編貶扁便變卞辨辯辮遍標彪膘表鱉憋別癟彬斌瀕濱賓擯兵冰柄丙秉餅炳病並玻菠播撥缽波博勃搏鉑箔伯帛舶脖膊渤泊駁捕蔔哺補埠不布步簿部怖擦猜裁材才財睬踩采彩菜蔡餐參蠶殘慚慘燦蒼艙倉滄藏操糙槽曹草廁策側冊測層蹭插叉茬茶查碴搽察岔差詫拆柴豺攙摻蟬饞讒纏鏟產闡顫昌猖場嘗常長償腸廠敞暢唱倡超抄鈔朝嘲潮巢吵炒車扯撤掣徹澈郴臣辰塵晨忱沈陳趁襯撐稱城橙成呈乘程懲澄誠承逞騁秤吃癡持匙池遲弛馳恥齒侈尺赤翅斥熾充沖蟲崇寵抽酬疇躊稠愁籌仇綢瞅醜臭初出櫥廚躇鋤雛滁除楚礎儲矗搐觸處揣川穿椽傳船喘串瘡窗幢床闖創吹炊捶錘垂春椿醇唇淳純蠢戳綽疵茨磁雌辭慈瓷詞此刺賜次聰蔥囪匆從叢湊粗醋簇促躥篡竄摧崔催脆瘁粹淬翠村存寸磋撮搓措挫錯搭達答瘩打大呆歹傣戴帶殆代貸袋待逮怠耽擔丹單鄲撣膽旦氮但憚淡誕彈蛋當擋黨蕩檔刀搗蹈倒島禱導到稻悼道盜德得的蹬燈登等瞪凳鄧堤低滴迪敵笛狄滌翟嫡抵底地蒂第帝弟遞締顛掂滇碘點典靛墊電佃甸店惦奠澱殿碉叼雕雕刁掉吊釣調跌爹碟蝶叠諜疊丁盯叮釘頂鼎錠定訂丟東冬董懂動棟侗恫凍洞兜抖鬥陡豆逗痘都督毒犢獨讀堵睹賭杜鍍肚度渡妒端短鍛段斷緞堆兌隊對墩噸蹲敦頓囤鈍盾遁掇哆多奪垛躲朵跺舵剁惰墮蛾峨鵝俄額訛娥惡厄扼遏鄂餓恩而兒耳爾餌洱二貳發罰筏伐乏閥法琺藩帆番翻樊礬釩繁凡煩反返範販犯飯泛坊芳方肪房防妨仿訪紡放菲非啡飛肥匪誹吠肺廢沸費芬酚吩氛分紛墳焚汾粉奮份忿憤糞豐封楓蜂峰鋒風瘋烽逢馮縫諷奉鳳佛否夫敷膚孵扶拂輻幅氟符伏俘服浮涪福袱弗甫撫輔俯釜斧脯腑府腐赴副覆賦復傅付阜父腹負富訃附婦縛咐噶嘎該改概鈣蓋溉幹甘桿柑竿肝趕感稈敢贛岡剛鋼缸肛綱崗港杠篙臯高膏羔糕搞鎬稿告哥歌擱戈鴿胳疙割革葛格蛤閣隔鉻個各給根跟耕更庚羹埂耿梗工攻功恭龔供躬公宮弓鞏汞拱貢共鉤勾溝茍狗垢構購夠辜菇咕箍估沽孤姑鼓古蠱骨谷股故顧固雇刮瓜剮寡掛褂乖拐怪棺關官冠觀管館罐慣灌貫光廣逛瑰規圭矽歸龜閨軌鬼詭癸桂櫃跪貴劊輥滾棍鍋郭國果裹過哈骸孩海氦亥害駭酣憨邯韓含涵寒函喊罕翰撼捍旱憾悍焊汗漢夯杭航壕嚎豪毫郝好耗號浩呵喝荷菏核禾和何合盒貉閡河涸赫褐鶴賀嘿黑痕很狠恨哼亨橫衡恒轟哄烘虹鴻洪宏弘紅喉侯猴吼厚候後呼乎忽瑚壺葫胡蝴狐糊湖弧虎唬護互滬戶花嘩華猾滑畫劃化話槐徊懷淮壞歡環桓還緩換患喚瘓豢煥渙宦幻荒慌黃磺蝗簧皇凰惶煌晃幌恍謊灰揮輝徽恢蛔回毀悔慧卉惠晦賄穢會燴匯諱誨繪葷昏婚魂渾混豁活夥火獲或惑霍貨禍擊圾基機畸稽積箕肌饑跡激譏雞姬績緝吉極棘輯籍集及急疾汲即嫉級擠幾脊己薊技冀季伎祭劑悸濟寄寂計記既忌際繼紀嘉枷夾佳家加莢頰賈甲鉀假稼價架駕嫁殲監堅尖箋間煎兼肩艱奸緘繭檢柬堿鹼揀撿簡儉剪減薦檻鑒踐賤見鍵箭件健艦劍餞漸濺澗建僵姜將漿江疆蔣槳獎講匠醬降蕉椒礁焦膠交郊澆驕嬌嚼攪鉸矯僥腳狡角餃繳絞剿教酵轎較叫窖揭接皆稭街階截劫節莖睛晶鯨京驚精粳經井警景頸靜境敬鏡徑痙靖竟競凈炯窘揪究糾玖韭久灸九酒廄救舊臼舅咎就疚鞠拘狙疽居駒菊局咀矩舉沮聚拒據巨具距踞鋸俱句懼炬劇捐鵑娟倦眷卷絹撅攫抉掘倔爵桔傑捷睫竭潔結解姐戒藉芥界借介疥誡屆巾筋斤金今津襟緊錦僅謹進靳晉禁近燼浸盡勁荊兢覺決訣絕均菌鈞軍君峻俊竣浚郡駿喀咖卡咯開揩楷凱慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕顆科殼咳可渴克刻客課肯啃墾懇坑吭空恐孔控摳口扣寇枯哭窟苦酷庫褲誇垮挎跨胯塊筷儈快寬款匡筐狂框礦眶曠況虧盔巋窺葵奎魁傀饋愧潰坤昆捆困括擴廓闊垃拉喇蠟臘辣啦萊來賴藍婪欄攔籃闌蘭瀾讕攬覽懶纜爛濫瑯榔狼廊郎朗浪撈勞牢老佬姥酪烙澇勒樂雷鐳蕾磊累儡壘擂肋類淚棱楞冷厘梨犁黎籬貍離漓理李裏鯉禮莉荔吏栗麗厲勵礫歷利傈例俐痢立粒瀝隸力璃哩倆聯蓮連鐮廉憐漣簾斂臉鏈戀煉練糧涼梁粱良兩輛量晾亮諒撩聊僚療燎寥遼潦了撂鐐廖料列裂烈劣獵琳林磷霖臨鄰鱗淋凜賃吝拎玲菱零齡鈴伶羚淩靈陵嶺領另令溜琉榴硫餾留劉瘤流柳六龍聾嚨籠窿隆壟攏隴樓婁摟簍漏陋蘆盧顱廬爐擄鹵虜魯麓碌露路賂鹿潞祿錄陸戮驢呂鋁侶旅履屢縷慮氯律率濾綠巒攣孿灤卵亂掠略掄輪倫侖淪綸論蘿螺羅邏鑼籮騾裸落洛駱絡媽麻瑪碼螞馬罵嘛嗎埋買麥賣邁脈瞞饅蠻滿蔓曼慢漫謾芒茫盲氓忙莽貓茅錨毛矛鉚卯茂冒帽貌貿麽玫枚梅酶黴煤沒眉媒鎂每美昧寐妹媚門悶們萌蒙檬盟錳猛夢孟瞇醚靡糜迷謎彌米秘覓泌蜜密冪棉眠綿冕免勉娩緬面苗描瞄藐秒渺廟妙蔑滅民抿皿敏憫閩明螟鳴銘名命謬摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌謀牟某拇牡畝姆母墓暮幕募慕木目睦牧穆拿哪吶鈉那娜納氖乃奶耐奈南男難囊撓腦惱鬧淖呢餒內嫩能妮霓倪泥尼擬妳匿膩逆溺蔫拈年碾攆撚念娘釀鳥尿捏聶孽嚙鑷鎳涅您檸獰凝寧擰濘牛扭鈕紐膿濃農弄奴努怒女暖虐瘧挪懦糯諾哦歐鷗毆藕嘔偶漚啪趴爬帕怕琶拍排牌徘湃派攀潘盤磐盼畔判叛乓龐旁耪胖拋咆刨炮袍跑泡呸胚培裴賠陪配佩沛噴盆砰抨烹澎彭蓬棚硼篷膨朋鵬捧碰坯砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬篇偏片騙飄漂瓢票撇瞥拼頻貧品聘乒坪蘋萍平憑瓶評屏坡潑頗婆破魄迫粕剖撲鋪仆莆葡菩蒲埔樸圃普浦譜曝瀑期欺棲戚妻七淒漆柒沏其棋奇歧畦崎臍齊旗祈祁騎起豈乞企啟契砌器氣迄棄汽泣訖掐洽牽扡釬鉛千遷簽仟謙乾黔錢鉗前潛遣淺譴塹嵌欠歉槍嗆腔羌墻薔強搶橇鍬敲悄橋瞧喬僑巧鞘撬翹峭俏竅切茄且怯竊欽侵親秦琴勤芹擒禽寢沁青輕氫傾卿清擎晴氰情頃請慶瓊窮秋丘邱球求囚酋泅趨區蛆曲軀屈驅渠取娶齲趣去圈顴權醛泉全痊拳犬券勸缺炔瘸卻鵲榷確雀裙群然燃冉染瓤壤攘嚷讓饒擾繞惹熱壬仁人忍韌任認刃妊紉扔仍日戎茸蓉榮融熔溶容絨冗揉柔肉茹蠕儒孺如辱乳汝入褥軟阮蕊瑞銳閏潤若弱撒灑薩腮鰓塞賽三三傘散桑嗓喪搔騷掃嫂瑟色澀森僧莎砂殺剎沙紗傻啥煞篩曬珊苫杉山刪煽衫閃陜擅贍膳善汕扇繕墑傷商賞晌上尚裳梢捎稍燒芍勺韶少哨邵紹奢賒蛇舌舍赦攝射懾涉社設砷申呻伸身深娠紳神沈審嬸甚腎慎滲聲生甥牲升繩省盛剩勝聖師失獅施濕詩屍虱十石拾時什食蝕實識史矢使屎駛始式示士世柿事拭誓逝勢是嗜噬適仕侍釋飾氏市恃室視試收手首守壽授售受瘦獸蔬樞梳殊抒輸叔舒淑疏書贖孰熟薯暑曙署蜀黍鼠屬術述樹束戍豎墅庶數漱恕刷耍摔衰甩帥栓拴霜雙爽誰水睡稅吮瞬順舜說碩朔爍斯撕嘶思私司絲死肆寺嗣四伺似飼巳松聳慫頌送宋訟誦搜艘擻嗽蘇酥俗素速粟僳塑溯宿訴肅酸蒜算雖隋隨綏髓碎歲穗遂隧祟孫損筍蓑梭唆縮瑣索鎖所塌他它她塔獺撻蹋踏胎苔擡臺泰酞太態汰坍攤貪癱灘壇檀痰潭譚談坦毯袒碳探嘆炭湯塘搪堂棠膛唐糖倘躺淌趟燙掏濤滔絳萄桃逃淘陶討套特藤騰疼謄梯剔踢銻提題蹄啼體替嚏惕涕剃屜天添填田甜恬舔腆挑條迢眺跳貼鐵帖廳聽烴汀廷停亭庭挺艇通桐酮瞳同銅彤童桶捅筒統痛偷投頭透凸禿突圖徒途塗屠土吐兔湍團推頹腿蛻褪退吞屯臀拖托脫鴕陀馱駝橢妥拓唾挖哇蛙窪娃瓦襪歪外豌彎灣玩頑丸烷完碗挽晚皖惋宛婉萬腕汪王亡枉網往旺望忘妄威巍微危韋違桅圍唯惟為濰維葦萎委偉偽尾緯未蔚味畏胃餵魏位渭謂尉慰衛瘟溫蚊文聞紋吻穩紊問嗡翁甕撾蝸渦窩我斡臥握沃巫嗚鎢烏汙誣屋無蕪梧吾吳毋武五捂午舞伍侮塢戊霧晤物勿務悟誤昔熙析西硒矽晰嘻吸錫犧稀息希悉膝夕惜熄烯溪汐犀檄襲席習媳喜銑洗系隙戲細瞎蝦匣霞轄暇峽俠狹下廈夏嚇掀鍁先仙鮮纖鹹賢銜舷閑涎弦嫌顯險現獻縣腺餡羨憲陷限線相廂鑲香箱襄湘鄉翔祥詳想響享項巷橡像向象蕭硝霄削哮囂銷消宵淆曉小孝校肖嘯笑效楔些歇蠍鞋協挾攜邪斜脅諧寫械卸蟹懈泄瀉謝屑薪芯鋅欣辛新忻心信釁星腥猩惺興刑型形邢行醒幸杏性姓兄兇胸匈洶雄熊休修羞朽嗅銹秀袖繡墟戌需虛噓須徐許蓄酗敘旭序畜恤絮婿緒續軒喧宣懸旋玄選癬眩絢靴薛學穴雪血勛熏循旬詢尋馴巡殉汛訓訊遜迅壓押鴉鴨呀丫芽牙蚜崖衙涯雅啞亞訝焉咽閹煙淹鹽嚴研蜒巖延言顏閻炎沿奄掩眼衍演艷堰燕厭硯雁唁彥焰宴諺驗殃央鴦秧楊揚佯瘍羊洋陽氧仰癢養樣漾邀腰妖瑤搖堯遙窯謠姚咬舀藥要耀椰噎耶爺野冶也頁掖業葉曳腋夜液壹壹醫揖銥依伊衣頤夷遺移儀胰疑沂宜姨彜椅蟻倚已乙矣以藝抑易邑屹億役臆逸肄疫亦裔意毅憶義益溢詣議誼譯異翼翌繹茵蔭因殷音陰姻吟銀淫寅飲尹引隱印英櫻嬰鷹應纓瑩螢營熒蠅迎贏盈影穎硬映喲擁傭臃癰庸雍踴蛹詠泳湧永恿勇用幽優悠憂尤由郵鈾猶油遊酉有友右佑釉誘又幼迂淤於盂榆虞愚輿餘俞逾魚愉渝漁隅予娛雨與嶼禹宇語羽玉域芋郁籲遇喻峪禦愈欲獄育譽浴寓裕預豫馭鴛淵冤元垣袁原援轅園員圓猿源緣遠苑願怨院曰約越躍鑰嶽粵月悅閱耘雲鄖勻隕允運蘊醞暈韻孕匝砸雜栽哉災宰載再在咱攢暫贊贓臟葬遭糟鑿藻棗早澡蚤躁噪造皂竈燥責擇則澤賊怎增憎曾贈紮喳渣劄軋鍘閘眨柵榨咋乍炸詐摘齋宅窄債寨瞻氈詹粘沾盞斬輾嶄展蘸棧占戰站湛綻樟章彰漳張掌漲杖丈帳賬仗脹瘴障招昭找沼趙照罩兆肇召遮折哲蟄轍者鍺蔗這浙珍斟真甄砧臻貞針偵枕疹診震振鎮陣蒸掙睜征猙爭怔整拯正政幀癥鄭證芝枝支吱蜘知肢脂汁之織職直植殖執值侄址指止趾只旨紙誌摯擲至致置幟峙制智秩稚質炙痔滯治窒中盅忠鐘衷終種腫重仲眾舟周州洲謅粥軸肘帚咒皺宙晝驟珠株蛛朱豬諸誅逐竹燭煮拄矚囑主著柱助蛀貯鑄築住註祝駐抓爪拽專磚轉撰賺篆樁莊裝妝撞壯狀椎錐追贅墜綴諄準捉拙卓桌琢茁酌啄著灼濁茲咨資姿滋淄孜紫仔籽滓子自漬字鬃棕蹤宗綜總縱鄒走奏揍租足卒族祖詛阻組鉆纂嘴醉最罪尊遵昨左佐柞做作坐座錒噯嬡璦曖靄諳銨鵪媼驁鰲鈀唄鈑鴇齙鵯賁錛蓽嗶潷鉍篳蹕芐緶籩驃颮飆鏢鑣鰾儐繽檳殯臏鑌髕鬢稟餑鈸鵓鈽驂黲惻鍤儕釵囅諂讖蕆懺嬋驏覘禪鐔倀萇悵閶鯧硨傖諶櫬磣齔棖檉鋮鐺飭鴟銃儔幬讎芻絀躕釧愴綞鶉輟齪鶿蓯驄樅輳攛銼鹺噠韃駘紿殫賧癉簞讜碭襠燾鐙糴詆諦綈覿鏑巔鈿癲銚鯛鰈鋌銩崠鶇竇瀆櫝牘篤黷籪懟鐓燉躉鐸諤堊閼軛鋨鍔鶚顎顓鱷誒邇鉺鴯鮞鈁魴緋鐨鯡僨灃鳧駙紱紼賻麩鮒鰒釓賅尷搟紺戇睪誥縞鋯紇鎘潁亙賡綆鯁詬緱覯詁轂鈷錮鴣鵠鶻鴰摑詿摜鸛鰥獷匭劌媯檜鮭鱖袞緄鯀堝咼幗槨蟈鉿闞絎頡灝顥訶闔蠣黌訌葒閎鱟滸鶘驊樺鏵奐繯鍰鯇鰉詼薈噦澮繢琿暉諢餛閽鈥鑊訐詰薺嘰嚌驥璣覬齏磯羈蠆躋霽鱭鯽郟浹鋏鎵蟯諫縑戔戩瞼鶼筧鰹韉絳韁撟嶠鷦鮫癤頜鮚巹藎饉縉贐覲剄涇逕弳脛靚鬮鳩鷲詎屨櫸颶鉅鋦窶齟錈鐫雋譎玨皸剴塏愾愷鎧鍇龕閌鈧銬騍緙軻鈳錁頷齦鏗嚳鄶噲膾獪髖誆誑鄺壙纊貺匱蕢憒聵簣閫錕鯤蠐崍徠淶瀨賚睞錸癩籟嵐欖斕鑭襤閬鋃嘮嶗銠鐒癆鰳誄縲儷酈壢藶蒞蘺嚦邐驪縭櫪櫟轢礪鋰鸝癘糲躒靂鱺鱧蘞奩瀲璉殮褳襝鰱魎繚釕鷯藺廩檁轔躪綾欞蟶鯪瀏騮綹鎦鷚蘢瀧瓏櫳朧礱僂蔞嘍嶁鏤瘺耬螻髏壚擼嚕閭瀘淥櫨櫓轤輅轆氌臚鸕鷺艫鱸臠孌欒鸞鑾圇犖玀濼欏腡鏍櫚褸鋝嘸嘜嬤榪勱縵鏝顙鰻麼捫燜懣鍆羋謐獼禰澠靦黽緲繆閔緡謨驀饃歿鏌鉬鐃訥鈮鯢輦鯰蔦裊隉蘗囁顢躡苧嚀聹儂噥駑釹儺謳慪甌蹣皰轡紕羆鈹諞駢縹嬪釙鏷鐠蘄騏綺榿磧頎頏鰭僉蕁慳騫繾槧鈐嬙檣戧熗錆鏘鏹羥蹌誚譙蕎繰磽蹺愜鍥篋鋟撳鯖煢蛺巰賕蟣鰍詘嶇闃覷鴝詮綣輇銓闋闕愨蕘嬈橈飪軔嶸蠑縟銣顰蜆颯毿糝繅嗇銫穡鎩鯊釃訕姍騸釤鱔坰殤觴厙灄畬詵諗瀋謚塒蒔弒軾貰鈰鰣綬攄紓閂鑠廝駟緦鍶鷥藪餿颼鎪謖穌誶蓀猻嗩脧闥鉈鰨鈦鮐曇鉭錟頇儻餳鐋鏜韜鋱緹鵜闐糶齠鰷慟鈄釷摶飩籜鼉媧膃紈綰輞諉幃闈溈潿瑋韙煒鮪閿萵齷鄔廡憮嫵騖鵡鶩餼鬩璽覡硤莧薟蘚峴獫嫻鷴癇蠔秈躚薌餉驤緗饗嘵瀟驍綃梟簫褻擷紲纈陘滎饈鵂詡頊諼鉉鏇謔澩鱈塤潯鱘埡婭椏氬厴贗儼兗讞懨閆釅魘饜鼴煬軺鷂鰩靨謁鄴曄燁詒囈嶧飴懌驛縊軼貽釔鎰鐿瘞艤銦癮塋鶯縈鎣攖嚶瀅瀠瓔鸚癭頦罌鏞蕕銪魷傴俁諛諭蕷崳飫閾嫗紆覦歟鈺鵒鷸齬櫞鳶黿鉞鄆蕓惲慍紜韞殞氳瓚趲鏨駔賾嘖幘簀譖繒譫詔釗謫輒鷓湞縝楨軫賑禎鴆諍崢鉦錚箏騭櫛梔軹輊贄鷙螄縶躓躑觶鍾紂縐佇櫧銖囀饌顳騅縋諑鐲諮緇輜貲眥錙齜鯔傯諏騶鯫鏃纘躦鱒訁譾郤猛氹阪壟堖垵墊檾蕒葤蓧蒓菇槁摣咤唚哢噝噅撅劈謔襆嶴脊仿僥獁麅餘餷饊饢楞怵懍爿漵灩混濫瀦淡寧糸絝緔瑉梘棬案橰櫫軲軤賫膁腖飈糊煆溜湣渺碸滾瞘鈈鉕鋣銱鋥鋶鐦鐧鍩鍀鍃錇鎄鎇鎿鐝鑥鑹鑔穭鶓鶥鸌癧屙瘂臒襇繈耮顬蟎麯鮁鮃鮎鯗鯝鯴鱝鯿鰠鰵鱅鞽韝齇';
          }

          return function(cc,flag){
              if(!flag){
                  var str = '', ss = JTPYStr(), tt = FTPYStr();
                  for (var i = 0; i < cc.length; i++) {
                      if (cc.charCodeAt(i) > 10000 && tt.indexOf(cc.charAt(i)) != -1)str += ss.charAt(tt.indexOf(cc.charAt(i)));
                      else str += cc.charAt(i);
                  }
                  return str;
              }else{
                  var str = '', ss = JTPYStr(), tt = FTPYStr();
                  for (var i = 0; i < cc.length; i++) {
                      if (cc.charCodeAt(i) > 10000 && ss.indexOf(cc.charAt(i)) != -1)str += tt.charAt(ss.indexOf(cc.charAt(i)));
                      else str += cc.charAt(i);
                  }
                  return str;
              }

          }

      })


      .factory('consumptionSms', ['user', function (user) {

            // 生成酒店内容
            var hotel = function (model) {

                //判断是否为续租
                var isContract = function (sms_id) {

                    // 续租的Sms.id集合
                    var contracts = [
                        //MGM
                        "1B5F3E3129DE3794E0539715A8C06FEC",
                        //葡京
                        "1B5F3E3129E13794E0539715A8C06FEC",
                        //鉅星百盈榮昌
                        "1B5F3E3129E53794E0539715A8C06FEC",
                        "1B5F3E3129E43794E0539715A8C06FEC",
                        "1B5F3E3129E43794E0539715A8C06FEC",
                        //永利
                        "1B5F3E3129DA3794E0539715A8C06FEC",
                        "1B5F3E3129D93794E0539715A8C06FEC",
                        "1B5F3E3129D83794E0539715A8C06FEC",
                        "1B5F3E3129D73794E0539715A8C06FEC"];

                    if (_.indexOf(contracts, sms_id) == -1) {
                        return false;
                    } else {
                        return true;
                    }
                };

                var content = isContract(model.sms.id) ? "《長城續房信息》\n" : "《長城新房信息》\n";

                // 永利
                if (model.sms.hall_id == "03A665B512C5621BE0539715A8C03C44") {
                    content += "永利鉅星房務部通知：\n";

                    content += "閣下用戶口：" + model.agent_code + " " + model.agent_name + ",";

                    if (!isContract(model.sms.id)) {
                        content += "所訂的房間已經辦妥，房間為" + model.hotel + "/" + model.room_type + "，" + model.count + "間" + model.days + "晚。\n";
                        content += "入住日期為 " + model.in_date + " \n";
                    }
                    else {
                        content += "房間為" + model.hotel + "/" + model.room_type + "，房間號碼 " + model.room_number + " 已續。\n";
                        content += "續住日期為 " + model.in_date + " \n";
                    }
                    content += "退房日期為 " + model.out_date + " 中午12時正\n";
                    content += "確認號為 #" + model.book_no + "\n";
                    content += "備註: " + model.sms.remark;
                }
                // MGM
                else if (model.sms.hall_id == "03A665B512BC621BE0539715A8C03C44") {
                    content += "美高梅鉅星客戶服務部通知：\n";
                    content += "閣下用戶口：" + model.agent_code + " " + model.agent_name + ",";

                    if (!isContract(model.sms.id)) {
                        content += "成功預訂" + model.hotel + "/" + model.room_type + "，" + model.count + "間" + model.days + "晚。\n";
                        content += "入住日期為 " + model.in_date + " \n";
                    }
                    else {
                        content += "成功續房，房間號碼 " + model.room_number + " \n";
                        content += "續住日期為 " + model.in_date + " \n";
                    }
                    content += "退房日期為 " + model.out_date + " 中午12時正\n";
                    content += "備註: " + model.sms.remark;
                }
                //新葡京
                else if (model.sms.hall_id == "03A665B512BF621BE0539715A8C03C44") {

                    content += "新葡京鉅星服務部通知：\n";
                    content += "閣下用戶口：" + model.agent_code + " " + model.agent_name + ",";

                    if (!isContract(model.sms.id)) {
                        content += "所訂的房間已經辦妥,房間為" + model.hotel + "/" + model.room_type + "，" + model.count + "間" + model.days + "晚。\n";
                        content += "入住日期為 " + model.in_date + " \n";
                    }
                    else {
                        content += "房間號碼 " + model.room_number + " 已經續妥,房間為" + model.hotel + "，" + model.count + "間" + model.days + "晚。\n";
                        content += "續住日期為 " + model.in_date + " \n";
                    }
                    content += "退房日期為 " + model.out_date + " 中午12時正\n";

                    if (!isContract(model.sms.id)) {
                        var money = model.days * 1000;
                        content += "備註: " + model.sms.remark.replace("%s", "$" + money);
                    } else {
                        content += "備註: " + model.sms.remark;
                    }
                }
                // 银河
                else if (model.sms.hall_id == "03A665B512C8621BE0539715A8C03C44") {
                    content += "鉅星百盈榮昌客戶服務部通知：\n";
                    content += "閣下用戶口：" + model.agent_code + " " + model.agent_name + ",";

                    if (!isContract(model.sms.id))
                        content += "所訂的房間已經辦妥,房間為" + model.hotel + "/" + model.room_type + "，" + model.count + "間" + model.days + "晚。\n";
                    else
                        content += "房間為" + model.hotel + "/" + model.room_type + "，房間號碼" + model.room_number + "已續 \n";

                    content += "入住日期為 " + model.in_date + " \n";
                    content += "退房日期為 " + model.out_date + " 中午12時正\n";
                    content += "訂房單號:" + model.book_no + "，登記人：" + model.booker;

                    if (model.sms.id != "1B5F3E3129E33794E0539715A8C06FEC") {
                        content += "\n";
                    }
                    else {
                        content += ", 憑登記人名到酒店前台辦理入住\n"
                    }
                    content += "備註: " + model.sms.remark;
                }
                return content;
            };

            // 生成食飞内容
            var food = function (model) {

                var content = "長城國際服務部通知閣下所訂的 " + model.restaurant + " 已訂好\n" +
                    "戶口：" + model.agent_code + "\n" +
                    "日期：" + model.shift_date + "\n" +
                    "時間：" + model.time + "\n" +
                    "人數：" + model.count + "\n" +
                    "留名：" + model.name + "\n" +
                    "留電話：" + model.tel + "\n" +
                    "如有任何查詢，可致電：853 62055555 長城國際總機，謝謝！";

                return "";
            };

            // 生成直升机内容
            var helicopter = function (model) {

                var content;

                content = "長城國際服務部通知閣下所訂的直升機已訂好：\n" +
                    "戶口: " + model.agent_code + "\n" +
                    "行程: " + model.trip + "\n" +
                    "日期: " + model.setout_date + "\n" +
                    "時間: " + model.trip_time + "\n";

                _.each(model.peoples, function (ele) {
                    content += ("客人: " + ele.passenger + "\n" + "証件: " + ele.idcard_no + "\n");
                });

                content += "如有任何查詢，可致電：+853 62055555 長城國際客戶服務部，謝謝！";

                return content;

            };

            // 生成船票内容
            var ship = function (model) {

                var content;

                if (model.select_sms_type == 1)
                    content = "長城國際服務部通知閣下所訂的船票已訂好(澳門取票)：\n";
                else if (model.select_sms_type == 2)
                    content = "長城國際服務部通知閣下所訂的船票已訂好(香港取票)：\n";
                else
                    content = "長城國際服務部通知閣下所訂的船票已訂好：\n";
                content += ("戶口: " + model.agent_code + "\n");

                _.each(model.trips, function (ele) {

                    content += (
                    "出發日期: " + ele.departure_date + "\n" +
                    "出發時間: " + ele.departure_time + "\n" +
                    "行程: " + ele.boatCity + "\n" +
                    "張數: " + ele.ticket_count + "\n" +
                    "艙位: " + ele.trip_seat + "\n");
                    if (model.trips.length != 1)
                        content += "\n";
                });


                if (model.select_sms_type == 1) {
                    content += '取票地點: ' + user.hall.hall_name + '"服務部取" \n';
                } else if (model.select_sms_type == 2) {
                    content += "取票人: " + model.people + "\n";
                    content += '取票地點: 香港上環碼頭蘭桂芳/太陽城服務部 \n';
                } else {
                    content += "取票人: " + model.people + "\n";
                    content += '取票地點: ' + user.hall.hall_name + '"服務部取" \n';
                }
                content += "如有任何查詢，可致電：+853 62055555 長城國際客戶服務部，謝謝！";

                return content;
            };

            // 生成机票内容
            var air = function (model) {

                var content;

                content = "長城國際服務部通知閣下所訂的機票已訂好:\n" +
                    "戶口: " + model.agent_code + "\n" +
                    "日期: " + model.departure_date + "\n" +
                    "時間: " + model.departure_time + "\n" +
                    "行程: " + model.from_place + "-" + model.to_place + "\n" +
                    "航班: " + model.flight_no + "\n" +
                    "艙位: " + model.seat_type + "\n";

                content += "票號: " + model.ticket_no + "\n";

                if (model.is_return) {
                    content += ("\n回程\n" +
                    "日期: " + model.returns.departure_date + "\n" +
                    "時間: " + model.returns.departure_time + "\n" +
                    "行程: " + model.returns.from_place + "-" + model.returns.to_place + "\n" +
                    "航班: " + model.returns.flight_no + "\n" +
                    "艙位: " + model.returns.seat_type + "\n");
                    content += "票號: " + model.returns.ticket_no + "\n";
                }

                _.each(model.peoples, function (ele) {
                    content += ("客人: " + ele.passenger + "\n" + "證件: " + ele.idcard_no + "\n");
                });

                content += "如有任何查詢，可致電：+853 62055555長城國際客戶服務部，謝謝！";

                return content;

            };

            // 生成车票内容
            var car = function (model) {

                var content;

                content = "尊貴的:" + model.agent_name + "(小姐/先生)\n" +
                    "來自長城國際車務部通知\n" +
                    "客人名稱: " + model.guest_name + "\n" +
                    "聯繫電話: " + model.guest_tel + "\n\n" +
                    "出發日期: " + model.departure_date + "\n" +
                    "接車時間: " + model.departure_time + "\n" +
                    "行駛路線: " + model.trip + "\n" +
                    "車牌號碼: " + model.car_number + "\n" +
                    "預定車型: " + model.car_type + "\n\n" +
                    "(溫馨提示：最多坐6人，避免超載。海關規定如過關須下車時客人須隨身攜帶自身行李檢查過關）\n" +
                    "司機電話: \n" +
                    "訂單編號: " + model.book_no + "\n" +
                    "經辦員工: " + model.coordinator + "\n" +
                    "服務熱線: +853-28501066\n" +
                    "備注說明: \n" +
                    "感謝您的支持，謝謝!";
                //+model.remark+"\n

                return content;

            };

            // 生成门票内容
            var ticket = function (model) {

                var content = "長城國際服務部通知閣下所訂的門票已訂好:\n" +
                    "戶口: " + model.agent_code + "\n" +
                    "類型: " + model.ticket_type + "\n" +
                    "日期: " + model.show_date + "\n" +
                    "時間: " + model.show_time + "\n" +
                    "坐位: " + model.site + "\n" +
                    "張數: " + model.count + "\n" +
                    "如有任何查詢，可致電：+853 62055555長城國際客戶服務部，謝謝！";

                return content;

            };

            return {

                create: function (Model) {
                    var m = angular.copy(Model);

                    var result, type = m.send_time;

                    switch (type) {
                        case "hotel"      :
                            result = hotel(m);
                            break;
                        case "food"       :
                            result = food(m);
                            break;
                        case "helicopter" :
                            result = helicopter(m);
                            break;
                        case "ship"       :
                            result = ship(m);
                            break;
                        case "air"        :
                            result = air(m);
                            break;
                        case "car"        :
                            result = car(m);
                            break;
                        case "ticket"     :
                            result = ticket(m);
                            break;
                    }

                    return result ? result : "";
                }

            }


        }]).controller('normalSmsCtrl', ['$scope', 'breadcrumb', 'topAlert', '$stateParams', 'globalFunction', '$modal', 'smsGroup', 'agentsLists', 'smsRecord', 'areaCode', 'ConsumptionSmsTemp', 'consumptionSms', '$state', '$filter',
            function ($scope, breadcrumb, topAlert, $stateParams, globalFunction, $modal, smsGroup, agentsLists, smsRecord, areaCode, ConsumptionSmsTemp, consumptionSms, $state, $filter) {
                breadcrumb.items = [
                    {"name": "新增消費SMS", "active": true}
                ];


                //=========發送SMS==========
                $scope.agent_info_id = $stateParams.agent_info_id;
                //發送短信
                var init_record = {
                    "pin_code": "",
                    "sms_type": "1",
                    "priority": "1",
                    "is_sys": "0",
                    "content": "",
                    "phoneNumbers": [
                        {
                            "agent_code": "",
                            "area_code": "",
                            "telephone_number": ""
                        }
                    ]
                }
                $scope.record_create = angular.copy(init_record);

                $scope.areaCodes = areaCode.query();

                var return_plate = "other";

                var sms_info;

                if (ConsumptionSmsTemp.model) {
                    if (ConsumptionSmsTemp.model.send_time == "hotel") {
                        if (ConsumptionSmsTemp.model.isHasSms == false) {
                            $scope.record_create.content = "";
                        } else {
                            $scope.record_create.content = consumptionSms.create(ConsumptionSmsTemp.model);
                        }
                    }
                    else {
                        $scope.record_create.content = consumptionSms.create(ConsumptionSmsTemp.model);
                    }
                    sms_info = angular.copy(ConsumptionSmsTemp.model);
                    return_plate = ConsumptionSmsTemp.model.send_time;
                    ConsumptionSmsTemp.destroy();
                }

                $scope.agentSmsNotice = [];
                /*agentsLists.agentSmsNotice({agent_info_id: $scope.agent_info_id, type_code:'CONSUMPTION'*/
                /*, is_master : 1*/
                /*})
                 .$promise.then(function(phoneNumbers){
                 $scope.agentSmsNotice = phoneNumbers;
                 });*/

                //強制通知人(戶組)
                /*agentsLists.get(globalFunction.generateUrlParams({id: agent_info_id}, {refTelAgentMasterNoticeType: {agentContactTel: ''}}))
                 .$promise.then(function (agent) {
                 if (agent) {
                 $scope.agentSmsNotice = [];
                 if (agent.refTelAgentMasterNoticeType.length > 0) {
                 _.each(agent.refTelAgentMasterNoticeType, function (_tel) {
                 $scope.agentSmsNotice.push({agent_code: agent.agent_code, agent_name: agent.agent_name, area_code:_tel.agentContactTel.area_code, telephone_number:  _tel.agentContactTel.telephone_number});
                 });
                 }
                 }
                 });*/

                //刪除強制發送人
                $scope.removeSmsNotice = function (index) {
                    $scope.agentSmsNotice.splice(index, 1);
                }

                //初始化列表數據
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

                $scope.tel_records = [];

                var pushBooker = function () {

                    if (sms_info && sms_info.notify) {
                        if (sms_info.notify.trader_tel) {
                            if (sms_info.notify.trader_tel != null && sms_info.notify.trader_tel != "") {
                                areaCode.query().$promise.then(function (data) {
                                    var area_code = $filter("filter")(data, {"id": sms_info.notify.area_code_id})[0].area_code;
                                    var temp = {
                                        agent_code: sms_info.notify.agent_code,
                                        agent_name: sms_info.notify.agent_name,
                                        area_code: area_code,
                                        area_code_id: sms_info.notify.area_code_id,
                                        telephone_number: sms_info.notify.trader_tel
                                    };
                                    $scope.isHiddenCode = true;
                                    $scope.tel_records.push(temp);
                                })
                            }
                        }
                    }

                };

                var searchAgentSmsNotice = function (agent_info_id) {
                    agentsLists.query(globalFunction.generateUrlParams({agent_code: agent_info_id}, {refTelAgentMasterNoticeType: {agentContactTel: ''}}))
                        .$promise.then(function (agents) {
                            if (agents[0]) {

                                var temp = {
                                    agent_code: agents[0].agent_code,
                                    agent_name: agents[0].agent_name,
                                    isSystemFlag: "",
                                    telephone_number: ""
                                };

                                if (agents[0].refTelAgentMasterNoticeType.length > 0) {
                                    $scope.isHiddenCode = true;
                                    temp.isSystemFlag = agents[0].refTelAgentMasterNoticeType.length > 0 ? true : false;
                                    $scope.agentTels = agents[0].refTelAgentMasterNoticeType;
                                    $scope.telephone_number_content = [];
                                    _.each(agents[0].refTelAgentMasterNoticeType, function (_tel, index) {
                                        if (_tel.notice_type != 2) {
                                            $scope.telephone_number_content.push(_tel.agentContactTel.area_code + "-" + _tel.agentContactTel.telephone_number);
                                        } else {
                                            delete agents[0].refTelAgentMasterNoticeType[index];
                                        }
                                    });
                                    if ($scope.telephone_number_content.length != 0) {
                                        temp.telephone_number = $scope.telephone_number_content.join(',');
                                        $scope.tel_records.push(temp);
                                    }
                                } else {
                                    $scope.isHiddenCode = true;
                                    if (agents[0].refTelAgentMasterNoticeType[0].notice_type != 2) {
                                        temp.telephone_number = agents[0].refTelAgentMasterNoticeType[0].agentContactTel.area_code + "-" + agents[0].refTelAgentMasterNoticeType[0].agentContactTel.telephone_number;
                                        $scope.tel_records.push(temp);
                                    } else {
                                        delete agents[0].refTelAgentMasterNoticeType[0];
                                    }
                                }
                                pushBooker();
                            }
                        });
                };


                //通過戶口查詢
                $scope.isHiddenCode = false;
                $scope.agent_watch = function () {
                    $scope.tel_records = [];
                    if ($scope.new_record.keyword) {
                        agentsLists.query(globalFunction.generateUrlParams({agent_code: $scope.new_record.keyword}, {refTelAgentMasterNoticeType: {agentContactTel: ''}}))
                            .$promise.then(function (agents) {
                                if (agents[0]) {

                                    var temp = {
                                        agent_code: agents[0].agent_code,
                                        agent_name: agents[0].agent_name,
                                        isSystemFlag: "",
                                        telephone_number: ""
                                    };

                                    if (agents[0].refTelAgentMasterNoticeType.length > 0) {
                                        $scope.isHiddenCode = true;
                                        temp.isSystemFlag = agents[0].refTelAgentMasterNoticeType.length > 0 ? true : false;
                                        $scope.agentTels = agents[0].refTelAgentMasterNoticeType;
                                        $scope.telephone_number_content = [];
                                        _.each(agents[0].refTelAgentMasterNoticeType, function (_tel, index) {
                                            if (_tel.notice_type != 2) {
                                                $scope.telephone_number_content.push(_tel.agentContactTel.area_code + "-" + _tel.agentContactTel.telephone_number);
                                            } else {
                                                delete agents[0].refTelAgentMasterNoticeType[index];
                                            }
                                        });
                                        if ($scope.telephone_number_content.length != 0) {
                                            temp.telephone_number = $scope.telephone_number_content.join(',');
                                            $scope.tel_records.push(temp);
                                        }
                                    } else {
                                        $scope.isHiddenCode = true;
                                        if (agents[0].refTelAgentMasterNoticeType[0].notice_type != 2) {
                                            temp.telephone_number = agents[0].refTelAgentMasterNoticeType[0].agentContactTel.area_code + "-" + agents[0].refTelAgentMasterNoticeType[0].agentContactTel.telephone_number;
                                            $scope.tel_records.push(temp);
                                        } else {
                                            delete agents[0].refTelAgentMasterNoticeType[0];
                                        }
                                    }
                                    //pushBooker();
                                }
                            });
                    }
                }

                //手動新增的號碼
                //$scope.tel_content_new = [];
                $scope.addTel = function (tel_record) {
                    $scope.tel_record_copy = angular.copy(tel_record);
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
                    //$scope.isHiddenCode = false;
                }

                sms_info ? searchAgentSmsNotice(sms_info.agent_code) : "";

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

                //發送SMS
                $scope.send_sms_url = globalFunction.getApiUrl('sms/smsrecord');
                $scope.submit = function () {
                    if ($scope.isDisabled) {
                        return $scope.isDisabled;
                    }
                    $scope.isDisabled = true;

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

                    if ($scope.phoneNumbers.length == 0) {
                        topAlert.warning("請選擇要發送到的號碼");
                        $scope.isDisabled = false;
                        return;
                    }

                    //普通發送
                    $scope.record_create.phoneNumbers = $scope.phoneNumbers;
                    $scope.record_create.type = "42";
                    $scope.form_send_sms.checkValidity().then(function () {
                        smsRecord.save($scope.record_create).$promise.then(function () {
                            topAlert.success('信息發送成功');
                            $scope.cancel();
                            $scope.empty();
                            $state.go("consumption-manager", {types: return_plate});
//                        $scope.close();
                            $scope.isDisabled = false;
                        }, function () {
                            $scope.isDisabled = false;
                        });
                    });
                };

                $scope.callBack = function () {
                    $state.go("consumption-manager", {types: return_plate});
                };

                //常用短信模板
                $scope.smsTemplateOpen = function () {
                    var smsModal;
                    smsModal = $modal.open({
                        templateUrl: "views/sms-manager/sms-template-window.html",
                        controller: 'smsTemplateWindowCtrl',
                        windowClass: 'md-modal'
                        /*resolve: {
                         user_data : function(){
                         return $scope.user;
                         }
                         }*/
                    });

                    smsModal.result.then(function (result) {
                        $scope.record_create.department_id = result.department_id;
                        $scope.record_create.content = result.content;
                    });
                }

                /*$scope.close = function(){
                 $modalInstance.close();
                 }*/
                $scope.empty = function () {
                    $scope.new_record.keyword = "";
                    $scope.tel_record = angular.copy(init_tel_record);

                }

                $scope.cancel = function () {
                    /*if($scope.record_create.sms_type==1){

                     }else if($scope.record_create.sms_type==2){

                     }*/
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
                }

            }]).factory('getDays', function () {
            return function (strDateStart, strDateEnd) {
                var strSeparator = "-"; //日期分隔符
                var oDate1;
                var oDate2;
                var iDays;
                oDate1 = strDateStart.split(strSeparator);
                oDate2 = strDateEnd.split(strSeparator);
                var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
                var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
                iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24)//把相差的毫秒数转换为天数
                return iDays;
            }
        }).service('qzPrinter', ['$q', '$window', 'globalFunction', 'globalConfig', 'printerType', 'topAlert', 'currentMachine', '$timeout',
            function ($q, $window, globalFunction, globalConfig, printerType, topAlert, currentMachine, $timeout) {
                this.findPrinters = function () {
                    var deferred = $q.defer();
                    $window.parent.findPrinters(function (printers) {
                        deferred.resolve(printers);
                    }, function (errMsg) {
                        topAlert.warning(errMsg);
                        deferred.reject(errMsg);
                    });
                    return deferred.promise;
                }
                this.print = function (channelType, printer_type, params, is_landscape) {
                    //根据打印机类型查看当前计算机是否配置了该类型的打印机，沒有則提示錯誤
                    is_landscape = is_landscape === true ? true : false;
                    printer_type = printer_type == "" ? printerType.laserPrinter : printer_type;
                    var printer = currentMachine.get(printer_type);
                    var deferred = $q.defer();
                    /*******************/
                    //临时禁用列印功能，列印功能上production后，可刪除該段代碼
                    /* $timeout(function(){
                     var errMsg = '打印失敗、打印功能暫未開放！';
                     topAlert.warning(errMsg);
                     deferred.reject(errMsg);
                     },10)
                     return deferred.promise;*/
                    /*******************/
                    if (!printer) {
                        $timeout(function () {
                            var errMsg = '打印失敗，當前計算機未配置' + printerType.items[printer_type];
                            topAlert.warning(errMsg);
                            deferred.reject(errMsg);
                        }, 10)
                        return deferred.promise;
                    }

                    params.channelType = channelType;
                    globalFunction.createResource(globalConfig.reportUrl).save(params).$promise.then(function (data) {
                        if (data.link) {
                            //設置打印機，如果查找不到配置的打印機則提示錯誤
                            $window.parent.findPrinter(printer, function (printer) {
                                $window.parent.printPDF(data.link, is_landscape, function () {
                                    deferred.resolve();
                                }, function (errMsg) {
                                    topAlert.warning(errMsg);
                                    deferred.reject(errMsg);
                                });
                            }, function (errMsg) {
                                topAlert.warning(errMsg);
                                deferred.reject(errMsg);
                            })
                        }
                        else {
                            topAlert.warning('獲取打印數據失敗');
                            deferred.reject('獲取打印數據失敗');
                        }

                    }, function () {
                        deferred.reject();
                    });

                    return deferred.promise;
                }
            }]).service('$modalInstance', [function () {


        }]).factory('resubmitInterceptor', ['$q', 'topAlert', 'globalConfig', function ($q, topAlert, globalConfig) {//重复提交
            var last_request = {
                url: '',
                method: '',
                data: null,
                time: 0
            }
            //重复提交拦截器只应用于在此声明的api
            var apply_apis = [
                {method: "POST", url: "mortgage/mortgage/return-m"},
                {method: "POST", url: "deposit/depositcard/transaction"}
            ]
            return {
                'request': function (config) {
                    if (config.method == 'GET') {
                        return config;
                    }
                    ;
                    if (!_.findWhere(apply_apis, {
                            method: config.method,
                            url: config.url.replace(globalConfig.apiUrl, "")
                        }))
                        return config;
                    var now = new Date().getTime();
                    if (last_request.url == config.url
                        && last_request.method == config.method
                        && angular.equals(last_request.data, config.data)
                        && (now - last_request.time) <= 2000 //提交间隔不能低于两秒
                    ) {
                        topAlert.warning('請勿重複提交');
                        return false;
                    } else {
                        last_request.url = config.url;
                        last_request.method = config.method;
                        last_request.data = angular.copy(config.data);
                        last_request.time = now;
                        return config;
                    }

                }
            }
        }]).factory('globalPagination', ['paginationConfig', '$http', '$q', 'globalFunction', function (paginationConfig, $http, $q, globalFunction) {
            return {
                create: function (options) {
                    var pagination = {
                        items_per_page: paginationConfig.itemsPerPage,
                        total_items: 0,
                        total_pages: 0,
                        page: 1,
                        query_method: 'query',
                        resource: null,
                        sort: "",
                        condition: {},
                        fields: {},
                        select: function (page, condition, fields) {
                            if (condition == null)
                                condition = this.condition;
                            if (fields == null)
                                fields = this.fields;
                            condition['page'] = this.page = page ? page : 1;
                            condition['per-page'] = this.items_per_page;
                            var _self = this;
                            if (this.sort)
                                condition.sort = this.sort;
                            else
                                delete condition.sort;
                            return this.resource[_self.query_method](globalFunction.generateUrlParams(condition, fields), function (data, headers) {
                                _self.total_items = headers('X-Pagination-Total-Count');
                                _self.total_pages = headers('X-Pagination-Page-Count');
                            });
                        }
                    }
                    return _.extend(pagination, options);
                }
            }

        }]).factory('uiGridOptions', ['globalPagination', 'paginationConfig', 'user', function (globalPagination, paginationConfig, user) {
            return {
                create: function ($scope, options) {
                    var default_options = {
                        data: 'data',
                        paginationPageSizes: [10, 20, 50, 100],
                        paginationPageSize: paginationConfig.items_per_page,
                        useExternalPagination: true,
                        enableColumnResizing: true,
                        enableGridMenu: true,
                        useExternalSorting: true,
                        enableRowSelection: true,
                        multiSelect: false,
                        enableRowHeaderSelection: false,
                        rowHeight: 42,
                        minRowsToShow: 10,
                        gridApi: 'gridApi',
                        condition: options.condition
                    }

                    var return_options = _.extend(default_options, options);
                    var targetpage
                    return_options.onRegisterApi = function (gridApi) {
                        $scope[return_options.gridApi] = gridApi;

                        if (return_options.useExternalPagination === true) {
                            // $scope[options.data] = options.pagination.select(1, options.condition, {});
                            gridApi.pagination.on.paginationChanged($scope, function (currentPage, pageSize) {

                                options.pagination.items_per_page = pageSize;
                                $scope[options.data] = options.pagination.select(currentPage, return_options.condition, {});
                                targetpage = currentPage
                            });
                            $scope.$watch(function () {
                                return return_options.pagination.total_items
                            }, function (new_value, old_value) {
                                return_options.totalItems = new_value;
                            })
                        }
                        if (return_options.useExternalSorting === true) {
                            gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                                if (sortColumns.length > 0)
                                    options.pagination.sort = sortColumns[0].field + ' ' + sortColumns[0].sort.direction.toUpperCase();
                                else
                                    options.pagination.sort = '';

                                $scope[options.data] = options.pagination.select(targetpage, return_options.condition, {});
                            });
                        }

                        if (return_options.buttonColumn) {
                            var operation_col = {
                                name: '操作',
                                pinnedRight: true,
                                enableColumnResizing: false,
                                enableSorting: false

                            };

                            operation_col = _.extend(operation_col, return_options.buttonColumn);
                            operation_col.cellTemplate = '<div class="ui-grid-cell-contents">';

                            _.each(operation_col.buttons, function (btn) {
                                var btn_str = '<button type="button"';
                                if (btn.click) {
                                    btn_str += ' ng-click="grid.appScope.' + btn.click + '"';
                                }
                                if (btn.class) {
                                    btn_str += ' class="btn btn-' + btn.class + '"';
                                }
                                if (btn.isShow) {
                                    btn_str += ' ng-show="' + btn.isShow + '"';
                                }
                                if (btn.checkPermissions) {
                                    btn_str += ' check-permissions="' + btn.checkPermissions + '"';
                                }
                                btn_str += '>' + btn.title + '</button>';
                                operation_col.cellTemplate += btn_str;
                            })

                            operation_col.cellTemplate += '</div>';
                            return_options.columnDefs.push(operation_col);
                        }

                        if (_.has(options, 'onRegisterApi'))
                            options.onRegisterApi(gridApi);
                    }
                    return_options.initialization = function () {
                        $scope[options.data] = options.pagination.select(1, return_options.condition, {});
                    }
                    return return_options;
                }

            }
        }]).factory('stroke', [function () {//汉字笔画排序

            //对象位置决定排列顺序
            var dictionary = [
                'aA', 'bB', 'cC', 'dD', 'eE', 'fF', 'gG', 'hH', 'iI', 'jJ', 'kK', 'lL', 'mM', 'nN', 'oO', 'pP', 'qQ', 'rR', 'sS', 'tT', 'uU', 'vV', 'wW', 'xX', 'yY', 'zZ'
            ];
            dictionary.push(
                '一丨丶丿乀乁乙乚乛亅',
                '丁丂七丄丅丆丩丷乂乃乄乜九了二亠人亻儿入八冂冖冫几凵刀刁刂力勹匕匚匸十卜卩厂厶又巜廴讠阝',
                '万丈三上下丌个丫丬丸久乆乇么义乊乞也习乡亇亍于亏亐亡亼亽亾亿兀兦凡凢凣刃刄劜勺卂千卄卪卫叉口囗土士夂夊夕大女子孑孒孓宀寸小尢尣尸屮山巛川工己已巳巾干幺广廾弋弓彐彑彡彳忄才氵犭纟艹辶门飞饣马',
                '不与丏丐丑丒专中丮丯丰丹为之乌乢乣乤乥书予云互亓五井亖亢亣什仁仂仃仄仅仆仇仈仉今介仌仍从仏仐仑仒仓允兂元內公六兮兯冃冄内円冇冈冗冘凤凶刅分切刈劝办勻勼勽勾勿匀匁匂化匹区卅卆升午卍卐卝卞卬厃厄厅历厷厸厹及友双反収圠圡壬夨天太夫夬夭孔尐少尤尹尺屯屲巴巿帀币幻廿开弌弔引弖心忆戈戶户戸手扌扎支攴攵文斗斤方无旡日曰月木朩欠止歹歺殳毋毌比毛氏气水火灬爪爫父爻爿片牙牛牜犬王瓦礻禸罓耂肀艺见计订讣认讥贝车辷邒邓长闩阞队韦风',
                '且丕世丗丘丙业丛东丝丱主丼乍乎乏乐乧乬亗仔仕他仗付仙仚仛仜仝仞仟仠仡仢代令以仦仧仨仩仪仫们仭仮仺兄兰冉冊冋册冎写冚冬冭冮冯凥処凧凷凸凹出击刉刊刋刌刍功加务劢匃匄包匆匇北匛匜匝匞卉半卌卟占卡卢卭卮卯厇厈厉厺去厼叏叐发古句另叧叨叩只叫召叭叮可台叱史右叴叵叶号司叹叺叻叼叽叾囙囚四囜圢圣圤圥圦圧壭夃处外夘央夯夰失夲夳头奴奵奶孕宁宂它宄对尒尓尔尕尻尼屳屴屵屶屷左巧巨巪市布帄帅平幼庀庁庂広廵弁弍弗弘归必忇忉忊戉戊戋戹扏扐扑扒打扔払扖斥旦旧曱未末本札朮术朰正母氐民氕氶氷永氹氺氻氾氿汀汁汃汄汅汇汈汉灭犮犯犰玄玉玊玌玍瓜甘生用甩田由甲申甴电疋疒癶白皮皿目矛矢石示礼禾穴立纠罒肊艻艼艽艾艿芀芁节衤讦讧讨让讪讫讬训议讯记讱轧辸边辺辻込辽邔邖邗邘邙邚邛邜邝钅闪阠阡阢阣阤饤饥驭鸟龙',
                '丞丟丠両丢乑乒乓乔乨乩乪乫乭乮乯买争亘亙亚交亥亦产仯仰仱仲仳仴仵件价仸仹任仼份仾仿伀企伂伃伄伅伆伇伈伉伊伋伌伍伎伏伐休伒伓伔伕伖众优伙会伛伜伝伞伟传伡伢伣伤伥伦伧伨伩伪伫伬佢佤充兆兇先光兊全共兲关兴再军农冰冱冲决冴凨凩凪凫凼刎刏刐刑划刓刔刕刖列刘则刚创劣劤劥劦劧动匈匟匠匡匢卋华协印危厊压厌厍厽厾叒叿吀吁吂吃各吅吆吇合吉吊吋同名后吏吐向吒吓吔吕吖吗囘囝回囟因囡团団在圩圪圫圬圭圮圯地圱圲圳圴圵圶圷圸圹场圾壮夅夗夙多夛夵夶夷夸夹夺夻夼奷奸她奺奻奼好奾奿妀妁如妃妄妅妆妇妈孖字存孙宅宆宇守安寺寻导尖尗尘尥尦尧尽屰屸屹屺屻屼屽屾屿岀岁岂岃岋岌州巟巡巩帆帇师年幵并庄庅庆延廷异弎式弐弙弚弛弜当彴彵彶忈忋忏忓忔忕忖忙忚忛忣戌戍戎戏成扗托扙扚扛扜扝扞扟扠扡扢扣扤扥扦执扨扩扪扫扬扱收攷旨早旪旫旬旭旮旯曲曳有朱朲朳朴朵朶朷朸朹机朻朼朽朾朿杀杁杂权次欢此死毎毕氒氖気氘氼氽汆汊汋汌汍汎汏汐汑汒汓汔汕汗汘汙汚汛汜汝江池污汢汣汤汲汷灮灯灰灱灲灳爷牝牞牟犱犲犳犴犵犷犸玎玏玐玑瓧甪甶百癿礽祁穵竹米糸糹纡红纣纤纥约级纨纩纪纫缶网羊羽老考而耒耳聿肉肋肌肍肎臣自至臼舌舛舟艮色艸芃芄芅芆芇芉芊芋芌芍芎芏芐芑芒芓芕芖芗芝芨虍虫血行衣襾西覀观讲讳讴讵讶讷许讹论讻讼讽设访诀贞负贠赱轨达辿迀迁迂迃迄迅迆过迈迉邞邟邠邡邢那邤邥邦邧邨邩邪邬邷钆钇闫闬闭问闯阥阦阧阨阩阪阫阬阭阮阯阰阱防阳阴阵阶页饦饧驮驯驰齐',
                '丣两严串丽乕乱乲乸亊亜亨亩亪伭伮伯估伱伲伳伴伵伶伷伸伹伺伻似伽伾伿佀佁佂佃佄佅但佇佈佉佊佋位低住佐佑佒体佔何佖佗佘余佚佛作佝佞佟你佡佣佥佦佧佨克兌免兎兏児兑兕兵冏冝况冶冷冸冹冺冻凬刜初刞刟删刡刢刣判別刦刧刨利刪别刬刭助努劫劬劭劮劯劰励劲劳労匉匣匤匥医卣卤卲即却卵厎厏厐厑县叓吘吙吚君吜吝吞吟吠吡吢吣吤吥否吧吨吩吪含听吭吮启吰吱吲吳吴吵吶吷吸吹吺吻吼吽吾吿呀呁呂呃呄呅呆呇呈呉告呋呌呍呎呏呐呑呒呓呔呕呖呗员呙呚呛呜咓咞囤囥囦囧囨囩囪囫囬园囮囯困囱囲図围囵圻圼圽圿址坁坂坃坄坅坆均坈坉坊坋坌坍坎坏坐坑坒坓坔坕坖块坘坙坚坛坜坝坞坟坠壯声壱売壳夆夋夽夾夿奀奁奂奆妉妊妋妌妍妎妏妐妑妒妓妔妕妖妗妘妙妚妛妜妝妞妟妠妡妢妣妤妥妦妧妨妩妪妫姂姉姊姒姖孚孛孜孝孞宊宋完宍宎宏宐宑宒寽対寿尨尩尪尫尬尾尿局屁层屃岄岅岆岇岈岉岊岍岎岏岐岑岒岓岔岕岖岗岘岙岚岛岜岠巠巵帉帊帋希帍帎帏帐庇庈庉床庋庌庍庎序庐庑庒库应廸廹弃弄弅弝弞弟张弡形彣彤彷彸役彺彻忌忍忎忐忑忒志忘応忟忡忤忦忧忨忪快忬忭忮忯忰忱忲忳忴忶忷忸忹忺忻忼忾怀怃怄怅怆怇我戒戓戺戻戼扭扮扯扰扲扳扴扵扶扷扸批扺扻扼扽找技抁抂抃抄抅抆抇抈抉把抋抌抍抎抏抐抑抒抓抔投抖抗折抙抚抛抜抝択抟抠抡抢抣护报抸拋拒拟攸改攺攻攼斈斘旰旱旲旳旴旵时旷旸昅更曵杄杅杆杇杈杉杊杋杌杍李杏材村杒杓杔杕杖杗杘杙杚杛杜杝杞束杠条杢杣杤来杦杧杨杩极欤步歼每毐毜毝氙氚求汖汞汥汦汧汨汩汪汫汭汮汯汰汱汳汴汵汶汸汹決汻汼汽汾汿沁沂沃沄沅沆沇沈沉沋沌沍沎沏沐沑沒沔沕沖沘沙沚沛沜沞沟沠没沢沣沤沥沦沧沨沩沪泐泛泤泲洰灴灵灶灷灸灹灺灻灼災灾灿炀牠牡牢牣牤状犹犺犻犼犽犾犿狁狂狃狄狅狆狇狈玒玓玔玕玖玗玘玙玚玛瓨瓩甫甬男甸甹町甼疓疔疕疖疗皀皁皂皃盀盁盯矣矴矵矶社礿祀祂祃禿秀私秂秃究穷竌竍糺系纬纭纮纯纰纱纲纳纴纵纶纷纸纹纺纻纼纽纾罕羋羌耴肐肑肒肓肔肕肖肗肘肙肚肛肜肝肞肟肠臫良芈芘芙芚芛芜芞芟芠芡芢芣芤芥芦芧芩芪芫芬芭芮芯芰花芲芳芴芵芶芷芸芹芺芼芽芾芿苀苁苂苃苄苅苆苇苈苉苊苋苌苍苎苏苡苣茾虬补見觃角言訁证诂诃评诅识诇诈诉诊诋诌词诎诏诐译诒谷豆豕豸貝贡财赤走足身車轩轪轫辛辰辵迊迋迌迍迎迏运近迒迓返迕迖迗还这迚进远违连迟邑邭邮邯邰邱邲邳邴邵邶邸邹邺邻酉釆里针钉钊钋钌闰闱闲闳间闵闶闷阷阸阹阺阻阼阽阾阿陀陁陂陃附际陆陇陈陉韧饨饩饪饫饬饭饮驱驲驳驴鸠鸡麦龟',
                '並丧丳乖乳乴乵乶乷事些亝亞亟享京佌佩佪佫佬佭佮佯佰佱佲佳佴併佶佷佸佹佺佻佼佽佾使侀侁侂侃侄侅來侇侈侉侊例侌侍侎侏侐侑侒侓侔侕侖侗侘侙侚供侜依侞侟侠価侢侣侤侥侦侧侨侩侪侫侬侭侹俢兒兓兔兖兩其具典冐冞冼冽冾冿净凭凮凯函刮刯到刱刲刳刴刵制刷券刹刺刻刼刽刾刿剀剁剂剆劵劶劷劸効劺劻劼劽劾势勆匊匋匌匦匼卑卒卓協单卖卥卦卧卶卷卹卺厒厓厔厕叀叁参叔叕取呝呞呟呠呡呢呣呤呥呦呧周呩呪呫呬呭呮呯呱味呴呵呶呷呸呹呺呻呼命呾呿咀咁咂咃咄咅咆咇咈咉咊咋和咍咎咏咐咑咒咔咕咖咗咘咙咚咛咜咝咼哎囶囷囸囹固囻囼国图坡坢坣坤坥坦坧坨坩坪坫坬坭坮坯坰坱坲坳坴坵坶坷坸坹坺坻坼坽坾坿垀垁垂垃垄垅垆垇垈垉垊备夌夜夝奃奄奅奇奈奉奋奌奍奔妬妭妮妯妰妱妲妳妴妵妶妷妸妹妺妻妼妽妾妿姀姁姃姄姅姆姇姈始姌姍姎姏姐姑姓委姗孟孠孡孢季孤孥学孧宓宔宕宖宗官宙定宛宜宝实実宠审尀尙尚尭屄居屆屇屈屉届岝岞岟岡岢岣岤岥岦岧岨岩岪岫岬岭岮岯岰岱岲岳岴岵岶岷岸岹岺岻岼岽岾岿峀峁峂峃峄峅巫巶巻帑帒帓帔帕帖帗帘帙帚帛帜幷幸底庖店庘庙庚府庝庞废建廻廼弆弢弣弤弥弦弧弨弩弪彔录彼彽彾彿往征徂徃径忝忞忠忢忥忩念忽忿态怂怈怉怊怋怌怍怏怐怑怓怔怕怖怗怙怚怛怜怞怟怡怢怦性怩怪怫怬怭怮怯怰怲怳怴怵怶怺怽怾怿戔戕或戗戽戾房所承抦抧抨抩抪披抬抭抮抯抰抱抲抳抴抵抶抷抹抺抻押抽抾抿拀拁拂拃拄担拆拇拈拉拊拌拍拎拏拐拑拓拔拕拖拗拘拙拚招拝拞拠拡拢拣拤拥拦拧拨择攰攽放斉斦斧斨斩斺斻於旹旺旻旼旽旾旿昀昁昂昃昄昆昇昈昉昊昋昌昍明昏昐昑昒易昔昕昖昗昘昙昛曶朊朋朌服杪杫杬杭杮杯杰東杲杳杴杵杶杷杸杹杺杻杼杽松板枀枂枃构枅枆枇枈枉枊枋枌枍枎枏析枑枒枓枔枕枖林枘枙枚枛果枝枞枟枠枡枢枣枤枥枦枧枨枩枪枫枬枭柉柜柹欣欥欦欧武歧歨歩歫歽歾歿殀殁殴毑毞毟氓氛氜氝汬沀沊沓沗沝沫沬沭沮沰沱沲河沴沵沶沷沸油沺治沼沽沾沿泀況泂泃泄泅泆泇泈泊泋泌泍泎泏泑泒泓泔法泖泗泘泙泜泝泞泟泠泡波泣泥泦泧注泩泪泫泬泭泮泯泱泳泷泸泹泺泻泼泽泾浅炁炂炃炄炅炆炇炈炉炊炋炌炍炎炏炐炑炒炓炔炕炖炗炘炙炚炛炜炝炞炬爬爭爸牀版牥牦牧牨物牪牫牬狀狉狋狌狍狎狏狐狑狒狓狔狕狖狗狘狙狚狛狜狝狞玜玝玞玟玠玡玢玣玤玥玦玧玨玩玪玫玬玭玮环现玱珁瓝瓪瓫瓬瓭瓮瓯瓰瓱瓲甙画甽甾甿畀畁畂畃畄畅疌疘疙疚疛疜疝疞疟疠疡癷的皯盂盰盱盲盳直盵矤知矷矸矹矺矻矼矽矾矿砀码砐祄祅祆祇祈祉祊祋祌祍祎秄秅秆秇秈秉秊穸穹空穻竎竏竺竻籴籵籶糼糽糾糿线绀绁绂练组绅细织终绉绊绋绌绍绎经绐缷罔罖罗罙者耓耵耶肃肏股肢肣肤肥肦肧肨肩肪肫肬肭肮肯肰肱育肳肴肵肶肷肸肹肺肻肼肽肾肿胀胁胏臤臥臽臾舍舎舏舠艰苐苑苒苓苔苕苖苗苘苙苚苛苜苝苞苟苠苢苤若苦苧苨苩苪苫苬苭苮苯苰英苲苳苴苵苶苷苸苹苺苻苼苽苾苿茀茁茂范茄茅茆茇茉茊茋茌茎茏茐茑茒茓茔茕茚虎虏虭虮虯虰虱虲衦衧表衩衪衫衬衱规觅视诓诔试诖诗诘诙诚诛诜话诞诟诠诡询诣诤该详诧诨诩豖责贤败账货质贩贪贫贬购贮贯軋转轭轮软轰迠迡迢迣迤迥迦迧迨迩迪迫迬迭迮迯述迱迲迳邼邽邾邿郀郁郂郃郄郅郆郇郈郉郊郋郍郎郏郐郑郓郔郕郘郱采金釒钍钎钏钐钑钒钓钔钕钖钗長镸門闸闹阜陊陋陌降陎陏限陑陒陓陔陕隶隹雨靑青非靣顶顷飏飠饯饰饱饲饳饴驵驶驷驸驹驺驻驼驽驾驿骀鱼鸢鸣鸤黾齿',
                '临举乗乹乺乻乼乽亭亮亯亰亱亲侮侯侰侱侲侳侴侵侶侷侸侺侻侼侽侾便俀俁係促俄俅俆俇俈俉俊俋俌俍俎俏俐俑俒俓俔俕俖俗俘俙俚俛俜保俞俟俠信俣俤俥俦俧俨俩俪俫俬俭修兗兘兙兪兹兺养冑冒冟冠凁凂凃凾剃剄剅則剈剉削剋剌前剎剏剐剑勀勁勂勃勄勅勇勈勉勊勋匍匧匨匩匽南単卸卻卼卽厖厗厘厙厚厛受变叙叚叛叜叝呰呲咟咠咡咢咣咤咥咦咧咨咩咪咫咬咭咮咯咰咱咲咳咴咵咶咷咸咹咺咻咽咾咿哀品哂哃哄哅哆哇哈哉哊哋哌响哏哐哑哒哓哔哕哖哗哘哙哚哛哜哝哞哟哪唌囿圀型垌垍垎垏垐垑垒垓垔垕垖垗垘垙垚垛垜垝垞垟垠垡垢垣垤垥垦垧垨垩垪垫垬垭垮垯垰垱垲垳垴垵垹埅城埏壴壵夈変复奊奎奏奐契奒奓奕奖姕姘姙姚姛姜姝姞姟姠姡姢姣姤姥姦姧姨姩姪姫姭姮姯姰姱姲姳姴姵姶姷姸姹姺姻姼姽姾姿娀威娂娃娄娅娆娇娈娍娗娜娫娰孨孩孪客宣室宥宦宨宩宪宫宬封専将尛尜尝尮尯屋屌屍屎屏峆峇峈峉峊峋峌峍峎峏峐峑峒峓峔峕峖峗峘峙峚峛峜峝峞峟峠峡峢峣峤峥峦峧峫峸巬巭差巷巹巺巼帝帞帟帠帡帢帣帤帥带帧帮幽庛庠庡庢庣庤庥度庭庰廽弇弈弫弬弭弮弯彖彥彦彧彪待徆徇很徉徊律後徍徔怎怒怘思怠怣怤急怨怱怷怸怹总怼恀恂恃恄恅恆恇恈恉恊恌恍恎恑恒恓恔恗恘恛恜恞恟恠恡恢恤恦恨恪恫恬恮恰恱恲恸恹恺恻恼恽恾战扁扂扃拜拪拫括拭拮拯拰拱拴拵拶拷拸拹拺拻拼拽拾挀持挂挃挄挅挆指按挊挋挌挍挎挏挑挒挓挔挕挖挗挘挜挝挞挟挠挡挢挣挤挥挦挧挪挷挺挻捓捛攱政敀敁敂敃敄故斪斫施斾斿旀既昚昜昝昞星映昡昢昣昤春昦昧昨昩昪昫昬昭昮是昰昱昲昳昴昵昶昷昸昹昺昻昼昽显昿曷朎朏朐朑枮枯枰枱枲枳枴枵架枷枸枹枺枻枼枾枿柀柁柂柃柄柅柆柇柈柊柋柌柍柎柏某柑柒染柔柕柖柗柘柙柚柛柝柞柟柠柢柣柤查柦柧柨柩柪柫柬柭柮柯柰柱柲柳柵柶柷柸柺査柼柽柾柿栀栁栂栃栄栅栆标栈栉栊栋栌栍栎栏栐树桏桒桞欨欩欪歪殂殃殄殅殆殇残段殶毒毖毗毘毠毡氞氟氠氡氢沯泉泚泴泵泶泿洀洁洂洃洄洅洆洇洈洉洊洋洌洎洏洐洑洒洓洔洕洗洘洙洚洛洝洞洟洠洡洢洣洤津洦洧洨洩洪洫洬洭洮洱洲洳洴洵洶洷洸洹洺活洼洽派洿浀浂浃浄浇浈浉浊测浌浍济浏浐浑浒浓浔浕涎涏炟炠炡炢炣炤炥炦炧炨炩炪炫炭炮炯炰炱炲炳炴炵炶炷炸点為炻炼炽炾炿烀烁烂烃爮爯爰爼牁牉牊牭牮牯牰牱牲牳牴牵狊狟狠狡狢狣狤狥狦狧狨狩狪狫独狭狮狯狰狱狲狿玅玲玳玴玵玶玷玸玹玻玽玾玿珀珂珃珄珅珆珇珈珉珊珋珌珍珎珏珐珑瓳瓴瓵甚甠甭甮畆畇畈畉畊畋界畍畎畏畐畑畒畓疢疣疤疥疦疧疨疩疪疫疬疭疮疯疺癸癹発皅皆皇皈皍盃盄盅盆盇盈盶盷相盹盺盻盼盽盾盿眀省眂眃眄眅眆眇眈眉眊看県眍眨矜矦矧矨矩砂砃砄砅砆砇砈砉砊砋砌砍砎砏砑砒砓研砕砖砗砘砙砚砛砜砭祏祐祑祒祓祔祕祖祗祙祚祛祜祝神祠祢禹禺秋秌种秎秏秐科秒秓秔秕秖秗秬秭穼穽穾穿窀突窂窃窆竐竑竒竓竔竕竖竗竼竽竾竿笀笁笂笃笈籷籸籹籺类籼籽籾籿粀粁粂紀紁紂紃約紅紆紇紈紉級绑绒结绔绕绖绗绘给绚绛络绝绞统缸罘罚羍美羏羑羗羾羿耇耉耍耎耏耐耑耔耷胂胃胄胅胆胇胈胉胊胋背胍胎胐胑胒胓胕胖胗胘胙胚胛胜胝胞胟胠胡胢胣胤胥胦胧胨胩胪胫脉臿舁舡舢舣舤芔茈茍茖茗茘茙茛茜茞茟茠茡茢茤茥茦茧茨茩茪茫茬茭茮茯茰茱茲茳茴茵茶茷茸茹茺茼茽茿荀荁荂荃荄荅荆荇荈草荊荋荌荍荎荏荐荑荒荓荔荕荖荗荘荙荚荛荜荝荞荟荠荡荢荣荤荥荦荧荨荩荪荫荬荭荮药荿莒莚莛虐虳虴虵虶虷虸虹虺虻虼虽虾虿蚀蚁蚂蚃蚤衁衂衍衎衭衯衲衳衴衵衶衸衹衻衼衽衿袀袂袄袅袆袇要覌觇览觉觓觔訂訃訄訅訆訇計诪诫诬语诮误诰诱诲诳说诵诶貞貟負贰贱贲贳贴贵贶贷贸费贺贻赲赳赴赵趴軌軍轱轲轳轴轵轶轷轸轹轺轻迴迵迶迷迸迹迺迻迼追迾迿退送适逃逄逅逆逇逈选逊郖郗郙郚郛郜郝郞郟郠郡郢郣郤郥郦郧酊酋重釓釔钘钙钚钛钜钝钞钟钠钡钢钣钤钥钦钧钨钩钪钫钬钭钮钯閁閂闺闻闼闽闾闿阀阁阂陖陗陘陙陛陜陝陞陟陠陡院陣除陥陦陧陨险面革韋韨韭音頁顸项顺须風飐飑飒飛食饵饶饷饸饹饺饻饼首香骁骂骃骄骅骆骇骈骉骨鬼鳬鸥鸦鸧鸨鸩',
                '笏笐笑笒笓笔笕笖笫粃粄粅粆粇粈粉粊粋粌粍粎粏粐粑粔紊紋紌納紎紏紐紑紒紓純紕紖紗紘紙紛紜紝紞紟素紡索紣紤紥紦紧绠绡绢绣绤绥绦继绨缹缺缻缼罛罜罝罞罟罠罡罢羐羒羓羔羖羘羙羞翀翁翂翃翄翅翆耄耆耊耕耖耗耘耙耟耸耹耺耻耼耽耾耿聀聁聂肁肂胭胮胯胰胱胲胳胴胵胶胷胸胹胺胻胼能胿脀脁脂脃脄脅脆脇脈脊脋脌脍脎脏脐脑脒脓脠脡脩臬臭致舀舐舥舦舧舨舩航舫般舭舮舯舰舱艳芻茝茣荰荱荲荳荴荵荶荷荸荹荺荻荼荽荾莀莁莂莃莄莅莆莇莈莉莊莋莌莍莎莏莐莑莓莔莕莖莗莘莙莜莝莞莟莠莡莢莣莤莥莦莧莨莩莪莫莬莭莮莯莰莱莲莳莴莵莶获莸莹莺莻莼莽菃菦華虑虒虓虔蚄蚅蚆蚇蚈蚉蚊蚋蚌蚍蚎蚏蚐蚑蚒蚓蚔蚕蚖蚗蚘蚙蚚蚛蚜蚝蚞蚟蚠蚡蚢蚣蚥蚦蚧蚨蚩蚪蚬蚷衃衄衏衐衮衰衷衺衾袁袃袉袊袍袎袏袐袑袒袓袔袕袖袗袘袙袚袛袜袝袟袡袢袣袥袦袧袨袩袪被袮袯覂覍覎觊觙訉訊訋訌訍討訏訐訑訒訓訔訕訖託記訙訯请诸诹诺读诼诽课诿谀谁谂调谄谅谆谇谈谉谊谸豇豈豗豹豺豻財貢貣貤贼贽贾贿赀赁赂赃资赅赆赶起赸趵趶趷趸趿躬軎軏軐軑軒軓軔軕轼载轾轿辀辁辂较辱逋逌逍逎透逐逑递逓途逕逖逗逘這通逛逜逝逞速造逡逢連逤逥逦逧邕部郩郪郫郬郭郮郯郰郲郳郴郵郷郸都鄀酌配酎酏酐酑酒釕釖釗釘釙釚釛釜針釞釟釠釡釢钰钱钲钳钴钵钶钷钸钹钺钻钼钽钾钿铀铁铂铃铄铅铆铇铈铉铊铋铌铍铎閃閄閅阃阄阅阆陚陪陫陬陭陮陯陰陱陲陳陴陵陶陷陸陹険陼隺隻隼隽难顼顽顾顿颀颁颂颃预飢飣飤饽饾饿馀馁馂馬骊骋验骍骎骏高髟鬥鬯鬲鱽鸪鸫鸬鸭鸮鸯鸰鸱鸲鸳鸴鸵鸶龀丵乘亳俯俰俱俲俳俴俵俶俷俸俹俺俻俼俽俾俿倀倁倂倃倄倅倆倇倈倉倊個倌倍倎倏倐們倒倓倔倕倖倗倘候倚倛倜倝倞借倠倡倢倣値倥倦倧倨倩倪倫倬倭倮倯倰倱倲倳倴倵倶倷倸倹债倻值倽倾倿偀偌偖健党兛兞兼冓冔冡冢冣冤冥冦冧凄凅准凇凈凉凊凋凌凍凎剒剓剔剕剖剗剘剙剚剛剜剝剞剟剠剡剢剣剤剥剦剧剮勌勍勎勏勐勑務匎匪匫匿卨卿厜厝厞原叞叟哠員哢哣哤哥哦哧哨哩哫哬哭哮哯哰哱哲哳哴哵哶哷哸哹哺哻哼哽哾哿唀唁唂唃唄唅唆唇唈唉唊唋唍唎唏唐唑唒唓唔唕唖唗唘唙唚唛唜唝唞唟唠唡唢唣唤唥唦唧唨唴啊圁圂圃圄圅圆垶垷垸垺垻垼垽垾垿埀埁埂埃埄埆埇埈埉埊埋埌埍埐埑埒埓埔埕埖埗埘埙埚埛堲壶夎夏夞套奘奙奚姬娉娊娋娌娎娏娐娑娒娓娔娕娖娘娙娚娛娝娞娟娠娡娢娣娤娥娦娧娨娩娪娭娮娯娱娲娳娴娿婀婲孫孬孭宧宭宮宯宰宱宲害宴宵家宷宸容宺宻宼宽宾尃射尅將屐屑屒屓屔展屖屗屘屙峨峩峪峬峭峮峯峰峱峲峳峴峵島峷峹峺峻峼峽峾峿崀崁崂崃崄崅崋巸帨帩帪師帬席帯帰帱座庨庩庪庫庬庮庯弉弰弱弲弳彨徎徏徐徑徒従徕恁恋恏恐恕恖恙恚恝恣恥恧恩恭息恳恴恵恶恷悀悁悂悃悄悅悇悈悋悌悍悎悏悑悒悓悔悕悖悗悙悚悛悜悝悞悟悢悦悧悩悭悮悯戙扄扅扆扇拲拳拿挈挐挙挚挛挨挩挫挬挭挮振挰挱挳挴挵挶挸挹挼挽挾挿捀捁捂捃捄捅捆捇捈捉捊捋捌捍捎捏捐捑捒捔捕捖捗捘捙捚捜捝捞损捠捡换捣捤揤敆敇效敉敊敋敌敖斊斋料斚旁旂旃旄旅旆旊晀晁時晃晄晅晆晇晈晉晊晋晌晍晎晏晐晑晒晓晔晕晖晘晙晚晛晜晝晞晟晠書曺曻朒朓朔朕朗枽柡柴栒栓栔栕栖栗栘栙栚栛栜栝栞栟栠校栢栣栤栥栦栧栨栩株栫栬栭栮栯栰栱栲栳栴栵栶样核根栺栻格栽栾栿桀桁桂桃桄桅框桇案桉桊桋桌桍桎桐桑桓桔桕桖桗桘桙桚桛桜桝桟桠桡桢档桤桥桦桧桨桩桪梃梆梛條梠梡梢梣梤梥梧梨梩梴棦欬欭欮欯欰欱欴歬歭殈殉殊殷殺毙毢毣毤毥毦毧毨毩毪氣氤氥氦氧氨氩泰洍洖洜洯流浆浖浗浘浙浚浛浜浝浞浟浠浡浢浣浤浥浦浧浨浩浪浫浬浭浮浯浰浱浲浳浴浵浶海浸浹浺浻浼浽浾浿涀涁涂涃涄涅涆涇消涉涊涋涌涍涐涑涒涓涔涕涖涗涘涙涚涛涜涝涞涟涠涡涢涣涤涥润涧涨涩淓淽烄烅烆烇烈烉烊烋烌烍烎烏烐烑烒烓烔烕烖烗烘烙烚烛烜烝烞烟烠烡烢烣烤烥烦烧烨烩烪烫烬热烮烵烶烻焒爱爹牂牶牷牸特牺狳狴狵狶狷狸狹狺狻狼狽狾猀猁猂猃猐玆玺玼珒珓珔珕珖珗珘珙珚珛珜珝珞珟珠珡珢珣珤珥珦珧珨珩珪珫珬班珮珯珰珱珲珹珽琊瓞瓟瓶瓷瓸甡畔畕畖畗畘留畚畛畜畝畞畟畠畢疍疰疱疲疳疴疶疷疸疹疻疼疽疾疿痀痁痂痃痄病痆症痈痉皊皋皌皰皱盉益盋盌盍盎盏盐监眎眏眐眑眒眓眔眕眖眗眘眙眚眛眜眝眞真眠眡眢眣眤眧眩眪眫眬眿矝砝砞砟砠砡砢砣砤砥砧砨砩砪砫砬砮砯砰砱砲砳破砵砶砷砸砹砺砻砼砽砾砿础硁祘祟祡祣祤祥祧祩祪祫祬祮祯离秘秙秚秛秜秝秞租秠秡秢秣秤秥秦秧秨秩秪秫秮积称窄窅窇窈窉窊窋窌窍窎竘站竚竛竜竝竞笄笅笆笇笉笊笋笌笍笎',
                '乾乿亀偁偂偃偄偅偆假偈偉偊偋偍偎偏偐偑偒偓偔偕偗偘偙做偛停偝偞偟偠偡偢偣偤偦偧偩偪偫偬偭偮偯偰偱偲偳側偵偶偷偸偹偺偻偼偽偾偿傀傁傇傞傦兜兝兽冕冨减凐凑凰剨剪剫剬剭副剰剱剳剶勒勓勔動勖勗勘勚匏匐匒匘匙匬匭匮匾區卙卾厠厡厢厣厩參叄唩唪唫唬唭售唯唰唱唲唳唵唶唷唸唹唺唻唼唽唾唿啀啁啂啃啄啅商啇啈啉啋啌啍啎問啐啑啒啓啔啕啖啗啘啚啛啜啝啞啟啠啡啢啤啥啦啧啨啩啪啫啬啭啮啯啰啱啲啳啴啵啶啷啸啹喎喏喐喯喵圇圈圉圊國埜埝埞域埠埡埢埣埤埥埦埧埨埩埪埫埬埭埮埯埰埱埲埳埴埵埶執埸培基埻埼埽埾埿堀堁堂堃堄堅堆堇堈堉堊堋堌堍堎堏堐堑堒堓堔堕堝堵壷壸够夠奛奜奝奞奟奢娬娵娶娷娸娹娺娻娼娽娾婁婂婃婄婅婆婇婈婉婊婋婌婍婎婏婐婑婒婓婔婕婖婗婘婙婚婛婜婝婞婟婠婡婢婤婥婦婧婨婩婪婫婬婭婮婯婰婱婳婴婵婶婼媌媎媖媧嫏孮孯孰孲宿寀寁寂寃寄寅密寇寈寉專尉屚屛屜屝屠崆崇崈崉崊崌崍崎崏崐崑崒崓崔崕崖崗崘崙崚崛崜崝崞崟崠崡崢崣崤崥崦崧崨崩崪崫崬崭崮崯崰巢巣帲帳帴帵帶帷常帹帺帻帼帾庱庲庳庴庵庶康庸庹庺庻庼庾庿廊弴張弶強弸弹彗彩彫彬徖得徘徙徛徜徝從徟徠徢徣徤恿悆悉悊悐悘悠悡患悤悥您悪悫悬悰悱悴悵悷悸悺悻悼悽悾悿惀惂惃情惆惇惈惊惋惍惏惐惓惔惕惗惘惙惚惛惜惝惞惟惤惦惧惨惬惭惮惯愥戚戛戜戝扈挲捥捦捧捨捩捪捫捬捭据捯捰捱捲捳捴捵捶捷捸捹捺捻捼捽捾捿掀掁掂掃掄掅掆掇授掉掊掋掍掎掏掐掑排掓掕掖掗掘掙掚掛掜掝掞掟掠採探掤接掦控推掩措掫掬掭掮掯掲掳掴掵掶掷掸掹掺掻掼掿揵揶敍敎敏敐救敒敓敔敕敗敘教敚敛敝敢斍斎斏斛斜斬断旇旈旉旋旌旍旎族旣晗晡晢晣晤晥晦晧晨晩曹曼曽朖朘朙朚望桫桬桭桮桯桰桱桲桳桴桵桶桷桸桹桺桻桼桽桾桿梀梁梂梄梅梇梈梉梊梋梌梍梎梏梐梑梒梓梔梕梖梗梘梙梚梜梞梟梦梪梫梬梭梮梯械梱梲梳梵梶梷梸梹梺梻梼梽梾梿检棁棂棻椘椛楖欫欲欳欵欶欷欸殌殍殎殏殐殑殒殓殸殹殻毫毬毭氪氫涪涫涬涭涮涯涰涱液涳涴涵涶涷涸涹涺涻涼涽涾涿淀淁淂淃淄淅淆淇淈淉淊淋淌淍淎淏淐淑淒淔淕淖淗淘淙淚淛淜淝淞淟淠淡淢淣淤淥淦淧淨淩淪淫淬淭淮淯淰深淲淳淴淶混淸淹淺添淿渀渁渂渃渄清渆渇済渉渊渋渌渍渎渏渐渑渒渓渔渕渖渗渚渠渦渮渵渶湕湴烯烰烱烲烳烴烷烸烹烺烼烽烾烿焀焁焂焃焄焅焆焇焈焉焊焋焌焍焎焏焐焑焓焔焕焖焗焘焫爽牻牼牽牾牿犁猄猅猇猈猉猊猍猎猏猑猓猔猕猖猗猘猙猚猛猜猝猞猟猠猡猧猪猫率玈珳珴珵珶珸珺珻珼現珿琀琁琂球琄琅理琇琈琉琋琌琍琎琏琐琑琒琓琷瓠瓹瓺瓻瓼甛甜產産畡畣畤略畦畧畨畩異疵痊痋痌痍痎痏痐痑痒痓痔痕痖皉皎皏皐皑皲盒盓盔盕盖盗盘盛眥眦眭眮眯眰眱眲眳眴眵眶眷眸眹眺眻眼眽眾着睁矪矫砦硂硃硄硅硆硇硈硉硊硋硌硍硎硏硐硑硒硓硔硕硖硗硘硙硚硛硟硭祦票祭祰祱祲祳祴祵祶祷祸禼秱秲秳秴秵秶秷秸秹秺移秼秽秾稆窏窐窑窒窓窔窕窚竟章竡竫笗笘笙笚笛笜笝笞笟笠笡笢笣笤笥符笧笨笩笪第笭笮笯笰笱笲笳笴笵笶笷笸笹笺笻笼笽笾筇粒粓粕粖粗粘粙粚粛粜粝粣紨紩紬紭紮累細紱紲紳紴紵紶紷紸紹紺紻紼紽紾紿絀絁終絃組絅絆絇絈絉絊絋経绩绪绫绬续绮绯绰绱绲绳维绵绶绷绸绹绺绻综绽绾绿缀缁缍缽罣羕羚羛羜羝羟翇翈翉翊翋翌翍翎翏翐翑習耈耚耛耜耝耞聃聄聅聆聇聈聉聊聋职聍胬脕脖脗脘脙脚脛脜脝脞脟脢脣脤脥脦脧脨脪脫脬脭脮脯脰脱脲脳脴脵脶脷脸舂舑舲舳舴舵舶舷舸船舺舻艴莾莿菀菁菂菄菅菆菇菈菉菊菋菌菍菎菏菑菒菓菔菕菖菗菘菙菚菛菜菝菞菟菠菡菢菣菤菥菧菨菩菪菫菬菭菮菰菱菲菳菴菵菶菷菸菹菺菻菼菽菾菿萀萁萂萃萄萅萆萇萈萉萊萋萌萍萎萏萐萑萒萓萔萕萖萗萘萙萚萛萜萝萞萟萠萡萢萣萤营萦萧萨萵萸著蒁蓈處虖虗虘虙虚蚫蚭蚮蚯蚰蚱蚲蚳蚴蚵蚶蚸蚹蚺蚻蚼蚽蚾蚿蛀蛁蛂蛃蛄蛅蛆蛇蛈蛉蛊蛋蛌蛍蛎蛏衅衑衒術衔袈袋袌袞袠袤袬袭袰袱袳袴袵袶袷袸袹袺袻袼袽袾袿裀裃裄裆裇裈裉規覐覑覒覓覔視觋觕觖觗觘訛訜訝訞訟訠訡訢訣訤訥訦訧訨訩訪訫訬設訮訰許訲訳詎谋谌谍谎谏谐谑谒谓谔谕谖谗谘谙谚谛谜谝谞谹谺谻豉豘豙豚豛豜豝象豼豽貥貦貧貨販貪貫責貭貮貶赇赈赉赊赥赦赧赹赺赻赼赽赾赿趀趹趺趻趼趽趾跀跁跂跃跄距躭躮躯軖軗軘軙軚軛軜軝軞軟軠軡転軣辄辅辆逨逩逪逫逬逭逮逯逰週進逳逴逵逶逷逸逹逺逻過邫郹郻郼郾郿鄁鄂鄃鄄鄅鄆鄇鄈鄉鄊鄋酓酔酕酖酗酘酙酚酛酜酝酞釈野釣釤釥釦釧釨釩釪釫釬釭釮釯釰釱釲釳釴釵釶釷釸釹釺釻釼鈒铏铐铑铒铓铔铕铖铗铘铙铚铛铜铝铞铟铠铡铢铣铤铥铦铧铨铩铪铫铬铭铮铯铰铱铲铳铴铵银铷镹閆閇閈閉閊阇阈阉阊阋阌阍阎阏阐陻陽陾陿隀隁隂隃隄隅隆隇隈隉隊隋隌隍階随隐隗隿雀雩雪雫雭靪頂頃頄颅领颇颈飡飥飦馃馄馅馆馗骐骑骒骓骔骕骖骩髙魚鱾鳥鸷鸸鸹鸺鸻鸼鸽鸾鸿鹀鹵鹿麥麸麻黃黄黒龁龚龛',
                '亁亴亵偨傂傃傄傅傆傈傉傊傋傌傍傎傏傐傑傒傓傔傕傖傗傘備傚傛傜傝傟傠傡傢傣傤傥傧储傩傲僃兟兠凒凓凔凕凖凱凲凿剩割剴創勛勜勝勞募匑博厤厥厦厧厨厫叅啙啣啺啻啼啽啾啿喀喁喂喃善喅喆喇喈喉喊喋喌喑喒喓喔喕喖喗喘喙喚喛喜喝喞喟喠喡喢喣喤喥喦喧喨喩喪喫喬喭單喰喱喲喳喴営喷喸喹喺喻喼喽喾嗏嗖嗗嗞嗟嗢嗴嘅圌圍圎圏圐堖堗堘堙堚堛堜堞堟堠堡堢堣堤堥堦堧堨堩堪堫堬堭堮堯堰報堳場堶堷堸堹堺堻堼堾堿塀塁塂塃塄塅塆塇塈塊塔塟塠塦塭壹壺壻夡奠奡奣奤奥婣婷婸婹婺婻婽婾婿媀媁媂媃媄媅媆媇媈媉媊媋媍媏媐媑媒媓媔媕媗媘媙媚媛媜媝媞媟媠媡媢媣媤媥媦媨媩媪媫媬媭媮媯媶媿嫂嫅孱孳寊寋富寍寎寏寐寑寒寓寔寕尊尋尌尞尰就尳属屟屡崱崲崳崴崵崶崷崸崹崺崻崼崽崾崿嵀嵁嵂嵃嵄嵅嵆嵇嵈嵉嵋嵌嵍嵎嵏嵐嵑嵒嵓嵔嵕嵖嵗嵘嵙嵚嵛嵜嵝嵫嵬嵯嵳巯巽帽帿幀幁幂幃幄幅幆幇幈幉幾庽廀廁廂廃廄廆廋弑强弻弼弽弾彘彭徚御徥徦徧徨復循徫悲悳悶悹惁惄惉惌惎惑惒惖惠惡惢惣惥惩惪惫惰惱惲惴惵惶惸惹惺惻惼惽惾惿愀愃愄愅愇愉愊愋愌愎愐愑愒愓愔愕愖愘愜愝愞愠愡愢愣愤愦愧愲愺慅慌慨戞戟戠戡戢扉扊掌掔掣掰掱掽掾揀揁揂揃揄揆揇揈揉揊揋揌揍揎描提揑插揓揔揕揖揗揘揙揚換揜揝揞揟揠握揢揣揥揦揨揩揪揬揭揮揯揰揲揳援揷揸揹揺揻揼揽揾揿搀搁搂搃搄搅搓搔搜搥搭搰搽摒摡攲敜敞敟敠敡散敤敥敦敧敨敩敪敬斌斐斑斝斮斯旐旑旔旤晪晫晬晭普景晰晱晲晳晴晵晶晷晹智晻晼晽晾晿暀暁暂暃暎暏暑曾替最朁朂朜朝朞期朠棃棄棅棆棇棈棉棊棋棌棍棎棏棐棑棒棓棔棕棖棗棘棙棚棛棜棝棞棟棠棡棢棣棤棥棧棨棪棫棬棭森棯棰棱棲棳棴棵棶棷棸棹棺棼棽棾棿椀椁椂椃椄椅椆椇椈椉椊椋椌植椎椏椐椑椒椓椔椕椖椗椙椚検椝椞椟椠椡椢椣椤椥椦椧椨椩椪椫椬椭椮椰楇楉楗楛楧楮楰極榔欹欺欻欼欽款欿歄歮歯殔殕殖殗殘殙殚殛殼殽毮毯毰毱毲毳毴毵毶毽氬氭氮氯氰淵淼淾渘渙減渜渝渞渟渡渢渣渤渥渧渨温渪渫測渭港渰渱渲渳渴渷游渹渺渻渼渽渾渿湀湁湂湃湄湅湆湇湈湉湊湋湌湍湎湏湐湑湒湓湔湖湗湘湙湚湛湜湝湞湟湠湡湢湣湤湥湦湧湨湩湪湫湭湮湯湰湱湲湳湵湶湷湸湹湺湻湼湽湾湿満溁溂溃溄溅溆溇溈溉溊溋溌溚溞溠溲滁滋滑滞焙焚焛焜焝焞焟焠無焢焣焤焥焦焧焨焩焪焬焭焮焯焰焱焲焳焴焵然焷焸焹焺焻焼焽焾焿煀煐煑煚煡煮煱爲爺牋牌牍牚犀犂犃犄犅犆犇犈犉犊犋犍猆猋猌猒猢猣猤猥猦猨猩猬猭猯猰猱猲猳猴猵猶猸猹猾獀獇珷琔琕琖琗琘琙琚琛琜琝琞琟琠琡琢琣琤琥琦琨琩琪琫琬琭琮琯琰琱琲琳琴琵琶琸琹琺琻琼琽瑘瑛瑯瓽瓾瓿甀甁甤甥甦甯番畫畬畭畮畯畱畲畳畴疎疏痗痘痙痚痛痜痝痞痟痠痡痢痣痤痥痦痧痨痩痪痫痾登發皒皓皔皕皖皳皴盙盚盜睂睃睄睅睆睇睈睉睊睋睌睍睎睏睐睑矞矟矬短硜硝硞硠硡硢硣硤硥硦硧硨硩硪硫硬确硯硰硱硲硳硴硵硶硷祹祺祻祼祽祾祿禂禃禄禅禆禇禍禽秿稀稁稂稃稄稅稇稈稉稊程稌稍税窖窗窘窙窛窜窝竢竣竤童竦竧笿筀筁筂筃筄筅筆筈等筊筋筌筍筎筏筐筑筒筓答筕策筗筘筙筚筛筜筝筥筬筳筵粞粟粠粡粢粤粥粦粧粨粩粪粫粬粭紪紫絍絎絏結絑絒絓絔絕絖絗絘絙絚絛絜絝絞絟絠絡絢絣絤絥給絧絨絩絪絫絬絭絮絯絰統絲絳絴絵絶絷絽絾綁綎綖缂缃缄缅缆缇缈缉缊缋缌缎缏缐缑缒缓缔缕编缗缘缙缾缿罀罤罥罦羠羡羢翓翔翕翖翗翘翙翚翛耋耠聎聏聐聑聒聓联聠胔胾脔脹脺脻脼脽脾脿腀腁腂腃腄腅腆腇腈腉腊腋腌腍腎腏腑腒腓腔腕腖腗腘腙腚腡腱腴臦臮臯臰臵臶臷臸臹舃舄舒舜舼舽舾舿艇艵茻菐萩萪萫萬萭萮萯萰萱萲萳萴萶萷萹萺萻萼落萾萿葀葁葂葃葄葅葆葇葈葉葊葋葌葍葎葏葐葑葒葓葔葕葖葘葙葚葛葜葝葞葟葠葡葢董葤葥葦葧葨葩葪葫葬葭葮葯葰葱葲葳葴葵葶葷葸葹葺葻葼葽葾葿蒀蒂蒃蒄蒅蒆蒇蒈蒉蒊蒋蒌蒍蒎蒏蒐蒢蒫蒾蓃蓇蓚蓱蔇虛虝蛐蛑蛒蛓蛔蛕蛗蛘蛙蛚蛛蛜蛝蛞蛟蛠蛡蛢蛣蛤蛥蛦蛧蛨蛩蛪蛫蛬蛭蛮蛯蛰蛱蛲蛳蛴蜑蜒蜓衆衇衈衉衕衖街袲裁裂装裋裌裍裎裐裑裒裓裕裖裗裙補裞裡裢裣裤裥褁覃覄覕覗覘覙覚觌觍觚觛觝觞訴訵訶訷訸訹診註証訽詀詁詂詃詄詅詆詇詈詉詊詋詌詍詏詐詑詒詓詔評詖詗詘詙詚詛詜詝詞詟詠谟谠谡谢谣谤谥谦谧豞豟豠豾豿貀貁貂貃貯貰貱貳貴貵買貸貹貺費貼貽貾貿賀賁赋赌赍赎赏赐赑赒赓赔赕趁趂趃趄超趆趇趈趉越趋跅跆跇跈跉跊跋跌跍跎跏跑跒跓跔跕跖跗跘跙跚跛跜跞践躰軤軥軦軧軨軩軪軫軬軮軯軰軱軲軳軴軵軶軷軸軹軺軻軼軽辇辈辉辊辋辌辍辎辜辝逼逽逾逿遀遁遂遃遄遅遆遇遈遉遊運遌遍遏遐遑遒道達違遖遗鄌鄍鄎鄏鄐鄑鄒鄓鄔鄕鄖鄗鄚酟酠酡酢酣酤酥酦釉释量釽釾釿鈀鈁鈂鈃鈄鈅鈆鈇鈈鈉鈊鈋鈌鈍鈎鈏鈐鈑鈓鈔鈕鈖鈗鈘鈙鈚鈛鈜鈝鈞鈟鈠鈡鈢鈣鈤鈥鈦鈧鈨鈩鈪鈫鈬鉅鉯铸铹铺铻铼铽链铿销锁锂锃锄锅锆锇锈锉锊锋锌锍锎锏锐锑锒锓锔锕镺開閌閍閎閏閐閑閒間閔閕閖閗阑阒阓阔阕隑隒隓隔隕隖隘隙隞雁雂雃雄雅集雇雈雋雬雮雯雰雱雲雳靓靔靟靫靬靭靮靯靰靱靸韌韩韮項順頇須颉颊颋颌颍颎颏颩颪飓飧飨飩飪飫飭飯飰飲馇馈馉馊馋馭馮骗骘骙骚骛骪骫骬骭骮髠鬽鱿鲀鲁鲂鲃鳦鹁鹂鹃鹄鹅鹆鹇鹈黍黑黹鼋鼎龂',
                '亂亃亄亶亷傪傫催傭傮傯傰傱傳傴債傶傷傸傹傺傻傼傽傾傿僀僁僂僄僅僆僇僈僉僋僌働像僙兡兾兿凗剷剸剹剺剻剼剽剾剿勠勡勢勣勤勦勧匓匯厀厁厪叠喍喿嗀嗁嗂嗃嗄嗅嗆嗇嗈嗉嗊嗋嗌嗍嗎嗐嗑嗒嗓嗔嗕嗘嗙嗚嗛嗜嗝嗠嗡嗣嗤嗥嗦嗧嗨嗩嗪嗫嗬嗭嗮嗯嗰嗱嗲嗳嗵嗶嗷嗸嗹嗼嘟嘩圑園圓圔圕堽塉塋塌塍塎塏塐塑塒塓塕塖塗塘塙塚塛塜塝塞塡塢塣塤塥塧塨塩塪填塬塮塯塰塱塳塻墎墓墷壼壾夢奦媰媱媲媳媴媵媷媸媹媺媻媼媽媾嫀嫁嫃嫄嫆嫇嫈嫉嫊嫋嫌嫍嫎嫐嫑嫒嫓嫔嫟嫫嫯嬅嬋孴孶寖寗寘寙寚寛寜寝寞尟尠尲尴嵊嵞嵟嵠嵡嵢嵣嵤嵥嵦嵧嵨嵩嵪嵭嵮嵰嵱嵲嵴嵵嵶嶅幊幋幌幍幎幏幐幕幙幹廅廇廈廉廌廍廒廓廕弒弿彀彁彂彃彙彚彮徬徭微徯徰想惷愁愂愆愈愍意愗愙愚愛感愩愪愫愭愮愯愰愱愴愵愶愷愹愼愽愾慀慃慄慆慈慉慊慍慎慏慑慔慠慥慩慪戣戤戥戦揅揧揫揱搆搇搈搉搊搋搌損搎搏搐搑搒搕搖搗搘搙搚搛搝搞搟搠搡搢搣搤搦搧搨搩搪搬搮搯搱搲搳搵搶搷搸搹携搼搾摀摁摂摃摄摅摆摇摈摉摊摋摓摙摛摸撶敫敭敮敯数斒斞斟新斱旒旓旕晸暄暅暆暇暈暉暊暋暌暍暐暒暓暔暕暖暗暘暙暛會朡棩椯椱椲椳椴椵椶椷椸椹椺椻椼椽椾椿楀楁楂楃楄楅楆楈楊楋楌楍楎楏楐楑楒楓楔楕楘楙楚楜楝楞楟楠楡楢楣楤楥楦楨楩楪楫楬業楯楱楲楳楴楶楷楸楹楺楻楼楽楾楿榀榁概榃榄榅榆榇榈榉榊榋榌榘榙榳榵榾槆槌槎槐歀歁歂歃歅歆歇歈歌歱歲歳殜殟殾殿毀毁毂毷毸毹毺毻毼氱氲湬溍溎溏源溑溒溓溔溕準溗溘溙溛溜溝溟溡溢溣溤溥溦溧溨溩溪溫溬溭溮溯溰溱溳溴溵溶溷溸溹溺溻溼溽溾溿滀滂滃滄滅滆滇滈滉滊滌滍滏滐滒滓滔滖滗滘滙滚滛滜滝滟滠满滢滣滤滥滦滧滨滩滪滭滶漓漠漣漨漭漷煁煂煃煄煅煆煇煈煉煊煋煌煍煎煏煒煓煔煕煖煗煘煙煜煝煞煟煠煢煣煤煥煦照煨煩煪煫煬煭煯煰煲煳煴煵煶煷煸煺熍熓牃牎牏牐牑牒犌犎犏犐犑献猷猺猻猼猽猿獁獂獅獆獈獉獊獏獒獓琧琾琿瑀瑁瑂瑃瑄瑅瑆瑇瑈瑉瑊瑋瑌瑍瑎瑏瑐瑑瑒瑓瑔瑕瑖瑗瑙瑚瑜瑝瑞瑟瑥瑰瑳瑵瓡甂甃甄甅甆甝甞畵當畷畸畹畺痬痭痮痯痰痱痲痳痴痵痶痷痸痹痺痻痼痽痿瘀瘁瘂瘃瘄瘅瘆瘏瘐瘑瘔皗皘皙皵盝盞盟睒睓睔睕睖睗睘睙睚睛睜睝睞睟睠睡睢督睤睥睦睧睨睩睪睫睬睭睰睷睹瞄矠矮硸硹硺硻硼硽硾硿碀碁碂碃碄碅碆碇碈碉碊碋碌碍碎碏碐碑碒碓碔碕碖碗碘碙碚碛碜碢碤碰禀禁禈禉禊禋禌禎福禐禑禒禓禔禕禖禗禘禙稏稐稑稒稓稔稕稖稗稘稙稚稛稜稝稞稟稠稡稢稣稤稥窞窟窠窡窢窣窤窥窦窧窩竨竩竪筞筟筠筡筢筣筤筦筧筨筩筪筫筭筮筯筰筱筲筴筶筷筸筹筺筻筼筽签筿简節粮粯粰粱粲粳粴粵糀絸絹絺絻絼絿綀綂綃綄綅綆綇綈綉綊綋綌綍綏綐綑綒經綔綕綗綘継続綛綤缚缛缜缝缞缟缠缡缢缣缤罧罨罩罪罫罬罭置署羣群羥羦羧羨義羪翜翝耡耢聕聖聗聘肄肅肆腛腜腝腞腟腠腢腣腤腥腦腧腨腩腪腫腬腭腮腯腰腲腳腵腶腷腸腹腺腻腼腽腾腿膄膇舅與艀艁艂艃艄艅艆艈艉蒑蒒蒓蒔蒕蒖蒗蒘蒙蒚蒛蒜蒝蒞蒟蒠蒡蒣蒤蒥蒦蒧蒨蒩蒪蒬蒭蒮蒯蒰蒱蒲蒳蒴蒵蒶蒷蒸蒹蒺蒻蒼蒽蒿蓀蓁蓂蓄蓅蓆蓉蓊蓋蓌蓍蓎蓏蓐蓑蓒蓓蓔蓕蓖蓗蓘蓙蓛蓜蓝蓞蓟蓠蓡蓢蓣蓤蓥蓦蓧蓨蓩蓪蓫蓬蓮蓽蔀蔭蔯蔱虜虞號虡蛖蛵蛶蛷蛸蛹蛺蛻蛼蛽蛾蛿蜁蜂蜃蜄蜅蜆蜇蜈蜉蜊蜋蜌蜍蜎蜏蜐蜔蜕蜖蜗蜣蜹蝆蝍衘衙裊裏裔裘裚裛裝裟裠裧裨裩裪裬裭裮裯裰裱裲裶裷裸裺裼裾裿褀褂褃褄褚覅覛覜觎觜觟觠觡觢解觤觥触觧訾訿詡詢詣詤詥試詧詨詩詪詫詬詭詮詯詰話該詳詴詵詶詷詸詹詺詻詼詽詾詿誀誁誂誃誄誅誆誇誈誉誊誔誕誠谨谩谪谫谬谼豊豋豢豣豤豥豦貄貅貆貇貈貉貊貲賂賃賄賅賆資賈賉賊賋賌賍賎赖赗赨赩赪趌趍趎趏趐趑趒趓趔跐跟跠跡跢跣跤跥跦跧跨跩跪跫跬跭跮路跰跱跲跳跴跶跷跸跹跺跻躱躲躳軭軾軿輀輁輂較輄輅輆輇輈載輊輋輌辏辐辑辒输辔辞辟辠農遘遙遚遛遜遝遞遟遠遡遢遣遤遥遨遳郌郒鄘鄙鄛鄜鄝鄞鄟鄠鄡鄢鄣鄤鄥酧酨酩酪酫酬酭酮酯酰酱鈮鈯鈰鈱鈲鈳鈴鈵鈶鈷鈸鈹鈺鈻鈼鈽鈾鈿鉀鉁鉂鉃鉄鉆鉇鉈鉉鉊鉋鉌鉍鉎鉏鉐鉑鉒鉓鉔鉕鉖鉗鉘鉙鉚鉛鉜鉝鉞鉟鉠鉡鉢鉣鉤鉥鉦鉧鉨鉩鉪鉫鉬鉭鉮鉰鉱鉲鉳鉴銏銰锖锗锘错锚锛锜锝锞锟锠锡锢锣锤锥锦锧锨锩锪锫锬锭键锯锰锱锳镻閘閙閚閛閜閝閞閟閠阖阗阘阙隚際障隝隟隠隡雉雊雍雎雏雴雵零雷雸雹雺電雼雽雾靕靖靲靳靴靵靶靷靹韪韫韴韵頉頊頋頌頍頎頏預頑頒頓颐频颒颓颔颕颖颫颬飔飕飬飮飱飳飴飵飶飷飹飻飼飽飾飿餀馌馍馎馏馐馚馯馰馱馲馳馴馵馺骜骝骞骟骯骰骱髡髢鬾鬿魀魁魂魛魜魝魞鲄鲅鲆鲇鲈鲉鲊鲋鲌鲍鲎鲏鲐鳧鳨鳩鳪鳫鳭鳮鳯鳰鹉鹊鹋鹌鹍鹎鹏鹐鹑鹒鹓鹔麀麁麂黽鼌鼓鼔鼠鼡龃龄龅龆',
                '僊僎僐僑僒僓僔僕僖僗僘僚僛僜僝僞僟僠僡僢僣僤僥僦僧僨僩僪僫僬僭僮僯僰僱僲僳僴僷儆兢冩凘凳凴劀劁劂劃劄勥勨勩勪勫勬勭勱匰匱匲厬厭厮厯厰厲叆嗺嗻嗽嗾嗿嘀嘁嘂嘃嘄嘆嘇嘈嘉嘊嘋嘌嘍嘎嘏嘐嘑嘒嘓嘔嘕嘖嘗嘘嘙嘚嘛嘜嘝嘞嘡嘢嘣嘤嘥嘦嘧嘨噉噑圖圗團圙塲塴塵塶塷塸塹塺塼塽塾塿墁墂境墄墅墆墇墈墉墊墋墌墍墏墐墑墒墔墕墖増墘墙墚墛墜墬墭墮墴墸壽夐夣夤夥奧奨奩奪奬嫕嫖嫗嫘嫙嫚嫛嫜嫝嫞嫠嫡嫢嫣嫤嫥嫦嫧嫨嫩嫪嫬嫭嫮嫰嫱嫲嫳嫷嫹孵孷察寠寡寢寣寤寥實寧寨寬對尡屢屣嵷嵸嵺嵻嵼嵽嵾嵿嶀嶁嶂嶃嶄嶆嶇嶈嶉嶊嶋嶌嶍嶎嶐嶞巰幑幒幓幔幖幗幘幚幛幣廎廏廐廑廔廖廗廘廙廜廣弊彄彅彆彉彯彰徱徳徴徶愨愬愳愸愻愿慁慂慇態慐慒慓慕慖慘慚慛慝慞慟慡慢慣慬慯慱慲慳慴慵慷慺慻慽憀憁憆憏憜戧戨戩截戫戬搫搴搻搿摌摍摎摏摐摑摔摕摖摗摘摚摜摝摞摟摠摢摣摤摥摦摧摪摫摬摭摮摱摲摳摴摵摶摷摹摺摻摼摽摾摿撁撂撄撇撖撦撯撱撾擆敱敲敳敶斠斡斲旖旗暚暜暝暞暟暠暡暢暣暤暥暦暧暨曄曅朄朅朢榍榎榏榐榑榒榓榕榖榗榚榛榜榝榞榟榠榡榢榣榤榥榦榧榨榩榪榫榬榭榮榯榰榱榲榴榶榷榸榹榺榻榼榽榿槀槁槂槃槄槅槇槈槉槊構槍槏槑槒槓槔槕槖槗様槙槚槛槜槝槞槟槠槡槤槨槩槪槫槬槭槮槯槰樃樄樆樇樋模樤樥樺歉歊歋歍歰歴殝殞殠殡毄毓毾氳滎滫滬滮滯滰滱滲滳滴滵滷滸滹滺滻滼滽滾滿漁漂漃漄漅漆漇漈漉漊漋漌漍漎漏漑演漕漖漗漘漙漚漛漜漝漞漟漡漢漤漥漧漩漪漫漬漮漯漰漱漲漳漴漵漶漸漹漺漻漼漾潀潂潃潄潅潆潇潈潉潊潋潌潍潎潒潢潩潳潴澉澚濄煛煹煻煼煽煾煿熀熁熂熃熄熅熆熇熈熉熊熋熌熎熏熐熑熒熔熕熖熗熘熙熚熢熥熬燁爳爾牄牓牔犒犓犔犕犖犗獃獄獌獍獐獑獔獕獙獚瑠瑡瑢瑣瑤瑦瑧瑨瑪瑫瑭瑮瑱瑲瑴瑶瑷瑸瑹璃璈璉璍璓甇甈甉甍甧畻畼畽疐疑瘇瘈瘉瘊瘋瘌瘍瘎瘒瘓瘕瘖瘗瘘瘙瘟瘣瘥瘦瘧瘩皶皷皸皹盠盡盢監睮睯睱睲睳睴睵睶睸睺睻睼睽睾睿瞀瞁瞂瞃瞅瞆瞇瞍碝碞碟碠碡碣碥碦碧碨碩碪碫碬碭碮碯碱碲碳碴碵碶碷碸碹磀磁磆磈磋磓禚禛禝禞禟禠禡禢禣稦稧稨稩稪稫稬稭種稯稰稱稲稳稵穁穊窨窪窫窬窭竬竭竮端竰箁箂箃箄箅箆箇箈箉箊箋箌箍箎箏箐箑箒箓箔箕箖算箘箙箚箛箜箝箞箟箠管箢箣箤箥箦箧箨箩箪箫箬箸粶粷粸粹粺粻粼粽精粿糁綜綝綞綟綠綡綢綣綥綦綧綨綩綪綫綬維綮綯綰綱網綳綴綵綶綷綸綹綺綻綼綽綾綿緀緁緂緃緄緅緆緇緈緉緊緋緌緍緎総緐緑緒緓緔緕緢緺缥缦缧缨缩缪缫罁罂罯罰罱罳罴羫翞翟翠翡翢翣翤翥耣耤耥聙聚聛聜聝聞聟聡聢聣肇肈腐膀膁膂膃膅膆膈膉膊膋膌膍膎膏膐膑膖膜臧臺舆舓舔舕舝舞艊艋艌艍蓭蓯蓰蓲蓳蓴蓵蓶蓷蓸蓺蓻蓼蓾蓿蔁蔂蔄蔅蔆蔈蔉蔊蔋蔌蔍蔎蔏蔐蔑蔒蔓蔔蔕蔖蔗蔘蔙蔚蔛蔜蔝蔞蔟蔠蔡蔢蔣蔤蔥蔦蔧蔨蔩蔪蔫蔮蔰蔲蔳蔴蔵蔶蔷蔸蔹蔺蔻蔼蔽蕏蕖蕯薌薖虠蜀蜘蜙蜚蜛蜜蜝蜞蜟蜠蜡蜢蜤蜥蜦蜧蜨蜩蜪蜫蜬蜭蜮蜯蜰蜱蜲蜳蜴蜶蜷蜸蜺蜻蜼蜽蜾蜿蝀蝁蝂蝃蝄蝅蝇蝈蝉蝊蝋蝕蝧蝫蝸螂裫裳裴裵裹裻製褅褆複褈褉褊褋褌褍褐褑褓褔褕褖褗褘褙褛褝褞褡褨褪覝覞覟覠覡觏觨觩觪觫訚誋誌認誎誏誐誑誒誓誖誗誘誙誚誛誜誝語誟誡誢誣誤誥誦誧誨誩說誫説読誮誾谭谮谯谰谱谲谽豧豨豩豪貋貌貍賏賐賑賒賓賔賕賖賗賘赘赙赚赛赫趕趖趗趘趙趚跼跽跾跿踀踁踂踃踄踅踆踇踈踉踊踋踌踍踎躴躵輍輎輏輐輑輒輓輔輕辕辖辗辡辢辣遦遧適遪遫遬遭遮遯遰遱鄦鄧鄩鄪鄫鄬鄭鄮鄯鄰鄱鄲酲酳酴酵酶酷酸酹酺酻酼酽酾酿鈭鉵鉶鉷鉸鉹鉺鉻鉼鉽鉾鉿銀銁銂銃銄銅銆銇銈銉銊銋銌銍銎銐銑銒銓銔銕銖銗銘銙銚銛銜銝銞銟銠銡銢銣銤銥銦銧銨銩銪銫銬銭銮銯銱鋁鋋鋌鋣鋩鋮锲锴锵锶锷锸锹锺锻锼锽锾锿镀镁镂镃镄镅閡関閣閤閥閦閧閨閩閪閭閮阚隢隣隤隥隧隨隩隫雌雐雑雒雿需霁霆靗靘静靤靺靻靼靽靾靿鞀鞁鞂鞃鞄鞅鞆韍韎韬韶韷頔頕頖頗領頙頚颗颭颮颯颰颱飖飗飸餁餂餃餄餅餆餇餉餌餎餏馑馒馛馜馝馶馷馸馹馻馼馽馾馿駀駁駂駃駄駅駆駇駏骠骡骢骲骳骵骶骷髚髣髤髥髦髧髨髩髪鬦魃魄魅魆魟魠魡魢魥鲑鲒鲓鲔鲕鲖鲗鲘鲙鲚鲛鲜鲝鲞鲟鳱鳲鳳鳴鳵鳶鹕鹖鹗鹘鹙鹚鹛鹜麧麼麽鼏鼐鼑鼻齊龇龈',
                '僵僶僸價僺僻僼僽僾僿儀儁儂儃億儅儇儈儉儊儋儌儍儎儏儙儚冪凙凚凛凜劅劆劇劈劉劊劋劌劍劎劏劐勮勯勰勲匔匳厱叇嘠嘪嘫嘬嘭嘮嘰嘱嘲嘳嘵嘶嘷嘸嘹嘺嘻嘼嘽嘾嘿噀噁噂噃噄噅噆噇噈噊噋噌噍噎噏噐噒噓噔噕噖噗噘噙噚噛噜噝噠噢噧噴噵噶圚墀墝增墟墠墡墢墣墤墥墦墧墨墩墪墫墯墰墱墲墳墵墶墹墺壿夀夦奫奭嫴嫵嫶嫸嫺嫻嫼嫽嫾嫿嬀嬁嬂嬃嬄嬆嬇嬈嬉嬊嬌嬍嬎嬏嬘嬞審寪寫寭寮寯導尵層履屦屧嵹嶏嶑嶒嶓嶔嶕嶖嶗嶘嶙嶚嶛嶜嶝嶟嶠嶡嶢嶣嶤嶥嶯嶱嶲嶴巤幜幝幞幟幠幡幢幤幥幩廚廛廝廞廟廠廡廢廤彈影徲徵德徸徹徺慗慙慜慤慦慧慫慭慮慰慶慸慹慼慾慿憂憃憄憅憇憈憉憋憍憎憐憒憓憔憕憘憚憛憞憟憡憢憣憤憦憧憨憪憫憬憭憮憯憰憱憳憽懂懏戭戮戯摨摩摯摰撀撃撅撆撈撊撋撌撍撎撏撐撑撒撓撔撕撗撘撙撚撛撜撝撞撟撠撡撢撣撤撥撧撨撩撪撫撬播撮撰撲撳撴撵撷撸撹撺撻擏擒擕擖擛敵敷數敹敺敻斢斳暩暪暫暬暭暮暯暰暱暲暳暴暵暶暷暹暼曂曃曏槢槣槥槦槧槱槲槳槴槵槶槷槸槹槺槻槼槽槾槿樀樁樂樅樈樉樊樌樍樎樏樐樑樒樓樔樕樖樗樘標樚樛樜樝樞樟樠樢樣樦樧権横樫樬樭樮樯樰樱橄橗橡橢橥檛歎歏歐歑歒歓歔歵歶殢殣殤殥殦毃毅毆毿氀氁氂滕漀漐漒漦漽漿潁潏潐潑潓潔潕潖潗潘潙潛潜潝潟潠潡潣潤潥潦潧潨潪潫潬潭潮潯潰潱潲潵潶潷潸潹潺潻潼潽潾潿澁澂澄澅澆澇澈澊澋澌澍澎澏澐澑澒澓澔澕澖澗澘澙澛澜澝澳澻澾濆濎濐熛熜熝熞熟熠熡熣熤熦熧熨熩熪熫熭熮熯熰熱熲熳熴熵熼熿爴牅牕牖牗犘犙犚犛獋獎獖獗獘獛獜獝獞獟獠獡獢獤獦瑩瑬瑺瑻瑼瑽瑾璀璁璂璄璅璆璇璊璋璌璎璖璜璡甊甋甌甎畾畿瘚瘛瘜瘝瘞瘠瘡瘢瘤瘨瘪瘫瘼癊皚皛皜皝皞皣皺盤瞈瞉瞊瞋瞌瞎瞏瞐瞑瞒瞓瞙瞝瞢瞱確碻碼碽碾碿磂磃磄磅磇磉磊磌磍磎磏磐磑磒磔磕磗磘磙磝磤禜禤禥禩稴稶稷稸稹稺稻稼稽稾稿穀穂穃窮窯窰窱窲窳窴箭箮箯箰箱箲箳箴箵箶箷箹箺箻箼箽箾箿篁篂篃範篅篆篇篈篊篋篌篍篎篏篐篑篒篓篨糂糃糄糅糆糇糈糉糊糋糌糍糎糔緖緗緘緙線緛緜緝緞緟締緡緣緤緥緦緧編緩緪緫緬緭緮緯緰緱緲緳練緵緶緷緸緹緼緽緾緿縀縁縂縃縄縅縆縇縋縌縎縒缬缭缮缯罵罶罷罸罼羬羭羮羯羰翦翧翨翩翪翫翬翭耦耧聤聥聦聧聨聩聪聫聭膒膓膔膕膗膘膚膛膝膞膟膠膡膢膣膤膵膷膼臱舖舗艎艏艐艑艒艓艔艖艘蓹蔃蔬蔾蔿蕀蕁蕂蕃蕄蕅蕆蕇蕈蕉蕊蕋蕌蕍蕎蕐蕑蕒蕓蕔蕕蕘蕙蕚蕛蕜蕝蕞蕟蕠蕡蕢蕣蕤蕥蕦蕧蕨蕩蕪蕫蕬蕮蕰蕱蕲蕳蕴蕵蕸蕺薁薘薡藔虢蜵蝌蝎蝏蝐蝑蝒蝓蝔蝖蝗蝘蝙蝚蝛蝜蝝蝞蝟蝠蝡蝢蝣蝤蝥蝦蝨蝩蝪蝬蝭蝮蝯蝰蝱蝲蝳蝴蝵蝶蝷蝹蝺蝻蝼蝽蝾蝿螀螁螆螋螖螝衚衛衜衝裦褎褏褒褜褟褠褢褣褤褥褦褫褬褯褲褳褴褵襅覢覣覤覥覩觐觑觬觭觮觯觰誯誰誱課誳誴誵誶誷誸誹誺誻誼誽調諀諁諂諃諄諅諆談諈諉諊請諌諍諎諏諐諑諒諓諔諕論諗諘諙諚諛諣諸諾谳谴谵谾豌豍豎豫豬貎貏貓賙賚賛賜賝賞賟賠賡賢賣賤賥賦賧賨賩質賫賬賭赜赭趛趜趝趞趟趠趡趢趣趤踏踐踑踒踓踔踕踖踗踘踙踚踛踜踝踞踟踠踡踢踣踤踥踦踧踨踩踪踫踬踭踮踯踷踺踻蹃躶躷躸躹躺躻躼輖輗輘輙輚輛輜輝輞輟輠輡輢輣輤輥輦輧輨輩輪輫輬辘辤辳遲遴遵遶遷選遹遺遻遼邁邆郶鄳鄴鄵鄶鄷鄸醀醁醂醃醄醅醆醇醈醉醊醋醌醏銲銳銴銵銶銷銸銹銺銻銼銽銾銿鋀鋂鋃鋄鋅鋆鋇鋈鋉鋊鋍鋎鋏鋐鋑鋒鋓鋔鋕鋖鋗鋘鋙鋚鋛鋜鋝鋞鋟鋠鋡鋢鋤鋥鋦鋧鋨鋪鋫鋬鋭鋯鋰鋱鋲鋳鋴鋵鋶錒錵錺錻镆镇镈镉镊镋镌镍镎镏镐镑镒镓镔镕閫閬閯閰閱閲閳閴阛隦險雓霂霃霄霅震霈霉霊靚靠靥鞇鞈鞉鞊鞋鞌鞍鞎鞏鞐鞑鞒鞗韏韐韑韯韰頛頜頝頞頟頠頡頢頣頦頧頨頩頪頫頬頲题颙颚颛颜额颲颳飘飺餈養餋餍餑餒餓餔餕餖餗餘餙馓馔駈駉駊駋駌駍駎駐駑駒駓駔駕駖駗駘駙駚駛駜駝駞駟駠骣骴骸骹骺骻骼骿髛髫髬髮髯髰髱髲髳髴鬧魇魣魤魦魧魨魩魪魫魬魭魮魯魰魱魲魳魴魵魶魷魸魹鮔鲠鲡鲢鲣鲤鲥鲦鲧鲨鲩鲪鲫鲬鳷鳸鳹鳺鳻鳼鳽鳾鳿鴀鴁鴂鴃鴄鴅鴆鴇鴈鴉鴋鴌鴍鴎鴔鹝鹞鹟鹠鹡鹢鹣鹤鹶麃麄麨麩麪麫麹麾黅黆黎黓黙鼒齑齒龉龊',
                '亸儐儑儒儓儔儕儖儗儘儛儜儝儞儣儫兣冀凝凞劑劒劓劔勳勵匴叡嘯嘴噞噟噡噣噤噥噦器噩噪噫噬噭噮噯噰噱噲噳噷噸噹噺噻噼嚃嚄嚆圛圜墻墼墽墾墿壀壁壂壃壄壅壆壇壈壉壊壋壌壒夁奮奯嬐嬑嬒嬓嬔嬕嬖嬗嬙嬚嬛嬜嬝嬟嬠嬡嬢嬨嬩嬳嬴學孹寰嶦嶧嶨嶩嶪嶫嶬嶭嶮嶰嶳嶵嶶嶼幦幧幨幪幯廥廦廧廨廩廪彇彊彋彛彜徻徼憊憌憑憖憗憙憝憠憥憩憲憴憶憷憸憹憺憻憼憾憿懀懁懄懅懆懈懊懌懍懎懐懒懓懔懙懜懞戰戱撉撼撽撿擀擁擂擃擄擅擇擈擉擋擌操擎擐擑擓擔擗擙據擜擝擞擭擳攳整敼敽敾敿斓斴旘旙暸暺暻暽暾暿曀曁曆曇曈曉曊曋曌曍曔朆朣朤朥樨樲樳樴樵樶樷樸樹樻樼樽樾樿橀橁橂橃橅橆橇橈橉橊橋橌橍橎橏橐橑橒橓橔橕橖橘橙橛橜橝橞機橠橣橤橦橧橨橩橪橫橬橭橮橯橰橱橲橳橴橵橶橷橸橹橺橻橼橽檃檇檎檖檙檝檠檤檧檨歕歖歘歙歚歷殧殨殪殫毇毈氃氄氅氆氇潚潞澃澞澟澠澡澢澣澤澥澦澧澨澪澫澬澭澮澯澰澱澲澴澵澶澷澸澹澺澼澽澿激濁濂濃濅濇濈濉濊濋濍濏濑濒濓濖濗濛濨濩濸瀄熶熷熸熹熺熻熾燀燂燃燄燅燆燇燈燉燊燋燌燍燎燏燐燑燒燓燔燕燖燗燘燙燚燛燜燝燞營燠燤燧燪燵犜犝犞犟獣獥獧獨獩獪獫獬獭獲獴瑿璏璑璒璔璕璘璙璚璝璞璟璠璢璣璤璥璭璲瓢甏甐甑甒疀疁疂瘬瘭瘮瘯瘰瘱瘲瘳瘴瘵瘶瘷瘸瘹瘺瘻瘽瘾瘿癀癃皟皠皡皻盥盦盧瞔瞕瞖瞗瞘瞚瞛瞜瞞瞟瞠瞡瞣瞥瞰磖磚磛磜磞磟磠磡磢磣磥磦磧磨磩磪磫磬磭磮磲磺禧禨禪禫禭穄穅穆穇穈穋穌積穎穏穐穑穒穓穔窵窶窷窸窹窺窻窼窽窿竱築篔篕篖篗篘篙篚篛篜篝篞篟篠篡篢篣篤篥篦篧篩篪篫篬篭篮篯篰篱篳篴篷簉簑簔糏糐糑糒糓糕糖糗糘糙糚糢緻縈縉縊縍縏縐縑縓縔縕縖縗縘縙縚縛縜縝縞縟縠縡縢縣縤縥縦縧縨縪縫縭縸縺缰缱缲缳缴罃罹罺罻羱羲翮翯翰翱翴耨耩耪聬聮聱膙膦膧膨膩膪膫膬膭膮膯膰膱膲膳膴膶膸膹臇臈臲臻興舉舘艕艗艙蕗蕭蕶蕷蕹蕻蕼蕽蕾蕿薀薂薃薄薅薆薇薈薉薊薋薍薎薏薐薑薒薓薔薕薗薙薚薛薜薝薞薟薠薢薣薤薥薦薧薨薩薪薫薬薭薮薯薳薽藇虣虤虥虦螃螄螅螇螈螉螊螌融螎螏螐螑螒螓螔螕螗螘螙螚螛螜螞螟螠螡螢螣螤螥螦螧螨螩螭螯螴螶蟆蟇蟒衞衟衠衡褧褩褭褮褰褱褶褷褸褹褾褿襀襂襐襒襔覦覧覨親觱諜諝諞諟諠諡諢諤諥諦諧諨諩諪諫諬諭諮諯諰諱諲諳諴諵諶諷諹諺諻諼諽諿謀謁謂謃謉謊謎謏謔豭豮豱貐貑貒賮賯賰賱賲賳賴賵赝赞赟赠赬赮趥趦趧踰踱踲踳踴踵踶踸踹踼踽踾踿蹀蹁蹂蹄蹅蹆蹉躽躾輭輮輯輰輱輲輳輴輵輶輷輸輹輺輻輼辙辚辥辦辧辨辩遽遾避邀邂還邅郺鄹鄺醍醎醐醑醒醓醔醕醖醗醙醚醛醜醝鋷鋸鋹鋺鋻鋼鋽鋾鋿錀錁錂錃錄錅錆錇錈錉錊錋錌錍錎錏錐錑錓錔錕錖錗錘錙錚錛錜錝錞錟錠錡錢錣錤錥錦錧錨錩錪錫錬錭錮錯錰錱録錳錴錶錷錸錹錼錽錾錿鍀鍁鍂鍃鍄鍅鍆鍈鍋鍣鍩鍵鍺鎁鎯镖镗镘镙镚镛镜镝镞镟镠镼閵閶閷閸閹閺閻閼閽閾閿闀闁闂闍隬隭隮隯隰隱隲隷雔雕霋霌霍霎霏霐霑霒霓霔霕霖霗霙靛靜靦鞓鞔鞕鞖鞘鞙韒韸頤頥頭頮頯頰頱頳頴頵頶頷頸頹頺頻頼頽颞颟颠颡颴颵飙飚餐餚餛餜餝餞餟餠餡餢餣餤餦餧館餩馞馟馠駡駢駣駤駥駦駧駨駩駪駫駬駭駮駯駰駱駲駳骽骾髭髵髶髷髸髹髺髻鬇鬨鬳魈魉魺魻魼魽魾魿鮀鮁鮂鮃鮄鮅鮇鮈鮉鮊鮋鮌鮍鮎鮏鮐鮑鮒鮓鮕鮖鮗鮘鮣鲭鲮鲯鲰鲱鲲鲳鲴鲵鲶鲷鲸鲹鲺鲻鴊鴏鴐鴑鴒鴓鴕鴖鴗鴘鴙鴚鴛鴝鴞鴟鴠鴡鴢鴣鴤鴥鴦鴧鴨鴩鴪鴫鴬鹥鹦鹧鹨鹷鹾麅麆麇麈麬麭麮麺黇黈黉黔黕黖黗默黺鼼鼽齓龍',
                '償儠儡儢儤儥儦儧儨儩優儬儰儲凟劕勴勶匵厳噽噾噿嚀嚁嚂嚅嚇嚈嚉嚊嚋嚌嚍嚎嚏嚐嚑嚒嚓嚝嚮嚺壍壎壏壐壑壓壔壕壖壗壙嬣嬤嬥嬦嬧嬪嬫嬬嬭嬮嬯嬰嬱嬲嬵嬶嬷嬺孺孻寱寲尶尷屨嶷嶸嶹嶺嶻嶽嶾嶿巁幫幬幭彌彍徽徾憵懃懇應懋懑懗懚懛懝懠懡懢懤懥懦懧懨懩懭懱戲戴擊擘擟擠擡擢擣擤擦擧擨擩擫擬擮擯擰擱擲擴擿攁攃斀斁斂斃斣斵斶旚曎曐曑曒曓曕曖曗曙曚朦橚橾橿檀檁檂檄檅檆檈檉檊檋檌檍檏檐檑檒檓檔檕檗檘檚檜檞檟檡檢檣檥檦檩檪檬檴櫆櫛櫣歗歛歜歝歟殩殬殭殮毚氈氉氊氋澀澩濌濔濕濘濙濚濜濝濞濟濠濡濢濣濤濥濦濧濪濫濬濭濮濯濰濱濲濴濵濶濹濻濿瀁瀇瀎瀞瀡熽燡燢燣燥燦燨燩燫燬燭燮燯燰燱燲燳燴燶燷爵牆犠獮獯獰獱獳獷璐璗璛璦璨璩璪璫璬璮璯環璱璳璴璵瓁瓂甓甔甕疃疄癁療癄癅癆癇癈癉癋癌癍癎癘皢皤皥皼盨盩盪瞤瞦瞧瞨瞩瞪瞫瞬瞭瞮瞯瞲瞳瞴瞵瞶瞷瞸矯矰磯磰磱磳磴磵磶磷磸磹磻磼磽磾磿礀礁礂礃礄礅礇礈礍禦禬禮禯穉穕穖穗穘穙穚穛穜穝穞穟窾竀竁竂竃竲竳竴篲篵篶篸篹篺篻篼篾篿簀簁簂簃簄簅簆簇簈簊簋簌簍簎簏簐簒簓簕簖簗簘簧簻糛糜糝糞糟糠糡縩縬縮縯縰縱縲縳縴縵縶縷縹縻縼總績縿繀繁繂繃繄繅繆繇繈繉繊繋繌繍繤罄罅罆罽罾罿羀羁翲翳翵翶翼耫耬聯聰聲聳聴膥膺膻膽膾膿臀臁臂臃臄臅臆臉臊臌臒臨臩舊艚艛艜艝艱薰薱薲薴薵薶薷薸薹薺薻薼薾薿藀藁藂藃藄藅藆藈藉藊藋藌藍藎藏藐藑藒藓藗藡藬藱蘤虧虨螪螫螬螮螰螱螲螳螵螷螸螹螺螻螼螽螾螿蟀蟁蟂蟃蟄蟅蟈蟉蟊蟋蟌蟍蟎蟏蟐蟑蟓蟝蟞蟥蠁蠎褺褻褼褽襁襃襄襆襇襈襉襊襋襌襍襎襏襑襓襕襖襚覫覬覭覮覯觲觳謄謅謆謇謈謋謌謍謐謑謒謓謕謖謗謘謙謚講謜謝謞謟謠謡謢謧謨謩謷謸谿豀豁豏豯豰豲豳貔貕貖貘賶賷賹賺賻購賽贅赡赢赯趨蹇蹈蹊蹋蹌蹍蹎蹏蹐蹑蹒蹓蹕蹥輽輾輿轀轁轂轃轄轅轋辪辫邃邇邈邉鄻鄼鄽鄾鄿醘醞醟醠醡醢醣醤醨鍇鍉鍊鍌鍍鍎鍏鍐鍑鍒鍓鍔鍕鍖鍗鍘鍙鍚鍛鍜鍝鍞鍟鍠鍡鍢鍤鍥鍦鍧鍨鍪鍫鍬鍭鍮鍯鍰鍱鍲鍳鍴鍶鍷鍸鍹鍻鍼鍽鍾鍿鎀鎂鎃鎄鎅鎆鎇鎈鎚鎝鎡鎪鎺镡镢镣镤镥镦镧镨镩镪镫闃闄闅闆闇闈闉闊闋闌闎闏隳隸雖雘雚霘霚霛霜霝霞霟霠霡鞚鞛鞜鞝鞞鞟鞠鞡鞬韓韔韕韱韺顀顁顂顃顄顅顆顇顈顉顊颶颷餥餪餫餬餭餯餰餱餲餳餴餵餶餷餸餽餿馘馡馢馣駴駵駶駷駸駹駺駻駼駽駾駿騀騁騂騃骤髀髁髼髽髾髿鬀鬁鬂鬴魊魋魌魍魎魏鮆鮙鮚鮛鮜鮝鮞鮟鮠鮡鮢鮤鮥鮦鮧鮨鮩鮪鮫鮬鮭鮮鮯鮰鮱鮲鮳鮴鮺鯅鯈鯎鯐鲼鲽鲾鲿鳀鳁鳂鳃鳄鳅鳆鳇鳈鳉鳊鳋鴜鴭鴮鴯鴰鴱鴲鴳鴴鴵鴶鴷鴸鴹鴺鴻鴼鴽鴾鴿鵀鵁鵂鵃鵄鵅鵆鵇鵈鵉鵐鹩鹪鹫鹬麉麊麋麯麰麿黊黋黏黚黛黜點黻黿鼢鼣鼤鼾鼿齋齔齢龋龌龜龠',
                '儭儮儯儱儵冁叢嚔嚕嚖嚗嚘嚙嚚嚛嚜嚞嚟嚠嚡嚢嚣嚤壘壝夑奰嬸嬻嬼屩屪巀巂幮廫彝彞懕懖懘懟懣懪懫懬懮懰懳懴懵戳擥擪擵擶擷擸擹擺擻擼擽擾攂攄攅攆斔斷旛旞曘曛曜曞曠檫檭檮檯檰檱檲檳檵檶檷檸檹檺檻檼檽檾檿櫀櫁櫂櫃櫄櫅櫇櫈櫉櫊櫎櫒櫔櫗櫙櫚櫡櫭歞歸殯毉濷濺濼濽濾瀀瀂瀃瀅瀆瀈瀉瀊瀋瀌瀍瀏瀐瀑瀒瀓瀔瀦燸燹燺燻燼燽燾燿爀爁爃爄爇爌爗犡獵獶璧璶璸璹璻璼璾璿瓀瓊瓋瓍甖疅癏癐癑癒癓癔癕癖癗癙癚癛癜癝癞癤皦皧皨皽盫盬瞹瞺瞻瞼瞽瞾瞿矀矁矂矆矇矱礆礉礊礋礌礎礏礐礑礒礓礔礕礖礚礜礞礠礡禰禱禲穠穡穢穣穥穫竄竅竆竵篽簙簚簛簜簝簞簟簠簡簢簣簤簥簦簨簩簪簭簮簯簰簱簲簶糣糤糥糦糧糨繎繏繐繑繒繓織繕繖繗繘繙繚繛繜繝繞繟繠繢繣繥繦繧繨繭繸罇罈罉羂羃羳羴羵翷翸翹翺翻耭耮聵聶職臍臎臏臐臑臓臗舙艞艟艠艥藕藖藘藙藚藛藜藝藞藟藠藢藣藤藥藦藧藨藩藪藫藭藯藰藲藳藴藵藷藸虩蟔蟖蟗蟘蟙蟚蟛蟜蟟蟠蟡蟢蟣蟤蟦蟧蟨蟩蟪蟫蟬蟭蟮蟯蟱蟲蟳蟴蟵蟼蟽蠂蠄蠆蠇襗襘襙襛襜襝襟襠襡襢覆覰覱覲観覷觴觵謣謤謥謦謪謫謬謭謮謯謰謱謲謳謴謵謶謹謺謻謼謾譀譁譇豂豃豐豴豵貗貙賾賿贀贁贂贃贄趩趪蹔蹖蹗蹘蹙蹚蹛蹜蹝蹞蹟蹠蹡蹢蹣蹤蹦蹧蹩躀躇躿軀軁轆轇轈轉轊轌辬邊邋邌鄨酀酂醥醦醧醩醪醫醬釐鎉鎊鎋鎌鎍鎎鎏鎐鎑鎒鎓鎔鎕鎖鎗鎘鎙鎛鎜鎞鎟鎠鎢鎣鎤鎥鎦鎧鎨鎩鎫鎬鎭鎮鎰鎱鎲鎳鎴鎵鎶鎷鎸鎹鎻鎼鎽鎾鎿鏈鏊鏌鏠鏵镬镭镮镯镰镱闐闑闒闓闔闕闖闗闘隴雗雙雛雜雝雞雟雠離霢霣霤霥霧霩靝鞢鞣鞤鞥鞦鞧鞨鞩鞪鞫鞭鞮鞯鞰韖韗韘韙韚韞韹頾頿顋題額顎顏顐顑顒顓顔顕颢颣颸颹颺颼颾餮餹餺餻餼餾饀饁饂饃饆饈馤馥馦馧騄騅騆騇騈騉騊騋騌騍騎騏騐騑騒験騝騧髂髃髄髅髊髜鬃鬄鬅鬆鬈鬩鬵鬶鮵鮶鮷鮸鮹鮻鮼鮽鮾鮿鯀鯁鯂鯃鯄鯆鯇鯉鯊鯋鯌鯍鯏鯑鯒鯓鯽鳌鳍鳎鳏鳐鳑鳒鵊鵋鵌鵍鵎鵏鵑鵒鵓鵔鵕鵖鵗鵘鵙鵚鵛鵜鵝鵞鵟鵠鵢鵣鵤鵥鹭鹮鹯鹰麌麍麎麏麐麱麲黝黟黠黡鼀鼁鼂鼕鼖鼥鼦鼧鼨鼩鼪鼫鼬齀齁齌齕龎',
                '儳儴劖勷勸厴嚥嚦嚧嚨嚩嚪嚫嚬嚭嚯嚰嚴壚壛壜壞壟壠壡壢夒夓嬹嬽嬾嬿孼孽寳寴寵屫巃巄巅巆巌幰廬廭彟徿懯懲懶懷懻攀攇攈攉攊攋攌攍攎攏攐攑攒攚斄旜旝旟曝曟曡曢櫋櫌櫍櫏櫐櫑櫓櫕櫖櫘櫜櫝櫞櫟櫠櫢櫤櫥櫦櫧櫫櫲櫵歠殰殱氌濳瀕瀖瀗瀘瀙瀚瀛瀜瀝瀟瀠瀢瀣瀤瀥瀧瀨瀩瀫瀬瀭瀮瀯瀳爂爅爆爈爉爊爍爎爑爕牘犢犣犤犥犦獸獹獺璷璺璽瓃瓄瓅瓆瓇瓈瓉瓣疆疇癟癠癡癢癣皩矃矄矅矈矉矊矋矌矎礗礘礙礛礝礟礢礣礤礦礪穤穦穧穨穩穪穬簫簬簳簴簵簷簸簹簺簼簽簾簿籀籁籂籅籆籈糩糪糫糬糭繡繩繪繫繬繮繯繰繱繲繳繴繵繶繷繹繺繾纄缵罊罋羄羅羆羶羷羸羹翽翾耯聸聼臋臔臕臘舋舚艡艢艣艤艧艨艶藮藶藹藺藻藼藽藾藿蘀蘁蘂蘃蘄蘅蘆蘇蘈蘉蘊蘋蘍蘎蘏蘐蘑蘒蘓蘔蘕蘟蘢蘣蘧蟕蟰蟶蟷蟸蟹蟺蟻蟾蟿蠀蠃蠅蠈蠉蠊蠋蠌蠍蠏蠓蠖蠞襞襣襤襥襦襧襨襪覇覈覴覵覶覸觶觹謽謿譂譃譄譆譈證譊譋譌譎譏譐譑譒譓譔譕譖譗識譙譚譛譜警譪谶豶豷貚贆贇贈贉贊贋贌贎趫趬趭蹨蹪蹫蹬蹭蹮蹯蹰蹱蹲蹳蹴蹵蹶蹷蹸蹹蹺蹻蹼蹽蹾蹿躂躉軂軃軄軅轍轎轏轐轑轒轓轔轕辭辴邍酁酃酄醭醮醯醰醱鏀鏁鏂鏃鏄鏅鏆鏇鏉鏋鏍鏎鏏鏐鏑鏒鏓鏔鏕鏖鏗鏘鏙鏚鏛鏜鏝鏞鏟鏡鏢鏣鏤鏥鏦鏧鏨鏩鏪鏫鏬鏭鏮鏯鏰鏱鏲鐄鐆鐊鐌鐯鐹镲闙闚闛關闝闞隵雡難霦霨霪霫霬霭霳靡鞱鞲鞳鞴鞵鞶鞷鞸鞹鞾韛韜韝韟韠韡韲韻韼顖顗願顙顚顛顜顝類颤颻颽颿飀饄饅饇饉騔騕騖騗騘騙騚騛騜騞騟騠騡騢騣騤騥騦騨騩騭騰騲騷骥髆髇髈髉髋髌鬉鬊鬋鬌鬍鬎鬏鬷魐魑鯔鯕鯖鯗鯘鯙鯚鯛鯜鯝鯞鯟鯠鯡鯢鯣鯤鯥鯦鯧鯨鯩鯪鯫鯬鯭鯮鯯鯰鯱鯲鯳鯴鯵鰎鳓鳔鳕鳖鳗鳘鳙鳚鳛鵡鵦鵧鵨鵩鵪鵫鵬鵭鵮鵯鵰鵱鵲鵳鵴鵵鵶鵷鵸鵹鵺鵻鵼鵽鵾鵿鶀鶁鶂鶃鶄鶅鶆鶇鶈鶉鶊鶋鶌鶍鶎鶏鶐鶑鶓鶜鶧鹱鹲鹸鹹麑麒麓麔麕麖麗麳麴黀黢黣黼鼃鼄鼗鼭鼮齍齖齗齘龏龐',
                '儶兤匶匷嚱嚲嚳嚵嚶嚷嚸嚹嚼嚽嚾嚿壣壤壥壦孀孁孂孃孄孅孆孉孾寶巇巈巉巊巍巏幱廮廯廰忀忁懸懹懺懽攓攔攕攖攗攘攙斅斆曣曤曥曦曧曨朧櫨櫩櫪櫬櫮櫯櫰櫱櫳櫴櫶櫸櫽櫿欂瀪瀰瀱瀲瀴瀵瀶瀷瀸瀹瀺瀻瀼瀽瀾瀿灀灁灂灆灌爋爏爐爒爓爔爖爘犧犨獻獼獽獾瓌瓎瓏瓐瓑瓒甗疈癥癦皪皫皾盭矍矏矒矲礥礧礨礩礫礬穭穮穯竇競竷籃籄籇籉籊籋籌籍籎籏籕糮糯糰糲繻繼繽繿纀纁纂纃纊罌羺翿耀聹聺聻臖臙臚臛臜艦艩蘌蘖蘗蘘蘙蘚蘛蘜蘝蘞蘠蘡蘥蘦蘨蘩蘪蘫蘭蘮蘯蘰蘳蘶蠐蠑蠒蠔蠕蠗蠘蠙蠚蠛蠣衊襩襫襬襭襮覹覺覻觷觸譍譝譞譟譠譡譢譣譤譥譧譨譩譫譬譭譮譯議譱譲譴護譽豑賸贍趮躁躃躄躅躆躈軆轖轗轘轙轚轝辮酅酆醲醳醴醵醶醷醸釋鏳鏶鏷鏸鏹鏺鏻鏼鏾鏿鐀鐁鐂鐃鐅鐇鐈鐉鐋鐍鐎鐏鐐鐑鐒鐓鐔鐕鐖鐗鐘鐙鐚鐛鐜鐝鐞鐟鐠鐡鐢鐣鐤鐥鐦鐧鐨鐩鐫鐭鐷鐼镳镴镽闟闠闡闢闣闤闥闦闧霮霯霰霱霴霵鞺鞻韽韾響顟顠顡顢顣颥飁飂飃飄饊饋饌饍饎饐饑饒饓饗饙馨騪騫騬騮騯騱騳騴騵騶騸驀驁驊骦骧髍髎髏鬐鬑鬒鬓鬔鬪鬸魒魓魔魖鯶鯷鯸鯹鯺鯻鯼鯾鯿鰀鰁鰂鰃鰄鰅鰆鰇鰈鰉鰊鰋鰌鰍鰏鰐鰑鰒鰓鰔鰕鰖鰗鰘鰙鰚鰛鰠鰦鰰鱀鳜鳝鳞鳟鶒鶔鶕鶖鶗鶘鶙鶚鶛鶝鶞鶟鶠鶡鶢鶣鶤鶥鶦鶨鶩鶪鶫鶻鶿鷀鷌鹺麘麙麚麛麵黁黤黥黦黧黨黩黪鼍鼯鼰齙齚齛齝齞齟齠齡齣龑',
                '儷儸儹儺儼劗劘卛嚻囀囁囂囃囄囆囈夔孇孈寷屬巋巐廱忂懼懾攛攜攝攡斕曩朇櫹櫺櫻櫼櫾欀欁欃欄欅權欌欍歡殲灃灄灅灇灈灉灊灋灍灏灐灕爙爚爛爝爟爢爤犩瓓瓔瓖瓘疉癧癨癩癪癫癮皬矐矑矓礭礮礯礰礱礲礳礴禳禴竈竉籐籑籒籓籔籖纅纆纇纈纉纋續纍纎纏纐罍羻羼耰臝臟艪蘬蘲蘴蘵蘷蘺蠜蠝蠟蠠蠡蠢蠤蠩蠫襯襰襱覼覽觺觼譅譳譵譶譸譹譺譻譼讂贐贑贒贓贔赣趯趰躊躋躌躍躎躏躑軇轛轜轞轟辯邎酇酈醹醺醻鏴鏽鐪鐬鐮鐰鐱鐲鐳鐴鐵鐶鐸鐺鐻鐽鐾鐿鑀鑁鑉鑊鑓鑝雤露霶霷霸霹霺霻霿靀靧鞼鞽鞿韃韢顤顥顦顧顨颦飅飆飇飈飉飊飜饏饖饘饚饛馩騹騺騻騼騽騾騿驂驃驄驅驇驉髐髒髓鬕鬖鬗鬘鬫鬹鬺魕鰜鰝鰞鰟鰡鰢鰣鰤鰥鰧鰨鰩鰪鰫鰬鰭鰮鰯鰱鰲鰷鱁鱃鳠鳡鳢鳣鶬鶭鶮鶯鶰鶱鶲鶳鶴鶵鶶鶷鶸鶹鶺鶼鶽鶾鷁鷂鷃鷄鷅鷆鷇鷈鷉鷊鷋鷍鷎鷏鷔鹻麜麝麶黫黬黭黮黯鼅鼙鼚鼛鼱齎齜齤齥齦齧齨齩龒龡',
                '亹儻囅囇囉囊囋囌囎圝壧奱孊孋孌孍孿巎巑巒巓巔巕巖巗廲彎彲懿戂戵攞攟攠攢攤攦攧櫷欆欇欈欉欋欎氍灑灒灔灖灗灘爜爞爠爡獿玀玁玂瓕瓗瓙瓤疊癬癭皭矔礵礶礷禵穰穱竊竸籗籘籙籚籛籜籝籟籠籡籧糱糴糵纑纒罎罏羇耱耲聽聾臞艫蘱蘸蘹蘻蘼蘽蘾蘿虀虁蠥蠦蠧蠨蠪蠬蠭蠴襲襳襴襶襷覾覿觻觽譾譿讀讁讃讄讅讆讎豄贕贖贗贘躐躒躓躔躕躖躗躚轠轡轢邏邐鑂鑃鑄鑅鑆鑇鑈鑋鑌鑍鑎鑏鑐鑑鑒鑔鑖鑛鑧镵镶镾霼霽霾韀韁韂韄韣頀顩顪顫顭飋饔饕驆驈驋驍驎驏驐驑驒驓驔驕驚髑體髝鬙鬚鬛鬜鬝鬻鰳鰴鰵鰶鰸鰹鰺鰻鰼鰽鰾鰿鱂鱄鱅鱆鱇鱈鱉鱌鱑鱜鳤鷐鷑鷒鷓鷕鷖鷗鷘鷙鷚鷛鷜鷝鷞鷟鷠鷩鹳鹴麞麟黐黰黱鼘鼜鼲鼳鼴鼵齂齪齫齬龓龔龕龢',
                '儽劙劚囏囐囒壨奲孏巘巚彏戀戁戃戄攣攥攨攩攪攫曪曫曬曮欏欐欑欒欕毊灓灙灚灛灜灡玃瓚癯癰禶禷籞籢籣籤籥籦籨纓纔纕纖罐臢艬虃虄虅虇蠮蠯蠰蠱蠳蠸襵襺襼覉觾讇讈讉變讋讌讍讏讐讔豅贏贙贚趱躘躙躛躜躠轣轤醼鑕鑗鑘鑙鑚鑜鑞鑟鑠鑡鑢鑣鑤鑥鑦靁靆靨韅韈韤顬顮顯颧饜馪驌驖驗驙驛驜髕髖髞鬞鬟鬠魗魘魙鱊鱋鱍鱎鱏鱒鱓鱔鱕鱖鱗鱘鱙鱚鱛鱝鷡鷢鷣鷤鷥鷦鷧鷨鷪鷬鷭鷮鷯鷰鷱鷲鷳鷴鷵鷶鷷鷸鷻鷼鹼黂黲黳黴鼆鼇鼶鼷鼸鼹齃齄齏齭齮齯齰齱龝',
                '儾囍囑囓囕壩孎屭巙攬攭斖曭欓欔欗灝灞灟灠爣瓛瓥癱癲矕矖矗矙礸礹穲穳籩籪籬纗羈羉艭艷虂虆虈虉蠲蠵蠶蠷蠹蠺衋衢襸襹襻觀讑讒讓讕讖貛贛贜躝躞躟躤軈醽醾醿釀釂鑨鑩鑪鑫鑬鑮雥雦靂靃靄靅靇靈韆韇韥顰饝驝驞驟鬡鬢鬬鬭鱐鱞鱟鱠鱡鱢鱣鱤鱥鱦鱧鱩鱪鱫鱮鱯鷫鷹鷺鷽鷾鷿鸀鸁鸂鸃鸄鸅鸆鸇鸈鸉鸊鸏鸒鹽麠黌鼞齅齆齲齳齴齵齶齷齹',
                '囔壪廳彠戅戆攮斸曯欖欘欙欚欛欝灢灣爥爦犪矘矡籫籭籮糶纘纙纚纛臠臡蠻襽覊觿讗讘讙讛豒躡躢躣躥鑭鑯鑰鑱鑲鑳鑵靉韉顱顲饞饟馕髗鬣鱨鱬鱭鱰鱴鱶鸋鸌鸍鸎鸐鸑麡黵鼈鼉鼝鼟齇齸齺齻龣',
                '圞欜氎灎灤灦癳矚籯籰糳糷虊虪蠼讚趲躦躧躪轥釁釃釄釅鑴鑶鑷鑸鑹鑺靊顴飌驠驡驢驣驥鱱鱲鱳鱵鸓鸔黶鼊龤龥',
                '灥灧灨犫纜纝虌蠽蠾蠿讜讝讞豓貜躩軉鑻鑼鑽鑾靋靌靍靎顳飍飝饠饡馫驤驦驧驩鬤鬮鬰鱷鱸鸕鸖鸗黷齈',
                '囖戇欞欟爧癴豔躨鑿钀钁钂钄雧驨鸘鸙鸚鸛麢黸鼺齼齽龞',
                '爨纞虋讟钃靏韊驘驪鬱鱹鸜麷',
                '厵癵籱饢驫鱺鸝鸞',
                '灩麣',
                '灪籲龖',
                '爩鱻麤龗',
                '齾',
                '齉',
                '靐'
            );

            return {

                sort: function (list, order_by) {
                    //添加笔画索引
                    _.each(list, function (element, index, list) {

                        //如果存在指定的属性才获取笔画索引
                        if (element[order_by]) {
                            for (var i in dictionary) {
                                if (dictionary[i].indexOf(element[order_by][0]) != -1) {
                                    var obj = {order: i};
                                    element = _.extend(element, obj);
                                }
                            }
                        }
                    });

                    //按笔画排序
                    list = _.sortBy(list, function (data) {
                        return +data.order
                    });

                    //去除笔画索引
                    _.each(list, function (element, index, list) {
                        list[index] = _.omit(element, 'order');
                    });

                    return list;
                }

            };

        }]).controller('versionCtrl', ['$scope', 'userInfo', '$modalInstance', function ($scope, userInfo, $modalInstance) {
            //獲取版本更新內容

            $scope.version_content = "";
            $scope.version_record = userInfo.getVersion().$promise.then(function (_version) {
                $scope.version_content = _version.version;
            });


            $scope.close = function () {
                $modalInstance.dismiss();
            }

        }]);
}).call(this);
