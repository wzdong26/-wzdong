## Version History

### v0.0.6 - ⏱2022.12.28

-   在 getUnique 和 getSingle 基础上添加了 newUnique 和 newSingle, 传入构造函数

### v0.0.5 - ⏱2022.12.27

-   eventListener 函数 return 增加 getCb 和 getCbsNum

### v0.0.4 / 0.0.3 - ⏱2022.12.26

-   _以下调整不影响原来版本功能使用_
-   调整 build 目录结构
-   `package.json` add `"typings": "lib/index.d.ts"`

### v0.0.2 - ⏱2022.12.26

-   修复 debounce / (eventEmitter ->) eventListener / getUnique / throttle 函数 this 指向问题

### v0.0.1 - ⏱2022.12.24

-   Add Utils:
    -   debounce 防抖
    -   eventEmitter 事件派发器
    -   getUnique 工厂函数包装函数，唯一标识创建对象; getSingle 包装函数生成单例
    -   jsonUtils JSON.stringify / parse 函数改进
    -   setAnimation raf 函数生成动画
    -   throttle 节流
