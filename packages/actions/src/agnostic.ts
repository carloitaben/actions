import "server-only"
import type { InferIn, Schema } from "@decs/typeschema"
import { validate } from "@decs/typeschema"

type Error = {
  _type: "error"
}

export function isError(result: any): result is Error {
  return (
    result &&
    typeof result === "object" &&
    "_type" in result &&
    result._type &&
    typeof result._type === "string" &&
    result._type === "error"
  )
}

export function serverError<const T extends string>(cause: T) {
  return { _type: "error", cause } as const
}

// type ActionResult<R> =
//   | {
//       success: true
//       data: Exclude<Awaited<R>, { _type: "error" }>
//     }
//   | {
//       success: false
//       error: Extract<Awaited<R>, { _type: "error" }>
//     }

export function createAction<S extends Schema, R>(
  schema: S,
  callback: (input: InferIn<S>) => Promise<R>
) {
  return async function action(input: InferIn<S>) {
    const parsed = await validate(schema, input)

    if (!parsed.success) {
      return {
        success: false,
        error: {
          _type: "error",
          cause: "VALIDATION_ERROR",
        },
      } as const
    }

    const result = await callback(parsed.data)

    if (isError(result)) {
      return {
        success: false,
        error: result as Extract<Awaited<R>, { _type: "error" }>,
      } as const
    } else {
      return {
        success: true,
        data: result as Exclude<Awaited<R>, { _type: "error" }>,
      } as const
    }
  }
}
