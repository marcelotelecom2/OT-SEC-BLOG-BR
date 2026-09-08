import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { motion, AnimatePresence } from 'motion/react';
import { DecodeText } from '../components/ui/DecodeText';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
  BarChart3, FileText, FlaskConical, FolderGit2, Image as ImageIcon,
  Plus, Trash2, Edit3, Lock, Unlock, Eye, Upload, Copy, Check,
  ExternalLink, Search, RefreshCw, ShieldCheck, Activity, Globe,
  ArrowUpRight, Users, Clock, Zap, KeyRound, ShieldAlert
} from 'lucide-react';
import { Article, ResearchNote, Project } from '../types';
import { 
  RESEARCH_TAGS, 
  RESEARCH_AUTHORS, 
  getTagBadgeStyle, 
  getAuthorBadgeStyle 
} from '../constants/researchClassification';

export function Admin() {
  const {
    articles, notes, projects, mediaLibrary, analytics,
    isAdminLoggedIn, loginAdmin, logoutAdmin, changePassword,
    addArticle, updateArticle, deleteArticle,
    addNote, updateNote, deleteNote,
    addProject, updateProject, deleteProject,
    uploadImage, deleteMedia
  } = useBlog();

  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<'kpis' | 'articles' | 'notes' | 'projects' | 'media'>('kpis');

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals / Form States
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [showArticleForm, setShowArticleForm] = useState(false);

  const [editingNote, setEditingNote] = useState<Partial<ResearchNote> | null>(null);
  const [showNoteForm, setShowNoteForm] = useState(false);

  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Change Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'error' | 'success' | null; message: string }>({ type: null, message: '' });

  // Drag & drop upload state
  const [isDragging, setIsDragging] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      setAuthError(false);
      setPassword('');
    } else {
      setAuthError(true);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      await uploadImage(files[0]);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadImage(e.dataTransfer.files[0]);
    }
  };

  // Preset cyber image samples for instant upload testing
  const addPresetImage = async (presetUrl: string, name: string) => {
    await uploadImage({
      name,
      url: presetUrl,
      size: '1.4 MB',
      type: 'image/png'
    });
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <SpotlightCard className="p-8 hud-border relative overflow-hidden bg-[#090a0f]/90">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 border-b border-gray-800/80 pb-4">
              <div className="p-2 bg-cyan-950/40 border border-cyan-800/50 rounded text-cyan-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide font-sans">SYS_ADMIN ACCESS</h2>
                <p className="text-xs font-mono text-cyan-500/70">OT-SEC LAB SECURITY ZONE L4</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
                  Access Key / Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode (e.g. sec2026)"
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 text-cyan-300 font-mono text-sm focus:outline-none focus:border-cyan-500 rounded transition-colors"
                />
                {authError && (
                  <p className="text-xs font-mono text-rose-500 mt-2 flex items-center gap-1">
                    [!] ACCESS DENIED: Invalid passcode credential. Try &apos;sec2026&apos;.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-sm tracking-wider uppercase rounded transition-all duration-200 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" /> Authenticate System
              </button>

              <div className="pt-4 border-t border-gray-800/60 text-center">
                <button
                  type="button"
                  onClick={() => loginAdmin('sec2026')}
                  className="text-xs font-mono text-gray-500 hover:text-cyan-400 transition-colors underline decoration-dashed"
                >
                  [ Quick Bypass: One-Click Demo Unlock ]
                </button>
              </div>
            </form>
          </SpotlightCard>
        </motion.div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="flex w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-sans">
              <DecodeText text="ADMINISTRATOR PANEL" delay={100} />
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400">
              v2.6
            </span>
          </div>
          <p className="text-xs font-mono text-gray-400">
            Node: <span className="text-gray-200">OT-SEC-CORE-01</span> | Session: <span className="text-cyan-400">SYS_ADMIN_01</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCurrentPasswordInput('');
              setNewPasswordInput('');
              setConfirmPasswordInput('');
              setPasswordStatus({ type: null, message: '' });
              setShowPasswordModal(true);
            }}
            className="px-3 py-1.5 text-xs font-mono text-cyan-400 border border-cyan-800/60 bg-cyan-950/30 hover:bg-cyan-900/40 rounded transition-colors flex items-center gap-1.5"
            title="Update administrator passcode"
          >
            <KeyRound className="w-3.5 h-3.5" /> Change Password
          </button>
          <button
            onClick={logoutAdmin}
            className="px-3 py-1.5 text-xs font-mono text-rose-400 border border-rose-900/60 bg-rose-950/20 hover:bg-rose-900/40 rounded transition-colors flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-800 pb-4 mb-8 overflow-x-auto scrollbar-none">
        {[
          { id: 'kpis', label: 'KPIs & Analytics', icon: BarChart3, count: null },
          { id: 'articles', label: 'Articles', icon: FileText, count: articles.length },
          { id: 'notes', label: 'Research Notes', icon: FlaskConical, count: notes.length },
          { id: 'projects', label: 'Projects', icon: FolderGit2, count: projects.length },
          { id: 'media', label: 'Image Library', icon: ImageIcon, count: mediaLibrary.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider rounded transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)] font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== null && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-gray-800 text-gray-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* ========================================================= */}
      {/* 1. KPIS & ANALYTICS TAB */}
      {/* ========================================================= */}
      {activeTab === 'kpis' && (
        <div className="space-y-8">
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SpotlightCard className="p-5 border border-gray-800/80 bg-gray-900/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Total Visitors</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{analytics.totalVisitors.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% vs last week
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-5 border border-gray-800/80 bg-gray-900/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Page Views</span>
                <Eye className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{analytics.pageViews.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" /> +22.8% vs last week
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-5 border border-gray-800/80 bg-gray-900/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Avg Session Time</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{analytics.avgTimeOnSite}</div>
              <div className="text-xs text-cyan-400/80 font-mono mt-2">
                High engagement in technical articles
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-5 border border-gray-800/80 bg-gray-900/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Bounce Rate</span>
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{analytics.bounceRate}</div>
              <div className="text-xs text-emerald-400 font-mono mt-2">
                -3.1% (Optimal retention)
              </div>
            </SpotlightCard>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Hourly Traffic Chart */}
            <SpotlightCard className="lg:col-span-2 p-6 border border-gray-800/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Hourly Traffic Pattern (Views vs Visitors)
                  </h3>
                  <p className="text-xs font-mono text-gray-500">Live network activity across lab endpoints</p>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-400">
                  REALTIME
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.hourlyTraffic}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" stroke="#6b7280" fontSize={11} fontFamily="monospace" />
                    <YAxis stroke="#6b7280" fontSize={11} fontFamily="monospace" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#090a0f', borderColor: '#1f2937', color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}
                    />
                    <Area type="monotone" dataKey="views" name="Page Views" stroke="#06b6d4" fillOpacity={1} fill="url(#colorViews)" />
                    <Area type="monotone" dataKey="visitors" name="Unique Visitors" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVisitors)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SpotlightCard>

            {/* Traffic Sources Pie Chart */}
            <SpotlightCard className="p-6 border border-gray-800/80 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-sans flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Traffic Acquisition
                </h3>
                <p className="text-xs font-mono text-gray-500 mb-4">Origin of lab visitors</p>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.trafficSources}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analytics.trafficSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#090a0f', borderColor: '#1f2937', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-gray-800/80">
                {analytics.trafficSources.map((source) => (
                  <div key={source.name} className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                      <span className="text-gray-300">{source.name}</span>
                    </div>
                    <span className="text-gray-400 font-bold">{source.value}%</span>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </div>

          {/* Top Viewed Pages & Recent Traffic Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Content Breakdown */}
            <SpotlightCard className="p-6 border border-gray-800/80">
              <h3 className="text-base font-bold text-white font-sans mb-4">Top Viewed Routes</h3>
              <div className="space-y-3">
                {Object.entries(analytics.pageViewCounts).map(([route, count]) => (
                  <div key={route} className="flex items-center justify-between p-3 bg-gray-950/60 border border-gray-800/50 rounded font-mono text-xs">
                    <span className="text-cyan-400">{route}</span>
                    <span className="text-gray-300 font-bold">{count.toLocaleString()} views</span>
                  </div>
                ))}
              </div>
            </SpotlightCard>

            {/* Realtime Event Stream */}
            <SpotlightCard className="p-6 border border-gray-800/80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Live Network Telemetry
                </h3>
                <span className="text-xs font-mono text-gray-500">Auto-refreshing</span>
              </div>
              <div className="space-y-2.5">
                {analytics.recentEvents.map((ev) => (
                  <div key={ev.id} className="p-2.5 bg-gray-950/80 border border-gray-800/60 rounded font-mono text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-gray-500 text-[10px] shrink-0">{ev.time}</span>
                      <span className="text-gray-200 truncate">{ev.event}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-cyan-400/80 text-[10px] block">{ev.ip}</span>
                      <span className="text-gray-500 text-[9px] block">{ev.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ARTICLES (POSTS) MANAGEMENT TAB */}
      {/* ========================================================= */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-950/60 p-4 border border-gray-800 rounded">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search articles by title, area, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 text-xs font-mono text-gray-200 focus:outline-none focus:border-cyan-500 rounded"
              />
            </div>
            <button
              onClick={() => {
                setEditingArticle({
                  title: '',
                  summary: '',
                  content: '',
                  area: 'ICS Security',
                  readTime: '10 min read',
                  date: new Date().toISOString().split('T')[0],
                  published: true
                });
                setShowArticleForm(true);
              }}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase rounded transition-colors flex items-center gap-2 justify-center"
            >
              <Plus className="w-4 h-4" /> New Article Post
            </button>
          </div>

          {/* Article List Table */}
          <div className="border border-gray-800/80 rounded overflow-hidden bg-gray-950/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/60 text-xs font-mono text-gray-400 uppercase">
                    <th className="p-4">Title</th>
                    <th className="p-4">Area</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Read Time</th>
                    <th className="p-4">Views</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-xs font-mono text-gray-300">
                  {articles
                    .filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.area.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((article) => (
                      <tr key={article.id} className="hover:bg-gray-900/40 transition-colors">
                        <td className="p-4 font-sans font-semibold text-white max-w-xs truncate">
                          {article.title}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 text-cyan-400 text-[10px]">
                            {article.area}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400">{article.date}</td>
                        <td className="p-4 text-gray-400">{article.readTime}</td>
                        <td className="p-4 text-cyan-300">{article.views || 0}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            article.published ? 'bg-emerald-950 border border-emerald-800 text-emerald-400' : 'bg-amber-950 border border-amber-800 text-amber-400'
                          }`}>
                            {article.published ? 'PUBLISHED' : 'DRAFT'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingArticle(article);
                                setShowArticleForm(true);
                              }}
                              className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-cyan-400 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteArticle(article.id)}
                              className="p-1.5 hover:bg-rose-950 text-gray-400 hover:text-rose-400 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Article Form Modal */}
          {showArticleForm && editingArticle && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
                <SpotlightCard className="p-6 hud-border bg-[#090a0f] border-gray-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <h3 className="text-lg font-bold text-white font-sans">
                      {editingArticle.id ? 'Edit Article' : 'Create New Article'}
                    </h3>
                    <button onClick={() => setShowArticleForm(false)} className="text-gray-500 hover:text-white">✕</button>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    <div>
                      <label className="block text-gray-400 mb-1">Article Title</label>
                      <input
                        type="text"
                        value={editingArticle.title || ''}
                        onChange={e => setEditingArticle(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded"
                        placeholder="e.g. Exploiting Modbus TCP Register Overflows"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-gray-400 mb-1">Research Area</label>
                        <select
                          value={editingArticle.area || 'ICS Security'}
                          onChange={e => setEditingArticle(prev => ({ ...prev, area: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-cyan-300 focus:border-cyan-500 rounded"
                        >
                          <option value="ICS Security">ICS Security</option>
                          <option value="Artificial Intelligence">Artificial Intelligence</option>
                          <option value="Network Engineering">Network Engineering</option>
                          <option value="Vulnerability Analysis">Vulnerability Analysis</option>
                          <option value="Threat Intelligence">Threat Intelligence</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1">Estimated Read Time</label>
                        <input
                          type="text"
                          value={editingArticle.readTime || '10 min read'}
                          onChange={e => setEditingArticle(prev => ({ ...prev, readTime: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1">Publication Date</label>
                        <input
                          type="date"
                          value={editingArticle.date || new Date().toISOString().split('T')[0]}
                          onChange={e => setEditingArticle(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1">Summary / Abstract</label>
                      <textarea
                        rows={2}
                        value={editingArticle.summary || ''}
                        onChange={e => setEditingArticle(prev => ({ ...prev, summary: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded"
                        placeholder="Brief 2-3 sentence overview..."
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1">Full Content (Markdown supported)</label>
                      <textarea
                        rows={6}
                        value={editingArticle.content || ''}
                        onChange={e => setEditingArticle(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded"
                        placeholder="## Section Heading&#10;Write technical breakdown here..."
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="published_check"
                        checked={editingArticle.published ?? true}
                        onChange={e => setEditingArticle(prev => ({ ...prev, published: e.target.checked }))}
                        className="accent-cyan-500 w-4 h-4"
                      />
                      <label htmlFor="published_check" className="text-gray-300">Publish immediately to live blog</label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => setShowArticleForm(false)}
                      className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white rounded text-xs font-mono"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editingArticle.title || !editingArticle.summary) return;
                        if (editingArticle.id) {
                          updateArticle(editingArticle.id, editingArticle);
                        } else {
                          addArticle(editingArticle as any);
                        }
                        setShowArticleForm(false);
                      }}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase rounded"
                    >
                      Save Article
                    </button>
                  </div>
                </SpotlightCard>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. RESEARCH NOTES MANAGEMENT TAB */}
      {/* ========================================================= */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-gray-950/60 p-4 border border-gray-800 rounded">
            <p className="text-xs font-mono text-gray-400">Quick vulnerability logs and observation notes</p>
            <button
              onClick={() => {
                setEditingNote({
                  date: new Date().toISOString().split('T')[0],
                  tag: '#VULN_ANALYSIS',
                  content: '',
                  author: 'SYS_ADMIN_01'
                });
                setShowNoteForm(true);
              }}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase rounded transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Research Note
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((note) => (
              <SpotlightCard key={note.id} className="p-5 border border-gray-800/80 bg-gray-950/40 relative group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-gray-500">{note.date}</span>
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getTagBadgeStyle(note.tag)}`}>
                      {note.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingNote(note);
                        setShowNoteForm(true);
                      }}
                      className="p-1 text-gray-500 hover:text-cyan-400"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 text-gray-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-300 font-sans leading-relaxed">{note.content}</p>
                {note.author && (
                  <div className="mt-4 pt-2 border-t border-gray-800/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-500">Operator:</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getAuthorBadgeStyle(note.author)}`}>
                      #{note.author.replace(/^#/, '')}
                    </span>
                  </div>
                )}
              </SpotlightCard>
            ))}
          </div>

          {/* Note Form Modal */}
          {showNoteForm && editingNote && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
                <SpotlightCard className="p-6 hud-border bg-[#090a0f] border-gray-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <h3 className="text-base font-bold text-white font-sans">
                      {editingNote.id ? 'Edit Research Note' : 'Add Research Note'}
                    </h3>
                    <button onClick={() => setShowNoteForm(false)} className="text-gray-500 hover:text-white">✕</button>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-400 mb-1">Classification Tag (Red Theme)</label>
                        <select
                          value={editingNote.tag || '#VULN_ANALYSIS'}
                          onChange={e => setEditingNote(prev => ({ ...prev, tag: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-rose-400 font-bold focus:border-cyan-500 rounded"
                        >
                          {RESEARCH_TAGS.map(t => (
                            <option key={t.value} value={t.value}>
                              {t.value} ({t.label})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1">Operator / Author (Blue/Cyan Theme)</label>
                        <select
                          value={editingNote.author || 'SYS_ADMIN_01'}
                          onChange={e => setEditingNote(prev => ({ ...prev, author: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-cyan-400 font-bold focus:border-cyan-500 rounded"
                        >
                          {RESEARCH_AUTHORS.map(a => (
                            <option key={a.value} value={a.value}>
                              #{a.value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1">Publication Date</label>
                      <input
                        type="date"
                        value={editingNote.date || new Date().toISOString().split('T')[0]}
                        onChange={e => setEditingNote(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1">Note Observation Text</label>
                      <textarea
                        rows={4}
                        value={editingNote.content || ''}
                        onChange={e => setEditingNote(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded"
                        placeholder="Log research finding, artifact analysis, or vulnerability detail..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => setShowNoteForm(false)}
                      className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white rounded text-xs font-mono"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editingNote.content) return;
                        if (editingNote.id) {
                          updateNote(editingNote.id, editingNote);
                        } else {
                          addNote(editingNote as any);
                        }
                        setShowNoteForm(false);
                      }}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase rounded"
                    >
                      Save Note
                    </button>
                  </div>
                </SpotlightCard>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. PROJECTS MANAGEMENT TAB */}
      {/* ========================================================= */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-gray-950/60 p-4 border border-gray-800 rounded">
            <p className="text-xs font-mono text-gray-400">Open-source tools, platforms, and research initiatives</p>
            <button
              onClick={() => {
                setEditingProject({
                  title: '',
                  description: '',
                  status: 'ACTIVE RESEARCH',
                  tags: ['AI/ML'],
                  githubUrl: 'https://github.com/ot-sec/',
                  demoUrl: ''
                });
                setShowProjectForm(true);
              }}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase rounded transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <SpotlightCard key={project.id} className="p-6 border border-gray-800/80 bg-gray-950/40 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-cyan-800/60 text-cyan-400 bg-cyan-950/30">
                      {project.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProject(project);
                          setShowProjectForm(true);
                        }}
                        className="p-1 text-gray-500 hover:text-cyan-400"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-1 text-gray-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">{project.description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-gray-800/60">
                  {project.tags.map(t => (
                    <span key={t} className="text-[10px] font-mono px-2 py-0.5 bg-gray-900 border border-gray-800 text-gray-400 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            ))}
          </div>

          {/* Project Form Modal */}
          {showProjectForm && editingProject && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
                <SpotlightCard className="p-6 hud-border bg-[#090a0f] border-gray-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <h3 className="text-base font-bold text-white font-sans">
                      {editingProject.id ? 'Edit Project' : 'Add Project'}
                    </h3>
                    <button onClick={() => setShowProjectForm(false)} className="text-gray-500 hover:text-white">✕</button>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    <div>
                      <label className="block text-gray-400 mb-1">Project Name</label>
                      <input
                        type="text"
                        value={editingProject.title || ''}
                        onChange={e => setEditingProject(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded"
                        placeholder="e.g. S7-Comm Protocol Fuzzer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-400 mb-1">Status</label>
                        <select
                          value={editingProject.status || 'ACTIVE RESEARCH'}
                          onChange={e => setEditingProject(prev => ({ ...prev, status: e.target.value as any }))}
                          className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-cyan-300 focus:border-cyan-500 rounded"
                        >
                          <option value="ACTIVE RESEARCH">ACTIVE RESEARCH</option>
                          <option value="RELEASED">RELEASED</option>
                          <option value="BETA">BETA</option>
                          <option value="CONCEPT">CONCEPT</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1">Tags (Comma separated)</label>
                        <input
                          type="text"
                          value={editingProject.tags ? editingProject.tags.join(', ') : ''}
                          onChange={e => setEditingProject(prev => ({ ...prev, tags: e.target.value.split(',').map(s => s.trim()) }))}
                          className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded"
                          placeholder="Fuzzing, Siemens, PLC"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-400 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={editingProject.description || ''}
                        onChange={e => setEditingProject(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded"
                        placeholder="Detailed project summary..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-400 mb-1">GitHub Repository URL</label>
                        <input
                          type="text"
                          value={editingProject.githubUrl || ''}
                          onChange={e => setEditingProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded"
                          placeholder="https://github.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-1">Live Demo / Docs URL</label>
                        <input
                          type="text"
                          value={editingProject.demoUrl || ''}
                          onChange={e => setEditingProject(prev => ({ ...prev, demoUrl: e.target.value }))}
                          className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-gray-200 focus:border-cyan-500 rounded"
                          placeholder="https://demo..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => setShowProjectForm(false)}
                      className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white rounded text-xs font-mono"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editingProject.title || !editingProject.description) return;
                        if (editingProject.id) {
                          updateProject(editingProject.id, editingProject);
                        } else {
                          addProject(editingProject as any);
                        }
                        setShowProjectForm(false);
                      }}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase rounded"
                    >
                      Save Project
                    </button>
                  </div>
                </SpotlightCard>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MEDIA & IMAGE UPLOAD TAB */}
      {/* ========================================================= */}
      {activeTab === 'media' && (
        <div className="space-y-8">
          {/* File Drag and Drop Box */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              isDragging
                ? 'border-cyan-400 bg-cyan-950/20'
                : 'border-gray-800 hover:border-gray-700 bg-gray-950/40'
            }`}
          >
            <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-3 animate-bounce" />
            <h3 className="text-base font-bold text-white font-sans mb-1">Drag & Drop Image Files Here</h3>
            <p className="text-xs font-mono text-gray-400 mb-4">Supports PNG, JPG, GIF, WebP (Converted to Base64 asset store)</p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <label className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase rounded cursor-pointer transition-colors inline-flex items-center gap-2">
                <Upload className="w-4 h-4" /> Browse Local Computer
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                type="button"
                onClick={() => addPresetImage('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80', 'cyber_matrix_node.png')}
                className="px-3 py-2 bg-gray-900 border border-gray-800 text-gray-300 hover:text-white hover:border-gray-700 text-xs font-mono rounded"
              >
                + Add Preset Cyber Spec Image
              </button>
            </div>
          </div>

          {/* Media Asset Gallery */}
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Uploaded Assets Gallery ({mediaLibrary.length})</span>
              <span className="text-xs text-gray-500 font-normal">Click &quot;Copy Link&quot; to insert into posts</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mediaLibrary.map((item) => (
                <SpotlightCard key={item.id} className="p-3 border border-gray-800/80 bg-gray-950/40 flex flex-col justify-between group">
                  <div>
                    <div className="h-36 w-full rounded overflow-hidden bg-gray-900 relative mb-3 border border-gray-800">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1.5 py-0.5 bg-black/80 text-cyan-400 rounded border border-gray-800">
                        {item.dimensions || '1080p'}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-gray-200 truncate mb-1" title={item.name}>
                      {item.name}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 mb-3">
                      <span>{item.size}</span>
                      <span>{item.uploadDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-800/60">
                    <button
                      onClick={() => handleCopy(item.url, item.id)}
                      className="flex-1 py-1 px-2 bg-gray-900 hover:bg-cyan-950/50 border border-gray-800 hover:border-cyan-800 text-gray-300 hover:text-cyan-300 font-mono text-[10px] rounded transition-colors flex items-center justify-center gap-1"
                    >
                      {copiedId === item.id ? (
                        <><Check className="w-3 h-3 text-emerald-400" /> Copied!</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copy Link</>
                      )}
                    </button>
                    <button
                      onClick={() => deleteMedia(item.id)}
                      className="p-1 text-gray-500 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CHANGE PASSWORD MODAL */}
      {/* ========================================================= */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
            <SpotlightCard className="p-6 hud-border bg-[#090a0f] border-gray-800 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-cyan-950/60 border border-cyan-800/60 rounded text-cyan-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white font-sans">
                    Change Admin Passcode
                  </h3>
                </div>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs font-mono text-gray-400">
                Update your security credential for logging into the SYS_ADMIN panel.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newPasswordInput !== confirmPasswordInput) {
                    setPasswordStatus({ type: 'error', message: 'New passwords do not match.' });
                    return;
                  }
                  const res = changePassword(currentPasswordInput, newPasswordInput);
                  if (res.success) {
                    setPasswordStatus({ type: 'success', message: res.message });
                    setTimeout(() => {
                      setShowPasswordModal(false);
                    }, 1500);
                  } else {
                    setPasswordStatus({ type: 'error', message: res.message });
                  }
                }}
                className="space-y-3 font-mono text-xs"
              >
                <div>
                  <label className="block text-gray-400 mb-1">Current Passcode</label>
                  <input
                    type="password"
                    required
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    placeholder="Enter current password (e.g. sec2026)"
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-cyan-300 focus:border-cyan-500 rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">New Passcode</label>
                  <input
                    type="password"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new password (min. 4 characters)"
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-cyan-300 focus:border-cyan-500 rounded"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Confirm New Passcode</label>
                  <input
                    type="password"
                    required
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 text-cyan-300 focus:border-cyan-500 rounded"
                  />
                </div>

                {passwordStatus.type === 'error' && (
                  <div className="p-2.5 bg-rose-950/40 border border-rose-800/80 rounded text-rose-400 text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>{passwordStatus.message}</span>
                  </div>
                )}

                {passwordStatus.type === 'success' && (
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/80 rounded text-emerald-400 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>{passwordStatus.message}</span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white rounded text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase rounded"
                  >
                    Save New Passcode
                  </button>
                </div>
              </form>
            </SpotlightCard>
          </motion.div>
        </div>
      )}
    </div>
  );
}
