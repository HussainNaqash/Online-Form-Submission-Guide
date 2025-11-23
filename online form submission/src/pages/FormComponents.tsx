import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Trash2, MapPin } from "lucide-react";

// --- Reusable Page Header ---
export const PageHeader = ({ title, description }: { title: string; description: string }) => (
  <div className="mb-6">
    <h1 className="text-3xl font-bold mb-2">{title}</h1>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

// --- Reusable Text Input ---
export const FormInput = ({ label, icon: Icon, className, ...props }: any) => (
  <div className={`space-y-2 ${className}`}>
    <Label htmlFor={props.id}>
      {label} {props.required && <span className="text-destructive">*</span>}
    </Label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />}
      <Input className={Icon ? "pl-10" : ""} {...props} />
    </div>
  </div>
);

// --- Reusable Select ---
export const FormSelect = ({ label, value, onChange, options, placeholder, required }: any) => (
  <div className="space-y-2">
    <Label>
      {label} {required && <span className="text-destructive">*</span>}
    </Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt: string) => (
          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

// --- Reusable File Upload ---
export const FileUploadField = ({ label, file, previewUrl, onFileSelect, onRemove }: any) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
      if (!validTypes.includes(selectedFile.type)) {
        alert("Please select a valid file (JPG, PNG, WEBP, or PDF)");
        return;
      }
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 bg-muted/30">
        <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-3 overflow-hidden relative group">
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              {onRemove && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={onRemove}>
                  <Trash2 className="text-white w-6 h-6" />
                </div>
              )}
            </>
          ) : (
            <span className="text-sm text-muted-foreground">No File</span>
          )}
        </div>
        <input ref={inputRef} type="file" className="hidden" accept="image/*,application/pdf" onChange={handleChange} />
        <Button variant="outline" size="sm" type="button" onClick={() => inputRef.current?.click()}>
          <Upload className="w-4 h-4 mr-2" />
          {file ? "Change File" : "Choose File"}
        </Button>
        {file && <p className="text-xs text-muted-foreground mt-2">{file.name}</p>}
      </div>
    </div>
  );
};

// --- Reusable Navigation ---
export const FormNavigation = ({ onBack, onNext, backLabel = "Back", nextLabel = "Save & Continue" }: any) => (
  <div className="flex items-center justify-end gap-4 pt-6">
    {onBack && (
      <Button variant="outline" size="lg" onClick={onBack} type="button">
        {backLabel}
      </Button>
    )}
    <Button size="lg" onClick={onNext} type="submit">
      {nextLabel}
    </Button>
  </div>
);