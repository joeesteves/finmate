import { Array, pipe } from 'effect'

const props = pipe(
  Array.Do,
  Array.bind('size', () => ['small', 'medium', 'large'] as const),
  Array.bind(
    'theme',
    () => ['dark', 'light', 'contrast-light', 'contrast-dark'] as const,
  ),
  Array.bind('disabled', () => [false, true]),
  Array.bind('loading', () => [false, true]),
)

console.log(props)
