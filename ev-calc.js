'use strict';
/* ev-calc, Pierre Haessig, 2019, CC-BY 4.0 */

// uncertain input (id prefixes)
var uncertain_in = ['bmue', 'mco2', 'evc', 'icec', 'cco2', 'gco2'];

var input_units = {
  bmue: 'kWh/kWh',
  mco2: 'gCO2/kWh',
  evc: 'kWh/100km',
  icec: 'l/100km',
  cco2: 'gCO2/kWh',
  gco2: 'kgCO2/l'
};

/**
 * Uncertain - creates an Uncertain number
 * @constructor
 *
 * @param  {Number} nom   nominal value
 * @param  {Number} lb    lower bound, optional
 * @param  {Number} ub    upper bound, optional (defaults to lb)
 * @param  {string} unit  unit, defaults to ''
 * @return {Uncertain}    Uncertain number object
 */
function Uncertain(nom, lb, ub, unit='') {
  this.nom = Number(nom);
  if (lb === undefined || lb > nom)
    this.lb = this.nom;
  else
    this.lb = Number(lb);
  if (ub === undefined || ub < nom)
    this.ub = this.nom;
  else
    this.ub = Number(ub);
  this.unit = String(unit);

  this.toString = function(){
    unit = this.unit ? ' ' + this.unit : '';
    return this.nom.toLocaleString('en-US') + unit + " [" +
           this.lb.toLocaleString('en-US') + " to " +
           this.ub.toLocaleString('en-US') + "]";
  }

  this.round = function() {
    //round all numbers to a reasonable precision
    var ue = this.ub - this.nom;
    var le = this.nom - this.lb;
    // error
    var e = Math.max(ue, le);

    function round_err(a, e){
      // round number a, tainted by error e, to a reasonable precision
      var n=0; // extra precision wanted
      var ref; // reference number for rounding
      if (e < Math.abs(a)/1e6) { // tiny error (or negative)
        ref = Math.abs(a)/1e6;
      }
      else if (e < Math.abs(a)) { // reasonable error
        ref = e;
      } else { // huge error
        ref = Math.abs(a);
      }
      // order of magnitude of the reference number
      var om = Math.pow(10, Math.floor(Math.log10(ref))-n);
      return Math.round(a/om)*om;
    }

    var nom = round_err(this.nom, e);
    var lb = round_err(this.lb, e);
    var ub = round_err(this.ub, e);

    return new Uncertain(nom, lb, ub, this.unit);
  }
}

function asUncertain(a) {
  if (!(a instanceof Uncertain)) a = new Uncertain(a);
  return a;
}

/* Arithmetic of Uncertain objects:
   addtion, substraction, multiplication and division (using inverse)
*/
function add(a,b) {
  a = asUncertain(a);
  b = asUncertain(b);
  var nom = a.nom + b.nom;
  var lb = a.lb + b.lb;
  var ub = a.ub + b.ub;
  return new Uncertain(nom, lb, ub);
}

function sub(a,b) {
  a = asUncertain(a);
  b = asUncertain(b);
  var nom = a.nom - b.nom;
  var lb = a.lb - b.ub;
  var ub = a.ub - b.lb;
  return new Uncertain(nom, lb, ub);
}

function mul(a,b) {
  a = asUncertain(a);
  b = asUncertain(b);
  var nom = a.nom * b.nom;
  var lb = Math.min(a.lb*b.lb, a.lb*b.ub, a.ub*b.lb, a.ub*b.ub);
  var ub = Math.max(a.lb*b.lb, a.lb*b.ub, a.ub*b.lb, a.ub*b.ub);
  return new Uncertain(nom, lb, ub);
}

function inv(a) {
  a = asUncertain(a);
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
  a = asUncertain(a);
  b = asUncertain(b);
  return mul(a,inv(b));
}


/******* Application logic *******/


/**
 * setInputs - set values of input fields
 *
 * @param  {object} vals mapping {id: value}
 */
function setInputs(vals) {
  for (var id in vals) {
    var input = document.getElementById(id);
    input.value = vals[id];
  }

  // update the calculator
  setFormBounds()
  update()
}


/**
 * collectInputs - collect calculator input data from the form
 *
 * @return {object} collection of Uncertain inputs
 */
function collectInputs() {
  // helper to get value from the form
  function get(id) {
    return document.getElementById(id).value;
  }

  // Battery size
  var bs_nom = get('bs');
  var bs = new Uncertain(bs_nom); //kWh

  var inputs = {bs: bs};

  for (let el of uncertain_in) {
    var in_nom = get(el + '_nom');
    var in_lb = get(el + '_lb');
    var in_ub = get(el + '_ub');
    var unit = input_units[el];
    var u = new Uncertain(in_nom, in_lb, in_ub, unit);
    inputs[el] = u;
  }

  // rounding of results
  inputs.round = document.getElementById('round').checked;

  return inputs
}


/**
 * computeOutputs - compute the Uncertain outputs of the calculator
 *
 * @param  {object} inputs collection of Uncertain inputs
 * @return {object}        collection of Uncertain outputs
 */
