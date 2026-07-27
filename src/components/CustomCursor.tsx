import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      if (
        target.closest('a, button, input, textarea, select, [role="button"], .interactive')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    let animId: number;

    const follow = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.2,
        y: prev.y + (position.y - prev.y) * 0.2,
      }));
      animId = requestAnimationFrame(follow);
    };

    animId = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(animId);
  }, [position, enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Precision Pointer Dot */}
      <div
        className={`fixed pointer-events-none z-50 rounded-full bg-blue-500 transition-transform duration-75 ${
          isClicked ? 'scale-50' : 'scale-100'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '8px',
          height: '8px',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Trailing Soft Halo Ring */}
      <div
        className={`fixed pointer-events-none z-40 rounded-full border border-blue-400/50 bg-blue-500/10 backdrop-blur-[1px] transition-all duration-150 ease-out ${
          isHovered
            ? 'scale-150 border-purple-400/80 bg-purple-500/20'
            : isClicked
            ? 'scale-75'
            : 'scale-100'
        }`}
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          width: '36px',
          height: '36px',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
};
