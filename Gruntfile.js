'use strict';

var config = {};
var tasks = {};

tasks.concat = {
    'name': 'grunt-contrib-concat',
    'key': 'concat',
    'settings': {
        build: {
            src: 'css-js/js/{,*/}*.js',
            dest: 'css-js/main.js'
        }
    },
    'type': 'build'
};

tasks.uglify = {
    'name': 'grunt-contrib-uglify',
    'key': 'uglify',
    'settings': {
        build: {
            files: {
                'css-js/main.min.js': ['css-js/main.js']
            }
        }
    },
    'type': 'build'
};

tasks.sass = {
    'name': 'grunt-contrib-sass',
    'key': 'sass',
    'settings': {
        build: {
            options: {
                style: 'expanded',
                sourcemap: 'none',
                lineNumbers: true
            },
            files: {
                'css-js/css/style.css': 'css-js/sass/style.scss'
            }
        }
    },
    'type': 'build'
};

tasks.autoprefixer = {
    'name': 'grunt-autoprefixer',
    'key': 'autoprefixer',
    'settings': {
        build: {
            options: {
                browsers: ['last 3 version', 'ie 9', 'ie 10', 'ie 11']
            },
            files: [{
                expand: true,
                flatten: true,
                src: 'css-js/css/{,*/}*.css',
                dest: 'css-js/css/'
            }]
        }
    },
    'type': 'build'
};

tasks.cssmin = {
    'name': 'grunt-contrib-cssmin',
    'key': 'cssmin',
    'settings': {
        build: {
            files: {
                'css-js/style.min.css': ['css-js/css/style.css']
            }
        }
    },
    'type': 'build'
};

tasks.jshint = {
    'name': 'grunt-contrib-jshint',
    'key': 'jshint',
    'settings': {
        build: {
            options: {
                jshintrc: true,
                force: true
            },
            files: {
                src: ['css-js/js/{,*/}*.js']
            }
        }
    },
    'type': 'build'
};

tasks.watch = {
    'name': 'grunt-contrib-watch',
    'key': 'watch',
    'settings': {
        scripts: {
            files: ['css-js/js/{,*/}*.js'],
            tasks: ['jshint', 'concat', 'uglify'],
            options: {
                spawn: false
            }
        },
        sass: {
            files: ['css-js/sass/{,*/}*.scss'],
            tasks: ['sass', 'autoprefixer', 'cssmin'],
            options: {
                spawn: false
            }
        }
    },
    'type': 'default'
};

var defaultArray = [];
var buildArray = [];
var loadTasksArray = [];
var preConfig = {};

for (var key in tasks) {
    var obj = tasks[key];
    for (var prop in obj) {
        if(obj.hasOwnProperty(prop)){
            preConfig[obj.key] = obj.settings;
        }
    }

    if( obj.type === 'build' ) {
        buildArray.push(obj.key);
    }
    else if( obj.type === 'default' ) {
        defaultArray.push(obj.key);
    }

    loadTasksArray.push(obj.name);
}

module.exports = function(grunt) {
    config = preConfig;
    config.pkg = grunt.file.readJSON('package.json');
    grunt.initConfig(config);

    loadTasksArray.forEach(function(name) {
        grunt.loadNpmTasks(name);
    });

    grunt.registerTask('default', defaultArray);
    grunt.registerTask('build', buildArray);
};
