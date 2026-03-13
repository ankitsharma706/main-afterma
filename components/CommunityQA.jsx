import {
  ArrowLeft, Calendar, ChevronDown, Clock, Filter,
  Heart, Loader2, MessageCircle, MessageSquare, Plus,
  Search, Send, Share2, Sparkles, Star, Tag, TrendingUp,
  Users, X, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { COLORS } from '../constants';
import { questionAPI } from '../services/api';

const CATEGORIES = ['All', 'Period', 'Pregnancy', 'Postpartum', 'Health', 'Mental Wellness', 'Nutrition', 'Fitness', 'General'];
const CATEGORY_COLORS = {
  Period: { bg: '#FFF0F6', text: '#C41D7F', border: '#FFADD2' },
  Pregnancy: { bg: '#F0F5FF', text: '#1D39C4', border: '#ADC6FF' },
  Postpartum: { bg: '#FFF7E6', text: '#AD6800', border: '#FFD591' },
  Health: { bg: '#F6FFED', text: '#389E0D', border: '#B7EB8F' },
  'Mental Wellness': { bg: '#F9F0FF', text: '#722ED1', border: '#D3ADF7' },
  Nutrition: { bg: '#E6FFFB', text: '#08979C', border: '#87E8DE' },
  Fitness: { bg: '#FFF1F0', text: '#CF1322', border: '#FFA39E' },
  General: { bg: '#F0F0F0', text: '#595959', border: '#D9D9D9' },
};

const DUMMY_QUESTIONS = [
  {
    _id: "dummy1",
    author: "Sneha M.",
    category: "Postpartum",
    title: "How long does postpartum bleeding usually last?",
    description: "I am currently 4 weeks postpartum and still experiencing some light spotting. When did it completely stop for everyone else?",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    views: 342,
    upvotes: 24,
    answersCount: 2,
    tags: ["bleeding", "recovery"],
    answers: [
      { _id: "a1", user: "Dr. Meera", is_doctor_verified: true, text: "Postpartum bleeding, or lochia, typically lasts 4 to 6 weeks. It usually transitions from red to brown and then lighter yellow/white. Since you are having light spotting at 4 weeks, this is right on track and completely normal.", createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), upvotes: 15 },
      { _id: "a2", user: "Priya K.", is_doctor_verified: false, text: "Mine lasted about 5 and a half weeks. Just take it easy!", createdAt: new Date(Date.now() - 43200000).toISOString(), upvotes: 5 }
    ]
  },
  {
    _id: "dummy2",
    author: "Anita R.",
    category: "Mental Wellness",
    title: "Feeling very overwhelmed and anxious constantly",
    description: "My baby is 2 weeks old and I cry almost every day. I feel like I'm not doing a good job. Is this just baby blues?",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    views: 512,
    upvotes: 45,
    answersCount: 1,
    tags: ["anxiety", "babyblues"],
    answers: [
      { _id: "a3", user: "Dr. Anjali", is_doctor_verified: true, text: "The 'baby blues' are very common in the first two weeks due to a sudden drop in hormones. However, if these feelings persist beyond 2-3 weeks, get worse, or prevent you from caring for yourself, it might be Postpartum Depression. Please reach out to your healthcare provider or our helpline.", createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), upvotes: 28 }
    ]
  },
  {
    _id: "dummy3",
    author: "Kavya",
    category: "Nutrition",
    title: "Best foods to boost energy while breastfeeding?",
    description: "Between night feeds and pumping, my energy is totally depleted. What quick snacks do you keep around?",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    views: 120,
    upvotes: 12,
    answersCount: 3,
    tags: ["diet", "breastfeeding", "energy"],
    answers: [
      { _id: "a4", user: "Ritu", is_doctor_verified: false, text: "Oatmeal is fantastic! I also keep roasted makhana (fox nuts) and almonds by my nursing station.", createdAt: new Date(Date.now() - 10000000).toISOString(), upvotes: 8 },
      { _id: "a5", user: "Dr. Rashi", is_doctor_verified: true, text: "Great suggestions. Focus on complex carbohydrates and protein. Keep yourself hydrated, as dehydration heavily impacts energy levels.", createdAt: new Date(Date.now() - 5000000).toISOString(), upvotes: 12 },
      { _id: "a6", user: "Divya", is_doctor_verified: false, text: "Dates with a little peanut butter inside is my go-to sweet treat and gives an instant energy boost.", createdAt: new Date(Date.now() - 2000000).toISOString(), upvotes: 6 }
    ]
  },
  {
    _id: "dummy4",
    author: "Aisha",
    category: "Period",
    title: "When did your period return after delivery?",
    description: "I am exclusively breastfeeding and my baby is 5 months old. My period still hasn't returned. Just wanted to know others' timelines.",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    views: 890,
    upvotes: 34,
    answersCount: 2,
    tags: ["period", "breastfeeding"],
    answers: [
      { _id: "a7", user: "Fatima", is_doctor_verified: false, text: "With my first, it didn't come back until 9 months! I was exclusively breastfeeding too.", createdAt: new Date(Date.now() - 86400000 * 9).toISOString(), upvotes: 12 },
      { _id: "a8", user: "Dr. Meera", is_doctor_verified: true, text: "It's normal for lactational amenorrhea to last as long as you are exclusively breastfeeding. It can take anywhere from 6 months to over a year. However, note that you can still ovulate before your first period, so use contraception if you want to avoid pregnancy.", createdAt: new Date(Date.now() - 86400000 * 8).toISOString(), upvotes: 20 }
    ]
  },
  {
    _id: "dummy5",
    author: "Neha",
    category: "Fitness",
    title: "Gentle exercises for diastasis recti?",
    description: "My doctor confirmed I have a 2-finger gap. I want to start moving again but I'm scared of making it worse. Which exercises are safe?",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    views: 267,
    upvotes: 18,
    answersCount: 1,
    tags: ["fitness", "diastasis-recti"],
    answers: [
      { _id: "a9", user: "Dr. Anita (PT)", is_doctor_verified: true, text: "Avoid traditional crunches, sit-ups, or standard planks right now. Start with diaphragmatic breathing, pelvic floor contractions (Kegels), and gentle pelvic tilts. See a pelvic floor physical therapist if possible for a personalized plan.", createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), upvotes: 25 }
    ]
  }
];

