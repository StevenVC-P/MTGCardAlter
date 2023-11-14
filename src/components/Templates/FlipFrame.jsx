import React, { useRef, useState, useEffect } from 'react';
import ManaCost from '../Shared/ManaCost';
import OracleTextCleaner from '../Shared/OracleTextCleaner';
import CardBackground from '../Shared/CardBackground';
import { APC } from '../../assets/Misc';
import { getBorderStyle } from '../Shared/Borders';
import domtoimage from 'dom-to-image';
import "./Universal.css";
import "./FlipFrame.css";

const FlipFrame = React.memo((props) => {
    const source = props.face || props.card;
    const imageData = props.imageData;
    const {mana_cost, card_faces, colors} = source;
    
    const cardRef = useRef(null);
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {
    let isCancelled = false;

    if (imageData && cardRef.current) {
        domtoimage.toJpeg(cardRef.current, { quality: 0.7 })
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
            <CardBackground type_line={card_faces[0].type_line} colors={source.colors} mana_cost={card_faces[0].mana_cost} className={"flip-card-background"}>
                <div className="card-frame">
                    <div className="frame-header card-color-border" style={getBorderStyle(colors)}>
                        <h1 className="name">{card_faces[0].name}</h1>
                        <ManaCost manaCost={card_faces[0].mana_cost}/>
                    </div>
                    <div className="flip-frame-text-box card-color-border-square" style={getBorderStyle(colors)}>
                        <OracleTextCleaner text={card_faces[0].oracle_text}  className={"split"}/>
                    </div>
                    <div className="frame-type-line card-color-border" style={getBorderStyle(colors)}>
                        <h1 className="type">{card_faces[0].type_line}</h1>
                        {(card_faces[0].type_line.includes("Creature") || card_faces[0].type_line.includes("Vehicle")) && (
                            <div className="flip-power-toughness">{card_faces[0].power}/{card_faces[0].toughness}</div>
                        )}
                    </div>
                    <div className="frame-image card-color-border-square" style={getBorderStyle(colors)}>
                        {imageData && <img src={`data:image/png;base64,${imageData.image}`} alt="Generated" />}
                    </div>
                    <div className="frame-type-line flip card-color-border" style={getBorderStyle(colors)}>
                        <h1 className="type">{card_faces[1].type_line}</h1>
                        {(card_faces[1].type_line.includes("Creature") || card_faces[1].type_line.includes("Vehicle")) && (
                            <div className="flip-power-toughness">{card_faces[1].power}/{card_faces[1].toughness}</div>
                        )}
                    </div>
                    <div className="flip-frame-text-box flip card-color-border-square" style={getBorderStyle(colors)}>
                        <OracleTextCleaner text={card_faces[1].oracle_text}  className={"split"}/>
                    </div>
                    <div className="frame-header flip card-color-border" style={getBorderStyle(colors)}>
                        <h1 className="name">{card_faces[1].name}</h1>
                        {mana_cost}
                    </div>
                </div>
            <div className="frame-footer" style={{ color: source.colors.includes('B') ? 'white' : 'black' }}>
                <span className="arcane-proxies-flip">Arcane-Proxies</span>
                <img className="set-symbol" src={APC} alt="Rarity Symbol" />
            </div>
            </CardBackground>

        </div>
    )
})

export default FlipFrame