## Version History

### v0.0.6 - ⏱2023.3.18

-   修复 watchGeolocation 中 pause 和 clear 循环调用造成调用栈溢出的问题
-   修复 watchGeolocation 中 getGeolocation / .once() 的 timeout 入参造成的内存泄露问题
-   修改 watchGeolocation 中 定位失败重复开启定位的处理逻辑（若重复失败 5 次以内，将直接尝试重新继续获取定位；超过 5 次，将设置延迟一定时长再尝试重新继续获取定位）

### v0.0.5 - ⏱2023.3.16

-   watchGeolocation 返回值添加 pause 方法用于停止调用定位（原本使用 cleanup 方法），cleanup 方法用于清除 watchGeolocation 中传入的监听回调；为保证应用性能，当 watchGeolocation 中的监听回调为空时将自动调用 pause 方法停止定位，重新添加监听回调将触发定位

### v0.0.4 / 0.0.3 - ⏱2023.2.23

-   geoLocation 中添加 getGeolocationSync 方法, (同步方法)获取最新定位结果

### v0.0.2 / 0.0.1 - ⏱2022.12.30

-   添加 coordsTransform, 包括 wgs84 gcj bd 三者的转换
-   添加 watchGeolocation, 持续监听定位
