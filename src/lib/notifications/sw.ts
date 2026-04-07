export async function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  const registration = await navigator.serviceWorker.register("/sw.js");
  return registration;
}

export function base64UrlToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
