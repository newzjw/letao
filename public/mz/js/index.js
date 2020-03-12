$(function () {
    /*区域滚动组件初始化*/
    mui('.mui-scroll-wrapper').scroll({
        indicators:false    //去掉滚动条
    });
    /*轮播图*/
    mui('.mui-slider').slider({
        interval:2000,

    });
});