class Observer {
    constructor(data) {
        this.walk(data)
    }
    // 遍历对象属性
    walk(data) {
        if (!data || typeof data !== 'object') {
            return
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    // 给对象转化getter setter
    defineReactive(obj, key, val) {
        const that = this
        const dep = new Dep()
        // 这里递归调用walk用于处理数据中的对象
        this.walk(val)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                // 如果Dep类有target静态属性，则添加观察者（Dep.target在实例化Watcher类调用其构造函数时已经指定好了）
                Dep.target && dep.addSubs(Dep.target)
                // 这里return val参数是为了防止和Vue类_proxyData方法中定义的getter发生循环调用
                return val
            },
            set(newVal) {
                if (val === newVal) {
                    return
                }
                val = newVal
                // 这里调用walk是为了处理属性被复制成一个新对象，进行监听
                that.walk(newVal)
                // 通知收集的依赖更新视图
                dep.notify()
            }
        })
    }
}