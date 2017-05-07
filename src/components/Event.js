import React from 'react'

const Event = ({ start, end, prevClashingEvents, nextClashingEvents, id, widthPercentage, left }) => {
  return (
    <div className='event' style={{
      top: start + 'px',
      left: left + '%',
      height: end - start + 'px',
      width: widthPercentage + '%'
    }}>
      <div className='inner'>
        <div className='marker' />
        <h3 className='title'>An event</h3>
        <p className='description'>clashing: {prevClashingEvents.length + nextClashingEvents.length}</p>
      </div>
    </div>
  )
}

export default Event
