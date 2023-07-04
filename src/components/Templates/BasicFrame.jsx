import React, { useState, useEffect }  from 'react';
import generateImage from '../../helpers/ImgDataFormatter';
import "./Universal.css";
import "./BasicFrame.css";


const BasicFrame = (props) => {
    const source = props.face || props.card;
    const {name, mana_cost, oracle_text,flavor_text, type_line, set, power, toughness, } = source;
    const [imageGenerated, setImageGenerated] = useState(false);
    const [imageData, setImageData] = useState(null);


    useEffect(() => {
        console.log("steve1", imageGenerated)
        if (!imageGenerated) {
        console.log("steve2")
        generateImage([name]) // Pass the name or other suitable text as a prompt for image generation
            .then((generatedImageData) => {
            // Handle the generated image data here (e.g., save it to state, display it, etc.)
            console.log('Generated image data:', generatedImageData);
            setImageData(generatedImageData);
            setImageGenerated(true);
            })
            .catch((error) => {
            console.error('Error generating image:', error);
            });
        }
    }, [name, imageGenerated]);

    return (
        <div className="card-container">
            <div className="basic-card-background card-background">
                <div className="card-frame">
                    <div className="frame-header">
                        <h1 className="name">{name}</h1>
                        {mana_cost}
                    </div>
                    <div className="frame-image">
                        {imageData && <img src={`data:image/png;base64,${imageData}`} alt="Generated Image" />}
                    </div>
                    <div className="frame-type-line">
                        <h1 className="type">{type_line}</h1>
                        {set}
                    </div>
                    <div className="frame-text-box">
                        <p className="description ftb-inner-margin">{oracle_text}</p>
                        <p className="flavour-text">{flavor_text}</p>
                        {(type_line.includes("Creature") || type_line.includes("Vehicle")) && (
                            <div className="power-toughness">{power}/{toughness}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default BasicFrame