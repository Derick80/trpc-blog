import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import { api } from "~/utils/api";

export default function UserIndex() {
  const { data, isLoading } = api.user.getAllUsers.useQuery();
  if (isLoading) return <p>Loading...</p>;

  if (!data) return <p>No users found</p>;

  return (
    <div className="flex w-full flex-col gap-4  p-1">
      <h1>Users</h1>
      {data.map((user) => (
        <div
          className="w- flex flex-col items-start gap-1 rounded-md  shadow-lg drop-shadow-md"
          key={user.id}
        >
          <div className="flex items-start gap-1 p-1">
            <p className="text-sm font-semibold text-slate-50">Username:</p>
            <p className="text-sm font-semibold text-slate-50">{user.name}</p>
          </div>
          <div className="flex items-start gap-1 p-1">
            <p className="text-sm font-semibold text-slate-50">User Email:</p>
            <p className="text-sm font-semibold text-slate-50">{user.email}</p>
          </div>
          <div className="flex items-start gap-1 p-1">
            <p className="text-sm font-semibold text-slate-50">
              User Pronouns:
            </p>
            <p className="text-sm font-semibold text-slate-50">
              {user.profile?.pronouns}
            </p>
          </div>
          <div className="flex items-start gap-1 p-1">
            <p className="text-sm font-semibold text-slate-50">User Bio:</p>
            <p className="text-sm font-semibold text-slate-50">
              {user.profile?.bio}
            </p>
          </div>

          {user.profile?.profileImage && (
            <Image
              src={user.profile?.profileImage || ""}
              alt="avatar"
              width={350}
              height={200}
            />
          )}
          <Separator />
          <div className="flex flex-row gap-2 p-1">
            <p className="text-sm font-semibold text-slate-50">User Posts:</p>
            {user._count?.posts ? (
              <p className="text-sm font-semibold text-slate-50">
                {user._count?.posts}
              </p>
            ) : (
              <p className="text-sm font-semibold text-slate-50">0</p>
            )}
          </div>
          <div className="flex flex-row gap-1 p-1">
            <p className="text-sm font-semibold text-slate-50">
              User Comments:
            </p>
            {user._count?.comments && (
              <p className="text-sm font-semibold text-slate-50">
                {user._count?.comments}
              </p>
            )}
          </div>
          <div className="flex flex-row gap-1 p-1">
            <p className="text-sm font-semibold text-slate-50">
              User Comments:
            </p>
            {user._count?.comments && (
              <p className="text-sm font-semibold text-slate-50">
                {user._count?.comments}
              </p>
            )}
          </div>
          <div className="flex flex-row gap-1 p-1">
            <p className="text-sm font-semibold text-slate-50">
              User Liked Comments:
            </p>
            {user._count?.commentLikes && (
              <p className="text-sm font-semibold text-slate-50">
                {user._count?.commentLikes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
