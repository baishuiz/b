#update log#
## 1.0. ##
- 采用 typeScript重构项目

## 0.4.11 ##
- 支持采集埋点数据，在 B/event/events 中增加新事件，在 B/directive/event 、 B/view/view 中增加触发事件

## 0.4.9 ##
- 修正 repeat 数据进行 unshift 操作导致的错误

## 0.4.7 ##
- add goTo paramObj in middleware of views.
- add loading api of views.

## 0.4.3 ##
- 新增组件加载接口
- b.views.goTo 新增可选参数 templatePath ，用于指定组件模板地址
- b.views.goTo 新增可选参数 isComponent ，用于加载组件
