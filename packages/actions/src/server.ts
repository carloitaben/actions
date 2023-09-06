import "server-only"
import { z, type TypeOf, type ZodTypeAny } from "zod"
import { fromZodError, type ValidationError } from "zod-validation-error"

type Error<T extends string = string> = {
  _type: "error"
  cause: T
}

const error = z.object({
  _type: z.literal("error"),
  cause: z.string(),
})

function isError(result: any): result is Error {
  return error.safeParse(result).success
}

function serverError<const T extends string>(cause: T) {
  return { _type: "error", cause } as const
}

type ActionResult<R> =
  | {
      success: true
      data: Exclude<Awaited<R>, Error>
    }
  | {
      success: false
      error: Extract<Awaited<R>, Error>
    }
  | {
      success: false
      error: Error<"VALIDATION_ERROR"> & ValidationError
    }

type Action<S extends ZodTypeAny, R> = (
  input: TypeOf<S>
) => Promise<ActionResult<R>>

function createAction<S extends ZodTypeAny, R>(
  schema: S,
  callback: (input: TypeOf<S>) => Promise<R>
) {
  const action: Action<S, R> = async (input) => {
    const parsed = schema.safeParse(input)

    if (!parsed.success) {
      return {
        success: false,
        error: {
          ...fromZodError(parsed.error),
          _type: "error",
          cause: "VALIDATION_ERROR",
        } as const,
      } as any
    }

    const result = await callback(parsed.data)

    if (isError(result)) {
      return {
        success: false,
        error: result,
      } as any
    } else {
      return {
        success: true,
        data: result,
      } as any
    }
  }

  return action
}

type InferActionData<T extends Action<any, any>> = Exclude<
  Awaited<ReturnType<T>>,
  { success: false }
>["data"]

type InferActionErrors<T extends Action<any, any>> = Extract<
  Awaited<ReturnType<T>>,
  { success: false }
>["error"]["cause"]

export {
  serverError,
  createAction,
  type InferActionData,
  type InferActionErrors,
}
