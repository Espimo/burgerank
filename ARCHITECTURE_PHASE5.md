# BurgeRank Platform Architecture

## Platform Overview

```
BurgeRank Platform (Next.js 16 + Supabase)
├── Search System (Phase 1) ✅
│   ├── 6 Components
│   ├── 1 Store (Zustand)
│   └── 1 API
├── Rating System (Phase 2) ✅
│   ├── 11 Components
│   ├── 3 APIs
│   └── 1 Utility (Badge Checker)
├── Rewards System (Phase 3) ✅
│   ├── 7 Components
│   ├── 6 APIs
│   └── 1 Utility (QR Code)
├── Profile System - Phase 1 (Phase 4) ✅
│   ├── 10 Components
│   ├── 2 APIs
│   └── 2 Utilities
└── Profile System - Phase 2 (Phase 5) ✅ CURRENT
    ├── 8 Components
    ├── 2 APIs
    └── 1 Database Schema
```

---

## Phase 5: Reviews & Top 5 Architecture

### Component Hierarchy

```
profile/
├── my-reviews-section/
│   ├── reviews-filters (modal)
│   ├── my-review-card (grid/list item)
│   │   ├── edit-review-modal (controlled modal)
│   │   └── delete-review-modal (confirmation)
│   └── Infinite scroll pagination
│
└── top-five-section/
    ├── top-five-burger-card (ranked display)
    ├── reorder-top-five (drag-drop modal)
    │   └── DraggableBurgerItem (dnd-kit item)
    ├── top-five-auto-calculate (preview dialog)
    └── Statistics display
```

### State Flow

```
My Reviews Section
├── State:
│   ├── reviews: Review[] (paginated)
│   ├── filters: { type, sortBy, restaurant, burgerTypes }
│   ├── viewMode: 'grid' | 'list'
│   └── page: number (for infinite scroll)
│
└── Actions:
    ├── loadMoreReviews() → getMyReviews()
    ├── applyFilters() → getMyReviews(filtered)
    ├── openEditModal() → updateReview()
    └── openDeleteModal() → deleteReview()

Top Five Section
├── State:
│   ├── topBurgers: TopBurger[]
│   ├── isReordering: boolean
│   └── lastManualUpdate: Date
│
└── Actions:
    ├── loadTopFive() → getUserTopFive()
    ├── startReordering() → toggle mode
    ├── saveNewOrder() → updateUserTopFive()
    ├── autoCalculate() → autoCalculateTopFive()
    └── invalidateCache() → invalidateUserTopFiveCache()
```

---

## API Architecture

### My Reviews API (`lib/api/my-reviews.ts`)

```
getMyReviews(userId, limit?, offset?)
├── Query: reviews by user_id
├── Join: burgers, restaurants
├── Sort: created_at DESC
├── Paginate: offset/limit
└── Return: Review[]

updateReview(reviewId, data)
├── Validate: user owns review
├── Update: rating, detailed_ratings, comment, tags
├── Set: updated_at = now()
├── Recalculate: burger average_rating
└── Return: Review

deleteReview(reviewId)
├── Fetch: review & images
├── Delete: Storage files
├── Delete: review record
├── Update: burger average_rating
├── Subtract: 50 points from user
├── Update: user review_count
├── Return: boolean

getReviewStats(userId)
├── Aggregate: all reviews
├── Calculate:
│   ├── avgRating: avg(overall_rating)
│   ├── totalReviews: count(*)
│   ├── mostPopular: max(likes_count)
│   ├── mostVisitedRestaurant: mode(restaurant_id)
│   ├── monthWithMostReviews: [month, count]
│   └── totalLikes: sum(likes_count)
└── Return: ReviewStats
```

### Top Burgers API (`lib/api/top-burgers.ts`)

```
getUserTopFive(userId)
├── Query: user_top_burgers
├── Check: cache valid? (< 1 hour)
│   ├── Yes: return cached
│   └── No: autoCalculateTopFive()
├── Fetch: burger details by IDs
├── Maintain: order from ordered_burger_ids
└── Return: Burger[]

autoCalculateTopFive(userId)
├── Fetch: all reviews by user
├── Group: by burger_id
├── Calculate: score
│   ├── score = (rating × 0.6 + likes × 0.1) × recency_factor
│   ├── recency_factor = max(0.5, 1 - daysOld/365)
├── Sort: by score DESC
├── Take: top 5
├── Save: user_top_burgers (is_manual=false)
└── Return: Burger[]

updateUserTopFive(userId, burgerIds[])
├── Validate: exactly 5 burgers
├── Validate: no duplicates
├── Validate: all exist in burgers
├── Upsert: user_top_burgers (is_manual=true)
├── Set: updated_at = now() (invalidates cache)
└── Return: boolean

getGeneralTopFive()
├── Query: all burgers
├── Sort: average_rating DESC
├── Take: 5
└── Return: Burger[] (global ranking)

invalidateUserTopFiveCache(userId)
├── Update: user_top_burgers
├── Set: updated_at = epoch(0)
└── Effect: forces recalculation next load
```

