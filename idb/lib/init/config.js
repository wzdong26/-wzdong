"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_STORES = exports.DEFAULT_KEYPATH = exports.DEFAULT_STORE_NAME = exports.DB_NAME = void 0;
// 配置db名
exports.DB_NAME = 'MY_APP_INDEXED_DB';
// 配置 IndexedDB Store 初始化信息
exports.DEFAULT_STORE_NAME = '$IDB_STORE';
exports.DEFAULT_KEYPATH = '$_ID';
exports.DB_STORES = [
    {
        storeName: exports.DEFAULT_STORE_NAME,
    },
];
