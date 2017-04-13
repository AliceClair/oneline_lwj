/**
 * Created by Administrator on 2016/11/30.
 */

// var express = require('express');
// var router = express.Router();
var crypto=require("crypto");
var User=require("../database/User");
var Post=require("../database/post");
var Apply = require("../database/Apply");
var Key = require("../database/Key");
var async = require("async");
var url = require("url");
var reqtime = require("silly-datetime");
var resultApply;

//首页get
exports.index = function (req,res) {
    res.render('login',{ layout: null});
};


/**
 * 首页跳转注册页面get
 */
exports.reg=function(req,res){
    res.render('register');
};
//注册页get方法
exports.butttonReg=function(req,res){
    res.render("account", {layout: 'layout'});
};

/**
 * 注册操作post
 */
exports.doReg=function(req,res){
    //声明需要添加的用户
    var newUser=new User({
        name:req.body.username,
        password: req.body.password,
        qq : req.body.qq,
        email: req.body.email,
        mark: []
    });
    User.find(newUser.name,function(err,user){
        //如果用户已经存在
        if(user){
            req.session.error="该用户已经存在";
            console.log("该用户已经存在");
            return res.redirect("/loginregister");
        }
        //如果不存在则添加用户
        newUser.save(function(err){
            if(err){
                 req.session.error=err;
                return res.redirect("/loginregister");
            }
            req.session.userName=req.body.username;
            req.session.success="注册成功";
            console.log('注册成功');
            res.render("account", {layout: 'layout'});
        })
    })
};

// get方法账号页面
exports.login=function(req,res){
    res.render('account', {layout: 'layout' });
};
/* 账户信息页面--account post*/
exports.doLogin=function(req,res){
    //将登录的密码转成md5形式

    var md5=crypto.createHash("md5");
    var password=md5.update(req.body.Password).digest("base64");
    //验证用户
    User.find(req.body.userName,function(err,user){
        //首先根据用户名查询是否存在

        if(!user){
            req.session.error="用户不存在";
            return res.redirect("/");
        }
        //验证密码是否正确
        if(user.password!=req.body.Password){
            req.session.error="密码错误";
            return res.redirect("/")
        }
            
            req.session.userName = req.body.userName;
            console.log('欢迎用户:'+req.session.userName);

            res.render("account", {layout: 'layout',userName:req.session.userName});
    })
};

exports.newApp = function (req,res) {
        res.render('newApp',{ layout: 'layout'});
};

exports.donewApp = function (req,res) {
    if ( req.session.userName == null) {
        console.log(" donewApp创建应用err " + req.session.userName);
        return res.redirect("/")
    }
    User.find(req.session.userName,function(err,user){
        if(user)
        {
            console.log("this is length:"+user.mark.length);
            if (user.mark.length >= 9) //判断应用数量
            {
                res.render("newApp", {layout: 'layout',lengtherr:"最多创建9个应用 请删除创建应用或者注册新的账号"});
            }
            else //应用小于9，开始创建应用
                {
                    console.log('开始生成mark');
                    //声明需要添加的应用集合
                    var newApply=new Apply({
                        name:req.session.userName,
                        applyName: req.body.newAppName,
                        mark : resultApply =  s20()   //调用生成20位随机数
                    });
                    console.log(newApply.applyName);
                    Apply.findapplyName(newApply.applyName,function(err,Name){
                        //如果应用已经存在
                        if(Name != null){
                            // req.session.error="该应用已经存在";
                            console.log('该应用已经存在');
                            req.session.existApp = "该应用已经存在!";
                            return res.render('newApp',{ layout: 'layout'});
                        }
                        // 如果不存在则添加应用
                        newApply.save(function(err){
                            if(err){
                                req.session.error = err;
                                console.log('错误2');
                                return  res.render('newApp',{ layout: 'layout'});
                            }
                            console.log(req.session.userName);
                            console.log(newApply.name);
                            User.update(req.session.userName,resultApply,function(err,user){
                                if(err){
                                    console.log('mark插入错误');
                                }
                            });
                            console.log('创建成功');
                            res.render('App',{ layout: 'layout',applyAppName:req.body.newAppName,mark:resultApply});
                        })
                    });
                }
        }
    });

};
exports.App = function (req,res) {
    console.log(url.parse(req.url,true).query.id);
    console.log(req.session.userName);
    if (req.session.userName == null) {
        console.log("查看应用详细信息err"+req.session.userName);
        return res.redirect("/");
    }
    User.findMark(req.session.userName,function(err,user) {
        console.log(user.mark[url.parse(req.url,true).query.id]);
        Apply.findMark(user.mark[url.parse(req.url,true).query.id],function (err,apply) {
            console.log(apply.applyName);
            req.session.applyAppName = apply.applyName;
            res.render('App',{ layout: 'layout',applyAppName:req.session.applyAppName,mark:user.mark[url.parse(req.url,true).query.id]});
        })
    });
};
exports.addKey = function (req,res) {
    var time=reqtime.format(new Date(), 'YYYYMMDDHHmmss');
    var keyStart = true;
    var keyIMEI = null;
    var number = req.query.selectnum;
    if(req.query.selectname == ""){
            console.log("selectname不能为空")
            return 0;
            }
    async.whilst(
        function () {
            return number > 0; },//验证成功继续，失败进回调
            
        function (saveDate) {
            var key=new Key({
                userName:req.session.userName,
                applyName: req.query.selectname,
                keyType : req.query.selecttype,
                keyDate: time,
                keyValue: sda20(),
                keyStart:keyStart,
                keyIMEI:keyIMEI
            });
            key.save(function(callback){
                if(callback)
                {
                    if (callback == 'finish')
                    {
                        number --;
                        saveDate();
                    }
                }
            });
        },
        function (err) {
            User.keyNum(req.session.userName,time,function(err,user){
                if(err){
                    console.log('mark插入错误');
                }
            });
            res.render('manKeys',{ layout: 'layout'});
        }
    );

};

exports.newKeys = function (req,res) {
    res.render('newKeys',{ layout: 'layout'});
};
exports.manKeys = function (req,res) {
    res.render('manKeys',{ layout: 'layout'});
};
//查看注册码
exports.lookKeys = function (req,res) {
    var lookkeyNum = url.parse(req.url,true).query.id;
    lookkeyNum = lookkeyNum.slice(6,lookkeyNum.length);
    req.session.lookkeyNum = lookkeyNum;
    res.render('lookKeys',{ layout: 'layout'});
};
//删除指定的key
exports.deleteKey = function (req,res) {
    var dkey = url.parse(req.url,true).query.deletekey;
    
    Key.deKey(dkey,function(err){
        if (err) {
            console.log("删除key失败")
        }
        
    });
    res.render('manKeys',{ layout: 'layout'});
    
}
exports.logout = function (req,res) {
    req.session.userName ="";
    res.redirect("/");
}

exports.changePsd = function(req,res){
    res.render('changePsd',{ layout: 'layout'});
}


// //生成20位随机字符串
function s20(){
    var data=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    var result="";
    for(var i=0;i<20;i++){
        var r=Math.floor(Math.random()*62);     //取得0-62间的随机数，目的是以此当下标取数组data里的值！
        result+=data[r];        //输出20次随机数的同时，让rrr加20次，就是20位的随机字符串了。
    }
    return result;
}
function sda20(){
    var data=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    var result="";
    for(var i=0;i<20;i++){
        var r=Math.floor(Math.random()*36);     //取得0-62间的随机数，目的是以此当下标取数组data里的值！
        result+=data[r];        //输出20次随机数的同时，让rrr加20次，就是20位的随机字符串了。
    }
    return result;
}

