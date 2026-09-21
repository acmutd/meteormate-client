
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Users,
  Plus,
  X,
  Crown,
  UserPlus,
  Settings,
  Check,
  Trash2,
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
  name: "Aastha",
  image: "/p2.png",
  major: "Computer Science",
  hasLease: false,
  bio: "Looking for friendly roommates!",
};

// Mock people available to invite
const mockTopMatches: GroupMember[] = [
  {
    id: 2,
    name: "Usagi",
    image: "/p1.png",
    major: "Computer Science",
    hasLease: false,
    bio: "I love anime, gaming, and exploring new places.",
  },
  {
    id: 3,
    name: "Maya",
    image: "/p3.png",
    major: "Data Science",
    hasLease: true,
    bio: "I enjoy reading, music, and a clean living space.",
  },
  {
    id: 4,
    name: "Zara",
    image: "/p4.png",
    major: "Computer Science",
    hasLease: false,
    bio: "Looking for roommates who enjoy hanging out.",
  },
  {
    id: 5,
    name: "Ryan Edward",
    image: "/p5.png",
    major: "Software Engineering",
    hasLease: true,
    bio: "Into sports, cooking, and meeting new people.",
  },
];

export default function Groups() {
  const [myGroup, setMyGroup] = useState<RoommateGroup | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  const handleCreateGroup = (selectedMembers: GroupMember[]) => {
    if (selectedMembers.length === 0) return;

    setMyGroup({
      id: Date.now(),
      name: "My Roommate Group",
      members: [currentUser, ...selectedMembers],
      adminId: currentUser.id,
    });

    setShowCreateModal(false);
  };

  const handleAddMembers = (selectedMembers: GroupMember[]) => {
    if (!myGroup || selectedMembers.length === 0) return;

    const existingIds = new Set(
      myGroup.members.map((member) => member.id)
    );

    const newMembers = selectedMembers.filter(
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

  const handleLeaveGroup = () => {
    if (!myGroup) return;

    const remainingMembers = myGroup.members.filter(
      (member) => member.id !== currentUser.id
    );

    if (remainingMembers.length === 0) {
      setMyGroup(null);
      return;
    }

    setMyGroup({
      ...myGroup,
      members: remainingMembers,
      adminId:
        myGroup.adminId === currentUser.id
          ? remainingMembers[0].id
          : myGroup.adminId,
    });
  };

  const isCurrentUserAdmin =
    myGroup?.adminId === currentUser.id;

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-4 py-8 text-gray-900 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-orange-600">
              ROOMMATE CONNECTIONS
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Roommate Groups
            </h1>

            <p className="mt-2 max-w-xl text-gray-600">
              Create your roommate group and manage the people
              you want to live with.
            </p>
          </div>

          {myGroup && (
            <button
              onClick={() => setShowManageModal(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-medium shadow-sm transition hover:bg-gray-50"
            >
              <Settings size={18} />
              Manage Group
            </button>
          )}
        </div>

        {/* Empty state */}
        {!myGroup && (
          <section className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center sm:px-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <Users size={30} />
            </div>

            <h2 className="text-2xl font-bold">
              Create your roommate group
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-gray-600">
              Start with yourself and invite at least one other
              person. You’ll automatically become the group admin.
            </p>

            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              <Plus size={19} />
              Create Group
            </button>
          </section>
        )}

        {/* Existing group */}
        {myGroup && (
          <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="bg-orange-500 px-6 py-7 text-white sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-orange-100">
                    <Users size={17} />
                    YOUR GROUP
                  </div>

                  <h2 className="text-2xl font-bold">
                    {myGroup.name}
                  </h2>

                  <p className="mt-2 text-orange-100">
                    {myGroup.members.length} members
                  </p>
                </div>

                <button
                  onClick={() => setShowManageModal(true)}
                  className="flex items-center justify-center gap-2 self-start rounded-xl bg-white px-4 py-2.5 font-semibold text-orange-600 transition hover:bg-orange-50 sm:self-auto"
                >
                  <Settings size={17} />
                  Manage
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">
                  Group Members
                </h3>

                {isCurrentUserAdmin && (
                  <span className="flex items-center gap-1 text-sm font-medium text-orange-600">
                    <Crown size={15} />
                    You’re the admin
                  </span>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myGroup.members.map((member) => {
                  const isAdmin = member.id === myGroup.adminId;

                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gray-100">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">
                          {member.name}
                          {member.id === currentUser.id && (
                            <span className="ml-1 text-sm font-normal text-gray-500">
                              (You)
                            </span>
                          )}
                        </p>

                        <p className="mt-1 truncate text-sm text-gray-500">
                          {member.major || "Major not specified"}
                        </p>

                        {isAdmin && (
                          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-600">
                            <Crown size={12} />
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">
                {isCurrentUserAdmin && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
                  >
                    <UserPlus size={18} />
                    Add Members
                  </button>
                )}

                <button
                  onClick={() => setShowManageModal(true)}
                  className="rounded-xl border border-gray-200 px-5 py-3 font-medium transition hover:bg-gray-50"
                >
                  View Group Details
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Discover reminder */}
        <div className="mt-8 rounded-2xl bg-orange-50 p-5">
          <p className="font-semibold text-orange-600">
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

  const availableMembers = mockTopMatches.filter(
    (member) => !existingMemberIds.includes(member.id)
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
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">
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
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {!isAddingMembers && (
          <div className="mb-5 flex items-center gap-3 rounded-xl bg-orange-50 p-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                src={currentUser.image}
                alt={currentUser.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="font-semibold">
                {currentUser.name} (You)
              </p>
              <p className="text-sm text-orange-600">
                Group Admin
              </p>
            </div>

            <Check className="text-orange-600" size={20} />
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">People to invite</h3>
          <span className="text-sm text-gray-500">
            {selectedIds.length} selected
          </span>
        </div>

        {availableMembers.length === 0 ? (
          <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
            Everyone in the mock list is already in your group.
          </p>
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
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-100">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-gray-500">
                      {member.major || "Major not specified"}
                    </p>
                  </div>

                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                      selected
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-gray-300"
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
          <p className="mt-4 text-sm text-orange-700">
            Select at least one person to enable group creation.
          </p>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-3 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={selectedIds.length === 0}
            className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
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
  onLeaveGroup: () => void;
};

function ManageGroupModal({
  group,
  currentUserId,
  onClose,
  onTransferAdmin,
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
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Manage Group</h2>
            <p className="mt-1 text-sm text-gray-500">
              {group.members.length} members
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 rounded-2xl bg-orange-50 p-4">
          <p className="text-sm text-gray-600">Current admin</p>
          <p className="mt-1 flex items-center gap-2 font-semibold text-orange-600">
            <Crown size={17} />
            {currentAdmin?.name ?? "No admin assigned"}
            {group.adminId === currentUserId && " (You)"}
          </p>
        </div>

        <h3 className="mb-3 font-semibold">Members</h3>

        <div className="space-y-3">
          {group.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
            >
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gray-100">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {member.name}
                  {member.id === currentUserId && " (You)"}
                </p>
                <p className="text-sm text-gray-500">
                  {member.major || "Major not specified"}
                </p>
              </div>

              {member.id === group.adminId && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-600">
                  <Crown size={12} />
                  Admin
                </span>
              )}
            </div>
          ))}
        </div>

        {isAdmin && group.members.length > 1 && (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <label
              htmlFor="new-admin"
              className="mb-2 block font-semibold"
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
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
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

        <div className="mt-7 border-t border-gray-100 pt-6">
          {!showLeaveConfirmation ? (
            <button
              onClick={() => setShowLeaveConfirmation(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={16} />
              Leave Group
            </button>
          ) : (
            <div className="rounded-xl bg-red-50 p-4">
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
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    onLeaveGroup();
                    onClose();
                  }}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Leave Group
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-gray-100 px-5 py-3 font-semibold transition hover:bg-gray-200"
        >
          Done
        </button>
      </div>
    </div>
  );
}