// the discover page - dashboard we are using to make sure that all the pages of the main app are here 
export default function matches() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Matches</h2>
      <p className="mt-2 text-sm text-gray-600">
        You’re logged in. This page is rendered inside the (app) layout, so the
        Navbar + Sidebar should always be visible. 
        Here I was thinking we can show the users that liked their profile and then they can go through the profiles to be roommate with or not
      </p>
    </div>
  );
}
