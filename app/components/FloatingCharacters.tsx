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
  density = 30,
  minSize = 12,
  maxSize = 24,
}: FloatingCharactersProps) {
  const [items, setItems] = useState<{ char: string; style: React.CSSProperties }[]>([]);

  useEffect(() => {
    const chars = characters.split("");
    const pick = () => chars[Math.floor(Math.random() * chars.length)] || "*";
    
    // Create vertical column streams - reduced from 120 to 40 columns
    const columnCount = 40;
    const charsPerColumn = Math.ceil(density / columnCount);
    const generated: { char: string; style: React.CSSProperties }[] = [];
    
    for (let col = 0; col < columnCount; col++) {
      const left = (col / columnCount) * 100;
      
      for (let row = 0; row < charsPerColumn; row++) {
        const dur = `${(3 + Math.random() * 3).toFixed(1)}s`;
        const delay = `${(row * 0.15 + Math.random() * 0.1).toFixed(2)}s`;
        const opacity = (0.2 + Math.random() * 0.4).toFixed(2);
        
        generated.push({
          char: pick(),
          style: {
            "--x": `${left}%`,
            "--dur": dur,
            "--delay": delay,
            "--opacity": opacity,
            "--x-offset": "0px",
            fontSize: "13px",
          } as React.CSSProperties,
        });
      }
    }
    
    setItems(generated.slice(0, density));
  }, [density]);

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
