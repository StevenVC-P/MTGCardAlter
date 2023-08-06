import React from 'react';
import ManaCost from '../Shared/ManaCost';
import OracleTextCleaner from '../Shared/OracleTextCleaner';
import CardBackground from '../Shared/CardBackground';
import { getBorderStyle } from '../Shared/Borders';
import "./Universal.css"
import "./Adventure.css";

const Adventure = (props) => {
    const {set, card_faces, colors} = props.card;
    const imageData = props.imageData;

    return (
        <div className="card-container">
            <CardBackground type_line={card_faces[0].type_line} colors={card_faces[0].colors} mana_cost={card_faces[0].mana_cost}>
                <div className="card-frame">
                    <div className="frame-header card-color-border" style={getBorderStyle(colors, card_faces[0].mana_cost)}>
                        <h1 className="name">{card_faces[0].name}</h1>
                        <ManaCost manaCost={card_faces[0].mana_cost}/>
                    </div>
                    <div className="frame-image card-color-border-square" style={getBorderStyle(colors,card_faces[0].mana_cost)}>
                        {imageData && <img src={`data:image/png;base64,${imageData.image}`} alt="Generated" />}
                    </div>
                    <div className="frame-type-line card-color-border" style={getBorderStyle(colors,card_faces[0].mana_cost)}>
                        <h1 className="type">{card_faces[0].type_line}</h1>
                        {set}
                    </div>
                    <div className="bottom-section">
                        <div className="adventure-bottom" >
                            <div className="adventureframe-header card-color-border-adventure" style={getBorderStyle(colors, card_faces[1].mana_cost)}>
                                <h1 className="name">{card_faces[1].name}</h1>
                                <ManaCost manaCost={card_faces[1].mana_cost}/>
                            </div>
                            <div className="adventureframe-type-line card-color-border-adventure" style={getBorderStyle(colors, card_faces[1].mana_cost)}>
                                <h1 className="type">{card_faces[1].type_line}</h1>
                            </div>
                            <div className="adventureframe-text-box card-color-border-square" style={getBorderStyle(colors, card_faces[1].mana_cost)}>
                                <OracleTextCleaner text={card_faces[1].oracle_text}/>
                            </div>
                        </div>
                        <div className="adventureer-text-box frame-text-box card-color-border-square" style={getBorderStyle(colors, card_faces[1].mana_cost)}>
                            <OracleTextCleaner text={card_faces[0].oracle_text}/>
                            {(card_faces[0].type_line.includes("Creature") || card_faces[0].type_line.includes("Vehicle")) && (
                            <div className="power-toughness">{card_faces[0].power}/{card_faces[0].toughness}</div>
                            )}
                        </div>
                    </div>
                    
                </div>
            </CardBackground>
        </div>
    )
}

export default Adventure
