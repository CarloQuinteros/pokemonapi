import PokemonCard from "./PokemonCard";
function PokemonList({ pokemons }) {
  return (
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
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
}

export default PokemonList;
