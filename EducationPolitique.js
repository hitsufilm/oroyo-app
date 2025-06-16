import React, { useState } from 'react';
import { ArrowLeft, Book, Users, Building, Crown, Globe2, Scale, Vote, ChevronRight, ChevronDown, Award, Target, Calendar, MapPin } from 'lucide-react';
import '../EducationPolitique.css';

const EducationPolitique = ({ setCurrentScreen }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedCard, setExpandedCard] = useState(null);

  const sections = [
    { id: 'overview', title: 'Vue d\'ensemble', icon: Book },
    { id: 'institutions', title: 'Institutions', icon: Building },
    { id: 'elus', title: 'Élus locaux', icon: Users },
    { id: 'processus', title: 'Processus démocratique', icon: Vote },
    { id: 'droits', title: 'Vos droits', icon: Award }
  ];

  const institutionsData = [
    {
      id: 'commune',
      title: 'La Commune',
      icon: Building,
      color: '#3B82F6',
      description: 'L\'échelon de proximité le plus proche des citoyens',
      details: {
        role: 'Gestion des services de proximité : état civil, urbanisme, voirie, écoles primaires, action sociale locale',
        composition: 'Conseil municipal élu pour 6 ans au suffrage universel direct',
        pouvoir: 'Vote du budget, délibérations sur les affaires locales, élection du maire',
        budget: 'Financé par les impôts locaux, dotations de l\'État et recettes propres'
      },
      elus: [
        { poste: 'Maire', role: 'Représente la commune, exécute les décisions du conseil municipal', mandat: '6 ans' },
        { poste: 'Adjoints au Maire', role: 'Assistent le maire dans ses fonctions', mandat: '6 ans' },
        { poste: 'Conseillers Municipaux', role: 'Votent le budget et les délibérations', mandat: '6 ans' }
      ]
    },
    {
      id: 'intercommunalite',
      title: 'L\'Intercommunalité',
      icon: Globe2,
      color: '#EC4899',
      description: 'Regroupement de communes pour mutualiser les services',
      details: {
        role: 'Gestion des compétences transférées : déchets, transport, développement économique, aménagement',
        composition: 'Conseillers communautaires élus indirectement ou au suffrage universel',
        pouvoir: 'Compétences déléguées par les communes membres',
        budget: 'Contributions des communes membres et fiscalité propre'
      },
      elus: [
        { poste: 'Président', role: 'Dirige l\'intercommunalité', mandat: '6 ans' },
        { poste: 'Vice-présidents', role: 'Assistent le président', mandat: '6 ans' },
        { poste: 'Conseillers Intercommunaux', role: 'Représentent leur commune', mandat: '6 ans' }
      ]
    },
    {
      id: 'departement',
      title: 'Le Département',
      icon: MapPin,
      color: '#10B981',
      description: 'Collectivité territoriale intermédiaire',
      details: {
        role: 'Action sociale, collèges, routes départementales, pompiers, culture',
        composition: 'Conseil départemental élu pour 6 ans au suffrage universel direct',
        pouvoir: 'Compétences de solidarité territoriale et sociale',
        budget: 'Financé par les impôts locaux et dotations de l\'État'
      },
      elus: [
        { poste: 'Président du Conseil Départemental', role: 'Exécutif départemental', mandat: '6 ans' },
        { poste: 'Conseillers Départementaux', role: 'Élus par canton', mandat: '6 ans' }
      ]
    },
    {
      id: 'region',
      title: 'La Région',
      icon: Scale,
      color: '#8B5CF6',
      description: 'Collectivité territoriale de développement',
      details: {
        role: 'Développement économique, formation professionnelle, lycées, transports régionaux',
        composition: 'Conseil régional élu pour 6 ans au suffrage universel direct',
        pouvoir: 'Planification et développement du territoire régional',
        budget: 'Financé par la fiscalité régionale et les fonds européens'
      },
      elus: [
        { poste: 'Président du Conseil Régional', role: 'Exécutif régional', mandat: '6 ans' },
        { poste: 'Conseillers Régionaux', role: 'Élus à la proportionnelle', mandat: '6 ans' }
      ]
    },
    {
      id: 'national',
      title: 'L\'État',
      icon: Crown,
      color: '#F59E0B',
      description: 'Niveau national de gouvernance',
      details: {
        role: 'Sécurité, justice, défense, politique étrangère, éducation nationale',
        composition: 'Gouvernement nommé par le Président de la République',
        pouvoir: 'Souveraineté nationale et régalienne',
        budget: 'Budget de l\'État voté par le Parlement'
      },
      elus: [
        { poste: 'Députés', role: 'Votent les lois à l\'Assemblée Nationale', mandat: '5 ans' },
        { poste: 'Sénateurs', role: 'Représentent les territoires au Sénat', mandat: '6 ans' },
        { poste: 'Président de la République', role: 'Chef de l\'État', mandat: '5 ans' }
      ]
    }
  ];

  const processusData = [
    {
      title: 'Les élections municipales',
      description: 'Comment sont élus vos représentants locaux',
      steps: [
        'Candidatures déposées en préfecture',
        'Campagne électorale de 2 semaines',
        'Vote au suffrage universel direct',
        'Élection du maire par le conseil municipal'
      ],
      frequence: 'Tous les 6 ans',
      prochaine: 'Mars 2026'
    },
    {
      title: 'Le budget communal',
      description: 'Comment sont décidées les dépenses de votre commune',
      steps: [
        'Préparation par les services municipaux',
        'Présentation par le maire',
        'Débat en conseil municipal',
        'Vote et adoption du budget'
      ],
      frequence: 'Chaque année',
      periode: 'Octobre à décembre'
    },
    {
      title: 'Les délibérations',
      description: 'Comment sont prises les décisions municipales',
      steps: [
        'Inscription à l\'ordre du jour',
        'Présentation du dossier',
        'Débat entre élus',
        'Vote et publication'
      ],
      frequence: 'Plusieurs fois par mois',
      acces: 'Séances publiques'
    }
  ];

  const droitsData = [
    {
      title: 'Droit à l\'information',
      description: 'Accès aux documents administratifs et aux délibérations',
      actions: [
        'Consulter les comptes-rendus de conseil municipal',
        'Demander communication des documents administratifs',
        'Assister aux séances publiques du conseil municipal',
        'Accéder au budget et aux comptes de la commune'
      ]
    },
    {
      title: 'Droit de pétition',
      description: 'Possibilité de saisir le conseil municipal',
      actions: [
        'Déposer une pétition signée par des électeurs',
        'Demander l\'inscription d\'une question à l\'ordre du jour',
        'Organiser une consultation locale',
        'Créer un comité de quartier'
      ]
    },
    {
      title: 'Droit de participation',
      description: 'Participer à la vie démocratique locale',
      actions: [
        'Voter aux élections municipales',
        'Se porter candidat aux élections',
        'Participer aux conseils de quartier',
        'Contribuer aux budgets participatifs'
      ]
    },
    {
      title: 'Droit de recours',
      description: 'Contester les décisions municipales',
      actions: [
        'Saisir le tribunal administratif',
        'Déposer un référé en cas d\'urgence',
        'Contester un acte devant le préfet',
        'Faire appel au médiateur'
      ]
    }
  ];

  const renderOverview = () => (
    <div className="education-overview">
      <div className="hero-education">
        <h2>Comprendre la politique locale en Guyane</h2>
        <p>Découvrez comment fonctionnent les institutions qui vous gouvernent au quotidien</p>
      </div>
      
      <div className="stats-education">
        <div className="stat-card">
          <div className="stat-number">22</div>
          <div className="stat-label">Communes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">2</div>
          <div className="stat-label">Députés</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">2</div>
          <div className="stat-label">Sénateurs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">51</div>
          <div className="stat-label">Conseillers CTG</div>
        </div>
      </div>

      <div className="quick-access">
        <h3>Accès rapide</h3>
        <div className="quick-grid">
          {sections.slice(1).map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                className="quick-card"
                onClick={() => setActiveSection(section.id)}
              >
                <Icon size={24} />
                <span>{section.title}</span>
                <ChevronRight size={16} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="advanced-section" style={{
        marginTop: '2rem',
        padding: '2rem',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderRadius: '12px',
        border: '2px solid rgba(245, 158, 11, 0.2)',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#f59e0b', marginBottom: '1rem' }}>🚀 Version Avancée Disponible !</h3>
        <p style={{ color: '#92400e', marginBottom: '1.5rem' }}>
          Découvrez notre section éducation politique enrichie avec des anecdotes, cas pratiques et témoignages exclusifs sur les <strong>maires, députés ET sénateurs</strong> de Guyane !
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center', 
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#92400e'
          }}>
            🏛️ Maires en détail
          </div>
          <div style={{
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#166534'
          }}>
            🗳️ Députés en détail
          </div>
          <div style={{
            backgroundColor: 'rgba(124, 58, 237, 0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#581c87'
          }}>
            ⚖️ Sénateurs en détail
          </div>
        </div>
        <button
          onClick={() => setCurrentScreen('educationAvancee')}
          style={{
            backgroundColor: '#f59e0b',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: '0 auto',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#d97706';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f59e0b';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <Target size={20} />
          Accéder à la version avancée
        </button>
      </div>
    </div>
  );

  const renderInstitutions = () => (
    <div className="institutions-section">
      <h2>Les institutions de la République</h2>
      <p>Comprendre les différents niveaux de gouvernance</p>
      
      <div className="institutions-grid">
        {institutionsData.map(institution => {
          const Icon = institution.icon;
          const isExpanded = expandedCard === institution.id;
          
          return (
            <div key={institution.id} className={`institution-card ${isExpanded ? 'expanded' : ''}`}>
              <div 
                className="institution-header"
                onClick={() => setExpandedCard(isExpanded ? null : institution.id)}
              >
                <div className="institution-icon" style={{ backgroundColor: institution.color }}>
                  <Icon size={24} />
                </div>
                <div className="institution-info">
                  <h3>{institution.title}</h3>
                  <p>{institution.description}</p>
                </div>
                <ChevronDown className={`expand-icon ${isExpanded ? 'rotated' : ''}`} />
              </div>
              
              {isExpanded && (
                <div className="institution-details">
                  <div className="detail-section">
                    <h4>Rôle et compétences</h4>
                    <p>{institution.details.role}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Composition</h4>
                    <p>{institution.details.composition}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Pouvoirs</h4>
                    <p>{institution.details.pouvoir}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Financement</h4>
                    <p>{institution.details.budget}</p>
                  </div>
                  
                  <div className="elus-section">
                    <h4>Les élus</h4>
                    <div className="elus-grid">
                      {institution.elus.map((elu, index) => (
                        <div key={index} className="elu-item">
                          <div className="elu-poste">{elu.poste}</div>
                          <div className="elu-role">{elu.role}</div>
                          <div className="elu-mandat">Mandat : {elu.mandat}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderElus = () => (
    <div className="elus-section">
      <h2>Vos élus locaux</h2>
      <p>Qui sont-ils et que font-ils ?</p>
      
      <div className="elus-types">
        <div className="elu-type-card">
          <div className="elu-type-header">
            <Crown size={32} style={{ color: '#3B82F6' }} />
            <h3>Le Maire</h3>
          </div>
          <div className="elu-type-content">
            <h4>Ses missions principales :</h4>
            <ul>
              <li>Représenter la commune</li>
              <li>Exécuter les décisions du conseil municipal</li>
              <li>Gérer l'état civil</li>
              <li>Maintenir l'ordre public</li>
              <li>Gérer le personnel communal</li>
            </ul>
            <div className="elu-type-info">
              <span className="info-badge">Élu pour 6 ans</span>
              <span className="info-badge">Rééligible</span>
            </div>
          </div>
        </div>

        <div className="elu-type-card">
          <div className="elu-type-header">
            <Users size={32} style={{ color: '#8B5CF6' }} />
            <h3>Les Adjoints au Maire</h3>
          </div>
          <div className="elu-type-content">
            <h4>Leurs missions :</h4>
            <ul>
              <li>Assister le maire dans ses fonctions</li>
              <li>Gérer des délégations spécifiques</li>
              <li>Remplacer le maire en cas d'absence</li>
              <li>Animer des commissions municipales</li>
            </ul>
            <div className="elu-type-info">
              <span className="info-badge">Élus par le conseil municipal</span>
              <span className="info-badge">Mandat de 6 ans</span>
            </div>
          </div>
        </div>

        <div className="elu-type-card">
          <div className="elu-type-header">
            <Building size={32} style={{ color: '#10B981' }} />
            <h3>Les Conseillers Municipaux</h3>
          </div>
          <div className="elu-type-content">
            <h4>Leur rôle :</h4>
            <ul>
              <li>Voter le budget municipal</li>
              <li>Délibérer sur les affaires locales</li>
              <li>Contrôler l'action du maire</li>
              <li>Participer aux commissions</li>
            </ul>
            <div className="elu-type-info">
              <span className="info-badge">Élus au suffrage universel</span>
              <span className="info-badge">Mandat de 6 ans</span>
            </div>
          </div>
        </div>

        <div className="elu-type-card">
          <div className="elu-type-header">
            <Globe2 size={32} style={{ color: '#EC4899' }} />
            <h3>Les Conseillers Intercommunaux</h3>
          </div>
          <div className="elu-type-content">
            <h4>Leurs compétences :</h4>
            <ul>
              <li>Gestion des déchets</li>
              <li>Développement économique</li>
              <li>Aménagement du territoire</li>
              <li>Transport public</li>
            </ul>
            <div className="elu-type-info">
              <span className="info-badge">Représentent leur commune</span>
              <span className="info-badge">Mandat de 6 ans</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProcessus = () => (
    <div className="processus-section">
      <h2>Le processus démocratique</h2>
      <p>Comment fonctionnent les institutions locales</p>
      
      <div className="processus-grid">
        {processusData.map((processus, index) => (
          <div key={index} className="processus-card">
            <h3>{processus.title}</h3>
            <p>{processus.description}</p>
            
            <div className="processus-steps">
              <h4>Les étapes :</h4>
              <ol>
                {processus.steps.map((step, stepIndex) => (
                  <li key={stepIndex}>{step}</li>
                ))}
              </ol>
            </div>
            
            <div className="processus-info">
              {processus.frequence && (
                <div className="info-item">
                  <Calendar size={16} />
                  <span>Fréquence : {processus.frequence}</span>
                </div>
              )}
              {processus.prochaine && (
                <div className="info-item">
                  <Target size={16} />
                  <span>Prochaine : {processus.prochaine}</span>
                </div>
              )}
              {processus.periode && (
                <div className="info-item">
                  <Calendar size={16} />
                  <span>Période : {processus.periode}</span>
                </div>
              )}
              {processus.acces && (
                <div className="info-item">
                  <Users size={16} />
                  <span>Accès : {processus.acces}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDroits = () => (
    <div className="droits-section">
      <h2>Vos droits de citoyen</h2>
      <p>Ce que vous pouvez faire en tant que citoyen</p>
      
      <div className="droits-grid">
        {droitsData.map((droit, index) => (
          <div key={index} className="droit-card">
            <h3>{droit.title}</h3>
            <p>{droit.description}</p>
            
            <div className="actions-list">
              <h4>Vos possibilités d'action :</h4>
              <ul>
                {droit.actions.map((action, actionIndex) => (
                  <li key={actionIndex}>{action}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="contact-info">
        <h3>Besoin d'aide ?</h3>
        <p>Pour exercer vos droits, vous pouvez contacter :</p>
        <div className="contact-grid">
          <div className="contact-item">
            <h4>Votre mairie</h4>
            <p>Pour les questions locales</p>
          </div>
          <div className="contact-item">
            <h4>La préfecture</h4>
            <p>Pour les recours administratifs</p>
          </div>
          <div className="contact-item">
            <h4>Le tribunal administratif</h4>
            <p>Pour les contentieux</p>
          </div>
          <div className="contact-item">
            <h4>Le médiateur</h4>
            <p>Pour les conflits</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'institutions':
        return renderInstitutions();
      case 'elus':
        return renderElus();
      case 'processus':
        return renderProcessus();
      case 'droits':
        return renderDroits();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="education-politique">
      <div className="education-header">
        <div className="container">
          <div className="header-nav">
            <button
              onClick={() => setCurrentScreen('home')}
              className="btn-back-education"
            >
              <ArrowLeft size={20} />
              Retour
            </button>
            <div className="header-info">
              <h1>Éducation Politique</h1>
              <p>Comprendre le fonctionnement de la démocratie locale</p>
            </div>
          </div>
        </div>
      </div>

      <div className="education-nav">
        <div className="container">
          <nav className="section-nav">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon size={20} />
                  <span>{section.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="education-content">
        <div className="container">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default EducationPolitique; 
