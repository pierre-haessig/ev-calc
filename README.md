# Electric vs Thermal vehicle calculator web app

Objective: compare the ecological merit of electric versus thermal vehicles.

* App presentation page: https://pierreh.eu/ev-calc (based on this README file)
* App page: https://pierreh.eu/ev-calc-app

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

*collection of a sound list of references is a work in progress*

### Production impact of Lithium-ion batteries

On the question of *“how much does Li-ion batteries production consumes energy
and generate greenhouse gases”*, there are substantial differences in the sources.

#### Damien Ernst's figures

Damien Ernst used the following article in his [blog post](http://blogs.ulg.ac.be/damien-ernst/electric-697612-km-to-become-green-true-or-false/):

Yuan et al. “Manufacturing energy analysis of lithium ion battery pack for electric vehicles”.
*CIRP Annals*, vol. 66, n. 1, 2017. doi:10.1016/j.cirp.2017.04.109. https://bit.ly/2VMa4hA

from it, he extracts two energy intensity values:
* orginal value: 3700 MJ i.e. 1027 kWh per kWh of battery
* final value: 1936 MJ i.e. 538 kWh per kWh of battery (after applying some process efficiency correction due to upscaling)

Second, he multiplies this energy by a carbon emission intensity.
He chosed 236 gCO<sub>2</sub>/kWh, which yields 127 kgCO<sub>2</sub> per kWh of battery.

Based on subsequent references I found, his ~2000 MJ/kWh value
is on the high side of most estimates, but 236 gCO<sub>2</sub>/kWh is very weak
(US electricity is around 500 gCO<sub>2</sub>/kWh, says Ernst)
so that the product of the two, which is 127 kgCO<sub>2</sub>/kWh battery, is slightly lower than several other estimates.

#### IVL 2017 report

Romare and Dahllöf. “The Life Cycle Energy Consumption and Greenhouse Gas Emissions from Lithium-Ion Batteries”.
Technical Report C 243, IVL Swedish Environmental Research Institute, May 2017. https://www.ivl.se/english/startpage/pages/publications/publication.html?id=5407

This 2017 report from the IVL Swedish Environmental Research Institute
analyzes several recent reviews on the topic.
The report summary states:

> [...] Based on our review greenhouse gas emissions of
> **150-200 kgCO<sub>2</sub>-eq/kWh battery**
> looks to correspond to the greenhouse gas burden of current battery production.
> Energy use for battery manufacturing with current technology is about
> **350 – 650 MJ/kWh battery**.

350 – 650 MJ translates to 97 – 181 kWh (1 kWh = 3.6 MJ).

Interestingly enough, taking the ratio of the central values of the two manufacturing
impact factors (500 MJ i.e. 139 kWg/kWh and 175 kgCO<sub>2</sub>/kWh) gives a CO<sub>2</sub> intensity
of 1260 g/kWh for the manufacturing energy, which is a quite high (coal : 1000 g/kWh).

Also, they report a wider uncertainty in the energy use than in the CO<sub>2</sub> emission
and this cannot fit in my calculator which propagates uncertainty since I use,
like Ernst, the relation:

> CO<sub>2</sub> emissions = Manufacturing energy × CO<sub>2</sub> intensity of manufacturing energy

Finally, I confess there is one aspect I didn't understand in IVL report:
they cite several reviews concluding that manufacturing energy was “likely to be”
around 1000 MJ/kWh (e.g. their “Peters (2017)” reference).
From this, I missed how they converged on their 350 – 650 MJ range.

#### FeE report

cited by Auke Hoekstra https://innovationorigins.com/correcting-misinformation-about-greenhouse-gas-emissions-of-electric-vehicles-auke-hoekstras-response-to-damien-ernsts-calculations/

> [...] I think the best and most recent source in the literature (from 2019) pegs it at 106 kg/kWh. And from industry insiders, I hear that large state-of-the-art factories are already at 65 kg/kWh. 

Regett, Mauch, and Wagner. “Carbon footprint of electric vehicles - a plea for more objectivity”. Technical report, Forschungsstelle für Energiewirtschaft (FfE) e.V., February 2019. https://www.ffe.de/publikationen/pressemeldungen/856-klimabilanz-von-elektrofahrzeugen-ein-plaedoyer-fuer-mehr-sachlichkeit (German webpage with link to  report in English)

> [...] Taking into account the assumptions and data documented in detail in the supplementary document, the energy-related GHG emissions amount to just under **106 kg CO2 eq. per kWh** of battery capacity produced.
> [...] If the electricity for battery production is increasingly supplied from RES, the energy-related GHG emissions from battery production approach the emissions for raw material extraction and production of **62 kg CO2 eq. per kWh** battery capacity. 

#### Default values in the calculator

Based on the IVL report, including the reviews they cite, I concluded that
the formula “CO<sub>2</sub> emissions = Manufacturing energy × CO<sub>2</sub> intensity” can be misleading,
so I decided to set the default values for both Manufacturing energy and CO<sub>2</sub> intensity by
a formula inversion to satisfy these two goals:

1. CO<sub>2</sub> emissions for battery production:
   in the range **150 – 250 kgCO<sub>2</sub>/kWh battery**, with central value 200.
2. Energy use battery production: central value **1000 MJ i.e. 278 kWh/kWh battery**

Therefore, I set the CO<sub>2</sub> intensity for manufacturing energy to **720 gCO<sub>2</sub>/kWh**
(200/278×1000, quite carbon intensive), with an artificial *zero uncertainty*.
Also, I set the relative uncertainty of manufacturing energy to be my target
of ±50/200, which gives **750 – 1250 MJ ie. 208 – 347 kWh/kWh battery**.
This interval is a bit narrow, but at least the central value is ok.

Now, as I said in the introduction, if you are not satified with my choice, the calculator is meant to accept alternatives!

### CO<sub>2</sub> content of fuels

For the Diesel and Gasoline preset, I've used data from the appendix of:

Sullivan, et al. “CO<sub>2</sub> Emission Benefit of Diesel (versus Gasoline) Powered Vehicles”.
*Environmental Science & Technology*, vol. 38, n. 12, 2004. ACS Publications, https://pubs.acs.org/doi/full/10.1021/es034928d

* Gasoline: 2.36 kgCO<sub>2</sub>/l [2.28 – 2.47]
* Diesel: 2.65 kgCO<sub>2</sub>/l [2.58 – 2.71]
  * remark: the higher CO<sub>2</sub> volumic content of Diesel fuel
    compared to Gasoline is more than compensated by the increased efficiency
    of Diesel motors

Uncertainty range comes from the uncertainty they report on the fuel densities.

These data accounts for the *direct* emission of CO<sub>2</sub> only,
not *lifecycle* emissions of greenhouse gases in general.

#### Other interesting sources:

*left to be explored*

Wikipedia FR: [Émissions directes en CO<sub>2</sub> des combustibles](https://fr.wikipedia.org/wiki/Empreinte_carbone#%C3%89missions_directes_en_CO2_des_combustibles) (emissions directes et ACV)

### CO<sub>2</sub> emissions of electricy generation

* Enercoop:
  * my own 2019 bill: 13.4 gCO<sub>2</sub>/kWh
  * [Electricité Enercoop : quelles émissions de CO<sub>2</sub> en 2016 ?](https://www.enercoop.fr/content/electricite-enercoop-quelles-emissions-de-co2-en-2016-0)
