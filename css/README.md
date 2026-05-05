# CSS Structure

`style.css` is now only the entrypoint. Add new styles to the matching file below instead of appending everything to the end.

- `00-base-layout.css`: global variables, layout, sidebar, shared cards, early common pages
- `10-growth-priority.css`: growth priority page and ranking tier styles
- `20-pvp-flas.css`: PvP / Flas guard page
- `30-sonix.css`: Sonix sacrifice page
- `40-serial.css`: serial code page
- `50-late-overrides.css`: late shared overrides and video/card adjustments
- `60-growth-quick.css`: quick growth guide page

Keep the import order in `style.css`; later files intentionally override earlier shared styles.
