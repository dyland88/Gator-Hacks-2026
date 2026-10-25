
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Post
 * 
 */
export type Post = $Result.DefaultSelection<Prisma.$PostPayload>
/**
 * Model UserProfile
 * 
 */
export type UserProfile = $Result.DefaultSelection<Prisma.$UserProfilePayload>
/**
 * Model Municipality
 * 
 */
export type Municipality = $Result.DefaultSelection<Prisma.$MunicipalityPayload>
/**
 * Model IngestionRun
 * 
 */
export type IngestionRun = $Result.DefaultSelection<Prisma.$IngestionRunPayload>
/**
 * Model Ordinance
 * 
 */
export type Ordinance = $Result.DefaultSelection<Prisma.$OrdinancePayload>
/**
 * Model OrdinanceChange
 * 
 */
export type OrdinanceChange = $Result.DefaultSelection<Prisma.$OrdinanceChangePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Posts
 * const posts = await prisma.post.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Posts
   * const posts = await prisma.post.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.post`: Exposes CRUD operations for the **Post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
  get post(): Prisma.PostDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userProfile`: Exposes CRUD operations for the **UserProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserProfiles
    * const userProfiles = await prisma.userProfile.findMany()
    * ```
    */
  get userProfile(): Prisma.UserProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.municipality`: Exposes CRUD operations for the **Municipality** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Municipalities
    * const municipalities = await prisma.municipality.findMany()
    * ```
    */
  get municipality(): Prisma.MunicipalityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ingestionRun`: Exposes CRUD operations for the **IngestionRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IngestionRuns
    * const ingestionRuns = await prisma.ingestionRun.findMany()
    * ```
    */
  get ingestionRun(): Prisma.IngestionRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ordinance`: Exposes CRUD operations for the **Ordinance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ordinances
    * const ordinances = await prisma.ordinance.findMany()
    * ```
    */
  get ordinance(): Prisma.OrdinanceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ordinanceChange`: Exposes CRUD operations for the **OrdinanceChange** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrdinanceChanges
    * const ordinanceChanges = await prisma.ordinanceChange.findMany()
    * ```
    */
  get ordinanceChange(): Prisma.OrdinanceChangeDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Post: 'Post',
    UserProfile: 'UserProfile',
    Municipality: 'Municipality',
    IngestionRun: 'IngestionRun',
    Ordinance: 'Ordinance',
    OrdinanceChange: 'OrdinanceChange'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "post" | "userProfile" | "municipality" | "ingestionRun" | "ordinance" | "ordinanceChange"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Post: {
        payload: Prisma.$PostPayload<ExtArgs>
        fields: Prisma.PostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findFirst: {
            args: Prisma.PostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findMany: {
            args: Prisma.PostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          create: {
            args: Prisma.PostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          createMany: {
            args: Prisma.PostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          delete: {
            args: Prisma.PostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          update: {
            args: Prisma.PostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          deleteMany: {
            args: Prisma.PostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PostUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          upsert: {
            args: Prisma.PostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          aggregate: {
            args: Prisma.PostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePost>
          }
          groupBy: {
            args: Prisma.PostGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostCountArgs<ExtArgs>
            result: $Utils.Optional<PostCountAggregateOutputType> | number
          }
        }
      }
      UserProfile: {
        payload: Prisma.$UserProfilePayload<ExtArgs>
        fields: Prisma.UserProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          findFirst: {
            args: Prisma.UserProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          findMany: {
            args: Prisma.UserProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          create: {
            args: Prisma.UserProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          createMany: {
            args: Prisma.UserProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          delete: {
            args: Prisma.UserProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          update: {
            args: Prisma.UserProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          deleteMany: {
            args: Prisma.UserProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          upsert: {
            args: Prisma.UserProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          aggregate: {
            args: Prisma.UserProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserProfile>
          }
          groupBy: {
            args: Prisma.UserProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserProfileCountArgs<ExtArgs>
            result: $Utils.Optional<UserProfileCountAggregateOutputType> | number
          }
        }
      }
      Municipality: {
        payload: Prisma.$MunicipalityPayload<ExtArgs>
        fields: Prisma.MunicipalityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MunicipalityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MunicipalityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MunicipalityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MunicipalityPayload>
          }
          findFirst: {
            args: Prisma.MunicipalityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MunicipalityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MunicipalityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MunicipalityPayload>
          }
          findMany: {
            args: Prisma.MunicipalityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MunicipalityPayload>[]
          }
          create: {
            args: Prisma.MunicipalityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MunicipalityPayload>
          }
          createMany: {
            args: Prisma.MunicipalityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MunicipalityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MunicipalityPayload>[]
          }
          delete: {
            args: Prisma.MunicipalityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MunicipalityPayload>
          }
          update: {
            args: Prisma.MunicipalityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MunicipalityPayload>
          }
          deleteMany: {
            args: Prisma.MunicipalityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MunicipalityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MunicipalityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MunicipalityPayload>[]
          }
          upsert: {
            args: Prisma.MunicipalityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MunicipalityPayload>
          }
          aggregate: {
            args: Prisma.MunicipalityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMunicipality>
          }
          groupBy: {
            args: Prisma.MunicipalityGroupByArgs<ExtArgs>
            result: $Utils.Optional<MunicipalityGroupByOutputType>[]
          }
          count: {
            args: Prisma.MunicipalityCountArgs<ExtArgs>
            result: $Utils.Optional<MunicipalityCountAggregateOutputType> | number
          }
        }
      }
      IngestionRun: {
        payload: Prisma.$IngestionRunPayload<ExtArgs>
        fields: Prisma.IngestionRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IngestionRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IngestionRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>
          }
          findFirst: {
            args: Prisma.IngestionRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IngestionRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>
          }
          findMany: {
            args: Prisma.IngestionRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>[]
          }
          create: {
            args: Prisma.IngestionRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>
          }
          createMany: {
            args: Prisma.IngestionRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IngestionRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>[]
          }
          delete: {
            args: Prisma.IngestionRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>
          }
          update: {
            args: Prisma.IngestionRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>
          }
          deleteMany: {
            args: Prisma.IngestionRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IngestionRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IngestionRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>[]
          }
          upsert: {
            args: Prisma.IngestionRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>
          }
          aggregate: {
            args: Prisma.IngestionRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIngestionRun>
          }
          groupBy: {
            args: Prisma.IngestionRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<IngestionRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.IngestionRunCountArgs<ExtArgs>
            result: $Utils.Optional<IngestionRunCountAggregateOutputType> | number
          }
        }
      }
      Ordinance: {
        payload: Prisma.$OrdinancePayload<ExtArgs>
        fields: Prisma.OrdinanceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrdinanceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrdinanceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinancePayload>
          }
          findFirst: {
            args: Prisma.OrdinanceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrdinanceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinancePayload>
          }
          findMany: {
            args: Prisma.OrdinanceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinancePayload>[]
          }
          create: {
            args: Prisma.OrdinanceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinancePayload>
          }
          createMany: {
            args: Prisma.OrdinanceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrdinanceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinancePayload>[]
          }
          delete: {
            args: Prisma.OrdinanceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinancePayload>
          }
          update: {
            args: Prisma.OrdinanceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinancePayload>
          }
          deleteMany: {
            args: Prisma.OrdinanceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrdinanceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrdinanceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinancePayload>[]
          }
          upsert: {
            args: Prisma.OrdinanceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinancePayload>
          }
          aggregate: {
            args: Prisma.OrdinanceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrdinance>
          }
          groupBy: {
            args: Prisma.OrdinanceGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrdinanceGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrdinanceCountArgs<ExtArgs>
            result: $Utils.Optional<OrdinanceCountAggregateOutputType> | number
          }
        }
      }
      OrdinanceChange: {
        payload: Prisma.$OrdinanceChangePayload<ExtArgs>
        fields: Prisma.OrdinanceChangeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrdinanceChangeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinanceChangePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrdinanceChangeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinanceChangePayload>
          }
          findFirst: {
            args: Prisma.OrdinanceChangeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinanceChangePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrdinanceChangeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinanceChangePayload>
          }
          findMany: {
            args: Prisma.OrdinanceChangeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinanceChangePayload>[]
          }
          create: {
            args: Prisma.OrdinanceChangeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinanceChangePayload>
          }
          createMany: {
            args: Prisma.OrdinanceChangeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrdinanceChangeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinanceChangePayload>[]
          }
          delete: {
            args: Prisma.OrdinanceChangeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinanceChangePayload>
          }
          update: {
            args: Prisma.OrdinanceChangeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinanceChangePayload>
          }
          deleteMany: {
            args: Prisma.OrdinanceChangeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrdinanceChangeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrdinanceChangeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinanceChangePayload>[]
          }
          upsert: {
            args: Prisma.OrdinanceChangeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrdinanceChangePayload>
          }
          aggregate: {
            args: Prisma.OrdinanceChangeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrdinanceChange>
          }
          groupBy: {
            args: Prisma.OrdinanceChangeGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrdinanceChangeGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrdinanceChangeCountArgs<ExtArgs>
            result: $Utils.Optional<OrdinanceChangeCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    post?: PostOmit
    userProfile?: UserProfileOmit
    municipality?: MunicipalityOmit
    ingestionRun?: IngestionRunOmit
    ordinance?: OrdinanceOmit
    ordinanceChange?: OrdinanceChangeOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type MunicipalityCountOutputType
   */

  export type MunicipalityCountOutputType = {
    ordinances: number
  }

  export type MunicipalityCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ordinances?: boolean | MunicipalityCountOutputTypeCountOrdinancesArgs
  }

  // Custom InputTypes
  /**
   * MunicipalityCountOutputType without action
   */
  export type MunicipalityCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MunicipalityCountOutputType
     */
    select?: MunicipalityCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MunicipalityCountOutputType without action
   */
  export type MunicipalityCountOutputTypeCountOrdinancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrdinanceWhereInput
  }


  /**
   * Count Type IngestionRunCountOutputType
   */

  export type IngestionRunCountOutputType = {
    changes: number
  }

  export type IngestionRunCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    changes?: boolean | IngestionRunCountOutputTypeCountChangesArgs
  }

  // Custom InputTypes
  /**
   * IngestionRunCountOutputType without action
   */
  export type IngestionRunCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRunCountOutputType
     */
    select?: IngestionRunCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * IngestionRunCountOutputType without action
   */
  export type IngestionRunCountOutputTypeCountChangesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrdinanceChangeWhereInput
  }


  /**
   * Count Type OrdinanceCountOutputType
   */

  export type OrdinanceCountOutputType = {
    changes: number
  }

  export type OrdinanceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    changes?: boolean | OrdinanceCountOutputTypeCountChangesArgs
  }

  // Custom InputTypes
  /**
   * OrdinanceCountOutputType without action
   */
  export type OrdinanceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdinanceCountOutputType
     */
    select?: OrdinanceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrdinanceCountOutputType without action
   */
  export type OrdinanceCountOutputTypeCountChangesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrdinanceChangeWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Post
   */

  export type AggregatePost = {
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  export type PostAvgAggregateOutputType = {
    id: number | null
  }

  export type PostSumAggregateOutputType = {
    id: number | null
  }

  export type PostMinAggregateOutputType = {
    id: number | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PostMaxAggregateOutputType = {
    id: number | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PostCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PostAvgAggregateInputType = {
    id?: true
  }

  export type PostSumAggregateInputType = {
    id?: true
  }

  export type PostMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PostMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PostCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Post to aggregate.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Posts
    **/
    _count?: true | PostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PostAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PostSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostMaxAggregateInputType
  }

  export type GetPostAggregateType<T extends PostAggregateArgs> = {
        [P in keyof T & keyof AggregatePost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePost[P]>
      : GetScalarType<T[P], AggregatePost[P]>
  }




  export type PostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
    orderBy?: PostOrderByWithAggregationInput | PostOrderByWithAggregationInput[]
    by: PostScalarFieldEnum[] | PostScalarFieldEnum
    having?: PostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostCountAggregateInputType | true
    _avg?: PostAvgAggregateInputType
    _sum?: PostSumAggregateInputType
    _min?: PostMinAggregateInputType
    _max?: PostMaxAggregateInputType
  }

  export type PostGroupByOutputType = {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  type GetPostGroupByPayload<T extends PostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostGroupByOutputType[P]>
            : GetScalarType<T[P], PostGroupByOutputType[P]>
        }
      >
    >


  export type PostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["post"]>

  export type PostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["post"]>

  export type PostSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["post"]>

  export type PostSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["post"]>

  export type $PostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Post"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["post"]>
    composites: {}
  }

  type PostGetPayload<S extends boolean | null | undefined | PostDefaultArgs> = $Result.GetResult<Prisma.$PostPayload, S>

  type PostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PostCountAggregateInputType | true
    }

  export interface PostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Post'], meta: { name: 'Post' } }
    /**
     * Find zero or one Post that matches the filter.
     * @param {PostFindUniqueArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostFindUniqueArgs>(args: SelectSubset<T, PostFindUniqueArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Post that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PostFindUniqueOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostFindUniqueOrThrowArgs>(args: SelectSubset<T, PostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostFindFirstArgs>(args?: SelectSubset<T, PostFindFirstArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostFindFirstOrThrowArgs>(args?: SelectSubset<T, PostFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Posts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Posts
     * const posts = await prisma.post.findMany()
     * 
     * // Get first 10 Posts
     * const posts = await prisma.post.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postWithIdOnly = await prisma.post.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostFindManyArgs>(args?: SelectSubset<T, PostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Post.
     * @param {PostCreateArgs} args - Arguments to create a Post.
     * @example
     * // Create one Post
     * const Post = await prisma.post.create({
     *   data: {
     *     // ... data to create a Post
     *   }
     * })
     * 
     */
    create<T extends PostCreateArgs>(args: SelectSubset<T, PostCreateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Posts.
     * @param {PostCreateManyArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostCreateManyArgs>(args?: SelectSubset<T, PostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Posts and returns the data saved in the database.
     * @param {PostCreateManyAndReturnArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PostCreateManyAndReturnArgs>(args?: SelectSubset<T, PostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Post.
     * @param {PostDeleteArgs} args - Arguments to delete one Post.
     * @example
     * // Delete one Post
     * const Post = await prisma.post.delete({
     *   where: {
     *     // ... filter to delete one Post
     *   }
     * })
     * 
     */
    delete<T extends PostDeleteArgs>(args: SelectSubset<T, PostDeleteArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Post.
     * @param {PostUpdateArgs} args - Arguments to update one Post.
     * @example
     * // Update one Post
     * const post = await prisma.post.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostUpdateArgs>(args: SelectSubset<T, PostUpdateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Posts.
     * @param {PostDeleteManyArgs} args - Arguments to filter Posts to delete.
     * @example
     * // Delete a few Posts
     * const { count } = await prisma.post.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostDeleteManyArgs>(args?: SelectSubset<T, PostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostUpdateManyArgs>(args: SelectSubset<T, PostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts and returns the data updated in the database.
     * @param {PostUpdateManyAndReturnArgs} args - Arguments to update many Posts.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PostUpdateManyAndReturnArgs>(args: SelectSubset<T, PostUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Post.
     * @param {PostUpsertArgs} args - Arguments to update or create a Post.
     * @example
     * // Update or create a Post
     * const post = await prisma.post.upsert({
     *   create: {
     *     // ... data to create a Post
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Post we want to update
     *   }
     * })
     */
    upsert<T extends PostUpsertArgs>(args: SelectSubset<T, PostUpsertArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostCountArgs} args - Arguments to filter Posts to count.
     * @example
     * // Count the number of Posts
     * const count = await prisma.post.count({
     *   where: {
     *     // ... the filter for the Posts we want to count
     *   }
     * })
    **/
    count<T extends PostCountArgs>(
      args?: Subset<T, PostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PostAggregateArgs>(args: Subset<T, PostAggregateArgs>): Prisma.PrismaPromise<GetPostAggregateType<T>>

    /**
     * Group by Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostGroupByArgs['orderBy'] }
        : { orderBy?: PostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Post model
   */
  readonly fields: PostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Post.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Post model
   */
  interface PostFieldRefs {
    readonly id: FieldRef<"Post", 'Int'>
    readonly name: FieldRef<"Post", 'String'>
    readonly createdAt: FieldRef<"Post", 'DateTime'>
    readonly updatedAt: FieldRef<"Post", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Post findUnique
   */
  export type PostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findUniqueOrThrow
   */
  export type PostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findFirst
   */
  export type PostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findFirstOrThrow
   */
  export type PostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findMany
   */
  export type PostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Filter, which Posts to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post create
   */
  export type PostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data needed to create a Post.
     */
    data: XOR<PostCreateInput, PostUncheckedCreateInput>
  }

  /**
   * Post createMany
   */
  export type PostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Post createManyAndReturn
   */
  export type PostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Post update
   */
  export type PostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data needed to update a Post.
     */
    data: XOR<PostUpdateInput, PostUncheckedUpdateInput>
    /**
     * Choose, which Post to update.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post updateMany
   */
  export type PostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to update.
     */
    limit?: number
  }

  /**
   * Post updateManyAndReturn
   */
  export type PostUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to update.
     */
    limit?: number
  }

  /**
   * Post upsert
   */
  export type PostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The filter to search for the Post to update in case it exists.
     */
    where: PostWhereUniqueInput
    /**
     * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
     */
    create: XOR<PostCreateInput, PostUncheckedCreateInput>
    /**
     * In case the Post was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostUpdateInput, PostUncheckedUpdateInput>
  }

  /**
   * Post delete
   */
  export type PostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Filter which Post to delete.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post deleteMany
   */
  export type PostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Posts to delete
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to delete.
     */
    limit?: number
  }

  /**
   * Post without action
   */
  export type PostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
  }


  /**
   * Model UserProfile
   */

  export type AggregateUserProfile = {
    _count: UserProfileCountAggregateOutputType | null
    _avg: UserProfileAvgAggregateOutputType | null
    _sum: UserProfileSumAggregateOutputType | null
    _min: UserProfileMinAggregateOutputType | null
    _max: UserProfileMaxAggregateOutputType | null
  }

  export type UserProfileAvgAggregateOutputType = {
    age: number | null
  }

  export type UserProfileSumAggregateOutputType = {
    age: number | null
  }

  export type UserProfileMinAggregateOutputType = {
    id: string | null
    age: number | null
    location: string | null
    locationId: string | null
    gender: string | null
    weeklyDigestEnabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserProfileMaxAggregateOutputType = {
    id: string | null
    age: number | null
    location: string | null
    locationId: string | null
    gender: string | null
    weeklyDigestEnabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserProfileCountAggregateOutputType = {
    id: number
    tags: number
    age: number
    location: number
    locationId: number
    gender: number
    weeklyDigestEnabled: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserProfileAvgAggregateInputType = {
    age?: true
  }

  export type UserProfileSumAggregateInputType = {
    age?: true
  }

  export type UserProfileMinAggregateInputType = {
    id?: true
    age?: true
    location?: true
    locationId?: true
    gender?: true
    weeklyDigestEnabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserProfileMaxAggregateInputType = {
    id?: true
    age?: true
    location?: true
    locationId?: true
    gender?: true
    weeklyDigestEnabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserProfileCountAggregateInputType = {
    id?: true
    tags?: true
    age?: true
    location?: true
    locationId?: true
    gender?: true
    weeklyDigestEnabled?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProfile to aggregate.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserProfiles
    **/
    _count?: true | UserProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserProfileMaxAggregateInputType
  }

  export type GetUserProfileAggregateType<T extends UserProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateUserProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserProfile[P]>
      : GetScalarType<T[P], AggregateUserProfile[P]>
  }




  export type UserProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProfileWhereInput
    orderBy?: UserProfileOrderByWithAggregationInput | UserProfileOrderByWithAggregationInput[]
    by: UserProfileScalarFieldEnum[] | UserProfileScalarFieldEnum
    having?: UserProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserProfileCountAggregateInputType | true
    _avg?: UserProfileAvgAggregateInputType
    _sum?: UserProfileSumAggregateInputType
    _min?: UserProfileMinAggregateInputType
    _max?: UserProfileMaxAggregateInputType
  }

  export type UserProfileGroupByOutputType = {
    id: string
    tags: string[]
    age: number | null
    location: string | null
    locationId: string | null
    gender: string | null
    weeklyDigestEnabled: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserProfileCountAggregateOutputType | null
    _avg: UserProfileAvgAggregateOutputType | null
    _sum: UserProfileSumAggregateOutputType | null
    _min: UserProfileMinAggregateOutputType | null
    _max: UserProfileMaxAggregateOutputType | null
  }

  type GetUserProfileGroupByPayload<T extends UserProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserProfileGroupByOutputType[P]>
            : GetScalarType<T[P], UserProfileGroupByOutputType[P]>
        }
      >
    >


  export type UserProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tags?: boolean
    age?: boolean
    location?: boolean
    locationId?: boolean
    gender?: boolean
    weeklyDigestEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tags?: boolean
    age?: boolean
    location?: boolean
    locationId?: boolean
    gender?: boolean
    weeklyDigestEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tags?: boolean
    age?: boolean
    location?: boolean
    locationId?: boolean
    gender?: boolean
    weeklyDigestEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectScalar = {
    id?: boolean
    tags?: boolean
    age?: boolean
    location?: boolean
    locationId?: boolean
    gender?: boolean
    weeklyDigestEnabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tags" | "age" | "location" | "locationId" | "gender" | "weeklyDigestEnabled" | "createdAt" | "updatedAt", ExtArgs["result"]["userProfile"]>

  export type $UserProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserProfile"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tags: string[]
      age: number | null
      location: string | null
      locationId: string | null
      gender: string | null
      weeklyDigestEnabled: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userProfile"]>
    composites: {}
  }

  type UserProfileGetPayload<S extends boolean | null | undefined | UserProfileDefaultArgs> = $Result.GetResult<Prisma.$UserProfilePayload, S>

  type UserProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserProfileCountAggregateInputType | true
    }

  export interface UserProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserProfile'], meta: { name: 'UserProfile' } }
    /**
     * Find zero or one UserProfile that matches the filter.
     * @param {UserProfileFindUniqueArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserProfileFindUniqueArgs>(args: SelectSubset<T, UserProfileFindUniqueArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserProfileFindUniqueOrThrowArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, UserProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindFirstArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserProfileFindFirstArgs>(args?: SelectSubset<T, UserProfileFindFirstArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindFirstOrThrowArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, UserProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserProfiles
     * const userProfiles = await prisma.userProfile.findMany()
     * 
     * // Get first 10 UserProfiles
     * const userProfiles = await prisma.userProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserProfileFindManyArgs>(args?: SelectSubset<T, UserProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserProfile.
     * @param {UserProfileCreateArgs} args - Arguments to create a UserProfile.
     * @example
     * // Create one UserProfile
     * const UserProfile = await prisma.userProfile.create({
     *   data: {
     *     // ... data to create a UserProfile
     *   }
     * })
     * 
     */
    create<T extends UserProfileCreateArgs>(args: SelectSubset<T, UserProfileCreateArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserProfiles.
     * @param {UserProfileCreateManyArgs} args - Arguments to create many UserProfiles.
     * @example
     * // Create many UserProfiles
     * const userProfile = await prisma.userProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserProfileCreateManyArgs>(args?: SelectSubset<T, UserProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserProfiles and returns the data saved in the database.
     * @param {UserProfileCreateManyAndReturnArgs} args - Arguments to create many UserProfiles.
     * @example
     * // Create many UserProfiles
     * const userProfile = await prisma.userProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserProfiles and only return the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, UserProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserProfile.
     * @param {UserProfileDeleteArgs} args - Arguments to delete one UserProfile.
     * @example
     * // Delete one UserProfile
     * const UserProfile = await prisma.userProfile.delete({
     *   where: {
     *     // ... filter to delete one UserProfile
     *   }
     * })
     * 
     */
    delete<T extends UserProfileDeleteArgs>(args: SelectSubset<T, UserProfileDeleteArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserProfile.
     * @param {UserProfileUpdateArgs} args - Arguments to update one UserProfile.
     * @example
     * // Update one UserProfile
     * const userProfile = await prisma.userProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserProfileUpdateArgs>(args: SelectSubset<T, UserProfileUpdateArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserProfiles.
     * @param {UserProfileDeleteManyArgs} args - Arguments to filter UserProfiles to delete.
     * @example
     * // Delete a few UserProfiles
     * const { count } = await prisma.userProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserProfileDeleteManyArgs>(args?: SelectSubset<T, UserProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserProfiles
     * const userProfile = await prisma.userProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserProfileUpdateManyArgs>(args: SelectSubset<T, UserProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProfiles and returns the data updated in the database.
     * @param {UserProfileUpdateManyAndReturnArgs} args - Arguments to update many UserProfiles.
     * @example
     * // Update many UserProfiles
     * const userProfile = await prisma.userProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserProfiles and only return the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, UserProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserProfile.
     * @param {UserProfileUpsertArgs} args - Arguments to update or create a UserProfile.
     * @example
     * // Update or create a UserProfile
     * const userProfile = await prisma.userProfile.upsert({
     *   create: {
     *     // ... data to create a UserProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserProfile we want to update
     *   }
     * })
     */
    upsert<T extends UserProfileUpsertArgs>(args: SelectSubset<T, UserProfileUpsertArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileCountArgs} args - Arguments to filter UserProfiles to count.
     * @example
     * // Count the number of UserProfiles
     * const count = await prisma.userProfile.count({
     *   where: {
     *     // ... the filter for the UserProfiles we want to count
     *   }
     * })
    **/
    count<T extends UserProfileCountArgs>(
      args?: Subset<T, UserProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserProfileAggregateArgs>(args: Subset<T, UserProfileAggregateArgs>): Prisma.PrismaPromise<GetUserProfileAggregateType<T>>

    /**
     * Group by UserProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserProfileGroupByArgs['orderBy'] }
        : { orderBy?: UserProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserProfile model
   */
  readonly fields: UserProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserProfile model
   */
  interface UserProfileFieldRefs {
    readonly id: FieldRef<"UserProfile", 'String'>
    readonly tags: FieldRef<"UserProfile", 'String[]'>
    readonly age: FieldRef<"UserProfile", 'Int'>
    readonly location: FieldRef<"UserProfile", 'String'>
    readonly locationId: FieldRef<"UserProfile", 'String'>
    readonly gender: FieldRef<"UserProfile", 'String'>
    readonly weeklyDigestEnabled: FieldRef<"UserProfile", 'Boolean'>
    readonly createdAt: FieldRef<"UserProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"UserProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserProfile findUnique
   */
  export type UserProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile findUniqueOrThrow
   */
  export type UserProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile findFirst
   */
  export type UserProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile findFirstOrThrow
   */
  export type UserProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile findMany
   */
  export type UserProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Filter, which UserProfiles to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile create
   */
  export type UserProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * The data needed to create a UserProfile.
     */
    data: XOR<UserProfileCreateInput, UserProfileUncheckedCreateInput>
  }

  /**
   * UserProfile createMany
   */
  export type UserProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserProfiles.
     */
    data: UserProfileCreateManyInput | UserProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProfile createManyAndReturn
   */
  export type UserProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * The data used to create many UserProfiles.
     */
    data: UserProfileCreateManyInput | UserProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProfile update
   */
  export type UserProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * The data needed to update a UserProfile.
     */
    data: XOR<UserProfileUpdateInput, UserProfileUncheckedUpdateInput>
    /**
     * Choose, which UserProfile to update.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile updateMany
   */
  export type UserProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserProfiles.
     */
    data: XOR<UserProfileUpdateManyMutationInput, UserProfileUncheckedUpdateManyInput>
    /**
     * Filter which UserProfiles to update
     */
    where?: UserProfileWhereInput
    /**
     * Limit how many UserProfiles to update.
     */
    limit?: number
  }

  /**
   * UserProfile updateManyAndReturn
   */
  export type UserProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * The data used to update UserProfiles.
     */
    data: XOR<UserProfileUpdateManyMutationInput, UserProfileUncheckedUpdateManyInput>
    /**
     * Filter which UserProfiles to update
     */
    where?: UserProfileWhereInput
    /**
     * Limit how many UserProfiles to update.
     */
    limit?: number
  }

  /**
   * UserProfile upsert
   */
  export type UserProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * The filter to search for the UserProfile to update in case it exists.
     */
    where: UserProfileWhereUniqueInput
    /**
     * In case the UserProfile found by the `where` argument doesn't exist, create a new UserProfile with this data.
     */
    create: XOR<UserProfileCreateInput, UserProfileUncheckedCreateInput>
    /**
     * In case the UserProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserProfileUpdateInput, UserProfileUncheckedUpdateInput>
  }

  /**
   * UserProfile delete
   */
  export type UserProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Filter which UserProfile to delete.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile deleteMany
   */
  export type UserProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProfiles to delete
     */
    where?: UserProfileWhereInput
    /**
     * Limit how many UserProfiles to delete.
     */
    limit?: number
  }

  /**
   * UserProfile without action
   */
  export type UserProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
  }


  /**
   * Model Municipality
   */

  export type AggregateMunicipality = {
    _count: MunicipalityCountAggregateOutputType | null
    _min: MunicipalityMinAggregateOutputType | null
    _max: MunicipalityMaxAggregateOutputType | null
  }

  export type MunicipalityMinAggregateOutputType = {
    id: string | null
    key: string | null
    city: string | null
    state: string | null
    label: string | null
  }

  export type MunicipalityMaxAggregateOutputType = {
    id: string | null
    key: string | null
    city: string | null
    state: string | null
    label: string | null
  }

  export type MunicipalityCountAggregateOutputType = {
    id: number
    key: number
    city: number
    state: number
    label: number
    _all: number
  }


  export type MunicipalityMinAggregateInputType = {
    id?: true
    key?: true
    city?: true
    state?: true
    label?: true
  }

  export type MunicipalityMaxAggregateInputType = {
    id?: true
    key?: true
    city?: true
    state?: true
    label?: true
  }

  export type MunicipalityCountAggregateInputType = {
    id?: true
    key?: true
    city?: true
    state?: true
    label?: true
    _all?: true
  }

  export type MunicipalityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Municipality to aggregate.
     */
    where?: MunicipalityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Municipalities to fetch.
     */
    orderBy?: MunicipalityOrderByWithRelationInput | MunicipalityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MunicipalityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Municipalities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Municipalities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Municipalities
    **/
    _count?: true | MunicipalityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MunicipalityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MunicipalityMaxAggregateInputType
  }

  export type GetMunicipalityAggregateType<T extends MunicipalityAggregateArgs> = {
        [P in keyof T & keyof AggregateMunicipality]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMunicipality[P]>
      : GetScalarType<T[P], AggregateMunicipality[P]>
  }




  export type MunicipalityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MunicipalityWhereInput
    orderBy?: MunicipalityOrderByWithAggregationInput | MunicipalityOrderByWithAggregationInput[]
    by: MunicipalityScalarFieldEnum[] | MunicipalityScalarFieldEnum
    having?: MunicipalityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MunicipalityCountAggregateInputType | true
    _min?: MunicipalityMinAggregateInputType
    _max?: MunicipalityMaxAggregateInputType
  }

  export type MunicipalityGroupByOutputType = {
    id: string
    key: string
    city: string
    state: string
    label: string
    _count: MunicipalityCountAggregateOutputType | null
    _min: MunicipalityMinAggregateOutputType | null
    _max: MunicipalityMaxAggregateOutputType | null
  }

  type GetMunicipalityGroupByPayload<T extends MunicipalityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MunicipalityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MunicipalityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MunicipalityGroupByOutputType[P]>
            : GetScalarType<T[P], MunicipalityGroupByOutputType[P]>
        }
      >
    >


  export type MunicipalitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    city?: boolean
    state?: boolean
    label?: boolean
    ordinances?: boolean | Municipality$ordinancesArgs<ExtArgs>
    _count?: boolean | MunicipalityCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["municipality"]>

  export type MunicipalitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    city?: boolean
    state?: boolean
    label?: boolean
  }, ExtArgs["result"]["municipality"]>

  export type MunicipalitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    city?: boolean
    state?: boolean
    label?: boolean
  }, ExtArgs["result"]["municipality"]>

  export type MunicipalitySelectScalar = {
    id?: boolean
    key?: boolean
    city?: boolean
    state?: boolean
    label?: boolean
  }

  export type MunicipalityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "key" | "city" | "state" | "label", ExtArgs["result"]["municipality"]>
  export type MunicipalityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ordinances?: boolean | Municipality$ordinancesArgs<ExtArgs>
    _count?: boolean | MunicipalityCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MunicipalityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MunicipalityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MunicipalityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Municipality"
    objects: {
      ordinances: Prisma.$OrdinancePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      key: string
      city: string
      state: string
      label: string
    }, ExtArgs["result"]["municipality"]>
    composites: {}
  }

  type MunicipalityGetPayload<S extends boolean | null | undefined | MunicipalityDefaultArgs> = $Result.GetResult<Prisma.$MunicipalityPayload, S>

  type MunicipalityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MunicipalityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MunicipalityCountAggregateInputType | true
    }

  export interface MunicipalityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Municipality'], meta: { name: 'Municipality' } }
    /**
     * Find zero or one Municipality that matches the filter.
     * @param {MunicipalityFindUniqueArgs} args - Arguments to find a Municipality
     * @example
     * // Get one Municipality
     * const municipality = await prisma.municipality.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MunicipalityFindUniqueArgs>(args: SelectSubset<T, MunicipalityFindUniqueArgs<ExtArgs>>): Prisma__MunicipalityClient<$Result.GetResult<Prisma.$MunicipalityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Municipality that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MunicipalityFindUniqueOrThrowArgs} args - Arguments to find a Municipality
     * @example
     * // Get one Municipality
     * const municipality = await prisma.municipality.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MunicipalityFindUniqueOrThrowArgs>(args: SelectSubset<T, MunicipalityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MunicipalityClient<$Result.GetResult<Prisma.$MunicipalityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Municipality that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MunicipalityFindFirstArgs} args - Arguments to find a Municipality
     * @example
     * // Get one Municipality
     * const municipality = await prisma.municipality.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MunicipalityFindFirstArgs>(args?: SelectSubset<T, MunicipalityFindFirstArgs<ExtArgs>>): Prisma__MunicipalityClient<$Result.GetResult<Prisma.$MunicipalityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Municipality that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MunicipalityFindFirstOrThrowArgs} args - Arguments to find a Municipality
     * @example
     * // Get one Municipality
     * const municipality = await prisma.municipality.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MunicipalityFindFirstOrThrowArgs>(args?: SelectSubset<T, MunicipalityFindFirstOrThrowArgs<ExtArgs>>): Prisma__MunicipalityClient<$Result.GetResult<Prisma.$MunicipalityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Municipalities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MunicipalityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Municipalities
     * const municipalities = await prisma.municipality.findMany()
     * 
     * // Get first 10 Municipalities
     * const municipalities = await prisma.municipality.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const municipalityWithIdOnly = await prisma.municipality.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MunicipalityFindManyArgs>(args?: SelectSubset<T, MunicipalityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MunicipalityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Municipality.
     * @param {MunicipalityCreateArgs} args - Arguments to create a Municipality.
     * @example
     * // Create one Municipality
     * const Municipality = await prisma.municipality.create({
     *   data: {
     *     // ... data to create a Municipality
     *   }
     * })
     * 
     */
    create<T extends MunicipalityCreateArgs>(args: SelectSubset<T, MunicipalityCreateArgs<ExtArgs>>): Prisma__MunicipalityClient<$Result.GetResult<Prisma.$MunicipalityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Municipalities.
     * @param {MunicipalityCreateManyArgs} args - Arguments to create many Municipalities.
     * @example
     * // Create many Municipalities
     * const municipality = await prisma.municipality.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MunicipalityCreateManyArgs>(args?: SelectSubset<T, MunicipalityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Municipalities and returns the data saved in the database.
     * @param {MunicipalityCreateManyAndReturnArgs} args - Arguments to create many Municipalities.
     * @example
     * // Create many Municipalities
     * const municipality = await prisma.municipality.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Municipalities and only return the `id`
     * const municipalityWithIdOnly = await prisma.municipality.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MunicipalityCreateManyAndReturnArgs>(args?: SelectSubset<T, MunicipalityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MunicipalityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Municipality.
     * @param {MunicipalityDeleteArgs} args - Arguments to delete one Municipality.
     * @example
     * // Delete one Municipality
     * const Municipality = await prisma.municipality.delete({
     *   where: {
     *     // ... filter to delete one Municipality
     *   }
     * })
     * 
     */
    delete<T extends MunicipalityDeleteArgs>(args: SelectSubset<T, MunicipalityDeleteArgs<ExtArgs>>): Prisma__MunicipalityClient<$Result.GetResult<Prisma.$MunicipalityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Municipality.
     * @param {MunicipalityUpdateArgs} args - Arguments to update one Municipality.
     * @example
     * // Update one Municipality
     * const municipality = await prisma.municipality.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MunicipalityUpdateArgs>(args: SelectSubset<T, MunicipalityUpdateArgs<ExtArgs>>): Prisma__MunicipalityClient<$Result.GetResult<Prisma.$MunicipalityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Municipalities.
     * @param {MunicipalityDeleteManyArgs} args - Arguments to filter Municipalities to delete.
     * @example
     * // Delete a few Municipalities
     * const { count } = await prisma.municipality.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MunicipalityDeleteManyArgs>(args?: SelectSubset<T, MunicipalityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Municipalities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MunicipalityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Municipalities
     * const municipality = await prisma.municipality.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MunicipalityUpdateManyArgs>(args: SelectSubset<T, MunicipalityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Municipalities and returns the data updated in the database.
     * @param {MunicipalityUpdateManyAndReturnArgs} args - Arguments to update many Municipalities.
     * @example
     * // Update many Municipalities
     * const municipality = await prisma.municipality.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Municipalities and only return the `id`
     * const municipalityWithIdOnly = await prisma.municipality.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MunicipalityUpdateManyAndReturnArgs>(args: SelectSubset<T, MunicipalityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MunicipalityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Municipality.
     * @param {MunicipalityUpsertArgs} args - Arguments to update or create a Municipality.
     * @example
     * // Update or create a Municipality
     * const municipality = await prisma.municipality.upsert({
     *   create: {
     *     // ... data to create a Municipality
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Municipality we want to update
     *   }
     * })
     */
    upsert<T extends MunicipalityUpsertArgs>(args: SelectSubset<T, MunicipalityUpsertArgs<ExtArgs>>): Prisma__MunicipalityClient<$Result.GetResult<Prisma.$MunicipalityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Municipalities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MunicipalityCountArgs} args - Arguments to filter Municipalities to count.
     * @example
     * // Count the number of Municipalities
     * const count = await prisma.municipality.count({
     *   where: {
     *     // ... the filter for the Municipalities we want to count
     *   }
     * })
    **/
    count<T extends MunicipalityCountArgs>(
      args?: Subset<T, MunicipalityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MunicipalityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Municipality.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MunicipalityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MunicipalityAggregateArgs>(args: Subset<T, MunicipalityAggregateArgs>): Prisma.PrismaPromise<GetMunicipalityAggregateType<T>>

    /**
     * Group by Municipality.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MunicipalityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MunicipalityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MunicipalityGroupByArgs['orderBy'] }
        : { orderBy?: MunicipalityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MunicipalityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMunicipalityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Municipality model
   */
  readonly fields: MunicipalityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Municipality.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MunicipalityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ordinances<T extends Municipality$ordinancesArgs<ExtArgs> = {}>(args?: Subset<T, Municipality$ordinancesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdinancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Municipality model
   */
  interface MunicipalityFieldRefs {
    readonly id: FieldRef<"Municipality", 'String'>
    readonly key: FieldRef<"Municipality", 'String'>
    readonly city: FieldRef<"Municipality", 'String'>
    readonly state: FieldRef<"Municipality", 'String'>
    readonly label: FieldRef<"Municipality", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Municipality findUnique
   */
  export type MunicipalityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipality
     */
    select?: MunicipalitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Municipality
     */
    omit?: MunicipalityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MunicipalityInclude<ExtArgs> | null
    /**
     * Filter, which Municipality to fetch.
     */
    where: MunicipalityWhereUniqueInput
  }

  /**
   * Municipality findUniqueOrThrow
   */
  export type MunicipalityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipality
     */
    select?: MunicipalitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Municipality
     */
    omit?: MunicipalityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MunicipalityInclude<ExtArgs> | null
    /**
     * Filter, which Municipality to fetch.
     */
    where: MunicipalityWhereUniqueInput
  }

  /**
   * Municipality findFirst
   */
  export type MunicipalityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipality
     */
    select?: MunicipalitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Municipality
     */
    omit?: MunicipalityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MunicipalityInclude<ExtArgs> | null
    /**
     * Filter, which Municipality to fetch.
     */
    where?: MunicipalityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Municipalities to fetch.
     */
    orderBy?: MunicipalityOrderByWithRelationInput | MunicipalityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Municipalities.
     */
    cursor?: MunicipalityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Municipalities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Municipalities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Municipalities.
     */
    distinct?: MunicipalityScalarFieldEnum | MunicipalityScalarFieldEnum[]
  }

  /**
   * Municipality findFirstOrThrow
   */
  export type MunicipalityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipality
     */
    select?: MunicipalitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Municipality
     */
    omit?: MunicipalityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MunicipalityInclude<ExtArgs> | null
    /**
     * Filter, which Municipality to fetch.
     */
    where?: MunicipalityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Municipalities to fetch.
     */
    orderBy?: MunicipalityOrderByWithRelationInput | MunicipalityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Municipalities.
     */
    cursor?: MunicipalityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Municipalities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Municipalities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Municipalities.
     */
    distinct?: MunicipalityScalarFieldEnum | MunicipalityScalarFieldEnum[]
  }

  /**
   * Municipality findMany
   */
  export type MunicipalityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipality
     */
    select?: MunicipalitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Municipality
     */
    omit?: MunicipalityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MunicipalityInclude<ExtArgs> | null
    /**
     * Filter, which Municipalities to fetch.
     */
    where?: MunicipalityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Municipalities to fetch.
     */
    orderBy?: MunicipalityOrderByWithRelationInput | MunicipalityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Municipalities.
     */
    cursor?: MunicipalityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Municipalities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Municipalities.
     */
    skip?: number
    distinct?: MunicipalityScalarFieldEnum | MunicipalityScalarFieldEnum[]
  }

  /**
   * Municipality create
   */
  export type MunicipalityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipality
     */
    select?: MunicipalitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Municipality
     */
    omit?: MunicipalityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MunicipalityInclude<ExtArgs> | null
    /**
     * The data needed to create a Municipality.
     */
    data: XOR<MunicipalityCreateInput, MunicipalityUncheckedCreateInput>
  }

  /**
   * Municipality createMany
   */
  export type MunicipalityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Municipalities.
     */
    data: MunicipalityCreateManyInput | MunicipalityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Municipality createManyAndReturn
   */
  export type MunicipalityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipality
     */
    select?: MunicipalitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Municipality
     */
    omit?: MunicipalityOmit<ExtArgs> | null
    /**
     * The data used to create many Municipalities.
     */
    data: MunicipalityCreateManyInput | MunicipalityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Municipality update
   */
  export type MunicipalityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipality
     */
    select?: MunicipalitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Municipality
     */
    omit?: MunicipalityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MunicipalityInclude<ExtArgs> | null
    /**
     * The data needed to update a Municipality.
     */
    data: XOR<MunicipalityUpdateInput, MunicipalityUncheckedUpdateInput>
    /**
     * Choose, which Municipality to update.
     */
    where: MunicipalityWhereUniqueInput
  }

  /**
   * Municipality updateMany
   */
  export type MunicipalityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Municipalities.
     */
    data: XOR<MunicipalityUpdateManyMutationInput, MunicipalityUncheckedUpdateManyInput>
    /**
     * Filter which Municipalities to update
     */
    where?: MunicipalityWhereInput
    /**
     * Limit how many Municipalities to update.
     */
    limit?: number
  }

  /**
   * Municipality updateManyAndReturn
   */
  export type MunicipalityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipality
     */
    select?: MunicipalitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Municipality
     */
    omit?: MunicipalityOmit<ExtArgs> | null
    /**
     * The data used to update Municipalities.
     */
    data: XOR<MunicipalityUpdateManyMutationInput, MunicipalityUncheckedUpdateManyInput>
    /**
     * Filter which Municipalities to update
     */
    where?: MunicipalityWhereInput
    /**
     * Limit how many Municipalities to update.
     */
    limit?: number
  }

  /**
   * Municipality upsert
   */
  export type MunicipalityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipality
     */
    select?: MunicipalitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Municipality
     */
    omit?: MunicipalityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MunicipalityInclude<ExtArgs> | null
    /**
     * The filter to search for the Municipality to update in case it exists.
     */
    where: MunicipalityWhereUniqueInput
    /**
     * In case the Municipality found by the `where` argument doesn't exist, create a new Municipality with this data.
     */
    create: XOR<MunicipalityCreateInput, MunicipalityUncheckedCreateInput>
    /**
     * In case the Municipality was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MunicipalityUpdateInput, MunicipalityUncheckedUpdateInput>
  }

  /**
   * Municipality delete
   */
  export type MunicipalityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipality
     */
    select?: MunicipalitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Municipality
     */
    omit?: MunicipalityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MunicipalityInclude<ExtArgs> | null
    /**
     * Filter which Municipality to delete.
     */
    where: MunicipalityWhereUniqueInput
  }

  /**
   * Municipality deleteMany
   */
  export type MunicipalityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Municipalities to delete
     */
    where?: MunicipalityWhereInput
    /**
     * Limit how many Municipalities to delete.
     */
    limit?: number
  }

  /**
   * Municipality.ordinances
   */
  export type Municipality$ordinancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ordinance
     */
    select?: OrdinanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ordinance
     */
    omit?: OrdinanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceInclude<ExtArgs> | null
    where?: OrdinanceWhereInput
    orderBy?: OrdinanceOrderByWithRelationInput | OrdinanceOrderByWithRelationInput[]
    cursor?: OrdinanceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrdinanceScalarFieldEnum | OrdinanceScalarFieldEnum[]
  }

  /**
   * Municipality without action
   */
  export type MunicipalityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Municipality
     */
    select?: MunicipalitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Municipality
     */
    omit?: MunicipalityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MunicipalityInclude<ExtArgs> | null
  }


  /**
   * Model IngestionRun
   */

  export type AggregateIngestionRun = {
    _count: IngestionRunCountAggregateOutputType | null
    _avg: IngestionRunAvgAggregateOutputType | null
    _sum: IngestionRunSumAggregateOutputType | null
    _min: IngestionRunMinAggregateOutputType | null
    _max: IngestionRunMaxAggregateOutputType | null
  }

  export type IngestionRunAvgAggregateOutputType = {
    skippedCount: number | null
    creditsUsed: number | null
    rejectedCount: number | null
  }

  export type IngestionRunSumAggregateOutputType = {
    skippedCount: number | null
    creditsUsed: number | null
    rejectedCount: number | null
  }

  export type IngestionRunMinAggregateOutputType = {
    id: string | null
    windowStart: Date | null
    windowEnd: Date | null
    skippedCount: number | null
    status: string | null
    providerJobId: string | null
    creditsUsed: number | null
    rejectedCount: number | null
    failureCode: string | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type IngestionRunMaxAggregateOutputType = {
    id: string | null
    windowStart: Date | null
    windowEnd: Date | null
    skippedCount: number | null
    status: string | null
    providerJobId: string | null
    creditsUsed: number | null
    rejectedCount: number | null
    failureCode: string | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type IngestionRunCountAggregateOutputType = {
    id: number
    windowStart: number
    windowEnd: number
    cities: number
    skippedCount: number
    status: number
    providerJobId: number
    coverage: number
    creditsUsed: number
    rejectedCount: number
    failureCode: number
    createdAt: number
    completedAt: number
    _all: number
  }


  export type IngestionRunAvgAggregateInputType = {
    skippedCount?: true
    creditsUsed?: true
    rejectedCount?: true
  }

  export type IngestionRunSumAggregateInputType = {
    skippedCount?: true
    creditsUsed?: true
    rejectedCount?: true
  }

  export type IngestionRunMinAggregateInputType = {
    id?: true
    windowStart?: true
    windowEnd?: true
    skippedCount?: true
    status?: true
    providerJobId?: true
    creditsUsed?: true
    rejectedCount?: true
    failureCode?: true
    createdAt?: true
    completedAt?: true
  }

  export type IngestionRunMaxAggregateInputType = {
    id?: true
    windowStart?: true
    windowEnd?: true
    skippedCount?: true
    status?: true
    providerJobId?: true
    creditsUsed?: true
    rejectedCount?: true
    failureCode?: true
    createdAt?: true
    completedAt?: true
  }

  export type IngestionRunCountAggregateInputType = {
    id?: true
    windowStart?: true
    windowEnd?: true
    cities?: true
    skippedCount?: true
    status?: true
    providerJobId?: true
    coverage?: true
    creditsUsed?: true
    rejectedCount?: true
    failureCode?: true
    createdAt?: true
    completedAt?: true
    _all?: true
  }

  export type IngestionRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IngestionRun to aggregate.
     */
    where?: IngestionRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IngestionRuns to fetch.
     */
    orderBy?: IngestionRunOrderByWithRelationInput | IngestionRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IngestionRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IngestionRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IngestionRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IngestionRuns
    **/
    _count?: true | IngestionRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IngestionRunAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IngestionRunSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IngestionRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IngestionRunMaxAggregateInputType
  }

  export type GetIngestionRunAggregateType<T extends IngestionRunAggregateArgs> = {
        [P in keyof T & keyof AggregateIngestionRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIngestionRun[P]>
      : GetScalarType<T[P], AggregateIngestionRun[P]>
  }




  export type IngestionRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IngestionRunWhereInput
    orderBy?: IngestionRunOrderByWithAggregationInput | IngestionRunOrderByWithAggregationInput[]
    by: IngestionRunScalarFieldEnum[] | IngestionRunScalarFieldEnum
    having?: IngestionRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IngestionRunCountAggregateInputType | true
    _avg?: IngestionRunAvgAggregateInputType
    _sum?: IngestionRunSumAggregateInputType
    _min?: IngestionRunMinAggregateInputType
    _max?: IngestionRunMaxAggregateInputType
  }

  export type IngestionRunGroupByOutputType = {
    id: string
    windowStart: Date
    windowEnd: Date
    cities: JsonValue
    skippedCount: number
    status: string
    providerJobId: string | null
    coverage: JsonValue | null
    creditsUsed: number | null
    rejectedCount: number
    failureCode: string | null
    createdAt: Date
    completedAt: Date | null
    _count: IngestionRunCountAggregateOutputType | null
    _avg: IngestionRunAvgAggregateOutputType | null
    _sum: IngestionRunSumAggregateOutputType | null
    _min: IngestionRunMinAggregateOutputType | null
    _max: IngestionRunMaxAggregateOutputType | null
  }

  type GetIngestionRunGroupByPayload<T extends IngestionRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IngestionRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IngestionRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IngestionRunGroupByOutputType[P]>
            : GetScalarType<T[P], IngestionRunGroupByOutputType[P]>
        }
      >
    >


  export type IngestionRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    windowStart?: boolean
    windowEnd?: boolean
    cities?: boolean
    skippedCount?: boolean
    status?: boolean
    providerJobId?: boolean
    coverage?: boolean
    creditsUsed?: boolean
    rejectedCount?: boolean
    failureCode?: boolean
    createdAt?: boolean
    completedAt?: boolean
    changes?: boolean | IngestionRun$changesArgs<ExtArgs>
    _count?: boolean | IngestionRunCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ingestionRun"]>

  export type IngestionRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    windowStart?: boolean
    windowEnd?: boolean
    cities?: boolean
    skippedCount?: boolean
    status?: boolean
    providerJobId?: boolean
    coverage?: boolean
    creditsUsed?: boolean
    rejectedCount?: boolean
    failureCode?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["ingestionRun"]>

  export type IngestionRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    windowStart?: boolean
    windowEnd?: boolean
    cities?: boolean
    skippedCount?: boolean
    status?: boolean
    providerJobId?: boolean
    coverage?: boolean
    creditsUsed?: boolean
    rejectedCount?: boolean
    failureCode?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["ingestionRun"]>

  export type IngestionRunSelectScalar = {
    id?: boolean
    windowStart?: boolean
    windowEnd?: boolean
    cities?: boolean
    skippedCount?: boolean
    status?: boolean
    providerJobId?: boolean
    coverage?: boolean
    creditsUsed?: boolean
    rejectedCount?: boolean
    failureCode?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }

  export type IngestionRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "windowStart" | "windowEnd" | "cities" | "skippedCount" | "status" | "providerJobId" | "coverage" | "creditsUsed" | "rejectedCount" | "failureCode" | "createdAt" | "completedAt", ExtArgs["result"]["ingestionRun"]>
  export type IngestionRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    changes?: boolean | IngestionRun$changesArgs<ExtArgs>
    _count?: boolean | IngestionRunCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type IngestionRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type IngestionRunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $IngestionRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IngestionRun"
    objects: {
      changes: Prisma.$OrdinanceChangePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      windowStart: Date
      windowEnd: Date
      cities: Prisma.JsonValue
      skippedCount: number
      status: string
      providerJobId: string | null
      coverage: Prisma.JsonValue | null
      creditsUsed: number | null
      rejectedCount: number
      failureCode: string | null
      createdAt: Date
      completedAt: Date | null
    }, ExtArgs["result"]["ingestionRun"]>
    composites: {}
  }

  type IngestionRunGetPayload<S extends boolean | null | undefined | IngestionRunDefaultArgs> = $Result.GetResult<Prisma.$IngestionRunPayload, S>

  type IngestionRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IngestionRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IngestionRunCountAggregateInputType | true
    }

  export interface IngestionRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IngestionRun'], meta: { name: 'IngestionRun' } }
    /**
     * Find zero or one IngestionRun that matches the filter.
     * @param {IngestionRunFindUniqueArgs} args - Arguments to find a IngestionRun
     * @example
     * // Get one IngestionRun
     * const ingestionRun = await prisma.ingestionRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IngestionRunFindUniqueArgs>(args: SelectSubset<T, IngestionRunFindUniqueArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one IngestionRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IngestionRunFindUniqueOrThrowArgs} args - Arguments to find a IngestionRun
     * @example
     * // Get one IngestionRun
     * const ingestionRun = await prisma.ingestionRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IngestionRunFindUniqueOrThrowArgs>(args: SelectSubset<T, IngestionRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IngestionRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionRunFindFirstArgs} args - Arguments to find a IngestionRun
     * @example
     * // Get one IngestionRun
     * const ingestionRun = await prisma.ingestionRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IngestionRunFindFirstArgs>(args?: SelectSubset<T, IngestionRunFindFirstArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IngestionRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionRunFindFirstOrThrowArgs} args - Arguments to find a IngestionRun
     * @example
     * // Get one IngestionRun
     * const ingestionRun = await prisma.ingestionRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IngestionRunFindFirstOrThrowArgs>(args?: SelectSubset<T, IngestionRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more IngestionRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IngestionRuns
     * const ingestionRuns = await prisma.ingestionRun.findMany()
     * 
     * // Get first 10 IngestionRuns
     * const ingestionRuns = await prisma.ingestionRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ingestionRunWithIdOnly = await prisma.ingestionRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IngestionRunFindManyArgs>(args?: SelectSubset<T, IngestionRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a IngestionRun.
     * @param {IngestionRunCreateArgs} args - Arguments to create a IngestionRun.
     * @example
     * // Create one IngestionRun
     * const IngestionRun = await prisma.ingestionRun.create({
     *   data: {
     *     // ... data to create a IngestionRun
     *   }
     * })
     * 
     */
    create<T extends IngestionRunCreateArgs>(args: SelectSubset<T, IngestionRunCreateArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many IngestionRuns.
     * @param {IngestionRunCreateManyArgs} args - Arguments to create many IngestionRuns.
     * @example
     * // Create many IngestionRuns
     * const ingestionRun = await prisma.ingestionRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IngestionRunCreateManyArgs>(args?: SelectSubset<T, IngestionRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IngestionRuns and returns the data saved in the database.
     * @param {IngestionRunCreateManyAndReturnArgs} args - Arguments to create many IngestionRuns.
     * @example
     * // Create many IngestionRuns
     * const ingestionRun = await prisma.ingestionRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IngestionRuns and only return the `id`
     * const ingestionRunWithIdOnly = await prisma.ingestionRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IngestionRunCreateManyAndReturnArgs>(args?: SelectSubset<T, IngestionRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a IngestionRun.
     * @param {IngestionRunDeleteArgs} args - Arguments to delete one IngestionRun.
     * @example
     * // Delete one IngestionRun
     * const IngestionRun = await prisma.ingestionRun.delete({
     *   where: {
     *     // ... filter to delete one IngestionRun
     *   }
     * })
     * 
     */
    delete<T extends IngestionRunDeleteArgs>(args: SelectSubset<T, IngestionRunDeleteArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one IngestionRun.
     * @param {IngestionRunUpdateArgs} args - Arguments to update one IngestionRun.
     * @example
     * // Update one IngestionRun
     * const ingestionRun = await prisma.ingestionRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IngestionRunUpdateArgs>(args: SelectSubset<T, IngestionRunUpdateArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more IngestionRuns.
     * @param {IngestionRunDeleteManyArgs} args - Arguments to filter IngestionRuns to delete.
     * @example
     * // Delete a few IngestionRuns
     * const { count } = await prisma.ingestionRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IngestionRunDeleteManyArgs>(args?: SelectSubset<T, IngestionRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IngestionRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IngestionRuns
     * const ingestionRun = await prisma.ingestionRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IngestionRunUpdateManyArgs>(args: SelectSubset<T, IngestionRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IngestionRuns and returns the data updated in the database.
     * @param {IngestionRunUpdateManyAndReturnArgs} args - Arguments to update many IngestionRuns.
     * @example
     * // Update many IngestionRuns
     * const ingestionRun = await prisma.ingestionRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more IngestionRuns and only return the `id`
     * const ingestionRunWithIdOnly = await prisma.ingestionRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IngestionRunUpdateManyAndReturnArgs>(args: SelectSubset<T, IngestionRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one IngestionRun.
     * @param {IngestionRunUpsertArgs} args - Arguments to update or create a IngestionRun.
     * @example
     * // Update or create a IngestionRun
     * const ingestionRun = await prisma.ingestionRun.upsert({
     *   create: {
     *     // ... data to create a IngestionRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IngestionRun we want to update
     *   }
     * })
     */
    upsert<T extends IngestionRunUpsertArgs>(args: SelectSubset<T, IngestionRunUpsertArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of IngestionRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionRunCountArgs} args - Arguments to filter IngestionRuns to count.
     * @example
     * // Count the number of IngestionRuns
     * const count = await prisma.ingestionRun.count({
     *   where: {
     *     // ... the filter for the IngestionRuns we want to count
     *   }
     * })
    **/
    count<T extends IngestionRunCountArgs>(
      args?: Subset<T, IngestionRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IngestionRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IngestionRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IngestionRunAggregateArgs>(args: Subset<T, IngestionRunAggregateArgs>): Prisma.PrismaPromise<GetIngestionRunAggregateType<T>>

    /**
     * Group by IngestionRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IngestionRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IngestionRunGroupByArgs['orderBy'] }
        : { orderBy?: IngestionRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IngestionRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIngestionRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IngestionRun model
   */
  readonly fields: IngestionRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IngestionRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IngestionRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    changes<T extends IngestionRun$changesArgs<ExtArgs> = {}>(args?: Subset<T, IngestionRun$changesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdinanceChangePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the IngestionRun model
   */
  interface IngestionRunFieldRefs {
    readonly id: FieldRef<"IngestionRun", 'String'>
    readonly windowStart: FieldRef<"IngestionRun", 'DateTime'>
    readonly windowEnd: FieldRef<"IngestionRun", 'DateTime'>
    readonly cities: FieldRef<"IngestionRun", 'Json'>
    readonly skippedCount: FieldRef<"IngestionRun", 'Int'>
    readonly status: FieldRef<"IngestionRun", 'String'>
    readonly providerJobId: FieldRef<"IngestionRun", 'String'>
    readonly coverage: FieldRef<"IngestionRun", 'Json'>
    readonly creditsUsed: FieldRef<"IngestionRun", 'Float'>
    readonly rejectedCount: FieldRef<"IngestionRun", 'Int'>
    readonly failureCode: FieldRef<"IngestionRun", 'String'>
    readonly createdAt: FieldRef<"IngestionRun", 'DateTime'>
    readonly completedAt: FieldRef<"IngestionRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * IngestionRun findUnique
   */
  export type IngestionRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestionRunInclude<ExtArgs> | null
    /**
     * Filter, which IngestionRun to fetch.
     */
    where: IngestionRunWhereUniqueInput
  }

  /**
   * IngestionRun findUniqueOrThrow
   */
  export type IngestionRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestionRunInclude<ExtArgs> | null
    /**
     * Filter, which IngestionRun to fetch.
     */
    where: IngestionRunWhereUniqueInput
  }

  /**
   * IngestionRun findFirst
   */
  export type IngestionRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestionRunInclude<ExtArgs> | null
    /**
     * Filter, which IngestionRun to fetch.
     */
    where?: IngestionRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IngestionRuns to fetch.
     */
    orderBy?: IngestionRunOrderByWithRelationInput | IngestionRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IngestionRuns.
     */
    cursor?: IngestionRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IngestionRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IngestionRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IngestionRuns.
     */
    distinct?: IngestionRunScalarFieldEnum | IngestionRunScalarFieldEnum[]
  }

  /**
   * IngestionRun findFirstOrThrow
   */
  export type IngestionRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestionRunInclude<ExtArgs> | null
    /**
     * Filter, which IngestionRun to fetch.
     */
    where?: IngestionRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IngestionRuns to fetch.
     */
    orderBy?: IngestionRunOrderByWithRelationInput | IngestionRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IngestionRuns.
     */
    cursor?: IngestionRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IngestionRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IngestionRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IngestionRuns.
     */
    distinct?: IngestionRunScalarFieldEnum | IngestionRunScalarFieldEnum[]
  }

  /**
   * IngestionRun findMany
   */
  export type IngestionRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestionRunInclude<ExtArgs> | null
    /**
     * Filter, which IngestionRuns to fetch.
     */
    where?: IngestionRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IngestionRuns to fetch.
     */
    orderBy?: IngestionRunOrderByWithRelationInput | IngestionRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IngestionRuns.
     */
    cursor?: IngestionRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IngestionRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IngestionRuns.
     */
    skip?: number
    distinct?: IngestionRunScalarFieldEnum | IngestionRunScalarFieldEnum[]
  }

  /**
   * IngestionRun create
   */
  export type IngestionRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestionRunInclude<ExtArgs> | null
    /**
     * The data needed to create a IngestionRun.
     */
    data: XOR<IngestionRunCreateInput, IngestionRunUncheckedCreateInput>
  }

  /**
   * IngestionRun createMany
   */
  export type IngestionRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IngestionRuns.
     */
    data: IngestionRunCreateManyInput | IngestionRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IngestionRun createManyAndReturn
   */
  export type IngestionRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * The data used to create many IngestionRuns.
     */
    data: IngestionRunCreateManyInput | IngestionRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IngestionRun update
   */
  export type IngestionRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestionRunInclude<ExtArgs> | null
    /**
     * The data needed to update a IngestionRun.
     */
    data: XOR<IngestionRunUpdateInput, IngestionRunUncheckedUpdateInput>
    /**
     * Choose, which IngestionRun to update.
     */
    where: IngestionRunWhereUniqueInput
  }

  /**
   * IngestionRun updateMany
   */
  export type IngestionRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IngestionRuns.
     */
    data: XOR<IngestionRunUpdateManyMutationInput, IngestionRunUncheckedUpdateManyInput>
    /**
     * Filter which IngestionRuns to update
     */
    where?: IngestionRunWhereInput
    /**
     * Limit how many IngestionRuns to update.
     */
    limit?: number
  }

  /**
   * IngestionRun updateManyAndReturn
   */
  export type IngestionRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * The data used to update IngestionRuns.
     */
    data: XOR<IngestionRunUpdateManyMutationInput, IngestionRunUncheckedUpdateManyInput>
    /**
     * Filter which IngestionRuns to update
     */
    where?: IngestionRunWhereInput
    /**
     * Limit how many IngestionRuns to update.
     */
    limit?: number
  }

  /**
   * IngestionRun upsert
   */
  export type IngestionRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestionRunInclude<ExtArgs> | null
    /**
     * The filter to search for the IngestionRun to update in case it exists.
     */
    where: IngestionRunWhereUniqueInput
    /**
     * In case the IngestionRun found by the `where` argument doesn't exist, create a new IngestionRun with this data.
     */
    create: XOR<IngestionRunCreateInput, IngestionRunUncheckedCreateInput>
    /**
     * In case the IngestionRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IngestionRunUpdateInput, IngestionRunUncheckedUpdateInput>
  }

  /**
   * IngestionRun delete
   */
  export type IngestionRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestionRunInclude<ExtArgs> | null
    /**
     * Filter which IngestionRun to delete.
     */
    where: IngestionRunWhereUniqueInput
  }

  /**
   * IngestionRun deleteMany
   */
  export type IngestionRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IngestionRuns to delete
     */
    where?: IngestionRunWhereInput
    /**
     * Limit how many IngestionRuns to delete.
     */
    limit?: number
  }

  /**
   * IngestionRun.changes
   */
  export type IngestionRun$changesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdinanceChange
     */
    select?: OrdinanceChangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdinanceChange
     */
    omit?: OrdinanceChangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceChangeInclude<ExtArgs> | null
    where?: OrdinanceChangeWhereInput
    orderBy?: OrdinanceChangeOrderByWithRelationInput | OrdinanceChangeOrderByWithRelationInput[]
    cursor?: OrdinanceChangeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrdinanceChangeScalarFieldEnum | OrdinanceChangeScalarFieldEnum[]
  }

  /**
   * IngestionRun without action
   */
  export type IngestionRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IngestionRunInclude<ExtArgs> | null
  }


  /**
   * Model Ordinance
   */

  export type AggregateOrdinance = {
    _count: OrdinanceCountAggregateOutputType | null
    _min: OrdinanceMinAggregateOutputType | null
    _max: OrdinanceMaxAggregateOutputType | null
  }

  export type OrdinanceMinAggregateOutputType = {
    id: string | null
    municipalityId: string | null
    identityKey: string | null
    sourceIdentifier: string | null
    name: string | null
    description: string | null
    stage: string | null
    originalStage: string | null
    sourceUrl: string | null
    adoptedDate: string | null
    effectiveDate: string | null
    latestActivity: string | null
    firstObservedAt: Date | null
    lastObservedAt: Date | null
  }

  export type OrdinanceMaxAggregateOutputType = {
    id: string | null
    municipalityId: string | null
    identityKey: string | null
    sourceIdentifier: string | null
    name: string | null
    description: string | null
    stage: string | null
    originalStage: string | null
    sourceUrl: string | null
    adoptedDate: string | null
    effectiveDate: string | null
    latestActivity: string | null
    firstObservedAt: Date | null
    lastObservedAt: Date | null
  }

  export type OrdinanceCountAggregateOutputType = {
    id: number
    municipalityId: number
    identityKey: number
    sourceIdentifier: number
    name: number
    description: number
    stage: number
    originalStage: number
    topics: number
    sourceUrl: number
    adoptedDate: number
    effectiveDate: number
    latestActivity: number
    firstObservedAt: number
    lastObservedAt: number
    _all: number
  }


  export type OrdinanceMinAggregateInputType = {
    id?: true
    municipalityId?: true
    identityKey?: true
    sourceIdentifier?: true
    name?: true
    description?: true
    stage?: true
    originalStage?: true
    sourceUrl?: true
    adoptedDate?: true
    effectiveDate?: true
    latestActivity?: true
    firstObservedAt?: true
    lastObservedAt?: true
  }

  export type OrdinanceMaxAggregateInputType = {
    id?: true
    municipalityId?: true
    identityKey?: true
    sourceIdentifier?: true
    name?: true
    description?: true
    stage?: true
    originalStage?: true
    sourceUrl?: true
    adoptedDate?: true
    effectiveDate?: true
    latestActivity?: true
    firstObservedAt?: true
    lastObservedAt?: true
  }

  export type OrdinanceCountAggregateInputType = {
    id?: true
    municipalityId?: true
    identityKey?: true
    sourceIdentifier?: true
    name?: true
    description?: true
    stage?: true
    originalStage?: true
    topics?: true
    sourceUrl?: true
    adoptedDate?: true
    effectiveDate?: true
    latestActivity?: true
    firstObservedAt?: true
    lastObservedAt?: true
    _all?: true
  }

  export type OrdinanceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ordinance to aggregate.
     */
    where?: OrdinanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ordinances to fetch.
     */
    orderBy?: OrdinanceOrderByWithRelationInput | OrdinanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrdinanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ordinances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ordinances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ordinances
    **/
    _count?: true | OrdinanceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrdinanceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrdinanceMaxAggregateInputType
  }

  export type GetOrdinanceAggregateType<T extends OrdinanceAggregateArgs> = {
        [P in keyof T & keyof AggregateOrdinance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrdinance[P]>
      : GetScalarType<T[P], AggregateOrdinance[P]>
  }




  export type OrdinanceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrdinanceWhereInput
    orderBy?: OrdinanceOrderByWithAggregationInput | OrdinanceOrderByWithAggregationInput[]
    by: OrdinanceScalarFieldEnum[] | OrdinanceScalarFieldEnum
    having?: OrdinanceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrdinanceCountAggregateInputType | true
    _min?: OrdinanceMinAggregateInputType
    _max?: OrdinanceMaxAggregateInputType
  }

  export type OrdinanceGroupByOutputType = {
    id: string
    municipalityId: string
    identityKey: string
    sourceIdentifier: string | null
    name: string
    description: string
    stage: string
    originalStage: string
    topics: string[]
    sourceUrl: string
    adoptedDate: string | null
    effectiveDate: string | null
    latestActivity: string
    firstObservedAt: Date
    lastObservedAt: Date
    _count: OrdinanceCountAggregateOutputType | null
    _min: OrdinanceMinAggregateOutputType | null
    _max: OrdinanceMaxAggregateOutputType | null
  }

  type GetOrdinanceGroupByPayload<T extends OrdinanceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrdinanceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrdinanceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrdinanceGroupByOutputType[P]>
            : GetScalarType<T[P], OrdinanceGroupByOutputType[P]>
        }
      >
    >


  export type OrdinanceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    municipalityId?: boolean
    identityKey?: boolean
    sourceIdentifier?: boolean
    name?: boolean
    description?: boolean
    stage?: boolean
    originalStage?: boolean
    topics?: boolean
    sourceUrl?: boolean
    adoptedDate?: boolean
    effectiveDate?: boolean
    latestActivity?: boolean
    firstObservedAt?: boolean
    lastObservedAt?: boolean
    municipality?: boolean | MunicipalityDefaultArgs<ExtArgs>
    changes?: boolean | Ordinance$changesArgs<ExtArgs>
    _count?: boolean | OrdinanceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ordinance"]>

  export type OrdinanceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    municipalityId?: boolean
    identityKey?: boolean
    sourceIdentifier?: boolean
    name?: boolean
    description?: boolean
    stage?: boolean
    originalStage?: boolean
    topics?: boolean
    sourceUrl?: boolean
    adoptedDate?: boolean
    effectiveDate?: boolean
    latestActivity?: boolean
    firstObservedAt?: boolean
    lastObservedAt?: boolean
    municipality?: boolean | MunicipalityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ordinance"]>

  export type OrdinanceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    municipalityId?: boolean
    identityKey?: boolean
    sourceIdentifier?: boolean
    name?: boolean
    description?: boolean
    stage?: boolean
    originalStage?: boolean
    topics?: boolean
    sourceUrl?: boolean
    adoptedDate?: boolean
    effectiveDate?: boolean
    latestActivity?: boolean
    firstObservedAt?: boolean
    lastObservedAt?: boolean
    municipality?: boolean | MunicipalityDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ordinance"]>

  export type OrdinanceSelectScalar = {
    id?: boolean
    municipalityId?: boolean
    identityKey?: boolean
    sourceIdentifier?: boolean
    name?: boolean
    description?: boolean
    stage?: boolean
    originalStage?: boolean
    topics?: boolean
    sourceUrl?: boolean
    adoptedDate?: boolean
    effectiveDate?: boolean
    latestActivity?: boolean
    firstObservedAt?: boolean
    lastObservedAt?: boolean
  }

  export type OrdinanceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "municipalityId" | "identityKey" | "sourceIdentifier" | "name" | "description" | "stage" | "originalStage" | "topics" | "sourceUrl" | "adoptedDate" | "effectiveDate" | "latestActivity" | "firstObservedAt" | "lastObservedAt", ExtArgs["result"]["ordinance"]>
  export type OrdinanceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    municipality?: boolean | MunicipalityDefaultArgs<ExtArgs>
    changes?: boolean | Ordinance$changesArgs<ExtArgs>
    _count?: boolean | OrdinanceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrdinanceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    municipality?: boolean | MunicipalityDefaultArgs<ExtArgs>
  }
  export type OrdinanceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    municipality?: boolean | MunicipalityDefaultArgs<ExtArgs>
  }

  export type $OrdinancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ordinance"
    objects: {
      municipality: Prisma.$MunicipalityPayload<ExtArgs>
      changes: Prisma.$OrdinanceChangePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      municipalityId: string
      identityKey: string
      sourceIdentifier: string | null
      name: string
      description: string
      stage: string
      originalStage: string
      topics: string[]
      sourceUrl: string
      adoptedDate: string | null
      effectiveDate: string | null
      latestActivity: string
      firstObservedAt: Date
      lastObservedAt: Date
    }, ExtArgs["result"]["ordinance"]>
    composites: {}
  }

  type OrdinanceGetPayload<S extends boolean | null | undefined | OrdinanceDefaultArgs> = $Result.GetResult<Prisma.$OrdinancePayload, S>

  type OrdinanceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrdinanceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrdinanceCountAggregateInputType | true
    }

  export interface OrdinanceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ordinance'], meta: { name: 'Ordinance' } }
    /**
     * Find zero or one Ordinance that matches the filter.
     * @param {OrdinanceFindUniqueArgs} args - Arguments to find a Ordinance
     * @example
     * // Get one Ordinance
     * const ordinance = await prisma.ordinance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrdinanceFindUniqueArgs>(args: SelectSubset<T, OrdinanceFindUniqueArgs<ExtArgs>>): Prisma__OrdinanceClient<$Result.GetResult<Prisma.$OrdinancePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Ordinance that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrdinanceFindUniqueOrThrowArgs} args - Arguments to find a Ordinance
     * @example
     * // Get one Ordinance
     * const ordinance = await prisma.ordinance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrdinanceFindUniqueOrThrowArgs>(args: SelectSubset<T, OrdinanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrdinanceClient<$Result.GetResult<Prisma.$OrdinancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ordinance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdinanceFindFirstArgs} args - Arguments to find a Ordinance
     * @example
     * // Get one Ordinance
     * const ordinance = await prisma.ordinance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrdinanceFindFirstArgs>(args?: SelectSubset<T, OrdinanceFindFirstArgs<ExtArgs>>): Prisma__OrdinanceClient<$Result.GetResult<Prisma.$OrdinancePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ordinance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdinanceFindFirstOrThrowArgs} args - Arguments to find a Ordinance
     * @example
     * // Get one Ordinance
     * const ordinance = await prisma.ordinance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrdinanceFindFirstOrThrowArgs>(args?: SelectSubset<T, OrdinanceFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrdinanceClient<$Result.GetResult<Prisma.$OrdinancePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Ordinances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdinanceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ordinances
     * const ordinances = await prisma.ordinance.findMany()
     * 
     * // Get first 10 Ordinances
     * const ordinances = await prisma.ordinance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ordinanceWithIdOnly = await prisma.ordinance.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrdinanceFindManyArgs>(args?: SelectSubset<T, OrdinanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdinancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Ordinance.
     * @param {OrdinanceCreateArgs} args - Arguments to create a Ordinance.
     * @example
     * // Create one Ordinance
     * const Ordinance = await prisma.ordinance.create({
     *   data: {
     *     // ... data to create a Ordinance
     *   }
     * })
     * 
     */
    create<T extends OrdinanceCreateArgs>(args: SelectSubset<T, OrdinanceCreateArgs<ExtArgs>>): Prisma__OrdinanceClient<$Result.GetResult<Prisma.$OrdinancePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Ordinances.
     * @param {OrdinanceCreateManyArgs} args - Arguments to create many Ordinances.
     * @example
     * // Create many Ordinances
     * const ordinance = await prisma.ordinance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrdinanceCreateManyArgs>(args?: SelectSubset<T, OrdinanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ordinances and returns the data saved in the database.
     * @param {OrdinanceCreateManyAndReturnArgs} args - Arguments to create many Ordinances.
     * @example
     * // Create many Ordinances
     * const ordinance = await prisma.ordinance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ordinances and only return the `id`
     * const ordinanceWithIdOnly = await prisma.ordinance.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrdinanceCreateManyAndReturnArgs>(args?: SelectSubset<T, OrdinanceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdinancePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Ordinance.
     * @param {OrdinanceDeleteArgs} args - Arguments to delete one Ordinance.
     * @example
     * // Delete one Ordinance
     * const Ordinance = await prisma.ordinance.delete({
     *   where: {
     *     // ... filter to delete one Ordinance
     *   }
     * })
     * 
     */
    delete<T extends OrdinanceDeleteArgs>(args: SelectSubset<T, OrdinanceDeleteArgs<ExtArgs>>): Prisma__OrdinanceClient<$Result.GetResult<Prisma.$OrdinancePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Ordinance.
     * @param {OrdinanceUpdateArgs} args - Arguments to update one Ordinance.
     * @example
     * // Update one Ordinance
     * const ordinance = await prisma.ordinance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrdinanceUpdateArgs>(args: SelectSubset<T, OrdinanceUpdateArgs<ExtArgs>>): Prisma__OrdinanceClient<$Result.GetResult<Prisma.$OrdinancePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Ordinances.
     * @param {OrdinanceDeleteManyArgs} args - Arguments to filter Ordinances to delete.
     * @example
     * // Delete a few Ordinances
     * const { count } = await prisma.ordinance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrdinanceDeleteManyArgs>(args?: SelectSubset<T, OrdinanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ordinances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdinanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ordinances
     * const ordinance = await prisma.ordinance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrdinanceUpdateManyArgs>(args: SelectSubset<T, OrdinanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ordinances and returns the data updated in the database.
     * @param {OrdinanceUpdateManyAndReturnArgs} args - Arguments to update many Ordinances.
     * @example
     * // Update many Ordinances
     * const ordinance = await prisma.ordinance.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Ordinances and only return the `id`
     * const ordinanceWithIdOnly = await prisma.ordinance.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrdinanceUpdateManyAndReturnArgs>(args: SelectSubset<T, OrdinanceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdinancePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Ordinance.
     * @param {OrdinanceUpsertArgs} args - Arguments to update or create a Ordinance.
     * @example
     * // Update or create a Ordinance
     * const ordinance = await prisma.ordinance.upsert({
     *   create: {
     *     // ... data to create a Ordinance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ordinance we want to update
     *   }
     * })
     */
    upsert<T extends OrdinanceUpsertArgs>(args: SelectSubset<T, OrdinanceUpsertArgs<ExtArgs>>): Prisma__OrdinanceClient<$Result.GetResult<Prisma.$OrdinancePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Ordinances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdinanceCountArgs} args - Arguments to filter Ordinances to count.
     * @example
     * // Count the number of Ordinances
     * const count = await prisma.ordinance.count({
     *   where: {
     *     // ... the filter for the Ordinances we want to count
     *   }
     * })
    **/
    count<T extends OrdinanceCountArgs>(
      args?: Subset<T, OrdinanceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrdinanceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ordinance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdinanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrdinanceAggregateArgs>(args: Subset<T, OrdinanceAggregateArgs>): Prisma.PrismaPromise<GetOrdinanceAggregateType<T>>

    /**
     * Group by Ordinance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdinanceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrdinanceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrdinanceGroupByArgs['orderBy'] }
        : { orderBy?: OrdinanceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrdinanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrdinanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ordinance model
   */
  readonly fields: OrdinanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ordinance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrdinanceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    municipality<T extends MunicipalityDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MunicipalityDefaultArgs<ExtArgs>>): Prisma__MunicipalityClient<$Result.GetResult<Prisma.$MunicipalityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    changes<T extends Ordinance$changesArgs<ExtArgs> = {}>(args?: Subset<T, Ordinance$changesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdinanceChangePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Ordinance model
   */
  interface OrdinanceFieldRefs {
    readonly id: FieldRef<"Ordinance", 'String'>
    readonly municipalityId: FieldRef<"Ordinance", 'String'>
    readonly identityKey: FieldRef<"Ordinance", 'String'>
    readonly sourceIdentifier: FieldRef<"Ordinance", 'String'>
    readonly name: FieldRef<"Ordinance", 'String'>
    readonly description: FieldRef<"Ordinance", 'String'>
    readonly stage: FieldRef<"Ordinance", 'String'>
    readonly originalStage: FieldRef<"Ordinance", 'String'>
    readonly topics: FieldRef<"Ordinance", 'String[]'>
    readonly sourceUrl: FieldRef<"Ordinance", 'String'>
    readonly adoptedDate: FieldRef<"Ordinance", 'String'>
    readonly effectiveDate: FieldRef<"Ordinance", 'String'>
    readonly latestActivity: FieldRef<"Ordinance", 'String'>
    readonly firstObservedAt: FieldRef<"Ordinance", 'DateTime'>
    readonly lastObservedAt: FieldRef<"Ordinance", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Ordinance findUnique
   */
  export type OrdinanceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ordinance
     */
    select?: OrdinanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ordinance
     */
    omit?: OrdinanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceInclude<ExtArgs> | null
    /**
     * Filter, which Ordinance to fetch.
     */
    where: OrdinanceWhereUniqueInput
  }

  /**
   * Ordinance findUniqueOrThrow
   */
  export type OrdinanceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ordinance
     */
    select?: OrdinanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ordinance
     */
    omit?: OrdinanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceInclude<ExtArgs> | null
    /**
     * Filter, which Ordinance to fetch.
     */
    where: OrdinanceWhereUniqueInput
  }

  /**
   * Ordinance findFirst
   */
  export type OrdinanceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ordinance
     */
    select?: OrdinanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ordinance
     */
    omit?: OrdinanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceInclude<ExtArgs> | null
    /**
     * Filter, which Ordinance to fetch.
     */
    where?: OrdinanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ordinances to fetch.
     */
    orderBy?: OrdinanceOrderByWithRelationInput | OrdinanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ordinances.
     */
    cursor?: OrdinanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ordinances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ordinances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ordinances.
     */
    distinct?: OrdinanceScalarFieldEnum | OrdinanceScalarFieldEnum[]
  }

  /**
   * Ordinance findFirstOrThrow
   */
  export type OrdinanceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ordinance
     */
    select?: OrdinanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ordinance
     */
    omit?: OrdinanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceInclude<ExtArgs> | null
    /**
     * Filter, which Ordinance to fetch.
     */
    where?: OrdinanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ordinances to fetch.
     */
    orderBy?: OrdinanceOrderByWithRelationInput | OrdinanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ordinances.
     */
    cursor?: OrdinanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ordinances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ordinances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ordinances.
     */
    distinct?: OrdinanceScalarFieldEnum | OrdinanceScalarFieldEnum[]
  }

  /**
   * Ordinance findMany
   */
  export type OrdinanceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ordinance
     */
    select?: OrdinanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ordinance
     */
    omit?: OrdinanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceInclude<ExtArgs> | null
    /**
     * Filter, which Ordinances to fetch.
     */
    where?: OrdinanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ordinances to fetch.
     */
    orderBy?: OrdinanceOrderByWithRelationInput | OrdinanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ordinances.
     */
    cursor?: OrdinanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ordinances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ordinances.
     */
    skip?: number
    distinct?: OrdinanceScalarFieldEnum | OrdinanceScalarFieldEnum[]
  }

  /**
   * Ordinance create
   */
  export type OrdinanceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ordinance
     */
    select?: OrdinanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ordinance
     */
    omit?: OrdinanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceInclude<ExtArgs> | null
    /**
     * The data needed to create a Ordinance.
     */
    data: XOR<OrdinanceCreateInput, OrdinanceUncheckedCreateInput>
  }

  /**
   * Ordinance createMany
   */
  export type OrdinanceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ordinances.
     */
    data: OrdinanceCreateManyInput | OrdinanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Ordinance createManyAndReturn
   */
  export type OrdinanceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ordinance
     */
    select?: OrdinanceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ordinance
     */
    omit?: OrdinanceOmit<ExtArgs> | null
    /**
     * The data used to create many Ordinances.
     */
    data: OrdinanceCreateManyInput | OrdinanceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ordinance update
   */
  export type OrdinanceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ordinance
     */
    select?: OrdinanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ordinance
     */
    omit?: OrdinanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceInclude<ExtArgs> | null
    /**
     * The data needed to update a Ordinance.
     */
    data: XOR<OrdinanceUpdateInput, OrdinanceUncheckedUpdateInput>
    /**
     * Choose, which Ordinance to update.
     */
    where: OrdinanceWhereUniqueInput
  }

  /**
   * Ordinance updateMany
   */
  export type OrdinanceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ordinances.
     */
    data: XOR<OrdinanceUpdateManyMutationInput, OrdinanceUncheckedUpdateManyInput>
    /**
     * Filter which Ordinances to update
     */
    where?: OrdinanceWhereInput
    /**
     * Limit how many Ordinances to update.
     */
    limit?: number
  }

  /**
   * Ordinance updateManyAndReturn
   */
  export type OrdinanceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ordinance
     */
    select?: OrdinanceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ordinance
     */
    omit?: OrdinanceOmit<ExtArgs> | null
    /**
     * The data used to update Ordinances.
     */
    data: XOR<OrdinanceUpdateManyMutationInput, OrdinanceUncheckedUpdateManyInput>
    /**
     * Filter which Ordinances to update
     */
    where?: OrdinanceWhereInput
    /**
     * Limit how many Ordinances to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ordinance upsert
   */
  export type OrdinanceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ordinance
     */
    select?: OrdinanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ordinance
     */
    omit?: OrdinanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceInclude<ExtArgs> | null
    /**
     * The filter to search for the Ordinance to update in case it exists.
     */
    where: OrdinanceWhereUniqueInput
    /**
     * In case the Ordinance found by the `where` argument doesn't exist, create a new Ordinance with this data.
     */
    create: XOR<OrdinanceCreateInput, OrdinanceUncheckedCreateInput>
    /**
     * In case the Ordinance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrdinanceUpdateInput, OrdinanceUncheckedUpdateInput>
  }

  /**
   * Ordinance delete
   */
  export type OrdinanceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ordinance
     */
    select?: OrdinanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ordinance
     */
    omit?: OrdinanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceInclude<ExtArgs> | null
    /**
     * Filter which Ordinance to delete.
     */
    where: OrdinanceWhereUniqueInput
  }

  /**
   * Ordinance deleteMany
   */
  export type OrdinanceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ordinances to delete
     */
    where?: OrdinanceWhereInput
    /**
     * Limit how many Ordinances to delete.
     */
    limit?: number
  }

  /**
   * Ordinance.changes
   */
  export type Ordinance$changesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdinanceChange
     */
    select?: OrdinanceChangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdinanceChange
     */
    omit?: OrdinanceChangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceChangeInclude<ExtArgs> | null
    where?: OrdinanceChangeWhereInput
    orderBy?: OrdinanceChangeOrderByWithRelationInput | OrdinanceChangeOrderByWithRelationInput[]
    cursor?: OrdinanceChangeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrdinanceChangeScalarFieldEnum | OrdinanceChangeScalarFieldEnum[]
  }

  /**
   * Ordinance without action
   */
  export type OrdinanceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ordinance
     */
    select?: OrdinanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ordinance
     */
    omit?: OrdinanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceInclude<ExtArgs> | null
  }


  /**
   * Model OrdinanceChange
   */

  export type AggregateOrdinanceChange = {
    _count: OrdinanceChangeCountAggregateOutputType | null
    _min: OrdinanceChangeMinAggregateOutputType | null
    _max: OrdinanceChangeMaxAggregateOutputType | null
  }

  export type OrdinanceChangeMinAggregateOutputType = {
    id: string | null
    ordinanceId: string | null
    ingestionRunId: string | null
    dedupeKey: string | null
    activityType: string | null
    activityDate: string | null
    activityAt: Date | null
    description: string | null
    evidenceUrl: string | null
    evidenceExcerpt: string | null
    discoveredAt: Date | null
  }

  export type OrdinanceChangeMaxAggregateOutputType = {
    id: string | null
    ordinanceId: string | null
    ingestionRunId: string | null
    dedupeKey: string | null
    activityType: string | null
    activityDate: string | null
    activityAt: Date | null
    description: string | null
    evidenceUrl: string | null
    evidenceExcerpt: string | null
    discoveredAt: Date | null
  }

  export type OrdinanceChangeCountAggregateOutputType = {
    id: number
    ordinanceId: number
    ingestionRunId: number
    dedupeKey: number
    activityType: number
    activityDate: number
    activityAt: number
    description: number
    evidenceUrl: number
    evidenceExcerpt: number
    discoveredAt: number
    _all: number
  }


  export type OrdinanceChangeMinAggregateInputType = {
    id?: true
    ordinanceId?: true
    ingestionRunId?: true
    dedupeKey?: true
    activityType?: true
    activityDate?: true
    activityAt?: true
    description?: true
    evidenceUrl?: true
    evidenceExcerpt?: true
    discoveredAt?: true
  }

  export type OrdinanceChangeMaxAggregateInputType = {
    id?: true
    ordinanceId?: true
    ingestionRunId?: true
    dedupeKey?: true
    activityType?: true
    activityDate?: true
    activityAt?: true
    description?: true
    evidenceUrl?: true
    evidenceExcerpt?: true
    discoveredAt?: true
  }

  export type OrdinanceChangeCountAggregateInputType = {
    id?: true
    ordinanceId?: true
    ingestionRunId?: true
    dedupeKey?: true
    activityType?: true
    activityDate?: true
    activityAt?: true
    description?: true
    evidenceUrl?: true
    evidenceExcerpt?: true
    discoveredAt?: true
    _all?: true
  }

  export type OrdinanceChangeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrdinanceChange to aggregate.
     */
    where?: OrdinanceChangeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrdinanceChanges to fetch.
     */
    orderBy?: OrdinanceChangeOrderByWithRelationInput | OrdinanceChangeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrdinanceChangeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrdinanceChanges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrdinanceChanges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrdinanceChanges
    **/
    _count?: true | OrdinanceChangeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrdinanceChangeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrdinanceChangeMaxAggregateInputType
  }

  export type GetOrdinanceChangeAggregateType<T extends OrdinanceChangeAggregateArgs> = {
        [P in keyof T & keyof AggregateOrdinanceChange]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrdinanceChange[P]>
      : GetScalarType<T[P], AggregateOrdinanceChange[P]>
  }




  export type OrdinanceChangeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrdinanceChangeWhereInput
    orderBy?: OrdinanceChangeOrderByWithAggregationInput | OrdinanceChangeOrderByWithAggregationInput[]
    by: OrdinanceChangeScalarFieldEnum[] | OrdinanceChangeScalarFieldEnum
    having?: OrdinanceChangeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrdinanceChangeCountAggregateInputType | true
    _min?: OrdinanceChangeMinAggregateInputType
    _max?: OrdinanceChangeMaxAggregateInputType
  }

  export type OrdinanceChangeGroupByOutputType = {
    id: string
    ordinanceId: string
    ingestionRunId: string
    dedupeKey: string
    activityType: string
    activityDate: string
    activityAt: Date | null
    description: string
    evidenceUrl: string
    evidenceExcerpt: string
    discoveredAt: Date
    _count: OrdinanceChangeCountAggregateOutputType | null
    _min: OrdinanceChangeMinAggregateOutputType | null
    _max: OrdinanceChangeMaxAggregateOutputType | null
  }

  type GetOrdinanceChangeGroupByPayload<T extends OrdinanceChangeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrdinanceChangeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrdinanceChangeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrdinanceChangeGroupByOutputType[P]>
            : GetScalarType<T[P], OrdinanceChangeGroupByOutputType[P]>
        }
      >
    >


  export type OrdinanceChangeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ordinanceId?: boolean
    ingestionRunId?: boolean
    dedupeKey?: boolean
    activityType?: boolean
    activityDate?: boolean
    activityAt?: boolean
    description?: boolean
    evidenceUrl?: boolean
    evidenceExcerpt?: boolean
    discoveredAt?: boolean
    ordinance?: boolean | OrdinanceDefaultArgs<ExtArgs>
    ingestionRun?: boolean | IngestionRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ordinanceChange"]>

  export type OrdinanceChangeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ordinanceId?: boolean
    ingestionRunId?: boolean
    dedupeKey?: boolean
    activityType?: boolean
    activityDate?: boolean
    activityAt?: boolean
    description?: boolean
    evidenceUrl?: boolean
    evidenceExcerpt?: boolean
    discoveredAt?: boolean
    ordinance?: boolean | OrdinanceDefaultArgs<ExtArgs>
    ingestionRun?: boolean | IngestionRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ordinanceChange"]>

  export type OrdinanceChangeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ordinanceId?: boolean
    ingestionRunId?: boolean
    dedupeKey?: boolean
    activityType?: boolean
    activityDate?: boolean
    activityAt?: boolean
    description?: boolean
    evidenceUrl?: boolean
    evidenceExcerpt?: boolean
    discoveredAt?: boolean
    ordinance?: boolean | OrdinanceDefaultArgs<ExtArgs>
    ingestionRun?: boolean | IngestionRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ordinanceChange"]>

  export type OrdinanceChangeSelectScalar = {
    id?: boolean
    ordinanceId?: boolean
    ingestionRunId?: boolean
    dedupeKey?: boolean
    activityType?: boolean
    activityDate?: boolean
    activityAt?: boolean
    description?: boolean
    evidenceUrl?: boolean
    evidenceExcerpt?: boolean
    discoveredAt?: boolean
  }

  export type OrdinanceChangeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ordinanceId" | "ingestionRunId" | "dedupeKey" | "activityType" | "activityDate" | "activityAt" | "description" | "evidenceUrl" | "evidenceExcerpt" | "discoveredAt", ExtArgs["result"]["ordinanceChange"]>
  export type OrdinanceChangeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ordinance?: boolean | OrdinanceDefaultArgs<ExtArgs>
    ingestionRun?: boolean | IngestionRunDefaultArgs<ExtArgs>
  }
  export type OrdinanceChangeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ordinance?: boolean | OrdinanceDefaultArgs<ExtArgs>
    ingestionRun?: boolean | IngestionRunDefaultArgs<ExtArgs>
  }
  export type OrdinanceChangeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ordinance?: boolean | OrdinanceDefaultArgs<ExtArgs>
    ingestionRun?: boolean | IngestionRunDefaultArgs<ExtArgs>
  }

  export type $OrdinanceChangePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrdinanceChange"
    objects: {
      ordinance: Prisma.$OrdinancePayload<ExtArgs>
      ingestionRun: Prisma.$IngestionRunPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ordinanceId: string
      ingestionRunId: string
      dedupeKey: string
      activityType: string
      activityDate: string
      activityAt: Date | null
      description: string
      evidenceUrl: string
      evidenceExcerpt: string
      discoveredAt: Date
    }, ExtArgs["result"]["ordinanceChange"]>
    composites: {}
  }

  type OrdinanceChangeGetPayload<S extends boolean | null | undefined | OrdinanceChangeDefaultArgs> = $Result.GetResult<Prisma.$OrdinanceChangePayload, S>

  type OrdinanceChangeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrdinanceChangeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrdinanceChangeCountAggregateInputType | true
    }

  export interface OrdinanceChangeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrdinanceChange'], meta: { name: 'OrdinanceChange' } }
    /**
     * Find zero or one OrdinanceChange that matches the filter.
     * @param {OrdinanceChangeFindUniqueArgs} args - Arguments to find a OrdinanceChange
     * @example
     * // Get one OrdinanceChange
     * const ordinanceChange = await prisma.ordinanceChange.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrdinanceChangeFindUniqueArgs>(args: SelectSubset<T, OrdinanceChangeFindUniqueArgs<ExtArgs>>): Prisma__OrdinanceChangeClient<$Result.GetResult<Prisma.$OrdinanceChangePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OrdinanceChange that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrdinanceChangeFindUniqueOrThrowArgs} args - Arguments to find a OrdinanceChange
     * @example
     * // Get one OrdinanceChange
     * const ordinanceChange = await prisma.ordinanceChange.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrdinanceChangeFindUniqueOrThrowArgs>(args: SelectSubset<T, OrdinanceChangeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrdinanceChangeClient<$Result.GetResult<Prisma.$OrdinanceChangePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrdinanceChange that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdinanceChangeFindFirstArgs} args - Arguments to find a OrdinanceChange
     * @example
     * // Get one OrdinanceChange
     * const ordinanceChange = await prisma.ordinanceChange.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrdinanceChangeFindFirstArgs>(args?: SelectSubset<T, OrdinanceChangeFindFirstArgs<ExtArgs>>): Prisma__OrdinanceChangeClient<$Result.GetResult<Prisma.$OrdinanceChangePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrdinanceChange that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdinanceChangeFindFirstOrThrowArgs} args - Arguments to find a OrdinanceChange
     * @example
     * // Get one OrdinanceChange
     * const ordinanceChange = await prisma.ordinanceChange.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrdinanceChangeFindFirstOrThrowArgs>(args?: SelectSubset<T, OrdinanceChangeFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrdinanceChangeClient<$Result.GetResult<Prisma.$OrdinanceChangePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OrdinanceChanges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdinanceChangeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrdinanceChanges
     * const ordinanceChanges = await prisma.ordinanceChange.findMany()
     * 
     * // Get first 10 OrdinanceChanges
     * const ordinanceChanges = await prisma.ordinanceChange.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ordinanceChangeWithIdOnly = await prisma.ordinanceChange.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrdinanceChangeFindManyArgs>(args?: SelectSubset<T, OrdinanceChangeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdinanceChangePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OrdinanceChange.
     * @param {OrdinanceChangeCreateArgs} args - Arguments to create a OrdinanceChange.
     * @example
     * // Create one OrdinanceChange
     * const OrdinanceChange = await prisma.ordinanceChange.create({
     *   data: {
     *     // ... data to create a OrdinanceChange
     *   }
     * })
     * 
     */
    create<T extends OrdinanceChangeCreateArgs>(args: SelectSubset<T, OrdinanceChangeCreateArgs<ExtArgs>>): Prisma__OrdinanceChangeClient<$Result.GetResult<Prisma.$OrdinanceChangePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OrdinanceChanges.
     * @param {OrdinanceChangeCreateManyArgs} args - Arguments to create many OrdinanceChanges.
     * @example
     * // Create many OrdinanceChanges
     * const ordinanceChange = await prisma.ordinanceChange.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrdinanceChangeCreateManyArgs>(args?: SelectSubset<T, OrdinanceChangeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OrdinanceChanges and returns the data saved in the database.
     * @param {OrdinanceChangeCreateManyAndReturnArgs} args - Arguments to create many OrdinanceChanges.
     * @example
     * // Create many OrdinanceChanges
     * const ordinanceChange = await prisma.ordinanceChange.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OrdinanceChanges and only return the `id`
     * const ordinanceChangeWithIdOnly = await prisma.ordinanceChange.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrdinanceChangeCreateManyAndReturnArgs>(args?: SelectSubset<T, OrdinanceChangeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdinanceChangePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OrdinanceChange.
     * @param {OrdinanceChangeDeleteArgs} args - Arguments to delete one OrdinanceChange.
     * @example
     * // Delete one OrdinanceChange
     * const OrdinanceChange = await prisma.ordinanceChange.delete({
     *   where: {
     *     // ... filter to delete one OrdinanceChange
     *   }
     * })
     * 
     */
    delete<T extends OrdinanceChangeDeleteArgs>(args: SelectSubset<T, OrdinanceChangeDeleteArgs<ExtArgs>>): Prisma__OrdinanceChangeClient<$Result.GetResult<Prisma.$OrdinanceChangePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OrdinanceChange.
     * @param {OrdinanceChangeUpdateArgs} args - Arguments to update one OrdinanceChange.
     * @example
     * // Update one OrdinanceChange
     * const ordinanceChange = await prisma.ordinanceChange.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrdinanceChangeUpdateArgs>(args: SelectSubset<T, OrdinanceChangeUpdateArgs<ExtArgs>>): Prisma__OrdinanceChangeClient<$Result.GetResult<Prisma.$OrdinanceChangePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OrdinanceChanges.
     * @param {OrdinanceChangeDeleteManyArgs} args - Arguments to filter OrdinanceChanges to delete.
     * @example
     * // Delete a few OrdinanceChanges
     * const { count } = await prisma.ordinanceChange.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrdinanceChangeDeleteManyArgs>(args?: SelectSubset<T, OrdinanceChangeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrdinanceChanges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdinanceChangeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrdinanceChanges
     * const ordinanceChange = await prisma.ordinanceChange.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrdinanceChangeUpdateManyArgs>(args: SelectSubset<T, OrdinanceChangeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrdinanceChanges and returns the data updated in the database.
     * @param {OrdinanceChangeUpdateManyAndReturnArgs} args - Arguments to update many OrdinanceChanges.
     * @example
     * // Update many OrdinanceChanges
     * const ordinanceChange = await prisma.ordinanceChange.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OrdinanceChanges and only return the `id`
     * const ordinanceChangeWithIdOnly = await prisma.ordinanceChange.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrdinanceChangeUpdateManyAndReturnArgs>(args: SelectSubset<T, OrdinanceChangeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrdinanceChangePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OrdinanceChange.
     * @param {OrdinanceChangeUpsertArgs} args - Arguments to update or create a OrdinanceChange.
     * @example
     * // Update or create a OrdinanceChange
     * const ordinanceChange = await prisma.ordinanceChange.upsert({
     *   create: {
     *     // ... data to create a OrdinanceChange
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrdinanceChange we want to update
     *   }
     * })
     */
    upsert<T extends OrdinanceChangeUpsertArgs>(args: SelectSubset<T, OrdinanceChangeUpsertArgs<ExtArgs>>): Prisma__OrdinanceChangeClient<$Result.GetResult<Prisma.$OrdinanceChangePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OrdinanceChanges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdinanceChangeCountArgs} args - Arguments to filter OrdinanceChanges to count.
     * @example
     * // Count the number of OrdinanceChanges
     * const count = await prisma.ordinanceChange.count({
     *   where: {
     *     // ... the filter for the OrdinanceChanges we want to count
     *   }
     * })
    **/
    count<T extends OrdinanceChangeCountArgs>(
      args?: Subset<T, OrdinanceChangeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrdinanceChangeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrdinanceChange.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdinanceChangeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrdinanceChangeAggregateArgs>(args: Subset<T, OrdinanceChangeAggregateArgs>): Prisma.PrismaPromise<GetOrdinanceChangeAggregateType<T>>

    /**
     * Group by OrdinanceChange.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrdinanceChangeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrdinanceChangeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrdinanceChangeGroupByArgs['orderBy'] }
        : { orderBy?: OrdinanceChangeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrdinanceChangeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrdinanceChangeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrdinanceChange model
   */
  readonly fields: OrdinanceChangeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrdinanceChange.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrdinanceChangeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ordinance<T extends OrdinanceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrdinanceDefaultArgs<ExtArgs>>): Prisma__OrdinanceClient<$Result.GetResult<Prisma.$OrdinancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    ingestionRun<T extends IngestionRunDefaultArgs<ExtArgs> = {}>(args?: Subset<T, IngestionRunDefaultArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OrdinanceChange model
   */
  interface OrdinanceChangeFieldRefs {
    readonly id: FieldRef<"OrdinanceChange", 'String'>
    readonly ordinanceId: FieldRef<"OrdinanceChange", 'String'>
    readonly ingestionRunId: FieldRef<"OrdinanceChange", 'String'>
    readonly dedupeKey: FieldRef<"OrdinanceChange", 'String'>
    readonly activityType: FieldRef<"OrdinanceChange", 'String'>
    readonly activityDate: FieldRef<"OrdinanceChange", 'String'>
    readonly activityAt: FieldRef<"OrdinanceChange", 'DateTime'>
    readonly description: FieldRef<"OrdinanceChange", 'String'>
    readonly evidenceUrl: FieldRef<"OrdinanceChange", 'String'>
    readonly evidenceExcerpt: FieldRef<"OrdinanceChange", 'String'>
    readonly discoveredAt: FieldRef<"OrdinanceChange", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OrdinanceChange findUnique
   */
  export type OrdinanceChangeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdinanceChange
     */
    select?: OrdinanceChangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdinanceChange
     */
    omit?: OrdinanceChangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceChangeInclude<ExtArgs> | null
    /**
     * Filter, which OrdinanceChange to fetch.
     */
    where: OrdinanceChangeWhereUniqueInput
  }

  /**
   * OrdinanceChange findUniqueOrThrow
   */
  export type OrdinanceChangeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdinanceChange
     */
    select?: OrdinanceChangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdinanceChange
     */
    omit?: OrdinanceChangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceChangeInclude<ExtArgs> | null
    /**
     * Filter, which OrdinanceChange to fetch.
     */
    where: OrdinanceChangeWhereUniqueInput
  }

  /**
   * OrdinanceChange findFirst
   */
  export type OrdinanceChangeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdinanceChange
     */
    select?: OrdinanceChangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdinanceChange
     */
    omit?: OrdinanceChangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceChangeInclude<ExtArgs> | null
    /**
     * Filter, which OrdinanceChange to fetch.
     */
    where?: OrdinanceChangeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrdinanceChanges to fetch.
     */
    orderBy?: OrdinanceChangeOrderByWithRelationInput | OrdinanceChangeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrdinanceChanges.
     */
    cursor?: OrdinanceChangeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrdinanceChanges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrdinanceChanges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrdinanceChanges.
     */
    distinct?: OrdinanceChangeScalarFieldEnum | OrdinanceChangeScalarFieldEnum[]
  }

  /**
   * OrdinanceChange findFirstOrThrow
   */
  export type OrdinanceChangeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdinanceChange
     */
    select?: OrdinanceChangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdinanceChange
     */
    omit?: OrdinanceChangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceChangeInclude<ExtArgs> | null
    /**
     * Filter, which OrdinanceChange to fetch.
     */
    where?: OrdinanceChangeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrdinanceChanges to fetch.
     */
    orderBy?: OrdinanceChangeOrderByWithRelationInput | OrdinanceChangeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrdinanceChanges.
     */
    cursor?: OrdinanceChangeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrdinanceChanges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrdinanceChanges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrdinanceChanges.
     */
    distinct?: OrdinanceChangeScalarFieldEnum | OrdinanceChangeScalarFieldEnum[]
  }

  /**
   * OrdinanceChange findMany
   */
  export type OrdinanceChangeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdinanceChange
     */
    select?: OrdinanceChangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdinanceChange
     */
    omit?: OrdinanceChangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceChangeInclude<ExtArgs> | null
    /**
     * Filter, which OrdinanceChanges to fetch.
     */
    where?: OrdinanceChangeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrdinanceChanges to fetch.
     */
    orderBy?: OrdinanceChangeOrderByWithRelationInput | OrdinanceChangeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrdinanceChanges.
     */
    cursor?: OrdinanceChangeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrdinanceChanges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrdinanceChanges.
     */
    skip?: number
    distinct?: OrdinanceChangeScalarFieldEnum | OrdinanceChangeScalarFieldEnum[]
  }

  /**
   * OrdinanceChange create
   */
  export type OrdinanceChangeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdinanceChange
     */
    select?: OrdinanceChangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdinanceChange
     */
    omit?: OrdinanceChangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceChangeInclude<ExtArgs> | null
    /**
     * The data needed to create a OrdinanceChange.
     */
    data: XOR<OrdinanceChangeCreateInput, OrdinanceChangeUncheckedCreateInput>
  }

  /**
   * OrdinanceChange createMany
   */
  export type OrdinanceChangeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrdinanceChanges.
     */
    data: OrdinanceChangeCreateManyInput | OrdinanceChangeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrdinanceChange createManyAndReturn
   */
  export type OrdinanceChangeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdinanceChange
     */
    select?: OrdinanceChangeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrdinanceChange
     */
    omit?: OrdinanceChangeOmit<ExtArgs> | null
    /**
     * The data used to create many OrdinanceChanges.
     */
    data: OrdinanceChangeCreateManyInput | OrdinanceChangeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceChangeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrdinanceChange update
   */
  export type OrdinanceChangeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdinanceChange
     */
    select?: OrdinanceChangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdinanceChange
     */
    omit?: OrdinanceChangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceChangeInclude<ExtArgs> | null
    /**
     * The data needed to update a OrdinanceChange.
     */
    data: XOR<OrdinanceChangeUpdateInput, OrdinanceChangeUncheckedUpdateInput>
    /**
     * Choose, which OrdinanceChange to update.
     */
    where: OrdinanceChangeWhereUniqueInput
  }

  /**
   * OrdinanceChange updateMany
   */
  export type OrdinanceChangeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrdinanceChanges.
     */
    data: XOR<OrdinanceChangeUpdateManyMutationInput, OrdinanceChangeUncheckedUpdateManyInput>
    /**
     * Filter which OrdinanceChanges to update
     */
    where?: OrdinanceChangeWhereInput
    /**
     * Limit how many OrdinanceChanges to update.
     */
    limit?: number
  }

  /**
   * OrdinanceChange updateManyAndReturn
   */
  export type OrdinanceChangeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdinanceChange
     */
    select?: OrdinanceChangeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrdinanceChange
     */
    omit?: OrdinanceChangeOmit<ExtArgs> | null
    /**
     * The data used to update OrdinanceChanges.
     */
    data: XOR<OrdinanceChangeUpdateManyMutationInput, OrdinanceChangeUncheckedUpdateManyInput>
    /**
     * Filter which OrdinanceChanges to update
     */
    where?: OrdinanceChangeWhereInput
    /**
     * Limit how many OrdinanceChanges to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceChangeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrdinanceChange upsert
   */
  export type OrdinanceChangeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdinanceChange
     */
    select?: OrdinanceChangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdinanceChange
     */
    omit?: OrdinanceChangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceChangeInclude<ExtArgs> | null
    /**
     * The filter to search for the OrdinanceChange to update in case it exists.
     */
    where: OrdinanceChangeWhereUniqueInput
    /**
     * In case the OrdinanceChange found by the `where` argument doesn't exist, create a new OrdinanceChange with this data.
     */
    create: XOR<OrdinanceChangeCreateInput, OrdinanceChangeUncheckedCreateInput>
    /**
     * In case the OrdinanceChange was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrdinanceChangeUpdateInput, OrdinanceChangeUncheckedUpdateInput>
  }

  /**
   * OrdinanceChange delete
   */
  export type OrdinanceChangeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdinanceChange
     */
    select?: OrdinanceChangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdinanceChange
     */
    omit?: OrdinanceChangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceChangeInclude<ExtArgs> | null
    /**
     * Filter which OrdinanceChange to delete.
     */
    where: OrdinanceChangeWhereUniqueInput
  }

  /**
   * OrdinanceChange deleteMany
   */
  export type OrdinanceChangeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrdinanceChanges to delete
     */
    where?: OrdinanceChangeWhereInput
    /**
     * Limit how many OrdinanceChanges to delete.
     */
    limit?: number
  }

  /**
   * OrdinanceChange without action
   */
  export type OrdinanceChangeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrdinanceChange
     */
    select?: OrdinanceChangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrdinanceChange
     */
    omit?: OrdinanceChangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrdinanceChangeInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PostScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum]


  export const UserProfileScalarFieldEnum: {
    id: 'id',
    tags: 'tags',
    age: 'age',
    location: 'location',
    locationId: 'locationId',
    gender: 'gender',
    weeklyDigestEnabled: 'weeklyDigestEnabled',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserProfileScalarFieldEnum = (typeof UserProfileScalarFieldEnum)[keyof typeof UserProfileScalarFieldEnum]


  export const MunicipalityScalarFieldEnum: {
    id: 'id',
    key: 'key',
    city: 'city',
    state: 'state',
    label: 'label'
  };

  export type MunicipalityScalarFieldEnum = (typeof MunicipalityScalarFieldEnum)[keyof typeof MunicipalityScalarFieldEnum]


  export const IngestionRunScalarFieldEnum: {
    id: 'id',
    windowStart: 'windowStart',
    windowEnd: 'windowEnd',
    cities: 'cities',
    skippedCount: 'skippedCount',
    status: 'status',
    providerJobId: 'providerJobId',
    coverage: 'coverage',
    creditsUsed: 'creditsUsed',
    rejectedCount: 'rejectedCount',
    failureCode: 'failureCode',
    createdAt: 'createdAt',
    completedAt: 'completedAt'
  };

  export type IngestionRunScalarFieldEnum = (typeof IngestionRunScalarFieldEnum)[keyof typeof IngestionRunScalarFieldEnum]


  export const OrdinanceScalarFieldEnum: {
    id: 'id',
    municipalityId: 'municipalityId',
    identityKey: 'identityKey',
    sourceIdentifier: 'sourceIdentifier',
    name: 'name',
    description: 'description',
    stage: 'stage',
    originalStage: 'originalStage',
    topics: 'topics',
    sourceUrl: 'sourceUrl',
    adoptedDate: 'adoptedDate',
    effectiveDate: 'effectiveDate',
    latestActivity: 'latestActivity',
    firstObservedAt: 'firstObservedAt',
    lastObservedAt: 'lastObservedAt'
  };

  export type OrdinanceScalarFieldEnum = (typeof OrdinanceScalarFieldEnum)[keyof typeof OrdinanceScalarFieldEnum]


  export const OrdinanceChangeScalarFieldEnum: {
    id: 'id',
    ordinanceId: 'ordinanceId',
    ingestionRunId: 'ingestionRunId',
    dedupeKey: 'dedupeKey',
    activityType: 'activityType',
    activityDate: 'activityDate',
    activityAt: 'activityAt',
    description: 'description',
    evidenceUrl: 'evidenceUrl',
    evidenceExcerpt: 'evidenceExcerpt',
    discoveredAt: 'discoveredAt'
  };

  export type OrdinanceChangeScalarFieldEnum = (typeof OrdinanceChangeScalarFieldEnum)[keyof typeof OrdinanceChangeScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type PostWhereInput = {
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    id?: IntFilter<"Post"> | number
    name?: StringFilter<"Post"> | string
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
  }

  export type PostOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PostWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    name?: StringFilter<"Post"> | string
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
  }, "id">

  export type PostOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PostCountOrderByAggregateInput
    _avg?: PostAvgOrderByAggregateInput
    _max?: PostMaxOrderByAggregateInput
    _min?: PostMinOrderByAggregateInput
    _sum?: PostSumOrderByAggregateInput
  }

  export type PostScalarWhereWithAggregatesInput = {
    AND?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    OR?: PostScalarWhereWithAggregatesInput[]
    NOT?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Post"> | number
    name?: StringWithAggregatesFilter<"Post"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
  }

  export type UserProfileWhereInput = {
    AND?: UserProfileWhereInput | UserProfileWhereInput[]
    OR?: UserProfileWhereInput[]
    NOT?: UserProfileWhereInput | UserProfileWhereInput[]
    id?: UuidFilter<"UserProfile"> | string
    tags?: StringNullableListFilter<"UserProfile">
    age?: IntNullableFilter<"UserProfile"> | number | null
    location?: StringNullableFilter<"UserProfile"> | string | null
    locationId?: StringNullableFilter<"UserProfile"> | string | null
    gender?: StringNullableFilter<"UserProfile"> | string | null
    weeklyDigestEnabled?: BoolFilter<"UserProfile"> | boolean
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
  }

  export type UserProfileOrderByWithRelationInput = {
    id?: SortOrder
    tags?: SortOrder
    age?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    locationId?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    weeklyDigestEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserProfileWhereInput | UserProfileWhereInput[]
    OR?: UserProfileWhereInput[]
    NOT?: UserProfileWhereInput | UserProfileWhereInput[]
    tags?: StringNullableListFilter<"UserProfile">
    age?: IntNullableFilter<"UserProfile"> | number | null
    location?: StringNullableFilter<"UserProfile"> | string | null
    locationId?: StringNullableFilter<"UserProfile"> | string | null
    gender?: StringNullableFilter<"UserProfile"> | string | null
    weeklyDigestEnabled?: BoolFilter<"UserProfile"> | boolean
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
  }, "id">

  export type UserProfileOrderByWithAggregationInput = {
    id?: SortOrder
    tags?: SortOrder
    age?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    locationId?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    weeklyDigestEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserProfileCountOrderByAggregateInput
    _avg?: UserProfileAvgOrderByAggregateInput
    _max?: UserProfileMaxOrderByAggregateInput
    _min?: UserProfileMinOrderByAggregateInput
    _sum?: UserProfileSumOrderByAggregateInput
  }

  export type UserProfileScalarWhereWithAggregatesInput = {
    AND?: UserProfileScalarWhereWithAggregatesInput | UserProfileScalarWhereWithAggregatesInput[]
    OR?: UserProfileScalarWhereWithAggregatesInput[]
    NOT?: UserProfileScalarWhereWithAggregatesInput | UserProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"UserProfile"> | string
    tags?: StringNullableListFilter<"UserProfile">
    age?: IntNullableWithAggregatesFilter<"UserProfile"> | number | null
    location?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    locationId?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    gender?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    weeklyDigestEnabled?: BoolWithAggregatesFilter<"UserProfile"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserProfile"> | Date | string
  }

  export type MunicipalityWhereInput = {
    AND?: MunicipalityWhereInput | MunicipalityWhereInput[]
    OR?: MunicipalityWhereInput[]
    NOT?: MunicipalityWhereInput | MunicipalityWhereInput[]
    id?: UuidFilter<"Municipality"> | string
    key?: StringFilter<"Municipality"> | string
    city?: StringFilter<"Municipality"> | string
    state?: StringFilter<"Municipality"> | string
    label?: StringFilter<"Municipality"> | string
    ordinances?: OrdinanceListRelationFilter
  }

  export type MunicipalityOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    city?: SortOrder
    state?: SortOrder
    label?: SortOrder
    ordinances?: OrdinanceOrderByRelationAggregateInput
  }

  export type MunicipalityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    key?: string
    AND?: MunicipalityWhereInput | MunicipalityWhereInput[]
    OR?: MunicipalityWhereInput[]
    NOT?: MunicipalityWhereInput | MunicipalityWhereInput[]
    city?: StringFilter<"Municipality"> | string
    state?: StringFilter<"Municipality"> | string
    label?: StringFilter<"Municipality"> | string
    ordinances?: OrdinanceListRelationFilter
  }, "id" | "key">

  export type MunicipalityOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    city?: SortOrder
    state?: SortOrder
    label?: SortOrder
    _count?: MunicipalityCountOrderByAggregateInput
    _max?: MunicipalityMaxOrderByAggregateInput
    _min?: MunicipalityMinOrderByAggregateInput
  }

  export type MunicipalityScalarWhereWithAggregatesInput = {
    AND?: MunicipalityScalarWhereWithAggregatesInput | MunicipalityScalarWhereWithAggregatesInput[]
    OR?: MunicipalityScalarWhereWithAggregatesInput[]
    NOT?: MunicipalityScalarWhereWithAggregatesInput | MunicipalityScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Municipality"> | string
    key?: StringWithAggregatesFilter<"Municipality"> | string
    city?: StringWithAggregatesFilter<"Municipality"> | string
    state?: StringWithAggregatesFilter<"Municipality"> | string
    label?: StringWithAggregatesFilter<"Municipality"> | string
  }

  export type IngestionRunWhereInput = {
    AND?: IngestionRunWhereInput | IngestionRunWhereInput[]
    OR?: IngestionRunWhereInput[]
    NOT?: IngestionRunWhereInput | IngestionRunWhereInput[]
    id?: UuidFilter<"IngestionRun"> | string
    windowStart?: DateTimeFilter<"IngestionRun"> | Date | string
    windowEnd?: DateTimeFilter<"IngestionRun"> | Date | string
    cities?: JsonFilter<"IngestionRun">
    skippedCount?: IntFilter<"IngestionRun"> | number
    status?: StringFilter<"IngestionRun"> | string
    providerJobId?: StringNullableFilter<"IngestionRun"> | string | null
    coverage?: JsonNullableFilter<"IngestionRun">
    creditsUsed?: FloatNullableFilter<"IngestionRun"> | number | null
    rejectedCount?: IntFilter<"IngestionRun"> | number
    failureCode?: StringNullableFilter<"IngestionRun"> | string | null
    createdAt?: DateTimeFilter<"IngestionRun"> | Date | string
    completedAt?: DateTimeNullableFilter<"IngestionRun"> | Date | string | null
    changes?: OrdinanceChangeListRelationFilter
  }

  export type IngestionRunOrderByWithRelationInput = {
    id?: SortOrder
    windowStart?: SortOrder
    windowEnd?: SortOrder
    cities?: SortOrder
    skippedCount?: SortOrder
    status?: SortOrder
    providerJobId?: SortOrderInput | SortOrder
    coverage?: SortOrderInput | SortOrder
    creditsUsed?: SortOrderInput | SortOrder
    rejectedCount?: SortOrder
    failureCode?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    changes?: OrdinanceChangeOrderByRelationAggregateInput
  }

  export type IngestionRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    windowEnd?: Date | string
    providerJobId?: string
    AND?: IngestionRunWhereInput | IngestionRunWhereInput[]
    OR?: IngestionRunWhereInput[]
    NOT?: IngestionRunWhereInput | IngestionRunWhereInput[]
    windowStart?: DateTimeFilter<"IngestionRun"> | Date | string
    cities?: JsonFilter<"IngestionRun">
    skippedCount?: IntFilter<"IngestionRun"> | number
    status?: StringFilter<"IngestionRun"> | string
    coverage?: JsonNullableFilter<"IngestionRun">
    creditsUsed?: FloatNullableFilter<"IngestionRun"> | number | null
    rejectedCount?: IntFilter<"IngestionRun"> | number
    failureCode?: StringNullableFilter<"IngestionRun"> | string | null
    createdAt?: DateTimeFilter<"IngestionRun"> | Date | string
    completedAt?: DateTimeNullableFilter<"IngestionRun"> | Date | string | null
    changes?: OrdinanceChangeListRelationFilter
  }, "id" | "windowEnd" | "providerJobId">

  export type IngestionRunOrderByWithAggregationInput = {
    id?: SortOrder
    windowStart?: SortOrder
    windowEnd?: SortOrder
    cities?: SortOrder
    skippedCount?: SortOrder
    status?: SortOrder
    providerJobId?: SortOrderInput | SortOrder
    coverage?: SortOrderInput | SortOrder
    creditsUsed?: SortOrderInput | SortOrder
    rejectedCount?: SortOrder
    failureCode?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: IngestionRunCountOrderByAggregateInput
    _avg?: IngestionRunAvgOrderByAggregateInput
    _max?: IngestionRunMaxOrderByAggregateInput
    _min?: IngestionRunMinOrderByAggregateInput
    _sum?: IngestionRunSumOrderByAggregateInput
  }

  export type IngestionRunScalarWhereWithAggregatesInput = {
    AND?: IngestionRunScalarWhereWithAggregatesInput | IngestionRunScalarWhereWithAggregatesInput[]
    OR?: IngestionRunScalarWhereWithAggregatesInput[]
    NOT?: IngestionRunScalarWhereWithAggregatesInput | IngestionRunScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"IngestionRun"> | string
    windowStart?: DateTimeWithAggregatesFilter<"IngestionRun"> | Date | string
    windowEnd?: DateTimeWithAggregatesFilter<"IngestionRun"> | Date | string
    cities?: JsonWithAggregatesFilter<"IngestionRun">
    skippedCount?: IntWithAggregatesFilter<"IngestionRun"> | number
    status?: StringWithAggregatesFilter<"IngestionRun"> | string
    providerJobId?: StringNullableWithAggregatesFilter<"IngestionRun"> | string | null
    coverage?: JsonNullableWithAggregatesFilter<"IngestionRun">
    creditsUsed?: FloatNullableWithAggregatesFilter<"IngestionRun"> | number | null
    rejectedCount?: IntWithAggregatesFilter<"IngestionRun"> | number
    failureCode?: StringNullableWithAggregatesFilter<"IngestionRun"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"IngestionRun"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"IngestionRun"> | Date | string | null
  }

  export type OrdinanceWhereInput = {
    AND?: OrdinanceWhereInput | OrdinanceWhereInput[]
    OR?: OrdinanceWhereInput[]
    NOT?: OrdinanceWhereInput | OrdinanceWhereInput[]
    id?: UuidFilter<"Ordinance"> | string
    municipalityId?: UuidFilter<"Ordinance"> | string
    identityKey?: StringFilter<"Ordinance"> | string
    sourceIdentifier?: StringNullableFilter<"Ordinance"> | string | null
    name?: StringFilter<"Ordinance"> | string
    description?: StringFilter<"Ordinance"> | string
    stage?: StringFilter<"Ordinance"> | string
    originalStage?: StringFilter<"Ordinance"> | string
    topics?: StringNullableListFilter<"Ordinance">
    sourceUrl?: StringFilter<"Ordinance"> | string
    adoptedDate?: StringNullableFilter<"Ordinance"> | string | null
    effectiveDate?: StringNullableFilter<"Ordinance"> | string | null
    latestActivity?: StringFilter<"Ordinance"> | string
    firstObservedAt?: DateTimeFilter<"Ordinance"> | Date | string
    lastObservedAt?: DateTimeFilter<"Ordinance"> | Date | string
    municipality?: XOR<MunicipalityScalarRelationFilter, MunicipalityWhereInput>
    changes?: OrdinanceChangeListRelationFilter
  }

  export type OrdinanceOrderByWithRelationInput = {
    id?: SortOrder
    municipalityId?: SortOrder
    identityKey?: SortOrder
    sourceIdentifier?: SortOrderInput | SortOrder
    name?: SortOrder
    description?: SortOrder
    stage?: SortOrder
    originalStage?: SortOrder
    topics?: SortOrder
    sourceUrl?: SortOrder
    adoptedDate?: SortOrderInput | SortOrder
    effectiveDate?: SortOrderInput | SortOrder
    latestActivity?: SortOrder
    firstObservedAt?: SortOrder
    lastObservedAt?: SortOrder
    municipality?: MunicipalityOrderByWithRelationInput
    changes?: OrdinanceChangeOrderByRelationAggregateInput
  }

  export type OrdinanceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    municipalityId_identityKey?: OrdinanceMunicipalityIdIdentityKeyCompoundUniqueInput
    AND?: OrdinanceWhereInput | OrdinanceWhereInput[]
    OR?: OrdinanceWhereInput[]
    NOT?: OrdinanceWhereInput | OrdinanceWhereInput[]
    municipalityId?: UuidFilter<"Ordinance"> | string
    identityKey?: StringFilter<"Ordinance"> | string
    sourceIdentifier?: StringNullableFilter<"Ordinance"> | string | null
    name?: StringFilter<"Ordinance"> | string
    description?: StringFilter<"Ordinance"> | string
    stage?: StringFilter<"Ordinance"> | string
    originalStage?: StringFilter<"Ordinance"> | string
    topics?: StringNullableListFilter<"Ordinance">
    sourceUrl?: StringFilter<"Ordinance"> | string
    adoptedDate?: StringNullableFilter<"Ordinance"> | string | null
    effectiveDate?: StringNullableFilter<"Ordinance"> | string | null
    latestActivity?: StringFilter<"Ordinance"> | string
    firstObservedAt?: DateTimeFilter<"Ordinance"> | Date | string
    lastObservedAt?: DateTimeFilter<"Ordinance"> | Date | string
    municipality?: XOR<MunicipalityScalarRelationFilter, MunicipalityWhereInput>
    changes?: OrdinanceChangeListRelationFilter
  }, "id" | "municipalityId_identityKey">

  export type OrdinanceOrderByWithAggregationInput = {
    id?: SortOrder
    municipalityId?: SortOrder
    identityKey?: SortOrder
    sourceIdentifier?: SortOrderInput | SortOrder
    name?: SortOrder
    description?: SortOrder
    stage?: SortOrder
    originalStage?: SortOrder
    topics?: SortOrder
    sourceUrl?: SortOrder
    adoptedDate?: SortOrderInput | SortOrder
    effectiveDate?: SortOrderInput | SortOrder
    latestActivity?: SortOrder
    firstObservedAt?: SortOrder
    lastObservedAt?: SortOrder
    _count?: OrdinanceCountOrderByAggregateInput
    _max?: OrdinanceMaxOrderByAggregateInput
    _min?: OrdinanceMinOrderByAggregateInput
  }

  export type OrdinanceScalarWhereWithAggregatesInput = {
    AND?: OrdinanceScalarWhereWithAggregatesInput | OrdinanceScalarWhereWithAggregatesInput[]
    OR?: OrdinanceScalarWhereWithAggregatesInput[]
    NOT?: OrdinanceScalarWhereWithAggregatesInput | OrdinanceScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Ordinance"> | string
    municipalityId?: UuidWithAggregatesFilter<"Ordinance"> | string
    identityKey?: StringWithAggregatesFilter<"Ordinance"> | string
    sourceIdentifier?: StringNullableWithAggregatesFilter<"Ordinance"> | string | null
    name?: StringWithAggregatesFilter<"Ordinance"> | string
    description?: StringWithAggregatesFilter<"Ordinance"> | string
    stage?: StringWithAggregatesFilter<"Ordinance"> | string
    originalStage?: StringWithAggregatesFilter<"Ordinance"> | string
    topics?: StringNullableListFilter<"Ordinance">
    sourceUrl?: StringWithAggregatesFilter<"Ordinance"> | string
    adoptedDate?: StringNullableWithAggregatesFilter<"Ordinance"> | string | null
    effectiveDate?: StringNullableWithAggregatesFilter<"Ordinance"> | string | null
    latestActivity?: StringWithAggregatesFilter<"Ordinance"> | string
    firstObservedAt?: DateTimeWithAggregatesFilter<"Ordinance"> | Date | string
    lastObservedAt?: DateTimeWithAggregatesFilter<"Ordinance"> | Date | string
  }

  export type OrdinanceChangeWhereInput = {
    AND?: OrdinanceChangeWhereInput | OrdinanceChangeWhereInput[]
    OR?: OrdinanceChangeWhereInput[]
    NOT?: OrdinanceChangeWhereInput | OrdinanceChangeWhereInput[]
    id?: UuidFilter<"OrdinanceChange"> | string
    ordinanceId?: UuidFilter<"OrdinanceChange"> | string
    ingestionRunId?: UuidFilter<"OrdinanceChange"> | string
    dedupeKey?: StringFilter<"OrdinanceChange"> | string
    activityType?: StringFilter<"OrdinanceChange"> | string
    activityDate?: StringFilter<"OrdinanceChange"> | string
    activityAt?: DateTimeNullableFilter<"OrdinanceChange"> | Date | string | null
    description?: StringFilter<"OrdinanceChange"> | string
    evidenceUrl?: StringFilter<"OrdinanceChange"> | string
    evidenceExcerpt?: StringFilter<"OrdinanceChange"> | string
    discoveredAt?: DateTimeFilter<"OrdinanceChange"> | Date | string
    ordinance?: XOR<OrdinanceScalarRelationFilter, OrdinanceWhereInput>
    ingestionRun?: XOR<IngestionRunScalarRelationFilter, IngestionRunWhereInput>
  }

  export type OrdinanceChangeOrderByWithRelationInput = {
    id?: SortOrder
    ordinanceId?: SortOrder
    ingestionRunId?: SortOrder
    dedupeKey?: SortOrder
    activityType?: SortOrder
    activityDate?: SortOrder
    activityAt?: SortOrderInput | SortOrder
    description?: SortOrder
    evidenceUrl?: SortOrder
    evidenceExcerpt?: SortOrder
    discoveredAt?: SortOrder
    ordinance?: OrdinanceOrderByWithRelationInput
    ingestionRun?: IngestionRunOrderByWithRelationInput
  }

  export type OrdinanceChangeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    dedupeKey?: string
    AND?: OrdinanceChangeWhereInput | OrdinanceChangeWhereInput[]
    OR?: OrdinanceChangeWhereInput[]
    NOT?: OrdinanceChangeWhereInput | OrdinanceChangeWhereInput[]
    ordinanceId?: UuidFilter<"OrdinanceChange"> | string
    ingestionRunId?: UuidFilter<"OrdinanceChange"> | string
    activityType?: StringFilter<"OrdinanceChange"> | string
    activityDate?: StringFilter<"OrdinanceChange"> | string
    activityAt?: DateTimeNullableFilter<"OrdinanceChange"> | Date | string | null
    description?: StringFilter<"OrdinanceChange"> | string
    evidenceUrl?: StringFilter<"OrdinanceChange"> | string
    evidenceExcerpt?: StringFilter<"OrdinanceChange"> | string
    discoveredAt?: DateTimeFilter<"OrdinanceChange"> | Date | string
    ordinance?: XOR<OrdinanceScalarRelationFilter, OrdinanceWhereInput>
    ingestionRun?: XOR<IngestionRunScalarRelationFilter, IngestionRunWhereInput>
  }, "id" | "dedupeKey">

  export type OrdinanceChangeOrderByWithAggregationInput = {
    id?: SortOrder
    ordinanceId?: SortOrder
    ingestionRunId?: SortOrder
    dedupeKey?: SortOrder
    activityType?: SortOrder
    activityDate?: SortOrder
    activityAt?: SortOrderInput | SortOrder
    description?: SortOrder
    evidenceUrl?: SortOrder
    evidenceExcerpt?: SortOrder
    discoveredAt?: SortOrder
    _count?: OrdinanceChangeCountOrderByAggregateInput
    _max?: OrdinanceChangeMaxOrderByAggregateInput
    _min?: OrdinanceChangeMinOrderByAggregateInput
  }

  export type OrdinanceChangeScalarWhereWithAggregatesInput = {
    AND?: OrdinanceChangeScalarWhereWithAggregatesInput | OrdinanceChangeScalarWhereWithAggregatesInput[]
    OR?: OrdinanceChangeScalarWhereWithAggregatesInput[]
    NOT?: OrdinanceChangeScalarWhereWithAggregatesInput | OrdinanceChangeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"OrdinanceChange"> | string
    ordinanceId?: UuidWithAggregatesFilter<"OrdinanceChange"> | string
    ingestionRunId?: UuidWithAggregatesFilter<"OrdinanceChange"> | string
    dedupeKey?: StringWithAggregatesFilter<"OrdinanceChange"> | string
    activityType?: StringWithAggregatesFilter<"OrdinanceChange"> | string
    activityDate?: StringWithAggregatesFilter<"OrdinanceChange"> | string
    activityAt?: DateTimeNullableWithAggregatesFilter<"OrdinanceChange"> | Date | string | null
    description?: StringWithAggregatesFilter<"OrdinanceChange"> | string
    evidenceUrl?: StringWithAggregatesFilter<"OrdinanceChange"> | string
    evidenceExcerpt?: StringWithAggregatesFilter<"OrdinanceChange"> | string
    discoveredAt?: DateTimeWithAggregatesFilter<"OrdinanceChange"> | Date | string
  }

  export type PostCreateInput = {
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostUncheckedCreateInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostCreateManyInput = {
    id?: number
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileCreateInput = {
    id: string
    tags?: UserProfileCreatetagsInput | string[]
    age?: number | null
    location?: string | null
    locationId?: string | null
    gender?: string | null
    weeklyDigestEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileUncheckedCreateInput = {
    id: string
    tags?: UserProfileCreatetagsInput | string[]
    age?: number | null
    location?: string | null
    locationId?: string | null
    gender?: string | null
    weeklyDigestEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tags?: UserProfileUpdatetagsInput | string[]
    age?: NullableIntFieldUpdateOperationsInput | number | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    weeklyDigestEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tags?: UserProfileUpdatetagsInput | string[]
    age?: NullableIntFieldUpdateOperationsInput | number | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    weeklyDigestEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileCreateManyInput = {
    id: string
    tags?: UserProfileCreatetagsInput | string[]
    age?: number | null
    location?: string | null
    locationId?: string | null
    gender?: string | null
    weeklyDigestEnabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tags?: UserProfileUpdatetagsInput | string[]
    age?: NullableIntFieldUpdateOperationsInput | number | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    weeklyDigestEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tags?: UserProfileUpdatetagsInput | string[]
    age?: NullableIntFieldUpdateOperationsInput | number | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    locationId?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    weeklyDigestEnabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MunicipalityCreateInput = {
    id?: string
    key: string
    city: string
    state: string
    label: string
    ordinances?: OrdinanceCreateNestedManyWithoutMunicipalityInput
  }

  export type MunicipalityUncheckedCreateInput = {
    id?: string
    key: string
    city: string
    state: string
    label: string
    ordinances?: OrdinanceUncheckedCreateNestedManyWithoutMunicipalityInput
  }

  export type MunicipalityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    ordinances?: OrdinanceUpdateManyWithoutMunicipalityNestedInput
  }

  export type MunicipalityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    ordinances?: OrdinanceUncheckedUpdateManyWithoutMunicipalityNestedInput
  }

  export type MunicipalityCreateManyInput = {
    id?: string
    key: string
    city: string
    state: string
    label: string
  }

  export type MunicipalityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
  }

  export type MunicipalityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
  }

  export type IngestionRunCreateInput = {
    id?: string
    windowStart: Date | string
    windowEnd: Date | string
    cities: JsonNullValueInput | InputJsonValue
    skippedCount?: number
    status?: string
    providerJobId?: string | null
    coverage?: NullableJsonNullValueInput | InputJsonValue
    creditsUsed?: number | null
    rejectedCount?: number
    failureCode?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    changes?: OrdinanceChangeCreateNestedManyWithoutIngestionRunInput
  }

  export type IngestionRunUncheckedCreateInput = {
    id?: string
    windowStart: Date | string
    windowEnd: Date | string
    cities: JsonNullValueInput | InputJsonValue
    skippedCount?: number
    status?: string
    providerJobId?: string | null
    coverage?: NullableJsonNullValueInput | InputJsonValue
    creditsUsed?: number | null
    rejectedCount?: number
    failureCode?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    changes?: OrdinanceChangeUncheckedCreateNestedManyWithoutIngestionRunInput
  }

  export type IngestionRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    windowStart?: DateTimeFieldUpdateOperationsInput | Date | string
    windowEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cities?: JsonNullValueInput | InputJsonValue
    skippedCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    providerJobId?: NullableStringFieldUpdateOperationsInput | string | null
    coverage?: NullableJsonNullValueInput | InputJsonValue
    creditsUsed?: NullableFloatFieldUpdateOperationsInput | number | null
    rejectedCount?: IntFieldUpdateOperationsInput | number
    failureCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    changes?: OrdinanceChangeUpdateManyWithoutIngestionRunNestedInput
  }

  export type IngestionRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    windowStart?: DateTimeFieldUpdateOperationsInput | Date | string
    windowEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cities?: JsonNullValueInput | InputJsonValue
    skippedCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    providerJobId?: NullableStringFieldUpdateOperationsInput | string | null
    coverage?: NullableJsonNullValueInput | InputJsonValue
    creditsUsed?: NullableFloatFieldUpdateOperationsInput | number | null
    rejectedCount?: IntFieldUpdateOperationsInput | number
    failureCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    changes?: OrdinanceChangeUncheckedUpdateManyWithoutIngestionRunNestedInput
  }

  export type IngestionRunCreateManyInput = {
    id?: string
    windowStart: Date | string
    windowEnd: Date | string
    cities: JsonNullValueInput | InputJsonValue
    skippedCount?: number
    status?: string
    providerJobId?: string | null
    coverage?: NullableJsonNullValueInput | InputJsonValue
    creditsUsed?: number | null
    rejectedCount?: number
    failureCode?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type IngestionRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    windowStart?: DateTimeFieldUpdateOperationsInput | Date | string
    windowEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cities?: JsonNullValueInput | InputJsonValue
    skippedCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    providerJobId?: NullableStringFieldUpdateOperationsInput | string | null
    coverage?: NullableJsonNullValueInput | InputJsonValue
    creditsUsed?: NullableFloatFieldUpdateOperationsInput | number | null
    rejectedCount?: IntFieldUpdateOperationsInput | number
    failureCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IngestionRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    windowStart?: DateTimeFieldUpdateOperationsInput | Date | string
    windowEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cities?: JsonNullValueInput | InputJsonValue
    skippedCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    providerJobId?: NullableStringFieldUpdateOperationsInput | string | null
    coverage?: NullableJsonNullValueInput | InputJsonValue
    creditsUsed?: NullableFloatFieldUpdateOperationsInput | number | null
    rejectedCount?: IntFieldUpdateOperationsInput | number
    failureCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OrdinanceCreateInput = {
    id?: string
    identityKey: string
    sourceIdentifier?: string | null
    name: string
    description: string
    stage: string
    originalStage: string
    topics?: OrdinanceCreatetopicsInput | string[]
    sourceUrl: string
    adoptedDate?: string | null
    effectiveDate?: string | null
    latestActivity: string
    firstObservedAt?: Date | string
    lastObservedAt?: Date | string
    municipality: MunicipalityCreateNestedOneWithoutOrdinancesInput
    changes?: OrdinanceChangeCreateNestedManyWithoutOrdinanceInput
  }

  export type OrdinanceUncheckedCreateInput = {
    id?: string
    municipalityId: string
    identityKey: string
    sourceIdentifier?: string | null
    name: string
    description: string
    stage: string
    originalStage: string
    topics?: OrdinanceCreatetopicsInput | string[]
    sourceUrl: string
    adoptedDate?: string | null
    effectiveDate?: string | null
    latestActivity: string
    firstObservedAt?: Date | string
    lastObservedAt?: Date | string
    changes?: OrdinanceChangeUncheckedCreateNestedManyWithoutOrdinanceInput
  }

  export type OrdinanceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identityKey?: StringFieldUpdateOperationsInput | string
    sourceIdentifier?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    originalStage?: StringFieldUpdateOperationsInput | string
    topics?: OrdinanceUpdatetopicsInput | string[]
    sourceUrl?: StringFieldUpdateOperationsInput | string
    adoptedDate?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableStringFieldUpdateOperationsInput | string | null
    latestActivity?: StringFieldUpdateOperationsInput | string
    firstObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    municipality?: MunicipalityUpdateOneRequiredWithoutOrdinancesNestedInput
    changes?: OrdinanceChangeUpdateManyWithoutOrdinanceNestedInput
  }

  export type OrdinanceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    municipalityId?: StringFieldUpdateOperationsInput | string
    identityKey?: StringFieldUpdateOperationsInput | string
    sourceIdentifier?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    originalStage?: StringFieldUpdateOperationsInput | string
    topics?: OrdinanceUpdatetopicsInput | string[]
    sourceUrl?: StringFieldUpdateOperationsInput | string
    adoptedDate?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableStringFieldUpdateOperationsInput | string | null
    latestActivity?: StringFieldUpdateOperationsInput | string
    firstObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    changes?: OrdinanceChangeUncheckedUpdateManyWithoutOrdinanceNestedInput
  }

  export type OrdinanceCreateManyInput = {
    id?: string
    municipalityId: string
    identityKey: string
    sourceIdentifier?: string | null
    name: string
    description: string
    stage: string
    originalStage: string
    topics?: OrdinanceCreatetopicsInput | string[]
    sourceUrl: string
    adoptedDate?: string | null
    effectiveDate?: string | null
    latestActivity: string
    firstObservedAt?: Date | string
    lastObservedAt?: Date | string
  }

  export type OrdinanceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    identityKey?: StringFieldUpdateOperationsInput | string
    sourceIdentifier?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    originalStage?: StringFieldUpdateOperationsInput | string
    topics?: OrdinanceUpdatetopicsInput | string[]
    sourceUrl?: StringFieldUpdateOperationsInput | string
    adoptedDate?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableStringFieldUpdateOperationsInput | string | null
    latestActivity?: StringFieldUpdateOperationsInput | string
    firstObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdinanceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    municipalityId?: StringFieldUpdateOperationsInput | string
    identityKey?: StringFieldUpdateOperationsInput | string
    sourceIdentifier?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    originalStage?: StringFieldUpdateOperationsInput | string
    topics?: OrdinanceUpdatetopicsInput | string[]
    sourceUrl?: StringFieldUpdateOperationsInput | string
    adoptedDate?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableStringFieldUpdateOperationsInput | string | null
    latestActivity?: StringFieldUpdateOperationsInput | string
    firstObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdinanceChangeCreateInput = {
    id?: string
    dedupeKey: string
    activityType: string
    activityDate: string
    activityAt?: Date | string | null
    description: string
    evidenceUrl: string
    evidenceExcerpt: string
    discoveredAt?: Date | string
    ordinance: OrdinanceCreateNestedOneWithoutChangesInput
    ingestionRun: IngestionRunCreateNestedOneWithoutChangesInput
  }

  export type OrdinanceChangeUncheckedCreateInput = {
    id?: string
    ordinanceId: string
    ingestionRunId: string
    dedupeKey: string
    activityType: string
    activityDate: string
    activityAt?: Date | string | null
    description: string
    evidenceUrl: string
    evidenceExcerpt: string
    discoveredAt?: Date | string
  }

  export type OrdinanceChangeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dedupeKey?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    activityDate?: StringFieldUpdateOperationsInput | string
    activityAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidenceUrl?: StringFieldUpdateOperationsInput | string
    evidenceExcerpt?: StringFieldUpdateOperationsInput | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ordinance?: OrdinanceUpdateOneRequiredWithoutChangesNestedInput
    ingestionRun?: IngestionRunUpdateOneRequiredWithoutChangesNestedInput
  }

  export type OrdinanceChangeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ordinanceId?: StringFieldUpdateOperationsInput | string
    ingestionRunId?: StringFieldUpdateOperationsInput | string
    dedupeKey?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    activityDate?: StringFieldUpdateOperationsInput | string
    activityAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidenceUrl?: StringFieldUpdateOperationsInput | string
    evidenceExcerpt?: StringFieldUpdateOperationsInput | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdinanceChangeCreateManyInput = {
    id?: string
    ordinanceId: string
    ingestionRunId: string
    dedupeKey: string
    activityType: string
    activityDate: string
    activityAt?: Date | string | null
    description: string
    evidenceUrl: string
    evidenceExcerpt: string
    discoveredAt?: Date | string
  }

  export type OrdinanceChangeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    dedupeKey?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    activityDate?: StringFieldUpdateOperationsInput | string
    activityAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidenceUrl?: StringFieldUpdateOperationsInput | string
    evidenceExcerpt?: StringFieldUpdateOperationsInput | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdinanceChangeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ordinanceId?: StringFieldUpdateOperationsInput | string
    ingestionRunId?: StringFieldUpdateOperationsInput | string
    dedupeKey?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    activityDate?: StringFieldUpdateOperationsInput | string
    activityAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidenceUrl?: StringFieldUpdateOperationsInput | string
    evidenceExcerpt?: StringFieldUpdateOperationsInput | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PostCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PostAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PostMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PostMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PostSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserProfileCountOrderByAggregateInput = {
    id?: SortOrder
    tags?: SortOrder
    age?: SortOrder
    location?: SortOrder
    locationId?: SortOrder
    gender?: SortOrder
    weeklyDigestEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserProfileAvgOrderByAggregateInput = {
    age?: SortOrder
  }

  export type UserProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    age?: SortOrder
    location?: SortOrder
    locationId?: SortOrder
    gender?: SortOrder
    weeklyDigestEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserProfileMinOrderByAggregateInput = {
    id?: SortOrder
    age?: SortOrder
    location?: SortOrder
    locationId?: SortOrder
    gender?: SortOrder
    weeklyDigestEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserProfileSumOrderByAggregateInput = {
    age?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type OrdinanceListRelationFilter = {
    every?: OrdinanceWhereInput
    some?: OrdinanceWhereInput
    none?: OrdinanceWhereInput
  }

  export type OrdinanceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MunicipalityCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    city?: SortOrder
    state?: SortOrder
    label?: SortOrder
  }

  export type MunicipalityMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    city?: SortOrder
    state?: SortOrder
    label?: SortOrder
  }

  export type MunicipalityMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    city?: SortOrder
    state?: SortOrder
    label?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type OrdinanceChangeListRelationFilter = {
    every?: OrdinanceChangeWhereInput
    some?: OrdinanceChangeWhereInput
    none?: OrdinanceChangeWhereInput
  }

  export type OrdinanceChangeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type IngestionRunCountOrderByAggregateInput = {
    id?: SortOrder
    windowStart?: SortOrder
    windowEnd?: SortOrder
    cities?: SortOrder
    skippedCount?: SortOrder
    status?: SortOrder
    providerJobId?: SortOrder
    coverage?: SortOrder
    creditsUsed?: SortOrder
    rejectedCount?: SortOrder
    failureCode?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type IngestionRunAvgOrderByAggregateInput = {
    skippedCount?: SortOrder
    creditsUsed?: SortOrder
    rejectedCount?: SortOrder
  }

  export type IngestionRunMaxOrderByAggregateInput = {
    id?: SortOrder
    windowStart?: SortOrder
    windowEnd?: SortOrder
    skippedCount?: SortOrder
    status?: SortOrder
    providerJobId?: SortOrder
    creditsUsed?: SortOrder
    rejectedCount?: SortOrder
    failureCode?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type IngestionRunMinOrderByAggregateInput = {
    id?: SortOrder
    windowStart?: SortOrder
    windowEnd?: SortOrder
    skippedCount?: SortOrder
    status?: SortOrder
    providerJobId?: SortOrder
    creditsUsed?: SortOrder
    rejectedCount?: SortOrder
    failureCode?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type IngestionRunSumOrderByAggregateInput = {
    skippedCount?: SortOrder
    creditsUsed?: SortOrder
    rejectedCount?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type MunicipalityScalarRelationFilter = {
    is?: MunicipalityWhereInput
    isNot?: MunicipalityWhereInput
  }

  export type OrdinanceMunicipalityIdIdentityKeyCompoundUniqueInput = {
    municipalityId: string
    identityKey: string
  }

  export type OrdinanceCountOrderByAggregateInput = {
    id?: SortOrder
    municipalityId?: SortOrder
    identityKey?: SortOrder
    sourceIdentifier?: SortOrder
    name?: SortOrder
    description?: SortOrder
    stage?: SortOrder
    originalStage?: SortOrder
    topics?: SortOrder
    sourceUrl?: SortOrder
    adoptedDate?: SortOrder
    effectiveDate?: SortOrder
    latestActivity?: SortOrder
    firstObservedAt?: SortOrder
    lastObservedAt?: SortOrder
  }

  export type OrdinanceMaxOrderByAggregateInput = {
    id?: SortOrder
    municipalityId?: SortOrder
    identityKey?: SortOrder
    sourceIdentifier?: SortOrder
    name?: SortOrder
    description?: SortOrder
    stage?: SortOrder
    originalStage?: SortOrder
    sourceUrl?: SortOrder
    adoptedDate?: SortOrder
    effectiveDate?: SortOrder
    latestActivity?: SortOrder
    firstObservedAt?: SortOrder
    lastObservedAt?: SortOrder
  }

  export type OrdinanceMinOrderByAggregateInput = {
    id?: SortOrder
    municipalityId?: SortOrder
    identityKey?: SortOrder
    sourceIdentifier?: SortOrder
    name?: SortOrder
    description?: SortOrder
    stage?: SortOrder
    originalStage?: SortOrder
    sourceUrl?: SortOrder
    adoptedDate?: SortOrder
    effectiveDate?: SortOrder
    latestActivity?: SortOrder
    firstObservedAt?: SortOrder
    lastObservedAt?: SortOrder
  }

  export type OrdinanceScalarRelationFilter = {
    is?: OrdinanceWhereInput
    isNot?: OrdinanceWhereInput
  }

  export type IngestionRunScalarRelationFilter = {
    is?: IngestionRunWhereInput
    isNot?: IngestionRunWhereInput
  }

  export type OrdinanceChangeCountOrderByAggregateInput = {
    id?: SortOrder
    ordinanceId?: SortOrder
    ingestionRunId?: SortOrder
    dedupeKey?: SortOrder
    activityType?: SortOrder
    activityDate?: SortOrder
    activityAt?: SortOrder
    description?: SortOrder
    evidenceUrl?: SortOrder
    evidenceExcerpt?: SortOrder
    discoveredAt?: SortOrder
  }

  export type OrdinanceChangeMaxOrderByAggregateInput = {
    id?: SortOrder
    ordinanceId?: SortOrder
    ingestionRunId?: SortOrder
    dedupeKey?: SortOrder
    activityType?: SortOrder
    activityDate?: SortOrder
    activityAt?: SortOrder
    description?: SortOrder
    evidenceUrl?: SortOrder
    evidenceExcerpt?: SortOrder
    discoveredAt?: SortOrder
  }

  export type OrdinanceChangeMinOrderByAggregateInput = {
    id?: SortOrder
    ordinanceId?: SortOrder
    ingestionRunId?: SortOrder
    dedupeKey?: SortOrder
    activityType?: SortOrder
    activityDate?: SortOrder
    activityAt?: SortOrder
    description?: SortOrder
    evidenceUrl?: SortOrder
    evidenceExcerpt?: SortOrder
    discoveredAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserProfileCreatetagsInput = {
    set: string[]
  }

  export type UserProfileUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type OrdinanceCreateNestedManyWithoutMunicipalityInput = {
    create?: XOR<OrdinanceCreateWithoutMunicipalityInput, OrdinanceUncheckedCreateWithoutMunicipalityInput> | OrdinanceCreateWithoutMunicipalityInput[] | OrdinanceUncheckedCreateWithoutMunicipalityInput[]
    connectOrCreate?: OrdinanceCreateOrConnectWithoutMunicipalityInput | OrdinanceCreateOrConnectWithoutMunicipalityInput[]
    createMany?: OrdinanceCreateManyMunicipalityInputEnvelope
    connect?: OrdinanceWhereUniqueInput | OrdinanceWhereUniqueInput[]
  }

  export type OrdinanceUncheckedCreateNestedManyWithoutMunicipalityInput = {
    create?: XOR<OrdinanceCreateWithoutMunicipalityInput, OrdinanceUncheckedCreateWithoutMunicipalityInput> | OrdinanceCreateWithoutMunicipalityInput[] | OrdinanceUncheckedCreateWithoutMunicipalityInput[]
    connectOrCreate?: OrdinanceCreateOrConnectWithoutMunicipalityInput | OrdinanceCreateOrConnectWithoutMunicipalityInput[]
    createMany?: OrdinanceCreateManyMunicipalityInputEnvelope
    connect?: OrdinanceWhereUniqueInput | OrdinanceWhereUniqueInput[]
  }

  export type OrdinanceUpdateManyWithoutMunicipalityNestedInput = {
    create?: XOR<OrdinanceCreateWithoutMunicipalityInput, OrdinanceUncheckedCreateWithoutMunicipalityInput> | OrdinanceCreateWithoutMunicipalityInput[] | OrdinanceUncheckedCreateWithoutMunicipalityInput[]
    connectOrCreate?: OrdinanceCreateOrConnectWithoutMunicipalityInput | OrdinanceCreateOrConnectWithoutMunicipalityInput[]
    upsert?: OrdinanceUpsertWithWhereUniqueWithoutMunicipalityInput | OrdinanceUpsertWithWhereUniqueWithoutMunicipalityInput[]
    createMany?: OrdinanceCreateManyMunicipalityInputEnvelope
    set?: OrdinanceWhereUniqueInput | OrdinanceWhereUniqueInput[]
    disconnect?: OrdinanceWhereUniqueInput | OrdinanceWhereUniqueInput[]
    delete?: OrdinanceWhereUniqueInput | OrdinanceWhereUniqueInput[]
    connect?: OrdinanceWhereUniqueInput | OrdinanceWhereUniqueInput[]
    update?: OrdinanceUpdateWithWhereUniqueWithoutMunicipalityInput | OrdinanceUpdateWithWhereUniqueWithoutMunicipalityInput[]
    updateMany?: OrdinanceUpdateManyWithWhereWithoutMunicipalityInput | OrdinanceUpdateManyWithWhereWithoutMunicipalityInput[]
    deleteMany?: OrdinanceScalarWhereInput | OrdinanceScalarWhereInput[]
  }

  export type OrdinanceUncheckedUpdateManyWithoutMunicipalityNestedInput = {
    create?: XOR<OrdinanceCreateWithoutMunicipalityInput, OrdinanceUncheckedCreateWithoutMunicipalityInput> | OrdinanceCreateWithoutMunicipalityInput[] | OrdinanceUncheckedCreateWithoutMunicipalityInput[]
    connectOrCreate?: OrdinanceCreateOrConnectWithoutMunicipalityInput | OrdinanceCreateOrConnectWithoutMunicipalityInput[]
    upsert?: OrdinanceUpsertWithWhereUniqueWithoutMunicipalityInput | OrdinanceUpsertWithWhereUniqueWithoutMunicipalityInput[]
    createMany?: OrdinanceCreateManyMunicipalityInputEnvelope
    set?: OrdinanceWhereUniqueInput | OrdinanceWhereUniqueInput[]
    disconnect?: OrdinanceWhereUniqueInput | OrdinanceWhereUniqueInput[]
    delete?: OrdinanceWhereUniqueInput | OrdinanceWhereUniqueInput[]
    connect?: OrdinanceWhereUniqueInput | OrdinanceWhereUniqueInput[]
    update?: OrdinanceUpdateWithWhereUniqueWithoutMunicipalityInput | OrdinanceUpdateWithWhereUniqueWithoutMunicipalityInput[]
    updateMany?: OrdinanceUpdateManyWithWhereWithoutMunicipalityInput | OrdinanceUpdateManyWithWhereWithoutMunicipalityInput[]
    deleteMany?: OrdinanceScalarWhereInput | OrdinanceScalarWhereInput[]
  }

  export type OrdinanceChangeCreateNestedManyWithoutIngestionRunInput = {
    create?: XOR<OrdinanceChangeCreateWithoutIngestionRunInput, OrdinanceChangeUncheckedCreateWithoutIngestionRunInput> | OrdinanceChangeCreateWithoutIngestionRunInput[] | OrdinanceChangeUncheckedCreateWithoutIngestionRunInput[]
    connectOrCreate?: OrdinanceChangeCreateOrConnectWithoutIngestionRunInput | OrdinanceChangeCreateOrConnectWithoutIngestionRunInput[]
    createMany?: OrdinanceChangeCreateManyIngestionRunInputEnvelope
    connect?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
  }

  export type OrdinanceChangeUncheckedCreateNestedManyWithoutIngestionRunInput = {
    create?: XOR<OrdinanceChangeCreateWithoutIngestionRunInput, OrdinanceChangeUncheckedCreateWithoutIngestionRunInput> | OrdinanceChangeCreateWithoutIngestionRunInput[] | OrdinanceChangeUncheckedCreateWithoutIngestionRunInput[]
    connectOrCreate?: OrdinanceChangeCreateOrConnectWithoutIngestionRunInput | OrdinanceChangeCreateOrConnectWithoutIngestionRunInput[]
    createMany?: OrdinanceChangeCreateManyIngestionRunInputEnvelope
    connect?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type OrdinanceChangeUpdateManyWithoutIngestionRunNestedInput = {
    create?: XOR<OrdinanceChangeCreateWithoutIngestionRunInput, OrdinanceChangeUncheckedCreateWithoutIngestionRunInput> | OrdinanceChangeCreateWithoutIngestionRunInput[] | OrdinanceChangeUncheckedCreateWithoutIngestionRunInput[]
    connectOrCreate?: OrdinanceChangeCreateOrConnectWithoutIngestionRunInput | OrdinanceChangeCreateOrConnectWithoutIngestionRunInput[]
    upsert?: OrdinanceChangeUpsertWithWhereUniqueWithoutIngestionRunInput | OrdinanceChangeUpsertWithWhereUniqueWithoutIngestionRunInput[]
    createMany?: OrdinanceChangeCreateManyIngestionRunInputEnvelope
    set?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
    disconnect?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
    delete?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
    connect?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
    update?: OrdinanceChangeUpdateWithWhereUniqueWithoutIngestionRunInput | OrdinanceChangeUpdateWithWhereUniqueWithoutIngestionRunInput[]
    updateMany?: OrdinanceChangeUpdateManyWithWhereWithoutIngestionRunInput | OrdinanceChangeUpdateManyWithWhereWithoutIngestionRunInput[]
    deleteMany?: OrdinanceChangeScalarWhereInput | OrdinanceChangeScalarWhereInput[]
  }

  export type OrdinanceChangeUncheckedUpdateManyWithoutIngestionRunNestedInput = {
    create?: XOR<OrdinanceChangeCreateWithoutIngestionRunInput, OrdinanceChangeUncheckedCreateWithoutIngestionRunInput> | OrdinanceChangeCreateWithoutIngestionRunInput[] | OrdinanceChangeUncheckedCreateWithoutIngestionRunInput[]
    connectOrCreate?: OrdinanceChangeCreateOrConnectWithoutIngestionRunInput | OrdinanceChangeCreateOrConnectWithoutIngestionRunInput[]
    upsert?: OrdinanceChangeUpsertWithWhereUniqueWithoutIngestionRunInput | OrdinanceChangeUpsertWithWhereUniqueWithoutIngestionRunInput[]
    createMany?: OrdinanceChangeCreateManyIngestionRunInputEnvelope
    set?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
    disconnect?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
    delete?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
    connect?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
    update?: OrdinanceChangeUpdateWithWhereUniqueWithoutIngestionRunInput | OrdinanceChangeUpdateWithWhereUniqueWithoutIngestionRunInput[]
    updateMany?: OrdinanceChangeUpdateManyWithWhereWithoutIngestionRunInput | OrdinanceChangeUpdateManyWithWhereWithoutIngestionRunInput[]
    deleteMany?: OrdinanceChangeScalarWhereInput | OrdinanceChangeScalarWhereInput[]
  }

  export type OrdinanceCreatetopicsInput = {
    set: string[]
  }

  export type MunicipalityCreateNestedOneWithoutOrdinancesInput = {
    create?: XOR<MunicipalityCreateWithoutOrdinancesInput, MunicipalityUncheckedCreateWithoutOrdinancesInput>
    connectOrCreate?: MunicipalityCreateOrConnectWithoutOrdinancesInput
    connect?: MunicipalityWhereUniqueInput
  }

  export type OrdinanceChangeCreateNestedManyWithoutOrdinanceInput = {
    create?: XOR<OrdinanceChangeCreateWithoutOrdinanceInput, OrdinanceChangeUncheckedCreateWithoutOrdinanceInput> | OrdinanceChangeCreateWithoutOrdinanceInput[] | OrdinanceChangeUncheckedCreateWithoutOrdinanceInput[]
    connectOrCreate?: OrdinanceChangeCreateOrConnectWithoutOrdinanceInput | OrdinanceChangeCreateOrConnectWithoutOrdinanceInput[]
    createMany?: OrdinanceChangeCreateManyOrdinanceInputEnvelope
    connect?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
  }

  export type OrdinanceChangeUncheckedCreateNestedManyWithoutOrdinanceInput = {
    create?: XOR<OrdinanceChangeCreateWithoutOrdinanceInput, OrdinanceChangeUncheckedCreateWithoutOrdinanceInput> | OrdinanceChangeCreateWithoutOrdinanceInput[] | OrdinanceChangeUncheckedCreateWithoutOrdinanceInput[]
    connectOrCreate?: OrdinanceChangeCreateOrConnectWithoutOrdinanceInput | OrdinanceChangeCreateOrConnectWithoutOrdinanceInput[]
    createMany?: OrdinanceChangeCreateManyOrdinanceInputEnvelope
    connect?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
  }

  export type OrdinanceUpdatetopicsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type MunicipalityUpdateOneRequiredWithoutOrdinancesNestedInput = {
    create?: XOR<MunicipalityCreateWithoutOrdinancesInput, MunicipalityUncheckedCreateWithoutOrdinancesInput>
    connectOrCreate?: MunicipalityCreateOrConnectWithoutOrdinancesInput
    upsert?: MunicipalityUpsertWithoutOrdinancesInput
    connect?: MunicipalityWhereUniqueInput
    update?: XOR<XOR<MunicipalityUpdateToOneWithWhereWithoutOrdinancesInput, MunicipalityUpdateWithoutOrdinancesInput>, MunicipalityUncheckedUpdateWithoutOrdinancesInput>
  }

  export type OrdinanceChangeUpdateManyWithoutOrdinanceNestedInput = {
    create?: XOR<OrdinanceChangeCreateWithoutOrdinanceInput, OrdinanceChangeUncheckedCreateWithoutOrdinanceInput> | OrdinanceChangeCreateWithoutOrdinanceInput[] | OrdinanceChangeUncheckedCreateWithoutOrdinanceInput[]
    connectOrCreate?: OrdinanceChangeCreateOrConnectWithoutOrdinanceInput | OrdinanceChangeCreateOrConnectWithoutOrdinanceInput[]
    upsert?: OrdinanceChangeUpsertWithWhereUniqueWithoutOrdinanceInput | OrdinanceChangeUpsertWithWhereUniqueWithoutOrdinanceInput[]
    createMany?: OrdinanceChangeCreateManyOrdinanceInputEnvelope
    set?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
    disconnect?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
    delete?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
    connect?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
    update?: OrdinanceChangeUpdateWithWhereUniqueWithoutOrdinanceInput | OrdinanceChangeUpdateWithWhereUniqueWithoutOrdinanceInput[]
    updateMany?: OrdinanceChangeUpdateManyWithWhereWithoutOrdinanceInput | OrdinanceChangeUpdateManyWithWhereWithoutOrdinanceInput[]
    deleteMany?: OrdinanceChangeScalarWhereInput | OrdinanceChangeScalarWhereInput[]
  }

  export type OrdinanceChangeUncheckedUpdateManyWithoutOrdinanceNestedInput = {
    create?: XOR<OrdinanceChangeCreateWithoutOrdinanceInput, OrdinanceChangeUncheckedCreateWithoutOrdinanceInput> | OrdinanceChangeCreateWithoutOrdinanceInput[] | OrdinanceChangeUncheckedCreateWithoutOrdinanceInput[]
    connectOrCreate?: OrdinanceChangeCreateOrConnectWithoutOrdinanceInput | OrdinanceChangeCreateOrConnectWithoutOrdinanceInput[]
    upsert?: OrdinanceChangeUpsertWithWhereUniqueWithoutOrdinanceInput | OrdinanceChangeUpsertWithWhereUniqueWithoutOrdinanceInput[]
    createMany?: OrdinanceChangeCreateManyOrdinanceInputEnvelope
    set?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
    disconnect?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
    delete?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
    connect?: OrdinanceChangeWhereUniqueInput | OrdinanceChangeWhereUniqueInput[]
    update?: OrdinanceChangeUpdateWithWhereUniqueWithoutOrdinanceInput | OrdinanceChangeUpdateWithWhereUniqueWithoutOrdinanceInput[]
    updateMany?: OrdinanceChangeUpdateManyWithWhereWithoutOrdinanceInput | OrdinanceChangeUpdateManyWithWhereWithoutOrdinanceInput[]
    deleteMany?: OrdinanceChangeScalarWhereInput | OrdinanceChangeScalarWhereInput[]
  }

  export type OrdinanceCreateNestedOneWithoutChangesInput = {
    create?: XOR<OrdinanceCreateWithoutChangesInput, OrdinanceUncheckedCreateWithoutChangesInput>
    connectOrCreate?: OrdinanceCreateOrConnectWithoutChangesInput
    connect?: OrdinanceWhereUniqueInput
  }

  export type IngestionRunCreateNestedOneWithoutChangesInput = {
    create?: XOR<IngestionRunCreateWithoutChangesInput, IngestionRunUncheckedCreateWithoutChangesInput>
    connectOrCreate?: IngestionRunCreateOrConnectWithoutChangesInput
    connect?: IngestionRunWhereUniqueInput
  }

  export type OrdinanceUpdateOneRequiredWithoutChangesNestedInput = {
    create?: XOR<OrdinanceCreateWithoutChangesInput, OrdinanceUncheckedCreateWithoutChangesInput>
    connectOrCreate?: OrdinanceCreateOrConnectWithoutChangesInput
    upsert?: OrdinanceUpsertWithoutChangesInput
    connect?: OrdinanceWhereUniqueInput
    update?: XOR<XOR<OrdinanceUpdateToOneWithWhereWithoutChangesInput, OrdinanceUpdateWithoutChangesInput>, OrdinanceUncheckedUpdateWithoutChangesInput>
  }

  export type IngestionRunUpdateOneRequiredWithoutChangesNestedInput = {
    create?: XOR<IngestionRunCreateWithoutChangesInput, IngestionRunUncheckedCreateWithoutChangesInput>
    connectOrCreate?: IngestionRunCreateOrConnectWithoutChangesInput
    upsert?: IngestionRunUpsertWithoutChangesInput
    connect?: IngestionRunWhereUniqueInput
    update?: XOR<XOR<IngestionRunUpdateToOneWithWhereWithoutChangesInput, IngestionRunUpdateWithoutChangesInput>, IngestionRunUncheckedUpdateWithoutChangesInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type OrdinanceCreateWithoutMunicipalityInput = {
    id?: string
    identityKey: string
    sourceIdentifier?: string | null
    name: string
    description: string
    stage: string
    originalStage: string
    topics?: OrdinanceCreatetopicsInput | string[]
    sourceUrl: string
    adoptedDate?: string | null
    effectiveDate?: string | null
    latestActivity: string
    firstObservedAt?: Date | string
    lastObservedAt?: Date | string
    changes?: OrdinanceChangeCreateNestedManyWithoutOrdinanceInput
  }

  export type OrdinanceUncheckedCreateWithoutMunicipalityInput = {
    id?: string
    identityKey: string
    sourceIdentifier?: string | null
    name: string
    description: string
    stage: string
    originalStage: string
    topics?: OrdinanceCreatetopicsInput | string[]
    sourceUrl: string
    adoptedDate?: string | null
    effectiveDate?: string | null
    latestActivity: string
    firstObservedAt?: Date | string
    lastObservedAt?: Date | string
    changes?: OrdinanceChangeUncheckedCreateNestedManyWithoutOrdinanceInput
  }

  export type OrdinanceCreateOrConnectWithoutMunicipalityInput = {
    where: OrdinanceWhereUniqueInput
    create: XOR<OrdinanceCreateWithoutMunicipalityInput, OrdinanceUncheckedCreateWithoutMunicipalityInput>
  }

  export type OrdinanceCreateManyMunicipalityInputEnvelope = {
    data: OrdinanceCreateManyMunicipalityInput | OrdinanceCreateManyMunicipalityInput[]
    skipDuplicates?: boolean
  }

  export type OrdinanceUpsertWithWhereUniqueWithoutMunicipalityInput = {
    where: OrdinanceWhereUniqueInput
    update: XOR<OrdinanceUpdateWithoutMunicipalityInput, OrdinanceUncheckedUpdateWithoutMunicipalityInput>
    create: XOR<OrdinanceCreateWithoutMunicipalityInput, OrdinanceUncheckedCreateWithoutMunicipalityInput>
  }

  export type OrdinanceUpdateWithWhereUniqueWithoutMunicipalityInput = {
    where: OrdinanceWhereUniqueInput
    data: XOR<OrdinanceUpdateWithoutMunicipalityInput, OrdinanceUncheckedUpdateWithoutMunicipalityInput>
  }

  export type OrdinanceUpdateManyWithWhereWithoutMunicipalityInput = {
    where: OrdinanceScalarWhereInput
    data: XOR<OrdinanceUpdateManyMutationInput, OrdinanceUncheckedUpdateManyWithoutMunicipalityInput>
  }

  export type OrdinanceScalarWhereInput = {
    AND?: OrdinanceScalarWhereInput | OrdinanceScalarWhereInput[]
    OR?: OrdinanceScalarWhereInput[]
    NOT?: OrdinanceScalarWhereInput | OrdinanceScalarWhereInput[]
    id?: UuidFilter<"Ordinance"> | string
    municipalityId?: UuidFilter<"Ordinance"> | string
    identityKey?: StringFilter<"Ordinance"> | string
    sourceIdentifier?: StringNullableFilter<"Ordinance"> | string | null
    name?: StringFilter<"Ordinance"> | string
    description?: StringFilter<"Ordinance"> | string
    stage?: StringFilter<"Ordinance"> | string
    originalStage?: StringFilter<"Ordinance"> | string
    topics?: StringNullableListFilter<"Ordinance">
    sourceUrl?: StringFilter<"Ordinance"> | string
    adoptedDate?: StringNullableFilter<"Ordinance"> | string | null
    effectiveDate?: StringNullableFilter<"Ordinance"> | string | null
    latestActivity?: StringFilter<"Ordinance"> | string
    firstObservedAt?: DateTimeFilter<"Ordinance"> | Date | string
    lastObservedAt?: DateTimeFilter<"Ordinance"> | Date | string
  }

  export type OrdinanceChangeCreateWithoutIngestionRunInput = {
    id?: string
    dedupeKey: string
    activityType: string
    activityDate: string
    activityAt?: Date | string | null
    description: string
    evidenceUrl: string
    evidenceExcerpt: string
    discoveredAt?: Date | string
    ordinance: OrdinanceCreateNestedOneWithoutChangesInput
  }

  export type OrdinanceChangeUncheckedCreateWithoutIngestionRunInput = {
    id?: string
    ordinanceId: string
    dedupeKey: string
    activityType: string
    activityDate: string
    activityAt?: Date | string | null
    description: string
    evidenceUrl: string
    evidenceExcerpt: string
    discoveredAt?: Date | string
  }

  export type OrdinanceChangeCreateOrConnectWithoutIngestionRunInput = {
    where: OrdinanceChangeWhereUniqueInput
    create: XOR<OrdinanceChangeCreateWithoutIngestionRunInput, OrdinanceChangeUncheckedCreateWithoutIngestionRunInput>
  }

  export type OrdinanceChangeCreateManyIngestionRunInputEnvelope = {
    data: OrdinanceChangeCreateManyIngestionRunInput | OrdinanceChangeCreateManyIngestionRunInput[]
    skipDuplicates?: boolean
  }

  export type OrdinanceChangeUpsertWithWhereUniqueWithoutIngestionRunInput = {
    where: OrdinanceChangeWhereUniqueInput
    update: XOR<OrdinanceChangeUpdateWithoutIngestionRunInput, OrdinanceChangeUncheckedUpdateWithoutIngestionRunInput>
    create: XOR<OrdinanceChangeCreateWithoutIngestionRunInput, OrdinanceChangeUncheckedCreateWithoutIngestionRunInput>
  }

  export type OrdinanceChangeUpdateWithWhereUniqueWithoutIngestionRunInput = {
    where: OrdinanceChangeWhereUniqueInput
    data: XOR<OrdinanceChangeUpdateWithoutIngestionRunInput, OrdinanceChangeUncheckedUpdateWithoutIngestionRunInput>
  }

  export type OrdinanceChangeUpdateManyWithWhereWithoutIngestionRunInput = {
    where: OrdinanceChangeScalarWhereInput
    data: XOR<OrdinanceChangeUpdateManyMutationInput, OrdinanceChangeUncheckedUpdateManyWithoutIngestionRunInput>
  }

  export type OrdinanceChangeScalarWhereInput = {
    AND?: OrdinanceChangeScalarWhereInput | OrdinanceChangeScalarWhereInput[]
    OR?: OrdinanceChangeScalarWhereInput[]
    NOT?: OrdinanceChangeScalarWhereInput | OrdinanceChangeScalarWhereInput[]
    id?: UuidFilter<"OrdinanceChange"> | string
    ordinanceId?: UuidFilter<"OrdinanceChange"> | string
    ingestionRunId?: UuidFilter<"OrdinanceChange"> | string
    dedupeKey?: StringFilter<"OrdinanceChange"> | string
    activityType?: StringFilter<"OrdinanceChange"> | string
    activityDate?: StringFilter<"OrdinanceChange"> | string
    activityAt?: DateTimeNullableFilter<"OrdinanceChange"> | Date | string | null
    description?: StringFilter<"OrdinanceChange"> | string
    evidenceUrl?: StringFilter<"OrdinanceChange"> | string
    evidenceExcerpt?: StringFilter<"OrdinanceChange"> | string
    discoveredAt?: DateTimeFilter<"OrdinanceChange"> | Date | string
  }

  export type MunicipalityCreateWithoutOrdinancesInput = {
    id?: string
    key: string
    city: string
    state: string
    label: string
  }

  export type MunicipalityUncheckedCreateWithoutOrdinancesInput = {
    id?: string
    key: string
    city: string
    state: string
    label: string
  }

  export type MunicipalityCreateOrConnectWithoutOrdinancesInput = {
    where: MunicipalityWhereUniqueInput
    create: XOR<MunicipalityCreateWithoutOrdinancesInput, MunicipalityUncheckedCreateWithoutOrdinancesInput>
  }

  export type OrdinanceChangeCreateWithoutOrdinanceInput = {
    id?: string
    dedupeKey: string
    activityType: string
    activityDate: string
    activityAt?: Date | string | null
    description: string
    evidenceUrl: string
    evidenceExcerpt: string
    discoveredAt?: Date | string
    ingestionRun: IngestionRunCreateNestedOneWithoutChangesInput
  }

  export type OrdinanceChangeUncheckedCreateWithoutOrdinanceInput = {
    id?: string
    ingestionRunId: string
    dedupeKey: string
    activityType: string
    activityDate: string
    activityAt?: Date | string | null
    description: string
    evidenceUrl: string
    evidenceExcerpt: string
    discoveredAt?: Date | string
  }

  export type OrdinanceChangeCreateOrConnectWithoutOrdinanceInput = {
    where: OrdinanceChangeWhereUniqueInput
    create: XOR<OrdinanceChangeCreateWithoutOrdinanceInput, OrdinanceChangeUncheckedCreateWithoutOrdinanceInput>
  }

  export type OrdinanceChangeCreateManyOrdinanceInputEnvelope = {
    data: OrdinanceChangeCreateManyOrdinanceInput | OrdinanceChangeCreateManyOrdinanceInput[]
    skipDuplicates?: boolean
  }

  export type MunicipalityUpsertWithoutOrdinancesInput = {
    update: XOR<MunicipalityUpdateWithoutOrdinancesInput, MunicipalityUncheckedUpdateWithoutOrdinancesInput>
    create: XOR<MunicipalityCreateWithoutOrdinancesInput, MunicipalityUncheckedCreateWithoutOrdinancesInput>
    where?: MunicipalityWhereInput
  }

  export type MunicipalityUpdateToOneWithWhereWithoutOrdinancesInput = {
    where?: MunicipalityWhereInput
    data: XOR<MunicipalityUpdateWithoutOrdinancesInput, MunicipalityUncheckedUpdateWithoutOrdinancesInput>
  }

  export type MunicipalityUpdateWithoutOrdinancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
  }

  export type MunicipalityUncheckedUpdateWithoutOrdinancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
  }

  export type OrdinanceChangeUpsertWithWhereUniqueWithoutOrdinanceInput = {
    where: OrdinanceChangeWhereUniqueInput
    update: XOR<OrdinanceChangeUpdateWithoutOrdinanceInput, OrdinanceChangeUncheckedUpdateWithoutOrdinanceInput>
    create: XOR<OrdinanceChangeCreateWithoutOrdinanceInput, OrdinanceChangeUncheckedCreateWithoutOrdinanceInput>
  }

  export type OrdinanceChangeUpdateWithWhereUniqueWithoutOrdinanceInput = {
    where: OrdinanceChangeWhereUniqueInput
    data: XOR<OrdinanceChangeUpdateWithoutOrdinanceInput, OrdinanceChangeUncheckedUpdateWithoutOrdinanceInput>
  }

  export type OrdinanceChangeUpdateManyWithWhereWithoutOrdinanceInput = {
    where: OrdinanceChangeScalarWhereInput
    data: XOR<OrdinanceChangeUpdateManyMutationInput, OrdinanceChangeUncheckedUpdateManyWithoutOrdinanceInput>
  }

  export type OrdinanceCreateWithoutChangesInput = {
    id?: string
    identityKey: string
    sourceIdentifier?: string | null
    name: string
    description: string
    stage: string
    originalStage: string
    topics?: OrdinanceCreatetopicsInput | string[]
    sourceUrl: string
    adoptedDate?: string | null
    effectiveDate?: string | null
    latestActivity: string
    firstObservedAt?: Date | string
    lastObservedAt?: Date | string
    municipality: MunicipalityCreateNestedOneWithoutOrdinancesInput
  }

  export type OrdinanceUncheckedCreateWithoutChangesInput = {
    id?: string
    municipalityId: string
    identityKey: string
    sourceIdentifier?: string | null
    name: string
    description: string
    stage: string
    originalStage: string
    topics?: OrdinanceCreatetopicsInput | string[]
    sourceUrl: string
    adoptedDate?: string | null
    effectiveDate?: string | null
    latestActivity: string
    firstObservedAt?: Date | string
    lastObservedAt?: Date | string
  }

  export type OrdinanceCreateOrConnectWithoutChangesInput = {
    where: OrdinanceWhereUniqueInput
    create: XOR<OrdinanceCreateWithoutChangesInput, OrdinanceUncheckedCreateWithoutChangesInput>
  }

  export type IngestionRunCreateWithoutChangesInput = {
    id?: string
    windowStart: Date | string
    windowEnd: Date | string
    cities: JsonNullValueInput | InputJsonValue
    skippedCount?: number
    status?: string
    providerJobId?: string | null
    coverage?: NullableJsonNullValueInput | InputJsonValue
    creditsUsed?: number | null
    rejectedCount?: number
    failureCode?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type IngestionRunUncheckedCreateWithoutChangesInput = {
    id?: string
    windowStart: Date | string
    windowEnd: Date | string
    cities: JsonNullValueInput | InputJsonValue
    skippedCount?: number
    status?: string
    providerJobId?: string | null
    coverage?: NullableJsonNullValueInput | InputJsonValue
    creditsUsed?: number | null
    rejectedCount?: number
    failureCode?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type IngestionRunCreateOrConnectWithoutChangesInput = {
    where: IngestionRunWhereUniqueInput
    create: XOR<IngestionRunCreateWithoutChangesInput, IngestionRunUncheckedCreateWithoutChangesInput>
  }

  export type OrdinanceUpsertWithoutChangesInput = {
    update: XOR<OrdinanceUpdateWithoutChangesInput, OrdinanceUncheckedUpdateWithoutChangesInput>
    create: XOR<OrdinanceCreateWithoutChangesInput, OrdinanceUncheckedCreateWithoutChangesInput>
    where?: OrdinanceWhereInput
  }

  export type OrdinanceUpdateToOneWithWhereWithoutChangesInput = {
    where?: OrdinanceWhereInput
    data: XOR<OrdinanceUpdateWithoutChangesInput, OrdinanceUncheckedUpdateWithoutChangesInput>
  }

  export type OrdinanceUpdateWithoutChangesInput = {
    id?: StringFieldUpdateOperationsInput | string
    identityKey?: StringFieldUpdateOperationsInput | string
    sourceIdentifier?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    originalStage?: StringFieldUpdateOperationsInput | string
    topics?: OrdinanceUpdatetopicsInput | string[]
    sourceUrl?: StringFieldUpdateOperationsInput | string
    adoptedDate?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableStringFieldUpdateOperationsInput | string | null
    latestActivity?: StringFieldUpdateOperationsInput | string
    firstObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    municipality?: MunicipalityUpdateOneRequiredWithoutOrdinancesNestedInput
  }

  export type OrdinanceUncheckedUpdateWithoutChangesInput = {
    id?: StringFieldUpdateOperationsInput | string
    municipalityId?: StringFieldUpdateOperationsInput | string
    identityKey?: StringFieldUpdateOperationsInput | string
    sourceIdentifier?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    originalStage?: StringFieldUpdateOperationsInput | string
    topics?: OrdinanceUpdatetopicsInput | string[]
    sourceUrl?: StringFieldUpdateOperationsInput | string
    adoptedDate?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableStringFieldUpdateOperationsInput | string | null
    latestActivity?: StringFieldUpdateOperationsInput | string
    firstObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IngestionRunUpsertWithoutChangesInput = {
    update: XOR<IngestionRunUpdateWithoutChangesInput, IngestionRunUncheckedUpdateWithoutChangesInput>
    create: XOR<IngestionRunCreateWithoutChangesInput, IngestionRunUncheckedCreateWithoutChangesInput>
    where?: IngestionRunWhereInput
  }

  export type IngestionRunUpdateToOneWithWhereWithoutChangesInput = {
    where?: IngestionRunWhereInput
    data: XOR<IngestionRunUpdateWithoutChangesInput, IngestionRunUncheckedUpdateWithoutChangesInput>
  }

  export type IngestionRunUpdateWithoutChangesInput = {
    id?: StringFieldUpdateOperationsInput | string
    windowStart?: DateTimeFieldUpdateOperationsInput | Date | string
    windowEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cities?: JsonNullValueInput | InputJsonValue
    skippedCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    providerJobId?: NullableStringFieldUpdateOperationsInput | string | null
    coverage?: NullableJsonNullValueInput | InputJsonValue
    creditsUsed?: NullableFloatFieldUpdateOperationsInput | number | null
    rejectedCount?: IntFieldUpdateOperationsInput | number
    failureCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type IngestionRunUncheckedUpdateWithoutChangesInput = {
    id?: StringFieldUpdateOperationsInput | string
    windowStart?: DateTimeFieldUpdateOperationsInput | Date | string
    windowEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    cities?: JsonNullValueInput | InputJsonValue
    skippedCount?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    providerJobId?: NullableStringFieldUpdateOperationsInput | string | null
    coverage?: NullableJsonNullValueInput | InputJsonValue
    creditsUsed?: NullableFloatFieldUpdateOperationsInput | number | null
    rejectedCount?: IntFieldUpdateOperationsInput | number
    failureCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OrdinanceCreateManyMunicipalityInput = {
    id?: string
    identityKey: string
    sourceIdentifier?: string | null
    name: string
    description: string
    stage: string
    originalStage: string
    topics?: OrdinanceCreatetopicsInput | string[]
    sourceUrl: string
    adoptedDate?: string | null
    effectiveDate?: string | null
    latestActivity: string
    firstObservedAt?: Date | string
    lastObservedAt?: Date | string
  }

  export type OrdinanceUpdateWithoutMunicipalityInput = {
    id?: StringFieldUpdateOperationsInput | string
    identityKey?: StringFieldUpdateOperationsInput | string
    sourceIdentifier?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    originalStage?: StringFieldUpdateOperationsInput | string
    topics?: OrdinanceUpdatetopicsInput | string[]
    sourceUrl?: StringFieldUpdateOperationsInput | string
    adoptedDate?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableStringFieldUpdateOperationsInput | string | null
    latestActivity?: StringFieldUpdateOperationsInput | string
    firstObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    changes?: OrdinanceChangeUpdateManyWithoutOrdinanceNestedInput
  }

  export type OrdinanceUncheckedUpdateWithoutMunicipalityInput = {
    id?: StringFieldUpdateOperationsInput | string
    identityKey?: StringFieldUpdateOperationsInput | string
    sourceIdentifier?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    originalStage?: StringFieldUpdateOperationsInput | string
    topics?: OrdinanceUpdatetopicsInput | string[]
    sourceUrl?: StringFieldUpdateOperationsInput | string
    adoptedDate?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableStringFieldUpdateOperationsInput | string | null
    latestActivity?: StringFieldUpdateOperationsInput | string
    firstObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    changes?: OrdinanceChangeUncheckedUpdateManyWithoutOrdinanceNestedInput
  }

  export type OrdinanceUncheckedUpdateManyWithoutMunicipalityInput = {
    id?: StringFieldUpdateOperationsInput | string
    identityKey?: StringFieldUpdateOperationsInput | string
    sourceIdentifier?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    stage?: StringFieldUpdateOperationsInput | string
    originalStage?: StringFieldUpdateOperationsInput | string
    topics?: OrdinanceUpdatetopicsInput | string[]
    sourceUrl?: StringFieldUpdateOperationsInput | string
    adoptedDate?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableStringFieldUpdateOperationsInput | string | null
    latestActivity?: StringFieldUpdateOperationsInput | string
    firstObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastObservedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdinanceChangeCreateManyIngestionRunInput = {
    id?: string
    ordinanceId: string
    dedupeKey: string
    activityType: string
    activityDate: string
    activityAt?: Date | string | null
    description: string
    evidenceUrl: string
    evidenceExcerpt: string
    discoveredAt?: Date | string
  }

  export type OrdinanceChangeUpdateWithoutIngestionRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    dedupeKey?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    activityDate?: StringFieldUpdateOperationsInput | string
    activityAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidenceUrl?: StringFieldUpdateOperationsInput | string
    evidenceExcerpt?: StringFieldUpdateOperationsInput | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ordinance?: OrdinanceUpdateOneRequiredWithoutChangesNestedInput
  }

  export type OrdinanceChangeUncheckedUpdateWithoutIngestionRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    ordinanceId?: StringFieldUpdateOperationsInput | string
    dedupeKey?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    activityDate?: StringFieldUpdateOperationsInput | string
    activityAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidenceUrl?: StringFieldUpdateOperationsInput | string
    evidenceExcerpt?: StringFieldUpdateOperationsInput | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdinanceChangeUncheckedUpdateManyWithoutIngestionRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    ordinanceId?: StringFieldUpdateOperationsInput | string
    dedupeKey?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    activityDate?: StringFieldUpdateOperationsInput | string
    activityAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidenceUrl?: StringFieldUpdateOperationsInput | string
    evidenceExcerpt?: StringFieldUpdateOperationsInput | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdinanceChangeCreateManyOrdinanceInput = {
    id?: string
    ingestionRunId: string
    dedupeKey: string
    activityType: string
    activityDate: string
    activityAt?: Date | string | null
    description: string
    evidenceUrl: string
    evidenceExcerpt: string
    discoveredAt?: Date | string
  }

  export type OrdinanceChangeUpdateWithoutOrdinanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    dedupeKey?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    activityDate?: StringFieldUpdateOperationsInput | string
    activityAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidenceUrl?: StringFieldUpdateOperationsInput | string
    evidenceExcerpt?: StringFieldUpdateOperationsInput | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ingestionRun?: IngestionRunUpdateOneRequiredWithoutChangesNestedInput
  }

  export type OrdinanceChangeUncheckedUpdateWithoutOrdinanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    ingestionRunId?: StringFieldUpdateOperationsInput | string
    dedupeKey?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    activityDate?: StringFieldUpdateOperationsInput | string
    activityAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidenceUrl?: StringFieldUpdateOperationsInput | string
    evidenceExcerpt?: StringFieldUpdateOperationsInput | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrdinanceChangeUncheckedUpdateManyWithoutOrdinanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    ingestionRunId?: StringFieldUpdateOperationsInput | string
    dedupeKey?: StringFieldUpdateOperationsInput | string
    activityType?: StringFieldUpdateOperationsInput | string
    activityDate?: StringFieldUpdateOperationsInput | string
    activityAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidenceUrl?: StringFieldUpdateOperationsInput | string
    evidenceExcerpt?: StringFieldUpdateOperationsInput | string
    discoveredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}