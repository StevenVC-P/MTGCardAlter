import React from "react";

const Card = ({ card }) => {
  const { name, image_uris, oracle_text, rules } = card;

  return (
    <div className="card-result">
      <div className="card-name">{name}</div>
      <img className="card-image" src={image_uris.normal} alt={name} />
      <div className="card-text">{oracle_text}</div>
      {/* <div className="card-rules">{rules}</div> */}
    </div>
  );
}

export default Card;