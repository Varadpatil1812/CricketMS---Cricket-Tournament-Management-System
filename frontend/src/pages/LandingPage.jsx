import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CricketNews from '../components/CricketNews';
import './LandingPage.css';
import omkarMImg from '../assets/omkarM.jpg';
import omkarPImg from '../assets/omkarP.jpg';
import varadImg from '../assets/varad.jpg';
import logo from '../assets/vite.png';

const owners = [
  {
    name: 'Omkar Masudage',
    role: 'UI/UX Designer & Frontend Developer',
    initials: 'OM',
    image: omkarMImg,
    bio: 'Crafted every screen and interaction. Turns complex cricket data into beautiful, intuitive interfaces.',
    color: 'green',
  },
  {
    name: 'Omkar Pimpaldohkar',
    role: 'Frontend Developer',
    initials: 'OP',
    image: omkarPImg,
    bio: 'Crafted every screen and interaction, and handled API integration to bring live cricket data seamlessly into the UI.',
    color: 'purple',
  },
  {
    name: 'Varad Patil',
    role: 'Full-Stack Developer',
    initials: 'VP',
    image: varadImg,
    bio: 'Developed the core backend APIs, database architecture, and key frontend features. Passionate about building scalable web applications and delivering seamless user experiences.',
    color: 'amber',
  },
];

const features = [
  { emoji: '🏆', title: 'Tournament Management', desc: 'Create and manage full cricket tournaments with scheduling, brackets and results tracking.' },
  { emoji: '👥', title: 'Team & Player Roster', desc: 'Maintain rich player profiles with batting averages, bowling stats and career history.' },
  { emoji: '📊', title: 'Match Tracking', desc: 'Scoring with scorecard updates and detailed innings breakdowns.' },
  { emoji: '📈', title: 'Analytics & Reports', desc: 'Deep statistical insights, performance charts and exportable match reports for every game.' },
  { emoji: '🔐', title: 'Role-Based Access', desc: 'Admin, scorer and viewer roles with JWT authentication to keep your data secure.' },
  { emoji: '🥇', title: 'Leaderboard', desc: 'Dynamic team and player leaderboards that update automatically after every match.' },
];

const stats = [
  ['80+', 'Teams'],
  ['320+', 'Matches'],
  ['1,200+', 'Players'],
  ['80+', 'Tournaments'],
];

export default function LandingPage() {
  const { user, ready } = useAuth();
  const nav = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => { setLoaded(true); }, []);

  // If already logged in redirect to their dashboard
  useEffect(() => {
    if (!ready) return;
    if (user?.role === 'admin') nav('/admin/teams', { replace: true });
    if (user?.role === 'player') nav('/dashboard', { replace: true });
  }, [user, ready]);

  // Close drawer on outside click
  useEffect(() => {
    if (!newsOpen) return;
    function handleClick(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setNewsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [newsOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') setNewsOpen(false); }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className={`lp-page${loaded ? ' lp-loaded' : ''}`}>

      {/* ── NAV ── */}
      <nav className="lp-nav">
        <a href="/" className="lp-logo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={logo} alt="CricketMS" style={{ height: 40, width: 40, objectFit: "contain", borderRadius: "50%" }} />
          CricketMS
        </a>
        <div className="lp-nav-links">
          <button
            className={`lp-btn-news${newsOpen ? ' lp-btn-news--active' : ''}`}
            onClick={() => setNewsOpen(o => !o)}
            aria-expanded={newsOpen}
            aria-label="Toggle cricket news"
          >
            📰 News
          </button>
          {user ? (
            <>
              <span style={{
                fontSize: 13, color: '#94a3b8', fontWeight: 500,
              }}>
                👋 {user.name}
              </span>
              <button
                className="lp-btn-green"
                onClick={() => nav(user.role === 'admin' ? '/admin/teams' : '/dashboard')}
              >
                Go to Dashboard →
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="lp-btn-outline">Login</Link>
              <Link to="/register" className="lp-btn-green">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* ── NEWS DRAWER ── */}
      {newsOpen && (
        <div className="lp-news-overlay" aria-modal="true" role="dialog">
          <div className="lp-news-drawer" ref={drawerRef}>
            <div className="lp-news-drawer-header">
              <span className="lp-news-drawer-title">📰 Latest Cricket News</span>
              <button
                className="lp-news-drawer-close"
                onClick={() => setNewsOpen(false)}
                aria-label="Close news"
              >✕</button>
            </div>
            <div className="lp-news-drawer-body">
              <CricketNews />
            </div>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <header className="lp-hero">
        <h1 className="lp-h1">
          Manage Cricket<br />
          <span className="lp-accent">Like a Pro</span>
        </h1>
        <p className="lp-sub">
          CricketMS is the all-in-one platform for tournament organisers, team managers and scorers.
          From team rosters to scorecards — everything in one dashboard.
        </p>
        <div className="lp-hero-actions">
          <Link to="/register" className="lp-btn-green lp-btn-lg">Get Start →</Link>
          <a href="#features" className="lp-btn-outline lp-btn-lg">Explore Features</a>
        </div>
        <Link
          to="/viewer"
          className="lp-stats-row"
          title="Browse as Viewer"
          style={{ textDecoration: 'none', cursor: 'pointer', position: 'relative' }}
        >
          {stats.map(([num, label]) => (
            <div key={label} className="lp-stat lp-stat--hover">
              <span className="lp-stat-num">{num}</span>
              <span className="lp-stat-label">{label}</span>
            </div>
          ))}
          <div className="lp-stats-hint">👀 Click to browse as Viewer →</div>
        </Link>
      </header>

      {/* ── FEATURES ── */}
      <section id="features" className="lp-section">
        <div className="lp-section-head">
          <span className="lp-eyebrow">What's inside</span>
          <h2 className="lp-h2">Powerful <span className="lp-accent">Features</span></h2>
          <p className="lp-muted">Everything a cricket organisation needs, built into one cohesive platform.</p>
        </div>
        <div className="lp-grid-3">
          {features.map((f) => (
            <div key={f.title} className="lp-card">
              <div className="lp-card-emoji">{f.emoji}</div>
              <div className="lp-card-title">{f.title}</div>
              <div className="lp-card-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT / TEAM ── */}
      <section id="about" className="lp-section">
        <div className="lp-section-head">
          <span className="lp-eyebrow">The team</span>
          <h2 className="lp-h2">Meet the <span className="lp-accent">Builders</span></h2>
          <p className="lp-muted">Three developers who love cricket and great software.</p>
        </div>
        <div className="lp-grid-3">
          {owners.map((o) => (
            <div key={o.name} className={`lp-owner-card lp-owner-card--${o.color}`}>
              <div className={`lp-avatar lp-avatar--${o.color}`}>{
                <img src={o.image} alt={o.name} className="lp-avatar-img" />}
              </div>
              <div className="lp-owner-name">{o.name}</div>
              <div className={`lp-owner-role lp-owner-role--${o.color}`}>{o.role}</div>
              <div className="lp-owner-bio">{o.bio}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="lp-cta">
        <h2 className="lp-h2">Ready to manage your tournament?</h2>
        <p className="lp-muted">Join hundreds of cricket clubs already using CricketMS. Free to start.</p>
        <div className="lp-hero-actions">
          <Link to="/register" className="lp-btn-green lp-btn-lg">Create Free Account</Link>
          <Link to="/login" className="lp-btn-outline lp-btn-lg">Sign In</Link>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        🏏 CricketMS · Built with ❤️ by Omkar, Omkar &amp; Varad · {new Date().getFullYear()}
      </footer>

    </div>
  );
}