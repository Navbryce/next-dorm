import { FunctionalComponent, h, RenderableProps } from "preact";

import { Listbox as HeadlessListBox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { classNames } from "src/utils/styling";
import { Stylable } from "src/types/types";

type ListBoxProps<T> = {
  value: T;
  onChange: (value: T) => void;
};

export function ListBox<T>({
  children,
  className,
  ...rest
}: RenderableProps<ListBoxProps<T>> & Stylable) {
  return (
    <div className={classNames("relative z-20 w-72", className ?? "")}>
      <HeadlessListBox {...rest}>{children}</HeadlessListBox>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ListBox {
  export function Option<T>({
    children,
    ...rest
  }: RenderableProps<OptionProps<T>>) {
    return (
      <HeadlessListBox.Option
        className={({ active }) =>
          `cursor-default select-none relative py-4 pl-10 pr-4 ${
            active ? "text-cyan-400 bg-cyan-900" : "text-white"
          }`
        }
        {...rest}
      >
        {({ active, selected }) => (
          <div>
            <span
              className={classNames(
                "absolute inset-y-0 left-0 flex items-center pl-3",
                selected ? "text-cyan-400" : "font-normal"
              )}
            >
              {selected ? (
                <CheckIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <span className="w-5 h-5" />
              )}
              {children}
            </span>
          </div>
        )}
      </HeadlessListBox.Option>
    );
  }

  export function Button({ children }: RenderableProps<unknown>) {
    return (
      <div class="relative mt-1">
        <HeadlessListBox.Button
          className="
          !bg-none !bg-slate-700
          relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-sm
          focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm"
        >
          <span className="block truncate">{children}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SelectorIcon className="w-5 h-5 text-white" aria-hidden="true" />
          </span>
        </HeadlessListBox.Button>
      </div>
    );
  }

  export function Options({ children }: RenderableProps<unknown>) {
    return (
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <HeadlessListBox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-slate-800 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {children}
        </HeadlessListBox.Options>
      </Transition>
    );
  }

  type OptionProps<T> = {
    key: unknown;
    value: T;
  };
}
