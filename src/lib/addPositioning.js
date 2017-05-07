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

export default addPositioning
