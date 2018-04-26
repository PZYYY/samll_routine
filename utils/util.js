// 定义一个函数将返回的星星数值转化为数组
// 例如：返回的是30，取到3，循环5次，如果取到的值小于3，push 1，否则push 0  ==> [1,1,1,0,0]
function toStarsArray (stars) {
  var num = stars.toString().substr(0, 1)
  var starsArr = []
  for(let i = 0; i < 5; i++) {
    if(i < num) {
      starsArr.push(1)
    }else{
      starsArr.push(0)
    }
  }
  return starsArr
}

module.exports = {
  toStarsArray: toStarsArray
}
