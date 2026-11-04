import React from 'react';
import type {
  Certification,
  Project,
  Service,
  SiteContent,
  SkillCategory,
  SocialIcon,
  SocialLink,
  StatItem,
  TimelineEvent
} from '../../shared/types';
import { ICON_NAMES, PROJECT_CATEGORIES, TIMELINE_CATEGORIES } from '../site/sections';
import { CollectionEditor } from './CollectionEditor';
import {
  ImageField,
  L10nField,
  L10nLinesField,
  LinesField,
  SelectField,
  TagsField,
  TextField,
  Toggle
} from './fields';
import { SaveBar, useSiteEditor } from './SiteEditor';

const empty = { fr: '', en: '' };
const emptyList = { fr: [] as string[], en: [] as string[] };

export const PageTitle: React.FC<{ title: string; intro?: string; children?: React.ReactNode }> = ({ title, intro, children }) => (
  <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {intro && <p className="mt-2 max-w-2xl text-muted">{intro}</p>}
    </div>
    {children}
  </div>
);

const Card: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="card space-y-5 p-5 sm:p-6">
    {title && <h2 className="border-b border-line pb-4 font-semibold">{title}</h2>}
    {children}
  </section>
);

/** Fournit le contenu et une fonction de mise à jour d'une clé du site. */
function useSection<K extends keyof SiteContent>(key: K) {
  const { site, update } = useSiteEditor();
  return [site?.[key], (value: SiteContent[K]) => update((s) => ({ ...s, [key]: value }))] as const;
}

const Loading = () => <p className="text-muted">Chargement…</p>;

// ----------------------------------------------------------------- Profil & liens
const SOCIAL_OPTIONS: { value: SocialIcon; label: string }[] = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'website', label: 'Autre site' }
];

export const ProfilePage: React.FC = () => {
  const [p, setP] = useSection('profile');
  const [socials, setSocials] = useSection('socials');
  if (!p || !socials) return <Loading />;
  const set = <K extends keyof typeof p>(k: K, v: (typeof p)[K]) => setP({ ...p, [k]: v });

  return (
    <>
      <PageTitle title="Profil et liens" intro="Ces informations apparaissent en haut du site, dans « Profil », le CV et le contact." />
      <div className="space-y-6">
        <Card title="Identité">
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField label="Nom complet" value={p.name} onChange={(v) => set('name', v)} />
            <TextField label="Nom court" value={p.shortName} onChange={(v) => set('shortName', v)} hint="Affiché dans le menu." />
            <TextField label="Initiales" value={p.initials} onChange={(v) => set('initials', v.slice(0, 4))} hint="Logo, 4 lettres max." />
          </div>
          <ImageField label="Photo de profil" value={p.photo} onChange={(v) => set('photo', v)} hint="Format portrait conseillé (4:5)." />
          <L10nField label="Titre" value={p.title} onChange={(v) => set('title', v)} />
          <L10nField label="Phrase d'accroche" value={p.headline} onChange={(v) => set('headline', v)} />
          <L10nField label="Disponibilité" value={p.availability} onChange={(v) => set('availability', v)} />
          <L10nField label="Slogan (pied de page)" value={p.slogan} onChange={(v) => set('slogan', v)} />
        </Card>

        <Card title="Présentation">
          <L10nField label="Biographie" value={p.bio} onChange={(v) => set('bio', v)} multiline rows={5} />
          <L10nField label="Vision" value={p.vision} onChange={(v) => set('vision', v)} multiline rows={3} />
          <L10nLinesField label="Objectifs" value={p.goals} onChange={(v) => set('goals', v)} />
          <div className="grid gap-5 sm:grid-cols-2">
            <L10nField label="Localisation" value={p.location} onChange={(v) => set('location', v)} />
            <L10nField label="Niveau d'études" value={p.studyLevel} onChange={(v) => set('studyLevel', v)} />
          </div>
          <TagsField label="Langues parlées" value={p.spokenLanguages} onChange={(v) => set('spokenLanguages', v)} />
        </Card>

        <Card title="Coordonnées">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="E-mail" type="email" value={p.email} onChange={(v) => set('email', v)} />
            <TextField label="Téléphone" value={p.phone} onChange={(v) => set('phone', v)} placeholder="+243 …" hint="Laisser vide pour le masquer." />
            <TextField
              label="WhatsApp"
              value={p.whatsapp}
              onChange={(v) => set('whatsapp', v)}
              placeholder="+243 9…"
              hint="Numéro avec indicatif. Laisser vide pour le masquer."
            />
            <TextField
              label="CV en PDF (lien)"
              value={p.cvUrl}
              onChange={(v) => set('cvUrl', v)}
              placeholder="https://…"
              hint="Facultatif. Sinon, le bouton « Mon CV » ouvre le CV généré automatiquement."
            />
          </div>
        </Card>

        <Card title="Réseaux sociaux">
          <CollectionEditor<SocialLink>
            items={socials}
            onChange={setSocials}
            itemTitle={(s) => s.label}
            itemSubtitle={(s) => s.url}
            createItem={(id) => ({ id, label: 'LinkedIn', url: '', icon: 'linkedin' })}
            addLabel="Ajouter un lien"
            emptyText="Aucun réseau social."
            renderForm={(s, upd) => (
              <div className="grid gap-5 sm:grid-cols-[12rem_1fr]">
                <SelectField
                  label="Réseau"
                  value={s.icon}
                  options={SOCIAL_OPTIONS}
                  onChange={(icon) => upd({ icon, label: SOCIAL_OPTIONS.find((o) => o.value === icon)?.label ?? s.label })}
                />
                <TextField label="Adresse (URL)" value={s.url} onChange={(url) => upd({ url })} placeholder="https://…" />
              </div>
            )}
          />
        </Card>
      </div>
      <SaveBar />
    </>
  );
};

