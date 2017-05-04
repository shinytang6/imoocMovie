var express=require('express')
var app = express()
var path = require('path')
var mongoose = require('mongoose')
var Movie = require("./models/movie.js")
var port = process.env.PORT || 3000
var _ = require("underscore")
mongoose.connect('mongodb://localhost/imooc')

var bodyParser = require('body-parser');
 
app.use(bodyParser.json()); // for parsing application/json
 
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//http://www.expressjs.com.cn/guide/using-template-engines.html
//在 Express 中使用模板引擎
// 需要在应用中进行如下设置才能让 Express 渲染模板文件：
// views, 放模板文件的目录，比如： app.set('views', './views')
// view engine, 模板引擎，比如： app.set('view engine', 'jade')
app.set('views','./views/pages')   //视图的路径，即后面index,admin,list,detail的文件位置
app.set('view engine','jade')   //模板引擎
app.use(express.static(path.join(__dirname,'public')))  //静态文件的路径
app.locals.moment=require('moment')
app.listen(port)

console.log("server running at 3000")

app.get('/',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err)
         }
        res.render('index',{
          title:'imooc 首页',
          movies:movies
        })

    })

     
        //之前伪造的数据
      //    [
      //     { 
      //     	title:"机械战警",
      //     	_id:1,
      //     	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"

      //     },
      //     {
      //       title:"X战警",
      //     	_id:2,
      //     	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"
      //     },
      //     {
      //     	title:"皇家骑士",
      //     	_id:3,
      //     	poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5"

      //     }

     	// ]
       
})

app.get('/movie/:id',function(req,res){
     var id=req.params.id  //url中的id
     Movie.findById(id,function(err,movie){
     res.render('detail',{
        title:'imooc '+movie.title,
        movie:movie

      })
     })

     
          // [{
          //  doctor:'何塞.帕迪利亚',
          //  country:"美国",
          //  title:"机械战警",
          //  year:2014,
          //  poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5",
          //  language:"英语",
          //  flash:"http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf",
          //  summary:"《机械战警》是由何塞·帕迪里亚执导，乔尔·金纳曼、塞缪尔·杰克逊、加里·奥德曼等主演的一部科幻电影，改编自1987年保罗·范霍文执导的同名电影。影片于2014年2月12日在美国上映，2014年2月28日在中国大陆上映。影片的故事背景与原版基本相同，故事设定在2028年的底特律，男主角亚历克斯·墨菲是一名正直的警察，被坏人安装在车上的炸弹炸成重伤，为了救他，OmniCorp公司将他改造成了生化机器人“机器战警”，代表着美国司法的未来。"

          // }]


    
})

//admin update movie
app.get('/admin/update/:id',function(req,res){
   var id = req.params.id
   if(id){
      Movie.findById(id,function(err,movie){
        res.render('admin',{
            title:'imooc 后台更新页',
            movie:movie
        })
      })
   }

})




//admin post method
app.post('/admin/movie/new',function(req,res){
    var id = req.body.movie._id
    var movieObj = req.body.movie
    console.log("ha")
    var _movie =null
    if(id !== 'undefined'){
        Movie.findById(id,function(err,movie){
            if(err){
                console.log(err)
            }
            _movie=_.extend(movie,movieObj)
            _movie.save(function(err,movie){
                if (err) {
                    console.log(err)
                }

                res.redirect('/movie/'+movie._id)
            })
            
        })
    }

    else{
        _movie = new Movie({
              doctor:movieObj.doctor,
              title:movieObj.title,
              country:movieObj.country, 
              language:movieObj.language,
              year:movieObj.year,
              poster:movieObj.poster, 
              summary:movieObj.summary,
              flash:movieObj.flash      
        })
        _movie.save(function(err,movie){
                if (err) {
                    console.log(err)
                }

                res.redirect('/movie/'+movie._id)
            })
    }
})

app.get('/admin/movie',function(req,res){
     res.render('admin',{
        title:'imooc 后台管理页',
        movie:{
           title:"",
           doctor:"",
           country:"",
           year:"",
           poster:"",
           flash:"",
           summary:"",
           language:""
        }

    })
})

app.get('/admin/list',function(req,res){
      Movie.fetch(function(err,movies){
        if(err){
            console.log(err)
         }
        res.render('list',{
          title:'imooc 首页',
          movies:movies
        })

    })


    //  res.render('list',{
    //     title:'imooc 列表页',
    //     movies:[{
    //      title:"机械战警",
    //      _id:1,
    //      doctor:'何塞.帕迪利亚',
    //      country:"美国",
    //      year:2014,
    //      poster:"http://r3.ykimg.com/05160000530EEB63675839160D0B79D5",
    //      language:"英语",
    //      flash:"http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf",
    //      summary:"《机械战警》是由何塞·帕迪里亚执导，乔尔·金纳曼、塞缪尔·杰克逊、加里·奥德曼等主演的一部科幻电影，改编自1987年保罗·范霍文执导的同名电影。影片于2014年2月12日在美国上映，2014年2月28日在中国大陆上映。影片的故事背景与原版基本相同，故事设定在2028年的底特律，男主角亚历克斯·墨菲是一名正直的警察，被坏人安装在车上的炸弹炸成重伤，为了救他，OmniCorp公司将他改造成了生化机器人“机器战警”，代表着美国司法的未来。"

    //     }
    //     ]

    // })
})


// list delete movie data 列表页删除电影
app.delete('/admin/list', function (req, res) {
    var id = req.query.id;
    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: 1});
            }
        });
    }
});