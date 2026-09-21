
"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Users,
  Plus,
  X,
  Crown,
  UserPlus,
  Settings,
  Check,
  Trash2,
  Search,
} from "lucide-react";

type GroupMember = {
  id: number;
  name: string;
  image: string;
  major?: string;
  hasLease: boolean;
  bio?: string;
};

type RoommateGroup = {
  id: number;
  name: string;
  members: GroupMember[];
  adminId: number;
};

// Mock logged-in user
const currentUser: GroupMember = {
  id: 1,
  name: "Aastha Sheth",
  image: "/p2.png",
  major: "Computer Science - Senior",
  hasLease: false,
  bio: "Organized, social, and loves a balanced study-life routine.",
};

// Mock people available to invite
const mockMatches: GroupMember[] = [
  {
    id: 2,
    name: "Usagi Tanaka",
    image: "/p3.jpg",
    major: "Biology - Junior",
    hasLease: true,
    bio: "Friendly, clean, and loves a calm apartment vibe.",
  },
  {
    id: 3,
    name: "Maya Patel",
    image: "/p2.png",
    major: "Neuroscience - Sophomore",
    hasLease: true,
    bio: "Calm, focused, and loves a peaceful home.",
  },
  {
    id: 4,
    name: "Zara Ahmed",
    image: "/p3.jpg",
    major: "Business - Senior",
    hasLease: false,
    bio: "Outgoing, stylish, and likes a neat space.",
  },
];

