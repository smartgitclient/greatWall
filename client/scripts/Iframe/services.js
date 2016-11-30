/**
 * Created by harry on 2015/4/10.
 */
(function() {
    'use strict';
    angular.module('app.iframe.services',['app.iframe.config']).factory('tmsSocket',['socketFactory','iframeConfig','globalConfig',function (socketFactory,iframeConfig,globalConfig) {
        var myIoSocket = io.connect(globalConfig.socketServer);

       // var myIoSocket = io.connect(iframeConfig.socketServer);
        return socketFactory({
            ioSocket: myIoSocket
        });
    }]).directive("inputUppercase", ['globalFunction',function(globalFunction) {
        return {
            require: "ngModel",
            restrict: "A",
            link: function(scope, elem, attrs, modelCtrl) {
                elem.bind("input propertychange",globalFunction.debounce(function(event) {
                    scope.$apply(function() {
                        if(!angular.isUndefined(modelCtrl.$modelValue)&&/[a-z]/.test(modelCtrl.$modelValue)){
                            modelCtrl.$setViewValue(angular.uppercase(modelCtrl.$modelValue));
                            $(elem).val(modelCtrl.$modelValue);
                        }
                    });
                },50))
            }
        };
    }]).service('globalFunction',['globalConfig','$resource','$timeout','$q',function(globalConfig,$resource,$timeout,$q){

        this.getApiUrl = function(url){
            return globalConfig.apiUrl + url;
        }
        this.javaApi = function(url){
            return globalConfig.javaApi + url;
        }
        this.generateUrlParams = function(condtion,fields){
            var params ={};
            //set condition
            var setParams = function(params,obj,prefix){
                _.each(obj,function(value,key,list){
                    if(_.isArray(value)){
                        if(value.length == 1){
                            params[prefix+key+'-range'] = value[0];
                        }else if(value.length == 3){
                            params[prefix+key+'-range'] = value[2];
                            params[prefix+key+'-min'] = value[0];
                            params[prefix+key+'-max'] = value[1];
                        }else{
                            params[prefix+key+'-min'] = value[0];
                            params[prefix+key+'-max'] = value[1];
                        }
                    }else if(_.isObject(value)){
                        setParams(params,value,prefix+key+'.')
                    }else{
                        params[prefix+key] = value;
                    }

                })
                return obj;
            }
            setParams(params,condtion,'')

            //set fields
            if(fields){
                params['fields'] =[];
                params['expand'] = [];
                params['expand-fields'] = {};
                _.each(fields,function(value,key,list){
                    if(_.isObject(value)){
                        params['expand'].push(key);
                        setParams(params['expand-fields'],value,key+'.');
                    }else{
                        params['fields'].push(key);
                    }
                })
                params['fields']=params['fields'].join(',');
                params['expand']=params['expand'].join(',');
                params['expand-fields']= _.keys(params['expand-fields']).join(',');
            }
            return params;
        }
        this.createResource = function(url,param_defaults,actions){
            var canceler = $q.defer();
            var inner_actions = {
                'get': {method:'GET',url:this.getApiUrl(url+'/:id')},
                'query':  {method:'GET', isArray:true,timeout:canceler.promise},
                'update': { method:'PUT',url:this.getApiUrl(url+'/:id') },
                'delete': { method:'DELETE',url:this.getApiUrl(url+'/:id') }
            };

            var inner_param_defaults = {id:"@id",PHPSESSID:function(){return sessionStorage.token?sessionStorage.token:null}};
            //$timeout(function(){canceler.resolve();},10);

            actions = _.extend(inner_actions,actions);
            param_defaults = _.extend(inner_param_defaults,param_defaults);
            return $resource(this.getApiUrl(url), param_defaults,actions);
        }
        this.createjava = function(url){
            return $resource(this.javaApi(url));
        }
        this.debounce = function(fun,wait){
            if(angular.isUndefined(wait))
                wait = 800;
            return _.debounce(fun,wait);
        },
            this.getHall = function(condition){
                var halls = JSON.parse(sessionStorage.getItem('halls'));
                if(typeof condition == 'string')
                    return _.findWhere(halls,{"id":condition});
                else if(condition == null)
                    return halls;
                else
                    return _.where(halls,condition);
            }
    }]).service('topAlert',function(){
        this.alerts = [];
        this.warning = function(msg){
            this.addAlert({type:'warning',msg:msg});
        }
        this.success = function(msg){
            this.addAlert({type:'success',msg:msg});
        }
        this.danger = function(msg){
            this.addAlert({type:'danger',msg:msg});
        }
        this.info = function(msg){
            this.addAlert({type:'info',msg:msg});
        }
        this.addAlert = function(msg){
            msg.expires = Date.parse(new Date())+3000;//5秒
            this.alerts.unshift(msg);
            if(this.alerts.length > 10)
                this.alerts.pop();
        }
        this.clear = function(){
            this.alerts.splice(0);
        }
    }).directive("svEnterKey", function() {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {

                elem.bind("keydown", function(e) {

                    if(e.keyCode == 13){

                        eval('scope.'+attrs.svEnterKey);
                        return false;
                    }
                })
            }
        };
    })
}).call(this);
