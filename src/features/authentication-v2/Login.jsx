// // // src/features/authentication-v2/Login.jsx

// // import { useId, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { z } from "zod";
// // import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { useAuthV2 } from "./use-auth-v2";

// // const BrandLogo = ({ className }) => (
// //   <svg
// //     className={className}
// //     width="42"
// //     height="42"
// //     viewBox="0 0 24 24"
// //     fill="none"
// //     stroke="currentColor"
// //     strokeWidth="1.25"
// //     strokeLinecap="round"
// //     strokeLinejoin="round"
// //   >
// //     <path d="M4 22V10l4-3v15" />
// //     <path d="M8 22V5l4-3 4 3v17" />
// //     <path d="M16 22V10l4 3v9" />
// //   </svg>
// // );

// // const loginSchema = z.object({
// //   username: z.string().trim().min(1, "Username is required"),
// //   password: z.string().trim().min(1, "Password is required"),
// // });

// // function getErrorMessage(err) {
// //   if (!err) return null;
// //   if (typeof err === "string") return err;

// //   const rawMessage = err.message || "";
// //   if (
// //     err instanceof TypeError ||
// //     /failed to fetch|networkerror|load failed/i.test(rawMessage)
// //   ) {
// //     return "Unable to reach the server. Please check your connection and try again.";
// //   }

// //   const data = err.response?.data ?? err.data ?? err;

// //   if (typeof data === "string") return data;
// //   if (data?.message) return data.message;
// //   if (data?.error) return data.error;
// //   if (err.message) return err.message;

// //   return "Something went wrong. Please try again.";
// // }

// // export default function LoginFormV2() {
// //   const id = useId();
// //   const navigate = useNavigate();
// //   const { login, loginError, loginPending } = useAuthV2();
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [fieldErrors, setFieldErrors] = useState({});
// //   const [formError, setFormError] = useState(null);

// //   const errorMessage = formError ?? getErrorMessage(loginError);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     const username = e.target.username.value;
// //     const password = e.target.password.value;

// //     const result = loginSchema.safeParse({ username, password });

// //     if (!result.success) {
// //       const errors = {};
// //       for (const issue of result.error.issues) {
// //         errors[issue.path[0]] = issue.message;
// //       }
// //       setFieldErrors(errors);
// //       setFormError(Object.values(errors)[0]);
// //       return;
// //     }

// //     setFieldErrors({});
// //     setFormError(null);

// //     try {
// //       await login(result.data);
// //       navigate("/dashboard");
// //     } catch (_) {}
// //   };

// //   return (
// //     <div className="min-h-screen flex bg-background text-foreground selection:bg-primary/10">
      
// //       {/* ── Left panel ── */}
// //       <div className="hidden lg:flex lg:w-[42%] flex-col justify-center p-16 relative overflow-hidden bg-[#0A0A0A] dark:bg-card border-r border-border/10">
// //         <div
// //           className="absolute inset-0 pointer-events-none text-white/5 dark:text-foreground/5 opacity-80"
// //           style={{
// //             backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
// //             backgroundSize: "24px 24px",
// //           }}
// //         />

// //         <div className="relative z-10 flex flex-col gap-10 max-w-sm">
// //           <div className="flex items-center gap-3.5 text-white dark:text-foreground">
// //             <BrandLogo />
// //             <span className="font-display inline-block mt-5 font-medium tracking-[0.25em] text-lg uppercase">
// //               7Skies Riversoft
// //             </span>
// //           </div>

// //           <div>
// //             <h1 className="font-display text-white dark:text-foreground text-4xl font-bold leading-[1.12] tracking-tighter">
// //               Manage your projects with precision
// //             </h1>
// //             <p className="font-sans text-[15px] text-muted-foreground/80 dark:text-muted-foreground leading-relaxed mt-5">
// //               Intuitive tools. Real-time insights.
// //               <br />
// //               Better outcomes.
// //             </p>
// //           </div>
// //         </div>

// //         <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none bg-gradient-to-t from-[#0A0A0A] dark:from-card to-transparent" />
// //       </div>

