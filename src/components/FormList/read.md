# FormList 使用

## 新加功能

         // remoteMethod:(name)=>({name}),//输入搜索功能

        //   countFun:(list)=>list.map(v=>v.percent).reduce((pre, cur) =>( pre*100 * cur*100)/10000,0.95),
        //   countFun:(list)=>list.map(v=>v.value).reduce((pre, cur) =>( pre*100 + cur*100)/100,0),
        //   checkCountList:['aaa+bbb*dis=ccc','aaa*bbb=ddd'],
        //   countList:['aaa+bbb*dis=ccc','aaa*bbb=ddd'],

[comment]: <> ##功能检索关键词

```js
let item = {
	required: false,
	maxlength: 60,
	funMode: 'one',
	funMode: 'table',
	otherBack: '', //接收label的返回值
	allSelectCode: 'alllist', // 接收所有选择的对象的数组
	labelCode: 'name', // 指定的label名
	valueCode: 'id', // 指定的value名
	multiple: true, // 多选
	backType: 'ArrayStringNumber', // 返回值是数组内的元素变成数字后json后的字符串，
	backType: 'Array', // 返回值是数组
	backType: 'Number', // 返回值是数字
	filterable: true, // 可搜索
	remoteMethod: name => ({ name }), //输入后拿到输入值后执行搜索功能,remote和filterable都要true
	remote: true, // 可接收
	countFun: list => list.map(v => v.percent).reduce((pre, cur) => (pre * 100 * cur * 100) / 10000, 0.95), // 选中的项内部计算乘积
	countFun: list => list.map(v => v.value).reduce((pre, cur) => (pre * 100 + cur * 100) / 100, 0), // 选中的项内部计算累加
};
let config = {
	allRequired: false, // 是否全部必填
	allDisabled: false, // 是否全部禁用,
	countList: ['aaa+bbb*dis=ccc', 'aaa*bbb=ddd'], //自动计算
	checkCountList: ['aaa+bbb*dis=ccc', 'aaa*bbb=ddd'], //选中的自动计算
};
```

### html

```
<formList :formInitData="formInitData" :itemList="itemList" @buttonClick="formButton"/>
```

## js 内

### 引入

```
import formList from '@/components/FormList/index';
```

```
components: {
    formList
},
```

##props
###loading 提交的 loading 事件
双向绑定的
###formObj 赋值对象
接收返回值对象，可以传入相对应的值，即可赋值到表单里 ，例如：

```
formInitData:{
    title:'法外狂徒',
    name:'张三',
}
```

##hideList
隐藏某些元素，元素属性是数组，属性是 itemList 里面的元素的 code 值，例如：['code1','code2','code3']

## showList

显示某些元素，元素属性是数组，属性是 itemList 里面的元素的 code 值，例如：['code1','code2','code3']

##### 一般用于监听下拉或者单选时，隐藏某些元素

```js
// 表单变化
const formChange = val => {
	if (val.code == 'isContainQuarterage') {
		if (val.value == 0) {
			state.hideList = ['quarterage'];
		} else {
			state.showList = ['quarterage'];
		}
	}
};
```

###config
表单的配置，下面的这些都是默认的值

```json5
 config:{
        clearHideShow:false,//始终清除缓存的显示隐藏表,共用个表单时切换
        allDisabled:false,//全部元素默认是否禁用，true是禁用，默认是false
        watchList:[],// 回显监听的对象组，例如单选某个元素的值会导致另一个元素消失或显示，在传入初始值时会触发一次
        media:[0,400,800,1200,1250],//父级宽度改变时触发改变元素宽度
        column:[1,2,3,4,5],//每行几个,可数字可数组[]
        buttonsArea:'',// popButtom固定到底部
        enter:true,// 在input里按下enter键是否验证，会触发提交事件
        allRequired:true,// 是否全部必填
        labelShow:true,//是否显示前面的label
        labelWidth:'',//label的宽度，优先会用这个，其次会自动计算最大label长度加上colon的长度再+是否有必填选项＋1得到一个值，例如10em
        inline:false,//是否是行内
        inputStyle:{//input框样式，css
          width:'360px',
        },
        size:'small',//表单的尺寸
        colon:'：',// label后的冒号，可以替换成其他的
        mainStyle:{//主体的样式，css，下面的注释里的是在单独页面或者弹窗里可以用的样式
          // width:'80%',
          // marginLeft:'10%',
          // display:'flex',
          // flexWrap:'wrap',
          // justifyContent:'space-between'
        }
},
```

itemList ：生成表单的数组，el 代生成的什么样的组件目前有 input(默认),select,date,

