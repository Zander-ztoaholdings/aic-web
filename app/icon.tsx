import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: '#0a1628',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
          {/* Shield outline */}
          <path
            d="M11 1L2 4.5V12C2 17.5 5.8 22.5 11 24C16.2 22.5 20 17.5 20 12V4.5L11 1Z"
            stroke="#c9920a"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Head */}
          <circle cx="11" cy="9.5" r="2.5" fill="#c9920a" />
          {/* Body */}
          <path
            d="M6.5 19C6.5 15.5 8.5 13.5 11 13.5C13.5 13.5 15.5 15.5 15.5 19"
            stroke="#c9920a"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
