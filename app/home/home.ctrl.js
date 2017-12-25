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
                window.open('http://wpa.qq.com/msgrd?v=3&uin=1016075562&site=qq&menu=yes','_brank');
            };
            //轮播图
            var carouselFigure =function () {
                $("#lazyload_3").slide({ trigger: "click", effect: "fade",auto: true,duration: 5, lazyload: true });
                $("pre.jsCode").snippet("javascript", {style: "custom_js", showNum: false});
                $("pre.jsCodeNum").snippet("javascript", {style: "custom_js"});
            };
            var init = function () {
                carouselFigure()//初始化加载轮播图




 //                $('.rm-nav').rMenu({
 //                    minWidth: '960px'
 //                });
 //                /*
 // * jQuery - jcContact v 2.0
 // * Copyright(c) 2012 by Adam’
 // * Date: 2012-08-29
 // * qq : 1741498
 // */
 //                (function ($) {
 //                    $.fn.jcContact = function (options) {
 //                        var defaults = {
 //                            speed: 200,                   //设置动画时间（mm）
 //                            scrollSpeed: 200,
 //                            position: 'center',           //外层框架垂直位置，提供"top","center","bottom"
 //                            posOffsetY: 0,              //微调设置外层框架垂直位置
 //                            btnPosition: 'top',      //按钮垂直位置，提供"top","center","bottom"
 //                            btnPosoffsetY: 0,          //微调设置按钮垂直位置
 //                            float: 'left',                //框架位置，提供"left","right"
 //                            Event: "mouseover",              //设置展开框架事件，提供"mouseover","lick"
 //                            defaultFun: function (wraper) {
 //                            }
 //                        };
 //                        var options = $.extend(defaults, options);
 //                        return this.each(function () {
 //                            $("body").css("overflow-x", "hidden");
 //                            var $this = $(this),
 //                                _self = this,
 //                                wrapTop = 0,
 //                                BtmTop = 0,
 //                                _width = 0,
 //                                $window = $(window),
 //                                winWidth = $window.width(),
 //                                winHeight = $window.height(),
 //                                $Con = $this.children(":eq(0)"),
 //                                nConWidth = $Con.width(),
 //                                nConHeight = $Con.height(),
 //                                $btn = $this.children(":eq(1)"),
 //                                nbtnWidth = $btn.width(),
 //                                nbtnHeight = $btn.height(),
 //                                //新建参数类
 //                                fnMode = function () {
 //                                    this.left = setWrapPos;
 //                                    this.right = setWrapPos;
 //                                    this.top = setWrapTop;
 //                                    this.center = setWrapTop;
 //                                    this.bottom = setWrapTop;
 //                                    this.btntop = setBtnTop;
 //                                    this.btncenter = setBtnTop;
 //                                    this.btnbottom = setBtnTop;
 //                                };
 //                            fnMode.prototype.Mode = function (mode, btnPos, wrapPos, winX) {
 //                                this[mode](mode, winX);
 //                                this[wrapPos](wrapPos);
 //                                this[btnPos](btnPos);
 //                            };
 //                            //初始化位置
 //                            options.defaultFun(_self);
 //                            var o = new fnMode,
 //                                speed = Math.round(options.speed * 0.5);
 //                            o.Mode(options.float, "btn" + options.btnPosition, options.position, winWidth);
 //                            //滚动事件
 //                            $window.scroll(function () {
 //                                var nScrollTop = $(this).scrollTop();
 //                                setAnimate(nScrollTop, setWrapTop);
 //                                return false;
 //                            }).resize(function () {
 //                                if (options.float === "right") {
 //                                    winWidth = $window.width();
 //                                    o.Mode(options.float, "btn" + options.btnPosition, options.position, winWidth);
 //                                    return false;
 //                                }
 //                            });
 //                            $btn.bind(options.Event, function (e) {
 //                                var obool = null;
 //                                if (options.float == "left") {
 //                                    _width = 0;
 //                                    obool = parseInt($this.css("left")) < _width;
 //                                } else if (options.float == "right") {
 //                                    _width = winWidth - nConWidth;
 //                                    obool = parseInt($this.css("left")) > _width;
 //                                }
 //                                if (obool) {
 //                                    $this.animate({"left": _width}, speed);
 //                                }
 //                            });
 //                            $this.bind("mouseleave", function () {
 //                                if (options.float == "left") {
 //                                    _width = -nConWidth;
 //                                } else if (options.float == "right") {
 //                                    _width = winWidth;
 //                                }
 //                                $this.animate({"left": _width}, speed);
 //                            });
 //
 //                            //功能方法
 //                            function setBtnTop(pos) {
 //                                var setPos;
 //                                if (pos == "btntop") {
 //                                    setPos = 0;
 //                                } else if (pos == "btncenter") {
 //                                    setPos = (nConHeight - nbtnHeight) / 2;
 //                                }
 //                                if (pos == "btnbottom") {
 //                                    setPos = nConHeight - nbtnHeight;
 //                                }
 //                                BtmTop = setPos + options.btnPosoffsetY;
 //                                $btn.css("top", BtmTop);
 //                                return false;
 //                            }
 //
 //                            function setWrapTop(pos) {
 //                                var _st, setVal;
 //                                if (pos == "top") {
 //                                    _st = $(window).scrollTop();
 //                                    setVal = 0;
 //                                } else if (pos == "center") {
 //                                    _st = $(window).scrollTop();
 //                                    setVal = (winHeight - nConHeight) / 2;
 //                                } else if (pos == "bottom") {
 //                                    _st = $(window).scrollTop();
 //                                    setVal = winHeight - nConHeight;
 //                                }
 //                                setWrapTop = setVal + options.posOffsetY;
 //                                setAnimate(_st, setWrapTop);
 //                                return false;
 //                            }
 //
 //                            function setWrapPos(sPos, winX) {
 //                                var wrapLeft, btnLeft;
 //                                if (sPos == "left") {
 //                                    wrapLeft = -nConWidth;
 //                                    btnLeft = nConWidth;
 //                                } else if (sPos == "right") {
 //                                    wrapLeft = winX;
 //                                    btnLeft = -nbtnWidth;
 //                                }
 //                                $btn.css("left", btnLeft);
 //                                $this.css("left", wrapLeft).show();
 //                                return false;
 //                            }
 //
 //                            function setAnimate(st, val) {
 //                                //$this.stop().animate({"top":val+st},options.speed);
 //                                $this.stop().animate({"top": val + st}, {
 //                                    duration: options.scrollSpeed,
 //                                    easing: "easeInOutQuart"
 //                                });
 //                                return false;
 //                            }
 //
 //                            return false;
 //                        });
 //                    };
 //                })(jQuery);
 //                $(function () {
 //                    //页面加载
 //                    var $window = $(window),
 //                        $doc = $(document),
 //                        $body = $("body"),
 //                        winWidth = $window.width(),
 //                        docWidth = $doc.width(),
 //                        docHeight = $doc.height(),
 //                        winHeight = $window.height(),
 //                        headHeight = $("#head").height(),
 //                        $minute = $("#minute"),
 //                        $container = $("#container"),
 //                        minuteHeight = $minute.height(),
 //                        afterheadHeight = $("#logowraper").height() + $("#navwraper").height() + 30,
 //                        speed = 250;
 //                    //判断对象
 //                    $container.animate({"top": headHeight}, speed * 1.5);
 //                    $minute.slideDown(speed * 1.5, function () {
 //                        $("div", $("#headBtn")).addClass("s").fadeIn(100, function () {
 //                            $("div", $("#headBtn")).click(function () {
 //                                var _self = $(this);
 //                                if (_self.hasClass("s")) {
 //                                    $minute.children().fadeOut(speed, function () {
 //                                        $minute.stop().animate({"height": 10}, speed, function () {
 //                                            _self.removeClass("s").addClass("h");
 //                                        });
 //                                    });
 //                                    $container.stop().animate({"top": afterheadHeight}, speed * 1.5);
 //                                } else {
 //                                    $minute.stop().animate({"height": minuteHeight}, speed, function () {
 //                                        $minute.children().fadeIn(speed);
 //                                        _self.removeClass("h").addClass("s");
 //                                    });
 //                                    $container.stop().animate({"top": headHeight}, speed * 1.5);
 //                                }
 //                                return false;
 //                            });
 //                        });
 //                    });
 //                    $(window).scroll(function () {
 //                        if ($(this).scrollTop() > 100) {
 //                            $minute.children().fadeOut(speed, function () {
 //                                $minute.stop().animate({"height": 10}, speed, function () {
 //                                    $("div", $("#headBtn")).removeClass("s").addClass("h");
 //                                });
 //                            });
 //                            $container.stop().animate({"top": afterheadHeight}, speed * 1.5);
 //                        } else if ($(this).scrollTop() < 100) {
 //                            $minute.stop().animate({"height": minuteHeight}, speed, function () {
 //                                $minute.children().fadeIn(speed)
 //                                $("div", $("#headBtn")).removeClass("h").addClass("s");
 //                            });
 //                            $container.stop().animate({"top": headHeight}, speed * 1.5);
 //                        }
 //                    });
 //                    //调用左边挂件
 //                    $("#anchor").jcContact({
 //                        defaultFun: function (wraper) {
 //                            $(wraper).find("a:last").css("background", "none");
 //                        },
 //                        position: 'center',
 //                        posOffsetY: 24,
 //                        scrollSpeed: 600
 //
 //                    });
 //                    $("#anchor2").jcContact({
 //                        float: 'right',
 //                        position: 'center',
 //                        posOffsetY: -20,
 //                        scrollSpeed: 450
 //                    });
 //                    //调用gotop
 //                    fnGoTop(fnEach($("#gotop")), 800);
 //                    //调用tips
 //                    fnTips(fnEach($("*[tips]")), speed);
 //                    navScroll(fnEach($("#navwraper")), fnEach($("#nav")), fnEach($("#navmenu")), "dd", "dt", speed, "curr");
 //
 //                    function fnEach(Dom) {
 //                        if (Dom.length != 0) {
 //                            return Dom;
 //                        } else {
 //                            return $(null);
 //                        }
 //                    }
 //
 //                    //返回顶部
 //                    function fnGoTop(Dom, s) {
 //                        $(window).scroll(function () {
 //                            if ($(this).scrollTop() > 400) {
 //                                Dom.fadeIn(s / 4);
 //                                Dom.click(function () {
 //                                    sfnSrollTop($("html,body"), s, "easeInOutQuart", 0);
 //                                    return false;
 //                                });
 //                            } else {
 //                                Dom.fadeOut(s / 4);
 //                            }
 //                        });
 //                        return false;
 //                    }
 //
 //                    //锚点
 //                    function fnGoFarme(o, eo, s) {
 //                        var i, eoLen = eo.length,
 //                            oePosArr = [];
 //                        for (i = 0; i < eoLen; i++) {
 //                            var curr = eo.eq(i);
 //                            oePosArr.push(curr.offset().top - 40);
 //                        }
 //                        o.click(function () {
 //                            var IDX = $(this).index();
 //                            $(this).addClass("curr").siblings().removeClass("curr");
 //                            sfnSrollTop($("html,body"), s, "easeInOutQuart", oePosArr[IDX]);
 //                        });
 //                    }
 //
 //                    //scrollTop
 //                    function sfnSrollTop(o, d, e, v) {
 //                        o.stop().animate({scrollTop: v}, {duration: d, easing: e});
 //                        return false;
 //                    }
 //
 //                    //tips
 //                    function fnTips(list, speed) {
 //                        if (list.length === 0) {
 //                            return false;
 //                        }
 //                        var tipsDom = "<div id='jcTips' style=\"display:none;\"><span></span><b></b><em></em></div>";
 //                        $body.append(tipsDom);
 //                        var $tips = $("#jcTips"),
 //                            $text = $tips.find("span");
 //                        list.css("cursor", "pointer")
 //                            .bind("mousemove", function (e) {
 //                                var _self = $(this),
 //                                    tipsText = _self.attr("tips"),
 //                                    X = e.pageX - 30,
 //                                    Y = e.pageY - 40;
 //                                $tips.css({"left": X, "top": Y}).find("span").text(tipsText).parents($tips).show();
 //                            }).bind("mouseleave", function () {
 //                            $tips.hide();
 //                        });
 //                        return false;
 //                    }
 //
 //                    //导航
 //                    function navScroll(navwrap, Dom, Menu, list, curr, speed, defClass) {
 //                        var $list = Dom.find(list),
 //                            listLen = $list.length,
 //                            $menuList = Menu.find("dl"),
 //                            menuLen = $menuList.length;
 //                        i = 0, arrListInfo = [],
 //                            bool = true,
 //                            currIdx = 0;
 //                        for (i = 0; i < listLen; i++) {
 //                            var othis = $list.eq(i),
 //                                sPath = othis.find("a").attr("href"),
 //                                sText = othis.text(),
 //                                nPosX = othis.position().left, z;
 //                            arrListInfo.push([sText, nPosX, sPath]);
 //                            if (othis.hasClass(defClass) && bool) {
 //                                Dom.append("<dt style=\"display:none;left:" + nPosX + "px;\"><a href=\"" + sPath + "\"><span>" + sText + "</span><em></em></a></dt>")
 //                                    .find(curr)
 //                                    .fadeIn(200);
 //                                bool = false;
 //                                currIdx = i;
 //                            }
 //                            ;
 //                            for (z = 0; z < menuLen; z++) {
 //                                var omenu = $menuList.eq(z);
 //                                if (Number(omenu.attr("name")) == i) {
 //                                    omenu.css("left", nPosX)
 //                                        .find("dd:last a").css("background", "none");
 //                                }
 //                                ;
 //                            }
 //                            ;
 //                        }
 //                        ;
 //                        setTimeout(function () {
 //                            $list.bind("mouseover", function () {
 //                                var index = $(this).index();
 //                                fnAnimate(Dom, arrListInfo, index, $menuList, true);
 //                                return false;
 //                            });
 //                            navwrap.bind("mouseleave", function () {
 //                                $menuList.fadeOut(speed);
 //                                fnAnimate(Dom, arrListInfo, currIdx, $menuList, false);
 //                                return false;
 //                            });
 //                        }, speed);
 //
 //                        function fnMenuShow(d, y) {
 //                            if (y != -1) {
 //                                d.eq(y).fadeIn(speed).siblings().fadeOut(speed);
 //                            }
 //                            ;
 //                            return false;
 //                        };
 //
 //                        function fnAnimate(d, a, x, m, b) {
 //                            d.find(curr)
 //                                .stop()
 //                                .animate({
 //                                    "left": a[x][1]
 //                                }, speed, function () {
 //                                    $(this).find("a")
 //                                        .attr("href", a[x][2])
 //                                        .find("span")
 //                                        .text(a[x][0])
 //                                    //.fadeIn(100);
 //                                    if (b) {
 //                                        m.fadeOut(speed);
 //                                        fnMenuShow(m, x - 1);
 //                                    }
 //                                    ;
 //                                })
 //                                .find("span")
 //                                .hide();
 //                            return false;
 //                        };
 //                        return false;
 //                    };
 //                });
 //
 //                function CompleteScroll(flag) {
 //                    if (flag == 0) {
 //                        $("html,body").animate({scrollTop: 0}, "slow");
 //                    } else {
 //                        var s = $("body").height() - $(window).height();
 //                        $("html,body").animate({scrollTop: s + 60}, "slow");
 //                    }
 //                }
 //
 //                function ShowMsg(type, msg, url) {
 //                    var tipHtml = '';
 //                    if (type == 'loading') {
 //                        tipHtml = '<img alt="" src="images/loading6.gif">' + (msg ? msg : '正在提交您的请求，请稍候...');
 //                    } else if (type == 'notice') {
 //                        tipHtml = '<span class="gtl_ico_hits"></span>' + msg
 //                    } else if (type == 'error') {
 //                        tipHtml = '<span class="gtl_ico_fail"></span>' + msg
 //                    } else if (type == 'succ') {
 //                        tipHtml = '<span class="gtl_ico_succ"></span>' + msg
 //                    }
 //                    if ($('.msgbox_layer_wrap')) {
 //                        $('.msgbox_layer_wrap').remove();
 //                    }
 //                    if (st) {
 //                        clearTimeout(st);
 //                    }
 //                    $("body").prepend("<div class='msgbox_layer_wrap'><span id='mode_tips_v2' style='z-index: 10000;' class='msgbox_layer'><span class='gtl_ico_clear'></span>" + tipHtml + "<span class='gtl_end'></span></span></div>");
 //                    $(".msgbox_layer_wrap").show();
 //                    var st = setTimeout(function () {
 //                        $(".msgbox_layer_wrap").hide();
 //                        clearTimeout(st);
 //                        if (url != "")
 //                            location.href = url;
 //                    }, 2000);
 //                }
            };

            init();
        }]);

});