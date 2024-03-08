export const stylingFormatter = (type_line, className, text, layout, flavortext) => {
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
    whiteSpace: 'normal',
  };

  if (type_line && (type_line.includes('Plane ') || type_line.includes('Phenomenon') )) {
    styles.fontSize = '0.6em';
    styles.flexDirection = 'column';
    styles.iconSize = '8px';
    styles.width = '99%';
  }
  else if (type_line && type_line.includes('Saga')) {
    styles.fontSize = text.length <= 50 ? '.7em' : text.length <= 200 ? '0.55em' : '0.5em';
    styles.display = 'flex';
    styles.flexDirection = text.length <= 50 ? 'row' : 'column';
    styles.iconSize = text.length <= 50 ? '10px' : '8px';
    styles.width = '99%';
    styles.marginLeft = '2px';
    styles.marginTop = '5px';  
  } else if (className && className.includes('split')) {
    styles.fontSize = text.length <= 50 ? '.6em' : '0.57em';
    styles.flexDirection = 'column';
    styles.width = '99%';
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
  } else if (layout && layout.includes('adventure')) {
    styles.fontSize = '.67em';
    styles.iconSize = '18px';
    styles.alighnItems = 'center';
    styles.marginLeft = '5px';
    styles.marginRight = '5px';  
    styles.marginTop = '5px';  
      if (text.length <= 50) {
        styles.fontSize = '.55em';
      } else if (text.length > 50 && text.length <= 100) {
        styles.fontSize = '.65em';
      }
  } else {
    if (text.length <= 50) {
        styles.fontSize = '1em'; 
        styles.textAlign = 'center';
        styles.justifyContent = 'center'; 
        styles.alignItems = 'center';
        styles.flexDirection = 'column';
        styles.width = '99%';
        styles.marginLeft = '0';
    } else if (text.length > 50 && text.length <= 100) {
        styles.fontSize = '0.8em';
        styles.flexDirection = 'column';
        styles.iconSize = '8px';
        styles.width = '99%';
      } else if (text.length > 100 && text.length <= 200) {
        styles.fontSize = '0.6em';
        styles.flexDirection = 'column';
        styles.iconSize = '8px';
        styles.width = '99%';
      } else if (text.length > 200) {
        styles.fontSize = '0.55em';
        styles.flexDirection = 'column';
        styles.alignItems = 'space-around';
        styles.iconSize = '8px';
        styles.width = '99%';
      }
  }

  if(flavortext) {
    styles.fontSize = '0.8em';
    styles.textAlign = 'left';
    styles.alignItems= 'flex-start';
  }

  return styles;
};
