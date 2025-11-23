
import React, { useState } from 'react';
import { Job, Application, ApplicationStatus, ATSAnalysis } from '../types';
import { MapPin, Clock, CheckCircle, AlertCircle, UploadCloud, X, FileText } from 'lucide-react';
import { analyzeResumeWithGemini } from '../services/geminiService';

interface CandidateViewProps {
  jobs: Job[];
  onApply: (application: Application) => void;
}

const CandidateView: React.FC<CandidateViewProps> = ({ jobs, onApply }) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplying(true);
  };

  const closeModal = () => {
    setIsApplying(false);
    setSelectedJob(null);
    setName('');
    setEmail('');
    setResumeFile(null);
    setIsAnalyzing(false);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove metadata prefix like "data:application/pdf;base64,"
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !resumeFile) return;

    setIsAnalyzing(true);

    try {
        const base64Resume = await fileToBase64(resumeFile);

        // 1. Gemini Analysis with PDF
        const atsData: ATSAnalysis = await analyzeResumeWithGemini(
            selectedJob.description,
            selectedJob.requirements,
            base64Resume
        );

        // 2. Determine Status based on Score
        // Requirement: if score > 75 then store it in list.
        // We store all, but Status reflects the auto-rejection if < 75.
        let status = ApplicationStatus.PENDING;
        if (atsData.score >= 75) {
            status = ApplicationStatus.SHORTLISTED;
        } else {
            status = ApplicationStatus.REJECTED_AUTO;
        }

        // 3. Create Application Object
        const newApplication: Application = {
            id: Math.random().toString(36).substr(2, 9),
            jobId: selectedJob.id,
            candidateName: name,
            candidateEmail: email,
            resumeFileName: resumeFile.name,
            appliedDate: new Date().toISOString(),
            atsData: atsData,
            status: status
        };

        onApply(newApplication);
        
        // Simulate delay for UX
        setTimeout(() => {
            setIsAnalyzing(false);
            closeModal();
            alert(`Application Submitted!\nATS Score: ${atsData.score}/100.\nStatus: ${status === ApplicationStatus.SHORTLISTED ? 'Shortlisted' : 'Under Review/Rejected'}`);
        }, 1000);
    } catch (error) {
        console.error("Application error:", error);
        setIsAnalyzing(false);
        alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Open Positions</h2>
        <p className="text-slate-500">Find your next dream job. Upload your resume PDF and get instant AI feedback.</p>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
                 <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium border border-blue-100">{job.department}</span>
              </div>
              <div className="flex items-center text-sm text-slate-500 gap-4 mb-3">
                <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {job.type}</span>
              </div>
              <p className="text-slate-600 line-clamp-2 max-w-2xl">{job.description}</p>
            </div>
            <button
              onClick={() => handleApplyClick(job)}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {isApplying && selectedJob && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Apply for {selectedJob.title}</h3>
                <p className="text-xs text-slate-500">Powered by Gemini ATS</p>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <div>
                        <h4 className="text-lg font-semibold text-slate-800">Analyzing Resume PDF...</h4>
                        <p className="text-sm text-slate-500">Gemini is scanning your document against job requirements.</p>
                    </div>
                </div>
              ) : (
                <>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="John Doe"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Upload Resume (PDF)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:bg-slate-50 transition-colors relative">
                            <div className="space-y-1 text-center">
                                {resumeFile ? (
                                    <div className="flex flex-col items-center">
                                        <FileText className="mx-auto h-12 w-12 text-blue-500" />
                                        <p className="text-sm text-slate-800 font-medium mt-2">{resumeFile.name}</p>
                                        <p className="text-xs text-slate-500">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                                        <button 
                                            type="button" 
                                            onClick={() => setResumeFile(null)}
                                            className="mt-2 text-xs text-red-500 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                                        <div className="flex text-sm text-slate-600 justify-center">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                <span>Upload a file</span>
                                                <input 
                                                    type="file" 
                                                    className="sr-only" 
                                                    accept=".pdf"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            setResumeFile(e.target.files[0]);
                                                        }
                                                    }}
                                                    required
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-slate-500">PDF up to 5MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={18} />
                            Submit & Analyze
                        </button>
                    </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateView;
