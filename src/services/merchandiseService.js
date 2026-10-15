// src/services/merchandiseService.js
import { defaultMerchandise } from "../data/merchandise";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

const STORAGE_KEY = "ufa_merchandise_items";
const EVENT_CHANGE_KEY = "ufa_merchandise_updated";

export function getMerchandise() {
  if (typeof window === "undefined") return defaultMerchandise;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMerchandise));
      return defaultMerchandise;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return defaultMerchandise;
  } catch (err) {
    console.warn("Failed to load merchandise from localStorage:", err);
    return defaultMerchandise;
  }
}

export function saveMerchandise(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(EVENT_CHANGE_KEY));
  } catch (err) {
    console.error("Failed to save merchandise to localStorage:", err);
  }
}

export async function fetchMerchandiseFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return getMerchandise();

  try {
    const { data, error } = await supabase
      .from("merchandise")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      const mapped = data.map((item) => ({
        id: item.id,
        name: item.name,
        desc: item.desc || item.description || "",
        badge: item.badge || "",
        image: item.image_url || item.image || "",
        isActive: item.is_active !== false,
        createdAt: item.created_at
      }));
      saveMerchandise(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn("Could not fetch remote merchandise, using local cache:", err.message);
  }
  return getMerchandise();
}

export async function addMerchandiseItem(itemData) {
  const current = getMerchandise();
  const newItem = {
    ...itemData,
    id: itemData.id || `merch-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    isActive: itemData.isActive !== false,
    createdAt: new Date().toISOString()
  };

  const updated = [newItem, ...current];
  saveMerchandise(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("merchandise").insert([
        {
          id: newItem.id,
          name: newItem.name,
          desc: newItem.desc || "",
          badge: newItem.badge || "",
          image_url: newItem.image || "",
          is_active: newItem.isActive
        }
      ]);
    } catch (err) {
      console.warn("Could not sync new merchandise item to Supabase:", err.message);
    }
  }

  return newItem;
}

export async function updateMerchandiseItem(id, updatedFields) {
  const current = getMerchandise();
  const updated = current.map((item) =>
    item.id === id ? { ...item, ...updatedFields } : item
  );
  saveMerchandise(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {};
      if (updatedFields.name !== undefined) payload.name = updatedFields.name;
      if (updatedFields.desc !== undefined) payload.desc = updatedFields.desc;
      if (updatedFields.badge !== undefined) payload.badge = updatedFields.badge;
      if (updatedFields.image !== undefined) payload.image_url = updatedFields.image;
      if (updatedFields.isActive !== undefined) payload.is_active = updatedFields.isActive;

      await supabase.from("merchandise").update(payload).eq("id", id);
    } catch (err) {
      console.warn("Could not sync merchandise update to Supabase:", err.message);
    }
  }
}

export async function deleteMerchandiseItem(id) {
  const current = getMerchandise();
  const updated = current.filter((item) => item.id !== id);
  saveMerchandise(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("merchandise").delete().eq("id", id);
    } catch (err) {
      console.warn("Could not sync merchandise deletion to Supabase:", err.message);
    }
  }
}

export function resetToDefaultMerchandise() {
  saveMerchandise(defaultMerchandise);
}

export function subscribeToMerchandise(callback) {
  if (typeof window === "undefined") return () => {};

  const handler = () => {
    callback(getMerchandise());
  };

  window.addEventListener(EVENT_CHANGE_KEY, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(EVENT_CHANGE_KEY, handler);
    window.removeEventListener("storage", handler);
  };
}

