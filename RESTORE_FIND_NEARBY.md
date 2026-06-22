# Restore Find Nearby

Use this note when the restaurant search feature comes back. The current home screen is intentionally scan-only, but the previous layout had two stacked action cards:

1. `Scan Menu`
2. `Find Nearby`

## Home Card

Add this button back inside `.big-choice-grid`, after the `#openScan` button:

```html
<button class="big-choice" id="openSearch" data-view-target="search" onclick="window.__w2eSetView && window.__w2eSetView('search')" type="button">
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
  <span>Find Nearby</span>
  <small>Search restaurants</small>
</button>
```

## Search View

Add this section back before the `#saved` section:

```html
<section class="view" id="search">
  <div class="page-kicker">
    <button class="back-button" data-back type="button" aria-label="Back" title="Back">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
    <p class="eyebrow">Search Restaurants</p>
  </div>
  <div class="section-header section-header-compact">
    <h2>Find a place</h2>
  </div>

  <div class="search-row">
    <input id="restaurantSearch" placeholder="Restaurant or cuisine" />
    <select id="compatibilityFilter">
      <option value="all">All</option>
      <option value="high">High confidence</option>
      <option value="medium">Needs confirmation</option>
    </select>
  </div>

  <div class="restaurant-list" id="restaurantList"></div>
</section>
```

## CSS

Restore the two-card height:

```css
.big-choice-grid {
  min-height: 31rem;
}
```

The current scan-only layout uses `17rem`.

## JavaScript

In `setView`, include `search` in the Eat-tab views:

```js
const eatViews = ["scan", "scan-loading", "scan-results", "search"];
```

In `bindEvents`, restore the direct search button listener:

```js
document.querySelector("#openSearch")?.addEventListener("click", () => setView("search"));
```

The restaurant render/listener helpers are still present and guarded:

```js
document.querySelector("#restaurantSearch")?.addEventListener("input", renderRestaurants);
document.querySelector("#compatibilityFilter")?.addEventListener("change", renderRestaurants);
```

## Home Copy

When Search returns, change the empty-profile copy back to:

```text
Set your Dine DNA once. Then tap Scan Menu or Find Nearby.
```
