import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

declare module '@ant-design/icons/lib/components/AntdIcon' {
  export interface AntdIconProps {
    onPointerEnterCapture?: React.PointerEventHandler<HTMLSpanElement>;
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLSpanElement>;
  }
} 