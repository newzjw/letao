$(function () {
    /*区域滚动*/
    mui('.mui-scroll-wrapper').scroll({
        indicators:false
    });
    /*初始化上下拉*/
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",
            down: {
                auto:true,
                callback:function () {
                    /*1.初始化页面  自动下拉刷新*/
                    var that = this;
                    /*定义一个全局的 下拉组件对象  使用里面的方法*/
                    //window.down = this;
                    // setTimeout是模拟
                    setTimeout(function () {
                        getCartData(function (data) {
                            /*渲染页面*/
                            $('.mui-table-view').html(template('cart',data));
                            /*加载状态隐藏*/
                            that.endPulldownToRefresh();
                            /*刷新按钮，注册刷新事件 防止多次绑定  先解绑再次绑定*/
                            // 刷新方法二
                            $('.fa-refresh').off('tap').on('tap',function () {
                                /*重新 加载*/
                                /*4.点击刷新按钮  刷新*/
                                that.pulldownLoading();
                            });
                        });
                    },1000);
                }
            }
        }
    });
    /*1.初始化页面  （自动下拉刷新）*/
    /*2.侧滑的时候  点击编辑  弹出对话框，可以编辑尺码，数量）*/
    // 刷新 方法一
    //  $('.fa-refresh').on('tap',function () {
    //      /!*刷新  触发下拉操作*!/
            // 注意这里要用mui包裹，而不能用$('#refreshContainer'),后者是zepro对象，没有pullRefresh()这个方法
            // mui('#refreshContainer').pullRefresh()是一个mui的组件对象，里面有pulldownLoading()这个方法
    //      mui('#refreshContainer').pullRefresh().pulldownLoading();
    //  });

    /*3.侧滑的时候  点击编辑  弹出对话框 确认框*/
    // 委托
    $('.mui-table-view').on('tap','.mui-icon-compose',function () {
        /*弹窗的内容*/
        /*获取当前按钮对应商品的数据，根据ID去缓存获取*/
        var id = $(this).parent().attr('data-id');
        var item = CT.getItemById(window.cartData.data,id);
        console.log(item);
        var html = template('edit',item);
        /*confirm方法的第一个参数是字符串，可以传html格式的字符串，会进行解析*/
        /*confirm 在使用字符串作为内容的时候 \n 会变成<br>标签， \t会变成默认空格*/
        mui.confirm(html.replace(/\n/g,''), '商品编辑', ['确认', '取消'], function(e) {
            // 这里的function是点击确认或者取消之后的callback，选择尺寸和数量的事件应该写在外面
            if (e.index == 0) {
                /*发送请求*/
                var size = $('.btn_size.now').html(); //当前的尺寸
                var num = $('.p_number input').val(); //当前数量
                CT.loginAjax({
                    type:'post',
                    url:'/cart/updateCart',
                    data:{
                        id:id,
                        size:size,
                        num:num
                    },
                    dataType:'json',
                    success:function (data) {
                        if(data.success == true){
                            /*窗口关闭*/
                            /*更新购物车内这件产品的数据*/
                            item.num = num;
                            item.size = size;
                            /*缓存的数据  window.cartData.data 已修改*/
                            /*渲染页面*/
                            $('.mui-table-view').html(template('cart',window.cartData));
                            /*因为这里整个列表重新渲染，所以不用计算总价*/
                            //setAmount();
                        }
                    }
                });
                //return false;
            } else {
                //TODO
            }
        })
    });
    // 因为修改尺码的操作必须等到渲染之后才能执行，所以这里必须只能通过委派的方式
    $('body').on('tap','.btn_size',function () {
        $(this).addClass('now').siblings().removeClass('now');
    });
    $('body').on('tap','.p_number span',function () {
        var $input = $(this).siblings('input');
        var currNum = $input.val();
        /*字符串 转数字 */
        var maxNum = parseInt($input.attr('data-max'));
        if ($(this).hasClass('jian')) {
            if(currNum <= 1){
                mui.toast('至少一件商品');
                return false;
            }
            currNum--;
        } else {
            /*不超库存*/
            if(currNum >= maxNum){
                /*消息框点击的时候会消失 正好和加号在一块  (击穿 tap,点击穿透)*/
                setTimeout(function () {
                    mui.toast('库存不足');
                },100);
                return false;
            }
            currNum++;
        }
        $input.val(currNum);
    });
    // 删除购物车内的商品
    $('.mui-table-view').on('tap','.mui-icon-trash',function () {
        var $this = $(this);
        // 获取商品id
        var id = $this.parent().attr('data-id');
        mui.confirm('您确认是否删除该商品？', '商品删除', ['确认', '取消'], function(e) {
            if (e.index == 0) {
                CT.loginAjax({
                    type:'get',
                    url:'/cart/deleteCart',
                    data:{
                        id:id
                    },
                    dataType:'json',
                    success:function (data) {
                        if(data.success == true){
                            /*删除*/
                            $this.parent().parent().remove();
                            setAmount();
                        }
                    }
                })
            } else {
                //TODO
            }
        })
    });
    /*5.点击复选框的时候计算总金额 */
    $('.mui-table-view').on('change','[type=checkbox]',function () {

        setAmount();
    });
});
/*计算总金额*/
// 涉及到金额的业务，一定不会让前端来算，而是交给后端。前端只负责展示
var setAmount = function () {
    /*所有选中的复选框*/
    var $checkedBox = $('[type=checkbox]:checked');
    /*获取选中商品的ID*/
    /*$.each(i,item)    jquery对象才有$dom.each(i,item)  数组才有foreach arr.forEach(item,i) */
    var amountSum = 0;
    /* 总金额 = 每个商品数量*单价 的总和  */
    $checkedBox.each(function (i,item) {
        // 商品id
        var id = $(this).attr('data-id');
        var item = CT.getItemById(window.cartData.data,id);
        var num = item.num;
        var price = item.price;
        var amount = num * price;
        amountSum += amount;
    });
    // 要处理精度问题，js处理小数有问题
    // 价格先乘100，去掉小数点之后的数字，再除以100
    if(Math.floor(amountSum * 100)%10){
        amountSum = Math.floor(amountSum * 100)/100;
    }else{ //如果除以10之后没数字了，需要补一个0
        amountSum = Math.floor(amountSum * 100)/100;
        amountSum = amountSum.toString()+'0';
    }

    console.log(amountSum);
    $('#cartAmount').html(amountSum);
}

// 获取购物车数据
var getCartData = function (callback) {
    // 必须是登录之后才能获取购物车的信息
    CT.loginAjax({
        type:'get',
        url:'/cart/queryCartPaging',
        data:{
            page:1,
            /*不产生分页  需要修改接口*/
            pageSize:100
        },
        dataType:'json',
        success:function (data) {
            /*缓存的数据，购物车编辑的时候就不用ajax了，直接用这缓存的数据渲染页面*/
            window.cartData = data;
            callback && callback(data);
        }
    });
}