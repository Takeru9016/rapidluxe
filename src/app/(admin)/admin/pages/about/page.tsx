"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, Trash2, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PortableTextBlock } from "@portabletext/react";

import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { CloudinaryUpload } from "@/components/admin/CloudinaryUpload";

// ── Types ─────────────────────────────────────────────────────────────────────

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

interface Stat {
  number: string;
  label: string;
}

interface AboutApiResponse {
  headline: string | null;
  subheadline: string | null;
  heroImageUrl: string | null;
  story: PortableTextBlock[] | null;
  missionTitle: string | null;
  missionBody: PortableTextBlock[] | null;
  team: TeamMember[] | null;
  stats: Stat[] | null;
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold)/60 transition-colors";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-5 md:p-8">
      <h2 className="font-['DM_Sans'] text-xs font-semibold uppercase tracking-widest text-(--color-gold) mb-5">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ── Team Member Row ───────────────────────────────────────────────────────────

function TeamMemberRow({
  member,
  index,
  onChange,
  onRemove,
}: {
  member: TeamMember;
  index: number;
  onChange: (index: number, updated: TeamMember) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="p-4 rounded-lg border border-(--color-navy-border) space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) uppercase tracking-widest">
          Member {index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1.5 rounded-md text-(--color-white-muted) hover:text-(--color-coral) hover:bg-(--color-coral)/10 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor={`team-name-${index}`}
            className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5"
          >
            Name
          </label>
          <input
            id={`team-name-${index}`}
            value={member.name}
            onChange={(e) =>
              onChange(index, { ...member, name: e.target.value })
            }
            placeholder="Full name"
            className={inputCls}
          />
        </div>
        <div>
          <label
            htmlFor={`team-role-${index}`}
            className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5"
          >
            Role
          </label>
          <input
            id={`team-role-${index}`}
            value={member.role}
            onChange={(e) =>
              onChange(index, { ...member, role: e.target.value })
            }
            placeholder="e.g. Founder & CEO"
            className={inputCls}
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor={`team-bio-${index}`}
            className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5"
          >
            Bio
          </label>
          <textarea
            id={`team-bio-${index}`}
            value={member.bio}
            onChange={(e) =>
              onChange(index, { ...member, bio: e.target.value })
            }
            rows={3}
            placeholder="Short bio…"
            className={inputCls + " resize-none"}
          />
        </div>
        <div className="sm:col-span-2">
          <span className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5">
            Photo
          </span>
          {member.imageUrl && (
            <div className="relative w-16 h-16 rounded-full overflow-hidden mb-2">
              <Image
                src={member.imageUrl}
                alt={member.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}
          <CloudinaryUpload
            folder="rapidluxe/team"
            currentUrl={member.imageUrl}
            onUpload={(url) => onChange(index, { ...member, imageUrl: url })}
          />
        </div>
      </div>
    </div>
  );
}

// ── Stat Row ──────────────────────────────────────────────────────────────────

function StatRow({
  stat,
  index,
  onChange,
  onRemove,
}: {
  stat: Stat;
  index: number;
  onChange: (index: number, updated: Stat) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-(--color-navy-border)">
      <div className="flex-1">
        <input
          value={stat.number}
          onChange={(e) => onChange(index, { ...stat, number: e.target.value })}
          placeholder="27"
          className={inputCls}
        />
      </div>
      <div className="flex-1">
        <input
          value={stat.label}
          onChange={(e) => onChange(index, { ...stat, label: e.target.value })}
          placeholder="Countries Explored"
          className={inputCls}
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-1.5 rounded-md text-(--color-white-muted) hover:text-(--color-coral) hover:bg-(--color-coral)/10 transition-colors shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminAboutPage() {
  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [story, setStory] = useState<PortableTextBlock[]>([]);
  const [missionTitle, setMissionTitle] = useState("");
  const [missionBody, setMissionBody] = useState<PortableTextBlock[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [storyKey, setStoryKey] = useState(0);
  const [missionKey, setMissionKey] = useState(0);
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery<{ data: AboutApiResponse | null }>({
    queryKey: ["admin-about"],
    queryFn: async () => {
      const res = await fetch("/api/admin/sanity/about");
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<{ data: AboutApiResponse | null }>;
    },
  });

  useEffect(() => {
    const d = data?.data;
    if (!d) return;
    setHeadline(d.headline ?? "");
    setSubheadline(d.subheadline ?? "");
    setHeroImageUrl(d.heroImageUrl ?? "");
    setStory(d.story ?? []);
    setMissionTitle(d.missionTitle ?? "");
    setMissionBody(d.missionBody ?? []);
    setTeam(d.team ?? []);
    setStats(d.stats ?? []);
    setStoryKey((k) => k + 1);
    setMissionKey((k) => k + 1);
  }, [data]);

  const updateTeamMember = (i: number, updated: TeamMember) => {
    setTeam((prev) => prev.map((m, idx) => (idx === i ? updated : m)));
  };

  const removeTeamMember = (i: number) => {
    setTeam((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addTeamMember = () => {
    setTeam((prev) => [...prev, { name: "", role: "", bio: "", imageUrl: "" }]);
  };

  const updateStat = (i: number, updated: Stat) => {
    setStats((prev) => prev.map((s, idx) => (idx === i ? updated : s)));
  };

  const removeStat = (i: number) => {
    setStats((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addStat = () => {
    setStats((prev) => [...prev, { number: "", label: "" }]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/sanity/about", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline,
          subheadline,
          heroImageUrl: heroImageUrl || undefined,
          story,
          missionTitle,
          missionBody,
          team,
          stats,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("About page saved");
    } catch {
      toast.error("Failed to save about page");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-text-secondary) hover:text-(--color-gold) transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Pages
        </Link>
        <a
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-['DM_Sans'] text-(--color-text-secondary) hover:text-(--color-gold) transition-colors"
        >
          Preview <ExternalLink size={12} />
        </a>
      </div>

      <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
        About Us
      </h1>

      {isLoading ? (
        <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
          Loading…
        </p>
      ) : (
        <div className="space-y-6">
          {/* ── Hero ── */}
          <SectionCard title="Hero">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="about-headline"
                  className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5"
                >
                  Headline
                </label>
                <input
                  id="about-headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Your Next Journey Awaits"
                  className={inputCls}
                />
              </div>
              <div>
                <label
                  htmlFor="about-subheadline"
                  className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5"
                >
                  Subheadline
                </label>
                <input
                  id="about-subheadline"
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  placeholder="Bespoke luxury travel from India"
                  className={inputCls}
                />
              </div>
              <div>
                <span className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5">
                  Hero Image
                </span>
                <CloudinaryUpload
                  folder="rapidluxe/about"
                  currentUrl={heroImageUrl}
                  onUpload={setHeroImageUrl}
                />
              </div>
            </div>
          </SectionCard>

          {/* ── Company Story ── */}
          <SectionCard title="Company Story">
            <RichTextEditor key={storyKey} value={story} onChange={setStory} />
          </SectionCard>

          {/* ── Mission Statement ── */}
          <SectionCard title="Mission Statement">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="about-mission-title"
                  className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5"
                >
                  Title
                </label>
                <input
                  id="about-mission-title"
                  value={missionTitle}
                  onChange={(e) => setMissionTitle(e.target.value)}
                  placeholder="Our mission"
                  className={inputCls}
                />
              </div>
              <div>
                <span className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5">
                  Body
                </span>
                <RichTextEditor
                  key={missionKey}
                  value={missionBody}
                  onChange={setMissionBody}
                />
              </div>
            </div>
          </SectionCard>

          {/* ── Team Members ── */}
          <SectionCard title="Team Members">
            <div className="space-y-4">
              {team.map((member, i) => (
                <TeamMemberRow
                  key={i}
                  member={member}
                  index={i}
                  onChange={updateTeamMember}
                  onRemove={removeTeamMember}
                />
              ))}
              <button
                type="button"
                onClick={addTeamMember}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm hover:border-(--color-gold)/40 hover:text-white transition-colors"
              >
                <Plus size={14} />
                Add Team Member
              </button>
            </div>
          </SectionCard>

          {/* ── Stats ── */}
          <SectionCard title="Stats">
            <div className="space-y-3">
              {stats.length > 0 && (
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-1">
                  <span className="text-xs font-['DM_Sans'] text-(--color-text-secondary) px-3">
                    Number
                  </span>
                  <span className="text-xs font-['DM_Sans'] text-(--color-text-secondary) px-3">
                    Label
                  </span>
                  <span />
                </div>
              )}
              {stats.map((stat, i) => (
                <StatRow
                  key={i}
                  stat={stat}
                  index={i}
                  onChange={updateStat}
                  onRemove={removeStat}
                />
              ))}
              <button
                type="button"
                onClick={addStat}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm hover:border-(--color-gold)/40 hover:text-white transition-colors"
              >
                <Plus size={14} />
                Add Stat
              </button>
            </div>
          </SectionCard>

          {/* ── Actions ── */}
          <div className="flex gap-3 pb-8">
            <Link
              href="/admin/pages"
              className="px-6 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm font-medium hover:border-(--color-gold)/40 hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-(--color-gold) text-(--color-navy) font-['DM_Sans'] text-sm font-bold hover:bg-(--color-gold)/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
