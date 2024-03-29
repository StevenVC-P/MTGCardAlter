import React, { useRef, useState, useEffect } from 'react';
import ManaCost from '../Shared/ManaCost';
import OracleTextCleaner from '../Shared/OracleTextCleaner';
import CardBackground from '../Shared/CardBackground';
import { getBorderStyle } from '../Shared/Borders';
import { APC, paintbrush } from '../../assets/Misc';
import sage_icon from '../../assets/Misc/Saga.webp';
import domtoimage from 'dom-to-image';
import "./Universal.css";
import "./Saga.css";

const Saga = React.memo((props) => {
    const source = props.face || props.card;
    const imageData = props.imageData;
    const {name, mana_cost, oracle_text, type_line, colors } = source;
    const {color_identity} = props.card;

    const oracle_parts = oracle_text.split('\n');
    let saga_text = "";
    let abilities = [];

    const cardRef = useRef(null);
    const [imageURL, setImageURL] = useState(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const handleImageLoaded = () => {
        setIsImageLoaded(true);
    };

    useEffect(() => {
    let isCancelled = false;
    if (imageData && cardRef.current && isImageLoaded) {
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
    }, [imageData, isImageLoaded]);
    
    oracle_parts.forEach((part, index) => {
        const romanNumeralRegex = /^((I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX),?\s*)+—/;
        if (romanNumeralRegex.test(part)) {
            const numerals = part.match(/((I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX),?\s*)+/g);
            const text = part.replace(/((I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX),?\s*)+—/g, '').trim();
            const splitNumerals = numerals[0].split(',').map(num => num.replace(/[\s—]/g, '').trim());

            abilities.push(
                <div className="saga_ability" key={index}>
                    <div className="roman-numeral">
                        {
                            splitNumerals.map((numeral, numIndex) => (
                                <div className="numeral-container" key={numIndex}>
                                     <img className="saga-icon" src={sage_icon} alt="Saga Icon" />
                                    <span className="saga-numeral">{numeral}</span>
                                </div>
                            ))
                        }
                    </div>
                    <OracleTextCleaner className="saga_oracle" text={text} type_line={type_line}/>
                </div>
            );
        } 
        else {
            saga_text = part;
        }
    });

    return imageURL ? (
        <img src={imageURL} alt="Generated Card" />
    ) : (
        <div className="card-container" ref={cardRef}>
             <CardBackground type_line={type_line} colors={colors} mana_cost={mana_cost}>
                <div className="card-frame">
                    <div className="frame-header card-color-border" style={getBorderStyle(colors, color_identity)}>
                        <h1 className="name">{name}</h1>
                        <ManaCost manaCost={mana_cost}/>
                    </div>
                    <div className="saga-container">
                        <div className="saga-frame-text-box card-color-border-square"style={getBorderStyle(colors, color_identity)}>
                            <OracleTextCleaner className="saga_text" text={saga_text} type_line={type_line}/>
                        <div className="abilities">
                            {abilities}
                        </div>
                        </div>
                        <div className="saga-frame-image" style={getBorderStyle(colors, color_identity)}>
                            {imageData && <img src={imageData} onLoad={handleImageLoaded} crossOrigin="anonymous" alt="Generated" />}
                        </div>
                    </div>
                    <div className="frame-type-line card-color-border" style={getBorderStyle(colors, color_identity)}>
                        <h1 className="type">{type_line}</h1>
                        <img className="set-symbol" src={APC} alt="Rarity Symbol" />
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

export default Saga;