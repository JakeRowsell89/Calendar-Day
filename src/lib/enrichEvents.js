function enrichEvents (events) {
  // now we have overlap, figure out how the MAX overlaps of an event
  // a layered progressive overlap could all have the same number but not require a higher divisor
  const eventsWithIds = events.sort(orderFromStartAsc).map(attachId)
  const eventsWithClashes = eventsWithIds.map((event, index) => addOverlapsToEvent(eventsWithIds, event, index))
  return addMaxClashes(eventsWithClashes)
}

function attachId (event, index) {
  return Object.assign({}, event, { id: index })
}

function addMaxClashes (events) {
  let eventClashCache = {}
  const uniqueTimes = getUniqueEventTimes(events)

  uniqueTimes.forEach(time => {
    const eventsAtTime = getEventsAtTime(events, time)
    eventsAtTime.forEach(({ id }) => {
      eventClashCache[id] = Math.max(eventClashCache[id] || 0, eventsAtTime.length) // not sure, try more use cases
    })
  })

  events.forEach(event => {
    const nextIds = event.nextClashingEvents.map(e => e.id)
    nextIds.forEach(id => {
      if (eventClashCache[id] > eventClashCache[event.id]) {
        eventClashCache[event.id] = eventClashCache[id]
      }
    })
  })

  // for each event, get how many clases happen simultaneously
  // set its max clashes to the highest between that and the highest its clashing events have
  return events.map((event) => {
    return Object.assign({}, event, {
      widthPercentage: makeWidthPercentage(eventClashCache[event.id])
    })
  })
}

function getEventsAtTime (events, time) {
  const eventTimeObj = { start: time, end: time}
  return events.filter(event => eventsClash(event, eventTimeObj))
}

function getUniqueEventTimes (events) {
  let times = events.reduce((times, event) => {
    return times.concat([event.start, event.end])
  }, [])
  return [...new Set(times)]
}

function addOverlapsToEvent (events, event, index) {
  const { prevClashingEvents, nextClashingEvents } = getClashingEvents(events, index)
  return Object.assign({}, event, { prevClashingEvents, nextClashingEvents })
}

function eventsClash (event1, event2) {
  // event1 start >= event2 start && event1 start <= event2 end
  // event2 start >= event1 start && event2 start <= event2 end
  return startClashesWithEvent(event1, event2) || startClashesWithEvent(event2, event1)
}

function startClashesWithEvent ({ start }, event) {
  return start >= event.start && start <= event.end
}

function getClashingEvents (events, index) {
  const currentEvent = events[index]
  const beforeIndex = events.slice(0, index)
  const afterIndex = events.slice(index + 1)
  const prevClashingEvents = beforeIndex.filter((prevEvent) => eventsClash(currentEvent, prevEvent))
  const nextClashingEvents = afterIndex.filter((nextEvent) => eventsClash(currentEvent, nextEvent))
  // this could be done as a bigger filter that checks if an element is in before/after and applies functionality
  return { prevClashingEvents, nextClashingEvents }
}

function makeWidthPercentage (widthModifier) {
  return 1 / widthModifier * 100
}

function orderFromStartAsc (a, b) {
  if (a.start !== b.start) {
    return a.start < b.start ? -1 : 1
  } else {
    return a.end < b.end ? -1 : 1
  }
}

export default enrichEvents
