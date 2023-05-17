import { api } from "~/utils/api";
import Image from "next/image";
import React from "react";
import Button from "~/components/button";
import { Skeleton } from "~/components/ui/skeleton";

export default function Dating() {
  const [edit, setEdit] = React.useState(false);
  const { data, isLoading } = api.datingProfile.getAllDatingProfiles.useQuery();
  console.log(data, "data");
  
if(!data) return null

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const privatePhotos = data.map((profile)=> profile?.privatePhotos.map((photo)=> photo)).flat()
  
    const publicPhotos = data.map((profile)=> profile?.publicPhotos.map((photo)=> photo)).flat()



  console.log(privatePhotos, "privatePhotos");
    console.log(publicPhotos, "publicPhotos");

    const {bio, pronouns} = data

  
  return (
    <div>
      <h1>Dating</h1>
      <div className="flex flex-col">
       
        <div className="flex flex-col">
         
          {data.map((profile)=>(
            <div key={profile.id}>

                <p className="text-lg font-semibold">{profile.bio}</p>
                <p className="text-lg font-semibold">{profile.pronouns}</p>
                
        <div className="flex flex-col">
        <h3 className="text-2xl font-bold">Private Photos</h3>
           
{ privatePhotos.length > 0 ? (
<>

</>
):(
  <div className="flex flex-col gap-1">
  <form >
    <input type='text' name='ask' placeholder='ask for permission' />
    <Button
      type="submit"
      variant="primary_filled"
      size="small"
    >
      Ask
    </Button>

  </form>
  </div>
)}



        </div>
        </div>
          ))}
        </div>

        <div className="flex flex-col">
          <h3 className="text-2xl font-bold">Public Photos</h3>
                   {publicPhotos.map((photo) => (
              <div key={photo.id} className="flex flex-col gap-1">
                <Image
                  src={photo.imageUrl}
                  alt="profile photo"
                  width={200}
                  height={200}
                />
                <Button
                  key={photo.id}
                  variant="primary_filled"
                  size="small"
                  onClick={() => {
                    setEdit(!edit);
                  }}
                >
                  {edit ? "Save" : "Edit"}
                </Button>
              </div>
            ))}

        </div>


      </div>
    </div>
  );
}

