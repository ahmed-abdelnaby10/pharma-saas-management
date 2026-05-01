/**
 * Minimal type stub for @tauri-apps/plugin-sql.
 * Replaced by the real package types once `pnpm install` is run
 * (which adds @tauri-apps/plugin-sql to node_modules).
 *
 * The stub only exists so TypeScript does not error before the package
 * is installed.  It must match the real API surface we actually use.
 */
declare module '@tauri-apps/plugin-sql' {
  export interface QueryResult {
    lastInsertId: number;
    rowsAffected: number;
  }

  export default class Database {
    static load(path: string): Promise<Database>;
    execute(query: string, bindValues?: unknown[]): Promise<QueryResult>;
    select<T>(query: string, bindValues?: unknown[]): Promise<T>;
    close(): Promise<boolean>;
  }
}
