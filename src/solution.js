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
  const prevClashingEvents = beforeIndex.filter((prevEvent) => eventsClash(currentEvent, prevEvent))// beforeIndex.filter((prevEvent) => prevEvent.end > start) // maybe create filterUntil
  const nextClashingEvents = afterIndex.filter((nextEvent) => eventsClash(currentEvent, nextEvent)) // afterIndex.filter((nextEvent) => nextEvent.start < end) // maybe create filterUntil
  // this could be done as a bigger filter that checks if an element is in before/after and applies functionality
  return { prevClashingEvents, nextClashingEvents }
}

function makeWidthPercentage (widthModifier) {
  return 1 / widthModifier * 100
}

function makeCalendarItem ({ start, end, prevClashingEvents, nextClashingEvents, id, widthPercentage, left }, i) {
  return `
    <div class="item" style="top:${start}px; left: ${left}%; height: ${end - start}px; width: ${widthPercentage}%;">
      ${start}/${end} <br /> 
      clashing: ${prevClashingEvents.length + nextClashingEvents.length} <br/> 
    </div>
  `
}

function addPositioning (events) {
  for (let i = 0; i < events.length; i++) {
    const theLeft = getLeftSpacing(events, events[i])
    events[i].left = theLeft
  }

  return events
}

function getLeftSpacing (events, event) {
  const prevClashing = event.prevClashingEvents

  if (prevClashing.length === 0) {
    return 0
  } else {
    const prevIds = prevClashing.map(e => e.id)
    const takenLefts = events.filter(e => prevIds.indexOf(e.id) > -1).map(e => e.left)
    let currentLeft = 0

    while (takenLefts.indexOf(currentLeft) > -1) {
      currentLeft += event.widthPercentage
    }

    return currentLeft
  }
}

function layOutDay (events) {
  const enrichedEvents = enrichEvents(events)
  const positionedEvents = addPositioning(enrichedEvents)

  const result = positionedEvents.map(makeCalendarItem).join('')
  document.getElementById('app').innerHTML = result
}

function orderFromStartAsc (a, b) {
  // order events from start ascending
  // if start time the same, end is the tieBreaker
  if (a.start !== b.start) {
    return a.start < b.start ? -1 : 1
  } else {
    return a.end < b.end ? -1 : 1
  }
}

window.layOutDay = layOutDay

let calendarItems = [

{start: 30, end: 120},

{start: 30, end: 90},

{start: 200, end: 250},

{start: 400, end: 450},

{start: 420, end: 470},

{start: 30, end: 150},

{start: 440, end: 490},

{start: 540, end: 600},

{start: 560, end: 620},

{start: 610, end: 670},

{start: 610, end: 670}

]

layOutDay(calendarItems)
