/** @module coffeebip.Transaction */
dojo.provide("coffeebip.Transaction");

/**
 * 
 * @class coffeebip.Transaction
 */
dojo.declare("coffeebip.Transaction",
  null,
  
  {
    shop: null,
    dateInMillis: -1,
    amount: -1,
    
    constructor: function(shop, dateInMillis, amount) {
      this.shop = shop;
      this.dateInMillis = Number(dateInMillis);
      this.amount = Number(amount);
      
    },
    
    isEspressoRoyale37: function() {
      return this.shop.storeName == "ESPRESSO ROYALE #37";
    },
    
    isEspressoRoyale6: function() {
      return this.shop.storeName == "ESPRESSO ROYALE #6";
    },
    
    isEspressoRoyale9: function() {
      return this.shop.storeName == "ESPRESSO ROYALE #9";
    },
    
    isEspressoRoyale40: function() {
      return this.shop.storeName == "ESPRESSO ROYALE #40";
    },
    
    isSweetwatersPlymouth: function() {
      return this.shop.storeName == "SWEETWATERS COFFEE & TEA";
    },
    
    isSweetwatersKerryTown: function() {
      return this.shop.storeName == "SWEETWATERS CAFE-ANN A";
    },
    
    isBiggby155: function() {
      return this.shop.storeName == "BIGGBY COFFEE #155";
    },
    
    isBiggby274: function() {
      return this.shop.storeName == "BIGGBY COFFEE #274";
    },
    
    isStarbucks: function() {
      return this.shop.storeName == "STARBUCKS";
    },
    
    isMightyGood: function() {
      return this.shop.storeName == "MIGHTY GOOD COFFEE COMPAN";
    }
  }
);