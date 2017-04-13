/**
 * Created by Administrator on 2016/11/25.
 */
var count;
var newpage;//用于当前页
var pagenum;//用于保存总页数
var dataLength; //用于保存生成注册码单数量

function refreshApp(){
        $.ajax({
            type: 'post',
            url: "/refreshApp",
            async:false,//不异步（同步）
            data :{"name":"refreshApp"},
            success: function (data) {
               //用ajax在html中渲染数据
                    if (data[0] == null) {
                        console.log("没有获取到app数据");
                    }
                    console.log(data);
                    var dataLength = data.length;
                    for (var i=0;i<dataLength;i++)
                    {
                        var node = document.getElementById("app"+i);
                        if (node == null)
                        {
                            var header1 = document.getElementById("newApp");
                            var p = document.createElement("li"); // 创建一个元素节点
                            p.innerHTML= "<a href='App?id="+i+"'name='" + i + "' id=app" + i +">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class='glyphicon glyphicon-heart'></span>&nbsp;&nbsp;" + data[i] +"</a>";
                            insertAfter(p,header1); // 因为js没有直接追加到指定元素后面的方法 所以要自己创建一个方法
                            function insertAfter( newElement, targetElement ){ // newElement是要追加的元素 targetElement 是指定元素的位置
                                var parent = targetElement.parentNode; // 找到指定元素的父节点
                                if( parent.lastChild == targetElement ){ // 判断指定元素的是否是节点中的最后一个位置 如果是的话就直接使用appendChild方法
                                    parent.appendChild( newElement, targetElement );
                                }else{
                                    parent.insertBefore( newElement, targetElement.nextSibling );
                                }
                            }
                        }
                    }
            }
        });
}
function application(){

        $.ajax({
            type: 'post',
            url: "/refreshApp",
            async:false,//不异步（同步）
            data :{"name":"refreshApp"},
            success: function (data) {
                if (data[0] == null) {
                        console.log("没有获取到数据");
                    }
                console.log(data);
                var dataLength = data.length;
                //用ajax在html中渲染数据
                for (var i=0;i<dataLength;i++)
                {
                    var node = document.getElementById("appli"+i);
                    if (node == null)
                    {
                        var header1 = document.getElementById("application");
                        var p = document.createElement("option");// 创建一个元素节点
                        p.id = "appli"+i;
                        p.value = data[i];
                        document.body.appendChild(p);
                        p.innerHTML= data[i];
                        insertAfter(p,header1); // 因为js没有直接追加到指定元素后面的方法 所以要自己创建一个方法
                        function insertAfter( newElement, targetElement ){ // newElement是要追加的元素 targetElement 是指定元素的位置
                            var parent = targetElement.parentNode; // 找到指定元素的父节点
                            if( parent.lastChild == targetElement ){ // 判断指定元素的是否是节点中的最后一个位置 如果是的话就直接使用appendChild方法
                                parent.appendChild( newElement, targetElement );
                            }else{
                                parent.insertBefore( newElement, targetElement.nextSibling );
                            }
                        }
                    }
                }
            }
        });

}
function manKeys() {
        $.ajax({
            type: 'post',
            url: "/ajaxmanKeys",
            async:false,//不异步（同步）
            data :{"name":"ajaxmanKeys"},
            success: function (data) {
                //用ajax在html中渲染数据
                if (data[0] == null) {
                        console.log("没有获取到app数据");
                    }
                dataLength = data.length;
                
                pagenum = Math.ceil(dataLength/10);//向上取整 得到总页数
                if  (newpage == null)
                {
                    newpage = pagenum;
                }
                var findlist = (newpage - 1)*10;
                for (var i = findlist; i < findlist + 10; i++) {
                    var keyDate = [];
                    if(data[i] == null)
                    {
                        break;
                    }
                    keyDate = data[i].split("#");
                    if (keyDate[0] == "") {
                        return;
                    }
                    if (keyDate[2] == "9999") {
                        keyDate[2] = "永久";
                    }
                    if (keyDate[2] == "360") {
                        keyDate[2] = "360天";
                    }
                    if (keyDate[2] == "120") {
                        keyDate[2] = "120天";
                    }
                    if (keyDate[2] == "30") {
                        keyDate[2] = "30天";
                    }
                    if (keyDate[2] == "7") {
                        keyDate[2] = "7天";
                    }
                    var lookid = i;
                    pagenum = Math.ceil(keyDate[3] / 9); //总页数
                    var header1 = document.getElementById("manKeys");
                    var p = document.createElement("tr");// 创建一个元素节点
                    p.id = i;
                    document.body.appendChild(p);
                    p.innerHTML = "<td>" + keyDate[0] + "</td><td>" + keyDate[1] + "</td><td>" + keyDate[2] + "</td><td>" + keyDate[4] + "<td><td>" +
                        "<a href='lookKeys?id=lookid" + lookid + "'><button type='button' class='btn btn-info btn-xs' style='margin-left: -20px'>查看注册码</button>" +
                        "</a></td>";
                    insertAfter(p, header1); // 因为js没有直接追加到指定元素后面的方法 所以要自己创建一个方法
                }
                //自动生成页小标
                for (var j = pagenum; j > 0; j--) {
                    var header2 = document.getElementById("page");
                    var p2 = document.createElement("li");// 创建一个元素节点
                    p2.id = 'clpage' + j;
                    document.body.appendChild(p2);
                    var page = "id=page" + j;
                    p2.innerHTML = "<a href='#' style='font-weight: 700' onclick='clickId()'" + page + ">" + j + "</a>";
                    insertAfter(p2, header2);
                }
            }
        });

}
function lookKeys() {

        $.ajax({
            type: 'post',
            url: "/ajaxlookKeys",
            async:false,//不异步（同步）
            data :{"name":"ajaxlookKeys"},
            success: function (data) {
                if (data[0] == null) {
                        console.log("没有获取到app数据");
                    }
                for (var i = 0; i < 10; i++) {
                    var keyDate = [];
                    if(data[i] == null)
                    {
                        break;
                    }
                    keyDate = data[i].split("#");
                    var activateTime = keyDate[3];
                    if (keyDate[2] == '9999') {
                        keyDate[2] = "永久"
                    }
                    if (keyDate[3] == "true") {
                        keyDate[3] = "未使用"
                    } else {
                        keyDate[3] = "已使用-"+activateTime;
                    }
                    //用ajax在html中渲染数据
                    if (i != 100) {
                        var header1 = document.getElementById("lookKeys");
                        var p = document.createElement("tr"); // 创建一个元素节点
                        p.id = i;
                        document.body.appendChild(p);
                        p.innerHTML = "<td>" + keyDate[0] + "</td><td>" + keyDate[1] + "</td><td>" + keyDate[2] + "</td><td>" + keyDate[3] + "</td><td>" +
                            "<a href = 'http://tianc.date/deleteKey?deletekey="+keyDate[1]+"' ><button type='submit' class='btn btn-info btn-xs' style='margin-left: -28px'>删除</button>" +
                            "</a></td>";  //+applyName+keyType
                        insertAfter(p, header1); // 因为js没有直接追加到指定元素后面的方法 所以要自己创建一个方法
                    }
                }
            }
        });
    }

function insertAfter( newElement, targetElement ){ // newElement是要追加的元素 targetElement 是指定元素的位置
    var parent = targetElement.parentNode; // 找到指定元素的父节点
    if( parent.lastChild == targetElement ){ // 判断指定元素的是否是节点中的最后一个位置 如果是的话就直接使用appendChild方法
        parent.appendChild( newElement, targetElement );
    }else{
        parent.insertBefore( newElement, targetElement.nextSibling );
    }
}
function clickId() {
    var dataid=event.target.getAttribute('Id');
    dataid = dataid.slice(4,dataid.length);
    newpage = dataid;
    console.log("newpage:"+newpage);
    for (var i=pagenum;i>0;i--)
    {
        var node2 = document.getElementById("clpage"+i);
        if (node2 != null)
        {
            var  clpage= node2.parentNode;
            clpage.removeChild(node2);
        }
    }

    for (var i = 0 ;i< dataLength;i++)
    {
        var node = document.getElementById(i);
        if (node != null)
        {
            var parent = node.parentNode;
            parent.removeChild(node);
        }
    }
    manKeys();
}