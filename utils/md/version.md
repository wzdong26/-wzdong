## Version History

### v0.0.2 - ⏱2022.12.26
- 修复 debounce / (eventEmitter ->) eventListener / getUnique / throttle 函数 this 指向问题

### v0.0.1 - ⏱2022.12.24

-   Add Utils:
    -   debounce 防抖
    -   eventEmitter 事件派发器
    -   getUnique 工厂函数包装函数，唯一标识创建对象; getSingle 包装函数生成单例
    -   jsonUtils JSON.stringify / parse 函数改进
    -   setAnimation raf 函数生成动画
    -   throttle 节流
