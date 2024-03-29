import React, { useRef, useState, useEffect } from 'react';
import ManaCost from '../Shared/ManaCost';
import OracleTextCleaner from '../Shared/OracleTextCleaner';
import CardBackground from '../Shared/CardBackground';
import { APC, APUC, APR, APMR, paintbrush } from '../../assets/Misc';
import { getBorderStyle } from '../Shared/Borders';
import domtoimage from 'dom-to-image';
import "./Universal.css";
import "./Battles.css";

const Battles = React.memo((props) => {
    const imageData = props.imageData;
    const {name, mana_cost, oracle_text, type_line, defense, colors, layout } = props.card;
    const {color_identity, rarity} = props.card;
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
            {layout === 'planar' ? (
                <div className="planar-card-background">
                    <div className="battle-card-frame">
                        <div className="planar-frame-header card-color-border-planar" style={getBorderStyle(colors, mana_cost, color_identity, layout)}>
                            <h1 className="name">{name}</h1>
                            <ManaCost manaCost={mana_cost}/>
                        </div>
                            <div className="planar-frame-image" style={getBorderStyle(colors, mana_cost, color_identity, layout)}>
                                {imageData && <img src={imageData} alt="Generated" />}
                            </div>
                            <div className="planar-frame-type-line card-color-border-planar" style={getBorderStyle(colors, mana_cost, color_identity, layout)}>
                                <h1 className="type">{type_line}</h1>
                                {rarity && <img className="set-symbol" src={APC} alt="Rarity Symbol" />}
                            </div>
                            <div className="planar-frame-text-box" style={getBorderStyle(colors, mana_cost, color_identity, layout)}>
                                <OracleTextCleaner text={oracle_text} type_line={type_line}/>
                                {defense && <div className="defense">{defense}</div>}
                            </div>
                    </div>
                </div>
            ) : (<CardBackground type_line={type_line} colors={colors} mana_cost={mana_cost} className={"battle-card-background"} layout={layout}>
                <div className="battle-card-frame">
                    <div className="battle-frame-header card-color-border-battle" style={getBorderStyle(colors, mana_cost, color_identity, layout)}>
                        <h1 className="name">{name}</h1>
                        <ManaCost manaCost={mana_cost}/>
                    </div>
                        <div className="battle-frame-image card-color-border-square" style={getBorderStyle(colors, mana_cost, color_identity, layout)}>
                            {imageData && <img src={imageData} alt="Generated" />}
                        </div>
                        <div className="battle-frame-type-line card-color-border-battle" style={getBorderStyle(colors, mana_cost, color_identity, layout)}>
                            <h1 className="type">{type_line}</h1>
                            {rarity && <img className="set-symbol" src={APC} alt="Rarity Symbol" />}
                        </div>
                        <div className="battle-frame-text-box card-color-border-square" style={getBorderStyle(colors, mana_cost, color_identity, layout)}>
                            <OracleTextCleaner text={oracle_text} type_line={type_line}/>
                            {defense && <div className="defense">{defense}</div>}
                        </div>
                </div>
            </CardBackground>)}
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

export default Battles