modules.define('i-bem__dom', function(provide, BEMDOM) {
    BEMDOM.decl('example', {
        onSetMod: {
            'js': {
                'inited': function() {
                    var image = this.findBlockInside('image-effect'),
                        config = this.findBlockInside('config'),
                        onChange = function(config) {
                            return image.hide().done(function() {
                                return image.updateConfig(config)
                                    .show();
                            });
                        };

                    image.updateConfig(config.getConfig())
                        .hide({ transitionDuration: 0 });
                    image.show();

                    BEMDOM.blocks.config.on('hide show toggle', function(e, data) {
                        // мгновенно делает противоположный эффект перед show или hide,
                        // чтобы по клику на одном и том же методе он отрабатывал,
                        // т.е. click 'show' -> hide(immediately) -> show()
                        if ( e.type != 'toggle' ) {
                            image[({
                                show: 'hide',
                                hide: 'show'
                            })[e.type]]({ transitionDuration: 0 });
                        }

                        image.updateConfig(data);
                        image[e.type](data);
                    });

                    BEMDOM.blocks.config.on('change', function(e, data) {
                        onChange(data);
                    });
                }
            }
        }
    });

    provide(BEMDOM);
});
