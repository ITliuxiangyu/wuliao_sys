

const mysql = require('mysql');

const config = require("../config/config")

const conn = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'wuliao'
});

conn.connect();


const fs = require("fs")



const Router = require('koa-router');
const router = new Router();










router.post("/upload" , function (ctx , next) {
    var file = ctx.request.files.myfile
    var file_data = file.path
    var cur_date = new Date()
    var cur_time = cur_date.getTime()
    var tmp_arr = file.name.split(".")
    var file_type = tmp_arr[tmp_arr.length - 1]
    var filename = cur_time + "." + file_type
    var rs = fs.createReadStream(file_data)
    var ws = fs.createWriteStream("./static/imgs/" + filename)
    rs.pipe(ws)

    ctx.body = `{"err": 0 , "img":"imgs/` + filename + `"}`
})





// 物料server

// 添加物料记录操作
router.post(config.path_home + "insert_log" , async (ctx , next)=>{
    var res_pro = new Promise((resolve , reject)=>{

        var id = new Date().getTime()
        var wuliao_id = ctx.request.body.wuliao_id
        var wuliao_name = ctx.request.body.wuliao_name
        var wuliao_num = ctx.request.body.wuliao_num
        var caozuo = ctx.request.body.caozuo
        var user_name = ctx.request.body.user_name
        var user_id = ctx.request.body.user_id

        var sql_str = "insert into wuliao_log (id , wuliao_id , wuliao_name , wuliao_num , caozuo , user_name , user_id) values ('" + id + "' , '" + wuliao_id + "' , '" + wuliao_name + "' , '" + wuliao_num + "' , '" + caozuo + "' , '" + user_name + "' , '" + user_id + "')"
        conn.query(sql_str, function (error, results, fields) {

            if (error) {
                reject(`{"err": 1 , "msg":"添加失败" , "info": "` + error + `"}`)
            } else {
                resolve(`{"err": 0 , "msg":"添加成功"}`)
            }
            
        });
    })
    ctx.body = await res_pro
})


// 添加物料
router.post(config.path_home + "insert_wuliao" , async (ctx , next)=>{
    console.log("我是插入路由")
    var res_pro = new Promise((resolve , reject)=>{

        var id = new Date().getTime()
        var name = ctx.request.body.name
        var num = ctx.request.body.num
        var img = ctx.request.body.img

        var caozuo = ctx.request.body.caozuo

        var user_name = ctx.request.body.user_name

        var user_id = ctx.request.body.user_id
    

        var sql_str = "insert into wuliao (id , name , num , img) values ('" + id + "' , '" + name + "' , '" + num + "' , '" + img + "')"
        conn.query(sql_str, function (error, results, fields) {

            if (error) {
                reject(`{"err": 1 , "msg":"添加失败" , "info": "` + error + `"}`)
            } else {

                var log_id = new Date().getTime()
                sql_str = `insert into wuliao_log (id , wuliao_id , wuliao_name , wuliao_num , caozuo , user_name , user_id) values ('` + log_id + `','` + id + `' , '` + name + ` ', '` + num + `' , '` + caozuo + `' , '` + user_name + ` ', '` + user_id + `')`
                conn.query(sql_str , function () {})

                resolve(`{"err": 0 , "msg":"添加成功" , "info":` + JSON.stringify({
                    id , 
                    name , 
                    num , 
                    img
                }) + `}`)
            }
            
        });
    })
    ctx.body = await res_pro
})

// 租用物料
router.post(config.path_home + "zuyong" , async (ctx , next)=>{
    var res_pro = new Promise((resolve , reject)=>{

        var id = new Date().getTime()
        var wuliao_id = ctx.request.body.wuliao_id
        var wuliao_name = ctx.request.body.wuliao_name
        var wuliao_num = ctx.request.body.wuliao_num
        var zu_num = ctx.request.body.zu_num
        console.log(zu_num)
        var log_id = ctx.request.body.log_id

        var caozuo = ctx.request.body.caozuo

        var user_name = ctx.request.body.user_name

        var user_id = ctx.request.body.user_id
    

        // var sql_str = "insert into user_log (id , user_name , user_id , wuliao_name , wuliao_id , num , caozuo) values ('" + id + "' , '" + user_name + "' , '" + user_id + "' , '" + wuliao_name + "', '" + wuliao_id + "','" + zu_num + "','" + caozuo + "')"
        var sql_str = `insert into wuliao_log (id , wuliao_id , wuliao_name , wuliao_num , caozuo , user_name , user_id) values ('` + id + `','` + wuliao_id + `' , '` + wuliao_name + ` ', '` + zu_num + `' , '` + caozuo + `' , '` + user_name + ` ', '` + user_id + `')`
        // console.log(sql_str)
        conn.query(sql_str, function (error, results, fields) {

            if (error) {
                reject(`{"err": 1 , "msg":"租用失败" , "info": "` + error + `"}`)
            } else {

                
                if (caozuo == "退租") {
                    sql_str = `update wuliao set num=cast(num as unsigned) + ` + (zu_num + "") + ` where id='` + wuliao_id + `'`
                } else if (caozuo == "租借") {
                    sql_str = `update wuliao set num=cast(num as unsigned) - ` + (zu_num + "") + ` where id='` + wuliao_id + `'`
                }

                console.log(sql_str)
                // sql_str = `update wuliao set num='` + res_num + `' where id='` + wuliao_id + `'`
                // console.log(sql_str)
                conn.query(sql_str , function () {})

                if (caozuo == "退租") {
                    sql_str = "update wuliao_log set caozuo = '已退租' where id = '" + log_id + "'"
                    conn.query(sql_str , function () {})
                }

                resolve(`{"err": 0 , "msg":"租用成功"}`)
            }
            
        });
    })
    ctx.body = await res_pro
})





