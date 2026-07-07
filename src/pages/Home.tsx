import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { 
  FileSpreadsheet, 
  Search, 
  BarChart3, 
  ListOrdered, 
  Lock, 
  ShieldCheck, 
  Settings2,
  ChevronRight,
  Download
} from 'lucide-react';

export function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 text-sm font-semibold tracking-wide border border-primary/20">
            <ShieldCheck className="w-4 h-4" /> Secure Exam Analytics
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            <span className="text-primary block mb-2">Exam Insight Portal</span>
            Secure and Accurate Result Analysis
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            A web-based system for uploading Excel result sheets, filtering results by school and subject, calculating grade statistics, generating pass-rate rankings, and exporting professional reports.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8 shadow-md">
                Login to Portal <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8 bg-white">
                View Features / Learn More
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-y">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Powerful Analytics Features</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Everything you need to transform raw exam data into actionable insights with 100% accuracy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Excel Result Upload', icon: FileSpreadsheet, desc: 'Process massive raw Excel sheets directly with our structured parsing engine.' },
              { title: 'School-wise Filtering', icon: Search, desc: 'Instantly isolate and analyze performance metrics for any specific school.' },
              { title: 'Subject-wise Analysis', icon: BarChart3, desc: 'Detailed grade distributions and pass/fail statistics per subject.' },
              { title: 'Highest to Lowest Ranking', icon: ListOrdered, desc: 'Generate ranked lists of schools based on their passing percentages.' },
              { title: 'Excel/CSV Export', icon: Download, desc: 'Export formatted reports ready for presentation or archival.' },
              { title: 'Secure User Management', icon: Settings2, desc: 'Admin-controlled access ensures only authorized personnel view data.' },
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              A simple, streamlined process to get from raw data to finalized reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {[
              { step: 1, title: 'Admin creates authorized users' },
              { step: 2, title: 'User logs into the system' },
              { step: 3, title: 'User uploads Excel result sheet' },
              { step: 4, title: 'User selects school and subject' },
              { step: 5, title: 'System calculates accurate results' },
              { step: 6, title: 'User exports final reports' },
            ].map((s) => (
              <div key={s.step} className="bg-white p-6 rounded-xl border border-slate-200 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                  {s.step}
                </div>
                <p className="text-slate-800 font-medium mt-1">{s.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Access Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Restricted Access Control</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Access to this website is strictly restricted. Only users created by the system administrator can log in and utilize the system features. All data transfers are authenticated.
              </p>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <h3 className="text-xl font-bold mb-6 text-slate-100 border-b border-slate-700 pb-4">Security & Accuracy Guarantees</h3>
              <ul className="space-y-4">
                {[
                  'Password-protected login',
                  'Role-based access (Admin/User)',
                  'Server-side processing for large files',
                  '100% accurate calculation formulas',
                  'Structured Excel parsing engine',
                  'Report export support'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Need an Account Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Need an account?</h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Access to Exam Insight Portal is restricted. If you need an account, please contact the administrator using one of the methods below.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://wa.me/94763369755" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#25D366] hover:bg-[#128C7E] text-white font-medium transition-colors gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp: 0763369755
            </a>
            
            <a 
              href="mailto:amalvidu20@gmail.com?subject=Account%20Request%20for%20Exam%20Insight%20Portal"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-medium transition-colors gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="M2 4l10 8 10-8"></path></svg>
              Email: amalvidu20@gmail.com
            </a>
            
            <a 
              href="https://www.linkedin.com/in/amal-viduranga-3a681b27b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#0077b5] hover:bg-[#006396] text-white font-medium transition-colors gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn: Amal Viduranga
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  );
}
