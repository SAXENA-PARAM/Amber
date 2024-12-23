// custom.d.ts
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        url: string; // Define the url property
        className?: string; // Optionally define className
      };
    }
  }
}

export {};
