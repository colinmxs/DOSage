import { 
  createContainer, 
  createHeading, 
  createText, 
  createButton, 
  createCard,
  createBox,
  createGrid,
  createGridItem,
  createASCIIArt,
  createBadge,
  createDivider,
  initTheme 
} from '@dosage/index.js';

// Import only essential DOSage styles
import './styles.css';

// Initialize the DOS theme
initTheme();

// Create the main app container
const app = document.getElementById('app');

// Create main container
const container = createContainer({
  maxWidth: '1200px',
  padding: { all: 'xl' },
  centered: true,
  className: 'landing-container'
});

// ASCII Art Header with spacing
const asciiHeader = createBox({
  padding: { y: 'xl' },
  className: 'ascii-header'
});
const asciiArt = createASCIIArt({
  text: 'DOSage',
  font: 'block'
});
asciiHeader.appendChild(asciiArt);

// Main heading with spacing
const headingBox = createBox({
  padding: { y: 'md' }
});
const heading = createHeading({
  level: 1,
  children: 'Welcome to DOSage',
  align: 'center'
});
headingBox.appendChild(heading);

// Subtitle with spacing
const subtitleBox = createBox({
  padding: { bottom: 'md' }
});
const subtitle = createText({
  children: 'Retro UI Library for Modern Web Applications',
  size: 'lg',
  align: 'center'
});
subtitleBox.appendChild(subtitle);

// Version badge with spacing
const badgeBox = createBox({
  padding: { bottom: 'xl' },
  display: 'flex',
  className: 'center-content'
});
const versionBadge = createBadge({
  label: 'v0.1.0',
  variant: 'success'
});
badgeBox.appendChild(versionBadge.element);

// Description with max width and spacing
const descriptionBox = createBox({
  padding: { bottom: 'xxl' },
  display: 'flex',
  className: 'center-content'
});
const description = createText({
  children: 'DOSage brings the nostalgic charm of DOS-era interfaces to modern web development. Built with TypeScript, it offers a comprehensive set of components that recreate the authentic look and feel of classic computing.',
  align: 'center',
  className: 'description-text'
});
descriptionBox.appendChild(description);

// Navigation Cards using Grid
const navGrid = createGrid({
  columns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 'xl',
  className: 'nav-grid'
});

// API Documentation Card - Using GridItem for consistent layout
const docsGridItem = createGridItem();
const docsCard = createCard({
  header: '📚 API Documentation',
  content: 'Complete reference for all DOSage components, props, and methods. Perfect for developers who want to dive deep into the library.',
  bordered: true,
  elevated: false,
  interactive: false,
  selected: false
});

const docsButtonBox = createBox({
  padding: { top: 'md' }
});
const docsButton = createButton({
  label: 'Browse Documentation',
  variant: 'primary',
  onClick: () => window.location.href = '/docs/'
});
docsButtonBox.appendChild(docsButton);
docsCard.element.appendChild(docsButtonBox);
docsGridItem.appendChild(docsCard.element);

// Demo Card - Using GridItem for consistent layout
const demoGridItem = createGridItem();
const demoCard = createCard({
  header: '🎮 Interactive Demo',
  content: 'Try out all DOSage components in an interactive playground. See the library in action and experiment with different configurations.',
  bordered: true,
  elevated: false,
  interactive: false,
  selected: false
});

const demoButtonBox = createBox({
  padding: { top: 'md' }
});
const demoButton = createButton({
  label: 'Launch Demo',
  variant: 'primary',
  onClick: () => window.location.href = '/demo/'
});
demoButtonBox.appendChild(demoButton);
demoCard.element.appendChild(demoButtonBox);
demoGridItem.appendChild(demoCard.element);

// Examples Card - Using GridItem for consistent layout
const examplesGridItem = createGridItem();
const examplesCard = createCard({
  header: '🤖 Genesis AI Example',
  content: 'A complete application built with DOSage showcasing real-world usage patterns and advanced component combinations.',
  bordered: true,
  elevated: false,
  interactive: false,
  selected: false
});

const examplesButtonBox = createBox({
  padding: { top: 'md' }
});
const examplesButton = createButton({
  label: 'View Example',
  variant: 'primary',
  onClick: () => window.location.href = '/examples/genesis-ai/'
});
examplesButtonBox.appendChild(examplesButton);
examplesCard.element.appendChild(examplesButtonBox);
examplesGridItem.appendChild(examplesCard.element);

// Features section with spacing
const featuresBox = createBox({
  padding: { top: 'xxl', bottom: 'xl' }
});
const featuresHeading = createHeading({
  level: 2,
  children: 'Features',
  align: 'center'
});
featuresBox.appendChild(featuresHeading);

// Features list using Grid
const featuresGrid = createGrid({
  columns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: 'md',
  className: 'features-grid'
});

const features = [
  '🎨 Authentic DOS-era styling and animations',
  '⚡ Modern TypeScript implementation',
  '🧩 60+ ready-to-use components',
  '🎯 Zero dependencies, lightweight',
  '📱 Responsive design with retro flair',
  '🔧 Highly customizable and extensible'
];

features.forEach(feature => {
  const featureGridItem = createGridItem();
  const featureBox = createBox({
    padding: 'sm'
  });
  const featureText = createText({
    children: feature
  });
  featureBox.appendChild(featureText);
  featureGridItem.appendChild(featureBox);
  featuresGrid.appendChild(featureGridItem);
});

// Divider with spacing
const dividerBox = createBox({
  padding: { y: 'xl' },
  display: 'flex',
  className: 'center-content'
});
const divider = createDivider({
  variant: 'double',
  className: 'section-divider'
});
dividerBox.appendChild(divider);

// Footer with spacing
const footerBox = createBox({
  padding: { top: 'xl' }
});
const footer = createText({
  children: 'Built with ❤️ using DOSage • Open Source • MIT License',
  size: 'sm',
  align: 'center'
});
footerBox.appendChild(footer);

// Add cards to navigation grid
navGrid.appendChild(docsGridItem);
navGrid.appendChild(demoGridItem);
navGrid.appendChild(examplesGridItem);

// Build the page structure
container.appendChild(asciiHeader);
container.appendChild(headingBox);
container.appendChild(subtitleBox);
container.appendChild(badgeBox);
container.appendChild(descriptionBox);
container.appendChild(navGrid);
container.appendChild(dividerBox);
container.appendChild(featuresBox);
container.appendChild(featuresGrid);
container.appendChild(footerBox);

app.appendChild(container);

