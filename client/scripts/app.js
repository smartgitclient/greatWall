(function () {
    'use strict';
    angular.module('app', ['ngRoute',
        'ngAnimate',
        'ui.bootstrap',
        'easypiechart',
        'mgo-angular-wizard',
        'textAngular',
        'ui.tree',
        'ui.grid',
        'ui.grid.pagination',
        'ui.grid.resizeColumns',
        'ui.grid.pinning',
        'ui.grid.autoResize',
        'ui.grid.selection',
        'ngMap',
        'ngTagsInput',
        'angular-bootstrap-select.extra',
        'angular-bootstrap-select',
        'ui.select',
        'ui.checkbox',
        'mgcrea.ngStrap.datepicker',
        'mgcrea.ngStrap.select',
        'mgcrea.ngStrap.timepicker',
        'angularFileUpload',
        'angular-md5',
        'currencyFilter',
        'dndLists',
        'angular-loading-bar',

        'app.config',
        'app.config-local',
        'app.controllers',
        'app.directives',
        'app.services',
        'app.constants',
        'app.filters',

        // 'angular-smarty',

        'app.agent.ctrls',
        'app.agent.services',
        'app.agent.directives',

        'app.loan.ctrls',
        'app.loan.services',
//      'app.loan.json',

        'app.deposit.ctrls',
        'app.deposit.services',

        'app.rolling.ctrls',
        'app.rolling.services',

        'app.rolling-transfer.ctrls',
        'app.rolling-transfer.services',

        'app.buy-chip.ctrls',
        'app.buy-chip.services',

        'app.cross-trans.ctrls',
        'app.cross-trans.services',
        'app.cross-trans.json',

        'app.shift-record.ctrls',
        'app.shift-record.services',

//      'app.scene.ctrls',
//      'app.scene.services',
//      'app.scene.json',

        'app.mortgage.ctrls',
        'app.mortgage.services',

        'app.consumption-record.ctrls',
        'app.consumption-record.services',
        'app.consumption-record.json',

        'app.commission.ctrls',
        'app.commission.services',

        'app.commission-calculate.ctrls',
        'app.commission-calculate.services',

        'app.scene.ctrls',
        'app.scene.services',
        'app.scene.json',

        'app.consumption-manager.ctrls',
        'app.consumption-manager.services',
        'app.consumption-manager.json',

        'app.consumption-set.ctrls',
        'app.consumption-set.services',
        'app.consumption-set.json',

        'app.sms-manager.ctrls',
        'app.sms-manager.services',

        'app.transfer.ctrls',
        'app.transfer.services',

        'app.integral.ctrls',
        'app.integral.services',

        'app.report.ctrls',
        'app.report.services',

        'app.immediate-payment.ctrls',
        'app.oldData.ctrls',
//      'app.immediate-payment.services',

        "app.system-set.ctrls",
        "app.system-set.services",

        'app.ui.ctrls',
        'app.ui.directives',
        'app.ui.services',
        'app.form.validation',
        'app.ui.form.ctrls',
        'app.ui.form.directives',
        'app.tables',
        'app.map',
        'app.task',
        'app.localization',
        'app.chart.ctrls',
        'app.chart.directives',
        'app.page.ctrls',
        'app.profit.ctrls',
        'app.profit.services',

//      'ngTinyScrollbar',
        'perfect_scrollbar',
        'ui.router'

    ]).config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('404', {
                url: '/404',
                templateUrl: 'views/pages/404.html'
            }).state('pages/500', {
                url: '/pages/500',
                templateUrl: 'views/pages/500.html'
            }).state('/', {
                url: '/agent/service-detail',
                templateUrl: 'views/agent/agent-detail.html'
            }).state('dashboard', {
                url: '/dashboard',
                templateUrl: 'views/dashboard.html'
            }).state('report-error', {
                url: '/report-error',
                controller: "reportError"
            })
            //戶口管理
            .state('agent-detail', {
                url: '/agent/agent-detail/:id',
                templateUrl: 'views/agent/agent-detail.html'
            })
            .state('agent-detail-call-in', {
                url:'/agent/agent-detail/:id/:call_id/:phone_number',
                templateUrl: 'views/agent/agent-detail.html'
            })
            .state('agent-detail-year-month', {
                url: '/agent/agent-detail/:id/:year_month',
                templateUrl: 'views/agent/agent-detail.html'
            })
//          .state('agent-detail', {
//              url:'/agent/detail',
//              templateUrl: 'views/agent/agent-detail.html'
//          })
            .state('agent-scene-detail-params', {
                url: '/agent/scene-detail',
                templateUrl: 'views/agent/agent-scene-detail.html'
            })
            .state('agent-scene-detail', {
                url: '/agent/agent-scene-detail/:id',
                templateUrl: 'views/agent/agent-scene-detail.html'
            })
            .state('agent-scene-detail-year-month', {
                url: '/agent/agent-scene-detail/:id/:year_month',
                templateUrl: 'views/agent/agent-scene-detail.html'
            })
            .state('agent-service-detail-params', {
                url: '/agent/service-detail',
                templateUrl: 'views/agent/agent-service-detail.html'
            })
            .state('agent-service-detail', {
                url: '/agent/agent-service-detail/:id',
                templateUrl: 'views/agent/agent-service-detail.html'
            })
            .state('agent-service-detail-year-month', {
                url: '/agent/agent-service-detail/:id/:year_month',
                templateUrl: 'views/agent/agent-service-detail.html'
            })
            .state('agent-account-detail-params', {
                url: '/agent/agent-account-detail',
                templateUrl: 'views/agent/agent-account-detail.html'
            })
            .state('agent-account-detail', {
                url: '/agent/agent-account-detail/:id',
                templateUrl: 'views/agent/agent-account-detail.html'
            })
            .state('agent-account-detail-year-month', {
                url: '/agent/agent-account-detail/:id/:year_month',
                templateUrl: 'views/agent/agent-account-detail.html'
            })

            .state('/agent/agent-service-consumer', {
                url: '/agent/agent-service-consumer',
                templateUrl: 'views/agent/agent-service-consumer.html'
            })
            .state('agent-detail-params', {
                url: '/agent/detail/:agent_code',
                templateUrl: 'views/agent/agent-detail.html'
            })
            .state('agent-detailed-params', {
                url: '/agent/detailed/:id',
                templateUrl: 'views/agent/agent-detailed.html',
                permissions: ['agentView']
            })
            .state('agent-detailed-params-type', {
                url: '/agent/detailed/:types/:id',
                templateUrl: 'views/agent/agent-detailed.html',
                permissions: ['agentView']
            })
            .state('agent-create-params', {
                url: '/agent/create/:id',
                templateUrl: 'views/agent/agent-create.html',
                permissions: ['agentUpdate']
            })
            .state('agent-create', {
                url: '/agent/create',
                templateUrl: 'views/agent/agent-create.html',
                permissions: ['agentCreate']
            })
            .state('agent-list', {
                url: '/agent/list',
                templateUrl: 'views/agent/agent-list.html',
                nextLinks: ['/agent/detailed/:types/:id', '/agent/detailed/:id', '/agent/create/:id'],
                permissions: ['agentCreate', 'agentUpdate', 'agentDelete', 'agentView']
            })
            .state('agent-info-list', {
                url: '/agent/agent-info-list',
                templateUrl: 'views/agent/agent-info-list.html',
                permissions: ['agentStatusView']
            })
            .state('agent-message-list', {
                url: '/agent/message-list',
                templateUrl: 'views/agent/message-list.html'
            })
            .state('agent-message-create', {
                url: '/agent/message-create',
                templateUrl: 'views/agent/message-create.html'
            })
//          .state('agent-contact-create-code', {
//              url:'/agent/contact-create/:agent_code',
//              templateUrl: 'views/agent/contact-create.html'
//          })
            .state('agent-contact-create-id', {
                url: '/agent/contact-create/:id',
                templateUrl: 'views/agent/contact-create.html',
                permissions: ['agentContactCreate']
            })
            .state('agent-contact-create-two', {
                url: '/agent/contact-create/:type/:id',
                templateUrl: 'views/agent/contact-create.html',
                permissions: ['agentContactCreate']
            })
            .state('agent-contact-create-column', {
                url: '/agent/contact-create/:column/:type/:id',
                templateUrl: 'views/agent/contact-create.html',
                permissions: ['agentContactCreate']
            })

            .state('agent-contact-edit-one', {
                url: '/agent/contact-edit/:contact_id',
                templateUrl: 'views/agent/contact-create.html',
                permissions: ['agentContactUpdate']
            })
            .state('agent-contact-edit-ctrl', { //修改
                url: '/agent/contact-edit/:contact_id/:contact_name',
                templateUrl: 'views/agent/contact-create.html',
                permissions: ['agentContactUpdate']
            })

            .state('agent-contact-edit-assistant-ctrl', { //助手修改
                url: '/agent/contact-assistant-edit/:contact_id/:contact_name/:type/:id',
                templateUrl: 'views/agent/contact-create.html',
                permissions: ['agentContactUpdate']
            })

            .state('agent-contact-edit-id', {
                url: '/agent/contact-edit/:id',
                templateUrl: 'views/agent/contact-edit.html'
            })
            .state('agent-contact-create', {
                url: '/agent/contact-create',
                templateUrl: 'views/agent/contact-create.html',
                permissions: ['agentContactCreate']
            })
            .state('agent_contact-detail', {
                url: '/agent/contact-detail/:id',
                templateUrl: 'views/agent/contact-detail.html',
                permissions: ['agentContactView']
            })
            .state('agent-contact-list', {
                url: '/agent/contact-list',
                templateUrl: 'views/agent/contact-list.html',
                nextLinks: ['/agent/contact-detail/:id', '/agent/contact-edit/:contact_id'],
                permissions: ['agentContactView', 'agentContactDelete']
            })
            .state('agent-remark-create', {
                url: '/agent/remark-create',
                templateUrl: 'views/agent/remark-create.html'
            })
            .state('agent-group', {
                url: '/agent/agent-group',
                templateUrl: 'views/agent/agent-group.html',
                permissions: ['agentGroupCreate', 'agentGroupUpdate', 'agentGroupDelete', 'agentGroupView']
            })
            .state('agent-structure', {
                url: '/agent/agent-structure',
                templateUrl: 'views/agent/agent-structure.html',
                permissions: ['agentStructureView']
            })
            .state('message-order', {
                url: '/agent/message-order',
                templateUrl: 'views/agent/message-order.html',
                nextLinks: ['/agent/message-order-create/:id', '/agent/message-order-create'],
                permissions: ['agentOrderDelete', 'agentOrderView']
            })
            .state('message-order-create', {
                url: '/agent/message-order-create',
                templateUrl: 'views/agent/message-order-create.html',
                permissions: ['agentOrderCreate']
            })
            .state('message-order-create-id', {
                url: '/agent/message-order-create/:id',
                templateUrl: 'views/agent/message-order-create.html',
                permissions: ['agentOrderUpdate']
            })
            .state('bound-message-people', {
                url: '/agent/bound-message-people',
                templateUrl: 'views/agent/bound-message-people.html',
                permissions: ['agentBindSMSCreate', 'agentBindSMSUpdate', 'agentBindSMSDelete', 'agentBindSMSView']
            })
            .state('batch-bound-message-people', {
                url: '/agent/batch-bound-message-people',
                templateUrl: 'views/agent/batch-bound-message-people.html',
                permissions: ['agentBatchBindSMSCreate', 'agentBatchBindSMSUpdate', 'agentBatchBindSMSDelete', 'agentBatchBindSMSView']
            })
            //客人信息
            .state('guest-list', {
                url: '/agent/guest-list',
                templateUrl: 'views/agent/agent-guest-list.html',
                nextLinks: ['/agent/agent-guest-detail/:id', '/agent/agent-guest-create/:id', '/agent/agent-guest-create'],
                permissions: ['agentGuestDelete', 'agentGuestView']
            })
            .state('guest-create-id', {
                url: '/agent/agent-guest-create/:id',
                templateUrl: 'views/agent/agent-guest-create.html',
                permissions: ['agentGuestUpdate']
            })
            .state('guest-create', {
                url: '/agent/agent-guest-create',
                templateUrl: 'views/agent/agent-guest-create.html',
                permissions: ['agentGuestCreate']
            })
            .state('guest-create-agent-code', {
                url: '/agent/agent-guest-create/:id/:agent_code',
                templateUrl: 'views/agent/agent-guest-create.html',
                permissions: ['agentGuestUpdate']
            })
            .state('guest-detail', {
                url: '/agent/agent-guest-detail/:id',
                templateUrl: 'views/agent/agent-guest-detail.html',
                permissions: ['agentGuestView']
            })
            .state('birthday-sms-list', { //生日短信列表
                url: '/agent/birthday-sms-list',
                templateUrl: 'views/agent/birthday-sms-list.html',
                nextLinks: ['/agent/birthday-sms-detail/:is_select_all/:agent_info_id']
                //permissions:['agentGuestView']
            })

            .state('birthday-sms-detail', {
                url: '/agent/birthday-sms-detail/:is_select_all/:agent_info_id',
                templateUrl: 'views/agent/birthday-sms-detail.html'
                //permissions:['agentGuestView']
            })
            .state('birthday-day-sms-detail', {
                url: '/agent/birthday-sms-detail/:is_select_all/:agent_info_id/:is_birthday',
                templateUrl: 'views/agent/birthday-sms-detail.html'
                //permissions:['agentGuestView']
            })

            //貸款管理
            .state('loan-list', {
                url: '/loan/list',
                templateUrl: 'views/loan/loan-list.html',
                nextLinks: ['/loan/detail/:loan_id', '/loan/update/:loan_id/:operation_type'],
                permissions: 'loanView'
            })
            .state('loan-stream-list', { //貸款流水
                url: '/loan/loan-stream-list',
                templateUrl: 'views/loan/loan-stream-list.html',
                permissions: 'loanRecordView'
            })
            .state('loan-detail-params', {
                url: '/loan/detail/:loan_id',//通過ID
                templateUrl: 'views/loan/loan-detail.html',
                permissions: 'loanView'
            })
            .state('loan-create', {
                url: '/loan/create',
                templateUrl: 'views/loan/loan-create.html',
                nextLinks: ['/agent/contact-create/:type/:id'],
                permissions: 'loanCreate'
            })

            .state('loan-create-params-two', {
                url: '/loan/create/:loan_id/:operation_type',
                templateUrl: 'views/loan/loan-create.html',
                permissions: 'loanCreate'
            })
            .state('loan-create-column-types-contact', {
                url: '/loan/create/:agent_code/:types/:contact_name',
                templateUrl: 'views/loan/loan-create.html',
                nextLinks: ['/agent/contact-create/:column/:type/:id'],
                permissions: 'loanCreate'
            })
//          .state('loan-create-params-ctrl', {
//              url:'/loan/create/:loan_id/:contact_name',
//              templateUrl: 'views/loan/loan-create.html'
//          })

            .state('loan-create-params-one', {
                url: '/loan/create/:agent_code',
                templateUrl: 'views/loan/loan-create.html',
                permissions: 'loanCreate'
            })
            .state('loan_update-params-two', {
                url: '/loan/update/:loan_id/:operation_type',
                templateUrl: 'views/loan/loan-update.html',
                permissions: 'loanUpdate'
            })
            .state('loan_create-result-params', {
                url: '/loan/create-result/:id',
                templateUrl: 'views/loan/loan-create-result.html'
            })
            .state('loan_operation-record-params', {
                url: '/loan/operation-record/:loan_id/:loan_seqnumber',
                templateUrl: 'views/loan/loan-operation-record.html',
                permissions: 'loanOperationRecordView'
            })
            /*.state('loan_operation-record-loan_seqnumber', { //通過業務單號
             url:'/loan/operation-record/:loan_seqnumber',
             templateUrl: 'views/loan/loan-operation-record.html'
             })*/
            .state('loan_repayment-list', {
                url: '/loan/repayment-list',
                templateUrl: 'views/loan/repayment-list.html'
            })
            .state('loan_overdue-charge', {
                url: '/loan/overdue-charge',
                templateUrl: 'views/loan/overdue-charge.html',
                permissions: ["markerFeePayView","markerExpiredFeeView", "markerExpiredFeeConfirmView","markerExpiredFeeAdjustRecordView","markerExpiredFeeRepaymentView","markerMonthlyView"]
            })
            .state('loan_overdue', {
                url: '/loan/overdue-charge/:agent_code',
                templateUrl: 'views/loan/overdue-charge.html',
                permissions: ["markerFeePayView","markerExpiredFeeView", "markerExpiredFeeConfirmView","markerExpiredFeeAdjustRecordView","markerExpiredFeeRepaymentView","markerMonthlyView"]
            })
            .state('loan_quota-setting-params', {
                url: '/loan/quota-setting/:agent_code',
                templateUrl: 'views/loan/quota-setting.html',
                permissions: "loanQuotaSettingView"
            })
            .state('loan_quota-setting', {
                url: '/loan/quota-setting',
                templateUrl: 'views/loan/quota-setting.html',
                permissions: 'loanQuotaSettingView'
            })
            .state('stream-loan_quota-setting', {
                url: '/loan/stream-quota-setting',
                templateUrl: 'views/loan/quota-setting-stream.html',
                permissions: 'loanQuotaSettingRecordView'
            })
            .state('stream-loan_quota-setting-param-one', {
                url: '/loan/stream-quota-setting/:agent_code',
                templateUrl: 'views/loan/quota-setting-stream.html',
                permissions: 'loanQuotaSettingRecordView'
            })
            .state('loan_common-quota-setting', {
                url: '/loan/common-quota-setting',
                templateUrl: 'views/loan/common-quota-setting.html',
                permissions: 'commonLoanQuotaSettingView'
            })
            //貸款管理(財務)
            .state('account-overdue-charge', {
                url: '/loan/account-overdue-charge',
                templateUrl: 'views/loan/account-overdue-charge.html',
                nextLinks: ['/loan/account-overdue-charge-detail/:overdue_charge_id'],
                permissions: ['markerExpiredFeeManageView',"markerExpiredFeeView", "markerExpiredFeeConfirmView","markerExpiredFeeAdjustRecordView","markerExpiredFeeRepaymentView","markerMonthlyView"]
            })
            .state('account-overdue-charge-type', {
                url: '/loan/account-overdue-charge/:type',
                templateUrl: 'views/loan/account-overdue-charge.html',
                permissions: ['markerExpiredFeeManageView',"markerExpiredFeeView", "markerExpiredFeeConfirmView","markerExpiredFeeAdjustRecordView","markerExpiredFeeRepaymentView","markerMonthlyView"]
            })
            .state('account-overdue-charge-detail-params', {
                url: '/loan/account-overdue-charge-detail/:overdue_charge_id',
                templateUrl: 'views/loan/account-overdue-charge-detail.html'
            })
            .state('account-overdue-charge-detail', {
                url: '/loan/account-overdue-charge-detail',
                templateUrl: 'views/loan/account-overdue-charge-detail.html'
            })
            .state('loan-recovery', {
                url: '/loan/loan-recovery',
                templateUrl: 'views/loan/loan-recovery.html',
                permissions: 'loanRecoveryView',
                nextLinks: ['/loan/detail/:loan_id']
            })
            .state('loan-recovery-params', {
                url: '/loan/loan-recovery/:agent_code',
                templateUrl: 'views/loan/loan-recovery.html',
                permissions: 'loanRecoveryView',
                nextLinks: ['/loan/detail/:loan_id']
            })
            .state('loan-recovery-sms', {
                url: '/loan/loan-recovery-sms',
                templateUrl: 'views/loan/loan-recovery-sms.html',
                permissions: 'loanRecoverySendSMS'
            })
            .state('loan-recovery-detail', {
                url: '/loan/loan-recovery-detail',
                templateUrl: 'views/loan/loan-recovery-detail.html',
                permissions: 'loanRecoveryView'
            })
//          .state('loan-recalculate', {
//              url:'/loan/loan-recalculate/',
//              templateUrl: 'views/loan/loan-recalculate.html'
//          })
            .state('loan-recalculate', {
                url: '/loan/loan-recalculate',
                templateUrl: 'views/loan/loan-recalculate.html'
            })
            .state('loan-recalculate-result-params', {
                url: '/loan/loan-recalculate-result/:loan_id',
                templateUrl: 'views/loan/loan-recalculate-result.html'
            })
            .state('loan-setting', {
                url: '/loan/loan-setting',
                templateUrl: 'views/loan/loan-setting.html'
            })

            //轉碼
            .state('rolling-check-params-two', {
                url: '/loan/rolling-check/:rolling_id/:operation_type',
                templateUrl: 'views/loan/rolling-check.html'
            })
//          .state('add-card-type/', {
//              url:'/loan/add-card-type',
//              templateUrl: 'views/loan/add-card-type.html'
//          })
            .state('stream-detail/', {
                url: '/loan/stream-detail',
                templateUrl: 'views/loan/stream-detail'
            })
            .state('rolling-check/', {
                url: '/loan/rolling-check',
                templateUrl: 'views/loan/rolling-check.html'
            })


            //存款管理
            .state('card-list', {
                url: '/deposit/card-list',
                templateUrl: 'views/deposit/card-list.html',
                permissions: ['depositCardCreate', 'depositCardNegativeCreate', 'depositCardNameUpdate', 'depositCardDelete', 'depositCardView']
            })
            .state('card-manager', {
                url: '/deposit/card-manager',
                templateUrl: 'views/deposit/card-manager.html',
                permissions: ['depositCardWaterCreate', 'depositCardRecordRemarkUpdate', 'depositCardRecordView']
            })
            .state('card-manager_params', {
                url: '/deposit/card-manager/:id',
                templateUrl: 'views/deposit/card-manager.html'
            })
            .state('card-record', {
                url: '/deposit/card-record',
                templateUrl: 'views/deposit/card-record.html'
            })
            .state('ticket-manager', {
                url: '/deposit/ticket-manager',
                templateUrl: 'views/deposit/ticket-manager.html',
                permissions: ['depositTicketCreate', 'depositTicketWithdraw', 'depositTicketView', 'depositTicketRemarkUpdate']
            })
            //存單流水
            .state('ticket-stream', {
                url: '/deposit/ticket-stream',
                templateUrl: 'views/deposit/ticket-stream.html',
                permissions: ['depositTicketRecordView']
            })
            .state('ticket-manager-params', {
                url: '/deposit/ticket-manager/:id',
                templateUrl: 'views/deposit/ticket-manager.html'
            })
            .state('ticket-record', {
                url: '/deposit/ticket-record',
                templateUrl: 'views/deposit/ticket-record.html'
            })

            //轉碼管理
            .state('rolling', {
                url: '/rolling/rolling',
                templateUrl: 'views/rolling/rolling.html'
            })
            .state('rolling-params-one', {
                url: '/rolling/rolling/:agent_code',
                templateUrl: 'views/rolling/rolling.html'
            })
            .state('rolling-params-two', {
                url: '/rolling/rolling/:agent_code/:seqnumber',
                templateUrl: 'views/rolling/rolling.html'
            })
            .state('rolling-list/', {
                url: '/rolling/rolling-list',
                templateUrl: 'views/rolling/rolling-list.html',
                permissions: ['rollingDetailView']
            })
            .state('rolling-list-one/', {
                url: '/rolling/rolling-list/:agent_code',
                templateUrl: 'views/rolling/rolling-list.html',
                permissions: ['rollingDetailView']
            })
            .state('amount-rolling/', {
                url: '/rolling/amount-rolling',
                templateUrl: 'views/rolling/amount-rolling.html'
            })
            .state('revoke-capital', {
                url: '/rolling/revoke-capital',
                templateUrl: 'views/rolling/revoke-capital.html'
            })
            .state('rolling-summary', {
                url: '/rolling/rolling-summary',
                templateUrl: 'views/rolling/rolling-summary.html',
                nextLinks: ['/rolling/rolling-summary-detail/:id/:rollingCard_amount_id', '/rolling/rolling-summary-detail/:id/:rollingCard_amount_id/:start_date/:end_date'],
                permissions: ['rollingSummaryView', 'rollingSummaryTransfer']
            })
            .state('rolling-summary-detail-one', {
                url: '/rolling/rolling-summary-detail/:agent_code/:agent_name/:card_name/:id/:rollingCard_amount_id',
                templateUrl: 'views/rolling/rolling-summary-detail.html',
                permissions: ['rollingSummaryView']
            })
            .state('rolling-summary-date', {
                url: '/rolling/rolling-summary-detail/:id/:rollingCard_amount_id/:start_date/:end_date',
                templateUrl: 'views/rolling/rolling-summary-detail.html',
                permissions: ['rollingSummaryView']
            })
            .state('rolling-summary-detail', {
                url: '/rolling/rolling-summary-detail/:id',
                templateUrl: 'views/rolling/rolling-summary-detail.html',
                permissions: ['rollingSummaryView']
            })

            .state('rolling-card-record', {
                url: '/rolling/rolling-card-record',
                templateUrl: 'views/rolling/rolling-card-record.html',
                permissions: ['rollingMainSceneUpdate', 'rollingMainSceneView']
            })
            .state('rolling-daily-list', {
                url: '/rolling/rolling-daily-list',
                templateUrl: 'views/rolling/rolling-daily-list.html',
                permissions: ['rollingDailyView']
            })
            .state('rolling-daily-notice', {
                url: '/rolling/rolling-daily-notice',
                templateUrl: 'views/rolling/rolling-daily-notice.html',
                permissions: ['rollingDailySendSMS']
            })
            //轉碼流量轉移管理
            .state('rolling-transfer-list', {
                url: '/rolling-transfer/transfer-list',
                templateUrl: 'views/rolling-transfer/transfer-list.html',
                permissions: ['rollingTransferView']
            })
            .state('rolling-transfer-detail', {
                url: '/rolling-transfer/transfer-detail/:id',
                templateUrl: 'views/rolling-transfer/transfer-detail.html'
            })
            .state('rolling-transfer-rolling-record', {
                url: '/rolling-transfer/rolling-record',
                templateUrl: 'views/rolling-transfer/rolling-record.html'
            })

            //買碼管理
            .state('buy-chip-manager', {
                url: '/buy-chip/buy-chip-manager',
                templateUrl: 'views/buy-chip/buy-chip-manager.html',
                permissions: ['buyChipCreate', 'buyChipDelete', 'buyChipView']
            })
            //買碼管理
            .state('transfer-manager', {
                url: '/transfer/transfer-manager',
                templateUrl: 'views/transfer/transfer-manager.html'
            })
            //圍數管理
            .state('shift-record-manager', {
                url: '/shift-record/shift-record-manager',
                templateUrl: 'views/shift-record/shift-record-manager.html',
                nextLinks: ['/shift-record/shift-record-create', '/shift-record/shift-record-detail/:id', '/agent/create/:id'],
                permissions: ['shiftMarkView']
            })
            .state('shift-record-create', {
                url: '/shift-record/shift-record-create',
                templateUrl: 'views/shift-record/shift-record-create.html',
                permissions: ['shiftMarkCreate']
            })
            .state('shift-record-month', {
                url: '/shift-record/shift-record-month',
                templateUrl: 'views/shift-record/shift-record-month.html',
                permissions: ['settlementMonthCreate', 'settlementMonthView']
            })
            .state('shift-record-daily', {
                url: '/shift-record/shift-record-daily',
                templateUrl: 'views/shift-record/shift-record-daily.html',
                permissions: ['shiftDailyView']
            })
            .state('shift-record-detail', {
                url: '/shift-record/shift-record-detail/:id',
                templateUrl: 'views/shift-record/shift-record-detail.html',
                permissions: ['shiftMarkView']
            })

            //飛數管理
            .state('cross-transfer-manager', {
                url: '/cross-transfer/cross-transfer-manager',
                templateUrl: 'views/cross-transfer/cross-transfer-manager.html',
                permissions: ['crossTransferCreate', 'crossTransferHandle', 'crossTransferView']
            })
            .state('cross-transfer-record', {
                url: '/cross-transfer/cross-transfer-record',
                templateUrl: 'views/cross-transfer/cross-transfer-record.html'
            })

            //抵押管理
            .state('mortgage-create', {
                url: '/mortgage/mortgage-create',
                templateUrl: 'views/mortgage/mortgage-create.html',
                permissions: 'mortgageCreate'
            })
            .state('mortgage-list', {
                url: '/mortgage/mortgage-list',
                templateUrl: 'views/mortgage/mortgage-list.html',
                nextLinks: ['/mortgage/mortgage-detail/:id', '/mortgage/mortgage-detail-m/:id'],
                permissions: 'mortgageRecordView'
            })
            .state('mortgage-sharing', {
                url: '/mortgage/mortgage-sharing',
                templateUrl: 'views/mortgage/mortgage-sharing.html',
                permissions: 'mortgageSharingView',
                nextLinks: ['/mortgage/mortgage-sharing-detail/:id']
            })
            .state('mortgage-detail', {
                url: '/mortgage/mortgage-detail/:id',
                templateUrl: 'views/mortgage/mortgage-detail.html'
            })
            .state('mortgage-detail-m', {
                url: '/mortgage/mortgage-detail-m/:id',
                templateUrl: 'views/mortgage/mortgage-detail-m.html'
            })
            .state('mortgage-sharing-detail', {
                url: '/mortgage/mortgage-sharing-detail/:id',
                templateUrl: 'views/mortgage/mortgage-sharing-detail.html'
            })

            //場面管理
            .state('scene-shift-record', {
                url: '/scene/scene-shift-record',
                templateUrl: 'views/scene/scene-shift-record.html',
                permissions: "sceneShiftNumberCreate"
            })
            .state('scene-collect', {
                url: '/scene/scene-collect',
                templateUrl: 'views/scene/scene-collect.html',
                permissions: "sceneSummaryView"
            })
            .state('scene-collect-params', {
                url: '/scene/scene-collect/:agent_code',
                templateUrl: 'views/scene/scene-collect.html',
                permissions: "sceneSummaryView"
            })
            .state('scene-confirm', {
                url: '/scene/scene-confirm',
                templateUrl: 'views/scene/scene-confirm.html'
            })
            .state('scene-record', {
                url: '/scene/scene-record',
                templateUrl: 'views/scene/scene-record.html'
            })
            .state('screening-create', {
                url: '/scene/screening-create',
                templateUrl: 'views/scene/screening-create.html',
                permissions: 'sceneCreateView',
                nextLinks: ["/scene/screening-detail/:id"]
            })
            .state('screening-create-params', {
                url: '/scene/screening-create/:id',
                templateUrl: 'views/scene/screening-create.html',
                permissions: 'sceneCreateView'
            })
            .state('screening-list', {
                url: '/scene/screening-list',
                templateUrl: 'views/scene/screening-list.html',
                nextLinks: ['/scene/screening-list-detail/:id/:main_scene_id'],
                permissions: "sceneRecordView"
            })
            .state('screening-list-detail-params', {
                url: '/scene/screening-list-detail/:id',
                templateUrl: 'views/scene/screening-list-detail.html',
                permissions: "sceneRecordView"
            })
            .state('screening-list-detail-two-params', {
                url: '/scene/screening-list-detail/:id/:main_scene_id',
                templateUrl: 'views/scene/screening-list-detail.html',
                permissions: "sceneRecordView"
            })
            .state('screening-shift-list', { //場次截更記錄
                url: '/scene/screening-shift-list',
                templateUrl: 'views/scene/screening-shift-list.html',
                nextLinks: ['/scene/screening-list-detail/:id/:main_scene_id'],
                permissions: "sceneRecordView"
            })
            .state('screening-shift-list-params', { //場次截更記錄戶口速查進入
                url: '/scene/screening-shift-list/:agent_code',
                templateUrl: 'views/scene/screening-shift-list.html',
                nextLinks: ['/scene/screening-list-detail/:id/:main_scene_id'],
                permissions: "sceneRecordView"
            })
            .state('screening-sms', { //===
                url: '/scene/screening-sms',
                templateUrl: 'views/scene/screening-sms.html'
            })
            .state('screening-sms-agent', { //===
                url: '/scene/screening-sms/:agent_info_id/:common_currency_name/:type_sms/:fenke_id',
                templateUrl: 'views/scene/screening-sms.html'
            })
            .state('screening-sms-params', { //===
                url: '/scene/screening-sms/:agent_info_id/:main_scene_id/:common_currency_name/:type_sms/:fenke_id',
                templateUrl: 'views/scene/screening-sms.html'

            })

            .state('screening-middle-add-color', {
                url: '/scene/screening-middle-add-color',
                templateUrl: 'views/scene/screening-middle-add-color.html'
            })
            .state('screening-detail', {
                url: '/scene/screening-detail',
                templateUrl: 'views/scene/screening-detail.html'
            })
            .state('screening-detail-params', {
                url: '/scene/screening-detail/:id',
                templateUrl: 'views/scene/screening-detail.html'
            })
            .state('gambling-table-manager', {
                url: '/scene/gambling-table-manager',
                templateUrl: 'views/scene/gambling-table-manager.html',
                permissions: 'gamblingTableView'
            })
            .state('scene-term-manager', { //場面數用語管理
                url: '/scene/scene-term-manager',
                templateUrl: 'views/scene/scene-term-manager.html',
                permissions: 'sceneWordsView'
            })

            //消費單管理
            .state('consumption-record-check', {
                url: '/consumption-record/consumption-record-check',
                templateUrl: 'views/consumption-record/consumption-record-check.html'
            })
            .state('settlement-type', {
                url: '/consumption-record/settlement-type',
                templateUrl: 'views/consumption-record/settlement-type.html',
                permissions: 'settlementTypeView'
            })
            .state('consumption-record-edit', {
                url: '/consumption-record/consumption-record-edit/',
                templateUrl: 'views/consumption-record/consumption-record-edit.html'
            })


            //碼佣管理
            .state('commission-common-rule-setting', {
                url: '/commission/commission-common-rule-setting',
                templateUrl: 'views/commission/commission-common-rule-setting.html',
                permissions: ['commissionCommonRuleSettingCreate', 'commissionCommonRuleSettingUpdate', 'commissionCommonRuleSettingDelete', 'commissionCommonRuleSettingView']
            })
            .state('commission-earnings-record', {
                url: '/commission/commission-earnings-record',
                templateUrl: 'views/commission/commission-earnings-record.html',
                nextLinks: ['/commission/commission-earnings-detail/:agent_code'],
                permissions: ['commissionEarningsRecordView']
            })
//          .state('commission-earnings-detail', {
//              url:'/commission/commission-earnings-detail',
//              templateUrl: 'views/commission/commission-earnings-detail.html'
//          })
            .state('commission-earnings-detail', {
                url: '/commission/commission-earnings-detail/:agent_code',
                templateUrl: 'views/commission/commission-earnings-detail.html',
                permissions: ['commissionEarningsRecordView']
            })


            //出佣單
            .state('commission-record', {
                url: '/commission-calculate/commissionRecord',
                templateUrl: 'views/commission-calculate/commission-record.html',
                nextLinks: ['/commission-calculate/commission-record-detail/:id'],
                permissions: ['commissionRecordReleaseView']
            })
            .state('commission-record-id', {
                url: '/commission-calculate/commissionRecord/:id',
                templateUrl: 'views/commission-calculate/commission-record.html'
            })
            .state('cut-month-setting', {
                url: '/commission-calculate/cut-month-setting',
                templateUrl: 'views/commission-calculate/cut-month-setting.html'
            })

            //轉碼卡管理
            .state('rolling-card-common-setting', {
                url: '/rolling-card/rolling-card-common-setting',
                templateUrl: 'views/rolling-card/rolling-card-common-setting.html'
            })
            .state('rolling-card-agent-setting', {
                url: '/rolling-card/rolling-card-agent-setting',
                templateUrl: 'views/rolling-card/rolling-card-agent-setting.html',
                permissions: ['rollingCardCreate', 'rollingCardUpdate', 'rollingCardBind', 'rollingCardDelete', 'rollingCardView']
            })
            .state('rolling-card-agent-setting-select', {
                url: '/rolling-card/rolling-card-agent-setting/:agent_code',
                templateUrl: 'views/rolling-card/rolling-card-agent-setting.html',
                permissions: ['rollingCardCreate', 'rollingCardUpdate', 'rollingCardBind', 'rollingCardDelete', 'rollingCardView']
            })
            .state('rolling-card-agent-create', {
                url: '/rolling-card/rolling-card-agent-create',
                templateUrl: 'views/rolling-card/rolling-card-agent-create.html'
            })
            //計佣管理
            .state('difference-record', {
                url: '/commission-calculate/difference-record',
                templateUrl: 'views/commission-calculate/difference-record.html',
                permissions: ['differenceTicketView', 'differenceTicketCreate', 'differenceTicketUpdate']
            })
            .state('commission-pre-release-manager', {
                url: '/commission-calculate/commission-pre-release-manager',
                templateUrl: 'views/commission-calculate/commission-pre-release-manager.html',
                nextLinks: ['/commission-calculate/commission-pre-release-record/:id'],
                permissions: ['commissionRecordPreReleaseMonth', 'commissionRecordPreReleaseCalculate', 'commissionRecordPreReleaseView']
            })
            .state('commission-pre-release-record', {
                url: '/commission-calculate/commission-pre-release-record',
                templateUrl: 'views/commission-calculate/commission-pre-release-record.html',
                permissions: ['commissionRecordPreReleaseView']
            })
            .state('commission-pre-release-record-id', {
                url: '/commission-calculate/commission-pre-release-record/:id',
                templateUrl: 'views/commission-calculate/commission-pre-release-record.html',
                nextLinks: ['/commission-calculate/commission-pre-release-record-detail/:id'],
                permissions: ['commissionRecordPreReleaseView']
            })

            .state('commission-pre-release-record-detail', {
                url: '/commission-calculate/commission-pre-release-record-detail/:id',
                templateUrl: 'views/commission-calculate/commission-pre-release-record-detail.html'
            })
            //消費
            .state('commission-record/', {
                url: '/commission-calculate/commission-record',
                templateUrl: 'views/commission-calculate/commission-record.html',
                permissions: ['commissionRecordReleaseView']
            })
            .state('commission-record-detail', {
                url: '/commission-calculate/commission-record-detail/:id',
                templateUrl: 'views/commission-calculate/commission-record-detail.html',
                permissions: ['commissionRecordRelease', 'commissionRecordReleaseView']
            })
            .state('consumption-manager', {
                url: '/consumption-manager/consumption-manager/:types',
                templateUrl: 'views/consumption-manager/consumption-manager.html',
                permissions: ["consumptionCreate"]
                //controller: 'formController'
            })
//          .state('consumption-manager.hotel', {
//              url: '/consumption-manager/consumption-manager/hotel',
//              templateUrl: 'views/consumption-manager/consumption-manager.html'
//              //controller: 'formController'
//          })
            .state('consumption-manager.consumption-hotel-booking-update', {
                url: '/consumption-hotel-booking-update/:id',
                views: {
                    'hotel': {
                        templateUrl: 'views/consumption-manager/consumption-hotel-booking-update.html',
                        controller: 'consumptionManagerUpdateCtrls'
                    }
                },
                permissions: ["consumptionRecordUpdate"]
            })
            .state('consumption-manager.consumption-hotel-booking-copy', {
                url: '/consumption-hotel-booking-copy/:id',
                views: {
                    'hotel': {
                        templateUrl: 'views/consumption-manager/consumption-hotel-booking-update.html',
                        controller: 'consumptionManagerUpdateCtrls'
                    }
                },
                permissions: ["consumptionRecordCopy"]
            })

            .state('consumption-manager.consumption-hotel-booking-detail', {
                url: '/consumption-hotel-booking-detail/:id',
                views: {
                    'hotel': {
                        templateUrl: 'views/consumption-manager/consumption-hotel-booking-detail.html'
                    }
                },
                permissions: ["consumptionRecordView"]
            })
            //food
            .state('consumption-manager.consumption-food-fly-booking-update', {
                url: '/consumption-food-fly-booking-update/:id',
                views: {
                    'food': {
                        templateUrl: 'views/consumption-manager/consumption-food-fly-booking-update.html',
                        controller: 'consumptionFoodFlyBookingUpdateCtrls'
                    }
                },
                permissions: ["consumptionRecordUpdate"]
            })
            .state('consumption-manager.consumption-food-fly-booking-copy', {
                url: '/consumption-food-fly-booking-copy/:id',
                views: {
                    'food': {
                        templateUrl: 'views/consumption-manager/consumption-food-fly-booking-update.html',
                        controller: 'consumptionFoodFlyBookingUpdateCtrls'
                    }
                },
                permissions: ["consumptionRecordCopy"]
            })

            .state('consumption-manager.consumption-food-fly-booking-detail', {
                url: '/consumption-food-fly-booking-detail/:id',
                views: {
                    'food': {
                        templateUrl: 'views/consumption-manager/consumption-food-fly-booking-detail.html'
                    }
                },
                permissions: ["consumptionRecordView"]
            })
            //helicopter
            .state('consumption-manager.consumption-helicopter-booking-update', {
                url: '/consumption-helicopter-booking-update/:id',
                views: {
                    'helicopter': {
                        templateUrl: 'views/consumption-manager/consumption-helicopter-booking-update.html',
                        controller: 'consumptionHelicopterBookingUpdateCtrls'
                    }
                },
                permissions: ["consumptionRecordUpdate"]
            })
            .state('consumption-manager.consumption-helicopter-booking-copy', {
                url: '/consumption-helicopter-booking-copy/:id',
                views: {
                    'helicopter': {
                        templateUrl: 'views/consumption-manager/consumption-helicopter-booking-update.html',
                        controller: 'consumptionHelicopterBookingUpdateCtrls'
                    }
                },
                permissions: ["consumptionRecordCopy"]
            })
            .state('consumption-manager.consumption-helicopter-booking-detail', {
                url: '/consumption-helicopter-booking-detail/:id',
                views: {
                    'helicopter': {
                        templateUrl: 'views/consumption-manager/consumption-helicopter-booking-detail.html'
                    }
                },
                permissions: ["consumptionRecordView"]
            })
            //ship
            .state('consumption-manager.consumption-ship-ticket-booking-update', {
                url: '/consumption-ship-ticket-booking-update/:id',
                views: {
                    'ship_manage': {
                        templateUrl: 'views/consumption-manager/consumption-ship-ticket-booking-update.html',
                        controller: 'consumptionShipTicketBookingUpdateCtrls'
                    }
                },
                permissions: ["consumptionRecordUpdate"]
            })
            .state('consumption-manager.consumption-ship-ticket-booking-copy', {
                url: '/consumption-ship-ticket-booking-copy/:id',
                views: {
                    'ship_manage': {
                        templateUrl: 'views/consumption-manager/consumption-ship-ticket-booking-update.html',
                        controller: 'consumptionShipTicketBookingUpdateCtrls'
                    }
                },
                permissions: ["consumptionRecordCopy"]
            })
            .state('consumption-manager.consumption-ship-ticket-booking-detail', {
                url: '/consumption-ship-ticket-booking-detail/:id',
                views: {
                    'ship_manage': {
                        templateUrl: 'views/consumption-manager/consumption-ship-ticket-booking-detail.html'
                    }
                },
                permissions: ["consumptionRecordView"]
            })
            //air
            .state('consumption-manager.consumption-air-booking-update', {
                url: '/consumption-air-booking-update/:id',
                views: {
                    'air': {
                        templateUrl: 'views/consumption-manager/consumption-air-booking-update.html',
                        controller: 'consumptionAirBookingUpdateCtrls'
                    }
                },
                permissions: ["consumptionRecordUpdate"]
            })
            .state('consumption-manager.consumption-air-booking-copy', {
                url: '/consumption-air-booking-copy/:id',
                views: {
                    'air': {
                        templateUrl: 'views/consumption-manager/consumption-air-booking-update.html',
                        controller: 'consumptionAirBookingUpdateCtrls'
                    }
                },
                permissions: ["consumptionRecordCopy"]
            })
            .state('consumption-manager.consumption-air-booking-detail', {
                url: '/consumption-air-booking-detail/:id',
                views: {
                    'air': {
                        templateUrl: 'views/consumption-manager/consumption-air-booking-detail.html'
                    }
                },
                permissions: ["consumptionRecordView"]
            })
            //car
            .state('consumption-manager.consumption-car-booking-update', {
                url: '/consumption-car-booking-update/:id',
                views: {
                    'car': {
                        templateUrl: 'views/consumption-manager/consumption-car-booking-update.html',
                        controller: 'consumptionCarBookingUpdateCtrls'
                    }
                },
                permissions: ["consumptionRecordUpdate"]
            })
            .state('consumption-manager.consumption-car-booking-copy', {
                url: '/consumption-car-booking-copy/:id',
                views: {
                    'car': {
                        templateUrl: 'views/consumption-manager/consumption-car-booking-update.html',
                        controller: 'consumptionCarBookingUpdateCtrls'
                    }
                },
                permissions: ["consumptionRecordCopy"]
            })
            .state('consumption-manager.consumption-car-booking-detail', {
                url: '/consumption-car-booking-detail/:id',
                views: {
                    'car': {
                        templateUrl: 'views/consumption-manager/consumption-car-booking-detail.html'
                    }
                },
                permissions: ["consumptionRecordView"]
            })
            //ticket
            .state('consumption-manager.consumption-admission-ticket-booking-update', {
                url: '/consumption-admission-ticket-booking-update/:id',
                views: {
                    'ticket': {
                        templateUrl: 'views/consumption-manager/consumption-admission-ticket-booking-update.html',
                        controller: 'consumptionTicketBookingUpdateCtrls'
                    }
                },
                permissions: ["consumptionRecordUpdate"]
            })
            .state('consumption-manager.consumption-admission-ticket-booking-copy', {
                url: '/consumption-admission-ticket-booking-copy/:id',
                views: {
                    'ticket': {
                        templateUrl: 'views/consumption-manager/consumption-admission-ticket-booking-update.html',
                        controller: 'consumptionTicketBookingUpdateCtrls'
                    }
                },
                permissions: ["consumptionRecordCopy"]
            })
            .state('consumption-manager.consumption-admission-ticket-booking-detail', {
                url: '/consumption-admission-ticket-booking-detail/:id',
                views: {
                    'ticket': {
                        templateUrl: 'views/consumption-manager/consumption-admission-ticket-booking-detail.html'
                    }
                },
                permissions: ["consumptionRecordView"]
            })
            //other
            .state('consumption-manager.consumption-other-booking-update', {
                url: '/consumption-other-booking-update/:id',
                views: {
                    'other': {
                        templateUrl: 'views/consumption-manager/consumption-other-booking-update.html',
                        controller: 'consumptionOtherBookingUpdateCtrls'
                    }
                },
                permissions: ["consumptionRecordUpdate"]
            })
            .state('consumption-manager.consumption-other-booking-copy', {
                url: '/consumption-other-booking-copy/:id',
                views: {
                    'other': {
                        templateUrl: 'views/consumption-manager/consumption-other-booking-update.html',
                        controller: 'consumptionOtherBookingUpdateCtrls'
                    }
                },
                permissions: ["consumptionRecordCopy"]
            })
            .state('consumption-manager.consumption-other-booking-detail', {
                url: '/consumption-other-booking-detail/:id',
                views: {
                    'other': {
                        templateUrl: 'views/consumption-manager/consumption-other-booking-detail.html'
                    }
                },
                permissions: ["consumptionRecordView"]
            })
//          .state('consumption-manager.consumption-hotel-booking-search', {
//              url: '/consumption-hotel-booking-search',
//              views:{
//                  'search':{
//                      templateUrl: 'views/consumption-manager/consumption-hotel-booking-search.html'
//                  }
//              }
//          })

            .state('consumption-summary', {
                url: '/consumption-manager/consumption-summary',
                templateUrl: 'views/consumption-manager/consumption-summary.html',
                permissions: ["consumptionSummaryView"]
            })
            //消費轉移
            .state('consumption-transfer', {
                url: '/consumption-manager/consumption-transfer',
                templateUrl: 'views/consumption-manager/consumption-transfer.html'
                //permissions : ["consumptionRecordView"]
            })
            .state('consumption-record', {
                url: '/consumption-manager/consumption-record',
                templateUrl: 'views/consumption-manager/consumption-record.html',
                permissions: ["consumptionRecordView"],
                nextLinks: [
                    '/consumption-hotel-booking-detail/:id',
                    '/consumption-food-fly-booking-detail/:id',
                    '/consumption-helicopter-booking-detail/:id',
                    '/consumption-ship-ticket-booking-detail/:id',
                    '/consumption-car-booking-detail/:id',
                    '/consumption-air-booking-detail/:id',
                    '/consumption-admission-ticket-booking-detail/:id',
                    '/consumption-other-booking-detail/:id'
                ]
            })
            .state('consumption-record-params', {
                url: '/consumption-manager/consumption-record/:agent_code',
                templateUrl: 'views/consumption-manager/consumption-record.html',
                permissions: ["consumptionRecordView"],
                nextLinks: [
                    '/consumption-hotel-booking-detail/:id',
                    '/consumption-food-fly-booking-detail/:id',
                    '/consumption-helicopter-booking-detail/:id',
                    '/consumption-ship-ticket-booking-detail/:id',
                    '/consumption-car-booking-detail/:id',
                    '/consumption-air-booking-detail/:id',
                    '/consumption-admission-ticket-booking-detail/:id',
                    '/consumption-other-booking-detail/:id'
                ]
            })
            .state('consumption-record.hotel', {
                url: '/hotel/:id',
                views: {
                    'detail': {
                        templateUrl: 'views/consumption-manager/consumption-hotel-booking-detail.html'
                    }
                },
                permissions: ["consumptionRecordView"]
            })
            .state('consumption-record.food', {
                url: '/food/:id',
                views: {
                    'detail': {
                        templateUrl: 'views/consumption-manager/consumption-food-fly-booking-detail.html'
                    }
                },
                permissions: ["consumptionRecordView"]
            })
            .state('consumption-record.helicopter', {
                url: '/helicopter/:id',
                views: {
                    'detail': {
                        templateUrl: 'views/consumption-manager/consumption-helicopter-booking-detail.html'
                    }
                },
                permissions: ["consumptionRecordView"]
            })
            .state('consumption-record.ship', {
                url: '/ship/:id',
                views: {
                    'detail': {
                        templateUrl: 'views/consumption-manager/consumption-ship-ticket-booking-detail.html'
                    }
                },
                permissions: ["consumptionRecordView"]
            })
            .state('consumption-record.air', {
                url: '/air/:id',
                views: {
                    'detail': {
                        templateUrl: 'views/consumption-manager/consumption-air-booking-detail.html'
                    }
                },
                permissions: ["consumptionRecordView"]
            })
            .state('consumption-record.car', {
                url: '/car/:id',
                views: {
                    'detail': {
                        templateUrl: 'views/consumption-manager/consumption-car-booking-detail.html'
                    }
                },
                permissions: ["consumptionRecordView"]
            })
            .state('consumption-record.ticket', {
                url: '/ticket/:id',
                views: {
                    'detail': {
                        templateUrl: 'views/consumption-manager/consumption-admission-ticket-booking-detail.html'
                    }
                },
                permissions: ["consumptionRecordView"]
            })
            .state('consumption-record.other', {
                url: '/other/:id',
                views: {
                    'detail': {
                        templateUrl: 'views/consumption-manager/consumption-other-booking-detail.html'
                    }
                },
                permissions: ["consumptionRecordView"]
            })
            //報表管理
            .state('report-manager', {
                url: '/report/report-manager',
                templateUrl: 'views/report/report-manager.html',
                permissions: ["reportView"]
            })
            .state('deposit-ticket-summary-report', { //存單匯總
                url: '/report/deposit-ticket-summary-report',
                templateUrl: 'views/report/deposit-ticket-summary-report.html',
                permissions: ["reportDepositTicketTotalView"]
            })
            .state('deposit-ticket-stream-report', { //存單流水報表
                url: '/report/deposit-ticket-stream-report',
                templateUrl: 'views/report/deposit-ticket-stream-report.html',
                permissions: ["reportDepositTicketWaterReportView"]
            })
            .state('deposit-ticket-day-report', { //存單日報表
                url: '/report/deposit-ticket-day-report',
                templateUrl: 'views/report/deposit-ticket-day-report.html',
                permissions: ["reportDepositTicketDayReportView"]
            })
            .state('deposit-card-summary-report', { //存卡匯總
                url: '/report/deposit-card-summary-report',
                templateUrl: 'views/report/deposit-card-summary-report.html',
                permissions: ["reportDepositCardTotalView"]
            })
            .state('deposit-total-report', { //存款統計報表
                url: '/report/deposit-total-report',
                templateUrl: 'views/report/deposit-total-report.html',
                permissions: ["reportDepositStatisticsReportView"]
            })
            .state('deposit-ticket-report', { //存單報表
                url: '/report/deposit-ticket-report',
                templateUrl: 'views/report/deposit-ticket-report.html',
                permissions: ["reportDepositTicketReportView"]
            })
            .state('deposit-card-water-report', { //存卡流水報表
                url: '/report/deposit-card-water-report',
                templateUrl: 'views/report/deposit-card-water-report.html',
                permissions: ["reportDepositcardRecordReportView"]
            })
            .state('transfer-water-report', { //轉賬流水報表
                url: '/report/transfer-water-report',
                templateUrl: 'views/report/transfer-water-report.html',
                permissions: ["reportTransferReportView"]
            })
            .state('cross-transfer-water-report', { //飛數流水報表
                url: '/report/cross-transfer-water-report',
                templateUrl: 'views/report/cross-transfer-water-report.html',
                permissions: ["reportCrossTransferReportView"]
            })
            .state('deposit-card-report', { //存卡報表
                url: '/report/deposit-card-report',
                templateUrl: 'views/report/deposit-card-report.html',
                permissions: ["reportDepositCardReportView"]
            })
            .state('loan-summary-report', { //貸款匯總
                url: '/report/loan-summary-report',
                templateUrl: 'views/report/loan-summary-report.html',
                permissions: ["reportLoanBusinessTotalView"]
            })
            .state('loan-report', { //貸款報表
                url: '/report/loan-report',
                templateUrl: 'views/report/loan-report.html',
                permissions: ["reportLoanReportView"]
            })
            .state('loan-water-report', { //貸款流水報表
                url: '/report/loan-water-report',
                templateUrl: 'views/report/loan-water-report.html',
                permissions: ["reportMarkerRepaymentReportView"]
            })
            .state('loan-day-report', { //貸款日報表
                url: '/report/loan-day-report',
                templateUrl: 'views/report/loan-day-report.html',
                permissions: ["reportLoanDailyReportView"]
            })
            .state('every-hall-loan-record-report', { //各廳館貸款記錄報表
                url: '/report/every-hall-loan-record-report',
                templateUrl: 'views/report/every-hall-loan-record-report.html',
                permissions: ["reportEveryHallLoanRecordReportView"]
            })
            .state('rolling-summary-report', { //轉碼匯總
                url: '/report/rolling-summary-report',
                templateUrl: 'views/report/rolling-summary-report.html',
                permissions: ["reportRollingTotalView"]
            })
            .state('rolling-report', { //轉碼報表
                url: '/report/rolling-report',
                templateUrl: 'views/report/rolling-report.html',
                permissions: ["reportRollingReportView"]
            })

            .state('consumption-summary-report', { //消費匯總
                url: '/report/consumption-summary-report',
                templateUrl: 'views/report/consumption-summary-report.html',
                permissions: ["reportConsumptionTotalView"]
            })
            .state('consumption-report', { //消費報表
                url: '/report/consumption-report',
                templateUrl: 'views/report/consumption-report.html',
                permissions: ["reportConsumptionReportView"]
            })
            .state('consumption-income-report', { //消費收益報表
                url: '/report/consumption-income-report',
                templateUrl: 'views/report/consumption-income-report.html',
                permissions: ["reportConsumptionProfitReportView"]
            })
            .state('scene-record-report', { //場面數報表
                url: '/report/scene-record-report',
                templateUrl: 'views/report/scene-record-report.html',
                permissions: ["reportSceneCountReportView"]
            })

            .state('overdue-allowance-report', { //逾期津貼報表
                url: '/report/overdue-allowance-report',
                templateUrl: 'views/report/overdue-allowance-report.html',
                permissions: ["reportOverdueAllowanceView"]
            })
            .state('winding-allowance-income-report', { //下線津貼收益報表
                url: '/report/winding-allowance-income-report',
                templateUrl: 'views/report/winding-allowance-income-report.html',
                permissions: ["reportUnderlingAllowanceView"]
            })
            .state('allowance-recovery-report', { //津貼回收報表
                url: '/report/allowance-recovery-report',
                templateUrl: 'views/report/allowance-recovery-report.html',
                permissions: ["reportAllowanceRetrieveView"]
            })
            .state('divided-into', { //分成報表
                url: '/report/divided-into',
                templateUrl: 'views/report/divided-into.html',
                permissions: ["reportAllowanceRetrieveView"]
            })


            .state('consumption-set-manager', {
                url: '/consumption-set/consumption-set-manager/:type',
                templateUrl: 'views/consumption-set/consumption-set-manager.html',
                permissions: ["consumptionSettingView"]
            })
            .state('consumption-set-manager.consumption-set-helicopter-route', {
                url: '/consumption-set-helicopter-route',
                views: {
                    'helicopter': {
                        templateUrl: 'views/consumption-set/consumption-set-helicopter-route.html'
                    }
                }
            })
            .state('consumption-set-manager.consumption-set-ship-basc', {
                url: '/consumption-set-ship-basc',
                views: {
                    'ship': {
                        templateUrl: 'views/consumption-set/consumption-set-ship-basc.html'
                    }
                }
            })
            .state('consumption-set-manager.consumption-set-helicopter', {
                url: '/consumption-set-helicopter',
                views: {
                    'helicopter': {
                        templateUrl: 'views/consumption-set/consumption-set-helicopter.html'
                    }
                }
            })
//          //系统设置
//          .state('system-set-manager', {
//              url: '/system-set/system-set-manager',
//              templateUrl: 'views/system-set/system-set-manager.html'
//          })
            .state('common/signin', {
                url: '/common/signin',
                templateUrl: 'views/common/signin.html'
            })

            //系統設置
            .state('sms-notification', {  // not used
                url: '/system-set/sms-notification',
                templateUrl: 'views/system-set/sms-notification.html'
                //permissions : "commissionLimitView"
            })
            .state('commission-fraction', { //佣金份數
                url: '/system-set/commission-fraction',
                templateUrl: 'views/system-set/commission-fraction.html',
                permissions: "commissionDivideView"

            })
            //佣金分成默認
            .state('commission-sharing', {
                url: '/system-set/commission-sharing',
                templateUrl: 'views/system-set/commission-sharing.html',
                permissions: ['commissionDivideView']
            })
            .state('company-agent-manager', { //公司戶口管理
                url: '/system-set/company-agent-manager',
                templateUrl: 'views/system-set/company-agent-manager.html',
                permissions: "specialAgentView"
            })
            .state('keyboard-manager', { //快捷鍵設置
                url: '/system-set/keyboard-manager',
                templateUrl: 'views/system-set/keyboard-manager.html',
                permissions: "shortCutsView"
            })


            .state('account-authorization', {
                url: '/system-set/account-authorization',  //not used
                templateUrl: 'views/system-set/account-authorization.html'
            })

            .state('capital-type-manager', {
                url: '/system-set/capital-type-manager',  // not used
                templateUrl: 'views/system-set/capital-type-manager.html'
            })

            .state('capital-type-create', {
                url: '/system-set/capital-type-create',  // not used
                templateUrl: 'views/system-set/capital-type-create.html',
                permissions: "commissionLimitView"
            })

            .state('hall-manager', {
                url: '/system-set/hall-manager',  // not used
                templateUrl: 'views/system-set/hall-manager.html',
                permissions: "commissionLimitView"
            })

            .state('funds-type-manager', {
                url: '/system-set/funds-type-manager',// note
                templateUrl: 'views/system-set/funds-type-manager.html',
                permissions: "commissionLimitView"
            })

            .state('integral-type-binding', {
                url: '/system-set/integral-type-binding', // not used
                templateUrl: 'views/system-set/integral-type-binding.html',
                permissions: "commissionLimitView"
            })
            //幣種
            .state('commission-currency', {
                url: '/system-set/commission-currency',
                templateUrl: 'views/system-set/commission-currency.html',
                permissions: "commissionLimitView"
            })
            //佣金限制
            .state('commission-limit', {
                url: '/system-set/commission-limit',
                templateUrl: 'views/system-set/commission-limit.html',
                permissions: "commissionLimitView"
            })
            //系統設定用戶
            .state('userinfo-list', {
                url: '/system-set/userinfo-list',
                templateUrl: 'views/system-set/userinfo-list.html',
                permissions: "userView",
                nextLinks: ['/system-set/userinfo-create/:id']

            })
            .state('userinfo-create', {
                url: '/system-set/userinfo-create',
                templateUrl: 'views/system-set/userinfo-create.html',
                permissions: "userCreate"
            })
            .state('userinfo-create-params', {
                url: '/system-set/userinfo-create/:id',
                templateUrl: 'views/system-set/userinfo-create.html',
                permissions: "userUpdate"
            })
            //
            .state('integral-type-manager', { //not use
                url: '/system-set/integral-type-manager',
                templateUrl: 'views/system-set/integral-type-manager.html',
                permissions: "commissionLimitView"
            })
            //修改密碼
            .state('user-password', {
                url: '/system-set/user-password',
                templateUrl: 'views/system-set/user-password.html',
                permissions: 'personalPasswordUpdate'
            })
            .state('company-contact-create', {
                url: '/system-set/company-contact-create',
                templateUrl: 'views/system-set/company-contact-create.html',
                permissions: "compContactView"
            })
            .state('integral-type-create', {
                url: '/system-set/integral-type-create',
                templateUrl: 'views/system-set/integral-type-create.html',
                permissions: "integralTypeView"
            })
            .state('integral-type-bind', {
                url: '/system-set/integral-type-bind',
                templateUrl: 'views/system-set/integral-type-bind.html',
                permissions: "integralTypeBindView"
            })

            //操作機器
            .state('workstation', {
                url: '/system-set/workstation',
                templateUrl: 'views/system-set/workstation.html',
                permissions: "workstationView"
            })

            //打印机设置
            .state('printer-set', {
                url: '/system-set/printer-set',
                templateUrl: 'views/system-set/printer-set.html',
                controller: "printersetCtrl"

            })

            //短訊管理
            .state('share/share-send-sms', {
                url: '/share/share-send-sms/:agent_info_id',
                templateUrl: 'views/share/share-send-sms.html'
            })
            .state('sms-template-set', {
                url: '/sms-manager/sms-template-set',
                templateUrl: 'views/sms-manager/sms-template-set.html'
            })
            .state('useful-phrase-template', {
                url: '/sms-manager/useful-phrase-template',
                templateUrl: 'views/sms-manager/useful-phrase-template.html',
                permissions: ["smsTemplateView","smsTemplateCreate","smsTemplateUpdate","smsTemplateView"]
            })
            .state('sms-group-manager', {
                url: '/sms-manager/sms-group-manager',
                templateUrl: 'views/sms-manager/sms-group-manager.html',
                permissions: ["smsGroupView","smsGroupCreate","smsGroupUpdate","smsGroupView"]
            })
            .state('send-sms', {
                url: '/sms-manager/send-sms',
                templateUrl: 'views/sms-manager/send-sms.html',
                permissions: ["smsSendView","smsSendCreate","smsSendUpdate","smsSendView"]
            })
            .state('sms-flow-count', {
                url: '/sms-manager/sms-flow-count',
                templateUrl: 'views/sms-manager/sms-flow-count.html'
            })
            .state('sms-record', {
                url: '/sms-manager/sms-record',
                templateUrl: 'views/sms-manager/sms-record.html',
                permissions: ["smsRecordView","smsRecordCreate","smsRecordUpdate","smsRecordView"]
            })

            .state('immediate-payment-payment-create', {
                url: '/immediate-payment/payment-create',
                templateUrl: 'views/immediate-payment/payment-create.html',
                permissions: ['immediatePaymentCreate']
            })
            .state('agent-immediate-payment-create', {
                url: '/immediate-payment/payment-create/:agent_code',
                templateUrl: 'views/immediate-payment/payment-create.html',
                permissions: ['immediatePaymentCreate']
            })
            .state('immediate-payment-payment-record', {
                url: '/immediate-payment/payment-record',
                templateUrl: 'views/immediate-payment/payment-record.html',
                nextLinks: ['/immediate-payment/payment-detail/:id']
            })
            .state('immediate-payment-commission-record', {
                url: '/immediate-payment/commission-record',
                templateUrl: 'views/immediate-payment/commission-record.html',
                nextLinks: ['/immediate-payment/payment-detail/:id'],
                permissions: ['immediatePaymentRecordView', 'immediatePaymentRecordRelease', 'immediatePaymentRecordDelete']
            })
            .state('immediate-payment-commission-create', {
                url: '/immediate-payment/commission-create',
                templateUrl: 'views/immediate-payment/commission-create.html'
            })
//          .state('immediate-payment-detail', {
//              url:'/immediate-payment/payment-detail',
//              templateUrl: 'views/immediate-payment/payment-detail.html'
//          })
            .state('immediate-payment-detail', {
                url: '/immediate-payment/payment-detail/:id',
                templateUrl: 'views/immediate-payment/payment-detail.html',
                permissions: ['immediatePaymentRecordView']
            })
            //積分管理
            .state('integral-sms', {
                url: '/integral/integral-sms',
                templateUrl: 'views/integral/integral-sms.html',
                permissions: ['integralDueSendSMS']
            })
            .state('agent-integral-sms', {
                url: '/integral/integral-sms/:agent_code',
                templateUrl: 'views/integral/integral-sms.html',
                permissions: ['integralDueSendSMS']
            })
            .state('integral-manager', {
                url: '/integral/integral-manager',
                templateUrl: 'views/integral/integral-manager.html',
                permissions: ['integralView', 'integralTransfer', 'integralSetting']
            })
            .state('agent-integral-manager', {
                url: '/integral/integral-manager/:agent_code',
                templateUrl: 'views/integral/integral-manager.html',
                permissions: ['integralView', 'integralTransfer', 'integralSetting']
            })
            .state('integral-transfer-record', {
                url: '/integral/integral-transfer-record',
                templateUrl: 'views/integral/integral-transfer-record.html',
                permissions: ['integralTransferRecordView']
            })
            //下月過期津貼
            .state('allowance-retrieve', {
                url: '/integral/allowance-retrieve',
                templateUrl: 'views/integral/allowance-retrieve.html'
                //TODO 需确认权限
            })
            // 旧数据
            // 场面截数
            .state('old-scene-shift-record', {
                url: '/old/scene-shift-record',
                templateUrl: 'views/old-data/scene-shift-record.html'
            })
            // 場面數記錄
            .state('old-screening-shift-list', {
                url: '/old/screening-shift-list',
                templateUrl: 'views/old-data/screening-shift-list.html'
            })
            // 存卡流水
            .state('old-deposit-card-record', {
                url: '/old/deposit-card-record',
                templateUrl: 'views/old-data/deposit-card-record.html'
            })
            // 轉碼流水
            .state('old-rolling-record-list', {
                url: '/old/rolling-record-list',
                templateUrl: 'views/old-data/rolling-record-list.html'
            })
            // 消費記錄
            .state('old-consumption-record-list', {
                url: '/old/consumption-record-list',
                templateUrl: 'views/old-data/consumption-record-list.html'
            })
            // 存單流水
            .state('old-deposit-ticket-record', {
                url: '/old/deposit-ticket-record',
                templateUrl: 'views/old-data/deposit-ticket-record.html'
            })
            // 截大數管理
            .state('old-shift-record-monthly', {
                url: '/old/shift-record-monthly',
                templateUrl: 'views/old-data/shift-record-monthly.html'
            })
            // 買碼記錄
            .state('old-buy-chips', {
                url: '/old/buy-chips',
                templateUrl: 'views/old-data/buy-chips.html'
            })
            // 截更管理
            .state('old-shift-record-day', {
                url: '/old/shift-record-day',
                templateUrl: 'views/old-data/shift-record-day.html'
            })
            // 即出記錄
            .state('old-commission-immediate', {
                url: '/old/commission-immediate',
                templateUrl: 'views/old-data/commission-immediate.html'
            })
            // 貸款流水
            .state('old-marker-record', {
                url: '/old/marker-record',
                templateUrl: 'views/old-data/marker-record.html'
            })
            //分成列印
            .state('profit-share-print',{
                url: '/profit-share/profit-share-print',
                templateUrl: 'views/profit-share/profit-share-print.html'
            })
            //分成記錄
            .state('profit-share-list',{
                url: '/profit-share/profit-share-list',
                templateUrl: 'views/profit-share/profit-share-list.html'
            })
            // empty
            .state('empty', {
                url: '/empty',
                templateUrl: 'views/share/empty.html'
            });


        // catch all route
        $urlRouterProvider.otherwise('agent/agent-detail/');
//      $urlRouterProvider.otherwise('/agent/agent-detail/:id');

    }).constant('paginationConfig', {
        itemsPerPage: 10,
        boundaryLinks: true,
        directionLinks: true,
        firstText: '首頁',
        previousText: '上一頁',
        nextText: '下一頁',
        lastText: '尾頁',
        rotate: false,
        maxSize: 10
    }).config(function (uiSelectConfig) {
        uiSelectConfig.theme = 'bootstrap';
    }).config(function (datepickerPopupConfig) {
        datepickerPopupConfig.showButtonBar = false;
    }).config(function (datepickerConfig) {
        datepickerConfig.showWeeks = false;
        datepickerConfig.startingDay = 1;
    }).config(function ($datepickerProvider) {
        angular.extend($datepickerProvider.defaults, {
            dateFormat: 'yyyy-MM-dd',
            startWeek: true
        });
    }).config(function ($timepickerProvider) {
        angular.extend($timepickerProvider.defaults, {
            timeFormat: 'HH:mm:ss',
            length: 7,
            keyboard: true,
            minuteStep: 1,
            secondStep: 1
        });
    }).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('validateInterceptor');
        $httpProvider.interceptors.push('errorInterceptor');
        $httpProvider.interceptors.unshift('resubmitInterceptor');
//      $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
//      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//      $httpProvider.defaults.transformRequest = function(data){
//          if (data === undefined) {
//              return data;
//          }
//          return $.param(data);
//      }


    }])
}).call(this);
