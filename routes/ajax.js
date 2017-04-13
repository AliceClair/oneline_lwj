/**
 * Created by Administrator on 2016/12/5.
 */
var Apply = require("../database/Apply");
var User = require("../database/User");
var Key = require("../database/Key");
var async = require("async");

exports.refreshApp = function(req,res){
    if ( req.session.userName == null) {
        console.log(" refreshApp " + req.session.userName);
        res.send(null);
        return null;
    }
        User.findMark(req.session.userName,function(err,user){
            async.map(user.mark,function(item, callback) {
                    Apply.findMark(item,function (err,apply) {
                        callback(null,apply.applyName);
                    });
            //callback(null,arrApplyname);
        },function(err, results) {
                console.log(results);
                res.send(results);
            });
    });
};
exports.ajaxmanKeys = function(req,res){
    // var applyName,keyType;
    if ( req.session.userName == null) {
        console.log(" ajaxmanKeys " + req.session.userName);
        res.send(null);
        return null;
    }
    if (req.session.userName == null) {
        console.log("查看应用详细信息err"+req.session.userName);
        return res.redirect("/");
    }
    User.find(req.session.userName,function(err,user){
        async.map(user.keyNum,function(item, callback) {
            Key.findKeys(item,function(err,keyarr){
                var keyDate = item + '#' + keyarr[0].applyName + '#' + keyarr[0].keyType+'#'+user.keyNum.length+'#'+keyarr.length;
                callback(null,keyDate);
            });
        },function(err, results) {
            console.log(results);
            res.send(results);
        });
    });
};

exports.ajaxlookKeys = function(req,res){

    var keyDatearr = new Array();
    var lookkeyNum = req.session.lookkeyNum;
    if ( req.session.userName == null) {
        console.log(" ajaxlookKeys " + req.session.userName);
        res.send(null);
        return null;
    }
    User.find(req.session.userName,function(err,user){
        if(user.keyNum[0] == null){
            res.send(null);
            return null;
        }
        if(user)
        {
            var num = parseInt(lookkeyNum);
            Key.findKeys(user.keyNum[num],function(err,keyarr){
                console.log(num);
                console.log(keyarr);
                async.map(keyarr,function(item, callback) {
                    var keyDate = item.applyName + '#' + item.keyValue+'#'+item.keyType+'#'+item.keyStart;
                    callback(null,keyDate);
                },function(err, results) {
                    console.log(results);
                    res.send(results);
                });
            });
        }
    });
};