import { useState, useEffect } from "react";

function App() {
  // fetch de la api de pokemon

  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchPokemon, setSearchPokemon] = useState("");
  const [selectedType, setSelectedType] = useState([]);

  const types = ["grass", "poison", "fire"];
  console.log(selectedType);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch("https://pokeapi.co/api/v2/pokemon");
      if (!res.ok) throw new Error("Data not founded");
      const data = await res.json();

      //detalles de los pokemons

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return res.json();
        })
      );

      setPokemons(pokemonDetails);
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
  }, []);

  const filteredPokemons = pokemons.filter((pokemon) => {
    return (
      pokemon.name.toLowerCase().includes(searchPokemon.toLowerCase()) &&
      (selectedType.length === 0 ||
        pokemon.types.some((t) => selectedType.includes(t.type.name)))
    );
  });

  console.log(filteredPokemons);

  return (
    <>
      <div className="container" style={{ margin: "80px" }}>
        <div className="header">
          <input
            type="text"
            placeholder="Search Pokemon by name..."
            style={{ marginBottom: "30px", width: "500px", height: "30px" }}
            value={searchPokemon}
            onChange={handleFilterPokemon}
          />
          <button onClick={() => handleClearFilters()}>Clear filters</button>
          {types.map((type) => {
            return (
              <button
                key={type}
                style={{ border: "1px solid black", borderRadius: "15%" }}
                //onClick={() => setSelectedType(type)}
                onClick={() => handleTypeClick(type)}
              >
                {type}
              </button>
            );
          })}
          <button onClick={() => setSelectedType([])}>All</button>
        </div>
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

          {filteredPokemons.map((pokemon) => (
            <div
              key={pokemon.id}
              style={{
                border: "2px solid black",
                textAlign: "center",
                padding: "10px",
              }}
            >
              <img
                src={
                  pokemon.sprites.other["official-artwork"].front_default ||
                  pokemon.sprites.other.dream_world.front_default
                }
                alt={pokemon.name}
                style={{ width: "150px", height: "150px", padding: "5px" }}
              />
              <div>
                <span>{`#${String(pokemon.id).padStart(3, 0)}`}</span>
              </div>
              <h2>{pokemon?.name}</h2>

              <div>
                {pokemon.types.map((t) => (
                  <span key={t.type.name}>{t.type.name} </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
