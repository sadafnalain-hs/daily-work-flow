import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Plus,
  ExternalLink,
  CheckCircle2,
  Clock,
  Filter,
  Check,
  Calendar,
  Building,
  MapPin,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { JobRecord, JobStatus } from '../types';

interface JobSearchTrackerProps {
  jobs: JobRecord[];
  onUpdateJobs: (jobs: JobRecord[]) => void;
  onNavigateOutreach: () => void;
}

export const JobSearchTracker: React.FC<JobSearchTrackerProps> = ({
  jobs,
  onUpdateJobs,
  onNavigateOutreach,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New job state
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Remote (Worldwide / Pakistan eligible)');
  const [experienceReq, setExperienceReq] = useState('0–2 years (Junior / Entry-level)');
  const [skillsInput, setSkillsInput] = useState('Power BI, Excel, SQL, DAX');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [deadline, setDeadline] = useState('');

  // Daily target metrics
  const appliedToday = jobs.filter((j) => j.status === 'Applied').length;
  const savedCount = jobs.filter((j) => j.status === 'Saved' || j.status === 'To Apply').length;

  const handleStatusChange = (jobId: string, newStatus: JobStatus) => {
    const updated = jobs.map((j) => {
      if (j.id === jobId) {
        return {
          ...j,
          status: newStatus,
          appliedDate: newStatus === 'Applied' ? new Date().toISOString().split('T')[0] : j.appliedDate,
        };
      }
      return j;
    });
    onUpdateJobs(updated);
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newJob: JobRecord = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      experienceReq: experienceReq.trim(),
      requiredSkills: skills,
      applicationUrl: applicationUrl.trim() || 'https://www.linkedin.com/jobs',
      dateDiscovered: new Date().toISOString().split('T')[0],
      deadline: deadline || undefined,
      status: 'To Apply',
      notes: notes.trim(),
      isVerifiedRemote: true,
    };

    onUpdateJobs([newJob, ...jobs]);
    setIsAddModalOpen(false);
    setTitle('');
    setCompany('');
    setNotes('');
    setApplicationUrl('');
  };

  const filteredJobs = jobs.filter((j) => {
    if (statusFilter !== 'all' && j.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.requiredSkills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Career & Client Hub</h2>
          <p className="text-xs text-slate-500">
            Targeting Remote Junior Data Analyst & Freelance Power BI opportunities for Pakistan candidates
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-purple-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-800 transition-colors shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Job Opportunity</span>
        </button>
      </div>

      {/* Daily Target Progress Strip */}
      <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-900">Daily Job Search Discipline:</span>
              <span className="text-xs text-purple-700">Target: 2 roles reviewed + 2 applications tracked</span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Consistency beats volume. Highlighting your Urban Mart Power BI portfolio yields higher response rates.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <span className="text-[11px] font-semibold text-slate-500">To Apply</span>
              <div className="font-mono text-base font-bold text-slate-900 tabular-nums">
                {savedCount}
              </div>
            </div>
            <div className="text-center">
              <span className="text-[11px] font-semibold text-purple-700">Applied</span>
              <div className="font-mono text-base font-bold text-purple-900 tabular-nums">
                {appliedToday}
              </div>
            </div>
            <button
              onClick={onNavigateOutreach}
              className="rounded-xl border border-purple-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-purple-800 shadow-xs hover:bg-purple-50"
            >
              Draft Outreach →
            </button>
          </div>
        </div>
      </div>

      {/* Direct Verified External Job Search Links */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-purple-700" />
            <h3 className="text-xs font-bold text-slate-900">
              Live Search Portals (Filtered for Remote & Worldwide/Pakistan)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">External verified queries</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <a
            href="https://www.linkedin.com/jobs/search/?keywords=Junior%20Data%20Analyst&f_WT=2&f_TPR=r86400"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-800 hover:bg-purple-50 hover:border-purple-200 transition-colors"
          >
            <div>
              <div className="font-semibold text-slate-900">LinkedIn Remote</div>
              <div className="text-[11px] text-slate-500">Junior Data Analyst</div>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>

          <a
            href="https://www.upwork.com/nx/search/jobs/?q=Power%20BI%20dashboard&sort=recency"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-800 hover:bg-purple-50 hover:border-purple-200 transition-colors"
          >
            <div>
              <div className="font-semibold text-slate-900">Upwork Projects</div>
              <div className="text-[11px] text-slate-500">Power BI & Excel</div>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>

          <a
            href="https://wellfound.com/jobs?query=Data+Analyst&remote=true"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-800 hover:bg-purple-50 hover:border-purple-200 transition-colors"
          >
            <div>
              <div className="font-semibold text-slate-900">Wellfound Startup</div>
              <div className="text-[11px] text-slate-500">Global Remote Roles</div>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>

          <a
            href="https://remoteok.com/remote-data-analyst-jobs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-800 hover:bg-purple-50 hover:border-purple-200 transition-colors"
          >
            <div>
              <div className="font-semibold text-slate-900">RemoteOK Hub</div>
              <div className="text-[11px] text-slate-500">Analytics & BI</div>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {['all', 'Saved', 'To Apply', 'Applied', 'Interview', 'Follow Up', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status === 'all' ? 'All Roles' : status}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role, company, skill..."
            className="w-full sm:w-64 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Job Records List */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
            No job records match the selected filter. Click "Add Job Opportunity" to track a role.
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-purple-200 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                    <span className="font-semibold text-slate-700">@ {job.company}</span>
                    <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                      {job.location}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>Exp: {job.experienceReq}</span>
                    <span aria-hidden="true">·</span>
                    <span>Discovered: {job.dateDiscovered}</span>
                    {job.deadline && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-700 font-medium">Deadline: {job.deadline}</span>
                      </>
                    )}
                    {job.appliedDate && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-700 font-medium">Applied on {job.appliedDate}</span>
                      </>
                    )}
                  </div>

                  {/* Skills required */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {job.requiredSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {job.notes && (
                    <p className="mt-2.5 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                      {job.notes}
                    </p>
                  )}
                </div>

                {/* Status Switcher & External Link */}
                <div className="flex flex-col sm:items-end gap-2 shrink-0">
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job.id, e.target.value as JobStatus)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-purple-600 focus:outline-hidden"
                  >
                    <option value="Saved">Saved</option>
                    <option value="To Apply">To Apply</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Follow Up">Follow Up</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Closed">Closed</option>
                  </select>

                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-purple-700 hover:text-purple-900"
                  >
                    <span>View Listing</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Job Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Track Job Opportunity</h3>
            <form onSubmit={handleAddJob} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Junior Data Analyst"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. CloudPulse Data"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Remote</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Remote (Pakistan eligible)"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Experience Req</label>
                  <input
                    type="text"
                    value={experienceReq}
                    onChange={(e) => setExperienceReq(e.target.value)}
                    placeholder="e.g. 0–2 years"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="Power BI, DAX, Excel, SQL"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Application URL</label>
                  <input
                    type="url"
                    value={applicationUrl}
                    onChange={(e) => setApplicationUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Personal Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How my Urban Mart portfolio aligns with their requirements..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-700 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-800"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
