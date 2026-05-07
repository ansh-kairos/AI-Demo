"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const [defaultTone, setDefaultTone] = useState("professional");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/user/preferences")
      .then((res) => res.json())
      .then((data) => {
        if (data.preferences) {
          setDefaultTone(data.preferences.defaultTone || "professional");
          setUserName(data.preferences.userName || "");
          setUserRole(data.preferences.userRole || "");
          setSignature(data.preferences.signature || "");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const savePreferences = async () => {
    setSaving(true);
    try {
      await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultTone, userName, userRole, signature }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings className="h-6 w-6" />
        Settings
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Reply Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Your Name</label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Your Role</label>
            <Select value={userRole} onValueChange={setUserRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="freelancer">Freelancer</SelectItem>
                <SelectItem value="agency">Agency Owner</SelectItem>
                <SelectItem value="business">Business Owner</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Default Reply Tone
            </label>
            <Select value={defaultTone} onValueChange={setDefaultTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="brief">Brief / Concise</SelectItem>
                <SelectItem value="assertive">Assertive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Email Signature
            </label>
            <Textarea
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Best regards,&#10;Your Name"
              rows={3}
            />
          </div>

          <Button onClick={savePreferences} disabled={saving}>
            {saved ? (
              <Check className="h-4 w-4 mr-1" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            {saved ? "Saved!" : saving ? "Saving..." : "Save Preferences"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
