import React from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useNavigate } from "react-router";
import { useLanguage } from "@/app/contexts/useLanguage";
import { useApp } from "@/app/contexts/useApp";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { NotificationBell } from "@/features/client/notifications/components/NotificationBell";

export function Header() {
  const { t, language, setLanguage, direction } = useLanguage();
  const { tenant, currentBranch, setCurrentBranch, user } = useApp();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Branch Switcher */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0F5C47] rounded-lg flex items-center justify-center text-white text-sm">
                {currentBranch?.name.charAt(0)}
              </div>
              <div className={direction === "rtl" ? "text-right" : "text-left"}>
                <div className="text-sm font-medium hidden sm:block">
                  {currentBranch?.name}
                </div>
                <div className="text-xs text-gray-500 hidden md:block">
                  {tenant?.name}
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-[200px] z-50"
              align={direction === "rtl" ? "end" : "start"}
            >
              {tenant?.branches.map((branch) => (
                <DropdownMenu.Item
                  key={branch.id}
                  className="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer outline-none"
                  onSelect={() => setCurrentBranch(branch)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#0F5C47] rounded text-white text-xs flex items-center justify-center">
                      {branch.name.charAt(0)}
                    </div>
                    <span className="text-sm">{branch.name}</span>
                  </div>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Language Switcher */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Globe className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium uppercase hidden sm:inline">
              {language}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-[150px] z-50"
              align={direction === "rtl" ? "start" : "end"}
            >
              <DropdownMenu.Item
                className="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer outline-none"
                onSelect={() => setLanguage("en")}
              >
                <span className="text-sm">English</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer outline-none"
                onSelect={() => setLanguage("ar")}
              >
                <span className="text-sm">العربية</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Notifications */}
        <NotificationBell />

        {/* User Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-[#0F5C47] rounded-full flex items-center justify-center text-white text-sm">
              {user?.name.charAt(0)}
            </div>
            <div
              className={`${direction === "rtl" ? "text-right" : "text-left"} hidden md:block`}
            >
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-gray-500 capitalize">
                {user?.role}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-[180px] z-50"
              align={direction === "rtl" ? "start" : "end"}
            >
              <DropdownMenu.Item
                className="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer outline-none"
                onSelect={() => navigate("/profile")}
              >
                <span className="text-sm">Profile</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer outline-none"
                onSelect={() => navigate("/settings")}
              >
                <span className="text-sm">{t("settings")}</span>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
              <DropdownMenu.Item className="px-3 py-2 rounded-md hover:bg-red-50 text-red-600 cursor-pointer outline-none">
                <span className="text-sm">Logout</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
