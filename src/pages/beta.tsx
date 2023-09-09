import { useToast } from "~/components/ui/use-toast";

export default function BetaRoute() {
  const { toast } = useToast();

  return (
    <div>
      <h1>BetaRoute</h1>
      <button onClick={() => toast({ title: "Hello", description: "World" })}>
        Toast
      </button>
    </div>
  );
}
