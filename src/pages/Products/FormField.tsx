type FormFieldProps = {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
  };
  
  export default function FormField({ label, required, error, children }: FormFieldProps) {
    return (
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
  