// ----------------------------------------------------------------- Projets
const CATEGORY_LABELS: Record<string, string> = {
  web: 'Web',
  mobile: 'Mobile',
  ai: 'Intelligence artificielle',
  cloud: 'Cloud',
  db: 'Données',
  network: 'Réseaux',
  other: 'Autre'
};

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useSection('projects');
  if (!projects) return <Loading />;
  return (
    <>
      <PageTitle title="Projets" intro="Les projets « mis en avant » sont affichés en grand ; les autres dans une liste compacte." />
      <CollectionEditor<Project>
        items={projects}
        onChange={setProjects}
        itemTitle={(p) => p.title}
        itemSubtitle={(p) => `${CATEGORY_LABELS[p.category] ?? p.category}${p.featured ? ', mis en avant' : ''}`}
        createItem={(id) => ({
          id,
          title: 'Nouveau projet',
          category: 'web',
          description: { ...empty },
          fullDescription: { ...empty },
          image: '',
          tags: [],
          githubUrl: '',
          demoUrl: '',
          featured: false
        })}
        addLabel="Ajouter un projet"
        emptyText="Aucun projet."
        renderForm={(p, upd) => (
          <>
            <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
              <TextField label="Nom du projet" value={p.title} onChange={(title) => upd({ title })} />
              <SelectField
                label="Catégorie"
                value={p.category}
                options={PROJECT_CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] }))}
                onChange={(category) => upd({ category })}
              />
            </div>
            <Toggle label="Mettre en avant" checked={p.featured} onChange={(featured) => upd({ featured })} />
            <ImageField label="Image" value={p.image} onChange={(image) => upd({ image })} hint="Format paysage conseillé (16:10)." />
            <L10nField label="Description courte" value={p.description} onChange={(description) => upd({ description })} multiline rows={2} />
            <L10nField
              label="Description détaillée"
              value={p.fullDescription}
              onChange={(fullDescription) => upd({ fullDescription })}
              multiline
              rows={5}
            />
            <TagsField label="Technologies" value={p.tags} onChange={(tags) => upd({ tags })} />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Lien du site (démo)" value={p.demoUrl} onChange={(demoUrl) => upd({ demoUrl })} placeholder="https://…" />
              <TextField label="Lien du code (GitHub)" value={p.githubUrl} onChange={(githubUrl) => upd({ githubUrl })} placeholder="https://github.com/…" />
            </div>
          </>
        )}
      />
      <SaveBar />
    </>
  );
};

