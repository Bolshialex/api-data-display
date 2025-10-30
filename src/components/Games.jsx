export default function Games({ games }) {
  if (!games) return null;

  // Collect all unique games in this Pokémon’s data
  const pokemonGames = new Set(games.map((g) => g.version.name));

  // Sort alphabetically for display
  const allGames = Array.from(pokemonGames).sort();

  // ‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️
  // NOT WORKING ATM!!! Should be highlighting in green if the pokemon is in that game but right now is not doing that :(

  return (
    <div>
      <div className="gamesTitle">
        <h4>Appears in these games:</h4>
      </div>
      <div className="Games">
        <ul>
          {allGames.map((game, i) => (
            <li key={i} className="gameBox active">
              {game}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