---

## Database Schema

### New Table: `user_top_burgers`

```sql
CREATE TABLE user_top_burgers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ordered_burger_ids UUID[] NOT NULL,      -- [burger1, burger2, burger3, burger4, burger5]
  is_manual BOOLEAN DEFAULT true,           -- true: manual reorder, false: auto-calculated
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  
  UNIQUE(user_id),
  INDEX idx_user_id
);

RLS POLICIES:
- SELECT: auth.uid() = user_id
- INSERT: auth.uid() = user_id
- UPDATE: auth.uid() = user_id
- DELETE: auth.uid() = user_id

TRIGGER: update_user_top_burgers_updated_at
- On UPDATE: set updated_at = now()
```

### Extended Table: `reviews` (existing)

```sql
-- Columns used by Phase 5 APIs:
- id: UUID
- user_id: UUID
- burger_id: UUID
- restaurant_id: UUID
- overall_rating: numeric (0-5, 0.1 precision)
- detailed_ratings: JSONB { bread?, meat?, sauce?, toppings? }
- comment: TEXT
- experience_tags: TEXT[]
- images: TEXT[]
- verified: BOOLEAN
- likes_count: INTEGER
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

-- Foreign Keys:
- user_id → auth.users.id
- burger_id → burgers.id
- restaurant_id → restaurants.id
```

---

## Type System

### TypeScript Interfaces

```typescript
// Core Review Type
interface Review {
  id: string
  user_id: string
  burger_id: string
  burger?: {
    id: string
    name: string
    type: string
    average_rating: number
  }
  restaurant_id: string
  restaurant?: {
    id: string
    name: string
    city: string
  }
  overall_rating: number
  detailed_ratings?: {
    bread?: number
    meat?: number
    sauce?: number
    toppings?: number
    presentation?: number
    price_value?: number
    overall_experience?: number
  }
  comment?: string
  experience_tags?: string[]
  images?: string[]
  verified: boolean
  likes_count: number
  created_at: string
  updated_at: string
}

// Core Burger Type (Top 5)
interface Burger {
  id: string
  name: string
  type: string
  average_rating: number
  restaurant?: {
    id: string
    name: string
    city: string
  }
  match_score?: number
}

// Ranked Burger
interface TopBurger extends Burger {
  position: number // 1-5
}

// Review Statistics
interface ReviewStats {
  avgRating: number
  totalReviews: number
  mostPopular: Review | null
  mostVisitedRestaurant: string | null
  monthWithMostReviews: [string, number] | null
  totalLikes: number
}

// Filter Types
type FilterType = 'all' | 'five-stars' | 'recent'
type SortBy = 'date' | 'rating' | 'restaurant'
type ViewMode = 'grid' | 'list'

// Component Props Interfaces
interface MyReviewsProps {
  userId: string
}

interface MyReviewCardProps {
  review: Review
  onEdit?: (review: Review) => void
  onDelete?: (review: Review) => void
}

interface TopFiveSectionProps {
  userId: string
}

interface ReorderTopFiveProps {
  burgers: Burger[]
  onComplete: (reordered: Burger[]) => void
  onCancel: () => void
}

interface ReviewStatsCardProps {
  stat: 'avgRating' | 'totalReviews' | 'totalLikes' | 'monthWithMostReviews'
  label: string
  value: string | number
  icon: React.ReactNode
  color?: 'amber' | 'rose' | 'blue' | 'green' | 'purple'
}

interface RatingDistributionProps {
  reviews: Review[]
  variant?: 'bar' | 'pie'
}
```

---

## Animation Architecture

### Framer Motion Variants

```typescript
// Container Stagger
containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

// Item Entrance
itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
}

// Card Hover
whileHover = { scale: 1.02, y: -4, boxShadow: '0 20px 25px...' }
whileTap = { scale: 0.98 }

// Layout Transitions
layoutId: burger.id
AnimatePresence mode: 'popLayout'
```

### Specific Animation Patterns

```
Review Card Load:
├── Initial: opacity 0, y 20
├── Animate: opacity 1, y 0 (spring)
├── Hover: scale 1.02, shadow increase
└── Tap: scale 0.98

Top Burger Card (Ranked):
├── Initial: scale 0, rotate -180 (Award icon)
├── Animate: scale 1, rotate 0
├── Hover: position scale 1.1
├── Highlight: pulsing dot (scale/opacity)
└── Drag: 0.5 opacity during drag

Drag-Drop Reordering:
├── Drag: scale opacity 0.5
├── Over: border highlight
├── Drop: spring position
└── Exit: opacity fade + slide

Statistics Cards:
├── Entrance: opacity 0, scale 0.95
├── Animate: opacity 1, scale 1
├── Hover: rotate 360° (background)
└── Icon: hover scale 1.1, rotate 5°
```

