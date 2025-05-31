// src/pages/GameDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGameDetail, fetchGameScreenshots } from "../api/rawg";
import styled from "styled-components";
import {
  FaWindows,
  FaApple,
  FaAndroid,
  FaSteam,
  FaXbox,
  FaPlaystation,
} from "react-icons/fa";
import { SiEpicgames, SiGogdotcom, SiNintendo } from "react-icons/si";

const Container = styled.div`
  padding: 0;
  color: white;
`;

const CoverWrapper = styled.div`
  position: relative;
  width: 100%;
  max-height: 400px;
  overflow: hidden;
`;

const CoverImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
`;

const CoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent 60%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px 32px;
`;

const OverlayTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  margin: 0;
`;

const MetaScore = styled.span`
  margin-top: 8px;
  background-color: ${({ score }) =>
    score >= 75 ? "#4CAF50" : score >= 50 ? "#FFC107" : "#F44336"};
  color: white;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 14px;
  display: inline-block;
  width: fit-content;
`;

const Content = styled.div`
  padding: 32px;
`;

const Info = styled.div`
  font-size: 14px;
  color: #ccc;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
`;

const Section = styled.div`
  margin-top: 32px;
`;

const ScreenshotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

const Screenshot = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const Description = styled.div`
  line-height: 1.7;
  color: #ddd;
  font-size: 15px;
`;

const Platforms = styled.div`
  display: flex;
  gap: 12px;
  color: #aaa;
  font-size: 18px;
`;

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);

  useEffect(() => {
    const getDetails = async () => {
      const data = await fetchGameDetail(id);
      setGame(data);
      const shots = await fetchGameScreenshots(id);
      setScreenshots(shots);
    };
    getDetails();
  }, [id]);

  const renderPlatformIcons = () => {
    const slugs = game?.parent_platforms?.map((p) => p.platform.slug) || [];
    return (
      <Platforms>
        {slugs.includes("pc") && <FaWindows />}
        {slugs.includes("playstation") && <FaPlaystation />}
        {slugs.includes("xbox") && <FaXbox />}
        {slugs.includes("mac") && <FaApple />}
        {slugs.includes("android") && <FaAndroid />}
      </Platforms>
    );
  };

  const getStoreIcon = (storeName) => {
    const name = storeName.toLowerCase();
    if (name.includes("steam")) return <FaSteam />;
    if (name.includes("epic")) return <SiEpicgames />;
    if (name.includes("gog")) return <SiGogdotcom />;
    if (name.includes("xbox")) return <FaXbox />;
    if (name.includes("playstation")) return <FaPlaystation />;
    if (name.includes("nintendo")) return <SiNintendo />;
    return "🛒";
  };

  if (!game) return <Container>Yükleniyor...</Container>;

  return (
    <Container>
      <CoverWrapper>
        <CoverImage src={game.background_image} alt={game.name} />
        <CoverOverlay>
          <OverlayTitle>{game.name}</OverlayTitle>
          {game.metacritic && <MetaScore score={game.metacritic}>Metacritic: {game.metacritic}</MetaScore>}
        </CoverOverlay>
      </CoverWrapper>

      <Content>
        <Info>
          <div>
            <strong>Geliştirici:</strong>{" "}
            {game.developers?.map((dev) => dev.name).join(", ")}
          </div>
          <div>
            <strong>Yayıncı:</strong>{" "}
            {game.publishers?.map((pub) => pub.name).join(", ")}
          </div>
          <div>
            <strong>Çıkış Tarihi:</strong> {game.released}
          </div>
        </Info>

        {renderPlatformIcons()}

        <Section>
          <h2>Ekran Görüntüleri</h2>
          <ScreenshotsGrid>
            {screenshots.map((ss) => (
              <Screenshot key={ss.id} src={ss.image} alt="screenshot" />
            ))}
          </ScreenshotsGrid>
        </Section>

        <Section>
          <h2>Açıklama</h2>
          <Description dangerouslySetInnerHTML={{ __html: game.description }} />
        </Section>

        {game.platforms?.some((p) => p.requirements) && (
          <Section>
            <h2>Sistem Gereksinimleri</h2>
            {game.platforms.map(
              (p) =>
                p.requirements && (
                  <div key={p.platform.id}>
                    <strong>{p.platform.name}</strong>
                    <pre style={{ color: "#aaa", marginTop: "4px" }}>
                      {p.requirements.recommended ||
                        p.requirements.minimum ||
                        "Bilgi yok"}
                    </pre>
                  </div>
                )
            )}
          </Section>
        )}

        {game.stores?.length > 0 && (
          <Section>
            <h2>Satın Alınabilecek Platformlar</h2>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {game.stores.map((store) => (
                <a
                  key={store.id}
                  href={`https://${store.store.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={store.store.name}
                  style={{
                    color: "#84bfff",
                    fontSize: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                    borderRadius: "8px",
                    background: "#2e2e2e",
                    textDecoration: "none",
                  }}
                >
                  {getStoreIcon(store.store.name)}
                </a>
              ))}
            </div>
          </Section>
        )}
      </Content>
    </Container>
  );
};

export default GameDetail;
