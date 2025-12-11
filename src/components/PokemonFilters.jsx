function PokemonFilters({
  searchPokemon,
  onSearchChange,
  types,
  onClear,
  onTypeClick,
  setSelectedType,
}) {
  return (
    <div className="header">
      <input
        type="text"
        placeholder="Search Pokemon by name..."
        style={{ marginBottom: "30px", width: "500px", height: "30px" }}
        value={searchPokemon}
        onChange={onSearchChange}
      />
      <button onClick={() => onClear()}>Clear filters</button>
      {types.map((type) => {
        return (
          <button
            key={type}
            style={{ border: "1px solid black", borderRadius: "15%" }}
            onClick={() => onTypeClick(type)}
          >
            {type}
          </button>
        );
      })}
      <button onClick={() => setSelectedType([])}>All</button>
    </div>
  );
}

export default PokemonFilters;
