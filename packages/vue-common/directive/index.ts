/**
 * @title vue-directive
 * @description vue app 添加全局指令
 * @author wzdong
 */

import type { App } from 'vue';
import draggable from './draggable';
import clickAway from './clickAway';

export default function addDirective(app: App) {
    app.directive('draggable', draggable);
    app.directive('click-away', clickAway);
}
