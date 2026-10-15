// src/services/adminAuthService.js
// Production-grade authentication service for UFA Admin Portal using Supabase Auth (Server-side JWT)
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

const DEV_SANDBOX_KEY = "ufa_admin_dev_sandbox";

/**
 * Sign in administrator using Supabase Auth (Server-side authenticated session).
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: Object, session: Object }>}
 */
export async function adminLogin(email, password) {
  if (!email || !password) {
    throw new Error("Please enter both email address and password.");
  }

  // If Supabase is configured, authenticate via server-side Supabase Auth
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    if (error) {
      throw new Error(error.message || "Failed to authenticate with Supabase Auth.");
    }

    // Optional: check role in app_metadata if configured
    return {
      user: data.user,
      session: data.session,
      isSandbox: false
    };
  }

  // If Supabase is NOT configured yet (e.g. initial offline setup), fail by default
  // and require explicit development sandbox mode
  throw new Error(
    "Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable secure server-side authentication."
  );
}

/**
 * Activates local development sandbox session when running offline without Supabase backend.
 */
export function activateDevSandbox() {
  if (typeof window === "undefined") return;
  const devSession = {
    user: {
      id: "dev-sandbox-admin",
      email: "developer@local.sandbox",
      role: "admin",
      user_metadata: { name: "Local Dev Administrator" }
    },
    isSandbox: true,
    loginTime: Date.now()
  };
  sessionStorage.setItem(DEV_SANDBOX_KEY, JSON.stringify(devSession));
  return devSession;
}

/**
 * Log out administrator and terminate session.
 */
export async function adminLogout() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(DEV_SANDBOX_KEY);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase signOut error:", err);
    }
  }
}

/**
 * Retrieves the currently authenticated admin user, if any.
 * @returns {Promise<Object|null>}
 */
export async function getAdminUser() {
  if (typeof window === "undefined") return null;

  // Check Supabase session first
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return {
          ...user,
          isSandbox: false
        };
      }
    } catch {
      // Session invalid or expired
    }
  }

  // Check dev sandbox session
  const rawDev = sessionStorage.getItem(DEV_SANDBOX_KEY);
  if (rawDev) {
    try {
      const parsed = JSON.parse(rawDev);
      return {
        ...parsed.user,
        isSandbox: true
      };
    } catch {
      sessionStorage.removeItem(DEV_SANDBOX_KEY);
    }
  }

  return null;
}

/**
 * Subscribes to authentication state changes.
 * @param {Function} callback
 * @returns {Function} Unsubscribe function
 */
export function subscribeToAuth(callback) {
  if (isSupabaseConfigured && supabase) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        callback({ ...session.user, isSandbox: false });
      } else {
        const fallback = await getAdminUser();
        callback(fallback);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }

  // Fallback poller/listener for sandbox
  const handleStorage = () => {
    getAdminUser().then(callback);
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener("storage", handleStorage);
  };
}

/**
 * Sends a password reset email via Supabase Auth.
 * @param {string} email
 */
export async function requestPasswordReset(email) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured to send password reset emails.");
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: `${window.location.origin}/admin`
  });
  if (error) throw error;
  return true;
}
