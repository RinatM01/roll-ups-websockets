<script>
	export let isWrongRoom;
	export let clientId;
	export let game;
	export let submitCreate;
	export let submitJoin;
	export let progressGame;
	export let toggleReady;
	export let gameId;
	export let userName;
	let isUser = false;
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

<h1 class="text-2xl mb-2">
	{isUser ? `Hi ${userName}!` : "What's your nickname?"}
</h1>
{#if !isUser}
	<form
		on:submit={() => {
			isUser = true;
		}}
		class="flex flex-col"
	>
		<input
			class="px-4 py-2 rounded-xl text-2xl mb-3"
			type="text"
			bind:value={userName}
		/>
		<button
			class="px-3 outline-none py-2 text-xl text-white font-semibold bg-[#DF7861] rounded-xl"
			>Next!</button
		>
	</form>
{:else if game}
	<div>
		<div class="flex flex-col">
			<h2 class="text-lg">Share this game code with friends:</h2>
			<div
				class="px-3 text-center outline-none py-2 text-xl text-white font-semibold bg-[#DF7861] rounded-xl"
			>
				{game.id}
			</div>
		</div>

		<h3 class="text-2xl bg-[#]">Current players:</h3>
		<ul>
			{#each Object.entries(game.clients) as [clientId, client]}
				<li
					class={`text-xl ${
						client.readiness ? 'bg-[#D4E2D4]' : 'bg-[#ECB390]'
					}  rounded-md my-1 px-2 py-1`}
				>
					{client.userName}
					<span>{client.readiness ? '👌' : '🤚'}</span>
				</li>
			{/each}
		</ul>
		{#if Object.keys(game.clients).length > 1}
			{#if game.clients[clientId].role == 'leader'}
				<button
					disabled={!checkReady(game) &&
						Object.keys(game.clients).length > 1}
					class="w-full px-3 text-center outline-none py-2 text-xl
					text-white font-semibold bg-[#DF7861]
					rounded-xl disabled:bg-[#d4c8bf] disabled:text-gray-100"
					on:click={() => {
						progressGame(1);
					}}
					>{!checkReady(game) && Object.keys(game.clients).length > 1
						? 'Waiting for players...'
						: 'Start Game'}</button
				>
			{:else}
				<button
					class="w-full text-center px-3 outline-none py-2 text-xl text-white font-semibold
				bg-[#DF7861] rounded-xl"
					on:click={toggleReady}
					>{game.clients[clientId].readiness
						? 'Wait a bit!'
						: 'Ready!'}</button
				>
			{/if}
		{/if}
	</div>
{:else}
	<div class="flex flex-col justify-center">
		<div class="flex flex-col">
			<input
				class="px-4 py-2 rounded-xl text-2xl mb-3 flex-1"
				type="text"
				placeholder={!isWrongRoom
					? 'Wrong room code. Try again'
					: 'Game Code'}
				bind:value={gameId}
			/>
			<button
				class="px-3 outline-none py-2 text-xl text-white font-semibold bg-[#DF7861] rounded-xl"
				disabled={!clientId || !userName}
				on:click={submitJoin}>Join Game</button
			>
		</div>

		<span class="py-3 text-center text-xl text-[#DF7861] font-bold">
			-OR-
		</span>
		<button
			class="px-3 outline-none py-2 text-xl text-white font-semibold bg-[#DF7861] rounded-xl"
			disabled={!clientId || game || !userName}
			on:click={submitCreate}>Create game</button
		>
	</div>
{/if}
