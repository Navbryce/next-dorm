import { FunctionalComponent, h, RenderableProps } from "preact";

import { Listbox as HeadlessListBox } from "@headlessui/react";

type ListBoxProps<T> = {
  value: T;
  onChange: (value: T) => void;
};

export function ListBox<T>({
  children,
  ...rest
}: RenderableProps<ListBoxProps<T>>) {
  return <HeadlessListBox {...rest}>{children}</HeadlessListBox>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ListBox {
  export function Button({ children }: RenderableProps<unknown>) {
    return <HeadlessListBox.Button>{children}</HeadlessListBox.Button>;
  }

  export function Options({ children }: RenderableProps<unknown>) {
    return <HeadlessListBox.Options>{children}</HeadlessListBox.Options>;
  }

  type OptionProps<T> = {
    key: unknown;
    value: T;
  };

  export function Option<T>({
    children,
    ...rest
  }: RenderableProps<OptionProps<T>>) {
    return (
      <HeadlessListBox.Option {...rest}>{children}</HeadlessListBox.Option>
    );
  }
}
