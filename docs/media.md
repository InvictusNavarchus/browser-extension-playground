# Media Testing Guide

The Media page provides comprehensive testing for media-related browser APIs including video, audio, canvas, and images.

## Overview

**Route**: `/media`

Test your extension's ability to interact with media elements, capture content, and manipulate visual data.

## Test Sections

### 1. Video Player

Full-featured HTML5 video player for testing video extensions.

**Features:**
- Play/pause controls
- Volume and mute controls
- Playback speed adjustment (0.5x - 2x)
- Seek bar with time display
- Fullscreen toggle
- Picture-in-Picture mode
- Video source selection

**Video Properties Exposed:**

| Property | Description |
|----------|-------------|
| `currentTime` | Current playback position |
| `duration` | Total video length |
| `paused` | Play/pause state |
| `volume` | Volume level (0-1) |
| `muted` | Mute state |
| `playbackRate` | Speed multiplier |
| `readyState` | Loading state |
| `videoWidth/Height` | Native dimensions |

**How to Use:**
1. Video loads automatically with sample source
2. Use player controls to test interactions
3. Change playback speed
4. Toggle fullscreen and PiP modes
5. Watch console for media events

**Extension Testing:**
```javascript
// Find and control video elements
const videos = document.querySelectorAll('video');
videos.forEach(video => {
  // Read state
  console.log('Video state:', {
    src: video.src,
    duration: video.duration,
    currentTime: video.currentTime,
    paused: video.paused
  });
  
  // Control playback
  video.play();
  video.pause();
  video.currentTime = 30;
  video.playbackRate = 1.5;
});
```

**Media Events:**
```javascript
video.addEventListener('play', () => console.log('Playing'));
video.addEventListener('pause', () => console.log('Paused'));
video.addEventListener('timeupdate', () => console.log('Time:', video.currentTime));
video.addEventListener('ended', () => console.log('Ended'));
video.addEventListener('volumechange', () => console.log('Volume:', video.volume));
video.addEventListener('ratechange', () => console.log('Speed:', video.playbackRate));
```

### 2. Audio Player

HTML5 audio player for audio extension testing.

**Features:**
- Multiple audio sources
- Play/pause and stop
- Volume control
- Progress bar
- Time display
- Loop toggle

**How to Use:**
1. Select audio source or use default
2. Use controls to play/pause
3. Adjust volume
4. Seek using progress bar

**Extension Testing:**
```javascript
// Control audio elements
const audio = document.querySelector('audio');

// Create audio visualizer
const audioContext = new AudioContext();
const source = audioContext.createMediaElementSource(audio);
const analyser = audioContext.createAnalyser();

source.connect(analyser);
analyser.connect(audioContext.destination);

// Get frequency data
const dataArray = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(dataArray);
```

### 3. Canvas Operations

Test canvas manipulation and capture.

**Features:**
- Drawing tools (freehand, shapes)
- Color picker
- Brush size adjustment
- Clear canvas
- Export to PNG
- Get image data

**How to Use:**
1. Select drawing tool
2. Choose color and brush size
3. Draw on canvas
4. Export image or get pixel data

**Canvas Methods Tested:**

| Method | Description |
|--------|-------------|
| `getContext('2d')` | Get 2D rendering context |
| `toDataURL()` | Export as base64 image |
| `toBlob()` | Export as Blob |
| `getImageData()` | Get pixel data array |
| `putImageData()` | Set pixel data |

**Extension Testing:**
```javascript
// Capture canvas content
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Get as data URL
const dataUrl = canvas.toDataURL('image/png');

// Get as blob
canvas.toBlob((blob) => {
  // Upload or process blob
}, 'image/png');

// Get pixel data
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const pixels = imageData.data; // Uint8ClampedArray [r,g,b,a,r,g,b,a,...]

// Modify pixels
for (let i = 0; i < pixels.length; i += 4) {
  pixels[i] = 255 - pixels[i];     // Invert red
  pixels[i+1] = 255 - pixels[i+1]; // Invert green
  pixels[i+2] = 255 - pixels[i+2]; // Invert blue
}
ctx.putImageData(imageData, 0, 0);
```

### 4. Image Gallery

Test image loading, manipulation, and capture.

