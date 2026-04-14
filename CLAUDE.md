# Remotion Video Project Guidelines

## Composition Defaults
- **Frame rate**: 30fps
- **Resolution**: 1920×1080 (width × height)
- **Determinism**: All React code must be deterministic

## Core Remotion Components
- `<OffthreadVideo>` - For background video rendering
- `<Img>` - Image assets
- `<Gif>` - Animated GIFs
- `<Audio>` - Audio tracks

## Animation Framework
Use frame-based animations with:
- `useCurrentFrame()` - Get current frame number
- `interpolate()` - Smooth value transitions
- `spring()` - Physics-based spring animations

## Critical Constraints

### ✅ DO:
- Use `random()` function with static seeds for deterministic randomness
- Keep all animations frame-based
- Use React hooks: `useCurrentFrame()`, `useVideoConfig()`, `useCallback()`
- Compose videos programmatically using sequences

### ❌ DON'T:
- **Never use `Math.random()`** - use Remotion's `random()` instead
- Add user interactions (`onClick`, `onHover`, etc.)
- Use non-deterministic operations
- Mix interactive React patterns with video code

## Sequence and Composition
```typescript
<Sequence from={0} durationInFrames={120}>
  <AnimatedComponent />
</Sequence>
```

## Context7 Integration
- Use context7 MCP for research and exploration
- Use context7 for accessing extended knowledge bases
