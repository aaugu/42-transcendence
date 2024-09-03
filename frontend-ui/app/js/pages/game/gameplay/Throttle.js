export default function throttle(fn, wait) {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < wait) {
      return;
    }
    lastCall = now;
    return fn(...args);
  };
}