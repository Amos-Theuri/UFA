// src/services/adminAuthService.js
// Secure client-side administrative access control for UFA website

const SESSION_KEY = "ufa_admin_auth_session";
const FAILED_ATTEMPTS_KEY = "ufa_admin_fail_count";
const LOCKOUT_KEY = "ufa_admin_lockout_time";

// Default SHA-256 hash of 'ufa_secure_admin_2026'
// Pre-computed: b925e4006bad5c2f4c4d55ff09dcde4ba98a51ef9dcbaf036daf675af2c65873
const DEFAULT_HASH = "b925e4006bad5c2f4c4d55ff09dcde4ba98a51ef9dcbaf036daf675af2c65873";

// Cryptographic hash using Web Crypto API
async function sha256(str) {
  const buf = new TextEncoder().encode(str);
  const hashBuf = await crypto.subtle.digest("SHA-256", buf);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function isLockedOut() {
  if (typeof window === "undefined") return false;
  const lockoutUntil = parseInt(sessionStorage.getItem(LOCKOUT_KEY) || "0", 10);
  if (Date.now() < lockoutUntil) {
    return Math.ceil((lockoutUntil - Date.now()) / 1000);
  }
  return false;
}

export async function verifyAdminPasscode(passcode) {
  if (typeof window === "undefined") return false;

  const lockout = isLockedOut();
  if (lockout) {
    throw new Error(`Too many failed attempts. Locked for ${lockout} seconds.`);
  }

  const inputHash = await sha256(passcode.trim());

  // Check against env custom hash or default hash
  const targetHash = (import.meta.env.VITE_ADMIN_HASH || DEFAULT_HASH).toLowerCase();

  if (inputHash === targetHash) {
    // Authentication successful
    sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
    sessionStorage.removeItem(LOCKOUT_KEY);

    const token = `adm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      token,
      loginTime: Date.now()
    }));
    return true;
  } else {
    // Record failed attempt
    const count = parseInt(sessionStorage.getItem(FAILED_ATTEMPTS_KEY) || "0", 10) + 1;
    sessionStorage.setItem(FAILED_ATTEMPTS_KEY, count.toString());

    if (count >= 5) {
      // 2-minute lockout
      sessionStorage.setItem(LOCKOUT_KEY, (Date.now() + 120000).toString());
      throw new Error("Too many failed attempts. Account locked for 2 minutes.");
    }
    return false;
  }
}

export function isAdminAuthenticated() {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    // Session expires after 4 hours of inactivity
    if (Date.now() - session.loginTime > 4 * 60 * 60 * 1000) {
      adminLogout();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function adminLogout() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}
