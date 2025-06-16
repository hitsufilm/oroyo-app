// === ÉDUCATION POLITIQUE AVANCÉE - PARTIE 1 ===
// Version enrichie avec sous-sections interactives et anecdotes

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronRight, 
  Crown, 
  Building, 
  Vote, 
  Scale, 
  Globe2, 
  Users, 
  MapPin,
  AlertCircle,
  CheckCircle,
  Book,
  Target,
  Lightbulb,
  HelpCircle,
  Info,
  Zap,
  Heart,
  TrendingUp,
  FileText,
  Eye,
  Shield,
  Home,
  Briefcase,
  Coffee,
  Globe,
  Settings
} from 'lucide-react';

const EducationPolitiqueAvancee = ({ setCurrentScreen }) => {
  const [activeSection, setActiveSection] = useState('maires');
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [activeSubSection, setActiveSubSection] = useState(null);

  // Données enrichies avec sous-sections interactives
  const sectionsDataAvancees = {
    maires: {
      title: "🏛️ Les Maires en Détail",
      icon: Crown,
      color: "#F59E0B",
      description: "Tout savoir sur le poste de maire : devenir maire, exercer le mandat, anecdotes et cas pratiques",
      subSections: {
        devenir: {
          title: "🎯 Devenir Maire",
          icon: Target,
          questions: [
            {
              id: "puis-je-etre-maire",
              question: "Est-ce que JE peux devenir maire ?",
              reponse: "Très probablement OUI ! Si vous êtes français(e), majeur(e), et que vous habitez la commune (ou y payez des impôts), vous pouvez vous présenter. Pas besoin de diplôme particulier - Marie-Laure Phinéra-Horth était orthophoniste avant d'être maire de Cayenne ! L'important c'est votre motivation et votre projet pour la commune.",
              illustration: "✅ Nationalité + 18 ans + Résidence = Vous pouvez être candidat(e) !",
              anecdote: "💡 Anecdote : En 2020, le plus jeune maire élu en France avait 23 ans ! En Guyane, plusieurs maires ont été élus sans expérience politique préalable.",
              casParticulier: "🔍 Cas particulier : Si vous travaillez dans la fonction publique territoriale de la commune, vous devrez être mis en disponibilité pendant votre mandat."
            },
            {
              id: "comment-se-presenter",
              question: "Comment me présenter aux élections ?",
              reponse: "1) Constituer une liste complète (autant de candidats que de sièges au conseil municipal), 2) Déposer sa candidature en préfecture avec les parrainages requis, 3) Faire campagne pendant 3 semaines, 4) Si élu conseiller municipal, être choisi maire par vos collègues conseillers lors du premier conseil municipal.",
              illustration: "📋 Liste → 🏛️ Dépôt → 📢 Campagne → 🗳️ Élection → 👑 Maire",
              anecdote: "🎭 Anecdote : La campagne électorale ne peut officiellement commencer que 3 semaines avant le scrutin, mais les candidats commencent souvent à se faire connaître des mois à l'avance !",
              casParticulier: "⚖️ Important : En Guyane, certaines communes ont un mode de scrutin particulier selon leur taille (scrutin de liste ou majoritaire)."
            },
            {
              id: "age-minimum-maire",
              question: "Y a-t-il un âge minimum pour être maire ?",
              reponse: "Oui, 18 ans minimum. Mais en pratique, c'est rare d'avoir des maires très jeunes car il faut d'abord être élu conseiller municipal, ce qui demande une certaine maturité politique et une connaissance du terrain. L'âge moyen des maires en France est autour de 55 ans.",
              illustration: "🎂 18 ans minimum → 📊 Moyenne 55 ans → 👴 Pas de limite maximum",
              anecdote: "🌟 Record : Le plus jeune maire de l'histoire de la Guyane était âgé de 28 ans lors de son élection à Ouanary en 2008 !"
            },
            {
              id: "femme-maire",
              question: "Une femme peut-elle être maire ?",
              reponse: "Bien sûr ! Et c'est de plus en plus fréquent. En Guyane, nous avons actuellement plusieurs femmes maires : Marie-Laure Phinéra-Horth à Cayenne, Sophie Charles à Saint-Laurent-du-Maroni, Véronique Jacaria à Saint-Élie, Marie-Hélène Charles à Saül...",
              illustration: "👩‍⚖️ Égalité totale → 📈 Progression constante → 🏆 Plusieurs femmes maires en Guyane",
              anecdote: "🥇 Première : Marie-Laure Phinéra-Horth a été la première femme élue maire de Cayenne en 2020, marquant l'histoire de la capitale guyanaise !",
              casParticulier: "📊 Statistique : En France, environ 20% des maires sont des femmes, un chiffre en progression constante."
            }
          ]
        },
        exercer: {
          title: "⚖️ Exercer le Mandat",
          icon: Shield,
          questions: [
            {
              id: "premier-jour-maire",
              question: "Que se passe-t-il le premier jour où je deviens maire ?",
              reponse: "Cérémonie d'installation officielle, remise de l'écharpe tricolore, passation de pouvoir avec l'ancien maire, première réunion avec les services municipaux, découverte des dossiers urgents. C'est souvent très intense et émouvant !",
              illustration: "🎗️ Écharpe → 📁 Dossiers → 👥 Équipe → 🏛️ Responsabilités",
              anecdote: "😅 Témoignage : 'Mon premier jour, j'ai découvert qu'il y avait une fuite d'eau majeure et une manifestation prévue le lendemain. Baptême du feu !' - Témoignage d'un maire guyanais",
              casParticulier: "📞 Urgences : Le maire peut être appelé 24h/24 pour les urgences (accidents, catastrophes naturelles, troubles à l'ordre public)."
            },
            {
              id: "journee-type-maire",
              question: "À quoi ressemble une journée type de maire ?",
              reponse: "7h: Emails urgents, 8h: Réunion services municipaux, 9h: Rendez-vous citoyens, 11h: Visite chantier, 14h: Conseil municipal, 16h: Rencontre associations, 18h: Inauguration, 20h: Réunion publique. Et souvent des appels le soir !",
              illustration: "☀️ Matin: Bureau → 🏗️ Terrain → 🏛️ Réunions → 🌙 Soir: Événements",
              anecdote: "📱 Réalité : Un maire reçoit en moyenne 50 à 100 emails par jour et environ 20 appels téléphoniques. Certains week-ends, c'est pareil !",
              casParticulier: "🏖️ Vacances : Même en congés, le maire reste responsable et peut être rappelé en urgence."
            },
            {
              id: "erreurs-eviter",
              question: "Quelles erreurs éviter en tant que maire ?",
              reponse: "Ne pas déléguer (burn-out garanti), ignorer l'opposition, prendre des décisions seul sans consulter, négliger la communication, mélanger intérêts privés et publics, promettre l'impossible en campagne, oublier que tout est public (transparence obligatoire).",
              illustration: "❌ Solitude → ❌ Secret → ❌ Promesses → ✅ Équipe → ✅ Transparence",
              anecdote: "⚠️ Piège classique : Un maire a été mis en difficulté pour avoir utilisé la voiture de fonction pour des courses personnelles. Tout est scruté !",
              casParticulier: "🔍 Contrôles : La chambre régionale des comptes vérifie régulièrement la gestion des communes."
            }
          ]
        },
        pratique: {
          title: "🎯 Cas Pratiques",
          icon: Briefcase,
          questions: [
            {
              id: "ville-vs-commune",
              question: "Quelle est la différence entre ville et commune ?",
              reponse: "Aucune différence juridique ! 'Commune' est le terme officiel, 'ville' est plus familier. Cayenne est une commune ET une ville. Toutes les communes de Guyane, même Saül avec 149 habitants, ont exactement le même statut juridique que Paris !",
              illustration: "🏛️ Commune = Statut juridique → 🏙️ Ville = Langage courant → ⚖️ Mêmes droits",
              anecdote: "🤓 Culture générale : En France, on dit 'Monsieur/Madame le Maire' même pour une commune de 50 habitants !",
              casParticulier: "📊 En Guyane : De Saül (149 hab.) à Cayenne (61 550 hab.), toutes sont des 'communes' avec un maire."
            },
            {
              id: "maire-police",
              question: "Le maire peut-il arrêter quelqu'un ?",
              reponse: "Oui ! Le maire est officier de police judiciaire et peut constater des infractions. En pratique, il délègue souvent à la police municipale. Il peut aussi prendre des arrêtés pour maintenir l'ordre public (interdire rassemblements, circulation...).",
              illustration: "👮 Officier de police → 📋 Constater infractions → 🚫 Arrêtés d'interdiction",
              anecdote: "🚨 Cas réel : Un maire de Guyane a déjà personnellement verbalisé des véhicules mal garés devant la mairie !",
              casParticulier: "⚖️ Limites : Le maire ne peut pas mener d'enquêtes criminelles, c'est le domaine de la police nationale."
            },
            {
              id: "salaire-reel-maire",
              question: "Combien gagne vraiment un maire en Guyane ?",
              reponse: "Ça dépend de la population : Saül (149 hab.) = 645€/mois, Kourou (25 892 hab.) = 2 470€/mois, Cayenne (61 550 hab.) = 3 500€/mois. Plus les frais de représentation. Mais attention : c'est souvent moins qu'un salaire équivalent dans le privé !",
              illustration: "💰 Petite commune: 645€ → Moyenne: 2470€ → Grande: 3500€ (+frais)",
              anecdote: "💡 Réalité : Beaucoup de maires en Guyane gardent leur emploi principal car l'indemnité ne suffit pas à vivre !",
              casParticulier: "🏝️ Spécificité outre-mer : Les indemnités sont les mêmes qu'en métropole, mais le coût de la vie est plus élevé."
            }
          ]
        },
        anecdotes: {
          title: "📚 Anecdotes & Histoire",
          icon: Coffee,
          questions: [
            {
              id: "maires-celebres-guyane",
              question: "Qui sont les maires les plus marquants de l'histoire guyanaise ?",
              reponse: "Élie Castor (père de Jean-Victor, maire de Sinnamary puis Kourou), Georges Othily (Cayenne, 1983-1995), Alain Tien-Liong (Cayenne, 1995-2010), Rodolphe Alexandre (maire de Cayenne puis Président CTG), Marie-Laure Phinéra-Horth (première femme maire de Cayenne).",
              illustration: "🏛️ Dynasties politiques → 👩 Première femme → 🔄 Évolutions historiques",
              anecdote: "👨‍👦 Dynastie : La famille Castor a marqué la politique guyanaise : Élie (maire), Jean-Victor (député), une vraie dynastie démocratique !",
              casParticulier: "📜 Histoire : Avant 1946, la Guyane était une colonie et n'avait pas de maires élus comme aujourd'hui."
            },
            {
              id: "situations-insolites",
              question: "Quelles sont les situations les plus insolites vécues par nos maires ?",
              reponse: "Gérer l'orpaillage illégal dans sa commune, organiser l'évacuation lors d'inondations amazoniennes, marier des couples de 10 nationalités différentes, arbitrer des conflits entre communautés amérindiennes, accueillir des tournages de films internationaux...",
              illustration: "⛏️ Orpaillage → 🌊 Inondations → 🎬 Tournages → 🌍 Diversité culturelle",
              anecdote: "🎬 Hollywood en Guyane : Plusieurs maires ont dû gérer des tournages internationaux, comme pour des documentaires sur l'Amazonie !",
              casParticulier: "🛸 Insolite : Le maire de Saül a déjà dû gérer l'atterrissage d'urgence d'un hélicoptère touristique !"
            },
            {
              id: "defis-uniques-guyane",
              question: "Quels défis uniques vivent les maires guyanais ?",
              reponse: "Communes immenses (Maripasoula = taille de la Belgique !), populations dispersées, accès difficile (hélicoptère parfois), multilinguisme (français, créole, langues amérindiennes, boni...), frontières avec Brésil/Suriname, biodiversité exceptionnelle à préserver.",
              illustration: "🗺️ Territoires immenses → 🚁 Accès difficile → 🌍 Multilinguisme → 🦜 Biodiversité",
              anecdote: "🚁 Réalité : Le maire de Grand-Santi doit parfois prendre l'hélicoptère pour visiter certains villages de sa commune !",
              casParticulier: "🛂 Frontières : Les maires frontaliers gèrent des enjeux de sécurité et d'immigration que n'ont pas leurs collègues métropolitains."
            }
          ]
        }
      }
    },
    deputes: {
      title: "🗳️ Les Députés en Détail", 
      icon: Vote,
      color: "#22C55E",
      description: "Tout comprendre sur le rôle de député : élection, missions, vie quotidienne et spécificités guyanaises",
      subSections: {
        devenir: {
          title: "🎯 Devenir Député",
          icon: Target,
          questions: [
            {
              id: "puis-je-etre-depute",
              question: "Est-ce que JE peux devenir député ?",
              reponse: "Oui, si vous avez 18 ans, la nationalité française et que vous n'êtes pas dans un cas d'inéligibilité ! Contrairement aux idées reçues, pas besoin d'être né en politique. Jean-Victor Castor était cadre technique avant d'être député, Davy Rimane était technicien. L'important c'est votre projet pour la Guyane et votre capacité à convaincre 100 000+ électeurs !",
              illustration: "✅ 18 ans + Nationalité française + Projet politique = Candidat potentiel",
              anecdote: "🌟 Inspiration : En 2022, plusieurs candidats députés en Guyane n'avaient jamais été élus auparavant. La démocratie permet le renouvellement !",
              casParticulier: "⚖️ Incompatibilités : Impossible d'être à la fois député et maire, ou député et fonctionnaire (sauf mise en disponibilité)."
            },
            {
              id: "comment-campagne-depute",
              question: "Comment mener campagne pour être député ?",
              reponse: "Campagne intensive de 3 semaines officielles mais préparation de plusieurs mois : constituer une équipe, récolter 500 parrainages citoyens, définir un programme, organiser meetings et porte-à-porte, maîtriser les 2 circonscriptions immenses de Guyane (de Cayenne aux villages isolés), débattre avec les adversaires.",
              illustration: "📋 Parrainages → 👥 Équipe → 📢 Meetings → 🗺️ Territoire → 🎤 Débats",
              anecdote: "🚁 Défi guyanais : Pour toucher tous les électeurs, certains candidats députés utilisent l'hélicoptère pour atteindre les villages isolés du Haut-Maroni !",
              casParticulier: "💰 Budget : Une campagne législative en Guyane coûte entre 50 000€ et 150 000€ selon la circonscription."
            },
            {
              id: "parrainages-depute", 
              question: "C'est quoi les 500 parrainages pour être député ?",
              reponse: "Nouveauté 2024 : chaque candidat doit réunir 500 signatures de citoyens inscrits sur les listes électorales de sa circonscription. C'est pour éviter les candidatures fantaisistes et prouver un minimum de soutien populaire. En Guyane, avec nos territoires immenses, c'est un vrai défi logistique !",
              illustration: "📝 500 signatures → ✅ Soutien minimum → 🗳️ Candidature validée",
              anecdote: "😅 Galère : En 2022, plusieurs candidats ont passé leurs week-ends sur les marchés de Cayenne et Saint-Laurent pour récolter leurs parrainages !",
              casParticulier: "🏝️ Spécificité : Dans les communes isolées de Guyane, certains candidats organisent des 'tournées parrainages' en pirogue !"
            },
            {
              id: "age-minimum-depute",
              question: "Y a-t-il un âge minimum pour être député ?",
              reponse: "18 ans minimum depuis 2011 (avant c'était 23 ans). En pratique, les députés sont souvent plus âgés car il faut du temps pour se faire connaître politiquement. Nos députés guyanais actuels, Jean-Victor Castor et Davy Rimane, ont été élus dans la quarantaine après des parcours professionnels établis.",
              illustration: "🎂 18 ans minimum → 📊 Moyenne 45-50 ans → 🎓 Expérience valorisée",
              anecdote: "👶 Record : Le plus jeune député français élu avait 22 ans ! En Guyane, nos députés sont généralement élus après 35 ans.",
              casParticulier: "🌴 Réalité guyanaise : La maturité politique prend souvent plus de temps dans nos territoires où l'expérience locale compte beaucoup."
            }
          ]
        },
        exercer: {
          title: "🏛️ Exercer le Mandat",
          icon: Building,
          questions: [
            {
              id: "semaine-type-depute",
              question: "À quoi ressemble une semaine type de député ?",
              reponse: "Lundi-Mardi : Permanence en Guyane (rendez-vous citoyens, visites terrain), Mercredi : Voyage Paris (Air France), Jeudi-Vendredi : Assemblée nationale (sessions, commissions, groupes de travail), Week-end : Retour Guyane pour événements locaux. Rythme épuisant mais nécessaire !",
              illustration: "🌴 Lun-Mar: Guyane → ✈️ Mer: Voyage → 🏛️ Jeu-Ven: Paris → 🏠 Week-end: Retour",
              anecdote: "😴 Jet-lag permanent : Nos députés font l'équivalent d'un Paris-New York chaque semaine ! Certains dorment 4h par nuit les jours de voyage.",
              casParticulier: "💸 Frais : L'État rembourse les voyages, mais les députés guyanais ont des frais de mission 10x supérieurs à leurs collègues métropolitains."
            },
            {
              id: "journee-assemblee",
              question: "Que fait un député à l'Assemblée nationale ?",
              reponse: "8h : Lecture des dossiers du jour, 9h : Réunion de groupe politique, 10h30 : Commission (ex: Développement durable), 14h : Questions au gouvernement, 15h : Débats et votes, 18h : Rendez-vous lobbies/associations, 20h : Souvent votes jusqu'à minuit. Journées de 12-14h !",
              illustration: "📚 Dossiers → 👥 Groupe → 💼 Commission → ❓ Questions → 🗳️ Votes",
              anecdote: "🌙 Votes nocturnes : Il arrive que des votes importants aient lieu à 2h du matin ! Les députés doivent rester vigilants même épuisés.",
              casParticulier: "🌴 Spécificité outre-mer : Nos députés interviennent souvent sur des sujets que ne connaissent pas leurs collègues métropolitains."
            },
            {
              id: "pouvoir-reel-depute",
              question: "Quel pouvoir réel a un député ?",
              reponse: "Voter TOUTES les lois françaises, proposer des amendements, interroger les ministres, siéger en commission, proposer des lois, contrôler le budget de l'État. Un député peut bloquer ou faire adopter une mesure qui impacte 67 millions de Français ! Pouvoir énorme mais partagé avec 577 collègues.",
              illustration: "⚖️ Toutes les lois → 💰 Budget État → 🎯 Amendements → 🔍 Contrôle gouvernement",
              anecdote: "🎯 Exemple concret : C'est grâce aux députés d'outre-mer que la loi sur la continuité territoriale (billets d'avion moins chers) a été adoptée !",
              casParticulier: "🌴 Poids guyanais : Avec seulement 2 députés sur 577, la Guyane doit s'allier avec d'autres territoires pour peser dans les votes."
            },
            {
              id: "erreurs-eviter-depute",
              question: "Quelles erreurs éviter en tant que député ?",
              reponse: "Ne plus revenir en circonscription ('parachuté parisien'), oublier ses promesses de campagne, voter sans réfléchir selon les consignes de parti, négliger les dossiers techniques, critiquer sans proposer d'alternatives, ignorer les spécificités ultramarines, avoir des conflits d'intérêts.",
              illustration: "❌ Oubli du terrain → ❌ Votes automatiques → ✅ Travail préparatoire → ✅ Contact citoyen",
              anecdote: "📉 Échec électoral : Plusieurs députés ont perdu leur siège pour avoir été trop souvent absents de leur circonscription.",
              casParticulier: "🚨 Transparence : Tous les votes des députés sont publics sur le site de l'Assemblée nationale. Impossible de se cacher !"
            }
          ]
        },
        specialites: {
          title: "🌴 Spécificités Guyanaises",
          icon: MapPin,
          questions: [
            {
              id: "defis-deputes-guyane",
              question: "Quels défis spécifiques ont nos députés guyanais ?",
              reponse: "Représenter un territoire de 84 000 km² (15% de la France !), gérer des enjeux uniques (orpaillage, déforestation, immigration clandestine, biodiversité), faire comprendre la réalité amazonienne à des collègues métropolitains, jongler entre langues créole/français/amérindien, défendre les intérêts ultramarins.",
              illustration: "🗺️ Territoire immense → 🌿 Enjeux spécifiques → 🗣️ Multilinguisme → 🏛️ Pédagogie Paris",
              anecdote: "📊 Proportion : Nos 2 députés représentent 0,3% de l'Assemblée mais 15% du territoire français ! Responsabilité énorme.",
              casParticulier: "🦎 Exemple concret : Quand ils parlent de protection des iguanes ou de gestion des pirogues, leurs collègues métropolitains découvrent un autre monde !"
            },
            {
              id: "dossiers-prioritaires",
              question: "Quels dossiers prioritaires pour nos députés ?",
              reponse: "Lutte contre l'orpaillage illégal, continuité territoriale (transports), sécurité aux frontières, préservation de l'Amazonie, développement du spatial (Kourou), réduction de la vie chère, égalité réelle outre-mer, coopération régionale Brésil-Suriname, protection des peuples amérindiens.",
              illustration: "⛏️ Orpaillage → ✈️ Transports → 🛡️ Frontières → 🌳 Amazonie → 🚀 Spatial",
              anecdote: "🏆 Succès : Grâce à nos députés, la Guyane a obtenu des crédits spéciaux pour lutter contre l'orpaillage illégal (+ 50 millions d'euros).",
              casParticulier: "🌍 Coopération : Nos députés sont les seuls en France à traiter régulièrement avec des parlementaires brésiliens et surinamiens !"
            },
            {
              id: "budget-guyane-assemblee",
              question: "Quel budget la Guyane obtient-elle grâce à ses députés ?",
              reponse: "Environ 1,5 milliard d'euros par an de transferts publics ! Dont : 800M€ fonctionnement État, 300M€ investissements, 200M€ prestations sociales, 200M€ collectivités. Sans nos députés pour défendre ces crédits au Parlement, la Guyane perdrait des centaines de millions !",
              illustration: "💰 1,5 Md€/an → 🏛️ Défense parlementaire → 🌴 Développement Guyane",
              anecdote: "💪 Exemple : En 2023, nos députés ont obtenu 50M€ supplémentaires pour la rénovation des lycées guyanais lors des débats budgétaires.",
              casParticulier: "📊 Retour sur investissement : Chaque député guyanais 'rapporte' environ 750M€/an au territoire. Rentabilité exceptionnelle !"
            },
            {
              id: "relations-ministres",
              question: "Comment nos députés travaillent-ils avec les ministres ?",
              reponse: "Rendez-vous réguliers avec le ministre des Outre-mer, interpellations publiques des autres ministres (Intérieur, Écologie, Économie), questions écrites/orales, amendements ciblés, missions parlementaires en Guyane. Relation directe et parfois tendue selon les sujets !",
              illustration: "🤝 Rendez-vous → ❓ Interpellations → 📝 Questions → ✈️ Missions terrain",
              anecdote: "🎬 Télé : Quand nos députés interrogent les ministres, c'est diffusé en direct sur LCP ! Toute la Guyane peut voir ses élus à l'œuvre.",
              casParticulier: "🔥 Tension : Il arrive que nos députés quittent l'hémicycle par protestation quand le gouvernement ignore les problèmes guyanais !"
            }
          ]
        },
        anecdotes: {
          title: "📚 Anecdotes & Coulisses",
          icon: Coffee,
          questions: [
            {
              id: "moments-historiques",
              question: "Quels moments historiques ont marqué nos députés ?",
              reponse: "Christiane Taubira ministre de la Justice (2012-2016), première Guyanaise au gouvernement. Chantal Berthelot, première députée guyanaise (1993). Léon Bertrand, député-maire pendant 20 ans. Gabriel Serville, passage député vers président CTG. Ces figures ont marqué l'histoire !",
              illustration: "👩‍⚖️ Taubira ministre → 🥇 Premières femmes → 🔄 Évolution politique",
              anecdote: "🌟 Fierté : Quand Christiane Taubira a défendu le mariage pour tous à l'Assemblée, toute la Guyane regardait 'notre' députée faire l'Histoire de France !",
              casParticulier: "📜 Héritage : Certaines lois importantes pour l'outre-mer portent le nom de nos anciens députés guyanais."
            },
            {
              id: "coulisses-assemblee",
              question: "Que vivent nos députés dans les coulisses de l'Assemblée ?",
              reponse: "Découverte du protocole parisien, étonnement des collègues sur la Guyane ('il y a vraiment des jaguars ?'), explications constantes sur l'outre-mer, constitution d'alliances avec autres territoires ultramarins, parfois isolement face à 575 députés métropolitains qui ne comprennent pas toujours nos enjeux.",
              illustration: "🤝 Alliances ultramarines → 😲 Curiosité métropole → 📚 Pédagogie constante",
              anecdote: "😂 Anecdote vraie : Un député métropolitain a déjà demandé si les Guyanais avaient besoin de passeport pour venir en France !",
              casParticulier: "🍽️ Protocole : Nos députés sont parfois invités à des dîners officiels où ils sont les seuls à connaître les réalités amazoniennes."
            },
            {
              id: "gaffes-celebres",
              question: "Quelles gaffes célèbres ont marqué nos députés ?",
              reponse: "Confusion Guyane/Ghana par un ministre, député métropolitain parlant de 'nos amis guyanais' en pensant au Guyana (pays voisin), questions sur l'euro en Guyane, surprise d'apprendre que les Guyanais sont Français depuis 1946. Ces malentendus montrent l'importance de nos élus pour l'éducation !",
              illustration: "🌍 Confusion géographique → 😅 Malentendus → 📚 Rôle pédagogique",
              anecdote: "🤦‍♂️ Collector : En 2019, un ministre a félicité nos députés pour 'l'indépendance de la Guyane'... qui n'a jamais eu lieu !",
              casParticulier: "🎓 Mission éducative : Nos députés passent 30% de leur temps à expliquer la Guyane à leurs collègues. C'est du travail !"
            },
            {
              id: "succes-meconnus",
              question: "Quels succès méconnus de nos députés ?",
              reponse: "Obtention du RMI puis RSA en outre-mer, égalité des prestations familiales, défiscalisation des entreprises, financement du CHU, budget orpaillage, protection juridique des langues créoles, reconnaissance des peuples amérindiens, coopération transfrontalière. Victoires discrètes mais essentielles !",
              illustration: "💰 Égalité sociale → 🏥 Infrastructures → 🗣️ Langues → 🤝 Coopération",
              anecdote: "🏆 Victoire cachée : Sans nos députés, la Guyane n'aurait jamais eu le même niveau de protection sociale qu'en métropole !",
              casParticulier: "📈 Impact : Chaque mandat de député guyanais apporte en moyenne 3-4 avancées majeures pour le territoire."
            }
          ]
        }
      }
    },
    senateurs: {
      title: "⚖️ Les Sénateurs en Détail",
      icon: Scale,
      color: "#7C3AED",
      description: "Comprendre le Sénat : élection indirecte, rôle des territoires, spécificités de la 'chambre haute'",
      subSections: {
        devenir: {
          title: "🎯 Devenir Sénateur",
          icon: Target,
          questions: [
            {
              id: "puis-je-etre-senateur",
              question: "Est-ce que JE peux devenir sénateur ?",
              reponse: "Théoriquement oui, mais c'est plus complexe que pour député ! Vous devez avoir 24 ans minimum, être français, et surtout convaincre les 'grands électeurs' (maires, conseillers municipaux, députés, conseillers territoriaux). En Guyane, environ 400 grands électeurs choisissent nos 2 sénateurs. Il faut donc d'abord être élu local ou avoir un fort réseau politique !",
              illustration: "✅ 24 ans + Réseau politique + Soutien des élus locaux = Candidat sénateur",
              anecdote: "🎯 Stratégie : Georges Patient a d'abord été conseiller général, puis maire, avant d'être élu sénateur. Parcours politique progressif classique !",
              casParticulier: "🗳️ Réalité : En Guyane, presque tous les sénateurs ont d'abord été maires ou conseillers territoriaux. C'est la voie royale !"
            },
            {
              id: "grands-electeurs-guyane",
              question: "Qui sont les grands électeurs en Guyane ?",
              reponse: "Environ 400 personnes : les 22 maires, ~250 conseillers municipaux (selon la taille des communes), 55 conseillers territoriaux, 2 députés, et quelques délégués supplémentaires des grandes communes. Cayenne a plus de grands électeurs que Saül ! C'est un collège restreint où tout le monde se connaît.",
              illustration: "👑 22 maires + 👥 250 conseillers + 🏛️ 55 territoriaux + 🗳️ 2 députés = 400 grands électeurs",
              anecdote: "🤝 Réseautage : Les candidats sénateurs passent des mois à rencontrer personnellement chaque grand électeur. Campagne de proximité extrême !",
              casParticulier: "📊 Poids relatif : Le maire de Cayenne 'pèse' plus lourd que celui de Saül car Cayenne a plus de délégués dans le collège électoral."
            },
            {
              id: "election-senatoriale",
              question: "Comment se déroule une élection sénatoriale ?",
              reponse: "Tous les 6 ans (renouvellement par moitié tous les 3 ans), les grands électeurs se réunissent à la préfecture de Cayenne un dimanche matin. Vote à bulletin secret, scrutin majoritaire à 2 tours. Si candidat obtient majorité absolue au 1er tour = élu, sinon 2ème tour entre les 2 meilleurs. Ambiance très différente des législatives !",
              illustration: "📅 Dimanche matin → 🏛️ Préfecture → 🗳️ Bulletin secret → 🏆 Majorité absolue",
              anecdote: "🕐 Timing serré : L'élection sénatoriale de 2023 en Guyane s'est jouée en 2 heures ! Résultats connus avant midi.",
              casParticulier: "🎭 Suspense : Contrairement aux législatives, impossible de faire des sondages fiables. Surprise possible jusqu'au bout !"
            },
            {
              id: "age-24-ans",
              question: "Pourquoi 24 ans minimum pour être sénateur ?",
              reponse: "Tradition historique : le Sénat est la 'chambre de la sagesse', censée tempérer l'Assemblée nationale. 24 ans (vs 18 pour député) symbolise cette maturité supplémentaire. En pratique, nos sénateurs guyanais sont élus bien plus tard : Georges Patient à 48 ans, Marie-Laure Phinéra-Horth à 63 ans.",
              illustration: "🎂 24 ans minimum → 🧠 'Sagesse' → 📊 Réalité : élection après 40-50 ans",
              anecdote: "👴 Record français : Le plus jeune sénateur français avait 26 ans. Le plus âgé... 89 ans ! Large spectre d'âges.",
              casParticulier: "⏰ Patience requise : En Guyane, il faut souvent 15-20 ans de carrière politique locale avant d'espérer le Sénat."
            }
          ]
        },
        exercer: {
          title: "🏛️ Exercer au Sénat",
          icon: Building,
          questions: [
            {
              id: "palais-luxembourg",
              question: "À quoi ressemble la vie au Palais du Luxembourg ?",
              reponse: "Cadre prestigieux et feutré, très différent de l'Assemblée ! Palais historique avec jardins, protocole strict, ambiance plus 'club select'. Hémicycle moins agité, débats plus posés. Nos sénateurs ont des bureaux individuels, restaurant gastronomique, bibliothèque exceptionnelle. Atmosphère de 'haute couture politique' !",
              illustration: "🏰 Palais historique → 🌳 Jardins → 📚 Bibliothèque → 🍽️ Restaurant gastro",
              anecdote: "🍷 Tradition : Le restaurant du Sénat est réputé pour sa cave à vins exceptionnelle. Déjeuners de travail très 'français' !",
              casParticulier: "🎭 Contraste : Nos sénateurs passent de l'Amazonie guyanaise aux salons dorés du Luxembourg. Choc culturel garanti !"
            },
            {
              id: "pouvoir-senat-reel",
              question: "Quel pouvoir réel a le Sénat ?",
              reponse: "Plus subtil que l'Assemblée ! Le Sénat peut modifier, amender, rejeter les lois, mais l'Assemblée a le dernier mot en cas de désaccord. MAIS : pour réviser la Constitution, accord obligatoire des 2 chambres ! Le Sénat nomme aussi au Conseil constitutionnel, contrôle l'application des lois. Contre-pouvoir essentiel !",
              illustration: "⚖️ Révision Constitution → 🏛️ Nominations importantes → 🔍 Contrôle application → 🛡️ Contre-pouvoir",
              anecdote: "🚫 Blocage historique : Le Sénat a déjà bloqué des réformes importantes, forçant le gouvernement à revoir sa copie !",
              casParticulier: "🌴 Outre-mer : Le Sénat défend souvent mieux les territoires ultramarins que l'Assemblée. Vision plus territoriale."
            },
            {
              id: "semaine-type-senateur",
              question: "Semaine type d'un sénateur guyanais ?",
              reponse: "Rythme moins frénétique que les députés ! Lundi-Mardi : Guyane (permanences, dossiers locaux), Mercredi : voyage Paris, Jeudi-Vendredi : Sénat (commissions, débats), souvent présence week-end en Guyane. Moins de voyages que les députés mais travail plus approfondi sur les dossiers.",
              illustration: "🌴 Guyane 3 jours → ✈️ Paris 3 jours → 📚 Approfondissement dossiers",
              anecdote: "📖 Studieux : Les sénateurs lisent davantage ! Sessions plus longues, amendements plus travaillés. Moins de spectacle, plus de fond.",
              casParticulier: "⏰ Timing : Les sessions du Sénat sont souvent décalées par rapport à l'Assemblée. Planning complexe à gérer !"
            },
            {
              id: "commissions-senat",
              question: "Dans quelles commissions travaillent nos sénateurs ?",
              reponse: "Georges Patient : Commission de l'aménagement du territoire et du développement durable (logique avec son passé de maire et ses compétences environnementales). Marie-Laure Phinéra-Horth : Commission des affaires sociales (cohérent avec son background d'orthophoniste et maire). Spécialisations complémentaires pour la Guyane !",
              illustration: "🌿 Patient = Environnement/Territoire → 👥 Phinéra-Horth = Social/Santé",
              anecdote: "🎯 Stratégie : Nos 2 sénateurs couvrent les domaines prioritaires pour la Guyane. Répartition intelligente !",
              casParticulier: "📊 Impact : En commission, un sénateur peut modifier substantiellement un projet de loi. Travail de l'ombre mais crucial !"
            }
          ]
        },
        specificites: {
          title: "🌴 Spécificités & Différences",
          icon: MapPin,
          questions: [
            {
              id: "depute-vs-senateur",
              question: "Concrètement, quelle différence député/sénateur ?",
              reponse: "DÉPUTÉ : Élu direct, représente la Nation, vote en premier les lois, peut renverser le gouvernement, mandat 5 ans, rythme intense. SÉNATEUR : Élu indirect, représente les territoires, révise les lois, garde-fou démocratique, mandat 6 ans, travail plus posé. Complémentaires mais rôles distincts !",
              illustration: "🗳️ Député = Peuple → 🏛️ Sénateur = Territoires | 🏃 Rapide vs 🧠 Réfléchi",
              anecdote: "⚖️ Équilibre : Quand l'Assemblée vote 'dans l'émotion', le Sénat tempère souvent. Système malin des pères fondateurs !",
              casParticulier: "💡 En Guyane : Nos députés portent l'urgence sociale, nos sénateurs la vision long terme. Duo efficace !"
            },
            {
              id: "mandat-6-ans",
              question: "Pourquoi un mandat de 6 ans pour les sénateurs ?",
              reponse: "Stabilité et recul ! Mandat plus long = moins de pression électorale = possibilité de prendre des décisions impopulaires mais nécessaires. Renouvellement par moitié tous les 3 ans évite les 'coups de balai' électoraux. Vision plus sereine et moins partisane. Nos sénateurs peuvent vraiment construire sur la durée !",
              illustration: "📅 6 ans = Vision long terme → 🧠 Moins de pression → 🏗️ Construction durable",
              anecdote: "📈 Continuité : Georges Patient, sénateur depuis 2008, a pu suivre des dossiers sur 15 ans ! Expertise rare.",
              casParticulier: "🌱 Projets guyanais : Certains grands projets (CSG, protection Amazonie) nécessitent cette vision long terme."
            },
            {
              id: "senat-outre-mer",
              question: "Le Sénat défend-il mieux l'outre-mer ?",
              reponse: "Tradition historique oui ! Le Sénat, 'chambre des territoires', comprend mieux les spécificités locales. Moins de pression médiatique parisienne, sénateurs souvent plus proches du terrain. Nos sénateurs ultramarins forment un groupe influent. Défense acharnée de la continuité territoriale, de l'égalité réelle...",
              illustration: "🏝️ Vision territoriale → 🤝 Solidarité ultramarines → 🛡️ Défense spécificités",
              anecdote: "🏆 Victoires : C'est souvent au Sénat que les mesures pro-outre-mer sont adoptées ou renforcées !",
              casParticulier: "📊 Poids : 12 sénateurs ultramarins sur 348 = lobby efficace pour nos territoires."
            },
            {
              id: "election-indirecte-democratie",
              question: "L'élection indirecte est-elle vraiment démocratique ?",
              reponse: "Débat permanent ! PRO : Évite la démagogie, privilégie l'expérience politique, représente vraiment les territoires via les élus locaux. CONTRE : Éloigne du peuple, favorise les 'notables', moins de renouvellement. En Guyane, système plutôt accepté car sénateurs restent proches du terrain.",
              illustration: "✅ Expérience + Territoires → ❌ Éloignement peuple → 🤔 Débat permanent",
              anecdote: "🗳️ Réforme impossible : Chaque tentative de rendre l'élection sénatoriale directe échoue... au Sénat ! Ils défendent leur système.",
              casParticulier: "🌴 Guyane : Nos 400 grands électeurs connaissent personnellement les candidats sénateurs. Proximité paradoxale !"
            }
          ]
        },
        anecdotes: {
          title: "📚 Histoires & Coulisses",
          icon: Coffee,
          questions: [
            {
              id: "georges-patient-record",
              question: "Pourquoi Georges Patient est-il une figure historique ?",
              reponse: "Sénateur depuis 2008 (17 ans !), ancien maire de Mana, vice-président du Parc naturel régional. Figure consensuelle qui transcende les clivages partisans. Spécialiste reconnu de l'Amazonie et de l'environnement. Premier sénateur guyanais réélu 3 fois ! Mémoire vivante de l'évolution politique guyanaise.",
              illustration: "📅 2008-2025 → 🌿 Expert Amazonie → 🤝 Consensus → 🏆 3 mandats",
              anecdote: "🎯 Respect : Même ses adversaires politiques reconnaissent son expertise. Rare en politique !",
              casParticulier: "📚 Mémoire : Patient a connu tous les présidents depuis Sarkozy, tous les ministres des Outre-mer. Archive vivante !"
            },
            {
              id: "marie-laure-phinera",
              question: "Le parcours exceptionnel de Marie-Laure Phinéra-Horth ?",
              reponse: "Orthophoniste, puis maire de Cayenne (2020), puis sénatrice (2020), aujourd'hui 4ème vice-présidente CTG ! Triple mandat exceptionnel. Première femme maire de Cayenne ET première femme sénatrice de Guyane ! Symbole de la montée en puissance des femmes en politique guyanaise.",
              illustration: "👩‍⚕️ Orthophoniste → 👑 Maire → ⚖️ Sénatrice → 🏛️ VP CTG",
              anecdote: "🥇 Pionnière : Elle cumule tous les 'premières fois' pour les femmes en Guyane. Modèle inspirant !",
              casParticulier: "⚖️ Cumul : Sénatrice ET vice-présidente CTG, cumul autorisé et stratégique pour la Guyane."
            },
            {
              id: "ambiance-senat-guyane",
              question: "Quelle ambiance pour nos sénateurs au Palais ?",
              reponse: "Accueil bienveillant mais curiosité constante ! Collègues métropolitains fascinés par l'Amazonie, questions sur la faune ('vous avez vraiment vu des jaguars ?'), étonnement sur les distances ('4h de vol pour Paris ?'). Nos sénateurs sont les 'ambassadeurs' de l'exotisme français au Sénat !",
              illustration: "😲 Curiosité collègues → 🦎 Questions faune → ✈️ Étonnement distances",
              anecdote: "🦌 Anecdote : Georges Patient a déjà apporté des photos de lamantins au Sénat. Ses collègues découvraient cette espèce !",
              casParticulier: "🎓 Rôle pédagogique : Nos sénateurs passent du temps à expliquer la Guyane. Mission non-officielle mais essentielle !"
            },
            {
              id: "votes-historiques",
              question: "Quels votes historiques ont marqué nos sénateurs ?",
              reponse: "Loi égalité réelle outre-mer (2017), budget post-covid pour l'Amazonie, loi biodiversité, réforme territoriale, continuité territoriale... Nos sénateurs votent souvent 'guyanais' avant 'partisan'. Défense systématique des intérêts ultramarins, parfois contre leur propre groupe politique !",
              illustration: "🌴 Vote 'guyanais' → 🏝️ Solidarité ultramarines → 🎯 Intérêt territorial",
              anecdote: "🗳️ Courage : Il arrive que nos sénateurs votent contre leur parti pour défendre la Guyane. Indépendance remarquée !",
              casParticulier: "📊 Statistique : Nos sénateurs votent ensemble dans 90% des cas sur les sujets guyanais. Front commun efficace !"
            },
            {
              id: "reussites-discretes",
              question: "Quelles réussites discrètes de nos sénateurs ?",
              reponse: "Amendements techniques mais cruciaux : exonérations fiscales, financement CHU, budget gendarmerie frontières, protection juridique créole, statut peuples amérindiens, coopération Brésil-Suriname. Travail de l'ombre, peu médiatisé, mais impact énorme sur la vie quotidienne guyanaise !",
              illustration: "💰 Fiscalité → 🏥 Santé → 🛡️ Sécurité → 🗣️ Langues → 🤝 Coopération",
              anecdote: "🔧 Technique : Un amendement de 3 lignes peut rapporter 50M€ à la Guyane ! Magie parlementaire.",
              casParticulier: "📈 Bilan : Chaque mandat sénatorial apporte 5-10 avancées concrètes majeures pour la Guyane."
            }
          ]
        }
      }
    },
    ctg: {
      title: "🌐 La CTG en Détail",
      icon: Globe2,
      color: "#06B6D4",
      description: "Comprendre la collectivité unique de Guyane : histoire, fonctionnement, 55 conseillers et spécificités ultramarines",
      subSections: {
        histoire: {
          title: "📜 Histoire & Création",
          icon: Book,
          questions: [
            {
              id: "pourquoi-ctg-creee",
              question: "Pourquoi la CTG a-t-elle été créée en 2015 ?",
              reponse: "Avant 2015, la Guyane avait 2 collectivités séparées : le Conseil général (département) et le Conseil régional (région) qui se disputaient parfois les compétences ! Doublons, conflits, inefficacité... La CTG fusionne tout en une seule institution pour plus de cohérence, d'efficacité et d'adaptation aux spécificités guyanaises.",
              illustration: "❌ 2 collectivités rivales → ✅ 1 CTG unifiée → 💪 Plus d'efficacité",
              anecdote: "😅 Avant 2015 : Il arrivait que le Conseil général et régional s'opposent publiquement sur des projets ! Spectacle peu reluisant pour les Guyanais.",
              casParticulier: "🏝️ Spécificité outre-mer : Seules la Guyane et la Martinique ont ce statut de 'collectivité unique'. Adaptation aux réalités ultramarines."
            },
            {
              id: "referendum-2010",
              question: "Le référendum de 2010 a-t-il créé la CTG ?",
              reponse: "Non ! Le référendum de 2010 proposait plus d'autonomie (statut d'autonomie) mais a été rejeté par 69,8% des Guyanais. La CTG de 2015 est un compromis : plus de pouvoirs qu'avant, mais moins que l'autonomie. Solution 'médiane' qui satisfait plus de monde qu'un statut radical.",
              illustration: "🗳️ 2010: NON à l'autonomie → 🤝 2015: Compromis CTG → ⚖️ Équilibre trouvé",
              anecdote: "📊 Paradoxe : Les mêmes Guyanais qui ont dit NON à l'autonomie en 2010 ont massivement approuvé la CTG en 2015. Question de dosage !",
              casParticulier: "🎯 Stratégie : Les dirigeants ont appris de l'échec 2010. Moins d'ambition = plus de consensus."
            },
            {
              id: "avant-1946-statut",
              question: "Quel était le statut de la Guyane avant 1946 ?",
              reponse: "Colonie française depuis 1643 ! Pas d'élus locaux, gouverneur nommé par Paris, Code de l'indigénat, travail forcé... 1946 = départementalisation révolutionnaire grâce à Aimé Césaire et Gaston Monnerville. Passage brutal de colonie à département français avec tous les droits ! Révolution démocratique majeure.",
              illustration: "⛓️ 1643-1946: Colonie → 🗳️ 1946: Département → 🌐 2015: CTG",
              anecdote: "🏆 Fierté : Gaston Monnerville, Guyanais, a été président du Sénat français ! De colonisé à 2ème personnage de l'État.",
              casParticulier: "📅 Étapes : 1946 département → 1982 région → 2015 CTG. Évolution progressive vers plus d'autonomie."
            },
            {
              id: "modele-inspire",
              question: "La CTG s'inspire-t-elle d'autres modèles ?",
              reponse: "Oui ! Inspiration des régions italiennes (Sicile, Sardaigne), des communautés autonomes espagnoles (Canaries), et surtout des collectivités d'outre-mer françaises (Nouvelle-Calédonie, Polynésie). Adaptation du 'fédéralisme à la française' aux réalités ultramarines. Modèle hybride original !",
              illustration: "🇮🇹 Sicile + 🇪🇸 Canaries + 🇳🇨 Nouvelle-Calédonie = 🌐 Modèle CTG",
              anecdote: "🌍 Inspiration : Des délégations guyanaises ont visité la Sicile et les Canaries avant de créer la CTG. Benchmarking international !",
              casParticulier: "🔬 Laboratoire : La CTG sert de modèle à d'autres territoires ultramarins qui étudient notre expérience."
            }
          ]
        },
        fonctionnement: {
          title: "⚙️ Fonctionnement",
          icon: Users,
          questions: [
            {
              id: "55-conseillers-pourquoi",
              question: "Pourquoi 55 conseillers territoriaux exactement ?",
              reponse: "Calcul savant ! Fusion de l'ancien Conseil général (19 élus) + Conseil régional (31 élus) = 50, puis +5 pour tenir compte de la croissance démographique. 55 permet une représentation équilibrée entre communes côtières peuplées et territoires isolés de l'intérieur. Nombre optimal pour débattre sans cacophonie !",
              illustration: "👥 19 + 31 + 5 = 55 conseillers → ⚖️ Équilibre côte/intérieur",
              anecdote: "🧮 Négociation : Les discussions pour fixer le nombre ont duré des mois ! Chaque territoire voulait ses représentants.",
              casParticulier: "📊 Comparaison : 55 pour 295 000 habitants = 1 élu pour 5 364 habitants. Représentation très proche !"
            },
            {
              id: "president-vice-presidents",
              question: "Comment fonctionne l'exécutif de la CTG ?",
              reponse: "1 Président (Gabriel Serville) + 4 Vice-présidents spécialisés : Jean-Paul Fereira (Développement durable), Sophie Charles (Éducation), Rodolphe Alexandre (Europe/Institutions), Marie-Laure Phinéra-Horth (Santé/Social). Répartition des compétences pour plus d'efficacité. Gouvernement local à 5 têtes !",
              illustration: "👑 1 Président + 4 VP spécialisés → 🎯 Répartition compétences → 💪 Efficacité",
              anecdote: "🤝 Coalition : L'équipe actuelle réunit des sensibilités politiques différentes. Gouvernement d'union pour la Guyane !",
              casParticulier: "⚖️ Équilibre : Les VP représentent différents territoires (côte, intérieur) et générations (de 45 à 65 ans)."
            },
            {
              id: "budget-ctg-reel",
              question: "Quel est le vrai budget de la CTG ?",
              reponse: "Budget 2024 : 1,1 milliard d'euros ! Répartition : 60% fonctionnement (salaires, services), 40% investissement (routes, lycées, hôpitaux). Sources : 40% dotations État, 30% fiscalité locale, 20% emprunts, 10% fonds européens. Budget équivalent à une grande ville métropolitaine mais pour tout un territoire !",
              illustration: "💰 1,1 Md€ → 60% fonctionnement + 40% investissement → 🏗️ Développement territoire",
              anecdote: "📊 Perspective : 1,1 Md€ = budget de Marseille ! Mais la CTG gère routes, lycées, hôpitaux, social...",
              casParticulier: "🌴 Spécificité : 70% du budget vient de l'extérieur (État, Europe). Dépendance assumée mais stratégique."
            },
            {
              id: "competences-vraies",
              question: "Quelles sont les vraies compétences de la CTG ?",
              reponse: "DÉPARTEMENT : routes, collèges, aide sociale, RSA, personnes âgées, pompiers. RÉGION : lycées, formation pro, développement économique, transports. SPÉCIAL OUTRE-MER : coopération transfrontalière, adaptation des lois nationales, gestion de l'immigration, douanes locales. Mix unique en France !",
              illustration: "🏫 Collèges+Lycées → 🛣️ Routes → 💼 Économie → 🤝 Coopération → 🛂 Immigration",
              anecdote: "🦎 Exemple concret : La CTG peut interdire l'importation d'iguanes verts (espèce invasive). Pouvoir que n'a aucune région métropolitaine !",
              casParticulier: "⚖️ Adaptation : La CTG peut modifier l'application de certaines lois nationales aux spécificités guyanaises."
            }
          ]
        },
        politique: {
          title: "🗳️ Vie Politique",
          icon: Vote,
          questions: [
            {
              id: "gabriel-serville-parcours",
              question: "Qui est Gabriel Serville et d'où vient-il ?",
              reponse: "Professeur de sciences économiques et sociales, syndicaliste, député (2012-2021), puis président CTG depuis 2021. Leader du mouvement 'Guyane kontré' (Guyane debout), défenseur de l'autonomie progressive. Parcours intellectuel + terrain + vision politique claire. Symbole du renouveau politique guyanais.",
              illustration: "👨‍🏫 Professeur → 🛡️ Syndicaliste → 🗳️ Député → 👑 Président CTG",
              anecdote: "📚 Prof-politique : Serville continue d'enseigner l'économie même en étant président ! Pédagogie politique concrète.",
              casParticulier: "🌟 Particularité : Premier président CTG à venir du milieu enseignant. Vision différente du pouvoir."
            },
            {
              id: "majorite-opposition",
              question: "Comment se répartit la majorité à la CTG ?",
              reponse: "Majorité 'Guyane kontré' : ~35 sièges sur 55. Opposition 'Unis et engagés' + divers : ~20 sièges. Majorité confortable mais pas écrasante, ce qui oblige au dialogue. Quelques élus 'pivot' qui peuvent faire basculer certains votes. Équilibre démocratique sain !",
              illustration: "👑 35 majorité + 20 opposition → ⚖️ Équilibre démocratique → 🤝 Dialogue obligé",
              anecdote: "🎭 Suspense : Certains votes se jouent à 2-3 voix près ! Chaque conseiller compte vraiment.",
              casParticulier: "🗳️ Réalité : Plus de pluralisme qu'à l'Assemblée nationale où la majorité présidentielle est plus écrasante."
            },
            {
              id: "election-conseillers",
              question: "Comment sont élus les 55 conseillers territoriaux ?",
              reponse: "Élection tous les 6 ans (prochaine en 2027), scrutin de liste départemental avec prime majoritaire. Liste arrivée en tête obtient la majorité absolue (28 sièges), les autres sièges répartis proportionnellement. Système qui garantit une majorité stable tout en respectant le pluralisme.",
              illustration: "📋 Listes → 🏆 Prime majoritaire → ⚖️ Répartition proportionnelle → 💪 Majorité stable",
              anecdote: "🎯 Stratégie : Les alliances entre listes au 2ème tour sont cruciales. Négociations intenses !",
              casParticulier: "🗳️ Particularité : Un seul tour si une liste obtient + de 50% au 1er tour. Rare mais possible !"
            },
            {
              id: "hemicycle-assemblee",
              question: "À quoi ressemble l'Assemblée de Guyane ?",
              reponse: "Hémicycle moderne avenue du Général de Gaulle à Cayenne, inauguré en 2017. 55 sièges en arc de cercle, pupitre présidentiel, tribunes pour le public. Architecture tropicale avec bois local, climatisation puissante ! Sessions publiques retransmises en direct sur internet.",
              illustration: "🏛️ Hémicycle moderne → 🌴 Architecture tropicale → 📺 Retransmission directe",
              anecdote: "🌡️ Climat : Les sessions d'été sont parfois interrompues par des orages tropicaux spectaculaires !",
              casParticulier: "👥 Public : Contrairement à l'Assemblée nationale, les tribunes sont souvent pleines de citoyens guyanais."
            }
          ]
        },
        avenir: {
          title: "🚀 Défis & Avenir",
          icon: TrendingUp,
          questions: [
            {
              id: "autonomie-progressive",
              question: "Qu'est-ce que 'l'autonomie progressive' ?",
              reponse: "Stratégie de Gabriel Serville : obtenir progressivement plus de compétences sans rupture brutale avec la France. Étapes : adaptation des lois, fiscalité propre, coopération transfrontalière renforcée, puis possiblement statut d'autonomie dans 10-15 ans. Révolution en douceur plutôt qu'indépendance !",
              illustration: "🔄 Adaptation lois → 💰 Fiscalité → 🤝 Coopération → 🎯 Autonomie future",
              anecdote: "📈 Pédagogie : Serville organise des 'États généraux' pour expliquer l'autonomie progressive. Démocratie participative !",
              casParticulier: "⚖️ Équilibre : Rester français tout en gérant nos spécificités. Voie du milieu assumée."
            },
            {
              id: "grands-projets-ctg",
              question: "Quels grands projets porte la CTG ?",
              reponse: "Pont sur l'Oyapock (liaison Brésil), nouvelle route du littoral, CHU de Guyane, université des Antilles-Guyane, parc amazonien élargi, coopération spatiale européenne, développement de l'écotourisme, lutte contre l'orpaillage. Projets à 10-20 ans pour transformer la Guyane !",
              illustration: "🌉 Pont Brésil → 🏥 CHU → 🎓 Université → 🌳 Amazonie → 🚀 Spatial",
              anecdote: "🌍 Ambition : Le pont sur l'Oyapock reliera l'Europe au Brésil ! La Guyane, porte d'entrée de l'UE en Amérique du Sud.",
              casParticulier: "💰 Financement : Ces projets mobilisent fonds européens, français et parfois brésiliens. Diplomatie financière !"
            },
            {
              id: "defis-jeunesse",
              question: "Comment la CTG répond-elle aux défis de la jeunesse ?",
              reponse: "50% des Guyanais ont moins de 25 ans ! Défis énormes : formation, emploi, logement. Actions CTG : nouveaux lycées, campus connectés, aide à l'entrepreneuriat, service civique guyanais, bourses d'études, plan logement jeunes. But : éviter l'exode vers la métropole !",
              illustration: "👶 50% - 25 ans → 🎓 Formation → 💼 Emploi → 🏠 Logement → 🌴 Rester en Guyane",
              anecdote: "✈️ Enjeu : Chaque année, 2000 jeunes Guyanais partent étudier en métropole. Combien reviendront ?",
              casParticulier: "🎯 Innovation : Création de formations spécifiques (métiers de l'Amazonie, spatial, écotourisme) inexistantes ailleurs."
            },
            {
              id: "climat-ctg-2030",
              question: "Quels défis climatiques pour la CTG en 2030 ?",
              reponse: "Réchauffement, montée des eaux (menace littoral), intensification cyclones, sécheresses plus fréquentes, migration climatique depuis les Caraïbes. Actions CTG : plan adaptation, énergies renouvelables, protection mangroves, agriculture résiliente, coopération régionale climat. L'Amazonie comme atout !",
              illustration: "🌡️ Réchauffement → 🌊 Montée eaux → 🌪️ Cyclones → 🌱 Adaptation → 🌳 Amazonie atout",
              anecdote: "🦎 Paradoxe : La Guyane subit le réchauffement mais reste un puits de carbone mondial grâce à sa forêt !",
              casParticulier: "🌍 Responsabilité : Avec 96% de forêt, la Guyane est vitale pour le climat mondial. Pression internationale forte !"
            }
          ]
        }
      }
    },
    elections: {
      title: "🗳️ Élections & Démocratie",
      icon: Vote,
      color: "#EF4444",
      description: "Maîtriser le système électoral français en Guyane : types de scrutins, bureaux de vote, procurations et particularités ultramarines",
      subSections: {
        voter: {
          title: "✅ Voter en Pratique",
          icon: CheckCircle,
          questions: [
            {
              id: "inscription-listes-electorales",
              question: "Comment s'inscrire sur les listes électorales en Guyane ?",
              reponse: "3 moyens : en ligne sur service-public.fr (le plus simple !), en mairie avec justificatifs, ou automatiquement à 18 ans si parents déjà inscrits. Deadline : 6ème vendredi avant l'élection. En Guyane, possibilité de s'inscrire dans sa commune de résidence OU de travail (pratique pour Kourou/Cayenne) !",
              illustration: "💻 En ligne + 🏛️ Mairie + 🎂 Auto à 18 ans → ⏰ Deadline 6ème vendredi",
              anecdote: "📱 Modernité : Depuis 2019, 70% des inscriptions en Guyane se font en ligne ! Fini les queues en mairie.",
              casParticulier: "🌴 Spécificité : En Guyane, possible de voter dans sa commune de travail si différente de la résidence. Utile pour les fonctionnaires !"
            },
            {
              id: "bureaux-vote-guyane",
              question: "Comment fonctionnent les bureaux de vote en Guyane ?",
              reponse: "Ouverture 8h-18h (parfois 19h à Cayenne), isoloirs obligatoires, urnes transparentes, dépouillement public. Particularités Guyane : bureaux itinérants en pirogue pour villages isolés, vote par correspondance pour militaires en mission, interprètes créole/langues amérindiennes disponibles !",
              illustration: "🕗 8h-18h → 🗳️ Isoloir → 📦 Urne transparente → 🚣 Pirogues villages isolés",
              anecdote: "🚣 Exotisme : Certains assesseurs voyagent 6h en pirogue pour apporter l'urne dans les villages du Haut-Maroni !",
              casParticulier: "🗣️ Multilinguisme : Dans certains bureaux, des interprètes aident les électeurs non-francophones. Démocratie inclusive !"
            },
            {
              id: "procuration-guyane",
              question: "Comment faire une procuration depuis/vers la Guyane ?",
              reponse: "Procuration gratuite en commissariat, gendarmerie ou consulat (si à l'étranger). Nouveauté 2022 : possible en ligne sur maprocuration.gouv.fr ! Très utilisé en Guyane : étudiants en métropole, fonctionnaires en mission, familles en vacances. Jusqu'à 2 procurations par personne.",
              illustration: "👮 Commissariat + 💻 En ligne → ✈️ Étudiant métropole → 🗳️ Famille vote",
              anecdote: "📊 Record : Aux présidentielles 2022, 15% des votes guyanais étaient des procurations ! Record français.",
              casParticulier: "🌍 International : Un Guyanais en métropole peut donner procuration à sa famille restée en Guyane. Lien démocratique fort !"
            },
            {
              id: "vote-blanc-nul",
              question: "Quelle différence entre vote blanc et vote nul ?",
              reponse: "VOTE BLANC : bulletin vide ou enveloppe vide, geste politique de protestation, comptabilisé séparément depuis 2014. VOTE NUL : bulletin déchiré, annoté, plusieurs bulletins, non comptabilisé. En Guyane, taux de vote blanc élevé (5-8%) exprimant parfois la frustration politique.",
              illustration: "⚪ Blanc = Protestation comptée → ❌ Nul = Erreur non comptée",
              anecdote: "📈 Protestation : En 2017, certains bureaux guyanais ont eu jusqu'à 12% de votes blancs ! Message politique clair.",
              casParticulier: "🤔 Débat : Certains proposent que le vote blanc fasse ballotter si > 50%. Révolution démocratique potentielle !"
            }
          ]
        },
        scrutins: {
          title: "🎯 Types de Scrutins",
          icon: Target,
          questions: [
            {
              id: "scrutin-majoritaire",
              question: "C'est quoi le scrutin majoritaire ?",
              reponse: "Le candidat/la liste qui obtient le plus de voix gagne ! 2 versions : majoritaire à 1 tour (rare) ou 2 tours (fréquent). Exemples en Guyane : élection présidentielle, législatives, certaines municipales. Avantage : majorité claire. Inconvénient : peut exclure des minorités importantes.",
              illustration: "🏆 Plus de voix = Victoire → 🔄 Souvent 2 tours → 👑 Majorité claire",
              anecdote: "🎯 2022 : Macron élu président avec 58% au 2ème tour. Majorité nette grâce au scrutin majoritaire !",
              casParticulier: "🌴 Guyane : Nos 2 circonscriptions législatives utilisent ce système. Parfois très serré !"
            },
            {
              id: "scrutin-proportionnel",
              question: "Comment fonctionne le scrutin proportionnel ?",
              reponse: "Chaque liste obtient un nombre de sièges proportionnel à ses voix. Exemple : 30% des voix = 30% des sièges. Plus juste pour représenter toutes les opinions, mais peut créer de l'instabilité (difficile d'avoir une majorité). En Guyane : européennes, certaines municipales.",
              illustration: "📊 30% voix = 30% sièges → ⚖️ Plus juste → 🤹 Mais instable",
              anecdote: "🇪🇺 Européennes 2024 : En Guyane, 6 listes différentes ont eu des voix ! Pluralisme maximal.",
              casParticulier: "💡 Simulation : Si l'Assemblée était élue à la proportionnelle, aucun parti n'aurait la majorité absolue !"
            },
            {
              id: "scrutin-mixte",
              question: "Qu'est-ce qu'un scrutin mixte ?",
              reponse: "Mélange des 2 systèmes ! Prime majoritaire (bonus sièges) pour la liste arrivée en tête + répartition proportionnelle du reste. Utilisé pour CTG, grandes municipales. But : garantir une majorité de gouvernement tout en respectant le pluralisme. Compromis à la française !",
              illustration: "🎁 Prime majoritaire + ⚖️ Proportionnelle = 💪 Majorité stable + 👥 Pluralisme",
              anecdote: "🗳️ CTG 2021 : 'Guyane kontré' a eu 35 sièges sur 55 avec ~45% des voix. Effet prime majoritaire !",
              casParticulier: "🎯 Équilibre : Système inventé pour éviter l'instabilité italienne ET la tyrannie majoritaire anglaise."
            },
            {
              id: "calendrier-electoral",
              question: "Quel est le calendrier électoral en Guyane ?",
              reponse: "2024: Européennes ✅, 2026: Municipales + Sénatoriales, 2027: Présidentielle + Législatives + Territoriales CTG, 2029: Européennes. Tous les 5-6 ans, année électorale intense ! Les Guyanais votent autant que les métropolitains malgré les distances.",
              illustration: "📅 2026: Locales → 2027: Nationales + CTG → 2029: Europe → 🔄 Cycle démocratique",
              anecdote: "🗳️ Marathon 2027 : Présidentielle (avril), Législatives (juin), CTG (automne). Année de démocratie intensive !",
              casParticulier: "🌴 Adaptation : En Guyane, campagnes plus courtes à cause des distances et du coût logistique."
            }
          ]
        },
        particularites: {
          title: "🌴 Spécificités Guyanaises",
          icon: MapPin,
          questions: [
            {
              id: "defis-geographiques",
              question: "Quels défis géographiques pour les élections en Guyane ?",
              reponse: "Territoire immense (84 000 km²), villages isolés accessible uniquement par pirogue/hélicoptère, distances énormes (Maripasoula = 6h de route + pirogue), populations dispersées, coût logistique considérable. Solution : bureaux itinérants, vote anticipé, matériel acheminé par les armées !",
              illustration: "🗺️ 84 000 km² → 🚣 Pirogues → 🚁 Hélicoptères → 🎖️ Logistique militaire",
              anecdote: "🚁 Logistique : Pour les européennes 2024, un hélicoptère a transporté l'urne à Antecume Pata (village de 60 habitants) !",
              casParticulier: "💰 Coût : Organiser une élection en Guyane coûte 3x plus cher par habitant qu'en métropole !"
            },
            {
              id: "multilinguisme-electoral",
              question: "Comment gérer le multilinguisme lors des élections ?",
              reponse: "Bulletins traduits en principales langues (créole, sranang, langues amérindiennes), interprètes dans bureaux sensibles, pictogrammes pour les non-lecteurs, sensibilisation communautaire. Défi unique en France ! But : inclusion maximale de toutes les communautés guyanaises.",
              illustration: "🗣️ Créole + Sranang + Amérindien → 🖼️ Pictogrammes → 🤝 Inclusion totale",
              anecdote: "🎭 Innovation : Certains bureaux utilisent des dessins pour expliquer le vote aux communautés amérindiennes !",
              casParticulier: "🌍 Richesse : 15+ langues parlées en Guyane ! Défi démocratique mais richesse culturelle."
            },
            {
              id: "immigration-vote",
              question: "Les immigrés peuvent-ils voter en Guyane ?",
              reponse: "Seuls les citoyens français peuvent voter aux élections nationales/locales. MAIS : citoyens UE peuvent voter aux municipales et européennes. Important en Guyane avec forte immigration (Brésil, Suriname, Haïti...). Débat récurrent sur droits civiques des résidents étrangers de longue durée.",
              illustration: "🇫🇷 Français = Tous votes → 🇪🇺 UE = Municipales + Européennes → 🌍 Autres = Aucun vote",
              anecdote: "📊 Réalité : ~30% de la population guyanaise est étrangère, mais seuls ~15% peuvent voter ! Question démocratique sensible.",
              casParticulier: "🤔 Débat : Certains proposent le vote des étrangers aux municipales après 5 ans de résidence. Révolution à venir ?"
            },
            {
              id: "taux-participation",
              question: "Pourquoi la participation électorale varie-t-elle en Guyane ?",
              reponse: "Très variable : 85% présidentielles, 65% législatives, 45% municipales, 25% européennes ! Facteurs : éloignement géographique, frustration politique, jeunesse de la population, complexité institutionnelle. Paradoxe : forte politisation MAIS abstention importante selon les scrutins.",
              illustration: "📈 85% Président → 📊 65% Législatives → 📉 45% Municipales → 📊 25% Europe",
              anecdote: "🎯 Contraste : Même village peut voter à 80% aux présidentielles et 30% aux européennes ! Hiérarchie des scrutins.",
              casParticulier: "👶 Jeunesse : 50% de -25 ans explique en partie l'abstention. Premiers votes souvent aux présidentielles."
            }
          ]
        },
        reforme: {
          title: "🔄 Réformes & Avenir",
          icon: TrendingUp,
          questions: [
            {
              id: "vote-electronique",
              question: "Le vote électronique arrivera-t-il en Guyane ?",
              reponse: "Débat permanent ! POUR : réduction coûts logistiques énormes, rapidité résultats, modernisation. CONTRE : risques piratage, fracture numérique, perte du 'rituel' démocratique. En Guyane, solution hybride possible : vote électronique pour communes isolées, papier pour villes. Test progressif ?",
              illustration: "💻 Pour: Coûts + Rapidité → ⚠️ Contre: Sécurité + Fracture → 🤝 Hybride possible",
              anecdote: "🇪🇪 Estonie : 99% de vote électronique ! Mais population tech-friendly et territoire petit. Guyane = défi différent.",
              casParticulier: "🌴 Test : Certains proposent d'expérimenter le vote électronique d'abord dans les villages isolés. Laboratoire démocratique !"
            },
            {
              id: "reforme-institutions",
              question: "Quelles réformes institutionnelles pour la Guyane ?",
              reponse: "Débats en cours : statut d'autonomie (référendum futur ?), représentation renforcée au Parlement (+ de députés/sénateurs), adaptation scrutins aux spécificités, vote obligatoire (?), abaissement âge vote (16 ans ?). Guyane laboratoire institutionnel de la République !",
              illustration: "🎯 Autonomie → 👥 + de députés → 🗳️ Vote 16 ans → ⚖️ Scrutins adaptés",
              anecdote: "🔬 Laboratoire : La Guyane teste souvent des innovations (CTG, coopération transfrontalière) avant généralisation !",
              casParticulier: "📊 Débat : 1 député pour 147 500 habitants en Guyane vs 1 pour 67 000 en Lozère. Rééquilibrage nécessaire ?"
            },
            {
              id: "democratie-participative",
              question: "Comment développer la démocratie participative en Guyane ?",
              reponse: "Initiatives en cours : conseils citoyens, budgets participatifs, consultations numériques, États généraux thématiques, assemblées de jeunes. But : compenser l'éloignement géographique par l'innovation démocratique. Guyane pionnière de la démocratie 2.0 !",
              illustration: "👥 Conseils citoyens → 💰 Budgets participatifs → 💻 Consultations en ligne → 👶 Assemblées jeunes",
              anecdote: "🌟 Innovation : Cayenne a lancé le premier budget participatif d'outre-mer ! 2M€ décidés directement par les citoyens.",
              casParticulier: "📱 Numérique : Avec la fibre généralisée, la Guyane peut devenir leader de la démocratie numérique participative !"
            },
            {
              id: "education-civique",
              question: "Comment améliorer l'éducation civique en Guyane ?",
              reponse: "Enjeu majeur avec 50% de -25 ans ! Actions : cours renforcés au lycée, simulations élections, stages citoyens, service civique, rencontres élus/jeunes, plateformes éducatives (comme Oroyo !). But : former des citoyens éclairés pour la démocratie guyanaise de demain.",
              illustration: "🎓 Cours renforcés → 🗳️ Simulations → 🤝 Rencontres élus → 📱 Plateformes éducatives",
              anecdote: "🎯 Succès : Les lycées organisant des 'mini-élections' voient leurs anciens élèves voter davantage à 18 ans !",
              casParticulier: "🌟 Oroyo : Cette plateforme participe à cette éducation civique moderne ! Démocratie interactive et pédagogique."
            }
          ]
        }
      }
    },
    institutions: {
      title: "🌍 Institutions & Coopération",
      icon: Globe2,
      color: "#8B5CF6",
      description: "La Guyane dans le monde : Europe, coopération régionale, institutions internationales et diplomatie amazonienne",
      subSections: {
        europe: {
          title: "🇪🇺 La Guyane en Europe",
          icon: Globe2,
          questions: [
            {
              id: "guyane-union-europeenne",
              question: "La Guyane fait-elle vraiment partie de l'Union européenne ?",
              reponse: "OUI à 100% ! Depuis 1957, la Guyane est une 'région ultrapériphérique' (RUP) de l'UE. Tous les traités européens s'appliquent, on vote aux européennes, on reçoit des fonds européens (500M€ sur 2021-2027 !). Paradoxe : territoire européen en Amérique du Sud, frontière UE avec le Brésil !",
              illustration: "🇪🇺 RUP depuis 1957 → 🗳️ Vote européennes → 💰 500M€ fonds → 🌎 Europe en Amazonie",
              anecdote: "🛂 Frontière unique : Saint-Georges/Oiapoque = seule frontière terrestre entre l'UE et le Brésil ! Poste frontière le plus exotique d'Europe.",
              casParticulier: "⏰ Décalage : Quand il est midi à Bruxelles, il est 8h en Guyane. Réunions UE en pleine nuit guyanaise !"
            },
            {
              id: "depute-europeen-guyane",
              question: "Avons-nous un député européen guyanais ?",
              reponse: "Pas spécifiquement ! La Guyane vote dans la circonscription 'Outre-mer' avec tous les DROM-COM (79 députés français au total). Actuellement Younous Omarjee (La Réunion) représente l'outre-mer. Débat récurrent : faut-il un député européen spécifiquement guyanais ? Population peut-être trop faible...",
              illustration: "🗳️ Circonscription Outre-mer → 🏝️ Younous Omarjee → 🤔 Député guyanais spécifique ?",
              anecdote: "📊 Proportionnalité : Il faudrait ~400 000 habitants pour 'mériter' un député européen. La Guyane en a 295 000... Presque !",
              casParticulier: "🎯 Influence : Nos élus (maires, CTG) font du lobby à Bruxelles pour défendre les intérêts guyanais."
            },
            {
              id: "fonds-europeens-guyane",
              question: "Que nous rapportent les fonds européens ?",
              reponse: "Jackpot européen ! 2021-2027 : 500M€ de fonds UE pour la Guyane (FEDER, FSE, FEADER...). Financement : routes, formation, agriculture, innovation, environnement. Sans l'Europe, la moitié des grands projets guyanais seraient impossibles ! Retour sur 'investissement' UE exceptionnel.",
              illustration: "💰 500M€ 2021-27 → 🛣️ Routes + 🎓 Formation + 🌱 Environnement → 🚀 Développement",
              anecdote: "🏆 Champion : La Guyane reçoit plus de fonds européens par habitant que toute autre région française ! Statut RUP très avantageux.",
              casParticulier: "📋 Complexité : Obtenir les fonds UE nécessite des dossiers de 200+ pages. Bureaucratie européenne légendaire !"
            },
            {
              id: "reglements-europeens-adaptation",
              question: "Comment adapter les règlements européens à l'Amazonie ?",
              reponse: "Défi permanent ! Exemples : règles sur pesticides (adaptées aux parasites tropicaux), normes construction (cyclones), réglementation pêche (espèces amazoniennes), RGPD (langues amérindiennes). La CTG peut demander des 'dérogations RUP'. Négociation permanente Cayenne-Bruxelles !",
              illustration: "🐛 Pesticides tropicaux → 🌪️ Normes cyclones → 🐟 Pêche amazonienne → 📱 RGPD créole",
              anecdote: "🦎 Exemple concret : L'UE a dû créer une exception pour autoriser la chasse à l'iguane vert en Guyane (espèce invasive) !",
              casParticulier: "⚖️ Équilibre : Rester dans l'UE tout en préservant nos spécificités. Diplomatie de haute voltige !"
            }
          ]
        },
        cooperation: {
          title: "🤝 Coopération Régionale",
          icon: Users,
          questions: [
            {
              id: "relations-bresil",
              question: "Comment fonctionne la coopération avec le Brésil ?",
              reponse: "Partenariat stratégique ! Pont de l'Oyapock (2011), coopération police/gendarmerie contre orpaillage, échanges universitaires, commerce frontalier, lutte commune contre déforestation. État d'Amapá = partenaire privilégié. 730 km de frontière = enjeux énormes : sécurité, santé, environnement.",
              illustration: "🌉 Pont Oyapock → 👮 Coopération sécurité → 🎓 Université → 🌳 Environnement → 🛒 Commerce",
              anecdote: "🚗 Symbole : Depuis 2017, on peut aller de Paris à São Paulo... en voiture ! Via la Guyane et le pont de l'Oyapock.",
              casParticulier: "💸 Paradoxe : Commerce officiel faible mais contrebande énorme. Économie parallèle frontalière importante."
            },
            {
              id: "relations-suriname",
              question: "Quels liens avec le Suriname ?",
              reponse: "Relations historiques fortes ! Communautés Marrons transfrontalières, coopération fluviale (Maroni), lutte contre orpaillage illégal, échanges culturels, projet de pont Albina-Saint-Laurent. Suriname = ancien partenaire commercial (avant l'euro). Réveil diplomatique récent après des années de froid.",
              illustration: "🚣 Communautés Marrons → 🌊 Fleuve Maroni → ⛏️ Anti-orpaillage → 🌉 Pont futur",
              anecdote: "🎭 Culture : Beaucoup de Guyanais comprennent le sranan tongo (langue du Suriname) grâce aux communautés marronnes !",
              casParticulier: "💰 Monnaie : Le Suriname a abandonné son dollar en 2024. Nouvelles opportunités commerciales pour l'euro guyanais ?"
            },
            {
              id: "organisations-regionales",
              question: "Dans quelles organisations régionales sommes-nous ?",
              reponse: "Statut complexe ! Membres : Association des États de la Caraïbe (AEC), OTCA (Organisation du Traité de Coopération Amazonienne). Observateurs : UNASUR, CELAC. Avantage France/UE : accès privilégié aux discussions sud-américaines. Guyane = pont entre Europe et Amérique latine !",
              illustration: "🏝️ AEC Caraïbes → 🌳 OTCA Amazonie → 👁️ Observateur UNASUR → 🌉 Pont Europe-Amérique",
              anecdote: "🎯 Paradoxe : La Guyane participe aux sommets amazoniens... au nom de la France ! Diplomatie originale.",
              casParticulier: "🗣️ Langues : Nos diplomates doivent maîtriser français, anglais, espagnol, portugais ET créole !"
            },
            {
              id: "plateau-des-guyanes",
              question: "C'est quoi le 'Plateau des Guyanes' ?",
              reponse: "Ensemble géographique et culturel : Guyane française, Guyana, Suriname + nord Brésil/Venezuela. Écosystème amazonien partagé, peuples amérindiens transfrontaliers, défis communs (orpaillage, biodiversité, développement). Projet : coopération renforcée entre ces territoires 'cousins'.",
              illustration: "🗺️ 5 territoires → 🌳 Écosystème partagé → 👥 Peuples transfrontaliers → 🤝 Coopération future",
              anecdote: "🦋 Biodiversité : Le Plateau des Guyanes abrite + d'espèces que l'Europe entière ! Trésor mondial partagé.",
              casParticulier: "🎯 Vision : Certains rêvent d'une 'Confédération guyanaise' pour peser face aux géants (Brésil, Venezuela)."
            }
          ]
        },
        diplomatie: {
          title: "🏛️ Diplomatie & Représentation",
          icon: Building,
          questions: [
            {
              id: "consulats-guyane",
              question: "Quels consulats avons-nous en Guyane ?",
              reponse: "Brésil (Cayenne et Saint-Georges), Suriname (Cayenne), Guyana (Cayenne), plus quelques consulats honoraires. Fonction : visas, assistance ressortissants, commerce, coopération. Important pour nos 30% d'étrangers ! Cayenne = petit hub diplomatique régional.",
              illustration: "🇧🇷 Brésil + 🇸🇷 Suriname + 🇬🇾 Guyana → 📋 Visas + 🤝 Commerce + 🆘 Assistance",
              anecdote: "🎭 Originalité : Le consul du Brésil à Saint-Georges gère la frontière la plus fréquentée d'Amazonie ! Poste stratégique.",
              casParticulier: "💼 Business : Ces consulats facilitent énormément le commerce et les investissements transfrontaliers."
            },
            {
              id: "representation-internationale",
              question: "Comment la Guyane est-elle représentée à l'international ?",
              reponse: "Via la France principalement, mais aussi directement ! CTG a des bureaux à Bruxelles, missions économiques au Brésil, participation aux forums amazoniens. Nos élus voyagent régulièrement : Serville à l'ONU, missions CTG en Europe. Diplomatie multi-niveaux originale !",
              illustration: "🇫🇷 Via France + 🇪🇺 Bureau Bruxelles + 🌍 Missions directes → 🎯 Influence internationale",
              anecdote: "🌟 Prestige : Gabriel Serville a prononcé un discours à l'ONU sur les peuples autochtones ! La Guyane sur la scène mondiale.",
              casParticulier: "⚖️ Équilibre : Représentation française ET spécificités guyanaises. Diplomatie à géométrie variable."
            },
            {
              id: "soft-power-guyane",
              question: "Quel 'soft power' a la Guyane ?",
              reponse: "Atouts uniques ! Centre Spatial (image high-tech), Amazonie préservée (écologie), diversité culturelle exceptionnelle, position géostratégique, expertise tropicale. Attractions : tournages internationaux, recherche scientifique, écotourisme premium. La Guyane fascine et inspire !",
              illustration: "🚀 Spatial + 🌳 Amazonie + 🎭 Diversité culturelle + 🌍 Position stratégique = ✨ Fascination mondiale",
              anecdote: "📺 Hollywood : Des documentaires Netflix sur l'Amazonie sont tournés en Guyane ! Rayonnement médiatique mondial.",
              casParticulier: "🎯 Expertise : Nos spécialistes (tropiques, spatial, biodiversité) sont consultés dans le monde entier."
            },
            {
              id: "enjeux-geopolitiques",
              question: "Quels enjeux géopolitiques pour la Guyane ?",
              reponse: "Position stratégique cruciale ! Porte d'entrée UE en Amérique du Sud, surveillance Amazonie, base spatiale européenne, frontière avec géants émergents, ressources naturelles (or, bois, biodiversité), enjeux migratoires. Petit territoire, grands enjeux géopolitiques !",
              illustration: "🚪 Porte UE → 👁️ Surveillance Amazonie → 🚀 Base spatiale → 💎 Ressources → 🌊 Migrations",
              anecdote: "🛰️ Stratégique : Ariane 6 décolle de Guyane ! L'indépendance spatiale européenne passe par Kourou.",
              casParticulier: "🎯 Influence : Malgré sa taille, la Guyane pèse dans les équilibres géopolitiques sud-américains."
            }
          ]
        },
        avenir: {
          title: "🚀 Défis & Perspectives",
          icon: TrendingUp,
          questions: [
            {
              id: "changement-climatique-cooperation",
              question: "Comment coopérer face au changement climatique ?",
              reponse: "Enjeu planétaire ! Initiatives : Pacte amazonien avec Brésil/Suriname, surveillance satellite partagée, recherche commune sur biodiversité, corridors écologiques transfrontaliers, lutte coordonnée contre orpaillage. La Guyane = laboratoire de coopération climatique !",
              illustration: "🌳 Pacte amazonien → 🛰️ Surveillance satellite → 🔬 Recherche commune → 🚫 Anti-orpaillage",
              anecdote: "📡 Innovation : Satellites européens + brésiliens surveillent ensemble la déforestation ! Coopération spatiale concrète.",
              casParticulier: "🌍 Responsabilité : Avec 96% de forêt, la Guyane porte une responsabilité climatique mondiale énorme."
            },
            {
              id: "integration-regionale-futur",
              question: "Vers plus d'intégration régionale ?",
              reponse: "Tendance forte ! Projets : libre circulation Plateau des Guyanes, université transfrontalière, monnaie commune (?), coopération judiciaire, harmonisation douanière. Objectif 2030 : faire du Plateau des Guyanes un espace intégré tout en gardant nos spécificités.",
              illustration: "🛂 Libre circulation → 🎓 Université commune → 💰 Monnaie ? → ⚖️ Justice → 🎯 Intégration 2030",
              anecdote: "💭 Vision : Certains rêvent d'un 'Schengen guyanais' ! Libre circulation entre Guyane, Suriname, Guyana.",
              casParticulier: "🇪🇺 Modèle : L'UE inspire cette intégration régionale. La Guyane = pont entre deux modèles d'intégration."
            },
            {
              id: "nouvelles-technologies-cooperation",
              question: "Comment les nouvelles technologies transforment la coopération ?",
              reponse: "Révolution numérique ! Fibre optique transfrontalière, télémédecine partagée, e-gouvernement régional, surveillance environnementale 4.0, blockchain pour traçabilité bois/or légal. But : surmonter les distances par la technologie. Guyane = hub numérique amazonien !",
              illustration: "🌐 Fibre transfrontalière → 🏥 Télémédecine → 💻 E-gouvernement → 🔗 Blockchain → 📱 Hub numérique",
              anecdote: "🚀 Ambition : Projet de câble sous-marin Guyane-Brésil pour sécuriser internet ! Infrastructure stratégique.",
              casParticulier: "🎯 Opportunité : Avec Kourou et la fibre, la Guyane peut devenir le 'Silicon Valley' de l'Amazonie !"
            },
            {
              id: "jeunesse-cooperation",
              question: "Comment impliquer la jeunesse dans la coopération régionale ?",
              reponse: "Génération frontière ! Programmes : Erasmus amazonien, stages transfrontaliers, service civique régional, échanges universitaires, jumelages lycées, festivals culturels communs. But : créer une génération 'plateau des Guyanes' qui pense naturellement coopération !",
              illustration: "🎓 Erasmus amazonien → 💼 Stages transfrontaliers → 🤝 Service civique → 🎭 Festivals → 👶 Génération coopération",
              anecdote: "🌟 Succès : Des jeunes Guyanais font leur stage au Brésil, des Brésiliens étudient à l'Université de Guyane ! Mobilité réelle.",
              casParticulier: "🎯 Vision : Dans 20 ans, parler portugais/anglais sera aussi normal pour un jeune Guyanais que parler créole !"
            }
          ]
        }
      }
    },
    justice: {
      title: "⚖️ Justice & Sécurité",
      icon: Shield,
      color: "#DC2626",
      description: "Comprendre la justice et la sécurité en Guyane : tribunaux, forces de l'ordre, défis amazoniens et spécificités ultramarines",
      subSections: {
        tribunaux: {
          title: "🏛️ Organisation Judiciaire",
          icon: Scale,
          questions: [
            {
              id: "tribunaux-guyane-organisation",
              question: "Comment s'organise la justice en Guyane ?",
              reponse: "1 Tribunal judiciaire (Cayenne), 2 tribunaux de proximité (Saint-Laurent, Kourou), 1 Cour d'appel (Cayenne pour toute la Guyane), tribunaux spécialisés (commerce, prud'hommes). Particularité : distances énormes obligent parfois audiences par visioconférence depuis villages isolés !",
              illustration: "🏛️ TJ Cayenne + 📍 2 proximité + ⚖️ Cour d'appel + 💻 Visioconférence villages",
              anecdote: "📱 Innovation : Premier territoire français à généraliser les audiences par visio pour les villages isolés ! Révolution judiciaire.",
              casParticulier: "🚁 Extrême : Parfois, le juge se déplace en hélicoptère pour les affaires graves dans l'intérieur. Justice itinérante !"
            },
            {
              id: "personnel-judiciaire",
              question: "Qui sont les acteurs de la justice en Guyane ?",
              reponse: "Procureur de la République (Cayenne), ~15 magistrats, ~30 greffiers, avocats (~40 au barreau), huissiers, notaires. Défi : turnover énorme ! Magistrats métropolitains restent souvent 3-4 ans puis repartent. Difficile de fidéliser les professionnels du droit.",
              illustration: "👨‍⚖️ 15 magistrats + 👩‍💼 30 greffiers + 🎓 40 avocats → 🔄 Turnover élevé",
              anecdote: "💼 Réalité : Certains magistrats découvrent l'orpaillage illégal en arrivant en Guyane ! Formation accélérée aux spécificités locales.",
              casParticulier: "🌴 Incitation : Prime d'éloignement +40% pour attirer les magistrats. Coût élevé mais nécessaire !"
            },
            {
              id: "droit-coutumier",
              question: "Le droit coutumier existe-t-il en Guyane ?",
              reponse: "Statut complexe ! Officiellement, seul le droit français s'applique. MAIS reconnaissance progressive des pratiques amérindiennes : droit de chasse traditionnel, gestion foncière communautaire, résolution conflicts par anciens. Débat : faut-il un vrai statut du droit coutumier comme en Nouvelle-Calédonie ?",
              illustration: "⚖️ Droit français officiel + 🪶 Pratiques amérindiennes + 🤔 Reconnaissance progressive",
              anecdote: "🏹 Exemple : Un Amérindien jugé pour chasse 'illégale' d'un tapir... pratique millénaire de sa communauté ! Conflit de droits.",
              casParticulier: "🌿 Évolution : La justice française apprend à composer avec les traditions amérindiennes. Adaptation progressive."
            },
            {
              id: "delais-justice",
              question: "La justice est-elle plus lente en Guyane ?",
              reponse: "Paradoxalement non ! Délais souvent plus courts qu'en métropole car moins d'affaires par magistrat. MAIS problèmes spécifiques : témoins dispersés géographiquement, expertises techniques (orpaillage) prennent du temps, appels compliqués par distances. Justice différente mais pas forcément plus lente.",
              illustration: "⚡ Moins d'affaires → ⏰ Délais courts → 🗺️ Mais géographie complique → ⚖️ Justice différente",
              anecdote: "🎯 Efficacité : Certaines affaires sont jugées plus vite à Cayenne qu'à Paris ! Avantage de la petite taille.",
              casParticulier: "📊 Statistique : Délai moyen civil : 8 mois (vs 13 en métropole). Pénal : équivalent à la métropole."
            }
          ]
        },
        securite: {
          title: "🛡️ Forces de Sécurité",
          icon: Shield,
          questions: [
            {
              id: "forces-ordre-guyane",
              question: "Quelles forces de l'ordre en Guyane ?",
              reponse: "Police nationale (villes), Gendarmerie (campagne + frontières), Police municipale (certaines communes), Douanes, GIGN/BRI pour interventions spéciales, Forces armées (3ème REI, Marine), PAF (frontières aériennes). Coordination complexe sur territoire immense !",
              illustration: "👮 Police villes + 🪖 Gendarmerie campagne + 🛂 Douanes + ⚡ GIGN + 🎖️ Armée",
              anecdote: "🪖 Prestige : Le 3ème REI (Légion étrangère) de Kourou intervient contre l'orpaillage ! Légionnaires vs orpailleurs.",
              casParticulier: "🌊 Marine : Vedettes de la Marine nationale patrouillent sur les fleuves ! Mission unique en métropole."
            },
            {
              id: "defis-securite-specifiques",
              question: "Quels défis sécuritaires spécifiques à la Guyane ?",
              reponse: "Orpaillage illégal (+10 000 clandestins dans la forêt !), immigration clandestine massive, trafic de drogue (cocaine vers Europe), braconnage, déforestation, contrebande frontalière, insécurité urbaine croissante. Défis amazonieus uniques en France !",
              illustration: "⛏️ Orpaillage + 🛂 Immigration + 💊 Drogue + 🦎 Braconnage + 🌳 Déforestation",
              anecdote: "📊 Ampleur : +10 000 orpailleurs clandestins ! Plus que la population de certaines communes guyanaises.",
              casParticulier: "🚁 Moyens : Opérations anti-orpaillage mobilisent hélicoptères, satellites, forces spéciales. Guerre moderne !"
            },
            {
              id: "cooperation-internationale-securite",
              question: "Comment coopérer avec le Brésil/Suriname sur la sécurité ?",
              reponse: "Accords bilatéraux actifs ! Patrouilles conjointes fleuve Maroni, échange renseignements, extraditions, lutte commune anti-drogue, coopération douanière. MAIS limites : souveraineté, différences juridiques, corruption côté voisins parfois. Coopération imparfaite mais nécessaire.",
              illustration: "🚣 Patrouilles conjointes + 🕵️ Renseignements + ⚖️ Extraditions + 🚫 Mais limites souveraineté",
              anecdote: "🎯 Succès : Arrestation d'un grand baron de l'orpaillage grâce à coopération franco-brésilienne ! Victoire symbolique.",
              casParticulier: "💸 Corruption : Difficile de coopérer quand certains policiers brésiliens sont achetés par les orpailleurs..."
            },
            {
              id: "police-municipale-pouvoirs",
              question: "Quels pouvoirs ont les polices municipales ?",
              reponse: "Pouvoirs limités mais réels ! Contraventions (stationnement, bruit, propreté), sécurité événements, assistance police nationale, constats accidents mineurs. PAS d'interpellation criminelle. En Guyane : utiles pour libérer police/gendarmerie des tâches courantes. Complémentarité nécessaire.",
              illustration: "🚗 Stationnement + 🔇 Bruit + 🎉 Événements + 🤝 Assistance PN → ❌ Pas criminalité",
              anecdote: "👮‍♀️ Évolution : Cayenne recrute de plus en plus de policiers municipaux. Professionnalisation croissante.",
              casParticulier: "💡 Innovation : Certaines communes testent vidéosurveillance + police municipale. Sécurité de proximité."
            }
          ]
        },
        defis: {
          title: "⚠️ Défis Spécifiques",
          icon: AlertCircle,
          questions: [
            {
              id: "orpaillage-illegal-ampleur",
              question: "Quelle est l'ampleur réelle de l'orpaillage illégal ?",
              reponse: "Fléau majeur ! ~10 000 orpailleurs clandestins, 500+ sites illégaux, 10-15 tonnes d'or illégal/an (vs 2 tonnes légales), pollution mercure massive, déforestation 1500 hectares/an. Économie parallèle de 200-300M€ ! Plus gros que certains secteurs économiques légaux.",
              illustration: "👥 10k clandestins + 📍 500+ sites + ⚱️ 15t or illégal + 💀 Pollution mercure + 💰 300M€",
              anecdote: "💰 Comparaison : L'or illégal rapporte plus que le spatial légal ! Paradoxe économique guyanais troublant.",
              casParticulier: "🌍 International : Or guyanais illégal se retrouve dans bijouteries européennes ! Circuit mondial complexe."
            },
            {
              id: "immigration-clandestine-gestion",
              question: "Comment gérer l'immigration clandestine massive ?",
              reponse: "Défi humanitaire et sécuritaire ! ~60 000 étrangers en situation irrégulière (20% population !), flux constant Brésil/Haïti/Suriname, centres de rétention saturés, expulsions difficiles, intégration complexe. Solutions : régularisation partielle + contrôles renforcés + coopération régionale.",
              illustration: "👥 60k irréguliers + 🌊 Flux constant + 🏢 Centres saturés + 🤝 Solutions mixtes",
              anecdote: "📊 Proportion : 1 habitant sur 5 en situation irrégulière ! Proportion unique en France.",
              casParticulier: "🏥 Dilemme : Soigner les clandestins (humanité) ou les expulser (légalité) ? Équation impossible."
            },
            {
              id: "trafic-drogue-route",
              question: "La Guyane est-elle une route de la drogue ?",
              reponse: "Malheureusement OUI ! Position stratégique : cocaïne colombienne → Guyane → Europe via Cayenne ou containers. Saisies record : 1-2 tonnes/an. Méthodes : go-fast maritimes, containers, 'mules' aéroport. Lutte : douanes renforcées, coopération internationale, renseignement.",
              illustration: "🇨🇴 Colombie → 🌴 Guyane → 🇪🇺 Europe | 📦 Containers + 🛥️ Go-fast + ✈️ Mules",
              anecdote: "🎯 Record : 1,4 tonnes cocaïne saisies en 2023 ! Plus gros coup de l'histoire guyanaise.",
              casParticulier: "💸 Corruption : Trafiquants tentent de corrompre agents. Intégrité cruciale pour efficacité."
            },
            {
              id: "cybercriminalite-guyane",
              question: "La cybercriminalité existe-t-elle en Guyane ?",
              reponse: "Émergence rapide ! Arnaques en ligne, fraude bancaire, chantage webcam, trafic cryptomonnaies, piratage réseaux sociaux. Particularité : fraudeurs exploitent naïveté numérique + géolocalisation (fausses annonces immobilières). Gendarmerie forme des cyber-enquêteurs spécialisés.",
              illustration: "💻 Arnaques en ligne + 💳 Fraude bancaire + 📱 Chantage webcam + 🕵️ Cyber-enquêteurs",
              anecdote: "📱 Piège : Fausses annonces immobilier Cayenne piègent étudiants métropolitains ! Escroquerie moderne.",
              casParticulier: "🎓 Formation : Gendarmerie organise conférences lycées sur cybersécurité. Prévention indispensable."
            }
          ]
        },
        prevention: {
          title: "🛡️ Prévention & Proximité",
          icon: Heart,
          questions: [
            {
              id: "prevention-jeunesse",
              question: "Comment prévenir la délinquance des jeunes ?",
              reponse: "Enjeu crucial avec 50% de -25 ans ! Actions : maisons de quartier, sport en clubs, service civique, jobs d'été, médiateurs de rue, conseil départemental prévention, partenariat éducation nationale. But : offrir alternatives à l'économie souterraine attractive (orpaillage, drogue).",
              illustration: "🏠 Maisons quartier + ⚽ Sport + 💼 Jobs été + 👥 Médiateurs + 🚫 Alternatives économie souterraine",
              anecdote: "🥊 Succès : Clubs de boxe à Cayenne détournent jeunes de la délinquance ! Sport comme exutoire.",
              casParticulier: "💰 Concurrence : Difficile de lutter contre l'attrait financier de l'orpaillage illégal (3000€/mois) !"
            },
            {
              id: "mediation-sociale",
              question: "La médiation sociale fonctionne-t-elle en Guyane ?",
              reponse: "Outils prometteurs ! Médiateurs interculturels, justice restaurative, conseils de quartier, médiation familiale, résolution conflits par anciens. Avantage : tissus social fort, respect autorités traditionnelles. Inconvénient : justice parfois trop clémente pour délits graves.",
              illustration: "🤝 Médiateurs interculturels + ⚖️ Justice restaurative + 👴 Anciens respectés + 🏘️ Quartiers solidaires",
              anecdote: "👴 Sagesse : Dans certains villages, le capitaine (chef coutumier) résout plus de conflits que le maire !",
              casParticulier: "🎭 Équilibre : Concilier justice républicaine ET traditions communautaires. Défi permanent."
            },
            {
              id: "police-proximite",
              question: "Comment développer la police de proximité ?",
              reponse: "Stratégie gagnante ! Îlotage renforcé, policiers référents quartiers, permanences décentralisées, patrouilles pédestres, participation événements locaux, partenariat associations. But : récréer lien confiance police-population, cassé par tensions récentes (manifestations, contrôles).",
              illustration: "👮 Îlotage + 🚶 Patrouilles pied + 🏢 Permanences + 🎉 Événements + 🤝 Confiance restaurée",
              anecdote: "🏀 Innovation : Policiers organisent tournois basket avec jeunes ! Relation apaisée par le sport.",
              casParticulier: "📈 Résultats : Quartiers avec police proximité voient baisse délinquance -20%. Efficacité prouvée."
            },
            {
              id: "citoyens-securite",
              question: "Les citoyens peuvent-ils participer à la sécurité ?",
              reponse: "Participation encouragée ! Conseils locaux sécurité prévention (CLSPD), voisins vigilants, réserve civile gendarmerie, correspondants sécurité, signalements via applis. ATTENTION : pas de justice privée ! Coopération OUI, vigilantisme NON. Citoyenneté responsable.",
              illustration: "👥 CLSPD + 👀 Voisins vigilants + 📱 Applis signalement + ⚠️ Pas vigilantisme + 🤝 Coopération",
              anecdote: "📱 Tech : Application 'Signal Guyane' permet signaler incidents en temps réel ! Modernité sécuritaire.",
              casParticulier: "⚖️ Limite : Éviter dérives 'milices' comme aux Antilles. Encadrement légal strict nécessaire."
            }
          ]
        }
      }
    },
    prefets: {
      title: "🏛️ Préfets & État",
      icon: Crown,
      color: "#7C3AED",
      description: "Comprendre le rôle des préfets en Guyane : représentants de l'État, pouvoirs régaliens, coordination territoriale et spécificités ultramarines",
      subSections: {
        organisation: {
          title: "👑 Organisation Préfectorale",
          icon: Building,
          questions: [
            {
              id: "prefet-guyane-role",
              question: "Quel est le rôle du préfet de Guyane ?",
              reponse: "Représentant direct du Premier ministre et des ministres ! Missions : maintien ordre public, coordination services État, contrôle légalité collectivités, sécurité civile, immigration, économie. Pouvoir ÉNORME : peut réquisitionner, interdire manifestations, coordonner forces sécurité. Vrai 'gouverneur' de la Guyane !",
              illustration: "👑 Représentant État + ⚖️ Ordre public + 🏛️ Contrôle légalité + 🚨 Sécurité civile + 💼 Coordination",
              anecdote: "💪 Pouvoir : Le préfet peut mobiliser l'armée (3ème REI) contre l'orpaillage ! Seul en France à avoir cette prérogative régulière.",
              casParticulier: "🌴 Spécificité : Préfet de Guyane cumule prérogatives sécuritaires uniques (frontières, orpaillage, immigration massive)."
            },
            {
              id: "sous-prefets-guyane",
              question: "Y a-t-il des sous-préfets en Guyane ?",
              reponse: "OUI ! 2 sous-préfets : Saint-Laurent-du-Maroni (ouest) et Kourou (centre). Rôles : proximité territoriale, coordination locale, gestion crises, liaison préfet-terrain. Essentiel vu les distances ! Saint-Laurent gère frontière surinamaise, Kourou supervise spatial + sécurité centre spatial.",
              illustration: "📍 Saint-Laurent (ouest) + 🚀 Kourou (centre) + 🗺️ Proximité territoriale + 🤝 Liaison préfet-terrain",
              anecdote: "🚀 Privilège : Sous-préfet de Kourou assiste aux lancements Ariane ! Seul sous-préfet de France dans l'espace !",
              casParticulier: "🛂 Frontière : Sous-préfet Saint-Laurent gère quotidiennement avec Suriname. Diplomatie de terrain permanente."
            },
            {
              id: "services-deconcentres",
              question: "Quels services de l'État en Guyane ?",
              reponse: "Tous les ministères représentés ! DEAL (environnement), ARS (santé), Rectorat (éducation), DREETS (travail), DRIEA (équipement), DGTM (mer), Douanes, Impôts, etc. Particularité : services surdimensionnés vs population car défis amazonieus. Coordination préfectorale cruciale !",
              illustration: "🏢 DEAL + 🏥 ARS + 🎓 Rectorat + 💼 DREETS + 🚢 DGTM + 💰 Impôts → 🎯 Coordination préfet",
              anecdote: "📊 Ratio : Plus de fonctionnaires d'État par habitant qu'en métropole ! Nécessité amazonienne.",
              casParticulier: "🌊 DGTM : Direction Générale Territoires Mer gère 70% du territoire (domaine maritime) ! Service clé."
            },
            {
              id: "cabinet-prefet",
              question: "Comment fonctionne le cabinet du préfet ?",
              reponse: "Équipe rapprochée : directeur cabinet, chargés mission, attachés presse, conseillers sécurité/économie. Rôles : préparation décisions, liaison politique, gestion crises, communication. Particularité : profils mixtes métropole/Guyane, forte rotation (2-3 ans), expertise amazonienne nécessaire.",
              illustration: "👔 Directeur cabinet + 📋 Chargés mission + 📺 Attaché presse + 🛡️ Conseiller sécurité + 🔄 Rotation",
              anecdote: "🎯 Expertise : Conseillers préfet doivent apprendre orpaillage, droit coutumier, géopolitique amazonienne ! Formation unique.",
              casParticulier: "📞 Crise : Cabinet en alerte 24h/24 (cyclones, émeutes, incidents frontaliers). Réactivité vitale."
            }
          ]
        },
        pouvoirs: {
          title: "⚡ Pouvoirs Régaliens",
          icon: Zap,
          questions: [
            {
              id: "pouvoir-police-administrative",
              question: "Quels pouvoirs de police du préfet ?",
              reponse: "Pouvoirs MAJEURS ! Maintien ordre public, interdiction manifestations dangereuses, réquisition biens/personnes, couvre-feu, fermeture établissements, expulsion étrangers, contrôle associations. En Guyane : anti-orpaillage, gestion immigration, coordination antiterroriste. Seul face au gouvernement !",
              illustration: "🚫 Interdictions + 📋 Réquisitions + 🌙 Couvre-feu + 🛂 Expulsions + ⛏️ Anti-orpaillage",
              anecdote: "⚡ Dernière fois : Préfet a interdit manifestations 2017 pendant émeutes. Décision cruciale pour retour au calme.",
              casParticulier: "🚁 Orpaillage : Peut ordonner destructions sites illégaux par l'armée. Pouvoir unique en France !"
            },
            {
              id: "controle-legalite",
              question: "Comment le préfet contrôle-t-il les collectivités ?",
              reponse: "Contrôle de légalité systématique ! Examine TOUS les actes (délibérations, arrêtés, marchés, budgets) des communes, CTG, EPCI. Peut déférer au tribunal administratif, suspendre exécution, mise sous tutelle si dysfonctionnement grave. Dialogue permanent avec élus mais fermeté sur légalité.",
              illustration: "📄 Examen actes + ⚖️ Déféré tribunal + ⏸️ Suspension + 👥 Dialogue élus + 🎯 Fermeté légalité",
              anecdote: "📊 Volume : +3000 actes contrôlés par an ! Travail titanesque des services préfectoraux.",
              casParticulier: "💰 Budgets : Contrôle renforcé budgets communaux (risques financiers). Plusieurs communes sous surveillance."
            },
            {
              id: "coordination-securite",
              question: "Comment le préfet coordonne-t-il la sécurité ?",
              reponse: "Chef d'orchestre sécuritaire ! Préside conseil défense/sécurité, coordonne police/gendarmerie/douanes/armée, décide opérations anti-orpaillage, gère crises (cyclones, émeutes), coopération internationale sécuritaire. Autorité unique sur toutes les forces ! Responsabilité écrasante.",
              illustration: "🎼 Chef orchestre + 👮 Police/Gendarmerie + 🪖 Armée + ⛏️ Anti-orpaillage + 🌊 Gestion crises",
              anecdote: "🎯 Coordination : Seul préfet français à coordonner régulièrement armée, police ET coopération internationale !",
              casParticulier: "🚁 Opérations : Décide déploiement hélicoptères militaires contre orpaillage. Guerre moderne coordonnée."
            },
            {
              id: "immigration-prefet",
              question: "Quel rôle du préfet dans l'immigration ?",
              reponse: "Rôle CENTRAL ! Délivre/refuse titres de séjour, organise expulsions, gère centres rétention, coordonne avec consulats, décide régularisations exceptionnelles, lutte immigration irrégulière. En Guyane : 60 000 irréguliers, 5000 dossiers/an, saturation totale. Mission impossible ?",
              illustration: "📋 Titres séjour + ✈️ Expulsions + 🏢 Centres rétention + 🤝 Consulats + 📊 60k irréguliers",
              anecdote: "📈 Ampleur : Préfet gère plus de dossiers immigration que certains préfets métropolitains ! Défi humain énorme.",
              casParticulier: "⚖️ Dilemme : Humanité vs fermeté. Décisions déchirantes sur familles, enfants scolarisés, malades..."
            }
          ]
        },
        defis: {
          title: "🎯 Défis Spécifiques",
          icon: Target,
          questions: [
            {
              id: "gestion-territoire-immense",
              question: "Comment gérer un territoire si vaste ?",
              reponse: "Défi logistique ÉNORME ! 84 000 km2 (15% métropole), 95% forêt, communes isolées, infrastructures limitées. Solutions : hélicoptères, visioconférence, tournées programmées, délégations locales, technologies satellites. Préfet moderne = gestionnaire + pilote + diplomate !",
              illustration: "🗺️ 84k km2 + 🚁 Hélicoptères + 💻 Visioconférence + 🛰️ Satellites + 👥 Délégations locales",
              anecdote: "🚁 Réalité : Préfet passe +50 jours/an en hélicoptère ! Seul moyen d'atteindre communes isolées.",
              casParticulier: "📡 Innovation : Premier préfet français à utiliser satellites pour surveiller déforestation en temps réel."
            },
            {
              id: "coordination-paris",
              question: "Comment coordonner avec Paris ?",
              reponse: "Liaison permanente mais complexe ! Reporting quotidien ministères, visioconférences gouvernement, déplacements Paris fréquents, adaptation consignes nationales aux réalités locales. Tension : consignes parisiennes vs réalités amazoniennes. Préfet = traducteur entre deux mondes !",
              illustration: "📞 Paris quotidien + 💻 Visioconfs + ✈️ Déplacements + 🔀 Adaptation locale + 🌍 Deux mondes",
              anecdote: "⏰ Décalage : Réunions gouvernement à 6h du matin heure locale ! Contrainte géographique permanente.",
              casParticulier: "🎯 Tension : Expliquer à Paris pourquoi expulser 60k personnes est impossible. Pédagogie constante."
            },
            {
              id: "relations-elus-locaux",
              question: "Quelles relations avec les élus locaux ?",
              reponse: "Équilibre délicat ! Respect autonomie locale vs application loi nationale. Relations variables : coopération (projets, crises) vs tensions (contrôle, immigration). Préfet doit être ferme sur légalité mais diplomate sur méthodes. Jeu permanent entre autorité et négociation.",
              illustration: "⚖️ Autonomie vs Loi + 🤝 Coopération + ⚡ Tensions + 💼 Diplomatie + 🎭 Autorité-négociation",
              anecdote: "🎯 Exemple : Préfet négocie avec maires sur accueil migrants tout en appliquant directives nationales. Équilibrisme !",
              casParticulier: "🗳️ Élections : Relations tendues périodes électorales. Préfet doit rester neutre mais ferme sur régularité."
            },
            {
              id: "communication-publique",
              question: "Comment communiquer avec la population ?",
              reponse: "Communication cruciale mais difficile ! Médias locaux limités, population dispersée, langues multiples, réseaux sociaux. Outils : conférences presse, réunions publiques, réseaux sociaux, partenariat médias, communication crise. Enjeu : expliquer politique nationale en contexte local.",
              illustration: "📺 Médias + 👥 Réunions publiques + 📱 Réseaux sociaux + 🌍 Langues multiples + 📢 Communication crise",
              anecdote: "📱 Modernité : Premier préfet français très actif sur TikTok ! Adaptation générationnelle nécessaire.",
              casParticulier: "🗣️ Multilinguisme : Communiqués traduits créole, portugais, anglais. Réalité multiculturelle."
            }
          ]
        },
        avenir: {
          title: "🚀 Évolutions & Modernisation",
          icon: TrendingUp,
          questions: [
            {
              id: "numerisation-prefecture",
              question: "Comment moderniser la préfecture ?",
              reponse: "Révolution numérique ! Dématérialisation procedures, télé-services, signature électronique, visioconférence généralisée, data-analyse, intelligence artificielle pour traitement dossiers. But : rapprocher État du citoyen malgré distances. Préfecture 4.0 en Amazonie !",
              illustration: "💻 Dématérialisation + 📱 Télé-services + ✍️ Signature électronique + 🤖 IA + 🌐 État connecté",
              anecdote: "🎯 Innovation : Préfecture Guyane teste reconnaissance faciale pour titres séjour ! Pilote national.",
              casParticulier: "📊 Résultats : 80% procedures dématérialisées vs 60% métropole. Nécessité = innovation !"
            },
            {
              id: "cooperation-regionale-prefet",
              question: "Vers plus de coopération régionale ?",
              reponse: "Tendance forte ! Rencontres préfets Outre-mer, coopération Plateau des Guyanes, échanges Caraïbes, participation organisations régionales. Vision : préfet-ambassadeur de France en Amazonie. Diplomatie territoriale croissante, coordination européenne (Guyane = UE en Amérique du Sud) !",
              illustration: "🤝 Préfets Outre-mer + 🗺️ Plateau Guyanes + 🏝️ Caraïbes + 🇪🇺 UE Amazonie + 🌎 Diplomatie territoriale",
              anecdote: "🎖️ Reconnaissance : Préfet Guyane reçu par présidents Suriname/Brésil ! Statut diplomatique de fait.",
              casParticulier: "🇪🇺 Europe : Seul préfet français négociant accords UE-Mercosur ! Dimension géopolitique unique."
            },
            {
              id: "formation-prefets",
              question: "Comment former les préfets à la Guyane ?",
              reponse: "Formation spécialisée indispensable ! Stage obligatoire réalités amazoniennes, formations continues orpaillage/immigration/coopération, échange expériences, partenariat universités, voyage d'étude voisins. Préfet généraliste → préfet amazonien spécialisé. Professionnalisation croissante.",
              illustration: "🎓 Stage amazonien + 📚 Formation continue + 🔄 Échange expériences + 🏛️ Partenariat universités + 🌿 Spécialisation",
              anecdote: "🌱 Apprentissage : Nouveau préfet découvre 15 000 espèces végétales lors stage forêt ! Choc culturel garanti.",
              casParticulier: "🎯 Expertise : Certains préfets deviennent vrais experts Amazonie, consultés par gouvernement sur politiques."
            },
            {
              id: "decentralisation-prefecture",
              question: "Faut-il décentraliser la préfecture ?",
              reponse: "Débat ouvert ! Pour : rapprochement citoyens, efficacité territoriale, réduction coûts déplacement. Contre : perte coordination, affaiblissement autorité État, coûts structures. Compromis : antennes préfectorales permanentes, circuits dématérialisés, préfet mobile. Équilibre centralisation-proximité.",
              illustration: "👥 Rapprochement + 💰 Efficacité vs 🎯 Coordination + 👑 Autorité → 📍 Antennes + 🚁 Préfet mobile",
              anecdote: "🏢 Test : Antenne préfectorale Saint-Georges testée 6 mois. Bilan : succès proximité, coût élevé.",
              casParticulier: "⚖️ Arbitrage : Gouvernement hésite entre renforcement Cayenne et essaimage territorial. Choix stratégique."
            }
          ]
        }
      }
    },
    statuts: {
      title: "🏛️ Statuts Territoriaux",
      icon: Crown,
      color: "#7C2D12",
      description: "Comprendre les différents statuts territoriaux : département, région, autonomie, indépendance. Quelles options pour la Guyane et quelles conséquences ?",
      subSections: {
        departement: {
          title: "🇫🇷 Statut Départemental Actuel",
          icon: MapPin,
          questions: [
            {
              id: "statut-actuel-guyane",
              question: "Quel est le statut exact de la Guyane aujourd'hui ?",
              reponse: "Département-région d'outre-mer (DROM) depuis 1946 ! Statut unique : département ET région en une seule collectivité (CTG). Intégration totale République française : mêmes lois, droits, devoirs qu'en métropole + adaptations spécifiques. Citoyens français à part entière, UE, euro, etc.",
              illustration: "🇫🇷 DROM + 🏛️ Département-région + ⚖️ Mêmes lois + 🇪🇺 UE + 💰 Euro + 👥 Citoyens français",
              anecdote: "🗓️ Histoire : 1946 = départementalisation sur demande des Guyanais ! Choix volontaire d'intégration française.",
              casParticulier: "🎯 Spécificité : Seul territoire français en Amérique du Sud avec statut départemental complet."
            },
            {
              id: "avantages-departement",
              question: "Quels avantages du statut départemental ?",
              reponse: "Énormes ! Solidarité nationale (RSA, CAF, sécu, retraites), investissements publics massifs, citoyenneté européenne, libre circulation, protection consulaire mondiale, infrastructures financées par l'État, égalité des droits. Budget : ~2 milliards€/an de transferts publics ! Richesse redistributive.",
              illustration: "💰 Solidarité nationale + 🏥 Sécu + 🇪🇺 UE + ✈️ Libre circulation + 🏗️ Investissements + 2Md€/an",
              anecdote: "💡 Comparaison : Guyanais reçoit 10x plus d'aides publiques qu'un Brésilien moyen ! Solidarité française.",
              casParticulier: "📊 Chiffres : 75% budget public vient de métropole. Dépendance financière massive mais richesse garantie."
            },
            {
              id: "contraintes-departement",
              question: "Quelles contraintes du statut départemental ?",
              reponse: "Limitations réelles ! Lois votées à Paris (inadaptées parfois), fiscalité nationale (peu de marges), réglementation rigide, centralisation décisions, difficulté coopération régionale, normes européennes contraignantes. Paradoxe : richesse garantie mais autonomie limitée.",
              illustration: "⚖️ Lois Paris + 💰 Fiscalité nationale + 📋 Règles rigides + 🎯 Centralisation + 🇪🇺 Normes UE",
              anecdote: "🌿 Exemple : Réglementation européenne environnement bloque certains projets guyanais ! Contrainte externe.",
              casParticulier: "🤔 Dilemme : Vouloir plus d'autonomie MAIS garder solidarité financière. Équation complexe."
            },
            {
              id: "adaptations-departementales",
              question: "Quelles adaptations du droit français en Guyane ?",
              reponse: "Adaptations croissantes ! Code forestier spécifique, droit minier adapté, fiscalité allégée (défiscalisation), réglementation environnementale renforcée, coopération régionale autorisée, langues régionales reconnues. Évolution : départementalisation classique → départementalisation différenciée.",
              illustration: "🌳 Code forestier + ⛏️ Droit minier + 💰 Défiscalisation + 🌿 Environnement + 🗣️ Langues + 🔄 Différenciation",
              anecdote: "🎯 Innovation : Guyane laboratoire du 'département adapté' ! Expérimentation pour autres territoires.",
              casParticulier: "📈 Évolution : Autonomie croissante DANS le cadre républicain. Voie médiane originale."
            }
          ]
        },
        autonomie: {
          title: "🏝️ Autonomie Territoriale",
          icon: Home,
          questions: [
            {
              id: "autonomie-definition",
              question: "Qu'est-ce que l'autonomie territoriale ?",
              reponse: "Statut intermédiaire ! Plus de pouvoirs que département (lois propres dans certains domaines) mais moins qu'État souverain. Exemples français : Nouvelle-Calédonie, Polynésie. Pouvoirs autonomes : fiscalité, éducation, culture, environnement. MAIS État garde : défense, diplomatie, justice, monnaie.",
              illustration: "⚖️ Lois propres partielles + 🎓 Éducation + 🎨 Culture + 🌿 Environnement vs 🛡️ Défense + 🌍 Diplomatie État",
              anecdote: "🏝️ Nouvelle-Calédonie : 3 référendums indépendance ! Autonomie = étape vers indépendance possible.",
              casParticulier: "🎯 Nuances : Autonomie = spectre large, de simple décentralisation à quasi-indépendance."
            },
            {
              id: "autonomie-guyane-possible",
              question: "L'autonomie serait-elle possible pour la Guyane ?",
              reponse: "Juridiquement OUI ! Constitution permet autonomie (art. 74). Faudrait : volonté politique locale forte, négociation État, référendum, réforme constitutionnelle. Modèle : adapter Nouvelle-Calédonie à contexte amazonien. Question : les Guyanais veulent-ils plus d'autonomie ? Débat ouvert !",
              illustration: "⚖️ Constitution permet + 🗳️ Volonté locale + 🤝 Négociation + 📊 Référendum + 🏝️ Modèle adapté",
              anecdote: "🤔 Sondages : Opinions partagées autonomie. Pas de consensus clair comme en Nouvelle-Calédonie.",
              casParticulier: "🌍 Géopolitique : Autonomie Guyane = questions sécuritaires (frontières, base spatiale). Enjeu national."
            },
            {
              id: "avantages-autonomie",
              question: "Quels seraient les avantages de l'autonomie ?",
              reponse: "Gains de liberté ! Lois adaptées réalités locales, fiscalité propre (captation richesses), coopération régionale facilitée, identité culturelle renforcée, gestion environnement autonome, développement économique sur mesure. Vision : Guyane maître de son destin tout en restant française.",
              illustration: "⚖️ Lois adaptées + 💰 Fiscalité propre + 🤝 Coopération régionale + 🎭 Culture + 🌿 Environnement + 🎯 Destin",
              anecdote: "🎯 Exemple : Polynésie fixe ses propres règles tourisme ! Autonomie = adaptation aux spécificités.",
              casParticulier: "💰 Or : Autonomie fiscale permettrait capter davantage richesses aurifères pour développement local."
            },
            {
              id: "risques-autonomie",
              question: "Quels risques avec l'autonomie ?",
              reponse: "Dangers réels ! Perte solidarité financière métropole, isolement international, instabilité institutionnelle, risques sécessionnistes, inégalités territoriales, complexité administrative. Question cruciale : autonomie = étape vers indépendance ? Précédent calédonien inquiète.",
              illustration: "💸 Perte solidarité + 🌍 Isolement + ⚡ Instabilité + 🚪 Sécession + 📊 Inégalités + 🤯 Complexité",
              anecdote: "⚠️ Nouvelle-Calédonie : Autonomie → 3 référendums indépendance ! Processus irréversible parfois.",
              casParticulier: "🛡️ Sécurité : Base spatiale, frontières sensibles. État peut-il déléguer souveraineté ?"
            }
          ]
        },
        independance: {
          title: "🌟 Indépendance Nationale",
          icon: Crown,
          questions: [
            {
              id: "independance-definition",
              question: "Qu'est-ce que l'indépendance d'un territoire ?",
              reponse: "Souveraineté complète ! Reconnaissance internationale, gouvernement propre, lois nationales, diplomatie, défense, monnaie, frontières, ONU. État souverain = maître absolu de son territoire et population. Plus de tutelle ! Exemples proches : Suriname (1975), Guyana (1966).",
              illustration: "🌍 Souveraineté + 🏛️ Gouvernement + ⚖️ Lois + 🤝 Diplomatie + 🛡️ Défense + 💰 Monnaie + 🇺🇳 ONU",
              anecdote: "🏝️ Décolonisation : 17 îles Caraïbes indépendantes depuis 1960 ! Mouvement historique régional.",
              casParticulier: "📊 Micro-États : Certains pays indépendants plus petits que Guyane ! Taille ≠ souveraineté."
            },
            {
              id: "independance-guyane-scenario",
              question: "L'indépendance guyanaise est-elle envisageable ?",
              reponse: "Scénario complexe ! Juridiquement possible (droit peuples à autodétermination) mais obstacles énormes : manque de consensus local, opposition France, défis économiques, isolement géopolitique, questions sécuritaires. Actuellement : mouvement indépendantiste très minoritaire (~5% opinions).",
              illustration: "⚖️ Droit autodétermination vs 🚫 Obstacles + 📊 5% opinions + 🤔 Défis multiples",
              anecdote: "📊 Réalité : Sondages montrent attachement France dominant ! Indépendance = option ultra-minoritaire.",
              casParticulier: "🌍 Géopolitique : Indépendance Guyane bouleverserait équilibres Plateau des Guyanes. Enjeu régional."
            },
            {
              id: "avantages-independance",
              question: "Quels seraient les avantages de l'indépendance ?",
              reponse: "Liberté totale ! Souveraineté complète sur ressources (or, forêt, espace), diplomatie autonome, coopération régionale sans contraintes, identité nationale affirmée, justice adaptée, développement économique libre. Vision : Guyane = Singapour de l'Amérique du Sud !",
              illustration: "💰 Ressources propres + 🌍 Diplomatie libre + 🤝 Coopération + 🎭 Identité + ⚖️ Justice + 🚀 Développement",
              anecdote: "💡 Vision : Certains rêvent 'Singapour amazonien' ! Hub technologique et financier régional.",
              casParticulier: "🌿 Atout : 85% forêt préservée = capital écologique mondial unique ! Potentiel énorme."
            },
            {
              id: "defis-independance",
              question: "Quels défis majeurs pour une Guyane indépendante ?",
              reponse: "Défis colossaux ! Économie dépendante (75% budget public = métropole), population réduite (300k hab), frontières ingérables, sécurité précaire, isolation diplomatique, fuite cerveaux, inégalités explosives. Question : viable économiquement ? Comparaison : Suriname en difficulté permanente.",
              illustration: "💸 Dépendance 75% + 👥 300k hab + 🗺️ Frontières + 🛡️ Sécurité + 🌍 Isolation + ✈️ Fuite cerveaux",
              anecdote: "📊 Suriname : Voisin indépendant mais PIB/habitant 3x plus faible qu'en Guyane ! Leçon économique.",
              casParticulier: "⚠️ Sécurité : Guyane indépendante pourrait-elle lutter contre orpaillage illégal ? Capacités limitées."
            }
          ]
        },
        comparaisons: {
          title: "🌎 Comparaisons Régionales",
          icon: Globe,
          questions: [
            {
              id: "plateau-guyanes-statuts",
              question: "Quels statuts dans le Plateau des Guyanes ?",
              reponse: "Diversité unique ! Guyane française (DROM), Suriname (république indépendante 1975), Guyana (république indépendante 1966), Brésil/États Amapá-Roraima (États fédéraux), Venezuela/État Bolívar (État centralisé). 5 pays, 6 systèmes politiques différents sur même espace géographique !",
              illustration: "🇫🇷 DROM + 🇸🇷 République + 🇬🇾 République + 🇧🇷 États fédéraux + 🇻🇪 État central",
              anecdote: "🌍 Unique : Plateau des Guyanes = laboratoire de tous les statuts possibles ! Diversité politique mondiale.",
              casParticulier: "🤝 Coopération : Malgré statuts différents, coopération croissante (OTCA, Plateau des Guyanes)."
            },
            {
              id: "voisins-performances",
              question: "Comment se portent les voisins indépendants ?",
              reponse: "Bilan mitigé ! Suriname : difficultés économiques, inflation, émigration, instabilité politique, PIB/hab 15k$ vs 35k$ Guyane. Guyana : croissance récente (pétrole) mais pauvreté persistante, émigration massive, PIB/hab 8k$. Indépendance ≠ automatiquement prospérité !",
              illustration: "🇸🇷 15k$/hab difficultés + 🇬🇾 8k$/hab pauvreté vs 🇫🇷 35k$/hab Guyane + 📈 Solidarité française",
              anecdote: "📊 Émigration : 50% Guyaniens vivent à l'étranger ! Exode massif malgré indépendance.",
              casParticulier: "⚖️ Leçon : Indépendance seule ne garantit pas développement. Institutions et gouvernance cruciales."
            },
            {
              id: "dom-tom-evolution",
              question: "Comment évoluent les autres DOM-TOM ?",
              reponse: "Trajectoires diverses ! Martinique/Guadeloupe : statut quo départemental, autonomie limitée. Réunion : intégration réussie. Nouvelle-Calédonie : autonomie poussée → 3 référendums indépendance (NON). Polynésie : autonomie renforcée. Chaque territoire trouve sa voie selon histoire et géographie.",
              illustration: "🏝️ Martinique statut quo + 🌺 Réunion intégrée + 🏔️ Calédonie autonome + 🏖️ Polynésie renforcée",
              anecdote: "🗳️ Calédonie : 3 NON à l'indépendance mais autonomie maintenue ! Voie médiane choisie.",
              casParticulier: "🎯 Modèles : Guyane peut s'inspirer expériences autres territoires pour définir son avenir."
            },
            {
              id: "avenir-statut-guyane",
              question: "Quel avenir pour le statut de la Guyane ?",
              reponse: "Évolution probable ! Tendance : autonomie renforcée DANS cadre français (comme Polynésie). Consensus semble émerger : plus de pouvoirs locaux + maintien solidarité nationale. Horizon : 'République autonome de Guyane' au sein République française ? Voie médiane originale à inventer.",
              illustration: "🎯 Autonomie renforcée + 🇫🇷 Cadre français + 🤝 Solidarité + 💡 Voie médiane + 🔮 À inventer",
              anecdote: "🎭 Créativité : Guyane pourrait inventer nouveau modèle territorial ! Innovation institutionnelle française.",
              casParticulier: "⚖️ Équilibre : Concilier identité amazonienne ET citoyenneté française. Défi du XXIe siècle."
            }
          ]
        }
      }
    },
    aides: {
      title: "💰 Aides & Prestations",
      icon: Heart,
      color: "#DC2626",
      description: "Comprendre les aides sociales en Guyane : CAF, Pôle Emploi, santé, logement. Quels droits, quels montants, quelles spécificités ultramarines ?",
      subSections: {
        caf: {
          title: "👨‍👩‍👧‍👦 CAF & Famille",
          icon: Users,
          questions: [
            {
              id: "allocations-familiales-guyane",
              question: "Quels montants des allocations familiales en Guyane ?",
              reponse: "Majorations ultramarines ! Base métropole +11,8% : 2 enfants = 147€/mois (vs 131€ métropole), 3 enfants = 336€/mois, 4 enfants = 525€/mois. Plus complément familial, allocation rentrée scolaire majorée. Solidarité nationale renforcée pour compenser coût de la vie !",
              illustration: "💰 +11,8% métropole + 👶 2 enfants 147€ + 👨‍👩‍👧 3 enfants 336€ + 🎒 Rentrée majorée + 🌴 Coût vie compensé",
              anecdote: "📊 Impact : Famille 4 enfants reçoit 630€/mois allocations ! Plus qu'un SMIC partiel, aide cruciale.",
              casParticulier: "🎯 Spécificité : Seuls DOM-TOM bénéficient majorations automatiques. Avantage ultramarin méconnu !"
            },
            {
              id: "garde-enfants-caf",
              question: "Quelles aides pour la garde d'enfants ?",
              reponse: "Soutien renforcé ! PAJE (Prestation Accueil Jeune Enfant), CMG (Complément Mode Garde), crèches publiques subventionnées, assistantes maternelles agréées. Problème : places limitées ! 3000 places crèches pour 20 000 enfants <3 ans. Solution : développement garde à domicile aidée.",
              illustration: "👶 PAJE + 🏠 CMG domicile + 🏢 Crèches publiques + 👩‍🍼 Assistantes maternelles + ⚠️ Places limitées",
              anecdote: "📈 Besoin : Liste attente crèches = 2 ans ! Démographie explosive vs infrastructures limitées.",
              casParticulier: "🌿 Innovation : Expérimentation garde 'tata créole' aidée par CAF. Adaptation culturelle locale."
            },
            {
              id: "jeunes-caf-soutien",
              question: "Quelles aides CAF pour les jeunes ?",
              reponse: "Accompagnement spécialisé ! Aide au logement étudiants, bourses complémentaires, aide permis conduire, jobs d'été aidés, accompagnement parental. Défi : 50% population <25 ans ! CAF Guyane = service jeunesse quasi-exclusif. Innovation : conseillers jeunes spécialisés délocalisés.",
              illustration: "🏠 Logement étudiant + 🎓 Bourses + 🚗 Permis + 💼 Jobs été + 👥 50% <25 ans + 🎯 Spécialisation jeunesse",
              anecdote: "🎯 Proportion : 1 dossier CAF sur 2 concerne un mineur ! Record français de jeunesse.",
              casParticulier: "📱 Modernité : Application mobile CAF spéciale jeunes avec géolocalisation services. Innovation numérique."
            },
            {
              id: "procedures-caf-guyane",
              question: "Comment fonctionnent les démarches CAF en Guyane ?",
              reponse: "Défis logistiques énormes ! 8 accueils CAF (Cayenne, Kourou, Saint-Laurent + antennes), permanences mobiles communes isolées, dématérialisation poussée, traducteurs créole/portugais/anglais. Problème : 30% population sans Internet ! Solution : médiateurs sociaux de proximité.",
              illustration: "🏢 8 accueils + 🚐 Permanences mobiles + 💻 Dématérialisation + 🗣️ Traducteurs + 👥 Médiateurs proximité",
              anecdote: "🚁 Extrême : Agent CAF se déplace en hélicoptère à Saül ! Service public jusqu'au bout de l'Amazonie.",
              casParticulier: "📊 Multilinguisme : Dossiers traduits en 5 langues. Adaptation à diversité culturelle unique."
            }
          ]
        },
        emploi: {
          title: "💼 Pôle Emploi & Insertion",
          icon: Briefcase,
          questions: [
            {
              id: "chomage-rsa-guyane",
              question: "Quels montants RSA et chômage en Guyane ?",
              reponse: "Montants majorés ! RSA : 634€/mois personne seule (+11,8% vs métropole), 951€ couple, 1267€ couple 2 enfants. Chômage : 75% salaire antérieur. Prime d'activité cumulative possible. MAIS taux chômage 17% (record français) ! Solidarité massive nécessaire.",
              illustration: "💰 RSA 634€ majoré + 👫 951€ couple + 🔄 Prime activité + 📊 17% chômage + 🆘 Solidarité massive",
              anecdote: "📈 Record : Plus de RSA versés qu'en Corse ! Proportion énorme due à jeunesse + chômage.",
              casParticulier: "💡 Cumul : RSA + prime activité + allocations = filet sécurité renforcé. Système solidaire."
            },
            {
              id: "formations-pole-emploi",
              question: "Quelles formations proposées par Pôle Emploi ?",
              reponse: "Formations adaptées ! BTP (déficit 2000 postes), tourisme, spatial (techniciens CSG), numérique, environnement, services à la personne. Spécificités : formation orpaillage légal, guide nature, interprétariat. Problème : inadéquation emploi-formation ! 70% emplois non pourvus faute candidats qualifiés.",
              illustration: "🏗️ BTP + 🚀 Spatial + 💻 Numérique + 🌿 Environnement + ⛏️ Orpaillage légal + ⚠️ 70% postes vacants",
              anecdote: "🚀 Prestige : Formation technicien spatial = Graal local ! Accès CSG = ascenseur social garanti.",
              casParticulier: "🌍 Innovation : Seule formation 'guide international Amazonie' de France ! Spécialité unique."
            },
            {
              id: "contrats-aides-insertion",
              question: "Quels contrats aidés et dispositifs d'insertion ?",
              reponse: "Palette complète ! Contrats PEC (secteur public), CIE (secteur privé), service civique, garantie jeunes, PLIE (accompagnement renforcé), chantiers d'insertion. Spécial Guyane : contrats environnement (débroussaillage, sentiers), médiateurs interculturels. But : ponts vers emploi durable.",
              illustration: "🏛️ PEC public + 🏢 CIE privé + 🎯 Service civique + 🌿 Contrats environnement + 🤝 Médiateurs + 🌉 Ponts emploi",
              anecdote: "🌳 Utile : Contrats débroussaillage créent 500 emplois/an ! Lutte chômage + entretien territoire.",
              casParticulier: "🎭 Médiation : Contrats médiateurs interculturels uniques en France. Réponse diversité guyanaise."
            },
            {
              id: "economie-informelle-defis",
              question: "Comment gérer l'économie informelle massive ?",
              reponse: "Défi majeur ! 40% activité = informelle (vs 8% métropole) : commerce frontalier, services domestiques, artisanat, orpaillage. Stratégie : accompagnement vers formalisation, micro-entreprise simplifiée, régularisation progressive. Équilibre délicat : contrôle vs accompagnement.",
              illustration: "📊 40% informel + 🛂 Commerce frontalier + 🏠 Services domestiques + 💡 Micro-entreprise + ⚖️ Contrôle vs aide",
              anecdote: "🎯 Réalité : Beaucoup vivent RSA + activité informelle ! Système D généralisé pour survivre.",
              casParticulier: "🌿 Spécificité : Économie informelle = survie, pas fraude. Approche sociale plus que répressive."
            }
          ]
        },
        sante: {
          title: "🏥 Santé & Handicap",
          icon: Heart,
          questions: [
            {
              id: "cpam-couverture-guyane",
              question: "Comment fonctionne la CPAM en Guyane ?",
              reponse: "Couverture universelle mais défis énormes ! 280 000 assurés, remboursements identiques métropole, CMU-C généralisée, PUMA pour tous. MAIS déserts médicaux dramatiques : 1 médecin/1000 hab (vs 3/1000 métropole) ! Solution : télémédecine, évacuations sanitaires aidées.",
              illustration: "👥 280k assurés + 💰 Remboursements égaux + 🆘 CMU-C + ⚠️ 1 médecin/1000 + 📱 Télémédecine + 🚁 Évacuations",
              anecdote: "🚁 Record : 200 évacuations sanitaires/an financées par CPAM ! Sauvetages en hélicoptère quotidiens.",
              casParticulier: "📡 Innovation : Premier territoire français 100% télémédecine pour communes isolées !"
            },
            {
              id: "aah-handicap-guyane",
              question: "Quels soutiens pour les personnes handicapées ?",
              reponse: "AAH majorée : 971€/mois (+11,8%), complément ressources, PCH (aide humaine/technique), cartes mobilité, RQTH emploi. MDPH Guyane : évaluations adaptées climat/géographie. Défis : accessibilité bâtiments tropicaux, transports adaptés inexistants, structures spécialisées rares.",
              illustration: "💰 AAH 971€ majorée + 🤝 PCH aide + ♿ Accessibilité + 🚌 Transports + 🏥 Structures rares",
              anecdote: "🌡️ Adaptation : Fauteuils roulants 'tropicaux' remboursés ! Matériel adapté climat humide.",
              casParticulier: "🌿 Innovation : MDPH développe évaluations 'en milieu amazonien'. Première en France !"
            },
            {
              id: "prevention-sante-tropicale",
              question: "Quelles spécificités santé tropicale ?",
              reponse: "Enjeux uniques ! Prévention paludisme, dengue, chikungunya, fièvre jaune, leishmaniose. Vaccinations obligatoires remboursées, moustiquaires distribuées, campagnes démoustication. ARS Guyane = veille épidémiologique 24h/24. Coopération sanitaire Brésil/Suriname contre épidémies transfrontalières.",
              illustration: "🦟 Paludisme + 💉 Vaccins obligatoires + 🛡️ Moustiquaires + 🚨 Veille 24h/24 + 🤝 Coopération transfrontalière",
              anecdote: "🎯 Vigilance : Chaque cas paludisme déclaré en 24h ! Système alerte le plus réactif de France.",
              casParticulier: "🌍 Unique : Seul territoire français avec maladies tropicales endémiques. Expertise médicale spécialisée."
            },
            {
              id: "acces-soins-isolement",
              question: "Comment accéder aux soins dans l'isolement ?",
              reponse: "Solutions innovantes ! Centres de santé délocalisés (15 postes), infirmiers référents villages, téléconsultations généralisées, pharmacies mobiles, évacuations héliportées urgentes. Médecins volontaires service civil, coopération ONG (Médecins du Monde). Solidarité médicale exceptionnelle !",
              illustration: "🏥 15 centres délocalisés + 👩‍⚕️ Infirmiers villages + 💻 Téléconsultations + 🚁 Évacuations + 🌍 ONG solidaires",
              anecdote: "🎖️ Héroïsme : Médecins restent seuls 6 mois en brousse ! Dévouement médical exceptionnel.",
              casParticulier: "📡 Technologie : Consultations par satellite dans villages sans route ! Modernité en Amazonie."
            }
          ]
        },
        logement: {
          title: "🏠 Logement & Solidarité",
          icon: Home,
          questions: [
            {
              id: "apl-logement-social",
              question: "Quelles aides au logement en Guyane ?",
              reponse: "APL majorées ! Montants +11,8% vs métropole, plafonds adaptés coût immobilier, aide accession propriété, prêts bonifiés. Logement social : 25 000 logements, loyers modérés, attributions prioritaires familles nombreuses. MAIS crise logement dramatique ! 15 000 demandes en attente.",
              illustration: "💰 APL majorées +11,8% + 🏘️ 25k logements sociaux + 📋 15k demandes attente + 🆘 Crise dramatique",
              anecdote: "⏰ Attente : 8 ans délai moyen logement social ! Crise la plus grave des DOM-TOM.",
              casParticulier: "🌊 Défis : Construire sur sol amazonien = coûts x3 ! Techniques constructives spéciales requises."
            },
            {
              id: "habitat-insalubre-rhi",
              question: "Comment lutter contre l'habitat insalubre ?",
              reponse: "Programme RHI (Résorption Habitat Insalubre) ! Démolition bidonvilles, relogement familles, construction logements dignes, accompagnement social. 20 000 personnes en habitat précaire ! Opérations Balata, Village Chinois, Cité Bonhomme. Défis : relogement + insertion sociale simultanés.",
              illustration: "🏚️ RHI démolition + 🏘️ Relogement + 👥 20k précaires + 🎯 Balata/Village Chinois + 🤝 Accompagnement social",
              anecdote: "🏗️ Ampleur : Plus de bidonvilles résorbés qu'en métropole ! Opération titanesque d'urbanisme social.",
              casParticulier: "🌿 Défi : Résorber habitat informel sans créer exclusion. Équilibre délicat social/urbanisme."
            },
            {
              id: "dalo-droit-logement",
              question: "Le DALO (Droit Au Logement Opposable) s'applique-t-il ?",
              reponse: "OUI mais saturé ! Commission DALO examine demandes urgentes, relogement prioritaire, recours possible. 2000 dossiers/an, 60% acceptés. MAIS délais énormes : 3-5 ans ! Hébergement d'urgence : 500 places, saturation permanente. DALO = droit théorique vs réalité pratique difficile.",
              illustration: "⚖️ Commission DALO + 📊 2000 dossiers/an + ⏰ 3-5 ans délais + 🏨 500 places urgence + 🤔 Théorie vs pratique",
              anecdote: "📈 Paradoxe : DALO reconnu mais irréalisable ! Droit opposable face à pénurie absolue.",
              casParticulier: "🆘 Urgence : Familles vivent 2 ans en hébergement d'urgence ! Situation humanitaire préoccupante."
            },
            {
              id: "innovation-logement-tropical",
              question: "Quelles innovations logement tropical ?",
              reponse: "Architecture adaptée ! Maisons sur pilotis (inondations), toitures végétalisées, ventilation naturelle, matériaux locaux (bois tropical), construction parasismique, récupération eaux pluviales. Expérimentations éco-quartiers, habitat participatif, containers aménagés. Guyane = laboratoire habitat équatorial !",
              illustration: "🏘️ Pilotis + 🌿 Toits végétaux + 🌬️ Ventilation naturelle + 🌳 Matériaux locaux + 🏗️ Parasismique + 💧 Récupération eau",
              anecdote: "🌿 Innovation : Premier éco-quartier tropical d'Amérique du Sud ! Vitrine française internationale.",
              casParticulier: "🔬 Recherche : CNRS étudie habitat tropical durable en Guyane. Expertise scientifique unique."
            }
          ]
        }
      }
    },
    foncier: {
      title: "🗺️ Foncier & Terrains",
      icon: MapPin,
      color: "#92400E",
      description: "Comprendre le foncier en Guyane : propriété des terres, droits coutumiers, domaine public, prix immobilier et spécificités amazoniennes de la gestion territoriale",
      subSections: {
        propriete: {
          title: "🏠 Propriété des Terres",
          icon: Home,
          questions: [
            {
              id: "repartition-fonciere-guyane",
              question: "À qui appartiennent les terres en Guyane ?",
              reponse: "Répartition unique ! 95% territoire = domaine public (État français), 3% propriété privée, 2% collectivités. Sur 84 000 km2, seulement 2500 km2 privés ! Paradoxe : immense territoire mais très peu de terres cessibles. État = propriétaire quasi-exclusif de l'Amazonie française !",
              illustration: "🇫🇷 95% État + 🏠 3% privé + 🏛️ 2% collectivités = 🌿 84k km2 territoire vs 📏 2,5k km2 cessibles",
              anecdote: "🎯 Proportion : Plus de domaine public qu'au Vatican ! État français = géant foncier amazonien.",
              casParticulier: "🌍 Comparaison : Guyane = 1/8ème métropole en surface mais 20x plus de domaine public !"
            },
            {
              id: "domaine-public-gestion",
              question: "Comment est géré le domaine public ?",
              reponse: "Gestion complexe ! ONF (forêts), Conservatoire littoral (côtes), Parc National (cœur), réserves naturelles, concessions minières, baux emphytéotiques, cessions foncières. Préfet = décideur final. Enjeu : équilibre protection environnement vs développement économique.",
              illustration: "🌳 ONF forêts + 🌊 Conservatoire côtes + 🏞️ Parc National + ⛏️ Concessions + 👑 Préfet décideur",
              anecdote: "🌿 Ampleur : ONF Guyane gère 8M hectares ! Plus grand domaine forestier français, plus que certains pays !",
              casParticulier: "⚖️ Tension : Chaque m2 cédé = débat écologie vs développement. Arbitrages politiques permanents."
            },
            {
              id: "droits-coutumiers-foncier",
              question: "Les droits coutumiers existent-ils sur les terres ?",
              reponse: "Statut ambigu ! Officiellement, seule propriété française reconnue. MAIS usage coutumier toléré : chasse traditionnelle, abatis familiaux, sites sacrés amérindiens, cimetières ancestraux. Débat : faut-il reconnaître propriété collective indigène ? Tension droit français vs droits ancestraux.",
              illustration: "⚖️ Propriété française seule vs 🪶 Usage coutumier + 🏹 Chasse + 🌾 Abatis + ⛪ Sites sacrés + 🤔 Tension droits",
              anecdote: "🏹 Exemple : Famille amérindienne occupe site depuis 300 ans mais sans titre de propriété ! Problème juridique.",
              casParticulier: "📜 Évolution : Réflexion sur 'concessions d'usage coutumier' comme en Nouvelle-Calédonie."
            },
            {
              id: "acces-propriete-prive",
              question: "Comment accéder à la propriété privée ?",
              reponse: "Parcours complexe ! Demande préfecture, enquête publique, avis CDPENAF, cession domaine public, géomètre, notaire, conservation hypothèques. Délais : 2-5 ans ! Prix : 50-200€/m2 terrain nu (vs 20-50€ métropole rurale). Rareté = cherté malgré abondance apparente.",
              illustration: "📋 Demande préfecture + ⏰ 2-5 ans + 💰 50-200€/m2 + 📐 Géomètre + 📝 Notaire + 💎 Rareté = cherté",
              anecdote: "💰 Paradoxe : Terrain plus cher qu'en métropole alors que 95% territoire = public ! Rareté artificielle.",
              casParticulier: "🎯 Stratégie : Collectivités rachètent domaine public pour créer réserves foncières. Anticipation nécessaire."
            }
          ]
        },
        urbanisme: {
          title: "🏗️ Urbanisme & Aménagement",
          icon: Building,
          questions: [
            {
              id: "documents-urbanisme",
              question: "Quels documents d'urbanisme en Guyane ?",
              reponse: "Palette complète ! PLU (Plans Locaux Urbanisme) grandes communes, cartes communales villages, SAR (Schéma Aménagement Régional), SCOT littoral. Spécificités : zones humides, risques inondation, protection forêt. Défi : urbaniser sans détruire ! Équilibre développement-environnement.",
              illustration: "📋 PLU communes + 🗺️ Cartes communales + 📊 SAR régional + 🌊 SCOT littoral + 🌿 Protection environnement",
              anecdote: "🌳 Contrainte : Certains PLU interdisent construction sur 80% territoire communal ! Protection drastique.",
              casParticulier: "🦋 Biodiversité : Études impact obligatoires dès 500m2 ! Protection espèces endémiques unique."
            },
            {
              id: "permis-construire-specificites",
              question: "Quelles spécificités permis de construire ?",
              reponse: "Règles tropicales ! Architecture bioclimatique obligatoire, résistance cyclonique, évacuation eaux pluviales, matériaux adaptés, distance cours d'eau, protection faune/flore. Délais : 3-6 mois (études environnementales). Coût construction : x2 vs métropole ! Climat = contrainte technique majeure.",
              illustration: "🌡️ Bioclimatique + 🌪️ Anti-cyclone + 💧 Évacuation eaux + 🌿 Protection faune + ⏰ 3-6 mois + 💰 Coût x2",
              anecdote: "🦎 Blocage : Permis refusé pour protection iguane vert ! Biodiversité prime sur construction.",
              casParticulier: "🏗️ Innovation : Techniques constructives tropicales uniques en France. Expertise spécialisée requise."
            },
            {
              id: "lotissements-amenagement",
              question: "Comment se créent les lotissements ?",
              reponse: "Procédure lourde ! Étude faisabilité, acquisition foncier, viabilisation (eau, électricité, assainissement), voirie, espaces verts, équipements publics. Coût : 100-300€/m2 viabilisé ! Défi : assainissement en zone humide, accès transport, desserte numérique.",
              illustration: "📊 Étude + 🏠 Acquisition + 💡 Viabilisation + 🛣️ Voirie + 🌳 Espaces verts + 💰 100-300€/m2 viabilisé",
              anecdote: "🌊 Défi : Certains lotissements construits sur pilotis ! Adaptation zone inondable obligatoire.",
              casParticulier: "📡 Innovation : Lotissements avec fibre optique obligatoire. Lutte fracture numérique intégrée."
            },
            {
              id: "habitat-spontane-regularisation",
              question: "Comment régulariser l'habitat spontané ?",
              reponse: "Enjeu majeur ! 30% constructions = irrégulières. Procédures : régularisation a posteriori, mise aux normes, raccordements, titularisation foncière. Programmes : OPAH (réhabilitation), RHI (résorption insalubre), accompagnement social. Équilibre : légalité vs réalité sociale.",
              illustration: "📊 30% irrégulier + 📝 Régularisation + 🔧 Mise aux normes + 🏗️ OPAH/RHI + ⚖️ Légalité vs réalité",
              anecdote: "🏘️ Ampleur : Plus d'habitat spontané qu'en métropole ! Phénomène démographique explosif.",
              casParticulier: "🤝 Accompagnement : Médiateurs fonciers spécialisés. Innovation sociale française unique."
            }
          ]
        },
        marche: {
          title: "💰 Marché Immobilier",
          icon: TrendingUp,
          questions: [
            {
              id: "prix-immobilier-guyane",
              question: "Quels sont les prix de l'immobilier ?",
              reponse: "Marché segmenté ! Cayenne centre : 2500-3500€/m2, périphérie : 1500-2500€/m2, Kourou : 2000-3000€/m2, Saint-Laurent : 1200-2000€/m2. Terrains : 50-200€/m2. Location : 8-15€/m2/mois. Plus cher que métropole malgré revenus plus faibles ! Paradoxe économique.",
              illustration: "🏢 Cayenne 2500-3500€/m2 + 🚀 Kourou 2000-3000€/m2 + 🏠 Périphérie 1500-2500€/m2 + 💰 Plus cher que métropole",
              anecdote: "💸 Paradoxe : Studio Cayenne = prix Paris 15ème ! Coût de la vie vs pouvoir d'achat déconnectés.",
              casParticulier: "📊 Pénurie : Taux vacance <2% vs 8% métropole. Marché sous tension permanente."
            },
            {
              id: "investissement-defiscalisation",
              question: "Quelles opportunités d'investissement ?",
              reponse: "Avantages fiscaux ! Loi Girardin (réduction impôt 48-60%), défiscalisation outre-mer, amortissement accéléré, plus-values exonérées. Secteurs porteurs : logement social, tourisme, énergies renouvelables. MAIS risques : marché étroit, revente difficile, gestion locative complexe.",
              illustration: "💰 Girardin 48-60% + 🏠 Logement social + 🌴 Tourisme + ⚡ Énergies + ⚠️ Marché étroit + 🔄 Revente difficile",
              anecdote: "🎯 Attractivité : Investisseurs métropolitains financent 40% construction ! Solidarité fiscale efficace.",
              casParticulier: "⚖️ Équilibre : Défiscalisation = développement mais risque bulle spéculative. Régulation nécessaire."
            },
            {
              id: "credit-immobilier-specificites",
              question: "Comment obtenir un crédit immobilier ?",
              reponse: "Conditions adaptées ! Prêts bonifiés, garanties assouplies, différé remboursement, taux préférentiels fonctionnaires. MAIS apport personnel élevé (20-30%), garanties locales exigées, assurance majorée (risques naturels). Banques locales : Crédit Agricole, BNP, Banque Postale spécialisées.",
              illustration: "💰 Prêts bonifiés + 📊 20-30% apport + 🛡️ Assurance majorée + 🏦 Banques spécialisées + 🌪️ Risques naturels",
              anecdote: "🎯 Solidarité : Prêts bonifés État = -1% taux vs métropole ! Aide publique concrète accession.",
              casParticulier: "🌊 Contrainte : Assurance cyclone/inondation obligatoire. Coût additionnel 0,3-0,5% du capital."
            },
            {
              id: "marche-locatif-tendances",
              question: "Comment fonctionne le marché locatif ?",
              reponse: "Tension maximale ! Taux vacance <2%, délais location <1 semaine, cautions 3-6 mois, loyers 8-15€/m2/mois. Profils demandeurs : fonctionnaires mutés, cadres spatial, étudiants, familles modestes. Offre insuffisante chronique ! Investissement locatif = placement sûr mais cher.",
              illustration: "📊 <2% vacance + ⏰ <1 semaine location + 💰 3-6 mois caution + 🎯 Demande > offre + 💎 Placement sûr",
              anecdote: "🚀 Privilège : Appartement face base spatiale loué avant construction ! Prestige géographique unique.",
              casParticulier: "👥 Social : Colocation généralisée (coûts élevés). Adaptation solidaire nécessaire."
            }
          ]
        },
        defis: {
          title: "⚠️ Défis & Perspectives",
          icon: AlertCircle,
          questions: [
            {
              id: "pression-demographique-foncier",
              question: "Comment gérer la pression démographique ?",
              reponse: "Croissance explosive ! +3%/an vs +0,3% métropole, 300k hab → 400k en 2030. Besoins : +2000 logements/an, extension urbaine, équipements publics. Contrainte : 95% territoire protégé ! Solution : densification, renouvellement urbain, villes nouvelles planifiées.",
              illustration: "📈 +3%/an croissance + 👥 300k→400k + 🏠 +2000 logements/an + 🌿 95% protégé + 🏙️ Densification nécessaire",
              anecdote: "🎯 Comparaison : Croissance démographique x10 plus rapide qu'en métropole ! Boom amazonien.",
              casParticulier: "🏗️ Vision : Projet ville nouvelle Montsinéry-Tonnegrande 50k habitants ! Urbanisme futuriste."
            },
            {
              id: "changement-climatique-impact",
              question: "Quels impacts du changement climatique ?",
              reponse: "Défis croissants ! Élévation niveau mer (+30cm d'ici 2100), érosion côtière accélérée, intensification cyclones, inondations plus fréquentes. Adaptation : construction sur pilotis, recul trait côte, normes renforcées, urbanisme résilient. Coût : milliards € anticipation vs catastrophes.",
              illustration: "🌊 +30cm niveau mer + 🌪️ Cyclones intenses + 🏠 Pilotis + 📏 Recul côte + 💰 Milliards adaptation",
              anecdote: "🌊 Alerte : Village Awala menacé disparition ! Premier 'réfugié climatique' guyanais.",
              casParticulier: "🔬 Innovation : Guyane laboratoire adaptation climatique tropical. Expertise exportable monde."
            },
            {
              id: "conflits-usage-territoire",
              question: "Quels conflits d'usage du territoire ?",
              reponse: "Tensions multiples ! Orpaillage vs protection forêt, agriculture vs urbanisation, tourisme vs préservation, spatial vs environnement, développement vs droits coutumiers. Arbitrages difficiles ! Gouvernance territoriale = défi du siècle. Concertation vs décision nécessaire.",
              illustration: "⛏️ Orpaillage vs 🌿 forêt + 🏠 urbain vs 🌾 agricole + 🚀 spatial vs 🦋 environnement + 🤝 Concertation",
              anecdote: "⚖️ Dilemme : Refuser mine d'or = emplois perdus, accepter = forêt détruite ! Équations impossibles.",
              casParticulier: "💡 Innovation : Conseils territoriaux multi-acteurs expérimentés. Gouvernance participative."
            },
            {
              id: "solutions-innovantes-foncier",
              question: "Quelles solutions innovantes pour le foncier ?",
              reponse: "Créativité nécessaire ! Baux emphytéotiques longue durée, propriété temporaire, cessions conditionnelles, coopératives foncières, fiducies territoriales, crowdfunding immobilier, habitat participatif. Objectif : démocratiser accès foncier tout en protégeant territoire.",
              illustration: "📜 Baux emphytéotiques + ⏰ Propriété temporaire + 🤝 Coopératives + 💻 Crowdfunding + 🏘️ Habitat participatif",
              anecdote: "💡 Expérimentation : Premier habitat participatif amazonien à Macouria ! Innovation sociale française.",
              casParticulier: "🌍 Inspiration : S'inspirer modèles singapourien, costaricien pour concilier développement et protection."
            }
          ]
        }
      }
    },
    accords2017: {
      title: "📜 Accords de Guyane 2017",
      icon: FileText,
      color: "#1D4ED8",
      description: "Comprendre les Accords de Guyane 2017 : crise sociale historique, négociations, engagements pris et bilan 7 ans après. Un tournant politique majeur !",
      subSections: {
        crise: {
          title: "🔥 La Crise de 2017",
          icon: AlertCircle,
          questions: [
            {
              id: "declenchement-crise-2017",
              question: "Comment s'est déclenchée la crise de 2017 ?",
              reponse: "Explosion sociale historique ! Mars 2017 : grève générale, blocages routes/aéroport, manifestations massives, 500 000 Guyanais mobilisés. Causes : mal-vie généralisé, insécurité, santé défaillante, éducation en crise, promesses non tenues. Catalyseur : assassinat enseignant + ras-le-bol décennie d'abandon !",
              illustration: "💥 Grève générale + 🚧 Blocages + 👥 500k mobilisés + 🏥 Santé + 🎓 Éducation + 😡 Ras-le-bol abandon",
              anecdote: "📊 Ampleur : 500 000 manifestants = 100% population adulte ! Mobilisation totale inédite en France.",
              casParticulier: "⚡ Symbole : Blocage aéroport CSG paralyse spatial européen ! Impact international immédiat."
            },
            {
              id: "revendications-collectif-urgence",
              question: "Quelles étaient les revendications du collectif ?",
              reponse: "Cahier revendications massif ! Sécurité (1000 policiers/gendarmes +), santé (hôpital, déserts médicaux), éducation (lycées, universités), emploi (plan Marshall), infrastructures (routes, très haut débit), logement, justice, environnement. Total : 2,5 milliards € investissements. Ambition : rattrapage historique !",
              illustration: "👮 +1000 forces ordre + 🏥 Santé + 🎓 Éducation + 💼 Emploi + 🛣️ Infrastructures + 💰 2,5Md€ + ⚡ Rattrapage",
              anecdote: "📋 Volume : Cahier 120 pages ! Plus gros dossier revendicatif territorial français moderne.",
              casParticulier: "🎯 Précision : Chiffrage exact investissements par secteur. Professionnalisme revendicatif exemplaire."
            },
            {
              id: "blocages-economiques-impact",
              question: "Quel fut l'impact économique des blocages ?",
              reponse: "Paralysie totale ! CSG arrêté (reports lancements Ariane), commerce bloqué, tourisme annulé, administrations fermées, écoles interrompues. Coût : 10-15 millions €/jour ! Pression économique maximale sur État. Solidarité population : approvisionnement solidaire, entraide généralisée.",
              illustration: "🚀 CSG arrêté + 🛒 Commerce bloqué + ✈️ Tourisme annulé + 💰 10-15M€/jour + 🤝 Solidarité population",
              anecdote: "🚀 Impact : Reports lancements Ariane coûtent millions € ! Spatial européen otage crise sociale.",
              casParticulier: "💪 Solidarité : Population s'organise approvisionnement alternatif. Cohésion sociale exceptionnelle."
            },
            {
              id: "mediation-negociations",
              question: "Comment se sont déroulées les négociations ?",
              reponse: "Médiation historique ! Ministres Cazeneuve, Girardin déplacés, préfet coordonne, élus locaux médiateurs, collectif UTG (500 Frères) négociateurs. 3 semaines tensions maximales, négociations marathon, couverture médiatique nationale. France découvre réalités guyanaises ! Pédagogie territoriale forcée.",
              illustration: "👔 Ministres déplacés + 🏛️ Préfet + 🗳️ Élus médiateurs + 👥 UTG 500 + 📺 Médias nationaux + 🎓 Pédagogie forcée",
              anecdote: "📺 Révélation : Métropole découvre Guyane existe ! Crise = cours géographie nationale accéléré.",
              casParticulier: "🤝 Innovation : Négociation collective territoriale inédite en République. Précédent démocratique."
            }
          ]
        },
        accords: {
          title: "📝 Les Accords Signés",
          icon: FileText,
          questions: [
            {
              id: "signature-accords-ceremonie",
              question: "Comment se sont conclus les Accords ?",
              reponse: "Signature historique 21 avril 2017 ! Cérémonie solennelle préfecture Cayenne, ministres présents, collectif UTG, élus, médias. 1,086 milliard € engagés + 1,2 milliard € programmés = 2,3 milliards € total ! Plus gros plan investissement territorial français. Émotion, soulagement, espoir !",
              illustration: "📅 21 avril 2017 + 🏛️ Préfecture solennelle + 👔 Ministres + 💰 2,3Md€ total + 🎉 Émotion + 🌟 Espoir",
              anecdote: "💰 Record : Plus gros plan investissement territorial depuis Plan Marshall Corse ! Ampleur historique.",
              casParticulier: "📺 Retransmission : Cérémonie diffusée direct national. Reconnaissance officielle problème guyanais."
            },
            {
              id: "securite-engagements-forces",
              question: "Quels engagements sur la sécurité ?",
              reponse: "Renforcement massif ! +1070 forces ordre (police, gendarmerie, douanes, armée), équipements modernes, hélicoptères supplémentaires, lutte anti-orpaillage renforcée, coopération internationale, centres pénitentiaires. Budget : 200M€. Objectif : rattraper déficit sécuritaire chronique Guyane.",
              illustration: "👮 +1070 forces + 🚁 Hélicoptères + ⛏️ Anti-orpaillage + 🌍 Coopération + 🏢 Prisons + 💰 200M€",
              anecdote: "📊 Augmentation : +50% effectifs sécurité en 5 ans ! Renforcement sans précédent français.",
              casParticulier: "🎯 Spécialisation : Forces dédiées orpaillage illégal. Adaptation menaces amazoniennes."
            },
            {
              id: "sante-hopital-engagements",
              question: "Quels investissements santé prévus ?",
              reponse: "Plan santé ambitieux ! Nouvel hôpital Cayenne (350M€), CHOG modernisé, maisons santé communes isolées, télémédecine généralisée, +100 médecins, évacuations sanitaires, formation personnel local. Vision : égalité soins métropole/Guyane. Rattrapage déserts médicaux historiques.",
              illustration: "🏥 Hôpital neuf 350M€ + 🏘️ Maisons santé + 💻 Télémédecine + 👨‍⚕️ +100 médecins + 🚁 Évacuations + 🎓 Formation",
              anecdote: "🏥 Symbole : Nouvel hôpital = plus gros chantier sanitaire Outre-mer ! Fierté territoriale.",
              casParticulier: "📡 Innovation : Télémédecine généralisée villages. Guyane = pilote national santé connectée."
            },
            {
              id: "education-lycees-universite",
              question: "Quelles avancées éducatives négociées ?",
              reponse: "Éducation prioritaire ! 3 lycées neufs, rénovation établissements, +500 enseignants, université renforcée, formation professionnelle, numérique éducatif, cantines, transports scolaires. Budget : 400M€. Défi : population jeune (50% <25 ans) vs capacités d'accueil insuffisantes.",
              illustration: "🏫 3 lycées neufs + 👨‍🏫 +500 enseignants + 🎓 Université + 💻 Numérique + 🍽️ Cantines + 💰 400M€",
              anecdote: "📚 Symbole : Lycée Maripasoula = premier lycée en cœur Amazonie ! Égalité territoriale scolaire.",
              casParticulier: "🎯 Adaptation : Programmes scolaires intégrant spécificités amazoniennes. Innovation pédagogique."
            }
          ]
        },
        mise_oeuvre: {
          title: "🚧 Mise en Œuvre",
          icon: Settings,
          questions: [
            {
              id: "suivi-accords-gouvernance",
              question: "Comment est organisé le suivi des Accords ?",
              reponse: "Gouvernance dédiée ! Comité suivi État-collectivités, rapports trimestriels, indicateurs précis, missions contrôle, concertation citoyenne continue. Préfet = coordinateur général. Transparence : site web dédié, bilans publics. Innovation : démocratie participative post-crise institutionnalisée.",
              illustration: "👥 Comité suivi + 📊 Rapports trimestriels + 🎯 Indicateurs + 🔍 Contrôle + 🌐 Site web + 🤝 Participation citoyenne",
              anecdote: "💻 Transparence : Premier site web gouvernemental suivi engagements territoriaux ! Innovation administrative.",
              casParticulier: "🗳️ Citoyenneté : Collectif UTG associé suivi permanent. Contrôle citoyen institutionnalisé."
            },
            {
              id: "realisations-concretes-2017-2024",
              question: "Quelles réalisations concrètes depuis 2017 ?",
              reponse: "Bilan positif ! Sécurité : +800 forces arrivées, criminalité -15%, nouvel hôpital en construction (2025), 2 lycées livrés, fibre optique déployée, routes rénovées, tribunaux renforcés. Mais retards : logement social, assainissement, emploi. Mise œuvre = 70% engagements tenus.",
              illustration: "👮 +800 forces + 📉 Crime -15% + 🏥 Hôpital construction + 🏫 2 lycées + 📡 Fibre + ✅ 70% engagements",
              anecdote: "📈 Succès : Criminalité baisse 15% en 5 ans ! Sécurité = réussite majeure Accords.",
              casParticulier: "⏰ Retards : Logement social accumule délais. Secteur le plus difficile à réaliser."
            },
            {
              id: "obstacles-difficultes-rencontrees",
              question: "Quelles difficultés de mise en œuvre ?",
              reponse: "Obstacles multiples ! Procédures administratives lourdes, recours juridiques, foncier bloqué, pénurie main-d'œuvre qualifiée, coûts construction +50%, covid-19 perturbations, changements gouvernementaux. Leçon : annoncer facile, réaliser difficile ! Complexité administrative vs urgence sociale.",
              illustration: "📋 Procédures lourdes + ⚖️ Recours + 🗺️ Foncier bloqué + 👷 Pénurie + 💰 Coûts +50% + 😷 Covid + 🏛️ Changements gouvernement",
              anecdote: "⏰ Exemple : Lycée annoncé 2018, livré 2023 ! 5 ans entre promesse et réalité.",
              casParticulier: "🌿 Contrainte : Études environnementales rallongent délais. Protection vs urgence sociale."
            },
            {
              id: "evolution-demandes-nouvelles",
              question: "Les besoins ont-ils évolué depuis 2017 ?",
              reponse: "Nouveaux défis ! Crise covid, inflation, immigration accrue, changement climatique, transition énergétique, numérique. Population +20% = besoins x1,2 ! Accords 2017 = base mais actualisations nécessaires. Réflexion : Accords de Guyane 2025 ? Cycle revendicatif permanent ?",
              illustration: "😷 Covid + 📈 Inflation + 👥 Immigration + 🌡️ Climat + ⚡ Énergie + 💻 Numérique + 📊 +20% population",
              anecdote: "📊 Évolution : Besoins 2024 dépassent Accords 2017 ! Territoire en mouvement permanent.",
              casParticulier: "🔄 Question : Faut-il re-négocier Accords actualisés ? Débat politique ouvert."
            }
          ]
        },
        bilan: {
          title: "📊 Bilan & Perspectives",
          icon: TrendingUp,
          questions: [
            {
              id: "succes-echecs-bilan-2024",
              question: "Quel bilan 7 ans après les Accords ?",
              reponse: "Bilan contrasté ! SUCCÈS : sécurité améliorée, santé modernisée, éducation renforcée, infrastructures avancées. ÉCHECS : logement social retardé, emploi insuffisant, inégalités persistantes. GLOBAL : 70% engagements tenus, 2,1Md€ investis sur 2,3Md€ promis. Progrès réels mais attentes élevées non satisfaites.",
              illustration: "✅ Sécurité + 🏥 Santé + 🎓 Éducation vs ❌ Logement + 💼 Emploi + 📊 70% tenus + 💰 2,1/2,3Md€ + 🤔 Attentes",
              anecdote: "⚖️ Nuance : Verre à moitié plein ou vide ? Perception dépend attentes vs réalisations.",
              casParticulier: "📈 Indicateurs : Criminalité ↓, santé ↑, éducation ↑, logement ↓, emploi →. Bilan nuancé."
            },
            {
              id: "impact-politique-territorial",
              question: "Quel impact politique des Accords ?",
              reponse: "Révolution démocratique ! Guyane = modèle négociation territoriale, méthode exportée autres DOM, dialogue social renforcé, citoyenneté active, contrôle citoyen, reconnaissance spécificités ultramarines. Innovation : démocratie participative post-conflit. Précédent pour futurs mouvements sociaux territoriaux.",
              illustration: "🗳️ Modèle négociation + 🏝️ Exporté DOM + 🤝 Dialogue + 👥 Citoyenneté active + 🔍 Contrôle + 🌟 Innovation démocratie",
              anecdote: "🏆 Modèle : Martinique s'inspire méthode guyanaise 2019 ! Essaimage réussi.",
              casParticulier: "📚 Enseignement : Accords Guyane étudiés Sciences Po ! Cas d'école négociation territoriale."
            },
            {
              id: "lecons-democratiques-tirees",
              question: "Quelles leçons démocratiques tirer ?",
              reponse: "Enseignements majeurs ! Mobilisation massive peut obtenir résultats, négociation vaut mieux qu'affrontement, transparence nécessaire, suivi citoyen indispensable, promesses engagent, complexité administrative = obstacle démocratique. Innovation : de la contestation à la co-construction !",
              illustration: "💪 Mobilisation efficace + 🤝 Négociation > affrontement + 🔍 Transparence + 👥 Suivi citoyen + 📋 Promesses engagent",
              anecdote: "🎓 Pédagogie : Crise 2017 = cours démocratie grandeur nature ! Apprentissage collectif exceptionnel.",
              casParticulier: "🔄 Évolution : Du 'contre' au 'avec'. Maturité démocratique territoriale acquise."
            },
            {
              id: "avenir-nouveaux-accords",
              question: "Faut-il de nouveaux Accords pour l'avenir ?",
              reponse: "Débat ouvert ! POUR : besoins évoluent, engagements 2017 insuffisants, nouveaux défis (climat, numérique), méthode efficace. CONTRE : lassitude négociation, préférer mise œuvre, éviter cycle revendicatif permanent. Consensus : dialogue permanent État-territoire nécessaire, forme à définir.",
              illustration: "✅ Besoins évoluent + 🔄 Méthode efficace vs ❌ Lassitude + 🎯 Préférer mise œuvre + 🤝 Dialogue permanent nécessaire",
              anecdote: "🤔 Question : Accords Guyane tous les 10 ans ? Méthode démocratie territoriale à institutionnaliser ?",
              casParticulier: "💡 Innovation : Inventer dialogue permanent vs négociation crise. Défi démocratique moderne."
            }
          ]
        }
      }
    }
  };

  // Composant pour les sous-sections interactives
  const SubSectionCard = ({ subSection, sectionColor, isActive, onClick }) => {
    const IconComponent = subSection.icon;
    return (
      <button
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: isActive ? `${sectionColor}20` : 'rgba(255, 255, 255, 0.05)',
          border: `2px solid ${isActive ? sectionColor : 'rgba(255, 255, 255, 0.1)'}`,
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          width: '100%',
          textAlign: 'left',
          color: isActive ? sectionColor : '#94a3b8',
          fontWeight: '600'
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = `${sectionColor}60`;
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }
        }}
      >
        <IconComponent size={20} />
        <span>{subSection.title}</span>
        {isActive && <CheckCircle size={16} style={{ marginLeft: 'auto' }} />}
      </button>
    );
  };

  // Composant question enrichie avec anecdotes
  const QuestionCardEnrichie = ({ question, isExpanded, onToggle }) => (
    <div 
      className="question-card-enrichie"
      style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '1.5rem',
          background: 'none',
          border: 'none',
          color: 'white',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <HelpCircle size={20} style={{ color: '#60a5fa', flexShrink: 0 }} />
          <span style={{ 
            fontWeight: '600', 
            fontSize: '1.1rem',
            lineHeight: '1.4'
          }}>
            {question.question}
          </span>
        </div>
        {isExpanded ? 
          <ChevronDown size={20} style={{ color: '#94a3b8', flexShrink: 0 }} /> : 
          <ChevronRight size={20} style={{ color: '#94a3b8', flexShrink: 0 }} />
        }
      </button>
      
      {isExpanded && (
        <div style={{
          padding: '0 1.5rem 1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(15, 23, 42, 0.5)'
        }}>
          {/* Illustration en résumé */}
          <div style={{
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <Lightbulb size={16} style={{ color: '#60a5fa' }} />
              <span style={{ 
                color: '#60a5fa', 
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                En résumé
              </span>
            </div>
            <p style={{ 
              color: '#e2e8f0',
              margin: 0,
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              {question.illustration}
            </p>
          </div>
          
          {/* Réponse principale */}
          <p style={{ 
            color: '#cbd5e1',
            lineHeight: '1.6',
            margin: '0 0 1.5rem 0',
            fontSize: '1rem'
          }}>
            {question.reponse}
          </p>

          {/* Anecdote si présente */}
          {question.anecdote && (
            <div style={{
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <Zap size={16} style={{ color: '#f59e0b' }} />
                <span style={{ 
                  color: '#f59e0b', 
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  Anecdote
                </span>
              </div>
              <p style={{ 
                color: '#fed7aa',
                margin: 0,
                fontSize: '0.95rem',
                fontStyle: 'italic'
              }}>
                {question.anecdote}
              </p>
            </div>
          )}

          {/* Cas particulier si présent */}
          {question.casParticulier && (
            <div style={{
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '8px',
              padding: '1rem'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <Info size={16} style={{ color: '#22c55e' }} />
                <span style={{ 
                  color: '#22c55e', 
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  À retenir
                </span>
              </div>
              <p style={{ 
                color: '#bbf7d0',
                margin: 0,
                fontSize: '0.95rem'
              }}>
                {question.casParticulier}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const currentSection = sectionsDataAvancees[activeSection];
  const currentSubSection = activeSubSection ? currentSection.subSections[activeSubSection] : null;

  return (
    <div className="app-modern">
      {/* Header */}
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
                Comment ça fonctionne ? - Version Avancée
              </h1>
              <p className="header-subtitle" style={{color: '#94a3b8', fontSize: '0.875rem', margin: 0}}>
                Éducation civique exhaustive : institutions, élections, coopération, justice-sécurité, représentation de l'État, statuts territoriaux, aides sociales, foncier ET Accords 2017
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content principal */}
      <div className="content-section" style={{ padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          
          {/* Menu de navigation des sections principales */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {Object.entries(sectionsDataAvancees).map(([key, section]) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveSection(key);
                    setActiveSubSection(null);
                    setExpandedQuestion(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem 1.5rem',
                    backgroundColor: activeSection === key ? section.color : 'rgba(255, 255, 255, 0.05)',
                    color: activeSection === key ? 'white' : '#94a3b8',
                    border: `2px solid ${activeSection === key ? section.color : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: '600',
                    fontSize: '1rem',
                    minWidth: '200px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (activeSection !== key) {
                      e.target.style.backgroundColor = `${section.color}20`;
                      e.target.style.borderColor = `${section.color}60`;
                      e.target.style.color = section.color;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSection !== key) {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.color = '#94a3b8';
                    }
                  }}
                >
                  <IconComponent size={24} />
                  <span>{section.title}</span>
                </button>
              );
            })}
          </div>

          {/* Section actuelle */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '2rem',
            border: `2px solid ${currentSection.color}20`
          }}>
            {/* Header de section */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem',
              padding: '1.5rem',
              backgroundColor: `${currentSection.color}20`,
              borderRadius: '12px',
              border: `1px solid ${currentSection.color}40`
            }}>
              <div style={{
                backgroundColor: currentSection.color,
                borderRadius: '12px',
                padding: '1rem',
                color: 'white'
              }}>
                <currentSection.icon size={32} />
              </div>
              <div>
                <h2 style={{
                  color: '#e2e8f0',
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  margin: 0,
                  marginBottom: '0.5rem'
                }}>
                  {currentSection.title}
                </h2>
                <p style={{
                  color: '#94a3b8',
                  margin: 0,
                  fontSize: '1rem'
                }}>
                  {currentSection.description}
                </p>
              </div>
            </div>

            {/* Navigation des sous-sections */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {Object.entries(currentSection.subSections).map(([key, subSection]) => (
                <SubSectionCard
                  key={key}
                  subSection={subSection}
                  sectionColor={currentSection.color}
                  isActive={activeSubSection === key}
                  onClick={() => {
                    setActiveSubSection(activeSubSection === key ? null : key);
                    setExpandedQuestion(null);
                  }}
                />
              ))}
            </div>

            {/* Contenu de la sous-section active */}
            {currentSubSection && (
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <currentSubSection.icon size={24} style={{ color: currentSection.color }} />
                  <h3 style={{
                    color: '#e2e8f0',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    {currentSubSection.title}
                  </h3>
                </div>

                {/* Questions enrichies */}
                {currentSubSection.questions.map((question) => (
                  <QuestionCardEnrichie
                    key={question.id}
                    question={question}
                    isExpanded={expandedQuestion === question.id}
                    onToggle={() => setExpandedQuestion(
                      expandedQuestion === question.id ? null : question.id
                    )}
                  />
                ))}
              </div>
            )}

            {/* Message si aucune sous-section sélectionnée */}
            {!activeSubSection && (
              <div style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <Eye size={48} style={{ color: currentSection.color, margin: '0 auto 1rem' }} />
                <h3 style={{
                  color: '#e2e8f0',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  Choisissez un thème ci-dessus
                </h3>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '1rem'
                }}>
                  Sélectionnez une des catégories pour découvrir les questions-réponses détaillées avec anecdotes et cas pratiques !
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationPolitiqueAvancee;
