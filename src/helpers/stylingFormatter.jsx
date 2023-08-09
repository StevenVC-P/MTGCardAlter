export const stylingFormatter = (type_line, className, text) => {
  const styles = {
    fontSize: '1em',
    textAlign: 'left',
    alignItems: 'left',
    display: 'flex',
    flexDirection: 'row',
    iconSize: '15px',
    justifyContent: 'space-around',
    width: '100%' ,
    height: '100%'
  };
// styles.alignItems = 'center';    
//styles.textAlign = 'center';
    // styles.justifyContent = 'center';
    // styles.alignItems = 'center';
  if (type_line && type_line.includes('Saga')) {
    styles.fontSize = text.length <= 50 ? '.55em' : text.length <= 200 ? '0.55em' : '0.5em';
    styles.textAlign = 'left';
    styles.display = 'flex';
    styles.flexDirection = text.length <= 50 ? 'row' : 'column';
    styles.iconSize = text.length <= 50 ? '10px' : '8px';
  } else if (className && className.includes('split')) {
    styles.fontSize = text.length <= 50 ? '.6em' : '0.5em';
    styles.textAlign = 'left';
    styles.flexDirection = 'column';
    styles.iconSize = text.length <= 50 ? '10px' : '8px';
  } else if (className && className.includes('planeswalker')) {
    styles.fontSize = '.6em';
    styles.textAlign = 'left';
    styles.iconSize = '8px';
  } else {
    if (text.length <= 50) {
        styles.fontSize = '1em'; 
        styles.textAlign = 'center';
        styles.justifyContent = 'center'; 
        styles.alignItems = 'center';
        styles.flexDirection = 'column';
  } else if (text.length > 50 && text.length <= 100) {
      styles.fontSize = '0.6em';
      styles.flexDirection = 'column';
      styles.iconSize = '8px';
    } else if (text.length > 100 && text.length <= 200) {
      styles.fontSize = '0.6em';
      styles.flexDirection = 'column';
      styles.iconSize = '8px';
    } else if (text.length > 200) {
      styles.fontSize = '0.45em';
      styles.flexDirection = 'column';
      styles.alignItems = 'space-around';
      styles.iconSize = '8px';
    }
  }

  return styles;
};
