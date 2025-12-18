import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

const JobsTab = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      const querySnapshot = await getDocs(collection(db, "jobs"));
      const jobsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsList);
    }
    fetchJobs();
  }, []);

  return (
    <div>
      <h1>Job Board</h1>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            <h2>{job.title}</h2>
            <p>{job.description}</p>
            <p>Status: {job.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobsTab;
