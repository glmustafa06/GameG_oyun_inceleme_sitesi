// src/components/GameCard.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaWindows, FaPlaystation, FaXbox, FaApple, FaAndroid } from 'react-icons/fa';
import { fetchGameScreenshots } from '../api/rawg';

const Card = styled.div`
  background: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  transition: transform 0.3s ease;
  position: relative;
  width: 100%;
  cursor: pointer;
  z-index: 1;
  transform-origin: center;

  &:hover {
    transform: scale(1.03);
    z-index: 10;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 230px;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
`;

const Cover = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const Screenshot = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 2;
  pointer-events: none;
  transition: opacity 0.5s ease;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const ScreenshotDots = styled.div`
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  display: none;
  justify-content: center;
  gap: 6px;
  z-index: 3;

  ${Card}:hover & {
    display: flex;
  }
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => (props.$active ? '#fff' : '#666')};
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const Info = styled.div`
  background: #1e1e1e;
  padding: 16px;
`;

const Title = styled.h3`
  font-size: 18px;
  color: white;
  margin: 0 0 8px;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Platforms = styled.div`
  display: flex;
  gap: 8px;
  color: #aaa;
  font-size: 14px;
`;

const SubMeta = styled.div`
  font-size: 13px;
  color: #ccc;
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const HoverDetail = styled.div`
  background: #1e1e1e;
  border-radius: 0 0 12px 12px;
  padding: 16px;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 15;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
  transition: transform 0.25s ease, opacity 0.25s ease;
  border-top: 1px solid #2e2e2e;

  ${Card}:hover & {
    transform: scaleY(1);
    opacity: 1;
  }
`;

const Label = styled.span`
  font-weight: bold;
  color: #999;
  margin-right: 6px;
`;

const Chart = styled.div`
  color: #84bfff;
  cursor: pointer;
`;

const GameCard = ({ game }) => {
  const [screenshots, setScreenshots] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getScreenshot = async () => {
      const data = await fetchGameScreenshots(game.id);
      setScreenshots(data.slice(0, 7));
    };
    getScreenshot();
  }, [game.id]);

  const handleClick = () => {
    navigate(`/game/${game.id}`);
  };

  const renderPlatformIcons = () => {
    const slugs = game.parent_platforms?.map(p => p.platform.slug) || [];
    return (
      <Platforms>
        {slugs.includes('pc') && <FaWindows />}
        {slugs.includes('playstation') && <FaPlaystation />}
        {slugs.includes('xbox') && <FaXbox />}
        {slugs.includes('mac') && <FaApple />}
        {slugs.includes('android') && <FaAndroid />}
      </Platforms>
    );
  };

  const renderGenres = () => game.genres?.map(g => g.name).join(', ');

  return (
    <Card onClick={handleClick}>
      <ImageContainer>
        <Cover src={game.background_image} alt={game.name} />
        {screenshots.length > 0 && (
          <Screenshot src={screenshots[activeIndex]?.image} alt={`${game.name} screenshot`} />
        )}
        {screenshots.length > 1 && (
          <ScreenshotDots>
            {screenshots.map((_, i) => (
              <Dot key={i} $active={i === activeIndex} onMouseEnter={() => setActiveIndex(i)} />
            ))}
          </ScreenshotDots>
        )}
      </ImageContainer>

      <Info>
        <Meta>
          {renderPlatformIcons()}
        </Meta>
        <Title>{game.name}</Title>
        <SubMeta>
          <span>➕ {game.ratings_count?.toLocaleString('tr-TR')}</span>
          <span>📅</span>
          <span>⋯</span>
        </SubMeta>
      </Info>

      <HoverDetail>
        <div><Label>Çıkış Tarihi:</Label> {game.released}</div>
        <div><Label>Türler:</Label> {renderGenres()}</div>
        <div><Label>Chart:</Label> <Chart>#1 Top {new Date(game.released).getFullYear()}</Chart></div>
      </HoverDetail>
    </Card>
  );
};

export default GameCard;