| 元素名   | 类型    | 默认值 or 是否必填 | 说明                                                                     |
| -------- | ------- | ------------------ | ------------------------------------------------------------------------ |
| input    | String  | input              | 非必填,select(下拉),CheckBox(多选),radio(单选),area(省市区),area(省市区) |
| select   | String  | 必填               | 表单前面名字                                                             |
| date     | String  | 必填               | 字段名，用于接收表单返回值，formObj 里填入相对于值，可以用于编辑         |
| radio    | Boolean | true               | 是否必填，默认必填                                                       |
| checkbox | ------  | ------             | ---------                                                                |
| editer   | ------  | ------             | ---------                                                                |

其他通用属性

| 元素名               | 类型   | 默认值 or 是否必填 | 说明                                                                                                                                                                                                 |
| -------------------- | ------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| list                 | Array  | 非必填             | 在 select，radio，checkbox,里可填 元素例子：{label:'选择 1',value:'1',},                                                                                                                             |
| maxlength            | Number | 非必填             | 最大长度                                                                                                                                                                                             |
| minlength            | Number | 非必填             | 最小长度                                                                                                                                                                                             |
| radio 说明 单选      | ------ | ------             | 返回值字符串（value 的字符串），数组（选中的数组）                                                                                                                                                   |
| checkbox 说明 多选选 | ------ | ------             | 返回值字符串（选中的 value 的字符串），数组（选中的数组）                                                                                                                                            |
| list                 | Array  | 非必填             | 传入的数组                                                                                                                                                                                           |
| endVal               | string | 非必填             | 值：'all',，返回所选的对象数组                                                                                                                                                                       |
| backType             | string | 非必填             | 返回结果处理 Number：正则取出数字进行 parseFloat，如果为空则返回 0,String:字符串把结果返回成字符串(对时间不会处理) Array：数组，ArrayString：字符串化的数组，ArrayStringNumber：字符串化的数组是整数 |

##单独的默认值

```js
let itemList = [
	{
		el: 'radio',
		code: 'aaa',
		label: '是否提供住宿',
		defalt: '0', //默认值
		defaltValueSort: ['adc', 'somecode'],
		defaltValueSort: 'adc,mmp',
		defaltValueSort: 'adc',
		// defaltValueSort 可以是字符串也可以是数组
		// 默认取值序列在传入的初始化里寻找对应的code，如果都没有值，就会取默认值
	},
];
```

##input 输入

```json5
{
        label:'输入框',
        code:'testcode',
        icon:'',// 饿了么的图标，放在头部或尾部的图标
        prefix:'元',// 固定在头部的东西
        suffix:'元',// 固定在尾部的单位
        type:'phone',//验证规则，在utils.js的checkType里添加
        typeError:'hmp',//修改验证规则的报错，默认不写
        regular:/^[0-9]*$/,//自定义验证规则
        regularError:'',//自定义规则的报错
        maxlength:120,//最大长度
        minlength:1,// 最小长度
        lessCode:1,// 最小值检查，输入数字必选大于它
        maxCode:1,// 最大值检查
        showPassword:false,// 是否是password，默认false
},
```

##select

```js
// 不从后台返回结果
{
        el:'select',
        label:'下拉选择',
        code:'testcode',
        multiple:false,// 是否多选，多选时返回数据是数组
        otherBack:'select_label',// label的返回值
        allSelectCode:'test',//返回完整的对象数组
        list:[// 下拉选项
          {
            label:'1',
            value:21532
          },
          {
            label:'下拉2',
            value:2564
          }
        ]
}
// 从后台返回结果
{
        el:'select',
        label:'下拉选择',
        code:'testcode',
        otherBack:'select_label',// label的返回值
        back: true,// 从后台返回结果
        labelCode: 'levelName',// 指定的label名
        valueCode: 'id',// 指定的value名
        fun:getCoachLevelList,//使用的表格返回函数
},
```

```json5
// 串联模式
{
        el:'select',
        label:'下拉选择',
        code:'select123',
        seriesCode:'selectB',//当a值变化时会触发b重新获取数据
        seriesFun:(val)=>{schoolId:val},//如何通知b拿到参数
        ....
},
{
        el:'select',
        label:'下拉选择',
        code:'selectB',
        firstRequest:false,//初始化是否请求结果，默认请求
        .....
},
```

##searchTags 搜索加下拉的 tag 显示

