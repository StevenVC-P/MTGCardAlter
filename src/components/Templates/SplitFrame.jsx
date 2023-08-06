import React from 'react';
import ManaCost from '../Shared/ManaCost';
import OracleTextCleaner from '../Shared/OracleTextCleaner';
import CardBackground from '../Shared/CardBackground';
import { getBorderStyle } from '../Shared/Borders';
import "./Universal.css";
import "./SplitFrame.css";

//Compenent is a starting point for split card, currently works for cards such as Fire/Ice
const SplitFrame = (props) => {
    const {set, card_faces, colors} = props.card;
    const imageData = props.imageData;
// style={getBorderStyle(card_faces[1].colors)}
    return (
        <div className="card-container">
            <div className="card-half-top">
                <CardBackground type_line={card_faces[1].type_line} colors={card_faces[1].colors} mana_cost={card_faces[1].mana_cost} className="split-card-background">
                    <div className="split-card-frame" >
                        <div className="frame-header card-color-border" style={getBorderStyle(card_faces[1].colors, card_faces[1].mana_cost)} >
                            <h1 className="name">{card_faces[1].name}</h1>
                            <ManaCost manaCost={card_faces[1].mana_cost}/>
                        </div>
                        <div className="frame-split-image card-color-border-square" style={getBorderStyle(card_faces[1].colors, card_faces[1].mana_cost)}>
                            {imageData && imageData.secondImage && <img src={`data:image/png;base64,${imageData.secondImage}`} alt="Second" />}
                        </div>
                        <div className="frame-type-line card-color-border" style={getBorderStyle(card_faces[1].colors, card_faces[1].mana_cost)}>
                            <h1 className="type">{card_faces[1].type_line}</h1>
                            {set}
                        </div>
                        <div className="frame-text-box card-color-border-square" style={getBorderStyle(card_faces[1].colors, card_faces[1].mana_cost)}>
                            <OracleTextCleaner text={card_faces[1].oracle_text} className={"split"}/>
                        </div>
                    </div>
                </CardBackground>
            </div>
            <div className="card-half-bottom">
                <CardBackground type_line={card_faces[0].type_line} colors={card_faces[0].colors} mana_cost={card_faces[0].mana_cost} className="split-card-background">
                    <div className="split-card-frame">
                        <div className="frame-header card-color-border" style={getBorderStyle(card_faces[0].colors, card_faces[0].mana_cost)}>
                            <h1 className="name">{card_faces[0].name}</h1>
                            <ManaCost manaCost={card_faces[0].mana_cost}/>
                        </div>
                        <div className="frame-split-image card-color-border-square" style={getBorderStyle(card_faces[0].colors, card_faces[0].mana_cost)}>
                            {imageData && imageData.firstImage && <img src={`data:image/png;base64,${imageData.firstImage}`} alt="First" />}
                        </div>
                        <div className="frame-type-line card-color-border" style={getBorderStyle(card_faces[0].colors, card_faces[0].mana_cost)}>
                            <h1 className="type">{card_faces[0].type_line}</h1>
                            {set}
                        </div>
                        <div className="frame-text-box card-color-border-square" style={getBorderStyle(card_faces[0].colors, card_faces[0].mana_cost)}>
                            <OracleTextCleaner text={card_faces[0].oracle_text} className={"split"}/>
                        </div>
                    </div>
                </CardBackground>
            </div>
        </div>
    )

}

export default SplitFrame