**Features:**
- Multiple sample images
- Lazy loading
- Image preview/lightbox
- Right-click context menu
- Image download
- EXIF data display (if available)

**How to Use:**
1. Browse image gallery
2. Click images to preview
3. Test right-click options
4. Download images

**Extension Testing:**
```javascript
// Find all images
const images = document.querySelectorAll('img');
images.forEach(img => {
  console.log({
    src: img.src,
    alt: img.alt,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    complete: img.complete
  });
});

// Capture image to canvas
function imageToCanvas(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  
  return canvas;
}

// Convert image format
const canvas = imageToCanvas(img);
const webpUrl = canvas.toDataURL('image/webp', 0.8);
```

### 5. Screen Capture

Test screen and tab capture APIs.

**Features:**
- Screen capture button
- Tab capture button
- Window capture option
- Stream preview

**Note:** These features require user permission and may need extension permissions.

**Extension Testing:**
```javascript
// Screen capture (requires user gesture)
async function captureScreen() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false
    });
    
    const video = document.createElement('video');
    video.srcObject = stream;
    await video.play();
    
    // Capture frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    // Stop stream
    stream.getTracks().forEach(track => track.stop());
    
    return canvas.toDataURL();
  } catch (err) {
    console.error('Screen capture failed:', err);
  }
}
```

### 6. Media Devices

List and test available media devices.

**Features:**
- Enumerate cameras and microphones
- Device selection
- Capability inspection

**Extension Testing:**
```javascript
// List media devices
async function listDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  
  const cameras = devices.filter(d => d.kind === 'videoinput');
  const microphones = devices.filter(d => d.kind === 'audioinput');
  const speakers = devices.filter(d => d.kind === 'audiooutput');
  
  console.log({ cameras, microphones, speakers });
}
```

## Common Extension Patterns

### Pattern 1: Video Speed Controller
```javascript
class VideoSpeedController {
  constructor() {
    this.init();
    this.observeNewVideos();
  }
  
  init() {
    document.querySelectorAll('video').forEach(v => this.attach(v));
  }
  
  attach(video) {
    if (video.dataset.speedController) return;
    video.dataset.speedController = 'true';
    
    const controls = this.createControls(video);
    video.parentElement.appendChild(controls);
  }
  
  createControls(video) {
    const div = document.createElement('div');
    div.innerHTML = `
      <button data-speed="0.5">0.5x</button>
      <button data-speed="1">1x</button>
      <button data-speed="1.5">1.5x</button>
      <button data-speed="2">2x</button>
    `;
    
    div.addEventListener('click', (e) => {
      if (e.target.dataset.speed) {
        video.playbackRate = parseFloat(e.target.dataset.speed);
      }
    });
    
    return div;
  }
  
  observeNewVideos() {
    new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.tagName === 'VIDEO') this.attach(node);
          if (node.querySelectorAll) {
            node.querySelectorAll('video').forEach(v => this.attach(v));
          }
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
}
```

### Pattern 2: Image Downloader
```javascript
async function downloadImage(img, filename) {
  const response = await fetch(img.src);
  const blob = await response.blob();
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'image.png';
  a.click();
  
  URL.revokeObjectURL(url);
}
```

### Pattern 3: Canvas Watermark
```javascript
function addWatermark(canvas, text) {
  const ctx = canvas.getContext('2d');
  
  ctx.save();
  ctx.font = '20px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(text, canvas.width - 10, canvas.height - 10);
  ctx.restore();
  
  return canvas;
}
```

### Pattern 4: Video Thumbnail Generator
```javascript
function generateThumbnail(video, time = 0) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const wasPlaying = !video.paused;
    const originalTime = video.currentTime;
    
    video.currentTime = time;
    video.onseeked = () => {
      canvas.getContext('2d').drawImage(video, 0, 0);
      video.currentTime = originalTime;
      if (wasPlaying) video.play();
      resolve(canvas.toDataURL());
    };
  });
}
```

## Tips

1. **Autoplay Policies**: Modern browsers block autoplay with sound
2. **CORS**: Cross-origin media may have restrictions
3. **Performance**: Large canvas operations can be slow
4. **Memory**: Release object URLs and streams when done
5. **Permissions**: Media capture requires user interaction
