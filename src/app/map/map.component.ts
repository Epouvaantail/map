import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


// amCharts imports
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent {
  data:any;
  location:any;
  locationJs:any;
  private root!: am5.Root;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone, private appcomponent: AppComponent) { }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
    this.data = this.appcomponent.loadData();
    this.data = this.appcomponent.data;
  }

  ngAfterViewInit() {
    // Chart code goes in here
    
    this.browserOnly(() => {
      let root = am5.Root.new("chartdiv");

      root.setThemes([am5themes_Animated.new(root)]);

      let chart = root.container.children.push(
        am5map.MapChart.new(root, {
          panX: "rotateX",
          panY: "translateY",
          projection: am5map.geoMercator()
        })
      );
      
      let cont = chart.children.push(
        am5.Container.new(root, {
          layout: root.horizontalLayout,
          x: 20,
          y: 40
        })
      );
      
      // Add labels and controls
      cont.children.push(
        am5.Label.new(root, {
          centerY: am5.p50,
          text: "Map"
        })
      );
      
      // Create series for background fill
      // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
      let backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
      backgroundSeries.mapPolygons.template.setAll({
        fill: root.interfaceColors.get("alternativeBackground"),
        fillOpacity: 0,
        strokeOpacity: 0
      });
      
      // Add background polygon
      // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
      backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180)
      });
      
      // Create main polygon series for countries
      // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
      let polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow
        })
      );
      
      // Create line series for trajectory lines
      // https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/
      let lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
      lineSeries.mapLines.template.setAll({
        stroke: root.interfaceColors.get("alternativeBackground"),
        strokeOpacity: 0.3
      });
      
      // Create point series for markers
      // https://www.amcharts.com/docs/v5/charts/map-chart/map-point-series/
      let pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
      let colorset = am5.ColorSet.new(root, {});
      
      pointSeries.bullets.push(() => {
        let container = am5.Container.new(root, {
          tooltipText: "{title}\n population:{population}\n country:{country}",
          cursorOverStyle: "pointer"
        });
      
        // container.events.on("click", (e) => {
        //   window.location.href = e.target.dataItem.dataContext.url;
        // });
      
        let circle = container.children.push(
          am5.Circle.new(root, {
            radius: 4,
            tooltipY: 0,
            fill: colorset.next(),
            strokeOpacity: 0
          })
        );
      
      
        let circle2 = container.children.push(
          am5.Circle.new(root, {
            radius: 4,
            tooltipY: 0,
            fill: colorset.next(),
            strokeOpacity: 0,
            tooltipText: "{title}"
          })
        );
      
        return am5.Bullet.new(root, {
          sprite: container
        });
      });
      
      let cities = this.data;

      navigator.geolocation.getCurrentPosition((position) => {
        this.locationJs = position.coords;

        const CurrentPosition = {
          title: "You",
          country: " ",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          population: 1
        };

        const newCitiesList = [...cities, CurrentPosition]
      
      
      for (var i = 0; i < newCitiesList.length; i++) {
        let city = newCitiesList[i];
        addCity(city.longitude, city.latitude, city.title, city.country, city.population);
      }
    })
      function addCity(longitude: number, latitude: number, title: string, country: string, population: number) {
        pointSeries.data.push({
          population: population,
          country: country,
          geometry: { type: "Point", coordinates: [longitude, latitude] },
          title: title
        });
      }
      
      // Make stuff animate on load
      chart.appear(1000, 100);
    })
  }}
