import { useNavigationStore } from "./store";
import Layout from "./components/layout/Layout";

// Import Pages
import Landing from "./components/pages/Landing";
import Features from "./components/pages/Features";
import About from "./components/pages/About";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Dashboard from "./components/pages/Dashboard";
import TaskList from "./components/pages/TaskList";
import StudyBuddy from "./components/pages/StudyBuddy";
import DeadlineDashboard from "./components/pages/DeadlineDashboard";
import AttendanceDashboard from "./components/pages/AttendanceDashboard";
import NoticeCenter from "./components/pages/NoticeCenter";
import PlacementDashboard from "./components/pages/PlacementDashboard";
import StudyGroups from "./components/pages/StudyGroups";
import CalendarView from "./components/pages/CalendarView";
import AutomationDashboard from "./components/pages/AutomationDashboard";
import Profile from "./components/pages/Profile";
import Settings from "./components/pages/Settings";
import Notifications from "./components/pages/Notifications";

export default function App() {
  const { currentPath } = useNavigationStore();

  const renderPage = () => {
    switch (currentPath) {
      case "/":
        return <Landing />;
      case "/features":
        return <Features />;
      case "/about":
        return <About />;
      case "/login":
        return <Login />;
      case "/register":
        return <Register />;
      case "/dashboard":
        return <Dashboard />;
      case "/tasks":
      case "/tasks/new":
        return <TaskList />;
      case "/study-buddy":
        return <StudyBuddy />;
      case "/deadlines":
        return <DeadlineDashboard />;
      case "/attendance":
        return <AttendanceDashboard />;
      case "/notices":
        return <NoticeCenter />;
      case "/placements":
        return <PlacementDashboard />;
      case "/study-groups":
        return <StudyGroups />;
      case "/calendar":
        return <CalendarView />;
      case "/automations":
        return <AutomationDashboard />;
      case "/profile":
        return <Profile />;
      case "/settings":
        return <Settings />;
      case "/notifications":
        return <Notifications />;
      default:
        return <Dashboard />;
    }
  };

  return <Layout>{renderPage()}</Layout>;
}
