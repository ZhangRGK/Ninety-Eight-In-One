module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		concat:{
			options:{
				separator:";"
			},
			dist: {
				src:['src/**/*.js'],
				dest:'dist/<% pkg.name =%>.js'
			}
		},

		uglify: {
			options: {
				banner:'/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n '
			},
			dist: {
				files : [{
					src:['<%= concat.dist.dest %>'],
					dest:'dist/<%= pkg.name %>.min.js'
				}]
			},
			front_ends: {
				files : [{
					expand:true,
					cwd:'public/javascripts/',
					src:['**/*.js'],
					dest:'dist/public/javascripts/'
				}]
			}
		},

		jshint: {
			files:['<%= concat.dist.src %>','public/javascript/**/*.js'],
			options: {
				globals: {
					jQuery: true,
					console: true
				}
			}
		},

		shell: {
			launchExpress: {
				options: {
					stdout:true
				},
				command: 'node <%=uglify.dist.files[0].dest%>'
			},
			install: {
				options: {
					stdout:true
				},
				command: 'npm install'
			}
		},

		copy: {
			main: {
				files: [
					{expand:true,cwd:'/view/',src:['**'],dest:'dist/view'},
					{expand:true,cwd:'/public/stylesheets/',src:['**/*.less'],dest:'/dist/public/stylesheets/'},
					{expand:true,cwd:'/public/images/',src:['**'],dest:'/dist/public/images/'}
				]
			},
			pkgfile: {
				src: 'package.json',
				dest:'dist/package.json'
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('copy',['copy']);
	grunt.registerTask('build',['jshint','concat','uglify','copy','shell:install']);
	grunt.registerTask('install',['shell:install']);
	grunt.registerTask('server',['shell:launchExpress']);
};