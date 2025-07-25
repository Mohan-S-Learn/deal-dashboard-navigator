
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto w-full max-w-sm", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center h-10",
        caption_label: "text-sm font-medium truncate",
        caption_dropdowns: "flex justify-center gap-1",
        vhidden: "hidden",
        dropdown_month: "relative inline-flex items-center min-w-0",
        dropdown_year: "relative inline-flex items-center min-w-0", 
        dropdown: "absolute inset-0 w-full appearance-none opacity-0 z-10 cursor-pointer text-xs",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 shrink-0"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] flex-1 text-center",
        row: "flex w-full mt-2",
        cell: "h-8 w-8 text-center text-sm p-0 relative flex-1 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 text-xs"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        Dropdown: ({ value, onChange, children, ...props }) => {
          const options = React.Children.toArray(children);
          
          return (
            <select
              value={value}
              onChange={(e) => {
                if (onChange) {
                  onChange({
                    target: { value: parseInt(e.target.value, 10) }
                  } as any);
                }
              }}
              className="text-xs font-medium bg-transparent border-0 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-1 py-0.5 min-w-0 max-w-20 truncate"
              {...props}
            >
              {options}
            </select>
          );
        },
      }}
      captionLayout="dropdown-buttons"
      fromYear={1900}
      toYear={2100}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
