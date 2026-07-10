'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Building2, Users, Award, Briefcase, Shield, Clock, CheckCircle2,
  Hammer, PaintBucket, Home, LayoutGrid, ArrowRight, X, Eye, EyeOff, Menu, XIcon
} from 'lucide-react';
import ModalPortal from '@/components/ui/ModalPortal';

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/crm/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Navbar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{ background: 'rgba(250, 250, 248, 0.95)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Fore Solutions" className="h-12 md:h-16 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'About', 'Projects', 'Contact'].map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm font-medium text-gray-600 hover:text-[var(--ink)] transition-colors"
              >
                {link}
              </a>
            ))}
            <button className="btn-primary text-sm" onClick={() => setShowLogin(true)}>
              Login
            </button>
          </div>
          <button className="md:hidden text-[var(--ink)]" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden px-6 pb-4 flex flex-col gap-3">
            {['Home', 'About', 'Deals', 'Contact'].map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm text-gray-600 hover:text-[var(--ink)]"
                onClick={() => setMobileMenu(false)}
              >
                {link}
              </a>
            ))}
            <button className="btn-primary text-sm w-full" onClick={() => { setShowLogin(true); setMobileMenu(false); }}>
              Login
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero Section ── */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--paper) 0%, var(--surface) 40%, var(--paper) 100%)' }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, var(--brand-cyan) 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-20 left-20 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, var(--brand-cyan) 0%, transparent 70%)' }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(0,169,224,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,169,224,0.3) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl animate-fade-in">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
            style={{
              background: 'rgba(0,169,224,0.1)',
              border: '1px solid rgba(0,169,224,0.3)',
              color: 'var(--brand-cyan)',
            }}
          >
            <Award className="w-4 h-4" />
            Premium Construction & Real Estate
          </div>
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{ color: 'var(--ink)' }}
          >
            Building Dreams,
            <br />
            <span style={{ color: 'var(--brand-cyan)' }}>Delivering Excellence</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Fore Solutions transforms visions into remarkable spaces. With over 15 years of expertise,
            we deliver unparalleled quality in residential and commercial construction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#deals" className="btn-primary text-base px-8 py-3.5">
              View Our Deals
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-base font-semibold transition-all duration-300 border-2"
              style={{ borderColor: 'rgba(0,169,224,0.4)', color: 'var(--brand-cyan)' }}
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs text-gray-400 tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-gray-400 to-transparent" />
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section
        className="relative py-16"
        style={{ background: 'linear-gradient(135deg, var(--brand-cyan) 0%, var(--brand-cyan) 50%, var(--brand-cyan) 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '200+', label: 'Deals Completed', icon: Building2 },
            { value: '15+', label: 'Years Experience', icon: Clock },
            { value: '500+', label: 'Happy Clients', icon: Users },
            { value: '50+', label: 'Expert Team', icon: Briefcase },
          ].map((stat, i) => (
            <div key={i} className="text-center" style={{ animation: `countUp 0.6s ease-out ${i * 0.15}s both` }}>
              <stat.icon className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--ink)' }} />
              <div className="text-4xl md:text-5xl font-bold mb-1" style={{ color: 'var(--ink)' }}>
                {stat.value}
              </div>
              <div className="text-sm font-medium" style={{ color: 'rgba(15,28,46,0.7)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services Section ── */}
      <section id="about" className="py-24" style={{ background: 'var(--paper)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--brand-cyan)' }}>
              What We Do
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold mt-3 mb-5"
              style={{ color: 'var(--ink)' }}
            >
              Our Services
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              From concept to completion, we offer comprehensive construction and interior solutions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Home,
                title: 'Residential Construction',
                desc: 'Custom homes, villas, and apartments built with precision and care.',
              },
              {
                icon: Building2,
                title: 'Commercial Deals',
                desc: 'Office spaces, retail complexes, and commercial structures.',
              },
              {
                icon: Hammer,
                title: 'Renovations',
                desc: 'Transform existing spaces with modern upgrades and structural enhancements.',
              },
              {
                icon: PaintBucket,
                title: 'Interior Design',
                desc: 'Elegant interiors that blend functionality with aesthetic beauty.',
              },
            ].map((service, i) => (
              <div
                key={i}
                className="bg-surface rounded-xl p-8 transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
                style={{
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  animation: `slideUp 0.6s ease-out ${i * 0.1}s both`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, var(--ink), var(--surface))' }}
                >
                  <service.icon className="w-7 h-7" style={{ color: 'var(--brand-cyan)' }} />
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--ink)' }}>
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section id="deals" className="py-24" style={{ background: 'var(--ink)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--brand-cyan)' }}>
              Our Promise
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold mt-3"
              style={{ color: 'var(--surface)' }}
            >
              Why Choose Us
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Quality Assurance',
                desc: 'We use premium materials and follow strict quality standards to ensure every project meets the highest benchmarks.',
              },
              {
                icon: Clock,
                title: 'On-Time Delivery',
                desc: 'Our project management expertise ensures timely completion without compromising on quality or safety.',
              },
              {
                icon: CheckCircle2,
                title: 'Transparent Process',
                desc: 'Complete visibility into project progress, costs, and milestones through our advanced CRM system.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-card p-8 text-center transition-all duration-300 hover:-translate-y-2"
                style={{ animation: `slideUp 0.6s ease-out ${i * 0.15}s both` }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'rgba(0,169,224,0.15)' }}
                >
                  <feature.icon className="w-8 h-8" style={{ color: 'var(--brand-cyan)' }} />
                </div>
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: 'var(--surface)' }}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="py-12" style={{ background: 'var(--surface)', borderTop: '1px solid rgba(0,169,224,0.15)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Fore Solutions" className="h-12 w-auto" />
              <div>
                <p className="text-xs text-gray-500">Building Dreams, Delivering Excellence</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              © 2026 Fore Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ── Login Modal ── */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

// ── Login Modal Component ──
function LoginModal({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const ok = login(username, password);
      if (ok) {
        router.push('/crm/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <ModalPortal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>
                CRM Login
              </h2>
              <p className="text-sm text-gray-500 mt-1">Fore Solutions</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
                Username
              </label>
              <input
                type="text"
                className="crm-input"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="crm-input pr-10"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                <X className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-3 text-base"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Logging in…
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
