
export enum UserRole {
    CANDIDATE = 'CANDIDATE',
    HR = 'HR'
  }
  
  export interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Contract';
    description: string;
    requirements: string;
    postedDate: string;
  }
  
  export interface ATSAnalysis {
    score: number;
    missingKeywords: string[];
    summary: string;
    strengths: string[];
  }
  
  export enum ApplicationStatus {
    PENDING = 'Pending Analysis',
    REJECTED_AUTO = 'Auto-Rejected (Low Score)',
    SHORTLISTED = 'Shortlisted',
    ASSESSMENT_SENT = 'Assessment Sent',
    HIRED = 'Hired'
  }
  
  export interface Application {
    id: string;
    jobId: string;
    candidateName: string;
    candidateEmail: string;
    resumeFileName: string;
    appliedDate: string;
    atsData?: ATSAnalysis;
    status: ApplicationStatus;
  }
  
  export const INITIAL_JOBS: Job[] = [
    {
      id: '1',
      title: 'Senior React Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'We are looking for a Senior React Engineer to lead our frontend initiatives. You will be responsible for architecting scalable UI components.',
      requirements: '5+ years of React, TypeScript, Tailwind CSS, State Management (Redux/Zustand), Performance Optimization.',
      postedDate: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
      description: 'Join our product team to drive the roadmap for our SaaS platform. You will work closely with engineering and design.',
      requirements: 'Experience with Agile, User Research, Roadmap planning, Jira, Linear, Strong communication skills.',
      postedDate: new Date().toISOString()
    }
  ];
