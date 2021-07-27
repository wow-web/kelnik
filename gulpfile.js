const gulp          = require('gulp');
const plumber       = require('gulp-plumber');
const sourcemap     = require('gulp-sourcemaps');
const sass          = require('gulp-sass');
const postcss       = require('gulp-postcss');
const autoprefixer  = require('autoprefixer');
const server        = require('browser-sync').create();
const csso          = require('gulp-csso');
const rename        = require('gulp-rename');
const imagemin      = require('gulp-imagemin');
const webpack       = require('webpack-stream');
const filesystem    = require('file-system');
const twig          = require('gulp-twig');
const data          = require('gulp-data');
const svgsprite     = require('gulp-svg-sprite');

const syncserver = () => {
    server.init({
      server: 'build/',
      notify: false,
      open: true,
      cors: true,
      ui: false,
      // tunnel: 'yousitename', // Use URL https://yousitename.loca.lt
    });

    gulp.watch('src/**/*.{twig, json}', gulp.series(html, refresh));
    gulp.watch('src/scss/**/*.{scss,sass}', gulp.series(css));
    gulp.watch('src/js/**/*.{js,json}', gulp.series(js, refresh));
    gulp.watch('build/assets/svg/*.svg', gulp.series(svg));
}

const html = () => {
    return gulp.src(['src/**/*.twig'])
      .pipe(data(function() {
          return JSON.parse(filesystem.readFileSync('src/data.json'));
      }))
      .pipe(twig())
      .pipe(gulp.dest('build'))
      .pipe(server.stream());
};

const css = () => {
    return gulp.src('src/scss/main.scss')
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer({
            grid: true
        })]))
        .pipe(rename('style.css'))
        .pipe(gulp.dest('build/css'))
        .pipe(csso())
        .pipe(rename('style.min.css'))
        .pipe(sourcemap.write('.'))
        .pipe(gulp.dest('build/css'))
        .pipe(server.stream());
};

const js = () => {
    return gulp.src(['src/js/main.js'])
        .pipe(webpack({
            mode: 'production',
            performance: { hints: false },
            module: {
                rules: [
                    {
                        test: /\.(js)$/,
                        exclude: /(node_modules)/,
                        loader: 'babel-loader',
                        query: {
                            presets: ['@babel/env'],
                            plugins: ['babel-plugin-root-import']
                        }
                    }
                ]
            }
        })).on('error', function handleError() {
            this.emit('end')
        })
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest('build/js'))
        .pipe(server.stream());
};

const refresh = (done) => {
    server.reload();
    done();
};

const svg = () => {
	return gulp.src('build/assets/svg/*.svg')
		.pipe(svgsprite({
            mode: {stack: {sprite: '../sprite.svg'}}
        }))
		.pipe(gulp.dest('build/assets/icons'));
};

// Оптимизация изображений
const createWebp = () => {
    return gulp.src('source/img/**/*.{png,jpg}')
        .pipe(webp({quality: 90}))
        .pipe(gulp.dest('source/img'));
};
  
const optimizeImages = () => {
    return gulp.src('build/img/**/*.{png,jpg}')
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
        ]))
        .pipe(gulp.dest('build/img'));
};

// Деплой на сервер
const deploy = () => {
    return gulp.src('build/')
        .pipe(rsync({
            root: 'build/',
            hostname: 'username@yousite.com',
            destination: 'yousite/public_html/',
            // clean: true, // Mirror copy with file deletion
            include: [/* '*.htaccess' */], // Included files to deploy,
            exclude: [ '**/Thumbs.db', '**/*.DS_Store' ],
            recursive: true,
            archive: true,
            silent: false,
            compress: true
        }));
};

const build = gulp.series(css, js, html, svg, syncserver);

exports.build = build;
exports.webp = createWebp;
exports.imagemin = optimizeImages;
exports.deploy = deploy;

exports.default = build;