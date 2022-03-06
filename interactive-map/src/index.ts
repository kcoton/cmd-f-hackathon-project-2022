/*
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */

import "./style.css";

let map: google.maps.Map;
let service: google.maps.places.PlacesService;
let infowindow: google.maps.InfoWindow;

// coordinates for robson square
const lat = 49.282045;
const lng = -123.12196;

// initializes interactive map
function initMap(): void {
  var map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: lat, lng: lng },
    zoom: 15,
  });

   // Create the search box and link it to the UI element.
   const input = document.getElementById("pac-input") as HTMLInputElement;
   const searchBox = new google.maps.places.SearchBox(input);
   map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
 
   // Bias the SearchBox results towards current map's viewport.
   map.addListener("bounds_changed", () => {
     searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
   });
 
   let markers: google.maps.Marker[] = [];
 
   // Listen for the event fired when the user selects a prediction and retrieve
   // more details for that place.
   searchBox.addListener("places_changed", () => {
     const places = searchBox.getPlaces();
 
     if (places == undefined || places.length == 0) {
       return;
     }
 
     // Clear out the old markers.
     markers.forEach((marker) => {
       marker.setMap(null);
     });
     markers = [];
 
     // For each place, get the icon, name and location.
     const bounds = new google.maps.LatLngBounds();
 
     places.forEach((place) => {
       if (!place.geometry || !place.geometry.location) {
         console.log("Returned place contains no geometry");
         return;
       }
 
       const icon = {
         url: place.icon as string,
         size: new google.maps.Size(71, 71),
         origin: new google.maps.Point(0, 0),
         anchor: new google.maps.Point(17, 34),
         scaledSize: new google.maps.Size(25, 25),
       };
 
       // Create a marker for each place.
       markers.push(
         new google.maps.Marker({
           map,
           icon,
           title: place.name,
           position: place.geometry.location,
         })
       );
 
       if (place.geometry.viewport) {
         // Only geocodes have viewport.
         bounds.union(place.geometry.viewport);
       } else {
         bounds.extend(place.geometry.location);
       }
     });
     map.fitBounds(bounds);
   });
}

  export { initMap };
