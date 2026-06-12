import { ImageResponse } from '@vercel/og';
import { loadGoogleFont } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || 'Shipper';
  const date = searchParams.get('date') || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Load fonts
  const interBold = await loadGoogleFont({
    family: 'Inter',
    weight: 700,
  });
  
  const jetBrains = await loadGoogleFont({
    family: 'JetBrains Mono',
    weight: 600,
  });

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #111 0%, #0a0a0a 50%)',
        }}
      >
        {/* Border */}
        <div
          style={{
            position: 'absolute',
            inset: '40px',
            border: '2px solid #00FF88',
            borderRadius: '12px',
          }}
        />
        
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: 32,
              fontFamily: 'Inter',
              fontWeight: 700,
              color: '#e5e5e5',
              marginBottom: '20px',
            }}
          >
            Ship<span style={{ color: '#00FF88' }}>.js</span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 48,
              fontFamily: 'Inter',
              fontWeight: 700,
              color: '#e5e5e5',
              marginBottom: '40px',
            }}
          >
            Certificate of Completion
          </div>

          {/* Divider */}
          <div
            style={{
              width: '120px',
              height: '3px',
              background: '#00FF88',
              marginBottom: '40px',
            }}
          />

          {/* This certifies */}
          <div
            style={{
              fontSize: 18,
              fontFamily: 'Inter',
              color: '#888888',
              marginBottom: '16px',
            }}
          >
            This certifies that
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: 56,
              fontFamily: 'Inter',
              fontWeight: 700,
              color: '#00FF88',
              marginBottom: '40px',
              textAlign: 'center',
            }}
          >
            {name}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 20,
              fontFamily: 'Inter',
              color: '#e5e5e5',
              textAlign: 'center',
              maxWidth: '700px',
              lineHeight: 1.6,
              marginBottom: '60px',
            }}
          >
            has successfully completed the ShipJS course<br />
            by shipping 26 test-driven lessons, 5 real projects,<br />
            and passing the final certification exam
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '700px',
              fontSize: 16,
              fontFamily: 'JetBrains Mono',
              color: '#888888',
            }}
          >
            <div>Date: {date}</div>
            <div>Certificate ID: {btoa(name + date).slice(0, 12)}</div>
          </div>
        </div>

        {/* Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '60px',
            fontSize: '64px',
          }}
        >
          🏆
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interBold,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'JetBrains Mono',
          data: jetBrains,
          style: 'normal',
          weight: 600,
        },
      ],
    }
  );
            }
