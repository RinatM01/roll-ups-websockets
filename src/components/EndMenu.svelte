<script>
	export let clientId;
	export let game;
	export let progressGame;
</script>

<h2
	class="text-center outline-none py-2 text-2xl bg-[#D4E2D4] rounded-xl font-semibold"
>
	Read your roll to your friends!
</h2>
<div
	class="flex flex-col justify-center bg-[#FCDDB0] rounded-xl my-2"
>
	{#each game.rolls[game.clients[clientId].order] as word}
		<div class="text-center text-xl even:bg-[#FFFAD7] py-1">
			{word}
		</div>
	{/each}
</div>
<button
	class="w-full px-3 text-center outline-none py-2 text-xl text-white font-semibold
         bg-[#DF7861] rounded-xl disabled:bg-[#d4c8bf] disabled:text-gray-100"
	disabled={game.clients[clientId].readiness}
	on:click={() => {
		progressGame(9, null);
	}}
	>{game.clients[clientId].readiness
		? 'Waiting for players...'
		: 'Play Again!'}
</button>
