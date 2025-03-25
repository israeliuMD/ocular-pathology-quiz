import * as React from "react";
import { cn } from "@/lib/utils";

const RadioGroupContext = React.createContext(null);

const RadioGroup = React.forwardRef(
  ({ className, value, onValueChange, disabled, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState(value);

    React.useEffect(() => {
      setSelectedValue(value);
    }, [value]);

    const handleValueChange = (newValue) => {
      setSelectedValue(newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    };

    return (
      <RadioGroupContext.Provider
        value={{ value: selectedValue, onChange: handleValueChange, disabled }}
      >
        <div
          ref={ref}
          className={cn("grid gap-2", className)}
          role="radiogroup"
          {...props}
        />
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef(
  ({ className, id, value, disabled, ...props }, ref) => {
    const groupContext = React.useContext(RadioGroupContext);
    const isDisabled = disabled || groupContext?.disabled;
    const isChecked = groupContext?.value === value;

    const handleChange = () => {
      if (!isDisabled && groupContext) {
        groupContext.onChange(value);
      }
    };

    return (
      <div className="flex items-center space-x-2">
        <button
          ref={ref}
          type="button"
          role="radio"
          id={id}
          aria-checked={isChecked}
          disabled={isDisabled}
          data-state={isChecked ? "checked" : "unchecked"}
          className={cn(
            "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            isChecked && "bg-primary border-primary",
            className
          )}
          onClick={handleChange}
          {...props}
        >
          {isChecked && (
            <span className="flex items-center justify-center h-full w-full relative">
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
            </span>
          )}
        </button>
      </div>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
