import { ref, watch, type Ref } from 'vue';

/**
 * Memoized computed that only recalculates when dependencies change
 */
export function useMemo<T>(fn: () => T, deps: Ref<any>[]): Ref<T> {
  const result = ref<T>(fn()) as Ref<T>;
  const prevDeps = ref(deps.map(dep => dep.value));

  watch(
    deps,
    newDeps => {
      const hasChanged = newDeps.some(
        (dep, index) => dep !== prevDeps.value[index]
      );

      if (hasChanged) {
        result.value = fn();
        prevDeps.value = newDeps;
      }
    },
    { deep: true }
  );

  return result;
}

/**
 * Debounced execution with automatic cleanup
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout | null = null;

  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  }) as T;
}

/**
 * Throttled execution
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  let isThrottled = false;

  return ((...args: Parameters<T>) => {
    if (isThrottled) return;

    fn(...args);
    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
    }, delay);
  }) as T;
}

/**
 * Performance monitoring
 */
export function usePerformanceMonitor() {
  const markStart = (name: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  };

  const markEnd = (name: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);

      const measure = performance.getEntriesByName(name, 'measure')[0];
      if (measure) {
        console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
      }
    }
  };

  return { markStart, markEnd };
}
