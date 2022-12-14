# @wzdong/idb

<p align="center" style="font-size: large">
    <a href="https://github.com/wzdong26/-wzdong/tree/main/idb">ð± Github</a>
     | 
    <a href="https://github.com/wzdong26/-wzdong/tree/main/idb/md/doc_zh.md">ð ææ¡£</a>
     | 
    <a href="https://github.com/wzdong26/-wzdong/issues">ð¨âð§ Issues</a>
     |
    <a href="https://github.com/wzdong26/-wzdong/md/version.md">ð çæ¬</a>
</p>
<p align="right">
    <i>ä¸­æ</i> 
    - | -
    <a href="https://github.com/wzdong26/-wzdong/tree/main/idb/README.md">EN</a>
</p>

## ð åå¨åé¢ï¼

> å¦æä½ ä¸æ»¡è¶³äº localStorage çå­å¨å®¹éææ¯å¶æ¯æçæ°æ®æ ¼å¼ï¼å¯ä»¥è¯è¯ indexedDB ï¼å¦æä½ è§å¾ indexedDB ä½¿ç¨èµ·æ¥æä½ç¹çï¼é£ä¸å¦¨æ¥è¯è¯ **`@wzdong/idb`**ï¼å®è®©ä½ æä½ indexedDB å°±åæä½ localStorage é£ä¹ç®åï¼ðð

1. **è¿æ¯ä¸ä¸ªåºäº indexedDB å°è£å®ç°ç npm packageï¼å¤§å°ä» 10 kB å·¦å³ã**
2. **ä½¿ç¨æ¹æ³å¾ç®åï¼åªéè¦éè¿ `Promise.then()` çæ¹å¼å°±å¯ä»¥è¯»åãå­å¨ãç§»é¤æ°æ®ã**

### ð¨ å®è£

-   NPM ä¾èµå®è£

```
npm i @wzdong/idb -S
```

-   CDN èæ¬å¼å¥

```html
<script src="https://cdn.jsdelivr.net/npm/@wzdong/idb@x.x.x"></script>
```

## ð° ç¤ºä¾

```typescript
import { initStore } from '@wzdong/idb';

const yourKey = 'uid_1';

// ç¨ `yourKey` æ¥æ è¯ä½ ç store, ä½ çæ°æ®å°å­å¨ä¸»é®å¼ä¸º `yourKey` çè¿æ¡è®°å½ä¸­
const store = initStore(yourKey);
// æ¯æä½¿ç¨ TypeScript , åä¸é¢è¿æ ·å®ä¹ä½ è¦å­å¨çæ°æ®ç±»å:
// `const store = initStore<{dataName: string}>(yourKey)`

const yourData = { dataName: 'someData' };

// å­å¥æ°æ®
store.setData(yourData).then(() => console.log('save success!'));

// ååºæ°æ®, å¨ `.then()` ä¸­æ¥æ¶å°æ°æ®
store.getData().then((data) => console.log(data));

// ç§»é¤æ°æ®
store.removeData(yourData).then(() => console.log('remove success!'));
```

ä¹åä½ å°±å¯ä»¥éè¿è¿ç§æ¹å¼å¨ä½ çé¡¹ç®ä¸­éå¿ææ¬²å°è¿ç¨ indexedDB äºãè¿ä¸ªåæ³æ¯ä¸æ¯å¾å localStorage ï¼å¯¹ï¼å°±æ¯è¿ä¹ç®åãä»ä»æ¯åæäºå¼æ­¥ Promise çå®ç°æ¹å¼ã

### Js åºç¨ç¤ºä¾ -- è¡¨åå­å¨

[ç ä¸æéä»£ç æ²çï¼https://code.juejin.cn/pen/7166548718001324071](https://code.juejin.cn/pen/7166548718001324071)

## ð§ Q&Aï¼

-   ä¸ºä»ä¹è¦ç¨ indexedDB èä¸ç¨æ´ç®åç localStorage ?

1. indexedDB åçæ¯æ objectãDateãundefinedãNaNãInfinityãä»¥åèªå¼ç¨ object çè¯»åãè¿æ¯ localStorage æä¸æ¯æçï¼è½ç¶å¯ä»¥åå© `JSON.stringify()` å®ç°è½¬æ¢ï¼ä½ä»ç¶é¾ä»¥å®å¨æ¯æä¸è¿°çè¿äºç±»åã
2. indexedDB çå­å¨ç©ºé´è¶³å¤å¤§ï¼ä¸è¬æ¥è¯´ä¸å°äº 250Mï¼å¤§å°ä¸è¬æ¯ç¡¬çå¤§å°ç 50%ãè localStorage æå¤§å­å¨éä¸è¬ä¸é«äº 5Mã
3. indexDB åçåºäºå¼æ­¥æ¹å¼å®ç°ï¼ä¸å¿æå¿ä½¿ç¨å¶å¨è¯»åæ°æ®çè¿ç¨ä¸­åçéè¯¯èé»å¡åºç¨ç¨åºçæ­£å¸¸è¿è¡ã

-   ä¸ºä»ä¹è¦å¯¹ indexedDB å°è£ ?

&emsp;&emsp;åç indexedDB ä½¿ç¨è¿ç¨è¾ä¸ºå¤æï¼åå«æ°æ®åºè¯·æ±ãå»ºç«äºå¡ãäºå¡æä½ç­ãå¨æ­£å¼é¡¹ç®ä»£ç ä¸­ä½¿ç¨ç®åå°è£åçå®ç°æ´å é«æï¼åæ¶ä¹æ´æå©äºé¡¹ç®ç»´æ¤ã

## ð¡ æºç è®¾è®¡æè·¯

![](https://github.com/wzdong26/-wzdong/blob/main/idb/md/@wzdong_idb.png?raw=true)
[<center>è®¾è®¡æµç¨å¾ï¼ä»åå«é¨å setup å®ç°ï¼</center>](https://raw.githubusercontent.com/wzdong26/-wzdong/main/idb/md/%40wzdong_idb.png)

## ðââï¸ è´¡ç®è

-   **wzdong**
-   Email: wzdong.26@qq.com
-   Github: https://github.com/wzdong26
-   æéä¸»é¡µ: https://juejin.cn/user/1764078817409022
