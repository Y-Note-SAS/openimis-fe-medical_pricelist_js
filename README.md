# openIMIS Frontend Claim/ MedicalPricelist reference module
This repository holds the files of the openIMIS Frontend Claim reference module.

> NOTE: This branch contains development version of this module based on Vite. Please use the `release/26.04` branch if you intend to fix issues via Pull Requests for the [current release](https://openimis.atlassian.net/wiki/spaces/OP/pages/4653678593/Sources+Release+2026-04) of openIMIS. The migration to vite is scheduled to conclude by end of June 2026.

It is dedicated to be deployed as a module of [openimis-fe_js](https://github.com/openimis/openimis-fe_js).

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/openimis/openimis-fe-medical_pricelist_js.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/openimis/openimis-fe-medical_pricelist_js/alerts/)

## Main Menu Contributions

None (Administration module providing menu entries to proxied pages for medical items and services price lists)

## Other Contributions

- `core.Boot`: `PriceListLoader`, load the price lists associated to a health facility

## Available Contribution Points

None

## Published Components

None

## Dispatched Redux Actions

- `MEDICAL_PRICELIST_LOAD_{REQ|RESP|ERR}`: loading the pricelist associated to a Health Facility

## Other Modules Listened Redux Actions

- `CLAIM_EDIT_HEALTH_FACILITY_SET`: triggering the load of the price lists (items and services) associated to a health facility

## Configurations Options

None
