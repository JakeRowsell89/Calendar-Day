import React from 'react'

const Background = () => {
  const hours = '*'.repeat(12).split('') // magic number bad
  return (
    <div id='calendar-background'>
      {hours.map(() => <div />)}
    </div>
  )
}

export default Background
