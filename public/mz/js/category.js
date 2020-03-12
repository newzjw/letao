$(function () {
    /*1.功能一：一级分类默认渲染 同时渲染第一个一级分类对应的二级分类*/
    getFirstCategoryData(function (data) {
        /*一级分类默认渲染*/
        /*模版的使用顺序：json数据,定义模版（在html里定义），调用模版，返回html*/
        $('.cate_left ul').html(template('firstTemplate',data));
        /*绑定事件*/
        /*initSecondTapHandle();*/
        /*第一个一级分类对应的二级分类*/
        // 一级分类的id，根据一级分类的id，获取二级分类的内容，并渲染到html上
        // 这里要放到getFirstCategoryData调用之内，渲染出第一分类之后才能找到节点
        var categoryId = $('.cate_left ul li:first-child').find('a').attr('data-id');
        render(categoryId);
    });

    /*2.功能二：点击一级分类加载对应的二级分类*/
    // 不能直接用，因为要在一级分类渲染之后才能渲染二级分类
    // 方法一，在一级分类渲染之后调用
    /*var initSecondTapHandle = function () {
        $('.cate_left li').on('tap',function (e) {
            console.log(e);
        })
    }*/
    // 方法二，委托事件
    $('.cate_left').on('tap','a',function (e) {
        /*当前选中的时候不去加载*/
        if($(this).parent().hasClass('now')) return false;
        /*一级分类样式的选中功能*/
        $('.cate_left li').removeClass('now');
        $(this).parent().addClass('now');
        /*数据的渲染*/
        render( $(this).attr('data-id'));
    });
});
/*获取一级分类的数据*/
//查看接口文档，请求分类接口，获取数据
var getFirstCategoryData = function (callback) {
    $.ajax({
        url:'/category/queryTopCategory',
        type:'get',
        data:'',
        dataType:'json',
        success:function (data) {
            callback && callback(data);
        }
    });
};
/*获取二级分类的数据*/
/*params = {id:1} 类型是对象*/
var getSecondCategoryData = function (params,callback) {
    $.ajax({
        url:'/category/querySecondCategory',
        type:'get',
        data:params,
        dataType:'json',
        success:function (data) {
            callback && callback(data);
        }
    });
};
/*渲染二级分类*/
var render = function (categoryId) {
    getSecondCategoryData({
        id:categoryId
    },function (data) {
        /*二级分类默认*/
        $('.cate_right ul').html(template('secondTemplate',data));
    });
}