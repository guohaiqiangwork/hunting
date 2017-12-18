//生产环境
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
        ip: 'https://apibaoxian.enn.cn:9002/zkr/api/v1/'

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
