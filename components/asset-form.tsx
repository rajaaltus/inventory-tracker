"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/src/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, PackagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Id } from "@/src/convex/_generated/dataModel";

export interface AssetFormInitialValues {
  _id?: Id<"assets">;
  name: string;
  type: "hardware" | "software" | "";
  category: string;
  status: "available" | "assigned" | "maintenance" | "retired";
  serialNumber?: string;
  purchaseDate?: string;
  notes?: string;
}

interface AssetFormProps {
  initialValues?: Partial<AssetFormInitialValues>;
  onSuccess?: () => void;
}

export function AssetForm({ initialValues, onSuccess }: AssetFormProps) {
  const router = useRouter();
  const createAsset = useMutation(api.assets.create);
  const updateAsset = useMutation(api.assets.update);

  const isEditMode = !!initialValues?._id;

  const [name, setName] = useState(initialValues?.name ?? "");
  const [type, setType] = useState<"hardware" | "software" | "">(
    initialValues?.type ?? ""
  );
  const [category, setCategory] = useState(initialValues?.category ?? "");
  const [status, setStatus] = useState<"available" | "assigned" | "maintenance" | "retired">(
    initialValues?.status ?? "available"
  );
  const [serialNumber, setSerialNumber] = useState(initialValues?.serialNumber ?? "");
  const [purchaseDate, setPurchaseDate] = useState(initialValues?.purchaseDate ?? "");
  const [notes, setNotes] = useState(initialValues?.notes ?? "");

  const [errors, setErrors] = useState<{
    name?: string;
    type?: string;
    category?: string;
  }>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!type) newErrors.type = "Type is required";
    if (!category.trim()) newErrors.category = "Category is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);

    try {
      if (isEditMode && initialValues._id) {
        await updateAsset({
          id: initialValues._id,
          name: name.trim(),
          type: type as "hardware" | "software",
          category: category.trim(),
          status,
          serialNumber: serialNumber.trim() || undefined,
          purchaseDate: purchaseDate.trim() || undefined,
          notes: notes.trim() || undefined,
        });
        toast.success("Asset updated");
      } else {
        await createAsset({
          name: name.trim(),
          type: type as "hardware" | "software",
          category: category.trim(),
          status,
          serialNumber: serialNumber.trim() || undefined,
          purchaseDate: purchaseDate.trim() || undefined,
          notes: notes.trim() || undefined,
        });
        toast.success("Asset created");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save asset");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-1.5 focus-within:text-primary">
          <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
            Asset Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g. MacBook Pro M3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <Label htmlFor="type" className={errors.type ? "text-destructive" : ""}>
            Type <span className="text-destructive">*</span>
          </Label>
          <Select value={type} onValueChange={(val) => setType(val as any)}>
            <SelectTrigger
              id="type"
              className={errors.type ? "border-destructive focus:ring-destructive" : ""}
            >
              <SelectValue placeholder="Select asset type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hardware">Hardware</SelectItem>
              <SelectItem value="software">Software</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label htmlFor="category" className={errors.category ? "text-destructive" : ""}>
            Category <span className="text-destructive">*</span>
          </Label>
          <Input
            id="category"
            placeholder="e.g. Laptops, Design Licenses"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={errors.category ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(val) => setStatus(val as any)}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
          {/* Note: NFR dictates defaults to available, hidden states could be implemented, but spec allows all status dropdowns unless scoped. The form asks to default to available. */}
        </div>

        {/* Serial Number */}
        <div className="space-y-1.5">
          <Label htmlFor="serialNumber">
            Serial Number <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="serialNumber"
            placeholder="e.g. C02YM18BLVD"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
          />
        </div>

        {/* Purchase Date */}
        <div className="space-y-1.5">
          <Label htmlFor="purchaseDate">
            Purchase Date <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="purchaseDate"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">
          Notes <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="notes"
          placeholder="Any additional details about this asset..."
          className="resize-none h-24"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onSuccess) onSuccess();
            else router.back();
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <PackagePlus className="mr-2 size-4" />
          )}
          {isEditMode ? "Save Changes" : "Create Asset"}
        </Button>
      </div>
    </form>
  );
}
