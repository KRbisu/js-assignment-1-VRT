const box = document.getElementById("box");
const attemptsText = document.getElementById("attempts");
const message = document.getElementById("message");
const results = document.getElementById("results");
const list = document.getElementById("list");
const summary = document.getElementById("summary");
const restart = document.getElementById("restart");

const maxAttempts = 5;
let times = [];
const states = {
  idle: "idle",
  waiting: "waiting",
  ready: "ready",
}
let state = states.idle;
let timer;
let startTime;

function boxController(className, text) {
  box.className = "box" + className;
  box.textContent = text;
}

function startRound() {
  state = states.waiting;
  boxController("red", "wait for blue");
  const delay = 1000 + Math.random() * 3000;
  timer = setTimeout(showBlue, delay);
}

function showBlue() {
  state = states.ready;
  boxController("blue", "click");
  startTime = performance.now();
}

function recordTime() {
  const ms = Math.round(performance.now() - startTime);
  times.push(ms);
  attemptsText.textContent = "Attempts remaining: " + (maxAttempts - times.length);

  if (times.length < maxAttempts) {
    state = states.idle;
    boxController("idle", ms + " ms\nclick to continue");
  } else {
    showResults();
  }
}

function antiPrediction() {
  clearTimeout(timer);
  state = states.idle;
  boxController("idle", "too early, click to retry");
}

function showResults() {
  state = states.done;
  box.classList.add("hidden");
  message.classList.add("hidden");
  list.innerHTML = "";

  for (let i = 0; i < times.length; i++) {
    const resultList = document.createElement("li");
    resultList.textContent = times[i] + " ms";
    list.appendChild(resultList);
  }

  const total = times.reduce((sum, t) => sum + t, 0);
  const average = Math.round(total / times.length);
  const best = Math.min(...times);
  summary.textContent = "Average: " + average + " ms · Best: " + best + " ms";
  results.classList.remove("hidden");
}

function reset() {
  times = [];
  state = states.idle;
  attemptsText.textContent = "Attempts remaining: " + maxAttempts;
  results.classList.add("hidden");
  box.classList.remove("hidden");
  message.classList.remove("hidden");
  boxController("idle", "click to start");
}

box.addEventListener("pointerdown", () => {
  switch (state) {
    case states.idle:
      startRound();
      break;
    case states.waiting:
      antiPrediction();
      break;
    case states.ready:
      recordTime();
      break;
  }
});

restart.addEventListener("click", reset);
