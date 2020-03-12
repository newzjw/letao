$(function () {
    // 获取商品id
    var id = CT.getParamsByUrl().productId;
    getProductData(id, function (data) {
        /*获取到数据后清除加载状态*/
        $('.loading').remove();
        /*渲染商品详情页*/
        $('.mui-scroll').html(template('detail', data));
        /*轮播图*/
        mui('.mui-slider').slider({
            interval: 2000
        });
        /*区域滚动*/
        mui('.mui-scroll-wrapper').scroll({
            indicators: false
        });
        /*1.尺码的选择*/
        $('.btn_size').on('tap', function () {
            $(this).addClass('now').siblings().removeClass('now');
        });
        /*2.数量的选择*/
        $('.p_number span').on('tap', function () {
            var $input = $(this).siblings('input');
            // 当前的数字
            var currNum = $input.val();
            /*字符串 转数字，最大库存 */
            var maxNum = parseInt($input.attr('data-max'));
            if ($(this).hasClass('jian')) {
                if(currNum == 0){
                    mui.toast('数量不能为负');
                    return false;
                }
                currNum--;
            } else {
                /*不超库存*/
                if(currNum >= maxNum){
                    /*消息框点击的时候会消失，因为正好和加号在一块  (这种叫击穿现象 tap特有,或者叫点击穿透)*/
                    // 解决办法，加个延时
                    setTimeout(function () {
                        mui.toast('库存不足');
                    },100);
                    return false;
                }
                currNum++;
            }
            $input.val(currNum);
        });
        /*3.加人购物车*/
        $('.btn_addCart').on('tap',function () {
            /*数据校验*/
            var $changeBtn = $('.btn_size.now');
            if(!$changeBtn.length){
                mui.toast('请您选择尺码');
                return false;
            }
            // 购买数量
            var num = $('.p_number input').val();
            if( num <= 0){
                mui.toast('请您选择数量');
                return false;
            }
            /*提交数据*/
            CT.loginAjax({
                url:'/cart/addCart',
                type:'post',
                data:{
                    productId:id,
                    num:num,
                    size:$changeBtn.html()
                },
                dataType:'json',
                success:function (data) {
                    if(data.success == true){
                        /*弹出提示框*/
                        /*content*/
                        /*title*/
                        /*btn text []*/
                        /*click btn callback */
                        mui.confirm('添加成功，去购物车看看？', '温馨提示', ['是', '否'], function(e) {
                            // 如果点击了“是”
                            if (e.index == 0) {
                                // 去购物车页面
                                location.href = CT.cartUrl;
                            } else {
                                //TODO
                            }
                        })
                    }
                }
            });
        });
    })
});
// 获取产品数据
var getProductData = function (productId, callback) {
    $.ajax({
        url: '/product/queryProductDetail',
        type: 'get',
        data: {
            id: productId
        },
        dataType: 'json',
        success: function (data) {
            setTimeout(function () {
                console.log(data)
                callback && callback(data);
            }, 1000);
        }
    });
};