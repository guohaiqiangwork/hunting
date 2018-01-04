/**
 * DESC       : 阳光统一管理js的注入、依赖关系js
 * AUTHOR     : 阳光项目组
 *MODIFYLIST : Name           Date           Reason/Contents
 * --------------------------------------------------------
 */
require.config({
    baseUrl: '',
    paths: {
        'jquery': 'assets/js/jquery/jquery.min',
        'angular': 'https://cdn.bootcss.com/angular.js/1.2.29/angular.min',
        'neptune': 'common/api/neptune',
        'ui-bootstrap': 'https://cdn.bootcss.com/angular-ui-bootstrap/0.11.2/ui-bootstrap.min',
        'ui-bootstrap-tpls': 'https://cdn.bootcss.com/angular-ui-bootstrap/0.11.2/ui-bootstrap-tpls.min',
        'angular-ui-router': 'https://cdn.bootcss.com/angular-ui-router/0.2.11/angular-ui-router.min',
        'angular-local-storage': 'assets/js/angular-local-storage/angular-local-storage',
        'angular-couch-potato': 'assets/js/angular-couch-potato/angular-couch-potato',
        'angular-ui-select': 'https://cdn.bootcss.com/angular-ui-select/0.19.4/select.min',
        'app': 'common/app',
        'app-init': 'common/app-init',
        'routeDefs': 'common/routeDefs',
        'mainCtrl': 'common/main.ctrl',
        'codes': 'common/codes.' + window.NEPTUNE.runMode,
        'config': 'common/config.' + window.NEPTUNE.runMode,
        'jsonDB': 'common/data',
        'constants': 'common/constants',
        'angular-mocks': 'assets/js/angular-mocks/angular-mocks',
        'backend-mocks': 'common/backend-mocks',
        'jedate': 'assets/js/angular-jedate/jedate',//兼容IE8时间插件
        'angular-jedate': 'assets/js/angular-jedate/angular-jedate',//兼容IE8时间插件
        'adapter': 'common/adapter',
        'plupload': 'assets/js/plupload/plupload.full.min',
        'base64': 'assets/js/plupload/Base64',
        'json2': 'assets/js/plupload/json2',
        'md5': 'assets/js/plupload/md5',
        'layer': 'assets/js/layer/layer',
        'respond': 'assets/js/respond',
        'mc-bakery': 'assets/js/mc-bakery-tpls-0.0.3',
        'jquery-qrcode': 'assets/js/jquery/jquery.qrcode.min',
        'MD5': 'assets/js/MD5',
        'bootstrap-treeview': 'assets/js/bootstrap-treeview/bootstrap-treeview',
        'echarts': 'assets/js/echart/echarts',
        'responsive-menu': 'assets/js/js/responsive-menu',
        'slide': 'assets/js/jquery.slide',
        'snippet': 'assets/js/jquery.snippet.min',
        'wow': 'assets/js/wow.min'
    },
    shim: {
        'jquery': {
            exports: 'jquery'
        },
        'wow': {
            exports: 'wow'
        },
        'layer': {
            deps: ['jquery']
        },
        'responsive-menu': {
            deps: ['jquery']
        },
        'angular': {
            exports: 'angular'
        },
        'respond': {
            deps: ['jquery'],
            exports: 'respond'
        },
        'app': {
            deps: ['angular']
        },
        'app-init': {
            deps: ['angular']
        },
        'mainCtrl': {
            deps: ['angular']
        },
        'routeDefs': {
            deps: ['angular']
        },
        'angular-local-storage': {
            deps: ['angular']
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'angular-couch-potato': {
            deps: ['angular']
        },
        'ui-bootstrap': {
            deps: ['angular']
        },
        'angular-ui-select': {
            deps: ['angular']
        },
        'angular-mocks': {
            deps: ['angular']
        },
        'angular-ui-bootstrap': {
            deps: ['angular']
        },
        'angular-jedate': {
            deps: ['angular']
        },
        'jedate': {
            deps: ['jquery']
        },
        'plupload': {
            deps: ['jquery']
        },
        'mc-bakery': {
            deps: ['jquery']
        },
        'bootstrap-treeview': {
            deps: ['jquery']
        },
        'jquery-qrcode': {
            deps: ['jquery']
        },
        'echarts': {
            exports: 'echarts'
        },
        'slide': {
            deps: ['jquery']
        },
        'snippet': {
            deps: ['jquery']
        }
    },
    priority: [
        'jquery',
        'angular',
        'app-init',
        'mainCtrl',
        'echarts',
        'responsive-menu',
        'slide',
        'snippet'
    ]
});
require(['jquery',
        'angular',
        'app-init',
        'respond',
        'mainCtrl',
        'echarts',
        'responsive-menu',
        'slide',
        'snippet'],
    function ($, angular) {
        angular.element().ready(function () {
            angular.bootstrap($('#ng-app'), ['calla']);
        });
    });