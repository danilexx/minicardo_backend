// @ts-nocheck

import { Connection, FindOperator, FindOperatorType } from "typeorm";

class FindOperatorWithExtras<T> extends FindOperator<T> {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    type: FindOperatorType | "ilike",
    value: FindOperator<T> | T,
    useParameter?: boolean,
    multipleParameters?: boolean
  ) {
    // @ts-ignore
    super(type, value, useParameter, multipleParameters);
  }

  public toSql(
    connection: Connection,
    aliasPath: string,
    parameters: string[]
  ): string {
    // eslint-disable-next-line no-underscore-dangle
    if (this._type === "ilike") {
      return `${aliasPath} ILIKE ${parameters[0]}`;
    }

    return super.toSql(connection, aliasPath, parameters);
  }
}

/**
 * Find Options Operator.
 * Example: { someField: Like("%some sting%") }
 */
export function ILike<T>(
  value: T | FindOperator<T>
): FindOperatorWithExtras<T> {
  return new FindOperatorWithExtras("ilike", value);
}
