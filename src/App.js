import React from "react";
import "./App.css";
import {
   BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

// --- Core Components ---
import Hero from "./components/Hero";
import Login from "./components/Login";
import Register from "./components/Register";
import JobPage from "./pages/JobPage";
import JobDetails from "./components/JobDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import OfferBanner from "./components/OfferBanner";
import Categories from "./components/Categories";
// import Notifications from "./components/Notifications";

// --- Page Components ---
import EmpLogin from "./pages/EmployerLogin";
import EmpRegister from "./pages/EmployerRegister";
// import AdminLogin from "./pages/AdminLogin";
import EmpDashboard from "./pages/EmployerDashboard";
import PostAJob from "./pages/PostAJob";
import EmpProfile from "./pages/EmpViewProfile";
// import MyJobs from "./pages/MyJobs";
import AllApplicants from "./pages/AllApplicants";
import ScheduleInterview from "./pages/ScheduleInterview";
import ApplicantProfile from "./pages/ApplicantProfile";
import UserProfile from "./pages/ViewProfile";
import UserApplications from "./pages/AppliedJobs";
import SavedJobs from "./pages/SavedJobs";
import AdminDashboard from "./pages/AdminDashboard";
// import ManageUsers from "./pages/ManageUsers";
// import ManageJobs from "./pages/ManageJobs";
// import ManageCompanies from "./pages/ManageCompanies";
// import JobSeeker from "./pages/JobSeeker";
// import Employer from "./pages/Employer";
// import AboutUs from "./pages/AboutUs";
// import ContactUs from "./pages/ContactUs";
// import NotFound from "./pages/NotFound";

// --- Layouts ---
import AdminLayout from "./components/admin/AdminLayout";

// --- Role-based Routing ---
import {
  JobSeekerRoutes,
  EmployerRoutes,
  AdminRoutes,
} from "./routes/roleRoutes";

// A simple wrapper for pages that need Navbar and Footer
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

// Wrapper for the Hero component to handle search navigation
const HomePage = () => {
  const navigate = useNavigate();
  const handleSearch = (searchCriteria) => {
    const { skills, location, experience } = searchCriteria;
    const queryParams = new URLSearchParams({
      skills: skills || "",
      location: location || "",
      experience: experience || "",
    }).toString();
    navigate(`/jobs?${queryParams}`);
  };
  return (
    <>
      <Hero onSearch={handleSearch} />
      <OfferBanner />
      <Categories />
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes with Main Layout */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/jobs" element={<MainLayout><JobPage /></MainLayout>} />
        <Route path="/job/:id" element={<MainLayout><JobDetails /></MainLayout>} />

        {/* Auth and Standalone Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employer-login" element={<EmpLogin />} />
        <Route path="/employer-register" element={<EmpRegister />} />

        {/* Job Seeker Routes */}
        <Route
          path="/profile"
          element={<MainLayout><JobSeekerRoutes element={UserProfile} /></MainLayout>}
        />
        <Route
          path="/applied-jobs"
          element={<MainLayout><JobSeekerRoutes element={UserApplications} /></MainLayout>}
        />
        <Route
          path="/saved-jobs"
          element={<MainLayout><JobSeekerRoutes element={SavedJobs} /></MainLayout>}
        />


        {/* Employer Routes */}
        <Route
          path="/employer/dashboard"
          element={<EmployerRoutes element={EmpDashboard} />}
        />
        <Route
          path="/post-job"
          element={<EmployerRoutes element={PostAJob} />}
        />
        <Route
          path="/employer/profile"
          element={<EmployerRoutes element={EmpProfile} />}
        />
        <Route
          path="/employer/applicants/:jobId"
          element={<EmployerRoutes element={AllApplicants} />}
        />
        <Route
          path="/employer/schedule-interview/:applicationId"
          element={<EmployerRoutes element={ScheduleInterview} />}
        />
         <Route
          path="/employer/applicant/:applicationId"
          element={<EmployerRoutes element={ApplicantProfile} />}
        />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoutes element={AdminLayout} />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}


export default App;