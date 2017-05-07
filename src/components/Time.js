import React from 'react'

const Time = ({ hour, postFix }) => {
  return (
    <div className='time-block'>
      <div className='whole-hour'>
        {hour}
        <span>
          {postFix}
        </span>
      </div>
      <div className='half-hour'>
        {hour}:30
      </div>
    </div>
  )
}

export default Time
