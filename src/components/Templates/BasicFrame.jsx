import React from 'react';
import "./Universal_styles.css"
import "./BasicFrame_styles.css";


const BasicFrame = (props) => {
    const {name, mana_cost, oracle_text,flavor_text, type_line, set, power, toughness, } = props.card;
    console.log(name)
    return (
        <div className="card-container">
            <div className="card-background">
                <div className="card-frame">
                    <div className="frame-header">
                        <h1 className="name">{name}</h1>
                        {mana_cost}
                    </div>
                    <div className="frame-image"></div>
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
                    <div className="frame-bottom-info inner-margin">
                        <div className="fbi-left">
                            {/* <p>OGW &#x2022; EN <!-- paintbrush symbol --> Wesley Burt</p> */}
                        </div>
                        {/* <div className="fbi-center"></div> */}
                        <div className="fbi-right">
                            &#x99; &amp; &#169; 2016 Wizards of the Coast
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default BasicFrame