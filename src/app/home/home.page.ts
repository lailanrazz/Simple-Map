import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { Geolocation } from '@capacitor/geolocation';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point'; // Import Point geometry

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  latitude: number | any;
  longitude: number | any;

  constructor() {}

  public async ngOnInit(): Promise<void> {
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;

    const map = new Map({
      basemap: "topo-vector" // Reference to the base of the map
    });

    const view = new MapView({
      container: "container", // Reference to the view div created
      map: map, // Reference to the map object created before the view
      zoom: 10, // Sets zoom level based on level of detail (LOD)
      center: [this.longitude, this.latitude] // Center map on the user's location
    });

    // Define the star-shaped marker symbol
    const markerSymbol = {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      style: "star", // Shape of the marker
      color: [255, 105, 180], // Pink color
      size: 16, // Larger size for better visibility
      outline: {
        color: [255, 255, 255], // White outline
        width: 2
      }
    };

    // Create a point geometry for the user's location
    const point = new Point({
      longitude: this.longitude,
      latitude: this.latitude
    });

    // Create a graphic with the point and marker symbol
    const pointGraphic = new Graphic({
      geometry: point, // Use the Point geometry
      symbol: markerSymbol
    });

    // Add the graphic (star-shaped marker) to the map view
    view.graphics.add(pointGraphic);
  }
}
