import React from 'react';

const Paragraph = props => {
  return (
    <p style={{ width: "100%", textAlign: "justify" }}>
      {props.children}
    </p>
  )
}

export default Paragraph