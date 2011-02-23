/** @module coffeebip.CoffeeShopsWidget */
dojo.provide("coffeebip.CoffeeShopsWidget");

dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");

dojo.require("coffeebip.services");
dojo.require("coffeebip.Transaction");
dojo.require("coffeebip.CoffeeShop");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

/**
 * The visualization widget
 * 
 * @class coffeebip.CoffeeShopsWidget
 * @extends dijit._Widget
 * @extends dijit._Templated
 */
dojo.declare("coffeebip.CoffeeShopsWidget",
  [ dijit._Widget, dijit._Templated ],
  
  {
    /*
     * Properties
     */
    centerCoords: new google.maps.LatLng(42.28, -83.72), //(42.282, -83.72),// ,
    map: null,
    fusionTableID: 297270,
    layers: [],
    
    /** @property coffeebip.Transaction[] */
    tableData: [],
    totalsChart: null,
    

    /*
     * Functions - dijit._Widget
     */

    /** @function {protected} postCreate */
    postCreate: function() {
      this.map = new google.maps.Map(this.mapContainer,
          { zoom: 13,
            center: this.centerCoords,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP });

      this.loadTableData();
      
      this.SHOPS.ERC37 = new coffeebip.CoffeeShop("ESPRESSO ROYALE #37", "ERC37",
          new google.maps.LatLng(42.302350, -83.709332),
          0,
          this);
      this.SHOPS.ERC6 = new coffeebip.CoffeeShop("ESPRESSO ROYALE #6", "ERC6",
          new google.maps.LatLng(42.279100, -83.740788),
          1,
          this);
      this.SHOPS.ERC9 = new  coffeebip.CoffeeShop("ESPRESSO ROYALE #9", "ERC9",
          new google.maps.LatLng(42.280374, -83.748522),
          2,
          this);
      this.SHOPS.ERC40 = new coffeebip.CoffeeShop("ESPRESSO ROYALE #40", "ERC40",
          new google.maps.LatLng(42.274984, -83.735765),
          3,
          this);
      this.SHOPS.SW_PLY = new coffeebip.CoffeeShop("SWEETWATERS COFFEE & TEA", "SW_PLY",
          new google.maps.LatLng(42.304702, -83.694015),
          4,
          this);
      this.SHOPS.SW_KT = new coffeebip.CoffeeShop("SWEETWATERS CAFE-ANN A", "SW_KT",
          new google.maps.LatLng(42.28463, -83.74584),
          5,
          this);
      this.SHOPS.BGBY155 = new coffeebip.CoffeeShop("BIGGBY COFFEE #155", "BGBY155",
          new google.maps.LatLng(42.279405, -83.742780),
          6,
          this);
      this.SHOPS.BGBY274 = new coffeebip.CoffeeShop("BIGGBY COFFEE #274", "BGBY274",
          new google.maps.LatLng(42.297446, -83.728813),
          7,
          this);
      this.SHOPS.STAR = new coffeebip.CoffeeShop("STARBUCKS", "STAR",
          new google.maps.LatLng(42.254099, -83.681037),
          8,
          this);
      this.SHOPS.MIGHTY = new coffeebip.CoffeeShop("MIGHTY GOOD COFFEE COMPAN", "MIGHTY",
          new google.maps.LatLng(42.282511, -83.748421),
          9,
          this);

      dojo.connect(this.buttonReload, "onclick", this, "updateMap");
      
      this.totalsChart = new google.visualization.BarChart(this.totalsChartContainer);
      google.visualization.events.addListener(this.totalsChart, "onmouseover",
          function() {
          // TODO bar-hooks need to be reimplemented to work with "barcharts" package
        });
      
      this.averagesChart = new google.visualization.BarChart(this.averagesChartContainer);
      google.visualization.events.addListener(this.averagesChart, "onmouseover",
          function() {
          // TODO bar-hooks need to be reimplemented to work with "barcharts" package
        });
      
    },
    
    
    /*
     * Functions - coffeebip.CoffeeShopsWidget
     */

    /** @function clearLayers */
    clearLayers: function() {
      for (var i = 0; i < this.layers.length; ++i) {
        this.layers[i].setMap(null);
        this.layers = [];
      }
    },
    
    /** @function updateMap */
    updateMap: function() {
      this.clearLayers();

      var filteredResults = this.getFilteredResults();
      this.showTransactions(filteredResults);
    },
    
    showTransactions: function(transactions) {
      dojo.empty(this.rawTransactions);
      
      // Updating the num-transactions display in the raw-data section
      this.numTransactions.innerHTML = transactions.length;
      
      var grandTotal = 0;
      var totalERC37 = 0, totalERC6 = 0, totalERC9 = 0, totalERC40 = 0,
          totalSW_PLY = 0, totalSW_KT = 0,
          totalBGBY155 = 0, totalBGBY274 = 0,
          totalSTAR = 0, totalMIGHTY = 0;
      var largestTotal = 0;
      
      for (key in this.SHOPS) {
        var shop = this.SHOPS[key];
        shop.total = 0;
        shop.numTransactions = 0;
        shop.removeMarker();
      }
      
      for (var i = 0; i < transactions.length; ++i) {
        var transaction = transactions[i];
        
        grandTotal += transaction.amount;
        
        transaction.shop.total += transaction.amount;
        transaction.shop.numTransactions++;
        
        var date = new Date(transaction.dateInMillis);
        
        var row = document.createElement("TR");
        var td = document.createElement("TD");
        td.appendChild(document.createTextNode(transaction.shop.storeName));
        row.appendChild(td);
        
        td = document.createElement("TD");
        td.style.textAlign = "right";
        td.style.paddingRight = "8px";
        td.appendChild(document.createTextNode("$" + transaction.amount));
        row.appendChild(td);
        
        td = document.createElement("TD");
        td.appendChild(document.createTextNode(
            date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear()));
        row.appendChild(td);
        
        td = document.createElement("TD");
        td.appendChild(document.createTextNode(this.dayMap[date.getDay()]));
        row.appendChild(td);
        
        this.rawTransactions.appendChild(row);
      }
      
      this.totalGrand.innerHTML = "$" + grandTotal;
      for (key in this.SHOPS) {
        this["total" + key].innerHTML = "$" + this.SHOPS[key].total;
      }
      this.totalAvg.innerHTML = "$" +
          (transactions.length == 0 ? "0.00" : (grandTotal / transactions.length));
      for (key in this.SHOPS) {
        this["avg" + key].innerHTML = "$" + this.SHOPS[key].total / this.SHOPS[key].numTransactions;
      }

      /*
       * If there are transactions, add the shop-markers to the map
       */
      if (transactions.length > 0) {
        var largestSubTotal = 0;
        for (key in this.SHOPS) {
          if (this.SHOPS[key].total > largestSubTotal) {
            largestSubTotal = this.SHOPS[key].total;
          }
        }
        for (key in this.SHOPS) {
          var shop = this.SHOPS[key];
          shop.addMarker(this.map, shop.total / largestSubTotal * 255);
        }
      }
      

      // Filling Totals Chart
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Shop');
      data.addColumn('number', 'Total Spent');
      data.addRows(10);
      for (key in this.SHOPS) {
        var shop = this.SHOPS[key];
        data.setValue(shop.googleBarChartIndex, 0, shop.abbrev);
        data.setValue(shop.googleBarChartIndex, 1, shop.total);
      }
      this.totalsChart.draw(data,
        { width: 650, height: 340,
          title: "Total Spending",
          vAxis: {title: "Shop", titleTextStyle: {color: "black"}},
          hAxis: {title: "Amount Spent", titleTextStyle: {color: "black"}} });
      
      // Filling Averages Chart
      data = new google.visualization.DataTable();
      data.addColumn('string', 'Shop');
      data.addColumn('number', 'Avg Spent');
      data.addRows(10);
      for (key in this.SHOPS) {
        var shop = this.SHOPS[key];
        data.setValue(shop.googleBarChartIndex, 0, shop.abbrev);
        data.setValue(shop.googleBarChartIndex, 1,
            shop.numTransactions == 0 ? 0 : (shop.total / shop.numTransactions));
      }
      this.averagesChart.draw(data,
        { width: 650, height: 340,
          title: "Average Transaction",
          vAxis: {title: "Shop", titleTextStyle: {color: "black"}},
          hAxis: {title: "Avg Spent", titleTextStyle: {color: "black"}} });
    },
    
    /** @function getFilteredResults
     * 
     * @returns coffeebip.Transaction[]
     */
    getFilteredResults: function() {
      var filteredResults = [];
      for (var i = 0; i < this.tableData.length; ++i) {
        var result = this.tableData[i];
        if (! this.storeIncludedInQuery(result)) continue;
        if (! this.dayIncludedInQuery(result)) continue;
        filteredResults.push(result);
      }
      return filteredResults;
    },
    
    storeIncludedInQuery: function(transaction) {
      return (this.queryERC37.checked && transaction.isEspressoRoyale37())
        || (this.queryERC6.checked && transaction.isEspressoRoyale6())
        || (this.queryERC9.checked && transaction.isEspressoRoyale9())
        || (this.queryERC40.checked && transaction.isEspressoRoyale40())
        || (this.querySW_PLY.checked && transaction.isSweetwatersPlymouth())
        || (this.querySW_KT.checked && transaction.isSweetwatersKerryTown())
        || (this.queryBGBY155.checked && transaction.isBiggby155())
        || (this.queryBGBY274.checked && transaction.isBiggby274())
        || (this.querySTAR.checked && transaction.isStarbucks())
        || (this.queryMIGHTY.checked && transaction.isMightyGood());
    },
    
    dayIncludedInQuery: function(transaction) {
      if (transaction.dateInMillis < new Date(this.queryStartDate).getMilliseconds()) {
        return false;
      }
      if (transaction.dateInMillis > new Date(this.queryEndDate).getMilliseconds()) {
        return false;
      }
      
      var dayOfWeek = new Date(transaction.dateInMillis).getDay();
      switch (dayOfWeek) {
      case 0: return this.querySUN.checked;
      case 1: return this.queryMON.checked;
      case 2: return this.queryTUE.checked;
      case 3: return this.queryWED.checked;
      case 4: return this.queryTHU.checked;
      case 5: return this.queryFRI.checked;
      case 6: return this.querySAT.checked;
      default: return false;
      }
    },
    
    
    
    loadTableData: function() {
      coffeebip.services.tableQuery(
          { "sql": "SELECT * FROM " + this.fusionTableID, 
            "jsonCallback": "fusionTableCallbackWorkaround" }
        );
    },
    /** @function processResults */
    processResults: function(results) {
      results = results.table.rows;
      
      for (var i = 0; i < results.length; ++i) {
        var result = results[i];
        this.tableData.push(new coffeebip.Transaction(
            this.SHOPS[ this.SHOP_MAP[result[0]] ],
            result[2],
            result[3]));
      }
    },


    /*
     * Properties - dijit._Templated
     */
    /** @property {protected} widgetsInTemplate */
    widgetsInTemplate: true,
    /** @property {protected} templatePath */
    templatePath: dojo.moduleUrl("coffeebip", "CoffeeShopsWidget.html"),
    
    
    
    dayMap: ["Sunday","Monday","Tuesday","Wednesday","Thursday",
             "Friday","Saturday","Sunday"],

    SHOPS: {},
    SHOP_MAP: {
      "ESPRESSO ROYALE #37": "ERC37",
      "ESPRESSO ROYALE #6": "ERC6",
      "ESPRESSO ROYALE #9": "ERC9",
      "ESPRESSO ROYALE #40": "ERC40",
      "SWEETWATERS COFFEE & TEA": "SW_PLY",
      "SWEETWATERS CAFE-ANN A": "SW_KT",
      "BIGGBY COFFEE #155": "BGBY155",
      "BIGGBY COFFEE #274": "BGBY274",
      "STARBUCKS": "STAR",
      "MIGHTY GOOD COFFEE COMPAN": "MIGHTY",
    }
  }
);

//var layer = new google.maps.FusionTablesLayer(this.fusionTableID,
//{ query: "SELECT * FROM " + this.fusionTableID + " WHERE storeName = 'ESPRESSO ROYALE #37'" });
//layer.setMap(this.map);
//this.layers.push(layer);