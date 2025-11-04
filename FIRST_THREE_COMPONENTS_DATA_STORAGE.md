# First Three Components Data Storage

## Component 1: `hormone-meditation` (Audio Script Component)

**Component ID:** `hormone-meditation`
**Type:** Audio Script
**Location in code:** Lines 456-603

### Data Fields Stored:

1. **`insights`** (Textarea)
   - Field: "What insights came up during this session?"
   - Storage key: `responses.insights`
   - Code: Line 541-544
   ```tsx
   <Textarea
     id="insights"
     value={responses.insights || ''}
     onChange={(e) => setResponses({...responses, insights: e.target.value})}
   />
   ```

2. **`feeling`** (Input)
   - Field: "How are you feeling right now?"
   - Storage key: `responses.feeling`
   - Code: Line 551-554
   ```tsx
   <Input
     id="feeling"
     value={responses.feeling || ''}
     onChange={(e) => setResponses({...responses, feeling: e.target.value})}
   />
   ```

### Storage Pattern:
```javascript
responses = {
  insights: "User's reflection text...",
  feeling: "User's current state description..."
}
```

---

## Component 2: `symptom-tracker` (Hormone Symptom Tracker)

**Component ID:** `symptom-tracker` or `hormone-symptom-tracker`
**Type:** Detailed Exercise
**Location in code:** Lines 718-863

### Data Fields Stored:

1. **Symptom Sliders** (Multiple)
   - Field: Rating for each symptom (1-5)
   - Storage key: `responses[\`${section.name}-${item}\`]`
   - Example keys: `"Physical-Hot flashes"`, `"Emotional-Mood swings"`, etc.
   - Code: Lines 755-760
   ```tsx
   <Slider
     value={[responses[`${section.name}-${item}`] || 1]}
     onValueChange={(value) => setResponses({
       ...responses,
       [`${section.name}-${item}`]: value[0]
     })}
   />
   ```

2. **`strongestTime`** (RadioGroup)
   - Field: "What time of day do symptoms feel strongest?"
   - Storage key: `responses.strongestTime`
   - Options: "morning", "afternoon", "evening", "night"
   - Code: Lines 792-794
   ```tsx
   <RadioGroup
     value={responses.strongestTime || ''}
     onValueChange={(value) => setResponses({...responses, strongestTime: value})}
   />
   ```

3. **Trigger Checkboxes** (Multiple)
   - Field: "Potential triggers you noticed today"
   - Storage key: `responses[\`trigger-${trigger}\`]`
   - Example keys: `"trigger-Stress"`, `"trigger-Poor sleep"`, etc.
   - Code: Lines 822-826
   ```tsx
   <Checkbox
     checked={responses[`trigger-${trigger}`] || false}
     onCheckedChange={(checked) => setResponses({
       ...responses,
       [`trigger-${trigger}`]: checked
     })}
   />
   ```

4. **`whatHelped`** (Textarea)
   - Field: "What helped you feel better today?"
   - Storage key: `responses.whatHelped`
   - Code: Lines 837-839
   ```tsx
   <Textarea
     value={responses.whatHelped || ''}
     onChange={(e) => setResponses({...responses, whatHelped: e.target.value})}
   />
   ```

5. **`energyLevel`** (Slider)
   - Field: "Overall energy level today (1-10)"
   - Storage key: `responses.energyLevel`
   - Code: Lines 848-849
   ```tsx
   <Slider
     value={[responses.energyLevel || 5]}
     onValueChange={(value) => setResponses({...responses, energyLevel: value[0]})}
   />
   ```

### Storage Pattern:
```javascript
responses = {
  "Physical-Hot flashes": 3,
  "Physical-Night sweats": 4,
  "Emotional-Mood swings": 2,
  "Emotional-Anxiety": 3,
  "Cognitive-Brain fog": 4,
  strongestTime: "evening",
  "trigger-Stress": true,
  "trigger-Poor sleep": true,
  "trigger-Caffeine": false,
  whatHelped: "Walking outside helped...",
  energyLevel: 6
}
```

---

## Component 3: `morning-ritual` (Morning Sunlight Practice)

**Component ID:** `morning-ritual`
**Type:** Detailed Exercise
**Location in code:** Lines 1047-1164

### Data Fields Stored:

