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

function sassstyle() {
    return src('./src/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(cleanCSS()) //minify css
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