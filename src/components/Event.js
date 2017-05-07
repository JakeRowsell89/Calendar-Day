import React from 'react'

const Event = ({ start, end, prevClashingEvents, nextClashingEvents, id, widthPercentage, left }) => {
  return (
    <div className='event' style='top:{start}px; left: {left}%; height: {end - start}px; width: {widthPercentage}%;'>
      {start}/{end} <br />
      clashing: {prevClashingEvents.length + nextClashingEvents.length} <br />
    </div>
  )
}

export default Event
