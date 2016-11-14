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
                //如果点击的是【首页】 加载首页片段
                Events.notify('fetch-fragment',homePage,function(data){
                    Events.notify('render-container',data);
                });
                $menuPanel.hide();//隐藏菜单面板
                $slidePanel.show();//显示滚动PPT面板
                $('.home-footer').show();//首页的页脚写在index.html中了，如果写在home.html里的话布局上不太好实现。
                $('.head-shadow').addClass('actived');//切换菜单面板上方的阴影颜色
            }else{
                $menuPanel.show();//显示菜单面板
                $slidePanel.hide();//隐藏滚动PPT面板
                $('.menu-panel-list').hide();//隐藏所有菜单
                $('.home-footer').hide();//隐藏首页的页脚
                $('#'+dataId,$menuPanel).show();//显示当前导航对应的菜单列表
                $headShadow.removeClass('actived');//切换菜单面板上方的阴影颜色
                //  激活当前菜单面板下第一个菜单
                $('#'+dataId+'>li',$menuPanel).eq(0).click();
            }
            activedMenuId = dataId;//记录当前激活菜单
        }else{
            //如是鼠标移入事件
            if(dataId == 'home'){
                $menuPanel.hide();//隐藏菜单面板
                $slidePanel.show();//显示滚动PPT面板
                $('.head-shadow').addClass('actived');//切换菜单面板上方的阴影颜色
            }else{
                $menuPanel.show();//显示菜单面板
                $slidePanel.hide();//隐藏滚动PPT面板
                $('.menu-panel-list').hide();//隐藏所有菜单
                $('#'+dataId,$menuPanel).show();
                $headShadow.removeClass('actived');//切换菜单面板上方的阴影颜色
            }
        }

    }).subscribe('menu-panel-out',function(dataId){
        //鼠标移出事件，用于还原显示上一个选中的导航节点与其菜单面板
        if(activedMenuId == 'home'){
            $menuPanel.hide();//隐藏菜单面板
            $slidePanel.show();//显示滚动PPT面板
            $('.home-footer').show();//显示首页的页脚
            $('.head-shadow').addClass('actived');//切换菜单面板上方的阴影颜色
        }else{
            $menuPanel.show();//显示菜单面板
            $slidePanel.hide();//隐藏滚动PPT面板
            $('.menu-panel-list').hide();//隐藏所有菜单
            $('.home-footer').hide();//隐藏首页的页脚
            $('#'+activedMenuId,$menuPanel).show();
            $('.head-shadow').removeClass('actived');//切换菜单面板上方的阴影颜色
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

    //绑定公告面板关闭按钮事件
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
        var dataId = $this.attr('data-id');//取导航id
        $('.menu-panel li').removeClass('actived');//移除菜单面板内所有选中样式
        $this.parent().find('li').removeClass('actived').end().end().addClass('actived');//选中当前导航节点，并取消其它导航节点选中
        Events.notify('menu-panel-in',dataId,true);//触发菜单面板显示事件
    }).on('mouseenter','li',function(){
        var $this = $(this);
        var dataId = $this.attr('data-id');
        Events.notify('menu-panel-in',dataId,false);//触发菜单面板显示事件
    }).on('mouseout','li',function(e){
        var $this = $(this);
        var dataId = $this.attr('data-id');
        //只有当鼠标从导航节点下方移出去时才隐藏菜单面板 ，否则需要保持显示状态
        if(e.clientY>296){
            Events.notify('menu-panel-out',dataId);//触发菜单面板隐藏事件
        }
    });

    //菜单面板点击事件
    $('#menuPanel').on('click','.menu-panel-list>li',function(){
        var $this = $(this);
        //如果点击在具有两条或三条子菜单的的li菜单上，直接返回
        if($this.hasClass('more')||$this.hasClass('more-two'))
            return;
        //移除菜单面板其它菜单的选中状态
        $('.menu-panel li').removeClass('actived');
        //移除二级菜单选中状态
        $('.more li,.more-two li',$this.parent()).removeClass('actived');
        if($this.next().hasClass('more') || $this.next().hasClass('more-two')){
            //如果选中的菜单的后一个菜单具有多级子菜单，则默认选中多级子菜单的第一个菜单
            $this.next().find('ul>li').removeClass('actived').eq(0).addClass('actived');
        }
        $this.addClass('actived');//给当前菜单添加选中状态
        var module = $this.attr('data-module');//获取当前菜单的模块地址
        //加载模块
        Events.notify('fetch-fragment',module,function(data){
            Events.notify('render-container',data);
        });

        //当选中菜单面板中的菜单时，需要选中相应导航条上的导航节点
        var pId = $this.parent().attr('id');
        $(".head-navi>li").removeClass('actived');
        $(".head-navi>li[data-id='"+pId+"']").addClass('actived');
    });

    //菜单面板二级菜单点击事件
    $('#menuPanel').on('click','.more>ul li',function(){
        var $this = $(this);
        $('.menu-panel li').removeClass('actived');
        $this.parent().parent().prev().addClass('actived');
        $this.addClass('actived');
        var module = $this.attr('data-module');
        Events.notify('fetch-fragment',module,function(data){
            Events.notify('render-container',data);
        });

        //当选中菜单面板中的二级菜单时，需要选中相应导航条上的导航节点
        var pId = $this.parent().parent().parent().attr('id');
        $(".head-navi>li").removeClass('actived');
        $(".head-navi>li[data-id='"+pId+"']").addClass('actived');
    }).on('mouseenter','.more>ul li',function(){
        var $this = $(this);
        $this.parent().parent().prev().addClass('actived');
    }).on('mouseout','.more>ul li',function(){
        var $this = $(this);
        var hasActived = false;
        //此处是判断是否二级菜单中有选中项，如果有，则鼠标移出时不取消前一菜单的选中状态
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

        //当选中菜单面板中的菜单时，需要选中相应导航条上的导航节点 
        var pId = $this.parent().parent().parent().attr('id');
        $(".head-navi>li").removeClass('actived');
        $(".head-navi>li[data-id='"+pId+"']").addClass('actived');
    }).on('mouseenter','.more-two>ul li',function(){
        var $this = $(this);
        $this.parent().parent().prev().addClass('actived');
    }).on('mouseout','.more-two>ul li',function(){
        var $this = $(this);
        var hasActived = false;
        //此处是判断是否二级菜单中有选中项，如果有，则鼠标移出时不取消前一菜单的选中状态
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
    //初始化页签的点击切换事件
    $('body').on('click','.ui-tab ul li',function(){
        var $this = $(this);
        if($this.hasClass('actived'))
            return;
        $this.parent().children().removeClass('actived');
        $this.addClass('actived');
        $this.parent().next().children().hide().eq($this.index()).show();
    });
}
