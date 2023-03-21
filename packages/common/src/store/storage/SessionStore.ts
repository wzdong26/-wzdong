/**
 * @title SessionStore
 * @description e.g., const lsUser = new LocalStore('user'); lsUser.get(); lsUser.set('name');
 * @author wzdong
 */

import initStorage from './initStorage';

const { setItem, getItem, removeItem, IStorage } = initStorage(sessionStorage);

export { setItem, getItem, removeItem, IStorage as SessionStore };
