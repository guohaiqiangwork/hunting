define([
    'app',
    'config',
    'constants',
    'jedate',
    'layer'
], function (app, config, constants, jeDate, layer) {
    app.registerController('registerCtrl', ['$scope', '$modal', '$state', '$$neptune',
        function ($scope, $modal, $state, $$neptune) {
            $scope.isComplete = false;
            $scope.isVerification = false;
            $scope.fdcom = {};
            /**
             * 打开劳动协议modal
             */
            $scope.openWorkAgreement = function () {
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'register/workAgreement.modal.tpl.html',
                    resolve: {
                        register: function () {
                            return $scope.register
                        }
                    },
                    controller: function ($scope, $modalInstance, register) {
                        $scope.register = register;
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        }
                    },
                    size: 'sm'
                })
            };
            /**
             * 注册成功modal
             */
            var openRegisterSuccess = function () {
                $modal.open({
                    backdrop: 'static',
                    animation: true,
                    templateUrl: 'register/registerSuccess.modal.tpl.html',
                    resolve: {},
                    controller: function ($scope, $modalInstance) {
                        $scope.close = function () {
                            $modalInstance.dismiss();
                        };

                        $scope.goToLogin = function () {
                            $scope.close();
                            $state.go('login');
                        };
                    },
                    size: 'sm'
                })
            };

            /**
             * 注册
             */
            function register() {
                if (!$scope.register.password) {
                    layer.msg("密码不能为空", {time: 3000});
                    return false;
                }
                if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test($scope.register.password))) {
                    layer.msg("密码必须为8-16位,数字字母组合而成!", {time: 3000});
                    return false;
                }
                if ($scope.register.password !== $scope.register.rpPassword) {
                    layer.msg("两次输入密码不同", {time: 3000});
                    return false;
                }
                if ($scope.register.isPass === 'false') {
                    layer.msg("请同意《劳动协议》", {time: 3000});
                    return false;
                }
                var keyWord = {
                    register: $scope.register,
                    fdcom: $scope.fdcom
                };
                $$neptune.$user.register(keyWord, {
                    onSuccess: function (data) {
                        //注册成功，打开注册成功提示modal
                        openRegisterSuccess();
                    },
                    onError: function (e) {
                        // layer.msg("接口问题", {time: 3000});
                    }
                });
            }

            /**
             * 注册
             */
            $scope.externalRegistration = function () {
                // 是否开始验证
                $scope.isComplete = true;
                if (!$scope.isVerification) {
                    return false;
                }
                register();
            };
            $scope.selectDate = function (ele) {
                jeDate({
                    dateCell: '#' + ele,
                    format: 'yyyy-mm-dd',
                    insTrigger: false,
                    isClear: true, //是否显示清空
                    isToday: false,
                    okfun: function (elem, val, date) {
                        if (ele === "startDate") {

                        }
                        if (ele === "endDate") {

                        }
                    },
                    choosefun: function (val) {
                        if (ele === "startDate") {

                        }
                        if (ele === "endDate") {

                        }
                    },
                    clearfun: function () {
                        if (ele === "startDate") {

                        }
                        if (ele === "endDate") {

                        }
                    }
                });
            };

            $scope.goToLogin = function () {
                $state.go('login')
            };
            /**
             * 查询顶级机构
             */
            function findFdcom() {
                $$neptune.$user.findFdcom({
                    onSuccess: function (data) {
                        $scope.fdcom = data;
                    },
                    onError: function (e) {
                        // layer.msg("接口问题", {time: 3000});
                    }
                });
            }

            /**
             * 创建treeView
             * @param treeData
             */
            // $scope.isShow = false;
            function creatTreeView(treeData) {
                $('#treeView').treeview({
                        levels: 99,
                        data: treeData,
                        emptyIcon: ""
                    }
                );
                // tree复选框选中事件
                $('#treeView').on('nodeSelected', function (event, data) {
                    if (data.tags.length > 0 && data.tags[0]) {
                        // 内部机构编码
                        $scope.fdcom.agentCom = data.tags[0].inComCode;
                        // 外部机构编码
                        $scope.fdcom.agentGroup = data.tags[0].id;
                    }
                });
                // tree复选框取消选中事件,若已存在选中，切换时先于选中事件执行
                $('#treeView').on('nodeUnselected', function (event, data) {
                    if (data.tags.length > 0 && data.tags[0]) {
                        // 内部机构编码
                        $scope.fdcom.agentCom = "";
                        // 外部机构编码
                        $scope.fdcom.agentGroup = "";
                    }
                });
            }

            /**
             * 操作树状态
             */
            function operationState(treeNodes) {
                // 存在值并且长度大于0
                if (treeNodes && treeNodes.length > 0) {
                    $.each(treeNodes, function (index, node) {
                        // 默认关闭
                        node.state = {
                            expanded: false
                        };
                        if (node.nodes&&node.nodes.length>0){
                            node.nodes = operationState(node.nodes);
                        }else{
                            node.nodes = undefined;
                        }
                    });
                }
                return treeNodes;
            }

            /**
             * 查询机构树
             */
            function groupTree() {
                $$neptune.groupTree({
                    onSuccess: function (data) {
                        creatTreeView(operationState([data]))
                    },
                    onError: function (e) {
                        // layer.msg("接口问题", {time: 3000});
                    }
                });
            }

            /**
             * 姓名改变
             */
            $scope.nameChange = function () {
                $scope.register.secondParty = $scope.register.name;
            };

            function init() {

                $scope.register = {
                    firstParty: '新奥保险经纪有限公司',//甲方
                    companyAddress: '天津自贸试验区（空港经济区）环河北路80号空港商务园东区9号楼403-05房间',//公司地址
                    firstZipCode: '300308',//甲方邮编
                    secondParty: '',//乙方
                    homeAddress: '',//家庭住址
                    iDCardNo: '',//身份证号
                    secondZipCode: '',//乙方邮编
                    contractPeriod: '2017-03-15',//合同起期
                    contractEnd: '2020-03-14',//合同止期
                    sex: 1,
                    isPass: 'true'
                };
                // 查询顶级机构
                findFdcom();
                //查询机构树
                groupTree();
            }

            init();
        }]);

});