var express = require('express')
    ,http = require('http')
    ,path = require('path')
    ,routes = require('./routes')
    ,ajax = require('./routes/ajax')
    ,api = require('./routes/api')
    ,settings = require('./settings')
    ,cookieParser = require('cookie-parser')
    , session=require("express-session")
    , MongoStore = require('connect-mongo')(session);
var app = express();


app.set('port',process.env.PORT || 3000);//指定程序端口的方式
//设置handlebars视图引擎
var handlebars = require('express3-handlebars')
    .create({defaultLayout: null});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

//添加static中间件
app.use(express.static(path.join(__dirname, '/public')));
app.use(require('body-parser')());//引入中间件body-parser来解析URL编码体

app.use(cookieParser());//使用cookie中间件
//会话中间件，存放在mongodb中
app.use(session({
    secret:settings.cookieSecret, // 建议使用 128 个字符的随机字符串
    store:new MongoStore({
        db:settings.db,
        host: settings.host,
        url: 'mongodb://localhost/oneline'
    })
}));

// //使用中间件来返回成功和失败的信息
app.use(function(req, res, next){
    //声明变量
    var err = req.session.error
        , msg = req.session.success
        ,userName = req.session.userName
        // ,mark = req.session.mark
         ,applyAppName = req.session.applyAppName
        ,applyName = req.session.applyName
        ,existApp = req.session.existApp;
    //删除会话中原有属性
    delete req.session.error;
    delete req.session.success;
    // delete req.session.applyAppName;
    // delete req.session.mark;
    // delete req.session.applyName;
    // delete req.session.existApp;

    //将错误和正确信息存放到动态试图助手变量中。
    res.locals.message = '';
    res.locals.userName='';
    res.locals.mark = '';
    res.locals.applyName = '';
    res.locals.existApp = '';
    res.locals.applyAppName = '';
    if (err) res.locals.message = '<div class="container" style="width: 300px; font-size: 28px; color: darkred;">' + err + '</div>';
    if (msg) res.locals.message = '<div class="alert alert-success">' + msg + '</div>';
    if (userName) res.locals.userName = userName;
    if (applyName) res.locals.applyName ='<li><a href="App">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-heart"></span>&nbsp;&nbsp;' + applyName + '</a></li>' ;
    if(existApp) res.locals.existApp = '<h4>' + existApp + '</h4>';
    if (applyAppName) res.locals.applyAppName = applyAppName;
    // if (mark) res.locals.mark = mark;

    next();
});
//使用中间件把user设置成动态视图助手
// app.use(function(req, res, next){
//     res.locals({
//         user:req.session.user
//     })
//     next();
// })


//用户注册页
// app.get('/register',function (req,res) {
//     res.render('register');
// });
//制定路由

app.get('/',routes.index);//登录页面
app.get('/loginregister',routes.reg); //首页注册按钮
app.get('/register',routes.butttonReg);//注册页刷新
app.post('/register',routes.doReg);//注册页注册按钮
app.get('/forgetPsd',routes.forgetPsdw);//不携带数据的跳转至忘记密码页面
app.post('/forgetPsd',routes.forgetPsd);//携带数据的跳转至忘记密码页面
app.get('/account',routes.login);//用户登录
app.post('/account',routes.doLogin);//登录成功后跳转至账户信息页
app.get('/changePsd',routes.changePsd);//不携带数据的跳转至修改密码页面
app.post('/changePsd',routes.changePsd);//进入修改密码页面
app.get('/newApp',routes.newApp);//进入创建应用页
app.post('/newApp',routes.donewApp);//创建应用页
app.get('/App',routes.App);//应用页
app.get('/newKeys',routes.newKeys);//注册码生成页
app.get('/addKey',routes.addKey);//创建注册码按钮，并跳转到注册码管理页面
app.get('/manKeys',routes.manKeys);//注册码管理页
app.get('/lookKeys',routes.lookKeys);//查看注册码页
app.get('/logout',routes.logout);//退出登入
app.get('/deleteKey',routes.deleteKey); //删除注册码
app.post('/refreshApp',ajax.refreshApp);//使用Ajax方法渲染模板页
app.post('/ajaxmanKeys',ajax.ajaxmanKeys);//使用Ajax方法渲染管理注册码页面
app.post('/ajaxlookKeys',ajax.ajaxlookKeys);//使用Ajax方法渲染查看注册码页面


app.get('/api',api.api);//api 注册使用验证码

// //定制404页面
// app.use(function (req,res) {
//     res.status(404);
//     res.render('404');
// });
//
// //定制500页面
// app.use(function (err,req,res,next) {
//     console.error(err.stack);
//     res.status(500);
//     res.render('500');
// });

app.listen(app.get('port'),function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

