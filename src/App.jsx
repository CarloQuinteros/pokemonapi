import { useState, useEffect } from "react";

function App() {
  // fetch de la api de pokemon

  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="container" style={{ margin: "80px" }}>
        <div className="header"></div>
        <div
          className="main-container"
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            gap: "15px",

            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          {loading && <h1>Loading...</h1>}
          {error && <h1>{error}</h1>}

          {pokemons.map((pokemon) => (
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
