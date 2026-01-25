declare module 'mermaid' {
  interface MermaidConfig {
    startOnLoad?: boolean;
    theme?: string;
    securityLevel?: string;
    fontFamily?: string;
  }

  interface RenderResult {
    svg: string;
  }

  interface Mermaid {
    initialize(config: MermaidConfig): void;
    render(id: string, text: string): Promise<RenderResult>;
  }

  const mermaid: Mermaid;
  export default mermaid;
}