// //       {/* ── Right panel ── */}
// //       <div className="flex-1 flex items-center justify-center px-8 py-12 bg-background">
// //         <div className="w-full max-w-[350px]">
          
// //           {/* Mobile Header */}
// //           <div className="flex lg:hidden items-center gap-3 mb-12 text-foreground">
// //             <BrandLogo />
// //             <span className="font-display font-medium tracking-[0.25em] text-xs uppercase">
// //               7Skies Riversoft
// //             </span>
// //           </div>

// //           {/* Form Heading */}
// //           <div className="mb-8">
// //             <h2 className="font-display text-3xl font-bold tracking-tight text-foreground mb-2">
// //               Welcome back
// //             </h2>
// //             <p className="font-sans text-[15px] text-muted-foreground">
// //               Log in to your account
// //             </p>
// //           </div>

// //           {/* Form */}
// //           <form onSubmit={handleSubmit} className="space-y-5" noValidate>
// //             {/* Username Input */}
// //             <div className="space-y-1.5">
// //               <Label
// //                 htmlFor={`${id}-username`}
// //                 className="font-sans text-[13px] font-medium text-muted-foreground"
// //               >
// //                 Username
// //               </Label>
// //               <Input
// //                 id={`${id}-username`}
// //                 name="username"
// //                 type="text"
// //                 placeholder="Enter your username"
// //                 autoComplete="username"
// //                 disabled={loginPending}
// //                 aria-invalid={!!fieldErrors.username}
// //                 onChange={() => {
// //                   if (fieldErrors.username || formError) {
// //                     setFieldErrors((prev) => ({ ...prev, username: undefined }));
// //                     setFormError(null);
// //                   }
// //                 }}
// //                 className="h-10 px-3.5 placeholder:text-muted-foreground/60 shadow-2xs disabled:opacity-60"
// //               />
// //               {fieldErrors.username && (
// //                 <p className="font-sans text-[12px] font-medium text-destructive">
// //                   {fieldErrors.username}
// //                 </p>
// //               )}
// //             </div>

// //             {/* Password Input */}
// //             <div className="space-y-1.5">
// //               <Label
// //                 htmlFor={`${id}-password`}
// //                 className="font-sans text-[13px] font-medium text-muted-foreground"
// //               >
// //                 Password
// //               </Label>
// //               <div className="relative">
// //                 <Input
// //                   id={`${id}-password`}
// //                   name="password"
// //                   type={showPassword ? "text" : "password"}
// //                   placeholder="Enter your password"
// //                   autoComplete="current-password"
// //                   disabled={loginPending}
// //                   aria-invalid={!!fieldErrors.password}
// //                   onChange={() => {
// //                     if (fieldErrors.password || formError) {
// //                       setFieldErrors((prev) => ({ ...prev, password: undefined }));
// //                       setFormError(null);
// //                     }
// //                   }}
// //                   className="h-10 pl-3.5 pr-10 placeholder:text-muted-foreground/60 shadow-2xs disabled:opacity-60"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowPassword((p) => !p)}
// //                   disabled={loginPending}
// //                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
// //                   tabIndex={-1}
// //                   aria-label={showPassword ? "Hide password" : "Show password"}
// //                 >
// //                   {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
// //                 </button>
// //               </div>
// //               {fieldErrors.password && (
// //                 <p className="font-sans text-[12px] font-medium text-destructive">
// //                   {fieldErrors.password}
// //                 </p>
// //               )}
// //             </div>

// //             {/* Error Message */}
// //             {!fieldErrors.username && !fieldErrors.password && errorMessage && (
// //               <div
// //                 role="alert"
// //                 className="flex items-start gap-2 rounded-[var(--radius)] border border-destructive/20 bg-destructive/10 px-3.5 py-2.5 animate-in fade-in-50 duration-200"
// //               >
// //                 <AlertCircle
// //                   size={15}
// //                   className="text-destructive shrink-0 mt-0.5"
// //                 />
// //                 <p className="font-sans text-[13px] font-medium text-destructive leading-snug">
// //                   {errorMessage}
// //                 </p>
// //               </div>
// //             )}

