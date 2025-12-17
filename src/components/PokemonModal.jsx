import { typeColors } from "../utils/typeColors";
import { useEffect } from "react";

function PokemonModal({ pokemon, onClose, speciesData, evolutionData }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  if (!pokemon) return null;

  if (!speciesData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg z-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const image =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default ||
    "/pokeball.png";

  const pokemonEntry = speciesData.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );

  const pokeonDescription = pokemonEntry
    ? pokemonEntry.flavor_text.replace(/\f|\n/g, " ")
    : "No description available";

  const mainType = pokemon.types[0].type.name;
  const colors = typeColors[mainType] || {
    bg: "bg-gray-400",
    text: "text-gray-600",
    badge: "bg-gray-400 text-white",
    bar: "bg-gray-400",
  };

  function getEvolutionChain(chain) {
    const evolutions = [];
    let current = chain;

    while (current) {
      const urlParts = current.species.url.split("/").filter(Boolean);
      const id = urlParts[urlParts.length - 1];

      evolutions.push({
        name: current.species.name,
        id,
      });

      current = current.evolves_to[0];
    }

    return evolutions;
  }

  const evolutionChain = evolutionData?.chain
    ? getEvolutionChain(evolutionData.chain)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl w-full max-w-5xl z-10 
      transform transition-all duration-300 scale-95 opacity-0 animate-modal
       grid grid-cols-1 md:grid-cols-2 max-h-[90svh] overflow-y-auto md:overflow-hidden overscroll-contain"
      >
        <button
          onClick={onClose}
          className="fixed md:absolute top-4 right-4 z-50"
        >
          ✕
        </button>

        <div className={`flex items-center justify-center ${colors.bg} `}>
          <div className="bg-white/80 rounded-2xl p-6 shadow-inner">
            <img
              src={image}
              alt={pokemon.name}
              className="w-32 h-32 md:w-48 md:h-48 object-contain"
            />
          </div>
        </div>
        <div className="p-4 md:p-6 space-y-3 md:space-y-4 md:overflow-y-auto">
          <h1 className="text-2xl font-bold capitalize mt-4">{pokemon.name}</h1>
          <div className="flex gap-2">
            <span className="text-md text-slate-400 font-mono mb-1">{`#${String(
              pokemon.id
            ).padStart(3, 0)}`}</span>

            {pokemon.types.map((t) => {
              const typeName = t.type.name;
              const colorClass =
                typeColors[typeName] || "bg-gray-300 text-black";

              return (
                <span
                  key={typeName}
                  className={`px-3 py-1 text-sm rounded-full capitalize ${colorClass.bg}`}
                >
                  {typeName}
                </span>
              );
            })}
          </div>
          <h3 className={`font-semibold ${colors.text}`}>Description</h3>

          <p>{pokeonDescription}</p>

          <h3 className={`font-semibold ${colors.text}`}>Abilities</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {pokemon?.abilities?.map((a) => (
              <span
                key={a?.ability?.name}
                className="px-3 py-1 text-sm rounded-full bg-slate-100 border capitalize"
              >
                {a?.ability?.name}
                {a.is_hidden && " (Hidden)"}
              </span>
            ))}
          </div>

          <div className="w-full mt-4">
            <h3 className={`font-semibold ${colors.text} mb-2`}>Stats</h3>
            {pokemon?.stats?.map((p) => {
              const statName = p.stat.name;
              const percentage = Math.round((p.base_stat / 150) * 100);
              return (
                <div key={statName} className="flex items-center gap-3">
                  <span className="w-28 text-sm capitalize">
                    {statName.replace("-", " ")}{" "}
                  </span>
                  <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 transition-all ${colors.bar}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-sm font-semibold  text-right">
                    {percentage}
                  </span>
                </div>
              );
            })}
          </div>
          <h3 className={`font-semibold ${colors.text}`}>Evolution Chain</h3>
          {!evolutionData ? (
            <div className="text-sm text-slate-400">Loading Evolution</div>
          ) : (
            <div className="flex items-center gap-6 mt-3">
              {evolutionChain.map((poke, index) => (
                <div key={poke.id} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`}
                      alt={poke.name}
                      className="w-20 h-20 object-contain"
                    />
                    <span className="capitalize text-sm font-medium">
                      {poke.name}
                    </span>
                  </div>

                  {index < evolutionChain.length - 1 && (
                    <span className="text-xl">→</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PokemonModal;
