// Créez ce fichier : src/importData.js
import { db } from './firebase';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';

// Toutes les 22 communes de Guyane
const communesData = [
  { id: 'cayenne', name: 'Cayenne', population: 61550, description: 'Capitale et préfecture', region: 'Île de Cayenne' },
  { id: 'saint-laurent-du-maroni', name: 'Saint-Laurent-du-Maroni', population: 47621, description: 'Sous-préfecture de l\'Ouest', region: 'Ouest guyanais' },
  { id: 'matoury', name: 'Matoury', population: 32942, description: 'Aéroport Félix Eboué', region: 'Île de Cayenne' },
  { id: 'remire-montjoly', name: 'Rémire-Montjoly', population: 26143, description: 'Plages et nature', region: 'Île de Cayenne' },
  { id: 'kourou', name: 'Kourou', population: 25892, description: 'Centre Spatial Guyanais 🚀', region: 'Centre littoral' },
  { id: 'macouria', name: 'Macouria', population: 12783, description: 'Développement économique', region: 'Île de Cayenne' },
  { id: 'sinnamary', name: 'Sinnamary', population: 2892, description: 'Patrimoine et nature', region: 'Centre littoral' },
  { id: 'iracoubo', name: 'Iracoubo', population: 1982, description: 'Héritage historique', region: 'Centre littoral' },
  { id: 'mana', name: 'Mana', population: 10275, description: 'Plages de ponte des tortues 🐢', region: 'Ouest guyanais' },
  { id: 'awala-yalimapo', name: 'Awala-Yalimapo', population: 1379, description: 'Réserve naturelle amérindienne', region: 'Ouest guyanais' },
  { id: 'roura', name: 'Roura', population: 3713, description: 'Montagnes et cascades', region: 'Sud' },
  { id: 'montsinery-tonnegrande', name: 'Montsinéry-Tonnegrande', population: 2826, description: 'Agriculture et élevage', region: 'Centre' },
  { id: 'saint-georges', name: 'Saint-Georges', population: 4047, description: 'Frontière avec le Brésil 🇧🇷', region: 'Est guyanais' },
  { id: 'regina', name: 'Régina', population: 966, description: 'Porte de l\'Est guyanais', region: 'Est guyanais' },
  { id: 'ouanary', name: 'Ouanary', population: 216, description: 'Embouchure de l\'Oyapock', region: 'Est guyanais' },
  { id: 'camopi', name: 'Camopi', population: 1964, description: 'Vallée de l\'Oyapock', region: 'Est guyanais' },
  { id: 'maripasoula', name: 'Maripasoula', population: 12035, description: 'Cœur de l\'Amazonie 🌳', region: 'Haut-Maroni' },
  { id: 'papaichton', name: 'Papaichton', population: 7365, description: 'Haut-Maroni', region: 'Haut-Maroni' },
  { id: 'grand-santi', name: 'Grand-Santi', population: 6001, description: 'Territoire Bushinenge', region: 'Haut-Maroni' },
  { id: 'apatou', name: 'Apatou', population: 8509, description: 'Confluent Maroni-Lawa', region: 'Haut-Maroni' },
  { id: 'saul', name: 'Saül', population: 149, description: 'Village d\'orpaillage isolé ⛏️', region: 'Centre forêt' },
  { id: 'saint-elie', name: 'Saint-Élie', population: 573, description: 'Forêt primaire préservée', region: 'Centre forêt' }
];

// Élus supplémentaires
const elusData = [
  {
    id: 'marcel-pierre',
    name: 'Marcel Pierre',
    commune: 'Cayenne',
    poste: 'Maire',
    status: 'actuel',
    rating: 4.2,
    totalVotes: 156
  },
  {
    id: 'sandrine-bernard',
    name: 'Sandrine Bernard',
    commune: 'Saint-Laurent-du-Maroni',
    poste: 'Maire',
    status: 'actuel',
    rating: 3.8,
    totalVotes: 89
  },
  {
    id: 'christophe-bouillon',
    name: 'Christophe Bouillon',
    commune: 'Kourou',
    poste: 'Maire',
    status: 'actuel',
    rating: 4.1,
    totalVotes: 124
  },
  {
    id: 'marie-laure-phinera',
    name: 'Marie-Laure Phinera-Horth',
    commune: 'Cayenne',
    poste: 'Adjoints au Maire',
    status: 'actuel',
    rating: 3.9,
    totalVotes: 67
  }
];

// Fonction pour importer toutes les communes
export const importCommunes = async () => {
  try {
    console.log('🚀 Import des communes commencé...');
    
    for (const commune of communesData) {
      await setDoc(doc(db, 'communes', commune.id), {
        id: commune.id,
        name: commune.name,
        population: commune.population,
        description: commune.description,
        region: commune.region
      });
      console.log(`✅ ${commune.name} ajoutée`);
    }
    
    console.log('🎉 Toutes les communes ont été importées !');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    return false;
  }
};

// Fonction pour importer les élus
export const importElus = async () => {
  try {
    console.log('🚀 Import des élus commencé...');
    
    for (const elu of elusData) {
      await setDoc(doc(db, 'elus', elu.id), elu);
      console.log(`✅ ${elu.name} ajouté(e)`);
    }
    
    console.log('🎉 Tous les élus ont été importés !');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    return false;
  }
};

// Fonction pour tout importer d'un coup
export const importAllData = async () => {
  console.log('🔥 Import complet démarré...');
  
  const communesSuccess = await importCommunes();
  const elusSuccess = await importElus();
  
  if (communesSuccess && elusSuccess) {
    console.log('🎉 IMPORT TERMINÉ ! Actualisez votre app.');
    alert('🎉 Import terminé ! Actualisez votre app pour voir toutes les communes.');
  } else {
    console.log('❌ Erreur pendant l\'import.');
    alert('❌ Erreur pendant l\'import. Vérifiez la console.');
  }
};