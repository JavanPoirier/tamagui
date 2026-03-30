import { Text, XStack, YStack } from 'tamagui'

// Test case: numberOfLines should cut off text at N lines even when a parent
// container has a constrained height (height or maxHeight). Previously, text
// would show the ellipsis at the correct line but continue to be visible past
// that line until the parent overflow clipped it — because align-items:stretch
// in a row-flex parent stretched the text element to the full container height.

export function NumberOfLinesContainerHeight() {
  const longText =
    'This is a long line of text that should be truncated. It contains enough words to span multiple lines when rendered in a constrained width container.'

  return (
    <>
      {/* Test 1: numberOfLines=2 inside YStack with maxHeight */}
      <YStack testID="ystack-container" maxHeight={100} overflow="hidden" width={200}>
        <Text testID="ystack-text" numberOfLines={2}>
          {longText}
        </Text>
      </YStack>

      {/* Test 2: numberOfLines=2 inside XStack with a fixed height (row flex,
          align-items:stretch would otherwise stretch the text height to 60px) */}
      <XStack testID="xstack-container" height={60} overflow="hidden" width={200}>
        <Text testID="xstack-text" numberOfLines={2}>
          {longText}
        </Text>
      </XStack>

      {/* Test 3: reference — no numberOfLines, should be taller than 2 lines */}
      <YStack testID="ref-container" width={200}>
        <Text testID="ref-text">{longText}</Text>
      </YStack>
    </>
  )
}
