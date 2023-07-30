import React from 'react';
import ManaCost from '../Shared/ManaCost';
import OracleTextCleaner from '../Shared/OracleTextCleaner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import "./Universal.css";
import "./Saga.css";

const Saga = (props) => {
    const source = props.face || props.card;
    const imageData = props.imageData;
    const {name, mana_cost, oracle_text, type_line, set } = source;

    const oracle_parts = oracle_text.split('\n');
    let saga_text = "";
    let abilities = [];

    oracle_parts.forEach((part, index) => {
        const romanNumeralRegex = /^((I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX),?\s*)+—/;
        if (romanNumeralRegex.test(part)) {
            const numerals = part.match(/((I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX),?\s*)+/g);
            const text = part.replace(/((I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX),?\s*)+—/g, '').trim();
            const splitNumerals = numerals[0].split(',').map(num => num.replace(/[\s—]/g, '').trim());
            abilities.push(
                <div className="ability" key={index}>
                    <div className="roman-numeral">
                        {
                            splitNumerals.map((numeral, numIndex) => (
                                <div className="numeral-container" key={numIndex}>
                                    <FontAwesomeIcon icon={faSquare} color="red" />
                                    <span>{numeral}</span>
                                </div>
                            ))
                        }
                    </div>
                    <OracleTextCleaner className="oracle_text saga_oracle" text={text} />
                </div>
            );
        } 
        else {
            saga_text = part;
        }
    });

    return (
        <div className="card-container">
            <div className="basic-card-background card-background">
                <div className="card-frame">
                    <div className="frame-header">
                        <h1 className="name">{name}</h1>
                        <ManaCost manaCost={mana_cost}/>
                    </div>
                    <div className="saga-container">
                        <div className="saga-frame-text-box">
                        <p className="saga_text">{saga_text}</p>
                        <div className="abilities">
                            {abilities}
                        </div>
                        </div>
                        <div className="saga-frame-image">
                            {imageData && <img src={`data:image/png;base64,${imageData.image}`} alt="Generated" />}
                        </div>
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

export default Saga;