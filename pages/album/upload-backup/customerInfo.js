var flyStr = '傅璟,小萌市,喃猫,康立军,潘小阳,先生,骆仪,李老西,梦多,余旷,腾天,覃浩tommy,北极,陈实,李斯特,硅谷王川,黄芳莉,王波省,邓较瘦,爱跑步,张博扬,傅睿卿,薛迟,谜妹,螂王,张三,枫糖儿,简小单,罗梦宇,米调炫枫,冼艺哲,小铖,吴溯,李雷,唐前锋,金有元,碗丸,雷婕,梅臻,韩德雨,胡多钱'

// var nickNameList = flyStr.split(',')
// console.log(nickNameList)
var flyList=[];
for (var i = 0; i < flyStr.split(',').length; i++){
  var item = flyStr.split(',')[i]
  var str=''
  for(var k=0; k<item.length; k++){
    if(k>0 && k<5){
      str = str+'**'
    }else if(k<7){
      str = str + item[k]
    }
  }
 // str = str + '领了' + (Math.floor(Math.random() * (5 - 3) + 3) + Math.random(8)).toFixed(2)+'元红包'  
 var o={
   name: str,
   vour: (Math.floor(Math.random() * (5 - 3) + 3) + Math.random(8)).toFixed(2) + '元红包'
 }
  flyList.push(o)
}
//console.log(flyList)
module.exports= {
  flyList: flyList
}  