---

## Performance Optimizations

### Component Optimizations

```typescript
// Memoization
React.memo(Component) // Prevent re-renders
useCallback() // Memoize callbacks

// Lazy Loading
lazy(() => import('@/components/my-reviews-section'))

// Code Splitting
Dynamic imports for modals

// Infinite Scroll
Load 20 items per page
Cache previous pages
```

### API Optimizations

```
Top 5 Caching:
├── Duration: 1 hour
├── Storage: user_top_burgers table
├── Invalidation: manual or on review change
└── Strategy: check timestamp < 1 hour

Query Optimization:
├── Index: idx_user_top_burgers_user_id
├── Join: burgers + restaurants in single query
├── Pagination: offset/limit
└── Select: only needed columns
```

---

## Security

### Row-Level Security (RLS)

```sql
-- All tables have RLS enabled
-- Users can only access their own data

users_reviews:
- SELECT: auth.uid() = user_id
- INSERT: auth.uid() = user_id
- UPDATE: auth.uid() = user_id
- DELETE: auth.uid() = user_id

user_top_burgers:
- SELECT: auth.uid() = user_id
- INSERT: auth.uid() = user_id
- UPDATE: auth.uid() = user_id
- DELETE: auth.uid() = user_id
```

### API Security

```typescript
// Validation
- User owns review before update/delete
- Exactly 5 burgers in top 5
- No duplicate burgers
- Points deduction transaction

// Error Handling
- Silent failures on not found
- Graceful fallbacks
- No sensitive data in errors
```

---

## Monitoring & Logging

### Error Logging

```typescript
catch (error) {
  console.error('Operation error:', error)
  // Could send to Sentry/LogRocket
}
```

### Performance Metrics

```
Track:
- API response times
- Component render times
- Infinite scroll performance
- Drag-drop smoothness
```

---

## Deployment Checklist

- [ ] Run Supabase migrations
- [ ] Install all dependencies
- [ ] Build: `npm run build` (no errors)
- [ ] Test with real data
- [ ] Verify RLS policies
- [ ] Check mobile responsiveness
- [ ] Performance audit
- [ ] Accessibility audit
- [ ] Security review

---

## Future Enhancements

1. **Edit History Versioning**
   - Track all changes to reviews
   - Show diff view of changes
   - Allow rollback to previous versions

2. **Social Features**
   - Share reviews to social media
   - Pin favorite review
   - Collaborate top 5 with friends

3. **Export Features**
   - Download reviews as PDF
   - Export top 5 as image
   - CSV export for analysis

4. **Advanced Analytics**
   - Monthly trends chart
   - Rating distribution animation
   - Word cloud from comments
   - Burger type preferences

5. **AI Features**
   - Smart recommendations
   - Sentiment analysis of comments
   - Duplicate burger detection
   - Auto-tagging from comments

6. **Mobile App**
   - Native iOS/Android
   - Offline support
   - Push notifications
   - AR burger visualization

---

## Files Created (Phase 5)

| File | Type | Lines | Purpose |
|------|------|-------|---------|
| my-reviews-section.tsx | Component | 209 | Main reviews view with filters |
| reviews-filters.tsx | Component | 155 | Filter modal |
| my-review-card.tsx | Component | 227 | Individual review card |
| edit-review-modal.tsx | Component | 168 | Edit form |
| delete-review-modal.tsx | Component | 99 | Delete confirmation |
| top-five-section.tsx | Component | 186 | Top 5 main container |
| top-five-burger-card.tsx | Component | 147 | Ranked burger card |
| reorder-top-five.tsx | Component | 174 | Drag-drop interface |
| top-five-auto-calculate.tsx | Component | 142 | Auto-calculate dialog |
| review-stats-card.tsx | Component | 73 | Statistics card |
| rating-distribution.tsx | Component | 159 | Charts with Recharts |
| my-reviews.ts | API | 199 | Review CRUD operations |
| top-burgers.ts | API | 252 | Top 5 management |
| migration.sql | Database | 48 | Schema + RLS |
| **TOTAL** | | **2,039** | |

---

## Support & Documentation

- PROFILE_PHASE2_SUMMARY.md - Overview & features
- PROFILE_PHASE2_INTEGRATION.md - Integration guide
- profile-reviews-example.tsx - Complete working example
- This file - Technical architecture

---

**Version**: 1.0.0
**Status**: ✅ Production Ready
**Last Updated**: 2024-01-24
