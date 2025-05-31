import React, { useEffect, useState } from "react";
import { fetchPopularGames } from "../api/rawg";
import GameCard from "../components/GameCard";
import styled from "styled-components";

const Section = styled.div`
  padding: 32px;
  color: white;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const Popular = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPopularGames = async () => {
      const data = await fetchPopularGames();
      setGames(data);
      setLoading(false);
    };
    loadPopularGames();
  }, []);

  return (
    <Section>
      <SectionTitle>Popüler Oyunlar</SectionTitle>
      {loading ? (
        <p style={{ color: "#aaa" }}>Yükleniyor...</p>
      ) : (
        <Grid>
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </Grid>
      )}
    </Section>
  );
};

export default Popular;
