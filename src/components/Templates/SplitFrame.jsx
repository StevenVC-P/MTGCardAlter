import React from 'react';
import "./Universal.css";
import "./SplitFrame.css";

//Compenent is a starting point for split card, currently works for cards such as Fire/Ice
const SplitFrame = (props) => {
    const {set, card_faces} = props.card;
    return (
        <div className="card-container">
            <div className="card-half-top">
                <div className="split-card-background card-background">
                    <div className="split-card-frame">
                        <div className="frame-header">
                            <h1 className="name">{card_faces[1].name}</h1>
                            {card_faces[1].mana_cost}
                        </div>
                        <div className="frame-image"></div>
                        <div className="frame-type-line">
                            <h1 className="type">{card_faces[1].type_line}</h1>
                            {set}
                        </div>
                        <div className="frame-text-box">
                            <p className="description ftb-inner-margin">{card_faces[1].oracle_text}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-half-bottom">
                <div className="split-card-background card-background">
                    <div className="split-card-frame">
                        <div className="frame-header">
                            <h1 className="name">{card_faces[0].name}</h1>
                            {card_faces[0].mana_cost}
                        </div>
                        <div className="frame-image"></div>
                        <div className="frame-type-line">
                            <h1 className="type">{card_faces[0].type_line}</h1>
                            {set}
                        </div>
                        <div className="frame-text-box">
                            <p className="description ftb-inner-margin">{card_faces[0].oracle_text}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default SplitFrame