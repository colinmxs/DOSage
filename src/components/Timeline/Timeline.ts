/**
 * @file Timeline component
 * @description DOS-style timeline displaying events with status indicators and connecting lines
 */

import type {
  TimelineProps,
  TimelineInstance,
  TimelineEvent,
  TimelineEventStatus
} from './Timeline.types';
import './Timeline.css';

/**
 * Default date formatter
 */
function defaultFormatDate(date: Date | string): string {
  if (typeof date === 'string') {
    return date;
  }
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

/**
 * Creates a DOS-style timeline
 * 
 * @param props - Timeline configuration options
 * @returns Timeline instance with element and methods
 * 
 * @example
 * ```typescript
 * const timeline = createTimeline({
 *   events: [
 *     { id: '1', title: 'Project Started', timestamp: '01/01/2026', status: 'completed' },
 *     { id: '2', title: 'Development Phase', timestamp: '01/15/2026', status: 'current' },
 *     { id: '3', title: 'Launch', timestamp: '02/01/2026', status: 'upcoming' }
 *   ]
 * });
 * document.body.appendChild(timeline.element);
 * ```
 */
export function createTimeline(props: TimelineProps): TimelineInstance {
  const {
    events: initialEvents,
    orientation = 'vertical',
    alternating = false,
    showConnectors = true,
    formatDate = defaultFormatDate,
    className,
    id,
    'aria-label': ariaLabel,
  } = props;

  // Internal state
  let events: TimelineEvent[] = [...initialEvents];

  // Create main timeline container
  const element = document.createElement('div');
  element.className = buildClassName();
  element.setAttribute('role', 'list');
  element.setAttribute('aria-label', ariaLabel ?? 'Timeline');
  
  if (id) {
    element.id = id;
  }

  // Build class name
  function buildClassName(): string {
    const classes = ['dos-timeline'];
    
    if (orientation === 'vertical') {
      classes.push('dos-timeline--vertical');
      if (alternating) {
        classes.push('dos-timeline--alternating');
      }
    } else {
      classes.push('dos-timeline--horizontal');
    }
    
    if (className) {
      classes.push(className);
    }
    
    if (events.length === 0) {
      classes.push('dos-timeline--empty');
    }
    
    return classes.join(' ');
  }

  // Render the timeline
  function render(): void {
    element.innerHTML = '';
    element.className = buildClassName();

    if (events.length === 0) {
      element.textContent = 'No events to display';
      return;
    }

    events.forEach((event, index) => {
      const eventEl = createEventElement(event, index, events.length);
      element.appendChild(eventEl);
    });
  }

  // Create a single event element
  function createEventElement(
    event: TimelineEvent,
    index: number,
    total: number
  ): HTMLElement {
    const eventEl = document.createElement('div');
    eventEl.className = `dos-timeline__event dos-timeline__event--${event.status || 'upcoming'}`;
    eventEl.setAttribute('role', 'listitem');
    eventEl.dataset.eventId = event.id;

    if (orientation === 'vertical') {
      // Marker column (contains marker and connector)
      const markerColumn = document.createElement('div');
      markerColumn.className = 'dos-timeline__marker-column';

      // Marker
      const marker = document.createElement('div');
      marker.className = 'dos-timeline__marker';
      if (event.icon) {
        marker.dataset.icon = event.icon;
        marker.textContent = event.icon;
      }
      markerColumn.appendChild(marker);

      // Connector (if not last event)
      if (showConnectors && index < total - 1) {
        const connector = document.createElement('div');
        connector.className = 'dos-timeline__connector';
        markerColumn.appendChild(connector);
      }

      eventEl.appendChild(markerColumn);

      // Content area
      const content = document.createElement('div');
      content.className = 'dos-timeline__content';

      // Timestamp
      if (event.timestamp) {
        const timestamp = document.createElement('time');
        timestamp.className = 'dos-timeline__timestamp';
        const formattedDate = formatDate(event.timestamp);
        timestamp.textContent = `─── ${formattedDate} ───`;
        if (event.timestamp instanceof Date) {
          timestamp.setAttribute('datetime', event.timestamp.toISOString());
        }
        content.appendChild(timestamp);
      }

      // Title
      const title = document.createElement('div');
      title.className = 'dos-timeline__title';
      title.textContent = event.title;
      content.appendChild(title);

      // Description
      if (event.description) {
        const description = document.createElement('div');
        description.className = 'dos-timeline__description';
        description.textContent = event.description;
        content.appendChild(description);
      }

      eventEl.appendChild(content);
    } else {
      // Horizontal layout
      
      // Marker
      const marker = document.createElement('div');
      marker.className = 'dos-timeline__marker';
      if (event.icon) {
        marker.dataset.icon = event.icon;
        marker.textContent = event.icon;
      }
      eventEl.appendChild(marker);

      // Connector (if not last event)
      if (showConnectors && index < total - 1) {
        const connector = document.createElement('div');
        connector.className = 'dos-timeline__connector';
        eventEl.appendChild(connector);
      }

      // Content area
      const content = document.createElement('div');
      content.className = 'dos-timeline__content';

      // Title
      const title = document.createElement('div');
      title.className = 'dos-timeline__title';
      title.textContent = event.title;
      content.appendChild(title);

      // Timestamp
      if (event.timestamp) {
        const timestamp = document.createElement('time');
        timestamp.className = 'dos-timeline__timestamp';
        timestamp.textContent = formatDate(event.timestamp);
        if (event.timestamp instanceof Date) {
          timestamp.setAttribute('datetime', event.timestamp.toISOString());
        }
        content.appendChild(timestamp);
      }

      // Description
      if (event.description) {
        const description = document.createElement('div');
        description.className = 'dos-timeline__description';
        description.textContent = event.description;
        content.appendChild(description);
      }

      eventEl.appendChild(content);
    }

    return eventEl;
  }

  // Instance methods
  function getEvents(): TimelineEvent[] {
    return [...events];
  }

  function setEvents(newEvents: TimelineEvent[]): void {
    events = [...newEvents];
    render();
  }

  function addEvent(event: TimelineEvent): void {
    events.push(event);
    render();
  }

  function removeEvent(eventId: string): void {
    const index = events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      events.splice(index, 1);
      render();
    }
  }

  function updateEvent(eventId: string, updates: Partial<TimelineEvent>): void {
    const index = events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      const existingEvent = events[index];
      if (existingEvent) {
        events[index] = { ...existingEvent, ...updates };
        render();
      }
    }
  }

  function getEventById(eventId: string): TimelineEvent | undefined {
    return events.find(e => e.id === eventId);
  }

  function getCurrentEvent(): TimelineEvent | undefined {
    return events.find(e => e.status === 'current');
  }

  function destroy(): void {
    element.innerHTML = '';
  }

  // Initial render
  render();

  return {
    element,
    getEvents,
    setEvents,
    addEvent,
    removeEvent,
    updateEvent,
    getEventById,
    getCurrentEvent,
    destroy,
  };
}

/**
 * Gets the status marker character for a given status
 */
export function getStatusMarker(status: TimelineEventStatus): string {
  switch (status) {
    case 'completed':
      return '●';
    case 'current':
      return '○';
    case 'upcoming':
    default:
      return '◌';
  }
}
