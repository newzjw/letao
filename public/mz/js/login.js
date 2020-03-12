$(function () {
    // ajax实现登陆
    $('#submit').on('tap',function () {
        // 表单序列化
        // 1.获取表单序列化数据，注意html里的表单输入框需要有name属性
        // 如果用serializeArray()，返回的是数组
        var data = $('form').serialize(); //返回string
        console.log(data); 

        /*2. 数据类型是string，要转换成对象data type string "key=value&k=v" ====>  {key:value,k:v} */
        var dataObject = CT.serialize2object(data);
        console.log(dataObject);
        /*3. valid校验 */
        /*“JSON”未定义 IE67  解决办法：json2.js插件https://github.com/douglascrockford/JSON-js*/
        /*检验*/
        if(!dataObject.username){
            mui.toast('请您输入用户名');
            return false;
        }
        if(!dataObject.password){
            mui.toast('请您输入密码');
            return false;
        }

        $.ajax({
            type:'post',
            url:'/user/login',
            /*data这个参数支持对象、serialize（string）、 serializeArray（array）*/
            // 所以这里可以传递dataObject或者data（$('form').serialize()）
            data:dataObject,
            dataType:'json',
            success:function (data) {
                /*如果成功 根据地址跳转*/
                if(data.success == true){
                    /*如果没有地址 默认跳转个人中心首页*/
                    /*业务成功*/
                    var returnUrl = location.search.replace('?returnUrl=','');
                    if(returnUrl){
                        location.href = returnUrl;
                    }else{
                        location.href = CT.userUrl; //跳转到个人中心首页
                    }
                }else{
                    /*业务不成功*/
                    mui.toast(data.message);
                }
            }
        });
    })

});