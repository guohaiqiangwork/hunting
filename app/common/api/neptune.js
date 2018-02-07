define([
    'config',
    'constants',
    'adapter',
    'common/api/mc.user',
    'common/api/neptune.finder',
    'common/api/neptune.release',
    'common/api/mc.multiple',
    'common/api/mc.util',
    'common/api/mc.sendVerification',
    'common/api/mc.textSwitch',
    'mc-bakery',
    'jquery-qrcode',
    'layer',
    'MD5',
    'md5'
], function (config, constants, adapter) {
    angular.module('neptune.api', [
        'neptune.adapter',
        'mc.user',
        'neptune.finder',
        'neptune.release',
        'mc.multiple',
        'mc.util',
        'mc.sendVerification',
        'mc.textSwitch',
        'mc.bakery'
    ])
        .factory('$$neptune', ['$q', '$http', '$timeout', '$$adapter', '$rootScope', '$$user', '$$finder', '$$release',
            function ($q, $http, $timeout, $$adapter, $rootScope, $$user, $$finder, $$release) {
                return {
                    $user: $$user,
                    $release: $$release,
                    /**
                     * 列表查询
                     * @param target
                     * @param keyWords
                     * @param pagination
                     * @param options
                     */
                    find: function (target, keyWords, options, pagination) {
                        $$finder.find(target, keyWords, options, pagination);
                    }
                };
            }])
        .directive('buttonBorder', ['$$adapter', function ($$adapter, $location) {
            return {
                restrict: 'AE',
                replace: true,
                templateUrl: 'common/template/button_border.html',
                scope: {
                    cmsData: '='
                },
                controller: function ($scope, $rootScope, $attrs, $element, $timeout, $$user, $location, $state) {

                    var init = function () {

                    };
                    init();
                }
            }
        }])


});

