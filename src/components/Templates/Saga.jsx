import React from 'react';
import "./Universal.css";
import "./Saga.css";

const Saga = (props) => {
    const {name, mana_cost, oracle_text, type_line, set } = props.card;
    return (
        <div className="card-container">
            <div className="basic-card-background card-background">
                <div className="card-frame">
                    <div className="frame-header">
                        <h1 className="name">{name}</h1>
                        {mana_cost}
                    </div>
                    <div className="saga-container">
                        <div className="saga-frame-text-box">
                            <p className="description ftb-inner-margin">{oracle_text}</p>
                        </div>
                        <div className="saga-frame-image"></div>
                    </div>
                    <div className="frame-type-line">
                        <h1 className="type">{type_line}</h1>
                        {set}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Saga