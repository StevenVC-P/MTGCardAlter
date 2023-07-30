// ManaSymbols.js

function importAll(r) {
 let images = {};
  r.keys().forEach((item, index) => { 
    images[item.replace('./', '')] = r(item); 
  });
  return images;
}

const baseManaSymbols = importAll(require.context('../../assets/ManaSymbols/base', false, /\.(png|jpe?g|svg)$/));
const hybridManaSymbols = importAll(require.context('../../assets/ManaSymbols/hybrid', false, /\.(png|jpe?g|svg)$/));
const PhyrexianManaSymbols = importAll(require.context('../../assets/ManaSymbols/phy', false, /\.(png|jpe?g|svg)$/));


export const manaSymbols = { ...baseManaSymbols, ...hybridManaSymbols, ...PhyrexianManaSymbols };