export default function Groups() {
  const [myGroup, setMyGroup] = useState<RoommateGroup | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [search, setSearch] = useState("");

  const isAdmin = myGroup?.adminId === currentUser.id;

  const handleCreateGroup = (members: GroupMember[]) => {
    if (members.length < 1) return;

    setMyGroup({
      id: Date.now(),
      name: "My Roommate Group",
      members: [currentUser, ...members],
      adminId: currentUser.id,
    });

    setShowCreateModal(false);
  };

  const handleAddMembers = (members: GroupMember[]) => {
    if (!myGroup || members.length === 0) return;

    const existingIds = new Set(
      myGroup.members.map((member) => member.id)
    );

    const newMembers = members.filter(
      (member) => !existingIds.has(member.id)
    );

    setMyGroup({
      ...myGroup,
      members: [...myGroup.members, ...newMembers],
    });

    setShowCreateModal(false);
  };

  const handleTransferAdmin = (newAdminId: number) => {
    if (!myGroup) return;

    setMyGroup({
      ...myGroup,
      adminId: newAdminId,
    });
  };

  const handleRemoveMember = (memberId: number) => {
    if (!myGroup || !isAdmin || memberId === currentUser.id) return;

    setMyGroup({
      ...myGroup,
      members: myGroup.members.filter(
        (member) => member.id !== memberId
      ),
    });
  };

  const handleLeaveGroup = () => {
    if (!myGroup) return;

    const remaining = myGroup.members.filter(
      (member) => member.id !== currentUser.id
    );

    if (remaining.length === 0) {
      setMyGroup(null);
      return;
    }

    setMyGroup({
      ...myGroup,
      members: remaining,
      adminId:
        myGroup.adminId === currentUser.id
          ? remaining[0].id
          : myGroup.adminId,
    });
  };

  const availableMatches = mockMatches.filter(
    (member) =>
      !myGroup?.members.some((existing) => existing.id === member.id) &&
      member.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-primary">
              ROOMMATE CONNECTIONS
            </p>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Roommate Groups
            </h1>
            <p className="mt-2 max-w-xl text-gray-600">
              Create your group, invite roommates, and manage your
              group’s members.
            </p>
          </div>

          {myGroup && (
            <button
              onClick={() => setShowManageModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-100 bg-white px-5 py-3 font-semibold text-primary shadow-sm transition hover:bg-orange-50"
            >
              <Settings size={18} />
              Manage Group
            </button>
          )}
        </div>

        {/* Empty state */}
        {!myGroup && (
          <section className="rounded-3xl border border-dashed border-orange-200 bg-white/80 p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-primary">
              <Users size={30} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Find your roommate crew
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-gray-600">
              Create a group with yourself and at least one other
              person. You’ll automatically become the group admin.
            </p>

            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 py-3 font-semibold text-white shadow-md transition hover:scale-[1.01]"
            >
              <Plus size={19} />
              Create Group
            </button>
          </section>
        )}

        {/* Existing group */}
        {myGroup && (
          <section className="overflow-hidden rounded-3xl border border-orange-100 bg-white/80 shadow-sm backdrop-blur-sm">
            <div className="bg-gradient-to-r from-primary to-secondary px-6 py-7 text-white sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-white/80">
                    <Users size={17} />
                    YOUR GROUP
                  </div>
                  <h2 className="text-2xl font-bold">
                    {myGroup.name}
                  </h2>
                  <p className="mt-2 text-sm text-white/80">
                    {myGroup.members.length} members
                  </p>
                </div>

                <button
                  onClick={() => setShowManageModal(true)}
                  className="inline-flex items-center justify-center gap-2 self-start rounded-2xl bg-white px-4 py-3 font-semibold text-primary shadow-sm transition hover:bg-orange-50 sm:self-auto"
                >
                  <Settings size={17} />
                  Manage
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-gray-900">
                  Group Members
                </h3>

                {isAdmin && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-primary">
                    <Crown size={14} />
                    You’re the admin
                  </span>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {myGroup.members.map((member) => {
                  const memberIsAdmin = member.id === myGroup.adminId;

                  return (
                    <div
                      key={member.id}
                      className="group relative overflow-hidden rounded-3xl border border-orange-100 bg-white/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative p-5">
                        <div className="flex items-start gap-4">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-4 ring-white shadow-md">
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="truncate font-bold text-gray-900">
                              {member.name}
                              {member.id === currentUser.id && " (You)"}
                            </h4>
                            <p className="mt-1 text-sm text-gray-600">
                              {member.major || "Roommate match"}
                            </p>

                            {memberIsAdmin && (
                              <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-primary">
                                <Crown size={12} />
                                Admin
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/60 p-4">
                          <p className="text-sm text-gray-700">
                            {member.bio || "No bio added yet."}
                          </p>

                          <div className="mt-3">
                            <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-primary">
                              {member.hasLease
                                ? "Has a lease"
                                : "No lease yet"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-orange-100 pt-6 sm:flex-row">
                {isAdmin && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-3 font-semibold text-white shadow-md transition hover:scale-[1.01]"
                  >
                    <UserPlus size={18} />
                    Add Members
                  </button>
                )}

                <button
                  onClick={() => setShowManageModal(true)}
                  className="rounded-2xl border border-orange-100 bg-white px-5 py-3 font-semibold text-primary transition hover:bg-orange-50"
                >
                  View Group Details
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Discover reminder */}
        <div className="mt-8 rounded-3xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/60 p-5">
          <p className="font-semibold text-primary">
            Looking for more roommate matches?
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Head to Discover to explore individual profiles and
            group matches.
          </p>
        </div>
      </div>

      {/* Create or add members modal */}
      {showCreateModal && (
        <CreateGroupModal
          isAddingMembers={!!myGroup}
          existingMemberIds={
            myGroup?.members.map((member) => member.id) ?? []
          }
          onClose={() => setShowCreateModal(false)}
          onCreate={myGroup ? handleAddMembers : handleCreateGroup}
        />
      )}

      {/* Manage group modal */}
      {showManageModal && myGroup && (
        <ManageGroupModal
          group={myGroup}
          currentUserId={currentUser.id}
          onClose={() => setShowManageModal(false)}
          onTransferAdmin={handleTransferAdmin}
          onRemoveMember={handleRemoveMember}
          onLeaveGroup={handleLeaveGroup}
        />
      )}
    </main>
  );
}

/* ---------------- CREATE / ADD MEMBERS MODAL ---------------- */

type CreateGroupModalProps = {
  isAddingMembers: boolean;
  existingMemberIds: number[];
  onClose: () => void;
  onCreate: (members: GroupMember[]) => void;
};

function CreateGroupModal({
  isAddingMembers,
  existingMemberIds,
  onClose,
  onCreate,
}: CreateGroupModalProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  const availableMembers = mockMatches.filter(
    (member) =>
      !existingMemberIds.includes(member.id) &&
      member.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleMember = (id: number) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((memberId) => memberId !== id)
        : [...previous, id]
    );
  };

  const handleSubmit = () => {
    if (selectedIds.length === 0) return;

    const selectedMembers = availableMembers.filter((member) =>
      selectedIds.includes(member.id)
    );

    onCreate(selectedMembers);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-orange-100 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isAddingMembers ? "Add Members" : "Create Your Group"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isAddingMembers
                ? "Choose people to add to your group."
                : "Select at least one person to join your group."}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-2 transition hover:bg-orange-50"
          >
            <X size={20} />
          </button>
        </div>

        {!isAddingMembers && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50/70 p-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl">
              <Image
                src={currentUser.image}
                alt={currentUser.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {currentUser.name} (You)
              </p>
              <p className="text-sm text-primary">Group Admin</p>
            </div>

            <Check className="text-primary" size={20} />
          </div>
        )}

        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-2xl border border-orange-100 bg-white px-11 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
          />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            People to invite
          </h3>
          <span className="text-sm text-gray-500">
            {selectedIds.length} selected
          </span>
        </div>

        {availableMembers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/40 p-5 text-center text-sm text-gray-600">
            No available people found.
          </div>
        ) : (
          <div className="space-y-3">
            {availableMembers.map((member) => {
              const selected = selectedIds.includes(member.id);

              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleMember(member.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition ${
                    selected
                      ? "border-orange-300 bg-orange-50"
                      : "border-orange-100 bg-white hover:bg-orange-50/50"
                  }`}
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">
                      {member.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {member.major || "Roommate match"}
                    </p>
                  </div>

                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                      selected
                        ? "border-orange-300 bg-gradient-to-r from-primary to-secondary text-white"
                        : "border-orange-200 bg-white"
                    }`}
                  >
                    {selected && <Check size={15} />}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {!isAddingMembers && selectedIds.length === 0 && (
          <p className="mt-4 text-sm text-primary">
            Select at least one person to enable group creation.
          </p>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-2xl border border-orange-100 px-5 py-3 font-semibold text-gray-700 transition hover:bg-orange-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={selectedIds.length === 0}
            className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-3 font-semibold text-white shadow-md transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isAddingMembers ? "Add Selected Members" : "Create Group"}
            {!isAddingMembers &&
              selectedIds.length > 0 &&
              ` (${selectedIds.length + 1} members)`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- MANAGE GROUP MODAL ---------------- */

type ManageGroupModalProps = {
  group: RoommateGroup;
  currentUserId: number;
  onClose: () => void;
  onTransferAdmin: (newAdminId: number) => void;
  onRemoveMember: (memberId: number) => void;
  onLeaveGroup: () => void;
};

function ManageGroupModal({
  group,
  currentUserId,
  onClose,
  onTransferAdmin,
  onRemoveMember,
  onLeaveGroup,
}: ManageGroupModalProps) {
  const [showLeaveConfirmation, setShowLeaveConfirmation] =
    useState(false);

  const isAdmin = group.adminId === currentUserId;

  const currentAdmin = group.members.find(
    (member) => member.id === group.adminId
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-orange-100 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Manage Group
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {group.members.length} members
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-2 transition hover:bg-orange-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/60 p-4">
          <p className="text-sm text-gray-600">Current admin</p>
          <p className="mt-1 flex items-center gap-2 font-semibold text-primary">
            <Crown size={17} />
            {currentAdmin?.name ?? "No admin assigned"}
            {group.adminId === currentUserId && " (You)"}
          </p>
        </div>

        <h3 className="mb-3 font-semibold text-gray-900">
          Members
        </h3>

        <div className="space-y-3">
          {group.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-2xl border border-orange-100 p-3"
            >
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900">
                  {member.name}
                  {member.id === currentUserId && " (You)"}
                </p>
                <p className="text-sm text-gray-500">
                  {member.major || "Roommate match"}
                </p>
              </div>

              {member.id === group.adminId && (
                <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-xs font-semibold text-primary">
                  <Crown size={12} />
                  Admin
                </span>
              )}

              {isAdmin && member.id !== currentUserId && (
                <button
                  onClick={() => onRemoveMember(member.id)}
                  aria-label={`Remove ${member.name}`}
                  title="Remove member"
                  className="rounded-xl p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {isAdmin && group.members.length > 1 && (
          <div className="mt-6 border-t border-orange-100 pt-6">
            <label
              htmlFor="new-admin"
              className="mb-2 block font-semibold text-gray-900"
            >
              Transfer Admin Role
            </label>

            <p className="mb-3 text-sm text-gray-600">
              Choose another member to become the group admin.
            </p>

            <select
              id="new-admin"
              value={group.adminId}
              onChange={(event) =>
                onTransferAdmin(Number(event.target.value))
              }
              className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
            >
              {group.members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                  {member.id === currentUserId ? " (You)" : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-7 border-t border-orange-100 pt-6">
          {!showLeaveConfirmation ? (
            <button
              onClick={() => setShowLeaveConfirmation(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={16} />
              Leave Group
            </button>
          ) : (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="font-semibold text-red-700">
                Leave this group?
              </p>

              <p className="mt-1 text-sm text-red-600">
                {isAdmin && group.members.length > 1
                  ? "Admin rights will be transferred to another member."
                  : "You will be removed from this group."}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setShowLeaveConfirmation(false)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    onLeaveGroup();
                    onClose();
                  }}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Leave Group
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-3 font-semibold text-white shadow-md transition hover:scale-[1.01]"
        >
          Done
        </button>
      </div>
    </div>
  );
}