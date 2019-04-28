# Electric vs Thermal vehicle calculator web app

Pierre Haessig, April 2019, CC-BY 4.0


## About the calculator

With this interactive calculator, you can compare the ecological merit
(in terms of lifecycle CO<sub>2</sub> emissions)
of an electric vehicle (EV) with a thermal vehicle
motored by an internal combustion engine (ICE).

The general idea is that, for its manufacturing,
an EV requires more energy than an ICE car because of its battery.
The EV has thus a “CO<sub>2</sub> debt” that can be repaid after traveling
*some distance* if, as one may expect, the EV indeed emits
less CO<sub>2</sub> during usage (CO<sub>2</sub> per unit distance).
The computation of this “distance to CO<sub>2</sub> parity” is the objective of
this calculator.

Distance to CO<sub>2</sub> parity depends on several inputs which value is difficult to
know precisely, so this calculator allows you to input
*lower and upper bounds* in addition to nominal values.
Then, it *propagates this uncertainty intervals* down to the final result.
Playing a bit with the numbers, in particular using coal-based electricity
for EV charging, the distance can get negative (EV loses to ICE)!
Also, wide input uncertainty can lead to infinite uncertainty
for parity distance.

My conclusion on this is clear: all vehicles should be *light and small*,
and, if electric, should be recharged with *green electricity*.
Indeed, with a small battery, EVs are definetely better than combustion-powered cars.
My e-bike has only a 300 Wh (0.3 kWh) battery and consumes 6—11 Wh/km.

## Sharing calculator results

All the input choices in the calculator are reflected in the address bar. This means that sharing the complete URL (including the `?bs=...&round=true` part) does include all input values.

## Inspiration

The inspiration for this calculator comes from the blog article by Damien Ernst
[“Electric car: 697,612 km to become green! True or false?”](http://blogs.ulg.ac.be/damien-ernst/electric-697612-km-to-become-green-true-or-false/).
Prof. Ernst got negative feedback for his huge value for CO<sub>2</sub> parity distance
(~700 000 km in his first article), including some disrespectful comments,
but also more [constructive responses](https://innovationorigins.com/correcting-misinformation-about-greenhouse-gas-emissions-of-electric-vehicles-auke-hoekstras-response-to-damien-ernsts-calculations/).
This is why I'm proposing a *calculator*,
where people can put the input of their choice.
Thus, responsibility for the output value is shifted to the user!

Second, I got feedback that Ernst's value had too many digits
(“697,612 km” in the first version)
which carries a false sense of a highly precise calculation despite the high input uncertainty.
This is what triggered my idea to make a calculator which *propagates
uncertainty* (using [interval arithmetic](https://en.wikipedia.org/wiki/Interval_arithmetic)).
This enables performing a “meaningful rounding” of outputs
based on their respective uncertainty.

Here is an implementation of Damien Ernst's numbers in the calculator:
https://pierreh.eu/ev-calc-app/?bs=80&bmue_nom=538&bmue_lb=538&bmue_ub=538&mco2_nom=236&mco2_lb=236&mco2_ub=236&evc_nom=20&evc_lb=20&evc_ub=23&icec_nom=6&icec_lb=6&icec_ub=6&cco2_nom=550&cco2_lb=317&cco2_ub=550&gco2_nom=2.28&gco2_lb=2.28&gco2_ub=3.2&round=false

## References

*work in progress*

### CO<sub>2</sub> content of fuels

Sullivan, et al. “CO<sub>2</sub> Emission Benefit of Diesel (versus Gasoline) Powered Vehicles”.
*Environmental Science & Technology*, vol. 38, n. 12, 2004. ACS Publications, https://pubs.acs.org/doi/full/10.1021/es034928d

Wikipedia FR: [Émissions directes en CO<sub>2</sub> des combustibles](https://fr.wikipedia.org/wiki/Empreinte_carbone#%C3%89missions_directes_en_CO2_des_combustibles) (emissions directes et ACV)

### CO<sub>2</sub> emissions of electricy generation

* Enercoop:
  * my own 2019 bill: 13.4 gCO<sub>2</sub>/kWh
  * [Electricité Enercoop : quelles émissions de CO<sub>2</sub> en 2016 ?](https://www.enercoop.fr/content/electricite-enercoop-quelles-emissions-de-co2-en-2016-0)
