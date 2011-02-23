/** @module coffeebip.CoffeeShop */
dojo.provide("coffeebip.CoffeeShop");

/**
 * 
 * @class coffeebip.CoffeeShop
 */
dojo.declare("coffeebip.CoffeeShop",
  null,
  
  {
    storeName: "",
    abbrev: "",
    loc: null,
    googleBarChartIndex: -1,
    coffeeShopsWidget: null,
    
    boxAdj: 0.0009,
    
    marker: null,
    markerOptions: null,
    
    // State variables for use when iterating over transactions in CoffeeShopsWidget
    total: 0,
    numTransactions: 0,
    
    constructor: function(storeName, abbrev, loc, googleBarChartIndex,
        coffeeShopsWidget) {
      this.storeName = storeName;
      this.abbrev = abbrev;
      this.loc = loc;
      this.googleBarChartIndex = googleBarChartIndex;
      this.coffeeShopsWidget = coffeeShopsWidget;
    },
    
    getBoxBounds: function() {
      return new google.maps.LatLngBounds(
          new google.maps.LatLng(
              this.loc.lat() - this.boxAdj, this.loc.lng() - this.boxAdj),
          new google.maps.LatLng(
              this.loc.lat() + this.boxAdj, this.loc.lng() + this.boxAdj));
    },
    
    addMarker: function(map, amountOfRed) {
      if (this.marker) {
        this.marker.setMap(null);
      }
      this.markerOptions = {
        bounds: this.getBoxBounds(),
        map: map,
        strokeWeight: 2,
        strokeColor: "blue",
        fillOpacity: 0.6,
        amountOfRed: dojo.colorFromRgb("rgb(255, "
            + Math.round(255 - amountOfRed) + ","
            + Math.round(255 - amountOfRed) + ")").toHex()
      };
      this.markerOptions.fillColor = this.markerOptions.amountOfRed;

      this.marker = new google.maps.Rectangle(this.markerOptions);
      this.insideBox = false;
      
      google.maps.event.addListener(this.marker, "mouseover", dojo.hitch(this, function() {
        if (this.insideBox) return;

        this.insideBox = true;
        this.highlightMarker();
        this.coffeeShopsWidget.totalsChart.setSelection([ { row: this.googleBarChartIndex, column: 1 } ]);
        this.coffeeShopsWidget.averagesChart.setSelection([ { row: this.googleBarChartIndex, column: 1 } ]);
      }));
      google.maps.event.addListener(this.marker, "mouseout", dojo.hitch(this, function() {
        if (! this.insideBox) return;

        this.insideBox = false;
        this.unhighlightMarker();
        this.coffeeShopsWidget.averagesChart.setSelection(null);
        this.coffeeShopsWidget.totalsChart.setSelection(null);
      }));
    },
    
    highlightMarker: function() {
      this.markerOptions.fillColor = "yellow";
      this.marker.setOptions(this.markerOptions);
    },
    
    unhighlightMarker: function(amountOfRed) {
      this.markerOptions.fillColor = this.markerOptions.amountOfRed;
      this.marker.setOptions(this.markerOptions);
    },
    
    removeMarker: function() {
      if (! this.marker) return;
      this.marker.setMap(null);
    }
  }
);