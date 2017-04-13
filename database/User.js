/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-9-25
 * Time: 上午11:28
 * To change this template use File | Settings | File Templates.
 */
//引入数据库操作模块

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/oneline';
//声明User类
function User(user){
    this.name=user.name;
    this.password=user.password;
    this.qq = user.qq;
    this.email = user.email;
    this.mark = user.mark;
    this.keyNum = user.keyNum;
}
/**
 * 增加查询用户静态方法
 * @param username 用户名
 * @param callback
 */
User.find= function(username,callback){
   MongoClient.connect(url,function(err,db){
       console.log("连接user数据库成功");
        if(err){
            return callback(err);
        }
        db.collection("users",function(err,collection){
            if(err){
                // mongodb.close();
                return callback(err);
            }
            //查找name属性为usename的文档
            collection.findOne({name:username},function(err,doc){
                // mongodb.close();
                if(doc){
                    //封装文档为User对象
                    var user=new User(doc);
                    callback(err,user);
                }else{
                    callback(err,null);
                }
            })
        })
    })
}
//将User类给予接口
module.exports=User;
/**
 *使用原型增加保存方法
 * @param callback
 */
User.prototype.save=function save(callback){
    //存入mongodb的文档
    var user={
        name:this.name,
        password:this.password,
        qq : this.qq,
        email: this.email,
        mark: this.mark,
    };
    MongoClient.connect(url,function(err,db){
        if(err){
            return callback(err);
        }
        //读取users集合
        db.collection("users",function(err,collection){
            if(err){
                return callback(err);
            }
           //为name属性增加索引
            collection.ensureIndex("name",{unique:true});
            //写入User文档
            collection.insert(user,{safe:true},function(err){

                callback(err);
            })
        })
    })
};

User.update = function (name,mark,callback) {
    MongoClient.connect(url,function(err,db){
        if(err){
            return callback(err);
        }
        db.collection("users",function(err,collection){
            if(err){
                return callback(err);
            }
            console.log(name);
            collection.update({"name":name},{$push:{"mark":mark}},function(err){
                callback(err);
            })
        })
    })
};
User.findMark= function(username,callback){
    MongoClient.connect(url,function(err,db){
        if(err){
            return callback(err);
        }
        db.collection("users",function(err,collection){
            if(err){
                return callback(err);
            }
            //查找name属性为usename的文档
            collection.findOne({name:username},function(err,doc){
                if(doc){
                    //返回mark
                    var mark=new User(doc);
                    callback(err,mark);
                }else{
                    callback(err,null);
                }
            })
        })
    })
};

User.keyNum = function (name,num,callback) {
    MongoClient.connect(url,function(err,db){
        if(err){
            return callback(err);
        }
        db.collection("users",function(err,collection){
            if(err){
                return callback(err);
            }
            console.log(name);
            collection.update({"name":name},{$push:{"keyNum":num}},function(err){
                callback(err);
            })
        })
    })
};


