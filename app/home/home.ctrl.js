define([
    'app',
    'config',
    'constants',
    'layer'
], function (app, config, constants, layer) {
    app.registerController('homeCtrl', ['$scope', '$state', '$rootScope', 'localStorageService', '$$neptune', '$timeout',
        function ($scope, $state, $rootScope, localStorageService, $$neptune, $timeout) {
            //打开qq聊天
            $scope.qqChat = function () {
                window.open('http://wpa.qq.com/msgrd?v=3&uin=1016075562&site=qq&menu=yes', '_brank');
            };
            //轮播图
            var carouselFigure = function () {
                $("#lazyload_3").slide({trigger: "click", effect: "fade", auto: true, duration: 5, lazyload: true});
                $("pre.jsCode").snippet("javascript", {style: "custom_js", showNum: false});
                $("pre.jsCodeNum").snippet("javascript", {style: "custom_js"});
            };
            $scope.nihao = function (id) {
                console.log(id);
                $scope.nihao_calss = id;
            };
            var init = function () {
                carouselFigure();//初始化加载轮播图

                $scope.nihao_calss = 'curr_1';
                //菜单栏
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
                    navScroll(fnEach($("#navwraper")), fnEach($("#nav")), fnEach($("#navmenu")), "dd", "dt", speed, $scope.nihao_calss);

                    function fnEach(Dom) {
                        if (Dom.length != 0) {
                            return Dom;
                        } else {
                            return $(null);
                        }
                    }

                    //返回顶部
                    // function fnGoTop(Dom, s) {
                    //     $(window).scroll(function () {
                    //         if ($(this).scrollTop() > 400) {
                    //             Dom.fadeIn(s / 4);
                    //             Dom.click(function () {
                    //                 sfnSrollTop($("html,body"), s, "easeInOutQuart", 0);
                    //                 return false;
                    //             });
                    //         } else {
                    //             Dom.fadeOut(s / 4);
                    //         }
                    //     });
                    //     return false;
                    // }

                    // //锚点
                    // function fnGoFarme(o, eo, s) {
                    //     var i, eoLen = eo.length,
                    //         oePosArr = [];
                    //     for (i = 0; i < eoLen; i++) {
                    //         debugger;
                    //         var curr = eo.eq(i);
                    //         oePosArr.push(curr.offset().top - 40);
                    //     }
                    //     o.click(function () {
                    //         var IDX = $(this).index();
                    //         $(this).addClass("curr").siblings().removeClass("curr");
                    //         sfnSrollTop($("html,body"), s, "easeInOutQuart", oePosArr[IDX]);
                    //     });
                    // }

                    //scrollTop
                    // function sfnSrollTop(o, d, e, v) {
                    //     o.stop().animate({scrollTop: v}, {duration: d, easing: e});
                    //     return false;
                    // }

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
                                console.log(defClass);
                                Dom.append("<dt style=\"display:none;left:" + nPosX + "px;\"><a href=\"" + sPath + "\"><span>" + sText + "</span><em></em></a></dt>")
                                    .find(curr)
                                    .fadeIn(200);
                                bool = false;
                                currIdx = i;
                            }
                            for (z = 0; z < menuLen; z++) {
                                var omenu = $menuList.eq(z);
                                if (Number(omenu.attr("name")) == i) {
                                    console.log(omenu.attr("name"));
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

            init();
        }]);

});