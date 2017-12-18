﻿//生产环境
define({
    app: {
        name: '',
        client: '',
        version: window.NEPTUNE.version
    },
    httpPackage: {
        method: 'POST',
        dataType: 'jsonp',
        url: '',
        contentType: 'application/json; charset=UTF-8',
        useDefaultXhrHeader: false,
        header: {},
        data: {},
        timeout: 30000
    },
    //请求路径
    backend: {
        ip: 'https://apibaoxian.enn.cn:9002/zkr/api/v1/',
        orderIp: 'https://apibaoxian.enn.cn:9004/zkr/api/v1/', //订单
        loginIp: 'https://apibaoxian.enn.cn:9006/v1/',//明星
        payIp: 'https://baoxian.enn.cn/payapi/', //生成批次号 支付码
        documentIp: 'https://apibaoxian.enn.cn:9002/zkr/api/v1/certify/'

    },
    auth: {
        isLogin: false,
        isSave: true
    },
    //分页
    pagination: {
        pageSize: 20,
        previousText: '上一页',
        nextText: '下一页',
        firstText: '首页',
        lastText: '尾页'
    }

});
