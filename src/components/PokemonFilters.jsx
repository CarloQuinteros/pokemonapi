import { typeColors } from "../utils/typeColors";
function PokemonFilters({
  searchPokemon,
  onSearchChange,
  types,
  onClear,
  onTypeClick,

  selectedType,
}) {
  return (
    <div className="flex flex-col items-center gap-6 mb-10">
      <input
        type="text"
        placeholder="Search Pokemon by name..."
        className="w-full max-w-lg px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchPokemon}
        onChange={onSearchChange}
      />
      <div className="flex flex-wrap justify-center gap-3">
        {types.map((type) => {
          const colorClass = typeColors[type] || "bg-gray-300 text-black";
          const inactiveType = `hover:brightness-110 hover:scale-105`;
          const activeType = `ring-2 ring-black shadow-md scale-105`;

          return (
            <button
              key={type}
              className={`px-4 py-1 rounded-full text-sm font-medium capitalize ${
                colorClass.bg
              } transition-all duration-200 ${
                selectedType.includes(type) ? activeType : inactiveType
              }`}
              onClick={() => onTypeClick(type)}
            >
              {type}
            </button>
          );
        })}
        <button onClick={() => onClear()}>All</button>
      </div>
    </div>
  );
}

export default PokemonFilters;
