type Decorator = (
  object: any,
  key?: string,
  descriptor?: PropertyDescriptor,
) => void

export function when(condition: boolean, decorator: Decorator): Decorator {
  if (condition) return decorator

  /* Null decorator. */
  return (object: object, key?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) return descriptor
    if (object) return object
  }
}
