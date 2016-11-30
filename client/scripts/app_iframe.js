(function() {
  'use strict';
  angular.module('app.iframe', [
      'ui.router',
     'app.config',
     'app.config-local',
     'app.iframe.config',
     'app.iframe.ctrls',
     'app.iframe.services',
      'ui.bootstrap',
      'app.agent.services',
      'app.services',
      'perfect_scrollbar',
	  'app.services',
      'btford.socket-io'


  ]).config(function($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('/', {
              url:'/'
          })
          $urlRouterProvider.otherwise('/');
  }).constant('paginationConfig', {
      itemsPerPage: 10,
      boundaryLinks: true,
      directionLinks: true,
      firstText: '首頁',
      previousText: '上一頁',
      nextText: '下一頁',
      lastText: '尾頁',
      rotate: false,
      maxSize:10
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
  })
}).call(this);
