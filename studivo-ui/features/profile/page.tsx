"use client";

import React, { useState, useEffect } from "react";
import Header from "@/shared/components/header";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useAuthStore } from "@/shared/store/auth.store";
import axiosInstance from "@/shared/APIs/axiosInstance";
import { User, Mail, Phone, GraduationCap, Lock, Camera, CheckCircle2, AlertCircle, Loader2, KeyRound, ShieldCheck, Upload, Trash2, AlertTriangle, X } from "lucide-react";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
];

export default function ProfilePage() {
  const { t, lang } = useTranslation();
  const currentUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);


  // Profile details state
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [university, setUniversity] = useState(currentUser?.university || "");
  const [profileImage, setProfileImage] = useState(currentUser?.profileImage || "");

  // Password update state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Account Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Feedback states
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.phone || "");
      setUniversity(currentUser.university || "");
      setProfileImage(currentUser.profileImage || "");
    }
  }, [currentUser]);

  // Handle Local Image File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      setProfileMessage(null);
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await axiosInstance.post("/auth/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = res.data?.data?.url || res.data?.url;
      if (uploadedUrl) {
        setProfileImage(uploadedUrl);
        setProfileMessage({
          type: "success",
          text: lang === "ar" ? "تم رفع الصورة على السيرفر بنجاح! اضغط حفظ التغييرات لتثبيتها." : "Image uploaded to server successfully! Click save changes to apply.",
        });
      }
    } catch (err: any) {
      setProfileMessage({
        type: "error",
        text: err?.response?.data?.message || (lang === "ar" ? "فشل رفع الصورة على السيرفر" : "Failed to upload avatar"),
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    try {
      setIsSavingProfile(true);
      const res = await axiosInstance.patch("/auth/profile", {
        name,
        email,
        phone,
        university,
        profileImage,
      });

      const updatedUser = res.data?.data || res.data;
      if (updatedUser) {
        setUser(updatedUser);
      }
      setProfileMessage({
        type: "success",
        text: lang === "ar" ? "تم تحديث البيانات الشخصية بنجاح!" : "Profile updated successfully!",
      });
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || (lang === "ar" ? "فشل تحديث البيانات" : "Failed to update profile");
      setProfileMessage({ type: "error", text: errMsg });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const isGoogleOnly = currentUser?.isGoogleUser && !currentUser?.hasPassword;

  // Handle Password Update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: lang === "ar" ? "كلمة المرور الجديدة غير متطابقة" : "New passwords do not match",
      });
      return;
    }

    try {
      setIsSavingPassword(true);
      const payload: Record<string, string> = { newPassword };
      // Only send currentPassword if the user already has one set
      if (!isGoogleOnly && currentPassword) {
        payload.currentPassword = currentPassword;
      }
      await axiosInstance.patch("/auth/profile", payload);

      setPasswordMessage({
        type: "success",
        text: isGoogleOnly
          ? (lang === "ar" ? "تم إنشاء كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول بالإيميل والباسورد أيضاً." : "Password created successfully! You can now also login with email & password.")
          : (lang === "ar" ? "تم تغيير كلمة المرور بنجاح!" : "Password updated successfully!"),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Refresh user data to update hasPassword
      try {
        const meRes = await axiosInstance.get("/auth/me");
        const meData = meRes.data?.data || meRes.data;
        if (meData) setUser(meData);
      } catch {}
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || (lang === "ar" ? "كلمة المرور الحالية غير صحيحة" : "Current password incorrect");
      setPasswordMessage({ type: "error", text: errMsg });
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Handle Cascade Delete Account
  const handleDeleteAccount = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setDeleteMessage(null);
    try {
      setIsDeletingAccount(true);
      const data = isGoogleOnly
        ? { confirm: true }
        : { password: deletePassword };
      await axiosInstance.delete("/auth/account", { data });

      logout();
      window.location.href = "/auth/login";

    } catch (err: any) {
      setDeleteMessage(err?.response?.data?.message || (lang === "ar" ? "كلمة المرور غير صحيحة أو تعذر حذف الحساب" : "Failed to delete account"));
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-4xl mx-auto">
      <Header
        title={lang === "ar" ? "إعدادات الملف الشخصي" : "Profile Settings"}
        description={lang === "ar" ? "إدارة وتحديث بيانات حسابك الشخصي، الصورة، كلمة المرور وإمكانية حذف الحساب بالكامل" : "Manage your profile details, avatar file uploads, password, and account deletion"}
      />

      {/* 👤 Avatar & Quick Info Header Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 dark:from-[#131b2e] dark:to-[#0d1322] border border-slate-200/20 dark:border-slate-800 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6 text-center md:text-start">
        <div className="relative group shrink-0">
          <img
            src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=fff&color=3b82f6`}
            alt={name}
            className="w-24 h-24 md:w-28 md:h-28 rounded-3xl object-cover border-4 border-white/30 shadow-lg group-hover:scale-105 transition-transform"
          />
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <h2 className="text-2xl md:text-3xl font-black">{name || "المستخدم"}</h2>
            <span className="bg-white/20 dark:bg-indigo-950/80 text-white dark:text-[#fff4b7] text-xs font-bold px-3 py-1 rounded-full border border-white/30 dark:border-indigo-500/40 uppercase">
              {currentUser?.role === "seller" ? (lang === "ar" ? "بائع معتمد" : "Verified Seller") : (lang === "ar" ? "طالب" : "Student")}
            </span>
          </div>
          <p className="text-blue-100 dark:text-slate-300 text-xs md:text-sm font-medium flex items-center justify-center md:justify-start gap-1.5">
            <Mail className="w-4 h-4 opacity-75" />
            <span>{email}</span>
          </p>
          {university && (
            <p className="text-blue-100 dark:text-slate-400 text-xs font-medium flex items-center justify-center md:justify-start gap-1.5">
              <GraduationCap className="w-4 h-4 opacity-75" />
              <span>{university}</span>
            </p>
          )}
        </div>
      </div>

      {/* 🖼️ Avatar Upload & Selection Panel */}
      <div className="p-6 md:p-7 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Camera className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
              {lang === "ar" ? "الصورة الشخصية والرفع على السيرفر" : "Profile Avatar & Upload"}
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          {/* File Upload Button */}
          <div className="p-4 rounded-2xl border-2 border-dashed border-blue-200 dark:border-indigo-500/30 bg-blue-50/50 dark:bg-indigo-950/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                {isUploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">
                  {lang === "ar" ? "ارفع صورتك الشخصية من جهازك" : "Upload avatar from your device"}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {lang === "ar" ? "سيتم تخزين الصورة وتوليد رابط خاص على داتابيز السيرفر (Max 5MB)" : "Image will be stored on server disk & synced with DB (Max 5MB)"}
                </p>
              </div>
            </div>

            <label className="px-5 py-2.5 rounded-xl bg-blue-600 dark:bg-[#fff4b7] text-white dark:text-[#060913] font-bold text-xs shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer shrink-0 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>{isUploadingImage ? (lang === "ar" ? "جاري الرفع..." : "Uploading...") : (lang === "ar" ? "اختيار صورة" : "Choose File")}</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploadingImage} className="hidden" />
            </label>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {lang === "ar" ? "أو اختر صورة تعبيرية جاهزة:" : "Or choose a preset avatar:"}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {AVATAR_PRESETS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setProfileImage(url)}
                  className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    profileImage === url ? "border-blue-600 dark:border-[#fff4b7] scale-110 shadow-md" : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 📝 Main Details Form */}
      <form onSubmit={handleUpdateProfile} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <User className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
          <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
            {lang === "ar" ? "البيانات الشخصية العامة" : "General Personal Details"}
          </h3>
        </div>

        {profileMessage && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs md:text-sm font-bold ${
            profileMessage.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
          }`}>
            {profileMessage.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{profileMessage.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
              {lang === "ar" ? "الاسم بالكامل" : "Full Name"}
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full ps-10 pe-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-xs md:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600 font-medium"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
              {lang === "ar" ? "البريد الإلكتروني" : "Email Address"}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full ps-10 pe-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-xs md:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600 font-medium"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
              {lang === "ar" ? "رقم الهاتف" : "Phone Number"}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010XXXXXXXX"
                className="w-full ps-10 pe-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-xs md:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600 font-medium"
              />
            </div>
          </div>

          {/* University */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
              {lang === "ar" ? "الجامعة" : "University"}
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder={lang === "ar" ? "جامعة المنصورة، القليوبية..." : "Mansoura University..."}
                className="w-full ps-10 pe-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-xs md:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600 font-medium"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSavingProfile}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#fff4b7] dark:to-amber-300 text-white dark:text-[#060913] font-black text-xs md:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{lang === "ar" ? "حفظ التغييرات" : "Save Changes"}</span>}
          </button>
        </div>
      </form>

      {/* 🔐 Password Security Update Form */}
      <form onSubmit={handleUpdatePassword} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
          <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
            {isGoogleOnly
              ? (lang === "ar" ? "إنشاء كلمة مرور (مسجل بحساب Google)" : "Create Password (Google Account)")
              : (lang === "ar" ? "تغيير كلمة المرور والأمان" : "Security & Password Update")}
          </h3>
        </div>

        {/* Google-only info banner */}
        {isGoogleOnly && (
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </div>
            <div>
              <p className="text-xs md:text-sm font-bold text-blue-700 dark:text-blue-300">
                {lang === "ar" ? "حسابك مسجل عبر Google" : "Your account is linked via Google"}
              </p>
              <p className="text-[11px] text-blue-600/70 dark:text-blue-400/70 font-medium mt-0.5">
                {lang === "ar"
                  ? "يمكنك إنشاء كلمة مرور للتمكن من تسجيل الدخول بالإيميل والباسورد أيضاً بجانب Google."
                  : "Create a password to also login with email & password alongside Google."}
              </p>
            </div>
          </div>
        )}

        {passwordMessage && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs md:text-sm font-bold ${
            passwordMessage.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
          }`}>
            {passwordMessage.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{passwordMessage.text}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Current Password — only show if user already has a password */}
          {!isGoogleOnly && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                {lang === "ar" ? "كلمة المرور الحالية" : "Current Password"}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full ps-10 pe-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-xs md:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600 font-medium"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                {isGoogleOnly
                  ? (lang === "ar" ? "كلمة المرور الجديدة" : "New Password")
                  : (lang === "ar" ? "كلمة المرور الجديدة" : "New Password")}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={lang === "ar" ? "8 أحرف على الأقل" : "Min 8 characters"}
                  className="w-full ps-10 pe-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-xs md:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600 font-medium"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                {lang === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={lang === "ar" ? "أعد كتابة كلمة المرور" : "Re-enter password"}
                  className="w-full ps-10 pe-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-xs md:text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSavingPassword}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-[#fff4b7] dark:to-amber-300 text-white dark:text-[#060913] font-black text-xs md:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSavingPassword
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <span>{isGoogleOnly ? (lang === "ar" ? "إنشاء كلمة المرور" : "Create Password") : (lang === "ar" ? "تحديث كلمة المرور" : "Update Password")}</span>}
          </button>
        </div>
      </form>

      {/* ⚠️ Danger Zone: Account Deletion */}
      <div className="p-6 md:p-8 rounded-3xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 dark:border-rose-500/30 space-y-4">
        <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <h3 className="text-base md:text-lg font-bold">
            {lang === "ar" ? "منطقة الخطر: حذف الحساب بالكامل" : "Danger Zone: Delete Account Permanently"}
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {lang === "ar"
            ? "عند حذف الحساب، سيتم مسح كافة البيانات المرتبطة بك كلياً من قاعدة البيانات بشكل نهائي، بما في ذلك جميع الطلبات، العروض، المحادثات، والرسائل. لا يمكن التراجع عن هذا الإجراء."
            : "Deleting your account will permanently wipe all your data from the database, including requests, offers, conversations, and messages. This action cannot be undone."}
        </p>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3 rounded-2xl bg-rose-600 text-white font-bold text-xs md:text-sm shadow-md hover:bg-rose-700 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{lang === "ar" ? "حذف الحساب بالكامل" : "Delete Account Permanently"}</span>
          </button>
        </div>
      </div>

      {/* 🚨 Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 md:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-5 end-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800/40">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {lang === "ar" ? "هل أنت متأكد من حذف الحساب؟" : "Are you sure you want to delete your account?"}
              </h3>
              <p className="text-xs text-rose-500 font-bold leading-relaxed">
                {lang === "ar"
                  ? "سيتم مسح كافة طلباتك، عروضك، ومحادثاتك بالكامل ولن تمكن من استعادتها مرة أخرى!"
                  : "All your requests, offers, and chat history will be permanently deleted from the database!"}
              </p>
            </div>

            {deleteMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold text-center">
                {deleteMessage}
              </div>
            )}

            {isGoogleOnly ? (
              /* Google-only user: simple Yes/No confirmation */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  </div>
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                    {lang === "ar"
                      ? "حسابك مسجل عبر Google، لذلك لا تحتاج لإدخال كلمة مرور. فقط اضغط \"نعم، احذف حسابي\" للتأكيد."
                      : "Your account is linked via Google, so no password is needed. Just click \"Yes, Delete My Account\" to confirm."}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs md:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    {lang === "ar" ? "لا، إلغاء" : "No, Cancel"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAccount()}
                    disabled={isDeletingAccount}
                    className="flex-1 py-3.5 rounded-2xl bg-rose-600 text-white font-black text-xs md:text-sm shadow-md hover:bg-rose-700 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isDeletingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{lang === "ar" ? "نعم، احذف حسابي" : "Yes, Delete My Account"}</span>}
                  </button>
                </div>
              </div>
            ) : (
              /* Normal user: require password */
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 text-start">
                    {lang === "ar" ? "أدخل كلمة المرور للتأكيد:" : "Enter your password to confirm:"}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full ps-10 pe-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060913] text-xs md:text-sm text-slate-900 dark:text-white outline-none focus:border-rose-600 font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs md:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    {lang === "ar" ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={isDeletingAccount}
                    className="flex-1 py-3 rounded-2xl bg-rose-600 text-white font-black text-xs md:text-sm shadow-md hover:bg-rose-700 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isDeletingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{lang === "ar" ? "حذف نهائي" : "Permanently Delete"}</span>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
