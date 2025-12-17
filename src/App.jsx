import Pagination from "./components/Pagination";
import PokemonList from "./components/PokemonList";
import PokemonFilters from "./components/PokemonFilters";
import PokemonModal from "./components/PokemonModal";
import Header from "./components/Header";
import { useState, useEffect } from "react";

function App() {
  // fetch de la api de pokemon

  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const [searchPokemon, setSearchPokemon] = useState("");
  const [selectedType, setSelectedType] = useState([]);
  const [allPokemons, setAllPokemons] = useState([]);

  const [types, setTypes] = useState([]);

  //paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);

  //modal

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);

  const [evolutionData, setEvolutionData] = useState(null);

  const [visiblePokemons, setVisiblePokemons] = useState([]);

  //data for types of pokemon
  async function fetchPokemonTypes() {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/type");
      if (!res.ok) throw new Error("Types not founded");
      const dataTypes = await res.json();

      const pokemonTypes = dataTypes.results
        .map((type) => type.name)
        .filter((t) => t !== "unknown" && t !== "shadow");

      setTypes(pokemonTypes);
    } catch (error) {
      setError(error.message);
    }
  }

  //data for modal...additional info about pokemon
  async function fetchSpeciesData() {
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${selectedPokemon.name}`
      );
      if (!res.ok) throw new Error("Species data not founded");

      const data = await res.json();
      setSpeciesData(data);
    } catch (error) {
      setError(error.message);
    }
  }

  //Data for evolutional chain

  async function fetchEvolutionData(chainUrl) {
    try {
      const res = await fetch(chainUrl);
      if (!res.ok) throw new Error("Evolution data not founded");

      const data = await res.json();
      setEvolutionData(data);
    } catch (error) {
      setError(error.message);
    }
  }

  //Fetch many pokemons for filter
  // async function FetchAllPokemons() {
  //   try {
  //     setError(null);
  //     const res = await fetch(
  //       "https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0"
  //     );
  //     if (!res.ok) throw new Error("Data of all pokemon not founded");

  //     const allPokemon = await res.json();

  //     setAllPokemons(allPokemon.results);
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // }
  async function fetchPokemonListByType(type) {
    setError(null);
    setCurrentPage(1);

    try {
      let results = [];

      if (!type) {
        // ALL
        const res = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0"
        );
        const data = await res.json();
        results = data.results;
      } else {
        // BY TYPE
        const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        const data = await res.json();

        results = data.pokemon.map((p) => ({
          name: p.pokemon.name,
          url: p.pokemon.url,
        }));
      }

      setAllPokemons(results);
    } catch (e) {
      setError(e.message);
    }
  }

  function handleFilterPokemon(e) {
    setSearchPokemon(e.target.value);
  }

  function handleTypeClick(type) {
    const newTypes = selectedType.includes(type) ? [] : [type];

    setSelectedType(newTypes);
    fetchPokemonListByType(newTypes[0]);
  }

  function handleClearFilters() {
    setSearchPokemon("");
    setSelectedType([]);
    fetchPokemonListByType(null);
  }

  function handleOpenModal(pokemon) {
    setError(null);
    setSpeciesData(null);
    setEvolutionData(null);
    setIsModalOpen(true);
    setSelectedPokemon(pokemon);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedPokemon(null);
    setSpeciesData(null);
    setEvolutionData(null);
    setError(null);
  }

  const filteredPokemons = allPokemons.filter((pokemon) => {
    const matchName = pokemon.name
      .toLowerCase()
      .includes(searchPokemon.toLowerCase());
    // const matchType =
    //   selectedType.length === 0 ||
    //   pokemon.types.some((t) => selectedType.includes(t.type.name));
    return matchName; // && matchType;
  });

  const totalPages = Math.ceil(filteredPokemons.length / limit);

  const paginatedPokemons = filteredPokemons.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  useEffect(() => {
    fetchPokemonTypes();
  }, []);

  useEffect(() => {
    if (!selectedPokemon) return;
    setSpeciesData(null);
    fetchSpeciesData();
  }, [selectedPokemon]);

  useEffect(() => {
    if (!speciesData) return;
    fetchEvolutionData(speciesData.evolution_chain.url);
  }, [speciesData]);

  useEffect(() => {
    fetchPokemonListByType();
  }, []);

  useEffect(() => {
    if (paginatedPokemons.length === 0) return;

    let cancelled = false;

    async function fetchDetails() {
      try {
        setLoadingDetails(true);

        const details = await Promise.all(
          paginatedPokemons.map((p) => fetch(p.url).then((res) => res.json()))
        );

        if (!cancelled) setVisiblePokemons(details);
      } finally {
        if (!cancelled) setLoadingDetails(false);
      }
    }

    fetchDetails();

    return () => {
      cancelled = true;
    };
  }, [paginatedPokemons]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-100 px-6 py-10">
        <PokemonFilters
          searchPokemon={searchPokemon}
          onSearchChange={handleFilterPokemon}
          types={types}
          onClear={handleClearFilters}
          onTypeClick={handleTypeClick}
          selectedType={selectedType}
        />

        {loadingDetails && visiblePokemons.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            Loading Pokémon...
          </div>
        )}

        {error && <h1>{error}</h1>}

        <PokemonList pokemons={visiblePokemons} openModal={handleOpenModal} />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChangePage={setCurrentPage}
          />
        )}
      </div>
      {isModalOpen && selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={handleCloseModal}
          speciesData={speciesData}
          evolutionData={evolutionData}
        />
      )}
    </>
  );
}

export default App;
