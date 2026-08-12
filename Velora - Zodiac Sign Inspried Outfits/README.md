# Velora

Frontend-only luxury zodiac fashion website.

## Asset placement

- Logo: `assets/logo/velora-logo.png`
- Hero image: `assets/hero/velora-hero.jpg`
- Product images:
  - `assets/products/aries.jpg`
  - `assets/products/taurus.jpg`
  - `assets/products/gemini.jpg`
  - `assets/products/cancer.jpg`
  - `assets/products/leo.jpg`
  - `assets/products/virgo.jpg`
  - `assets/products/libra.jpg`
  - `assets/products/scorpio.jpg`
  - `assets/products/sagittarius.jpg`
  - `assets/products/capricorn.jpg`
  - `assets/products/aquarius.jpg`
  - `assets/products/pisces.jpg`

If a product image is missing, the site falls back to `assets/products/placeholder.svg`.

## Edit product content

Update `js/products.js` for prices, names, descriptions, and styling copy.

## Change brand URLs

Replace `https://www.velora.com/` in:

- page `<link rel="canonical">`
- Open Graph metadata
- Twitter metadata
- `robots.txt`
- `sitemap.xml`
- JSON-LD schema in the HTML files

## Contact details

Update the placeholders in `contact.html`.

## Social links

Update footer links or add your social URLs where needed.

## Cart

Cart state is stored in `localStorage` under `velora-cart-v1`.