// //             {/* Submit Button */}
// //             <Button
// //               type="submit"
// //               className="w-full h-10 font-sans font-medium text-sm bg-primary text-primary-foreground rounded-[var(--radius)] shadow-xs transition-all duration-200 hover:bg-primary/90 hover:-translate-y-[1px] hover:shadow-xl active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none disabled:translate-y-0 disabled:shadow-xs"
// //               disabled={loginPending}
// //               aria-busy={loginPending}
// //             >
// //               {loginPending ? (
// //                 <span className="flex items-center justify-center gap-2">
// //                   <Loader2 size={15} className="animate-spin" />
// //                   Signing in…
// //                 </span>
// //               ) : (
// //                 "Log in"
// //               )}
// //             </Button>

            
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // src/features/authentication-v2/login-form-v2.jsx

// import { useId, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useAuthV2 } from "./use-auth-v2";
// // import img from "@/assets/image2.png";
// import img from "@/assets/account-image.jpeg";


// export default function LoginFormV2() {
//   const id = useId();
//   const navigate = useNavigate();
//   const { login, loginError, loginPending } = useAuthV2();
//   const [showPassword, setShowPassword] = useState(false);

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   const username = e.target.username.value.trim();
//   //   const password = e.target.password.value.trim();
//   //   try {
//   //     await login({ username, password });
//   //     navigate("/dashboard");
//   //   // eslint-disable-next-line no-empty, no-unused-vars
//   //   } catch (_) {}
//   // };

//   // Login.jsx — handleSubmit বদলাও

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   const username = e.target.username.value.trim();
//   const password = e.target.password.value.trim();
//   try {
//     // const result = await login({ username, password });
//     await login({ username, password });
//     // const roles = result?.data?.user?.roles || [];

//     // if (roles.includes("Admin")) {
//     //   navigate("/dashboard");        // Admin → dashboard
//     // } else if (roles.includes("Inventory")) {
//     //   navigate("/dashboard/welcome");          // Inventory → welcome page
//     // } else {
//     //   navigate("/unauthorized");      // fallback
//     // }
//     navigate("/dashboard");
//   } catch (_) {}
// };

//   return (
//     <div className="max-w-sm mx-auto">

//       {/* Logo & Header */}
//       <div className="flex flex-col items-center gap-2 mb-6">
//         <img
//           src={img}
//           alt="Logo"
//           width={130}
//           height={130}
//           className="object-contain"
//         />
//         <div className="text-center">
//           <h2 className="text-lg font-semibold">Welcome back</h2>
//           <p className="text-sm text-muted-foreground">
//             Enter your credentials to sign in.
//           </p>
//         </div>
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-4">

//         {/* Username */}
//         <div className="space-y-1.5">
//           <Label htmlFor={`${id}-username`}>Username</Label>
//           <Input
//             id={`${id}-username`}
//             name="username"
//             type="text"
//             placeholder="your_username"
//             autoComplete="username"
//             required
//             disabled={loginPending}
//           />
//         </div>

//         {/* Password */}
//         <div className="space-y-1.5">
//           <Label htmlFor={`${id}-password`}>Password</Label>
//           <div className="relative">
//             <Input
//               id={`${id}-password`}
//               name="password"
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter your password"
//               autoComplete="current-password"
//               required
//               disabled={loginPending}
//               className="pr-10"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((p) => !p)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//               tabIndex={-1}
//             >
//               {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//             </button>
//           </div>
//         </div>

//         {/* Error */}
//         {loginError && (
//           <p className="text-sm text-destructive">{loginError.message}</p>
//         )}

//         {/* Submit */}
//         <Button type="submit" className="w-full" disabled={loginPending}>
//           {loginPending ? "Signing in…" : "Sign in"}
//         </Button>

      
//       </form>
//     </div>
//   );
// }

// src/features/authentication-v2/login-form-v2.jsx

