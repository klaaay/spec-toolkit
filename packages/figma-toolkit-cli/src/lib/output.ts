export function printJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

export function printSuccess(message: string): void {
  console.log(message);
}

export function printError(error: unknown): never {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('命令执行失败');
  }

  process.exit(1);
}
