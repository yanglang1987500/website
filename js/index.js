/**
 * Created by 杨浪 on 2016/11/7.
 */
var $container;
var homePage = './pages/home.html';

$(function(){
    subscriEvents();
    initWidgets();
    bindEvents();
    $container = $('#mainContainer');

    Events.notify('menu-panel-in','home',true);

    //延迟两秒打开公告面板
    setTimeout(function(){
        Events.notify('open-notice','重要公告','为贯彻落实《国务院关于积极推进“互联网+”行动的指导意见》《国务院关于加快推……','http://www.baidu.com');
    },2000);
});

/**
 * 订阅事件
 */
function subscriEvents(){
    var $menuPanel = $('#menuPanel'),$slidePanel = $('#slidePanel'),activedMenuId = '',$headShadow =$('.head-shadow');
    //菜单面板切换
    Events.subscribe('menu-panel-in',function(dataId,isClick){
        if(isClick){
            //如果是点击事件
            if(dataId == 'home'){
                Events.notify('fetch-fragment',homePage,function(data){
                    Events.notify('render-container',data);
                });
                $menuPanel.hide();
                $slidePanel.show();
                $('.home-footer').show();
                $('.head-shadow').addClass('actived');
            }else{
                $menuPanel.show();
                $slidePanel.hide();
                $('.menu-panel-list').hide();
                $('.home-footer').hide();
                $('#'+dataId,$menuPanel).show();
                $headShadow.removeClass('actived');
                // TODO 激活当前菜单面板下第一个菜单
                $('#'+dataId+'>li',$menuPanel).eq(0).click();
            }
            activedMenuId = dataId;//记录当前激活菜单
        }else{
            //如是鼠标移入事件
            if(dataId == 'home'){
                $menuPanel.hide();
                $slidePanel.show();
                $('.head-shadow').addClass('actived');
            }else{
                $menuPanel.show();
                $slidePanel.hide();
                $('.menu-panel-list').hide();
                $('#'+dataId,$menuPanel).show();
                $headShadow.removeClass('actived');
            }
        }

    }).subscribe('menu-panel-out',function(dataId){
        if(activedMenuId == 'home'){
            $menuPanel.hide();
            $slidePanel.show();
            $('.home-footer').show();
            $('.head-shadow').addClass('actived');
        }else{
            $menuPanel.show();
            $slidePanel.hide();
            $('.menu-panel-list').hide();
            $('.home-footer').hide();
            $('#'+activedMenuId,$menuPanel).show();
            $('.head-shadow').removeClass('actived');
        }
    });

    //请求页面片段
    Events.subscribe('fetch-fragment',function(url,callback){
        if(url)
            $.get(url,function(data){
                callback&&callback(data);
            });
    });

    //初始化段内的幻灯牌
    Events.subscribe('init-slide-ppt',function(){
        $("#fullSlide",$container).slide({
            mainCell: ".bd ul",
            autoPlay: true,
            delayTime:1000,
            interTime:50000,
            effect:"fade"
        });
    });

    /**
     * 渲染主区域内容
     */
    Events.subscribe('render-container',function(data){
        $container.html(data);
        Events.notify('init-slide-ppt');
        if($.browser.msie && $.browser.version == '8.0')
            Events.notify('render-table-even');
    });


    /**
     * 渲染表格的奇偶样式
     */
    Events.subscribe('render-table-even',function(){
        $('.ui-table tr:even').addClass('even');
    });


    /**
     * 订阅打开与关闭公告面板事件
     * 三个参数
     * title 公告标题
     * content 公告内容
     * href 详情链接
     */
    var $notice = $('.ui-notice');
    Events.subscribe('open-notice',function(title,content,href){
        $('#notice-title',$notice).html(title);
        $('#notice-content',$notice).html(content);
        $('.notice-detail',$notice).attr('href',href);
        $('.ui-notice').fadeIn(200);
    }).subscribe('close-notice',function(){
        $notice.fadeOut(200);
    });

    $notice.on('click','.close-btn',function(){
       Events.notify('close-notice');
    });


}

/**
 * 绑定元素事件
 */
