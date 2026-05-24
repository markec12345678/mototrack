import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Image } from './image.js';

const RACE_TRACK_URL = `https://storage.googleapis.com/bit-generated-images/images/image_dark_motorcycle_racing_scene___0_1779616015959.png`;
const HELMET_URL = `https://storage.googleapis.com/bit-generated-images/images/image_close_up_portrait_of_a_motorcy_0_1779616015861.png`;
const MOUNTAIN_ROAD_URL = `https://storage.googleapis.com/bit-generated-images/images/image_aerial_view_of_a_winding_mount_0_1779616024684.png`;

const sectionStyle: React.CSSProperties = {
  padding: '32px',
  maxWidth: '960px',
  margin: '0 auto',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  marginBottom: '12px',
  marginTop: '0',
};

const descStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#64748b',
  marginBottom: '16px',
  marginTop: '0',
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: 'rgba(148,163,184,0.1)',
  margin: '40px 0',
};

/**
 * Gallery — showcases aspect ratios, object-fit options, border radii, and captions.
 */
export const Gallery = () => {
  return (
    <MockProvider>
      <div style={{ backgroundColor: '#020617', minHeight: '100vh' }}>
        <div style={sectionStyle}>
          <h1
            style={{
              margin: '0 0 4px',
              fontSize: '28px',
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-0.03em',
            }}
          >
            Image Component
          </h1>
          <p style={{ ...descStyle, marginBottom: '40px' }}>
            Lazy loading, aspect ratio control, object-fit options, rounded corners, and fallback rendering.
          </p>

          {/* Aspect Ratios */}
          <p style={labelStyle}>Aspect Ratios</p>
          <p style={descStyle}>16/9 · 4/3 · 1/1</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px',
              marginBottom: '40px',
            }}
          >
            <Image
              src={RACE_TRACK_URL}
              alt="Race track at dusk"
              aspectRatio="16/9"
              borderRadius="large"
              caption="16 / 9 — Race Track"
            />
            <Image
              src={MOUNTAIN_ROAD_URL}
              alt="Mountain road aerial view"
              aspectRatio="4/3"
              borderRadius="large"
              caption="4 / 3 — Mountain Road"
            />
            <Image
              src={HELMET_URL}
              alt="Racing helmet"
              aspectRatio="1/1"
              borderRadius="large"
              caption="1 / 1 — Helmet"
            />
          </div>

          <div style={dividerStyle} />

          {/* Object Fit */}
          <p style={labelStyle}>Object Fit Options</p>
          <p style={descStyle}>cover · contain · scale-down — all at 1/1 aspect ratio</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '40px',
            }}
          >
            {(['cover', 'contain', 'scale-down'] as const).map((fit) => (
              <Image
                key={fit}
                src={RACE_TRACK_URL}
                alt={`Object fit: ${fit}`}
                aspectRatio="1/1"
                objectFit={fit}
                borderRadius="medium"
                caption={fit}
              />
            ))}
          </div>

          <div style={dividerStyle} />

          {/* Border Radii */}
          <p style={labelStyle}>Border Radius Presets</p>
          <p style={descStyle}>none · small · medium · large · xl · full</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '16px',
              marginBottom: '40px',
            }}
          >
            {(['none', 'small', 'medium', 'large', 'xl', 'full'] as const).map((r) => (
              <Image
                key={r}
                src={HELMET_URL}
                alt={`Border radius: ${r}`}
                aspectRatio="1/1"
                borderRadius={r}
                caption={r}
              />
            ))}
          </div>

          <div style={dividerStyle} />

          {/* Fallback */}
          <p style={labelStyle}>Fallback — Broken or Missing Source</p>
          <p style={descStyle}>When the image fails to load, a placeholder with the alt text is shown.</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <Image
              src="https://broken.url/image.jpg"
              alt="Broken image — race track"
              aspectRatio="4/3"
              borderRadius="large"
              caption="Broken URL"
            />
            <Image
              alt="No source provided"
              aspectRatio="4/3"
              borderRadius="large"
              caption="No src prop"
            />
            <Image
              src="https://broken.url/image.jpg"
              alt=""
              aspectRatio="4/3"
              borderRadius="large"
              caption="No alt text"
            />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * LazyGrid — a grid of images that load on scroll to demonstrate lazy loading.
 */
export const LazyGrid = () => {
  const images = [
    { src: RACE_TRACK_URL, alt: `Race track at dusk`, caption: `Race Track` },
    { src: HELMET_URL, alt: `Racing helmet`, caption: `Helmet` },
    { src: MOUNTAIN_ROAD_URL, alt: `Mountain road`, caption: `Mountain Road` },
    { src: RACE_TRACK_URL, alt: `Race track`, caption: `Race Track` },
    { src: HELMET_URL, alt: `Helmet close-up`, caption: `Helmet` },
    { src: MOUNTAIN_ROAD_URL, alt: `Aerial road`, caption: `Mountain Road` },
  ];

  return (
    <MockProvider>
      <div style={{ backgroundColor: '#020617', minHeight: '100vh', padding: '32px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <p style={labelStyle}>Lazy Loading Grid</p>
            <p style={descStyle}>
              Images load only when they enter the viewport via IntersectionObserver.
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {images.map((img, i) => (
              <Image
                key={i}
                src={img.src}
                alt={img.alt}
                aspectRatio="16/9"
                objectFit="cover"
                borderRadius="large"
                caption={img.caption}
                lazy
              />
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * HeroAndCard — realistic usage inside a hero banner and a card layout.
 */
export const HeroAndCard = () => {
  const cards = [
    {
      src: HELMET_URL,
      alt: `Racing helmet`,
      title: `Pro Helmet Review`,
      tag: `GEAR`,
    },
    {
      src: MOUNTAIN_ROAD_URL,
      alt: `Mountain road`,
      title: `Best Alpine Routes`,
      tag: `ROUTES`,
    },
    {
      src: RACE_TRACK_URL,
      alt: `Race track`,
      title: `Track Day Guide`,
      tag: `EVENTS`,
    },
  ];

  return (
    <MockProvider>
      <div style={{ backgroundColor: '#020617', minHeight: '100vh' }}>
        {/* Hero */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Image
            src={RACE_TRACK_URL}
            alt="MotoTrack hero — race track at dusk"
            aspectRatio="21/9"
            objectFit="cover"
            borderRadius="none"
            lazy={false}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to bottom, rgba(2,6,23,0.1) 0%, rgba(2,6,23,0.85) 100%)`,
              display: 'flex',
              alignItems: 'flex-end',
              padding: '40px',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#f97316',
                  marginBottom: '10px',
                }}
              >
                Featured
              </span>
              <h2
                style={{
                  margin: '0 0 8px',
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#f1f5f9',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                }}
              >
                Race Season 2025
              </h2>
              <p style={{ margin: 0, fontSize: '15px', color: '#94a3b8' }}>
                Full coverage of the championship circuit
              </p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div style={{ padding: '40px 32px', maxWidth: '960px', margin: '0 auto' }}>
          <p style={labelStyle}>Latest Stories</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {cards.map((card) => (
              <div
                key={card.title}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid rgba(148,163,184,0.12)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                }}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  aspectRatio="16/9"
                  objectFit="cover"
                  borderRadius="none"
                />
                <div style={{ padding: '16px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: '#f97316',
                      textTransform: 'uppercase',
                    }}
                  >
                    {card.tag}
                  </span>
                  <p
                    style={{
                      margin: '6px 0 0',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#f1f5f9',
                      lineHeight: 1.3,
                    }}
                  >
                    {card.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