```
// 从后台返回结果
{
    el:'searchTags',
    label:'搜索加下拉的tag显示',
    otherBack:'select_label',
    code:'testCode',
    searchCode:'name',// 指定搜索名
    labelCode: 'name',// 指定的label名
    valueCode: 'id',// 指定的value名
    fun:getCoachesList,// 使用的表格返回函数

},
```

##date 日期选择
item.dateType 时间类型： year（年），month（月），date（日），dates（日时分）， week，（周）datetime (时分) daterange（年月日时间范围），datetimerange（年月日时分秒时间范围）

```
// 一般
{
    el:'date',
    label:'日期选择',
    code:'testCode',
    dataFormat: "{y}-{m}-{d} {h}:{i}:{s}",//时间返回格式
    maxTime:'',//非必填,可以选择的最大时间，传时间戳或时间格式字符串，例如：2020-12-30
    minTime:'',// 最小时间，其他同上
},
// 获取开始和结束时间

{
    el:'date',
    label:'日期选择',
    code:'testCode',
    otherCodeArr:['start','end']// 开始和结束
    dateType:'daterange'//dateType必须是"datetimerange", "daterange", "monthrange", "dates"
},
// 两个时间关联，开始-->结束
{
    el: 'date',
    code: 'startTime',
    label: '开始时间',
    endCode: 'endTime',
    timeError: '开始时间要小于结束时间',
},
{
    el: 'date',
    code: 'endTime',
    label: '结束时间',
    timeError: '结束时间要大于结束时间',
    starCode: 'startTime',
},
// dataFormat 返回结果处理
{
    el: 'date',
    code: 'endTime',
    label: '结束时间',
    timeError: '结束时间要大于结束时间',
    starCode: 'startTime',
    dataFormat:'{y}-{m}-{d} {h}:{i}:{s}',
    dataFormat:'{y}-{m}-{d}',//默认
},

```

## cascader+Tags 数据是树状的数据

```
{
    el: 'cascaderTags',
    back: true,
    code: 'saleRoomId',
    label: '所属门店',
    labelCode: 'name',
    valueCode: 'id',
    searchCode: 'name',
    fun: getSalesRoomTree,
    funMode: 3,
    cascaderValue: 'end',
    firstCode: 'cityName',
},
```

## 省市区插件

```json5
item.areaCode 接收字段
province(省),provinceId(省id),
city(市),cityId(市ID),
county(区),countyId(区ID)
// 省市区
{
    el:'area',
    code:'area',
    label: '地区',
    //默认用这些code接收返回字段,用于回显
    areaCode:'province,provinceId,city,cityId,county,countyId'
},
// 省市
{
el:'area2',
code:'area2',
label: '地区',
//默认用这些code接收返回字段
areaCode:'province,provinceId,city,cityId'
},
```

## select,radio,checkbox,cascaderTags,searchTags 获取其他的值

```
item里加入一个接收字段，不写则不返回
allSelectCode:'aaa'
```

#slot

```json5

// 整个插入
{
    el:'itemSlot',//元素名字是slot
    slotName:'slot1',// 插槽的名字，不能重复
},
// 插入label后面的
{
    el:'slot',//元素名字是slot
    slotName:'slot1',// 插槽的名字，不能重复
},
// 插入到元素后面的
{
    el:'input',// el可以是任意元素
    label:'slot',
    code:'input',
    afterSlot:'afterSlot2'// 插在后面的slot名字，不能重复
}
<template #afterSlot2>
  <span>afterSlot2</span>
</template>
```

## **获取结果**

@formButton="formButton" 点击按钮的回调

```JSON5
val:{
    name:'按钮名称',//confirm会获取验证过的结果，没通过是false，reset重置表单，其他的名字不会触发表单事件
    valid:true,//是否通过验证
    value:{}//验证通过后会把结果以对象形式返回
}

formButton(val){
  if (val.name=='confirm'&&val.valid) {
        let data=val.value
        // data 就是结果
  }
}
```

## **获取表单值变化**

不包含编辑器和 textarea

```html
@formChange="formChange"
```

```jsx
formChange(val){
 val//返回值包含el，code，value，otherValue
}
```

# itemList 示例

```
itemList:[
    {
        code:'title',
        label:'新闻标题',
    },
     {
        el:'select',
        code:'select',
        label:'选择',
        list:[
            {
                label:'选择1',
                value:'1',
            },
             {
                label:'选择2',
                value:'2',
            }
        ]
    },
     {
        el:'date',
        code:'title',
        label:'选择时间',
    },
]
```

##showType:

```
1:只在 formList 显示
2:只在detailShow显示
3:在 detailShow 和 formList 显示
```

## detailCode

```
在detailShow显示时取的code
```
