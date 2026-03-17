export type ErrorFactory = () => Error;
export type FailureEffect = () => void;

function runFailure(onFailure?: FailureEffect) {
  onFailure?.();
}

export function ensure(condition: unknown, createError: ErrorFactory, onFailure?: FailureEffect): asserts condition {
  if (!condition) {
    runFailure(onFailure);
    throw createError();
  }
}

export namespace ensure {
  export function nonNull<T>(value: T | null | undefined, createError: ErrorFactory, onFailure?: FailureEffect): T {
    if (value == null) {
      runFailure(onFailure);
      throw createError();
    }

    return value;
  }

  export function nonEmpty<T extends string | readonly unknown[]>(value: T | null | undefined, createError: ErrorFactory, onFailure?: FailureEffect): T {
    if (value == null || value.length === 0) {
      runFailure(onFailure);
      throw createError();
    }

    return value;
  }
}

export type Ensure = typeof ensure;
