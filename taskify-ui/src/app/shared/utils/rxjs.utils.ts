import { BehaviorSubject, Observable, defer, finalize } from 'rxjs';

export function indicate<T>(
  indicator: BehaviorSubject<boolean>
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) =>
    defer(() => {
      indicator.next(true);

      return source.pipe(finalize(() => indicator.next(false)));
    });
}