const CommunityQA = ({ profile }) => {
  const theme = COLORS[profile?.accent || 'PINK'];

  // ── State ─────────────────────────────────────────────────
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAskModal, setShowAskModal] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [sortBy, setSortBy] = useState('-createdAt');

  // ── Ask Question Form State ────────────────────────────────
  const [askForm, setAskForm] = useState({ title: '', description: '', category: 'General', tags: '' });
  const [askSubmitting, setAskSubmitting] = useState(false);
  const [askError, setAskError] = useState('');

  // ── Fetch Questions ────────────────────────────────────────
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    let fetched = [];
    try {
      const params = { sort: sortBy };
      if (activeCategory !== 'All') params.category = activeCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      const res = await questionAPI.getAll(params);
      fetched = res?.data?.questions || [];
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      // Fallback to dummy data if empty
      if (fetched.length === 0) {
        fetched = DUMMY_QUESTIONS.filter(dq => {
          if (activeCategory !== 'All' && dq.category !== activeCategory) return false;
          if (searchQuery.trim() && !dq.title.toLowerCase().includes(searchQuery.trim().toLowerCase())) return false;
          return true;
        });
      }
      setQuestions(fetched);
      setLoading(false);
    }
  }, [activeCategory, searchQuery, sortBy]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  // ── Open Question Detail ────────────────────────────────────
  const openQuestion = async (q) => {
    setDetailLoading(true);
    setSelectedQuestion(q);
    try {
      const res = await questionAPI.getById(q._id);
      if (res?.data?.question) {
        setSelectedQuestion(res.data.question);
      } else {
        const dummyHit = DUMMY_QUESTIONS.find(d => d._id === q._id);
        if (dummyHit) setSelectedQuestion(dummyHit);
      }
    } catch (err) {
      console.error('Failed to load question:', err);
      const dummyHit = DUMMY_QUESTIONS.find(d => d._id === q._id);
      if (dummyHit) setSelectedQuestion(dummyHit);
    } finally {
      setDetailLoading(false);
    }
  };

  // ── Submit Answer ───────────────────────────────────────────
  const handleSubmitAnswer = async () => {
    if (!answerText.trim() || !selectedQuestion?._id) return;
    setSubmittingAnswer(true);
    try {
      const res = await questionAPI.addAnswer(selectedQuestion._id, answerText.trim());
      if (res?.data?.question) setSelectedQuestion(res.data.question);
      setAnswerText('');
    } catch (err) {
      console.error('Failed to post answer:', err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // ── Submit Question ────────────────────────────────────────
  const handleAskSubmit = async () => {
    if (!askForm.title.trim() || !askForm.description.trim()) {
      setAskError('Please fill in both title and description.');
      return;
    }
    setAskSubmitting(true);
    setAskError('');
    try {
      const tags = askForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      await questionAPI.create({ ...askForm, tags });
      setShowAskModal(false);
      setAskForm({ title: '', description: '', category: 'General', tags: '' });
      fetchQuestions();
    } catch (err) {
      setAskError(err.message || 'Something went wrong.');
    } finally {
      setAskSubmitting(false);
    }
  };

  // ── Upvote ─────────────────────────────────────────────────
  const handleUpvote = async (id, e) => {
    e?.stopPropagation();
    try {
      await questionAPI.upvote(id);
      setQuestions(prev => prev.map(q => q._id === id ? { ...q, upvotes: (q.upvotes || 0) + 1 } : q));
      if (selectedQuestion?._id === id) setSelectedQuestion(prev => ({ ...prev, upvotes: (prev.upvotes || 0) + 1 }));
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  // ── Time Formatter ─────────────────────────────────────────
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  // ── Category Badge ─────────────────────────────────────────
  const CategoryBadge = ({ category, size = 'sm' }) => {
    const c = CATEGORY_COLORS[category] || CATEGORY_COLORS.General;
    return (
      <span
        className={`inline-flex items-center font-bold uppercase tracking-widest border rounded-lg ${size === 'sm' ? 'text-[9px] px-2.5 py-1' : 'text-[10px] px-3 py-1.5'}`}
        style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
      >
        {category}
      </span>
    );
  };

  // ────────────────────────────────────────────────────────────
  // DETAIL VIEW
  // ────────────────────────────────────────────────────────────
  if (selectedQuestion) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <button onClick={() => { setSelectedQuestion(null); setAnswerText(''); }} className="flex items-center gap-2.5 text-slate-400 hover:text-slate-900 font-bold text-sm group transition-colors">
          <div className="p-1.5 bg-slate-100 rounded-xl group-hover:bg-slate-200 transition-colors"><ArrowLeft size={16} /></div>
          Back to Community
        </button>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
          {/* Question */}
          <div className="p-8 lg:p-12 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner border border-slate-100" style={{ backgroundColor: theme.bg, color: theme.primary }}>
                  {selectedQuestion.author?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{selectedQuestion.author}</p>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={10} /> {timeAgo(selectedQuestion.createdAt)}
                    <span className="text-slate-200">·</span>
                    <span>{selectedQuestion.views || 0} views</span>
                  </p>
                </div>
              </div>
              <CategoryBadge category={selectedQuestion.category} size="md" />
            </div>

            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">{selectedQuestion.title}</h2>
            <p className="text-base text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedQuestion.description}</p>

            {selectedQuestion.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedQuestion.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Tag size={10} className="inline mr-1" />{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-6 border-t border-slate-50 flex items-center gap-6">
              <button onClick={(e) => handleUpvote(selectedQuestion._id, e)} className="flex items-center gap-2 font-bold text-slate-400 hover:text-pink-500 transition-colors group">
                <Heart size={18} className="group-hover:fill-pink-100" /> {selectedQuestion.upvotes || 0}
              </button>
              <div className="flex items-center gap-2 font-bold text-slate-400">
                <MessageCircle size={18} /> {selectedQuestion.answers?.length || 0} answers
              </div>
            </div>
          </div>

          {/* Answers */}
          <div className="bg-slate-50/60 p-8 lg:p-12 space-y-6 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 flex items-center gap-3 text-lg">
              <MessageSquare size={20} className="text-slate-300" />
              {selectedQuestion.answers?.length || 0} Answers
            </h4>

            {detailLoading ? (
              <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-slate-300" /></div>
            ) : selectedQuestion.answers?.length > 0 ? (
              <div className="space-y-5">
                {selectedQuestion.answers.map((a, i) => (
                  <div key={a._id || i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-100">
                          {a.user?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            {a.user}
                            {a.is_doctor_verified && (
                              <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                <ShieldCheck size={10} /> Verified Doctor
                              </span>
                            )}
                          </p>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{timeAgo(a.createdAt)}</p>
                        </div>
                      </div>
                      <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 hover:text-pink-500 transition-colors">
                        <Heart size={12} /> {a.upvotes || 0}
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed pl-12">{a.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 space-y-3">
                <MessageSquare size={32} className="mx-auto text-slate-200" />
                <p className="text-slate-400 text-sm font-medium">No answers yet. Be the first to help!</p>
              </div>
            )}

            {/* Write Answer */}
            {profile?.authenticated && (
              <div className="pt-6 space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Answer</label>
                <div className="relative">
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Share your experience or advice..."
                    rows={4}
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-pink-50 focus:border-pink-200 shadow-sm resize-none transition-all"
                  />
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!answerText.trim() || submittingAnswer}
                    className="absolute right-3 bottom-3 p-3 bg-slate-900 text-white rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100"
                  >
                    {submittingAnswer ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────
  // LIST VIEW
  // ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="relative rounded-[2.5rem] overflow-hidden p-10 lg:p-14 border border-slate-100" style={{ background: `linear-gradient(135deg, ${theme.bg} 0%, white 60%, ${theme.bg} 100%)` }}>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-xl border border-slate-100 backdrop-blur-sm">
            <Users size={14} style={{ color: theme.primary }} />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: theme.primary }}>Sister-to-Sister Support</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Community <br />
            <span style={{ color: theme.primary }}>Q&A.</span>
          </h2>
          <p className="text-slate-400 text-sm lg:text-base font-medium max-w-lg leading-relaxed italic">
            "Ask questions, share wisdom, find strength in shared experiences."
          </p>
        </div>
        <div className="absolute right-[-5%] top-[-10%] h-[120%] w-1/2 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <MessageSquare size={400} />
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-pink-50 focus:border-pink-200 shadow-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3.5 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-pink-50 shadow-sm cursor-pointer"
            >
              <option value="-createdAt">Newest</option>
              <option value="-upvotes">Most Liked</option>
              <option value="-views">Most Viewed</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
          </div>
          <button
            onClick={() => setShowAskModal(true)}
            className="px-6 py-3.5 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all flex items-center gap-2 whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: theme.primary }}
          >
            <Plus size={16} /> Ask a Question
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat
              ? 'text-white shadow-md border-transparent'
              : 'bg-white text-slate-400 hover:text-slate-600 border-slate-100 hover:border-slate-200'}`}
            style={activeCategory === cat ? { backgroundColor: theme.primary } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-slate-300" /></div>
      ) : questions.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <div className="w-20 h-20 mx-auto bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100"><MessageSquare size={32} className="text-slate-200" /></div>
          <h3 className="text-xl font-bold text-slate-900">No questions yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">Be the first to ask! Share your concern and get support from the community.</p>
          <button onClick={() => setShowAskModal(true)} className="mt-4 px-6 py-3 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg" style={{ backgroundColor: theme.primary }}>
            <Plus size={14} className="inline mr-2" />Ask a Question
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map(q => (
            <div
              key={q._id}
              onClick={() => openQuestion(q)}
              className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer flex flex-col justify-between hover:translate-y-[-4px]"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <CategoryBadge category={q.category} />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap flex items-center gap-1">
                    <Clock size={10} /> {timeAgo(q.createdAt)}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-pink-500 transition-colors line-clamp-2">{q.title}</h4>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{q.description}</p>
                {q.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {q.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[8px] font-bold uppercase tracking-widest text-slate-300 bg-slate-50 px-2 py-1 rounded-md border border-slate-50">{tag}</span>
                    ))}
                    {q.tags.length > 3 && <span className="text-[8px] font-bold text-slate-300">+{q.tags.length - 3}</span>}
                  </div>
                )}
              </div>

              <div className="pt-5 mt-5 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold border border-slate-100 shadow-sm" style={{ backgroundColor: theme.bg, color: theme.primary }}>
                    {q.author?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{q.author}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    <Heart size={12} /> {q.upvotes || 0}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold">
                    <MessageSquare size={12} /> {q.answersCount || 0}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Ask Question Modal ─────────────────────────────────── */}
      {showAskModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowAskModal(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[2.5rem] w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-8 lg:p-10 space-y-6 animate-in zoom-in-95 fade-in duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl" style={{ backgroundColor: theme.bg, color: theme.primary }}><Sparkles size={20} /></div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Ask a Question</h3>
              </div>
              <button onClick={() => setShowAskModal(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"><X size={18} /></button>
            </div>

            {askError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-medium text-red-600">{askError}</div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Question Title *</label>
                <input
                  type="text"
                  value={askForm.title}
                  onChange={(e) => setAskForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Is it normal to have cramps after postpartum?"
                  maxLength={200}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-pink-50 focus:border-pink-200 transition-all"
                />
                <p className="text-[10px] text-slate-300 text-right">{askForm.title.length}/200</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Description *</label>
                <textarea
                  value={askForm.description}
                  onChange={(e) => setAskForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe your question in detail..."
                  rows={5}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-pink-50 focus:border-pink-200 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Category</label>
                  <div className="relative">
                    <select
                      value={askForm.category}
                      onChange={(e) => setAskForm(f => ({ ...f, category: e.target.value }))}
                      className="appearance-none w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-pink-50 cursor-pointer"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Tags (optional)</label>
                  <input
                    type="text"
                    value={askForm.tags}
                    onChange={(e) => setAskForm(f => ({ ...f, tags: e.target.value }))}
                    placeholder="e.g. sleep, newborn"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-pink-50 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleAskSubmit}
              disabled={askSubmitting || !askForm.title.trim() || !askForm.description.trim()}
              className="w-full py-4 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              style={{ backgroundColor: theme.primary }}
            >
              {askSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              {askSubmitting ? 'Posting...' : 'Post Question'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityQA;
