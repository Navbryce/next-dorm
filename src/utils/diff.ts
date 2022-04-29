// selects properties of type T from O
type SelectPropertiesOfType<O, T> = {
  [Prop in keyof O as O[Prop] extends T ? Prop : never]: O[Prop];
};

type ArrayDiff<T> = {
  added: T;
  removed: T;
};
export type Diff<T extends Record<string, unknown>> = Partial<
  SelectPropertiesOfType<T, string | number | null>
> & {
  [Prop in keyof SelectPropertiesOfType<T, Array<any>>]: ArrayDiff<
    SelectPropertiesOfType<T, Array<any>>[Prop]
  >;
};

// assumes arrays aren't optional
export function diff<T extends Record<string, unknown>>(
  oldVal: T,
  newVal: T
): Diff<T> {
  const output: Record<string, unknown> = {};
  new Set([...Object.keys(oldVal), ...Object.keys(newVal)]).forEach((key) => {
    if (key in oldVal && key in newVal) {
      if (Array.isArray(oldVal[key])) {
        output[key] = findAddedAndRemovedElements(
          oldVal[key] as unknown[],
          newVal[key] as unknown[]
        );
        return;
      }
      if (oldVal[key] != newVal[key]) {
        output[key] = newVal[key];
        return;
      }
      return;
    }

    if (key in newVal) {
      output[key] = newVal[key];
      return;
    }

    output[key] = null;
  });
  return output as Diff<T>;
}

export function findAddedAndRemovedElements<T>(
  oldArray: T[],
  newArray: T[]
): { added: T[]; removed: T[] } {
  const oldSet = new Set(oldArray);
  const newSet = new Set(newArray);
  return {
    added: Array.from(newSet).filter((val) => !oldSet.has(val)),
    removed: Array.from(oldSet).filter((val) => !newSet.has(val)),
  };
}
