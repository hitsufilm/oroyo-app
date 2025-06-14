import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Users, ArrowLeft, Star, MessageCircle, Send, ThumbsUp, MapPin, Download, UserPlus } from 'lucide-react';
import { db } from './firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState('communes');
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedCommune, setSelectedCommune] = useState(null);
  const [selectedPoste, setSelectedPoste] = useState(null);
  const [selectedElu, setSelectedElu] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [messageType, setMessageType] = useState('avis');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // États pour les données
  const [communes, setCommunes] = useState([]);
  const [postes, setPostes] = useState([]);
  const [elus, setElus] = useState([]);
  const [deputes, setDeputes] = useState([]);
  const [senateurs, setSenateurs] = useState([]);
  const [conseillers, setConseillers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avisLocaux, setAvisLocaux] = useState([]);
  const [importingElus, setImportingElus] = useState(false);

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

  const postesIntegres = [
    { id: 'maire', name: 'Maire', color: '#3b82f6', icon: '👑' },
    { id: 'adjoint', name: 'Adjoints au Maire', color: '#6366f1', icon: '🤝' },
    { id: 'conseiller', name: 'Conseillers Municipaux', color: '#8b5cf6', icon: '🏛️' },
    { id: 'intercommunal', name: 'Conseillers Intercommunaux', color: '#ec4899', icon: '🌐' }
  ];

  const allElusData = [
    // MAIRES
    { id: 'marcel-pierre', name: 'Marcel Pierre', commune: 'Cayenne', poste: 'Maire', status: 'actuel', rating: 4.2, totalVotes: 156, parti: 'DVG', mandat: '2020-2026' },
    { id: 'sandrine-bernard', name: 'Sandrine Bernard', commune: 'Saint-Laurent-du-Maroni', poste: 'Maire', status: 'actuel', rating: 3.8, totalVotes: 89, parti: 'PS', mandat: '2020-2026' },
    { id: 'christophe-bouillon', name: 'Christophe Bouillon', commune: 'Kourou', poste: 'Maire', status: 'actuel', rating: 4.1, totalVotes: 124, parti: 'DVG', mandat: '2020-2026' },
    { id: 'bruno-nestor-azerot', name: 'Bruno Nestor Azérot', commune: 'Matoury', poste: 'Maire', status: 'actuel', rating: 3.9, totalVotes: 78, parti: 'DVG', mandat: '2020-2026' },
    { id: 'remy-cabeca', name: 'Rémy Cabeca', commune: 'Rémire-Montjoly', poste: 'Maire', status: 'actuel', rating: 4.0, totalVotes: 95, parti: 'DVD', mandat: '2020-2026' },
    { id: 'jean-claude-ringuet', name: 'Jean-Claude Ringuet', commune: 'Macouria', poste: 'Maire', status: 'actuel', rating: 3.7, totalVotes: 62, parti: 'DVG', mandat: '2020-2026' }
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

  const importElus = async () => {
    setImportingElus(true);
    try {
      let importCount = 0;
      for (const elu of allElusData) {
        await setDoc(doc(db, 'elus', elu.id), elu);
        importCount++;
      }
      alert(`🎉 ${allElusData.length} élus importés avec succès !`);
      window.location.reload();
    } catch (error) {
      console.error('❌ Erreur lors de l\'import des élus:', error);
    } finally {
      setImportingElus(false);
    }
  };

  // CHARGEMENT DES DONNÉES
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
        
        // 2. POSTES
        let tousLesPostes = [...postesIntegres];
        try {
          const postesSnapshot = await getDocs(collection(db, 'postes'));
          const postesFirebase = postesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          postesFirebase.forEach(posteFirebase => {
            if (!tousLesPostes.find(p => p.id === posteFirebase.id)) {
              tousLesPostes.push(posteFirebase);
            }
          });
        } catch (error) {
          console.log('⚠️ Erreur Firebase postes:', error);
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

        // 4. DÉPUTÉS
        let tousLesDeputes = [...deputesData];
        try {
          const deputesSnapshot = await getDocs(collection(db, 'deputes'));
          const deputesFirebase = deputesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          deputesFirebase.forEach(deputeFirebase => {
            if (!tousLesDeputes.find(d => d.id === deputeFirebase.id)) {
              tousLesDeputes.push(deputeFirebase);
            }
          });
        } catch (error) {
          console.log('⚠️ Erreur Firebase députés:', error);
        }

        // 5. SÉNATEURS
        let tousLesSenateurs = [...senateursData];
        try {
          const senateursSnapshot = await getDocs(collection(db, 'senateurs'));
          const senateursFirebase = senateursSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          senateursFirebase.forEach(senateurFirebase => {
            if (!tousLesSenateurs.find(s => s.id === senateurFirebase.id)) {
              tousLesSenateurs.push(senateurFirebase);
            }
          });
        } catch (error) {
          console.log('⚠️ Erreur Firebase sénateurs:', error);
        }

        // 6. CONSEILLERS TERRITORIAUX
        let tousLesConseillers = [...conseillersTerritoriaux];
        try {
          const conseillersSnapshot = await getDocs(collection(db, 'conseillers_territoriaux'));
          const conseillersFirebase = conseillersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          conseillersFirebase.forEach(conseillerFirebase => {
            if (!tousLesConseillers.find(c => c.id === conseillerFirebase.id)) {
              tousLesConseillers.push(conseillerFirebase);
            }
          });
        } catch (error) {
          console.log('⚠️ Erreur Firebase conseillers:', error);
        }

        setCommunes(toutesLesCommunes);
        setPostes(tousLesPostes);
        setElus(tousLesElus);
        setDeputes(tousLesDeputes);
        setSenateurs(tousLesSenateurs);
        setConseillers(tousLesConseillers);
        setLoading(false);
        
      } catch (err) {
        console.error('❌ Erreur générale:', err);
        setError(err.message);
        setLoading(false);
        
        // Fallback
        setCommunes(communesIntegrees);
        setPostes(postesIntegres);
        setElus([]);
        setDeputes(deputesData);
        setSenateurs(senateursData);
        setConseillers(conseillersTerritoriaux);
      }
    };

    loadData();
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
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= (hoverRating || rating);
          return (
            <Star
              key={star}
              size={20}
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

  // COMPOSANT QUESTION CARD
  const QuestionCard = ({ question, onLike }) => (
    <div className="question-card" style={{
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1rem'
    }}>
      <div className="question-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem'
      }}>
        <span 
          className={`question-type ${question.type}`}
          style={{
            backgroundColor: question.type === 'avis' ? '#059669' : '#3b82f6',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}
        >
          {question.type === 'question' ? 'Question' : 'Avis'}
        </span>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          <span className="question-author">par {question.author}</span>
          {question.timestamp && (
            <span style={{ marginLeft: '0.5rem' }}>• {question.timestamp}</span>
          )}
        </div>
      </div>
      <p className="question-text" style={{
        color: '#e2e8f0',
        lineHeight: '1.5',
        marginBottom: '1rem'
      }}>
        {question.text}
      </p>
      <button 
        className="like-button"
        onClick={() => onLike && onLike(question.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'transparent',
          border: '1px solid #475569',
          color: '#94a3b8',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          transition: 'all 0.2s'
        }}
      >
        <ThumbsUp size={16} />
        <span>{question.likes}</span>
      </button>
    </div>
  );

  // ÉCRAN HOME MODERNE
  if (currentScreen === 'home') {
    return (
      <div className="app-modern">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="gradient-text">Oroyo</span>
              </h1>
              <p className="hero-subtitle">
                La plateforme citoyenne pour évaluer et communiquer avec vos élus en Guyane française
              </p>
              <div className="hero-stats" style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                flexWrap: 'wrap',
                marginTop: '2rem'
              }}>
                <div className="stat-item" style={{ textAlign: 'center' }}>
                  <span className="stat-number" style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'bold', 
                    color: '#3b82f6',
                    display: 'block'
                  }}>22</span>
                  <span className="stat-label" style={{ 
                    color: '#94a3b8', 
                    fontSize: '1rem' 
                  }}>Communes</span>
                </div>
                <div className="stat-item" style={{ textAlign: 'center' }}>
                  <span className="stat-number" style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'bold', 
                    color: '#3b82f6',
                    display: 'block'
                  }}>55+</span>
                  <span className="stat-label" style={{ 
                    color: '#94a3b8', 
                    fontSize: '1rem' 
                  }}>Élus</span>
                </div>
                <div className="stat-item" style={{ textAlign: 'center' }}>
                  <span className="stat-number" style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'bold', 
                    color: '#3b82f6',
                    display: 'block'
                  }}>1k+</span>
                  <span className="stat-label" style={{ 
                    color: '#94a3b8', 
                    fontSize: '1rem' 
                  }}>Citoyens</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - AMÉLIORÉE POUR MOBILE */}
        <div style={{
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          padding: '0 1rem',
          overflowX: 'auto'
        }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{
              display: 'flex',
              gap: '0',
              minWidth: 'fit-content'
            }}>
              {[
                { id: 'communes', name: '🏛️ Communes', desc: '22 communes', count: communes.length },
                { id: 'deputes', name: '🗳️ Députés', desc: '2 députés', count: deputes.length },
                { id: 'senateurs', name: '⚖️ Sénateurs', desc: '2 sénateurs', count: senateurs.length },
                { id: 'conseillers', name: '🌐 CTG', desc: '51 conseillers', count: conseillers.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  style={{
                    padding: '1rem 1.5rem',
                    backgroundColor: currentTab === tab.id ? '#3b82f6' : 'transparent',
                    color: currentTab === tab.id ? 'white' : '#94a3b8',
                    border: 'none',
                    borderBottom: currentTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    minWidth: '140px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                    {tab.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    {tab.count > 0 ? `${tab.count} ${tab.id === 'communes' ? 'communes' : tab.id === 'deputes' ? 'députés' : tab.id === 'senateurs' ? 'sénateurs' : 'conseillers'}` : tab.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

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
                  <h2 style={{color: '#e2e8f0', marginBottom: '1rem'}}>🏛️ Choisissez votre commune</h2>
                  <div className="search-box-modern" style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Search size={24} style={{
                      position: 'absolute',
                      left: '1rem',
                      color: '#94a3b8'
                    }} />
                    <input
                      type="text"
                      placeholder="Rechercher une commune en Guyane..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '1rem 1rem 1rem 3.5rem',
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#e2e8f0',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>

                {/* Header avec statistiques des communes */}
                <div className="region-filter" style={{marginBottom: '2rem'}}>
                  <h3 style={{color: '#cbd5e1', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '700'}}>
                    🗺️ {communes.length} communes de Guyane française
                  </h3>
                  <p style={{color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.6'}}>
                    Des communes côtières aux territoires de l'intérieur amazonien
                  </p>
                </div>

                {/* Communes Grid Moderne */}
                <div className="communes-grid-modern" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {communes
                    .filter(commune => 
                      commune.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (commune.description && commune.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                      (commune.region && commune.region.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
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
                  
                  {/* Bouton d'import */}
                  <div style={{marginTop: '1rem'}}>
                    <button 
                      onClick={importElusNationaux}
                      disabled={importingElus}
                      style={{
                        backgroundColor: importingElus ? '#6b7280' : '#10b981',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: importingElus ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <UserPlus size={18} />
                      {importingElus ? '⏳ Import en cours...' : '🚀 IMPORTER LES DÉPUTÉS'}
                    </button>
                  </div>
                </div>

                <div className="elus-grid-modern" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {deputes.map((depute) => (
                    <div key={depute.id} className="elu-card-modern" style={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => {
                      setSelectedElu(depute);
                      setCurrentScreen('profil');
                    }}>
                      <div className="elu-header" style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                        <div className="elu-avatar-modern" style={{
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          padding: '1rem',
                          color: 'white'
                        }}>
                          <Users size={32} />
                        </div>
                        <div className="elu-info-modern" style={{flex: 1}}>
                          <h3 style={{color: '#e2e8f0', marginBottom: '0.25rem', fontSize: '1.2rem', fontWeight: '600'}}>
                            {depute.name}
                          </h3>
                          <p style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                            {depute.circonscription}
                          </p>
                          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                            <span style={{
                              backgroundColor: '#059669',
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}>
                              {depute.parti}
                            </span>
                            <span style={{
                              backgroundColor: '#7c3aed',
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.75rem'
                            }}>
                              {depute.mandat}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="elu-details" style={{marginBottom: '1rem'}}>
                        <p style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                          <strong>Commission :</strong> {depute.commission}
                        </p>
                        <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>
                          <strong>Groupe :</strong> {depute.groupe}
                        </p>
                      </div>

                      <div className="elu-rating-modern" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                        <StarRating rating={depute.rating || 0} />
                        <span style={{color: '#94a3b8', fontSize: '0.875rem'}}>
                          {depute.rating || 0}/5 ({depute.totalVotes || 0} votes)
                        </span>
                      </div>
                      
                      <button style={{
                        width: '100%',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}>
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
                  
                  {/* Bouton d'import */}
                  <div style={{marginTop: '1rem'}}>
                    <button 
                      onClick={importElusNationaux}
                      disabled={importingElus}
                      style={{
                        backgroundColor: importingElus ? '#6b7280' : '#10b981',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: importingElus ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <UserPlus size={18} />
                      {importingElus ? '⏳ Import en cours...' : '🚀 IMPORTER LES SÉNATEURS'}
                    </button>
                  </div>
                </div>

                <div className="elus-grid-modern" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {senateurs.map((senateur) => (
                    <div key={senateur.id} className="elu-card-modern" style={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => {
                      setSelectedElu(senateur);
                      setCurrentScreen('profil');
                    }}>
                      <div className="elu-header" style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                        <div className="elu-avatar-modern" style={{
                          backgroundColor: '#7c3aed',
                          borderRadius: '50%',
                          padding: '1rem',
                          color: 'white'
                        }}>
                          <Users size={32} />
                        </div>
                        <div className="elu-info-modern" style={{flex: 1}}>
                          <h3 style={{color: '#e2e8f0', marginBottom: '0.25rem', fontSize: '1.2rem', fontWeight: '600'}}>
                            {senateur.name}
                          </h3>
                          <p style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                            Sénateur de la Guyane
                          </p>
                          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                            <span style={{
                              backgroundColor: '#059669',
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}>
                              {senateur.parti}
                            </span>
                            <span style={{
                              backgroundColor: '#7c3aed',
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.75rem'
                            }}>
                              {senateur.mandat}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="elu-details" style={{marginBottom: '1rem'}}>
                        {senateur.fonction_speciale && (
                          <p style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                            <strong>Fonction :</strong> {senateur.fonction_speciale}
                          </p>
                        )}
                        {senateur.particularite && (
                          <p style={{color: '#f59e0b', fontSize: '0.875rem', fontWeight: '600'}}>
                            ⭐ {senateur.particularite}
                          </p>
                        )}
                      </div>

                      <div className="elu-rating-modern" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                        <StarRating rating={senateur.rating || 0} />
                        <span style={{color: '#94a3b8', fontSize: '0.875rem'}}>
                          {senateur.rating || 0}/5 ({senateur.totalVotes || 0} votes)
                        </span>
                      </div>
                      
                      <button style={{
                        width: '100%',
                        backgroundColor: '#7c3aed',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}>
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
                  
                  {/* Bouton d'import */}
                  <div style={{marginTop: '1rem'}}>
                    <button 
                      onClick={importElusNationaux}
                      disabled={importingElus}
                      style={{
                        backgroundColor: importingElus ? '#6b7280' : '#10b981',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: importingElus ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <UserPlus size={18} />
                      {importingElus ? '⏳ Import en cours...' : '🚀 IMPORTER LES CONSEILLERS'}
                    </button>
                  </div>
                </div>

                <div className="elus-grid-modern" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {conseillers.map((conseiller) => (
                    <div key={conseiller.id} className="elu-card-modern" style={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => {
                      setSelectedElu(conseiller);
                      setCurrentScreen('profil');
                    }}>
                      <div className="elu-header" style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                        <div className="elu-avatar-modern" style={{
                          backgroundColor: conseiller.poste.includes('Président') ? '#f59e0b' : '#ec4899',
                          borderRadius: '50%',
                          padding: '1rem',
                          color: 'white'
                        }}>
                          <Users size={32} />
                        </div>
                        <div className="elu-info-modern" style={{flex: 1}}>
                          <h3 style={{color: '#e2e8f0', marginBottom: '0.25rem', fontSize: '1.2rem', fontWeight: '600'}}>
                            {conseiller.name}
                          </h3>
                          <p style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                            {conseiller.poste}
                          </p>
                          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                            <span style={{
                              backgroundColor: '#059669',
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}>
                              {conseiller.parti}
                            </span>
                            <span style={{
                              backgroundColor: '#ec4899',
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.75rem'
                            }}>
                              {conseiller.mandat}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="elu-details" style={{marginBottom: '1rem'}}>
                        {conseiller.delegation && (
                          <p style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                            <strong>Délégation :</strong> {conseiller.delegation}
                          </p>
                        )}
                        {conseiller.fonction && (
                          <p style={{color: '#f59e0b', fontSize: '0.875rem', fontWeight: '600'}}>
                            👑 {conseiller.fonction}
                          </p>
                        )}
                      </div>

                      <div className="elu-rating-modern" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                        <StarRating rating={conseiller.rating || 0} />
                        <span style={{color: '#94a3b8', fontSize: '0.875rem'}}>
                          {conseiller.rating || 0}/5 ({conseiller.totalVotes || 0} votes)
                        </span>
                      </div>
                      
                      <button style={{
                        width: '100%',
                        backgroundColor: '#ec4899',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}>
                        Voir le profil complet
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Message si aucune commune trouvée (pour l'onglet communes) */}
            {currentTab === 'communes' && communes.filter(commune => 
              commune.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (commune.description && commune.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (commune.region && commune.region.toLowerCase().includes(searchTerm.toLowerCase()))
            ).length === 0 && communes.length > 0 && (
              <div style={{textAlign: 'center', padding: '3rem', color: '#94a3b8'}}>
                <Search size={48} style={{marginBottom: '1rem', opacity: 0.5}} />
                <h3 style={{color: '#cbd5e1', marginBottom: '0.5rem'}}>Aucune commune trouvée</h3>
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
                onClick={() => setCurrentScreen('home')} 
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

        <div className="content-section" style={{padding: '2rem 0'}}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <div className="postes-grid-modern" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {postes.map((poste) => (
                <div
                  key={poste.id}
                  onClick={() => {
                    setSelectedPoste(poste);
                    setCurrentScreen('elus');
                  }}
                  className="poste-card-modern"
                  style={{
                    background: `linear-gradient(135deg, ${poste.color}20, ${poste.color}10)`,
                    border: `1px solid ${poste.color}40`,
                    borderRadius: '16px',
                    padding: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <div className="poste-icon-modern" style={{
                    backgroundColor: poste.color,
                    borderRadius: '50%',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    color: 'white'
                  }}>
                    <span style={{fontSize: '32px'}}>{poste.icon}</span>
                  </div>
                  <div className="poste-content">
                    <h3 style={{color: '#e2e8f0', fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem'}}>
                      {poste.name}
                    </h3>
                    <p style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem'}}>
                      Découvrir les élus et leurs actions
                    </p>
                  </div>
                  <div className="poste-arrow" style={{color: poste.color}}>
                    <ChevronDown size={20} />
                  </div>
                </div>
              ))}
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
                
                {/* BOUTON D'IMPORT DES ÉLUS */}
                <div style={{textAlign: 'center'}}>
                  <button 
                    onClick={importElus}
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
                    {importingElus ? '⏳ Import en cours...' : '🚀 IMPORTER 6 ÉLUS LOCAUX'}
                  </button>
                  <p style={{color: '#94a3b8', fontSize: '0.875rem', marginTop: '1rem'}}>
                    Maires, adjoints et conseillers des principales communes !
                  </p>
                </div>
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
                  if (selectedElu?.poste === 'Député' || selectedElu?.poste === 'Sénateur' || selectedElu?.poste?.includes('CTG')) {
                    setCurrentScreen('home');
                  } else {
                    setCurrentScreen('elus');
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
            <div className="questions-section-modern" style={{marginBottom: '2rem'}}>
              <div className="section-header-modern" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{color: '#e2e8f0', fontSize: '1.5rem', fontWeight: '600', margin: 0}}>
                  💬 Questions et avis populaires
                </h3>
                {avisElu.length > 3 && (
                  <button className="see-all-btn-modern" style={{
                    backgroundColor: 'transparent',
                    color: '#3b82f6',
                    border: '1px solid #3b82f6',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}>
                    Voir tout ({avisElu.length})
                  </button>
                )}
              </div>
              
              {avisElu.length > 0 ? (
                <div className="questions-list-modern">
                  {avisElu.slice(0, 5).map((question) => (
                    <QuestionCard 
                      key={question.id} 
                      question={question} 
                      onLike={handleLike}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-questions-modern" style={{
                  textAlign: 'center',
                  padding: '3rem',
                  backgroundColor: '#1e293b',
                  borderRadius: '12px',
                  border: '1px solid #334155'
                }}>
                  <div style={{
                    backgroundColor: '#374151',
                    borderRadius: '50%',
                    padding: '1.5rem',
                    display: 'inline-block',
                    marginBottom: '1rem',
                    color: '#9ca3af'
                  }}>
                    <MessageCircle size={48} />
                  </div>
                  <h4 style={{color: '#e2e8f0', marginBottom: '0.5rem', fontSize: '1.2rem'}}>
                    Aucune question pour l'instant
                  </h4>
                  <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>
                    Soyez le premier à poser une question ou laisser un avis !
                  </p>
                </div>
              )}

              {/* Message de confirmation après ajout d'avis */}
              {avisLocaux.filter(avis => avis.eluId === selectedElu?.id).length > 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '1.5rem',
                  backgroundColor: '#059669',
                  borderRadius: '12px',
                  marginTop: '1rem'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
                  <h4 style={{ color: 'white', marginBottom: '0.25rem', fontSize: '1.1rem' }}>
                    Votre avis a été ajouté !
                  </h4>
                  <p style={{ color: '#d1fae5', fontSize: '0.875rem', margin: 0 }}>
                    Merci pour votre contribution citoyenne
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="actions-section-modern" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <button
                onClick={() => {
                  setMessageType('avis');
                  setCurrentScreen('message');
                }}
                className="action-btn-modern primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '1rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  backgroundColor: 'transparent',
                  color: '#3b82f6',
                  padding: '1rem 1.5rem',
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
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
          author: isAnonymous ? 'Anonyme' : 'Citoyen guyanais',
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
              <div className={`message-info-modern ${messageType}`} style={{
                backgroundColor: messageType === 'avis' ? '#059669' : '#3b82f6',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div className="info-icon-modern" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  padding: '1rem',
                  color: 'white'
                }}>
                  {messageType === 'avis' ? (
                    <MessageCircle size={24} />
                  ) : (
                    <Send size={24} />
                  )}
                </div>
                <div>
                  <h3 style={{color: 'white', fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem'}}>
                    {messageType === 'avis' ? 'Avis public' : 'Question privée'}
                  </h3>
                  <p style={{color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', margin: 0}}>
                    {messageType === 'avis' 
                      ? 'Votre avis sera visible par tous les citoyens et pourra être liké.'
                      : 'Votre question sera envoyée directement à l\'élu de manière confidentielle.'
                    }
                  </p>
                </div>
              </div>

              <div className="form-group-modern" style={{marginBottom: '2rem'}}>
                <label style={{
                  color: '#e2e8f0',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  display: 'block'
                }}>
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
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: '1rem',
                    resize: 'vertical',
                    minHeight: '120px'
                  }}
                />
              </div>

              <div className="form-group-modern" style={{marginBottom: '2rem'}}>
                <label className="checkbox-label-modern" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  color: '#e2e8f0'
                }}>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#3b82f6'
                    }}
                  />
                  <span>Publier de manière anonyme</span>
                </label>
              </div>

              <div className="form-actions-modern" style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <button 
                  onClick={handleSubmit} 
                  className="btn-submit-modern"
                  disabled={!message.trim()}
                  style={{
                    backgroundColor: !message.trim() ? '#6b7280' : (messageType === 'avis' ? '#059669' : '#3b82f6'),
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: !message.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    flex: 1,
                    minWidth: '200px'
                  }}
                >
                  {messageType === 'avis' ? 'Publier l\'avis' : 'Envoyer la question'}
                </button>
                <button 
                  onClick={() => setCurrentScreen('profil')} 
                  className="btn-cancel-modern"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#94a3b8',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    border: '1px solid #374151',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    flex: 1,
                    minWidth: '200px'
                  }}
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

  return null;
}

export default App;