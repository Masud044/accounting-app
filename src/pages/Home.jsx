import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
           
           <img src="data:image/png;base64,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" alt="img"  width={170} height={170} />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                Sign In
              </button>
            </Link>
            <Link to="/register">
              <button className="px-4 py-2 bg-[#d28764] text-white rounded-lg hover:bg-[#d28764] transition">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Modern Accounting Management
            <br />
            <span className="text-[#02094c]">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Streamline your account processes with our comprehensive platform. 
            Manage employees, track performance, and boost team productivity all in one place.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register">
              <button className="h-12 px-8 bg-[#d28764] text-white rounded-lg font-medium hover:bg-[#d28764] transition">
                Start Free Trial
              </button>
            </Link>
            <Link to="/login">
              <button className="h-12 px-8 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Employee Management</h3>
            <p className="text-gray-600">
              Comprehensive employee profiles, document management, and organizational structure tracking.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
            <p className="text-gray-600">
              Real-time dashboards and insights to track team performance and individual growth metrics.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600">
              Enhanced communication tools, recognition systems, and collaborative workspace management.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white shadow-lg rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to transform your account processes?
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of companies already using our Accounting platform to manage their workforce efficiently.
            </p>
            <Link to="/register">
              <button className="h-12 px-8 bg-[#d28764] text-white rounded-lg font-medium hover:bg-[#d28764] transition">
                Create Your Account
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
