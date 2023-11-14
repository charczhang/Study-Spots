// noinspection JSDeprecatedSymbols
// const locations = [{position: { lat: 38.0356, lng: -78.5034 }, primary_key: 1}, {position: { lat: 38.0366, lng: -78.5034 }, primary_key: 2}];
function getUrl(url = "/") {
    if (!url.startsWith("/")) {
        url = "/" + url;
    }
    return "http://" + window.location.host + url;
}

function fetchResource(url) {
    return fetch(getUrl(url), {
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    })
}

function createAddStudySpace() {
    const addStudySpaceButton = document.createElement("button");
    addStudySpaceButton.style.height = "40px";
    addStudySpaceButton.style.width = "40px";
    addStudySpaceButton.style.backgroundColor = "#fff";
    addStudySpaceButton.style.border = "2px solid #fff";
    addStudySpaceButton.style.margin = "10px";
    addStudySpaceButton.style.padding = "0px";
    addStudySpaceButton.style.borderRadius = "2px";
    addStudySpaceButton.style.boxShadow = "0px 1px 4px -1px rgba(0,0,0,.3)";
    addStudySpaceButton.style.cursor = "pointer";
    addStudySpaceButton.style.lineHeight = "38px";
    addStudySpaceButton.style.overflow = "hidden";
    addStudySpaceButton.style.textAlign = "center";
    addStudySpaceButton.title = "Click to add a study spot";
    addStudySpaceButton.type = "button";
    addStudySpaceButton.addEventListener("click", () => {
        window.location.href = getUrl('add');
    });
    const addStudySpaceIcon = document.createElement('img');
    addStudySpaceIcon.src = add_studyspot_icon;
    addStudySpaceIcon.style.height = "24px";
    addStudySpaceIcon.style.width = "24px";
    addStudySpaceIcon.style.filter = "invert(47%) sepia(0%) saturate(252%) hue-rotate(202deg) brightness(81%) contrast(85%)"; //#666666
    addStudySpaceButton.appendChild(addStudySpaceIcon);
    addStudySpaceButton.addEventListener("mouseleave", (event) => {
        addStudySpaceIcon.style.filter = "invert(47%) sepia(0%) saturate(252%) hue-rotate(202deg) brightness(81%) contrast(85%)"; //#666666
    });
    addStudySpaceButton.addEventListener("mouseenter", (event) => {
        addStudySpaceIcon.style.filter = "invert(20%) sepia(0%) saturate(0%) hue-rotate(188deg) brightness(89%) contrast(95%)"; //#333333
    });
    return addStudySpaceButton;
}

let map;

function createHomeButton(mapControls, startingPosition, startingZoom) {
    const homeButton = document.createElement("button");
    homeButton.style.height = "40px";
    homeButton.style.width = "40px";
    homeButton.style.backgroundColor = "#fff";
    homeButton.style.border = "2px solid #fff";
    homeButton.style.margin = "10px";
    homeButton.style.padding = "0px";
    homeButton.style.borderRadius = "2px";
    homeButton.style.boxShadow = "0px 1px 4px -1px rgba(0,0,0,.3)";
    homeButton.style.cursor = "pointer";
    homeButton.style.lineHeight = "38px";
    homeButton.style.overflow = "hidden";
    homeButton.style.textAlign = "center";
    homeButton.title = "Click to center map";
    homeButton.type = "button";
    homeButton.addEventListener("click", () => {
        map.panTo(startingPosition, startingZoom);
        map.setZoom(startingZoom);
        if (mapControls.indexOf(homeButton) !== -1) {
            mapControls.removeAt(mapControls.indexOf(homeButton));
            homeIcon.style.filter = "invert(47%) sepia(0%) saturate(252%) hue-rotate(202deg) brightness(81%) contrast(85%)"; //#666666
        }
    });
    const homeIcon = document.createElement('img');
    homeIcon.src = home_icon;
    homeIcon.style.height = "24px";
    homeIcon.style.width = "24px";
    homeIcon.style.filter = "invert(47%) sepia(0%) saturate(252%) hue-rotate(202deg) brightness(81%) contrast(85%)"; //#666666
    homeButton.appendChild(homeIcon);
    homeButton.addEventListener("mouseleave", (event) => {
        homeIcon.style.filter = "invert(47%) sepia(0%) saturate(252%) hue-rotate(202deg) brightness(81%) contrast(85%)"; //#666666
    });
    homeButton.addEventListener("mouseenter", (event) => {
        homeIcon.style.filter = "invert(20%) sepia(0%) saturate(0%) hue-rotate(188deg) brightness(89%) contrast(95%)"; //#333333
    });
    map.addListener("center_changed", () => {

        if(mapControls.indexOf(homeButton) === -1){
            mapControls.push(homeButton);
        }
    });
    return homeButton;
}


