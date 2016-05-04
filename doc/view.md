# view
---

## 获得当前 view
``` javascript
// 默认 viewport 下的 view 操作
// 默认 viewport 与当前 URL 关联
b.views.getActive('viewName'); // 返回当前 view 的 HTMLElement引用

// 指定 viewport 下的 view 操作
b.views('viewportName').getActive('viewName');
```


## view 切换
```javascript
// main viewport 的 view 跳转
b.views.goto('viewName');

// 特定 viewport 的 view 跳转
b.views('viewportName').goto('viewName');

// main viewport 的 view 后退
b.views.back();

// 特定 viewport 的 view 后退
b.views('viewportName').back();
```
