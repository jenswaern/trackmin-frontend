import MainLayout from "@/components/ui/MainLayout";
import { useUser } from "@/contexts/UserContext";

const Home = () => {
  const { user } = useUser();

  return (
    <MainLayout>
      {user ? (
        <div className="col-span-full flex flex-col items-center justify-center gap-y-5">
          <h1 className="text-4xl font-semibold">Trackmin</h1>
          <h2 className="text-2xl">{`Hello ${user.name}`}</h2>
          <div className="border p-5">
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
        </div>
      ) : null}
    </MainLayout>
  );
};

export default Home;
