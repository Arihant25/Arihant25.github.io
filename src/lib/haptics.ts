import { browser } from '$app/environment';
import { WebHaptics } from 'web-haptics';

// One shared instance, created lazily on first use in the browser.
let instance: WebHaptics | null = null;

function get(): WebHaptics | null {
	if (!browser || !WebHaptics.isSupported) return null;
	// Vibration is motion — honour the same preference the animations do.
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
	if (!instance) instance = new WebHaptics();
	return instance;
}

type HapticInput = Parameters<WebHaptics['trigger']>[0];

function trigger(input: HapticInput) {
	get()
		?.trigger(input)
		.catch(() => {
			// Haptics are garnish; never let them break an interaction.
		});
}

// The faintest acknowledgement — a fingertip landing on something.
export const hapticGrab = () => trigger('selection');

// A light tap for presses: cards, menu buttons, play/pause.
export const hapticTap = () => trigger('light');

// Stepping through items (photo lightbox arrows, skip buttons).
export const hapticStep = () => trigger('rigid');

// The light switch: a soft take-up, then the crisp clack of the toggle
// landing — timed to match the switch sound.
export const hapticSwitch = () =>
	trigger([
		{ duration: 10, intensity: 0.4 },
		{ delay: 45, duration: 25, intensity: 1 }
	]);

// A page turning: the flutter of paper leaving your thumb, then settling.
export const hapticFlip = () =>
	trigger([
		{ duration: 8, intensity: 0.3 },
		{ delay: 25, duration: 18, intensity: 0.6 },
		{ delay: 20, duration: 10, intensity: 0.3 }
	]);

// Tu-dum. Two thumps in step with the sound when a paper opens.
export const hapticTudum = () =>
	trigger([
		{ duration: 30, intensity: 0.6 },
		{ delay: 140, duration: 50, intensity: 1 }
	]);
