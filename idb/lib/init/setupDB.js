"use strict";
/**
 * @title setupDB
 * @author wzdong
 * @description 创建 IndexedDB 数据库，包含 IndexedDB 数据库的基本功能封装
 * -- 连接db
 * @export default {@link setupDB}
 * @export deleteDB {@link deleteDB}
 * -- db store 功能封装
 * @export add {@link add}
 * @export put {@link put}
 * @export get {@link get}
 * @export getByIndex {@link getByIndex}
 * @export remove {@link remove}
 * @export removeByIndex {@link removeByIndex}
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeByIndex = exports.remove = exports.getByIndex = exports.get = exports.put = exports.add = exports.deleteDB = void 0;
var config_1 = require("./config");
// 浏览器兼容IndexedDB
var compatIndexedDB = function () {
    if (!window.indexedDB) {
        throw new Error("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
    }
    return window.indexedDB;
};
// 创建一个自定义db: `InitDB`, 在原`IDBDatabase`基础上添加了若干成员方法
var addDBFcn = function (db) {
    var idb = db;
    idb.update = function (onUpdate) { return updateDB(db, onUpdate); };
    idb.getStore = function (storeName, mode) { return getStore(db, storeName, mode); };
    // 不建议使用, 会触发版本更新
    idb.createStore = function (storeInfo) {
        return idb.update(function (e) { return createStore(e, storeInfo); });
    };
    idb.deleteStore = function (storeName) {
        return idb.update(function (e) { return deleteStore(e, storeName); });
    };
    return idb;
};
// 发送IndexedDB打开请求，并获取到 db 对象
var openDB = (function (openDBOptions) {
    // 初始化 打开数据库请求
    var reqOpenDB, _db;
    return function (options) {
        return new Promise(function (resolve, reject) {
            var opt = __assign(__assign({}, openDBOptions), (options || {}));
            var name = opt.name, version = opt.version, onUpdate = opt.onUpdate, timeout = opt.timeout;
            var reset = function () {
                reqOpenDB = null;
                openDBOptions = opt;
            };
            //  兼容浏览器
            var indexedDB = compatIndexedDB();
            // 打开数据库，若没有则会创建
            if (!reqOpenDB) {
                reqOpenDB = indexedDB.open(name, version);
            }
            else if (options) {
                console.warn('Open indexedDB Options is invalid because the previous db opening request has not completed!', options);
            }
            reqOpenDB.onsuccess = function (evt) {
                var db = evt.currentTarget.result;
                _db = addDBFcn(db);
                reset();
                resolve(_db); // 数据库对象
            };
            reqOpenDB.onerror = function (evt) {
                reset();
                reject(evt.target.error);
            };
            reqOpenDB.onupgradeneeded = function (evt) {
                var db = evt.currentTarget.result;
                var _db = addDBFcn(db);
                reset();
                onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(_db);
                setTimeout(function () {
                    resolve(_db);
                }, 500);
            };
            var interval = setInterval(function () {
                if (_db) {
                    reset();
                    resolve(_db);
                }
            }, timeout / 5);
            setTimeout(function () {
                clearInterval(interval);
                reset();
                reject('Request IndexedDB Timeout!');
            }, timeout);
        });
    };
})({
    name: config_1.DB_NAME,
    timeout: 3000,
});
// 更新数据库，触发 onupgradeneeded
var updateDB = function (db, onUpdate) {
    return new Promise(function (resolve, reject) {
        var version;
        if (db.objectStoreNames.length === 0) {
            var dbName = db.name;
            db.close();
            indexedDB.deleteDatabase(dbName);
        }
        else {
            version = db.version + 1;
            db.close();
        }
        setTimeout(function () {
            openDB({ version: version, onUpdate: onUpdate }).then(resolve).catch(reject);
        });
    });
};
// 装配数据库
var setupDB = (function () {
    var _db;
    var addDBListener = function (db) {
        // `addDBListener` must be called when the database is opened.
        db.onerror = function (ev) { return console.error(ev.target); };
        db.onabort = function (ev) {
            _db = null;
        };
        db.onclose = function (ev) {
            _db = null;
        };
    };
    return function (opt) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (_db) {
                        if (opt) {
                            console.warn('Open indexedDB Options is invalid because the db is already opened!', opt);
                        }
                        return [2 /*return*/, _db];
                    }
                    return [4 /*yield*/, openDB(__assign({ onUpdate: function (db) {
                                return createAllStore(db, __spreadArray(__spreadArray([], config_1.DB_STORES, true), ((opt === null || opt === void 0 ? void 0 : opt.stores) || []), true));
                            } }, (opt || {}))).then(function (db) {
                            addDBListener(db);
                            window.onbeforeunload = function () { return db.close(); };
                            return db;
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
})();
exports.default = setupDB;
// 删除数据库
var deleteDB = function (name) {
    if (name === void 0) { name = config_1.DB_NAME; }
    //  兼容浏览器
    var indexedDB = compatIndexedDB();
    indexedDB.deleteDatabase(name);
};
exports.deleteDB = deleteDB;
// ----------------------------- store
// 写在onDBOpen，或onDBUpdate里面
// 创建store(ObjectStore)
var createStore = function (db, _a) {
    var storeName = _a.storeName, _b = _a.keyPathOptions, _c = _b === void 0 ? {} : _b, _d = _c.keyPath, keyPath = _d === void 0 ? config_1.DEFAULT_KEYPATH : _d, autoIncrement = _c.autoIncrement, indexList = _a.indexList;
    // `createStore` must be called when the database is `onupgradeneeded`.
    if (db.objectStoreNames.contains(storeName))
        return false;
    var store = db.createObjectStore(storeName, { keyPath: keyPath, autoIncrement: autoIncrement });
    indexList === null || indexList === void 0 ? void 0 : indexList.forEach(function (_a) {
        var name = _a.name, options = _a.options;
        store.createIndex(name, name, options);
    });
    return store;
};
// 创建配置项{@link DB_STORES}中的所有Store
var createAllStore = function (db, storesInfo) {
    // `createAllStore` must be called when the database is `onupgradeneeded`.
    storesInfo.forEach(function (storeInfo) { return createStore(db, storeInfo); });
};
// 删除store(ObjectStore)
var deleteStore = function (db, storeName) {
    if (!db.objectStoreNames.contains(storeName))
        return false;
    // `deleteObjectStore` must be called when the database is `onupgradeneeded`.
    db.deleteObjectStore(storeName);
    console.info("[indexedDB] Store ".concat(storeName, " is deleted!"));
    return true;
};
// 建立事务获取store(ObjectStore)
var getStore = function (db, storeName, mode) {
    var tx;
    try {
        tx = db.transaction(storeName, mode);
    }
    catch (err) {
        // updateDB(db)
        throw new Error("[IndexDB] Store named '".concat(storeName, "' cannot be found in the database"));
    }
    return tx.objectStore(storeName);
};
// store 基本操作
// 增
var add = function (store, data) {
    return new Promise(function (resolve, reject) {
        var req = store.add(data);
        req.onsuccess = resolve;
        req.onerror = reject;
    });
};
exports.add = add;
// 改
var put = function (store, data) {
    return new Promise(function (resolve, reject) {
        var req = store.put(data);
        req.onsuccess = resolve;
        req.onerror = reject;
    });
};
exports.put = put;
// 查
// 根据 主键 keyPath 查询
var get = function (store, keyPathValue) {
    return new Promise(function (resolve, reject) {
        var req = keyPathValue ? store.get(keyPathValue) : store.getAll();
        req.onsuccess = function (evt) {
            resolve(evt.target.result);
        };
        req.onerror = reject;
    });
};
exports.get = get;
// 根据 索引 Index 查询（游标）
var getByIndex = function (store, indexName, indexValue, direction) {
    return new Promise(function (resolve, reject) {
        var req = store.index(indexName).openCursor(indexValue, direction);
        var list = [];
        req.onsuccess = function (evt) {
            var cursor = evt.target
                .result;
            if (cursor) {
                list.push(cursor.value);
                cursor.continue();
            }
            else {
                resolve(list);
            }
        };
        req.onerror = reject;
    });
};
exports.getByIndex = getByIndex;
// 删
// 根据 主键 keyPath 删除
var remove = function (store, keyPathValue) {
    return new Promise(function (resolve, reject) {
        var req = store.delete(keyPathValue);
        req.onsuccess = function (evt) {
            resolve(evt.target.result);
        };
        req.onerror = reject;
    });
};
exports.remove = remove;
// 根据 索引 Index 删除（游标）
var removeByIndex = function (store, indexName, indexValue, direction) {
    return new Promise(function (resolve, reject) {
        var req = store.index(indexName).openCursor(indexValue, direction);
        req.onsuccess = function (evt) {
            var cursor = evt.target
                .result;
            if (cursor) {
                var reqDelete = cursor.delete();
                reqDelete.onerror = function () {
                    console.error("[IndexDB] Failed to delete the record ".concat(cursor));
                };
                reqDelete.onsuccess = function () { };
                cursor.continue();
            }
            else {
                resolve({ delete: 'done' });
            }
        };
        req.onerror = reject;
    });
};
exports.removeByIndex = removeByIndex;
