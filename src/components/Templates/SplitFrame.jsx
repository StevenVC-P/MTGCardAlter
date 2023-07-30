import React from 'react';
import ManaCost from '../Shared/ManaCost';
import OracleTextCleaner from '../Shared/OracleTextCleaner';
import "./Universal.css";
import "./SplitFrame.css";

//Compenent is a starting point for split card, currently works for cards such as Fire/Ice
const SplitFrame = (props) => {
    const {set, card_faces} = props.card;
    const imageData = props.imageData;
    console.log(imageData)
    return (
        <div className="card-container">
            <div className="card-half-top">
                <div className="split-card-background card-background">
                    <div className="split-card-frame">
                        <div className="frame-header">
                            <h1 className="name">{card_faces[1].name}</h1>
                            <ManaCost manaCost={card_faces[1].mana_cost}/>
                        </div>
                        <div className="frame-split-image">
                            {imageData && imageData.secondImage && <img src={`data:image/png;base64,${imageData.secondImage}`} alt="Second" />}
                        </div>
                        <div className="frame-type-line">
                            <h1 className="type">{card_faces[1].type_line}</h1>
                            {set}
                        </div>
                        <div className="frame-text-box">
                            <OracleTextCleaner text={card_faces[1].oracle_text}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-half-bottom">
                <div className="split-card-background card-background">
                    <div className="split-card-frame">
                        <div className="frame-header">
                            <h1 className="name">{card_faces[0].name}</h1>
                            <ManaCost manaCost={card_faces[0].mana_cost}/>
                        </div>
                        <div className="frame-split-image">
                            {imageData && imageData.firstImage && <img src={`data:image/png;base64,${imageData.firstImage}`} alt="First" />}
                        </div>
                        <div className="frame-type-line">
                            <h1 className="type">{card_faces[0].type_line}</h1>
                            {set}
                        </div>
                        <div className="frame-text-box">
                            <OracleTextCleaner text={card_faces[0].oracle_text}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default SplitFrame