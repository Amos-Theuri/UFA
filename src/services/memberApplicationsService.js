// src/services/memberApplicationsService.js
// Service for fetching, managing, and tracking submitted UFA membership applications
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

const STORAGE_KEY = "ufa_join_applications";
const EVENT_CHANGE_KEY = "ufa_applications_updated";

export const sampleApplications = [
  {
    id: "app-sample-1",
    name: "Faith Wambui",
    email: "faith.wambui@example.com",
    contact: "+254 712 345 678",
    county: "Nairobi",
    areaOfInterest: "Youth Networking & Mentorship",
    status: "pending",
    notes: "Interested in joining the county summit planning committee.",
    submittedAt: "2026-10-15T10:30:00.000Z"
  },
  {
    id: "app-sample-2",
    name: "Brian Kiprono",
    email: "brian.kiprono@example.com",
    contact: "+254 723 456 789",
    county: "Uasin Gishu",
    areaOfInterest: "Career Guidance & Job Readiness",
    status: "contacted",
    notes: "Contacted via phone on Oct 14. Shared chapter briefing packet.",
    submittedAt: "2026-10-14T14:15:00.000Z"
  },
  {
    id: "app-sample-3",
    name: "Mercy Achieng",
    email: "mercy.achieng@example.com",
    contact: "+254 734 567 890",
    county: "Kisumu",
    areaOfInterest: "Mental Health Awareness & Wellness",
    status: "approved",
    notes: "Approved for Western Kenya regional youth fellowship cohort.",
    submittedAt: "2026-10-12T09:00:00.000Z"
  }
];

export function getMemberApplications() {
  if (typeof window === "undefined") return sampleApplications;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleApplications));
      return sampleApplications;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return sampleApplications;
  } catch (err) {
    console.warn("Failed to load membership applications from localStorage:", err);
    return sampleApplications;
  }
}

export function saveMemberApplications(applications) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    window.dispatchEvent(new Event(EVENT_CHANGE_KEY));
  } catch (err) {
    console.error("Failed to save membership applications:", err);
  }
}

export async function fetchMemberApplicationsFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return getMemberApplications();

  try {
    const { data, error } = await supabase
      .from("membership_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      const mapped = data.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        contact: item.contact,
        county: item.county,
        areaOfInterest: item.area_of_interest || item.areaOfInterest || "General Membership",
        status: item.status || "pending",
        notes: item.notes || "",
        submittedAt: item.created_at || item.submittedAt || new Date().toISOString()
      }));
      saveMemberApplications(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn("Could not fetch membership applications from Supabase:", err.message);
  }
  return getMemberApplications();
}

export async function updateApplicationStatus(id, newStatus, notes) {
  const current = getMemberApplications();
  const updated = current.map((item) => {
    if (String(item.id) === String(id)) {
      return {
        ...item,
        status: newStatus !== undefined ? newStatus : item.status,
        notes: notes !== undefined ? notes : item.notes
      };
    }
    return item;
  });

  saveMemberApplications(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {};
      if (newStatus !== undefined) payload.status = newStatus;
      if (notes !== undefined) payload.notes = notes;

      await supabase
        .from("membership_applications")
        .update(payload)
        .eq("id", id);
    } catch (err) {
      console.warn("Could not sync application status update to Supabase:", err.message);
    }
  }
}

export async function deleteMemberApplication(id) {
  const current = getMemberApplications();
  const updated = current.filter((item) => String(item.id) !== String(id));
  saveMemberApplications(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from("membership_applications")
        .delete()
        .eq("id", id);
    } catch (err) {
      console.warn("Could not sync application deletion to Supabase:", err.message);
    }
  }
}

export function subscribeToApplications(callback) {
  if (typeof window === "undefined") return () => {};

  const handler = () => {
    callback(getMemberApplications());
  };

  window.addEventListener(EVENT_CHANGE_KEY, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(EVENT_CHANGE_KEY, handler);
    window.removeEventListener("storage", handler);
  };
}

