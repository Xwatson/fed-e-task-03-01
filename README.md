# fed-e-task-03-01

### 一、简答题
- 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如果把新增成员设置成响应式数据，它的内部原理是什么。
```
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```

  - 动态增加成员不是响应式数据，因为在创建Vue对象时将data数据通过Object.defineProperty转化成响应式，而Object.defineProperty只能对原有对象属性进行监听不能对新增属性监听
  - 通过$set给嵌套对象添加响应式属性，内部原理：
    - 通过调用$set可添加新增成员监听
    - set方法内部调用defineReactive方法将新增的成员进行监听，并立即执行notify通知所有依赖更新
    - defineReactive内部使用Object.defineProperty监听数据getter和setter
    - 在getter中进行收集依赖
    - 在setter中发送通知，在Dep中会循环收集到的依赖并触发回调

- 2、请简述 Diff 算法的执行过程
  - 同级比较，再比较子节点
  - 先判断一方有子节点一方没有字节点的情况，如果新的children没有子节点，将旧节子点移除
  - 如果都有子节点，则开始递归比较子节点
  - 传统的Diff比较式是依次比较两棵树上的每一个节点，这样时间复杂度是O(n^3)
  - Vue和Snabbdom中的Diff算法基于Dom一般很少跨层级移动特点进行优化，只进行同层级比较
  - 在比较时，先比较key和sel是否相同
  - 如果不相同删除之前内容，重新渲染
  - 如果是同一个节点，再判断新的节点是否有text，如果有并且和旧的text不同，直接更新文本内容
  - 如果新的节点有children，则开始使用diff进行同层级比较节点变化

#### 二、编程题
- 1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
- 2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。
- 3、参考 Snabbdom 提供的电影列表的示例，利用Snabbdom 实现类似的效果，如图：
![](https://s0.lgstatic.com/i/image/M00/26/F2/Ciqc1F7zUZ-AWP5NAAN0Z_t_hDY449.png)