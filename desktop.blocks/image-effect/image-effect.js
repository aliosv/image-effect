modules.define('i-bem__dom', ['jquery'], function(provide, $, BEMDOM) {
    BEMDOM.decl('image-effect', {
        onSetMod: {
            'js': {
                'inited': function() {
                    this.params = this.params || this.domElem.css('background-image').replace(/.*?url\((.+?)\).*/, '$1') || this.domElem.attrs('src');

                    this.domElem.css({
                        backgroundImage: 'none',
                        position: 'relative'
                    });

                    this.updateConfig(this.params);
                }
            }
        },

        _config: {
            // TODO: default values
        },

        updateConfig: function(params) {
            var _this = this,
                changed = [];

            if ( !params ) return this;

            Object.keys(params).forEach(function(key) {
                var value = key === 'count' ? +params[key] :
                    key === 'src' ? decodeURIComponent(params[key]) : params[key];

                if ( this._config[key] != value ) {
                    changed.push(key);

                    this._config[key] = value;
                }
            }, this);

            // загружает изображение по изменившемуся адресу,
            // удаляет из массива измененных полей конфига src
            if ( changed.indexOf('src') > -1 ) {
                this._config._img = $('<img>');
                this._config._img.bind('load', function(e) {
                    if ( e.currentTarget.src.indexOf(_this._config.src) > -1 ) _this.reflow(['src']);
                });
                this._config._img.attr('src', this._config.src);
            }

            if ( changed.length ) this.reflow(changed);

            return this;
        },

        transition: function(method, localConfig) {
            var _this = this,
                config = $.extend(true, {}, this._config, localConfig),
                count = config.count,
                deferred = $.Deferred();

            var directions = {
                    linear: {
                        topLeft: function (col, row) { return col + row; },
                        bottomRight: function (col, row) { return count*2 - col - row; },
                        topRight: function (col, row) { return count + row - col; },
                        bottomLeft: function (col, row) { return count - row + col; },
                        delayPerItem: (config.transitionDuration - config.effectDuration) / (count * 2 - 1)
                    },
                    spinAnticlockwise: {
                        topLeft: (function() {
                            var cache = {};

                            return function(col, row) {
                                var A,
                                    c;

                                if ( cache[count] ) return cache[count][col][row];

                                A = [];
                                c = 0;

                                for (var j = 0, m = count; j <= m; j ++, m --) {
                                    A[j] = A[j] || [];

                                    for (var i = j; i < m; i ++){
                                        A[j][i] = A[j][i] || [];
                                        A[j][i] = c;
                                        c += 1;
                                    }
                                    for (var i = j + 1; i < m; i ++){
                                        A[i] = A[i] || [];
                                        A[i][count - j - 1] = A[i][count - j - 1] || [];
                                        A[i][count - j - 1] = c;
                                        c += 1;
                                    }
                                    for (var i = j + 1; i < m; i ++){
                                        A[count - j - 1] = A[count - j - 1] || [];
                                        A[count - j - 1][count - i - 1] = A[count - j - 1][count - i - 1] || [];
                                        A[count - j - 1][count - i - 1] = c;
                                        c += 1;
                                    }
                                    for (var i = j + 1; i < m - 1; i ++){
                                        A[count - i - 1] = A[count - i - 1] || [];
                                        A[count - i - 1][j] = A[count - i - 1][j] || [];
                                        A[count - i - 1][j] = c;
                                        c += 1;
                                    }
                                }

                                cache[count] = A;

                                return A[col][row];
                            };
                        }()),
                        delayPerItem: (config.transitionDuration - config.effectDuration) / Math.pow(count, 2)
                    }
                },
                directionsKeys = Object.keys(directions),
                direction = directions[config.direction != 'random' ? config.direction :
                    directionsKeys[Math.round((directionsKeys.length - 1) * Math.random())]];

            var effects = {
                    opacity: {
                        show: { opacity: 1, scale: 1 },
                        hide: { opacity: 0 }
                    },
                    scale: {
                        show: { scale: 1, opacity: 1 },
                        hide: { scale: 0 }
                    }
                },
                effectsKeys = Object.keys(effects),
                effect = effects[config.effect != 'random' ? config.effect :
                    effectsKeys[Math.round((effectsKeys.length - 1) * Math.random())]][method];

            config.items && config.items.each(function(index) {
                var col = index % config.count,
                    row = (index -  col) / config.count;

                if ( !config.transitionDuration ) {
                    $(this).stop().transition(effect, 0);
                } else {
                    $(this).stop().delay(direction[config.start](col, row)*direction.delayPerItem)
                        .transition(effect, config.effectDuration);
                }
            });

            setTimeout(function() {
                deferred.resolve();
            }, config.transitionDuration);

            return deferred.promise();
        },

        show: function(config) {
            if ( !this.hasMod('hidden') ) return;

            this.delMod('hidden');

            return this.transition('show', config);
        },

        hide: function(config) {
            if ( this.hasMod('hidden') ) return;

            this.setMod('hidden', true);

            return this.transition('hide', config);
        },

        toggle: function(config) {
            return this[this.hasMod('hidden') ? 'show' : 'hide'](config);
        },

        reflow: function(dirty) {
            var _this = this,
                $this = this.domElem,
                config = this._config,
                count = config.count;

            console.log(dirty);

            for ( var i = dirty.length - 1; i >= 0; i -= 1 ) {
                if ( dirty[i] === 'src' ) {
                    config._imageWidth = config._img.get(0).naturalWidth;
                    config._imageHeight = config._img.get(0).naturalHeight;

                    if ( !config._imageWidth || !config._imageHeight ) return this;

                    config._itemWidth = config.part === 'rectangle' || config.part === 'column' ? config._imageWidth / count :
                        config._imageWidth;
                    config._itemHeight = config.part === 'rectangle' || config.part === 'row' ? config._imageHeight / count :
                        config._imageHeight;

                    $this.css({
                        width: config._imageWidth + 'px',
                        height: config._imageHeight + 'px'
                    });

                    config.items.each(function(index) {
                        var col = index % config.count,
                            row = (index -  col) / config.count;

                        $(this).css({
                            backgroundImage: 'url(' + config.src + ')',
                            backgroundPosition: '' + (-col * config._itemWidth) + 'px ' + (-row * config._itemHeight) + 'px',
                            left: col * config._itemWidth + 'px',
                            top: row * config._itemHeight + 'px',
                            width: config._itemWidth + 'px',
                            height: config._itemHeight + 'px'
                        });
                    });
                }

                if ( dirty[i] === 'part' || dirty[i] === 'count' ) {
                    var _count = config.part === 'rectangle' ? Math.pow(count, 2) : count;

                    config._itemWidth = config.part === 'rectangle' || config.part === 'column' ? config._imageWidth / count :
                        config._imageWidth;
                    config._itemHeight = config.part === 'rectangle' || config.part === 'row' ? config._imageHeight / count :
                        config._imageHeight;

                    config.items = $();

                    for ( var j = 0; j < _count; j += 1 ) {
                        var item = $('<div></div>'),
                            col = j % _count,
                            row = (j -  col) / _count;

                        config.items = config.items.add(item);

                        item.css({
                            backgroundImage: 'url(' + config.src + ')',
                            // TODO: распределить по сетке, для строк работает неверно
                            backgroundPosition: '' + (-col * config._itemWidth) + 'px ' + (-row * config._itemHeight) + 'px',
                            backgroundRepeat: 'no-repeat',
                            position: 'absolute',
                            left: col * config._itemWidth + 'px',
                            top: row * config._itemHeight + 'px',
                            width: config._itemWidth + 'px',
                            height: config._itemHeight + 'px'
                        });
                    }

                    $this.html(config.items);
                }
            }

            return this;
        }
    });

    provide(BEMDOM);
});
