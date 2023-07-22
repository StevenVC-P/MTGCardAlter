import React from 'react';
import "./Universal.css"
import "./Adventure.css";

const Adventure = (props) => {
    const {set, card_faces} = props.card;
    const imageData = props.imageData;
    return (
        <div className="card-container">
            <div className="basic-card-background card-background">
                <div className="card-frame">
                    <div className="frame-header">
                        <h1 className="name">{card_faces[0].name}</h1>
                        {card_faces[1].mana_cost}
                    </div>
                    <div className="frame-image">{imageData && <img src={`data:image/png;base64,${imageData.image}`} alt="Generated" />}</div>
                    <div className="frame-type-line">
                        <h1 className="type">{card_faces[0].type_line}</h1>
                        {set}
                    </div>
                    <div className="bottom-section">
                        <div className="adventure-bottom">
                            <div className="adventureframe-header">
                                <h1 className="name">{card_faces[1].name}</h1>
                                {card_faces[0].mana_cost}
                            </div>
                            <div className="adventureframe-type-line">
                                <h1 className="type">{card_faces[1].type_line}</h1>
                                {set}
                            </div>
                            <div className="adventureframe-text-box">
                                <p className="oracle_text">{card_faces[1].oracle_text}</p>
                            </div>
                        </div>
                        <div className="adventureer-text-box frame-text-box">
                            <p className="oracle_text">{card_faces[0].oracle_text}</p>
                            {(card_faces[0].type_line.includes("Creature") || card_faces[0].type_line.includes("Vehicle")) && (
                            <div className="power-toughness">{card_faces[0].power}/{card_faces[0].toughness}</div>
                            )}
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Adventure
