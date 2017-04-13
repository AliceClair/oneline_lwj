/**
 * Created by Administrator on 2016/12/3.
 */
//引入数据库操作模块
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/oneline';
//声明应用Apply类
function Apply(apply) {
    this.name = apply.name;
    this.applyName = apply.applyName;
    this.mark = apply.mark;
}

//查找mark 找到就将Apply返回
Apply.findMark= function(marknumber,callback){
    MongoClient.connect(url,function(err,db){
        if(err){
             
            return callback(err);
        }
        db.collection("apply",function(err,collection){
            if(err){
                 
                return callback(err);
            }
            //查找mark属性为marknumber的文档
            collection.findOne({mark:marknumber},function(err,doc){
                 
                if(doc){
                    var apply = new Apply(doc);
                    callback(err,apply);
                }else{
                     
                    callback(err,null);
                }
            })
        })
    })
};
//将Apply类给予接口
module.exports = Apply;
/**
 *使用原型增加保存方法
 * @param callback
 */
Apply.prototype.save=function save(callback){
    //存入mongodb的文档
    var apply={
        name:this.name,
        applyName:this.applyName,
        mark : this.mark
    };
    MongoClient.connect(url,function(err,db){
        if(err){
            return callback(err);
        }
        //读取apply集合
        db.collection("apply",function(err,collection){
            if(err){
                 
                return callback(err);
            }
            //为mark属性增加索引
            collection.ensureIndex("mark",{unique:true});
            //写入Apply文档
            collection.insert(apply,{safe:true},function(err){
                 
                callback(err);
            })
        })
    })
};

//寻找applyName,找到就返回空
Apply.findapplyName= function(name,callback){

    MongoClient.connect(url,function(err,db){
        if(err){
            return callback(err);
        }
        db.collection("apply",function(err,collection){
            if(err){
                 
                return callback(err);
            }
            //查找name
            collection.findOne({name:name},function(err,doc){
                 
                if(doc){
                    var applyName = new Apply(doc);
                    callback(err,applyName);
                }else{
                    callback(err,null);

                }
            })
        })
    })
};