const MOCK_DOCUMENTS = [
  // ----- Colorado (20) -----
  {
    id: 1,
    title: "Colorado - Regulation No. 1: Emissions Standards",
    description: "Establishes baseline emissions standards for industrial operations in Colorado.",
    jurisdiction: "Colorado",
    type: "Regulation"
  },
  {
    id: 2,
    title: "Colorado - Regulation No. 2: Oil and Gas VOC Control",
    description: "Limits volatile organic compounds from oil and gas operations.",
    jurisdiction: "Colorado",
    type: "Guidance"
  },
  {
    id: 3,
    title: "Colorado - Regulation No. 3: Permitting and Monitoring",
    description: "Covers permitting and compliance monitoring for air emissions sources.",
    jurisdiction: "Colorado",
    type: "Permit"
  },
  {
    id: 4,
    title: "Colorado - Regulation No. 4: Dust Control Measures",
    description: "Provides best practices for minimizing fugitive dust.",
    jurisdiction: "Colorado",
    type: "Plan"
  },
  {
    id: 5,
    title: "Colorado - Regulation No. 5: Regional Haze Plan",
    description: "Implements federal visibility goals under the Regional Haze Rule.",
    jurisdiction: "Colorado",
    type: "Plan"
  },
  {
    id: 6,
    title: "Colorado - Regulation No. 6: NOx Control Technologies",
    description: "Guidance for implementing NOx reduction technologies.",
    jurisdiction: "Colorado",
    type: "Guidance"
  },
  {
    id: 7,
    title: "Colorado - Regulation No. 7: Ozone SIP Requirements",
    description: "Outlines ozone State Implementation Plan measures.",
    jurisdiction: "Colorado",
    type: "Regulation"
  },
  {
    id: 8,
    title: "Colorado - Regulation No. 8: Greenhouse Gas Inventory",
    description: "Provides methodology for GHG emissions tracking.",
    jurisdiction: "Colorado",
    type: "Report"
  },
  {
    id: 9,
    title: "Colorado - Regulation No. 9: Wood Stove Standards",
    description: "Regulates emissions from wood-burning appliances.",
    jurisdiction: "Colorado",
    type: "Regulation"
  },
  {
    id: 10,
    title: "Colorado - Regulation No. 10: Vehicle Emissions Program",
    description: "Sets standards for vehicle inspections and emissions.",
    jurisdiction: "Colorado",
    type: "Policy"
  },
  {
    id: 11,
    title: "Colorado - Guidance on Methane Rule Implementation",
    description: "Explains how to comply with new methane standards.",
    jurisdiction: "Colorado",
    type: "Guidance"
  },
  {
    id: 12,
    title: "Colorado - Regulation No. 11: Emergency Response Plan",
    description: "Outlines air quality response protocols for wildfires.",
    jurisdiction: "Colorado",
    type: "Plan"
  },
  {
    id: 13,
    title: "Colorado - Permit Framework: Industrial Boilers",
    description: "Describes permitting requirements for large boilers.",
    jurisdiction: "Colorado",
    type: "Permit"
  },
  {
    id: 14,
    title: "Colorado - SIP Addendum for 2023",
    description: "Amendment to existing State Implementation Plan.",
    jurisdiction: "Colorado",
    type: "Plan"
  },
  {
    id: 15,
    title: "Colorado - Regional Air Monitoring Expansion",
    description: "Details on air sensor deployment statewide.",
    jurisdiction: "Colorado",
    type: "Report"
  },
  {
    id: 16,
    title: "Colorado - Protocols for Stack Testing",
    description: "Standardized emissions testing procedures.",
    jurisdiction: "Colorado",
    type: "Protocol"
  },
  {
    id: 17,
    title: "Colorado - Regulation No. 12: Visibility Planning",
    description: "Framework for visibility protection in Class I areas.",
    jurisdiction: "Colorado",
    type: "Plan"
  },
  {
    id: 18,
    title: "Colorado - Regulation No. 13: Flare Control Requirements",
    description: "Limits on flaring and venting practices.",
    jurisdiction: "Colorado",
    type: "Regulation"
  },
  {
    id: 19,
    title: "Colorado - General Permits for Batch Plants",
    description: "Outlines permitting conditions for concrete batch operations.",
    jurisdiction: "Colorado",
    type: "Permit"
  },
  {
    id: 20,
    title: "Colorado - Regulation No. 14: Fuel Vapor Recovery",
    description: "Mandates vapor capture systems at refueling stations.",
    jurisdiction: "Colorado",
    type: "Regulation"
  },

  // ----- Texas (20) -----
  {
    id: 21,
    title: "Texas - Air Quality Standard Permit for Oil and Gas",
    description: "Standard permit for emissions from oil and gas sites.",
    jurisdiction: "Texas",
    type: "Permit"
  },
  {
    id: 22,
    title: "Texas - Guidance for Aggregate Plant Emissions",
    description: "Recommended practices for controlling PM emissions.",
    jurisdiction: "Texas",
    type: "Guidance"
  },
  {
    id: 23,
    title: "Texas - Regulation on Storage Tank Controls",
    description: "Control requirements for VOC storage tanks.",
    jurisdiction: "Texas",
    type: "Regulation"
  },
  {
    id: 24,
    title: "Texas - SIP Implementation Timeline 2024",
    description: "Deadlines for SIP compliance.",
    jurisdiction: "Texas",
    type: "Plan"
  },
  {
    id: 25,
    title: "Texas - Flare Management Requirements",
    description: "Rules on flare minimization.",
    jurisdiction: "Texas",
    type: "Regulation"
  },
  {
    id: 26,
    title: "Texas - Vehicle Emissions Inspection Requirements",
    description: "Inspection standards for urban counties.",
    jurisdiction: "Texas",
    type: "Policy"
  },
  {
    id: 27,
    title: "Texas - Portable Monitoring Program Guide",
    description: "Portable analyzer guidance for emissions checks.",
    jurisdiction: "Texas",
    type: "Protocol"
  },
  {
    id: 28,
    title: "Texas - Regulation No. 8: Regional Ozone Reductions",
    description: "Outlines ozone mitigation strategies.",
    jurisdiction: "Texas",
    type: "Plan"
  },
  {
    id: 29,
    title: "Texas - Draft SIP Update for Houston Region",
    description: "Proposed revisions for the Houston ozone area.",
    jurisdiction: "Texas",
    type: "Plan"
  },
  {
    id: 30,
    title: "Texas - Regulation on Fugitive Emissions",
    description: "Requirements for leak detection and repair (LDAR).",
    jurisdiction: "Texas",
    type: "Regulation"
  },
  {
    id: 31,
    title: "Texas - Air Monitoring Expansion Plan",
    description: "TCEQ plan to install sensors near industrial sites.",
    jurisdiction: "Texas",
    type: "Report"
  },
  {
    id: 32,
    title: "Texas - Emergency Ozone Alert Protocol",
    description: "Response protocol for high ozone days.",
    jurisdiction: "Texas",
    type: "Policy"
  },
  {
    id: 33,
    title: "Texas - NOx Control Guidance for Refineries",
    description: "Guidance for refinery combustion sources.",
    jurisdiction: "Texas",
    type: "Guidance"
  },
  {
    id: 34,
    title: "Texas - Vapor Recovery Regulation",
    description: "Stage I and II vapor capture system rules.",
    jurisdiction: "Texas",
    type: "Regulation"
  },
  {
    id: 35,
    title: "Texas - SIP Progress Report 2023",
    description: "Annual update on Texas SIP goals.",
    jurisdiction: "Texas",
    type: "Report"
  },
  {
    id: 36,
    title: "Texas - Regulation on Engine Testing",
    description: "Requirements for stationary engine emissions.",
    jurisdiction: "Texas",
    type: "Regulation"
  },
  {
    id: 37,
    title: "Texas - Regulation No. 14: Air Curtain Incinerators",
    description: "Conditions for operation of air curtain burners.",
    jurisdiction: "Texas",
    type: "Permit"
  },
  {
    id: 38,
    title: "Texas - Aggregate Crushing Operations Protocol",
    description: "Standard testing for rock crushers.",
    jurisdiction: "Texas",
    type: "Protocol"
  },
  {
    id: 39,
    title: "Texas - Compliance Assistance Handbook",
    description: "Summary of state rules for air permits.",
    jurisdiction: "Texas",
    type: "General Info Item"
  },
  {
    id: 40,
    title: "Texas - Regulation on Asphalt Plant NOx Emissions",
    description: "NOx limits for hot mix asphalt operations.",
    jurisdiction: "Texas",
    type: "Regulation"
  },

  // ----- New Mexico (10) -----
  {
    id: 41,
    title: "New Mexico - Oil and Gas Methane Rules",
    description: "Limits methane and VOC leaks from oil sites.",
    jurisdiction: "New Mexico",
    type: "Regulation"
  },
  {
    id: 42,
    title: "New Mexico - Regional Haze SIP",
    description: "Plan to address visibility in Class I areas.",
    jurisdiction: "New Mexico",
    type: "Plan"
  },
  {
    id: 43,
    title: "New Mexico - Air Toxics Monitoring Program",
    description: "Outlines monitoring methods and locations.",
    jurisdiction: "New Mexico",
    type: "Report"
  },
  {
    id: 44,
    title: "New Mexico - Regulation on Emergency Generators",
    description: "Emissions standards for backup generators.",
    jurisdiction: "New Mexico",
    type: "Regulation"
  },
  {
    id: 45,
    title: "New Mexico - Compliance Guide for Minor Sources",
    description: "Guidance for small sources seeking permits.",
    jurisdiction: "New Mexico",
    type: "Guidance"
  },
  {
    id: 46,
    title: "New Mexico - Dust Suppression Practices",
    description: "Techniques for construction and road dust.",
    jurisdiction: "New Mexico",
    type: "Plan"
  },
  {
    id: 47,
    title: "New Mexico - Permit Application Checklist",
    description: "Required documents for initial air permit.",
    jurisdiction: "New Mexico",
    type: "Permit"
  },
  {
    id: 48,
    title: "New Mexico - Annual Air Quality Trends Report",
    description: "Summary of air quality data and trends.",
    jurisdiction: "New Mexico",
    type: "Report"
  },
  {
    id: 49,
    title: "New Mexico - Regulation No. 6: Flaring Reduction",
    description: "Mandates reduced flaring in oil/gas regions.",
    jurisdiction: "New Mexico",
    type: "Regulation"
  },
  {
    id: 50,
    title: "New Mexico - SIP Inventory Update 2023",
    description: "Updates on SIP inventory calculations.",
    jurisdiction: "New Mexico",
    type: "Plan"
  }
];

export default MOCK_DOCUMENTS;
