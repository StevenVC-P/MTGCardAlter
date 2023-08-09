import React, { useRef, useState, useEffect, useCallback  } from 'react';
import ManaCost from '../Shared/ManaCost';
import OracleTextCleaner from '../Shared/OracleTextCleaner';
import CardBackground from '../Shared/CardBackground';
import { getBorderStyle } from '../Shared/Borders';
import "./Universal.css"
import "./Adventure.css";

const AdventureComponent  = (props) => {
  const {set, card_faces, colors} = props.card;
  const imageData = props.imageData;

  const [fullImageData, setFullImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasConverted, setHasConverted] = useState(false);
  const cardContainerRef = useRef(null);

  const convertCardToImage = useCallback(async () => {
    if (!loading && !fullImageData) {
        setLoading(true);
        if (cardContainerRef.current) {
            const cardHTML = cardContainerRef.current.outerHTML;
            try {
                const response = await fetch("http://localhost:5000/api/convert-to-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    htmlContent: cardHTML,
                    type_line: card_faces[0].type_line,
                    colors: card_faces[0].colors,
                    mana_cost: card_faces[0].mana_cost,
                }),
                });

                const data = await response.json();
                setFullImageData(`data:image/png;base64,${data.image}`);
                setHasConverted(true); // Add this line
            } catch (error) {
                console.error("Error converting to image:", error);
            }
            setLoading(false);
            }
        };
    }, [loading, fullImageData, card_faces, ]);

    const hasConvertedRef = useRef(false);

    useEffect(() => {
    if (!hasConverted && !fullImageData && props.imageData) {
        convertCardToImage();
        hasConvertedRef.current = true;
    }
    }, [fullImageData, props.imageData, convertCardToImage, hasConverted]); 

    return (
        <div className="card-container" ref={cardContainerRef}>
        {fullImageData ? (
            <img src={fullImageData} alt="Card" />
        ) : (
            <CardBackground className= {"card-background"} type_line={card_faces[0].type_line} colors={card_faces[0].colors} mana_cost={card_faces[0].mana_cost}>
                <div className="card-frame">
                    <div className="frame-header card-color-border" style={getBorderStyle(colors, card_faces[0].mana_cost)}>
                        <h1 className="name">{card_faces[0].name}</h1>
                        <ManaCost manaCost={card_faces[0].mana_cost}/>
                    </div>
                    <div className="frame-image card-color-border-square" style={getBorderStyle(colors,card_faces[0].mana_cost)}>
                        {imageData && <img src={`data:image/png;base64,${imageData.image}`} alt="Generated" />}
                    </div>
                    <div className="frame-type-line card-color-border" style={getBorderStyle(colors,card_faces[0].mana_cost)}>
                        <h1 className="type">{card_faces[0].type_line}</h1>
                        {set}
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
                                <OracleTextCleaner text={card_faces[1].oracle_text}/>
                            </div>
                        </div>
                        <div className="adventureer-text-box frame-text-box card-color-border-square" style={getBorderStyle(colors, card_faces[1].mana_cost)}>
                            <OracleTextCleaner text={card_faces[0].oracle_text}/>
                            {(card_faces[0].type_line.includes("Creature") || card_faces[0].type_line.includes("Vehicle")) && (
                            <div className="power-toughness">{card_faces[0].power}/{card_faces[0].toughness}</div>
                            )}
                        </div>
                    </div>
                    
                </div>
            </CardBackground>
        )}
    </div>
  );
};

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps.imageData === nextProps.imageData;
};

const Adventure = React.memo(AdventureComponent, arePropsEqual);

export default Adventure;
