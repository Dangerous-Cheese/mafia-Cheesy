import { DEFAULT_CONFIG, loadGame, newGame } from '@mafia/engine';
import { DEFAULT_SEED, dummyActors, toActorInput } from '@mafia/engine/testing';

const run = () => {
	const actors = dummyActors(3);
	const config = DEFAULT_CONFIG; // Use the full default config to demonstrate tag fallback when there are more tags than actors
	const created = newGame({ actors, config, options: { seed: DEFAULT_SEED + 1 } });
	const loaded = loadGame({
		actors: created.actors.map(toActorInput),
		config,
		state: created.state,
		options: { seed: DEFAULT_SEED },
	});

	console.log('Loaded game actors:');
	for (const actor of loaded.actors) {
		console.log(JSON.stringify(actor, null, 2));
	}

	console.log('\nLoaded game state:');
	console.log(JSON.stringify(loaded.state, null, 2));

	console.log('\nEvents:');
	console.log(JSON.stringify(loaded.events, null, 2));

	console.log('\nWinners:');
	console.log(JSON.stringify(loaded.winners, null, 2));

	console.log('\nLog:');
	console.log(loaded.log.join('\n'));
};

run();
