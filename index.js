
let BASE_URL = "";
const root = document.getElementById('root');
const clientsList = document.getElementById('clientsList');
const menuBtn = document.getElementById('menuBtn');
const clientsUL = document.createElement('ul');
const versionList = document.getElementById('versionsList');
const levelsList = document.getElementById('levelsAndCameras');
const viewerProgress = document.getElementById('viewerProgress');
// add addEventListener to body to close menu -----------------------------------
root.addEventListener('click', (e) => {
  if (!menuBtn.contains(e.target)) {
    clientsList.classList.remove('show-menu');
  }
})
// add addEventListener to menuBtn ---------------------------------------------
menuBtn.addEventListener('click', toggleMenu);

// generate clients list from data and append to clents versions to the drop list
clients.forEach((client) => {
  if (client.active || client.name === "mainView") {
  const li = document.createElement('li');
  const button = document.createElement('button');
  button.textContent = client.label;
  button.setAttribute('name', client.name);
  button.classList.add('btn');
  button.addEventListener('click', () => {

    appendVersions(client.versions, client.name, client.url); 
  });
  if (client.name === "mainView") {
    button.classList.add('active');
  }
  li.classList.add('m-p');
  li.appendChild(button);
  clientsUL.appendChild(li);
  }
})

// toggle menu on max width 768px --------------------------------------------------
function toggleMenu(e) {
  e.preventDefault();
  console.log(menuBtn);
  clientsList.classList.toggle('show-menu');
}

// load each client data -----------------------------------------------------------
function appendVersions(versions, name, url) {
  versionList.setAttribute('name', name);
  versions.forEach((version) => {
    const option = document.createElement('option');
    option.value = version;
    option.textContent = version;
    
    versionList.appendChild(option);
  });
  BASE_URL = url;
  const homeUrl = url + versions[0] + ".zip";
  loadHome(homeUrl);
  toggelActive(name);
}

versionList.addEventListener('change', changeVersion);

function toggelActive(name) {
  const buttons = clientsUL.querySelectorAll('button');
  buttons.forEach((button) => {
    if (button.getAttribute('name') === name) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}
// onchange to change the version --------------------------------------------------
function changeVersion(e) {
  const version = e.target.value;
  levelsList.innerHTML = "";
  const homeUrl = BASE_URL + version + ".zip";
  loadHome(homeUrl);
}

// Define onerror and onprogression functions for the canves view ------------------
var onerror = function(err) {
    if (err == "No WebGL") {
      alert("Sorry, your browser doesn't support WebGL.");
    } else {
      console.log(err.stack);
      alert("Error: " + (err.message  ? err.constructor.name + " " +  err.message  : err)
            + (window.location.href.indexOf("file://") === 0 ? "\nCheck your browser is allowed to access local files." : ""));
    }
};

var onprogression = function(part, info, percentage) {
    var progress = document.getElementById("viewerProgress"); 
    if (part === HomeRecorder.READING_HOME) {
      // Home loading is finished 
      progress.value = percentage * 50;
      info = info.substring(info.lastIndexOf('/') + 1);
    } else if (part === Node3D.READING_MODEL) {
      // Models loading is finished 
      progress.value = 100 + percentage * 50;
      if (percentage === 1) {
        document.getElementById("viewerProgressDiv").style.visibility = "hidden";
      }
    }
  
    document.getElementById("viewerProgressLabel").innerHTML = 
        (percentage ? Math.floor(percentage * 100) + "% " : "") + part + " " + info;
};

// Load home -----------------------------------------------------------
function loadHome(homeUrl) {
  const options = {
    roundsPerMinute: 1,                    
    navigationPanel: "none",               
    aerialViewButtonId: "aerialView",       
    virtualVisitButtonId: "virtualVisit",  
    levelsAndCamerasListId: "levelsAndCameras",          
    camera: "Exterior view",                          
    // selectableCameras: ["Exterior view", "Kitchen"],
    activateCameraSwitchKey: false, 
  }
  viewHome("viewerCanvas", homeUrl, onerror, onprogression, options);
}

// load the default view-------------------------------------------------
if (clients.length > 0) {
  clientsList.appendChild(clientsUL);
  appendVersions(clients[0].versions, clients[0].name, clients[0].url);
  
}
  
    