# 📖 `@wzdong/utils` Documentation

<p align="right">
    <!-- <a href="https://github.com/wzdong26/-wzdong/tree/main/utils/md/document_zh.md">中文</a> -->
    - | -
    <i>EN</i> 
</p>

## 🔨 Installation

-   NPM

```
npm i @wzdong/utils -S
```

-   CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@wzdong/utils@x.x.x/lib/index.min.js"></script>

<script>
    // The global variable 'utils' introduced by the cdn contains the functions you need.
    const { debounce } = utils;
    ... ...
</script>
```

## 1. debounce & throttle
- Code Example:
[@wzdong/utils--debounce&throttle](https://code.juejin.cn/pen/7180649740986646589) 
```typescript
import { debounce, throttle } from '@wzdong/utils';

const btn = document.createElement('button');
btn.innerText = 'test';
btn.style.position = 'fixed';
btn.style.top = '0';
btn.style.left = '0';
btn.style.zIndex = '9999';

let debounceTime = 0,
    throttleTime = 0,
    clickTime = 0;
const debounceFn = debounce(() => {
    console.log(`Debounce: ${++debounceTime} times!`);
});
const throttleFn = throttle(() => {
    console.log(`Throttle: ${++throttleTime} times!`);
});
btn.addEventListener('click', () => {
    console.log(`Click ${++clickTime} times!`);
    debounceFn();
    throttleFn();
});
```

## 2. eventEmitter

```typescript
import { eventEmitter } from '@wzdong/utils';

const emitter = eventEmitter<'onInterval', [data: number]>();
let intervalTime = 0;
setInterval(() => {
    emitter.emit('onInterval', ++intervalTime);
}, 1000);
const onIntervalFn = (time) => {
    console.log(`Interval times: ${time}`);
};
emitter.on('onInterval', onIntervalFn);
setTimeout(() => {
    emitter.off('onInterval', onIntervalFn);
}, 6000);
```

## 3. getUnique

In module `getMap.js`:

```typescript
import { getUnique } from '@wzdong/utils';

const setMap = (opt?: MapOptions) => new OlMap(opt);
export const getMap = getUnique(setMap, (k, r) => r.set('$', k));
```

In module `createMap.js`:

```typescript
import { getMap } from './getMap';
import { mapKey } from './config';

const map = getMap(mapKey, opt); // mapKey: uniqueKey, map: OlMap, opt: MapOptions
```

In module which needs to import the map created in `createMap.js`:

```typescript
import { getMap } from './getMap';
import { mapKey } from './config';

const map = getMap(mapKey); // map: OlMap, created in `createMap.js`
```

## 4. getSingle

> Different from `getUnique`, `getSingle` is only used to create a global singleton.

In module `getMap.js`:

```typescript
import { getSingle } from '@wzdong/utils';

const setMap = (opt?: MapOptions) => new OlMap(opt);
export const getMap = getSingle(setMap);
```

In module `createMap.js`:

```typescript
import { getMap } from './getMap';

const map = getMap(opt); // map: OlMap, opt: MapOptions
```

In module which needs to import the map created in `createMap.js`:

```typescript
import { getMap } from './getMap';

const map = getMap(mapKey); // map: OlMap, created in `createMap.js`
```

## 5. jsonStringify & jsonParse

```typescript
import { jsonStringify, jsonParse } from '@wzdong/utils';

const obj = { a: NaN, b: Infinity };
const objStr = jsonStringify(obj);
const outObj = jsonParse(objStr);
```

## 6. animate

```typescript
import { animate } from '@wzdong/utils';
// ... ...
const coords = point.getCoordinates();
const deltaCoords = [destinationCoords[0] - coords[0], destinationCoords[1] - coords[1]];
const duration = 3000;
animate(({ delta }) => {
    if (delta > duration) return;
    coords[0] = (deltaCoords[0] / duration) * delta + coords[0];
    coords[1] = (deltaCoords[1] / duration) * delta + coords[1];
    point.setCoordinates(coords);
}, duration).then(() => point.setCoordinates(destinationCoords));
```