// 修改用户信息
router.post(config.path_home + "modify_user" , async (ctx , next)=>{
    var res_pro = new Promise((resolve , reject)=>{

        var id = ctx.request.body.id
        var account = ctx.request.body.account
        var password = ctx.request.body.password
        var type = ctx.request.body.type

        var sql_str = "update user set account='" + account + "' , password='" + password + "' , type='" + type + "' where id='" + id + "'"
        conn.query(sql_str, function (error, results, fields) {

            if (error) {
                reject(`{"err": 1 , "msg":"修改失败" , "info": "` + error + `"}`)
            } else {
                resolve(`{"err": 0 , "msg":"修改成功"}`)
            }
            
        });
    })
    ctx.body = await res_pro
})







// 用户表
// 注册
router.post(config.path_home + "regist" , async (ctx , next)=>{
    var res_pro = new Promise((resolve , reject)=>{

        var id = new Date().getTime()

        var account = ctx.request.body.account
        var password = ctx.request.body.password
        var tel = ctx.request.body.tel
        var birthday = ctx.request.body.birthday
        var gender = ctx.request.body.gender
        var type = ctx.request.body.type
        var nick_name = ctx.request.body.nick_name

        var sql_str = "insert into user (id , account , password , type , gender , tel , birthday , nick_name) values ('" + id + "' , '" + account + "' , '" + password + "' , '" + type +  "' , '" + gender + "' , '" + tel + "' , '" + birthday + "' , '" + nick_name + "')"
        conn.query(sql_str, function (error, results, fields) {

            if (error) {
                reject(`{"err": 1 , "msg":"注册失败" , "info": "` + error + `"}`)
            } else {
                resolve(`{"err": 0 , "msg":"注册成功"}`)
            }
            
        });
    })
    ctx.body = await res_pro
})
// 登录
router.post(config.path_home + "login" , async (ctx , next)=>{
    var res_pro = new Promise((resolve , reject)=>{

        console.log(ctx.request.body)

        var account = ctx.request.body.account
        var password = ctx.request.body.password

        var sql_str = "select * from user where account='" + account + "' and password='" + password + "'"
        
        conn.query(sql_str, function (error, results, fields) {
            if (error) {
                reject(`{"err": 1 , "msg":"注册失败" , "info": "` + error + `"}`)
            } else {
                results = JSON.parse(JSON.stringify(results))
                if(results.length <= 0) {
                    resolve(`{"err": 2 , "msg":"登录失败" , "info":"用户名或密码出错"}`)
                } else {
                    resolve(`{"err": 0 , "msg":"登录成功" , "info":` + JSON.stringify(results[0]) + `}`)
                }
                
            }
            
        });
    })
    ctx.body = await res_pro
})




// 删除
router.post(config.path_home + "deleteInfo" , async (ctx , next)=>{
    var res_pro = new Promise((resolve , reject)=>{
        var table_name = ctx.request.body.table_name
        var id = ctx.request.body.id

        var sql_str = "delete from " + table_name + " where id='" + id + "'"
        conn.query(sql_str, function (error, results, fields) {

            if (error) {
                reject(`{"err": 1 , "msg":"删除失败" , "info": "` + error + `"}`)
            } else {
                resolve(`{"err": 0 , "msg":"删除成功"}`)
            }
            
        });
    })
    ctx.body = await res_pro
})
//  查询
router.post(config.path_home + "getInfo" , async (ctx , next)=>{
    var res_pro = new Promise((resolve , reject)=>{

        var table_name = ctx.request.body.table_name
        var id = ctx.request.body.id
        

        var sql_str = "select * from " + table_name

        if (id) {
            sql_str = "select * from " + table_name + " where id='" + id + "'"
        }
        
        conn.query(sql_str, function (error, results, fields) {

            if (error) {
                reject(`{"err": 1 , "msg":"查询失败" , "info": "` + error + `"}`)
            } else {
                resolve(`{"err": 0 , "msg":"查询成功" , "body":` + JSON.stringify(results) + `}`)
            }
            
        });
    })
    ctx.body = await res_pro
})


module.exports = router


































