import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 统一注册图标，key: i+图标名字
export function loadIcon(app) {
  // 注册ElementIcon
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}
