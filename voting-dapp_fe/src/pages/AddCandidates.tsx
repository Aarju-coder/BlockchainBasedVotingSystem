import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Upload } from "lucide-react";
import { uploadToIPFS } from "@/lib/ipfs";
import { getElectionContract } from "@/lib/contract";

const candidateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  imageCid: z.string().min(10, "No hash value found for image, upload again."), // CID format
});

const formSchema = z.object({
  candidates: z.array(candidateSchema).min(2, "Add at least 2 candidates"),
});

export function AddCandidates() {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidates: [
        { name: "", imageCid: "" },
        { name: "", imageCid: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "candidates",
    control: form.control,
  });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ipfsUrl = await uploadToIPFS(file);
      form.setValue(`candidates.${index}.imageCid`,ipfsUrl);

      toast.success("✅ Image uploaded");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // TODO: Call smart contract to add candidates
      console.log(values);
      const contract = await getElectionContract(electionId as string);
      for (const candidate of values.candidates) {
        await contract.addCandidate(candidate.name, candidate.imageCid);
      }

      toast.success("Candidates Added.");

      navigate("/elections");
    } catch (error) {
      toast.error("Error in adding candidates");
      console.log(error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Add Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-4 items-start p-4 border rounded-lg"
                  >
                    <div className="flex-1 space-y-4">
                      <FormField
                        control={form.control}
                        name={`candidates.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Candidate Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter candidate name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`candidates.${index}.imageCid`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profile Image</FormLabel>
                            <FormControl>
                              <div className="flex gap-4 items-center">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, index)}
                                  className="hidden"
                                  id={`image-${index}`}
                                />
                                <label
                                  htmlFor={`image-${index}`}
                                  className="flex gap-2 items-center px-4 py-2 border rounded-md cursor-pointer hover:bg-secondary"
                                >
                                  <Upload className="h-4 w-4" />
                                  Upload Image
                                </label>
                                {field.value && (
                                  <img
                                    src={`https://ipfs.io/ipfs/${field.value}`}
                                    alt="Preview"
                                    className="h-12 w-12 rounded-full object-cover"
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {fields.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => append({ name: "", imageCid: "" })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Candidate
              </Button>

              <Button type="submit" className="w-full" disabled={uploading}>
                Submit Candidates
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
