import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Card from './Card';
import './Deck.css';

const API_BASE_URL = 'https://deckofcardsapi.com/api/deck';
const Deck = () => {
	const [deck, setDeck] = useState(null);
	const [drawn, setDrawn] = useState([]);
	const [autoDraw, setAutoDraw] = useState(false);
	const [shuffle, setShuffle] = useState(false);
	const timerRef = useRef(null);

	useEffect(() => {
		async function loadDeck() {
			let d = await axios.get(`${API_BASE_URL}/new/shuffle`);
			setDeck(d.data);
		}
		loadDeck();
	}, [setDeck]);

	useEffect(() => {
		async function drawCard() {
			let { deck_id } = deck;
			try {
				let drawRes = await axios.get(`${API_BASE_URL}/${deck_id}/draw`);
				// console.log(drawRes);

				if (drawRes.data.remaining === 0) {
					throw new Error('there are no cards remaining!');
				}
				const card = drawRes.data.cards[0];
				setDrawn(d => [
					...d,
					{
						name: card.value + ' ' + card.suit,
						id: card.code,
						image: card.image,
					},
				]);
			} catch (error) {
				alert(error);
			}
		}
		if (autoDraw && !timerRef.current) {
			timerRef.current = setInterval(async () => {
				await drawCard();
			}, 1000);
		}
		return () => {
			clearInterval(timerRef.current);
			timerRef.current = null;
		};
	}, [deck, autoDraw, setAutoDraw]);

	useEffect(() => {
		if (shuffle) {
			async function shuffleDeck() {
				setAutoDraw(false);
				setDeck(null);
				let d = await axios.get(`${API_BASE_URL}/new/shuffle`);
				setDeck(d.data);
				setDrawn([]);
			}
			shuffleDeck();
		}
		return () => setShuffle(false);
	}, [shuffle]);

	const toggleAutoDraw = () => {
		setAutoDraw(auto => !auto);
	};

	const shuffleCards = () => {
		setShuffle(true);
	};
	const cards = drawn.map(c => <Card key={c.id} src={c.image} name={c.name} />);

	return (
		<div className="Deck">
			{deck ? (
				<div>
					<button className="Deck-draw" onClick={toggleAutoDraw}>
						{autoDraw ? 'STOP' : 'START'} drawing a card
					</button>
				</div>
			) : null}
			<button className="Deck-draw" onClick={shuffleCards}>
				Shuffle Deck
			</button>
			<div className="Deck-cardarea">{cards}</div>
		</div>
	);
};

export default Deck;