// ----------------------------------------------------------------- Compétences
export const SkillsPage: React.FC = () => {
  const [cats, setCats] = useSection('skillCategories');
  if (!cats) return <Loading />;
  return (
    <>
      <PageTitle title="Compétences" intro="Regroupées par catégorie." />
      <CollectionEditor<SkillCategory>
        items={cats}
        onChange={setCats}
        itemTitle={(c) => c.title.fr}
        itemSubtitle={(c) => c.skills.join(', ')}
        createItem={(id) => ({ id, title: { fr: 'Nouvelle catégorie', en: '' }, icon: 'code', skills: [] })}
        addLabel="Ajouter une catégorie"
        emptyText="Aucune compétence."
        renderForm={(c, upd) => (
          <>
            <div className="grid gap-5 sm:grid-cols-[1fr_12rem]">
              <L10nField label="Nom de la catégorie" value={c.title} onChange={(title) => upd({ title })} />
              <SelectField label="Icône" value={c.icon} options={ICON_NAMES.map((n) => ({ value: n, label: n }))} onChange={(icon) => upd({ icon })} />
            </div>
            <LinesField label="Compétences" value={c.skills} onChange={(skills) => upd({ skills })} rows={6} />
          </>
        )}
      />
      <SaveBar />
    </>
  );
};

// ----------------------------------------------------------------- Services
export const ServicesPage: React.FC = () => {
  const [services, setServices] = useSection('services');
  if (!services) return <Loading />;
  return (
    <>
      <PageTitle title="Services" intro="Ce que vous proposez aux visiteurs (section « Ce que je peux faire pour vous »)." />
      <CollectionEditor<Service>
        items={services}
        onChange={setServices}
        itemTitle={(s) => s.title.fr}
        createItem={(id) => ({ id, title: { fr: 'Nouveau service', en: '' }, description: { ...empty }, icon: 'code', features: { ...emptyList } })}
        addLabel="Ajouter un service"
        emptyText="Aucun service."
        renderForm={(s, upd) => (
          <>
            <div className="grid gap-5 sm:grid-cols-[1fr_12rem]">
              <L10nField label="Nom" value={s.title} onChange={(title) => upd({ title })} />
              <SelectField label="Icône" value={s.icon} options={ICON_NAMES.map((n) => ({ value: n, label: n }))} onChange={(icon) => upd({ icon })} />
            </div>
            <L10nField label="Description" value={s.description} onChange={(description) => upd({ description })} multiline rows={2} />
            <L10nLinesField label="Points clés" value={s.features} onChange={(features) => upd({ features })} />
          </>
        )}
      />
      <SaveBar />
    </>
  );
};

// ----------------------------------------------------------------- Parcours
const TIMELINE_LABELS: Record<string, string> = {
  education: 'Formation',
  experience: 'Expérience',
  achievement: 'Réussite',
  volunteering: 'Volontariat',
  future: 'Projet à venir'
};

