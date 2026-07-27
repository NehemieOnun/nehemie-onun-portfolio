import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/portfolioData';
import { BlogPost } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  X,
  Share2,
  Tag
} from 'lucide-react';

export const Blog: React.FC = () => {
  const { language, t } = useLanguage();
  const { playHover, playClick } = useAudio();

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section id="blog" className="relative py-20 lg:py-28 bg-slate-900/60 dark:bg-slate-900/80 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('Articles & Publications', 'Articles & Tech Insights')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('Blog & Réflexions Tech', 'Blog & Knowledge Sharing')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            {t(
              'Mes articles et analyses sur l\'IA, la cybersécurité et le développement logiciel en Afrique.',
              'My latest articles on AI integration, API security, and software craftsmanship.'
            )}
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              onMouseEnter={playHover}
              onClick={() => {
                playClick();
                setSelectedPost(post);
              }}
              className="group cursor-pointer rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={post.image}
                    alt={post.title[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-purple-400 text-[10px] font-mono border border-slate-800">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-purple-400" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-400" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors leading-snug">
                    {post.title[language]}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {post.excerpt[language]}
                  </p>
                </div>
              </div>

              {/* Read Action */}
              <div className="p-6 pt-0 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300 border-t border-slate-800/60 mt-4">
                <span>{t('Lire l\'article', 'Read full post')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="relative h-60 bg-slate-950 overflow-hidden flex-shrink-0">
              <img
                src={selectedPost.image}
                alt={selectedPost.title[language]}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider mb-2 inline-block">
                  {selectedPost.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {selectedPost.title[language]}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pb-4 border-b border-slate-800">
                <span>📍 Néhémie Onun Kambongh</span>
                <span>•</span>
                <span>{selectedPost.date}</span>
                <span>•</span>
                <span>{selectedPost.readTime}</span>
              </div>

              <div className="text-sm text-slate-300 leading-relaxed space-y-4">
                <p className="font-semibold text-slate-100 text-base">
                  {selectedPost.excerpt[language]}
                </p>
                <p>
                  {selectedPost.content[language]}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {selectedPost.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-purple-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-semibold text-xs"
                >
                  {t('Fermer', 'Close')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
