import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  MapView: MapView | any;
  UserLocationGraphic: Graphic | any;
  map: Map | any;

  constructor() {}

  async ngOnInit() {
    this.map = new Map({
      basemap: "topo-vector"  // default basemap
    });

    this.MapView = new MapView({
      container: 'container',
      map: this.map,
      zoom: 5,
      center: [0, 0]
    });

    let weatherServiceFL = new ImageryLayer({
      url: WeatherServiceUrl
    });
    this.map.add(weatherServiceFL);

    await this.updateUserLocationOnMap();
    this.MapView.center = this.UserLocationGraphic.geometry;
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve) => {
      resolve([34.0007, -81.0348]); // Latitude dan Longitude untuk Columbia, SC
    });
  }

  async updateUserLocationOnMap() {
    const latLng = await this.getLocationService();
    let geom = new Point({
      latitude: latLng[0],
      longitude: latLng[1]
    });

    if (this.UserLocationGraphic) {
      this.UserLocationGraphic.geometry = geom;
    } else {
      this.UserLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol(),
        geometry: geom
      });
    }
    this.MapView.graphics.add(this.UserLocationGraphic);
  }

  // Fungsi untuk mengubah basemap
  onBasemapChange(event: any) {
    const selectedBasemap = event.detail.value;
    this.map.basemap = selectedBasemap;
  }
}

const WeatherServiceUrl = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer';
