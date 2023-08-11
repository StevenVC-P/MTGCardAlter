import React, { useRef, useState, useEffect } from 'react';
import ManaCost from '../Shared/ManaCost';
import OracleTextCleaner from '../Shared/OracleTextCleaner';
import CardBackground from '../Shared/CardBackground';
import { getBorderStyle } from '../Shared/Borders';
import domtoimage from 'dom-to-image';
import "./Aftermath.css";

//Compenent is a starting point for split card, currently works for cards such as Fire/Ice
const Aftermath = (props) => {
    const {set, card_faces} = props.card;
    const imageData = props.imageData;

    const cardRef = useRef(null);
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {
    let isCancelled = false;

    if (imageData && cardRef.current) {
        domtoimage.toPng(cardRef.current)
            .then((imgData) => {
                if (!isCancelled) {
                    setImageURL(imgData);
                }
            })
            .catch((error) => {
                if (!isCancelled) {
                    console.error('Error generating image:', error);
                }
            });
    }

    return () => {
        isCancelled = true;
    };
    }, [imageData]);

    return imageURL ? (
        <img src={imageURL} alt="Generated Card" />
    ) : (
        <div className="card-container" ref={cardRef}>
            <div className="aftermath-card-half-top">
                <CardBackground type_line={card_faces[0].type_line} colors={card_faces[0].colors} mana_cost={card_faces[0].mana_cost} className ="aftermath-card-background">
                    <div className="aftermath-card-frame">
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
                        <div className="aftermath-text-box card-color-border-square"  style={getBorderStyle(card_faces[0].colors, card_faces[0].mana_cost)}>
                            <OracleTextCleaner text={card_faces[0].oracle_text} className={"split"}/>
                        </div>
                    </div>
                </CardBackground>
            </div>
            <div className="aftermath-card-half-bottom">
                <CardBackground type_line={card_faces[1].type_line} colors={card_faces[1].colors} mana_cost={card_faces[1].mana_cost} className="aftermath-bottom-card-background">
                    <div className="aftermath-bottom-card-frame" >
                        <div className="frame-header card-color-border" style={getBorderStyle(card_faces[1].colors, card_faces[1].mana_cost)}>
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
                        <div className="aftermath-bottom-text-box card-color-border-square" style={{ ...getBorderStyle(card_faces[1].colors, card_faces[1].mana_cost), borderWidth: '2px' }}>
                            <OracleTextCleaner text={card_faces[1].oracle_text} className={"split"}/>
                        </div>
                    </div>
                </CardBackground>
            </div>
        </div>
    )
}

export default Aftermath