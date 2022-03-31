const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');

function task_default(cb){
    console.log('gulp ok');
    cb();
}

exports.default = task_default;

//A 任務
function task_a(cb){
    console.log('a mission');
    cb();
}

//B 任務
function task_b(cb){
    console.log('b mission');
    cb();
}

//有先後順序地去執行完任務
exports.async = series(task_a, task_b);
//同時執行
exports.sync = parallel(task_a, task_b);

//搬檔案
function package(){
    return src('src/style.css').pipe(dest('dist'))
}

exports.p = package;

//rename
const rename = require('gulp-rename');

// css minify
const cleanCSS = require('gulp-clean-css');

function minicss(){
    return src('src/*.css')
    .pipe(cleanCSS())
    .pipe(rename({
        extname: '.min.css' //修改副檔名
        // prefix: 'web-',  //前綴字
        // suffix: '-min',  //後綴字
        // basename: 'all'  //更名
    }))
    .pipe(dest('dist')) //*.css 所有css檔 打包到dist資料夾裡
}

exports.c = minicss;

//js minify
const uglify = require ('gulp-uglify');

function minijs(){
    return src('src/js/*.js')
    .pipe(uglify())
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(dest('dist/js'));
}

exports.ugjs = minijs;

//整合所有檔案
const concat = require('gulp-concat');

function concatall_css(){
    return src('src/*.css')
    .pipe(concat('all.css'))
    .pipe(cleanCSS())
    .pipe(dest('dist/css'));
}

exports.allcss = concatall_css;

//saaa 編譯
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

function sassstyle() {
    return src('./src/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        // .pipe(cleanCSS()) //minify css
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(dest('./dist/css'));
}

exports.s = sassstyle;

//合併html

const fileinclude = require('gulp-file-include');

function includeHTML(){
    return src('src/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src'
        }))
        .pipe(dest('./dist'));
}

exports.html = includeHTML;

function watchall(){
    watch(['src/*.html', 'src/layout/*.html'], includeHTML);
    watch(['src/sass/*.scss', 'src/sass/**/*.scss'], sassstyle); //sass底下所有資料夾的所有scss
    watch('src/js/*.js', minijs);
}

exports.w = watchall;

// 清除舊檔案
const clean = require('gulp-clean');

function clear() {
  return src('dist' ,{ read: false ,allowEmpty: true })//不去讀檔案結構，增加刪除效率  / allowEmpty : 允許刪除空的檔案
  .pipe(clean({force: true})); //強制刪除檔案 
}

exports.cls = clear;

//瀏覽器同步
const browserSync = require('browser-sync');
const reload = browserSync.reload;


function browser(done) {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html"
        },
        port: 3000
    });

    watch(['src/*.html', 'src/layout/*.html'], includeHTML).on('change', reload);
    watch(['src/sass/*.scss', 'src/sass/**/*.scss'], sassstyle).on('change', reload); //sass底下所有資料夾的所有scss
    watch('src/js/*.js', minijs).on('change', reload);
    done();
}

//解決跨瀏覽器問題

function auto_css(){
    return src('src/css/main.css')
    .pipe(autoprefixer({
        cascade: false
    })).pipe(dest('dist'));
}

exports.autoprefix = auto_css


// 圖片壓縮
const imagemin = require('gulp-imagemin');

function min_images(){
    return src('src/img/*.*')
    .pipe(imagemin([
        imagemin.mozjpeg({quality: 60, progressive: true}) // 壓縮品質      quality越低 -> 壓縮越大 -> 品質越差 
    ]))
    .pipe(dest('dist/images'))
}

exports.mini_img = min_images;

// js 瀏覽器適應
const babel = require('gulp-babel');

function babel5() {
    return src('src/js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(dest('dist/js'));
}

exports.es5 = babel5;



//開發用
exports.default = series (clear,  parallel(includeHTML, sassstyle, minijs), browser);

//上線
exports.online = series(clear, parallel(includeHTML, sassstyle, babel5, min_images));
