var express=require('express')
var app = express()
var port = process.env.PORT || 3000
//http://www.expressjs.com.cn/guide/using-template-engines.html
//在 Express 中使用模板引擎
// 需要在应用中进行如下设置才能让 Express 渲染模板文件：
// views, 放模板文件的目录，比如： app.set('views', './views')
// view engine, 模板引擎，比如： app.set('view engine', 'jade')
app.set('views','./views/pages')
app.set('view engine','jade')
app.listen(port)

console.log("server running at 3000")

app.get('/',function(req,res){
     res.render('index',{title:'imooc 首页'})
})

app.get('/movie/:id',function(req,res){
     res.render('detail',{title:'imooc 详情页'})
})

app.get('/admin/movie',function(req,res){
     res.render('admin',{title:'imooc 后台管理页'})
})

app.get('/admin/list',function(req,res){
     res.render('list',{title:'imooc 列表页'})
})