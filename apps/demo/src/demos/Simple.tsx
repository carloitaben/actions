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
          const data = await action({
            username: "foo",
            password: "bar",
          })

          if ("validationError" in data) {
            return alert(JSON.stringify(data.validationError, null, 2))
          }

          if ("serverError" in data) {
            switch (data.serverError) {
              case "INVALID_USERNAME":
                alert("INVALID_USERNAME error code path")
                break
              case "INVALID_PASSWORD":
                alert("INVALID_PASSWORD error code path")
                break
            }
          } else {
            alert(data.ok)
          }
        })
      }
    >
      Simple
    </button>
  )
}
