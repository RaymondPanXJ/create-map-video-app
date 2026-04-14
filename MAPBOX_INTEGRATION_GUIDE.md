# Mapbox + Remotion Integration Guide

## ✅ Implemented

### 1. Dependencies Installed
- `react-map-gl` - React wrapper for Mapbox GL
- `mapbox-gl` - Mapbox GL JavaScript library
- `@types/mapbox-gl` - TypeScript types

### 2. Configuration
**File**: `.env`
```
REMOTION_MAPBOX_TOKEN=pk.your_mapbox_token_here
```
Replace `pk.your_mapbox_token_here` with your actual Mapbox public token from https://account.mapbox.com/tokens

### 3. MapVideo Component
**File**: `src/compositions/MapVideo.tsx`

Key features:
- Uses `delayRender()` / `continueRender()` API to wait for async map initialization
- Animates camera position from Beijing (116.4, 39.9) to Tokyo (139.7, 35.7)
- Zoom level: 4 → 6 → 10 over 300 frames (10 seconds @ 30fps)
- Map style: Mapbox Light (can be changed via `mapStyle` prop)
- Frame-based animation ensures deterministic rendering

### 4. Composition Registration
**File**: `src/index.tsx`

MapVideo composition added with:
- Duration: 300 frames (10 seconds)
- FPS: 30
- Resolution: 1920×1080

## Usage

### Development Preview
```bash
npm run dev
```
Select "MapVideo" from the composition list to preview in real-time.

### Render to File
```bash
npx remotion render src/root.tsx MapVideo out/map-video.mp4
```

## Architecture

### Async Rendering Pattern
```
Component Mounts
  ↓
delayRender() called → Remotion waits
  ↓
Map loads and idle
  ↓
onLoad fires → continueRender() called
  ↓
Remotion captures frame
```

This pattern ensures Mapbox tiles are fully loaded before each frame is captured.

### Frame-Based Animation
```tsx
const longitude = interpolate(frame, [0, 300], [116.4, 139.7]);
const latitude = interpolate(frame, [0, 300], [39.9, 35.7]);
const zoom = interpolate(frame, [0, 150, 300], [4, 6, 10]);
```

- `interpolate()` maps frame number to geographic/zoom values
- Runs every frame, ensuring deterministic animation
- Use `spring()` for physics-based animations if needed

## Next Steps

### Customize Camera Animation
Edit `src/compositions/MapVideo.tsx` to change:
- Start/end coordinates in `interpolate()` calls
- Zoom keyframes `[0, 150, 300]` and zoom values `[4, 6, 10]`
- Animation curve (add more keyframes for complex paths)

### Add Overlays
Use React components to layer content over the map:
```tsx
<Map>
  {/* Map renders here */}
</Map>
<OverlayComponent frame={frame} /> {/* Your overlay */}
```

### Markers and Markers
Use `react-map-gl` controls and layers:
```tsx
<Marker longitude={long} latitude={lat}>
  <div>Marker</div>
</Marker>
```

### Map Styles
Change via `mapStyle` prop:
- `mapbox://styles/mapbox/light-v11` (current)
- `mapbox://styles/mapbox/dark-v11`
- `mapbox://styles/mapbox/outdoors-v12`
- `mapbox://styles/mapbox/satellite-v9`

## Troubleshooting

**Token Error**: "Mapbox token not found"
- Ensure `.env` has `REMOTION_MAPBOX_TOKEN=pk.xxx`
- Restart dev server after changing `.env`

**Map doesn't render in preview**
- Check browser console for Mapbox API errors
- Verify token is valid and has appropriate scopes

**Frame captures are blank**
- Ensure `continueRender()` is called in `onLoad`
- Check that map has sufficient time to idle (increase timeout if needed)

**Zoom/Panning seems jerky**
- Reduce number of keyframes in interpolation
- Consider using `spring()` for smoother motion
