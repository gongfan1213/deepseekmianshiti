//创建全局的app对象，调用他的mount方法
//createApp(app).mount('#app')
//querySELECTOR('#app),element元素

//是一个函数，传入...args我们的代码就是一个组件，返回一个app的对象
export const createApp = ((...args) => {
//ensureRendeer实例话一个渲染器，渲染器就是把vue代码组件渲染到dom上的
//返回一个渲染器以后，渲染里面必然包含一个createApp的方法，并且会返回一个app对象
//创建了一个渲染器
  const app = ensureRenderer().createApp(...args)

  if (__DEV__) {
    injectNativeTagCheck(app)
    injectCompilerOptionsCheck(app)
  }
//从app当中拿到mount函数
//重写了mount方法，当我们调用mount的时候本质上在调用重写的mount方法
//装饰器模式，decorator pattern不改变原有的实现，对mount进行了增强
  const { mount } = app
  app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
    //containerOrSelector是我们传入的要挂载的dom
    //normalizeContainer解析成为统一的dom元素，如果是#app那么就需要通过querySelector拿到dom

    const container = normalizeContainer(containerOrSelector)
    if (!container) return
    //dom没有值直接返回
    const component = app._component
    //如果component是一个函数，并且没有render和template，那么就把container.innerHTML赋值给template
    if (!isFunction(component) && !component.render && !component.template) {
      // __UNSAFE__
      // Reason: potential execution of JS expressions in in-DOM template.
      // The user must make sure the in-DOM template is trusted. If it's
      // rendered by the server, the template should not contain any user data.
      component.template = container.innerHTML
      //直接用某个div的内容作为template的
      // 2.x compat check
      //检查是否有一些不再使用的指令，有的话，直接发出弃用的警告wareDeprecation
      if (__COMPAT__ && __DEV__ && container.nodeType === 1) {
        for (let i = 0; i < (container as Element).attributes.length; i++) {
          const attr = (container as Element).attributes[i]
          if (attr.name !== 'v-cloak' && /^(v-|:|@)/.test(attr.name)) {
            compatUtils.warnDeprecation(
              DeprecationTypes.GLOBAL_MOUNT_CONTAINER,
              null,
            )
            break
          }
        }
      }
    }

    // clear content before mounting
    if (container.nodeType === 1) {
      container.textContent = ''
    }
    //调用原来的app的mount的方法挂载在组件上
    //resolveRootNamespace解析根命名空间，container是我们传入的要挂载的dom
    //检查给定的容器元素是否属于特殊的命名空间，比如说svg或者MathML
    //如果是会以特殊的方式进行处理

    const proxy = mount(container, false, resolveRootNamespace(container))
    if (container instanceof Element) {
      container.removeAttribute('v-cloak')
      container.setAttribute('data-v-app', '')
    }
    return proxy
  }

  return app
}) as CreateAppFunction<Element>