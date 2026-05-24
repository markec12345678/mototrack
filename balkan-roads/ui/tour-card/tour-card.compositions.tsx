import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { TourCard } from './tour-card.js';
import {
  mockVrsicTour,
  mockKotorTour,
  mockTransfagarasanTour,
  mockEasyTour,
  mockTours,
} from './tour-card.mock.js';

const heroImageUrl = `https://storage.googleapis.com/bit-generated-images/images/image_aerial_view_of_a_dramatic_balk_0_1779622612223.png`;

/**
 * SingleCard — a single TourCard in context with a scenic background.
 */
export const SingleCard = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          backgroundImage: `url(${heroImageUrl})`,
          backgroundSize: `cover`,
          backgroundPosition: `center`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          padding: `40px 24px`,
          position: `relative`,
        }}
      >
        <div
          style={{
            position: `absolute`,
            inset: 0,
            background: `linear-gradient(to bottom, rgba(2,6,23,0.55) 0%, rgba(2,6,23,0.85) 100%)`,
          }}
        />
        <div style={{ position: `relative`, width: `100%`, maxWidth: `380px` }}>
          <TourCard tour={mockVrsicTour} />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * AllDifficulties — four cards showcasing Easy, Moderate, Hard difficulty badges.
 */
export const AllDifficulties = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `48px 32px`,
        }}
      >
        <div style={{ maxWidth: `1200px`, margin: `0 auto` }}>
          <p
            style={{
              margin: `0 0 8px`,
              fontSize: `11px`,
              fontWeight: 700,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
            }}
          >
            Balkanske Ikonične Ture
          </p>
          <h1
            style={{
              margin: `0 0 32px`,
              fontSize: `28px`,
              fontWeight: 800,
              color: `#f1f5f9`,
              letterSpacing: `-0.03em`,
            }}
          >
            Vse težavnosti
          </h1>
          <div
            style={{
              display: `grid`,
              gridTemplateColumns: `repeat(auto-fill, minmax(320px, 1fr))`,
              gap: `20px`,
            }}
          >
            {mockTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * FeaturedTour — highlighted single tour with editorial context.
 */
export const FeaturedTour = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `48px 32px`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
        }}
      >
        <div style={{ width: `100%`, maxWidth: `480px` }}>
          <div
            style={{
              display: `inline-flex`,
              alignItems: `center`,
              gap: `6px`,
              padding: `4px 12px`,
              backgroundColor: `rgba(249,115,22,0.15)`,
              borderRadius: `9999px`,
              border: `1px solid rgba(249,115,22,0.3)`,
              marginBottom: `20px`,
            }}
          >
            <div
              style={{
                width: `6px`,
                height: `6px`,
                borderRadius: `50%`,
                backgroundColor: `#f97316`,
                boxShadow: `0 0 6px rgba(249,115,22,0.8)`,
              }}
            />
            <span
              style={{
                fontSize: `11px`,
                fontWeight: 700,
                color: `#f97316`,
                letterSpacing: `0.08em`,
              }}
            >
              TURA TEDNA
            </span>
          </div>

          <TourCard tour={mockTransfagarasanTour} />

          <p
            style={{
              marginTop: `16px`,
              fontSize: `12px`,
              color: `#64748b`,
              textAlign: `center`,
            }}
          >
            Kliknite &apos;Naloži v Načrtuj&apos; za navigacijo na /plan
          </p>
        </div>
      </div>
    </MockProvider>
  );
};
