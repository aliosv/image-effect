modules.define('i-bem__dom', function(provide, BEMDOM) {
    BEMDOM.decl('config', {
        onSetMod: {
            'js': {
                'inited': function() {
                    var _this = this,
                        queryConfig = {};

                    // взять конфиг из query
                    if ( window.location.search ) {
                        queryConfig = this.unSerialize(window.location.search);

                        // обновить значения в контролах
                        this.elem('control').each(function() {
                            var control = _this.findBlockOn($(this), 'input'),
                                controlType = _this.getMod($(this), 'type');

                            queryConfig[controlType] && control ? control.setVal(queryConfig[controlType]) : $(this).val(queryConfig[controlType]);
                        });
                    }

                    this.onConfigChange();

                    ['hide', 'show', 'toggle'].forEach(function(modVal) {
                        this.bindTo(this.elem('control', 'action', modVal), 'click', function(e, data) {
                            e.preventDefault();

                            // TODO: bug: изменения контролов тригерит событие на кнопках
                            console.log(e);

                            this.onConfigChange(modVal);
                        });
                    }, this);

                    [
                        'count', 'effectDuration', 'transitionDuration', 'src', 'part', 'effect', 'direction', 'start'
                    ].forEach(function(modVal) {
                            this.bindTo(this.elem('control', 'type', modVal), 'change', function(e) {
                                e.preventDefault();

                                this.onConfigChange('change');
                            });
                        }, this);
                }
            }
        },

        onConfigChange: function(eventName) {
            // TODO: обновить query в браузере
            this.findBlockOn(this.elem('control', 'type', 'query'), 'input').setVal(window.location.href + '?' + this.domElem.serialize());

            eventName && BEMDOM.blocks.config.emit(eventName, this.getConfig());
        },

        getConfig: function() {
            var config = this.unSerialize(this.domElem.serialize()),
                srcArray;

            if ( this.findBlockOn(this.elem('control', 'type', 'src').eq(0), 'input').getVal() ) {
                config.src = this.findBlockOn(this.elem('control', 'type', 'src').eq(0), 'input').getVal();
            } else if ( this.elem('control', 'type', 'src').eq(1).val() === 'random' ) {
                srcArray = Array.prototype.map.call(this.elem('control', 'type', 'src').get(1).options, function(option) {
                    return option.value;
                }).filter(function(value) {
                        return value != 'random';
                    });

                config.src = srcArray[Math.round(Math.random() * srcArray.length - 1)];
            }

            return config;
        },

        unSerialize: function(query) {
            return query.replace(/^\?/, '').split('&').reduce(function(prev, value) {
                value = value.split('=');
                prev[value[0]] = value[1];

                return prev;
            }, {});
        }
    });

    provide(BEMDOM);
});
