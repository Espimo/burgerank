# Profile Phase 2 - Testing Checklist

## Pre-Launch Validation

### Database Setup ✅
- [ ] User table exists and has authentication
- [ ] Reviews table has all required columns
- [ ] Burgers table has average_rating column
- [ ] Restaurants table exists
- [ ] user_top_burgers table created via migration
- [ ] All RLS policies applied
- [ ] Indexes created (idx_user_top_burgers_user_id)
- [ ] Foreign key constraints verified

### Dependencies ✅
- [ ] @dnd-kit/core installed
- [ ] @dnd-kit/sortable installed
- [ ] @dnd-kit/utilities installed
- [ ] recharts installed
- [ ] All packages installed successfully
- [ ] No peer dependency warnings
- [ ] npm run build completes without errors

---

## My Reviews Section Tests

### Component Rendering
- [ ] Reviews section loads without errors
- [ ] Empty state displays when no reviews
- [ ] Review cards render with correct data
- [ ] Grid view displays 2-3 columns on desktop
- [ ] List view displays single column
- [ ] View toggle switches between grid/list

### Review Cards Display
- [ ] Burger name displays correctly
- [ ] Restaurant name displays correctly
- [ ] Overall rating displays (0-5)
- [ ] Stars color-coded (green ≥4.5, amber ≥3.5, orange ≥2.5, red <2.5)
- [ ] Verified badge shows when applicable
- [ ] Like count displays correctly
- [ ] Experience tags show (max 3 + counter)
- [ ] Images display (if available)
- [ ] Created date formats correctly (e.g., "2 days ago")

### Expandable Details
- [ ] "Ver más" button toggles detailed ratings
- [ ] Detailed ratings display (bread, meat, sauce, toppings)
- [ ] Each rating shows as score/5
- [ ] Expandable animates smoothly
- [ ] Can collapse back

### Filter Functionality
- [ ] Filter button opens modal
- [ ] "Todos" filter shows all reviews
- [ ] "5 Estrellas" filter shows only 5-star reviews
- [ ] "Recientes" filter shows newest first
- [ ] Restaurant dropdown filters correctly
- [ ] Burger type checkboxes filter correctly
- [ ] Multiple filters combine (AND logic)
- [ ] "Limpiar filtros" resets all filters
- [ ] "Aplicar" closes modal and applies filters

### Sorting
- [ ] Sort by date (newest first) works
- [ ] Sort by rating (highest first) works
- [ ] Sort by restaurant (A-Z) works
- [ ] Sort persists when filtering

### Infinite Scroll
- [ ] Loads first 20 reviews
- [ ] "Cargar más" button appears when more exist
- [ ] Clicking loads next 20 reviews
- [ ] No duplicates in loaded list
- [ ] Scroll position maintained
- [ ] Loading spinner shows during fetch
- [ ] Error handled gracefully

### Edit Review Modal
- [ ] Modal opens on "Editar" button click
- [ ] Current review data pre-fills form
- [ ] Overall rating slider works (0-5, 0.5 increments)
- [ ] Detailed rating sliders work (1-5)
- [ ] Comment textarea accepts text (max 500 chars)
- [ ] Character counter works
- [ ] Tags display and are editable
- [ ] "Cancelar" closes without saving
- [ ] "Guardar cambios" button:
  - [ ] Only enabled if changes made
  - [ ] Shows loading state while saving
  - [ ] Closes on success
  - [ ] Shows error on failure
- [ ] Success toast displays after save

### Delete Review Modal
- [ ] Modal opens on "Eliminar" button click
- [ ] Shows review details (burger, restaurant, rating)
- [ ] Warning list displays:
  - [ ] Perderás 50 puntos
  - [ ] Se eliminarán fotos
  - [ ] Se perderán likes
- [ ] "Cancelar" closes without deleting
- [ ] "Eliminar review" button:
  - [ ] Shows confirmation message
  - [ ] Shows loading state
  - [ ] Removes review from list on success
  - [ ] Shows error on failure
  - [ ] Subtracts 50 points (verify in DB)

### Edit/Delete Validation
- [ ] Cannot edit/delete review not owned by user (403)
- [ ] Cannot delete non-existent review (404)
- [ ] Edit validates before saving
- [ ] Delete cascades properly (photos, burger rating)

---

## Top 5 Burgers Section Tests

