/**
 * @file Timeline component tests
 * @description Comprehensive tests for the DOS-style Timeline component
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTimeline, getStatusMarker } from '../../src/components/Timeline';
import type { TimelineEvent } from '../../src/components/Timeline';

describe('Timeline', () => {
  let container: HTMLElement;

  const sampleEvents: TimelineEvent[] = [
    {
      id: '1',
      title: 'Project Started',
      description: 'Initial project setup completed',
      timestamp: '01/01/2026',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Development Phase',
      description: 'Active development in progress',
      timestamp: '01/15/2026',
      status: 'current'
    },
    {
      id: '3',
      title: 'Testing',
      description: 'Quality assurance testing',
      timestamp: '01/25/2026',
      status: 'upcoming'
    },
    {
      id: '4',
      title: 'Launch',
      timestamp: '02/01/2026',
      status: 'upcoming'
    }
  ];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('rendering', () => {
    it('renders a timeline element', () => {
      const timeline = createTimeline({ events: sampleEvents });
      expect(timeline.element).toBeInstanceOf(HTMLElement);
      expect(timeline.element.classList.contains('dos-timeline')).toBe(true);
    });

    it('renders all events', () => {
      const timeline = createTimeline({ events: sampleEvents });
      const eventElements = timeline.element.querySelectorAll('.dos-timeline__event');
      expect(eventElements.length).toBe(4);
    });

    it('renders with vertical orientation by default', () => {
      const timeline = createTimeline({ events: sampleEvents });
      expect(timeline.element.classList.contains('dos-timeline--vertical')).toBe(true);
    });

    it('renders with horizontal orientation', () => {
      const timeline = createTimeline({ events: sampleEvents, orientation: 'horizontal' });
      expect(timeline.element.classList.contains('dos-timeline--horizontal')).toBe(true);
    });

    it('renders with custom id', () => {
      const timeline = createTimeline({ events: sampleEvents, id: 'my-timeline' });
      expect(timeline.element.id).toBe('my-timeline');
    });

    it('renders with custom className', () => {
      const timeline = createTimeline({ events: sampleEvents, className: 'custom-timeline' });
      expect(timeline.element.classList.contains('custom-timeline')).toBe(true);
    });

    it('renders empty state when no events', () => {
      const timeline = createTimeline({ events: [] });
      expect(timeline.element.classList.contains('dos-timeline--empty')).toBe(true);
      expect(timeline.element.textContent).toContain('No events');
    });
  });

  describe('event content', () => {
    it('renders event titles', () => {
      const timeline = createTimeline({ events: sampleEvents });
      const titles = timeline.element.querySelectorAll('.dos-timeline__title');
      
      expect(titles[0].textContent).toBe('Project Started');
      expect(titles[1].textContent).toBe('Development Phase');
    });

    it('renders event descriptions', () => {
      const timeline = createTimeline({ events: sampleEvents });
      const descriptions = timeline.element.querySelectorAll('.dos-timeline__description');
      
      expect(descriptions[0].textContent).toBe('Initial project setup completed');
      expect(descriptions[1].textContent).toBe('Active development in progress');
    });

    it('does not render description when not provided', () => {
      const timeline = createTimeline({ events: sampleEvents });
      const eventElements = timeline.element.querySelectorAll('.dos-timeline__event');
      
      // The 4th event has no description
      const lastEventDesc = eventElements[3].querySelector('.dos-timeline__description');
      expect(lastEventDesc).toBeNull();
    });

    it('renders timestamps', () => {
      const timeline = createTimeline({ events: sampleEvents });
      const timestamps = timeline.element.querySelectorAll('.dos-timeline__timestamp');
      
      expect(timestamps.length).toBe(4);
      expect(timestamps[0].textContent).toContain('01/01/2026');
    });

    it('formats Date objects', () => {
      const events: TimelineEvent[] = [{
        id: '1',
        title: 'Event',
        timestamp: new Date(2026, 0, 15),
        status: 'completed'
      }];
      
      const timeline = createTimeline({ events });
      const timestamp = timeline.element.querySelector('.dos-timeline__timestamp');
      expect(timestamp?.textContent).toContain('01/15/2026');
    });

    it('uses custom date formatter', () => {
      const events: TimelineEvent[] = [{
        id: '1',
        title: 'Event',
        timestamp: new Date(2026, 5, 15),
        status: 'completed'
      }];
      
      const timeline = createTimeline({
        events,
        formatDate: (date) => {
          if (date instanceof Date) {
            return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
          }
          return date;
        }
      });
      
      const timestamp = timeline.element.querySelector('.dos-timeline__timestamp');
      expect(timestamp?.textContent).toContain('June');
    });

    it('sets datetime attribute for Date timestamps', () => {
      const date = new Date(2026, 0, 15, 10, 30, 0);
      const events: TimelineEvent[] = [{
        id: '1',
        title: 'Event',
        timestamp: date,
        status: 'completed'
      }];
      
      const timeline = createTimeline({ events });
      const timestamp = timeline.element.querySelector('.dos-timeline__timestamp');
      expect(timestamp?.getAttribute('datetime')).toBe(date.toISOString());
    });
  });

  describe('status styles', () => {
    it('applies completed status class', () => {
      const timeline = createTimeline({ events: sampleEvents });
      const completedEvents = timeline.element.querySelectorAll('.dos-timeline__event--completed');
      expect(completedEvents.length).toBe(1);
    });

    it('applies current status class', () => {
      const timeline = createTimeline({ events: sampleEvents });
      const currentEvents = timeline.element.querySelectorAll('.dos-timeline__event--current');
      expect(currentEvents.length).toBe(1);
    });

    it('applies upcoming status class', () => {
      const timeline = createTimeline({ events: sampleEvents });
      const upcomingEvents = timeline.element.querySelectorAll('.dos-timeline__event--upcoming');
      expect(upcomingEvents.length).toBe(2);
    });

    it('defaults to upcoming status when not specified', () => {
      const events: TimelineEvent[] = [{
        id: '1',
        title: 'Event without status'
      }];
      
      const timeline = createTimeline({ events });
      const upcomingEvent = timeline.element.querySelector('.dos-timeline__event--upcoming');
      expect(upcomingEvent).not.toBeNull();
    });
  });

  describe('markers', () => {
    it('renders markers for each event', () => {
      const timeline = createTimeline({ events: sampleEvents });
      const markers = timeline.element.querySelectorAll('.dos-timeline__marker');
      expect(markers.length).toBe(4);
    });

    it('renders custom icon when provided', () => {
      const events: TimelineEvent[] = [{
        id: '1',
        title: 'Event with icon',
        icon: '★',
        status: 'completed'
      }];
      
      const timeline = createTimeline({ events });
      const marker = timeline.element.querySelector('.dos-timeline__marker');
      expect(marker?.dataset.icon).toBe('★');
      expect(marker?.textContent).toBe('★');
    });
  });

  describe('connectors', () => {
    it('renders connectors between events by default', () => {
      const timeline = createTimeline({ events: sampleEvents });
      const connectors = timeline.element.querySelectorAll('.dos-timeline__connector');
      // Should have 3 connectors (between 4 events)
      expect(connectors.length).toBe(3);
    });

    it('does not render connector after last event', () => {
      const timeline = createTimeline({ events: sampleEvents });
      const lastEvent = timeline.element.querySelector('.dos-timeline__event:last-child');
      const connector = lastEvent?.querySelector('.dos-timeline__connector');
      expect(connector).toBeNull();
    });

    it('hides connectors when showConnectors is false', () => {
      const timeline = createTimeline({ events: sampleEvents, showConnectors: false });
      const connectors = timeline.element.querySelectorAll('.dos-timeline__connector');
      expect(connectors.length).toBe(0);
    });
  });

  describe('alternating layout', () => {
    it('applies alternating class when enabled', () => {
      const timeline = createTimeline({
        events: sampleEvents,
        orientation: 'vertical',
        alternating: true
      });
      expect(timeline.element.classList.contains('dos-timeline--alternating')).toBe(true);
    });

    it('does not apply alternating class for horizontal', () => {
      const timeline = createTimeline({
        events: sampleEvents,
        orientation: 'horizontal',
        alternating: true
      });
      // Alternating only applies to vertical
      expect(timeline.element.classList.contains('dos-timeline--alternating')).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('has list role', () => {
      const timeline = createTimeline({ events: sampleEvents });
      expect(timeline.element.getAttribute('role')).toBe('list');
    });

    it('has default aria-label', () => {
      const timeline = createTimeline({ events: sampleEvents });
      expect(timeline.element.getAttribute('aria-label')).toBe('Timeline');
    });

    it('uses custom aria-label', () => {
      const timeline = createTimeline({
        events: sampleEvents,
        'aria-label': 'Project milestones'
      });
      expect(timeline.element.getAttribute('aria-label')).toBe('Project milestones');
    });

    it('events have listitem role', () => {
      const timeline = createTimeline({ events: sampleEvents });
      const eventElements = timeline.element.querySelectorAll('[role="listitem"]');
      expect(eventElements.length).toBe(4);
    });

    it('timestamps are time elements', () => {
      const timeline = createTimeline({ events: sampleEvents });
      const timeElements = timeline.element.querySelectorAll('time');
      expect(timeElements.length).toBe(4);
    });
  });

  describe('instance methods', () => {
    describe('getEvents', () => {
      it('returns all events', () => {
        const timeline = createTimeline({ events: sampleEvents });
        const events = timeline.getEvents();
        expect(events.length).toBe(4);
        expect(events[0].title).toBe('Project Started');
      });

      it('returns a copy of events array', () => {
        const timeline = createTimeline({ events: sampleEvents });
        const events = timeline.getEvents();
        events.push({ id: 'new', title: 'New Event' });
        expect(timeline.getEvents().length).toBe(4);
      });
    });

    describe('setEvents', () => {
      it('replaces all events', () => {
        const timeline = createTimeline({ events: sampleEvents });
        container.appendChild(timeline.element);
        
        timeline.setEvents([
          { id: 'a', title: 'New Event A', status: 'current' }
        ]);
        
        expect(timeline.getEvents().length).toBe(1);
        const eventElements = timeline.element.querySelectorAll('.dos-timeline__event');
        expect(eventElements.length).toBe(1);
      });
    });

    describe('addEvent', () => {
      it('adds an event to the timeline', () => {
        const timeline = createTimeline({ events: sampleEvents });
        container.appendChild(timeline.element);
        
        timeline.addEvent({
          id: '5',
          title: 'New Event',
          status: 'upcoming'
        });
        
        expect(timeline.getEvents().length).toBe(5);
        const eventElements = timeline.element.querySelectorAll('.dos-timeline__event');
        expect(eventElements.length).toBe(5);
      });
    });

    describe('removeEvent', () => {
      it('removes an event by id', () => {
        const timeline = createTimeline({ events: sampleEvents });
        container.appendChild(timeline.element);
        
        timeline.removeEvent('2');
        
        expect(timeline.getEvents().length).toBe(3);
        expect(timeline.getEventById('2')).toBeUndefined();
      });

      it('does nothing if event not found', () => {
        const timeline = createTimeline({ events: sampleEvents });
        timeline.removeEvent('nonexistent');
        expect(timeline.getEvents().length).toBe(4);
      });
    });

    describe('updateEvent', () => {
      it('updates event properties', () => {
        const timeline = createTimeline({ events: sampleEvents });
        container.appendChild(timeline.element);
        
        timeline.updateEvent('2', {
          title: 'Updated Title',
          status: 'completed'
        });
        
        const event = timeline.getEventById('2');
        expect(event?.title).toBe('Updated Title');
        expect(event?.status).toBe('completed');
      });

      it('re-renders the timeline', () => {
        const timeline = createTimeline({ events: sampleEvents });
        container.appendChild(timeline.element);
        
        timeline.updateEvent('2', { title: 'Updated' });
        
        const titles = timeline.element.querySelectorAll('.dos-timeline__title');
        expect(titles[1].textContent).toBe('Updated');
      });

      it('does nothing if event not found', () => {
        const timeline = createTimeline({ events: sampleEvents });
        timeline.updateEvent('nonexistent', { title: 'New' });
        expect(timeline.getEvents().length).toBe(4);
      });
    });

    describe('getEventById', () => {
      it('returns event by id', () => {
        const timeline = createTimeline({ events: sampleEvents });
        const event = timeline.getEventById('2');
        expect(event?.title).toBe('Development Phase');
      });

      it('returns undefined for non-existent id', () => {
        const timeline = createTimeline({ events: sampleEvents });
        expect(timeline.getEventById('999')).toBeUndefined();
      });
    });

    describe('getCurrentEvent', () => {
      it('returns the current event', () => {
        const timeline = createTimeline({ events: sampleEvents });
        const current = timeline.getCurrentEvent();
        expect(current?.id).toBe('2');
        expect(current?.title).toBe('Development Phase');
      });

      it('returns undefined if no current event', () => {
        const events: TimelineEvent[] = [
          { id: '1', title: 'Done', status: 'completed' },
          { id: '2', title: 'Soon', status: 'upcoming' }
        ];
        const timeline = createTimeline({ events });
        expect(timeline.getCurrentEvent()).toBeUndefined();
      });
    });

    describe('destroy', () => {
      it('clears the timeline content', () => {
        const timeline = createTimeline({ events: sampleEvents });
        container.appendChild(timeline.element);
        
        timeline.destroy();
        expect(timeline.element.innerHTML).toBe('');
      });
    });
  });

  describe('getStatusMarker utility', () => {
    it('returns correct marker for completed', () => {
      expect(getStatusMarker('completed')).toBe('●');
    });

    it('returns correct marker for current', () => {
      expect(getStatusMarker('current')).toBe('○');
    });

    it('returns correct marker for upcoming', () => {
      expect(getStatusMarker('upcoming')).toBe('◌');
    });
  });

  describe('data attributes', () => {
    it('stores event id in data attribute', () => {
      const timeline = createTimeline({ events: sampleEvents });
      const eventElements = timeline.element.querySelectorAll('.dos-timeline__event');
      
      expect(eventElements[0].getAttribute('data-event-id')).toBe('1');
      expect(eventElements[1].getAttribute('data-event-id')).toBe('2');
    });
  });

  describe('complete scenarios', () => {
    it('renders a project milestone timeline', () => {
      const milestones: TimelineEvent[] = [
        { id: 'm1', title: 'Requirements', description: 'Gathered requirements', timestamp: '01/01/2026', status: 'completed' },
        { id: 'm2', title: 'Design', description: 'UI/UX design complete', timestamp: '01/10/2026', status: 'completed' },
        { id: 'm3', title: 'Development', description: 'Building features', timestamp: '01/15/2026', status: 'current' },
        { id: 'm4', title: 'Testing', timestamp: '02/01/2026', status: 'upcoming' },
        { id: 'm5', title: 'Deployment', timestamp: '02/15/2026', status: 'upcoming' }
      ];

      const timeline = createTimeline({
        events: milestones,
        'aria-label': 'Project milestones'
      });

      container.appendChild(timeline.element);

      // Verify structure
      expect(timeline.element.querySelectorAll('.dos-timeline__event').length).toBe(5);
      expect(timeline.element.querySelectorAll('.dos-timeline__event--completed').length).toBe(2);
      expect(timeline.getCurrentEvent()?.title).toBe('Development');
    });

    it('renders a horizontal timeline', () => {
      const timeline = createTimeline({
        events: sampleEvents.slice(0, 3),
        orientation: 'horizontal'
      });

      container.appendChild(timeline.element);

      expect(timeline.element.classList.contains('dos-timeline--horizontal')).toBe(true);
      expect(timeline.element.querySelectorAll('.dos-timeline__event').length).toBe(3);
    });
  });
});
