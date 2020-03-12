$(function () {
    /*区域滚动*/
    mui('.mui-scroll-wrapper').scroll({
        indicators: false
    })



    /*1.页面初始化的时候：关键字在输入框内显示*/
    // 获取关键字
    var urlParams = CT.getParamsByUrl()
    // 关键字在输入框内显示
    var $input = $('input').val(urlParams.key || '')
    /*2.页面初始化的时候：根据关键字查询第一页数据4条*/
    getSearchData({
        proName: urlParams.key,
        page: 1,
        pageSize: 4
    }, function (data) {
        console.log(data)
        $('.ct_product').html(template('list', data))
    })


    /*3.用户点击搜索的时候 根据新的关键字搜索商品 重置排序功能*/
    $('.ct_search a').on('tap', function () {
        var key = $.trim($('input').val())
        console.log(this)
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        getSearchData({
            proName: key,
            page: 1,
            pageSize: 4
        }, function (data) {
            /*渲染数据*/
            $('.ct_product').html(template('list', data))
        })
    })

    /*4.用户点击排序的时候  根据排序的选项去进行排序（默认的时候是 降序  再次点击的时候 升序）*/
    $('.ct_order a').on('tap', function () {
        console.log(this)
        console.log($(this))
        var $this = $(this)
        /*如果之前没有选择，就给该元素加上now,否则就改变箭头方向*/
        if (!$this.hasClass('now')) {
            console.log(11)
            $this.addClass('now').siblings().removeClass('now').find('span')
                .removeClass('fa-angle-up').addClass('fa-angle-down')
        } else {
            if ($this.find('span').hasClass('fa-angle-down')) {
                $this.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                $this.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        }

        /*获取当前点击的功能参数  price 1 2 num 1 2*/
        // 如果是递增，orderVal就为1，反之为2
        var order = $this.attr('data-order')
        var orderVal = $this.find('span').hasClass('fa-angle-up') ? 1 : 2
        var key = $.trim($input.val());
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        // 获取数据
        var params = {
            proName: key,
            page: 1,
            pageSize: 4
            /*排序的方式*/
        }
        params[order] = orderVal
        getSearchData(params, function (data) {
            /*渲染数据*/
            $('.ct_product').html(template('list', data));
        })
    })

    /*5.用户下拉的时候  根据当前条件刷新 上拉加载重置  排序功能也重置 */
    // 使用mui组件
    mui.init({
        pullRefresh: {
            /*下拉容器*/
            container: "#refreshContainer",
            /*下拉*/
            down: {
                /*最近跟新的功能*/
                /*style:'circle',*/
                // 这里去掉了一些默认的选项
                /*自动加载*/
                // auto: true,
                callback: function () {
                    /*this代表组件对象，该组件对象有endPulldownToRefresh、refresh等方法*/
                    var that = this;
                    var key = $.trim($input.val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false;
                    }

                    /*排序功能也重置*/
                    $('.ct_order a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');

                    getSearchData({
                        proName: key,
                        page: 1,
                        pageSize: 4
                    }, function (data) {
                        // 这里加个settimeout是模拟加载时间
                        setTimeout(function () {
                            /*渲染数据*/
                            $('.ct_product').html(template('list', data));
                            /*注意：停止下拉刷新*/
                            that.endPulldownToRefresh();
                            /*上拉加载重置*/
                            that.refresh(true);
                        }, 1000);
                    });
                }
            },
            /*6.用户上拉的时候  加载下一页（没有数据不去加载了）*/
            up: {
                callback:function () {
                    window.page ++;
                    /*组件对象*/
                    var that = this;
                    var key = $.trim($input.val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false;
                    }

                    /*获取当前点击的功能参数  price 1 2 num 1 2*/
                    var order = $('.ct_order a.now').attr('data-order');
                    var orderVal = $('.ct_order a.now').find('span').hasClass('fa-angle-up') ? 1 : 2;
                    /*获取数据*/
                    var params = {
                        proName: key,
                        page: window.page,
                        pageSize: 4
                        /*排序的方式*/
                    };
                    params[order] = orderVal;
                    getSearchData(params, function (data) {
                        setTimeout(function () {
                            /*渲染数据，注意这里是追加内容而不是替换*/
                            $('.ct_product').append(template('list', data));
                            /*注意：停止上拉加载*/
                            if(data.data.length){
                                that.endPullupToRefresh();
                            }else{ //没有数据了
                                that.endPullupToRefresh(true);
                            }

                        }, 1000);
                    });
                }
            }
        }
    })

    

})

// 获取搜索数据
var getSearchData = function (params, callback) {
    $.ajax({
        url: "/product/queryProduct",
        type: 'get',
        data: params,
        dataType: 'json',
        success: function (data) {
            /*存当前页码，用于下拉加载*/
            window.page = data.page;
            callback && callback(data);
        }
    })
}