import { useId, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Lock, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthV2 } from "./use-auth-v2";
import logo from "@/assets/account-image.jpeg";
// Replace this with a real farm/field photo in your assets folder
// (rice paddy / tea garden works great — matches the mockup)
import fieldImage from "@/assets/hero.jpeg";

export default function LoginFormV2() {
  const id = useId();
  const navigate = useNavigate();
  const { login, loginError, loginPending } = useAuthV2();
  const [showPassword, setShowPassword] = useState(false);

  // ── functionality unchanged ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();
    try {
      await login({ username, password });
      navigate("/dashboard");
      // eslint-disable-next-line no-empty, no-unused-vars
    } catch (_) {}
  };

  return (
    <div className="min-h-screen w-full flex ">
      {/* ══════════ Left panel — field photo + brand statement ══════════ */}
      <div className="hidden lg:block relative w-[46%] p-3">
        <div className="relative h-full w-full overflow-hidden rounded-3xl">
          <img
            src={fieldImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* diamond-grid texture, echoes the mockup */}
          <div
            className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,.6) 0 1px, transparent 1px 26px), repeating-linear-gradient(-45deg, rgba(255,255,255,.6) 0 1px, transparent 1px 26px)",
            }}
          />

          {/* depth gradient so the badge + edges stay legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-emerald-950/5 to-emerald-950/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/20 via-transparent to-transparent" />

          {/* badge */}
          <div className="absolute left-15 bottom-40 right-8 max-w-sm">
            <div className="rounded-2xl border border-white/15 bg-emerald-950/40 backdrop-blur-md px-7 py-8 shadow-2xl">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                <Sprout className="h-5 w-5 text-lime-300" strokeWidth={1.75} />
              </span>
              <h2 className="mt-5 font-display text-[28px] font-extrabold uppercase leading-[1.15] tracking-tight text-white">
                Empowering
                <br />
                Sustainable
                <br />
                Agriculture
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ Right panel — form ══════════ */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px]">
          {/* Logo */}
          <div className="mb-9 flex items-center gap-3">
            <img
              src={logo}
              alt="Bangladesh Welfare Agro"
              width={44}
              height={44}
              className="rounded-full object-contain ring-1 ring-emerald-900/10"
            />
            <div className="leading-tight">
              <p className="text-[15px] font-bold text-emerald-950">
                Bangladesh
              </p>
              <p className="-mt-0.5 text-[15px] font-bold text-emerald-700">
                Welfare Agro
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-display text-[28px] font-extrabold tracking-tight text-emerald-950">
              Welcome Back
            </h1>
            <p className="mt-1.5 text-[14.5px] text-muted-foreground">
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Form — same fields, handlers & names as before */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Username */}
            <div className="space-y-1.5">
              <Label
                htmlFor={`${id}-username`}
                className="text-[13px] font-medium text-emerald-950/80"
              >
                Username
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-900/40" />
                <Input
                  id={`${id}-username`}
                  name="username"
                  type="text"
                  placeholder="name@example.com"
                  autoComplete="username"
                  required
                  disabled={loginPending}
                  className="h-11 rounded-xl border-emerald-900/15 pl-10 placeholder:text-muted-foreground/50 focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor={`${id}-password`}
                className="text-[13px] font-medium text-emerald-950/80"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-900/40" />
                <Input
                  id={`${id}-password`}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loginPending}
                  className="h-11 rounded-xl border-emerald-900/15 pl-10 pr-10 placeholder:text-muted-foreground/50 focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  disabled={loginPending}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-900/40 transition-colors hover:text-emerald-900 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="flex justify-end pt-0.5">
                <Link
                  to=""
                  className="text-[13px] font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Error */}
            {loginError && (
              <p role="alert" className="text-sm text-destructive">
                {loginError.message}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loginPending}
              aria-busy={loginPending}
              className="h-11 w-full rounded-xl bg-emerald-700 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:bg-emerald-800 hover:shadow-lg active:translate-y-0 disabled:pointer-events-none disabled:opacity-70"
            >
              {loginPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}