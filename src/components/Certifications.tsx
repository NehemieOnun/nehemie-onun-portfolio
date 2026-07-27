import React, { useState } from 'react';
import { CERTIFICATIONS } from '../data/portfolioData';
import { Certification } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import {
  Award,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  X,
  Sparkles,
  Building2,
  Calendar
} from 'lucide-react';

export const Certifications: React.FC = () => {
  const { language, t } = useLanguage();
  const { playHover, playClick } = useAudio();

  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  return (
    <section id="certifications" className="relative py-20 lg:py-28 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>{t('Accréditations & Titres', 'Accreditations & Certificates')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t('Certifications Internationales', 'Verified Certifications')}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            {t(
              'Mes diplômes et certifications obtenus auprès d\'organisations internationales, gouvernements et leaders de la tech.',
              'Official diplomas and certificates earned from international agencies, tech hubs, and academic bodies.'
            )}
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.id}
              onMouseEnter={playHover}
              onClick={() => {
                playClick();
                setSelectedCert(cert);
              }}
              className="group cursor-pointer rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    {cert.issueDate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                  {cert.title}
                </h3>

                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-3">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{cert.issuer}</span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {cert.description[language]}
                </p>
              </div>

              {/* Skills Footer */}
              <div>
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800/80 mb-3">
                  {cert.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-emerald-400 font-mono">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t('Certificat Vérifié', 'Verified Credential')}
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Certification Detail Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {selectedCert.title}
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono mt-0.5">
                    {selectedCert.issuer}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCert(null)}
                className="p-2 rounded-full bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              {selectedCert.description[language]}
            </p>

            {/* Details Table */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
                <span className="text-slate-500">{t('Identifiant du Diplôme', 'Credential ID')}</span>
                <span className="text-emerald-400 font-bold">{selectedCert.credentialId || 'VERIFIED-OFFICIAL'}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
                <span className="text-slate-500">{t('Année d\'Obtention', 'Issue Date')}</span>
                <span className="text-slate-200">{selectedCert.issueDate}</span>
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                {t('Compétences Validées', 'Validated Competencies')}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCert.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCert(null)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              >
                {t('Fermer', 'Close')}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
