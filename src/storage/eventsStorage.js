const STORAGE_KEY = "eventcarry-events";

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read EventCarry data:", error);
    return [];
  }
}

function writeStorage(events) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(events)
    );
  } catch (error) {
    console.error("Failed to save EventCarry data:", error);
  }
}

export function getEvents() {
  return readStorage();
}

export function saveEvents(events) {
  writeStorage(events);
}

export function createEvent(event) {
  const events = readStorage();

  const updatedEvents = [...events, event];

  writeStorage(updatedEvents);

  return event;
}

export function updateEvent(eventId, updates) {
  const events = readStorage();

  const updatedEvents = events.map((event) =>
    event.id === eventId
      ? {
          ...event,
          ...updates,
        }
      : event
  );

  writeStorage(updatedEvents);

  return updatedEvents.find(
    (event) => event.id === eventId
  );
}

export function deleteEvent(eventId) {
  const events = readStorage();

  const updatedEvents = events.filter(
    (event) => event.id !== eventId
  );

  writeStorage(updatedEvents);

  return updatedEvents;
}

export function createItem(eventId, item) {
  const events = readStorage();

  const updatedEvents = events.map((event) => {
    if (event.id !== eventId) {
      return event;
    }

    return {
      ...event,
      items: [
        ...(event.items || []),
        item,
      ],
    };
  });

  writeStorage(updatedEvents);

  return updatedEvents;
}

export function updateItem(
  eventId,
  itemId,
  updates
) {
  const events = readStorage();

  const updatedEvents = events.map((event) => {
    if (event.id !== eventId) {
      return event;
    }

    return {
      ...event,
      items: (event.items || []).map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...updates,
            }
          : item
      ),
    };
  });

  writeStorage(updatedEvents);

  return updatedEvents;
}

export function deleteItem(
  eventId,
  itemId
) {
  const events = readStorage();

  const updatedEvents = events.map((event) => {
    if (event.id !== eventId) {
      return event;
    }

    return {
      ...event,
      items: (event.items || []).filter(
        (item) => item.id !== itemId
      ),
    };
  });

  writeStorage(updatedEvents);

  return updatedEvents;
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
}