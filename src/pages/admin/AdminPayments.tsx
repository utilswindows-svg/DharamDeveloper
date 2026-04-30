import { motion } from "framer-motion";
import { useState } from "react";
import { CreditCard, CheckCircle2, XCircle, Settings, Plus, Globe, Shield, Zap } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Gateway = {
  id: string;
  name: string;
  provider: string;
  mode: "Live" | "Sandbox";
  status: "Active" | "Inactive";
  currencies: string[];
  fee: string;
  transactions: number;
  volume: string;
  integratedOn: string;
  icon: typeof CreditCard;
};

const initialGateways: Gateway[] = [
  {
    id: "gw-1",
    name: "Stripe",
    provider: "Stripe Inc.",
    mode: "Live",
    status: "Active",
    currencies: ["USD", "EUR", "INR", "GBP"],
    fee: "2.9% + $0.30",
    transactions: 1284,
    volume: "$48,920",
    integratedOn: "2025-08-12",
    icon: CreditCard,
  },
  {
    id: "gw-2",
    name: "PayPal",
    provider: "PayPal Holdings",
    mode: "Live",
    status: "Active",
    currencies: ["USD", "EUR", "GBP"],
    fee: "3.49% + fixed",
    transactions: 642,
    volume: "$21,540",
    integratedOn: "2025-09-03",
    icon: Globe,
  },
  {
    id: "gw-3",
    name: "Razorpay",
    provider: "Razorpay Software",
    mode: "Live",
    status: "Active",
    currencies: ["INR"],
    fee: "2.0%",
    transactions: 2120,
    volume: "₹8,42,300",
    integratedOn: "2025-07-21",
    icon: Zap,
  },
  {
    id: "gw-4",
    name: "Paddle",
    provider: "Paddle.com",
    mode: "Sandbox",
    status: "Inactive",
    currencies: ["USD", "EUR"],
    fee: "5% + $0.50",
    transactions: 0,
    volume: "$0",
    integratedOn: "2026-01-10",
    icon: Shield,
  },
  {
    id: "gw-5",
    name: "Square",
    provider: "Block, Inc.",
    mode: "Sandbox",
    status: "Inactive",
    currencies: ["USD"],
    fee: "2.6% + $0.10",
    transactions: 0,
    volume: "$0",
    integratedOn: "2026-02-04",
    icon: CreditCard,
  },
];

