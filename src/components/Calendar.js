import React from 'react'
import Sidebar from './Sidebar'
import Event from './Event'
import Background from './Background'
import enrichEvents from '../lib/enrichEvents'
import addPositioning from '../lib/addPositioning'

export default class App extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      events: this.props.events
    }
  }

  componentWillReceiveProps (nextProps) {
    const enrichedEvents = enrichEvents(nextProps.events)
    const positionedEvents = addPositioning(enrichedEvents)
    this.setState({ events: [].concat(positionedEvents) })
  }

  render () {
    return (
      <div id='calendar-wrapper'>
        <Sidebar />
        <div id='calendar'>
          {this.state.events.map(event =>
            <Event key={event.id} {...event} />
          )}
          <Background />
        </div>
      </div>
    )
  }
}
