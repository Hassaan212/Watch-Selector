# Mobile Performance Mode - Quick Reference

## TL;DR

Mobile Performance Mode automatically activates below 1024px to optimize rendering on mid-range Android phones. Desktop stays completely unchanged.

## What Changed (Mobile Only)

| Feature | Desktop | Mobile (< 1024px) | Mobile (< 640px) |
|---------|---------|-------------------|------------------|
| **Backdrop Blur** | 60px | 30px (-50%) | 24px (-60%) |
| **Shadow Layers** | 5-6 layers | 3-4 layers (-35%) | 3-4 layers (-35%) |
| **Shimmer Animations** | ✅ Active | ❌ Disabled | ❌ Disabled |
| **Glow Effects** | Full intensity | Reduced 30% | Reduced 30% |
| **Theme Transition** | 0.6s | 0.4s | 0.4s |
| **Scrollbar Width** | 12px | 12px | 8px |

## What Stayed the Same

✅ All colors (Midnight & Champagne themes)  
✅ Layout and spacing  
✅ Typography  
✅ Card designs  
✅ Interactive animations (transform/opacity based)  
✅ Business logic  

## Visual Similarity

**Target**: 95-100% identical appearance between desktop and mobile  
**Achieved**: Performance optimizations are imperceptible to users

## Testing Checklist

### Quick Visual Test
```
1. Open desktop (≥1024px) - take screenshot
2. Open mobile (<1024px) - take screenshot  
3. Compare - should look virtually identical
4. Toggle themes - both should work smoothly
5. Test interactions - all should feel premium
```

### Performance Test
```
1. Open Chrome DevTools
2. Enable mobile emulation + 4x CPU throttling
3. Scroll through watch cards - should be smooth (>30fps)
4. Toggle theme - should switch in <0.5s
5. Select watches - instant visual feedback
```

## Where to Find Optimizations

**File**: `Watch-Selector/app/globals.css`  
**Section**: Search for `MOBILE PERFORMANCE MODE`  
**Lines**: Bottom of file, after all desktop styles

## Adding New Components

```css
/* 1. Write desktop styles first */
.my-new-component {
  backdrop-filter: blur(60px);
  box-shadow: /* full complexity */;
}

/* 2. Add mobile optimization */
@media (max-width: 1023px) {
  .my-new-component {
    backdrop-filter: blur(30px);  /* 50% reduction */
    box-shadow: /* simplified */;  /* 30-40% reduction */
  }
}
```

## Performance Budget (Mobile)

**Maximum Values:**
- Blur: 30px (tablets), 24px (phones)
- Shadow layers: 4 maximum
- Glow spread: 30px
- Animation duration: 0.5s

**Avoid Animating:**
- ❌ `blur`
- ❌ `box-shadow`
- ❌ `background-position`
- ❌ `filter`

**Safe to Animate:**
- ✅ `transform`
- ✅ `opacity`
- ✅ `color`

## Common Issues

### Mobile feels slow
→ Check blur values (should be ≤30px)  
→ Check shadow layers (should be ≤4)  
→ Disable expensive animations

### Visual differences desktop/mobile
→ Only modify performance properties  
→ Never change colors, spacing, or layout  
→ Test both themes

### Theme switching laggy
→ Reduce transition duration (currently 0.4s)  
→ Ensure backgrounds are static on mobile

## Browser Support

✅ **Chrome/Edge**: Full support  
✅ **Safari**: Full support  
✅ **Firefox**: Full support  
⚠️ **Older browsers**: Graceful degradation (solid backgrounds)

## Key Files

1. **`globals.css`** - All mobile optimizations
2. **`MOBILE_PERFORMANCE_MODE.md`** - Detailed documentation
3. **This file** - Quick reference

## Need More Info?

Read the full documentation in `MOBILE_PERFORMANCE_MODE.md`
