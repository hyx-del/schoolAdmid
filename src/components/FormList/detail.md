# detail 使用

### html

```
<detailShow
      :formInitData="formInitData"
      :itemList="itemList"
      :config="config"
    />
```

## js 内

### 引入

```
import detailShow from "@/components/FormList/detailShow";
```

```
components: {
    detailShow
},
```

#props

####itemList

```jsx
itemList: [
    {
        el:'span',// 显示方式，
        label:'提示',// 前面的提示
        list:[{label:'男',value:1}],// 待选项，radio，select，固定选项等需要反显上去的数据
    }
],
```

#### config 配置信息

```jsx
const config={
            media:[0,400,800,1200,1250],//父级宽度改变时触发改变元素宽度
            column:[1,2,3,4,5],//每行几个,可数字可数组[]
}
,
```

| 元素名                        | 说明                                  |
| ----------------------------- | ------------------------------------- |
| span ,date，input，textArea   | 普通文本显示                          |
| select ,radio,checkbox,select | 如果返回的是 id，需要传入 list        |
| line                          | 生成一条贯穿的灰色的线条              |
| editer                        | editer 编辑器会占用最少三分之二的宽度 |

####formInitData 接收回显的数据

```jsx
formInitData:  {
  sex:1
},
```
