/* ==========================================================================
   GridRecall: Spatial Memory Challenge
   Pure vanilla JS (ES2017+). No build step, no dependencies, no network calls.
   ========================================================================== */
(() => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. ICON POOL
     Every icon is inline SVG geometry on a 24x24 grid (Lucide icon set, ISC
     licence, plus one hand-drawn cactus), so nothing is fetched at runtime.
     Format: [id, label, svg body]
     ------------------------------------------------------------------------ */
  const ICON_DATA = [
    ['hat', 'Hat', '<path d="M14 18a2 2 0 0 0-4 0"/><path d="m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11"/><path d="M2 11h20"/><circle cx="17" cy="18" r="3"/><circle cx="7" cy="18" r="3"/>'],
    ['crown', 'Crown', '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>'],
    ['wheel', 'Wheel', '<circle cx="12" cy="12" r="8"/><path d="M12 2v7.5"/><path d="m19 5-5.23 5.23"/><path d="M22 12h-7.5"/><path d="m19 19-5.23-5.23"/><path d="M12 14.5V22"/><path d="M10.23 13.77 5 19"/><path d="M9.5 12H2"/><path d="M10.23 10.23 5 5"/><circle cx="12" cy="12" r="2.5"/>'],
    ['camera', 'Camera', '<path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"/><circle cx="12" cy="13" r="3"/>'],
    ['taxi', 'Taxi', '<path d="M10 2h4"/><path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"/><path d="M7 14h.01"/><path d="M17 14h.01"/><rect width="18" height="8" x="3" y="10" rx="2"/><path d="M5 18v2"/><path d="M19 18v2"/>'],
    ['plane', 'Plane', '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>'],
    ['lamp', 'Lamp', '<path d="M12 12v6"/><path d="M4.077 10.615A1 1 0 0 0 5 12h14a1 1 0 0 0 .923-1.385l-3.077-7.384A2 2 0 0 0 15 2H9a2 2 0 0 0-1.846 1.23Z"/><path d="M8 20a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z"/>'],
    ['trash', 'Trash Can', '<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'],
    ['shield', 'Shield', '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>'],
    ['gamepad', 'Gamepad', '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>'],
    ['scooter', 'Scooter', '<path d="M21 4h-3.5l2 11.05"/><path d="M6.95 17h5.142c.523 0 .95-.406 1.063-.916a6.5 6.5 0 0 1 5.345-5.009"/><circle cx="19.5" cy="17.5" r="2.5"/><circle cx="4.5" cy="17.5" r="2.5"/>'],
    ['glasses', 'Glasses', '<circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2"/><path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2"/>'],
    ['trophy', 'Trophy', '<path d="M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2"/><path d="M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2"/><path d="M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3"/><path d="M4 22h16"/><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/><path d="M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3"/>'],
    ['key', 'Key', '<path d="m2 21 9.6-9.6"/><path d="m7.5 15.5 2.3 2.3a1 1 0 0 1 0 1.4l-2.1 2.1a1 1 0 0 1-1.4 0L4 19"/><circle cx="15.5" cy="7.5" r="5.5"/>'],
    ['rocket', 'Rocket', '<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"/>'],
    ['anchor', 'Anchor', '<path d="M12 6v16"/><path d="m19 13 2-1a9 9 0 0 1-18 0l2 1"/><path d="M9 11h6"/><circle cx="12" cy="4" r="2"/>'],
    ['umbrella', 'Umbrella', '<path d="M12 13v7a2 2 0 0 0 4 0"/><path d="M12 2v2"/><path d="M20.992 13a1 1 0 0 0 .97-1.274 10.284 10.284 0 0 0-19.923 0A1 1 0 0 0 3 13z"/>'],
    ['bell', 'Bell', '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>'],
    ['guitar', 'Guitar', '<path d="m11.9 12.1 4.514-4.514"/><path d="M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z"/><path d="m6 16 2 2"/><path d="M8.23 9.85A3 3 0 0 1 11 8a5 5 0 0 1 5 5 3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 0 1.85-1.23z"/>'],
    ['gift', 'Gift', '<path d="M12 7v14"/><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"/><rect x="3" y="7" width="18" height="4" rx="1"/>'],
    ['book', 'Book', '<path d="M12 5v16"/><path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"/>'],
    ['coffee', 'Coffee', '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>'],
    ['pizza', 'Pizza', '<path d="m12 14-1 1"/><path d="m13.75 18.25-1.25 1.42"/><path d="M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12"/><path d="M18.8 9.3a1 1 0 0 0 2.1 7.7"/><path d="M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z"/>'],
    ['apple', 'Apple', '<path d="M12 6.528V3a1 1 0 0 1 1-1h0"/><path d="M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10 3 3 0 0 0 3.648.648 5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21"/>'],
    ['cherry', 'Cherry', '<path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z"/><path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z"/><path d="M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12"/><path d="M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z"/>'],
    ['fish', 'Fish', '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/><path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4"/><path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98"/>'],
    ['bird', 'Bird', '<path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/>'],
    ['cat', 'Cat', '<path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/>'],
    ['dog', 'Dog', '<path d="M11.25 16.25h1.5L12 17z"/><path d="M16 14v.5"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"/><path d="M8 14v.5"/><path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/>'],
    ['rabbit', 'Rabbit', '<path d="M13 16a3 3 0 0 1 2.24 5"/><path d="M18 12h.01"/><path d="M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3"/><path d="M20 8.54V4a2 2 0 1 0-4 0v3"/><path d="M7.612 12.524a3 3 0 1 0-1.6 4.3"/>'],
    ['flower', 'Flower', '<path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"/><circle cx="12" cy="8" r="2"/><path d="M12 10v12"/><path d="M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z"/><path d="M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z"/>'],
    ['pine', 'Pine Tree', '<path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z"/><path d="M12 22v-3"/>'],
    ['tent', 'Tent', '<path d="M3.5 21 14 3"/><path d="M20.5 21 10 3"/><path d="M15.5 21 12 15l-3.5 6"/><path d="M2 21h20"/>'],
    ['compass', 'Compass', '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/>'],
    ['bulb', 'Light Bulb', '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>'],
    ['hammer', 'Hammer', '<path d="m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9"/><path d="m18 15 4-4"/><path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5"/>'],
    ['scissors', 'Scissors', '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>'],
    ['brush', 'Paintbrush', '<path d="m14.622 17.897-10.68-2.913"/><path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"/><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"/>'],
    ['bicycle', 'Bicycle', '<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>'],
    ['sailboat', 'Sailboat', '<path d="M10 2v15"/><path d="M7 22a4 4 0 0 1-4-4 1 1 0 0 1 1-1h16a1 1 0 0 1 1 1 4 4 0 0 1-4 4z"/><path d="M9.159 2.46a1 1 0 0 1 1.521-.193l9.977 8.98A1 1 0 0 1 20 13H4a1 1 0 0 1-.824-1.567z"/>'],
    ['train', 'Train', '<path d="M8 3.1V7a4 4 0 0 0 8 0V3.1"/><path d="m9 15-1-1"/><path d="m15 15 1-1"/><path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z"/><path d="m8 19-2 3"/><path d="m16 19 2 3"/>'],
    ['truck', 'Truck', '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>'],
    ['castle', 'Castle', '<path d="M10 5V3"/><path d="M14 5V3"/><path d="M15 21v-3a3 3 0 0 0-6 0v3"/><path d="M18 3v8"/><path d="M18 5H6"/><path d="M22 11H2"/><path d="M22 9v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9"/><path d="M6 3v8"/>'],
    ['gem', 'Gem', '<path d="M10.5 3 8 9l4 13 4-13-2.5-6"/><path d="M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"/><path d="M2 9h20"/>'],
    ['magnet', 'Magnet', '<path d="m12 15 4 4"/><path d="M2.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l6.029-6.029a1 1 0 1 1 3 3l-6.029 6.029a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l6.365-6.367A1 1 0 0 0 8.716 4.282z"/><path d="m5 8 4 4"/>'],
    ['dice', 'Dice', '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/>'],
    ['ghost', 'Ghost', '<path d="M15 10v1"/><path d="M7.528 20.472a1.6 1.6 0 012.277 0l1.057 1.056a1.6 1.6 0 002.276 0l1.057-1.056a1.6 1.6 0 012.277 0l1.114 1.114a1.4 1.4 0 002.414-1V10a8 8 0 00-16 0v10.586a1.4 1.4 0 002.414 1z"/><path d="M9 10v1"/>'],
    ['snowflake', 'Snowflake', '<path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/><path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/><path d="m17 21-3-6h-4"/><path d="m17 3-3 6 1.5 3"/><path d="M2 12h6.5L10 9"/><path d="m20 10-1.5 2 1.5 2"/><path d="M22 12h-6.5L14 15"/><path d="m4 10 1.5 2L4 14"/><path d="m7 21 3-6-1.5-3"/><path d="m7 3 3 6h4"/>'],
    ['icecream', 'Ice Cream', '<path d="m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11"/><path d="M17 7A5 5 0 0 0 7 7"/><path d="M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4"/>'],
    ['carrot', 'Carrot', '<path d="M15 16a1 1 0 0 0-7-7q-4 4-5.987 12.385a.5.5 0 0 0 .602.602Q11 20 15 16l-3-3"/><path d="M15 9q4 4 7 0-3-4-7 0 4-4 0-7-4 3 0 7"/><path d="m8 15-2.58-2.58"/>'],
    ['drum', 'Drum', '<path d="m2 2 8 8"/><path d="m22 2-8 8"/><ellipse cx="12" cy="9" rx="10" ry="5"/><path d="M7 13.4v7.9"/><path d="M12 14v8"/><path d="M17 13.4v7.9"/><path d="M2 9v8a10 5 0 0 0 20 0V9"/>'],
    ['headphones', 'Headphones', '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>'],
    ['watch', 'Watch', '<path d="M12 10v2.2l1.6 1"/><path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05"/><path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05"/><circle cx="12" cy="12" r="6"/>'],
    ['backpack', 'Backpack', '<path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 10h8"/><path d="M8 18h8"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>'],
    ['axe', 'Axe', '<path d="m14 12-8.381 8.38a1 1 0 0 1-3.001-3L11 9"/><path d="M15 15.5a.5.5 0 0 0 .5.5A6.5 6.5 0 0 0 22 9.5a.5.5 0 0 0-.5-.5h-1.672a2 2 0 0 1-1.414-.586l-5.062-5.062a1.205 1.205 0 0 0-1.704 0L9.352 5.648a1.205 1.205 0 0 0 0 1.704l5.062 5.062A2 2 0 0 1 15 13.828z"/>'],
    ['feather', 'Feather', '<path d="M14.086 18.412A2 2 0 0112.67 19H5v-7.672a2 2 0 01.586-1.414L11.75 3.75a6 6 0 118.49 8.49z"/><path d="M16 8 2 22"/><path d="M17.488 15H9"/>'],
    ['turtle', 'Turtle', '<path d="m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z"/><path d="M4.82 7.9 8 10"/><path d="M15.18 7.9 12 10"/><path d="M16.93 10H20a2 2 0 0 1 0 4H2"/>'],
    ['banana', 'Banana', '<path d="M4 13c3.5-2 8-2 10 2a5.5 5.5 0 0 1 8 5"/><path d="M5.15 17.89c5.52-1.52 8.65-6.89 7-12C11.55 4 11.5 2 13 2c3.22 0 5 5.5 5 8 0 6.5-4.2 12-10.49 12C5.11 22 2 22 2 20c0-1.5 1.14-1.55 3.15-2.11Z"/>'],
    ['telescope', 'Telescope', '<path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44"/><path d="m13.56 11.747 4.332-.924"/><path d="m16 21-3.105-6.21"/><path d="M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z"/><path d="m6.158 8.633 1.114 4.456"/><path d="m8 21 3.105-6.21"/><circle cx="12" cy="13" r="2"/>'],
    ['cactus', 'Cactus', '<path d="M10 21V6a2 2 0 0 1 4 0v15"/><path d="M10 14H8a2 2 0 0 1-2-2V9"/><path d="M14 16h2a2 2 0 0 0 2-2v-3"/><path d="M6 21h12"/>'],
  ];

  const UI_ICONS = {
    soundOn: '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>',
    soundOff: '<path d="M11 4.702a.7.7 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.7.7 0 0 0 11 19.298z"/><path d="m16.5 14.5 5-5"/><path d="m16.5 9.5 5 5"/>',
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    play: '<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>',
    retry: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    next: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    quit: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  };

  const TINTS = ['#22d3ee', '#ff4fa3', '#8b7bff', '#fbbf24', '#fb923c', '#60a5fa', '#a3e635'];

  const svg = (body) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + body + '</svg>';

  const ICONS = ICON_DATA.map(([id, label, body], i) => ({
    id, label, svg: svg(body), tint: TINTS[i % TINTS.length],
  }));

  /* ------------------------------------------------------------------------
     2. CONFIGURATION
     ------------------------------------------------------------------------ */
  const TIERS = {
    easy:      { label: 'Easy',           css: 'tier-easy',      points: 100 },
    medium:    { label: 'Medium',         css: 'tier-medium',    points: 150 },
    difficult: { label: 'Difficult',      css: 'tier-difficult', points: 200 },
    very:      { label: 'Very Difficult', css: 'tier-very',      points: 250 },
    extreme:   { label: 'Extreme',        css: 'tier-extreme',   points: 300 },
    bonus:     { label: 'Bonus',          css: 'tier-bonus',     points: 0 },
  };

  // Level progression table. `questions` lists the sub-questions in order.
  const LEVELS = [
    { test: 1,  tier: 'easy',      boxes: 6,  memorize: 8,  questions: ['single', 'single'] },
    { test: 2,  tier: 'easy',      boxes: 6,  memorize: 8,  questions: ['single', 'dual'] },
    { test: 3,  tier: 'medium',    boxes: 8,  memorize: 10, questions: ['single', 'dual'] },
    { test: 4,  tier: 'medium',    boxes: 8,  memorize: 10, questions: ['dual', 'single'] },
    { test: 5,  tier: 'difficult', boxes: 8,  memorize: 10, questions: ['dual', 'single', 'single'] },
    { test: 6,  tier: 'difficult', boxes: 8,  memorize: 9,  questions: ['dual', 'dual', 'single'] },
    { test: 7,  tier: 'very',      boxes: 10, memorize: 12, questions: ['single', 'single', 'single'] },
    { test: 8,  tier: 'very',      boxes: 10, memorize: 11, questions: ['single', 'dual', 'single'] },
    { test: 9,  tier: 'very',      boxes: 10, memorize: 10, questions: ['dual', 'single', 'dual'] },
    { test: 10, tier: 'extreme',   boxes: 10, memorize: 10, questions: ['dual', 'single', 'dual', 'single'] },
  ];

  const SETTINGS = {
    briefingMs: 2000,                        // Phase 1 length
    flipMs: 600,                             // pause after boxes close
    revealMs: 1800,                          // how long the answer stays revealed
    recallSeconds: { single: 10, dual: 14 }, // answer time per sub-question
    bonusSeconds: 20,
    bonusPoints: 1000,
    bonusOptions: 6,                         // 5 seen icons + 1 decoy
    decoyReserve: 4,                         // icons held back from each run so a decoy always exists
    streakStep: 0.25,                        // multiplier gained per consecutive perfect answer
    maxMultiplier: 3,
  };

  const STORAGE = {
    highScore: 'gridrecall.highScore',
    highestLevel: 'gridrecall.highestLevel',
    muted: 'gridrecall.muted',
  };

  /* ------------------------------------------------------------------------
     3. UTILITIES
     ------------------------------------------------------------------------ */
  const $ = (id) => document.getElementById(id);

  const shuffle = (list) => {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const fmt = (n) => Math.round(n).toLocaleString('en-US');

  const store = {
    get(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode etc. */ }
    },
  };

  /* ------------------------------------------------------------------------
     4. SOUND (Web Audio API synth, no audio files)
     ------------------------------------------------------------------------ */
  const Sound = {
    ctx: null,
    muted: !!store.get(STORAGE.muted, false),

    unlock() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        if (!this.ctx) this.ctx = new AC();
        if (this.ctx.state === 'suspended') this.ctx.resume();
      } catch (e) {
        this.ctx = null;
      }
    },

    // One enveloped oscillator note. `slideTo` glides the pitch over the note.
    tone({ freq, dur = 0.12, type = 'sine', vol = 0.12, delay = 0, slideTo = 0 }) {
      if (this.muted || !this.ctx) return;
      try {
        const t = this.ctx.currentTime + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(vol, t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.03);
      } catch (e) { /* audio is non-essential */ }
    },

    tick()    { this.tone({ freq: 1150, dur: 0.04, type: 'square', vol: 0.035 }); },
    select()  { this.tone({ freq: 520, dur: 0.06, type: 'triangle', vol: 0.09 }); },
    flip()    { this.tone({ freq: 260, slideTo: 620, dur: 0.11, type: 'triangle', vol: 0.11 }); },
    correct() {
      this.tone({ freq: 659.25, dur: 0.14, vol: 0.13 });
      this.tone({ freq: 987.77, dur: 0.24, vol: 0.13, delay: 0.1 });
    },
    error()   { this.tone({ freq: 170, slideTo: 95, dur: 0.32, type: 'sawtooth', vol: 0.1 }); },
    fanfare() {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        this.tone({ freq: f, dur: i === 3 ? 0.45 : 0.16, type: 'triangle', vol: 0.13, delay: i * 0.13 }));
    },

    toggle() {
      this.muted = !this.muted;
      store.set(STORAGE.muted, this.muted);
      if (!this.muted) { this.unlock(); this.select(); }
    },
  };

  /* ------------------------------------------------------------------------
     5. DOM REFERENCES
     ------------------------------------------------------------------------ */
  const el = {
    screens: { menu: $('screen-menu'), game: $('screen-game'), results: $('screen-results') },
    menuHigh: $('menu-high'), menuLevel: $('menu-level'), practice: $('practice-levels'),
    hudMode: $('hud-mode'), hudLevel: $('hud-level'), hudLevelOf: $('hud-level-of'), hudTier: $('hud-tier'),
    hudScore: $('hud-score'), hudMult: $('hud-mult'), hudStreak: $('hud-streak-label'),
    timebar: $('timebar'), timeFill: $('timebar-fill'), timeLabel: $('hud-time'),
    promptMain: $('prompt-main'), promptSub: $('prompt-sub'),
    board: $('board'), grid: $('grid'),
    briefing: $('briefing'), briefKicker: $('briefing-kicker'), briefTitle: $('briefing-title'),
    briefTier: $('briefing-tier'), briefDetail: $('briefing-detail'),
    quit: $('btn-quit'),
    resKicker: $('results-kicker'), resTitle: $('results-title'), resScore: $('results-score'),
    resNew: $('results-new'), resStats: $('results-stats'),
    again: $('btn-again'), againText: $('btn-again-text'), next: $('btn-next'), nextText: $('btn-next-text'),
  };

  /* ------------------------------------------------------------------------
     6. RUN STATE + SCHEDULING
     A "run" is one Challenge playthrough or one Practice test. Every pending
     timer belongs to the current run token; quitting bumps the token and
     clears them, which abandons the old async flow cleanly.
     ------------------------------------------------------------------------ */
  let run = null;
  let runToken = 0;
  let countdown = null;      // { raf, start, total }
  let pickHandler = null;    // set while the player may choose boxes
  let tiles = [];
  const timers = new Set();

  const sleep = (ms) => {
    const token = runToken;
    return new Promise((resolve) => {
      const id = setTimeout(() => {
        timers.delete(id);
        if (token === runToken) resolve();
      }, ms);
      timers.add(id);
    });
  };

  function abortRun() {
    runToken++;
    timers.forEach(clearTimeout);
    timers.clear();
    stopCountdown();
    pickHandler = null;
  }

  /* ---- Countdown bar ---------------------------------------------------- */

  // Drains the bar over `seconds`; resolves when it reaches zero.
  function startCountdown(seconds, mode, onSecond) {
    stopCountdown();
    const total = seconds * 1000;
    const start = performance.now();
    let lastSec = seconds;
    el.timebar.classList.remove('is-memorize', 'is-recall', 'is-low');
    el.timebar.classList.add('is-' + mode);
    el.timeLabel.textContent = seconds + 's';

    return new Promise((resolve) => {
      const me = { raf: 0, start, total };
      const frame = () => {
        if (countdown !== me) return;
        const left = Math.max(0, total - (performance.now() - start));
        const frac = left / total;
        el.timeFill.style.transform = 'scaleX(' + frac.toFixed(4) + ')';
        el.timebar.classList.toggle('is-low', frac < 0.25);
        const sec = Math.ceil(left / 1000);
        if (sec !== lastSec) {
          lastSec = sec;
          el.timeLabel.textContent = sec + 's';
          el.timebar.setAttribute('aria-valuenow', String(Math.round(frac * 100)));
          if (sec > 0 && onSecond) onSecond(sec);
        }
        if (left <= 0) {
          countdown = null;
          resolve();
          return;
        }
        me.raf = requestAnimationFrame(frame);
      };
      countdown = me;
      me.raf = requestAnimationFrame(frame);
    });
  }

  // Stops the bar where it is and returns the fraction of time that was left.
  function stopCountdown() {
    if (!countdown) return 0;
    cancelAnimationFrame(countdown.raf);
    const left = Math.max(0, countdown.total - (performance.now() - countdown.start));
    const frac = left / countdown.total;
    countdown = null;
    return frac;
  }

  function resetBar() {
    stopCountdown();
    el.timebar.classList.remove('is-memorize', 'is-recall', 'is-low');
    el.timeFill.style.transform = 'scaleX(1)';
    el.timeLabel.textContent = '–';
  }

  /* ------------------------------------------------------------------------
     7. RENDERING
     ------------------------------------------------------------------------ */
  function showScreen(name) {
    Object.keys(el.screens).forEach((key) => el.screens[key].classList.toggle('active', key === name));
  }

  function setPrompt(mainHtml, subText, tone) {
    if (mainHtml !== null) el.promptMain.innerHTML = mainHtml;
    el.promptSub.textContent = subText || '';
    el.promptSub.className = 'prompt-sub' + (tone ? ' ' + tone : '');
  }

  const multiplier = (streak) => Math.min(SETTINGS.maxMultiplier, 1 + streak * SETTINGS.streakStep);

  function bump(node) {
    node.classList.remove('bump');
    void node.offsetWidth; // restart the animation
    node.classList.add('bump');
  }

  function updateHud(tierKey, levelText, levelOf) {
    const tier = TIERS[tierKey];
    el.hudMode.textContent = run.mode === 'challenge' ? 'Challenge' : 'Practice';
    el.hudLevel.textContent = levelText;
    el.hudLevelOf.textContent = levelOf;
    el.hudTier.textContent = tier.label;
    el.hudTier.className = 'tier ' + tier.css;
    updateScoreHud(false);
  }

  function updateScoreHud(animate) {
    const scoreText = fmt(run.score);
    const multText = '×' + multiplier(run.streak);
    if (animate && el.hudScore.textContent !== scoreText) bump(el.hudScore);
    if (animate && el.hudMult.textContent !== multText) bump(el.hudMult);
    el.hudScore.textContent = scoreText;
    el.hudMult.textContent = multText;
    el.hudStreak.textContent = 'Streak ' + run.streak;
  }

  function showBriefing(kicker, title, tierKey, detail) {
    const tier = TIERS[tierKey];
    el.grid.innerHTML = '';
    tiles = [];
    el.briefKicker.textContent = kicker;
    el.briefTitle.textContent = title;
    el.briefTier.textContent = tier.label;
    el.briefTier.className = 'tier ' + tier.css;
    el.briefDetail.textContent = detail;
    el.briefing.hidden = false;
  }

  // Builds the boxes. Each tile is a button with a closed face (number only)
  // and an open face (icon + label).
  function renderGrid(icons, isBonus) {
    el.briefing.hidden = true;
    el.grid.innerHTML = '';
    el.grid.classList.toggle('bonus', !!isBonus);
    el.grid.classList.add('locked');
    tiles = icons.map((icon, i) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'tile';
      tile.dataset.index = String(i);
      tile.style.setProperty('--tint', icon.tint);
      tile.setAttribute('aria-label', 'Box ' + (i + 1));
      tile.innerHTML =
        '<span class="tile-inner" aria-hidden="true">' +
          '<span class="face face-front"><span class="num">' + (i + 1) + '</span></span>' +
          '<span class="face face-back">' +
            '<span class="num-sm">' + (i + 1) + '</span>' +
            '<span class="ico">' + icon.svg + '</span>' +
            '<span class="lbl">' + icon.label + '</span>' +
          '</span>' +
        '</span>';
      el.grid.appendChild(tile);
      return tile;
    });
    layoutGrid();
  }

  // Picks the column count that keeps boxes closest to square for the space available.
  function layoutGrid() {
    const n = tiles.length;
    if (!n) return;
    const rect = el.board.getBoundingClientRect();
    const w = Math.min(rect.width, 1100) || 1;
    const h = rect.height || 1;
    let best = null;
    [2, 3, 4, 5].filter((c) => n % c === 0).forEach((cols) => {
      const rows = n / cols;
      const skew = Math.abs(Math.log((w / cols) / (h / rows)));
      if (!best || skew < best.skew) best = { cols, rows, skew };
    });
    el.grid.style.setProperty('--cols', best.cols);
    el.grid.style.setProperty('--rows', best.rows);
  }

  function setOpen(tile, open, icon) {
    tile.classList.toggle('open', open);
    const n = Number(tile.dataset.index) + 1;
    tile.setAttribute('aria-label', open && icon ? 'Box ' + n + ': ' + icon.label : 'Box ' + n);
  }

  const chip = (icon) =>
    '<span class="chip" style="--tint:' + icon.tint + '">' + icon.svg + '<b>' + icon.label + '</b></span>';

  /* ------------------------------------------------------------------------
     8. GAME FLOW
     ------------------------------------------------------------------------ */
  async function startRun(mode, startIndex) {
    abortRun();
    Sound.unlock();

    // Hold a few icons back for the whole run so the bonus round always has
    // a decoy that truly never appeared.
    const reserved = shuffle(ICONS).slice(0, SETTINGS.decoyReserve);
    run = {
      mode,
      startIndex,
      score: 0,
      streak: 0,
      bestStreak: 0,
      boxesHit: 0,
      boxesAsked: 0,
      perfect: 0,
      asked: 0,
      testsDone: 0,
      bonus: null,          // null = not played, true/false = result
      newHigh: false,
      seen: new Set(),
      reserved,
      pool: ICONS.filter((icon) => !reserved.includes(icon)),
      deck: [],
    };

    showScreen('game');
    const last = mode === 'challenge' ? LEVELS.length - 1 : startIndex;
    for (let i = startIndex; i <= last; i++) {
      await playLevel(i);
      run.testsDone++;
    }
    if (mode === 'challenge') await playBonus();
    finishRun();
  }

  // Deals `n` distinct icons, cycling through the whole pool before repeating any.
  function drawIcons(n) {
    const out = [];
    while (out.length < n) {
      if (!run.deck.length) run.deck = shuffle(run.pool.filter((icon) => !out.includes(icon)));
      const icon = run.deck.pop();
      if (!out.includes(icon)) out.push(icon);
    }
    out.forEach((icon) => run.seen.add(icon));
    return out;
  }

  function addScore(points) {
    run.score += points;
    if (run.mode === 'challenge' && run.score > store.get(STORAGE.highScore, 0)) {
      store.set(STORAGE.highScore, run.score);
      run.newHigh = true;
    }
  }

  async function playLevel(index) {
    const level = LEVELS[index];
    const tier = TIERS[level.tier];
    const qCount = level.questions.length;

    if (run.mode === 'challenge' && level.test > store.get(STORAGE.highestLevel, 0)) {
      store.set(STORAGE.highestLevel, level.test);
    }

    /* PHASE 1: READY / BRIEFING */
    updateHud(level.tier, String(level.test), '/' + LEVELS.length);
    resetBar();
    setPrompt('Get ready', '');
    showBriefing('Get ready', 'Test ' + level.test, level.tier,
      level.boxes + ' boxes · ' + level.memorize + 's to memorize · ' + qCount + ' questions');
    await sleep(SETTINGS.briefingMs);

    /* PHASE 2: MEMORIZE */
    const icons = drawIcons(level.boxes);
    renderGrid(icons, false);
    setPrompt('Memorize what is in each box', qCount + ' questions follow when the boxes close');
    await sleep(60);
    tiles.forEach((tile, i) => setOpen(tile, true, icons[i]));
    Sound.flip();
    await startCountdown(level.memorize, 'memorize', () => Sound.tick());

    /* PHASE 3: RECALL */
    tiles.forEach((tile) => setOpen(tile, false));
    Sound.flip();
    resetBar();
    setPrompt('Boxes closed', '');
    await sleep(SETTINGS.flipMs);

    const order = shuffle(icons.map((_, i) => i)); // each object is asked for at most once
    let cursor = 0;
    for (let q = 0; q < qCount; q++) {
      const type = level.questions[q];
      const need = type === 'dual' ? 2 : 1;
      const targets = order.slice(cursor, cursor + need);
      cursor += need;

      const question = need === 1
        ? 'Where is the ' + chip(icons[targets[0]]) + '?'
        : 'Where are the ' + chip(icons[targets[0]]) + ' and ' + chip(icons[targets[1]]) + '?';
      setPrompt(question, 'Question ' + (q + 1) + ' of ' + qCount + ' · tap ' + (need === 1 ? '1 box' : '2 boxes'));

      const answer = await awaitAnswer(need, SETTINGS.recallSeconds[type]);

      // Score it
      const hits = answer.picked.filter((i) => targets.includes(i));
      const isPerfect = hits.length === need;
      let points = hits.length * tier.points;
      if (isPerfect) {
        if (need === 2) points += tier.points * 0.5;          // both-boxes bonus
        points += tier.points * 0.5 * answer.timeLeft;        // speed bonus
      }
      points = Math.round((points * multiplier(run.streak)) / 5) * 5;

      run.asked++;
      run.boxesAsked += need;
      run.boxesHit += hits.length;
      if (isPerfect) {
        run.perfect++;
        run.streak++;
        run.bestStreak = Math.max(run.bestStreak, run.streak);
      } else {
        run.streak = 0;
      }
      addScore(points);
      updateScoreHud(true);

      // Show it: picks turn green/red, and every correct box opens
      answer.picked.forEach((i) => {
        tiles[i].classList.remove('selected');
        tiles[i].classList.add(targets.includes(i) ? 'correct' : 'wrong');
      });
      targets.forEach((i) => {
        if (!answer.picked.includes(i)) tiles[i].classList.add('missed');
        setOpen(tiles[i], true, icons[i]);
      });

      if (isPerfect) {
        Sound.correct();
        setPrompt(null, 'Correct  +' + fmt(points), 'good');
      } else {
        Sound.error();
        const lead = answer.timedOut ? 'Time is up' : hits.length ? 'One of two' : 'Not there';
        setPrompt(null, lead + (points ? '  +' + fmt(points) : '') + ' · streak reset', 'bad');
      }

      await sleep(SETTINGS.revealMs);
      tiles.forEach((tile) => {
        tile.classList.remove('correct', 'wrong', 'missed', 'selected');
        setOpen(tile, false);
      });
      if (q < qCount - 1) Sound.flip();
      await sleep(350);
    }
  }

  // Lets the player choose `need` boxes; resolves on the last pick or on timeout.
  function awaitAnswer(need, seconds) {
    return new Promise((resolve) => {
      const picked = [];
      let done = false;

      const finish = (timedOut) => {
        if (done) return;
        done = true;
        pickHandler = null;
        el.grid.classList.add('locked');
        const timeLeft = stopCountdown();
        resolve({ picked, timedOut, timeLeft });
      };

      pickHandler = (index) => {
        const at = picked.indexOf(index);
        if (at >= 0) {                       // tap again to undo a pick
          picked.splice(at, 1);
          tiles[index].classList.remove('selected');
          return;
        }
        picked.push(index);
        tiles[index].classList.add('selected');
        Sound.select();
        if (picked.length === need) finish(false);
      };

      el.grid.classList.remove('locked');
      startCountdown(seconds, 'recall', (sec) => { if (sec <= 3) Sound.tick(); }).then(() => finish(true));
    });
  }

  /* PHASE 4: BONUS ODD-ONE-OUT (after Test 10) */
  async function playBonus() {
    updateHud('bonus', 'B', '');
    resetBar();
    setPrompt('Bonus round', '');
    showBriefing('Final challenge', 'Odd One Out', 'bonus',
      'Worth ' + fmt(SETTINGS.bonusPoints) + ' points');
    Sound.fanfare();
    await sleep(SETTINGS.briefingMs);

    const decoy = run.reserved[Math.floor(Math.random() * run.reserved.length)];
    const familiar = shuffle(Array.from(run.seen)).slice(0, SETTINGS.bonusOptions - 1);
    const options = shuffle(familiar.concat(decoy));
    const decoyIndex = options.indexOf(decoy);

    renderGrid(options, true);
    await sleep(60);
    tiles.forEach((tile, i) => setOpen(tile, true, options[i]));
    Sound.flip();
    setPrompt('Which of these objects <em>never</em> appeared in the game?',
      'Bonus · tap 1 object · +' + fmt(SETTINGS.bonusPoints) + ' points');

    const answer = await awaitAnswer(1, SETTINGS.bonusSeconds);
    const choice = answer.picked[0];
    const won = choice === decoyIndex;
    run.bonus = won;

    if (choice !== undefined) {
      tiles[choice].classList.remove('selected');
      tiles[choice].classList.add(won ? 'correct' : 'wrong');
    }
    if (!won) tiles[decoyIndex].classList.add('missed');

    if (won) {
      addScore(SETTINGS.bonusPoints);
      updateScoreHud(true);
      Sound.correct();
      setPrompt(null, 'Correct  +' + fmt(SETTINGS.bonusPoints) + ' · the ' + decoy.label + ' was never shown', 'good');
    } else {
      Sound.error();
      setPrompt(null, (answer.timedOut ? 'Time is up' : 'Not that one') + ' · the ' + decoy.label + ' was never shown', 'bad');
    }
    await sleep(SETTINGS.revealMs + 700);
  }

  /* ------------------------------------------------------------------------
     9. RESULTS + MENU
     ------------------------------------------------------------------------ */
  function finishRun() {
    const accuracy = run.boxesAsked ? Math.round((run.boxesHit / run.boxesAsked) * 100) : 0;
    const isChallenge = run.mode === 'challenge';
    const test = LEVELS[run.startIndex].test;

    const rating =
      accuracy >= 95 ? 'Photographic' :
      accuracy >= 80 ? 'Sharp Mind' :
      accuracy >= 60 ? 'Solid Recall' :
      accuracy >= 40 ? 'Warming Up' : 'Foggy Day';

    el.resKicker.textContent = isChallenge ? 'Challenge complete' : 'Practice · Test ' + test + ' complete';
    el.resTitle.textContent = rating;
    el.resScore.textContent = fmt(run.score);
    el.resNew.hidden = !run.newHigh;

    const rows = [
      ['Accuracy', accuracy + '%'],
      ['Perfect answers', run.perfect + ' / ' + run.asked],
      ['Best streak', String(run.bestStreak)],
    ];
    if (isChallenge) {
      rows.push(['Bonus round', run.bonus ? '+' + fmt(SETTINGS.bonusPoints) : 'Missed']);
      rows.push(['Tests completed', run.testsDone + ' / ' + LEVELS.length]);
      rows.push(['High score', fmt(store.get(STORAGE.highScore, 0))]);
    } else {
      rows.push(['Difficulty', TIERS[LEVELS[run.startIndex].tier].label]);
    }
    el.resStats.innerHTML = rows.map(([k, v]) => '<div><dt>' + k + '</dt><dd>' + v + '</dd></div>').join('');

    el.againText.textContent = isChallenge ? 'Play Again' : 'Retry Test ' + test;
    const hasNext = !isChallenge && run.startIndex < LEVELS.length - 1;
    el.next.hidden = !hasNext;
    if (hasNext) el.nextText.textContent = 'Test ' + (test + 1);

    showScreen('results');
    if (isChallenge) Sound.fanfare();
  }

  function showMenu() {
    abortRun();
    el.menuHigh.textContent = fmt(store.get(STORAGE.highScore, 0));
    const top = store.get(STORAGE.highestLevel, 0);
    el.menuLevel.textContent = top ? 'Test ' + top : '–';
    showScreen('menu');
  }

  function buildPracticeButtons() {
    el.practice.innerHTML = LEVELS.map((level, i) => {
      const tier = TIERS[level.tier];
      return '<button type="button" class="level-btn ' + tier.css + '" data-level="' + i + '" ' +
        'aria-label="Practice Test ' + level.test + ', ' + tier.label + '">' +
        '<b>' + level.test + '</b><small>' + tier.label + '</small></button>';
    }).join('');
  }

  function refreshMuteButtons() {
    document.querySelectorAll('.js-mute').forEach((btn) => {
      btn.innerHTML = svg(Sound.muted ? UI_ICONS.soundOff : UI_ICONS.soundOn);
      btn.classList.toggle('is-muted', Sound.muted);
      btn.setAttribute('aria-label', Sound.muted ? 'Unmute sound' : 'Mute sound');
      btn.setAttribute('aria-pressed', String(Sound.muted));
    });
  }

  /* ------------------------------------------------------------------------
     10. EVENTS
     ------------------------------------------------------------------------ */
  function bindEvents() {
    $('btn-challenge').addEventListener('click', () => startRun('challenge', 0));

    el.practice.addEventListener('click', (e) => {
      const btn = e.target.closest('.level-btn');
      if (btn) startRun('practice', Number(btn.dataset.level));
    });

    el.grid.addEventListener('click', (e) => {
      const tile = e.target.closest('.tile');
      if (tile && pickHandler) pickHandler(Number(tile.dataset.index));
    });

    // Number keys pick boxes: 1-9, and 0 for box 10
    document.addEventListener('keydown', (e) => {
      if (!pickHandler || e.ctrlKey || e.metaKey || e.altKey || !/^[0-9]$/.test(e.key)) return;
      const index = e.key === '0' ? 9 : Number(e.key) - 1;
      if (index < tiles.length) pickHandler(index);
    });

    document.querySelectorAll('.js-mute').forEach((btn) =>
      btn.addEventListener('click', () => { Sound.toggle(); refreshMuteButtons(); }));

    // Quit needs a second tap within 2.5s, so a stray tap cannot end a run
    let quitTimer = 0;
    el.quit.addEventListener('click', () => {
      if (el.quit.classList.contains('confirm')) {
        clearTimeout(quitTimer);
        el.quit.classList.remove('confirm');
        showMenu();
        return;
      }
      el.quit.classList.add('confirm');
      quitTimer = setTimeout(() => el.quit.classList.remove('confirm'), 2500);
    });

    el.again.addEventListener('click', () => startRun(run.mode, run.mode === 'challenge' ? 0 : run.startIndex));
    el.next.addEventListener('click', () => startRun('practice', run.startIndex + 1));
    $('btn-menu').addEventListener('click', showMenu);

    window.addEventListener('resize', layoutGrid);
    window.addEventListener('orientationchange', layoutGrid);
  }

  /* ------------------------------------------------------------------------
     11. BOOT
     ------------------------------------------------------------------------ */
  function init() {
    document.querySelectorAll('[data-ui-icon]').forEach((node) => {
      node.innerHTML = svg(UI_ICONS[node.dataset.uiIcon]);
    });
    buildPracticeButtons();
    refreshMuteButtons();
    bindEvents();
    showMenu();
  }

  init();
})();
