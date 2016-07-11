$.fn.extend({
    tab:tab
});
function tab(id){
    $(id+" input").click(function(){
        $(this).addClass("bg").siblings().removeClass("bg");
        $(id+" div").eq($(this).index()).addClass("show").siblings().removeClass("show");
    })
}