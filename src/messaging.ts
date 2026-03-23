import type { GapValidationResult, NoteValidationResult } from "~/entrypoints/content/ValidationResult"

export type EntryWarning = {
  startTime: string
  gap: GapValidationResult
  note: NoteValidationResult
}

interface Messages {
  GET_STATUS: {
    request: void
    response: { warnings: EntryWarning[]; entryCount: number; isActive: boolean }
  }
}

type MessageType = keyof Messages
type Response<T extends MessageType> = Messages[T]["response"]

export async function sendMessage<T extends MessageType>(type: T): Promise<Response<T>> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
  return browser.tabs.sendMessage(tab.id!, { type })
}

export function onMessage<T extends MessageType>(type: T, handler: () => Response<T> | Promise<Response<T>>): void {
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
