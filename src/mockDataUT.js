const MOCK_DOCUMENTS = [
  {
    "id": 33,
    "title": "Rule 101 - General Requirements",
    "description": "The regulation titled 'Rule 101' addresses general requirements. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-101/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 34,
    "title": "Rule 102 - General Requirements: Broadly Applicable Requirements",
    "description": "The regulation titled 'Rule 102' addresses general requirements: broadly applicable requirements. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-102/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 35,
    "title": "Rule 103 - Administrative Procedures",
    "description": "The regulation titled 'Rule 103' addresses administrative procedures. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-103/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 36,
    "title": "Rule 104 - Conflict of Interest",
    "description": "The regulation titled 'Rule 104' addresses conflict of interest. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-104/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 37,
    "title": "Rule 105 - General Requirements: Emergency Controls",
    "description": "The regulation titled 'Rule 105' addresses general requirements: emergency controls. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-105/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 38,
    "title": "Rule 107 - General Requirements: Breakdowns",
    "description": "The regulation titled 'Rule 107' addresses general requirements: breakdowns. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-107/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 39,
    "title": "Rule 110 - General Requirements: State Implementation Plan",
    "description": "The regulation titled 'Rule 110' addresses general requirements: state implementation plan. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-110/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 40,
    "title": "Rule 115 - General Conformity",
    "description": "The regulation titled 'Rule 115' addresses general conformity. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-110/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 41,
    "title": "Rule 120 - General Requirements: Tax Exemption for Air Pollution Control Equipment",
    "description": "The regulation titled 'Rule 120' addresses general requirements: tax exemption for air pollution control equipment. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-120/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 42,
    "title": "Rule 122 - General Requirements: Heavy Duty Vehicle Tax Credit",
    "description": "The regulation titled 'Rule 122' addresses general requirements: heavy duty vehicle tax credit. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-122/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 43,
    "title": "Rule 123 - General Requirements: Clean Fuels and Emission Reduction Technology Program",
    "description": "The regulation titled 'Rule 123' addresses general requirements: clean fuels and emission reduction technology program. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-123/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 44,
    "title": "Rule 124 - General Requirements: Conversion to Alternative Fuel Grant Program",
    "description": "The regulation titled 'Rule 124' addresses general requirements: conversion to alternative fuel grant program. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-124/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 45,
    "title": "Rule 125 - Clean Air Retrofit, Replacement, and Off-Road Technology Program",
    "description": "The regulation titled 'Rule 125' addresses clean air retrofit, replacement, and off-road technology program. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-125/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 46,
    "title": "Rule 130 - General Penalty Policy",
    "description": "The regulation titled 'Rule 130' addresses general penalty policy. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-130/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 47,
    "title": "Rule 135 - Enforcement Response Policy for Asbestos Hazard Emergency Response Act",
    "description": "The regulation titled 'Rule 135' addresses enforcement response policy for asbestos hazard emergency response act. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-135/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 48,
    "title": "Rule 150 - Emission Inventories",
    "description": "The regulation titled 'Rule 150' addresses emission inventories. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-150/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 49,
    "title": "Rule 165 - Stack Testing",
    "description": "The regulation titled 'Rule 165' addresses stack testing. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-165/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 50,
    "title": "Rule 170 - Continuous Emission Monitoring Program",
    "description": "The regulation titled 'Rule 170' addresses continuous emission monitoring program. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-170/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 51,
    "title": "Rule 201 - Emission Standards: General Emission Standards",
    "description": "The regulation titled 'Rule 201' addresses emission standards: general emission standards. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-201/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 52,
    "title": "Rule 202 - Emission Standards: General Burning",
    "description": "The regulation titled 'Rule 202' addresses emission standards: general burning. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-202/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 53,
    "title": "Rule 203 - Emission Standards: Sulfur Content of Fuels",
    "description": "The regulation titled 'Rule 203' addresses emission standards: sulfur content of fuels. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-203/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 54,
    "title": "Rule 204 - Emission Standards: Smoke Management",
    "description": "The regulation titled 'Rule 204' addresses emission standards: smoke management. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-204/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 55,
    "title": "Rule 205 - Emission Standards: Fugitive Emissions and Fugitive Dust",
    "description": "The regulation titled 'Rule 205' addresses emission standards: fugitive emissions and fugitive dust. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-205/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 56,
    "title": "Rule 206 - Emission Standards: Abrasive Blasting",
    "description": "The regulation titled 'Rule 206' addresses emission standards: abrasive blasting. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-206/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 57,
    "title": "Rule 207 - Residential Fireplaces and Solid Fuel Burning Devices",
    "description": "The regulation titled 'Rule 207' addresses residential fireplaces and solid fuel burning devices. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-207/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 58,
    "title": "Rule 208 - Outdoor Wood Boilers",
    "description": "The regulation titled 'Rule 208' addresses outdoor wood boilers. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-208/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 59,
    "title": "Rule 210 - Standards of Performance for New Stationary Sources",
    "description": "The regulation titled 'Rule 210' addresses standards of performance for new stationary sources. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-210/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 60,
    "title": "Rule 214 - National Emission Standards for Hazardous Air Pollutants",
    "description": "The regulation titled 'Rule 214' addresses national emission standards for hazardous air pollutants. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-214/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 61,
    "title": "Rule 220 - Emission Standards: Plan for Designated Facilities",
    "description": "The regulation titled 'Rule 220' addresses emission standards: plan for designated facilities. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-220/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 62,
    "title": "Rule 221 - Emission Standards: Emission Controls for Existing Municipal Solid Waste Landfills",
    "description": "The regulation titled 'Rule 221' addresses emission standards: emission controls for existing municipal solid waste landfills. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-221/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 63,
    "title": "Rule 222 - Emission Standards: Existing Incinerators for Hospital, Medical, Infectious Waste",
    "description": "The regulation titled 'Rule 222' addresses emission standards: existing incinerators for hospital, medical, infectious waste. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-222/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 64,
    "title": "Rule 223 - Emission Standards: Existing Small Municipal Waste Combustion Units",
    "description": "The regulation titled 'Rule 223' addresses emission standards: existing small municipal waste combustion units. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-223/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 65,
    "title": "Rule 224 - Mercury Emission Standards: Coal-Fired Electric Generating Units",
    "description": "The regulation titled 'Rule 224' addresses mercury emission standards: coal-fired electric generating units. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-224/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 66,
    "title": "Rule 230 - NOx Emission Limits for Natural Gas-Fired Water Heaters",
    "description": "The regulation titled 'Rule 230' addresses nox emission limits for natural gas-fired water heaters. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-230/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 67,
    "title": "Rule 240 - Prescribed Burning",
    "description": "The regulation titled 'Rule 240' addresses prescribed burning. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-240/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 68,
    "title": "Rule 250 - Western Backstop Sulfur Dioxide Trading Program",
    "description": "The regulation titled 'Rule 250' addresses western backstop sulfur dioxide trading program. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-250/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 69,
    "title": "Rule 302 - Solid Fuel Burning Devices",
    "description": "The regulation titled 'Rule 302' addresses solid fuel burning devices. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-302/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 70,
    "title": "Rule 303 - Commercial Cooking",
    "description": "The regulation titled 'Rule 303' addresses commercial cooking. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-303/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 71,
    "title": "Rule 304 - Solvent Cleaning",
    "description": "The regulation titled 'Rule 304' addresses solvent cleaning. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-304/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 72,
    "title": "Rule 305 - Nonattainment and Maintenance Areas for PM10: Emission Standards",
    "description": "The regulation titled 'Rule 305' addresses nonattainment and maintenance areas for pm10: emission standards. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-305/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 73,
    "title": "Rule 306 - PM10 Nonattainment and Maintenance Areas: Abrasive Blasting",
    "description": "The regulation titled 'Rule 306' addresses pm10 nonattainment and maintenance areas: abrasive blasting. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-306/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 74,
    "title": "Rule 307 - Road Salting and Sanding",
    "description": "The regulation titled 'Rule 307' addresses road salting and sanding. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-307/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 75,
    "title": "Rule 309 - Nonattainment and Maintenance Areas for PM10 and PM2.5: Fugitive Emissions and Fugitive Dust",
    "description": "The regulation titled 'Rule 309' addresses nonattainment and maintenance areas for pm10 and pm2.5: fugitive emissions and fugitive dust. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-309/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 76,
    "title": "Rule 310 - Salt Lake County: Trading of Emission Budgets for Transportation Conformity",
    "description": "The regulation titled 'Rule 310' addresses salt lake county: trading of emission budgets for transportation conformity. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-310/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 77,
    "title": "Rule 311 - Utah County: Trading of Emission Budgets for Transportation Conformity",
    "description": "The regulation titled 'Rule 311' addresses utah county: trading of emission budgets for transportation conformity. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-311/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 78,
    "title": "Rule 312 - Aggregate Processing Operations for PM2.5 Nonattainment Areas",
    "description": "The regulation titled 'Rule 312' addresses aggregate processing operations for pm2.5 nonattainment areas. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-312/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 79,
    "title": "Rule 313 - VOC and Blue Smoke Controls for Hot Mix Asphalt Plants",
    "description": "The regulation titled 'Rule 313' addresses voc and blue smoke controls for hot mix asphalt plants. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-313/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 80,
    "title": "Rule 315 - NOx Emission Controls for Natural Gas-Fired Boilers 2.0-5.0 MMBtu",
    "description": "The regulation titled 'Rule 315' addresses nox emission controls for natural gas-fired boilers 2.0-5.0 mmbtu. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-315/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 81,
    "title": "Rule 316 - NOx Emission Controls for Natural Gas-Fired Boilers Greater Than 5.0 MMBtu",
    "description": "The regulation titled 'Rule 316' addresses nox emission controls for natural gas-fired boilers greater than 5.0 mmbtu. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-316/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 82,
    "title": "Rule 320 - Ozone Maintenance Areas and Ogden City: Employer-Based Trip Reduction Program",
    "description": "The regulation titled 'Rule 320' addresses ozone maintenance areas and ogden city: employer-based trip reduction program. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-320/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 83,
    "title": "Rule 325 - Ozone Nonattainment and Maintenance Areas: General Requirements",
    "description": "The regulation titled 'Rule 325' addresses ozone nonattainment and maintenance areas: general requirements. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-325/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 84,
    "title": "Rule 326 - Ozone Nonattainment and Maintenance Areas: Control of Hydrocarbon Emissions in Petroleum Refineries",
    "description": "The regulation titled 'Rule 326' addresses ozone nonattainment and maintenance areas: control of hydrocarbon emissions in petroleum refineries. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-326/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 85,
    "title": "Rule 327 - Ozone Nonattainment and Maintenance Areas: Petroleum Liquid Storage",
    "description": "The regulation titled 'Rule 327' addresses ozone nonattainment and maintenance areas: petroleum liquid storage. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-327/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 86,
    "title": "Rule 328 - Gasoline Transfer and Storage",
    "description": "The regulation titled 'Rule 328' addresses gasoline transfer and storage. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-328/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 87,
    "title": "Rule 335 - Degreasing",
    "description": "The regulation titled 'Rule 335' addresses degreasing. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-335/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 88,
    "title": "Rule 341 - Ozone Nonattainment and Maintenance Areas: Cutback Asphalt",
    "description": "The regulation titled 'Rule 341' addresses ozone nonattainment and maintenance areas: cutback asphalt. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-341/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 89,
    "title": "Rule 342 - Adhesives and Sealants",
    "description": "The regulation titled 'Rule 342' addresses adhesives and sealants. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-342/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 90,
    "title": "Rule 343 - Wood Furniture Manufacturing Operations",
    "description": "The regulation titled 'Rule 343' addresses wood furniture manufacturing operations. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-343/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 91,
    "title": "Rule 344 - Paper, Film, and Foil Coatings",
    "description": "The regulation titled 'Rule 344' addresses paper, film, and foil coatings. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-344/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 92,
    "title": "Rule 345 - Fabric and Vinyl Coatings",
    "description": "The regulation titled 'Rule 345' addresses fabric and vinyl coatings. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-345/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 93,
    "title": "Rule 346 - Metal Furniture Surface Coatings",
    "description": "The regulation titled 'Rule 346' addresses metal furniture surface coatings. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-346/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 94,
    "title": "Rule 347 - Large Appliance Surface Coatings",
    "description": "The regulation titled 'Rule 347' addresses large appliance surface coatings. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-347/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 95,
    "title": "Rule 348 - Magnet Wire Coatings",
    "description": "The regulation titled 'Rule 348' addresses magnet wire coatings. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-348/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 96,
    "title": "Rule 349 - Flat Wood Paneling Coatings",
    "description": "The regulation titled 'Rule 349' addresses flat wood paneling coatings. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-349/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 97,
    "title": "Rule 350 - Miscellaneous Metal Parts and Products Coatings",
    "description": "The regulation titled 'Rule 350' addresses miscellaneous metal parts and products coatings. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-350/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 98,
    "title": "Rule 351 - Graphic Arts",
    "description": "The regulation titled 'Rule 351' addresses graphic arts. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-351/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 99,
    "title": "Rule 352 - Metal Container, Closure, and Coil Coatings",
    "description": "The regulation titled 'Rule 352' addresses metal container, closure, and coil coatings. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-352/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 100,
    "title": "Rule 353 - Plastic Parts Coatings",
    "description": "The regulation titled 'Rule 353' addresses plastic parts coatings. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-353/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 101,
    "title": "Rule 354 - Automotive Refinishing Coatings",
    "description": "The regulation titled 'Rule 354' addresses automotive refinishing coatings. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-354/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 102,
    "title": "Rule 355 - Aerospace Manufacture and Rework Facilities",
    "description": "The regulation titled 'Rule 355' addresses aerospace manufacture and rework facilities. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-355/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 103,
    "title": "Rule 356 - Appliance Pilot Light",
    "description": "The regulation titled 'Rule 356' addresses appliance pilot light. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-356/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 104,
    "title": "Rule 357 - Consumer Products",
    "description": "The regulation titled 'Rule 357' addresses consumer products. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-357/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 105,
    "title": "Rule 361 - Architectural Coatings",
    "description": "The regulation titled 'Rule 361' addresses architectural coatings. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-361/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 106,
    "title": "Rule 401 - Permit: New and Modified Sources",
    "description": "The regulation titled 'Rule 401' addresses permit: new and modified sources. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-401/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 107,
    "title": "Rule 403 - Permits: New and Modified Sources in Nonattainment Areas and Maintenance Areas",
    "description": "The regulation titled 'Rule 403' addresses permits: new and modified sources in nonattainment areas and maintenance areas. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-403/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 108,
    "title": "Rule 405 - Permits: Major Sources in Attainment or Unclassified Areas (PSD)",
    "description": "The regulation titled 'Rule 405' addresses permits: major sources in attainment or unclassified areas (psd). It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-405/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 109,
    "title": "Rule 406 - Visibility",
    "description": "The regulation titled 'Rule 406' addresses visibility. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-406/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 110,
    "title": "Rule 410 - Permits: Emissions Impact Analysis",
    "description": "The regulation titled 'Rule 410' addresses permits: emissions impact analysis. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-410/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 111,
    "title": "Rule 414 - Permits: Fees for Approval Orders",
    "description": "The regulation titled 'Rule 414' addresses permits: fees for approval orders. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-414/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 112,
    "title": "Rule 415 - Permits: Operating Permit Requirements",
    "description": "The regulation titled 'Rule 415' addresses permits: operating permit requirements. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-415/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 113,
    "title": "Rule 417 - Permits: Acid Rain Sources",
    "description": "The regulation titled 'Rule 417' addresses permits: acid rain sources. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-417/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 114,
    "title": "Rule 420 - Permits: Ozone Offset Requirements in Davis and Salt Lake Counties",
    "description": "The regulation titled 'Rule 420' addresses permits: ozone offset requirements in davis and salt lake counties. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-420/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 115,
    "title": "Rule 421 - Permits: PM10 Offset Requirements in Salt Lake County and Utah County",
    "description": "The regulation titled 'Rule 421' addresses permits: pm10 offset requirements in salt lake county and utah county. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-421/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 116,
    "title": "Rule 424 - Permits: Mercury Requirements for Electric Generating Units",
    "description": "The regulation titled 'Rule 424' addresses permits: mercury requirements for electric generating units. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-424/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 117,
    "title": "Rule 501 - Oil and Gas Industry: General Provisions",
    "description": "The regulation titled 'Rule 501' addresses oil and gas industry: general provisions. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-501/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 118,
    "title": "Rule 502 - Oil and Gas Industry: Pneumatic Controllers",
    "description": "The regulation titled 'Rule 502' addresses oil and gas industry: pneumatic controllers. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-502/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 119,
    "title": "Rule 503 - Oil and Gas Industry: Flares",
    "description": "The regulation titled 'Rule 503' addresses oil and gas industry: flares. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-503/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 120,
    "title": "Rule 504 - Oil and Gas Industry: Tank Truck Loading",
    "description": "The regulation titled 'Rule 504' addresses oil and gas industry: tank truck loading. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-504/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 121,
    "title": "Rule 505 - Oil and Gas Industry: Registration Requirements",
    "description": "The regulation titled 'Rule 505' addresses oil and gas industry: registration requirements. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-505/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 122,
    "title": "Rule 506 - Oil and Gas Industry: Storage Vessel",
    "description": "The regulation titled 'Rule 506' addresses oil and gas industry: storage vessel. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-506/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 123,
    "title": "Rule 507 - Oil and Gas Industry: Dehydrators",
    "description": "The regulation titled 'Rule 507' addresses oil and gas industry: dehydrators. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-507/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 124,
    "title": "Rule 508 - Oil and Gas Industry: VOC Control Devices",
    "description": "The regulation titled 'Rule 508' addresses oil and gas industry: voc control devices. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-508/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 125,
    "title": "Rule 509 - Oil and Gas Industry: Leak Detection and Repair Requirements",
    "description": "The regulation titled 'Rule 509' addresses oil and gas industry: leak detection and repair requirements. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-509/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 126,
    "title": "Rule 510 - Oil and Gas Industry: Natural Gas Engine Requirements",
    "description": "The regulation titled 'Rule 510' addresses oil and gas industry: natural gas engine requirements. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-510/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 127,
    "title": "Rule 511 - Oil and Gas Industry: Associated Gas Flaring",
    "description": "The regulation titled 'Rule 511' addresses oil and gas industry: associated gas flaring. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-511/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 128,
    "title": "Rule 801 - Utah Asbestos Rule",
    "description": "The regulation titled 'Rule 801' addresses utah asbestos rule. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-801/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 129,
    "title": "Rule 840 - Lead-Based Paint Program Purpose, Applicability, and Definitions",
    "description": "The regulation titled 'Rule 840' addresses lead-based paint program purpose, applicability, and definitions. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-840/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 130,
    "title": "Rule 841 - Residential Property and Child-Occupied Facility Renovation",
    "description": "The regulation titled 'Rule 841' addresses residential property and child-occupied facility renovation. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-841/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  },
  {
    "id": 131,
    "title": "Rule 842 - Lead-Based Paint Activities",
    "description": "The regulation titled 'Rule 842' addresses lead-based paint activities. It likely includes requirements related to emissions limits, monitoring procedures, permitting processes, or enforcement mechanisms. These provisions help maintain clean air standards and ensure regulated sources comply with state and federal law.",
    "jurisdiction": "Utah",
    "type": "Regulation",
    "adoptedDate": null,
    "effectiveDate": null,
    "url": "https://adminrules.utah.gov/public/rule/R307-842/Current%20Rules?searchText=undefined",
    "keywords": [
      "emissions",
      "monitoring",
      "permitting"
    ]
  }
];

export default MOCK_DOCUMENTS;