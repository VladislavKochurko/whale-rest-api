export type UpdateResult<M> = Promise<
  [affectedCount: number, affectedRows?: M[]]
>;
