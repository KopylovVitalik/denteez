var gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  spritesmith = require('gulp.spritesmith'),
  sass = require('gulp-sass'),
  notify = require('gulp-notify'),
  sassGlob = require('gulp-sass-glob');
(autoprefixer = require('gulp-autoprefixer')),
  (cleanCSS = require('gulp-clean-css')),
  (csscomb = require('gulp-csscomb')),
  (rename = require('gulp-rename')),
  (browserSync = require('browser-sync')),
  (imagemin = require('gulp-imagemin')),
  (pngquant = require('imagemin-pngquant')),
  (concat = require('gulp-concat')),
  (uglify = require('gulp-uglify')),
  (reload = browserSync.reload);

gulp.task('sprite', function() {
  var spriteData = gulp.src(['src/images/icons/*.*']).pipe(
    spritesmith({
      imgName: 'sprite.png',
      cssName: '_sprite.scss',
      imgPath: '../img/sprite.png',
      cssFormat: 'scss',
      padding: 16
    })
  );
  var imgStream = spriteData.img.pipe(gulp.dest('build/images/'));
  var cssStream = spriteData.css.pipe(gulp.dest('src/sass/components/'));
  return imgStream, cssStream;
});

gulp.task('browserSync', function() {
  // Создаем таск browser-sync
  browserSync({
    // Выполняем browserSync
    server: {
      // Определяем параметры сервера
      baseDir: './', // Директория для сервера
      serveStaticOptions: {
        extensions: ['html']
      },
      directory: true
    },
    notify: false // Отключаем уведомления
  });
});

gulp.task('img', function() {
  return (
    gulp
      .src('src/images/**/*') // Берем все изображения из app
      // .pipe(cache(imagemin({ // С кешированием
      .pipe(
        imagemin({
          // Сжимаем изображения без кеширования
          interlaced: true,
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [pngquant()]
        })
      )
      .pipe(gulp.dest('build/images'))
  ); // Выгружаем на продакшен
});

gulp.task('sass', function() {
  return (
    gulp
      .src('src/sass/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sassGlob())
      .pipe(rename({ suffix: '.min', prefix: '' }))
      .pipe(autoprefixer(['last 5 versions'])) //подключаем Autoprefixer
      .pipe(csscomb())
      .pipe(cleanCSS())
      .pipe(sourcemaps.write('.'))
      // .on("error", notify.onError())
      .pipe(gulp.dest('build/css'))
      .pipe(browserSync.reload({ stream: true }))
  );
});

// gulp.task('scripts', function() {
// 	return gulp.src('src/js/libs/*.js')
// 		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
// 		.pipe(uglify()) // Сжимаем JS файл
// 		.pipe(gulp.dest('static/js')); // Выгружаем в папку static/js
// });

gulp.task('watch', ['sass', 'browserSync'], function() {
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('build/*.html').on('change', reload); //для обновления страницы заменил строку, было раньше(не обновляло): gulp.watch('app/*.html', browserSync.reload({stream: true}));
});
