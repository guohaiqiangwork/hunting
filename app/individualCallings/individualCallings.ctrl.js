define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('individualCallingsCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$$neptune', '$timeout','$stateParams',
        function ($scope, $state, $rootScope, localStorageService, $$neptune, $timeout,$stateParams) {
            $scope.active = $stateParams.id||"个人挂证";
            /**
             * 界面跳转
             * @param info
             */
            $scope.switchView = function (info) {
                $scope.active = info;
            };

            /**
             * 所有分类数据
             */
            $scope.classificationBigList = [
                {name: '一级建造师', findName: ''},
                {name: '二级建造师', findName: ''},
                {name: '土木工程师', findName: ''},
                {name: '结构师', findName: ''},
                {name: '公用设备工程师', findName: ''},
                {name: '电气工程师', findName: ''},
                {name: '监理师', findName: ''},
                {name: '造价师', findName: ''},
                {name: '电气工程师', findName: ''},
                {name: '注册咨询师', findName: ''},
                {name: '资质办理与升级', findName: ''},
                {name: '职称证书', findName: ''},
                {name: '建筑师', findName: ''},
                {name: '其他执业证书', findName: ''},
                {name: '一级防护工程师', findName: ''},
                {name: '二级防护工程师', findName: ''},
                {name: '注册消防工程师', findName: ''},
                {name: '八大员', findName: ''}
            ];
            /**
             * 所有小类数据
             * @type {[null,null,null,null,null]}
             */
            $scope.classificationSmallList = [
                {name: '城市规划师', findName: ''},
                {name: '化工工程师', findName: ''},
                {name: '环评工程师', findName: ''},
                {name: '房地产估价师', findName: ''},
                {name: '注册税务师', findName: ''}
            ];
            /**
             * 地区
             * @type {[null,null,null,null,null]}
             */
            $scope.allAreasList = [
                {name: '北京', findName: ''},
                {name: '四川', findName: ''},
                {name: '江苏', findName: ''},
                {name: '上海', findName: ''},
                {name: '广东', findName: ''},
                {name: '山东', findName: ''},
                {name: '河北', findName: ''},
                {name: '浙江', findName: ''},
                {name: '陕西', findName: ''},
                {name: '安徽', findName: ''},
                {name: '重庆', findName: ''},
                {name: '湖北', findName: ''},
                {name: '河南', findName: ''},
                {name: '福建', findName: ''}
            ];

            var init = function () {

            };

            init();
        }]);

});
