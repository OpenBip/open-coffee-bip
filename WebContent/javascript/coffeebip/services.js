dojo.provide("coffeebip.services");

dojo.require("dojox.rpc.Service");
dojo.require("dojo.io.script");

coffeebip.services = new dojox.rpc.Service(
    dojo.moduleUrl("coffeebip", "googleTables.smd") );