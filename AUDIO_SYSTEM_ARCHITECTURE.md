# Audio Integration System Architecture

## Overview
A comprehensive audio generation system for the Spicy Stories Club, powered by ElevenLabs, enabling scene narration, character voice mapping, and premium audio experiences for VIP members.

---

## V1 Audio Features

### Core Features
1. **Scene Narration** - Generate audio for individual steamy scenes
2. **Chapter Read-Aloud** - Full chapter audio narration
3. **Character Voice Assignment** - Map specific voices to characters
4. **Audio Export** - Download MP3 files for offline listening
5. **Audio Player** - In-app playback with controls

### Premium Features (Gold Tier)
1. **Premium Voice Packs** - Exclusive sensual/dramatic voices
2. **Multi-Voice Scenes** - Different voices for different characters in same scene
3. **Custom Voice Requests** - Request specific voice styles

---

## Voice Library

### Standard Voices (All Tiers)
| Voice ID | Name | Style | Gender | Best For |
|----------|------|-------|--------|----------|
| Rachel | Rachel | Warm, Intimate | Female | Romance narration |
| Drew | Drew | Deep, Commanding | Male | Billionaire heroes |
| Bella | Bella | Soft, Sensual | Female | Steamy scenes |
| Antoni | Antoni | Smooth, Charming | Male | Romantic leads |

### Premium Voices (Gold Only)
| Voice ID | Name | Style | Gender | Best For |
|----------|------|-------|--------|----------|
| Charlotte | Charlotte | Sultry, Dramatic | Female | Intense scenes |
| Clyde | Clyde | Gravelly, Dominant | Male | Alpha heroes |
| Elli | Elli | Breathy, Seductive | Female | Intimate moments |
| Josh | Josh | Commanding, Powerful | Male | CEO characters |

### Character → Voice Mapping (Manhattan Money Kings)
| Character | Book | Default Voice | Premium Voice |
|-----------|------|---------------|---------------|
| Sarah Chen | Book 1 | Rachel | Charlotte |
| Michael Chen | Book 1 | Drew | Josh |
| Elena Kim | Book 2 | Bella | Elli |
| David Kim | Book 2 | Antoni | Clyde |
| Sophia Reed | Book 3 | Rachel | Charlotte |
| Dominic Kane | Book 3 | Drew | Josh |
| Victoria Cruz | Book 0.5 | Bella | Elli |
| James Chen | Book 0.5 | Antoni | Clyde |

---

## Subscription Tiers & Limits

| Feature | Free | Bronze ($9.99) | Silver ($19.99) | Gold ($29.99) |
|---------|------|----------------|-----------------|---------------|
| Audio Minutes/Month | 10 | 60 | 180 | Unlimited |
| Standard Voices | ✓ | ✓ | ✓ | ✓ |
| Premium Voices | ✗ | ✗ | ✗ | ✓ |
| Multi-Voice Scenes | ✗ | ✗ | ✓ | ✓ |
| Audio Download | ✗ | ✓ | ✓ | ✓ |
| Character Voice Mapping | ✗ | ✗ | ✓ | ✓ |
| Priority Generation | ✗ | ✗ | ✗ | ✓ |

---

## Technical Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (React)                          │
├─────────────────────────────────────────────────────────────┤
│  AudioPlayer  │  VoiceSelector  │  AudioHub  │  StoryPlayer │
└───────────────┬─────────────────┬────────────┬──────────────┘
                │                 │            │
                ▼                 ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                    tRPC API Layer                            │
├─────────────────────────────────────────────────────────────┤
│  audio.generate  │  audio.getVoices  │  audio.trackUsage    │
│  audio.export    │  audio.getHistory │  audio.checkLimits   │
└───────────────┬─────────────────┬────────────┬──────────────┘
                │                 │            │
                ▼                 ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Audio Service Layer                        │
├─────────────────────────────────────────────────────────────┤
│  TextChunker  │  VoiceMapper  │  UsageTracker  │  Paywall   │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                   ElevenLabs API                             │
├─────────────────────────────────────────────────────────────┤
│  text-to-speech  │  voices  │  models  │  history           │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                      S3 Storage                              │
├─────────────────────────────────────────────────────────────┤
│  /audio/stories/{storyId}/{chunkId}.mp3                     │
│  /audio/scenes/{sceneId}.mp3                                │
│  /audio/exports/{userId}/{exportId}.mp3                     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Generate Audio Request**
   ```
   User clicks "Listen" → Check usage limits → Chunk text →
   Generate audio via ElevenLabs → Upload to S3 → Update DB →
   Return audio URL → Play in AudioPlayer
   ```

