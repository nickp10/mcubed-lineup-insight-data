const gulp = require("gulp");
const mocha = require("gulp-mocha");
const typescript = require("gulp-typescript");

const tsconfig = () => typescript.createProject("tsconfig.json");

gulp.task("compile", () => {
	return gulp.src(["./src/**/*.ts", "!./src/**/*.d.ts"], { base: "./" })
		.pipe(tsconfig()())
		.pipe(gulp.dest("./build"));
});

gulp.task("compile-test", () => {
	return gulp.src(["./test/**/*.ts", "!./test/**/*.d.ts"], { base: "./" })
		.pipe(tsconfig()())
		.pipe(gulp.dest("./build"));
});

gulp.task("test", ["compile", "compile-test"], () => {
	return gulp.src(["./build/test/**/*.js"])
		.pipe(mocha());
});
