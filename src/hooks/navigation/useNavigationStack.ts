import { NavigationLayer, NavigationStack } from '@/types/navigation';
import { useState } from 'react';

export function useNavigationStack() {
  const [stack, setStack] = useState<NavigationStack<unknown>>([]);

  const pushLayer = <T>(type: string, title: string, data?: T) => {
    const newLayer: NavigationLayer<T> = {
      id: Date.now().toString(),
      type,
      title,
      data
    };
    setStack((prev) => [...prev, newLayer]);
  };

  const popLayer = () => {
    setStack((prev) => prev.slice(0, -1));
  };

  const resetStack = () => {
    setStack([]);
  };

  return {
    stack,
    currentLayer: stack[stack.length - 1],
    pushLayer,
    popLayer,
    resetStack,
    canGoBack: stack.length > 0
  };
}
