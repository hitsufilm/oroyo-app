import { NextApiRequest, NextApiResponse } from 'next';

module.exports = async (req, res) => {
  // Permettre CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gérer les requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  try {
    console.log(`🔍 API News appelée pour: "${q}"`);

    // Option 1: NewsAPI (gratuit jusqu'à 100 requêtes/jour)
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    
    if (NEWS_API_KEY) {
      console.log('📡 Utilisation de NewsAPI');
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(q + ' Guyane')}&language=fr&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ NewsAPI: ${data.articles?.length || 0} articles trouvés`);
        return res.status(200).json(data);
      } else {
        console.log(`⚠️ NewsAPI erreur: ${response.status}`);
      }
    }

    // Option 2: NewsData.io (gratuit jusqu'à 200 requêtes/jour)
    const NEWSDATA_KEY = process.env.NEWSDATA_API_KEY;
    
    if (NEWSDATA_KEY) {
      console.log('📡 Utilisation de NewsData.io');
      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${NEWSDATA_KEY}&q=${encodeURIComponent(q)}&language=fr&size=5`
      );
      
      if (response.ok) {
        const data = await response.json();
        const articles = data.results?.map(article => ({
          title: article.title,
          description: article.description,
          url: article.link,
          publishedAt: article.pubDate,
          source: { name: article.source_id },
          urlToImage: article.image_url
        })) || [];
        
        console.log(`✅ NewsData: ${articles.length} articles trouvés`);
        return res.status(200).json({ articles });
      } else {
        console.log(`⚠️ NewsData erreur: ${response.status}`);
      }
    }

    // Option 3: Gnews.io (gratuit jusqu'à 100 requêtes/jour)
    const GNEWS_KEY = process.env.GNEWS_API_KEY;
    
    if (GNEWS_KEY) {
      console.log('📡 Utilisation de GNews');
      const response = await fetch(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=fr&country=fr&max=5&apikey=${GNEWS_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const articles = data.articles?.map(article => ({
          title: article.title,
          description: article.description,
          url: article.url,
          publishedAt: article.publishedAt,
          source: { name: article.source.name },
          urlToImage: article.image
        })) || [];
        
        console.log(`✅ GNews: ${articles.length} articles trouvés`);
        return res.status(200).json({ articles });
      }
    }

    // Fallback: Pas d'API configurée
    console.log('⚠️ Aucune clé API configurée');
    return res.status(200).json({ 
      articles: [{
        title: 'Configuration requise',
        description: 'Configurez une clé API pour afficher les actualités en temps réel.',
        url: '#',
        publishedAt: new Date().toISOString(),
        source: { name: 'Oroyo' },
        urlToImage: null
      }]
    });

  } catch (error) {
    console.error('❌ Erreur API News:', error);
    return res.status(500).json({ 
      error: 'Erreur serveur',
      articles: []
    });
  }
} 
