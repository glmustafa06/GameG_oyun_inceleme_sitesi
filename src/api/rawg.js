// src/api/rawg.js

const API_KEY = 'd2de5157909940239e231629c51a38a1';
const BASE_URL = 'https://api.rawg.io/api';

// Yeni ve popüler oyunları getirir
export const fetchGames = async (page = 1, pageSize = 40) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    const oneYearAgo = lastYear.toISOString().split('T')[0];

    const res = await fetch(
      `${BASE_URL}/games?exclude_additions=true&ordering=-added&dates=${oneYearAgo},${today}&key=${API_KEY}&page=${page}&page_size=${pageSize}`
    );

    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error('Oyun listesi alınırken hata:', error);
    return [];
  }
};

// Belirli bir oyuna ait ekran görüntülerini getirir
export const fetchGameScreenshots = async (gameId) => {
  try {
    const res = await fetch(`${BASE_URL}/games/${gameId}/screenshots?key=${API_KEY}`);
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error(`Oyun (${gameId}) screenshotları alınamadı:`, error);
    return [];
  }
};

// Belirli bir oyunun tüm detaylarını getirir
export const fetchGameDetails = async (gameId) => {
  try {
    const res = await fetch(`${BASE_URL}/games/${gameId}?key=${API_KEY}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Oyun (${gameId}) detayları alınamadı:`, error);
    return null;
  }
};

export const fetchGameDetail = async (id) => {
  const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
  const data = await response.json();
  return data;
};


// Koleksiyonları getir (RAWG'de collections endpoint'i)
export const fetchCollections = async () => {
  try {
    const res = await fetch(`${BASE_URL}/collections?key=${API_KEY}`);
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error("Koleksiyonlar alınırken hata:", error);
    return [];
  }
};

// Belirli bir tür (genre) için oyunları getir
export const fetchGamesByGenre = async (genreSlug) => {
  try {
    const res = await fetch(`${BASE_URL}/games?key=${API_KEY}&genres=${genreSlug}&ordering=-added&page_size=10`);
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error(`Genre (${genreSlug}) için oyunlar alınırken hata:`, error);
    return [];
  }
};

export const fetchPopularGames = async (page = 1, pageSize = 40) => {
  try {
    const res = await fetch(
      `${BASE_URL}/games?key=${API_KEY}&ordering=-rating&page=${page}&page_size=${pageSize}`
    );
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error("Popüler oyunlar alınırken hata:", error);
    return [];
  }
};

// src/api/rawg.js dosyasına ekle
export const fetchSearchResults = async (query) => {
  try {
    const res = await fetch(`${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=10`);
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Arama sonuçları alınırken hata:", error);
    return [];
  }
};
