var gulp = require("gulp"),
	htmlmin = require("gulp-htmlmin"),
	cssmin = require("gulp-clean-css"),
	cache = require("gulp-cache"),
	rev = require("gulp-rev-append"),
	autoprefixer = require("gulp-autoprefixer"),
	cssver = require("gulp-make-css-url-version"),
	uglify = require("gulp-uglify"),
	concat = require("gulp-concat"),
	imgmin = require("gulp-imagemin"),
	pngquant = require("imagemin-pngquant"),
	rename = require("gulp-rename")
	browsers = require("browser-sync").create();

gulp.task("jsmin",function (){

	gulp.src("src/js/*.js")
		.pipe(concat("all.js"))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest("dest/js"))
		.pipe(browsers.stream());
});

gulp.task("htmlmin",function (){

	gulp.src("./src/*.html")
		.pipe(rev())
		.pipe(htmlmin({
			removeComments : true,
			collapseWhitespace : true,
			collapseBooleanAttributes: true,
			removeEmptyAttributes: true,
			minifyJS: true,
			minifyCSS: true
		}))
		.pipe(gulp.dest("dest"));
});

gulp.task("imgmin",function (){

	gulp.src("src/img/**/*")
		.pipe(cache(imgmin({
			progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
		})))
		.pipe(gulp.dest("dest/img/"));
});

gulp.task("cssmin",function(){

	gulp.src("src/css/*.css")
		.pipe(cssver())
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'Android >= 4.0','safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6']
		}))
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest("dest/css"))
		.pipe(browsers.stream());
});

gulp.task("server",function (){

	browsers.init({
		server : {
			baseDir : "./dest"
		}
	});

	gulp.watch("src/css/*.css",["cssmin"]);
	gulp.watch("src/js/*.js", ["jsmin"]);
	gulp.watch("src/*.html",["htmlmin"]).on("change",browsers.reload);
});

gulp.task("default",["server"]);
