
let BASE_URL = "";
const versionList = document.getElementById('versionsList');
const clientsList = document.getElementById('clientsList');
const levelsList = document.getElementById('levelsAndCameras');
// generate clients list from data and append to clents versions to the drop list
clients.forEach((client) => {
  const button = document.createElement('button');
  button.textContent = client.label;
  button.setAttribute('name', client.name);
  button.classList.add('btn');
  button.addEventListener('click', () => {
    appendVersions(client.versions, client.name, client.url); 
  });
  clientsList.appendChild(button);
})
// load each client data
function appendVersions(versions, name, url) {
  versions.forEach((version) => {
    const option = document.createElement('option');
    option.value = version;
    option.textContent = version;
    versionList.setAttribute('name', name);
    versionList.appendChild(option);
  });
  BASE_URL = url;
  const homeUrl = url + versions[0] + ".zip";
  loadHome(homeUrl);
}
// onchange to change the version
function changeVersion(e) {
  const version = e.target.value;
  levelsList.innerHTML = "";
  const homeUrl = BASE_URL + version + ".zip";
  loadHome(homeUrl);
}

versionList.addEventListener('change', changeVersion);

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

// Load home
function loadHome(homeUrl) {
  const options ={
    roundsPerMinute: 0,                    
    navigationPanel: "none",               
    aerialViewButtonId: "aerialView",       
    virtualVisitButtonId: "virtualVisit",  
    levelsAndCamerasListId: "levelsAndCameras",          
    camera: "Exterior view",                          
    selectableCameras: ["Exterior view", "Kitchen"],
    activateCameraSwitchKey: false, 
  }
  viewHome("viewerCanvas", homeUrl, onerror, onprogression, options);
}

  
    