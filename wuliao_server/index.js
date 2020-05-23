const Koa = require('koa2');
const app = new Koa();
const koaBody = require('koa-body');

const cors = require('koa-cors');



var bodyParser = require('koa-bodyparser');

const router = require("./router/router")

const static = require('koa-static');


app.use(koaBody({
    multipart: true , 
    formidable: {
        maxFileSize: 1024 * 1024 * 200 
    }
}))

app.use(cors());


app.use(bodyParser());


app.use(router.routes())
app.use(router.allowedMethods());

console.log(__dirname)
app.use(static(__dirname + '/static'));

console.log("server is running on 3000....")

app.listen(3000);

