import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import JobList from "../components/JobList";
import JobFilters from "../components/JobFilters";
import "./CategoryPage.css";

function CategoryPage() {
  const { category } = useParams();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/jobs");
        const allJobs = res.data;
        
        // Filter jobs by category, ensuring case-insensitivity
        const categoryJobs = allJobs.filter((job) => 
          job.category && job.category.toLowerCase() === category.toLowerCase()
        );
        
        setJobs(categoryJobs);
        setFilteredJobs(categoryJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [category]);

  const handleFilter = (filters) => {
    let tempJobs = [...jobs];

    if (filters.searchTerm) {
      tempJobs = tempJobs.filter((job) =>
        job.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.location) {
      tempJobs = tempJobs.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredJobs(tempJobs);
  };

  return (
    <div className="category-page-container">
      <h1 className="category-page-title">
        Jobs in: <span>{category}</span>
      </h1>

      <div className="category-page-layout">
        <aside className="category-page-sidebar">
          <JobFilters onFilter={handleFilter} />
        </aside>

        <main className="category-page-content">
          {loading ? (
            <p className="loading-text">Loading jobs...</p>
          ) : (
            <JobList jobs={filteredJobs} />
          )}
        </main>
      </div>
    </div>
  );
}

export default CategoryPage;