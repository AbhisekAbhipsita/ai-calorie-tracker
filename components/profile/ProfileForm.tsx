"use client";

interface Profile {
  full_name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  activity_level: string;
  calorie_goal: string;
}

interface Props {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  saveProfile: () => void;
}

export default function ProfileForm({
  profile,
  setProfile,
  saveProfile,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-lg">

      <h2 className="mb-8 text-2xl font-bold text-white">
        Edit Profile
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Full Name */}

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Full Name
          </label>

          <input
            value={profile.full_name}
            onChange={(e) =>
              setProfile({
                ...profile,
                full_name: e.target.value,
              })
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-emerald-500"
          />
        </div>

        {/* Age */}

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Age
          </label>

          <input
            type="number"
            value={profile.age}
            onChange={(e) =>
              setProfile({
                ...profile,
                age: e.target.value,
              })
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-emerald-500"
          />
        </div>

        {/* Gender */}

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Gender
          </label>

          <select
            value={profile.gender}
            onChange={(e) =>
              setProfile({
                ...profile,
                gender: e.target.value,
              })
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-emerald-500"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Activity */}

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Activity Level
          </label>

          <select
            value={profile.activity_level}
            onChange={(e) =>
              setProfile({
                ...profile,
                activity_level: e.target.value,
              })
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-emerald-500"
          >
            <option value="">Choose Activity</option>
            <option>Sedentary</option>
            <option>Lightly Active</option>
            <option>Moderately Active</option>
            <option>Very Active</option>
            <option>Extremely Active</option>
          </select>
        </div>

        {/* Height */}

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Height (cm)
          </label>

          <input
            type="number"
            value={profile.height}
            onChange={(e) =>
              setProfile({
                ...profile,
                height: e.target.value,
              })
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-emerald-500"
          />
        </div>

        {/* Weight */}

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Current Weight (kg)
          </label>

          <input
            type="number"
            value={profile.weight}
            onChange={(e) =>
              setProfile({
                ...profile,
                weight: e.target.value,
              })
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-emerald-500"
          />
        </div>

        {/* Goal */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-400">
            Daily Calorie Goal
          </label>

          <input
            type="number"
            value={profile.calorie_goal}
            onChange={(e) =>
              setProfile({
                ...profile,
                calorie_goal: e.target.value,
              })
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-emerald-500"
          />
        </div>

      </div>

      <button
        onClick={saveProfile}
        className="mt-8 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 py-4 text-lg font-bold text-white transition hover:scale-[1.02]"
      >
        Save Profile
      </button>

    </section>
  );
}