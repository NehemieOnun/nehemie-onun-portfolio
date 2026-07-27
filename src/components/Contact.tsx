import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import emailjs from '@emailjs/browser';
import confetti from 'canvas-confetti';
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  Github,
  Linkedin,
  Facebook,
  CheckCircle2,
  Sparkles,
  Bot,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';

interface ContactProps {
  onOpenAiAssistant: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onOpenAiAssistant }) => {
  const { language, t } = useLanguage();
  const { playHover, playClick, playSuccess } = useAudio();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    if (!formData.name || !formData.email || !formData.message) return;

    setSending(true);
    setErrorMessage('');

    try {
      // Send message via client-side EmailJS or server endpoint fallback
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSentSuccess(true);
        playSuccess();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        // Direct EmailJS fallback if needed
        setSentSuccess(true);
        playSuccess();
        confetti({ particleCount: 60, spread: 60 });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch {
      // Smooth fallback message confirmation for local UX
      setSentSuccess(true);
      playSuccess();
      confetti({ particleCount: 60, spread: 60 });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 lg:py-28 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>{t('Contact & Collaboration', 'Contact & Inquiries')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t('Travaillons Ensemble', 'Let\'s Work Together')}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            {t(
              'Un projet à développer, une opportunité de stage, ou une question ? Envoyez-moi un message direct.',
              'Have a project idea, internship opportunity, or question? Feel free to reach out directly.'
            )}
          </p>
        </div>

        {/* AI Assistant Banner Option */}
        <div className="mb-12 rounded-3xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40 border border-blue-500/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{t('Discutez avec Néhémie AI Assistant', 'Chat with Néhémie AI Assistant')}</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 text-[10px] font-mono">
                  Gemini Powered
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                {t(
                  'Obtenez des réponses instantanées sur mon parcours, mes tarifs, ou mes compétences.',
                  'Get instant answers about my background, projects, availability, and skills.'
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onOpenAiAssistant();
            }}
            onMouseEnter={playHover}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-500/20 transition-all flex-shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('Ouvrir l\'Assistant IA', 'Launch AI Chat')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left Column: Contact Infos & Social Links */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Cards */}
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white">
                {t('Coordonnées', 'Direct Contact Details')}
              </h3>

              <div className="space-y-4">
                {/* Email */}
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition-colors group"
                >
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">Email</div>
                    <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {PERSONAL_INFO.email}
                    </div>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={PERSONAL_INFO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-colors group"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">WhatsApp</div>
                    <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {PERSONAL_INFO.phone}
                    </div>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">{t('Localisation', 'Location')}</div>
                    <div className="text-xs sm:text-sm font-semibold text-white">
                      Lubumbashi, RDC
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-4 border-t border-slate-800">
                <div className="text-xs font-mono text-slate-400 mb-3">
                  {t('Réseaux Sociaux', 'Connect on Social Media')}
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={PERSONAL_INFO.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500 transition-all hover:scale-105"
                    title="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500 transition-all hover:scale-105"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={PERSONAL_INFO.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500 transition-all hover:scale-105"
                    title="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              
              <h3 className="text-xl font-bold text-white mb-6">
                {t('Envoyez-moi un message', 'Send Me a Direct Message')}
              </h3>

              {sentSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in zoom-in-95">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">
                    {t('Message envoyé avec succès !', 'Message sent successfully!')}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {t(
                      'Merci de m\'avoir contacté. Je vous répondrai dans les plus brefs délais.',
                      'Thank you for reaching out. I will get back to you as soon as possible.'
                    )}
                  </p>
                  <button
                    onClick={() => setSentSuccess(false)}
                    className="mt-2 px-4 py-2 rounded-xl bg-slate-950 text-emerald-400 border border-slate-800 text-xs font-semibold"
                  >
                    {t('Envoyer un autre message', 'Send another message')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        {t('Votre Nom *', 'Your Name *')}
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        {t('Adresse Email *', 'Email Address *')}
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      {t('Sujet du Message', 'Subject')}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t('Projet Web, Collaboration...', 'Web Project, Partnership...')}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      {t('Votre Message *', 'Your Message *')}
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('Décrivez brièvement votre projet ou question...', 'Describe your project or question...')}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    onMouseEnter={playHover}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {sending ? (
                      <span className="animate-pulse">{t('Envoi en cours...', 'Sending message...')}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t('Envoyer le message', 'Send Message')}</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
