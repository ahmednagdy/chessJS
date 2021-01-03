let timer1 = 300 * 1000;
let timer2 = 300 * 1000;
const par = document.getElementsByTagName("p")[0];
const par2 = document.getElementsByTagName("p")[1];

const btn1 = document.getElementsByTagName("button")[0];
const btn2 = document.getElementsByTagName("button")[1];

const ProgressBar = document.getElementsByTagName("div")[0];

function changeProgressBar(element, val) {
  let widthVal = parseInt(getComputedStyle(ProgressBar).width);
  widthVal -= val;
  element.style.width = widthVal + "px";
}

function toShow(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

let t1, t2;
btn1.addEventListener("click", function () {
  t1 = setInterval(function () {
    changeProgressBar(ProgressBar, 1);
    timer1 -= 1000;

    par.textContent = toShow(timer1);
  }, 1000);

  clearInterval(t2);
});

btn2.addEventListener("click", function () {
  t2 = setInterval(function () {
    timer2 -= 1000;
    par2.textContent = timer2;
  }, 1000);

  clearInterval(t1);
});

// let x = setInterval(function () {
//   timer1--;
//   par.textContent = timer1;
// }, 1000);

// setTimeout(function () {
//   clearInterval(x);
// }, 30000);
