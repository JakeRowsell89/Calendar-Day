import React from 'react'
import Time from './Time'

export default class Sidebar extends React.Component {
  componentWillMount () {
    if (!Sidebar.times.length) {
      Sidebar.setTimes()
    }
  }

  render () {
    const times = Sidebar.times

    return (
      <div id='sidebar'>
        {
          times.map((time, index) => <Time key={index} {...time} />)
        }
      </div>
    )
  }
}

Sidebar.times = []
Sidebar.setTimes = function (startHours = 9, endHours = 21, twelveHourClock = true) {
  const duration = endHours - startHours
  const calendarTimes = []

  for (let i = 0; i < duration; i++) {
    const rawHour = startHours + i
    let amPm = rawHour > 11 ? 'pm' : 'am'
    let hour = rawHour > 12 ? rawHour - 12 : rawHour

    calendarTimes.push({
      hour,
      postFix: amPm
    })
  }

  Sidebar.times = calendarTimes
}
