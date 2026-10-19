import React, { useState } from 'react';
import {
  Mail,
  Copy,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Plus,
  Send,
  Calendar,
  Clock,
  User,
  Building,
  Check,
} from 'lucide-react';
import { OutreachContact, OutreachStatus } from '../types';

interface OutreachWorkspaceProps {
  contacts: OutreachContact[];
  onUpdateContacts: (contacts: OutreachContact[]) => void;
}

export const OutreachWorkspace: React.FC<OutreachWorkspaceProps> = ({
  contacts,
  onUpdateContacts,
}) => {
  const [selectedContactId, setSelectedContactId] = useState<string>(contacts[0]?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // New Contact form
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Analytics Manager / Recruiter');
  const [email, setEmail] = useState('');
  const [need, setNeed] = useState('Power BI dashboards and Excel automation');
  const [notes, setNotes] = useState('');

  const activeContact = contacts.find((c) => c.id === selectedContactId) || contacts[0];

  const handleCopyEmail = () => {
    if (!activeContact) return;
    const fullText = `Subject: ${activeContact.subject}\n\n${activeContact.body}`;
    navigator.clipboard.writeText(fullText);
    setCopiedAlert(true);
    setTimeout(() => setCopiedAlert(false), 3000);
  };

  const handleMarkAsSent = () => {
    if (!activeContact) return;
    const updated = contacts.map((c) => {
      if (c.id === activeContact.id) {
        return {
          ...c,
          status: 'Sent' as OutreachStatus,
          sentAt: new Date().toISOString(),
        };
      }
      return c;
    });
    onUpdateContacts(updated);
  };

  const handleUpdateActiveEmail = (subject: string, body: string) => {
    if (!activeContact) return;
    const updated = contacts.map((c) => {
      if (c.id === activeContact.id) {
        return { ...c, subject, body };
      }
      return c;
    });
    onUpdateContacts(updated);
  };

  const handleGenerateAiEmail = async () => {
    if (!activeContact) return;
    setIsAiGenerating(true);

    try {
      const res = await fetch('/api/gemini/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: activeContact.contactName,
          company: activeContact.company,
          role: activeContact.role,
          relevantNeed: activeContact.relevantNeed,
          personalizationNotes: activeContact.personalizationNotes,
        }),
      });
      const data = await res.json();
      if (data.email) {
        handleUpdateActiveEmail(data.email.subject, data.email.body);
      }
    } catch (err) {
      console.error('Failed to generate AI email:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) return;

    const defaultSubject = `Power BI & Excel Reporting | Quick intro for ${company}`;
    const defaultBody = `Hi ${name.trim()},

I noticed ${company}'s work and wanted to reach out regarding your analytics reporting.

As a Junior Data Analyst based in Lahore specializing in Power BI, DAX, and Excel automation, I help organizations transform complex operational data into interactive executive dashboards.

I recently completed an end-to-end retail performance dashboard (Urban Mart) covering $4.2M in sales with dynamic YoY measures and automated star schema modeling.

${notes ? `Note: ${notes}\n\n` : ''}Would you be open to a quick 5-minute chat or seeing an interactive portfolio link?

Best regards,
Sadaf Nalain
Junior Data Analyst | Lahore, Pakistan`;

    const newContact: OutreachContact = {
      id: `out-${Date.now()}`,
      contactName: name.trim(),
      company: company.trim(),
      role: role.trim(),
      verifiedEmail: email.trim(),
      relevantNeed: need.trim(),
      personalizationNotes: notes.trim(),
      subject: defaultSubject,
      body: defaultBody,
      status: 'Draft',
    };

    onUpdateContacts([newContact, ...contacts]);
    setSelectedContactId(newContact.id);
    setIsAddModalOpen(false);
    setName('');
    setCompany('');
    setEmail('');
    setNotes('');
  };

  const sentCount = contacts.filter((c) => c.status === 'Sent' || c.status === 'Replied').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Personalized Email Outreach Workspace</h2>
          <p className="text-xs text-slate-500">
            Daily target: 2 tailored emails to recruiters and prospective Power BI dashboard clients
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-purple-200 bg-purple-50/60 px-3 py-1.5 text-xs text-purple-900">
            <span className="font-semibold">Today's Outreach:</span>{' '}
            <span className="font-mono font-bold tabular-nums">{sentCount} / 2 sent</span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-purple-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Contact Queue */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900">Prospective Contacts ({contacts.length})</h3>
            <span className="text-[11px] text-slate-500">Select to review draft</span>
          </div>

          <div className="space-y-2">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContactId(contact.id)}
                className={`w-full rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                  contact.id === activeContact?.id
                    ? 'border-purple-300 bg-purple-50/50'
                    : 'border-slate-100 bg-slate-50/40 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{contact.contactName}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                      contact.status === 'Sent'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {contact.status}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500 truncate">
                  {contact.role} @ {contact.company}
                </div>
                {contact.verifiedEmail && (
                  <div className="mt-1 text-[10px] font-mono text-slate-400 truncate">
                    {contact.verifiedEmail}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Email Draft & Personalization Editor */}
        {activeContact ? (
          <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              {/* Recipient Details Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {activeContact.contactName}
                    </h3>
                    <span className="text-xs font-medium text-slate-500">
                      ({activeContact.role} @ {activeContact.company})
                    </span>
                  </div>
                  {activeContact.verifiedEmail && (
                    <div className="mt-0.5 text-xs font-mono text-purple-700">
                      {activeContact.verifiedEmail}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateAiEmail}
                    disabled={isAiGenerating}
                    className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-800 hover:bg-purple-100 disabled:opacity-50 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                    <span>{isAiGenerating ? 'Drafting...' : 'Polish with AI'}</span>
                  </button>
                </div>
              </div>

              {/* Personalization & Needs Context */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs space-y-1">
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">Business Need: </span>
                  {activeContact.relevantNeed}
                </div>
                {activeContact.personalizationNotes && (
                  <div className="text-slate-600">
                    <span className="font-semibold text-slate-800">Personalization Hook: </span>
                    {activeContact.personalizationNotes}
                  </div>
                )}
              </div>

              {/* Email Subject Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={activeContact.subject}
                  onChange={(e) => handleUpdateActiveEmail(e.target.value, activeContact.body)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              {/* Email Body Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Message Body
                </label>
                <textarea
                  rows={8}
                  value={activeContact.body}
                  onChange={(e) => handleUpdateActiveEmail(activeContact.subject, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-slate-800 leading-relaxed font-sans focus:border-purple-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy to Clipboard</span>
                </button>

                {activeContact.verifiedEmail && (
                  <a
                    href={`mailto:${activeContact.verifiedEmail}?subject=${encodeURIComponent(
                      activeContact.subject
                    )}&body=${encodeURIComponent(activeContact.body)}`}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                    <span>Open in Mail App</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeContact.status !== 'Sent' ? (
                  <button
                    onClick={handleMarkAsSent}
                    className="flex items-center gap-1.5 rounded-xl bg-purple-700 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-800 transition-colors"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Mark as Sent Today</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Sent & Recorded</span>
                  </div>
                )}
              </div>
            </div>

            {copiedAlert && (
              <div className="mt-3 rounded-lg bg-emerald-100 p-2 text-center text-xs font-semibold text-emerald-900">
                Email subject and body copied to clipboard!
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
            Select or add a contact to start drafting personalized outreach.
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Outreach Contact</h3>
            <form onSubmit={handleCreateContact} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bilal Ahmed"
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
                    placeholder="e.g. RetailMetric Partners"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Title</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Head of Data"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="bilal@company.com"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Relevant Need / Service</label>
                <input
                  type="text"
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  placeholder="e.g. Migrating Excel sales reports into Power BI star schema"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Personalization Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Saw their recent post on retail margin drops..."
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
                  Create Outreach Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
