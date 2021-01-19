/**
 * @requires store/store - 数据仓库
 * @requires page/page - Page 代理
 * @requires reactive/index - 响应式数据
 * @requires component - Component 
 */
import Store from './store/store';
import { createPage } from './page/index';
import { reactive, effect } from './reactive/index';
import { createComponent } from './component/component';
import { useParent, useChildren, useCustom } from "./relation/index"
// 导出功能API
export {
  Store,
  createPage,
  createComponent,
  reactive,
  effect,
  useParent, useChildren, useCustom
}