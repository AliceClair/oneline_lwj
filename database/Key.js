/**
 * Created by Administrator on 2016/12/11.
 */
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/oneline';
//声明Key类
function Key(key){
    this.userName=key.userName;  //作者名称
    this.applyName=key.applyName; //应用名称
    this.keyType= key.keyType; //注册码类型时间
    this.keyDate = key.keyDate; //注册码创建时间
    this.keyValue = key.keyValue; //注册码密钥体
    this.keyStart = key.keyStart; //注册码首次激活时间
    this.keyIMEI = key.keyIMEI; //设备身份识别
}

module.exports=Key;
Key.prototype.save=function save(callback){
    //存入mongodb的文档
    var key={
        userName:this.userName,
        applyName:this.applyName,
        keyType : this.keyType,
        keyDate: this.keyDate,
        keyValue: this.keyValue,
        keyStart : this.keyStart,
        keyIMEI:this.keyIMEI
    };
    MongoClient.connect(url,function(err,db){
        if(err){
            console.log("数据库错误1");
            return callback(err);
        }
        db.collection("key",function(err,collection){
            if(err){
                console.log("数据库错误2");
                
                return callback(err);
            }
            collection.ensureIndex("keyValue",{unique:true});
            collection.insert(key,{safe:true},function(err){
                
                callback('finish');
            });
        })
    })
};
Key.findKeys= function(keydate,callback){
    MongoClient.connect(url,function(err,db){
        if(err){
            return callback(err);
        }
        db.collection("key",function(err,collection){
            if(err){
                
                return callback(err);
            }
            collection.find({keyDate:keydate}).toArray(function(err,keyarr) {
                if (err) throw  err;
                else {
                  callback(err,keyarr);
                }
            });
        })
    })
};
Key.findNameValue = function (username,keyvalue,callback) {
    MongoClient.connect(url,function(err,db){
        if(err){
            return callback(err);
        }
        db.collection("key",function(err,collection){
            if(err){
                return callback(err);
            }
            collection.find({userName:username,keyValue:keyvalue}).toArray(function(err,doc) {
                if (err) throw  err;
                else if(!doc[0]){
                    var key= "[]"
                    callback(err,key);
                }else if(doc[0]){
                    var key=new Key(doc[0]);
                    callback(err,key);
                }
            });
        })
    })
}
Key.updateStart = function (parma1,parma2,callback) {
    MongoClient.connect(url,function(err,db){
        if(err){
            return callback(err);
        }
        db.collection("key",function(err,collection){
            if(err){
                return callback(err);
            }
            collection.update({'keyValue':parma1},{$set:{'keyStart':parma2}},{safe:true},function(err,result){
                console.log("key查找完成");
            });
        })
    })
}

Key.updateIMEI = function (parma1,parma2,callback) {
    MongoClient.connect(url,function(err,db){
        if(err){
            return callback(err);
        }
        db.collection("key",function(err,collection){
            if(err){
                return callback(err);
            }
            collection.update({'keyValue':parma1},{$set:{'keyIMEI':parma2}},{safe:true},function(err,result){
                console.log("key查找完成");
            });
        })
    })
}

Key.deKey = function (dkey,callback) {
    MongoClient.connect(url,function(err,db){
        if(err){
            return callback(err);
        }
        db.collection("key",function(err,collection){
            if(err){
                return callback(err);
            }
            collection.update({'keyValue':dkey},{$set:{'keyStart':"已删除"}},{safe:true},function(err,result){
                console.log("key删除完成");
            });
        })
    })
}