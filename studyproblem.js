
// respond to request from popup to open random problem
chrome.runtime.onMessage.addListener(async function (request) {
  const openRandomProblemMessage = 'open_random_problem';

  if (request===openRandomProblemMessage) {
    pullProblemSets().then(pullProblemsFromRandomSet).then(navigateToRandomProblem);
  }
});

async function pullProblemsFromRandomSet(problemSets) {
  if (problemSets.length === 0) {
    if (!randomProblemForWebworkAsu()) {
      alert('my code is foolproof no way you see this');
    }
    return;
  }
  let randomSet = pickRandomSet(problemSets);
  return getProblemListFromSet(randomSet);
}

async function randomProblemForWebworkAsu() {
  let problemInfoBox = document.getElementById('fisheye');
  let problemList = [...problemInfoBox.getElementsByClassName('problem-list')][0];
  let problems = [...problemList.getElementsByTagName('li')];
  let currentProblem = [...problemList.getElementsByClassName('currentProblem')][0];
  problems.splice(problems.indexOf(currentProblem), 1);
  let randomProblem = problems[Math.floor(problems.length*Math.random())];
  let randomProblemLink = [...randomProblem.getElementsByTagName('a')][0];
  randomProblemLink.click();
  return !!randomProblemLink;
}

async function getProblemListFromSet(problemSet) {
  let page = await get(problemSet.href);
  let parser = new DOMParser();
  let doc = parser.parseFromString(page, "text/html");
  return [...doc.getElementsByTagName("a")].filter(el => {
    return el.innerText.includes("Problem");
  });
}

function navigateToRandomProblem(potentialProblems) {
  let problem = pickRandomProblem(potentialProblems);
  navigateTo(problem);
}

function navigateTo(problem) {
  window.location.assign(problem.href);
}

function pickRandomSet(problemSets) {
  return problemSets[Math.floor(problemSets.length*Math.random())];
}

function pickRandomProblem(problems) {
  return problems[Math.floor(problems.length*Math.random())];
}

async function pullProblemSets() {
  let page = await get(problemSetsPath());
  let parser = new DOMParser();
  let doc = parser.parseFromString(page, "text/html");
  return [...doc.getElementsByClassName("set-id-tooltip")];
}

function problemSetsPath() {
  let paths = window.location.pathname.split("/");
  let goodPaths = paths.filter(path => {
    return !path.includes("set") && (isNaN(path) || path.length == 0);
  });
  problem_sets_path = goodPaths.join("/");
  return window.location.origin + problem_sets_path + window.location.search;
}

function get(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = () => {
      if (xhr.status === 200) { resolve(xhr.responseText); }
      else { reject(new Error(xhr.responseText)); }
    };
    xhr.send();
  });
}