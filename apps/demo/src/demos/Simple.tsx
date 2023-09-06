"use client"

import { useTransition } from "react"
import { action } from "~/actions/demo"

export function unreachable(value: never): never {
  throw new Error(`Unreachable: ${value}`)
}

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

          if (result.success) {
            return alert(result.data.ok)
          }

          switch (result.error.cause) {
            case "VALIDATION_ERROR":
              return alert("VALIDATION_ERROR")
            case "INVALID_USERNAME":
              return alert("INVALID_USERNAME")
            case "INVALID_PASSWORD":
              return alert("INVALID_PASSWORD")
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
