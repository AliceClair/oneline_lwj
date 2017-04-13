/**
 * Created by Administrator on 2017/2/4.
 */
var Apply = require("../database/Apply");
var User = require("../database/User");
var Key = require("../database/Key");
var async = require("async");
var url = require("url");
var moment = require("moment");

exports.api = function (req,res) {
    var keyenter = url.parse(req.url,true).query.keyenter; //软件初始化时 将设备信息进行注册
    var keyverify = url.parse(req.url,true).query.keyverify;//软件使用时进行的验证
    var restime = url.parse(req.url,true).query.restime; //提供返回时间
    //http://127.0.0.1:3000/api?
    
    //keyenter=admin$8MZo66rzlMCn2zjsSAWZ$fuwanhao$20170322$Y5JUGN8FAKXUMF97AHDA
    //keyenter = 管理者账号、应用秘钥、使用设备机器码、网络时间、注册码
    if (restime == "1")
    {
        var ntime = moment().format("YYYYMMDD");
        console.log(ntime);
        return res.send(ntime);   
    }
    if (keyenter != null)
    {
        var enterarr = keyenter.split("$");
        var admin = enterarr[0];//管理者名称
        var applykey = enterarr[1];//应用秘钥
        var machinecode = enterarr[2];//使用设备机器码
        var networktime = enterarr[3];//网络时间
        var registracode = enterarr[4];//注册码
        var select = enterarr[5]; //功能选择 1代表可以换设备 0代表不能换设备
        console.log("enter<>"+admin+" "+applykey+" "+machinecode+" "+networktime+" "+registracode+" "+select);
        Key.findNameValue(admin,registracode,function(err,key){ //检查用户名、注册码
            if (key == "[]") {
                console.log("0 用户名或注册码不存在");
                return res.send("0 用户名或注册码不存在");
            }

            if (err){
                console.log("用户名 注册码验证失败");
                return res.send("-1 用户名或注册码验证失败");
            }

            
            if ( select == "1") {
                console.log("更新记录设备号");
                Key.updateIMEI(registracode,machinecode,function (err,key) {  // 更新设备码
                    if (err) {
                        console.log('设备码更新失败');
                        return res.send("-2 设备码更新失败");
                    }
                });
            }
            
            if (key.keyStart == true)   //查看keyStart激活状态，如果为true则为首次激活，同时记录首次激活时间
            {
                console.log("更新记录设备号");
                Key.updateIMEI(registracode,machinecode,function (err,key) {  // 更新设备码
                    if (err) {
                        console.log('设备码更新失败');
                        return res.send("-2 设备码更新失败");
                    }
                });
                Key.updateStart(registracode,networktime,function(err,key){ //首次注册 记录时间
                    if(err){
                        console.log('记录首次激活时间失败');
                        return res.send("-3 记录首次激活时间失败");
                    }
                });
                console.log("激活注册码 记录首次激活时间")
                return res.send("1 激活注册码 记录时间 记录设备号");
            }
            if (key.keyStart != true) //提示注册码时间
            {
                if (key.keyStart == "已删除")
                {
                    console.log("注册码已删除");
                    return res.send("-4 注册码已删除")
                }
                if (key.keyStart != "已删除" && select == "1")
                {
                    console.log("注册码已激活 开始时间:"+key.keyStart);
                    return res.send("2 更新设备号");   
                }
                if ( select == "0") {
                    console.log("3 绑定唯一设备 不更新注册码")
                    return res.send("3 绑定唯一设备 不更新注册码")
                }
            }
            
        })
    }

    //keyverify=admin$8MZo66rzlMCn2zjsSAWZ$fuwanhao$20170323$HKQJY35NN5HY6GPWXMBA
    if (keyverify != null)
    {
        var verifyarr = keyverify.split("$");
        var adminverify = verifyarr[0];//管理者名称
        var applyverify = verifyarr[1];//应用秘钥
        var machineverify = verifyarr[2];//使用设备机器码
        var timeverify = verifyarr[3];//当前时间
        var codeverify = verifyarr[4];//注册码
        console.log("verify<>"+adminverify+" "+applyverify+" "+machineverify+" "+timeverify+" "+codeverify);
        Key.findNameValue(adminverify,codeverify,function(err,key){
            if (key == "[]") {
                console.log("0 用户名或注册码不存在");
                return res.send("0 用户名或注册码不存在");
            }
            if (key.keyStart == "已删除")
            {
                console.log("注册码已删除");
                return res.send("-4 注册码已删除")
            }

            if (err) {
                console.log('用户名或注册码错误');
                return res.send("-3 用户名或注册码错误");
            }
            console.log("等待验证注册码");
            if (codeverify == key.keyValue) {
                console.log("注册码验证成功");
                if(machineverify == key.keyIMEI) {
                    console.log("机器码验证成功");
                    var endTime = moment(key.keyStart).add(key.keyType,'day').format("YYYYMMDD");  //计算结束时间
                    if (timeverify > endTime) //当前时间大于结束时间
                    {
                        console.log("验证时间 剩余时间0");
                        return res.send("-1 验证时间失败 剩余时间0");
                    }else if(timeverify <= endTime){
                        console.log("验证通过 结束时间:"+endTime);
                        console.log("keyStart:"+key.keyStart);
                        console.log("timeverify:"+timeverify);
                        console.log("结束时间:"+endTime);
                        return res.send("1 通过验证 结束时间:"+endTime);
                    }
                }else {
                    console.log("机器码验证失败");
                    return res.send("-2 机器码验证失败");
                }
            }
        })

    }
};