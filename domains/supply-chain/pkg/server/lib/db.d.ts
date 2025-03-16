type QueryResult = Promise<object[]>;
declare namespace db {
  export function query(): QueryResult;
  export function read(): QueryResult;
}
