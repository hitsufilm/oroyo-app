import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Users, ArrowLeft, Star, MessageCircle, Send, ThumbsUp, MapPin, UserPlus, Building, Crown, Globe2, Scale, Vote, Map, Landmark, Newspaper, Book, AlertCircle } from 'lucide-react';
import { db, auth } from './firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { 
  signOut
} from 'firebase/auth';
import './AppModern.css';
import { useAuth, AuthModal, UserButton } from './components/AuthComponent';
import EducationPolitique from './components/EducationPolitique';
import EducationPolitiqueAvancee from './components/EducationPolitiqueAvancee';

// FONCTION UTILITAIRE POUR NORMALISER LES CHAÎNES (enlever accents)
const normalizeString = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD') // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[œ]/g, 'oe') // Remplace œ par oe
    .replace(/[æ]/g, 'ae'); // Remplace æ par ae
};

// SERVICE D'ACTUALITÉS RÉACTIVÉ POUR VERCEL
const newsService = {
  async getEluNews(eluName, commune = '') {
    try {
      const query = `${eluName} Guyane`;
      console.log(`🔍 Recherche d'actualités pour: "${query}"`);

      const response = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        console.error(`❌ Erreur API: ${response.status}`);
        return [];
      }

      const data = await response.json();
      console.log('📊 Données reçues:', data);

      if (!data.articles || data.articles.length === 0) {
        console.log('ℹ️ Aucun article trouvé');
        return [];
      }

      const articles = data.articles
        .filter(article => article.title && article.description)
        .slice(0, 5)
        .map(article => ({
          id: article.url || `article-${Date.now()}-${Math.random()}`,
            title: article.title,
            description: article.description,
          url: article.url || '#',
          publishedAt: article.publishedAt ? 
            new Date(article.publishedAt).toLocaleDateString('fr-FR') : 
            new Date().toLocaleDateString('fr-FR'),
          source: article.source?.name || 'Source inconnue',
            imageUrl: article.urlToImage
          }));
    
      console.log(`✅ ${articles.length} articles traités`);
      return articles;

    } catch (error) {
      console.error('❌ Erreur lors de la recherche d\'actualités:', error);
    return [];
    }
  }
};
// Fonction de tri des élus par note
const getTopRatedElus = (elusList, limit = 5) => {
  return [...elusList]
    .filter(elu => elu.rating) // Filtrer les élus qui ont une note
    .sort((a, b) => b.rating - a.rating) // Trier par note décroissante
    .slice(0, limit); // Limiter le nombre d'élus retournés
};

