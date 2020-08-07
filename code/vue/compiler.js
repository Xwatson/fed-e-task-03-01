class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.compile(this.el)
    }
    // 编译模板，处理文本节点和元素节点
    compile(el) {
        // 遍历vue挂载元素的所有子节点
        const childNodes = el.childNodes
        Array.from(el.childNodes).forEach(node => {
            // 处理文本节点
            if (this.isTextNode(node)) {
                this.compileText(node)
            } else if (this.isElementNode(node)) { // 处理元素节点
                this.compileElement(node)
            }
            // 如果node里面还有子节点，递归调用
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }
    // 处理元素节点
    compileElement(node) {
        // 遍历属性节点
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                // 截取v- 
                attrName = attrName.substr(2)
                const key = attr.value
                if (this.isEvent(attrName)) {
                    // 处理事件
                    const eventName = attrName.substr(attrName.indexOf(':') + 1)
                    node.addEventListener(eventName, this.vm.$options.methods[key].bind(this.vm), false)
                } else {
                    this.updater(node, key, attrName)
                }
            }
        })
    }
    // 更新对应指令
    updater(node, key, attrName) {
        const updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, this.vm[key], key)
    }
    // 处理v-text
    textUpdater(node, value, key) {
        node.textContent = value
        // 创建watcher对象，当数据改变更新视图
        this.addWatcher(node, 'textContent', key)
    }
    // 处理v-modal
    modelUpdater(node, value, key) {
        node.value = value
        // 创建watcher对象，当数据改变更新视图
        this.addWatcher(node, 'value', key)
        // 双向绑定
        node.addEventListener('input', e => {
            // 重新赋值vue实例中属性值，触发响应式
            this.vm[key] = e.target.value
        })
    }
    // 处理v-html
    htmlUpdater(node, value, key) {
        node.innerHTML = value
        this.addWatcher(node, 'innerHTML', key)
    }
    // 处理v-on
    onUpdater(node, value, key) {
        node.addEventListener()
    }
    // 处理文本节点
    compileText(node) {
        const reg = /\{\{(.+?)\}\}/
        const value = node.textContent
        if (reg.test(value)) {
            const key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])
            // 创建watcher对象，当数据改变更新视图
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = value.replace(reg, newValue)
            })
        }
    }
    addWatcher(node, nodeKey, key) {
        // 创建watcher对象，当数据改变更新视图
        new Watcher(this.vm, key, (newValue) => {
            node[nodeKey] = newValue
        })
    }
    // 判断元素是否是指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }
    // 判断节点是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3
    }
    // 判断节点是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
    // 判断是否是事件
    isEvent(attrName){
        return attrName.includes(':')
    }
}