export default function AdminPayments() {
  const [gateways, setGateways] = useState<Gateway[]>(initialGateways);
  const [selected, setSelected] = useState<Gateway | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    provider: "",
    mode: "Sandbox" as "Live" | "Sandbox",
    currencies: "USD",
    fee: "",
    apiKey: "",
    secretKey: "",
    webhookUrl: "",
    status: "Active" as "Active" | "Inactive",
  });

  const resetForm = () =>
    setForm({
      name: "",
      provider: "",
      mode: "Sandbox",
      currencies: "USD",
      fee: "",
      apiKey: "",
      secretKey: "",
      webhookUrl: "",
      status: "Active",
    });

  const handleAddGateway = () => {
    if (!form.name || !form.provider || !form.fee) {
      toast.error("Please fill in Name, Provider, and Fee");
      return;
    }
    const newGateway: Gateway = {
      id: `gw-${Date.now()}`,
      name: form.name,
      provider: form.provider,
      mode: form.mode,
      status: form.status,
      currencies: form.currencies.split(",").map((c) => c.trim()).filter(Boolean),
      fee: form.fee,
      transactions: 0,
      volume: "$0",
      integratedOn: new Date().toISOString().split("T")[0],
      icon: CreditCard,
    };
    setGateways((prev) => [newGateway, ...prev]);
    toast.success(`${form.name} gateway added successfully`);
    resetForm();
    setAddOpen(false);
  };

  const total = gateways.length;
  const active = gateways.filter((g) => g.status === "Active").length;
  const live = gateways.filter((g) => g.mode === "Live").length;
  const totalTx = gateways.reduce((s, g) => s + g.transactions, 0);

  const toggleStatus = (id: string) => {
    setGateways((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: g.status === "Active" ? "Inactive" : "Active" }
          : g,
      ),
    );
    toast.success("Gateway status updated");
  };

  const stats = [
    { label: "Total Gateways", value: total, icon: CreditCard, color: "primary" },
    { label: "Active", value: active, icon: CheckCircle2, color: "success" },
    { label: "Live Mode", value: live, icon: Globe, color: "accent" },
    { label: "Transactions", value: totalTx.toLocaleString(), icon: Zap, color: "warning" },
  ];

  return (
    <AdminLayout
      title="Payment Gateways"
      description="Manage payment providers integrated with your website"
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-lg bg-${s.color}/10 flex items-center justify-center`}>
                <s.icon className={`h-4 w-4 text-${s.color}`} />
              </div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="font-bold text-foreground">Integrated Gateways</h2>
            <p className="text-xs text-muted-foreground">
              {total} payment providers connected
            </p>
          </div>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Gateway
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gateway</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Currencies</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Integrated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gateways.map((g) => (
              <TableRow key={g.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <g.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{g.name}</p>
                      <p className="text-xs text-muted-foreground">{g.provider}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={g.mode === "Live" ? "default" : "secondary"}>
                    {g.mode}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[160px]">
                    {g.currencies.map((c) => (
                      <Badge key={c} variant="outline" className="text-xs">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{g.fee}</TableCell>
                <TableCell className="font-medium">{g.transactions.toLocaleString()}</TableCell>
                <TableCell className="font-medium">{g.volume}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {g.status === "Active" ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Switch
                      checked={g.status === "Active"}
                      onCheckedChange={() => toggleStatus(g.id)}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {g.integratedOn}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelected(g)}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {selected?.name}</DialogTitle>
            <DialogDescription>
              Manage API keys, webhooks, and integration settings for this gateway.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Provider</span>
                <span className="font-medium">{selected.provider}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Mode</span>
                <Badge variant={selected.mode === "Live" ? "default" : "secondary"}>
                  {selected.mode}
                </Badge>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Fee</span>
                <span className="font-medium">{selected.fee}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Transactions</span>
                <span className="font-medium">{selected.transactions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Volume</span>
                <span className="font-medium">{selected.volume}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
            <Button onClick={() => { toast.success("Settings saved"); setSelected(null); }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={(open) => { setAddOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Payment Gateway</DialogTitle>
            <DialogDescription>
              Enter the details to integrate a new payment provider with your website.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="gw-name">Gateway Name *</Label>
              <Input
                id="gw-name"
                placeholder="e.g. Stripe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gw-provider">Provider Company *</Label>
              <Input
                id="gw-provider"
                placeholder="e.g. Stripe Inc."
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Mode</Label>
              <Select
                value={form.mode}
                onValueChange={(v: "Live" | "Sandbox") => setForm({ ...form, mode: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Live">Live</SelectItem>
                  <SelectItem value="Sandbox">Sandbox</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v: "Active" | "Inactive") => setForm({ ...form, status: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gw-currencies">Currencies (comma-separated)</Label>
              <Input
                id="gw-currencies"
                placeholder="USD, EUR, INR"
                value={form.currencies}
                onChange={(e) => setForm({ ...form, currencies: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gw-fee">Transaction Fee *</Label>
              <Input
                id="gw-fee"
                placeholder="e.g. 2.9% + $0.30"
                value={form.fee}
                onChange={(e) => setForm({ ...form, fee: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="gw-api">API Key</Label>
              <Input
                id="gw-api"
                type="password"
                placeholder="pk_live_..."
                value={form.apiKey}
                onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="gw-secret">Secret Key</Label>
              <Input
                id="gw-secret"
                type="password"
                placeholder="sk_live_..."
                value={form.secretKey}
                onChange={(e) => setForm({ ...form, secretKey: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="gw-webhook">Webhook URL</Label>
              <Input
                id="gw-webhook"
                placeholder="https://yourdomain.com/webhooks/payments"
                value={form.webhookUrl}
                onChange={(e) => setForm({ ...form, webhookUrl: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleAddGateway}>
              <Plus className="h-4 w-4 mr-1" />
              Add Gateway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}