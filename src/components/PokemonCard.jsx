import { typeColors } from "../utils/typeColors";
function PokemonCard({ pokemon }) {
  const image =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.other.dream_world.front_default ||
    pokemon.sprites.other.home.front_default ||
    pokemon.sprites.front_default;
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl hover:scale-105 transition cursor-pointer flex flex-col items-center text-center">
      <img src={image} alt={pokemon.name} className="w-36 h-36 mx-auto mb-2" />
      <div>
        <span className="text-sm text-slate-400 font-mono mb-1">{`#${String(
          pokemon.id
        ).padStart(3, 0)}`}</span>
      </div>
      <h2 className="text-lg font-bold capitalize text-slate-800 mb-2">
        {pokemon?.name}
      </h2>

      <div className="flex gap-2 justify-center">
        {pokemon.types.map((t) => {
          const typeName = t.type.name;
          const colorClass = typeColors[typeName] || "bg-gray-300 text-black";
          return (
            <span
              key={typeName}
              className={`px-3 py-1 text-xs rounded-full capitalize ${colorClass}`}
            >
              {typeName}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default PokemonCard;
