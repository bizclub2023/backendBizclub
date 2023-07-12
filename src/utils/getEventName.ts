/* eslint-disable @typescript-eslint/no-explicit-any */
export default function getEventName(abi: any, events: any) {
  const abiEvents = abi.filter((entry: any) => entry.type === 'event')
  
  return events.map((event: any) => {
    const keys = Object.keys(event)
    const abiEvent = abiEvents.find((e: any) => {
      const inspect = e.inputs.map((input: any) => input.name)

      return inspect.length === keys.length && keys.every((key) => inspect.includes(key))
    })
    
    if (!abiEvent) {
      throw new Error('Event not found')
    }

    return abiEvent.name
  })
}