// Composant pour afficher le classement
const RankingSection = ({ title, elus, setSelectedElu, setCurrentScreen }) => {
  return (
    <div className="ranking-section" style={{
      background: 'rgba(30, 41, 59, 0.5)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '2rem'
    }}>
      <h2 style={{
        color: '#e2e8f0',
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1rem'
      }}>{title}</h2>
      <div className="ranking-list" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {elus.map((elu, index) => (
          <div
            key={elu.id}
            className="ranking-item"
            onClick={() => {
              setSelectedElu(elu);
              setCurrentScreen('profil');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'rgba(30, 41, 59, 0.7)',
              padding: '1rem',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: index === 0 ? '#FCD34D' : index === 1 ? '#94A3B8' : index === 2 ? '#B45309' : '#1E293B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}>
              {index + 1}
            </div>
            <div style={{flex: 1}}>
              <div style={{
                color: '#e2e8f0',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}>{elu.name}</div>
              <div style={{
                color: '#94a3b8',
                fontSize: '0.875rem'
              }}>{elu.poste} {elu.commune ? `de ${elu.commune}` : ''}</div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#FCD34D'
            }}>
              <Star size={20} fill="#FCD34D" />
              <span style={{fontWeight: '600'}}>{elu.rating.toFixed(1)}</span>
              <span style={{color: '#94a3b8', fontSize: '0.875rem'}}>({elu.totalVotes} votes)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Header Component
const Header = ({ title, subtitle, currentScreen, setCurrentScreen, setCurrentTab, children, showMiniNav, changeScreenAndResetSearch }) => {
  return (
    <>
      <div className="header-modern">
        <div className="container">
          <div className="header-nav">
            <div className="header-left">
              <button 
                onClick={() => changeScreenAndResetSearch('home')} 
                className="btn-back-modern"
              >
                <ArrowLeft size={20} />
                Retour
              </button>
              <div className="header-info">
                <h1 className="header-title">{title}</h1>
                <p className="header-subtitle">{subtitle}</p>
              </div>
            </div>
            <div className="header-right">
              {children}
            </div>
          </div>
        </div>
      </div>
      <nav className={`mini-nav ${showMiniNav ? 'visible' : ''}`}>
        <button 
          className={`mini-nav-item ${currentScreen === 'communes' ? 'active' : ''}`}
          onClick={() => changeScreenAndResetSearch('communes', 'communes')}
          data-tooltip="Communes"
        >
          <Building className="mini-nav-icon" />
          <div className="tooltip">Communes</div>
        </button>
        <button 
          className={`mini-nav-item ${currentScreen === 'maires' ? 'active' : ''}`}
          onClick={() => changeScreenAndResetSearch('maires')}
          data-tooltip="Maires"
        >
          <Crown className="mini-nav-icon" />
          <div className="tooltip">Maires</div>
        </button>
        <button 
          className={`mini-nav-item ${currentScreen === 'deputes' ? 'active' : ''}`}
          onClick={() => changeScreenAndResetSearch('deputes')}
          data-tooltip="Députés"
        >
          <Vote className="mini-nav-icon" />
          <div className="tooltip">Députés</div>
        </button>
        <button 
          className={`mini-nav-item ${currentScreen === 'senateurs' ? 'active' : ''}`}
          onClick={() => changeScreenAndResetSearch('senateurs')}
          data-tooltip="Sénateurs"
        >
          <Scale className="mini-nav-icon" />
          <div className="tooltip">Sénateurs</div>
        </button>
        <button 
          className={`mini-nav-item ${currentScreen === 'ctg' ? 'active' : ''}`}
          onClick={() => changeScreenAndResetSearch('ctg')}
          data-tooltip="CTG"
        >
          <Globe2 className="mini-nav-icon" />
          <div className="tooltip">CTG</div>
        </button>
        <button 
          className={`mini-nav-item ${currentScreen === 'popularite' ? 'active' : ''}`}
          onClick={() => changeScreenAndResetSearch('popularite')}
          data-tooltip="Popularité"
        >
          <Star className="mini-nav-icon" />
          <div className="tooltip">Popularité</div>
        </button>
        <button 
          className={`mini-nav-item ${currentScreen === 'education' ? 'active' : ''}`}
          onClick={() => changeScreenAndResetSearch('education')}
          data-tooltip="Éducation"
        >
          <Book className="mini-nav-icon" />
          <div className="tooltip">Éducation</div>
        </button>
      </nav>
    </>
  );
};

function App() {
    // === ÉTATS POUR LA NAVIGATION ===
    const [currentScreen, setCurrentScreen] = useState('communes');
  const [currentTab, setCurrentTab] = useState('communes');
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour changer d'écran et réinitialiser la recherche
  const changeScreenAndResetSearch = (newScreen, newTab = null) => {
    setSearchTerm(''); // Réinitialiser la barre de recherche
    setCurrentScreen(newScreen);
    if (newTab) {
      setCurrentTab(newTab);
    }
    // Scroll vers le haut à chaque changement d'écran
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

    // === ÉTATS POUR LES ÉLUS ET DONNÉES ===
    const [selectedElu, setSelectedElu] = useState(null);
  const [communes, setCommunes] = useState([]);
  const [elus, setElus] = useState([]);
  const [deputes, setDeputes] = useState([]);
  const [senateurs, setSenateurs] = useState([]);
  const [conseillers, setConseillers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importingElus, setImportingElus] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc');

    // === ÉTATS POUR LES AVIS ET MESSAGES ===
    const [messageType, setMessageType] = useState('avis');
    const [message, setMessage] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [avisLocaux, setAvisLocaux] = useState([]);

    // === ÉTATS POUR LES ACTUALITÉS ===
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);

    // === ÉTATS POUR L'AUTHENTIFICATION ===
    const { user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedCommune, setSelectedCommune] = useState(null);
    const [selectedPoste, setSelectedPoste] = useState(null);
    const [showMiniNav, setShowMiniNav] = useState(false);

      // Effet pour gérer la visibilité du mini menu en fonction du défilement
  useEffect(() => {
    const handleScroll = () => {
      const menuBubbleBar = document.querySelector('.menu-bubble-bar');
      if (menuBubbleBar) {
        const menuBubbleBarBottom = menuBubbleBar.getBoundingClientRect().bottom;
        setShowMiniNav(menuBubbleBarBottom < 0);
      }
    };

    // Seulement sur les écrans home et communes
    if (currentScreen === 'home' || currentScreen === 'communes') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setShowMiniNav(false);
    }
  }, [currentScreen]);

  // === FONCTION POUR GÉRER LE SUCCÈS DE L'AUTHENTIFICATION ===
  const handleAuthSuccess = (user) => {
    console.log('✅ Utilisateur connecté:', user.displayName || user.email || 'Anonyme');
    setShowAuthModal(false);
      // Vous pouvez ajouter ici d'autres actions après connexion
    };

  // === FONCTION POUR GÉRER LA DÉCONNEXION ===
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  // Charger les actualités quand on accède au profil d'un élu
  useEffect(() => {
    if (selectedElu && currentScreen === 'profil') {
      fetchEluNews(selectedElu.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedElu, currentScreen]);

  // Les états sont maintenant déclarés au début du composant

  // Fonction pour récupérer les actualités d'un élu
  const fetchEluNews = async (eluName) => {
    setLoadingNews(true);
    try {
      console.log(`📰 Chargement des actualités pour: ${eluName}`);
      const articles = await newsService.getEluNews(eluName, selectedElu?.commune || '');
      setNews(articles);
      console.log(`📰 ${articles.length} actualités chargées`);
    } catch (error) {
      console.error('Erreur lors de la récupération des actualités:', error);
      setNews([]);
    } finally {
      setLoadingNews(false);
    }
  };

  // DONNÉES DES DÉPUTÉS
  const deputesData = [
    {
      id: 'jean-victor-castor',
      name: 'Jean-Victor Castor',
      poste: 'Député',
      circonscription: '1ère circonscription',
      parti: 'MDES',
      groupe: 'Gauche Démocrate et Républicaine',
      mandat: '2024-2029',
      naissance: '21 avril 1962',
      lieu_naissance: 'Sinnamary',
      profession: 'Cadre technique d\'entreprise',
      commission: 'Développement durable',
      description: 'Jean‑Victor Castor, né le 21 avril 1962 à Sinnamary, est le fils d\'enseignants et a suivi des études en chimie avant de rejoindre la Guyane et militer pour le MDES dès la fondation du journal Rot Kozé (1985). Député depuis juin 2022 dans le groupe GDR, il défend une forte autonomie voire indépendance pour la Guyane et milite contre le néocolonialisme français. Il est l\'auteur d\'une proposition de loi en mai 2023 pour abroger l\'obligation vaccinale des soignants, adoptée malgré l\'opposition du gouvernement. En 2023, il a participé à une mission sur l\'aménagement durable du territoire, et en décembre 2023, il a soutenu un amendement augmentant le foncier pour la SAFER de Guyane (125 000–150 000 ha). Il suscite parfois la controverse — notamment suite à un voyage officiel à Bakou pour un forum anti-colonial.',
      rating: 4.1,
      totalVotes: 89,
      questions: [
        {
          id: 'q1-castor',
          type: 'avis',
          text: 'Excellent travail sur les dossiers environnementaux, notamment la protection de la biodiversité guyanaise.',
          author: 'Marie D.',
          likes: 15,
          timestamp: '12/06/2025 14:30'
        }
      ]
    },
    {
      id: 'davy-rimane',
      name: 'Davy Rimane',
      poste: 'Député',
      circonscription: '2ème circonscription',
      parti: 'MDES',
      groupe: 'Gauche Démocrate et Républicaine',
      mandat: '2024-2029',
      naissance: '15 décembre 1979',
      lieu_naissance: 'Kourou',
      profession: 'Technicien',
      commission: 'Affaires étrangères',
      description: 'Davy Rimane, né le 15 décembre 1979 à Kourou, est un technicien chez EDF et ancien syndicaliste (Union des travailleurs guyanais - section énergie). Il a été l\'une des figures marquantes du mouvement social de 2017 ("Pou Lagwiyann Dékolé") et pour ses revendications, il a ensuite rejoint les rangs de la gauche. Élu député en 2022, il s\'inscrit dans le groupe GDR (Gauche Démocrate et Républicaine) à l\'Assemblée. Il préside depuis juin 2023 la Délégation aux outre-mer, mettant l\'accent sur les spécificités du territoire guyanais. Actif localement, il est également conseiller municipal de Kourou. Reconnu pour ses positions sur l\'énergie, l\'immigration et les droits sociaux, il propose des tribunes dans la presse locale.',
      rating: 3.9,
      totalVotes: 76,
      questions: [
        {
          id: 'q1-rimane',
          type: 'avis',
          text: 'Très engagé sur les questions de coopération régionale avec le Brésil et le Suriname.',
          author: 'Jean-Claude M.',
          likes: 12,
          timestamp: '11/06/2025 16:45'
        }
      ]
    }
  ];

  // DONNÉES DES SÉNATEURS
  const senateursData = [
    {
      id: 'georges-patient',
      name: 'Georges Patient',
      poste: 'Sénateur',
      parti: 'Divers gauche',
      mandat: '2023-2032',
      mandats_precedents: '2008-2023',
      fonction_speciale: 'Vice-président Parc naturel régional',
      rating: 4.0,
      totalVotes: 125,
      questions: [
        {
          id: 'q1-patient',
          type: 'avis',
          text: 'Une figure emblématique qui défend bien les intérêts de la Guyane au Sénat depuis de nombreuses années.',
          author: 'Anonyme',
          likes: 23,
          timestamp: '13/06/2025 11:20'
        }
      ]
    },
    {
      id: 'marie-laure-phinera-horth',
      name: 'Marie-Laure Phinéra-Horth',
      poste: 'Sénateur',
      parti: 'RDPI',
      mandat: '2020-2029',
      naissance: '28 juin 1957',
      profession: 'Orthophoniste',
      ancienne_fonction: 'Maire de Cayenne (2010-2020)',
      particularite: 'Première femme sénatrice de Guyane',
      rating: 3.8,
      totalVotes: 94,
      questions: [
        {
          id: 'q1-phinera',
          type: 'avis',
          text: 'Son expérience en tant qu\'ancienne maire de Cayenne apporte une vraie plus-value au Sénat.',
          author: 'Paul R.',
          likes: 16,
          timestamp: '12/06/2025 10:30'
        }
      ]
    }
  ];

  // DONNÉES DES CONSEILLERS TERRITORIAUX
  // DONNÉES DES CONSEILLERS TERRITORIAUX (55 CONSEILLERS)
  const conseillersTerritoriaux = [
    // === BUREAU EXÉCUTIF ===
    {
      id: 'gabriel-serville',
      name: 'Gabriel Serville',
      poste: 'Président CTG',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      fonction: 'Président de l\'Assemblée de Guyane',
      rating: 4.2,
      totalVotes: 156,
      questions: [
        {
          id: 'q1-serville',
          type: 'avis',
          text: 'Leadership fort pour porter les revendications guyanaises et l\'autonomie progressive.',
          author: 'Martine S.',
          likes: 28,
          timestamp: '14/06/2025 15:45'
        }
      ]
    },
    {
      id: 'jean-paul-fereira',
      name: 'Jean-Paul Fereira',
      poste: '1er Vice-Président CTG',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Développement durable et transition énergétique',
      rating: 3.7,
      totalVotes: 78,
      questions: []
    },
    {
      id: 'sophie-charles',
      name: 'Sophie Charles',
      poste: '2ème Vice-Présidente CTG',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Éducation et constructions scolaires',
      rating: 3.9,
      totalVotes: 82,
      questions: []
    },
    {
      id: 'rodolphe-alexandre',
      name: 'Rodolphe Alexandre',
      poste: '3ème Vice-Président CTG',
      parti: 'PSG',
      mandat: '2021-2027',
      delegation: 'Europe, affaires institutionnelles, égalité',
      rating: 3.5,
      totalVotes: 65,
      ancienne_fonction: 'Ancien Président CTG (2015-2021)',
      questions: []
    },
    {
      id: 'marie-laure-phinera-horth',
      name: 'Marie-Laure Phinéra-Horth',
      poste: '4ème Vice-Présidente CTG',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Santé et action sociale',
      rating: 4.0,
      totalVotes: 94,
      ancienne_fonction: 'Ancienne Maire de Cayenne',
      questions: []
    },

    // === CONSEILLERS TERRITORIAUX - MAJORITÉ GUYANE KONTRÉ ===
    {
      id: 'david-chollet',
      name: 'David Chollet',
      poste: 'Conseiller Territorial',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Sports et jeunesse',
      rating: 3.6,
      totalVotes: 42,
      questions: []
    },
    {
      id: 'anita-sup',
      name: 'Anita Sup',
      poste: 'Conseillère Territoriale',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Culture et patrimoine',
      rating: 3.8,
      totalVotes: 56,
      questions: []
    },
    {
      id: 'alain-tien-liong',
      name: 'Alain Tien-Liong',
      poste: 'Conseiller Territorial',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Agriculture et forêt',
      rating: 3.7,
      totalVotes: 48,
      questions: []
    },
    {
      id: 'christiane-taubira-delannon',
      name: 'Christiane Taubira-Delannon',
      poste: 'Conseillère Territoriale',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Justice et droits humains',
      rating: 4.3,
      totalVotes: 189,
      ancienne_fonction: 'Ancienne Garde des Sceaux',
      questions: []
    },
    {
      id: 'michel-jouan',
      name: 'Michel Jouan',
      poste: 'Conseiller Territorial',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Transports et infrastructures',
      rating: 3.5,
      totalVotes: 38,
      questions: []
    },
    {
      id: 'fabienne-mathurin',
      name: 'Fabienne Mathurin',
      poste: 'Conseillère Territoriale',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Égalité femmes-hommes',
      rating: 3.9,
      totalVotes: 67,
      questions: []
    },
    {
      id: 'guillaume-berthier',
      name: 'Guillaume Berthier',
      poste: 'Conseiller Territorial',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Numérique et innovation',
      rating: 3.6,
      totalVotes: 44,
      questions: []
    },
    {
      id: 'nadine-ladrezeau',
      name: 'Nadine Ladrezeau',
      poste: 'Conseillère Territoriale',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Coopération régionale',
      rating: 3.7,
      totalVotes: 52,
      questions: []
    },
    {
      id: 'patrick-sacomani',
      name: 'Patrick Sacomani',
      poste: 'Conseiller Territorial',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Tourisme',
      rating: 3.4,
      totalVotes: 35,
      questions: []
    },
    {
      id: 'veronique-kancel',
      name: 'Véronique Kancel',
      poste: 'Conseillère Territoriale',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Formation professionnelle',
      rating: 3.8,
      totalVotes: 59,
      questions: []
    },
    {
      id: 'jean-claude-ringuet',
      name: 'Jean-Claude Ringuet',
      poste: 'Conseiller Territorial',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Économie sociale et solidaire',
      rating: 3.7,
      totalVotes: 47,
      questions: []
    },
    {
      id: 'marie-josephe-gauvin',
      name: 'Marie-Josèphe Gauvin',
      poste: 'Conseillère Territoriale',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Personnes âgées',
      rating: 3.9,
      totalVotes: 71,
      questions: []
    },
    {
      id: 'bruno-nestor-azerot',
      name: 'Bruno Nestor Azérot',
      poste: 'Conseiller Territorial',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Aviation civile',
      rating: 3.6,
      totalVotes: 43,
      questions: []
    },
    {
      id: 'claire-lemoult',
      name: 'Claire Lemoult',
      poste: 'Conseillère Territoriale',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Insertion et emploi',
      rating: 3.5,
      totalVotes: 39,
      questions: []
    },
    {
      id: 'jean-claude-dorcy',
      name: 'Jean-Claude Dorcy',
      poste: 'Conseiller Territorial',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Logement',
      rating: 3.4,
      totalVotes: 36,
      questions: []
    },
    {
      id: 'sandrine-bernard',
      name: 'Sandrine Bernard',
      poste: 'Conseillère Territoriale',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Politique de la ville',
      rating: 3.8,
      totalVotes: 61,
      questions: []
    },
    {
      id: 'joseph-aidara',
      name: 'Joseph Aidara',
      poste: 'Conseiller Territorial',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Relations internationales',
      rating: 3.6,
      totalVotes: 45,
      questions: []
    },
    {
      id: 'michele-lapompe-paironne',
      name: 'Michèle Lapompe-Paironne',
      poste: 'Conseillère Territoriale',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Petite enfance',
      rating: 3.9,
      totalVotes: 68,
      questions: []
    },
    {
      id: 'patrick-lecante',
      name: 'Patrick Lecante',
      poste: 'Conseiller Territorial',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Recherche spatiale',
      rating: 3.7,
      totalVotes: 54,
      questions: []
    },
    {
      id: 'anne-marie-gabriel',
      name: 'Anne-Marie Gabriel',
      poste: 'Conseillère Territoriale',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Handicap',
      rating: 3.8,
      totalVotes: 58,
      questions: []
    },
    {
      id: 'claude-suzanne',
      name: 'Claude Suzanne',
      poste: 'Conseiller Territorial',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Environnement',
      rating: 3.5,
      totalVotes: 41,
      questions: []
    },
    {
      id: 'francine-cayol',
      name: 'Francine Cayol',
      poste: 'Conseillère Territoriale',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Communication',
      rating: 3.6,
      totalVotes: 46,
      questions: []
    },
    {
      id: 'thierry-joly',
      name: 'Thierry Joly',
      poste: 'Conseiller Territorial',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Sécurité',
      rating: 3.4,
      totalVotes: 37,
      questions: []
    },
    {
      id: 'patricia-adler',
      name: 'Patricia Adler',
      poste: 'Conseillère Territoriale',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Artisanat',
      rating: 3.7,
      totalVotes: 49,
      questions: []
    },
    {
      id: 'marc-antoine-javouhey',
      name: 'Marc-Antoine Javouhey',
      poste: 'Conseiller Territorial',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Fiscalité locale',
      rating: 3.3,
      totalVotes: 32,
      questions: []
    },
    {
      id: 'christine-pires-beaune',
      name: 'Christine Pires-Beaune',
      poste: 'Conseillère Territoriale',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Énergie',
      rating: 3.8,
      totalVotes: 63,
      questions: []
    },
    {
      id: 'jerome-joliot',
      name: 'Jérôme Joliot',
      poste: 'Conseiller Territorial',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Mines et géologie',
      rating: 3.5,
      totalVotes: 40,
      questions: []
    },
    {
      id: 'martine-lamon',
      name: 'Martine Lamon',
      poste: 'Conseillère Territoriale',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Pêche',
      rating: 3.6,
      totalVotes: 47,
      questions: []
    },
    {
      id: 'paul-dolmaire',
      name: 'Paul Dolmaire',
      poste: 'Conseiller Territorial',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Élevage',
      rating: 3.4,
      totalVotes: 38,
      questions: []
    },
    {
      id: 'sylvie-bruno',
      name: 'Sylvie Bruno',
      poste: 'Conseillère Territoriale',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Coopération Suriname-Brésil',
      rating: 3.7,
      totalVotes: 51,
      questions: []
    },
    {
      id: 'jacques-martial',
      name: 'Jacques Martial',
      poste: 'Conseiller Territorial',
      parti: 'Guyane kontré',
      mandat: '2021-2027',
      delegation: 'Ports et littoral',
      rating: 3.8,
      totalVotes: 56,
      questions: []
    },

    // === OPPOSITION - UNIS ET ENGAGÉS POUR LE TERRITOIRE ===
    {
      id: 'antoine-karam',
      name: 'Antoine Karam',
      poste: 'Conseiller Territorial',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Finances',
      rating: 3.2,
      totalVotes: 34,
      questions: []
    },
    {
      id: 'marie-claire-penchard',
      name: 'Marie-Claire Penchard',
      poste: 'Conseillère Territoriale',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Social',
      rating: 3.3,
      totalVotes: 29,
      questions: []
    },
    {
      id: 'daniel-fereira',
      name: 'Daniel Fereira',
      poste: 'Conseiller Territorial',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Agriculture',
      rating: 3.1,
      totalVotes: 27,
      questions: []
    },
    {
      id: 'francette-eboue',
      name: 'Francette Eboué',
      poste: 'Conseillère Territoriale',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Éducation',
      rating: 3.4,
      totalVotes: 31,
      questions: []
    },
    {
      id: 'claude-pericard',
      name: 'Claude Péricard',
      poste: 'Conseiller Territorial',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Économie',
      rating: 3.0,
      totalVotes: 25,
      questions: []
    },
    {
      id: 'nathalie-bicep',
      name: 'Nathalie Bicep',
      poste: 'Conseillère Territoriale',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Culture',
      rating: 3.2,
      totalVotes: 28,
      questions: []
    },
    {
      id: 'raymond-tarcy',
      name: 'Raymond Tarcy',
      poste: 'Conseiller Territorial',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Transports',
      rating: 3.1,
      totalVotes: 26,
      questions: []
    },
    {
      id: 'isabelle-joachim',
      name: 'Isabelle Joachim',
      poste: 'Conseillère Territoriale',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Santé',
      rating: 3.3,
      totalVotes: 30,
      questions: []
    },
    {
      id: 'henri-marianne',
      name: 'Henri Marianne',
      poste: 'Conseiller Territorial',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Sécurité',
      rating: 2.9,
      totalVotes: 24,
      questions: []
    },
    {
      id: 'corinne-mentia',
      name: 'Corinne Mentïa',
      poste: 'Conseillère Territoriale',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Jeunesse',
      rating: 3.2,
      totalVotes: 29,
      questions: []
    },
    {
      id: 'jean-louis-robinson',
      name: 'Jean-Louis Robinson',
      poste: 'Conseiller Territorial',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Tourisme',
      rating: 3.0,
      totalVotes: 26,
      questions: []
    },
    {
      id: 'brigitte-cabal',
      name: 'Brigitte Cabal',
      poste: 'Conseillère Territoriale',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Logement',
      rating: 3.1,
      totalVotes: 27,
      questions: []
    },
    {
      id: 'franck-rinaldo',
      name: 'Franck Rinaldo',
      poste: 'Conseiller Territorial',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Environnement',
      rating: 3.3,
      totalVotes: 31,
      questions: []
    },
    {
      id: 'michele-agenor',
      name: 'Michèle Agénor',
      poste: 'Conseillère Territoriale',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Égalité',
      rating: 3.2,
      totalVotes: 28,
      questions: []
    },
    {
      id: 'philippe-gustave',
      name: 'Philippe Gustave',
      poste: 'Conseiller Territorial',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Sports',
      rating: 3.1,
      totalVotes: 27,
      questions: []
    },
    {
      id: 'nadia-laruelle',
      name: 'Nadia Laruelle',
      poste: 'Conseillère Territoriale',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Formation',
      rating: 3.0,
      totalVotes: 25,
      questions: []
    },
    {
      id: 'christophe-bouillon',
      name: 'Christophe Bouillon',
      poste: 'Conseiller Territorial',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Spatial',
      rating: 3.4,
      totalVotes: 33,
      questions: []
    },
    {
      id: 'pascale-bernadin',
      name: 'Pascale Bernadin',
      poste: 'Conseillère Territoriale',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Handicap',
      rating: 3.2,
      totalVotes: 28,
      questions: []
    },
    {
      id: 'marcel-pierre',
      name: 'Marcel Pierre',
      poste: 'Conseiller Territorial',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Territoires',
      rating: 3.3,
      totalVotes: 30,
      questions: []
    },
    {
      id: 'sylviane-delaunay',
      name: 'Sylviane Delaunay',
      poste: 'Conseillère Territoriale',
      parti: 'Unis et engagés',
      mandat: '2021-2027',
      delegation: 'Opposition - Europe',
      rating: 3.1,
      totalVotes: 26,
      questions: []
    }
  ];// DONNÉES DES COMMUNES
  const communesIntegrees = [
    { id: 'cayenne', name: 'Cayenne', population: 61550, description: 'Capitale et préfecture 🏛️', region: 'Île de Cayenne' },
    { id: 'saint-laurent-du-maroni', name: 'Saint-Laurent-du-Maroni', population: 47621, description: 'Sous-préfecture de l\'Ouest', region: 'Ouest guyanais' },
    { id: 'matoury', name: 'Matoury', population: 32942, description: 'Aéroport Félix Eboué ✈️', region: 'Île de Cayenne' },
    { id: 'remire-montjoly', name: 'Rémire-Montjoly', population: 26143, description: 'Plages et nature 🏖️', region: 'Île de Cayenne' },
    { id: 'kourou', name: 'Kourou', population: 25892, description: 'Centre Spatial Guyanais 🚀', region: 'Centre littoral' },
    { id: 'macouria', name: 'Macouria', population: 12783, description: 'Développement économique', region: 'Île de Cayenne' },
    { id: 'maripasoula', name: 'Maripasoula', population: 12035, description: 'Cœur de l\'Amazonie 🌳', region: 'Haut-Maroni' },
    { id: 'mana', name: 'Mana', population: 10275, description: 'Plages de ponte des tortues 🐢', region: 'Ouest guyanais' },
    { id: 'apatou', name: 'Apatou', population: 8509, description: 'Confluent Maroni-Lawa', region: 'Haut-Maroni' },
    { id: 'papaichton', name: 'Papaichton', population: 7365, description: 'Haut-Maroni', region: 'Haut-Maroni' },
    { id: 'grand-santi', name: 'Grand-Santi', population: 6001, description: 'Territoire Bushinenge', region: 'Haut-Maroni' },
    { id: 'saint-georges', name: 'Saint-Georges', population: 4047, description: 'Frontière avec le Brésil 🇧🇷', region: 'Est guyanais' },
    { id: 'roura', name: 'Roura', population: 3713, description: 'Montagnes et cascades 🏔️', region: 'Sud' },
    { id: 'sinnamary', name: 'Sinnamary', population: 2892, description: 'Patrimoine et nature', region: 'Centre littoral' },
    { id: 'montsinery-tonnegrande', name: 'Montsinéry-Tonnegrande', population: 2826, description: 'Agriculture et élevage 🐄', region: 'Centre' },
    { id: 'iracoubo', name: 'Iracoubo', population: 1982, description: 'Héritage historique', region: 'Centre littoral' },
    { id: 'camopi', name: 'Camopi', population: 1964, description: 'Vallée de l\'Oyapock', region: 'Est guyanais' },
    { id: 'awala-yalimapo', name: 'Awala-Yalimapo', population: 1379, description: 'Réserve naturelle amérindienne 🌿', region: 'Ouest guyanais' },
    { id: 'regina', name: 'Régina', population: 966, description: 'Porte de l\'Est guyanais', region: 'Est guyanais' },
    { id: 'saint-elie', name: 'Saint-Élie', population: 573, description: 'Forêt primaire préservée 🌲', region: 'Centre forêt' },
    { id: 'ouanary', name: 'Ouanary', population: 216, description: 'Embouchure de l\'Oyapock', region: 'Est guyanais' },
    { id: 'saul', name: 'Saül', population: 149, description: 'Village d\'orpaillage isolé ⛏️', region: 'Centre forêt' }
  ];



  // DONNÉES RÉELLES DES ÉLUS LOCAUX - MAIRES ACTUELS 2025
  const allElusData = [
    // ===== MAIRES ACTUELS DES 22 COMMUNES =====
    
    // CAYENNE - Capitale
    { 
      id: 'marie-laure-phinera-horth-maire', 
      name: 'Marie-Laure Phinéra-Horth', 
      commune: 'Cayenne',
      poste: 'Maire',
      status: 'actuel',
      rating: 4.1, 
      totalVotes: 189, 
      parti: 'RDPI', 
      mandat: '2020-2026',
      profession: 'Orthophoniste',
      particularite: 'Ancienne sénatrice, première femme maire de Cayenne',
      questions: [
        {
          id: 'q1-phinera-maire',
          type: 'avis',
          text: 'Excellente gestion de la capitale, beaucoup de projets urbains réalisés.',
          author: 'Citoyen Cayennais',
          likes: 24,
          timestamp: '13/06/2025 16:30'
        }
      ]
    },

    // SAINT-LAURENT-DU-MARONI
    { 
      id: 'sophie-charles-maire', 
      name: 'Sophie Charles', 
      commune: 'Saint-Laurent-du-Maroni', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.8, 
      totalVotes: 134, 
      parti: 'Guyane kontré', 
      mandat: '2020-2026',
      profession: 'Cadre territorial',
      particularite: 'Vice-Présidente CTG Éducation',
      questions: []
    },

    // KOUROU - Centre Spatial
    { 
      id: 'francois-ringuet-maire', 
      name: 'François Ringuet', 
      commune: 'Kourou', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 4.0, 
      totalVotes: 156, 
      parti: 'DVG', 
      mandat: '2020-2026',
      profession: 'Ingénieur',
      particularite: 'Ville du Centre Spatial Guyanais',
      questions: []
    },

    // MATOURY
    { 
      id: 'serge-smock-maire', 
      name: 'Serge Smock', 
      commune: 'Matoury', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.9, 
      totalVotes: 128, 
      parti: 'DVG', 
      mandat: '2020-2026',
      profession: 'Cadre',
      questions: []
    },

    // RÉMIRE-MONTJOLY
    { 
      id: 'jean-ganty-maire', 
      name: 'Jean Ganty', 
      commune: 'Rémire-Montjoly', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.7, 
      totalVotes: 98, 
      parti: 'DVD', 
      mandat: '2020-2026',
      questions: []
    },

    // MACOURIA
    { 
      id: 'gilles-adelson-maire', 
      name: 'Gilles Adelson', 
      commune: 'Macouria', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.6, 
      totalVotes: 87, 
      parti: 'DVG', 
      mandat: '2020-2026',
      questions: []
    },

    // MARIPASOULA
    { 
      id: 'serge-anelli-maire', 
      name: 'Serge Anelli', 
      commune: 'Maripasoula', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.8, 
      totalVotes: 76, 
      parti: 'DVG', 
      mandat: '2020-2026',
      particularite: 'Plus grande commune de France par superficie',
      questions: []
    },

    // MANA
    { 
      id: 'alberic-benth-maire', 
      name: 'Albéric Yolande Benth', 
      commune: 'Mana', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.5, 
      totalVotes: 68, 
      parti: 'DVG', 
      mandat: '2020-2026',
      questions: []
    },

    // APATOU
    { 
      id: 'paul-dolianki-maire', 
      name: 'Paul Dolianki', 
      commune: 'Apatou', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.4, 
      totalVotes: 59, 
      parti: 'DVG', 
      mandat: '2020-2026',
      questions: []
    },

    // PAPAICHTON
    { 
      id: 'jules-deie-maire', 
      name: 'Jules Deie', 
      commune: 'Papaichton', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.6, 
      totalVotes: 52, 
      parti: 'DVG', 
      mandat: '2020-2026',
      questions: []
    },

    // GRAND-SANTI
    { 
      id: 'felix-dada-maire', 
      name: 'Felix Dada', 
      commune: 'Grand-Santi', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.3, 
      totalVotes: 45, 
      parti: 'DVG', 
      mandat: '2020-2026',
      questions: []
    },

    // SAINT-GEORGES
    { 
      id: 'georges-elfort-maire', 
      name: 'Georges Elfort', 
      commune: 'Saint-Georges', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.7, 
      totalVotes: 48, 
      parti: 'DVG', 
      mandat: '2020-2026',
      particularite: 'Frontière avec le Brésil',
      questions: []
    },

    // ROURA
    { 
      id: 'david-riche-maire', 
      name: 'David Riche', 
      commune: 'Roura', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.5, 
      totalVotes: 41, 
      parti: 'DVG', 
      mandat: '2020-2026',
      questions: []
    },

    // SINNAMARY
    { 
      id: 'michel-ange-jeremie-maire', 
      name: 'Michel-Ange Jérémie', 
      commune: 'Sinnamary', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.6, 
      totalVotes: 38, 
      parti: 'DVG', 
      mandat: '2020-2026',
      questions: []
    },

    // MONTSINÉRY-TONNEGRANDE
    { 
      id: 'patrick-lecante-maire', 
      name: 'Patrick Lecante', 
      commune: 'Montsinéry-Tonnegrande', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.4, 
      totalVotes: 35, 
      parti: 'DVG', 
      mandat: '2020-2026',
      questions: []
    },

    // IRACOUBO
    { 
      id: 'cornelie-sellali-maire', 
      name: 'Cornélie Sellali Bois-Blanc', 
      commune: 'Iracoubo', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.3, 
      totalVotes: 32, 
      parti: 'DVG', 
      mandat: '2020-2026',
      questions: []
    },

    // CAMOPI
    { 
      id: 'laurent-yawalou-maire', 
      name: 'Laurent Yawalou', 
      commune: 'Camopi', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.5, 
      totalVotes: 29, 
      parti: 'DVG', 
      mandat: '2020-2026',
      particularite: 'Territoire amérindien Wayampi',
      questions: []
    },

    // AWALA-YALIMAPO
    { 
      id: 'jean-paul-fereira-maire', 
      name: 'Jean-Paul Fereira', 
      commune: 'Awala-Yalimapo', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.8, 
      totalVotes: 27, 
      parti: 'Guyane kontré', 
      mandat: '2020-2026',
      particularite: '1er Vice-Président CTG, Réserve naturelle Kaw-Roura',
      questions: []
    },

    // RÉGINA
    { 
      id: 'pierre-desert-maire', 
      name: 'Pierre Désert', 
      commune: 'Régina', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.4, 
      totalVotes: 24, 
      parti: 'DVG', 
      mandat: '2020-2026',
      questions: []
    },

    // SAINT-ÉLIE
    { 
      id: 'veronique-jacaria-maire', 
      name: 'Véronique Jacaria', 
      commune: 'Saint-Élie', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.6, 
      totalVotes: 18, 
      parti: 'DVG', 
      mandat: '2020-2026',
      questions: []
    },

    // OUANARY
    { 
      id: 'narcisse-roze-maire', 
      name: 'Narcisse Roze', 
      commune: 'Ouanary', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.2, 
      totalVotes: 14, 
      parti: 'DVG', 
      mandat: '2020-2026',
      particularite: 'Plus petite commune de Guyane',
      questions: []
    },

    // SAÜL
    { 
      id: 'marie-helene-charles-maire', 
      name: 'Marie-Hélène Charles', 
      commune: 'Saül', 
      poste: 'Maire', 
      status: 'actuel', 
      rating: 3.7, 
      totalVotes: 12, 
      parti: 'DVG', 
      mandat: '2020-2026',
      particularite: 'Village isolé accessible uniquement par avion',
      questions: []
    },

    // ===== ADJOINTS AU MAIRE - PRINCIPALES COMMUNES =====

    // CAYENNE - Adjoints
    { 
      id: 'olivier-goudet-adjoint', 
      name: 'Olivier Goudet', 
      commune: 'Cayenne', 
      poste: 'Adjoints au Maire', 
      status: 'actuel', 
      rating: 3.7, 
      totalVotes: 67, 
      parti: 'RDPI', 
      mandat: '2020-2026', 
      fonction: '1er Adjoint - Urbanisme',
      questions: []
    },
    { 
      id: 'patricia-coppet-adjoint', 
      name: 'Patricia Coppet', 
      commune: 'Cayenne', 
      poste: 'Adjoints au Maire', 
      status: 'actuel', 
      rating: 3.6, 
      totalVotes: 54, 
      parti: 'RDPI', 
      mandat: '2020-2026', 
      fonction: '2ème Adjointe - Social',
      questions: []
    },
    { 
      id: 'jean-claude-ringuet-adjoint', 
      name: 'Jean-Claude Ringuet', 
      commune: 'Cayenne', 
      poste: 'Adjoints au Maire', 
      status: 'actuel', 
      rating: 3.5, 
      totalVotes: 48, 
      parti: 'RDPI', 
      mandat: '2020-2026', 
      fonction: '3ème Adjoint - Sports',
      questions: []
    },

    // SAINT-LAURENT-DU-MARONI - Adjoints
    { 
      id: 'michele-lapompe-adjoint-slm', 
      name: 'Michèle Lapompe-Paironne', 
      commune: 'Saint-Laurent-du-Maroni', 
      poste: 'Adjoints au Maire', 
      status: 'actuel', 
      rating: 3.6, 
      totalVotes: 43, 
      parti: 'Guyane kontré', 
      mandat: '2020-2026', 
      fonction: '1ère Adjointe - Éducation',
      questions: []
    },
    { 
      id: 'david-chollet-adjoint', 
      name: 'David Chollet', 
      commune: 'Saint-Laurent-du-Maroni', 
      poste: 'Adjoints au Maire', 
      status: 'actuel', 
      rating: 3.4, 
      totalVotes: 38, 
      parti: 'Guyane kontré', 
      mandat: '2020-2026', 
      fonction: '2ème Adjoint - Culture',
      questions: []
    },

    // KOUROU - Adjoints
    { 
      id: 'anne-marie-gabriel-adjoint', 
      name: 'Anne-Marie Gabriel', 
      commune: 'Kourou', 
      poste: 'Adjoints au Maire', 
      status: 'actuel', 
      rating: 3.7, 
      totalVotes: 52, 
      parti: 'DVG', 
      mandat: '2020-2026', 
      fonction: '1ère Adjointe - Environnement',
      questions: []
    },
    { 
      id: 'patrick-lecante-adjoint', 
      name: 'Patrick Lecante', 
      commune: 'Kourou', 
      poste: 'Adjoints au Maire', 
      status: 'actuel', 
      rating: 3.8, 
      totalVotes: 49, 
      parti: 'DVG', 
      mandat: '2020-2026', 
      fonction: '2ème Adjoint - Spatial',
      questions: []
    },

    // MATOURY - Adjoints
    { 
      id: 'bruno-nestor-azerot-adjoint', 
      name: 'Bruno Nestor Azérot', 
      commune: 'Matoury', 
      poste: 'Adjoints au Maire', 
      status: 'actuel', 
      rating: 3.6, 
      totalVotes: 44, 
      parti: 'DVG', 
      mandat: '2020-2026', 
      fonction: '1er Adjoint - Travaux',
      questions: []
    },

    // RÉMIRE-MONTJOLY - Adjoints
    { 
      id: 'remy-cabeca-adjoint', 
      name: 'Rémy Cabeca', 
      commune: 'Rémire-Montjoly', 
      poste: 'Adjoints au Maire', 
      status: 'actuel', 
      rating: 3.5, 
      totalVotes: 41, 
      parti: 'DVD', 
      mandat: '2020-2026', 
      fonction: '1er Adjoint - Tourisme',
      questions: []
    },

    // ===== CONSEILLERS MUNICIPAUX - ÉCHANTILLON =====

    // CAYENNE - Conseillers
    { 
      id: 'claude-suzanne-conseiller', 
      name: 'Claude Suzanne', 
      commune: 'Cayenne', 
      poste: 'Conseillers Municipaux', 
      status: 'actuel', 
      rating: 3.5, 
      totalVotes: 35, 
      parti: 'RDPI', 
      mandat: '2020-2026',
      questions: []
    },
    { 
      id: 'marie-france-baudot-conseiller', 
      name: 'Marie-France Baudot', 
      commune: 'Cayenne', 
      poste: 'Conseillers Municipaux', 
      status: 'actuel', 
      rating: 3.4, 
      totalVotes: 32, 
      parti: 'RDPI', 
      mandat: '2020-2026',
      questions: []
    },
    { 
      id: 'jean-francois-ramonatxo-conseiller', 
      name: 'Jean-François Ramonatxo', 
      commune: 'Cayenne', 
      poste: 'Conseillers Municipaux', 
      status: 'actuel', 
      rating: 3.6, 
      totalVotes: 38, 
      parti: 'RDPI', 
      mandat: '2020-2026',
      questions: []
    },

    // SAINT-LAURENT-DU-MARONI - Conseillers
    { 
      id: 'sandrine-bernard-conseiller', 
      name: 'Sandrine Bernard', 
      commune: 'Saint-Laurent-du-Maroni', 
      poste: 'Conseillers Municipaux', 
      status: 'actuel', 
      rating: 3.4, 
      totalVotes: 28, 
      parti: 'Guyane kontré', 
      mandat: '2020-2026',
      questions: []
    },
    { 
      id: 'joseph-aidara-conseiller', 
      name: 'Joseph Aidara', 
      commune: 'Saint-Laurent-du-Maroni', 
      poste: 'Conseillers Municipaux', 
      status: 'actuel', 
      rating: 3.3, 
      totalVotes: 26, 
      parti: 'Guyane kontré', 
      mandat: '2020-2026',
      questions: []
    },

    // KOUROU - Conseillers
    { 
      id: 'patricia-adler-conseiller', 
      name: 'Patricia Adler', 
      commune: 'Kourou', 
      poste: 'Conseillers Municipaux', 
      status: 'actuel', 
      rating: 3.7, 
      totalVotes: 39, 
      parti: 'DVG', 
      mandat: '2020-2026',
      questions: []
    },
    { 
      id: 'thierry-joly-conseiller', 
      name: 'Thierry Joly', 
      commune: 'Kourou', 
      poste: 'Conseillers Municipaux', 
      status: 'actuel', 
      rating: 3.5, 
      totalVotes: 34, 
      parti: 'DVG', 
      mandat: '2020-2026',
      questions: []
    },

    // ===== CONSEILLERS INTERCOMMUNAUX =====

    // CACL (Communauté d'Agglomération du Centre Littoral)
    { 
      id: 'jacques-martial-intercommunal', 
      name: 'Jacques Martial', 
      commune: 'Cayenne', 
      poste: 'Conseillers Intercommunaux', 
      status: 'actuel', 
      rating: 3.8, 
      totalVotes: 56, 
      parti: 'RDPI', 
      mandat: '2020-2026', 
      intercommunalite: 'CACL',
      questions: []
    },
    { 
      id: 'sylvie-bruno-intercommunal', 
      name: 'Sylvie Bruno', 
      commune: 'Kourou', 
      poste: 'Conseillers Intercommunaux', 
      status: 'actuel', 
      rating: 3.6, 
      totalVotes: 44, 
      parti: 'DVG', 
      mandat: '2020-2026', 
      intercommunalite: 'CACL',
      questions: []
    },

    // CCOG (Communauté de Communes de l'Ouest Guyanais)
    { 
      id: 'francine-cayol-intercommunal', 
      name: 'Francine Cayol', 
      commune: 'Saint-Laurent-du-Maroni', 
      poste: 'Conseillers Intercommunaux', 
      status: 'actuel', 
      rating: 3.5, 
      totalVotes: 38, 
      parti: 'Guyane kontré', 
      mandat: '2020-2026', 
      intercommunalite: 'CCOG',
      questions: []
    },
    { 
      id: 'paul-dolmaire-intercommunal', 
      name: 'Paul Dolmaire', 
      commune: 'Mana', 
      poste: 'Conseillers Intercommunaux', 
      status: 'actuel', 
      rating: 3.4, 
      totalVotes: 32, 
      parti: 'DVG', 
      mandat: '2020-2026', 
      intercommunalite: 'CCOG',
      questions: []
    }
  ];
// ADJOINTS AU MAIRE COMPLETS - TOUTES LES 22 COMMUNES DE GUYANE 2025
const adjointsComplets = [
    
  // ===== CAYENNE - 14 ADJOINTS (d'après site officiel) =====
  { 
    id: 'christian-faubert-adjoint', 
    name: 'Christian Faubert', 
    commune: 'Cayenne', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.8, 
    totalVotes: 67, 
    parti: 'NFG', 
    mandat: '2020-2026', 
    fonction: '1er Adjoint - Délégué au Sport',
    questions: []
  },
  { 
    id: 'liliane-louis-marie-adjoint', 
    name: 'Liliane Louis-Marie', 
    commune: 'Cayenne', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.7, 
    totalVotes: 54, 
    parti: 'NFG', 
    mandat: '2020-2026', 
    fonction: '2ème Adjointe - Enfance et Famille',
    questions: []
  },
  { 
    id: 'jean-marc-ambroise-adjoint', 
    name: 'Jean-Marc Ambroise', 
    commune: 'Cayenne', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.6, 
    totalVotes: 48, 
    parti: 'NFG', 
    mandat: '2020-2026', 
    fonction: '3ème Adjoint - Politique de la Ville',
    questions: []
  },
  { 
    id: 'helene-paul-adjoint', 
    name: 'Hélène Paul', 
    commune: 'Cayenne', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.5, 
    totalVotes: 45, 
    parti: 'NFG', 
    mandat: '2020-2026', 
    fonction: '4ème Adjointe - Attractivités Centre-Ville',
    questions: []
  },
  { 
    id: 'alex-alexandre-adjoint', 
    name: 'Alex Alexandre', 
    commune: 'Cayenne', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.4, 
    totalVotes: 42, 
    parti: 'NFG', 
    mandat: '2020-2026', 
    fonction: '5ème Adjoint - Aménagement du Territoire',
    questions: []
  },
  { 
    id: 'gisele-jean-louis-adjoint', 
    name: 'Gisèle Jean-Louis', 
    commune: 'Cayenne', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.6, 
    totalVotes: 49, 
    parti: 'NFG', 
    mandat: '2020-2026', 
    fonction: '6ème Adjointe - Relations Publiques',
    questions: []
  },
  { 
    id: 'axel-rino-adjoint', 
    name: 'Axel Rino', 
    commune: 'Cayenne', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.5, 
    totalVotes: 44, 
    parti: 'NFG', 
    mandat: '2020-2026', 
    fonction: '7ème Adjoint - Prévention et Sécurité',
    questions: []
  },
  { 
    id: 'dominique-bertoni-adjoint', 
    name: 'Dominique Bertoni', 
    commune: 'Cayenne', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.7, 
    totalVotes: 51, 
    parti: 'NFG', 
    mandat: '2020-2026', 
    fonction: '8ème Adjointe - Écologie Urbaine',
    questions: []
  },

  // ===== SAINT-LAURENT-DU-MARONI - 12 ADJOINTS =====
  { 
    id: 'mickle-papayo-adjoint', 
    name: 'Mickle Papayo', 
    commune: 'Saint-Laurent-du-Maroni', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.9, 
    totalVotes: 78, 
    parti: 'Guyane kontré', 
    mandat: '2020-2026', 
    fonction: '1er Adjoint - Administration générale',
    questions: []
  },
  { 
    id: 'benedicte-fjeke-adjoint', 
    name: 'Bénédicte Fjeke', 
    commune: 'Saint-Laurent-du-Maroni', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.6, 
    totalVotes: 64, 
    parti: 'Guyane kontré', 
    mandat: '2020-2026', 
    fonction: '2ème Adjointe - Affaires sociales',
    questions: []
  },
  { 
    id: 'manuel-jean-baptiste-adjoint', 
    name: 'Manuel Jean-Baptiste', 
    commune: 'Saint-Laurent-du-Maroni', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.5, 
    totalVotes: 58, 
    parti: 'Guyane kontré', 
    mandat: '2020-2026', 
    fonction: '3ème Adjoint - Travaux et aménagement',
    questions: []
  },
  { 
    id: 'marie-chantal-toupouti-adjoint', 
    name: 'Marie-Chantal Toupouti', 
    commune: 'Saint-Laurent-du-Maroni', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.7, 
    totalVotes: 61, 
    parti: 'Guyane kontré', 
    mandat: '2020-2026', 
    fonction: '4ème Adjointe - Éducation',
    questions: []
  },
  { 
    id: 'agnes-bardury-adjoint', 
    name: 'Agnès Bardury', 
    commune: 'Saint-Laurent-du-Maroni', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.8, 
    totalVotes: 65, 
    parti: 'Guyane kontré', 
    mandat: '2020-2026', 
    fonction: '5ème Adjointe - Culture et patrimoine',
    questions: []
  },

  // ===== KOUROU - 8 ADJOINTS =====
  { 
    id: 'patrick-lecante-adjoint-kourou', 
    name: 'Patrick Lecante', 
    commune: 'Kourou', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.8, 
    totalVotes: 72, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1er Adjoint - Spatial et innovation',
    questions: []
  },
  { 
    id: 'anne-marie-gabriel-adjoint-kourou', 
    name: 'Anne-Marie Gabriel', 
    commune: 'Kourou', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.7, 
    totalVotes: 68, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '2ème Adjointe - Environnement',
    questions: []
  },
  { 
    id: 'thierry-joly-adjoint-kourou', 
    name: 'Thierry Joly', 
    commune: 'Kourou', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.6, 
    totalVotes: 61, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '3ème Adjoint - Sports et jeunesse',
    questions: []
  },
  { 
    id: 'patricia-adler-adjoint-kourou', 
    name: 'Patricia Adler', 
    commune: 'Kourou', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.5, 
    totalVotes: 58, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '4ème Adjointe - Éducation',
    questions: []
  },

  // ===== MATOURY - 6 ADJOINTS =====
  { 
    id: 'bruno-nestor-azerot-adjoint-matoury', 
    name: 'Bruno Nestor Azérot', 
    commune: 'Matoury', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.6, 
    totalVotes: 55, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1er Adjoint - Travaux et voirie',
    questions: []
  },
  { 
    id: 'marie-claire-penchard-adjoint', 
    name: 'Marie-Claire Penchard', 
    commune: 'Matoury', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.5, 
    totalVotes: 51, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '2ème Adjointe - Affaires sociales',
    questions: []
  },
  { 
    id: 'jean-claude-dorcy-adjoint', 
    name: 'Jean-Claude Dorcy', 
    commune: 'Matoury', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.4, 
    totalVotes: 47, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '3ème Adjoint - Urbanisme',
    questions: []
  },

  // ===== RÉMIRE-MONTJOLY - 6 ADJOINTS =====
  { 
    id: 'remy-cabeca-adjoint-remire', 
    name: 'Rémy Cabeca', 
    commune: 'Rémire-Montjoly', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.7, 
    totalVotes: 63, 
    parti: 'DVD', 
    mandat: '2020-2026', 
    fonction: '1er Adjoint - Tourisme et développement',
    questions: []
  },
  { 
    id: 'sylvie-bruno-adjoint-remire', 
    name: 'Sylvie Bruno', 
    commune: 'Rémire-Montjoly', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.6, 
    totalVotes: 59, 
    parti: 'DVD', 
    mandat: '2020-2026', 
    fonction: '2ème Adjointe - Culture',
    questions: []
  },
  { 
    id: 'claude-suzanne-adjoint-remire', 
    name: 'Claude Suzanne', 
    commune: 'Rémire-Montjoly', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.5, 
    totalVotes: 54, 
    parti: 'DVD', 
    mandat: '2020-2026', 
    fonction: '3ème Adjoint - Environnement',
    questions: []
  },

  // ===== MACOURIA - 4 ADJOINTS =====
  { 
    id: 'michel-jouan-adjoint', 
    name: 'Michel Jouan', 
    commune: 'Macouria', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.6, 
    totalVotes: 48, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1er Adjoint - Développement économique',
    questions: []
  },
  { 
    id: 'fabienne-mathurin-adjoint', 
    name: 'Fabienne Mathurin', 
    commune: 'Macouria', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.5, 
    totalVotes: 44, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '2ème Adjointe - Affaires sociales',
    questions: []
  },

  // ===== MARIPASOULA - 4 ADJOINTS =====
  { 
    id: 'paul-dolmaire-adjoint-maripasoula', 
    name: 'Paul Dolmaire', 
    commune: 'Maripasoula', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.4, 
    totalVotes: 38, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1er Adjoint - Territoires isolés',
    questions: []
  },
  { 
    id: 'martine-lamon-adjoint', 
    name: 'Martine Lamon', 
    commune: 'Maripasoula', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.3, 
    totalVotes: 35, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '2ème Adjointe - Santé',
    questions: []
  },

  // ===== MANA - 4 ADJOINTS =====
  { 
    id: 'veronique-kancel-adjoint-mana', 
    name: 'Véronique Kancel', 
    commune: 'Mana', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.5, 
    totalVotes: 41, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1ère Adjointe - Écotourisme',
    questions: []
  },
  { 
    id: 'jerome-joliot-adjoint-mana', 
    name: 'Jérôme Joliot', 
    commune: 'Mana', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.4, 
    totalVotes: 37, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '2ème Adjoint - Agriculture',
    questions: []
  },

  // ===== APATOU - 3 ADJOINTS =====
  { 
    id: 'claire-lemoult-adjoint-apatou', 
    name: 'Claire Lemoult', 
    commune: 'Apatou', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.3, 
    totalVotes: 32, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1ère Adjointe - Éducation',
    questions: []
  },
  { 
    id: 'joseph-aidara-adjoint-apatou', 
    name: 'Joseph Aidara', 
    commune: 'Apatou', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.2, 
    totalVotes: 29, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '2ème Adjoint - Jeunesse',
    questions: []
  },

  // ===== PAPAICHTON - 3 ADJOINTS =====
  { 
    id: 'guillaume-berthier-adjoint-papaichton', 
    name: 'Guillaume Berthier', 
    commune: 'Papaichton', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.4, 
    totalVotes: 28, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1er Adjoint - Développement',
    questions: []
  },
  { 
    id: 'nadine-ladrezeau-adjoint-papaichton', 
    name: 'Nadine Ladrezeau', 
    commune: 'Papaichton', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.3, 
    totalVotes: 26, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '2ème Adjointe - Social',
    questions: []
  },

  // ===== GRAND-SANTI - 3 ADJOINTS =====
  { 
    id: 'patrick-sacomani-adjoint-grand-santi', 
    name: 'Patrick Sacomani', 
    commune: 'Grand-Santi', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.2, 
    totalVotes: 24, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1er Adjoint - Equipements',
    questions: []
  },
  { 
    id: 'marie-josephe-gauvin-adjoint-grand-santi', 
    name: 'Marie-Josèphe Gauvin', 
    commune: 'Grand-Santi', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.1, 
    totalVotes: 22, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '2ème Adjointe - Santé',
    questions: []
  },

  // ===== SAINT-GEORGES - 2 ADJOINTS =====
  { 
    id: 'christine-pires-beaune-adjoint-st-georges', 
    name: 'Christine Pires-Beaune', 
    commune: 'Saint-Georges', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.5, 
    totalVotes: 26, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1ère Adjointe - Coopération transfrontalière',
    questions: []
  },
  { 
    id: 'marc-antoine-javouhey-adjoint-st-georges', 
    name: 'Marc-Antoine Javouhey', 
    commune: 'Saint-Georges', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.4, 
    totalVotes: 24, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '2ème Adjoint - Commerce',
    questions: []
  },

  // ===== ROURA - 2 ADJOINTS =====
  { 
    id: 'francine-cayol-adjoint-roura', 
    name: 'Francine Cayol', 
    commune: 'Roura', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.3, 
    totalVotes: 22, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1ère Adjointe - Environnement',
    questions: []
  },
  { 
    id: 'alain-tien-liong-adjoint-roura', 
    name: 'Alain Tien-Liong', 
    commune: 'Roura', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.2, 
    totalVotes: 20, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '2ème Adjoint - Agriculture',
    questions: []
  },

  // ===== SINNAMARY - 2 ADJOINTS =====
  { 
    id: 'anita-sup-adjoint-sinnamary', 
    name: 'Anita Sup', 
    commune: 'Sinnamary', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.4, 
    totalVotes: 21, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1ère Adjointe - Culture',
    questions: []
  },
  { 
    id: 'david-chollet-adjoint-sinnamary', 
    name: 'David Chollet', 
    commune: 'Sinnamary', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.3, 
    totalVotes: 19, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '2ème Adjoint - Jeunesse',
    questions: []
  },

  // ===== MONTSINÉRY-TONNEGRANDE - 2 ADJOINTS =====
  { 
    id: 'michele-lapompe-adjoint-montsinéry', 
    name: 'Michèle Lapompe-Paironne', 
    commune: 'Montsinéry-Tonnegrande', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.3, 
    totalVotes: 18, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1ère Adjointe - Agriculture',
    questions: []
  },
  { 
    id: 'jacques-martial-adjoint-montsinéry', 
    name: 'Jacques Martial', 
    commune: 'Montsinéry-Tonnegrande', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.2, 
    totalVotes: 16, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '2ème Adjoint - Élevage',
    questions: []
  },

  // ===== IRACOUBO - 1 ADJOINT =====
  { 
    id: 'henri-marianne-adjoint-iracoubo', 
    name: 'Henri Marianne', 
    commune: 'Iracoubo', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.2, 
    totalVotes: 15, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1er Adjoint - Patrimoine historique',
    questions: []
  },

  // ===== CAMOPI - 1 ADJOINT =====
  { 
    id: 'corinne-mentia-adjoint-camopi', 
    name: 'Corinne Mentïa', 
    commune: 'Camopi', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.3, 
    totalVotes: 14, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1ère Adjointe - Culture amérindienne',
    questions: []
  },

  // ===== AWALA-YALIMAPO - 1 ADJOINT =====
  { 
    id: 'jean-louis-robinson-adjoint-awala', 
    name: 'Jean-Louis Robinson', 
    commune: 'Awala-Yalimapo', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.4, 
    totalVotes: 13, 
    parti: 'Guyane kontré', 
    mandat: '2020-2026', 
    fonction: '1er Adjoint - Écotourisme',
    questions: []
  },

  // ===== RÉGINA - 1 ADJOINT =====
  { 
    id: 'brigitte-cabal-adjoint-regina', 
    name: 'Brigitte Cabal', 
    commune: 'Régina', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.1, 
    totalVotes: 12, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1ère Adjointe - Développement local',
    questions: []
  },

  // ===== SAINT-ÉLIE - 1 ADJOINT =====
  { 
    id: 'franck-rinaldo-adjoint-st-elie', 
    name: 'Franck Rinaldo', 
    commune: 'Saint-Élie', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.2, 
    totalVotes: 10, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1er Adjoint - Forêt et environnement',
    questions: []
  },

  // ===== OUANARY - 1 ADJOINT =====
  { 
    id: 'michele-agenor-adjoint-ouanary', 
    name: 'Michèle Agénor', 
    commune: 'Ouanary', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.0, 
    totalVotes: 8, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1ère Adjointe - Affaires sociales',
    questions: []
  },

  // ===== SAÜL - 1 ADJOINT =====
  { 
    id: 'philippe-gustave-adjoint-saul', 
    name: 'Philippe Gustave', 
    commune: 'Saül', 
    poste: 'Adjoints au Maire', 
    status: 'actuel', 
    rating: 3.3, 
    totalVotes: 7, 
    parti: 'DVG', 
    mandat: '2020-2026', 
    fonction: '1er Adjoint - Orpaillage et développement',
    questions: []
  }
];
  // FONCTIONS D'IMPORT
  // FONCTION D'IMPORT AMÉLIORÉE POUR LES ÉLUS NATIONAUX
const importElusNationaux = async () => {
  setImportingElus(true);
  try {
    console.log('🚀 Import des élus nationaux démarré...');
    
    let totalImported = 0;
    
    // Import députés
    for (const depute of deputesData) {
      await setDoc(doc(db, 'deputes', depute.id), depute);
      totalImported++;
    }
    console.log(`✅ ${deputesData.length} députés importés`);
    
    // Import sénateurs  
    for (const senateur of senateursData) {
      await setDoc(doc(db, 'senateurs', senateur.id), senateur);
      totalImported++;
    }
    console.log(`✅ ${senateursData.length} sénateurs importés`);
    
    // Import conseillers territoriaux (55 conseillers !)
    for (const conseiller of conseillersTerritoriaux) {
      await setDoc(doc(db, 'conseillers_territoriaux', conseiller.id), conseiller);
      totalImported++;
    }
    console.log(`✅ ${conseillersTerritoriaux.length} conseillers territoriaux importés`);
    
    alert(`🎉 IMPORT RÉUSSI !\n\n📊 Total importé : ${totalImported} élus\n- ${deputesData.length} députés\n- ${senateursData.length} sénateurs  \n- ${conseillersTerritoriaux.length} conseillers territoriaux\n\nActualisation de la page...`);
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    alert('❌ Erreur lors de l\'import. Vérifiez la console et votre connexion Firebase.');
  } finally {
    setImportingElus(false);
  }
};


// FONCTION D'IMPORT POUR LES VRAIS MAIRES ET ÉLUS LOCAUX
const importVraisMaires = async () => {
  setImportingElus(true);
  try {
    console.log('🏛️ Import des vrais maires de Guyane démarré...');
    
    let importCount = 0;
    let mairesCount = 0;
    let adjointsCount = 0;
    let conseillersCount = 0;
    let intercommunauxCount = 0;
    
    for (const elu of allElusData) {
      await setDoc(doc(db, 'elus', elu.id), elu);
      importCount++;
      
      // Compter par type
      if (elu.poste === 'Maire') mairesCount++;
      else if (elu.poste === 'Adjoints au Maire') adjointsCount++;
      else if (elu.poste === 'Conseillers Municipaux') conseillersCount++;
      else if (elu.poste === 'Conseillers Intercommunaux') intercommunauxCount++;
      
      console.log(`✅ ${elu.name} (${elu.poste} - ${elu.commune}) ajouté(e) [${importCount}/${allElusData.length}]`);
    }
    
    console.log(`🎉 IMPORT TERMINÉ ! ${allElusData.length} élus locaux ajoutés`);
    
    alert(`🎉 IMPORT RÉUSSI - VRAIS MAIRES 2025 !\n\n📊 Total importé : ${importCount} élus locaux\n\n🏛️ Détail :\n• ${mairesCount} maires (22 communes)\n• ${adjointsCount} adjoints au maire\n• ${conseillersCount} conseillers municipaux\n• ${intercommunauxCount} conseillers intercommunaux\n\n✅ Données officielles 2025 !\nActualisation de la page...`);
    
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import des vrais maires:', error);
    alert('❌ Erreur lors de l\'import. Vérifiez la console et votre connexion Firebase.');
  } finally {
    setImportingElus(false);
  }
};// FONCTION D'IMPORT SIMPLE POUR LES ADJOINTS AU MAIRE
const importAdjoints = async () => {
  setImportingElus(true);
  try {
    console.log('👥 Import des adjoints au maire démarré...');
    
    let importCount = 0;
    let communesAvecAdjoints = new Set();
    
    for (const adjoint of adjointsComplets) {
      await setDoc(doc(db, 'elus', adjoint.id), adjoint);
      importCount++;
      communesAvecAdjoints.add(adjoint.commune);
      
      console.log(`✅ ${adjoint.name} (${adjoint.fonction} - ${adjoint.commune}) ajouté(e) [${importCount}/${adjointsComplets.length}]`);
    }
    
    console.log(`🎉 IMPORT TERMINÉ ! ${adjointsComplets.length} adjoints ajoutés dans ${communesAvecAdjoints.size} communes`);
    
    alert(`🎉 IMPORT RÉUSSI - ADJOINTS AU MAIRE !\n\n👥 Total importé : ${importCount} adjoints\n📍 Dans ${communesAvecAdjoints.size} communes\n\n🏛️ Exemples :\n• Christian Faubert (1er Adjoint Cayenne - Sport)\n• Mickle Papayo (1er Adjoint Saint-Laurent)\n• Patrick Lecante (1er Adjoint Kourou - Spatial)\n\n✅ Données officielles 2025 !\nActualisation de la page...`);
    
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import des adjoints:', error);
    alert('❌ Erreur lors de l\'import. Vérifiez la console et votre connexion Firebase.');
  } finally {
    setImportingElus(false);
  }
};// FONCTION POUR VÉRIFIER S'IL EXISTE DES ÉLUS D'UN TYPE DONNÉ
const hasElusOfType = (postes) => {
  return elus.some(elu => postes.includes(elu.poste));
};

// FONCTION D'IMPORT DES DÉPUTÉS
const importDeputes = async () => {
  setImportingElus(true);
  try {
    const deputes = [
      { 
        id: 'jean-victor-castor-depute', 
        name: 'Jean-Victor Castor', 
        commune: 'Toute la Guyane', 
        poste: 'Députés', 
        status: 'actuel', 
        rating: 4.2, 
        totalVotes: 234, 
        parti: 'Régionaliste', 
        mandat: '2024-2029',
        circonscription: '1ère circonscription',
        profession: 'Conseiller en collectivité territoriale',
        description: 'Jean‑Victor Castor, né le 21 avril 1962 à Sinnamary, est le fils d\'enseignants et a suivi des études en chimie avant de rejoindre la Guyane et militer pour le MDES dès la fondation du journal Rot Kozé (1985). Député depuis juin 2022 dans le groupe GDR, il défend une forte autonomie voire indépendance pour la Guyane et milite contre le néocolonialisme français. Il est l\'auteur d\'une proposition de loi en mai 2023 pour abroger l\'obligation vaccinale des soignants, adoptée malgré l\'opposition du gouvernement. En 2023, il a participé à une mission sur l\'aménagement durable du territoire, et en décembre 2023, il a soutenu un amendement augmentant le foncier pour la SAFER de Guyane (125 000–150 000 ha). Il suscite parfois la controverse — notamment suite à un voyage officiel à Bakou pour un forum anti-colonial.',
        questions: []
      },
      { 
        id: 'davy-rimane-depute', 
        name: 'Davy Rimane', 
        commune: 'Toute la Guyane', 
        poste: 'Députés', 
        status: 'actuel', 
        rating: 4.0, 
        totalVotes: 198, 
        parti: 'Régionaliste', 
        mandat: '2024-2029',
        circonscription: '2ème circonscription',
        profession: 'Ancien maire',
        description: 'Davy Rimane, né le 15 décembre 1979 à Kourou, est un technicien chez EDF et ancien syndicaliste (Union des travailleurs guyanais - section énergie). Il a été l\'une des figures marquantes du mouvement social de 2017 ("Pou Lagwiyann Dékolé") et pour ses revendications, il a ensuite rejoint les rangs de la gauche. Élu député en 2022, il s\'inscrit dans le groupe GDR (Gauche Démocrate et Républicaine) à l\'Assemblée. Il préside depuis juin 2023 la Délégation aux outre-mer, mettant l\'accent sur les spécificités du territoire guyanais. Actif localement, il est également conseiller municipal de Kourou. Reconnu pour ses positions sur l\'énergie, l\'immigration et les droits sociaux, il propose des tribunes dans la presse locale.',
        questions: []
      }
    ];

    for (const depute of deputes) {
      await setDoc(doc(db, 'elus', depute.id), depute);
    }

    alert(`🎉 ${deputes.length} députés importés avec succès !`);
    window.location.reload();
  } catch (error) {
    console.error('❌ Erreur lors de l\'import des députés:', error);
    alert('❌ Erreur lors de l\'import. Vérifiez la console.');
  } finally {
    setImportingElus(false);
  }
};

// FONCTION D'IMPORT DES SÉNATEURS
const importSenateurs = async () => {
  setImportingElus(true);
  try {
    const senateurs = [
      { 
        id: 'georges-patient-senateur', 
        name: 'Georges Patient', 
        commune: 'Toute la Guyane', 
        poste: 'Sénateurs', 
        status: 'actuel', 
        rating: 4.1, 
        totalVotes: 156, 
        parti: 'Régionaliste', 
        mandat: '2023-2032',
        profession: 'Ancien maire de Mana',
        questions: []
      },
      { 
        id: 'marie-laure-phinera-horth-senateur', 
        name: 'Marie-Laure Phinéra-Horth', 
        commune: 'Toute la Guyane', 
        poste: 'Sénateurs', 
        status: 'actuel', 
        rating: 4.3, 
        totalVotes: 167, 
        parti: 'RDPI', 
        mandat: '2023-2032',
        profession: 'Orthophoniste',
        particularite: 'Première femme sénatrice de Guyane',
        questions: []
      }
    ];

    for (const senateur of senateurs) {
      await setDoc(doc(db, 'elus', senateur.id), senateur);
    }

    alert(`🎉 ${senateurs.length} sénateurs importés avec succès !`);
    window.location.reload();
  } catch (error) {
    console.error('❌ Erreur lors de l\'import des sénateurs:', error);
    alert('❌ Erreur lors de l\'import. Vérifiez la console.');
  } finally {
    setImportingElus(false);
  }
};
// LISTE COMPLÈTE DES 55 CONSEILLERS TERRITORIAUX CTG 2021-2028
const conseillersTerritoriaux55 = [
  // === BUREAU EXÉCUTIF ===
  {
    id: 'gabriel-serville-ctg',
    name: 'Gabriel Serville',
    poste: 'Président CTG',
    parti: 'Péyi G',
    mandat: '2021-2028',
    section: 'Cayenne',
    groupe: 'Majorité - Guyane Kontré',
    description: 'Gabriel Serville est Président de la Collectivité Territoriale de Guyane depuis 2021. Figure emblématique de Péyi G, il dirige la majorité territoriale "Guyane Kontré" et porte les enjeux d\'autonomie, de développement durable et de justice sociale pour la Guyane.',
    rating: 4.2,
    totalVotes: 156,
    questions: []
  },
  {
    id: 'jean-paul-fereira-ctg',
    name: 'Jean-Paul Fereira',
    poste: '1er Vice-Président CTG',
    parti: 'AGEG',
    mandat: '2021-2028',
    section: 'Saint-Laurent-du-Maroni',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Développement durable et transition énergétique',
    description: 'Jean-Paul Fereira est 1er Vice-Président de la CTG, membre de l\'Alliance pour une Guyane Écologique et Gagnante (AGEG). Ancien maire d\'Awala-Yalimapo, il est également président du Parc Naturel Régional de Guyane. Il est reconnu pour son engagement environnemental et représente un pilier de la majorité territoriale sur la question du développement durable.',
    rating: 3.7,
    totalVotes: 78,
    questions: []
  },
  {
    id: 'sophie-charles-ctg',
    name: 'Sophie Charles',
    poste: '2ème Vice-Présidente CTG',
    parti: 'Guyane kontré',
    mandat: '2021-2028',
    section: 'Cayenne',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Éducation et constructions scolaires',
    rating: 3.9,
    totalVotes: 82,
    questions: []
  },
  {
    id: 'rodolphe-alexandre-ctg',
    name: 'Rodolphe Alexandre',
    poste: '3ème Vice-Président CTG',
    parti: 'GR',
    mandat: '2021-2028',
    section: 'Cayenne',
    groupe: 'Opposition - Unis et engagés',
    delegation: 'Europe, affaires institutionnelles, égalité',
    rating: 3.5,
    totalVotes: 65,
    questions: []
  },
  {
    id: 'marie-laure-phinera-horth-ctg',
    name: 'Marie-Laure Phinéra-Horth',
    poste: '4ème Vice-Présidente CTG',
    parti: 'Guyane kontré',
    mandat: '2021-2028',
    section: 'Cayenne',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Santé et action sociale',
    rating: 4.0,
    totalVotes: 94,
    questions: []
  },

  // === SECTION CAYENNE (12 sièges) ===
  // Majorité
  {
    id: 'patricia-said-ctg',
    name: 'Patricia Saïd',
    poste: '4e Vice-Présidente',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Cayenne',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Solidarité & santé',
    description: 'Patricia Saïd, 4e Vice-Présidente, est engagée en faveur des politiques sociales et sanitaires. Elle est particulièrement active sur les questions de santé publique, d\'infrastructures médicales et du projet de CHRU de Guyane.',
    rating: 3.6,
    totalVotes: 45,
    questions: []
  },
  {
    id: 'jean-luc-le-west-ctg',
    name: 'Jean-Luc Le West',
    poste: '13e Vice-Président',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Cayenne',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Développement économique & tourisme',
    description: 'Jean-Luc Le West est 13e Vice-Président chargé du développement économique et du tourisme. Il soutient l\'entrepreneuriat local, les investissements durables et les initiatives de valorisation touristique de la Guyane.',
    rating: 3.5,
    totalVotes: 38,
    questions: []
  },
  {
    id: 'muriel-briquet-ctg',
    name: 'Muriel Briquet',
    poste: 'Conseillère Territoriale',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Cayenne',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.7,
    totalVotes: 52,
    questions: []
  },
  {
    id: 'chester-leonce-ctg',
    name: 'Chester Leonce',
    poste: '9e Vice-Président',
    parti: 'NFG',
    mandat: '2021-2028',
    section: 'Cayenne',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Aménagement du territoire & transports',
    description: 'Chester Leonce, 9e Vice-Président, est responsable des questions liées à l\'aménagement du territoire, aux infrastructures et au désenclavement. Il s\'implique dans la modernisation du réseau routier et des transports publics.',
    rating: 3.4,
    totalVotes: 32,
    questions: []
  },
  {
    id: 'bernadette-dulonca-ctg',
    name: 'Bernadette Dulonca',
    poste: '10e Vice-Présidente',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Cayenne',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Citoyenneté & vivre ensemble',
    description: 'Bernadette Dulonca est la 10e Vice-Présidente de la CTG. Elle travaille à renforcer la cohésion sociale, la citoyenneté active et le vivre ensemble entre les différentes cultures de Guyane.',
    rating: 3.8,
    totalVotes: 58,
    questions: []
  },
  {
    id: 'zadkiel-saint-orice-ctg',
    name: 'Zadkiel Saint-Orice',
    poste: 'Conseiller Territorial',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Cayenne',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.6,
    totalVotes: 43,
    questions: []
  },
  {
    id: 'christiane-barbe-ctg',
    name: 'Christiane Barbe',
    poste: 'Conseillère Territoriale',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Cayenne',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.7,
    totalVotes: 49,
    questions: []
  },
  {
    id: 'serge-long-him-nam-ctg',
    name: 'Serge Long-Him-Nam',
    poste: 'Conseiller Territorial',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Cayenne',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.5,
    totalVotes: 37,
    questions: []
  },
  // Opposition Cayenne
  {
    id: 'audrey-marie-ctg',
    name: 'Audrey Marie',
    poste: 'Conseillère Territoriale',
    parti: 'Divers centre',
    mandat: '2021-2028',
    section: 'Cayenne',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.3,
    totalVotes: 29,
    questions: []
  },
  {
    id: 'boris-chong-sit-ctg',
    name: 'Boris Chong-Sit',
    poste: 'Conseiller Territorial',
    parti: 'Les Républicains',
    mandat: '2021-2028',
    section: 'Cayenne',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.2,
    totalVotes: 26,
    questions: []
  },

  // === SECTION PETITE COURONNE (11 sièges) ===
  // Majorité
  {
    id: 'philippe-bouba-ctg',
    name: 'Philippe Bouba',
    poste: '5e Vice-Président',
    parti: 'LFI',
    mandat: '2021-2028',
    section: 'Petite Couronne',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Enseignement supérieur & recherche',
    description: 'Philippe Bouba est enseignant-chercheur et 5e Vice-Président de la CTG. Il pilote les politiques d\'enseignement supérieur, la recherche, et les partenariats académiques, avec des projets tels que la création d\'un Crous et de nouvelles formations.',
    rating: 3.6,
    totalVotes: 44,
    questions: []
  },
  {
    id: 'aissatou-chambaud-ctg',
    name: 'Aïssatou Chambaud',
    poste: '6e Vice-Présidente',
    parti: 'PSG',
    mandat: '2021-2028',
    section: 'Petite Couronne',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Famille & aide sociale à l\'enfance',
    description: 'Aïssatou Chambaud, 6e Vice-Présidente, est issue du secteur social. Elle œuvre pour la protection de l\'enfance, les droits des familles et le renforcement de l\'aide sociale territoriale.',
    rating: 3.8,
    totalVotes: 56,
    questions: []
  },
  {
    id: 'roger-aron-ctg',
    name: 'Roger Aron',
    poste: '7e Vice-Président',
    parti: 'Péyi G',
    mandat: '2021-2028',
    section: 'Petite Couronne',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Agriculture, pêche & souveraineté alimentaire',
    description: 'Roger Aron est 7e Vice-Président de la CTG, chargé des politiques agricoles, de la pêche et de la souveraineté alimentaire. Il représente la Guyane au Salon de l\'Agriculture et défend une production locale plus forte et autonome.',
    rating: 3.7,
    totalVotes: 51,
    questions: []
  },
  {
    id: 'sherly-alcin-ctg',
    name: 'Sherly Alcin',
    poste: 'Conseillère Territoriale',
    parti: 'LFI',
    mandat: '2021-2028',
    section: 'Petite Couronne',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.5,
    totalVotes: 39,
    questions: []
  },
  {
    id: 'lucien-alexander-ctg',
    name: 'Lucien Alexander',
    poste: 'Conseiller Territorial',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Petite Couronne',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.6,
    totalVotes: 42,
    questions: []
  },
  {
    id: 'marie-lucienne-rattier-ctg',
    name: 'Marie-Lucienne Rattier',
    poste: 'Conseillère Territoriale',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Petite Couronne',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.7,
    totalVotes: 48,
    questions: []
  },
  {
    id: 'thibault-lechat-vega-ctg',
    name: 'Thibault Lechat-Vega',
    poste: '3e Vice-Président',
    parti: 'Péyi G',
    mandat: '2021-2028',
    section: 'Petite Couronne',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Europe, égalité, relations institutionnelles',
    description: 'Thibault Lechat-Vega est le 3e Vice-Président de la CTG, en charge des affaires européennes, institutionnelles, et de l\'égalité. Il représente la CTG au sein du Comité des Régions de l\'Union Européenne et œuvre au renforcement des relations avec les Guyanais de l\'extérieur.',
    rating: 3.4,
    totalVotes: 35,
    questions: []
  },
  {
    id: 'violaine-machichi-prost-ctg',
    name: 'Violaine Machichi-Prost',
    poste: 'Conseillère Territoriale',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Petite Couronne',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.8,
    totalVotes: 54,
    questions: []
  },
  // Opposition Petite Couronne
  {
    id: 'claude-penet-ctg',
    name: 'Claude Penet',
    poste: 'Conseiller Territorial',
    parti: 'Divers centre',
    mandat: '2021-2028',
    section: 'Petite Couronne',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.3,
    totalVotes: 28,
    questions: []
  },
  {
    id: 'isabelle-patient-ctg',
    name: 'Isabelle Patient',
    poste: 'Conseillère Territoriale',
    parti: 'Divers droite',
    mandat: '2021-2028',
    section: 'Petite Couronne',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.2,
    totalVotes: 25,
    questions: []
  },
  {
    id: 'julnor-belizaire-ctg',
    name: 'Julnor Bélizaire',
    poste: 'Conseiller Territorial',
    parti: 'GR',
    mandat: '2021-2028',
    section: 'Petite Couronne',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.1,
    totalVotes: 23,
    questions: []
  },

  // === SECTION GRANDE COURONNE (4 sièges) ===
  // Majorité
  {
    id: 'emmanuel-prince-ctg',
    name: 'Emmanuel Prince',
    poste: '11e Vice-Président',
    parti: 'Péyi G',
    mandat: '2021-2028',
    section: 'Grande Couronne',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Culture, patrimoine & transmission',
    description: 'Emmanuel Prince est 11e Vice-Président chargé de la culture et du patrimoine. Il valorise l\'histoire, les langues et les traditions de Guyane à travers des actions de terrain et des soutiens aux initiatives culturelles.',
    rating: 3.6,
    totalVotes: 41,
    questions: []
  },
  {
    id: 'karine-cresson-ibris-ctg',
    name: 'Karine Cresson-Ibris',
    poste: '12e Vice-Présidente',
    parti: 'MDES',
    mandat: '2021-2028',
    section: 'Grande Couronne',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Emploi, formation & insertion professionnelle',
    description: 'Karine Cresson-Ibris est militante du MDES et 12e Vice-Présidente de la CTG. Elle porte les enjeux liés à l\'emploi, à la formation professionnelle et à l\'insertion des jeunes et des publics en difficulté.',
    rating: 3.7,
    totalVotes: 47,
    questions: []
  },
  {
    id: 'christian-noko-ctg',
    name: 'Christian Noko',
    poste: 'Conseiller Territorial',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Grande Couronne',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.5,
    totalVotes: 36,
    questions: []
  },
  // Opposition Grande Couronne
  {
    id: 'jean-claude-labrador-ctg',
    name: 'Jean-Claude Labrador',
    poste: 'Conseiller Territorial',
    parti: 'Divers droite',
    mandat: '2021-2028',
    section: 'Grande Couronne',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.2,
    totalVotes: 24,
    questions: []
  },

  // === SECTION OYAPOCK (3 sièges) ===
  // Majorité
  {
    id: 'rene-monerville-ctg',
    name: 'René Monerville',
    poste: 'Conseiller Territorial',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Oyapock',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.6,
    totalVotes: 40,
    questions: []
  },
  // Opposition Oyapock
  {
    id: 'pierre-desert-ctg',
    name: 'Pierre Désert',
    poste: 'Conseiller Territorial',
    parti: 'GR',
    mandat: '2021-2028',
    section: 'Oyapock',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.3,
    totalVotes: 27,
    questions: []
  },
  {
    id: 'leda-georges-ctg',
    name: 'Léda Georges',
    poste: 'Conseillère Territoriale',
    parti: 'Divers centre',
    mandat: '2021-2028',
    section: 'Oyapock',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.4,
    totalVotes: 31,
    questions: []
  },

  // === SECTION LES SAVANES (6 sièges) ===
  // Majorité
  {
    id: 'annie-robinson-chocho-ctg',
    name: 'Annie Robinson-Chocho',
    poste: '2e Vice-Présidente',
    parti: 'Péyi G',
    mandat: '2021-2028',
    section: 'Les Savanes',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Éducation & constructions scolaires',
    description: 'Annie Robinson-Chocho, 2e Vice-Présidente, est une figure active de Péyi G. Elle supervise les politiques éducatives de la CTG, en particulier les constructions et réhabilitations d\'établissements scolaires. Elle soutient de nombreuses initiatives pédagogiques sur le territoire.',
    rating: 3.7,
    totalVotes: 49,
    questions: []
  },
  {
    id: 'patrick-cosset-ctg',
    name: 'Patrick Cosset',
    poste: 'Conseiller Territorial',
    parti: 'Péyi G',
    mandat: '2021-2028',
    section: 'Les Savanes',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.5,
    totalVotes: 38,
    questions: []
  },
  {
    id: 'isabelle-vernet-ctg',
    name: 'Isabelle Vernet',
    poste: 'Conseillère Territoriale',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Les Savanes',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.6,
    totalVotes: 43,
    questions: []
  },
  {
    id: 'enrico-william-ctg',
    name: 'Enrico William',
    poste: 'Conseiller Territorial',
    parti: 'Péyi G',
    mandat: '2021-2028',
    section: 'Les Savanes',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.4,
    totalVotes: 34,
    questions: []
  },
  // Opposition Les Savanes
  {
    id: 'francois-ringuet-ctg',
    name: 'François Ringuet',
    poste: 'Conseiller Territorial',
    parti: 'GR',
    mandat: '2021-2028',
    section: 'Les Savanes',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.3,
    totalVotes: 29,
    questions: []
  },
  {
    id: 'magda-soesanna-ctg',
    name: 'Magda Soesanna',
    poste: 'Conseillère Territoriale',
    parti: 'Divers centre',
    mandat: '2021-2028',
    section: 'Les Savanes',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.2,
    totalVotes: 26,
    questions: []
  },

  // === SECTION HAUT-MARONI (7 sièges) ===
  // Majorité
  {
    id: 'raymond-deye-ctg',
    name: 'Raymond Déyé',
    poste: '15e Vice-Président',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Haut-Maroni',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Égalité des chances & des territoires',
    description: 'Raymond Déyé est 15e Vice-Président de la CTG. Il défend l\'égalité des chances, la réduction des inégalités territoriales et le développement équilibré des zones enclavées de Guyane.',
    rating: 3.6,
    totalVotes: 42,
    questions: []
  },
  {
    id: 'mirta-tani-ctg',
    name: 'Mirta Tani',
    poste: 'Conseillère Territoriale',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Haut-Maroni',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.7,
    totalVotes: 46,
    questions: []
  },
  {
    id: 'francois-bagadi-ctg',
    name: 'François Bagadi',
    poste: 'Conseiller Territorial',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Haut-Maroni',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.5,
    totalVotes: 37,
    questions: []
  },
  // Opposition Haut-Maroni
  {
    id: 'denis-galimot-ctg',
    name: 'Denis Galimot',
    poste: 'Conseiller Territorial',
    parti: 'Divers centre',
    mandat: '2021-2028',
    section: 'Haut-Maroni',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.3,
    totalVotes: 28,
    questions: []
  },
  {
    id: 'juilette-daniel-ctg',
    name: 'Juilette Daniel',
    poste: 'Conseillère Territoriale',
    parti: 'GR',
    mandat: '2021-2028',
    section: 'Haut-Maroni',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.2,
    totalVotes: 25,
    questions: []
  },
  {
    id: 'felix-dada-ctg',
    name: 'Félix Dada',
    poste: 'Conseiller Territorial',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Haut-Maroni',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.4,
    totalVotes: 32,
    questions: []
  },
  {
    id: 'sergina-telon-ctg',
    name: 'Sergina Télon',
    poste: 'Conseillère Territoriale',
    parti: 'Divers centre',
    mandat: '2021-2028',
    section: 'Haut-Maroni',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.1,
    totalVotes: 22,
    questions: []
  },

  // === SECTION SAINT-LAURENT-DU-MARONI (7 sièges) ===
  // Majorité (Jean-Paul Fereira déjà dans le bureau)
  {
    id: 'samantha-cyriaque-ctg',
    name: 'Samantha Cyriaque',
    poste: '8e Vice-Présidente',
    parti: 'MDES',
    mandat: '2021-2028',
    section: 'Saint-Laurent-du-Maroni',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Autonomie & handicap',
    description: 'Samantha Cyriaque est enseignante et militante du MDES. Elle est la 8e Vice-Présidente de la CTG en charge de l\'autonomie des personnes handicapées et du soutien à l\'inclusion sociale sur le territoire.',
    rating: 3.6,
    totalVotes: 44,
    questions: []
  },
  {
    id: 'jessi-americain-ctg',
    name: 'Jessi Americain',
    poste: 'Conseiller Territorial',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Saint-Laurent-du-Maroni',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.5,
    totalVotes: 39,
    questions: []
  },
  {
    id: 'keena-perlet-ctg',
    name: 'Keena Perlet',
    poste: 'Conseillère Territoriale',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Saint-Laurent-du-Maroni',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.7,
    totalVotes: 48,
    questions: []
  },
  {
    id: 'gilles-le-gall-ctg',
    name: 'Gilles le Gall',
    poste: 'Conseiller Territorial',
    parti: 'Génération.s',
    mandat: '2021-2028',
    section: 'Saint-Laurent-du-Maroni',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.4,
    totalVotes: 35,
    questions: []
  },
  // Opposition Saint-Laurent
  {
    id: 'crepin-kezza-ctg',
    name: 'Crépin Kezza',
    poste: 'Conseiller Territorial',
    parti: 'Divers centre',
    mandat: '2021-2028',
    section: 'Saint-Laurent-du-Maroni',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.3,
    totalVotes: 30,
    questions: []
  },
  {
    id: 'catherine-leo-ctg',
    name: 'Catherine Léo',
    poste: 'Conseillère Territoriale',
    parti: 'Divers centre',
    mandat: '2021-2028',
    section: 'Saint-Laurent-du-Maroni',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.2,
    totalVotes: 27,
    questions: []
  },
  {
    id: 'benfelino-waarheid-ctg',
    name: 'Benfelino Waarheid',
    poste: 'Conseiller Territorial',
    parti: 'Divers centre',
    mandat: '2021-2028',
    section: 'Saint-Laurent-du-Maroni',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.1,
    totalVotes: 24,
    questions: []
  },
  {
    id: 'nelly-desmangles-ctg',
    name: 'Nelly Desmangles',
    poste: 'Conseillère Territoriale',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Saint-Laurent-du-Maroni',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.4,
    totalVotes: 33,
    questions: []
  },

  // === SECTION BASSE-MANA (3 sièges) ===
  // Majorité
  {
    id: 'tiarrah-steenwinkel-ctg',
    name: 'Tiarrah Steenwinkel',
    poste: '14e Vice-Présidente',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Basse-Mana',
    groupe: 'Majorité - Guyane Kontré',
    delegation: 'Sécurité & sûreté',
    description: 'Tiarrah Steenwinkel, 14e Vice-Présidente, s\'occupe des questions de sécurité et de sûreté sur le territoire. Elle travaille à renforcer la prévention, la tranquillité publique et les politiques de médiation sociale.',
    rating: 3.6,
    totalVotes: 41,
    questions: []
  },
  {
    id: 'jocelyn-therese-ctg',
    name: 'Jocelyn Thérèse',
    poste: 'Conseiller Territorial',
    parti: 'Divers gauche',
    mandat: '2021-2028',
    section: 'Basse-Mana',
    groupe: 'Majorité - Guyane Kontré',
    rating: 3.5,
    totalVotes: 38,
    questions: []
  },
  // Opposition Basse-Mana
  {
    id: 'alberic-benth-ctg',
    name: 'Albéric Benth',
    poste: 'Conseiller Territorial',
    parti: 'Divers centre',
    mandat: '2021-2028',
    section: 'Basse-Mana',
    groupe: 'Opposition - Unis et engagés',
    rating: 3.3,
    totalVotes: 29,
    questions: []
  }
];

// FONCTION D'IMPORT DES 55 CONSEILLERS TERRITORIAUX COMPLETS
const importConseillersTerritoriaux55 = async () => {
  setImportingElus(true);
  try {
    console.log('🌐 Import des 55 conseillers territoriaux CTG démarré...');
    
    let importCount = 0;
    let majoriteCount = 0;
    let oppositionCount = 0;
    
    for (const conseiller of conseillersTerritoriaux55) {
      await setDoc(doc(db, 'elus', conseiller.id), {
        ...conseiller
        // Garder les vrais postes (Président CTG, Vice-Présidents, etc.)
      });
      importCount++;
      
      if (conseiller.groupe.includes('Majorité')) {
        majoriteCount++;
      } else {
        oppositionCount++;
      }
      
      console.log(`✅ ${conseiller.name} (${conseiller.section}) ajouté(e) [${importCount}/55]`);
    }
    
    console.log(`🎉 IMPORT TERMINÉ ! 55 conseillers territoriaux ajoutés`);
    
    alert(`🎉 IMPORT RÉUSSI - 55 CONSEILLERS TERRITORIAUX CTG !\n\n🌐 Total importé : 55 conseillers\n\n📊 Répartition :\n• ${majoriteCount} Majorité "Guyane Kontré"\n• ${oppositionCount} Opposition "Unis et engagés"\n\n🗺️ 8 sections électorales :\n• Cayenne (12), Petite Couronne (11)\n• Saint-Laurent (7), Haut-Maroni (7)\n• Les Savanes (6), Grande Couronne (4)\n• Oyapock (3), Basse-Mana (3)\n\n✅ Données officielles 2021-2028 !\nActualisation de la page...`);
    
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import des conseillers territoriaux:', error);
    alert('❌ Erreur lors de l\'import. Vérifiez la console et votre connexion Firebase.');
  } finally {
    setImportingElus(false);
  }
};
  // CHARGEMENT DES DONNÉES
  // Effet pour charger les actualités quand un élu est sélectionné
  useEffect(() => {
    if (selectedElu && currentScreen === 'profil') {
      fetchEluNews(selectedElu.name);
      // Scroll vers le haut quand on ouvre un profil
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setNews([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedElu, currentScreen]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 1. COMMUNES
        let toutesLesCommunes = [...communesIntegrees];
        try {
          const communesSnapshot = await getDocs(collection(db, 'communes'));
          const communesFirebase = communesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          communesFirebase.forEach(communeFirebase => {
            if (!toutesLesCommunes.find(c => c.id === communeFirebase.id)) {
              toutesLesCommunes.push(communeFirebase);
            }
          });
        } catch (error) {
          console.log('⚠️ Erreur Firebase communes:', error);
        }
        

        
        // 3. ÉLUS LOCAUX
        let tousLesElus = [];
        try {
          const elusSnapshot = await getDocs(collection(db, 'elus'));
          tousLesElus = elusSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (error) {
          console.log('⚠️ Erreur Firebase élus:', error);
        }

        // 4. DÉPUTÉS - Extraits de la collection 'elus' ou fallback sur données statiques
        let tousLesDeputes = [];
        const deputesFromElus = tousLesElus.filter(elu => elu.poste === 'Députés');
        if (deputesFromElus.length > 0) {
          tousLesDeputes = deputesFromElus;
          console.log('✅ Députés chargés depuis collection elus:', deputesFromElus.length);
        } else {
          // Fallback sur les données statiques
          tousLesDeputes = [...deputesData];
          console.log('⚠️ Députés chargés depuis données statiques:', deputesData.length);
        }

        // 5. SÉNATEURS - Extraits de la collection 'elus' ou fallback sur données statiques
        let tousLesSenateurs = [];
        const senateursFromElus = tousLesElus.filter(elu => elu.poste === 'Sénateurs');
        if (senateursFromElus.length > 0) {
          tousLesSenateurs = senateursFromElus;
          console.log('✅ Sénateurs chargés depuis collection elus:', senateursFromElus.length);
        } else {
          // Fallback sur les données statiques
          tousLesSenateurs = [...senateursData];
          console.log('⚠️ Sénateurs chargés depuis données statiques:', senateursData.length);
        }

        // 6. CONSEILLERS TERRITORIAUX - Extraits de la collection 'elus' ou fallback sur données statiques
        let tousLesConseillers = [];
        const conseillersFromElus = tousLesElus.filter(elu => 
          elu.poste === 'Conseiller territorial' || 
          elu.poste === 'Président CTG' || 
          elu.poste === 'Vice-Président CTG' ||
          elu.poste?.includes('Président') ||
          elu.poste?.includes('Vice') ||
          elu.poste?.includes('VP') ||
          elu.poste?.includes('Éducation') ||
          (elu.name === 'Gabriel Serville') ||
          (elu.name === 'Jean-Paul Fereira') ||
          (elu.name === 'Annie Robinson-Chocho') ||
          (elu.name === 'Thibault Lechat-Vega') ||
          (elu.name === 'Patricia Saïd') ||
          (elu.name === 'Philippe Bouba') ||
          (elu.name === 'Aïssatou Chambaud') ||
          (elu.name === 'Roger Aron') ||
          (elu.name === 'Samantha Cyriaque') ||
          (elu.name === 'Chester Leonce') ||
          (elu.name === 'Bernadette Dulonca') ||
          (elu.name === 'Emmanuel Prince') ||
          (elu.name === 'Karine Cresson-Ibris') ||
          (elu.name === 'Jean-Luc Le West') ||
          (elu.name === 'Tiarrah Steenwinkel') ||
          (elu.name === 'Raymond Déyé')
        );
        // Vérifier si les données Firebase ont des descriptions
        const hasDescriptions = conseillersFromElus.some(elu => elu.description);
        
        if (conseillersFromElus.length > 0 && hasDescriptions) {
          tousLesConseillers = conseillersFromElus;
          console.log('✅ Conseillers territoriaux chargés depuis collection elus avec descriptions:', conseillersFromElus.length);
        } else {
          // Fallback sur les données statiques qui ont les descriptions
          tousLesConseillers = [...conseillersTerritoriaux55];
          console.log('⚠️ Conseillers territoriaux chargés depuis données statiques avec descriptions:', conseillersTerritoriaux55.length);
        }

        setCommunes(toutesLesCommunes);
        setElus(tousLesElus);
        setDeputes(tousLesDeputes);
        setSenateurs(tousLesSenateurs);
        setConseillers(tousLesConseillers);
        
        // Debug spécifique pour les maires
        const mairesFromFirebase = tousLesElus.filter(e => e.poste === 'Maire');
        console.log('🏛️ MAIRES depuis Firebase:', mairesFromFirebase.length);
        if (mairesFromFirebase.length > 0) {
          console.log('📝 Noms des maires Firebase:', mairesFromFirebase.map(m => m.name));
          // Chercher spécifiquement Céline
          const celine = mairesFromFirebase.find(m => m.name.toLowerCase().includes('celine'));
          if (celine) {
            console.log('🎯 CÉLINE TROUVÉE dans Firebase:', celine);
          } else {
            console.log('❌ CÉLINE PAS TROUVÉE dans les maires Firebase');
          }
        } else {
          console.log('⚠️ AUCUN MAIRE chargé depuis Firebase !');
          console.log('📝 Tous les postes dans Firebase:', [...new Set(tousLesElus.map(e => e.poste))]);
        }

        // Debug pour voir les élus chargés
        console.log('🔍 ÉLUS CHARGÉS:', {
          total: tousLesElus.length,
          deputes: tousLesElus.filter(e => e.poste === 'Députés').length,
          senateurs: tousLesElus.filter(e => e.poste === 'Sénateurs').length,
          conseillers: tousLesElus.filter(e => e.poste === 'Conseiller territorial' || e.poste === 'Président CTG' || e.poste === 'Vice-Président CTG' || e.poste?.includes('Président') || e.poste?.includes('Vice') || e.poste?.includes('VP') || e.poste?.includes('Éducation') || ['Gabriel Serville', 'Jean-Paul Fereira', 'Annie Robinson-Chocho', 'Thibault Lechat-Vega', 'Patricia Saïd', 'Philippe Bouba', 'Aïssatou Chambaud', 'Roger Aron', 'Samantha Cyriaque', 'Chester Leonce', 'Bernadette Dulonca', 'Emmanuel Prince', 'Karine Cresson-Ibris', 'Jean-Luc Le West', 'Tiarrah Steenwinkel', 'Raymond Déyé'].includes(e.name)).length,
          maires: mairesFromFirebase.length
        });
        console.log('📋 LISTE DES ÉLUS:', tousLesElus.map(e => `${e.name} (${e.poste})`));
        
        setLoading(false);
        
      } catch (err) {
        console.error('❌ Erreur générale:', err);
        setLoading(false);
        
        // Fallback
        setCommunes(communesIntegrees);
        setElus([]);
        setDeputes(deputesData);
        setSenateurs(senateursData);
        console.log('🔍 Députés chargés:', deputesData.length);
        console.log('🔍 Sénateurs chargés:', senateursData.length);
        setConseillers(conseillersTerritoriaux);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);// COMPOSANT DE CHARGEMENT
  if (loading) {
    return (
      <div className="app-modern">
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="gradient-text">Oroyo</span>
              </h1>
              <p className="hero-subtitle">Chargement des données de la Guyane française...</p>
              <div style={{textAlign: 'center', marginTop: '2rem'}}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f3f4f6',
                  borderTop: '4px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto'
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // COMPOSANT STAR RATING
  const StarRating = ({ rating, onRate, interactive = false }) => {
    const [hoverRating, setHoverRating] = useState(0);
    
    return (
      <div className="star-rating-container">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= (hoverRating || rating);
          return (
          <Star
            key={star}
              size={20}
              className={`star ${isActive ? 'active' : ''}`}
              style={{
                cursor: interactive ? 'pointer' : 'default',
                color: isActive ? '#fbbf24' : '#d1d5db',
                fill: isActive ? '#fbbf24' : 'none',
                transition: 'all 0.2s'
              }}
            onClick={interactive ? () => onRate(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          />
          );
        })}
      </div>
    );
  };



  // ÉCRAN ÉDUCATION POLITIQUE
  if (currentScreen === 'education') {
    return <EducationPolitique setCurrentScreen={setCurrentScreen} />;
  }

  // ÉCRAN ÉDUCATION POLITIQUE AVANCÉE
  if (currentScreen === 'educationAvancee') {
    return <EducationPolitiqueAvancee setCurrentScreen={setCurrentScreen} />;
  }

  // ÉCRAN HOME MODERNE
  if (currentScreen === 'popularite') {
  // Obtenir les meilleurs élus de chaque catégorie
  const topMaires = getTopRatedElus(elus.filter(elu => elu.poste === 'Maire'));
  const topDeputes = getTopRatedElus(deputesData);
  const topSenateurs = getTopRatedElus(senateursData);
  const topConseillers = getTopRatedElus(conseillers);

  return (
    <div className="app-modern">
              <Header 
          title="Popularité"
          subtitle="Classement des élus les mieux notés"
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          setCurrentTab={setCurrentTab}
          showMiniNav={showMiniNav}
          changeScreenAndResetSearch={changeScreenAndResetSearch}
        >
        <div className="header-right">
          {user ? (
            <UserButton 
              user={user} 
              onSignOut={handleSignOut}
            />
          ) : (
            <button 
              className="login-button"
              onClick={() => setShowAuthModal(true)}
            >
              <UserPlus size={20} />
              Se connecter
            </button>
          )}
        </div>
      </Header>

      <div className="content-section">
        <div className="container">
          {topMaires.length > 0 && (
            <RankingSection
              title="🏆 Top Maires les mieux notés"
              elus={topMaires}
              setSelectedElu={setSelectedElu}
              setCurrentScreen={setCurrentScreen}
            />
          )}
          {topDeputes.length > 0 && (
            <RankingSection
              title="🏆 Top Députés les mieux notés"
              elus={topDeputes}
              setSelectedElu={setSelectedElu}
              setCurrentScreen={setCurrentScreen}
            />
          )}
          {topSenateurs.length > 0 && (
            <RankingSection
              title="🏆 Top Sénateurs les mieux notés"
              elus={topSenateurs}
              setSelectedElu={setSelectedElu}
              setCurrentScreen={setCurrentScreen}
            />
          )}
          {topConseillers.length > 0 && (
            <RankingSection
              title="🏆 Top Conseillers territoriaux les mieux notés"
              elus={topConseillers}
              setSelectedElu={setSelectedElu}
              setCurrentScreen={setCurrentScreen}
            />
          )}
        </div>
      </div>
    </div>
  );
}

if (currentScreen === 'home' || currentScreen === 'communes') {
    return (
      <div className="app-modern">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            {/* Bouton de connexion */}
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              {user ? (
                <UserButton 
                  user={user} 
                  onSignOut={handleSignOut}
                />
              ) : (
                <button 
                  className="login-button"
                  onClick={() => {
                    console.log('🔄 Clic sur le bouton Se connecter');
                    setShowAuthModal(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  <UserPlus size={18} />
                  Se connecter
                </button>
              )}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
              marginBottom: '1rem'
            }}>
              <h1 className="hero-title" style={{ margin: 0 }}>
                <span className="gradient-text">Oroyo</span>
              </h1>
              {/* Statistiques compactes à droite du titre */}
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.375rem 0.5rem',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '6px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  minWidth: '45px'
                }}>
                  <span style={{
                    color: '#60a5fa',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    lineHeight: '1'
                  }}>22</span>
                  <span style={{
                    color: '#94a3b8',
                    fontSize: '0.5rem',
                    fontWeight: '500',
                    lineHeight: '1',
                    marginTop: '2px'
                  }}>Communes</span>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.375rem 0.5rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '6px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  minWidth: '45px'
                }}>
                  <span style={{
                    color: '#10b981',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    lineHeight: '1'
                  }}>55+</span>
                  <span style={{
                    color: '#94a3b8',
                    fontSize: '0.5rem',
                    fontWeight: '500',
                    lineHeight: '1',
                    marginTop: '2px'
                  }}>Élus</span>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.375rem 0.5rem',
                  backgroundColor: 'rgba(168, 85, 247, 0.1)',
                  borderRadius: '6px',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                  minWidth: '45px'
                }}>
                  <span style={{
                    color: '#a855f7',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    lineHeight: '1'
                  }}>1k+</span>
                  <span style={{
                    color: '#94a3b8',
                    fontSize: '0.5rem',
                    fontWeight: '500',
                    lineHeight: '1',
                    marginTop: '2px'
                  }}>Citoyens</span>
                </div>
              </div>
            </div>
            <p className="hero-subtitle" style={{
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              La plateforme citoyenne pour évaluer et communiquer<br />
              avec vos élus en Guyane française
            </p>
          </div>
        </div>

        {/* Barre de statistiques */}
        {/* En-tête principal avec slogan */}
        <div className="main-header" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          marginBottom: '2rem'
        }}>
          <div className="slogan-container" style={{
            textAlign: 'center'
          }}>
            <h1 className="slogan-text" style={{
              color: '#e2e8f0',
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: '700',
              margin: 0,
              letterSpacing: '0.05em',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              background: 'linear-gradient(135deg, #60A5FA, #818CF8, #A78BFA)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'sloganGlow 3s ease-in-out infinite alternate'
            }}>
              A Nou Mem Ke Nou Mem
            </h1>
            <div style={{
              width: '100px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #60A5FA, transparent)',
              margin: '0.5rem auto',
              borderRadius: '1px'
            }}></div>
          </div>
        </div>

        {/* Bouton Comment ça marche - Style spécial */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '2rem 0',
          padding: '0 1rem'
        }}>
          <button 
            className={`education-special-button ${currentScreen === 'education' ? 'active' : ''}`}
            onClick={() => changeScreenAndResetSearch('education')}
            style={{
              background: currentScreen === 'education' 
                ? 'linear-gradient(135deg, #8B5CF6, #A78BFA)' 
                : 'linear-gradient(135deg, #4C1D95, #6D28D9)',
              border: 'none',
              borderRadius: '25px',
              padding: '1rem 2rem',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: currentScreen === 'education'
                ? '0 8px 25px rgba(139, 92, 246, 0.4)'
                : '0 4px 15px rgba(76, 29, 149, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transform: currentScreen === 'education' ? 'translateY(-2px)' : 'translateY(0)',
              minWidth: '200px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (currentScreen !== 'education') {
                e.target.style.background = 'linear-gradient(135deg, #5B21B6, #7C3AED)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(91, 33, 182, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentScreen !== 'education') {
                e.target.style.background = 'linear-gradient(135deg, #4C1D95, #6D28D9)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(76, 29, 149, 0.3)';
              }
            }}
          >
            <Book size={20} />
            Comment ça marche ?
          </button>
        </div>

        {/* Modal d'authentification */}
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}



        {/* Menu de navigation en bulles */}
        <nav className="menu-bubble-bar">
          <button 
            className={`menu-bubble ${currentScreen === 'communes' ? 'active' : ''}`}
            onClick={() => changeScreenAndResetSearch('communes', 'communes')}
            data-type="communes"
          >
            <div className="bubble-icon-wrapper">
              <Building className="bubble-icon" />
            </div>
            Communes
          </button>
          <button 
            className={`menu-bubble ${currentScreen === 'maires' ? 'active' : ''}`}
            onClick={() => changeScreenAndResetSearch('maires')}
            data-type="maires"
          >
            <div className="bubble-icon-wrapper">
              <Crown className="bubble-icon" />
            </div>
            Maires
          </button>
          <button 
            className={`menu-bubble ${currentScreen === 'deputes' ? 'active' : ''}`}
            onClick={() => changeScreenAndResetSearch('deputes')}
            data-type="deputes"
          >
            <div className="bubble-icon-wrapper">
              <Vote className="bubble-icon" />
            </div>
            Députés
          </button>
          <button 
            className={`menu-bubble ${currentScreen === 'senateurs' ? 'active' : ''}`}
            onClick={() => changeScreenAndResetSearch('senateurs')}
            data-type="senateurs"
          >
            <div className="bubble-icon-wrapper">
              <Scale className="bubble-icon" />
            </div>
            Sénateurs
          </button>
          <button 
            className={`menu-bubble ${currentScreen === 'ctg' ? 'active' : ''}`}
            onClick={() => changeScreenAndResetSearch('ctg')}
            data-type="ctg"
          >
            <div className="bubble-icon-wrapper">
              <Globe2 className="bubble-icon" />
            </div>
            CTG
          </button>
          <button 
            className={`menu-bubble ${currentScreen === 'popularite' ? 'active' : ''}`}
            onClick={() => changeScreenAndResetSearch('popularite')}
            data-type="popularite"
          >
            <div className="bubble-icon-wrapper">
              <Star className="bubble-icon" />
            </div>
            Popularité
          </button>
        </nav>

        {/* Header avec bouton de connexion */}
        <Header
          title="Communes de Guyane"
          subtitle="Découvrez les 22 communes de Guyane"
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          setCurrentTab={setCurrentTab}
          showMiniNav={showMiniNav}
          changeScreenAndResetSearch={changeScreenAndResetSearch}
        />

        {/* Modal d'authentification */}
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}

        {/* Contenu selon l'onglet sélectionné */}
        <div className="content-section">
          <div className="container">
            {currentTab === 'communes' && (
              <>
                {/* Search Section */}
                <div className="search-card-modern" style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '16px',
                  padding: '2rem',
                  marginBottom: '2rem'
                }}>
                  {/* En-tête et barre de recherche */}
                  <div style={{marginBottom: '1.5rem'}}>
                    <h2 style={{
                      color: '#e2e8f0',
                      marginBottom: '1.5rem',
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                        borderRadius: '10px',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Landmark size={20} style={{color: 'white'}} />
                      </div>
                      Rechercher dans la base de données Oroyo
                    </h2>
                    <div className="search-box-modern" style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <Search size={20} style={{
                        position: 'absolute',
                        left: '1rem',
                        color: '#94a3b8'
                      }} />
                      <input
                        type="text"
                        placeholder="Une ville, un maire, un député, un sénateur..."
                        value={searchTerm}
                        onChange={(e) => {
                          const newSearchTerm = e.target.value;
                          setSearchTerm(newSearchTerm);
                          
                          // Debug spécial pour "celine"
                          if (normalizeString(newSearchTerm) === 'celine') {
                            console.log('🔍 RECHERCHE "celine" - Total élus chargés:', elus.length);
                            console.log('📝 Tous les noms d\'élus:', elus.map(e => e.name));
                            console.log('🏷️ Tous les postes:', [...new Set(elus.map(e => e.poste))]);
                            
                            // Chercher tous les élus contenant "celine" (normalisé)
                            const matches = elus.filter(elu => 
                              normalizeString(elu.name).includes('celine')
                            );
                            console.log(`🎯 Élus trouvés avec "celine" (normalisé):`, matches);
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '0.875rem 1rem 0.875rem 2.75rem',
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          color: '#e2e8f0',
                          fontSize: '0.9375rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Informations et tri */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.15)'
                  }}>
                    {/* Nombre de communes */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Map size={18} style={{color: 'white'}} />
                      </div>
                      <div>
                        <span style={{
                          color: '#e2e8f0',
                          fontSize: '0.9375rem',
                          fontWeight: '600'
                        }}>
                          {communes.length} communes
                        </span>
                        <span style={{
                          color: '#94a3b8',
                          fontSize: '0.8125rem',
                          marginLeft: '0.5rem'
                        }}>
                          de Guyane française
                        </span>
                      </div>
                    </div>

                    {/* Option de tri */}
                    <div
                      onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        backgroundColor: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        userSelect: 'none'
                      }}
                    >
                      <Users size={16} style={{color: '#3b82f6'}} />
                      <span style={{
                        color: '#94a3b8',
                        fontSize: '0.8125rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <span style={{color: '#3b82f6'}}>Tri :</span> Population {sortOrder === 'desc' ? '↓' : '↑'}
                      </span>
                    </div>
                  </div>

                  {/* Boutons d'import si des données manquent */}
                  {(elus.filter(e => e.poste === 'Députés').length === 0 || 
                    elus.filter(e => e.poste === 'Sénateurs').length === 0 || 
                    elus.filter(e => e.poste === 'Conseiller territorial' || e.poste === 'Président CTG' || e.poste?.includes('Président') || e.poste?.includes('Vice') || e.poste?.includes('VP') || e.poste?.includes('Éducation') || ['Gabriel Serville', 'Jean-Paul Fereira', 'Annie Robinson-Chocho', 'Thibault Lechat-Vega', 'Patricia Saïd', 'Philippe Bouba', 'Aïssatou Chambaud', 'Roger Aron', 'Samantha Cyriaque', 'Chester Leonce', 'Bernadette Dulonca', 'Emmanuel Prince', 'Karine Cresson-Ibris', 'Jean-Luc Le West', 'Tiarrah Steenwinkel', 'Raymond Déyé'].includes(e.name)).length === 0) && (
                    <div style={{
                      padding: '1rem',
                      backgroundColor: 'rgba(251, 191, 36, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(251, 191, 36, 0.2)',
                      marginTop: '1rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.75rem'
                      }}>
                        <AlertCircle size={18} style={{color: '#f59e0b'}} />
                        <span style={{color: '#f59e0b', fontSize: '0.875rem', fontWeight: '600'}}>
                          Données manquantes - Cliquez pour importer :
                        </span>
                      </div>
                      <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                        {elus.filter(e => e.poste === 'Députés').length === 0 && (
                          <button 
                            onClick={importDeputes}
                            style={{
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '0.5rem 1rem',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              transition: 'all 0.2s'
                            }}
                          >
                            <UserPlus size={14} />
                            Importer les Députés
                          </button>
                        )}
                        {elus.filter(e => e.poste === 'Sénateurs').length === 0 && (
                          <button 
                            onClick={importSenateurs}
                            style={{
                              backgroundColor: '#7c3aed',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '0.5rem 1rem',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              transition: 'all 0.2s'
                            }}
                          >
                            <UserPlus size={14} />
                            Importer les Sénateurs
                          </button>
                        )}
                        {elus.filter(e => e.poste === 'Conseiller territorial' || e.poste === 'Président CTG' || e.poste?.includes('Président') || e.poste?.includes('Vice') || e.poste?.includes('VP') || e.poste?.includes('Éducation') || e.name === 'Jean-Paul Fereira' || e.name === 'Annie Robinson-Chocho').length === 0 && (
                          <button 
                            onClick={importConseillersTerritoriaux55}
                            style={{
                              backgroundColor: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '0.5rem 1rem',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              transition: 'all 0.2s'
                            }}
                          >
                            <UserPlus size={14} />
                            Importer la CTG
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Communes Grid Moderne */}
                <div className="communes-grid-modern" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {/* Afficher les communes qui correspondent */}
                  {communes
                    .filter(commune =>
                      commune.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (commune.description && commune.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                      (commune.region && commune.region.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .sort((a, b) => {
                      const popA = a.population || 0;
                      const popB = b.population || 0;
                      return sortOrder === 'desc' ? popB - popA : popA - popB;
                    })
                    .map((commune) => (
                      <div
                        key={commune.id}
                      onClick={() => {
                          setSelectedCommune(commune);
                        setCurrentScreen('postes');
                      }}
                        className="commune-card-modern"
                        style={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem'
                        }}
                      >
                        <div className="commune-icon" style={{
                          backgroundColor: '#3b82f6',
                          borderRadius: '12px',
                          padding: '1rem',
                          color: 'white'
                        }}>
                          <MapPin size={24} />
                        </div>
                        <div className="commune-info" style={{flex: 1}}>
                          <h3 style={{color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '600'}}>
                            {commune.name}
                          </h3>
                          <p className="commune-description" style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                            {commune.description || 'Commune de Guyane'}
                          </p>
                          <div className="commune-meta" style={{display: 'flex', gap: '1rem', fontSize: '0.75rem'}}>
                            <span className="commune-population" style={{color: '#10b981'}}>
                              👥 {commune.population ? commune.population.toLocaleString() : 'N/A'} hab.
                            </span>
                            <span className="commune-region" style={{color: '#f59e0b'}}>
                              📍 {commune.region || 'Guyane'}
                            </span>
                          </div>
                        </div>
                        <div className="commune-arrow" style={{color: '#94a3b8'}}>
                          <ChevronDown size={20} />
                        </div>
                      </div>
                    ))}
                  {/* Afficher les MAIRES qui correspondent au nom */}
                  {elus
                    .filter(elu => {
                      const nameMatch = searchTerm.length > 0 && 
                                      normalizeString(elu.name).includes(normalizeString(searchTerm)) &&
                                      elu.poste === 'Maire'; // Seulement les maires dans cette section
                      
                      // Debug : afficher dans la console les maires trouvés
                      if (normalizeString(searchTerm).includes('celine') && nameMatch) {
                        console.log('🔍 Maire trouvé avec "celine" (normalisé):', elu);
                      }
                      
                      return nameMatch;
                    })
                    // Éliminer les doublons par nom et commune
                    .filter((elu, index, array) => 
                      array.findIndex(e => e.name === elu.name && e.commune === elu.commune) === index
                    )
                    .map((elu) => (
                      <div
                        key={elu.id}
                        className="commune-card-modern"
                        style={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #f59e0b', // Bordure orange pour les maires
                          borderRadius: '12px',
                          padding: '1.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem'
                        }}
                      onClick={() => {
                          setSelectedElu(elu);
                          setCurrentScreen('profil');
                        }}
                      >
                        <div className="commune-icon" style={{
                          backgroundColor: '#f59e0b', // Orange pour les maires
                          borderRadius: '12px',
                          padding: '1rem',
                          color: 'white'
                        }}>
                          <Crown size={24} />
                        </div>
                        <div className="commune-info" style={{flex: 1}}>
                          <h3 style={{color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '600'}}>
                            {elu.name}
                          </h3>
                          <p className="commune-description" style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                            👑 Maire de {elu.commune}
                          </p>
                          <div className="commune-meta" style={{display: 'flex', gap: '1rem', fontSize: '0.75rem'}}>
                            <span style={{color: '#f59e0b'}}>
                              🏛️ {elu.parti || 'Parti non spécifié'}
                            </span>
                            {elu.mandat && (
                              <span style={{color: '#94a3b8'}}>
                                📅 {elu.mandat}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="commune-arrow" style={{color: '#94a3b8'}}>
                          <ChevronDown size={20} />
                        </div>
                      </div>
                    ))}
                  
                  {/* Afficher les députés qui correspondent au nom */}
                  {elus
                    .filter(elu =>
                      searchTerm.length > 0 &&
                      elu.poste === 'Députés' &&
                      elu.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    // Éliminer les doublons par nom
                    .filter((elu, index, array) => 
                      array.findIndex(e => e.name === elu.name) === index
                    )
                    .map((depute) => (
                      <div
                        key={`depute-${depute.id}`}
                        className="commune-card-modern"
                        style={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #3b82f6',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem'
                        }}
                        onClick={() => {
                          setSelectedElu(depute);
                          setCurrentScreen('profil');
                        }}
                      >
                        <div className="commune-icon" style={{
                          backgroundColor: '#3b82f6',
                          borderRadius: '12px',
                          padding: '1rem',
                          color: 'white'
                        }}>
                          <Users size={24} />
                        </div>
                        <div className="commune-info" style={{flex: 1}}>
                          <h3 style={{color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '600'}}>
                            {depute.name}
                          </h3>
                          <p className="commune-description" style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                            🗳️ Député - {depute.circonscription || 'Guyane'}
                          </p>
                          <div className="commune-meta" style={{display: 'flex', gap: '1rem', fontSize: '0.75rem'}}>
                            <span style={{color: '#3b82f6'}}>
                              🏛️ {depute.parti || 'Parti non spécifié'}
                            </span>
                          </div>
                        </div>
                        <div className="commune-arrow" style={{color: '#94a3b8'}}>
                          <ChevronDown size={20} />
                        </div>
                      </div>
                    ))}

                  {/* Afficher les sénateurs qui correspondent au nom */}
                  {elus
                    .filter(elu =>
                      searchTerm.length > 0 &&
                      elu.poste === 'Sénateurs' &&
                      elu.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    // Éliminer les doublons par nom
                    .filter((elu, index, array) => 
                      array.findIndex(e => e.name === elu.name) === index
                    )
                    .map((senateur) => (
                      <div
                        key={`senateur-${senateur.id}`}
                        className="commune-card-modern"
                        style={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #7c3aed',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem'
                        }}
                        onClick={() => {
                          setSelectedElu(senateur);
                          setCurrentScreen('profil');
                        }}
                      >
                        <div className="commune-icon" style={{
                          backgroundColor: '#7c3aed',
                          borderRadius: '12px',
                          padding: '1rem',
                          color: 'white'
                        }}>
                          <Users size={24} />
                        </div>
                        <div className="commune-info" style={{flex: 1}}>
                          <h3 style={{color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '600'}}>
                            {senateur.name}
                          </h3>
                          <p className="commune-description" style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                            ⚖️ Sénateur de la Guyane
                          </p>
                          <div className="commune-meta" style={{display: 'flex', gap: '1rem', fontSize: '0.75rem'}}>
                            <span style={{color: '#7c3aed'}}>
                              🏛️ {senateur.parti || 'Parti non spécifié'}
                            </span>
                            {senateur.particularite && (
                              <span style={{color: '#f59e0b'}}>
                                ⭐ {senateur.particularite}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="commune-arrow" style={{color: '#94a3b8'}}>
                          <ChevronDown size={20} />
                        </div>
                      </div>
                    ))}

                  {/* Afficher les conseillers territoriaux qui correspondent au nom */}
                  {elus
                    .filter(elu =>
                      searchTerm.length > 0 &&
                      (elu.poste === 'Conseiller territorial' || elu.poste === 'Président CTG' || elu.poste === 'Vice-Président CTG' || elu.poste?.includes('Président') || elu.poste?.includes('Vice') || elu.poste?.includes('VP') || elu.poste?.includes('Éducation') || ['Gabriel Serville', 'Jean-Paul Fereira', 'Annie Robinson-Chocho', 'Thibault Lechat-Vega', 'Patricia Saïd', 'Philippe Bouba', 'Aïssatou Chambaud', 'Roger Aron', 'Samantha Cyriaque', 'Chester Leonce', 'Bernadette Dulonca', 'Emmanuel Prince', 'Karine Cresson-Ibris', 'Jean-Luc Le West', 'Tiarrah Steenwinkel', 'Raymond Déyé'].includes(elu.name)) &&
                      elu.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    // Éliminer les doublons par nom
                    .filter((elu, index, array) => 
                      array.findIndex(e => e.name === elu.name) === index
                    )
                    .map((conseiller) => (
                      <div
                        key={`conseiller-${conseiller.id}`}
                        className="commune-card-modern"
                        style={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #10b981',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem'
                        }}
                        onClick={() => {
                          setSelectedElu(conseiller);
                          setCurrentScreen('profil');
                        }}
                      >
                        <div className="commune-icon" style={{
                          backgroundColor: '#10b981',
                          borderRadius: '12px',
                          padding: '1rem',
                          color: 'white'
                        }}>
                          <Users size={24} />
                        </div>
                        <div className="commune-info" style={{flex: 1}}>
                          <h3 style={{color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '600'}}>
                            {conseiller.name}
                          </h3>
                          <p className="commune-description" style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                            🏛️ {conseiller.poste} - {conseiller.secteur || conseiller.commune}
                          </p>
                          <div className="commune-meta" style={{display: 'flex', gap: '1rem', fontSize: '0.75rem'}}>
                            <span style={{color: '#10b981'}}>
                              📍 {conseiller.commune || 'CTG'}
                            </span>
                          </div>
                        </div>
                        <div className="commune-arrow" style={{color: '#94a3b8'}}>
                          <ChevronDown size={20} />
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}{currentTab === 'deputes' && (
              <>
                <div className="search-card-modern" style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '16px',
                  padding: '2rem',
                  marginBottom: '2rem'
                }}>
                  <h2 style={{color: '#e2e8f0', marginBottom: '1rem'}}>🗳️ Députés de la Guyane</h2>
                  <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>
                    Les 2 députés représentent la Guyane à l'Assemblée nationale
                  </p>
                  
                  {/* -- MODIFICATION ICI -- */}
                  {deputes.length === 0 && (
                    <div style={{marginTop: '1rem'}}>
                      <button 
                        onClick={importElusNationaux}
                        // ... autres propriétés
                      >
                        <UserPlus size={18} />
                        {importingElus ? '⏳ Import en cours...' : '🚀 IMPORTER LES DÉPUTÉS'}
                      </button>
                    </div>
                  )}
                  {/* -- FIN DE LA MODIFICATION -- */}
                </div>


                <div className="elus-grid-modern">
                  {deputes.map((depute) => (
                    <div key={depute.id} className="elu-card-modern">
                      <div className="elu-header">
                        <div className="elu-avatar-modern" style={{backgroundColor: '#3b82f6'}}>
                          <Users size={32} />
                        </div>
                        <div className="elu-info-modern">
                          <h3>{depute.name}</h3>
                          <p>{depute.circonscription}</p>
                          <div className="elu-badges">
                            <span className="badge badge-parti">{depute.parti}</span>
                            <span className="badge badge-mandat">{depute.mandat}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="elu-details">
                        <p><strong>Commission :</strong> {depute.commission}</p>
                        <p><strong>Groupe :</strong> {depute.groupe}</p>
                      </div>

                      <div className="elu-rating-modern">
                        <StarRating rating={depute.rating || 0} />
                        <span className="rating-text">
                          {depute.rating || 0}/5 ({depute.totalVotes || 0} votes)
                        </span>
                      </div>
                      
                      <button className="btn-main">
                        Voir le profil complet
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentTab === 'senateurs' && (
              <>
                <div className="search-card-modern" style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '16px',
                  padding: '2rem',
                  marginBottom: '2rem'
                }}>
                  <h2 style={{color: '#e2e8f0', marginBottom: '1rem'}}>⚖️ Sénateurs de la Guyane</h2>
                  <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>
                    Les 2 sénateurs représentent la Guyane au Sénat
                  </p>
                  
                  {/* -- MODIFICATION ICI -- */}
                  {senateurs.length === 0 && (
                    <div style={{marginTop: '1rem'}}>
                      <button 
                        onClick={importElusNationaux}
                        // ... autres propriétés
                      >
                        <UserPlus size={18} />
                        {importingElus ? '⏳ Import en cours...' : '🚀 IMPORTER LES SÉNATEURS'}
                      </button>
            </div>
                  )}
                  {/* -- FIN DE LA MODIFICATION -- */}
          </div>


                <div className="elus-grid-modern">
                  {senateurs.map((senateur) => (
                    <div key={senateur.id} className="elu-card-modern">
                      <div className="elu-header">
                        <div className="elu-avatar-modern" style={{backgroundColor: '#7c3aed'}}>
                          <Users size={32} />
                        </div>
                        <div className="elu-info-modern">
                          <h3>{senateur.name}</h3>
                          <p>Sénateur de la Guyane</p>
                          <div className="elu-badges">
                            <span className="badge badge-parti">{senateur.parti}</span>
                            <span className="badge badge-mandat">{senateur.mandat}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="elu-details">
                        {senateur.fonction_speciale && (
                          <p><strong>Fonction :</strong> {senateur.fonction_speciale}</p>
                        )}
                        {senateur.particularite && (
                          <p className="particularite">⭐ {senateur.particularite}</p>
                        )}
                      </div>

                      <div className="elu-rating-modern">
                        <StarRating rating={senateur.rating || 0} />
                        <span className="rating-text">
                          {senateur.rating || 0}/5 ({senateur.totalVotes || 0} votes)
                        </span>
                      </div>
                      
                      <button className="btn-main btn-purple">
                        Voir le profil complet
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {currentTab === 'conseillers' && (
              <>
                <div className="search-card-modern" style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '16px',
                  padding: '2rem',
                  marginBottom: '2rem'
                }}>
                  <h2 style={{color: '#e2e8f0', marginBottom: '1rem'}}>🌐 Conseillers Territoriaux de Guyane</h2>
                  <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>
                    L'Assemblée de Guyane compte 51 conseillers territoriaux
                  </p>
                  
                  {/* -- MODIFICATION ICI -- */}
                  {conseillers.length === 0 && (
                    <div style={{marginTop: '1rem'}}>
                <button
                        onClick={importElusNationaux}
                        // ... autres propriétés
                      >
                        <UserPlus size={18} />
                        {importingElus ? '⏳ Import en cours...' : '🚀 IMPORTER LES CONSEILLERS'}
                      </button>
                  </div>
                  )}
                  {/* -- FIN DE LA MODIFICATION -- */}
                </div>


                <div className="elus-grid-modern">
                  {conseillers.map((conseiller) => (
                    <div key={conseiller.id} className="elu-card-modern">
                      <div className="elu-header">
                        <div className="elu-avatar-modern" style={{
                          backgroundColor: conseiller.poste.includes('Président') ? '#f59e0b' : '#ec4899'
                        }}>
                          <Users size={32} />
                        </div>
                        <div className="elu-info-modern">
                          <h3>{conseiller.name}</h3>
                          <p>{conseiller.poste}</p>
                          <div className="elu-badges">
                            <span className="badge badge-parti">{conseiller.parti}</span>
                            <span className="badge badge-mandat">{conseiller.mandat}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="elu-details">
                        {conseiller.fonction_speciale && (
                          <p><strong>Fonction :</strong> {conseiller.fonction_speciale}</p>
                        )}
                        {conseiller.particularite && (
                          <p className="particularite">⭐ {conseiller.particularite}</p>
                        )}
                      </div>

                      <div className="elu-rating-modern">
                        <StarRating rating={conseiller.rating || 0} />
                        <span className="rating-text">
                          {conseiller.rating || 0}/5 ({conseiller.totalVotes || 0} votes)
                        </span>
                      </div>
                      
                      <button className={`btn-main ${conseiller.poste.includes('Président') ? 'btn-orange' : 'btn-pink'}`}>
                        Voir le profil complet
                </button>
                    </div>
              ))}
            </div>
              </>
            )}

            {/* Message si aucune ville ou élu trouvé (pour l'onglet communes) */}
            {currentTab === 'communes' && communes.filter(commune => 
              commune.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (commune.description && commune.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (commune.region && commune.region.toLowerCase().includes(searchTerm.toLowerCase()))
            ).length === 0 && communes.length > 0 && (
              <div style={{textAlign: 'center', padding: '3rem', color: '#94a3b8'}}>
                <Search size={48} style={{marginBottom: '1rem', opacity: 0.5}} />
                <h3 style={{color: '#cbd5e1', marginBottom: '0.5rem'}}>Aucune ville ou élu trouvé</h3>
                <p>Essayez avec un autre terme de recherche</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }// ÉCRAN POSTES (pour les communes)
  if (currentScreen === 'postes') {
    return (
      <div className="app-modern">
        <div className="header-modern" style={{
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          padding: '1rem 0'
        }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div className="header-nav" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <button
              onClick={() => setCurrentScreen('communes')}
                className="btn-back-modern"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#374151',
                  color: '#e5e7eb',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={20} />
              Retour
            </button>
              <div className="header-info">
                <h1 className="header-title" style={{color: '#e2e8f0', fontSize: '1.5rem', fontWeight: '700', margin: 0}}>
                  {selectedCommune?.name}
                </h1>
                <p className="header-subtitle" style={{color: '#94a3b8', fontSize: '0.875rem', margin: 0}}>
                  Sélectionnez le type d'élu que vous souhaitez évaluer
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="content-section" style={{ padding: '2rem 0' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
            <div className="postes-grid-modern" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              padding: '1rem 0'
            }}>
              {/* Maire */}
              <div
                onClick={() => {
                  setSelectedPoste({ id: 'maire', name: 'Maire', description: 'Le maire de la commune' });
                  setCurrentScreen('elus');
                }}
                className="poste-card-modern"
                style={{
                  backgroundColor: '#1e293b',
                  border: '2px solid #334155',
                  borderRadius: '16px',
                  padding: '2rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  minHeight: '200px',
                  justifyContent: 'center'
                }}
              >
                <div className="poste-icon-wrapper" style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                }}>
                  <Crown size={32} style={{ color: 'white' }} />
                </div>
                <h3 style={{
                  color: '#e2e8f0',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Maire
                </h3>
              </div>

              {/* Adjoints au Maire */}
              <div
                onClick={() => {
                  setSelectedPoste({ id: 'adjoints', name: 'Adjoints au Maire', description: 'Les adjoints au maire' });
                  setCurrentScreen('elus');
                }}
                className="poste-card-modern"
                style={{
                  backgroundColor: '#1e293b',
                  border: '2px solid #334155',
                  borderRadius: '16px',
                  padding: '2rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  minHeight: '200px',
                  justifyContent: 'center'
                }}
              >
                <div className="poste-icon-wrapper" style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#8b5cf6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                }}>
                  <Users size={32} style={{ color: 'white' }} />
                </div>
                <h3 style={{
                  color: '#e2e8f0',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Adjoints au Maire
                </h3>
              </div>

              {/* Conseillers Municipaux */}
              <div
                onClick={() => {
                  setSelectedPoste({ id: 'conseillers-municipaux', name: 'Conseillers Municipaux', description: 'Les conseillers municipaux' });
                  setCurrentScreen('elus');
                }}
                className="poste-card-modern"
                style={{
                  backgroundColor: '#1e293b',
                  border: '2px solid #334155',
                  borderRadius: '16px',
                  padding: '2rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  minHeight: '200px',
                  justifyContent: 'center'
                }}
              >
                <div className="poste-icon-wrapper" style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#a855f7',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)'
                }}>
                  <Building size={32} style={{ color: 'white' }} />
                </div>
                <h3 style={{
                  color: '#e2e8f0',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Conseillers Municipaux
                </h3>
              </div>

              {/* Conseillers Intercommunaux */}
              <div
                onClick={() => {
                  setSelectedPoste({ id: 'conseillers-intercommunaux', name: 'Conseillers Intercommunaux', description: 'Les conseillers intercommunaux' });
                  setCurrentScreen('elus');
                }}
                className="poste-card-modern"
                style={{
                  backgroundColor: '#1e293b',
                  border: '2px solid #334155',
                  borderRadius: '16px',
                  padding: '2rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  minHeight: '200px',
                  justifyContent: 'center'
                }}
              >
                <div className="poste-icon-wrapper" style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#ec4899',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
                }}>
                  <Globe2 size={32} style={{ color: 'white' }} />
                </div>
                <h3 style={{
                  color: '#e2e8f0',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Conseillers<br/>Intercommunaux
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ÉCRAN ÉLUS LOCAUX
  if (currentScreen === 'elus') {
    const filteredElus = elus.filter(elu => 
      elu.commune === selectedCommune?.name && elu.poste === selectedPoste?.name
    );

    return (
      <div className="app-modern">
        <div className="header-modern" style={{
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          padding: '1rem 0'
        }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div className="header-nav" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <button
              onClick={() => setCurrentScreen('postes')}
                className="btn-back-modern"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#374151',
                  color: '#e5e7eb',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={20} />
              Retour
            </button>
              <div className="header-info">
                <h1 className="header-title" style={{color: '#e2e8f0', fontSize: '1.5rem', fontWeight: '700', margin: 0}}>
                  {selectedPoste?.name}
                </h1>
                <p className="header-subtitle" style={{color: '#94a3b8', fontSize: '0.875rem', margin: 0}}>
                  {selectedCommune?.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="content-section" style={{padding: '2rem 0'}}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          {filteredElus.length > 0 ? (
              <div className="elus-grid-modern" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
              }}>
              {filteredElus.map((elu) => (
                  <div key={elu.id} className="elu-card-modern" style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}>
                    <div className="elu-header" style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                      <div className="elu-avatar-modern" style={{
                        backgroundColor: selectedPoste?.color || '#3b82f6',
                        borderRadius: '50%',
                        padding: '1rem',
                        color: 'white'
                      }}>
                        <Users size={32} />
                      </div>
                      <div className="elu-info-modern" style={{flex: 1}}>
                        <h3 
                  onClick={() => {
                    setSelectedElu(elu);
                            setCurrentScreen('profil');
                          }}
                          style={{
                            cursor: 'pointer',
                            color: '#3b82f6',
                            transition: 'color 0.2s',
                            margin: 0,
                            marginBottom: '0.25rem',
                            fontSize: '1.1rem',
                            fontWeight: '600'
                          }}
                        >
                          {elu.name}
                        </h3>
                        <p style={{color: '#94a3b8', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem'}}>
                          {elu.poste} - {elu.commune}
                        </p>
                        <div className="elu-rating-modern" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                          <StarRating rating={elu.rating || 0} />
                          <span style={{color: '#94a3b8', fontSize: '0.75rem'}}>
                            {elu.rating || 0}/5 ({elu.totalVotes || 0} votes)
                        </span>
                      </div>
                        <div className={`elu-status ${elu.status}`} style={{
                          marginTop: '0.5rem',
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          backgroundColor: elu.status === 'actuel' ? '#059669' : '#3b82f6',
                          color: 'white'
                        }}>
                          {elu.status === 'actuel' ? '🟢 En cours' : '🔵 Mandat passé'}
                    </div>
                  </div>
                    </div>
                    
                    {elu.parti && (
                      <div style={{marginBottom: '1rem'}}>
                        <span style={{
                          backgroundColor: '#374151',
                          color: '#e5e7eb',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem'
                        }}>
                          {elu.parti}
                        </span>
                        {elu.mandat && (
                          <span style={{
                            marginLeft: '0.5rem',
                            backgroundColor: '#7c3aed',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem'
                          }}>
                            {elu.mandat}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <button 
                      className="btn-profile-modern"
                      onClick={() => {
                        setSelectedElu(elu);
                        setCurrentScreen('profil');
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: selectedPoste?.color || '#3b82f6',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Voir le profil
                </button>
                  </div>
              ))}
            </div>
          ) : (
              <div className="empty-state-modern" style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: '#1e293b',
                borderRadius: '16px',
                border: '1px solid #334155'
              }}>
                <div className="empty-icon" style={{
                  backgroundColor: '#374151',
                  borderRadius: '50%',
                  padding: '2rem',
                  display: 'inline-block',
                  marginBottom: '1.5rem',
                  color: '#9ca3af'
                }}>
                  <Users size={64} />
                </div>
                <h3 style={{color: '#e2e8f0', marginBottom: '1rem', fontSize: '1.5rem'}}>Aucun élu trouvé</h3>
                <p style={{color: '#94a3b8', marginBottom: '1.5rem'}}>
                  Aucun élu n'est enregistré pour ce poste dans cette commune.
                </p>
                <p style={{color: '#3b82f6', fontSize: '0.875rem', marginBottom: '2rem'}}>
                  💡 Ajoutez des élus dans la collection "elus" de Firebase pour les voir ici !
                </p>
                
             {/* BOUTONS D'IMPORT AVEC LOGIQUE CONDITIONNELLE */}
              
              {/* BOUTON MAIRES - Visible seulement s'il n'y a aucun maire */}
              {!hasElusOfType(['Maire']) && (
                <div style={{textAlign: 'center'}}>
                  <button 
                    onClick={importVraisMaires}
                    disabled={importingElus}
                    style={{
                      backgroundColor: importingElus ? '#6b7280' : '#10b981',
                      color: 'white',
                      padding: '1rem 2rem',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: importingElus ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      margin: '0 auto',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      transition: 'all 0.3s'
                    }}
                  >
                    <UserPlus size={20} />
                    {importingElus ? '⏳ Import en cours...' : '🏛️ IMPORTER LES VRAIS MAIRES 2025'}
                  </button>
                  <p style={{color: '#94a3b8', fontSize: '0.875rem', marginTop: '1rem'}}>
                    ✅ <strong>Données officielles 2025</strong> - Les 22 vrais maires actuels + leurs équipes municipales
                  </p>
                  <p style={{color: '#10b981', fontSize: '0.75rem', marginTop: '0.5rem'}}>
                    📍 Maires vérifiés : Marie-Laure Phinéra-Horth (Cayenne), Sophie Charles (Saint-Laurent), François Ringuet (Kourou)...
                  </p>
            </div>
          )}

              {/* BOUTON ADJOINTS - Visible seulement s'il n'y a aucun adjoint */}
              {!hasElusOfType(['Adjoints au Maire']) && (
                <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
                  <button 
                    onClick={importAdjoints}
                    disabled={importingElus}
                    style={{
                      backgroundColor: importingElus ? '#6b7280' : '#f59e0b',
                      color: 'white',
                      padding: '1rem 2rem',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: importingElus ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      margin: '0 auto',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                      transition: 'all 0.3s'
                    }}
                  >
                    <UserPlus size={20} />
                    {importingElus ? '⏳ Import en cours...' : '👥 IMPORTER LES ADJOINTS AU MAIRE'}
                  </button>
                  <p style={{color: '#94a3b8', fontSize: '0.875rem', marginTop: '1rem'}}>
                    ✅ <strong>80+ adjoints au maire</strong> - Toutes les 22 communes avec leurs équipes municipales
                  </p>
                  <p style={{color: '#f59e0b', fontSize: '0.75rem', marginTop: '0.5rem'}}>
                    👥 Équipes complètes : Cayenne (14 adjoints), Saint-Laurent (12), Kourou (8), Matoury (6)...
                  </p>
                </div>
              )}

              {/* BOUTON DÉPUTÉS - Visible seulement s'il n'y a aucun député */}
              {(selectedPoste === 'Députés' && !hasElusOfType(['Députés'])) && (
                <div style={{textAlign: 'center'}}>
                  <button 
                    onClick={importDeputes}
                    disabled={importingElus}
                    style={{
                      backgroundColor: importingElus ? '#6b7280' : '#3b82f6',
                      color: 'white',
                      padding: '1rem 2rem',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: importingElus ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      margin: '0 auto',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                      transition: 'all 0.3s'
                    }}
                  >
                    <UserPlus size={20} />
                    {importingElus ? '⏳ Import en cours...' : '🏛️ IMPORTER LES 2 DÉPUTÉS'}
                  </button>
                  <p style={{color: '#94a3b8', fontSize: '0.875rem', marginTop: '1rem'}}>
                    Jean-Victor Castor (1ère circonscription) et Davy Rimane (2ème circonscription)
                  </p>
                </div>
              )}

              {/* BOUTON SÉNATEURS - Visible seulement s'il n'y a aucun sénateur */}
              {(selectedPoste === 'Sénateurs' && !hasElusOfType(['Sénateurs'])) && (
                <div style={{textAlign: 'center'}}>
                  <button 
                    onClick={importSenateurs}
                    disabled={importingElus}
                    style={{
                      backgroundColor: importingElus ? '#6b7280' : '#8b5cf6',
                      color: 'white',
                      padding: '1rem 2rem',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: importingElus ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      margin: '0 auto',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                      transition: 'all 0.3s'
                    }}
                  >
                    <UserPlus size={20} />
                    {importingElus ? '⏳ Import en cours...' : '🏛️ IMPORTER LES 2 SÉNATEURS'}
                  </button>
                  <p style={{color: '#94a3b8', fontSize: '0.875rem', marginTop: '1rem'}}>
                    Antoine Karam et Marie-Laure Phinéra-Horth - Sénateurs de la Guyane
                  </p>
                </div>
              )}

              {/* BOUTON CONSEILLERS CTG - Visible seulement s'il n'y a aucun conseiller territorial */}
              {(selectedPoste === 'Conseillers Territoriaux' && !hasElusOfType(['Conseillers Territoriaux'])) && (
                <div style={{textAlign: 'center'}}>
                  <button 
                    onClick={importConseillersTerritoriaux55}
                    disabled={importingElus}
                    style={{
                      backgroundColor: importingElus ? '#6b7280' : '#06b6d4',
                      color: 'white',
                      padding: '1rem 2rem',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: importingElus ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      margin: '0 auto',
                      boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
                      transition: 'all 0.3s'
                    }}
                  >
                    <UserPlus size={20} />
                    {importingElus ? '⏳ Import en cours...' : '🏛️ IMPORTER LES 55 CONSEILLERS CTG'}
                  </button>
                  <p style={{color: '#94a3b8', fontSize: '0.875rem', marginTop: '1rem'}}>
                    ✅ <strong>55 conseillers territoriaux</strong> - Assemblée de Guyane avec Gabriel Serville
                  </p>
                </div>
              )}

              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ÉCRAN PROFIL
  if (currentScreen === 'profil') {
    // Fonction pour liker un avis
    const handleLike = (avisId) => {
      setAvisLocaux(prev => 
        prev.map(avis => 
          avis.id === avisId 
            ? { ...avis, likes: avis.likes + 1 }
            : avis
        )
      );
    };

    // Récupérer les avis pour cet élu (Firebase + locaux)
    const avisElu = [
      // Avis existants de l'élu (si il en a)
      ...(selectedElu?.questions || []),
      // Avis locaux pour cet élu
      ...avisLocaux.filter(avis => avis.eluId === selectedElu?.id)
    ];

    return (
      <div className="app-modern">
        <div className="header-modern" style={{
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          padding: '1rem 0'
        }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div className="header-nav" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <button
                onClick={() => {
                  // Retourner vers le bon écran selon le type d'élu
                  if (selectedElu?.poste === 'Députés') {
                    changeScreenAndResetSearch('deputes');
                  } else if (selectedElu?.poste === 'Sénateurs') {
                    changeScreenAndResetSearch('senateurs');
                  } else if (selectedElu?.poste === 'Président CTG' || selectedElu?.poste?.includes('Vice-Président') || selectedElu?.poste === 'Conseiller territorial' || selectedElu?.poste === 'Conseillère Territoriale' || selectedElu?.poste?.includes('Président') || selectedElu?.poste?.includes('Vice') || selectedElu?.poste?.includes('VP') || selectedElu?.poste?.includes('Éducation') || ['Gabriel Serville', 'Jean-Paul Fereira', 'Annie Robinson-Chocho', 'Thibault Lechat-Vega', 'Patricia Saïd', 'Philippe Bouba', 'Aïssatou Chambaud', 'Roger Aron', 'Samantha Cyriaque', 'Chester Leonce', 'Bernadette Dulonca', 'Emmanuel Prince', 'Karine Cresson-Ibris', 'Jean-Luc Le West', 'Tiarrah Steenwinkel', 'Raymond Déyé'].includes(selectedElu?.name)) {
                    changeScreenAndResetSearch('ctg');
                  } else if (selectedElu?.poste === 'Maire') {
                    changeScreenAndResetSearch('maires');
                  } else {
                    changeScreenAndResetSearch('home');
                  }
                }} 
                className="btn-back-modern"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#374151',
                  color: '#e5e7eb',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={20} />
              Retour
            </button>
              <div className="header-info">
                <h1 className="header-title" style={{color: '#e2e8f0', fontSize: '1.5rem', fontWeight: '700', margin: 0}}>
                  {selectedElu?.name}
                </h1>
                <p className="header-subtitle" style={{color: '#94a3b8', fontSize: '0.875rem', margin: 0}}>
                  {selectedElu?.poste} {selectedElu?.commune && `- ${selectedElu.commune}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="content-section" style={{padding: '2rem 0'}}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            {/* Profil de l'élu */}
            <div className="profile-card-modern" style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div className="profile-header-modern" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                marginBottom: '2rem',
                flexWrap: 'wrap'
              }}>
                <div className="profile-avatar-large" style={{
                  backgroundColor: selectedElu?.poste === 'Député' ? '#3b82f6' : 
                                  selectedElu?.poste === 'Sénateur' ? '#7c3aed' :
                                  selectedElu?.poste?.includes('CTG') ? '#ec4899' : '#059669',
                  borderRadius: '50%',
                  padding: '2rem',
                  color: 'white'
                }}>
                  <Users size={48} />
              </div>
                <div className="profile-info-modern" style={{flex: 1}}>
                  <h2 style={{color: '#e2e8f0', fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem'}}>
                    {selectedElu?.name}
                  </h2>
                  <p style={{color: '#94a3b8', fontSize: '1.1rem', marginBottom: '1rem'}}>
                    {selectedElu?.poste} {selectedElu?.commune && `de ${selectedElu.commune}`}
                  </p>
                  
                  {/* Badges d'information */}
                  <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem'}}>
                    {selectedElu?.parti && (
                      <span style={{
                        backgroundColor: '#059669',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: 'bold'
                      }}>
                        {selectedElu.parti}
                    </span>
                    )}
                    {selectedElu?.mandat && (
                      <span style={{
                        backgroundColor: '#7c3aed',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem'
                      }}>
                        {selectedElu.mandat}
                    </span>
                    )}
                    {selectedElu?.status && (
                      <span style={{
                        backgroundColor: selectedElu.status === 'actuel' ? '#059669' : '#3b82f6',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem'
                      }}>
                        {selectedElu.status === 'actuel' ? '🟢 En cours' : '🔵 Mandat passé'}
                      </span>
                    )}
                  </div>
                  
                  {/* Informations spécifiques selon le type d'élu */}
                  <div style={{color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.6'}}>
                    {selectedElu?.circonscription && (
                      <p style={{margin: '0.25rem 0'}}>
                        <strong>Circonscription :</strong> {selectedElu.circonscription}
                      </p>
                    )}
                    {selectedElu?.commission && (
                      <p style={{margin: '0.25rem 0'}}>
                        <strong>Commission :</strong> {selectedElu.commission}
                      </p>
                    )}
                    {selectedElu?.delegation && (
                      <p style={{margin: '0.25rem 0'}}>
                        <strong>Délégation :</strong> {selectedElu.delegation}
                      </p>
                    )}
                    {selectedElu?.fonction_speciale && (
                      <p style={{margin: '0.25rem 0'}}>
                        <strong>Fonction spéciale :</strong> {selectedElu.fonction_speciale}
                      </p>
                    )}
                    {selectedElu?.particularite && (
                      <p style={{margin: '0.25rem 0', color: '#f59e0b', fontWeight: '600'}}>
                        ⭐ {selectedElu.particularite}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section Description */}
              <div className="description-section-modern" style={{
                backgroundColor: '#0f172a',
                padding: '1.5rem',
                borderRadius: '12px',
                marginTop: '1.5rem'
              }}>
                <h4 style={{color: '#e2e8f0', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  📝 Description
                </h4>
                <p style={{color: '#94a3b8', lineHeight: '1.6', fontSize: '1rem', margin: 0}}>
                  {(() => {
                    // Récupérer la description depuis les données statiques si elle n'existe pas dans Firebase
                    if (selectedElu?.description) {
                      return selectedElu.description;
                    }
                    
                    // Chercher dans les données statiques des députés
                    if (selectedElu?.poste === 'Député' || selectedElu?.poste === 'Députés') {
                      const deputeStatique = deputesData.find(d => 
                        d.name === selectedElu.name || 
                        d.name.toLowerCase() === selectedElu.name.toLowerCase()
                      );
                      if (deputeStatique?.description) {
                        return deputeStatique.description;
                      }
                    }
                    
                    // Chercher dans les données statiques des sénateurs
                    if (selectedElu?.poste === 'Sénateur' || selectedElu?.poste === 'Sénateurs') {
                      const senateurStatique = senateursData.find(s => 
                        s.name === selectedElu.name || 
                        s.name.toLowerCase() === selectedElu.name.toLowerCase()
                      );
                      if (senateurStatique?.description) {
                        return senateurStatique.description;
                      }
                    }
                    
                    // Chercher dans les données statiques des conseillers territoriaux
                    if (selectedElu?.poste?.includes('CTG') || selectedElu?.poste?.includes('Conseiller') || selectedElu?.poste?.includes('Président')) {
                      const conseillerStatique = conseillersTerritoriaux.find(c => 
                        c.name === selectedElu.name || 
                        c.name.toLowerCase() === selectedElu.name.toLowerCase()
                      );
                      if (conseillerStatique?.description) {
                        return conseillerStatique.description;
                      }
                    }
                    
                    return 'Description en cours de mise à jour...';
                  })()}
                </p>
              </div>

              {/* Section Notes */}
              <div className="rating-section-modern" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                backgroundColor: '#0f172a',
                padding: '1.5rem',
                borderRadius: '12px'
              }}>
                <div className="current-rating-modern">
                  <h4 style={{color: '#e2e8f0', marginBottom: '1rem', fontSize: '1.1rem'}}>Note actuelle</h4>
                  <div className="rating-display" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <StarRating rating={selectedElu?.rating || 0} />
                    <span className="rating-text-modern" style={{color: '#94a3b8', fontSize: '1rem'}}>
                      {selectedElu?.rating || 0}/5 ({selectedElu?.totalVotes || 0} votes)
                    </span>
                  </div>
                </div>
                
                <div className="user-rating-modern">
                  <h4 style={{color: '#e2e8f0', marginBottom: '1rem', fontSize: '1.1rem'}}>Votre évaluation</h4>
                    <StarRating 
                      rating={userRating} 
                      onRate={setUserRating}
                      interactive={true}
                    />
                  {userRating > 0 && (
                    <p style={{color: '#10b981', fontSize: '0.875rem', marginTop: '0.5rem'}}>
                      ✅ Note enregistrée : {userRating}/5
                    </p>
                  )}
                  </div>
                </div>
            </div>{/* Questions et avis */}
            <div className="avis-section">
              <div className="avis-section-header">
                <h2>💬 Avis & Questions des citoyens</h2>
                <button className="btn-main" onClick={() => { setMessageType('avis'); setCurrentScreen('message'); }}>
                  Laisser un avis
                </button>
              </div>
              {avisElu.length === 0 ? (
                <div className="avis-empty">
                  <MessageCircle size={48} style={{marginBottom: '1rem'}} />
                  <p>Soyez le premier à donner votre avis sur cet élu !</p>
            </div>
              ) : (
                avisElu.slice(0, 5).map((avis) => (
                  <div className="avis-card" key={avis.id}>
                    <div className="avis-avatar">
                      {avis.author && avis.author !== 'Anonyme' ? avis.author[0].toUpperCase() : <Users size={24} />}
          </div>
                    <div className="avis-content">
                      <div className="avis-header">
                        <span className="avis-author">{avis.author}</span>
                        <span className="avis-date">{avis.timestamp}</span>
                        <span className={`avis-badge${avis.type === 'question' ? ' question' : ''}`}>
                          {avis.type === 'avis' ? 'Avis public' : 'Question privée'}
                        </span>
              </div>
                      <div className="avis-text">{avis.text}</div>
                      <div className="avis-actions">
                        <button className="avis-like" onClick={() => handleLike(avis.id)}>
                          <ThumbsUp size={16} /> {avis.likes}
                        </button>
              </div>
                    </div>
                  </div>
                ))
            )}
          </div>

            {/* Section Actualités */}
            <div className="news-section" style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '2rem',
              marginTop: '2rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                <Newspaper size={24} style={{ color: '#3b82f6' }} />
                <h2 style={{
                    color: '#e2e8f0',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  margin: 0
                  }}>
                    Actualités récentes
                </h2>
                </div>

                {loadingNews ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#94a3b8'
                  }}>
                    Chargement des actualités...
                  </div>
                ) : news.length > 0 ? (
                  <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                  }}>
                    {news.map((article, index) => (
                      <a 
                      key={article.id}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: 'none',
                        color: 'inherit',
                        display: 'block',
                        padding: '1rem',
                        backgroundColor: 'rgba(30, 41, 59, 0.5)',
                        borderRadius: '12px',
                        transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                        alignItems: 'flex-start'
                        }}>
                          {article.imageUrl && (
                            <img 
                              src={article.imageUrl}
                              alt={article.title}
                              style={{
                                width: '120px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                          )}
                          <div>
                            <h4 style={{
                              color: '#e2e8f0',
                              fontSize: '1rem',
                              fontWeight: '600',
                              marginBottom: '0.5rem'
                            }}>
                              {article.title}
                            </h4>
                            <p style={{
                              color: '#94a3b8',
                              fontSize: '0.875rem',
                              marginBottom: '0.5rem',
                              display: '-webkit-box',
                              WebkitLineClamp: '2',
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {article.description}
                            </p>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                            gap: '0.5rem',
                              color: '#64748b',
                              fontSize: '0.75rem'
                            }}>
                              <span>{article.source}</span>
                              <span>•</span>
                              <span>{article.publishedAt}</span>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#94a3b8',
                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                    borderRadius: '12px'
                  }}>
                    Aucune actualité récente trouvée pour cet élu.
                  </div>
            )}
          </div>

            {/* Actions */}
            <div className="actions-section-modern">
            <button
              onClick={() => {
                setMessageType('avis');
                setCurrentScreen('message');
              }}
                className="action-btn-modern primary"
              >
                <MessageCircle size={20} />
                Laisser un avis public
            </button>
            <button
              onClick={() => {
                setMessageType('question');
                setCurrentScreen('message');
              }}
                className="action-btn-modern secondary"
              >
                <Send size={20} />
                Poser une question privée
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ÉCRAN MESSAGE
  if (currentScreen === 'message') {
    const handleSubmit = () => {
      if (message.trim()) {
        // Créer le nouvel avis/question
        const nouvelAvis = {
          id: Date.now().toString(),
          type: messageType,
          text: message,
          author: user?.isAnonymous ? 'Anonyme' : 'Citoyen guyanais',
          likes: 0,
          eluId: selectedElu.id,
          eluName: selectedElu.name,
          commune: selectedElu.commune,
          timestamp: new Date().toLocaleString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };

        // Ajouter l'avis à la liste locale
        setAvisLocaux(prev => [nouvelAvis, ...prev]);

        // Message de confirmation
        alert(`${messageType === 'avis' ? 'Avis' : 'Question'} envoyé(e) avec succès !`);
        
        // Retour au profil et reset du formulaire
        setCurrentScreen('profil');
        setMessage('');
        setUserRating(0);
      }
    };

    return (
      <div className="app-modern">
        <div className="header-modern" style={{
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          padding: '1rem 0'
        }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div className="header-nav" style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <button
                onClick={() => setCurrentScreen('profil')} 
                className="btn-back-modern"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#374151',
                  color: '#e5e7eb',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={20} />
              Retour
            </button>
              <div className="header-info">
                <h1 className="header-title" style={{color: '#e2e8f0', fontSize: '1.5rem', fontWeight: '700', margin: 0}}>
                  {messageType === 'avis' ? '📝 Laisser un avis public' : '❓ Poser une question privée'}
              </h1>
                <p className="header-subtitle" style={{color: '#94a3b8', fontSize: '0.875rem', margin: 0}}>
                  À {selectedElu?.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="content-section" style={{padding: '2rem 0'}}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
            <div className="message-form-modern">
              <div className={`message-info-modern ${messageType}`}>
                <div className="info-icon-modern">
                {messageType === 'avis' ? (
                    <MessageCircle size={24} />
                ) : (
                    <Send size={24} />
                )}
                </div>
                <div>
                  <h3>{messageType === 'avis' ? 'Avis public' : 'Question privée'}</h3>
                  <p>
                    {messageType === 'avis' 
                      ? 'Votre avis sera visible par tous les citoyens et pourra être liké.'
                      : 'Votre question sera envoyée directement à l\'élu de manière confidentielle.'
                    }
                  </p>
              </div>
            </div>

              <div className="form-group-modern">
                <label>
                  {messageType === 'avis' ? 'Votre avis' : 'Votre question'}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  placeholder={messageType === 'avis' 
                    ? 'Partagez votre opinion sur l\'action de cet élu...'
                    : 'Posez votre question à cet élu...'
                  }
                />
              </div>

              <div className="form-actions-modern">
                <button 
                  className="btn-submit-modern"
                  disabled={!message.trim()}
                  onClick={handleSubmit}
                >
                  {messageType === 'avis' ? 'Publier mon avis' : 'Envoyer ma question'}
                </button>
                <button 
                  className="btn-cancel-modern"
                  onClick={() => setCurrentScreen('profil')}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ajouter la section des maires
  if (currentScreen === 'maires') {
    // Juste avant le return ou l'utilisation de 'maires'
    const maires = elus.filter((elu) => elu.poste === 'Maire');
    const filteredMaires = maires
      .filter(maire => 
        maire.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (maire.commune && maire.commune.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      // Supprimer les doublons par nom et commune
      .filter((maire, index, array) => 
        array.findIndex(m => m.name === maire.name && m.commune === maire.commune) === index
      );

    return (
      <div className="app-modern">
        <Header 
          title="Maires"
          subtitle="Liste des maires de Guyane"
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          setCurrentTab={setCurrentTab}
          showMiniNav={showMiniNav}
          changeScreenAndResetSearch={changeScreenAndResetSearch}
        >
          <div className="header-right">
            {user ? (
              <UserButton 
                user={user} 
                onSignOut={handleSignOut}
              />
            ) : (
              <button 
                className="login-button"
                onClick={() => setShowAuthModal(true)}
              >
                <UserPlus size={20} />
                Se connecter
              </button>
            )}
          </div>
        </Header>

        {/* Modal d'authentification */}
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}

        <div className="content-section">
          <div className="container">
            {/* Barre de recherche */}
            <div className="search-bar-modern">
              <Search className="search-icon" size={20} />
                  <input
                type="text"
                placeholder="Rechercher un maire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            {/* Grille des maires */}
            <div className="elus-grid-modern">
              {filteredMaires.map((maire) => (
                <div 
                  key={maire.id} 
                  className="elu-card-modern"
                  onClick={() => {
                    setSelectedElu(maire);
                    setCurrentScreen('profil');
                  }}
                >
                  <div className="elu-header">
                    <div className="elu-avatar-modern" style={{
                      backgroundColor: '#F59E0B',
                      borderRadius: '50%',
                      padding: '1rem',
                      color: 'white'
                    }}>
                      <Crown size={32} />
                    </div>
                    <div className="elu-info-modern">
                      <h3 style={{
                        color: '#e2e8f0',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                      }}>
                        {maire.name}
                      </h3>
                      <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>
                        Maire de {maire.commune}
                      </p>
                    </div>
                  </div>
                  
                  {/* Badges et informations supplémentaires */}
                  <div className="elu-badges">
                    {maire.parti && (
                      <span className="badge badge-parti">
                        {maire.parti}
                  </span>
                    )}
                    {maire.mandat && (
                      <span className="badge badge-mandat">
                        {maire.mandat}
                      </span>
                    )}
              </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ÉCRAN DÉPUTÉS
  if (currentScreen === 'deputes') {
    console.log('🔍 Écran députés - Nombre de députés:', deputes.length);
    return (
      <div className="app-modern">
        <Header
          title="Députés de Guyane"
          subtitle="Les représentants de la Guyane à l'Assemblée nationale"
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          setCurrentTab={setCurrentTab}
          showMiniNav={showMiniNav}
          changeScreenAndResetSearch={changeScreenAndResetSearch}
        >
          <div className="header-right">
            {user ? (
              <UserButton 
                user={user} 
                onSignOut={handleSignOut}
              />
            ) : (
              <button 
                className="login-button"
                onClick={() => setShowAuthModal(true)}
              >
                <UserPlus size={20} />
                Se connecter
              </button>
            )}
          </div>
        </Header>

        {/* Modal d'authentification */}
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}

        <div className="content-section">
          <div className="container">
            <div className="search-bar-modern">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher un député..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="elus-grid-modern">
              {deputes
                .filter(depute => 
                  depute.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                // Supprimer les doublons par nom
                .filter((depute, index, array) => 
                  array.findIndex(d => d.name === depute.name) === index
                )
                .map((depute) => (
                  <div key={depute.id} className="elu-card-modern">
                    <div className="elu-header">
                      <div className="elu-avatar-modern" style={{backgroundColor: '#3b82f6'}}>
                        <Users size={32} />
                      </div>
                      <div className="elu-info-modern">
                        <h3>{depute.name}</h3>
                        <p>{depute.circonscription}</p>
                        <div className="elu-badges">
                          <span className="badge badge-parti">{depute.parti}</span>
                          <span className="badge badge-mandat">{depute.mandat}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="elu-details">
                      {depute.commission && (
                        <p><strong>Commission :</strong> {depute.commission}</p>
                      )}
                      {depute.particularite && (
                        <p className="particularite">⭐ {depute.particularite}</p>
                      )}
                    </div>

                    <div className="elu-rating-modern">
                      <StarRating rating={depute.rating || 0} />
                      <span className="rating-text">
                        {depute.rating || 0}/5 ({depute.totalVotes || 0} votes)
                      </span>
                    </div>
                    
                <button
                      className="btn-main btn-blue"
                      onClick={() => {
                        setSelectedElu(depute);
                        setCurrentScreen('profil');
                      }}
                    >
                      Voir le profil
                </button>
              </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ÉCRAN SÉNATEURS
  if (currentScreen === 'senateurs') {
    console.log('🔍 Écran sénateurs - Nombre de sénateurs:', senateurs.length);
    return (
      <div className="app-modern">
        <Header
          title="Sénateurs de Guyane"
          subtitle="Les représentants de la Guyane au Sénat"
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          setCurrentTab={setCurrentTab}
          showMiniNav={showMiniNav}
          changeScreenAndResetSearch={changeScreenAndResetSearch}
        >
          <div className="header-right">
            {user ? (
              <UserButton 
                user={user} 
                onSignOut={handleSignOut}
              />
            ) : (
              <button 
                className="login-button"
                onClick={() => setShowAuthModal(true)}
              >
                <UserPlus size={20} />
                Se connecter
              </button>
            )}
          </div>
        </Header>

        {/* Modal d'authentification */}
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}

        <div className="content-section">
          <div className="container">
            <div className="search-bar-modern">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher un sénateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="elus-grid-modern">
              {senateurs
                .filter(senateur => 
                  senateur.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                // Supprimer les doublons par nom
                .filter((senateur, index, array) => 
                  array.findIndex(s => s.name === senateur.name) === index
                )
                .map((senateur) => (
                  <div key={senateur.id} className="elu-card-modern">
                    <div className="elu-header">
                      <div className="elu-avatar-modern" style={{backgroundColor: '#7c3aed'}}>
                        <Users size={32} />
                      </div>
                      <div className="elu-info-modern">
                        <h3>{senateur.name}</h3>
                        <p>Sénateur de Guyane</p>
                        <div className="elu-badges">
                          <span className="badge badge-parti">{senateur.parti}</span>
                          <span className="badge badge-mandat">{senateur.mandat}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="elu-details">
                      {senateur.commission && (
                        <p><strong>Commission :</strong> {senateur.commission}</p>
                      )}
                      {senateur.particularite && (
                        <p className="particularite">⭐ {senateur.particularite}</p>
                      )}
                    </div>

                    <div className="elu-rating-modern">
                      <StarRating rating={senateur.rating || 0} />
                      <span className="rating-text">
                        {senateur.rating || 0}/5 ({senateur.totalVotes || 0} votes)
                      </span>
                    </div>
                    
                <button
                      className="btn-main btn-purple"
                      onClick={() => {
                        setSelectedElu(senateur);
                        setCurrentScreen('profil');
                      }}
                    >
                      Voir le profil
                </button>
              </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ÉCRAN CTG
  if (currentScreen === 'ctg') {
    return (
      <div className="app-modern">
        <Header
          title="Conseillers Territoriaux de Guyane"
          subtitle="Les élus de la Collectivité Territoriale de Guyane"
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          setCurrentTab={setCurrentTab}
          showMiniNav={showMiniNav}
          changeScreenAndResetSearch={changeScreenAndResetSearch}
        >
          <div className="header-right">
            {user ? (
              <UserButton 
                user={user} 
                onSignOut={handleSignOut}
              />
            ) : (
              <button 
                className="login-button"
                onClick={() => setShowAuthModal(true)}
              >
                <UserPlus size={20} />
                Se connecter
              </button>
            )}
          </div>
        </Header>

        {/* Modal d'authentification */}
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}

        <div className="content-section">
          <div className="container">
            <div className="search-bar-modern">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher un conseiller..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Bouton d'importation des 55 conseillers territoriaux */}
            {conseillers.length < 50 && (
              <div style={{
                textAlign: 'center',
                margin: '2rem 0',
                padding: '1.5rem',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '2px solid #f59e0b',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#f59e0b', marginBottom: '1rem' }}>
                  📊 Base de données incomplète
                </h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                  Seulement {conseillers.length} conseillers territoriaux trouvés.<br/>
                  Importez les 55 conseillers territoriaux officiels de la CTG (mandature 2021-2028)
                </p>
                <button
                  onClick={importConseillersTerritoriaux55}
                  disabled={importingElus}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 2rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: importingElus ? 'not-allowed' : 'pointer',
                    opacity: importingElus ? 0.7 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  {importingElus ? '⏳ Import en cours...' : '📥 Importer les 55 Conseillers CTG'}
                </button>
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  ✅ Données officielles par section électorale<br/>
                  🗺️ Cayenne, Petite Couronne, Saint-Laurent, Haut-Maroni, etc.
                </div>
              </div>
            )}

            <div className="elus-grid-modern">
              {conseillers
                .filter(conseiller => 
                  conseiller.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                // Supprimer les doublons par nom et poste
                .filter((conseiller, index, array) => 
                  array.findIndex(c => c.name === conseiller.name && c.poste === conseiller.poste) === index
                )
                .sort((a, b) => {
                  // Fonction de tri hiérarchique OFFICIELLE CTG 2021-2028
                  const getOrderPriority = (conseiller) => {
                    const nom = conseiller.name;
                    const poste = conseiller.poste || '';
                    
                    // Hiérarchie officielle CTG 2021-2028 - ORDRE EXACT
                    if (nom === 'Gabriel Serville') return 1; // Président CTG
                    if (nom === 'Jean-Paul Fereira') return 2; // 1er VP - Dév. durable & transition énergétique
                    if (nom === 'Annie Robinson-Chocho') return 3; // 2ème VP - Éducation & constructions scolaires
                    if (nom === 'Thibault Lechat-Vega') return 4; // 3ème VP - Europe, égalité, relations institutionnelles
                    if (nom === 'Patricia Saïd') return 5; // 4ème VP - Solidarité & santé
                    if (nom === 'Philippe Bouba') return 6; // 5ème VP - Enseignement supérieur & recherche
                    if (nom === 'Aïssatou Chambaud') return 7; // 6ème VP - Famille & aide sociale à l'enfance
                    if (nom === 'Roger Aron') return 8; // 7ème VP - Agriculture, pêche & souveraineté alimentaire
                    if (nom === 'Samantha Cyriaque') return 9; // 8ème VP - Autonomie & handicap
                    if (nom === 'Chester Leonce') return 10; // 9ème VP - Aménagement du territoire & transports
                    if (nom === 'Bernadette Dulonca') return 11; // 10ème VP - Citoyenneté & vivre ensemble
                    if (nom === 'Emmanuel Prince') return 12; // 11ème VP - Culture, patrimoine & transmission
                    if (nom === 'Karine Cresson-Ibris') return 13; // 12ème VP - Emploi, formation & insertion professionnelle
                    if (nom === 'Jean-Luc Le West') return 14; // 13ème VP - Développement économique & tourisme
                    if (nom === 'Tiarrah Steenwinkel') return 15; // 14ème VP - Sécurité & sûreté
                    if (nom === 'Raymond Déyé') return 16; // 15ème VP - Égalité des chances & des territoires
                    
                    return 100; // Tous les autres conseillers
                  };
                  
                  const priorityA = getOrderPriority(a);
                  const priorityB = getOrderPriority(b);
                  
                  if (priorityA !== priorityB) {
                    return priorityA - priorityB;
                  }
                  
                  // Si même priorité (autres conseillers), trier par nom
                  return a.name.localeCompare(b.name);
                })
                .map((conseiller) => (
                  <div key={conseiller.id} className="elu-card-modern">
                    <div className="elu-header">
                      <div className="elu-avatar-modern" style={{
                        backgroundColor: (conseiller.name === 'Gabriel Serville' || conseiller.poste?.includes('Président')) ? '#dc2626' : // Rouge pour le Président
                                       (conseiller.poste?.includes('Vice') || conseiller.poste?.includes('VP') || ['Jean-Paul Fereira', 'Annie Robinson-Chocho', 'Thibault Lechat-Vega', 'Patricia Saïd', 
                                        'Philippe Bouba', 'Aïssatou Chambaud', 'Roger Aron', 'Samantha Cyriaque', 
                                        'Chester Leonce', 'Bernadette Dulonca', 'Emmanuel Prince', 'Karine Cresson-Ibris', 
                                        'Jean-Luc Le West', 'Tiarrah Steenwinkel', 'Raymond Déyé'].includes(conseiller.name)) ? '#7c3aed' : // Violet pour les VP
                                       (conseiller.poste?.includes('Égalité des chances') || conseiller.poste?.includes('Sécurité') || 
                                        conseiller.poste?.includes('Éducation') || conseiller.poste?.includes('Développement') ||
                                        conseiller.poste?.includes('Agriculture') || conseiller.poste?.includes('Culture') ||
                                        conseiller.poste?.includes('Emploi') || conseiller.poste?.includes('Santé') ||
                                        conseiller.poste?.includes('Famille') || conseiller.poste?.includes('Aménagement') ||
                                        conseiller.poste?.includes('Citoyenneté') || conseiller.poste?.includes('Autonomie') ||
                                        conseiller.poste?.includes('Europe') || conseiller.poste?.includes('Enseignement') ||
                                        conseiller.poste?.includes('Solidarité') || conseiller.poste?.includes('Tourisme') ||
                                        conseiller.poste?.includes('Transports') || conseiller.poste?.includes('Recherche') ||
                                        conseiller.poste?.includes('Patrimoine') || conseiller.poste?.includes('Insertion') ||
                                        conseiller.poste?.includes('Pêche') || conseiller.poste?.includes('Handicap') ||
                                        (conseiller.poste && conseiller.poste !== 'Conseiller territorial' && !conseiller.poste.includes('Président') && !conseiller.poste.includes('Vice'))) ? '#f59e0b' : // Orange pour délégations spéciales
                                       '#059669' // Vert pour conseillers territoriaux de base
                      }}>
                        <Users size={32} />
                      </div>
                      <div className="elu-info-modern">
                        <h3>{conseiller.name}</h3>
                        <p>{conseiller.poste}</p>
                        <div className="elu-badges">
                          <span className="badge badge-parti">{conseiller.parti}</span>
                          {conseiller.delegation && (
                            <span className="badge badge-delegation">{conseiller.delegation}</span>
                          )}
                          {conseiller.section && (
                            <span className="badge badge-section" style={{backgroundColor: '#6366f1', color: 'white'}}>
                              {conseiller.section}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="elu-details">
                      {conseiller.commission && (
                        <p><strong>Commission :</strong> {conseiller.commission}</p>
                      )}
                      {conseiller.fonction_speciale && (
                        <p><strong>Fonction :</strong> {conseiller.fonction_speciale}</p>
                      )}
                      {conseiller.particularite && (
                        <p className="particularite">⭐ {conseiller.particularite}</p>
                      )}
                    </div>

                    <div className="elu-rating-modern">
                      <StarRating rating={conseiller.rating || 0} />
                      <span className="rating-text">
                        {conseiller.rating || 0}/5 ({conseiller.totalVotes || 0} votes)
                      </span>
                    </div>
                    
                    <button 
                      className="btn-main btn-green"
                      onClick={() => {
                        setSelectedElu(conseiller);
                        setCurrentScreen('profil');
                      }}
                    >
                      Voir le profil
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }



  // ÉCRAN D'ACCUEIL (HOME)
  return (
    <div className="app-modern">
      <Header
        title="Oroyo"
        subtitle="Découvrez les élus de la Guyane"
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        setCurrentTab={setCurrentTab}
        showMiniNav={showMiniNav}
        changeScreenAndResetSearch={changeScreenAndResetSearch}
      >
        <div className="header-right">
          {user ? (
            <UserButton 
              user={user} 
              onSignOut={handleSignOut}
            />
          ) : (
            <button 
              className="login-button"
              onClick={() => setShowAuthModal(true)}
            >
              <UserPlus size={20} />
              Se connecter
            </button>
          )}
        </div>
      </Header>

      {/* Modal d'authentification */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      <div className="content-section">
        <div className="container">
          <div className="menu-bubble-bar">
            <div 
              className="menu-bubble" 
              data-type="communes"
              onClick={() => setCurrentScreen('communes')}
            >
              <div className="bubble-icon-wrapper">
                <Building className="bubble-icon" />
              </div>
              <h3>Communes</h3>
              <p>Les 22 communes de Guyane</p>
            </div>

            <div 
              className="menu-bubble" 
              data-type="maires"
              onClick={() => setCurrentScreen('maires')}
            >
              <div className="bubble-icon-wrapper">
                <Crown className="bubble-icon" />
              </div>
              <h3>Maires</h3>
              <p>Les maires de Guyane</p>
            </div>

            <div 
              className="menu-bubble" 
              data-type="deputes"
              onClick={() => setCurrentScreen('deputes')}
            >
              <div className="bubble-icon-wrapper">
                <Vote className="bubble-icon" />
              </div>
              <h3>Députés</h3>
              <p>Les députés de Guyane</p>
            </div>

            <div 
              className="menu-bubble" 
              data-type="senateurs"
              onClick={() => setCurrentScreen('senateurs')}
            >
              <div className="bubble-icon-wrapper">
                <Scale className="bubble-icon" />
              </div>
              <h3>Sénateurs</h3>
              <p>Les sénateurs de Guyane</p>
            </div>

            <div 
              className="menu-bubble" 
              data-type="ctg"
              onClick={() => setCurrentScreen('ctg')}
            >
              <div className="bubble-icon-wrapper">
                <Landmark className="bubble-icon" />
              </div>
              <h3>CTG</h3>
              <p>Conseillers territoriaux</p>
            </div>
          </div>

          {/* Section des élus les mieux notés */}
          {elus.length > 0 && (
            <RankingSection
              title="🏆 Les élus les mieux notés"
              elus={getTopRatedElus(elus)}
              setSelectedElu={setSelectedElu}
              setCurrentScreen={setCurrentScreen}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
