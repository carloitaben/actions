"use server"

import { createAction, serverError } from "actions"
import { z } from "zod"

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const action = createAction(schema, async (data) => {
  console.log(data)

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
