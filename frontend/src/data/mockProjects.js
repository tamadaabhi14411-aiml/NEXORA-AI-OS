export const MOCK_PROJECTS = [
  {
    id: "proj_1",
    title: "Clean Water AI Sentinel",
    tagline: "IoT & Computer Vision platform for real-time rural water quality monitoring",
    description: "An open-source telemetry platform using affordable IoT water sensors and AI turbidity analysis to detect contamination in village water wells before outbreaks occur.",
    sdgs: [6, 3, 9], // Clean Water, Health, Innovation
    organizationId: "org_2",
    organizationName: "AquaPure Global NGO",
    status: "Recruiting", // 'Recruiting', 'In Progress', 'Completed'
    banner: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-07-15",
    location: "Nairobi, Kenya / Remote",
    impactGoal: "Provide clean water telemetry to 50 rural communities by Q4 2026.",
    requiredSkills: ["React", "Python", "Node.js", "IoT Firmware", "Grafana", "PostgreSQL"],
    openRoles: [
      { role: "Frontend Developer (React)", skillsNeeded: ["React", "Tailwind CSS"], description: "Build the community dashboard for sensor readouts and alert notifications." },
      { role: "Data Scientist (Python)", skillsNeeded: ["Python", "Data Analytics"], description: "Develop anomaly detection scripts for sensor drift." }
    ],
    team: [
      { userId: "usr_4", role: "Project Lead / IoT Engineer", name: "David Chen", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80" },
      { userId: "usr_1", role: "Lead Full-Stack Developer", name: "Anjali Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80" }
    ],
    tasks: [
      { id: "tsk_1", title: "Build React dashboard component for real-time pH readings", assignee: "Anjali Sharma", status: "In Progress", priority: "High", dueDate: "2026-08-20" },
      { id: "tsk_2", title: "Flash MQTT telemetry firmware to ESP32 test node", assignee: "David Chen", status: "Completed", priority: "High", dueDate: "2026-08-10" },
      { id: "tsk_3", title: "Configure alert webhook for SMS contamination warnings", assignee: "Unassigned", status: "To Do", priority: "Medium", dueDate: "2026-08-25" },
      { id: "tsk_4", title: "Design mobile offline cache sync architecture", assignee: "Unassigned", status: "To Do", priority: "Low", dueDate: "2026-08-30" }
    ],
    announcements: [
      { id: "ann_1", author: "David Chen", date: "2026-08-12", title: "First 5 Test Nodes Deployed in Machakos County!", content: "Our prototype hardware sensors successfully transmitted pH and turbidity data over GSM network today with 99.4% uptime!" }
    ],
    metrics: {
      litersMonitored: "125,000 L",
      activeSensors: 14,
      villagesCovered: 5,
      alertsPrevented: 3
    }
  },
  {
    id: "proj_2",
    title: "SolarGrid Peer Energy Exchange",
    tagline: "Microgrid solar energy trading platform for decentralized communities",
    description: "Enabling solar panel owners in off-grid villages to trade surplus solar energy with local schools and health clinics using a lightweight distributed ledger.",
    sdgs: [7, 11, 13], // Clean Energy, Sustainable Cities, Climate Action
    organizationId: "org_1",
    organizationName: "EcoCode Initiative",
    status: "In Progress",
    banner: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-06-20",
    location: "Cairo, Egypt / Remote",
    impactGoal: "Share 500 kWh of solar energy daily among 200 households.",
    requiredSkills: ["React", "Python", "Node.js", "D3.js", "Docker", "Tailwind CSS"],
    openRoles: [
      { role: "Data Visualization Specialist", skillsNeeded: ["React", "D3.js"], description: "Create real-time energy flow charts for local microgrid dispatchers." }
    ],
    team: [
      { userId: "usr_5", role: "Project Architect", name: "Amina Al-Mansoor", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80" },
      { userId: "usr_9", role: "DevOps Engineer", name: "Rajesh Kumar", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&auto=format&fit=crop&q=80" },
      { userId: "usr_1", role: "Frontend Developer", name: "Anjali Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80" }
    ],
    tasks: [
      { id: "tsk_21", title: "Implement solar output forecasting using historical weather data", assignee: "Amina Al-Mansoor", status: "In Progress", priority: "High", dueDate: "2026-08-22" },
      { id: "tsk_22", title: "Deploy Dockerized ledger nodes on local edge servers", assignee: "Rajesh Kumar", status: "Completed", priority: "High", dueDate: "2026-08-05" },
      { id: "tsk_23", title: "Build peer transaction receipt PDF generator", assignee: "Anjali Sharma", status: "Completed", priority: "Medium", dueDate: "2026-08-11" }
    ],
    announcements: [
      { id: "ann_2", author: "Amina Al-Mansoor", date: "2026-08-10", title: "Pilot project connected to Al-Fayyum Microgrid", content: "Local clinic now receiving 40% of daytime energy requirement directly from community solar shares." }
    ],
    metrics: {
      cleanEnergyTraded: "1,420 kWh",
      co2Saved: "1.1 Tons",
      participatingHomes: 84
    }
  },
  {
    id: "proj_3",
    title: "Global Canopy Watch & Satellite AI",
    tagline: "High-resolution satellite deforestation detection & illegal logging alerts",
    description: "Processing Sentinel-2 imagery with PyTorch computer vision models to detect illegal canopy clearing in rainforest conservation zones and alert local rangers within 2 hours.",
    sdgs: [13, 15, 9], // Climate Action, Life on Land, Innovation
    organizationId: "org_3",
    organizationName: "MIT Earth Intelligence Lab",
    status: "Recruiting",
    banner: "https://images.unsplash.com/photo-1511497584788-876761c11969?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-07-01",
    location: "Cambridge, MA / Global Remote",
    impactGoal: "Monitor 10,000 sq km of protected tropical rainforest continuously.",
    requiredSkills: ["Python", "PyTorch", "TensorFlow", "GIS Mapping", "Docker", "Data Analytics"],
    openRoles: [
      { role: "Computer Vision Researcher", skillsNeeded: ["Python", "PyTorch"], description: "Fine-tune segmentation models on satellite cloud-free composites." },
      { role: "GIS Web Developer", skillsNeeded: ["React", "GIS Mapping"], description: "Build interactive map viewer showing logging alert vectors." }
    ],
    team: [
      { userId: "usr_2", role: "Lead AI Researcher", name: "Marcus Vance", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80" },
      { userId: "usr_12", role: "Geospatial Analyst", name: "Maya Lin", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=250&auto=format&fit=crop&q=80" }
    ],
    tasks: [
      { id: "tsk_31", title: "Train ResNet UNet model on Amazon Basin tile dataset", assignee: "Marcus Vance", status: "In Progress", priority: "High", dueDate: "2026-08-25" },
      { id: "tsk_32", title: "Implement GeoJSON layer parser in Mapbox web canvas", assignee: "Maya Lin", status: "In Progress", priority: "Medium", dueDate: "2026-08-28" }
    ],
    announcements: [
      { id: "ann_3", author: "Marcus Vance", date: "2026-08-01", title: "Model accuracy reached 94.2% on test validation set!", content: "Our model can now identify canopy loss spots as small as 15 square meters." }
    ],
    metrics: {
      sqKmMonitored: "6,800 sq km",
      loggingAlertsGenerated: 42,
      rangerResponseTimeAvg: "1.8 hours"
    }
  },
  {
    id: "proj_4",
    title: "AgriMarket Mobile Offline Engine",
    tagline: "Offline-first mobile app connecting smallholder farmers to fair-trade buyers",
    description: "A React Native app designed for low-connectivity agricultural zones in Ghana and Nigeria. Allows farmers to log harvests, access crop disease diagnostics, and negotiate prices.",
    sdgs: [2, 1, 8], // Zero Hunger, No Poverty, Decent Work
    organizationId: "org_4",
    organizationName: "AgriConnect West Africa",
    status: "In Progress",
    banner: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-05-10",
    location: "Accra, Ghana / Remote",
    impactGoal: "Connect 10,000 smallholder maize and cassava farmers to buyers.",
    requiredSkills: ["React Native", "JavaScript", "Node.js", "Offline-First Sync", "UI/UX Design"],
    openRoles: [
      { role: "React Native UI Contributor", skillsNeeded: ["React Native", "UI/UX Design"], description: "Design accessible big-button UI for farmers with low digital literacy." }
    ],
    team: [
      { userId: "usr_7", role: "Mobile Lead", name: "Kofi Mensah", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=250&auto=format&fit=crop&q=80" },
      { userId: "usr_3", role: "UI/UX Lead", name: "Priya Nair", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80" }
    ],
    tasks: [
      { id: "tsk_41", title: "Build local SQLite offline queue worker for trade bids", assignee: "Kofi Mensah", status: "In Progress", priority: "High", dueDate: "2026-08-18" },
      { id: "tsk_42", title: "Conduct user testing sessions with female farming co-op", assignee: "Priya Nair", status: "Completed", priority: "High", dueDate: "2026-08-08" }
    ],
    announcements: [],
    metrics: {
      farmersRegistered: 3450,
      fairTradesCompleted: "$180,000",
      harvestLossReduced: "18%"
    }
  },
  {
    id: "proj_5",
    title: "Ocean Plastic Drift Mapping",
    tagline: "Open data drift tracker for community ocean cleanup fleets",
    description: "Simulating ocean current and wind vectors to predict coastal plastic debris accumulation points, guiding non-profit cleanup vessels to high-density zones.",
    sdgs: [14, 13], // Life Below Water, Climate Action
    organizationId: "org_3",
    organizationName: "MIT Earth Intelligence Lab",
    status: "Recruiting",
    banner: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-07-28",
    location: "Lisbon, Portugal / Remote",
    impactGoal: "Guide ocean cleanup teams to remove 100 tons of marine plastic.",
    requiredSkills: ["Python", "Data Analytics", "GIS Mapping", "React", "D3.js"],
    openRoles: [
      { role: "Marine Data Analyst", skillsNeeded: ["Python", "Data Analytics"], description: "Ingest NOAA ocean current NetCDF files into vector engine." }
    ],
    team: [
      { userId: "usr_6", role: "Lead Scientist", name: "Dr. Elena Rostova", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80" }
    ],
    tasks: [
      { id: "tsk_51", title: "Create vector drift simulation pipeline in Python", assignee: "Dr. Elena Rostova", status: "In Progress", priority: "High", dueDate: "2026-08-27" }
    ],
    announcements: [],
    metrics: {
      oceanAreaMapped: "3,200 sq nautical miles",
      plasticRemovedEstimated: "24 Tons"
    }
  },
  {
    id: "proj_6",
    title: "Open Education Accessibility Portal",
    tagline: "Multilingual, WCAG-compliant STEM portal for under-resourced schools",
    description: "An accessible, lightweight web learning platform featuring interactive physics and environmental chemistry experiments designed for low-bandwidth devices.",
    sdgs: [4, 10, 5], // Quality Education, Reduced Inequalities, Gender Equality
    organizationId: "org_6",
    organizationName: "Global STEM Foundation",
    status: "In Progress",
    banner: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-06-15",
    location: "London, UK / Remote",
    impactGoal: "Reach 50,000 students across 120 primary and secondary schools.",
    requiredSkills: ["React", "Accessibility (a11y)", "Tailwind CSS", "JavaScript", "Content Localization"],
    openRoles: [
      { role: "Accessibility Specialist", skillsNeeded: ["Accessibility (a11y)", "React"], description: "Audit screen reader navigation and keyboard shortcuts." }
    ],
    team: [
      { userId: "usr_10", role: "EdTech Lead", name: "Zoe Martinez", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80" },
      { userId: "usr_3", role: "Design Lead", name: "Priya Nair", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80" },
      { userId: "usr_11", role: "Junior Developer", name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80" }
    ],
    tasks: [
      { id: "tsk_61", title: "Add screen reader aria tags to interactive physics simulations", assignee: "Priya Nair", status: "Completed", priority: "High", dueDate: "2026-08-04" },
      { id: "tsk_62", title: "Translate solar system module into Spanish and Swahili", assignee: "Zoe Martinez", status: "In Progress", priority: "Medium", dueDate: "2026-08-20" },
      { id: "tsk_63", title: "Optimize bundle size to under 150KB total payload", assignee: "Alex Rivera", status: "In Progress", priority: "High", dueDate: "2026-08-22" }
    ],
    announcements: [],
    metrics: {
      studentsReached: 28400,
      lessonsCompleted: 142000,
      schoolsActive: 76
    }
  },
  {
    id: "proj_7",
    title: "ZeroWaste Packaging Passport",
    tagline: "Digital product passport tracking system for reusable food packaging",
    description: "Creating a QR-code based product lifecycle scanner for reusable takeaway container hubs in European eco-cities, reducing single-use plastic waste.",
    sdgs: [12, 11], // Responsible Consumption, Sustainable Cities
    organizationId: "org_5",
    organizationName: "ZeroWaste City Tech",
    status: "Recruiting",
    banner: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-07-20",
    location: "Berlin, Germany / Remote",
    impactGoal: "Divert 500,000 single-use plastic takeaway containers from landfills.",
    requiredSkills: ["React", "GraphQL", "Tailwind CSS", "Node.js", "PWA"],
    openRoles: [
      { role: "Frontend PWA Developer", skillsNeeded: ["React", "PWA"], description: "Build camera QR scanner view for cafe checkouts." }
    ],
    team: [
      { userId: "usr_8", role: "Product Lead", name: "Sophie Dubois", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&auto=format&fit=crop&q=80" }
    ],
    tasks: [
      { id: "tsk_71", title: "Implement QR code reader hooks in React PWA", assignee: "Sophie Dubois", status: "In Progress", priority: "High", dueDate: "2026-08-24" }
    ],
    announcements: [],
    metrics: {
      containersTracked: 18500,
      participatingCafes: 45
    }
  },
  {
    id: "proj_8",
    title: "Urban Heat Island Mitigation Mapper",
    tagline: "Geospatial heat monitoring engine to prioritize urban tree planting",
    description: "Combining micro-climate temperature sensor data with land-surface temperature maps to identify heat islands in low-income urban neighborhoods.",
    sdgs: [11, 13, 15], // Sustainable Cities, Climate Action, Life on Land
    organizationId: "org_1",
    organizationName: "EcoCode Initiative",
    status: "In Progress",
    banner: "https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-06-05",
    location: "Vancouver, Canada / Remote",
    impactGoal: "Identify 50 critical urban zones for community shade tree planting.",
    requiredSkills: ["Python", "GIS Mapping", "React", "Geospatial Analysis", "D3.js"],
    openRoles: [
      { role: "Full-Stack Dev", skillsNeeded: ["React", "Python"], description: "Integrate temperature API backend with Mapbox UI." }
    ],
    team: [
      { userId: "usr_12", role: "Project Lead", name: "Maya Lin", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=250&auto=format&fit=crop&q=80" },
      { userId: "usr_2", role: "Data Scientist", name: "Marcus Vance", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80" }
    ],
    tasks: [
      { id: "tsk_81", title: "Process Landsat thermal infrared band layer", assignee: "Maya Lin", status: "Completed", priority: "High", dueDate: "2026-07-30" },
      { id: "tsk_82", title: "Calculate urban canopy deficit correlation matrix", assignee: "Marcus Vance", status: "In Progress", priority: "Medium", dueDate: "2026-08-19" }
    ],
    announcements: [],
    metrics: {
      heatZonesMapped: 32,
      treesPlantedTriggered: 1450
    }
  },
  {
    id: "proj_9",
    title: "Civic Budget Transparency Hub",
    tagline: "Open-source municipal climate expenditure dashboard for citizens",
    description: "An interactive civic tech platform that lets residents track city council climate fund allocation, budget line items, and audit municipal carbon commitments.",
    sdgs: [16, 17, 11], // Peace & Justice, Partnerships, Sustainable Cities
    organizationId: "org_1",
    organizationName: "EcoCode Initiative",
    status: "Completed",
    banner: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-04-01",
    location: "Hyderabad, India / Remote",
    impactGoal: "Provide transparent budget audit view for $12M municipal climate fund.",
    requiredSkills: ["React", "Node.js", "Docker", "PostgreSQL", "Security Audit"],
    openRoles: [],
    team: [
      { userId: "usr_9", role: "Lead Infra & Security", name: "Rajesh Kumar", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&auto=format&fit=crop&q=80" },
      { userId: "usr_1", role: "Frontend Dev", name: "Anjali Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80" }
    ],
    tasks: [
      { id: "tsk_91", title: "Final release deployment v1.0 on municipal sub-domain", assignee: "Rajesh Kumar", status: "Completed", priority: "High", dueDate: "2026-07-15" }
    ],
    announcements: [
      { id: "ann_4", author: "Rajesh Kumar", date: "2026-07-16", title: "v1.0 Live and adopted by city council!", content: "The public portal was officially launched today by the city sustainability mayor." }
    ],
    metrics: {
      auditedBudget: "$14.2 Million",
      citizenViews: 45200,
      cityAdoptions: 3
    }
  },
  {
    id: "proj_10",
    title: "BioDiversity Camera Trap Classifier",
    tagline: "Edge AI camera software to identify endangered wildlife species",
    description: "Deploying lightweight PyTorch computer vision models on solar camera traps in forest reserves to identify species and spot poacher intrusion in real-time.",
    sdgs: [15, 13], // Life on Land, Climate Action
    organizationId: "org_3",
    organizationName: "MIT Earth Intelligence Lab",
    status: "Recruiting",
    banner: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-08-01",
    location: "Boston, USA / Remote",
    impactGoal: "Protect 12 critical wildlife corridors with autonomous AI camera monitors.",
    requiredSkills: ["Python", "PyTorch", "Computer Vision", "Embedded C++", "Raspberry Pi"],
    openRoles: [
      { role: "Edge AI Model Optimizer", skillsNeeded: ["Python", "PyTorch"], description: "Quantize wildlife detection models to run under 5W power envelope." },
      { role: "Hardware Enclosure Engineer", skillsNeeded: ["Embedded C++", "Raspberry Pi"], description: "Design weatherproof solar camera power manager." }
    ],
    team: [
      { userId: "usr_2", role: "AI Lead", name: "Marcus Vance", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80" },
      { userId: "usr_4", role: "Hardware Lead", name: "David Chen", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80" }
    ],
    tasks: [
      { id: "tsk_101", title: "Benchmark MobileNetV3 latency on Raspberry Pi 4", assignee: "Marcus Vance", status: "In Progress", priority: "High", dueDate: "2026-08-25" }
    ],
    announcements: [],
    metrics: {
      speciesIdentified: 48,
      cameraNodesTrained: 8,
      falseAlertsReduced: "85%"
    }
  }
];