function computeOutputs(inputs) {
  // Battery manufacturing energy:
  var bme = mul(inputs.bs, inputs.bmue);
  bme.unit = 'kWh';
  // Battery manufacturing CO2:
  var bmco2 = mul(bme,
                  mul(inputs.mco2, 1e-3));
  bmco2.unit = 'kgCO2';

  // EV CO2 usage emission
  var evco2 = mul(inputs.evc,
                  mul(inputs.cco2, 1e-3)); //
  evco2.unit = 'kgCO2/100km';

  //ICE CO2
  var iceco2 = mul(inputs.icec, inputs.gco2);
  iceco2.unit = 'kgCO2/100km';

  // CO2 emission difference (ICE-EV)
  var diff_co2 = sub(iceco2,evco2);
  diff_co2.unit = 'kgCO2/100km';

  // Distance to CO2 parity:
  var dpar = div(bmco2,diff_co2) // 100 km
  dpar = mul(dpar, 100); // km
  dpar.unit = 'km';

  /*console.log('BM En: ' + bme);
  console.log('BM CO2: ' + bmco2);
  console.log('EV CO2: ' + evco2);
  console.log('ICE CO2: ' + iceco2);
  console.log('Diff CO2: ' + diff_co2);
  console.log('Distance to CO2 parity: ' + dpar);*/

  var outputs = {
    bme: bme,
    bmco2: bmco2,
    evco2: evco2,
    iceco2: iceco2,
    diff_co2: diff_co2,
    dpar: dpar
  };

  return outputs
}

function disp(id, o, round) {
  var val = o[id]; // Uncertain value
  var text = round ? val.round().toString() : val.toString();
  var el = document.getElementById(id);
  if (el.innerText == text) { // no change
    return;
  }
  else { // changed output
    if (el.classList.contains('changed')) { // cancel animation
        console.log('cancel animation');
        el.classList.remove('changed'); // doesn't work
        // todo: cancel the event listener?
      }
    el.innerText = text;
    el.classList.add('changed');
    if (el.onanimationend === null) { // remove class at the end of the animation
      el.onanimationend = function(){
        console.log('animation ended for ', id);
        this.classList.remove('changed')
      };
    }
  }
}

function displayOuputs(o, round) {
  var out_list = ['bme', 'bmco2', 'evco2', 'iceco2', 'diff_co2', 'dpar']

  for (var id of out_list) {
    disp(id, o, round);
  }
}


/**
 * updateLocation - update the address bar with the value of all the inputs,
 * without adding the the history.
 */
function updateLocation() {
  var location = window.location.href.split('?')[0];
  var sep = '?'
  var inputs = document.getElementsByTagName('input')
  for (var el of inputs) {
    if (el.type == 'number') {
      location += sep + el.name + '=' + el.value;
    }
    else if (el.type == 'checkbox') {
      // (notice that this encoding of checkbox is different from
      // a standard form submission)
      location += sep + el.name + '=' + el.checked;
    }
    sep = '&';
  }
  window.history.replaceState({}, '', location);
}



/**
 * populateForm - populate inputs from the location bar params,
 * if any
 */
function populateForm() {
  //read URL parameters from location bar
  var urlParams = new URL(window.location).searchParams;

  for (var [id,val] of urlParams.entries()) {
    // get corresponding <input>, if any
    var el = document.getElementById(id);
    if (el !== null && el.type == 'number') {
      el.value = val;
    }
    else if (el !== null && el.type == 'checkbox') {
      if (val=='false') {
        el.checked = false;
      }
      else if (val=='true') {
        el.checked = true;
      }
      else {
        console.warn('Wrong url param for checkbox: ', id, '=', val);
      }
    }
    else {
      console.warn('Wrong url param: ', id, '=', val);
    }
  }
}


/**
 * setFormBounds - set validity of lower and upper bounds inputs
 * with respect to the nominal value input
 */
function setFormBounds() {
  for (var el of uncertain_in) {
    var in_nom = document.getElementById(el + '_nom');
    var in_lb = document.getElementById(el + '_lb');
    var in_ub = document.getElementById(el + '_ub');

    if (in_nom.validity.valid) {
      in_lb.max = in_nom.value; // lower bound should be smaller than nominal
      if (Number(in_lb.value) > Number(in_nom.value))
        in_lb.value = in_nom.value;
      in_ub.min = in_nom.value; // upper bound should be greater than nominal
      if (Number(in_ub.value) < Number(in_nom.value))
        in_ub.value = in_nom.value;
    }
  }
}

/**
 * update - collect inputs, compute and display results
 */
function update() {
  console.log('update');
  var inputs = collectInputs();
  var outputs = computeOutputs(inputs);
  displayOuputs(outputs, inputs.round);
  updateLocation();
}

/**
 * onready - entry point of the program, lauched when page is loaded
 */
function onready() {
  console.log('doc loaded!')

  // First computation and display
  populateForm()
  setFormBounds()
  update()

  // Listen to form changes:
  var form = document.getElementsByTagName('form')['ev-calc'];
  form.addEventListener("input", function (event) {
    console.log('form input');
    update()
  }, false);

  // Setup form data validation

  for (let el of uncertain_in) {
    // add the dynamic cross validation of lower and upper bounds
    // with respect to the nominal value

    // usage of let instead of var is crucial
    // cf. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#Creating_closures_in_loops_A_common_mistake
    let in_nom = document.getElementById(el + '_nom');
    let in_lb = document.getElementById(el + '_lb');
    let in_ub = document.getElementById(el + '_ub');

    in_nom.addEventListener("change", function (event) {
      if (in_nom.validity.valid) {
        in_lb.max = in_nom.value; // lower bound should be smaller than nominal
        //in_lb.reportValidity();
        if (Number(in_lb.value) > Number(in_nom.value))
          in_lb.value = in_nom.value;
        in_ub.min = in_nom.value; // upper bound should be greater than nominal
        if (Number(in_ub.value) < Number(in_nom.value))
          in_ub.value = in_nom.value;
        //in_ub.reportValidity();
      }
    }, false);
  }

};

window.addEventListener("DOMContentLoaded", onready, false);
