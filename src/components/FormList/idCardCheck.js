export const yearDiff=(startTime,endTime)=>{
  let flag = [1, 3, 5, 7, 8, 10, 12, 4, 6, 9, 11, 2];
  let start = new Date(startTime);
  let end = new Date(endTime);
  let year = end.getFullYear() - start.getFullYear();
  let month = end.getMonth() - start.getMonth();
  let day = end.getDate() - start.getDate();
  if (month < 0) {
    year--;
    month = end.getMonth() + (12 - start.getMonth());
  }
  if (day < 0) {
    if (month==0) {
      year--;
      month=11
    }else{
      month--
    }
    let index = flag.findIndex((temp) => {
      return temp === start.getMonth() + 1
    });
    let monthLength;
    if (index <= 6) {
      monthLength = 31;
    } else if (index > 6 && index <= 10) {
      monthLength = 30;
    } else {
      monthLength = 28;
    }
    day = end.getDate() + (monthLength - start.getDate());
  }
  // console.log(`相差${year}年${month}月${day}天`)
  return {
    year,
    month,
    day
  }
}
export const isCardID = (sId) => {
  sId=sId+''
  sId=sId.replace('x','X')
  if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(sId)) {
    return {
      valid:false,
      error:'长度不是15位或者18位'
    }
  }

  //身份证省市
  var aCity = {11: "北京市",12: "天津市",13: "河北",14: "山西",15: "内蒙古",21: "辽宁",22: "吉林",23: "黑龙江",31: "上海",32: "江苏",33: "浙江",34: "安徽",35: "福建",36: "江西",37: "山东",41: "河南",42: "湖北",43: "湖南",44: "广东",45: "广西",46: "海南",50: "重庆",51: "四川",52: "贵州",53: "云南",54: "西藏",61: "陕西",62: "甘肃",63: "青海",64: "宁夏",65: "新疆",71: "台湾",81: "香港",82: "澳门",91: "国外"};
  if (!aCity[parseInt(sId.substr(0, 2))]) {
    return {
      valid:false,
      error:'省市区不对'
    }
  }
  let province=aCity[parseInt(sId.substr(0, 2))]
  let idCode=sId.substr(0, 6)
  // 出生日期验证
  var sBirthday = (sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2))).replace(/-/g, "/"), d = new Date(sBirthday)
  if (sBirthday != (d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate())) {
    return {
      valid:false,
      error:'出生日期不对'
    }
  }
  let birthday=  (sId.substr(6, 4) + "-" +sId.substr(10, 2) + "-" + sId.substr(12, 2))
  let {year,month,day}= yearDiff(birthday,new Date())
  // 身份证号码校验
  var sum = 0,
    weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
    codes = "10X98765432"
  for (var i = 0; i < sId.length - 1; i++) {
    sum += sId[i] * weights[i];
  }
  var last = codes[sum % 11]; //计算出来的最后一位身份证号码
  if (sId[sId.length - 1] != last) {
    return {
      valid:false,
      error:'格式不对'
    }
  }
  let sex=sId.substr(sId.length-2,1)%2==1?'男':'女'
  return {
    valid:true,
    age:year,
    ageStr:`${year}年${month}月${day}天`,
    sex,
    birthday,
    idCode,
    province
  }
}
