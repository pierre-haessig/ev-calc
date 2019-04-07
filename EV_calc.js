'use strict';

function add(a,b) {
  var nom = a.nom + b.nom;
  var lb = a.lb + b.lb;
  var ub = a.ub + b.ub;
  return new Uncertain(nom, lb, ub);
}

function sub(a,b) {
  var nom = a.nom - b.nom;
  var lb = a.lb - b.ub;
  var ub = a.ub - b.lb;
  return new Uncertain(nom, lb, ub);
}

function mul(a,b) {
  var nom = a.nom * b.nom;
  var lb = Math.min(a.lb*b.lb, a.lb*b.ub, a.ub*b.lb, a.ub*b.ub);
  var ub = Math.max(a.lb*b.lb, a.lb*b.ub, a.ub*b.lb, a.ub*b.ub);
  return new Uncertain(nom, lb, ub);
}

function inv(a) {
  var nom = 1/a.nom;
  if (a.ub*a.lb >= 0) { // same sign
    var lb = 1/a.ub;
    var ub = 1/a.lb;
  } else {
    var lb = -Infinity;
    var ub = +Infinity;
  }
  return new Uncertain(nom, lb, ub);
}

function div(a,b) {
  return mul(a,inv(b));
}

function Uncertain(nom, lb, ub) {
  this.nom = nom;
  this.lb = lb;
  this.ub = ub;

  this.toString = function(){
    return this.nom.toLocaleString() + " [" +
           this.lb.toLocaleString() + ", " +
           this.ub.toLocaleString() + "]";
  }

  this.round = function(n) {
    //round the number to a reasonable precision
    var ue = this.ub - this.nom;
    var le = this.nom - this.lb;
    // error
    var e = Math.max(ue, le);
    // order of magnitude of the error (lower rounding);
    var eom = Math.pow(10,Math.floor(Math.log10(e))-n);

    var nom = Math.round(this.nom/eom)*eom;
    var lb = Math.floor(this.lb/eom)*eom;
    var ub = Math.ceil(this.ub/eom)*eom;

    return new Uncertain(nom, lb, ub);
  }
}

// Batt size:
var bs = new Uncertain(80, 70, 90); //kWh
// Batt man unit energy:
var bmue = new Uncertain(154.88/80*277.78, 500, 600);//kWh/kWh
//Batt man energy: // kWh
var bme = mul(bs,bmue);
console.log('BM En: ' + bme + ' kWh');
//Man CO2:
var mco2 = new Uncertain(0.236, 0.2, 0.3); // kgCO2/kWh
//Batt man CO2:
var bmco2 = mul(bme, mco2);
console.log('BM CO2: ' + bmco2 + ' kgCO2');

//EV consum	20	kWh/100 km
var evc = new Uncertain(20, 19, 21); // kWh/100 km
//ICE consum
var icec = new Uncertain(6, 5.8, 6.2); // l/100 km

// charging CO2
var cco2 = new Uncertain(0.550, 0.5, 0.6); // kgCO2/kWh
// Gasoline CO2
var gco2 = new Uncertain(2.28, 2.25, 2.3); // kgCO2/l

//EV CO2
var evco2 = mul(evc,cco2); //kgCO2/100 km
console.log('EV CO2: ' + evco2 + ' kgCO2/100 km');
//ICE CO2
var iceco2 = mul(icec,gco2); //kgCO2/100 km
console.log('ICE CO2: ' + iceco2 + ' kgCO2/100 km');
// CO2 emission difference (ICE-EV)
var diff_co2 = sub(iceco2,evco2);
console.log('Diff CO2: ' + diff_co2 + ' kgCO2/100 km');

// Distance to CO2 parity:
var dpar = div(bmco2,diff_co2) // 100 km
dpar = mul(dpar, new Uncertain(100,100,100)); // km
console.log('Distance to CO2 parity: ' + dpar + ' km');


function onready() {
  console.log('doc loaded!')
  document.getElementById('dpar').innerText = dpar.round(1) + ' km';
};

window.addEventListener("DOMContentLoaded", onready, false);
