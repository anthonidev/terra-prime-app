export type NavigationLayer<T> = {
  id: string;
  type: string;
  title: string;
  data?: T;
};

export type NavigationStack<T> = NavigationLayer<T>[];
