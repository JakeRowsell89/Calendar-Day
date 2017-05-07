import React from 'react'
import Calendar from './Calendar'

export default class App extends React.Component {
  render () {
    return (
      <div>
        <Calendar events={this.state.events} />
      </div>
    )
  }
}
