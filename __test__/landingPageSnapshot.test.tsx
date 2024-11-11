import { render } from "@testing-library/react"
import Page from "./page"
import { expect } from "@jest/globals"

it("renders homepage unchanged", () => {
  const { container } = render(<Page />)
  expect(container).toMatchSnapshot()
})
