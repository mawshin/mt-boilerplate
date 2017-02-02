var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefix = require('gulp-autoprefixer');
var cssmin = require('gulp-clean-css');
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
// var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var reporter = require('postcss-reporter');
var syntax_scss = require('postcss-scss');
var stylelint = require('stylelint');
var newer = require('gulp-newer');
var del = require('del');
var path = require('path');
// var cache = require('gulp-cache');
var merge = require('merge-stream');

/**
 * Launch the Server
 */
gulp.task('browser-sync', ['sync'], function () {
    browserSync.init(null, {
        // Change as required
        port: 8080,
        proxy: "192.165.1.103/projects/dbr-resistance/MODULE_2017_PRESENTATION/MODULE_2017_MAIN/",
        socket: {
        	// For local development only use the default BrowserSync local URL.
        	// domain: 'localhost:3000',
        	// For external development (e.g on a mobile or tablet) use an external URL.
        	// You will need to update this to whatever BS tells you is the external URL when you run Gulp.
        	domain: '192.165.1.103:8080'
        }
    });
});

/**
 * Compile files from scss after lint
 */
gulp.task("scss-lint", function() {
  
  /**
   * SCSS stylelint
   * refer to article "http://www.creativenightly.com/2016/02/How-to-lint-your-css-with-stylelint/"
   * https://gist.github.com/KingScooty/fa4aab7852dd30feb573#file-gulpfile-js
   */

  // Stylelint config rules
    var stylelintConfig = {
        "rules": {
            "block-no-empty": true,
            "color-no-invalid-hex": true,
            "declaration-colon-space-after": "always",
            "declaration-colon-space-before": "never",
            "function-comma-space-after": "always",
            "function-url-quotes": "always",
            "media-feature-colon-space-after": "always",
            "media-feature-colon-space-before": "never",
            "media-feature-name-no-vendor-prefix": true,
            "max-empty-lines": 5,
            // "number-leading-zero": "never",
            "number-no-trailing-zeros": true,
            "property-no-vendor-prefix": true,
            // "declaration-block-no-duplicate-properties": true,
            "block-no-single-line": true,
            "declaration-block-trailing-semicolon": "always",
            "selector-list-comma-space-before": "never",
            // "selector-list-comma-newline-after": "always",
            // "selector-no-id": true,
            "string-quotes": "double",
            "value-no-vendor-prefix": true
        }
    }

    var processors = [
        stylelint(stylelintConfig),
        reporter({
            clearMessages: true,
            throwError: true
        })
    ];

    gulp.src(
    ['app/assets/sass/*.scss', 'app/assets/sass/**/*.scss',
    // Ignore linting vendor assets
    // Useful if you have bower components
    '!app/assets/sass/_settings.scss', '!app/assets/sass/_base.scss', '!app/assets/sass/lib/*.scss']
    )
    .pipe(postcss(processors, {syntax: syntax_scss}));
});

/**
 * Compile files from scss
 */
gulp.task('css-concat', ['sass'], function () {
    gulp.src(['app/assets/css/bootstrap.min.css', 'app/assets/css/styles.css'])
        .pipe(concat('presentation.css'))
        .pipe(gulp.dest('app/assets/css/'));
});

gulp.task('sass', function () {
    var scssStream,
    cssStream;

    scssStream = gulp.src(['app/assets/sass/styles.scss'])
        .pipe(sass({
        includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest('app/assets/shared/css/'));

    cssStream = gulp.src(['app/assets/shared/css/bootstrap.min.css']);

    return merge(scssStream, cssStream)
    .pipe(concat('presentation.css'))
    .pipe(sourcemaps.init())
    // .pipe(cssmin({compatibility: 'ie8'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/assets/shared/css/'));
});

gulp.task('sass-prod', function () {
	return gulp.src(['app/assets/sass/styles.scss'])
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: ['scss']
		}))
		.pipe(sourcemaps.write())
	    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
	    .pipe(cssmin({compatibility: 'ie8'}))
		.pipe(gulp.dest('MODULE_2017_PRESENTATION/MODULE_2017_MAIN/shared/css/'));
});

/**
 * Minify custom js scripts
 */
gulp.task('scripts', function () {
	return gulp.src(['app/assets/shared/js/lib/bootstrap.min.js', 'app/assets/shared/js/lib/TweenMax.min.js', 'app/assets/shared/js/lib/hammer.min.js', 'app/assets/shared/js/lib/jquery.hammer.js', 'app/assets/shared/js/init.js'])
		.pipe(concat('presentation.js'))
		.pipe(gulp.dest('app/assets/shared/js/'));
});

gulp.task('scripts-prod', function () {
	return gulp.src('app/assets/js/app.min.js')
		.pipe(uglify())
		//.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('MODULE_2017_PRESENTATION/MODULE_2017_MAIN/shared/js/app.min.js'));
});

/**
 * Reload page when views change
 */
gulp.task('views', function () {
	browserSync.reload();
	console.log('Refresh');
});

/**
 * Copies templates and assets from external modules and dirs
 */
gulp.task('copy-files', function() {  
    gulp.src(['app/assets/**/*', '!app/assets/{sass,sass/**}'])
        .pipe(gulp.dest('MODULE_2017_PRESENTATION/MODULE_2017_MAIN/'));
});

gulp.task('sync', function() {
	gulp.src(['app/assets/**/*', '!app/assets/{sass,sass/**}', '!app/assets/shared/js/{init.js}', '!app/assets/shared/js/{init.js,lib/**}'])
		.pipe(newer('MODULE_2017_PRESENTATION/MODULE_2017_MAIN/'))
		.pipe(gulp.dest('MODULE_2017_PRESENTATION/MODULE_2017_MAIN/'))
		.pipe(browserSync.reload({stream: true}));
		//console.log('Copy Done');
});

/*gulp.task('cache:clear', function (callback) {
	return cache.clearAll(callback)
});*/

/**
 * Watch scss files for changes & recompile
 * Watch views folder for changes and reload BrowserSync
 */
gulp.task('watch', function () {
	gulp.watch(['app/assets/sass/*.scss', 'app/sass/**/*.scss'], ['scss-lint', 'sass']);
    gulp.watch(['app/assets/shared/js/**/*'], ['scripts']);
	//gulp.watch(['app/assets/js/app.min.js'], ['sync']);
	gulp.watch(['app/assets/images/*', 'app/assets/images/**/*'], ['sync']);
	//gulp.watch(['app/assets/*.html'], ['views']);
	//gulp.watch(['app/assets/**/*', '!app/assets/{sass,sass/**}'], ['sync']);

	var watcher = gulp.watch(['app/assets/**/*', 'app/assets/**/js/*', '!app/assets/{sass,sass/**}', '!app/assets/shared/css/presentation.css', '!app/assets/shared/css/presentation.css.map', '!app/assets/shared/js/init.js'], ['sync']);
	watcher.on('change', function(ev) {
        if(ev.type === 'deleted') {
         	/**
         	 * Sync up deleted files between 2 folder on harddisk
         	 * refer to article "https://fettblog.eu/gulp-recipes-part-2/#sync-directories-on-your-harddisk"
         	 */
         	
         	//console.log('file deleted');
         	//console.log(path.relative('./', ev.path).replace('app\\assets\\','public\\'));
 			del(path.relative('./', ev.path).replace('app\\assets\\','MODULE_2017_PRESENTATION\\MODULE_2017_MAIN\\'));
        }
    });
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the scripts, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
gulp.task('firstcopy', ['copy-files']);
gulp.task('build', ['sass-prod', 'scripts-prod']);