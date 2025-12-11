function PokemonCard({ pokemon }) {
  const image =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.other.dream_world.front_default ||
    pokemon.sprites.other.home.front_default ||
    pokemon.sprites.front_default;
  return (
    <div
      style={{
        border: "2px solid black",
        textAlign: "center",
        padding: "10px",
      }}
    >
      <img
        src={image}
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
  );
}

export default PokemonCard;
