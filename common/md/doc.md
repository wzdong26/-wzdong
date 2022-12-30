# 📖 `@wzdong/common` Documentation

<p align="right">
    <!-- <a href="https://github.com/wzdong26/-wzdong/tree/main/common/md/document_zh.md">中文</a> -->
    - | -
    <i>EN</i> 
</p>

## 🔨 Installation

-   NPM

```
npm i @wzdong/common -S
```

-   CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@wzdong/common@x.x.x"></script>

<script>
    // The global variable 'common' introduced by the cdn contains the functions you need.
    const { LocalStore } = common;
    ... ...
</script>
```

## LocalStore

```typescript
import { LocalStore } from '@wzdong/common';

const { get, set, clear } = new LocalStore<string[]>('searchHistory');
```

## idb (@link https://github.com/wzdong26/-wzdong/tree/main/idb/md/doc.md)

```typescript
import { initStore } from '@wzdong/common';

/**
 * {@link https://github.com/wzdong26/-wzdong/tree/main/idb/md/doc.md}
 * ... ...
 */
```

## geo (@link https://github.com/wzdong26/-wzdong/tree/main/geo/md/doc.md)

```typescript
import { watchGeolocation } from '@wzdong/common';

/**
 * {@link https://github.com/wzdong26/-wzdong/tree/main/geo/md/doc.md}
 * ... ...
 */
```
