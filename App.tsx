import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import CandidateView from './components/CandidateView';
import HRDashboard from './components/HRDashboard';
import { Job, Application, UserRole, INITIAL_JOBS, ApplicationStatus } from './types';

const App: React.FC = () => {
  // State Management (Mock Database)
  // In a real app, this would be fetched from a backend API
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.CANDIDATE);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [applications, setApplications] = useState<Application[]>([]);

  // Load data from local storage on mount to persist across refreshes
  useEffect(() => {
    const storedApps = localStorage.getItem('smarthire_apps');
    const storedJobs = localStorage.getItem('smarthire_jobs');
    
    if (storedApps) setApplications(JSON.parse(storedApps));
    if (storedJobs) setJobs(JSON.parse(storedJobs));
  }, []);

  // Save to local storage whenever data changes
  useEffect(() => {
    localStorage.setItem('smarthire_apps', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('smarthire_jobs', JSON.stringify(jobs));
  }, [jobs]);

  const handleAddJob = (newJob: Job) => {
    setJobs(prev => [newJob, ...prev]);
  };

  const handleApply = (newApplication: Application) => {
    setApplications(prev => [newApplication, ...prev]);
  };

  const handleStatusUpdate = (appId: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, status } : app
    ));
  };

  return (
    <Layout currentRole={currentRole} onRoleSwitch={setCurrentRole}>
      {currentRole === UserRole.CANDIDATE ? (
        <CandidateView jobs={jobs} onApply={handleApply} />
      ) : (
        <HRDashboard 
            jobs={jobs} 
            applications={applications} 
            onAddJob={handleAddJob}
            onUpdateStatus={handleStatusUpdate}
        />
      )}
    </Layout>
  );
};

export default App;