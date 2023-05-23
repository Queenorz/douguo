//ios兼容，离开页面再回来，飞速轮播
var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") {
	hidden = "hidden";
	visibilityChange = "visibilitychange";
} else if (typeof document.mozHidden !== "undefined") {
	hidden = "mozHidden";
	visibilityChange = "mozvisibilitychange";
} else if (typeof document.msHidden !== "undefined") {
	hidden = "msHidden";
	visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
	hidden = "webkitHidden";
	visibilityChange = "webkitvisibilitychange";
}
// 监听是否离开当前页面
document.addEventListener(visibilityChange, function() {
	if(document[hidden]){
		clearTimeout(timer);
		timer=null;
	}else{
		starttimer();
	}
}, false);
// 初始化
var index=1;
var timer=null;
function starttimer(){
	clearTimeout(timer);
	timer=null;
	timer=setTimeout(function(){
		index+=1;
		var sw=parseInt($(window).width());
		sw = sw<1000?1000:sw;
		$(".blist").animate({"left":-index*sw+"px"},500);
		if(index==(pnum+1)){
			index=1;
			$(".blist").animate({"left":-index*sw+"px"},0);
		}
		$(".bpages li").removeClass("act");
		$(".bpages li:eq("+(index-1)+")").addClass("act");
		starttimer();
	},3000);
}
var sw=parseInt($(window).width());
sw = sw<1000?1000:sw;
if(pnum>1){
	$(".blist").animate({"left":-index*sw+"px"},0);
	starttimer();
}
// 向左
$(".prev").on("click",function(){
	index-=1;
	var sw=parseInt($(window).width());
	sw = sw<1000?1000:sw;
	$(".blist").animate({"left":-index*sw+"px"},500);
	if(index==0){
		index=pnum;
		$(".blist").animate({"left":-index*sw+"px"},0);
	}
	$(".bpages li").removeClass("act");
	$(".bpages li:eq("+(index-1)+")").addClass("act");
});
// 向右
$(".next").on("click",function(){
	index+=1;
	var sw=parseInt($(window).width());
	sw = sw<1000?1000:sw;
	$(".blist").animate({"left":-index*sw+"px"},500);
	if(index==(pnum+1)){
		index=1;
		$(".blist").animate({"left":-index*sw+"px"},0);
	}
	$(".bpages li").removeClass("act");
	$(".bpages li:eq("+(index-1)+")").addClass("act");
});
// 鼠标悬停暂停滚动
$("#banner").hover(function(){
	clearTimeout(timer);
	timer = null;
},function(){
	if(!timer){
		clearTimeout(timer);
		timer = null;
		starttimer();
	}
});
// 页码跳转
$(".bpages").on("click","li",function(){
	clearTimeout(timer);
	sw=parseInt($(window).width());
	sw = sw<1000?1000:sw;
	newindex = parseInt($(this).attr("data-page"));
	if(index==pnum && newindex==1){
		$(".blist").animate({"left":-(pnum+1)*sw+"px"},500,function(){
			$(".blist").animate({"left":-1*sw+"px"},0);
		});
	}else{
		$(".blist").animate({"left":-newindex*sw+"px"},500);
	}
	index=newindex;
	$(this).addClass("act").siblings().removeClass("act");
});
// 更新头部未读消息数
$.ajax({
	url:"/message/unread",
	data:{'user_id':user_id},
	type:'get',
	success:function(res){
		if(res.data.unread_count > 0){
			$("#header").find(".msgnum").show();
			$("#header").find(".boll").css("display","inline-block");
		}else{
			$("#header").find(".msgnum").hide();
			$("#header").find(".boll").hide();

		}
		$("#header").find(".msgnum").text(res.data.unread_count);
	}
})