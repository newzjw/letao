$(function(){
    $(".ct_search a").on('tap', function(){
        var key = $.trim($('input').val())
        if(!key){
            mui.toast('please enter something')
            return false
        }

        location.href = 'searchList.html?key=' + key
    })
})