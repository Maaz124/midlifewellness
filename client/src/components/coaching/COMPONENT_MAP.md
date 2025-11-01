# Coaching Components Structure

This document maps all coaching components from `enhanced-coaching-component-fixed.tsx` organized by week.

## Component Organization

### Week 1: Mental Clarity & Mindset (Lines ~36-6591)
- `InteractiveFocusMemoryRituals` - Focus and memory improvement rituals
- `CortisolResetBreathwork` - Breathwork for stress reduction
- `ResettingYourMentalSpace` - Brain fog clearing techniques
- `InteractiveSymptomTracker` - Daily symptom tracking
- `MorningRitualCreator` - Morning routine builder
- `BrainFogClearingPractice` - Mental clarity exercises
- `EnergyPatternMapper` - Energy level tracking
- `ThoughtPatternTracker` - Thought awareness tool
- `NutritionPlanningTool` - Brain-boosting nutrition
- `EveningRoutineCreator` - Evening wind-down routine

### Week 2: Emotional Regulation (Lines ~1712-6591)
- `CBTThoughtTransformationSystem` - CBT-based thought reframing
- `MirrorWorkEmpowermentAffirmations` - Mirror work and affirmations
- `ThoughtAuditTracker` - Tracking thought patterns
- `NLPReframingPractice` - NLP reframing techniques
- `HormoneHarmonyMeditation` - Guided meditation for hormones
- `OverwhelmPatternAnalysis` - Overwhelm identification
- `PauseLabelShiftTechnique` - Emotional regulation technique
- `BoundariesWorksheet` - Boundaries setting practice
- `WeeklyMoodMap` - Mood tracking and patterns

### Week 3: Cognitive Health (Lines ~6592-9750)
- `UnderstandingYourHormonalSymphony` - Hormone education
- `EnhancedCognitiveAssessment` - Cognitive function assessment
- `FocusMemoryRituals` - Focus improvement practices
- `BrainBoostingNutritionPlan` - Nutrition for brain health
- `MindManagementSystem` - Mind management tools

### Week 4: Nervous System Regulation (Lines ~9751-12685)
- `BreathworkVagusReset` - Vagus nerve activation
- `SomaticGroundingPractices` - Somatic exercises
- `CreateCalmCorner` - Create calming space
- `GuidedGroundingMeditation` - Grounding meditation

### Week 5-6: Goals & Habits (Lines ~12686-15863)
- `FutureSelfVisualization` - Future self visioning
- `SmartGoalArchitecture` - SMART goal creation
- `ReverseEngineeringSuccess` - Success planning
- `HabitLoopMastery` - Habit formation system

## Refactoring Strategy

### Phase 1: Shared Resources (✅ COMPLETE)
- [x] Create shared types file
- [x] Create shared data file
- [x] Create directory structure

### Phase 2: Extract by Week (IN PROGRESS)
- [ ] Week 1 components
- [ ] Week 2 components
- [ ] Week 3 components
- [ ] Week 4 components
- [ ] Week 5-6 components

### Phase 3: Update Main Component
- [ ] Import modular components
- [ ] Remove redundant code
- [ ] Test functionality

## Notes
- Each component follows the same pattern: `{ onComplete, onClose }` props
- Components use `useCoachingProgress()` hook for data persistence
- Most components have multi-step flows with progress tracking

