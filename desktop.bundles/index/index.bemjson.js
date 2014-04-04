({
    block: 'page',
    title: 'Title of the page',
    favicon: '/favicon.ico',
    head: [
        { elem: 'css', url: '_index.css' },
        { elem: 'meta', attrs: { name: 'description', content: '' }},
        { elem: 'meta', attrs: { name: 'keywords', content: '' }}
    ],
    content: [
        {
            block: 'example',
            js: true,
            content: [
                {
                    block: 'image-effect',
                    js: true
    //                ,
    //                attrs: {
    //                    style: 'background: url(http://img-fotki.yandex.ru/get/9108/28847767.55/0_1353d9_fbb7a18d_XL.jpg) 0 0 no-repeat; width: 800px; height: 533px;'
    //                }
                },

                {
                    block: 'config',
                    js: true,
                    tag: 'form',
                    content: [
                        [['count', 8], ['effectDuration', 300], ['transitionDuration', 750], ['src', '']].map(function(value) {
                            return [
                                {
                                    block: 'input',
                                    mods: {
                                        theme: 'simple',
                                        size: 'm'
                                    },
                                    label: value[0],
                                    val: value[1],
                                    name: value[0],
                                    placeholder: value[0] === 'src' ? 'Url' : 'Number',
                                    mix: { block: 'config', elem: 'control', elemMods: { type: value[0] } }
                                }
                            ];
                        }),
                        [
                            ['src', ['random', '/i/demo1.jpg', '/i/demo2.jpg', '/i/demo3.jpg']],
                            ['part', [/*'random',*/ 'rectangle', 'column', 'row']],
                            ['effect', ['random', 'opacity', 'scale']],
                            ['direction', ['random', 'linear', /*'spinClockwise', */'spinAnticlockwise']],
                            ['start', [/*'random',*/ 'topLeft', 'topRight', 'bottomRight', 'bottomLeft']]
                        ].map(function(value) {
                            return [
                                {
                                    elem: 'label',
                                    content: value[0]
                                },
                                {
                                    block: 'select',
                                    tag: 'select',
                                    mix: { block: 'config', elem: 'control', elemMods: { type: value[0] } },
                                    attrs: { name: value[0] },
                                    content: value[1].map(function(value) {
                                        return {
                                            elem: 'option',
                                            tag: 'option',
                                            attrs: { value: value },
                                            content: value
                                        };
                                    })
                                }
                            ];
                        }),
                        ['hide', 'show', 'toggle'].map(function(value) {
                            return {
                                block: 'button',
                                mods: { theme: 'normal', action: true, size: 'm' },
                                mix: { block: 'config', elem: 'control', elemMods: { action: value } },
                                content: value
                            };
                        }),

                        {
                            block: 'input',
                            mods: {
                                theme: 'normal',
                                size: 'm'
                            },
                            readonly: true,
                            mix: { block: 'config', elem: 'control', elemMods: { type: 'query' } }
                        }
                    ]
                },

                {
                    block : 'spin',
                    mods : { theme : 'normal', size : 'xs', progress : true }
                }
            ]
        },

        // TODO: always show primary lang
        {
            block: 'i-bem',
            elem: 'i18n',
            keyset: 'test',
            key: 'test'
        },

        // TODO: not work _i18n
        { elem: 'js', elemMods: { i18n: 'yes' }, url: '_index.js' }
    ]
})
