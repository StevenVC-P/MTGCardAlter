import React from 'react';
import ManaCost from '../Shared/ManaCost';
import OracleTextCleaner from '../Shared/OracleTextCleaner';
import CardBackground from '../Shared/CardBackground';
import { getBorderStyle } from '../Shared/Borders';
import "./Universal.css";
import "./Battles.css";

const Battles = (props) => {
    const source = props.face || props.card;
    const imageData = props.imageData;
    const {name, mana_cost, oracle_text, type_line, set, defense, colors } = source;
    return (
        <div className="card-container">
            <CardBackground type_line={type_line} colors={colors} mana_cost={mana_cost} className={"battle-card-background"}>
                <div className="battle-card-frame">
                    <div className="battle-frame-header card-color-border" style={getBorderStyle(colors)}>
                        <h1 className="name">{name}</h1>
                        <ManaCost manaCost={mana_cost}/>
                    </div>
                        <div className="battle-frame-image card-color-border-square" style={getBorderStyle(colors)}>
                            {imageData && <img src={`data:image/png;base64,${imageData.image}`} alt="Generated" />}
                        </div>
                        <div className="battle-frame-type-line card-color-border" style={getBorderStyle(colors)}>
                            <h1 className="type">{type_line}</h1>
                            {set}
                        </div>
                        <div className="battle-frame-text-box card-color-border-square" style={getBorderStyle(colors)}>
                            <OracleTextCleaner text={oracle_text}/>
                            <div className="defense">{defense}</div>
                        </div>
                </div>
            </CardBackground>
        </div>
    )
}

export default Battles