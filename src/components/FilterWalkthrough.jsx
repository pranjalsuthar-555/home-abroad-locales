import { useState, useEffect } from 'react';

const STEPS = [
  {
    id: 'welcome',
    target: null,
    title: 'Your world, filtered.',
    body: 'You\'ve got 500+ destinations. The filters on the left are how you find the ones that are actually right for you. Let\'s take 30 seconds to set them up.',
    cta: 'Show me how →',
    position: 'center',
    requiresInteraction: false,
  },
  {
    id: 'personality',
    target: '[data-filter="personality"]',
    title: 'Start with your personality type.',
    body: 'You\'re already pre-selected based on your quiz — but tap a tag to confirm or add another. Many people are a blend.',
    cta: 'Next →',
    position: 'right',
    requiresInteraction: true,
    interactionHint: 'Tap a personality tag above to continue',
  },
  {
    id: 'cost',
    target: '[data-filter="cost"]',
    title: 'Set your budget.',
    body: 'Drag the slider to your comfortable monthly spend. This is total cost of living — rent, food, everything.',
    cta: 'Next →',
    position: 'right',
    requiresInteraction: true,
    interactionHint: 'Move the slider above to continue',
  },
  {
    id: 'score',
    target: '[data-filter="score"]',
    title: 'Filter by Suitability.',
    body: 'The score (1–5) tells you how practical a destination is for life abroad — visa ease, safety, community. Higher is easier.',
    cta: 'Next →',
    position: 'right',
    requiresInteraction: true,
    interactionHint: 'Adjust the score filter above to continue',
  },
  {
    id: 'trend',
    target: '[data-filter="trend"]',
    title: 'Is the country getting better or worse?',
    body: '↑ Improving destinations are ones where conditions for newcomers are actively getting better. Worth filtering for if you\'re planning long-term.',
    cta: 'Next →',
    position: 'right',
    requiresInteraction: true,
    interactionHint: 'Select a trend option above to continue',
  },
  {
    id: 'advantages',
    target: '[data-filter="advantages"]',
    title: 'Filter for what matters most.',
    body: 'Pick the advantages you care about — strong international community, low cost, great weather, fast internet. Only places that match will show.',
    cta: 'Next →',
    position: 'right',
    requiresInteraction: true,
    interactionHint: 'Select an advantage above to continue',
  },
  {
    id: 'dealbreakers',
    target: '[data-filter="dealbreakers"]',
    title: 'Set your dealbreakers.',
    body: 'These are the things you\'re not willing to compromise on. Any destination with these will be hidden — keeping your list clean.',
    cta: 'Next →',
    position: 'right',
    requiresInteraction: true,
    interactionHint: 'Select a dealbreaker above to continue',
  },
  {
    id: 'done',
    target: null,
    title: 'You\'re set.',
    body: 'Your filters are live. The globe and list update instantly as you adjust them. Click any destination to explore it in depth.',
    cta: 'Start exploring ✦',
    position: 'center',
    requiresInteraction: false,
    isDone: true,
  },
];

export default function FilterWalkthrough({ onComplete }) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [interacted, setInteracted] = useState(false);

  const current = STEPS[step];

  useEffect(() => {
    setInteracted(false);
    if (current.target) {
      const el = document.querySelector(current.target);
      if (el) {
        // steps say things like "drag the slider", so open the section first —
        // otherwise the control being described isn't on screen
        const body = el.querySelector('.filter-section-body');
        const toggle = el.querySelector('button');
        if (body && !body.classList.contains('open') && toggle) toggle.click();

        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          setTargetRect(el.getBoundingClientRect());
        }, 600);
      }
    } else {
      setTargetRect(null);
    }
  }, [step, current.target]);

  /* Filter sections change height when they open, and the sidebar scrolls — so the
     rect captured above goes stale and the tooltip drifts away from what it describes.
     Re-measure on scroll/resize while a step is active. */
  useEffect(() => {
    if (!current.target) return;
    let frame = null;
    const remeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = document.querySelector(current.target);
        if (el) setTargetRect(el.getBoundingClientRect());
      });
    };
    window.addEventListener('scroll', remeasure, true);   // capture: catches sidebar scroll
    window.addEventListener('resize', remeasure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', remeasure, true);
      window.removeEventListener('resize', remeasure);
    };
  }, [step, current.target]);

  useEffect(() => {
    if (!current.requiresInteraction || !current.target) return;
    const el = document.querySelector(current.target);
    if (!el) return;

    const handleInteraction = () => {
      setInteracted(true);
      // the section just expanded/collapsed — keep the tooltip with it
      requestAnimationFrame(() => {
        const target = document.querySelector(current.target);
        if (target) setTargetRect(target.getBoundingClientRect());
      });
    };

    el.addEventListener('click', handleInteraction);
    el.addEventListener('input', handleInteraction);
    el.addEventListener('change', handleInteraction);
    el.addEventListener('pointerup', handleInteraction);

    return () => {
      el.removeEventListener('click', handleInteraction);
      el.removeEventListener('input', handleInteraction);
      el.removeEventListener('change', handleInteraction);
      el.removeEventListener('pointerup', handleInteraction);
    };
  }, [step, current.target, current.requiresInteraction]);

  const canAdvance = !current.requiresInteraction || interacted;

  const next = () => {
    if (!canAdvance) return;
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      localStorage.setItem('ha_tour_done', 'true');
      onComplete();
    }
  };

  const skip = () => {
    localStorage.setItem('ha_tour_done', 'true');
    onComplete();
  };

  return (
    <>
      {/* No dimming overlay or highlight ring: the spotlight was drawn from a rect
          captured once, so expanding a filter section left the control you'd just
          clicked sitting inside the dark ring. The tooltip anchors to the target
          instead, which gives the same context without covering anything. */}
      <div
        className={`tour-tooltip ${current.position === 'center' ? 'tour-tooltip-center' : 'tour-tooltip-right'}`}
        style={targetRect && current.position === 'right' ? {
          top:      Math.max(20, Math.min(
                      targetRect.top + targetRect.height / 2,
                      window.innerHeight - 260
                    )),
          left:     targetRect.right + 20,
          transform: 'translateY(-50%)',
          position: 'fixed',
        } : {}}
      >
        <div className="tour-step-count">{step + 1} / {STEPS.length}</div>
        <h3 className="tour-title">{current.title}</h3>
        <p className="tour-body">{current.body}</p>

        {current.requiresInteraction && !interacted && (
          <p className="tour-interaction-hint">👆 {current.interactionHint}</p>
        )}

        <div className="tour-actions">
          {!current.isDone && (
            <button className="tour-skip" onClick={skip}>Skip tour</button>
          )}
          <button
            className={`tour-cta ${!canAdvance ? 'tour-cta-disabled' : ''}`}
            onClick={next}
            disabled={!canAdvance}
          >
            {current.cta}
          </button>
        </div>
      </div>
    </>
  );
}
