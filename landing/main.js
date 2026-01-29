import { 
  createContainer, 
  createHeading, 
  createText, 
  createButton, 
  createCard,
  createBox,
  createASCIIArt,
  createBadge,
  createDivider,
  initTheme 
} from '@dosage/index.js';

// Initialize the DOS theme
initTheme();

// Create the main app container
const app = document.getElementById('app');

// Create main container
const container = createContainer({
  maxWidth: '1200px',
  padding: { all: 'xl' },
  className: 'landing-container'
});

// ASCII Art Header
const asciiArt = createASCIIArt({
  text: 'DOSage',
  font: 'block',
  className: 'ascii-header'
});

// Main heading
const heading = createHeading({
  level: 1,
  text: 'Welcome to DOSage',
  align: 'center',
  className: 'main-heading'
});

// Subtitle
const subtitle = createText({
  text: 'Retro UI Library for Modern Web Applications',
  size: 'lg',
  align: 'center',
  className: 'subtitle'
});

// Version badge
const versionBadge = createBadge({
  text: 'v0.1.0',
  variant: 'success',
  className: 'version-badge'
});

// Description
const description = createText({
  text: 'DOSage brings the nostalgic charm of DOS-era interfaces to modern web development. Built with TypeScript, it offers a comprehensive set of components that recreate the authentic look and feel of classic computing.',
  className: 'description'
});

// Navigation Cards Container
const navContainer = createBox({
  padding: { all: 'lg' },
  className: 'nav-container'
});

// API Documentation Card
const docsCard = createCard({
  title: '📚 API Documentation',
  content: 'Complete reference for all DOSage components, props, and methods. Perfect for developers who want to dive deep into the library.',
  className: 'nav-card'
});

const docsButton = createButton({
  text: 'Browse Documentation',
  variant: 'primary',
  onClick: () => window.location.href = '/docs/',
  className: 'nav-button'
});

// Demo Card
const demoCard = createCard({
  title: '🎮 Interactive Demo',
  content: 'Try out all DOSage components in an interactive playground. See the library in action and experiment with different configurations.',
  className: 'nav-card'
});

const demoButton = createButton({
  text: 'Launch Demo',
  variant: 'secondary',
  onClick: () => window.location.href = '/demo/',
  className: 'nav-button'
});

// Examples Card
const examplesCard = createCard({
  title: '🤖 Genesis AI Example',
  content: 'A complete application built with DOSage showcasing real-world usage patterns and advanced component combinations.',
  className: 'nav-card'
});

const examplesButton = createButton({
  text: 'View Example',
  variant: 'accent',
  onClick: () => window.location.href = '/examples/genesis-ai/',
  className: 'nav-button'
});

// Features section
const featuresHeading = createHeading({
  level: 2,
  text: 'Features',
  align: 'center',
  className: 'features-heading'
});

const featuresList = createBox({
  className: 'features-list'
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
  const featureText = createText({
    text: feature,
    className: 'feature-item'
  });
  featuresList.appendChild(featureText);
});

// Divider
const divider = createDivider({
  variant: 'double',
  className: 'section-divider'
});

// Footer
const footer = createText({
  text: 'Built with ❤️ using DOSage • Open Source • MIT License',
  size: 'sm',
  align: 'center',
  className: 'footer'
});

// Append buttons to cards
docsCard.appendChild(docsButton);
demoCard.appendChild(demoButton);
examplesCard.appendChild(examplesButton);

// Append cards to navigation container
navContainer.appendChild(docsCard);
navContainer.appendChild(demoCard);
navContainer.appendChild(examplesCard);

// Build the page
container.appendChild(asciiArt);
container.appendChild(heading);
container.appendChild(subtitle);
container.appendChild(versionBadge);
container.appendChild(description);
container.appendChild(navContainer);
container.appendChild(divider);
container.appendChild(featuresHeading);
container.appendChild(featuresList);
container.appendChild(footer);

app.appendChild(container);

// Add some custom styles
const style = document.createElement('style');
style.textContent = `
  .landing-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .ascii-header {
    margin: 2rem 0;
  }

  .main-heading {
    margin: 1rem 0;
  }

  .subtitle {
    margin-bottom: 1rem;
    opacity: 0.9;
  }

  .version-badge {
    margin-bottom: 2rem;
  }

  .description {
    max-width: 600px;
    text-align: center;
    line-height: 1.6;
    margin-bottom: 3rem;
  }

  .nav-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    width: 100%;
    max-width: 1000px;
  }

  .nav-card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .nav-button {
    margin-top: auto;
    margin-top: 1rem;
  }

  .features-heading {
    margin: 3rem 0 2rem 0;
  }

  .features-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    max-width: 800px;
    margin-bottom: 3rem;
  }

  .feature-item {
    padding: 0.5rem;
  }

  .section-divider {
    width: 100%;
    max-width: 600px;
    margin: 2rem 0;
  }

  .footer {
    margin-top: 2rem;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    .nav-container {
      grid-template-columns: 1fr;
    }
    
    .features-list {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(style);