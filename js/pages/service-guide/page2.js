/**
 * Created by 杨浪 on 2016/11/15.
 */
(function(){

    var $root = $('.service-guide-page2') , $tips = $('.tips',$root);
    $('.room-wrap>li',$root).on('mouseenter',function(e){
        var $this = $(this),winWidth = $(window).width(),contentWidth = winWidth>1400?1200:1024;
        var half  = (winWidth - contentWidth)/2;
        var flag = (e.clientX - half)>(contentWidth*2/3);
        $tips.find('p').eq(0).html('我是第'+$this.index()+'个');
        $tips.find('p').eq(1).html('我是第'+$this.index()+'个的内容');
        $tips.css({
            left:function(){
                return flag?(e.clientX-$tips.width()):(e.clientX+10);
            }(),
            top:function(){
                return e.clientY+10;
            }
        }).fadeIn(100);
    }).on('mouseleave',function(){
        $tips.fadeOut(100);

    });
})();