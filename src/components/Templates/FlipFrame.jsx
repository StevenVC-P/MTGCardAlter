import React from 'react';
import ManaCost from '../Shared/ManaCost';
import OracleTextCleaner from '../Shared/OracleTextCleaner';
import CardBackground from '../Shared/CardBackground';
import "./Universal.css";
import "./FlipFrame.css";

const FlipFrame = (props) => {
    const source = props.face || props.card;
    const imageData = props.imageData;
    const {mana_cost, card_faces} = source;

    return (
        <div className="card-container">
            <CardBackground type_line={card_faces[0].type_line} colors={source.colors} mana_cost={card_faces[0].mana_cost}>
                <div className="card-frame">
                    <div className="frame-header">
                        <h1 className="name">{card_faces[0].name}</h1>
                        <ManaCost manaCost={card_faces[0].mana_cost}/>
                    </div>
                    <div className="flip-frame-text-box">
                        <OracleTextCleaner text={card_faces[0].oracle_text}/>
                    </div>
                    <div className="frame-type-line">
                        <h1 className="type">{card_faces[0].type_line}</h1>
                        {(card_faces[0].type_line.includes("Creature") || card_faces[0].type_line.includes("Vehicle")) && (
                            <div className="flip-power-toughness">{card_faces[0].power}/{card_faces[0].toughness}</div>
                        )}
                    </div>
                    <div className="frame-image">
                        {imageData && <img src={`data:image/png;base64,${imageData.image}`} alt="Generated" />}
                    </div>
                    <div className="frame-type-line flip">
                        <h1 className="type">{card_faces[1].type_line}</h1>
                        {(card_faces[1].type_line.includes("Creature") || card_faces[1].type_line.includes("Vehicle")) && (
                            <div className="flip-power-toughness">{card_faces[1].power}/{card_faces[1].toughness}</div>
                        )}
                    </div>
                    <div className="flip-frame-text-box flip">
                        <OracleTextCleaner text={card_faces[1].oracle_text}/>
                    </div>
                    <div className="frame-header flip">
                        <h1 className="name">{card_faces[1].name}</h1>
                        {mana_cost}
                    </div>
                </div>
            </CardBackground>
        </div>
    )
}

export default FlipFrame