import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'NumberOfLinesContainerHeight', type: 'useCase' })
})

test('numberOfLines=2 text is not taller than 2 lines inside a constrained YStack', async ({
  page,
}) => {
  const textEl = page.getByTestId('ystack-text').first()
  const containerEl = page.getByTestId('ystack-container').first()

  const textBox = await textEl.boundingBox()
  const containerBox = await containerEl.boundingBox()

  expect(textBox).not.toBeNull()
  expect(containerBox).not.toBeNull()

  // text height must not equal or exceed the container height —
  // previously the text would fill the full 100px container height
  expect(textBox!.height).toBeLessThan(containerBox!.height)
})

test('numberOfLines=2 text is not stretched to fill XStack height', async ({ page }) => {
  const textEl = page.getByTestId('xstack-text').first()
  const containerEl = page.getByTestId('xstack-container').first()

  const textBox = await textEl.boundingBox()
  const containerBox = await containerEl.boundingBox()

  expect(textBox).not.toBeNull()
  expect(containerBox).not.toBeNull()

  // Previously the text was stretched via align-items:stretch to 60px,
  // making content from line 3 onwards visible inside the element box.
  // After the fix, the text height must be less than the container height.
  expect(textBox!.height).toBeLessThan(containerBox!.height)
})

test('numberOfLines=2 applies max-height: 2lh style', async ({ page }) => {
  const textEl = page.getByTestId('ystack-text').first()
  const maxHeight = await textEl.evaluate((el) => window.getComputedStyle(el).maxHeight)
  // max-height should be set (not 'none') — the computed value will be in px
  // because browsers resolve lh to absolute pixels
  expect(maxHeight).not.toBe('none')
})
