import Pagination from "./components/Pagination";
import PokemonList from "./components/PokemonList";
import PokemonFilters from "./components/PokemonFilters";
import { useState, useEffect } from "react";

function App() {
  // fetch de la api de pokemon

  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchPokemon, setSearchPokemon] = useState("");
  const [selectedType, setSelectedType] = useState([]);

  const [types, setTypes] = useState([]);

  //paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(20);
  const offset = (currentPage - 1) * limit;

  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      if (!res.ok) throw new Error("Data not founded");
      const data = await res.json();

      const totalPagesCalculadas = Math.ceil(data.count / limit);

      //detalles de los pokemons

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return res.json();
        })
      );

      setPokemons(pokemonDetails);
      setTotalPages(totalPagesCalculadas);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

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

  function handleFilterPokemon(e) {
    setSearchPokemon(e.target.value);
  }

  function handleTypeClick(type) {
    if (selectedType.includes(type)) {
      setSelectedType(selectedType.filter((t) => t !== type));
    } else {
      setSelectedType([...selectedType, type]);
    }
  }
  function handleClearFilters() {
    setSearchPokemon("");
    setSelectedType([]);
  }

  useEffect(() => {
    fetchData();
  }, [currentPage, limit]);

  useEffect(() => {
    fetchPokemonTypes();
  }, []);

  const filteredPokemons = pokemons.filter((pokemon) => {
    return (
      pokemon.name.toLowerCase().includes(searchPokemon.toLowerCase()) &&
      (selectedType.length === 0 ||
        pokemon.types.some((t) => selectedType.includes(t.type.name)))
    );
  });

  return (
    <>
      <div className="min-h-screen bg-slate-100 px-6 py-10">
        <PokemonFilters
          searchPokemon={searchPokemon}
          onSearchChange={handleFilterPokemon}
          types={types}
          onClear={handleClearFilters}
          onTypeClick={handleTypeClick}
          selectedType={selectedType}
        />

        {loading && <h1>Loading...</h1>}
        {error && <h1>{error}</h1>}

        <PokemonList pokemons={filteredPokemons} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChangePage={setCurrentPage}
        />
      </div>
    </>
  );
}

export default App;
