# cool name goes here

## Usage

### Simple

```tsx
// actions.ts

"use server"

import { createAction, serverError } from "actions"
import { z } from "zod"

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
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
// page.tsx

"use client"

import { useTransition } from "react"

import { action } from "~/actions/demo"

export default function Simple() {
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

          if (!("error" in result)) {
            return alert(JSON.stringify(result, null, 2))
          }

          switch (result.error.name) {
            case "VALIDATION_ERROR":
              return alert(JSON.stringify(result.error, null, 2))
            case "SERVER_ERROR":
              switch (result.error.cause) {
                case "INVALID_USERNAME":
                  return alert("INVALID_USERNAME")
                case "INVALID_PASSWORD":
                  return alert("INVALID_PASSWORD")
                default:
                  return unreachable(result.error)
              }
          }
        })
      }
    >
      Run server action
    </button>
  )
}
```