### Section Rendering
- [ ] Top 5 section loads without errors
- [ ] Empty state displays when no reviews
- [ ] Current ranking displays with positions (🥇🥈🥉#️⃣#️⃣)
- [ ] "Mis Top 5 Burgers" title displays
- [ ] Last update timestamp displays

### Burger Cards Display
- [ ] Position badge shows correct number/medal
- [ ] Burger name displays
- [ ] Restaurant name displays
- [ ] Star rating displays (0-5)
- [ ] Burger type displays
- [ ] Match score displays (if available)
- [ ] Top 1 has highlighted background
- [ ] Top 1 has animated pulsing indicator
- [ ] Top 1 has award icon
- [ ] Top 1 has hover effect

### Manual Reordering (Drag-Drop)
- [ ] "Reordenar" button switches to drag mode
- [ ] Header changes to show "Arrastra para reorganizar"
- [ ] Drag handle (grip icon) visible on each card
- [ ] Can drag card up
- [ ] Can drag card down
- [ ] Dragging item shows 0.5 opacity
- [ ] Dragging item border highlights
- [ ] Drop updates position in list
- [ ] Visual feedback smooth (spring animation)
- [ ] Position numbers update after drop
- [ ] "Guardar cambios" button appears
- [ ] "Guardar cambios" only enabled if order changed
- [ ] "Cancelar" reverts to original order
- [ ] Save updates database
- [ ] Success message displays after save

### Auto-Calculate Feature
- [ ] "Auto-calcular" button visible
- [ ] Click opens preview dialog
- [ ] Dialog shows "Nuevo ranking:"
- [ ] Preview shows calculated top 5 (different from manual)
- [ ] Preview shows position badges
- [ ] Preview shows burger ratings
- [ ] Shows warning: "Se reemplazará tu ranking manual actual"
- [ ] "Cancelar" closes dialog without changing
- [ ] "Reemplazar ranking" button:
  - [ ] Shows loading state
  - [ ] Updates top 5 in UI
  - [ ] Updates database
  - [ ] Resets manual order flag
  - [ ] Closes dialog
- [ ] If calculated same as current:
  - [ ] Shows "El ranking es igual al actual"
  - [ ] "Reemplazar ranking" button disabled

### Algorithm Correctness
- [ ] Auto-calculate uses: (rating × 0.6 + likes × 0.1) × recency
- [ ] Recency factor decays after 1 year
- [ ] Most recent reviews weighted higher
- [ ] Top 5 sorted by score descending
- [ ] Caches for 1 hour
- [ ] Cache invalidates on review edit/delete

### Validation
- [ ] Cannot have duplicate burger in top 5
- [ ] Must have exactly 5 burgers
- [ ] All burger IDs must exist
- [ ] Error shows if validation fails

### Last Update Display
- [ ] Shows "Actualizado hace poco" if < 1 min
- [ ] Shows "Actualizado hace X min" if < 1 hour
- [ ] Updates after manual reorder
- [ ] Updates after auto-calculate

---

## Statistics Section Tests

### Stats Cards Display
- [ ] 4 cards visible (avgRating, totalReviews, totalLikes, mostVisitedMonth)
- [ ] Each card has icon
- [ ] Each card has label
- [ ] Each card has numeric value
- [ ] Cards color-coded (amber, blue, rose, green)
- [ ] Cards responsive (2 cols mobile, 4 cols desktop)
- [ ] Cards animate on entrance
- [ ] Cards have hover effects
- [ ] Icons scale on hover

### Average Rating Card
- [ ] Displays average of all reviews
- [ ] Rounded to 1 decimal (e.g., 4.2)
- [ ] Shows ⭐ icon
- [ ] "Rating Promedio" label

### Total Reviews Card
- [ ] Displays count of all reviews
- [ ] Shows BookOpen icon
- [ ] "Total Valoraciones" label

### Total Likes Card
- [ ] Displays sum of all likes
- [ ] Shows ❤️ icon
- [ ] "Likes Recibidos" label

### Month Card
- [ ] Displays month with most reviews
- [ ] Format: "2024-01 (5)" showing month and count
- [ ] Shows "-" if no reviews
- [ ] Shows 📅 icon
- [ ] "Mes Más Activo" label

### Rating Distribution Chart
- [ ] Bar chart displays when reviews exist
- [ ] X-axis shows rating levels (5⭐, 4⭐, 3⭐, 2⭐, 1⭐)
- [ ] Y-axis shows count
- [ ] Each bar colored by rating (gold, green, amber, orange, red)
- [ ] Bars animate on load
- [ ] Legend shows count and percentage
- [ ] Percentages sum to 100%
- [ ] Responsive width
- [ ] Tooltip shows on hover
- [ ] Empty state shows when no reviews

### Chart Data Accuracy
- [ ] Count matches actual reviews
- [ ] Percentages calculated correctly
- [ ] All 5 rating levels included (even if 0)
- [ ] Colors match rating level:
  - [ ] 5⭐ = gold
  - [ ] 4⭐ = green
  - [ ] 3⭐ = amber
  - [ ] 2⭐ = orange
  - [ ] 1⭐ = red

### Loading States
- [ ] Loading spinner shows while fetching stats
- [ ] Stats load from API correctly
- [ ] Error state handled gracefully

---

## API Tests

### My Reviews API

#### getMyReviews(userId, limit, offset)
- [ ] Returns array of reviews
- [ ] Each review has: id, burger, restaurant, rating, comment
- [ ] Paginated correctly (default 20)
- [ ] Sorted by created_at DESC
- [ ] Includes burger details (name, type, rating)
- [ ] Includes restaurant details (name, city)
- [ ] Returns empty array if user has no reviews
- [ ] Error returns empty array (not throw)

#### updateReview(reviewId, data)
- [ ] Updates overall_rating
- [ ] Updates detailed_ratings
- [ ] Updates comment
- [ ] Updates experience_tags
- [ ] Sets updated_at to current time
- [ ] Validates user owns review
- [ ] Returns updated review
- [ ] Error thrown on validation fail
- [ ] Recalculates burger average_rating

#### deleteReview(reviewId)
- [ ] Removes review from database
- [ ] Deletes associated photos from Storage
- [ ] Subtracts 50 points from user
- [ ] Updates burger average_rating
- [ ] Updates user review_count
- [ ] Returns true on success
- [ ] Throws error if not owned by user
- [ ] Throws error if not found

#### getReviewStats(userId)
- [ ] Returns avgRating (average of all ratings)
- [ ] Returns totalReviews (count)
- [ ] Returns totalLikes (sum of likes)
- [ ] Returns mostPopular (review with most likes)
- [ ] Returns mostVisitedRestaurant (restaurant_id)
- [ ] Returns monthWithMostReviews ([month, count])
- [ ] Returns all-zeros if no reviews
- [ ] avgRating rounded to 1 decimal

### Top Burgers API

#### getUserTopFive(userId)
- [ ] Returns array of max 5 burgers
- [ ] Returns manual top 5 if exists and cached
- [ ] Returns auto-calculated if no manual or cache expired
- [ ] Burgers include: id, name, type, average_rating, restaurant
- [ ] Returns empty array if no reviews
- [ ] Maintains order from ordered_burger_ids
- [ ] Cache valid for 1 hour
- [ ] Forces recalculation if cache expired

#### autoCalculateTopFive(userId)
- [ ] Returns top 5 by score algorithm
- [ ] Score = (rating × 0.6 + likes × 0.1) × recency
- [ ] Recency factor > 0.5 (minimum weight)
- [ ] Recency decays after 1 year
- [ ] Saves to user_top_burgers (is_manual=false)
- [ ] Returns same burgers if scores unchanged
- [ ] Returns different order if scores changed
- [ ] Returns empty if user has no reviews

#### updateUserTopFive(userId, burgerIds[])
- [ ] Accepts exactly 5 burger IDs
- [ ] Validates no duplicates
- [ ] Throws if duplicate found
- [ ] Throws if wrong count
- [ ] Sets is_manual=true
- [ ] Updates updated_at (invalidates cache)
- [ ] Saves to database
- [ ] Returns true on success

#### getGeneralTopFive()
- [ ] Returns top 5 burgers globally
- [ ] Ordered by average_rating DESC
- [ ] Returns max 5 results
- [ ] Returns empty if no burgers

#### invalidateUserTopFiveCache(userId)
- [ ] Sets updated_at to epoch (0)
- [ ] Forces recalculation on next load
- [ ] Does not throw on error

---

## Integration Tests

### End-to-End: Add Review → Top 5 Update
- [ ] User adds new review
- [ ] Review appears in my-reviews-section
- [ ] Average rating affects burger ranking
- [ ] Auto-calculate updates if enabled
- [ ] Top 5 reflects new review influence

### End-to-End: Delete Review → Points Deduction
- [ ] User deletes review
- [ ] Review removed from list
- [ ] 50 points subtracted from user account
- [ ] Burger rating recalculated
- [ ] User profile points updated
- [ ] Top 5 recalculated if affected

### End-to-End: Manual Reorder → Cache Invalidation
- [ ] User reorders top 5
- [ ] New order saved to database
- [ ] is_manual flag set to true
- [ ] Auto-calculate button works after
- [ ] Cache expires after 1 hour
- [ ] New reviews don't override manual order

---

## Mobile Responsiveness

### Viewport Tests (360px, 768px, 1024px)
- [ ] My reviews section responsive
- [ ] Review cards stack correctly
- [ ] Filter modal fits screen
- [ ] Top 5 cards readable
- [ ] Drag-drop works on mobile
- [ ] Stats grid responds correctly
- [ ] Charts responsive
- [ ] No horizontal scroll
- [ ] Touch targets large enough (44px min)
- [ ] Images scale properly

---

## Accessibility Tests

### Keyboard Navigation
- [ ] Tab through buttons
- [ ] Enter opens modals
- [ ] Escape closes modals
- [ ] Slider arrows work in forms
- [ ] "Guardar" button accessible

### Screen Reader
- [ ] Section headings announced
- [ ] Button labels announced
- [ ] Card content announced
- [ ] Form labels announced
- [ ] Modals announced
- [ ] Star ratings described

### Color Contrast
- [ ] Text on cards readable
- [ ] Chart colors sufficient contrast
- [ ] Button text sufficient contrast
- [ ] Icons have text labels

### Focus Indicators
- [ ] Buttons show focus ring
- [ ] Links show focus ring
- [ ] Form inputs show focus ring
- [ ] Drag handles show focus ring

---

## Performance Tests

### Load Time
- [ ] Initial load < 3s
- [ ] Infinite scroll smooth (no jank)
- [ ] Modals open < 300ms
- [ ] Charts render smoothly
- [ ] Animations 60 FPS
- [ ] Drag-drop smooth

### Bundle Size
- [ ] Component bundle < 100KB (gzip)
- [ ] API files < 50KB
- [ ] No unused imports
- [ ] Tree-shaking working

### API Performance
- [ ] getMyReviews < 500ms
- [ ] updateReview < 1s
- [ ] deleteReview < 1s
- [ ] getReviewStats < 500ms
- [ ] getUserTopFive < 300ms (cached)
- [ ] autoCalculateTopFive < 2s

---

## Error Scenarios

### Network Errors
- [ ] Handle timeout gracefully
- [ ] Show retry button
- [ ] Display user-friendly message
- [ ] No silent failures

### Database Errors
- [ ] Handle connection loss
- [ ] Handle RLS policy violations
- [ ] Handle unique constraint violations
- [ ] Handle foreign key violations

### Validation Errors
- [ ] Show validation message on form
- [ ] Prevent invalid submission
- [ ] Highlight invalid fields
- [ ] Clear error on correction

### Edge Cases
- [ ] User with 0 reviews
- [ ] User with 1-4 reviews (can't fill top 5)
- [ ] Review with 0 likes
- [ ] All reviews 5-stars (same score)
- [ ] Very long burger names
- [ ] Very long comments
- [ ] Special characters in text

---

## Deployment Pre-Checks

- [ ] All TypeScript errors resolved
- [ ] npm run build succeeds
- [ ] npm run lint succeeds
- [ ] No console errors/warnings
- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] RLS policies verified
- [ ] Storage bucket created
- [ ] Third-party APIs configured
- [ ] Analytics integrated
- [ ] Error logging configured
- [ ] Performance monitoring enabled

---

## Post-Launch Monitoring

### First 24 Hours
- [ ] Monitor API response times
- [ ] Check error logs
- [ ] Verify user reports
- [ ] Monitor Sentry
- [ ] Check Core Web Vitals
- [ ] Monitor CPU usage
- [ ] Check database performance

### Weekly
- [ ] Review analytics
- [ ] Check crash reports
- [ ] Verify all features working
- [ ] Check performance trends
- [ ] Review user feedback

---

## Sign-Off

- [ ] Product Owner: _________________ Date: _______
- [ ] QA Lead: _________________ Date: _______
- [ ] Engineering Lead: _________________ Date: _______
- [ ] DevOps: _________________ Date: _______

---

**Test Plan Version**: 1.0
**Status**: Ready for Testing
**Date Created**: 2024-01-24
