# Migration: 3-Watch Selection Feature

## Summary

Successfully updated Watch Picker from single-watch to 3-watch selection with full backward compatibility.

---

## Firestore Document Structure

### Old Format (Single Watch) - Still Supported ✅

```json
{
  "watchId": "abc123",
  "watchBrand": "Rolex",
  "watchModel": "Submariner",
  "sessionId": "session_xyz",
  "nickname": null,
  "timestamp": "Timestamp"
}
```

### New Format (3 Watches) ✅

```json
{
  "watchIds": ["abc123", "def456", "ghi789"],
  "selectedWatches": [
    {
      "id": "abc123",
      "brand": "Rolex",
      "model": "Submariner"
    },
    {
      "id": "def456",
      "brand": "Omega",
      "model": "Speedmaster"
    },
    {
      "id": "ghi789",
      "brand": "Patek Philippe",
      "model": "Nautilus"
    }
  ],
  "sessionId": "session_xyz",
  "nickname": null,
  "timestamp": "Timestamp"
}
```

---

## Files Modified

### 1. **types/index.ts** - TypeScript Interfaces
- Updated `Submission` interface to support both formats
- Made old fields optional for backward compatibility
- Added new `watchIds` and `selectedWatches` arrays

### 2. **lib/watches.ts** - Database Operations
- Updated `submitVote()` signature to accept array of watches
- Updated `getSubmissions()` to map both old and new fields from Firestore

### 3. **app/page.tsx** - Main Voting Page
- Changed from single `selectedWatchId` to array `selectedWatchIds`
- Added selection counter "Selected X/3"
- Updated selection logic: toggle on click, max 3 watches
- Submit button only appears when exactly 3 selected
- Button text changed to "Submit My Choices"

### 4. **components/SuccessScreen.tsx** - Success Message
- Changed "Your vote has been recorded" to "Your votes have been recorded"

### 5. **app/admin/page.tsx** - Admin Dashboard
- **Real-time listener**: Now maps both old and new format fields
- **calculateStats()**: Counts votes from both formats:
  - New format: Iterates through `selectedWatches` array
  - Old format: Uses `watchId` field
- **exportToCSV()**: Exports multiple watches separated by "|"

### 6. **components/admin/SubmissionsList.tsx** - Submissions Display
- Displays multiple watches (numbered 1, 2, 3) for new format
- Displays single watch for old format
- Backward compatible rendering

---

## Backward Compatibility

### ✅ Old Submissions (Single Watch)
- **Display**: Shows as single watch in submissions list
- **Count**: Each old submission counts as 1 vote for that watch
- **CSV Export**: Exports as single watch
- **No Data Loss**: All existing data preserved

### ✅ New Submissions (3 Watches)
- **Display**: Shows all 3 watches numbered in submissions list
- **Count**: Each of the 3 watches gets 1 vote
- **CSV Export**: Exports all 3 separated by " | "
- **Storage**: Uses new format with arrays

---

## Statistics Calculation Logic

```typescript
// Each submission is processed:
subs.forEach(sub => {
  // NEW format (3 watches)
  if (sub.selectedWatches && Array.isArray(sub.selectedWatches)) {
    sub.selectedWatches.forEach(watch => {
      voteCounts.set(watch.id, (voteCounts.get(watch.id) || 0) + 1);
    });
  }
  // OLD format (1 watch) - BACKWARD COMPATIBLE
  else if (sub.watchId) {
    voteCounts.set(sub.watchId, (voteCounts.get(sub.watchId) || 0) + 1);
  }
});
```

**Result**: Rankings correctly count votes from both old and new submissions.

---

## User Experience Changes

### Frontend (Voting Page)
```
Before: "Which watch would you wear?"
After:  "Which 3 watches would you wear?"

Before: Select 1 watch → Submit
After:  Select 3 watches → "Selected X/3" → Submit when X=3

Before: "Submit My Choice"
After:  "Submit My Choices"
```

### Admin Dashboard
```
Old Submission Display:
  "Rolex Submariner"

New Submission Display:
  "1. Rolex Submariner"
  "2. Omega Speedmaster"
  "3. Patek Philippe Nautilus"
```

### CSV Export
```
Old Format CSV Row:
  "Rolex Submariner,2024-01-15T10:30:00Z,session_123,Anonymous"

New Format CSV Row:
  "Rolex Submariner | Omega Speedmaster | Patek Philippe Nautilus,2024-01-15T10:30:00Z,session_123,Anonymous"
```

---

## Testing Checklist

### ✅ Frontend
- [x] Can select 1 watch (shows "Selected 1/3")
- [x] Can select 2 watches (shows "Selected 2/3")
- [x] Can select 3 watches (shows "Selected 3/3")
- [x] Cannot select more than 3 watches
- [x] Can deselect watches by clicking again
- [x] Submit button only appears at 3 selections
- [x] All 3 selections highlighted with gold border and checkmark

### ✅ Backend
- [x] Submission saves all 3 watches to Firestore
- [x] New format includes `watchIds` and `selectedWatches` arrays
- [x] No Firebase configuration changed
- [x] Image uploads still work
- [x] Watch management (add/delete) still works

### ✅ Admin Dashboard
- [x] Real-time listener receives new submissions
- [x] Rankings count new 3-watch submissions correctly
- [x] Each of 3 watches gets +1 vote
- [x] Old single-watch submissions still display
- [x] Old submissions still count in rankings
- [x] CSV export includes all watches
- [x] Submissions list shows all 3 watches numbered

---

## Data Migration

**No migration required!** ✅

- Old submissions continue to work as-is
- New submissions use new format
- Both coexist in same Firestore collection
- Admin dashboard handles both transparently

---

## Rollback Instructions

If needed, to rollback to single-watch selection:

```bash
# Restore from git backup
git log --oneline  # Find commit before changes
git checkout <commit-hash> .
git commit -m "Rollback to single-watch selection"
```

Or manually:
1. Revert changes in the 6 modified files
2. Old submissions will still work
3. New 3-watch submissions will be ignored (but not deleted)

---

## Future Enhancements

Possible improvements:
- [ ] Allow admin to configure number of selections (1-5)
- [ ] Show which 3 watches are most commonly selected together
- [ ] Add "Set" analysis (which combination of 3 is most popular)
- [ ] Export separate row per watch (instead of combined)
- [ ] Filter submissions by date range
- [ ] Show percentage of votes each watch receives

---

## Technical Notes

### Why This Approach?

**Backward Compatible**: Old data continues to work without migration

**Future Proof**: Easy to extend to any number of selections

**Type Safe**: TypeScript interfaces enforce correct data structure

**Clean Separation**: Old and new formats clearly distinguished

---

## Firestore Queries

### Read All Submissions (Both Formats)
```typescript
const q = query(
  collection(db, 'submissions'),
  orderBy('timestamp', 'desc')
);
```

### Filter by Watch (Works for Both)
```typescript
// For old format
where('watchId', '==', watchId)

// For new format
where('watchIds', 'array-contains', watchId)
```

---

## Summary of Changes

- ✅ **6 files modified**
- ✅ **~200 lines of code changed**
- ✅ **Full backward compatibility**
- ✅ **No Firebase changes**
- ✅ **No data migration needed**
- ✅ **All existing features preserved**
- ✅ **Image uploads intact**
- ✅ **Admin functionality intact**

---

**Date**: 2024
**Version**: 2.0.0 (3-watch selection)
**Status**: ✅ Complete and Tested
