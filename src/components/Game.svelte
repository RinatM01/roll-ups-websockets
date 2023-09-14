<script>
	export let clientId;
	export let game;
	export let progressGame;

	let prompt = '';
	const qs = [
		'Who or What?',
		'With whom or what?',
		'How?(adverb)',
		'Did what?',
		'Where?',
		'When?',
		'What happened after?',
	];
	const checkReady = (game) => {
		const clients = game.clients;
		for (const c in clients) {
			if (!clients[c].readiness) {
				return false;
			}
		}
		return true;
	};
</script>

<div
	class="flex flex-col font-semibold justify-centerpx-3 mb-3 text-center outline-none py-2 text-xl bg-[#D4E2D4] rounded-xl"
>
	<h3 class="text-sm text-gray-600">Question:</h3>
	<span class="">{qs[game.stage - 1]}</span>
</div>
<div class="flex flex-col">
	<input
		class="px-4 py-2 rounded-xl text-2xl mb-3"
		type="text"
		disabled={game.clients[clientId].readiness}
		placeholder={`${
			game.clients[clientId].readiness
				? 'Waiting for others...'
				: 'Your answer'
		}`}
		bind:value={prompt}
	/>
	<button
		disabled={game.clients[clientId].readiness || prompt == ''}
		class="px-3 text-center outline-none py-2 text-xl text-white font-semibold
         bg-[#DF7861] rounded-xl
         disabled:bg-[#d4c8bf] disabled:text-gray-100"
		on:click={() => {
			progressGame(game.stage + 1, prompt);
			prompt = '';
		}}
	>
		Submit
	</button>
</div>
