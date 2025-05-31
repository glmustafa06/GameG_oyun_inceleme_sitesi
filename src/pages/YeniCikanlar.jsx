// src/pages/YeniCikanlar.jsx
import React, { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import styled from "styled-components";

const Container = styled.div`
  padding: 32px;
  color: white;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  color: #aaa;
  font-size: 14px;
  margin-bottom: 32px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
`;

const YeniCikanlar = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYeniCikanlar = async () => {
      const API_KEY = "d2de5157909940239e231629c51a38a1";
      const BASE_URL = "https://api.rawg.io/api";

      const today = new Date().toISOString().split("T")[0];
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const startDate = threeMonthsAgo.toISOString().split("T")[0];

      const res = await fetch(
        `${BASE_URL}/games?key=${API_KEY}&dates=${startDate},${today}&ordering=-released&page_size=40`
      );
      const data = await res.json();

      const filtered = data.results.filter((game) => {
        // Kapak resmi yoksa gösterme
        if (!game.background_image) return false;

        // Yetişkin içerik kontrolü (tag ya da genre adı adult, hentai içeriyorsa)
        const lowerTags = [
          ...(game.tags || []),
          ...(game.genres || []),
        ].map((t) => t.name.toLowerCase());

        const blockedKeywords = ["hentai", "adult", "nsfw", "nudity"];
        return !lowerTags.some((tag) =>
          blockedKeywords.some((word) => tag.includes(word))
        );
      });

      setGames(filtered);
      setLoading(false);
    };

    fetchYeniCikanlar();
  }, []);

  return (
    <Container>
      <Title>Yeni Çıkanlar</Title>
      <Subtitle>Son 3 ayda piyasaya sürülmüş en yeni oyunlar</Subtitle>

      {loading ? (
        <p style={{ color: "#aaa" }}>Yükleniyor...</p>
      ) : (
        <Grid>
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default YeniCikanlar;
