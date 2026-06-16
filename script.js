const speedEl = document.getElementById("speed");
const qualityEl = document.getElementById("quality");
const pingEl = document.getElementById("ping");
const browserEl = document.getElementById("browser");
const statusEl = document.getElementById("status");

const startBtn = document.getElementById("startBtn");
const themeBtn = document.getElementById("themeBtn");

let chart;

detectBrowser();
updateStatus();
loadTheme();
updateChart();

startBtn.addEventListener("click", runTest);

themeBtn.addEventListener("click", () => {

document.body.classList.toggle("dark");

localStorage.setItem(
"theme",
document.body.classList.contains("dark")
);
});

function loadTheme(){

if(localStorage.getItem("theme")==="true"){
document.body.classList.add("dark");
}
}

function detectBrowser(){

const ua = navigator.userAgent;

if(ua.includes("Chrome"))
browserEl.innerText="Chrome";

else if(ua.includes("Firefox"))
browserEl.innerText="Firefox";

else if(ua.includes("Safari"))
browserEl.innerText="Safari";

else
browserEl.innerText="Unknown";
}

function updateStatus(){

statusEl.innerHTML=
navigator.onLine ?
"🟢 Online" :
"🔴 Offline";
}

window.addEventListener("online",updateStatus);
window.addEventListener("offline",updateStatus);

async function getPing(){

const start = performance.now();

try{

await fetch(
"https://www.google.com/favicon.ico?"+Date.now(),
{mode:"no-cors"}
);

const ping =
Math.round(
performance.now()-start
);

pingEl.innerText =
ping+" ms";

}catch{

pingEl.innerText =
"Unavailable";
}
}

function getQuality(speed){

if(speed < 5)
return "Poor 🔴";

if(speed < 20)
return "Average 🟡";

if(speed < 50)
return "Good 🟢";

return "Excellent 🚀";
}

function saveSpeed(speed){

let history =
JSON.parse(
localStorage.getItem("history")
) || [];

history.push(speed);

if(history.length > 10)
history.shift();

localStorage.setItem(
"history",
JSON.stringify(history)
);

updateChart();
}

function updateChart(){

const history =
JSON.parse(
localStorage.getItem("history")
) || [];

const ctx =
document.getElementById("speedChart");

if(chart)
chart.destroy();

chart = new Chart(ctx,{

type:"line",

data:{
labels:
history.map(
(_,i)=>`Test ${i+1}`
),

datasets:[{
label:"Speed (Mbps)",
data:history,
borderWidth:3,
tension:.4
}]
}
});
}

function runTest(){

qualityEl.innerText =
"Testing...";

const imageAddr =
"https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg";

const downloadSize =
14679474;

const startTime =
new Date().getTime();

const image =
new Image();

image.onload = function(){

const endTime =
new Date().getTime();

const duration =
(endTime-startTime)/1000;

const bitsLoaded =
downloadSize*8;

const speedMbps =
(
(bitsLoaded/duration)
/1024
/1024
).toFixed(2);

speedEl.innerText =
speedMbps+" Mbps";

qualityEl.innerText =
getQuality(speedMbps);

saveSpeed(Number(speedMbps));

getPing();
};

image.src =
imageAddr +
"?t=" +
Math.random();
}