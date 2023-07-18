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
