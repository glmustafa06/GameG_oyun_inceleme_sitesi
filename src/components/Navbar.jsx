// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FaSearch, FaGamepad } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { fetchSearchResults } from "../api/rawg";

const NavbarContainer = styled.nav`
  background-color: #1c1c1e;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 24px;

  a {
    font-size: 14px;
    color: #ccc;
    text-decoration: none;
    transition: color 0.2s;
    position: relative;
    padding: 6px 4px;

    &.active {
      color: white;
      font-weight: bold;
    }

    &:hover {
      color: white;
    }

    &.active::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 100%;
      height: 2px;
      background-color: white;
    }
  }
`;

const Center = styled.div`
  position: relative;
  width: 30%;
`;

const SearchBox = styled.input`
  background-color: #2b2b2b;
  border: none;
  padding: 10px 16px 10px 36px;
  border-radius: 8px;
  width: 100%;
  color: white;
  font-size: 14px;

  &:focus {
    outline: none;
    background-color: #333;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #888;
`;

const ResultsContainer = styled.ul`
  position: absolute;
  top: 48px;
  width: 100%;
  background-color: #1c1c1e;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 999;
`;

const ResultItem = styled.li`
  padding: 10px;
  color: #ccc;
  border-bottom: 1px solid #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background-color: #2a2a2a;
    color: white;
  }

  img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 12px;

  button {
    background-color: transparent;
    border: 1px solid #444;
    color: #ccc;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      color: white;
      border-color: white;
    }
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (searchTerm.length < 2) return setResults([]);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      const data = await fetchSearchResults(searchTerm);
      setResults(data);
    }, 400);
  }, [searchTerm]);

  const handleSelectGame = (game) => {
    navigate(`/game/${game.id}`);
    setSearchTerm("");
    setResults([]);
  };

  return (
    <NavbarContainer>
      <Left>
        <Logo onClick={() => navigate("/")}> <FaGamepad /> GameG </Logo>
        <NavLinks>
          <NavLink to="/" end>Ana Sayfa</NavLink>
          <NavLink to="/populer">Popüler</NavLink>
          <NavLink to="/yeni">Yeni Çıkanlar</NavLink>
          <NavLink to="/kesfet">Keşfet</NavLink>
          <NavLink to="/upcoming">Yakında Çıkacaklar</NavLink>
        </NavLinks>
      </Left>

      <Center>
        <SearchBox
          type="text"
          placeholder="Oyun ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchIcon />
        {results.length > 0 && (
          <ResultsContainer>
            {results.map((game) => (
              <ResultItem key={game.id} onClick={() => handleSelectGame(game)}>
                {game.background_image && <img src={game.background_image} alt={game.name} />}
                <span>{game.name}</span>
              </ResultItem>
            ))}
          </ResultsContainer>
        )}
      </Center>
    </NavbarContainer>
  );
};

export default Navbar;
