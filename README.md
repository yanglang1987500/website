# 关于如何使用的一些说明

关于片段fragment
----

据美工的要求，客户要使用这种页面片段嵌入的形式，
所以90%的页面是采用的在index.html中的mainContainer中嵌入通过ajax取到的页面片段方式来实现。
但是这种方式有个不好的地方在于对搜索引擎不友好，但凡是采用ajax拉取的片段内容，爬虫都是无法抓取到的。
如果要支持浏览器前进后退切换页面，需要引入相关的路由插件，我不熟悉你们到候要定义的菜单地址，路由我就没写了，不过界时我可以提供相关的指导帮助。
片段内如果需要使用js写相关逻辑，可以在片段fragment的html文件内直接引入js，但是需要使用闭包以防止变量泄露（这里没有使用模块化架构，因为我不知道后端人员懂不懂这个。）
比如
```javascript
(function(){
    //我是模块1
    //这里可以写片段的业务逻辑
})();
```

关于事件系统
----

为了代码的简洁，我使用了一个事件系统，index.js内的事件定义都写了相关注释。
* `Events.subscribe(eventName,callback)` 用于定义事件，第一个参数为事件名称，第二个参数是回调方法。
* `Events.notify(eventName,args...)` 用于触发事件，第一个参数为事件名称，后面是可变长度参数（都会传递到subscribe的callback中去）。
* 公告弹出
```javascript
Events.notify('open-notice','重要公告','为贯彻落实《国务院关于积极推进“互联网+”行动的指导意见》《国务院关于加快推……','http://www.baidu.com');
```
* 公告关闭
```javascript
Events.notify('close-notice' );
```

