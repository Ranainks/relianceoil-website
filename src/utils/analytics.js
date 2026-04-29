export function trackPageView(path) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', { page_path: path });
}

export function trackEvent(event_name, params = {}) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', event_name, params);
}

export const GA_EVENTS = {
  QUOTE_SUBMITTED: 'quote_submitted',
  CONTACT_SUBMITTED: 'contact_submitted',
  APPLICATION_SUBMITTED: 'job_application_submitted',
  WHATSAPP_CLICK: 'whatsapp_click',
  PHONE_CLICK: 'phone_click',
  FIND_STATION: 'find_station_click',
};
