import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GameCard from "../components/GameCard";

const Container = styled.div`
  padding: 32px;
  color: white;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;

  select {
    padding: 8px 12px;
    background-color: #2b2b2b;
    color: white;
    border: 1px solid #444;
    border-radius: 6px;
    font-size: 14px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
`;

const Kesfet = () => {
  const [games, setGames] = useState([]);
  const [genre, setGenre] = useState("");
  const [ordering, setOrdering] = useState("-added");
  const [loading, setLoading] = useState(true);

  const API_KEY = "d2de5157909940239e231629c51a38a1";
  const BASE_URL = "https://api.rawg.io/api";

  const fetchGames = async () => {
    setLoading(true);
    try {
      const url = `${BASE_URL}/games?key=${API_KEY}${
        genre ? `&genres=${genre}` : ""
      }&ordering=${ordering}&page_size=40`;

      const res = await fetch(url);
      const data = await res.json();
      setGames(data.results);
    } catch (error) {
      console.error("Keşfet verileri alınamadı:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGames();
  }, [genre, ordering]);

  return (
    <Container>
      <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>Keşfet</h1>
      <Filters>
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Tüm Kategoriler</option>
          <option value="action">Aksiyon</option>
          <option value="role-playing-games-rpg">RPG</option>
          <option value="sports">Spor</option>
          <option value="adventure">Macera</option>
          <option value="strategy">Strateji</option>
        </select>

        <select value={ordering} onChange={(e) => setOrdering(e.target.value)}>
          <option value="-added">En Yeni Eklenen</option>
          <option value="-rating">En Yüksek Puanlı</option>
          <option value="-released">Yeni Çıkanlar</option>
          <option value="-metacritic">Metacritic Skoru</option>
          <option value="name">A'dan Z'ye</option>
        </select>
      </Filters>

      {loading ? (
        <p style={{ color: "#aaa" }}>Yükleniyor...</p>
      ) : (
        <Grid>
          {games
            .filter((game) => game.background_image) // Kapak fotoğrafı olanları göster
            .map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
        </Grid>
      )}
    </Container>
  );
};

export default Kesfet;
