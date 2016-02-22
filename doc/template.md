# 模板规则
-----

## viewport
**viewport** 是 view 的承载容器，文档内可同时存在多个 viewport，其中属性 main="true" 的 viewport 被指定为主容器。主容器内的 view 切换将引起 URL 同步变化。

- 操作 view 切换时，如不明确指定 view 所在容器，则默认操作主容器。

- viewport 展示位置、尺寸由业务 CSS 定义。

- 默认无需显性定义 main="true"

## view
**view** 是 *内容* 的承载容器，*内容* 为任意HTML节点、文本节点、注释节点集合，由业务方定义。

- 同一 viewport 下可同时存在多个 view，其中属性 active="true" 的 view 代表当前活动view， 即，当前显示 view。

- 默认无需显性定义 active="true"

## 显性定义 viewport
``` html
<viewport main="true" >
  <view name="page_default" > </view>
</viewport>
```

## 显性定义 viewport 及当前活动 view
``` html
<viewport>
  <view name="page_default" active="true"></view>
</viewport>
```
