"use client";

import React, { useEffect, useState } from "react";

type FloatingCharactersProps = {
  characters?: string;
  density?: number; // number of characters to render
  minSize?: number; // px
  maxSize?: number; // px
};

export default function FloatingCharacters({
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%",
  density = 70,
  minSize = 12,
  maxSize = 24,
}: FloatingCharactersProps) {
  const [items, setItems] = useState<{ char: string; style: React.CSSProperties }[]>([]);

  useEffect(() => {
    const chars = characters.split("");
    const pick = () => chars[Math.floor(Math.random() * chars.length)] || "*";
    
    // Create vertical column streams
    const columnCount = 120; // Number of vertical columns across screen
    const charsPerColumn = Math.ceil(density / columnCount);
    const generated: { char: string; style: React.CSSProperties }[] = [];
    
    for (let col = 0; col < columnCount; col++) {
      const left = (col / columnCount) * 100;
      
      for (let row = 0; row < charsPerColumn; row++) {
        const dur = `${(2.5 + Math.random() * 3.5).toFixed(1)}s`;
        const delay = `${(row * 0.08 + Math.random() * 0.05).toFixed(2)}s`;
        const opacity = (0.3 + Math.random() * 0.7).toFixed(2);
        
        generated.push({
          char: pick(),
          style: {
            // @ts-expect-error CSS var properties
            "--x": `${left}%`,
            // @ts-expect-error CSS var properties
            "--dur": dur,
            // @ts-expect-error CSS var properties
            "--delay": delay,
            // @ts-expect-error CSS var properties
            "--opacity": opacity,
            // @ts-expect-error CSS var properties
            "--x-offset": "0px",
            fontSize: "13px",
          } as React.CSSProperties,
        });
      }
    }
    
    setItems(generated.slice(0, density));
  }, [characters, density, minSize, maxSize]);

  return (
    <div className="floating-bg" aria-hidden="true">
      {items.map((it, idx) => (
        <span key={idx} className="floating-char" style={it.style}>
          {it.char}
        </span>
      ))}
    </div>
  );
}
