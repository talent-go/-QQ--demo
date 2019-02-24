var gulp = require("gulp");

// 压缩html
// gulp 中插件应用  下载插件--> 取到插件 --> 应用插件

// 压缩html文件的插件
var htmlClean = require("gulp-htmlclean");

// 压缩图片的插件
var imageMin = require("gulp-imagemin");

// 压缩js文件的插件
var uglify = require("gulp-uglify");

//  去掉js中的调试语句
var debug = require("gulp-strip-debug");

// 将less装换成css
var less = require("gulp-less");

// 压缩css
var cleanCss = require("gulp-clean-css");

// postcss  autoprefixer  css3属性前面加前缀
var postCss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");

// 开启服务器
var connect = require("gulp-connect");

var folder = {
    src:'src/',
    dist:'dist/'

}

// 在git中通过命令 $ export NODE_ENV=develpoment 设置为开发环境
// 判断当前环境变量
var devMod = process.env.NODE_ENV == 'development';

gulp.task("html",function(){
    var page = gulp.src(folder.src + "html/*")
        .pipe(connect.reload());
        if(!devMod){
            page.pipe(htmlClean())
        }
        page.pipe(gulp.dest(folder.dist + "html/"))
})

gulp.task("css",function(){
    var page = gulp.src(folder.src + "css/*")
        .pipe(connect.reload())
        .pipe(less())
        .pipe(postCss([autoprefixer()]));
        if(!devMod){
            page.pipe(cleanCss())
        }
        page.pipe(gulp.dest(folder.dist + "css/"))
})

gulp.task("js",function(){
    var page = gulp.src(folder.src + "js/*")
        .pipe(connect.reload());
        if(!devMod){
            page.pipe(debug())
            .pipe(uglify())
        }
        page.pipe(gulp.dest(folder.dist + "js/"))
})

gulp.task("image",function(){
    gulp.src(folder.src + "image/*")
        .pipe(imageMin())
        .pipe(gulp.dest(folder.dist + "image/"))
})

// 开启监听  监听文件变化后，自动执行后面的任务
gulp.task("watch",function(){
    gulp.watch(folder.src + "html/*",["html"]);
    gulp.watch(folder.src + "css/*",["css"]);
    gulp.watch(folder.src + "js/*",["js"]);
})


gulp.task("server",function(){
    connect.server({
        port:"8888",
        livereload:true,
    })
})



gulp.task('default',["html","css","js","image","server","watch"])

// less --> 自动添加css3前缀 --> 压缩 --> css文件

// gulp.src()
// gulp.watch()
// gulp.task()
// gulp.dest()

// runner Task
// module bundle