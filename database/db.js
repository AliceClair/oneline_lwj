/**
 * Created by Administrator on 2016/11/30.
 */
//引入连接配置的模块
var settings=require("../settings");
//得到db对象
var Db=require("mongodb").Db;
//得到连接对象
//var MongoClient = require('mongodb').MongoClient;
var Connection=require("mongodb").Connection;
//得到服务对象
var Server=require("mongodb").Server;
//创建连接对象并暴露给你接口
module.exports=new Db(settings.db,new Server(settings.host,27017,{}));