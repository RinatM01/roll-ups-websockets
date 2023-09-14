import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import { handler } from '../build/handler.js';

const port = 3000;
const app = express();
const server = createServer(app);

const io = new Server(server);

const clients = {};
const games = {};
let gameIds = [];

const makeGameId = () => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const charactersLength = characters.length;
	let counter = 0;
	while (gameIds.includes(result) || result === '') {
		while (counter < 4) {
			result += characters.charAt(
				Math.floor(Math.random() * charactersLength)
			);
			counter += 1;
		}
	}
	gameIds.push(result);
	return result;
};

const disconnectClient = (clientId) => {
	delete clients[clientId];
	for (const gameId in games) {
		if (clientId in games[gameId].clients) {
			delete games[gameId].clients[clientId];
			if (Object.keys(games[gameId].clients).length === 0) {
				delete games[gameId];
				gameIds = gameIds.filter((id) => id !== gameId);
			}
		}
	}
};

const checkReady = (game) => {
	const clients = game.clients;
	for (const c in clients) {
		if (!clients[c].readiness) {
			return false;
		}
	}
	return true;
};

io.on('connection', (socket) => {
	socket.on('create', ({ clientId, userName }) => {
		const gameID = makeGameId();
		games[gameID] = {
			id: gameID,
			rolls: [[]],
			stage: 0,
			clients: {},
		};
		games[gameID].clients[clientId] = {
			userName: userName,
			role: 'leader',
			readiness: true,
			order: 0,
		};
		socket.emit('updateGame', games[gameID]);
	});

	socket.on('join', ({ clientId, gameId, userName }) => {
		if (gameId in games) {
			const game = games[gameId];
			const orderCount = Object.keys(game.clients).length;
			game.clients[clientId] = {
				userName: userName,
				role: 'normal',
				readiness: false,
				order: orderCount,
			};
			game.rolls.push([]);
			Object.keys(game.clients).forEach((c) => {
				clients[c].emit('updateGame', game);
			});
		} else {
			socket.emit('doodoo', 'no game');
		}
	});

	socket.on('progress', ({ gameId, clientId, stage, prompt }) => {
		const game = games[gameId];
		const order = game.clients[clientId].order;
		if (stage > 1 && stage <= 8) {
			game.rolls[order].push(prompt);
		}

		game.clients[clientId].readiness = true;
		if (checkReady(game)) {
			if (stage > 8) {
				game.stage = 1;
				game.rolls = game.rolls.map((roll) => []);
			} else {
				game.stage = stage;
			}
			for (const client in game.clients) {
				game.clients[client].order =
					(game.clients[client].order + 1) %
					Object.keys(game.clients).length;
				game.clients[client].readiness = false;
			}
		}
		Object.keys(game.clients).forEach((c) => {
			clients[c].emit('updateGame', game);
		});
	});

	socket.on('setReady', ({ gameId, clientId, isReady }) => {
		const game = games[gameId];
		game.clients[clientId].readiness = isReady;
		// console.log("client " + clientId + "is "+ `${isReady ? "ready" : 'not ready'}`);
		Object.keys(game.clients).forEach((c) => {
			clients[c].emit('updateGame', game);
		});
	});

	socket.on('disconnect', (reason) => {
		disconnectClient(socket.data.user.clientId);
	});

	const clientId = uuidv4();
	clients[clientId] = socket;
	socket.data.user = { clientId: clientId };
	socket.emit('connected', clientId);
	setTimeout(() => {
		disconnectClient(clientId);
		socket.disconnect(true);
	}, 1000 * 60 * 30);
});

// SvelteKit should handle everything else using Express middleware
// https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server
app.use(handler);

server.listen(port);
