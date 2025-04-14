import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getFactoryContract } from "@/lib/contract";
import { Interface } from "ethers";
import factoryABI from "@/abis/VotingFactory.json";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  duration: z
    .string()
    .transform(Number)
    .pipe(
      z.number().min(5, {
        message: "Duration must be at least 5 minutes.",
      })
    ),
});

export function CreateElection() {
  const navigate = useNavigate();
  const [uploading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "60",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // TODO: Call smart contract to create election
      console.log("Creating election:", values);

      setLoading(true);
      const factory = await getFactoryContract();
      const tx = await factory.createElection(
        values.title,
        values.description,
        values.duration
      );
      const iface = new Interface(factoryABI.abi);
      const receipt = await tx.wait();

      let electionAddress: string | undefined;

      for (const log of receipt.logs) {
        try {
          const parsedLog = iface.parseLog(log);
          if (parsedLog?.name === "ElectionCreated") {
            electionAddress = parsedLog.args[0]; // or args.electionAddress if names exist
            break;
          }
        } catch (err) {
          // log doesn't belong to this ABI, safely ignore
          continue;
        }
      }

      if (!electionAddress) {
        throw new Error("ElectionCreated event not found in logs");
      }
      toast.success("Election Created!");
      setLoading(false);
      console.log("✅ Election Address:", electionAddress);
      navigate(`/add-candidates/${electionAddress}`);
    } catch (error) {
      setLoading(false);
      toast.error("Error", {
        description: "Failed to create election. Please try again.",
      });
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto backdrop-blur-sm bg-card/50">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Election</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Election Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Board Member Election 2025"
                        {...field}
                        disabled={uploading}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a clear, descriptive title for your election.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the purpose and details of this election..."
                        className="resize-none"
                        {...field}
                        disabled={uploading}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide important details about the election.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="5"
                        placeholder="60"
                        {...field}
                        disabled={uploading}
                      />
                    </FormControl>
                    <FormDescription>
                      How long should the voting period last?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={uploading}>
                Create Election
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
