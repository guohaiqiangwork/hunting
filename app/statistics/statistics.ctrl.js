define([
    'app',
    'config',
    'constants',
    'jedate',
    'echarts'
], function (app, config, constants, jedate, echarts) {
    app.registerController('statisticsCtrl', ['$scope', '$modal', '$state', '$$neptune',
        function ($scope, $modal, $state, $$neptune) {
            $scope.searchKeywords = {
                dateTime: '2017'//图表年份
            };
            /**
             * 订单、保单页面切换
             * @type {boolean}
             */
            $scope.isSwitch = 1;
            $scope.doSwitch = function (id) {
                searchInit();
                $scope.isSwitch = id;
                $scope.pagination.pageIndex = 1;
                $scope.searchOrders();
                //  排行界面，开始初始化
                if ($scope.isSwitch === 3) {
                    // 打开综合排名
                    if ($rootScope.user.role_id !== '1' && $rootScope.user.role_id !== '2') {
                        $scope.openTable('complex');
                    } else if ($rootScope.user.role_id !== '1') { // 打开组织排名
                        $scope.openTable('organization');
                    } else if ($rootScope.user.role_id === '1') { // 打开个人排名
                        $scope.openTable('personal');
                    } else if ($rootScope.user.role_id !== '1') { // 打开组织产品排名
                        $scope.openTable('product');
                    }
                }
            };

            /**
             * 年份
             * @param ele
             */
            $scope.setYearDate = function (ele) {
                jedate({
                    dateCell: '#' + ele,
                    format: "YYYY",
                    insTrigger: false,
                    isClear: true,                         //是否显示清空
                    isToday: false,
                    minDate: "2017", //0代表今天，-1代表昨天，-2代表前天，以此类推
                    maxDate: "",
                    okfun: function (elem, val, date) {
                        $scope.searchKeywords[ele] = val;
                    }
                    ,
                    choosefun: function (elem, val) {
                        $scope.searchKeywords[ele] = val;
                    }
                    ,
                    clearfun: function (elem, val) {
                        $scope.searchKeywords[ele] = '';
                    }
                })
                ;
            };
            /**
             * 获取销售人员占比
             * @param type
             */
            $scope.getRanking = function () {
                var myDate = new Date();
                var maxNewY = myDate.getFullYear();
                if ($scope.searchKeywords.dateTime == "") {
                    layer.msg("请选择查询的日期", {time: '3000'});
                    return
                }
                if ($scope.searchKeywords.dateTime > maxNewY) {
                    layer.msg("所选时间暂时没有数据", {time: '3000'});
                    return
                }

                $$neptune.$user.getRanking($scope.searchKeywords.dateTime, {
                    onSuccess: function (data) {
                        $scope.getRankingList = [];
                        $scope.histogramName = [];
                        $scope.histogramValue = [];
                        $scope.Ranking = 0;
                        for (var k in data.data) {
                            $scope.getRankingList.push({name: k, value: data.data[k]});//饼状图数据
                        }

                        /**
                         * 排序
                         * @param propertyName
                         * @returns {Function}
                         */
                        function compare(propertyName) {
                            return function (object1, object2) {
                                var value1 = object1[propertyName];
                                var value2 = object2[propertyName];
                                if (value2 < value1) {
                                    return -1;
                                } else if (value2 > value1) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            }
                        }

                        // //使用方法
                        $scope.getRankingList.sort(compare("value"));
                        for (var k in $scope.getRankingList) {
                            if (!isNaN(parseInt(k))) {
                                $scope.histogramName.push($scope.getRankingList[k].name);//柱状图x轴数据
                                $scope.histogramValue.push($scope.getRankingList[k].value);//柱状图显示数据
                            }

                        }
                        $scope.YNumberH = Math.ceil($scope.histogramValue[0]);

                        //总数显示
                        $.each($scope.histogramValue, function (index) {
                            $scope.Ranking = $scope.Ranking + parseFloat($scope.histogramValue[index]);
                        });
                        salesProportion();//绘制图表
                        getRankingMoney();//获取销售金额
                        getRankingFirstTen();//绘制排名前十
                        getRankingEndTen();//绘制排名后十
                    },
                    onError: function (e) {
                    }
                });
            };

            /**
             * 销售金额数据获取
             */
            function getRankingMoney() {
                $$neptune.$user.getRankingMoney($scope.searchKeywords.dateTime, {
                    onSuccess: function (data) {
                        $scope.getRankingMoneyList = [];
                        $scope.getRankingMoneyLists = [];
                        $scope.histogramMoneyName = [];
                        $scope.histogramMoneyValue = [];
                        $scope.stemp = 0;
                        for (var k in data) {
                            $scope.getRankingMoneyList.push({name: k, value: data[k] * 100 / 1000000});//饼状图数据
                        }
                        for (var k in $scope.getRankingMoneyList) {
                            if (!isNaN(parseInt(k))) {
                                var a = Number($scope.getRankingMoneyList[k].value).toFixed(2);
                                $scope.getRankingMoneyLists.push({name: $scope.getRankingMoneyList[k].name, value: a})
                            }
                        }

                        /**
                         * 排序
                         * @param propertyName
                         * @returns {Function}
                         */
                        function compare(propertyName) {
                            return function (object1, object2) {
                                var value1 = object1[propertyName];
                                var value2 = object2[propertyName];
                                if (value2 < value1) {
                                    return -1;
                                } else if (value2 > value1) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            }
                        }

                        //使用方法
                        $scope.getRankingMoneyList.sort(compare("value"));
                        for (var k in $scope.getRankingMoneyList) {
                            if (!isNaN(parseInt(k))) {
                                var histogramMoneyValue = Number($scope.getRankingMoneyList[k].value);
                                $scope.histogramMoneyName.push($scope.getRankingMoneyList[k].name);//柱状图x轴数据
                                $scope.histogramMoneyValue.push(angular.copy(histogramMoneyValue).toFixed(2));//柱状图显示数据
                                //总数显示
                                $scope.stemp = $scope.stemp + parseFloat(histogramMoneyValue);
                            }
                        }
                        // 小数点后2位进行四舍五入
                        $scope.stemp = (Math.round($scope.stemp.toFixed(3)*1000)/1000).toFixed(2);

                        $scope.YNumberZ = Math.ceil($scope.histogramMoneyValue[0]);

                        salesProportionMoney();//绘制图表
                    },
                    onError: function (e) {
                    }
                });
            }

            /**
             * 获取销售前十排名
             */
            function getRankingFirstTen() {
                $$neptune.$user.getRankingFirstTen($scope.searchKeywords.dateTime, {
                    onSuccess: function (data) {
                        $scope.histogramFirstName = [];
                        $scope.histogramFirstValue = [];
                        for (var k in data) {
                            if (!isNaN(parseInt(k))) {
                                $scope.histogramFirstName.push(data[k].comname);//柱状图x轴数据
                                // $scope.histogramFirstValue.push(Number((data[k].money / 10000).toString().match(/^\d+(?:\.\d{0,4})?/)));//柱状图显示数据}
                                $scope.histogramFirstValue.push(Number((data[k].money / 10000)).toFixed(2));//柱状图显示数据}


                            }
                        }
                        $scope.YNumberF = Math.ceil($scope.histogramFirstValue[0]);
                        selesRanking();//绘制图表
                    },
                    onError: function (e) {
                    }
                });
            }

            /**
             * 获取排名后十位
             */
            function getRankingEndTen() {
                $$neptune.$user.getRankingEndTen($scope.searchKeywords.dateTime, {
                    onSuccess: function (data) {
                        $scope.histogramEndName = [];
                        $scope.histogramEndValue = [];
                        for (var k in data) {
                            if (!isNaN(parseInt(k))) {
                                $scope.histogramEndName.push(data[k].comname);//柱状图x轴数据
                                // $scope.histogramEndValue.push(data[k].money * 100 / 1000000);//柱状图显示数据
                                $scope.histogramEndValue.push(Number(data[k].money / 10000).toFixed(2));
                            }
                        }
                        $scope.YNumberE = Math.ceil($scope.histogramEndValue[$scope.histogramEndValue.length - 1]);
                        selesEndRanking();//绘制图表
                    },
                    onError: function (e) {
                    }
                });
            }

            var init = function () {
                $scope.getRanking()//获取数据
            };

            init();

            /**
             * 区域销售人员
             */
            function salesProportion() {
                var myChart = echarts.init(document.getElementById('main3'));
                options = {
                    title: {
                        text: '保险销售人员各区域占比',
                        subtext: '',
                        x: 'center',
                        padding: [20, 10, 5, 10]
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {d}%  ({c})"
                    },
                    // legend: {
                    //     data: $scope.getRankingList
                    //
                    // },
                    series: [
                        {
                            name: '销售占比',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: $scope.getRankingList,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                myChart.setOption(options);      // 使用刚指定的配置项和数据显示图表。
                var myChart = echarts.init(document.getElementById('main1'));
                var option = {
                    title: {
                        text: '区域员工数量',
                        subtext: '',
                        x: 'center',
                        padding: [20, 10, 5, 10]
                    },
                    tooltip: {//鼠标放上显示效果
                        show: 'true'
                    },
                    // toolbox: { //可视化的工具箱
                    //     show: true,
                    //     right: '50',//设置显示文字
                    //     feature: {
                    //         magicType: {//动态类型切换
                    //             type: ['bar', 'line']
                    //         }
                    //     }
                    // },
                    xAxis: {
                        data: $scope.histogramName,
                        name: '',//x轴名字
                        axisLabel: {//X轴数据展示文字角度
                            interval: 0,//横轴信息全部显示
                            rotate: -30,//-30度角倾斜显示

                            formatter: function (value) {
                                var ret = "";//拼接加\n返回的类目项
                                var maxLength = 2;//每项显示文字个数
                                var valLength = value.length;//X轴类目项的文字个数
                                var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                                if (rowN > 3)//如果类目项的文字大于3,
                                {
                                    for (var i = 0; i < rowN; i++) {
                                        var temp = "";//每次截取的字符串
                                        var start = i * maxLength;//开始截取的位置
                                        var end = start + maxLength;//结束截取的位置
                                        temp = value.substring(start, end) + "\n";
                                        ret += temp; //凭借最终的字符串
                                    }
                                    return ret;
                                }
                                else {
                                    return value;
                                }
                            }
                        }
                    },
                    yAxis: {
                        max: $scope.YNumberH,//y轴设置
                        name: '人'
                    },
                    series: [
                        {
                            name: '销量',
                            type: 'bar',
                            barWidth: 30,//柱图宽度
                            itemStyle: {//柱状图颜色设置
                                normal: {
                                    color: '#4ad2ff'
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                    // fontSize: 8,
                                    // rotate: 45
                                }
                            },
                            data: $scope.histogramValue
                        }
                    ]

                };
                myChart.setOption(option); // 使用刚指定的配置项和数据显示图表。
            }

            /**
             * 区域销售金额
             */
            function salesProportionMoney() {
                var myChart = echarts.init(document.getElementById('main10'));
                options = {
                    title: {
                        text: '保险销售额各区域占比',
                        subtext: '',
                        x: 'center',
                        padding: [20, 10, 5, 10]
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {d}%  ({c}万)"
                    },
                    // legend: {
                    //     data: $scope.getRankingList
                    //
                    // },
                    series: [
                        {
                            name: '销售占比',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: $scope.getRankingMoneyLists,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                    // ,color: ['rgb(254,67,101)','rgb(252,157,154)','rgb(249,205,173)','rgb(200,200,169)','rgb(131,175,155)']
                };
                myChart.setOption(options);      // 使用刚指定的配置项和数据显示图表。
                var myChart = echarts.init(document.getElementById('main20'));
                var option = {
                    title: {
                        text: '区域销售额',
                        subtext: '',
                        x: 'center',
                        padding: [20, 10, 5, 10]
                    },
                    tooltip: {//鼠标放上显示效果
                        show: 'true'
                    },
                    xAxis: {
                        data: $scope.histogramMoneyName,
                        name: '',//x轴名字
                        axisLabel: {//X轴数据展示文字角度
                            interval: 0,//横轴信息全部显示
                            rotate: -30,//-30度角倾斜显示

                            formatter: function (value) {
                                var ret = "";//拼接加\n返回的类目项
                                var maxLength = 2;//每项显示文字个数
                                var valLength = value.length;//X轴类目项的文字个数
                                var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                                if (rowN > 3)//如果类目项的文字大于3,
                                {
                                    for (var i = 0; i < rowN; i++) {
                                        var temp = "";//每次截取的字符串
                                        var start = i * maxLength;//开始截取的位置
                                        var end = start + maxLength;//结束截取的位置
                                        temp = value.substring(start, end) + "\n";
                                        ret += temp; //凭借最终的字符串
                                    }
                                    return ret;
                                }
                                else {
                                    return value;
                                }
                            }
                        }
                    },
                    yAxis: {
                        max: $scope.YNumberZ,//y轴设置
                        name: '万'//y轴名字
                    },
                    series: [
                        {
                            name: '销量',
                            type: 'bar',
                            barWidth: 30,//柱图宽度
                            itemStyle: {//柱状图颜色设置
                                normal: {
                                    color: '#4ad2ff'
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                    // fontSize: 8
                                }
                            },
                            data: $scope.histogramMoneyValue
                        }
                    ]

                };
                myChart.setOption(option); // 使用刚指定的配置项和数据显示图表。
            }

            /**
             * 销售排名
             */
            function selesRanking() {
                var myChart = echarts.init(document.getElementById('main30'));
                var option = {
                    title: {
                        text: '销售前十排名',
                        subtext: '',
                        x: 'center',
                        padding: [20, 10, 5, 10]
                    },
                    tooltip: {//鼠标放上显示效果
                        show: 'true'
                    },
                    // toolbox: { //可视化的工具箱
                    //     show: true,
                    //     right: '50',//设置显示文字
                    //     feature: {
                    //         magicType: {//动态类型切换
                    //             type: ['bar', 'line']
                    //         }
                    //     }
                    // },
                    xAxis: {
                        data: $scope.histogramFirstName,
                        name: '',//x轴名字
                        axisLabel: {//X轴数据展示文字角度
                            interval: 0,//横轴信息全部显示
                            rotate: -20//-30度角倾斜显示

                            // formatter: function (value) {
                            //     var ret = "";//拼接加\n返回的类目项
                            //     var maxLength = 2;//每项显示文字个数
                            //     var valLength = value.length;//X轴类目项的文字个数
                            //     var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                            //     if (rowN > 3)//如果类目项的文字大于3,
                            //     {
                            //         for (var i = 0; i < rowN; i++) {
                            //             var temp = "";//每次截取的字符串
                            //             var start = i * maxLength;//开始截取的位置
                            //             var end = start + maxLength;//结束截取的位置
                            //             temp = value.substring(start, end) + "\n";
                            //             ret += temp; //凭借最终的字符串
                            //         }
                            //         return ret;
                            //     }
                            //     else {
                            //         return value;
                            //     }
                            // }
                        }
                    },
                    yAxis: {
                        max: $scope.YNumberF,//y轴设置
                        name: '万'//y轴名字
                    },
                    series: [
                        {
                            name: '销量',
                            type: 'bar',
                            barWidth: 30,//柱图宽度
                            itemStyle: {//柱状图颜色设置
                                normal: {
                                    color: '#4ad2ff'
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                    // fontSize: 8
                                }
                            },
                            data: $scope.histogramFirstValue
                        }
                    ]

                };
                myChart.setOption(option); // 使用刚指定的配置项和数据显示图表。
            }

            /**
             * 销售排名后十
             */

            function selesEndRanking() {
                var myChart = echarts.init(document.getElementById('main40'));
                var option = {
                    title: {
                        text: '销售后十排名',
                        subtext: '',
                        x: 'center',
                        padding: [20, 10, 5, 10]
                    },
                    tooltip: {//鼠标放上显示效果
                        show: 'true'
                    },
                    // toolbox: { //可视化的工具箱
                    //     show: true,
                    //     right: '50',//设置显示文字
                    //     feature: {
                    //         magicType: {//动态类型切换
                    //             type: ['bar', 'line']
                    //         }
                    //     }
                    // },
                    xAxis: {
                        data: $scope.histogramEndName,
                        name: '',//x轴名字
                        axisLabel: {//X轴数据展示文字角度
                            interval: 0,//横轴信息全部显示
                            rotate: -20//-30度角倾斜显示

                            // formatter: function (value) {
                            //     var ret = "";//拼接加\n返回的类目项
                            //     var maxLength = 2;//每项显示文字个数
                            //     var valLength = value.length;//X轴类目项的文字个数
                            //     var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                            //     if (rowN > 3)//如果类目项的文字大于3,
                            //     {
                            //         for (var i = 0; i < rowN; i++) {
                            //             var temp = "";//每次截取的字符串
                            //             var start = i * maxLength;//开始截取的位置
                            //             var end = start + maxLength;//结束截取的位置
                            //             temp = value.substring(start, end) + "\n";
                            //             ret += temp; //凭借最终的字符串
                            //         }
                            //         return ret;
                            //     }
                            //     else {
                            //         return value;
                            //     }
                            // }
                        }
                    },
                    yAxis: {
                        max: $scope.YNumberE,//y轴设置
                        name: '万'//y轴名字
                    },
                    series: [
                        {
                            name: '销量',
                            type: 'bar',
                            barWidth: 30,//柱图宽度
                            itemStyle: {//柱状图颜色设置
                                normal: {
                                    color: '#4ad2ff'
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                    // fontSize: 8
                                }
                            },
                            data: $scope.histogramEndValue
                        }
                    ]

                };
                myChart.setOption(option); // 使用刚指定的配置项和数据显示图表。
            }


        }])
    ;

});