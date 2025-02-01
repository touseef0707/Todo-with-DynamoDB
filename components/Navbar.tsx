import { signIn, signOut } from "next-auth/react";

interface NavbarProps {
  session: any; // Assuming you are passing the session from your page or layout
}

const Navbar = ({ session }: NavbarProps) => {
  return (
    <nav className="w-full bg-gradient-to-r from-purple-700 to-pink-800 p-4 text-white flex justify-between">
      <div className="text-lg">My Todo App</div>
      <div>
        {session ? (
          <div className="flex space-x-4">
            <span>Welcome, {session.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="bg-blue-700 text-white px-4 py-2 rounded"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
