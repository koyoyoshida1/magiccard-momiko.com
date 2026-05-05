# Deploy To GitHub Pages

This site is a static site and can be hosted on GitHub Pages with the current custom domain.

## One-Time Setup

1. Create a GitHub repository for this site.
2. Push this folder to the repository.
3. In GitHub, open `Settings > Pages`.
4. Set the source to the main branch root.
5. Set the custom domain to `magiccard-momiko.com`.
6. Keep the generated `CNAME` file as-is.

## DNS

Point `magiccard-momiko.com` to GitHub Pages from the domain DNS panel.

If you also use mail on this domain, keep existing MX/TXT mail records unchanged.

## Daily Updates

After the one-time setup, update the site with:

```bash
git add .
git commit -m "Update site"
git push
```
