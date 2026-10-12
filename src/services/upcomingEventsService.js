// src/services/upcomingEventsService.js
import { defaultUpcomingEvents } from "../data/upcomingEvents";

const STORAGE_KEY = "ufa_upcoming_events";

// In-memory cache & custom event broadcaster for multi-component reactivity
const EVENT_CHANGE_KEY = "ufa_events_updated";

export function getUpcomingEvents() {
  if (typeof window === "undefined") return defaultUpcomingEvents;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with default upcoming events
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUpcomingEvents));
      return defaultUpcomingEvents;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    // If empty array or invalid, restore defaults
    return defaultUpcomingEvents;
  } catch (err) {
    console.warn("Failed to load upcoming events from localStorage:", err);
    return defaultUpcomingEvents;
  }
}

export function saveUpcomingEvents(events) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    window.dispatchEvent(new Event(EVENT_CHANGE_KEY));
  } catch (err) {
    console.error("Failed to save upcoming events:", err);
  }
}

export function addUpcomingEvent(eventData) {
  const current = getUpcomingEvents();
  const newEvent = {
    ...eventData,
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
    isPublished: eventData.isPublished !== false
  };
  const updated = [newEvent, ...current];
  saveUpcomingEvents(updated);
  return newEvent;
}

export function updateUpcomingEvent(id, updatedFields) {
  const current = getUpcomingEvents();
  const updated = current.map(item => (item.id === id ? { ...item, ...updatedFields } : item));
  saveUpcomingEvents(updated);
}

export function deleteUpcomingEvent(id) {
  const current = getUpcomingEvents();
  const updated = current.filter(item => item.id !== id);
  saveUpcomingEvents(updated);
}

export function resetToDefaultUpcomingEvents() {
  saveUpcomingEvents(defaultUpcomingEvents);
}

export function subscribeToUpcomingEvents(callback) {
  if (typeof window === "undefined") return () => {};

  const handler = () => {
    callback(getUpcomingEvents());
  };

  window.addEventListener(EVENT_CHANGE_KEY, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(EVENT_CHANGE_KEY, handler);
    window.removeEventListener("storage", handler);
  };
}

