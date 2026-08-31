"use client";

import Modal from "@/components/common/Modal";
import { useUI } from "./UIProvider";
import { authModals } from "@/data/siteContent";

export default function AuthModals() {
  const { open, openPanel, closePanel } = useUI();
  const { login, register, lostPassword } = authModals;

  return (
    <>
      <Modal open={!!open.login} onClose={() => closePanel("login")}>
        <h3 className="font-heading text-2xl">{login.title}</h3>
        <p className="mt-2 text-sm text-body">
          {login.switchText}{" "}
          <button
            type="button"
            className="underline"
            onClick={() => openPanel("register")}
          >
            {login.switchCta}
          </button>{" "}
          for free
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-1">
            <label htmlFor="ip_user_login" className="text-sm">
              {login.usernameLabel}
            </label>
            <input
              id="ip_user_login"
              type="text"
              placeholder={login.usernamePlaceholder}
              className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="ip_password" className="text-sm">
              {login.passwordLabel}
            </label>
            <input
              id="ip_password"
              type="password"
              placeholder={login.passwordPlaceholder}
              className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" /> {login.rememberLabel}
            </label>
            <button
              type="button"
              className="underline"
              onClick={() => openPanel("lostPassword")}
            >
              {login.forgotLabel}
            </button>
          </div>
          <button
            type="submit"
            className="mt-2 bg-black py-3 text-sm uppercase tracking-wide text-white hover:bg-primary"
          >
            {login.submitLabel}
          </button>
        </form>
      </Modal>

      <Modal open={!!open.register} onClose={() => closePanel("register")}>
        <h3 className="font-heading text-2xl">{register.title}</h3>
        <p className="mt-2 text-sm text-body">
          {register.switchText}{" "}
          <button type="button" className="underline" onClick={() => openPanel("login")}>
            {register.switchCta}
          </button>
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-1">
              <label htmlFor="ip_reg_first_name" className="text-sm">
                {register.firstNameLabel}
              </label>
              <input
                id="ip_reg_first_name"
                type="text"
                className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <label htmlFor="ip_reg_last_name" className="text-sm">
                {register.lastNameLabel}
              </label>
              <input
                id="ip_reg_last_name"
                type="text"
                className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="ip_reg_email" className="text-sm">
              {register.emailLabel}
            </label>
            <input
              id="ip_reg_email"
              type="email"
              className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
            />
            <p className="text-xs text-text-light">{register.emailHelp}</p>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" /> {register.acceptLabel}
          </label>
          <button
            type="submit"
            className="mt-2 bg-black py-3 text-sm uppercase tracking-wide text-white hover:bg-primary"
          >
            {register.submitLabel}
          </button>
        </form>
      </Modal>

      <Modal open={!!open.lostPassword} onClose={() => closePanel("lostPassword")}>
        <h3 className="font-heading text-2xl">{lostPassword.title}</h3>
        <p className="mt-2 text-sm text-body">
          {lostPassword.description}{" "}
          {lostPassword.switchText}{" "}
          <button type="button" className="underline" onClick={() => openPanel("login")}>
            {lostPassword.switchCta}
          </button>
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-1">
            <label htmlFor="lost_password_user_login" className="text-sm">
              {lostPassword.usernameLabel}
            </label>
            <input
              id="lost_password_user_login"
              type="text"
              placeholder={lostPassword.usernamePlaceholder}
              className="border border-border-form px-3 py-2 focus:border-black focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="mt-2 bg-black py-3 text-sm uppercase tracking-wide text-white hover:bg-primary"
          >
            {lostPassword.submitLabel}
          </button>
        </form>
      </Modal>
    </>
  );
}
