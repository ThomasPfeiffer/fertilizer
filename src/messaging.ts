import type { GapValidationResult, NoteValidationResult } from "~/entrypoints/content/ValidationResult"

export type EntryWarning = {
  startTime: string
  gap: GapValidationResult
  note: NoteValidationResult
}

interface Messages {
  GET_WARNINGS: {
    request: void
    response: { warnings: EntryWarning[] }
  }
}

type MessageType = keyof Messages
type Response<T extends MessageType> = Messages[T]["response"]

export function sendMessage<T extends MessageType>(
  tabId: number,
  type: T,
): Promise<Response<T>> {
  return browser.tabs.sendMessage(tabId, { type })
}

export function onMessage<T extends MessageType>(
  type: T,
  handler: () => Response<T> | Promise<Response<T>>,
): void {
  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if ((message as Record<string, unknown>)?.type !== type) return true
    const result = handler()
    if (result instanceof Promise) {
      result.then(sendResponse)
    } else {
      sendResponse(result)
    }
    return true
  })
}
