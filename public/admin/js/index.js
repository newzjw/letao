// $(function(){
//     /*1.注册人数  数据可视化*/
//     /*1.1准容器渲染图标*/
//     /*1.2准备数据 */
//     /*1.3引入核心echarts文件*/
//     /*1.4获取dom容器*/
//     var firstDom = document.querySelector('.picTable:first-child');
//     /*1.5初始化dom容器*/
//     var firstCarts = echarts.init(firstDom);
//     /*1.6进行配置和导入数据*/
//     var option = {
//         /*图标的标题*/
//         title: {
//             text: '2017年注册人数'
//         },
//         tooltip: {},
//         legend: {
//             data:['人数']
//         },
//         xAxis: {
//             data: ["1月","2月","3月","4月","5月","6月"]
//         },
//         yAxis: {},
//         series: [{
//             name: '人数',
//             type: 'bar',
//             data: [1000, 2000, 3600, 1400, 1200, 2220]
//         }]
//     };
//     /*1.7 渲染图标*/
//     firstCarts.setOption(option);
//
//     /*2.品牌销量  数据可视化*/
//     var secondDom = document.querySelector('.picTable:last-child');
//     var secondCarts = echarts.init(secondDom);
//     var secondOption = {
//         title : {
//             text: '热门品牌销售',
//             subtext: '2017年6月',
//             x:'center'
//         },
//         tooltip : {
//             trigger: 'item',
//             formatter: "{b} : {c} ({d}%)"
//         },
//         legend: {
//             orient: 'vertical',
//             left: 'left',
//             data: ['耐克','阿迪','百伦','安踏','李宁']
//         },
//         series : [
//             {
//                 name: '访问来源',
//                 type: 'pie',
//                 radius : '55%',
//                 center: ['50%', '60%'],
//                 data:[
//                     {value:335, name:'耐克'},
//                     {value:310, name:'阿迪'},
//                     {value:234, name:'百伦'},
//                     {value:135, name:'安踏'},
//                     {value:1548, name:'李宁'}
//                 ],
//                 itemStyle: {
//                     emphasis: {
//                         shadowBlur: 10,
//                         shadowOffsetX: 0,
//                         shadowColor: 'rgba(0, 0, 0, 0.5)'
//                     }
//                 }
//             }
//         ]
//     };
//     secondCarts.setOption(secondOption);
// })

$(function(){
    barCharts();
    pieCharts();
});
var barCharts = function () {
    /*获取数据*/
    var data = [
        {
            name:'一月',
            value:300
        },
        {
            name:'二月',
            value:400
        },
        {
            name:'三月',
            value:500
        },
        {
            name:'四月',
            value:200
        },
        {
            name:'五月',
            value:600
        }
    ];
    var xdata = [], sdata = [];
    data.forEach(function (item,i) {
        xdata.push(item.name);
        sdata.push(item.value);
    });


    /*1.引入echarts.min.js文件*/
    /*2.找到画图的容器*/
    var box = document.querySelector('.picTable:first-child');
    /*3.初始化插件*/
    var myChart = echarts.init(box);
    /*4.配置参数*/
    var options = {
        title:{
            text:'2017年注册人数'
        },
        legend:{
            data:['注册人数']
        },
        tooltip : {
        },
        xAxis : [
            {
                data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'注册人数',
                type:'bar',
                barWidth: '60%',
                data:[10, 52, 200, 334, 390, 330, 220]
            }
        ]
    }
    options.xAxis[0].data = xdata;
    options.series[0].data = sdata;
    /*5.设置参数*/
    myChart.setOption(options);
}
var pieCharts = function () {
    /*1.引入echarts.min.js文件*/
    /*2.找到画图的容器*/
    var box = document.querySelector('.picTable:last-child');
    /*3.初始化插件*/
    var myChart = echarts.init(box);
    /*4.配置参数*/
    var options = {
        title : {
            text: '品牌销售占比',
            subtext: '2017年10月',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            /*series.name  a  */
            /*data.name  b */
            /*data.value  c */
            /*占比  d */
            formatter: "{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['李宁','耐克','阿迪','匡威','回力']
        },
        series : [
            {
                name: '销售情况',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'李宁'},
                    {value:310, name:'耐克'},
                    {value:234, name:'阿迪'},
                    {value:135, name:'匡威'},
                    {value:1548, name:'回力'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
    /*5.设置参数*/
    myChart.setOption(options);
};