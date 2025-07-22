import * as React from "react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";


interface DateRangePickerProps {
  fromDate: string;
  toDate: string;
  onChange: (from: string, to: string) => void;
}

export function DateRangePicker({ fromDate, toDate, onChange }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  // const currentYear = new Date().getFullYear();
  // const fromYear = currentYear - 30;
  // const toYear = currentYear;

  const [range, setRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
    from: fromDate ? new Date(fromDate) : undefined,
    to: toDate ? new Date(toDate) : undefined,
  });

  const handleSelect = (dates: { from: Date; to: Date }) => {
    setRange(dates);
    const fromStr = dates.from ? format(dates.from, "yyyy-MM-dd") : "";
    const toStr = dates.to ? format(dates.to, "yyyy-MM-dd") : "";
    onChange(fromStr, toStr);
  };

  const displayLabel =
    range.from && range.to
      ? `${format(range.from, "dd/MM/yyyy")} - ${format(range.to, "dd/MM/yyyy")}`
      : range.from
      ? format(range.from, "dd/MM/yyyy")
      : "בחר טווח תאריכים";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          // captionLayout="dropdown"
          selected={range}
          onSelect={(dates) => dates && handleSelect(dates as any)}
          numberOfMonths={1}
          // fromYear={fromYear}
          // toYear={toYear}
          className="rtl text-right rounded-md border bg-white dark:bg-zinc-900 shadow-md
            [&_.rdp-day_selected]:bg-purple-600
            [&_.rdp-day_selected]:text-white
            [&_.rdp-day_selected]:rounded-full
            [&_.rdp-day_range_middle]:bg-purple-200
            dark:[&_.rdp-day_range_middle]:bg-purple-700/50
            [&_.rdp-caption_label]:text-base
            [&_.rdp-caption_dropdowns]:flex [&_.rdp-caption_dropdowns]:flex-row-reverse [&_.rdp-caption_dropdowns]:gap-2 [&_.rdp-caption_dropdowns]:justify-between [&_.rdp-caption_dropdowns]:items-center"
          locale={he}
        />
      </PopoverContent>
    </Popover>
  );
}