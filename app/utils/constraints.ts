export const constraintSubjects = [
  'title',
  'description',
  'sessionLocation',
  'sessionDate'
] as const;

export const constraintPredicates = [
  'textEquals',
  'textContains',
  'dateEquals',
  'dateIsBefore',
  'dateIsAfter',
  'exists',
  'notExists'
]

export type ConstraintSubject = typeof constraintSubjects[number];
export type ConstraintPredicate = typeof constraintPredicates[number];
export enum ConstraintObjectType {
  Date,
  Text,
  None
}
