/**
 * DESC       : 阳光api-工具类
 * AUTHOR     : 阳光项目组
 * CREATEDATE : 2016-10-28
 * MODIFYLIST : Name           Date           Reason/Contents
 * --------------------------------------------------------
 *              yanglei       2016-10-28     api规划
 */
define([
    'angular'
], function (angular) {

    if (!window.console) {
        window.console = {
            log: function () {
            }
        }
    }

    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }
            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {
                },
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };
            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();
            return fBound;
        };
    }

    //日期格式转换
    Date.prototype.getTargetDate = function (oF, oM, oD) {
        var _date = new Date(this);
        _date.setFullYear(_date.getFullYear() + oF);
        _date.setMonth(_date.getMonth() + oM);
        _date.setDate(_date.getDate() + oD);
        return _date;
    };

    //日期格式转化
    Date.prototype.dateConversionTime = function () {
        return this.getFullYear() + '-' + ( (this.getMonth() + 1) < 10 ? 0 : '') + (this.getMonth() + 1) + '-' +
            (this.getDate() < 10 ? 0 : '') + this.getDate() + " " + this.getHours() + ":" + this.getMinutes() + ":" + (this.getSeconds() < 10 ? 0 : "")+ this.getSeconds();
    };

    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    // 增加年月日
    Date.prototype.getTargetDate = function (oF, oM, oD) {
        var _date = new Date(this);
        _date.setFullYear(_date.getFullYear() + oF);
        _date.setMonth(_date.getMonth() + oM);
        _date.setDate(_date.getDate() + oD);
        return _date;
    };

    angular.module('mc.util', [])
        .factory('$$util', [function () {

            function Base64() {
                // private property
                var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                // public method for encoding
                this.encode = function (input) {
                    var output = "";
                    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                    var i = 0;
                    input = _utf8_encode(input);
                    while (i < input.length) {
                        chr1 = input.charCodeAt(i++);
                        chr2 = input.charCodeAt(i++);
                        chr3 = input.charCodeAt(i++);
                        enc1 = chr1 >> 2;
                        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                        enc4 = chr3 & 63;
                        if (isNaN(chr2)) {
                            enc3 = enc4 = 64;
                        } else if (isNaN(chr3)) {
                            enc4 = 64;
                        }
                        output = output +
                            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
                    }
                    return output;
                };

                // public method for decoding
                this.decode = function (input) {
                    var output = "";
                    var chr1, chr2, chr3;
                    var enc1, enc2, enc3, enc4;
                    var i = 0;
                    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                    while (i < input.length) {
                        enc1 = _keyStr.indexOf(input.charAt(i++));
                        enc2 = _keyStr.indexOf(input.charAt(i++));
                        enc3 = _keyStr.indexOf(input.charAt(i++));
                        enc4 = _keyStr.indexOf(input.charAt(i++));
                        chr1 = (enc1 << 2) | (enc2 >> 4);
                        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                        chr3 = ((enc3 & 3) << 6) | enc4;
                        output = output + String.fromCharCode(chr1);
                        if (enc3 != 64) {
                            output = output + String.fromCharCode(chr2);
                        }
                        if (enc4 != 64) {
                            output = output + String.fromCharCode(chr3);
                        }
                    }
                    output = _utf8_decode(output);
                    return output;
                };

                // private method for UTF-8 encoding
                _utf8_encode = function (string) {
                    string = string.replace(/\r\n/g, "\n");
                    var utftext = "";
                    for (var n = 0; n < string.length; n++) {
                        var c = string.charCodeAt(n);
                        if (c < 128) {
                            utftext += String.fromCharCode(c);
                        } else if ((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                            utftext += String.fromCharCode((c & 63) | 128);
                        } else {
                            utftext += String.fromCharCode((c >> 12) | 224);
                            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }

                    }
                    return utftext;
                }

                // private method for UTF-8 decoding
                _utf8_decode = function (utftext) {
                    var string = "";
                    var i = 0;
                    var c = c1 = c2 = 0;
                    while (i < utftext.length) {
                        c = utftext.charCodeAt(i);
                        if (c < 128) {
                            string += String.fromCharCode(c);
                            i++;
                        } else if ((c > 191) && (c < 224)) {
                            c2 = utftext.charCodeAt(i + 1);
                            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                            i += 2;
                        } else {
                            c2 = utftext.charCodeAt(i + 1);
                            c3 = utftext.charCodeAt(i + 2);
                            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                            i += 3;
                        }
                    }
                    return string;
                }
            }

            var timestampGap;  //本地和服务器时间的差异

            var globals;        //全局变量

            /**
             * 验证字符串日期格式
             * @param _date 日期
             * @param isTime true带时间 false不带时间
             * @returns {boolean}
             */
            var verifyDate = function (_date, isTime) {

                var DATE_VALID1 = /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30))|(02-(0[1-9]|1[0-9]|2[0-8])))$/;
                var DATE_VALID2 = /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30))|(02-(0[1-9]|1[0-9]|2[0-9])))$/;

                var validationData = function (regex, data) {
                    return regex.test(data) ? true : false;
                };

                var result = false;
                var date = _date.replace(/-|\s|:/g, '');
                date = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8);
                if (date.substring(0, 4) % 4 == 0) {
                    result = validationData(DATE_VALID2, date);
                } else {
                    result = validationData(DATE_VALID1, date);
                }
                return result;
            };

            /**
             * 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
             * @param cardCode
             * @returns {boolean}
             */
            // if(!(/(^\d{15}$)|(^\d{17}(\d|X)$)/.test(cardCode))){
            //     return false;
            // }
            // return true;
            function checkCardCode(cardCode) {
                if (!cardCode) return false;
                cardCode = cardCode.toUpperCase();           //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
                if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(cardCode))) {
                    //alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
                    return false;
                }
                //验证前2位，城市符合
                var aCity = {
                    11: "北京",
                    12: "天津",
                    13: "河北",
                    14: "山西",
                    15: "内蒙古",
                    21: "辽宁",
                    22: "吉林",
                    23: "黑龙江 ",
                    31: "上海",
                    32: "江苏",
                    33: "浙江",
                    34: "安徽",
                    35: "福建",
                    36: "江西",
                    37: "山东",
                    41: "河南",
                    42: "湖北",
                    43: "湖南",
                    44: "广东",
                    45: "广西",
                    46: "海南",
                    50: "重庆",
                    51: "四川",
                    52: "贵州",
                    53: "云南",
                    54: "西藏",
                    61: "陕西",
                    62: "甘肃",
                    63: "青海",
                    64: "宁夏",
                    65: "新疆",
                    71: "台湾",
                    81: "香港",
                    82: "澳门",
                    91: "国外"
                };
                if (aCity[parseInt(cardCode.substr(0, 2))] == null) {
                    return false;
                }
                //alert('城市:'+aCity[parseInt(num.substr(0,2))]);

                //下面分别分析出生日期和校验位
                var len, re;
                len = cardCode.length;
                if (len == 15) {
                    re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
                    var arrSplit = cardCode.match(re);  //检查生日日期是否正确
                    var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
                    var bGoodDay;
                    bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                    if (!bGoodDay) {
                        return false;
                    } else { //将15位身份证转成18位 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                        var nTemp = 0, i;
                        cardCode = cardCode.substr(0, 6) + '19' + cardCode.substr(6, cardCode.length - 6);
                        for (i = 0; i < 17; i++) {
                            nTemp += cardCode.substr(i, 1) * arrInt[i];
                        }
                        cardCode += arrCh[nTemp % 11];
                        return true;
                    }
                }
                if (len == 18) {
                    re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                    var arrSplit = cardCode.match(re);  //检查生日日期是否正确
                    var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
                    var bGoodDay;
                    bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
                    if (!bGoodDay) {
                        //alert(dtmBirth.getYear());
                        //alert(arrSplit[2]);
                        return false;
                    }
                    else { //检验18位身份证的校验码是否正确。 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                        var valnum;
                        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                        var nTemp = 0, i;
                        for (i = 0; i < 17; i++) {
                            nTemp += cardCode.substr(i, 1) * arrInt[i];
                        }
                        valnum = arrCh[nTemp % 11];
                        if (valnum != cardCode.substr(17, 1)) {
                            //alert('18位身份证的校验码不正确！应该为：' + valnum);
                            return false;
                        }
                        return true;
                    }
                }
                return false;
            }

            return {

                Base64: new Base64(),

                //文件上传方法
                fileUpload: function (fileData, options) {

                },

                /**
                 * 计算日期之间的差值
                 * @param beginTime
                 * @param endTime
                 * @param timeType day－天 sec－秒
                 */
                dateDiff: function (beginTime, endTime, timeType) {
                    var _time = '';//返回值

                    //确保日期非空／未定义
                    if (beginTime && endTime) {

                        beginTime = angular.isDate(beginTime) ? beginTime : verifyDate(beginTime, true) ? beginTime.dateStringConversion() : "";
                        endTime = angular.isDate(endTime) ? endTime : verifyDate(endTime, true) ? endTime.dateStringConversion() : "";
                        //不符合日期格式
                        if (beginTime == '' || endTime == '')
                            return false;

                        var newTime = Math.abs(endTime.getTime() - beginTime.getTime());//计算时间差毫秒
                        if (timeType == 'day') {
                            _time = Math.ceil(newTime / (24 * 3600 * 1000)) + 1;//计算相差天数
                        } else if (timeType == 'sec') {
                            _time = Math.ceil(newTime / 1000);//计算相差秒
                        }
                    } else {
                        return false;
                    }

                    return _time;
                },

                //设置服务器和本地时间戳的差异
                setTimestampGap: function (serverTimestamp) {
                    // console.log('设置服务器时间');
                    timestampGap = serverTimestamp.dateStringConversionTime().getTime() - Date.now();
                    return timestampGap;
                },

                //获取服务器时间
                getServerTimestamp: function () {
                    var newDate = new Date(Date.now() + timestampGap);
                    return newDate;
                },

                //设置全局变量
                setGlobals: function (_globals) {
                    // console.log('设置全局变量');
                    globals = _globals;
                },

                //获取指定全局变量
                getGlobal: function (key) {
                    return globals[key];
                },
                /**
                 * 根据身份证获取出生日期
                 * @returns {*}
                 */
                getBirthdayByCardCode: function (cardCode) {
                    if (cardCode.length === 15) {
                        var birthday = "19" + cardCode.substring(6, 8) + "-" + cardCode.substring(8, 10) + "-" +
                            cardCode.substring(10, 12);
                        return birthday;
                    }

                    if (cardCode.length === 18) {
                        var birthday = cardCode.substring(6, 10) + "-" + cardCode.substring(10, 12) + "-" +
                            cardCode.substring(12, 14);
                        return birthday;
                    }
                    return false;
                },
                /**
                 * 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
                 * @param cardCode
                 * @returns {boolean}
                 */
                checkCardCode: function (cardCode) {
                    return checkCardCode(cardCode)
                },
                /**
                 * 判断浏览器
                 * @returns {*}
                 */
                myBrowser: function () {
                    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
                    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
                    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
                    var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
                    var isSafari = userAgent.indexOf("Safari") > -1; //判断是否Safari浏览器
                    if (isIE) {
                        var IE5 = IE55 = IE6 = IE7 = IE8 = false;
                        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                        reIE.test(userAgent);
                        var fIEVersion = parseFloat(RegExp["$1"]);
                        IE55 = fIEVersion == 5.5;
                        IE6 = fIEVersion == 6.0;
                        IE7 = fIEVersion == 7.0;
                        IE8 = fIEVersion == 8.0;
                        if (IE55) {
                            return "IE55";
                        }
                        if (IE6) {
                            return "IE6";
                        }
                        if (IE7) {
                            return "IE7";
                        }
                        if (IE8) {
                            return "IE8";
                        }
                    }//isIE end
                    if (isFF) {
                        return "FF";
                    }
                    if (isOpera) {
                        return "Opera";
                    }
                }

            };

        }])
        //字符串截取
        .filter('dateFormat', function () {
            return function (dateTime) {
                return dateTime.substr(0, 10);
            }
        })
});