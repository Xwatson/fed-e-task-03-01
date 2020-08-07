class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        // 保存回调函数，update中调用
        this.cb = cb
        // 把当前watcher对象记录到Dep静态属性中
        Dep.target = this
        // 当下面访问vm[key]属性时，就会调用Observer类中defineReactive定义的getter方法，就会触发dep.addSubs，此时那边就能拿到target
        this.oldValue = vm[key]
        Dep.target = null
    }
    // 调用回调更新视图
    update() {
        const newValue = this.vm[this.key]
        if (this.oldValue === newValue) {
            return
        }
        this.cb(newValue)
    }
}