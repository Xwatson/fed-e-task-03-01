class Dep {
    constructor() {
        // 存储所有的观察者
        this.subs = []

    }
    // 添加观察者
    addSubs(sub) {
        // 如果观察者不为空，并且观察者有update方法
        if (sub && sub.update) {
            this.subs.push(sub)
        }
    }
    // 通知观察者更新
    notify() {
        this.subs.forEach(sub => {
            // 更新试图
            sub.update()
        })
    }
}