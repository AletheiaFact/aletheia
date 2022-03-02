import React from "react"

const ClaimDate = ( {date} ) => {
  const localizedDate = new Date(date).toLocaleDateString() 
return (
  <>
  <strong>{localizedDate}</strong>&nbsp;
  </>
  )
}

export default ClaimDate