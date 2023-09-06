# cool name goes here

## Usage

```ts
"use server"

import { z } from "zod"
import { createAction, serverError } from "actions"

const schema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
})

export const action = createAction(schema, async (data) => {
  if (data.username !== "username") {
    return serverError("INVALID_USERNAME")
  }

  if (data.password !== "password") {
    return serverError("INVALID_PASSWORD")
  }

  return {
    ok: true,
  }
})
```

```tsx
"use client"

import { useTransition } from "react"
import { action } from "./actions"

function unreachable(value: never): never {
  throw new Error(`Unreachable: ${value}`)
}

function Component() {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await action({
            username: "foo",
            password: "bar",
          })

          if (result.success) {
            return alert(result.data.ok)
          }

          switch (result.error.cause) {
            case "VALIDATION_ERROR":
              // Code path for VALIDATION_ERROR
              break
            case "INVALID_USERNAME":
              // Code path for INVALID_USERNAME
              break
            case "INVALID_PASSWORD":
              // Code path for INVALID_PASSWORD
              break
            default:
              return unreachable(result.error)
          }
        })
      }
    >
      Run server action
    </button>
  )
}
```

## Recipes

### Inferring values

```ts
import type { ActionData, ActionErrors } from "actions"
import type { action } from "./actions"

type ActionData = InferActionData<typeof action>
//   ^? type ActionData = { ok: boolean; }

type ActionErrors = InferActionErrors<typeof action>
//   ^? type ActionErrors = "INVALID_USERNAME" | "INVALID_PASSWORD" | "VALIDATION_ERROR"
```

### Void actions

```ts
"use server"

import { z } from "zod"
import { createAction } from "actions"

export const action = createAction(z.void(), async () => ({
  // ...
}))
```

### With `drizzle-zod`

```ts
"use server"

import { z } from "zod"
import { createAction } from "actions"
import { createInsertSchema } from "drizzle-zod"
import { users } from "./db"

const insertUserSchema = createInsertSchema(users)

export const action = createAction(
  insertUserSchema.pick({
    username: true,
    password: true,
  }),
  async (user) => ({
    // ...
  })
)
```

### With `ts-pattern`

```tsx
"use client"

import { useTransition } from "react"
import { match } from "ts-pattern"
import { action } from "./actions"

function Component() {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await action({
            username: "foo",
            password: "bar",
          })

          match(result)
            .with({ error: { cause: "VALIDATION_ERROR" } }, () => {})
            .with({ error: { cause: "INVALID_USERNAME" } }, () => {})
            .with({ error: { cause: "INVALID_PASSWORD" } }, () => {})
            .with({ success: true }, ({ data }) => alert(data.ok))
            .exhaustive()
        })
      }
    >
      Run server action
    </button>
  )
}
```

## License

[MIT](LICENSE)
