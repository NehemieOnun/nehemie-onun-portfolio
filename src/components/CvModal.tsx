import React from 'react';
import { PERSONAL_INFO, CERTIFICATIONS, SKILL_CATEGORIES } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import {
  X,
  Printer,
  Download,
  GraduationCap,
  Award,
  Code2,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  CheckCircle2
} from 'lucide-react';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CvModal: React.FC<CvModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const { playClick, playHover } = useAudio();

  if (!isOpen) return null;

  const handlePrint = () => {
    playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              {t('Curriculum Vitae Officiel', 'Official Curriculum Vitae')}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              onMouseEnter={playHover}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20"
            >
              <Printer className="w-4 h-4" />
              <span>{t('Imprimer / Télécharger PDF', 'Print / Download PDF')}</span>
            </button>

            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable CV Content */}
        <div id="printable-cv" className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8 bg-slate-950 text-slate-200">
          
          {/* Header */}
          <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {PERSONAL_INFO.name}
              </h1>
              <p className="text-xs sm:text-sm font-mono text-blue-400 font-semibold mt-1">
                {PERSONAL_INFO.title[language]}
              </p>
              <p className="text-xs text-slate-400 mt-2 max-w-xl">
                {PERSONAL_INFO.slogan[language]}
              </p>
            </div>

            <div className="text-xs font-mono space-y-1.5 text-slate-400 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{PERSONAL_INFO.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{PERSONAL_INFO.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>{PERSONAL_INFO.phone}</span>
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>{t('Formation & Diplômes', 'Education & Academic Degree')}</span>
            </h2>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex justify-between text-sm font-bold text-white">
                <span>{t('Diplôme en Génie Informatique (En cours)', 'Computer Engineering Degree (Ongoing)')}</span>
                <span className="text-xs font-mono text-blue-400">2022 - 2026</span>
              </div>
              <p className="text-xs text-slate-400">
                {t('Université de Lubumbashi, République Démocratique du Congo', 'University of Lubumbashi, Democratic Republic of the Congo')}
              </p>
              <p className="text-xs text-slate-300 pt-2">
                {t(
                  'Spécialités : Génie Logiciel, Réseaux & Télécoms, Algorithmique avancée, Systèmes d\'exploitation et Cybersécurité.',
                  'Specialization: Software Engineering, Networks & Telecom, Data Structures, Operating Systems, Cybersecurity.'
                )}
              </p>
            </div>
          </div>

          {/* Certifications List */}
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>{t('Certifications Internationales (7 Titres)', 'Verified Certifications (7 Titles)')}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{cert.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono flex justify-between">
                    <span>{cert.issuer}</span>
                    <span className="text-emerald-400">{cert.issueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Technical Skills */}
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              <span>{t('Compétences Techniques Clés', 'Key Technical Competencies')}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SKILL_CATEGORIES.map((cat) => (
                <div key={cat.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-white">
                    {t(cat.title.fr, cat.title.en)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {cat.skills.map((s) => s.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
