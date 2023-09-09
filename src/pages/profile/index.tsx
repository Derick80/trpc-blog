import { useSession } from "next-auth/react";
import React, {  } from "react";
import ProfileCard from "~/components/profile-card";
import { api } from "~/utils/api";

export default function ProfileIndex() {
  const { data, isLoading } = api.user.getUserProfile.useQuery({
    id: useSession().data?.user?.id as string,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>No profile found</p>;
  }

  return (
    <div className="flex w-full flex-col gap-4 border-2 border-green-500 p-1">
      <h1 className="text-2xl font-bold  dark:text-slate-50">User Profile</h1>
      <ProfileCard user={data} />
    </div>
  );
}
