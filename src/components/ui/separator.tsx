import * as React from 'react';

type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
};

export function Separator({
  orientation = 'horizontal',
  decorative = true,
  className = '',
  ...props
}: SeparatorProps) {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={orientation}
      className={
        [
          'shrink-0 bg-border',
          orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full',
          className,
        ].join(' ')
      }
      {...props}
    />
  );
}

export default Separator;