function bindEvents(){
    //导航按钮点击事件
    $('.head-navi').on('click','li',function(){
        var $this = $(this);
        var dataId = $this.attr('data-id');
        $('.menu-panel li').removeClass('actived');
        $this.parent().find('li').removeClass('actived').end().end().addClass('actived');
        Events.notify('menu-panel-in',dataId,true);
    }).on('mouseenter','li',function(){
        var $this = $(this);
        var dataId = $this.attr('data-id');
        Events.notify('menu-panel-in',dataId,false);
    }).on('mouseout','li',function(e){
        var $this = $(this);
        var dataId = $this.attr('data-id');
        if(e.clientY>296){
            Events.notify('menu-panel-out',dataId);

        }
    });

    //菜单面板点击事件
    $('#menuPanel').on('click','.menu-panel-list>li',function(){
        var $this = $(this);
        if($this.hasClass('more')||$this.hasClass('more-two'))
            return;
        $('.menu-panel li').removeClass('actived');
        $('.more li,.more-two li',$this.parent()).removeClass('actived');
        if($this.next().hasClass('more') || $this.next().hasClass('more-two')){
            $this.next().find('ul>li').removeClass('actived').eq(0).addClass('actived');
        }
        $this.parent().children().removeClass('actived');
        $this.addClass('actived');
        var module = $this.attr('data-module');
        Events.notify('fetch-fragment',module,function(data){
            Events.notify('render-container',data);
        });

        var pId = $this.parent().attr('id');
        $(".head-navi>li").removeClass('actived');
        $(".head-navi>li[data-id='"+pId+"']").addClass('actived');
    });

    //菜单面板二级菜单点击事件
    $('#menuPanel').on('click','.more>ul li',function(){
        var $this = $(this);
        $('.menu-panel li').removeClass('actived');
        $('li',$this.parent().parent().parent()).removeClass('actived');
        $this.parent().parent().prev().addClass('actived');
        $this.addClass('actived');
        var module = $this.attr('data-module');
        Events.notify('fetch-fragment',module,function(data){
            Events.notify('render-container',data);
        });


        var pId = $this.parent().parent().parent().attr('id');
        $(".head-navi>li").removeClass('actived');
        $(".head-navi>li[data-id='"+pId+"']").addClass('actived');
    }).on('mouseenter','.more>ul li',function(){
        var $this = $(this);
        $this.parent().parent().prev().addClass('actived');
    }).on('mouseout','.more>ul li',function(){
        var $this = $(this);
        var hasActived = false;
        $this.parent().find('li').each(function(){
            if($(this).hasClass('actived')){
                hasActived = true;
                return false;
            }
        });
        !hasActived && ($this.parent().parent().prev().removeClass('actived'));
    }).on('click','.more-two>ul li',function(){
        var $this = $(this);
        $('.menu-panel li').removeClass('actived');
        $('li',$this.parent().parent().parent()).removeClass('actived');

        $this.parent().parent().prev().addClass('actived');
        $this.addClass('actived');
        var module = $this.attr('data-module');
        Events.notify('fetch-fragment',module,function(data){
            Events.notify('render-container',data);
        });
        var pId = $this.parent().parent().parent().attr('id');
        $(".head-navi>li").removeClass('actived');
        $(".head-navi>li[data-id='"+pId+"']").addClass('actived');
    }).on('mouseenter','.more-two>ul li',function(){
        var $this = $(this);
        $this.parent().parent().prev().addClass('actived');
    }).on('mouseout','.more-two>ul li',function(){
        var $this = $(this);
        var hasActived = false;
        $this.parent().find('li').each(function(){
            if($(this).hasClass('actived')){
                hasActived = true;
                return false;
            }
        });
        !hasActived && ($this.parent().parent().prev().removeClass('actived'));
    });
}

/**
 * 初始化控件
 */
function initWidgets() {
    //初始化页签
    $('body').on('click','.ui-tab ul li',function(){
        var $this = $(this);
        if($this.hasClass('actived'))
            return;
        $this.parent().children().removeClass('actived');
        $this.addClass('actived');
        $this.parent().next().children().hide().eq($this.index()).show();
    });
}
