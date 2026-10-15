// src/services/officialsService.js
import defaultOfficials from "../data/officials.json";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

const STORAGE_KEY = "ufa_leadership_officials";
const EVENT_CHANGE_KEY = "ufa_officials_updated";

export function getOfficials() {
  if (typeof window === "undefined") return defaultOfficials;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultOfficials));
      return defaultOfficials;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return defaultOfficials;
  } catch (err) {
    console.warn("Failed to load officials from localStorage:", err);
    return defaultOfficials;
  }
}

export function saveOfficials(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(EVENT_CHANGE_KEY));
  } catch (err) {
    console.error("Failed to save officials to localStorage:", err);
  }
}

export async function fetchOfficialsFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return getOfficials();

  try {
    const { data, error } = await supabase
      .from("officials")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) {
      const mapped = data.map((item) => ({
        id: item.id,
        name: item.name,
        title: item.title,
        bio: item.bio || "",
        image: item.image_url || item.image || "",
        displayOrder: item.display_order ?? item.id,
        isActive: item.is_active !== false
      }));
      saveOfficials(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn("Could not fetch remote officials, using local cache:", err.message);
  }
  return getOfficials();
}

export async function addOfficial(officialData) {
  const current = getOfficials();
  const nextId = current.length > 0
    ? Math.max(...current.map((o) => (typeof o.id === "number" ? o.id : 0))) + 1
    : 1;

  const newOfficial = {
    ...officialData,
    id: officialData.id || nextId,
    displayOrder: officialData.displayOrder || nextId,
    isActive: officialData.isActive !== false
  };

  const updated = [...current, newOfficial];
  saveOfficials(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("officials").insert([
        {
          id: newOfficial.id,
          name: newOfficial.name,
          title: newOfficial.title,
          bio: newOfficial.bio || "",
          image_url: newOfficial.image || "",
          display_order: newOfficial.displayOrder,
          is_active: newOfficial.isActive
        }
      ]);
    } catch (err) {
      console.warn("Could not sync added official to Supabase:", err.message);
    }
  }

  return newOfficial;
}

export async function updateOfficial(id, updatedFields) {
  const current = getOfficials();
  const updated = current.map((item) =>
    String(item.id) === String(id) ? { ...item, ...updatedFields } : item
  );
  saveOfficials(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {};
      if (updatedFields.name !== undefined) payload.name = updatedFields.name;
      if (updatedFields.title !== undefined) payload.title = updatedFields.title;
      if (updatedFields.bio !== undefined) payload.bio = updatedFields.bio;
      if (updatedFields.image !== undefined) payload.image_url = updatedFields.image;
      if (updatedFields.displayOrder !== undefined) payload.display_order = updatedFields.displayOrder;
      if (updatedFields.isActive !== undefined) payload.is_active = updatedFields.isActive;

      await supabase.from("officials").update(payload).eq("id", id);
    } catch (err) {
      console.warn("Could not sync official update to Supabase:", err.message);
    }
  }
}

export async function deleteOfficial(id) {
  const current = getOfficials();
  const updated = current.filter((item) => String(item.id) !== String(id));
  saveOfficials(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("officials").delete().eq("id", id);
    } catch (err) {
      console.warn("Could not sync official deletion to Supabase:", err.message);
    }
  }
}

export function resetToDefaultOfficials() {
  saveOfficials(defaultOfficials);
}

export function subscribeToOfficials(callback) {
  if (typeof window === "undefined") return () => {};

  const handler = () => {
    callback(getOfficials());
  };

  window.addEventListener(EVENT_CHANGE_KEY, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(EVENT_CHANGE_KEY, handler);
    window.removeEventListener("storage", handler);
  };
}

