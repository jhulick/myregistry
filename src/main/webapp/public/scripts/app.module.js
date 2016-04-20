/*
 * MAX Gateway - Gateway Admin App + AngularJS
 */

// APP START
// -----------------------------------

(function() {
    'use strict';

    angular
        .module('registry', [
            'app.core',
            'app.routes',
            'app.sidebar',
            'app.navsearch',
            'app.preloader',
            'app.loadingbar',
            'app.translate',
            'app.settings',
            'app.dashboard',
            'app.flatdoc',
            'app.notify',
            'app.locale',
            'app.utils'
        ]);
})();

