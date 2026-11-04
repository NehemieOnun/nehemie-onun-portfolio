import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { onLinkClick } from '../lib/router';

export const NotFound: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="container-page py-24">
      <p className="display text-7xl text-accent">404</p>
      <h1 className="heading mt-6 text-3xl">{t('Cette page n’existe pas', 'This page does not exist')}</h1>
      <a href="/" onClick={onLinkClick} className="btn btn-primary mt-8">
        {t('Retour à l’accueil', 'Back to home')}
      </a>
    </div>
  );
};