1. **`morningTime`** (RadioGroup)
   - Field: "What time will you do this practice?"
   - Storage key: `responses.morningTime`
   - Options: "6-7am", "7-8am", "8-9am", "9-10am"
   - Code: Lines 1064-1065
   ```tsx
   <RadioGroup
     value={responses.morningTime || ''}
     onValueChange={(value) => setResponses({...responses, morningTime: value})}
   />
   ```

2. **`sunlightLocation`** (RadioGroup)
   - Field: "Where will you do your sunlight practice?"
   - Storage key: `responses.sunlightLocation`
   - Options: "outside", "window", "walk"
   - Code: Lines 1049-1050 (similar pattern)

3. **`duration`** (RadioGroup)
   - Field: "Duration you can commit to"
   - Storage key: `responses.duration`
   - Options: "5min", "10min", "15min"
   - Code: Lines 1070-1071
   ```tsx
   <RadioGroup
     value={responses.duration || ''}
     onValueChange={(value) => setResponses({...responses, duration: value})}
   />
   ```

4. **Step Checkboxes** (Multiple)
   - Field: Morning ritual steps
   - Storage key: `responses[\`step-${item.step}\`]`
   - Example keys: `"step-1"`, `"step-2"`, etc.
   - Code: Lines 1134-1138
   ```tsx
   <Checkbox
     checked={responses[`step-${item.step}`] || false}
     onCheckedChange={(checked) => setResponses({
       ...responses,
       [`step-${item.step}`]: checked
     })}
   />
   ```

5. **Day Tracker Checkboxes** (Multiple)
   - Field: Daily practice tracker for week
   - Storage key: `responses[\`morning-day-${day}\`]`
   - Example keys: `"morning-day-1"`, `"morning-day-2"`, etc.
   - Code: Lines 1157-1158
   ```tsx
   <Checkbox
     checked={responses[`morning-day-${day}`] || false}
     onCheckedChange={(checked) => setResponses({...responses, [`morning-day-${day}`]: checked})}
   />
   ```

6. **`sunlightFeeling`** (Slider)
   - Field: "How did the sunlight make you feel? (1-10)"
   - Storage key: `responses.sunlightFeeling`
   - Code: Lines 1148-1149
   ```tsx
   <Slider
     value={[responses.sunlightFeeling || 5]}
     onValueChange={(value) => setResponses({...responses, sunlightFeeling: value[0]})}
   />
   ```

7. **`dailyIntention`** (Input)
   - Field: "What positive intention did you set today?"
   - Storage key: `responses.dailyIntention`
   - Code: Lines 1162-1165
   ```tsx
   <Input
     value={responses.dailyIntention || ''}
     onChange={(e) => setResponses({...responses, dailyIntention: e.target.value})}
   />
   ```

8. **`morningNotes`** (Textarea)
   - Field: "Notes about your morning practice"
   - Storage key: `responses.morningNotes`
   - Code: Lines 1174-1176
   ```tsx
   <Textarea
     value={responses.morningNotes || ''}
     onChange={(e) => setResponses({...responses, morningNotes: e.target.value})}
   />
   ```

### Storage Pattern:
```javascript
responses = {
  morningTime: "7-8am",
  sunlightLocation: "outside",
  duration: "10min",
  "step-1": true,
  "step-2": true,
  "step-3": false,
  "morning-day-1": true,
  "morning-day-2": true,
  "morning-day-3": false,
  sunlightFeeling: 8,
  dailyIntention: "I choose calm confidence today",
  morningNotes: "Felt great after 10 minutes..."
}
```

---

## Common Storage Pattern

All components use the same pattern:
1. **State:** `const [responses, setResponses] = useState<any>({});`
2. **Loading:** Initial data loaded from `coachingData?.coachingProgress?.responseData?.[component.id]`
3. **Saving:** Data saved via `updateCoachingProgressDB({ componentId, moduleId, weekNumber, responseData: responses })`
4. **Storage:** All data stored under `responseData[component.id]` in the database

## Debug Steps

1. Check console logs for `[component.id]` prefix
2. Verify `lastSavedRef.current[component.id]` matches saved data
3. Check if DB sync is skipping correctly when data matches
4. Verify form inputs are controlled and update `responses` state correctly

