module.exports = {
    options : {
        boss : true,
        eqeqeq : true,
        evil : true,
        expr : true,
        forin : true,
        immed : true,
        loopfunc : true,
        maxdepth : 4,
        maxlen : 120,
        newcap : true,
        noarg : true,
        noempty : true,
        nonew : true,
        onecase : true,
        quotmark : 'single',
        sub : true,
        supernew : true,
        trailing : true,
        undef : true,
        unused : true
    },

    groups : {
        browserjs : {
            options : {
                browser : true,
                predef : ['modules']
            },
            includes : ['*.blocks/**/*.js'],
            excludes : [
                '**/*.i18n/*.js',
                '**/_*.js',
                '**/*.node.js',
                '**/*.spec.js',
                '**/*.deps.js',
                '**/*.bemjson.js'
            ]
        },

        nodejs : {
            options : {
                node : true,
                predef : ['modules']
            },
            includes : ['*.blocks/**/*.node.js']
        },

        bemhtml : {
            options : {
                predef : [
                    'apply',
                    'applyCtx',
                    'applyNext',
                    'attrs',
                    'bem',
                    'block',
                    'cls',
                    'content',
                    'def',
                    'elem',
                    'js',
                    'local',
                    'match',
                    'mix',
                    'mod',
                    'mode',
                    'tag'
                ]
            },
            includes : ['*.blocks/**/*.bemhtml']
        },

        bemtree : {
            options : {
                predef : [
                    'apply',
                    'applyCtx',
                    'applyNext',
                    'block',
                    'content',
                    'def',
                    'elem',
                    'match',
                    'mod',
                    'mode',
                    'tag'
                ]
            },
            includes : ['*.blocks/**/*.bemtree']
        },

        specjs : {
            options : {
                browser : true,
                maxlen : 150,
                predef : [
                    'modules',
                    'describe',
                    'it',
                    'before',
                    'beforeEach',
                    'after',
                    'afterEach'
                ]
            },
            includes : ['*.blocks/**/*.spec.js']
        },

        bemjsonjs : {
            options : {
                asi : true
            },
            includes : ['*.bundles/**/*.bemjson.js']
        }
    }
};
