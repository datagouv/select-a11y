require.config({
    baseUrl: '..',
    paths: {
        spec: './spec',
        jasmine: 'node_modules/jasmine-core/lib/jasmine-core/jasmine',
        'jasmine-html': 'node_modules/jasmine-core/lib/jasmine-core/jasmine-html',
        'jasmine-boot': 'node_modules/jasmine-core/lib/jasmine-core/boot',
        'jasmine-jquery': 'node_modules/jasmine-jquery/lib/jasmine-jquery',
        'jquery': 'node_modules/jquery/dist/jquery.min'
    },

    shim: {
        'jasmine-html': {
            deps: ['jasmine']
        },
        'jasmine-jquery': {
            deps: ['jquery', 'jasmine-boot']
        },
        'jasmine-boot': {
            deps: ['jasmine', 'jasmine-html']
        }
    }
});

var specification_list = [
    'spec/filter-component.spec'
];

requirejs(['jasmine-jquery'], function () {
    require(specification_list, function () {
        //trigger Jasmine
        window.onload();
    });
});