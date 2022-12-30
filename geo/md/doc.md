# 📖 `@wzdong/geo` Documentation

<p align="right">
    <!-- <a href="https://github.com/wzdong26/-wzdong/tree/main/geo/md/document_zh.md">中文</a> -->
    - | -
    <i>EN</i> 
</p>

## 🔨 Installation

-   NPM

```
npm i @wzdong/geo -S
```

-   CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@wzdong/geo@x.x.x"></script>

<script>
    // The global variable 'geo' introduced by the cdn contains the functions you need.
    const { watchGeolocation } = geo;
    ... ...
</script>
```

## 1. watchGeolocation

```typescript
import { watchGeolocation } from '@wzdong/geo';
// 监控定位
const { cleanup } = watchGeolocation((data, err) => {
    if (!data) return;
    const { coords } = data;
    createFeature(coords);
    if (coords.accuracy < maxAccuracy) {
        showCircle = false;
        refreshSource();
    }
});
onUnmounted(cleanup);
```
