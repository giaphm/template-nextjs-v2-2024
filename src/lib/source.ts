import { docs, meta } from "~/../.source"
import { createMDXSource } from "fumadocs-mdx"
import { loader } from "fumadocs-core/source"

export const { getPages } = loader({
  baseUrl: "/docs",
  source: createMDXSource(docs, meta),
})
