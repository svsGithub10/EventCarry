import { useCallback, useEffect, useState } from "react";

import {
  getEvents,
  saveEvents,
} from "../storage/eventsStorage";

export function useEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const updateEvents = useCallback((nextEvents) => {
    setEvents(nextEvents);
    saveEvents(nextEvents);
  }, []);

  return {
    events,
    setEvents: updateEvents,
  };
}