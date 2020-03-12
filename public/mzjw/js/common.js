// CT为全局对象，向这个对象挂载一些方法
window.CT = {}

CT.getParamsByUrl = function(){
    var param = {}
    var search = location.search //地址栏后面的搜索信息 ?key=1&key2=a
    if(search){
        search = search.replace("?", "")
        var arr = search.split("&") // [key=1,key2=a]
        arr.forEach(function(item, index){
            var itemArr = item.split("=")
            //itemArr[0]为键，itemArr[1]为值
            param[itemArr[0]] = itemArr[1]
        })
    }
    return param // {key:1,key2:a}
}

// 序列化数据,输入string，返回一个object
// "key=value&k=v" ====>  {key:value,k:v}
CT.serialize2object = function (serializeStr) {
    var obj = {};
    /*key=value&k=v*/
    if(serializeStr){
        var arr = serializeStr.split('&'); 
        arr.forEach(function (item,i) {
            var itemArr = item.split('='); //数组，里面有两个元素，第一个元素作为键，第二个元素作为值
            obj[itemArr[0]] = itemArr[1];
        })
    }
    return obj;
};
// 在一大串数据中，根据id拿到对应的那条数据
CT.getItemById = function (arr,id) {
    var obj = null;
    arr.forEach(function (item,i) {
        if(item.id == id){
            obj = item;
        }
    });
    return obj;
}

/*需要登录的ajax请求*/
CT.loginUrl = '/mzjw/user/login.html';
CT.cartUrl = '/mzjw/user/cart.html';
CT.userUrl = '/mzjw/user/index.html';
CT.loginAjax = function (params) {
    /*params====> {} */
    $.ajax({
        type: params.type || 'get',
        url: params.url || '#',
        data: params.data || '',
        dataType: params.dataType || 'json',
        success:function (data) {
            /*未登录的处理 当data返回：{error: 400, message: "未登录！"} ，表示未登陆
            所有的需要登录的接口 没有登录返回这个数据*/
            if(data.error == 400){
                /*跳到登录页  把当前地址传递给登录页面  当登录成功按照这个地址跳回来*/
                location.href = CT.loginUrl + '?returnUrl=' + location.href;
                return false;
            }else{
                params.success && params.success(data);
            }
        },
        error:function () {
            mui.toast('服务器繁忙');
        }
    });
};