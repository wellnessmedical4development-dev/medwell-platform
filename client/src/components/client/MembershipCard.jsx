import { useState } from 'react';
import useTranslation from '../../hooks/useTranslation';

export default function MembershipCard({ user }) {
  const { t, lang } = useTranslation();
  const [flipped, setFlipped] = useState(false);
  const isRtl = lang === 'ar';

  if (!user) return null;

  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Cher Client';
  const uniqueId = user.unique_id || 'MW-XXXXXXXX-XXXX-XXXX';
  const phone = user.phone || '+2126XXXXXXXX';
  const status = user.subscription_status || 'active';

  const statusColors = {
    active: '#4ade80',
    expired: '#fbbf24',
    cancelled: '#f87171',
    inactive: '#9a9a9a',
  };

  return (
    <div className="flex justify-center" style={{ perspective: '1200px' }}>
      <div
        onClick={() => setFlipped(!flipped)}
        style={{
          width: '100%',
          maxWidth: '400px',
          aspectRatio: '5 / 3',
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          position: 'relative',
        }}
      >
        {/* FRONT */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '20px',
            background: 'linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 40%, #0d0d0d 70%, #050505 100%)',
            border: '2px solid rgba(212,175,55,0.5)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 30px rgba(212,175,55,0.08), inset 0 1px 0 rgba(212,175,55,0.12)',
            padding: '24px',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-40px', width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.3em', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', textShadow: '0 0 20px rgba(212,175,55,0.25)' }}>
                MEDWELL
              </div>
              <div style={{ marginTop: '3px', fontSize: '0.45rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
                PREMIUM WELLNESS
              </div>
            </div>
            <div style={{
              width: '44px', height: '32px', borderRadius: '4px',
              background: 'linear-gradient(135deg, #d4af37 0%, #f5d06e 50%, #b8962f 100%)',
              boxShadow: '0 0 16px rgba(212,175,55,0.25), inset 0 1px 0 rgba(255,255,255,0.25)',
              position: 'relative', overflow: 'hidden', flexShrink: 0,
            }}>
              <div style={{ position: 'absolute', top: '5px', left: '7px', width: '10px', height: '6px', borderRadius: '1px', backgroundColor: 'rgba(255,255,255,0.35)' }} />
              <div style={{ position: 'absolute', top: '5px', right: '7px', width: '10px', height: '6px', borderRadius: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: '0.95rem', letterSpacing: '0.2em', color: '#ffffff', textShadow: '0 0 12px rgba(212,175,55,0.15)', textAlign: isRtl ? 'right' : 'left' }}>
              {uniqueId}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
              <div style={{ fontSize: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>
                MEMBER
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                {name}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px', direction: 'ltr', textAlign: 'left' }}>
                {phone}
              </div>
            </div>
            <div style={{ textAlign: isRtl ? 'left' : 'right' }}>
              <div style={{ fontSize: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>
                STATUS
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: statusColors[status] || '#9a9a9a', textShadow: `0 0 10px ${(statusColors[status] || '#9a9a9a')}40` }}>
                {t(`member_card.${status}`)}
              </div>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, #f5d06e, #d4af37, transparent)', zIndex: 1 }} />

          <div style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: '0.4rem', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em' }}>
            TAP TO FLIP
          </div>
        </div>

        {/* BACK */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '20px',
            background: 'linear-gradient(145deg, #050505 0%, #111111 50%, #0a0a0a 100%)',
            border: '2px solid rgba(212,175,55,0.4)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.06)',
            padding: '24px',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: '-30px', left: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ fontSize: '0.5rem', letterSpacing: '0.25em', fontWeight: 600, color: '#d4af37', textTransform: 'uppercase', position: 'relative', zIndex: 1 }}>
            MEMBER QR CODE
          </div>

          <div style={{
            width: '100px', height: '100px', background: '#ffffff', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 30px rgba(212,175,55,0.08)',
            position: 'relative', zIndex: 1,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '1px', width: '80px', height: '80px' }}>
              {Array.from({ length: 81 }, (_, i) => {
                const row = Math.floor(i / 9);
                const col = i % 9;
                const isBlack = (
                  (row < 3 && col < 3) ||
                  (row < 3 && col > 5) ||
                  (row > 5 && col < 3) ||
                  (row >= 3 && row <= 5 && col >= 3 && col <= 5) ||
                  (row === 4 && col === 4) ||
                  (Math.random() > 0.55)
                );
                const isCorner = (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3);
                return (
                  <div key={i} style={{
                    width: '100%', aspectRatio: '1',
                    backgroundColor: isCorner ? '#d4af37' : isBlack ? '#000000' : '#ffffff',
                    borderRadius: '1px',
                  }} />
                );
              })}
            </div>
          </div>

          <div style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', position: 'relative', zIndex: 1, lineHeight: 1.5 }}>
            Scan to verify membership
          </div>

          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, #f5d06e, #d4af37, transparent)', zIndex: 1 }} />
        </div>
      </div>
    </div>
  );
}
