export type ValueFunction<TValue, TArg> = (arg: TArg) => TValue;
export type ValueOrFunction<TValue, TArg> =
  | TValue
  | ValueFunction<TValue, TArg>;

const isFunction = <TValue, TArg>(
  valOrFunction: ValueOrFunction<TValue, TArg>
): valOrFunction is ValueFunction<TValue, TArg> =>
  typeof valOrFunction === 'function';

export const resolveValueOrFunction = <TValue, TArg>(
  valOrFunction: ValueOrFunction<TValue, TArg>,
  arg: TArg
): TValue => (isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction);

export type PlausibleEvent = string;

export interface PlausibleOptions {
  callback?: Function;
  props?: Object;
}

export interface PlausibleEvents {
  event: PlausibleEvent;
  options?: PlausibleOptions;
}

export interface ObservablePlausibleEvents<T> {
  loading?: PlausibleEvents;
  success?: ValueOrFunction<PlausibleEvents, T>;
  error?: ValueOrFunction<PlausibleEvents, any>;
}
