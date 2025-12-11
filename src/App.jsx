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

  const types = ["grass", "poison", "fire"];

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

  const filteredPokemons = pokemons.filter((pokemon) => {
    return (
      pokemon.name.toLowerCase().includes(searchPokemon.toLowerCase()) &&
      (selectedType.length === 0 ||
        pokemon.types.some((t) => selectedType.includes(t.type.name)))
    );
  });

  return (
    <>
      <div className="container" style={{ margin: "80px" }}>
        <PokemonFilters
          searchPokemon={searchPokemon}
          onSearchChange={handleFilterPokemon}
          types={types}
          onClear={handleClearFilters}
          onTypeClick={handleTypeClick}
          setSelectedType={setSelectedType}
        />
        <div
          className="main-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          {loading && <h1>Loading...</h1>}
          {error && <h1>{error}</h1>}

          <PokemonList pokemons={filteredPokemons} />
        </div>
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
