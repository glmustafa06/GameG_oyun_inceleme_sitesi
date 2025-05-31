// src/pages/Upcoming.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GameCard from "../components/GameCard";

const Section = styled.div`
  padding: 32px;
  color: white;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 24px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const Upcoming = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingGames = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const futureDate = nextYear.toISOString().split("T")[0];

        const res = await fetch(
          `https://api.rawg.io/api/games?key=d2de5157909940239e231629c51a38a1&dates=${today},${futureDate}&ordering=added`
        );
        const data = await res.json();
        const filteredGames = data.results.filter(
          (game) => game.background_image && !/hentai|adult/i.test(game.slug)
        );
        setGames(filteredGames);
      } catch (error) {
        console.error("Yakında çıkacak oyunlar alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingGames();
  }, []);

  return (
    <Section>
      <Title>Yakında Çıkacak Oyunlar</Title>
      {loading ? (
        <p>Yükleniyor...</p>
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

export default Upcoming;
