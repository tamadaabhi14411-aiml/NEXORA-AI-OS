export const MOCK_REQUESTS = [
  {
    id: "req_1",
    projectId: "proj_1",
    projectTitle: "Clean Water AI Sentinel",
    fromUserId: "usr_7",
    fromUserName: "Kofi Mensah",
    fromUserAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=250&auto=format&fit=crop&q=80",
    fromUserRole: "Mobile App Developer",
    toUserId: "usr_1", // Anjali Sharma
    roleApplied: "Frontend Developer (React)",
    message: "Hi Anjali! I'd love to help build the React web dashboard and offline mobile components for Clean Water AI. I have extensive experience in React and offline data sync.",
    skillsMatched: ["React", "JavaScript"],
    matchPercentage: 92,
    status: "pending", // 'pending', 'accepted', 'declined'
    createdAt: "2026-08-13"
  },
  {
    id: "req_2",
    projectId: "proj_3",
    projectTitle: "Global Canopy Watch & Satellite AI",
    fromUserId: "usr_11",
    fromUserName: "Alex Rivera",
    fromUserAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80",
    fromUserRole: "Student Developer",
    toUserId: "usr_2", // Marcus Vance
    roleApplied: "GIS Web Developer",
    message: "Hello Marcus, I am a CS student passionate about satellite imagery and GIS mapping. I can assist with Mapbox GL integration and React frontend components.",
    skillsMatched: ["React", "Python"],
    matchPercentage: 88,
    status: "pending",
    createdAt: "2026-08-14"
  },
  {
    id: "req_3",
    projectId: "proj_2",
    projectTitle: "SolarGrid Peer Energy Exchange",
    fromUserId: "usr_1",
    fromUserName: "Anjali Sharma",
    fromUserAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80",
    fromUserRole: "Senior Full-Stack Developer",
    toUserId: "usr_5", // Amina Al-Mansoor
    roleApplied: "Frontend Developer",
    message: "Hi Amina, joined SolarGrid team to help implement the transaction receipt generator and D3.js energy flow components!",
    skillsMatched: ["React", "Node.js", "Tailwind CSS"],
    matchPercentage: 96,
    status: "accepted",
    createdAt: "2026-08-10"
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "notif_1",
    userId: "usr_1",
    title: "New Collaboration Request",
    message: "Kofi Mensah sent a request to join 'Clean Water AI Sentinel' as Frontend Developer.",
    time: "2 hours ago",
    read: false,
    type: "request",
    link: "/dashboard"
  },
  {
    id: "notif_2",
    userId: "usr_1",
    title: "Project Milestone Reached!",
    message: "SolarGrid Peer Energy Exchange successfully connected Al-Fayyum Microgrid.",
    time: "Yesterday",
    read: false,
    type: "project",
    link: "/project/proj_2"
  },
  {
    id: "notif_3",
    userId: "usr_1",
    title: "Request Accepted",
    message: "Amina Al-Mansoor accepted your request to join SolarGrid Peer Energy Exchange.",
    time: "3 days ago",
    read: true,
    type: "success",
    link: "/workspace/proj_2"
  }
];
