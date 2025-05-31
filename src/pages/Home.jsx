// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import { fetchGames, fetchGamesByGenre, fetchCollections } from "../api/rawg";
import styled from "styled-components";

const Section = styled.div`
  padding: 32px;
  color: white;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 12px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const HorizontalScroll = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 16px;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 3px;
  }
`;

const HeroBanner = styled.div`
  background-image: url("https://images.unsplash.com/photo-1607013251379-e6c2a53b8f8b");
  background-size: cover;
  background-position: center;
  padding: 100px 32px;
  text-align: center;
  color: white;
  border-radius: 12px;
  margin-bottom: 48px;
`;

const Home = () => {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState({});
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const trending = await fetchGames();
      setGames(trending);

      const genreList = ["action", "role-playing-games-rpg", "sports"];
      const categoryData = {};
      for (const genre of genreList) {
        categoryData[genre] = await fetchGamesByGenre(genre);
      }
      setCategories(categoryData);

      const collectionData = await fetchCollections();
      setCollections(collectionData);
    };

    loadData();
  }, []);

  const editorPicks = [
    "red-dead-redemption-2",
    "the-witcher-3-wild-hunt",
    "cyberpunk-2077",
    "baldurs-gate-3",
  ];

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner>
        <h1 style={{ fontSize: "42px", marginBottom: "16px" }}>GameG'e Hoş Geldiniz</h1>
        <p style={{ fontSize: "18px", maxWidth: "700px", margin: "auto" }}>
          En iyi ve en yeni oyunları keşfet, koleksiyonlara göz at, editörün favorilerini incele.
        </p>
      </HeroBanner>

      {/* Yeni ve Trend Oyunlar */}
      <Section>
        <SectionTitle>Yeni ve Trend</SectionTitle>
        <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "24px" }}>
          Oyuncu sayıları ve çıkış tarihine göre sıralanmıştır.
        </p>
        <Grid>
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </Grid>
      </Section>

      {/* Kategorilere Göre Oyunlar */}
      <Section>
        <SectionTitle>Kategorilere Göre</SectionTitle>
        {Object.entries(categories).map(([genre, games]) => (
          <div key={genre} style={{ marginBottom: "24px" }}>
            <h3 style={{ textTransform: "capitalize", marginBottom: "12px" }}>{genre.replace(/-/g, " ")}</h3>
            <HorizontalScroll>
              {games.slice(0, 8).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </HorizontalScroll>
          </div>
        ))}
      </Section>

      {/* Editörün Seçimi */}
      <Section>
        <SectionTitle>Editörün Seçimi</SectionTitle>
        <HorizontalScroll>
          {games
            .filter((game) => editorPicks.includes(game.slug))
            .map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
        </HorizontalScroll>
      </Section>
    </div>
  );
};

export default Home;
