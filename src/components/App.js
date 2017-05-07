import React from 'react'
import Calendar from './Calendar'

export default class App extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      events: []
    }

    window.layOutDay = this.update.bind(this)
  }

  update (events) {
    console.log(events)
    this.setState({ events: [].concat(events) })
  }

  render () {
    return (
      <div>
        <Calendar events={this.state.events} />
      </div>
    )
  }
}
