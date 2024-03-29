(function (global) {

    // map tells the System loader where to look for things
    var map = {
        'app': '/app', // 'dist'
        'rxjs': '/node_modules/rxjs',
        '@angular': '/node_modules/@angular',
        'angular2-cookie': '/node_modules/angular2-cookie',
        'lodash': '/node_modules/lodash/lodash.js',
        'ng2-bootstrap': '/node_modules/ng2-bootstrap',
        'moment': '/node_modules/moment',
        'ng2-table': '/app/shared/ng2-table',
        'angular2-ui-switch': '/node_modules/angular2-ui-switch',
        'angular2-modal': '/node_modules/angular2-modal'
    };

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app': { main: 'main.js', defaultExtension: 'js' },
        'rxjs': { defaultExtension: 'js' },
        'angular2-cookie': { main: 'core.js',  defaultExtension: 'js' },
        'ng2-bootstrap': { main: 'ng2-bootstrap.js', defaultExtension: 'js' },
        'ng2-table': { main: 'ng2-table.js', defaultExtension: 'js'},
        'angular2-ui-switch': { main: 'index.js', defaultExtension: 'js'},
        'angular2-modal': { main: 'index.js', defaultExtension: 'js'},
        'moment': { main: 'moment.js', defaultExtension: 'js'}
    };

    var packageNames = [
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/router'
    ];

    // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
    packageNames.forEach(function (pkgName) {
        packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
    });

    var config = {
        map: map,
        packages: packages
    }

    // filterSystemConfig - index.html's chance to modify config before we register it.
    if (global.filterSystemConfig) { global.filterSystemConfig(config); }

    System.config(config);

})(this);