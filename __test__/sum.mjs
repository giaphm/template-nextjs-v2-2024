import { chunk } from "lodash"
import { z } from "zod"

export const sum = (a, b) => a + b

export const chunkk = chunk(["a", "b", "c", "d"], 2)