function initMap() {
    const startingPosition = new google.maps.LatLng(38.0356, -78.5034);
    const startingZoom = 17;
    map = new google.maps.Map(document.getElementById("map"), {
        mapId: "86be248947f98a57",
        center: startingPosition,
        zoom: startingZoom,
        mapTypeControl: false,
        streetViewControl: false,
    });
    const centerControlDiv = document.createElement("div");
    const homeButton = createHomeButton(map.controls[google.maps.ControlPosition.INLINE_END_BLOCK_CENTER], startingPosition, startingZoom);
    centerControlDiv.appendChild(homeButton);
    if (is_authenticated) {
        const addStudySpaceButton = createAddStudySpace(); //creates
        centerControlDiv.appendChild(addStudySpaceButton);
        map.controls[google.maps.ControlPosition.INLINE_END_BLOCK_CENTER].setAt(0,addStudySpaceButton);
    }
    var infowindow = new google.maps.InfoWindow({
        content: ""
    });
    let locationObjects = new Map();
    locations.forEach((location, i) => {
        const pin = new google.maps.marker.PinElement({})
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: location.coordinates,
            map,
            title: location.name,
            zIndex: location.location_id,
            content: pin.element,
        });
        locationObjects.set(location.location_id, {'location': location, 'marker': marker});
        marker.addListener("click", () => {
            infowindow.close();
            infowindow.setContent(makeWindowContent(location));
            fetchResource(get_location_data_url(location.location_id))
                .then((response) => response.json())
                .then((data) => {
                    infowindow.setContent(makeWindowContent(location, data))
                }).then(infowindow.open(map, marker));
            scrollToLocationInList(location.location_id)
            window.history.replaceState(null, document.title, get_map_with_location_url(location.location_id))
        });
    })
    if (starting_location_id && locationObjects.has(starting_location_id)) {
        new google.maps.event.trigger(locationObjects.get(starting_location_id).marker, "click", {});
    }

}

function scrollToLocationInList(location_id){
    if (location_id) {
        const studyspotsListObj = document.getElementById("studyspots-list-item" + location_id);
        if (studyspotsListObj) {
            studyspotsListObj.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
        }

    }
}

function makeWindowContent(location, data = null) {
    return '<h3> ' + location.name + '</h3>' +
        '<h6>' + location.location_type + '</h6>' +
        '<p>' + location.address + '</p>' + (data == null ? "" : formatPostLinks(location, data))
}

function formatPostLinks(location, data) {
    let output = "";
    data.forEach(function (studyspace) {
        output += `<a href="${getUrl(get_studyspace_data_url(location.location_id, studyspace.location_ordinal))}"` +
            `title="${studyspace.space_type}: (fix ratings out of 5)">${studyspace.name}</a><br>`;
    });
    output += '<a href="' + getUrl(get_add_with_location_url(location.location_id)) + '">Add a new study spot</a>'
    return output;
}



window.initMap = initMap;
window.onload = function() {
    scrollToLocationInList(starting_location_id)
}


