export let defaultDuration = 60 * 1000;

export function setDefaultDuration(duration: number) {
  defaultDuration = duration;
}

export function getDefaultDuration(): number {
  return defaultDuration;
}
