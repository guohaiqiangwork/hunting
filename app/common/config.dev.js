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
        timeout:30000
    },
    //请求路径
    backend: {
        ip: 'http://baoxiantest.enn.cn:9003/zipm/zkr/api/v1/',
        orderIp:'http://baoxiantest.enn.cn:9050/ziom/zkr/api/v1/', //订单
        // loginIp:'http://baoxiantest.enn.cn:9004/ziam/v1/',//明星
        loginIp:'http://10.37.147.168:9004/ziam/v1/',//明星
        payIp:'http://baoxian.enn.cn/wxapi/', //生成批次号 支付码
        documentIp:'http://10.37.147.167:9003/zipm/zkr/api/v1/certify/' // 单证ip
        // ip: 'basicIp/',
        // orderIp:'orderIp/', //订单
        // loginIp:'loginIp/',//明星
        // payIp:'payIp/'
    },
    auth:{
        isLogin:false,
        isSave:true
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
    requestMethods:{
        login:'login',
        getUser:'getUser'
    },
    method:''
});