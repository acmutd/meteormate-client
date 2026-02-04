// the discover page - dashboard we are using to make sure that all the pages of the main app are here 
export default function discover() {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Settings</h2>
      <p className="mt-2 text-sm text-gray-600">
        You’re logged in. This page is rendered inside the (app) layout, so the
        Navbar + Sidebar should always be visible.
      </p>
    </div>
  );
}
