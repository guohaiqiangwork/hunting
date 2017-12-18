//预生产环境
define({
    app: {
        name: '',
        client: '',
        version: window.NEPTUNE.version
    },
    httpPackage: {
        method: 'POST',
        dataType: 'json',
        url: '',
        contentType: 'application/json; charset=UTF-8', // application/x-www-form-urlencoded; charset=UTF-8
        useDefaultXhrHeader: false,
        header: {},
        data: {},
        timeout: 30000
    },
    //请求路径
    backend: {
        // ip: 'http://10.39.4.56:9000/zipm/zkr/api/v1/',
        // orderIp:'http://10.39.4.56:9000/ziom/zkr/api/v1/', //订单
        // loginIp:'http://10.39.4.56:9000/ziam/v1/',//明星
        // payIp:'http://10.39.4.7:9022/payapi/' //生成批次号 支付码

        ip: 'http://123.58.243.115:9000/zipm/zkr/api/v1/',
        orderIp: 'http://123.58.243.115:9000/ziom/zkr/api/v1/', //订单
        loginIp: 'http://123.58.243.115:9000/ziam//v1/',//明星
        payIp: 'http://123.58.243.115:9022/payapi/', //生成批次号 支付码
        documentIp: 'http://123.58.243.115:9000/zipm/zkr/api/v1/certify/'
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
    },
    //各接口参数配置
    requestMethods: {
        login: 'login',
        getUser: 'getUser'
    },
    method: ''
});