// src/services/upcomingEventsService.js
import { defaultUpcomingEvents } from "../data/upcomingEvents";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

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

export async function fetchUpcomingEventsFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return getUpcomingEvents();

  try {
    const { data, error } = await supabase
      .from("upcoming_events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      const mapped = data.map((item) => ({
        ...item,
        image: item.image_url || item.image || "",
        registrationLink: item.registration_link || item.registrationLink || "",
        isPublished: item.is_published !== false
      }));
      saveUpcomingEvents(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn("Could not fetch remote events, using local cache:", err.message);
  }
  return getUpcomingEvents();
}

export async function addUpcomingEvent(eventData) {
  const current = getUpcomingEvents();
  const newEvent = {
    ...eventData,
    id: eventData.id || `event-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    image: eventData.image || eventData.imageUrl || "",
    createdAt: new Date().toISOString(),
    isPublished: eventData.isPublished !== false
  };
  const updated = [newEvent, ...current];
  saveUpcomingEvents(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("upcoming_events").insert([
        {
          id: newEvent.id,
          title: newEvent.title,
          subtitle: newEvent.subtitle || "",
          category: newEvent.category || "Leadership Summit",
          date: newEvent.date,
          time: newEvent.time || "",
          location: newEvent.location || "",
          platform: newEvent.platform || "",
          speakers: Array.isArray(newEvent.speakers) ? newEvent.speakers : [],
          registration_link: newEvent.registrationLink || "",
          badge: newEvent.badge || "",
          description: newEvent.description || "",
          image_url: newEvent.image || "",
          is_published: newEvent.isPublished
        }
      ]);
    } catch (err) {
      console.warn("Could not sync added event to Supabase:", err.message);
    }
  }

  return newEvent;
}

export async function updateUpcomingEvent(id, updatedFields) {
  const current = getUpcomingEvents();
  const updated = current.map((item) =>
    item.id === id ? { ...item, ...updatedFields } : item
  );
  saveUpcomingEvents(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {};
      if (updatedFields.title !== undefined) payload.title = updatedFields.title;
      if (updatedFields.subtitle !== undefined) payload.subtitle = updatedFields.subtitle;
      if (updatedFields.category !== undefined) payload.category = updatedFields.category;
      if (updatedFields.date !== undefined) payload.date = updatedFields.date;
      if (updatedFields.time !== undefined) payload.time = updatedFields.time;
      if (updatedFields.location !== undefined) payload.location = updatedFields.location;
      if (updatedFields.platform !== undefined) payload.platform = updatedFields.platform;
      if (updatedFields.speakers !== undefined) payload.speakers = updatedFields.speakers;
      if (updatedFields.registrationLink !== undefined) payload.registration_link = updatedFields.registrationLink;
      if (updatedFields.badge !== undefined) payload.badge = updatedFields.badge;
      if (updatedFields.description !== undefined) payload.description = updatedFields.description;
      if (updatedFields.image !== undefined) payload.image_url = updatedFields.image;
      if (updatedFields.isPublished !== undefined) payload.is_published = updatedFields.isPublished;

      await supabase.from("upcoming_events").update(payload).eq("id", id);
    } catch (err) {
      console.warn("Could not sync updated event to Supabase:", err.message);
    }
  }
}

export async function deleteUpcomingEvent(id) {
  const current = getUpcomingEvents();
  const updated = current.filter((item) => item.id !== id);
  saveUpcomingEvents(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("upcoming_events").delete().eq("id", id);
    } catch (err) {
      console.warn("Could not sync deleted event to Supabase:", err.message);
    }
  }
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