2. **Multi-Voice Scene**
   ```
   Parse scene for dialogue → Identify speakers →
   Map speakers to voices → Generate each part →
   Concatenate audio → Upload combined file
   ```

3. **Usage Tracking**
   ```
   Before generation → Check monthly limit →
   If exceeded → Show upgrade CTA →
   If allowed → Generate → Deduct from balance →
   Update usage record
   ```

---

## Data Models

### voices Table
```sql
CREATE TABLE voices (
  id VARCHAR(36) PRIMARY KEY,
  elevenLabsId VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  style VARCHAR(50),
  gender ENUM('male', 'female', 'neutral'),
  isPremium BOOLEAN DEFAULT FALSE,
  previewUrl VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### audio_usage Table
```sql
CREATE TABLE audio_usage (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  monthYear VARCHAR(7) NOT NULL, -- '2025-01'
  minutesUsed DECIMAL(10,2) DEFAULT 0,
  minutesLimit INT NOT NULL,
  lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (userId, monthYear)
);
```

### generated_audio Table
```sql
CREATE TABLE generated_audio (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  storyId VARCHAR(36),
  sceneId VARCHAR(36),
  voiceId VARCHAR(36) NOT NULL,
  textContent TEXT NOT NULL,
  audioUrl VARCHAR(500) NOT NULL,
  durationSeconds INT,
  characterCount INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### character_voices Table
```sql
CREATE TABLE character_voices (
  id VARCHAR(36) PRIMARY KEY,
  characterName VARCHAR(100) NOT NULL,
  bookId VARCHAR(36),
  defaultVoiceId VARCHAR(36) NOT NULL,
  premiumVoiceId VARCHAR(36),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### audio.generate
```typescript
input: {
  text: string;
  voiceId?: string;
  storyId?: string;
  sceneId?: string;
}
output: {
  audioUrl: string;
  durationSeconds: number;
  remainingMinutes: number;
}
```

### audio.getVoices
```typescript
input: {}
output: {
  standard: Voice[];
  premium: Voice[];
  userTier: 'free' | 'bronze' | 'silver' | 'gold';
}
```

### audio.checkLimits
```typescript
input: { characterCount: number }
output: {
  canGenerate: boolean;
  estimatedMinutes: number;
  remainingMinutes: number;
  upgradeRequired: boolean;
}
```

### audio.trackUsage
```typescript
input: { minutesUsed: number }
output: {
  totalUsed: number;
  limit: number;
  percentUsed: number;
}
```

---

## Error Handling

| Error | User Message | Action |
|-------|--------------|--------|
| Rate limit exceeded | "You've reached your monthly limit. Upgrade for more!" | Show upgrade CTA |
| ElevenLabs API error | "Audio generation temporarily unavailable. Try again." | Retry with backoff |
| Text too long | "This content is too long. Try a shorter section." | Suggest chunking |
| Premium voice locked | "This voice is available for Gold members." | Show upgrade CTA |
| Network error | "Connection issue. Please check your internet." | Retry button |

---

## Success Metrics

1. **Engagement**: % of VIP members using audio features
2. **Conversion**: Free → Paid upgrades from audio paywalls
3. **Retention**: Audio users vs non-audio user retention
4. **Usage**: Average minutes generated per user per month
5. **Quality**: User ratings of audio quality

---

## Implementation Priority

### Week 1 (High Priority)
1. ✅ ElevenLabs API wrapper (already exists)
2. Voice library setup
3. Basic audio generation for stories
4. Audio player component
5. Usage tracking

### Week 2 (Medium Priority)
1. Character voice mapping
2. Multi-voice scenes
3. Paywall integration
4. Audio hub dashboard
5. Export functionality

### Future (v2)
1. Emotional sliders (intensity, pace)
2. Background music/ambiance
3. Voice cloning for author
4. Interactive audio stories
5. Podcast-style episodes
