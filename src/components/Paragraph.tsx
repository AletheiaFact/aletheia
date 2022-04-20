import React from 'react';

const Paragraph = props => {
  return(
    <p style={{width: "100%"}}>
        {props.children}
    </p>
  )
}

export default Paragraph