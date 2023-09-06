"use server"

import { z } from "zod"
import { createAction, serverError } from "actions"

const schema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
})

function shouldThrow() {
  return Math.random() > 0.5
}

export const action = createAction(schema, async (data) => {
  if (shouldThrow()) {
    throw new Error("Oops! Unexpected server error")
  }

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
