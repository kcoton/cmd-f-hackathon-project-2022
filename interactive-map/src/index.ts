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
const ROBSON_SQUARE = {
  lat: 49.282045,
  lng: -123.12196
}

const DOWNTOWN_VANCOUVER_BOUNDS = {
  north: 49.296392,
  south: 49.269941,
  west: -123.151600,
  east: -123.101361,
}

// initializes interactive map
function initMap(): void {
  var map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: ROBSON_SQUARE,
    restriction: {
      latLngBounds: DOWNTOWN_VANCOUVER_BOUNDS,
      strictBounds: false,
    },
    zoom: 15,
    mapTypeControl: true, 
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      position: google.maps.ControlPosition.TOP_RIGHT,
    },
  });

   // Create the search box and link it to the UI element.
   const input = document.getElementById("pac-input") as HTMLInputElement;
   const searchBox = new google.maps.places.SearchBox(input);
 
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
   
  let service = new google.maps.places.PlacesService(map);
  let getNextPage: () => void | false;
  const moreButton = document.getElementById("more") as HTMLButtonElement;

  moreButton.onclick = function () {
    moreButton.disabled = true;

    if (getNextPage) {
      getNextPage();
    }
  };

  // Perform a nearby search. 
  const places = searchBox.getPlaces;
  if (places == undefined || places.length == 0) {
    service.nearbySearch(
      { location: ROBSON_SQUARE, radius: 700, type: "restaurant" },
      (
        results: google.maps.places.PlaceResult[] | null,
        status: google.maps.places.PlacesServiceStatus,
        pagination: google.maps.places.PlaceSearchPagination | null
      ) => {
        if (status !== "OK" || !results) return;

        addPlaces(results, map);
        moreButton.disabled = !pagination || !pagination.hasNextPage;

        if (pagination && pagination.hasNextPage) {
          getNextPage = () => {
            // Note: nextPage will call the same handler function as the initial call
            pagination.nextPage();
          };
        }
      }
    );
  }

  function addPlaces(
    places: google.maps.places.PlaceResult[],
    map: google.maps.Map
  ) {
    const placesList = document.getElementById("places") as HTMLElement;
  
    for (const place of places) {
      if (place.geometry && place.geometry.location && place.types?.at(0) == "restaurant") {
        const image = {
          url: place.icon!,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
  
        new google.maps.Marker({
          map,
          icon: image,
          title: place.name!,
          position: place.geometry.location,
        });
  
        const li = document.createElement("li");
          li.textContent = place.name!;
          li.textContent += " -- Rating: " + place.rating;
          placesList.appendChild(li);
    
          li.addEventListener("click", () => {
            map.setCenter(place.geometry!.location!);
          });
        
      }
    }
  }
}

  export { initMap };
