# Electric vs Thermal vehicle calculator web app

Objective: compare the ecological merit of electric versus thermal vehicles.

* App presentation page: https://pierreh.eu/ev-calc (based on this README file)
* App page: https://pierreh.eu/ev-calc-app

Pierre Haessig, 2019–2020, CC-BY 4.0

Notice that the app is always a work in progress, even if, as of September 2020, I consider it to be in an acceptable “finished” state.
Please report any issues on [GitHub](https://github.com/pierre-haessig/ev-calc/issues) or by email.

![App banner](ev-calc-banner.svg)

## About the calculator

With this interactive calculator, you can compare the ecological merit
of an electric vehicle (EV) with a thermal vehicle
motored by an internal combustion engine (ICE).
The comparison is based on the *lifecycle global warming potential*,
that is counting [equivalent CO₂](https://en.wikipedia.org/wiki/Carbon_dioxide_equivalent) emissions.
Other interesting comparison criteria
such as effects on human health (like particulate matter or NOx emissions) are not included here.

The general idea is that, for its manufacturing,
an EV requires more energy than an ICE car because of its battery.
The EV has thus a “CO₂ debt” that can be repaid after traveling
*some distance* if, as one may expect, the EV indeed emits
less CO₂ during usage (CO₂ per unit distance).
The computation of this “distance to CO₂ parity” is the objective of
this calculator.

### Handling uncertain inputs

The distance to CO₂ parity depends on several inputs which value is difficult to
know precisely, so this calculator allows you to input
*lower and upper bounds* in addition to nominal values.
Then, using [interval arithmetic](https://en.wikipedia.org/wiki/Interval_arithmetic), it *propagates uncertainties* down to the final result.

This procedure allows checking the robustness of the conclusion on whether or not an electric powertrain is better than thermal one.
*Spoiler:* EV generally wins to ICE, unless using highly pessimistic inputs, like using 100% coal-based electricity for EV charging or the overly optimistic ICE fuel consumption data from the NEDC standard test.

### Beyond this app

Looking further than this slightly frivolous computational exercise,
my conclusion on this is clear: vehicles should be *light and small*.
If electric, they should be recharged with *low carbon electricity*.

(Perhaps the lightest one I know is my e-bike: 0.4 kWh battery, and about 7 Wh/km 😉.)

### Sharing calculator results

All the input choices in the calculator are reflected in the address bar. This means that sharing the complete URL (including the `?bs=...&round=true` part) does include all input values. The summer 2020 app update includes a “Share” button that copy this URL in one click.

### Related works

Comparisons of Electric vs Thermal vehicles have been done several times. Perhaps the most recent one, is the online tool [“How clean are electric cars?”](https://www.transportenvironment.org/what-we-do/electric-cars/how-clean-are-electric-cars) which was released in April 2020 by Transport & Environment (T&E). The companion report is well detailed. I’ve updated my calculator with their charging losses.

One striking feature of T&E’s analysis is to consider, over the lifetime of the electric vehicle, the forecasted decrease of CO₂ emissions for the electric grid of each European country.

## Inspiration

The inspiration for this calculator, started in spring 2019, comes from the blog article by Damien Ernst
[“Electric car: 697,612 km to become green! True or false?”](http://blogs.ulg.ac.be/damien-ernst/electric-697612-km-to-become-green-true-or-false/).
Prof. Ernst got negative feedback for his huge value for CO₂ parity distance
(~700 000 km in his first article), including some disrespectful comments,
but also more [constructive responses](https://innovationorigins.com/correcting-misinformation-about-greenhouse-gas-emissions-of-electric-vehicles-auke-hoekstras-response-to-damien-ernsts-calculations/).
This is why I’m proposing a *calculator*,
where people can put the input of their choice.
Thus, responsibility for the output value is shifted to the user!

Second, I got feedback that Ernst’s value had too many digits
(“697,612 km” in the first version)
which carries a false sense of a highly precise calculation despite the high input uncertainty.
This is what triggered my idea to make a calculator which *propagates
uncertainty* (using [interval arithmetic](https://en.wikipedia.org/wiki/Interval_arithmetic)).
This enables performing a “meaningful rounding” of outputs
based on their respective uncertainty.

Here is an implementation of Damien Ernst’s numbers in the calculator:
https://pierreh.eu/ev-calc-app/?bs=80&bmuco2_nom=127&bmuco2_lb=127&bmuco2_ub=127&evc_nom=20&evc_lb=20&evc_ub=20&cl_nom=0&cl_lb=0&cl_ub=0&cco2_nom=550&cco2_lb=550&cco2_ub=550&icec_nom=6&icec_lb=6&icec_ub=6&gco2_nom=2.28&gco2_lb=2.28&gco2_ub=2.28&round=false. This contains the first set of hypotheses of his blog post, which yields about 379 000 km before parity.

## References

*collection of a sound list of references is a work in progress*

### Production impact of Lithium-ion batteries

On the question of *“how much does Li-ion batteries production consumes energy
and generate greenhouse gases”*, there are substantial differences in the sources.

#### Damien Ernst’s figures

Damien Ernst used the following article in his [blog post](http://blogs.ulg.ac.be/damien-ernst/electric-697612-km-to-become-green-true-or-false/):

Yuan et al. “Manufacturing energy analysis of lithium ion battery pack for electric vehicles”.
*CIRP Annals*, vol. 66, n. 1, 2017. doi:10.1016/j.cirp.2017.04.109. https://bit.ly/2VMa4hA

from it, he extracts two energy intensity values:
* original value: 3700 MJ i.e. 1027 kWh per kWh of battery
* final value: 1936 MJ i.e. 538 kWh per kWh of battery (after applying some process efficiency correction due to upscaling)

Second, he multiplies this energy by a carbon emission intensity.
He chose 236 gCO₂/kWh, which yields 127 kgCO₂ per kWh of battery.

Based on subsequent references I found, his ~2000 MJ/kWh value
is on the high side of most estimates, but 236 gCO₂/kWh is very weak
(US electricity is around 500 gCO₂/kWh, says Ernst)
so that the product of the two, which is 127 kgCO₂/kWh battery, is slightly lower than several other estimates.

#### IVL 2017 report

Romare and Dahllöf. “The Life Cycle Energy Consumption and Greenhouse Gas Emissions from Lithium-Ion Batteries”.
Technical Report C 243, IVL Swedish Environmental Research Institute, May 2017. https://www.ivl.se/english/startpage/pages/publications/publication.html?id=5407

This 2017 report from the IVL Swedish Environmental Research Institute
analyzes several recent reviews on the topic.
The report summary states:

> [...] Based on our review greenhouse gas emissions of
> **150-200 kgCO₂-eq/kWh battery**
> looks to correspond to the greenhouse gas burden of current battery production.
> Energy use for battery manufacturing with current technology is about
> **350 – 650 MJ/kWh battery**.

350 – 650 MJ translates to 97 – 181 kWh (1 kWh = 3.6 MJ).

Interestingly enough, taking the ratio of the central values of the two manufacturing
impact factors (500 MJ i.e. 139 kWg/kWh and 175 kgCO₂/kWh) gives a CO₂ intensity
of 1260 g/kWh for the manufacturing energy, which is quite high (coal : 1000 g/kWh).

Also, they report a wider uncertainty in the energy use than in the CO₂ emission
and couldn’t fit in the first versions of my calculator which propagated uncertainty since I used,
like Ernst, the relation:

> CO₂ emissions = Manufacturing energy × CO₂ intensity of manufacturing energy

Finally, I confess there is one aspect I didn’t understand in IVL report:
they cite several reviews concluding that manufacturing energy was “likely to be”
around 1000 MJ/kWh (e.g. their “Peters (2017)” reference).
From this, I missed how they converged on their 350 – 650 MJ range.

#### FfE 2019 report

cited by Auke Hoekstra https://innovationorigins.com/correcting-misinformation-about-greenhouse-gas-emissions-of-electric-vehicles-auke-hoekstras-response-to-damien-ernsts-calculations/

> [...] I think the best and most recent source in the literature (from 2019) pegs it at 106 kg/kWh. And from industry insiders, I hear that large state-of-the-art factories are already at 65 kg/kWh.

Regett, Mauch, and Wagner. “Carbon footprint of electric vehicles - a plea for more objectivity”. Technical report, Forschungsstelle für Energiewirtschaft (FfE) e.V., February 2019. https://www.ffe.de/publikationen/pressemeldungen/856-klimabilanz-von-elektrofahrzeugen-ein-plaedoyer-fuer-mehr-sachlichkeit (German webpage with link to report in English)

> [...] Taking into account the assumptions and data documented in detail in the supplementary document, the energy-related GHG emissions amount to just under **106 kg CO₂ eq. per kWh** of battery capacity produced.
> [...] If the electricity for battery production is increasingly supplied from RES, the energy-related GHG emissions from battery production approach the emissions for raw material extraction and production of **62 kg CO₂ eq. per kWh** battery capacity.

#### IVL 2019 report

Emilsson and Dahllöf. “Lithium-Ion Vehicle Battery Production – Status 2019 on Energy Use, CO2 Emissions, Use of Metals, Products Environmental Footprint, and Recycling”. Technical Report No. C 444, IVL Swedish Environmental Research Institute, November 2019. https://www.ivl.se/english/startpage/pages/publications/publication.html?id=5808

This report is an update of the IVL 2017 report. Main result is:

> Based on the new and transparent data,
> an estimate of **61-106 kg CO₂-eq/kWh** battery capacity
> was calculated for the most common type, the NMC chemistry.
> The difference in the range depends mainly on varying
> the electricity mix for cell production.

Like in the FfE report, the lower end of the range of about 60 kg CO₂/kWh is for
“battery manufacturing with close-to 100 percent *fossil free electricity*”.
Authors comment that this is “not common yet, but likely will be in the future”.


#### Default values in the calculator for battery manufacturing

Although the formula “CO₂ emissions = Manufacturing energy × CO₂ intensity”
is nice to show the two ways to reduce battery manufacturing emissions,
I could not make it fit in my uncertainty propagation calculator.
Indeed, the uncertainty ranges reported in the literature for CO₂ emissions
are often narrower than the ranges obtained by the product of the separate ranges for
manufacturing energy and CO₂ intensity.
Interval arithmetic is a worst-case approach while the ranges found in metanalyses
are based on reliability judgments.

Therefore, the present version of the calculator only uses one input for manufacturing:
equivalent CO₂ emissions per kWh of battery.
The default range is the one from the most up-to-date analysis I found: IVL 2019.
I rounded the numbers to avoid a false sense of precision: **60 – 110 kgCO₂/kWh battery**.
The midpoint of the interval (90 kg CO₂/kWh with a pessimistic rounding)
serves as the nominal value.


### Car fuel consumption

Here are quantiles of real-world car fuel consumption taken from [Spritmonitor](https://www.spritmonitor.de/en/).

- Volkswagen Golf is used as a proxy for medium cars (Segment C: Peugeot 308 or Renault Megane).
- Volkswagen Polo is for small cars (Segment B: Peugeot 208 or Renault Zoe or Clio…)

| Quantile | Golf Gasoline | Polo Gasoline | Golf Diesel |
|---------:|--------------:|--------------:|------------:|
|     05 % |           5.2 |           4.8 |         4.6 |
|     10 % |           5.6 |           5.0 |         4.9 |
|     50 % |           6.5 |           6.0 |         5.6 |
|     90 % |           7.6 |           7.1 |         6.4 |
|     95 % |           8.0 |           7.5 |         6.7 |

I’ve used the quantiles 10% and 90% for the ranges.


### CO₂ content of fuels

Emissions due to fuel combustion depends on two main choices:
1. choice of fuel type, e.g. Gasoline or Diesel
2. choice to consider only direct emissions (the CO₂ produced by the combustion in the ICE)
  or the complete “Well-to-Wheels” emissions.
  Lifecycle fuel emissions add the emissions of CO₂,
  or other greenhouse gases like methane counted as equivalent CO₂,
  upstream of the combustion.
  They occur mainly during the extraction of crude oil and its refining
  and are collectively referred to as “Well-to-Tank” emissions.

The choice of fuel type is open. I’ve included presets for the two
most popular vehicle fuels in France: Gasoline and Diesel.

**Inclusion of upstream (Well-to-Tank) emissions is recommended**,
as highlighted by [Auke Hoekstra](https://innovationorigins.com/correcting-misinformation-about-greenhouse-gas-emissions-of-electric-vehicles-auke-hoekstras-response-to-damien-ernsts-calculations/),
since this is exactly what is considered for an EV: upstream emissions
of CO₂ to produce electricity.

In Ernst first calculation, he only considered direct emissions of gasoline,
for which he took 2.28 kgCO₂/l. In his revised blog post,
he increased this figure by a factor 1.4 to include upstream emissions.
The source of this factor is however imprecise (“[this] number was given to me several times”).
After reading the sources documented below, I believe this factor is in fact about 1.2.

In the end, for the Diesel and Gasoline presets of the calculator,
I’ve used data from the JEC Well-to-Wheels Analyses of 2014.
Gasoline is the default.

#### JEC Well-to-Wheels Analyses

[JEC](https://ec.europa.eu/jrc/en/jec) (JRC-Eucar-Concawe) is a collaboration
between the European Commission’s Joint Research Centre,
EUCAR (car industry) and CONCAWE (oil industry).

> The well-to-wheels analyses by JEC pursue the objectives of estimating:
>
> * greenhouse gas emissions,
> * energy efficiency and
> * industrial costs
>
> of a wide range of automotive fuels and power-trains options significant for Europe in 2020 and beyond.

The most recent reports are the v4.a from 2014.
For the upstream emission of conventional fuels, the relevant report is
the [Well-to-Tank Report](https://ec.europa.eu/jrc/en/publication/eur-scientific-and-technical-research-reports/well-tank-report-version-4a-jec-well-wheels-analysis) (EUR 26237 EN), in particular:

* §3.1 “From Resource to Fuel: production routes/Crude oil pathways”
* §4.2 “Final fuels: Energy and GHG balance/Crude oil based fuels (gasoline, diesel fuel)”
* Appendix 1 and 2 for summary data tables

Here is my conversion of JEC data in gCO₂/MJ<sub>fuel</sub> to kgCO₂/l:

* Gasoline: 2.80 kgCO₂/l [2.75 – 2.85]
* Diesel: 3.18 [3.12 – 3.23]
  * Remark 1: the higher CO₂ volumic content of Diesel fuel (+13 %) compared to Gasoline
    is mostly due to its higher density.
    The higher (+20 %) emissions of Diesel refining contributes to +2 % of the total difference.
  * Remark 2: it is more than compensated by the better efficiency
    of Diesel motors (fewer liters/100 km).

JEC uncertainty ranges come from the uncertainty of each processing step
which are combined “with a Monte Carlo simulation”.
Each range corresponds to the 20th and 80th percentiles of the Monte Carlo output.

One aspect is explicitly not taken into account: crude oil production
for **unconventional resources**, because it was not seen to hit European fuel market
by 2020, the horizon of the JEC 2014 report.
Still, they cite a 2012 analysis by IHS CERA for oil sand derived synthetic crude oil production.
The extra 10 – 20 gCO₂/MJ<sub>fuel</sub> to be added on top of the WTT total of about
15 gCO₂/MJ<sub>fuel</sub> means that oil sand could double up the upstream emissions
of gasoline (the 1.2 penalty would become 1.4).
Still, several years have passed since 2012, so an upgrade would be interesting
for two reasons:
1. US production of unconventional oil is has been growing faster than expected for many years.
2. extraction technologies may be changing rapidly, which impacts emission factors

#### Direct fuel emissions

For data on the *direct* emissions of CO₂ only, I’ve found
an article among probably many others.

Sullivan, et al. “CO₂ Emission Benefit of Diesel (versus Gasoline) Powered Vehicles”.
*Environmental Science & Technology*, vol. 38, n. 12, 2004. ACS Publications, https://pubs.acs.org/doi/full/10.1021/es034928d

* Gasoline: 2.36 kgCO₂/l [2.28 – 2.47]
* Diesel: 2.65 kgCO₂/l [2.58 – 2.71]

Uncertainty range comes from the uncertainty they report on fuel densities.

### Grid and charging losses

EV consumption is often specified as the energy drawn from the battery.
This number must be increased to account for losses during charging (inside the charger and inside the battery) and losses in the electricity grid.

Citing Transport & Environment “How clean are electric cars?” 2020 report:

> Electricity grid transmission and distribution losses are applied to each country based on IEA statistics.
> On average at EU level transmission and distribution losses increase the carbon intensity of the grid by about 7%.
> On top of this, 10% efficiency losses were added: 5% from the charger equipment and 5% from the battery charging efficiency.

As the calculator default value, I’ve used the combination of 10% and 7% losses, which is about **18%**, with a small ±1% uncertainty range.

### CO₂ emissions of electricity generation

* French mix: between 40 and 80 gCO₂/kWh, from various sources. Precision does not matter much when the emission factor is low.
* UE mix: 267 gCO₂/kWh in 2019 (296 gCO₂/kWh in 2018).
  Source: “The European Power Sector in 2019”, Agora Energiewende, February 2020 (page 31).
  - This needs a double-checking because other sources put it closer to 400 g, but I need to find authoritative figures. The difficulty is that it is decreasing quite fast along the years.
* German mix: 414 gCO₂/kWh for 2019 (472 gCO₂/kWh for 2018).
  Source: “The Energy Transition in the Power Sector: State of Affairs in 2019”, Agora Energiewende, January 2020 (page 39).
