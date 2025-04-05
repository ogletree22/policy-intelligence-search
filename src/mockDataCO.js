const MOCK_DOCUMENTS = [
  {
    "id": 1,
    "title": "Air Quality Standards, Designations and Emission Budgets",
    "description": "'Air Quality Standards, Designations and Emission Budgets' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "08/15/24",
    "effectiveDate": "10/15/24",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11650&fileName=5%20CCR%201001-14",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 2,
    "title": "Common Provisions Regulation",
    "description": "'Common Provisions Regulation' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "10/16/24",
    "effectiveDate": "12/15/24",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11723&fileName=5%20CCR%201001-2",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 3,
    "title": "Procedural Rules",
    "description": "'Procedural Rules' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "12/18/24",
    "effectiveDate": "02/14/25",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11840&fileName=5%20CCR%201001-1",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 4,
    "title": "State Implementation Plan, Specific Regulations for Nonattainment-Attainment/Maintenance Areas (Local Elements)",
    "description": "'State Implementation Plan, Specific Regulations for Nonattainment-Attainment/Maintenance Areas (Local Elements)' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "11/20/08",
    "effectiveDate": "12/30/08",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=2721&fileName=5%20CCR%201001-20",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 5,
    "title": "Regulation Number 1 - Emission Control for Particulate Matter, Smoke, Carbon Monoxide and Sulfur Oxides",
    "description": "'Regulation Number 1 - Emission Control for Particulate Matter, Smoke, Carbon Monoxide and Sulfur Oxides' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "08/15/24",
    "effectiveDate": "10/15/24",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11648&fileName=5%20CCR%201001-3",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 6,
    "title": "Regulation Number 2 - Odor Emission",
    "description": "'Regulation Number 2 - Odor Emission' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "05/16/13",
    "effectiveDate": "07/15/13",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=5444&fileName=5%20CCR%201001-4",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 7,
    "title": "Regulation Number 3 - Stationary Source Permitting and Air Pollutant Emission Notice Requirements",
    "description": "'Regulation Number 3 - Stationary Source Permitting and Air Pollutant Emission Notice Requirements' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "05/16/24",
    "effectiveDate": "07/15/24",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11563&fileName=5%20CCR%201001-5 ",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 8,
    "title": "Regulation Number 4 - Woodburning Appliances During High Pollution Days",
    "description": "'Regulation Number 4 - Woodburning Appliances During High Pollution Days' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "08/15/24",
    "effectiveDate": "10/15/24",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11649&fileName=5%20CCR%201001-6",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 9,
    "title": "Regulation Number 5 - Generic Emissions Trading and Banking",
    "description": "'Regulation Number 5 - Generic Emissions Trading and Banking' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "02/17/05",
    "effectiveDate": "03/30/05",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=1486&fileName=5%20CCR%201001-7",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 10,
    "title": "Regulation Number 6 - Standards of Performance for New Stationary Sources",
    "description": "'Regulation Number 6 - Standards of Performance for New Stationary Sources' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "05/16/24",
    "effectiveDate": "07/15/24",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11567&fileName=5%20CCR%201001-8",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 11,
    "title": "Regulation Number 7 - Control of Emissions from Oil and Gas Emissions Operations",
    "description": "'Regulation Number 7 - Control of Emissions from Oil and Gas Emissions Operations' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "02/21/25",
    "effectiveDate": "04/14/25",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11843&fileName=5%20CCR%201001-9",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 12,
    "title": "Regulation Number 8 - Control of Hazardous Air Pollutants",
    "description": "'Regulation Number 8 - Control of Hazardous Air Pollutants' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "05/16/24",
    "effectiveDate": "07/15/24",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11565&fileName=5%20CCR%201001-10",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 13,
    "title": "Regulation Number 9 - Open Burning, Prescribed Fire, and Permitting",
    "description": "'Regulation Number 9 - Open Burning, Prescribed Fire, and Permitting' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "02/15/24",
    "effectiveDate": "04/15/24",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11420&fileName=5%20CCR%201001-11",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 14,
    "title": "Regulation Number 10 - Criteria for Analysis of Transportation Conformity",
    "description": "'Regulation Number 10 - Criteria for Analysis of Transportation Conformity' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "02/18/16",
    "effectiveDate": "03/30/16",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=6679&fileName=5%20CCR%201001-12",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 15,
    "title": "Regulation Number 11 - Motor Vehicle Emissions Inspection Program",
    "description": "'Regulation Number 11 - Motor Vehicle Emissions Inspection Program' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "01/16/25",
    "effectiveDate": "03/17/25",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11873&fileName=5%20CCR%201001-13",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 16,
    "title": "Regulation Number 12 - Reduction of Diesel Vehicle Emissions",
    "description": "'Regulation Number 12 - Reduction of Diesel Vehicle Emissions' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "01/16/25",
    "effectiveDate": "03/17/25",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11881&fileName=5%20CCR%201001-15",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 17,
    "title": "Regulation Number 13 - Reduction of CO Emissions via Oxygenated Gasolines",
    "description": "'Regulation Number 13 - Reduction of CO Emissions via Oxygenated Gasolines' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "08/20/09",
    "effectiveDate": "02/01/11",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=3972&fileName=5%20CCR%201001-16",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 18,
    "title": "Regulation Number 14 - Alternative Fueled Vehicles (Repealed)",
    "description": "'Regulation Number 14 - Alternative Fueled Vehicles (Repealed)' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "08/19/99",
    "effectiveDate": "10/30/99",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=1525&fileName=5%20CCR%201001-17",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 19,
    "title": "Regulation Number 15 - Control of Emissions of Ozone-Depleting Compounds",
    "description": "'Regulation Number 15 - Control of Emissions of Ozone-Depleting Compounds' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "09/18/08",
    "effectiveDate": "10/30/08",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=2600&fileName=5%20CCR%201001-19",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 20,
    "title": "Regulation Number 16 - Street Sanding Emissions",
    "description": "'Regulation Number 16 - Street Sanding Emissions' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "04/19/01",
    "effectiveDate": "06/30/01",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=1529&fileName=5%20CCR%201001-18",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 21,
    "title": "Regulation Number 17 - Clean Fuel Fleet Program (Repealed)",
    "description": "'Regulation Number 17 - Clean Fuel Fleet Program (Repealed)' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "08/15/02",
    "effectiveDate": "10/30/02",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=337&fileName=5%20CCR%201001-21",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 22,
    "title": "Regulation Number 18 - Control of Emissions of Acid Deposition Precursors",
    "description": "'Regulation Number 18 - Control of Emissions of Acid Deposition Precursors' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "10/18/12",
    "effectiveDate": "12/15/12",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=4928&fileName=5%20CCR%201001-22",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 23,
    "title": "Regulation Number 19 - The Control of Lead Hazards",
    "description": "'Regulation Number 19 - The Control of Lead Hazards' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "11/18/21",
    "effectiveDate": "01/14/22",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=9953&fileName=5%20CCR%201001-23",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 24,
    "title": "Regulation Number 20 - Colorado Low Emission Automobile Regulation",
    "description": "'Regulation Number 20 - Colorado Low Emission Automobile Regulation' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "10/20/23",
    "effectiveDate": "12/15/23",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=9953&fileName=5%20CCR%201001-23",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 25,
    "title": "Regulation Number 21 - VOCs from Consumer Products and Coatings",
    "description": "'Regulation Number 21 - VOCs from Consumer Products and Coatings' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "12/15/22",
    "effectiveDate": "02/14/23",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=10677&fileName=5%20CCR%201001-25",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 26,
    "title": "Regulation Number 22 - GHG Reporting and Reduction Requirements",
    "description": "'Regulation Number 22 - GHG Reporting and Reduction Requirements' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "10/16/24",
    "effectiveDate": "12/15/24",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11724&fileName=5%20CCR%201001-26",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 27,
    "title": "Regulation Number 23 - Regional Haze Limits",
    "description": "'Regulation Number 23 - Regional Haze Limits' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "12/17/21",
    "effectiveDate": "01/30/22",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=9985&fileName=5%20CCR%201001-27",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 28,
    "title": "Regulation Number 24 - VOC and Petroleum Emissions Control",
    "description": "'Regulation Number 24 - VOC and Petroleum Emissions Control' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "04/20/23",
    "effectiveDate": "06/14/23",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=10847&fileName=5%20CCR%201001-28",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 29,
    "title": "Regulation Number 25 - Emissions from Surface Coating and Related",
    "description": "'Regulation Number 25 - Emissions from Surface Coating and Related' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "12/20/24",
    "effectiveDate": "02/14/25",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11839&fileName=5%20CCR%201001-29",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 30,
    "title": "Regulation Number 26 - Emissions from Engines and Major Stationary Sources",
    "description": "'Regulation Number 26 - Emissions from Engines and Major Stationary Sources' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "12/20/24",
    "effectiveDate": "02/14/25",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11841&fileName=5%20CCR%201001-30",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 31,
    "title": "Regulation Number 27 - GHG and Energy for Manufacturing",
    "description": "'Regulation Number 27 - GHG and Energy for Manufacturing' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "12/20/24",
    "effectiveDate": "02/14/25",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11838&fileName=5%20CCR%201001-31",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 32,
    "title": "Regulation Number 28 - Building Benchmarking and Performance Standards",
    "description": "'Regulation Number 28 - Building Benchmarking and Performance Standards' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "08/17/23",
    "effectiveDate": "10/15/23",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11123&fileName=5%20CCR%201001-32",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 33,
    "title": "Regulation Number 29 - Emission Reduction for Lawn and Garden Equipment",
    "description": "'Regulation Number 29 - Emission Reduction for Lawn and Garden Equipment' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "02/16/24",
    "effectiveDate": "04/15/24",
    "url": "https://www.sos.state.co.us/CCR/GenerateRulePdf.do?ruleVersionId=11408&fileName=5%20CCR%201001-33",
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  },
  {
    "id": 34,
    "title": "Regulation Number 30 - Five Priority Air Toxics",
    "description": "'Regulation Number 30 - Five Priority Air Toxics' is an air quality regulation adopted by the Colorado Air Quality Control Commission. This rule provides enforceable requirements that may include permitting, emissions control, program implementation, or reporting obligations. It helps maintain air quality standards, ensure compliance, and protect public health and the environment.",
    "jurisdiction": "Colorado",
    "type": "Regulation",
    "adoptedDate": "02/17/25",
    "effectiveDate": "03/17/25",
    "url": NaN,
    "keywords": [
      "emissions",
      "compliance",
      "air quality",
      "permitting",
      "public health",
      "reporting"
    ]
  }
];

export default MOCK_DOCUMENTS;