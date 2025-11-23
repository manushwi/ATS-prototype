import React from 'react';
import { UserRole } from '../types';
import { Briefcase, Users, LayoutDashboard } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentRole: UserRole;
  onRoleSwitch: (role: UserRole) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentRole, onRoleSwitch }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar / Nav */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 transition-all duration-300">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-700">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Briefcase size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">SmartHire</span>
        </div>

        <nav className="p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
            Switch View
          </div>
          
          <button
            onClick={() => onRoleSwitch(UserRole.CANDIDATE)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentRole === UserRole.CANDIDATE
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Briefcase size={20} />
            <span>Find Jobs</span>
          </button>

          <button
            onClick={() => onRoleSwitch(UserRole.HR)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentRole === UserRole.HR
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>HR Dashboard</span>
          </button>
        </nav>

        <div className="p-4 mt-auto">
            <div className="bg-slate-800 rounded-xl p-4 text-xs text-slate-400">
                <p className="mb-2 font-semibold text-slate-300">Current Mode:</p>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${currentRole === UserRole.HR ? 'bg-indigo-500' : 'bg-blue-500'}`}></div>
                    {currentRole === UserRole.HR ? 'Recruiter / HR' : 'Job Seeker'}
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 flex-shrink-0">
          <h1 className="text-xl font-semibold text-slate-800">
            {currentRole === UserRole.CANDIDATE ? 'Career Opportunities' : 'Talent Acquisition Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
             <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">
                {currentRole === UserRole.HR ? 'HR' : 'ME'}
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto">
                {children}
            </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;