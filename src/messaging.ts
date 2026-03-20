interface Messages {
  GET_WARNING_COUNT: {
    request: void
    response: { warningCount: number }
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
