import {
  cloneElement,
  ComponentChild,
  FunctionalComponent,
  h,
  toChildArray,
  VNode,
} from "preact";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { classNames } from "../utils/styling";
import { Link } from "preact-router";
import { Children } from "preact/compat";

type MenuItemProps = {
  active?: boolean;
  onClick?: () => void;
  href?: string;
};

export const MenuItem: FunctionalComponent<MenuItemProps> = ({
  onClick,
  href,
  children,
  active,
}) => {
  return (
    <Link
      className={classNames(
        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
        "block px-4 py-2 text-sm"
      )}
      onClick={onClick}
      href={href}
    >
      {Children.only(children)}
    </Link>
  );
};

type Props = {
  title: ComponentChild;
  className?: string;
};

const DropdownMenu: FunctionalComponent<Props> = ({
  title,
  children,
  className,
}) => {
  return (
    <Menu
      as="div"
      className={classNames("relative inline-block text-left", className ?? "")}
    >
      <div>
        <Menu.Button
          className="inline-flex justify-center items-center w-full rounded-md border
          border-gray-300 shadow-sm px-4 py-2 text-sm font-medium"
        >
          {title}
          <ChevronDownIcon className="mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {toChildArray(children).map((child, i) => (
              <Menu.Item key={i}>
                {({ active }) =>
                  cloneElement(child as unknown as VNode<any>, { active })
                }
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default DropdownMenu;
