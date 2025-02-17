- beginWork
- completeWork

```js
export const beginWork = (wip:FiberNode)=>{
    switch(wip.tag){
        case FunctionComponent:
            return updateFunctionComponent(wip);
        case HostRoot:
            return updateHostRoot(wip);
        case HostComponent:
            return updateHostComponent(wip);
        default:
            if(__DEV__){
                console.warn('beginWork未实现的类型')
            }
            break;
    }
function updateFunctionComponent (wip:FiberNode){
    function App(){
        return <img/>
    }
    App()
return wip.child;

}
// fiberHooks
export function renderWithHoos (wip:FiberNode){
    const Component = 
}
function App(){
    return <span>big-react</span>
}
const root= document.querySelector('#root')
ReactDOM.createRoot(root).render(<App/>)
// 采用vite的实时调试，它的好处能实时看到源码的运行的效果的
export default defineConfig({
    plugins:[
        react(),
        "demo":"vite serve demos/test-fc --config --force"
        replace({
            _DEV_:true,
            preventAssignment:true,

        })
    ],
    resolve:{
        alisa:[
            {find:'react',
                replacement: resolvePkyPath('react')
            },
            {
                find:'react-dom',
                replacement:resolvePkyPath('react-dom')

            },
            {
                find:'hostConfig',
                replacement:path.resolve(
                    resolvePkgPath('react-dom'),
                   './src/hostConfig.js'
                )
            }
        ]
    }
})

// big-react/packages/react-domn/client
// 第二种调试方式更可以看到实时的运行效果的
// 为什么用vite不用webpack的呢
// vite插件体系和rollup兼容的
// vite插件体系和rollup是兼容的
import {resolvePkgPath} from '../rollup/utils'
export default defineConfig({
    plugins:[
        react(),
        "demo":"vite serve demos/test-fc --config --force"
        replace({
            _DEV_:true,
            preventAssignment:true,

        })
    ],
    resolve: {
        alias：[
            {
                find:'react',
                replacement:resolvePkgPath('react')

            },
             {
                find:'react-dom',
                replacement:resolvePkgPath('react-dom')

            },
            {
                find:'hostConfig',
                replacement:path.resolve(
                    resolvePkgPth('react-dom'),
                    './src/hostConfig.js'
                )

            }
        ]
    }
})
// devDependencies:@typescs/react,@types/react-dom@vurehs/plguins-reacttypescrt,vite
// scrips/下的demo当中的viteserve demos/test-fc --config scripts/vite
// jsx-dev-runtime
export {jsxDev} from './src/jsx'

```