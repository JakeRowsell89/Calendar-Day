import React from 'react'
import Event from './Event'

export default class App extends React.Component {
  constructor () {
    super()
    this.state = {
      events: []
    }
  }
  render () {
    return (
      <div id='calendar'>
        {this.state.events.map(event =>
          <Event key={event.id} event={event} />
        )}
      </div>
    )
  }
}
