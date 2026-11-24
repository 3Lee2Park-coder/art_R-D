"use client";

import { useEffect, useRef, useState } from "react";

export function FloorPlanViewer({
  open,
  src,
  onClose,
}: {
  open: boolean;
  src: string;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const pinchRef = useRef<{ dist: number; scale: number } | null>(null);
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  useEffect(() => {
    if (!open) {
      setScale(1);
      setTx(0);
      setTy(0);
    }
  }, [open]);

  if (!open) return null;

  function distance(a: { clientX: number; clientY: number }, b: { clientX: number; clientY: number }) {
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.hypot(dx, dy);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[rgba(9,32,57,0.92)]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="배치도 확대"
    >
      <div className="flex shrink-0 justify-end px-4 pt-4">
        <button
          type="button"
          className="btn btn-secondary-dark"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          닫기
        </button>
      </div>
      <div
        className="relative min-h-0 flex-1 touch-none overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          if (e.touches.length === 2) {
            pinchRef.current = {
              dist: distance(e.touches[0], e.touches[1]),
              scale,
            };
            dragRef.current = null;
            return;
          }
          if (e.touches.length === 1 && scale > 1) {
            dragRef.current = {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
              tx,
              ty,
            };
          }
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 2 && pinchRef.current) {
            e.preventDefault();
            const d = distance(e.touches[0], e.touches[1]);
            const next = Math.min(4, Math.max(1, (pinchRef.current.scale * d) / pinchRef.current.dist));
            setScale(next);
            return;
          }
          if (e.touches.length === 1 && dragRef.current && scale > 1) {
            e.preventDefault();
            setTx(dragRef.current.tx + (e.touches[0].clientX - dragRef.current.x));
            setTy(dragRef.current.ty + (e.touches[0].clientY - dragRef.current.y));
          }
        }}
        onTouchEnd={() => {
          pinchRef.current = null;
          dragRef.current = null;
          if (scale <= 1) {
            setScale(1);
            setTx(0);
            setTy(0);
          }
        }}
        onWheel={(e) => {
          e.preventDefault();
          const next = Math.min(4, Math.max(1, scale + (e.deltaY < 0 ? 0.15 : -0.15)));
          setScale(next);
          if (next <= 1) {
            setTx(0);
            setTy(0);
          }
        }}
      >
        <img
          src={src}
          alt=""
          className="absolute left-1/2 top-1/2 max-h-[85%] max-w-[92%] object-contain"
          style={{
            transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${scale})`,
            transformOrigin: "center center",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
