import React, { useState } from 'react';
import './Card.css';

const Card = ({ name, src }) => {
	const [{ xpos, ypos, angle }] = useState({
		xpos: Math.random() * 40 - 20,
		ypos: Math.random() * 40 - 20,
		angle: Math.random() * 90 - 45,
	});

	const transform = `translate(${xpos}px, ${ypos}px) rotate(${angle}deg)`;

	return (
		<img className="Card" src={src} alt={name} style={{ transform }}></img>
	);
};

export default Card;
