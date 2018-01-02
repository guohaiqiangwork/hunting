define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.controller('MainCtrl', ['$scope', '$$neptune', '$rootScope', '$state', '$timeout', 'localStorageService', '$modal',
        function ($scope, $$neptune, $rootScope, $state, $timeout, localStorageService, $modal) {
            // 标签名字
            $rootScope.labelName = '';
            // 产品名称
            $rootScope.headProductName = '';
            // 提示框配置
            layer.config({
                path: "assets/js/layer/"
            });
            // 返回失败监听
            $rootScope.$on(constants.EVENTS.BACKEND_EXCEPTION, function (event, args) {
                layer.msg(args.message, {time: 2000});
                // $timeout(function(){
                //     $state.go('login');
                // },10);
            });
            // 返回成功监听
            $rootScope.$on(constants.EVENTS.BACKEND_SUCCESS, function (event, args) {
                layer.msg(args.message, {time: 1000});
            });
            // 没有登录
            $rootScope.$on(constants.AUTH.UNAUTHORIZED, function (event, args) {
                $timeout(function () {
                    localStorageService.set(constants.OPERATE_TYPE.LOCAL_USER, undefined);
                    $state.go('login');
                }, 10);
            });

            //返回上一个页面
            $scope.goToPage = function (labelName) {
                javascript: history.go(-1);
                // 删除标签
                if (labelName)
                    $rootScope.labelName = labelName;
            };
            //资质动态跳转
            $scope.goToQualifications = function (id) {
                $state.go('qualifications', {id: id});
            };
            //代办资质跳转
            $scope.goToQualificationProcess = function (id) {
                $state.go('qualificationProcess', {id: id});
            };
            //证书培训
            $scope.goToTraining = function (id) {
                $state.go('certificateTraining', {id: id});
            };
            //资质流程
            $scope.goToEnterpriseService = function (id) {
                $state.go('enterpriseService', {id: id});
            };
            //关于我们
            $scope.goToAboutUs = function (id) {
                $state.go('aboutUs', {id: id});
            };
            //获取颜色
            $scope.selectedMenu = function (id) {
                $scope.selectedMenu_calss = id;
                // $scope.findMenu();
            };
            //资质动态首页
            $scope.goToCationList = function (id) {
                $state.go('dynamicsList', {id: id});
            };
            //首页
            $scope.goToHome = function () {
                $state.go('home');
            };
            $scope.findMenu = function () {
                $('.rm-nav').rMenu({
                    minWidth: '960px'
                });
                $(function () {
                    //页面加载
                    var $window = $(window),
                        $doc = $(document),
                        $body = $("body"),
                        winWidth = $window.width(),
                        docWidth = $doc.width(),
                        docHeight = $doc.height(),
                        winHeight = $window.height(),
                        headHeight = $("#head").height(),
                        $minute = $("#minute"),
                        $container = $("#container"),
                        minuteHeight = $minute.height(),
                        afterheadHeight = $("#logowraper").height() + $("#navwraper").height() + 30,
                        speed = 250;
                    //调用tips
                    fnTips(fnEach($("*[tips]")), speed);
                    //默认样式
                    navScroll(fnEach($("#navwraper")), fnEach($("#nav")), fnEach($("#navmenu")), "dd", "dt", speed, $scope.selectedMenu_calss);

                    function fnEach(Dom) {
                        if (Dom.length != 0) {
                            return Dom;
                        } else {
                            return $(null);
                        }
                    }

                    //tips
                    function fnTips(list, speed) {
                        if (list.length === 0) {
                            return false;
                        }
                        var tipsDom = "<div id='jcTips' style=\"display:none;\"><span></span><b></b><em></em></div>";
                        $body.append(tipsDom);
                        var $tips = $("#jcTips"),
                            $text = $tips.find("span");
                        list.css("cursor", "pointer")
                            .bind("mousemove", function (e) {
                                var _self = $(this),
                                    tipsText = _self.attr("tips"),
                                    X = e.pageX - 30,
                                    Y = e.pageY - 40;
                                $tips.css({"left": X, "top": Y}).find("span").text(tipsText).parents($tips).show();
                            }).bind("mouseleave", function () {
                            $tips.hide();
                        });
                        return false;
                    }

                    //导航
                    function navScroll(navwrap, Dom, Menu, list, curr, speed, defClass) {
                        var $list = Dom.find(list),
                            listLen = $list.length,
                            $menuList = Menu.find("dl"),
                            menuLen = $menuList.length;
                        i = 0;
                        arrListInfo = [];
                        bool = true;
                        currIdx = 0;
                        for (i = 0; i < listLen; i++) {
                            var othis = $list.eq(i),
                                sPath = othis.find("a").attr("href"),
                                sText = othis.text(),
                                nPosX = othis.position().left, z;
                            arrListInfo.push([sText, nPosX, sPath]);
                            if (othis.hasClass(defClass) && bool) {
                                Dom.append("<dt style=\"display:none;left:" + nPosX + "px;\"><a href=\"" + sPath + "\"><span>" + sText + "</span><em></em></a></dt>")
                                    .find(curr)
                                    .fadeIn(200);
                                bool = false;
                                currIdx = i;
                            }
                            for (z = 0; z < menuLen; z++) {
                                var omenu = $menuList.eq(z);
                                if (Number(omenu.attr("name")) == i) {
                                    omenu.css("left", nPosX)
                                        .find("dd:last a").css("background", "none");
                                }
                            }
                        }
                        setTimeout(function () {
                            $list.bind("mouseover", function () {
                                var index = $(this).index();
                                fnAnimate(Dom, arrListInfo, index, $menuList, true);
                                return false;
                            });
                            navwrap.bind("mouseleave", function () {
                                $menuList.fadeOut(speed);
                                fnAnimate(Dom, arrListInfo, currIdx, $menuList, false);
                                return false;
                            });
                        }, speed);

                        function fnMenuShow(d, y) {
                            if (y != -1) {
                                d.eq(y).fadeIn(speed).siblings().fadeOut(speed);
                            }
                            return false;
                        }

                        function fnAnimate(d, a, x, m, b) {
                            d.find(curr)
                                .stop()
                                .animate({
                                    "left": a[x][1]
                                }, speed, function () {
                                    $(this).find("a")
                                        .attr("href", a[x][2])
                                        .find("span")
                                        .text(a[x][0]);
                                    //.fadeIn(100);
                                    if (b) {
                                        m.fadeOut(speed);
                                        fnMenuShow(m, x - 1);
                                    }
                                })
                                .find("span")
                                .hide();
                            return false;
                        }

                        return false;
                    }
                });
            };
            var init = function () {
                $scope.selectedMenu_calss = 'curr';
                $scope.goToHome();//初始化首页
                $scope.findMenu();//菜单初始化
            };
            init();
        }]);
    app.registerFilter('isCollect', function () {
        return function (data, productInfo) {
            var type = productInfo.type || 'allProducts';

            if (type == 'collectProducts' && data && data.length > 0) {
                var _products = [];
                $.each(data, function (index, pro) {
                    if (pro.collnetStatus === 'Y') {
                        _products.push(pro);
                    }
                });
                return _products;
            }
            return data;
        }
    });
});
