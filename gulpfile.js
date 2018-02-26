const argv = require("argv");
const babel = require("gulp-babel");
const gulp = require("gulp");
const mocha = require("gulp-mocha");
const path = require("path");
const sourcemaps = require("gulp-sourcemaps");
const typescript = require("gulp-typescript");
const uglify = require("gulp-uglify");

const args = argv.option({ name: "env", short: "e", type: "string" }).run();
const isDebug = args.options["env"] === "debug";
const destDirname = isDebug ? "debug" : "build";
const dest = `./${destDirname}`;
const tsconfig = () => typescript("tsconfig.json");

gulp.task("compile", () => {
    const src = gulp.src(["src/**/*.ts", "!src/**/*.d.ts", "!src/**/*.spec.ts"], { base: "./src" });
    if (isDebug) {
        return src.pipe(sourcemaps.init())
            .pipe(tsconfig())
            .pipe(sourcemaps.mapSources((sourcePath, file) => {
                const to = path.dirname(file.path);
                const buildToRoot = path.relative(to, __dirname);
                const rootToSource = path.relative(__dirname, to);
                const fileName = path.basename(sourcePath);
                return path.join(buildToRoot, rootToSource, fileName);
            }))
            .pipe(sourcemaps.write(""))
            .pipe(gulp.dest(dest));
    } else {
        return src.pipe(tsconfig())
            .pipe(babel({
                presets: ["env"]
            }))
            .pipe(uglify())
            .pipe(gulp.dest(dest));
    }
});

gulp.task("compile-test", () => {
	return gulp.src(["src/**/*.spec.ts"], { base: "./src" })
		.pipe(sourcemaps.init())
		.pipe(tsconfig())
		.pipe(sourcemaps.mapSources((sourcePath, file) => {
			const to = path.dirname(file.path);
			const buildToRoot = path.relative(to, __dirname);
			const rootToSource = path.relative(__dirname, to);
			const fileName = path.basename(sourcePath);
			return path.join(buildToRoot, rootToSource, fileName);
		}))
		.pipe(sourcemaps.write(""))
		.pipe(gulp.dest(dest));
});

gulp.task("test", ["compile", "compile-test"], () => {
	return gulp.src([`${destDirname}/**/*.spec.js`])
		.pipe(mocha());
});

gulp.task("build", ["compile"]);
