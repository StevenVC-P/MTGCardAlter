import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import ManaCost from '../Shared/ManaCost';
import OracleTextCleaner from '../Shared/OracleTextCleaner';
import CardBackground from '../CardBackground';
import "./Universal.css";
import "./BasicFrame.css";

const BasicFrame = (props) => {
    const source = props.face || props.card;
    const imageData = props.imageData;
    const {name, mana_cost, oracle_text, flavor_text, type_line, set, power, toughness, loyalty, colors} = source;

    // Split oracle text if the card is a planeswalker
    let oracleParts = [];
    if (type_line.includes("Planeswalker")) {
            oracleParts = oracle_text.split('\n').map((text) => {
            const [cost, ...rest] = text.split(': ');
            return {cost, text: rest.join(': ')};
        });
    }

    return (
        <div className="card-container">
            <CardBackground type_line={type_line} colors={colors} mana_cost={mana_cost}>
                <div className="card-frame">
                    <div className="frame-header">
                        <h1 className="name">{name}</h1>
                        <ManaCost manaCost={mana_cost}/>
                    </div>
                    <div className="frame-image">
                        {imageData && <img src={`data:image/png;base64,${imageData.image}`} alt="Generated" />}
                    </div>
                    <div className="frame-type-line">
                        <h1 className="type">{type_line}</h1>
                        {set}
                    </div>
                    <div className="frame-text-box">
                       {type_line.includes("Planeswalker") ? (
                            oracleParts.map((ability, index) => (
                                <div className={`planeswalker ${index % 2 === 0 ? "highlight" : ""}`}>
                                    <div className="planeswalker-cost-container">
                                        <FontAwesomeIcon icon={faSquare} color="black" />
                                        <span className="planeswalker-cost">{ability.cost}</span>
                                    </div>
                                    <p className="planeswalker_text oracle_text">{ability.text}</p>
                                </div>
                            ))
                        ) : (
                            <OracleTextCleaner text={oracle_text}/>
                        )}
                        <p className="flavour-text">{flavor_text}</p>
                        {type_line.includes("Creature") || type_line.includes("Vehicle") ? (
                                <div className="power-toughness">{power}/{toughness}</div>
                            ) : type_line.includes("Planeswalker") ? (
                                <div className="power-toughness">{loyalty}</div>
                            ) : null}
                    </div>
                </div>
            </CardBackground>
        </div>
    )
}

export default BasicFrame
