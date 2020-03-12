$(function () {
    /*区域滚动组件初始化*/
    mui('.mui-scroll-wrapper').scroll({
        indicators:false    //去掉滚动条
    });
    
    /*1.功能一：一级分类默认渲染 同时渲染第一个一级分类对应的二级分类*/
    getFirstCategoryData(function(data){
        $('.cate_left ul').html(template('firstTemplate', data))
        var categoryId = $('.cate_left ul li:first-child').find('a').attr('data-id')
        render(categoryId)
    })

    // 点击一级分类，加载二级分类
    $('.cate_left').on('tap', 'a', function(e){
        /*当前选中的时候不去加载*/
        if($(this).parent().hasClass('now')) return false;
        /*一级分类样式的选中功能*/
        $('.cate_left li').removeClass('now');
        $(this).parent().addClass('now');
        console.log($(this).attr('data-id'))
        /*数据的渲染*/
        render( $(this).attr('data-id'));
    })
    
});


// 获取一级分类数据
var getFirstCategoryData = function(callback){
    $.ajax({
        url: '/category/queryTopCategory',
        type: 'get',
        data: '',
        dataType : 'json',
        success: function(data){
            callback && callback(data)
        }
    })
}

// 获取二级分类数据
var getSecondCategoryData = function(params, callback) {
    $.ajax({
        url: '/category/querySecondCategory',
        type: 'get',
        data: params,
        dataType: 'json',
        success: function(data){
            callback && callback(data)
        }
    })
}

// 渲染二级分类数据
var render = function(categoryId) {
    
    getSecondCategoryData({
        id : categoryId
    }, function(data){
        /*二级分类默认*/
        $('.cate_right ul').html(template('secondTemplate',data));
    })

}

