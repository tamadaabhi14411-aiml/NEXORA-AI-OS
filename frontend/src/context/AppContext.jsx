import { createContext, useContext, useState, useEffect } from "react";
import { MOCK_USERS } from "../data/mockUsers";
import { MOCK_PROJECTS } from "../data/mockProjects";
import { MOCK_ORGANIZATIONS } from "../data/mockOrganizations";
import { MOCK_REQUESTS, MOCK_NOTIFICATIONS } from "../data/mockRequests";
import { SDG_LIST } from "../data/sdgData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Local Storage state hooks with fallbacks
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("sdg_users");
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("sdg_projects");
    return saved ? JSON.parse(saved) : MOCK_PROJECTS;
  });

  const [organizations] = useState(MOCK_ORGANIZATIONS);

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem("sdg_requests");
    return saved ? JSON.parse(saved) : MOCK_REQUESTS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("sdg_notifications");
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  const [currentUserId, setCurrentUserId] = useState(() => {
    const saved = localStorage.getItem("sdg_current_user_id");
    return saved || "usr_1"; // Default Anjali Sharma
  });

  const [savedProjects, setSavedProjects] = useState(() => {
    const saved = localStorage.getItem("sdg_saved_projects");
    return saved ? JSON.parse(saved) : ["proj_2", "proj_3"];
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState("proj_1");

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("sdg_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("sdg_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("sdg_requests", JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem("sdg_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("sdg_current_user_id", currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem("sdg_saved_projects", JSON.stringify(savedProjects));
  }, [savedProjects]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  // Actions
  const loginUser = (userId) => {
    const userExists = users.find(u => u.id === userId);
    if (userExists) {
      setCurrentUserId(userId);
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUserId("usr_1");
  };

  const createProject = (newProjectData) => {
    const newId = `proj_${Date.now()}`;
    const newProject = {
      id: newId,
      title: newProjectData.title,
      tagline: newProjectData.tagline,
      description: newProjectData.description,
      sdgs: newProjectData.sdgs || [13],
      organizationId: newProjectData.organizationId || "org_1",
      organizationName: newProjectData.organizationName || "EcoCode Initiative",
      status: "Recruiting",
      banner: newProjectData.banner || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
      createdAt: new Date().toISOString().split("T")[0],
      location: newProjectData.location || "Remote",
      impactGoal: newProjectData.impactGoal || "Empower sustainable development through collaborative tech.",
      requiredSkills: newProjectData.requiredSkills || ["React", "Python"],
      openRoles: newProjectData.openRoles || [
        { role: "Developer", skillsNeeded: ["React"], description: "Help build the core platform interface." }
      ],
      team: [
        { userId: currentUser.id, role: "Project Creator", name: currentUser.name, avatar: currentUser.avatar }
      ],
      tasks: [
        { id: `tsk_${Date.now()}_1`, title: "Setup project repository and README", assignee: currentUser.name, status: "In Progress", priority: "High", dueDate: "2026-08-25" },
        { id: `tsk_${Date.now()}_2`, title: "Define technical architecture & stack", assignee: currentUser.name, status: "Completed", priority: "High", dueDate: "2026-08-14" }
      ],
      announcements: [
        { id: `ann_${Date.now()}`, author: currentUser.name, date: new Date().toISOString().split("T")[0], title: "Project Created on SDG Connect!", content: "Welcome to the project! We are actively seeking passionate collaborators." }
      ],
      metrics: {
        collaboratorsActive: 1,
        milestonesReached: "0/5"
      }
    };

    setProjects(prev => [newProject, ...prev]);

    // Add notification
    const newNotif = {
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      title: "Project Published Successfully",
      message: `Your project '${newProject.title}' is now live and recruiting collaborators.`,
      time: "Just now",
      read: false,
      type: "success",
      link: `/project/${newId}`
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newId;
  };

  const sendCollaborationRequest = ({ projectId, toUserId, roleApplied, message, matchPercentage = 85 }) => {
    const targetProject = projects.find(p => p.id === projectId);
    if (!targetProject) return false;

    const newReq = {
      id: `req_${Date.now()}`,
      projectId,
      projectTitle: targetProject.title,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromUserAvatar: currentUser.avatar,
      fromUserRole: currentUser.role,
      toUserId: toUserId || targetProject.team[0]?.userId || "usr_1",
      roleApplied: roleApplied || "Collaborator",
      message: message || "I would love to contribute my skills to this project!",
      skillsMatched: currentUser.skills.filter(s => targetProject.requiredSkills.includes(s)),
      matchPercentage,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0]
    };

    setRequests(prev => [newReq, ...prev]);

    // Notify project lead
    const recipientId = toUserId || targetProject.team[0]?.userId || "usr_1";
    const newNotif = {
      id: `notif_${Date.now()}`,
      userId: recipientId,
      title: "New Collaboration Request",
      message: `${currentUser.name} requested to join '${targetProject.title}' (${matchPercentage}% Match).`,
      time: "Just now",
      read: false,
      type: "request",
      link: "/dashboard"
    };
    setNotifications(prev => [newNotif, ...prev]);

    return true;
  };

  const updateRequestStatus = (requestId, newStatus) => {
    const targetReq = requests.find(r => r.id === requestId);
    if (!targetReq) return;

    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));

    if (newStatus === "accepted") {
      // Add user to project team if not already present
      setProjects(prev => prev.map(p => {
        if (p.id === targetReq.projectId) {
          const exists = p.team.some(m => m.userId === targetReq.fromUserId);
          if (!exists) {
            return {
              ...p,
              team: [...p.team, {
                userId: targetReq.fromUserId,
                role: targetReq.roleApplied,
                name: targetReq.fromUserName,
                avatar: targetReq.fromUserAvatar
              }]
            };
          }
        }
        return p;
      }));

      // Send notification to applicant
      const newNotif = {
        id: `notif_${Date.now()}`,
        userId: targetReq.fromUserId,
        title: "Request Accepted! 🎉",
        message: `Your application to join '${targetReq.projectTitle}' was accepted!`,
        time: "Just now",
        read: false,
        type: "success",
        link: `/workspace/${targetReq.projectId}`
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const toggleSaveProject = (projectId) => {
    setSavedProjects(prev =>
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );
  };

  const addTaskToProject = (projectId, taskData) => {
    const newTask = {
      id: `tsk_${Date.now()}`,
      title: taskData.title,
      assignee: taskData.assignee || "Unassigned",
      status: taskData.status || "To Do",
      priority: taskData.priority || "Medium",
      dueDate: taskData.dueDate || "2026-08-30"
    };

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, tasks: [...p.tasks, newTask] };
      }
      return p;
    }));
  };

  const updateTaskStatus = (projectId, taskId, newStatus) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
        };
      }
      return p;
    }));
  };

  const addProjectAnnouncement = (projectId, title, content) => {
    const newAnn = {
      id: `ann_${Date.now()}`,
      author: currentUser.name,
      date: new Date().toISOString().split("T")[0],
      title,
      content
    };

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, announcements: [newAnn, ...p.announcements] };
      }
      return p;
    }));
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        projects,
        organizations,
        requests,
        notifications,
        savedProjects,
        sdgList: SDG_LIST,
        activeWorkspaceId,
        setActiveWorkspaceId,
        loginUser,
        logoutUser,
        createProject,
        sendCollaborationRequest,
        updateRequestStatus,
        toggleSaveProject,
        addTaskToProject,
        updateTaskStatus,
        addProjectAnnouncement,
        markNotificationRead,
        clearNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
