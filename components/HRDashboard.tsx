
import React, { useState } from 'react';
import { Job, Application, ApplicationStatus } from '../types';
import { PlusCircle, User, Mail, CheckCircle, XCircle, Send, BarChart2, FileText } from 'lucide-react';
import { generateAssessment } from '../services/geminiService';

interface HRDashboardProps {
  jobs: Job[];
  applications: Application[];
  onAddJob: (job: Job) => void;
  onUpdateStatus: (appId: string, status: ApplicationStatus) => void;
}

const HRDashboard: React.FC<HRDashboardProps> = ({ jobs, applications, onAddJob, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates'>('candidates');
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loadingAssessment, setLoadingAssessment] = useState(false);

  // Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobReqs, setJobReqs] = useState('');

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
        id: Math.random().toString(36).substr(2, 9),
        title: jobTitle,
        description: jobDesc,
        requirements: jobReqs,
        department: 'General',
        location: 'Remote',
        type: 'Full-time',
        postedDate: new Date().toISOString()
    };
    onAddJob(newJob);
    setShowJobForm(false);
    setJobTitle('');
    setJobDesc('');
    setJobReqs('');
  };

  const handleSendAssessment = async (app: Application) => {
    if (!app.atsData) return;
    
    setLoadingAssessment(true);
    const jobTitle = jobs.find(j => j.id === app.jobId)?.title || 'Role';
    
    // Generate email content using Gemini
    const emailContent = await generateAssessment(jobTitle, app.atsData.missingKeywords);
    
    alert(`ASSESSMENT EMAIL SENT TO: ${app.candidateEmail}\n\nCONTENT:\n${emailContent}`);
    
    onUpdateStatus(app.id, ApplicationStatus.ASSESSMENT_SENT);
    setLoadingAssessment(false);
  };

  // Filter relevant applications. 
  // Note: The system stores all applications, but explicitly marks those < 75 as REJECTED_AUTO.
  // We sort by score descending to show top talent first.
  const relevantApplications = applications.sort((a, b) => (b.atsData?.score || 0) - (a.atsData?.score || 0));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-4 bg-slate-200 p-1 rounded-lg">
            <button
                onClick={() => setActiveTab('candidates')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'candidates' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Candidates
            </button>
            <button
                onClick={() => setActiveTab('jobs')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'jobs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Manage Jobs
            </button>
        </div>
        {activeTab === 'jobs' && (
            <button
                onClick={() => setShowJobForm(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
                <PlusCircle size={16} /> Post Job
            </button>
        )}
      </div>

      {activeTab === 'jobs' ? (
        <div className="grid gap-4">
            {showJobForm && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 mb-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Post New Job</h3>
                    <form onSubmit={handleCreateJob} className="space-y-4">
                        <input className="w-full p-2 border rounded" placeholder="Job Title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} required />
                        <textarea className="w-full p-2 border rounded" placeholder="Description" value={jobDesc} onChange={e => setJobDesc(e.target.value)} required />
                        <textarea className="w-full p-2 border rounded" placeholder="Requirements (Skills, Keywords)" value={jobReqs} onChange={e => setJobReqs(e.target.value)} required />
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setShowJobForm(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Post</button>
                        </div>
                    </form>
                </div>
            )}
            {jobs.map(job => (
                <div key={job.id} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-slate-800">{job.title}</h4>
                        <p className="text-sm text-slate-500">{job.department} • {job.location}</p>
                    </div>
                    <div className="text-sm text-slate-400">Posted: {new Date(job.postedDate).toLocaleDateString()}</div>
                </div>
            ))}
        </div>
      ) : (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Candidate List */}
                <div className="lg:col-span-1 space-y-3">
                    {relevantApplications.length === 0 && (
                        <div className="text-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                            No applications yet.
                        </div>
                    )}
                    {relevantApplications.map(app => {
                        const isHighScoring = (app.atsData?.score || 0) >= 75;
                        return (
                            <div 
                                key={app.id} 
                                onClick={() => setSelectedApp(app)}
                                className={`bg-white p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${selectedApp?.id === app.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-semibold text-slate-900">{app.candidateName}</h4>
                                        <p className="text-xs text-slate-500 truncate">{jobs.find(j => j.id === app.jobId)?.title}</p>
                                    </div>
                                    {app.atsData && (
                                        <div className={`px-2 py-1 rounded text-xs font-bold ${isHighScoring ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {app.atsData.score}%
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className={`px-2 py-0.5 rounded-full ${
                                        app.status === ApplicationStatus.SHORTLISTED ? 'bg-green-100 text-green-700' :
                                        app.status === ApplicationStatus.ASSESSMENT_SENT ? 'bg-blue-100 text-blue-700' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Detailed View */}
                <div className="lg:col-span-2">
                    {selectedApp ? (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800">{selectedApp.candidateName}</h2>
                                        <div className="flex items-center gap-4 text-slate-500 text-sm mt-1">
                                            <span className="flex items-center gap-1"><Mail size={14} /> {selectedApp.candidateEmail}</span>
                                            <span className="flex items-center gap-1"><BarChart2 size={14} /> Applied: {new Date(selectedApp.appliedDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-indigo-600 text-sm mt-2">
                                             <FileText size={14} /> Resume: {selectedApp.resumeFileName}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                         <div className="text-3xl font-bold text-indigo-600">{selectedApp.atsData?.score}<span className="text-lg text-slate-400 font-normal">/100</span></div>
                                         <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">ATS Score</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* ATS Analysis Section */}
                                {selectedApp.atsData && (
                                    <>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">AI Summary</h3>
                                            <div className="bg-indigo-50 text-indigo-900 p-4 rounded-lg text-sm leading-relaxed">
                                                {selectedApp.atsData.summary}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <CheckCircle size={16} /> Strengths
                                                </h3>
                                                <ul className="space-y-2">
                                                    {selectedApp.atsData.strengths.map((str, i) => (
                                                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                            <span className="mt-1.5 w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></span>
                                                            {str}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                    <XCircle size={16} /> Missing Keywords
                                                </h3>
                                                <ul className="space-y-2">
                                                    {selectedApp.atsData.missingKeywords.map((kw, i) => (
                                                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                                            <span className="mt-1.5 w-1 h-1 bg-red-500 rounded-full flex-shrink-0"></span>
                                                            {kw}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="border-t border-slate-100 pt-6 mt-6">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Actions</h3>
                                    <div className="flex gap-3">
                                        {selectedApp.atsData && selectedApp.atsData.score >= 75 ? (
                                            <button 
                                                onClick={() => handleSendAssessment(selectedApp)}
                                                disabled={loadingAssessment || selectedApp.status === ApplicationStatus.ASSESSMENT_SENT}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all ${
                                                    selectedApp.status === ApplicationStatus.ASSESSMENT_SENT 
                                                    ? 'bg-slate-400 cursor-not-allowed' 
                                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-900/20'
                                                }`}
                                            >
                                                {loadingAssessment ? 'Generating...' : selectedApp.status === ApplicationStatus.ASSESSMENT_SENT ? 'Assessment Sent' : 'Send Assessment'}
                                                {!loadingAssessment && <Send size={16} />}
                                            </button>
                                        ) : (
                                            <div className="text-sm text-slate-500 italic">
                                                Score too low for automated assessment trigger. Manual review required.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="text-center">
                                <User size={48} className="mx-auto mb-2 opacity-50" />
                                <p>Select a candidate to view analysis details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default HRDashboard;
