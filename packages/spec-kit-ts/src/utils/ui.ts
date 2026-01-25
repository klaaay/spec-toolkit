import chalk from 'chalk';

/**
 * ASCII 横幅
 */
const BANNER = `
███████╗██████╗ ███████╗ ██████╗██╗███████╗██╗   ██╗
██╔════╝██╔══██╗██╔════╝██╔════╝██║██╔════╝╚██╗ ██╔╝
███████╗██████╔╝█████╗  ██║     ██║█████╗   ╚████╔╝
╚════██║██╔═══╝ ██╔══╝  ██║     ██║██╔══╝    ╚██╔╝
███████║██║     ███████╗╚██████╗██║██║        ██║
╚══════╝╚═╝     ╚══════╝ ╚═════╝╚═╝╚═╝        ╚═╝
`;

const TAGLINE = 'GitHub Spec Kit - Spec-Driven Development 工具包';

/**
 * 生成带颜色的 ASCII 横幅
 */
export function getBanner(): string {
  const colors = ['cyan', 'blue', 'cyanBright', 'blueBright', 'white', 'whiteBright'] as const;
  const lines = BANNER.trim().split('\n');
  const bannerBody = lines.map((line, i) => chalk[colors[i % colors.length]](line)).join('\n');
  const bannerTagline = chalk.yellow.italic(`${TAGLINE}`);

  return `${bannerBody}\n\n${bannerTagline}\n`;
}

/**
 * 显示 ASCII 横幅
 */
export function showBanner(): void {
  console.log(getBanner());
}

/**
 * 显示错误面板
 */
export function showError(title: string, message: string): void {
  console.log();
  console.log(chalk.red.bold(`✖ ${title}`));
  console.log(chalk.red(message));
  console.log();
}

/**
 * 显示成功消息
 */
export function showSuccess(message: string): void {
  console.log(chalk.green(`✔ ${message}`));
}

/**
 * 显示警告消息
 */
export function showWarning(message: string): void {
  console.log(chalk.yellow(`⚠ ${message}`));
}

/**
 * 显示信息消息
 */
export function showInfo(message: string): void {
  console.log(chalk.cyan(`ℹ ${message}`));
}

/**
 * 创建一个简单的表格显示
 */
export function showTable(rows: Array<[string, string]>): void {
  const maxKeyLength = Math.max(...rows.map(([key]) => key.length));
  rows.forEach(([key, value]) => {
    console.log(`${key.padEnd(maxKeyLength)} ${chalk.dim(value)}`);
  });
}

/**
 * 显示步骤进度
 */
export class StepTracker {
  private steps: Map<
    string,
    {
      label: string;
      status: 'pending' | 'running' | 'done' | 'error';
      detail?: string;
    }
  > = new Map();

  addStep(key: string, label: string): void {
    this.steps.set(key, { label, status: 'pending' });
  }

  startStep(key: string, detail?: string): void {
    const step = this.steps.get(key);
    if (step) {
      step.status = 'running';
      if (detail) step.detail = detail;
    }
  }

  completeStep(key: string, detail?: string): void {
    const step = this.steps.get(key);
    if (step) {
      step.status = 'done';
      if (detail) step.detail = detail;
    }
  }

  errorStep(key: string, detail?: string): void {
    const step = this.steps.get(key);
    if (step) {
      step.status = 'error';
      if (detail) step.detail = detail;
    }
  }

  render(): void {
    console.log(chalk.cyan.bold('\n进度:\n'));
    this.steps.forEach(step => {
      let symbol = '';
      let color: 'white' | 'green' | 'cyan' | 'red' | 'gray' = 'white';

      switch (step.status) {
        case 'done':
          symbol = '●';
          color = 'green';
          break;
        case 'running':
          symbol = '○';
          color = 'cyan';
          break;
        case 'error':
          symbol = '●';
          color = 'red';
          break;
        case 'pending':
          symbol = '○';
          color = 'gray';
          break;
      }

      const labelText = step.status === 'pending' ? chalk.gray(step.label) : chalk.white(step.label);
      const detailText = step.detail ? chalk.gray(` (${step.detail})`) : '';

      console.log(`  ${chalk[color](symbol)} ${labelText}${detailText}`);
    });
    console.log();
  }
}
