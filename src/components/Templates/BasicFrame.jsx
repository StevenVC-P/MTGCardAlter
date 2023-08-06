import React from 'react';
import ManaCost from '../Shared/ManaCost';
import OracleTextCleaner from '../Shared/OracleTextCleaner';
import CardBackground from '../Shared/CardBackground';
import { getBorderStyle } from '../Shared/Borders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import "./Universal.css";
import "./BasicFrame.css";

const BasicFrame = (props) => {
    const source = props.face || props.card;
    const imageData = props.imageData;
    const {name, mana_cost, oracle_text, type_line, set, power, toughness, loyalty, colors, flavor_text } = source;

    let planeswalker_text = "";
    let abilities = [];

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    let levels = [];

    if (type_line.includes("Creature") && oracle_text.includes("Level up")) {
        const oracle_parts = oracle_text.split('\n');

        // Handle levels, which should be the remaining items grouped in threes
        for (let i = 0; i < oracle_parts.length; i += 1) {
            let level_number = "";
            let power_toughness = "";

            let level_text = ""
            if(i===0){
                level_text = oracle_parts[i]
                power_toughness = `${power}/${toughness}`;
            } else {
                level_number = oracle_parts[i];
                power_toughness = oracle_parts[i+1];
                level_text = oracle_parts[i+2];
            }
            levels.push(
                <div className="level" key={i}>
                    <div className={`level-info ${i % 2 === 0 ? "highlight" : ""}`} style={{display: 'flex', justifyContent: 'space-between'}}>
                        <OracleTextCleaner text={level_number} className={"level-range"}/>
                        <OracleTextCleaner text={level_text} className={"level-text"}/>
                        <div className="level-stats">{power_toughness}</div>
                    </div>
                </div>
            );
            if(i!==0) {i+=2}
        }
    }

    if (type_line.includes("Planeswalker")) {
        const oracle_parts = oracle_text.split('\n');
        oracle_parts.forEach((part, index) => {
            // console.log("steve ", part)
            const abilityRegex = /((\+|−|-|0)[0-9]*:)/;

            if (abilityRegex.test(part)) {
                const cost = part.match(abilityRegex)[0];
                const text = part.replace(new RegExp(escapeRegex(cost)), '').trim();
                abilities.push(
                    <div className="ability" key={index}>
                        <div className={`planeswalker ${index % 2 !== 0 ? "highlight" : ""}`}>
                            <div className="planeswalker-cost-container">
                                <FontAwesomeIcon icon={faSquare} color="black" />
                                <span className="planeswalker-cost">{cost}</span>
                            </div>
                            <OracleTextCleaner className="planeswalker_text"  text={text}/>
                        </div>
                    </div>
                );
            } else if(index === 0){
                planeswalker_text = part;
            }
        });
    }

    return (
        <div className="card-container">
            <CardBackground type_line={type_line} colors={colors} mana_cost={mana_cost} className={"basic-card-background"}>
                <div className="card-frame">
                    <div className="frame-header card-color-border" style={getBorderStyle(colors, mana_cost)}>
                        <h1 className="name">{name}</h1>
                        <ManaCost manaCost={mana_cost}/>
                    </div>
                    <div className="frame-image card-color-border-square" style={getBorderStyle(colors, mana_cost)}>
                        {imageData && <img src={`data:image/png;base64,${imageData.image}`} alt="Generated" />}
                    </div>
                    <div className="frame-type-line card-color-border" style={getBorderStyle(colors, mana_cost)}>
                        <h1 className="type">{type_line}</h1>
                        {set}
                    </div>
                    <div className="frame-text-box card-color-border-square" style={getBorderStyle(colors, mana_cost)}>
                       {type_line.includes("Planeswalker") ? (
                            <React.Fragment>
                                {planeswalker_text &&<OracleTextCleaner text={planeswalker_text} className="planeswalker_text" /> }
                                <div className="planeswalker_abilities">
                                    {abilities}
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
                                {(type_line.includes("Creature") || type_line.includes("Vehicle")) && !oracle_text.includes("Level up") ? (
                                    <div className="power-toughness">{power}/{toughness}</div>
                                ) : type_line.includes("Planeswalker") ? (
                                    <div className="power-toughness">{loyalty}</div>
                                ) : null}
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </CardBackground>
        </div>
    )
}

export default BasicFrame;
