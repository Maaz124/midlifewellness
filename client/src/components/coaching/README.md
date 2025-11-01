# Coaching Components - Modular Structure

## 📁 Directory Structure

```
coaching/
├── shared/
│   ├── types.ts          # Shared TypeScript interfaces
│   ├── data.ts           # Shared data (rituals, breathwork patterns, etc.)
│   └── README.md
├── week1/               # Mental Clarity & Mindset
├── week2/               # Emotional Regulation
├── week3/               # Cognitive Health
├── week4/               # Nervous System Regulation
├── week5/               # Goals & Future Vision
├── week6/               # Habit Formation
├── COMPONENT_MAP.md     # Detailed component mapping
└── README.md            # This file
```

## 🎯 Current Status

**PROBLEM IDENTIFIED**: The `enhanced-coaching-component-fixed.tsx` file is 15,863 lines long with 32 component functions - way too large!

**SOLUTION IN PROGRESS**:
1. ✅ Created modular directory structure
2. ✅ Extracted shared types and data
3. ✅ Documented all 32 components and their locations
4. ⏳ Ready to extract components by week

## 🚀 Next Steps

You have 3 options:

### Option 1: Gradual Extraction (Recommended)
Extract components week-by-week as needed. Start with Week 1 (10 components), then Week 2, etc.

**Pros**: Manageable, testable, lower risk
**Time**: ~10-15 minutes per week

### Option 2: Full Extraction
Extract all 32 components into separate files now.

**Pros**: Complete refactor in one go
**Time**: ~1-2 hours

### Option 3: Keep Current Structure, Improve Organization
Keep components in the large file but add better navigation/comments.

**Pros**: Quickest, no risk of breaking anything
**Time**: ~10 minutes

## 📊 Component Breakdown

| Week | Components | Focus Area |
|------|-----------|------------|
| 1 | 10 | Mental Clarity & Mindset |
| 2 | 9 | Emotional Regulation |
| 3 | 5 | Cognitive Health |
| 4 | 4 | Nervous System |
| 5-6 | 4 | Goals & Habits |
| **Total** | **32** | |

## 💡 Recommendation

Start with **Week 1** extraction as a proof of concept. If it works well, continue with the rest.

**Would you like me to**:
- A) Extract Week 1 components now (10 components)
- B) Extract all weeks (all 32 components)  
- C) Just organize the existing file better
- D) Something else?

