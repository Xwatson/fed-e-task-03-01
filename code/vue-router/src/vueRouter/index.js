// 记录全局Vue
let _Vue = null

export default class VueRouter {
    // vue安装方法
    static install(Vue) {
        // 1.判断当前插件是否已经被安装
        if (VueRouter.install.installed) {
            return
        }
        // 2.赋值记录已经安装
        VueRouter.install.installed = true
        // 3.记录vue实例
        _Vue = Vue
        // 使用混入，将创建VueRouter实例传入的router对象注入到Vue实例上
        _Vue.mixin({
            beforeCreate() {
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router
                    this.$options.router.init()
                }
            }
        })
    }

    constructor(options) {
        // 保存配置项
        this.options = options
        // 存储路由对应组件
        this.routeMap = {}
        // 使用vue响应式记录当前路由地址
        this.data = _Vue.observable({
            current: '/'
        })
    }
    init() {
        this.createRouteMap()
        this.initComponents(_Vue)
        this.initEvent()
    }
    // 遍历路由规则，将路由对应组件存储到routeMap属性中
    createRouteMap() {
        this.options.routes.forEach(route => {
            this.routeMap[route.path] = route.component
        })
    }

    // 创建组件
    initComponents(Vue) {
        const self = this
        // 注册link组件
        Vue.component('router-link', {
            props: {
                to: String
            },
            render(h) {
                return h('a', {
                    attrs: {
                        href: this.to
                    },
                    on: {
                        click: this.clickHandle
                    }
                }, [this.$slots.default])
            },
            methods: {
                clickHandle(e) {
                    if (this.$router.options.mode === 'history') { // history路由
                        window.history.pushState({}, '', this.to)
                        this.$router.data.current = this.to
                    } else { // hash路由
                        window.location.hash = this.to
                    }
                    e.preventDefault()
                }
            }
        })
        // 注册view组件
        Vue.component('router-view', {
            render(h) {
                const component = self.routeMap[self.data.current]
                return h(component)
            }
        })
    }

    // 注册浏览器后退前进事件
    initEvent() {
        if (this.options.mode === 'history') { // history路由
            window.addEventListener('popstate', () => {
                this.data.current = window.location.pathname
            })
        } else { // hash路由
            window.addEventListener('hashchange', () => {
                this.data.current = window.location.hash.replace('#', '')
            })
        }
    }

}