export const TimelinePage: React.FC = () => {
  const [events, setEvents] = useSection('timeline');
  if (!events) return <Loading />;
  return (
    <>
      <PageTitle title="Parcours" intro="Affiché dans l'ordre de la liste : utilisez les flèches pour réordonner." />
      <CollectionEditor<TimelineEvent>
        items={events}
        onChange={setEvents}
        itemTitle={(e) => `${e.year} : ${e.title.fr}`}
        itemSubtitle={(e) => e.institution.fr}
        createItem={(id) => ({
          id,
          year: String(new Date().getFullYear()),
          title: { fr: 'Nouvelle étape', en: '' },
          institution: { ...empty },
          description: { ...empty },
          category: 'experience',
          skills: []
        })}
        addLabel="Ajouter une étape"
        emptyText="Aucune étape."
        renderForm={(e, upd) => (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Année ou période" value={e.year} onChange={(year) => upd({ year })} placeholder="2024 – 2025" />
              <SelectField
                label="Type"
                value={e.category}
                options={TIMELINE_CATEGORIES.map((c) => ({ value: c, label: TIMELINE_LABELS[c] }))}
                onChange={(category) => upd({ category })}
              />
            </div>
            <L10nField label="Titre" value={e.title} onChange={(title) => upd({ title })} />
            <L10nField label="Établissement / organisation" value={e.institution} onChange={(institution) => upd({ institution })} />
            <L10nField label="Description" value={e.description} onChange={(description) => upd({ description })} multiline rows={3} />
            <TagsField label="Compétences liées" value={e.skills} onChange={(skills) => upd({ skills })} />
          </>
        )}
      />
      <SaveBar />
    </>
  );
};

// ----------------------------------------------------------------- Certifications
export const CertificationsPage: React.FC = () => {
  const [certs, setCerts] = useSection('certifications');
  if (!certs) return <Loading />;
  return (
    <>
      <PageTitle
        title="Certifications"
        intro="Ajoutez le lien de vérification officiel quand il existe : c'est ce qui donne confiance aux recruteurs."
      />
      <CollectionEditor<Certification>
        items={certs}
        onChange={setCerts}
        itemTitle={(c) => c.title}
        itemSubtitle={(c) => `${c.issuer}, ${c.issueDate}${c.credentialUrl ? ', vérifiable' : ''}`}
        createItem={(id) => ({
          id,
          title: 'Nouvelle certification',
          issuer: '',
          issueDate: String(new Date().getFullYear()),
          credentialId: '',
          credentialUrl: '',
          skills: [],
          description: { ...empty }
        })}
        addLabel="Ajouter une certification"
        emptyText="Aucune certification."
        renderForm={(c, upd) => (
          <>
            <TextField label="Intitulé" value={c.title} onChange={(title) => upd({ title })} />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Organisme" value={c.issuer} onChange={(issuer) => upd({ issuer })} />
              <TextField label="Date ou année" value={c.issueDate} onChange={(issueDate) => upd({ issueDate })} />
              <TextField label="Identifiant du certificat" value={c.credentialId} onChange={(credentialId) => upd({ credentialId })} hint="Facultatif." />
              <TextField
                label="Lien de vérification"
                value={c.credentialUrl}
                onChange={(credentialUrl) => upd({ credentialUrl })}
                placeholder="https://…"
                hint="Facultatif."
              />
            </div>
            <L10nField label="Description" value={c.description} onChange={(description) => upd({ description })} multiline rows={2} />
            <TagsField label="Compétences validées" value={c.skills} onChange={(skills) => upd({ skills })} />
          </>
        )}
      />
      <SaveBar />
    </>
  );
};

// ----------------------------------------------------------------- Chiffres clés
export const StatsPage: React.FC = () => {
  const [stats, setStats] = useSection('stats');
  if (!stats) return <Loading />;
  return (
    <>
      <PageTitle title="Chiffres clés" intro="Affichés sous l'en-tête du site. Gardez des chiffres vérifiables." />
      <CollectionEditor<StatItem>
        items={stats}
        onChange={setStats}
        itemTitle={(s) => `${s.value} ${s.label.fr}`}
        createItem={(id) => ({ id, value: '1', label: { fr: 'Nouveau chiffre', en: '' } })}
        addLabel="Ajouter un chiffre"
        emptyText="Aucun chiffre : la bande est masquée."
        renderForm={(s, upd) => (
          <div className="grid gap-5 sm:grid-cols-[10rem_1fr]">
            <TextField label="Valeur" value={s.value} onChange={(value) => upd({ value })} placeholder="5+" />
            <L10nField label="Libellé" value={s.label} onChange={(label) => upd({ label })} />
          </div>
        )}
      />
      <SaveBar />
    </>
  );
};

// ----------------------------------------------------------------- Réglages
