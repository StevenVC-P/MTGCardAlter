export const stylingFormatter = (type_line, className, text) => {
  const styles = {
    fontSize: '1em',
    textAlign: 'left',
    alignItems: 'left',
    display: 'flex',
    flexDirection: 'row',
    iconSize: '15px',
    justifyContent: 'space-around',
    height: '100%',
    marginLeft: '4px',
  };

  if (type_line && (type_line.includes('Plane ') || type_line.includes('Phenomenon') )) {
      console.log(type_line)
    styles.fontSize = '0.6em';
    styles.flexDirection = 'column';
    styles.iconSize = '8px';
    styles.width = '100%';
  }
  else if (type_line && type_line.includes('Saga')) {
    styles.fontSize = text.length <= 50 ? '.55em' : text.length <= 200 ? '0.55em' : '0.5em';
    styles.display = 'flex';
    styles.flexDirection = text.length <= 50 ? 'row' : 'column';
    styles.iconSize = text.length <= 50 ? '10px' : '8px';
    styles.width = '100%';
    styles.marginLeft = '0';
  } else if (className && className.includes('split')) {
    styles.fontSize = text.length <= 50 ? '.6em' : '0.57em';
    styles.flexDirection = 'column';
    styles.width = '100%';
    styles.iconSize = text.length <= 50 ? '10px' : '8px';
  } else if (className && className.includes('planeswalker')) {
    styles.fontSize = '.5em';
    styles.iconSize = '18px';
    styles.alighnItems = 'center';
    styles.marginLeft = '0';  
      if (text.length <= 50) {
        styles.fontSize = '.6em';
      } else if (text.length > 50 && text.length <= 100) {
        styles.fontSize = '0.55em';
      }
  } else if (className && className.includes('level')) {
    styles.fontSize = '.5em';
    styles.iconSize = '18px';
    styles.alighnItems = 'center';  
    styles.marginLeft = '0';
      if (text.length <= 50) {
        styles.fontSize = '.8em';
      } else if (text.length > 50 && text.length <= 100) {
        styles.fontSize = '0.55em';
      }
  } else {
    if (text.length <= 50) {
        styles.fontSize = '1em'; 
        styles.textAlign = 'center';
        styles.justifyContent = 'center'; 
        styles.alignItems = 'center';
        styles.flexDirection = 'column';
        styles.width = '100%';
        styles.marginLeft = '0';
    } else if (text.length > 50 && text.length <= 100) {
        styles.fontSize = '0.8em';
        styles.flexDirection = 'column';
        styles.iconSize = '8px';
        styles.width = '100%';
      } else if (text.length > 100 && text.length <= 200) {
        styles.fontSize = '0.6em';
        styles.flexDirection = 'column';
        styles.iconSize = '8px';
        styles.width = '100%';
      } else if (text.length > 200) {
        styles.fontSize = '0.55em';
        styles.flexDirection = 'column';
        styles.alignItems = 'space-around';
        styles.iconSize = '8px';
        styles.width = '100%';
      }
  }

  return styles;
};
