import type { ASCIIArtProps } from './ASCIIArt.types';
import './ASCIIArt.css';

export function createASCIIArt(props: ASCIIArtProps): HTMLPreElement {
  const {
    art,
    text,
    font = 'standard',
    color,
    animate = false,
    animationSpeed = 50,
    className = '',
    id,
  } = props;

  const pre = document.createElement('pre');
  pre.className = `dos-ascii-art${className ? ' ' + className : ''}${animate ? ' dos-ascii-art--animated' : ''}`;
  if (id) pre.id = id;
  if (color) pre.style.color = color;

  pre.setAttribute('role', 'img');
  
  let content = art ?? '';
  
  if (text && !art) {
    content = convertTextToASCII(text, font);
  }

  pre.setAttribute('aria-label', text ?? 'ASCII art');
  
  if (animate) {
    // Start with empty content and animate
    pre.textContent = '';
    animateTypewriter(pre, content, animationSpeed);
  } else {
    pre.textContent = content;
  }

  return pre;
}

/**
 * Animates text with a typewriter effect using requestAnimationFrame
 */
function animateTypewriter(element: HTMLPreElement, content: string, speed: number): void {
  let index = 0;
  let lastTime = 0;
  
  // Add cursor element
  const cursor = document.createElement('span');
  cursor.className = 'dos-ascii-art___cursor';
  cursor.textContent = '█';
  element.appendChild(cursor);
  
  function animate(currentTime: number): void {
    if (!lastTime) lastTime = currentTime;
    const elapsed = currentTime - lastTime;
    
    if (elapsed >= speed && index < content.length) {
      // Remove cursor temporarily
      if (cursor.parentNode === element) {
        element.removeChild(cursor);
      }
      
      // Add next character (handling newlines properly)
      element.textContent = content.substring(0, index + 1);
      index++;
      lastTime = currentTime;
      
      // Re-add cursor at end
      element.appendChild(cursor);
    }
    
    if (index < content.length) {
      requestAnimationFrame(animate);
    } else {
      // Animation complete - remove cursor after a short delay
      setTimeout(() => {
        if (cursor.parentNode === element) {
          element.removeChild(cursor);
        }
        element.classList.remove('dos-ascii-art--animating');
        element.classList.add('dos-ascii-art--animation-complete');
      }, 500);
    }
  }
  
  element.classList.add('dos-ascii-art--animating');
  requestAnimationFrame(animate);
}

function convertTextToASCII(text: string, _font: string): string {
  // Simple ASCII art conversion (basic implementation)
  const upper = text.toUpperCase();
  const lines: string[] = ['', '', ''];
  
  for (const char of upper) {
    const art = getCharASCII(char);
    art.forEach((line, i) => {
      lines[i] += line + ' ';
    });
  }
  
  return lines.join('\n');
}

function getCharASCII(char: string): string[] {
  const basic: Record<string, string[]> = {
    'A': ['█▀█', '█▀█', '▀ ▀'],
    'B': ['█▀▄', '█▀▄', '▀▀ '],
    'C': ['█▀▀', '█  ', '▀▀▀'],
    'D': ['█▀▄', '█ █', '▀▀ '],
    'E': ['█▀▀', '█▀ ', '▀▀▀'],
    'F': ['█▀▀', '█▀ ', '▀  '],
    'G': ['█▀▀', '█ █', '▀▀▀'],
    'H': ['█ █', '█▀█', '▀ ▀'],
    'I': ['▀█▀', ' █ ', '▀▀▀'],
    'J': ['  █', '  █', '▀▀ '],
    'K': ['█ █', '█▀▄', '▀ ▀'],
    'L': ['█  ', '█  ', '▀▀▀'],
    'M': ['█▄█', '█ █', '▀ ▀'],
    'N': ['█▀█', '█ █', '▀ ▀'],
    'O': ['█▀█', '█ █', '▀▀▀'],
    'P': ['█▀█', '█▀ ', '▀  '],
    'Q': ['█▀█', '█ █', '▀▀█'],
    'R': ['█▀█', '█▀▄', '▀ ▀'],
    'S': ['█▀▀', '▀▀█', '▀▀▀'],
    'T': ['▀█▀', ' █ ', ' ▀ '],
    'U': ['█ █', '█ █', '▀▀▀'],
    'V': ['█ █', '█ █', ' ▀ '],
    'W': ['█ █', '█ █', '█▀█'],
    'X': ['█ █', ' █ ', '█ █'],
    'Y': ['█ █', ' █ ', ' ▀ '],
    'Z': ['▀▀█', ' █ ', '█▀▀'],
    '0': ['█▀█', '█ █', '▀▀▀'],
    '1': ['▄█ ', ' █ ', '▀▀▀'],
    '2': ['▀▀█', '█▀▀', '▀▀▀'],
    '3': ['▀▀█', ' ▀█', '▀▀▀'],
    '4': ['█ █', '▀▀█', '  ▀'],
    '5': ['█▀▀', '▀▀█', '▀▀▀'],
    '6': ['█▀▀', '█▀█', '▀▀▀'],
    '7': ['▀▀█', '  █', '  ▀'],
    '8': ['█▀█', '█▀█', '▀▀▀'],
    '9': ['█▀█', '▀▀█', '▀▀▀'],
    '!': [' █ ', ' █ ', ' ▀ '],
    '?': ['▀▀█', ' ▀ ', ' ▀ '],
    '.': ['   ', '   ', ' ▀ '],
    ',': ['   ', '   ', ' ▄ '],
    ':': [' ▀ ', '   ', ' ▀ '],
    ';': [' ▀ ', '   ', ' ▄ '],
    '-': ['   ', '▀▀▀', '   '],
    '_': ['   ', '   ', '▀▀▀'],
    '+': [' ▄ ', '▀█▀', ' ▀ '],
    '=': ['▀▀▀', '▀▀▀', '   '],
    '/': ['  █', ' █ ', '█  '],
    '\\': ['█  ', ' █ ', '  █'],
    '(': [' █ ', '█  ', ' █ '],
    ')': [' █ ', '  █', ' █ '],
    '[': ['██ ', '█  ', '██ '],
    ']': [' ██', '  █', ' ██'],
    '<': ['  █', ' █ ', '  █'],
    '>': ['█  ', ' █ ', '█  '],
    '@': ['▄▀▄', '█▀█', ' ▀▀'],
    '#': ['█▀█', '▀█▀', '█▀█'],
    '$': ['▄█▀', ' █ ', '▀█▄'],
    '%': ['█ █', ' █ ', '█ █'],
    '&': ['▄█ ', '█▀█', '▀▀█'],
    '*': ['█▀█', ' █ ', '   '],
    '\'': [' █ ', '   ', '   '],
    '"': ['█ █', '   ', '   '],
    ' ': ['   ', '   ', '   '],
  };
  
  return basic[char] || ['███', '███', '▀▀▀'];
}
