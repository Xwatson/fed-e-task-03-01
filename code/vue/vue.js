class Vue {
    constructor(options) {
        // 1.保存数据
        this.$options = options
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
        this.$data = options.data
        // 2.转换data数据注入vue实例中
        this._proxyData(this.$data)
        // 3.调用observer监听数据变化
        new Observer(this.$data)
        new Compiler(this)
    }

    // 将data中的成员转换getter，setter，并注入到vue实例中
    _proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newValue) {
                    // 如果新值和旧值相等，什么都不做
                    if (newValue === data[key]) {
                        return
                    }
                    data[key] = newValue
                }
            })
        })
    }
}