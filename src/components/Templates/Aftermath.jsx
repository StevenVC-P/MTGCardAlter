import React from 'react';
import "./Aftermath.css";

//Compenent is a starting point for split card, currently works for cards such as Fire/Ice
const Aftermath = (props) => {
    const {set, card_faces} = props.card;
    const imageData = props.imageData;
    return (
        <div className="card-container">
            <div className="aftermath-card-half-top">
                <div className="card-background aftermath-card-background">
                    <div className="aftermath-card-frame">
                        <div className="frame-header">
                            <h1 className="name">{card_faces[0].name}</h1>
                            {card_faces[0].mana_cost}
                        </div>
                        <div className="frame-split-image">
                            {imageData && imageData.firstImage && <img src={`data:image/png;base64,${imageData.firstImage}`} alt="First" />}
                        </div>
                        <div className="frame-type-line">
                            <h1 className="type">{card_faces[0].type_line}</h1>
                            {set}
                        </div>
                        <div className="aftermath-text-box">
                            <p className="oracle_text">{card_faces[0].oracle_text}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="aftermath-card-half-bottom">
                <div className="aftermath-bottom-card-background">
                    <div className="aftermath-bottom-card-frame">
                        <div className="frame-header">
                            <h1 className="name">{card_faces[1].name}</h1>
                            {card_faces[1].mana_cost}
                        </div>
                        <div className="frame-split-image">
                            {imageData && imageData.secondImage && <img src={`data:image/png;base64,${imageData.secondImage}`} alt="Second" />}
                        </div>
                        <div className="frame-type-line">
                            <h1 className="type">{card_faces[1].type_line}</h1>
                            {set}
                        </div>
                        <div className="aftermath-bottom-text-box">
                            <p className="oracle_text">{card_faces[1].oracle_text}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Aftermath