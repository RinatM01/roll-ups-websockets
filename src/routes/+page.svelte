<script>
	import { io } from 'socket.io-client';
	import StartMenu from '../components/StartMenu.svelte';
	import Game from '../components/Game.svelte';
	import EndMenu from '../components/EndMenu.svelte';

	const socket = io();

	let clientId;
	let game;
	let gameId;
	let userName;
	let isWrongRoom = true;
	socket.on('connected', (receivedClientId) => {
		clientId = receivedClientId;
	});
	socket.on('updateGame', (updatedGame) => {
		game = updatedGame;
		gameId = game.id;
	});

	socket.on('doodoo', (reason) => {
		isWrongRoom = false;
		gameId = '';
	});

	socket.on('disconnect', (reason) => {
		window.location.reload();
	});

	const submitJoin = () => {
		console.log(gameId);
		socket.emit('join', { clientId, gameId, userName });
	};
	const submitCreate = () => {
		socket.emit('create', { clientId, userName });
	};
	const progressGame = (stage, prompt = null) => {
		socket.emit('progress', {
			clientId: clientId,
			gameId: game.id,
			stage: stage,
			prompt: prompt,
		});
	};
	const toggleReady = () => {
		socket.emit('setReady', {
			gameId,
			clientId,
			isReady: !game.clients[clientId].readiness,
		});
	};
</script>

{#if game && game.stage > 7}
	<EndMenu
		{clientId}
		{game}
		{progressGame}
	/>
{:else if game && game.stage > 0 && game.stage <= 7}
	<Game
		{clientId}
		{game}
		{progressGame}
	/>
{:else}
	<StartMenu
		{isWrongRoom}
		{clientId}
		{game}
		{submitCreate}
		{submitJoin}
		{progressGame}
		{toggleReady}
		bind:userName
		bind:gameId
	/>
{/if}
