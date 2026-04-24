import React from "react";
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
  return <Hero onSearch={handleSearch} />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes with Main Layout */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/jobs" element={<MainLayout><JobPage /></MainLayout>} />
        <Route path="/job-details/:id" element={<MainLayout><JobDetails /></MainLayout>} />
        {/* <Route path="/about-us" element={<MainLayout><AboutUs /></MainLayout>} /> */}
        {/* <Route path="/contact-us" element={<MainLayout><ContactUs /></MainLayout>} /> */}

        {/* Auth and Standalone Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/job-seeker" element={<JobSeeker />} /> */}
        {/* <Route path="/employer" element={<Employer />} /> */}
        <Route path="/employer-login" element={<EmpLogin />} />
        <Route path="/employer-register" element={<EmpRegister />} />
        {/* <Route path="/admin-login" element={<AdminLogin />} /> */}

        {/* Job Seeker Routes */}
        <Route
          path="/user-profile"
          element={<JobSeekerRoutes element={UserProfile} />}
        />
        <Route
          path="/my-applications"
          element={<JobSeekerRoutes element={UserApplications} />}
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
          path="/employer-profile"
          element={<EmployerRoutes element={EmpProfile} />}
        />
        {/* <Route path="/my-jobs" element={<EmployerRoutes element={MyJobs} />} /> */}
        <Route
          path="/applicants/:jobId"
          element={<EmployerRoutes element={AllApplicants} />}
        />
        <Route
          path="/schedule-interview/:applicationId"
          element={<EmployerRoutes element={ScheduleInterview} />}
        />
        {/* <Route
          path="/notifications"
          element={<EmployerRoutes element={Notifications} />}
        /> */}
         <Route
          path="/applicant/:applicationId"
          element={<EmployerRoutes element={ApplicantProfile} />}
        />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoutes element={AdminLayout} />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          {/* <Route path="users" element={<ManageUsers />} /> */}
          {/* <Route path="companies" element={<ManageCompanies />} /> */}
          {/* <Route path="jobs" element={<ManageJobs />} /> */}
        </Route>

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}


export default App;