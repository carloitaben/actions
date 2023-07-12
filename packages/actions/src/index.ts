import type { TypeOf, ZodTypeAny } from "zod"
import { fromZodError } from "zod-validation-error"

export function createAction<Schema extends ZodTypeAny, Result>(
  schema: Schema,
  callback: (input: TypeOf<Schema>) => Promise<Result>
) {
  return async function action(input: TypeOf<Schema>) {
    const parsed = schema.safeParse(input)

    if (!parsed.success) {
      return {
        validationError: fromZodError(parsed.error),
      }
    }

    return callback(parsed.data)
  }
}

export function serverError<const T extends string>(code: T) {
  return {
    serverError: code,
  }
}
