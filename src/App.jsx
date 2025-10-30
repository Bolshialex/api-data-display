import { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Moves from "./components/Moves.jsx";
import Games from "./components/Games.jsx";
import PokemonStats from "./components/PokemonStats.jsx";

export default function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState("");

  // Evolution state
  const [canEvolve, setCanEvolve] = useState(null);
  const [evolvesInto, setEvolvesInto] = useState(null); // ✅ new state

  // Sprite flip state
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
        );
        if (!res.ok) throw new Error("Failed to fetch Pokémon list");
        const data = await res.json();
        setPokemonList(data.results);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchList();
  }, []);

  useEffect(() => {
    console.log(pokemonList);
    if (!pokemonList.length) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(pokemonList[currentIndex].url);
        if (!res.ok) throw new Error("Failed to fetch Pokémon data");
        const data = await res.json();
        setCurrentData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pokemonList, currentIndex]);

  useEffect(() => {
    if (!currentData) return;

    const fetchEvolution = async () => {
      try {
        const speciesRes = await fetch(currentData.species.url);
        const speciesData = await speciesRes.json();

        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        const findStage = (node, name) => {
          if (node.species.name === name) return node;
          for (let evo of node.evolves_to) {
            const found = findStage(evo, name);
            if (found) return found;
          }
          return null;
        };

        const stage = findStage(evoData.chain, currentData.name);
        const evolvesFromHere = stage && stage.evolves_to.length > 0;

        setCanEvolve(evolvesFromHere);

        if (evolvesFromHere) {
          setEvolvesInto(stage.evolves_to[0].species.name.toUpperCase());
        } else {
          setEvolvesInto(null);
        }
      } catch (err) {
        console.error("Evolution fetch failed", err);
        setCanEvolve(null);
        setEvolvesInto(null);
      }
    };

    fetchEvolution();
  }, [currentData]);

  const nextPokemon = () => {
    setShowBack(false);
    setCurrentIndex((prev) => (prev + 1) % pokemonList.length);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(formData);
  };

  function handleSubmit(e) {
    e.preventDefault();

    const fetchSinglePokemon = async () => {
      console.log(formData);
      try {
        for (let i = 0; i < pokemonList.length; i++) {
          if (pokemonList[i].name === formData.pokeName) {
            setCurrentIndex(i);
          }
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchSinglePokemon();
    console.log(pokemonList);
  }

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (loading || !currentData) return <p>Loading data...</p>;

  return (
    <div className="pokemon">
      <Header />
      <form onSubmit={handleSubmit}>
        <label htmlFor="pokeName">
          Pokemon Name:
          <input
            type="text"
            name="pokeName"
            id="pokeName"
            onChange={handleChange}
          />
        </label>

        <button>Find Pokemon</button>
      </form>

      <h2>{currentData.name.toUpperCase()}</h2>

      {canEvolve !== null &&
        (evolvesInto ? (
          <p>
            {currentData.name.toUpperCase()} evolves into {evolvesInto}
          </p>
        ) : (
          <p>{currentData.name.toUpperCase()} does not evolve</p>
        ))}

      <div className="sprites">
        <img
          src={
            showBack
              ? currentData.sprites.back_default
              : currentData.sprites.front_default
          }
          alt={currentData.name}
          style={{ width: "150px" }}
        />
        <img
          src={
            showBack
              ? currentData.sprites.back_shiny
              : currentData.sprites.front_shiny
          }
          alt={`${currentData.name} shiny`}
          style={{ width: "150px" }}
        />
      </div>

      <button onClick={() => setShowBack((prev) => !prev)}>Flip Sprite</button>
      <button onClick={nextPokemon}>Next Pokémon</button>

      <PokemonStats data={currentData} canEvolve={canEvolve} />
      <Games games={currentData.game_indices} />
      <h4>Moves:</h4>
      <Moves moves={currentData.moves} />

      <Footer />
    </div>
  );
}
