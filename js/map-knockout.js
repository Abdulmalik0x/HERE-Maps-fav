
var initLocations = [
    {
        "name": "Manchester",
        "position": { lat: 53.439, lng: -2.221 },
        "content": '<div><a href=\'http://www.mcfc.co.uk\' >Manchester City</a>' +
            '</div><div class="map-elements content">City of Manchester Stadium<br>Capacity: 48,000</div>'
    },
    {
        "name": "Liverpool",
        "position": { lat: 53.430, lng: -2.961 },
        "content": '<div ><a href=\'http://www.liverpoolfc.tv\' >Liverpool</a>' +
            '</div><div class="map-elements content">Anfield<br>Capacity: 45,362</div>'
    },
    {
        "name": "my neighborhood",
        "position": { lat: 24.7465, lng: 46.56953 },
        "content": '<div><a href=\'https://ar.wikipedia.org/wiki/%D8%A7%D9%84%D8%AF%D8%B1%D8%B9%D9%8A%D8%A9\' >Al Deriyya</a></div>' +
            '<div class="map-elements content">My lovely neighborhood</div>'
    },
    {
        "name": "KSU",
        "position": { lat: 24.72606, lng: 46.62423 },
        "content": '<div><a href=\'https://ksu.edu.sa\' >King Saud University</a></div>' +
            '<div class="map-elements content">The 1st ranking university in Saudi Arabia</div>'
    },
    {
        "name": "Makkah",
        "position": { lat: 21.42112, lng: 39.82222 },
        "content": '<div style="width: 50%"><a href=\'https://makkahlive.net\' >Makkah</a></div>' +
            '<div class="map-elements content" style="width: 100%">Islam is the second religion by 24 %, makkah is the holy place for all muslims across the world and thier destination in thier prayers.</div>'
    }]

// var group = new H.map.Group;
// var coordinate = new H.geo.Point;

var addMarkerToGroup = function (group, item) {
    // console.log(item)
    var marker = new H.map.Marker(item.position);
    // var position = new H.geo.Point(position);
    // add custom data to the marker
    marker.setData(item.content);
    group.addObject(marker);

    this.name = ko.observable(item.name);
    this.position = ko.observable(item.position);
    this.content = ko.observable(item.content);
}

var setPosition = function (group, map) {
    // Act like a container
    // var group = this.group;

    map.addObject(group);
    console.log("Group added to map");
    map.setCenter();
    map.setZoom(5);


}



/**
 * Clicking on a marker opens an infobubble which holds HTML content related to the marker.
 * @param  {H.Map} map      A HERE Map instance within the application
 */

function addInfoBubble(ui, group, map) {
    // Act like a container
    // var group = this.group;

    map.addObject(group);
    
    // add 'tap' event listener, that opens info bubble, to the group
    group.addEventListener('tap', function (evt) {
        map.setCenter(evt.target.getPosition());
        map.setZoom(5);
        // event target is the marker itself, group is a parent event target
        // for all objects that it contains
        var bubble = new H.ui.InfoBubble(evt.target.getPosition(), {
            // read custom data
            content: evt.target.getData(),
        });
        // show info bubble
        ui.addBubble(bubble);

    }, false);

}

/**
 * Boilerplate map initialization code starts below:
 */

var ViewModel = function () {
    var self = this;
    var group = new H.map.Group();

    self.locList = ko.observableArray([]);
    self.query = ko.observable('');
    self.markers = ko.observableArray([]);

    // everytime query/placeList changes, this gets computed again
    self.filteredLocations = ko.computed(function () {
        if (!self.query()) {
            self.locList.removeAll();
            group.removeAll();
            console.log("self.locList after main if executed " + self.locList().length);

            filteredList = initLocations.filter(initLocation => initLocation.name.toLowerCase().indexOf(self.query().toLowerCase()) > -1);
            initLocations.forEach(function (locList) { //find
                self.locList.push(new addMarkerToGroup(group, locList));
                console.log("locList " + locList);
            });

            return self.locList();
        } else {
            self.locList.removeAll();
            group.removeAll();
            console.log("self.locList after else executed" + self.locList().length);
            filteredList = initLocations.filter(initLocation => initLocation.name.toLowerCase().indexOf(self.query().toLowerCase()) > -1);

            console.log("filteredList " + filteredList);
            filteredList.forEach(function (locList) { //find
                self.locList.push(new addMarkerToGroup(group, locList));
                console.log("locList 2 " + locList);
            });

            resultList = self.locList()
                .filter(location => location.name().toLowerCase().indexOf(self.query().toLowerCase()) > -1);
            return resultList

        }
    });

    // initialize communication with the platform
    var platform = new H.service.Platform({
        app_id: 'devportal-demo-20180625',
        app_code: '9v2BkviRwi9Ot26kp2IysQ',
        useHTTPS: true
    });

    var pixelRatio = window.devicePixelRatio || 1;
    var defaultLayers = platform.createDefaultLayers({
        tileSize: pixelRatio === 1 ? 256 : 512,
        ppi: pixelRatio === 1 ? undefined : 320
    });

    // initialize a map - this map is centered over Europe
    var map = new H.Map(document.getElementById('map'),
        defaultLayers.normal.map, {
            center: { lat: 24.6, lng: 46.7 }, // Default lat: 53.430, lng: -2.961
            zoom: 5,
            pixelRatio: pixelRatio
        });

    this.resetPosition = function (data, event) {
        elementName = event.target.firstChild.data
        filteredList = initLocations.filter(initLocation => initLocation.name.toLowerCase().indexOf(elementName.toLowerCase()) > -1);
        resultList = self.locList()
                .filter(location => location.name().toLowerCase().indexOf(elementName.toLowerCase()) > -1);
        console.log(filteredList[0]) // fetch element name
        map.setCenter({lat: filteredList[0].position.lat, lng:filteredList[0].position.lng});
            map.setZoom(5);
            pixelRatio: pixelRatio
    };

    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // create default UI with layers provided by the platform
    var ui = H.ui.UI.createDefault(map, defaultLayers);


    // Now use the map as required...
    addInfoBubble(ui, group, map);

}

ko.applyBindings(new ViewModel());