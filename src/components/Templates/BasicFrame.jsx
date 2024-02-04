import React, { useRef, useState, useEffect } from 'react';
import ManaCost from '../Shared/ManaCost';
import OracleTextCleaner from '../Shared/OracleTextCleaner';
import CardBackground from '../Shared/CardBackground';
import { getBorderStyle } from '../Shared/Borders';
import Loyalty_start from'../../assets/WalkerSymbols/Loyalty_start.webp';
import Loyalty_up from'../../assets/WalkerSymbols/Loyalty_up.webp';
import Loyalty_down from'../../assets/WalkerSymbols/Loyalty_down.webp';
import Loyalty_neutral from'../../assets/WalkerSymbols/Loyalty_neutral.webp';
import { APC, APUC, APR, APMR, paintbrush } from '../../assets/Misc';

import domtoimage from 'dom-to-image';
import "./Universal.css";
import "./BasicFrame.css";

const BasicFrame = React.memo((props) => {
    const imageData = props.imageData;
    const {name, mana_cost, oracle_text, type_line, power, toughness, loyalty, colors, flavor_text, rarity, layout } = props.card;
    const {color_identity} = props.card;
    const cardRef = useRef(null);
    const [imageURL, setImageURL] = useState(null);

    let planeswalker_text = "";
    let abilities = [];
    const [isPlaneswalker, setIsPlaneswalker] = useState(false);

    useEffect(() => {
        let isCancelled = false;
        if (type_line.includes("Planeswalker")) {
            setIsPlaneswalker(true);
        } else {
            setIsPlaneswalker(false);
        }
        
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
    }, [imageData, isPlaneswalker]);

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    let levels = [];

    if (type_line.includes("Creature") && oracle_text.includes("Level up")) {
        
        const oracle_parts = oracle_text.split('\n');

        // Handle the initial "Level up" description
        const level_up_description = oracle_parts[0];
            levels.push(
            <div className="level-up-description" key="level-up">
                <OracleTextCleaner text={level_up_description} className={""}/>
            </div>
        );

        // Handle levels
        for (let i = 1; i < oracle_parts.length; ) {
            const level_number = oracle_parts[i];
            const power_toughness = oracle_parts[i + 1];
            
            const next_is_level = oracle_parts[i + 2] && oracle_parts[i + 2].startsWith("LEVEL");
            
            let level_text;
            if (!next_is_level && oracle_parts[i + 2]) {
                level_text = oracle_parts[i + 2];
                i += 3;
            } else {
                level_text = "";
                i += 2;
            }

            levels.push(
                <div className="level" key={i}>
                    <div className={`level-info ${i % 6 === 1 ? "highlight" : ""}`} style={{display: 'flex', justifyContent: 'space-between'}}>
                        <OracleTextCleaner text={level_number} className={"level-range"}/>
                        <OracleTextCleaner text={level_text} className={"level-text"}/>
                        <div className="level-stats">{power_toughness}</div>
                    </div>
                </div>
            );
        }
    }

    if (type_line.includes("Planeswalker")) {
        const oracle_parts = oracle_text.split('\n');
        oracle_parts.forEach((part, index) => {
            const abilityRegex = /((\+|−|-|0)[0-9]*)/;
            
            if (abilityRegex.test(part)) {
                const cost = part.match(abilityRegex)[0];
                const text = part.replace(new RegExp(escapeRegex(cost)), '').trim();
                // Determine the loyalty icon outside the JSX for clarity
                let loyaltyIcon;
                let costStyle = {};
                if (cost.charAt(0) === '+') {
                    loyaltyIcon = <img className="loyalty-icon" src={Loyalty_up} alt="Loyalty Up Icon" />;
                    costStyle = { left: 4, top: -4 };
                } else if (cost.charAt(0) === '−') { // added '−' character check for minus
                    loyaltyIcon = <img className="loyalty-icon" src={Loyalty_down} alt="Loyalty Down Icon" />;
                    costStyle = { left: 2, top: -8 };
                } else {
                    loyaltyIcon = <img className="loyalty-icon" src={Loyalty_neutral} alt="Loyalty Neutral Icon" />;
                    costStyle = { left: 7, top: -6 };
                }

                abilities.push(
                    <div className="ability" key={index}>
                        <div className={`planeswalker ${index % 2 !== 0 ? "highlight" : ""}`}>
                            <div className="planeswalker-cost-container">
                                <div className="planeswalker-image-container">
                                    {loyaltyIcon}
                                </div>
                                <span className="planeswalker-cost" style={costStyle}>{cost}</span>
                            </div>
                            <OracleTextCleaner className="planeswalker_text" text={text} type_line={type_line}/>
                        </div>
                    </div>
                );
            } else if(index === 0){
                planeswalker_text = part;
            }
        });
    }  
    return imageURL ? (
        <img src={imageURL} alt="Generated Card" />
    ) : (
        <div className="card-container" ref={cardRef}>
            <CardBackground type_line={type_line} colors={(colors, color_identity)} mana_cost={mana_cost} className={"basic-card-background"} layout={layout}>
                <div className="card-frame">
                    <div className="frame-header card-color-border" style={getBorderStyle(colors, mana_cost, color_identity)}>
                            <h1 className="name">{name}</h1>
                            <ManaCost manaCost={mana_cost}/>
                    </div>
                    <div className="frame-image card-color-border-square" style={getBorderStyle(colors, mana_cost, color_identity)}>
                        {imageData && <img src={imageData} alt="Generated" />}
                    </div>
                    <div className="frame-type-line card-color-border" style={getBorderStyle(colors, mana_cost, color_identity)}>
                        <h1 className="type">{type_line}</h1>
                        {rarity && <img className="set-symbol" src={APC} alt="Rarity Symbol" />}
                    </div>
                    <div className="frame-text-box card-color-border-square" style={getBorderStyle(colors, mana_cost,color_identity)}>
                        {type_line.includes("Planeswalker") ? (
                                <React.Fragment>
                                    {planeswalker_text &&<OracleTextCleaner text={planeswalker_text} className="planeswalker_text" /> }
                                    <div className="planeswalker_abilities">
                                        {abilities}
                                    </div>
                                    <div className="planeswalker_loyalty">
                                        {
                                            (loyalty !== null && loyalty !== undefined && loyalty !== "") && 
                                            <React.Fragment>
                                                <img src={Loyalty_start} alt="Loyalty Icon" />
                                                <span className="loyalty-text">{loyalty}</span>
                                            </React.Fragment>
                                        }
                                    </div>
                                </React.Fragment>
                                
                            ) : type_line.includes("Creature") && oracle_text.includes("Level up") ? (
                                <div className="levels">
                                    {levels}
                                </div>
                            ) : (
                                <React.Fragment>
                                    <OracleTextCleaner className="card-color-border-square" text={oracle_text} />
                                    {flavor_text && (
                                        <div className="flavor-text">
                                            <OracleTextCleaner text={flavor_text} />
                                        </div>
                                    )}

                                    {
                                    (type_line.includes("Creature") || type_line.includes("Vehicle")) && !oracle_text.includes("Level up") &&
                                    (<div className="power-toughness">{power}/{toughness}</div>)
                                    }

                                </React.Fragment>
                            )}
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

export default BasicFrame;
