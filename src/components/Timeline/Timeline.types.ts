/**
 * @file Timeline component types
 * @description TypeScript interfaces for the DOS-style Timeline component
 */

/**
 * Event status for timeline items
 */
export type TimelineEventStatus = 'completed' | 'current' | 'upcoming';

/**
 * Timeline orientation
 */
export type TimelineOrientation = 'vertical' | 'horizontal';

/**
 * Timeline event data
 */
export interface TimelineEvent {
  /**
   * Unique identifier for the event
   */
  id: string;

  /**
   * Event title
   */
  title: string;

  /**
   * Optional event description
   */
  description?: string;

  /**
   * Timestamp for the event
   * Can be a Date object or a formatted string
   */
  timestamp?: string | Date;

  /**
   * Optional icon character to display
   * If not provided, status-based icon is used
   */
  icon?: string;

  /**
   * Event status determining visual treatment
   * @default 'upcoming'
   */
  status?: TimelineEventStatus;
}

/**
 * Timeline component properties
 */
export interface TimelineProps {
  /**
   * Array of timeline events
   */
  events: TimelineEvent[];

  /**
   * Timeline orientation
   * @default 'vertical'
   */
  orientation?: TimelineOrientation;

  /**
   * Alternate event positions left/right (vertical only)
   * @default false
   */
  alternating?: boolean;

  /**
   * Show connecting lines between events
   * @default true
   */
  showConnectors?: boolean;

  /**
   * Date format function for timestamps
   * @default Simple date string format
   */
  formatDate?: (date: Date | string) => string;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * HTML id attribute
   */
  id?: string;

  /**
   * Custom ARIA label
   */
  'aria-label'?: string;
}

/**
 * Timeline instance returned by createTimeline
 */
export interface TimelineInstance {
  /**
   * The timeline DOM element
   */
  element: HTMLElement;

  /**
   * Get all events
   */
  getEvents: () => TimelineEvent[];

  /**
   * Set new events array
   */
  setEvents: (events: TimelineEvent[]) => void;

  /**
   * Add a single event to the timeline
   */
  addEvent: (event: TimelineEvent) => void;

  /**
   * Remove an event by id
   */
  removeEvent: (id: string) => void;

  /**
   * Update an existing event
   */
  updateEvent: (id: string, updates: Partial<TimelineEvent>) => void;

  /**
   * Get event by id
   */
  getEventById: (id: string) => TimelineEvent | undefined;

  /**
   * Get the current event (status = 'current')
   */
  getCurrentEvent: () => TimelineEvent | undefined;

  /**
   * Clean up event listeners and resources
   */
  destroy: () => void;
}
