import Item from "./Item.jsx";

export default function PokemonStats({ data, canEvolve }) {
  if (!data) return null;

  console.log(data);

  return (
    <div className="PokeStats">
      <Item label="Height" value={`${data.height / 10} m`} />
      <Item label="Weight" value={`${data.weight} g`} />
      <Item
        label="Type(s)"
        value={data.types.map((t) => t.type.name).join("/")}
      />

      <Item
        label="HP"
        value={data.stats.find((s) => s.stat.name === "hp")?.base_stat}
      />
      <Item
        label="Attack"
        value={data.stats.find((s) => s.stat.name === "attack")?.base_stat}
      />
      <Item
        label="Defense"
        value={data.stats.find((s) => s.stat.name === "defense")?.base_stat}
      />
      <Item
        label="Sp. Attack"
        value={
          data.stats.find((s) => s.stat.name === "special-attack")?.base_stat
        }
      />
      <Item
        label="Sp. Defense"
        value={
          data.stats.find((s) => s.stat.name === "special-defense")?.base_stat
        }
      />
      <Item
        label="Speed"
        value={data.stats.find((s) => s.stat.name === "speed")?.base_stat}
      />

      <Item label="Evolves" value={canEvolve ? "Yes" : "No"} />
    </div>
  );
}
