define([
    'jquery',
    'angular',
    'angular-couch-potato',
    'neptune',
    'angular-local-storage',
    'ui-bootstrap',
     //'backend-mocks',
    'angular-jedate',
    'angular-ui-select',
    'angular-ui-router',
    'bootstrap-treeview'

], function ($, angular, couchPotato) {
    var app = angular.module('calla', [
        'scs.couch-potato',
        'neptune.api',
        'ui.router',
        'LocalStorageModule',
        'ui.bootstrap',
         //'backend-mocks',
        'angular-jedate',
        'ui.select'
    ]);

    couchPotato.configureApp(app);

    return app;
});