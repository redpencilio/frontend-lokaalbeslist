export const constraintSubjects = [
  'title',
  'description',
  'sessionLocation',
  'sessionDate',
  'governanceArea'
] as const;

export const constraintPredicates = [
  'textEquals',
  'textContains',
  'dateEquals',
  'dateIsBefore',
  'dateIsAfter',
  'governanceAreaEquals',
  'exists',
  'notExists'
] as const;

export type ConstraintSubject = typeof constraintSubjects[number];
export type ConstraintPredicate = typeof constraintPredicates[number];
export enum ConstraintObjectType {
  Date,
  Text,
  GovernanceArea,
  None
}
