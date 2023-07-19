"use server"

import { createActionFactory } from "actions"
import { z } from "zod"

const createAuthAction = createActionFactory(() => {
  const auth = true

  if (!auth) {
    throw Error("Unauthorized")
  }

  return {
    userId: "123",
  }
})

export const foo = createAuthAction(z.string(), async (input, context) => {
  console.log(input, context.userId)
})

export const bar = createAuthAction(z.number(), async (input, context) => {
  console.log(input, context.userId)
})
