import React, { useRef, useState, useEffect } from 'react';
import ManaCost from '../Shared/ManaCost';
import OracleTextCleaner from '../Shared/OracleTextCleaner';
import CardBackground from '../Shared/CardBackground';
import { getBorderStyle } from '../Shared/Borders';
import { APC, APUC, APR, APMR, paintbrush } from '../../assets/Misc';
import domtoimage from 'dom-to-image';
import "./Universal.css"
import "./Adventure.css";

const Adventure = React.memo((props) => {
    const { card_faces, colors, layout} = props.card;
    const imageData = props.imageData;
    const cardRef = useRef(null);
    const [imageURL, setImageURL] = useState(null);
    useEffect(() => {
    let isCancelled = false;

    if (imageData && cardRef.current) {
        setTimeout(() => {
            const scale = 1   

            const param = {
                height: 350 * scale,
                width: 250 * scale,
                quality: 1,
                style: {
                    'transform': `scale(${scale})`,
                    'transform-origin': 'top left'
                }
            };

            domtoimage.toJpeg(cardRef.current, param)
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
        }, 2000);
    }

    return () => {
        isCancelled = true;
    };
    }, [imageData]);

    return imageURL ? (
        <img src={imageURL} alt="Generated Card" />
    ) : (
        <div className="card-container" ref={cardRef}>
            <CardBackground type_line={card_faces[0].type_line} colors={card_faces[0].colors} mana_cost={card_faces[0].mana_cost}>
                <div className="card-frame">
                    <div className="frame-header card-color-border" style={getBorderStyle(colors, card_faces[0].mana_cost)}>
                            <h1 className="name">{card_faces[0].name}</h1>
                            <ManaCost manaCost={card_faces[0].mana_cost}/>
                    </div>
                    <div className="frame-image card-color-border-square" style={getBorderStyle(colors,card_faces[0].mana_cost)}>
                        {imageData && <img src={imageData} alt="Generated" />}
                    </div>
                    <div className="frame-type-line card-color-border" style={getBorderStyle(colors,card_faces[0].mana_cost)}>
                        <h1 className="type">{card_faces[0].type_line}</h1>
                        <img className="set-symbol" src={APC} alt="Rarity Symbol" />
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
                                <OracleTextCleaner text={card_faces[1].oracle_text} layout={layout}/>
                            </div>
                        </div>
                        <div className="adventureer-text-box frame-text-box card-color-border-square" style={getBorderStyle(colors, card_faces[1].mana_cost)}>
                            <OracleTextCleaner text={card_faces[0].oracle_text} layout={layout}/>
                            {(card_faces[0].type_line.includes("Creature") || card_faces[0].type_line.includes("Vehicle")) && (
                            <div className="power-toughness">{card_faces[0].power}/{card_faces[0].toughness}</div>
                            )}
                        </div>
                    </div>
                    
                </div>
            </CardBackground>
            <div className="info">
                <div className="artist">
                    <img className="paintbrush" src={paintbrush} alt="paintbrush"/>
                    <span className="artist-text">STABILITY AI</span>
                </div>
                <span className="arcane-proxies-text">Arcane-Proxies</span>
            </div>
        </div>
    )
})

export default Adventure
