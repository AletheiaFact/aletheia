import React from "react"

const LocalizedDate = ( {date} ) => {
  const localizedDate = new Date(date).toLocaleDateString() 
return (
  <>
  <strong>{localizedDate}</strong>&nbsp;
  </>
  )
}

export default LocalizedDate