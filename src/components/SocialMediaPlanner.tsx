import React, { useState, useEffect } from 'react';
import {
  Share2,
  Copy,
  Plus,
  Clock,
  Play,
  Pause,
  Save,
  CheckCircle2,
  ExternalLink,
  Linkedin,
  Instagram,
  Facebook,
  Globe,
  Tag,
} from 'lucide-react';
import { SocialMediaPost, SocialPlatform, SocialPostStatus } from '../types';

interface SocialMediaPlannerProps {
  posts: SocialMediaPost[];
  onUpdatePosts: (posts: SocialMediaPost[]) => void;
}

export const SocialMediaPlanner: React.FC<SocialMediaPlannerProps> = ({
  posts,
  onUpdatePosts,
}) => {
  const [selectedPostId, setSelectedPostId] = useState<string>(posts[0]?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedAlert, setCopiedAlert] = useState(false);

  // 90-minute daily content target timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [loggedMinutesToday, setLoggedMinutesToday] = useState(45); // initial progress toward 90m

  // New post form state
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>('LinkedIn');
  const [postType, setPostType] = useState<any>('Power BI dashboard');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('#PowerBI #DataAnalytics #DataStorytelling #CareerInData');
  const [attachmentNote, setAttachmentNote] = useState('');
  const [plannedDate, setPlannedDate] = useState(new Date().toISOString().split('T')[0]);

  const activePost = posts.find((p) => p.id === selectedPostId) || posts[0];

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveTimer = () => {
    if (timerSeconds < 10) return;
    const added = Math.max(1, Math.round(timerSeconds / 60));
    setLoggedMinutesToday((prev) => prev + added);
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const handleCopyPost = () => {
    if (!activePost) return;
    const fullText = `${activePost.caption}\n\n${activePost.hashtags}`;
    navigator.clipboard.writeText(fullText);
    setCopiedAlert(true);
    setTimeout(() => setCopiedAlert(false), 3000);
  };

  const handleStatusChange = (postId: string, status: SocialPostStatus) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        return { ...p, status };
      }
      return p;
    });
    onUpdatePosts(updated);
  };

  const handleUpdateCaption = (caption: string, hashtags: string) => {
    if (!activePost) return;
    const updated = posts.map((p) => {
      if (p.id === activePost.id) {
        return { ...p, caption, hashtags };
      }
      return p;
    });
    onUpdatePosts(updated);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const newPost: SocialMediaPost = {
      id: `soc-${Date.now()}`,
      topic: topic.trim(),
      platform,
      postType,
      caption: caption.trim() || 'Write engaging post copy showcasing your analytics project or tip...',
      hashtags: hashtags.trim(),
      attachmentNote: attachmentNote.trim(),
      plannedDate,
      status: 'Draft',
    };

    onUpdatePosts([newPost, ...posts]);
    setSelectedPostId(newPost.id);
    setIsAddModalOpen(false);
    setTopic('');
    setCaption('');
    setAttachmentNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Target Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Social Media Content Planner</h2>
          <p className="text-xs text-slate-500">
            Showcase your Power BI dashboards, Excel tips, and AI automation learnings
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* 90-minute daily target indicator */}
          <div className="flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50/60 px-3 py-1.5 text-xs text-purple-900 shadow-xs">
            <Clock className="h-4 w-4 text-purple-700" />
            <span className="font-semibold">Content Target:</span>
            <span className="font-mono font-bold tabular-nums">
              {loggedMinutesToday} / 90 min
            </span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-purple-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-800 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Post</span>
          </button>
        </div>
      </div>

      {/* Target Focus Stopwatch Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900">Daily 90-Minute Content Creation Session</h3>
          <p className="text-xs text-slate-500">
            Dedicated time for drafting case studies, taking dashboard screenshots, and writing carousel captions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {formatTimer(timerSeconds)}
          </div>
          {!isTimerRunning ? (
            <button
              onClick={() => setIsTimerRunning(true)}
              className="flex items-center gap-1.5 rounded-xl bg-purple-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-800"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={() => setIsTimerRunning(false)}
              className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
            >
              <Pause className="h-3 w-3" />
              <span>Pause</span>
            </button>
          )}
          <button
            onClick={handleSaveTimer}
            disabled={timerSeconds < 10}
            className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40"
          >
            Log Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Post Queue */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900">Content Queue ({posts.length})</h3>
            <span className="text-[11px] text-slate-500">Select to edit</span>
          </div>

          <div className="space-y-2">
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => setSelectedPostId(post.id)}
                className={`w-full rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                  post.id === activePost?.id
                    ? 'border-purple-300 bg-purple-50/50'
                    : 'border-slate-100 bg-slate-50/40 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                    {post.topic}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                      post.status === 'Published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : post.status === 'Ready'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-purple-700">{post.platform}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.postType}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Active Post Editor & Copy Station */}
        {activePost ? (
          <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{activePost.topic}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-purple-700">{activePost.platform}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activePost.postType}</span>
                    <span aria-hidden="true">·</span>
                    <span>Planned Date: {activePost.plannedDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={activePost.status}
                    onChange={(e) => handleStatusChange(activePost.id, e.target.value as SocialPostStatus)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-purple-600 focus:outline-hidden"
                  >
                    <option value="Idea">Idea</option>
                    <option value="Draft">Draft</option>
                    <option value="Ready">Ready</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              {activePost.attachmentNote && (
                <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-3 text-xs text-purple-900">
                  <span className="font-semibold">Media Attachment Reference: </span>
                  {activePost.attachmentNote}
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Post Caption & Storytelling
                </label>
                <textarea
                  rows={9}
                  value={activePost.caption}
                  onChange={(e) => handleUpdateCaption(e.target.value, activePost.hashtags)}
                  className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-slate-800 leading-relaxed font-sans focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hashtags</label>
                <input
                  type="text"
                  value={activePost.hashtags}
                  onChange={(e) => handleUpdateCaption(activePost.caption, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-purple-900 font-mono focus:border-purple-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleCopyPost}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy Caption + Hashtags</span>
              </button>

              <button
                onClick={() => handleStatusChange(activePost.id, 'Published')}
                disabled={activePost.status === 'Published'}
                className="flex items-center gap-1.5 rounded-xl bg-purple-700 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-800 disabled:bg-emerald-600 transition-colors"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{activePost.status === 'Published' ? 'Marked Published' : 'Mark as Published'}</span>
              </button>
            </div>

            {copiedAlert && (
              <div className="mt-3 rounded-lg bg-emerald-100 p-2 text-center text-xs font-semibold text-emerald-900">
                Post caption and hashtags copied to clipboard!
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Add Post Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Plan Social Media Post</h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Post Topic / Hook *</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. 3 DAX tricks that transformed my Urban Mart dashboard"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Post Type</label>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                  >
                    <option value="Power BI dashboard">Power BI dashboard</option>
                    <option value="Project showcase">Project showcase</option>
                    <option value="Excel tips">Excel tips</option>
                    <option value="Before-and-after data cleaning">Before-and-after data cleaning</option>
                    <option value="AI Automation learning">AI Automation learning</option>
                    <option value="Portfolio announcement">Portfolio announcement</option>
                    <option value="Freelance service">Freelance service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Attachment Reference</label>
                <input
                  type="text"
                  value={attachmentNote}
                  onChange={(e) => setAttachmentNote(e.target.value)}
                  placeholder="e.g. Urban_Mart_Report_View.png"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Caption Draft</label>
                <textarea
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write the initial draft..."
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
                  Save Post Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
